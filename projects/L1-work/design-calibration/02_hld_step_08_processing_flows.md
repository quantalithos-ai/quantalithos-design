# Step 8. 关键处理流 / 重要函数数据流

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 8
> 回填章节: `02-概要设计.md` §8 关键处理流 / 重要函数数据流
> 生成日期: 2026-06-03
> 状态: 已完成

---

## 1. 本步目标

基于 Step 6 关键对象和 Step 7 接口骨架,说明关键 command、query、event consumer 和 operations job 如何经过 application service、domain object、repository / projection / outbox 形成处理流。

本步只写概要级数据流、事务内外边界和关键对象关系,不写完整伪代码、SQL、错误码全集、重试参数或完整 Rust 签名。

---

## 2. 通用处理流骨架

```text
+======================== L1-work generic flow ========================+
| Inbound command / query / event / job                                 |
|        | validate context / metadata / dedup                          |
|        v                                                              |
| Application service / job service                                     |
|        | load truth / snapshot / projection as needed                  |
|        v                                                              |
| Domain object + policy                                                |
|        | decide accepted / rejected / stale / pending                  |
|        v                                                              |
| Repository / projection / outbox / trace write boundary                |
|        | emit result, event intent, trace, or maintenance report        |
+======================================================================+
```

关键设计点:

- Command 成功必须表示核心 truth 已在同步边界内成立。
- Query 只能读取 truth / projection / trace,不得隐式创建或修复对象。
- Inbound Event Consumer 只能写 snapshot / reference / pending input,不得绕过 formalize / promote。
- Operations Job 只能维护派生、快照、outbox、对账和交接状态,不得改写业务 truth。

---

## 3. Command 处理流

#### CreateProject 处理流

```text
+========================= CreateProject =========================+
| command: ProjectSpec + ActorContext + CommandMetadata             |
|        v                                                          |
| ProjectCommandService reserves idempotency                        |
|        v                                                          |
| Project::create(ProjectSpec spec, ActorRef actor)                 |
| Backlog::open_for_project(ProjectId project_id, ActorRef actor)   |
|        v                                                          |
| WorkTruthPolicy validates project truth boundary                  |
|        v                                                          |
| save Project + Backlog + WorkAuditTrail + WorkOutboxRecord        |
+=================================================================+
```

关键设计点:项目主语和初始 Backlog 在同一 truth 写边界成立;查询、对话引用或 workspace view 不能隐式创建 Project。

#### UpdateBacklogAvailability 处理流

```text
+===================== UpdateBacklogAvailability =================+
| command: BacklogRef + BacklogAvailabilityTarget + reason          |
|        v                                                          |
| load Backlog + Project lifecycle                                  |
|        v                                                          |
| BacklogAvailabilityPolicy validates maintenance lock / unlock      |
|        v                                                          |
| Backlog transitions availability explicitly                        |
|        v                                                          |
| save Backlog + WorkAuditTrail + WorkOutboxRecord                   |
+=================================================================+
```

关键设计点:Backlog 只能在 `Open` 和 `LockedForMaintenance` 间显式切换;`Archived` 只能由 Project archive 联动产生。

#### AssignProjectMember 处理流

```text
+====================== AssignProjectMember ======================+
| command: ProjectRef + GlobalMemberRef + ProjectResponsibilitySpec |
|        v                                                          |
| load Project + MemberCapabilitySnapshot                           |
|        v                                                          |
| MemberResponsibilityPolicy checks assignability                   |
|        v                                                          |
| ProjectMember::assign(ProjectId project_id, GlobalMemberRef ref,  |
|                       ProjectResponsibilitySpec spec)             |
|        v                                                          |
| save ProjectMember + audit + outbox                               |
+=================================================================+
```

关键设计点:ProjectMember 只表达项目内承担;identity 成员生命周期只通过快照和引用参与。

#### CreateWorkItem 处理流

```text
+========================= CreateWorkItem ========================+
| command: ProjectRef + FormalWorkIntent + SourceWorkRef            |
|        v                                                          |
| load Project + Backlog + source/reference state                    |
|        v                                                          |
| FormalWorkPolicy::assert_formal_work(FormalWorkIntent intent,     |
|                                      SourceWorkRef source_ref)     |
|        v                                                          |
| WorkItem::formalize(FormalWorkIntent intent, SourceWorkRef source,|
|                     ActorRef actor)                               |
|        v                                                          |
| save WorkItem + Backlog relation + audit + outbox                  |
+=================================================================+
```

