# L2-tools Step 9 函数流附录：4 条 Operations Job flows

> 状态: completed / pass
> 主文件: `03_ddd_step_09_function_flows.md`
> 输入: Step 6 stable carriers/object contracts、Step 7 Store/Port seams、Step 8 Job schemas
> 对标: `projects/L1-governance/design-calibration/03_ddd_step_09_function_flows.md`
> 约束: Job 只处理 bounded deterministic slice；不拥有 scheduler/run/lease/evidence/signoff truth。

## 1. 本批次目标与输入诊断

本附录把 `CheckCapabilityBindingConsistency`、`CheckReferenceIntegrity`、
`RebuildToolDerivedViews` 和 `RefreshExternalStatusRefs` 分别闭合到可落码的
入口、target planner、Store/Port 调用、UoW、报告和重入语义。每条 Job 独立成卡，不能用
“maintenance job”摘要代替。

Step 8 中“空 `tool_ids` 代表全部可见 Binding”的旧文字无法由 Step 7 的正式 Store
方法实现：Step 7 没有按 tool 的全局列举方法，只有 `find_current_by_tool` 和按 Hub
capability 的 bounded reverse lookup。因此本附录把该文字标为 `historical_material`，
将 `JF-01` 的输入收紧为显式、非空、去重且受 `JobSliceLimit` 约束的 `tool_ids`。

`ReferenceInspectionTargetKind` 允许表达多个外部引用族，但当前 Step 7 只为 Hub、
Authorization、Sandbox、Bus 和 Observation 提供明确的 read/Port seam；Core shared-contract
authority 没有可正向读取的 local Store/Port。`JF-02` 对该 kind 只能产生
`UnverifiableReference` / `Blocked`，不得发明 authority query。

## 2. Job 公共处理契约

### 2.1 入口与所有权

```text
[jobs::ToolJobEntry]
  -> validate ToolJobRequest + JobMetadata + job-specific scope
  -> ToolJobUseCases::run(request, metadata)
  -> one bounded job service
  -> JobReport (or ApplicationError -> ProtocolError)
```

`jobs` 入口不读 Store、不调用 Port、不创建事务；application service 是唯一的编排者。
`JobMetadata.system_actor` 必须是允许的 System/Operator context，`source_watermark`、
`job_key` 和 correlation 由 metadata 提供；不存在真实 run id、scheduler lease、测试结果、
验收签署或 evidence alias。

### 2.2 幂等预检与报告提交

```rust
/// Runs one validated bounded Job request and returns an exact replayable report.
async fn run_job(
    request: ToolJobRequest,
    metadata: JobMetadata,
) -> Result<JobReport, ApplicationError> {
    metadata.validate()?;
    let digest = canonical_job_digest(&request, &metadata)?;
    let scope = IdempotencyScope::for_job(request.kind(), metadata.system_actor.authority_ref());
    if let Some(record) = idempotency.get(&scope, &metadata.job_key.into()).await? {
        return classify_job_duplicate(record, &digest).await;
    }

    let claim_uow = uow_manager.begin().await?;
    let reservation = idempotency.reserve(IdempotencyRecord::for_job(
        scope.clone(), metadata.job_key.clone(), digest.clone(),
    ), &*claim_uow).await?;
    let claim = require_new_job_claim(reservation)?;
    commit_confirmed(claim_uow).await?;

    // Application-local dispatch; this is not a new Store or Port method.
    let plan = plan_bounded_targets(&request, &metadata)?;
    let mut outputs = Vec::new();
    for target in plan.targets() {
        verify_same_job_claim(&claim, &scope, &metadata.job_key, &digest).await?;
        // Application-local target dispatch; each branch names an existing Step 7 seam.
        let target_result = process_one_target(target, &metadata).await?;
        let committed = commit_target_result(target_result).await?;
        outputs.push(committed);
    }
    let report = assemble_report(&request, &metadata, outputs, plan.next_cursor())?;
    let uow = uow_manager.begin().await?;
    let claim = continue_same_job_claim(claim, &*uow).await?;
    let report_ref = idempotency.store_job_report(report.clone(), &*uow).await?;
    complete_job_claim(&claim, report_ref, &*uow)?;
    commit_confirmed(uow).await?;
    Ok(report)
}
```

Job 在任何 target read、write 或 external feedback call 前，先以独立 UoW 提交一个技术
claim。每个 target 开始前重新验证同一 claim 的 scope/key/digest/lease；最终 report UoW
通过 `continue_claim` 完成同一记录。claim 不能只留在内存，也不能把一个新 claim 当作
旧 target set 的继续。target UoW 和最终 report UoW 的具体边界由本附录各卡固定，不能由
worker 自行调整。

公共规则：

| 规则 | 可接受行为 | 禁止行为 |
|---|---|---|
| bounded | `JobSlice { cursor, limit }` 只计划一个有限页 | `all`、隐式全表扫描、在服务内无限循环 |
| watermark | 所有 target read 使用 `metadata.source_watermark` 或请求声明的同一水位 | 用当前时间、page cursor 或最新外部状态替换水位 |
| version | versioned subject 使用 Store 返回的 `Loaded<T>.expected_version` | 猜 `0/1`、用 source revision 代替本地 CAS token |
| commit | 每个 target 的局部写在自己的 UoW 内，commit unknown 必须同 authority resolve | 盲目重试写入或把多个不可界定 target 合并成超大事务 |
| report | report 只引用已提交 output/gap/projection refs | 从内存计数器伪造已完成结果 |
| duplicate | 已提交相同 digest 直接回放 `JobReport` | 重扫 target、再次调用外部 Port、重新写 projection |
| repair boundary | 只 append assessment/gap/status/ref、写 D1 projection/report | 修复 Contract/Binding/Invocation/Outcome/Audit 或创建外部 truth |

