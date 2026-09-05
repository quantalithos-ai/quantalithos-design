# Step 8 附录 CP07. Member Read Model 处理流

> 主控文件: `02_hld_step_08_processing_flows.md`
> 对应接口: Step 7 CP07 的 2 internal committed-fact Consumers、2 Jobs、3 Queries
> 对应对象: Step 6 CP07 的 5 个对象
> 状态: completed / pass / stop_review

## 1. 本部分处理流选择与输入

`MemberProjectionUpdateConsumer` 和 `CapabilityOutletSourceUpdateConsumer` 都会改写 projection support state，必须独立画图。`MemberProjectionRebuildJob` 影响查询一致性，必须独立画图；`GapReconciliationJob` 影响 gap surface / freshness，也必须独立画图，但只能消费 source owner 已提交的 resolution / successor refs，不创建或修改 CP04/05/06 source gap。`GetMemberSummary`、`GetCapabilityOutlet`、`GetMemberDiagnostics` 均含 freshness / optional / not-ready 边界，合并为一张投影 Query 图并逐接口标注差异。

CP07 只拥有 `MemberSummaryView`、`CapabilityOutletView`、`MemberProjectionState`、`MemberDiagnosticView` 和 `ReadProjectionPolicy`。CP01~06 core/support truth、Tools / Method definition、authorization、registry、Conversation / Observability body 与任何 write authority 均外置。

## 2. `MemberProjectionUpdateConsumer` 处理流

```text
<MemberProjectionUpdateConsumer>
  │
  ▼
<Projection Update Consumer>
  - 校验 MemberFactEnvelope envelope、MemberFactId member_fact_id、SchemaVersion schema_version
  - 校验 DeduplicationKey deduplication_key、TraceContext trace_context
  - 读取 MemberCommittedFactRef fact_ref 或 ExternalContextResolutionId resolution_id
  - 确认 source owner 已提交、source watermark 可回链
  │
  ▼
<MemberReadModelService>
  - 定位受影响 MemberProjectionState projection_state
  - 调用 MemberProjectionState.mark_stale(ProjectionWatermark target_watermark, SafeReasonCategory safe_reason)
  - 不读取 forbidden body，不修改 CP01~06 source fact / resolution
  │
  ▼
<MemberProjectionStore>
  - 提交 projection state stale / target watermark 与 rebuild trigger candidate
  │
  ▼
<Projection Receipt / MemberProjectionStateChanged candidate>
  - stale / blocked / duplicate / unknown，不声称 projection 已重建
```

关键设计点：

- Consumer 只标记 projection support state，不直接重建 view；重建由独立 Job 承担。
- source fact / resolution 的 owner、version、watermark 不可证明时，projection 只能 stale / blocked / unknown，不能假定 current。
- event body 不用于重建 forbidden content；只消费 typed refs、safe reason 和 watermark。

## 3. `CapabilityOutletSourceUpdateConsumer` 处理流

```text
<CapabilityOutletSourceUpdateConsumer>
  │
  ▼
<Capability Outlet Update Consumer>
  - 校验 MemberFactEnvelope envelope、MemberFactId member_fact_id、SchemaVersion schema_version
  - 校验 DeduplicationKey deduplication_key、TraceContext trace_context
  - 读取已提交的 ExternalContextResolutionId resolution_id / ExternalContextGapId gap_id
  - 读取其中可带的 ToolContractViewRef tool_contract_ref、CapabilityBindingViewRef binding_ref、MethodDefinitionRef method_ref safe refs
  │
  ▼
<MemberReadModelService>
  - 验证 CP06 committed capability resolution / gap 与其中 safe-view refs 的 scope / freshness
  - 将 `CapabilityOutletView` 标记 available / not_available / stale / gap 的待重建姿态
  - 不读取 definition body、registry、provider route，不形成 invocation authorization
  │
  ▼
<MemberProjectionStore>
  - 提交 outlet stale / gap / not_available marker 与 projection event candidate
  │
  ▼
<Outlet Update Receipt / MemberCapabilityOutletChanged candidate>
```

关键设计点：

- outlet 是可裁剪 projection；source 不完整时显式 not_available / stale / gap，不阻塞 Member Summary 或 CP01~06 核心流。
- `available` 只表示展示 refs / resolution 足够，不代表 tool invocation permission、execution readiness、registry membership 或 provider availability。
- Tools / Method source contract 由 CP06 owner-specific consumer 先转换为 committed resolution / gap；CP07 只消费该 neutral fact，不形成 Tools package compile dependency。

## 4. `MemberProjectionRebuildJob` 处理流

