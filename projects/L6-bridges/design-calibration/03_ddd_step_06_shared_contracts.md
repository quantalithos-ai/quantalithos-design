# L6-bridges 03 Step6：Contracts对象卡

> 主入口：[Step6](03_ddd_step_06_object_contracts.md)。Contracts及后续模块所需shared补充已写入，当前接受X跨审。下列是Rust-facing设计声明，不是源码或测试。路径沿Step4；新增support名在本Step明确归属，不增加业务主语。

## 1. 基础卡纪律

每卡独立给shape、字段来源、factory/member完整签名。表中函数注释列是未来声明的中文Rustdoc；源码实现时转英文。无成员/工厂明确写无，不隐藏构造入口。`ContractViolation`是结构错误，不是权限裁决。所有字段代码默认private，表中指出读取/构造责任；Step8闭合serde和custom decode，不允许derive Deserialize绕factory。

X补充的具名只读消费面是当前对象契约的一部分：跨crate/兄弟模块只借用原typed字段，不读private字段、不新增mutable getter或通用into_raw。返回引用受self借用约束，不授current资格或披露权；不能由getter为日志/证据派生材料。既有tuple newtype继续各卡token/value/authority/summary等专门读取面，不新增第二representation。

`SafeAuthorityRef`是来源引用的本地结构，不是可自签名的能力token。每种wrapper只能由已绑定的正式port结果转换或安全store重建，Step7必须提供解引用/current重新核验读取面。公开输入即使形状合法也无资格；版本/期限/撤销不明fail-closed。ref不得包含raw正文、token、secret、私有URL、callback上下文、raw error、可还原派生或raw-body hash。

### LocalObjectId
归属`shared/locators.rs`；capability：标识本地安全记录。
```rust
/// 本地对象的不可复用标识，不由业务正文或外部ID推导。
pub struct LocalObjectId([u8; 16]);
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| 0 | `[u8; 16]` | Application技术id source生成；全零拒绝；store原值重建，非平台ID |

| 函数签名 | 中文Rustdoc / 参数 / 返回 / 副作用 |
|---|---|
| `pub fn from_generated(value: [u8; 16]) -> Result<Self, ContractViolation>` | /// 接纳已生成或已存标识；结构校验不生成ID |
| `pub fn bytes(&self) -> &[u8; 16]` | /// 读取原标识；不提供权限 |
factory覆盖唯一字段；随机/UUID算法及provider在Step7/14核验，不在Domain/API/仓库save内mint。

### SafeOpaqueId
归属`shared/authority.rs`；capability：持有已证body-free的外部指针。
```rust
/// 正式来源提供的opaque引用文本，不能承载自由文本或凭证。
pub struct SafeOpaqueId(String);
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| 0 | `String` | 可信decoder输入；非空、无控制字符、原值保留；每source长度界限到Step7/14，不从raw材料拼接 |

| 函数签名 | 中文Rustdoc / 参数 / 返回 / 副作用 |
|---|---|
| `pub fn from_safe_source(value: String) -> Result<Self, ContractViolation>` | /// 结构接纳safe pointer；来源责任不由字符串验证替代 |
| `pub fn as_str(&self) -> &str` | /// 只读取指针；未经可见性不能日志或返回 |
无Display/Debug默认；任意用户String不是qualified来源。factory覆盖唯一字段。

### SafeRevision
归属`shared/authority.rs`。
```rust
/// 来源定义的版本标签，仅可同来源判等，不暗含数值顺序。
pub struct SafeRevision(SafeOpaqueId);
```
| 字段 | 类型 | 来源 / 约束 |
|---|---|---|
| 0 | `SafeOpaqueId` | owner/platform/provider正式版本；不以ts/cursor/config revision替代 |

| 函数签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn from_source(value: SafeOpaqueId) -> Self` | /// 保留来源版本，不比较先后 |
| `pub fn value(&self) -> &SafeOpaqueId` | /// 读取版本，仅判等 |

### SafeInstant
归属`shared/authority.rs`。
```rust
/// 受信时钟的UTC毫秒时刻，只作期限判断，不作业务顺序或幂等身份。
pub struct SafeInstant(u64);
```
| 字段 | 类型 | 来源 / 约束 |
|---|---|---|
| 0 | `u64` | Application注入受信clock；UTC Unix毫秒，来源时钟不合格阻IO |

| 函数签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn from_trusted_clock(unix_millis: u64) -> Self` | /// 接纳时刻，不读取wall clock |
| `pub fn millis(&self) -> u64` | /// 读取时刻，不推进cursor |

### SafeValidityWindow
归属`shared/authority.rs`。
```rust
/// 显式有限有效窗口；右端不包含，到期立即拒绝。
pub struct SafeValidityWindow {
    /// 正式来源规定的有效起点。
    not_before: SafeInstant,
    /// 正式来源规定的截止时刻。
    expires_at: SafeInstant,
}
```
| 字段 | 类型 | 来源 / 约束 |
|---|---|---|
| not_before | `SafeInstant` | owner/资格provider结果，必须小于expires_at |
| expires_at | `SafeInstant` | 同来源期限，不能由config放宽；不允许无限默认 |

| 函数签名 | 中文Rustdoc / 参数 / 返回 / 副作用 |
|---|---|
| `pub fn new(not_before: SafeInstant, expires_at: SafeInstant) -> Result<Self, ContractViolation>` | /// 校验窗口并完整复制两字段 |
| `pub fn contains(&self, now: SafeInstant) -> bool` | /// 判断左闭右开窗口；不读时钟/延长期限 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn not_before(&self) -> &SafeInstant` | /// 借用原not_before字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn expires_at(&self) -> &SafeInstant` | /// 借用原expires_at字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |


### SafeOwnerKind
归属`shared/authority.rs`；分类不是新truth owner。
```rust
/// 指针的实际来源责任方，不能把所有权限统一归Governance。
pub enum SafeOwnerKind {
    /// 会话正式来源。
    Conversation,
    /// AI身份锚点来源，不是human认证。
    Identity,
    /// 治理决定或披露依据来源。
    Governance,
    /// 制品准入或附件引用来源。
    Artifact,
    /// 条件工作区安全读取来源。
    Workspace,
    /// 安全材料消费与准入来源。
    Observability,
    /// 经验证的平台协议来源。
    Platform,
    /// 正式认证与授权入口来源。
    SecurityBoundary,
    /// 合格secret provider，仅输出引用。
    SecretProvider,
    /// 受权配置来源。
    Configuration,
    /// 本地事务或claim权威来源。
    LocalStore,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Conversation | 会话正式来源 | 不适用，分类 | 不适用 |
| Identity | AI身份锚点来源，不是human认证 | 不适用 | 不适用 |
| Governance | 治理决定或披露依据来源 | 不适用 | 不适用 |
| Artifact | 制品准入或附件引用来源 | 不适用 | 不适用 |
| Workspace | 条件工作区安全读取来源 | 不适用 | 不适用 |
| Observability | 安全材料消费与准入来源 | 不适用 | 不适用 |
| Platform | 经验证的平台协议来源 | 不适用 | 不适用 |
| SecurityBoundary | 正式认证与授权入口来源 | 不适用 | 不适用 |
| SecretProvider | 合格secret provider，仅输出引用 | 不适用 | 不适用 |
| Configuration | 受权配置来源 | 不适用 | 不适用 |
| LocalStore | 本地事务或claim权威来源 | 不适用 | 不适用 |
成员无；工厂为exact variant，不允许UnknownOwner或字符串fallback。

### SafeScopeRef
归属`shared/authority.rs`。
```rust
/// 正式scope指针及版本；本仓不定义Project/Workspace权限truth。
pub struct SafeScopeRef {
    /// scope拥有方。
    owner: SafeOwnerKind,
    /// owner提供的exact scope kind。
    kind: SafeOpaqueId,
    /// owner提供的scope标识。
    id: SafeOpaqueId,
    /// scope解析依据版本。
    revision: SafeRevision,
}
```
| 字段 | 类型 | 来源 / 约束 |
|---|---|---|
| owner | `SafeOwnerKind` | 正式scope resolver，不从location/body推断 |
| kind | `SafeOpaqueId` | source registry已绑定的exact kind，未知拒绝，不自由扩展 |
| id | `SafeOpaqueId` | owning resolver结果，非裸ref字符串反推 |
| revision | `SafeRevision` | 同resolver正式版本 |

| 函数签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn from_resolver(owner: SafeOwnerKind, kind: SafeOpaqueId, id: SafeOpaqueId, revision: SafeRevision) -> Result<Self, ContractViolation>` | /// 完整接纳scope四字段，只验结构 |
| `pub fn same_scope(&self, other: &Self) -> bool` | /// 比较owner/kind/id/revision；不证明visibility |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn owner(&self) -> &SafeOwnerKind` | /// 借用原owner字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn kind(&self) -> &SafeOpaqueId` | /// 借用原kind字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn id(&self) -> &SafeOpaqueId` | /// 借用原id字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn revision(&self) -> &SafeRevision` | /// 借用原revision字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |


### SafeAuthoritySourceRef
归属`shared/authority.rs`。
```rust
/// 已绑定来源合同的指针，用于当前资格解引用，不保存source材料。
pub struct SafeAuthoritySourceRef {
    /// 真实来源责任方。
    owner: SafeOwnerKind,
    /// exact contract或adapter/method绑定身份。
    source_id: SafeOpaqueId,
    /// 来源合同或能力版本。
    revision: SafeRevision,
}
```
| 字段 | 类型 | 来源 / 约束 |
|---|---|---|
| owner | `SafeOwnerKind` | qualification adapter固定映射，不能从query结果猜 |
| source_id | `SafeOpaqueId` | 正式contract registry或qualified adapter binding，无URL/token |
| revision | `SafeRevision` | 同来源版本 |

| 函数签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn from_binding(owner: SafeOwnerKind, source_id: SafeOpaqueId, revision: SafeRevision) -> Result<Self, ContractViolation>` | /// 校验并复制三字段，不注册新来源 |
| `pub fn owner(&self) -> &SafeOwnerKind` | /// 读取来源分类，不授权 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn source_id(&self) -> &SafeOpaqueId` | /// 借用原source_id字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn revision(&self) -> &SafeRevision` | /// 借用原revision字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |


### SafeKindTag
归属`shared/authority.rs`。
```rust
/// 本Stepauthority-bearing卡及具名proof参数的exact kind，不允许任意字符串。
pub struct SafeKindTag(String);
```
| 字段 | 类型 | 来源 / 约束 |
|---|---|---|
| 0 | `String` | 唯一allowlist为本Step具名wrapper，以及struct字段/enum载荷/具名proof参数实际使用SafeAuthorityRef的具体卡完整类型名；exact，不加Unknown或空标签 |

| 函数签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn from_registered_name(value: String) -> Result<Self, ContractViolation>` | /// 对照本Step有限named wrapper集合，未知拒绝 |
| `pub fn as_str(&self) -> &str` | /// 读取exact tag，无解析业务权限 |
注册表覆盖本StepContracts/Application/Infra/entry各明确authority-bearing卡；enum OwnerRequiredDigestRefSlot和方法proof参数ProtocolAckExecution/PlatformSourceSession也精确注册。pure local ref/容器不得扩kind；tag仅本地source映射，不发明foreign kind/API；Step7逐标签绑定。

### SafeAuthorityRef
归属`shared/authority.rs`。
```rust
/// body-free来源指针；不能凭此结构宣称当前可执行。
pub struct SafeAuthorityRef {
    /// 来源提供的opaque身份。
    id: SafeOpaqueId,
    /// 本地named wrapper exact kind。
    kind: SafeKindTag,
    /// 本次依据覆盖的正式scope。
    scope: SafeScopeRef,
    /// 正式来源合同和版本。
    source: SafeAuthoritySourceRef,
    /// 被引用依据的精确版本。
    revision: SafeRevision,
    /// 被引用依据的有限期限。
    validity: SafeValidityWindow,
}
```
| 字段 | 类型 | 来源 / 约束 |
|---|---|---|
| id | `SafeOpaqueId` | owning port结果；不生成假凭据 |
| kind | `SafeKindTag` | decoder对目标wrapper固定标签；wrong-kind拒绝 |
| scope | `SafeScopeRef` | 同来源resolver，不从id推scope |
| source | `SafeAuthoritySourceRef` | 同qualified binding；源owner不明阻断 |
| revision | `SafeRevision` | 正式当前依据版本，旧值只作历史 |
| validity | `SafeValidityWindow` | source实际有限期限；撤销另由当前port查询，缓存未过期不证明未撤销 |

| 函数签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn from_source(id: SafeOpaqueId, kind: SafeKindTag, scope: SafeScopeRef, source: SafeAuthoritySourceRef, revision: SafeRevision, validity: SafeValidityWindow) -> Result<Self, ContractViolation>` | /// 完整结构构造；不证明source资格或授权 |
| `pub fn assert_kind(&self, expected: &SafeKindTag) -> Result<(), ContractViolation>` | /// exact-kind校验，不反推外部truth |
| `pub fn within_window(&self, now: SafeInstant) -> bool` | /// 局部期限预检，不代current/revoke核验 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn id(&self) -> &SafeOpaqueId` | /// 借用原id字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn kind(&self) -> &SafeKindTag` | /// 借用原kind字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn scope(&self) -> &SafeScopeRef` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn source(&self) -> &SafeAuthoritySourceRef` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn revision(&self) -> &SafeRevision` | /// 借用原revision字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |


### QualificationSlot<T>
归属`shared/outcomes.rs`。
```rust
/// 同一资格字段的缺失、已建立和失效状态；Established仍需当前来源核验。
pub enum QualificationSlot<T> {
    /// 尚未建立引用，载荷是有限缺口原因。
    Missing(SafeReasonCode),
    /// 已有结构合法引用，载荷不是永久授权。
    Established(T),
    /// 原引用已失效，保留历史值与有限原因。
    Stale { value: T, reason: SafeReasonCode },
}
```
| 变体 | Rustdoc注释 / 载荷 | 允许来源 | 允许去向 |
|---|---|---|---|
| Missing | 尚未建立引用，有限原因 | factory/正式缺口 | 仅所属对象允许方法可建立；不能默认补ref |
| Established | 已有结构合法引用，不是永久授权 | 正式port/对象factory | 所属对象失效时Stale；不能自行续期限 |
| Stale | 保留原引用与失效原因 | owning invalidation | 仅新对象/明确允许维护替换；不可通用restore |

| 函数签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式建立缺失值 |
| `pub fn established(value: T) -> Self` | /// 显式包裹值，不授资格 |
| `pub fn require_established(&self) -> Result<&T, ContractViolation>` | /// Missing/Stale拒绝，不修改Slot |
generic不带lifecycle迁移函数；实际state-required在每Domain卡和跨审表关闭。

## 2. Contracts模块小循环

问题/诊断/取舍已先记主文件§3/4/6；下面只contracts卡，不提前写Domain。

| capability | 输入 | 输出 / 状态或副作用 | 所属对象 | 后续 |
|---|---|---|---|---|
| C-LOC | 正式平台decoder、owner resolver | typed locator/target，无IO | PlatformKind、四locator、BridgeInternalTargetRef | Step7转换/Step8wire |
| C-REF | generated/store identity与formal safe source | local named refs/authority refs，无授权 | 各独立newtype卡 | Step7factory/source/read面 |
| C-QUAL | current port的显式两端/版本/期限材料 | binding/material/presentation/action/read资格载体 | Current*、DispatchEligibilityRef | Step7/9重核 |
| C-CONT | 已存原op、namespace/位置/权威结果 | effect/meaning/cursor/coverage/rate typed carrier | operation/continuity卡 | Step7/11/13 |
| C-STATE | 02各对象局部状态 | finite state/Slot，零IO | 各state enum/QualificationSlot aliases | Step10完整矩阵 |
| C-RESULT | 实际分阶段结果/已过滤局部切片 | result/view/job/ACK载体 | BridgeLocalView、结果卡 | Step8wire/Step12map |

| 对象组 | 功能到对象 / 类别 | 能力到字段/factory/member/state | 来源 / 禁止 |
|---|---|---|---|
| local refs | C-REF / value object | LocalRefToken -> from_generated_or_stored -> token；无state | 技术id source或原store；不由route/external ID/body mint |
| authority refs | C-REF/QUAL / value object | SafeAuthorityRef -> from_source -> authority；exact kind | 对应卡点名port；不从本地形状推授权 |
| locator/target | C-LOC / boundary value | namespace/kind/opaque identity -> typed factory -> equality | qualified platform/owner，不guess/display-name |
| current资格 | C-QUAL / immutable evaluation carrier | target/actor/generation/action/version/window/basis -> from_ports -> assert_matches | 每IO重新核验，非长期权限truth |
| continuity | C-CONT / safe support | 原op/effect与正式comparison/coverage/limits -> explicit factory -> pure guards | 不hash body、不缩rate lower bound、不从NotFound推无效果 |
| states/Slot | C-STATE / finite label | exact variants，具体对象方法产生 | 不合GlobalSuccess，未列边禁止 |
| view/results | C-RESULT / immutable DTO carrier | 当前过滤字段 -> from_qualified_fields/from_result -> safe read | contracts不依domain/Application；无private/Query写 |