### 2.3 Job report 构造与计数守恒

```rust
/// Builds a body-free report from durable target outcomes only.
fn assemble_report(
    job: ToolJobName,
    key: JobRunKey,
    requested: LocalTruthWatermark,
    processed: LocalTruthWatermark,
    outcomes: &[CommittedJobTargetResult],
    next_cursor: Option<JobCursor>,
    correlation: CorrelationRef,
) -> Result<JobReport, ApplicationError>;
```

`JobReport.job: ToolJobName` is the canonical public field. The older
`JobReport.job_kind: ToolJobKind` carrier in the Step 6 shared-carrier draft is retained only as
`historical_material`; it is not a second field or a second enum. The application maps the selected
`ToolJobRequest` variant to `ToolJobName` before report assembly and duplicate replay compares that
same name. No implementation may silently choose between the two names.

The following names are application-local helpers (pure dispatch, mapper, or bounded orchestration
functions) used to make the flow explicit. They do not extend Step 7 and must not be implemented as
new repository/Port methods: `plan_bounded_targets`, `process_one_target`,
`plan_binding_targets`, `process_binding_target`, `plan_reference_targets`,
`process_reference_target`, `load_reference_target_at_watermark`, `load_projection_source_bundle`,
`rebuild_projection_target`, `stored_feedback_request`, `map_feedback_resolution`,
`append_optional_gap`, `map_projection_write_result`, and `assemble_report`.

`JobSafeCounts` 的 `examined` 等字段只能由 `CommittedJobTargetResult` 聚合。每个 target
必须恰好落入 `created/updated/unchanged/gaps_opened/failed` 的操作语义；已知 local
conflict 不得同时计为 updated。`Partial` 必须有 gap 或 `next_cursor`；`Blocked` 必须有
至少一个 blocker/gap；`NoOpDuplicate` 保留原 report 的所有 refs、counts、watermark 和
cursor。report 不是实现成功、测试通过或验收签署。

### 2.4 公共失败与恢复图

```text
[target planned]
  -> read failure / malformed bundle
       -> no target UoW commit
       -> target failed or typed gap
  -> local UoW commit known rollback
       -> target failed; next target may continue
  -> commit outcome unknown
       -> resolve_commit(transaction_ref)
          +-- Committed: load durable output and count it
          +-- RolledBack: mark target failed/gap; do not replay external call
          +-- Unknown: stop report completion, return Blocked/Failed + manual-owner gap
  -> external Port call (only JF-04)
       -> exactly one call per target
       -> ambiguous: status unknown; no automatic second call
```

## 3. JF-01 `CheckCapabilityBindingConsistency`

### 3.1 Entry / input / target / result

| 项目 | 闭合契约 |
|---|---|
| Entry | `ToolJobUseCases::run(ToolJobRequest::CheckCapabilityBindingConsistency, JobMetadata)` |
| Owner | `application::binding_consistency_job` |
| Input | `CheckCapabilityBindingConsistencyRequest { scope, slice }` |
| Scope correction | `scope.tool_ids` 必须非空、canonical sort、deduplicated，并受 slice limit 约束；空集合返回 `InvalidInput`，不代表 all。 |
| Target order | `(tool_id, binding_id)`；每个 tool 通过 `CapabilityBindingStore::find_current_by_tool` 读取至多一个当前 relation。 |
| Local writes | `HubControlledSnapshot`、immutable `CapabilityBindingAssessment`、typed `ConsistencyGap`、`ReferenceConsistencyReport`、JobReport。 |
| External call | 仅 bound relation 调 `HubControlledSourcePort::resolve_snapshot`；`ExplicitUnbound` 不调用。 |
| Result | `JobReport`，output refs 必须列出每个 snapshot/assessment/gap/report ref。 |

### 3.2 ASCII call graph

```text
[jobs::ToolJobEntry]
  -> validate request/metadata (non-empty tool_ids, cursor, watermark)
  -> ToolJobUseCases::run
  -> IdempotencyStore::get(scope, job_key)
       +-- committed equal -> IdempotencyStore::get_job_report -> replay
       +-- different digest -> Conflict; zero writes
  -> for each explicit tool_id in stable order
       -> CapabilityBindingStore::find_current_by_tool(tool_id)
       -> absent -> unchanged target (no Hub call)
       -> ExplicitUnbound -> CapabilityBindingAssessment::assess(binding, None, now)
       -> Bound -> HubControlledSourcePort::resolve_snapshot(request)
       -> map resolution -> HubControlledSnapshot / assessment / gap
       -> target UoW: append snapshot, append assessment, create/reuse gap
       -> commit / resolve_commit
  -> ProjectionStore::write_consistency_report(report, report_uow)
  -> IdempotencyStore::store_job_report + complete claim
  -> JobReport
```

### 3.3 Typed target planner

