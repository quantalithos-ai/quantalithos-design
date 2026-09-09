# Step6-B domain：逐对象实现契约

## 输入与组内计划

按CP1→CP7逐组推导、卡片、审查。输入Step5、02对象/处理流及Step6-A。对象在domain所属文件内，不依赖application。此前附录拼接导致卡片位置错序，本次仅结构重排恢复推导链，不能把重排视为新的上游确认。

## CP1 设计记录

capability：Personal/Project正式范围与稳定局部分区；输入owner resolution、可信actor与局部ID；输出scope/partition，唯一键actor_id+StableScopeKey。诊断：把resolution_ref放唯一键会随授权刷新重复建档。取舍：scope保存临时出处用于匹配，stable_key仅kind+anchor；分区当前generation为None时不自动视为完整空view。结构化卡片随本组写入。

| 能力对象 | 字段/构造/函数/状态依据 |
|---|---|
| WorkspacePartition | 下列独立卡片的typed字段、factory、成员和不变量；来源为本组正式输入，owner slot按Step6-A阻塞 |
| WorkspaceScope | 下列独立卡片的typed字段、factory、成员和不变量；来源为本组正式输入，owner slot按Step6-A阻塞 |

### WorkspacePartition

位置：`crates/domain/src/partition.rs`。能力：Owns one stable local view partition.

