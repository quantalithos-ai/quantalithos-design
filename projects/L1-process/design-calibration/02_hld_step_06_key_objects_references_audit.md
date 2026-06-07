# Step 6 附录 B3. Reference / Snapshot / Audit 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> Reference / snapshot 只保存引用或摘要;history / audit / outbox 不替代当前 truth。

`MethodDefinitionSnapshot`、`WorkContextSnapshot`、`ActorCapabilitySnapshot`、`RuntimeFeedbackRef` 和 `ConversationContextRef` 的字段表是详细设计的最小语义约束。详细设计必须对齐相邻仓正式 contracts,可以把外部 ref 细化为对应 typed ref 或补充版本 / digest / captured_at 字段,但不得降级成裸字符串引用、删除摘要 / 验证 / 解析状态语义,也不得保存 method-library、work、identity、governance、artifact、runtime、conversation、observability 或 archive 正文。

---

## B17. `MethodDefinitionSnapshot`

| 项 | 内容 |
|---|---|
| 所属部分 | `Runtime shape management` |
| 对象类型 | snapshot |
| 结构责任 | 保存 method-library 定义来源的目录级摘要 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `definition_ref` | `MethodDefinitionRef` | 方法定义引用 |
| `definition_version_ref` | `MethodDefinitionVersionRef` | 定义版本引用 |
| `definition_kind` | `MethodDefinitionKind` | process / task / role / work product / view profile 类别 |
| `snapshot_state` | `ReferenceResolutionState` | 快照解析和过期状态 |

| 成员函数 | 作用 |
|---|---|
| `is_process_shape_source()` | 判断是否可作为 runtime shape 来源 |
| `mark_stale(ReferenceStaleReason reason)` | 标记快照过期 |

| 工厂函数 | 作用 |
|---|---|
| `from_method_library(MethodDefinitionRef definition_ref, MethodDefinitionVersionRef version_ref, MethodDefinitionKind definition_kind)` | 从 method-library 摘要形成快照 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 method definition body | 只保存引用、版本和摘要 |
| 不成为 method truth | 来源 truth 仍归 method-library |

---

## B18. `WorkContextSnapshot`

| 项 | 内容 |
|---|---|
| 所属部分 | `External context mirror support` |
| 对象类型 | snapshot |
| 结构责任 | 保存 Project / WorkItem / Iteration / timebox 的外部工作语境摘要 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `work_context_ref` | `WorkContextRef` | 外部工作语境引用 |
| `project_ref` | `Option<ProjectRef>` | 外部项目引用 |
| `iteration_ref` | `Option<IterationRef>` | 外部 iteration 引用 |
| `snapshot_state` | `ReferenceResolutionState` | 快照解析和过期状态 |

| 成员函数 | 作用 |
|---|---|
| `matches_project(ProjectRef project_ref)` | 判断是否属于目标项目 |
| `supports_timebox(ProcessTimeboxRef process_timebox_ref)` | 判断是否可解释过程 timebox |
| `mark_stale(ReferenceStaleReason reason)` | 标记快照过期 |

| 工厂函数 | 作用 |
|---|---|
| `from_work_context(WorkContextRef work_context_ref)` | 从 work 边界摘要形成快照 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有 Work truth | Project / WorkItem / Iteration truth 归 L1-work |
| 不决定 commitment scope | 只解释过程语境 |

---

## B19. `ActorCapabilitySnapshot`

| 项 | 内容 |
|---|---|
| 所属部分 | `External context mirror support` |
| 对象类型 | snapshot |
| 结构责任 | 保存 actor / member 可承担性和能力摘要 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `actor_ref` | `ActorRef` | 外部 actor 引用 |
| `member_ref` | `Option<GlobalMemberRef>` | 可选 identity 成员引用 |
| `capability_refs` | `CapabilityRefSet` | 可承担能力引用集合 |
| `snapshot_state` | `ReferenceResolutionState` | 快照解析和过期状态 |

| 成员函数 | 作用 |
|---|---|
| `supports_activity(ActivityKind activity_kind)` | 判断 actor 是否可承担活动 |
| `mark_stale(ReferenceStaleReason reason)` | 标记能力快照过期 |

| 工厂函数 | 作用 |
|---|---|
| `from_identity(ActorRef actor_ref, CapabilityRefSet capability_refs)` | 从 identity 摘要形成能力快照 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有身份生命周期 | GlobalMember / role truth 归 identity |
| 不替代授权策略 | 只提供能力摘要 |

