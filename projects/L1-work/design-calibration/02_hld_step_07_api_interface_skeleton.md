# Step 7. API / 接口骨架

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 7
> 回填章节: `02-概要设计.md` §7 API / 接口骨架
> 生成日期: 2026-06-03
> 状态: 已完成

---

## 1. 本步目标

把 `L1-work` 的正式入口按 Command、Query、Inbound Event Consumer、Outbound Event 和 Operations Job 分类,明确每类接口的输入骨架、输出骨架、读写性质和边界。

本步不写 HTTP path、RPC method、完整 JSON / proto schema、CloudEvent 字段全集、错误码、repository trait、事务细节或 handler 调用链。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_06_key_objects.md` + 附录 | 已完成 | 提供接口必须承接的对象主语 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供主要组成部分和职责边界 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成 | 提供 truth / snapshot / reference / derived 分层 |
| `01_arch_step_09_interactions_communication.md` | 已完成 | 提供同步、异步和后台承接口径 |
| `00_req_step_12_interfaces_dependencies.md` | 已完成 | 提供能力级接口面和依赖边界 |

---

## 3. 接口分类说明

| 接口类别 | 读写性质 | 主要用途 | 必须携带的上下文 |
|---|---|---|---|
| Command | 改写 Work truth | 项目、成员、正式工作、promote、依赖、Iteration 等核心变化 | `ActorContext`、`CommandMetadata`、`CommandMetadata.request.idempotency_key` |
| Query | 只读 | 读取 truth 摘要、派生视图、追溯和引用状态 | `ActorContext`、`QueryMetadata` |
| Inbound Event Consumer | 改写 snapshot / reference / pending input,必要时触发 formalize 边界 | 承接外部已成立事实或运行期 promote 需求 | event envelope、event id、source ref、dedup key、trace context |
| Outbound Event | 只输出已成立事实或维护状态 | 传播 Work truth 变化、追溯交接和派生状态变化 | outbox event id、truth ref、trace context |
| Operations Job | 后台维护 / 派生 / 对账 | 重建投影、刷新引用、发布 outbox、形成交接材料 | job id、run metadata、operator actor 或 system actor |

---

## 4. Command API 骨架表

所有 Command 输入都必须显式携带 `ActorContext actor`、`CommandMetadata metadata` 和幂等信息;缺失 idempotency key 时不得进入 truth 写路径。本表中的 `context` 是 `ActorContext` + `CommandMetadata` 的缩写,不降低 metadata 和 idempotency 强制要求。

| Command | 输入骨架 | 输出骨架 | 写入对象 | 边界 |
|---|---|---|---|---|
| `CreateProject` | `ProjectSpec` + `ActorContext` + `CommandMetadata` | `ProjectCommandResult` | `Project`、`Backlog`、`WorkAuditTrail`、`WorkOutboxRecord` | 显式建立项目主语,不得由查询或外部引用隐式创建 |
| `UpdateProjectLifecycle` | `ProjectRef` + `ProjectLifecycleTarget` + `ProjectLifecycleReason` + context | `ProjectCommandResult` | `Project`、`WorkAuditTrail`、`WorkOutboxRecord` | 只改变 Project 生命周期,不改变 workspace 或 process truth |
| `UpdateBacklogAvailability` | `BacklogRef` + `BacklogAvailabilityTarget` + `BacklogMaintenanceReason` + context | `BacklogCommandResult` | `Backlog`、`WorkAuditTrail`、`WorkOutboxRecord` | 只允许维护锁定 / 解锁;归档由 Project archive 联动 |
| `AssignProjectMember` | `ProjectRef` + `GlobalMemberRef` + `ProjectResponsibilitySpec` + context | `ProjectMemberCommandResult` | `ProjectMember`、`WorkAuditTrail`、`WorkOutboxRecord` | 只表达项目内承担,不改变 GlobalMember |
| `UpdateProjectMemberResponsibility` | `ProjectMemberRef` + `ResponsibilityTarget` + `ProjectMemberReason` + context | `ProjectMemberCommandResult` | `ProjectMember`、`WorkAuditTrail`、`WorkOutboxRecord` | 暂停 / 恢复 / 释放承担必须可追溯 |
| `CreateWorkItem` | `ProjectRef` + `FormalWorkIntent` + `SourceWorkRef` + context | `WorkItemCommandResult` | `Backlog`、`WorkItem`、`WorkAuditTrail`、`WorkOutboxRecord` | 只接收协作级正式工作,拒绝个人步骤和对话正文 |
| `CreateChildWorkItem` | `WorkItemRef parent` + `FormalWorkIntent` + `SourceWorkRef` + context | `WorkItemCommandResult` | `ChildWorkItem`、`WorkAuditTrail`、`WorkOutboxRecord` | child 仍是正式工作,不是执行步骤;promote 接受路径由 `ReviewWorkPromotion` 写入决策记录 |
| `UpdateWorkItemLifecycle` | `FormalWorkRef` + `WorkLifecycleTarget` + `WorkLifecycleReason` + `Option<ExternalEvidenceRef>` + context | `WorkItemCommandResult` | `WorkItem` / `ChildWorkItem`、`WorkAuditTrail`、`WorkOutboxRecord` | 完成必须携带可接受完成依据;取消、替代和开始必须显式可追溯 |
| `RequestWorkPromotion` | `SourceWorkRef` + `PromoteReason` + context | `PromoteCommandResult` | `PromoteResult`、`WorkAuditTrail`、`WorkOutboxRecord` | 创建待审 promote 结果;来源只可引用或摘要,不得保存正文 |
| `ReviewWorkPromotion` | `PromoteResultRef` + `PromoteReviewDecision` + context | `PromoteCommandResult` | `PromoteResult`、`PromoteDecisionRecord`、可选 `WorkItem` / `ChildWorkItem`、`WorkOutboxRecord` | 接受后才可创建正式工作;拒绝也必须记录理由 |
| `LinkWorkDependency` | `FormalWorkRef upstream` + `FormalWorkRef downstream` + `DependencyReason` + context | `DependencyCommandResult` | `WorkDependency`、`DependencyChangeRecord`、`WorkOutboxRecord` | 依赖必须连接正式工作且可解释 |
| `UpdateWorkDependencyState` | `WorkDependencyRef` + `DependencyTarget` + `DependencyChangeReason` + `Option<ExternalEvidenceRef>` + context | `DependencyCommandResult` | `WorkDependency`、`DependencyChangeRecord`、`WorkOutboxRecord` | `Active` target 激活 proposed dependency;满足、豁免或取消依赖必须有 evidence 或同族 reason |
| `OpenWorkBlocker` | `FormalWorkRef blocked` + `BlockerCauseRef` + context | `BlockerCommandResult` | `WorkBlocker`、`DependencyChangeRecord`、`WorkOutboxRecord` | blocker 不替代 governance 裁决 |
| `ResolveWorkBlocker` | `WorkBlockerRef` + `ExternalEvidenceRef` + context | `BlockerCommandResult` | `WorkBlocker`、`DependencyChangeRecord`、`WorkOutboxRecord` | 解除必须有可接受依据引用,并写入 blocker 的 `resolved_evidence_ref` |
| `OpenIteration` | `ProjectRef` + `ProcessTimeboxRef` + context | `IterationCommandResult` | `Iteration`、`WorkOutboxRecord` | process 只提供节奏引用,不拥有 Iteration |
| `CommitIterationScope` | `IterationRef` + `FormalWorkRefSet candidates` + context | `IterationCommandResult` | `IterationCommitment`、`IterationChangeRecord`、`WorkOutboxRecord` | 候选必须来自正式工作全集 |
| `UpdateIterationCommitment` | `IterationRef` + `IterationCommitmentChangeSet` + `IterationChangeReason` + context | `IterationCommandResult` | `IterationCommitment`、`IterationChangeRecord`、`WorkOutboxRecord` | 调整承诺集合必须显式记录变化原因 |
| `UpdateIterationLifecycle` | `IterationRef` + `IterationLifecycleTarget` + target-specific reason + context | `IterationCommandResult` | `Iteration`、`WorkOutboxRecord` | start / cancel 使用 `IterationChangeReason`;close 使用 `IterationCloseReason`;不改变 process truth;不追加 `IterationChangeRecord` |

---

## 5. Query API 骨架表

所有 Query 输入都必须显式携带 `ActorContext actor` 和 `QueryMetadata metadata`;Query 不得创建或修改 Project、ProjectMember、WorkItem、Iteration、dependency、projection 或 outbox。本表中的 `context` 是 `ActorContext` + `QueryMetadata` 的缩写。

| Query | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetProjectWorkFacts` | `ProjectRef` + `ActorContext` + `QueryMetadata` | `ProjectWorkFactsView` | truth repository + trace summary | 返回授权可见的项目工作事实摘要 |
| `GetBacklog` | `ProjectRef` + filters + context | `BacklogView` | Backlog / WorkItem truth 或 projection | 不触发 formalize 或隐式创建 |
| `GetWorkItem` | `FormalWorkRef` + context | `WorkItemView` | WorkItem / ChildWorkItem truth + evidence refs | 不拉取 artifact / runtime 正文 |
| `ListMemberWork` | `ProjectMemberRef` + filters + context | `MemberWorkView` | projection,必要时附 stale 状态 | 只读成员工作视图 |
| `GetIterationSummary` | `IterationRef` + context | `IterationSummaryView` | Iteration truth + projection | 不改变承诺范围 |
| `SearchWork` | `ProjectRef` + `WorkSearchCriteria` + context | `WorkSearchResult` | `WorkSearchProjection` | projection 过期时返回 stale 标记 |
| `GetWorkTrace` | `WorkTraceSubjectRef` + context | `WorkTraceView` | `WorkTraceRecord` / `WorkAuditTrail` | 不替代全局 observability |
| `GetProjectBoardView` | `ProjectRef` + view filters + context | `ProjectBoardView` | board projection | 高级看板只读且可滞后 |