```rust
/// Returns one deterministic page from explicit tool IDs; no global discovery exists.
fn plan_binding_targets(
    scope: &CapabilityBindingConsistencyScope,
    slice: &JobSlice,
) -> Result<BoundedTargetPlan<ToolId>, ApplicationError> {
    let tool_ids = scope.tool_ids.canonical_non_empty()?;
    let ids = apply_job_cursor(tool_ids, slice.cursor.as_ref())?;
    Ok(BoundedTargetPlan::new(ids.take(slice.limit.value()), stable_tool_order))
}
```

For each planned `tool_id`, the Store returns at most one current relation. A missing relation is
an examined/unchanged target and does not create a Binding, assessment or Hub snapshot. A Store
page error is a typed failed target; it is not evidence that the relation is absent.

### 3.4 Typed pseudocode and per-target UoW

```rust
async fn process_binding_target(
    tool_id: ToolId,
    scope: &CapabilityBindingConsistencyScope,
    metadata: &JobMetadata,
) -> Result<CommittedJobTargetResult, ApplicationError> {
    let binding = binding_store.find_current_by_tool(&tool_id).await?;
    let Some(binding) = binding else {
        return Ok(CommittedJobTargetResult::unchanged(TypedSubjectRef::tool(tool_id)));
    };
    let now = clock.now()?.as_consumption_time();
    let mut snapshot = None;
    let mut gap = None;
    let assessment = match &binding.value.mode {
        BindingMode::ExplicitUnbound => {
            CapabilityBindingAssessment::assess(&binding.value, None, now)?
        }
        BindingMode::Bound => {
            let candidate = binding.value.capability_ref.clone()
                .ok_or(ApplicationError::IntegrityFailure)?;
            let request = HubControlledSourceRequest::from_binding(
                &binding.value, candidate, metadata.correlation_ref.clone(),
            )?;
            match hub_port.resolve_snapshot(&request).await? {
                PortResolution::Available(resolution) => {
                    let value = HubControlledSnapshot::from_port(resolution, now)?;
                    snapshot = Some(value.clone());
                    CapabilityBindingAssessment::assess(&binding.value, Some(&value), now)?
                }
                PortResolution::Blocked(reason) | PortResolution::Unavailable(reason) => {
                    gap = Some(ConsistencyGap::detect_reference_blocked(
                        GapSubjectRefSet::for_binding(&binding.value, None),
                        reason.into_gap_class(), GapImpactClass::Blocking, now,
                    )?);
                    CapabilityBindingAssessment::assess_unverifiable(
                        &binding.value, gap.as_ref(), now,
                    )?
                }
                PortResolution::Conflicting(reason) => {
                    gap = Some(ConsistencyGap::detect_reference_conflict(
                        GapSubjectRefSet::for_binding(&binding.value, None),
                        reason.into_gap_class(), now,
                    )?);
                    CapabilityBindingAssessment::assess_conflicting(
                        &binding.value, gap.as_ref(), now,
                    )?
                }
            }
        }
    };

    let uow = uow_manager.begin().await?;
    let snapshot_ref = match snapshot {
        Some(value) => Some(binding_store.append_snapshot(value, &*uow).await?.into_ref()?),
        None => None,
    };
    // Application-local immutable-basis mapper; it accepts only the ref returned by this UoW.
    let assessment = assessment.with_snapshot_ref(snapshot_ref.clone())?;
    let assessment_ref = binding_store.append_assessment(assessment, &*uow).await?.into_ref()?;
    let gap_ref = match gap {
        Some(value) => Some(projection_store.create_gap(value, &*uow).await?.value.gap_ref()),
        None => None,
    };
    commit_confirmed(uow).await?;
    Ok(CommittedJobTargetResult::binding(
        tool_id, snapshot_ref, assessment_ref, gap_ref,
    ))
}
```

`with_snapshot_ref` 是应用层对 assessment basis 的受控闭口 mapper；它只能把同一 UoW
刚返回的 `HubSnapshotRef` 写入 assessment，不能接受 caller ID。若 Store 返回
`AppendResult::ExistingEqual`，必须验证完整 canonical content 后复用 ref；不同 basis
或内容冲突则回滚该 target 并返回 integrity failure。

### 3.5 报告、重入、错误和测试切口

| 情形 | 精确行为 |
|---|---|
| 正常 Bound + 可验证 snapshot | append snapshot/assessment，报告 `created/updated` 按实际 append 计数。 |
| ExplicitUnbound | assessment 为 `AcceptedExplicitUnbound`；无 Hub call、无 snapshot；不能把缺失 relation 当 explicit-unbound。 |
| 无 current binding | `examined + unchanged`；不写 assessment/gap，不创建 relation。 |
| Hub Blocked/Unavailable | assessment 为 conservative state，创建 attributable gap，报告 `Partial` 或所有 target blocked 时 `Blocked`。 |
| same key/digest duplicate | 只读 `get_job_report` 回放 `NoOpDuplicate`；零 Store/Port target 调用。 |
| different digest | `Conflict`，零 target writes。 |
| CAS/commit unknown | 同 authority `resolve_commit`；无法证明时停止报告完成并保留 manual-owner gap。 |
| 禁止修复 | 不调用 Declare/Replace/Invalidate Command，不扫描 Hub registry，不改变 relation/lifecycle/invocation anchor。 |

