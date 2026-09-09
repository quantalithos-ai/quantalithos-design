# Step 8. 十四入口协议契约

## 1. Step状态

状态：[x] completed；gate_status=pass_with_external_slots；前序已完成；formal_fill_allowed=false；仅设计，最多到Step10。

## 2. 输入

02 §7/8、Step5/6/7；SOP Step8全条、书写§5.7；governance Step8 shared envelope/Query/consumer receipt/job result粒度。

## 3. SOP问题回答

1~4：两Command、六Query、两Consumer、四Operations，API内部typed调用；不新建HTTP或bus topic。5~10：按四族逐DTO/字段来源/构造与错误闭合。11~18：public secondary types、页、结果/receipt独立定义，不从domain透传。19~23：actor从认证宿主；source例外需正式envelope；每族与总审计后进入Step9。

## 4. 诊断

Query不只返回projection类型名；unknown需要独立结果，consumer不是bool ACK；物化/Transient分轴，安全拒绝不返回scope/ref/count。所有上游schema缺口保留具名blocked slot，禁止复制JSON成功体。

## 5. 前后对比

此前语义/对象轮廓→本步具名合同；保留上游slot blocker，不把本地设计通过当正向集成闭合。

## 6. 取舍

逐模块/协议族/入口/状态主语小循环，先依据/问题/诊断/取舍，再合同与自检；不照搬governance业务对象。

## 7. 结构化产物

### 7.1 共享协议纪律与批次

| 批次 | 协议 | owner模块 | 顺序/门禁 |
|---|---|---|---|
| 8A | metadata、错误、ID/digest、公共结果 | contracts | 先于所有DTO |
| 8B | 两Command | api→application | 单协议字段/构造后族审查 |
| 8C | 六Query | api→只读application | read/page/marker schema先闭口 |
| 8D | 两Consumer | worker | envelope/source slot与receipt分开 |
| 8E | 四Operations | jobs | 一次有界调用与stored result |
| 8F | 跨协议审计 | 本Step | fourteen-to-fourteen覆盖 |

所有公开DTO定义在contracts对应文件，**不依赖domain/application类型**；Step6局部词汇复用。下列含owner slot的片段为blocked design contract，不独立可编译；不是借schema标签宣布上游合同完整。DTO字段public只表示可反序列化原始请求，不能据此取得trusted资格。无HTTP/RPC/server新增；外部宿主映射、topic/schema版本WS-UP-002/006明确blocked，内部函数名称见Step7。

| 元数据项 | 唯一来源 | 校验 / 缺失 |
|---|---|---|
| actor | handler独立ActorContext参数，认证宿主/consumer transport | 不接收请求body actor/role truth；ActorKind不自动授权 |
| request_id/trace_id | Core RequestMetadata，CommandMetadata/QueryMetadata实际嵌套成员 | 非空按Core规则；不入语义digest，不输出stack/raw body |
| idempotency_key | Command/Operations metadata.request唯一字段 | 写必Some；Query必None；consumer正式event identity派生，不额外body key |
| page | 本地WorkspacePageRequest唯一字段 | QueryMetadata.page必须None；不得两路覆盖 |
| channel/kind | 具名入口固定 | 不由客户端指定；source invalidation独立namespace |
| Core QueryMetadata.consistency | 仅接受QueryConsistency::Eventual；Strong在读前Unsupported→InvalidRequest | 本地page/mode不另声明strong；freshness始终显式，不保证跨域线性一致 |
| Core CommandMetadata.reason/external_ref | 首版要求None | 不默默接纳未设计的正文/外部ref；未来需要先校准schema |
| time | Core requested_at只追踪，不进digest；若owner proof需要则owner validity正式字段 | 不用本地wall-clock推cursor/version；当前不新增business timestamp |

### 7.2 ID、digest与安全错误

局部UUID wire采用Step6规范。版本wire整数非负u64且不得浮点；内部初始0不是已提交事实。InboxItemId按SHA256固定32字节，wire小写64hex；相同partition与owner canonical attention identity跨generation稳定。外部canonical attention bytes未闭合004，不能以title/source timestamp替代。

SafeInputDigest：SHA-256，输入为固定ASCII域分隔`workspace.operation.v1`+逐字段length-prefix编码。长度u32大端，整数u64大端，bool单字节0/1，enum tag使用本地名称UTF-8并length-prefix，None=0/Some=1+payload；Vec以u32长度后按字段顺序编码；本地集合按声明唯一key排序，禁止重复；String不做隐式trim/大小写转换。顺序为kind、channel、ActorId原始规范值、StableScopeKey(kind/正式anchor canonical bytes)、请求其余全部业务字段（含expected/budget/target/selector中影响行为部分），不含幂等键/trace/request_id/时间/随机结果ID/临时resolution proof。每DTO下表字段按声明顺序编码；上游ref/basis必须有owner正式canonical codec，没有即ContractBlocked，不用Debug/JSON stringification。源digest域为`workspace.source.v1`，owner+stream+event+schema+正式payload/版本/cursor canonical bytes；target partition/generation在application key并绑定digest域后缀，delivery retry信息不入digest。

| ApplicationError | 公共code / availability | 规则 |
|---|---|---|
| InvalidInput | InvalidRequest / Blocked | 不回显原字段值 |
| ScopeUnavailable/VisibilityUnavailable/NotFound/SafetyBlocked | NotAvailable / Blocked | scope未获准时不能区分存在/撤销/禁用 |
| ContractBlocked | ContractBlocked / Blocked | 仅scope可公开后可区分；否则NotAvailable |
| SourceUnavailable/StorageUnavailable | SourceUnavailable / Unavailable | 仅允许安全语境；无替代success |
| Conflict | Conflict / Blocked | 不输出冲突主体/旧raw内容 |
| CursorInvalid | CursorInvalid / Blocked | malformed/tampered/expired/旧轴统一分类 |
| OutcomeUnknown | OutcomeUnknown / Unavailable | 不声称失败回滚；同key/显式结果读取 |
| InvariantViolation | NotAvailable / Blocked | 内部诊断不外泄 |

SafeReadFailure字段沿6A：安全code、availability（fail-closed是行为不变量，不新增字段）；所有非成功外层不得携scope/ref/count/provenance。成功write receipt字段也要现时scope可公开；已提交后授权失效仅返回safe失败，不撤销已发生事实。

### WriteDelivery

```rust
/// Classifies replay of an immutable local result.
pub enum WriteDelivery {
    /// Returns a newly committed result.
    Committed,
    /// Returns the same stored result.
    Duplicate,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Committed` | Returns a newly committed result. | atomic commit确认 |
| `Duplicate` | Returns the same stored result. | 同key同digest；不重新运行 |

### WorkspaceWriteResult

位置：`crates/contracts/src/views.rs`。能力：Returns one authorized committed local outcome.

