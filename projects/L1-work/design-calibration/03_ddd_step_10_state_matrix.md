# Step 10. 定义状态机与转换矩阵

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 10
- 回填章节:`03-详细设计.md` §5.9 状态机与转换矩阵 / §8 事务与一致性 / §9 错误模型

### 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | shared state enum、domain object method、projection / reference / outbox object | 固定状态名、允许来源、允许去向和触发函数 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | repository / projection / reference / outbox port | 固定状态保存位置和辅助状态更新入口 |
| `03_ddd_step_08_protocol_contracts.md` | Command / Query / Event / Job 协议、错误映射 | 固定外部入口和 public error surface |
| `03_ddd_step_09_function_flows.md` | 逐接口处理流、事务、副作用和测试切口 | 固定每个状态转换由哪个 flow 触发 |
| `02_hld_step_09_state_machine.md` | 概要状态机和禁止转换 | 作为状态图来源,但状态名以 Step 6 enum 为准 |
| `standards/document/详细设计书写规范.md` | §5.9 状态机与转换矩阵 | 固定输出表格、ASCII 图和非法转换要求 |

### 3. 分批写入记录

本 Step 按 `设计文档讨论中间产物规范.md` §3.4 分批写入:

| 批次 | 内容 | 状态 |
|---|---|---|
| 10.1 | 文件骨架、SOP 问题回答、状态机清单、设计取舍 | [x] |
| 10.2 | 核心业务 truth 状态集合、ASCII 图和转换矩阵 | [x] |
| 10.3 | 辅助状态集合、跨状态副作用、非法转换处理和待闭环项 | [x] |
| 10.4 | 回填草稿、进入下一步条件 | [x] |

### 4. SOP 问题回答

1. 当前仓有哪些正式状态机?

   回答:本轮 L1-work 正式状态机分为四组。核心业务 truth 状态机包括 `ProjectLifecycleState`、`ProjectMemberResponsibilityState`、`BacklogState`、`WorkItemState`、`PromoteResultState`、`DependencyState`、`BlockerState`、`IterationState`、`CommitmentState`。辅助状态机包括 `DerivedFreshnessState`、`ReferenceResolutionStatus`、`OutboxPublicationState`。这些状态机不得合并为一套状态集合。

2. 每个状态机的状态集合是什么?

   回答:状态集合必须完全使用 Step 6 enum 变体。任何测试、协议 result、read view 和实施计划不得继续使用旧 `Draft`、`Paused`、`Dissolved`、`DraftIteration`、child work proposal 等旧口语状态。

3. 哪些函数会触发状态转换?

   回答:业务 truth 状态只能由 Step 6 domain object factory / transition method 触发,并经 Step 9 command flow 保存。reference 状态由 inbound consumer / refresh job 通过 `ReferenceSnapshotRepository.save_reference_state(...)` 保存。derived freshness 由 command / consumer / rebuild job 通过 `ProjectionRepository.mark_stale(...)` / `replace_project_views(...)` 保存。outbox publication 由 `PublishWorkOutboxFlow` 通过 `WorkOutboxRepository.mark_published(...)` / `mark_failed(...)` 保存。

4. 每个转换的前置条件、副作用和错误是什么?

   回答:§7.4~§7.15 给出每个状态机的转换矩阵。核心写路径的共同副作用是 truth save、正式定义的 history 或 audit trace、outbox enqueue、idempotency complete,以及有正式 public view identity 时的 affected projection stale;非法 transition 在 domain method 返回 `DomainError::InvalidStateTransition`,由 application 映射 `ApplicationError::DomainRejected`,再由 handler 映射 `WorkProtocolError::DomainRejected`。

5. 非法转换应该返回什么错误,是否写审计?

   回答:非法转换不得写业务 truth、不得写 outbox、不得 mark projection stale、不得 complete idempotency 成功结果。若写路径已经 reserve 幂等记录,service 必须 rollback 当前 UoW,并把失败面映射为 reject / domain rejected;是否记录失败审计留给 Step 12 错误恢复细化,但不得把失败审计伪装为 accepted truth change。

### 5. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| HLD 状态机 | 部分状态图是概要级,未绑定 Step 6 exact enum 和 domain method | 本 Step 使用 Step 6 enum / method 重新生成正式矩阵 |
| Step 6 enum 表 | 已给允许来源 / 去向,但缺完整 From-To-Function-Error 矩阵 | 本 Step 补齐触发函数、前置条件、副作用和非法错误 |
| Step 9 flows | flow 说明了状态变化,但未集中说明跨对象联动和非法转换统一口径 | 本 Step 收敛跨状态副作用和回滚规则 |
| projection / reference / outbox | 辅助状态与业务 truth 混写风险较高 | 本 Step 明确辅助状态独立,不得反写真相 |
| 旧 `03-详细设计.md` | 旧状态名和旧 child work / iteration 口径仍可能污染实现 | 本 Step 明确旧状态不得进入新版 formal design |

### 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 状态集合 | HLD 与旧详细设计都有状态候选 | 仅 Step 6 enum 是正式状态名 | 防止实现侧选错旧状态 |
| 状态转换 | 分散在对象契约和处理流中 | 每个状态机都有转换矩阵 | 支撑 domain 单测和 service contract test |
| 非法转换 | 只在个别 flow 中描述 reject | 统一为 `DomainError::InvalidStateTransition` -> `ApplicationError::DomainRejected` | 固定错误边界 |
| 辅助状态 | projection / reference / outbox 与业务状态容易混同 | 单独建矩阵,禁止反写真相 | 满足书写规范“不得揉成一套状态集合” |
| 测试断言 | 只能从 flow 推断 | 每个矩阵挂测试切口 | 方便 Step 16 生成验证清单 |

### 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 单一全局状态矩阵 | 行数集中 | 会混淆业务 truth、projection freshness、reference resolution、outbox publication | 不采用 |
| 每个 enum 一张矩阵 | 可直接映射 domain enum 和 method | 文件较长 | 采用 |
| 只记录合法转换 | 简洁 | 实现侧仍需猜非法错误和副作用 | 不采用 |
| 合法转换 + 非法转换统一规则 | 可落码,测试断言明确 | 需要单独说明跨状态副作用 | 采用 |

### 8. 结构化中间产物

#### 8.1 状态机总表

