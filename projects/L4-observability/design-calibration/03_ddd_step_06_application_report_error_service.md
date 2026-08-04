# L4-observability 03-详细设计 Step 06 - R06.6-E application report / error / service contract

> 主控文件: `design-calibration/03_ddd_step_06_object_contracts.md`
> 前置专项: `03_ddd_step_06_application_operation_context_idempotency.md`、`03_ddd_step_06_application_stored_result_outbox.md`、`03_ddd_step_06_application_external_effect_intent_tokens.md`、`03_ddd_step_06_application_job_plan_claim_config.md`
> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 06
> 当前模式: full-restart 定向粒度修复
> 当前子批次: `R06.6-E`
> 专项完成状态: `R06.6-E_done_confirmed_historical_checkpoint`
> 当前整体恢复点: 见主控 §6.30 与 R06.8-B；本专项的五 façade checkpoint 已被四 entry façade + private publication collaborator 裁定覆盖

## 1. E 批状态与写入门禁

| 项 | 当前裁定 |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 06 `逐模块定义对象实现契约` |
| 当前模块 | `application::report`、`application::errors`、`application::services` |
| 本批输入 | D-2~D-6 job identity / plan / item / claim / config cards；A/B/C result/outbox/effect cards；Step 07~14 frozen use-sites；Step 12 recovery taxonomy；L1-governance / L1-artifact Step 06 粒度 |
| 本批目标 | historical E 目标为闭合 report 对象、唯一 application error owner、五类 application result carrier、五个 service façade；current façade owner已由 R06.8-B 收敛为四个 entry-callable façade + crate-private publication collaborator |
| 正式回填 | blocked until Step 19；本批不修改正式 `03-详细设计.md` |
| 下游写入 | blocked；Step 07~14 与 `04` 文件只登记 affected-use，不在本批改写 |
| E批执行时上游 blocker（historical） | 当时为`none`；已被下行current H13 blocker判断覆盖 |
| 当前内部 blocker | `03-RPR-S06-GRANULARITY=open`；`R06.6-DISPOSITION-LAYER=superseded_by_R06.7-E_no_generic_entry_layer`；`R06.6-APP-ERROR-OWNER=resolved_in_F2_owner_addendum`；`R06.6-DIGEST-CANONICALIZER=resolved_in_F1_design_only`；`R06-F-AFFECT-UOW-01=open_controlled_downstream` |
| 直接上游 blocker | `R06.6-F2-H13-UPSTREAM=open_controlled`；正式`02`的`DefineReplayScope -> ReplayExecutionRecord`与current H13 per-target accepted input冲突，当前保守边界禁止该Command写H13 |
| 停审门禁 | 本文件的 R06.6-E 历史门禁已被 F1/F2、R06.7-A~E 及 R06.8 消费；current pointer只看主控§6.30/R06.8-B，本文件不授权进入 Step 07 |
| 提交纪律 | 只修改设计仓文档；不需要提交 commit |

### 1.1 本批允许与禁止

| 允许写入 | 禁止写入 |
|---|---|
| 本文件的对象卡、error taxonomy、result carrier、service façade、affected-use register、backfill draft和静态检查记录 | 正式 `03-详细设计.md`、Step 07~19正文、任何 `04` 文件、实现代码、implementation ledger、planned boundary skeleton |
| 对历史类型进行 historical_material / blocker 标记 | 恢复 `ObservationConsumerDisposition`、`ObservationJobDisposition`、`JobFailureReason` 或 `ObservationVisibilityDecision` 为 current owner |
| 固定 application-local 字段、factory、rehydrate、terminal seal和依赖方向 | 伪造实现 commit、真实 run id、真实 evidence alias、验收签署或测试结果 |

## 2. 输入权威与问题回答

### 2.1 输入顺序

| 顺序 | 输入 | 本批用途 | 权威限制 |
|---:|---|---|---|
| 1 | `03_ddd_calibration_flow.md`、`project_execution_ledger.md` | 恢复点、停审门禁、修改范围 | 只承认 current pointer；历史段落不能授权跨批写入 |
| 2 | Step 06 SOP、详细设计书写规范、讨论中间产物规范、真相源闭环标准 | 对象卡最低字段、owner、状态闭环和停审结构 | 标准不替代项目语义 |
| 3 | A/B/C application cards | operation context、stored result、outbox、external token和digest承载关系 | 不重新定义已闭合对象 |
| 4 | D-2~D-6 job cards | plan、item、claim、fence、H12 accepted result和resume约束 | report只能折叠item，不能反向拥有plan/H12 truth |
| 5 | Step 07 frozen carrier / port use-site | 当前 service output和error返回面 | Step 07 use-site不是本批 definition owner；后续须 affected review |
| 6 | Step 08 public outcome / report surface | public mapping boundary | public outcome不回写 application durable state definition |
| 7 | Step 12 recovery taxonomy | error variant的恢复分类和safe-detail边界 | 不把 recovery class当作 retry scheduler |
| 8 | L1-governance / L1-artifact Step 06 | 对象卡粒度和跨层闭环参考 | 不复制相邻域 truth |

### 2.2 SOP 问题回答

| SOP 问题 | E 批回答 |
|---|---|
| application report需要哪些独立对象? | 至少独立闭口 `ProjectionScopeItemOutcome`、`ProjectionScopeItemReport`、`JobReportState`、`ObservationJobReportDraft`、`JobError`；report不是一个泛化 summary。 |
| application error由谁拥有? | 唯一 current owner 是 `application::errors::ApplicationError`。Step 07/12 只消费或映射，不能各自再声明同名 enum。 |
| result carrier如何分层? | `OperationResultDisposition` 是 durable stored-result fact；`JobReportState` 是 durable report lifecycle；五类 façade result carrier 是 application return；C-05 `InboundConsumerCompletion` 是 Consumer transport action；C-08/C-09 是 Job callback complete/failure；Step 08 typed outcome/surface 是 public result。R06.7-E 已证明不需要 generic entry disposition 层。 |
| report如何保证可落码? | report绑定 local `ObservationJobExecutionRef`、`ObservationJobExecutionPlanRef`、plan digest、reservation/result relation和 accepted claim/fence proof；scope/item fold必须对immutable plan lossless，terminal seal前不得声明完成。 |
| 失败原因如何表达? | 使用已有 owner-qualified typed reasons，如 `MaintenanceFailureReason`、`MaintenanceBlockReason`、`PublicationFailureKind`、`ExportFailureReason`、`ReplayBlockReason` 等；禁止 generic `JobFailureReason`、raw message、provider body。 |
| 五个 façade如何分工? | 这是 E 批历史问题。其当时五 façade 回答已被 R06.8-B supersede；current entry-callable façade 只有 `ObservationTruthWriteService`、`ObservationReadService`、`ObservationInboundEventService`、`ObservationOperationsJobService`，publication 是 Job implementation 内部 collaborator。 |

## 3. 历史冲突与当前裁定

| 历史/冻结材料 | 问题 | 当前处理 |
|---|---|---|
| 旧 `ProjectionScopeItemOutcome::Failed { reason: JobFailureReason }` | generic reason无法证明失败来源、恢复分类和公共映射 | 改为 owner-qualified private association；失败 reason必须来自已有 canonical owner |
| 旧 `ObservationJobReportDraft.job_ref: JobRunRef` | `JobRunRef` 无 current owner，且会混淆 public correlation、local execution和真实 runtime run | current report只保存 `ObservationJobExecutionRef`、`ObservationJobExecutionPlanRef`；public correlation单独保存 `JobRunId`；真实 run保持 absent |
| 旧 `ObservationJobReportDraft.failure_reason: Option<JobFailureReason>` | report只有单一失败槽，无法表达逐item/逐scope lossless fold | 删除 generic slot；由逐 item typed outcome、具名 scope report、report-level typed association和derived summary共同承载 |
| Step 07 `ObservationConsumerResult.disposition: ObservationConsumerDisposition` | 历史 enum未决定是 public outcome、durable fact还是transport action | current application carrier不声明该历史 enum；使用 `OperationResultDisposition` 表示已保存事实，public consumer outcome与C-05 transport completion分别由各自层拥有，不存在generic entry disposition |
| Step 07/12 `ApplicationError` 重复声明 | definition/use 交叉，变体可能漂移 | 本批建立唯一 owner；冻结文件后续只做 affected mapping，不复制定义 |
| Step 08 `DuplicateReplayed` | 可能被误写入 durable report state | 仅属于 public `ObservationJobOutcome`；duplicate读取原 stored result/report，不新建或改写 report state |
| `ObservationVisibilityDecision` | application草稿与domain read owner重复 | historical exclusion；canonical owner固定为 `domain::read::ReadVisibilityDecision` |
| `JobReportState` 与 public `ObservationJobOutcome` | 两者都是“job结果”但状态主语不同 | report state只描述一条durable report lineage；public outcome描述一次入口响应；二者通过 mapping 关联，不互换 |

## 4. E 批对象资格与 owner 总账

| 对象 | 资格 | 唯一 current owner | 本批闭口内容 | 不拥有 |
|---|---|---|---|---|
| `ProjectionScopeItemOutcome` | FC | `application::report` | success/failure互斥、typed reason、refs兼容、lossless fold输入 | projection truth、source truth、public outcome |
| `ProjectionScopeItemReport` | FC | `application::report` | one canonical scope one row、rehydrate、idempotent same-value、conflict guard | plan completeness、report terminal state |
| `JobReportItemFoldEntry` | FC | `application::report` | exact plan/work-key、item classification、source CAS version | item state mutation、claim authority |
| `JobReportItemClassification` | FC | `application::report` | non-terminal/terminal total classification与typed outcome保留 | retry scheduling、report lifecycle |
| `JobReportItemSnapshotProof` | FC private | `application::report` | same-UoW item CAS + exact registered item claim tuple | durable authority、commit success |
| `JobReportItemFold` | FC | `application::report` | full plan key coverage、canonical ordering、lossless derived fold | plan/item truth mutation |
| `JobReportFoldSummary` | FC | `application::report` | immutable derived counts/sets、rehydrate equality、read-only accessors | independently persisted counters |
| `JobReportFailureAssociation` | FC private | `application::report` | report-level typed failure与item outcome隔离 | generic error、public protocol code |
| `JobReportState` | FC | `application::report` | `Draft` + 5 terminal states、transition matrix、terminal seal门禁 | public duplicate、claim lifecycle、acceptance verdict |
| `ObservationJobReportDraft` | FC | `application::report` | lineage、digest、fence proof、item fold、terminal methods、no-real-run | H12 record、source/business truth、signoff |
| `JobError` | FC | `application::errors` | report mutation-only error、精确 variant、mapping输入 | public protocol code、raw adapter error |
| `ApplicationError` | FC | `application::errors` | unified application/port error family、safe-detail、recovery mapping | HTTP/RPC numeric code、raw provider body |
| `ObservationCommandResult` | FC | `application::services` | exact fields、stored-result relation、disposition boundary | public command outcome、entry action |
| `ObservationQueryResult<T>` | FC | `application::services` | read-only surface组合、missing/freshness/degraded约束 | query write、stored result、visibility authority |
| `ObservationConsumerResult` | FC | `application::services` | local stored receipt/result relation、typed disposition boundary | public consumer outcome、ack/dead-letter action |
| `ObservationJobResult` | FC | `application::services` | report/result/fold refs relation | public job outcome、real run/evidence |
| `ObservationPublicationBatchResult` | FC | `application::services` | scanned/published/retryable/failed/dead-lettered sets与互斥；仅作 publication Job 内部 fold | publication state owner、scheduler policy、entry façade result |
| 历史五 façade checkpoint | superseded | current owner见 R06.8-B §§5~7 | 旧 dependency inventory可作统一 Operations Job constructor输入 | 不得恢复 maintenance/publication 双 façade或worker publication入口 |

## 5. 当前结果与入口动作语义边界

### 5.1 Layer matrix

| 层 | current type | 主语 | 是否 durable | 允许表达 | 禁止表达 |
|---|---|---|---:|---|---|
| stored-result fact | `OperationResultDisposition` | 一份已保存 exact replay surface | 是，随 `StoredObservationResult` | `Accepted`、`Rejected`、`Quarantined`、`NoOp`、`Blocked` | duplicate、in-flight、ack、retry、job lifecycle |
| report lifecycle | `JobReportState` | 一条 local job report lineage | 是 | `Draft`、`Completed`、`PartiallyCompleted`、`FailedRetryable`、`FailedPermanent`、`Blocked` | `DuplicateReplayed`、external run、验收签署 |
| application return carrier | `ObservationCommandResult`、`ObservationQueryResult<T>`、`ObservationConsumerResult`、`ObservationJobResult`；publication batch只作 Operations Job implementation内部fold | 一次 entry-callable service结果或一次内部publication fold | 通常由 stored result/report关联，但carrier本身不是独立state machine | refs、surface、set、stored disposition | 把publication batch直接暴露给worker/jobs entry、public wire outcome、transport ack/retry、scheduler decision |
| Consumer transport completion | C-05 `InboundConsumerCompletion` | 一次 Consumer callback 的明确 transport action | 否 | typed receipt + acknowledge/retry/dead-letter action | application durable result、public outcome、generic default branch |
| Job callback | C-08 `ObservationJobInvocationResult` / C-09 `ObservationJobInvocationFailure` | 一次完整或未完整的 Job invocation | 否 | typed response wrapper或Protocol/Application failure，二者互斥 | durable report/result mint、generic entry classification |
| public protocol | `ObservationCommandOutcome`、`ObservationConsumerOutcome`、`ObservationJobOutcome`及query surface | 一次对外协议响应 | 由stored surface/replay relation支持，不拥有 durable state | `Duplicate`/`Delayed`/`DeadLettered`/`DuplicateReplayed`等协议语义 | application private fields、raw errors、claim/fence |

