# Step6 U7 引用/snapshot/索引对象小循环

## 思考、诊断与取舍

capability：引用/snapshot/索引，只承接本地truth/引用/guard/readsurface。前序HLD给轮廓，本批先检查功能与所有字段、factory、methods来源。采用分离实体/immutable组合/策略/视图，拒绝把qualified输入暴露给客户端或复制owner正文。所有ref不足以自证authority；当前owner/SDK positive仍blocked。

## capability与对象映射

| 对象 | 能力 / 功能 | 类别 / 归属 | 字段与函数 / 状态来源 | 后续承接 |
|---|---|---|---|---|
| TypedOwnerReference | typed引用/contract绑定，不解析opaque值；无canonical映射不默认string-ref | contracts / immutable/value | owner_kind_ref,canonical_ref,contract_ref；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| QualifiedReferenceSnapshot | 本次正式来源qualified才替换shadow；失败与旧合法摘要保留，不改业务truth；不可见/不支持/缺失或无安全旧材料，禁新positive；首个qualified切片，不空填默认 | domain / statecarrier | snapshot_ref,source_ref,source_version,safe_material,validity_ref,state,revision；Qualified/Stale/Unavailable | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| QualifiedReadContext | 按正式结果裁剪subject/summary/count/suggest；只读scope/visibility，不refresh业务snapshot | domain / immutable/value | scope_ref,disclosure_ref,source_constraints；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| ReadProjection | 只派生维护姿态；typed plan、固定cursor、非空typed来源；安全完整shadow原子替换，不partial masquerade；缺plan/失败保守不可用，不删truth；初始Stale，无从旧index造truth | domain / statecarrier | projection_ref,kind,scope_ref,source_cursor,snapshot_refs,view_keys,state,revision；Fresh/Stale/Rebuilding/Unavailable | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| ReadBoundaryPolicy | 安全read surface；缺源不凭index证明可见；stateless策略/typed view assembler调用，不新增truth | domain / guard | requirements；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |

对象能力到字段/函数：上表每一行字段闭包承接该对象能力；下方每字段明确来源，完整签名承接对应状态，不以overview替代。初值只factory提供，其余owner/current字段由正式port与typed读取。修正Draft可无review、Blocked可无source摘要；公开视图采用SafeReadContext，不依赖domain。

### TypedOwnerReference

