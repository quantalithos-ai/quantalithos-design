# Step8 public surface与二级类型小循环


## 思考、诊断与取舍

能力：全请求上下文唯一、response安全姿态、完整receipt/report、web需要的状态读面。HLD view仅ref不足以展示实际状态，增加read-only model wrapper，不复制truth。采用typed ReadSurface/完整familyresult/逐itemreport；拒绝bool/id receipt、隐藏数量泄漏、client Qualified*Input与body分页重复。用户源码英文约束不随参考模板改变。

## Envelope与结果映射

CommandEnvelope/QueryEnvelope/JobEnvelope见Step6 runtime_helpers；actor/meta由可信boundary注入，HTTP业务JSON只对应Requestbody，meta不在body重复。Command结果HTTP只序列化ExecutionResult.value，OriginalReplayed仅安全响应header，不改变stored原payload。Query返回ReadSurface<T>，单对象为1item page，empty/notvisible/missing/degraded分别typedvariant。Job不是HTTP，返回ExecutionResult<族Report>。

### ApplicationProgressReadModel

```rust
/// Carries ApplicationProgressReadModel with explicit sources and no upstream body.
pub struct ApplicationProgressReadModel {
    /// Carries view; see the source and invariant table.
    pub view: ApplicationProgressView,
    /// Carries application_state; see the source and invariant table.
    pub application_state: PublicationApplicationState,
    /// Carries review_state; see the source and invariant table.
    pub review_state: Option<ReviewHandoffState>,
    /// Carries basis_ref; see the source and invariant table.
    pub basis_ref: OptionalPublicationBasisRef,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: OptionalSafeFailureRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| view | `ApplicationProgressView` | 逐字段loaded申请/review/basis与currentdisclosure组装；Draft reviewNone不假审批 |
| application_state | `PublicationApplicationState` | 逐字段loaded申请/review/basis与currentdisclosure组装；Draft reviewNone不假审批 |
| review_state | `Option<ReviewHandoffState>` | 逐字段loaded申请/review/basis与currentdisclosure组装；Draft reviewNone不假审批 |
| basis_ref | `OptionalPublicationBasisRef` | 逐字段loaded申请/review/basis与currentdisclosure组装；Draft reviewNone不假审批 |
| failure_ref | `OptionalSafeFailureRef` | 逐字段loaded申请/review/basis与currentdisclosure组装；Draft reviewNone不假审批 |

归属：contracts；逐字段loaded申请/review/basis与currentdisclosure组装；Draft reviewNone不假审批


### DistributionProgressReadModel

```rust
/// Carries DistributionProgressReadModel with explicit sources and no upstream body.
pub struct DistributionProgressReadModel {
    /// Carries view; see the source and invariant table.
    pub view: DistributionReadView,
    /// Carries intent_state; see the source and invariant table.
    pub intent_state: Option<DistributionIntentState>,
    /// Carries attempts; see the source and invariant table.
    pub attempts: Vec<DistributionAttemptSnapshot>,
    /// Carries eligible; see the source and invariant table.
    pub eligible: Option<bool>,
    /// Carries gate_basis_refs; see the source and invariant table.
    pub gate_basis_refs: SafeBasisReferenceSet,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: OptionalSafeFailureRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| view | `DistributionReadView` | eligibilityQuery当前formalgate，不建intent；progress来自typedlocalattempt；confirmed不等installed/paid |
| intent_state | `Option<DistributionIntentState>` | eligibilityQuery当前formalgate，不建intent；progress来自typedlocalattempt；confirmed不等installed/paid |
| attempts | `Vec<DistributionAttemptSnapshot>` | eligibilityQuery当前formalgate，不建intent；progress来自typedlocalattempt；confirmed不等installed/paid |
| eligible | `Option<bool>` | eligibilityQuery当前formalgate，不建intent；progress来自typedlocalattempt；confirmed不等installed/paid |
| gate_basis_refs | `SafeBasisReferenceSet` | eligibilityQuery当前formalgate，不建intent；progress来自typedlocalattempt；confirmed不等installed/paid |
| failure_ref | `OptionalSafeFailureRef` | eligibilityQuery当前formalgate，不建intent；progress来自typedlocalattempt；confirmed不等installed/paid |

归属：contracts；eligibilityQuery当前formalgate，不建intent；progress来自typedlocalattempt；confirmed不等installed/paid


### ImpactNoticeReadModel

```rust
/// Carries ImpactNoticeReadModel with explicit sources and no upstream body.
pub struct ImpactNoticeReadModel {
    /// Carries view; see the source and invariant table.
    pub view: ImpactNoticeView,
    /// Carries coverage_kind; see the source and invariant table.
    pub coverage_kind: ImpactCoverageKind,
    /// Carries coverage_cursor; see the source and invariant table.
    pub coverage_cursor: MarketSourceCursor,
    /// Carries unknown_attempt_refs; see the source and invariant table.
    pub unknown_attempt_refs: DistributionAttemptRefSet,
    /// Carries notices; see the source and invariant table.
    pub notices: Vec<NoticeReadItem>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| view | `ImpactNoticeView` | 仅knownscope，currentScope裁剪items/count，noticeConfirmed不是delivered |
| coverage_kind | `ImpactCoverageKind` | 仅knownscope，currentScope裁剪items/count，noticeConfirmed不是delivered |
| coverage_cursor | `MarketSourceCursor` | 仅knownscope，currentScope裁剪items/count，noticeConfirmed不是delivered |
| unknown_attempt_refs | `DistributionAttemptRefSet` | 仅knownscope，currentScope裁剪items/count，noticeConfirmed不是delivered |
| notices | `Vec<NoticeReadItem>` | 仅knownscope，currentScope裁剪items/count，noticeConfirmed不是delivered |

归属：contracts；仅knownscope，currentScope裁剪items/count，noticeConfirmed不是delivered


### NoticeReadItem

```rust
/// Carries NoticeReadItem with explicit sources and no upstream body.
pub struct NoticeReadItem {
    /// Carries notice_ref; see the source and invariant table.
    pub notice_ref: NoticeIntentRef,
    /// Carries state; see the source and invariant table.
    pub state: NoticeIntentState,
    /// Carries outcome_binding; see the source and invariant table.
    pub outcome_binding: OptionalNoticeOutcomeBinding,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: OptionalSafeFailureRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| notice_ref | `NoticeIntentRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `NoticeIntentState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| outcome_binding | `OptionalNoticeOutcomeBinding` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| failure_ref | `OptionalSafeFailureRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


### AuditRecoveryReadModel

```rust
/// Carries AuditRecoveryReadModel with explicit sources and no upstream body.
pub struct AuditRecoveryReadModel {
    /// Carries operation_ref; see the source and invariant table.
    pub operation_ref: Option<MarketOperationRef>,
    /// Carries audit_items; see the source and invariant table.
    pub audit_items: Vec<MarketAuditReadItem>,
    /// Carries recovery_ref; see the source and invariant table.
    pub recovery_ref: Option<RecoveryIntentRef>,
    /// Carries recovery_state; see the source and invariant table.
    pub recovery_state: Option<RecoveryIntentState>,
    /// Carries report; see the source and invariant table.
    pub report: Option<MarketJobReport>,
    /// Carries observation_binding; see the source and invariant table.
    pub observation_binding: OptionalObservationOutcomeBinding,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| operation_ref | `Option<MarketOperationRef>` | 可无operation的typedsubjectaudit；report原安全完整读取不runrecovery，不自证evidence/readiness |
| audit_items | `Vec<MarketAuditReadItem>` | 可无operation的typedsubjectaudit；report原安全完整读取不runrecovery，不自证evidence/readiness |
| recovery_ref | `Option<RecoveryIntentRef>` | 可无operation的typedsubjectaudit；report原安全完整读取不runrecovery，不自证evidence/readiness |
| recovery_state | `Option<RecoveryIntentState>` | 可无operation的typedsubjectaudit；report原安全完整读取不runrecovery，不自证evidence/readiness |
| report | `Option<MarketJobReport>` | 可无operation的typedsubjectaudit；report原安全完整读取不runrecovery，不自证evidence/readiness |
| observation_binding | `OptionalObservationOutcomeBinding` | 可无operation的typedsubjectaudit；report原安全完整读取不runrecovery，不自证evidence/readiness |

归属：contracts；可无operation的typedsubjectaudit；report原安全完整读取不runrecovery，不自证evidence/readiness


### MarketAuditReadItem

```rust
/// Carries MarketAuditReadItem with explicit sources and no upstream body.
pub struct MarketAuditReadItem {
    /// Carries audit_ref; see the source and invariant table.
    pub audit_ref: MarketAuditRef,
    /// Carries subject_ref; see the source and invariant table.
    pub subject_ref: MarketAuditSubjectRef,
    /// Carries operation_ref; see the source and invariant table.
    pub operation_ref: MarketOperationRef,
    /// Carries basis_refs; see the source and invariant table.
    pub basis_refs: SafeBasisReferenceSet,
    /// Carries cursor; see the source and invariant table.
    pub cursor: MarketSourceCursor,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| audit_ref | `MarketAuditRef` | 只safeaudit ref/basis，不暴露ContextRecord/rawactorprofile/tracebody |
| subject_ref | `MarketAuditSubjectRef` | 只safeaudit ref/basis，不暴露ContextRecord/rawactorprofile/tracebody |
| operation_ref | `MarketOperationRef` | 只safeaudit ref/basis，不暴露ContextRecord/rawactorprofile/tracebody |
| basis_refs | `SafeBasisReferenceSet` | 只safeaudit ref/basis，不暴露ContextRecord/rawactorprofile/tracebody |
| cursor | `MarketSourceCursor` | 只safeaudit ref/basis，不暴露ContextRecord/rawactorprofile/tracebody |

归属：contracts；只safeaudit ref/basis，不暴露ContextRecord/rawactorprofile/tracebody


### MarketVersionReadItem

```rust
/// Carries MarketVersionReadItem with explicit sources and no upstream body.
pub struct MarketVersionReadItem {
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries listing_ref; see the source and invariant table.
    pub listing_ref: MarketplaceListingRef,
    /// Carries source_binding; see the source and invariant table.
    pub source_binding: SourceBinding,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries state; see the source and invariant table.
    pub state: MarketVersionState,
    /// Carries decision_binding; see the source and invariant table.
    pub decision_binding: OptionalGovernanceDecisionBinding,
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: OptionalWithdrawalDispositionRef,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| version_ref | `MarketVersionRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| listing_ref | `MarketplaceListingRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| source_binding | `SourceBinding` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| application_ref | `PublicationApplicationRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `MarketVersionState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| decision_binding | `OptionalGovernanceDecisionBinding` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| disposition_ref | `OptionalWithdrawalDispositionRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| revision | `MarketRevision` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


### SelectedVersionView

```rust
/// Carries SelectedVersionView with explicit sources and no upstream body.
pub struct SelectedVersionView {
    /// Carries version; see the source and invariant table.
    pub version: MarketVersionReadItem,
    /// Carries eligible; see the source and invariant table.
    pub eligible: bool,
    /// Carries basis_refs; see the source and invariant table.
    pub basis_refs: SafeBasisReferenceSet,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: OptionalSafeFailureRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| version | `MarketVersionReadItem` | exactversion选择只read，formalcurrentgate有可见依据才eligibletrue，不隐式latest/intent |
| eligible | `bool` | exactversion选择只read，formalcurrentgate有可见依据才eligibletrue，不隐式latest/intent |
| basis_refs | `SafeBasisReferenceSet` | exactversion选择只read，formalcurrentgate有可见依据才eligibletrue，不隐式latest/intent |
| failure_ref | `OptionalSafeFailureRef` | exactversion选择只read，formalcurrentgate有可见依据才eligibletrue，不隐式latest/intent |

归属：contracts；exactversion选择只read，formalcurrentgate有可见依据才eligibletrue，不隐式latest/intent


### CategoryReadItem

```rust
/// Carries CategoryReadItem with explicit sources and no upstream body.
pub struct CategoryReadItem {
    /// Carries category_ref; see the source and invariant table.
    pub category_ref: CategoryRef,
    /// Carries label; see the source and invariant table.
    pub label: MarketCategoryLabel,
    /// Carries parent_ref; see the source and invariant table.
    pub parent_ref: OptionalCategoryRef,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| category_ref | `CategoryRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| label | `MarketCategoryLabel` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| parent_ref | `OptionalCategoryRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| revision | `MarketRevision` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


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


### CategoryMaintenanceCandidate

```rust
/// Represents the finite CategoryMaintenanceCandidate surface without owning upstream truth.
pub enum CategoryMaintenanceCandidate {
    /// Carries Create with CategoryCreationCandidate.
    Create(CategoryCreationCandidate),
    /// Carries Change with CategoryChangeCandidate.
    Change(CategoryChangeCandidate),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Create(CategoryCreationCandidate) | Carries Create. | selector显式variant，不由categoryref是否存在猜create |
| Change(CategoryChangeCandidate) | Carries Change. | selector显式variant，不由categoryref是否存在猜create |

归属：contracts；selector显式variant，不由categoryref是否存在猜create


### CategoryCreationCandidate

```rust
/// Carries CategoryCreationCandidate with explicit sources and no upstream body.
pub struct CategoryCreationCandidate {
    /// Carries label; see the source and invariant table.
    pub label: MarketCategoryLabel,
    /// Carries parent_ref; see the source and invariant table.
    pub parent_ref: OptionalCategoryRef,
    /// Carries requested_scope; see the source and invariant table.
    pub requested_scope: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| label | `MarketCategoryLabel` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| parent_ref | `OptionalCategoryRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| requested_scope | `MarketScopeRef` | caller候选scope，formalresolver/authority重新核；多个组织不猜默认 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


### CategoryChangeCandidate

```rust
/// Carries CategoryChangeCandidate with explicit sources and no upstream body.
pub struct CategoryChangeCandidate {
    /// Carries category_ref; see the source and invariant table.
    pub category_ref: CategoryRef,
    /// Carries expected_revision; see the source and invariant table.
    pub expected_revision: MarketRevision,
    /// Carries label; see the source and invariant table.
    pub label: MarketCategoryLabel,
    /// Carries parent_ref; see the source and invariant table.
    pub parent_ref: OptionalCategoryRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| category_ref | `CategoryRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| expected_revision | `MarketRevision` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| label | `MarketCategoryLabel` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| parent_ref | `OptionalCategoryRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


### NoticePlanCandidate

```rust
/// Carries NoticePlanCandidate with explicit sources and no upstream body.
pub struct NoticePlanCandidate {
    /// Carries target_candidate; see the source and invariant table.
    pub target_candidate: String,
    /// Carries channel_candidate; see the source and invariant table.
    pub channel_candidate: String,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| target_candidate | `String` | boundedopaque candidates，经formalchannel/authority解析，notclientqualified |
| channel_candidate | `String` | boundedopaque candidates，经formalchannel/authority解析，notclientqualified |

归属：contracts；boundedopaque candidates，经formalchannel/authority解析，notclientqualified


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


### ReviewJobReport

```rust
/// Provides the documented local ReviewJobReport carrier.
pub type ReviewJobReport = MarketJobReport;
```

归属：contracts；完整MarketJobReport所有字段必须保留，不能族特化时丢items/failure/basis/intent/cursor/audit/fence/work/state；no replay rescan


### DistributionJobReport

```rust
/// Provides the documented local DistributionJobReport carrier.
pub type DistributionJobReport = MarketJobReport;
```

归属：contracts；完整MarketJobReport所有字段必须保留，不能族特化时丢items/failure/basis/intent/cursor/audit/fence/work/state；no replay rescan


### ImpactEnumerationReport

```rust
/// Provides the documented local ImpactEnumerationReport carrier.
pub type ImpactEnumerationReport = MarketJobReport;
```

归属：contracts；完整MarketJobReport所有字段必须保留，不能族特化时丢items/failure/basis/intent/cursor/audit/fence/work/state；no replay rescan


### NoticeJobReport

```rust
/// Provides the documented local NoticeJobReport carrier.
pub type NoticeJobReport = MarketJobReport;
```

归属：contracts；完整MarketJobReport所有字段必须保留，不能族特化时丢items/failure/basis/intent/cursor/audit/fence/work/state；no replay rescan


### RecoveryJobReport

```rust
/// Provides the documented local RecoveryJobReport carrier.
pub type RecoveryJobReport = MarketJobReport;
```

归属：contracts；完整MarketJobReport所有字段必须保留，不能族特化时丢items/failure/basis/intent/cursor/audit/fence/work/state；no replay rescan


### ObservationJobReport

```rust
/// Provides the documented local ObservationJobReport carrier.
pub type ObservationJobReport = MarketJobReport;
```

归属：contracts；完整MarketJobReport所有字段必须保留，不能族特化时丢items/failure/basis/intent/cursor/audit/fence/work/state；no replay rescan


### ReferenceRefreshReport

```rust
/// Provides the documented local ReferenceRefreshReport carrier.
pub type ReferenceRefreshReport = MarketJobReport;
```

归属：contracts；完整MarketJobReport所有字段必须保留，不能族特化时丢items/failure/basis/intent/cursor/audit/fence/work/state；no replay rescan


### ProjectionRebuildReport

```rust
/// Provides the documented local ProjectionRebuildReport carrier.
pub type ProjectionRebuildReport = MarketJobReport;
```

归属：contracts；完整MarketJobReport所有字段必须保留，不能族特化时丢items/failure/basis/intent/cursor/audit/fence/work/state；no replay rescan


## Query read面闭环

ReadMarker(ReadSurfaceKind)只技术姿态；Ready与Empty需要正式当前scope/source完整。NotVisible不带objectref/count/cursor，Missing仅允许披露缺失时返回。Stale/Rebuilding/Unavailable/Unsupported/Failed/Disabled为Degraded，当前设计不返回旧数据冒充Ready。Next CorePageToken由infra绑定scope、canonicalfilter、stableorder、fixedupper、lasttypedkey签名，篡改/错scope/filter InvalidInput；不存在从opaqueownerref解读pagekey。

分页唯一QueryMetadata.page，list请求必须Some且limit有效；detail忽略page时若调用者提供分页字段reject，不能出现两套page authority。QueryConsistency::Strong优先typedlocal事实读取但仍不保证跨owner原子一致；Eventual可projection并明示marker，不能绕currentownervisibility。

## 错误与key/审计映射

| 有限分类 | HTTP/Job | truth/result影响 |
|---|---|---|
| InvalidInput/MissingIdempotencyKey/UnsafeMaterial | 400/422；Job Rejected | preaccept无业务写/audit/result |
| NotAuthorized/NotVisible | 403或安全NotVisible，存在不可披露统一 | 不返回hidden count/source/body |
| Missing | 404只已获存在披露；Query typedMissing | 不auto-create |
| BindingMismatch/IllegalTransition/CurrentGateDenied | 422 | rollback全部stagedwrites |
| VersionConflict/IdempotencyConflict/OperationInProgress/FenceMismatch | 409 | samekeydiffintent拒绝；originalsamepayload当前gate后重放 |
| ContractBlocked/Unavailable/IntegrityFailure | 503安全code，不回rawerrors | blockedpositive或完整性缺口，不伪success |
| ExternalCommitUnknown | acceptedJob report CommitUnknown / work Blocked或对账责任 | 不是Failed/notcommitted；originalintentprobe，不能盲retry |

Key exactCore IdempotencyKey UTF8，不trim/casefold；fingerprint包含operation selector+canonicalbusinessrequest+resolvedscope+Coreactor/delegation，不含requestid/trace/timestamp/locale；qualified当前precheck仅fresh。missingoriginalfullresult或错resultkind/schema拒绝，不当前projection重建。

## actor与事件边界

human publisher/consumer/operator需要formal auth/组织scope契约，当前MP-UP003不closed；IdentityAI不是登录与组织权威。system/integration Worker有CoreActorContext仍需exactscope/typedplan/ownergate，无trusted例外绕过。0activeevent，不生成topic/consumerreceipt/outbox/ACKapproval。Billing/paid/subscription/revenue/crossborder与Archiveexport/restore没有协议入口。

### InternalJobRequest

```rust
/// Represents the finite InternalJobRequest surface without owning upstream truth.
pub enum InternalJobRequest {
    /// Carries DispatchReviewHandoff with DispatchReviewHandoffRequest.
    DispatchReviewHandoff(DispatchReviewHandoffRequest),
    /// Carries ReconcileReviewHandoff with ReconcileReviewHandoffRequest.
    ReconcileReviewHandoff(ReconcileReviewHandoffRequest),
    /// Carries DispatchDistribution with DispatchDistributionRequest.
    DispatchDistribution(DispatchDistributionRequest),
    /// Carries ReconcileDistribution with ReconcileDistributionRequest.
    ReconcileDistribution(ReconcileDistributionRequest),
    /// Carries EnumerateKnownImpact with EnumerateKnownImpactRequest.
    EnumerateKnownImpact(EnumerateKnownImpactRequest),
    /// Carries DispatchNotice with DispatchNoticeRequest.
    DispatchNotice(DispatchNoticeRequest),
    /// Carries ReconcileNotice with ReconcileNoticeRequest.
    ReconcileNotice(ReconcileNoticeRequest),
    /// Carries RunMarketRecovery with RunMarketRecoveryRequest.
    RunMarketRecovery(RunMarketRecoveryRequest),
    /// Carries DispatchObservation with DispatchObservationRequest.
    DispatchObservation(DispatchObservationRequest),
    /// Carries ReconcileObservation with ReconcileObservationRequest.
    ReconcileObservation(ReconcileObservationRequest),
    /// Carries RefreshQualifiedReferences with RefreshQualifiedReferencesRequest.
    RefreshQualifiedReferences(RefreshQualifiedReferencesRequest),
    /// Carries RebuildMarketReadProjection with RebuildMarketReadProjectionRequest.
    RebuildMarketReadProjection(RebuildMarketReadProjectionRequest),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| DispatchReviewHandoff(DispatchReviewHandoffRequest) | Carries DispatchReviewHandoff. | 12typed body variant唯一原requestselector，checkpoint只保存已校验安全body，meta/context独立ref |
| ReconcileReviewHandoff(ReconcileReviewHandoffRequest) | Carries ReconcileReviewHandoff. | 12typed body variant唯一原requestselector，checkpoint只保存已校验安全body，meta/context独立ref |
| DispatchDistribution(DispatchDistributionRequest) | Carries DispatchDistribution. | 12typed body variant唯一原requestselector，checkpoint只保存已校验安全body，meta/context独立ref |
| ReconcileDistribution(ReconcileDistributionRequest) | Carries ReconcileDistribution. | 12typed body variant唯一原requestselector，checkpoint只保存已校验安全body，meta/context独立ref |
| EnumerateKnownImpact(EnumerateKnownImpactRequest) | Carries EnumerateKnownImpact. | 12typed body variant唯一原requestselector，checkpoint只保存已校验安全body，meta/context独立ref |
| DispatchNotice(DispatchNoticeRequest) | Carries DispatchNotice. | 12typed body variant唯一原requestselector，checkpoint只保存已校验安全body，meta/context独立ref |
| ReconcileNotice(ReconcileNoticeRequest) | Carries ReconcileNotice. | 12typed body variant唯一原requestselector，checkpoint只保存已校验安全body，meta/context独立ref |
| RunMarketRecovery(RunMarketRecoveryRequest) | Carries RunMarketRecovery. | 12typed body variant唯一原requestselector，checkpoint只保存已校验安全body，meta/context独立ref |
| DispatchObservation(DispatchObservationRequest) | Carries DispatchObservation. | 12typed body variant唯一原requestselector，checkpoint只保存已校验安全body，meta/context独立ref |
| ReconcileObservation(ReconcileObservationRequest) | Carries ReconcileObservation. | 12typed body variant唯一原requestselector，checkpoint只保存已校验安全body，meta/context独立ref |
| RefreshQualifiedReferences(RefreshQualifiedReferencesRequest) | Carries RefreshQualifiedReferences. | 12typed body variant唯一原requestselector，checkpoint只保存已校验安全body，meta/context独立ref |
| RebuildMarketReadProjection(RebuildMarketReadProjectionRequest) | Carries RebuildMarketReadProjection. | 12typed body variant唯一原requestselector，checkpoint只保存已校验安全body，meta/context独立ref |

归属：contracts；12typed body variant唯一原requestselector，checkpoint只保存已校验安全body，meta/context独立ref

### ProjectionOmission

```rust
/// Represents the finite ProjectionOmission surface without owning upstream truth.
pub enum ProjectionOmission {
    /// NotCurrentlyVisible is a local classification.
    NotCurrentlyVisible,
    /// NotCurrentlyListed is a local classification.
    NotCurrentlyListed,
    /// SourceUnavailable is a local classification.
    SourceUnavailable,
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| NotCurrentlyVisible | NotCurrentlyVisible is a local classification. | 内部构建manifest reason，不对外曝光隐藏subject/count；complete是明确逐keyRender/Omit而非空fakebody |
| NotCurrentlyListed | NotCurrentlyListed is a local classification. | 内部构建manifest reason，不对外曝光隐藏subject/count；complete是明确逐keyRender/Omit而非空fakebody |
| SourceUnavailable | SourceUnavailable is a local classification. | 内部构建manifest reason，不对外曝光隐藏subject/count；complete是明确逐keyRender/Omit而非空fakebody |

归属：contracts；内部构建manifest reason，不对外曝光隐藏subject/count；complete是明确逐keyRender/Omit而非空fakebody

### ProjectionItemOutcome

```rust
/// Represents the finite ProjectionItemOutcome surface without owning upstream truth.
pub enum ProjectionItemOutcome {
    /// Carries Rendered with ProjectionSafeView.
    Rendered(ProjectionSafeView),
    /// Carries Omitted with ProjectionOmission.
    Omitted(ProjectionOmission),
}
```

| 变体 | Rustdoc语义 | 来源 / 去向 |
|---|---|---|
| Rendered(ProjectionSafeView) | Carries Rendered. | 有限分类，不自动授权。 |
| Omitted(ProjectionOmission) | Carries Omitted. | 有限分类，不自动授权。 |

归属：contracts；有限分类，不自动授权。

### ProjectionBuildItem

```rust
/// Carries ProjectionBuildItem with explicit sources and no upstream body.
pub struct ProjectionBuildItem {
    /// Carries view_key; see the source and invariant table.
    pub view_key: MarketReadViewKey,
    /// Carries outcome; see the source and invariant table.
    pub outcome: ProjectionItemOutcome,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| view_key | `MarketReadViewKey` | 每个非空plan viewkey恰一项，同kind/scope；safevisibleitems才public；omit保留内部manifest不泄漏count |
| outcome | `ProjectionItemOutcome` | 每个非空plan viewkey恰一项，同kind/scope；safevisibleitems才public；omit保留内部manifest不泄漏count |

归属：contracts；每个非空plan viewkey恰一项，同kind/scope；safevisibleitems才public；omit保留内部manifest不泄漏count

## 49 facade callable英文Rustdoc声明

完整参数/响应/错误与来源以上逐协议正文为authority；这些是planned方法声明，不是实现代码。全部在MarketplaceApplication<P: MarketPorts> facade上，API/Worker只调用对应入口；没有第50个协议、runtime event或HTTP Job。

### MarketplaceApplication.bind_publisher_relation

```rust
/// Executes BindPublisherRelation with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn bind_publisher_relation(&self, request: CommandEnvelope<BindPublisherRelationRequest>) -> Result<ExecutionResult<PublisherRelationResult>, MarketError>;
```

### MarketplaceApplication.release_publisher_relation

```rust
/// Executes ReleasePublisherRelation with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn release_publisher_relation(&self, request: CommandEnvelope<ReleasePublisherRelationRequest>) -> Result<ExecutionResult<PublisherRelationResult>, MarketError>;
```

### MarketplaceApplication.verify_publication_source

```rust
/// Executes VerifyPublicationSource with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn verify_publication_source(&self, request: CommandEnvelope<VerifyPublicationSourceRequest>) -> Result<ExecutionResult<SourceQualificationResult>, MarketError>;
```

### MarketplaceApplication.get_source_qualification

```rust
/// Executes GetSourceQualification with its complete typed request and safe result.
/// Preserves current disclosure and the documented read-only boundary.
pub async fn get_source_qualification(&self, request: QueryEnvelope<GetSourceQualificationRequest>) -> Result<ReadSurface<SourceQualificationReadModel>, MarketError>;
```

### MarketplaceApplication.create_publication_draft

```rust
/// Executes CreatePublicationDraft with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn create_publication_draft(&self, request: CommandEnvelope<CreatePublicationDraftRequest>) -> Result<ExecutionResult<PublicationApplicationResult>, MarketError>;
```

### MarketplaceApplication.revise_publication_draft

```rust
/// Executes RevisePublicationDraft with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn revise_publication_draft(&self, request: CommandEnvelope<RevisePublicationDraftRequest>) -> Result<ExecutionResult<PublicationApplicationResult>, MarketError>;
```

### MarketplaceApplication.submit_publication_application

```rust
/// Executes SubmitPublicationApplication with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn submit_publication_application(&self, request: CommandEnvelope<SubmitPublicationApplicationRequest>) -> Result<ExecutionResult<PublicationApplicationResult>, MarketError>;
```

### MarketplaceApplication.terminate_publication_application

```rust
/// Executes TerminatePublicationApplication with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn terminate_publication_application(&self, request: CommandEnvelope<TerminatePublicationApplicationRequest>) -> Result<ExecutionResult<PublicationApplicationResult>, MarketError>;
```

### MarketplaceApplication.record_governance_decision

```rust
/// Executes RecordGovernanceDecision with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn record_governance_decision(&self, request: CommandEnvelope<RecordGovernanceDecisionRequest>) -> Result<ExecutionResult<ReviewProgressResult>, MarketError>;
```

### MarketplaceApplication.get_publication_progress

```rust
/// Executes GetPublicationProgress with its complete typed request and safe result.
/// Preserves current disclosure and the documented read-only boundary.
pub async fn get_publication_progress(&self, request: QueryEnvelope<GetPublicationProgressRequest>) -> Result<ReadSurface<ApplicationProgressReadModel>, MarketError>;
```

### MarketplaceApplication.dispatch_review_handoff

```rust
/// Executes DispatchReviewHandoff with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn dispatch_review_handoff(&self, request: JobEnvelope<DispatchReviewHandoffRequest>) -> Result<ExecutionResult<ReviewJobReport>, MarketError>;
```

### MarketplaceApplication.reconcile_review_handoff

```rust
/// Executes ReconcileReviewHandoff with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn reconcile_review_handoff(&self, request: JobEnvelope<ReconcileReviewHandoffRequest>) -> Result<ExecutionResult<ReviewJobReport>, MarketError>;
```

### MarketplaceApplication.create_marketplace_listing

```rust
/// Executes CreateMarketplaceListing with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn create_marketplace_listing(&self, request: CommandEnvelope<CreateMarketplaceListingRequest>) -> Result<ExecutionResult<MarketplaceListingResult>, MarketError>;
```

### MarketplaceApplication.edit_marketplace_listing

```rust
/// Executes EditMarketplaceListing with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn edit_marketplace_listing(&self, request: CommandEnvelope<EditMarketplaceListingRequest>) -> Result<ExecutionResult<MarketplaceListingResult>, MarketError>;
```

### MarketplaceApplication.maintain_market_category

```rust
/// Executes MaintainMarketCategory with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn maintain_market_category(&self, request: CommandEnvelope<MaintainMarketCategoryRequest>) -> Result<ExecutionResult<CategoryResult>, MarketError>;
```

### MarketplaceApplication.register_market_version

```rust
/// Executes RegisterMarketVersion with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn register_market_version(&self, request: CommandEnvelope<RegisterMarketVersionRequest>) -> Result<ExecutionResult<MarketVersionResult>, MarketError>;
```

### MarketplaceApplication.list_market_version

```rust
/// Executes ListMarketVersion with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn list_market_version(&self, request: CommandEnvelope<ListMarketVersionRequest>) -> Result<ExecutionResult<MarketVersionResult>, MarketError>;
```

### MarketplaceApplication.search_marketplace_catalog

```rust
/// Executes SearchMarketplaceCatalog with its complete typed request and safe result.
/// Preserves current disclosure and the documented read-only boundary.
pub async fn search_marketplace_catalog(&self, request: QueryEnvelope<SearchMarketplaceCatalogRequest>) -> Result<ReadSurface<CatalogReadView>, MarketError>;
```

### MarketplaceApplication.get_marketplace_listing

```rust
/// Executes GetMarketplaceListing with its complete typed request and safe result.
/// Preserves current disclosure and the documented read-only boundary.
pub async fn get_marketplace_listing(&self, request: QueryEnvelope<GetMarketplaceListingRequest>) -> Result<ReadSurface<CatalogReadView>, MarketError>;
```

### MarketplaceApplication.list_market_versions

```rust
/// Executes ListMarketVersions with its complete typed request and safe result.
/// Preserves current disclosure and the documented read-only boundary.
pub async fn list_market_versions(&self, request: QueryEnvelope<ListMarketVersionsRequest>) -> Result<ReadSurface<MarketVersionReadItem>, MarketError>;
```

### MarketplaceApplication.select_market_version

```rust
/// Executes SelectMarketVersion with its complete typed request and safe result.
/// Preserves current disclosure and the documented read-only boundary.
pub async fn select_market_version(&self, request: QueryEnvelope<SelectMarketVersionRequest>) -> Result<ReadSurface<SelectedVersionView>, MarketError>;
```

### MarketplaceApplication.list_market_categories

```rust
/// Executes ListMarketCategories with its complete typed request and safe result.
/// Preserves current disclosure and the documented read-only boundary.
pub async fn list_market_categories(&self, request: QueryEnvelope<ListMarketCategoriesRequest>) -> Result<ReadSurface<CategoryReadItem>, MarketError>;
```

### MarketplaceApplication.request_distribution

```rust
/// Executes RequestDistribution with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn request_distribution(&self, request: CommandEnvelope<RequestDistributionRequest>) -> Result<ExecutionResult<DistributionResult>, MarketError>;
```

### MarketplaceApplication.cancel_distribution

```rust
/// Executes CancelDistribution with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn cancel_distribution(&self, request: CommandEnvelope<CancelDistributionRequest>) -> Result<ExecutionResult<DistributionResult>, MarketError>;
```

### MarketplaceApplication.record_receiver_outcome

```rust
/// Executes RecordReceiverOutcome with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn record_receiver_outcome(&self, request: CommandEnvelope<RecordReceiverOutcomeRequest>) -> Result<ExecutionResult<DistributionResult>, MarketError>;
```

### MarketplaceApplication.get_acquisition_eligibility

```rust
/// Executes GetAcquisitionEligibility with its complete typed request and safe result.
/// Preserves current disclosure and the documented read-only boundary.
pub async fn get_acquisition_eligibility(&self, request: QueryEnvelope<GetAcquisitionEligibilityRequest>) -> Result<ReadSurface<DistributionProgressReadModel>, MarketError>;
```

### MarketplaceApplication.get_distribution_progress

```rust
/// Executes GetDistributionProgress with its complete typed request and safe result.
/// Preserves current disclosure and the documented read-only boundary.
pub async fn get_distribution_progress(&self, request: QueryEnvelope<GetDistributionProgressRequest>) -> Result<ReadSurface<DistributionProgressReadModel>, MarketError>;
```

### MarketplaceApplication.dispatch_distribution

```rust
/// Executes DispatchDistribution with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn dispatch_distribution(&self, request: JobEnvelope<DispatchDistributionRequest>) -> Result<ExecutionResult<DistributionJobReport>, MarketError>;
```

### MarketplaceApplication.reconcile_distribution

```rust
/// Executes ReconcileDistribution with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn reconcile_distribution(&self, request: JobEnvelope<ReconcileDistributionRequest>) -> Result<ExecutionResult<DistributionJobReport>, MarketError>;
```

### MarketplaceApplication.restrict_market_version

```rust
/// Executes RestrictMarketVersion with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn restrict_market_version(&self, request: CommandEnvelope<RestrictMarketVersionRequest>) -> Result<ExecutionResult<WithdrawalResult>, MarketError>;
```

### MarketplaceApplication.withdraw_market_version

```rust
/// Executes WithdrawMarketVersion with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn withdraw_market_version(&self, request: CommandEnvelope<WithdrawMarketVersionRequest>) -> Result<ExecutionResult<WithdrawalResult>, MarketError>;
```

### MarketplaceApplication.plan_impact_notifications

```rust
/// Executes PlanImpactNotifications with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn plan_impact_notifications(&self, request: CommandEnvelope<PlanImpactNotificationsRequest>) -> Result<ExecutionResult<NoticePlanResult>, MarketError>;
```

### MarketplaceApplication.record_notice_outcome

```rust
/// Executes RecordNoticeOutcome with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn record_notice_outcome(&self, request: CommandEnvelope<RecordNoticeOutcomeRequest>) -> Result<ExecutionResult<NoticeResult>, MarketError>;
```

### MarketplaceApplication.get_withdrawal_impact

```rust
/// Executes GetWithdrawalImpact with its complete typed request and safe result.
/// Preserves current disclosure and the documented read-only boundary.
pub async fn get_withdrawal_impact(&self, request: QueryEnvelope<GetWithdrawalImpactRequest>) -> Result<ReadSurface<ImpactNoticeReadModel>, MarketError>;
```

### MarketplaceApplication.get_notice_progress

```rust
/// Executes GetNoticeProgress with its complete typed request and safe result.
/// Preserves current disclosure and the documented read-only boundary.
pub async fn get_notice_progress(&self, request: QueryEnvelope<GetNoticeProgressRequest>) -> Result<ReadSurface<ImpactNoticeReadModel>, MarketError>;
```

### MarketplaceApplication.enumerate_known_impact

```rust
/// Executes EnumerateKnownImpact with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn enumerate_known_impact(&self, request: JobEnvelope<EnumerateKnownImpactRequest>) -> Result<ExecutionResult<ImpactEnumerationReport>, MarketError>;
```

### MarketplaceApplication.dispatch_notice

```rust
/// Executes DispatchNotice with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn dispatch_notice(&self, request: JobEnvelope<DispatchNoticeRequest>) -> Result<ExecutionResult<NoticeJobReport>, MarketError>;
```

### MarketplaceApplication.reconcile_notice

```rust
/// Executes ReconcileNotice with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn reconcile_notice(&self, request: JobEnvelope<ReconcileNoticeRequest>) -> Result<ExecutionResult<NoticeJobReport>, MarketError>;
```

### MarketplaceApplication.request_market_recovery

```rust
/// Executes RequestMarketRecovery with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn request_market_recovery(&self, request: CommandEnvelope<RequestMarketRecoveryRequest>) -> Result<ExecutionResult<RecoveryResult>, MarketError>;
```

### MarketplaceApplication.get_market_audit

```rust
/// Executes GetMarketAudit with its complete typed request and safe result.
/// Preserves current disclosure and the documented read-only boundary.
pub async fn get_market_audit(&self, request: QueryEnvelope<GetMarketAuditRequest>) -> Result<ReadSurface<AuditRecoveryReadModel>, MarketError>;
```

### MarketplaceApplication.get_recovery_progress

```rust
/// Executes GetRecoveryProgress with its complete typed request and safe result.
/// Preserves current disclosure and the documented read-only boundary.
pub async fn get_recovery_progress(&self, request: QueryEnvelope<GetRecoveryProgressRequest>) -> Result<ReadSurface<AuditRecoveryReadModel>, MarketError>;
```

### MarketplaceApplication.get_operation_result

```rust
/// Executes GetOperationResult with its complete typed request and safe result.
/// Preserves current disclosure and the documented read-only boundary.
pub async fn get_operation_result(&self, request: QueryEnvelope<GetOperationResultRequest>) -> Result<ReadSurface<StoredOperationResult>, MarketError>;
```

### MarketplaceApplication.run_market_recovery

```rust
/// Executes RunMarketRecovery with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn run_market_recovery(&self, request: JobEnvelope<RunMarketRecoveryRequest>) -> Result<ExecutionResult<RecoveryJobReport>, MarketError>;
```

### MarketplaceApplication.dispatch_observation

```rust
/// Executes DispatchObservation with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn dispatch_observation(&self, request: JobEnvelope<DispatchObservationRequest>) -> Result<ExecutionResult<ObservationJobReport>, MarketError>;
```

### MarketplaceApplication.reconcile_observation

```rust
/// Executes ReconcileObservation with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn reconcile_observation(&self, request: JobEnvelope<ReconcileObservationRequest>) -> Result<ExecutionResult<ObservationJobReport>, MarketError>;
```

### MarketplaceApplication.get_reference_freshness

```rust
/// Executes GetReferenceFreshness with its complete typed request and safe result.
/// Preserves current disclosure and the documented read-only boundary.
pub async fn get_reference_freshness(&self, request: QueryEnvelope<GetReferenceFreshnessRequest>) -> Result<ReadSurface<ReferenceFreshnessView>, MarketError>;
```

### MarketplaceApplication.get_projection_freshness

```rust
/// Executes GetProjectionFreshness with its complete typed request and safe result.
/// Preserves current disclosure and the documented read-only boundary.
pub async fn get_projection_freshness(&self, request: QueryEnvelope<GetProjectionFreshnessRequest>) -> Result<ReadSurface<ProjectionFreshnessView>, MarketError>;
```

### MarketplaceApplication.refresh_qualified_references

```rust
/// Executes RefreshQualifiedReferences with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn refresh_qualified_references(&self, request: JobEnvelope<RefreshQualifiedReferencesRequest>) -> Result<ExecutionResult<ReferenceRefreshReport>, MarketError>;
```

### MarketplaceApplication.rebuild_market_read_projection

```rust
/// Executes RebuildMarketReadProjection with its complete typed request and safe result.
/// Preserves current disclosure and the documented original-intent replay and transaction boundary.
pub async fn rebuild_market_read_projection(&self, request: JobEnvelope<RebuildMarketReadProjectionRequest>) -> Result<ExecutionResult<ProjectionRebuildReport>, MarketError>;
```
