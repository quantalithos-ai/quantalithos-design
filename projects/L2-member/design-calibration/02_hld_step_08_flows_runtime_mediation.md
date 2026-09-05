# Step 8 附录 CP03. Runtime Mediation 处理流

> 主控文件: `02_hld_step_08_processing_flows.md`
> 对应接口: Step 7 CP03 的 2 Commands、2 Queries、`RuntimeMaterialConsumer`
> 对应对象: Step 6 CP03 的 5 个对象
> 状态: completed / pass / stop_review

## 1. 本部分处理流选择与输入

`SubmitScreenedFactToRuntime` 是 P0 Command，必须展示 local decision / prepared attempt、Runtime port side effect、submitted / unknown fence 和可选 result link 的分层。`LinkRuntimeAdmissionResult` 会创建不可变 external-result link，单独画 late / independently resolved result 流。`RuntimeMaterialConsumer` 会创建 reception 并开启 CP04 候选，单独成图。`GetRuntimeMediationPosture` 涉及 decision / attempt / link / reception 多层状态，单独成图；`GetRuntimeMaterialReception` 只返回 body-free local record，复用主控 §3.2。

CP03 只拥有 `RuntimeDeliveryDecision`、`RuntimeSubmissionAttempt`、`RuntimeResultLink`、`RuntimeMaterialReception` 和 `RuntimeMediationPolicy`。Runtime entry authority、admission、run、context、plan、checkpoint、outcome、safe material truth 和 IPC transport 均归 `L2-runtime` 或正式 transport owner。

## 2. `SubmitScreenedFactToRuntime` 处理流

```text
<SubmitScreenedFactToRuntime Command>
  │
  ▼
<Runtime Delivery Command Boundary>
  - 校验 ActorContext actor、CommandMetadata metadata、IdempotencyKey idempotency_key
  - 读取 ScreeningDecisionId screening_decision_id、InboundFactRecordId inbound_fact_id
  - 读取 RuntimeBoundaryRef runtime_boundary_ref、ExternalContextResolutionId contract_resolution_id
  │
  ▼
<RuntimeMediationService: local decision phase>
  - 加载 ScreeningDecision screening_decision 与 InboundFactRecord inbound_fact
  - 校验 passed / controlled-degraded、subject、fact、scope、correlation 与 mapping resolution
  - 调用 RuntimeDeliveryDecision.decide(ScreeningDecision screening_decision, InboundFactRecord inbound_fact, RuntimeBoundaryRef runtime_boundary_ref, ExternalContextResolution contract_resolution, RuntimeMediationPolicy policy)
  - eligible 时调用 RuntimeSubmissionAttempt.prepare(RuntimeDeliveryDecision delivery_decision, IdempotencyKey idempotency_key)
  │
  ▼
<RuntimeMediationStore: local commit 1>
  - 提交 delivery decision 与 prepared attempt
  - rejected / blocked / pending 在此返回,不调用 RuntimeEntryPort
  │
  ▼
<RuntimeEntryPort: external side effect>
  - 提交 RuntimeEntrySubmission submission、IdempotencyKey idempotency_key、TraceContext trace_context
  - 返回 RuntimeSubmissionRef / optional RuntimeAdmissionDecisionRef / blocked-aware unknown
  │
  ▼
<RuntimeMediationService: local incorporation phase>
  - 调用 RuntimeSubmissionAttempt.mark_submitted(RuntimeSubmissionRef submission_ref, Timestamp attempted_at)
  - 同步有正式 result ref 时形成 RuntimeResultLink;commit-unknown 时调用 RuntimeSubmissionAttempt.mark_unknown(UnknownReason reason)
  │
  ▼
<RuntimeMediationStore: local commit 2 + Result>
  - 追加 attempt revision / optional result link 与 semantic event candidates
  - 返回 decision、attempt、optional link;submitted 不等于 accepted / run created
```

关键设计点：

- screening passed 只是本 flow 的输入前提；只有 formal entry mapping 可用时 `RuntimeDeliveryDecision` 才能 eligible。
- local decision / prepared attempt 先提交，external port 在本地提交之外执行，再以第二次本地提交记录 submitted / unknown / result link，避免把调用成功等同 Runtime acceptance。
- unknown side effect 必须 fenced，不能自动 retry 或创建第二 run；新的 attempt 需要正式 resolution / idempotency evidence。
- `L2M-UP-003` 未闭口时 mapping / carrier 分支只能 blocked；本图不定义 Runtime trigger schema、IPC 方向或 run lifecycle。