| 状态机 | 归属对象 / store | 状态字段 | 触发入口 | 是否业务 truth | 终态 |
|---|---|---|---|---|---|
| `ProjectLifecycleState` | `Project` / `ProjectRepository` | `Project.lifecycle_state` | `CreateProjectFlow`、`UpdateProjectLifecycleFlow` | 是 | `Archived` |
| `ProjectMemberResponsibilityState` | `ProjectMember` / `ProjectMemberRepository` | `ProjectMember.responsibility_state` | `AssignProjectMemberFlow`、`UpdateProjectMemberResponsibilityFlow` | 是 | `Released` |
| `BacklogState` | `Backlog` / `BacklogRepository` | `Backlog.backlog_state` | `CreateProjectFlow`、`UpdateBacklogAvailabilityFlow`、project archive path | 是 | `Archived` |
| `WorkItemState` | `WorkItem` / `ChildWorkItem` / `WorkItemRepository` | `work_state` | `CreateWorkItemFlow`、`CreateChildWorkItemFlow`、`UpdateWorkItemLifecycleFlow`、`CommitIterationScopeFlow`、promote accept path | 是 | `Completed`、`Cancelled`、`Superseded` |
| `PromoteResultState` | `PromoteResult` / `PromoteRepository` | `PromoteResult.result_state` | `RequestWorkPromotionFlow`、`ReviewWorkPromotionFlow` | 是 | `Superseded` |
| `DependencyState` | `WorkDependency` / `DependencyRepository` | `WorkDependency.dependency_state` | `LinkWorkDependencyFlow`、`UpdateWorkDependencyStateFlow` | 是 | `Satisfied`、`Waived`、`Cancelled` |
| `BlockerState` | `WorkBlocker` / `BlockerRepository` | `WorkBlocker.blocker_state`;`WorkBlocker.resolved_evidence_ref` | `OpenWorkBlockerFlow`、`ResolveWorkBlockerFlow`、future mitigation / close command | 是 | `Closed` |
| `IterationState` | `Iteration` / `IterationRepository` | `Iteration.iteration_state` | `OpenIterationFlow`、`CommitIterationScopeFlow`、`UpdateIterationLifecycleFlow` | 是 | `Closed`、`Cancelled` |
| `CommitmentState` | `IterationCommitment` / `IterationRepository` | `IterationCommitment.commitment_state` | `CommitIterationScopeFlow`、`UpdateIterationCommitmentFlow`、iteration close path | 是 | `Closed` |
| `DerivedFreshnessState` | `DerivedWorkViewState` / `ProjectionRepository` | `freshness_state` | truth command、inbound consumer、`RebuildWorkProjectionsFlow` | 否 | 无 |
| `ReferenceResolutionStatus` | `ReferenceResolutionState` / `ReferenceSnapshotRepository` | `resolution_state` | inbound consumer、`RefreshExternalReferenceSnapshotsFlow` | 否 | 无 |
| `OutboxPublicationState` | `WorkOutboxRecord` / `WorkOutboxRepository` | `publication_state` | `PublishWorkOutboxFlow` | 否 | `Published` |

#### 8.2 状态集合表

| 状态机 | 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|---|
| `ProjectLifecycleState` | `Active` | 项目接受正常 Work 变更 | 否 | `transition_lifecycle(ReadOnly/Closed)` |
| `ProjectLifecycleState` | `ReadOnly` | 项目只读,普通新增 / 修改受限 | 否 | `transition_lifecycle(Closed)` |
| `ProjectLifecycleState` | `Closed` | 项目关闭,阻止新 Work 进入 | 否 | `transition_lifecycle(Archived)` |
| `ProjectLifecycleState` | `Archived` | 项目归档,普通写路径终止 | 是 | 无 |
| `ProjectMemberResponsibilityState` | `Proposed` | 成员承担关系已提议 | 否 | `activate`、`release` |
| `ProjectMemberResponsibilityState` | `Active` | 成员可承担项目工作 | 否 | `pause`、`release` |
| `ProjectMemberResponsibilityState` | `Paused` | 成员承担临时暂停 | 否 | `resume`、`release` |
| `ProjectMemberResponsibilityState` | `Released` | 成员承担已释放 | 是 | 无 |
| `BacklogState` | `Open` | backlog 接受正式工作变化 | 否 | `lock_for_maintenance`、`archive_with_project` |
| `BacklogState` | `LockedForMaintenance` | backlog 维护锁定 | 否 | `reopen_after_maintenance` |
| `BacklogState` | `Archived` | backlog 随 project 归档 | 是 | 无 |
| `WorkItemState` | `Formalized` | 工作已正式进入 backlog | 否 | `mark_committed`、`transition_lifecycle(InProgress/Cancelled/Superseded)` |
| `WorkItemState` | `Committed` | 工作已进入 iteration 承诺范围 | 否 | `transition_lifecycle(InProgress/Cancelled/Superseded)` |
| `WorkItemState` | `InProgress` | 工作正在推进 | 否 | `mark_completed`、`transition_lifecycle(Superseded)` |
| `WorkItemState` | `Completed` | 工作完成且有 verified evidence | 是 | 无 |
| `WorkItemState` | `Cancelled` | 工作取消 | 是 | 无 |
| `WorkItemState` | `Superseded` | 工作被替代 | 是 | 无 |
| `PromoteResultState` | `PendingReview` | 来源等待评审 | 否 | `accept`、`reject`、supersede path |
| `PromoteResultState` | `Accepted` | 来源被接受并绑定正式工作 | 否 | supersede path |
| `PromoteResultState` | `Rejected` | 来源被拒绝 | 否 | supersede path |
| `PromoteResultState` | `Superseded` | promote decision 被后续评审替代 | 是 | 无 |
| `DependencyState` | `Proposed` | 依赖已提出 | 否 | `activate`、`cancel` |
| `DependencyState` | `Active` | 依赖生效 | 否 | `mark_satisfied`、`waive`、`cancel` |
| `DependencyState` | `Satisfied` | 依赖已满足 | 是 | 无 |
| `DependencyState` | `Waived` | 依赖已豁免 | 是 | 无 |
| `DependencyState` | `Cancelled` | 依赖已取消 | 是 | 无 |
| `BlockerState` | `Open` | 阻塞已打开 | 否 | `start_mitigation`、`resolve` |
| `BlockerState` | `Mitigating` | 阻塞正在缓解 | 否 | `resolve` |
| `BlockerState` | `Resolved` | 阻塞已解除 | 否 | `close` |
| `BlockerState` | `Closed` | 阻塞记录关闭 | 是 | 无 |
| `IterationState` | `Planning` | iteration 正在规划 | 否 | `commit`、`cancel` |
| `IterationState` | `Committed` | iteration 范围已承诺 | 否 | `start`、`cancel` |
| `IterationState` | `InProgress` | iteration 正在推进 | 否 | `close` |
| `IterationState` | `Closed` | iteration 已关闭 | 是 | 无 |
| `IterationState` | `Cancelled` | iteration 已取消 | 是 | 无 |
| `CommitmentState` | `Candidate` | 承诺集合候选 | 否 | commit path |
| `CommitmentState` | `Committed` | 承诺集合生效 | 否 | `apply_change`、`close` |
| `CommitmentState` | `Changed` | 承诺集合已变更 | 否 | `close` |
| `CommitmentState` | `Closed` | 承诺集合关闭 | 是 | 无 |
| `DerivedFreshnessState` | `Fresh` | 派生视图覆盖当前 source cursor | 否 | `mark_stale` |
| `DerivedFreshnessState` | `Stale` | 派生视图落后于 truth | 否 | rebuild start |
| `DerivedFreshnessState` | `Rebuilding` | 派生视图正在重建 | 否 | rebuild success / failure |
| `DerivedFreshnessState` | `Failed` | 最近一次重建失败 | 否 | rebuild retry |
| `ReferenceResolutionStatus` | `Unresolved` | 外部引用未解析 | 否 | `mark_resolved`、failed marker |
| `ReferenceResolutionStatus` | `Resolved` | 外部引用已解析 | 否 | `mark_stale`、failed marker |
| `ReferenceResolutionStatus` | `Stale` | 外部引用快照过期 | 否 | `mark_resolved`、failed marker |
| `ReferenceResolutionStatus` | `Failed` | 外部引用解析失败 | 否 | `mark_resolved` |
| `OutboxPublicationState` | `Pending` | outbox 等待发布 | 否 | `mark_published`、`mark_failed` |
| `OutboxPublicationState` | `Published` | outbox 已发布 | 是 | 无 |
| `OutboxPublicationState` | `Failed` | outbox 最近一次发布失败 | 否 | retry to pending |

