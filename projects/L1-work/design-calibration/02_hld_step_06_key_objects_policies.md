# Step 6 附录 B1. Policy / Guard 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> Policy 只表达判断边界,不保存业务 truth。

---

## B1. `WorkTruthPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Work truth core` |
| 对象类型 | policy / guard |
| 结构责任 | 判断核心 Work truth 变化是否允许成立 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_scope` | `WorkPolicyScope` | 限定适用范围 |
| `truth_snapshot` | `WorkTruthSnapshot` | 提供当前 truth 摘要 |

| 成员函数 | 作用 |
|---|---|
| `assert_truth_change_allowed(WorkTruthChange change, ActorRef actor)` | 校验核心变化是否允许 |
| `assert_no_external_body(ExternalSourceSummary source)` | 校验未吸收外部正文 |

| 工厂函数 | 作用 |
|---|---|
| `from_snapshot(WorkTruthSnapshot truth_snapshot)` | 从当前 truth 摘要形成策略上下文 |

禁止事项:不得替代具体业务对象的状态迁移,不得让配置改变 truth 归属。

---

## B2. `ProjectLifecyclePolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Project subject management` |
| 对象类型 | policy / guard |
| 结构责任 | 保护 Project 生命周期变化边界 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `project_ref` | `ProjectRef` | 被判断项目 |
| `current_state` | `ProjectLifecycleState` | 当前生命周期状态 |

| 成员函数 | 作用 |
|---|---|
| `assert_lifecycle_transition_allowed(Project project, ProjectLifecycleTarget target, ProjectLifecycleReason reason, ActorRef actor)` | 判断项目生命周期迁移是否允许 |
| `can_close(Project project, ProjectLifecycleReason reason)` | 判断项目是否可关闭 |

| 工厂函数 | 作用 |
|---|---|
| `for_project(Project project)` | 从 Project 建立生命周期策略 |

禁止事项:不得由查询、投影或外部引用隐式激活 Project。

---

## B3. `MemberResponsibilityPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Project member responsibility` |
| 对象类型 | policy / guard |
| 结构责任 | 判断 GlobalMember 是否可形成项目内承担,以及项目内承担状态是否允许变化 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `project_id` | `ProjectId` | 判断所在项目 |
| `capability_snapshot` | `MemberCapabilitySnapshot` | 成员能力和可承担摘要 |

| 成员函数 | 作用 |
|---|---|
| `assert_can_assign(GlobalMemberRef member_ref, ProjectResponsibilitySpec spec)` | 校验成员可承担 |
| `assert_responsibility_transition_allowed(ProjectMember member, ResponsibilityTarget target, ProjectMemberReason reason, ActorRef actor)` | 校验暂停、恢复或释放承担是否允许 |
| `assert_can_pause(ProjectMember member, ProjectMemberReason reason)` | 校验是否可暂停 |

| 工厂函数 | 作用 |
|---|---|
| `from_snapshot(ProjectId project_id, MemberCapabilitySnapshot snapshot)` | 从成员快照形成策略 |

禁止事项:不得直接读取或改写 identity 成员生命周期。

---

## B4. `FormalWorkPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Formal work universe` |
| 对象类型 | policy / guard |
| 结构责任 | 判断候选工作是否可进入正式工作全集 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `backlog_ref` | `BacklogRef` | 被维护正式全集 |
| `candidate_summary` | `FormalWorkCandidateSummary` | 候选工作摘要 |

| 成员函数 | 作用 |
|---|---|
| `assert_formal_work(FormalWorkIntent intent, SourceWorkRef source_ref)` | 校验是否是协作级正式工作 |
| `assert_child_boundary(WorkItem parent, FormalWorkIntent child_intent)` | 校验 child WorkItem 边界 |

| 工厂函数 | 作用 |
|---|---|
| `for_backlog(Backlog backlog)` | 从 Backlog 建立正式工作策略 |

禁止事项:不得让 personal checklist、runtime step 或 conversation suggestion 自动进入 Backlog。

---

## B5. `BacklogAvailabilityPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Formal work universe` |
| 对象类型 | policy / guard |
| 结构责任 | 判断 Backlog 是否允许维护锁定、解锁或随 Project 归档 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `backlog_ref` | `BacklogRef` | 被判断的正式全集 |
| `current_state` | `BacklogState` | 当前 availability 状态 |

| 成员函数 | 作用 |
|---|---|
| `assert_availability_transition_allowed(Backlog backlog, BacklogAvailabilityTarget target, BacklogMaintenanceReason reason, ActorRef actor)` | 校验 Backlog availability 迁移是否允许 |
| `assert_archive_follows_project(Project project, Backlog backlog)` | 校验归档只能随 Project archive 联动 |

| 工厂函数 | 作用 |
|---|---|
| `for_backlog(Backlog backlog)` | 从 Backlog 建立 availability 策略 |

禁止事项:不得允许 projection / job 隐式改变 Backlog availability。

---

## B6. `PromotePolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Work decomposition / promote boundary` |
| 对象类型 | policy / guard |
| 结构责任 | 判断外部来源是否满足 formalize / promote 条件 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `source_ref` | `SourceWorkRef` | 被评估来源 |
| `promote_reason` | `PromoteReason` | 升级理由 |

| 成员函数 | 作用 |
|---|---|
| `can_promote(SourceWorkRef source_ref, PromoteReason reason)` | 判断来源是否可升级 |
| `reject_reason(SourceWorkRef source_ref)` | 给出拒绝边界 |

| 工厂函数 | 作用 |
|---|---|
| `for_source(SourceWorkRef source_ref)` | 建立来源评估策略 |

禁止事项:不得跳过 promote 直接创建 WorkItem / ChildWorkItem。

---

## B7. `DependencyGraphPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Dependency / blocker coordination` |
| 对象类型 | policy / guard |
| 结构责任 | 保护依赖图可解释、无孤儿、无不可接受循环,并约束依赖状态变化 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `graph_snapshot` | `WorkDependencyGraphSnapshot` | 当前依赖图摘要 |
| `project_id` | `ProjectId` | 图所在项目 |

| 成员函数 | 作用 |
|---|---|
| `assert_can_link(FormalWorkRef upstream, FormalWorkRef downstream)` | 校验依赖可建立 |
| `assert_dependency_state_transition_allowed(WorkDependency dependency, DependencyTarget target, DependencyChangeReason reason, Option<ExternalEvidenceRef> evidence_ref)` | 校验满足、豁免或取消依赖是否允许 |
| `assert_can_resolve(WorkDependency dependency, ExternalEvidenceRef evidence_ref)` | 校验解除依据 |

| 工厂函数 | 作用 |
|---|---|
| `from_graph(ProjectId project_id, WorkDependencyGraphSnapshot graph_snapshot)` | 从依赖图摘要形成策略 |

禁止事项:不得产生孤儿依赖或不可解释循环。

---

## B8. `IterationCommitmentPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Iteration commitment` |
| 对象类型 | policy / guard |
| 结构责任 | 判断正式工作是否可进入或调整 Iteration 承诺范围 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `iteration_ref` | `IterationRef` | 被判断 Iteration |
| `candidate_refs` | `FormalWorkRefSet` | 候选正式工作集合 |

| 成员函数 | 作用 |
|---|---|
| `assert_commitment_allowed(Iteration iteration, FormalWorkRefSet candidates)` | 校验候选集合 |
| `assert_commitment_change_allowed(IterationCommitment commitment, IterationCommitmentChangeSet change_set, IterationChangeReason reason)` | 校验承诺集合调整是否允许 |
| `assert_member_capacity(ProjectMemberRef member_ref, FormalWorkRefSet candidates)` | 校验承担容量边界 |

| 工厂函数 | 作用 |
|---|---|
| `for_iteration(Iteration iteration)` | 从 Iteration 建立承诺策略 |

禁止事项:不得把 process planning timing 或 board filter 当成 Iteration truth。

---

## B9. `CompletionEvidencePolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Dependency / blocker coordination` |
| 对象类型 | policy / guard |
| 结构责任 | 判断完成、解除或阻塞关闭所需依据是否可接受 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `work_ref` | `FormalWorkRef` | 被判断正式工作 |
| `evidence_ref` | `ExternalEvidenceRef` | 外部依据引用 |

| 成员函数 | 作用 |
|---|---|
| `assert_completion_evidence(FormalWorkRef work_ref, ExternalEvidenceRef evidence_ref)` | 校验完成依据 |
| `assert_blocker_resolution(WorkBlocker blocker, ExternalEvidenceRef evidence_ref)` | 校验阻塞解除依据 |

| 工厂函数 | 作用 |
|---|---|
| `for_work(FormalWorkRef work_ref)` | 为正式工作建立依据策略 |

禁止事项:不得保存 artifact / evidence / baseline 正文。

---

## B10. `DerivedWorkViewPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived consumption support` |
| 对象类型 | policy / guard |
| 结构责任 | 保护派生视图只读、可重建、不反写 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_ref` | `DerivedWorkViewRef` | 被维护视图 |
| `source_cursor` | `WorkTruthCursor` | 派生来源位置 |

| 成员函数 | 作用 |
|---|---|
| `assert_rebuild_source(WorkTruthCursor cursor)` | 校验重建来源 |
| `assert_read_only_projection(DerivedWorkViewRef view_ref)` | 校验派生视图不反写 |

| 工厂函数 | 作用 |
|---|---|
| `for_view(DerivedWorkViewRef view_ref)` | 建立派生视图策略 |

禁止事项:不得用 projection 生成新业务事实。