## 3. `LinkRuntimeAdmissionResult` 处理流

```text
<LinkRuntimeAdmissionResult Command>
  │
  ▼
<Runtime Result Command Boundary>
  - 校验 ActorContext actor、CommandMetadata metadata、IdempotencyKey idempotency_key
  - 读取 RuntimeSubmissionAttemptId attempt_id、RuntimeAdmissionDecisionRef result_ref
  - 读取 RuntimeResultClassification classification、RuntimeSourceRef source_ref
  │
  ▼
<RuntimeMediationService>
  - 加载 RuntimeSubmissionAttempt attempt 与既有 result links
  - 通过 RuntimeAdmissionResultSourcePort 验证 source / submission / boundary correlation
  - 分类 duplicate / late / conflict / attributable result
  - 调用 RuntimeResultLink.link(RuntimeSubmissionAttempt attempt, RuntimeAdmissionDecisionRef runtime_result_ref, RuntimeResultClassification classification, RuntimeSourceRef source_ref)
  │
  ▼
<RuntimeResultLink + RuntimeSubmissionAttempt + RuntimeMediationStore>
  - 追加 immutable result link
  - 调用 RuntimeSubmissionAttempt.link_result(RuntimeResultLink result_link) 形成新 attempt revision
  - 不覆盖旧 attempt 或 Runtime result truth
  │
  ▼
<RuntimeResultLink Result / MemberRuntimeResultLinked candidate>
  - 返回 linked、duplicate、late、conflict 或 blocked surface
```

关键设计点：

- 本 Command 是 transport-neutral result incorporation，不声明 Runtime 使用 callback、event 或 polling；exact direction 留给 `L2M-UP-003`。
- accepted classification 只说明所引用 Runtime admission result，不说明 run started、completed 或 outcome success。
- late / duplicate / conflict 不能逆写已经提交的 delivery decision；只追加 link / trace / gap 分类。
- external source validation 与 local link commit 的事务边界、错误映射留给 03。

## 4. `RuntimeMaterialConsumer` 处理流

```text
<RuntimeMaterialConsumer>
  │
  ▼
<Runtime Material Consumer>
  - 校验 EventEnvelope envelope、SourceEventId source_event_id、SchemaVersion schema_version
  - 校验 DeduplicationKey deduplication_key、TraceContext trace_context
  - 读取 RuntimeSafeHandoffMaterialRef material_ref、RuntimeOutcomeRef outcome_ref、RuntimeSourceRef source_ref
  - 读取 RuntimeMaterialMetadata material_metadata
  │
  ▼
<RuntimeMediationService>
  - 通过 RuntimeMaterialSourcePort 验证 committed producer、source family、digest 与 correlation
  - 调用 RuntimeMediationPolicy.evaluate_reception(RuntimeMaterialMetadata material_metadata, RuntimeSourceRef source_ref, CorrelationState correlation_state)
  - 调用 RuntimeMaterialReception.receive(RuntimeSafeHandoffMaterialRef runtime_material_ref, RuntimeOutcomeRef runtime_outcome_ref, RuntimeSourceRef source_ref, RuntimeMaterialMetadata material_metadata, RuntimeMediationPolicy policy)
  │
  ▼
<RuntimeMaterialReception + RuntimeMediationStore>
  - 追加 accepted / rejected / duplicate / late / blocked / unknown reception
  - 只保存 refs、digest、disposition 与 correlation
  │
  ▼
<Consumer Receipt / MemberRuntimeMaterialReceived candidate>
  - 只有 accepted reception 形成 CP04 outbound evaluation candidate
```

关键设计点：

- consumer 只接受可证明 committed、body-free 的 Runtime safe handoff ref；model output、hidden reasoning、tool receipt body、secret 或 outcome 副本一律 rejected。
- accepted reception 不修改或取得 Runtime outcome / material owner，也不等于 outbound eligible / publication submitted。
- duplicate / late 不创建第二条 outbound 主线；unknown digest / source / committed status 不得继续。
- Runtime source family、direction 与 carrier 受 `L2M-UP-004/005` 阻塞，本图不声明 positive integration。

