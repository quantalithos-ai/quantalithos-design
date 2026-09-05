# Step 7 附录 CP04. Outbound Boundary 接口

> 主控文件: `02_hld_step_07_api_interface_skeleton.md`
> 对应对象: Step 6 CP04 的 5 个对象
> 状态: completed / pass / stop_review

## 1. Command API 骨架

CP04 不暴露独立公共 Command。Outbound 只能由 CP03 已提交的 `RuntimeMaterialReception` 触发;任意 actor 不能绕过 committed source、target resolution 与 body gate 直接要求发布。内部编排由 `RuntimeMaterialReceptionConsumer` 进入 `OutboundBoundaryService`,不是另一个公共 API。

## 2. Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetOutboundDecision` | `ActorContext`;`QueryMetadata`;`OutboundDecisionId`;`ProjectionConsistencyHint` | `OutboundDecisionReadSurface` | outbound store / safe projection | no-write;返回 local disposition / source / target resolution refs,不返回 Runtime body |
| `GetPublicationPosture` | `ActorContext`;`QueryMetadata`;`OutboundDecisionId` | `PublicationPostureView` | material / attempts / gaps / feedback refs | 区分 prepared / submitted / feedback-linked / gap;不声明 delivered / observed / accepted |

## 3. Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `RuntimeMaterialReceptionConsumer` | CP03 committed local fact | `MemberFactEnvelope`;`MemberFactId`;`SchemaVersion`;`DeduplicationKey`;`TraceContext`;`RuntimeMaterialReceptionId`;`ExternalContextResolutionId`;`InteractionPurpose` | `OutboundDecision`;eligible 时 `MemberOutboundMaterial` + prepared `PublicationAttempt`;否则 rejected / blocked / pending decision或 `PublicationGap` | 只接受 CP03 accepted reception;不读取 / 改写 Runtime material truth |
| `DeliveryFeedbackConsumer` | Bus / formal downstream feedback boundary | `EventEnvelope`;`SourceEventId`;`SchemaVersion`;`DeduplicationKey`;`TraceContext`;`DownstreamFeedbackRef`;`PublicationAttemptId` | feedback link、new / resolved / superseded `PublicationGap`;duplicate / late classification | 只追加 ref / gap;不重裁 `OutboundDecision`,不复制 delivery / downstream body |

exact local event carrier、external feedback family与 route 受 `L2M-UP-004/005` 阻塞;当前冻结语义和 typed slots,不声明 positive integration。

## 4. Outbound Event 骨架

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `MemberOutboundDecided` | committed `OutboundDecision` | Trace、Read Model、publication continuation | local disposition / refs;eligible 不等于 submitted |
| `MemberOutboundMaterialPrepared` | immutable `MemberOutboundMaterial` | `PublicationRelayJob`、Trace | body-free refs / purpose / target / digest;不是 Conversation fact |
| `MemberPublicationAttemptRecorded` | committed `PublicationAttempt` | Trace、Read Model、gap reconciliation | submitted 不等于 Bus delivered / downstream accepted |
| `MemberPublicationGapChanged` | committed `PublicationGap` revision | Trace、Read Model、reconciliation | open / pending / resolved / superseded 是 member local gap状态 |

Semantic event names 不等于 Core member-specific event family 已存在;carrier / route 继续 pending。

## 5. Operations Job 骨架

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `PublicationRelayJob` | `JobMetadata`;`JobRunRef`;system / operator `ActorContext`;`IdempotencyKey`;prepared attempts / open route gaps | new `PublicationAttempt` status / submission ref / `PublicationGap`;job report skeleton | 只提交已成立 material;unknown side effect fenced;不重建 decision / material,不声明 delivered / accepted,不记录真实 run_id / result |

## 6. Inward Port / Persistence Interface

| Interface | 输入骨架 | 输出骨架 | 依赖类别 | 边界 / 当前状态 |
|---|---|---|---|---|
| `EventPublicationPort` | `MemberOutboundMaterial`;`IdempotencyKey`;`TraceContext`;`PublicationBoundaryRef` | `PublicationSubmissionRef` / blocked / unknown | event / handoff | Bus route / delivery / retry truth 外置;`L2M-UP-005` pending |
| `DeliveryFeedbackSourcePort` | `DownstreamFeedbackRef`;`PublicationAttemptId` | source / correlation validation result | event(ref) | 不读取 downstream body或形成 accepted truth |
| `OutboundStore` | decision / material / attempt / gap / feedback links | stored local facts / duplicate / conflict | persistence | local truth first;transaction / outbox / schema 留 03 |

## 7. Step 8 展开候选

| 接口 | 是否独立处理流 | 原因 |
|---|---|---|
| `RuntimeMaterialReceptionConsumer` | 是 | P0 write Consumer,形成 decision / material / prepared attempt并守 body gate。 |
| `PublicationRelayJob` | 是 | 影响传播可靠性,必须展示 local commit与 external side effect 分界。 |
| `DeliveryFeedbackConsumer` | 是 | 改写 feedback link / gap,且 late / duplicate 不得逆写。 |
| 两个 Query | `GetPublicationPosture` 需独立短 flow | 多层状态与 external truth边界容易误读。 |

## 8. CP04 接口停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 5 个对象能力有入口 / continuation | pass | committed-fact Consumer、relay Job、feedback Consumer、Queries / Events 完整。 |
| 无 bypass Command | pass | outbound 只能锚定 accepted Runtime reception。 |
| 五层状态分离 | pass | outcome / decision / attempt / delivery / accepted 未压平。 |
| local commit / external side effect 分离 | pass | Job 只提交 prepared material,unknown fenced。 |
| body / downstream owner 边界 | pass | Conversation / Artifact / delivery / observed均外置。 |
| Step 8 可反查 | pass | 两个 state-writing Consumers、relay Job和 posture Query均覆盖。 |

CP04 结论为 `completed / pass / stop_review`。下一允许模块是 CP05 Interaction Trace 接口正式化。
