# Step6-A contracts：共享词汇与边界类型

## 批次开工与设计记录

输入：主Step6/Step5 contracts职责、02 §6/7/9；Core正式03 §5/7及其Step6 §9.2，实际contracts/src/actor.rs、metadata.rs、lib.rs。问题：哪些符号可真实复用，哪些本地独立拥有？诊断：foreign ref名字不等已导出类型；Core的helper方法有设计/实现差别。取舍：只复用实际定义/导出的Core字段类型，外部业务/证明保留blocked slot，不补“opaque成功schema”。

capability→对象：局部identity→ID/value；版本隔离→四revision；状态分轴→enum；安全失败→无敏感字段分类；源/范围身份→正式owner输入slot。字段来源：ID生成器/已提交store/请求显式值/Core元数据或owner正式查询，各自不得替代。

## Core符号核验

| 使用符号 | 正式来源 | 实际定义/export | 本地使用限制 |
|---|---|---|---|
| ActorContext、ActorRef、ActorKind、RequestOrigin | L0-core正式03 §5及Step6 §9.2 actor | core-contracts/src/actor.rs，lib.rs pub mod actor | role_refs仅hint，无授权；Origin无Consumer，worker用Operations加本地channel |
| RequestMetadata、CommandMetadata、QueryMetadata | 同上metadata对象 | metadata.rs:398/428/471，lib pub mod metadata | 读字段，不调用实现中不存在的from_gateway_headers/idempotency_key helper |
| ActorId、RequestId、TraceId、IdempotencyKey、Timestamp | Core共享metadata类型及上述对象字段 | metadata.rs string_newtype定义并经pub mod导出 | 必须使用真实模块路径，不假定root re-export |
| Core PageRequest/PageToken | Core QueryMetadata字段 | metadata.rs:439/450 | 本仓拒绝QueryMetadata.page非None，workspace自己的页字段唯一authority；不以Core通用token取代本仓绑定 |

仅上述符号schema字段已对照；无cargo编译/commit/tag验证。可在后续实施依赖核验时采用contracts对Core的最小compile引用；当前WS-UP-007 workspace专用schema仍open，Step3/4“未启用”是未创建manifest的事实，不因本表声称已启用。本地不复制ActorContext/CommandMetadata定义。

## 外部未闭合类型登记（不是Rust定义）

以下名字仅为02已识别的输入需求标签。**禁止声明空struct、String别名、serde_json::Value、任意Map或泛型成功值来替代。含这些槽位的代码片段是blocked design contract，不可独立编译；正向实现等owning schema闭合。**

| 槽位（每项独立待闭合） | owner / blocker | 必须提供的信息 / 拒绝条件 |
|---|---|---|
| OwnerScopeRef、OwnerResolutionRef、OwnerScopeResolution、ScopeSelector | identity/work；005 | stable anchor/关系/selector schema，正式解析链；无来源不能建scope |
| OwnerSubjectRef、SafeSourceItem、OwnerSafeReadResult、SourceVersionBasis、OwnerWatermark、OwnerCoverageProof | 各source owner；001 | safe字段白名单、版本/声明范围、完整性；无proof不能Complete |
| SourceStreamRef、SourceEventIdentity、SourceCursor、SourceCursorBasis、OwnerBaselineBasis、OwnerBaselineContinuation | owner+bus；002 | identity/schema/comparator/连续性/baseline接续；无比较不能排序 |
| OwnerDecisionRef、VisibilitySubjectBinding、OwnerValidityBasis、OwnerVisibilityResolution、VisibilityContextRef | owning chain；003 | scope/list/item/version和当前有效性/撤销绑定，缺失fail-closed |
| OwnerAttentionRef、OwnerAttentionVersion、OwnerAttentionInput、AttentionIdentityResolution、AttentionReadBasis | attention owner；004 | 稳定attention身份/生命周期/排序与跨generation映射；未证明不猜已读 |
| OwnerInvalidationBasis、OwnerAffectedSelection | owning domain；002/003 | 正式失效依据/范围，不把timeout作tombstone |
| SafeProvenance | 各owner；001/003 | 已裁剪来源元信息，count/ref也受同决定限制 |

类型slot不提供新owner事实。Core通用ResourceRef不能无依据替代上述typed关系；fake只能表达这些合同的“缺失/拒绝”，不能自行创建正向来源证明。

## 局部标识与版本

ID只在workspace局部命名空间，不编码actor/scope/source语义。UUIDv4 16字节，构造检查version/variant，wire小写标准UUID；不重用用户输入ID生成新对象。ID分配由application IdPort，唯一冲突由store拒绝重试。下列每个独立类型在contracts/local_refs.rs，private字段：

### WorkspacePartitionId

位置：`crates/contracts/src/local_refs.rs`。能力：Identifies a workspace-local record.