### 5.2 不可互换规则

1. 同 digest duplicate返回原 `StoredObservationResult.disposition()`，不生成 `Duplicate` disposition row。
2. `JobReportState::Draft` 在 report finalize 前不能映射为 public `Completed`。
3. public `ObservationJobOutcome::DuplicateReplayed` 只说明入口重放；原 report 的 state保持不变。
4. `ObservationConsumerResult` 不能携带历史 `ObservationConsumerDisposition`；ack、dead-letter和runtime failure由 C-05 exact completion mapping处理，不经过 generic disposition。
5. `ObservationPublicationBatchResult` 的失败集合只表示本批 publication处理分类，不改变原 command/consumer stored result。
6. query surface 的 not-visible/stale/missing/rebuilding不是 `ApplicationError` 的自动替代，也不能触发 query-side repair。

## 6. `ProjectionScopeItemOutcome` 对象卡

### 6.1 Rust-facing definition

```rust
/// Exact local classification for one canonical projection scope item.
pub enum ProjectionScopeItemOutcome {
    /// The derived projection and its diagnostic composite committed together.
    Succeeded {
        read_model_ref: ObservationReadModelRef,
        diagnostic_view_ref: DiagnosticViewRef,
    },

    /// The item did not produce a successful local projection result.
    Failed {
        reason: ProjectionScopeFailureReason,
        gap_refs: GapStateRefSet,
    },
}
```

`ProjectionScopeFailureReason` 是 `application::report` 的 private tagged alias over existing owner-qualified reasons，不是 generic error enum：

```rust
enum ProjectionScopeFailureReason {
    Maintenance(MaintenanceFailureReason),
    Blocked(MaintenanceBlockReason),
    Diagnostic(DiagnosticUnavailableReason),
    Stale(StalenessReason),
}
```

若某个未来失败原因没有 canonical owner，不能添加 `Other(String)`；必须先登记新的 owner/blocker并暂停对应 flow。`ProjectionScopeFailureReason` 只用于 report item，不暴露为 public protocol type。

### 6.2 字段与互斥约束

| 字段/variant | 来源 | 约束 |
|---|---|---|
| `scope`（由外层 report 保存） | `ObservationProjectionScope` canonical input | 一个 report lineage中同一 canonical scope只能有一行 |
| `Succeeded.read_model_ref` | 同一受保护 UoW 的 projection replacement | 必须与 scope匹配；不可由 current query重建 |
| `Succeeded.diagnostic_view_ref` | 同一受保护 UoW 的 diagnostic composite replacement | 必须与对应 read model / scope relation兼容 |
| `Failed.reason` | existing owner-qualified typed reason | success refs与failure reason互斥；不存 raw body/message |
| `Failed.gap_refs` | accepted gap / stale / blocked marker refs | 空集合表示没有独立 gap marker，不代表完整性证明 |

### 6.3 Factory、比较与测试切口

| member | exact contract |
|---|---|
| `try_succeeded(read_model_ref, diagnostic_view_ref, scope) -> Result<Self, ApplicationError>` | 校验两个 ref 与 scope 的 canonical relation；只构造不写库 |
| `try_failed(reason, gap_refs) -> Result<Self, ApplicationError>` | canonical sort/dedup refs；reason必须是已有 owner variant |
| `try_rehydrate(persisted_fields...) -> Result<Self, ApplicationError>` | 与 create相同验证；不读 current projection/source |
| `is_success()` / `is_failure()` | 纯读；不推导 report state |
| `same_value_as(other)` | variant、typed reason、refs逐字段相等才返回 true |

必须验证：success/failure字段互斥、同scope同值重放为 no-op、同scope不同值为 `JobError::ScopeClassificationConflict` 输入、未知 reason/schema fail closed。

## 7. `ProjectionScopeItemReport` 对象卡

### 7.1 Rust-facing definition

```rust
/// One durable classification row for one canonical projection scope.
pub struct ProjectionScopeItemReport {
    work_key: ObservationJobWorkKey,
    scope: ObservationProjectionScope,
    outcome: ProjectionScopeItemOutcome,
}
```

### 7.2 Factory与成员

| member | exact contract |
|---|---|
| `try_new(work_key, scope, outcome) -> Result<Self, JobError>` | 校验work key与projection scope material相容、scope canonical encoding与outcome compatibility；不写库 |
| `try_rehydrate(work_key, scope, outcome) -> Result<Self, JobError>` | 持久化映射器使用；拒绝非canonical scope、错误 owner或缺失work-key关联 |
| `work_key(&self) -> &ObservationJobWorkKey` | 返回产生该scope row的immutable plan item key；只读 |
| `scope(&self) -> &ObservationProjectionScope` | 只读 canonical scope |
| `outcome(&self) -> &ProjectionScopeItemOutcome` | 只读 outcome |
| `same_value_as(&self, other) -> bool` | `work_key.canonical_bytes()`、canonical scope和outcome逐字段相等；不能只比较scope或ref集合 |
| `validate_against_item(&self, work_key: &ObservationJobWorkKey, item: &ObservationJobPlanItem) -> Result<(), JobError>` | 校验scope row只能来自同一 terminal item 的 typed outcome；不直接修改 item fold，不丢reason或覆盖另一scope |

### 7.3 Durable uniqueness

repository key为 `(report_ref, work_key.canonical_bytes(), canonical_scope_bytes)`，并对每个 report 的 canonical scope建立唯一约束。`work_key` 是显式来源关联，不是 plan item identity 的替代 owner；同一 key 的 work key、scope、outcome 全相同可作为 idempotent no-op，任一字段不同必须拒绝。report assembler仍须证明该 key 属于 immutable plan且 outcome 与 terminal item snapshot逐字段相等。

## 8. `JobReportItemFold` 逐 item 无损折叠载体

### 8.1 载体职责与 owner 边界

`JobReportItemFold` 是 `application::report` 持有的 report snapshot，不是 `ObservationJobPlanItem` 的第二个 state owner。它在 item CAS 成功后复制一份不可变、可持久化、可重放的分类结果；item 的当前 state/outcome 仍由 `application::jobs::ObservationJobPlanItem` 权威拥有。report 不能通过 fold entry 修改 item，也不能从 fold entry 反向重建计划。

为了使失败、阻断和中途停止的报告可审计，fold 必须覆盖 immutable plan 的全部 `work_key`，而不是只保存成功/失败计数或几个 ref set。尚未取得终态的 item 也必须有 entry，且只能保存为 `Pending` 或 `Running` 观察快照；它绝不能被折叠成成功、失败或跳过。

### 8.2 Rust-facing definition

```rust
/// One lossless report snapshot for one planned work key.
pub struct JobReportItemFoldEntry {
    plan_ref: ObservationJobExecutionPlanRef,
    work_key: ObservationJobWorkKey,
    classification: JobReportItemClassification,
    snapshot_proof: JobReportItemSnapshotProof,
}

/// Proof attached to one fold entry. Initial plan entries use plan material;
/// item reclassification entries require the exact item claim and CAS proof.
enum JobReportItemSnapshotProof {
    PlanMaterialized {
        plan_row_version: ObservationRepositoryVersion,
    },
    ItemCas {
        item_row_version: ObservationRepositoryVersion,
        claim_ref: ObservationExecutionClaimRef,
        plan_ref: ObservationJobExecutionPlanRef,
        subject: ObservationExecutionClaimSubject,
        owner_ref: ObservationClaimOwnerRef,
        fencing_token: ObservationFencingToken,
        claim_row_version: ObservationRepositoryVersion,
    },
}

/// The report's observed classification for one item at fold time.
pub enum JobReportItemClassification {
    /// The item has not reached a terminal item state.
    Pending {
        state: ObservationJobPlanItemState,
    },
    /// The item has a terminal state and its complete typed outcome is retained.
    Terminal {
        state: ObservationJobPlanItemState,
        outcome: ObservationJobPlanItemOutcome,
    },
}

/// Complete, canonical, replayable classification collection for one plan.
pub struct JobReportItemFold {
    plan_ref: ObservationJobExecutionPlanRef,
    entries: Vec<JobReportItemFoldEntry>,
}

/// Immutable values derived from the complete item fold.
pub struct JobReportFoldSummary {
    planned_item_count: u32,
    terminal_item_count: u32,
    pending_item_count: u32,
    succeeded_count: u32,
    skipped_count: u32,
    retryable_failure_count: u32,
    permanent_failure_count: u32,
    blocked_count: u32,
    pending_work_keys: Vec<ObservationJobWorkKey>,
    affected_refs: BodyFreeRefSet,
    failed_refs: BodyFreeRefSet,
    gap_refs: GapStateRefSet,
    progress_refs: BodyFreeRefSet,
}
```

`Pending.state` 只允许 `Planned` 或 `Running`；`Terminal.state` 只允许 `Succeeded`、`FailedRetryable`、`FailedPermanent`、`Blocked` 或 `SkippedTerminal`，并要求 outcome 与 D-3 total compatibility matrix 相容。`JobReportItemSnapshotProof` 的 item row version 与 claim row version 必须分别来自各自 repository 的 versioned read；它们不是 fencing token，也不能替代 commit-time 联合 CAS / fence validation。`subject` 必须是与 `work_key` 和 `plan_ref` 相容的 item claim subject。

### 8.3 Fold factory、rehydrate 与 derived summary

| member | exact contract |
|---|---|
| `try_new(plan_ref, planned_keys, item_snapshots) -> Result<Self, JobError>` | 要求每个 plan item 恰好一个 entry；按 `ObservationJobWorkKey` canonical bytes 排序；拒绝重复、缺失、非本 plan key或 item state/outcome不兼容 |
| `try_rehydrate(plan_ref, planned_keys, persisted_entries) -> Result<Self, JobError>` | 只从持久化 entry恢复并校验 plan identity、key set、classification、typed outcome和 snapshot proof；不 relist、不读取 current truth |
| `record_snapshot(snapshot: JobReportItemFoldEntry) -> Result<(), JobError>` | 仅在 report 为 `Draft` 且 snapshot 的 exact item claim/CAS proof已通过时调用；同 key、classification、proof全相同为 no-op，任何 proof或内容差异均为 conflict |
| `entry(work_key) -> Option<&JobReportItemFoldEntry>` | canonical key lookup；只读 |
| `is_lossless_for(plan) -> bool` | `plan_ref` 相等、plan key集合与entry key集合完全相同，且每个 entry 的 work-key/material relation已经由 source item校验 |
| `plan_ref()` / `entries()` | 返回不可变 plan identity和按canonical key排序的entry视图；不暴露可变 vector |
| `planned_item_count()` / `terminal_item_count()` / `pending_item_count()` | 从entry集合派生 cardinality；不是独立可写字段 |
| `terminal_count()` / `pending_count()` | 从 entries 计算；不是可独立写入的计数 |
| `affected_refs()` / `failed_refs()` / `gap_refs()` / `progress_refs()` | 从每个 terminal outcome 的完整 typed ref sets canonical fold；不丢弃 association/reason |
| `failure_counts()` | 返回 `retryable`、`permanent`、`blocked`、`skipped` 的派生计数；不把 pending计入任一失败或成功桶 |
| `pending_work_keys()` | 返回所有 `Pending` entry 的 canonical key set，作为未完成 accounting；不得隐式清空 |
| `summary()` / `derived_summary()` | 返回由entries即时计算的 `JobReportFoldSummary`；不提供独立 mutable counter |
| `same_value_as(other)` | entries 的 key、classification、typed outcome和snapshot proof逐项相等才为 true |

`JobReportFoldSummary` 不是独立 durable truth。它必须提供 `from_fold(fold) -> Self`、`try_rehydrate(persisted_fields...) -> Result<Self, JobError>`、`validate_against(fold) -> Result<(), JobError>`、所有 count/ref/key-set 的只读 accessor 以及 `same_value_as(other) -> bool`。`try_rehydrate` 只允许恢复 read surface 或缓存中的已存派生值，必须重新对照 `JobReportItemFold`；任何不一致都返回 `JobError::ReportInvariantViolation`，不能用 persisted summary 修补 fold。

### 8.3.1 Snapshot proof applicability

`record_snapshot` 对两类 `JobReportItemSnapshotProof` 有不同的适用范围，不能把两类 proof 当成可互换的版本字段：

