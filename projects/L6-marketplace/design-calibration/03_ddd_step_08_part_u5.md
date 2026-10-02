# Step8 U5 撤回/影响/通知协议族小循环

## 思考、诊断与取舍

本族只处理撤回/影响/通知，Requestbody均是候选/localintent而不是qualificationtruth。采用独立DTO与safe result/readmodel，ownerfields由Step7formalports核验；拒绝使用callerprovided Approved/Verified/Installed/Delivered。前序对象state不以UI语言改变，unsafe unknownfields拒绝。sharedsurface只统一Envelope/错误/分页，不替代本族逐协议schema。

## 定义批次表

| 协议 | 类别 | 对象 / view | port/构造 | flow |
|---|---|---|---|---|
| RestrictMarketVersion | Command | MarketVersion / WithdrawalResult | WithdrawalDisposition.record + MarketVersion.restrict + Impact.start / formal authority or正式失效basis | Step9 restrict_market_version |
| WithdrawMarketVersion | Command | MarketVersion / WithdrawalResult | Disposition.record+Version.withdraw+Impact.start / versionserialize | Step9 withdraw_market_version |
| PlanImpactNotifications | Command | NoticeIntent / NoticePlanResult | formaltarget/channel→NoticeIntent.prepare + unique dedup / knownimpact | Step9 plan_impact_notifications |
| RecordNoticeOutcome | Command | NoticeIntent / NoticeResult | formalchannelprobe/matching + NoticeIntent.settle，不推送达 | Step9 record_notice_outcome |
| GetWithdrawalImpact | Query | ImpactRecord / ImpactNoticeReadModel | typedknownimpact/coverage/notice safe read，不全安装集合 | Step9 get_withdrawal_impact |
| GetNoticeProgress | Query | NoticeIntent / ImpactNoticeReadModel | typednotice/outcome+impact+disposition currentdisclosure | Step9 get_notice_progress |
| EnumerateKnownImpact | Job | ImpactRecord / ImpactEnumerationReport | bounded typedrelations/unknown fixedcursor + Impact.include / durablecontinuation | Step9 enumerate_known_impact |
| DispatchNotice | Job | NoticeIntent / NoticeJobReport | Notice.begin after formalgate + permission→channelcall | Step9 dispatch_notice |
| ReconcileNotice | Job | NoticeIntent / NoticeJobReport | 原noticeprobe formalnotcommitted可safe原intent恢复；无fake delivery | Step9 reconcile_notice |

### RestrictMarketVersion

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn restrict_market_version(&self, request: CommandEnvelope<RestrictMarketVersionRequest>) -> Result<ExecutionResult<WithdrawalResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/restrict-market-version |
| 处理方 | MarketplaceApplication<P> / withdrawal_notice / planned restrict_market_version.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | WithdrawalDisposition.record + MarketVersion.restrict + Impact.start / formal authority or正式失效basis |

#### 请求schema与构造来源

### RestrictMarketVersionRequest

```rust
/// Carries RestrictMarketVersionRequest with explicit sources and no upstream body.
pub struct RestrictMarketVersionRequest {
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries expected_revision; see the source and invariant table.
    pub expected_revision: MarketRevision,
    /// Carries reason_ref; see the source and invariant table.
    pub reason_ref: SafeReasonRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| version_ref | `MarketVersionRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| expected_revision | `MarketRevision` | 客户端读面revision；fresh读取相等检查且repoCAS；replay先于业务revision重核 |
| reason_ref | `SafeReasonRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | WithdrawalDisposition.record + MarketVersion.restrict + Impact.start / formal authority or正式失效basis；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<WithdrawalResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### WithdrawalResult

```rust
/// Carries WithdrawalResult with explicit sources and no upstream body.
pub struct WithdrawalResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries version; see the source and invariant table.
    pub version: MarketVersionResult,
    /// Carries disposition; see the source and invariant table.
    pub disposition: WithdrawalDispositionSnapshot,
    /// Carries impact_ref; see the source and invariant table.
    pub impact_ref: ImpactRecordRef,
    /// Carries coverage_kind; see the source and invariant table.
    pub coverage_kind: ImpactCoverageKind,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | version嵌套receipt与外层同operation/result，不新建第二receipt；局部withdrawal不声称全移除 |
| version | `MarketVersionResult` | version嵌套receipt与外层同operation/result，不新建第二receipt；局部withdrawal不声称全移除 |
| disposition | `WithdrawalDispositionSnapshot` | version嵌套receipt与外层同operation/result，不新建第二receipt；局部withdrawal不声称全移除 |
| impact_ref | `ImpactRecordRef` | version嵌套receipt与外层同operation/result，不新建第二receipt；局部withdrawal不声称全移除 |
| coverage_kind | `ImpactCoverageKind` | version嵌套receipt与外层同operation/result，不新建第二receipt；局部withdrawal不声称全移除 |