最小测试切口：显式绑定成功、显式 unbound、缺 relation、Hub stale/conflict/blocked、重复
tool ID、空 tool ID、cursor watermark mismatch、target CAS conflict、commit unknown 三分支、
duplicate report 零调用、fake/durable 同序列同 output refs。

JF-01 stop review: `pass with controlled scope correction`。

## 4. JF-02 `CheckReferenceIntegrity`

### 4.1 Entry / target matrix

| 项目 | 闭合契约 |
|---|---|
| Entry | `ToolJobUseCases::run(ToolJobRequest::CheckReferenceIntegrity, JobMetadata)` |
| Owner | `application::reference_integrity_job` |
| Input | `CheckReferenceIntegrityRequest { inspection_scope, target_kinds, slice }` |
| Target order | `(target_kind ordinal, typed subject ref, assessed ref)`；同一 target 只处理一次。 |
| Local writes | `ReferenceValidityAssessment`、`ConsistencyGap`、`ReferenceConsistencyReport`、JobReport。 |
| Source rule | 只读取 named local Store 和 Step 7 已列的 matching Port；缺少 seam 的 kind 显式 blocked。 |
| Result | `JobReport`；报告必须引用每个 assessment/gap/report ref。 |

### 4.2 Target-kind seam table

| Target kind | Read source / Port | Positive path | Missing seam behavior |
|---|---|---|---|
| `ContractSource` | `ToolContractStore::get_current_bundle/get_definition`；shared authority 只在已闭合时使用 | local definition/source assessment | 未闭合 Core authority -> `Unverifiable`/`Blocked`，不发明 query |
| `HubCapability` | `CapabilityBindingStore::get_binding/get_snapshot`；必要时 `HubControlledSourcePort::resolve_snapshot` | binding/snapshot assessment | Port blocked/unavailable -> assessment + gap |
| `AuthorizationResult` | `ExecutionHandoffStore::list_authorization_assessments_by_result` | reference assessment | source result absent/unavailable -> missing/unverifiable gap |
| `SandboxReadiness` | `ExecutionHandoffStore::get_sandbox_readiness` | readiness ref assessment | mapping/open source -> blocked gap |
| `SandboxExecutionSource` | `OutcomeAuditStore::get_source_assessment` | source ref assessment | missing source assessment -> missing gap |
| `BusDeliveryStatus` | `ExternalSubmissionStore::get_latest_bus_status` | status ref assessment | no formal status or route -> unverifiable gap |
| `ObservationMaterial` | `ExternalSubmissionStore::get_latest_observation_status` | observation ref assessment | absent material is unknown, not observed; gap if required |
| `SharedContractAuthority` | no positive Step 7 read seam | none | always `Unverifiable`/`Blocked` until `L2T-UP-008` closes |

The table is an explicit construction matrix, not permission to call a non-existent generic
`ReferencePort`. For a target whose typed subject cannot be loaded at the requested watermark,
the job records a conservative assessment only when the subject/ref identity is attributable;
otherwise it records a bounded job failure/gap without fabricating a subject.

### 4.3 ASCII call graph

```text
[jobs::ToolJobEntry]
  -> validate scope/kinds/cursor/watermark
  -> IdempotencyStore::get / duplicate classification
  -> plan typed targets from explicit inspection scope
  -> for each target
       -> named Store read at source_watermark
       -> choose exact existing Port only for target kind
       -> ReferenceValidityAssessment::{assess_valid|assess_missing|assess_conflicting|assess_unverifiable}
       -> target UoW: ProjectionStore::append_reference_assessment
       -> optional ProjectionStore::create_gap
       -> commit/resolve_commit
  -> aggregate durable refs
  -> ReferenceConsistencyReport::{build_complete|build_partial|failed}
  -> ProjectionStore::write_consistency_report
  -> IdempotencyStore::store_job_report + complete claim
  -> JobReport
```

### 4.4 Typed target planning and pseudocode

```rust
/// Expands only typed scope members into a bounded, stable inspection page.
fn plan_reference_targets(
    scope: &ReferenceInspectionScope,
    kinds: &ReferenceInspectionTargetKindSet,
    slice: &JobSlice,
) -> Result<BoundedTargetPlan<ReferenceInspectionTarget>, ApplicationError>;

async fn process_reference_target(
    target: ReferenceInspectionTarget,
    metadata: &JobMetadata,
) -> Result<CommittedJobTargetResult, ApplicationError> {
    let read = load_reference_target_at_watermark(&target, metadata.source_watermark).await?;
    let assessment = match read {
        ReferenceTargetRead::Valid(input) => ReferenceValidityAssessment::assess_valid(
            input.subject_ref, input.assessed_ref, input.authority_ref,
            input.source_revision, input.basis_refs, clock.now()?.as_consumption_time(),
        )?,
        ReferenceTargetRead::Missing(input) => ReferenceValidityAssessment::assess_missing(
            input.subject_ref, input.assessed_ref, input.basis_refs,
            clock.now()?.as_consumption_time(),
        )?,
        ReferenceTargetRead::Blocked(input) => ReferenceValidityAssessment::assess_unverifiable(
            input.subject_ref, input.assessed_ref, input.basis_refs,
            clock.now()?.as_consumption_time(),
        )?,
        ReferenceTargetRead::Conflicting(input) => ReferenceValidityAssessment::assess_conflicting(
            input.subject_ref, input.assessed_ref, input.basis_refs,
            clock.now()?.as_consumption_time(),
        )?,
    };
    let gap = assessment.requires_gap()
        .then(|| ConsistencyGap::detect_from_assessment(&assessment, clock.now()?.as_detection_time()))
        .transpose()?;
    let uow = uow_manager.begin().await?;
    let assessment_ref = projection_store.append_reference_assessment(assessment, &*uow)
        .await?.into_ref()?;
    let gap_ref = match gap {
        Some(value) => Some(projection_store.create_gap(value, &*uow).await?.value.gap_ref()),
        None => None,
    };
    commit_confirmed(uow).await?;
    Ok(CommittedJobTargetResult::reference(assessment_ref, gap_ref))
}
```