---

## B20. `GovernanceDecisionRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `Gate coordination` |
| 对象类型 | reference object |
| 结构责任 | 指向外部治理决策或恢复依据 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `decision_kind` | `GovernanceDecisionKind` | 决策类别 |
| `external_ref` | `ExternalDecisionRef` | 外部稳定决策引用 |
| `decision_state` | `ReferenceResolutionState` | 决策引用解析状态 |

| 成员函数 | 作用 |
|---|---|
| `is_resumable_decision()` | 判断是否可作为等待恢复依据 |
| `same_decision(GovernanceDecisionRef other)` | 判断是否同一外部决策 |

| 工厂函数 | 作用 |
|---|---|
| `from_external(GovernanceDecisionKind decision_kind, ExternalDecisionRef external_ref)` | 从外部决策引用形成本地 ref |

| 禁止事项 | 说明 |
|---|---|
| 不保存 decision body | 只保存引用和解析状态 |
| 不生成治理裁决 | 裁决 truth 归 governance |

---

## B21. `RuntimeFeedbackRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `External context mirror support` |
| 对象类型 | reference object |
| 结构责任 | 指向 runtime / member-service 的 Activity 执行反馈 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `feedback_kind` | `RuntimeFeedbackKind` | 反馈类别 |
| `external_ref` | `ExternalRuntimeFeedbackRef` | 外部反馈引用 |
| `feedback_state` | `ReferenceResolutionState` | 反馈解析状态 |

| 成员函数 | 作用 |
|---|---|
| `is_completion_feedback()` | 判断是否可用于完成 Activity |
| `same_feedback(RuntimeFeedbackRef other)` | 判断是否同一外部反馈 |

| 工厂函数 | 作用 |
|---|---|
| `from_runtime(RuntimeFeedbackKind feedback_kind, ExternalRuntimeFeedbackRef external_ref)` | 从 runtime 反馈引用形成本地 ref |

| 禁止事项 | 说明 |
|---|---|
| 不保存 execution log | 只保存反馈引用 |
| 不成为 runtime step truth | 执行事实归 runtime |

---

## B22. `ConversationContextRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `External context mirror support` |
| 对象类型 | reference object |
| 结构责任 | 指向 conversation context 或过程显化回链 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `conversation_ref` | `ConversationRef` | 外部 conversation 引用 |
| `context_kind` | `ConversationContextKind` | 上下文类别 |
| `context_state` | `ReferenceResolutionState` | 上下文解析状态 |

| 成员函数 | 作用 |
|---|---|
| `is_trace_context()` | 判断是否用于过程追溯显化 |
| `same_context(ConversationContextRef other)` | 判断是否同一外部上下文 |

| 工厂函数 | 作用 |
|---|---|
| `from_conversation(ConversationRef conversation_ref, ConversationContextKind context_kind)` | 从 conversation 引用形成本地上下文 ref |

| 禁止事项 | 说明 |
|---|---|
| 不保存 conversation body | 消息正文归 conversation |
| 不拥有 visibility truth | 只保存引用和解析状态 |

---

## B23. `TraceHandoffRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process consumption and traceability` |
| 对象类型 | reference object |
| 结构责任 | 指向观测、归档或追溯交接结果 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `handoff_kind` | `TraceHandoffKind` | 交接类别 |
| `external_ref` | `ExternalHandoffRef` | 外部交接引用 |
| `handoff_state` | `TraceHandoffState` | 交接状态 |

| 状态 | 作用 |
|---|---|
| `Prepared` / `Delivered` / `Failed` / `Cancelled` | 已准备、已交付、失败和取消 |

| 成员函数 | 作用 |
|---|---|
| `mark_delivered(ExternalHandoffRef external_ref)` | 记录交接成功 |
| `mark_failed(HandoffFailureReason reason)` | 记录交接失败 |

| 工厂函数 | 作用 |
|---|---|
| `prepare(TraceHandoffKind handoff_kind, ProcessTraceRecord trace_record)` | 从追溯记录形成交接引用 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 observability / archive body | 只保存交接引用和状态 |
| 不决定 Process truth | 交接失败不回滚过程事实 |

---

## B24. `ProcessTraceRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process consumption and traceability` |
| 对象类型 | trace record |
| 结构责任 | 记录过程事实变化、等待、恢复、维护和交接的追溯线索 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `trace_id` | `ProcessTraceId` | 追溯记录身份 |
| `subject_ref` | `ProcessTraceSubjectRef` | 被追溯对象 |
| `trace_context` | `TraceContext` | L0-core trace 关联 |
| `change_ref` | `ProcessTruthChangeRef` | 关联已成立过程变化 |