#### 8.3 ASCII 状态转换图

##### Project / Backlog

```text
ProjectLifecycleState

create
  |
  v
Active --> ReadOnly --> Closed --> Archived
   \                    ^
    \-------------------|

BacklogState

open_for_project
  |
  v
Open <--> LockedForMaintenance
  |
  v
Archived
```

##### Member / Work / Promote

```text
ProjectMemberResponsibilityState

assign
  |
  v
Proposed --> Active <--> Paused
   |          |          |
   v          v          v
Released <----+----------+

WorkItemState

formalize / create_child / promote accept
  |
  v
Formalized --> Committed --> InProgress --> Completed
    |             |             |
    v             v             v
Cancelled     Cancelled     Superseded
    |
    v
Superseded

PromoteResultState

evaluate
  |
  v
PendingReview --> Accepted --> Superseded
      |             ^
      v             |
   Rejected --------+
```

##### Dependency / Blocker / Iteration

```text
DependencyState

link
  |
  v
Proposed --> Active --> Satisfied
    |          |
    v          v
Cancelled   Waived
    ^          |
    |----------|

BlockerState

open
  |
  v
Open --> Mitigating --> Resolved --> Closed
  |                         ^
  |-------------------------|

IterationState

open
  |
  v
Planning --> Committed --> InProgress --> Closed
   |             |
   v             v
Cancelled     Cancelled

CommitmentState

from_candidates
  |
  v
Candidate --> Committed --> Changed --> Closed
                 |             ^
                 |-------------|
```

##### Auxiliary states

```text
DerivedFreshnessState

Fresh --> Stale --> Rebuilding --> Fresh
           ^             |
           |             v
           +---------- Failed

ReferenceResolutionStatus

Unresolved --> Resolved --> Stale
     |           |          |
     v           v          v
   Failed <------+----------+
     |
     v
  Resolved

OutboxPublicationState

Pending --> Published
   |
   v
 Failed --> Pending
```

#### 8.4 核心业务 truth 状态转换矩阵

##### `ProjectLifecycleState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| create | `Active` | `Project::create(project_id, spec, actor)` via `CreateProjectFlow` | `project_id` 未复用;owner ref 可保存;actor 存在 | save Project;create Backlog `Open`;enqueue `ProjectChanged`;mark views stale | `DomainError::InvalidStateTransition` / `ApplicationError::DomainRejected` |
| `Active` | `ReadOnly` | `Project::transition_lifecycle(target, reason, actor)` via `UpdateProjectLifecycleFlow` | target = `ReadOnly`;reason / actor 存在 | save Project;trace;outbox;projection stale | 同上 |
| `Active` | `Closed` | `Project::transition_lifecycle(...)` or `Project::close(actor, reason)` via `UpdateProjectLifecycleFlow` | no open write gate violation;reason / actor 存在 | save Project;trace;outbox;projection stale | 同上 |
| `ReadOnly` | `Closed` | `Project::transition_lifecycle(...)` or `Project::close(...)` via `UpdateProjectLifecycleFlow` | reason / actor 存在 | save Project;trace;outbox;projection stale | 同上 |
| `Closed` | `Archived` | `Project::transition_lifecycle(...)` via `UpdateProjectLifecycleFlow` | archive target;archive policy 允许 | save Project;call `Backlog::archive_with_project(...)`;trace;outbox;projection stale | 同上 |

##### `ProjectMemberResponsibilityState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| assign | `Proposed` | `ProjectMember::assign(project_member_id, project_id, member_ref, spec)` via `AssignProjectMemberFlow` | member ref 可解析;responsibility spec 合法 | save ProjectMember;trace;enqueue `ProjectMemberChanged`;mark member / project views stale | `DomainError::InvalidStateTransition` / `ApplicationError::DomainRejected` |
| `Proposed` | `Active` | `ProjectMember::activate(snapshot, actor)` via `AssignProjectMemberFlow` or `UpdateProjectMemberResponsibilityFlow` | `MemberResponsibilityPolicy.assert_can_assign(...)`;snapshot 支持 spec | save member;trace;outbox;projection stale | 同上 |
| `Proposed` | `Released` | `ProjectMember::release(reason, actor)` via `UpdateProjectMemberResponsibilityFlow` | reason / actor 存在 | save member;trace;outbox;projection stale | 同上 |
| `Active` | `Paused` | `ProjectMember::pause(reason, actor)` via `UpdateProjectMemberResponsibilityFlow` | reason / actor 存在 | save member;trace;outbox;projection stale | 同上 |
| `Active` | `Released` | `ProjectMember::release(reason, actor)` via `UpdateProjectMemberResponsibilityFlow` | reason / actor 存在 | save member;trace;outbox;projection stale | 同上 |
| `Paused` | `Active` | `ProjectMember::resume(snapshot, actor)` via `UpdateProjectMemberResponsibilityFlow` | snapshot 重新满足 spec | save member;trace;outbox;projection stale | 同上 |
| `Paused` | `Released` | `ProjectMember::release(reason, actor)` via `UpdateProjectMemberResponsibilityFlow` | reason / actor 存在 | save member;trace;outbox;projection stale | 同上 |

