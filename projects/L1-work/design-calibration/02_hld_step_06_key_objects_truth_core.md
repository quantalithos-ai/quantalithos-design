# Step 6 附录 A1. Truth Core 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 本文件只给概要骨架,不定义完整对象契约。

---

## A1. `Project`

| 项 | 内容 |
|---|---|
| 所属部分 | `Project subject management` |
| 对象类型 | 聚合 / truth root |
| 结构责任 | 表达软件项目作为正式工作对象的项目锚点、生命周期和归属边界 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `project_id` | `ProjectId` | 稳定项目身份 |
| `owner_ref` | `ProjectOwnerRef` | 指向 workspace / org / external owner 的引用 |
| `lifecycle_state` | `ProjectLifecycleState` | 控制是否可维护、可承诺、可归档 |

| 状态 | 作用 |
|---|---|
| `Active` / `ReadOnly` / `Closed` / `Archived` | 可维护、只读、关闭和归档后状态 |

| 成员函数 | 作用 |
|---|---|
| `transition_lifecycle(ProjectLifecycleTarget target, ProjectLifecycleReason reason, ActorRef actor)` | 改变项目生命周期 |
| `close(ActorRef actor, ProjectLifecycleReason reason)` | 关闭项目并阻止新工作进入 |

| 工厂函数 | 作用 |
|---|---|
| `create(ProjectSpec spec, ActorRef actor)` | 从显式项目创建意图形成 Active 项目对象 |

禁止事项:不得把 Project 当成 conversation topic、ProcessInstance、workspace project view 或 runtime context。

---

## A2. `ProjectMember`

| 项 | 内容 |
|---|---|
| 所属部分 | `Project member responsibility` |
| 对象类型 | 实体 / truth object |
| 结构责任 | 表达 GlobalMember 在具体项目内的承担事实 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `project_member_id` | `ProjectMemberId` | 项目内承担关系身份 |
| `project_id` | `ProjectId` | 所属项目 |
| `member_ref` | `GlobalMemberRef` | 指向 identity 成员 truth |
| `responsibility_state` | `ProjectMemberResponsibilityState` | 表达可承担、暂停或释放 |

| 状态 | 作用 |
|---|---|
| `Proposed` / `Active` / `Paused` / `Released` | 待确认、可承担、暂停承担和已释放 |

| 成员函数 | 作用 |
|---|---|
| `activate(MemberCapabilitySnapshot snapshot, ActorRef actor)` | 在成员可承担时激活项目承担 |
| `pause(ProjectMemberReason reason, ActorRef actor)` | 暂停项目内承担 |
| `resume(MemberCapabilitySnapshot snapshot, ActorRef actor)` | 在成员重新可承担时恢复项目内承担 |
| `release(ProjectMemberReason reason, ActorRef actor)` | 释放项目内承担并保留追溯原因 |

| 工厂函数 | 作用 |
|---|---|
| `assign(ProjectId project_id, GlobalMemberRef member_ref, ProjectResponsibilitySpec spec)` | 从显式分配意图形成 ProjectMember |

禁止事项:不得改变 GlobalMember 生命周期、role definition 或平台身份状态。

---

## A3. `Backlog`

| 项 | 内容 |
|---|---|
| 所属部分 | `Formal work universe` |
| 对象类型 | 聚合 / collection root |
| 结构责任 | 表达项目正式工作全集的容器边界 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `backlog_id` | `BacklogId` | 稳定全集身份 |
| `project_id` | `ProjectId` | 所属项目 |
| `backlog_state` | `BacklogState` | 表达是否可接收正式工作 |

| 状态 | 作用 |
|---|---|
| `Open` / `LockedForMaintenance` / `Archived` | 可维护、维护锁定和归档只读 |

| 成员函数 | 作用 |
|---|---|
| `accept_work_item(WorkItem work_item, ActorRef actor)` | 接收正式 WorkItem 进入全集 |
| `assert_can_accept(FormalWorkIntent intent)` | 判断候选是否允许进入全集 |
| `lock_for_maintenance(BacklogMaintenanceReason reason, ActorRef actor)` | 显式进入维护锁定状态 |
| `reopen_after_maintenance(BacklogMaintenanceReason reason, ActorRef actor)` | 显式从维护锁定恢复为可维护 |
| `archive_with_project(ProjectRef project_ref, ActorRef actor)` | 随 Project archive 进入归档只读状态 |

| 工厂函数 | 作用 |
|---|---|
| `open_for_project(ProjectId project_id, ActorRef actor)` | 为项目建立正式工作全集 |

禁止事项:不得接收 personal checklist、chat suggestion、runtime step 或 tool step。

---

## A4. `WorkItem`

