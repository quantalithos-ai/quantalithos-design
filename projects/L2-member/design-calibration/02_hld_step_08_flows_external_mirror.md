# Step 8 附录 CP06. External Context Mirror 处理流

> 主控文件: `02_hld_step_08_processing_flows.md`
> 对应接口: Step 7 CP06 的 2 Commands、2 Queries、5 owner-specific Consumers、1 Job
> 对应对象: Step 6 CP06 的 4 个对象
> 状态: completed / pass / stop_review

## 1. 本部分处理流选择与输入

`ResolveExternalContext` 是 support-truth write Command，必须展示 owner-specific port、snapshot、neutral resolution / gap 的写入边界。`RequestExternalContextRefresh` 与 `ExternalContextRefreshJob` 必须一起画出，区分显式登记需求与后台追加事实。五类 source update Consumer 都会改变 Mirror support state，采用同一结构化图但逐项保留 owner-specific source / adapter 差异，不合并为 generic hub。`GetExternalContextResolution` 含 freshness / conflict / unavailable / unknown 分层，单独成图；`ListExternalContextGaps` 复用主控 §3.2 的 no-write Query 骨架并标注 gap filter。

CP06 只拥有 `ExternalContextSnapshot`、`ExternalContextResolution`、`ExternalContextGap` 和 `MirrorResolutionPolicy`。Work、Identity、Governance、Runtime、Tools、Method、Host、Bus、Conversation、Artifact、Observability 及其正文 / registry / authorization truth 均外置。

## 2. `ResolveExternalContext` 处理流

```text
<ResolveExternalContext Command>
  │
  ▼
<Mirror Command Boundary>
  - 校验 ActorContext actor、CommandMetadata metadata、IdempotencyKey idempotency_key
  - 读取 TypedRef source_ref、ExternalOwnerRef owner_ref、ExternalContextKind context_kind
  - 读取 ExternalConsumerPurpose consumer_purpose、ExternalContextScope required_scope、SourceFreshnessEvidence freshness_evidence
  │
  ▼
<ExternalContextMirrorService>
  - 根据 owner_ref / context_kind 选择独立 source port，不走 arbitrary generic adapter
  - 获取 ExternalSourceSafeResult safe_result，验证 source、scope、version、digest 与 body-free 条件
  - 调用 ExternalContextSnapshot.capture(TypedRef source_ref, ExternalOwnerRef source_owner, ExternalContextKind context_kind, Optional<SourceVersion> source_version, Optional<Digest> source_digest, ExternalContextScope scope, Set<ExternalContextCategory> safe_categories, FreshnessBasis freshness_basis, Timestamp captured_at, MirrorResolutionPolicy policy)
  - 调用 ExternalContextResolution.resolve(TypedRef source_ref, Optional<ExternalContextSnapshot> snapshot, ExternalConsumerPurpose consumer_purpose, ExternalContextScope required_scope, SourceFreshnessEvidence freshness_evidence, MirrorResolutionPolicy policy)
  - 不可判定时调用 ExternalContextGap.open(Optional<TypedRef> source_ref, ExternalContextKind context_kind, ExternalConsumerPurpose consumer_purpose, ExternalContextScope required_scope, Optional<ExternalContextResolution> resolution, ExternalContextGapCategory category, SafeReasonCategory safe_reason, Timestamp opened_at)
  │
  ▼
<ExternalContextMirrorStore>
  - 追加 immutable snapshot 与 purpose-specific resolution / gap
  - 不覆盖旧 snapshot，不写 external owner truth
  │
  ▼
<Resolution Result / MemberExternalContextResolutionChanged or GapChanged candidate>
  - 返回 resolved / stale / conflict / unresolved / unavailable / unknown
```

关键设计点：

- resolution 是 member support truth，回答“该 ref / snapshot 是否足以供指定 consumer purpose 使用”，不回答业务授权、健康、受理或可用性。
- source、owner、scope、freshness、digest 或 body gate 任一无法证明时，必须形成 blocked / gap / unknown，不用 last-known 默认放行。
- 不同 consumer purpose 不能复用同一 resolution；startup、screening、runtime entry、outbound、observation、projection 各自保留 scope / freshness 语义。
- 精确 source response、adapter、缓存 / transaction 和 schema 留给 03 / 04；`L2M-UP-001~007` 继续 pending。

