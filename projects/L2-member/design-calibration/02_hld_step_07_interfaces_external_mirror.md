# Step 7 附录 CP06. External Context Mirror 接口

> 主控文件: `02_hld_step_07_api_interface_skeleton.md`
> 对应对象: Step 6 CP06 的 4 个对象
> 状态: completed / pass / stop_review

## 1. Command API 骨架

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `ResolveExternalContext` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`TypedRef`;`ExternalOwnerRef`;`ExternalContextKind`;`ExternalConsumerPurpose`;`ExternalContextScope`;`SourceFreshnessEvidence` | `ExternalContextSnapshot`;`ExternalContextResolution`;`Optional<ExternalContextGap>` | 经匹配 owner-specific port读取 safe result,捕获新 snapshot并形成 consumer-specific neutral resolution | 新 immutable snapshot + resolution / gap;不写 external truth |
| `RequestExternalContextRefresh` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`TypedRef`;`ExternalContextKind`;`ExternalConsumerPurpose`;`ExternalContextScope`;`RefreshReason` | `ExternalContextGap` / `ExternalRefreshRequestRef` | 显式登记 refresh need,不在 Command 中长时调用或自动授权 | gap进入 resolution_pending或 blocked;后续由 Job处理 |

`ResolveExternalContext` 是 support-truth write Command,不是 Query;调用方仍必须在拿到 resolved 后执行自己的 domain policy。

## 2. Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetExternalContextResolution` | `ActorContext`;`QueryMetadata`;`TypedRef`;`ExternalConsumerPurpose`;`ExternalContextScope`;`ProjectionConsistencyHint` | `ExternalContextResolutionReadSurface` | mirror store | no-write;返回 resolved / stale / conflict / unresolved / unavailable / unknown,不隐式 refresh |
| `ListExternalContextGaps` | `ActorContext`;`QueryMetadata`;`ExternalContextKind`;`ExternalContextGapFilter`;`PageRequest` | `ExternalContextGapReadSurface` | mirror store | no-write;不触发 resolver,不把 resolved解释为 authorized / healthy / accepted |

## 3. Inbound Event Consumer 骨架

| Consumer family | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `SubjectIdentityContextUpdateConsumer` | Work / Identity formal changes | `EventEnvelope`;`SourceEventId`;`SchemaVersion`;`DeduplicationKey`;`TraceContext`;subject / identity refs;`SourceFreshnessEvidence` | new snapshot / resolution / gap;affected consumers stale marker | 不复制 member / identity body,不建立第三种 subject |
| `PolicyContextUpdateConsumer` | Governance formal change | `EventEnvelope`;`SourceEventId`;`SchemaVersion`;`DeduplicationKey`;`TraceContext`;`PolicySnapshotRef`;`SourceFreshnessEvidence` | new policy-source snapshot / resolution / gap | 不复制 rule / approval body,不形成 authorization |
| `RuntimeBoundaryContextUpdateConsumer` | Runtime contract / source change | `EventEnvelope`;`SourceEventId`;`SchemaVersion`;`DeduplicationKey`;`TraceContext`;Runtime boundary / contract ref;`SourceFreshnessEvidence` | new mapping / source resolution / gap | 不复制 run / outcome / Runtime schema |
| `CapabilityContextUpdateConsumer` | Tools / Method formal change | `EventEnvelope`;`SourceEventId`;`SchemaVersion`;`DeduplicationKey`;`TraceContext`;contract / binding / definition refs;`SourceFreshnessEvidence` | new capability-source resolution / gap;outlet stale marker | 不复制 definition / registry / provider route |
| `HostRouteContextUpdateConsumer` | host / event route owner change | `EventEnvelope`;`SourceEventId`;`SchemaVersion`;`DeduplicationKey`;`TraceContext`;host / route ref;`SourceFreshnessEvidence` | new boundary resolution / gap | 不形成 host health、Bus delivery或 route truth |

