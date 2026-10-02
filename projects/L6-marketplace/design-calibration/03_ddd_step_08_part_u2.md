# Step8 U2 申请/正式审核交接协议族小循环

## 思考、诊断与取舍

本族只处理申请/正式审核交接，Requestbody均是候选/localintent而不是qualificationtruth。采用独立DTO与safe result/readmodel，ownerfields由Step7formalports核验；拒绝使用callerprovided Approved/Verified/Installed/Delivered。前序对象state不以UI语言改变，unsafe unknownfields拒绝。sharedsurface只统一Envelope/错误/分页，不替代本族逐协议schema。

## 定义批次表

| 协议 | 类别 | 对象 / view | port/构造 | flow |
|---|---|---|---|---|
| CreatePublicationDraft | Command | PublicationApplication / PublicationApplicationResult | PublicationApplication.draft / current publisher edit authority | Step9 create_publication_draft |
| RevisePublicationDraft | Command | PublicationApplication / PublicationApplicationResult | PublicationApplication.revise / Draft guard | Step9 revise_publication_draft |
| SubmitPublicationApplication | Command | PublicationApplication / PublicationApplicationResult | PublicationBasis.freeze + PublicationApplication.submit + ReviewHandoff.prepare / source currentqualified | Step9 submit_publication_application |
| TerminatePublicationApplication | Command | PublicationApplication / PublicationApplicationResult | PublicationApplication.terminate / formal terminateauthority | Step9 terminate_publication_application |
| RecordGovernanceDecision | Command | ReviewHandoff / ReviewProgressResult | GovernanceDecisionBinding.from_governance + ReviewHandoff.record_decision / GovernancePort.read_decision | Step9 record_governance_decision |
| GetPublicationProgress | Query | PublicationApplication / ApplicationProgressReadModel | MarketStore app/basis/review typedreads + safeview | Step9 get_publication_progress |
| DispatchReviewHandoff | Job | ReviewHandoff / ReviewJobReport | ReviewHandoff.record_dispatch / formal Gov dispatch afterpermission | Step9 dispatch_review_handoff |
| ReconcileReviewHandoff | Job | ReviewHandoff / ReviewJobReport | Gov originalintentprobe + formal decision/currentbinding | Step9 reconcile_review_handoff |

### CreatePublicationDraft

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn create_publication_draft(&self, request: CommandEnvelope<CreatePublicationDraftRequest>) -> Result<ExecutionResult<PublicationApplicationResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/create-publication-draft |
| 处理方 | MarketplaceApplication<P> / publication_review / planned create_publication_draft.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | PublicationApplication.draft / current publisher edit authority |

#### 请求schema与构造来源

### CreatePublicationDraftRequest

```rust
/// Carries CreatePublicationDraftRequest with explicit sources and no upstream body.
pub struct CreatePublicationDraftRequest {
    /// Carries draft_spec; see the source and invariant table.
    pub draft_spec: DraftPublicationSpec,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| draft_spec | `DraftPublicationSpec` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | PublicationApplication.draft / current publisher edit authority；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<PublicationApplicationResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### PublicationApplicationResult

```rust
/// Carries PublicationApplicationResult with explicit sources and no upstream body.
pub struct PublicationApplicationResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries state; see the source and invariant table.
    pub state: PublicationApplicationState,
    /// Carries draft_spec; see the source and invariant table.
    pub draft_spec: DraftPublicationSpec,
    /// Carries basis_ref; see the source and invariant table.
    pub basis_ref: OptionalPublicationBasisRef,
    /// Carries review_ref; see the source and invariant table.
    pub review_ref: OptionalReviewHandoffRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| application_ref | `PublicationApplicationRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `PublicationApplicationState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| draft_spec | `DraftPublicationSpec` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| basis_ref | `OptionalPublicationBasisRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| review_ref | `OptionalReviewHandoffRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### RevisePublicationDraft

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn revise_publication_draft(&self, request: CommandEnvelope<RevisePublicationDraftRequest>) -> Result<ExecutionResult<PublicationApplicationResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/revise-publication-draft |
| 处理方 | MarketplaceApplication<P> / publication_review / planned revise_publication_draft.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | PublicationApplication.revise / Draft guard |

#### 请求schema与构造来源

### RevisePublicationDraftRequest