关键设计点:只有协作级正式工作能进入 Backlog;conversation suggestion、runtime step 和 ImplementationPlan 正文只能作为来源引用。

#### UpdateWorkItemLifecycle 处理流

```text
+====================== UpdateWorkItemLifecycle ===================+
| command: FormalWorkRef + WorkLifecycleTarget + reason/evidence    |
|        v                                                          |
| load WorkItem / ChildWorkItem + current state                      |
|        v                                                          |
| if target Completed: CompletionEvidencePolicy checks evidence      |
|        v                                                          |
| WorkItem / ChildWorkItem transitions lifecycle explicitly          |
|        v                                                          |
| save work truth + audit + outbox                                   |
+=================================================================+
```

关键设计点:开始、完成、取消和替代都必须通过显式 command;完成必须携带 `ExternalEvidenceRef`,普通路径不得从 `Completed` 回到 `InProgress`。

#### RequestWorkPromotion 处理流

```text
+======================= RequestWorkPromotion =====================+
| command: SourceWorkRef + PromoteReason + context                  |
|        v                                                          |
| load source resolution + optional parent WorkItem                  |
|        v                                                          |
| PromotePolicy::can_promote(SourceWorkRef source_ref,              |
|                            PromoteReason reason)                  |
|        v                                                          |
| PromoteResult::evaluate(SourceWorkRef source_ref,                 |
|                         PromoteReason reason, ActorRef actor)     |
|        v                                                          |
| save PendingReview / Rejected PromoteResult + audit + outbox       |
+=================================================================+
```

关键设计点:`RequestWorkPromotion` 只建立待审或拒绝的 promote 结果;接受和正式工作创建必须由 `ReviewWorkPromotion` 显式完成。

#### ReviewWorkPromotion 处理流

```text
+======================= ReviewWorkPromotion ======================+
| command: PromoteResultRef + PromoteReviewDecision + context        |
|        v                                                          |
| load pending PromoteResult + source resolution                     |
|        v                                                          |
| if decision accepts: create WorkItem / ChildWorkItem                |
|        v                                                          |
| PromoteResult::accept(FormalWorkRef work_ref, ActorRef actor)      |
| or PromoteResult::reject(PromoteRejectReason reason, ActorRef)     |
|        v                                                          |
| save result + PromoteDecisionRecord + audit + outbox               |
+=================================================================+
```

关键设计点:promote 接受、拒绝和正式工作创建属于同一个显式 review 边界;外部事件不能直接把来源写成 WorkItem。

#### LinkWorkDependency 处理流

```text
+======================== LinkWorkDependency ======================+
| command: FormalWorkRef upstream + FormalWorkRef downstream        |
|        v                                                          |
| load both formal work refs + dependency graph snapshot             |
|        v                                                          |
| DependencyGraphPolicy::assert_can_link(DependencyGraphSnapshot,   |
|                                        FormalWorkRef upstream,    |
|                                        FormalWorkRef downstream)  |
|        v                                                          |
| WorkDependency::link(FormalWorkRef upstream, FormalWorkRef down,  |
|                      DependencyReason reason)                     |
|        v                                                          |
| save relation + DependencyChangeRecord + audit + outbox            |
+=================================================================+
```

关键设计点:`UpdateWorkDependencyState`、`OpenWorkBlocker` 和 `ResolveWorkBlocker` 使用同一关系变更骨架;`UpdateWorkDependencyState` 必须覆盖 `DependencyTarget::Active` 的 proposed activation 分支;满足 / 解除路径必须额外经过 `CompletionEvidencePolicy` 校验依据。

#### CommitIterationScope 处理流

```text
+======================= CommitIterationScope =====================+
| command: IterationRef + FormalWorkRefSet candidates               |
|        v                                                          |
| load Iteration + Backlog membership + ProjectMember capacity hints |
|        v                                                          |
| IterationCommitmentPolicy validates candidates                    |
|        v                                                          |
| IterationCommitment::from_candidates(IterationId iteration_id,    |
|                                     FormalWorkRefSet candidates,  |
|                                     ActorRef actor)               |
|        v                                                          |
| save commitment + IterationChangeRecord + audit + outbox           |
+=================================================================+
```

关键设计点:承诺范围必须来自正式工作全集;process planning 只能提供 `ProcessTimeboxRef`,不能维护 Iteration truth。

#### UpdateIterationCommitment 处理流