---

## 6. Inbound Event Consumer 骨架表

所有 Inbound Event Consumer 输入必须携带 event envelope、event id、source ref、dedup key 或 idempotency key、trace context。Consumer 不得绕过 application boundary 直接写核心 truth。

| Consumer | 来源 | 输入骨架 | 写入结果 | 边界 |
|---|---|---|---|---|
| `ConsumeIdentityMemberChanged` | `L1-identity` | member changed envelope + member ref + capability summary | `MemberCapabilitySnapshot`、`ReferenceResolutionState` | 只刷新成员快照,不改 GlobalMember |
| `ConsumeMethodDefinitionChanged` | `L3-method-library` | definition changed envelope + definition ref | `MethodDefinitionSnapshot`、`ReferenceResolutionState` | 不保存定义正文 |
| `ConsumeConversationWorkContextChanged` | `L1-conversation` | conversation context envelope + source ref | `SourceWorkRef` 解析状态或 pending formalize marker | 不把 conversation fact 直接写成 WorkItem |
| `ConsumeProcessTimingChanged` | `L1-process` | timing / planning envelope + timebox ref | process timing snapshot / reference state | 不让 process 维护 Backlog 或 Iteration truth |
| `ConsumeGovernanceDecisionChanged` | `L1-governance` | decision envelope + governance ref | governance conclusion summary / reference state | 不保存治理裁决正文 |
| `ConsumeArtifactEvidenceChanged` | `L1-artifact` | evidence envelope + evidence ref | `ExternalEvidenceRef` snapshot / reference state | 不保存 artifact / evidence 正文 |
| `ConsumeRuntimePromoteRequested` | `L2-runtime` | promote request envelope + plan item source ref | pending `SourceWorkRef` / promote intake record | 不直接创建 child WorkItem;必须走 `RequestWorkPromotion` 语义 |

