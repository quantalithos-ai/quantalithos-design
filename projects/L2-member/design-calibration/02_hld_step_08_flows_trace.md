# Step 8 附录 CP05. Interaction Trace 处理流

> 主控文件: `02_hld_step_08_processing_flows.md`
> 对应接口: Step 7 CP05 的 2 Consumers、1 Job、3 Queries
> 对应对象: Step 6 CP05 的 5 个对象
> 状态: completed / pass / stop_review

## 1. 本部分处理流选择与输入

CP05 不提供任意 trace append Command。`MemberCommittedFactConsumer` 只能接收 CP01~04 已提交事实并形成 trace link 或 gap，必须独立画图。`ObservationRelayJob` 影响观测交接可靠性和 forbidden-body boundary，必须独立画图。`ObservationFeedbackConsumer` 追加 feedback link / gap，必须独立画图。`GetInteractionTrace` 与 `ListInteractionGaps` 含 visibility、incomplete、stale 和 body-free 裁剪，合并为一张安全 trace Query 图；`GetObservationPosture` 只读取 material / attempt / feedback refs，复用主控 §3.2。

CP05 只拥有 `InteractionTraceEntry`、`InteractionGap`、`ObservationMaterial`、`ObservationAttempt` 和 `TraceMaterialPolicy`。源业务事实、完整日志、observability backend、evidence / verdict、Conversation history 和 observed truth 均外置。

## 2. `MemberCommittedFactConsumer` 处理流

```text
<MemberCommittedFactConsumer>
  │
  ▼
<Local Fact Consumer>
  - 校验 MemberFactEnvelope envelope、MemberFactId member_fact_id、SchemaVersion schema_version
  - 校验 DeduplicationKey deduplication_key、TraceContext trace_context、MemberFactKind fact_kind
  - 读取 MemberCommittedFactRef fact_ref、ProjectMemberRef subject_ref、InteractionPurpose purpose、MemberCorrelation correlation
  - 校验 List<TypedRef> source_refs 可回链
  │
  ▼
<InteractionTraceService>
  - 验证 fact 已 committed、subject / correlation / purpose 与 predecessor refs 一致
  - 调用 TraceMaterialPolicy.validate_trace_source(MemberCommittedFactRef fact_ref, List<TypedRef> source_refs)
  - 可回链时调用 InteractionTraceEntry.append(MemberCommittedFactRef fact_ref, ProjectMemberRef subject_ref, MemberFactKind fact_kind, List<TypedRef> source_refs, List<InteractionTraceEntryId> predecessor_refs, InteractionPurpose purpose, MemberCorrelation correlation, TraceMaterialPolicy policy)
  - 无法建立关联时调用 InteractionGap.open(ProjectMemberRef subject_ref, MemberFactKind expected_ref_kind, List<TypedRef> actual_refs, InteractionGapCategory category, SafeReasonCategory safe_reason, MemberCorrelation correlation, Timestamp opened_at)
  │
  ▼
<InteractionTraceStore>
  - 追加 immutable trace entry 或 interaction gap
  - trace 失败不回滚 CP01~04 source fact
  │
  ▼
<Trace Receipt / MemberInteractionTraceRecorded or MemberInteractionGapChanged candidate>
```

关键设计点：

- 只有可验证 committed fact 才能进入 trace；未提交、body-only、source unknown 或 correlation 不一致的输入必须 blocked / gap。
- trace entry 只保存 refs、低基数 fact kind、purpose、correlation 和时间，不复制源事实正文或完整日志。
- trace linking 是后置派生，不成为 CP01~04 本地 commit 的同步前置；失败只记录 gap。
- `MemberFactEnvelope` 是本地逻辑 carrier，exact outbox / event mapping 受 `L2M-UP-005` 阻塞。

## 3. `ObservationRelayJob` 处理流