```rust
/// Carries TypedOwnerReference with explicit sources and no upstream body.
pub struct TypedOwnerReference {
    /// Carries owner_kind_ref; see the source and invariant table.
    pub owner_kind_ref: QualifiedOwnerKindRef,
    /// Carries canonical_ref; see the source and invariant table.
    pub canonical_ref: CanonicalOwnerRef,
    /// Carries contract_ref; see the source and invariant table.
    pub contract_ref: OwnerConsumerContractRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| owner_kind_ref | `QualifiedOwnerKindRef` | 正式owner kind映射，不以UI五类型定义enum |
| canonical_ref | `CanonicalOwnerRef` | 正式owner/SDK提供opaque ref |
| contract_ref | `OwnerConsumerContractRef` | 当前operation/consumer正式资格来源 |

归属：contracts；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn matches(&self, input: OwnerReferenceContext) -> bool` | typed引用/contract绑定，不解析opaque值 | OwnerReferenceContext input：typed原对象/正式port qualified输入，不调用I/O | bool；纯读取，不改变状态 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn from_resolver(input: QualifiedOwnerReferenceInput) -> Result<Self, DomainError>` | QualifiedOwnerReferenceInput的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | 无canonical映射不默认string-ref；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: TypedOwnerReferenceRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### QualifiedReferenceSnapshot

```rust
/// Carries QualifiedReferenceSnapshot with explicit sources and no upstream body.
pub struct QualifiedReferenceSnapshot {
    /// Carries snapshot_ref; see the source and invariant table.
    pub snapshot_ref: QualifiedReferenceSnapshotRef,
    /// Carries source_ref; see the source and invariant table.
    pub source_ref: TypedOwnerReference,
    /// Carries source_version; see the source and invariant table.
    pub source_version: OwnerVersionRef,
    /// Carries safe_material; see the source and invariant table.
    pub safe_material: QualifiedSnapshotMaterial,
    /// Carries validity_ref; see the source and invariant table.
    pub validity_ref: SourceValidityRef,
    /// Carries state; see the source and invariant table.
    pub state: ReferenceSnapshotState,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| snapshot_ref | `QualifiedReferenceSnapshotRef` | 本地ID |
| source_ref | `TypedOwnerReference` | 正式来源 |
| source_version | `OwnerVersionRef` | 来源版本/cursor |
| safe_material | `QualifiedSnapshotMaterial` | finite source/publisher/material/decision/receiver/notice/observation safe切片；无正文 |
| validity_ref | `SourceValidityRef` | 正式owner有效性，非本地fresh自证 |
| state | `ReferenceSnapshotState` | Qualified/Stale/Unavailable |
| revision | `MarketRevision` | 更新CAS来源 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn refresh(&mut self, input: QualifiedSnapshotInput) -> Result<(), DomainError>` | 本次正式来源qualified才替换shadow | QualifiedSnapshotInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn mark_stale(&mut self, input: SourceRefreshFailureInput) -> Result<(), DomainError>` | 失败与旧合法摘要保留，不改业务truth | SourceRefreshFailureInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn mark_unavailable(&mut self, input: SourceRefreshFailureInput) -> Result<(), DomainError>` | 不可见/不支持/缺失或无安全旧材料，禁新positive | SourceRefreshFailureInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn capture(input: QualifiedSnapshotInput) -> Result<Self, DomainError>` | QualifiedSnapshotInput的独立字段schema见shared_types；Qualified；完整safe_material/version/validity | 首个qualified切片，不空填默认；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: QualifiedReferenceSnapshotRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

初始：Qualified；完整safe_material/version/validity。binding只exacttyped比较，缺合同不fallback，state/status语义不外推。immutable source_ref/type不可修改；正式refresh可以更新source_version/safe_material/validity_ref且成对CAS，固定publication basis不得改变，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### QualifiedReadContext

```rust
/// Carries QualifiedReadContext with explicit sources and no upstream body.
pub struct QualifiedReadContext {
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries disclosure_ref; see the source and invariant table.
    pub disclosure_ref: DisclosureDecisionRef,
    /// Carries source_constraints; see the source and invariant table.
    pub source_constraints: SourceVisibilityConstraintSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| scope_ref | `MarketScopeRef` | 正式scope resolver |
| disclosure_ref | `DisclosureDecisionRef` | 当前披露依据，不由ref或public标签猜 |
| source_constraints | `SourceVisibilityConstraintSet` | owner/市场/组织交集 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn permits(&self, subject: ReadSubjectInput) -> bool` | 按正式结果裁剪subject/summary/count/suggest | ReadSubjectInput subject：typed原对象/正式port qualified输入，不调用I/O | bool；纯读取，不改变状态 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn resolve(input: QualifiedReadInput) -> Result<Self, DomainError>` | QualifiedReadInput的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | 只读scope/visibility，不refresh业务snapshot；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: QualifiedReadContextRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### ReadProjection

```rust
/// Carries ReadProjection with explicit sources and no upstream body.
pub struct ReadProjection {
    /// Carries projection_ref; see the source and invariant table.
    pub projection_ref: MarketProjectionRef,
    /// Carries kind; see the source and invariant table.
    pub kind: MarketProjectionKind,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries source_cursor; see the source and invariant table.
    pub source_cursor: MarketSourceCursor,
    /// Carries snapshot_refs; see the source and invariant table.
    pub snapshot_refs: QualifiedReferenceSnapshotRefSet,
    /// Carries view_keys; see the source and invariant table.
    pub view_keys: MarketReadViewKeySet,
    /// Carries state; see the source and invariant table.
    pub state: ReadProjectionState,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| projection_ref | `MarketProjectionRef` | 本地typed projection identity |
| kind | `MarketProjectionKind` | Catalog/Progress/Impact/Audit四有限切片族 |
| scope_ref | `MarketScopeRef` | 不可跨scope复用 |
| source_cursor | `MarketSourceCursor` | 重建committed facts稳定cursor |
| snapshot_refs | `QualifiedReferenceSnapshotRefSet` | typed safe来源 |
| view_keys | `MarketReadViewKeySet` | view kind+market subject+scope身份，非解析opaque字符串 |
| state | `ReadProjectionState` | Fresh/Stale/Rebuilding/Unavailable |
| revision | `MarketRevision` | rebuild compare与原子发布 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn mark_stale(&mut self, input: ProjectionInvalidationInput) -> Result<(), DomainError>` | 只派生维护姿态 | ProjectionInvalidationInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn begin_rebuild(&mut self, input: ProjectionRebuildPlanInput) -> Result<(), DomainError>` | typed plan、固定cursor、非空typed来源 | ProjectionRebuildPlanInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn publish(&mut self, input: ProjectionBuildOutcomeInput) -> Result<(), DomainError>` | 安全完整shadow原子替换，不partial masquerade | ProjectionBuildOutcomeInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn mark_unavailable(&mut self, input: ProjectionBuildFailureInput) -> Result<(), DomainError>` | 缺plan/失败保守不可用，不删truth | ProjectionBuildFailureInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn initialize(input: ProjectionCreationInput) -> Result<Self, DomainError>` | ProjectionCreationInput的独立字段schema见shared_types；Stale；snapshot/viewkeys=[]；固定初始sourcecursor | 初始Stale，无从旧index造truth；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: ReadProjectionRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

初始：Stale；snapshot/viewkeys=[]；固定初始sourcecursor。binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### ReadBoundaryPolicy

```rust
/// Carries ReadBoundaryPolicy with explicit sources and no upstream body.
pub struct ReadBoundaryPolicy {
    /// Carries requirements; see the source and invariant table.
    pub requirements: ReadBoundaryRequirements,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| requirements | `ReadBoundaryRequirements` | 正式disclosure/sourcevisibility交集 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn evaluate(&self, context: QualifiedReadContext, subject: ReadSubjectInput, source: ReadSourceInspectionInput) -> Result<LocalGateResult, DomainError>` | 安全read surface；缺源不凭index证明可见 | QualifiedReadContext context；ReadSubjectInput subject；ReadSourceInspectionInput source：typed原对象/正式port qualified输入，不调用I/O | Result<LocalGateResult, DomainError>；纯读取，不改变状态 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn new(requirements: ReadBoundaryRequirements) -> Result<Self, DomainError>` | formal适用规则输入，禁config豁免 | stateless guard，不新增truth |
| `pub fn rehydrate(row: ReadBoundaryPolicyRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


## Step10读取辅助字段回修

QualifiedReadContext/QualifiedReadInput只持有resolved scope_ref/disclosure_ref/source_constraints，Coreactor/QueryMetadata唯一在QueryEnvelope/application中，不生成本地MarketContextRef、不存query CoreContextRecord。删除未使用SharedQueryMetadataReference，修正HLD内侧读取辅助字段来源；对外16Query schema/业务范围未改变。QualifiedReadContextRow仅本体schema镜像，不代表query持久表；ReadBoundaryPolicy纯guard消费当前resolver输出。

## 模块内停审

功能均有独立对象承接；字段来源含candidate/lookup/formalport/ID/CAS；factory与typedrow完整，views与业务state分轴。当前批次结构审查通过，外部positive blocked不改变。下一模块才创建其附录；不会提前创建Step7/8文件。