```text
+===================== UpdateIterationCommitment =================+
| command: IterationRef + IterationCommitmentChangeSet + reason     |
|        v                                                          |
| load IterationCommitment + Backlog membership                      |
|        v                                                          |
| IterationCommitmentPolicy validates added/removed formal work      |
|        v                                                          |
| IterationCommitment::apply_change(change_set, ActorRef actor)      |
|        v                                                          |
| save commitment + IterationChangeRecord + audit + outbox           |
+=================================================================+
```

关键设计点:调整已承诺集合必须显式记录变化原因;process planning 只能提供候选窗口,不能直接改变 commitment truth。

#### UpdateIterationLifecycle 处理流

```text
+====================== UpdateIterationLifecycle ==================+
| command: IterationRef + IterationLifecycleTarget + target reason   |
|        v                                                          |
| load Iteration + current commitment state                          |
|        v                                                          |
| Iteration transitions lifecycle explicitly                         |
|        v                                                          |
| save Iteration + IterationChangeRecord + audit + outbox            |
+=================================================================+
```

关键设计点:start / close / cancel 都是 Work truth 内的显式生命周期变化;process timing event 只能刷新 timebox snapshot,不能推进 Iteration 状态。

---

## 4. Query 处理流

#### GetProjectBoardView 处理流

```text
+======================= GetProjectBoardView ======================+
| query: ProjectRef + filters + ActorContext + QueryMetadata         |
|        v                                                          |
| AuthorizedWorkQueryService validates visibility                    |
|        v                                                          |
| read ProjectBoardView + DerivedWorkViewState                       |
|        v                                                          |
| if stale: return board view with freshness marker                  |
|        v                                                          |
| no truth mutation, no projection rebuild in query path             |
+=================================================================+
```

关键设计点:`GetProjectWorkFacts`、`GetBacklog`、`GetWorkItem` 和 `GetWorkTrace` 走通用读路径;`GetProjectBoardView` / `SearchWork` / `ListMemberWork` 必须显式返回 stale / rebuilding 状态。

---

## 5. Inbound Event Consumer 处理流

#### ConsumeRuntimePromoteRequested 处理流

```text
+==================== ConsumeRuntimePromoteRequested ==============+
| event envelope: event id + dedup key + SourceWorkRef              |
|        v                                                          |
| event consumer reserves event dedup                               |
|        v                                                          |
| SourceWorkRef::from_external(SourceWorkKind source_kind,          |
|                              ExternalSourceRef external_ref)      |
|        v                                                          |
| write pending promote intake + ReferenceResolutionState            |
|        v                                                          |
| optionally notify command boundary; do not create ChildWorkItem    |
+=================================================================+
```

关键设计点:runtime 事件只形成来源引用和待 formalize 入口;正式 child WorkItem 仍必须由 `RequestWorkPromotion` 语义成立。

#### ConsumeIdentityMemberChanged 处理流

```text
+===================== ConsumeIdentityMemberChanged ===============+
| event envelope: event id + member ref + capability summary        |
|        v                                                          |
| reserve event dedup                                                |
|        v                                                          |
| MemberCapabilitySnapshot::from_identity(GlobalMemberRef member,   |
|                                         CapabilityRefSet caps)    |
|        v                                                          |
| save snapshot + ReferenceResolutionState                           |
|        v                                                          |
| mark affected derived views stale                                  |
+=================================================================+
```

关键设计点:method definition、process timing、governance decision 和 artifact evidence changed 事件共用该快照刷新骨架,只更换 snapshot/ref 类型。

---

## 6. Operations Job 处理流

#### PublishWorkOutbox 处理流

```text
+========================= PublishWorkOutbox ======================+
| job input: outbox range + run metadata + system actor             |
|        v                                                          |
| load pending WorkOutboxRecord                                     |
|        v                                                          |
| publish outbound event through bus boundary                       |
|        v                                                          |
| WorkOutboxRecord::mark_published(OutboxPublicationRef ref)        |
| or WorkOutboxRecord::mark_failed(OutboxFailureReason reason)      |
+=================================================================+
```

关键设计点:outbox 发布是异步传播,失败只改变 publication state,不得回滚已成立 truth。

#### RebuildWorkProjections 处理流

```text
+====================== RebuildWorkProjections ====================+
| job input: projection set + project scope + run metadata          |
|        v                                                          |
| read ProjectWorkTruthSnapshot from truth repositories             |
|        v                                                          |
| ProjectBoardView::from_truth(ProjectWorkTruthSnapshot snapshot)   |
| MemberWorkView / WorkSearchProjection rebuild from same truth      |
|        v                                                          |
| DerivedWorkViewState::mark_fresh(WorkTruthCursor cursor)          |
+=================================================================+
```