| proof | 允许的来源与用途 | 禁止的替代用途 |
|---|---|---|
| `PlanMaterialized { plan_row_version }` | 仅用于 report 初始 materialization；从已提交 immutable plan 为每个 `work_key` 建立一个 `Pending { state: Planned }` entry。该 proof 证明计划行已读到的版本，不证明 item 已执行或已获得 claim。 | 不得用于 terminal outcome、`Running` 观察快照、item CAS 更新或 claim/fence authority；不能覆盖已经存在的 `ItemCas` entry。 |
| `ItemCas { ... }` | 仅用于 item owner 在 item CAS 成功后提交的 reclassification snapshot；必须同时携带与 `work_key`/`plan_ref` 相容的 exact claim tuple、item row version 和 claim row version。可在 `Draft` 中替换同 key 的旧观察快照。 | 不得由 plan row version、裸 fencing token、`JobRunId` 或 current read 猜造；不能脱离 item CAS / commit-time claim validation 单独证明持久化成功。 |

初始 fold 只接受每个计划 key 恰好一个 `PlanMaterialized` entry；后续 `ItemCas` entry 必须与该 key 的 immutable planned material 相容。相同 key、classification、proof 全相同是幂等 no-op；proof 类型、版本、claim tuple 或分类任一变化时，只有经过新的 item CAS 且 report 仍为 `Draft` 才允许替换，否则返回 conflict/invariant error。

### 8.4 Fold invariants

1. `plan_ref + entries` 是 report 的逐 item source snapshot；`terminal_item_count`、success/failure/gap/progress ref sets和状态计数只能从它派生，不能与 entry collection 并列成为可独立变更的 truth。
2. `Pending` entry 保留实际观测到的 `Planned`/`Running` state；它不表示失败、成功、跳过、取消或 claim expiry 的推断。
3. 每个 `Terminal` entry 必须携带完整 `ObservationJobPlanItemOutcome`，包括 typed association、affected/failed/gap/progress refs与 outcome digest；只保存 state 或 counter 均为 invariant violation。`FailedRetryable`、`FailedPermanent`、`Blocked` 的 report-level failure association另由 report 保存，不能塞进 item outcome 的 generic slot。
4. `FailedRetryable` item 在新 attempt 重新进入 `Running` 后，新的 terminal snapshot可以替换当前 fold entry，但旧 attempt evidence必须由 item/history owner保留；report不能把替换解释为删除历史。
5. fold entry 不拥有 source/business truth、H12 record lifecycle、claim lifecycle、external acceptance、real run id、signoff或 evidence alias。

### 8.5 Report-level failure association

report-level failure 可能发生在 candidate materialization、claim/fence、UoW commit、dependency availability 或 finalize validation，而不对应任意一个 item outcome。为避免把这类 failure 错挂到某个 work key，report 保留独立的 private typed association：

```rust
enum JobReportFailureAssociation {
    Maintenance(MaintenanceFailureReason),
    Blocked(MaintenanceBlockReason),
    ReplayBlocked(ReplayBlockReason),
    Persistence(JobReportPersistenceFailure),
}

/// Non-recursive report-level persistence failure carrier.
enum JobReportPersistenceFailure {
    RepositoryUnavailable,
    OptimisticConflict,
    CommitFailed,
    CommitOutcomeUnknown,
    PersistenceInvariantViolation,
    ProjectionAssemblyFailed,
    ProjectionScopeMismatch,
}
```

`JobReportPersistenceFailure` 是 report 内部的有限分类，不复制 `ApplicationError`，也不携带 raw detail；service boundary 再将它映射到唯一 owner 的 `ApplicationError`。它不能递归包含 `ApplicationError::Job(_)`。`JobReportFailureAssociation` 不表示 item outcome、retry scheduler 或 public protocol code，且只能在 report-level `FailedRetryable`、`FailedPermanent` 或 `Blocked` state 下存在。相同 association 的重放为 no-op，变更 association 需要 report 为 `Draft`、current execution claim/fence 和 report CAS。

### 8.6 与 scope report 的关系

`ProjectionScopeItemReport` 是从对应 terminal item outcome派生的 projection-scope view。若一个 plan item包含 scope material，assembler必须证明 scope entry与 fold entry的 `work_key`、outcome refs、typed reason和 digest逐字段相等；scope row不能补造缺失 item，也不能覆盖 item fold。没有 scope item 的 operation 不得为了填充报告而生成空 scope row。Scope row 的持久化由 report repository 在同一 report mutation UoW 中完成，不能先于 item CAS 独立提交。

## 9. `JobReportState` 对象卡

### 9.1 Rust-facing definition

```rust
/// Durable lifecycle of one observation-side job report lineage.
pub enum JobReportState {
    /// Report is mutable while plan items are being classified.
    Draft,
    /// Every planned item is terminal and the lossless fold has no failures or blocks.
    Completed,
    /// Every planned item is terminal and at least one item failed or was blocked.
    PartiallyCompleted,
    /// The report has a retryable failure classification for a later execution attempt.
    FailedRetryable,
    /// The report is terminal for this execution because retry is not valid without input/state repair.
    FailedPermanent,
    /// A formal local guard prevented completion or continued execution.
    Blocked,
}
```

### 9.2 Transition and terminal semantics

| from | operation | required proof | next |
|---|---|---|---|
| new | create | accepted idempotency reservation、committed plan、report lineage refs | `Draft` |
| `Draft` | record item/scope classification | current item claim/fence、item CAS、scope uniqueness | `Draft` |
| `Draft` | complete | `item_fold.is_lossless_for(plan)`；每个 entry 为 terminal；无 `FailedRetryable`、`FailedPermanent` 或 `Blocked` item；result/report relation可提交 | `Completed` |
| `Draft` | mark partial | `item_fold.is_lossless_for(plan)`；每个 entry 为 terminal；至少一个 typed failed/blocked classification；fold complete | `PartiallyCompleted` |
| `Draft` | fail retryable | report-level typed failure已分类；允许部分 item 尚为 `Pending`/`Running`；所有未终态 item必须在 fold中显式保留，不得伪造 success | `FailedRetryable` |
| `Draft` | fail permanent | deterministic/invariant/input defect已分类；允许部分 item 尚为 `Pending`/`Running`；report preserves exact classified refs和pending key set | `FailedPermanent` |
| `Draft` | block | policy/retention/no-write/visibility guard已形成 durable block surface；未终态 item保留为 `Pending`/`Running` | `Blocked` |
| any terminal | any mutation | none | reject; no write |

`PartiallyCompleted` 是 durable report classification，不等于“整个 job 可以继续在同一 report 中任意重跑”。后续 retry必须由新 execution/claim按 Step 13 规则决定；原 report保持可审计。

### 9.3 Terminal accounting matrix

| report state | item fold requirement | success/failure counts | pending/unexecuted accounting | allowed interpretation |
|---|---|---|---|---|
| `Completed` | every plan key has `Terminal` entry；all terminal outcomes are successful/equivalent | `succeeded_count + skipped_count == planned_count`; all failure buckets zero | pending set必须为空 | complete local report only; not source/business acceptance |
| `PartiallyCompleted` | every plan key has `Terminal` entry | success/equivalent and all typed failure buckets are derived from entries; at least one failure/block | pending set必须为空 | all planned items classified, some local effects failed/blocked |
| `FailedRetryable` | complete key coverage is required, but entries may be `Pending`/`Running` | counts cover only entries actually classified; pending is never success or failure | `pending_count > 0` is valid and persisted; if zero, report-level retryable failure still needs its typed association | execution/report finalization failed in a retryable way; it does not claim unexecuted item results |
| `FailedPermanent` | complete key coverage is required; entries may be `Pending`/`Running` | counts cover only actual terminal entries; no inferred success for pending | pending key set is persisted and exposed to recovery/audit mapping | execution is terminal for this report because retry is invalid without repair/input change |
| `Blocked` | complete key coverage is required; entries may be `Pending`/`Running` | blocked item counts include only explicit item `Blocked`; report-level block is separate | pending key set is persisted; no item is silently classified as `Blocked` unless its item owner supplied that state | formal guard stopped continuation; no completeness or success claim |

`FailedRetryable`、`FailedPermanent` 和 `Blocked` 的 report-level terminal state 可以在所有 item 都已分类前 seal，但只能在每个 planned key 都有一条 fold entry 后 seal；未执行 item 使用 `Pending`/`Running` entry 显式表示。若没有完整 key coverage，seal 返回 `JobError::ReportInvariantViolation`。这一区分同时避免“少数已执行 item + 计数器”伪造完整报告，也避免把 report-level failure误写成每个 item 都失败。

### 9.4 state members

| member | contract |
|---|---|
| `is_terminal()` | 除 `Draft` 外均为 true；不等于 public response成功 |
| `allows_item_classification()` | 仅 `Draft` 为 true |
| `from_token(token)` | 只接受六个 exact token；unknown/alias/case-fold拒绝 |
| `terminal_outcome_kind()` | terminal时返回 local kind；`Draft`返回None；不得返回 `DuplicateReplayed` |

## 10. `ObservationJobReportDraft` 对象卡

### 10.1 Rust-facing definition

```rust
/// Durable draft and terminal report for one accepted local job execution.
pub struct ObservationJobReportDraft {
    report_ref: JobReportRef,
    execution_ref: ObservationJobExecutionRef,
    plan_ref: ObservationJobExecutionPlanRef,
    job_run_id: JobRunId,
    idempotency_ref: IdempotencyRef,
    request_digest: RequestDigest,
    plan_digest: RequestDigest,
    accepted_claim: Option<ObservationReportClaimProof>,
    state: JobReportState,
    item_fold: JobReportItemFold,
    scope_items: Vec<ProjectionScopeItemReport>,
    report_failure: Option<JobReportFailureAssociation>,
    report_digest: DigestSummary,
}
```

`ObservationReportClaimProof` 是 `application::report` 的 private immutable carrier，必须保存 D-5 exact tuple 的 report-use relation：`claim_ref`、`plan_ref`、`subject=Execution(execution_ref)`、`owner_ref`、`fencing_token`、`state=Active`、authority lease boundary与current claim row version。它不是新的 claim authority；commit时仍需向 claim store重新验证。该 proof 必须提供 `try_from_claim(claim, expected_plan, expected_subject) -> Result<Self, JobError>`、`try_rehydrate(fields...) -> Result<Self, JobError>`、`validate_commit_authority(current_claim) -> Result<(), JobError>` 和只读 accessor；禁止从裸 token 或 `JobRunId` 构造。

### 10.2 字段来源与安全边界

| 字段 | source / owner | invariant |
|---|---|---|
| `report_ref` | `application::jobs` report id generator | independent report identity；不由 job_run_id/plan digest派生 |
| `execution_ref` | D-2 accepted local execution | 必须与plan和reservation lineage一致 |
| `plan_ref` | D-2/D-4 committed immutable plan | plan必须已提交；不可替换 |
| `job_run_id` | `core_contracts::metadata::JobRunId` public correlation | 只作相关性字段；不是真实 runtime run；不进入 plan/result digest |
| `idempotency_ref` | A-batch reservation | report result/reservation finalize关系；不可用report ref替代 |
| `request_digest` | accepted operation context | 必须等于 reservation digest；canonicalizer实现留 F |
| `plan_digest` | D-4 plan | 覆盖operation/request/config/item material；不含claim/fence/report state |
| `accepted_claim` | D-5 successful claim acquire | optional只在需要受保护report mutation时存在；不能由裸token构造 |
| `item_fold` | all plan item current classifications | 必须覆盖每个 plan work key；entry collection是逐item source snapshot，summary由fold派生 |
| `scope_items` | one-row-per-scope accounting derived from item fold | canonical sorted/unique；不能作为plan item的替代来源或独立成功来源 |
| `report_failure` | report-level failure/block association | 仅允许在 `FailedRetryable`、`FailedPermanent`、`Blocked`；不能替代 item outcome 或 pending key set |
| `report_digest` | validated report field material | 当前只要求携带已验证 digest；通用 canonicalizer留 F |

### 10.3 Factory / rehydrate / inspection