```rust
/// Owns one stable local view partition.
pub struct WorkspacePartition {
    /// Local partition identifier.
    partition_id: WorkspacePartitionId,
    /// Principal identifier.
    principal: ActorId,
    /// Owner-resolved scope.
    scope: WorkspaceScope,
    /// Partition revision.
    partition_version: PartitionVersion,
    /// Selected generation if materialized.
    current_generation: Option<GenerationId>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `partition_id` | `WorkspacePartitionId` | 显式Provision由IdPort生成 |
| `principal` | `ActorId` | 可信actor经scope匹配 |
| `scope` | `WorkspaceScope` | ScopeService解析 |
| `partition_version` | `PartitionVersion` | 新tentative=0，commit首次1；cutover更新 |
| `current_generation` | `Option<GenerationId>` | 初始None，仅原子cutover设置 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn assert_scope(&self, scope: &WorkspaceScope) -> Result<(), DomainError>` | 比较actor/stable_key，不要求旧proof ref相等 |
| `pub fn select_generation(&mut self, generation: GenerationId, expected: PartitionVersion) -> Result<(), DomainError>` | expected匹配才tentative设置与checked_next；仅cutover内部 |
| `pub fn validate_stored(&self) -> Result<(), DomainError>` | 已提交version>0，scope/principal一致；current存在性须store原子校验 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn provision(id: WorkspacePartitionId, principal: ActorId, scope: WorkspaceScope) -> Result<Self, DomainError>` | 初始None/0，调用方已核验create权限与幂等；store拒重复唯一键 |

不变量/禁止：query禁止调用provision；current指针与新旧generation/attempt一事务。

### WorkspaceScope

位置：`crates/domain/src/partition.rs`。能力：Carries an owner-resolved workspace scope.

```rust
/// Carries an owner-resolved workspace scope.
pub struct WorkspaceScope {
    /// Resolved scope branch.
    kind: ScopeKind,
    /// Stable owner anchor.
    anchor: OwnerScopeRef,
    /// Resolution provenance.
    resolution_ref: OwnerResolutionRef,
    /// Effective principal identifier.
    principal: ActorId,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `kind` | `ScopeKind` | OwnerScopeResolution.kind |
| `anchor` | `OwnerScopeRef` | 005 owner typed anchor |
| `resolution_ref` | `OwnerResolutionRef` | 005正式解析出处，不入唯一key |
| `principal` | `ActorId` | 可信ActorContext与resolution一致 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn stable_key(&self) -> StableScopeKey` | 纯复制kind/anchor，不含resolution_ref |
| `pub fn matches(&self, actor: &ActorId, selector: &ScopeSelector) -> Result<(), DomainError>` | owner合同匹配，005缺口返回MissingBasis |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn from_resolution(resolution: OwnerScopeResolution, actor: ActorId) -> Result<Self, DomainError>` | 正式scope resolver完成验证；不能从ID字符串构造 |

不变量/禁止：无独立状态机；不授予执行或访问权限；Core ActorId不等GlobalMemberRef。

CP1组内审查：功能→对象→字段/工厂/函数可反查；无上游写入，状态沿02，本地support见6C；外部槽位未闭合不可构造成功值。gate=pass_with_external_slots。

## CP2 设计记录

capability：读取一source安全切片与现时可见性绑定；输入owning query/resolution，输出不可变安全值；无持久写。诊断：本地TTL或allow bool不能替代当前owner决定；空页也要list访问证明。取舍：保留正式proof和版本绑定，工厂只接正式resolver/query结果；安全证据型不derive Deserialize，不允许外部原始请求直接构造。Rust模块private不能替代信任模型：composition root/adapter属于可信代码，外部contract未闭合时构造路径blocked。

| 能力对象 | 字段/构造/函数/状态依据 |
|---|---|
| SourceSlice | 下列独立卡片的typed字段、factory、成员和不变量；来源为本组正式输入，owner slot按Step6-A阻塞 |
| VisibilityBinding | 下列独立卡片的typed字段、factory、成员和不变量；来源为本组正式输入，owner slot按Step6-A阻塞 |

### SourceSlice

位置：`crates/domain/src/source.rs`。能力：Carries a verified source-safe read slice.

```rust
/// Carries a verified source-safe read slice.
pub struct SourceSlice {
    /// Owning source.
    owner: SourceOwner,
    /// Resolved target scope.
    scope: WorkspaceScope,
    /// Safe source items.
    items: Vec<SafeSourceItem>,
    /// Owner version basis.
    version_basis: SourceVersionBasis,
    /// Current visibility binding.
    visibility: VisibilityBinding,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `owner` | `SourceOwner` | 正式adapter绑定 |
| `scope` | `WorkspaceScope` | 已验证当前目标 |
| `items` | `Vec<SafeSourceItem>` | 001/003 slot；每item字段经owner许可；空须coverage证明 |
| `version_basis` | `SourceVersionBasis` | 001 owner version/watermark/范围 |
| `visibility` | `VisibilityBinding` | 当前list/item决定 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn assert_matches(&self, scope: &WorkspaceScope, binding: &VisibilityBinding) -> Result<(), DomainError>` | 比较主体/范围/owner/item-version；不刷新、不写 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn from_owner(result: OwnerSafeReadResult, binding: VisibilityBinding) -> Result<Self, DomainError>` | 仅正式safe schema和proof齐全；001/003未闭合MissingBasis |

不变量/禁止：禁止raw JSON删字段后认安全；不缓存未裁剪owner响应。

CP2自检：source/visibility字段皆回owner；本地可校验一致性但不能补proof；空页list与逐item共享裁剪边界。回填两卡，gate=pass_with_WS-UP-001/003。

### VisibilityBinding

位置：`crates/domain/src/source.rs`。能力：Binds formal owner decisions without issuing permission.

```rust
/// Binds formal owner decisions without issuing permission.
pub struct VisibilityBinding {
    /// Formal decision references.
    decision_refs: Vec<OwnerDecisionRef>,
    /// Bound principal.
    principal: ActorId,
    /// Bound scope.
    scope: WorkspaceScope,
    /// Subject and version binding.
    subject_binding: VisibilitySubjectBinding,
    /// Owner validity proof.
    validity_basis: OwnerValidityBasis,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `decision_refs` | `Vec<OwnerDecisionRef>` | 003正式owning chain；非空并覆盖list/items |
| `principal` | `ActorId` | 决定与调用actor同一 |
| `scope` | `WorkspaceScope` | 决定scope匹配 |
| `subject_binding` | `VisibilitySubjectBinding` | 003 source subject/version及输出范围 |
| `validity_basis` | `OwnerValidityBasis` | 003有效/撤销/并发证明，非本地TTL |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn assert_applicable(&self, slice: &SourceSlice, current: &OwnerValidityBasis) -> Result<(), DomainError>` | 当前检查，旧绑定不授予权利 |
| `pub fn context_ref(&self) -> VisibilityContextRef` | 正式003可比较安全语境，缺合同正向blocked |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn from_resolution(resolution: OwnerVisibilityResolution, scope: &WorkspaceScope, actor: &ActorId) -> Result<Self, DomainError>` | 只复制核验结果；缺失/冲突不产生allow绑定 |

不变量/禁止：不定义授权状态机；无法确认当前有效即fail-closed；bindings在本地持久化不延长授权。



CP1字段/状态自检：ID、actor、scope来源明确，None不意味着空视图；stable身份与proof分离；无新生命周期。回填本组两卡，CP1 gate=pass_with_WS-UP-005。

CP2组内审查：功能→对象→字段/工厂/函数可反查；无上游写入，状态沿02，本地support见6C；外部槽位未闭合不可构造成功值。gate=pass_with_external_slots。

## CP3 设计记录

capability：按正式顺序消费、原子投影/Inbox/coverage/terminal record。输入验证slice、event identity、cursor/comparator proof；输出tentative变更与结果，commit后才终局。诊断：Gap占成功键会使修复后重试被吞；LateIgnored不得倒退cursor或改projection revision。取舍：只有Applied/LateIgnored入不可变记录；duplicate查原结果；coverage失效不同于data stale。

以下support在domain/projection.rs：AppliedBatch包含source slice、Inbox变更及证明，不是任意字段patch；当前逐ownerdelta/replace语义未闭合时blocked。

| 能力对象 | 字段/构造/函数/状态依据 |
|---|---|
| SourceUpdateMode | 下列独立卡片的typed字段、factory、成员和不变量；来源为本组正式输入，owner slot按Step6-A阻塞 |
| SourceApplicationRecord | 下列独立卡片的typed字段、factory、成员和不变量；来源为本组正式输入，owner slot按Step6-A阻塞 |
| SourceCoverage | 下列独立卡片的typed字段、factory、成员和不变量；来源为本组正式输入，owner slot按Step6-A阻塞 |
| PartitionProjection | 下列独立卡片的typed字段、factory、成员和不变量；来源为本组正式输入，owner slot按Step6-A阻塞 |

### SourceUpdateMode

```rust
/// Names formally supported projection replacement semantics.
pub enum SourceUpdateMode {
    /// Replaces exactly the range proven by the owner.
    ReplaceDeclaredRange,
    /// Applies only the formally enumerated delta.
    ApplyDeclaredDelta,
}
```

| 变体 | Rustdoc / 作用 | 来源 / 去向 |
|---|---|---|
| `ReplaceDeclaredRange` | Replaces exactly the range proven by the owner. | 001/002正式范围，不能隐式删范围外 |
| `ApplyDeclaredDelta` | Applies only the formally enumerated delta. | 001/002 delta schema未闭合则blocked |

### SourceApplicationRecord

位置：`crates/domain/src/projection.rs`。能力：Stores an immutable terminal application.

```rust
/// Stores an immutable terminal application.
pub struct SourceApplicationRecord {
    /// Application identity.
    application_key: SourceApplicationKey,
    /// Canonical input digest.
    input_digest: SafeInputDigest,
    /// Terminal disposition.
    outcome: TerminalApplyDisposition,
    /// Stored result identity.
    result_ref: ApplicationResultRef,
    /// Owner continuation basis.
    cursor_basis: SourceCursorBasis,
    /// Result view revision.
    view_revision: ViewRevision,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `application_key` | `SourceApplicationKey` | 正式event+目标 |
| `input_digest` | `SafeInputDigest` | 安全规范化输入 |
| `outcome` | `TerminalApplyDisposition` | Applied或LateIgnored |
| `result_ref` | `ApplicationResultRef` | 本地IdPort |
| `cursor_basis` | `SourceCursorBasis` | 002明确前后位置；LateIgnored保留原安全位置 |
| `view_revision` | `ViewRevision` | Applied新revision；LateIgnored原revision |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn same_input(&self, digest: &SafeInputDigest) -> bool` | 纯比较 |
| `pub fn read_result(&self) -> ApplicationResultRef` | 只读，不返回未裁剪source |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn record(key: SourceApplicationKey, digest: SafeInputDigest, outcome: TerminalApplyDisposition, result_ref: ApplicationResultRef, cursor: SourceCursorBasis, revision: ViewRevision) -> Result<Self, DomainError>` | 只有终局分支，可tentative构造，与投影效果同commit |

不变量/禁止：不可更新；Gap/Blocked不写；同key异digest不覆盖；结果查询现时授权；不表示bus ack。

CP3自检：终局记录新增view_revision为原结果可读取的局部结果字段，不改02主语；coverage_proof落库防Complete空壳。Unknown提交仅由store返回，不等Domain record已经保存。回填三卡与SourceUpdateMode，gate=pass_with_source_slots。

### SourceCoverage

位置：`crates/domain/src/projection.rs`。能力：Tracks proven per-stream coverage.

```rust
/// Tracks proven per-stream coverage.
pub struct SourceCoverage {
    /// Source stream.
    source: SourceStreamRef,
    /// Last proven position.
    applied_cursor: Option<SourceCursor>,
    /// Owner watermark.
    watermark: Option<OwnerWatermark>,
    /// Local coverage classification.
    coverage_state: CoverageState,
    /// Local gap reason.
    gap_ref: Option<GapRef>,
    /// Owner completeness proof.
    coverage_proof: Option<OwnerCoverageProof>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `source` | `SourceStreamRef` | 正式stream |
| `applied_cursor` | `Option<SourceCursor>` | 可证明应用位置，初始None |
| `watermark` | `Option<OwnerWatermark>` | 001覆盖证明，初始None |
| `coverage_state` | `CoverageState` | 初始Unknown |
| `gap_ref` | `Option<GapRef>` | Gap必Some |
| `coverage_proof` | `Option<OwnerCoverageProof>` | Complete必Some，范围与cursor同语境 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn advance(&mut self, basis: SourceCursorBasis, proof: OwnerCoverageProof) -> Result<(), DomainError>` | 校验正式比较/覆盖，Invalidated拒绝；proof支持Complete才Complete，否则Partial，修复Gap需bridge proof |
| `pub fn mark_gap(&mut self, gap: GapRef) -> Result<(), DomainError>` | 除Invalidated外变Gap，保留安全cursor/watermark |
| `pub fn invalidate(&mut self, record: &InvalidationRecord) -> Result<(), DomainError>` | SafetyBlocked且affects时Invalidated，DataStale no-op |
| `pub fn validate_stored(&self) -> Result<(), DomainError>` | Complete必须proof/cursor/watermark；Gap有gap_ref；Unknown无伪进度 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn unknown(source: SourceStreamRef) -> Self` | Unknown/None；仅显式candidate来源集合初始化 |

不变量/禁止：不cursor+1；不空页推Complete；Invalidated旧世代不原地恢复，重建新candidate。

### PartitionProjection

位置：`crates/domain/src/projection.rs`。能力：Maintains one generation's committed read projection.

```rust
/// Maintains one generation's committed read projection.
pub struct PartitionProjection {
    /// Partition identity.
    partition_id: WorkspacePartitionId,
    /// Generation identity.
    generation_id: GenerationId,
    /// View revision.
    view_revision: ViewRevision,
    /// Source-safe slices.
    source_slices: Vec<SourceSlice>,
    /// Derived attention items.
    inbox_items: Vec<InboxItem>,
    /// Proven source coverage.
    coverage: Vec<SourceCoverage>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `partition_id` | `WorkspacePartitionId` | 既有分区 |
| `generation_id` | `GenerationId` | candidate/current受控路由 |
| `view_revision` | `ViewRevision` | empty=0，Applied/baseline变更checked_next |
| `source_slices` | `Vec<SourceSlice>` | 每owner/声明范围唯一，不原始JSON |
| `inbox_items` | `Vec<InboxItem>` | CP4明示attention派生；id唯一 |
| `coverage` | `Vec<SourceCoverage>` | 逐正式stream，唯一stream |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn assert_generation(&self, generation: GenerationId) -> Result<(), DomainError>` | 禁止混世代 |
| `pub fn mark_gap(&mut self, source: SourceStreamRef, gap: GapRef, expected: ViewRevision) -> Result<(), DomainError>` | 找已有source coverage→mark_gap；items/cursor不变；有实质新gap才next revision，错误不改self |
| `pub fn invalidate(&mut self, record: &InvalidationRecord, expected: ViewRevision) -> Result<(), DomainError>` | 已有source匹配，SafetyBlocked将coverage Invalidated；DataStale保留coverage；两者失效记录由store持久并让read freshness保守；next view revision，重复由operation拦截 |
| `pub fn apply(&mut self, slice: SourceSlice, mode: SourceUpdateMode, inbox: Vec<InboxItem>, coverage: SourceCoverage, expected: ViewRevision) -> Result<(), DomainError>` | 校验声明范围、item/source/target一致和expected，按owner模式tentative替换/合并，递增revision；所有错误不修改self |
| `pub fn validate_stored(&self) -> Result<(), DomainError>` | 检查唯一性/世代/版本；Complete仍须proof不只非空 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn empty_candidate(partition: WorkspacePartitionId, generation: GenerationId) -> Self` | revision=0，三集合空，只有维护创建；无Complete结论 |

不变量/禁止：LateIgnored/Gap不调用apply；projection/Inbox/cursor/record同一分区事务。

CP3组内审查：功能→对象→字段/工厂/函数可反查；无上游写入，状态沿02，本地support见6C；外部槽位未闭合不可构造成功值。gate=pass_with_external_slots。

## CP4 设计记录

capability：owner明示attention→稳定InboxItem；输入attention identity/lifecycle，输出派生条目，与CP3/6同事务。诊断：hide/read误写attention_state会覆盖owner输入。取舍：InboxItem只Present/Withdrawn；local flags归CP5。跨generation稳定ID不包含版本，重开必须正式较新生命周期证明。

| 能力对象 | 字段/构造/函数/状态依据 |
|---|---|
| InboxItem | 下列独立卡片的typed字段、factory、成员和不变量；来源为本组正式输入，owner slot按Step6-A阻塞 |
| InboxProjector | 下列独立卡片的typed字段、factory、成员和不变量；来源为本组正式输入，owner slot按Step6-A阻塞 |

### InboxItem

位置：`crates/domain/src/inbox.rs`。能力：Represents explicitly owned source attention.

```rust
/// Represents explicitly owned source attention.
pub struct InboxItem {
    /// Stable local item.
    item_id: InboxItemId,
    /// Owner attention identity.
    source_attention_ref: OwnerAttentionRef,
    /// Owner attention version.
    attention_version: OwnerAttentionVersion,
    /// Mirrored attention state.
    attention_state: AttentionState,
    /// Owner subject reference.
    source_ref: OwnerSubjectRef,
    /// Projection generation.
    generation_id: GenerationId,
    /// Local provenance.
    source_application_ref: ApplicationResultRef,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `item_id` | `InboxItemId` | partition+owner canonical attention identity；004blocked |
| `source_attention_ref` | `OwnerAttentionRef` | 004正式输入 |
| `attention_version` | `OwnerAttentionVersion` | 004生命周期次序 |
| `attention_state` | `AttentionState` | owner显式Present/Withdrawn |
| `source_ref` | `OwnerSubjectRef` | 001正式safe引用 |
| `generation_id` | `GenerationId` | 受控target |
| `source_application_ref` | `ApplicationResultRef` | 本次原子应用或baseline结果ID |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn apply_attention(&mut self, input: OwnerAttentionInput, application: ApplicationResultRef) -> Result<(), DomainError>` | 验证稳定identity/版本，旧输入no-op，新生命周期按正式proof；更新来源ref与application |
| `pub fn id(&self) -> InboxItemId` | 只读 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn derive(partition: WorkspacePartitionId, generation: GenerationId, input: OwnerAttentionInput, application: ApplicationResultRef) -> Result<Self, DomainError>` | 004已闭合才能生成id/状态；baseline输入也须来源证明 |

不变量/禁止：不从普通业务事件推待办，不发receipt；Withdrawn重开未经proof拒绝。

### InboxProjector

```rust
/// Derives attention without I/O or independent transactions.
pub struct InboxProjector;
```

| 成员/工厂签名 | 来源 / 效果 |
|---|---|
| `pub fn new() -> Self` | 无字段、无状态、无I/O |
| `pub fn derive(&self, partition: WorkspacePartitionId, generation: GenerationId, inputs: Vec<OwnerAttentionInput>, application: ApplicationResultRef) -> Result<Vec<InboxItem>, DomainError>` | 明示attention去重/identity冲突检查；原子返回全部或错误；不能独立保存 |

CP4组内审查：功能→对象→字段/工厂/函数可反查；无上游写入，状态沿02，本地support见6C；外部槽位未闭合不可构造成功值。gate=pass_with_external_slots。

## CP5 设计记录

capability：显式读意图/偏好和操作结果核对；输入command与expected，输出local revision。诊断：单ReadCursor不能装六来源的不同attention stream；使用source cursor代用户读边界无依据。取舍：ReadCursor为每个正式AttentionStreamRef一份，LocalAttentionState保存有序stream→cursor集合；02单字段read_cursor在详细设计明确为集合，不新建业务对象。跨stream批量Advance未授权，单command只改单一意图目标；MarkUnread覆写保留，尚无清除override用例则不自动抹去。

此字段细化已同步本项目02 §6及02 Step6/flow，仅targeted repair，不重开其他概要结论；project ledger §4.6登记，02恢复停审。

| 能力对象 | 字段/构造/函数/状态依据 |
|---|---|
| LocalAttentionState | 下列独立卡片的typed字段、factory、成员和不变量；来源为本组正式输入，owner slot按Step6-A阻塞 |
| ReadCursor | 下列独立卡片的typed字段、factory、成员和不变量；来源为本组正式输入，owner slot按Step6-A阻塞 |
| WorkspaceOperationRecord | 下列独立卡片的typed字段、factory、成员和不变量；来源为本组正式输入，owner slot按Step6-A阻塞 |

### LocalAttentionState

位置：`crates/domain/src/local_attention.rs`。能力：Owns local preferences and explicit attention intent.

```rust
/// Owns local preferences and explicit attention intent.
pub struct LocalAttentionState {
    /// Owning partition.
    partition_id: WorkspacePartitionId,
    /// Bound principal.
    principal: ActorId,
    /// Local revision.
    local_revision: LocalRevision,
    /// Per-stream read intents.
    read_cursors: Vec<ReadCursor>,
    /// Local presentation flags.
    dispositions: Vec<LocalDisposition>,
    /// Presentation preferences.
    preferences: WorkspacePreferenceValues,
    /// Explicit last-opened reference.
    last_opened: Option<OwnerSubjectRef>,
    /// Explicit focus reference.
    focus: Option<OwnerSubjectRef>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `partition_id` | `WorkspacePartitionId` | 已有partition |
| `principal` | `ActorId` | 分区principal一致 |
| `local_revision` | `LocalRevision` | 初始化0；显式command commit时checked_next |
| `read_cursors` | `Vec<ReadCursor>` | 每正式attention stream唯一，按稳定owner关系去重 |
| `dispositions` | `Vec<LocalDisposition>` | item唯一、canonical排序 |
| `preferences` | `WorkspacePreferenceValues` | 初始StableIdentity/true，显式替换 |
| `last_opened` | `Option<OwnerSubjectRef>` | 显式设置/清除，005/003可见性验证 |
| `focus` | `Option<OwnerSubjectRef>` | 显式设置/清除，非runtime context |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn change(&mut self, change: LocalAttentionChange, resolution: LocalChangeResolution, expected: LocalRevision) -> Result<(), DomainError>` | expected匹配；resolution包含正式目标/attention证明；按变体只改对应字段，一次checked_next，失败不改self |
| `pub fn validate_stored(&self) -> Result<(), DomainError>` | 集合无重复，cursor.intent_revision<=local_revision |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn initialize(partition: WorkspacePartitionId, principal: ActorId) -> Self` | 空集合/None、默认偏好/0；仅Provision或首次显式Change |

不变量/禁止：重建不得替换本聚合；Query不调用change/initialize；无可见性扩大。

### ReadCursor

位置：`crates/domain/src/local_attention.rs`。能力：Stores explicit local attention-reading intent.

```rust
/// Stores explicit local attention-reading intent.
pub struct ReadCursor {
    /// Attention intent stream.
    stream: AttentionStreamRef,
    /// Last explicit read basis.
    read_basis: Option<AttentionReadBasis>,
    /// Explicit unread overrides.
    unread_overrides: Vec<InboxItemId>,
    /// Local intent revision.
    intent_revision: LocalRevision,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `stream` | `AttentionStreamRef` | 004正式attention流，不是source消费stream |
| `read_basis` | `Option<AttentionReadBasis>` | Advance正式已见稳定basis；未设置None |
| `unread_overrides` | `Vec<InboxItemId>` | MarkUnread写入，排序去重 |
| `intent_revision` | `LocalRevision` | 本次local commit revision，初始0 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn apply(&mut self, intent: ReadIntent, resolution: AttentionIdentityResolution, revision: LocalRevision) -> Result<(), DomainError>` | stream/身份匹配；Advance只有正式可比较不倒退才接受，保留overrides；MarkUnread添加id |
| `pub fn classify(&self, item: &InboxItem, relation: &OwnerAttentionRelation) -> ReadClassification` | 当前可见且id匹配时override优先Unread；正式映射证明覆盖Read/在后Unread，否则Unknown |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn unset(stream: AttentionStreamRef) -> Self` | None、空overrides、0 |

不变量/禁止：generation变化不删除意图；不能比较的Advance拒绝MissingBasis，不猜cursor顺序；Unknown是读结果。

### WorkspaceOperationRecord

位置：`crates/domain/src/operation_record.rs`。能力：Stores one immutable replayable local operation result.

```rust
/// Stores one immutable replayable local operation result.
pub struct WorkspaceOperationRecord {
    /// Operation key.
    operation_key: WorkspaceOperationKey,
    /// Input digest.
    request_digest: SafeInputDigest,
    /// Typed committed result.
    result: StoredWorkspaceResult,
    /// Result lookup identity.
    result_ref: WorkspaceOperationRef,
    /// Result partition.
    partition_ref: WorkspacePartitionId,
    /// Affected local revisions.
    revision_basis: LocalCommitBasis,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `operation_key` | `WorkspaceOperationKey` | 已解析稳定key |
| `request_digest` | `SafeInputDigest` | canonical本地请求 |
| `result` | `StoredWorkspaceResult` | commit同事务结果，不能写预期结果 |
| `result_ref` | `WorkspaceOperationRef` | IdPort |
| `partition_ref` | `WorkspacePartitionId` | result必须同一partition |
| `revision_basis` | `LocalCommitBasis` | 从typed result提取，与原子store确认一致 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn matches(&self, digest: &SafeInputDigest) -> bool` | 同key异digest拒绝 |
| `pub fn result(&self) -> &StoredWorkspaceResult` | 内部纯读取，public输出还需现时可见性映射 |
| `pub fn validate_stored(&self) -> Result<(), DomainError>` | key.kind/channel/result.variant/basis匹配，result/partition一致 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn committed(key: WorkspaceOperationKey, digest: SafeInputDigest, result_ref: WorkspaceOperationRef, result: StoredWorkspaceResult) -> Result<Self, DomainError>` | tentative构造，提取partition/basis；只有原子commit返回后对外称committed |

不变量/禁止：无独立状态迁移；同key唯一；unknown无记录不证明rollback；读回不重复业务效果。

CP5组内审查：功能→对象→字段/工厂/函数可反查；无上游写入，状态沿02，本地support见6C；外部槽位未闭合不可构造成功值。gate=pass_with_external_slots。

## CP6 设计记录

capability：显式恢复意图、baseline分批、接续、验证/cutover和失效；输入维护上下文+已有目标+expected+owner proofs，输出本地attempt/candidate状态。诊断：只存baseline_basis却无分页进度无法恢复有界Advance；Superseded无replacement字段不可追溯；安全失效竞态仅靠旧binding不够。取舍：attempt保留OwnerBaselineContinuation/每源coverage进度和replacement，GenerationState记录validated_revision与CutoverBasis；失效栅栏是本地值，绝不替owner权限。终态重试必须新attempt。

| 能力对象 | 字段/构造/函数/状态依据 |
|---|---|
| RebuildAttempt | 下列独立卡片的typed字段、factory、成员和不变量；来源为本组正式输入，owner slot按Step6-A阻塞 |
| GenerationState | 下列独立卡片的typed字段、factory、成员和不变量；来源为本组正式输入，owner slot按Step6-A阻塞 |
| InvalidationRecord | 下列独立卡片的typed字段、factory、成员和不变量；来源为本组正式输入，owner slot按Step6-A阻塞 |

### RebuildAttempt

位置：`crates/domain/src/recovery.rs`。能力：Tracks explicit bounded recovery progress.

```rust
/// Tracks explicit bounded recovery progress.
pub struct RebuildAttempt {
    /// Attempt identity.
    attempt_id: RebuildAttemptId,
    /// Partition identity.
    partition_id: WorkspacePartitionId,
    /// Recovery mode.
    mode: RecoveryMode,
    /// Candidate generation.
    candidate_generation: GenerationId,
    /// Attempt revision.
    attempt_version: AttemptVersion,
    /// Attempt status.
    status: RebuildStatus,
    /// Conditional failure cause.
    failure_basis: Option<RecoveryFailureBasis>,
    /// Owner baseline proof.
    baseline_basis: Option<OwnerBaselineBasis>,
    /// Formal continuation state.
    continuation: Option<OwnerBaselineContinuation>,
    /// Replacement attempt.
    replacement: Option<RebuildAttemptId>,
    /// Cutover partition expectation.
    expected_partition_version: PartitionVersion,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `attempt_id` | `RebuildAttemptId` | Request生成 |
| `partition_id` | `WorkspacePartitionId` | 已有目标 |
| `mode` | `RecoveryMode` | 显式请求 |
| `candidate_generation` | `GenerationId` | Request生成 |
| `attempt_version` | `AttemptVersion` | 每次写checked_next，初始0 |
| `status` | `RebuildStatus` | 初始Requested，迁移仅方法 |
| `failure_basis` | `Option<RecoveryFailureBasis>` | Blocked/Failed必Some，其余None |
| `baseline_basis` | `Option<OwnerBaselineBasis>` | Baselining正式owner输入 |
| `continuation` | `Option<OwnerBaselineContinuation>` | owner分批/事件接续位置；002 blocked |
| `replacement` | `Option<RebuildAttemptId>` | Superseded必Some且已有同partition非自身 |
| `expected_partition_version` | `PartitionVersion` | Request/重新Validating时受控读取 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn start_baseline(&mut self, expected: AttemptVersion) -> Result<(), DomainError>` | Requested→Baselining |
| `pub fn accept_baseline(&mut self, basis: OwnerBaselineBasis, continuation: Option<OwnerBaselineContinuation>, complete: bool, expected: AttemptVersion) -> Result<(), DomainError>` | Baselining自环或→CatchingUp；complete由正式范围证明，不客户端bool |
| `pub fn catch_up(&mut self, continuation: OwnerBaselineContinuation, complete: bool, expected: AttemptVersion) -> Result<(), DomainError>` | CatchingUp自环或→Validating，正式接续证明 |
| `pub fn mark_ready(&mut self, basis: &CutoverBasis, expected: AttemptVersion) -> Result<(), DomainError>` | Validating→Ready，校验candidate/version/coverage/安全basis |
| `pub fn revalidate(&mut self, partition: PartitionVersion, expected: AttemptVersion) -> Result<(), DomainError>` | Ready→Validating，合法并发变化；不允许SafetyBlocked走此路径 |
| `pub fn block(&mut self, failure: RecoveryFailureBasis, expected: AttemptVersion) -> Result<(), DomainError>` | 非终态→Blocked；保留current，failure必填 |
| `pub fn fail(&mut self, failure: RecoveryFailureBasis, expected: AttemptVersion) -> Result<(), DomainError>` | 非终态→Failed；不复活 |
| `pub fn supersede(&mut self, replacement: RebuildAttemptId, expected: AttemptVersion) -> Result<(), DomainError>` | 非终态→Superseded；存在性在service/store校验 |
| `pub fn complete(&mut self, basis: &CutoverBasis, expected: AttemptVersion) -> Result<(), DomainError>` | Ready→Completed tentative，与partition/generation原子commit |
| `pub fn validate_stored(&self) -> Result<(), DomainError>` | 状态条件/版本/同target检查 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn request(id: RebuildAttemptId, partition: WorkspacePartitionId, candidate: GenerationId, mode: RecoveryMode, expected: PartitionVersion) -> Self` | Requested/0，其余Option None |

不变量/禁止：所有迁移先校验expected再一次checked_next；终态一律拒绝，duplicate由操作结果返回不再迁移。

### GenerationState

位置：`crates/domain/src/recovery.rs`。能力：Separates generation selection and validation.

```rust
/// Separates generation selection and validation.
pub struct GenerationState {
    /// Generation identifier.
    generation_id: GenerationId,
    /// Owning partition.
    partition_id: WorkspacePartitionId,
    /// Selection role.
    role: GenerationRole,
    /// Local safety posture.
    safety_state: GenerationSafetyState,
    /// Known invalidations.
    invalidation_refs: Vec<InvalidationId>,
    /// Validated projection revision.
    validated_revision: Option<ViewRevision>,
    /// Local cutover basis.
    cutover_basis: Option<CutoverBasis>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `generation_id` | `GenerationId` | Request生成 |
| `partition_id` | `WorkspacePartitionId` | 已有partition |
| `role` | `GenerationRole` | 初始Candidate |
| `safety_state` | `GenerationSafetyState` | 初始Unverified |
| `invalidation_refs` | `Vec<InvalidationId>` | SafetyBlocked正式失效写入，去重 |
| `validated_revision` | `Option<ViewRevision>` | validate存校验时revision |
| `cutover_basis` | `Option<CutoverBasis>` | validate匹配后的可重核对依据 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&mut self, basis: CutoverBasis) -> Result<(), DomainError>` | Candidate非SafetyBlocked才Validated，记录revision/basis；basis.expected_attempt须等本次mark_ready提交后attempt版本 |
| `pub fn invalidate(&mut self, record: &InvalidationRecord) -> Result<(), DomainError>` | affects且SafetyBlocked设置安全轴/引用，不改role；Candidate清validated_revision/cutover_basis；Current/Retired历史basis可保留但不授权；DataStale不改安全轴 |
| `pub fn promote(&mut self, basis: &CutoverBasis) -> Result<(), DomainError>` | Candidate+Validated且全binding一致才Current；与attempt/partition提交 |
| `pub fn retire(&mut self) -> Result<(), DomainError>` | Current→Retired，安全轴保留 |
| `pub fn invalidate_validation(&mut self) -> Result<(), DomainError>` | Candidate+Validated→Unverified，清除validated_revision/cutover_basis；不清SafetyBlocked |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn candidate(partition: WorkspacePartitionId, id: GenerationId) -> Self` | Candidate/Unverified、空引用、None |

不变量/禁止：Retired/SafetyBlocked不可复活；Current可SafetyBlocked且query拒绝；Validated不等owner授权。

### InvalidationRecord

位置：`crates/domain/src/recovery.rs`。能力：Records one partition's explicit invalidation basis.

```rust
/// Records one partition's explicit invalidation basis.
pub struct InvalidationRecord {
    /// Invalidation identity.
    invalidation_id: InvalidationId,
    /// Existing affected targets.
    target: ExistingWorkspaceTargetSet,
    /// Invalidation authority.
    basis: InvalidationBasis,
    /// Local effect.
    safety_effect: InvalidationEffect,
    /// Stored operation reference.
    operation_ref: WorkspaceOperationRef,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `invalidation_id` | `InvalidationId` | 本地IdPort |
| `target` | `ExistingWorkspaceTargetSet` | store正式枚举已有partition+来源/世代，不猜ref |
| `basis` | `InvalidationBasis` | 正式owner或获准LocalDataStale |
| `safety_effect` | `InvalidationEffect` | Owner明确安全效果或LocalDataStale |
| `operation_ref` | `WorkspaceOperationRef` | 同事务操作结果 |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn affects(&self, partition: WorkspacePartitionId, generation: GenerationId) -> bool` | 仅目标集合关系；新candidate必须受同source安全栅栏检查 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn record(id: InvalidationId, targets: ExistingWorkspaceTargetSet, basis: InvalidationBasis, operation: WorkspaceOperationRef) -> Result<Self, DomainError>` | LocalDataStale仅DataStale；Owner效果由正式proof；targets非空、单分区 |

不变量/禁止：fanout逐分区子操作，不声称全局原子；Query现时owner决定补齐尚未fanout的安全拒绝，不能等待fanout才拒绝。

CP6组内审查：功能→对象→字段/工厂/函数可反查；无上游写入，状态沿02，本地support见6C；外部槽位未闭合不可构造成功值。gate=pass_with_external_slots。

## CP7 设计记录

capability：现时授权的只读组合和稳定分页；输入同一快照/owner当前proof/局部意图，输出Available view或外层SafeReadFailure。诊断：Transient套durable revision、未经允许scope构造假view、分页silent换generation都会泄露/混读。取舍：mode/basis强绑定，Materialized快照版本需当前匹配；安全失败无scope/ref/count/provenance。page游标是本地延续值，不是权限凭证。

| 能力对象 | 字段/构造/函数/状态依据 |
|---|---|
| WorkspaceReadView | 下列独立卡片的typed字段、factory、成员和不变量；来源为本组正式输入，owner slot按Step6-A阻塞 |
| WorkspacePageCursor | 下列独立卡片的typed字段、factory、成员和不变量；来源为本组正式输入，owner slot按Step6-A阻塞 |

### WorkspaceReadView

位置：`crates/domain/src/read_view.rs`。能力：Composes an immutable authorized read model.

```rust
/// Composes an immutable authorized read model.
pub struct WorkspaceReadView {
    /// Authorized scope.
    scope: WorkspaceScope,
    /// Read context.
    read_basis: WorkspaceReadBasis,
    /// Authorized items.
    items: Vec<SafeWorkspaceItem>,
    /// Authorized provenance.
    provenance: Vec<SafeProvenance>,
    /// Data freshness.
    freshness: DataFreshness,
    /// Visible completeness.
    coverage: ReadCoverage,
    /// Optional local continuation.
    next_cursor: Option<WorkspacePageCursor>,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `scope` | `WorkspaceScope` | resolver成功且可公开；否则不构造 |
| `read_basis` | `WorkspaceReadBasis` | 同store快照或Transient source证明 |
| `items` | `Vec<SafeWorkspaceItem>` | 001/003裁剪后内容，exact schema blocked |
| `provenance` | `Vec<SafeProvenance>` | 同决定裁剪；hidden来源不计数 |
| `freshness` | `DataFreshness` | owner版本/水位当前证明 |
| `coverage` | `ReadCoverage` | 声明可见selection的proof；不由空页推Complete |
| `next_cursor` | `Option<WorkspacePageCursor>` | 仅物化稳定分页且还有安全可见项；Transient None |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn assert_no_leak(&self, bindings: &[VisibilityBinding]) -> Result<(), DomainError>` | scope/items/count/provenance逐项适用；不执行I/O |
| `pub fn availability(&self) -> ReadAvailability` | 固定Available，不存可修改状态 |
| `pub fn visibility(&self) -> ReadVisibilityPosture` | 固定AllowedSubset，无allow计算 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn compose(inputs: WorkspaceReadInputs, bindings: Vec<VisibilityBinding>) -> Result<Self, DomainError>` | 输入carrier在本Step noncore闭合；纯计算，MissingBasis不构造部分假view |

不变量/禁止：Available/AllowedSubset为类型不变量不是持久字段；stale仍需当前授权；full count仅Complete可见selection且proof允许。

### WorkspacePageCursor

位置：`crates/domain/src/read_view.rs`。能力：Binds a local materialized continuation.

```rust
/// Binds a local materialized continuation.
pub struct WorkspacePageCursor {
    /// Bound principal.
    principal: ActorId,
    /// Bound partition.
    partition_id: WorkspacePartitionId,
    /// Bound generation.
    generation_id: GenerationId,
    /// Bound view revision.
    view_revision: ViewRevision,
    /// Bound overlay revision.
    local_revision: LocalReadBasis,
    /// Query selection binding.
    query_binding: QueryBinding,
    /// Visibility context reference.
    visibility_basis: VisibilityContextRef,
    /// Last safe visible position.
    position: PagePosition,
}
```

| 字段 | 类型 | 来源 / 约束 / optional |
|---|---|---|
| `principal` | `ActorId` | 当前可信主体 |
| `partition_id` | `WorkspacePartitionId` | 已有分区 |
| `generation_id` | `GenerationId` | 当前generation |
| `view_revision` | `ViewRevision` | 原子读取快照 |
| `local_revision` | `LocalReadBasis` | 同snapshot中的Absent/Present |
| `query_binding` | `QueryBinding` | 正式请求规范化 |
| `visibility_basis` | `VisibilityContextRef` | 003当前语境，非权限凭证 |
| `position` | `PagePosition` | family匹配位置；Source分支001/006 blocked |

| 成员签名 | 参数/返回/效果 |
|---|---|
| `pub fn validate(&self, context: &WorkspaceReadContext) -> Result<(), DomainError>` | 所有轴和query相同且现时proof；不一致CursorInvalid安全映射 |
| `pub fn position(&self) -> &PagePosition` | 只读 |

| 工厂签名 | 来源与初始条件 |
|---|---|
| `pub fn next(context: WorkspaceReadContext, position: PagePosition) -> Result<Self, DomainError>` | 只Materialized、绑定当前快照且position family匹配；无写 |

不变量/禁止：wire token需要codec完整性/保密边界后续Step7/8闭合；透明token也不免现时检查；旧generation/local变化必须重新读。

CP7组内审查：功能→对象→字段/工厂/函数可反查；无上游写入，状态沿02，本地support见6C；外部槽位未闭合不可构造成功值。gate=pass_with_external_slots。

## 字段与状态来源审计

| 对象组 | 已闭合局部来源 | 外部/后续必闭合 | 暂停条件 |
|---|---|---|---|
| CP1 | ID/稳定key/None/partition version | 005正式scope/身份关系 | 无resolver不构造 |
| CP2 | 匹配规则与无写 | 001/003 safe item与当前决定 | 无proof不允许 |
| CP3 | record终局、局部revision、gap关系 | 001/002 comparator/range/cursor/coverage | 不以bool/时间猜完成 |
| CP4 | item id规则、Present/Withdrawn边界 | 004 canonical attention/lifecycle | 不猜待办 |
| CP5 | local变体、版本、stored result | 004 attention关系，Step7 result lookup | 不跨generation抹意图 |
| CP6 | attempt字段/终态、role/safety、失效 | baseline接续/目标范围/现时决定；Step7原子切换 | 无proof不cutover |
| CP7 | read basis、页绑定、多轴姿态 | safe DTO、visibility有效性/codec | 不泄露hidden、no-write |

所有领域方法错误前必须不变更self（先验证/构造候选再替换）；版本是tentative，持久事实以store commit/权威lookup为准。对象卡中外部slot与support载体已与6C/Step7逐项核对；外部schema仍blocked，不能从方法名猜字段。

## 后置历史审计与回填

draft/03的RefreshAttempt、UnreadProjection、SourceCursorState等候选不作为新领域对象；保留当前16主语+纯InboxProjector。旧“read cursor单字段”已在概要来源修订为按stream集合，避免跨source比较；不改变业务能力/owner。正式§5 domain对象片段和字段/函数/工厂表从本附录摘录，过程表不进正式正文。

## 只读成员访问闭口（Step9回源审查）

按每个对象字段表展开只读访问。已有同名成员沿用对象卡的签名；下表补其余字段，不重复定义。service/entry的DI依赖不公开getter，不能借此穿透Query能力隔离。每个下列函数rustdoc为`/// Returns the immutable field value.`；不提供可写借用，不替代可信工厂。

| 对象 | 完整只读签名 | 约束 |
|---|---|---|
| WorkspacePartition | `pub fn partition_id(&self) -> &WorkspacePartitionId` | 只读；实现按显式导出，非授权能力 |
| WorkspacePartition | `pub fn principal(&self) -> &ActorId` | 只读；实现按显式导出，非授权能力 |
| WorkspacePartition | `pub fn scope(&self) -> &WorkspaceScope` | 只读；实现按显式导出，非授权能力 |
| WorkspacePartition | `pub fn partition_version(&self) -> &PartitionVersion` | 只读；实现按显式导出，非授权能力 |
| WorkspacePartition | `pub fn current_generation(&self) -> &Option<GenerationId>` | 只读；实现按显式导出，非授权能力 |
| WorkspaceScope | `pub fn kind(&self) -> &ScopeKind` | 只读；实现按显式导出，非授权能力 |
| WorkspaceScope | `pub fn anchor(&self) -> &OwnerScopeRef` | 只读；实现按显式导出，非授权能力 |
| WorkspaceScope | `pub fn resolution_ref(&self) -> &OwnerResolutionRef` | 只读；实现按显式导出，非授权能力 |
| WorkspaceScope | `pub fn principal(&self) -> &ActorId` | 只读；实现按显式导出，非授权能力 |
| SourceSlice | `pub fn owner(&self) -> &SourceOwner` | 只读；实现按显式导出，非授权能力 |
| SourceSlice | `pub fn scope(&self) -> &WorkspaceScope` | 只读；实现按显式导出，非授权能力 |
| SourceSlice | `pub fn items(&self) -> &Vec<SafeSourceItem>` | 只读；实现按显式导出，非授权能力 |
| SourceSlice | `pub fn version_basis(&self) -> &SourceVersionBasis` | 只读；实现按显式导出，非授权能力 |
| SourceSlice | `pub fn visibility(&self) -> &VisibilityBinding` | 只读；实现按显式导出，非授权能力 |
| VisibilityBinding | `pub fn decision_refs(&self) -> &Vec<OwnerDecisionRef>` | 只读；实现按显式导出，非授权能力 |
| VisibilityBinding | `pub fn principal(&self) -> &ActorId` | 只读；实现按显式导出，非授权能力 |
| VisibilityBinding | `pub fn scope(&self) -> &WorkspaceScope` | 只读；实现按显式导出，非授权能力 |
| VisibilityBinding | `pub fn subject_binding(&self) -> &VisibilitySubjectBinding` | 只读；实现按显式导出，非授权能力 |
| VisibilityBinding | `pub fn validity_basis(&self) -> &OwnerValidityBasis` | 只读；实现按显式导出，非授权能力 |
| SourceApplicationRecord | `pub fn application_key(&self) -> &SourceApplicationKey` | 只读；实现按显式导出，非授权能力 |
| SourceApplicationRecord | `pub fn input_digest(&self) -> &SafeInputDigest` | 只读；实现按显式导出，非授权能力 |
| SourceApplicationRecord | `pub fn outcome(&self) -> &TerminalApplyDisposition` | 只读；实现按显式导出，非授权能力 |
| SourceApplicationRecord | `pub fn result_ref(&self) -> &ApplicationResultRef` | 只读；实现按显式导出，非授权能力 |
| SourceApplicationRecord | `pub fn cursor_basis(&self) -> &SourceCursorBasis` | 只读；实现按显式导出，非授权能力 |
| SourceApplicationRecord | `pub fn view_revision(&self) -> &ViewRevision` | 只读；实现按显式导出，非授权能力 |
| SourceCoverage | `pub fn source(&self) -> &SourceStreamRef` | 只读；实现按显式导出，非授权能力 |
| SourceCoverage | `pub fn applied_cursor(&self) -> &Option<SourceCursor>` | 只读；实现按显式导出，非授权能力 |
| SourceCoverage | `pub fn watermark(&self) -> &Option<OwnerWatermark>` | 只读；实现按显式导出，非授权能力 |
| SourceCoverage | `pub fn coverage_state(&self) -> &CoverageState` | 只读；实现按显式导出，非授权能力 |
| SourceCoverage | `pub fn gap_ref(&self) -> &Option<GapRef>` | 只读；实现按显式导出，非授权能力 |
| SourceCoverage | `pub fn coverage_proof(&self) -> &Option<OwnerCoverageProof>` | 只读；实现按显式导出，非授权能力 |
| PartitionProjection | `pub fn partition_id(&self) -> &WorkspacePartitionId` | 只读；实现按显式导出，非授权能力 |
| PartitionProjection | `pub fn generation_id(&self) -> &GenerationId` | 只读；实现按显式导出，非授权能力 |
| PartitionProjection | `pub fn view_revision(&self) -> &ViewRevision` | 只读；实现按显式导出，非授权能力 |
| PartitionProjection | `pub fn source_slices(&self) -> &Vec<SourceSlice>` | 只读；实现按显式导出，非授权能力 |
| PartitionProjection | `pub fn inbox_items(&self) -> &Vec<InboxItem>` | 只读；实现按显式导出，非授权能力 |
| PartitionProjection | `pub fn coverage(&self) -> &Vec<SourceCoverage>` | 只读；实现按显式导出，非授权能力 |
| InboxItem | `pub fn item_id(&self) -> &InboxItemId` | 只读；实现按显式导出，非授权能力 |
| InboxItem | `pub fn source_attention_ref(&self) -> &OwnerAttentionRef` | 只读；实现按显式导出，非授权能力 |
| InboxItem | `pub fn attention_version(&self) -> &OwnerAttentionVersion` | 只读；实现按显式导出，非授权能力 |
| InboxItem | `pub fn attention_state(&self) -> &AttentionState` | 只读；实现按显式导出，非授权能力 |
| InboxItem | `pub fn source_ref(&self) -> &OwnerSubjectRef` | 只读；实现按显式导出，非授权能力 |
| InboxItem | `pub fn generation_id(&self) -> &GenerationId` | 只读；实现按显式导出，非授权能力 |
| InboxItem | `pub fn source_application_ref(&self) -> &ApplicationResultRef` | 只读；实现按显式导出，非授权能力 |
| LocalAttentionState | `pub fn partition_id(&self) -> &WorkspacePartitionId` | 只读；实现按显式导出，非授权能力 |
| LocalAttentionState | `pub fn principal(&self) -> &ActorId` | 只读；实现按显式导出，非授权能力 |
| LocalAttentionState | `pub fn local_revision(&self) -> &LocalRevision` | 只读；实现按显式导出，非授权能力 |
| LocalAttentionState | `pub fn read_cursors(&self) -> &Vec<ReadCursor>` | 只读；实现按显式导出，非授权能力 |
| LocalAttentionState | `pub fn dispositions(&self) -> &Vec<LocalDisposition>` | 只读；实现按显式导出，非授权能力 |
| LocalAttentionState | `pub fn preferences(&self) -> &WorkspacePreferenceValues` | 只读；实现按显式导出，非授权能力 |
| LocalAttentionState | `pub fn last_opened(&self) -> &Option<OwnerSubjectRef>` | 只读；实现按显式导出，非授权能力 |
| LocalAttentionState | `pub fn focus(&self) -> &Option<OwnerSubjectRef>` | 只读；实现按显式导出，非授权能力 |
| ReadCursor | `pub fn stream(&self) -> &AttentionStreamRef` | 只读；实现按显式导出，非授权能力 |
| ReadCursor | `pub fn read_basis(&self) -> &Option<AttentionReadBasis>` | 只读；实现按显式导出，非授权能力 |
| ReadCursor | `pub fn unread_overrides(&self) -> &Vec<InboxItemId>` | 只读；实现按显式导出，非授权能力 |
| ReadCursor | `pub fn intent_revision(&self) -> &LocalRevision` | 只读；实现按显式导出，非授权能力 |
| WorkspaceOperationRecord | `pub fn operation_key(&self) -> &WorkspaceOperationKey` | 只读；实现按显式导出，非授权能力 |
| WorkspaceOperationRecord | `pub fn request_digest(&self) -> &SafeInputDigest` | 只读；实现按显式导出，非授权能力 |
| WorkspaceOperationRecord | `pub fn result_ref(&self) -> &WorkspaceOperationRef` | 只读；实现按显式导出，非授权能力 |
| WorkspaceOperationRecord | `pub fn partition_ref(&self) -> &WorkspacePartitionId` | 只读；实现按显式导出，非授权能力 |
| WorkspaceOperationRecord | `pub fn revision_basis(&self) -> &LocalCommitBasis` | 只读；实现按显式导出，非授权能力 |
| RebuildAttempt | `pub fn attempt_id(&self) -> &RebuildAttemptId` | 只读；实现按显式导出，非授权能力 |
| RebuildAttempt | `pub fn partition_id(&self) -> &WorkspacePartitionId` | 只读；实现按显式导出，非授权能力 |
| RebuildAttempt | `pub fn mode(&self) -> &RecoveryMode` | 只读；实现按显式导出，非授权能力 |
| RebuildAttempt | `pub fn candidate_generation(&self) -> &GenerationId` | 只读；实现按显式导出，非授权能力 |
| RebuildAttempt | `pub fn attempt_version(&self) -> &AttemptVersion` | 只读；实现按显式导出，非授权能力 |
| RebuildAttempt | `pub fn status(&self) -> &RebuildStatus` | 只读；实现按显式导出，非授权能力 |
| RebuildAttempt | `pub fn failure_basis(&self) -> &Option<RecoveryFailureBasis>` | 只读；实现按显式导出，非授权能力 |
| RebuildAttempt | `pub fn baseline_basis(&self) -> &Option<OwnerBaselineBasis>` | 只读；实现按显式导出，非授权能力 |
| RebuildAttempt | `pub fn continuation(&self) -> &Option<OwnerBaselineContinuation>` | 只读；实现按显式导出，非授权能力 |
| RebuildAttempt | `pub fn replacement(&self) -> &Option<RebuildAttemptId>` | 只读；实现按显式导出，非授权能力 |
| RebuildAttempt | `pub fn expected_partition_version(&self) -> &PartitionVersion` | 只读；实现按显式导出，非授权能力 |
| GenerationState | `pub fn generation_id(&self) -> &GenerationId` | 只读；实现按显式导出，非授权能力 |
| GenerationState | `pub fn partition_id(&self) -> &WorkspacePartitionId` | 只读；实现按显式导出，非授权能力 |
| GenerationState | `pub fn role(&self) -> &GenerationRole` | 只读；实现按显式导出，非授权能力 |
| GenerationState | `pub fn safety_state(&self) -> &GenerationSafetyState` | 只读；实现按显式导出，非授权能力 |
| GenerationState | `pub fn invalidation_refs(&self) -> &Vec<InvalidationId>` | 只读；实现按显式导出，非授权能力 |
| GenerationState | `pub fn validated_revision(&self) -> &Option<ViewRevision>` | 只读；实现按显式导出，非授权能力 |
| GenerationState | `pub fn cutover_basis(&self) -> &Option<CutoverBasis>` | 只读；实现按显式导出，非授权能力 |
| InvalidationRecord | `pub fn invalidation_id(&self) -> &InvalidationId` | 只读；实现按显式导出，非授权能力 |
| InvalidationRecord | `pub fn target(&self) -> &ExistingWorkspaceTargetSet` | 只读；实现按显式导出，非授权能力 |
| InvalidationRecord | `pub fn basis(&self) -> &InvalidationBasis` | 只读；实现按显式导出，非授权能力 |
| InvalidationRecord | `pub fn safety_effect(&self) -> &InvalidationEffect` | 只读；实现按显式导出，非授权能力 |
| InvalidationRecord | `pub fn operation_ref(&self) -> &WorkspaceOperationRef` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadView | `pub fn scope(&self) -> &WorkspaceScope` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadView | `pub fn read_basis(&self) -> &WorkspaceReadBasis` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadView | `pub fn items(&self) -> &Vec<SafeWorkspaceItem>` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadView | `pub fn provenance(&self) -> &Vec<SafeProvenance>` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadView | `pub fn freshness(&self) -> &DataFreshness` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadView | `pub fn coverage(&self) -> &ReadCoverage` | 只读；实现按显式导出，非授权能力 |
| WorkspaceReadView | `pub fn next_cursor(&self) -> &Option<WorkspacePageCursor>` | 只读；实现按显式导出，非授权能力 |
| WorkspacePageCursor | `pub fn principal(&self) -> &ActorId` | 只读；实现按显式导出，非授权能力 |
| WorkspacePageCursor | `pub fn partition_id(&self) -> &WorkspacePartitionId` | 只读；实现按显式导出，非授权能力 |
| WorkspacePageCursor | `pub fn generation_id(&self) -> &GenerationId` | 只读；实现按显式导出，非授权能力 |
| WorkspacePageCursor | `pub fn view_revision(&self) -> &ViewRevision` | 只读；实现按显式导出，非授权能力 |
| WorkspacePageCursor | `pub fn local_revision(&self) -> &LocalReadBasis` | 只读；实现按显式导出，非授权能力 |
| WorkspacePageCursor | `pub fn query_binding(&self) -> &QueryBinding` | 只读；实现按显式导出，非授权能力 |
| WorkspacePageCursor | `pub fn visibility_basis(&self) -> &VisibilityContextRef` | 只读；实现按显式导出，非授权能力 |