`load_reference_target_at_watermark` 不是新 Port；它是 application 的 closed match，内部
只可调用本表列出的现有方法。若某个 target kind 需要一个未列方法，函数必须返回
`ReferenceTargetRead::Blocked`，并在 R-9 blocker matrix 中记录，不得通过 trait object、
字符串路由或 `get_latest_*` 猜测另一个 owner 的 truth。

### 4.5 报告、重复、部分失败和测试切口

| 情形 | 精确行为 |
|---|---|
| 全部 target 有可归因 assessment | `Completed`；报告在同一 requested/processed watermark 生成。 |
| 一部分 source unavailable/blocked | 每个可归因 target append assessment + gap；报告 `Partial`；无归因 target 计 `failed`。 |
| `SharedContractAuthority` | 产生明确 `UnverifiableReference` gap；不调用未定义 authority lookup。 |
| 扫描未发现旧 gap | 不因 absence 自动关闭 gap；只有正式 `CF-13` 可请求/验证 resolution。 |
| target page 有下一页 | 当前页报告带 `next_cursor` 和 `Partial/Completed`（取决于是否有 gap）；不得内部继续扫。 |
| duplicate/conflict | 同 digest 回放原 report；同 key 不同 digest `Conflict`，零 target 调用。 |
| local conflict/commit unknown | 目标 UoW 回滚或 resolve；未确认输出不进入 report。 |
| 禁止修复 | 不改 subject/ref/owner truth，不创建 external registry/ref，不写 evidence/signoff。 |

最小测试切口：每个 target kind 的 valid/missing/blocked/conflict，unknown source、same
subject different authority、page continuation、absence-not-close、duplicate zero-call、
report source-watermark mismatch、target rollback、fake/durable assessment/ref parity。

JF-02 stop review: `pass with explicit blocked seams`。

## 5. JF-03 `RebuildToolDerivedViews`

### 5.1 Entry / target / projector matrix

| 项目 | 闭合契约 |
|---|---|
| Entry | `ToolJobUseCases::run(ToolJobRequest::RebuildToolDerivedViews, JobMetadata)` |
| Owner | `application::derived_view_rebuild_job` |
| Input | `RebuildToolDerivedViewsRequest { scope, slice }` |
| Target planner | `ProjectionStore::list_projection_targets(ProjectionRebuildScope, RepositoryPageRequest)`；返回的 `ProjectionTargetRef` 是唯一 target identity authority。 |
| Target order | Store 返回的 stable order；application 只验证 cursor/watermark，不重排成物理 row order。 |
| External call | none；JF-03 不调用 Hub、Authorization、Sandbox、Bus、Observability 或 SDK seam。 |
| Local writes | 一个 target 一个 projection compare-write；必要时 append derived gap；最终 `JobReport`。 |
| Result | `Applied` / `AlreadyCurrent` / `StaleInput` / `Conflict` / `Unavailable` 通过 `ProjectionWriteResult` 进入 `output_refs`。 |

### 5.2 View kind 到纯 projector / Store 方法

| `ProjectionTargetRef` kind | 完整本地输入 | 纯 projector | 唯一写方法 |
|---|---|---|---|
| `ReferenceConsistencyReport` | bounded `ReferenceValidityAssessment` + gaps + same watermark | `ReferenceConsistencyReport::build_complete/build_partial/failed` | `ProjectionStore::write_consistency_report` |
| `ToolContractSearch` | `ToolContractReadBundle` | `ToolContractSearchProjection::project` | `ProjectionStore::write_search_projection` |
| `ToolContractDiff` | `ToolDefinitionComparisonReadBundle` | `ToolContractDiffSummary::compare` | `ProjectionStore::write_diff_summary` |
| `ToolDiagnostic` | named local diagnostic read set | `ToolDiagnosticSummary::derive` | `ProjectionStore::write_diagnostic_summary` |
| `ToolConsumerGuidance` | contract/definition/binding safe bundle | `ToolConsumerGuidanceView::project` | `ProjectionStore::write_consumer_guidance` |

如果某种 target 缺少一份完整的 Step 7 local read bundle，Job 必须输出该 target 的
`Unavailable`/`Failed` `ProjectionWriteResult` 和 attributable gap；不得用 current truth
临时拼接、跳过必填字段或把旧 projection 当作新 source watermark 的成功结果。

### 5.3 ASCII call graph