---

## 7. Outbound Event 骨架表

Outbound Event 只能从已成立 truth 变化、维护状态变化或交接意图形成;发布失败不得回滚核心 truth。

| Event | 触发来源 | 输出骨架 | 消费方 | 边界 |
|---|---|---|---|---|
| `ProjectChanged` | `Project` lifecycle change | project ref + change kind + trace context | SDK / workspace / process / archive | 不携带 workspace 正文 |
| `BacklogChanged` | `Backlog` availability change | backlog ref + project ref + backlog state + maintenance reason + trace context | SDK / workspace / process / archive | 不复用 ProjectChanged;不携带 workspace / process 正文 |
| `ProjectMemberChanged` | `ProjectMember` change | project member ref + responsibility state + trace context | member-service / runtime / workspace | 不改变 identity truth |
| `WorkItemChanged` | `WorkItem` / `ChildWorkItem` change | formal work ref + work state + source refs | process / governance / artifact / workspace | 不携带计划或 artifact 正文 |
| `PromoteResultRecorded` | `PromoteResult` | source ref + result state + created work ref | runtime / conversation / artifact | 只回传 promote 结果 |
| `WorkDependencyChanged` | `WorkDependency` | relation ref + relation state + affected work refs | workspace / process / governance | 只传播关系摘要 |
| `WorkBlockerChanged` | `WorkBlocker` | blocker ref + blocker state + evidence ref from `resolved_evidence_ref` | workspace / governance / artifact | 不携带 evidence 正文 |
| `IterationChanged` | `Iteration` / `IterationCommitment` | iteration ref + commitment summary + trace context | process / workspace / runtime | 不让 process 反写承诺 |
| `WorkTraceAvailable` | `WorkTraceRecord` | trace subject ref + trace ref + handoff ref | observability / archive | 不替代全局日志 |
| `DerivedWorkViewChanged` | `DerivedWorkViewState` | view ref + freshness state + cursor | workspace / SDK | 派生变化不代表新 truth |

