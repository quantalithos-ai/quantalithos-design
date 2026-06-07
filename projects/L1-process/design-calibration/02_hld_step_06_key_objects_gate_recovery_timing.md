# Step 6 附录 A2. Gate / Recovery / Timing 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 本文件只给概要骨架,不定义完整对象契约。

---

## A7. `WaitingGate`

| 项 | 内容 |
|---|---|
| 所属部分 | `Gate coordination` |
| 对象类型 | 实体 / waiting truth |
| 结构责任 | 表达过程等待意图、等待状态和正式恢复依据边界 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `waiting_gate_id` | `WaitingGateId` | 等待点身份 |
| `process_instance_id` | `ProcessInstanceId` | 所属过程实例 |
| `activity_ref` | `ActivityRef` | 触发等待的活动节点 |
| `gate_state` | `WaitingGateState` | 当前等待状态 |
| `decision_ref` | `Option<GovernanceDecisionRef>` | 外部治理决策引用 |

| 状态 | 作用 |
|---|---|
| `Waiting` / `DecisionResolved` / `Resumed` / `Cancelled` / `Expired` | 等待、依据已解析、已恢复、已取消和已过期 |

| 成员函数 | 作用 |
|---|---|
| `attach_decision(GovernanceDecisionRef decision_ref, ActorRef actor)` | 绑定正式外部决策引用 |
| `resume(ResumeReason reason, ActorRef actor)` | 根据正式依据恢复 |
| `cancel(WaitingCancelReason reason, ActorRef actor)` | 取消等待 |
| `expire(WaitingExpireReason reason)` | 标记等待过期 |

| 工厂函数 | 作用 |
|---|---|
| `open_for_activity(ProcessInstanceId process_instance_id, ActivityRef activity_ref, PauseContext pause_context)` | 为活动节点建立等待点 |

| 禁止事项 | 说明 |
|---|---|
| 不生成 governance decision | 只引用外部正式决策 |
| 不后台静默恢复 | 恢复必须有可解释依据 |

---

## A8. `PauseContext`

| 项 | 内容 |
|---|---|
| 所属部分 | `Gate coordination` |
| 对象类型 | value object / context object |
| 结构责任 | 保留暂停原因、关联节点和恢复语境 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `pause_reason` | `PauseReason` | 说明为什么暂停 |
| `activity_ref` | `ActivityRef` | 暂停关联的活动 |
| `resume_requirement_ref` | `ResumeRequirementRef` | 恢复所需外部依据 |
| `captured_at` | `Timestamp` | 暂停语境捕获时间 |

| 成员函数 | 作用 |
|---|---|
| `requires_governance_decision()` | 判断是否需要治理决策 |
| `matches_decision(GovernanceDecisionRef decision_ref)` | 判断外部决策是否满足恢复要求 |

| 工厂函数 | 作用 |
|---|---|
| `from_activity(Activity activity, PauseReason pause_reason, ResumeRequirementRef requirement_ref)` | 从活动暂停意图形成上下文 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 decision 正文 | 只保存恢复要求和引用 |
| 不替代 checkpoint | pause context 解释等待,checkpoint 解释恢复连续性 |

---

## A9. `ProcessCheckpoint`

| 项 | 内容 |
|---|---|
| 所属部分 | `Checkpoint and recovery` |
| 对象类型 | 实体 / recovery truth |
| 结构责任 | 表达 Instance 级恢复事实和恢复锚点 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `checkpoint_id` | `ProcessCheckpointId` | checkpoint 身份 |
| `process_instance_id` | `ProcessInstanceId` | 所属实例 |
| `activity_ref` | `Option<ActivityRef>` | checkpoint 对应活动节点 |
| `checkpoint_state` | `CheckpointState` | checkpoint 是否可用于恢复 |
| `evidence_ref` | `CheckpointEvidenceRef` | 恢复依据引用 |

| 状态 | 作用 |
|---|---|
| `Available` / `Superseded` / `Invalid` / `Expired` | 可用、被新 checkpoint 替代、不可用和过期 |

| 成员函数 | 作用 |
|---|---|
| `mark_superseded(ProcessCheckpointRef next_ref)` | 被新 checkpoint 替代 |
| `invalidate(CheckpointInvalidReason reason)` | 标记不可恢复 |
| `expire(CheckpointExpireReason reason)` | 标记过期 |
| `can_resume(ProcessInstance instance)` | 判断是否可服务同一实例恢复 |