##### `BacklogState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| create | `Open` | `Backlog::open_for_project(backlog_id, project_id, actor)` via `CreateProjectFlow` | project create 同 UoW;backlog id 未复用 | save Backlog;enqueue project / backlog visible change;projection stale | `DomainError::InvalidStateTransition` / `ApplicationError::DomainRejected` |
| `Open` | `LockedForMaintenance` | `Backlog::lock_for_maintenance(reason, actor)` via `UpdateBacklogAvailabilityFlow` | reason / actor 存在 | save Backlog;trace;outbox;projection stale | 同上 |
| `LockedForMaintenance` | `Open` | `Backlog::reopen_after_maintenance(reason, actor)` via `UpdateBacklogAvailabilityFlow` | maintenance unlock reason 存在 | save Backlog;trace;outbox;projection stale | 同上 |
| `Open` | `Archived` | `Backlog::archive_with_project(project_ref, actor)` via `UpdateProjectLifecycleFlow` archive path | owning Project 已从 `Closed` 到 `Archived` | save Backlog;trace;outbox;projection stale | 同上 |

##### `WorkItemState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| create | `Formalized` | `WorkItem::formalize(...)` via `CreateWorkItemFlow`;`ChildWorkItem::create_child(...)` via `CreateChildWorkItemFlow`;promote accept path | backlog 可接收;source ref / intent 合法;assignee policy 通过 | save work;trace;enqueue `WorkItemChanged`;mark board/search/member views stale | `DomainError::InvalidStateTransition` / `ApplicationError::DomainRejected` |
| `Formalized` | `Committed` | `WorkItem::mark_committed(iteration_ref, actor)` or `ChildWorkItem::mark_committed(iteration_ref, actor)` via `CommitIterationScopeFlow` | iteration `Planning`;work 在 candidate set;未终止 | save work;save commitment;enqueue `IterationChanged` / `WorkItemChanged`;projection stale | 同上 |
| `Formalized` | `InProgress` | `WorkItem::transition_lifecycle(target, reason, evidence_ref, actor)` via `UpdateWorkItemLifecycleFlow` | target = `InProgress`;project / backlog gate 允许 | save work;trace;outbox;projection stale | 同上 |
| `Formalized` | `Cancelled` | `WorkItem::transition_lifecycle(...)` via `UpdateWorkItemLifecycleFlow` | cancellation reason 存在 | save work;trace;outbox;projection stale | 同上 |
| `Formalized` | `Superseded` | `WorkItem::transition_lifecycle(...)` via `UpdateWorkItemLifecycleFlow` | superseding ref / reason 由 request / policy 提供 | save work;trace;outbox;projection stale | 同上 |
| `Committed` | `InProgress` | `WorkItem::transition_lifecycle(...)` via `UpdateWorkItemLifecycleFlow` | target = `InProgress`;iteration gate 允许 | save work;trace;outbox;projection stale | 同上 |
| `Committed` | `Cancelled` | `WorkItem::transition_lifecycle(...)` via `UpdateWorkItemLifecycleFlow` | cancellation reason 存在 | save work;trace;outbox;projection stale | 同上 |
| `Committed` | `Superseded` | `WorkItem::transition_lifecycle(...)` via `UpdateWorkItemLifecycleFlow` | superseding reason 存在 | save work;trace;outbox;projection stale | 同上 |
| `InProgress` | `Completed` | `WorkItem::mark_completed(evidence_ref, actor)` or `WorkItem::transition_lifecycle(Completed, ..., Some(evidence_ref), actor)` or `ChildWorkItem::transition_lifecycle(Completed, ..., Some(evidence_ref), actor)` via `UpdateWorkItemLifecycleFlow` | `evidence_ref.verified_state = Verified`;completion evidence 存在 | save root / child work with `completion_ref`;trace;outbox;projection stale | 同上 |
| `InProgress` | `Superseded` | `WorkItem::transition_lifecycle(...)` via `UpdateWorkItemLifecycleFlow` | superseding reason 存在 | save work;trace;outbox;projection stale | 同上 |

##### `PromoteResultState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| create | `PendingReview` | `PromoteResult::evaluate(promote_result_id, source_ref, reason, actor)` via `RequestWorkPromotionFlow` | source ref 可追溯;reason / actor 存在 | save PromoteResult;trace;enqueue `PromoteResultRecorded`;no projection stale because no P0 promote/intake public view identity | `DomainError::InvalidStateTransition` / `ApplicationError::DomainRejected` |
| `PendingReview` | `Accepted` | `PromoteResult::accept(work_ref, actor)` via `ReviewWorkPromotionFlow` | accept path 同时创建 / 绑定 formal work;work ref 存在 | save PromoteResult;save work if created;trace;outbox;mark existing work views stale when formal work is created / bound | 同上 |
| `PendingReview` | `Rejected` | `PromoteResult::reject(reason, actor)` via `ReviewWorkPromotionFlow` | reject reason 存在 | save PromoteResult;decision record;outbox;no projection stale because no P0 promote/intake public view identity | 同上 |
| `PendingReview` | `Superseded` | supersede path via future review / cleanup flow | later decision ref 存在 | future flow must define affected public views before marking stale;current P0 no projection stale | 同上 |
| `Accepted` | `Superseded` | supersede path via future review / cleanup flow | later accepted / rejected decision 存在 | future flow must define affected public views before marking stale;current P0 no projection stale | 同上 |
| `Rejected` | `Superseded` | supersede path via future review / cleanup flow | later decision ref 存在 | future flow must define affected public views before marking stale;current P0 no projection stale | 同上 |

