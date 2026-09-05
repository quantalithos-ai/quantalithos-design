# Step 7 附录 CP05. Interaction Trace 接口

> 主控文件: `02_hld_step_07_api_interface_skeleton.md`
> 对应对象: Step 6 CP05 的 5 个对象
> 状态: completed / pass / stop_review

## 1. Command API 骨架

CP05 不暴露任意 trace append Command。Trace 只能消费 CP01~04 committed local fact refs;否则 caller 可伪造审计链或用 trace 写入口绕过源对象 owner。Gap resolution 由正式 source / feedback Consumer 或 reconciliation continuation 追加,不通过“修复历史”Command。

## 2. Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetInteractionTrace` | `ActorContext`;`QueryMetadata`;`ProjectMemberRef`;`MemberCorrelation`;`ProjectionConsistencyHint`;`PageRequest` | `InteractionTraceReadSurface` | trace store / safe projection | no-write;body-free refs与安全类别,不返回 complete log / source body |
| `ListInteractionGaps` | `ActorContext`;`QueryMetadata`;`ProjectMemberRef`;`InteractionGapFilter`;`PageRequest` | `InteractionGapReadSurface` | trace store | no-write;显式 open / blocked / pending / unknown / resolved,不触发 resolution |
| `GetObservationPosture` | `ActorContext`;`QueryMetadata`;`ObservationMaterialId` | `ObservationPostureView` | observation materials / attempts / feedback refs | prepared / submitted / feedback-linked / blocked / unknown;不声明 observed / evidence |

## 3. Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `MemberCommittedFactConsumer` | CP01~04 semantic committed facts | `MemberFactEnvelope`;`MemberFactId`;`SchemaVersion`;`MemberFactKind`;`DeduplicationKey`;`TraceContext`;`MemberCommittedFactRef`;`ProjectMemberRef`;`InteractionPurpose`;`MemberCorrelation`;`List<TypedRef> source_refs` | `InteractionTraceEntry`或 `InteractionGap`;duplicate / late / ordering classification | 只接受可验证 committed refs;不复制 source fact,trace failure 不回滚 source |
| `ObservationFeedbackConsumer` | formal observation boundary | `EventEnvelope`;`SourceEventId`;`SchemaVersion`;`DeduplicationKey`;`TraceContext`;`ObservationFeedbackRef`;`ObservationAttemptId` | feedback link、duplicate / late / conflict classification;必要时 new gap | 不复制 backend payload,不把 feedback-linked写成 observed / evidence |

## 4. Outbound Event 骨架

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `MemberInteractionTraceRecorded` | committed `InteractionTraceEntry` | Read Model、diagnostics、observation material continuation | 只传播 entry ref / fact kind / correlation;不是 central event truth |
| `MemberInteractionGapChanged` | committed `InteractionGap` revision | Read Model、reconciliation | 传播 local gap ref / status / safe reason |
| `MemberObservationMaterialPrepared` | immutable `ObservationMaterial` | `ObservationRelayJob`、Read Model | low-sensitive / low-cardinality refs / categories / digest;不是 report / evidence |
| `MemberObservationAttemptRecorded` | committed `ObservationAttempt` | Read Model、reconciliation | submitted 不等于 delivered / ingested / observed |

Exact event / observation route 受 `L2M-UP-004/005` 阻塞;语义 skeleton 不构成 backend integration。

## 5. Operations Job 骨架

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `ObservationRelayJob` | `JobMetadata`;`JobRunRef`;system / operator `ActorContext`;`IdempotencyKey`;committed trace entries / gaps;prepared materials / attempts | new `ObservationMaterial`、`ObservationAttempt` status / submission ref / safe gap;job report skeleton | 只从 committed refs形成 minimal body-free material;unknown fenced;不生成 evidence / verdict / observed,不记录真实 run_id / result |

## 6. Inward Port / Persistence Interface

| Interface | 输入骨架 | 输出骨架 | 依赖类别 | 边界 / 当前状态 |
|---|---|---|---|---|
| `ObservationHandoffPort` | `ObservationMaterial`;`IdempotencyKey`;`TraceContext`;`ObservationBoundaryRef` | `ObservationSubmissionRef` / blocked / unknown | event / handoff | ingest / storage / observed truth 外置;route pending |
| `ObservationFeedbackSourcePort` | `ObservationFeedbackRef`;`ObservationAttemptId` | source / correlation validation result | event(ref) | 不读取 backend body或 evidence |
| `InteractionTraceStore` | trace entries / interaction gaps / observation material / attempts / feedback links | stored local facts / duplicate / conflict | persistence | body-free;retention / schema / transaction 留 03 / 04 |

## 7. Step 8 展开候选

| 接口 | 是否独立处理流 | 原因 |
|---|---|---|
| `MemberCommittedFactConsumer` | 是 | state-writing Consumer,必须展示 committed-only / gap / no-rollback。 |
| `ObservationRelayJob` | 是 | 影响观测交接可靠性与 forbidden-body边界。 |
| `ObservationFeedbackConsumer` | 是 | 改写 feedback link / gap,需 late / duplicate分类。 |
| `GetInteractionTrace` / `ListInteractionGaps` | 是,可合并安全 trace Query flow | 包含 visibility、body-free、incomplete / stale surface。 |
| `GetObservationPosture` | 通用 posture read | 只读多层状态。 |

## 8. CP05 接口停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 5 个对象能力有接口承接 | pass | committed fact / feedback Consumers、Queries、relay Job / events完整。 |
| 无伪造 trace Command | pass | trace 来源只能是 committed refs。 |
| source / trace / observed / evidence 分层 | pass | trace failure只开 gap,attempt不升级 external truth。 |
| body / cardinality边界 | pass | complete log、正文、高基数、secret均不进入接口输出。 |
| Job与 feedback owner边界 | pass | relay不生成 observed / verdict,feedback只追加 ref。 |
| Step 8可反查 | pass | 两 Consumers、relay Job和安全 Query均覆盖。 |

CP05 结论为 `completed / pass / stop_review`。下一允许模块是 CP06 External Context Mirror 接口正式化。