```rust
/// Identifies a workspace-local record.
pub struct WorkspacePartitionId {
    /// Validated UUID bytes.
    bytes: [u8; 16],
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `bytes` | `[u8; 16]` | IdPort生成；格式校验，不可nil，不表示owner事实 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn as_bytes(&self) -> &[u8; 16]` | 只读，序列化按UUID标准格式；无写副作用 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_from_bytes(bytes: [u8; 16]) -> Result<Self, ContractError>` | 验证UUIDv4；创建业务对象另需相应命令与owner证明 |

不变量/禁止：不能跨ID类型互转；query不能以生成ID触发对象创建。

### GenerationId

位置：`crates/contracts/src/local_refs.rs`。能力：Identifies a workspace-local record.

```rust
/// Identifies a workspace-local record.
pub struct GenerationId {
    /// Validated UUID bytes.
    bytes: [u8; 16],
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `bytes` | `[u8; 16]` | IdPort生成；格式校验，不可nil，不表示owner事实 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn as_bytes(&self) -> &[u8; 16]` | 只读，序列化按UUID标准格式；无写副作用 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_from_bytes(bytes: [u8; 16]) -> Result<Self, ContractError>` | 验证UUIDv4；创建业务对象另需相应命令与owner证明 |

不变量/禁止：不能跨ID类型互转；query不能以生成ID触发对象创建。

### RebuildAttemptId

位置：`crates/contracts/src/local_refs.rs`。能力：Identifies a workspace-local record.

```rust
/// Identifies a workspace-local record.
pub struct RebuildAttemptId {
    /// Validated UUID bytes.
    bytes: [u8; 16],
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `bytes` | `[u8; 16]` | IdPort生成；格式校验，不可nil，不表示owner事实 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn as_bytes(&self) -> &[u8; 16]` | 只读，序列化按UUID标准格式；无写副作用 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_from_bytes(bytes: [u8; 16]) -> Result<Self, ContractError>` | 验证UUIDv4；创建业务对象另需相应命令与owner证明 |

不变量/禁止：不能跨ID类型互转；query不能以生成ID触发对象创建。

### InvalidationId

位置：`crates/contracts/src/local_refs.rs`。能力：Identifies a workspace-local record.

```rust
/// Identifies a workspace-local record.
pub struct InvalidationId {
    /// Validated UUID bytes.
    bytes: [u8; 16],
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `bytes` | `[u8; 16]` | IdPort生成；格式校验，不可nil，不表示owner事实 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn as_bytes(&self) -> &[u8; 16]` | 只读，序列化按UUID标准格式；无写副作用 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_from_bytes(bytes: [u8; 16]) -> Result<Self, ContractError>` | 验证UUIDv4；创建业务对象另需相应命令与owner证明 |

不变量/禁止：不能跨ID类型互转；query不能以生成ID触发对象创建。

### WorkspaceOperationRef

位置：`crates/contracts/src/local_refs.rs`。能力：Identifies a workspace-local record.

```rust
/// Identifies a workspace-local record.
pub struct WorkspaceOperationRef {
    /// Validated UUID bytes.
    bytes: [u8; 16],
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `bytes` | `[u8; 16]` | IdPort生成；格式校验，不可nil，不表示owner事实 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn as_bytes(&self) -> &[u8; 16]` | 只读，序列化按UUID标准格式；无写副作用 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_from_bytes(bytes: [u8; 16]) -> Result<Self, ContractError>` | 验证UUIDv4；创建业务对象另需相应命令与owner证明 |

不变量/禁止：不能跨ID类型互转；query不能以生成ID触发对象创建。

### ApplicationResultRef

位置：`crates/contracts/src/local_refs.rs`。能力：Identifies a workspace-local record.

```rust
/// Identifies a workspace-local record.
pub struct ApplicationResultRef {
    /// Validated UUID bytes.
    bytes: [u8; 16],
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `bytes` | `[u8; 16]` | IdPort生成；格式校验，不可nil，不表示owner事实 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn as_bytes(&self) -> &[u8; 16]` | 只读，序列化按UUID标准格式；无写副作用 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_from_bytes(bytes: [u8; 16]) -> Result<Self, ContractError>` | 验证UUIDv4；创建业务对象另需相应命令与owner证明 |

不变量/禁止：不能跨ID类型互转；query不能以生成ID触发对象创建。

### GapRef

位置：`crates/contracts/src/local_refs.rs`。能力：Identifies a workspace-local record.

```rust
/// Identifies a workspace-local record.
pub struct GapRef {
    /// Validated UUID bytes.
    bytes: [u8; 16],
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `bytes` | `[u8; 16]` | IdPort生成；格式校验，不可nil，不表示owner事实 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn as_bytes(&self) -> &[u8; 16]` | 只读，序列化按UUID标准格式；无写副作用 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_from_bytes(bytes: [u8; 16]) -> Result<Self, ContractError>` | 验证UUIDv4；创建业务对象另需相应命令与owner证明 |

不变量/禁止：不能跨ID类型互转；query不能以生成ID触发对象创建。

### CommitAttemptId

位置：`crates/contracts/src/local_refs.rs`。能力：Identifies a workspace-local record.

```rust
/// Identifies a workspace-local record.
pub struct CommitAttemptId {
    /// Validated UUID bytes.
    bytes: [u8; 16],
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `bytes` | `[u8; 16]` | IdPort生成；格式校验，不可nil，不表示owner事实 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn as_bytes(&self) -> &[u8; 16]` | 只读，序列化按UUID标准格式；无写副作用 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_from_bytes(bytes: [u8; 16]) -> Result<Self, ContractError>` | 验证UUIDv4；创建业务对象另需相应命令与owner证明 |

不变量/禁止：不能跨ID类型互转；query不能以生成ID触发对象创建。

### PartitionVersion

位置：`crates/contracts/src/local_refs.rs`。能力：Carries one local optimistic revision axis.

```rust
/// Carries one local optimistic revision axis.
pub struct PartitionVersion {
    /// Local revision value.
    value: u64,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `value` | `u64` | 0仅未提交/空candidate；首提交=1，已提交变化checked_add；上限返回VersionExhausted，不wrap |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn value(&self) -> u64` | 纯读取 |
| `pub fn checked_next(&self) -> Result<Self, ContractError>` | 仅构造tentative下一版本；不代表已提交 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn from_value(value: u64) -> Self` | 仅边界解码与store恢复；expected=0合法性由具体操作校验 |

不变量/禁止：四轴不可互换；source cursor不是本地u64版本。

### ViewRevision

位置：`crates/contracts/src/local_refs.rs`。能力：Carries one local optimistic revision axis.

```rust
/// Carries one local optimistic revision axis.
pub struct ViewRevision {
    /// Local revision value.
    value: u64,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `value` | `u64` | 0仅未提交/空candidate；首提交=1，已提交变化checked_add；上限返回VersionExhausted，不wrap |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn value(&self) -> u64` | 纯读取 |
| `pub fn checked_next(&self) -> Result<Self, ContractError>` | 仅构造tentative下一版本；不代表已提交 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn from_value(value: u64) -> Self` | 仅边界解码与store恢复；expected=0合法性由具体操作校验 |

不变量/禁止：四轴不可互换；source cursor不是本地u64版本。

### LocalRevision

位置：`crates/contracts/src/local_refs.rs`。能力：Carries one local optimistic revision axis.

```rust
/// Carries one local optimistic revision axis.
pub struct LocalRevision {
    /// Local revision value.
    value: u64,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `value` | `u64` | 0仅未提交/空candidate；首提交=1，已提交变化checked_add；上限返回VersionExhausted，不wrap |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn value(&self) -> u64` | 纯读取 |
| `pub fn checked_next(&self) -> Result<Self, ContractError>` | 仅构造tentative下一版本；不代表已提交 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn from_value(value: u64) -> Self` | 仅边界解码与store恢复；expected=0合法性由具体操作校验 |

不变量/禁止：四轴不可互换；source cursor不是本地u64版本。

### AttemptVersion

位置：`crates/contracts/src/local_refs.rs`。能力：Carries one local optimistic revision axis.

```rust
/// Carries one local optimistic revision axis.
pub struct AttemptVersion {
    /// Local revision value.
    value: u64,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `value` | `u64` | 0仅未提交/空candidate；首提交=1，已提交变化checked_add；上限返回VersionExhausted，不wrap |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn value(&self) -> u64` | 纯读取 |
| `pub fn checked_next(&self) -> Result<Self, ContractError>` | 仅构造tentative下一版本；不代表已提交 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn from_value(value: u64) -> Self` | 仅边界解码与store恢复；expected=0合法性由具体操作校验 |

不变量/禁止：四轴不可互换；source cursor不是本地u64版本。

### SafeInputDigest

位置：`crates/contracts/src/local_refs.rs`。能力：Identifies canonical local input bytes.

```rust
/// Identifies canonical local input bytes.
pub struct SafeInputDigest {
    /// Canonical SHA-256 digest.
    sha256: [u8; 32],
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `sha256` | `[u8; 32]` | 规范化协议字节SHA-256；按Step8逐字段规则，外部摘要需owner合法canonicalization |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn bytes(&self) -> &[u8; 32]` | 只读比较，不作为身份或权限 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn from_sha256(sha256: [u8; 32]) -> Self` | 只供已执行正式canonicalizer的应用构造 |

不变量/禁止：不得hash原始正文/token，不能用hash绕过外部schema未知。

### InboxItemId

位置：`crates/contracts/src/local_refs.rs`。能力：Identifies stable local attention across generations.

```rust
/// Identifies stable local attention across generations.
pub struct InboxItemId {
    /// Stable attention identity digest.
    digest: [u8; 32],
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `digest` | `[u8; 32]` | SHA-256(tag=ws-inbox-v1, partition UUID, owner tag, owner canonical attention identity)；长度前缀编码；004未闭合不可生成 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn bytes(&self) -> &[u8; 32]` | 只读；排序tie-break可用 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn derive(partition: WorkspacePartitionId, input: &OwnerAttentionInput) -> Result<Self, ContractError>` | 外部slot blocked；严禁使用title/timestamp猜identity |

不变量/禁止：digest不含generation/attention version；同id不同正式identity视冲突，不能合并。

## 局部枚举合同

基础类型放contracts/local_refs.rs；ContractError/SafeFailureCode/FailureAvailability放contracts/errors.rs，DomainError唯一在domain/errors.rs。其他模块import不复制enum。

### ScopeKind

```rust
/// Selects the workspace scope branch.
pub enum ScopeKind {
    /// A personal read scope.
    Personal,
    /// A project read scope.
    Project,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Personal` | A personal read scope. | 请求分支，非状态 |
| `Project` | A project read scope. | 请求分支，非状态 |

### SourceOwner

```rust
/// Names the owning source domain.
pub enum SourceOwner {
    /// The identity owning domain.
    Identity,
    /// The conversation owning domain.
    Conversation,
    /// The work owning domain.
    Work,
    /// The process owning domain.
    Process,
    /// The governance owning domain.
    Governance,
    /// The artifact owning domain.
    Artifact,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Identity` | The identity owning domain. | 正式绑定，非状态 |
| `Conversation` | The conversation owning domain. | 正式绑定，非状态 |
| `Work` | The work owning domain. | 正式绑定，非状态 |
| `Process` | The process owning domain. | 正式绑定，非状态 |
| `Governance` | The governance owning domain. | 正式绑定，非状态 |
| `Artifact` | The artifact owning domain. | 正式绑定，非状态 |

### CoverageState

```rust
/// Describes proven source coverage.
pub enum CoverageState {
    /// Unknown source coverage.
    Unknown,
    /// Partial source coverage.
    Partial,
    /// Complete source coverage.
    Complete,
    /// Gap source coverage.
    Gap,
    /// Invalidated source coverage.
    Invalidated,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Unknown` | Unknown source coverage. | SourceCoverage更新；Step10矩阵 |
| `Partial` | Partial source coverage. | SourceCoverage更新；Step10矩阵 |
| `Complete` | Complete source coverage. | SourceCoverage更新；Step10矩阵 |
| `Gap` | Gap source coverage. | SourceCoverage更新；Step10矩阵 |
| `Invalidated` | Invalidated source coverage. | SourceCoverage更新；Step10矩阵 |

### TerminalApplyDisposition

```rust
/// Records an immutable disposition.
pub enum TerminalApplyDisposition {
    /// The source input was atomically applied.
    Applied,
    /// Proven older input did not overwrite newer data.
    LateIgnored,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Applied` | The source input was atomically applied. | commit终局 |
| `LateIgnored` | Proven older input did not overwrite newer data. | 正式比较证明；终局 |

### AttentionState

```rust
/// Mirrors explicit owner attention.
pub enum AttentionState {
    /// The owner explicitly presents attention.
    Present,
    /// The owner explicitly withdraws attention.
    Withdrawn,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Present` | The owner explicitly presents attention. | 可Withdrawn |
| `Withdrawn` | The owner explicitly withdraws attention. | 较新正式重开证明才Present |

### ReadClassification

```rust
/// Classifies local read intent.
pub enum ReadClassification {
    /// The item is covered by explicit read intent.
    Read,
    /// An unread override or proven unread relation exists.
    Unread,
    /// No stable identity or order proof exists.
    Unknown,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Read` | The item is covered by explicit read intent. | 纯派生 |
| `Unread` | An unread override or proven unread relation exists. | 纯派生 |
| `Unknown` | No stable identity or order proof exists. | 纯派生，不猜已读 |

### RecoveryMode

```rust
/// Selects explicit maintenance.
pub enum RecoveryMode {
    /// Refreshes through a formally supported baseline.
    Refresh,
    /// Rebuilds from baseline and proven continuation.
    Rebuild,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Refresh` | Refreshes through a formally supported baseline. | 显式请求 |
| `Rebuild` | Rebuilds from baseline and proven continuation. | 显式请求 |

### RebuildStatus

```rust
/// Tracks a local maintenance attempt.
pub enum RebuildStatus {
    /// The attempt is requested.
    Requested,
    /// The attempt is baselining.
    Baselining,
    /// The attempt is catchingup.
    CatchingUp,
    /// The attempt is validating.
    Validating,
    /// The attempt is ready.
    Ready,
    /// The attempt is completed.
    Completed,
    /// The attempt is blocked.
    Blocked,
    /// The attempt is failed.
    Failed,
    /// The attempt is superseded.
    Superseded,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Requested` | The attempt is requested. | Request/Advance/Supersede，后四终态 |
| `Baselining` | The attempt is baselining. | Request/Advance/Supersede，后四终态 |
| `CatchingUp` | The attempt is catchingup. | Request/Advance/Supersede，后四终态 |
| `Validating` | The attempt is validating. | Request/Advance/Supersede，后四终态 |
| `Ready` | The attempt is ready. | Request/Advance/Supersede，后四终态 |
| `Completed` | The attempt is completed. | Request/Advance/Supersede，后四终态 |
| `Blocked` | The attempt is blocked. | Request/Advance/Supersede，后四终态 |
| `Failed` | The attempt is failed. | Request/Advance/Supersede，后四终态 |
| `Superseded` | The attempt is superseded. | Request/Advance/Supersede，后四终态 |

### GenerationRole

```rust
/// Tracks selection independently of safety.
pub enum GenerationRole {
    /// Candidate generation role.
    Candidate,
    /// Current generation role.
    Current,
    /// Retired generation role.
    Retired,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Candidate` | Candidate generation role. | Request/切换；Retired不复活 |
| `Current` | Current generation role. | Request/切换；Retired不复活 |
| `Retired` | Retired generation role. | Request/切换；Retired不复活 |

### GenerationSafetyState

```rust
/// Tracks local validation without permission authority.
pub enum GenerationSafetyState {
    /// Unverified local safety posture.
    Unverified,
    /// Validated local safety posture.
    Validated,
    /// SafetyBlocked local safety posture.
    SafetyBlocked,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Unverified` | Unverified local safety posture. | 验证/失效；SafetyBlocked不原地恢复 |
| `Validated` | Validated local safety posture. | 验证/失效；SafetyBlocked不原地恢复 |
| `SafetyBlocked` | SafetyBlocked local safety posture. | 验证/失效；SafetyBlocked不原地恢复 |

### InvalidationEffect

```rust
/// Separates freshness and safety.
pub enum InvalidationEffect {
    /// Only data freshness is invalidated.
    DataStale,
    /// Affected output must fail closed.
    SafetyBlocked,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `DataStale` | Only data freshness is invalidated. | 不改coverage为Invalidated |
| `SafetyBlocked` | Affected output must fail closed. | 正式安全失效 |

### DataFreshness

```rust
/// Describes data freshness.
pub enum DataFreshness {
    /// Fresh data freshness.
    Fresh,
    /// Stale data freshness.
    Stale,
    /// Unknown data freshness.
    Unknown,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Fresh` | Fresh data freshness. | query派生，无写迁移 |
| `Stale` | Stale data freshness. | query派生，无写迁移 |
| `Unknown` | Unknown data freshness. | query派生，无写迁移 |

### ReadCoverage

```rust
/// Describes safely exposable completeness.
pub enum ReadCoverage {
    /// Complete visible completeness.
    Complete,
    /// Partial visible completeness.
    Partial,
    /// Unknown visible completeness.
    Unknown,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Complete` | Complete visible completeness. | 安全proof，不泄露hidden |
| `Partial` | Partial visible completeness. | 安全proof，不泄露hidden |
| `Unknown` | Unknown visible completeness. | 安全proof，不泄露hidden |

### ReadMode

```rust
/// Selects materialized or transient reads.
pub enum ReadMode {
    /// Reads a committed generation.
    Materialized,
    /// Reads owners without saving.
    Transient,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Materialized` | Reads a committed generation. | 显式，不自动fallback |
| `Transient` | Reads owners without saving. | 显式，无物化token |

### LocalReadBasis

```rust
/// Binds the local overlay revision.
pub enum LocalReadBasis {
    /// No local overlay exists.
    Absent,
    /// Carries the observed overlay revision.
    Present(LocalRevision),
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Absent` | No local overlay exists. | store读取，不补建 |
| `Present(LocalRevision)` | Carries the observed overlay revision. | store快照，变化页失效 |

### OperationKind

```rust
/// Names local writing use cases.
pub enum OperationKind {
    /// The Provision operation.
    Provision,
    /// The ChangeLocal operation.
    ChangeLocal,
    /// The RequestRecovery operation.
    RequestRecovery,
    /// The AdvanceRecovery operation.
    AdvanceRecovery,
    /// The SupersedeRecovery operation.
    SupersedeRecovery,
    /// The InvalidateView operation.
    InvalidateView,
    /// The SourceInvalidation operation.
    SourceInvalidation,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Provision` | The Provision operation. | 具名入口映射 |
| `ChangeLocal` | The ChangeLocal operation. | 具名入口映射 |
| `RequestRecovery` | The RequestRecovery operation. | 具名入口映射 |
| `AdvanceRecovery` | The AdvanceRecovery operation. | 具名入口映射 |
| `SupersedeRecovery` | The SupersedeRecovery operation. | 具名入口映射 |
| `InvalidateView` | The InvalidateView operation. | 具名入口映射 |
| `SourceInvalidation` | The SourceInvalidation operation. | 具名入口映射 |

### OperationChannel

```rust
/// Separates operation namespaces.
pub enum OperationChannel {
    /// Command namespace.
    Command,
    /// Operations namespace.
    Operations,
    /// SourceInvalidation namespace.
    SourceInvalidation,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Command` | Command namespace. | 由入口构造，非请求可选 |
| `Operations` | Operations namespace. | 由入口构造，非请求可选 |
| `SourceInvalidation` | SourceInvalidation namespace. | 由入口构造，非请求可选 |

### ContractError

```rust
/// Reports structural contract errors.
pub enum ContractError {
    /// InvalidIdentifier validation error.
    InvalidIdentifier,
    /// InvalidValue validation error.
    InvalidValue,
    /// WrongKind validation error.
    WrongKind,
    /// MissingBasis validation error.
    MissingBasis,
    /// Mismatch validation error.
    Mismatch,
    /// VersionExhausted validation error.
    VersionExhausted,
    /// Unsupported validation error.
    Unsupported,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `InvalidIdentifier` | InvalidIdentifier validation error. | 结构校验，无raw信息 |
| `InvalidValue` | InvalidValue validation error. | 结构校验，无raw信息 |
| `WrongKind` | WrongKind validation error. | 结构校验，无raw信息 |
| `MissingBasis` | MissingBasis validation error. | 结构校验，无raw信息 |
| `Mismatch` | Mismatch validation error. | 结构校验，无raw信息 |
| `VersionExhausted` | VersionExhausted validation error. | 结构校验，无raw信息 |
| `Unsupported` | Unsupported validation error. | 结构校验，无raw信息 |

### DomainError

```rust
/// Reports local invariant violations.
pub enum DomainError {
    /// Mismatch invariant violation.
    Mismatch,
    /// MissingBasis invariant violation.
    MissingBasis,
    /// InvalidTransition invariant violation.
    InvalidTransition,
    /// VersionConflict invariant violation.
    VersionConflict,
    /// VersionExhausted invariant violation.
    VersionExhausted,
    /// SafetyBlocked invariant violation.
    SafetyBlocked,
    /// Gap invariant violation.
    Gap,
    /// DigestConflict invariant violation.
    DigestConflict,
    /// Unsupported invariant violation.
    Unsupported,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Mismatch` | Mismatch invariant violation. | 领域方法，无raw信息 |
| `MissingBasis` | MissingBasis invariant violation. | 领域方法，无raw信息 |
| `InvalidTransition` | InvalidTransition invariant violation. | 领域方法，无raw信息 |
| `VersionConflict` | VersionConflict invariant violation. | 领域方法，无raw信息 |
| `VersionExhausted` | VersionExhausted invariant violation. | 领域方法，无raw信息 |
| `SafetyBlocked` | SafetyBlocked invariant violation. | 领域方法，无raw信息 |
| `Gap` | Gap invariant violation. | 领域方法，无raw信息 |
| `DigestConflict` | DigestConflict invariant violation. | 领域方法，无raw信息 |
| `Unsupported` | Unsupported invariant violation. | 领域方法，无raw信息 |

### SafeFailureCode

```rust
/// Reports redacted public failures.
pub enum SafeFailureCode {
    /// NotAvailable safe failure.
    NotAvailable,
    /// ContractBlocked safe failure.
    ContractBlocked,
    /// SourceUnavailable safe failure.
    SourceUnavailable,
    /// CursorInvalid safe failure.
    CursorInvalid,
    /// Conflict safe failure.
    Conflict,
    /// InvalidRequest safe failure.
    InvalidRequest,
    /// OutcomeUnknown safe failure.
    OutcomeUnknown,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `NotAvailable` | NotAvailable safe failure. | 安全映射，未解析scope仅NotAvailable/InvalidRequest |
| `ContractBlocked` | ContractBlocked safe failure. | 安全映射，未解析scope仅NotAvailable/InvalidRequest |
| `SourceUnavailable` | SourceUnavailable safe failure. | 安全映射，未解析scope仅NotAvailable/InvalidRequest |
| `CursorInvalid` | CursorInvalid safe failure. | 安全映射，未解析scope仅NotAvailable/InvalidRequest |
| `Conflict` | Conflict safe failure. | 安全映射，未解析scope仅NotAvailable/InvalidRequest |
| `InvalidRequest` | InvalidRequest safe failure. | 安全映射，未解析scope仅NotAvailable/InvalidRequest |
| `OutcomeUnknown` | OutcomeUnknown safe failure. | 安全映射，未解析scope仅NotAvailable/InvalidRequest |

### FailureAvailability

```rust
/// Classifies outer read failures.
pub enum FailureAvailability {
    /// Reading cannot safely proceed.
    Blocked,
    /// No safe result is available.
    Unavailable,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Blocked` | Reading cannot safely proceed. | 权限/合同缺口 |
| `Unavailable` | No safe result is available. | 技术失败，无敏感字段 |

### LocalOrder

```rust
/// Selects presentation-only order.
pub enum LocalOrder {
    /// Orders by stable local identity.
    StableIdentity,
    /// Orders visible pinned items before identity.
    PinnedFirst,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `StableIdentity` | Orders by stable local identity. | 默认，非业务优先级 |
| `PinnedFirst` | Orders visible pinned items before identity. | 局部展示 |

### SetFlag

```rust
/// Sets or clears a flag.
pub enum SetFlag {
    /// Sets the local flag.
    Set,
    /// Clears the local flag.
    Clear,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Set` | Sets the local flag. | 显式command |
| `Clear` | Clears the local flag. | 显式command |

### LocalFlag

```rust
/// Selects a local flag.
pub enum LocalFlag {
    /// The local pinned flag.
    Pinned,
    /// The local muted flag.
    Muted,
    /// The local hidden flag.
    Hidden,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Pinned` | The local pinned flag. | 不影响owner可见性 |
| `Muted` | The local muted flag. | 不影响owner可见性 |
| `Hidden` | The local hidden flag. | 不影响owner可见性 |

### RecoveryFailureCode

```rust
/// Records safe recovery termination reasons.
pub enum RecoveryFailureCode {
    /// ContractBlocked recovery failure.
    ContractBlocked,
    /// SourceUnavailable recovery failure.
    SourceUnavailable,
    /// SourceGap recovery failure.
    SourceGap,
    /// SafetyInvalidated recovery failure.
    SafetyInvalidated,
    /// ConcurrentChange recovery failure.
    ConcurrentChange,
    /// StorageFailure recovery failure.
    StorageFailure,
    /// InvalidBaseline recovery failure.
    InvalidBaseline,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `ContractBlocked` | ContractBlocked recovery failure. | 受控失败，无raw数据 |
| `SourceUnavailable` | SourceUnavailable recovery failure. | 受控失败，无raw数据 |
| `SourceGap` | SourceGap recovery failure. | 受控失败，无raw数据 |
| `SafetyInvalidated` | SafetyInvalidated recovery failure. | 受控失败，无raw数据 |
| `ConcurrentChange` | ConcurrentChange recovery failure. | 受控失败，无raw数据 |
| `StorageFailure` | StorageFailure recovery failure. | 受控失败，无raw数据 |
| `InvalidBaseline` | InvalidBaseline recovery failure. | 受控失败，无raw数据 |

## 稳定组合载体

### StableScopeKey

位置：`crates/contracts/src/local_refs.rs`。能力：Separates stable identity from proof freshness.

```rust
/// Separates stable identity from proof freshness.
pub struct StableScopeKey {
    /// Resolved scope branch.
    kind: ScopeKind,
    /// Stable owner anchor.
    anchor: OwnerScopeRef,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `kind` | `ScopeKind` | 请求经resolver确认 |
| `anchor` | `OwnerScopeRef` | 005外部slot；stable anchor，不含resolution_ref/时间 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn matches(&self, other: &Self) -> bool` | owner typed identity等价，不比较解析时间 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn from_resolution(resolution: &OwnerScopeResolution) -> Result<Self, ContractError>` | 只复制已核验稳定kind/anchor |

不变量/禁止：同principal+scope唯一；重新授权不产生新分区。

### WorkspaceOperationKey

位置：`crates/contracts/src/local_refs.rs`。能力：Binds an operation to stable resolved identity.

```rust
/// Binds an operation to stable resolved identity.
pub struct WorkspaceOperationKey {
    /// Effective actor identifier.
    actor_id: ActorId,
    /// Stable scope.
    scope: StableScopeKey,
    /// Entry namespace.
    channel: OperationChannel,
    /// Operation family.
    kind: OperationKind,
    /// Idempotency key.
    key: IdempotencyKey,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `actor_id` | `ActorId` | Core actor.actor_id，不含display/role |
| `scope` | `StableScopeKey` | 正式resolver |
| `channel` | `OperationChannel` | 具名入口常量 |
| `kind` | `OperationKind` | 入口唯一映射 |
| `key` | `IdempotencyKey` | metadata唯一来源；源失效由正式event identity派生，002 blocked |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn same_target(&self, other: &Self) -> bool` | 完整key比較，不用trace/partition替代 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(actor_id: ActorId, scope: StableScopeKey, channel: OperationChannel, kind: OperationKind, key: IdempotencyKey) -> Result<Self, ContractError>` | channel/kind匹配，key非空 |

不变量/禁止：Provision无partition也能lookup；不含resolution proof。

### SourceApplicationKey

位置：`crates/contracts/src/local_refs.rs`。能力：Identifies one source application per generation.

```rust
/// Identifies one source application per generation.
pub struct SourceApplicationKey {
    /// Source owner.
    owner: SourceOwner,
    /// Owner stream.
    stream: SourceStreamRef,
    /// Owner event identity.
    event: SourceEventIdentity,
    /// Target partition.
    partition: WorkspacePartitionId,
    /// Target generation.
    generation: GenerationId,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `owner` | `SourceOwner` | 正式绑定 |
| `stream` | `SourceStreamRef` | 002正式流ID |
| `event` | `SourceEventIdentity` | 002正式事件身份 |
| `partition` | `WorkspacePartitionId` | 已有分区 |
| `generation` | `GenerationId` | 获准目标 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn matches(&self, other: &Self) -> bool` | 完整key比较 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(owner: SourceOwner, stream: SourceStreamRef, event: SourceEventIdentity, partition: WorkspacePartitionId, generation: GenerationId) -> Result<Self, ContractError>` | 外部identity规则不猜 |

不变量/禁止：delivery retry不变event；新generation不复用旧成功键。

### SafeReadFailure

位置：`crates/contracts/src/errors.rs`。能力：Carries a fail-closed response.

```rust
/// Carries a fail-closed response.
pub struct SafeReadFailure {
    /// Failure posture.
    availability: FailureAvailability,
    /// Redacted failure.
    code: SafeFailureCode,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `availability` | `FailureAvailability` | 安全/技术失败分类 |
| `code` | `SafeFailureCode` | 未解析/无权统一NotAvailable |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn code(&self) -> SafeFailureCode` | 只读 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(availability: FailureAvailability, code: SafeFailureCode) -> Self` | 无scope/ref/count/provenance |

不变量/禁止：不区分hidden与不存在。

### WorkspacePreferenceValues

位置：`crates/contracts/src/commands.rs`。能力：Stores presentation preferences only.

```rust
/// Stores presentation preferences only.
pub struct WorkspacePreferenceValues {
    /// Presentation order.
    order: LocalOrder,
    /// Whether visible muted items are included.
    show_muted: bool,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `order` | `LocalOrder` | 显式设置，初始StableIdentity |
| `show_muted` | `bool` | 显式设置，初始true |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn order(&self) -> LocalOrder` | 只读 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(order: LocalOrder, show_muted: bool) -> Self` | 有限字段，无任意map |

不变量/禁止：不含授权/业务优先级表达式。

### LocalDisposition

位置：`crates/contracts/src/commands.rs`。能力：Stores one item's local flags.

```rust
/// Stores one item's local flags.
pub struct LocalDisposition {
    /// Stable local item.
    item: InboxItemId,
    /// Local pin flag.
    pinned: bool,
    /// Local mute flag.
    muted: bool,
    /// Local hide flag.
    hidden: bool,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `item` | `InboxItemId` | 具名请求经解析 |
| `pinned` | `bool` | Set/Clear |
| `muted` | `bool` | Set/Clear |
| `hidden` | `bool` | Set/Clear |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn set(&mut self, flag: LocalFlag, value: SetFlag)` | 只改对应bool；全false可移除 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn empty(item: InboxItemId) -> Self` | flags=false，不授予可见性 |

不变量/禁止：不改变source attention lifecycle。

### QueryBinding

位置：`crates/contracts/src/queries.rs`。能力：Binds a local query selection.

```rust
/// Binds a local query selection.
pub struct QueryBinding {
    /// Query family.
    kind: QueryKind,
    /// Stable scope.
    scope: StableScopeKey,
    /// Requested selection.
    selection: ReadSelection,
    /// Presentation order.
    order: LocalOrder,
    /// Requested limit.
    limit: u32,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `kind` | `QueryKind` | 六Query方法唯一来源 |
| `scope` | `StableScopeKey` | resolver |
| `selection` | `ReadSelection` | 请求有限selection |
| `order` | `LocalOrder` | 请求或已读偏好，一经解析token固定 |
| `limit` | `u32` | 请求>0且不超预算，超限reject不silent clamp |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn digest(&self) -> SafeInputDigest` | Step8规范化规则 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(kind: QueryKind, scope: StableScopeKey, selection: ReadSelection, order: LocalOrder, limit: u32) -> Result<Self, ContractError>` | 结构校验，无授权效果 |

不变量/禁止：selection是上限非权限；page改变必须重新读。

### StablePagePosition

位置：`crates/contracts/src/queries.rs`。能力：Defines local deterministic pagination.

```rust
/// Defines local deterministic pagination.
pub struct StablePagePosition {
    /// Local pin group.
    pinned_group: u8,
    /// Stable visible tie breaker.
    item_key: InboxItemId,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `pinned_group` | `u8` | PinnedFirst时0/1；StableIdentity时0 |
| `item_key` | `InboxItemId` | 最后返回的安全可见attention key |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn compare(&self, other: &Self) -> std::cmp::Ordering` | tuple比较，不涉及source cursor |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(pinned_group: u8, item_key: InboxItemId) -> Result<Self, ContractError>` | group仅0/1 |

不变量/禁止：本地Inbox分页可用；通用source item分页排序slot未闭合则该分支blocked，不以Inbox id替代owner subject。

### RecoveryFailureBasis

位置：`crates/contracts/src/operations.rs`。能力：Records redacted recovery failure.

```rust
/// Records redacted recovery failure.
pub struct RecoveryFailureBasis {
    /// Safe failure code.
    code: RecoveryFailureCode,
    /// Invalidation reference.
    invalidation: Option<InvalidationId>,
    /// Gap reference.
    gap: Option<GapRef>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `code` | `RecoveryFailureCode` | 受控失败 |
| `invalidation` | `Option<InvalidationId>` | SafetyInvalidated时Some |
| `gap` | `Option<GapRef>` | SourceGap时Some |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ContractError>` | 校验code条件 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn new(code: RecoveryFailureCode, invalidation: Option<InvalidationId>, gap: Option<GapRef>) -> Result<Self, ContractError>` | 显式失败，不从timeout造撤销 |

不变量/禁止：与attempt状态同时保存。

## selection / intent / commit / page 枚举

这些enum归contracts的queries/commands/operations/views，相应state公共词汇仍local_refs；字段级payload均在本附录或明确外部slot登记。

### QueryKind

```rust
/// Selects a local read use case.
pub enum QueryKind {
    /// The View query.
    View,
    /// The Inbox query.
    Inbox,
    /// The LocalState query.
    LocalState,
    /// The OperationResult query.
    OperationResult,
    /// The RecoveryStatus query.
    RecoveryStatus,
    /// The Export query.
    Export,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `View` | The View query. | 具名方法固定，非路由推断 |
| `Inbox` | The Inbox query. | 具名方法固定，非路由推断 |
| `LocalState` | The LocalState query. | 具名方法固定，非路由推断 |
| `OperationResult` | The OperationResult query. | 具名方法固定，非路由推断 |
| `RecoveryStatus` | The RecoveryStatus query. | 具名方法固定，非路由推断 |
| `Export` | The Export query. | 具名方法固定，非路由推断 |

### ReadSelection

```rust
/// Specifies the requested read family.
pub enum ReadSelection {
    /// Selects unique source owners.
    Sources(Vec<SourceOwner>),
    /// Selects visible attention items.
    Inbox,
    /// Selects local preferences and intent.
    Local,
    /// Selects an operation result.
    Operation,
    /// Selects recovery status.
    Recovery,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Sources(Vec<SourceOwner>)` | Selects unique source owners. | 非空去重排序；非权限 |
| `Inbox` | Selects visible attention items. | Inbox查询 |
| `Local` | Selects local preferences and intent. | 局部读取 |
| `Operation` | Selects an operation result. | 结果读取 |
| `Recovery` | Selects recovery status. | 诊断读取 |

### ReadIntent

```rust
/// Changes local read intent.
pub enum ReadIntent {
    /// Advances to an owner-proven attention basis.
    Advance(AttentionReadBasis),
    /// Adds an explicit unread override.
    MarkUnread(InboxItemId),
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Advance(AttentionReadBasis)` | Advances to an owner-proven attention basis. | 004 blocked；单调，保留未读override |
| `MarkUnread(InboxItemId)` | Adds an explicit unread override. | 已解析item；不改变owner |

### LocalAttentionChange

```rust
/// Names every supported local change.
pub enum LocalAttentionChange {
    /// Changes explicit read intent.
    Read(ReadIntent),
    /// Sets one local flag for the specified item.
    SetDisposition { item: InboxItemId, flag: LocalFlag, value: SetFlag },
    /// Replaces controlled presentation preferences.
    SetPreference(WorkspacePreferenceValues),
    /// Sets or clears a resolved focus reference.
    SetFocus(Option<OwnerSubjectRef>),
    /// Sets or clears an explicit last-opened reference.
    SetLastOpened(Option<OwnerSubjectRef>),
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Read(ReadIntent)` | Changes explicit read intent. | 显式command |
| `SetDisposition { item: InboxItemId, flag: LocalFlag, value: SetFlag }` | Sets one local flag for the specified item. | 已解析item，非法引用reject |
| `SetPreference(WorkspacePreferenceValues)` | Replaces controlled presentation preferences. | 有限字段 |
| `SetFocus(Option<OwnerSubjectRef>)` | Sets or clears a resolved focus reference. | Some须现时可见，None清除 |
| `SetLastOpened(Option<OwnerSubjectRef>)` | Sets or clears an explicit last-opened reference. | 不得由Query调用 |

### LocalCommitBasis

```rust
/// Carries only the revision axes affected by a commit.
pub enum LocalCommitBasis {
    /// Binds a provisioned partition revision.
    Partition { version: PartitionVersion },
    /// Binds the local-intent commit.
    Local { partition: PartitionVersion, revision: LocalRevision },
    /// Binds a recovery commit.
    Recovery { partition: PartitionVersion, attempt: RebuildAttemptId, version: AttemptVersion, generation: GenerationId },
    /// Binds one partition invalidation effect.
    Invalidation { partition: PartitionVersion, invalidation: InvalidationId },
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Partition { version: PartitionVersion }` | Binds a provisioned partition revision. | Provision |
| `Local { partition: PartitionVersion, revision: LocalRevision }` | Binds the local-intent commit. | ChangeLocal |
| `Recovery { partition: PartitionVersion, attempt: RebuildAttemptId, version: AttemptVersion, generation: GenerationId }` | Binds a recovery commit. | Request/Advance/Supersede |
| `Invalidation { partition: PartitionVersion, invalidation: InvalidationId }` | Binds one partition invalidation effect. | Invalidate/SourceInvalidation |

### StoredWorkspaceResult

```rust
/// Stores immutable local operation outcomes.
pub enum StoredWorkspaceResult {
    /// Carries a committed partition identity.
    Provisioned { partition: WorkspacePartitionId, basis: LocalCommitBasis },
    /// Carries a committed local change.
    LocalChanged { partition: WorkspacePartitionId, basis: LocalCommitBasis },
    /// Carries a committed recovery outcome and conditional failure.
    Recovery { partition: WorkspacePartitionId, attempt: RebuildAttemptId, status: RebuildStatus, basis: LocalCommitBasis, failure: Option<RecoveryFailureBasis> },
    /// Carries a per-partition invalidation result.
    Invalidated { partition: WorkspacePartitionId, invalidation: InvalidationId, effect: InvalidationEffect, basis: LocalCommitBasis },
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Provisioned { partition: WorkspacePartitionId, basis: LocalCommitBasis }` | Carries a committed partition identity. | Provision原子结果 |
| `LocalChanged { partition: WorkspacePartitionId, basis: LocalCommitBasis }` | Carries a committed local change. | Change原子结果 |
| `Recovery { partition: WorkspacePartitionId, attempt: RebuildAttemptId, status: RebuildStatus, basis: LocalCommitBasis, failure: Option<RecoveryFailureBasis> }` | Carries a committed recovery outcome and conditional failure. | 四恢复相关操作；Blocked/Failed必须failure |
| `Invalidated { partition: WorkspacePartitionId, invalidation: InvalidationId, effect: InvalidationEffect, basis: LocalCommitBasis }` | Carries a per-partition invalidation result. | 无跨分区全局成功假象 |

### WorkspaceReadBasis

```rust
/// Separates durable and transient read contexts.
pub enum WorkspaceReadBasis {
    /// Carries one immutable materialized snapshot basis.
    Materialized { partition: WorkspacePartitionId, generation: GenerationId, view: ViewRevision, local: LocalReadBasis },
    /// Carries only owner read versions, not durable local revisions.
    Transient { source_versions: Vec<SourceVersionBasis> },
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Materialized { partition: WorkspacePartitionId, generation: GenerationId, view: ViewRevision, local: LocalReadBasis }` | Carries one immutable materialized snapshot basis. | store原子读取 |
| `Transient { source_versions: Vec<SourceVersionBasis> }` | Carries only owner read versions, not durable local revisions. | source只读结果，001blocked |

### InvalidationBasis

```rust
/// Separates owner invalidation from local maintenance.
pub enum InvalidationBasis {
    /// Carries the owner-owned invalidation proof.
    Owner(OwnerInvalidationBasis),
    /// Records authorized local freshness invalidation only.
    LocalDataStale,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Owner(OwnerInvalidationBasis)` | Carries the owner-owned invalidation proof. | 002/003 blocked |
| `LocalDataStale` | Records authorized local freshness invalidation only. | 显式Operations，不能产生SafetyBlocked |

### PagePosition

```rust
/// Carries a family-specific continuation position.
pub enum PagePosition {
    /// Carries the last visible local attention position.
    Inbox(StablePagePosition),
    /// Carries a formally defined owner-safe position.
    Source(OwnerReadPosition),
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Inbox(StablePagePosition)` | Carries the last visible local attention position. | Inbox稳定排序 |
| `Source(OwnerReadPosition)` | Carries a formally defined owner-safe position. | 001/006 blocked，不能用通用String |

## 外部slot补充与本批审计

OwnerReadPosition为001/006正式来源分页位置；SafeWorkspaceItem为001/003已裁剪内容schema；OwnerAttentionRelation为004比较/跨generation证明；这些仍是blocked slot，禁止伪造Rust定义。所有集合Vec显式定义empty语义：query source selection非空；数据items可空但需完整/partial证明；decision_refs非空且覆盖全部输出；invalidations集合空不证明当前权限有效。

字段/构造审计：本地ID/版本/enum/card有唯一归属；外部slot必须在其owner闭合；无泛型成功体。LocalCommitBasis与StoredWorkspaceResult的variant必须匹配operation，Recovery终态失败payload必须满足条件；未知提交不构造StoredWorkspaceResult，返回OutcomeUnknown并查权威记录。

回填摘要：共享类型按上述位置定义，Core只复用已核验字段与真实导出路径；外部slot不宣称schema闭合。本批gate=pass_with_external_slots，含slot对象正向实现仍blocked。

### ReadAvailability

```rust
/// Marks successfully constructed safe views.
pub enum ReadAvailability {
    /// A safe view can be returned.
    Available,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Available` | A safe view can be returned. | WorkspaceReadView唯一getter，无迁移 |

### ReadVisibilityPosture

```rust
/// Marks output restricted by owning decisions.
pub enum ReadVisibilityPosture {
    /// All emitted fields belong to the currently allowed subset.
    AllowedSubset,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `AllowedSubset` | All emitted fields belong to the currently allowed subset. | 不表示拥有全部来源权限 |


AttentionStreamRef补登记：WS-UP-004 owning attention稳定流身份，不能与SourceStreamRef互换；基数、canonical identity与关系未闭合，含该slot正向实现blocked。
Core补核验：metadata.rs QueryConsistency实际只有Eventual/Strong，QueryMetadata.consistency是额外字段；workspace首版只接受Eventual，拒其他值不静默降级。CommandMetadata.reason/external_ref首版None，RequestMetadata.requested_at仅追踪，非游标/权威新鲜度。ActorContext.delegated_by若Some须正式委托链可核验，否则fail-closed；role_refs永远仅hint。

## 只读成员访问闭口（Step9回源审查）

按每个对象字段表展开只读访问。已有同名成员沿用对象卡的签名；下表补其余字段，不重复定义。service/entry的DI依赖不公开getter，不能借此穿透Query能力隔离。每个下列函数rustdoc为`/// Returns the immutable field value.`；不提供可写借用，不替代可信工厂。

| 对象 | 完整只读签名 | 约束 |
|---|---|---|
| WorkspacePartitionId | `pub fn bytes(&self) -> &[u8; 16]` | 只读；实现按显式导出，非授权能力 |
| GenerationId | `pub fn bytes(&self) -> &[u8; 16]` | 只读；实现按显式导出，非授权能力 |
| RebuildAttemptId | `pub fn bytes(&self) -> &[u8; 16]` | 只读；实现按显式导出，非授权能力 |
| InvalidationId | `pub fn bytes(&self) -> &[u8; 16]` | 只读；实现按显式导出，非授权能力 |
| WorkspaceOperationRef | `pub fn bytes(&self) -> &[u8; 16]` | 只读；实现按显式导出，非授权能力 |
| ApplicationResultRef | `pub fn bytes(&self) -> &[u8; 16]` | 只读；实现按显式导出，非授权能力 |
| GapRef | `pub fn bytes(&self) -> &[u8; 16]` | 只读；实现按显式导出，非授权能力 |
| CommitAttemptId | `pub fn bytes(&self) -> &[u8; 16]` | 只读；实现按显式导出，非授权能力 |
| SafeInputDigest | `pub fn sha256(&self) -> &[u8; 32]` | 只读；实现按显式导出，非授权能力 |
| InboxItemId | `pub fn digest(&self) -> &[u8; 32]` | 只读；实现按显式导出，非授权能力 |
| StableScopeKey | `pub fn kind(&self) -> &ScopeKind` | 只读；实现按显式导出，非授权能力 |
| StableScopeKey | `pub fn anchor(&self) -> &OwnerScopeRef` | 只读；实现按显式导出，非授权能力 |
| WorkspaceOperationKey | `pub fn actor_id(&self) -> &ActorId` | 只读；实现按显式导出，非授权能力 |
| WorkspaceOperationKey | `pub fn scope(&self) -> &StableScopeKey` | 只读；实现按显式导出，非授权能力 |
| WorkspaceOperationKey | `pub fn channel(&self) -> &OperationChannel` | 只读；实现按显式导出，非授权能力 |
| WorkspaceOperationKey | `pub fn kind(&self) -> &OperationKind` | 只读；实现按显式导出，非授权能力 |
| WorkspaceOperationKey | `pub fn key(&self) -> &IdempotencyKey` | 只读；实现按显式导出，非授权能力 |
| SourceApplicationKey | `pub fn owner(&self) -> &SourceOwner` | 只读；实现按显式导出，非授权能力 |
| SourceApplicationKey | `pub fn stream(&self) -> &SourceStreamRef` | 只读；实现按显式导出，非授权能力 |
| SourceApplicationKey | `pub fn event(&self) -> &SourceEventIdentity` | 只读；实现按显式导出，非授权能力 |
| SourceApplicationKey | `pub fn partition(&self) -> &WorkspacePartitionId` | 只读；实现按显式导出，非授权能力 |
| SourceApplicationKey | `pub fn generation(&self) -> &GenerationId` | 只读；实现按显式导出，非授权能力 |
| SafeReadFailure | `pub fn availability(&self) -> &FailureAvailability` | 只读；实现按显式导出，非授权能力 |
| WorkspacePreferenceValues | `pub fn show_muted(&self) -> &bool` | 只读；实现按显式导出，非授权能力 |
| LocalDisposition | `pub fn item(&self) -> &InboxItemId` | 只读；实现按显式导出，非授权能力 |
| LocalDisposition | `pub fn pinned(&self) -> &bool` | 只读；实现按显式导出，非授权能力 |
| LocalDisposition | `pub fn muted(&self) -> &bool` | 只读；实现按显式导出，非授权能力 |
| LocalDisposition | `pub fn hidden(&self) -> &bool` | 只读；实现按显式导出，非授权能力 |
| QueryBinding | `pub fn kind(&self) -> &QueryKind` | 只读；实现按显式导出，非授权能力 |
| QueryBinding | `pub fn scope(&self) -> &StableScopeKey` | 只读；实现按显式导出，非授权能力 |
| QueryBinding | `pub fn selection(&self) -> &ReadSelection` | 只读；实现按显式导出，非授权能力 |
| QueryBinding | `pub fn order(&self) -> &LocalOrder` | 只读；实现按显式导出，非授权能力 |
| QueryBinding | `pub fn limit(&self) -> &u32` | 只读；实现按显式导出，非授权能力 |
| StablePagePosition | `pub fn pinned_group(&self) -> &u8` | 只读；实现按显式导出，非授权能力 |
| StablePagePosition | `pub fn item_key(&self) -> &InboxItemId` | 只读；实现按显式导出，非授权能力 |
| RecoveryFailureBasis | `pub fn code(&self) -> &RecoveryFailureCode` | 只读；实现按显式导出，非授权能力 |
| RecoveryFailureBasis | `pub fn invalidation(&self) -> &Option<InvalidationId>` | 只读；实现按显式导出，非授权能力 |
| RecoveryFailureBasis | `pub fn gap(&self) -> &Option<GapRef>` | 只读；实现按显式导出，非授权能力 |