```text
[jobs::ToolJobEntry]
  -> validate scope/view/revision/consumer selectors + JobSlice
  -> IdempotencyStore::get
       +-- committed equal -> get_job_report -> NoOpDuplicate
       +-- digest conflict -> Conflict; zero target reads/writes
  -> ProjectionStore::list_projection_targets(scope, page)
  -> for each ProjectionTargetRef in returned stable page
       -> load complete local truth bundle at requested watermark
       -> pure projector by closed target kind
       -> target UoW: ProjectionStore::write_* (compare-write)
       -> optional ProjectionStore::create_gap
       -> commit / resolve_commit
  -> assemble durable target outcomes + optional next cursor
  -> report UoW: IdempotencyStore::store_job_report + complete claim
  -> JobReport
```

### 5.4 Typed target dispatch

```rust
/// Dispatches one existing target to the closed pure projector and projection writer.
async fn rebuild_projection_target(
    target: ProjectionTargetRef,
    metadata: &JobMetadata,
) -> Result<CommittedJobTargetResult, ApplicationError> {
    let source = load_projection_source_bundle(&target, metadata.source_watermark).await?;
    let write_result = match target.kind() {
        DerivedViewKind::ReferenceConsistencyReport => {
            let report = build_reference_report_from_source(source.reference_report()?)?;
            let uow = uow_manager.begin().await?;
            let result = projection_store.write_consistency_report(report, &*uow).await?;
            commit_confirmed(uow).await?;
            result
        }
        DerivedViewKind::ToolContractSearch => {
            let (bundle, binding) = source.search_bundle()?;
            let value = ToolContractSearchProjection::project(
                &bundle.contract.value, &bundle.current_definition.value,
                binding.as_ref(), bundle.source_watermark,
                target.schema_version(),
            )?;
            let uow = uow_manager.begin().await?;
            let result = projection_store.write_search_projection(value, &*uow).await?;
            commit_confirmed(uow).await?;
            result
        }
        DerivedViewKind::ToolContractDiff => {
            let bundle = source.definition_comparison_bundle()?;
            let value = ToolContractDiffSummary::compare(
                &bundle.base_definition.value, &bundle.target_definition.value,
                bundle.matching_impact.as_ref(), bundle.source_watermark,
            )?;
            let uow = uow_manager.begin().await?;
            let result = projection_store.write_diff_summary(value, &*uow).await?;
            commit_confirmed(uow).await?;
            result
        }
        DerivedViewKind::ToolDiagnostic => {
            let read_set = source.diagnostic_read_set()?;
            let value = ToolDiagnosticSummary::derive(
                target.diagnostic_subject()?, read_set, metadata.source_watermark,
            )?;
            let uow = uow_manager.begin().await?;
            let result = projection_store.write_diagnostic_summary(value, &*uow).await?;
            commit_confirmed(uow).await?;
            result
        }
        DerivedViewKind::ToolConsumerGuidance => {
            let (bundle, binding, gaps) = source.guidance_bundle()?;
            let value = ToolConsumerGuidanceView::project(
                &bundle.contract.value, &bundle.current_definition.value,
                binding.as_ref(), target.consumer_kind()?, gaps,
                bundle.source_watermark,
            )?;
            let uow = uow_manager.begin().await?;
            let result = projection_store.write_consumer_guidance(value, &*uow).await?;
            commit_confirmed(uow).await?;
            result
        }
    };
    map_projection_write_result(target, write_result)
}
```

`load_projection_source_bundle` 只由 application 按 target kind 的闭合 Store match 实现；
它不能触发 Job、Query、external Port 或 projection refresh。每次 compare-write 的
`requested_watermark` 必须等于 target plan 的水位；`Applied` 只有在 Store 返回
`stored_watermark` 与 `stored_version` 后才可计数。`AlreadyCurrent` 是无写入的幂等成功，
但仍是已分类 target；`StaleInput`、`Conflict`、`Unavailable` 不能被映射成 `Applied`。

### 5.5 UoW、cursor、失败与测试切口

| 情形 | 精确行为 |
|---|---|
| target page 返回 next cursor | 当前 bounded page 完成，report 携带同 digest/watermark 的 `next_cursor`；不在本次调用继续读取。 |
| source bundle 缺失/水位不一致 | target 不写 projection；记录 `Unavailable`/`StaleInput` 和 gap，继续其他独立 target。 |
| projection content conflict | Store 返回 `Conflict`；保留 conflict output/gap，不覆盖已有 projection。 |
| duplicate report | 读取 `IdempotencyStore::get_job_report`，不调用 `list_projection_targets`、projector 或 write 方法。 |
| commit unknown | resolve 同一 transaction；只在 `Committed` 且 output ref 可读时计入 report；`Unknown` 使 Job `Failed/Blocked`。 |
| 禁止修复 | 不保存 Contract/Definition/Binding/Invocation/Outcome，不刷新外部来源，不改变 stale source truth。 |

最小测试切口：五种 view kind 的完整 source bundle、每种 projector 的 body-free 字段对称、
Applied/AlreadyCurrent/StaleInput/Conflict/Unavailable、旧水位拒写、新 cursor、缺 source
bundle、duplicate 零写、unknown commit、fake/durable compare-write parity。

JF-03 stop review: `pass`；projection source、projector、writer、report ref 和 no-repair
边界均可从 Step 6/7/8 回指。

## 6. JF-04 `RefreshExternalStatusRefs`

### 6.1 Entry / target / status-family contract