| member | exact contract |
|---|---|
| `try_new(report_ref, plan, reservation, job_run_id, now) -> Result<Self, ApplicationError>` | 只接受已获批 reservation、已提交 plan relation；建立 Draft、包含全量 plan work-key 的 `Pending` fold和lineage；不伪造claim或terminal result |
| `try_rehydrate(persisted_fields...) -> Result<Self, ApplicationError>` | 校验所有 identity/digest/state/fold/scope/failure关系；planned count只能由fold与immutable plan重新计算；不读取current config/source来补字段 |
| `accept_claim(proof) -> Result<(), JobError>` | 只接受与execution/plan相等、Active且更高/相容的 proof；不把token单独提升为authority |
| `record_scope_item(item) -> Result<(), JobError>` | 同scope同值no-op；不同值conflict；只在Draft且item fold已有匹配 terminal classification时允许 |
| `record_item_snapshot(snapshot: JobReportItemFoldEntry) -> Result<(), JobError>` | 将一条 `work_key -> Pending/Running/Terminal` snapshot写入完整 fold；必须带 source item 的 exact claim/CAS validation result；禁止从current truth猜结果 |
| `record_item_outcome(item) -> Result<(), JobError>` | 兼容旧调用名的窄 wrapper；只接受已验证 terminal `ObservationJobPlanItem` snapshot，并委托 `record_item_snapshot`；不得直接写 summary |
| `seal_completed() -> Result<(), JobError>` | 要求完整 key coverage、每个 entry terminal、无 failed/permanent/blocked bucket；只改变report state，不提交UoW |
| `seal_partial() -> Result<(), JobError>` | 要求完整 key coverage、每个 entry terminal且存在 typed failed/permanent/blocked classification；只改变state |
| `seal_failed_retryable(reason: JobReportFailureAssociation) -> Result<(), JobError>` | 要求完整 key coverage；允许 pending entries；保存外围 typed failure association和pending key set；不得伪造未执行items为success |
| `seal_failed_permanent(reason: JobReportFailureAssociation) -> Result<(), JobError>` | 要求完整 key coverage；允许 pending entries；保留确定性失败 refs和未终态 entry；不删除既有item classification |
| `seal_blocked(reason: JobReportFailureAssociation) -> Result<(), JobError>` | 要求完整 key coverage；允许 pending entries；保留block/gap refs；不得生成forbidden ref或signoff |
| `validate_against_plan(plan) -> Result<(), JobError>` | identity、digest、fold key/cardinality和scope relation逐项校验；不接受独立计数字段作为证明 |
| `derived_summary() -> JobReportFoldSummary` | 从 `item_fold` 计算 counts/ref sets/pending keys；返回不可变 summary，不写回独立 truth |
| `report_failure() -> Option<&JobReportFailureAssociation>` | 只读外围 failure association；不映射为 item failure |
| `fold_digest_material(&self, out)` | 输出当前已验证字段；不定义 F 批 canonical encoding profile |

### 10.4 report invariants

1. `report_ref`、`execution_ref`、`plan_ref`、`idempotency_ref`是四个独立 typed identity；不得互相转换或复制 bytes。
2. `job_run_id`只能作为 public correlation；不得被写成 `JobRunRef`、external run alias或evidence alias。
3. report必须由 immutable plan 的全量 work-key 集合和 item current classifications lossless fold生成；report不能反向补缺失item、重建plan或覆盖item outcome。
4. terminal state一旦持久化不可回到 Draft；duplicate replay读取原report，不新增状态。
5. report mutation必须在 exact claim proof、report row CAS、plan digest和item compatibility都通过时提交；stale proof零写入。
6. report不拥有 source/business truth、H12 record lifecycle、external acceptance、final verdict、signoff或测试结果。
7. 任何 report-level terminal failure 都必须保留 `item_fold.pending_work_keys()` 和已分类 entry；不得以派生计数差值替代 work-key 集合。
8. `report_failure` 与 item outcome association 分离；report-level failure 不增加、不修改、不覆盖任一 item entry。

## 11. `JobError` 对象卡

### 11.1 Rust-facing definition

```rust
/// Application-local failure while mutating one durable job report.
pub enum JobError {
    /// A report identity required by the current phase is absent.
    MissingReportReference,
    /// A requested report lifecycle transition is not allowed.
    InvalidReportTransition,
    /// One canonical scope was classified with incompatible outcomes.
    ScopeClassificationConflict,
    /// A report does not match its immutable plan or lineage.
    ReportPlanMismatch,
    /// Report item counts, ref sets, or terminal fields are inconsistent.
    ReportInvariantViolation,
    /// A current claim proof is absent or no longer authoritative.
    ReportFenceConflict,
}
```

`JobError` 的 owner 是 `application::errors`，但它只由 `application::report` 产生。它不能直接穿过 api/worker/jobs 成为 public code；由 `ApplicationError::Job(JobError)` 包装后，按调用上下文映射到 Step 08 outcome/report surface。

### 11.2 recovery mapping

| variant | recovery class | application action |
|---|---|---|
| `MissingReportReference` | `RetryAfterInputChange` 或 `ManualIntervention`（若应有的durable row缺失） | pre-commit输入缺失可拒绝；已承诺lineage缺失必须fail closed |
| `InvalidReportTransition` | `DoNotRetrySameInput` | 不写；调用方必须改变report phase或读取原terminal状态 |
| `ScopeClassificationConflict` | `ManualIntervention` | 不覆盖原scope row；保留consistency defect |
| `ReportPlanMismatch` | `ManualIntervention` | 禁止从current plan/report重建digest或item |
| `ReportInvariantViolation` | `ManualIntervention` | 不生成terminal success；等待repair/分类 |
| `ReportFenceConflict` | `RetryAfterReload` 或 `RetryAfterStateChange` | rollback/reload fresh claim/report/item；不得复用旧proof |

## 12. `ApplicationError` 唯一 owner与safe-detail contract

### 12.1 Owner and representation

唯一声明位置为 `application::errors::ApplicationError`。所有 application façade、repository/resolver/publisher/delivery/UoW port以此类型作为内部错误边界；infra adapter的provider-specific error必须在adapter内部立即映射。

```rust
/// Finite application-internal invariant failures while planning or assembling mandatory records.
pub enum RecordAssemblyFailureKind {
    /// A record-bearing plan contained no current record obligation.
    EmptyObligationSet,
    /// The obligation set exceeded the compile-time UoW safety ceiling.
    ObligationLimitExceeded,
    /// Records or cursor followers were planned without an accepted primary mutation.
    MissingPrimaryMutation,
    /// An accepted branch required a record family for which no obligation was supplied.
    MissingMandatoryObligation,
    /// An obligation was supplied for a family absent from the accepted branch expectation.
    UnexpectedMandatoryObligation,
    /// The same typed record identity appeared more than once in one plan or batch.
    DuplicateRecordRef,
    /// Two followers reused a record, event, payload snapshot, result, item, or reservation identity.
    DuplicateFollowerIdentity,
    /// The cursor-dependent primary inventory did not match its exact obligation.
    CursorDependentPrimaryMismatch,
    /// A planned cursor-dependent domain member unexpectedly returned no transition.
    CursorDependentMutationProducedNoTransition,
    /// The follower plan differed from the accepted operation's mandatory write set.
    FollowerPlanMismatch,
    /// Primary writes and requested record families could not share one commit class.
    IncompatibleWriteFamily,
    /// The assigned tagged cursor did not match the derived commit class.
    CursorNamespaceMismatch,
    /// A concrete record did not retain the batch's exact tagged cursor.
    RecordCursorMismatch,
    /// Materialized item family, count, identity, or slot differed from the validated plan.
    AssembledItemMismatch,
}

/// Unified application and port error classification for observability.
pub enum ApplicationError {
    InvalidRequest,
    InvalidPageCursor,
    UnsupportedSchemaVersion,
    SuppliedDigestProfileUnsupported,
    SuppliedDigestMismatch,
    DigestMaterialEncodingFailed,
    PersistedDigestProfileUnreadable,
    PersistedDigestMismatch,
    OwnedStateNotFound,
    Domain(DomainError),
    IdempotencyConflict,
    IdempotencyInFlight,
    CompletedReservationResultMissing,
    StoredResultKindMismatch,
    InvalidStateTransition,
    ReservedTransition,
    OptimisticConflict,
    ExecutionFenceConflict,
    RepositoryUnavailable,
    ReferenceUnavailable,
    ResolverUnavailable,
    PublisherUnavailable,
    DeliveryUnavailable,
    AdapterDisabled,
    SerializationFailed,
    CursorAllocationFailed,
    CommitFailed,
    CommitOutcomeUnknown,
    RollbackFailed,
    RecordAssemblyInvariantViolation(RecordAssemblyFailureKind),
    OutboxInvariantViolation,
    OutboxPayloadMissing,
    OutboxPayloadCorrupt,
    ProjectionAssemblyFailed,
    ProjectionScopeMismatch,
    ProjectionFreshnessMarkerMismatch,
    ProjectionIndexCorrupt,
    RebuildProgressLinkMissing,
    RebuildMaintenanceLinkMissing,
    RebuildTargetBindingMissing,
    MaintenanceTargetMissing,
    MaintenanceTargetBindingMissing,
    MaintenanceTargetBindingConflict,
    ReplayScopeMissing,
    JobReportMissing,
    MaintenanceIncomplete,
    EvidenceIndexInputMismatch,
    DiagnosticCompositeCorrupt,
    PersistenceInvariantViolation,
    ExternalDeliveryFailed,
    ExternalFinalizeUnknown,
    NoWritePersistenceFailed,
    Job(JobError),
}
```

### 12.2 variant groups and recovery

| group | variants | default recovery | note |
|---|---|---|---|
| input / protocol handoff | `InvalidRequest`、`InvalidPageCursor`、`UnsupportedSchemaVersion` | input change / same-input禁止 | UoW前处理；不写success副作用 |
| digest admission | `SuppliedDigestProfileUnsupported`、`SuppliedDigestMismatch` | `DoNotRetrySameInput` | 本地从validated typed material计算；不采用caller digest，不进入reserve/UoW |
| digest consistency | `DigestMaterialEncodingFailed`、`PersistedDigestProfileUnreadable`、`PersistedDigestMismatch` | `ManualIntervention` | 不raw-serde fallback、不以current profile/truth覆盖旧值、不继续replay/resume/publish |
| idempotency / replay | `IdempotencyConflict`、`IdempotencyInFlight`、`CompletedReservationResultMissing`、`StoredResultKindMismatch` | conflict/state-change；missing/mismatch为manual | duplicate只replay immutable result |
| domain / state | `Domain(_)`、`InvalidStateTransition`、`ReservedTransition` | state/input change | 不由application重写domain truth |
| concurrency | `OptimisticConflict`、`ExecutionFenceConflict` | reload / state change | exact claim tuple与row CAS分别校验 |
| dependency | `RepositoryUnavailable`、`ReferenceUnavailable`、`ResolverUnavailable`、`PublisherUnavailable`、`DeliveryUnavailable`、`AdapterDisabled` | dependency recovery / state change | 不伪造provider结果 |
| transaction | `SerializationFailed`、`CursorAllocationFailed`、`CommitFailed`、`CommitOutcomeUnknown`、`RollbackFailed` | manual或probe | ambiguous outcome不得盲重试 |
| record assembly invariant | `RecordAssemblyInvariantViolation(RecordAssemblyFailureKind)` | rollback + manual implementation/design diagnosis | 14个finite kind只表示mandatory record/UoW plan不变量；不得降级为accepted no-op、best-effort audit或public caller error |
| outbox / projection consistency | `Outbox*`、`Projection*`、`Rebuild*`、`DiagnosticCompositeCorrupt`、`PersistenceInvariantViolation` | manual intervention | fail closed；不从current truth修补immutable row |
| maintenance / report | `MaintenanceTarget*`、`ReplayScopeMissing`、`MaintenanceIncomplete`、`JobReportMissing`、`Job(_)` | state change/reload/manual | report不能伪造complete |
| external finalize | `ExternalDeliveryFailed`、`ExternalFinalizeUnknown` | finalize-only/probe | 不重复已可能完成的external call |
| no-write | `NoWritePersistenceFailed` | manual intervention | attempted forbidden write remains blocked |

### 12.3 safe-detail rules

`ApplicationError` enum不携带 raw message、SQL/driver code、provider body、stack trace、secret、endpoint、source body、credential或未脱敏路径。调用方需要的诊断上下文只能由外围 typed safe context承载，例如 `BodyFreeRef`、`GapStateRef`、`ObservationTransactionRef`、`TraceCorrelationRef`或受控 error issue ref；这些上下文不改变 variant。

同一 variant在不同入口的 public mapping由 `(operation family, current durable phase, variant)` 决定，不能建立无上下文的一对一 HTTP/RPC shortcut。Query 的 not-visible/stale/missing/rebuilding/disabled优先作为 `ObservationQueryResult<T>` surface返回，只有 malformed input、repository failure或persisted invariant才返回 `ApplicationError`。

### 12.4 W3 digest-specific extension

`R06.6-F1-W3` 增加的五个 variant 已进入上方唯一 enum，不能在 `application::digest`、Step 07、Step 12、API、worker或jobs复制一个 `DigestError` public family。其 exact producer、safe `DigestFailureContext` 和 profile-aware验证顺序由 `03_ddd_step_06_application_digest_canonicalizer.md` §§7.24~7.26负责。

| variant | safe public / entry interpretation | prohibited detail or fallback |
|---|---|---|
| `SuppliedDigestProfileUnsupported` | invalid/unsupported request profile；same input不得继续 | profile之外的raw digest、request body、自动fallback至v1 |
| `SuppliedDigestMismatch` | caller material完整性冲突；pre-mutation reject | expected/actual value、canonical bytes、把mismatch当idempotency durable state |
| `DigestMaterialEncodingFailed` | internal consistency defect；operations-visible manual classification | raw serde/debug retry、dependency unavailable、generic message parsing |
| `PersistedDigestProfileUnreadable` | retained material reader缺失；manual consistency stop | 让caller换digest、current profile重算、silent skip old row |
| `PersistedDigestMismatch` | immutable material/digest不一致；manual consistency stop | 覆盖stored digest、从current truth修补、继续publish/replay/finalize |