```rust
/// Carries RevisePublicationDraftRequest with explicit sources and no upstream body.
pub struct RevisePublicationDraftRequest {
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries expected_revision; see the source and invariant table.
    pub expected_revision: MarketRevision,
    /// Carries draft_spec; see the source and invariant table.
    pub draft_spec: DraftPublicationSpec,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| application_ref | `PublicationApplicationRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| expected_revision | `MarketRevision` | 客户端读面revision；fresh读取相等检查且repoCAS；replay先于业务revision重核 |
| draft_spec | `DraftPublicationSpec` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | PublicationApplication.revise / Draft guard；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<PublicationApplicationResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### PublicationApplicationResult

```rust
/// Carries PublicationApplicationResult with explicit sources and no upstream body.
pub struct PublicationApplicationResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries state; see the source and invariant table.
    pub state: PublicationApplicationState,
    /// Carries draft_spec; see the source and invariant table.
    pub draft_spec: DraftPublicationSpec,
    /// Carries basis_ref; see the source and invariant table.
    pub basis_ref: OptionalPublicationBasisRef,
    /// Carries review_ref; see the source and invariant table.
    pub review_ref: OptionalReviewHandoffRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| application_ref | `PublicationApplicationRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `PublicationApplicationState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| draft_spec | `DraftPublicationSpec` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| basis_ref | `OptionalPublicationBasisRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| review_ref | `OptionalReviewHandoffRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### SubmitPublicationApplication

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn submit_publication_application(&self, request: CommandEnvelope<SubmitPublicationApplicationRequest>) -> Result<ExecutionResult<PublicationApplicationResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/submit-publication-application |
| 处理方 | MarketplaceApplication<P> / publication_review / planned submit_publication_application.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | PublicationBasis.freeze + PublicationApplication.submit + ReviewHandoff.prepare / source currentqualified |

#### 请求schema与构造来源

### SubmitPublicationApplicationRequest

```rust
/// Carries SubmitPublicationApplicationRequest with explicit sources and no upstream body.
pub struct SubmitPublicationApplicationRequest {
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries expected_revision; see the source and invariant table.
    pub expected_revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| application_ref | `PublicationApplicationRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| expected_revision | `MarketRevision` | 客户端读面revision；fresh读取相等检查且repoCAS；replay先于业务revision重核 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | PublicationBasis.freeze + PublicationApplication.submit + ReviewHandoff.prepare / source currentqualified；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<PublicationApplicationResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### PublicationApplicationResult

```rust
/// Carries PublicationApplicationResult with explicit sources and no upstream body.
pub struct PublicationApplicationResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries state; see the source and invariant table.
    pub state: PublicationApplicationState,
    /// Carries draft_spec; see the source and invariant table.
    pub draft_spec: DraftPublicationSpec,
    /// Carries basis_ref; see the source and invariant table.
    pub basis_ref: OptionalPublicationBasisRef,
    /// Carries review_ref; see the source and invariant table.
    pub review_ref: OptionalReviewHandoffRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| application_ref | `PublicationApplicationRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `PublicationApplicationState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| draft_spec | `DraftPublicationSpec` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| basis_ref | `OptionalPublicationBasisRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| review_ref | `OptionalReviewHandoffRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### TerminatePublicationApplication

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn terminate_publication_application(&self, request: CommandEnvelope<TerminatePublicationApplicationRequest>) -> Result<ExecutionResult<PublicationApplicationResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/terminate-publication-application |
| 处理方 | MarketplaceApplication<P> / publication_review / planned terminate_publication_application.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | PublicationApplication.terminate / formal terminateauthority |

#### 请求schema与构造来源

### TerminatePublicationApplicationRequest

```rust
/// Carries TerminatePublicationApplicationRequest with explicit sources and no upstream body.
pub struct TerminatePublicationApplicationRequest {
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries expected_revision; see the source and invariant table.
    pub expected_revision: MarketRevision,
    /// Carries reason_ref; see the source and invariant table.
    pub reason_ref: SafeReasonRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| application_ref | `PublicationApplicationRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| expected_revision | `MarketRevision` | 客户端读面revision；fresh读取相等检查且repoCAS；replay先于业务revision重核 |
| reason_ref | `SafeReasonRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | PublicationApplication.terminate / formal terminateauthority；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<PublicationApplicationResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### PublicationApplicationResult

```rust
/// Carries PublicationApplicationResult with explicit sources and no upstream body.
pub struct PublicationApplicationResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
    /// Carries state; see the source and invariant table.
    pub state: PublicationApplicationState,
    /// Carries draft_spec; see the source and invariant table.
    pub draft_spec: DraftPublicationSpec,
    /// Carries basis_ref; see the source and invariant table.
    pub basis_ref: OptionalPublicationBasisRef,
    /// Carries review_ref; see the source and invariant table.
    pub review_ref: OptionalReviewHandoffRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| application_ref | `PublicationApplicationRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `PublicationApplicationState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| draft_spec | `DraftPublicationSpec` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| basis_ref | `OptionalPublicationBasisRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| review_ref | `OptionalReviewHandoffRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### RecordGovernanceDecision

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn record_governance_decision(&self, request: CommandEnvelope<RecordGovernanceDecisionRequest>) -> Result<ExecutionResult<ReviewProgressResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/record-governance-decision |
| 处理方 | MarketplaceApplication<P> / publication_review / planned record_governance_decision.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | GovernanceDecisionBinding.from_governance + ReviewHandoff.record_decision / GovernancePort.read_decision |

#### 请求schema与构造来源

### RecordGovernanceDecisionRequest

```rust
/// Carries RecordGovernanceDecisionRequest with explicit sources and no upstream body.
pub struct RecordGovernanceDecisionRequest {
    /// Carries handoff_ref; see the source and invariant table.
    pub handoff_ref: ReviewHandoffRef,
    /// Carries decision_candidate; see the source and invariant table.
    pub decision_candidate: GovernanceDecisionRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| handoff_ref | `ReviewHandoffRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| decision_candidate | `GovernanceDecisionRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | GovernanceDecisionBinding.from_governance + ReviewHandoff.record_decision / GovernancePort.read_decision；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<ReviewProgressResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### ReviewProgressResult

```rust
/// Carries ReviewProgressResult with explicit sources and no upstream body.
pub struct ReviewProgressResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries handoff_ref; see the source and invariant table.
    pub handoff_ref: ReviewHandoffRef,
    /// Carries state; see the source and invariant table.
    pub state: ReviewHandoffState,
    /// Carries decision_binding; see the source and invariant table.
    pub decision_binding: OptionalGovernanceDecisionBinding,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: OptionalSafeFailureRef,
    /// Carries dispatch_outcome_ref; see the source and invariant table.
    pub dispatch_outcome_ref: OptionalReviewDispatchOutcomeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| handoff_ref | `ReviewHandoffRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `ReviewHandoffState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| decision_binding | `OptionalGovernanceDecisionBinding` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| failure_ref | `OptionalSafeFailureRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| dispatch_outcome_ref | `OptionalReviewDispatchOutcomeRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### GetPublicationProgress

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn get_publication_progress(&self, request: QueryEnvelope<GetPublicationProgressRequest>) -> Result<ReadSurface<ApplicationProgressReadModel>, MarketError>` |
| transport | POST /api/marketplace/v1/queries/get-publication-progress |
| 处理方 | MarketplaceApplication<P> / publication_review / planned get_publication_progress.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | MarketStore app/basis/review typedreads + safeview |

#### 请求schema与构造来源

### GetPublicationProgressRequest

```rust
/// Carries GetPublicationProgressRequest with explicit sources and no upstream body.
pub struct GetPublicationProgressRequest {
    /// Carries application_ref; see the source and invariant table.
    pub application_ref: PublicationApplicationRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| application_ref | `PublicationApplicationRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | MarketStore app/basis/review typedreads + safeview；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | currentScope + CoreQueryMetadata.page/consistency唯一；不写ContextRecord | 读取失败typedDegraded；不reserve |

#### 完整输出schema

返回ReadSurface<ApplicationProgressReadModel>，Ready QualifiedPage.items为本类型的typedreadmodel；Empty/NotVisible/Missing/Degraded独立安全分支，无requiredID假填。

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


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。typedentity→readmodel每同名字段逐字段copy，status由currentReadSurface而不是owner approval；scope/page/token不重复。

#### 失败、幂等与审计

no-write：所有save/append/reserve/refresh/rebuild/dispatch/ID/Clock为零；当前scope先于typed读，数量/提示/详情/分页同一visibility交集。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### DispatchReviewHandoff

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn dispatch_review_handoff(&self, request: JobEnvelope<DispatchReviewHandoffRequest>) -> Result<ExecutionResult<ReviewJobReport>, MarketError>` |
| transport | worker-internal dispatch_review_handoff |
| 处理方 | MarketplaceApplication<P> / publication_review / planned dispatch_review_handoff.rs |
| caller | trustedworker system/operator，非Web/公开HTTP |
| 目标能力 | ReviewHandoff.record_dispatch / formal Gov dispatch afterpermission |

#### 请求schema与构造来源

### DispatchReviewHandoffRequest

```rust
/// Carries DispatchReviewHandoffRequest with explicit sources and no upstream body.
pub struct DispatchReviewHandoffRequest {
    /// Carries handoff_ref; see the source and invariant table.
    pub handoff_ref: ReviewHandoffRef,
    /// Carries work_ref; see the source and invariant table.
    pub work_ref: DeferredWorkRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| handoff_ref | `ReviewHandoffRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| work_ref | `DeferredWorkRef` | durableworkbody与context.fence.work_ref一致；不会来自URL/任意cron字符串 |

归属：contracts；internal only冻结plan/selector/target一致；batch非空有上限，缺planblocked

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | ReviewHandoff.record_dispatch / formal Gov dispatch afterpermission；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| context.request + fence | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |
| 冻结work/plan | load_work + load_plan；bodytarget/work_ref=context.fence.work_ref，维护plan/currentcursor必须原冻结值；reconcile允许原dispatchplan同target但不改原effectintent | mismatch/planmissing blocked，no private map/rescan |

#### 完整输出schema

返回ExecutionResult<ReviewJobReport>；本族Report是完整MarketJobReport别名，逐itemtarget/outcome/failure/bases/intent/cursor和work/fence/audit/spawnedwork均保留。

### ReviewJobReport

```rust
/// Provides the documented local ReviewJobReport carrier.
pub type ReviewJobReport = MarketJobReport;
```

归属：contracts；完整字段schema见Step6 shared_types MarketJobReport与Step8 sharedsurface，不能删逐项结果


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 每次boundedbatch完整report accepted保存同state/audit/spawnedworkUoW；unknown外effect保留原intent和probe责任，不把Reported当ready。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### ReconcileReviewHandoff

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn reconcile_review_handoff(&self, request: JobEnvelope<ReconcileReviewHandoffRequest>) -> Result<ExecutionResult<ReviewJobReport>, MarketError>` |
| transport | worker-internal reconcile_review_handoff |
| 处理方 | MarketplaceApplication<P> / publication_review / planned reconcile_review_handoff.rs |
| caller | trustedworker system/operator，非Web/公开HTTP |
| 目标能力 | Gov originalintentprobe + formal decision/currentbinding |

#### 请求schema与构造来源

### ReconcileReviewHandoffRequest

```rust
/// Carries ReconcileReviewHandoffRequest with explicit sources and no upstream body.
pub struct ReconcileReviewHandoffRequest {
    /// Carries handoff_ref; see the source and invariant table.
    pub handoff_ref: ReviewHandoffRef,
    /// Carries work_ref; see the source and invariant table.
    pub work_ref: DeferredWorkRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| handoff_ref | `ReviewHandoffRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| work_ref | `DeferredWorkRef` | durableworkbody与context.fence.work_ref一致；不会来自URL/任意cron字符串 |

归属：contracts；internal only冻结plan/selector/target一致；batch非空有上限，缺planblocked

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | Gov originalintentprobe + formal decision/currentbinding；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| context.request + fence | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |
| 冻结work/plan | load_work + load_plan；bodytarget/work_ref=context.fence.work_ref，维护plan/currentcursor必须原冻结值；reconcile允许原dispatchplan同target但不改原effectintent | mismatch/planmissing blocked，no private map/rescan |

#### 完整输出schema

返回ExecutionResult<ReviewJobReport>；本族Report是完整MarketJobReport别名，逐itemtarget/outcome/failure/bases/intent/cursor和work/fence/audit/spawnedwork均保留。

### ReviewJobReport

```rust
/// Provides the documented local ReviewJobReport carrier.
pub type ReviewJobReport = MarketJobReport;
```

归属：contracts；完整字段schema见Step6 shared_types MarketJobReport与Step8 sharedsurface，不能删逐项结果


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 每次boundedbatch完整report accepted保存同state/audit/spawnedworkUoW；unknown外effect保留原intent和probe责任，不把Reported当ready。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


## 协议族停审

本族所有DTO字段有source/missing规则，response二级types唯一归属，Coremeta/actor/key/page无双承载；无activeevent/ownertruth复制；下一族方可创建。外部exact资格保持blocked，不宣称运行测试通过。