```text
<ObservationRelayJob>
  │
  ▼
<Job Boundary>
  - 校验 JobMetadata job_metadata、JobRunRef job_run_ref、system / operator ActorContext actor
  - 校验 IdempotencyKey idempotency_key
  - 读取 committed InteractionTraceEntry entries、InteractionGap gaps、prepared ObservationMaterial material 与 ObservationAttempt attempt
  │
  ▼
<InteractionTraceService / ObservationContinuation>
  - 调用 TraceMaterialPolicy.validate_observation(Set<ObservationCategory> categories, Map<SafeDimensionName, SafeDimensionValue> safe_dimensions, ForbiddenBodyInspection inspection)
  - 调用 ObservationMaterial.create(ProjectMemberRef subject_ref, List<InteractionTraceEntry> trace_entries, List<InteractionGap> gaps, Set<ObservationCategory> categories, Map<SafeDimensionName, SafeDimensionValue> safe_dimensions, RedactionProfileRef redaction_profile_ref, TraceMaterialPolicy policy)
  - 调用 ObservationAttempt.prepare(ObservationMaterial material, ObservationBoundaryRef observation_boundary_ref, IdempotencyKey idempotency_key)
  │
  ▼
<InteractionTraceStore: local commit>
  - 先提交 immutable low-sensitive material 与 prepared attempt
  │
  ▼
<ObservationHandoffPort>
  - 仅提交可证明 body-free material，返回 ObservationSubmissionRef / blocked / unknown
  │
  ▼
<ObservationAttempt + InteractionGap + Store>
  - submitted 追加本地 attempt revision；unknown 追加 safe gap / fence；不生成 evidence / verdict
  │
  ▼
<Job Result / MemberObservationAttemptRecorded candidate>
  - submitted / blocked / unknown / waiting，不声明 delivered / ingested / observed
```

关键设计点：

- material 只能从已提交 trace / gap 派生，且必须低敏、低基数、body-free；complete log、raw event、model / tool body、secret、evidence body 均禁止。
- local material / attempt commit 先于 observation side effect；unknown 不自动 retry，不代表 backend 已写入。
- Observation handoff 不创建或修复 observability / evidence truth；具体 route、retention、ingest、重入留给 03 / 04。
- Job 真实运行上下文只作为设计类型，不在校准材料记录真实 run_id、report 或 evidence。

## 4. `ObservationFeedbackConsumer` 处理流

```text
<ObservationFeedbackConsumer>
  │
  ▼
<Observation Feedback Consumer>
  - 校验 EventEnvelope envelope、SourceEventId source_event_id、SchemaVersion schema_version
  - 校验 DeduplicationKey deduplication_key、TraceContext trace_context
  - 读取 ObservationFeedbackRef feedback_ref、ObservationAttemptId attempt_id
  │
  ▼
<InteractionTraceService>
  - 通过 ObservationFeedbackSourcePort 验证 source / attempt / correlation
  - 分类 duplicate / late / conflict / attributable feedback
  - 调用 ObservationAttempt.link_feedback(ObservationFeedbackRef feedback_ref)
  - 必要时调用 InteractionGap.open(ProjectMemberRef subject_ref, MemberFactKind expected_ref_kind, List<TypedRef> actual_refs, InteractionGapCategory category, SafeReasonCategory safe_reason, MemberCorrelation correlation, Timestamp opened_at)
  │
  ▼
<ObservationAttempt + InteractionGap + InteractionTraceStore>
  - 追加 feedback link / safe gap / semantic event candidate
  - 不修改 source trace entry、observation material 或核心事实
  │
  ▼
<Consumer Receipt>
  - feedback-linked、gap changed、duplicate、late、conflict 或 blocked
```

关键设计点：

- feedback-linked 只能说明外部 feedback ref 已关联，不能升级为 observed、evidence、verdict 或 report。
- late / duplicate / conflict 保留旧 attempt 与 material，形成新 link / gap 事实。
- backend payload、complete log 与 evidence body 不进入本地对象；source / correlation 无法证明时 fail closed。

## 5. `GetInteractionTrace / ListInteractionGaps` 处理流