外围 `DigestFailureContext` 只能携带 finite material kind、failure stage和可选profile version，不携带expected/actual digest或raw material。Step 12只建立上述variant到`ObservationRecoveryClass`的total mapping；Step 15只消费safe context，不改变错误分类。

### 12.5 F2 record-assembly error extension

`RecordAssemblyFailureKind`与`ApplicationError::RecordAssemblyInvariantViolation`的唯一 owner 是本节的`application::errors`。F2 assembler只能构造上列14个finite variant；它不得解析`DomainError`、repository/provider message或序列化文本来选择variant。domain factory拒绝仍映射`ApplicationError::Domain`，cursor allocator失败仍映射`CursorAllocationFailed`，append/save/commit失败仍保留其transaction/repository分类，`CommitOutcomeUnknown`也不得伪装成assembly rollback。

该wrapper不携带record ref、cursor数值、expected/actual family集合、raw transition、provider文本或序列化material。安全运行时上下文若需要定位，只能在外围记录operation family、finite assembly stage和body-free transaction/correlation ref；Step 12后续affected review必须为该wrapper建立total recovery mapping，但当前不修改冻结Step 12。

## 13. Application result carrier 共同规则

### 13.1 `ObservationResultAccess`

`ObservationResultAccess` 是一次 application service 返回中用于说明 stored surface 来源的 process-local carrier。它不是 durable state、public outcome、entry disposition 或 retry decision。

```rust
/// Explains whether an application result was committed now or loaded for replay.
pub enum ObservationResultAccess {
    /// This call committed the exact stored result in its accepted UoW.
    FreshlyCommitted,
    /// This call loaded and validated an already completed stored result.
    Replayed,
}
```

| variant | required relation | forbidden interpretation |
|---|---|---|
| `FreshlyCommitted` | result ref, stored result, reservation completion and owned local side effects were committed by this call | does not mean external delivery or business truth succeeded |
| `Replayed` | result ref points to the original immutable surface; operation/digest/actor/scope were revalidated | does not create a duplicate row, rerun mutation or change report state |

The carrier has no `Duplicate`, `Delayed`, `Conflict`, `InFlight`, `DeadLettered` or `Completed` variant. Those meanings belong to the reservation incoming outcome, public protocol outcome, entry action or durable report state respectively.

### 13.2 Common construction rules

| rule | contract |
|---|---|
| input boundary | Every service input is already a typed application input with a validated `ObservationOperationContext`; raw protocol DTO, raw envelope and provider body do not cross this boundary. |
| `Ok` versus `Err` | `Ok(carrier)` means the carrier's stated local relation is complete and internally validated. Pre-UoW invalid input, unsupported schema, missing required metadata and unresolved application wiring return `Err(ApplicationError)`; the service must not fabricate a result ref. |
| stored result | Command, Consumer and Job `Ok` carriers point to an immutable `StoredObservationResult`. The result kind, operation family, request digest and `OperationResultDisposition` must match the carrier. |
| replay | A replayed carrier is built from the stored surface and its relation checks. It never re-reads mutable truth to rebuild the surface and never appends a new success event. |
| collection fields | `Vec<T>` fields are canonical sorted, duplicate-free typed sets at the application boundary. The vector representation does not authorize arbitrary ordering or duplicate identities. |
| digest | Carrier digest fields are copied only from an already validated `RequestDigest` or `DigestSummary`. This batch does not define normalized encoding, profile version or hashing implementation; that remains `R06.6-F` / Step 13 affected work. |
| body safety | refs, summaries and error context are body-free. No carrier field may contain raw log, metric, trace, audit, source, provider or credential material. |

## 14. `ObservationCommandResult` 对象卡

### 14.1 Rust-facing definition

```rust
/// Complete application-local result of one committed observation command.
pub struct ObservationCommandResult {
    result_ref: StoredObservationResultRef,
    public_result_ref: BodyFreeRef,
    result_access: ObservationResultAccess,
    disposition: OperationResultDisposition,
    changed_refs: Vec<BodyFreeRef>,
    outbox_refs: Vec<OutboxRecordRef>,
    gap_refs: Vec<GapStateRef>,
}
```

### 14.2 Field and relation contract

| field | source | invariant |
|---|---|---|
| `result_ref` | `ObservationStoredResultRepository` after exact result construction | required for every `Ok`; result kind is `CommandResult` or `CommandRejection`; missing stored result is `CompletedReservationResultMissing`/consistency, not a successful carrier |
| `public_result_ref` | body-free public surface identity created in the same result assembly | must match the stored replay surface; never a database locator or evidence alias |
| `result_access` | reservation branch | `FreshlyCommitted` requires result-before-complete; `Replayed` requires immutable surface validation and no new writes |
| `disposition` | application result assembly | one of `Accepted`/`Rejected`/`Quarantined`/`NoOp`/`Blocked`; does not encode public duplicate or retry action |
| `changed_refs` | accepted local post-state and records | empty for a rejected pre-UoW branch; canonical refs only |
| `outbox_refs` | same accepted UoW | contains only newly appended outbox refs; replay returns the original stored list and does not append |
| `gap_refs` | accepted gap/degraded/no-write surface when applicable | empty is meaningful; not a completeness proof |

### 14.3 Factory and checks

| member | exact contract |
|---|---|
| `try_new(stored_result, access) -> Result<Self, ApplicationError>` | validates `CommandResult` kind, operation family, disposition compatibility, ref canonicality and stored-result relation |
| `try_replayed(stored_result) -> Result<Self, ApplicationError>` | sets `result_access=Replayed`; copies immutable fields; performs no repository mutation |
| `validate_side_effect_partition()` | verifies changed/outbox/gap refs are disjoint by typed owner where required and no raw body is present |
| read-only accessors | return typed borrowed refs and surfaces; no mutable collection accessor |

Rejected input before a write UoW is an `Err(ApplicationError::InvalidRequest)` or protocol-layer error, not a `Rejected` stored result. `Rejected` is reserved for a formal durable rejection surface that the command flow intentionally commits.

## 15. `ObservationQueryResult<T>` 对象卡

### 15.1 Rust-facing definition

```rust
/// Complete read-only result of one observation query.
pub struct ObservationQueryResult<T> {
    view: Option<T>,
    visibility: VisibilitySurface,
    freshness: ObservationProjectionFreshnessSurface,
    degraded: Option<DegradedSurface>,
    availability: ObservationAvailabilitySurface,
    missing: Option<ObservationMissingSurface>,
    rebuild: Option<ObservationRebuildSurface>,
}
```

### 15.2 Total surface matrix

| condition | `view` | required fields | write prohibition |
|---|---|---|---|
| visible and fresh | `Some(T)` | visible `VisibilitySurface`, fresh freshness, `missing=None`, explicit availability | no UoW, no refresh |
| visible but stale | `Some(T)` only when read policy permits | freshness carries persisted marker; `degraded` may explain stale data | cannot mark fresh or rebuild inline |
| rebuilding | old `Some(T)` or `None` according to read policy | `rebuild` names the same target/progress relation; freshness is rebuilding | query cannot advance progress |
| not visible / blocked | `None` | visibility explicitly says not visible/blocked; body is absent | cannot convert to `NotFound` or create placeholder |
| missing / empty | `None` for single-object missing; empty collection remains typed empty view | `missing=Some(...)` only for missing, not for ordinary empty page | no placeholder or repair |
| disabled / unavailable / failed | `None` unless an explicitly allowed degraded view exists | availability is explicit and never `Available` by default | no adapter activation or fallback |

### 15.3 Factory and owner rules

| member | exact contract |
|---|---|
| `try_visible(view, visibility, freshness, degraded, availability, rebuild) -> Result<Self, ApplicationError>` | checks body visibility, marker identity, availability and degraded relation |
| `try_missing(visibility, missing, freshness, availability) -> Result<Self, ApplicationError>` | forbids a placeholder view and requires a typed missing surface |
| `try_rebuilding(view, visibility, freshness, rebuild, availability) -> Result<Self, ApplicationError>` | requires matching persisted rebuild target/progress; does not start rebuild |
| `try_rehydrate(fields...) -> Result<Self, ApplicationError>` | validates surface relations without reading or repairing current truth |
| accessors | immutable; no method can trigger refresh, rebuild, write, outbox or idempotency reservation |

`visibility` is a public surface value. The decision that produced it remains owned by `domain::read::ReadVisibilityDecision`; `application::services` cannot declare `ObservationVisibilityDecision` or another alias.

## 16. `ObservationConsumerResult` 对象卡

### 16.1 Current carrier

```rust
/// Complete application-local result of one inbound event consumer call.
pub struct ObservationConsumerResult {
    result_ref: StoredObservationResultRef,
    result_access: ObservationResultAccess,
    disposition: OperationResultDisposition,
    changed_refs: Vec<BodyFreeRef>,
    quarantine_ref: Option<QuarantineRef>,
    dead_letter_ref: Option<DeadLetterRef>,
    gap_refs: Vec<GapStateRef>,
}
```

The historical `ObservationConsumerDisposition` is not a field or owner of this carrier. The carrier reports the durable local result fact through `OperationResultDisposition`; `ObservationConsumerOutcome` is assembled by Step 08 from the stored receipt, error context and entry action. A worker acknowledgement or dead-letter handoff is not an application result disposition.

### 16.2 Outcome relation matrix

| local stored fact | `disposition` | required refs | public/entry mapping input |
|---|---|---|---|
| accepted local mutation | `Accepted` | changed refs may be non-empty; outbox refs remain in stored receipt surface if applicable | public `Accepted` |
| exact duplicate | original stored disposition; `result_access=Replayed` | no new changed/quarantine/dead-letter refs | public `Duplicate`; no new mutation |
| formal local rejection | `Rejected` | changed refs empty; optional typed issue/gap in stored surface | public `Rejected` |
| quarantine | `Quarantined` | `quarantine_ref` required; raw payload absent; gap optional | public `Quarantined`; entry may acknowledge or isolate |
| dead-lettered event | `Rejected` or `Blocked` according to the committed local reason | `dead_letter_ref` required; no raw body | public `DeadLettered`; dead-letter transport action由C-05承载 |
| valid no-change | `NoOp` | changed/quarantine/dead-letter refs empty | public `NoOp` |

The mapping is contextual, not an enum shortcut. `Delayed` and `UnsupportedSchema` may be returned as `Err(ApplicationError::ResolverUnavailable/UnsupportedSchemaVersion)` or a typed pre-handler protocol/completion result before a durable receipt exists; they must not receive a fabricated `result_ref` or pass through a generic entry classification.

### 16.3 Factory and checks

| member | exact contract |
|---|---|
| `try_new(stored_result, access, quarantine_ref, dead_letter_ref, gap_refs) -> Result<Self, ApplicationError>` | validates `ConsumerReceipt` kind, disposition/ref co-presence, event operation and body-free surface |
| `try_replayed(stored_result) -> Result<Self, ApplicationError>` | returns original receipt facts; no new outbox, gap or dead-letter write |
| `validate_terminal_refs()` | rejects quarantine/dead-letter ref combinations that do not match the stored disposition and receipt surface |
| accessors | immutable; no `ack`, `nack`, `poll`, `dead_letter` or adapter call |

## 17. `ObservationJobResult` 对象卡

### 17.1 Rust-facing definition

```rust
/// Complete application-local result of one terminal operations-job call.
pub struct ObservationJobResult {
    result_ref: StoredObservationResultRef,
    result_access: ObservationResultAccess,
    report: ObservationJobReportDraft,
    summary: JobReportFoldSummary,
}
```

### 17.2 Report relation and factory

| member | exact contract |
|---|---|
| `try_new(stored_result, report, access) -> Result<Self, ApplicationError>` | requires `JobReport` result kind, report state terminal, result/report refs and digests equal, report fold complete/valid, and `summary == report.derived_summary()` |
| `try_replayed(stored_result, report) -> Result<Self, ApplicationError>` | loads the original report surface and sets `Replayed`; does not relist plan items or run a job |
| `validate_report_fold()` | rechecks plan cardinality, item terminality, scope uniqueness, item-to-scope relation and derived summary equality |
| `summary()` | returns the immutable `JobReportFoldSummary` derived from `report.item_fold` |
| accessors | report and summary are immutable snapshots; no item mutation through carrier |

`ObservationJobResult` may carry a terminal `Completed`, `PartiallyCompleted`, `FailedRetryable`, `FailedPermanent` or `Blocked` report. It cannot carry `Draft` in `Ok`; a still-running execution is represented by the job flow's durable draft and a later call, not a fabricated successful response. `DuplicateReplayed` remains a public Step 08 outcome only.