## 3. `RequestExternalContextRefresh + ExternalContextRefreshJob` 处理流

```text
<RequestExternalContextRefresh Command>
  │
  ▼
<Mirror Command Boundary>
  - 校验 ActorContext actor、CommandMetadata metadata、IdempotencyKey idempotency_key
  - 读取 TypedRef source_ref、ExternalContextKind context_kind、ExternalConsumerPurpose consumer_purpose
  - 读取 ExternalContextScope required_scope、RefreshReason refresh_reason
  │
  ▼
<ExternalContextMirrorService>
  - 检查是否已有 resolution_pending / stale / blocked gap
  - 调用 ExternalContextGap.request_refresh(ExternalRefreshRequestRef refresh_request_ref)
  - 提交新的 resolution_pending / blocked gap，不在 Command 内长时调用外部 owner
  │
  ▼
<ExternalContextMirrorStore>
  - 保存 refresh need 与 correlation
  │
  ▼
<ExternalContextRefreshJob>
  - 校验 JobMetadata job_metadata、JobRunRef job_run_ref、system / operator ActorContext actor、IdempotencyKey idempotency_key
  - 读取待处理 gaps / stale snapshots
  - 按 owner-specific source port 请求新 safe result
  - 追加新 snapshot、resolution 或 successor gap
  │
  ▼
<Mirror Store + Semantic Event Candidate>
  - 新事实 / gap revision / affected consumer stale marker
  - Job result 为 completed / waiting / blocked / degraded / unknown
```

关键设计点：

- Refresh Command 只登记需求，Job 才执行后台 continuation；Query 不得隐式触发二者。
- refresh 是 append-only：不覆盖旧 snapshot、不删除 gap、不自动授权、不修复 CP01~07 的 consumer truth。
- source side effect 或 commit 状态 unknown 时，Job 追加 unknown / gap 并停止自动升级；不得伪造真实 run_id、report 或 readiness。
- 若 owner 合同要求不同 refresh 语义，必须按 owner 重新展开，不把五类 source 合并为一个 scheduler hub。

## 4. 五类 owner-specific source update Consumer 处理流

```text
<SubjectIdentityContextUpdateConsumer /
 PolicyContextUpdateConsumer /
 RuntimeBoundaryContextUpdateConsumer /
 CapabilityContextUpdateConsumer /
 HostRouteContextUpdateConsumer>
  │
  ▼
<Owner-specific Source Consumer>
  - 校验 EventEnvelope envelope、SourceEventId source_event_id、SchemaVersion schema_version
  - 校验 DeduplicationKey deduplication_key、TraceContext trace_context、SourceFreshnessEvidence freshness_evidence
  - 只接受本 family 的 typed refs / safe source clue
  │
  ▼
<ExternalContextMirrorService>
  - 选择对应 owner source port / adapter
  - 验证 source authority、scope、version、digest、freshness 与 forbidden-body boundary
  - 形成 ExternalContextSnapshot、ExternalContextResolution 或 ExternalContextGap
  - 对受影响 consumer 写入 stale / pending marker，不覆盖其已提交 domain fact
  │
  ▼
<ExternalContextMirrorStore>
  - 追加 support fact / gap / duplicate / blocked receipt
  │
  ▼
<Resolution / Gap Event Candidate>
```

owner-specific 差异：

| Consumer | 只允许的来源语义 | 绝不形成 |
|---|---|---|
| `SubjectIdentityContextUpdateConsumer` | Work / Identity subject、identity anchor、scope refs | 第三种 execution subject、member / identity body |
| `PolicyContextUpdateConsumer` | Governance policy snapshot / effective-result ref | authorization、approval、rule body |
| `RuntimeBoundaryContextUpdateConsumer` | Runtime boundary / contract / source refs | run、context、plan、outcome、Runtime schema副本 |
| `CapabilityContextUpdateConsumer` | Tools / Method contract、binding、definition refs | registry、definition body、invocation authorization |
| `HostRouteContextUpdateConsumer` | host / publication / observation boundary refs | host health、Bus delivery、route truth |

关键设计点：