| 成员函数 | 作用 |
|---|---|
| `relates_to(ProcessTraceSubjectRef subject_ref)` | 判断是否属于某对象 |
| `prepare_handoff(TraceHandoffTargetRef target_ref)` | 形成 trace handoff 交接意图 |

| 工厂函数 | 作用 |
|---|---|
| `from_truth_change(ProcessTruthChange change, TraceContext trace_context)` | 从已成立变化形成追溯记录 |

| 禁止事项 | 说明 |
|---|---|
| 不包含外部正文 | 只保存引用、摘要和 trace context |
| 不替代当前 truth 状态 | 当前状态仍由 truth object 承载 |

---

## B25. `ProcessAuditTrail`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process truth core` |
| 对象类型 | audit trail |
| 结构责任 | 汇聚关键变化的审计链路 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `audit_trail_id` | `ProcessAuditTrailId` | 审计链身份 |
| `subject_ref` | `ProcessAuditSubjectRef` | 审计对象 |
| `record_refs` | `ProcessTraceRecordRefSet` | 关联追溯记录集合 |

| 成员函数 | 作用 |
|---|---|
| `append(ProcessTraceRecord record)` | 追加追溯记录引用 |
| `has_gap()` | 判断审计链是否存在缺口 |

| 工厂函数 | 作用 |
|---|---|
| `start_for_subject(ProcessAuditSubjectRef subject_ref)` | 为对象建立审计链 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 truth repository | 审计链只追溯变化 |
| 不保存 observability ledger 正文 | 交给 handoff 边界 |

---

## B26. `ProcessOutboxRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process truth core` |
| 对象类型 | outbox record |
| 结构责任 | 表达已成立 Process 事实需要传播或交接 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `outbox_id` | `ProcessOutboxId` | outbox 记录身份 |
| `event_kind` | `ProcessOutboxEventKind` | 变化类别 |
| `truth_ref` | `ProcessTruthRef` | 已成立 truth 引用 |
| `publication_state` | `OutboxPublicationState` | 传播状态 |

| 状态 | 作用 |
|---|---|
| `Pending` / `Published` / `Failed` / `RetryPending` | 待发布、已发布、失败和等待重试 |

| 成员函数 | 作用 |
|---|---|
| `mark_published(OutboxPublicationRef publication_ref)` | 记录发布成功 |
| `mark_retry(OutboxRetryReason reason)` | 记录进入重试 |
| `mark_failed(OutboxFailureReason reason)` | 记录发布失败 |

| 工厂函数 | 作用 |
|---|---|
| `from_truth_change(ProcessTruthChange change)` | 从已成立 truth 变化形成 outbox |

| 禁止事项 | 说明 |
|---|---|
| 不由 outbox 决定 truth 是否成立 | outbox 只传播已成立事实 |
| 不把下游确认作为主真相前置 | 传播最终一致 |

---

## B27. `ProfileChangeRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Profile adoption management` |
| 对象类型 | history record |
| 结构责任 | 记录 profile 采用、切换、暂停或退役变化 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `change_id` | `ProfileChangeId` | 变化记录身份 |
| `profile_ref` | `ProcessProfileRef` | 对应 profile |
| `change_reason` | `ProfileChangeReason` | 变化原因 |
| `actor_ref` | `ActorRef` | 发起 actor |

| 成员函数 | 作用 |
|---|---|
| `is_high_risk_change()` | 判断是否高风险 profile 变化 |
| `relates_to(ProcessProfileRef profile_ref)` | 判断是否属于该 profile |

| 工厂函数 | 作用 |
|---|---|
| `from_profile_change(ProcessProfile profile, ProfileChangeReason reason, ActorRef actor)` | 从 profile 变化形成记录 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 ProcessProfile | 只记录历史 |
| 不保存 method definition body | 只保留引用和原因 |

---

## B28. `ActivityProgressionRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process execution management` |
| 对象类型 | history record |
| 结构责任 | 记录 Activity 推进、反馈绑定和完成 / 失败结果 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `progression_id` | `ActivityProgressionId` | 推进记录身份 |
| `activity_ref` | `ActivityRef` | 对应活动 |
| `from_state` | `ActivityState` | 变化前状态 |
| `to_state` | `ActivityState` | 变化后状态 |
| `feedback_ref` | `Option<RuntimeFeedbackRef>` | 可选外部反馈引用 |