```text
<GetInteractionTrace / ListInteractionGaps Query>
  │
  ▼
<Trace Query Boundary>
  - 校验 ActorContext actor、QueryMetadata metadata、ProjectMemberRef subject_ref
  - 读取 MemberCorrelation correlation、InteractionGapFilter gap_filter、PageRequest page_request
  - 解析 ProjectionConsistencyHint consistency_hint
  │
  ▼
<InteractionTraceQueryService>
  - 读取 InteractionTraceEntry、InteractionGap、source refs 与 safe observation refs
  - 按 visibility / subject / correlation 裁剪 body-free links 与 safe categories
  - 识别 current / incomplete / stale / blocked / unknown / resolved
  - 不创建 trace entry、gap resolution、observation attempt 或 external refresh
  │
  ▼
<InteractionTraceReadSurface Assembler>
  - 组装分页、watermark、freshness、safe reason 与 incomplete posture
  │
  ▼
<Trace / Gap Result>
  - 返回安全 trace surface 或 not-ready / degraded / unavailable / unknown
```

关键设计点：

- Query 只读已提交 trace / gap；不能用查询、diagnostic 或 report 反写 source truth。
- trace incomplete / gap resolved 只是关联面的状态，不代表 source fact、delivery、observed 或 evidence 已修复。
- 具体分页、retention、visibility policy、projection watermark 留给 03 / 04。

## 6. 本部分接口与对象对应关系

| 接口 / 流 | 主要对象 | 跨部分 / 外部接缝 | 本地提交 / 派生结果 |
|---|---|---|---|
| `MemberCommittedFactConsumer` | `InteractionTraceEntry`;`InteractionGap`;`TraceMaterialPolicy` | CP01~04 committed facts | trace link / gap + semantic event candidate |
| `ObservationRelayJob` | `ObservationMaterial`;`ObservationAttempt`;`InteractionGap` | `ObservationHandoffPort`、CP06 resolution | material + attempt / gap |
| `ObservationFeedbackConsumer` | `ObservationAttempt`;`InteractionGap` | observation feedback source | feedback link / gap revision |
| `GetInteractionTrace` / `ListInteractionGaps` | `InteractionTraceEntry`;`InteractionGap` | none | body-free trace / gap read surface |
| `GetObservationPosture` | `ObservationMaterial`;`ObservationAttempt` | feedback refs | posture read surface,通用 §3.2 |

## 7. 未展开接口与边界取舍

- `GetObservationPosture` 只读取 material / attempt / feedback refs，未引入复杂裁剪或隐式 resolution，因此复用主控 §3.2。
- CP05 不设 trace append Command；所有 trace entry 必须从 committed-fact Consumer 进入，防止 caller 伪造审计链。
- Observation relay 不生成 evidence / verdict / observed truth；如果未来观测 owner 提出新 feedback / reconciliation seam，需在 03 / 05 重新登记。

## 8. CP05 处理流停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| committed-fact Consumer 独立流 | pass | 只接受 CP01~04 已提交 refs，失败开 gap，不回滚 source。 |
| observation relay Job 独立流 | pass | material / attempt 先本地提交，side effect 后续且 unknown fenced。 |
| observation feedback Consumer 独立流 | pass | feedback link / gap 追加，不声明 observed / evidence。 |
| 复杂 trace Query 覆盖 | pass | trace / gap safe surface 显式处理 incomplete / stale / unknown。 |
| Step 6 对象引用完整 | pass | 5 个 CP05 对象均有 flow / policy / query 承接。 |
| body / cardinality / observability owner 边界 | pass | complete log、正文、secret、evidence、backend truth 均外置。 |
| pending 诚实性 | pass | `L2M-UP-004/005` 只形成 blocked / gap，不声明 observation route / integration。 |
| 未下沉到详细实现 | pass | 无 backend schema、SQL、错误码、retry 参数或真实 evidence。 |

CP05 结论为 `completed / pass / stop_review`。下一允许动作是更新主控与台账到 `Step 8 / processing_flows:CP06`，然后创建 CP06 处理流附录。