## 18. `ObservationPublicationBatchResult` 对象卡

### 18.1 Per-item publication carrier

```rust
/// Lossless local result for one scanned outbox publication item.
pub enum ObservationPublicationItemResult {
    Published {
        outbox_ref: OutboxRecordRef,
        receipt: PublicationReceipt,
    },
    Retryable {
        outbox_ref: OutboxRecordRef,
        failure: PublicationFailureKind,
    },
    Failed {
        outbox_ref: OutboxRecordRef,
        failure: PublicationFailureKind,
    },
    DeadLettered {
        outbox_ref: OutboxRecordRef,
        reason: DeadLetterReason,
        dead_letter_ref: DeadLetterRef,
    },
}
```

`ObservationPublicationItemResult` is an application-local result carrier. It does not replace `OutboxPublicationState`, `PublicationFailure`, `PublicationReceipt` or the public event protocol.

```rust
/// Internal canonical fold for one PublishObservationOutbox Operations Job.
pub struct ObservationPublicationBatchResult {
    scanned_outbox_refs: Vec<OutboxRecordRef>,
    published_outbox_refs: Vec<OutboxRecordRef>,
    retryable_outbox_refs: Vec<OutboxRecordRef>,
    failed_outbox_refs: Vec<OutboxRecordRef>,
    dead_lettered_outbox_refs: Vec<OutboxRecordRef>,
    item_results: Vec<ObservationPublicationItemResult>,
}
```

### 18.2 Batch invariants

1. Every item result appears exactly once in `scanned_outbox_refs`; no result may be produced for an unscanned ref.
2. Published, retryable, failed and dead-lettered sets are pairwise disjoint and their union equals the scanned set.
3. `Published` requires an exact `PublicationReceipt` matching the stored payload snapshot, binding and token; it does not prove business acceptance.
4. `Retryable` and `Failed` retain `PublicationFailureKind`; `OutcomeUnknown` never silently enters `Retryable` without the later probe rule.
5. `DeadLettered` requires reason/ref co-presence; raw event body is never included.
6. The carrier is produced after each local publication marker UoW is classified. It does not roll back the accepted observation mutation and does not choose scheduler backoff or attempt count.

### 18.3 Factory and test cuts

| member | exact contract |
|---|---|
| `try_new(item_results) -> Result<Self, ApplicationError>` | canonicalizes refs, checks partition and one-result-per-scan invariants |
| `try_rehydrate(fields...) -> Result<Self, ApplicationError>` | validates persisted job result material without calling publisher |
| `published_count` / `failed_count` / `retryable_count` | derived from typed item results, not independently mutable counters |
| `is_lossless_for(scanned)` | exact partition check; false is a consistency defect |

## 19. Historical five-façade checkpoint（superseded by R06.8-B）

### 19.1 Historical ownership and current pointer

本节原五 façade 方案是 `historical_material_superseded`。Current 唯一来源为
`03_ddd_step_06_final_cross_module_gate_r06_8b.md` §§5~7：entry-callable
application façade 只有 TruthWrite、Read、InboundEvent 和统一九方法
`ObservationOperationsJobService`；publication 只保留该 Job 实现内部、
crate-private、一次处理一个已 plan/claim item 的 collaborator。Step 07 不得
恢复 worker publication façade、双 maintenance/publication façade 或以下旧
constructor/type 名称。

以下五 bundle/concrete implementation 代码块和 §§19.5~19.6 只保留为历史
dependency inventory 输入，不再是 current definition。仍可复用的 port 必须
由统一 Operations Job implementation 以 operation-specific subset 消费，并
遵守 R06.8-B 的 plan/claim/report/stored-result lifecycle。

All constructor bundles accept only application-owned port traits:

```rust
Arc<dyn ObservationUnitOfWorkManager>
Arc<dyn ClockPort>
Arc<dyn IdGeneratorPort>
Arc<dyn ObservationIdempotencyRepository>
Arc<dyn ObservationStoredResultRepository>
Arc<dyn ObservationOutboxRepository>
```

Repository, resolver, publisher and delivery implementations are supplied by `infra` through these ports. No façade may accept a concrete database handle, `infra` type, raw config map, transport client, scheduler, source-write client, `Any`/downcast escape hatch or public protocol DTO as a constructor dependency.

The following were the five historical dependency bundles. They are not current constructor signatures and cannot be copied into Step 07/14.

```rust
pub struct ObservationTruthWriteDependencies {
    pub uow: Arc<dyn ObservationUnitOfWorkManager>,
    pub clock: Arc<dyn ClockPort>,
    pub ids: Arc<dyn IdGeneratorPort>,
    pub intake: Arc<dyn ObservationIntakeRepository>,
    pub correlation_signal: Arc<dyn CorrelationSignalRepository>,
    pub audit_evidence: Arc<dyn AuditEvidenceRepository>,
    pub report_handoff: Arc<dyn ReportHandoffRepository>,
    pub peripheral_delivery: Arc<dyn PeripheralDeliveryRepository>,
    pub retention_guard: Arc<dyn RetentionGuardRepository>,
    pub reference_maintenance: Arc<dyn ReferenceMaintenanceRepository>,
    pub projection_store: Arc<dyn ObservationProjectionStore>,
    pub idempotency: Arc<dyn ObservationIdempotencyRepository>,
    pub stored_results: Arc<dyn ObservationStoredResultRepository>,
    pub outbox: Arc<dyn ObservationOutboxRepository>,
    pub source_summary: Arc<dyn ObservationSourceSummaryResolver>,
    pub runtime_summary: Arc<dyn RuntimeSandboxSummaryResolver>,
    pub governance_artifact_evidence: Arc<dyn GovernanceArtifactEvidenceResolver>,
    pub subject_observation: Arc<dyn SubjectObservationResolver>,
}

pub struct ObservationReadDependencies {
    pub intake: Arc<dyn ObservationIntakeRepository>,
    pub correlation_signal: Arc<dyn CorrelationSignalRepository>,
    pub audit_evidence: Arc<dyn AuditEvidenceRepository>,
    pub report_handoff: Arc<dyn ReportHandoffRepository>,
    pub peripheral_delivery: Arc<dyn PeripheralDeliveryRepository>,
    pub retention_guard: Arc<dyn RetentionGuardRepository>,
    pub reference_maintenance: Arc<dyn ReferenceMaintenanceRepository>,
    pub projection_store: Arc<dyn ObservationProjectionStore>,
    pub source_summary: Arc<dyn ObservationSourceSummaryResolver>,
    pub runtime_summary: Arc<dyn RuntimeSandboxSummaryResolver>,
    pub governance_artifact_evidence: Arc<dyn GovernanceArtifactEvidenceResolver>,
    pub subject_observation: Arc<dyn SubjectObservationResolver>,
    pub availability: Arc<dyn AdapterAvailabilityProbe>,
}

pub struct ObservationInboundEventDependencies {
    pub uow: Arc<dyn ObservationUnitOfWorkManager>,
    pub clock: Arc<dyn ClockPort>,
    pub ids: Arc<dyn IdGeneratorPort>,
    pub intake: Arc<dyn ObservationIntakeRepository>,
    pub correlation_signal: Arc<dyn CorrelationSignalRepository>,
    pub audit_evidence: Arc<dyn AuditEvidenceRepository>,
    pub report_handoff: Arc<dyn ReportHandoffRepository>,
    pub peripheral_delivery: Arc<dyn PeripheralDeliveryRepository>,
    pub retention_guard: Arc<dyn RetentionGuardRepository>,
    pub reference_maintenance: Arc<dyn ReferenceMaintenanceRepository>,
    pub projection_store: Arc<dyn ObservationProjectionStore>,
    pub idempotency: Arc<dyn ObservationIdempotencyRepository>,
    pub stored_results: Arc<dyn ObservationStoredResultRepository>,
    pub outbox: Arc<dyn ObservationOutboxRepository>,
    pub source_summary: Arc<dyn ObservationSourceSummaryResolver>,
    pub runtime_summary: Arc<dyn RuntimeSandboxSummaryResolver>,
    pub governance_artifact_evidence: Arc<dyn GovernanceArtifactEvidenceResolver>,
    pub subject_observation: Arc<dyn SubjectObservationResolver>,
}

pub struct ObservationMaintenanceDependencies {
    pub uow: Arc<dyn ObservationUnitOfWorkManager>,
    pub clock: Arc<dyn ClockPort>,
    pub ids: Arc<dyn IdGeneratorPort>,
    pub idempotency: Arc<dyn ObservationIdempotencyRepository>,
    pub stored_results: Arc<dyn ObservationStoredResultRepository>,
    pub outbox: Arc<dyn ObservationOutboxRepository>,
    pub job_execution: Arc<dyn ObservationJobExecutionRepository>,
    pub job_report: Arc<dyn ObservationJobReportRepository>,
    pub intake: Arc<dyn ObservationIntakeRepository>,
    pub correlation_signal: Arc<dyn CorrelationSignalRepository>,
    pub audit_evidence: Arc<dyn AuditEvidenceRepository>,
    pub report_handoff: Arc<dyn ReportHandoffRepository>,
    pub peripheral_delivery: Arc<dyn PeripheralDeliveryRepository>,
    pub retention_guard: Arc<dyn RetentionGuardRepository>,
    pub reference_maintenance: Arc<dyn ReferenceMaintenanceRepository>,
    pub projection_source: Arc<dyn ObservationProjectionSourceReader>,
    pub projection_membership: Arc<dyn ObservationProjectionMembershipPlanner>,
    pub projection_store: Arc<dyn ObservationProjectionStore>,
    pub source_summary: Arc<dyn ObservationSourceSummaryResolver>,
    pub runtime_summary: Arc<dyn RuntimeSandboxSummaryResolver>,
    pub governance_artifact_evidence: Arc<dyn GovernanceArtifactEvidenceResolver>,
    pub subject_observation: Arc<dyn SubjectObservationResolver>,
    pub handoff_delivery: Arc<dyn ReportHandoffDeliveryPort>,
    pub export_delivery: Arc<dyn PeripheralExportDeliveryPort>,
}

pub struct ObservationPublicationDependencies {
    pub uow: Arc<dyn ObservationUnitOfWorkManager>,
    pub clock: Arc<dyn ClockPort>,
    pub outbox: Arc<dyn ObservationOutboxRepository>,
    pub publisher: Arc<dyn ObservationEventPublisher>,
    pub availability: Arc<dyn AdapterAvailabilityProbe>,
}

pub struct ObservationTruthWriteServiceImpl {
    deps: ObservationTruthWriteDependencies,
}

pub struct ObservationReadServiceImpl {
    deps: ObservationReadDependencies,
}

pub struct ObservationInboundEventServiceImpl {
    deps: ObservationInboundEventDependencies,
}

pub struct ObservationMaintenanceServiceImpl {
    deps: ObservationMaintenanceDependencies,
}

pub struct ObservationPublicationServiceImpl {
    deps: ObservationPublicationDependencies,
}

impl ObservationTruthWriteServiceImpl {
    pub fn new(deps: ObservationTruthWriteDependencies) -> Self { Self { deps } }
}

impl ObservationReadServiceImpl {
    pub fn new(deps: ObservationReadDependencies) -> Self { Self { deps } }
}

impl ObservationInboundEventServiceImpl {
    pub fn new(deps: ObservationInboundEventDependencies) -> Self { Self { deps } }
}

impl ObservationMaintenanceServiceImpl {
    pub fn new(deps: ObservationMaintenanceDependencies) -> Self { Self { deps } }
}

impl ObservationPublicationServiceImpl {
    pub fn new(deps: ObservationPublicationDependencies) -> Self { Self { deps } }
}
```

The bundles are wiring contracts, not new truth owners. `ObservationReadDependencies` deliberately has no UoW, idempotency, stored-result or outbox port; its implementation may call only the read methods of the listed repository/projection traits. `ReadVisibilityPolicy`/`ReadVisibilityDecision` evaluation and cursor decoding remain application/domain helpers and are not hidden write-capable dependencies. No bundle contains a source-truth writer, raw-body resolver, scheduler, transport acknowledgement port or public protocol mapper.

### 19.2 `ObservationTruthWriteService`

| item | current contract |
|---|---|
| owner | `application::services` |
| input | one typed Command input carrying the matching `ObservationCommandOperation`, validated actor/context, request digest, idempotency key and body-free payload refs/summaries |
| output | `Result<ObservationCommandResult, ApplicationError>` |
| durable sequence | reserve idempotency -> load required local/domain state -> apply domain factory/policy -> save observation-owned truth/marker/record -> append immutable outbox snapshot when required -> save stored result -> complete reservation in one accepted relation |
| allowed dependencies | UoW/clock/id; intake, correlation/signal, audit/evidence, handoff, peripheral, retention/guard, reference/maintenance and projection repositories as operation-specific dependencies; idempotency/result/outbox stores; body-free safe-summary resolvers |
| forbidden dependencies | source/business truth write port; raw body resolver; job scheduler/claim runner; direct publisher/delivery call; public protocol outcome; current config substitution |