## 5. `GetRuntimeMediationPosture` 处理流

```text
<GetRuntimeMediationPosture Query>
  │
  ▼
<Query Boundary>
  - 校验 ActorContext actor、QueryMetadata metadata、RuntimeDeliveryDecisionId decision_id
  - 解析 ProjectionConsistencyHint consistency_hint
  │
  ▼
<RuntimeMediationQueryService>
  - 读取 RuntimeDeliveryDecision、RuntimeSubmissionAttempt、RuntimeResultLink、相关 RuntimeMaterialReception refs
  - 区分 eligible / submitted / result-linked / blocked / unknown / reception posture
  - 不调用 Runtime 查询 run、context、plan、checkpoint 或 outcome state
  │
  ▼
<RuntimeMediationReadSurface Assembler>
  - 组装 body-free refs、safe classification、correlation、freshness 与 gaps
  │
  ▼
<Mediation Posture Result>
  - 返回 local posture 或 stale / unavailable / unknown surface
```

关键设计点：

- Query 保留 member local decision、attempt、external result link 与 reception 四个层次，不能合成单一 success。
- Query 不触发 Runtime result resolution、material fetch、retry 或 projection rebuild。
- 具体 visibility、page / watermark 和 response type 留给 03。

## 6. 本部分接口与对象对应关系

| 接口 / 流 | 主要对象 | 跨部分 / 外部接缝 | 本地提交 / 派生结果 |
|---|---|---|---|
| `SubmitScreenedFactToRuntime` | `RuntimeDeliveryDecision`;`RuntimeSubmissionAttempt`;`RuntimeMediationPolicy`;optional `RuntimeResultLink` | CP02 screening / fact; CP06 mapping; `RuntimeEntryPort` | decision + attempt + optional result link |
| `LinkRuntimeAdmissionResult` | `RuntimeSubmissionAttempt`;`RuntimeResultLink` | Runtime result source port | immutable result link + attempt revision |
| `RuntimeMaterialConsumer` | `RuntimeMaterialReception`;`RuntimeMediationPolicy` | Runtime committed-material source; CP04 candidate | reception + semantic event candidate |
| `GetRuntimeMediationPosture` | all four fact objects | none | read-only posture |
| `GetRuntimeMaterialReception` | `RuntimeMaterialReception` | none | body-free read surface,通用 §3.2 |

## 7. 未展开接口与边界取舍

- `GetRuntimeMaterialReception` 只读取 ref / digest / disposition / correlation，不包含 fallback 或 external query，因此复用主控 §3.2。
- CP03 不设置自动 retry / polling Job。unknown attempt 必须等待正式 result / resolution；若上游合同最终要求 polling，需在 03 展开前回开 Step 7 / 8 并证明幂等语义。
- `RuntimeEntryPort`、`RuntimeAdmissionResultSourcePort`、`RuntimeMaterialSourcePort` 都是 runtime / ref seam，不是对 `L2-runtime` package 的 compile dependency。

## 8. CP03 处理流停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 两个 Command 独立处理流 | pass | submission 与 result incorporation 分开，方向保持 transport-neutral。 |
| state-writing Consumer 覆盖 | pass | committed material reception 单独成图并守 body / source gate。 |
| 复杂 Query 覆盖 | pass | posture 显式分离 decision / attempt / link / reception。 |
| Step 6 对象引用完整 | pass | 5 个 CP03 对象均被 flow / policy / read surface 承接。 |
| local commit / external side effect | pass | prepared attempt 先提交，port side effect 后记录；unknown fenced。 |
| Runtime owner 边界 | pass | admission、run、context、plan、checkpoint、outcome、material truth 均外置。 |
| pending 诚实性 | pass | `L2M-UP-003/004/005` 未被 flow 伪装成 exact mapping / carrier / source family。 |
| 未下沉到详细实现 | pass | 无 IPC、schema、SQL、错误码、retry 参数或完整调用链。 |

CP03 结论为 `completed / pass / stop_review`。下一允许动作是更新主控与台账到 `Step 8 / processing_flows:CP04`，然后创建 CP04 处理流附录。
