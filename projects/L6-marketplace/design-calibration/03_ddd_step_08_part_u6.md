# Step8 U6 审计/恢复协议族小循环

## 思考、诊断与取舍

本族只处理审计/恢复，Requestbody均是候选/localintent而不是qualificationtruth。采用独立DTO与safe result/readmodel，ownerfields由Step7formalports核验；拒绝使用callerprovided Approved/Verified/Installed/Delivered。前序对象state不以UI语言改变，unsafe unknownfields拒绝。sharedsurface只统一Envelope/错误/分页，不替代本族逐协议schema。

## 定义批次表

| 协议 | 类别 | 对象 / view | port/构造 | flow |
|---|---|---|---|---|
| RequestMarketRecovery | Command | RecoveryIntent / RecoveryResult | formaloperator/targetauthority→RecoveryIntent.request | Step9 request_market_recovery |
| GetMarketAudit | Query | MarketAuditRecord / AuditRecoveryReadModel | AuditStore.list_audits + formalobs binding，onlysafe | Step9 get_market_audit |
| GetRecoveryProgress | Query | RecoveryIntent / AuditRecoveryReadModel | Recovery/work/原fullreport读取，无run | Step9 get_recovery_progress |
| GetOperationResult | Query | OperationRecord / StoredOperationResult | OperationStore.load_by_operation，fulloriginaltyped不重建 | Step9 get_operation_result |
| RunMarketRecovery | Job | RecoveryIntent / RecoveryJobReport | Recovery.begin/record+policy + typed原targetprobe，无任意SQL修业务 | Step9 run_market_recovery |
| DispatchObservation | Job | MarketAuditRecord / ObservationJobReport | 正式safeproducer/redaction/auditplan→Obs.dispatch，receipt独立 | Step9 dispatch_observation |
| ReconcileObservation | Job | DeferredWork / ObservationJobReport | 原auditintentprobe→formalbinding，缺probeblockedwaiting | Step9 reconcile_observation |

### RequestMarketRecovery

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn request_market_recovery(&self, request: CommandEnvelope<RequestMarketRecoveryRequest>) -> Result<ExecutionResult<RecoveryResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/request-market-recovery |
| 处理方 | MarketplaceApplication<P> / audit_recovery / planned request_market_recovery.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | formaloperator/targetauthority→RecoveryIntent.request |

#### 请求schema与构造来源

### RequestMarketRecoveryRequest

```rust
/// Carries RequestMarketRecoveryRequest with explicit sources and no upstream body.
pub struct RequestMarketRecoveryRequest {
    /// Carries target_ref; see the source and invariant table.
    pub target_ref: MarketWorkTargetRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| target_ref | `MarketWorkTargetRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | formaloperator/targetauthority→RecoveryIntent.request；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<RecoveryResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### RecoveryResult

```rust
/// Carries RecoveryResult with explicit sources and no upstream body.
pub struct RecoveryResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries recovery_ref; see the source and invariant table.
    pub recovery_ref: RecoveryIntentRef,
    /// Carries target_ref; see the source and invariant table.
    pub target_ref: MarketWorkTargetRef,
    /// Carries state; see the source and invariant table.
    pub state: RecoveryIntentState,
    /// Carries report_ref; see the source and invariant table.
    pub report_ref: OptionalStoredOperationResultRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| recovery_ref | `RecoveryIntentRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| target_ref | `MarketWorkTargetRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `RecoveryIntentState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| report_ref | `OptionalStoredOperationResultRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### GetMarketAudit

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn get_market_audit(&self, request: QueryEnvelope<GetMarketAuditRequest>) -> Result<ReadSurface<AuditRecoveryReadModel>, MarketError>` |
| transport | POST /api/marketplace/v1/queries/get-market-audit |
| 处理方 | MarketplaceApplication<P> / audit_recovery / planned get_market_audit.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | AuditStore.list_audits + formalobs binding，onlysafe |

#### 请求schema与构造来源

### GetMarketAuditRequest