### ContractViolation
归属`errors.rs`；结构/守卫错误，不能带raw error。
```rust
/// 结构不合法或局部不变量未满足，不携带原始材料。
pub enum ContractViolation {
    /// 值域或编码不合法。
    InvalidValue,
    /// 引用exact kind不匹配。
    WrongKind,
    /// 两端或版本字段相互矛盾。
    InconsistentFields,
    /// 出现禁止的正文或凭证材料。
    ForbiddenMaterial,
    /// 必需资格字段尚未建立。
    MissingRequired,
    /// 安装、scope或目标越界。
    OutOfScope,
    /// 资格已到期或失效。
    Expired,
    /// 原效果未知，不能构造新的执行资格。
    UnknownEffect,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| InvalidValue | 值域或编码不合法 | 不适用，validator分类 | 不适用 |
| WrongKind | 引用exact kind不匹配 | 不适用 | 不适用 |
| InconsistentFields | 两端或版本字段矛盾 | 不适用 | 不适用 |
| ForbiddenMaterial | 出现正文或凭证材料 | 不适用 | 不适用 |
| MissingRequired | 必需字段未建立 | 不适用 | 不适用 |
| OutOfScope | 安装/scope/目标越界 | 不适用 | 不适用 |
| Expired | 资格到期/失效 | 不适用 | 不适用 |
| UnknownEffect | 原效果未知不能发新执行 | 不适用 | 不适用 |
成员无；工厂为variant；Step12映射，不序列化raw cause。

### SafeReasonCode
归属`shared/outcomes.rs`；public有限理由先过visibility映射。
```rust
/// 安全有限原因，不接受free-text、审批内容或平台原始错误。
pub enum SafeReasonCode {
    /// 已知结果没有失败原因。
    NoFailure,
    /// 结构输入不合法。
    InvalidInput,
    /// 正式合同缺失。
    MissingContract,
    /// 当前授权未成立。
    Unauthorized,
    /// 安装或scope不匹配。
    ScopeMismatch,
    /// 依据版本失效。
    StaleBasis,
    /// 窗口已到期。
    Expired,
    /// 正式资格已撤销。
    Revoked,
    /// 能力不支持。
    Unsupported,
    /// 必须等待平台下界。
    RateLimited,
    /// 来源依赖不可用。
    DependencyUnavailable,
    /// 相同键含义冲突。
    Conflict,
    /// 经验证的自发送回环。
    LoopDetected,
    /// 原变化mapping缺失。
    OriginalMappingMissing,
    /// 可能有效果但结果未知。
    OutcomeUnknown,
    /// 自动路径停止，需显式人工处理。
    ManualRequired,
    /// 必需材料未合格。
    MissingMaterial,
    /// 协议版本不支持。
    UnsupportedVersion,
    /// 本地调用取消，不证明无效果。
    Cancelled,
    /// 来源给出确定拒绝。
    KnownRejected,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| NoFailure | 已知结果无失败原因 | 不适用，finite分类 | 不适用 |
| InvalidInput | 结构输入不合法 | 不适用 | 不适用 |
| MissingContract | 正式合同缺失 | 不适用 | 不适用 |
| Unauthorized | 当前授权未成立 | 不适用 | 不适用 |
| ScopeMismatch | 安装或scope不匹配 | 不适用 | 不适用 |
| StaleBasis | 依据版本失效 | 不适用 | 不适用 |
| Expired | 窗口到期 | 不适用 | 不适用 |
| Revoked | 正式资格撤销 | 不适用 | 不适用 |
| Unsupported | 能力不支持 | 不适用 | 不适用 |
| RateLimited | 必须等待平台下界 | 不适用 | 不适用 |
| DependencyUnavailable | 来源依赖不可用 | 不适用 | 不适用 |
| Conflict | 同键含义冲突 | 不适用 | 不适用 |
| LoopDetected | verified self-send回环 | 不适用 | 不适用 |
| OriginalMappingMissing | 原变化mapping缺失 | 不适用 | 不适用 |
| OutcomeUnknown | 可能有效果，结果未知 | 不适用 | 不适用 |
| ManualRequired | 停自动路径需人工 | 不适用 | 不适用 |
| MissingMaterial | 必需材料不合格 | 不适用 | 不适用 |
| UnsupportedVersion | 协议版本不支持 | 不适用 | 不适用 |
| Cancelled | 调用取消非无效果 | 不适用 | 不适用 |
| KnownRejected | 确定来源拒绝 | 不适用 | 不适用 |
factory exact variant；member无。denied public一般只给Unauthorized/MissingContract，不披露隐藏细因/count/ref；日志也只允许finite reason，不能保字符串cause。

### PlatformKind
归属`shared/locators.rs`。
```rust
/// 平台分类，不宣称安装、版本或方法已支持。
pub enum PlatformKind {
    /// Slack协议族。
    Slack,
    /// Mattermost协议族。
    Mattermost,
    /// Telegram Bot API协议族。
    Telegram,
    /// Discord协议族。
    Discord,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Slack | Slack协议族 | 不适用 | 不适用 |
| Mattermost | Mattermost协议族 | 不适用 | 不适用 |
| Telegram | Telegram Bot API协议族 | 不适用 | 不适用 |
| Discord | Discord协议族 | 不适用 | 不适用 |
factory exact variant；member无；未知平台不fallback。

### InstallationNamespace
归属`shared/locators.rs`。
```rust
/// 完整外部安装命名空间，不能等同内部Workspace。
pub struct InstallationNamespace {
    /// 明确平台协议族。
    platform: PlatformKind,
    /// 配置注册的server身份，不保存endpoint URL。
    server_ref: SafeOpaqueId,
    /// 受权环境隔离标签。
    environment_ref: SafeOpaqueId,
    /// 经核的安装或bot/application身份。
    installation_id: SafeOpaqueId,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| platform | `PlatformKind` | qualified config枚举，不由body猜 |
| server_ref | `SafeOpaqueId` | route/config registry；Slack官方、Mattermost独立server等不混 |
| environment_ref | `SafeOpaqueId` | 受权配置，test/production隔离 |
| installation_id | `SafeOpaqueId` | 逐平台合格installation来源，缺失不造账号 |

| 类别 | 完整签名 | 中文Rustdoc / 副作用 |
|---|---|---|
| 工厂 | `pub fn from_config(platform: PlatformKind, server_ref: SafeOpaqueId, environment_ref: SafeOpaqueId, installation_id: SafeOpaqueId) -> Result<Self, ContractViolation>` | /// 完整复制四字段，结构校验不证明平台安装 |
| 成员 | `pub fn same_namespace(&self, other: &Self) -> bool` | /// 四字段exact判等，不跨server合并 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn platform(&self) -> &PlatformKind` | /// 借用原platform字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn server_ref(&self) -> &SafeOpaqueId` | /// 借用原server_ref字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn environment_ref(&self) -> &SafeOpaqueId` | /// 借用原environment_ref字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn installation_id(&self) -> &SafeOpaqueId` | /// 借用原installation_id字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |


### LocalRefToken
归属`shared/locators.rs`。
```rust
/// 本地对象ref共同字段，exact kind由独立named wrapper固定。
pub struct LocalRefToken {
    /// 对象所属外部安装命名空间。
    namespace: InstallationNamespace,
    /// 不可复用的本地生成identity。
    id: LocalObjectId,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| namespace | `InstallationNamespace` | qualified config或既有store；与target source一致 |
| id | `LocalObjectId` | Application技术factory/store，不从external ID推导 |

| 类别 | 完整签名 | 中文Rustdoc / 副作用 |
|---|---|---|
| 工厂 | `pub fn from_generated_or_stored(namespace: InstallationNamespace, id: LocalObjectId) -> Result<Self, ContractViolation>` | /// 完整接纳两字段；对象kind只能从专门factory/store schema来源 |
| 成员 | `pub fn namespace(&self) -> &InstallationNamespace` | /// 读取隔离域，不读secret |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn id(&self) -> &LocalObjectId` | /// 借用原id字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |


## 3. Named local ref卡

以下各type是不同Rust newtype，不是互换alias；均无state。factory `from_token`只接纳Application专门identity factory或该kind store decoder输入；外部输入不能mint。每卡0字段均继承LocalRefToken两字段来源，但exact对象kind不能串用。各member `token`只返回body-free关联，不授权。正式计划归属按节内路径。

### BridgeInstallationRef
`shared/locators.rs`；C-REF，本地配置identity。
```rust
/// 本地桥接配置身份，不证明平台安装。
pub struct BridgeInstallationRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | Application配置identity factory/store，同安装namespace |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制配置identity，不创建外部安装 |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取配置ref，无IO |

### ExternalBindingRef
`shared/locators.rs`；C-REF，显式授权关系identity。
```rust
/// 显式绑定relation身份，不是owner权限本身。
pub struct ExternalBindingRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | Application relation factory/原store，不从OAuth grant生成 |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制relation身份，不激活关系 |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取relation ref |

### IdentityMappingRef
`shared/locators.rs`；C-REF。
```rust
/// 外部账号与内部责任的局部mapping身份。
pub struct IdentityMappingRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | Application identity-link factory/store，不创建GlobalMember |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制mapping identity |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取mapping ref |

### LocationMappingRef
`shared/locators.rs`；C-REF。
```rust
/// 外部位置与正式内部target的局部mapping身份。
pub struct LocationMappingRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | Application location-link factory/store，不从channel名生成 |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制位置mapping identity |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取位置mapping ref |

### MessageMappingRef
`shared/locators.rs`；C-REF。
```rust
/// 已知结果回链mapping身份，不是平台或Conversation消息truth。
pub struct MessageMappingRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | 已知owner/platform结果的Application factory/store |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制回链identity，unknown不得新造回链 |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取回链ref |

### InboundRecordRef
`shared/locators.rs`；C-REF。
```rust
/// 入站局部安全交接记录身份，不是Turn。
pub struct InboundRecordRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | verified入站Application identity factory/store |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制入站记录identity |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取入站ref |

### BridgeOperationRef
`shared/operation.rs`；C-CONT。
```rust
/// 原逻辑操作identity，重复或恢复必须复用。
pub struct BridgeOperationRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | Application在semantic唯一检查后创建/原结果store读回；重试不mint |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制原操作identity |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取原op，不拼新op |

### LocalMutationRef
`shared/operation.rs`；C-CONT。
```rust
/// 本次实际本地UoW变更identity，不证明已提交。
pub struct LocalMutationRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | Application local mutation factory/对应UoW staged写集 |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制变更identity，不能造commit证明 |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取局部mutation ref |

### DeliveryEffectRef
`shared/delivery.rs`；C-CONT。
```rust
/// 外部逻辑effect身份；同义唯一检查后创建，attempt不替换。
pub struct DeliveryEffectRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | Application effect identity factory或原intent store；C04/E02共义唯一 |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制原effect，未知不新建 |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取effect ref |

### DeliveryIntentRef
`shared/delivery.rs`；C-REF。
```rust
/// 已固化投递含义的本地intent身份。
pub struct DeliveryIntentRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | Application prepare effect factory/store；J01只读existing |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制intent identity，不派发 |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取intent ref |

### AttemptRef
`shared/delivery.rs`；C-REF。
```rust
/// 一次外呼尝试身份，不能复用旧attempt重复IO。
pub struct AttemptRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | Application在合格claim后生成/store重建 |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制attempt identity，不证明request已发 |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取attempt ref |

### PlatformReceiptRef
`shared/delivery.rs`；C-REF。
```rust
/// 已知平台业务结果的局部receipt身份，未知不造receipt。
pub struct PlatformReceiptRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | Application verified known-result factory/immutable store |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制known结果identity，不宣delivered |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取receipt ref |

### PresentationPlanRef
`shared/delivery.rs`；C-REF。
```rust
/// 原安全外显plan身份，不可用同ref替换source或projection。
pub struct PresentationPlanRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | Application qualified/degraded/blocked plan factory/store |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制plan identity，不表示qualified |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取plan ref |

### ExternalActionBindingRef
`shared/callback.rs`；C-REF。
```rust
/// 一次性交互绑定identity，非token或response URL。
pub struct ExternalActionBindingRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | Application current action bind factory/store |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制one-use binding identity，不发按钮 |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取binding ref |

### CallbackRecordRef
`shared/callback.rs`；C-REF。
```rust
/// callback安全交接记录identity，不拥有Gate/Decision。
pub struct CallbackRecordRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | Application callback verification-result factory/store |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制callback record identity |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取callback ref |

### DedupRecordRef
`shared/continuity.rs`；C-CONT。
```rust
/// 单namespace/scope去重记录identity。
pub struct DedupRecordRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | 原子reserve的Application factory/store，不以key文本替代 |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制dedup identity，不重新reserve |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取dedup ref |

### StreamCursorRef
`shared/continuity.rs`；C-CONT。
```rust
/// 明确stream tracker身份，不等处理水位或page token。
pub struct StreamCursorRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | Application qualified stream initialize/store |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制tracker identity，不推进position |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取cursor ref |

### GapRef
`shared/continuity.rs`；C-CONT。
```rust
/// 未被权威coverage覆盖的局部缺口identity。
pub struct GapRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | Application gap detect factory/store；不存缺失消息 |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制gap identity，不关闭缺口 |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取gap ref |

### DispatchLaneRef
`shared/continuity.rs`；C-CONT。
```rust
/// 局部受权排序与限流lane身份，不承诺全局顺序。
pub struct DispatchLaneRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | Application qualified lane scope factory/store |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制lane identity，不claim |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取lane ref |

### RecoveryRecordRef
`shared/continuity.rs`；C-CONT。
```rust
/// 显式受权原subject恢复记录identity，不是新业务操作。
pub struct RecoveryRecordRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | C06 Application recovery request factory/store |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制recovery identity，不mint原effect |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取恢复ref |

### SafeAuditRef
`shared/traceability.rs`；C-REF。
```rust
/// 真实本地mutation的安全历史记录identity，不是evidence。
pub struct SafeAuditRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | Application唯一mutation material factory/store，同UoW |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制audit identity，不造验收事实 |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取safe audit ref |

### SafeHandoffRef
`shared/traceability.rs`；C-REF。
```rust
/// 条件canonical安全交接记录identity，不是consumer或证据truth。
pub struct SafeHandoffRef(LocalRefToken);
```
| 类别 | 字段类型或完整签名 | 约束/来源/中文Rustdoc |
|---|---|---|
| 字段0 | `LocalRefToken` | canonical/schema/admission成立后Application factory/store |
| 工厂 | `pub fn from_token(value: LocalRefToken) -> Self` | /// 复制handoff identity，不造every-mutation outbox |
| 成员 | `pub fn token(&self) -> &LocalRefToken` | /// 读取handoff ref |

## 4. Shared分类与阶段

### BridgeActorKind
归属`shared/authority.rs`；C-STATE/RESULT/C-CONT。
```rust
/// mapping责任分类，不替core actor或认证。
pub enum BridgeActorKind {
    /// 正式human认证责任，不归Identity。
    Human,
    /// AI身份锚点及正式责任，不从bot自动推断。
    AiMember,
    /// 可信桥接来源责任，不代表任意平台用户。
    Integration,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Human | 正式human认证责任，不归Identity | 不适用，分类/单次evaluation | 不适用 |
| AiMember | AI身份锚点及正式责任，不从bot自动推断 | 不适用，分类/单次evaluation | 不适用 |
| Integration | 可信桥接来源责任，不代表任意平台用户 | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### DirectionActionKind
归属`shared/authority.rs`；C-STATE/RESULT/C-CONT。
```rust
/// explicit relation允许的有限方向与动作。
pub enum DirectionActionKind {
    /// 入站AppendFact，Integration及owner required guard。
    InboundAppend,
    /// 入站外部事实显现，不存平台正文。
    InboundManifest,
    /// 原消息编辑变化交接。
    InboundEdit,
    /// 原消息删除disposition交接。
    InboundDelete,
    /// 原thread回复交接。
    InboundReply,
    /// 发送原获准projection。
    OutboundSend,
    /// 编辑已知原message。
    OutboundEdit,
    /// 删除已知原message。
    OutboundDelete,
    /// 向获准原thread回复。
    OutboundReply,
    /// 一次性交接owner动作，需具体action资格。
    CallbackOwnerAction,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| InboundAppend | 入站AppendFact，Integration及owner required guard | 不适用，分类/单次evaluation | 不适用 |
| InboundManifest | 入站外部事实显现，不存平台正文 | 不适用，分类/单次evaluation | 不适用 |
| InboundEdit | 原消息编辑变化交接 | 不适用，分类/单次evaluation | 不适用 |
| InboundDelete | 原消息删除disposition交接 | 不适用，分类/单次evaluation | 不适用 |
| InboundReply | 原thread回复交接 | 不适用，分类/单次evaluation | 不适用 |
| OutboundSend | 发送原获准projection | 不适用，分类/单次evaluation | 不适用 |
| OutboundEdit | 编辑已知原message | 不适用，分类/单次evaluation | 不适用 |
| OutboundDelete | 删除已知原message | 不适用，分类/单次evaluation | 不适用 |
| OutboundReply | 向获准原thread回复 | 不适用，分类/单次evaluation | 不适用 |
| CallbackOwnerAction | 一次性交接owner动作，需具体action资格 | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### BridgeTargetMode
归属`shared/material.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 沿Conversation正式语义的本地映射，不新增owner compile边。
pub enum BridgeTargetMode {
    /// 映射BridgeMapped事实，actor必须Integration且digest required合同成立。
    AppendFact,
    /// 映射外部fact/manifestation，不写平台正文。
    ManifestExternalFact,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| AppendFact | 映射BridgeMapped事实，actor必须Integration且digest required合同成立 | 不适用，分类/单次evaluation | 不适用 |
| ManifestExternalFact | 映射外部fact/manifestation，不写平台正文 | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### ExternalChangeKind
归属`shared/delivery.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 原外部消息变化分类。
pub enum ExternalChangeKind {
    /// 新消息变化，不冒充owner提交。
    Create,
    /// 原message编辑变化。
    Edit,
    /// 原message删除变化，非内部实体物理删除。
    Delete,
    /// 原thread/root回复变化。
    Reply,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Create | 新消息变化，不冒充owner提交 | 不适用，分类/单次evaluation | 不适用 |
| Edit | 原message编辑变化 | 不适用，分类/单次evaluation | 不适用 |
| Delete | 原message删除变化，非内部实体物理删除 | 不适用，分类/单次evaluation | 不适用 |
| Reply | 原thread/root回复变化 | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### ExternalDeliveryKind
归属`shared/delivery.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 一次immutable effect的外部操作分类。
pub enum ExternalDeliveryKind {
    /// 发送获准内容。
    Send,
    /// 编辑原known locator。
    Edit,
    /// 删除原known locator。
    Delete,
    /// 向原获准thread/root回复。
    Reply,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Send | 发送获准内容 | 不适用，分类/单次evaluation | 不适用 |
| Edit | 编辑原known locator | 不适用，分类/单次evaluation | 不适用 |
| Delete | 删除原known locator | 不适用，分类/单次evaluation | 不适用 |
| Reply | 向原获准thread/root回复 | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### QualifiedPresentationKind
归属`shared/delivery.rs`；C-STATE/RESULT/C-CONT。
```rust
/// owner明示许可的外显等级，不默认降级授权。
pub enum QualifiedPresentationKind {
    /// 完整获准内容，仍不许敏感禁止材料。
    PermittedContent,
    /// 获准安全提示，无敏感正文与动作。
    ApprovedNoticeNoAction,
    /// 获准固定安全入口，无审批动作或私有URL。
    ApprovedRouteNoAction,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| PermittedContent | 完整获准内容，仍不许敏感禁止材料 | 不适用，分类/单次evaluation | 不适用 |
| ApprovedNoticeNoAction | 获准安全提示，无敏感正文与动作 | 不适用，分类/单次evaluation | 不适用 |
| ApprovedRouteNoAction | 获准固定安全入口，无审批动作或私有URL | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### KnownPlatformBusinessResultKind
归属`shared/delivery.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 已知平台业务响应分类，不等用户送达已读。
pub enum KnownPlatformBusinessResultKind {
    /// 平台method业务接受，非HTTP成功推断。
    Accepted,
    /// 平台method确定业务拒绝，no-effect另需proof。
    Rejected,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Accepted | 平台method业务接受，非HTTP成功推断 | 不适用，分类/单次evaluation | 不适用 |
| Rejected | 平台method确定业务拒绝，no-effect另需proof | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### OwnerResultKind
归属`shared/material.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 原owner operation真实阶段。
pub enum OwnerResultKind {
    /// owner正式accepted结果。
    Accepted,
    /// owner明确拒绝。
    Rejected,
    /// owner明确尚在处理。
    Pending,
    /// 可能有效果但结果不可判。
    Indeterminate,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Accepted | owner正式accepted结果 | 不适用，分类/单次evaluation | 不适用 |
| Rejected | owner明确拒绝 | 不适用，分类/单次evaluation | 不适用 |
| Pending | owner明确尚在处理 | 不适用，分类/单次evaluation | 不适用 |
| Indeterminate | 可能有效果但结果不可判 | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### ConsumerResultKind
归属`shared/traceability.rs`；C-STATE/RESULT/C-CONT。
```rust
/// canonical安全交接consumer真实阶段。
pub enum ConsumerResultKind {
    /// consumer正式接纳，不等evidence。
    Accepted,
    /// consumer正式拒绝。
    Rejected,
    /// consumer明确处理中。
    Pending,
    /// 交接可能发生但结果不可判。
    Indeterminate,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Accepted | consumer正式接纳，不等evidence | 不适用，分类/单次evaluation | 不适用 |
| Rejected | consumer正式拒绝 | 不适用，分类/单次evaluation | 不适用 |
| Pending | consumer明确处理中 | 不适用，分类/单次evaluation | 不适用 |
| Indeterminate | 交接可能发生但结果不可判 | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### LocalAttemptDispositionKind
归属`shared/delivery.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 本地claim释放分类，不能推无效果。
pub enum LocalAttemptDispositionKind {
    /// 原attempt已有known终局结果。
    KnownFinal,
    /// 仅释放本地资源，原effect仍未知。
    Unknown,
    /// 有权威no-IO依据，仍须当前资格才新attempt。
    NoIo,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| KnownFinal | 原attempt已有known终局结果 | 不适用，分类/单次evaluation | 不适用 |
| Unknown | 仅释放本地资源，原effect仍未知 | 不适用，分类/单次evaluation | 不适用 |
| NoIo | 有权威no-IO依据，仍须当前资格才新attempt | 不适用，分类/单次evaluation | 不适用 |

NoIo分支仅该attempt权威未dispatch的local处置，不是effect NoEffect或retry资格；新attempt须按DeliveryIntent原guard另取得authoritative NoEffect、完整RetryEligibility/current/all bounds和原业务预算，不能由该分类直接产生。
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### OwnerActionKind
归属`shared/callback.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 当前候选owner正式命令名，兼容未核不激活。
pub enum OwnerActionKind {
    /// 正式Governance投票入口，actor/责任/门槛由owner核。
    RecordApprovalVote,
    /// 正式Governance决定入口，不能由平台按钮直接裁决。
    RecordGovernanceDecision,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| RecordApprovalVote | 正式Governance投票入口，actor/责任/门槛由owner核 | 不适用，分类/单次evaluation | 不适用 |
| RecordGovernanceDecision | 正式Governance决定入口，不能由平台按钮直接裁决 | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### DedupNamespace
归属`shared/continuity.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 六个逻辑dedup空间，不允许跨namespace复用。
pub enum DedupNamespace {
    /// 管理命令。
    Management,
    /// 平台消息入站交接。
    Inbound,
    /// 外显effect准备/派发。
    Outbound,
    /// 一次性交互owner交接。
    Callback,
    /// 原subject显式维护。
    Recovery,
    /// canonical安全材料交接。
    Handoff,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Management | 管理命令 | 不适用，分类/单次evaluation | 不适用 |
| Inbound | 平台消息入站交接 | 不适用，分类/单次evaluation | 不适用 |
| Outbound | 外显effect准备/派发 | 不适用，分类/单次evaluation | 不适用 |
| Callback | 一次性交互owner交接 | 不适用，分类/单次evaluation | 不适用 |
| Recovery | 原subject显式维护 | 不适用，分类/单次evaluation | 不适用 |
| Handoff | canonical安全材料交接 | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### IdempotencyKeySource
归属`shared/continuity.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 幂等键的唯一正式输入类别。
pub enum IdempotencyKeySource {
    /// CommandMetadata.request.idempotency_key，必须Some。
    CommandMetadata,
    /// qualified event/producer envelope的明确dedup key。
    VerifiedEvent,
    /// trusted bounded job item业务key。
    TrustedJob,
    /// 恢复读取的原operation/key，不能新拼。
    OriginalOperation,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| CommandMetadata | CommandMetadata.request.idempotency_key，必须Some | 不适用，分类/单次evaluation | 不适用 |
| VerifiedEvent | qualified event/producer envelope的明确dedup key | 不适用，分类/单次evaluation | 不适用 |
| TrustedJob | trusted bounded job item业务key | 不适用，分类/单次evaluation | 不适用 |
| OriginalOperation | 恢复读取的原operation/key，不能新拼 | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### StreamStageKind
归属`shared/continuity.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 互不代替的流阶段。
pub enum StreamStageKind {
    /// 平台协议接入位置，不证明owner处理。
    Protocol,
    /// owner正式accepted位置，不由ACK推进。
    Owner,
    /// 平台已知effect结果位置，不由内部提交推进。
    Delivery,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Protocol | 平台协议接入位置，不证明owner处理 | 不适用，分类/单次evaluation | 不适用 |
| Owner | owner正式accepted位置，不由ACK推进 | 不适用，分类/单次evaluation | 不适用 |
| Delivery | 平台已知effect结果位置，不由内部提交推进 | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### PositionComparisonKind
归属`shared/continuity.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 权威comparator对同stream/epoch两位置的结果。
pub enum PositionComparisonKind {
    /// candidate先于已存位置，拒绝回退。
    Before,
    /// candidate与已存位置相同，允许不变观察。
    Equal,
    /// candidate在后，仍需完整coverage才推进。
    After,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Before | candidate先于已存位置，拒绝回退 | 不适用，分类/单次evaluation | 不适用 |
| Equal | candidate与已存位置相同，允许不变观察 | 不适用，分类/单次evaluation | 不适用 |
| After | candidate在后，仍需完整coverage才推进 | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### RateLimitScopeKind
归属`shared/continuity.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 平台有效等待下界的共享作用域。
pub enum RateLimitScopeKind {
    /// 整server/credential scope跨所有相关lane。
    Global,
    /// 同API method。
    Method,
    /// channel/chat/guild或major resource。
    Resource,
    /// 平台bucket标识，按当前bucket映射共享。
    Bucket,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Global | 整server/credential scope跨所有相关lane | 不适用，分类/单次evaluation | 不适用 |
| Method | 同API method | 不适用，分类/单次evaluation | 不适用 |
| Resource | channel/chat/guild或major resource | 不适用，分类/单次evaluation | 不适用 |
| Bucket | 平台bucket标识，按当前bucket映射共享 | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### SafeGapReason
归属`shared/continuity.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 缺口有限原因，不保存缺失消息。
pub enum SafeGapReason {
    /// 来源断连且无完整接续证明。
    SourceDisconnected,
    /// source epoch改变不能跨比较。
    EpochChanged,
    /// 正式比较规则缺失。
    ComparatorUnavailable,
    /// 相应阶段coverage不足。
    CoverageMissing,
    /// 原源或窗口不可恢复。
    WindowUnavailable,
    /// 同source位置或版本冲突。
    SourceOrderConflict,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| SourceDisconnected | 来源断连且无完整接续证明 | 不适用，分类/单次evaluation | 不适用 |
| EpochChanged | source epoch改变不能跨比较 | 不适用，分类/单次evaluation | 不适用 |
| ComparatorUnavailable | 正式比较规则缺失 | 不适用，分类/单次evaluation | 不适用 |
| CoverageMissing | 相应阶段coverage不足 | 不适用，分类/单次evaluation | 不适用 |
| WindowUnavailable | 原源或窗口不可恢复 | 不适用，分类/单次evaluation | 不适用 |
| SourceOrderConflict | 同source位置或版本冲突 | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### SafeRecoveryResolutionKind
归属`shared/continuity.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 受权原subject维护结果，不自动send。
pub enum SafeRecoveryResolutionKind {
    /// 尚无实际恢复结论，Requested/Probing不伪造已完成分类。
    Unresolved,
    /// 原已知结果仅局部finalize。
    FinalizeOnly,
    /// 权威no-effect及current guard成立，仅记录同effect重试资格。
    SameEffectRetryEligible,
    /// 完整同流epoch原range覆盖。
    GapCovered,
    /// 停止自动路径，保原unknown/gap。
    Manual,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| FinalizeOnly | 原已知结果仅局部finalize | 不适用，分类/单次evaluation | 不适用 |
| Unresolved | 尚无actual恢复结论，不伪造已完成分类 | Requested/Probing/Blocked实际未解决 | 实际probe后才确定其他分类 |
| SameEffectRetryEligible | 权威no-effect及current guard成立，仅记录同effect重试资格 | 不适用，分类/单次evaluation | 不适用 |
| GapCovered | 完整同流epoch原range覆盖 | 不适用，分类/单次evaluation | 不适用 |
| Manual | 停止自动路径，保原unknown/gap | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### ProtocolAckDisposition
归属`shared/outcomes.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 实际平台ACK阶段，不等可靠接管或业务结果。
pub enum ProtocolAckDisposition {
    /// 尚未发ACK。
    NotSent,
    /// 实际协议ACK已发送。
    Acknowledged,
    /// 实际协议defer已发送，非owner pending。
    Deferred,
    /// 实际协议拒绝已发送。
    Rejected,
    /// ACK未确认成功，不推业务失败。
    Failed,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| NotSent | 尚未发ACK | 不适用，分类/单次evaluation | 不适用 |
| Acknowledged | 实际协议ACK已发送 | 不适用，分类/单次evaluation | 不适用 |
| Deferred | 实际协议defer已发送，非owner pending | 不适用，分类/单次evaluation | 不适用 |
| Rejected | 实际协议拒绝已发送 | 不适用，分类/单次evaluation | 不适用 |
| Failed | ACK未确认成功，不推业务失败 | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### ProtocolAckAction
归属`shared/outcomes.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 计划执行的协议ACK动作，不等实际disposition。
pub enum ProtocolAckAction {
    /// 按qualified模式ACK。
    Acknowledge,
    /// 平台允许且合同明确的defer。
    Defer,
    /// 协议层拒绝，不含敏感理由。
    Reject,
    /// source合同明确无需ACK。
    NoAckRequired,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Acknowledge | 按qualified模式ACK | 不适用，分类/单次evaluation | 不适用 |
| Defer | 平台允许且合同明确的defer | 不适用，分类/单次evaluation | 不适用 |
| Reject | 协议层拒绝，不含敏感理由 | 不适用，分类/单次evaluation | 不适用 |
| NoAckRequired | source合同明确无需ACK | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### LocalCommitKind
归属`shared/outcomes.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 本地UoW阶段标签，与owner及平台独立。
pub enum LocalCommitKind {
    /// 权威本地提交已证明。
    Committed,
    /// 权威rollback已证明。
    RolledBack,
    /// commit结果未知，保原mutation/op。
    Indeterminate,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Committed | 权威本地提交已证明 | 不适用，分类/单次evaluation | 不适用 |
| RolledBack | 权威rollback已证明 | 不适用，分类/单次evaluation | 不适用 |
| Indeterminate | commit结果未知，保原mutation/op | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### ConsumeDisposition
归属`shared/outcomes.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 安全consumer入口处置，不是owner或平台truth。
pub enum ConsumeDisposition {
    /// 本地已接管，其他阶段另列。
    AcceptedLocal,
    /// 同义原结果当前受权读取。
    Duplicate,
    /// 正式必要资格缺失。
    Blocked,
    /// 明确安全拒绝。
    Rejected,
    /// 来源/含义/原mapping违规隔离。
    Quarantined,
    /// 原效果或本地提交不可判。
    Indeterminate,
    /// 输入版本不支持，不当accepted。
    UnsupportedVersion,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| AcceptedLocal | 本地已接管，其他阶段另列 | 不适用，分类/单次evaluation | 不适用 |
| Duplicate | 同义原结果当前受权读取 | 不适用，分类/单次evaluation | 不适用 |
| Blocked | 正式必要资格缺失 | 不适用，分类/单次evaluation | 不适用 |
| Rejected | 明确安全拒绝 | 不适用，分类/单次evaluation | 不适用 |
| Quarantined | 来源/含义/原mapping违规隔离 | 不适用，分类/单次evaluation | 不适用 |
| Indeterminate | 原效果或本地提交不可判 | 不适用，分类/单次evaluation | 不适用 |
| UnsupportedVersion | 输入版本不支持，不当accepted | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### SafeViewDisposition
归属`views.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 当前只读输出资格，不是对象lifecycle。
pub enum SafeViewDisposition {
    /// 当前safe view可返回。
    Qualified,
    /// 明确获准受限切片可返回。
    Degraded,
    /// 当前不可见，隐藏subject/ref/count。
    Denied,
    /// 来源读取不可用，不冒充empty。
    Unavailable,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Qualified | 当前safe view可返回 | 不适用，分类/单次evaluation | 不适用 |
| Degraded | 明确获准受限切片可返回 | 不适用，分类/单次evaluation | 不适用 |
| Denied | 当前不可见，隐藏subject/ref/count | 不适用，分类/单次evaluation | 不适用 |
| Unavailable | 来源读取不可用，不冒充empty | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### BridgeStoredResultKind
归属`shared/outcomes.rs`；C-STATE/RESULT/C-CONT。
```rust
/// 原结果存储载体的exact族，不重执行取结果。
pub enum BridgeStoredResultKind {
    /// 管理命令局部结果。
    Command,
    /// 消息交接consumer结果。
    Inbound,
    /// 已提交source消费结果。
    Source,
    /// callback交接结果。
    Callback,
    /// 安全handoff disposition消费结果。
    Consumer,
    /// 原intent bounded派发结果。
    Dispatch,
    /// 原operation权威恢复结果。
    Recovery,
    /// 原gap受权恢复结果。
    GapRecovery,
    /// 原canonical交接job结果。
    SafeHandoff,
    /// 既有subject资格维护结果。
    Qualification,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Command | 管理命令局部结果 | 不适用，分类/单次evaluation | 不适用 |
| Inbound | 消息交接consumer结果 | 不适用，分类/单次evaluation | 不适用 |
| Source | 已提交source消费结果 | 不适用，分类/单次evaluation | 不适用 |
| Callback | callback交接结果 | 不适用，分类/单次evaluation | 不适用 |
| Consumer | 安全handoff disposition消费结果 | 不适用，分类/单次evaluation | 不适用 |
| Dispatch | 原intent bounded派发结果 | 不适用，分类/单次evaluation | 不适用 |
| Recovery | 原operation权威恢复结果 | 不适用，分类/单次evaluation | 不适用 |
| GapRecovery | 原gap受权恢复结果 | 不适用，分类/单次evaluation | 不适用 |
| SafeHandoff | 原canonical交接job结果 | 不适用，分类/单次evaluation | 不适用 |
| Qualification | 既有subject资格维护结果 | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。

### JobResultDisposition
归属`jobs.rs`；C-STATE/RESULT/C-CONT。
```rust
/// bounded job结果分类，不等外部业务完成。
pub enum JobResultDisposition {
    /// 本次有界范围处置完成，逐阶段结果仍独立。
    Completed,
    /// 有界范围部分处置，保remaining。
    Partial,
    /// 必要current合同或资格不成立。
    Blocked,
    /// 本地或外部原效果未知。
    Indeterminate,
    /// 原stored job结果当前受权复用。
    Duplicate,
    /// 本地执行取消，不证明no-effect。
    Cancelled,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Completed | 本次有界范围处置完成，逐阶段结果仍独立 | 不适用，分类/单次evaluation | 不适用 |
| Partial | 有界范围部分处置，保remaining | 不适用，分类/单次evaluation | 不适用 |
| Blocked | 必要current合同或资格不成立 | 不适用，分类/单次evaluation | 不适用 |
| Indeterminate | 本地或外部原效果未知 | 不适用，分类/单次evaluation | 不适用 |
| Duplicate | 原stored job结果当前受权复用 | 不适用，分类/单次evaluation | 不适用 |
| Cancelled | 本地执行取消，不证明no-effect | 不适用，分类/单次evaluation | 不适用 |
factory是exact variant，member无；不提供Unknown/Other/free-text fallback。实际输入来源与允许使用由对应组合对象/port闭合，分类不能生成业务truth。


## 5. Locator与两端typed relation

### ExternalAccountKind
`shared/locators.rs`。
```rust
/// 平台账号kind，不决定内部Human/AI/Integration责任。
pub enum ExternalAccountKind {
    /// 个人外部账号。
    User,
    /// 平台bot账号。
    Bot,
    /// 平台application或集成身份。
    Application,
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| User | 个人外部账号，不等GlobalMember | 不适用 | 不适用 |
| Bot | 平台bot，不自动等AiMember | 不适用 | 不适用 |
| Application | 外部集成，不默认内部授权 | 不适用 | 不适用 |
factory exact variant，member无；decoder无法确定kind则拒绝。

### ExternalAccountLocator
`shared/locators.rs`；C-LOC。
```rust
/// 外部账号全定位，单独external_id不能唯一或认证。
pub struct ExternalAccountLocator {
    /// 外部安装隔离域。
    namespace: InstallationNamespace,
    /// 已核账号kind。
    kind: ExternalAccountKind,
    /// 平台原opaque账号ID。
    account_id: SafeOpaqueId,
}
```
| 字段 | 类型 | 来源 / 约束 |
|---|---|---|
| namespace | `InstallationNamespace` | config与private verified source一致 |
| kind | `ExternalAccountKind` | qualified adapter证明，不猜用户名 |
| account_id | `SafeOpaqueId` | verified平台opaque ID，不用mention/display_name |

| 类别 | 完整签名 | 中文Rustdoc / 副作用 |
|---|---|---|
| 工厂 | `pub fn from_verified(namespace: InstallationNamespace, kind: ExternalAccountKind, account_id: SafeOpaqueId) -> Result<Self, ContractViolation>` | /// 完整构造定位，未授内部身份 |
| 成员 | `pub fn namespace(&self) -> &InstallationNamespace` | /// 读取隔离域 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn kind(&self) -> &ExternalAccountKind` | /// 借用原kind字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn account_id(&self) -> &SafeOpaqueId` | /// 借用原account_id字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |


### ExternalLocationKind
`shared/locators.rs`。
```rust
/// 平台位置kind，必须按逐平台合同解释。
pub enum ExternalLocationKind {
    /// 公共或私有channel。
    Channel,
    /// 私有单聊位置。
    DirectMessage,
    /// 群组位置。
    Group,
    /// 平台topic位置。
    Topic,
    /// 平台thread位置，父子语义独立核验。
    Thread,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Channel | 公共/私有channel，不能由名称认领 | 不适用 | 不适用 |
| DirectMessage | 私有单聊位置 | 不适用 | 不适用 |
| Group | 群组位置 | 不适用 | 不适用 |
| Topic | 平台topic | 不适用 | 不适用 |
| Thread | 平台thread，须父子依据 | 不适用 | 不适用 |
factory exact variant，member无；不是内部Workspace分类。

### ExternalLocationLocator
`shared/locators.rs`；C-LOC。
```rust
/// 安装内位置全定位，container是否必填由qualified平台kind合同规定。
pub struct ExternalLocationLocator {
    /// 外部安装隔离域。
    namespace: InstallationNamespace,
    /// exact位置kind。
    kind: ExternalLocationKind,
    /// team/guild/chat等平台父容器ID，明确无父时None。
    container_id: Option<SafeOpaqueId>,
    /// channel/DM/topic/thread的原opaque定位。
    location_id: SafeOpaqueId,
}
```
| 字段 | 类型 | 来源 / 约束 |
|---|---|---|
| namespace | `InstallationNamespace` | config/private verified source同域 |
| kind | `ExternalLocationKind` | source明确；unsupported不改Channel |
| container_id | `Option<SafeOpaqueId>` | qualified adapter；每method/kind required性Step7绑定，未知≠None |
| location_id | `SafeOpaqueId` | 原平台opaque ID；不得把topic/thread抹平成channel |

| 类别 | 完整签名 | 中文Rustdoc / 副作用 |
|---|---|---|
| 工厂 | `pub fn from_verified(namespace: InstallationNamespace, kind: ExternalLocationKind, container_id: Option<SafeOpaqueId>, location_id: SafeOpaqueId) -> Result<Self, ContractViolation>` | /// 完整接纳平台解释结果，schema不能替qualified decoder |
| 成员 | `pub fn namespace(&self) -> &InstallationNamespace` | /// 读取隔离域，不解析内部scope |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn kind(&self) -> &ExternalLocationKind` | /// 借用原kind字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn container_id(&self) -> &Option<SafeOpaqueId>` | /// 借用原container_id字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn location_id(&self) -> &SafeOpaqueId` | /// 借用原location_id字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |


### ExternalMessageLocator
`shared/locators.rs`；C-LOC。
```rust
/// 原消息与已解释thread/root全定位，编辑删除只能使用原定位。
pub struct ExternalMessageLocator {
    /// 完整原位置。
    location: ExternalLocationLocator,
    /// message/post ID或平台原opaque ts，不作cursor比较。
    message_id: SafeOpaqueId,
    /// 平台明示root消息，明确不适用时None。
    root_message_id: Option<SafeOpaqueId>,
}
```
| 字段 | 类型 | 来源 / 约束 |
|---|---|---|
| location | `ExternalLocationLocator` | private verified source或known业务结果 |
| message_id | `SafeOpaqueId` | 原平台消息ID，namespace包含chat/channel；不作Global ID |
| root_message_id | `Option<SafeOpaqueId>` | qualified adapter明确root合同；Discord thread location不冒充Slack thread_ts |

| 类别 | 完整签名 | 中文Rustdoc / 副作用 |
|---|---|---|
| 工厂 | `pub fn from_verified(location: ExternalLocationLocator, message_id: SafeOpaqueId, root_message_id: Option<SafeOpaqueId>) -> Result<Self, ContractViolation>` | /// 构造原消息定位，不查询或删除消息 |
| 成员 | `pub fn location(&self) -> &ExternalLocationLocator` | /// 读取原位置，不默认换target |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn message_id(&self) -> &SafeOpaqueId` | /// 借用原message_id字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn root_message_id(&self) -> &Option<SafeOpaqueId>` | /// 借用原root_message_id字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |


### ExternalScopeLocator
`shared/locators.rs`；C-LOC。
```rust
/// 外部relation一端，区分账号和位置，不混内部scope。
pub enum ExternalScopeLocator {
    /// 绑定账号端，载荷包含安装与账号kind。
    Account(ExternalAccountLocator),
    /// 绑定位置端，载荷包含安装与位置kind。
    Location(ExternalLocationLocator),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Account | 账号端全定位 | 不适用 | 不适用 |
| Location | 位置端全定位 | 不适用 | 不适用 |
factory为exact variant；不新增无载荷默认scope。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn namespace(&self) -> &InstallationNamespace` | /// 读取载荷所属隔离域，不生成内部target或授绑定资格。 |

### BridgeInternalTargetRef
`shared/locators.rs`；C-LOC。
```rust
/// 正式owner target指针，只能由owner resolver给出kind与scope。
pub struct BridgeInternalTargetRef {
    /// 正式target引用，exact本地kind为BridgeInternalTargetRef。
    authority: SafeAuthorityRef,
    /// owner contract注册的exact target kind。
    owner_target_kind: SafeOpaqueId,
}
```
| 字段 | 类型 | 来源 / 约束 |
|---|---|---|
| authority | `SafeAuthorityRef` | owner target/scope resolver，不能从channel名/ref文本推scope |
| owner_target_kind | `SafeOpaqueId` | owner逐branch正式kind registry；未知未绑定blocked，不新增ownerkind |

| 类别 | 完整签名 | 中文Rustdoc / 副作用 |
|---|---|---|
| 工厂 | `pub fn from_resolver(authority: SafeAuthorityRef, owner_target_kind: SafeOpaqueId) -> Result<Self, ContractViolation>` | /// exact tag/owner/scope一致，复制两字段 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取target来源；不创建Conversation/Turn/Workspace |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn owner_target_kind(&self) -> &SafeOpaqueId` | /// 借用原owner_target_kind字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |


### ParentLocationRefSlot
`shared/locators.rs`；C-LOC。
```rust
/// 父位置是否适用与资格缺失分开，不能默认root或默认channel。
pub enum ParentLocationRefSlot {
    /// source明确为root或无父语义。
    NotApplicable,
    /// 已解释的父位置，载荷与child安装一致。
    Established(ExternalLocationLocator),
    /// 必需父级未建立，载荷为有限原因。
    Missing(SafeReasonCode),
    /// 原父位置失效，载荷仅作历史。
    Stale(ExternalLocationLocator),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| NotApplicable | source明确无父/root | decoder | 不独立迁移，新mapping重解 |
| Established | 已解释父位置，同安装 | decoder | 所属mapping失效到Stale |
| Missing | 必需父级未建立，finite原因 | decoder缺口 | 新mapping完整来源才建立 |
| Stale | 原父位置失效，仅历史 | mapping invalidation | 原mapping不得复活 |
factory为exact variant；NotApplicable不能用于要求thread-parent的动作。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn require_parent(&self) -> Result<&ExternalLocationLocator, ContractViolation>` | /// 仅Established借用原父定位；Missing/Stale/NotApplicable拒绝，不能默认为root或跨安装拼父级。 |

### MappingRef
`shared/locators.rs`；C-REF。
```rust
/// 本地三种mapping的typed联合，禁止跨kind读写。
pub enum MappingRef {
    /// 账号责任mapping。
    Identity(IdentityMappingRef),
    /// 位置target mapping。
    Location(LocationMappingRef),
    /// 原消息结果mapping。
    Message(MessageMappingRef),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Identity | 身份关系ref | 不适用 | 不适用 |
| Location | 位置关系ref | 不适用 | 不适用 |
| Message | 消息回链ref | 不适用 | 不适用 |
factory exact variant；member无；wrong-kind repository lookup拒绝，不downcast。

完整named卡见本节下列独立小节；state不在这些ref上变更。

## 6. Current qualification与原材料/结果组合卡

### CurrentBindingQualification
归属`shared/authority.rs`；本次已核关系资格，缓存引用不能替当前Policy/Gate。
```rust
/// 本次已核关系资格，缓存引用不能替当前Policy/Gate。
pub struct CurrentBindingQualification {
    /// 安装身份。
    installation: BridgeInstallationRef,
    /// 原relation身份。
    binding: ExternalBindingRef,
    /// 精确代际。
    generation: BindingGeneration,
    /// 正式target。
    target: BridgeInternalTargetRef,
    /// 正式责任链。
    actor: ActorResponsibilityRef,
    /// 显式授权依据。
    basis: AuthorizedBindingBasisRef,
    /// 受限方向动作集合。
    actions: BridgeDirectionActionSet,
    /// 各必要依据交集期限。
    validity: SafeValidityWindow,
    /// 此次核验时刻。
    checked_at: SafeInstant,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| installation | `BridgeInstallationRef` | 安装身份；BindingQualificationPort配置/关系一致结果 |
| binding | `ExternalBindingRef` | 原relation身份；同port当前Active关系 |
| generation | `BindingGeneration` | 精确代际；关系store当前generation，非config/cursor |
| target | `BridgeInternalTargetRef` | 正式target；owner resolver |
| actor | `ActorResponsibilityRef` | 正式责任链；ActorResponsibilityPort |
| basis | `AuthorizedBindingBasisRef` | 显式授权依据；BindingQualificationPort |
| actions | `BridgeDirectionActionSet` | 受限方向动作集合；当前正式basis，不扩大配置hint |
| validity | `SafeValidityWindow` | 各必要依据交集期限；port取最严格期限 |
| checked_at | `SafeInstant` | 此次核验时刻；Application受信clock |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(installation: BridgeInstallationRef, binding: ExternalBindingRef, generation: BindingGeneration, target: BridgeInternalTargetRef, actor: ActorResponsibilityRef, basis: AuthorizedBindingBasisRef, actions: BridgeDirectionActionSet, validity: SafeValidityWindow, checked_at: SafeInstant) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_action(&self, action: DirectionActionKind, now: SafeInstant) -> Result<(), ContractViolation>` | /// 纯核已给action/窗口；IO前仍需port当前revoke核验 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn installation(&self) -> &BridgeInstallationRef` | /// 借用原installation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn binding(&self) -> &ExternalBindingRef` | /// 借用原binding字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn generation(&self) -> &BindingGeneration` | /// 借用原generation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn target(&self) -> &BridgeInternalTargetRef` | /// 借用原target字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn actor(&self) -> &ActorResponsibilityRef` | /// 借用原actor字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &AuthorizedBindingBasisRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn actions(&self) -> &BridgeDirectionActionSet` | /// 借用原actions字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn checked_at(&self) -> &SafeInstant` | /// 借用原checked_at字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### AuthorizedMappingContextRef
归属`shared/authority.rs`；原mapping上下文的安全结构指针。
```rust
/// 原mapping上下文的安全结构指针。
pub struct AuthorizedMappingContextRef {
    /// 显式relation。
    binding: ExternalBindingRef,
    /// 当前关系代际。
    generation: BindingGeneration,
    /// 可选账号mapping。
    identity_mapping: Option<IdentityMappingRef>,
    /// 位置mapping。
    location_mapping: LocationMappingRef,
    /// 原change或thread mapping。
    message_mapping: Option<MessageMappingRef>,
    /// 正式内部target。
    target: BridgeInternalTargetRef,
    /// 正式actor责任。
    actor: ActorResponsibilityRef,
    /// 实际受权动作。
    action: DirectionActionKind,
    /// current映射依据。
    basis: AuthorizedBindingBasisRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| binding | `ExternalBindingRef` | 显式relation；MappingRepository及BindingQualificationPort一致读 |
| generation | `BindingGeneration` | 当前关系代际；同read |
| identity_mapping | `Option<IdentityMappingRef>` | 可选账号mapping；该动作需要外部actor时必须Some；否则正式Integration来源 |
| location_mapping | `LocationMappingRef` | 位置mapping；原known locator与owner target |
| message_mapping | `Option<MessageMappingRef>` | 原change或thread mapping；Edit/Delete/Reply要求适用原mapping；Create可None |
| target | `BridgeInternalTargetRef` | 正式内部target；owner resolver与mapping相符 |
| actor | `ActorResponsibilityRef` | 正式actor责任；ActorResponsibilityPort |
| action | `DirectionActionKind` | 实际受权动作；current basis |
| basis | `AuthorizedBindingBasisRef` | current映射依据；BindingQualificationPort |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(binding: ExternalBindingRef, generation: BindingGeneration, identity_mapping: Option<IdentityMappingRef>, location_mapping: LocationMappingRef, message_mapping: Option<MessageMappingRef>, target: BridgeInternalTargetRef, actor: ActorResponsibilityRef, action: DirectionActionKind, basis: AuthorizedBindingBasisRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_matches(&self, current: &CurrentBindingQualification) -> Result<(), ContractViolation>` | /// 校验原binding/generation/target/actor/action；不重解target |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn binding(&self) -> &ExternalBindingRef` | /// 借用原binding字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn generation(&self) -> &BindingGeneration` | /// 借用原generation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn identity_mapping(&self) -> &Option<IdentityMappingRef>` | /// 借用原identity_mapping字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn location_mapping(&self) -> &LocationMappingRef` | /// 借用原location_mapping字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn message_mapping(&self) -> &Option<MessageMappingRef>` | /// 借用原message_mapping字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn target(&self) -> &BridgeInternalTargetRef` | /// 借用原target字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn actor(&self) -> &ActorResponsibilityRef` | /// 借用原actor字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn action(&self) -> &DirectionActionKind` | /// 借用原action字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &AuthorizedBindingBasisRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### CurrentMaterialQualification
归属`shared/material.rs`；本次owner可接收材料资格，不持有材料正文。
```rust
/// 本次owner可接收材料资格，不持有材料正文。
pub struct CurrentMaterialQualification {
    /// 合格材料ref。
    material: QualifiedMaterialRef,
    /// 精确安全来源版本。
    source: SafeSourceVersionRef,
    /// 材料用途target。
    target: BridgeInternalTargetRef,
    /// owner要求的digest引用。
    digest: OwnerRequiredDigestRefSlot,
    /// 获准附件refs。
    attachments: AttachmentGrantRefSet,
    /// 有限使用期限。
    validity: SafeValidityWindow,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| material | `QualifiedMaterialRef` | 合格材料ref；PrivateMaterialPort |
| source | `SafeSourceVersionRef` | 精确安全来源版本；source provider |
| target | `BridgeInternalTargetRef` | 材料用途target；owner协议映射 |
| digest | `OwnerRequiredDigestRefSlot` | owner要求的digest引用；Required分支Established且匹配qualified材料；其余明示NotRequired |
| attachments | `AttachmentGrantRefSet` | 获准附件refs；Artifact传播/省略依据 |
| validity | `SafeValidityWindow` | 有限使用期限；必要来源最严交集 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(material: QualifiedMaterialRef, source: SafeSourceVersionRef, target: BridgeInternalTargetRef, digest: OwnerRequiredDigestRefSlot, attachments: AttachmentGrantRefSet, validity: SafeValidityWindow) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_target(&self, target: &BridgeInternalTargetRef, now: SafeInstant) -> Result<(), ContractViolation>` | /// 只校target/期限/required digest，不读取或hash材料 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn material(&self) -> &QualifiedMaterialRef` | /// 借用原material字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn source(&self) -> &SafeSourceVersionRef` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn target(&self) -> &BridgeInternalTargetRef` | /// 借用原target字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn digest(&self) -> &OwnerRequiredDigestRefSlot` | /// 借用原digest字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn attachments(&self) -> &AttachmentGrantRefSet` | /// 借用原attachments字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### CurrentPresentationQualification
归属`shared/delivery.rs`；本次原projection外显资格，敏感内容不默认降级许可。
```rust
/// 本次原projection外显资格，敏感内容不默认降级许可。
pub struct CurrentPresentationQualification {
    /// current两端关系。
    binding: CurrentBindingQualification,
    /// owner已提交精确source。
    source: CommittedSourceVersionRef,
    /// 获准外显projection。
    projection: AllowedProjectionRef,
    /// 内容与存在性/提示/入口依据。
    disclosure: DisclosureQualificationRef,
    /// 获准或可省略附件集合。
    attachments: AttachmentGrantRefSet,
    /// 当前平台presentation/method能力。
    capability: CapabilitySnapshotRef,
    /// 明确full或无动作降级。
    kind: QualifiedPresentationKind,
    /// 当前核验时刻。
    checked_at: SafeInstant,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| binding | `CurrentBindingQualification` | current两端关系；BindingQualificationPort |
| source | `CommittedSourceVersionRef` | owner已提交精确source；PresentationQualificationPort |
| projection | `AllowedProjectionRef` | 获准外显projection；owner/Governance safe projection |
| disclosure | `DisclosureQualificationRef` | 内容与存在性/提示/入口依据；owner逐层许可 |
| attachments | `AttachmentGrantRefSet` | 获准或可省略附件集合；Artifact正式grant |
| capability | `CapabilitySnapshotRef` | 当前平台presentation/method能力；qualified adapter |
| kind | `QualifiedPresentationKind` | 明确full或无动作降级；owner safe disclosure输出 |
| checked_at | `SafeInstant` | 当前核验时刻；受信clock |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(binding: CurrentBindingQualification, source: CommittedSourceVersionRef, projection: AllowedProjectionRef, disclosure: DisclosureQualificationRef, attachments: AttachmentGrantRefSet, capability: CapabilitySnapshotRef, kind: QualifiedPresentationKind, checked_at: SafeInstant) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_original(&self, source: &CommittedSourceVersionRef, target: &ImmutableDeliveryTargetRef) -> Result<(), ContractViolation>` | /// 纯比较原source/projection/target/generation，不能在同effect换plan |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn binding(&self) -> &CurrentBindingQualification` | /// 借用原binding字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn source(&self) -> &CommittedSourceVersionRef` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn projection(&self) -> &AllowedProjectionRef` | /// 借用原projection字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn disclosure(&self) -> &DisclosureQualificationRef` | /// 借用原disclosure字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn attachments(&self) -> &AttachmentGrantRefSet` | /// 借用原attachments字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn capability(&self) -> &CapabilitySnapshotRef` | /// 借用原capability字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn kind(&self) -> &QualifiedPresentationKind` | /// 借用原kind字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn checked_at(&self) -> &SafeInstant` | /// 借用原checked_at字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### CurrentActionQualification
归属`shared/authority.rs`；本次callback业务动作完整资格，来源签名不等审批权。
```rust
/// 本次callback业务动作完整资格，来源签名不等审批权。
pub struct CurrentActionQualification {
    /// 当前relation/责任。
    binding: CurrentBindingQualification,
    /// 正式owner动作目标。
    action: OwnerTargetActionRef,
    /// 当前Gate等owner状态版本。
    owner_revision: OwnerActionStateRevision,
    /// 动作授权。
    authorization: ActionAuthorizationBasisRef,
    /// 真实期限与one-use依据。
    expiry: ActionExpiryOneUseRef,
    /// 完整platform/source/actor/target/action验证。
    verification: CallbackVerificationRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| binding | `CurrentBindingQualification` | 当前relation/责任；BindingQualificationPort/ActorResponsibilityPort |
| action | `OwnerTargetActionRef` | 正式owner动作目标；OwnerActionPort |
| owner_revision | `OwnerActionStateRevision` | 当前Gate等owner状态版本；OwnerActionPort，不以按钮状态代替 |
| authorization | `ActionAuthorizationBasisRef` | 动作授权；OwnerActionPort正式责任链 |
| expiry | `ActionExpiryOneUseRef` | 真实期限与one-use依据；正式expiry/CallbackRepository |
| verification | `CallbackVerificationRef` | 完整platform/source/actor/target/action验证；CallbackVerificationPort及owner复核 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(binding: CurrentBindingQualification, action: OwnerTargetActionRef, owner_revision: OwnerActionStateRevision, authorization: ActionAuthorizationBasisRef, expiry: ActionExpiryOneUseRef, verification: CallbackVerificationRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_binding(&self, binding: &ExternalActionBindingRef, now: SafeInstant) -> Result<(), ContractViolation>` | /// 比对verification绑定原action身份/期限；one-use原子消费仍归Application/UoW |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn binding(&self) -> &CurrentBindingQualification` | /// 借用原binding字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn action(&self) -> &OwnerTargetActionRef` | /// 借用原action字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn owner_revision(&self) -> &OwnerActionStateRevision` | /// 借用原owner_revision字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn authorization(&self) -> &ActionAuthorizationBasisRef` | /// 借用原authorization字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn expiry(&self) -> &ActionExpiryOneUseRef` | /// 借用原expiry字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn verification(&self) -> &CallbackVerificationRef` | /// 借用原verification字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### CurrentReadQualification
归属`shared/authority.rs`；本次读取解析和visibility结果，不是durable权限truth。
```rust
/// 本次读取解析和visibility结果，不是durable权限truth。
pub struct CurrentReadQualification {
    /// 当前正式stage与count披露规则。
    disclosure: ReadDisclosureRules,
    /// 内部已解析read subject。
    subject: BridgeViewSubjectRef,
    /// 有效读取actor。
    actor: ActorRef,
    /// 正式read scope依据。
    scope: AuthorizedReadScopeRef,
    /// 当前可见/降级/拒绝/不可用。
    disposition: SafeViewDisposition,
    /// 仅当前可披露refs。
    visible_refs: VisibleSafeRefSet,
    /// 当前read资格期限。
    validity: SafeValidityWindow,
    /// 本次解析来源。
    source: SafeAuthoritySourceRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| subject | `BridgeViewSubjectRef` | 内部已解析read subject；SafeReadQualificationPort，denied不对外复制 |
| disclosure | `ReadDisclosureRules` | resolver-first正式字段级stage/count规则；不由已加载ref推全部可见 |
| actor | `ActorRef` | 有效读取actor；trusted ActorContext，display_name清除 |
| scope | `AuthorizedReadScopeRef` | 正式read scope依据；resolver-first，非loaded ref反推 |
| disposition | `SafeViewDisposition` | 当前可见/降级/拒绝/不可用；正式visibility输出 |
| visible_refs | `VisibleSafeRefSet` | 仅当前可披露refs；visibility过滤，count按同资格 |
| validity | `SafeValidityWindow` | 当前read资格期限；正式resolver/decision交集 |
| source | `SafeAuthoritySourceRef` | 本次解析来源；同resolver版本 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(disclosure: ReadDisclosureRules, subject: BridgeViewSubjectRef, actor: ActorRef, scope: AuthorizedReadScopeRef, disposition: SafeViewDisposition, visible_refs: VisibleSafeRefSet, validity: SafeValidityWindow, source: SafeAuthoritySourceRef) -> Result<Self, ContractViolation>` | /// 全字段输入并核同scope/source/version和规则，拒绝默认披露，不产生IO。 |
| 成员 | `pub fn permits_view(&self, now: SafeInstant) -> bool` | /// 仅Qualified/Degraded且未到期允许组装；零write，not-visible不等missing |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn disclosure(&self) -> &ReadDisclosureRules` | /// 借用原disclosure字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn subject(&self) -> &BridgeViewSubjectRef` | /// 借用原subject字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn actor(&self) -> &ActorRef` | /// 借用原actor字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn scope(&self) -> &AuthorizedReadScopeRef` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn disposition(&self) -> &SafeViewDisposition` | /// 借用原disposition字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn visible_refs(&self) -> &VisibleSafeRefSet` | /// 借用原visible_refs字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn source(&self) -> &SafeAuthoritySourceRef` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### SafeSourceVersionRef
归属`shared/material.rs`；安全可读来源与精确版本组合。
```rust
/// 安全可读来源与精确版本组合。
pub struct SafeSourceVersionRef {
    /// 可读safe来源。
    source: SafeSourceRef,
    /// source精确版本。
    revision: SafeRevision,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| source | `SafeSourceRef` | 可读safe来源；source provider/PrivateMaterialPort |
| revision | `SafeRevision` | source精确版本；同来源version；不允许raw-body hash |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(source: SafeSourceRef, revision: SafeRevision) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn source(&self) -> &SafeSourceRef` | /// 读取safe source，不拉正文 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn revision(&self) -> &SafeRevision` | /// 借用原revision字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### CommittedSourceVersionRef
归属`shared/material.rs`；owner已提交来源版本，不由平台ACK生成。
```rust
/// owner已提交来源版本，不由平台ACK生成。
pub struct CommittedSourceVersionRef {
    /// 安全source/version。
    source: SafeSourceVersionRef,
    /// owner提交结果依据。
    committed_basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| source | `SafeSourceVersionRef` | 安全source/version；owner正式committed event/query |
| committed_basis | `SafeAuthorityRef` | owner提交结果依据；exact本地kind CommittedSourceVersionRef；owner contract解引用，不是本地commit |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(source: SafeSourceVersionRef, committed_basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_same(&self, other: &Self) -> Result<(), ContractViolation>` | /// 判等owner/source/version，不能从current truth替换原版本 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn source(&self) -> &SafeSourceVersionRef` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn committed_basis(&self) -> &SafeAuthorityRef` | /// 借用原committed_basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### AttachmentGrantRefSet
归属`shared/material.rs`；受权附件引用集合，空集合必须是正式明确无附件或可省略。
```rust
/// 受权附件引用集合，空集合必须是正式明确无附件或可省略。
pub struct AttachmentGrantRefSet {
    /// 附件grant集合。
    grants: Vec<AttachmentGrantRef>,
    /// 必需附件可省略依据。
    omission_basis: Option<SafeAuthorityRef>,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| grants | `Vec<AttachmentGrantRef>` | 附件grant集合；PresentationQualificationPort/Artifact；按ref去重并稳定排序，empty须正式许可 |
| omission_basis | `Option<SafeAuthorityRef>` | 必需附件可省略依据；exact kind AttachmentGrantRefSet；必需材料被省略时Some，否则None |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(grants: Vec<AttachmentGrantRef>, omission_basis: Option<SafeAuthorityRef>) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn grants(&self) -> &[AttachmentGrantRef]` | /// 读取获准refs，不给公开URL/内容 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn omission_basis(&self) -> &Option<SafeAuthorityRef>` | /// 借用原omission_basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：同scope/版本/期限；未知或必需grant缺失不能用empty替代；附件次序若owner语义有序须到Step7显式绑定原序，不重排正文

### StableSourceProjectionRef
归属`shared/delivery.rs`；固定source/projection精确版本，重试不能换义。
```rust
/// 固定source/projection精确版本，重试不能换义。
pub struct StableSourceProjectionRef {
    /// owner原committed来源。
    source: CommittedSourceVersionRef,
    /// 原获准projection版本。
    projection: AllowedProjectionRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| source | `CommittedSourceVersionRef` | owner原committed来源；prepare读取结果 |
| projection | `AllowedProjectionRef` | 原获准projection版本；PresentationQualificationPort |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(source: CommittedSourceVersionRef, projection: AllowedProjectionRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn matches(&self, current: &CurrentPresentationQualification) -> bool` | /// 比较原source/projection，失效拒绝不改写 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn source(&self) -> &CommittedSourceVersionRef` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn projection(&self) -> &AllowedProjectionRef` | /// 借用原projection字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### ImmutableDeliveryTargetRef
归属`shared/delivery.rs`；一次effect不可变外部target与关系代际。
```rust
/// 一次effect不可变外部target与关系代际。
pub struct ImmutableDeliveryTargetRef {
    /// 原安装identity。
    installation: BridgeInstallationRef,
    /// 原channel/DM/topic/thread。
    location: ExternalLocationLocator,
    /// Edit/Delete/Reply原消息。
    message: Option<ExternalMessageLocator>,
    /// 原relation。
    binding: ExternalBindingRef,
    /// 原relation代际。
    generation: BindingGeneration,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| installation | `BridgeInstallationRef` | 原安装identity；current relation |
| location | `ExternalLocationLocator` | 原channel/DM/topic/thread；qualified location mapping |
| message | `Option<ExternalMessageLocator>` | Edit/Delete/Reply原消息；原known mapping；Send可None；Reply按平台root合同 |
| binding | `ExternalBindingRef` | 原relation；current binding |
| generation | `BindingGeneration` | 原relation代际；qualified snapshot |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(installation: BridgeInstallationRef, location: ExternalLocationLocator, message: Option<ExternalMessageLocator>, binding: ExternalBindingRef, generation: BindingGeneration) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_same(&self, other: &Self) -> Result<(), ContractViolation>` | /// 五字段exact判等，原namespace/parent/root不能silent fallback |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn installation(&self) -> &BridgeInstallationRef` | /// 借用原installation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn location(&self) -> &ExternalLocationLocator` | /// 借用原location字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn message(&self) -> &Option<ExternalMessageLocator>` | /// 借用原message字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn binding(&self) -> &ExternalBindingRef` | /// 借用原binding字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn generation(&self) -> &BindingGeneration` | /// 借用原generation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### DeliveryIntentEffectRef
归属`shared/delivery.rs`；原intent/effect组合。
```rust
/// 原intent/effect组合。
pub struct DeliveryIntentEffectRef {
    /// existing intent。
    intent: DeliveryIntentRef,
    /// 原稳定effect。
    effect: DeliveryEffectRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| intent | `DeliveryIntentRef` | existing intent；DeliveryRepository |
| effect | `DeliveryEffectRef` | 原稳定effect；同intent不可变字段 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(intent: DeliveryIntentRef, effect: DeliveryEffectRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn effect(&self) -> &DeliveryEffectRef` | /// 读取原effect |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn intent(&self) -> &DeliveryIntentRef` | /// 借用原intent字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### AttemptEffectRef
归属`shared/delivery.rs`；原attempt/intent/effect完整回链。
```rust
/// 原attempt/intent/effect完整回链。
pub struct AttemptEffectRef {
    /// 原attempt。
    attempt: AttemptRef,
    /// 原intent/effect。
    intent_effect: DeliveryIntentEffectRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| attempt | `AttemptRef` | 原attempt；DeliveryRepository |
| intent_effect | `DeliveryIntentEffectRef` | 原intent/effect；同attempt已存关联 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(attempt: AttemptRef, intent_effect: DeliveryIntentEffectRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn effect(&self) -> &DeliveryEffectRef` | /// 读取原effect，不mint新attempt |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn attempt(&self) -> &AttemptRef` | /// 借用原attempt字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn intent_effect(&self) -> &DeliveryIntentEffectRef` | /// 借用原intent_effect字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### NoEffectBasisRef
归属`shared/delivery.rs`；权威同原subject/op/effect明确无效果依据。
```rust
/// 权威同原subject/op/effect明确无效果依据。
pub struct NoEffectBasisRef {
    /// 原op/effect。
    original: OriginalOperationEffectRef,
    /// 原subject。
    subject: OriginalRecoverableSubjectRef,
    /// same operation/effect无效果证明。
    authority: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| original | `OriginalOperationEffectRef` | 原op/effect；existing snapshot |
| subject | `OriginalRecoverableSubjectRef` | 原subject；same original read |
| authority | `SafeAuthorityRef` | same operation/effect无效果证明；exact kind NoEffectBasisRef；PlatformDeliveryPort/AuthoritativeRecoveryPort/owner结果proof |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(original: OriginalOperationEffectRef, subject: OriginalRecoverableSubjectRef, authority: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_original(&self, original: &OriginalOperationEffectRef) -> Result<(), ContractViolation>` | /// 纯校原op/effect；timeout/lease/NotFound不是来源 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn original(&self) -> &OriginalOperationEffectRef` | /// 借用原original字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn subject(&self) -> &OriginalRecoverableSubjectRef` | /// 借用原subject字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn authority(&self) -> &SafeAuthorityRef` | /// 借用原authority字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### RetryEligibilityRef
归属`shared/delivery.rs`；原effect受限重试资格，不许可自动发送。
```rust
/// 原effect受限重试资格，不许可自动发送。
pub struct RetryEligibilityRef {
    /// 权威no-effect证明。
    no_effect: NoEffectBasisRef,
    /// 窗口内受权预算。
    budget: RetryBudgetRef,
    /// 原plan完整current资格。
    presentation: CurrentPresentationQualification,
    /// 受权调用窗口。
    window: AuthorizedAttemptWindowRef,
    /// 所有有效rate/backoff等待下界最大值。
    not_before: SafeInstant,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| no_effect | `NoEffectBasisRef` | 权威no-effect证明；same-op/effect authoritative result |
| budget | `RetryBudgetRef` | 窗口内受权预算；current port |
| presentation | `CurrentPresentationQualification` | 原plan完整current资格；presentation/binding/Artifact |
| window | `AuthorizedAttemptWindowRef` | 受权调用窗口；same original provider |
| not_before | `SafeInstant` | 所有有效rate/backoff等待下界最大值；qualified bounds，不用config缩短 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(no_effect: NoEffectBasisRef, budget: RetryBudgetRef, presentation: CurrentPresentationQualification, window: AuthorizedAttemptWindowRef, not_before: SafeInstant) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn not_before(&self) -> &SafeInstant` | /// 读取最严格下界，不读clock |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn no_effect(&self) -> &NoEffectBasisRef` | /// 借用原no_effect字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn budget(&self) -> &RetryBudgetRef` | /// 借用原budget字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn presentation(&self) -> &CurrentPresentationQualification` | /// 借用原presentation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn window(&self) -> &AuthorizedAttemptWindowRef` | /// 借用原window字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### OwnerAcceptedRef
归属`shared/material.rs`；owner已知accepted fact或manifestation引用，不是Turn。
```rust
/// owner已知accepted fact或manifestation引用，不是Turn。
pub struct OwnerAcceptedRef {
    /// owner正式target。
    target: BridgeInternalTargetRef,
    /// 正式accepted结果ref及版本。
    result: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| target | `BridgeInternalTargetRef` | owner正式target；Conversation结果 |
| result | `SafeAuthorityRef` | 正式accepted结果ref及版本；exact kind OwnerAcceptedRef；owner authoritative response |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(target: BridgeInternalTargetRef, result: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn target(&self) -> &BridgeInternalTargetRef` | /// 读取owner结果target |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn result(&self) -> &SafeAuthorityRef` | /// 借用原result字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### OwnerHandoffResultRef
归属`shared/material.rs`；原owner入站交接实际结果分类。
```rust
/// 原owner入站交接实际结果分类。
pub struct OwnerHandoffResultRef {
    /// 原owner operation。
    operation: BridgeOperationRef,
    /// accepted/rejected/pending/unknown。
    kind: OwnerResultKind,
    /// 正式accepted ref。
    accepted: OwnerAcceptedRefSlot,
    /// owner结果来源。
    authority: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| operation | `BridgeOperationRef` | 原owner operation；ConversationHandoffPort原op结果 |
| kind | `OwnerResultKind` | accepted/rejected/pending/unknown；正式owner分类，不能由平台ACK映射 |
| accepted | `OwnerAcceptedRefSlot` | 正式accepted ref；Accepted必须Established，其他分支不能假造 |
| authority | `SafeAuthorityRef` | owner结果来源；exact kind OwnerHandoffResultRef，missing/NotFound不能推no-effect |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(operation: BridgeOperationRef, kind: OwnerResultKind, accepted: OwnerAcceptedRefSlot, authority: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn kind(&self) -> &OwnerResultKind` | /// 读取owner阶段，不改Turn |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn operation(&self) -> &BridgeOperationRef` | /// 借用原operation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn accepted(&self) -> &OwnerAcceptedRefSlot` | /// 借用原accepted字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn authority(&self) -> &SafeAuthorityRef` | /// 借用原authority字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### PlatformBusinessResultRef
归属`shared/delivery.rs`；原attempt已知平台业务结果的安全结构。
```rust
/// 原attempt已知平台业务结果的安全结构。
pub struct PlatformBusinessResultRef {
    /// 原attempt/effect。
    attempt: AttemptEffectRef,
    /// 已知业务accepted/rejected。
    kind: KnownPlatformBusinessResultKind,
    /// 真实结果来源。
    authority: PlatformResultAuthorityRef,
    /// 结果可解释的原消息定位。
    locator: VerifiedExternalMessageLocatorSlot,
    /// 真实no-effect依据。
    no_effect: NoEffectBasisRefSlot,
    /// finite结果理由。
    reason: SafeReasonCode,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| attempt | `AttemptEffectRef` | 原attempt/effect；qualified platform result |
| kind | `KnownPlatformBusinessResultKind` | 已知业务accepted/rejected；adapter实际business mapping |
| authority | `PlatformResultAuthorityRef` | 真实结果来源；逐adapter/method合同 |
| locator | `VerifiedExternalMessageLocatorSlot` | 结果可解释的原消息定位；create accepted等按method需要Established；delete/no-new-locator明示NotApplicable |
| no_effect | `NoEffectBasisRefSlot` | 真实no-effect依据；只有正式权威无效果可Established |
| reason | `SafeReasonCode` | finite结果理由；adapter清洗，非raw error |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(attempt: AttemptEffectRef, kind: KnownPlatformBusinessResultKind, authority: PlatformResultAuthorityRef, locator: VerifiedExternalMessageLocatorSlot, no_effect: NoEffectBasisRefSlot, reason: SafeReasonCode) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn effect(&self) -> &DeliveryEffectRef` | /// 读取结果关联，unknown不得构造本对象 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn attempt(&self) -> &AttemptEffectRef` | /// 借用原attempt字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn kind(&self) -> &KnownPlatformBusinessResultKind` | /// 借用原kind字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn authority(&self) -> &PlatformResultAuthorityRef` | /// 借用原authority字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn locator(&self) -> &VerifiedExternalMessageLocatorSlot` | /// 借用原locator字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn no_effect(&self) -> &NoEffectBasisRefSlot` | /// 借用原no_effect字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn reason(&self) -> &SafeReasonCode` | /// 借用原reason字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### KnownPlatformBusinessResult
归属`shared/delivery.rs`；platform port的已知结果载体，不含统一delivered。
```rust
/// platform port的已知结果载体，不含统一delivered。
pub struct KnownPlatformBusinessResult {
    /// known安全业务结果。
    result: PlatformBusinessResultRef,
    /// 同次调用已核limit下界。
    rate_bounds: QualifiedRateLimitBoundSet,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| result | `PlatformBusinessResultRef` | known安全业务结果；PlatformDeliveryPort真实转换 |
| rate_bounds | `QualifiedRateLimitBoundSet` | 同次调用已核limit下界；合格platform adapter；不能丢global bounds |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(result: PlatformBusinessResultRef, rate_bounds: QualifiedRateLimitBoundSet) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn result(&self) -> &PlatformBusinessResultRef` | /// 读取已知结果，仅local finalize |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn rate_bounds(&self) -> &QualifiedRateLimitBoundSet` | /// 借用原rate_bounds字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### LocalAttemptDispositionRef
归属`shared/delivery.rs`；本地claim释放依据不证明外部无效果。
```rust
/// 本地claim释放依据不证明外部无效果。
pub struct LocalAttemptDispositionRef {
    /// 原attempt/effect。
    attempt: AttemptEffectRef,
    /// KnownFinal/Unknown/NoIo。
    kind: LocalAttemptDispositionKind,
    /// local release依据。
    basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| attempt | `AttemptEffectRef` | 原attempt/effect；existing store |
| kind | `LocalAttemptDispositionKind` | KnownFinal/Unknown/NoIo；Application基于实际结果分类 |
| basis | `SafeAuthorityRef` | local release依据；exact kind LocalAttemptDispositionRef；qualified store/verified结果 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(attempt: AttemptEffectRef, kind: LocalAttemptDispositionKind, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn attempt(&self) -> &AttemptEffectRef` | /// 读取local释放关联，Unknown仍阻依赖越过 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn kind(&self) -> &LocalAttemptDispositionKind` | /// 借用原kind字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### OwnerTargetActionRef
归属`shared/callback.rs`；owner正式动作目标，不能从按钮或label猜。
```rust
/// owner正式动作目标，不能从按钮或label猜。
pub struct OwnerTargetActionRef {
    /// 正式owner target。
    target: BridgeInternalTargetRef,
    /// exact owner命令种类。
    kind: OwnerActionKind,
    /// 动作目标与scope来源。
    basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| target | `BridgeInternalTargetRef` | 正式owner target；OwnerActionPort resolver |
| kind | `OwnerActionKind` | exact owner命令种类；RecordApprovalVote/RecordGovernanceDecision正式合同，adapter兼容未核仍blocked |
| basis | `SafeAuthorityRef` | 动作目标与scope来源；exact kind OwnerTargetActionRef |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(target: BridgeInternalTargetRef, kind: OwnerActionKind, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn target(&self) -> &BridgeInternalTargetRef` | /// 读取owner目标，不执行approve |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn kind(&self) -> &OwnerActionKind` | /// 借用原kind字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### OwnerActionResultRef
归属`shared/callback.rs`；原callback owner动作实际结果，不拥有Decision。
```rust
/// 原callback owner动作实际结果，不拥有Decision。
pub struct OwnerActionResultRef {
    /// 原owner action op。
    operation: BridgeOperationRef,
    /// 原正式动作。
    action: OwnerTargetActionRef,
    /// 实际owner结果分类。
    kind: OwnerResultKind,
    /// owner result引用。
    result: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| operation | `BridgeOperationRef` | 原owner action op；OwnerActionPort |
| action | `OwnerTargetActionRef` | 原正式动作；same operation结果 |
| kind | `OwnerResultKind` | 实际owner结果分类；正式返回或同op authoritative probe |
| result | `SafeAuthorityRef` | owner result引用；exact kind OwnerActionResultRef；Accepted必须真实owner accepted |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(operation: BridgeOperationRef, action: OwnerTargetActionRef, kind: OwnerResultKind, result: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn kind(&self) -> &OwnerResultKind` | /// 读取owner动作阶段，不以ACK或按钮变化映射 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn operation(&self) -> &BridgeOperationRef` | /// 借用原operation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn action(&self) -> &OwnerTargetActionRef` | /// 借用原action字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn result(&self) -> &SafeAuthorityRef` | /// 借用原result字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### SourceIntentMessageRef
归属`shared/callback.rs`；获准action所绑定的原intent和known message关系。
```rust
/// 获准action所绑定的原intent和known message关系。
pub struct SourceIntentMessageRef {
    /// 原外显intent/effect。
    intent: DeliveryIntentEffectRef,
    /// known外部消息mapping。
    message: MessageMappingRef,
    /// 原owner提交source。
    source: CommittedSourceVersionRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| intent | `DeliveryIntentEffectRef` | 原外显intent/effect；existing DeliveryRepository |
| message | `MessageMappingRef` | known外部消息mapping；known platform result回链，unknown不造 |
| source | `CommittedSourceVersionRef` | 原owner提交source；同intent source |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(intent: DeliveryIntentEffectRef, message: MessageMappingRef, source: CommittedSourceVersionRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn message(&self) -> &MessageMappingRef` | /// 读取原message关系，不重绑其他target |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn intent(&self) -> &DeliveryIntentEffectRef` | /// 借用原intent字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn source(&self) -> &CommittedSourceVersionRef` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。


## 7. Domain共享state

### BridgeInstallationState
归属`shared/authority.rs`；C-STATE；exact Rust标签与02 snake_case按PascalCase机械映射。
```rust
/// 本地配置可执行阶段，不是平台安装truth。
pub enum BridgeInstallationState {
    /// 配置接纳但未证明required seam。
    Configured,
    /// 当前seam资格成立，不替业务授权。
    Qualified,
    /// 必要seam缺失或失效。
    Blocked,
    /// 受权停用阻新IO。
    Suspended,
    /// 本地配置停用终态。
    Retired,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Configured | 配置接纳但未证明required seam | configure；Suspended受权重启 | Qualified/Blocked/Suspended/Retired |
| Qualified | 当前seam资格成立，不替业务授权 | Configured/Blocked，经J05 current资格 | Blocked/Suspended/Retired |
| Blocked | 必要seam缺失或失效 | Configured/Qualified，经维护 | Qualified/Suspended/Retired |
| Suspended | 受权停用阻新IO | Configured/Qualified/Blocked | Configured/Retired |
| Retired | 本地配置停用终态 | 任一非终态受权退役 | 无 |
无state自行修改方法；factory初值由所属对象卡固定；所属Domain成员控制迁移。未列边禁止，全部guard/trigger矩阵只在Step10展开；标签不能由HTTP/ACK/lease/free-text映射成成功。

### ExternalBindingState
归属`shared/authority.rs`；C-STATE；exact Rust标签与02 snake_case按PascalCase机械映射。
```rust
/// 显式relation局部阶段。
pub enum ExternalBindingState {
    /// 正式必要依据尚未齐。
    Pending,
    /// 当前relation可消费，每IO仍核owner。
    Active,
    /// 阻新动作与旧排队。
    Suspended,
    /// 原relation撤销终态。
    Revoked,
    /// 正式期限到期终态。
    Expired,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Pending | 正式必要依据尚未齐 | propose | Active/Revoked/Expired |
| Active | 当前relation可消费，每IO仍核owner | Pending/Suspended完整受权激活 | Suspended/Revoked/Expired |
| Suspended | 阻新动作与旧排队 | Active受权暂停 | Active重新授权新generation；Revoked/Expired |
| Revoked | 原relation撤销终态 | Pending/Active/Suspended | 无 |
| Expired | 正式期限到期终态 | Pending/Active/Suspended | 无 |
无state自行修改方法；factory初值由所属对象卡固定；所属Domain成员控制迁移。未列边禁止，全部guard/trigger矩阵只在Step10展开；标签不能由HTTP/ACK/lease/free-text映射成成功。

### IdentityMappingState
归属`shared/authority.rs`；C-STATE；exact Rust标签与02 snake_case按PascalCase机械映射。
```rust
/// 账号责任局部mapping阶段。
pub enum IdentityMappingState {
    /// 两端当前关系可消费。
    Valid,
    /// 原basis或generation失效。
    Stale,
    /// 局部关系撤销终态。
    Revoked,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Valid | 两端当前关系可消费 | 新mapping link | Stale/Revoked |
| Stale | 原basis或generation失效 | Valid | Revoked |
| Revoked | 局部关系撤销终态 | Valid/Stale | 无 |
无state自行修改方法；factory初值由所属对象卡固定；所属Domain成员控制迁移。未列边禁止，全部guard/trigger矩阵只在Step10展开；标签不能由HTTP/ACK/lease/free-text映射成成功。

### LocationMappingState
归属`shared/authority.rs`；C-STATE；exact Rust标签与02 snake_case按PascalCase机械映射。
```rust
/// 位置target局部mapping阶段。
pub enum LocationMappingState {
    /// 位置kind父子及target依据成立。
    Valid,
    /// 定位或basis代际失效。
    Stale,
    /// 局部关系撤销终态。
    Revoked,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Valid | 位置kind父子及target依据成立 | 新mapping link | Stale/Revoked |
| Stale | 定位或basis代际失效 | Valid | Revoked |
| Revoked | 局部关系撤销终态 | Valid/Stale | 无 |
无state自行修改方法；factory初值由所属对象卡固定；所属Domain成员控制迁移。未列边禁止，全部guard/trigger矩阵只在Step10展开；标签不能由HTTP/ACK/lease/free-text映射成成功。

### MessageMappingState
归属`shared/material.rs`；C-STATE；exact Rust标签与02 snake_case按PascalCase机械映射。
```rust
/// 原消息已知结果回链阶段。
pub enum MessageMappingState {
    /// 原定位与known结果关联成立。
    Linked,
    /// 当前消费依据失效，保原locator。
    Stale,
    /// 原变化受权删除结果，非删除ownertruth。
    Tombstoned,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Linked | 原定位与known结果关联成立 | link_known | Stale/Tombstoned |
| Stale | 当前消费依据失效，保原locator | Linked | Tombstoned仅原locator known delete |
| Tombstoned | 原变化受权删除结果，非删除ownertruth | Linked/Stale | 无 |
无state自行修改方法；factory初值由所属对象卡固定；所属Domain成员控制迁移。未列边禁止，全部guard/trigger矩阵只在Step10展开；标签不能由HTTP/ACK/lease/free-text映射成成功。

### InboundHandoffState
归属`shared/material.rs`；C-STATE；exact Rust标签与02 snake_case按PascalCase机械映射。
```rust
/// 入站局部交接阶段，与ACK和Turn独立。
pub enum InboundHandoffState {
    /// 来源验证成立，内部资格未必齐。
    Verified,
    /// 材料或内部资格缺口。
    Blocked,
    /// 伪来源、回环、冲突或原mapping缺失。
    Quarantined,
    /// 原op已durable接管，可能交owner。
    HandoffPending,
    /// owner正式accepted fact或manifestation。
    OwnerAccepted,
    /// owner确定拒绝。
    OwnerRejected,
    /// owner效果可能发生，结果未知。
    Indeterminate,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Verified | 来源验证成立，内部资格未必齐 | from_verified | Blocked/Quarantined/HandoffPending |
| Blocked | 材料或内部资格缺口 | Verified | HandoffPending仅同op no-effect/source/current全资格 |
| Quarantined | 伪来源、回环、冲突或原mapping缺失 | Verified | 无 |
| HandoffPending | 原op已durable接管，可能交owner | Verified/合格Blocked/权威no-effect的Indeterminate | OwnerAccepted/OwnerRejected/Indeterminate |
| OwnerAccepted | owner正式accepted fact或manifestation | HandoffPending/Indeterminate同op权威结果 | 无 |
| OwnerRejected | owner确定拒绝 | HandoffPending/Indeterminate同op权威结果 | 无 |
| Indeterminate | owner效果可能发生，结果未知 | HandoffPending | OwnerAccepted/OwnerRejected；权威no-effect才HandoffPending |
无state自行修改方法；factory初值由所属对象卡固定；所属Domain成员控制迁移。未列边禁止，全部guard/trigger矩阵只在Step10展开；标签不能由HTTP/ACK/lease/free-text映射成成功。

### PresentationState
归属`shared/delivery.rs`；C-STATE；exact Rust标签与02 snake_case按PascalCase机械映射。
```rust
/// 原plan的安全外显资格。
pub enum PresentationState {
    /// 完整内容获准，非永久授权。
    Qualified,
    /// 明确获准无敏感无动作降级。
    Degraded,
    /// 必要外显依据不成立。
    Blocked,
    /// 原版本或target期限不适用。
    Stale,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Qualified | 完整内容获准，非永久授权 | prepare完整资格 | Stale/Blocked |
| Degraded | 明确获准无敏感无动作降级 | prepare明确降级资格 | Stale/Blocked |
| Blocked | 必要外显依据不成立 | prepare缺口；Qualified/Degraded失效 | 无，不复活原plan |
| Stale | 原版本或target期限不适用 | Qualified/Degraded | 无，新含义必须新plan |
无state自行修改方法；factory初值由所属对象卡固定；所属Domain成员控制迁移。未列边禁止，全部guard/trigger矩阵只在Step10展开；标签不能由HTTP/ACK/lease/free-text映射成成功。

### DeliveryIntentState
归属`shared/delivery.rs`；C-STATE；exact Rust标签与02 snake_case按PascalCase机械映射。
```rust
/// 原逻辑effect的局部交付阶段。
pub enum DeliveryIntentState {
    /// 含义固化未外呼。
    Planned,
    /// 当前claim成立且可能有外呼。
    Dispatching,
    /// 已知无效果及完整受限重试资格。
    RetryWait,
    /// 已知平台业务接受，不等送达已读。
    PlatformAccepted,
    /// 确定终态拒绝或不具retry资格。
    KnownRejected,
    /// 原effect可能发生但结果未知。
    Indeterminate,
    /// 当前资格或原材料缺口。
    Blocked,
    /// 无能力或合法降级终态。
    Unsupported,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Planned | 含义固化未外呼 | from_plan；合格Blocked原含义恢复 | Dispatching/Blocked/Unsupported |
| Dispatching | 当前claim成立且可能有外呼 | Planned/RetryWait | PlatformAccepted/KnownRejected/RetryWait/Indeterminate |
| RetryWait | 已知无效果及完整受限重试资格 | Dispatching/权威no-effect的Indeterminate | Dispatching/Blocked/Unsupported |
| PlatformAccepted | 已知平台业务接受，不等送达已读 | Dispatching/Indeterminate权威结果 | 无 |
| KnownRejected | 确定终态拒绝或不具retry资格 | Dispatching/Indeterminate权威结果 | 无 |
| Indeterminate | 原effect可能发生但结果未知 | Dispatching | PlatformAccepted/KnownRejected；权威no-effect才RetryWait |
| Blocked | 当前资格或原材料缺口 | Planned/RetryWait | Planned仅原plan/含义仍有效且无效果已证 |
| Unsupported | 无能力或合法降级终态 | Planned/RetryWait | 无 |
无state自行修改方法；factory初值由所属对象卡固定；所属Domain成员控制迁移。未列边禁止，全部guard/trigger矩阵只在Step10展开；标签不能由HTTP/ACK/lease/free-text映射成成功。

### DeliveryAttemptState
归属`shared/delivery.rs`；C-STATE；exact Rust标签与02 snake_case按PascalCase机械映射。
```rust
/// 一次attempt局部IO事实。
pub enum DeliveryAttemptState {
    /// 局部claim准备，尚未证明已IO。
    Claimed,
    /// 请求可能离开private seam。
    InFlight,
    /// 权威known business accepted。
    KnownAccepted,
    /// 权威known business rejection，retry另核。
    KnownRejected,
    /// 无法证明原attempt效果。
    Indeterminate,
    /// 有权威证明请求未离开。
    NotDispatched,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Claimed | 局部claim准备，尚未证明已IO | claim_for | InFlight/NotDispatched/Indeterminate |
| InFlight | 请求可能离开private seam | Claimed | KnownAccepted/KnownRejected/Indeterminate |
| KnownAccepted | 权威known business accepted | InFlight/Indeterminate同attempt结果 | 无 |
| KnownRejected | 权威known business rejection，retry另核 | InFlight/Indeterminate同attempt结果 | 无 |
| Indeterminate | 无法证明原attempt效果 | InFlight/恢复Claimed | KnownAccepted/KnownRejected/NotDispatched权威no-IO |
| NotDispatched | 有权威证明请求未离开 | Claimed/Indeterminate权威no-IO | 无，旧attempt不重用 |
无state自行修改方法；factory初值由所属对象卡固定；所属Domain成员控制迁移。未列边禁止，全部guard/trigger矩阵只在Step10展开；标签不能由HTTP/ACK/lease/free-text映射成成功。

### ExternalActionState
归属`shared/callback.rs`；C-STATE；exact Rust标签与02 snake_case按PascalCase机械映射。
```rust
/// 一次action绑定生命周期。
pub enum ExternalActionState {
    /// 完整来源责任目标action资格，尚未消费。
    Active,
    /// one-use已原子绑定原op，永久不可复活。
    Claimed,
    /// 真实期限到期终态。
    Expired,
    /// 正式relation/action撤销终态。
    Revoked,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Active | 完整来源责任目标action资格，尚未消费 | bind | Claimed/Expired/Revoked |
| Claimed | one-use已原子绑定原op，永久不可复活 | Active current claim | 无 |
| Expired | 真实期限到期终态 | Active | 无 |
| Revoked | 正式relation/action撤销终态 | Active | 无 |
无state自行修改方法；factory初值由所属对象卡固定；所属Domain成员控制迁移。未列边禁止，全部guard/trigger矩阵只在Step10展开；标签不能由HTTP/ACK/lease/free-text映射成成功。

### CallbackHandoffState
归属`shared/callback.rs`；C-STATE；exact Rust标签与02 snake_case按PascalCase机械映射。
```rust
/// callback局部交接阶段，与审批truth独立。
pub enum CallbackHandoffState {
    /// 完整来源责任target/action验证成立。
    Verified,
    /// 正式合同或依据缺失。
    Blocked,
    /// tampered/expired/replayed/cross-target拒绝。
    Rejected,
    /// one-use与原op已durable绑定，可能交owner。
    OwnerPending,
    /// owner二次核验正式动作结果。
    OwnerAccepted,
    /// owner正式动作拒绝。
    OwnerRejected,
    /// owner动作效果可能发生但结果未知。
    Indeterminate,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Verified | 完整来源责任target/action验证成立 | from_verified | OwnerPending/Blocked/Rejected |
| Blocked | 正式合同或依据缺失 | 受控失败factory/Verified | 无 |
| Rejected | tampered/expired/replayed/cross-target拒绝 | 受控拒绝factory/Verified | 无 |
| OwnerPending | one-use与原op已durable绑定，可能交owner | Verified | OwnerAccepted/OwnerRejected/Indeterminate |
| OwnerAccepted | owner二次核验正式动作结果 | OwnerPending/Indeterminate权威原op结果 | 无 |
| OwnerRejected | owner正式动作拒绝 | OwnerPending/Indeterminate权威原op结果 | 无 |
| Indeterminate | owner动作效果可能发生但结果未知 | OwnerPending | OwnerAccepted/OwnerRejected；禁止续approve |
无state自行修改方法；factory初值由所属对象卡固定；所属Domain成员控制迁移。未列边禁止，全部guard/trigger矩阵只在Step10展开；标签不能由HTTP/ACK/lease/free-text映射成成功。

### DedupState
归属`shared/continuity.rs`；C-STATE；exact Rust标签与02 snake_case按PascalCase机械映射。
```rust
/// 单namespace/scope同义操作与原结果。
pub enum DedupState {
    /// 原op已原子接管。
    Reserved,
    /// 真实原result已保存。
    ResultRecorded,
    /// 原效果未知，保op/effect。
    Indeterminate,
    /// 复用窗口到期，保受限tombstone。
    Expired,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Reserved | 原op已原子接管 | reserve | ResultRecorded/Indeterminate/Expired |
| ResultRecorded | 真实原result已保存 | Reserved/Indeterminate权威原结果 | Expired |
| Indeterminate | 原效果未知，保op/effect | Reserved | ResultRecorded/Expired |
| Expired | 复用窗口到期，保受限tombstone | Reserved/ResultRecorded/Indeterminate | 无，绝非重新执行许可 |
无state自行修改方法；factory初值由所属对象卡固定；所属Domain成员控制迁移。未列边禁止，全部guard/trigger矩阵只在Step10展开；标签不能由HTTP/ACK/lease/free-text映射成成功。

### StreamCursorState
归属`shared/continuity.rs`；C-STATE；exact Rust标签与02 snake_case按PascalCase机械映射。
```rust
/// 单stream/epoch可比较资格。
pub enum StreamCursorState {
    /// 正式comparator/coverage资格可消费。
    Ready,
    /// 不可比或epoch变化，保旧position。
    Incomparable,
    /// scope/source/window无资格。
    Blocked,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Ready | 正式comparator/coverage资格可消费 | initialize明确comparator；受权恢复 | Ready同流可比CAS推进；Incomparable/Blocked |
| Incomparable | 不可比或epoch变化，保旧position | initialize缺comparator；Ready失效 | Ready仅新受权初始化/完整同epoch恢复；Blocked |
| Blocked | scope/source/window无资格 | Ready/Incomparable | Ready完整权威同流资格 |
无state自行修改方法；factory初值由所属对象卡固定；所属Domain成员控制迁移。未列边禁止，全部guard/trigger矩阵只在Step10展开；标签不能由HTTP/ACK/lease/free-text映射成成功。

### GapState
归属`shared/continuity.rs`；C-STATE；exact Rust标签与02 snake_case按PascalCase机械映射。
```rust
/// 原stream/epoch缺口状态。
pub enum GapState {
    /// 缺口未完整覆盖。
    Open,
    /// current受权coverage查询。
    Probing,
    /// 同epoch原range权威完整覆盖终态。
    Closed,
    /// 缺来源/窗口/比较器，停止自动操作。
    Manual,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Open | 缺口未完整覆盖 | detect；Probing仍有子范围 | Probing/Manual |
| Probing | current受权coverage查询 | Open/Manual显式恢复 | Closed/Open/Manual |
| Closed | 同epoch原range权威完整覆盖终态 | Probing | 无 |
| Manual | 缺来源/窗口/比较器，停止自动操作 | Open/Probing | Probing仅显式授权原range |
无state自行修改方法；factory初值由所属对象卡固定；所属Domain成员控制迁移。未列边禁止，全部guard/trigger矩阵只在Step10展开；标签不能由HTTP/ACK/lease/free-text映射成成功。

### DispatchLaneState
归属`shared/continuity.rs`；C-STATE；exact Rust标签与02 snake_case按PascalCase机械映射。
```rust
/// 局部顺序与平台有效下界。
pub enum DispatchLaneState {
    /// 当前lane候选可派发。
    Ready,
    /// 持有本地claim，不证明未外呼。
    Held,
    /// 至少一有效下界尚未到。
    Cooldown,
    /// 资格/dependency/window缺口。
    Blocked,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Ready | 当前lane候选可派发 | for_scope；Held已知释放；Cooldown全下界到；Blocked资格恢复 | Held/Cooldown/Blocked |
| Held | 持有本地claim，不证明未外呼 | Ready CAS claim | Ready/Cooldown/Blocked |
| Cooldown | 至少一有效下界尚未到 | Ready/Held正式rate结果 | Ready仅所有bound满足；Blocked |
| Blocked | 资格/dependency/window缺口 | Ready/Held/Cooldown | Ready原scope恢复且不越unknown依赖 |
无state自行修改方法；factory初值由所属对象卡固定；所属Domain成员控制迁移。未列边禁止，全部guard/trigger矩阵只在Step10展开；标签不能由HTTP/ACK/lease/free-text映射成成功。

### RecoveryState
归属`shared/continuity.rs`；C-STATE；exact Rust标签与02 snake_case按PascalCase机械映射。
```rust
/// 原subject受权恢复记录。
pub enum RecoveryState {
    /// 显式受权恢复请求。
    Requested,
    /// 权威同subject/op查询，不执行create。
    Probing,
    /// 原结果finalize或受限资格记录。
    Resolved,
    /// current scope/basis失效。
    Blocked,
    /// 来源或窗口不可判，原unknown不清除。
    Manual,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Requested | 显式受权恢复请求 | request | Probing/Blocked/Manual |
| Probing | 权威同subject/op查询，不执行create | Requested/Blocked或Manual经C06新维护授权 | Resolved/Blocked/Manual |
| Resolved | 原结果finalize或受限资格记录 | Probing权威结果 | 无，不自动send |
| Blocked | current scope/basis失效 | Requested/Probing | Probing显式授权恢复原subject |
| Manual | 来源或窗口不可判，原unknown不清除 | Requested/Probing | Probing显式授权完整来源 |
无state自行修改方法；factory初值由所属对象卡固定；所属Domain成员控制迁移。未列边禁止，全部guard/trigger矩阵只在Step10展开；标签不能由HTTP/ACK/lease/free-text映射成成功。

### SafeHandoffState
归属`shared/traceability.rs`；C-STATE；exact Rust标签与02 snake_case按PascalCase机械映射。
```rust
/// canonical安全材料交接，与evidence独立。
pub enum SafeHandoffState {
    /// canonical/admission已具备，未证明consumer接纳。
    Pending,
    /// 同canonical原op可能交consumer。
    Dispatching,
    /// consumer正式接纳，不等evidence/verdict。
    ConsumerAccepted,
    /// consumer正式拒绝。
    ConsumerRejected,
    /// 交接可能发生结果未知。
    Indeterminate,
    /// schema/admission/material当前失效。
    Blocked,
}
```
| 变体 | Rustdoc注释 / 作用 | 允许来源 | 允许去向 |
|---|---|---|---|
| Pending | canonical/admission已具备，未证明consumer接纳 | from_canonical；合格Blocked/权威no-effect的Indeterminate | Dispatching/Blocked |
| Dispatching | 同canonical原op可能交consumer | Pending | ConsumerAccepted/ConsumerRejected/Indeterminate/Blocked |
| ConsumerAccepted | consumer正式接纳，不等evidence/verdict | Dispatching/Indeterminate同op权威结果 | 无 |
| ConsumerRejected | consumer正式拒绝 | Dispatching/Indeterminate同op权威结果 | 无 |
| Indeterminate | 交接可能发生结果未知 | Dispatching | ConsumerAccepted/ConsumerRejected；权威no-effect才Pending |
| Blocked | schema/admission/material当前失效 | Pending/Dispatching | Pending原材料仍合法且无未解决unknown |
无state自行修改方法；factory初值由所属对象卡固定；所属Domain成员控制迁移。未列边禁止，全部guard/trigger矩阵只在Step10展开；标签不能由HTTP/ACK/lease/free-text映射成成功。


## 8. Named authority ref

### ActorResponsibilityRef
归属`shared/authority.rs`；C-REF/QUAL；exact本地kind标签为`ActorResponsibilityRef`。
```rust
/// 正式主体责任链引用，不从平台签名或管理员身份推导。
pub struct ActorResponsibilityRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | ActorResponsibilityPort；Human由正式security owner、AI由Identity锚点加正式责任、Integration由trusted来源；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### AuthorizedBindingBasisRef
归属`shared/authority.rs`；C-REF/QUAL；exact本地kind标签为`AuthorizedBindingBasisRef`。
```rust
/// 显式绑定授权依据，安装grant不能替代。
pub struct AuthorizedBindingBasisRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | BindingQualificationPort；actor/target/scope/direction/action两端正式授权；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### AuthorizedReadScopeRef
归属`shared/authority.rs`；C-REF/QUAL；exact本地kind标签为`AuthorizedReadScopeRef`。
```rust
/// 当前读取scope依据，ref文本不产生scope。
pub struct AuthorizedReadScopeRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | SafeReadQualificationPort；正式scope/visibility resolver；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### IdentityMappingBasisRef
归属`shared/authority.rs`；C-REF/QUAL；exact本地kind标签为`IdentityMappingBasisRef`。
```rust
/// 账号kind与正式actor责任的两端mapping依据。
pub struct IdentityMappingBasisRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | BindingQualificationPort与ActorResponsibilityPort；Human未绑定合同则blocked；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### LocationMappingBasisRef
归属`shared/authority.rs`；C-REF/QUAL；exact本地kind标签为`LocationMappingBasisRef`。
```rust
/// 位置父子与正式target的两端mapping依据。
pub struct LocationMappingBasisRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | BindingQualificationPort；qualified platform locator与owner target resolver；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### MappingBasisRef
归属`shared/authority.rs`；C-REF/QUAL；exact本地kind标签为`MappingBasisRef`。
```rust
/// 已知原message结果回链的受权依据。
pub struct MappingBasisRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | BindingQualificationPort；C03显式依据或已知owner/platform结果；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### MappingInvalidationBasisRef
归属`shared/authority.rs`；C-REF/QUAL；exact本地kind标签为`MappingInvalidationBasisRef`。
```rust
/// 本地mapping失效的正式依据，不改外部truth。
pub struct MappingInvalidationBasisRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | BindingQualificationPort/ConfigQualificationPort；current版本或撤销结果；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### RevocationBasisRef
归属`shared/authority.rs`；C-REF/QUAL；exact本地kind标签为`RevocationBasisRef`。
```rust
/// 关系或action正式撤销依据。
pub struct RevocationBasisRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | BindingQualificationPort/OwnerActionPort；显式授权或当前撤销来源；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### QualificationMaintenanceBasisRef
归属`shared/authority.rs`；C-REF/QUAL；exact本地kind标签为`QualificationMaintenanceBasisRef`。
```rust
/// 维护既有subject资格的正式依据，不许可新业务effect。
pub struct QualificationMaintenanceBasisRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | ConfigQualificationPort/BindingQualificationPort；J05受权scope；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### AllowedProjectionRef
归属`shared/material.rs`；C-REF/QUAL；exact本地kind标签为`AllowedProjectionRef`。
```rust
/// owner获准外显材料引用，不持有正文。
pub struct AllowedProjectionRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | PresentationQualificationPort；Conversation/Governance/条件Workspace的安全projection；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### QualifiedMaterialRef
归属`shared/material.rs`；C-REF/QUAL；exact本地kind标签为`QualifiedMaterialRef`。
```rust
/// owner可接收的合格材料引用，不能用平台正文代替。
pub struct QualifiedMaterialRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | PrivateMaterialPort/ConversationHandoffPort；Artifact准入与owner payload ref；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### OwnerRequiredDigestRef
归属`shared/material.rs`；C-REF/QUAL；exact本地kind标签为`OwnerRequiredDigestRef`。
```rust
/// owner材料协议要求的安全digest引用，不是raw-body hash。
pub struct OwnerRequiredDigestRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | PrivateMaterialPort；qualified材料附带的owner digest及requirement合同；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### SafeSourceRef
归属`shared/material.rs`；C-REF/QUAL；exact本地kind标签为`SafeSourceRef`。
```rust
/// 可重新读取的安全来源引用，无raw inbox。
pub struct SafeSourceRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | PlatformIngressPort与PrivateMaterialPort；source provider准入/版本/窗口；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### VerifiedPlatformSourceRef
归属`shared/material.rs`；C-REF/QUAL；exact本地kind标签为`VerifiedPlatformSourceRef`。
```rust
/// 平台来源验证依据，只证明来源不授内部权限。
pub struct VerifiedPlatformSourceRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | PlatformIngressPort；逐installation/version/mode验证来源；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### VerifiedOriginMarkerRef
归属`shared/material.rs`；C-REF/QUAL；exact本地kind标签为`VerifiedOriginMarkerRef`。
```rust
/// 经验证origin及self-send关联依据，不信用户标记。
pub struct VerifiedOriginMarkerRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | PlatformIngressPort/MappingRepository；verified origin加已知本地self-send关系；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### OwnerChangeDispositionRef
归属`shared/material.rs`；C-REF/QUAL；exact本地kind标签为`OwnerChangeDispositionRef`。
```rust
/// 原消息受权变化的owner结果依据。
pub struct OwnerChangeDispositionRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | ConversationHandoffPort或合格known platform change结果；原locator/version；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### AuthorizedAttemptWindowRef
归属`shared/delivery.rs`；C-REF/QUAL；exact本地kind标签为`AuthorizedAttemptWindowRef`。
```rust
/// 原effect受权外呼窗口与预算的来源引用。
pub struct AuthorizedAttemptWindowRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | PlatformDeliveryPort/BindingQualificationPort；最终window/budget/等待资格；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### PlatformResultAuthorityRef
归属`shared/delivery.rs`；C-REF/QUAL；exact本地kind标签为`PlatformResultAuthorityRef`。
```rust
/// 逐adapter/method已知业务结果的权威依据。
pub struct PlatformResultAuthorityRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | PlatformDeliveryPort；真实business response或同effect权威probe，不是HTTP status；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### PresentationInvalidationBasisRef
归属`shared/delivery.rs`；C-REF/QUAL；exact本地kind标签为`PresentationInvalidationBasisRef`。
```rust
/// 原plan材料或资格失效依据。
pub struct PresentationInvalidationBasisRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | PresentationQualificationPort；原source/projection/target/current期限变化；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### DisclosureQualificationRef
归属`shared/delivery.rs`；C-REF/QUAL；exact本地kind标签为`DisclosureQualificationRef`。
```rust
/// 内容、存在性、提示、入口与动作外显的正式依据。
pub struct DisclosureQualificationRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | PresentationQualificationPort；逐owner/Governance披露资格，不默认低敏感；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### ActionAuthorizationBasisRef
归属`shared/callback.rs`；C-REF/QUAL；exact本地kind标签为`ActionAuthorizationBasisRef`。
```rust
/// 特定actor/target/action的正式业务授权。
pub struct ActionAuthorizationBasisRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | OwnerActionPort与ActorResponsibilityPort；披露许可不等动作许可；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### ActionExpiryOneUseRef
归属`shared/callback.rs`；C-REF/QUAL；exact本地kind标签为`ActionExpiryOneUseRef`。
```rust
/// 受权action期限与一次消费scope依据。
pub struct ActionExpiryOneUseRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | OwnerActionPort/CallbackRepository；期限实际来源与one-use规则，不存token；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### CallbackVerificationRef
归属`shared/callback.rs`；C-REF/QUAL；exact本地kind标签为`CallbackVerificationRef`。
```rust
/// 平台、原source、actor、target、action、revision、期限的完整验证引用。
pub struct CallbackVerificationRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | CallbackVerificationPort/ActorResponsibilityPort/OwnerActionPort；签名单独不足；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### AuthoritativeComparatorRef
归属`shared/continuity.rs`；C-REF/QUAL；exact本地kind标签为`AuthoritativeComparatorRef`。
```rust
/// same stream/epoch正式位置比较规则引用。
pub struct AuthoritativeComparatorRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | AuthoritativeRecoveryPort/qualified source adapter；不从ID或timestamp排序；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### PlatformRateLimitBasisRef
归属`shared/continuity.rs`；C-REF/QUAL；exact本地kind标签为`PlatformRateLimitBasisRef`。
```rust
/// 平台method/bucket/resource/global下界的真实来源。
pub struct PlatformRateLimitBasisRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | PlatformDeliveryPort；经清洗的正式限流结果与source版本；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### RateLimitQualificationRef
归属`shared/continuity.rs`；C-REF/QUAL；exact本地kind标签为`RateLimitQualificationRef`。
```rust
/// 当前限流scope和bounds完整性依据。
pub struct RateLimitQualificationRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | PlatformDeliveryPort；跨lane shared bucket资格，空bounds也须明确；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### RecoveryAuthorizationRef
归属`shared/continuity.rs`；C-REF/QUAL；exact本地kind标签为`RecoveryAuthorizationRef`。
```rust
/// 显式原subject恢复授权，不许可创建新原effect。
pub struct RecoveryAuthorizationRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | BindingQualificationPort/ActorResponsibilityPort；C06 current scope；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### RecoveryWindowRef
归属`shared/continuity.rs`；C-REF/QUAL；exact本地kind标签为`RecoveryWindowRef`。
```rust
/// 原source/effect可对账或回放的有限窗口依据。
pub struct RecoveryWindowRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | AuthoritativeRecoveryPort；平台/owner/consumer实际可查询窗口；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### RetentionExpiryBasisRef
归属`shared/continuity.rs`；C-REF/QUAL；exact本地kind标签为`RetentionExpiryBasisRef`。
```rust
/// 去重保留资格到期的正式维护依据。
pub struct RetentionExpiryBasisRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | 唯一取得面ConfigQualificationPort.qualify_dedup_expiry；以Continuity/UoW实际原row及current批准retention/维护scope核验；expiry不等新执行许可；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

受权S10-LOCAL-001修补：proof的`id`指向实际retention维护依据，exact kind=`RetentionExpiryBasisRef`；scope同原DedupNamespaceScope，source/revision指当前批准的本地retention配置/正式维护authority，validity是本次维护资格窗口，不是已到期的原保留窗口。port当前核两者及原dedup identity/local revision/key/meaning/op完整关联；原retention到期与proof仍current必须同时成立。factory不生成proof或把job.basis强转。过期后原key/meaning/original/result/retention保持，不能清未知责任或删除重跑；J05是唯一主动expiry触发，Query零维护。

### CanonicalSafeMaterialRef
归属`shared/traceability.rs`；C-REF/QUAL；exact本地kind标签为`CanonicalSafeMaterialRef`。
```rust
/// 准入schema的canonical安全材料引用，不是evidence。
pub struct CanonicalSafeMaterialRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | SafeObservationPort；唯一mutation producer正式canonical converter；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### ProducerAdmissionRef
归属`shared/traceability.rs`；C-REF/QUAL；exact本地kind标签为`ProducerAdmissionRef`。
```rust
/// consumer对特定producer/schema/scope的准入引用。
pub struct ProducerAdmissionRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | SafeObservationPort；Observability实际admission合同，缺失blocked；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### ConfigurationBasisRef
归属`config.rs`；C-REF/QUAL；exact本地kind标签为`ConfigurationBasisRef`。
```rust
/// 受权配置接纳或变更的正式依据。
pub struct ConfigurationBasisRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | ConfigQualificationPort与trusted management context；不接受body自报管理员；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### InstallationQualificationRef
归属`config.rs`；C-REF/QUAL；exact本地kind标签为`InstallationQualificationRef`。
```rust
/// config、能力、route、secret各required seam当前资格。
pub struct InstallationQualificationRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | ConfigQualificationPort；逐installation/version/direction/method实际来源；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### CapabilitySnapshotRef
归属`config.rs`；C-REF/QUAL；exact本地kind标签为`CapabilitySnapshotRef`。
```rust
/// 逐installation/method/direction/version能力快照引用。
pub struct CapabilitySnapshotRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | ConfigQualificationPort/PlatformIngressPort/PlatformDeliveryPort；支持不是4/4ready；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### RoutePolicyRef
归属`config.rs`；C-REF/QUAL；exact本地kind标签为`RoutePolicyRef`。
```rust
/// 固定受权route与用途隔离依据，不是任意URL。
pub struct RoutePolicyRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | ConfigQualificationPort；当前endpoint/context allowlist与redirect/SSRF规则；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### AttachmentGrantRef
归属`shared/material.rs`；C-REF/QUAL；exact本地kind标签为`AttachmentGrantRef`。
```rust
/// 特定附件准入、传播、期限和可省略性依据。
pub struct AttachmentGrantRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | PresentationQualificationPort/PrivateMaterialPort；Artifact授权ref，不公开URL；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### SecretProviderRef
归属`config.rs`；C-REF/QUAL；exact本地kind标签为`SecretProviderRef`。
```rust
/// 已核secret provider绑定引用，不预选KMS。
pub struct SecretProviderRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | ConfigQualificationPort/SecretResolutionPort；产品not_selected时不可激活；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。

### SecretKeyRef
归属`config.rs`；C-REF/QUAL；exact本地kind标签为`SecretKeyRef`。
```rust
/// opaque secret key定位引用，不包含secret值。
pub struct SecretKeyRef(SafeAuthorityRef);
```
| 类别 | 字段类型或完整签名 | 约束 / 来源 / 中文Rustdoc |
|---|---|---|
| 字段0 | `SafeAuthorityRef` | SecretResolutionPort；合格provider安全key ref/version/revoke来源；完整id/kind/scope/source/revision/window，不保存材料 |
| 工厂 | `pub fn from_source(value: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 检查exact kind并完整复制；不授权限，不查询来源 |
| 成员 | `pub fn authority(&self) -> &SafeAuthorityRef` | /// 读取safe依据指针；来源/revision/expiry/revoke必须由对应port当前核验 |
无独立state；wrong-kind/unknown来源拒绝，缺依据不造ref；当前结构可落码，foreign绑定/读取面必须Step7闭口。


## 9. Revision、metadata与显式范围

### ConfigRevision
归属`config.rs`；C-CONT/C-REF。
```rust
/// 受权配置CAS；不能与其他revision轴混用。
pub struct ConfigRevision(u64);
```
| 字段 | 类型 | 约束 / 来源 |
|---|---|---|
| 0 | `u64` | 正数、非时间；ConfigurationBasisRef与InstallationRepository；local初始1不是owner版本 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn from_positive(value: u64) -> Result<Self, ContractViolation>` | /// 校验正数，不建立authority。 |
| 成员 | `pub fn value(&self) -> u64` | /// 读取本轴值，零IO。 |
| 成员 | `pub fn next_checked(&self) -> Result<Self, ContractViolation>` | /// 纯计算下一值；溢出拒绝，只有同UoW提交后才生效。 |

### BindingGeneration
归属`shared/authority.rs`；C-CONT/C-REF。
```rust
/// 关系可执行代际；不能与其他revision轴混用。
pub struct BindingGeneration(u64);
```
| 字段 | 类型 | 约束 / 来源 |
|---|---|---|
| 0 | `u64` | 正数、非时间；BindingQualificationPort/MappingRepository；local初始1不是owner版本 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn from_positive(value: u64) -> Result<Self, ContractViolation>` | /// 校验正数，不建立authority。 |
| 成员 | `pub fn value(&self) -> u64` | /// 读取本轴值，零IO。 |
| 成员 | `pub fn next_checked(&self) -> Result<Self, ContractViolation>` | /// 纯计算下一值；溢出拒绝，只有同UoW提交后才生效。 |

### LocalRevision
归属`shared/operation.rs`；C-CONT/C-REF。
```rust
/// 本地对象CAS；不能与其他revision轴混用。
pub struct LocalRevision(u64);
```
| 字段 | 类型 | 约束 / 来源 |
|---|---|---|
| 0 | `u64` | 正数、非时间；对应本地Repository；local初始1不是owner版本 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn from_positive(value: u64) -> Result<Self, ContractViolation>` | /// 校验正数，不建立authority。 |
| 成员 | `pub fn value(&self) -> u64` | /// 读取本轴值，零IO。 |
| 成员 | `pub fn next_checked(&self) -> Result<Self, ContractViolation>` | /// 纯计算下一值；溢出拒绝，只有同UoW提交后才生效。 |

### CursorRevision
归属`shared/continuity.rs`；C-CONT/C-REF。
```rust
/// cursor CAS；不能与其他revision轴混用。
pub struct CursorRevision(u64);
```
| 字段 | 类型 | 约束 / 来源 |
|---|---|---|
| 0 | `u64` | 正数、非时间；ContinuityRepository；local初始1不是owner版本 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn from_positive(value: u64) -> Result<Self, ContractViolation>` | /// 校验正数，不建立authority。 |
| 成员 | `pub fn value(&self) -> u64` | /// 读取本轴值，零IO。 |
| 成员 | `pub fn next_checked(&self) -> Result<Self, ContractViolation>` | /// 纯计算下一值；溢出拒绝，只有同UoW提交后才生效。 |

### LaneRevision
归属`shared/continuity.rs`；C-CONT/C-REF。
```rust
/// lane CAS；不能与其他revision轴混用。
pub struct LaneRevision(u64);
```
| 字段 | 类型 | 约束 / 来源 |
|---|---|---|
| 0 | `u64` | 正数、非时间；LaneRepository；local初始1不是owner版本 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn from_positive(value: u64) -> Result<Self, ContractViolation>` | /// 校验正数，不建立authority。 |
| 成员 | `pub fn value(&self) -> u64` | /// 读取本轴值，零IO。 |
| 成员 | `pub fn next_checked(&self) -> Result<Self, ContractViolation>` | /// 纯计算下一值；溢出拒绝，只有同UoW提交后才生效。 |

### FenceToken
归属`shared/continuity.rs`；C-CONT/C-REF。
```rust
/// 单subject单调fence；不能与其他revision轴混用。
pub struct FenceToken(u64);
```
| 字段 | 类型 | 约束 / 来源 |
|---|---|---|
| 0 | `u64` | 正数、非时间；本地UoW原子claim；local初始1不是owner版本 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn from_positive(value: u64) -> Result<Self, ContractViolation>` | /// 校验正数，不建立authority。 |
| 成员 | `pub fn value(&self) -> u64` | /// 读取本轴值，零IO。 |
| 成员 | `pub fn next_checked(&self) -> Result<Self, ContractViolation>` | /// 纯计算下一值；溢出拒绝，只有同UoW提交后才生效。 |

### SafeProducerSchemaRevision
归属`shared/traceability.rs`；C-CONT/C-REF。
```rust
/// 安全producer schema版本；不能与其他revision轴混用。
pub struct SafeProducerSchemaRevision(u64);
```
| 字段 | 类型 | 约束 / 来源 |
|---|---|---|
| 0 | `u64` | 正数、非时间；Observability准入合同；不是准入完成；local初始1不是owner版本 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn from_positive(value: u64) -> Result<Self, ContractViolation>` | /// 校验正数，不建立authority。 |
| 成员 | `pub fn value(&self) -> u64` | /// 读取本轴值，零IO。 |

### ExpectedConfigRevision
归属`shared/operation.rs`。
```rust
/// 已读版本条件；不转换为另一CAS轴。
pub struct ExpectedConfigRevision(ConfigRevision);
```
| 字段 | 类型 | 约束 / 来源 |
|---|---|---|
| 0 | `ConfigRevision` | 对应可信read snapshot或受权命令CAS要求 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn from_value(value: ConfigRevision) -> Self` | /// 包裹原版本，不自增或授权。 |
| 成员 | `pub fn value(&self) -> &ConfigRevision` | /// 纯读条件，零IO。 |

### ExpectedCursorRevision
归属`shared/operation.rs`。
```rust
/// 已读版本条件；不转换为另一CAS轴。
pub struct ExpectedCursorRevision(CursorRevision);
```
| 字段 | 类型 | 约束 / 来源 |
|---|---|---|
| 0 | `CursorRevision` | 对应可信read snapshot或受权命令CAS要求 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn from_value(value: CursorRevision) -> Self` | /// 包裹原版本，不自增或授权。 |
| 成员 | `pub fn value(&self) -> &CursorRevision` | /// 纯读条件，零IO。 |

### ExpectedGeneration
归属`shared/operation.rs`。
```rust
/// 已读版本条件；不转换为另一CAS轴。
pub struct ExpectedGeneration(BindingGeneration);
```
| 字段 | 类型 | 约束 / 来源 |
|---|---|---|
| 0 | `BindingGeneration` | 对应可信read snapshot或受权命令CAS要求 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn from_value(value: BindingGeneration) -> Self` | /// 包裹原版本，不自增或授权。 |
| 成员 | `pub fn value(&self) -> &BindingGeneration` | /// 纯读条件，零IO。 |

### ExpectedLaneRevision
归属`shared/operation.rs`。
```rust
/// 已读版本条件；不转换为另一CAS轴。
pub struct ExpectedLaneRevision(LaneRevision);
```
| 字段 | 类型 | 约束 / 来源 |
|---|---|---|
| 0 | `LaneRevision` | 对应可信read snapshot或受权命令CAS要求 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn from_value(value: LaneRevision) -> Self` | /// 包裹原版本，不自增或授权。 |
| 成员 | `pub fn value(&self) -> &LaneRevision` | /// 纯读条件，零IO。 |

### ExpectedLocalRevision
归属`shared/operation.rs`。
```rust
/// 已读版本条件；不转换为另一CAS轴。
pub struct ExpectedLocalRevision(LocalRevision);
```
| 字段 | 类型 | 约束 / 来源 |
|---|---|---|
| 0 | `LocalRevision` | 对应可信read snapshot或受权命令CAS要求 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn from_value(value: LocalRevision) -> Self` | /// 包裹原版本，不自增或授权。 |
| 成员 | `pub fn value(&self) -> &LocalRevision` | /// 纯读条件，零IO。 |

### OwnerActionStateRevision
归属`shared/callback.rs`。
```rust
/// 已读版本条件；不转换为另一CAS轴。
pub struct OwnerActionStateRevision(SafeRevision);
```
| 字段 | 类型 | 约束 / 来源 |
|---|---|---|
| 0 | `SafeRevision` | OwnerActionPort当前状态版本，不由按钮生成 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn from_value(value: SafeRevision) -> Self` | /// 包裹原版本，不自增或授权。 |
| 成员 | `pub fn value(&self) -> &SafeRevision` | /// 纯读条件，零IO。 |


### Core metadata重导出总览
唯一归属`shared/metadata.rs`；真实crate为`core-contracts / core_contracts`，不是假设的root facade。

### ActorRef
```rust
/// 正式actor载体；外部ID不能创建它。
pub use core_contracts::actor::ActorRef;
```
| 字段及正式来源 | 工厂 / 成员合同 | 本仓约束 |
|---|---|---|
| actor_id/actor_kind/display_name；display_name=None才可durable/output | new(actor_id: impl Into<ActorId>, actor_kind: ActorKind) -> Self；is_system(&self) -> bool | /// 复用core真实schema/API，不授业务authority；中文注释只属本设计。 |

### ActorContext
```rust
/// 正式actor、scope及origin；role hint不是authorization。
pub use core_contracts::actor::ActorContext;
```
| 字段及正式来源 | 工厂 / 成员合同 | 本仓约束 |
|---|---|---|
| actor/scope_ref/role_refs/request_origin；受信entry提供 | new(actor: ActorRef, request_origin: RequestOrigin) -> Self；actor_ref(&self) -> &ActorRef | /// 复用core真实schema/API，不授业务authority；中文注释只属本设计。 |

### CommandMetadata
```rust
/// 正式命令metadata；原request.idempotency_key为唯一technical key。
pub use core_contracts::metadata::CommandMetadata;
```
| 字段及正式来源 | 工厂 / 成员合同 | 本仓约束 |
|---|---|---|
| request/reason/external_ref；不包含actor_context，actor由原命令入口另传；自由文本不进安全输出 | 真实结构字段构造；本仓不追加第二metadata factory | /// 复用core真实schema/API，不授业务authority；中文注释只属本设计。 |

### QueryMetadata
```rust
/// 正式查询metadata；不授写入权。
pub use core_contracts::metadata::QueryMetadata;
```
| 字段及正式来源 | 工厂 / 成员合同 | 本仓约束 |
|---|---|---|
| request/page/consistency；不包含actor_context；key=None、page token safe | 真实结构字段构造；一致性不可触发refresh/probe | /// 复用core真实schema/API，不授业务authority；中文注释只属本设计。 |

### TraceId
```rust
/// 原可信trace身份。
pub use core_contracts::metadata::TraceId;
```
| 字段及正式来源 | 工厂 / 成员合同 | 本仓约束 |
|---|---|---|
| String newtype；runtime/core metadata，禁止payload覆盖 | new(value: impl Into<String>) -> Self；as_str(&self) -> &str | /// 复用core真实schema/API，不授业务authority；中文注释只属本设计。 |

### IdempotencyKey
```rust
/// 原命令幂等身份。
pub use core_contracts::metadata::IdempotencyKey;
```
| 字段及正式来源 | 工厂 / 成员合同 | 本仓约束 |
|---|---|---|
| String newtype；CommandMetadata原key；不包含正文/secret派生 | new(value: impl Into<String>) -> Self；as_str(&self) -> &str | /// 复用core真实schema/API，不授业务authority；中文注释只属本设计。 |


### BridgeDirectionActionSet
归属`shared/authority.rs`；显式允许的有限方向动作集合。
```rust
/// 显式允许的有限方向动作集合。
pub struct BridgeDirectionActionSet {
    /// 已授权动作集合。
    actions: Vec<DirectionActionKind>,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| actions | `Vec<DirectionActionKind>` | 已授权动作集合；BindingQualificationPort；非空、无重复 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(actions: Vec<DirectionActionKind>) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn permits(&self, action: DirectionActionKind) -> bool` | /// 精确集合包含，不隐含所有动作 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn actions(&self) -> &Vec<DirectionActionKind>` | /// 借用原actions字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### MappingGenerationDirection
归属`shared/authority.rs`；mapping原代际与方向动作。
```rust
/// mapping原代际与方向动作。
pub struct MappingGenerationDirection {
    /// 原relation代际。
    generation: BindingGeneration,
    /// 受权动作。
    action: DirectionActionKind,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| generation | `BindingGeneration` | 原relation代际；MappingRepository |
| action | `DirectionActionKind` | 受权动作；正式binding basis |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(generation: BindingGeneration, action: DirectionActionKind) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn matches(&self, current: &CurrentBindingQualification) -> Result<(), ContractViolation>` | /// 比对代际及动作，不复活历史mapping |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn generation(&self) -> &BindingGeneration` | /// 借用原generation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn action(&self) -> &DirectionActionKind` | /// 借用原action字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### OwnerActionQualificationRef
归属`shared/authority.rs`；owner动作资格与状态条件。
```rust
/// owner动作资格与状态条件。
pub struct OwnerActionQualificationRef {
    /// 正式动作。
    action: OwnerTargetActionRef,
    /// 当前状态条件。
    revision: OwnerActionStateRevision,
    /// 当前授权依据。
    basis: ActionAuthorizationBasisRef,
    /// 资格期限。
    validity: SafeValidityWindow,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| action | `OwnerTargetActionRef` | 正式动作；OwnerActionPort |
| revision | `OwnerActionStateRevision` | 当前状态条件；同port |
| basis | `ActionAuthorizationBasisRef` | 当前授权依据；同port |
| validity | `SafeValidityWindow` | 资格期限；owner最严格窗口 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(action: OwnerTargetActionRef, revision: OwnerActionStateRevision, basis: ActionAuthorizationBasisRef, validity: SafeValidityWindow) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_current_shape(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// 检查窗口；仍须owner当前状态核验 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn action(&self) -> &OwnerTargetActionRef` | /// 借用原action字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn revision(&self) -> &OwnerActionStateRevision` | /// 借用原revision字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &ActionAuthorizationBasisRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### TrustedTraceRef
归属`shared/metadata.rs`；只承接受信trace关联。
```rust
/// 只承接受信trace关联。
pub struct TrustedTraceRef {
    /// 原trace。
    trace_id: TraceId,
    /// trace受信入口来源。
    source: SafeAuthoritySourceRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| trace_id | `TraceId` | 原trace；trusted core metadata |
| source | `SafeAuthoritySourceRef` | trace受信入口来源；runtime bootstrap |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(trace_id: TraceId, source: SafeAuthoritySourceRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn trace_id(&self) -> &TraceId` | /// 纯读原trace |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn source(&self) -> &SafeAuthoritySourceRef` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### TrustedProducerContext
归属`shared/metadata.rs`；受限producer身份和准入上下文。
```rust
/// 受限producer身份和准入上下文。
pub struct TrustedProducerContext {
    /// 正式技术actor。
    actor: ActorRef,
    /// 受限producer scope。
    scope: SafeScopeRef,
    /// 当前准入依据。
    admission: ProducerAdmissionRef,
    /// 原trace。
    trace: TrustedTraceRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| actor | `ActorRef` | 正式技术actor；bootstrap resolver；display_name=None |
| scope | `SafeScopeRef` | 受限producer scope；正式准入 |
| admission | `ProducerAdmissionRef` | 当前准入依据；Observability |
| trace | `TrustedTraceRef` | 原trace；runtime metadata |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(actor: ActorRef, scope: SafeScopeRef, admission: ProducerAdmissionRef, trace: TrustedTraceRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn scope(&self) -> &SafeScopeRef` | /// 只读scope，不默认为operator |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn actor(&self) -> &ActorRef` | /// 借用原actor字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn admission(&self) -> &ProducerAdmissionRef` | /// 借用原admission字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn trace(&self) -> &TrustedTraceRef` | /// 借用原trace字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### TrustedConsumerContext
归属`shared/metadata.rs`；受信来源消费身份。
```rust
/// 受信来源消费身份。
pub struct TrustedConsumerContext {
    /// 正式消费actor。
    actor: ActorRef,
    /// 已注册消费scope。
    scope: SafeScopeRef,
    /// source及版本。
    source: SafeAuthoritySourceRef,
    /// 可信trace。
    trace: TrustedTraceRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| actor | `ActorRef` | 正式消费actor；bootstrap resolver |
| scope | `SafeScopeRef` | 已注册消费scope；正式source admission |
| source | `SafeAuthoritySourceRef` | source及版本；qualified transport adapter |
| trace | `TrustedTraceRef` | 可信trace；runtime metadata |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(actor: ActorRef, scope: SafeScopeRef, source: SafeAuthoritySourceRef, trace: TrustedTraceRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn scope(&self) -> &SafeScopeRef` | /// 外部payload不覆盖trusted scope |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn actor(&self) -> &ActorRef` | /// 借用原actor字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn source(&self) -> &SafeAuthoritySourceRef` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn trace(&self) -> &TrustedTraceRef` | /// 借用原trace字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### TrustedJobContext
归属`shared/metadata.rs`；受信维护调用上下文。
```rust
/// 受信维护调用上下文。
pub struct TrustedJobContext {
    /// 正式维护actor。
    actor: ActorRef,
    /// 受权维护scope。
    scope: SafeScopeRef,
    /// 维护依据。
    basis: QualificationMaintenanceBasisRef,
    /// 调用trace。
    trace: TrustedTraceRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| actor | `ActorRef` | 正式维护actor；bootstrap或已认证operator |
| scope | `SafeScopeRef` | 受权维护scope；正式Policy/Gate |
| basis | `QualificationMaintenanceBasisRef` | 维护依据；当前owner授权 |
| trace | `TrustedTraceRef` | 调用trace；trusted metadata |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(actor: ActorRef, scope: SafeScopeRef, basis: QualificationMaintenanceBasisRef, trace: TrustedTraceRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn scope(&self) -> &SafeScopeRef` | /// scheduler不授默认operator权限 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn actor(&self) -> &ActorRef` | /// 借用原actor字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &QualificationMaintenanceBasisRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn trace(&self) -> &TrustedTraceRef` | /// 借用原trace字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### JobContinuityMetadata
归属`shared/metadata.rs`；沿原subject的有限维护关联。
```rust
/// 沿原subject的有限维护关联。
pub struct JobContinuityMetadata {
    /// 原operation。
    operation: OriginalOperationRef,
    /// 原subject。
    subject: JobSubjectRef,
    /// 维护trace。
    trace: TrustedTraceRef,
    /// 调用时刻。
    requested_at: SafeInstant,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| operation | `OriginalOperationRef` | 原operation；existing snapshot |
| subject | `JobSubjectRef` | Recoverable或Qualification原主语；同actual read，不用Intent冒充J05安装维护 |
| trace | `TrustedTraceRef` | 维护trace；TrustedJobContext |
| requested_at | `SafeInstant` | 调用时刻；可信clock |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(operation: OriginalOperationRef, subject: JobSubjectRef, trace: TrustedTraceRef, requested_at: SafeInstant) -> Result<Self, ContractViolation>` | /// 原op和正确主语族完整输入；J05原local op由实际mutation/audit关联读取，不造新外部effect。 |
| 成员 | `pub fn original(&self) -> &OriginalOperationRef` | /// 保持原操作，不生成新effect |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn operation(&self) -> &OriginalOperationRef` | /// 借用原operation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn subject(&self) -> &JobSubjectRef` | /// 借用原subject字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn trace(&self) -> &TrustedTraceRef` | /// 借用原trace字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn requested_at(&self) -> &SafeInstant` | /// 借用原requested_at字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### SafeEventMetadata
归属`shared/metadata.rs`；body-free内部安全事件metadata。
```rust
/// body-free内部安全事件metadata。
pub struct SafeEventMetadata {
    /// 正式event identity。
    event_id: SafeOpaqueId,
    /// 来源版本。
    source: SafeAuthoritySourceRef,
    /// 注册scope。
    scope: SafeScopeRef,
    /// 原trace。
    trace: TrustedTraceRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| event_id | `SafeOpaqueId` | 正式event identity；正式source；不是正文派生 |
| source | `SafeAuthoritySourceRef` | 来源版本；trusted producer |
| scope | `SafeScopeRef` | 注册scope；source admission |
| trace | `TrustedTraceRef` | 原trace；trusted metadata |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(event_id: SafeOpaqueId, source: SafeAuthoritySourceRef, scope: SafeScopeRef, trace: TrustedTraceRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn source(&self) -> &SafeAuthoritySourceRef` | /// source不是ACK或提交证明 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn event_id(&self) -> &SafeOpaqueId` | /// 借用原event_id字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn scope(&self) -> &SafeScopeRef` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn trace(&self) -> &TrustedTraceRef` | /// 借用原trace字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。


## 10. 原操作、同义结构与mapping结果


### StableEffectSubject
归属`shared/operation.rs`；效果身份按实际边界分类。
```rust
/// 效果身份按实际边界分类。
pub enum StableEffectSubject {
    /// 原owner交接operation。
    Owner(BridgeOperationRef),
    /// 原不可变外部投递effect。
    Delivery(DeliveryEffectRef),
    /// 原安全consumer交接operation。
    Consumer(BridgeOperationRef),
    /// 无外呼的本地operation。
    LocalOnly(BridgeOperationRef),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Owner | 原owner交接operation；`BridgeOperationRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Delivery | 原不可变外部投递effect；`DeliveryEffectRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Consumer | 原安全consumer交接operation；`BridgeOperationRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| LocalOnly | 无外呼的本地operation；`BridgeOperationRef` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### OriginalRecoverableSubjectRef
归属`shared/operation.rs`；仅既有可恢复主语，不接受任意resource。
```rust
/// 仅既有可恢复主语，不接受任意resource。
pub enum OriginalRecoverableSubjectRef {
    /// 既有入站记录。
    Inbound(InboundRecordRef),
    /// 既有回调记录。
    Callback(CallbackRecordRef),
    /// 既有投递intent。
    Intent(DeliveryIntentRef),
    /// 既有缺口。
    Gap(GapRef),
    /// 既有安全交接。
    Handoff(SafeHandoffRef),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Inbound | 既有入站记录；`InboundRecordRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Callback | 既有回调记录；`CallbackRecordRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Intent | 既有投递intent；`DeliveryIntentRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Gap | 既有缺口；`GapRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Handoff | 既有安全交接；`SafeHandoffRef` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### KnownMappingResultRef
归属`shared/delivery.rs`；mapping只能关联真实已知結果。
```rust
/// mapping只能关联真实已知結果。
pub enum KnownMappingResultRef {
    /// 正式owner已接受ref。
    OwnerAccepted(OwnerAcceptedRef),
    /// 原attempt已知业务accepted，拒绝rejected或unknown。
    PlatformAccepted(PlatformBusinessResultRef),
    /// 显式管理授权的两端关系，不表示message曾提交或送达。
    AuthorizedRelation(MappingBasisRef),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| OwnerAccepted | 正式owner已接受ref；`OwnerAcceptedRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| PlatformAccepted | 原attempt已知业务accepted，拒绝rejected或unknown；`PlatformBusinessResultRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| AuthorizedRelation | 显式管理授权的两端关系，不表示message曾提交或送达；`MappingBasisRef` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### OriginalOperationRef
归属`shared/operation.rs`；已存在且不可换名的operation。
```rust
/// 已存在且不可换名的operation。
pub struct OriginalOperationRef {
    /// 原operation。
    operation: BridgeOperationRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| operation | `BridgeOperationRef` | 原operation；本地store已提交记录或当前同UoW reserved |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(operation: BridgeOperationRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn operation(&self) -> &BridgeOperationRef` | /// 原operation只读 |
不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### OriginalHandoffOperationRef
归属`shared/operation.rs`；安全handoff原operation。
```rust
/// 安全handoff原operation。
pub struct OriginalHandoffOperationRef {
    /// 原operation。
    operation: OriginalOperationRef,
    /// 原handoff。
    handoff: SafeHandoffRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| operation | `OriginalOperationRef` | 原operation；SafeTraceRepository的本地handoff/result读取面 |
| handoff | `SafeHandoffRef` | 原handoff；同store |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(operation: OriginalOperationRef, handoff: SafeHandoffRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_same(&self, operation: &BridgeOperationRef) -> Result<(), ContractViolation>` | /// 不能换consumer operation |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn operation(&self) -> &OriginalOperationRef` | /// 借用原operation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn handoff(&self) -> &SafeHandoffRef` | /// 借用原handoff字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。


### BodyFreeOperationMeaningRef
归属`shared/operation.rs`；按实际操作族拆开的安全canonical含义，不是正文摘要。
```rust
/// 按实际操作族拆开的安全canonical含义，不是正文摘要。
pub enum BodyFreeOperationMeaningRef {
    /// C01/C02/C03/C05完整原safe命令体；不使用首次技术对象ID代含义。
    ManagementBody(ManagementCommandMeaning),
    /// Protocol source连续性通知；不引用消息mapping或内部owner结果。
    ContinuityNotice(ContinuityNoticeMeaning),
    /// 配置管理动作、CAS与完整设置。
    Configuration(ConfigurationOperationMeaning),
    /// 显式关系两端/动作/条件。
    Binding(BindingMeaning),
    /// typed映射两端与责任。
    Mapping(MappingMeaning),
    /// 原来源/版本与mapping动作。
    Inbound(SourceOperationMeaning),
    /// C04/E02共同effect含义。
    Outbound(DeliveryOperationMeaning),
    /// opaque owner动作语义ref，不含敏感内容。
    Callback(ActionOperationMeaning),
    /// 原subject/op只读恢复。
    Recovery(RecoveryOperationMeaning),
    /// 原canonical producer交接。
    Handoff(SafeHandoffMeaning),
    /// 原subject资格维护。
    Qualification(QualificationOperationMeaning),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| ManagementBody | 四种完整原safe body及CAS条件；`ManagementCommandMeaning` | 对应Input.canonical_meaning，原DTO全部稳定字段 | 原management key比较/保存，zero新增wire/action/authority |
| Configuration | 配置管理动作/CAS/完整设置；`ConfigurationOperationMeaning` | 所属正式source/纯组装 | 不适用，无lifecycle |
| ContinuityNotice | Protocol-only原source通知；`ContinuityNoticeMeaning` | PlatformIngressPort核原host notice | 只cursor/gap局部维护，不授消息/replay权 |
| Binding | 显式关系两端/动作/条件；`BindingMeaning` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Mapping | typed映射两端与责任；`MappingMeaning` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Inbound | 原来源/版本与mapping动作；`SourceOperationMeaning` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Outbound | C04/E02共同effect含义；`DeliveryOperationMeaning` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Callback | opaque owner动作语义ref，不含敏感内容；`ActionOperationMeaning` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Recovery | 原subject/op只读恢复；`RecoveryOperationMeaning` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Handoff | 原canonical producer交接；`SafeHandoffMeaning` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Qualification | 原subject资格维护；`QualificationOperationMeaning` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |
| 成员 | `pub fn assert_equal(&self, other: &Self) -> Result<(), ContractViolation>` | /// 同namespace/key须同variant与canonical字段；不hash正文，变化冲突不覆盖 |

### ManagementCommandMeaning

受权Step13最小闭口，计划归属`shared/operation.rs`，只Contracts内部typed安全同义载体，不是新Command/Job/wire body。四payload完整schema唯一见Step8 Command原卡，均不引用BodyFreeOperationMeaningRef，无值尺寸递归。

```rust
/// 完整safe管理命令体的同义载荷；authority有效期仍current核，不生成身份或权限。
pub enum ManagementCommandMeaning {
    /// 原C01五字段，含安装optional/config与local CAS。
    ConfigureInstallation(ConfigureBridgeInstallationRequest),
    /// 原C02完整proposal六字段，含maintenance/revocation/local CAS。
    ManageBinding(ManageExternalBindingRequest),
    /// 原C03完整proposal及五variant全部字段，含parent/origin/local CAS。
    MaintainMapping(MaintainExternalMappingRequest),
    /// 原C05四字段，初绑还没有action identity。
    BindAction(BindExternalActionRequest),
}
```

| 完整签名 | 中文Rustdoc / 来源 / 副作用 |
|---|---|
| `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 穷尽核已校原DTO/current-safe形状和forbidden材料；不drop稳定字段，不IO/分配ID/签发authority。 |
| `pub fn assert_equal(&self, other: &Self) -> Result<(), ContractViolation>` | /// 按Step13 canonical完整body稳定语义/CAS比较；不同variant或任一稳定字段不同拒绝，不hash正文。 |
| `pub fn canonical_bytes(&self, max_bytes: u32) -> Result<Vec<u8>, ContractViolation>` | /// 按Step13 bridge.identity.v1编码四payload完整安全字段；max_bytes必须实际qualified codec预算且正数，溢出InvalidValue；zero IO/Debug/Display/serde/authority，不得log或外显bytes。实现放同crate commands.rs可读取原DTO private字段；foreign/private载荷禁用。 |

enum消费以四variant穷尽match，无默认/通用JSON/String载荷，禁止raw材料/metadata/context/首次action ID。原Configuration/Binding/Mapping leaf meaning仍合法结构，用于其中纯提案/既有语义，不再单独充当C01~03完整命令去重body；Callback仅E03已有action，不兼任C05初绑。字段不增加第二authority，来源指针/current资格仍原port。

### ContinuityNoticeMeaning

归属`shared/operation.rs`；安全canonical结构，不含source resume token、消息正文或敏感审批。只用于原E01 Continuity，不新增业务主语。

```rust
/// Protocol stream断连通知的稳定含义；不可借作Inbound消息或Recovery操作。
pub struct ContinuityNoticeMeaning {
    /// actual source recipe固定事件身份。
    event_key: SafeOpaqueId,
    /// 原Protocol stream/installation/source/schema。
    stream: CursorNamespaceStream,
    /// actual原epoch。
    previous: QualifiedStreamEpoch,
    /// actual新epoch或明确Missing/Stale。
    next: QualificationSlot<QualifiedStreamEpoch>,
    /// 原safe Known/Unknown bounds；不装raw resume token。
    range: GapRangeBounds,
    /// 原finite原因。
    reason: SafeGapReason,
    /// 原source事实依据，不能从body/hash/clock自签。
    basis: SafeAuthorityRef,
}
```

| 完整签名 | 中文Rustdoc / 校验与消费 |
|---|---|
| `pub fn from_parts(event_key: SafeOpaqueId, stream: CursorNamespaceStream, previous: QualifiedStreamEpoch, next: QualificationSlot<QualifiedStreamEpoch>, range: GapRangeBounds, reason: SafeGapReason, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 完整复制七字段；Protocol、same stream/source/安装、original notice range；结构factory不授权。 |
| `pub fn assert_equal(&self, other: &Self) -> Result<(), ContractViolation>` | /// 同key必须所有stable字段同义；basis比较exact kind/source identity/revision/scope，排除current检查时刻/trace；next/range/reason变义冲突。 |

| 只读签名 | 中文Rustdoc |
|---|---|
| `pub fn event_key(&self) -> &SafeOpaqueId` | /// 纯读原source事件身份。 |
| `pub fn stream(&self) -> &CursorNamespaceStream` | /// 纯读原Protocol stream。 |
| `pub fn previous(&self) -> &QualifiedStreamEpoch` | /// 纯读actual原epoch。 |
| `pub fn next(&self) -> &QualificationSlot<QualifiedStreamEpoch>` | /// 保留原Missing/Stale，不填新epoch。 |
| `pub fn range(&self) -> &GapRangeBounds` | /// 保留Known/Unknown，不猜offset。 |
| `pub fn reason(&self) -> &SafeGapReason` | /// 纯读原有限原因。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 纯读原source依据，不签发权限。 |

codec使用固定`continuity_notice.v1`标签和显式variant/安全opaque position identity，禁止raw token/body digest/时间。DedupNamespace仍Inbound，scope含Protocol source/schema与recipe子标签，和message recipe互斥；actual key须经qualify_event_key验证原host注册身份。不因重连换key/epoch、把Unknown填可比或借Recovery含义。

### BindingMeaning
归属`shared/operation.rs`；配置关系命令安全同义结构。
```rust
/// 配置关系命令安全同义结构。
pub struct BindingMeaning {
    /// exact管理动作。
    action: BindingMutationKind,
    /// 原actor责任链Slot。
    actor: ActorResponsibilityRefSlot,
    /// 原两端外部scope。
    scope: ExternalScopeLocator,
    /// 内部target。
    target: BridgeInternalTargetRef,
    /// 明确动作集。
    actions: BridgeDirectionActionSet,
    /// 原代际条件。
    generation: ExpectedGeneration,
    /// 正式basis身份及版本。
    basis: AuthorizedBindingBasisRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| action | `BindingMutationKind` | exact管理动作；受权entry，activate与revoke不合义 |
| actor | `ActorResponsibilityRefSlot` | 原责任；resolver，pending可Missing、activate必Established |
| scope | `ExternalScopeLocator` | 原两端外部scope；受权命令 |
| target | `BridgeInternalTargetRef` | 内部target；resolver |
| actions | `BridgeDirectionActionSet` | 明确动作集；提案/current授权 |
| generation | `ExpectedGeneration` | 原代际条件；可信snapshot |
| basis | `AuthorizedBindingBasisRef` | 正式basis身份及版本；current policy |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(action: BindingMutationKind, actor: ActorResponsibilityRefSlot, scope: ExternalScopeLocator, target: BridgeInternalTargetRef, actions: BridgeDirectionActionSet, generation: ExpectedGeneration, basis: AuthorizedBindingBasisRef) -> Result<Self, ContractViolation>` | /// 完整复制全部字段；不授authority。 |
| 成员 | `pub fn assert_equal(&self, other: &Self) -> Result<(), ContractViolation>` | /// 比较stable身份/版本，不将资格续期时刻作为含义 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn action(&self) -> &BindingMutationKind` | /// 借用原action字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn actor(&self) -> &ActorResponsibilityRefSlot` | /// 借用原actor字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn scope(&self) -> &ExternalScopeLocator` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn target(&self) -> &BridgeInternalTargetRef` | /// 借用原target字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn actions(&self) -> &BridgeDirectionActionSet` | /// 借用原actions字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn generation(&self) -> &ExpectedGeneration` | /// 借用原generation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &AuthorizedBindingBasisRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### MappingMeaning
归属`shared/operation.rs`；typed mapping命令原两端与责任同义结构。
```rust
/// typed mapping命令原两端与责任同义结构。
pub struct MappingMeaning {
    /// mapping管理动作。
    action: MappingMutationKind,
    /// 明确parent/root。
    parent: ParentLocationRefSlot,
    /// message原来源版本。
    source: Option<SafeSourceVersionRef>,
    /// message原已知结果。
    known_result: Option<KnownMappingResultRef>,
    /// 待变更原mapping身份。
    mapping: MappingRef,
    /// 明确外部账户或位置。
    external: ExternalScopeLocator,
    /// message mapping locator。
    message: Option<ExternalMessageLocator>,
    /// 内部target。
    target: BridgeInternalTargetRef,
    /// identity mapping正式actor。
    actor: Option<ActorRef>,
    /// 代际条件。
    generation: ExpectedGeneration,
    /// 正式mapping依据身份版本。
    basis: MappingBasisRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| action | `MappingMutationKind` | 管理动作；qualified entry |
| parent | `ParentLocationRefSlot` | root/thread；qualified decoder及basis，不猜测 |
| source | `Option<SafeSourceVersionRef>` | message必须Some；其他按正式适用性 |
| known_result | `Option<KnownMappingResultRef>` | message必须真实Some；其他None |
| mapping | `MappingRef` | 待变更原mapping身份；Application技术ID/原read |
| external | `ExternalScopeLocator` | 明确外部账户或位置；verified decoder |
| message | `Option<ExternalMessageLocator>` | message mapping locator；仅message mapping必须Some |
| target | `BridgeInternalTargetRef` | 内部target；resolver |
| actor | `Option<ActorRef>` | identity mapping正式actor；该kind必须Some且清除display_name |
| generation | `ExpectedGeneration` | 代际条件；current relation |
| basis | `MappingBasisRef` | 正式mapping依据身份版本；mapping qualification |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(action: MappingMutationKind, parent: ParentLocationRefSlot, source: Option<SafeSourceVersionRef>, known_result: Option<KnownMappingResultRef>, mapping: MappingRef, external: ExternalScopeLocator, message: Option<ExternalMessageLocator>, target: BridgeInternalTargetRef, actor: Option<ActorRef>, generation: ExpectedGeneration, basis: MappingBasisRef) -> Result<Self, ContractViolation>` | /// 完整字段及kind-required校验，不省略parent/source/known-result。 |
| 成员 | `pub fn assert_equal(&self, other: &Self) -> Result<(), ContractViolation>` | /// typed kind字段一致；首次mapping技术ID不参与canonical含义，既有mapping ID参与 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn action(&self) -> &MappingMutationKind` | /// 借用原action字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn parent(&self) -> &ParentLocationRefSlot` | /// 借用原parent字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn source(&self) -> &Option<SafeSourceVersionRef>` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn known_result(&self) -> &Option<KnownMappingResultRef>` | /// 借用原known_result字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn mapping(&self) -> &MappingRef` | /// 借用原mapping字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn external(&self) -> &ExternalScopeLocator` | /// 借用原external字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn message(&self) -> &Option<ExternalMessageLocator>` | /// 借用原message字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn target(&self) -> &BridgeInternalTargetRef` | /// 借用原target字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn actor(&self) -> &Option<ActorRef>` | /// 借用原actor字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn generation(&self) -> &ExpectedGeneration` | /// 借用原generation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &MappingBasisRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### SourceOperationMeaning
归属`shared/operation.rs`；原入站source和授权mapping动作身份。
```rust
/// 原入站source和授权mapping动作身份。
pub struct SourceOperationMeaning {
    /// 入站exact动作。
    action: DirectionActionKind,
    /// 原两端与actor。
    context: AuthorizedMappingContextRef,
    /// 原来源版本。
    source: SafeSourceVersionRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| action | `DirectionActionKind` | 入站exact动作；current basis |
| context | `AuthorizedMappingContextRef` | 原两端与actor；qualified mapping |
| source | `SafeSourceVersionRef` | 原来源版本；正式material/source qualification |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(action: DirectionActionKind, context: AuthorizedMappingContextRef, source: SafeSourceVersionRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_equal(&self, other: &Self) -> Result<(), ContractViolation>` | /// compare原source/version、target、actor、mapping/generation/action；排除checked_at和trace |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn action(&self) -> &DirectionActionKind` | /// 借用原action字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn context(&self) -> &AuthorizedMappingContextRef` | /// 借用原context字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn source(&self) -> &SafeSourceVersionRef` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### DeliveryOperationMeaning
归属`shared/operation.rs`；C04和E02共用唯一投递同义结构。
```rust
/// C04和E02共用唯一投递同义结构。
pub struct DeliveryOperationMeaning {
    /// send/edit/delete/reply。
    kind: ExternalDeliveryKind,
    /// source及projection身份版本。
    projection: StableSourceProjectionRef,
    /// 原external目标与generation。
    target: ImmutableDeliveryTargetRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| kind | `ExternalDeliveryKind` | send/edit/delete/reply；受权来源 |
| projection | `StableSourceProjectionRef` | source及projection身份版本；正式qualified projection |
| target | `ImmutableDeliveryTargetRef` | 原external目标与generation；qualified mapping |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(kind: ExternalDeliveryKind, projection: StableSourceProjectionRef, target: ImmutableDeliveryTargetRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_equal(&self, other: &Self) -> Result<(), ContractViolation>` | /// 三个字段stable identity逐项一致，producer入口不同不改变effect；排除validity等动态资格 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn kind(&self) -> &ExternalDeliveryKind` | /// 借用原kind字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn projection(&self) -> &StableSourceProjectionRef` | /// 借用原projection字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn target(&self) -> &ImmutableDeliveryTargetRef` | /// 借用原target字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### ActionOperationMeaning
归属`shared/operation.rs`；原callback动作安全同义结构。
```rust
/// 原callback动作安全同义结构。
pub struct ActionOperationMeaning {
    /// 原外显action。
    action: ExternalActionBindingRef,
    /// owner命令target/kind。
    target: OwnerTargetActionRef,
    /// owner状态条件。
    state_revision: OwnerActionStateRevision,
    /// owner认可的opaque动作语义ref。
    semantic_ref: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| action | `ExternalActionBindingRef` | 原外显action；current verification |
| target | `OwnerTargetActionRef` | owner命令target/kind；current owner |
| state_revision | `OwnerActionStateRevision` | owner状态条件；same owner |
| semantic_ref | `SafeAuthorityRef` | owner认可的opaque动作语义ref；exact kind ActionOperationMeaning；不同选择必须不同ref/版本；不保存批准/拒绝内容 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(action: ExternalActionBindingRef, target: OwnerTargetActionRef, state_revision: OwnerActionStateRevision, semantic_ref: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_equal(&self, other: &Self) -> Result<(), ContractViolation>` | /// stable action/target/kind/owner revision/semantic-ref比较；无此owner ref合同即blocked |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn action(&self) -> &ExternalActionBindingRef` | /// 借用原action字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn target(&self) -> &OwnerTargetActionRef` | /// 借用原target字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn state_revision(&self) -> &OwnerActionStateRevision` | /// 借用原state_revision字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn semantic_ref(&self) -> &SafeAuthorityRef` | /// 借用原semantic_ref字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### RecoveryOperationMeaning
归属`shared/operation.rs`；只读恢复原subject同义身份。
```rust
/// 只读恢复原subject同义身份。
pub struct RecoveryOperationMeaning {
    /// 原subject。
    subject: OriginalRecoverableSubjectRef,
    /// 原operation。
    original: OriginalOperationRef,
    /// 受权恢复依据stable身份版本。
    authorization: RecoveryAuthorizationRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| subject | `OriginalRecoverableSubjectRef` | 原subject；existing read |
| original | `OriginalOperationRef` | 原operation；same read |
| authorization | `RecoveryAuthorizationRef` | 受权恢复依据stable身份版本；current policy |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(subject: OriginalRecoverableSubjectRef, original: OriginalOperationRef, authorization: RecoveryAuthorizationRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_equal(&self, other: &Self) -> Result<(), ContractViolation>` | /// 不包括新的recovery请求ID或时刻，不允许换原operation |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn subject(&self) -> &OriginalRecoverableSubjectRef` | /// 借用原subject字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn original(&self) -> &OriginalOperationRef` | /// 借用原original字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn authorization(&self) -> &RecoveryAuthorizationRef` | /// 借用原authorization字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### SafeHandoffMeaning
归属`shared/operation.rs`；canonical交接原producer同义身份。
```rust
/// canonical交接原producer同义身份。
pub struct SafeHandoffMeaning {
    /// 唯一源audit。
    audit: SafeAuditRef,
    /// 原canonical身份版本。
    material: CanonicalSafeMaterialRef,
    /// 准入scope及schema版本。
    admission: ProducerAdmissionRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| audit | `SafeAuditRef` | 唯一源audit；真实mutation |
| material | `CanonicalSafeMaterialRef` | 原canonical身份版本；正式qualified producer |
| admission | `ProducerAdmissionRef` | 准入scope及schema版本；actual consumer contract |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(audit: SafeAuditRef, material: CanonicalSafeMaterialRef, admission: ProducerAdmissionRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_equal(&self, other: &Self) -> Result<(), ContractViolation>` | /// 不以ref可读取性或准入续期造新交接语义 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn audit(&self) -> &SafeAuditRef` | /// 借用原audit字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn material(&self) -> &CanonicalSafeMaterialRef` | /// 借用原material字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn admission(&self) -> &ProducerAdmissionRef` | /// 借用原admission字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### QualificationOperationMeaning
归属`shared/operation.rs`；显式维护原subject资格同义身份。
```rust
/// 显式维护原subject资格同义身份。
pub struct QualificationOperationMeaning {
    /// 既有维护主语。
    subject: BridgeViewSubjectRef,
    /// 原版本条件。
    expected: ExpectedLocalRevision,
    /// 正式维护依据。
    basis: QualificationMaintenanceBasisRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| subject | `BridgeViewSubjectRef` | 既有维护主语；qualified snapshot |
| expected | `ExpectedLocalRevision` | 原版本条件；same read |
| basis | `QualificationMaintenanceBasisRef` | 正式维护依据；current policy |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(subject: BridgeViewSubjectRef, expected: ExpectedLocalRevision, basis: QualificationMaintenanceBasisRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_equal(&self, other: &Self) -> Result<(), ContractViolation>` | /// 维护不得夹带新增message发送 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn subject(&self) -> &BridgeViewSubjectRef` | /// 借用原subject字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn expected(&self) -> &ExpectedLocalRevision` | /// 借用原expected字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &QualificationMaintenanceBasisRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。
Canonical比较只用正式stable identity、kind、scope和semantic revision；AuthorityRef的validity/checked_at、request/trace/clock、claim/attempt/fence、首次技术对象ID均不是新含义。涉及配置设置、mapping提案actor/parent/原message、callback语义时必须完整纳入对应variant；source ref若被owner禁止作安全同义ref，保持blocked，不改为body hash。Step13将固定编码/排序而不改变这里的结构字段。

### StableEffectIdentity
归属`shared/operation.rs`；原效果与不可变含义关联。
```rust
/// 原效果与不可变含义关联。
pub struct StableEffectIdentity {
    /// 实际效果边界。
    effect: StableEffectSubject,
    /// 不可变同义身份。
    meaning: BodyFreeOperationMeaningRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| effect | `StableEffectSubject` | 实际效果边界；首个reserved UoW技术ID |
| meaning | `BodyFreeOperationMeaningRef` | 不可变同义身份；同UoW qualification |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(effect: StableEffectSubject, meaning: BodyFreeOperationMeaningRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_same(&self, other: &Self) -> Result<(), ContractViolation>` | /// 效果及含义都同一才能复用 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn effect(&self) -> &StableEffectSubject` | /// 借用原effect字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn meaning(&self) -> &BodyFreeOperationMeaningRef` | /// 借用原meaning字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### OriginalOperationEffectRef
归属`shared/operation.rs`；恢复与去重共用原operation/effect组合。
```rust
/// 恢复与去重共用原operation/effect组合。
pub struct OriginalOperationEffectRef {
    /// 原operation。
    operation: OriginalOperationRef,
    /// 原效果身份。
    effect: StableEffectSubject,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| operation | `OriginalOperationRef` | 原operation；existing store |
| effect | `StableEffectSubject` | 原稳定效果kind及ID；同operation，不嵌套同义结构，不从新命令生成 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(operation: OriginalOperationRef, effect: StableEffectSubject) -> Result<Self, ContractViolation>` | /// 完整复制原op/effect-kind/ID；meaning另由Dedup/StableEffectIdentity校验，避免递归schema。 |
| 成员 | `pub fn assert_same(&self, other: &Self) -> Result<(), ContractViolation>` | /// 跨subject/新target/新source拒绝 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn operation(&self) -> &OriginalOperationRef` | /// 借用原operation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn effect(&self) -> &StableEffectSubject` | /// 借用原effect字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### ExpectedLocalRevisionSet
归属`shared/operation.rs`；一次有界mutation的完整CAS集合。
```rust
/// 一次有界mutation的完整CAS集合。
pub struct ExpectedLocalRevisionSet {
    /// 原对象CAS集合。
    entries: Vec<LocalRevisionExpectation>,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| entries | `Vec<LocalRevisionExpectation>` | 原对象CAS集合；同consistent snapshot；非空、无重复subject |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(entries: Vec<LocalRevisionExpectation>) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn entries(&self) -> &[LocalRevisionExpectation]` | /// 读取完整期望集，不丢失不匹配项 |
不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### LocalRevisionExpectation
归属`shared/operation.rs`；一个既有subject的CAS条件。
```rust
/// 一个既有subject的CAS条件。
pub struct LocalRevisionExpectation {
    /// 既有local subject。
    subject: BridgeViewSubjectRef,
    /// 该subject版本。
    expected: LocalRevisionCondition,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| subject | `BridgeViewSubjectRef` | 既有local subject；受权snapshot |
| expected | `LocalRevisionCondition` | Absent首次unique接管或Present已有CAS；同consistent snapshot，不能以0代Absent |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(subject: BridgeViewSubjectRef, expected: LocalRevisionCondition) -> Result<Self, ContractViolation>` | /// 完整传入Absent/Present，local driver同UoW唯一/CAS校验。 |
| 成员 | `pub fn subject(&self) -> &BridgeViewSubjectRef` | /// pure read |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn expected(&self) -> &LocalRevisionCondition` | /// 借用原expected字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。


## 11. 幂等、流位置与覆盖载体


### QualifiedKeyValue
归属`shared/continuity.rs`；technical key按可信来源区分。
```rust
/// technical key按可信来源区分。
pub enum QualifiedKeyValue {
    /// CommandMetadata既有key。
    Command(IdempotencyKey),
    /// 来源正式key，不能由正文或时间计算。
    Source(SafeOpaqueId),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Command | CommandMetadata既有key；`IdempotencyKey` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Source | 来源正式key，不能由正文或时间计算；`SafeOpaqueId` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### OpaqueStreamPositionSlot
归属`shared/continuity.rs`；位置未初始化与缺失不可合并。
```rust
/// 位置未初始化与缺失不可合并。
pub enum OpaqueStreamPositionSlot {
    /// 尚未推进，不宣称已有水位。
    Uninitialized,
    /// 来源提供的当前位置。
    Established(OpaqueStreamPosition),
    /// 旧epoch或资格失效位置，仅历史。
    Stale(OpaqueStreamPosition),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Uninitialized | 尚未推进，不宣称已有水位 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Established | 来源提供的当前位置；`OpaqueStreamPosition` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Stale | 旧epoch或资格失效位置，仅历史；`OpaqueStreamPosition` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### GapRangeBounds
归属`shared/continuity.rs`；缺口范围可知性。
```rust
/// 缺口范围可知性。
pub enum GapRangeBounds {
    /// 同stream/epoch的安全边界。
    Known(ComparableRangeBounds),
    /// 不可比较时明确未知，不猜缺失数量。
    Unknown(SafeGapReason),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Known | 同stream/epoch的安全边界；`ComparableRangeBounds` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Unknown | 不可比较时明确未知，不猜缺失数量；`SafeGapReason` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### DedupNamespaceScope
归属`shared/continuity.rs`；六namespace与正式scope隔离。
```rust
/// 六namespace与正式scope隔离。
pub struct DedupNamespaceScope {
    /// 操作族。
    namespace: DedupNamespace,
    /// 安装隔离。
    installation: InstallationNamespace,
    /// 内部受权scope。
    scope: SafeScopeRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| namespace | `DedupNamespace` | 操作族；entry固定分类 |
| installation | `InstallationNamespace` | 安装隔离；qualified config |
| scope | `SafeScopeRef` | 内部受权scope；resolver |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(namespace: DedupNamespace, installation: InstallationNamespace, scope: SafeScopeRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_same(&self, other: &Self) -> Result<(), ContractViolation>` | /// namespace/installation/scope逐项一致 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn namespace(&self) -> &DedupNamespace` | /// 借用原namespace字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn installation(&self) -> &InstallationNamespace` | /// 借用原installation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn scope(&self) -> &SafeScopeRef` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### QualifiedIdempotencyKey
归属`shared/continuity.rs`；带来源与namespace的幂等key。
```rust
/// 带来源与namespace的幂等key。
pub struct QualifiedIdempotencyKey {
    /// 原technical key。
    value: QualifiedKeyValue,
    /// exact来源分类。
    source: IdempotencyKeySource,
    /// 隔离scope。
    scope: DedupNamespaceScope,
    /// key来源合同版本。
    basis: SafeAuthoritySourceRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| value | `QualifiedKeyValue` | 原technical key；command/source，不能新造body hash |
| source | `IdempotencyKeySource` | exact来源分类；entry固定对应value |
| scope | `DedupNamespaceScope` | 隔离scope；trusted资格 |
| basis | `SafeAuthoritySourceRef` | key来源合同版本；source admission或trusted命令入口 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(value: QualifiedKeyValue, source: IdempotencyKeySource, scope: DedupNamespaceScope, basis: SafeAuthoritySourceRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_scope(&self, scope: &DedupNamespaceScope) -> Result<(), ContractViolation>` | /// Command分支必须来自原metadata；错误source拒绝 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn value(&self) -> &QualifiedKeyValue` | /// 借用原value字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn source(&self) -> &IdempotencyKeySource` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn scope(&self) -> &DedupNamespaceScope` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthoritySourceRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### CursorNamespaceStream
归属`shared/continuity.rs`；阶段分离的流定位。
```rust
/// 阶段分离的流定位。
pub struct CursorNamespaceStream {
    /// 安装隔离。
    installation: InstallationNamespace,
    /// 受权流scope。
    scope: SafeScopeRef,
    /// Protocol/Owner/Delivery阶段。
    stage: StreamStageKind,
    /// 来源定义stream。
    stream_id: SafeOpaqueId,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| installation | `InstallationNamespace` | 安装隔离；qualified adapter |
| scope | `SafeScopeRef` | 受权流scope；resolver |
| stage | `StreamStageKind` | Protocol/Owner/Delivery阶段；注册source |
| stream_id | `SafeOpaqueId` | 来源定义stream；source authority；不是message ID |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(installation: InstallationNamespace, scope: SafeScopeRef, stage: StreamStageKind, stream_id: SafeOpaqueId) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_same(&self, other: &Self) -> Result<(), ContractViolation>` | /// 四字段相同，不把ACK流当owner流 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn installation(&self) -> &InstallationNamespace` | /// 借用原installation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn scope(&self) -> &SafeScopeRef` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn stage(&self) -> &StreamStageKind` | /// 借用原stage字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn stream_id(&self) -> &SafeOpaqueId` | /// 借用原stream_id字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### QualifiedStreamEpoch
归属`shared/continuity.rs`；正式session或source epoch。
```rust
/// 正式session或source epoch。
pub struct QualifiedStreamEpoch {
    /// 原stream。
    stream: CursorNamespaceStream,
    /// 明确epoch。
    epoch: SafeOpaqueId,
    /// epoch来源依据。
    basis: SafeAuthorityRef,
    /// epoch资格期限。
    validity: SafeValidityWindow,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| stream | `CursorNamespaceStream` | 原stream；source注册 |
| epoch | `SafeOpaqueId` | 明确epoch；qualified source |
| basis | `SafeAuthorityRef` | epoch来源依据；exact kind QualifiedStreamEpoch；source contract |
| validity | `SafeValidityWindow` | epoch资格期限；source authority |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(stream: CursorNamespaceStream, epoch: SafeOpaqueId, basis: SafeAuthorityRef, validity: SafeValidityWindow) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_same_epoch(&self, other: &Self) -> Result<(), ContractViolation>` | /// 重连未必续同epoch；不同值拒绝比较 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn stream(&self) -> &CursorNamespaceStream` | /// 借用原stream字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn epoch(&self) -> &SafeOpaqueId` | /// 借用原epoch字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### OpaqueStreamPosition
归属`shared/continuity.rs`；有界opaque来源位置。
```rust
/// 有界opaque来源位置。
pub struct OpaqueStreamPosition {
    /// 位置所属流。
    stream: CursorNamespaceStream,
    /// 位置所属epoch。
    epoch: QualifiedStreamEpoch,
    /// 来源定义的安全token。
    token: SafeOpaqueId,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| stream | `CursorNamespaceStream` | 位置所属流；source decoder |
| epoch | `QualifiedStreamEpoch` | 位置所属epoch；同source |
| token | `SafeOpaqueId` | 来源定义的安全token；不可包含body/credential；原ACK token若secret不得导出 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(stream: CursorNamespaceStream, epoch: QualifiedStreamEpoch, token: SafeOpaqueId) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn stream(&self) -> &CursorNamespaceStream` | /// 不可提供数值加一、时间排序或跨流Ord |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn epoch(&self) -> &QualifiedStreamEpoch` | /// 借用原epoch字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn token(&self) -> &SafeOpaqueId` | /// 借用原token字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### ComparablePositionRef
归属`shared/continuity.rs`；权威比较结果及候选位置。
```rust
/// 权威比较结果及候选位置。
pub struct ComparablePositionRef {
    /// 被比较原位置。
    base: OpaqueStreamPositionSlot,
    /// 候选位置。
    candidate: OpaqueStreamPosition,
    /// 比较资格。
    comparator: AuthoritativeComparatorRef,
    /// 权威位置关系。
    comparison: PositionComparisonKind,
    /// 比较结果来源。
    basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| base | `OpaqueStreamPositionSlot` | 被比较原位置；consistent cursor snapshot |
| candidate | `OpaqueStreamPosition` | 候选位置；source |
| comparator | `AuthoritativeComparatorRef` | 比较资格；registered source comparator |
| comparison | `PositionComparisonKind` | 权威位置关系；同comparator actual结果 |
| basis | `SafeAuthorityRef` | 比较结果来源；exact kind ComparablePositionRef |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(base: OpaqueStreamPositionSlot, candidate: OpaqueStreamPosition, comparator: AuthoritativeComparatorRef, comparison: PositionComparisonKind, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_base(&self, position: &OpaqueStreamPositionSlot) -> Result<(), ContractViolation>` | /// 只能应用对原位置的结果；Incomparable不推进 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn base(&self) -> &OpaqueStreamPositionSlot` | /// 借用原base字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn candidate(&self) -> &OpaqueStreamPosition` | /// 借用原candidate字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn comparator(&self) -> &AuthoritativeComparatorRef` | /// 借用原comparator字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn comparison(&self) -> &PositionComparisonKind` | /// 借用原comparison字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### ComparableRangeBounds
归属`shared/continuity.rs`；同流同epoch的覆盖边界。
```rust
/// 同流同epoch的覆盖边界。
pub struct ComparableRangeBounds {
    /// 原exclusive起点或未初始化。
    start: OpaqueStreamPositionSlot,
    /// inclusive终点。
    end: OpaqueStreamPosition,
    /// 边界比较规则。
    comparator: AuthoritativeComparatorRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| start | `OpaqueStreamPositionSlot` | 原exclusive起点或未初始化；source comparator |
| end | `OpaqueStreamPosition` | inclusive终点；同stream/epoch |
| comparator | `AuthoritativeComparatorRef` | 边界比较规则；registered comparator |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(start: OpaqueStreamPositionSlot, end: OpaqueStreamPosition, comparator: AuthoritativeComparatorRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_stream(&self, stream: &CursorNamespaceStream, epoch: &QualifiedStreamEpoch) -> Result<(), ContractViolation>` | /// 明确(start,end]，初始范围由source定义，不猜0 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn start(&self) -> &OpaqueStreamPositionSlot` | /// 借用原start字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn end(&self) -> &OpaqueStreamPosition` | /// 借用原end字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn comparator(&self) -> &AuthoritativeComparatorRef` | /// 借用原comparator字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### QualifiedGapRangeRef
归属`shared/continuity.rs`；已知或未知缺口的原范围。
```rust
/// 已知或未知缺口的原范围。
pub struct QualifiedGapRangeRef {
    /// 缺口所属流。
    stream: CursorNamespaceStream,
    /// 原epoch。
    epoch: QualifiedStreamEpoch,
    /// 安全范围或未知。
    bounds: GapRangeBounds,
    /// 缺口范围来源。
    basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| stream | `CursorNamespaceStream` | 缺口所属流；cursor source |
| epoch | `QualifiedStreamEpoch` | 原epoch；cursor read |
| bounds | `GapRangeBounds` | 安全范围或未知；authoritative comparison |
| basis | `SafeAuthorityRef` | 缺口范围来源；exact kind QualifiedGapRangeRef |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(stream: CursorNamespaceStream, epoch: QualifiedStreamEpoch, bounds: GapRangeBounds, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn is_known(&self) -> bool` | /// 未知范围必须source完整覆盖证明或manual，不靠count |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn stream(&self) -> &CursorNamespaceStream` | /// 借用原stream字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn epoch(&self) -> &QualifiedStreamEpoch` | /// 借用原epoch字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn bounds(&self) -> &GapRangeBounds` | /// 借用原bounds字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### AuthoritativeCoverageRef
归属`shared/continuity.rs`；原缺口实际完整覆盖证明。
```rust
/// 原缺口实际完整覆盖证明。
pub struct AuthoritativeCoverageRef {
    /// 原缺口。
    gap: GapRef,
    /// 被覆盖原范围。
    range: QualifiedGapRangeRef,
    /// 实际覆盖范围。
    covered: ComparableRangeBounds,
    /// 完整性证明。
    basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| gap | `GapRef` | 原缺口；existing gap |
| range | `QualifiedGapRangeRef` | 被覆盖原范围；same stream/epoch |
| covered | `ComparableRangeBounds` | 实际覆盖范围；source authoritative probe |
| basis | `SafeAuthorityRef` | 完整性证明；exact kind AuthoritativeCoverageRef；same-source authority |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(gap: GapRef, range: QualifiedGapRangeRef, covered: ComparableRangeBounds, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_covers(&self, gap: &GapRef, range: &QualifiedGapRangeRef) -> Result<(), ContractViolation>` | /// 范围包含必须来自comparator结果，Unknown需source明确原gap完整性证明 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn gap(&self) -> &GapRef` | /// 借用原gap字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn range(&self) -> &QualifiedGapRangeRef` | /// 借用原range字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn covered(&self) -> &ComparableRangeBounds` | /// 借用原covered字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### ContinuityCoverageRef
归属`shared/continuity.rs`；单阶段推进所需已处理覆盖证明。
```rust
/// 单阶段推进所需已处理覆盖证明。
pub struct ContinuityCoverageRef {
    /// 同一stage流。
    stream: CursorNamespaceStream,
    /// 原epoch。
    epoch: QualifiedStreamEpoch,
    /// 处理覆盖范围。
    range: ComparableRangeBounds,
    /// 范围内缺口覆盖依据。
    closed_gaps: Vec<AuthoritativeCoverageRef>,
    /// 本阶段连续性证明。
    basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| stream | `CursorNamespaceStream` | 同一stage流；source registration |
| epoch | `QualifiedStreamEpoch` | 原epoch；cursor |
| range | `ComparableRangeBounds` | 处理覆盖范围；local committed阶段与source comparator |
| closed_gaps | `Vec<AuthoritativeCoverageRef>` | 范围内缺口覆盖依据；actual probe；空仅在无gap有权威完整证明时 |
| basis | `SafeAuthorityRef` | 本阶段连续性证明；exact kind ContinuityCoverageRef；ContinuityRepository/source |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(stream: CursorNamespaceStream, epoch: QualifiedStreamEpoch, range: ComparableRangeBounds, closed_gaps: Vec<AuthoritativeCoverageRef>, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_candidate(&self, candidate: &ComparablePositionRef) -> Result<(), ContractViolation>` | /// candidate及原base同stream/epoch/stage，全range已处理，不跨未关闭gap |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn stream(&self) -> &CursorNamespaceStream` | /// 借用原stream字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn epoch(&self) -> &QualifiedStreamEpoch` | /// 借用原epoch字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn range(&self) -> &ComparableRangeBounds` | /// 借用原range字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn closed_gaps(&self) -> &Vec<AuthoritativeCoverageRef>` | /// 借用原closed_gaps字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### StreamEpochChangeRef
归属`shared/continuity.rs`；断开或source变更的正式epoch材料。
```rust
/// 断开或source变更的正式epoch材料。
pub struct StreamEpochChangeRef {
    /// 原stream。
    stream: CursorNamespaceStream,
    /// 原epoch。
    previous: QualifiedStreamEpoch,
    /// 新的source epoch。
    next: QualifiedStreamEpoch,
    /// 有限断开原因。
    reason: SafeGapReason,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| stream | `CursorNamespaceStream` | 原stream；source adapter |
| previous | `QualifiedStreamEpoch` | 原epoch；cursor |
| next | `QualifiedStreamEpoch` | 新的source epoch；source实际结果 |
| reason | `SafeGapReason` | 有限断开原因；adapter有限分类 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(stream: CursorNamespaceStream, previous: QualifiedStreamEpoch, next: QualifiedStreamEpoch, reason: SafeGapReason) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_previous(&self, epoch: &QualifiedStreamEpoch) -> Result<(), ContractViolation>` | /// 保留旧水位；只标不可比，不自动拼接新epoch |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn stream(&self) -> &CursorNamespaceStream` | /// 借用原stream字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn previous(&self) -> &QualifiedStreamEpoch` | /// 借用原previous字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn next(&self) -> &QualifiedStreamEpoch` | /// 借用原next字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn reason(&self) -> &SafeGapReason` | /// 借用原reason字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。


## 12. claim、顺序、限流与恢复资格


### DeliveryDependencyRefSlot
归属`shared/continuity.rs`；消息动作依赖的适用性。
```rust
/// 消息动作依赖的适用性。
pub enum DeliveryDependencyRefSlot {
    /// 已核Send无需原message；不是默认跳依赖。
    NotRequired,
    /// 已知且当前可用的原create/thread mapping。
    Established(MessageMappingRef),
    /// 需要依赖但未建立。
    Missing(SafeReasonCode),
    /// 原依赖失效，仅历史。
    Stale(MessageMappingRef),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| NotRequired | 已核Send无需原message；不是默认跳依赖 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Established | 已知且当前可用的原create/thread mapping；`MessageMappingRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Missing | 需要依赖但未建立；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Stale | 原依赖失效，仅历史；`MessageMappingRef` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### ProbeOutcome
归属`shared/continuity.rs`；原subject的权威查询结果，不合成功。
```rust
/// 原subject的权威查询结果，不合成功。
pub enum ProbeOutcome {
    /// 原inbound owner结果。
    Owner(OwnerHandoffResultRef),
    /// 原callback owner结果。
    Action(OwnerActionResultRef),
    /// 原effect已知业务结果和同次完整rate下界；不拿现时bounds补原响应。
    Platform(KnownPlatformBusinessResult),
    /// 原handoff consumer结果。
    Consumer(ConsumerDispositionRef),
    /// 原gap完整coverage。
    Coverage(AuthoritativeCoverageRef),
    /// 原operation/effect权威无效果。
    NoEffect(NoEffectBasisRef),
    /// 仍不能确定。
    Unknown(SafeReasonCode),
    /// 当前来源不可用，不能当no-effect。
    Unavailable(SafeReasonCode),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Owner | 原inbound owner结果；`OwnerHandoffResultRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Action | 原callback owner结果；`OwnerActionResultRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Platform | 原effect已知平台业务结果及同次bounds；`KnownPlatformBusinessResult` | formal readonly method或actual匹配immutable receipt | 原attempt/receipt/intent/lane known finalize |
| Consumer | 原handoff consumer结果；`ConsumerDispositionRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Coverage | 原gap完整coverage；`AuthoritativeCoverageRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| NoEffect | 原operation/effect权威无效果；`NoEffectBasisRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Unknown | 仍不能确定；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Unavailable | 当前来源不可用，不能当no-effect；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### QualifiedLaneOrderScope
归属`shared/continuity.rs`；安装及原目标内的受限顺序。
```rust
/// 安装及原目标内的受限顺序。
pub struct QualifiedLaneOrderScope {
    /// 安装scope。
    installation: InstallationNamespace,
    /// 原relation。
    binding: ExternalBindingRef,
    /// 原代际。
    generation: BindingGeneration,
    /// 获准目标。
    location: ExternalLocationLocator,
    /// 平台方法对应动作。
    action: DirectionActionKind,
    /// rate/order主要resource。
    major_resource: SafeOpaqueId,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| installation | `InstallationNamespace` | 安装scope；config |
| binding | `ExternalBindingRef` | 原relation；qualified mapping |
| generation | `BindingGeneration` | 原代际；current binding |
| location | `ExternalLocationLocator` | 获准目标；location mapping |
| action | `DirectionActionKind` | 平台方法对应动作；capability资格 |
| major_resource | `SafeOpaqueId` | rate/order主要resource；platform official mapping，不能guess |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(installation: InstallationNamespace, binding: ExternalBindingRef, generation: BindingGeneration, location: ExternalLocationLocator, action: DirectionActionKind, major_resource: SafeOpaqueId) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_target(&self, target: &ImmutableDeliveryTargetRef) -> Result<(), ContractViolation>` | /// scope与target一致，不宣称跨channel全序 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn installation(&self) -> &InstallationNamespace` | /// 借用原installation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn binding(&self) -> &ExternalBindingRef` | /// 借用原binding字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn generation(&self) -> &BindingGeneration` | /// 借用原generation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn location(&self) -> &ExternalLocationLocator` | /// 借用原location字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn action(&self) -> &DirectionActionKind` | /// 借用原action字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn major_resource(&self) -> &SafeOpaqueId` | /// 借用原major_resource字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### QualifiedRateLimitBounds
归属`shared/continuity.rs`；一条平台或本地等待下界。
```rust
/// 一条平台或本地等待下界。
pub struct QualifiedRateLimitBounds {
    /// bucket/method/channel/global分类。
    scope: RateLimitScopeKind,
    /// 该下界适用的安全resource。
    scope_id: SafeOpaqueId,
    /// 不可提前调用的绝对下界。
    not_before: SafeInstant,
    /// 下界覆盖窗口。
    validity: SafeValidityWindow,
    /// 正式limit依据。
    basis: PlatformRateLimitBasisRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| scope | `RateLimitScopeKind` | bucket/method/channel/global分类；platform qualified response |
| scope_id | `SafeOpaqueId` | 该下界适用的安全resource；正式adapter配置/响应，不泄token |
| not_before | `SafeInstant` | 不可提前调用的绝对下界；可信clock转换Retry-After/源权威时间 |
| validity | `SafeValidityWindow` | 下界覆盖窗口；rate authority |
| basis | `PlatformRateLimitBasisRef` | 正式limit依据；platform实际返回或已核capability规则 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(scope: RateLimitScopeKind, scope_id: SafeOpaqueId, not_before: SafeInstant, validity: SafeValidityWindow, basis: PlatformRateLimitBasisRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn merge_lower_bound(&self, other: &Self) -> Result<Self, ContractViolation>` | /// 同scope取max，下界不能因config/backoff较小而缩短 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn scope(&self) -> &RateLimitScopeKind` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn scope_id(&self) -> &SafeOpaqueId` | /// 借用原scope_id字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn not_before(&self) -> &SafeInstant` | /// 借用原not_before字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &PlatformRateLimitBasisRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### QualifiedRateLimitBoundSet
归属`shared/continuity.rs`；所有适用scope下界集合。
```rust
/// 所有适用scope下界集合。
pub struct QualifiedRateLimitBoundSet {
    /// 适用下界向量。
    bounds: Vec<QualifiedRateLimitBounds>,
    /// 适用scope完整资格。
    qualification: RateLimitQualificationRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| bounds | `Vec<QualifiedRateLimitBounds>` | 适用下界向量；ConfigQualificationPort/PlatformDeliveryPort actual依据及LaneRepository共享scope读取，不新增第24port |
| qualification | `RateLimitQualificationRef` | 适用scope完整资格；registered adapter；空vec仍需显式无当前等待依据 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(bounds: Vec<QualifiedRateLimitBounds>, qualification: RateLimitQualificationRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn not_before(&self, now: SafeInstant) -> Result<SafeInstant, ContractViolation>` | /// 所有有效scope取max；依据过期或不完整返回错误，不当零等待 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn bounds(&self) -> &Vec<QualifiedRateLimitBounds>` | /// 借用原bounds字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn qualification(&self) -> &RateLimitQualificationRef` | /// 借用原qualification字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### RetryBudgetRef
归属`shared/continuity.rs`；原subject有限预算与窗口。
```rust
/// 原subject有限预算与窗口。
pub struct RetryBudgetRef {
    /// 原对象。
    subject: OriginalRecoverableSubjectRef,
    /// 窗口内允许尝试上限。
    maximum: u32,
    /// 已耗用尝试数。
    used: u32,
    /// 预算窗口。
    window: SafeValidityWindow,
    /// 预算来源。
    basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| subject | `OriginalRecoverableSubjectRef` | 原对象；existing store |
| maximum | `u32` | 窗口内允许尝试上限；正式配置/owner受权预算，不填默认数值 |
| used | `u32` | 已耗用尝试数；store原子预留，不因timeout归零 |
| window | `SafeValidityWindow` | 预算窗口；当前授权与平台window交集 |
| basis | `SafeAuthorityRef` | 预算来源；exact kind RetryBudgetRef；current qualification |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(subject: OriginalRecoverableSubjectRef, maximum: u32, used: u32, window: SafeValidityWindow, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn permits_next(&self, now: SafeInstant) -> bool` | /// used小于maximum且未过期才可候选；并发耗用须UoW |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn subject(&self) -> &OriginalRecoverableSubjectRef` | /// 借用原subject字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn maximum(&self) -> &u32` | /// 借用原maximum字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn used(&self) -> &u32` | /// 借用原used字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn window(&self) -> &SafeValidityWindow` | /// 借用原window字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### QualifiedRetentionWindowRef
归属`shared/continuity.rs`；保留去重与回放资格窗口。
```rust
/// 保留去重与回放资格窗口。
pub struct QualifiedRetentionWindowRef {
    /// 原namespace/scope。
    scope: DedupNamespaceScope,
    /// 保留及允许恢复的有限窗口。
    validity: SafeValidityWindow,
    /// retention依据。
    basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| scope | `DedupNamespaceScope` | 原namespace/scope；qualification |
| validity | `SafeValidityWindow` | 保留及允许恢复的有限窗口；正式source/policy |
| basis | `SafeAuthorityRef` | retention依据；exact kind QualifiedRetentionWindowRef |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(scope: DedupNamespaceScope, validity: SafeValidityWindow, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn within(&self, now: SafeInstant) -> bool` | /// 到期不删原unknown、不授新execute |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn scope(&self) -> &DedupNamespaceScope` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### FencedClaimRef
归属`shared/continuity.rs`；lane单次本地派发claim。
```rust
/// lane单次本地派发claim。
pub struct FencedClaimRef {
    /// 技术claim identity。
    claim_id: LocalObjectId,
    /// 原lane。
    lane: DispatchLaneRef,
    /// 本次attempt与原effect。
    attempt: AttemptEffectRef,
    /// 该lane单调fence。
    fence: FenceToken,
    /// 本地claim窗口。
    validity: SafeValidityWindow,
    /// 同UoW reservation或actual commit来源，不凭结构证明commit。
    basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| claim_id | `LocalObjectId` | 技术claim identity；UoW生成 |
| lane | `DispatchLaneRef` | 原lane；LaneRepository |
| attempt | `AttemptEffectRef` | 本次attempt与原effect；DeliveryRepository |
| fence | `FenceToken` | 该lane单调fence；LaneRepository原子claim |
| validity | `SafeValidityWindow` | 本地claim窗口；qualified claim config |
| basis | `SafeAuthorityRef` | 同UoW claim reservation/actual commit来源；exact kind FencedClaimRef；网络前另核actual commit/fence，构造不升级durable |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(claim_id: LocalObjectId, lane: DispatchLaneRef, attempt: AttemptEffectRef, fence: FenceToken, validity: SafeValidityWindow, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_attempt(&self, attempt: &AttemptEffectRef, now: SafeInstant) -> Result<(), ContractViolation>` | /// pure核对claim；fence/lease过期不证明平台无效果 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn claim_id(&self) -> &LocalObjectId` | /// 借用原claim_id字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn lane(&self) -> &DispatchLaneRef` | /// 借用原lane字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn attempt(&self) -> &AttemptEffectRef` | /// 借用原attempt字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn fence(&self) -> &FenceToken` | /// 借用原fence字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### HandoffClaimRef
归属`shared/continuity.rs`；入站或callback原owner operation接管证明。
```rust
/// 入站或callback原owner operation接管证明。
pub struct HandoffClaimRef {
    /// 技术claim。
    claim_id: LocalObjectId,
    /// 原Inbound/Callback。
    subject: OriginalRecoverableSubjectRef,
    /// 原operation/effect。
    original: OriginalOperationEffectRef,
    /// 该subject fence。
    fence: FenceToken,
    /// 有界调用资格。
    validity: SafeValidityWindow,
    /// 同UoW接管reservation或actual commit来源。
    basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| claim_id | `LocalObjectId` | 技术claim；UoW |
| subject | `OriginalRecoverableSubjectRef` | 原Inbound/Callback；existing snapshot，其他variant拒绝 |
| original | `OriginalOperationEffectRef` | 原operation/effect；same dedup reservation |
| fence | `FenceToken` | 该subject fence；local UoW |
| validity | `SafeValidityWindow` | 有界调用资格；owner/current policy |
| basis | `SafeAuthorityRef` | 同UoW接管reservation/actual commit来源；exact kind HandoffClaimRef；owner IO前另核durable及原op/fence |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(claim_id: LocalObjectId, subject: OriginalRecoverableSubjectRef, original: OriginalOperationEffectRef, fence: FenceToken, validity: SafeValidityWindow, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_original(&self, original: &OriginalOperationEffectRef) -> Result<(), ContractViolation>` | /// 不能经claim换op或把超时当未调用 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn claim_id(&self) -> &LocalObjectId` | /// 借用原claim_id字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn subject(&self) -> &OriginalRecoverableSubjectRef` | /// 借用原subject字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn original(&self) -> &OriginalOperationEffectRef` | /// 借用原original字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn fence(&self) -> &FenceToken` | /// 借用原fence字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### OneUseClaimRef
归属`shared/callback.rs`；callback原action原子one-use接管。
```rust
/// callback原action原子one-use接管。
pub struct OneUseClaimRef {
    /// 原action。
    action: ExternalActionBindingRef,
    /// 原callback。
    callback: CallbackRecordRef,
    /// 原owner operation/effect。
    original: OriginalOperationEffectRef,
    /// one-use原子fence。
    fence: FenceToken,
    /// one-use及期限依据。
    basis: ActionExpiryOneUseRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| action | `ExternalActionBindingRef` | 原action；CallbackRepository |
| callback | `CallbackRecordRef` | 原callback；same UoW |
| original | `OriginalOperationEffectRef` | 原owner operation/effect；same reservation |
| fence | `FenceToken` | one-use原子fence；CallbackRepository |
| basis | `ActionExpiryOneUseRef` | one-use及期限依据；正式owner/current source |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(action: ExternalActionBindingRef, callback: CallbackRecordRef, original: OriginalOperationEffectRef, fence: FenceToken, basis: ActionExpiryOneUseRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_action(&self, action: &ExternalActionBindingRef) -> Result<(), ContractViolation>` | /// 重复只对账原callback；取消不释放给新op |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn action(&self) -> &ExternalActionBindingRef` | /// 借用原action字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn callback(&self) -> &CallbackRecordRef` | /// 借用原callback字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn original(&self) -> &OriginalOperationEffectRef` | /// 借用原original字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn fence(&self) -> &FenceToken` | /// 借用原fence字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &ActionExpiryOneUseRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### SafeHandoffClaimRef
归属`shared/traceability.rs`；canonical consumer交接claim。
```rust
/// canonical consumer交接claim。
pub struct SafeHandoffClaimRef {
    /// 原handoff。
    handoff: SafeHandoffRef,
    /// 原consumer op。
    original: OriginalHandoffOperationRef,
    /// 本地交接fence。
    fence: FenceToken,
    /// 准入调用窗口。
    validity: SafeValidityWindow,
    /// 同UoW claim reservation或actual commit来源。
    basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| handoff | `SafeHandoffRef` | 原handoff；SafeTraceRepository的本地handoff读取面 |
| original | `OriginalHandoffOperationRef` | 原consumer op；same store |
| fence | `FenceToken` | 本地交接fence；UoW |
| validity | `SafeValidityWindow` | 准入调用窗口；admission/retention |
| basis | `SafeAuthorityRef` | 同UoW claim reservation/actual commit来源；exact kind SafeHandoffClaimRef；consumer IO前另核durable，不构造假commit proof |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(handoff: SafeHandoffRef, original: OriginalHandoffOperationRef, fence: FenceToken, validity: SafeValidityWindow, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_original(&self, original: &OriginalHandoffOperationRef) -> Result<(), ContractViolation>` | /// 只交原canonical材料；lease不证明consumer未收 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn handoff(&self) -> &SafeHandoffRef` | /// 借用原handoff字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn original(&self) -> &OriginalHandoffOperationRef` | /// 借用原original字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn fence(&self) -> &FenceToken` | /// 借用原fence字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### DispatchEligibilityRef
归属`shared/delivery.rs`；原intent派发的完整current资格。
```rust
/// 原intent派发的完整current资格。
pub struct DispatchEligibilityRef {
    /// 原intent/effect。
    intent: DeliveryIntentEffectRef,
    /// 当前原plan/target/source资格。
    presentation: CurrentPresentationQualification,
    /// 原lane scope。
    lane: QualifiedLaneOrderScope,
    /// 原change/thread依赖。
    dependency: DeliveryDependencyRefSlot,
    /// 全部下界。
    rate: QualifiedRateLimitBoundSet,
    /// 有界尝试预算。
    budget: RetryBudgetRef,
    /// 本次调用窗口。
    window: AuthorizedAttemptWindowRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| intent | `DeliveryIntentEffectRef` | 原intent/effect；existing store |
| presentation | `CurrentPresentationQualification` | 当前原plan/target/source资格；PresentationQualificationPort |
| lane | `QualifiedLaneOrderScope` | 原lane scope；ConfigQualificationPort/MappingRepository/LaneRepository actual scope |
| dependency | `DeliveryDependencyRefSlot` | 原change/thread依赖；known mapping |
| rate | `QualifiedRateLimitBoundSet` | 全部下界；current limit资格 |
| budget | `RetryBudgetRef` | 有界尝试预算；current policy/store |
| window | `AuthorizedAttemptWindowRef` | 本次调用窗口；current installation/owner/adapter |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(intent: DeliveryIntentEffectRef, presentation: CurrentPresentationQualification, lane: QualifiedLaneOrderScope, dependency: DeliveryDependencyRefSlot, rate: QualifiedRateLimitBoundSet, budget: RetryBudgetRef, window: AuthorizedAttemptWindowRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_ready(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// 核current原target/generation、依赖、预算和全部下界；IO前重新核撤销 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn intent(&self) -> &DeliveryIntentEffectRef` | /// 借用原intent字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn presentation(&self) -> &CurrentPresentationQualification` | /// 借用原presentation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn lane(&self) -> &QualifiedLaneOrderScope` | /// 借用原lane字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn dependency(&self) -> &DeliveryDependencyRefSlot` | /// 借用原dependency字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn rate(&self) -> &QualifiedRateLimitBoundSet` | /// 借用原rate字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn budget(&self) -> &RetryBudgetRef` | /// 借用原budget字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn window(&self) -> &AuthorizedAttemptWindowRef` | /// 借用原window字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### RecoveryQualificationRef
归属`shared/continuity.rs`；原subject的受权只读probe资格。
```rust
/// 原subject的受权只读probe资格。
pub struct RecoveryQualificationRef {
    /// 原subject。
    subject: OriginalRecoverableSubjectRef,
    /// 原op/effect。
    original: OriginalOperationEffectRef,
    /// 当前恢复依据。
    authorization: RecoveryAuthorizationRef,
    /// source查询或回放窗口。
    window: RecoveryWindowRef,
    /// 有界查询预算。
    budget: RetryBudgetRef,
    /// 实际probe source合同。
    source: SafeAuthoritySourceRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| subject | `OriginalRecoverableSubjectRef` | 原subject；existing snapshot |
| original | `OriginalOperationEffectRef` | 原op/effect；same snapshot |
| authorization | `RecoveryAuthorizationRef` | 当前恢复依据；current Policy/Gate |
| window | `RecoveryWindowRef` | source查询或回放窗口；authoritative source |
| budget | `RetryBudgetRef` | 有界查询预算；maintenance policy |
| source | `SafeAuthoritySourceRef` | 实际probe source合同；registered AuthoritativeRecoveryPort |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(subject: OriginalRecoverableSubjectRef, original: OriginalOperationEffectRef, authorization: RecoveryAuthorizationRef, window: RecoveryWindowRef, budget: RetryBudgetRef, source: SafeAuthoritySourceRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_original(&self, subject: &OriginalRecoverableSubjectRef, original: &OriginalOperationEffectRef) -> Result<(), ContractViolation>` | /// 限制read/probe，不许可新owner mutation或平台send |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn subject(&self) -> &OriginalRecoverableSubjectRef` | /// 借用原subject字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn original(&self) -> &OriginalOperationEffectRef` | /// 借用原original字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn authorization(&self) -> &RecoveryAuthorizationRef` | /// 借用原authorization字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn window(&self) -> &RecoveryWindowRef` | /// 借用原window字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn budget(&self) -> &RetryBudgetRef` | /// 借用原budget字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn source(&self) -> &SafeAuthoritySourceRef` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### AuthoritativeProbeResultRef
归属`shared/continuity.rs`；原op/effect实际probe安全结果。
```rust
/// 原op/effect实际probe安全结果。
pub struct AuthoritativeProbeResultRef {
    /// 被查原subject。
    subject: OriginalRecoverableSubjectRef,
    /// 被查原op/effect。
    original: OriginalOperationEffectRef,
    /// 阶段特定结果。
    outcome: ProbeOutcome,
    /// 查询权威与版本。
    basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| subject | `OriginalRecoverableSubjectRef` | 被查原subject；qualified probe |
| original | `OriginalOperationEffectRef` | 被查原op/effect；same query |
| outcome | `ProbeOutcome` | 阶段特定结果；authoritative source，不是平台ACK |
| basis | `SafeAuthorityRef` | 查询权威与版本；exact kind AuthoritativeProbeResultRef |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(subject: OriginalRecoverableSubjectRef, original: OriginalOperationEffectRef, outcome: ProbeOutcome, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_original(&self, original: &OriginalOperationEffectRef) -> Result<(), ContractViolation>` | /// wrong-op/effect/range拒绝；Unknown/Unavailable只能保unknown/manual |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn subject(&self) -> &OriginalRecoverableSubjectRef` | /// 借用原subject字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn original(&self) -> &OriginalOperationEffectRef` | /// 借用原original字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn outcome(&self) -> &ProbeOutcome` | /// 借用原outcome字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。


## 13. 配置与secret引用


### SecretUsePurpose
归属`config.rs`；secret受限用途分类。
```rust
/// secret受限用途分类。
pub enum SecretUsePurpose {
    /// 验证入站来源。
    VerifyIngress,
    /// 验证交互回调。
    VerifyCallback,
    /// 建立获准source连接。
    ConnectSource,
    /// 投递获准原effect。
    Deliver,
    /// 原subject权威只读查询。
    AuthoritativeProbe,
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| VerifyIngress | 验证入站来源 | 所属正式source/纯组装 | 不适用，无lifecycle |
| VerifyCallback | 验证交互回调 | 所属正式source/纯组装 | 不适用，无lifecycle |
| ConnectSource | 建立获准source连接 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Deliver | 投递获准原effect | 所属正式source/纯组装 | 不适用，无lifecycle |
| AuthoritativeProbe | 原subject权威只读查询 | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### OpaqueSecretBindingRef
归属`config.rs`；只持有provider与key的安全版本化引用。
```rust
/// 只持有provider与key的安全版本化引用。
pub struct OpaqueSecretBindingRef {
    /// 已核provider。
    provider: SecretProviderRef,
    /// opaque key locator。
    key: SecretKeyRef,
    /// secret绑定精确版本。
    revision: SafeRevision,
    /// 允许用处scope。
    scope: SafeScopeRef,
    /// 有效窗口。
    validity: SafeValidityWindow,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| provider | `SecretProviderRef` | 已核provider；SecretResolutionPort |
| key | `SecretKeyRef` | opaque key locator；同provider；不是secret/token |
| revision | `SafeRevision` | secret绑定精确版本；provider实际版本 |
| scope | `SafeScopeRef` | 允许用处scope；provider qualification |
| validity | `SafeValidityWindow` | 有效窗口；实际provider source |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(provider: SecretProviderRef, key: SecretKeyRef, revision: SafeRevision, scope: SafeScopeRef, validity: SafeValidityWindow) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_version(&self, revision: &SafeRevision) -> Result<(), ContractViolation>` | /// 轮换不可静默替换正在进行的原调用版本；撤销每次当前核验 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn provider(&self) -> &SecretProviderRef` | /// 借用原provider字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn key(&self) -> &SecretKeyRef` | /// 借用原key字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn revision(&self) -> &SafeRevision` | /// 借用原revision字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn scope(&self) -> &SafeScopeRef` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：不带endpoint/secret bytes，不默认Debug/Display；引用可持久化不代表凭据值可写日志。

### QualifiedSecretUseContext
归属`config.rs`；单次本用途当前secret资格。
```rust
/// 单次本用途当前secret资格。
pub struct QualifiedSecretUseContext {
    /// 原installation。
    installation: BridgeInstallationRef,
    /// 精确原secret binding。
    binding: OpaqueSecretBindingRef,
    /// 本次用途。
    purpose: SecretUsePurpose,
    /// 受限调用scope。
    scope: SafeScopeRef,
    /// 已核路由依据。
    route: RoutePolicyRef,
    /// current provider use依据。
    basis: SafeAuthorityRef,
    /// 本次交集期限。
    validity: SafeValidityWindow,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| installation | `BridgeInstallationRef` | 原installation；qualified config |
| binding | `OpaqueSecretBindingRef` | 精确原secret binding；same current config |
| purpose | `SecretUsePurpose` | 本次用途；registered adapter action |
| scope | `SafeScopeRef` | 受限调用scope；正式resolver |
| route | `RoutePolicyRef` | 已核路由依据；ConfigQualificationPort |
| basis | `SafeAuthorityRef` | current provider use依据；exact kind QualifiedSecretUseContext |
| validity | `SafeValidityWindow` | 本次交集期限；provider及adapter资格 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(installation: BridgeInstallationRef, binding: OpaqueSecretBindingRef, purpose: SecretUsePurpose, scope: SafeScopeRef, route: RoutePolicyRef, basis: SafeAuthorityRef, validity: SafeValidityWindow) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_use(&self, purpose: SecretUsePurpose, now: SafeInstant) -> Result<(), ContractViolation>` | /// 用途/期限预检；SecretResolutionPort再次核撤销，不自取secret |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn installation(&self) -> &BridgeInstallationRef` | /// 借用原installation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn binding(&self) -> &OpaqueSecretBindingRef` | /// 借用原binding字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn purpose(&self) -> &SecretUsePurpose` | /// 借用原purpose字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn scope(&self) -> &SafeScopeRef` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn route(&self) -> &RoutePolicyRef` | /// 借用原route字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### InstallationConfigDraft
归属`config.rs`；完整safe配置草案，不附凭据或私有URL。
```rust
/// 完整safe配置草案，不附凭据或私有URL。
pub struct InstallationConfigDraft {
    /// 安装namespace。
    namespace: InstallationNamespace,
    /// 平台分类。
    platform_kind: PlatformKind,
    /// 拟接纳配置版本。
    revision: ConfigRevision,
    /// 逐method/source能力ref。
    capability: CapabilitySnapshotRef,
    /// 精确secret引用。
    secret_binding: OpaqueSecretBindingRef,
    /// 路由配置ref。
    route_policy: RoutePolicyRef,
    /// 配置授权依据。
    basis: ConfigurationBasisRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| namespace | `InstallationNamespace` | 安装namespace；受权配置输入 |
| platform_kind | `PlatformKind` | 平台分类；与namespace一致 |
| revision | `ConfigRevision` | 拟接纳配置版本；首次1/现有CAS下一值 |
| capability | `CapabilitySnapshotRef` | 逐method/source能力ref；已核adapter配置 |
| secret_binding | `OpaqueSecretBindingRef` | 精确secret引用；qualified provider ref |
| route_policy | `RoutePolicyRef` | 路由配置ref；受权config |
| basis | `ConfigurationBasisRef` | 配置授权依据；正式配置授权 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(namespace: InstallationNamespace, platform_kind: PlatformKind, revision: ConfigRevision, capability: CapabilitySnapshotRef, secret_binding: OpaqueSecretBindingRef, route_policy: RoutePolicyRef, basis: ConfigurationBasisRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_namespace(&self, namespace: &InstallationNamespace) -> Result<(), ContractViolation>` | /// 不能跨安装换platform；完整内容变化才经受权CAS |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn namespace(&self) -> &InstallationNamespace` | /// 借用原namespace字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn platform_kind(&self) -> &PlatformKind` | /// 借用原platform_kind字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn revision(&self) -> &ConfigRevision` | /// 借用原revision字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn capability(&self) -> &CapabilitySnapshotRef` | /// 借用原capability字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn secret_binding(&self) -> &OpaqueSecretBindingRef` | /// 借用原secret_binding字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn route_policy(&self) -> &RoutePolicyRef` | /// 借用原route_policy字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &ConfigurationBasisRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。


## 14. exact Slot别名与特殊分支

所有别名只复用已闭口QualificationSlot；不是新增truth机。每个名称独立定义，alias展开的Missing/Established/Stale字段来源和允许迁移沿基础卡，实际所需状态如下。公共输出不得序列化内部Stale旧ref，必须visibility过滤。

### ActorRefSlot
归属`shared/authority.rs`；C-STATE。
```rust
/// Inbound导出owner前，AppendFact为正式Integration；display_name=None，缺失与过期都不能执行。
pub type ActorRefSlot = QualificationSlot<ActorRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有ActorRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史ActorRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: ActorRef) -> Self` | /// 只包裹结构合法值；Inbound导出owner前，AppendFact为正式Integration；display_name=None。 |
| `pub fn require_established(&self) -> Result<&ActorRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### ActorResponsibilityRefSlot
归属`shared/authority.rs`；C-STATE。
```rust
/// ExternalBinding Active前，缺失与过期都不能执行。
pub type ActorResponsibilityRefSlot = QualificationSlot<ActorResponsibilityRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有ActorResponsibilityRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史ActorResponsibilityRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: ActorResponsibilityRef) -> Self` | /// 只包裹结构合法值；ExternalBinding Active前。 |
| `pub fn require_established(&self) -> Result<&ActorResponsibilityRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### AuthorizedBindingBasisRefSlot
归属`shared/authority.rs`；C-STATE。
```rust
/// ExternalBinding Active前，缺失与过期都不能执行。
pub type AuthorizedBindingBasisRefSlot = QualificationSlot<AuthorizedBindingBasisRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有AuthorizedBindingBasisRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史AuthorizedBindingBasisRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: AuthorizedBindingBasisRef) -> Self` | /// 只包裹结构合法值；ExternalBinding Active前。 |
| `pub fn require_established(&self) -> Result<&AuthorizedBindingBasisRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### AuthorizedMappingContextRefSlot
归属`shared/authority.rs`；C-STATE。
```rust
/// Inbound begin_handoff前完整current原mapping，缺失与过期都不能执行。
pub type AuthorizedMappingContextRefSlot = QualificationSlot<AuthorizedMappingContextRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有AuthorizedMappingContextRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史AuthorizedMappingContextRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: AuthorizedMappingContextRef) -> Self` | /// 只包裹结构合法值；Inbound begin_handoff前完整current原mapping。 |
| `pub fn require_established(&self) -> Result<&AuthorizedMappingContextRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### AllowedProjectionRefSlot
归属`shared/material.rs`；C-STATE。
```rust
/// Qualified/Downgraded Plan前，缺失与过期都不能执行。
pub type AllowedProjectionRefSlot = QualificationSlot<AllowedProjectionRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有AllowedProjectionRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史AllowedProjectionRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: AllowedProjectionRef) -> Self` | /// 只包裹结构合法值；Qualified/Downgraded Plan前。 |
| `pub fn require_established(&self) -> Result<&AllowedProjectionRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### AttachmentGrantRefSetSlot
归属`shared/material.rs`；C-STATE。
```rust
/// 可派发Plan前；无附件必须Established(empty)且有正式basis，缺失与过期都不能执行。
pub type AttachmentGrantRefSetSlot = QualificationSlot<AttachmentGrantRefSet>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有AttachmentGrantRefSet，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史AttachmentGrantRefSet及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: AttachmentGrantRefSet) -> Self` | /// 只包裹结构合法值；可派发Plan前；无附件必须Established(empty)且有正式basis。 |
| `pub fn require_established(&self) -> Result<&AttachmentGrantRefSet, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### QualifiedMaterialRefSlot
归属`shared/material.rs`；C-STATE。
```rust
/// Inbound begin_handoff前，缺失与过期都不能执行。
pub type QualifiedMaterialRefSlot = QualificationSlot<QualifiedMaterialRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有QualifiedMaterialRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史QualifiedMaterialRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: QualifiedMaterialRef) -> Self` | /// 只包裹结构合法值；Inbound begin_handoff前。 |
| `pub fn require_established(&self) -> Result<&QualifiedMaterialRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### SafeSourceRefSlot
归属`shared/material.rs`；C-STATE。
```rust
/// Inbound handoff/replay前，缺失与过期都不能执行。
pub type SafeSourceRefSlot = QualificationSlot<SafeSourceRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有SafeSourceRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史SafeSourceRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: SafeSourceRef) -> Self` | /// 只包裹结构合法值；Inbound handoff/replay前。 |
| `pub fn require_established(&self) -> Result<&SafeSourceRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### BridgeTargetModeSlot
归属`shared/material.rs`；C-STATE。
```rust
/// owner导出协议前，缺失与过期都不能执行。
pub type BridgeTargetModeSlot = QualificationSlot<BridgeTargetMode>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有BridgeTargetMode，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史BridgeTargetMode及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: BridgeTargetMode) -> Self` | /// 只包裹结构合法值；owner导出协议前。 |
| `pub fn require_established(&self) -> Result<&BridgeTargetMode, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### OwnerHandoffResultRefSlot
归属`shared/material.rs`；C-STATE。
```rust
/// owner终态要求实际分类一致，缺失与过期都不能执行。
pub type OwnerHandoffResultRefSlot = QualificationSlot<OwnerHandoffResultRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有OwnerHandoffResultRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史OwnerHandoffResultRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: OwnerHandoffResultRef) -> Self` | /// 只包裹结构合法值；owner终态要求实际分类一致。 |
| `pub fn require_established(&self) -> Result<&OwnerHandoffResultRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### OwnerAcceptedRefSlot
归属`shared/material.rs`；C-STATE。
```rust
/// 已知inbound mapping/Accepted owner结果前，缺失与过期都不能执行。
pub type OwnerAcceptedRefSlot = QualificationSlot<OwnerAcceptedRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有OwnerAcceptedRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史OwnerAcceptedRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: OwnerAcceptedRef) -> Self` | /// 只包裹结构合法值；已知inbound mapping/Accepted owner结果前。 |
| `pub fn require_established(&self) -> Result<&OwnerAcceptedRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### DeliveryEffectRefSlot
归属`shared/delivery.rs`；C-STATE。
```rust
/// outbound mapping回链前，缺失与过期都不能执行。
pub type DeliveryEffectRefSlot = QualificationSlot<DeliveryEffectRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有DeliveryEffectRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史DeliveryEffectRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: DeliveryEffectRef) -> Self` | /// 只包裹结构合法值；outbound mapping回链前。 |
| `pub fn require_established(&self) -> Result<&DeliveryEffectRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### PlatformBusinessResultRefSlot
归属`shared/delivery.rs`；C-STATE。
```rust
/// Attempt BusinessAccepted/Rejected前，缺失与过期都不能执行。
pub type PlatformBusinessResultRefSlot = QualificationSlot<PlatformBusinessResultRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有PlatformBusinessResultRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史PlatformBusinessResultRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: PlatformBusinessResultRef) -> Self` | /// 只包裹结构合法值；Attempt BusinessAccepted/Rejected前。 |
| `pub fn require_established(&self) -> Result<&PlatformBusinessResultRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### NoEffectBasisRefSlot
归属`shared/delivery.rs`；C-STATE。
```rust
/// 明确retry资格前；known拒绝也不自动建立，缺失与过期都不能执行。
pub type NoEffectBasisRefSlot = QualificationSlot<NoEffectBasisRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有NoEffectBasisRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史NoEffectBasisRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: NoEffectBasisRef) -> Self` | /// 只包裹结构合法值；明确retry资格前；known拒绝也不自动建立。 |
| `pub fn require_established(&self) -> Result<&NoEffectBasisRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### RetryEligibilityRefSlot
归属`shared/delivery.rs`；C-STATE。
```rust
/// 同effect重试前，不准未知直接重试，缺失与过期都不能执行。
pub type RetryEligibilityRefSlot = QualificationSlot<RetryEligibilityRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有RetryEligibilityRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史RetryEligibilityRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: RetryEligibilityRef) -> Self` | /// 只包裹结构合法值；同effect重试前，不准未知直接重试。 |
| `pub fn require_established(&self) -> Result<&RetryEligibilityRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### DisclosureQualificationRefSlot
归属`shared/delivery.rs`；C-STATE。
```rust
/// Qualified/Downgraded敏感展示前，缺失与过期都不能执行。
pub type DisclosureQualificationRefSlot = QualificationSlot<DisclosureQualificationRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有DisclosureQualificationRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史DisclosureQualificationRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: DisclosureQualificationRef) -> Self` | /// 只包裹结构合法值；Qualified/Downgraded敏感展示前。 |
| `pub fn require_established(&self) -> Result<&DisclosureQualificationRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### CallbackVerificationRefSlot
归属`shared/callback.rs`；C-STATE。
```rust
/// Callback Verified/HandoffPending前，缺失与过期都不能执行。
pub type CallbackVerificationRefSlot = QualificationSlot<CallbackVerificationRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有CallbackVerificationRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史CallbackVerificationRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: CallbackVerificationRef) -> Self` | /// 只包裹结构合法值；Callback Verified/HandoffPending前。 |
| `pub fn require_established(&self) -> Result<&CallbackVerificationRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### ExternalActionBindingRefSlot
归属`shared/callback.rs`；C-STATE。
```rust
/// Callback Verified前，缺失与过期都不能执行。
pub type ExternalActionBindingRefSlot = QualificationSlot<ExternalActionBindingRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有ExternalActionBindingRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史ExternalActionBindingRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: ExternalActionBindingRef) -> Self` | /// 只包裹结构合法值；Callback Verified前。 |
| `pub fn require_established(&self) -> Result<&ExternalActionBindingRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### OneUseClaimRefSlot
归属`shared/callback.rs`；C-STATE。
```rust
/// Callback HandoffPending前，缺失与过期都不能执行。
pub type OneUseClaimRefSlot = QualificationSlot<OneUseClaimRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有OneUseClaimRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史OneUseClaimRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: OneUseClaimRef) -> Self` | /// 只包裹结构合法值；Callback HandoffPending前。 |
| `pub fn require_established(&self) -> Result<&OneUseClaimRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### OwnerActionResultRefSlot
归属`shared/callback.rs`；C-STATE。
```rust
/// Callback owner终态前，缺失与过期都不能执行。
pub type OwnerActionResultRefSlot = QualificationSlot<OwnerActionResultRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有OwnerActionResultRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史OwnerActionResultRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: OwnerActionResultRef) -> Self` | /// 只包裹结构合法值；Callback owner终态前。 |
| `pub fn require_established(&self) -> Result<&OwnerActionResultRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### OwnerTargetActionRefSlot
归属`shared/callback.rs`；C-STATE。
```rust
/// Callback begin_handoff前，缺失与过期都不能执行。
pub type OwnerTargetActionRefSlot = QualificationSlot<OwnerTargetActionRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有OwnerTargetActionRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史OwnerTargetActionRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: OwnerTargetActionRef) -> Self` | /// 只包裹结构合法值；Callback begin_handoff前。 |
| `pub fn require_established(&self) -> Result<&OwnerTargetActionRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### AuthoritativeComparatorRefSlot
归属`shared/continuity.rs`；C-STATE。
```rust
/// Stream Ready/advance前，缺失与过期都不能执行。
pub type AuthoritativeComparatorRefSlot = QualificationSlot<AuthoritativeComparatorRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有AuthoritativeComparatorRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史AuthoritativeComparatorRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: AuthoritativeComparatorRef) -> Self` | /// 只包裹结构合法值；Stream Ready/advance前。 |
| `pub fn require_established(&self) -> Result<&AuthoritativeComparatorRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### AuthoritativeCoverageRefSlot
归属`shared/continuity.rs`；C-STATE。
```rust
/// Gap Closed前，缺失与过期都不能执行。
pub type AuthoritativeCoverageRefSlot = QualificationSlot<AuthoritativeCoverageRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有AuthoritativeCoverageRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史AuthoritativeCoverageRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: AuthoritativeCoverageRef) -> Self` | /// 只包裹结构合法值；Gap Closed前。 |
| `pub fn require_established(&self) -> Result<&AuthoritativeCoverageRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### ContinuityCoverageRefSlot
归属`shared/continuity.rs`；C-STATE。
```rust
/// Cursor advance前，缺失与过期都不能执行。
pub type ContinuityCoverageRefSlot = QualificationSlot<ContinuityCoverageRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有ContinuityCoverageRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史ContinuityCoverageRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: ContinuityCoverageRef) -> Self` | /// 只包裹结构合法值；Cursor advance前。 |
| `pub fn require_established(&self) -> Result<&ContinuityCoverageRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### FencedClaimRefSlot
归属`shared/continuity.rs`；C-STATE。
```rust
/// Lane Held前，缺失与过期都不能执行。
pub type FencedClaimRefSlot = QualificationSlot<FencedClaimRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有FencedClaimRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史FencedClaimRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: FencedClaimRef) -> Self` | /// 只包裹结构合法值；Lane Held前。 |
| `pub fn require_established(&self) -> Result<&FencedClaimRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### RecoveryQualificationRefSlot
归属`shared/continuity.rs`；C-STATE。
```rust
/// Recovery/Gap Probing前，缺失与过期都不能执行。
pub type RecoveryQualificationRefSlot = QualificationSlot<RecoveryQualificationRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有RecoveryQualificationRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史RecoveryQualificationRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: RecoveryQualificationRef) -> Self` | /// 只包裹结构合法值；Recovery/Gap Probing前。 |
| `pub fn require_established(&self) -> Result<&RecoveryQualificationRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### RecoveryRecordRefSlot
归属`shared/continuity.rs`；C-STATE。
```rust
/// Gap probing关联原受权恢复；Open可Missing，缺失与过期都不能执行。
pub type RecoveryRecordRefSlot = QualificationSlot<RecoveryRecordRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有RecoveryRecordRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史RecoveryRecordRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: RecoveryRecordRef) -> Self` | /// 只包裹结构合法值；Gap probing关联原受权恢复；Open可Missing。 |
| `pub fn require_established(&self) -> Result<&RecoveryRecordRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### AuthoritativeProbeResultRefSlot
归属`shared/continuity.rs`；C-STATE。
```rust
/// Recovery Resolved前，缺失与过期都不能执行。
pub type AuthoritativeProbeResultRefSlot = QualificationSlot<AuthoritativeProbeResultRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有AuthoritativeProbeResultRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史AuthoritativeProbeResultRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: AuthoritativeProbeResultRef) -> Self` | /// 只包裹结构合法值；Recovery Resolved前。 |
| `pub fn require_established(&self) -> Result<&AuthoritativeProbeResultRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### ConsumerDispositionRefSlot
归属`shared/traceability.rs`；C-STATE。
```rust
/// Handoff consumer终态前，缺失与过期都不能执行。
pub type ConsumerDispositionRefSlot = QualificationSlot<ConsumerDispositionRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有ConsumerDispositionRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史ConsumerDispositionRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: ConsumerDispositionRef) -> Self` | /// 只包裹结构合法值；Handoff consumer终态前。 |
| `pub fn require_established(&self) -> Result<&ConsumerDispositionRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### SafeOriginalResultRefSlot
归属`shared/outcomes.rs`；C-STATE。
```rust
/// Dedup ResultRecorded前；read每次重新过滤，缺失与过期都不能执行。
pub type SafeOriginalResultRefSlot = QualificationSlot<SafeOriginalResultRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有SafeOriginalResultRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史SafeOriginalResultRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: SafeOriginalResultRef) -> Self` | /// 只包裹结构合法值；Dedup ResultRecorded前；read每次重新过滤。 |
| `pub fn require_established(&self) -> Result<&SafeOriginalResultRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |

### InstallationQualificationRefSlot
归属`config.rs`；C-STATE。
```rust
/// Installation Qualified前，缺失与过期都不能执行。
pub type InstallationQualificationRefSlot = QualificationSlot<InstallationQualificationRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 来源 / 允许去向 |
|---|---|---|
| Missing | /// 尚未具备；SafeReasonCode。 | factory/source缺口；所属对象明确qualified方法才建立 |
| Established | /// 已有InstallationQualificationRef，不永久授权。 | 对应typed来源；失效只能Stale或所属明确维护替换 |
| Stale | /// 历史InstallationQualificationRef及finite reason。 | 当前撤销/失效；原终态不复活 |

| factory / member完整签名 | 中文Rustdoc / required |
|---|---|
| `pub fn missing(reason: SafeReasonCode) -> Self` | /// 显式缺口，不能用假ref填补。 |
| `pub fn established(value: InstallationQualificationRef) -> Self` | /// 只包裹结构合法值；Installation Qualified前。 |
| `pub fn require_established(&self) -> Result<&InstallationQualificationRef, ContractViolation>` | /// 纯读取；Missing/Stale拒绝，IO前重核。 |


### OwnerRequiredDigestRefSlot
归属`shared/material.rs`；owner digest要求的明确适用性，非正文hash。
```rust
/// owner digest要求的明确适用性，非正文hash。
pub enum OwnerRequiredDigestRefSlot {
    /// owner要求尚未解析，阻handoff。
    UnknownRequirement(SafeReasonCode),
    /// owner明确当前schema无此要求，exact kind OwnerRequiredDigestRefSlot。
    NotRequired(SafeAuthorityRef),
    /// owner明确required；Established才允许交接，引用不得含可重构body摘要。
    Required(QualificationSlot<OwnerRequiredDigestRef>),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| UnknownRequirement | owner要求尚未解析，阻handoff；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |
| NotRequired | owner明确当前schema无此要求，exact kind OwnerRequiredDigestRefSlot；`SafeAuthorityRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Required | owner明确required；Established才允许交接，引用不得含可重构body摘要；`QualificationSlot<OwnerRequiredDigestRef>` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |
| 成员 | `pub fn assert_ready(&self, material: &CurrentMaterialQualification) -> Result<(), ContractViolation>` | /// 检查当前owner要求和同material/source版本，Unknown或Required欠缺拒绝 |

### VerifiedExternalMessageLocatorSlot
归属`shared/locators.rs`；已知结果定位与不适用分开。
```rust
/// 已知结果定位与不适用分开。
pub enum VerifiedExternalMessageLocatorSlot {
    /// 正式method结果无新locator，如delete；不能应用于create。
    NotApplicable(SafeAuthoritySourceRef),
    /// actual known result定位。
    Established(ExternalMessageLocator),
    /// method要求但locator缺失，不能构造成功mapping。
    Missing(SafeReasonCode),
    /// 历史定位失效，不换默认目标。
    Stale(ExternalMessageLocator),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| NotApplicable | 正式method结果无新locator，如delete；不能应用于create；`SafeAuthoritySourceRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Established | actual known result定位；`ExternalMessageLocator` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Missing | method要求但locator缺失，不能构造成功mapping；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Stale | 历史定位失效，不换默认目标；`ExternalMessageLocator` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |
| 成员 | `pub fn require_locator(&self) -> Result<&ExternalMessageLocator, ContractViolation>` | /// 只有Established可返回，NotApplicable不能满足create/thread依赖 |


## 15. 安全追溯、独立阶段与local提交


### BridgeViewSubjectRef
归属`views.rs`；typed local读取主语，不能反推scope。
```rust
/// typed local读取主语，不能反推scope。
pub enum BridgeViewSubjectRef {
    /// 既有配置主语。
    Installation(BridgeInstallationRef),
    /// 既有relation。
    Binding(ExternalBindingRef),
    /// 既有typed mapping。
    Mapping(MappingRef),
    /// 既有operation。
    Operation(BridgeOperationRef),
    /// 既有inbound。
    Inbound(InboundRecordRef),
    /// 既有plan。
    Presentation(PresentationPlanRef),
    /// 既有intent。
    Intent(DeliveryIntentRef),
    /// 既有attempt。
    Attempt(AttemptRef),
    /// 已知receipt。
    Receipt(PlatformReceiptRef),
    /// 既有action。
    Action(ExternalActionBindingRef),
    /// 既有callback。
    Callback(CallbackRecordRef),
    /// 既有dedup。
    Dedup(DedupRecordRef),
    /// 既有cursor。
    Cursor(StreamCursorRef),
    /// 既有gap。
    Gap(GapRef),
    /// 既有lane。
    Lane(DispatchLaneRef),
    /// 既有recovery。
    Recovery(RecoveryRecordRef),
    /// 既有body-free audit。
    Audit(SafeAuditRef),
    /// 既有handoff。
    Handoff(SafeHandoffRef),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Installation | 既有配置主语；`BridgeInstallationRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Binding | 既有relation；`ExternalBindingRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Mapping | 既有typed mapping；`MappingRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Operation | 既有operation；`BridgeOperationRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Inbound | 既有inbound；`InboundRecordRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Presentation | 既有plan；`PresentationPlanRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Intent | 既有intent；`DeliveryIntentRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Attempt | 既有attempt；`AttemptRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Receipt | 已知receipt；`PlatformReceiptRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Action | 既有action；`ExternalActionBindingRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Callback | 既有callback；`CallbackRecordRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Dedup | 既有dedup；`DedupRecordRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Cursor | 既有cursor；`StreamCursorRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Gap | 既有gap；`GapRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Lane | 既有lane；`DispatchLaneRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Recovery | 既有recovery；`RecoveryRecordRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Audit | 既有body-free audit；`SafeAuditRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Handoff | 既有handoff；`SafeHandoffRef` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### SafeLocalBusinessState
归属`views.rs`；局部业务state的有限联合，不改变主语。
```rust
/// 局部业务state的有限联合，不改变主语。
pub enum SafeLocalBusinessState {
    /// 安装局部state。
    Installation(BridgeInstallationState),
    /// relation state。
    Binding(ExternalBindingState),
    /// 账号mapping state。
    IdentityMapping(IdentityMappingState),
    /// 位置mapping state。
    LocationMapping(LocationMappingState),
    /// 消息回链state。
    MessageMapping(MessageMappingState),
    /// inbound state。
    Inbound(InboundHandoffState),
    /// plan state。
    Presentation(PresentationState),
    /// intent state。
    Intent(DeliveryIntentState),
    /// attempt state。
    Attempt(DeliveryAttemptState),
    /// action state。
    Action(ExternalActionState),
    /// callback state。
    Callback(CallbackHandoffState),
    /// dedup state。
    Dedup(DedupState),
    /// cursor state。
    Cursor(StreamCursorState),
    /// gap state。
    Gap(GapState),
    /// lane state。
    Lane(DispatchLaneState),
    /// recovery state。
    Recovery(RecoveryState),
    /// handoff state。
    Handoff(SafeHandoffState),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Installation | 安装局部state；`BridgeInstallationState` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Binding | relation state；`ExternalBindingState` | 所属正式source/纯组装 | 不适用，无lifecycle |
| IdentityMapping | 账号mapping state；`IdentityMappingState` | 所属正式source/纯组装 | 不适用，无lifecycle |
| LocationMapping | 位置mapping state；`LocationMappingState` | 所属正式source/纯组装 | 不适用，无lifecycle |
| MessageMapping | 消息回链state；`MessageMappingState` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Inbound | inbound state；`InboundHandoffState` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Presentation | plan state；`PresentationState` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Intent | intent state；`DeliveryIntentState` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Attempt | attempt state；`DeliveryAttemptState` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Action | action state；`ExternalActionState` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Callback | callback state；`CallbackHandoffState` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Dedup | dedup state；`DedupState` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Cursor | cursor state；`StreamCursorState` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Gap | gap state；`GapState` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Lane | lane state；`DispatchLaneState` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Recovery | recovery state；`RecoveryState` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Handoff | handoff state；`SafeHandoffState` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### PlatformStageKind
归属`views.rs`；平台业务阶段非送达回执。
```rust
/// 平台业务阶段非送达回执。
pub enum PlatformStageKind {
    /// 尚未尝试。
    NotAttempted,
    /// 可能已调用。
    InFlight,
    /// 正式业务accepted，不是送达/已读。
    BusinessAccepted,
    /// 正式拒绝。
    KnownRejected,
    /// 外部效果未知。
    Indeterminate,
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| NotAttempted | 尚未尝试 | 所属正式source/纯组装 | 不适用，无lifecycle |
| InFlight | 可能已调用 | 所属正式source/纯组装 | 不适用，无lifecycle |
| BusinessAccepted | 正式业务accepted，不是送达/已读 | 所属正式source/纯组装 | 不适用，无lifecycle |
| KnownRejected | 正式拒绝 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Indeterminate | 外部效果未知 | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### SafeStageObservation
归属`views.rs`；每阶段独立的有限观察。
```rust
/// 每阶段独立的有限观察。
pub enum SafeStageObservation {
    /// 真实ACK阶段。
    Protocol(ProtocolAckDisposition),
    /// 实际local UoW阶段。
    LocalCommit(LocalCommitKind),
    /// 实际owner阶段，不等Turn。
    Owner(OwnerResultKind),
    /// 实际平台业务阶段。
    Platform(PlatformStageKind),
    /// 实际consumer阶段。
    Consumer(ConsumerResultKind),
    /// 既有local业务state。
    Business(SafeLocalBusinessState),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Protocol | 真实ACK阶段；`ProtocolAckDisposition` | 所属正式source/纯组装 | 不适用，无lifecycle |
| LocalCommit | 实际local UoW阶段；`LocalCommitKind` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Owner | 实际owner阶段，不等Turn；`OwnerResultKind` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Platform | 实际平台业务阶段；`PlatformStageKind` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Consumer | 实际consumer阶段；`ConsumerResultKind` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Business | 既有local业务state；`SafeLocalBusinessState` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### ViewFreshnessKind
归属`views.rs`；既有数据新鲜度，不允许查询刷新。
```rust
/// 既有数据新鲜度，不允许查询刷新。
pub enum ViewFreshnessKind {
    /// 当前已读局部版本。
    ExistingRevision(LocalRevision),
    /// 已知旧依据，不能执行。
    Stale(SafeReasonCode),
    /// 安全可见有限子集。
    Degraded(SafeReasonCode),
    /// 原提交/外部结果未知。
    Indeterminate(SafeReasonCode),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| ExistingRevision | 当前已读局部版本；`LocalRevision` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Stale | 已知旧依据，不能执行；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Degraded | 安全可见有限子集；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Indeterminate | 原提交/外部结果未知；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### SafePublicRef
归属`views.rs`；已过滤公共引用。
```rust
/// 已过滤公共引用。
pub enum SafePublicRef {
    /// 当前visible local subject。
    Subject(BridgeViewSubjectRef),
    /// owner显式允许披露的safe authority ref。
    Authority(SafeAuthorityRef),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Subject | 当前visible local subject；`BridgeViewSubjectRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Authority | owner显式允许披露的safe authority ref；`SafeAuthorityRef` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### LocalCasDisposition
归属`shared/outcomes.rs`；CAS比较阶段，不是提交证明。
```rust
/// CAS比较阶段，不是提交证明。
pub enum LocalCasDisposition {
    /// 本次比较全匹配。
    Matched(ExpectedLocalRevisionSet),
    /// 至少一轴不匹配，零覆盖。
    Conflict(SafeReasonCode),
    /// 必要snapshot未建立，不能默认初始值。
    NotEstablished(SafeReasonCode),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Matched | 本次比较全匹配；`ExpectedLocalRevisionSet` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Conflict | 至少一轴不匹配，零覆盖；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |
| NotEstablished | 必要snapshot未建立，不能默认初始值；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### LocalCommitDisposition
归属`shared/outcomes.rs`；原mutation权威提交结果。
```rust
/// 原mutation权威提交结果。
pub enum LocalCommitDisposition {
    /// 真实同mutation提交证明。
    Committed(CommittedLocalMutationRef),
    /// driver明确原mutation未提交；不是NotFound。
    RolledBack(LocalRollbackProof),
    /// 原mutation提交未知，禁止新op重试。
    Indeterminate(LocalMutationRef),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Committed | 真实同mutation提交证明；`CommittedLocalMutationRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| RolledBack | driver明确原mutation未提交；不是NotFound；`LocalRollbackProof` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Indeterminate | 原mutation提交未知，禁止新op重试；`LocalMutationRef` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### VisibleSafeRefSet
归属`views.rs`；当前visibility允许披露的安全引用。
```rust
/// 当前visibility允许披露的安全引用。
pub struct VisibleSafeRefSet {
    /// 可见集合。
    refs: Vec<SafePublicRef>,
    /// 本次正式read scope。
    scope: AuthorizedReadScopeRef,
    /// 披露窗口。
    validity: SafeValidityWindow,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| refs | `Vec<SafePublicRef>` | 可见集合；SafeReadQualificationPort过滤；bounded无重复 |
| scope | `AuthorizedReadScopeRef` | 本次正式read scope；resolver-first |
| validity | `SafeValidityWindow` | 披露窗口；current visibility |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(refs: Vec<SafePublicRef>, scope: AuthorizedReadScopeRef, validity: SafeValidityWindow) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn refs(&self) -> &[SafePublicRef]` | /// 长度也属可见count，隐藏subject不得计入 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn scope(&self) -> &AuthorizedReadScopeRef` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### SafeStageSlice
归属`views.rs`；只展示当前可披露的独立阶段。
```rust
/// 只展示当前可披露的独立阶段。
pub struct SafeStageSlice {
    /// 有限阶段集合。
    observations: Vec<SafeStageObservation>,
    /// 本次披露依据。
    basis: AuthorizedReadScopeRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| observations | `Vec<SafeStageObservation>` | 有限阶段集合；existing snapshot经visibility过滤 |
| basis | `AuthorizedReadScopeRef` | 本次披露依据；SafeReadQualificationPort |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(observations: Vec<SafeStageObservation>, basis: AuthorizedReadScopeRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn observations(&self) -> &[SafeStageObservation]` | /// 不合GlobalSuccess；同stage唯一，未获准阶段省略但不伪造None成功 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn basis(&self) -> &AuthorizedReadScopeRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### SafeStageReason
归属`shared/traceability.rs`；局部变更阶段与有限理由。
```rust
/// 局部变更阶段与有限理由。
pub struct SafeStageReason {
    /// 实际独立阶段。
    stage: SafeStageObservation,
    /// 有限安全reason。
    reason: SafeReasonCode,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| stage | `SafeStageObservation` | 实际独立阶段；真实mutation |
| reason | `SafeReasonCode` | 有限安全reason；Application allowlist，非raw原因 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(stage: SafeStageObservation, reason: SafeReasonCode) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn stage(&self) -> &SafeStageObservation` | /// 只读记录阶段，不证实其他阶段 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn reason(&self) -> &SafeReasonCode` | /// 借用原reason字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### AuthorizedSafeSubjectRefSet
归属`shared/traceability.rs`；当前准许写audit的body-free主语集合。
```rust
/// 当前准许写audit的body-free主语集合。
pub struct AuthorizedSafeSubjectRefSet {
    /// 获准record主语。
    subjects: Vec<BridgeViewSubjectRef>,
    /// 记录scope。
    scope: SafeScopeRef,
    /// 记录准入依据。
    basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| subjects | `Vec<BridgeViewSubjectRef>` | 获准record主语；正式producer/visibility policy；非空无重复 |
| scope | `SafeScopeRef` | 记录scope；current authorization |
| basis | `SafeAuthorityRef` | 记录准入依据；exact kind AuthorizedSafeSubjectRefSet |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(subjects: Vec<BridgeViewSubjectRef>, scope: SafeScopeRef, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn subjects(&self) -> &[BridgeViewSubjectRef]` | /// 不把private handle/外部敏感subject加入 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn scope(&self) -> &SafeScopeRef` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### SafeBasisRefSet
归属`shared/traceability.rs`；获准记录的source版本与scope依据。
```rust
/// 获准记录的source版本与scope依据。
pub struct SafeBasisRefSet {
    /// 安全依据集合。
    refs: Vec<SafeAuthorityRef>,
    /// 本次producer scope。
    scope: SafeScopeRef,
    /// 有限记录窗口。
    validity: SafeValidityWindow,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| refs | `Vec<SafeAuthorityRef>` | 安全依据集合；qualified ports逐kind allowlist，禁止敏感审批内容/URI |
| scope | `SafeScopeRef` | 本次producer scope；authorization |
| validity | `SafeValidityWindow` | 有限记录窗口；source intersection |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(refs: Vec<SafeAuthorityRef>, scope: SafeScopeRef, validity: SafeValidityWindow) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn refs(&self) -> &[SafeAuthorityRef]` | /// body-free只读，不以ref存在证明准入 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn scope(&self) -> &SafeScopeRef` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### BodyFreeMutationMaterial
归属`shared/traceability.rs`；真实mutation同UoW的安全producer材料。
```rust
/// 真实mutation同UoW的安全producer材料。
pub struct BodyFreeMutationMaterial {
    /// 获准主语。
    subjects: AuthorizedSafeSubjectRefSet,
    /// 安全来源依据。
    basis: SafeBasisRefSet,
    /// 实际阶段reason。
    stage_reason: SafeStageReason,
    /// producer schema。
    schema: SafeProducerSchemaRevision,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| subjects | `AuthorizedSafeSubjectRefSet` | 获准主语；当前producer policy |
| basis | `SafeBasisRefSet` | 安全来源依据；same authorization |
| stage_reason | `SafeStageReason` | 实际阶段reason；mutation结果 |
| schema | `SafeProducerSchemaRevision` | producer schema；registered current schema |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(subjects: AuthorizedSafeSubjectRefSet, basis: SafeBasisRefSet, stage_reason: SafeStageReason, schema: SafeProducerSchemaRevision) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn schema(&self) -> &SafeProducerSchemaRevision` | /// 不含body/hash/附件/secret/raw error；不是Observability evidence |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn subjects(&self) -> &AuthorizedSafeSubjectRefSet` | /// 借用原subjects字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeBasisRefSet` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn stage_reason(&self) -> &SafeStageReason` | /// 借用原stage_reason字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### ConsumerDispositionRef
归属`shared/traceability.rs`；原canonical consumer实际交接结果。
```rust
/// 原canonical consumer实际交接结果。
pub struct ConsumerDispositionRef {
    /// 原handoff operation。
    original: OriginalHandoffOperationRef,
    /// consumer独立分类。
    kind: ConsumerResultKind,
    /// 正式结果来源。
    authority: SafeAuthorityRef,
    /// 有限理由。
    reason: SafeReasonCode,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| original | `OriginalHandoffOperationRef` | 原handoff operation；existing store |
| kind | `ConsumerResultKind` | consumer独立分类；Observability实际结果 |
| authority | `SafeAuthorityRef` | 正式结果来源；exact kind ConsumerDispositionRef |
| reason | `SafeReasonCode` | 有限理由；qualified adapter清洗 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(original: OriginalHandoffOperationRef, kind: ConsumerResultKind, authority: SafeAuthorityRef, reason: SafeReasonCode) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn kind(&self) -> &ConsumerResultKind` | /// Accepted不等evidence/verdict/readiness |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn original(&self) -> &OriginalHandoffOperationRef` | /// 借用原original字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn authority(&self) -> &SafeAuthorityRef` | /// 借用原authority字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn reason(&self) -> &SafeReasonCode` | /// 借用原reason字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### MutationRevisionChange
归属`shared/operation.rs`；真实local对象变更前后CAS。
```rust
/// 真实local对象变更前后CAS。
pub struct MutationRevisionChange {
    /// 变更对象。
    subject: BridgeViewSubjectRef,
    /// 原版本或首次None。
    before: Option<LocalRevision>,
    /// 提交后的local版本。
    after: LocalRevision,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| subject | `BridgeViewSubjectRef` | 变更对象；同UoW |
| before | `Option<LocalRevision>` | 原版本或首次None；consistent snapshot，None只用于insert |
| after | `LocalRevision` | 提交后的local版本；UoW actual结果 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(subject: BridgeViewSubjectRef, before: Option<LocalRevision>, after: LocalRevision) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_successor(&self) -> Result<(), ContractViolation>` | /// 首次after=1，否则checked successor；不代表foreign版本 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn subject(&self) -> &BridgeViewSubjectRef` | /// 借用原subject字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn before(&self) -> &Option<LocalRevision>` | /// 借用原before字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn after(&self) -> &LocalRevision` | /// 借用原after字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### CommittedLocalMutationRef
归属`shared/operation.rs`；同原mutation提交证明。
```rust
/// 同原mutation提交证明。
pub struct CommittedLocalMutationRef {
    /// 原mutation。
    mutation: LocalMutationRef,
    /// 原operation。
    operation: BridgeOperationRef,
    /// 实际完整修改集合。
    revisions: Vec<MutationRevisionChange>,
    /// 权威commit proof。
    basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| mutation | `LocalMutationRef` | 原mutation；UoW |
| operation | `BridgeOperationRef` | 原operation；same mutation |
| revisions | `Vec<MutationRevisionChange>` | 实际完整修改集合；driver actual committed结果 |
| basis | `SafeAuthorityRef` | 权威commit proof；exact kind CommittedLocalMutationRef；LocalStore |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(mutation: LocalMutationRef, operation: BridgeOperationRef, revisions: Vec<MutationRevisionChange>, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn mutation(&self) -> &LocalMutationRef` | /// 不证明owner接受或平台业务结果 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn operation(&self) -> &BridgeOperationRef` | /// 借用原operation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn revisions(&self) -> &Vec<MutationRevisionChange>` | /// 借用原revisions字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### LocalRollbackProof
归属`shared/outcomes.rs`；原mutation权威未提交证明。
```rust
/// 原mutation权威未提交证明。
pub struct LocalRollbackProof {
    /// 原mutation。
    mutation: LocalMutationRef,
    /// 原operation。
    operation: BridgeOperationRef,
    /// 明确rollback/no local commit。
    basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| mutation | `LocalMutationRef` | 原mutation；same-op driver probe |
| operation | `BridgeOperationRef` | 原operation；same mutation |
| basis | `SafeAuthorityRef` | 明确rollback/no local commit；exact kind LocalRollbackProof；NotFound/timeout不足 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(mutation: LocalMutationRef, operation: BridgeOperationRef, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn mutation(&self) -> &LocalMutationRef` | /// 仅证明local未提交，不能证明外部no-effect |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn operation(&self) -> &BridgeOperationRef` | /// 借用原operation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### ProtocolAckPlan
归属`shared/outcomes.rs`；独立平台ACK计划，不等已执行。
```rust
/// 独立平台ACK计划，不等已执行。
pub struct ProtocolAckPlan {
    /// 计划protocol动作。
    action: ProtocolAckAction,
    /// verified来源或明确拒绝。
    source: QualificationSlot<VerifiedPlatformSourceRef>,
    /// 协议deadline。
    deadline: SafeInstant,
    /// 安全有限reason。
    reason: SafeReasonCode,
    /// ACK模式依据。
    basis: SafeAuthoritySourceRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| action | `ProtocolAckAction` | 计划protocol动作；qualified adapter source合同 |
| source | `QualificationSlot<VerifiedPlatformSourceRef>` | verified来源或明确拒绝；Ingress/CallbackVerificationPort；accept/defer必Established |
| deadline | `SafeInstant` | 协议deadline；实际收到时刻及平台mode；不填统一常数 |
| reason | `SafeReasonCode` | 安全有限reason；无敏感存在性提示 |
| basis | `SafeAuthoritySourceRef` | ACK模式依据；registered capability source |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(action: ProtocolAckAction, source: QualificationSlot<VerifiedPlatformSourceRef>, deadline: SafeInstant, reason: SafeReasonCode, basis: SafeAuthoritySourceRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn action(&self) -> &ProtocolAckAction` | /// 不含interaction token/response URL；发送由private入口对象执行 |
| 成员 | `pub fn assert_deadline(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// deadline到期不能伪称已ACK；其超时不推owner结果 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn source(&self) -> &QualificationSlot<VerifiedPlatformSourceRef>` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn deadline(&self) -> &SafeInstant` | /// 借用原deadline字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn reason(&self) -> &SafeReasonCode` | /// 借用原reason字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthoritySourceRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。


## 16. 稳定结果、bounded job与唯一View


### StoredResultPayload
归属`shared/outcomes.rs`；原结果的安全阶段载荷，无协议递归。
```rust
/// 原结果的安全阶段载荷，无协议递归。
pub enum StoredResultPayload {
    /// 原local提交结果。
    Local(CommittedLocalMutationRef),
    /// 原入站owner结果。
    Owner(OwnerHandoffResultRef),
    /// 原callback owner结果。
    Action(OwnerActionResultRef),
    /// 原投递已知业务结果。
    Platform(PlatformBusinessResultRef),
    /// 原canonical交接结果。
    Consumer(ConsumerDispositionRef),
    /// 原恢复actual结果。
    Probe(AuthoritativeProbeResultRef),
    /// 原资格维护结果，包括Missing/Stale。
    Qualification(InstallationQualificationRefSlot),
    /// 尚无已知结果，不当成功。
    Pending(SafeReasonCode),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Local | 原local提交结果；`CommittedLocalMutationRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Owner | 原入站owner结果；`OwnerHandoffResultRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Action | 原callback owner结果；`OwnerActionResultRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Platform | 原投递已知业务结果；`PlatformBusinessResultRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Consumer | 原canonical交接结果；`ConsumerDispositionRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Probe | 原恢复actual结果；`AuthoritativeProbeResultRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Qualification | 原资格维护结果，包括Missing/Stale；`InstallationQualificationRefSlot` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Pending | 尚无已知结果，不当成功；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### BridgeCommandResult
归属`shared/outcomes.rs`；对外管理/prepare结果先过当前visibility。
```rust
/// 对外管理/prepare结果先过当前visibility。
pub enum BridgeCommandResult {
    /// 本地提交已知可见slice，不等owner/平台。
    LocalCommitted(BridgeLocalView),
    /// 同义原结果当前可见复用，零外呼。
    OriginalReused(BridgeLocalView),
    /// 原local提交或效果未知，只可见slice。
    Indeterminate(BridgeLocalView),
    /// 安全拒绝，不暴露存在性/hidden refs。
    Rejected(SafeReasonCode),
    /// 缺正式合同或依赖，非空成功。
    Unavailable(SafeReasonCode),
    /// 当前不允许披露结果，无ref/count或stage推断。
    NotDisclosed(SafeReasonCode),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| LocalCommitted | 本地提交已知可见slice，不等owner/平台；`BridgeLocalView` | 所属正式source/纯组装 | 不适用，无lifecycle |
| OriginalReused | 同义原结果当前可见复用，零外呼；`BridgeLocalView` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Indeterminate | 原local提交或效果未知，只可见slice；`BridgeLocalView` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Rejected | 安全拒绝，不暴露存在性/hidden refs；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Unavailable | 缺正式合同或依赖，非空成功；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |
| NotDisclosed | 当前不允许披露结果，无ref/count或stage推断；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### BridgeReadResult
归属`shared/outcomes.rs`；纯读view结果。
```rust
/// 纯读view结果。
pub enum BridgeReadResult {
    /// 当前获准的既有视图。
    View(BridgeLocalView),
    /// 拒绝或不可见，不披露subject存在。
    NotVisible(SafeReasonCode),
    /// 已授权精确subject解析后才可给未找到。
    NotFound(SafeReasonCode),
    /// 来源不可用，不以空view伪装。
    Unavailable(SafeReasonCode),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| View | 当前获准的既有视图；`BridgeLocalView` | 所属正式source/纯组装 | 不适用，无lifecycle |
| NotVisible | 拒绝或不可见，不披露subject存在；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |
| NotFound | 已授权精确subject解析后才可给未找到；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Unavailable | 来源不可用，不以空view伪装；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### SafeOriginalResultRef
归属`shared/outcomes.rs`；原result的不可变安全stored关联。
```rust
/// 原result的不可变安全stored关联。
pub struct SafeOriginalResultRef {
    /// 原stored result identity。
    result_id: LocalObjectId,
    /// 原op/effect。
    original: OriginalOperationEffectRef,
    /// 入口结果族。
    kind: BridgeStoredResultKind,
    /// 安全阶段载荷。
    payload: StoredResultPayload,
    /// 结果版本。
    revision: LocalRevision,
    /// stored来源依据。
    basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| result_id | `LocalObjectId` | 原stored result identity；首次同UoW generated/原store |
| original | `OriginalOperationEffectRef` | 原op/effect；same dedup |
| kind | `BridgeStoredResultKind` | 入口结果族；原C/E/J固定族 |
| payload | `StoredResultPayload` | 安全阶段载荷；actual local/owner/platform/consumer result |
| revision | `LocalRevision` | 结果版本；同store |
| basis | `SafeAuthorityRef` | stored来源依据；exact kind SafeOriginalResultRef；LocalStore |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(result_id: LocalObjectId, original: OriginalOperationEffectRef, kind: BridgeStoredResultKind, payload: StoredResultPayload, revision: LocalRevision, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_original(&self, original: &OriginalOperationEffectRef) -> Result<(), ContractViolation>` | /// kind与载荷匹配；重用之前 current read visibility，不再执行 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn result_id(&self) -> &LocalObjectId` | /// 借用原result_id字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn original(&self) -> &OriginalOperationEffectRef` | /// 借用原original字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn kind(&self) -> &BridgeStoredResultKind` | /// 借用原kind字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn payload(&self) -> &StoredResultPayload` | /// 借用原payload字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn revision(&self) -> &LocalRevision` | /// 借用原revision字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### BridgeLocalView
归属`views.rs`；唯一不变只读局部projection。
```rust
/// 唯一不变只读局部projection。
pub struct BridgeLocalView {
    /// 当前可见主语。
    view_subject: BridgeViewSubjectRef,
    /// 本次read依据。
    scope_ref: AuthorizedReadScopeRef,
    /// 当前可见阶段。
    stage_slice: SafeStageSlice,
    /// 当前可见ref及count。
    qualified_refs: VisibleSafeRefSet,
    /// 既有版本/未知/降级。
    freshness: ViewFreshnessKind,
    /// Qualified或Degraded。
    availability: SafeViewDisposition,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| view_subject | `BridgeViewSubjectRef` | 当前可见主语；Application先resolved/filtered fields |
| scope_ref | `AuthorizedReadScopeRef` | 本次read依据；SafeReadQualificationPort |
| stage_slice | `SafeStageSlice` | 当前可见阶段；同filtered fields |
| qualified_refs | `VisibleSafeRefSet` | 当前可见ref及count；visibility filtered |
| freshness | `ViewFreshnessKind` | 既有版本/未知/降级；local read snapshot不刷新 |
| availability | `SafeViewDisposition` | Qualified或Degraded；Denied/Unavailable不得构造view |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_qualified_fields(view_subject: BridgeViewSubjectRef, scope_ref: AuthorizedReadScopeRef, stage_slice: SafeStageSlice, qualified_refs: VisibleSafeRefSet, freshness: ViewFreshnessKind, availability: SafeViewDisposition) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_read_shape(&self, current: &CurrentReadQualification, now: SafeInstant) -> Result<(), ContractViolation>` | /// 核subject/scope/refs子集及期限；contracts不接受Application snapshot |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn view_subject(&self) -> &BridgeViewSubjectRef` | /// 借用原view_subject字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn scope_ref(&self) -> &AuthorizedReadScopeRef` | /// 借用原scope_ref字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn stage_slice(&self) -> &SafeStageSlice` | /// 借用原stage_slice字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn qualified_refs(&self) -> &VisibleSafeRefSet` | /// 借用原qualified_refs字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn freshness(&self) -> &ViewFreshnessKind` | /// 借用原freshness字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn availability(&self) -> &SafeViewDisposition` | /// 借用原availability字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：factory只收已经过滤的上述typed字段；没有IO、audit/dedup/refresh、生命周期或Domain副本。

### InboundConsumeResult
归属`consumers.rs`；入站消费的安全分阶段结果。
```rust
/// 入站消费的安全分阶段结果。
pub struct InboundConsumeResult {
    /// 消费处置。
    disposition: ConsumeDisposition,
    /// 原op或未接管None。
    operation: Option<BridgeOperationRef>,
    /// 实际协议ACK。
    ack: ProtocolAckDisposition,
    /// owner独立结果。
    owner: OwnerHandoffResultRefSlot,
    /// 实际local commit或未写None。
    local_commit: Option<LocalCommitDisposition>,
    /// 安全理由。
    reason: SafeReasonCode,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| disposition | `ConsumeDisposition` | 消费处置；Application实际结果 |
| operation | `Option<BridgeOperationRef>` | 原op或未接管None；local reservation；None不可owner accepted |
| ack | `ProtocolAckDisposition` | 实际协议ACK；platform entry实际发送结果 |
| owner | `OwnerHandoffResultRefSlot` | owner独立结果；same original operation |
| local_commit | `Option<LocalCommitDisposition>` | 实际local commit或未写None；LocalUoW |
| reason | `SafeReasonCode` | 安全理由；finite mapper |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(disposition: ConsumeDisposition, operation: Option<BridgeOperationRef>, ack: ProtocolAckDisposition, owner: OwnerHandoffResultRefSlot, local_commit: Option<LocalCommitDisposition>, reason: SafeReasonCode) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn ack(&self) -> &ProtocolAckDisposition` | /// ACK只供协议层，不携owner敏感结果到外部 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn disposition(&self) -> &ConsumeDisposition` | /// 借用原disposition字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn operation(&self) -> &Option<BridgeOperationRef>` | /// 借用原operation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn owner(&self) -> &OwnerHandoffResultRefSlot` | /// 借用原owner字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn local_commit(&self) -> &Option<LocalCommitDisposition>` | /// 借用原local_commit字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn reason(&self) -> &SafeReasonCode` | /// 借用原reason字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### SourceConsumeResult
归属`consumers.rs`；owner source消费与plan固化结果。
```rust
/// owner source消费与plan固化结果。
pub struct SourceConsumeResult {
    /// 消费处置。
    disposition: ConsumeDisposition,
    /// 原operation。
    operation: Option<BridgeOperationRef>,
    /// 固化原effect或未建立None。
    intent: Option<DeliveryIntentEffectRef>,
    /// local提交。
    local_commit: Option<LocalCommitDisposition>,
    /// 安全reason。
    reason: SafeReasonCode,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| disposition | `ConsumeDisposition` | 消费处置；Application |
| operation | `Option<BridgeOperationRef>` | 原operation；source namespace reservation |
| intent | `Option<DeliveryIntentEffectRef>` | 固化原effect或未建立None；actual local committed intent |
| local_commit | `Option<LocalCommitDisposition>` | local提交；LocalUoW |
| reason | `SafeReasonCode` | 安全reason；finite mapper |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(disposition: ConsumeDisposition, operation: Option<BridgeOperationRef>, intent: Option<DeliveryIntentEffectRef>, local_commit: Option<LocalCommitDisposition>, reason: SafeReasonCode) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn intent(&self) -> Option<&DeliveryIntentEffectRef>` | /// 创建intent不等平台业务accepted或送达 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn disposition(&self) -> &ConsumeDisposition` | /// 借用原disposition字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn operation(&self) -> &Option<BridgeOperationRef>` | /// 借用原operation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn local_commit(&self) -> &Option<LocalCommitDisposition>` | /// 借用原local_commit字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn reason(&self) -> &SafeReasonCode` | /// 借用原reason字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### CallbackConsumeResult
归属`consumers.rs`；callback一次性交接的安全结果。
```rust
/// callback一次性交接的安全结果。
pub struct CallbackConsumeResult {
    /// 消费处置。
    disposition: ConsumeDisposition,
    /// 原owner operation。
    operation: Option<BridgeOperationRef>,
    /// 独立协议ACK。
    ack: ProtocolAckDisposition,
    /// 正式owner命令结果。
    owner: OwnerActionResultRefSlot,
    /// local提交。
    local_commit: Option<LocalCommitDisposition>,
    /// 安全reason。
    reason: SafeReasonCode,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| disposition | `ConsumeDisposition` | 消费处置；Application |
| operation | `Option<BridgeOperationRef>` | 原owner operation；one-use/dedup |
| ack | `ProtocolAckDisposition` | 独立协议ACK；private entry实际返回 |
| owner | `OwnerActionResultRefSlot` | 正式owner命令结果；same op |
| local_commit | `Option<LocalCommitDisposition>` | local提交；LocalUoW |
| reason | `SafeReasonCode` | 安全reason；finite mapper，不含审批内容 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(disposition: ConsumeDisposition, operation: Option<BridgeOperationRef>, ack: ProtocolAckDisposition, owner: OwnerActionResultRefSlot, local_commit: Option<LocalCommitDisposition>, reason: SafeReasonCode) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn ack(&self) -> &ProtocolAckDisposition` | /// 不能由signature/ACK升级Decision或one-use |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn disposition(&self) -> &ConsumeDisposition` | /// 借用原disposition字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn operation(&self) -> &Option<BridgeOperationRef>` | /// 借用原operation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn owner(&self) -> &OwnerActionResultRefSlot` | /// 借用原owner字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn local_commit(&self) -> &Option<LocalCommitDisposition>` | /// 借用原local_commit字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn reason(&self) -> &SafeReasonCode` | /// 借用原reason字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### HandoffConsumeResult
归属`consumers.rs`；正式consumer disposition消费结果。
```rust
/// 正式consumer disposition消费结果。
pub struct HandoffConsumeResult {
    /// 消费处置。
    disposition: ConsumeDisposition,
    /// 原handoff op。
    operation: Option<BridgeOperationRef>,
    /// 正式consumer结果。
    consumer: ConsumerDispositionRefSlot,
    /// local结果记录提交。
    local_commit: Option<LocalCommitDisposition>,
    /// 安全reason。
    reason: SafeReasonCode,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| disposition | `ConsumeDisposition` | 消费处置；Application |
| operation | `Option<BridgeOperationRef>` | 原handoff op；SafeTraceRepository的本地handoff/result读取面 |
| consumer | `ConsumerDispositionRefSlot` | 正式consumer结果；actual Observability source |
| local_commit | `Option<LocalCommitDisposition>` | local结果记录提交；LocalUoW |
| reason | `SafeReasonCode` | 安全reason；finite mapper |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(disposition: ConsumeDisposition, operation: Option<BridgeOperationRef>, consumer: ConsumerDispositionRefSlot, local_commit: Option<LocalCommitDisposition>, reason: SafeReasonCode) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn consumer(&self) -> &ConsumerDispositionRefSlot` | /// consumer accepted不产生evidence或验收结果 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn disposition(&self) -> &ConsumeDisposition` | /// 借用原disposition字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn operation(&self) -> &Option<BridgeOperationRef>` | /// 借用原operation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn local_commit(&self) -> &Option<LocalCommitDisposition>` | /// 借用原local_commit字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn reason(&self) -> &SafeReasonCode` | /// 借用原reason字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### QualifiedJobCounts
归属`jobs.rs`；当前维护read资格允许的有界计数。
```rust
/// 当前维护read资格允许的有界计数。
pub struct QualifiedJobCounts {
    /// 本次获准selected。
    selected: u32,
    /// 已处置项。
    processed: u32,
    /// 本次batch剩余项。
    remaining: u32,
    /// 计数披露依据。
    basis: AuthorizedReadScopeRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| selected | `u32` | 本次获准selected；当前scope过滤后 |
| processed | `u32` | 已处置项；实际bounded结果 |
| remaining | `u32` | 本次batch剩余项；同选中batch，非隐藏全库总数 |
| basis | `AuthorizedReadScopeRef` | 计数披露依据；current read resolver |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(selected: u32, processed: u32, remaining: u32, basis: AuthorizedReadScopeRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_bounds(&self) -> Result<(), ContractViolation>` | /// processed+remaining=selected，溢出拒绝；未visible项不计数 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn selected(&self) -> &u32` | /// 借用原selected字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn processed(&self) -> &u32` | /// 借用原processed字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn remaining(&self) -> &u32` | /// 借用原remaining字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &AuthorizedReadScopeRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### SafeJobResultSummary
归属`jobs.rs`；五J共享的有限安全输出。
```rust
/// 五J共享的有限安全输出。
pub struct SafeJobResultSummary {
    /// bounded执行分类。
    disposition: JobResultDisposition,
    /// 本次当前可见原subject。
    subjects: Vec<OriginalRecoverableSubjectRef>,
    /// 当前可见的既有维护主语；资格维护也可表示installation/binding。
    maintenance_subjects: Vec<BridgeViewSubjectRef>,
    /// 允许披露的计数。
    counts: Option<QualifiedJobCounts>,
    /// 当前可见独立阶段。
    stages: SafeStageSlice,
    /// 安全原因。
    reason: SafeReasonCode,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| disposition | `JobResultDisposition` | bounded执行分类；Application实际阶段 |
| subjects | `Vec<OriginalRecoverableSubjectRef>` | 本次当前可见原subject；current maintenance/read filtering |
| maintenance_subjects | `Vec<BridgeViewSubjectRef>` | 同次可见维护主语；当前read过滤，qualification包含installation/binding/mapping等既有主语 |
| counts | `Option<QualifiedJobCounts>` | 允许披露的计数；不允许披露None，不能构造假0 |
| stages | `SafeStageSlice` | 当前可见独立阶段；qualified existing results |
| reason | `SafeReasonCode` | 安全原因；finite mapper |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(disposition: JobResultDisposition, subjects: Vec<OriginalRecoverableSubjectRef>, maintenance_subjects: Vec<BridgeViewSubjectRef>, counts: Option<QualifiedJobCounts>, stages: SafeStageSlice, reason: SafeReasonCode) -> Result<Self, ContractViolation>` | /// 校验完整字段、scope及两组同subject回链；不生成ID/时间/权限，无IO。 |
| 成员 | `pub fn disposition(&self) -> &JobResultDisposition` | /// Completed只本次batch已处置，不承诺所有外部送达 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn subjects(&self) -> &Vec<OriginalRecoverableSubjectRef>` | /// 借用原subjects字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn maintenance_subjects(&self) -> &Vec<BridgeViewSubjectRef>` | /// 借用原maintenance_subjects字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn counts(&self) -> &Option<QualifiedJobCounts>` | /// 借用原counts字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn stages(&self) -> &SafeStageSlice` | /// 借用原stages字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn reason(&self) -> &SafeReasonCode` | /// 借用原reason字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。
### DispatchJobResult
归属`jobs.rs`；C-RESULT。
```rust
/// Intent原subject的有界维护结果；attempt通过原intent回链，不是test report。
pub struct DispatchJobResult(SafeJobResultSummary);
```
| 字段 | 来源 / 约束 |
|---|---|
| 0: SafeJobResultSummary | Application实际结果经当前visibility过滤；只Intent原subject，attempt回链原intent |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn from_summary(summary: SafeJobResultSummary) -> Result<Self, ContractViolation>` | /// 核本J允许主语/stage与bounded计数，不运行job。 |
| 成员 | `pub fn summary(&self) -> &SafeJobResultSummary` | /// 安全读取，无外呼或新op。 |

### RecoveryJobResult
归属`jobs.rs`；C-RESULT。
```rust
/// Inbound/Callback/Intent/Handoff原subject的有界维护结果，不是test report。
pub struct RecoveryJobResult(SafeJobResultSummary);
```
| 字段 | 来源 / 约束 |
|---|---|
| 0: SafeJobResultSummary | Application实际结果经当前visibility过滤；只Inbound/Callback/Intent/Handoff原subject |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn from_summary(summary: SafeJobResultSummary) -> Result<Self, ContractViolation>` | /// 核本J允许主语/stage与bounded计数，不运行job。 |
| 成员 | `pub fn summary(&self) -> &SafeJobResultSummary` | /// 安全读取，无外呼或新op。 |

### GapRecoveryJobResult
归属`jobs.rs`；C-RESULT。
```rust
/// Gap原subject的有界维护结果，不是test report。
pub struct GapRecoveryJobResult(SafeJobResultSummary);
```
| 字段 | 来源 / 约束 |
|---|---|
| 0: SafeJobResultSummary | Application实际结果经当前visibility过滤；只Gap原subject |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn from_summary(summary: SafeJobResultSummary) -> Result<Self, ContractViolation>` | /// 核本J允许主语/stage与bounded计数，不运行job。 |
| 成员 | `pub fn summary(&self) -> &SafeJobResultSummary` | /// 安全读取，无外呼或新op。 |

### SafeHandoffJobResult
归属`jobs.rs`；C-RESULT。
```rust
/// Handoff原subject的有界维护结果，不是test report。
pub struct SafeHandoffJobResult(SafeJobResultSummary);
```
| 字段 | 来源 / 约束 |
|---|---|
| 0: SafeJobResultSummary | Application实际结果经当前visibility过滤；只Handoff原subject |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn from_summary(summary: SafeJobResultSummary) -> Result<Self, ContractViolation>` | /// 核本J允许主语/stage与bounded计数，不运行job。 |
| 成员 | `pub fn summary(&self) -> &SafeJobResultSummary` | /// 安全读取，无外呼或新op。 |

### QualificationJobResult
归属`jobs.rs`；C-RESULT。
```rust
/// 资格维护主语以view引用呈现；subjects为空并以本次已过滤stage/count表达，不假造recoverable subject的有界维护结果，不是test report。
pub struct QualificationJobResult(SafeJobResultSummary);
```
| 字段 | 来源 / 约束 |
|---|---|
| 0: SafeJobResultSummary | Application实际结果经当前visibility过滤；只资格维护主语以view引用呈现；subjects为空并以本次已过滤stage/count表达，不假造recoverable subject |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn from_summary(summary: SafeJobResultSummary) -> Result<Self, ContractViolation>` | /// 核本J允许主语/stage与bounded计数，不运行job。 |
| 成员 | `pub fn summary(&self) -> &SafeJobResultSummary` | /// 安全读取，无外呼或新op。 |

以上consume/job结果是稳定safe载体，不是直接对平台发送的wire；完整envelope及版本/关联字段在Step8逐协议装配。API外部ACK只使用ProtocolAckPlan与private响应token，不能序列化这些内部业务refs到未授权用户。


## 17. 稳定入口资格与后续协议边界


### BindingMutationKind
归属`shared/operation.rs`；管理relation动作不省略于同义身份。
```rust
/// 管理relation动作不省略于同义身份。
pub enum BindingMutationKind {
    /// 提出显式relation。
    Propose,
    /// 激活有current依据的原relation。
    Activate,
    /// 管理暂停。
    Suspend,
    /// 终态撤销。
    Revoke,
    /// 正式到期维护。
    Expire,
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Propose | 提出显式relation | 所属正式source/纯组装 | 不适用，无lifecycle |
| Activate | 激活有current依据的原relation | 所属正式source/纯组装 | 不适用，无lifecycle |
| Suspend | 管理暂停 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Revoke | 终态撤销 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Expire | 正式到期维护 | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### MappingMutationKind
归属`shared/operation.rs`；mapping管理动作。
```rust
/// mapping管理动作。
pub enum MappingMutationKind {
    /// 受权建立原mapping。
    Link,
    /// 原mapping失效。
    Invalidate,
    /// 记录已知原delete disposition。
    Tombstone,
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Link | 受权建立原mapping | 所属正式source/纯组装 | 不适用，无lifecycle |
| Invalidate | 原mapping失效 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Tombstone | 记录已知原delete disposition | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### ConfigurationMutationKind
归属`shared/operation.rs`；配置管理动作。
```rust
/// 配置管理动作。
pub enum ConfigurationMutationKind {
    /// 受权配置首次接纳。
    Configure,
    /// 原配置版本更新。
    ApplyRevision,
    /// 管理暂停。
    Suspend,
    /// 终态停用。
    Retire,
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Configure | 受权配置首次接纳 | 所属正式source/纯组装 | 不适用，无lifecycle |
| ApplyRevision | 原配置版本更新 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Suspend | 管理暂停 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Retire | 终态停用 | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### ConfigurationOperationMeaning
归属`shared/operation.rs`；配置管理的完整动作和CAS同义结构。
```rust
/// 配置管理的完整动作和CAS同义结构。
pub struct ConfigurationOperationMeaning {
    /// 管理动作。
    action: ConfigurationMutationKind,
    /// 完整safe配置设置。
    draft: InstallationConfigDraft,
    /// 原版本条件。
    expected: Option<ExpectedConfigRevision>,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| action | `ConfigurationMutationKind` | 管理动作；受权entry |
| draft | `InstallationConfigDraft` | 完整safe配置设置；qualified config |
| expected | `Option<ExpectedConfigRevision>` | 原版本条件；Configure必须None且初始1；其他必须Some |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(action: ConfigurationMutationKind, draft: InstallationConfigDraft, expected: Option<ExpectedConfigRevision>) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_equal(&self, other: &Self) -> Result<(), ContractViolation>` | /// 动作/配置stable设置/CAS逐字段，不能换secret或route再复用key |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn action(&self) -> &ConfigurationMutationKind` | /// 借用原action字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn draft(&self) -> &InstallationConfigDraft` | /// 借用原draft字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn expected(&self) -> &Option<ExpectedConfigRevision>` | /// 借用原expected字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### QualifiedIngressContext
归属`consumers.rs`；来源合格的安全入口上下文，不授内部提交。
```rust
/// 来源合格的安全入口上下文，不授内部提交。
pub struct QualifiedIngressContext {
    /// 安装隔离。
    namespace: InstallationNamespace,
    /// verified协议来源。
    source: VerifiedPlatformSourceRef,
    /// 平台account kind和ID。
    account: ExternalAccountLocator,
    /// 原message/change定位。
    message: ExternalMessageLocator,
    /// 原变化种类。
    change: ExternalChangeKind,
    /// 已验证来源/回环材料。
    origin: VerifiedOriginMarkerRef,
    /// 安全材料读取ref或缺口。
    material_source: SafeSourceRefSlot,
    /// 独立ACK计划。
    ack: ProtocolAckPlan,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| namespace | `InstallationNamespace` | 安装隔离；current qualified source |
| source | `VerifiedPlatformSourceRef` | verified协议来源；PlatformIngressPort |
| account | `ExternalAccountLocator` | 平台account kind和ID；verified adapter |
| message | `ExternalMessageLocator` | 原message/change定位；verified adapter |
| change | `ExternalChangeKind` | 原变化种类；同source decoder |
| origin | `VerifiedOriginMarkerRef` | 已验证来源/回环材料；platform+local own-send映射验证 |
| material_source | `SafeSourceRefSlot` | 安全材料读取ref或缺口；正式owner/material source；Missing不能handoff |
| ack | `ProtocolAckPlan` | 独立ACK计划；source mode能力 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(namespace: InstallationNamespace, source: VerifiedPlatformSourceRef, account: ExternalAccountLocator, message: ExternalMessageLocator, change: ExternalChangeKind, origin: VerifiedOriginMarkerRef, material_source: SafeSourceRefSlot, ack: ProtocolAckPlan) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_namespace(&self, namespace: &InstallationNamespace) -> Result<(), ContractViolation>` | /// 所有locators同namespace；需要owner资格时另核，不把来源验证当授权 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn namespace(&self) -> &InstallationNamespace` | /// 借用原namespace字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn source(&self) -> &VerifiedPlatformSourceRef` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn account(&self) -> &ExternalAccountLocator` | /// 借用原account字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn message(&self) -> &ExternalMessageLocator` | /// 借用原message字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn change(&self) -> &ExternalChangeKind` | /// 借用原change字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn origin(&self) -> &VerifiedOriginMarkerRef` | /// 借用原origin字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn material_source(&self) -> &SafeSourceRefSlot` | /// 借用原material_source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn ack(&self) -> &ProtocolAckPlan` | /// 借用原ack字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### QualifiedCallbackContext
归属`consumers.rs`；已核回调来源actor/原消息/目标/动作的safe资格载体。
```rust
/// 已核回调来源actor/原消息/目标/动作的safe资格载体。
pub struct QualifiedCallbackContext {
    /// 原安装。
    namespace: InstallationNamespace,
    /// 完整callback验证依据。
    verification: CallbackVerificationRef,
    /// 原action。
    action_binding: ExternalActionBindingRef,
    /// 原外显intent/message/source。
    source_intent: SourceIntentMessageRef,
    /// 当前actor/owner/Gate/expiry资格。
    current: CurrentActionQualification,
    /// 独立协议ACK计划。
    ack: ProtocolAckPlan,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| namespace | `InstallationNamespace` | 原安装；verified source |
| verification | `CallbackVerificationRef` | 完整callback验证依据；CallbackVerificationPort |
| action_binding | `ExternalActionBindingRef` | 原action；CallbackRepository及verified locator |
| source_intent | `SourceIntentMessageRef` | 原外显intent/message/source；same original mapping |
| current | `CurrentActionQualification` | 当前actor/owner/Gate/expiry资格；ActorResponsibilityPort/OwnerActionPort |
| ack | `ProtocolAckPlan` | 独立协议ACK计划；private verified mode |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(namespace: InstallationNamespace, verification: CallbackVerificationRef, action_binding: ExternalActionBindingRef, source_intent: SourceIntentMessageRef, current: CurrentActionQualification, ack: ProtocolAckPlan) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_original(&self, action: &ExternalActionBindingRef) -> Result<(), ContractViolation>` | /// full-match原platform/installation/source actor/target/action/version；不消费one-use或执行Decision |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn namespace(&self) -> &InstallationNamespace` | /// 借用原namespace字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn verification(&self) -> &CallbackVerificationRef` | /// 借用原verification字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn action_binding(&self) -> &ExternalActionBindingRef` | /// 借用原action_binding字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn source_intent(&self) -> &SourceIntentMessageRef` | /// 借用原source_intent字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn current(&self) -> &CurrentActionQualification` | /// 借用原current字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn ack(&self) -> &ProtocolAckPlan` | /// 借用原ack字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。


## 18. Contracts闭口/defer与模块停审

| 逐名称 | 唯一归属 | 当前裁定 / 原因 | 必须承接 |
|---|---|---|---|
| AuthorizedMappingProposal | `commands.rs` | defer_protocol_body_only；C03完整受权三种mapping提案与external/core actor mapping；先Step7 trait/authority后装配wire | Step8 C03；Step7 qualification读取 |
| BindingActionProposal | `commands.rs` | defer_protocol_body_only；C02 propose/activate/suspend/revoke/expiry完整提案；先Step7 trait/authority后装配wire | Step8 C02；Step7 binding contract |
| InboundSafeEnvelope | `consumers.rs` | defer_protocol_body_only；E01完整版本/metadata/locator/source字段；先Step7 trait/authority后装配wire | Step8 E01，当前QualifiedIngressContext/结果已闭口 |
| CallbackSafeEnvelope | `consumers.rs` | defer_protocol_body_only；E03完整safe callback envelope，不夹private token；先Step7 trait/authority后装配wire | Step8 E03，当前QualifiedCallbackContext/结果已闭口 |
| CommittedSourceRefEnvelope | `consumers.rs` | defer_protocol_body_only；E02 owner committed source版本/envelope；先Step7 trait/authority后装配wire | Step8 E02；当前CommittedSourceVersionRef已闭口 |
| SafeConsumerResultEnvelope | `consumers.rs` | defer_protocol_body_only；E04 canonical consumer disposition协议；先Step7 trait/authority后装配wire | Step8 E04；当前ConsumerDispositionRef已闭口 |
| BridgeBindingViewQuery | `queries.rs` | defer_protocol_body_only；Q01完整subject selector与QueryMetadata；先Step7 trait/authority后装配wire | Step8 Q01；不预写请求factory |
| BridgeOperationViewQuery | `queries.rs` | defer_protocol_body_only；Q02原operation查询selector；先Step7 trait/authority后装配wire | Step8 Q02；result/view已闭口 |
| BridgeContinuityViewQuery | `queries.rs` | defer_protocol_body_only；Q03 cursor/gap/lane scoped selector；先Step7 trait/authority后装配wire | Step8 Q03；result/view已闭口 |
| SafeHandoffViewQuery | `queries.rs` | defer_protocol_body_only；Q04 audit/handoff scoped selector；先Step7 trait/authority后装配wire | Step8 Q04；result/view已闭口 |

17个Application内部名称交A独立卡、SafePresentationPlan交D3唯一Domain卡，不在本附录定义。没有把view/stored-result/current资格/ACK/job结果机械推后。

### Contracts回填草稿
Contracts只负责跨模块安全结构：local ref隔安装与kind；authority ref有实际owner/source/revision/scope/window且不自授权；Slot区别未建立与已失效；stable meaning按操作族完整typed定义，C04/E02同义共用DeliveryOperationMeaning；OriginalOperationEffectRef只保存原op/effect-kind/ID，完整meaning在Dedup/StableEffectIdentity单向关联，消除recursive-value schema。平台ACK/local commit/owner/platform/consumer独立，view只接受过滤fields；private/snapshot在Application。所有产物仍是设计计划，foreign source资格及产品未建立。

| 审查项 | 本组设计自检 | 实际依据 / 后续缺口 |
|---|---|---|
| 功能/对象 | pass | C-LOC/REF/QUAL/CONT/STATE/RESULT各卡承接，基础、qualified、结果与view都有明确唯一文件 |
| 名称覆盖 | pass_for_contracts_scope | 只读检查：302定义（含6core reexport），243既有名称剩10protocol-body defer、17Application、1既有Domain；重复0、结构字段未定义类型0；随后precision新增在跨审复跑 |
| 字段/factory | pass_design_shape | 原actor真实无metadata内actor；revision axes分离；管理动作/parent/source/result、callback语义ref显式；当前资格没有默认current=true |
| state/Slot | pass_design_shape | 17state enum沿02允许边；所有Slot exact载荷和state-required；NotRequired/NotApplicable/Uninitialized明确有来源 |
| 递归类型 | corrected_before_handoff | OriginalOperationEffectRef不再嵌完整StableEffectIdentity，避免结果 -> no-effect -> meaning -> result的无限value-size环；X再做有向graph只读检查 |
| 安全/依赖 | pass_design_boundary | no Application/domain依赖；no body/token/secret/rawerror/hash；constructor不授authority，否定read不泄ref/count |
| 正式资格 | preserved_open | BR-UP-001~009及新增ActionOperationMeaning的owner safe semantic-ref映射未核；缺失fail-closed；不新增owner API或claim支持 |

C内容完整、模块设计自检pass；下一只D1。未执行trait/wire/DDL/runtime或项目测试。


### Domain读取依据补充
不新增业务truth；下面是支持完整rehydrate的唯一contracts载体。

### LocalHydrationBasisRef
归属`shared/operation.rs`；原local存储对象的结构重建依据。
```rust
/// 原local存储对象的结构重建依据。
pub struct LocalHydrationBasisRef {
    /// 实际读取local主语。
    subject: BridgeViewSubjectRef,
    /// 实际该对象版本。
    revision: LocalRevision,
    /// 原store读取证明。
    basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| subject | `BridgeViewSubjectRef` | 实际读取local主语；对应Repository受权consistent read |
| revision | `LocalRevision` | 实际该对象版本；same read |
| basis | `SafeAuthorityRef` | 原store读取证明；exact kind LocalHydrationBasisRef；LocalStore，不由API构造已存state |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(subject: BridgeViewSubjectRef, revision: LocalRevision, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_subject(&self, subject: &BridgeViewSubjectRef, revision: &LocalRevision) -> Result<(), ContractViolation>` | /// 纯比较actual subject/revision；shape成立不授current执行资格 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn subject(&self) -> &BridgeViewSubjectRef` | /// 借用原subject字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn revision(&self) -> &LocalRevision` | /// 借用原revision字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。


### BindingActivationQualification
归属`shared/authority.rs`；Pending或Suspended原relation的显式激活资格，不冒充已有Active。
```rust
/// Pending或Suspended原relation的显式激活资格，不冒充已有Active。
pub struct BindingActivationQualification {
    /// 原installation。
    installation: BridgeInstallationRef,
    /// 原relation。
    binding: ExternalBindingRef,
    /// 原generation条件。
    expected: ExpectedGeneration,
    /// 许可变化后的新代际。
    next_generation: BindingGeneration,
    /// 原target。
    target: BridgeInternalTargetRef,
    /// 完整责任链。
    actor: ActorResponsibilityRef,
    /// 当前显式激活依据。
    basis: AuthorizedBindingBasisRef,
    /// 受限动作集。
    actions: BridgeDirectionActionSet,
    /// 有效交集期限。
    validity: SafeValidityWindow,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| installation | `BridgeInstallationRef` | 原installation；BindingQualificationPort |
| binding | `ExternalBindingRef` | 原relation；consistent mapping snapshot |
| expected | `ExpectedGeneration` | 原generation条件；same snapshot |
| next_generation | `BindingGeneration` | 许可变化后的新代际；current授权；必须expected+1 |
| target | `BridgeInternalTargetRef` | 原target；owner resolver |
| actor | `ActorResponsibilityRef` | 完整责任链；ActorResponsibilityPort |
| basis | `AuthorizedBindingBasisRef` | 当前显式激活依据；BindingQualificationPort |
| actions | `BridgeDirectionActionSet` | 受限动作集；正式basis |
| validity | `SafeValidityWindow` | 有效交集期限；current sources |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(installation: BridgeInstallationRef, binding: ExternalBindingRef, expected: ExpectedGeneration, next_generation: BindingGeneration, target: BridgeInternalTargetRef, actor: ActorResponsibilityRef, basis: AuthorizedBindingBasisRef, actions: BridgeDirectionActionSet, validity: SafeValidityWindow) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_original(&self, binding: &ExternalBindingRef, expected: &ExpectedGeneration, now: SafeInstant) -> Result<(), ContractViolation>` | /// 只核原relation/条件/期限；允许激活不等当前Active IO资格 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn installation(&self) -> &BridgeInstallationRef` | /// 借用原installation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn binding(&self) -> &ExternalBindingRef` | /// 借用原binding字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn expected(&self) -> &ExpectedGeneration` | /// 借用原expected字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn next_generation(&self) -> &BindingGeneration` | /// 借用原next_generation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn target(&self) -> &BridgeInternalTargetRef` | /// 借用原target字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn actor(&self) -> &ActorResponsibilityRef` | /// 借用原actor字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &AuthorizedBindingBasisRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn actions(&self) -> &BridgeDirectionActionSet` | /// 借用原actions字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。


### NoIoProofRef
归属`shared/delivery.rs`；原attempt明确未启动IO证明，不等已调用但无效果。
```rust
/// 原attempt明确未启动IO证明，不等已调用但无效果。
pub struct NoIoProofRef {
    /// 原attempt/effect。
    attempt: AttemptEffectRef,
    /// 权威未发起IO依据。
    basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| attempt | `AttemptEffectRef` | 原attempt/effect；existing record |
| basis | `SafeAuthorityRef` | 权威未发起IO依据；exact kind NoIoProofRef；private invoker或same-attempt authoritative local proof |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(attempt: AttemptEffectRef, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_attempt(&self, attempt: &AttemptEffectRef) -> Result<(), ContractViolation>` | /// lease/timeout/NotFound不构成来源；proof只限原attempt |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn attempt(&self) -> &AttemptEffectRef` | /// 借用原attempt字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### RecoveryWindowRefSlot
归属`shared/continuity.rs`；Gap缺恢复window也必须安全保留原gap，不伪造ref。
```rust
/// 原缺口的恢复窗口资格，Missing/Stale只能manual，不能probe。
pub type RecoveryWindowRefSlot = QualificationSlot<RecoveryWindowRef>;
```
| 变体 | 中文Rustdoc / 载荷 | 允许来源 | 允许去向 |
|---|---|---|---|
| Missing | /// 未建立，finite reason。 | Gap detect/source缺口 | 显式受权维护取得真实window才Established |
| Established | /// 正式RecoveryWindowRef，不永久授权。 | AuthoritativeRecoveryPort | 当前失效Stale |
| Stale | /// 历史window及reason，不执行。 | source撤销/到期 | 原gap显式probe资格建立才可替换 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn missing(reason: SafeReasonCode) -> Self` | /// 保留缺口，拒绝伪造窗口。 |
| 工厂 | `pub fn established(value: RecoveryWindowRef) -> Self` | /// 包裹来源结构，不授probe权。 |
| 成员 | `pub fn require_established(&self) -> Result<&RecoveryWindowRef, ContractViolation>` | /// Missing/Stale拒绝，零IO。 |


### SafeStageKind
归属`views.rs`；当前可披露stage类别。
```rust
/// 当前可披露stage类别。
pub enum SafeStageKind {
    /// 协议阶段。
    Protocol,
    /// 本地提交阶段。
    LocalCommit,
    /// owner阶段。
    Owner,
    /// 平台业务阶段。
    Platform,
    /// consumer阶段。
    Consumer,
    /// 本地业务state。
    Business,
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Protocol | 协议阶段 | 所属正式source/纯组装 | 不适用，无lifecycle |
| LocalCommit | 本地提交阶段 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Owner | owner阶段 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Platform | 平台业务阶段 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Consumer | consumer阶段 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Business | 本地业务state | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### ReadCountDisclosureKind
归属`views.rs`；计数可见性不是默认许可。
```rust
/// 计数可见性不是默认许可。
pub enum ReadCountDisclosureKind {
    /// 仅当前授权范围过滤后计数。
    Allowed,
    /// 不披露count或隐含集合长度。
    Hidden,
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Allowed | 仅当前授权范围过滤后计数 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Hidden | 不披露count或隐含集合长度 | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### ReadDisclosureRules
归属`shared/authority.rs`；resolver先行给出的当前字段披露规则。
```rust
/// resolver先行给出的当前字段披露规则。
pub struct ReadDisclosureRules {
    /// 允许披露stage类别。
    stages: Vec<SafeStageKind>,
    /// 明确计数规则。
    counts: ReadCountDisclosureKind,
    /// 规则正式来源。
    basis: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| stages | `Vec<SafeStageKind>` | 允许披露stage类别；SafeReadQualificationPort actual decision，空不是全部 |
| counts | `ReadCountDisclosureKind` | 明确计数规则；同decision，无默认Allowed |
| basis | `SafeAuthorityRef` | 规则正式来源；exact kind ReadDisclosureRules；same current read scope/version |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(stages: Vec<SafeStageKind>, counts: ReadCountDisclosureKind, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn permits_stage(&self, kind: SafeStageKind) -> bool` | /// 精确集合包含，不以subject可见推全stage可见 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn stages(&self) -> &Vec<SafeStageKind>` | /// 借用原stages字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn counts(&self) -> &ReadCountDisclosureKind` | /// 借用原counts字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthorityRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### CurrentSafeHandoffQualification
归属`shared/traceability.rs`；原canonical交接本次当前资格。
```rust
/// 原canonical交接本次当前资格。
pub struct CurrentSafeHandoffQualification {
    /// 原handoff。
    handoff: SafeHandoffRef,
    /// 原consumer op。
    original: OriginalHandoffOperationRef,
    /// 真实producer来源。
    audit: SafeAuditRef,
    /// 原canonical身份版本。
    material: CanonicalSafeMaterialRef,
    /// 明确schema版本。
    schema: SafeProducerSchemaRevision,
    /// 当前准入。
    admission: ProducerAdmissionRef,
    /// 受限窗口。
    retention: QualifiedRetentionWindowRef,
    /// 本次资格交集期限。
    validity: SafeValidityWindow,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| handoff | `SafeHandoffRef` | 原handoff；existing qualified read |
| original | `OriginalHandoffOperationRef` | 原consumer op；same store |
| audit | `SafeAuditRef` | 真实producer来源；same canonical |
| material | `CanonicalSafeMaterialRef` | 原canonical身份版本；SafeObservationPort current |
| schema | `SafeProducerSchemaRevision` | 明确schema版本；actual producer admission |
| admission | `ProducerAdmissionRef` | 当前准入；actual Observability |
| retention | `QualifiedRetentionWindowRef` | 受限窗口；formal policy |
| validity | `SafeValidityWindow` | 本次资格交集期限；current sources |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(handoff: SafeHandoffRef, original: OriginalHandoffOperationRef, audit: SafeAuditRef, material: CanonicalSafeMaterialRef, schema: SafeProducerSchemaRevision, admission: ProducerAdmissionRef, retention: QualifiedRetentionWindowRef, validity: SafeValidityWindow) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_original(&self, original: &OriginalHandoffOperationRef, now: SafeInstant) -> Result<(), ContractViolation>` | /// current canonical/audit/op/schema/窗口全部匹配，不续新材料 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn handoff(&self) -> &SafeHandoffRef` | /// 借用原handoff字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn original(&self) -> &OriginalHandoffOperationRef` | /// 借用原original字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn audit(&self) -> &SafeAuditRef` | /// 借用原audit字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn material(&self) -> &CanonicalSafeMaterialRef` | /// 借用原material字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn schema(&self) -> &SafeProducerSchemaRevision` | /// 借用原schema字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn admission(&self) -> &ProducerAdmissionRef` | /// 借用原admission字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn retention(&self) -> &QualifiedRetentionWindowRef` | /// 借用原retention字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。


### LocalRevisionCondition
归属`shared/operation.rs`；insert唯一性和已有CAS的不同条件。
```rust
/// insert唯一性和已有CAS的不同条件。
pub enum LocalRevisionCondition {
    /// 首次insert要求同subject/unique key确实不存在。
    Absent,
    /// 已有对象精确local CAS版本。
    Present(ExpectedLocalRevision),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Absent | 首次insert要求同subject/unique key确实不存在 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Present | 已有对象精确local CAS版本；`ExpectedLocalRevision` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |



### JobSubjectRef
归属`jobs.rs`；维护关联同时表达recoverable和资格主语。
```rust
/// 维护关联同时表达recoverable和资格主语。
pub enum JobSubjectRef {
    /// 原inbound/callback/intent/gap/handoff。
    Recoverable(OriginalRecoverableSubjectRef),
    /// 既有installation/binding/mapping/plan等资格主语，不假造effect。
    Qualification(BridgeViewSubjectRef),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Recoverable | 原inbound/callback/intent/gap/handoff；`OriginalRecoverableSubjectRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Qualification | 既有installation/binding/mapping/plan等资格主语，不假造effect；`BridgeViewSubjectRef` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


<!-- step06-contracts-tail -->