```text
<MemberProjectionRebuildJob>
  │
  ▼
<Job Boundary>
  - 校验 JobMetadata job_metadata、JobRunRef job_run_ref、system / operator ActorContext actor
  - 校验 IdempotencyKey idempotency_key
  - 读取 committed MemberFactRef facts、ExternalContextResolution resolutions、MemberProjectionState projection_state、target watermark
  │
  ▼
<MemberReadModelService>
  - 校验 ReadProjectionPolicy.validate_sources(List<MemberCommittedFactRef> committed_facts, List<ExternalContextResolution> resolutions, ProjectionWatermark source_watermark)
  - 调用 MemberProjectionState.start_rebuild(ProjectionWatermark target_watermark)
  - 调用 MemberSummaryView.rebuild(ProjectMemberRef subject_ref, GlobalMemberRef identity_anchor_ref, List<MemberCommittedFactRef> committed_facts, List<ExternalContextResolution> resolutions, Optional<RuntimeSafeViewRef> runtime_safe_view_ref, MemberProjectionState projection_state, ReadProjectionPolicy policy)
  - 按可选 source 调用 CapabilityOutletView.project(ProjectMemberRef subject_ref, CapabilityOutletActivation activation, List<ToolContractViewRef> tool_contract_refs, List<CapabilityBindingViewRef> capability_binding_refs, List<MethodDefinitionRef> method_definition_refs, List<ExternalContextResolution> resolutions, List<ExternalContextGap> gaps, ProjectionWatermark source_watermark, ReadProjectionPolicy policy) 与 MemberDiagnosticView.rebuild(ProjectMemberRef subject_ref, List<InteractionTraceEntry> trace_entries, List<TypedRef> gap_refs, List<ExternalContextResolution> resolutions, List<SafeExplanationRef> explanation_refs, MemberProjectionState projection_state, ReadProjectionPolicy policy);缺失 source 形成 not_available / degraded,不造内容
  │
  ▼
<MemberProjectionStore>
  - 在 local projection commit 内保存新 view revisions 与 state
  - 完整覆盖 target watermark 时调用 MemberProjectionState.complete_rebuild(ProjectionWatermark applied_watermark, Timestamp updated_at)
  - 失败调用 MemberProjectionState.mark_failed(SafeReasonCategory safe_reason, Timestamp updated_at)
  │
  ▼
<Projection Job Result / Semantic Event Candidates>
  - current / degraded / failed / stale / disabled / unknown;不修改 core / support truth
```

关键设计点：

- Rebuild 只从 committed local fact refs 和 neutral resolutions 生成可重建视图；不通过 Query、provider body 或猜测补齐 source truth。
- Summary 是核心只读视图；outlet / diagnostics 可选，source 不足时返回 not_available / degraded，不阻塞 C1~C4。
- projection state 的 current 只在 source watermark 覆盖与完整性可证明时成立；failed / unknown 不得静默变 current。
- Job 调度、租约、批量、存储 schema 与报告留给 03 / 07，不写真实 run_id / artifact / evidence。

## 5. `GapReconciliationJob` 处理流

```text
<GapReconciliationJob>
  │
  ▼
<Job Boundary>
  - 校验 JobMetadata job_metadata、JobRunRef job_run_ref、system / operator ActorContext actor
  - 校验 IdempotencyKey idempotency_key
  - 读取 interaction / publication / external / projection gap refs
  - 读取 source owner 已提交的 resolution / successor refs
  │
  ▼
<MemberReadModelService>
  - 比较 gap refs 与已提交 owner resolution / successor refs、source watermark
  - 不猜测缺失事实，不调用业务 Command，不修改 CP04 / CP05 / CP06 source gap
  - 形成新的 MemberProjectionState revision 与 reconciled gap surface
  │
  ▼
<MemberProjectionStore>
  - 保存 projection gap refs / freshness update / successor link view
  - source owner 未提交 resolution 时保留 open / blocked / pending / unknown surface
  │
  ▼
<Reconciliation Job Result>
  - projection current / stale / degraded / failed / unknown；不声明 source gap 已修复
```

关键设计点：

- CP07 的 reconciliation 只更新“投影看到什么”，不能替 CP04/05/06 关闭 gap；source gap 的 resolution 只能由其 owner flow 产生。
- owner resolution 已提交但 projection 尚未追上时，仍返回 stale / rebuilding，不能把 read surface 提前标 current。
- Job 不触发 `ResolveExternalContext`、publication relay、trace append 或任何 core Command；它只消费已存在 refs。

## 6. `GetMemberSummary / GetCapabilityOutlet / GetMemberDiagnostics` 处理流