| 工厂函数 | 作用 |
|---|---|
| `capture(ProcessInstance instance, Option<ActivityRef> activity_ref, CheckpointEvidenceRef evidence_ref)` | 从实例当前状态捕获 checkpoint |

| 禁止事项 | 说明 |
|---|---|
| 不保存 runtime micro checkpoint | 只保存 Instance 级恢复锚点 |
| 不创建第二份 Process truth | 只能服务同一实例链恢复 |

---

## A10. `RecoveryAttempt`

| 项 | 内容 |
|---|---|
| 所属部分 | `Checkpoint and recovery` |
| 对象类型 | history record / recovery state |
| 结构责任 | 表达一次恢复尝试、结果和失败解释 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `recovery_attempt_id` | `RecoveryAttemptId` | 恢复尝试身份 |
| `process_instance_id` | `ProcessInstanceId` | 被恢复实例 |
| `checkpoint_ref` | `ProcessCheckpointRef` | 使用的 checkpoint |
| `recovery_state` | `RecoveryAttemptState` | 当前恢复尝试状态 |
| `failure_reason` | `Option<RecoveryFailureReason>` | 失败解释 |
| `abandon_reason` | `Option<RecoveryAbandonReason>` | 放弃解释 |

| 状态 | 作用 |
|---|---|
| `Pending` / `Applied` / `Failed` / `Abandoned` | 待执行、已应用、失败和放弃 |

| 成员函数 | 作用 |
|---|---|
| `mark_applied(RecoveryHistoryId history_id, ActorRef actor)` | 记录恢复已应用并返回 `AttemptApplied` history |
| `mark_failed(RecoveryHistoryId history_id, RecoveryFailureReason reason)` | 记录恢复失败并返回 `AttemptFailed` history |
| `abandon(RecoveryHistoryId history_id, RecoveryAbandonReason reason, ActorRef actor)` | 放弃恢复尝试并返回 `AttemptAbandoned` history |

| 工厂函数 | 作用 |
|---|---|
| `start(ProcessInstanceId process_instance_id, ProcessCheckpointRef checkpoint_ref, ActorRef actor)` | 从恢复意图形成尝试记录 |

| 禁止事项 | 说明 |
|---|---|
| 不覆盖 checkpoint truth | 只记录一次尝试 |
| 不保存 reasoning trace | 只保留失败原因和引用 |

---

## A11. `ProcessStageState`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process timing and rhythm` |
| 对象类型 | state object |
| 结构责任 | 表达过程阶段和阶段内运行状态 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `stage_id` | `ProcessStageId` | 过程阶段身份 |
| `process_instance_id` | `ProcessInstanceId` | 所属实例 |
| `stage_kind` | `ProcessStageKind` | 阶段类别 |
| `stage_state` | `StageState` | 当前阶段状态 |

| 状态 | 作用 |
|---|---|
| `Pending` / `Active` / `Paused` / `Completed` / `Skipped` | 待进入、进行中、暂停、完成和跳过 |

| 成员函数 | 作用 |
|---|---|
| `activate(ActorRef actor)` | 进入当前阶段 |
| `pause(StagePauseReason reason, ActorRef actor)` | 暂停阶段 |
| `complete(StageCompletionReason reason, ActorRef actor)` | 完成阶段 |
| `skip(StageSkipReason reason, ActorRef actor)` | 跳过阶段 |

| 工厂函数 | 作用 |
|---|---|
| `from_profile_stage(ProcessInstanceId process_instance_id, ProfileStageRef stage_ref)` | 从 profile 阶段创建过程阶段状态 |

| 禁止事项 | 说明 |
|---|---|
| 不等同 Work Iteration | 只表达过程阶段,不拥有工作承诺集合 |
| 不保存会议正文 | planning / review / retro 正文在边界外 |

---