```rust
/// Returns one authorized committed local outcome.
pub struct WorkspaceWriteResult {
    /// Result delivery classification.
    delivery: WriteDelivery,
    /// Immutable result reference.
    operation_ref: WorkspaceOperationRef,
    /// Exact stored local outcome.
    result: StoredWorkspaceResult,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `delivery` | `WriteDelivery` | 新提交/重复读取；非业务状态 |
| `operation_ref` | `WorkspaceOperationRef` | 同事务stored record |
| `result` | `StoredWorkspaceResult` | 6A完整variants；现时裁剪只允许安全结果 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self) -> Result<(), ContractError>` | result与操作种类/partition/basis一致 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn try_new(delivery: WriteDelivery, operation_ref: WorkspaceOperationRef, result: StoredWorkspaceResult) -> Result<Self, ContractError>` | 只有提交确认或stored回读；禁止预期成功 |

不变量/禁止：不携run_id、report、evidence/signoff；Unknown走外层safe失败，不能伪造result_ref。

### 7.3 Command批次与独立协议

| 协议 | 对象 | ports | flow |
|---|---|---|---|
| ProvisionWorkspacePartition | WorkspacePartition/OperationRecord | scope/find_partition/operation/provision | Step9同名 |
| ChangeWorkspaceLocalState | LocalAttentionState/ReadCursor/OperationRecord | scope/attention/snapshot/change_local | Step9同名 |

问题：Provision没有partition id如何幂等？稳定actor+scope可先lookup。Change如何清focus且旧ref已不可见？None是本地清除，无需读取旧内容，但scope操作权限仍必需。取舍：request不包含生成ID、可信proof或actor，expected_local显式Absent/Present，版本不得强制覆盖。

#### ProvisionWorkspacePartition

用途：显式创建当前actor稳定scope的局部分区，不自动生成current projection/overlay。

签名：`pub async fn CommandHandlers::provision(&self, actor: ActorContext, metadata: CommandMetadata, request: ProvisionWorkspacePartitionRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>`；处理方PartitionService同名方法；传输为内部typed library，外部route未绑定。

```rust
/// Defines the ProvisionWorkspacePartitionRequest contract.
pub struct ProvisionWorkspacePartitionRequest {
    /// Explicit scope value.
    pub scope: ScopeSelector,
}
```

归属：`crates/contracts/src/commands.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `scope` | `ScopeSelector` | 正式scope选择→resolver→WorkspacePartition.scope；必填 |

响应：WorkspaceWriteResult，成功/重复都必须具有原result；语义结果仅Provisioned，partition/basis来自原子提交。

构造闭环：scope resolver→WorkspaceScope；IdPort.partition→id；actor→principal；WorkspacePartition.provision产生None current/version0；store.provision原子unique、version1、operation record。已有同stable key但新幂等键不得创建第二partition，返回Conflict；调用方可只读lookup后明确使用已存在对象。

错误/幂等：校验错InvalidRequest，owner缺失/不允许NotAvailable或ContractBlocked，expected/key异digest Conflict，commit unknown OutcomeUnknown；metadata缺key在写前拒绝。同key同digest重读stored并现时裁剪，不重复构造业务对象。审计仅安全operation kind/outcome/trace，不存业务body。单协议自检：字段均可回指6B工厂/7读取与提交；无生成ID请求/隐式写。

#### ChangeWorkspaceLocalState

用途：显式修改本地意图/偏好，不写来源receipt或领域状态。

签名：`pub async fn CommandHandlers::change_local(&self, actor: ActorContext, metadata: CommandMetadata, request: ChangeWorkspaceLocalStateRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>`；处理方LocalAttentionService同名方法；传输为内部typed library，外部route未绑定。

```rust
/// Defines the ChangeWorkspaceLocalStateRequest contract.
pub struct ChangeWorkspaceLocalStateRequest {
    /// Explicit scope value.
    pub scope: ScopeSelector,
    /// Explicit partition value.
    pub partition: WorkspacePartitionId,
    /// Explicit expected local value.
    pub expected_local: LocalReadBasis,
    /// Explicit change value.
    pub change: LocalAttentionChange,
}
```

归属：`crates/contracts/src/commands.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `scope` | `ScopeSelector` | 正式scope解析；必填 |
| `partition` | `WorkspacePartitionId` | 已有partition，必须匹配principal/stable scope |
| `expected_local` | `LocalReadBasis` | Absent首次显式创建；Present CAS版本，不可缺省 |
| `change` | `LocalAttentionChange` | 6A五变体，目标及正式attention resolution必需 |

响应：WorkspaceWriteResult，成功/重复都必须具有原result；语义结果仅LocalChanged，basis local revision来自本次显式commit。

构造闭环：snapshot.local=Some读取旧值/版本；None且expected Absent才initialize；attention/visibility正式解析→LocalChangeResolution；change与expected→LocalAttentionState.change；store CAS保存local+record。SetDisposition(Read等)不得靠item ID猜stream；SetFocus/LastOpened(Some)必须现时subject binding；SetPreference不需attention证明。

错误/幂等：校验错InvalidRequest，owner缺失/不允许NotAvailable或ContractBlocked，expected/key异digest Conflict，commit unknown OutcomeUnknown；metadata缺key在写前拒绝。同key同digest重读stored并现时裁剪，不重复构造业务对象。审计仅安全operation kind/outcome/trace，不存业务body。单协议自检：字段均可回指6B工厂/7读取与提交；无生成ID请求/隐式写。

Command族停审：两用例独立签名/DTO/错误/构造/结果齐全；owner slots阻塞相应正向语义；没有新增Command。gate=pass_with_external_slots。


### 7.4 Query批次：公共视图先闭口

输入6B WorkspaceReadView/WorkspacePageCursor、7 snapshot与owner ports。问题：直接返回domain对象会泄露内部proof与跨层依赖，透明cursor会泄露被撤销ref。取舍：contracts独立DTO白名单；只有授权成功的字段可输出；scope空/hidden统一外层失败，不返回伪空成功；同快照先裁剪再排序/分页，不用total_count暴露隐藏量。

| Query | 目标 / 依赖 | 输出 |
|---|---|---|
| GetWorkspaceView | SourceSlice / snapshot / visibility | WorkspaceViewResponse |
| ListWorkspaceInbox | InboxItem + 当前local意图 / attention relation | WorkspaceInboxResponse |
| GetWorkspaceLocalState | 只读LocalAttentionState / subject裁剪 | WorkspaceLocalStateResponse |
| GetWorkspaceOperationResult | immutable record / current scope裁剪 | WorkspaceOperationResponse |
| GetWorkspaceRecoveryStatus | recovery_snapshot / current visibility | WorkspaceRecoveryResponse |
| ExportWorkspaceReadModel | view的相同读面 / no handoff | WorkspaceExportResponse |

```rust
/// Defines the WorkspacePageToken contract.
pub struct WorkspacePageToken {
    /// Explicit encoded value.
    pub encoded: String,
}
```

归属：`crates/contracts/src/queries.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `encoded` | `String` | 仅本地codec产出；原始输入必须base64url无padding、非空、有界；解码/完整性失败CursorInvalid |

```rust
/// Defines the WorkspacePageRequest contract.
pub struct WorkspacePageRequest {
    /// Explicit limit value.
    pub limit: u32,
    /// Explicit after value.
    pub after: Option<WorkspacePageToken>,
}
```

归属：`crates/contracts/src/queries.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `limit` | `u32` | 必填>0，不超配置硬上限；不silent clamp |
| `after` | `Option<WorkspacePageToken>` | None首屏；Some必须同scope/actor/selection/版本/visibility，不能当前重新定位续页 |

```rust
/// Defines the WorkspacePageInfo contract.
pub struct WorkspacePageInfo {
    /// Explicit returned value.
    pub returned: u32,
    /// Explicit next value.
    pub next: Option<WorkspacePageToken>,
}
```

归属：`crates/contracts/src/views.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `returned` | `u32` | 等于实际安全items.len，不含隐藏/总量 |
| `next` | `Option<WorkspacePageToken>` | 仅确认还有允许可见内容且同快照时Some；None非全域Complete证明 |

token wire设计：`schema_version:u16`（首版1）、`key_id:u32`、`nonce:[u8;12]`、`ciphertext:Vec<u8>`、`tag:[u8;16]`按固定顺序组合后base64url；AES-256-GCM认证加密，AAD固定`workspace.page.v1`和头字段。plaintext为Step6 WorkspacePageCursor全部字段（principal/partition/generation/view/local/query/visibility/position），固定codec版本与逐字段length-prefix；owner位置codec未闭合则该页模式blocked。nonce由密码学随机源产生而非业务IdPort；key注入codec，过期/撤销key仅拒旧token，不开查询写入。密钥轮转/限长/依赖pin由Step14闭合，当前不声称具体库已选/实施可用。QueryBinding.digest使用独立域`workspace.query.v1`及其5字段，limit/order/selection均绑定；after token本身不递归进入binding。

```rust
/// Defines the WorkspaceViewResponse contract.
pub struct WorkspaceViewResponse {
    /// Explicit scope value.
    pub scope: OwnerScopeRef,
    /// Explicit basis value.
    pub basis: WorkspaceReadBasis,
    /// Explicit availability value.
    pub availability: ReadAvailability,
    /// Explicit visibility value.
    pub visibility: ReadVisibilityPosture,
    /// Explicit freshness value.
    pub freshness: DataFreshness,
    /// Explicit coverage value.
    pub coverage: ReadCoverage,
    /// Explicit items value.
    pub items: Vec<SafeWorkspaceItem>,
    /// Explicit provenance value.
    pub provenance: Vec<SafeProvenance>,
    /// Explicit page value.
    pub page: WorkspacePageInfo,
}
```

归属：`crates/contracts/src/views.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `scope` | `OwnerScopeRef` | 005正式可公开scope ref，不输出resolution proof |
| `basis` | `WorkspaceReadBasis` | 6A Materialized/Transient二分，非伪统一revision |
| `availability` | `ReadAvailability` | 固定Available |
| `visibility` | `ReadVisibilityPosture` | 固定AllowedSubset |
| `freshness` | `DataFreshness` | Fresh仅当前owner水位可证；DataStale强制Stale；无法比较Unknown |
| `coverage` | `ReadCoverage` | 仅允许selection的完整性；隐藏域数量不算partial提示 |
| `items` | `Vec<SafeWorkspaceItem>` | 001/003 owning safe schema；先裁剪，可空 |
| `provenance` | `Vec<SafeProvenance>` | 同决定裁剪；不回source隐藏列表 |
| `page` | `WorkspacePageInfo` | 物化按安全位置；Transient next必须None |

```rust
/// Defines the WorkspaceInboxItemView contract.
pub struct WorkspaceInboxItemView {
    /// Explicit item id value.
    pub item_id: InboxItemId,
    /// Explicit subject value.
    pub subject: OwnerSubjectRef,
    /// Explicit attention value.
    pub attention: OwnerAttentionRef,
    /// Explicit state value.
    pub state: AttentionState,
    /// Explicit read value.
    pub read: ReadClassification,
    /// Explicit pinned value.
    pub pinned: bool,
    /// Explicit muted value.
    pub muted: bool,
    /// Explicit hidden value.
    pub hidden: bool,
}
```

归属：`crates/contracts/src/views.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `item_id` | `InboxItemId` | 已裁剪InboxItem稳定local key |
| `subject` | `OwnerSubjectRef` | 现时可见正式ref；非正文 |
| `attention` | `OwnerAttentionRef` | 004正式可公开attention ref |
| `state` | `AttentionState` | domain映射；首版列表仅Present |
| `read` | `ReadClassification` | 本地意图+正式relation→Read/Unread/Unknown |
| `pinned` | `bool` | 匹配local disposition；不存在false |
| `muted` | `bool` | 同上；只展示 |
| `hidden` | `bool` | 同上；include_hidden_local=false时不返回hidden项 |

```rust
/// Defines the WorkspaceInboxResponse contract.
pub struct WorkspaceInboxResponse {
    /// Explicit scope value.
    pub scope: OwnerScopeRef,
    /// Explicit basis value.
    pub basis: WorkspaceReadBasis,
    /// Explicit availability value.
    pub availability: ReadAvailability,
    /// Explicit visibility value.
    pub visibility: ReadVisibilityPosture,
    /// Explicit freshness value.
    pub freshness: DataFreshness,
    /// Explicit coverage value.
    pub coverage: ReadCoverage,
    /// Explicit items value.
    pub items: Vec<WorkspaceInboxItemView>,
    /// Explicit provenance value.
    pub provenance: Vec<SafeProvenance>,
    /// Explicit page value.
    pub page: WorkspacePageInfo,
}
```

归属：`crates/contracts/src/views.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `scope` | `OwnerScopeRef` | 005正式可公开scope ref，不输出resolution proof |
| `basis` | `WorkspaceReadBasis` | 6A Materialized/Transient二分，非伪统一revision |
| `availability` | `ReadAvailability` | 固定Available |
| `visibility` | `ReadVisibilityPosture` | 固定AllowedSubset |
| `freshness` | `DataFreshness` | Fresh仅当前owner水位可证；DataStale强制Stale；无法比较Unknown |
| `coverage` | `ReadCoverage` | 仅允许selection的完整性；隐藏域数量不算partial提示 |
| `items` | `Vec<WorkspaceInboxItemView>` | 先现时visibility再过滤本地hidden/muted偏好与排序，不泄露排除量 |
| `provenance` | `Vec<SafeProvenance>` | 仅返回项相关，正式safe字段 |
| `page` | `WorkspacePageInfo` | Inbox稳定(pin group,item key)；变化拒旧页 |

### LocalStateSurface

```rust
/// Separates absent local state from a safe existing overlay.
pub enum LocalStateSurface {
    /// No local overlay has been committed.
    Absent,
    /// Carries the current safe local state view.
    Present(WorkspaceLocalStateView),
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Absent` | No local overlay has been committed. | 允许scope查询后可返回；不能initialize |
| `Present(WorkspaceLocalStateView)` | Carries the current safe local state view. | 现时裁剪；非raw domain |

```rust
/// Defines the WorkspaceReadIntentView contract.
pub struct WorkspaceReadIntentView {
    /// Explicit stream value.
    pub stream: AttentionStreamRef,
    /// Explicit basis value.
    pub basis: Option<AttentionReadBasis>,
    /// Explicit unread overrides value.
    pub unread_overrides: Vec<InboxItemId>,
}
```

归属：`crates/contracts/src/views.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `stream` | `AttentionStreamRef` | 正式004安全可公开流；如不能证实则整条省略 |
| `basis` | `Option<AttentionReadBasis>` | None未设置，不猜cursor |
| `unread_overrides` | `Vec<InboxItemId>` | 只当前可见稳定item；hidden不计数 |

```rust
/// Defines the WorkspaceLocalStateView contract.
pub struct WorkspaceLocalStateView {
    /// Explicit partition value.
    pub partition: WorkspacePartitionId,
    /// Explicit revision value.
    pub revision: LocalRevision,
    /// Explicit preferences value.
    pub preferences: WorkspacePreferenceValues,
    /// Explicit reads value.
    pub reads: Vec<WorkspaceReadIntentView>,
    /// Explicit dispositions value.
    pub dispositions: Vec<LocalDisposition>,
    /// Explicit focus value.
    pub focus: Option<OwnerSubjectRef>,
    /// Explicit last opened value.
    pub last_opened: Option<OwnerSubjectRef>,
}
```

归属：`crates/contracts/src/views.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `partition` | `WorkspacePartitionId` | 授权分区 |
| `revision` | `LocalRevision` | 同snapshot |
| `preferences` | `WorkspacePreferenceValues` | 有限本地偏好 |
| `reads` | `Vec<WorkspaceReadIntentView>` | 逐stream安全裁剪 |
| `dispositions` | `Vec<LocalDisposition>` | 6A public carrier；只当前可见item |
| `focus` | `Option<OwnerSubjectRef>` | None可以未设置或被裁剪，不另给原因/计数 |
| `last_opened` | `Option<OwnerSubjectRef>` | 相同规则，GET不更新 |

```rust
/// Defines the WorkspaceLocalStateResponse contract.
pub struct WorkspaceLocalStateResponse {
    /// Explicit scope value.
    pub scope: OwnerScopeRef,
    /// Explicit state value.
    pub state: LocalStateSurface,
}
```

归属：`crates/contracts/src/views.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `scope` | `OwnerScopeRef` | 正式可公开scope |
| `state` | `LocalStateSurface` | Absent或Present；即使Absent也必须先resolver/list授权 |

```rust
/// Defines the WorkspaceOperationResponse contract.
pub struct WorkspaceOperationResponse {
    /// Explicit operation ref value.
    pub operation_ref: WorkspaceOperationRef,
    /// Explicit result value.
    pub result: StoredWorkspaceResult,
}
```

归属：`crates/contracts/src/views.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `operation_ref` | `WorkspaceOperationRef` | lookup已授权记录 |
| `result` | `StoredWorkspaceResult` | 6A精确typed result；如含任何不可公开ref则整体NotAvailable，不改写历史结果 |

```rust
/// Defines the WorkspaceRecoveryResponse contract.
pub struct WorkspaceRecoveryResponse {
    /// Explicit partition value.
    pub partition: WorkspacePartitionId,
    /// Explicit attempt value.
    pub attempt: RebuildAttemptId,
    /// Explicit version value.
    pub version: AttemptVersion,
    /// Explicit status value.
    pub status: RebuildStatus,
    /// Explicit candidate value.
    pub candidate: GenerationId,
    /// Explicit role value.
    pub role: GenerationRole,
    /// Explicit safety value.
    pub safety: GenerationSafetyState,
    /// Explicit current value.
    pub current: Option<GenerationId>,
    /// Explicit failure value.
    pub failure: Option<RecoveryFailureBasis>,
    /// Explicit replacement value.
    pub replacement: Option<RebuildAttemptId>,
}
```

归属：`crates/contracts/src/views.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `partition` | `WorkspacePartitionId` | 已授权分区 |
| `attempt` | `RebuildAttemptId` | 请求对应尝试 |
| `version` | `AttemptVersion` | same snapshot |
| `status` | `RebuildStatus` | 真实已提交状态，非worker瞬时进度 |
| `candidate` | `GenerationId` | 该attempt候选 |
| `role` | `GenerationRole` | candidate实体role，Completed后可Current/Retired |
| `safety` | `GenerationSafetyState` | candidate当前safety，非authorize |
| `current` | `Option<GenerationId>` | partition current，None尚未切换 |
| `failure` | `Option<RecoveryFailureBasis>` | Blocked/Failed必须Some，安全code；不输出owner raw proof |
| `replacement` | `Option<RebuildAttemptId>` | Superseded必Some；其他None；target可公开才返回 |

```rust
/// Defines the WorkspaceExportResponse contract.
pub struct WorkspaceExportResponse {
    /// Explicit read model value.
    pub read_model: WorkspaceViewResponse,
    /// Explicit schema version value.
    pub schema_version: u16,
}
```

归属：`crates/contracts/src/views.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `read_model` | `WorkspaceViewResponse` | 同一安全读合同，非snapshot artifact |
| `schema_version` | `u16` | 本地read DTO schema=1，不是source schema/归档版本 |

公开schema传递审查：ReadIntentView等owner ref/basis仍是明确004 slot；SafeWorkspaceItem/Provenance仍001/003，不能据Vec存在就称schema完整。contracts中WorkspaceLocalStateView与domain LocalAttentionState是显式映射，不引用domain类型。

#### GetWorkspaceView

签名：`pub async fn QueryHandlers::get_view(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceViewRequest) -> Result<WorkspaceViewResponse, SafeReadFailure>`。WorkspaceQueryService同名；内部library，无HTTP route。响应schema为本族WorkspaceViewResponse独立定义；不返回domain实体。

```rust
/// Defines the GetWorkspaceViewRequest contract.
pub struct GetWorkspaceViewRequest {
    /// Explicit scope value.
    pub scope: ScopeSelector,
    /// Explicit mode value.
    pub mode: ReadMode,
    /// Explicit selection value.
    pub selection: ReadSelection,
    /// Explicit page value.
    pub page: WorkspacePageRequest,
}
```

归属：`crates/contracts/src/queries.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `scope` | `ScopeSelector` | 正式解析 |
| `mode` | `ReadMode` | 显式Materialized/Transient，不自动fallback |
| `selection` | `ReadSelection` | 只Sources非空去重；其他WrongKind |
| `page` | `WorkspacePageRequest` | Transient after必须None；limit显式 |

字段→对象/port构造闭环：resolver→find_partition/snapshot（Materialized）或OwnerReadPort.read（Transient）→逐slice bind+revalidate→WorkspaceReadInputs/WorkspaceReadView.compose→安全DTO。物化无current/安全blocked无view；Transient不读取/创建overlay，不生成durable token；source-general排序/页位置合同未闭合001/006则对应正向分页blocked。

错误：统一§7.2；metadata.page/idem非None先InvalidRequest；当前无法证实visibility整体fail-closed；分页绑定任何轴变化CursorInvalid，不能silent重新开始。没有幂等写记录/审计落库/刷新副作用；只允许安全技术日志。单Query自检：完整响应字段已列，no-write，缺失和degraded口径可测。

#### ListWorkspaceInbox

签名：`pub async fn QueryHandlers::list_inbox(&self, actor: ActorContext, metadata: QueryMetadata, request: ListWorkspaceInboxRequest) -> Result<WorkspaceInboxResponse, SafeReadFailure>`。WorkspaceQueryService同名；内部library，无HTTP route。响应schema为本族WorkspaceInboxResponse独立定义；不返回domain实体。

```rust
/// Defines the ListWorkspaceInboxRequest contract.
pub struct ListWorkspaceInboxRequest {
    /// Explicit scope value.
    pub scope: ScopeSelector,
    /// Explicit page value.
    pub page: WorkspacePageRequest,
    /// Explicit order value.
    pub order: LocalOrder,
}
```

归属：`crates/contracts/src/queries.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `scope` | `ScopeSelector` | 正式解析 |
| `page` | `WorkspacePageRequest` | 仅Materialized，limit必填 |
| `order` | `LocalOrder` | 显式StableIdentity/PinnedFirst，绑定token |

字段→对象/port构造闭环：resolver→find_partition/snapshot→VisibilityPort.resolve(Inbox)→逐item当前binding→AttentionResolverPort.relate与ReadCursor.classify→本地hidden/filter/pin排序→WorkspacePageCursor→codec→Inbox DTO。无local时默认偏好/Unknown只用于内存显示，不initialize；Withdrawn不显示，intent保留。

错误：统一§7.2；metadata.page/idem非None先InvalidRequest；当前无法证实visibility整体fail-closed；分页绑定任何轴变化CursorInvalid，不能silent重新开始。没有幂等写记录/审计落库/刷新副作用；只允许安全技术日志。单Query自检：完整响应字段已列，no-write，缺失和degraded口径可测。

#### GetWorkspaceLocalState

签名：`pub async fn QueryHandlers::get_local_state(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceLocalStateRequest) -> Result<WorkspaceLocalStateResponse, SafeReadFailure>`。WorkspaceQueryService同名；内部library，无HTTP route。响应schema为本族WorkspaceLocalStateResponse独立定义；不返回domain实体。

```rust
/// Defines the GetWorkspaceLocalStateRequest contract.
pub struct GetWorkspaceLocalStateRequest {
    /// Explicit scope value.
    pub scope: ScopeSelector,
}
```

归属：`crates/contracts/src/queries.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `scope` | `ScopeSelector` | 正式解析，无分区可返回Absent，不能建立 |

字段→对象/port构造闭环：resolver→find_partition/snapshot→Local权限检查→Absent或local有限字段映射；逐focus/last-opened/attention ref当前裁剪，不能权限失败时靠旧state输出。无read/page/last-opened更新。

错误：统一§7.2；metadata.page/idem非None先InvalidRequest；当前无法证实visibility整体fail-closed；分页绑定任何轴变化CursorInvalid，不能silent重新开始。没有幂等写记录/审计落库/刷新副作用；只允许安全技术日志。单Query自检：完整响应字段已列，no-write，缺失和degraded口径可测。

#### GetWorkspaceOperationResult

签名：`pub async fn QueryHandlers::get_operation_result(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceOperationResultRequest) -> Result<WorkspaceOperationResponse, SafeReadFailure>`。WorkspaceQueryService同名；内部library，无HTTP route。响应schema为本族WorkspaceOperationResponse独立定义；不返回domain实体。

```rust
/// Defines the GetWorkspaceOperationResultRequest contract.
pub struct GetWorkspaceOperationResultRequest {
    /// Explicit scope value.
    pub scope: ScopeSelector,
    /// Explicit partition value.
    pub partition: WorkspacePartitionId,
    /// Explicit operation ref value.
    pub operation_ref: WorkspaceOperationRef,
}
```

归属：`crates/contracts/src/queries.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `scope` | `ScopeSelector` | 结果主体当前scope |
| `partition` | `WorkspacePartitionId` | 必须匹配授权scope |
| `operation_ref` | `WorkspaceOperationRef` | 原结果ref，未找到不证明未提交 |

字段→对象/port构造闭环：resolver→已有partition核验→operation_by_ref→当前scope及所有结果ref可公开检查→精确stored结果；无记录NotAvailable，不构造假NotCommitted或重跑原操作。

错误：统一§7.2；metadata.page/idem非None先InvalidRequest；当前无法证实visibility整体fail-closed；分页绑定任何轴变化CursorInvalid，不能silent重新开始。没有幂等写记录/审计落库/刷新副作用；只允许安全技术日志。单Query自检：完整响应字段已列，no-write，缺失和degraded口径可测。

#### GetWorkspaceRecoveryStatus

签名：`pub async fn QueryHandlers::get_recovery_status(&self, actor: ActorContext, metadata: QueryMetadata, request: GetWorkspaceRecoveryStatusRequest) -> Result<WorkspaceRecoveryResponse, SafeReadFailure>`。WorkspaceQueryService同名；内部library，无HTTP route。响应schema为本族WorkspaceRecoveryResponse独立定义；不返回domain实体。

```rust
/// Defines the GetWorkspaceRecoveryStatusRequest contract.
pub struct GetWorkspaceRecoveryStatusRequest {
    /// Explicit scope value.
    pub scope: ScopeSelector,
    /// Explicit partition value.
    pub partition: WorkspacePartitionId,
    /// Explicit attempt value.
    pub attempt: RebuildAttemptId,
}
```

归属：`crates/contracts/src/queries.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `scope` | `ScopeSelector` | 现时scope |
| `partition` | `WorkspacePartitionId` | 匹配已有分区 |
| `attempt` | `RebuildAttemptId` | 已有attempt；不隐式Request |

字段→对象/port构造闭环：resolver→recovery_snapshot(partition,attempt)→当前可公开性裁剪→state/role/safety/replacement字段；无attempt NotAvailable。读到Requested/Blocked/Failed也不启动Advance。

错误：统一§7.2；metadata.page/idem非None先InvalidRequest；当前无法证实visibility整体fail-closed；分页绑定任何轴变化CursorInvalid，不能silent重新开始。没有幂等写记录/审计落库/刷新副作用；只允许安全技术日志。单Query自检：完整响应字段已列，no-write，缺失和degraded口径可测。

#### ExportWorkspaceReadModel

签名：`pub async fn QueryHandlers::export_read_model(&self, actor: ActorContext, metadata: QueryMetadata, request: ExportWorkspaceReadModelRequest) -> Result<WorkspaceExportResponse, SafeReadFailure>`。WorkspaceQueryService同名；内部library，无HTTP route。响应schema为本族WorkspaceExportResponse独立定义；不返回domain实体。

```rust
/// Defines the ExportWorkspaceReadModelRequest contract.
pub struct ExportWorkspaceReadModelRequest {
    /// Explicit scope value.
    pub scope: ScopeSelector,
    /// Explicit mode value.
    pub mode: ReadMode,
    /// Explicit selection value.
    pub selection: ReadSelection,
    /// Explicit page value.
    pub page: WorkspacePageRequest,
}
```

归属：`crates/contracts/src/queries.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `scope` | `ScopeSelector` | 正式解析 |
| `mode` | `ReadMode` | 显式，不强制创建projection |
| `selection` | `ReadSelection` | 仅Sources |
| `page` | `WorkspacePageRequest` | 同view分页规则，无archive cursor |

字段→对象/port构造闭环：按GetWorkspaceView相同取数/裁剪/分页，但QueryKind=Export，与View token不可交换；输出schema_version=1+read model，不写artifact/export marker、不通知archive、不提供签收/evidence。006未闭合下游绑定阻塞对外互操作，不改变本地no-write。

错误：统一§7.2；metadata.page/idem非None先InvalidRequest；当前无法证实visibility整体fail-closed；分页绑定任何轴变化CursorInvalid，不能silent重新开始。没有幂等写记录/审计落库/刷新副作用；只允许安全技术日志。单Query自检：完整响应字段已列，no-write，缺失和degraded口径可测。

#### 字段来源与输出构造总检查

全部required public字段必须存在；Option必须按本Step/6A变体条件判断，禁止未知字段静默影响行为。Step6 private领域对象只通过factory/method与getter访问；Step8 public raw DTO不能直接转trusted input。所有u32长度/limit和Vec资源预算都必须在分配/解码前检查，具体限额值由后续Step14/04定义；超限InvalidRequest/ContractBlocked，不能截断后返回Complete。未闭合slot的正向请求/响应不得用示例body或fake值充数。

#### Query公共退化/分页语义审查

| 情况 | 返回 | 禁止 |
|---|---|---|
| 允许scope且真实空selection结果 | Available / AllowedSubset，items空，returned0；coverage由正式proof决定 | 空自动Complete/权限绕过 |
| 未解析、无权、source安全不能证实 | SafeReadFailure，不返回scope/items/count/provenance | 返回空成功暗示存在 |
| 数据stale但现时allow成立 | Freshness=Stale，可返回允许子集；coverage独立 | 用stale绕权限 |
| 声明允许来源缺部分数据且可安全区分 | coverage=Partial或Unknown，items仅安全子集 | 用partial暴露隐藏owner数量 |
| 无物化current / required adapter disabled | NotAvailable或安全语境内ContractBlocked | 自动Transient或重建 |
| current有效、candidate重建中/Failed | 继续读current并按来源proof标freshness；status查询独立 | 把candidate未提交数据暴露 |
| current SafetyBlocked | 整体拒绝其受影响视图；无freshness伪降级 | 换回retired generation |
| generation/view/local/visibility/selector/order/limit变化 | CursorInvalid，调用者明确首屏重读 | 混snapshot继续 |
| 不可比较attention关系 | 当前item ReadClassification=Unknown | 默认已读或推动read intent |

族停审：六Query独立request/response/empty/blocked/stale/partial/missing及source slot；token是受保护局部延续，不授权。无写port调用；gate=pass_with_external_slots。


### 7.5 Consumer批次：原始envelope与验证后输入分离

| 协议 | 来源 / 消费模块 | 目标 | 接缝/flow |
|---|---|---|---|
| ConsumeSourceChange | 六L1 owner经L0-bus / worker | CP3/4 source application | validate_change/classify/apply_source；Step9同名 |
| ConsumeSourceInvalidation | owning source/visibility链经bus / worker | CP6 existing targets失效 | validate_invalidation/affected_targets/invalidate；Step9同名 |

问题：本仓可以定义消费函数和receipt，但不能抢先定义owner event的schema/topic。取舍：以下SourceEnvelopeMetadata/OwnerChangePayload/OwnerInvalidationPayload均为WS-UP-002/003具名blocked slot，表明必须来自正式owner+bus契约；不声明本地String/任意JSON替身。局部wrapper只组合外部metadata与typed payload，不能伪称已定义上游事件。

| 外部slot | owner必须闭合的信息 | 当前缺失处理 |
|---|---|---|
| SourceEnvelopeMetadata | producer/source family、稳定event identity、schema version、stream/cursor/version、trace、authority、payload binding；exact字段名/必选由owner决定 | 拒收/ContractBlocked；不解析不支持版本payload |
| OwnerChangePayload | safe changed refs/声明范围/attention input或正式查询引用；不重复envelope event身份 | 正向blocked；不接受正文 |
| OwnerInvalidationPayload | 正式失效依据/effect/affected selection/current validity | 无proof不能SafetyBlocked；timeout非撤销 |
| TrustedSourceChange/Invalidation | 正式envelope验证后可抽取上述必要字段的结果 | application使用，不能外部Deserialize成功 |

```rust
/// Defines the WorkspaceInboundEnvelope<T> contract.
pub struct WorkspaceInboundEnvelope<T> {
    /// Explicit metadata value.
    pub metadata: SourceEnvelopeMetadata,
    /// Explicit payload value.
    pub payload: T,
}
```

归属：`crates/contracts/src/source_inputs.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `metadata` | `SourceEnvelopeMetadata` | 002外部slot，仅来源元数据唯一承载，不在payload重复身份 |
| `payload` | `T` | 只允许OwnerChangePayload/OwnerInvalidationPayload具名槽位；泛型只是envelope结构复用，不能用任意T绕schema/validation |

### SourceChangeReceipt

```rust
/// Reports local application disposition, not transport acknowledgement.
pub enum SourceChangeReceipt {
    /// Returns the committed source result.
    Applied { result: ApplicationResultRef, revision: ViewRevision, cursor: SourceCursorBasis },
    /// Replays the exact terminal outcome.
    Duplicate { result: ApplicationResultRef, original: TerminalApplyDisposition, revision: ViewRevision, cursor: SourceCursorBasis },
    /// Records a proven obsolete input without regressing progress.
    LateIgnored { result: ApplicationResultRef, revision: ViewRevision, cursor: SourceCursorBasis },
    /// Reports a recorded non-terminal gap.
    Gap { gap: GapRef },
    /// Reports missing formal input without success.
    Blocked { code: SafeFailureCode },
    /// Reports a retryable unavailable dependency.
    Retry { code: SafeFailureCode },
    /// Rejects malformed or forbidden input.
    Rejected { code: SafeFailureCode },
    /// Rejects the same key with a different digest.
    Conflict,
    /// Requires authoritative commit resolution.
    Unknown { attempt: CommitAttemptId },
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Applied { result: ApplicationResultRef, revision: ViewRevision, cursor: SourceCursorBasis }` | Returns the committed source result. | terminal record存在 |
| `Duplicate { result: ApplicationResultRef, original: TerminalApplyDisposition, revision: ViewRevision, cursor: SourceCursorBasis }` | Replays the exact terminal outcome. | 同key同digest，不重新apply |
| `LateIgnored { result: ApplicationResultRef, revision: ViewRevision, cursor: SourceCursorBasis }` | Records a proven obsolete input without regressing progress. | terminal record，safe cursor不退 |
| `Gap { gap: GapRef }` | Reports a recorded non-terminal gap. | 无source success key，需正式接续 |
| `Blocked { code: SafeFailureCode }` | Reports missing formal input without success. | 无terminal record |
| `Retry { code: SafeFailureCode }` | Reports a retryable unavailable dependency. | 不claim已保存quarantine/ACK |
| `Rejected { code: SafeFailureCode }` | Rejects malformed or forbidden input. | 不写projection |
| `Conflict` | Rejects the same key with a different digest. | 原record不覆写 |
| `Unknown { attempt: CommitAttemptId }` | Requires authoritative commit resolution. | 不能作为Retry直接重跑 |

### SourceInvalidationReceipt

```rust
/// Reports one partition-local invalidation result.
pub enum SourceInvalidationReceipt {
    /// Returns a committed invalidation result.
    Applied(WorkspaceWriteResult),
    /// Returns the exact stored invalidation result.
    Duplicate(WorkspaceWriteResult),
    /// No matching existing targets were found.
    NoTargets,
    /// Reports missing formal authority or target mapping.
    Blocked { code: SafeFailureCode },
    /// Reports a transient unavailable dependency.
    Retry { code: SafeFailureCode },
    /// Rejects an invalid envelope.
    Rejected { code: SafeFailureCode },
    /// Rejects conflicting event identity reuse.
    Conflict,
    /// Requires authoritative lookup before retry.
    Unknown { attempt: CommitAttemptId },
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `Applied(WorkspaceWriteResult)` | Returns a committed invalidation result. | 当前子分区原子结果 |
| `Duplicate(WorkspaceWriteResult)` | Returns the exact stored invalidation result. | 不再次fanout全部目标 |
| `NoTargets` | No matching existing targets were found. | 成功本地无效果，不创建partition；非永远无影响 |
| `Blocked { code: SafeFailureCode }` | Reports missing formal authority or target mapping. | 无假失效 |
| `Retry { code: SafeFailureCode }` | Reports a transient unavailable dependency. | 不宣称transport重试已安排 |
| `Rejected { code: SafeFailureCode }` | Rejects an invalid envelope. | 无写 |
| `Conflict` | Rejects conflicting event identity reuse. | 不覆旧结果 |
| `Unknown { attempt: CommitAttemptId }` | Requires authoritative lookup before retry. | 保留不确定 |

SourceInvalidation需要表达fanout分页，不能单receipt假全局完成。定义局部调用结果：

```rust
/// Defines the SourceInvalidationPageReceipt contract.
pub struct SourceInvalidationPageReceipt {
    /// Explicit items value.
    pub items: Vec<SourceInvalidationTargetReceipt>,
    /// Explicit next value.
    pub next: Option<WorkspacePartitionId>,
    /// Explicit no targets value.
    pub no_targets: bool,
}
```

归属：`crates/contracts/src/source_inputs.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `items` | `Vec<SourceInvalidationTargetReceipt>` | 单target最多1；枚举模式逐子分区结果，可部分失败 |
| `next` | `Option<WorkspacePartitionId>` | 仅枚举模式本地seek，来自AffectedTargetPage；不是source cursor |
| `no_targets` | `bool` | 仅items空且next=None，真实本次无目标；不能据此持久全局event成功 |

```rust
/// Defines the SourceInvalidationTargetReceipt contract.
pub struct SourceInvalidationTargetReceipt {
    /// Explicit partition value.
    pub partition: WorkspacePartitionId,
    /// Explicit receipt value.
    pub receipt: SourceInvalidationReceipt,
}
```

归属：`crates/contracts/src/source_inputs.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `partition` | `WorkspacePartitionId` | 仅受信内部consumer可见目标；不向用户裸输出 |
| `receipt` | `SourceInvalidationReceipt` | 独立子操作结果；某项unknown不抹其他已提交项 |

#### ConsumeSourceChange

签名：`pub async fn SourceChangeConsumer::consume_change(&self, actor: ActorContext, request: ConsumeSourceChangeRequest) -> Result<SourceChangeReceipt, SafeReadFailure>`；ProjectionApplyService同名；订阅方worker，发布方六L1 owning domain经L0-bus。**事件topic/family/schema版本exact绑定待002，当前不发布自定义workspace事件**。actor为宿主认证source服务，非payload字段；不因System/Integration跳过source/scoping/visibility gate。

```rust
/// Defines the ConsumeSourceChangeRequest contract.
pub struct ConsumeSourceChangeRequest {
    /// Explicit envelope value.
    pub envelope: WorkspaceInboundEnvelope<OwnerChangePayload>,
    /// Explicit partition value.
    pub partition: WorkspacePartitionId,
    /// Explicit generation value.
    pub generation: GenerationId,
}
```

归属：`crates/contracts/src/source_inputs.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `envelope` | `WorkspaceInboundEnvelope<OwnerChangePayload>` | 唯一source输入；schema不支持/缺identity/含正文拒绝 |
| `partition` | `WorkspacePartitionId` | consumer adapter依据已有目标映射；不能来自owner伪造workspace主权 |
| `generation` | `GenerationId` | 获准已有Current或active Candidate；source隔离必须验证 |

构造闭环：SourceEventPort.validate_change→正式metadata/subject/basis；scope+已有target核验；SourceApplicationKey(owner/stream/event/partition/generation)+digest；lookup终局；classify→Applicable/Late/Gap/Blocked；Applicable通过safe查询/visibility证明形成SourceEvaluation→InboxProjector与PartitionProjection.apply→SourceApplicationRecord.record→apply_source原子。cursor/payload缺失不从本地猜。

缺失/错误：envelope身份/版本不合法Rejected，未知schema不解析payload，blocked/retry无成功记录，异digest Conflict，unknown必须resolve_commit；Gap只有change分支。receipt字段全部来自已提交记录或当前分类，不造quarantine marker/dead-letter ID：该动作需正式bus绑定，未发生就不报告已执行。actor/principal/refs只允许受信内部消费语境，外层未获准失败仍无目标元信息。单协议自检：14入口不变，fanout helper不是新API；schema正向缺口明确。

#### ConsumeSourceInvalidation

签名：`pub async fn SourceInvalidationConsumer::consume_invalidation(&self, actor: ActorContext, request: ConsumeSourceInvalidationRequest) -> Result<SourceInvalidationPageReceipt, SafeReadFailure>`；RecoveryService同名；订阅方worker，发布方六L1 owning domain经L0-bus。**事件topic/family/schema版本exact绑定待002，当前不发布自定义workspace事件**。actor为宿主认证source服务，非payload字段；不因System/Integration跳过source/scoping/visibility gate。

```rust
/// Defines the ConsumeSourceInvalidationRequest contract.
pub struct ConsumeSourceInvalidationRequest {
    /// Explicit envelope value.
    pub envelope: WorkspaceInboundEnvelope<OwnerInvalidationPayload>,
    /// Explicit target value.
    pub target: Option<WorkspacePartitionId>,
    /// Explicit after value.
    pub after: Option<WorkspacePartitionId>,
    /// Explicit limit value.
    pub limit: u32,
}
```

归属：`crates/contracts/src/source_inputs.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `envelope` | `WorkspaceInboundEnvelope<OwnerInvalidationPayload>` | 失效proof唯一来源 |
| `target` | `Option<WorkspacePartitionId>` | Some只处理经affected_targets证明的已有子分区；None只进行有界枚举，不全局原子 |
| `after` | `Option<WorkspacePartitionId>` | 仅target=None枚举的本地seek；target=Some时必须None |
| `limit` | `u32` | 枚举limit>0；单target也必>0，不影响effect |

构造闭环：validate_invalidation→正式affected selection/effect；affected_targets验证/有界枚举ExistingWorkspaceTargetSet；每target独立scope映射与source authority检查，source invalidation operation key由正式event canonical identity+目标stable scope/principal命名；InvalidationRecord.record与局部安全/新鲜度效果同事务，原子结果逐项返回。target=None不持久化全局成功键，重投可重新枚举但子项必须duplicate回读；新增candidate仍受source安全栅栏及query当前owner检查。

缺失/错误：envelope身份/版本不合法Rejected，未知schema不解析payload，blocked/retry无成功记录，异digest Conflict，unknown必须resolve_commit；Gap只有change分支。receipt字段全部来自已提交记录或当前分类，不造quarantine marker/dead-letter ID：该动作需正式bus绑定，未发生就不报告已执行。actor/principal/refs只允许受信内部消费语境，外层未获准失败仍无目标元信息。单协议自检：14入口不变，fanout helper不是新API；schema正向缺口明确。

Consumer族停审：来源schema/proof无本地伪补，局部envelope/receipt/disposition/分页已定义；Applied/Late唯一终局，NoTargets仅当次观察；bus ACK/quarantine/replay仍002不能声称已发生。

### 7.6 Operations批次：有界维护而非执行引擎

| 用例 | 对象/端口 | 出口 |
|---|---|---|
| RequestWorkspaceRecovery | candidate/attempt创建；save_recovery | WorkspaceWriteResult |
| AdvanceWorkspaceRecovery | recovery_snapshot/owner baseline/coverage/cutover | 同上，每次只执行一个阶段/批 |
| SupersedeWorkspaceRecovery | 已有replacement引用；save_recovery | 同上，不启动replacement |
| InvalidateWorkspaceView | existing targets/本地DataStale或正式proof；invalidate | 同上，单partition |

问题：job status/report若额外持久化会成为新维护truth。取舍：现有WorkspaceOperationRecord的typed Recovery/Invalidated结果就是精确本次结果；无run_id/report/evidence新对象。Request只保存意图；Advance显式单次预算；Completed/Blocked/Failed/Superseded终态不重启。调用actor是获准operator/service，需owning链正式允许本地操作，不能角色hint直接allow。

#### RequestWorkspaceRecovery

触发：受控CLI/调度宿主显式调用一次；`pub async fn RecoveryHandlers::request_recovery(&self, actor: ActorContext, metadata: RequestMetadata, request: RequestWorkspaceRecoveryRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>`；RecoveryService同名，origin=Operations，channel固定Operations；不新增公共HTTP路由。

```rust
/// Defines the RequestWorkspaceRecoveryRequest contract.
pub struct RequestWorkspaceRecoveryRequest {
    /// Explicit scope value.
    pub scope: ScopeSelector,
    /// Explicit partition value.
    pub partition: WorkspacePartitionId,
    /// Explicit expected partition value.
    pub expected_partition: PartitionVersion,
    /// Explicit mode value.
    pub mode: RecoveryMode,
}
```

归属：`crates/contracts/src/operations.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `scope` | `ScopeSelector` | 正式scope |
| `partition` | `WorkspacePartitionId` | 已有分区 |
| `expected_partition` | `PartitionVersion` | 调用方观察值；service重读CAS |
| `mode` | `RecoveryMode` | Refresh/Rebuild，均owner baseline；不采用旧projection为真相 |

字段→对象/port构造闭环：scope+操作权限→lookup operation→snapshot/expected→IdPort.attempt/generation/operation/commit_attempt→RebuildAttempt.request + GenerationState.candidate + PartitionProjection.empty_candidate→save_recovery，Requested/Unverified，current不变。

响应：WorkspaceWriteResult；Recovery variant必有attempt/status/basis，Blocked/Failed必failure，Invalidated必effect/id；Duplicate回精确原结果，不再次baseline/fanout。缺key或字段InvalidRequest，expected/非法终态/替代链Conflict，authority缺失NotAvailable/ContractBlocked，unknown OutcomeUnknown。结果是设计schema，不代表任何真实运行。单协议自检：构造来源完整、边界仅局部维护，Step9逐一展开。

#### AdvanceWorkspaceRecovery

触发：受控CLI/调度宿主显式调用一次；`pub async fn RecoveryHandlers::advance_recovery(&self, actor: ActorContext, metadata: RequestMetadata, request: AdvanceWorkspaceRecoveryRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>`；RecoveryService同名，origin=Operations，channel固定Operations；不新增公共HTTP路由。

```rust
/// Defines the AdvanceWorkspaceRecoveryRequest contract.
pub struct AdvanceWorkspaceRecoveryRequest {
    /// Explicit scope value.
    pub scope: ScopeSelector,
    /// Explicit partition value.
    pub partition: WorkspacePartitionId,
    /// Explicit attempt value.
    pub attempt: RebuildAttemptId,
    /// Explicit expected attempt value.
    pub expected_attempt: AttemptVersion,
    /// Explicit budget value.
    pub budget: u32,
}
```

归属：`crates/contracts/src/operations.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `scope` | `ScopeSelector` | 正式scope |
| `partition` | `WorkspacePartitionId` | 已有 |
| `attempt` | `RebuildAttemptId` | 已有非终态 |
| `expected_attempt` | `AttemptVersion` | 本次CAS |
| `budget` | `u32` | 一次最多读取/应用条目>0，不超配置上限，入digest；不后台循环 |

字段→对象/port构造闭环：operation lookup先于重跑；recovery_snapshot→expected/state判断→Requested仅start_baseline；Baselining/CatchingUp分别owner有界批；Validating拿coverage/visibility→CutoverBasis→candidate.validate/attempt.mark_ready；Ready重核全轴/proof后cutover或revalidate。一次调用一个分支，一批不跨阶段循环；无足够owner proof进入Blocked的精确failure结果，临时技术故障可外层Unavailable不改状态。

响应：WorkspaceWriteResult；Recovery variant必有attempt/status/basis，Blocked/Failed必failure，Invalidated必effect/id；Duplicate回精确原结果，不再次baseline/fanout。缺key或字段InvalidRequest，expected/非法终态/替代链Conflict，authority缺失NotAvailable/ContractBlocked，unknown OutcomeUnknown。结果是设计schema，不代表任何真实运行。单协议自检：构造来源完整、边界仅局部维护，Step9逐一展开。

#### SupersedeWorkspaceRecovery

触发：受控CLI/调度宿主显式调用一次；`pub async fn RecoveryHandlers::supersede_recovery(&self, actor: ActorContext, metadata: RequestMetadata, request: SupersedeWorkspaceRecoveryRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>`；RecoveryService同名，origin=Operations，channel固定Operations；不新增公共HTTP路由。

```rust
/// Defines the SupersedeWorkspaceRecoveryRequest contract.
pub struct SupersedeWorkspaceRecoveryRequest {
    /// Explicit scope value.
    pub scope: ScopeSelector,
    /// Explicit partition value.
    pub partition: WorkspacePartitionId,
    /// Explicit attempt value.
    pub attempt: RebuildAttemptId,
    /// Explicit expected attempt value.
    pub expected_attempt: AttemptVersion,
    /// Explicit replacement value.
    pub replacement: RebuildAttemptId,
}
```

归属：`crates/contracts/src/operations.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `scope` | `ScopeSelector` | 正式scope |
| `partition` | `WorkspacePartitionId` | 已有 |
| `attempt` | `RebuildAttemptId` | 旧非终态 |
| `expected_attempt` | `AttemptVersion` | 旧尝试CAS |
| `replacement` | `RebuildAttemptId` | 已有同partition不同id且非终态；不能与旧尝试形成环 |

字段→对象/port构造闭环：旧/new两recovery_snapshot且同partition，replacement在同原子检查仍非终态、不同id、无反向replacement链；旧attempt.supersede→save_recovery，只旧attempt递增，current/新attempt/CP5不变。

响应：WorkspaceWriteResult；Recovery variant必有attempt/status/basis，Blocked/Failed必failure，Invalidated必effect/id；Duplicate回精确原结果，不再次baseline/fanout。缺key或字段InvalidRequest，expected/非法终态/替代链Conflict，authority缺失NotAvailable/ContractBlocked，unknown OutcomeUnknown。结果是设计schema，不代表任何真实运行。单协议自检：构造来源完整、边界仅局部维护，Step9逐一展开。

#### InvalidateWorkspaceView

触发：受控CLI/调度宿主显式调用一次；`pub async fn InvalidationHandler::invalidate_view(&self, actor: ActorContext, metadata: RequestMetadata, request: InvalidateWorkspaceViewRequest) -> Result<WorkspaceWriteResult, SafeReadFailure>`；RecoveryService同名，origin=Operations，channel固定Operations；不新增公共HTTP路由。

```rust
/// Defines the InvalidateWorkspaceViewRequest contract.
pub struct InvalidateWorkspaceViewRequest {
    /// Explicit scope value.
    pub scope: ScopeSelector,
    /// Explicit partition value.
    pub partition: WorkspacePartitionId,
    /// Explicit expected partition value.
    pub expected_partition: PartitionVersion,
    /// Explicit generations value.
    pub generations: Vec<GenerationId>,
    /// Explicit sources value.
    pub sources: Vec<SourceStreamRef>,
    /// Explicit basis value.
    pub basis: InvalidationBasis,
}
```

归属：`crates/contracts/src/operations.rs`。

| 字段 | 类型 | 来源 / 目标 / 缺失与空值 |
|---|---|---|
| `scope` | `ScopeSelector` | 正式scope |
| `partition` | `WorkspacePartitionId` | 已有 |
| `expected_partition` | `PartitionVersion` | CAS |
| `generations` | `Vec<GenerationId>` | 非空、已有/匹配分区；不隐式扩范围 |
| `sources` | `Vec<SourceStreamRef>` | 非空，正式source映射002 |
| `basis` | `InvalidationBasis` | LocalDataStale只新鲜度；Owner(proof)由正式owner验证，不能自由指定effect |

字段→对象/port构造闭环：snapshot与已有generation/source集合交集验证；basis Owner必须正式校验，LocalDataStale需scope操作权限；InvalidationRecord.record→invalidate，安全effect由proof不是body bool；保存记录/失效效果/operation同事务。

响应：WorkspaceWriteResult；Recovery variant必有attempt/status/basis，Blocked/Failed必failure，Invalidated必effect/id；Duplicate回精确原结果，不再次baseline/fanout。缺key或字段InvalidRequest，expected/非法终态/替代链Conflict，authority缺失NotAvailable/ContractBlocked，unknown OutcomeUnknown。结果是设计schema，不代表任何真实运行。单协议自检：构造来源完整、边界仅局部维护，Step9逐一展开。

Operations族停审：四用例schema/metadata/结果/幂等/状态来源完成；owning permission/continuation未闭合正向blocked；没有job自动调度或执行事实。

### 7.7 跨协议闭环审计

| 检查 | 结论 |
|---|---|
| 14入口名称映射 | HLD能力名→同名Request→Step7同名service/handler→Step9同名Flow；无省略 |
| public二级类型 | 本StepDTO/enum与6A共享类型；无domain类型字段；external slot清单明确blocked |
| read-model identity | partition稳定key、generation/view/local分轴；Inbox id跨generation稳定；page token不是业务ID |
| 请求构造 | 生成字段来自IdPort/commit，owner proof来自正式ports，input缺失拒绝不猜默认 |
| duplicate/unknown | stored精确结果+当前裁剪；unknown无记录不是rollback；source success与gap分离 |
| 外部协议 | 未定义新topic/HTTP/schema版本；wrapper不是上游契约；002/006继续阻塞外部绑定 |
| 历史污染 | 不照搬governance NotVisible带marker模式/Outbox/job run报告；本仓整体拒绝不带scope |
| no-write | 六Query不持write store/业务ID能力；codec随机nonce不产生持久工作区状态 |

回填：§7按四族逐入口schema及公共二级类型，§6给14入口索引；保持所有slot实施限制。消费失效返回按局部分页细化为SourceInvalidationPageReceipt，已回修Step7/6C callable索引；未改02能力/入口数。


## 8. 回填草稿

§7.1~7.7公共词汇/四协议族/十四独立入口已形成回填片段，正式03未装配；上游slot不可删除或伪装已闭合。

## 9. 待确认

WS-UP-001~008/006-S保持open，具体正向schema/绑定仍blocked；不跨项目回写。

## 10. 下一步门禁

四协议族和public surface审计完成，允许进入Step9。局部schema闭合不等外部schema/transport已绑定；正向owning字段仍blocked。
