# Step 6 附录 A2. Blocker / Iteration / Derived State 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 本文件只给概要骨架,不定义完整对象契约。

---

## A7. `WorkBlocker`

| 项 | 内容 |
|---|---|
| 所属部分 | `Dependency / blocker coordination` |
| 对象类型 | 实体 / blocker truth |
| 结构责任 | 表达阻塞、影响和解除依据 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `blocker_id` | `WorkBlockerId` | 阻塞身份 |
| `blocked_work_ref` | `FormalWorkRef` | 被阻塞正式工作 |
| `cause_ref` | `BlockerCauseRef` | 阻塞原因引用 |
| `blocker_state` | `BlockerState` | 阻塞生命周期 |
| `resolved_evidence_ref` | `Option<ExternalEvidenceRef>` | 解除阻塞依据引用,仅 resolved 后有值 |

| 状态 | 作用 |
|---|---|
| `Open` / `Mitigating` / `Resolved` / `Closed` | 打开、处理中、已解除和关闭归档 |

| 成员函数 | 作用 |
|---|---|
| `start_mitigation(BlockerMitigationReason reason, ActorRef actor)` | 记录阻塞进入处理中 |
| `resolve(ExternalEvidenceRef evidence_ref, ActorRef actor)` | 记录解除依据,并写入 `resolved_evidence_ref` |
| `close(BlockerCloseReason reason, ActorRef actor)` | 在解除后关闭阻塞记录 |
| `explain_impact()` | 生成影响解释边界 |

| 工厂函数 | 作用 |
|---|---|
| `open(FormalWorkRef work_ref, BlockerCauseRef cause_ref, ActorRef actor)` | 创建阻塞记录 |

禁止事项:不得用 blocker 替代 governance 裁决或 artifact evidence 正文。

---

## A8. `Iteration`

| 项 | 内容 |
|---|---|
| 所属部分 | `Iteration commitment` |
| 对象类型 | 聚合 / commitment window |
| 结构责任 | 表达项目在时间窗口内的承诺语境 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `iteration_id` | `IterationId` | Iteration 身份 |
| `project_id` | `ProjectId` | 所属项目 |
| `timebox_ref` | `ProcessTimeboxRef` | 来自 process 的节奏引用 |
| `iteration_state` | `IterationState` | 承诺窗口生命周期 |

| 状态 | 作用 |
|---|---|
| `Planning` / `Committed` / `InProgress` / `Closed` / `Cancelled` | 规划、已承诺、推进中、关闭和取消 |

| 成员函数 | 作用 |
|---|---|
| `commit(IterationCommitment commitment, ActorRef actor)` | 固定当前承诺范围 |
| `start(IterationChangeReason reason, ActorRef actor)` | 显式进入推进中状态 |
| `close(IterationCloseReason reason, ActorRef actor)` | 关闭承诺窗口 |
| `cancel(IterationChangeReason reason, ActorRef actor)` | 显式取消未关闭的 Iteration |

| 工厂函数 | 作用 |
|---|---|
| `open(ProjectId project_id, ProcessTimeboxRef timebox_ref, ActorRef actor)` | 建立 Iteration 语境 |

禁止事项:不得等同 Backlog 全集、process planning 活动或 workspace board filter。

---

## A9. `IterationCommitment`

| 项 | 内容 |
|---|---|
| 所属部分 | `Iteration commitment` |
| 对象类型 | 值对象 / commitment set |
| 结构责任 | 表达进入 Iteration 的正式工作集合 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `commitment_id` | `IterationCommitmentId` | 承诺集合身份 |
| `iteration_id` | `IterationId` | 所属 Iteration |
| `committed_work_refs` | `FormalWorkRefSet` | 被承诺的正式工作 |
| `commitment_state` | `CommitmentState` | 集合是否生效 |

| 状态 | 作用 |
|---|---|
| `Candidate` / `Committed` / `Changed` / `Closed` | 候选、已承诺、已调整和关闭 |