##### `DependencyState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| create | `Proposed` | `WorkDependency::link(dependency_id, upstream, downstream, reason)` via `LinkWorkDependencyFlow` | upstream / downstream 都是 formal work;不同 work;downstream `FormalWorkScope` 解析成功;dependency graph policy 通过 | save dependency;history;trace;enqueue `WorkDependencyChanged`;mark downstream project-board and resolvable member-work stale | `DomainError::InvalidStateTransition` / `ApplicationError::DomainRejected` |
| `Proposed` | `Active` | `WorkDependency::activate(actor, reason)` via `LinkWorkDependencyFlow` or `UpdateWorkDependencyStateFlow` | state-change reason.kind = `Activated`;actor 存在;Update flow 重新确认 upstream / downstream formal work 仍存在;downstream `FormalWorkScope` 解析成功 | save dependency;history;outbox;mark downstream project-board and resolvable member-work stale | 同上 |
| `Proposed` | `Cancelled` | `WorkDependency::cancel(reason, actor)` via `UpdateWorkDependencyStateFlow` | reason / actor 存在 | save dependency;history;outbox;projection stale | 同上 |
| `Active` | `Satisfied` | `WorkDependency::mark_satisfied(evidence_ref, actor)` via `UpdateWorkDependencyStateFlow` | evidence verified;upstream completion / policy 通过 | save dependency;history;outbox;projection stale | 同上 |
| `Active` | `Waived` | `WorkDependency::waive(reason, actor)` via `UpdateWorkDependencyStateFlow` | waiver reason / actor 存在 | save dependency;history;outbox;projection stale | 同上 |
| `Active` | `Cancelled` | `WorkDependency::cancel(reason, actor)` via `UpdateWorkDependencyStateFlow` | cancellation reason / actor 存在 | save dependency;history;outbox;projection stale | 同上 |

##### `BlockerState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| create | `Open` | `WorkBlocker::open(blocker_id, work_ref, cause_ref, actor)` via `OpenWorkBlockerFlow` | formal work 存在;`FormalWorkScope` 解析成功;cause ref 可追溯;actor 存在 | save blocker with `resolved_evidence_ref = None`;history;trace;enqueue `WorkBlockerChanged`;mark blocked project-board and resolvable member-work stale | `DomainError::InvalidStateTransition` / `ApplicationError::DomainRejected` |
| `Open` | `Mitigating` | `WorkBlocker::start_mitigation(reason, actor)` via future command / internal service | mitigation reason / actor 存在 | save blocker;history;outbox;projection stale | 同上 |
| `Open` | `Resolved` | `WorkBlocker::resolve(evidence_ref, actor)` via `ResolveWorkBlockerFlow` | evidence verified;actor 存在;blocked work `FormalWorkScope` 解析成功 | save blocker with `resolved_evidence_ref = Some(evidence_ref)`;history;enqueue `WorkBlockerChanged`;mark blocked project-board and resolvable member-work stale | 同上 |
| `Mitigating` | `Resolved` | `WorkBlocker::resolve(evidence_ref, actor)` via `ResolveWorkBlockerFlow` | evidence verified;actor 存在 | save blocker with `resolved_evidence_ref = Some(evidence_ref)`;history;outbox;projection stale | 同上 |
| `Resolved` | `Closed` | `WorkBlocker::close(reason, actor)` via future command / cleanup flow | close reason / actor 存在 | save blocker;history;outbox;projection stale | 同上 |

说明:`start_mitigation` 和 `close` 已在 Step 6 object contract 中定义,但 Step 8 / Step 9 当前 P0 协议只显式覆盖 `OpenWorkBlockerFlow` 和 `ResolveWorkBlockerFlow`。若实施边界需要开放 mitigation / close,必须在 Step 8 / Step 9 补对应协议和处理流后才能落码。

Dependency / blocker 的 projection stale scope 不得从 `FormalWorkRef` 字符串或 id 形态推断。所有 accepted path 必须通过 `WorkItemRepository.get_formal_work_scope(...)` 得到 project / backlog / optional assignee。当前 P0 relation 变化只标记 project-board 与可解析的 member-work;`WorkSearchProjection` 不含 relation 字段,不因 dependency / blocker 变化标脏。

##### `IterationState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| create | `Planning` | `Iteration::open(iteration_id, project_id, timebox_ref, actor)` via `OpenIterationFlow` | project 可接受 iteration;timebox ref 可追溯 | save iteration;trace;enqueue `IterationChanged`;projection stale | `DomainError::InvalidStateTransition` / `ApplicationError::DomainRejected` |
| `Planning` | `Committed` | `Iteration::commit(commitment, actor)` via `CommitIterationScopeFlow` | candidates 全部 formalized;backlog / dependency gate 通过 | save iteration;save commitment;mark work `Committed`;outbox;projection stale | 同上 |
| `Planning` | `Cancelled` | `Iteration::cancel(reason, actor)` via `UpdateIterationLifecycleFlow` | cancel reason / actor 存在 | save iteration;trace;outbox;projection stale | 同上 |
| `Committed` | `InProgress` | `Iteration::start(reason, actor)` via `UpdateIterationLifecycleFlow` | commitment exists;reason / actor 存在 | save iteration;trace;outbox;projection stale | 同上 |
| `Committed` | `Cancelled` | `Iteration::cancel(reason, actor)` via `UpdateIterationLifecycleFlow` | cancel reason / actor 存在 | save iteration;optional commitment close;trace;outbox;projection stale | 同上 |
| `InProgress` | `Closed` | `Iteration::close(reason, actor)` via `UpdateIterationLifecycleFlow` | close reason / actor 存在;completion policy 通过 | save iteration;call `IterationCommitment::close(...)`;trace;outbox;projection stale | 同上 |

