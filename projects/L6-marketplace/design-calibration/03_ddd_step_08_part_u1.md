# Step8 U1 来源/发布责任协议族小循环

## 思考、诊断与取舍

本族只处理来源/发布责任，Requestbody均是候选/localintent而不是qualificationtruth。采用独立DTO与safe result/readmodel，ownerfields由Step7formalports核验；拒绝使用callerprovided Approved/Verified/Installed/Delivered。前序对象state不以UI语言改变，unsafe unknownfields拒绝。sharedsurface只统一Envelope/错误/分页，不替代本族逐协议schema。

## 定义批次表

| 协议 | 类别 | 对象 / view | port/构造 | flow |
|---|---|---|---|---|
| BindPublisherRelation | Command | PublisherRelation / PublisherRelationResult | PublisherRelation.bind / PublisherAuthorityPort.resolve_publisher | Step9 bind_publisher_relation |
| ReleasePublisherRelation | Command | PublisherRelation / PublisherRelationResult | PublisherRelation.release + SourceVerification.invalidate / formal exactoperation | Step9 release_publisher_relation |
| VerifyPublicationSource | Command | SourceVerification / SourceQualificationResult | SourceBinding/MaterialReference factory + SourceGatePolicy.evaluate + SourceVerification.start/record / SourceOwner/Material/Publisher ports | Step9 verify_publication_source |
| GetSourceQualification | Query | SourceVerification / SourceQualificationReadModel | MarketStore.load_verification/load_qualification_outcome + typed snapshot | Step9 get_source_qualification |

### BindPublisherRelation

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn bind_publisher_relation(&self, request: CommandEnvelope<BindPublisherRelationRequest>) -> Result<ExecutionResult<PublisherRelationResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/bind-publisher-relation |
| 处理方 | MarketplaceApplication<P> / source_responsibility / planned bind_publisher_relation.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | PublisherRelation.bind / PublisherAuthorityPort.resolve_publisher |

#### 请求schema与构造来源

### BindPublisherRelationRequest