---

## 8. Operations Job 骨架表

Operations Job 必须携带 job id、run metadata 和 system actor / operator actor。Job 可以维护派生、快照、outbox、对账和交接状态,不得隐式创建或修改业务 truth。

| Job | 输入骨架 | 输出骨架 | 允许写入 | 边界 |
|---|---|---|---|---|
| `PublishWorkOutbox` | outbox range + run metadata | publication report | `WorkOutboxRecord.publication_state` | 发布失败不回滚 truth |
| `RebuildWorkProjections` | projection set + project scope + run metadata | rebuild report | `ProjectBoardView`、`MemberWorkView`、`WorkSearchProjection`、`DerivedWorkViewState` | 只从 truth 重建 |
| `RefreshExternalReferenceSnapshots` | reference scope + run metadata | refresh report | snapshots、`ReferenceResolutionState` | 不复制外部正文 |
| `RunWorkReconciliation` | reconciliation scope + run metadata | `ReconciliationReport` | reconciliation projection / report | 不直接修正业务 truth |
| `PrepareWorkTraceHandoff` | trace scope + archive / observability target | handoff report | `WorkTraceRecord` handoff state | 交接失败只挂起 |
| `PrepareArchiveHandoff` | project / iteration / trace scope + run metadata | archive handoff intent | archive handoff marker / outbox | 不拥有 archive 长期正文 |

---

## 9. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否把 HTTP / RPC path 写入本步 | 不写 | 本步只定接口骨架和类别 |
| 是否把 repository / port trait 当接口骨架主体 | 不作为外部 API 主体 | repository / port 在详细设计定义 |
| 是否让 Inbound Event 直接创建 WorkItem | 不允许 | 必须经过 formalize / promote 语义 |
| 是否让 Operations Job 修复核心 truth | 不允许 | Job 只能维护派生、快照、outbox、对账和交接 |
| 是否把高级看板作为核心 Query | 作为只读外围增强 Query | 可保留入口骨架,但不得阻塞核心闭环 |

---

## 10. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §7 “API / 接口骨架”引用本文件 §3 的接口分类说明。
- §7 摘录 §4~§8 的五张骨架表,可按篇幅压缩外围增强 Query。
- 详细设计必须基于这些骨架继续定义正式 command / query / event DTO、错误码、幂等结果、repository / port 和事务边界。

---

## 11. 进入下一步条件

- 已明确本仓接口按 Command / Query / Event / Operations 分类。
- 已显式说明 Command 需要 `ActorContext`、`CommandMetadata` 和幂等信息。
- 已显式说明 Query 需要 `ActorContext`。
- 已显式说明 Event Consumer 需要 envelope、event id、dedup / idempotency 和 trace context。
- 未写入 HTTP path、完整 DTO schema、topic 名称或 repository 函数。
- 可以进入 Step 8 “关键处理流 / 重要函数数据流”。
