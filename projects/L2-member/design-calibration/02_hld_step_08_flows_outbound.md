# Step 8 附录 CP04. Outbound Boundary 处理流

> 主控文件: `02_hld_step_08_processing_flows.md`
> 对应接口: Step 7 CP04 的 2 Consumers、1 Job、2 Queries
> 对应对象: Step 6 CP04 的 5 个对象
> 状态: completed / pass / stop_review

## 1. 本部分处理流选择与输入

CP04 没有独立公共 Command。`RuntimeMaterialReceptionConsumer` 是唯一进入 outbound evaluation 的入口，必须独立画图；它只能接收 CP03 accepted reception。`PublicationRelayJob` 影响传播可靠性和 external side effect，必须独立画图；`DeliveryFeedbackConsumer` 会追加 feedback link / gap，也必须独立画图。`GetPublicationPosture` 包含 prepared / submitted / feedback-linked / gap 与外部 truth 分层，单独画图；`GetOutboundDecision` 复用主控 §3.2。

CP04 只拥有 `OutboundDecision`、`MemberOutboundMaterial`、`PublicationAttempt`、`PublicationGap` 和 `OutboundMaterialPolicy`。Runtime outcome、Conversation fact、Artifact / evidence、Bus delivery / route / retry、downstream accepted / observed 均保持外部 owner。

## 2. `RuntimeMaterialReceptionConsumer` 处理流

```text
<RuntimeMaterialReceptionConsumer>
  │
  ▼
<Outbound Inbound Consumer>
  - 校验 MemberFactEnvelope envelope、MemberFactId member_fact_id、SchemaVersion schema_version
  - 校验 DeduplicationKey deduplication_key、TraceContext trace_context
  - 读取 RuntimeMaterialReceptionId reception_id、ExternalContextResolutionId target_resolution_id、InteractionPurpose purpose
  │
  ▼
<OutboundBoundaryService>
  - 只加载 CP03 accepted RuntimeMaterialReception reception
  - 验证 reception.permits_outbound_evaluation() 与 target / purpose resolution
  - 调用 OutboundDecision.decide(RuntimeMaterialReception reception, InteractionPurpose purpose, ExternalContextResolution target_resolution, OutboundMaterialPolicy policy)
  - eligible 时调用 MemberOutboundMaterial.create(OutboundDecision outbound_decision, RuntimeMaterialReception reception, List<TypedRef> allowed_refs, RedactionProfileRef redaction_profile_ref, OutboundMaterialPolicy policy)
  - 调用 PublicationAttempt.prepare(MemberOutboundMaterial material, PublicationBoundaryRef publication_boundary_ref, IdempotencyKey idempotency_key)
  │
  ▼
<OutboundStore: local commit>
  - 保存 decision、material、prepared attempt 或 PublicationGap
  - 追加 `MemberOutboundDecided` / `MemberOutboundMaterialPrepared` candidates
  │
  ▼
<Outbound Evaluation Result>
  - eligible + prepared、rejected、blocked、pending 或 gap
```

关键设计点：

- CP04 不接受任意 actor 直接要求发布；没有 CP03 accepted reception 就没有 outbound decision / material。
- material 只含最小 typed refs、purpose、target、digest 和 redaction profile，不含 Runtime body、Conversation body、secret、hidden reasoning 或 provider response。
- local decision / material / prepared attempt 先提交；真正 publication side effect 由 relay Job 后续执行。
- target resolution 或 event carrier 不可证明时形成 blocked / pending gap，禁止默认 route。

## 3. `PublicationRelayJob` 处理流

```text
<PublicationRelayJob>
  │
  ▼
<Job Boundary>
  - 校验 JobMetadata job_metadata、JobRunRef job_run_ref、system / operator ActorContext actor
  - 校验 IdempotencyKey idempotency_key
  - 读取 prepared PublicationAttempt attempt、MemberOutboundMaterial material 与 open PublicationGap gap
  │
  ▼
<OutboundContinuationService>
  - 检查 material.matches_decision(OutboundDecision outbound_decision)
  - 检查 material.is_body_free() 与 PublicationGap.blocks_new_attempt(PublicationResolutionEvidence resolution_evidence)
  - 形成本次可提交 / blocked / unknown 的 job continuation posture
  │
  ▼
<EventPublicationPort>
  - 仅对可证明 prepared material 调用正式 publication seam
  - 返回 PublicationSubmissionRef、blocked-aware 或 unknown side-effect结果
  │
  ▼
<PublicationAttempt + PublicationGap + OutboundStore>
  - 成功调用只追加 `PublicationAttempt.mark_submitted(PublicationSubmissionRef submission_ref, Timestamp attempted_at)`
  - unknown 建立 `PublicationGap` 与 retry fence；blocked 保留原 material / decision
  - 追加 `MemberPublicationAttemptRecorded` / `MemberPublicationGapChanged` candidates
  │
  ▼
<Job Result>
  - submitted / blocked / unknown / waiting；不声明 delivered / accepted / observed
```

关键设计点：

- Job 只 relay 已成立 material，不重建或修改 `OutboundDecision` / `MemberOutboundMaterial`，也不修复 Runtime truth。
- `submitted` 只表示 member 调用了 publication seam；Bus delivery、Conversation append、downstream acceptance 和 observation 由外部 owner 反馈。
- unknown side effect 必须形成 gap / fence，不能由 scheduler 盲重放；新 attempt 需要正式 resolution / idempotency evidence。
- Job 的真实运行记录、锁、租约、调度和报告结构留给 03 / 07；本校准材料不记录真实 run_id 或结果。

