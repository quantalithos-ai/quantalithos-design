# Step8 U4 受控分发协议族小循环

## 思考、诊断与取舍

本族只处理受控分发，Requestbody均是候选/localintent而不是qualificationtruth。采用独立DTO与safe result/readmodel，ownerfields由Step7formalports核验；拒绝使用callerprovided Approved/Verified/Installed/Delivered。前序对象state不以UI语言改变，unsafe unknownfields拒绝。sharedsurface只统一Envelope/错误/分页，不替代本族逐协议schema。

## 定义批次表

| 协议 | 类别 | 对象 / view | port/构造 | flow |
|---|---|---|---|---|
| RequestDistribution | Command | DistributionIntent / DistributionResult | AcquisitionGatePolicy.evaluate + DistributionIntent.accept + relation + PreparedAttempt / exactreceiverformal | Step9 request_distribution |
| CancelDistribution | Command | DistributionIntent / DistributionResult | DistributionIntent.cancel / currentconsumerauthority，保留attempt | Step9 cancel_distribution |
| RecordReceiverOutcome | Command | DistributionAttempt / DistributionResult | formal Receiver probe_result + DistributionAttempt.settle/Relation.attach；lateimpact | Step9 record_receiver_outcome |
| GetAcquisitionEligibility | Query | MarketVersion / DistributionProgressReadModel | formalcurrent read source/auth/Gov/receiver + AcquisitionGatePolicy，无intent | Step9 get_acquisition_eligibility |
| GetDistributionProgress | Query | DistributionIntent / DistributionProgressReadModel | intent/relation/attempt完整read，不probe/retry | Step9 get_distribution_progress |
| DispatchDistribution | Job | DistributionAttempt / DistributionJobReport | attempt.begin/currentversionlock/permission then ReceiverPort.dispatch | Step9 dispatch_distribution |
| ReconcileDistribution | Job | DistributionAttempt / DistributionJobReport | 原intentprobe，不盲发；formalnotcommit后newattempt sameintent | Step9 reconcile_distribution |

### RequestDistribution

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn request_distribution(&self, request: CommandEnvelope<RequestDistributionRequest>) -> Result<ExecutionResult<DistributionResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/request-distribution |
| 处理方 | MarketplaceApplication<P> / distribution / planned request_distribution.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | AcquisitionGatePolicy.evaluate + DistributionIntent.accept + relation + PreparedAttempt / exactreceiverformal |

#### 请求schema与构造来源

### RequestDistributionRequest

```rust
/// Carries RequestDistributionRequest with explicit sources and no upstream body.
pub struct RequestDistributionRequest {
    /// Carries target; see the source and invariant table.
    pub target: AcquisitionTargetInput,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| target | `AcquisitionTargetInput` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | AcquisitionGatePolicy.evaluate + DistributionIntent.accept + relation + PreparedAttempt / exactreceiverformal；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<DistributionResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### DistributionResult

```rust
/// Carries DistributionResult with explicit sources and no upstream body.
pub struct DistributionResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries intent; see the source and invariant table.
    pub intent: DistributionIntentSnapshot,
    /// Carries relation; see the source and invariant table.
    pub relation: DistributionRelationSnapshot,
    /// Carries attempts; see the source and invariant table.
    pub attempts: Vec<DistributionAttemptSnapshot>,
    /// Carries impact_work_refs; see the source and invariant table.
    pub impact_work_refs: DeferredWorkRefSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| intent | `DistributionIntentSnapshot` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| relation | `DistributionRelationSnapshot` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| attempts | `Vec<DistributionAttemptSnapshot>` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| impact_work_refs | `DeferredWorkRefSet` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### CancelDistribution

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn cancel_distribution(&self, request: CommandEnvelope<CancelDistributionRequest>) -> Result<ExecutionResult<DistributionResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/cancel-distribution |
| 处理方 | MarketplaceApplication<P> / distribution / planned cancel_distribution.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | DistributionIntent.cancel / currentconsumerauthority，保留attempt |