##### `CommitmentState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| create | `Candidate` | `IterationCommitment::from_candidates(commitment_id, iteration_id, candidates, actor)` within `CommitIterationScopeFlow` | candidates 非空且均为 formal work | build commitment candidate before iteration commit | `DomainError::InvalidStateTransition` / `ApplicationError::DomainRejected` |
| `Candidate` | `Committed` | `Iteration::commit(commitment, actor)` via `CommitIterationScopeFlow` | owning iteration = `Planning`;candidate set policy 通过 | save commitment;iteration `Committed`;work `Committed`;outbox;projection stale | 同上 |
| `Committed` | `Changed` | `IterationCommitment::apply_change(change_set, reason, actor)` via `UpdateIterationCommitmentFlow` | owning iteration 未 closed / cancelled;change set 合法 | save commitment;iteration change record;outbox;projection stale | 同上 |
| `Committed` | `Closed` | `IterationCommitment::close(close_reason, actor)` via `UpdateIterationLifecycleFlow` close path | owning iteration closing;close reason 与 `Iteration::close(...)` 同源 | save commitment;outbox;projection stale | 同上 |
| `Changed` | `Closed` | `IterationCommitment::close(close_reason, actor)` via `UpdateIterationLifecycleFlow` close path | owning iteration closing;close reason 与 `Iteration::close(...)` 同源 | save commitment;outbox;projection stale | 同上 |

#### 8.5 辅助状态转换矩阵

##### `DerivedFreshnessState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| init | `Fresh` | `DerivedWorkViewState::for_view(view_ref)` then `mark_fresh(cursor)` in projection init / rebuild success | view_ref 稳定;source cursor 已知 | save freshness state | `DomainError::InvalidStateTransition` / `ApplicationError::DomainRejected` |
| `Fresh` | `Stale` | `DerivedWorkViewState::mark_stale(cursor)` via `ProjectionRepository.mark_stale(...)` | committed truth / reference snapshot cursor 大于 view cursor | save stale marker only;不改业务 truth | 同上 |
| `Stale` | `Rebuilding` | rebuild start marker via `RebuildWorkProjectionsFlow` | job idempotency reserved;projection_set 合法 | mark view rebuilding;不替换 truth | 同上 |
| `Rebuilding` | `Fresh` | `DerivedWorkViewState::mark_fresh(cursor)` via `RebuildWorkProjectionsFlow` after `replace_project_views(...)` | rebuild from committed truth 成功 | replace views;save fresh marker;optional `DerivedWorkViewChanged` outbox | 同上 |
| `Rebuilding` | `Failed` | rebuild failed marker via `RebuildWorkProjectionsFlow` | projection build / repository failure 可定位到 view | save failed marker;job report failed | 同上 |
| `Failed` | `Rebuilding` | rebuild retry marker via `RebuildWorkProjectionsFlow` | retry job accepted | mark rebuilding;不改 truth | 同上 |

闭环状态:已在 Step 11 前序回填中补齐 `DerivedWorkViewState::mark_rebuilding(...)`、`mark_failed(...)` 和 `ProjectionRepository.mark_rebuilding(...)`、`mark_failed(...)`。

##### `ReferenceResolutionStatus`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| create | `Unresolved` | `ReferenceResolutionState::unresolved(reference_ref)` via inbound consumer / refresh job | external ref typed conversion 合法 | save reference state;不创建 Work truth | `DomainError::InvalidStateTransition` / `ApplicationError::DomainRejected` |
| `Unresolved` | `Resolved` | `ReferenceResolutionState::mark_resolved(resolved_at)` via consumer / refresh resolver success | resolver 返回可接受 snapshot;timestamp 来自 clock / event | save snapshot + resolved state;mark affected views stale | 同上 |
| `Unresolved` | `Failed` | failed marker via resolver failure path | resolver failure 可归因 | save failed state;job failed_refs / retry policy | 同上 |
| `Resolved` | `Stale` | `ReferenceResolutionState::mark_stale(reason)` via upstream change / retention / evidence rejected | stale reason 存在 | save stale state;mark affected views stale | 同上 |
| `Resolved` | `Failed` | failed marker via refresh failure | resolver failure 可归因 | save failed state;job report failed | 同上 |
| `Stale` | `Resolved` | `mark_resolved(resolved_at)` via refresh success | resolver success | save snapshot + state;mark affected views stale | 同上 |
| `Stale` | `Failed` | failed marker via refresh failure | resolver failure 可归因 | save failed state;job report failed | 同上 |
| `Failed` | `Resolved` | `mark_resolved(resolved_at)` via refresh success | resolver success | save snapshot + state;mark affected views stale | 同上 |

闭环状态:已在 Step 11 前序回填中补齐 `ReferenceResolutionState::mark_failed(...)` 和 `ReferenceSnapshotRepository.mark_reference_failed(...)`。

##### `OutboxPublicationState`

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| create | `Pending` | `WorkOutboxRecord::from_truth_change(outbox_id, change, trace_context_ref, occurred_at)` or `from_event_source(outbox_id, source_ref, trace_context_ref, occurred_at)` inside command / consumer / job UoW | `change` 或 explicit `source_ref` 已由正式 source 成立;outbox id 未复用;`event_kind` 与 `source_ref` 匹配 | enqueue outbox in same UoW as source write or marker write | `DomainError::InvalidStateTransition` / `ApplicationError::DomainRejected` |
| `Pending` | `Published` | `WorkOutboxRecord::mark_published(publication_ref)` and `WorkOutboxRepository.mark_published(...)` via `PublishWorkOutboxFlow` | publisher 返回 publication ref;expected version 匹配 | save publication state;do not modify truth | 同上 |
| `Pending` | `Failed` | `WorkOutboxRecord::mark_failed(reason)` and `WorkOutboxRepository.mark_failed(...)` via `PublishWorkOutboxFlow` | publisher failure reason 可记录 | save failed marker;job report failed | 同上 |
| `Failed` | `Pending` | retry selection in `WorkOutboxRepository.list_pending(...)` / retry policy | retry delay / max attempts policy 允许 | record becomes eligible for publish retry | 同上 |

闭环状态:已在 Step 11 前序回填中补齐 `WorkOutboxRecord.mark_pending_for_retry(...)` 和 `WorkOutboxRepository.mark_pending_for_retry(...)`;`list_pending` 不得静默改状态。

#### 8.6 跨状态副作用矩阵