```rust
/// Carries GetMarketAuditRequest with explicit sources and no upstream body.
pub struct GetMarketAuditRequest {
    /// Carries subject_ref; see the source and invariant table.
    pub subject_ref: MarketAuditSubjectRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| subject_ref | `MarketAuditSubjectRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | AuditStore.list_audits + formalobs binding，onlysafe；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | currentScope + CoreQueryMetadata.page/consistency唯一；不写ContextRecord | 读取失败typedDegraded；不reserve |

#### 完整输出schema

返回ReadSurface<AuditRecoveryReadModel>，Ready QualifiedPage.items为本类型的typedreadmodel；Empty/NotVisible/Missing/Degraded独立安全分支，无requiredID假填。

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


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。typedentity→readmodel每同名字段逐字段copy，status由currentReadSurface而不是owner approval；scope/page/token不重复。

#### 失败、幂等与审计

no-write：所有save/append/reserve/refresh/rebuild/dispatch/ID/Clock为零；当前scope先于typed读，数量/提示/详情/分页同一visibility交集。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### GetRecoveryProgress

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn get_recovery_progress(&self, request: QueryEnvelope<GetRecoveryProgressRequest>) -> Result<ReadSurface<AuditRecoveryReadModel>, MarketError>` |
| transport | POST /api/marketplace/v1/queries/get-recovery-progress |
| 处理方 | MarketplaceApplication<P> / audit_recovery / planned get_recovery_progress.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | Recovery/work/原fullreport读取，无run |

#### 请求schema与构造来源

### GetRecoveryProgressRequest

```rust
/// Carries GetRecoveryProgressRequest with explicit sources and no upstream body.
pub struct GetRecoveryProgressRequest {
    /// Carries recovery_ref; see the source and invariant table.
    pub recovery_ref: RecoveryIntentRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| recovery_ref | `RecoveryIntentRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | Recovery/work/原fullreport读取，无run；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | currentScope + CoreQueryMetadata.page/consistency唯一；不写ContextRecord | 读取失败typedDegraded；不reserve |

#### 完整输出schema

返回ReadSurface<AuditRecoveryReadModel>，Ready QualifiedPage.items为本类型的typedreadmodel；Empty/NotVisible/Missing/Degraded独立安全分支，无requiredID假填。

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


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。typedentity→readmodel每同名字段逐字段copy，status由currentReadSurface而不是owner approval；scope/page/token不重复。

#### 失败、幂等与审计

no-write：所有save/append/reserve/refresh/rebuild/dispatch/ID/Clock为零；当前scope先于typed读，数量/提示/详情/分页同一visibility交集。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### GetOperationResult

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn get_operation_result(&self, request: QueryEnvelope<GetOperationResultRequest>) -> Result<ReadSurface<StoredOperationResult>, MarketError>` |
| transport | POST /api/marketplace/v1/queries/get-operation-result |
| 处理方 | MarketplaceApplication<P> / audit_recovery / planned get_operation_result.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | OperationStore.load_by_operation，fulloriginaltyped不重建 |

#### 请求schema与构造来源

### GetOperationResultRequest

```rust
/// Carries GetOperationResultRequest with explicit sources and no upstream body.
pub struct GetOperationResultRequest {
    /// Carries operation_ref; see the source and invariant table.
    pub operation_ref: MarketOperationRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| operation_ref | `MarketOperationRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | OperationStore.load_by_operation，fulloriginaltyped不重建；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | currentScope + CoreQueryMetadata.page/consistency唯一；不写ContextRecord | 读取失败typedDegraded；不reserve |

#### 完整输出schema

返回ReadSurface<StoredOperationResult>，Ready QualifiedPage.items为本类型的typedreadmodel；Empty/NotVisible/Missing/Degraded独立安全分支，无requiredID假填。

### StoredOperationResult

```rust
/// Carries StoredOperationResult with explicit sources and no upstream body.
pub struct StoredOperationResult {
    /// Carries result_ref; see the source and invariant table.
    pub result_ref: StoredOperationResultRef,
    /// Carries operation_ref; see the source and invariant table.
    pub operation_ref: MarketOperationRef,
    /// Carries result_kind; see the source and invariant table.
    pub result_kind: MarketResultKind,
    /// Carries safe_result; see the source and invariant table.
    pub safe_result: MarketResultSurface,
    /// Carries schema_ref; see the source and invariant table.
    pub schema_ref: MarketResultSchemaRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| result_ref | `StoredOperationResultRef` | 本地ID |
| operation_ref | `MarketOperationRef` | 与record绑定 |
| result_kind | `MarketResultKind` | 有限command/job类型，不能错kind读取 |
| safe_result | `MarketResultSurface` | 完整原receipt/status/subject/item/outcome/gap/cursor安全字段 |
| schema_ref | `MarketResultSchemaRef` | 本地正式schema版本03闭合，不伪造已发布版本 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。typedentity→readmodel每同名字段逐字段copy，status由currentReadSurface而不是owner approval；scope/page/token不重复。

#### 失败、幂等与审计

no-write：所有save/append/reserve/refresh/rebuild/dispatch/ID/Clock为零；当前scope先于typed读，数量/提示/详情/分页同一visibility交集。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### RunMarketRecovery

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn run_market_recovery(&self, request: JobEnvelope<RunMarketRecoveryRequest>) -> Result<ExecutionResult<RecoveryJobReport>, MarketError>` |
| transport | worker-internal run_market_recovery |
| 处理方 | MarketplaceApplication<P> / audit_recovery / planned run_market_recovery.rs |
| caller | trustedworker system/operator，非Web/公开HTTP |
| 目标能力 | Recovery.begin/record+policy + typed原targetprobe，无任意SQL修业务 |

#### 请求schema与构造来源

### RunMarketRecoveryRequest

```rust
/// Carries RunMarketRecoveryRequest with explicit sources and no upstream body.
pub struct RunMarketRecoveryRequest {
    /// Carries recovery_ref; see the source and invariant table.
    pub recovery_ref: RecoveryIntentRef,
    /// Carries work_ref; see the source and invariant table.
    pub work_ref: DeferredWorkRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| recovery_ref | `RecoveryIntentRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| work_ref | `DeferredWorkRef` | durableworkbody与context.fence.work_ref一致；不会来自URL/任意cron字符串 |

归属：contracts；internal only冻结plan/selector/target一致；batch非空有上限，缺planblocked

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | Recovery.begin/record+policy + typed原targetprobe，无任意SQL修业务；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| context.request + fence | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |
| 冻结work/plan | load_work + load_plan；bodytarget/work_ref=context.fence.work_ref，维护plan/currentcursor必须原冻结值；reconcile允许原dispatchplan同target但不改原effectintent | mismatch/planmissing blocked，no private map/rescan |

#### 完整输出schema

返回ExecutionResult<RecoveryJobReport>；本族Report是完整MarketJobReport别名，逐itemtarget/outcome/failure/bases/intent/cursor和work/fence/audit/spawnedwork均保留。

### RecoveryJobReport

```rust
/// Provides the documented local RecoveryJobReport carrier.
pub type RecoveryJobReport = MarketJobReport;
```

归属：contracts；完整字段schema见Step6 shared_types MarketJobReport与Step8 sharedsurface，不能删逐项结果


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 每次boundedbatch完整report accepted保存同state/audit/spawnedworkUoW；unknown外effect保留原intent和probe责任，不把Reported当ready。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### DispatchObservation

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn dispatch_observation(&self, request: JobEnvelope<DispatchObservationRequest>) -> Result<ExecutionResult<ObservationJobReport>, MarketError>` |
| transport | worker-internal dispatch_observation |
| 处理方 | MarketplaceApplication<P> / audit_recovery / planned dispatch_observation.rs |
| caller | trustedworker system/operator，非Web/公开HTTP |
| 目标能力 | 正式safeproducer/redaction/auditplan→Obs.dispatch，receipt独立 |

#### 请求schema与构造来源

### DispatchObservationRequest

```rust
/// Carries DispatchObservationRequest with explicit sources and no upstream body.
pub struct DispatchObservationRequest {
    /// Carries audit_refs; see the source and invariant table.
    pub audit_refs: MarketAuditRefSet,
    /// Carries work_ref; see the source and invariant table.
    pub work_ref: DeferredWorkRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| audit_refs | `MarketAuditRefSet` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| work_ref | `DeferredWorkRef` | durableworkbody与context.fence.work_ref一致；不会来自URL/任意cron字符串 |

归属：contracts；internal only冻结plan/selector/target一致；batch非空有上限，缺planblocked

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | 正式safeproducer/redaction/auditplan→Obs.dispatch，receipt独立；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| context.request + fence | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |
| 冻结work/plan | load_work + load_plan；bodytarget/work_ref=context.fence.work_ref，维护plan/currentcursor必须原冻结值；reconcile允许原dispatchplan同target但不改原effectintent | mismatch/planmissing blocked，no private map/rescan |

#### 完整输出schema

返回ExecutionResult<ObservationJobReport>；本族Report是完整MarketJobReport别名，逐itemtarget/outcome/failure/bases/intent/cursor和work/fence/audit/spawnedwork均保留。

### ObservationJobReport

```rust
/// Provides the documented local ObservationJobReport carrier.
pub type ObservationJobReport = MarketJobReport;
```

归属：contracts；完整字段schema见Step6 shared_types MarketJobReport与Step8 sharedsurface，不能删逐项结果


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 每次boundedbatch完整report accepted保存同state/audit/spawnedworkUoW；unknown外effect保留原intent和probe责任，不把Reported当ready。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### ReconcileObservation

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn reconcile_observation(&self, request: JobEnvelope<ReconcileObservationRequest>) -> Result<ExecutionResult<ObservationJobReport>, MarketError>` |
| transport | worker-internal reconcile_observation |
| 处理方 | MarketplaceApplication<P> / audit_recovery / planned reconcile_observation.rs |
| caller | trustedworker system/operator，非Web/公开HTTP |
| 目标能力 | 原auditintentprobe→formalbinding，缺probeblockedwaiting |

#### 请求schema与构造来源

### ReconcileObservationRequest

```rust
/// Carries ReconcileObservationRequest with explicit sources and no upstream body.
pub struct ReconcileObservationRequest {
    /// Carries work_ref; see the source and invariant table.
    pub work_ref: DeferredWorkRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| work_ref | `DeferredWorkRef` | durableworkbody与context.fence.work_ref一致；不会来自URL/任意cron字符串 |

归属：contracts；internal only冻结plan/selector/target一致；batch非空有上限，缺planblocked

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | 原auditintentprobe→formalbinding，缺probeblockedwaiting；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| context.request + fence | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |
| 冻结work/plan | load_work + load_plan；bodytarget/work_ref=context.fence.work_ref，维护plan/currentcursor必须原冻结值；reconcile允许原dispatchplan同target但不改原effectintent | mismatch/planmissing blocked，no private map/rescan |

#### 完整输出schema

返回ExecutionResult<ObservationJobReport>；本族Report是完整MarketJobReport别名，逐itemtarget/outcome/failure/bases/intent/cursor和work/fence/audit/spawnedwork均保留。

### ObservationJobReport

```rust
/// Provides the documented local ObservationJobReport carrier.
pub type ObservationJobReport = MarketJobReport;
```

归属：contracts；完整字段schema见Step6 shared_types MarketJobReport与Step8 sharedsurface，不能删逐项结果


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 每次boundedbatch完整report accepted保存同state/audit/spawnedworkUoW；unknown外effect保留原intent和probe责任，不把Reported当ready。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


## 协议族停审

本族所有DTO字段有source/missing规则，response二级types唯一归属，Coremeta/actor/key/page无双承载；无activeevent/ownertruth复制；下一族方可创建。外部exact资格保持blocked，不宣称运行测试通过。
