# Step 8 附录 CP02. Inbound Boundary 处理流

> 主控文件: `02_hld_step_08_processing_flows.md`
> 对应接口: Step 7 CP02 的 2 Commands、2 Queries、1 Consumer
> 对应对象: Step 6 CP02 的 5 个对象
> 状态: completed / pass / stop_review

## 1. 本部分处理流选择与输入

`EstablishSubscriptionScope` 与 `ReplaceSubscriptionScope` 都会产生新的范围决定或 supersede 旧 revision，因此合并为一张 scope revision 写流，但在图中明确两种入口差异。`InboundFactConsumer` 会追加入站记录并形成 screening，必须独立成图。Governance rule update 不在 CP02 重复建 Consumer；由 CP06 `PolicyContextUpdateConsumer` 形成 neutral snapshot / resolution / gap，CP02 在 screening / Query 中通过 `ScreeningRuleSourcePort` 读取。`GetScreeningDisposition` 包含 body-free、freshness、gap 裁剪，单独成图；`GetCurrentSubscriptionScope` 复用主控 §3.2 通用 Query 路径。

CP02 只拥有 `SubscriptionScopeDecision`、`InboundFactRecord`、`ScreeningDecision` 及两类 policy。Bus delivery / route、Governance policy / approval truth、raw body、Runtime admission 与语义推理均不在本部分形成 owner truth。

## 2. `EstablishSubscriptionScope / ReplaceSubscriptionScope` 处理流

```text
<EstablishSubscriptionScope / ReplaceSubscriptionScope Command>
  │
  ▼
<Inbound Command Boundary>
  - 校验 ActorContext actor、CommandMetadata metadata、IdempotencyKey idempotency_key
  - 建立 MemberPresenceId presence_id、MemberSubscriptionScope proposed_scope、ExternalContextResolutionId source_resolution_id
  - Replace 入口额外校验 SubscriptionScopeDecisionId current_decision_id 与 ExpectedRevision expected_revision
  │
  ▼
<SubscriptionScopeService>
  - 加载 committed MemberPresence presence 与当前 scope decision（如有）
  - 检查 presence subject、source purpose / scope、resolution freshness 与 project boundary
  - 调用 SubscriptionScopePolicy.evaluate(MemberPresence presence, MemberSubscriptionScope proposed_scope, ExternalContextResolution source_resolution)
  - 调用 SubscriptionScopePolicy.prevents_scope_expansion(SubscriptionScopeDecision current_scope, MemberSubscriptionScope proposed_scope)
  │
  ▼
<SubscriptionScopeDecision + InboundStore>
  - 形成 active、rejected 或 blocked 的新 revision
  - Replace 不原地修改旧决定；旧决定只转为 superseded
  - 在本地提交边界追加 `MemberSubscriptionScopeChanged` candidate
  │
  ▼
<Scope Result>
  - 返回新决定或 rejected / blocked / conflict surface
```

关键设计点：

- `ProjectMemberRef` 与当前 `MemberPresence` 是范围决定的主语锚；不能由 GlobalMember、display name 或私有 allowlist 推导范围。
- source resolution stale、conflict、missing 或 unknown 时只能 blocked / rejected；不以旧 resolution 静默扩权。
- scope revision 只控制 member 入站筛选边界，不等于 Bus subscription、Governance authorization 或 Runtime permission。
- 事务、revision collision 与错误映射留给 03；本图只冻结 append / supersede 顺序。

## 3. `InboundFactConsumer` 处理流

```text
<InboundFactConsumer>
  │
  ▼
<Inbound Event Consumer>
  - 校验 EventEnvelope envelope、SourceEventId source_event_id、SchemaVersion schema_version
  - 校验 DeduplicationKey deduplication_key、TraceContext trace_context、SourceAuthorityRef source_authority_ref
  - 读取 InboundFactDescriptor fact_descriptor 与授权瞬时检查输入
  │
  ▼
<InboundBoundaryService>
  - 通过 InboundDeduplicationStore 先分类 first-seen / duplicate
  - 读取 current SubscriptionScopeDecision scope_decision
  - 调用 SubscriptionScopeDecision.covers(InboundFactDescriptor fact_descriptor)
  - 在授权 inspection window 内形成 ScreeningInputSummary inspection_summary 与 TransientInspectionMarker inspection_marker
  │
  ▼
<InboundFactRecord + ScreeningDecision + InboundStore>
  - 调用 InboundFactRecord.record(SourceEventRef source_event_ref, SourceAuthorityRef source_authority_ref, SubscriptionScopeDecision scope_decision, TransientInspectionMarker inspection_marker, MemberCorrelation correlation)
  - accepted intake 才调用 ScreeningDecision.decide(InboundFactRecord inbound_fact, SubscriptionScopeDecision scope_decision, ExternalContextResolution rule_resolution, ScreeningInputSummary inspection_summary, InboundScreeningPolicy policy)
  - 在单一本地提交边界追加 intake / screening facts 与 semantic event candidates
  │
  ▼
<Consumer Receipt / Runtime Handoff Candidate>
  - accepted + passed / controlled degraded、duplicate、unsupported 或 blocked / pending
```