| 项目 | 闭合契约 |
|---|---|
| Entry | `ToolJobUseCases::run(ToolJobRequest::RefreshExternalStatusRefs, JobMetadata)` |
| Owner | `application::external_status_refresh_job` |
| Input | `ExternalStatusRefreshScope { submission_attempt_ids, status_families, only_unknown_or_stale }` + `JobSlice` |
| Target plan | 显式 attempt IDs 按 canonical order；空集合才允许调用 `ExternalSubmissionStore::list_attempts(scope, page)` 做一个 bounded local page。 |
| Target order | `(attempt_id, ExternalStatusFamily ordinal)`；Bus 和 Observation 是两个独立 target。 |
| External call | 每个 eligible target 至多一次 `SafeEventCollaborationPort::resolve_bus_delivery` 或 `resolve_observation`，请求必须是 `ResolveStored`。 |
| Local writes | append-only `BusDeliveryStatusRef` / `ObservationMaterialRef`、typed `ConsistencyGap`、JobReport。绝不保存 attempt/outcome/audit。 |
| Result | `JobReport` 的 output refs 标明每个 status ref/gap；local `SubmittedLocally` 不转译为 delivered/observed。 |

`only_unknown_or_stale=true` 时，application 先读取已存 latest ref；有 formal fresh ref 的
target 被计为 `unchanged`，不调用反馈 Port。缺少 ref、unknown、stale 或 conflict 才进入
feedback call。latest 选择遵守 Step 7 的 authority consumption frame；不能按到达时间猜
最新状态。

### 6.2 ASCII call graph

```text
[jobs::ToolJobEntry]
  -> validate scope/families/slice/watermark
  -> IdempotencyStore::get + same-key digest classification
       +-- replay -> get_job_report; zero Store page / Port calls
  -> explicit IDs OR ExternalSubmissionStore::list_attempts(bounded page)
  -> for each (attempt, family)
       -> load attempt/material/event identity + latest family ref
       -> fresh and filter excludes target -> unchanged
       -> build ResolveStored request from committed attempt fields
       -> one feedback Port call outside UoW
       -> map formal response or blocker to status ref/gap
       -> target UoW: append status ref and/or create gap
       -> commit / resolve_commit; never retry Port after local uncertainty
  -> assemble report + optional next cursor
  -> continue claim, store JobReport, commit
  -> JobReport
```

### 6.3 Typed request mapping and feedback result mapping

```rust
/// Builds the exact stored-feedback request from a loaded local attempt.
fn stored_feedback_request(
    attempt: &Loaded<ExternalSubmissionAttempt>,
    family: ExternalStatusFamily,
    correlation: CorrelationRef,
) -> Result<StoredFeedbackRequest, ApplicationError>;

async fn refresh_status_target(
    attempt: Loaded<ExternalSubmissionAttempt>,
    family: ExternalStatusFamily,
    scope: &ExternalStatusRefreshScope,
    metadata: &JobMetadata,
) -> Result<CommittedJobTargetResult, ApplicationError> {
    let latest = match family {
        ExternalStatusFamily::BusDelivery =>
            submission_store.get_latest_bus_status(&attempt.value.attempt_id).await?,
        ExternalStatusFamily::ObservationMaterial =>
            submission_store.get_latest_observation_status(&attempt.value.attempt_id).await?,
    };
    if scope.only_unknown_or_stale && latest.as_ref().is_some_and(is_formal_fresh_status) {
        return Ok(CommittedJobTargetResult::unchanged_status(
            attempt.value.attempt_id.clone(), family,
        ));
    }

    let request = stored_feedback_request(&attempt, family, metadata.correlation_ref.clone())?;
    let resolution = match family {
        ExternalStatusFamily::BusDelivery => {
            collaboration.resolve_bus_delivery(&request.into_bus()?).await?
        }
        ExternalStatusFamily::ObservationMaterial => {
            collaboration.resolve_observation(&request.into_observation()?).await?
        }
    };
    let now = clock.now()?.as_consumption_time();
    let local = map_feedback_resolution(&attempt.value, family, resolution, now)?;

    let uow = uow_manager.begin().await?;
    let (status_ref, gap_ref) = match local {
        LocalStatusMaterial::Bus(value, gap) => {
            let status = submission_store.append_bus_status(value, &*uow).await?.into_ref()?;
            let gap = append_optional_gap(gap, &*uow).await?;
            (Some(LocalResultRef::BusStatus(status)), gap)
        }
        LocalStatusMaterial::Observation(value, gap) => {
            let status = submission_store.append_observation_status(value, &*uow).await?.into_ref()?;
            let gap = append_optional_gap(gap, &*uow).await?;
            (Some(LocalResultRef::ObservationStatus(status)), gap)
        }
        LocalStatusMaterial::Gap(value) => {
            let gap = projection_store.create_gap(value, &*uow).await?.value.gap_ref();
            (None, Some(gap))
        }
    };
    commit_confirmed(uow).await?;
    Ok(CommittedJobTargetResult::status(
        attempt.value.attempt_id.clone(), family, status_ref, gap_ref,
    ))
}
```