- 五类 Consumer 共享 envelope / dedup / trace 骨架，但 source authority、adapter、context kind、purpose 与禁止事项必须独立。
- source update 只产生新 snapshot / resolution / gap；不 retroactively 重裁 CP01~05 的已提交决定。
- exact source event family、carrier、route 与 version 继续受 `L2M-UP-001~007`、`L2M-UP-005` 阻塞。

## 5. `GetExternalContextResolution` 处理流

```text
<GetExternalContextResolution Query>
  │
  ▼
<Query Boundary>
  - 校验 ActorContext actor、QueryMetadata metadata、TypedRef source_ref
  - 读取 ExternalConsumerPurpose consumer_purpose、ExternalContextScope required_scope、ProjectionConsistencyHint consistency_hint
  │
  ▼
<ExternalContextQueryService>
  - 读取 purpose-specific ExternalContextResolution、snapshot ref、gap ref 与 freshness basis
  - 区分 resolved / stale / conflict / unresolved / unavailable / unknown
  - 不触发 resolver、refresh、authorization 或 consumer Command
  │
  ▼
<ExternalContextResolutionReadSurface Assembler>
  - 组装 source / owner / scope / purpose refs、safe categories、freshness、safe reason 与 gap
  │
  ▼
<Resolution Result>
  - 返回 neutral resolution surface 或 stale / blocked / unavailable / unknown
```

关键设计点：

- `resolved` 只表示当前 consumer purpose 的输入可判定，不等于 authorized、healthy、accepted、available 或 ready。
- Query 不把 stale snapshot 自动续期，不合并不同 purpose 的 resolution，也不创建新的 snapshot / gap。
- 具体 visibility、分页、watermark 和 projection carrier 留给 03。

## 6. 本部分接口与对象对应关系

| 接口 / 流 | 主要对象 | 外部接缝 | 本地提交 / 派生结果 |
|---|---|---|---|
| `ResolveExternalContext` | `ExternalContextSnapshot`;`ExternalContextResolution`;`ExternalContextGap`;`MirrorResolutionPolicy` | owner-specific source ports | snapshot + purpose-specific resolution / gap |
| `RequestExternalContextRefresh` + `ExternalContextRefreshJob` | `ExternalContextGap`;`ExternalContextSnapshot`;`ExternalContextResolution` | owner refresh ports | refresh request + new facts / successor gap |
| 五类 source Consumers | same four objects | Work / Identity / Governance / Runtime / Tools / Method / host route owners | support fact / stale marker / gap |
| `GetExternalContextResolution` | `ExternalContextResolution`;`ExternalContextSnapshot`;`ExternalContextGap` | none | neutral read surface |
| `ListExternalContextGaps` | `ExternalContextGap` | none | gap read surface,通用 §3.2 |

## 7. 未展开接口与边界取舍

- `ListExternalContextGaps` 只读取 gap page，不触发 refresh / resolver，因此复用主控 §3.2。
- 五类 source Consumer 共享一张结构图是为避免重复 transport 骨架，但 owner-specific source、purpose、禁止事项和 blocker 已逐项列出；不构造 generic external hub。
- CP06 不拥有任何外部 provider / registry / adapter lifecycle；adapter activation、source retention、schema 与 positive integration 留给 03 / 04 / 07。

## 8. CP06 处理流停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| resolution Command 独立流 | pass | source -> snapshot -> neutral resolution / gap 顺序清楚。 |
| refresh Command / Job 分层 | pass | Command 只登记需求，Job append-only 继续处理。 |
| 五类 source Consumer 覆盖 | pass | 每个 owner family 有独立 source / adapter / forbidden output 约束。 |
| 复杂 resolution Query 覆盖 | pass | freshness / conflict / unavailable / unknown 显式且 no-write。 |
| Step 6 对象引用完整 | pass | 4 个 CP06 对象均有 flow / query / policy 承接。 |
| neutral / external owner 边界 | pass | 不生成 authorization、health、acceptance、registry 或正文。 |
| pending 诚实性 | pass | `L2M-UP-001~007` 未被流程伪装成 exact source contract / route / readiness。 |
| 未下沉到详细实现 | pass | 无 provider SDK、schema、SQL、错误码、retry 参数或真实 job 证据。 |

CP06 结论为 `completed / pass / stop_review`。下一允许动作是更新主控与台账到 `Step 8 / processing_flows:CP07`，然后创建 CP07 处理流附录。