```text
<GetMemberSummary / GetCapabilityOutlet / GetMemberDiagnostics Query>
  │
  ▼
<Projection Query Boundary>
  - 校验 ActorContext actor、QueryMetadata metadata、ProjectMemberRef subject_ref
  - 读取对应 Filter、ProjectionConsistencyHint consistency_hint 与 visibility context
  │
  ▼
<MemberReadModelQueryService>
  - 读取对应 projection view 与 MemberProjectionState
  - 调用 ReadProjectionPolicy.evaluate_visibility(ActorContext actor, ProjectionVisibilityContext visibility_context)
  - 调用 MemberProjectionState.can_serve(ProjectionConsistencyHint consistency_hint)
  - 组装 body-free refs、safe categories、watermark、freshness、gap / not-ready posture
  │
  ▼
<Projection View Assembler>
  - Summary: 必须返回 summary 或 ProjectionNotReadySurface
  - Outlet: 可返回 available / not_available / stale / gap,不授权 invocation
  - Diagnostics: 可返回 view / not_available / degraded,不返回 complete log / evidence / secret
  │
  ▼
<Read Result>
  - current / stale / rebuilding / degraded / failed / disabled / unknown surface
```

关键设计点：

- 三类 Query 都是 no-write，不触发 rebuild、gap reconciliation、refresh 或 source resolution。
- `ProjectionNotReadySurface` 是显式结果，不是异常地伪造空的 current view；stale / degraded / unknown 必须对消费者可见。
- outlet 的 available 只表示 projection source sufficiency，不能作为 capability registry、authorization、invocation 或 execution readiness。
- Diagnostics 是可选增强面，缺失不阻塞 Member Summary 或核心写路径。

## 7. 本部分接口与对象对应关系

| 接口 / 流 | 主要对象 | 跨部分 / 外部接缝 | 本地提交 / 派生结果 |
|---|---|---|---|
| `MemberProjectionUpdateConsumer` | `MemberProjectionState` | CP01~06 committed facts / resolutions | stale / target watermark state |
| `CapabilityOutletSourceUpdateConsumer` | `CapabilityOutletView`;`MemberProjectionState` | CP06 committed capability resolution / gap + optional safe refs | outlet stale / gap / not_available marker |
| `MemberProjectionRebuildJob` | `MemberSummaryView`;`CapabilityOutletView`;`MemberDiagnosticView`;`MemberProjectionState` | `MemberFactReadPort`;`ExternalResolutionReadPort`;`ToolSafeViewReadPort` | new view revisions + projection state |
| `GapReconciliationJob` | `MemberProjectionState`;gap refs | owner-submitted resolution / successor refs | projection gap surface / freshness only |
| 3 projection Queries | corresponding view + state | none | body-free read surfaces |

## 8. 未展开接口与边界取舍

- CP07 无 core write Command；任何对 CP01~06 truth 的改变必须回到对应 owner Command / Consumer。
- `MemberFactReadPort`、`ExternalResolutionReadPort` 与 `ToolSafeViewReadPort` 都是只读 inward seams，不是反向写 port 或 package dependency。
- `CapabilityOutletSourceUpdateConsumer` 与 `MemberProjectionUpdateConsumer` 使用不同 local source authority：前者消费 CP06 已提交的 capability resolution / gap，后者消费 CP01~06 member facts / resolutions；两者不能合并为任意 projection hub。Tools / Method source event 只由 CP06 owner consumer 接收。

## 9. CP07 处理流停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 两个 state-writing Consumer 独立流 | pass | projection stale / outlet source posture 分开，均不改 source truth。 |
| 两个 Job 独立流 | pass | rebuild 只从 committed refs 重建；reconciliation 只消费 owner resolution / successor refs并更新 projection surface。 |
| 三类复杂 Query 覆盖 | pass | summary、outlet、diagnostics 的 not-ready / optional / degraded 差异显式。 |
| Step 6 对象引用完整 | pass | 5 个 CP07 对象均有 flow / policy / query 承接。 |
| projection no-write / rebuildability | pass | 无 core write port；source gap 不由 Read Model 创建或关闭。 |
| outlet non-authorizing | pass | available / stale / gap 不等于 registry / authorization / invocation。 |
| pending 诚实性 | pass | `L2M-UP-002/005` 与 downstream contract 只形成 stale / gap / pending，不声明 SDK / integration readiness。 |
| 未下沉到详细实现 | pass | 无 projection schema、SQL、错误码、调度细节、真实 run_id 或 artifact。 |

CP07 结论为 `completed / pass / stop_review`。下一允许动作是回填 Step 8 主控的七部分停审、接口/对象/处理流总审计与最终 gate；通过前不得创建 Step 9。
