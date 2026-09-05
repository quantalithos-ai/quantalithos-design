# Step 7 附录 CP03. Runtime Mediation 接口

> 主控文件: `02_hld_step_07_api_interface_skeleton.md`
> 对应对象: Step 6 CP03 的 5 个对象
> 状态: completed / pass / stop_review

## 1. Command API 骨架

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `SubmitScreenedFactToRuntime` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`ScreeningDecisionId`;`InboundFactRecordId`;`RuntimeBoundaryRef`;`ExternalContextResolutionId` | `RuntimeDeliveryDecision`;`RuntimeSubmissionAttempt`;`Optional<RuntimeResultLink>` | 校验 passed / controlled-degraded screening、fact / subject / mapping,提交正式 Runtime entry seam | local decision + attempt;有正式 admission ref 时追加 result link,否则保持 submitted / blocked / unknown |
| `LinkRuntimeAdmissionResult` | `ActorContext`;`CommandMetadata`;`IdempotencyKey`;`RuntimeSubmissionAttemptId`;`RuntimeAdmissionDecisionRef`;`RuntimeResultClassification`;`RuntimeSourceRef` | `RuntimeResultLink` | 为 late / independently resolved Runtime result 建立 body-free link | immutable link;不修改 Runtime truth或覆盖 attempt |

第二个 Command 是 transport-neutral result ingress use case,不是声明 Runtime 一定采用 callback / event。若 exact contract 证明结果只可能同步返回,03 可将同一用例映射到 port response,但不得删除 `RuntimeResultLink` 语义。

## 2. Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetRuntimeMediationPosture` | `ActorContext`;`QueryMetadata`;`RuntimeDeliveryDecisionId`;`ProjectionConsistencyHint` | `RuntimeMediationReadSurface` | mediation store / safe projection | no-write;区分 decision、attempt、result link、reception,不查询 / 代答 run state |
| `GetRuntimeMaterialReception` | `ActorContext`;`QueryMetadata`;`RuntimeMaterialReceptionId` | `RuntimeMaterialReceptionReadSurface` | mediation store | 只返回 ref / digest / disposition / correlation;不返回 Runtime material body |

## 3. Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `RuntimeMaterialConsumer` | 正式 Runtime committed-material boundary | `EventEnvelope`;`SourceEventId`;`SchemaVersion`;`DeduplicationKey`;`TraceContext`;`RuntimeSafeHandoffMaterialRef`;`RuntimeOutcomeRef`;`RuntimeSourceRef`;`RuntimeMaterialMetadata` | `RuntimeMaterialReception`;duplicate / late / rejected / blocked receipt | 只接受可证明 committed、body-free material ref;不接 model output、hidden reasoning、tool body或 Runtime outcome 副本 |

Runtime source family / direction / carrier 受 `L2M-UP-004/005` 阻塞。无法证明 committed / digest / correlation 时必须 rejected / blocked / unknown。

## 4. Outbound Event 骨架

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `MemberRuntimeDeliveryDecided` | committed `RuntimeDeliveryDecision` | Trace、Read Model、Runtime submission continuation | local eligible / rejected / blocked / pending;不等于 Runtime admission |
| `MemberRuntimeSubmissionAttemptRecorded` | committed `RuntimeSubmissionAttempt` | Trace、Read Model、result resolution continuation | submitted 只表示 port invocation |
| `MemberRuntimeResultLinked` | committed `RuntimeResultLink` | Trace、Read Model | 只传播 formal Runtime result ref / classification;accepted 不等于 run completed |
| `MemberRuntimeMaterialReceived` | committed `RuntimeMaterialReception` | Outbound Boundary、Trace、Read Model | 只有 accepted reception 可触发 outbound evaluation;不转移 Runtime material owner |

Exact event carrier / route 继续受 `L2M-UP-005` 阻塞。

## 5. Operations Job 骨架

CP03 不设置自动 retry Job。`RuntimeSubmissionAttempt.unknown` 必须等待正式 result / side-effect resolution;任何后续提交都是新的显式 Command / attempt。若 exact Runtime contract 需要 polling continuation,03 必须先定义 resolution evidence 和 idempotency contract,不能把定时重试当默认设计。

## 6. Inward Port / Persistence Interface

| Interface | 输入骨架 | 输出骨架 | 依赖类别 | 边界 / 当前状态 |
|---|---|---|---|---|
| `RuntimeEntryPort` | `RuntimeEntrySubmission`;`IdempotencyKey`;`TraceContext` | `RuntimeSubmissionRef`;`Optional<RuntimeAdmissionDecisionRef>` / blocked-aware result | runtime | `L2M-UP-003` mapping pending;port invocation 不表示 run created |
| `RuntimeAdmissionResultSourcePort` | `RuntimeSubmissionRef`;`RuntimeBoundaryRef` | `RuntimeAdmissionDecisionRef` / pending / unknown | runtime | result direction / resolution method 留 03并受上游合同约束 |
| `RuntimeMaterialSourcePort` | `RuntimeSafeHandoffMaterialRef`;`RuntimeSourceRef` | source / committed / digest validation result | runtime(ref) | 不读取 Runtime internal state / body |
| `RuntimeMediationStore` | delivery decision / attempt / result link / reception | stored local facts / duplicate / conflict | persistence | Runtime objects 只作 refs;transaction / schema 留 03 |

这些 ports 都不是对 `L2-runtime` package 的 compile dependency。

## 7. Step 8 展开候选

| 接口 | 是否独立处理流 | 原因 |
|---|---|---|
| `SubmitScreenedFactToRuntime` | 是 | P0 Command,必须展示 decision -> attempt -> port -> optional result link 与 unknown fence。 |
| `LinkRuntimeAdmissionResult` | 是,可作为主 flow 的 late-result 分支 | 改写 result link且要处理 duplicate / late / conflict。 |
| `RuntimeMaterialConsumer` | 是 | 改写 reception 并触发 CP04,同时守 committed / body-free gate。 |
| 两个 Query | 通用只读路径 | 不写 Runtime / member truth。 |

## 8. CP03 接口停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 5 个对象能力有接口承接 | pass | decision、attempt、result link、reception 与 policy 均进入正式用例。 |
| sync entry / async committed result 分层 | pass | Command 不等待 run / outcome;material 独立 Consumer。 |
| submitted / accepted / completed 分层 | pass | port / link / external Runtime truth 清楚。 |
| exact direction 未伪闭口 | pass | result ingress 保持 transport-neutral,carrier 留 03 / upstream。 |
| body / Runtime owner 边界 | pass | 只使用 refs / metadata,无 Runtime internal object。 |
| Step 8 可反查 | pass | P0 Command、late result与 material Consumer 均覆盖。 |

CP03 结论为 `completed / pass / stop_review`。下一允许模块是 CP04 Outbound Boundary 接口正式化。