| 成员函数 | 作用 |
|---|---|
| `is_terminal_change()` | 判断是否终态变化 |
| `uses_feedback(RuntimeFeedbackRef feedback_ref)` | 判断是否关联某反馈 |

| 工厂函数 | 作用 |
|---|---|
| `from_activity_transition(Activity activity, ActivityState from_state, ActivityState to_state)` | 从 Activity 状态变化形成记录 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 runtime body | 只保存反馈引用 |
| 不替代 Activity 当前状态 | 当前状态仍由 Activity 承载 |

---

## B29. `WaitingGateChangeRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Gate coordination` |
| 对象类型 | history record |
| 结构责任 | 记录 waiting gate 建立、依据解析、恢复、取消或过期 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `change_id` | `WaitingGateChangeId` | 变化记录身份 |
| `waiting_gate_ref` | `WaitingGateRef` | 对应等待点 |
| `from_state` | `WaitingGateState` | 变化前状态 |
| `to_state` | `WaitingGateState` | 变化后状态 |
| `decision_ref` | `Option<GovernanceDecisionRef>` | 可选外部决策引用 |

| 成员函数 | 作用 |
|---|---|
| `is_resume_change()` | 判断是否恢复变化 |
| `uses_decision(GovernanceDecisionRef decision_ref)` | 判断是否使用某外部决策 |

| 工厂函数 | 作用 |
|---|---|
| `from_gate_transition(WaitingGateChangeId change_id, WaitingGate gate, WaitingGateState from_state, WaitingGateState to_state)` | 从等待状态变化形成记录 |

| 禁止事项 | 说明 |
|---|---|
| 不生成 decision | 只记录外部引用 |
| 不替代等待当前状态 | 当前状态仍由 WaitingGate 承载 |

---

## B30. `RecoveryHistoryRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Checkpoint and recovery` |
| 对象类型 | history record |
| 结构责任 | 记录 checkpoint 捕获、恢复尝试、失败和恢复结果 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `history_id` | `RecoveryHistoryId` | 恢复历史身份 |
| `process_instance_ref` | `ProcessInstanceRef` | 对应实例 |
| `checkpoint_ref` | `Option<ProcessCheckpointRef>` | 可选 checkpoint 引用 |
| `attempt_ref` | `Option<RecoveryAttemptRef>` | 可选恢复尝试引用 |
| `history_kind` | `RecoveryHistoryKind` | 历史记录类别 |

| `RecoveryHistoryKind` 变体 | 作用 |
|---|---|
| `CheckpointCaptured` | checkpoint 已捕获 |
| `CheckpointSuperseded` | checkpoint 被更新 checkpoint 替代 |
| `CheckpointInvalidated` | checkpoint 被标记无效 |
| `CheckpointExpired` | checkpoint 因策略过期 |
| `AttemptStarted` | recovery attempt 已创建 |
| `AttemptApplied` | recovery attempt 已应用 |
| `AttemptFailed` | recovery attempt 失败 |
| `AttemptAbandoned` | recovery attempt 被放弃 |
| `InstanceRecovering` | process instance 进入恢复中 |
| `InstanceRecoveryCompleted` | process instance 从恢复回到运行 |

| 成员函数 | 作用 |
|---|---|
| `relates_to_checkpoint(ProcessCheckpointRef checkpoint_ref)` | 判断是否关联 checkpoint |
| `relates_to_attempt(RecoveryAttemptRef attempt_ref)` | 判断是否关联恢复尝试 |

| 工厂函数 | 作用 |
|---|---|
| `from_checkpoint(history_id: RecoveryHistoryId, checkpoint: ProcessCheckpoint, history_kind: RecoveryHistoryKind)` | 从 checkpoint 变化形成历史记录 |
| `from_recovery_attempt(history_id: RecoveryHistoryId, attempt: RecoveryAttempt)` | 从恢复尝试形成历史记录 |
| `from_instance_recovery_transition(history_id: RecoveryHistoryId, instance: ProcessInstance, checkpoint_ref: Option<ProcessCheckpointRef>, attempt_ref: Option<RecoveryAttemptRef>, history_kind: RecoveryHistoryKind)` | 从 instance recovery 状态变化形成历史记录 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 archive package | 只保存恢复引用和结果 |
| 不替代 RecoveryAttempt | 只记录历史 |
