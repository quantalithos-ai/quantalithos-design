# Step 7 附录 CP02. Inbound Boundary 接口

> 主控文件: `02_hld_step_07_api_interface_skeleton.md`
> 对应对象: Step 6 CP02 的 5 个对象
> 状态: completed / pass / stop_review

## 1. Command API 骨架

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `EstablishSubscriptionScope` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`MemberPresenceId`;`MemberSubscriptionScope`;`ExternalContextResolutionId` | `SubscriptionScopeDecision` | 校验 current presence、project scope 与正式 identity / role source | active / rejected / blocked scope decision |
| `ReplaceSubscriptionScope` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`SubscriptionScopeDecisionId`;`ExpectedRevision`;`MemberSubscriptionScope`;`ExternalContextResolutionId` | `SubscriptionScopeDecision` | 以显式 revision 替换范围,阻止无来源扩权 | 新 active / rejected / blocked decision;旧 decision superseded |

不提供 `ScreenInboundBody` 公共 Command。筛选只能由已校验 formal inbound event 触发;否则调用方可绕过 envelope、scope、source 与瞬时检查授权边界。

## 2. Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetCurrentSubscriptionScope` | `ActorContext`;`QueryMetadata`;`ProjectMemberRef`;`ProjectionConsistencyHint` | `SubscriptionScopeReadSurface` | scope decisions / projection | no-write;stale / blocked 显式,不自动 refresh |
| `GetScreeningDisposition` | `ActorContext`;`QueryMetadata`;`ScreeningDecisionId` | `ScreeningDecisionReadSurface` | inbound store / safe trace | 只返回 body-free disposition、source refs、freshness / gap;不返回 event / rule body |

## 3. Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `InboundFactConsumer` | `L0-bus` / formal source boundary | `EventEnvelope`;`SourceEventId`;`SchemaVersion`;`DeduplicationKey`;`TraceContext`;`SourceAuthorityRef`;`InboundFactDescriptor`;`AuthorizedTransientInspectionInput` | `InboundFactRecord`;`ScreeningDecision`;duplicate / unsupported / blocked receipt | raw body 仅在 adapter 内授权瞬时检查;只把 `TransientInspectionMarker` / `ScreeningInputSummary` 交 application,不得保存或透明转发 |
CP02 不定义独立的 `ScreeningRuleSourceConsumer`。Governance rule changes 由 CP06 `PolicyContextUpdateConsumer` 统一接收并形成 `ExternalContextResolution` / `ExternalContextGap`;CP02 通过 `ScreeningRuleSourcePort` 读取该 neutral support truth，避免在 Inbound 与 Mirror 之间形成第二个 rule-source owner。

exact member event family、envelope specialization、route 与 rule taxonomy 受 `L2M-UP-005/007` 阻塞;unsupported / unknown 必须 blocked / pending,不能 fail open。

## 4. Outbound Event 骨架

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `MemberSubscriptionScopeChanged` | committed `SubscriptionScopeDecision` revision | Trace、Read Model、inbound continuation | 只含 scope decision ref、subject、status、revision、correlation;不含 role / policy body |
| `MemberInboundFactRecorded` | committed `InboundFactRecord` | Trace、Read Model、screening continuation | body-free fact ref / intake disposition;不是 Bus delivery proof |
| `MemberScreeningDecided` | committed `ScreeningDecision` | Runtime Mediation、Trace、Read Model | 传播 member screening ref / disposition / source refs;不等于 Governance decision 或 Runtime admission |

这些是 semantic event skeleton。Exact event type / payload / route 未闭口,不得据此声明 Bus integration。

## 5. Operations Job 骨架

CP02 不设置业务重裁 Job。规则变化只标记 external resolution / projection stale,新入站事实按新来源形成新 decision;历史 `ScreeningDecision` 不由 Job 重写。若未来需要受控 backlog re-evaluation,必须先回开需求 / 概要 owner 和幂等语义。

## 6. Inward Port / Persistence Interface

| Interface | 输入骨架 | 输出骨架 | 依赖类别 | 边界 / 当前状态 |
|---|---|---|---|---|
| `InboundEventPort` | `EventEnvelope`;`InboundFactDescriptor`;authorized inspection handle | source / envelope validation result | event | Bus delivery / route truth 外置;member-specific carrier pending |
| `ScreeningRuleSourcePort` | `PolicySnapshotRef`;`ExternalContextScope`;`SourceFreshnessEvidence` | `ExternalSourceSafeResult` / existing `ExternalContextResolution` ref | runtime(ref) | 只读 CP06 neutral support truth;不接收或拥有 Governance event |
| `InboundStore` | scope decision / fact record / screening decision;`ExpectedRevision` | stored local facts / duplicate / conflict | persistence | raw body、policy body 不可保存;transaction / schema 留 03 |
| `InboundDeduplicationStore` | `SourceEventId`;`SourceAuthorityRef`;`DeduplicationKey` | duplicate / first-seen classification | persistence support | 不拥有 Bus delivery;key / retention 留 03 / 04 |

## 7. Step 8 展开候选

| 接口 | 是否独立处理流 | 原因 |
|---|---|---|
| scope 两个 Commands | 是,可合并 scope revision flow | P0 truth change,涉及 presence、external resolution 与禁止扩权。 |
| `InboundFactConsumer` | 是 | 改写 fact + screening,且 transient body 生命周期是关键边界。 |
| Governance rule update | 否,由 CP06 `PolicyContextUpdateConsumer` 独立处理 | CP02 只在后续 screening / Query 读取新的 neutral resolution,不重复拥有 source update。 |
| 两个 Query | 通用只读路径;screening Query需标 body-free / stale | 不写状态。 |

## 8. CP02 接口停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 5 个对象能力有正式入口 | pass | scope Commands、`InboundFactConsumer`、neutral rule-resolution read、Queries 与 events 完整。 |
| Command / Consumer 分类 | pass | screening 不暴露绕过 envelope 的公共 Command。 |
| transient inspection / persistence 分离 | pass | raw body 只在 adapter 授权短生命周期内存在。 |
| Policy / Bus / Runtime owner 边界 | pass | screening event 不代答 external truth。 |
| context / envelope / dedup | pass | Command / Query / Consumer 必需槽位齐全。 |
| Step 8 可反查 | pass | P0 scope 与 `InboundFactConsumer` 有独立 flow;rule update 由 CP06 owner flow 承接。 |

CP02 结论为 `completed / pass / stop_review`。下一允许模块是 CP03 Runtime Mediation 接口正式化。
