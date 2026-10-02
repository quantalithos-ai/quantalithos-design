# Step8 U7 引用/snapshot/索引协议族小循环

## 思考、诊断与取舍

本族只处理引用/snapshot/索引，Requestbody均是候选/localintent而不是qualificationtruth。采用独立DTO与safe result/readmodel，ownerfields由Step7formalports核验；拒绝使用callerprovided Approved/Verified/Installed/Delivered。前序对象state不以UI语言改变，unsafe unknownfields拒绝。sharedsurface只统一Envelope/错误/分页，不替代本族逐协议schema。

## 定义批次表

| 协议 | 类别 | 对象 / view | port/构造 | flow |
|---|---|---|---|---|
| GetReferenceFreshness | Query | QualifiedReferenceSnapshot / ReferenceFreshnessView | SnapshotStore.load_snapshot state+body→current披露marker | Step9 get_reference_freshness |
| GetProjectionFreshness | Query | ReadProjection / ProjectionFreshnessView | ProjectionStore.load_projection pair→scope-bound marker | Step9 get_projection_freshness |
| RefreshQualifiedReferences | Job | QualifiedReferenceSnapshot / ReferenceRefreshReport | formal SourceOwner.read_snapshot→snapshot.refresh/stale/unavailable，不业务truthrepair | Step9 refresh_qualified_references |
| RebuildMarketReadProjection | Job | ReadProjection / ProjectionRebuildReport | typednonemptyplan+committedfacts+qualifiedsnapshots→projection.begin_rebuild/publish | Step9 rebuild_market_read_projection |