每个 family 都显式保留 Core envelope / idempotency / trace 槽位,并必须有独立 owner adapter / source authority,不得实现一个 arbitrary external event adapter。

## 4. Outbound Event 骨架

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `MemberExternalContextResolutionChanged` | committed `ExternalContextResolution` | CP01~05、Read Model、Trace | 传播 resolution ref / purpose / scope / status / freshness;resolved非业务裁决 |
| `MemberExternalContextGapChanged` | committed `ExternalContextGap` revision | affected component、Read Model、reconciliation | 传播 gap ref / category / status / safe reason |

Exact source event families 与 member carrier 受 `L2M-UP-001~007` 相应合同和 `L2M-UP-005` 约束。

## 5. Operations Job 骨架

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `ExternalContextRefreshJob` | `JobMetadata`;`JobRunRef`;system / operator `ActorContext`;`IdempotencyKey`;resolution_pending gaps / stale snapshots | new snapshot / resolution / gap revisions;job report skeleton | 每次 refresh追加新事实;不覆盖 snapshot、不自动授权、不修复 consumer truth、不记录真实 run_id / result |

## 6. Inward Port / Persistence Interface

| Interface | 输入骨架 | 输出骨架 | 依赖类别 | 边界 / 当前状态 |
|---|---|---|---|---|
| CP01 source ports | subject / identity / credential refs + scope | external safe result / verification ref | runtime(ref) / runtime | 复用 CP01 已定义接口,不重复 owner；credential contract pending |
| `GovernanceContextSourcePort` | `PolicySnapshotRef`;purpose / scope | `ExternalSourceSafeResult` | runtime(ref) | Policy / Decision truth 外置;taxonomy pending |
| `RuntimeContractContextSourcePort` | Runtime boundary / contract / source refs;purpose / scope | `ExternalSourceSafeResult` | runtime(ref) | mapping / source family pending |
| `ToolContractViewSourcePort` | `ToolContractViewRef`;purpose / scope | `ExternalSourceSafeResult` | runtime(ref),optional | 不依赖 Tools package,不复制 definition |
| `MethodDefinitionViewSourcePort` | `MethodDefinitionRef`;purpose / scope | `ExternalSourceSafeResult` | runtime(ref),optional | 不复制 method body |
| `RouteContextSourcePort` | host / publication / observation boundary ref;purpose / scope | `ExternalSourceSafeResult` | runtime(ref) / event(ref) | 不拥有 endpoint registry / Bus route truth |
| `ExternalContextMirrorStore` | snapshot / resolution / gap;expected version | stored support facts / duplicate / conflict | persistence | support truth only;schema / transaction / retention留03 / 04 |

## 7. Step 8 展开候选

| 接口 | 是否独立处理流 | 原因 |
|---|---|---|
| `ResolveExternalContext` | 是 | P0 support write,必须展示 owner-specific port、snapshot、resolution / gap与neutral语义。 |
| `RequestExternalContextRefresh` + refresh Job | 是 | Command / background continuation分层与append-only refresh。 |
| 五类 source update Consumers | 是,可合并 owner-specific source update flow并列差异 | 均写 support state,但adapter / owner不能合并。 |
| 两个 Query | `GetExternalContextResolution`需短 flow | Query不可隐式 refresh或授权。 |

## 8. CP06 接口停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 4 个对象能力有接口承接 | pass | resolve / refresh Commands、Queries、Consumers、Job / events完整。 |
| Command / Query读写分类 | pass | resolution write与resolution read明确分开。 |
| owner-specific而非generic hub | pass | 五类 Consumer与各 source port按owner隔离。 |
| neutral resolution边界 | pass | resolved不等于 authorized / healthy / accepted / available。 |
| refresh append-only | pass | Job产生新 snapshot / resolution / gap,不覆盖旧事实。 |
| Step 8可反查 | pass | P0 resolution、refresh、source Consumers与Query均覆盖。 |

CP06 结论为 `completed / pass / stop_review`。下一允许模块是 CP07 Member Read Model 接口正式化。