归属：contracts；version嵌套receipt与外层同operation/result，不新建第二receipt；局部withdrawal不声称全移除


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### WithdrawMarketVersion

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn withdraw_market_version(&self, request: CommandEnvelope<WithdrawMarketVersionRequest>) -> Result<ExecutionResult<WithdrawalResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/withdraw-market-version |
| 处理方 | MarketplaceApplication<P> / withdrawal_notice / planned withdraw_market_version.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | Disposition.record+Version.withdraw+Impact.start / versionserialize |

#### 请求schema与构造来源

### WithdrawMarketVersionRequest

```rust
/// Carries WithdrawMarketVersionRequest with explicit sources and no upstream body.
pub struct WithdrawMarketVersionRequest {
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries expected_revision; see the source and invariant table.
    pub expected_revision: MarketRevision,
    /// Carries reason_ref; see the source and invariant table.
    pub reason_ref: SafeReasonRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| version_ref | `MarketVersionRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| expected_revision | `MarketRevision` | 客户端读面revision；fresh读取相等检查且repoCAS；replay先于业务revision重核 |
| reason_ref | `SafeReasonRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | Disposition.record+Version.withdraw+Impact.start / versionserialize；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<WithdrawalResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### WithdrawalResult

```rust
/// Carries WithdrawalResult with explicit sources and no upstream body.
pub struct WithdrawalResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries version; see the source and invariant table.
    pub version: MarketVersionResult,
    /// Carries disposition; see the source and invariant table.
    pub disposition: WithdrawalDispositionSnapshot,
    /// Carries impact_ref; see the source and invariant table.
    pub impact_ref: ImpactRecordRef,
    /// Carries coverage_kind; see the source and invariant table.
    pub coverage_kind: ImpactCoverageKind,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | version嵌套receipt与外层同operation/result，不新建第二receipt；局部withdrawal不声称全移除 |
| version | `MarketVersionResult` | version嵌套receipt与外层同operation/result，不新建第二receipt；局部withdrawal不声称全移除 |
| disposition | `WithdrawalDispositionSnapshot` | version嵌套receipt与外层同operation/result，不新建第二receipt；局部withdrawal不声称全移除 |
| impact_ref | `ImpactRecordRef` | version嵌套receipt与外层同operation/result，不新建第二receipt；局部withdrawal不声称全移除 |
| coverage_kind | `ImpactCoverageKind` | version嵌套receipt与外层同operation/result，不新建第二receipt；局部withdrawal不声称全移除 |

归属：contracts；version嵌套receipt与外层同operation/result，不新建第二receipt；局部withdrawal不声称全移除


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### PlanImpactNotifications

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn plan_impact_notifications(&self, request: CommandEnvelope<PlanImpactNotificationsRequest>) -> Result<ExecutionResult<NoticePlanResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/plan-impact-notifications |
| 处理方 | MarketplaceApplication<P> / withdrawal_notice / planned plan_impact_notifications.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | formaltarget/channel→NoticeIntent.prepare + unique dedup / knownimpact |

#### 请求schema与构造来源

### PlanImpactNotificationsRequest

```rust
/// Carries PlanImpactNotificationsRequest with explicit sources and no upstream body.
pub struct PlanImpactNotificationsRequest {
    /// Carries impact_ref; see the source and invariant table.
    pub impact_ref: ImpactRecordRef,
    /// Carries targets; see the source and invariant table.
    pub targets: Vec<NoticePlanCandidate>,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| impact_ref | `ImpactRecordRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| targets | `Vec<NoticePlanCandidate>` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | formaltarget/channel→NoticeIntent.prepare + unique dedup / knownimpact；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<NoticePlanResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### NoticePlanResult