| 触发 flow | 主状态变化 | 联动状态变化 | 必须同 UoW | 不得发生 |
|---|---|---|---|---|
| `CreateProjectFlow` | Project create -> `Active`;Backlog create -> `Open` | derived views -> `Stale` | Project、Backlog、trace、outbox、projection stale、idempotency complete | 不创建 external owner truth |
| `UpdateProjectLifecycleFlow` | Project lifecycle transition | archive path 联动 Backlog `Archived`;derived views -> `Stale` | Project、Backlog archive when applicable、trace、outbox、projection stale | Project 非 archive path 不得隐式关闭 iteration / work |
| `UpdateBacklogAvailabilityFlow` | Backlog `Open` <-> `LockedForMaintenance` | derived views -> `Stale` | Backlog、trace、outbox、projection stale | 不修改 Project lifecycle |
| `AssignProjectMemberFlow` | ProjectMember `Proposed` / `Active` | reference snapshot read only;derived views -> `Stale` | ProjectMember、trace、outbox、projection stale | 不写 GlobalMember truth |
| `UpdateProjectMemberResponsibilityFlow` | ProjectMember state transition | derived views -> `Stale` | ProjectMember、trace、outbox、projection stale | 不删除 member history |
| `CreateWorkItemFlow` / `CreateChildWorkItemFlow` | WorkItem / ChildWorkItem -> `Formalized` | derived views -> `Stale` | Work truth、trace、outbox、projection stale | 不复制 source body |
| `UpdateWorkItemLifecycleFlow` | WorkItemState transition | completion path writes `completion_ref`;derived views -> `Stale` | Work truth、trace、outbox、projection stale | `Completed` 不得无 verified evidence |
| `ReviewWorkPromotionFlow` | PromoteResult -> `Accepted` / `Rejected` | accept path may create WorkItem `Formalized`;accept path affected existing work views -> `Stale`;reject path no projection stale | PromoteResult、optional WorkItem、decision record、trace、outbox、projection stale only for accept-created / bound WorkItem views | inbound runtime event 不得直接创建 PromoteResult |
| `LinkWorkDependencyFlow` / `UpdateWorkDependencyStateFlow` | DependencyState transition | dependency history;derived views -> `Stale` | Dependency、history、trace、outbox、projection stale | 不允许 orphan / self dependency |
| `OpenWorkBlockerFlow` / `ResolveWorkBlockerFlow` | BlockerState transition | dependency / blocker history;derived views -> `Stale`;resolve path writes `resolved_evidence_ref` | Blocker、history、trace、outbox、projection stale | 不把 blocker cause body 或 evidence body 写入 Work |
| `CommitIterationScopeFlow` | Iteration -> `Committed`;Commitment -> `Committed`;Work -> `Committed` | derived views -> `Stale` | Iteration、Commitment、Work marks、history、trace、outbox、projection stale | 不允许 non-formal work 入 commitment |
| `UpdateIterationCommitmentFlow` | Commitment -> `Changed` | iteration/member views -> `Stale` | Commitment、change record、trace、outbox、projection stale | 不修改 closed commitment |
| `UpdateIterationLifecycleFlow` | Iteration -> `InProgress` / `Closed` / `Cancelled` | close path Commitment -> `Closed`;derived views -> `Stale` | Iteration、Commitment when applicable、trace、outbox、projection stale | 不改 process timebox truth |
| Inbound consumer flows | ReferenceResolutionStatus -> `Resolved` / `Stale` / `Unresolved` | affected public derived views -> `Stale` only when a formal view identity exists;runtime pending promote intake has no projection stale | reference state / snapshot、projection stale when applicable、idempotency complete | 不创建 Work business truth |
| `PublishWorkOutboxFlow` | OutboxPublicationState -> `Published` / `Failed` | 无业务 truth 联动 | outbox publication marker only | 不回滚或改写 source truth |
| `RebuildWorkProjectionsFlow` | DerivedFreshnessState -> `Rebuilding` / `Fresh` / `Failed` | optional `DerivedWorkViewChanged` outbox | projection replace、freshness marker、idempotency complete | 不从旧 projection 反推 truth |
| `RefreshExternalReferenceSnapshotsFlow` | ReferenceResolutionStatus -> `Resolved` / `Failed` | affected derived views -> `Stale` | reference state / snapshot、projection stale、idempotency complete | 不修复业务 truth |

#### 8.7 非法转换处理表

| 场景 | 判定位置 | 返回错误 | 是否写 truth | 是否写 outbox | 是否 mark projection stale | 幂等处理 |
|---|---|---|---|---|---|---|
| From/To 不在矩阵 | Step 6 domain method | `DomainError::InvalidStateTransition` -> `ApplicationError::DomainRejected` -> `WorkProtocolError::DomainRejected` | 否 | 否 | 否 | 当前 UoW rollback;不得 complete 成功 result |
| 终态再次迁移 | Step 6 domain method | 同上 | 否 | 否 | 否 | rollback |
| 缺少 required reason / actor | handler / application service / domain method | `ApplicationError::InvalidRequest` 或 `DomainError::InvalidStateTransition` | 否 | 否 | 否 | reserve 前发现则不写幂等;reserve 后 rollback |
| `Completed` 缺 verified evidence | domain method / evidence policy | `DomainError::InvalidStateTransition` / `DomainError::PolicyRejected` -> `ApplicationError::DomainRejected` | 否 | 否 | 否 | rollback |
| dependency orphan / self-loop / forbidden cycle | `DependencyGraphPolicy.assert_can_link(graph, upstream, downstream)` | `DomainError::PolicyRejected` -> `ApplicationError::DomainRejected` | 否 | 否 | 否 | rollback |
| commitment 含 non-formal work | `IterationCommitment::from_candidates(...)` / service lookup | `ApplicationError::InvalidRequest` or `DomainError::PolicyRejected` | 否 | 否 | 否 | rollback |
| stale / failed projection 被 query 读取 | query service | no error;surface = `Stale` / `Failed` / `Rebuilding` | 否 | 否 | 否 | query no idempotency |
| reference resolver temporary failure | consumer / refresh job | retry / job report failed;state may become `Failed` if marker contract closed | 不写业务 truth | 否 | 可 mark stale | consumer / job dedup complete only if failure policy accepts marker |
| publisher failure | `PublishWorkOutboxFlow` | job item failed;outbox `Failed` | 不改业务 truth | 不新增业务 outbox | 否 | job report failed;record retryable |
| duplicate command with same digest | idempotency service | stored result | 不重放 | 不重放 | 不重放 | return original `ApplicationResultRef` |
| duplicate command with different digest | idempotency service | `ApplicationError::IdempotencyConflict` | 否 | 否 | 否 | mark conflict / rollback by Step 13 |

#### 8.8 状态矩阵到测试切口映射