| operation family | exact capability |
|---|---|
| `SubmitObservationMaterial`、`RecordSafetyDisposition` | intake receipt and safety-owned local facts; forbidden body is rejected/quarantined before persistence |
| `BindCorrelationContext`、`RecordSafeSignal` | correlation/signal local facts and affected projection markers |
| `AppendAuditProjection`、`LinkBodyFreeEvidence` | append-only audit projection and ref-only evidence linkage |
| `PrepareReportHandoff`、`EvaluateAuthenticityHint` | local handoff/readiness/authenticity preparation only; no final verdict/signoff |
| `SetRetentionMarker`、`ProtectActiveReference`、`DefineReplayScope`、`RecordNoWriteViolation` | local guard/retention/replay/no-write markers; no cleanup or source repair |
| `RecordGapState` | explicit gap state only; no default success or source correction |
| `PrepareExternalAuditExport` | local export preparation and body-free package input; delivery belongs to maintenance/delivery flow |
| `RegisterReferenceSnapshot`、`UpdateReferenceSnapshotState` | body-free reference snapshot state and refresh record; no external body persistence |

### 19.3 `ObservationReadService`

| item | current contract |
|---|---|
| owner | `application::services` |
| input | one typed Query input with validated query operation, actor/scope/cursor and read policy context; no idempotency reservation |
| output | `Result<ObservationQueryResult<T>, ApplicationError>` |
| allowed dependencies | read-only projection store; versioned local read repositories; body-free safe-summary resolvers; canonical `ReadVisibilityDecision` evaluator; typed cursor decoder |
| forbidden dependencies | `ObservationUnitOfWorkManager` write methods; idempotency/result/outbox repositories; refresh/rebuild/repair methods; source truth write; external delivery/publisher |
| side-effect rule | no state transition, record append, outbox append, gap close, freshness mutation, config activation or retry scheduling |

| query capability groups | exact operations |
|---|---|
| intake / signal | `GetObservationReceipt`; `GetIntakeStatus`; `GetSafeSignal`; `GetSignalRollup` |
| audit / evidence / handoff | `GetAuditTimeline`; `GetEvidenceIndexInput`; `GetReportHandoff` |
| guard / derived read | `GetRetentionProtection`; `GetObservationReadModel`; `GetDiagnosticView`; `GetGapStatus` |
| peripheral / reference / progress | `GetPeripheralExportView`; `GetReferenceSnapshotView`; `GetRebuildProgress` |

### 19.4 `ObservationInboundEventService`

| item | current contract |
|---|---|
| owner | `application::services` |
| input | one typed inbound input containing validated event identity, producer/schema metadata, dedup key, actor/context, safe payload carrier and request digest |
| output | `Result<ObservationConsumerResult, ApplicationError>` |
| durable sequence | validate envelope -> reserve event/idempotency identity -> load/resolve body-free material -> apply local consumer transition -> append local history/outbox or quarantine/gap marker as authorized -> store consumer receipt -> complete reservation |
| allowed dependencies | UoW/clock/id; idempotency/result/outbox; intake/correlation/audit/handoff/peripheral/retention/reference/projection repositories; body-free resolvers |
| forbidden dependencies | source truth write; raw payload archive; direct ack/dead-letter transport; direct external delivery; public outcome enum; query-triggered rebuild |

| consumer operation | local ownership |
|---|---|
| `ConsumeBusObservationMaterial` | local receipt/intake/projection input |
| `ConsumeSourceAuditMaterial` | local audit projection and safe source summary |
| `ConsumeIdentityObservationContext` | local correlation/reference context |
| `ConsumeGovernanceAuditContext`、`ConsumeArtifactEvidenceContext` | body-free audit/evidence linkage and visibility/gap surface |
| `ConsumeRuntimeSignalSummary`、`ConsumeSandboxSignalSummary` | safe signal projection/rollup input |
| `ConsumeArchiveHandoffFeedback`、`ConsumeReportConsumerFeedback` | local handoff/delivery feedback and audit marker |

### 19.5 Historical `ObservationMaintenanceService`（superseded）

| item | current contract |
|---|---|
| owner | `application::services` |
| input | one typed Job input with `JobRunId` correlation, actor, idempotency context, operation-specific scope/target/cursor and validated `JobExecutionConfigSnapshot` source; local execution/plan refs are generated by the service after reservation |
| output | `Result<ObservationJobResult, ApplicationError>` |
| durable sequence | reserve -> materialize bounded candidates -> freeze plan/config snapshot/items and Draft report -> commit start -> acquire exact claim/fence -> process item outside/inside short UoW as required -> lossless fold -> seal report -> store JobReport result and complete reservation |
| allowed dependencies | job execution/plan/claim repository; job report repository; all operation-specific local repositories/projection store; idempotency/result/outbox; body-free resolvers; handoff/export delivery ports; UoW/clock/id |
| forbidden dependencies | source/business truth write; current-config re-read on resume; report reverse reconstruction of plan; claim token without exact tuple; real run/evidence/signoff generator; direct transport ack |

| operation | exact capability |
|---|---|
| `RebuildObservationReadModels` | projection replacement and diagnostic composite fold |
| `RebuildSignalRollups` | bounded rollup rebuild and local progress marker |
| `RefreshReferenceSnapshots` | body-free reference resolution and state transition |
| `ScanObservationGaps` | H12-compatible accepted scan result and local gap/report fold; H12 remains owner of its record |
| `CoordinateObservationReplay` | approved target-bound replay coordination; no source repair |
| `PrepareReportHandoffDelivery` | stable handoff preparation/delivery token and local finalize |
| `PrepareExternalAuditExportDelivery` | stable export preparation/delivery token and local finalize |
| `RebuildPeripheralViews` | consumer/scope-bound derived view rebuild |

### 19.6 Historical worker `ObservationPublicationService` façade（superseded）

| item | current contract |
|---|---|
| owner | `application::services`; worker-only façade |
| input | `PublishObservationOutboxInput` with bounded eligibility, exact claim/token/probe material and no mutable payload body |
| output | `Result<ObservationPublicationBatchResult, ApplicationError>` |
| allowed dependencies | `ObservationOutboxRepository`; `ObservationEventPublisher`; UoW/clock and exact external publication token/probe support |
| forbidden dependencies | current truth repositories; source resolver; plan relisting; public event DTO reconstruction; direct worker transport; blind retry after unknown outcome |
| sequence | load stored payload snapshot -> verify binding/schema/digest/token -> publish outside local UoW where required -> probe/ classify -> short UoW CAS publication marker -> return lossless batch carrier |
| truth boundary | publication failure never rolls back accepted observation truth; publisher never manufactures payload from current mutable state |

### 19.7 F2 façade invocation / bypass matrix

F2 assembler是四个 entry-callable façade implementation内部的process-local helper；publication collaborator只能由统一 Operations Job implementation调用，二者都不是新增 façade、public trait、repository或可注入entry service。只有operation-specific accepted-effect mapper先从实际accepted primary mutation独立生成expected footprint，且存在至少一个current H-family mandatory obligation时，write façade才能构造`ObservationRecordAssemblyPlan`。caller、entry、DTO、config、record obligation和follower plan都不能自行声明“需要history”或升级cursor namespace。

| façade / flow branch | F2 action | exact gate | required bypass / prohibition |
|---|---|---|---|
| `ObservationTruthWriteService` accepted H1~H6/H8~H11 branch | required | accepted operation branch产生至少一个current mandatory record；从accepted transition/proof/post-state生成独立expected footprint | pre-UoW reject、policy expected no-op、explicit-no-record、duplicate replay、idempotency conflict/in-flight均不调用 |
| `ObservationTruthWriteService::RecordSafeSignal`或匹配signal consumer | required with cursor-dependent H11 closure | pre-cursor只保留`SignalRollupAcceptSeed`；分配Observation cursor后执行`accept_signal`、构造H11、借用stage rollup，再物化其余record/follower | 不得cursor前执行rollup，不得让local transition逃逸，不得clone/reload rollup代替same-UoW post-state |
| reference-only `RegisterReferenceSnapshot` / `UpdateReferenceSnapshotState` accepted H10 | required with Reference commit class | 唯一primary是reference snapshot mutation，且所有obligation均为H10 | 一旦同UoW有observation-owned primary即改用唯一Observation cursor；禁止再分配Reference cursor |
| `DefineReplayScope` | bypass under current controlled blocker | scope mutation可按自身accepted contract提交，但current H13 factory没有scope-only accepted input | 不得mint H13 ref、伪造per-target coordination transition或用H13补齐正式`02`映射；若同UoW另有独立H-family transition，只为该独立transition调用 |
| `ObservationReadService`全部14个Query | always bypass | synchronous Query为zero-write，H7无current writer/ID/UoW/cursor | 不得因read visibility、diagnostic gap或staleness暗写record、outbox、result或repair |
| `ObservationInboundEventService` accepted H1~H4/H6/H8~H11 branch | required when exact accepted effect maps to a current family | event duplicate/no-op在建plan前完成分类；accepted transition与same-UoW post-state共同形成obligation | transport ack/dead-letter、unsupported/rejected before mutation、duplicate replay和仅quarantine transport disposition不得伪造record |
| `ObservationOperationsJobService` non-publication accepted item mutation | required for its exact H3~H6/H8~H13 family；H12 accepted gap-scan item always required | claim guard先且只注册一次；H12借用`&GapScanPostState`；item classification与Draft report fold在首次record append前均已物化 | start/plan-only、claim-only、heartbeat-only、report-only、seal-only、finalize-only UoW不调用；不得因“这是Job”自动生成history |
| `CoordinateObservationReplay` per-target accepted coordination transition | required H13 | exact Approved scope + coordination + target + `ReplayCoordinationTransition`，每个target独立obligation | scope定义、scope-wide iterator、plan materialization、claim/report lifecycle均不是H13 input |
| handoff/export delivery finalize branch | conditional | 只有同一短UoW确实接受H4/H9 local transition时，为该transition调用；stable token/result本身不升级record requirement | token reserve/probe/finalize-only、unknown-outcome probe或外部调用本身不调用assembler |
| `ObservationOperationsJobService::publish_observation_outbox` internal collaborator marker-only UoW | always bypass | outbox publication lifecycle由stored snapshot/token/CAS owner处理，不是H1~H13 accepted primary | 不得从published/failed/dead-letter marker制造domain record或第二cursor；不得从current truth重建payload |

所有required分支都遵循F2三阶段closure：validated pre-cursor plan、cursor-dependent primary closure、complete in-memory materialization。`ObservationPreparedRecordCommit`形成后，façade只能按F2 dispatcher顺序整体派发；它不能抽取单个record/follower、把mandatory append降为best effort，或在失败后返回`FreshlyCommitted`。known pre-commit/commit failure回滚整个UoW；`CommitOutcomeUnknown`只返回ambiguous outcome并要求按exact identity probe，不能自动重跑。

## 20. Constructor dependency matrix

| façade | required port groups | deliberately absent port groups |
|---|---|---|
| TruthWrite | UoW, clock/id, idempotency/result/outbox, operation-specific truth repositories, projection affected-view store, safe resolvers | source write, scheduler, direct publisher/delivery, public protocol mapper |
| Read | read repositories, projection store, safe resolvers, visibility evaluator | UoW manager, idempotency/result/outbox mutation, refresh/rebuild, delivery |
| InboundEvent | UoW, clock/id, idempotency/result/outbox, local truth repositories, projection store, safe resolvers | source write, ack/dead-letter transport, direct delivery, scheduler |
| OperationsJob | UoW, clock/id, idempotency/result/outbox, job execution/plan/item/claim/report repositories, operation-specific projection/local repositories/resolvers/handoff/export ports, and crate-private publication collaborator dependencies | source write, current-config loader on resume, worker façade, direct entry access to publisher/collaborator, real run/evidence/signoff generator |

The matrix is a minimum dependency contract, not permission to inject every port into every implementation. A concrete implementation must use the operation-specific subset and fail startup/build validation if a required port is absent. It must not add a hidden fallback port.

## 21. Result and error mapping handoff

### 21.1 Application-to-public mapping input

| application result/error | Step 08 mapping input | prohibited shortcut |
|---|---|---|
| `ObservationCommandResult` | stored surface kind, `OperationResultDisposition`, result access, changed/outbox/gap refs | mapping `Accepted` domain state directly to public success without stored result validation |
| `ObservationQueryResult<T>` | visibility/freshness/degraded/availability/missing/rebuild surface | converting all missing/not-visible states to `ApplicationError` or `NotFound` |
| `ObservationConsumerResult` | stored receipt, local disposition, quarantine/dead-letter refs, entry ack action | restoring `ObservationConsumerDisposition` as a second owner |
| `ObservationJobResult` | terminal `JobReportState`, report refs/fold and result access | mapping `DuplicateReplayed` into durable report state |
| `ObservationPublicationBatchResult` | internal `PublishObservationOutbox` item fold used by exact Job report/response assembler | returning it as a worker/entry façade result or treating transport failure as source/business truth failure |
| `ApplicationError` | operation family + durable phase + exact variant + safe context | exposing raw provider message, HTTP number or stack trace |