## A12. `ProcessTimeboxBinding`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process timing and rhythm` |
| 对象类型 | value object / boundary binding |
| 结构责任 | 表达过程 timebox 与外部 work iteration / timebox 的引用绑定 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `binding_id` | `ProcessTimeboxBindingId` | 绑定身份 |
| `process_timebox_ref` | `ProcessTimeboxRef` | 过程时间盒引用 |
| `external_timebox_ref` | `ExternalTimeboxRef` | 外部时间盒或 iteration 引用 |
| `binding_state` | `TimeboxBindingState` | 绑定是否有效、过期或解除 |

| 状态 | 作用 |
|---|---|
| `Active` / `Stale` / `Released` / `Invalid` | 生效、外部过期、已解除和不可用 |

| 成员函数 | 作用 |
|---|---|
| `mark_stale(ReferenceStaleReason reason)` | 标记外部 timebox 引用过期 |
| `release(TimeboxReleaseReason reason, ActorRef actor)` | 解除绑定 |
| `is_active()` | 判断绑定是否仍可用于过程节奏解释 |

| 工厂函数 | 作用 |
|---|---|
| `bind(ProcessTimeboxRef process_timebox_ref, ExternalTimeboxRef external_timebox_ref, ActorRef actor)` | 建立过程 timebox 与外部时间盒引用关系 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有 Work Iteration truth | 只保存引用绑定 |
| 不决定 commitment scope | 承诺范围属于 Work |

---

## A13. `DerivedProcessViewState`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived maintenance and reconciliation` |
| 对象类型 | projection state |
| 结构责任 | 表达 process read model / timeline / summary 的派生状态和可见失败 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_state_id` | `DerivedProcessViewStateId` | 派生状态身份 |
| `projection_kind` | `ProcessProjectionKind` | 派生视图类别 |
| `freshness_state` | `ProjectionFreshnessState` | 新鲜、过期、重建或失败 |
| `source_cursor_ref` | `ProcessTruthCursorRef` | 派生来源位置 |

| 状态 | 作用 |
|---|---|
| `Fresh` / `Stale` / `Rebuilding` / `Failed` / `Disabled` | 可读新鲜、过期、重建中、失败和禁用 |

| 成员函数 | 作用 |
|---|---|
| `mark_fresh(ProcessTruthCursorRef cursor_ref)` | 记录派生已追上指定 truth cursor |
| `mark_stale(ProjectionStaleReason reason)` | 标记派生过期 |
| `mark_rebuilding()` | 标记重建中 |
| `mark_failed(ProjectionFailureReason reason)` | 标记派生失败 |

| 工厂函数 | 作用 |
|---|---|
| `for_projection(ProcessProjectionKind projection_kind)` | 为派生视图建立状态记录 |

| 禁止事项 | 说明 |
|---|---|
| 不反写真相 | projection 状态不能推进 Process truth |
| 不隐藏失败 | stale / failed 必须对查询或运维可见 |

---

## A14. `ReferenceResolutionState`

| 项 | 内容 |
|---|---|
| 所属部分 | `External context mirror support` |
| 对象类型 | marker / state object |
| 结构责任 | 表达外部引用或快照的解析、新鲜度和不可用状态 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `reference_ref` | `ExternalContextRef` | 被解析的外部引用 |
| `resolution_state` | `ResolutionState` | resolved / unresolved / stale / invalid 状态 |
| `last_resolved_at` | `Option<Timestamp>` | 最近成功解析时间 |
| `failure_reason` | `Option<ReferenceResolutionFailureReason>` | 不可解析原因 |

| 状态 | 作用 |
|---|---|
| `Resolved` / `Unresolved` / `Stale` / `Invalid` / `Unavailable` | 已解析、未解析、过期、不可用引用和来源不可用 |

| 成员函数 | 作用 |
|---|---|
| `mark_resolved(Timestamp resolved_at)` | 标记引用已解析 |
| `mark_unresolved(ReferenceResolutionFailureReason reason)` | 标记暂未解析 |
| `mark_stale(ReferenceStaleReason reason)` | 标记快照过期 |
| `mark_invalid(ReferenceInvalidReason reason)` | 标记引用不可用 |

| 工厂函数 | 作用 |
|---|---|
| `for_reference(ExternalContextRef reference_ref)` | 为外部引用创建解析状态 |

| 禁止事项 | 说明 |
|---|---|
| 不补写外部 truth | 解析失败只能暴露 marker |
| 不保存外部正文 | 只表达引用状态 |