`stored_feedback_request` 是闭合的 application-local 纯 mapper：Bus 只能构造
`BusDeliveryFeedbackRequest::ResolveStored(StoredBusDeliveryResolutionRequest)`，Observation
只能构造 `ObservationFeedbackRequest::ResolveStored(StoredObservationResolutionRequest)`。
它必须从同一 loaded attempt 的 `target_class`、`external_submission_locator`、
`route_contract_revision` 和 correlation 读取字段；不能从 Job caller 补写 locator、route、
attempt 或 event identity。`ResolveStored` 与 `ValidateInbound` 不能互换。

`map_feedback_resolution` 是 application-local 纯 mapper，其闭合规则：

| Port 结果 | Bus | Observation | Report effect |
|---|---|---|---|
| `Available(formal)` | `BusDeliveryStatusRef::from_feedback` | `ObservationMaterialRef::from_formal_source` | append status ref；仅表示有 formal status ref |
| `Blocked` | `BusDeliveryStatusRef::unknown` + `RouteBlocked`/mapping gap | `ObservationMaterialRef::route_blocked` | append conservative ref/gap，`Partial/Blocked` |
| `Unavailable` | `unknown` + `ExternalStatus` gap | `unknown` + `ExternalStatus` gap | no success inference; retry hint belongs to report/error, not external retry |
| `Conflicting` / identity mismatch | `unknown` or conflict ref + integrity gap | `unknown` or conflict ref + integrity gap | `IntegrityCritical` gap；不覆盖已有 ref |
| `PortCallError` / ambiguous adapter result | no claimed positive status; typed unknown gap | no claimed positive status; typed unknown gap | target failed/partial；不发起第二次 call |

For an exact formal feedback response, `from_feedback` / `from_formal_source` must verify
attempt ID, authority, locator, source/route revision and correlation symmetry. A response that
does not prove these fields is not a valid `Available` response.

### 6.4 External-call fence and recovery

```text
committed Job claim + loaded local attempt
  -> one ResolveStored Port call (outside any UoW)
  -> phase-2 local UoW append status/gap
  -> commit / resolve_commit
```

Feedback resolution is observational, but its local result still follows external-before-local
discipline. If the Port call returns an ambiguous `PortCallError`, the target receives an unknown
gap and no second call is permitted in this invocation. If the phase-2 commit is unknown, the
application resolves the same local transaction; it must not call the feedback Port again merely
because the append result is not immediately visible. A claimed Job with an unresolved target is
`Partial`/`Failed` and remains an explicit manual-recovery item; it is not silently released as a
new claim.

### 6.5 Duplicate, blocked, partial and test cuts

| 情形 | 精确行为 |
|---|---|
| explicit attempt IDs | 只处理 caller 明确给出的 bounded set；不存在的 attempt 是 failed/blocked，不查外部。 |
| empty attempt IDs | 仅做一个 `list_attempts` bounded page；next cursor 进入 report，不隐式全量。 |
| fresh formal latest status + filter | `unchanged`，零 feedback call。 |
| local SubmittedLocally without feedback | unknown/stale target；不映射成 Delivered/Observed。 |
| route/source blocker | append conservative status or gap，report `Partial/Blocked`；不发明 polling endpoint。 |
| duplicate | `NoOpDuplicate` replay，零 list/get/feedback/write。 |
| same key different digest | `Conflict`，零 target effect。 |
| local append conflict/commit unknown | no second feedback call；target gap/failed，report 不伪造 status ref。 |
| forbidden mutation | 不保存 attempt、outcome、audit，不写 Bus/Observability store，不做 delivery retry/DLQ/retention。 |

最小测试切口：Bus/Observation family 独立 dispatch、explicit/scan scope、fresh skip、unknown
and stale refresh、formal response symmetry、blocked/unavailable/conflict/ambiguous result、
exactly-one call counter、phase-2 commit unknown no-call-retry、duplicate zero-call、next cursor、
fake/durable feedback parity。

JF-04 stop review: `pass with explicit external status blockers`。

## 7. 批次中间停审

| Review item | Result | Evidence |
|---|---|---|
| All four Jobs each have entry, target, graph, typed sequence and result | pass | §3~§6 |
| Every callable is in Step 7 or explicitly blocked | pass | §3.2 / §4.2 / §5.2 / §6.3 |
| UoW/version/commit-unknown is explicit | pass | §2.2 / §2.4 / per-target pseudocode |
| Duplicate does not rescan or call external Port | pass | §2.2 / per-card tables |
| No subject repair or fabricated evidence | pass | §2.2 / §3.5 / §4.5 |
| `tool_ids` empty global scan conflict handled | pass | §1 / §3.1 |
| External feedback call has one-call fence and no retry on local uncertainty | pass | §6.2 / §6.4 |

## 8. Job batch completion

| Review item | Result |
|---|---|
| Four independent request schemas map to `JF-01~04` | pass |
| Target planner, cursor, watermark and bounded page are explicit | pass |
| Every target has local UoW/version/commit-resolution behavior | pass |
| JobReport counts/output refs/gaps are constructible from durable results | pass |
| Duplicate replay performs no rescan, write or external call | pass |
| No scheduler/run/lease/evidence/signoff or core-subject repair truth | pass |
| Hub/authority/Sandbox/Bus/Observation blockers remain honest | pass |

```text
batch_status = completed / pass
completed_flows = JF-01, JF-02, JF-03, JF-04
next_allowed_action = read Step 10 inputs and create the state-matrix intermediate product
formal_03_write_allowed = false
commit_required = false
```