### 21.2 Recovery mapping boundary

`ApplicationError` variants map to `ObservationRecoveryClass` in Step 12. The façade may classify and return the typed error, but it does not choose retry count, delay, claim renewal schedule, worker exit code or operator procedure. `ObservationResultAccess::Replayed` is not a recovery class and does not authorize re-execution.

## 22. Step 07 handoff and affected-use register

| downstream location | required current correction | status |
|---|---|---|
| Step 07 service output table | replace historical `ObservationConsumerDisposition` field with `OperationResultDisposition` plus `ObservationResultAccess`, quarantine/dead-letter/gap refs; add lossless publication item results | affected-only; Step 07 remains frozen |
| Step 07 `ApplicationError` block | import the single `application::errors::ApplicationError`; remove duplicate declaration/use ambiguity; preserve raw adapter mapping table as use-site | affected-only; no Step 07 write in E |
| Step 07 façade traits | replace the historical five names with four entry-callable façades；unify all nine Job methods under `ObservationOperationsJobService` and keep publication collaborator crate-private | affected-only; exact trait syntax remains Step 07 owner |
| Step 07 job report repository | `get_report_with_version` / `save_report` must persist report lineage, item fold and terminal state without `JobRunRef` or generic failure reason | affected-only |
| Step 08 Consumer protocol | public `ObservationConsumerOutcome` remains separate; derive it from stored receipt + entry action; no application disposition enum is added | affected-only; `03-RPR-S08-PER-PROTOCOL` open |
| Step 08 Job protocol | public `ObservationJobOutcome` remains separate; `DuplicateReplayed` never enters `JobReportState` | affected-only |
| Step 09 flows | every accepted command/consumer/job uses stored result-before-complete; query uses result surface only; publication uses stored payload snapshot | affected-only; `03-RPR-S09-PER-FLOW` open |
| Step 10 matrix | state owner for `JobReportState` points back to `application::report`; no reverse definition in Step 10 | affected-only |
| Step 11 persistence | report/item/scope uniqueness, ref-set partition, exact claim tuple and result/report/reservation same-UoW relation must be represented | affected-only; `R06-F-AFFECT-UOW-01` remains open_controlled |
| Step 12 recovery | use exact `ApplicationError`/`JobError` variants and recovery classes; do not expose raw details | affected-only |
| Step 13 concurrency | digest fields are consumed but canonical encoding remains `R06.6-F`; duplicate replay does not relist or mutate | affected-only |
| Step 14 / `04` | Job snapshot is rehydrated from the accepted plan; current config cannot substitute historical bindings | affected-only |

## 23. Formal backfill draft (frozen until Step 19)

The following is a source draft only. It is not a write to `03-详细设计.md` and does not authorize implementation:

```md
### application::report / application::errors / application::services

Application results are layered. `OperationResultDisposition` is the durable fact of a stored replay surface; `JobReportState` is the lifecycle of one durable report lineage; service return carriers expose validated refs and surfaces; C-05 carries Consumer transport completion; C-08/C-09 carry Job callback completion/failure; Step 08 owns typed public outcomes. No generic entry disposition exists. Duplicate replay returns the original stored surface and never creates a duplicate durable state.

`ObservationJobReportDraft` binds an independent report ref to the local execution ref, immutable plan ref, public `JobRunId` correlation, idempotency reservation, request/plan digests and an exact claim proof. Its item and scope fold is lossless with the immutable plan. Terminal sealing requires every plan item to be terminal and rejects missing, conflicting or stale classifications. The report does not own source truth, H12 record lifecycle, external acceptance, final verdict, signoff, real run identity or evidence alias.

`ApplicationError` has one owner in `application::errors`; raw adapter errors are mapped before crossing the port boundary and safe diagnostic refs remain outside the enum. Five canonical façades are the only application business surface for API, worker and jobs entry modules. Query is zero-write; inbound and maintenance services may write only observation-side projections, markers, records, outbox and report surfaces; publication reads stored payload snapshots and never rebuilds an event from current truth.
```

## 24. E 批静态闭环与停审

### 24.1 Historical static closure checklist（façade rows superseded）

| check | result |
|---|---|
| each required E object has an individual card or exact carrier contract | pass_design_only |
| `ProjectionScopeItemOutcome` success/failure fields are mutually exclusive | pass_design_only |
| report state has one Draft and five terminal variants; no `DuplicateReplayed` | pass_design_only |
| report binds execution/plan/idempotency/digest/fence and lossless item fold | pass_design_only |
| generic `JobFailureReason` absent from current E schema | pass_design_only; historical references remain explicitly labeled |
| `ApplicationError` has one current owner and no raw provider detail | pass_design_only |
| `ObservationConsumerResult` no longer owns historical consumer disposition | pass_design_only |
| query result cannot write or trigger repair | pass_design_only |
| publication batch is per-item lossless and does not own source truth | pass_design_only |
| historical five façade dependency directions | `superseded_by_R06.8-B`；current为四 entry façade + private publication collaborator |
| F2 façade invocation/bypass | `pass_design_only_after_R06.8_owner_correction`；§19.7覆盖Command/Query/Consumer/Job/publication/finalize分支且不创建第五entry façade |
| 14 assembly failure kinds and wrapper have one error owner | pass_design_only；§12.1/§12.5为canonical declaration，F2专项只负责producer contract |
| canonical digest algorithm/profile | `resolved_in_F1_design_only`；12-kind v1 framing、profile-aware admission、migration与planned corpus/tests见`03_ddd_step_06_application_digest_canonicalizer.md` |
| exact Step 07 trait syntax and adapter implementation | deferred_to_affected_review |
| runtime/entry stable carrier | deferred_to_R06.7 |
| implementation tests/evidence/commit | not_run / not_created |

### 24.2 E stop gate

| gate | status | basis |
|---|---|---|
| report object closure | `pass_design_only` | §§6~10逐对象字段、factory、rehydrate、state、error和test redlines |
| disposition layer closure | `resolved_in_E_design_only` | §5、§12~§17分离stored fact/report/application carrier/entry/public outcome |
| ApplicationError owner | `resolved_in_F2_owner_addendum` | §12唯一 owner、digest extension及14-kind record-assembly wrapper |
| façade closure | `historical_pass_superseded` | current closure唯一见R06.8-B §§5~7；本节旧五 façade不得实施 |
| downstream affected register | `recorded_only` | §21；Step 07~14保持冻结 |
| formal `03` backfill | `draft_only` | §23；只供Step 19装配 |
| direct upstream blocker | `R06.6-F2-H13-UPSTREAM=open_controlled` | formal `02`对`DefineReplayScope`的H13映射与current per-target factory不一致；当前用禁止Command写H13的保守边界控制 |
| overall Step 06 quality blocker | `open` | F2已完成design-only；`03-RPR-S06-GRANULARITY`仍需R06.7、R06.8及后续affected review |

E批历史停审状态为`R06.6-E_done_waiting_user`，已由用户确认并被F1/F2及R06.7-A~E消费。R06.7-E已删除generic entry layer，并将本文件原五层草稿收敛为durable fact、durable report、application return、technical callback/completion与public result的明确owner。当前整体恢复点为`R06.7-E_done_waiting_user_before_R06.8`；下一允许动作只有用户确认后进入R06.8，本文件不自动推进，不修改正式`03`、Step07~19、任何`04`文件或实现仓。

### 24.3 未运行与未创建声明

- 未运行实现测试、数据库测试、外部 adapter 测试或真实验收。
- 未生成真实 run id、evidence alias、验收签署、实现 commit 或测试 evidence。
- 本文件只表示 design-only closure；implementation readiness 仍为 `not_ready`。

### 24.4 F2 owner backfill 与 current pointer

| F2 affected owner | current同步结论 | authority |
|---|---|---|
| `application::errors` | `RecordAssemblyFailureKind` 14 variants及`ApplicationError::RecordAssemblyInvariantViolation`已进入唯一owner | 本文件§12优先于F2专项中的producer-side摘要 |
| `application::services` | current四 entry façade的required invocation、conditional invocation和mandatory bypass形成total matrix；publication collaborator只在Job内使用 | 本文件§19.7经R06.8 owner correction；具体plan/phase/rollback仍由F2专项唯一拥有 |
| public / technical-entry mapping | assembly invariant不是caller输入错误、public outcome、C-05 transport action或best-effort audit结果 | Step08/12后续affected review，不在本批改写冻结文件 |
| verification | 仅登记planned unit/parity/failure-injection cut | `planned/not_run`；无测试结果、run id、evidence alias或签署 |

本节的F2 owner回灌已经被R06.7-A~E消费；current pointer固定为`R06.7-E_done_waiting_user_before_R06.8`。R06.7-E只关闭`R06.7-ENTRY-DISPOSITION-OWNER`并将该类型裁定为`HX`，不关闭`R06.6-F2-H13-UPSTREAM`、`R06-F-AFFECT-UOW-01`或总体`03-RPR-S06-GRANULARITY`，也不授权进入R06.8；必须等待用户明确确认。

## 25. S07-D report persistence and claim-subject addendum

> Current affected correction: this section is limited to cross-crate report codec visibility and the exact claim subject protecting each report mutation. It does not change report fields, six-state lifecycle, lossless-fold semantics or error ownership.

### 25.1 Cross-crate codec visibility

The separate infra crate must rehydrate and encode the complete report without gaining a second state owner. The following application-owned durable carriers therefore have `pub` Rust visibility, private struct fields, validated factories and read-only selectors:

- `JobReportItemFoldEntry`;
- `JobReportItemSnapshotProof`;
- `JobReportItemClassification`;
- `JobReportItemFold` and `JobReportFoldSummary`;
- `JobReportFailureAssociation` and `JobReportPersistenceFailure`;
- `ObservationReportClaimProof`;
- `ProjectionScopeItemReport`;
- `ObservationJobReportDraft`.

For each carrier, `try_rehydrate(...)` is public to application/infra and must run the existing full cross-field validation. Persistence selectors expose only typed refs, finite variants, canonical collections, versions and digests needed by the codec. They do not expose mutable collection references, state setters, raw provider detail or a serde bypass. Factory/mutation methods that create a new report, record a snapshot or seal a report remain application orchestration capabilities.

### 25.2 Exact report claim subject

The earlier sentence fixing `ObservationReportClaimProof.subject` to `Execution(execution_ref)` is superseded. The proof is a tagged internal value with these two legal forms:

| form | allowed report mutation | required co-write |
|---|---|---|
| `Item { execution_ref, work_key, exact claim tuple }` | replace the matching Draft fold entry and its scope rows | the same item classification CAS in the same UoW |
| `Execution { execution_ref, exact claim tuple }` | seal terminal report and finalize report/result/reservation | terminal report, stored result and idempotency completion in the same UoW |

Initial Draft creation has no claim proof and occurs only with the accepted immutable plan in the start UoW. A report-level accounting update tied to one item uses that item's claim. A terminal seal cannot use an item claim. An execution claim cannot manufacture or overwrite an item fold entry without the exact item CAS snapshot proof.

`ObservationJobReportRepository` exposes separate create, item-fold stage and terminal stage methods in S07-D so there is no nullable/generic claim parameter. Commit guard registration remains once per UoW; the report stage compares its proof to the already registered `Versioned<ObservationExecutionClaim>` and does not register a second guard.

This closes `R07-REPORT-CROSS-CRATE-VIS-01` and the report-owner portion of `R07-REPORT-CLAIM-SUBJECT-01` at design-only depth. No test, implementation, run id, evidence alias, signoff or acceptance result is claimed.

### 25.3 Initial Draft construction from a staged plan version

The earlier `ObservationJobReportDraft::try_new(report_ref, plan, reservation, job_run_id, now)` wording is insufficient for the accepted start UoW: every initial fold entry requires `JobReportItemSnapshotProof::PlanMaterialized { plan_row_version }`, while the plan is staged but not yet committed. The current application-owned constructor is therefore:

```rust
impl ObservationJobReportDraft {
    /// Build the complete initial Draft after the plan repository assigns its row version.
    pub(crate) fn try_new_for_staged_plan(
        report_ref: JobReportRef,
        plan: &ObservationJobExecutionPlan,
        plan_row_version: ObservationRepositoryVersion,
        reservation: &ObservationIdempotencyReservation,
        job_run_id: JobRunId,
        now: ObservedAt,
    ) -> Result<Self, ApplicationError>;
}
```

The constructor validates the plan/execution/reservation/digest relation and creates exactly one canonical `Pending { state: Planned }` entry per immutable plan work key, each carrying the supplied nonzero plan row version. It accepts no claim proof because claims do not exist before start commit. `stage_initial_report` must receive the same plan version and reject any entry with another proof/version. The historical unversioned `try_new` is superseded and must not remain as an implementation alias.

This closes `R07-REPORT-INITIAL-PLAN-VERSION-01` at design-only depth. It does not make a staged plan externally visible, fabricate a committed plan, or authorize partial plan/report persistence.