关键设计点:projection rebuild 只能从 committed Work truth 重建;不能从旧 projection 或外部正文反推出业务事实。

#### RunWorkReconciliation 处理流

```text
+======================== RunWorkReconciliation ===================+
| job input: reconciliation scope + run metadata                    |
|        v                                                          |
| compare truth cursor, projection state, outbox state, ref state    |
|        v                                                          |
| ReconciliationReport::from_check(WorkReconciliationCheck check)   |
|        v                                                          |
| save report and mark affected derived/reference states             |
|        v                                                          |
| no automatic business truth repair                                |
+=================================================================+
```

关键设计点:对账报告暴露漂移和重建需求,不能直接修正 Project、WorkItem、Iteration 或 dependency truth。

---

## 7. 处理流与对象 / 接口对应关系

| 处理流 | 覆盖接口 | 关键对象 |
|---|---|---|
| `CreateProject` | `CreateProject`、`UpdateProjectLifecycle`、`UpdateBacklogAvailability` lifecycle / availability 变体 | `Project`、`Backlog`、`WorkAuditTrail`、`WorkOutboxRecord` |
| `AssignProjectMember` | `AssignProjectMember`、`UpdateProjectMemberResponsibility` | `ProjectMember`、`MemberCapabilitySnapshot`、`WorkAuditTrail` |
| `CreateWorkItem` | `CreateWorkItem`、`CreateChildWorkItem`、`UpdateWorkItemLifecycle` | `Backlog`、`WorkItem`、`ChildWorkItem`、`FormalWorkPolicy`、`CompletionEvidencePolicy` |
| `RequestWorkPromotion` | `RequestWorkPromotion`、`ReviewWorkPromotion`、promote 接收路径 | `SourceWorkRef`、`PromoteResult`、`PromoteDecisionRecord` |
| `LinkWorkDependency` | `LinkWorkDependency`、`UpdateWorkDependencyState`、`OpenWorkBlocker`、`ResolveWorkBlocker` | `WorkDependency`、`WorkBlocker`、`DependencyChangeRecord` |
| `CommitIterationScope` | `OpenIteration`、`CommitIterationScope`、`UpdateIterationCommitment`、`UpdateIterationLifecycle` | `Iteration`、`IterationCommitment`、`IterationChangeRecord` |
| `GetProjectBoardView` | projection / stale query 类 | `ProjectBoardView`、`DerivedWorkViewState` |
| `ConsumeRuntimePromoteRequested` | runtime promote event | `SourceWorkRef`、`ReferenceResolutionState` |
| `ConsumeIdentityMemberChanged` | external snapshot refresh event 类 | `MemberCapabilitySnapshot`、`MethodDefinitionSnapshot`、`ExternalEvidenceRef` |
| `PublishWorkOutbox` | outbox publication job | `WorkOutboxRecord` |
| `RebuildWorkProjections` | projection rebuild job | `ProjectBoardView`、`MemberWorkView`、`WorkSearchProjection` |
| `RunWorkReconciliation` | reconciliation job | `ReconciliationReport` |

---

## 8. 未展开处理流的取舍说明

| 未独立展开项 | 处理方式 | 理由 |
|---|---|---|
| 简单 truth query | 归入通用读路径 | 不含 projection fallback 或 stale 状态 |
| 具体外部 changed event | 归入 snapshot refresh 骨架 | 只更换 snapshot/ref 类型,不改变主流程 |
| `PrepareWorkTraceHandoff` / `PrepareArchiveHandoff` | 归入 outbox / handoff 类后台流 | 详细交接协议留到详细设计 |
| 高级看板外围增强 | 只保留 Step 7 Query 骨架 | 不阻塞核心闭环 |
| 具体错误分支 | 留到 Step 10 | 本步只写改变主流程骨架的失败状态 |

---

## 9. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §8 “关键处理流 / 重要函数数据流”引用本文件 §2 的通用处理流。
- §8 摘录 §3~§6 的关键处理流图,可按篇幅压缩同构变体。
- §8 保留 §7 的接口 / 对象映射表,作为详细设计补函数签名、事务和测试矩阵的入口。

---

## 10. 进入下一步条件

- 已明确关键 command 如何经 application service、domain object、repository 和 outbox 成立。
- 已明确 query stale / projection fallback 的只读边界。
- 已明确会改写本地状态的 inbound event consumer 不绕过 formalize / promote。
- 已明确影响传播可靠性和查询一致性的 operations job 主流程。
- 未写完整伪代码、SQL、错误码全集或重试实现。
- 可以进入 Step 9 “状态机与状态流转”。