| 成员函数 | 作用 |
|---|---|
| `contains(FormalWorkRef work_ref)` | 判断工作是否在承诺范围 |
| `apply_change(IterationCommitmentChangeSet change_set, IterationChangeReason reason, ActorRef actor)` | 显式调整承诺集合并进入 Changed |
| `remove(FormalWorkRef work_ref, CommitmentChangeReason reason)` | 显式移出承诺范围 |
| `close(IterationCloseReason reason, ActorRef actor)` | 随 Iteration 关闭承诺集合 |

| 工厂函数 | 作用 |
|---|---|
| `from_candidates(IterationId iteration_id, FormalWorkRefSet candidates, ActorRef actor)` | 从正式工作候选形成承诺集合 |

禁止事项:不得包含非 Backlog 正式工作或未 formalize 来源。

---

## A10. `PromoteResult`

| 项 | 内容 |
|---|---|
| 所属部分 | `Work decomposition / promote boundary` |
| 对象类型 | decision result / truth record |
| 结构责任 | 表达外部来源是否被升级为正式 WorkItem / child WorkItem |

| 字段 | 类型 | 作用 |
|---|---|---|
| `promote_result_id` | `PromoteResultId` | promote 结果身份 |
| `source_ref` | `SourceWorkRef` | 被评估来源 |
| `result_state` | `PromoteResultState` | 接受、拒绝或待审 |
| `created_work_ref` | `Option<FormalWorkRef>` | 接受后创建的正式工作引用 |

| 状态 | 作用 |
|---|---|
| `PendingReview` / `Accepted` / `Rejected` / `Superseded` | 待审、接受、拒绝和被新判断替代 |

| 成员函数 | 作用 |
|---|---|
| `accept(FormalWorkRef work_ref, ActorRef actor)` | 绑定已创建正式工作 |
| `reject(PromoteRejectReason reason, ActorRef actor)` | 记录不升级理由 |

| 工厂函数 | 作用 |
|---|---|
| `evaluate(SourceWorkRef source_ref, PromoteReason reason, ActorRef actor)` | 形成待决 promote 结果 |

禁止事项:不得保存来源正文,不得绕过显式 promote 创建正式工作。

---

## A11. `DerivedWorkViewState`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived consumption support` |
| 对象类型 | 状态对象 |
| 结构责任 | 表达派生视图的新鲜度、重建和失败状态 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_ref` | `DerivedWorkViewRef` | 派生视图引用 |
| `source_cursor` | `WorkTruthCursor` | 已消费的 truth 位置 |
| `freshness_state` | `DerivedFreshnessState` | 派生状态 |

| 状态 | 作用 |
|---|---|
| `Fresh` / `Stale` / `Rebuilding` / `Failed` | 新鲜、过期、重建中和失败 |

| 成员函数 | 作用 |
|---|---|
| `mark_stale(WorkTruthCursor cursor)` | 标记需要刷新 |
| `mark_fresh(WorkTruthCursor cursor)` | 标记刷新完成 |

| 工厂函数 | 作用 |
|---|---|
| `for_view(DerivedWorkViewRef view_ref)` | 建立派生视图状态 |

禁止事项:不得反写 Project、WorkItem、Iteration 或 dependency truth。

---

## A12. `ReferenceResolutionState`

| 项 | 内容 |
|---|---|
| 所属部分 | `Local reference / snapshot / projection support` |
| 对象类型 | 状态对象 |
| 结构责任 | 表达外部引用是否解析、是否过期和是否可降级使用 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `reference_ref` | `ExternalReferenceRef` | 外部引用 |
| `resolution_state` | `ReferenceResolutionStatus` | 解析状态 |
| `last_resolved_at` | `Option<Timestamp>` | 最近成功解析时间 |

| 状态 | 作用 |
|---|---|
| `Unresolved` / `Resolved` / `Stale` / `Failed` | 未解析、已解析、快照过期和解析失败 |

| 成员函数 | 作用 |
|---|---|
| `mark_resolved(Timestamp resolved_at)` | 记录解析成功 |
| `mark_stale(ReferenceStaleReason reason)` | 记录过期原因 |

| 工厂函数 | 作用 |
|---|---|
| `unresolved(ExternalReferenceRef reference_ref)` | 建立未解析引用状态 |

禁止事项:不得因引用不可解析而伪造外部 truth 或删除已成立 Work truth。