```rust
/// Carries BindPublisherRelationRequest with explicit sources and no upstream body.
pub struct BindPublisherRelationRequest {
    /// Carries principal_candidate; see the source and invariant table.
    pub principal_candidate: String,
    /// Carries requested_scope; see the source and invariant table.
    pub requested_scope: Option<MarketScopeRef>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| principal_candidate | `String` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| requested_scope | `Option<MarketScopeRef>` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | PublisherRelation.bind / PublisherAuthorityPort.resolve_publisher；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<PublisherRelationResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### PublisherRelationResult

```rust
/// Carries PublisherRelationResult with explicit sources and no upstream body.
pub struct PublisherRelationResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries relation_ref; see the source and invariant table.
    pub relation_ref: PublisherRelationRef,
    /// Carries state; see the source and invariant table.
    pub state: PublisherRelationState,
    /// Carries principal_ref; see the source and invariant table.
    pub principal_ref: PublisherPrincipalRef,
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: PublisherAuthorityRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| relation_ref | `PublisherRelationRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `PublisherRelationState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| principal_ref | `PublisherPrincipalRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| authority_ref | `PublisherAuthorityRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| scope_ref | `MarketScopeRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### ReleasePublisherRelation

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn release_publisher_relation(&self, request: CommandEnvelope<ReleasePublisherRelationRequest>) -> Result<ExecutionResult<PublisherRelationResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/release-publisher-relation |
| 处理方 | MarketplaceApplication<P> / source_responsibility / planned release_publisher_relation.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | PublisherRelation.release + SourceVerification.invalidate / formal exactoperation |

#### 请求schema与构造来源

### ReleasePublisherRelationRequest

```rust
/// Carries ReleasePublisherRelationRequest with explicit sources and no upstream body.
pub struct ReleasePublisherRelationRequest {
    /// Carries relation_ref; see the source and invariant table.
    pub relation_ref: PublisherRelationRef,
    /// Carries expected_revision; see the source and invariant table.
    pub expected_revision: MarketRevision,
    /// Carries verification_refs; see the source and invariant table.
    pub verification_refs: Vec<SourceVerificationRef>,
    /// Carries reason_ref; see the source and invariant table.
    pub reason_ref: SafeReasonRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| relation_ref | `PublisherRelationRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| expected_revision | `MarketRevision` | 客户端读面revision；fresh读取相等检查且repoCAS；replay先于业务revision重核 |
| verification_refs | `Vec<SourceVerificationRef>` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| reason_ref | `SafeReasonRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | PublisherRelation.release + SourceVerification.invalidate / formal exactoperation；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<PublisherRelationResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### PublisherRelationResult

```rust
/// Carries PublisherRelationResult with explicit sources and no upstream body.
pub struct PublisherRelationResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries relation_ref; see the source and invariant table.
    pub relation_ref: PublisherRelationRef,
    /// Carries state; see the source and invariant table.
    pub state: PublisherRelationState,
    /// Carries principal_ref; see the source and invariant table.
    pub principal_ref: PublisherPrincipalRef,
    /// Carries authority_ref; see the source and invariant table.
    pub authority_ref: PublisherAuthorityRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| relation_ref | `PublisherRelationRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `PublisherRelationState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| principal_ref | `PublisherPrincipalRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| authority_ref | `PublisherAuthorityRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| scope_ref | `MarketScopeRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### VerifyPublicationSource

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn verify_publication_source(&self, request: CommandEnvelope<VerifyPublicationSourceRequest>) -> Result<ExecutionResult<SourceQualificationResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/verify-publication-source |
| 处理方 | MarketplaceApplication<P> / source_responsibility / planned verify_publication_source.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | SourceBinding/MaterialReference factory + SourceGatePolicy.evaluate + SourceVerification.start/record / SourceOwner/Material/Publisher ports |

#### 请求schema与构造来源

### VerifyPublicationSourceRequest

```rust
/// Carries VerifyPublicationSourceRequest with explicit sources and no upstream body.
pub struct VerifyPublicationSourceRequest {
    /// Carries source_candidate; see the source and invariant table.
    pub source_candidate: SourceVerificationTarget,
    /// Carries publisher_ref; see the source and invariant table.
    pub publisher_ref: PublisherRelationRef,
    /// Carries material_candidates; see the source and invariant table.
    pub material_candidates: Vec<OwnerMaterialRef>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| source_candidate | `SourceVerificationTarget` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| publisher_ref | `PublisherRelationRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| material_candidates | `Vec<OwnerMaterialRef>` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | SourceBinding/MaterialReference factory + SourceGatePolicy.evaluate + SourceVerification.start/record / SourceOwner/Material/Publisher ports；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<SourceQualificationResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### SourceQualificationResult

```rust
/// Carries SourceQualificationResult with explicit sources and no upstream body.
pub struct SourceQualificationResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries verification_ref; see the source and invariant table.
    pub verification_ref: SourceVerificationRef,
    /// Carries state; see the source and invariant table.
    pub state: SourceVerificationState,
    /// Carries source_binding; see the source and invariant table.
    pub source_binding: Option<SourceBinding>,
    /// Carries material_refs; see the source and invariant table.
    pub material_refs: MaterialReferenceSet,
    /// Carries outcome_ref; see the source and invariant table.
    pub outcome_ref: OptionalQualificationOutcomeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| verification_ref | `SourceVerificationRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `SourceVerificationState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| source_binding | `Option<SourceBinding>` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| material_refs | `MaterialReferenceSet` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| outcome_ref | `OptionalQualificationOutcomeRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### GetSourceQualification

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn get_source_qualification(&self, request: QueryEnvelope<GetSourceQualificationRequest>) -> Result<ReadSurface<SourceQualificationReadModel>, MarketError>` |
| transport | POST /api/marketplace/v1/queries/get-source-qualification |
| 处理方 | MarketplaceApplication<P> / source_responsibility / planned get_source_qualification.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | MarketStore.load_verification/load_qualification_outcome + typed snapshot |

#### 请求schema与构造来源

### GetSourceQualificationRequest

```rust
/// Carries GetSourceQualificationRequest with explicit sources and no upstream body.
pub struct GetSourceQualificationRequest {
    /// Carries verification_ref; see the source and invariant table.
    pub verification_ref: SourceVerificationRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| verification_ref | `SourceVerificationRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | MarketStore.load_verification/load_qualification_outcome + typed snapshot；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | currentScope + CoreQueryMetadata.page/consistency唯一；不写ContextRecord | 读取失败typedDegraded；不reserve |

#### 完整输出schema

返回ReadSurface<SourceQualificationReadModel>，Ready QualifiedPage.items为本类型的typedreadmodel；Empty/NotVisible/Missing/Degraded独立安全分支，无requiredID假填。

### SourceQualificationReadModel

```rust
/// Carries SourceQualificationReadModel with explicit sources and no upstream body.
pub struct SourceQualificationReadModel {
    /// Carries view; see the source and invariant table.
    pub view: SourceQualificationView,
    /// Carries state; see the source and invariant table.
    pub state: SourceVerificationState,
    /// Carries source_binding; see the source and invariant table.
    pub source_binding: OptionalSourceBinding,
    /// Carries material_refs; see the source and invariant table.
    pub material_refs: MaterialReferenceSet,
    /// Carries outcome; see the source and invariant table.
    pub outcome: Option<QualificationOutcomeRecord>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| view | `SourceQualificationView` | Blocked view summaryNone+真实安全failure record；no pretendverified |
| state | `SourceVerificationState` | Blocked view summaryNone+真实安全failure record；no pretendverified |
| source_binding | `OptionalSourceBinding` | Blocked view summaryNone+真实安全failure record；no pretendverified |
| material_refs | `MaterialReferenceSet` | Blocked view summaryNone+真实安全failure record；no pretendverified |
| outcome | `Option<QualificationOutcomeRecord>` | Blocked view summaryNone+真实安全failure record；no pretendverified |

归属：contracts；Blocked view summaryNone+真实安全failure record；no pretendverified


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。typedentity→readmodel每同名字段逐字段copy，status由currentReadSurface而不是owner approval；scope/page/token不重复。

#### 失败、幂等与审计

no-write：所有save/append/reserve/refresh/rebuild/dispatch/ID/Clock为零；当前scope先于typed读，数量/提示/详情/分页同一visibility交集。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


## 协议族停审

本族所有DTO字段有source/missing规则，response二级types唯一归属，Coremeta/actor/key/page无双承载；无activeevent/ownertruth复制；下一族方可创建。外部exact资格保持blocked，不宣称运行测试通过。