```rust
/// Carries NoticePlanResult with explicit sources and no upstream body.
pub struct NoticePlanResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
    /// Carries impact_ref; see the source and invariant table.
    pub impact_ref: ImpactRecordRef,
    /// Carries notice_refs; see the source and invariant table.
    pub notice_refs: NoticeIntentRefSet,
    /// Carries duplicate_notice_refs; see the source and invariant table.
    pub duplicate_notice_refs: NoticeIntentRefSet,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| impact_ref | `ImpactRecordRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| notice_refs | `NoticeIntentRefSet` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| duplicate_notice_refs | `NoticeIntentRefSet` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### RecordNoticeOutcome

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn record_notice_outcome(&self, request: CommandEnvelope<RecordNoticeOutcomeRequest>) -> Result<ExecutionResult<NoticeResult>, MarketError>` |
| transport | POST /api/marketplace/v1/commands/record-notice-outcome |
| 处理方 | MarketplaceApplication<P> / withdrawal_notice / planned record_notice_outcome.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | formalchannelprobe/matching + NoticeIntent.settle，不推送达 |

#### 请求schema与构造来源

### RecordNoticeOutcomeRequest

```rust
/// Carries RecordNoticeOutcomeRequest with explicit sources and no upstream body.
pub struct RecordNoticeOutcomeRequest {
    /// Carries notice_ref; see the source and invariant table.
    pub notice_ref: NoticeIntentRef,
    /// Carries outcome_candidate; see the source and invariant table.
    pub outcome_candidate: NoticeOutcomeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| notice_ref | `NoticeIntentRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| outcome_candidate | `NoticeOutcomeRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | formalchannelprobe/matching + NoticeIntent.settle，不推送达；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |

#### 完整输出schema

返回ExecutionResult<NoticeResult>；HTTP payload为value；Accepted本地truth≠外部成功。

### NoticeResult

```rust
/// Carries NoticeResult with explicit sources and no upstream body.
pub struct NoticeResult {
    /// Carries receipt; see the source and invariant table.
    pub receipt: CommandReceipt,
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
| receipt | `CommandReceipt` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| notice_ref | `NoticeIntentRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| state | `NoticeIntentState` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| outcome_binding | `OptionalNoticeOutcomeBinding` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |
| failure_ref | `OptionalSafeFailureRef` | 字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。 |

归属：contracts；字段来自明确请求、typed读取或正式port；缺失reject，禁止正文/字符串猜测。


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### GetWithdrawalImpact

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn get_withdrawal_impact(&self, request: QueryEnvelope<GetWithdrawalImpactRequest>) -> Result<ReadSurface<ImpactNoticeReadModel>, MarketError>` |
| transport | POST /api/marketplace/v1/queries/get-withdrawal-impact |
| 处理方 | MarketplaceApplication<P> / withdrawal_notice / planned get_withdrawal_impact.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | typedknownimpact/coverage/notice safe read，不全安装集合 |

#### 请求schema与构造来源

### GetWithdrawalImpactRequest

```rust
/// Carries GetWithdrawalImpactRequest with explicit sources and no upstream body.
pub struct GetWithdrawalImpactRequest {
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: WithdrawalDispositionRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| disposition_ref | `WithdrawalDispositionRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | typedknownimpact/coverage/notice safe read，不全安装集合；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | currentScope + CoreQueryMetadata.page/consistency唯一；不写ContextRecord | 读取失败typedDegraded；不reserve |

#### 完整输出schema

返回ReadSurface<ImpactNoticeReadModel>，Ready QualifiedPage.items为本类型的typedreadmodel；Empty/NotVisible/Missing/Degraded独立安全分支，无requiredID假填。

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


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。typedentity→readmodel每同名字段逐字段copy，status由currentReadSurface而不是owner approval；scope/page/token不重复。

#### 失败、幂等与审计

no-write：所有save/append/reserve/refresh/rebuild/dispatch/ID/Clock为零；当前scope先于typed读，数量/提示/详情/分页同一visibility交集。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### GetNoticeProgress

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn get_notice_progress(&self, request: QueryEnvelope<GetNoticeProgressRequest>) -> Result<ReadSurface<ImpactNoticeReadModel>, MarketError>` |
| transport | POST /api/marketplace/v1/queries/get-notice-progress |
| 处理方 | MarketplaceApplication<P> / withdrawal_notice / planned get_notice_progress.rs |
| caller | Web或正式scope内integration；actor由可信gateway |
| 目标能力 | typednotice/outcome+impact+disposition currentdisclosure |

#### 请求schema与构造来源

### GetNoticeProgressRequest

```rust
/// Carries GetNoticeProgressRequest with explicit sources and no upstream body.
pub struct GetNoticeProgressRequest {
    /// Carries notice_ref; see the source and invariant table.
    pub notice_ref: NoticeIntentRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| notice_ref | `NoticeIntentRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |

归属：contracts；publicbody不重复actor/key/trace/page/consistency；deny unknown fields/unsafe body

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | typednotice/outcome+impact+disposition currentdisclosure；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| actor/meta | currentScope + CoreQueryMetadata.page/consistency唯一；不写ContextRecord | 读取失败typedDegraded；不reserve |

#### 完整输出schema

返回ReadSurface<ImpactNoticeReadModel>，Ready QualifiedPage.items为本类型的typedreadmodel；Empty/NotVisible/Missing/Degraded独立安全分支，无requiredID假填。

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


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。typedentity→readmodel每同名字段逐字段copy，status由currentReadSurface而不是owner approval；scope/page/token不重复。

#### 失败、幂等与审计

no-write：所有save/append/reserve/refresh/rebuild/dispatch/ID/Clock为零；当前scope先于typed读，数量/提示/详情/分页同一visibility交集。 错误映射见sharedsurface；写入错误rollback，不出现ref-onlyaccepted。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### EnumerateKnownImpact

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn enumerate_known_impact(&self, request: JobEnvelope<EnumerateKnownImpactRequest>) -> Result<ExecutionResult<ImpactEnumerationReport>, MarketError>` |
| transport | worker-internal enumerate_known_impact |
| 处理方 | MarketplaceApplication<P> / withdrawal_notice / planned enumerate_known_impact.rs |
| caller | trustedworker system/operator，非Web/公开HTTP |
| 目标能力 | bounded typedrelations/unknown fixedcursor + Impact.include / durablecontinuation |

#### 请求schema与构造来源

### EnumerateKnownImpactRequest

```rust
/// Carries EnumerateKnownImpactRequest with explicit sources and no upstream body.
pub struct EnumerateKnownImpactRequest {
    /// Carries disposition_ref; see the source and invariant table.
    pub disposition_ref: WithdrawalDispositionRef,
    /// Carries work_ref; see the source and invariant table.
    pub work_ref: DeferredWorkRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| disposition_ref | `WithdrawalDispositionRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| work_ref | `DeferredWorkRef` | durableworkbody与context.fence.work_ref一致；不会来自URL/任意cron字符串 |

归属：contracts；internal only冻结plan/selector/target一致；batch非空有上限，缺planblocked

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | bounded typedrelations/unknown fixedcursor + Impact.include / durablecontinuation；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| context.request + fence | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |
| 冻结work/plan | load_work + load_plan；bodytarget/work_ref=context.fence.work_ref，维护plan/currentcursor必须原冻结值；reconcile允许原dispatchplan同target但不改原effectintent | mismatch/planmissing blocked，no private map/rescan |

#### 完整输出schema

返回ExecutionResult<ImpactEnumerationReport>；本族Report是完整MarketJobReport别名，逐itemtarget/outcome/failure/bases/intent/cursor和work/fence/audit/spawnedwork均保留。

### ImpactEnumerationReport

```rust
/// Provides the documented local ImpactEnumerationReport carrier.
pub type ImpactEnumerationReport = MarketJobReport;
```

归属：contracts；完整字段schema见Step6 shared_types MarketJobReport与Step8 sharedsurface，不能删逐项结果


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 每次boundedbatch完整report accepted保存同state/audit/spawnedworkUoW；unknown外effect保留原intent和probe责任，不把Reported当ready。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### DispatchNotice

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn dispatch_notice(&self, request: JobEnvelope<DispatchNoticeRequest>) -> Result<ExecutionResult<NoticeJobReport>, MarketError>` |
| transport | worker-internal dispatch_notice |
| 处理方 | MarketplaceApplication<P> / withdrawal_notice / planned dispatch_notice.rs |
| caller | trustedworker system/operator，非Web/公开HTTP |
| 目标能力 | Notice.begin after formalgate + permission→channelcall |

#### 请求schema与构造来源

### DispatchNoticeRequest

```rust
/// Carries DispatchNoticeRequest with explicit sources and no upstream body.
pub struct DispatchNoticeRequest {
    /// Carries notice_ref; see the source and invariant table.
    pub notice_ref: NoticeIntentRef,
    /// Carries work_ref; see the source and invariant table.
    pub work_ref: DeferredWorkRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| notice_ref | `NoticeIntentRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| work_ref | `DeferredWorkRef` | durableworkbody与context.fence.work_ref一致；不会来自URL/任意cron字符串 |

归属：contracts；internal only冻结plan/selector/target一致；batch非空有上限，缺planblocked

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | Notice.begin after formalgate + permission→channelcall；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| context.request + fence | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |
| 冻结work/plan | load_work + load_plan；bodytarget/work_ref=context.fence.work_ref，维护plan/currentcursor必须原冻结值；reconcile允许原dispatchplan同target但不改原effectintent | mismatch/planmissing blocked，no private map/rescan |

#### 完整输出schema

返回ExecutionResult<NoticeJobReport>；本族Report是完整MarketJobReport别名，逐itemtarget/outcome/failure/bases/intent/cursor和work/fence/audit/spawnedwork均保留。

### NoticeJobReport

```rust
/// Provides the documented local NoticeJobReport carrier.
pub type NoticeJobReport = MarketJobReport;
```

归属：contracts；完整字段schema见Step6 shared_types MarketJobReport与Step8 sharedsurface，不能删逐项结果


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 每次boundedbatch完整report accepted保存同state/audit/spawnedworkUoW；unknown外effect保留原intent和probe责任，不把Reported当ready。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


### ReconcileNotice

#### 用途与完整入口

| 项 | 契约 |
|---|---|
| 函数签名 | `pub async fn reconcile_notice(&self, request: JobEnvelope<ReconcileNoticeRequest>) -> Result<ExecutionResult<NoticeJobReport>, MarketError>` |
| transport | worker-internal reconcile_notice |
| 处理方 | MarketplaceApplication<P> / withdrawal_notice / planned reconcile_notice.rs |
| caller | trustedworker system/operator，非Web/公开HTTP |
| 目标能力 | 原noticeprobe formalnotcommitted可safe原intent恢复；无fake delivery |

#### 请求schema与构造来源

### ReconcileNoticeRequest

```rust
/// Carries ReconcileNoticeRequest with explicit sources and no upstream body.
pub struct ReconcileNoticeRequest {
    /// Carries notice_ref; see the source and invariant table.
    pub notice_ref: NoticeIntentRef,
    /// Carries work_ref; see the source and invariant table.
    pub work_ref: DeferredWorkRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| notice_ref | `NoticeIntentRef` | 协议body明确typed候选/本地意图，owner/class/refs经formalport/currentdisclosure，非qualified断言 |
| work_ref | `DeferredWorkRef` | durableworkbody与context.fence.work_ref一致；不会来自URL/任意cron字符串 |

归属：contracts；internal only冻结plan/selector/target一致；batch非空有上限，缺planblocked

| DTO来源 | Domain / read / Job构造 | 缺失/错kind行为 |
|---|---|---|
| Requestbody上述完整字段 | 原noticeprobe formalnotcommitted可safe原intent恢复；无fake delivery；ID由IdGeneratorPort，basis/source/material/authority原typed读取或formalport，不由bodyqualified | reject InvalidInput/Missing；unsafe/body/wrongkind拒绝；formal缺口ContractBlocked |
| context.request + fence | CoreContextRecord保存唯一meta/key/actor；operationkind由本typedmethod固定；fingerprint含业务body | missingkey拒绝；samekeydiffintent IdempotencyConflict |
| 冻结work/plan | load_work + load_plan；bodytarget/work_ref=context.fence.work_ref，维护plan/currentcursor必须原冻结值；reconcile允许原dispatchplan同target但不改原effectintent | mismatch/planmissing blocked，no private map/rescan |

#### 完整输出schema

返回ExecutionResult<NoticeJobReport>；本族Report是完整MarketJobReport别名，逐itemtarget/outcome/failure/bases/intent/cursor和work/fence/audit/spawnedwork均保留。

### NoticeJobReport

```rust
/// Provides the documented local NoticeJobReport carrier.
pub type NoticeJobReport = MarketJobReport;
```

归属：contracts；完整字段schema见Step6 shared_types MarketJobReport与Step8 sharedsurface，不能删逐项结果


二级传递类型authority：Step6 shared_types/runtime_helpers + Step7 typed_ports + [本Step sharedsurface](03_ddd_step_08_shared_surface.md)。复用schema为引用镜像，唯一字段定义在上述来源，不新增同名不同字段类型。receipt/report中的refs与同UoW原记录完全一致，resultkind与operationkind严核，schemaRef=V1仅本地designversion。

#### 失败、幂等与审计

currentactor/disclosure先于originalresultreplay；replay不再factory/ID/业务precheck/dispatch/scan，原完整payload返还；fresh才typedreads/currentformalqualify。 每次boundedbatch完整report accepted保存同state/audit/spawnedworkUoW；unknown外effect保留原intent和probe责任，不把Reported当ready。

单协议停审：body→目标对象/typedport→safe result→同名flow已映射；owner资格缺口不关闭；下一协议仅承接已确定结论。


## 协议族停审

本族所有DTO字段有source/missing规则，response二级types唯一归属，Coremeta/actor/key/page无双承载；无activeevent/ownertruth复制；下一族方可创建。外部exact资格保持blocked，不宣称运行测试通过。


## Step9反向闭环修正

RecordNoticeOutcome仅消费Confirmed正式结果候选；KnownNotCommitted/Unknown由对应Job记录；缺binding不能造正式结果。