| 项 | 内容 |
|---|---|
| 所属部分 | `Formal work universe` |
| 对象类型 | 实体 / formal work truth |
| 结构责任 | 表达协作级正式工作项 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `work_item_id` | `WorkItemId` | 正式工作身份 |
| `backlog_id` | `BacklogId` | 所属正式全集 |
| `assignee_ref` | `ProjectMemberRef` | 当前承担者引用 |
| `work_state` | `WorkItemState` | 当前工作生命周期 |
| `completion_ref` | `Option<ExternalEvidenceRef>` | 完成依据引用 |

| 状态 | 作用 |
|---|---|
| `Formalized` / `Committed` / `InProgress` / `Completed` / `Cancelled` / `Superseded` | 正式存在、已承诺、执行中、完成、取消和被替代 |

| 成员函数 | 作用 |
|---|---|
| `assign(ProjectMemberRef member_ref, ActorRef actor)` | 指派项目承担者 |
| `mark_committed(IterationRef iteration_ref, ActorRef actor)` | 进入 Iteration 承诺范围后标记为已承诺 |
| `transition_lifecycle(WorkLifecycleTarget target, WorkLifecycleReason reason, Option<ExternalEvidenceRef> evidence_ref, ActorRef actor)` | 显式执行开始、完成、取消或替代等生命周期变化 |
| `mark_completed(ExternalEvidenceRef evidence_ref, ActorRef actor)` | 基于外部完成依据标记完成 |

| 工厂函数 | 作用 |
|---|---|
| `formalize(FormalWorkIntent intent, SourceWorkRef source_ref, ActorRef actor)` | 从正式化意图创建 WorkItem |

禁止事项:不得保存 ImplementationPlan 正文、artifact body 或执行步骤正文。

---

## A5. `ChildWorkItem`

| 项 | 内容 |
|---|---|
| 所属部分 | `Formal work universe` |
| 对象类型 | 实体 / formal sub-work truth |
| 结构责任 | 表达从父 WorkItem 拆出的协作级正式子任务 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `child_work_item_id` | `ChildWorkItemId` | 子工作身份 |
| `parent_work_item_id` | `WorkItemId` | 父正式工作 |
| `source_ref` | `SourceWorkRef` | 拆分或 promote 来源 |
| `work_state` | `WorkItemState` | 子任务生命周期 |

| 状态 | 作用 |
|---|---|
| 同 `WorkItemState` | 子任务仍是正式工作,不是执行步骤 |

| 成员函数 | 作用 |
|---|---|
| `attach_to_parent(WorkItemId parent_id, ActorRef actor)` | 固定父子正式工作关系 |
| `promote_from_source(SourceWorkRef source_ref, ActorRef actor)` | 标记其来源于显式 promote |
| `transition_lifecycle(WorkLifecycleTarget target, WorkLifecycleReason reason, Option<ExternalEvidenceRef> evidence_ref, ActorRef actor)` | 使用与 WorkItem 相同的生命周期变化口径 |

| 工厂函数 | 作用 |
|---|---|
| `create_child(WorkItemId parent_id, FormalWorkIntent intent, SourceWorkRef source_ref)` | 创建协作级子工作 |

禁止事项:不得把普通 plan item、tool execution step 或个人 checklist 自动升级为 child WorkItem。

---

## A6. `WorkDependency`

| 项 | 内容 |
|---|---|
| 所属部分 | `Dependency / blocker coordination` |
| 对象类型 | 关系实体 |
| 结构责任 | 表达正式工作之间的依赖关系 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `dependency_id` | `WorkDependencyId` | 依赖关系身份 |
| `upstream_work_ref` | `FormalWorkRef` | 被依赖工作 |
| `downstream_work_ref` | `FormalWorkRef` | 受影响工作 |
| `dependency_state` | `DependencyState` | 依赖是否有效或解除 |

| 状态 | 作用 |
|---|---|
| `Proposed` / `Active` / `Satisfied` / `Waived` / `Cancelled` | 待确认、生效、满足、豁免和取消 |

| 成员函数 | 作用 |
|---|---|
| `activate(ActorRef actor, DependencyReason reason)` | 让依赖关系生效 |
| `mark_satisfied(ExternalEvidenceRef evidence_ref, ActorRef actor)` | 基于依据解除依赖 |
| `waive(DependencyChangeReason reason, ActorRef actor)` | 以可追溯 reason 豁免依赖 |
| `cancel(DependencyChangeReason reason, ActorRef actor)` | 取消尚未满足或不再适用的依赖 |

| 工厂函数 | 作用 |
|---|---|
| `link(FormalWorkRef upstream, FormalWorkRef downstream, DependencyReason reason)` | 创建正式工作之间的依赖 |

禁止事项:不得指向不存在的正式工作,不得形成不可解释循环。