#### 请求schema与构造来源

### CancelDistributionRequest

```rust
/// Carries CancelDistributionRequest with explicit sources and no upstream body.
pub struct CancelDistributionRequest {
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: DistributionIntentRef,
    /// Carries expected_revision; see the source and invariant table.
    pub expected_revision: MarketRevision,
    /// Carries reason_ref; see the source and invariant table.
    pub reason_ref: SafeReasonRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| intent_ref | `DistributionIntentRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| expected_revision | `MarketRevision` | 客户端读面revision；fresh读取相等检查且repoCAS；replay先于业务revision重核 |
| reason_ref | `SafeReasonRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | DistributionIntent.cancel / currentconsumerauthority，保留attempt；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<DistributionResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### DistributionResult

```rust
/// Carries DistributionResult with explicit sources and no upstream body.
pub struct DistributionResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries intent; see the source and invariant table.
    pub intent: DistributionIntentSnapshot,
    /// Carries relation; see the source and invariant table.
    pub relation: DistributionRelationSnapshot,
    /// Carries attempts; see the source and invariant table.
    pub attempts: Vec<DistributionAttemptSnapshot>,
    /// Carries impact_work_refs; see the source and invariant table.
    pub impact_work_refs: DeferredWorkRefSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| intent | `DistributionIntentSnapshot` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| relation | `DistributionRelationSnapshot` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| attempts | `Vec<DistributionAttemptSnapshot>` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| impact_work_refs | `DeferredWorkRefSet` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### RecordReceiverOutcome

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn record_receiver_outcome(&self, request: CommandEnvelope<RecordReceiverOutcomeRequest>) -> Result<ExecutionResult<DistributionResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/record-receiver-outcome |
| 处理方 | MarketplaceApplication<P> / distribution / planned record_receiver_outcome.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | formal Receiver probe_result + DistributionAttempt.settle/Relation.attach；lateimpact |

#### 请求schema与构造来源

### RecordReceiverOutcomeRequest