| 状态机 | 最小测试切口 | 必测断言 |
|---|---|---|
| `ProjectLifecycleState` | `TC-WORK-PROJECT-001/002` | create -> `Active`;archive path only from `Closed`;archived rejects normal writes |
| `ProjectMemberResponsibilityState` | `TC-WORK-MEMBER-001/002` | Proposed/Active/Paused/Released 合法转换;Released terminal |
| `BacklogState` | `TC-WORK-BACKLOG-001` | Open <-> LockedForMaintenance;Archived only via project archive |
| `WorkItemState` | `TC-WORK-ITEM-001/002/003` | Formalized -> Committed/InProgress;Completed requires verified evidence;terminal rejects |
| `PromoteResultState` | `TC-WORK-PROMOTE-001/002` | PendingReview accept/reject;accept path binds formal work;rejected has reason |
| `DependencyState` | `TC-WORK-DEP-001/003` | Proposed -> Active via Link or Update;Active -> Satisfied/Waived/Cancelled;terminal rejects |
| `BlockerState` | `TC-WORK-BLOCKER-001/002` | Open -> Resolved;future mitigation / close boundary explicit |
| `IterationState` / `CommitmentState` | `TC-WORK-ITER-001..004` | commit links iteration + commitment + work marks;close closes commitment |
| `DerivedFreshnessState` | `TC-WORK-PROJECTION-*` | truth change marks stale;rebuild success marks fresh;failed marker visible |
| `ReferenceResolutionStatus` | `TC-WORK-REFRESH-*` | unresolved/resolved/stale/failed marker;external truth not copied |
| `OutboxPublicationState` | `TC-WORK-OUTBOX-*` | pending publish success -> Published;failure -> Failed;business truth unchanged |

### 9. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_10_state_matrix.md`
>
> 延伸阅读:
> - 建议继续阅读本中间产物的“结构化中间产物”“非法转换处理表”和“待确认事项”小节。

#### 5.9 状态机与转换矩阵

L1-work 详细设计将状态机分为业务 truth 状态和辅助状态。业务 truth 状态由 domain object method 修改,并经 application command flow 在同一 UnitOfWork 内保存 truth、正式定义的 history 或 audit、outbox、idempotency result,以及有正式 public view identity 时的 projection stale marker。没有 query / projection identity 的 truth 或 marker 不得临时派生 `DerivedWorkViewRef`。辅助状态包括 derived projection freshness、external reference resolution 和 outbox publication,它们不得反向修改业务 truth。

正式状态机如下:

| 状态机 | 对象 | 状态字段 | 主要触发 |
|---|---|---|---|
| `ProjectLifecycleState` | `Project` | `lifecycle_state` | `CreateProjectFlow`、`UpdateProjectLifecycleFlow` |
| `ProjectMemberResponsibilityState` | `ProjectMember` | `responsibility_state` | `AssignProjectMemberFlow`、`UpdateProjectMemberResponsibilityFlow` |
| `BacklogState` | `Backlog` | `backlog_state` | `CreateProjectFlow`、`UpdateBacklogAvailabilityFlow`、project archive path |
| `WorkItemState` | `WorkItem` / `ChildWorkItem` | `work_state` | work create / lifecycle / iteration / promote flows |
| `PromoteResultState` | `PromoteResult` | `result_state` | `RequestWorkPromotionFlow`、`ReviewWorkPromotionFlow` |
| `DependencyState` | `WorkDependency` | `dependency_state` | `LinkWorkDependencyFlow`、`UpdateWorkDependencyStateFlow` |
| `BlockerState` | `WorkBlocker` | `blocker_state`;`resolved_evidence_ref` | `OpenWorkBlockerFlow`、`ResolveWorkBlockerFlow` |
| `IterationState` | `Iteration` | `iteration_state` | `OpenIterationFlow`、`CommitIterationScopeFlow`、`UpdateIterationLifecycleFlow` |
| `CommitmentState` | `IterationCommitment` | `commitment_state` | `CommitIterationScopeFlow`、`UpdateIterationCommitmentFlow`、iteration close path |
| `DerivedFreshnessState` | `DerivedWorkViewState` | `freshness_state` | truth change / consumer stale mark / rebuild job |
| `ReferenceResolutionStatus` | `ReferenceResolutionState` | `resolution_state` | inbound consumer / reference refresh job |
| `OutboxPublicationState` | `WorkOutboxRecord` | `publication_state` | `PublishWorkOutboxFlow` |

实现必须使用本章矩阵中的 enum 变体名。任何旧状态名不得出现在 contracts、domain、tests 或 implementation commit 说明中。非法转换统一由 domain method 返回 `DomainError::InvalidStateTransition`,application 映射为 `ApplicationError::DomainRejected`,handler 映射为 `WorkProtocolError::DomainRejected`。非法转换不得写 truth、outbox 或 projection stale marker。

核心业务状态转换以本中间产物 §8.4 为准;辅助状态转换以 §8.5 为准;跨对象联动和 UoW 副作用以 §8.6 为准;非法转换和测试切口分别以 §8.7、§8.8 为准。

### 10. 待确认事项

| 编号 | 待确认项 | 影响 | 建议处理 Step |
|---|---|---|---|
| DDD10-CLOSED-001 | `DerivedFreshnessState` 的 `Rebuilding` / `Failed` 持久化入口 | 已在 Step 11 回填 domain method 与 projection repository method | 已关闭 |
| DDD10-CLOSED-002 | `ReferenceResolutionStatus::Failed` 的构造和持久化入口 | 已在 Step 11 回填 domain method 与 reference repository method | 已关闭 |
| DDD10-CLOSED-003 | `OutboxPublicationState::Failed -> Pending` retry 入口 | 已在 Step 11 回填 domain method 与 outbox repository method | 已关闭 |
| DDD10-OPEN-004 | `BlockerState::Mitigating`、`BlockerState::Closed` 是否进入 P0 协议面 | 当前 Step 6 有 domain method,Step 8 / Step 9 只有 open / resolve flow | Step 17 implementation handoff |
| DDD10-OPEN-005 | `PromoteResultState::Superseded` 的触发入口是否本轮实现 | Step 6 enum 允许,但 Step 8 / Step 9 未给 explicit command | Step 17 implementation handoff |

### 11. 进入下一步条件

- [x] 所有 Step 6 正式 state enum 均进入状态集合表。
- [x] 每个状态机都有 ASCII 图。
- [x] 每个核心业务 truth 状态机都有 From / To / 触发函数 / 前置条件 / 副作用 / 非法错误。
- [x] auxiliary state 与 business truth state 分离。
- [x] 非法转换处理表明确错误类型和副作用禁止项。
- [x] 待闭环项已记录,不会让实现侧自行补设计。