## 4. `DeliveryFeedbackConsumer` 处理流

```text
<DeliveryFeedbackConsumer>
  │
  ▼
<Delivery Feedback Consumer>
  - 校验 EventEnvelope envelope、SourceEventId source_event_id、SchemaVersion schema_version
  - 校验 DeduplicationKey deduplication_key、TraceContext trace_context
  - 读取 DownstreamFeedbackRef feedback_ref、PublicationAttemptId attempt_id
  │
  ▼
<OutboundBoundaryService>
  - 通过 DeliveryFeedbackSourcePort 验证 source / attempt / correlation
  - 分类 duplicate / late / conflict / attributable feedback
  - 调用 PublicationAttempt.link_feedback(DownstreamFeedbackRef feedback_ref)
  - 对 route / submission / feedback 未闭合处调用 PublicationAttempt.open_gap(PublicationGap publication_gap)
  │
  ▼
<PublicationAttempt + PublicationGap + OutboundStore>
  - 追加 feedback link、successor gap 或 resolved / superseded gap
  - 不重裁 `OutboundDecision`，不复制 downstream / delivery body
  │
  ▼
<Consumer Receipt / Semantic Event Candidate>
  - feedback-linked、gap changed、duplicate、late、conflict 或 blocked
```

关键设计点：

- feedback 只提供可关联的外部 ref / safe category；不会把 feedback-linked 自动升级为 delivered、accepted 或 observed。
- late / duplicate / conflict 形成新 link / gap fact，旧 attempt 和 material 保持不可变。
- source / correlation 无法证明时 fail closed；exact feedback carrier / route 受 `L2M-UP-004/005` 阻塞。

## 5. `GetPublicationPosture` 处理流

```text
<GetPublicationPosture Query>
  │
  ▼
<Query Boundary>
  - 校验 ActorContext actor、QueryMetadata metadata、OutboundDecisionId decision_id
  - 解析 ProjectionConsistencyHint consistency_hint
  │
  ▼
<OutboundQueryService>
  - 读取 OutboundDecision、MemberOutboundMaterial、PublicationAttempt、PublicationGap 与 feedback refs
  - 区分 eligible / prepared / submitted / feedback-linked / open / resolved / unknown
  - 不查询或代答 Bus delivery、Conversation ordering、downstream accepted / observed
  │
  ▼
<PublicationPostureView Assembler>
  - 组装 body-free refs、target / purpose、digest、safe reason、freshness 与 gap surface
  │
  ▼
<Publication Posture Result>
  - 返回 local posture 或 stale / degraded / unavailable / unknown surface
```

关键设计点：

- Query 保留 decision、material、attempt、gap 与 external feedback link 的层次，不输出单一 success。
- Query 不创建新的 material、attempt、gap，不触发 relay、retry 或 feedback resolution。
- 具体 visibility、分页和 projection watermark 留给 03。

## 6. 本部分接口与对象对应关系

| 接口 / 流 | 主要对象 | 跨部分 / 外部接缝 | 本地提交 / 派生结果 |
|---|---|---|---|
| `RuntimeMaterialReceptionConsumer` | `OutboundDecision`;`MemberOutboundMaterial`;`PublicationAttempt`;`OutboundMaterialPolicy` | CP03 accepted reception; CP06 target resolution | decision + material + prepared attempt / gap |
| `PublicationRelayJob` | `MemberOutboundMaterial`;`PublicationAttempt`;`PublicationGap` | `EventPublicationPort` | submitted / blocked / unknown attempt + gap |
| `DeliveryFeedbackConsumer` | `PublicationAttempt`;`PublicationGap` | feedback source / downstream ref | feedback link + gap revision |
| `GetOutboundDecision` | `OutboundDecision` | none | read-only surface,通用 §3.2 |
| `GetPublicationPosture` | all 4 fact objects + feedback refs | none | posture read surface |

## 7. 未展开接口与边界取舍

- `GetOutboundDecision` 只读取 local disposition / refs，不包含 multi-layer delivery posture，复用主控 §3.2。
- CP04 不提供 direct publication Command；这样可以保证任何出站都锚定 CP03 committed reception 和 body gate。
- relay Job 不重建 decision / material，也不创建 Conversation / Artifact / Evidence truth；后续 exact route、outbox、retry / reconciliation 由 03 / 04 / 07 展开。

## 8. CP04 处理流停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| committed source Consumer 独立流 | pass | 只有 CP03 accepted reception 才进入 outbound evaluation。 |
| propagation Job 独立流 | pass | relay 先读已提交 material，再调用 port，unknown 建 gap / fence。 |
| feedback Consumer 独立流 | pass | feedback link / gap 追加且不逆写 decision。 |
| 复杂 Query 覆盖 | pass | publication posture 明确区分 local 与 external 状态。 |
| Step 6 对象引用完整 | pass | 5 个 CP04 对象均有 flow / policy / read surface 承接。 |
| body / downstream owner 边界 | pass | forbidden body、Conversation / Artifact / observed truth 均外置。 |
| pending 诚实性 | pass | `L2M-UP-004/005` 只形成 blocked / pending / gap，不声明 route 或 integration。 |
| 未下沉到详细实现 | pass | 无 topic、schema、SQL、错误码、retry 参数或真实 job 结果。 |

CP04 结论为 `completed / pass / stop_review`。下一允许动作是更新主控与台账到 `Step 8 / processing_flows:CP05`，然后创建 CP05 处理流附录。