### GetReferenceFreshness

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn get_reference_freshness(&self, request: QueryEnvelope<GetReferenceFreshnessRequest>) -> Result<ReadSurface<ReferenceFreshnessView>, MarketError>` |
| transport | POST /api/marketplace/v1/queries/get-reference-freshness |
| 处理方 | MarketplaceApplication<P> / reference_read / planned get_reference_freshness.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | SnapshotStore.load_snapshot state+body→current披露marker |

#### 请求schema与构造来源

### GetReferenceFreshnessRequest

```rust
/// Carries GetReferenceFreshnessRequest with explicit sources and no upstream body.
pub struct GetReferenceFreshnessRequest {
    /// Carries snapshot_ref; see the source and invariant table.
    pub snapshot_ref: QualifiedReferenceSnapshotRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| snapshot_ref | `QualifiedReferenceSnapshotRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | SnapshotStore.load_snapshot state+body→current披露marker；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | currentScope + CoreQueryMetadata.page/consistency唯一；不写ContextRecord | 读取失败typedDegraded；不reserve |

#### 完整输出schema

返回ReadSurface<ReferenceFreshnessView>，Ready QualifiedPage.items为本类型的typedreadmodel；Empty/NotVisible/Missing/Degraded独立安全分支，无requiredID假填。

### ReferenceFreshnessView

```rust
/// Carries ReferenceFreshnessView with explicit sources and no upstream body.
pub struct ReferenceFreshnessView {
    /// Carries snapshot_ref; see the source and invariant table.
    pub snapshot_ref: QualifiedReferenceSnapshotRef,
    /// Carries source_ref; see the source and invariant table.
    pub source_ref: TypedOwnerReference,
    /// Carries source_version; see the source and invariant table.
    pub source_version: OwnerVersionRef,
    /// Carries validity_ref; see the source and invariant table.
    pub validity_ref: SourceValidityRef,
    /// Carries state; see the source and invariant table.
    pub state: ReferenceSnapshotState,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| snapshot_ref | `QualifiedReferenceSnapshotRef` | typedstate+body成对读取后仅safe可见字段，Unavailable不返回旧material |
| source_ref | `TypedOwnerReference` | typedstate+body成对读取后仅safe可见字段，Unavailable不返回旧material |
| source_version | `OwnerVersionRef` | typedstate+body成对读取后仅safe可见字段，Unavailable不返回旧material |
| validity_ref | `SourceValidityRef` | typedstate+body成对读取后仅safe可见字段，Unavailable不返回旧material |
| state | `ReferenceSnapshotState` | typedstate+body成对读取后仅safe可见字段，Unavailable不返回旧material |

归属：contracts；typedstate+body成对读取后仅safe可见字段，Unavailable不返回旧material


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。typedentity→readmodel每同名字段逐字段copy，status由currentReadSurface而不是owner approval；scope/page/token不重复。

#### 失败、幂等与审计

no-write：所有save/append/reserve/refresh/rebuild/dispatch/ID/Clock为零；当前scope先于typed读，数量/提示/详情/分页同一visibility交集。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### GetProjectionFreshness

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn get_projection_freshness(&self, request: QueryEnvelope<GetProjectionFreshnessRequest>) -> Result<ReadSurface<ProjectionFreshnessView>, MarketError>` |
| transport | POST /api/marketplace/v1/queries/get-projection-freshness |
| 处理方 | MarketplaceApplication<P> / reference_read / planned get_projection_freshness.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | ProjectionStore.load_projection pair→scope-bound marker |

#### 请求schema与构造来源

### GetProjectionFreshnessRequest

```rust
/// Carries GetProjectionFreshnessRequest with explicit sources and no upstream body.
pub struct GetProjectionFreshnessRequest {
    /// Carries projection_ref; see the source and invariant table.
    pub projection_ref: MarketProjectionRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| projection_ref | `MarketProjectionRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | ProjectionStore.load_projection pair→scope-bound marker；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | currentScope + CoreQueryMetadata.page/consistency唯一；不写ContextRecord | 读取失败typedDegraded；不reserve |

#### 完整输出schema

返回ReadSurface<ProjectionFreshnessView>，Ready QualifiedPage.items为本类型的typedreadmodel；Empty/NotVisible/Missing/Degraded独立安全分支，无requiredID假填。

### ProjectionFreshnessView

```rust
/// Carries ProjectionFreshnessView with explicit sources and no upstream body.
pub struct ProjectionFreshnessView {
    /// Carries projection_ref; see the source and invariant table.
    pub projection_ref: MarketProjectionRef,
    /// Carries kind; see the source and invariant table.
    pub kind: MarketProjectionKind,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries state; see the source and invariant table.
    pub state: ReadProjectionState,
    /// Carries source_cursor; see the source and invariant table.
    pub source_cursor: MarketSourceCursor,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| projection_ref | `MarketProjectionRef` | 同scope typedmarker，不曝隐藏key/计数，不Fresh自证readiness |
| kind | `MarketProjectionKind` | 同scope typedmarker，不曝隐藏key/计数，不Fresh自证readiness |
| scope_ref | `MarketScopeRef` | 同scope typedmarker，不曝隐藏key/计数，不Fresh自证readiness |
| state | `ReadProjectionState` | 同scope typedmarker，不曝隐藏key/计数，不Fresh自证readiness |
| source_cursor | `MarketSourceCursor` | 同scope typedmarker，不曝隐藏key/计数，不Fresh自证readiness |

归属：contracts；同scope typedmarker，不曝隐藏key/计数，不Fresh自证readiness


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。typedentity→readmodel每同名字段逐字段copy，status由currentReadSurface而不是owner approval；scope/page/token不重复。

#### 失败、幂等与审计

no-write：所有save/append/reserve/refresh/rebuild/dispatch/ID/Clock为零；当前scope先于typed读，数量/提示/详情/分页同一visibility交集。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### RefreshQualifiedReferences

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn refresh_qualified_references(&self, request: JobEnvelope<RefreshQualifiedReferencesRequest>) -> Result<ExecutionResult<ReferenceRefreshReport>, MarketError>` |
| transport | worker-internal refresh_qualified_references |
| 处理方 | MarketplaceApplication<P> / reference_read / planned refresh_qualified_references.rs |
| caller | trustedworker system/operator，非Web/公开HTTP |
| 目标能力 | formal SourceOwner.read_snapshot→snapshot.refresh/stale/unavailable，不业务truthrepair |

#### 请求schema与构造来源

### RefreshQualifiedReferencesRequest

```rust
/// Carries RefreshQualifiedReferencesRequest with explicit sources and no upstream body.
pub struct RefreshQualifiedReferencesRequest {
    /// Carries snapshot_refs; see the source and invariant table.
    pub snapshot_refs: QualifiedReferenceSnapshotRefSet,
    /// Carries work_ref; see the source and invariant table.
    pub work_ref: DeferredWorkRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| snapshot_refs | `QualifiedReferenceSnapshotRefSet` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| work_ref | `DeferredWorkRef` | durableworkbody与context.fence.work_ref一致；不会来自URL/任意cron字符串 |

归属：contracts；internal only冻结plan/selector/target一致；batch非空有上限，缺planblocked

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | formal SourceOwner.read_snapshot→snapshot.refresh/stale/unavailable，不业务truthrepair；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| context.request + fence | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |
| 冻结work/plan | load_work + load_plan；bodytarget/work_ref=context.fence.work_ref，维护plan/currentcursor必须原冻结值；reconcile允许原dispatchplan同target但不改原effectintent | mismatch/planmissing blocked，no private map/rescan |

#### 完整输出schema

返回ExecutionResult<ReferenceRefreshReport>；本族Report是完整MarketJobReport别名，逐itemtarget/outcome/failure/bases/intent/cursor和work/fence/audit/spawnedwork均保留。

### ReferenceRefreshReport

```rust
/// Provides the documented local ReferenceRefreshReport carrier.
pub type ReferenceRefreshReport = MarketJobReport;
```

归属：contracts；完整字段schema见Step6 shared_types MarketJobReport与Step8 sharedsurface，不能删逐项结果


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 每次boundedbatch完整report accepted保存同state/audit/spawnedworkUoW；unknown外effect保留原intent和probe责任，不把Reported当ready。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### RebuildMarketReadProjection

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn rebuild_market_read_projection(&self, request: JobEnvelope<RebuildMarketReadProjectionRequest>) -> Result<ExecutionResult<ProjectionRebuildReport>, MarketError>` |
| transport | worker-internal rebuild_market_read_projection |
| 处理方 | MarketplaceApplication<P> / reference_read / planned rebuild_market_read_projection.rs |
| caller | trustedworker system/operator，非Web/公开HTTP |
| 目标能力 | typednonemptyplan+committedfacts+qualifiedsnapshots→projection.begin_rebuild/publish |

#### 请求schema与构造来源

### RebuildMarketReadProjectionRequest

```rust
/// Carries RebuildMarketReadProjectionRequest with explicit sources and no upstream body.
pub struct RebuildMarketReadProjectionRequest {
    /// Carries projection_ref; see the source and invariant table.
    pub projection_ref: MarketProjectionRef,
    /// Carries work_ref; see the source and invariant table.
    pub work_ref: DeferredWorkRef,
    /// Carries plan; see the source and invariant table.
    pub plan: ProjectionRebuildPlanInput,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| projection_ref | `MarketProjectionRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| work_ref | `DeferredWorkRef` | durableworkbody与context.fence.work_ref一致；不会来自URL/任意cron字符串 |
| plan | `ProjectionRebuildPlanInput` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；internal only冻结plan/selector/target一致；batch非空有上限，缺planblocked

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | typednonemptyplan+committedfacts+qualifiedsnapshots→projection.begin_rebuild/publish；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| context.request + fence | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |
| 冻结work/plan | load_work + load_plan；bodytarget/work_ref=context.fence.work_ref，维护plan/currentcursor必须原冻结值；reconcile允许原dispatchplan同target但不改原effectintent | mismatch/planmissing blocked，no private map/rescan |

#### 完整输出schema

返回ExecutionResult<ProjectionRebuildReport>；本族Report是完整MarketJobReport别名，逐itemtarget/outcome/failure/bases/intent/cursor和work/fence/audit/spawnedwork均保留。

### ProjectionRebuildReport

```rust
/// Provides the documented local ProjectionRebuildReport carrier.
pub type ProjectionRebuildReport = MarketJobReport;
```

归属：contracts；完整字段schema见Step6 shared_types MarketJobReport与Step8 sharedsurface，不能删逐项结果


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 每次boundedbatch完整report accepted保存同state/audit/spawnedworkUoW；unknown外effect保留原intent和probe责任，不把Reported当ready。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


## 协议族停审

本族所有DTO字段有source/missing规则，response二级types唯一归属，Coremeta/actor/key/page无双承载；无activeevent/ownertruth复制；下一族方可创建。外部exact资格保持blocked，不宣称运行测试通过。
