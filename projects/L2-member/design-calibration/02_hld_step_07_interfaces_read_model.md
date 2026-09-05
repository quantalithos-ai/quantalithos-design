# Step 7 附录 CP07. Member Read Model 接口

> 主控文件: `02_hld_step_07_api_interface_skeleton.md`
> 对应对象: Step 6 CP07 的 5 个对象
> 状态: completed / pass / stop_review

## 1. Command API 骨架

CP07 不提供修改 core truth 的 Command。projection activation / rebuild request 若需显式入口,只作为 Operations Job trigger 或维护语境的 job request,不能由 Query 或 outlet 调用隐式改写 CP01~06。

## 2. Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetMemberSummary` | `ActorContext`;`QueryMetadata`;`ProjectMemberRef`;`ProjectionConsistencyHint` | `MemberSummaryView` / `ProjectionNotReadySurface` | summary projection + `MemberProjectionState` | no-write;显式 stale / degraded / unknown,不触发 rebuild |
| `GetCapabilityOutlet` | `ActorContext`;`QueryMetadata`;`ProjectMemberRef`;`CapabilityOutletFilter`;`ProjectionConsistencyHint` | `CapabilityOutletView` / not_available / stale / gap surface | outlet projection + Mirror resolutions / gaps | no-write;available 不等于 authorization / invocation / execution readiness |
| `GetMemberDiagnostics` | `ActorContext`;`QueryMetadata`;`ProjectMemberRef`;`DiagnosticFilter`;`ProjectionConsistencyHint` | `MemberDiagnosticView` / not_available / degraded | diagnostic projection + Trace / Mirror refs | optional read-only;不返回正文、完整日志、evidence或配置 secret |

## 3. Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `MemberProjectionUpdateConsumer` | CP01~06 committed facts / resolution changes | `MemberFactEnvelope`;`MemberFactId`;`SchemaVersion`;`DeduplicationKey`;`TraceContext`;`MemberCommittedFactRef` / `ExternalContextResolutionId` | 标记 `MemberProjectionState` stale / target watermark;新 projection rebuild trigger | 只更新 projection support state,不改 source truth、不由 event body重建 forbidden content |
| `CapabilityOutletSourceUpdateConsumer` | CP06 已提交的 capability resolution / gap fact（其中可带 Tools / Method safe-view refs） | `MemberFactEnvelope`;`MemberFactId`;`SchemaVersion`;`DeduplicationKey`;`TraceContext`;`ExternalContextResolutionId`;`ExternalContextGapId`;safe-view refs | outlet stale / gap / not_available marker | 不直接消费 Tools / Method source event;不复制 definition / registry,不授权 invocation |

## 4. Outbound Event 骨架

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `MemberSummaryProjectionChanged` | committed `MemberSummaryView` revision / `MemberProjectionState` | read consumers、SDK boundary、diagnostic surface | 只传播 view ref、watermark、freshness;不传播 source body |
| `MemberCapabilityOutletChanged` | committed `CapabilityOutletView` revision | read consumers / optional SDK boundary | 传播 outlet ref、activation、freshness / gap;不代表 authorization |
| `MemberDiagnosticViewChanged` | committed optional `MemberDiagnosticView` revision | maintenance / read consumers | 只传播 body-free diagnostic ref / freshness;不生成 evidence / verdict |
| `MemberProjectionStateChanged` | committed `MemberProjectionState` | reconciliation / read consumers | 传播 current / stale / rebuilding / degraded / failed / disabled status |

Exact event carrier / SDK mapping 受 `L2M-UP-005` 与 downstream contract 约束。

## 5. Operations Job 骨架

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `MemberProjectionRebuildJob` | `JobMetadata`;`JobRunRef`;system / operator `ActorContext`;`IdempotencyKey`;committed facts / resolutions / target watermark | new summary / outlet / diagnostic revisions;`MemberProjectionState`;job report skeleton | 只从 committed refs rebuild;failed / stale 显式;不修复 core / external truth,不记录真实 run_id / result |
| `GapReconciliationJob` | `JobMetadata`;`JobRunRef`;system / operator `ActorContext`;`IdempotencyKey`;interaction / publication / external / projection gap refs;已提交 owner resolution / successor refs | new `MemberProjectionState` revision with reconciled gap refs / freshness;job report skeleton | 只消费 source owner 已提交的 resolution / successor refs并更新 projection surface;不创建 / 修改 source gap、不猜测补齐、不触发业务 Command |

## 6. Inward Port / Persistence Interface

| Interface | 输入骨架 | 输出骨架 | 依赖类别 | 边界 / 当前状态 |
|---|---|---|---|---|
| `MemberFactReadPort` | `ProjectMemberRef`;`ProjectionWatermark`;`ProjectionConsistencyHint` | committed local fact refs / source watermark | runtime(ref) | 只读 CP01~05 local truth,无反向写 port |
| `ExternalResolutionReadPort` | source refs / consumer purpose / scope | neutral resolution / gap refs | runtime(ref) | 不把 resolution 当 authorization |
| `ToolSafeViewReadPort` | `ToolContractViewRef`;`CapabilityBindingViewRef`;`MethodDefinitionRef` | safe view refs / source resolution | runtime(ref),optional | 不依赖 Tools package,不复制 definition |
| `MemberProjectionStore` | view revisions / projection state;expected watermark | stored projection / conflict | persistence | projection 可重建,不拥有 core truth |

## 7. Step 8 展开候选

| 接口 | 是否独立处理流 | 原因 |
|---|---|---|
| `MemberProjectionUpdateConsumer` | 是 | 改写 projection state,影响 query freshness。 |
| `CapabilityOutletSourceUpdateConsumer` | 是 | 消费 CP06 committed capability resolution / gap,并保持 outlet stale / gap / optional activation 边界独立。 |
| `MemberProjectionRebuildJob` | 是 | 影响查询一致性,必须展示 watermark / rebuildability。 |
| `GapReconciliationJob` | 是 | 影响 projection gap surface,但只消费 source owner 已提交 resolution / successor refs,不修复 source gap。 |
| `GetMemberSummary` / `GetCapabilityOutlet` / `GetMemberDiagnostics` | Query flow可合并,各自列出 surface差异 | 都是 no-write projection read;summary必需,outlet/diagnostic可裁剪。 |

## 8. CP07 接口停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 5 个对象能力有接口承接 | pass | 3 Queries、2 Consumers、2 Jobs、Events、read ports完整。 |
| projection no-write | pass | 无 core write Command / port;Job只更新 projection state / gap refs,不修改 source gap。 |
| summary / outlet / diagnostics optionality | pass | summary必需,outlet / diagnostics可显式 not_available。 |
| outlet non-authorizing | pass | available / stale / gap不等于 authorization / invocation。 |
| freshness / rebuild boundary | pass | stale / rebuilding / failed / disabled / unknown显式。 |
| Step 8可反查 | pass | state-writing Consumers、rebuild / reconcile Jobs与复杂 Query均覆盖。 |

CP07 结论为 `completed / pass / stop_review`。下一允许动作是回填 Step 7 分类汇总、Step 8 反查和跨接口总审计;通过前不得创建 Step 8。
