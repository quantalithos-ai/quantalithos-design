# Step7 application typed Ports小循环

## 思考、诊断与取舍

能力：基础UoW/ID/Clock、实体读取保存、原完整result/Context、durable work/permission/冻结plan、snapshot/projection成对read、八formalowner协作。采用generic requiredports与统一associatedTx；拒绝万能JSONrepository、隐式commit/upsert、native async dyn和fake私有补口。scan用固定upper+compoundcursor，不能用单sequence截断同一事务多个subject；formalactor与decision不足只blocked。

## capability / 接缝顺序

| 组 | capability来源 | 目标port | 停审 |
|---|---|---|---|
| 基础 | localIDs/lease/CAS/UoW | UnitOfWork/Clock/ID | 逐trait |
| truth | U1～5 entity / Recovery | MarketStore | get/save/append成对 |
| reliability | Corecontext/originalresult/audit/work | Operation/Audit/Work | fullread + frozenplan/permission |
| read | typedshadow/projection | Snapshot/Projection | state+body配对 |
| owner | source/publisher/material/Gov/scope/receiver/notice/Obs | 八externalports | exactqualification保留blocked |

## Shared boundary helper

### PortError

```rust
/// Represents the finite PortError surface without owning upstream truth.
pub enum PortError {
    /// Carries VersionConflict with SafeFailureRef.
    VersionConflict(SafeFailureRef),
    /// Carries UniqueConflict with SafeFailureRef.
    UniqueConflict(SafeFailureRef),
    /// Carries IntegrityFailure with SafeFailureRef.
    IntegrityFailure(SafeFailureRef),
    /// Carries ReadOnlyViolation with SafeFailureRef.
    ReadOnlyViolation(SafeFailureRef),
    /// Carries CommitUnknown with SafeFailureRef.
    CommitUnknown(SafeFailureRef),
    /// Carries Unavailable with SafeFailureRef.
    Unavailable(SafeFailureRef),
    /// Carries InvalidCursor with SafeFailureRef.
    InvalidCursor(SafeFailureRef),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| VersionConflict(SafeFailureRef) | Carries VersionConflict. | finite safe error payload，raw SQL/IO/panic不暴露；Version/Unique可重新lookup原key，不盲重跑effect |
| UniqueConflict(SafeFailureRef) | Carries UniqueConflict. | finite safe error payload，raw SQL/IO/panic不暴露；Version/Unique可重新lookup原key，不盲重跑effect |
| IntegrityFailure(SafeFailureRef) | Carries IntegrityFailure. | finite safe error payload，raw SQL/IO/panic不暴露；Version/Unique可重新lookup原key，不盲重跑effect |
| ReadOnlyViolation(SafeFailureRef) | Carries ReadOnlyViolation. | finite safe error payload，raw SQL/IO/panic不暴露；Version/Unique可重新lookup原key，不盲重跑effect |
| CommitUnknown(SafeFailureRef) | Carries CommitUnknown. | finite safe error payload，raw SQL/IO/panic不暴露；Version/Unique可重新lookup原key，不盲重跑effect |
| Unavailable(SafeFailureRef) | Carries Unavailable. | finite safe error payload，raw SQL/IO/panic不暴露；Version/Unique可重新lookup原key，不盲重跑effect |
| InvalidCursor(SafeFailureRef) | Carries InvalidCursor. | finite safe error payload，raw SQL/IO/panic不暴露；Version/Unique可重新lookup原key，不盲重跑effect |

归属：application；finite safe error payload，raw SQL/IO/panic不暴露；Version/Unique可重新lookup原key，不盲重跑effect


### ExternalPortError

```rust
/// Represents the finite ExternalPortError surface without owning upstream truth.
pub enum ExternalPortError {
    /// Carries ContractBlocked with SafeFailureRef.
    ContractBlocked(SafeFailureRef),
    /// Carries NotVisible with SafeFailureRef.
    NotVisible(SafeFailureRef),
    /// Carries NotFound with SafeFailureRef.
    NotFound(SafeFailureRef),
    /// Carries BindingMismatch with SafeFailureRef.
    BindingMismatch(SafeFailureRef),
    /// Carries KnownNotCommitted with SafeFailureRef.
    KnownNotCommitted(SafeFailureRef),
    /// Carries CommitUnknown with SafeFailureRef.
    CommitUnknown(SafeFailureRef),
    /// Carries Unavailable with SafeFailureRef.
    Unavailable(SafeFailureRef),
    /// Carries UnsafeMaterial with SafeFailureRef.
    UnsafeMaterial(SafeFailureRef),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| ContractBlocked(SafeFailureRef) | Carries ContractBlocked. | 正式body-free adapter错误；dispatch后timeout=CommitUnknown不是Failed；readtimeout=Unavailable不推出effectunknown |
| NotVisible(SafeFailureRef) | Carries NotVisible. | 正式body-free adapter错误；dispatch后timeout=CommitUnknown不是Failed；readtimeout=Unavailable不推出effectunknown |
| NotFound(SafeFailureRef) | Carries NotFound. | 正式body-free adapter错误；dispatch后timeout=CommitUnknown不是Failed；readtimeout=Unavailable不推出effectunknown |
| BindingMismatch(SafeFailureRef) | Carries BindingMismatch. | 正式body-free adapter错误；dispatch后timeout=CommitUnknown不是Failed；readtimeout=Unavailable不推出effectunknown |
| KnownNotCommitted(SafeFailureRef) | Carries KnownNotCommitted. | 正式body-free adapter错误；dispatch后timeout=CommitUnknown不是Failed；readtimeout=Unavailable不推出effectunknown |
| CommitUnknown(SafeFailureRef) | Carries CommitUnknown. | 正式body-free adapter错误；dispatch后timeout=CommitUnknown不是Failed；readtimeout=Unavailable不推出effectunknown |
| Unavailable(SafeFailureRef) | Carries Unavailable. | 正式body-free adapter错误；dispatch后timeout=CommitUnknown不是Failed；readtimeout=Unavailable不推出effectunknown |
| UnsafeMaterial(SafeFailureRef) | Carries UnsafeMaterial. | 正式body-free adapter错误；dispatch后timeout=CommitUnknown不是Failed；readtimeout=Unavailable不推出effectunknown |

归属：application；正式body-free adapter错误；dispatch后timeout=CommitUnknown不是Failed；readtimeout=Unavailable不推出effectunknown


### CommitDisposition

```rust
/// Represents the finite CommitDisposition surface without owning upstream truth.
pub enum CommitDisposition {
    /// KnownCommitted is a local classification.
    KnownCommitted,
    /// Unknown is a local classification.
    Unknown,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| KnownCommitted | KnownCommitted is a local classification. | Unknown按operationscopekey在新readonlyTx读完整原result；没有结果时等待commit resolution，不自动freshretry |
| Unknown | Unknown is a local classification. | Unknown按operationscopekey在新readonlyTx读完整原result；没有结果时等待commit resolution，不自动freshretry |

归属：application；Unknown按operationscopekey在新readonlyTx读完整原result；没有结果时等待commit resolution，不自动freshretry


### RepositoryPositionSubject

```rust
/// Identifies a unique row position without becoming a domain audit subject.
pub enum RepositoryPositionSubject {
    /// Uses the exact primary identity of a domain-owned subject.
    OwnedSubject(MarketAuditSubjectRef),
    /// Uses a relation primary identity in impact scans.
    Relation(DistributionRelationRef),
    /// Distinguishes multiple work records for one business target.
    Work(DeferredWorkRef),
    /// Distinguishes multiple audits for one business subject.
    Audit(MarketAuditRef),
    /// Identifies an immutable publication basis.
    Basis(PublicationBasisRef),
    /// Identifies an immutable qualification outcome.
    Qualification(QualificationOutcomeRef),
}
```

归属application；factory来自对应完整typed row主键，rehydrate有限tag+完整typed载荷校验；排序固定source sequence/tag/payload bytes；allowed position/parent/scope绑定见[Step13§7.6](03_ddd_step_13_concurrency_idempotency.md)。不是新审计domain主体或state。Work/Audit不能用同target/subject作为行唯一位置。

### RepositoryCursor

```rust
/// Carries RepositoryCursor with explicit sources and no upstream body.
pub struct RepositoryCursor {
    /// Carries source_cursor; see the source and invariant table.
    pub source_cursor: MarketSourceCursor,
    /// Carries subject_ref; see the source and invariant table.
    pub subject_ref: RepositoryPositionSubject,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| source_cursor | `MarketSourceCursor` | 内部cursor=localcommitsequence+typedsubjecttie-break，固定upper；非Corepage token |
| subject_ref | `RepositoryPositionSubject` | 内部cursor=localcommitsequence+typed row主键tie-break，固定upper；非Corepage token |

归属：application；内部cursor=localcommitsequence+typedsubjecttie-break，固定upper；非Corepage token


### ScanPage<T>

```rust
/// Carries ScanPage<T> with explicit sources and no upstream body.
pub struct ScanPage<T> {
    /// Carries items; see the source and invariant table.
    pub items: Vec<T>,
    /// Carries next_cursor; see the source and invariant table.
    pub next_cursor: Option<RepositoryCursor>,
    /// Carries upper; see the source and invariant table.
    pub upper: MarketSourceCursor,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| items | `Vec<T>` | bounded内部scan；非空/empty稳定，next必须严格前进，固定upper；完整读取才enumcomplete |
| next_cursor | `Option<RepositoryCursor>` | bounded内部scan；非空/empty稳定，next必须严格前进，固定upper；完整读取才enumcomplete |
| upper | `MarketSourceCursor` | bounded内部scan；非空/empty稳定，next必须严格前进，固定upper；完整读取才enumcomplete |

归属：application；bounded内部scan；非空/empty稳定，next必须严格前进，固定upper；完整读取才enumcomplete


### OperationKey

```rust
/// Carries OperationKey with explicit sources and no upstream body.
pub struct OperationKey {
    /// Carries operation_kind; see the source and invariant table.
    pub operation_kind: MarketOperationKind,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries key; see the source and invariant table.
    pub key: core_contracts::metadata::IdempotencyKey,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| operation_kind | `MarketOperationKind` | Corekey exact UTF8 as_str，不trim/casefold/Unicode normalize；唯一(operationkind,scope,key)，fingerprint另核原intent |
| scope_ref | `MarketScopeRef` | Corekey exact UTF8 as_str，不trim/casefold/Unicode normalize；唯一(operationkind,scope,key)，fingerprint另核原intent |
| key | `core_contracts::metadata::IdempotencyKey` | Corekey exact UTF8 as_str，不trim/casefold/Unicode normalize；唯一(operationkind,scope,key)，fingerprint另核原intent |

归属：application；Corekey exact UTF8 as_str，不trim/casefold/Unicode normalize；唯一(operationkind,scope,key)，fingerprint另核原intent


### CategoryReadInput

```rust
/// Carries CategoryReadInput with explicit sources and no upstream body.
pub struct CategoryReadInput {
    /// Carries parent_ref; see the source and invariant table.
    pub parent_ref: OptionalCategoryRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| parent_ref | `OptionalCategoryRef` | typedtaxonomyfilter，分页唯一meta.page，default不从body重复 |

归属：contracts；typedtaxonomyfilter，分页唯一meta.page，default不从body重复


### ProjectionIdentity

```rust
/// Carries ProjectionIdentity with explicit sources and no upstream body.
pub struct ProjectionIdentity {
    /// Carries kind; see the source and invariant table.
    pub kind: MarketProjectionKind,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| kind | `MarketProjectionKind` | 唯一projection(kind,scope)，typedIDlookup不拼字符串 |
| scope_ref | `MarketScopeRef` | 唯一projection(kind,scope)，typedIDlookup不拼字符串 |

归属：application；唯一projection(kind,scope)，typedIDlookup不拼字符串


### ProjectionReadSet

```rust
/// Carries ProjectionReadSet with explicit sources and no upstream body.
pub struct ProjectionReadSet {
    /// Carries projection; see the source and invariant table.
    pub projection: Versioned<ReadProjection>,
    /// Carries views; see the source and invariant table.
    pub views: Vec<ProjectionSafeView>,
    /// Carries manifest; see the source and invariant table.
    pub manifest: Vec<ProjectionBuildItem>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| projection | `Versioned<ReadProjection>` | state+完整typedviews同Tx成对读取；Fresh缺body=IntegrityFailure，不假empty |
| views | `Vec<ProjectionSafeView>` | state+完整typedviews同Tx成对读取；Fresh缺body=IntegrityFailure，不假empty |
| manifest | `Vec<ProjectionBuildItem>` | Fresh时完整typedkeymanifest与safeviews成对；缺manifest=IntegrityFailure，不假empty |

归属：application；state+完整typedviews同Tx成对读取；Fresh缺body=IntegrityFailure，不假empty


### ObservationDispatchInput

```rust
/// Carries ObservationDispatchInput with explicit sources and no upstream body.
pub struct ObservationDispatchInput {
    /// Carries operation_ref; see the source and invariant table.
    pub operation_ref: MarketOperationRef,
    /// Carries audit_refs; see the source and invariant table.
    pub audit_refs: MarketAuditRefSet,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries permission; see the source and invariant table.
    pub permission: DispatchPermission,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| operation_ref | `MarketOperationRef` | 原committed safeauditset+formalproducer/redaction；不是evidencepackage |
| audit_refs | `MarketAuditRefSet` | 原committed safeauditset+formalproducer/redaction；不是evidencepackage |
| scope_ref | `MarketScopeRef` | 原committed safeauditset+formalproducer/redaction；不是evidencepackage |
| permission | `DispatchPermission` | 原committed safeauditset+formalproducer/redaction；不是evidencepackage |

归属：contracts；原committed safeauditset+formalproducer/redaction；不是evidencepackage


### PageReadContext / MarketPageSelector

Step17跨文档审计回修：publicpage的actor/delegate/selector绑定不能从SafeReadContext或opaque disclosure_ref反推。以下application-ownedcarrier只给七个本地paged repository方法，不是owner SDK请求/HTTPbody，不复制Identitytruth；字段来源明确由Query调用方提供。

```rust
/// Carries current trusted metadata for a local public-page read.
pub struct PageReadContext {
    /// Uses the original trusted Core actor and delegation from the query envelope.
    pub actor: core_contracts::actor::ActorContext,
    /// Uses the current formal scope, disclosure, and source visibility intersection.
    pub scope: SafeReadContext,
    /// Selects exactly one public query and its allowed repository page method.
    pub selector: MarketPageSelector,
}

/// Restricts public pagination to the seven calibrated query families.
pub enum MarketPageSelector {
    /// Selects ProjectionStorePort::search_catalog.
    SearchMarketplaceCatalog,
    /// Selects MarketStorePort::page_listed_versions.
    GetMarketplaceListing,
    /// Selects MarketStorePort::list_versions.
    ListMarketVersions,
    /// Selects MarketStorePort::list_categories.
    ListMarketCategories,
    /// Selects MarketStorePort::page_attempts_by_intent.
    GetDistributionProgress,
    /// Selects MarketStorePort::page_notices_by_impact.
    GetWithdrawalImpact,
    /// Selects AuditStorePort::list_audits.
    GetMarketAudit,
}
```

| 字段 / variant | 类型 / 来源 | 不变量 / missing |
|---|---|---|
| PageReadContext.actor | Core ActorContext；QueryEnvelope.actor原值 | 只取actor/delegate exactidentity计算binding，不取display/rolehint；缺可信actor在入口安全拒绝 |
| PageReadContext.scope | SafeReadContext；ReadFacade.authorize正式返回 | 当前scope/sourceconstraints先过滤，disclosure_ref不当身份/签名 |
| PageReadContext.selector | MarketPageSelector；每Query函数内固定literal | 七variant恰对应上面唯一pagedmethod；method不符InvalidCursor，无字符串路由猜selector |
| 七MarketPageSelector variant | application有限enum；exactQuerynames | token selector exactPascalCase；不得任意String或增加第八当前入口 |

分页port仍单一CorePageRequest参数，page/meta无重复authority；业务filter/parent由各方法原typed参数完整提供，PageReadContext不携任意JSON。fake/PG共同使用Step13 codec/binding/order/currentvisibility规则。该schema补充不增加I/O port或method数量、domain对象或状态机。

### ScopeResolutionInput

```rust
/// Carries ScopeResolutionInput with explicit sources and no upstream body.
pub struct ScopeResolutionInput {
    /// Carries actor; see the source and invariant table.
    pub actor: core_contracts::actor::ActorContext,
    /// Carries subjects; see the source and invariant table.
    pub subjects: Vec<MarketAuditSubjectRef>,
    /// Carries source_candidates; see the source and invariant table.
    pub source_candidates: Vec<SourceVerificationTarget>,
    /// Carries requested_scope; see the source and invariant table.
    pub requested_scope: Option<MarketScopeRef>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| actor | `core_contracts::actor::ActorContext` | currentactortrusted；scope/visibility正式resolver裁剪，actorrolehint不等正式权限；fresh/replay均需当前披露 |
| subjects | `Vec<MarketAuditSubjectRef>` | currentactortrusted；scope/visibility正式resolver裁剪，actorrolehint不等正式权限；fresh/replay均需当前披露 |
| source_candidates | `Vec<SourceVerificationTarget>` | currentactortrusted；scope/visibility正式resolver裁剪，actorrolehint不等正式权限；fresh/replay均需当前披露 |
| requested_scope | `Option<MarketScopeRef>` | currentactortrusted；scope/visibility正式resolver裁剪，actorrolehint不等正式权限；fresh/replay均需当前披露 |

归属：application；currentactortrusted；scope/visibility正式resolver裁剪，actorrolehint不等正式权限；fresh/replay均需当前披露


### ScopeResolution

```rust
/// Carries ScopeResolution with explicit sources and no upstream body.
pub struct ScopeResolution {
    /// Carries read_context; see the source and invariant table.
    pub read_context: SafeReadContext,
    /// Carries authority_basis; see the source and invariant table.
    pub authority_basis: SafeBasisReferenceSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| read_context | `SafeReadContext` | resolvercurrent正式交集；缺scope/publisher/humanauthority返回ContractBlocked，不以IdentityAI身份代替 |
| authority_basis | `SafeBasisReferenceSet` | resolvercurrent正式交集；缺scope/publisher/humanauthority返回ContractBlocked，不以IdentityAI身份代替 |

归属：application；resolvercurrent正式交集；缺scope/publisher/humanauthority返回ContractBlocked，不以IdentityAI身份代替


### PublisherResolveRequest

```rust
/// Carries PublisherResolveRequest with explicit sources and no upstream body.
pub struct PublisherResolveRequest {
    /// Carries principal_candidate; see the source and invariant table.
    pub principal_candidate: String,
    /// Carries scope; see the source and invariant table.
    pub scope: SafeReadContext,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| principal_candidate | `String` | rawprincipal候选opaque bounded，formal human/org authority缺MP-UP003阻positive |
| scope | `SafeReadContext` | rawprincipal候选opaque bounded，formal human/org authority缺MP-UP003阻positive |

归属：application；rawprincipal候选opaque bounded，formal human/org authority缺MP-UP003阻positive


### SourceResolveRequest

```rust
/// Carries SourceResolveRequest with explicit sources and no upstream body.
pub struct SourceResolveRequest {
    /// Carries candidate; see the source and invariant table.
    pub candidate: SourceVerificationTarget,
    /// Carries scope; see the source and invariant table.
    pub scope: SafeReadContext,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| candidate | `SourceVerificationTarget` | resolver-first，owner_kind_candidate受控mapping，不解析candidate |
| scope | `SafeReadContext` | resolver-first，owner_kind_candidate受控mapping，不解析candidate |

归属：application；resolver-first，owner_kind_candidate受控mapping，不解析candidate


### SourceResolveOutput

```rust
/// Carries SourceResolveOutput with explicit sources and no upstream body.
pub struct SourceResolveOutput {
    /// Carries source; see the source and invariant table.
    pub source: QualifiedSourceInput,
    /// Carries safe_summary; see the source and invariant table.
    pub safe_summary: SourceSafeSummary,
    /// Carries rules; see the source and invariant table.
    pub rules: QualifiedSourceRuleInput,
    /// Carries validity_ref; see the source and invariant table.
    pub validity_ref: SourceValidityRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| source | `QualifiedSourceInput` | owner正式typedsafe输出完整version/digest/visibility/eligibility；safe_summary不是正文 |
| safe_summary | `SourceSafeSummary` | owner正式typedsafe输出完整version/digest/visibility/eligibility；safe_summary不是正文 |
| rules | `QualifiedSourceRuleInput` | owner正式typedsafe输出完整version/digest/visibility/eligibility；safe_summary不是正文 |
| validity_ref | `SourceValidityRef` | owner正式typedsafe输出完整version/digest/visibility/eligibility；safe_summary不是正文 |

归属：application；owner正式typedsafe输出完整version/digest/visibility/eligibility；safe_summary不是正文


### MaterialResolveRequest

```rust
/// Carries MaterialResolveRequest with explicit sources and no upstream body.
pub struct MaterialResolveRequest {
    /// Carries material_candidates; see the source and invariant table.
    pub material_candidates: Vec<OwnerMaterialRef>,
    /// Carries source; see the source and invariant table.
    pub source: SourceBinding,
    /// Carries scope; see the source and invariant table.
    pub scope: SafeReadContext,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| material_candidates | `Vec<OwnerMaterialRef>` | boundedformal适用材料，scan/signature/SBOMkind未确认blocked；不接受rawresult |
| source | `SourceBinding` | boundedformal适用材料，scan/signature/SBOMkind未确认blocked；不接受rawresult |
| scope | `SafeReadContext` | boundedformal适用材料，scan/signature/SBOMkind未确认blocked；不接受rawresult |

归属：application；boundedformal适用材料，scan/signature/SBOMkind未确认blocked；不接受rawresult


### GovernanceReadInput

```rust
/// Carries GovernanceReadInput with explicit sources and no upstream body.
pub struct GovernanceReadInput {
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries basis; see the source and invariant table.
    pub basis: PublicationBasis,
    /// Carries decision_candidate; see the source and invariant table.
    pub decision_candidate: Option<GovernanceDecisionRef>,
    /// Carries scope; see the source and invariant table.
    pub scope: SafeReadContext,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| application_ref | `PublicationApplicationRef` | exact申请/来源版本/材料/publisher/scope，querysummary不能由本地推approved |
| basis | `PublicationBasis` | exact申请/来源版本/材料/publisher/scope，querysummary不能由本地推approved |
| decision_candidate | `Option<GovernanceDecisionRef>` | exact申请/来源版本/材料/publisher/scope，querysummary不能由本地推approved |
| scope | `SafeReadContext` | exact申请/来源版本/材料/publisher/scope，querysummary不能由本地推approved |

归属：application；exact申请/来源版本/材料/publisher/scope，querysummary不能由本地推approved


### GovernanceReadOutput

```rust
/// Carries GovernanceReadOutput with explicit sources and no upstream body.
pub struct GovernanceReadOutput {
    /// Carries binding; see the source and invariant table.
    pub binding: QualifiedDecisionInput,
    /// Carries current; see the source and invariant table.
    pub current: CurrentDecisionInput,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| binding | `QualifiedDecisionInput` | formal fullbinding/outcome/currentvalidity一起存在；GetGateDecision general不证明此mapping已获owner支持 |
| current | `CurrentDecisionInput` | formal fullbinding/outcome/currentvalidity一起存在；GetGateDecision general不证明此mapping已获owner支持 |

归属：application；formal fullbinding/outcome/currentvalidity一起存在；GetGateDecision general不证明此mapping已获owner支持


### ReviewExternalInput

```rust
/// Carries ReviewExternalInput with explicit sources and no upstream body.
pub struct ReviewExternalInput {
    /// Carries handoff_ref; see the source and invariant table.
    pub handoff_ref: ReviewHandoffRef,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries basis; see the source and invariant table.
    pub basis: PublicationBasis,
    /// Carries permission; see the source and invariant table.
    pub permission: DispatchPermission,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| handoff_ref | `ReviewHandoffRef` | 原handoff externalintent幂等，完整fixed审查basis，commitpermission后调用 |
| application_ref | `PublicationApplicationRef` | 原handoff externalintent幂等，完整fixed审查basis，commitpermission后调用 |
| basis | `PublicationBasis` | 原handoff externalintent幂等，完整fixed审查basis，commitpermission后调用 |
| permission | `DispatchPermission` | 原handoff externalintent幂等，完整fixed审查basis，commitpermission后调用 |

归属：application；原handoff externalintent幂等，完整fixed审查basis，commitpermission后调用


### ReceiverDispatchInput

```rust
/// Carries ReceiverDispatchInput with explicit sources and no upstream body.
pub struct ReceiverDispatchInput {
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: DistributionIntentRef,
    /// Carries attempt_ref; see the source and invariant table.
    pub attempt_ref: DistributionAttemptRef,
    /// Carries source; see the source and invariant table.
    pub source: SourceBinding,
    /// Carries target; see the source and invariant table.
    pub target: AcquisitionTargetInput,
    /// Carries permission; see the source and invariant table.
    pub permission: DispatchPermission,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| intent_ref | `DistributionIntentRef` | source immutable ref，不传body/package；intent保持同一外部幂等值，attempt/fence本地重入控制 |
| attempt_ref | `DistributionAttemptRef` | source immutable ref，不传body/package；intent保持同一外部幂等值，attempt/fence本地重入控制 |
| source | `SourceBinding` | source immutable ref，不传body/package；intent保持同一外部幂等值，attempt/fence本地重入控制 |
| target | `AcquisitionTargetInput` | source immutable ref，不传body/package；intent保持同一外部幂等值，attempt/fence本地重入控制 |
| permission | `DispatchPermission` | source immutable ref，不传body/package；intent保持同一外部幂等值，attempt/fence本地重入控制 |

归属：application；source immutable ref，不传body/package；intent保持同一外部幂等值，attempt/fence本地重入控制


### ReceiverProbeInput

```rust
/// Carries ReceiverProbeInput with explicit sources and no upstream body.
pub struct ReceiverProbeInput {
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: DistributionIntentRef,
    /// Carries context; see the source and invariant table.
    pub context: DistributionOutcomeContext,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| intent_ref | `DistributionIntentRef` | formaloriginalintentprobe，不用URL/requesttime/newattempt查猜 |
| context | `DistributionOutcomeContext` | formaloriginalintentprobe，不用URL/requesttime/newattempt查猜 |

归属：application；formaloriginalintentprobe，不用URL/requesttime/newattempt查猜


### ReceiverFormalResult

```rust
/// Carries ReceiverFormalResult with explicit sources and no upstream body.
pub struct ReceiverFormalResult {
    /// Carries outcome; see the source and invariant table.
    pub outcome: ReceiverOutcomeInput,
    /// Carries binding; see the source and invariant table.
    pub binding: Option<QualifiedReceiverOutcome>,
    /// Carries inspection; see the source and invariant table.
    pub inspection: ExternalEffectInspectionInput,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| outcome | `ReceiverOutcomeInput` | Confirmed必须binding/matched；KnownNotCommitted formalproof；Unknown无假正式結果；ACK只有Unknown/等待 |
| binding | `Option<QualifiedReceiverOutcome>` | Confirmed必须binding/matched；KnownNotCommitted formalproof；Unknown无假正式結果；ACK只有Unknown/等待 |
| inspection | `ExternalEffectInspectionInput` | Confirmed必须binding/matched；KnownNotCommitted formalproof；Unknown无假正式結果；ACK只有Unknown/等待 |

归属：application；Confirmed必须binding/matched；KnownNotCommitted formalproof；Unknown无假正式結果；ACK只有Unknown/等待


### NoticeExternalInput

```rust
/// Carries NoticeExternalInput with explicit sources and no upstream body.
pub struct NoticeExternalInput {
    /// Carries notice_ref; see the source and invariant table.
    pub notice_ref: NoticeIntentRef,
    /// Carries impact_ref; see the source and invariant table.
    pub impact_ref: ImpactRecordRef,
    /// Carries target_ref; see the source and invariant table.
    pub target_ref: NoticeTargetRef,
    /// Carries channel_ref; see the source and invariant table.
    pub channel_ref: NoticeChannelRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries permission; see the source and invariant table.
    pub permission: DispatchPermission,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| notice_ref | `NoticeIntentRef` | safe通知只refs/原因/影响界限，原noticeidempotency，缺formalchannelblocked |
| impact_ref | `ImpactRecordRef` | safe通知只refs/原因/影响界限，原noticeidempotency，缺formalchannelblocked |
| target_ref | `NoticeTargetRef` | safe通知只refs/原因/影响界限，原noticeidempotency，缺formalchannelblocked |
| channel_ref | `NoticeChannelRef` | safe通知只refs/原因/影响界限，原noticeidempotency，缺formalchannelblocked |
| scope_ref | `MarketScopeRef` | safe通知只refs/原因/影响界限，原noticeidempotency，缺formalchannelblocked |
| permission | `DispatchPermission` | safe通知只refs/原因/影响界限，原noticeidempotency，缺formalchannelblocked |

归属：application；safe通知只refs/原因/影响界限，原noticeidempotency，缺formalchannelblocked


### NoticeFormalResult

```rust
/// Carries NoticeFormalResult with explicit sources and no upstream body.
pub struct NoticeFormalResult {
    /// Carries outcome; see the source and invariant table.
    pub outcome: NoticeOutcomeInput,
    /// Carries binding; see the source and invariant table.
    pub binding: Option<QualifiedNoticeOutcome>,
    /// Carries inspection; see the source and invariant table.
    pub inspection: ExternalEffectInspectionInput,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| outcome | `NoticeOutcomeInput` | formalbinding同notice/target/channel/scope；不推delivery/read/remediation |
| binding | `Option<QualifiedNoticeOutcome>` | formalbinding同notice/target/channel/scope；不推delivery/read/remediation |
| inspection | `ExternalEffectInspectionInput` | formalbinding同notice/target/channel/scope；不推delivery/read/remediation |

归属：application；formalbinding同notice/target/channel/scope；不推delivery/read/remediation


### ObservationFormalResult

```rust
/// Carries ObservationFormalResult with explicit sources and no upstream body.
pub struct ObservationFormalResult {
    /// Carries binding; see the source and invariant table.
    pub binding: Option<QualifiedObservationOutcome>,
    /// Carries inspection; see the source and invariant table.
    pub inspection: ExternalEffectInspectionInput,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| binding | `Option<QualifiedObservationOutcome>` | formalproducer/redaction/receiptmatched，unknown不等admitted/evidence |
| inspection | `ExternalEffectInspectionInput` | formalproducer/redaction/receiptmatched，unknown不等admitted/evidence |

归属：application；formalproducer/redaction/receiptmatched，unknown不等admitted/evidence


### DeferredPlan

```rust
/// Carries DeferredPlan with explicit sources and no upstream body.
pub struct DeferredPlan {
    /// Carries work_ref; see the source and invariant table.
    pub work_ref: DeferredWorkRef,
    /// Carries operation_kind; see the source and invariant table.
    pub operation_kind: MarketOperationKind,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries targets; see the source and invariant table.
    pub targets: Vec<MarketWorkTargetRef>,
    /// Carries window; see the source and invariant table.
    pub window: Option<ReadWindow>,
    /// Carries projection_plan; see the source and invariant table.
    pub projection_plan: Option<ProjectionRebuildPlanInput>,
    /// Carries audit_refs; see the source and invariant table.
    pub audit_refs: MarketAuditRefSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| work_ref | `DeferredWorkRef` | same acceptedUoW frozenplan；非空boundedtargets、selector-kind/target一致；恢复只原plan，window固定upper+after；子batch新work带明确continuation，不同key可续办 |
| operation_kind | `MarketOperationKind` | same acceptedUoW frozenplan；非空boundedtargets、selector-kind/target一致；恢复只原plan，window固定upper+after；子batch新work带明确continuation，不同key可续办 |
| scope_ref | `MarketScopeRef` | same acceptedUoW frozenplan；非空boundedtargets、selector-kind/target一致；恢复只原plan，window固定upper+after；子batch新work带明确continuation，不同key可续办 |
| targets | `Vec<MarketWorkTargetRef>` | same acceptedUoW frozenplan；非空boundedtargets、selector-kind/target一致；恢复只原plan，window固定upper+after；子batch新work带明确continuation，不同key可续办 |
| window | `Option<ReadWindow>` | same acceptedUoW frozenplan；非空boundedtargets、selector-kind/target一致；恢复只原plan，window固定upper+after；子batch新work带明确continuation，不同key可续办 |
| projection_plan | `Option<ProjectionRebuildPlanInput>` | same acceptedUoW frozenplan；非空boundedtargets、selector-kind/target一致；恢复只原plan，window固定upper+after；子batch新work带明确continuation，不同key可续办 |
| audit_refs | `MarketAuditRefSet` | same acceptedUoW frozenplan；非空boundedtargets、selector-kind/target一致；恢复只原plan，window固定upper+after；子batch新work带明确continuation，不同key可续办 |

归属：application；same acceptedUoW frozenplan；非空boundedtargets、selector-kind/target一致；恢复只原plan，window固定upper+after；子batch新work带明确continuation，不同key可续办


### QualificationOutcomeRecord

```rust
/// Carries QualificationOutcomeRecord with explicit sources and no upstream body.
pub struct QualificationOutcomeRecord {
    /// Carries outcome_ref; see the source and invariant table.
    pub outcome_ref: QualificationOutcomeRef,
    /// Carries verification_ref; see the source and invariant table.
    pub verification_ref: SourceVerificationRef,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: OptionalSafeFailureRef,
    /// Carries basis_refs; see the source and invariant table.
    pub basis_refs: SafeBasisReferenceSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| outcome_ref | `QualificationOutcomeRef` | local safequalificationresult sidecar；Qualified basis完整，Blocked failure必有；append同verification UoW，非上游新approval |
| verification_ref | `SourceVerificationRef` | local safequalificationresult sidecar；Qualified basis完整，Blocked failure必有；append同verification UoW，非上游新approval |
| failure_ref | `OptionalSafeFailureRef` | local safequalificationresult sidecar；Qualified basis完整，Blocked failure必有；append同verification UoW，非上游新approval |
| basis_refs | `SafeBasisReferenceSet` | local safequalificationresult sidecar；Qualified basis完整，Blocked failure必有；append同verification UoW，非上游新approval |

归属：contracts；local safequalificationresult sidecar；Qualified basis完整，Blocked failure必有；append同verification UoW，非上游新approval


### CatalogSearchInput

```rust
/// Carries CatalogSearchInput with explicit sources and no upstream body.
pub struct CatalogSearchInput {
    /// Carries keyword; see the source and invariant table.
    pub keyword: Option<String>,
    /// Carries display_type; see the source and invariant table.
    pub display_type: Option<DisplayAssetCategory>,
    /// Carries category_ref; see the source and invariant table.
    pub category_ref: OptionalCategoryRef,
    /// Carries tags; see the source and invariant table.
    pub tags: Vec<String>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| keyword | `Option<String>` | keyword≤256chars、escapedsubstring而非SQLfragment；tags canonicaldedupsort；分页/consistency唯一meta，拒绝body中的page |
| display_type | `Option<DisplayAssetCategory>` | keyword≤256chars、escapedsubstring而非SQLfragment；tags canonicaldedupsort；分页/consistency唯一meta，拒绝body中的page |
| category_ref | `OptionalCategoryRef` | keyword≤256chars、escapedsubstring而非SQLfragment；tags canonicaldedupsort；分页/consistency唯一meta，拒绝body中的page |
| tags | `Vec<String>` | keyword≤256chars、escapedsubstring而非SQLfragment；tags canonicaldedupsort；分页/consistency唯一meta，拒绝body中的page |

归属：contracts；keyword≤256chars、escapedsubstring而非SQLfragment；tags canonicaldedupsort；分页/consistency唯一meta，拒绝body中的page


### OperationAuthority

```rust
/// Carries OperationAuthority with explicit sources and no upstream body.
pub struct OperationAuthority {
    /// Carries operation_kind; see the source and invariant table.
    pub operation_kind: MarketOperationKind,
    /// Carries subject_ref; see the source and invariant table.
    pub subject_ref: MarketAuditSubjectRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: Option<DispositionAuthorityRef>,
    /// Carries recovery_ref; see the source and invariant table.
    pub recovery_ref: Option<RecoveryAuthorityRef>,
    /// Carries basis_refs; see the source and invariant table.
    pub basis_refs: SafeBasisReferenceSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| operation_kind | `MarketOperationKind` | formal exactoperation/subject/scope；Release/Terminate/Restrict/Withdraw需disposition，Recovery需recovery；taxonomy等需非空basis；缺owner blocked不由actorhint推 |
| subject_ref | `MarketAuditSubjectRef` | formal exactoperation/subject/scope；Release/Terminate/Restrict/Withdraw需disposition，Recovery需recovery；taxonomy等需非空basis；缺owner blocked不由actorhint推 |
| scope_ref | `MarketScopeRef` | formal exactoperation/subject/scope；Release/Terminate/Restrict/Withdraw需disposition，Recovery需recovery；taxonomy等需非空basis；缺owner blocked不由actorhint推 |
| disposition_ref | `Option<DispositionAuthorityRef>` | formal exactoperation/subject/scope；Release/Terminate/Restrict/Withdraw需disposition，Recovery需recovery；taxonomy等需非空basis；缺owner blocked不由actorhint推 |
| recovery_ref | `Option<RecoveryAuthorityRef>` | formal exactoperation/subject/scope；Release/Terminate/Restrict/Withdraw需disposition，Recovery需recovery；taxonomy等需非空basis；缺owner blocked不由actorhint推 |
| basis_refs | `SafeBasisReferenceSet` | formal exactoperation/subject/scope；Release/Terminate/Restrict/Withdraw需disposition，Recovery需recovery；taxonomy等需非空basis；缺owner blocked不由actorhint推 |

归属：application；formal exactoperation/subject/scope；Release/Terminate/Restrict/Withdraw需disposition，Recovery需recovery；taxonomy等需非空basis；缺owner blocked不由actorhint推


### MarketUow与统一generic依赖

```rust
/// Provides an opaque, single-owner local transaction handle.
pub trait MarketUow: Send {}
```

P:MarketPorts按下面完整associatedtype/accessor清单注入，所有本地store与UnitOfWork的Tx必须同类型，具体PgTx/FakeTx不得暴露contracts/API。所有native async port以泛型静态派发，不用dyn；Tx ownership只UnitOfWork commit/rollback consume，其余mutborrow。


```rust
/// Groups all required ports with one transaction authority.
pub trait MarketPorts {
    /// Uses one local transaction implementation.
    type Tx: MarketUow;
    /// Injects the UnitOfWork boundary.
    type UnitOfWork: UnitOfWork<Tx = Self::Tx>;
    /// Borrows the UnitOfWork boundary.
    fn unit_of_work(&self) -> &Self::UnitOfWork;
    /// Injects the ClockPort boundary.
    type ClockPort: ClockPort;
    /// Borrows the ClockPort boundary.
    fn clock_port(&self) -> &Self::ClockPort;
    /// Injects the IdGeneratorPort boundary.
    type IdGeneratorPort: IdGeneratorPort;
    /// Borrows the IdGeneratorPort boundary.
    fn id_generator_port(&self) -> &Self::IdGeneratorPort;
    /// Injects the MarketStorePort boundary.
    type MarketStorePort: MarketStorePort<Tx = Self::Tx>;
    /// Borrows the MarketStorePort boundary.
    fn market_store_port(&self) -> &Self::MarketStorePort;
    /// Injects the OperationStorePort boundary.
    type OperationStorePort: OperationStorePort<Tx = Self::Tx>;
    /// Borrows the OperationStorePort boundary.
    fn operation_store_port(&self) -> &Self::OperationStorePort;
    /// Injects the AuditStorePort boundary.
    type AuditStorePort: AuditStorePort<Tx = Self::Tx>;
    /// Borrows the AuditStorePort boundary.
    fn audit_store_port(&self) -> &Self::AuditStorePort;
    /// Injects the WorkStorePort boundary.
    type WorkStorePort: WorkStorePort<Tx = Self::Tx>;
    /// Borrows the WorkStorePort boundary.
    fn work_store_port(&self) -> &Self::WorkStorePort;
    /// Injects the SnapshotStorePort boundary.
    type SnapshotStorePort: SnapshotStorePort<Tx = Self::Tx>;
    /// Borrows the SnapshotStorePort boundary.
    fn snapshot_store_port(&self) -> &Self::SnapshotStorePort;
    /// Injects the ProjectionStorePort boundary.
    type ProjectionStorePort: ProjectionStorePort<Tx = Self::Tx>;
    /// Borrows the ProjectionStorePort boundary.
    fn projection_store_port(&self) -> &Self::ProjectionStorePort;
    /// Injects the ScopeResolverPort boundary.
    type ScopeResolverPort: ScopeResolverPort;
    /// Borrows the ScopeResolverPort boundary.
    fn scope_resolver_port(&self) -> &Self::ScopeResolverPort;
    /// Injects the SourceOwnerPort boundary.
    type SourceOwnerPort: SourceOwnerPort;
    /// Borrows the SourceOwnerPort boundary.
    fn source_owner_port(&self) -> &Self::SourceOwnerPort;
    /// Injects the PublisherAuthorityPort boundary.
    type PublisherAuthorityPort: PublisherAuthorityPort;
    /// Borrows the PublisherAuthorityPort boundary.
    fn publisher_authority_port(&self) -> &Self::PublisherAuthorityPort;
    /// Injects the MaterialAuthorityPort boundary.
    type MaterialAuthorityPort: MaterialAuthorityPort;
    /// Borrows the MaterialAuthorityPort boundary.
    fn material_authority_port(&self) -> &Self::MaterialAuthorityPort;
    /// Injects the GovernancePort boundary.
    type GovernancePort: GovernancePort;
    /// Borrows the GovernancePort boundary.
    fn governance_port(&self) -> &Self::GovernancePort;
    /// Injects the ReceiverPort boundary.
    type ReceiverPort: ReceiverPort;
    /// Borrows the ReceiverPort boundary.
    fn receiver_port(&self) -> &Self::ReceiverPort;
    /// Injects the NoticeChannelPort boundary.
    type NoticeChannelPort: NoticeChannelPort;
    /// Borrows the NoticeChannelPort boundary.
    fn notice_channel_port(&self) -> &Self::NoticeChannelPort;
    /// Injects the ObservationPort boundary.
    type ObservationPort: ObservationPort;
    /// Borrows the ObservationPort boundary.
    fn observation_port(&self) -> &Self::ObservationPort;
}
```


### UnitOfWork

capability/对象能力：Operation/context/acceptedentity/audit/fullresult/work同原子边界；定义application/ports，调用方application七用例模块，具体实现：infra/postgres/unit_of_work + fake staged UoW。

```rust
/// Provides UnitOfWork as an application-owned typed boundary.
pub trait UnitOfWork {
    /// Uses the same transaction type as every local store.
    type Tx: MarketUow;
    /// Begins a bounded read-only or read-write transaction.
    async fn begin(&self, mode: UowMode) -> Result<Self::Tx, PortError>;
    /// Serializes admission, dispatch permission, restriction, and withdrawal for one version.
    async fn lock_version(&self, tx: &mut Self::Tx, version_ref: MarketVersionRef) -> Result<(), PortError>;
    /// Assigns the transactional local source cursor.
    async fn assign_cursor(&self, tx: &mut Self::Tx) -> Result<MarketSourceCursor, PortError>;
    /// Reads the current committed local cursor.
    async fn current_cursor(&self, tx: &mut Self::Tx) -> Result<MarketSourceCursor, PortError>;
    /// Commits atomically and distinguishes an unresolved commit outcome.
    async fn commit(&self, tx: Self::Tx) -> Result<CommitDisposition, PortError>;
    /// Rolls back all staged local writes.
    async fn rollback(&self, tx: Self::Tx) -> Result<(), PortError>;
    /// Serializes a local operation key before allocating ids or mutating truth.
    async fn lock_operation_key(&self, tx: &mut Self::Tx, key: OperationKey) -> Result<(), PortError>;
    /// Serializes local publisher release with positive publication, admission and dispatch gates.
    async fn lock_publisher(&self, tx: &mut Self::Tx, publisher_ref: PublisherRelationRef) -> Result<(), PortError>;
}
```

| callable | 完整输入/返回来源 | missing/conflict/failure/副作用 |
|---|---|---|
| `async fn begin(&self, mode: UowMode) -> Result<Self::Tx, PortError>` | mode由flow固定，不由业务caller绕写；Tx由infra具体连接 | begin失败无副作用 |
| `async fn lock_version(&self, tx: &mut Self::Tx, version_ref: MarketVersionRef) -> Result<(), PortError>` | typed exactversion，不字符串lockkey | Request/dispatchpermission/Restrict/Withdraw共同锁；不外call |
| `async fn assign_cursor(&self, tx: &mut Self::Tx) -> Result<MarketSourceCursor, PortError>` | 同UoW本地提交序列 | rollback不可见；读无此调用；不是owner version/page |
| `async fn current_cursor(&self, tx: &mut Self::Tx) -> Result<MarketSourceCursor, PortError>` | committedlocalfacts读取 | 只读 |
| `async fn commit(&self, tx: Self::Tx) -> Result<CommitDisposition, PortError>` | PG/fake authoritativecommitresolution | KnownCommitted/Unknown分支；Unknown不能返回新成功或盲重跑 |
| `async fn rollback(&self, tx: Self::Tx) -> Result<(), PortError>` | ownershipconsume Tx | truth/audit/result/work/context均不可见；外部effect不在此tx |
| `async fn lock_operation_key(&self, tx: &mut Self::Tx, key: OperationKey) -> Result<(), PortError>` | fixedselector+resolvedscope+Corekey exactbytes | winningfresh才ID；锁后再find_by_key；不externalcall |
| `async fn lock_publisher(&self, tx: &mut Self::Tx, publisher_ref: PublisherRelationRef) -> Result<(), PortError>` | exact local publisher relation reference from request or loaded immutable basis | positive paths lock publisher BEFORE version, reload Bound/current relation and revision matching prechecked authority; Release same lock. No external owner transaction claim; remote validity still exact formal consumer contract |

停审：UnitOfWork typed读取/保存、version与Tx来源已核对；不透传raw SQL/SDK/secret，不增加truth。外部positive资格仍按binding表blocked。

2026-10-02持久化闭口：ReadWrite begin先取得PG事务帧单例锁，后key/publisher/version；assign_cursor是该Tx单一transactional counter，rollback不可见，JobB新frame。固定upper读取使用同save原子追加的typed Row历史，防后续更新将旧项移出窗口。完整SQL/codec/CAS与four-kind dependency predicate见[Step11§7](03_ddd_step_11_persistence_transactions.md)。本地事实不允许因优化改成非事务sequence。


### ClockPort

capability/对象能力：lease/localrecord timing，不决定owner validity；定义application/ports，调用方application七用例模块，具体实现：infra/runtime_builder。

```rust
/// Provides ClockPort as an application-owned typed boundary.
pub trait ClockPort {
    /// Returns local application time for technical leases.
    fn now(&self) -> MarketInstant;
}
```

| callable | 完整输入/返回来源 | missing/conflict/failure/副作用 |
|---|---|---|
| `fn now(&self) -> MarketInstant` | infra clock localms；不复制Core请求时间authority | fresh path，replay不重timing |

停审：ClockPort typed读取/保存、version与Tx来源已核对；不透传raw SQL/SDK/secret，不增加truth。外部positive资格仍按binding表blocked。


### IdGeneratorPort

capability/对象能力：全部localfactory IDs/ref生成；ownerref不生成；定义application/ports，调用方application七用例模块，具体实现：infra/runtime_builder/fake ID。

```rust
/// Provides IdGeneratorPort as an application-owned typed boundary.
pub trait IdGeneratorPort {
    /// Generates a new local PublisherRelationRef without interpreting owner tokens.
    fn new_publisher_relation_ref(&self) -> PublisherRelationRef;
    /// Generates a new local SourceVerificationRef without interpreting owner tokens.
    fn new_source_verification_ref(&self) -> SourceVerificationRef;
    /// Generates a new local PublicationBasisRef without interpreting owner tokens.
    fn new_publication_basis_ref(&self) -> PublicationBasisRef;
    /// Generates a new local PublicationApplicationRef without interpreting owner tokens.
    fn new_publication_application_ref(&self) -> PublicationApplicationRef;
    /// Generates a new local ReviewHandoffRef without interpreting owner tokens.
    fn new_review_handoff_ref(&self) -> ReviewHandoffRef;
    /// Generates a new local MarketplaceListingRef without interpreting owner tokens.
    fn new_marketplace_listing_ref(&self) -> MarketplaceListingRef;
    /// Generates a new local MarketVersionRef without interpreting owner tokens.
    fn new_market_version_ref(&self) -> MarketVersionRef;
    /// Generates a new local CategoryRef without interpreting owner tokens.
    fn new_category_ref(&self) -> CategoryRef;
    /// Generates a new local DistributionIntentRef without interpreting owner tokens.
    fn new_distribution_intent_ref(&self) -> DistributionIntentRef;
    /// Generates a new local DistributionRelationRef without interpreting owner tokens.
    fn new_distribution_relation_ref(&self) -> DistributionRelationRef;
    /// Generates a new local DistributionAttemptRef without interpreting owner tokens.
    fn new_distribution_attempt_ref(&self) -> DistributionAttemptRef;
    /// Generates a new local WithdrawalDispositionRef without interpreting owner tokens.
    fn new_withdrawal_disposition_ref(&self) -> WithdrawalDispositionRef;
    /// Generates a new local ImpactRecordRef without interpreting owner tokens.
    fn new_impact_record_ref(&self) -> ImpactRecordRef;
    /// Generates a new local NoticeIntentRef without interpreting owner tokens.
    fn new_notice_intent_ref(&self) -> NoticeIntentRef;
    /// Generates a new local MarketOperationRef without interpreting owner tokens.
    fn new_market_operation_ref(&self) -> MarketOperationRef;
    /// Generates a new local StoredOperationResultRef without interpreting owner tokens.
    fn new_stored_operation_result_ref(&self) -> StoredOperationResultRef;
    /// Generates a new local MarketAuditRef without interpreting owner tokens.
    fn new_market_audit_ref(&self) -> MarketAuditRef;
    /// Generates a new local DeferredWorkRef without interpreting owner tokens.
    fn new_deferred_work_ref(&self) -> DeferredWorkRef;
    /// Generates a new local RecoveryIntentRef without interpreting owner tokens.
    fn new_recovery_intent_ref(&self) -> RecoveryIntentRef;
    /// Generates a new local QualifiedReferenceSnapshotRef without interpreting owner tokens.
    fn new_qualified_reference_snapshot_ref(&self) -> QualifiedReferenceSnapshotRef;
    /// Generates a new local MarketProjectionRef without interpreting owner tokens.
    fn new_market_projection_ref(&self) -> MarketProjectionRef;
    /// Generates a new local MarketContextRef without interpreting owner tokens.
    fn new_market_context_ref(&self) -> MarketContextRef;
    /// Generates a new local QualificationOutcomeRef without interpreting owner tokens.
    fn new_qualification_outcome_ref(&self) -> QualificationOutcomeRef;
}
```

| callable | 完整输入/返回来源 | missing/conflict/failure/副作用 |
|---|---|---|
| `fn new_publisher_relation_ref(&self) -> PublisherRelationRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_source_verification_ref(&self) -> SourceVerificationRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_publication_basis_ref(&self) -> PublicationBasisRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_publication_application_ref(&self) -> PublicationApplicationRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_review_handoff_ref(&self) -> ReviewHandoffRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_marketplace_listing_ref(&self) -> MarketplaceListingRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_market_version_ref(&self) -> MarketVersionRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_category_ref(&self) -> CategoryRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_distribution_intent_ref(&self) -> DistributionIntentRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_distribution_relation_ref(&self) -> DistributionRelationRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_distribution_attempt_ref(&self) -> DistributionAttemptRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_withdrawal_disposition_ref(&self) -> WithdrawalDispositionRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_impact_record_ref(&self) -> ImpactRecordRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_notice_intent_ref(&self) -> NoticeIntentRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_market_operation_ref(&self) -> MarketOperationRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_stored_operation_result_ref(&self) -> StoredOperationResultRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_market_audit_ref(&self) -> MarketAuditRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_deferred_work_ref(&self) -> DeferredWorkRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_recovery_intent_ref(&self) -> RecoveryIntentRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_qualified_reference_snapshot_ref(&self) -> QualifiedReferenceSnapshotRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_market_projection_ref(&self) -> MarketProjectionRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_market_context_ref(&self) -> MarketContextRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |
| `fn new_qualification_outcome_ref(&self) -> QualificationOutcomeRef` | IDgenerator输出本地opaque标识 | fresh factory才调用；replay零ID；fake确定性不能私造ownerref |

停审：IdGeneratorPort typed读取/保存、version与Tx来源已核对；不透传raw SQL/SDK/secret，不增加truth。外部positive资格仍按binding表blocked。


### MarketStorePort

capability/对象能力：U1～5与Recovery实体完整typedread/save/append；定义application/ports，调用方application七用例模块，具体实现：infra/postgres/market_store + infra/fake/local_store。

```rust
/// Provides MarketStorePort as an application-owned typed boundary.
pub trait MarketStorePort {
    /// Uses the same transaction type as every local store.
    type Tx: MarketUow;
    /// Loads the complete typed PublisherRelation with its authoritative storage version.
    async fn load_publisher(&self, tx: &mut Self::Tx, reference: PublisherRelationRef) -> Result<Option<Versioned<PublisherRelation>>, PortError>;
    /// Saves a version-checked PublisherRelation within the existing transaction.
    async fn save_publisher(&self, tx: &mut Self::Tx, value: PublisherRelation, expected: ExpectedMarketRevision) -> Result<VersionedRef<PublisherRelationRef>, PortError>;
    /// Loads the complete typed SourceVerification with its authoritative storage version.
    async fn load_verification(&self, tx: &mut Self::Tx, reference: SourceVerificationRef) -> Result<Option<Versioned<SourceVerification>>, PortError>;
    /// Saves a version-checked SourceVerification within the existing transaction.
    async fn save_verification(&self, tx: &mut Self::Tx, value: SourceVerification, expected: ExpectedMarketRevision) -> Result<VersionedRef<SourceVerificationRef>, PortError>;
    /// Loads the complete typed PublicationApplication with its authoritative storage version.
    async fn load_application(&self, tx: &mut Self::Tx, reference: PublicationApplicationRef) -> Result<Option<Versioned<PublicationApplication>>, PortError>;
    /// Saves a version-checked PublicationApplication within the existing transaction.
    async fn save_application(&self, tx: &mut Self::Tx, value: PublicationApplication, expected: ExpectedMarketRevision) -> Result<VersionedRef<PublicationApplicationRef>, PortError>;
    /// Loads the complete typed PublicationBasis with its authoritative storage version.
    async fn load_basis(&self, tx: &mut Self::Tx, reference: PublicationBasisRef) -> Result<Option<PublicationBasis>, PortError>;
    /// Appends an immutable PublicationBasis within the existing transaction.
    async fn append_basis(&self, tx: &mut Self::Tx, value: PublicationBasis) -> Result<(), PortError>;
    /// Loads the complete typed ReviewHandoff with its authoritative storage version.
    async fn load_review(&self, tx: &mut Self::Tx, reference: ReviewHandoffRef) -> Result<Option<Versioned<ReviewHandoff>>, PortError>;
    /// Saves a version-checked ReviewHandoff within the existing transaction.
    async fn save_review(&self, tx: &mut Self::Tx, value: ReviewHandoff, expected: ExpectedMarketRevision) -> Result<VersionedRef<ReviewHandoffRef>, PortError>;
    /// Loads the complete typed MarketplaceListing with its authoritative storage version.
    async fn load_listing(&self, tx: &mut Self::Tx, reference: MarketplaceListingRef) -> Result<Option<Versioned<MarketplaceListing>>, PortError>;
    /// Saves a version-checked MarketplaceListing within the existing transaction.
    async fn save_listing(&self, tx: &mut Self::Tx, value: MarketplaceListing, expected: ExpectedMarketRevision) -> Result<VersionedRef<MarketplaceListingRef>, PortError>;
    /// Loads the complete typed MarketVersion with its authoritative storage version.
    async fn load_version(&self, tx: &mut Self::Tx, reference: MarketVersionRef) -> Result<Option<Versioned<MarketVersion>>, PortError>;
    /// Saves a version-checked MarketVersion within the existing transaction.
    async fn save_version(&self, tx: &mut Self::Tx, value: MarketVersion, expected: ExpectedMarketRevision) -> Result<VersionedRef<MarketVersionRef>, PortError>;
    /// Loads the complete typed Category with its authoritative storage version.
    async fn load_category(&self, tx: &mut Self::Tx, reference: CategoryRef) -> Result<Option<Versioned<Category>>, PortError>;
    /// Saves a version-checked Category within the existing transaction.
    async fn save_category(&self, tx: &mut Self::Tx, value: Category, expected: ExpectedMarketRevision) -> Result<VersionedRef<CategoryRef>, PortError>;
    /// Loads the complete typed DistributionIntent with its authoritative storage version.
    async fn load_intent(&self, tx: &mut Self::Tx, reference: DistributionIntentRef) -> Result<Option<Versioned<DistributionIntent>>, PortError>;
    /// Saves a version-checked DistributionIntent within the existing transaction.
    async fn save_intent(&self, tx: &mut Self::Tx, value: DistributionIntent, expected: ExpectedMarketRevision) -> Result<VersionedRef<DistributionIntentRef>, PortError>;
    /// Loads the complete typed DistributionRelation with its authoritative storage version.
    async fn load_relation(&self, tx: &mut Self::Tx, reference: DistributionRelationRef) -> Result<Option<Versioned<DistributionRelation>>, PortError>;
    /// Saves a version-checked DistributionRelation within the existing transaction.
    async fn save_relation(&self, tx: &mut Self::Tx, value: DistributionRelation, expected: ExpectedMarketRevision) -> Result<VersionedRef<DistributionRelationRef>, PortError>;
    /// Loads the complete typed DistributionAttempt with its authoritative storage version.
    async fn load_attempt(&self, tx: &mut Self::Tx, reference: DistributionAttemptRef) -> Result<Option<Versioned<DistributionAttempt>>, PortError>;
    /// Saves a version-checked DistributionAttempt within the existing transaction.
    async fn save_attempt(&self, tx: &mut Self::Tx, value: DistributionAttempt, expected: ExpectedMarketRevision) -> Result<VersionedRef<DistributionAttemptRef>, PortError>;
    /// Loads the complete typed WithdrawalDisposition with its authoritative storage version.
    async fn load_disposition(&self, tx: &mut Self::Tx, reference: WithdrawalDispositionRef) -> Result<Option<WithdrawalDisposition>, PortError>;
    /// Appends an immutable WithdrawalDisposition within the existing transaction.
    async fn append_disposition(&self, tx: &mut Self::Tx, value: WithdrawalDisposition) -> Result<(), PortError>;
    /// Loads the complete typed ImpactRecord with its authoritative storage version.
    async fn load_impact(&self, tx: &mut Self::Tx, reference: ImpactRecordRef) -> Result<Option<Versioned<ImpactRecord>>, PortError>;
    /// Saves a version-checked ImpactRecord within the existing transaction.
    async fn save_impact(&self, tx: &mut Self::Tx, value: ImpactRecord, expected: ExpectedMarketRevision) -> Result<VersionedRef<ImpactRecordRef>, PortError>;
    /// Loads the complete typed NoticeIntent with its authoritative storage version.
    async fn load_notice(&self, tx: &mut Self::Tx, reference: NoticeIntentRef) -> Result<Option<Versioned<NoticeIntent>>, PortError>;
    /// Saves a version-checked NoticeIntent within the existing transaction.
    async fn save_notice(&self, tx: &mut Self::Tx, value: NoticeIntent, expected: ExpectedMarketRevision) -> Result<VersionedRef<NoticeIntentRef>, PortError>;
    /// Loads the complete typed RecoveryIntent with its authoritative storage version.
    async fn load_recovery(&self, tx: &mut Self::Tx, reference: RecoveryIntentRef) -> Result<Option<Versioned<RecoveryIntent>>, PortError>;
    /// Saves a version-checked RecoveryIntent within the existing transaction.
    async fn save_recovery(&self, tx: &mut Self::Tx, value: RecoveryIntent, expected: ExpectedMarketRevision) -> Result<VersionedRef<RecoveryIntentRef>, PortError>;
    /// Provides the typed list_verifications_by_publisher lookup without hidden private state.
    async fn list_verifications_by_publisher(&self, tx: &mut Self::Tx, publisher_ref: PublisherRelationRef, window: ReadWindow) -> Result<ScanPage<Versioned<SourceVerification>>, PortError>;
    /// Provides the typed list_versions lookup without hidden private state.
    async fn list_versions(&self, tx: &mut Self::Tx, listing_ref: MarketplaceListingRef, context: PageReadContext, page: core_contracts::metadata::PageRequest) -> Result<Page<Versioned<MarketVersion>>, PortError>;
    /// Provides the typed list_categories lookup without hidden private state.
    async fn list_categories(&self, tx: &mut Self::Tx, input: CategoryReadInput, context: PageReadContext, page: core_contracts::metadata::PageRequest) -> Result<Page<Versioned<Category>>, PortError>;
    /// Provides the typed category_ancestors lookup without hidden private state.
    async fn category_ancestors(&self, tx: &mut Self::Tx, parent_ref: CategoryRef, scope: SafeReadContext) -> Result<Vec<CategoryRef>, PortError>;
    /// Provides the typed get_relation_by_intent lookup without hidden private state.
    async fn get_relation_by_intent(&self, tx: &mut Self::Tx, intent_ref: DistributionIntentRef) -> Result<Option<Versioned<DistributionRelation>>, PortError>;
    /// Provides the typed list_relations lookup without hidden private state.
    async fn list_relations(&self, tx: &mut Self::Tx, version_ref: MarketVersionRef, window: ReadWindow) -> Result<ScanPage<Versioned<DistributionRelation>>, PortError>;
    /// Provides the typed list_attempts_by_intent lookup without hidden private state.
    async fn list_attempts_by_intent(&self, tx: &mut Self::Tx, intent_ref: DistributionIntentRef, window: ReadWindow) -> Result<ScanPage<Versioned<DistributionAttempt>>, PortError>;
    /// Provides the typed list_unknown_attempts lookup without hidden private state.
    async fn list_unknown_attempts(&self, tx: &mut Self::Tx, version_ref: MarketVersionRef, window: ReadWindow) -> Result<ScanPage<Versioned<DistributionAttempt>>, PortError>;
    /// Provides the typed list_dispositions_by_version lookup without hidden private state.
    async fn list_dispositions_by_version(&self, tx: &mut Self::Tx, version_ref: MarketVersionRef, window: ReadWindow) -> Result<ScanPage<WithdrawalDisposition>, PortError>;
    /// Provides the typed get_impact_by_disposition lookup without hidden private state.
    async fn get_impact_by_disposition(&self, tx: &mut Self::Tx, disposition_ref: WithdrawalDispositionRef) -> Result<Option<Versioned<ImpactRecord>>, PortError>;
    /// Provides the typed list_notices_by_impact lookup without hidden private state.
    async fn list_notices_by_impact(&self, tx: &mut Self::Tx, impact_ref: ImpactRecordRef, window: ReadWindow) -> Result<ScanPage<Versioned<NoticeIntent>>, PortError>;
    /// Provides the typed find_notice lookup without hidden private state.
    async fn find_notice(&self, tx: &mut Self::Tx, impact_ref: ImpactRecordRef, target_ref: NoticeTargetRef, channel_ref: NoticeChannelRef, scope_ref: MarketScopeRef) -> Result<Option<Versioned<NoticeIntent>>, PortError>;
    /// Provides append_qualification_outcome for source qualification.
    async fn append_qualification_outcome(&self, tx: &mut Self::Tx, value: QualificationOutcomeRecord) -> Result<(), PortError>;
    /// Provides load_qualification_outcome for source qualification.
    async fn load_qualification_outcome(&self, tx: &mut Self::Tx, outcome_ref: QualificationOutcomeRef) -> Result<Option<QualificationOutcomeRecord>, PortError>;
    /// Provides page_attempts_by_intent as a scope-qualified public page.
    async fn page_attempts_by_intent(&self, tx: &mut Self::Tx, intent_ref: DistributionIntentRef, context: PageReadContext, page: core_contracts::metadata::PageRequest) -> Result<Page<Versioned<DistributionAttempt>>, PortError>;
    /// Provides page_notices_by_impact as a scope-qualified public page.
    async fn page_notices_by_impact(&self, tx: &mut Self::Tx, impact_ref: ImpactRecordRef, context: PageReadContext, page: core_contracts::metadata::PageRequest) -> Result<Page<Versioned<NoticeIntent>>, PortError>;
    /// Scans the committed local relation and unknown-attempt union with one stable bounded cursor.
    async fn scan_known_impact(&self, tx: &mut Self::Tx, version_ref: MarketVersionRef, window: ReadWindow) -> Result<ScanPage<ImpactScanItem>, PortError>;
    /// Pages only currently visible listed versions with one predicate for rows, counts and continuation.
    async fn page_listed_versions(&self, tx: &mut Self::Tx, listing_ref: MarketplaceListingRef, context: PageReadContext, page: core_contracts::metadata::PageRequest) -> Result<Page<Versioned<MarketVersion>>, PortError>;
}
```

| callable | 完整输入/返回来源 | missing/conflict/failure/副作用 |
|---|---|---|
| `async fn load_publisher(&self, tx: &mut Self::Tx, reference: PublisherRelationRef) -> Result<Option<Versioned<PublisherRelation>>, PortError>` | PublisherRelationRef exactkey；完整row typedrehydrate | OptionNone=absent；mutation Missing，query按currentdisclosure safe missing；不得补默认 |
| `async fn save_publisher(&self, tx: &mut Self::Tx, value: PublisherRelation, expected: ExpectedMarketRevision) -> Result<VersionedRef<PublisherRelationRef>, PortError>` | expected MustNotExist或typedloadExactrevision，禁隐式upsert | 同tx；append同ref同内容允许idempotent校验，不同内容Conflict；mutableCAS返回newrevision |
| `async fn load_verification(&self, tx: &mut Self::Tx, reference: SourceVerificationRef) -> Result<Option<Versioned<SourceVerification>>, PortError>` | SourceVerificationRef exactkey；完整row typedrehydrate | OptionNone=absent；mutation Missing，query按currentdisclosure safe missing；不得补默认 |
| `async fn save_verification(&self, tx: &mut Self::Tx, value: SourceVerification, expected: ExpectedMarketRevision) -> Result<VersionedRef<SourceVerificationRef>, PortError>` | expected MustNotExist或typedloadExactrevision，禁隐式upsert | 同tx；append同ref同内容允许idempotent校验，不同内容Conflict；mutableCAS返回newrevision |
| `async fn load_application(&self, tx: &mut Self::Tx, reference: PublicationApplicationRef) -> Result<Option<Versioned<PublicationApplication>>, PortError>` | PublicationApplicationRef exactkey；完整row typedrehydrate | OptionNone=absent；mutation Missing，query按currentdisclosure safe missing；不得补默认 |
| `async fn save_application(&self, tx: &mut Self::Tx, value: PublicationApplication, expected: ExpectedMarketRevision) -> Result<VersionedRef<PublicationApplicationRef>, PortError>` | expected MustNotExist或typedloadExactrevision，禁隐式upsert | 同tx；append同ref同内容允许idempotent校验，不同内容Conflict；mutableCAS返回newrevision |
| `async fn load_basis(&self, tx: &mut Self::Tx, reference: PublicationBasisRef) -> Result<Option<PublicationBasis>, PortError>` | PublicationBasisRef exactkey；完整row typedrehydrate | OptionNone=absent；mutation Missing，query按currentdisclosure safe missing；不得补默认 |
| `async fn append_basis(&self, tx: &mut Self::Tx, value: PublicationBasis) -> Result<(), PortError>` | 完整immutablefixedinput | 同tx；append同ref同内容允许idempotent校验，不同内容Conflict；mutableCAS返回newrevision |
| `async fn load_review(&self, tx: &mut Self::Tx, reference: ReviewHandoffRef) -> Result<Option<Versioned<ReviewHandoff>>, PortError>` | ReviewHandoffRef exactkey；完整row typedrehydrate | OptionNone=absent；mutation Missing，query按currentdisclosure safe missing；不得补默认 |
| `async fn save_review(&self, tx: &mut Self::Tx, value: ReviewHandoff, expected: ExpectedMarketRevision) -> Result<VersionedRef<ReviewHandoffRef>, PortError>` | expected MustNotExist或typedloadExactrevision，禁隐式upsert | 同tx；append同ref同内容允许idempotent校验，不同内容Conflict；mutableCAS返回newrevision |
| `async fn load_listing(&self, tx: &mut Self::Tx, reference: MarketplaceListingRef) -> Result<Option<Versioned<MarketplaceListing>>, PortError>` | MarketplaceListingRef exactkey；完整row typedrehydrate | OptionNone=absent；mutation Missing，query按currentdisclosure safe missing；不得补默认 |
| `async fn save_listing(&self, tx: &mut Self::Tx, value: MarketplaceListing, expected: ExpectedMarketRevision) -> Result<VersionedRef<MarketplaceListingRef>, PortError>` | expected MustNotExist或typedloadExactrevision，禁隐式upsert | 同tx；append同ref同内容允许idempotent校验，不同内容Conflict；mutableCAS返回newrevision |
| `async fn load_version(&self, tx: &mut Self::Tx, reference: MarketVersionRef) -> Result<Option<Versioned<MarketVersion>>, PortError>` | MarketVersionRef exactkey；完整row typedrehydrate | OptionNone=absent；mutation Missing，query按currentdisclosure safe missing；不得补默认 |
| `async fn save_version(&self, tx: &mut Self::Tx, value: MarketVersion, expected: ExpectedMarketRevision) -> Result<VersionedRef<MarketVersionRef>, PortError>` | expected MustNotExist或typedloadExactrevision，禁隐式upsert | 同tx；append同ref同内容允许idempotent校验，不同内容Conflict；mutableCAS返回newrevision |
| `async fn load_category(&self, tx: &mut Self::Tx, reference: CategoryRef) -> Result<Option<Versioned<Category>>, PortError>` | CategoryRef exactkey；完整row typedrehydrate | OptionNone=absent；mutation Missing，query按currentdisclosure safe missing；不得补默认 |
| `async fn save_category(&self, tx: &mut Self::Tx, value: Category, expected: ExpectedMarketRevision) -> Result<VersionedRef<CategoryRef>, PortError>` | expected MustNotExist或typedloadExactrevision，禁隐式upsert | 同tx；append同ref同内容允许idempotent校验，不同内容Conflict；mutableCAS返回newrevision |
| `async fn load_intent(&self, tx: &mut Self::Tx, reference: DistributionIntentRef) -> Result<Option<Versioned<DistributionIntent>>, PortError>` | DistributionIntentRef exactkey；完整row typedrehydrate | OptionNone=absent；mutation Missing，query按currentdisclosure safe missing；不得补默认 |
| `async fn save_intent(&self, tx: &mut Self::Tx, value: DistributionIntent, expected: ExpectedMarketRevision) -> Result<VersionedRef<DistributionIntentRef>, PortError>` | expected MustNotExist或typedloadExactrevision，禁隐式upsert | 同tx；append同ref同内容允许idempotent校验，不同内容Conflict；mutableCAS返回newrevision |
| `async fn load_relation(&self, tx: &mut Self::Tx, reference: DistributionRelationRef) -> Result<Option<Versioned<DistributionRelation>>, PortError>` | DistributionRelationRef exactkey；完整row typedrehydrate | OptionNone=absent；mutation Missing，query按currentdisclosure safe missing；不得补默认 |
| `async fn save_relation(&self, tx: &mut Self::Tx, value: DistributionRelation, expected: ExpectedMarketRevision) -> Result<VersionedRef<DistributionRelationRef>, PortError>` | expected MustNotExist或typedloadExactrevision，禁隐式upsert | 同tx；append同ref同内容允许idempotent校验，不同内容Conflict；mutableCAS返回newrevision |
| `async fn load_attempt(&self, tx: &mut Self::Tx, reference: DistributionAttemptRef) -> Result<Option<Versioned<DistributionAttempt>>, PortError>` | DistributionAttemptRef exactkey；完整row typedrehydrate | OptionNone=absent；mutation Missing，query按currentdisclosure safe missing；不得补默认 |
| `async fn save_attempt(&self, tx: &mut Self::Tx, value: DistributionAttempt, expected: ExpectedMarketRevision) -> Result<VersionedRef<DistributionAttemptRef>, PortError>` | expected MustNotExist或typedloadExactrevision，禁隐式upsert | 同tx；append同ref同内容允许idempotent校验，不同内容Conflict；mutableCAS返回newrevision |
| `async fn load_disposition(&self, tx: &mut Self::Tx, reference: WithdrawalDispositionRef) -> Result<Option<WithdrawalDisposition>, PortError>` | WithdrawalDispositionRef exactkey；完整row typedrehydrate | OptionNone=absent；mutation Missing，query按currentdisclosure safe missing；不得补默认 |
| `async fn append_disposition(&self, tx: &mut Self::Tx, value: WithdrawalDisposition) -> Result<(), PortError>` | 完整immutablefixedinput | 同tx；append同ref同内容允许idempotent校验，不同内容Conflict；mutableCAS返回newrevision |
| `async fn load_impact(&self, tx: &mut Self::Tx, reference: ImpactRecordRef) -> Result<Option<Versioned<ImpactRecord>>, PortError>` | ImpactRecordRef exactkey；完整row typedrehydrate | OptionNone=absent；mutation Missing，query按currentdisclosure safe missing；不得补默认 |
| `async fn save_impact(&self, tx: &mut Self::Tx, value: ImpactRecord, expected: ExpectedMarketRevision) -> Result<VersionedRef<ImpactRecordRef>, PortError>` | expected MustNotExist或typedloadExactrevision，禁隐式upsert | 同tx；append同ref同内容允许idempotent校验，不同内容Conflict；mutableCAS返回newrevision |
| `async fn load_notice(&self, tx: &mut Self::Tx, reference: NoticeIntentRef) -> Result<Option<Versioned<NoticeIntent>>, PortError>` | NoticeIntentRef exactkey；完整row typedrehydrate | OptionNone=absent；mutation Missing，query按currentdisclosure safe missing；不得补默认 |
| `async fn save_notice(&self, tx: &mut Self::Tx, value: NoticeIntent, expected: ExpectedMarketRevision) -> Result<VersionedRef<NoticeIntentRef>, PortError>` | expected MustNotExist或typedloadExactrevision，禁隐式upsert | 同tx；append同ref同内容允许idempotent校验，不同内容Conflict；mutableCAS返回newrevision |
| `async fn load_recovery(&self, tx: &mut Self::Tx, reference: RecoveryIntentRef) -> Result<Option<Versioned<RecoveryIntent>>, PortError>` | RecoveryIntentRef exactkey；完整row typedrehydrate | OptionNone=absent；mutation Missing，query按currentdisclosure safe missing；不得补默认 |
| `async fn save_recovery(&self, tx: &mut Self::Tx, value: RecoveryIntent, expected: ExpectedMarketRevision) -> Result<VersionedRef<RecoveryIntentRef>, PortError>` | expected MustNotExist或typedloadExactrevision，禁隐式upsert | 同tx；append同ref同内容允许idempotent校验，不同内容Conflict；mutableCAS返回newrevision |
| `async fn list_verifications_by_publisher(&self, tx: &mut Self::Tx, publisher_ref: PublisherRelationRef, window: ReadWindow) -> Result<ScanPage<Versioned<SourceVerification>>, PortError>` | typedcommitted localrecords，同Tx/readscope/readwindow | Release有限关联/缺失不视合格 |
| `async fn list_versions(&self, tx: &mut Self::Tx, listing_ref: MarketplaceListingRef, context: PageReadContext, page: core_contracts::metadata::PageRequest) -> Result<Page<Versioned<MarketVersion>>, PortError>` | typedcommitted localrecords，同Tx/readscope/readwindow | 同scope裁剪item/count/cursor |
| `async fn list_categories(&self, tx: &mut Self::Tx, input: CategoryReadInput, context: PageReadContext, page: core_contracts::metadata::PageRequest) -> Result<Page<Versioned<Category>>, PortError>` | typedcommitted localrecords，同Tx/readscope/readwindow | currenttaxonomy visibility，无隐藏总数 |
| `async fn category_ancestors(&self, tx: &mut Self::Tx, parent_ref: CategoryRef, scope: SafeReadContext) -> Result<Vec<CategoryRef>, PortError>` | typedcommitted localrecords，同Tx/readscope/readwindow | 防cycle，错scopeMissing/NotVisible |
| `async fn get_relation_by_intent(&self, tx: &mut Self::Tx, intent_ref: DistributionIntentRef) -> Result<Option<Versioned<DistributionRelation>>, PortError>` | typedcommitted localrecords，同Tx/readscope/readwindow | unique原intent relation，missing integrity failure |
| `async fn list_relations(&self, tx: &mut Self::Tx, version_ref: MarketVersionRef, window: ReadWindow) -> Result<ScanPage<Versioned<DistributionRelation>>, PortError>` | typedcommitted localrecords，同Tx/readscope/readwindow | 固定upper稳定seq+typedref排序，分页不可漏 |
| `async fn list_attempts_by_intent(&self, tx: &mut Self::Tx, intent_ref: DistributionIntentRef, window: ReadWindow) -> Result<ScanPage<Versioned<DistributionAttempt>>, PortError>` | typedcommitted localrecords，同Tx/readscope/readwindow | 原attempt历史完整 |
| `async fn list_unknown_attempts(&self, tx: &mut Self::Tx, version_ref: MarketVersionRef, window: ReadWindow) -> Result<ScanPage<Versioned<DistributionAttempt>>, PortError>` | typedcommitted localrecords，同Tx/readscope/readwindow | CommitUnknown/Dispatching保守候选 |
| `async fn list_dispositions_by_version(&self, tx: &mut Self::Tx, version_ref: MarketVersionRef, window: ReadWindow) -> Result<ScanPage<WithdrawalDisposition>, PortError>` | typedcommitted localrecords，同Tx/readscope/readwindow | immutabletyped处置 |
| `async fn get_impact_by_disposition(&self, tx: &mut Self::Tx, disposition_ref: WithdrawalDispositionRef) -> Result<Option<Versioned<ImpactRecord>>, PortError>` | typedcommitted localrecords，同Tx/readscope/readwindow | unique处置impact missing不fakeempty |
| `async fn list_notices_by_impact(&self, tx: &mut Self::Tx, impact_ref: ImpactRecordRef, window: ReadWindow) -> Result<ScanPage<Versioned<NoticeIntent>>, PortError>` | typedcommitted localrecords，同Tx/readscope/readwindow | 同影响通知历史 |
| `async fn find_notice(&self, tx: &mut Self::Tx, impact_ref: ImpactRecordRef, target_ref: NoticeTargetRef, channel_ref: NoticeChannelRef, scope_ref: MarketScopeRef) -> Result<Option<Versioned<NoticeIntent>>, PortError>` | typedcommitted localrecords，同Tx/readscope/readwindow | unique(impact,target,channel,scope)，已建只返回不再发 |
| `async fn append_qualification_outcome(&self, tx: &mut Self::Tx, value: QualificationOutcomeRecord) -> Result<(), PortError>` | typedsidecar immutable | safeformal/localgapbasis同Tx，不能仅存ref无法readfailure |
| `async fn load_qualification_outcome(&self, tx: &mut Self::Tx, outcome_ref: QualificationOutcomeRef) -> Result<Option<QualificationOutcomeRecord>, PortError>` | typedsidecar immutable | SourceVerification.outcome_ref完整安全basis/failure读取 |
| `async fn page_attempts_by_intent(&self, tx: &mut Self::Tx, intent_ref: DistributionIntentRef, context: PageReadContext, page: core_contracts::metadata::PageRequest) -> Result<Page<Versioned<DistributionAttempt>>, PortError>` | CoreQueryMetadata.page，只参数化cursor/limit，不bodypage | publicCoremeta.page唯一；safeitems/count/token current scope；progress historychunk不冒称全量 |
| `async fn page_notices_by_impact(&self, tx: &mut Self::Tx, impact_ref: ImpactRecordRef, context: PageReadContext, page: core_contracts::metadata::PageRequest) -> Result<Page<Versioned<NoticeIntent>>, PortError>` | CoreQueryMetadata.page，只参数化cursor/limit，不bodypage | publicCorepage与noticehistoryreader，非workerwindow |
| `async fn scan_known_impact(&self, tx: &mut Self::Tx, version_ref: MarketVersionRef, window: ReadWindow) -> Result<ScanPage<ImpactScanItem>, PortError>` | local committed relation/unknown attempt rows for exactversion at upper; ReadWindow after tuple includes typedsubject tie-break | no external installation scan; same union ordering/count/nextcursor, absence of backing store error not empty; continuation linear under owning impact CAS |
| `async fn page_listed_versions(&self, tx: &mut Self::Tx, listing_ref: MarketplaceListingRef, context: PageReadContext, page: core_contracts::metadata::PageRequest) -> Result<Page<Versioned<MarketVersion>>, PortError>` | exact listing current disclosure and local Listed versions; Core metadata page authority | Listed predicate and current disclosure apply BEFORE page, count/token; no post-page filtering; backing store missing error, authorized valid empty separate |

停审：MarketStorePort typed读取/保存、version与Tx来源已核对；不透传raw SQL/SDK/secret，不增加truth。外部positive资格仍按binding表blocked。


### OperationStorePort

capability/对象能力：上下文single authority、operationscopekey、完整typed原结果；定义application/ports，调用方application七用例模块，具体实现：infra/postgres/operation_store + stagedfake。

```rust
/// Provides OperationStorePort as an application-owned typed boundary.
pub trait OperationStorePort {
    /// Uses the same transaction type as every local store.
    type Tx: MarketUow;
    /// Provides load_context for original operation and result authority.
    async fn load_context(&self, tx: &mut Self::Tx, context_ref: MarketContextRef) -> Result<Option<CoreContextRecord>, PortError>;
    /// Provides append_context for original operation and result authority.
    async fn append_context(&self, tx: &mut Self::Tx, value: CoreContextRecord) -> Result<(), PortError>;
    /// Provides find_by_key for original operation and result authority.
    async fn find_by_key(&self, tx: &mut Self::Tx, key: OperationKey) -> Result<Option<Versioned<OperationRecord>>, PortError>;
    /// Provides load_operation for original operation and result authority.
    async fn load_operation(&self, tx: &mut Self::Tx, operation_ref: MarketOperationRef) -> Result<Option<Versioned<OperationRecord>>, PortError>;
    /// Provides save_operation for original operation and result authority.
    async fn save_operation(&self, tx: &mut Self::Tx, value: OperationRecord, expected: ExpectedMarketRevision) -> Result<VersionedRef<MarketOperationRef>, PortError>;
    /// Provides load_result for original operation and result authority.
    async fn load_result(&self, tx: &mut Self::Tx, result_ref: StoredOperationResultRef) -> Result<Option<StoredOperationResult>, PortError>;
    /// Provides append_result for original operation and result authority.
    async fn append_result(&self, tx: &mut Self::Tx, value: StoredOperationResult) -> Result<(), PortError>;
    /// Provides load_by_operation for original operation and result authority.
    async fn load_by_operation(&self, tx: &mut Self::Tx, operation_ref: MarketOperationRef) -> Result<Option<StoredOperationResult>, PortError>;
    /// Provides append_checkpoint for immutable original job recovery.
    async fn append_checkpoint(&self, tx: &mut Self::Tx, value: JobCheckpoint) -> Result<(), PortError>;
    /// Provides load_checkpoint for immutable original job recovery.
    async fn load_checkpoint(&self, tx: &mut Self::Tx, operation_ref: MarketOperationRef) -> Result<Option<JobCheckpoint>, PortError>;
    /// Provides find_checkpoints_by_work for immutable original job recovery.
    async fn find_checkpoints_by_work(&self, tx: &mut Self::Tx, work_ref: DeferredWorkRef) -> Result<Vec<JobCheckpoint>, PortError>;
}
```

| callable | 完整输入/返回来源 | missing/conflict/failure/副作用 |
|---|---|---|
| `async fn load_context(&self, tx: &mut Self::Tx, context_ref: MarketContextRef) -> Result<Option<CoreContextRecord>, PortError>` | applicationownedcontext/typedlocalstore，existingTx | domaincontextref必须存在记录，missing IntegrityFailure |
| `async fn append_context(&self, tx: &mut Self::Tx, value: CoreContextRecord) -> Result<(), PortError>` | applicationownedcontext/typedlocalstore，existingTx | append-only同ref同内容校验，key/trace不可新authority |
| `async fn find_by_key(&self, tx: &mut Self::Tx, key: OperationKey) -> Result<Option<Versioned<OperationRecord>>, PortError>` | applicationownedcontext/typedlocalstore，existingTx | 缺失fresh，可见reserved不能当成功；同keydiff fingerprint conflict |
| `async fn load_operation(&self, tx: &mut Self::Tx, operation_ref: MarketOperationRef) -> Result<Option<Versioned<OperationRecord>>, PortError>` | applicationownedcontext/typedlocalstore，existingTx | typed完整读取，不从result/projection猜 |
| `async fn save_operation(&self, tx: &mut Self::Tx, value: OperationRecord, expected: ExpectedMarketRevision) -> Result<VersionedRef<MarketOperationRef>, PortError>` | applicationownedcontext/typedlocalstore，existingTx | reserve+complete同UoW，唯一key与CAS |
| `async fn load_result(&self, tx: &mut Self::Tx, result_ref: StoredOperationResultRef) -> Result<Option<StoredOperationResult>, PortError>` | applicationownedcontext/typedlocalstore，existingTx | 完整MarketResultSurface；缺失/错kind/schema/operation IntegrityFailure |
| `async fn append_result(&self, tx: &mut Self::Tx, value: StoredOperationResult) -> Result<(), PortError>` | applicationownedcontext/typedlocalstore，existingTx | immutable完整原result，主体/审计/work/complete同UoW |
| `async fn load_by_operation(&self, tx: &mut Self::Tx, operation_ref: MarketOperationRef) -> Result<Option<StoredOperationResult>, PortError>` | applicationownedcontext/typedlocalstore，existingTx | typed operation.result_ref联查fullpayload，回放不current重建 |
| `async fn append_checkpoint(&self, tx: &mut Self::Tx, value: JobCheckpoint) -> Result<(), PortError>` | typedoriginalcheckpoint | sameinitialclaim/permissionUoW，immutablefrozen request；无new lifecycle |
| `async fn load_checkpoint(&self, tx: &mut Self::Tx, operation_ref: MarketOperationRef) -> Result<Option<JobCheckpoint>, PortError>` | typedoriginalcheckpoint | 原Reserved Job typedrequest/result/audit/context完整恢复；missing blocked |
| `async fn find_checkpoints_by_work(&self, tx: &mut Self::Tx, work_ref: DeferredWorkRef) -> Result<Vec<JobCheckpoint>, PortError>` | typedoriginalcheckpoint | 同work原Reservedjob记录；只typed原fence/selector匹配，不用private map |

停审：OperationStorePort typed读取/保存、version与Tx来源已核对；不透传raw SQL/SDK/secret，不增加truth。外部positive资格仍按binding表blocked。


### AuditStorePort

capability/对象能力：MarketAuditRecord append-only与安全history读取；定义application/ports，调用方application七用例模块，具体实现：infra/postgres/audit_store+fake。

```rust
/// Provides AuditStorePort as an application-owned typed boundary.
pub trait AuditStorePort {
    /// Uses the same transaction type as every local store.
    type Tx: MarketUow;
    /// Provides the safe append_audit audit surface.
    async fn append_audit(&self, tx: &mut Self::Tx, value: MarketAuditRecord) -> Result<(), PortError>;
    /// Provides the safe load_audit audit surface.
    async fn load_audit(&self, tx: &mut Self::Tx, audit_ref: MarketAuditRef) -> Result<Option<MarketAuditRecord>, PortError>;
    /// Provides the safe list_audits audit surface.
    async fn list_audits(&self, tx: &mut Self::Tx, subject_ref: MarketAuditSubjectRef, context: PageReadContext, page: core_contracts::metadata::PageRequest) -> Result<Page<MarketAuditRecord>, PortError>;
    /// Provides the safe save_observation_binding audit surface.
    async fn save_observation_binding(&self, tx: &mut Self::Tx, value: ObservationOutcomeBinding) -> Result<(), PortError>;
    /// Provides the safe get_observation_binding audit surface.
    async fn get_observation_binding(&self, tx: &mut Self::Tx, operation_ref: MarketOperationRef) -> Result<Option<ObservationOutcomeBinding>, PortError>;
}
```

| callable | 完整输入/返回来源 | missing/conflict/failure/副作用 |
|---|---|---|
| `async fn append_audit(&self, tx: &mut Self::Tx, value: MarketAuditRecord) -> Result<(), PortError>` | append-onlylocalfact/formaloutcomebinding | sameTx acceptedfact，纠错append新record不overwrite |
| `async fn load_audit(&self, tx: &mut Self::Tx, audit_ref: MarketAuditRef) -> Result<Option<MarketAuditRecord>, PortError>` | append-onlylocalfact/formaloutcomebinding | body-freeexact，missing不假Obsreceipt |
| `async fn list_audits(&self, tx: &mut Self::Tx, subject_ref: MarketAuditSubjectRef, context: PageReadContext, page: core_contracts::metadata::PageRequest) -> Result<Page<MarketAuditRecord>, PortError>` | append-onlylocalfact/formaloutcomebinding | item/count/cursor current scope交集 |
| `async fn save_observation_binding(&self, tx: &mut Self::Tx, value: ObservationOutcomeBinding) -> Result<(), PortError>` | append-onlylocalfact/formaloutcomebinding | append正式matching outcome；不得本地audit自己生成 |
| `async fn get_observation_binding(&self, tx: &mut Self::Tx, operation_ref: MarketOperationRef) -> Result<Option<ObservationOutcomeBinding>, PortError>` | append-onlylocalfact/formaloutcomebinding | formaladmitted独立，missing=未证明接纳 |

停审：AuditStorePort typed读取/保存、version与Tx来源已核对；不透传raw SQL/SDK/secret，不增加truth。外部positive资格仍按binding表blocked。


### WorkStorePort

capability/对象能力：原durable responsibility/fence/permission/recovery读取；定义application/ports，调用方application七用例模块，具体实现：infra/postgres/work_store+fake。

```rust
/// Provides WorkStorePort as an application-owned typed boundary.
pub trait WorkStorePort {
    /// Uses the same transaction type as every local store.
    type Tx: MarketUow;
    /// Provides load_work for durable local responsibility.
    async fn load_work(&self, tx: &mut Self::Tx, work_ref: DeferredWorkRef) -> Result<Option<Versioned<DeferredWork>>, PortError>;
    /// Provides save_work for durable local responsibility.
    async fn save_work(&self, tx: &mut Self::Tx, value: DeferredWork, expected: ExpectedMarketRevision) -> Result<VersionedRef<DeferredWorkRef>, PortError>;
    /// Provides claim for durable local responsibility.
    async fn claim(&self, tx: &mut Self::Tx, value: DeferredWork, expected: ExpectedMarketRevision, now: MarketInstant) -> Result<VersionedRef<DeferredWorkRef>, PortError>;
    /// Provides list_pending for durable local responsibility.
    async fn list_pending(&self, tx: &mut Self::Tx, scope_ref: MarketScopeRef, window: ReadWindow) -> Result<ScanPage<Versioned<DeferredWork>>, PortError>;
    /// Provides find_by_intent for durable local responsibility.
    async fn find_by_intent(&self, tx: &mut Self::Tx, intent_ref: MarketEffectIntentRef, target_ref: MarketWorkTargetRef) -> Result<Option<Versioned<DeferredWork>>, PortError>;
    /// Provides append_permission for durable local responsibility.
    async fn append_permission(&self, tx: &mut Self::Tx, permission: DispatchPermission) -> Result<(), PortError>;
    /// Provides get_permission for durable local responsibility.
    async fn get_permission(&self, tx: &mut Self::Tx, target_ref: MarketWorkTargetRef, fence: DispatchFence) -> Result<Option<DispatchPermission>, PortError>;
    /// Provides record_late_impact_work for durable local responsibility.
    async fn record_late_impact_work(&self, tx: &mut Self::Tx, attempt_ref: DistributionAttemptRef, disposition_ref: WithdrawalDispositionRef, work: DeferredWork) -> Result<(), PortError>;
    /// Provides append_plan for the frozen work plan.
    async fn append_plan(&self, tx: &mut Self::Tx, value: DeferredPlan) -> Result<(), PortError>;
    /// Provides load_plan for the frozen work plan.
    async fn load_plan(&self, tx: &mut Self::Tx, work_ref: DeferredWorkRef) -> Result<Option<DeferredPlan>, PortError>;
}
```

| callable | 完整输入/返回来源 | missing/conflict/failure/副作用 |
|---|---|---|
| `async fn load_work(&self, tx: &mut Self::Tx, work_ref: DeferredWorkRef) -> Result<Option<Versioned<DeferredWork>>, PortError>` | localtypedwork/claim/fence/immutablepermission | 完整原target/intent/fence/state/result |
| `async fn save_work(&self, tx: &mut Self::Tx, value: DeferredWork, expected: ExpectedMarketRevision) -> Result<VersionedRef<DeferredWorkRef>, PortError>` | localtypedwork/claim/fence/immutablepermission | sameTx CAS，spawn work unique target+effectintent+jobphase |
| `async fn claim(&self, tx: &mut Self::Tx, value: DeferredWork, expected: ExpectedMarketRevision, now: MarketInstant) -> Result<VersionedRef<DeferredWorkRef>, PortError>` | localtypedwork/claim/fence/immutablepermission | value是DeferredWork.claim输出，staged CAS；expires_at>now，旧fence拒绝 |
| `async fn list_pending(&self, tx: &mut Self::Tx, scope_ref: MarketScopeRef, window: ReadWindow) -> Result<ScanPage<Versioned<DeferredWork>>, PortError>` | localtypedwork/claim/fence/immutablepermission | boundedpending/blockedreadytargets；scheduler通过typedJobfacade，不直store |
| `async fn find_by_intent(&self, tx: &mut Self::Tx, intent_ref: MarketEffectIntentRef, target_ref: MarketWorkTargetRef) -> Result<Option<Versioned<DeferredWork>>, PortError>` | localtypedwork/claim/fence/immutablepermission | 原intent唯一 responsibility lookup，不造secondintent |
| `async fn append_permission(&self, tx: &mut Self::Tx, permission: DispatchPermission) -> Result<(), PortError>` | localtypedwork/claim/fence/immutablepermission | immutable许可fact；sameversionlock/currentgate/claim同Tx，commit才call |
| `async fn get_permission(&self, tx: &mut Self::Tx, target_ref: MarketWorkTargetRef, fence: DispatchFence) -> Result<Option<DispatchPermission>, PortError>` | localtypedwork/claim/fence/immutablepermission | 原target/fence/intent读取；missing禁止外发或猜late结果 |
| `async fn record_late_impact_work(&self, tx: &mut Self::Tx, attempt_ref: DistributionAttemptRef, disposition_ref: WithdrawalDispositionRef, work: DeferredWork) -> Result<(), PortError>` | localtypedwork/claim/fence/immutablepermission | matchingformal late outcome同UoW append dedup(原attempt,disposition,outcome)责任；不丢撤回影响 |
| `async fn append_plan(&self, tx: &mut Self::Tx, value: DeferredPlan) -> Result<(), PortError>` | accepted/followup sameTx persistedplan | frozenboundedplan与work同Tx，不能从fake private map补 |
| `async fn load_plan(&self, tx: &mut Self::Tx, work_ref: DeferredWorkRef) -> Result<Option<DeferredPlan>, PortError>` | accepted/followup sameTx persistedplan | 原完整targets/window/selector/typedprojection sources；missing Blocked/IntegrityFailure |

停审：WorkStorePort typed读取/保存、version与Tx来源已核对；不透传raw SQL/SDK/secret，不增加truth。外部positive资格仍按binding表blocked。


### SnapshotStorePort

capability/对象能力：QualifiedReferenceSnapshot完整state+body pair；定义application/ports，调用方application七用例模块，具体实现：infra/postgres/snapshot_store+fake。

```rust
/// Provides SnapshotStorePort as an application-owned typed boundary.
pub trait SnapshotStorePort {
    /// Uses the same transaction type as every local store.
    type Tx: MarketUow;
    /// Provides the typed load_snapshot source snapshot pair.
    async fn load_snapshot(&self, tx: &mut Self::Tx, snapshot_ref: QualifiedReferenceSnapshotRef) -> Result<Option<Versioned<QualifiedReferenceSnapshot>>, PortError>;
    /// Provides the typed find_snapshot source snapshot pair.
    async fn find_snapshot(&self, tx: &mut Self::Tx, source_ref: TypedOwnerReference, scope_ref: MarketScopeRef) -> Result<Option<Versioned<QualifiedReferenceSnapshot>>, PortError>;
    /// Provides the typed save_snapshot source snapshot pair.
    async fn save_snapshot(&self, tx: &mut Self::Tx, value: QualifiedReferenceSnapshot, expected: ExpectedMarketRevision) -> Result<VersionedRef<QualifiedReferenceSnapshotRef>, PortError>;
    /// Provides the typed list_snapshots source snapshot pair.
    async fn list_snapshots(&self, tx: &mut Self::Tx, scope_ref: MarketScopeRef, window: ReadWindow) -> Result<ScanPage<Versioned<QualifiedReferenceSnapshot>>, PortError>;
}
```

| callable | 完整输入/返回来源 | missing/conflict/failure/副作用 |
|---|---|---|
| `async fn load_snapshot(&self, tx: &mut Self::Tx, snapshot_ref: QualifiedReferenceSnapshotRef) -> Result<Option<Versioned<QualifiedReferenceSnapshot>>, PortError>` | typedformal slice与localCAS | typed本体/state同读；Unavailable不当空Qualified |
| `async fn find_snapshot(&self, tx: &mut Self::Tx, source_ref: TypedOwnerReference, scope_ref: MarketScopeRef) -> Result<Option<Versioned<QualifiedReferenceSnapshot>>, PortError>` | typedformal slice与localCAS | exactsourceconsumer/scope，唯一shadow；不字符串parse |
| `async fn save_snapshot(&self, tx: &mut Self::Tx, value: QualifiedReferenceSnapshot, expected: ExpectedMarketRevision) -> Result<VersionedRef<QualifiedReferenceSnapshotRef>, PortError>` | typedformal slice与localCAS | formalqualified材料才refresh；stale/unavailable要安全failure依据 |
| `async fn list_snapshots(&self, tx: &mut Self::Tx, scope_ref: MarketScopeRef, window: ReadWindow) -> Result<ScanPage<Versioned<QualifiedReferenceSnapshot>>, PortError>` | typedformal slice与localCAS | 维护targets从persistedplan或explicitrefs，不用replay重新scan |

停审：SnapshotStorePort typed读取/保存、version与Tx来源已核对；不透传raw SQL/SDK/secret，不增加truth。外部positive资格仍按binding表blocked。


### ProjectionStorePort

capability/对象能力：ReadProjection状态与safeviews、truth plan、catalogscope搜索；定义application/ports，调用方application七用例模块，具体实现：infra/postgres/projection_store/catalog_search+fake。

```rust
/// Provides ProjectionStorePort as an application-owned typed boundary.
pub trait ProjectionStorePort {
    /// Uses the same transaction type as every local store.
    type Tx: MarketUow;
    /// Provides the typed load_projection projection surface.
    async fn load_projection(&self, tx: &mut Self::Tx, projection_ref: MarketProjectionRef) -> Result<Option<ProjectionReadSet>, PortError>;
    /// Provides the typed find_projection projection surface.
    async fn find_projection(&self, tx: &mut Self::Tx, identity: ProjectionIdentity) -> Result<Option<ProjectionReadSet>, PortError>;
    /// Provides the typed save_projection projection surface.
    async fn save_projection(&self, tx: &mut Self::Tx, value: ReadProjection, expected: ExpectedMarketRevision) -> Result<VersionedRef<MarketProjectionRef>, PortError>;
    /// Provides the typed publish_views projection surface.
    async fn publish_views(&self, tx: &mut Self::Tx, value: ReadProjection, items: Vec<ProjectionBuildItem>, expected: ExpectedMarketRevision) -> Result<VersionedRef<MarketProjectionRef>, PortError>;
    /// Provides the typed read_truth_sources projection surface.
    async fn read_truth_sources(&self, tx: &mut Self::Tx, plan: ProjectionRebuildPlanInput, scope: SafeReadContext) -> Result<Vec<ProjectionBuildItem>, PortError>;
    /// Provides the typed search_catalog projection surface.
    async fn search_catalog(&self, tx: &mut Self::Tx, input: CatalogSearchInput, context: PageReadContext, page: core_contracts::metadata::PageRequest) -> Result<Page<CatalogReadView>, PortError>;
    /// Freezes a nonempty typed projection plan from committed facts and qualified snapshots.
    async fn plan_projection(&self, tx: &mut Self::Tx, identity: ProjectionIdentity, scope: SafeReadContext, upper: MarketSourceCursor) -> Result<ProjectionRebuildPlanInput, PortError>;
    /// Finds typed projection families affected by one committed local subject.
    async fn affected_projections(&self, tx: &mut Self::Tx, subject: MarketAuditSubjectRef, scope: SafeReadContext) -> Result<Vec<ProjectionIdentity>, PortError>;
    /// Reads the committed dependency highwater for the exact typed projection identity.
    async fn source_cursor(&self, tx: &mut Self::Tx, identity: ProjectionIdentity) -> Result<MarketSourceCursor, PortError>;
}
```

| callable | 完整输入/返回来源 | missing/conflict/failure/副作用 |
|---|---|---|
| `async fn load_projection(&self, tx: &mut Self::Tx, projection_ref: MarketProjectionRef) -> Result<Option<ProjectionReadSet>, PortError>` | committedlocalfacts与typedownerqualifiedslice | state+body同Tx；freshmissingbody integrity |
| `async fn find_projection(&self, tx: &mut Self::Tx, identity: ProjectionIdentity) -> Result<Option<ProjectionReadSet>, PortError>` | committedlocalfacts与typedownerqualifiedslice | kind/scope唯一，不根据opaqueid推 |
| `async fn save_projection(&self, tx: &mut Self::Tx, value: ReadProjection, expected: ExpectedMarketRevision) -> Result<VersionedRef<MarketProjectionRef>, PortError>` | committedlocalfacts与typedownerqualifiedslice | maintenance姿态，不写business；sameTx CAS |
| `async fn publish_views(&self, tx: &mut Self::Tx, value: ReadProjection, items: Vec<ProjectionBuildItem>, expected: ExpectedMarketRevision) -> Result<VersionedRef<MarketProjectionRef>, PortError>` | committedlocalfacts与typedownerqualifiedslice | completefixedcursor所有shadow/body/state原子替换 |
| `async fn read_truth_sources(&self, tx: &mut Self::Tx, plan: ProjectionRebuildPlanInput, scope: SafeReadContext) -> Result<Vec<ProjectionBuildItem>, PortError>` | committedlocalfacts与typedownerqualifiedslice | typedcommittedfacts+qualifiedsnapshots/currentdisclosure；禁止旧index作为来源 |
| `async fn search_catalog(&self, tx: &mut Self::Tx, input: CatalogSearchInput, context: PageReadContext, page: core_contracts::metadata::PageRequest) -> Result<Page<CatalogReadView>, PortError>` | committedlocalfacts与typedownerqualifiedslice | 过滤先于count/suggest/item；参数化escapedsubstring+pg_trgm中文不假EnglishFTS |
| `async fn plan_projection(&self, tx: &mut Self::Tx, identity: ProjectionIdentity, scope: SafeReadContext, upper: MarketSourceCursor) -> Result<ProjectionRebuildPlanInput, PortError>` | read-only stablefacts/snapshots/kindscope keys；全计划来源明列非旧index | nonempty/bounded capacity gate；不足sources/超配置cap阻，不partialFresh |
| `async fn affected_projections(&self, tx: &mut Self::Tx, subject: MarketAuditSubjectRef, scope: SafeReadContext) -> Result<Vec<ProjectionIdentity>, PortError>` | 本地typedrelation/keymapping，Catalog/Progress/Impact/Audit | 同scope，无ref parse；无匹配仅零derivedwork不假activeview |
| `async fn source_cursor(&self, tx: &mut Self::Tx, identity: ProjectionIdentity) -> Result<MarketSourceCursor, PortError>` | committed local owning facts/qualified snapshots selected by identity and the fixed truth-source policy; Catalog listing/version/category/source, Progress application/review/distribution, Impact disposition/impact/notice, Audit accepted business audit facts | exclude lease/checkpoint/operation technical records and projection-maintenance audit/report/self-writes; Audit read projection includes accepted business audit facts only, full maintenance audits remain available in GetMarketAudit. No index body as truth, no private map/inferredref; source_cursor and plan_projection share same predicate/as-of cursor |

停审：ProjectionStorePort typed读取/保存、version与Tx来源已核对；不透传raw SQL/SDK/secret，不增加truth。外部positive资格仍按binding表blocked。


### ScopeResolverPort

capability/对象能力：全部entry与replay/read的currentactor/scope/disclosure；定义application/ports，调用方application七用例模块，具体实现：infra/sdk/scope_resolver。

```rust
/// Provides ScopeResolverPort as an application-owned typed boundary.
pub trait ScopeResolverPort {
    /// Provides formal resolve data without copying upstream truth.
    async fn resolve(&self, input: ScopeResolutionInput) -> Result<ScopeResolution, ExternalPortError>;
}
```

| callable | 完整输入/返回来源 | missing/conflict/failure/副作用 |
|---|---|---|
| `async fn resolve(&self, input: ScopeResolutionInput) -> Result<ScopeResolution, ExternalPortError>` | formal ownerconsumer exact export+SDKoperation映射；当前资格受影响blocked | 只读，不假身份；NotVisible不泄漏存在；refs resolverfirst |

停审：ScopeResolverPort typed读取/保存、version与Tx来源已核对；不透传raw SQL/SDK/secret，不增加truth。外部positive资格仍按binding表blocked。


### SourceOwnerPort

capability/对象能力：U1 sourceimmutablebinding/currenteligibility与U7snapshot；定义application/ports，调用方application七用例模块，具体实现：infra/sdk/source_owner。

```rust
/// Provides SourceOwnerPort as an application-owned typed boundary.
pub trait SourceOwnerPort {
    /// Provides formal resolve data without copying upstream truth.
    async fn resolve(&self, input: SourceResolveRequest) -> Result<SourceResolveOutput, ExternalPortError>;
    /// Provides formal read_current data without copying upstream truth.
    async fn read_current(&self, source: SourceBinding, scope: SafeReadContext) -> Result<SourceResolveOutput, ExternalPortError>;
    /// Provides formal read_snapshot data without copying upstream truth.
    async fn read_snapshot(&self, snapshot_ref: QualifiedReferenceSnapshotRef, source: TypedOwnerReference, scope: SafeReadContext) -> Result<QualifiedSnapshotInput, ExternalPortError>;
}
```

| callable | 完整输入/返回来源 | missing/conflict/failure/副作用 |
|---|---|---|
| `async fn resolve(&self, input: SourceResolveRequest) -> Result<SourceResolveOutput, ExternalPortError>` | formal ownerconsumer exact export+SDKoperation映射；当前资格受影响blocked | 缺exacttype/version/digest/visibility/eligibilityblocked；不copybody |
| `async fn read_current(&self, source: SourceBinding, scope: SafeReadContext) -> Result<SourceResolveOutput, ExternalPortError>` | formal ownerconsumer exact export+SDKoperation映射；当前资格受影响blocked | 原binding当前eligibility/visibility，不默认latest |
| `async fn read_snapshot(&self, snapshot_ref: QualifiedReferenceSnapshotRef, source: TypedOwnerReference, scope: SafeReadContext) -> Result<QualifiedSnapshotInput, ExternalPortError>` | formal ownerconsumer exact export+SDKoperation映射；当前资格受影响blocked | typedbody-freepair/version/validity；非源正文 |

停审：SourceOwnerPort typed读取/保存、version与Tx来源已核对；不透传raw SQL/SDK/secret，不增加truth。外部positive资格仍按binding表blocked。


### PublisherAuthorityPort

capability/对象能力：人类publisher/org与发布/维护权限；Identity AI≠human认证；定义application/ports，调用方application七用例模块，具体实现：infra/sdk/publisher_authority。

```rust
/// Provides PublisherAuthorityPort as an application-owned typed boundary.
pub trait PublisherAuthorityPort {
    /// Provides formal resolve_publisher data without copying upstream truth.
    async fn resolve_publisher(&self, input: PublisherResolveRequest) -> Result<ResolvedPublisherAuthority, ExternalPortError>;
    /// Provides formal current_authority data without copying upstream truth.
    async fn current_authority(&self, relation: PublisherRelation, scope: SafeReadContext) -> Result<CurrentAuthorityInput, ExternalPortError>;
    /// Provides formal disposition_authority data without copying upstream truth.
    async fn disposition_authority(&self, subject: MarketAuditSubjectRef, action: MarketDispositionKind, scope: SafeReadContext) -> Result<DispositionAuthorityRef, ExternalPortError>;
    /// Requires formal authority for the exact local operation and subject.
    async fn authorize_operation(&self, operation_kind: MarketOperationKind, subject: MarketAuditSubjectRef, scope: SafeReadContext) -> Result<OperationAuthority, ExternalPortError>;
    /// Returns the formally qualified exact consumer contract for this boundary.
    fn consumer_contract(&self) -> Result<OwnerConsumerContractRef, ExternalPortError>;
    /// Authorizes local taxonomy maintenance in the exact current scope without inventing a category identifier.
    async fn authorize_taxonomy(&self, scope: SafeReadContext) -> Result<SafeBasisReferenceSet, ExternalPortError>;
}
```

| callable | 完整输入/返回来源 | missing/conflict/failure/副作用 |
|---|---|---|
| `async fn resolve_publisher(&self, input: PublisherResolveRequest) -> Result<ResolvedPublisherAuthority, ExternalPortError>` | formal ownerconsumer exact export+SDKoperation映射；当前资格受影响blocked | formal principal/authority/scope/validity；localrelationID只能winningfreshUoW IDPort生成，不调用owner造本地ID |
| `async fn current_authority(&self, relation: PublisherRelation, scope: SafeReadContext) -> Result<CurrentAuthorityInput, ExternalPortError>` | formal ownerconsumer exact export+SDKoperation映射；当前资格受影响blocked | Released立即拒绝；正式scope/authority，非hint |
| `async fn disposition_authority(&self, subject: MarketAuditSubjectRef, action: MarketDispositionKind, scope: SafeReadContext) -> Result<DispositionAuthorityRef, ExternalPortError>` | formal ownerconsumer exact export+SDKoperation映射；当前资格受影响blocked | Release/Terminate/Restrict/Withdraw/taxonomy/recovery有权操作还需exactoperation，不能泛化action |
| `async fn authorize_operation(&self, operation_kind: MarketOperationKind, subject: MarketAuditSubjectRef, scope: SafeReadContext) -> Result<OperationAuthority, ExternalPortError>` | 正式人类/org/operator/来源失效或处置authority；不是IdentityAIprofile | selector/subject/scope fullmatch；缺authority failclosed，不泛化Restrict/Withdraw |
| `fn consumer_contract(&self) -> Result<OwnerConsumerContractRef, ExternalPortError>` | formalowner消费合同+当前SDKoperation映射，非任意配置string | 不能证明exact支持则ContractBlocked；它不是approval/auth结果，后续currentread仍必需 |
| `async fn authorize_taxonomy(&self, scope: SafeReadContext) -> Result<SafeBasisReferenceSet, ExternalPortError>` | formal publisher/taxonomy authority exact current actor/scope + MaintainMarketCategory operation; missing formal owner contract blocked | nonempty formal bases; no source category truth or approval; Create has no local category ID before winning reservation |

停审：PublisherAuthorityPort typed读取/保存、version与Tx来源已核对；不透传raw SQL/SDK/secret，不增加truth。外部positive资格仍按binding表blocked。


### MaterialAuthorityPort

capability/对象能力：签名/扫描/SBOM仅引用，不审核；定义application/ports，调用方application七用例模块，具体实现：infra/sdk/material_authority。

```rust
/// Provides MaterialAuthorityPort as an application-owned typed boundary.
pub trait MaterialAuthorityPort {
    /// Provides formal resolve_materials data without copying upstream truth.
    async fn resolve_materials(&self, input: MaterialResolveRequest) -> Result<MaterialReferenceSet, ExternalPortError>;
}
```

| callable | 完整输入/返回来源 | missing/conflict/failure/副作用 |
|---|---|---|
| `async fn resolve_materials(&self, input: MaterialResolveRequest) -> Result<MaterialReferenceSet, ExternalPortError>` | formal ownerconsumer exact export+SDKoperation映射；当前资格受影响blocked | formal authority kind/applicability/current sourcebinding；结果齐≠approval |

停审：MaterialAuthorityPort typed读取/保存、version与Tx来源已核对；不透传raw SQL/SDK/secret，不增加truth。外部positive资格仍按binding表blocked。


### GovernancePort

capability/对象能力：formalreview handoff/approved决定与unknownprobe；定义application/ports，调用方application七用例模块，具体实现：infra/sdk/governance。

```rust
/// Provides GovernancePort as an application-owned typed boundary.
pub trait GovernancePort {
    /// Provides formal read_decision data without copying upstream truth.
    async fn read_decision(&self, input: GovernanceReadInput) -> Result<GovernanceReadOutput, ExternalPortError>;
    /// Provides formal dispatch_review data without copying upstream truth.
    async fn dispatch_review(&self, input: ReviewExternalInput) -> Result<ReviewDispatchOutcomeInput, ExternalPortError>;
    /// Provides formal probe_review data without copying upstream truth.
    async fn probe_review(&self, input: ReviewExternalInput) -> Result<ReviewProbeResult, ExternalPortError>;
    /// Returns the formally qualified exact consumer contract for this boundary.
    fn consumer_contract(&self) -> Result<OwnerConsumerContractRef, ExternalPortError>;
}
```

| callable | 完整输入/返回来源 | missing/conflict/failure/副作用 |
|---|---|---|
| `async fn read_decision(&self, input: GovernanceReadInput) -> Result<GovernanceReadOutput, ExternalPortError>` | formal ownerconsumer exact export+SDKoperation映射；当前资格受影响blocked | fullbinding/currentformalvalidity，不能当GeneralQueryResponse自填approved |
| `async fn dispatch_review(&self, input: ReviewExternalInput) -> Result<ReviewDispatchOutcomeInput, ExternalPortError>` | formal ownerconsumer exact export+SDKoperation映射；当前资格受影响blocked | permission已commit，formalACK只WaitingDecision |
| `async fn probe_review(&self, input: ReviewExternalInput) -> Result<ReviewProbeResult, ExternalPortError>` | formal ownerconsumer exact export+SDKoperation映射；当前资格受影响blocked; optional exact dispatch outcome and formal decision, inspection does not mint receipt | originalhandoffintentprobe，缺probe等待人工formalbasis不盲发 |
| `fn consumer_contract(&self) -> Result<OwnerConsumerContractRef, ExternalPortError>` | formalowner消费合同+当前SDKoperation映射，非任意配置string | 不能证明exact支持则ContractBlocked；它不是approval/auth结果，后续currentread仍必需 |

停审：GovernancePort typed读取/保存、version与Tx来源已核对；不透传raw SQL/SDK/secret，不增加truth。外部positive资格仍按binding表blocked。


### ReceiverPort

capability/对象能力：当前接收能力/获取材料化owner结果与原intentprobe；定义application/ports，调用方application七用例模块，具体实现：infra/sdk/receiver。

```rust
/// Provides ReceiverPort as an application-owned typed boundary.
pub trait ReceiverPort {
    /// Provides formal qualify_target data without copying upstream truth.
    async fn qualify_target(&self, target: AcquisitionTargetInput, scope: SafeReadContext) -> Result<AcquisitionTargetInput, ExternalPortError>;
    /// Provides formal dispatch_distribution data without copying upstream truth.
    async fn dispatch_distribution(&self, input: ReceiverDispatchInput) -> Result<ReceiverFormalResult, ExternalPortError>;
    /// Provides formal probe_distribution data without copying upstream truth.
    async fn probe_distribution(&self, input: ReceiverProbeInput) -> Result<ReceiverFormalResult, ExternalPortError>;
    /// Returns the formally qualified exact consumer contract for this boundary.
    fn consumer_contract(&self) -> Result<OwnerConsumerContractRef, ExternalPortError>;
}
```

| callable | 完整输入/返回来源 | missing/conflict/failure/副作用 |
|---|---|---|
| `async fn qualify_target(&self, target: AcquisitionTargetInput, scope: SafeReadContext) -> Result<AcquisitionTargetInput, ExternalPortError>` | formal ownerconsumer exact export+SDKoperation映射；当前资格受影响blocked | exactreceiver当前consumer/scope允许，并不证明install |
| `async fn dispatch_distribution(&self, input: ReceiverDispatchInput) -> Result<ReceiverFormalResult, ExternalPortError>` | formal ownerconsumer exact export+SDKoperation映射；当前资格受影响blocked | 外call在许可commit后；timeout=Unknown，不能新意图重发 |
| `async fn probe_distribution(&self, input: ReceiverProbeInput) -> Result<ReceiverFormalResult, ExternalPortError>` | formal ownerconsumer exact export+SDKoperation映射；当前资格受影响blocked | 正式originalintent匹配，迟到binding仍保存并spawnimpact |
| `fn consumer_contract(&self) -> Result<OwnerConsumerContractRef, ExternalPortError>` | formalowner消费合同+当前SDKoperation映射，非任意配置string | 不能证明exact支持则ContractBlocked；它不是approval/auth结果，后续currentread仍必需 |

停审：ReceiverPort typed读取/保存、version与Tx来源已核对；不透传raw SQL/SDK/secret，不增加truth。外部positive资格仍按binding表blocked。


### NoticeChannelPort

capability/对象能力：正式通知target/channel/receipt边界；定义application/ports，调用方application七用例模块，具体实现：infra/sdk/notice_channel。

```rust
/// Provides NoticeChannelPort as an application-owned typed boundary.
pub trait NoticeChannelPort {
    /// Provides formal qualify_notice data without copying upstream truth.
    async fn qualify_notice(&self, input: QualifiedNoticePlanInput, scope: SafeReadContext) -> Result<QualifiedNoticePlanInput, ExternalPortError>;
    /// Provides formal dispatch_notice data without copying upstream truth.
    async fn dispatch_notice(&self, input: NoticeExternalInput) -> Result<NoticeFormalResult, ExternalPortError>;
    /// Provides formal probe_notice data without copying upstream truth.
    async fn probe_notice(&self, input: NoticeExternalInput) -> Result<NoticeFormalResult, ExternalPortError>;
    /// Resolves a body-free notification target and channel from candidates.
    async fn resolve_notice(&self, impact_ref: ImpactRecordRef, candidate: NoticePlanCandidate, scope: SafeReadContext) -> Result<ResolvedNoticeTarget, ExternalPortError>;
    /// Returns the exact formally qualified notice consumer binding or blocks the path.
    fn consumer_contract(&self) -> Result<OwnerConsumerContractRef, ExternalPortError>;
}
```

| callable | 完整输入/返回来源 | missing/conflict/failure/副作用 |
|---|---|---|
| `async fn qualify_notice(&self, input: QualifiedNoticePlanInput, scope: SafeReadContext) -> Result<QualifiedNoticePlanInput, ExternalPortError>` | formal ownerconsumer exact export+SDKoperation映射；当前资格受影响blocked | 本地ID由application；formaltarget/channel/scope，缺ownerblocked |
| `async fn dispatch_notice(&self, input: NoticeExternalInput) -> Result<NoticeFormalResult, ExternalPortError>` | formal ownerconsumer exact export+SDKoperation映射；当前资格受影响blocked | formalreceipt只Confirmed，不送达/已读 |
| `async fn probe_notice(&self, input: NoticeExternalInput) -> Result<NoticeFormalResult, ExternalPortError>` | formal ownerconsumer exact export+SDKoperation映射；当前资格受影响blocked | 原notice intent，不盲retry |
| `async fn resolve_notice(&self, impact_ref: ImpactRecordRef, candidate: NoticePlanCandidate, scope: SafeReadContext) -> Result<ResolvedNoticeTarget, ExternalPortError>` | formalchannel/target authority，originalimpact/current scope | callerstring不成为canonicalref，缺formalownerblocked；不发送 |
| `fn consumer_contract(&self) -> Result<OwnerConsumerContractRef, ExternalPortError>` | formal notice/channel consumer contract, never local qualification flag | missing actual exact contract blocked; no delivery/approval inference |

停审：NoticeChannelPort typed读取/保存、version与Tx来源已核对；不透传raw SQL/SDK/secret，不增加truth。外部positive资格仍按binding表blocked。


### ObservationPort

capability/对象能力：safeauditproducer/redaction/admission与原intent对账；定义application/ports，调用方application七用例模块，具体实现：infra/sdk/observation。

```rust
/// Provides ObservationPort as an application-owned typed boundary.
pub trait ObservationPort {
    /// Provides formal dispatch_observation data without copying upstream truth.
    async fn dispatch_observation(&self, input: ObservationDispatchInput) -> Result<ObservationFormalResult, ExternalPortError>;
    /// Provides formal probe_observation data without copying upstream truth.
    async fn probe_observation(&self, input: ObservationDispatchInput) -> Result<ObservationFormalResult, ExternalPortError>;
    /// Qualifies the safe producer, redaction and scope contract before observation permission is issued.
    async fn qualify_observation(&self, input: ObservationOutcomeContext, scope: SafeReadContext) -> Result<SafeBasisReferenceSet, ExternalPortError>;
}
```

| callable | 完整输入/返回来源 | missing/conflict/failure/副作用 |
|---|---|---|
| `async fn dispatch_observation(&self, input: ObservationDispatchInput) -> Result<ObservationFormalResult, ExternalPortError>` | formal ownerconsumer exact export+SDKoperation映射；当前资格受影响blocked | local audit!=Obsreceipt；no raw log/evidence/verdict |
| `async fn probe_observation(&self, input: ObservationDispatchInput) -> Result<ObservationFormalResult, ExternalPortError>` | formal ownerconsumer exact export+SDKoperation映射；当前资格受影响blocked | 原auditoperation intent，ACK不等admitted |
| `async fn qualify_observation(&self, input: ObservationOutcomeContext, scope: SafeReadContext) -> Result<SafeBasisReferenceSet, ExternalPortError>` | exact original operation/audit set/scope plus formally qualified producer/redaction contract; local audit fields are read locally before this call | nonempty formal bases; no audit body/evidence/signoff generation; missing owner/SDK operation blocked |

停审：ObservationPort typed读取/保存、version与Tx来源已核对；不透传raw SQL/SDK/secret，不增加truth。外部positive资格仍按binding表blocked。


## fake / durable parity与跨接缝审计

mutable get完整Versioned、saveExactCAS，append immutable同内容校验；write同Tx staging，rollback所有truth/context/result/audit/work/permission/plan不可见。operation unique key与fulloriginalresult同UoW；Unknown commit通过readonly keylookup和正式commitresolution，不能假成功/丢全结果。

fake使用相同publictypedtraits、同事务staging、相同unique/CAS/missing/cursor/rollback，不加privatequalificationmap、autoCreate或默认approved。dispatch SDKeffect必须permission已durable，DBtx关闭后call，结果用新UoW持久；Unknown只原intentprobe，不凭leaseexpiry再次派发。Query store读取不能reserve/append/refresh。无outbox/bus/Billing/Archive方法。