关键设计点：

- raw body 只能在授权 adapter 的 inspection window 内短暂存在；不得进入 `InboundFactRecord`、`ScreeningDecision`、Trace、Projection 或 outbound material。
- duplicate 只返回已保存 receipt / classification，不创建第二条 fact / screening 主线；late / conflict 追加安全分类，不覆盖既有决定。
- `ScreeningDecision` 的 passed 只允许后续 Runtime delivery 评估，不是 Runtime admission、Bus delivery 或 Governance decision。
- exact envelope、source route 与 rule taxonomy 受 `L2M-UP-005/007` 阻塞；无法验证时必须 blocked / pending。

## 4. `GetScreeningDisposition` 处理流

```text
<GetScreeningDisposition Query>
  │
  ▼
<Query Boundary>
  - 校验 ActorContext actor、QueryMetadata metadata、ScreeningDecisionId screening_decision_id
  - 解析 ProjectionConsistencyHint consistency_hint
  │
  ▼
<InboundQueryService>
  - 读取 ScreeningDecision、InboundFactRecord 的 typed refs、rule resolution ref 与 trace / gap refs
  - 计算 body-free disposition、source freshness、stale / blocked / pending posture
  - 不读取 event body、rule body、inspection body 或 raw payload
  │
  ▼
<ScreeningDecisionReadSurface Assembler>
  - 组装 disposition、safe reason、correlation、source refs 与 watermark
  │
  ▼
<Screening Disposition Result>
  - 返回 passed / degraded / blocked / pending 或 stale / unavailable / unknown surface
```

关键设计点：

- Query 只能读取已提交事实；不触发 rule refresh、重新筛选、Runtime submission 或 scope mutation。
- `degraded` 必须保留其受控收窄语义，不能在读面被还原为 passed / authorized。
- 具体 visibility、分页和 projection watermark 留给 03；本步只冻结 body-free 与 no-write 边界。

## 5. 本部分接口与对象对应关系

| 接口 / 流 | 主要对象 | 跨部分接缝 | 本地提交 / 派生结果 |
|---|---|---|---|
| scope 两个 Commands | `SubscriptionScopeDecision`;`SubscriptionScopePolicy` | CP01 `MemberPresence`; CP06 `ExternalContextResolution` | active / rejected / blocked revision + scope event candidate |
| `InboundFactConsumer` | `InboundFactRecord`;`ScreeningDecision`;`InboundScreeningPolicy` | Bus source port; CP06 rule resolution | intake + screening facts / receipt / semantic events |
| Governance rule update | CP06 `PolicyContextUpdateConsumer` -> `ExternalContextResolution` / `ExternalContextGap` | CP02 `ScreeningRuleSourcePort` reads neutral support truth | CP02 does not own a second source-update fact |
| `GetCurrentSubscriptionScope` | `SubscriptionScopeDecision` | none | read-only surface,通用 §3.2 |
| `GetScreeningDisposition` | `ScreeningDecision`;`InboundFactRecord` | Trace / Mirror refs | body-free read surface |

## 6. 未展开接口与边界取舍

- `GetCurrentSubscriptionScope` 只读取 active / superseded revision 与 freshness，不包含复杂 fallback 或隐式 refresh，因此复用主控 §3.2。
- CP02 不新增 backlog re-screening Job。规则变更只影响新输入和 stale posture；任何历史重裁都必须重新讨论 owner、幂等和审计边界。
- `InboundEventPort` 只负责 event / envelope validation seam，不成为 Bus delivery truth 或 package dependency。

## 7. CP02 处理流停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| scope Command 流覆盖 | pass | 建立与替换均在同一 revision 流中显式区分，旧决定 superseded。 |
| state-writing Consumer 覆盖 | pass | `InboundFactConsumer` 独立成图；Governance rule update 由 CP06 owner flow 承接，CP02 不重复拥有。 |
| 复杂 Query 覆盖 | pass | screening read 显式标注 body-free、freshness、gap 与 no-write。 |
| Step 6 对象引用完整 | pass | 5 个 CP02 对象均被 flow / policy / read surface 承接。 |
| raw body / rule truth 边界 | pass | inspection window 短暂使用；policy / rule body 不保存、不出站。 |
| 跨部分接缝 | pass | Presence / Mirror / Bus / Runtime 只通过 refs、neutral resolution、safe snapshot 或 ports 协作。 |
| pending 诚实性 | pass | `L2M-UP-005/007` 未被 flow 伪装为 exact carrier、route 或 positive integration。 |
| 未下沉到详细实现 | pass | 无 schema、SQL、错误码、重试参数或完整调用链。 |

CP02 结论为 `completed / pass / stop_review`。下一允许动作是更新主控与台账到 `Step 8 / processing_flows:CP03`，然后创建 CP03 处理流附录。