```rust
/// Carries RecordReceiverOutcomeRequest with explicit sources and no upstream body.
pub struct RecordReceiverOutcomeRequest {
    /// Carries attempt_ref; see the source and invariant table.
    pub attempt_ref: DistributionAttemptRef,
    /// Carries outcome_candidate; see the source and invariant table.
    pub outcome_candidate: ReceiverOutcomeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| attempt_ref | `DistributionAttemptRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| outcome_candidate | `ReceiverOutcomeRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | formal Receiver probe_result + DistributionAttempt.settle/Relation.attach；lateimpact；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<DistributionResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### DistributionResult

```rust
/// Carries DistributionResult with explicit sources and no upstream body.
pub struct DistributionResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries intent; see the source and invariant table.
    pub intent: DistributionIntentSnapshot,
    /// Carries relation; see the source and invariant table.
    pub relation: DistributionRelationSnapshot,
    /// Carries attempts; see the source and invariant table.
    pub attempts: Vec<DistributionAttemptSnapshot>,
    /// Carries impact_work_refs; see the source and invariant table.
    pub impact_work_refs: DeferredWorkRefSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| intent | `DistributionIntentSnapshot` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| relation | `DistributionRelationSnapshot` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| attempts | `Vec<DistributionAttemptSnapshot>` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| impact_work_refs | `DeferredWorkRefSet` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### GetAcquisitionEligibility

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn get_acquisition_eligibility(&self, request: QueryEnvelope<GetAcquisitionEligibilityRequest>) -> Result<ReadSurface<DistributionProgressReadModel>, MarketError>` |
| transport | POST /api/marketplace/v1/queries/get-acquisition-eligibility |
| 处理方 | MarketplaceApplication<P> / distribution / planned get_acquisition_eligibility.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | formalcurrent read source/auth/Gov/receiver + AcquisitionGatePolicy，无intent |

#### 请求schema与构造来源

### GetAcquisitionEligibilityRequest

```rust
/// Carries GetAcquisitionEligibilityRequest with explicit sources and no upstream body.
pub struct GetAcquisitionEligibilityRequest {
    /// Carries target; see the source and invariant table.
    pub target: AcquisitionTargetInput,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| target | `AcquisitionTargetInput` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | formalcurrent read source/auth/Gov/receiver + AcquisitionGatePolicy，无intent；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | currentScope + CoreQueryMetadata.page/consistency唯一；不写ContextRecord | 读取失败typedDegraded；不reserve |

#### 完整输出schema

返回ReadSurface<DistributionProgressReadModel>，Ready QualifiedPage.items为本类型的typedreadmodel；Empty/NotVisible/Missing/Degraded独立安全分支，无requiredID假填。

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


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。typedentity→readmodel每同名字段逐字段copy，status由currentReadSurface而不是owner approval；scope/page/token不重复。

#### 失败、幂等与审计

no-write：所有save/append/reserve/refresh/rebuild/dispatch/ID/Clock为零；当前scope先于typed读，数量/提示/详情/分页同一visibility交集。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### GetDistributionProgress

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn get_distribution_progress(&self, request: QueryEnvelope<GetDistributionProgressRequest>) -> Result<ReadSurface<DistributionProgressReadModel>, MarketError>` |
| transport | POST /api/marketplace/v1/queries/get-distribution-progress |
| 处理方 | MarketplaceApplication<P> / distribution / planned get_distribution_progress.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | intent/relation/attempt完整read，不probe/retry |

#### 请求schema与构造来源

### GetDistributionProgressRequest

```rust
/// Carries GetDistributionProgressRequest with explicit sources and no upstream body.
pub struct GetDistributionProgressRequest {
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: DistributionIntentRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| intent_ref | `DistributionIntentRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | intent/relation/attempt完整read，不probe/retry；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | currentScope + CoreQueryMetadata.page/consistency唯一；不写ContextRecord | 读取失败typedDegraded；不reserve |

#### 完整输出schema

返回ReadSurface<DistributionProgressReadModel>，Ready QualifiedPage.items为本类型的typedreadmodel；Empty/NotVisible/Missing/Degraded独立安全分支，无requiredID假填。

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


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。typedentity→readmodel每同名字段逐字段copy，status由currentReadSurface而不是owner approval；scope/page/token不重复。

#### 失败、幂等与审计

no-write：所有save/append/reserve/refresh/rebuild/dispatch/ID/Clock为零；当前scope先于typed读，数量/提示/详情/分页同一visibility交集。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### DispatchDistribution

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn dispatch_distribution(&self, request: JobEnvelope<DispatchDistributionRequest>) -> Result<ExecutionResult<DistributionJobReport>, MarketError>` |
| transport | worker-internal dispatch_distribution |
| 处理方 | MarketplaceApplication<P> / distribution / planned dispatch_distribution.rs |
| caller | trustedworker system/operator，非Web/公开HTTP |
| 目标能力 | attempt.begin/currentversionlock/permission then ReceiverPort.dispatch |

#### 请求schema与构造来源

### DispatchDistributionRequest

```rust
/// Carries DispatchDistributionRequest with explicit sources and no upstream body.
pub struct DispatchDistributionRequest {
    /// Carries attempt_ref; see the source and invariant table.
    pub attempt_ref: DistributionAttemptRef,
    /// Carries work_ref; see the source and invariant table.
    pub work_ref: DeferredWorkRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| attempt_ref | `DistributionAttemptRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| work_ref | `DeferredWorkRef` | durableworkbody与context.fence.work_ref一致；不会来自URL/任意cron字符串 |

归属：contracts；internal only冻结plan/selector/target一致；batch非空有上限，缺planblocked

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | attempt.begin/currentversionlock/permission then ReceiverPort.dispatch；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| context.request + fence | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |
| 冻结work/plan | load_work + load_plan；bodytarget/work_ref=context.fence.work_ref，维护plan/currentcursor必须原冻结值；reconcile允许原dispatchplan同target但不改原effectintent | mismatch/planmissing blocked，no private map/rescan |

#### 完整输出schema

返回ExecutionResult<DistributionJobReport>；本族Report是完整MarketJobReport别名，逐itemtarget/outcome/failure/bases/intent/cursor和work/fence/audit/spawnedwork均保留。

### DistributionJobReport

```rust
/// Provides the documented local DistributionJobReport carrier.
pub type DistributionJobReport = MarketJobReport;
```

归属：contracts；完整字段schema见Step6 shared_types MarketJobReport与Step8 sharedsurface，不能删逐项结果


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 每次boundedbatch完整report accepted保存同state/audit/spawnedworkUoW；unknown外effect保留原intent和probe责任，不把Reported当ready。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### ReconcileDistribution

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn reconcile_distribution(&self, request: JobEnvelope<ReconcileDistributionRequest>) -> Result<ExecutionResult<DistributionJobReport>, MarketError>` |
| transport | worker-internal reconcile_distribution |
| 处理方 | MarketplaceApplication<P> / distribution / planned reconcile_distribution.rs |
| caller | trustedworker system/operator，非Web/公开HTTP |
| 目标能力 | 原intentprobe，不盲发；formalnotcommit后newattempt sameintent |

#### 请求schema与构造来源

### ReconcileDistributionRequest

```rust
/// Carries ReconcileDistributionRequest with explicit sources and no upstream body.
pub struct ReconcileDistributionRequest {
    /// Carries attempt_ref; see the source and invariant table.
    pub attempt_ref: DistributionAttemptRef,
    /// Carries work_ref; see the source and invariant table.
    pub work_ref: DeferredWorkRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| attempt_ref | `DistributionAttemptRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| work_ref | `DeferredWorkRef` | durableworkbody与context.fence.work_ref一致；不会来自URL/任意cron字符串 |

归属：contracts；internal only冻结plan/selector/target一致；batch非空有上限，缺planblocked

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | 原intentprobe，不盲发；formalnotcommit后newattempt sameintent；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| context.request + fence | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |
| 冻结work/plan | load_work + load_plan；bodytarget/work_ref=context.fence.work_ref，维护plan/currentcursor必须原冻结值；reconcile允许原dispatchplan同target但不改原effectintent | mismatch/planmissing blocked，no private map/rescan |

#### 完整输出schema

返回ExecutionResult<DistributionJobReport>；本族Report是完整MarketJobReport别名，逐itemtarget/outcome/failure/bases/intent/cursor和work/fence/audit/spawnedwork均保留。

### DistributionJobReport

```rust
/// Provides the documented local DistributionJobReport carrier.
pub type DistributionJobReport = MarketJobReport;
```

归属：contracts；完整字段schema见Step6 shared_types MarketJobReport与Step8 sharedsurface，不能删逐项结果


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 每次boundedbatch完整report accepted保存同state/audit/spawnedworkUoW；unknown外effect保留原intent和probe责任，不把Reported当ready。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


## 协议族停审

本族所有DTO字段有source/missing规则，response二级types唯一归属，Coremeta/actor/key/page无双承载；无activeevent/ownertruth复制；下一族方可创建。外部exact资格保持blocked，不宣称运行测试通过。


## Step9反向闭环修正

RecordReceiverOutcome仅消费已匹配Confirmed的正式outcome_candidate；negative/Unknown由Dispatch/Reconcile Job完整记录，不对失败调用relation.attach。DistributionResult.attempts是本次原结果明确捕获的bounded快照，不是全部history；当前完整历史通过GetDistributionProgress的Core分页取得。
