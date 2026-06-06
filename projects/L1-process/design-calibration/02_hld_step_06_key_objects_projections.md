# Step 6 附录 B2. Projection / Read Model 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> Projection / read model 只读、可重建、可过期,不反写 Process truth。

---

## B12. `ProcessReadModel`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process consumption and traceability` |
| 对象类型 | projection / read model |
| 结构责任 | 提供当前过程事实的授权读取摘要 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `read_model_id` | `ProcessReadModelId` | 读取模型身份 |
| `process_instance_ref` | `ProcessInstanceRef` | 对应过程实例 |
| `profile_ref` | `ProcessProfileRef` | 当前 profile 引用 |
| `current_activity_ref` | `Option<ActivityRef>` | 当前活动 |
| `view_state` | `DerivedProcessViewStateRef` | 派生状态引用 |

| 成员函数 | 作用 |
|---|---|
| `mark_stale(ProjectionStaleReason reason)` | 标记读取模型过期 |
| `can_serve(ProcessConsumerRef consumer_ref)` | 判断是否可为 consumer 提供读取 |

| 工厂函数 | 作用 |
|---|---|
| `from_process_truth(ProcessTruthSnapshot snapshot, DerivedProcessViewState view_state)` | 从 Process truth 摘要构造读取模型 |

| 禁止事项 | 说明 |
|---|---|
| 不反写真相 | read model 滞后不改变 Process truth |
| 不隐藏外部不可解析状态 | unresolved / stale marker 必须可见 |

---

## B13. `ProcessTimelineView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process consumption and traceability` |
| 对象类型 | projection / timeline view |
| 结构责任 | 提供过程变化、等待、恢复和交接的时间线视图 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `timeline_id` | `ProcessTimelineId` | timeline 身份 |
| `process_instance_ref` | `ProcessInstanceRef` | 对应实例 |
| `entry_refs` | `ProcessTimelineEntryRefSet` | 时间线条目引用集合 |
| `view_state` | `DerivedProcessViewStateRef` | 派生状态引用 |

| 成员函数 | 作用 |
|---|---|
| `append_entry(ProcessTraceRecord record)` | 从追溯记录追加 timeline 条目 |
| `filter_for(ProcessConsumerRef consumer_ref, ReadVisibilityPolicy policy)` | 按授权裁剪 timeline |
| `has_gap()` | 判断 timeline 是否存在缺口 |

| 工厂函数 | 作用 |
|---|---|
| `from_trace_records(ProcessInstanceRef process_instance_ref, ProcessTraceRecordSet records)` | 从追溯记录构造 timeline |

| 禁止事项 | 说明 |
|---|---|
| 不保存 conversation 正文 | 只保存过程事件摘要或引用 |
| 不作为审计链唯一来源 | 审计链仍由 ProcessTraceRecord / AuditTrail 承载 |

---

## B14. `ProcessProgressSummary`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process consumption and traceability` |
| 对象类型 | projection / summary view |
| 结构责任 | 提供过程阶段、当前活动、等待 / 恢复状态的摘要 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `summary_id` | `ProcessProgressSummaryId` | 摘要身份 |
| `process_instance_ref` | `ProcessInstanceRef` | 对应实例 |
| `stage_ref` | `Option<ProcessStageRef>` | 当前阶段 |
| `progress_state` | `ProcessProgressState` | 摘要级进度状态 |
| `view_state` | `DerivedProcessViewStateRef` | 派生状态引用 |

| 状态 | 作用 |
|---|---|
| `NotStarted` / `InProgress` / `Waiting` / `Recovering` / `Completed` / `Blocked` | 摘要级过程状态 |

| 成员函数 | 作用 |
|---|---|
| `mark_waiting(WaitingGateRef waiting_gate_ref)` | 在摘要中显式呈现等待状态 |
| `mark_recovering(RecoveryAttemptRef recovery_attempt_ref)` | 在摘要中显式呈现恢复状态 |
| `mark_completed()` | 在摘要中呈现完成状态 |

| 工厂函数 | 作用 |
|---|---|
| `from_read_model(ProcessReadModel read_model, ProcessStageState stage_state)` | 从读取模型和阶段状态形成摘要 |

| 禁止事项 | 说明 |
|---|---|
| 不成为 workspace dashboard truth | workspace 只消费该摘要 |
| 不补写未知外部状态 | 缺失必须暴露 marker |

---

## B15. `ActivityStatusView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Process execution management` |
| 对象类型 | projection / read model |
| 结构责任 | 提供 Activity 状态、承担和外部反馈摘要读取面 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `activity_status_view_id` | `ActivityStatusViewId` | 视图身份 |
| `activity_ref` | `ActivityRef` | 对应活动 |
| `activity_state` | `ActivityState` | 活动状态 |
| `assignee_ref` | `Option<ActorRef>` | 当前承担者 |
| `feedback_state` | `ReferenceResolutionState` | 外部反馈解析状态 |

| 成员函数 | 作用 |
|---|---|
| `mark_feedback_stale(ReferenceStaleReason reason)` | 标记反馈摘要过期 |
| `is_actionable()` | 判断活动是否对调用方可行动 |

| 工厂函数 | 作用 |
|---|---|
| `from_activity(Activity activity, ReferenceResolutionState feedback_state)` | 从 Activity 和反馈解析状态构造视图 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 runtime body | 只保留反馈引用或解析状态 |
| 不推进 Activity | 视图只读 |

---

## B16. `ReconciliationReport`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived maintenance and reconciliation` |
| 对象类型 | report / evidence |
| 结构责任 | 表达 Process truth、projection 和外部快照之间的对账结果 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `report_id` | `ReconciliationReportId` | 报告身份 |
| `scope_ref` | `ProcessReconciliationScopeRef` | 对账范围 |
| `result_state` | `ReconciliationResultState` | 对账结果状态 |
| `issue_refs` | `ReconciliationIssueRefSet` | 问题引用集合 |

| 状态 | 作用 |
|---|---|
| `Clean` / `HasIssues` / `Failed` / `Partial` | 无问题、有问题、失败和部分完成 |

| 成员函数 | 作用 |
|---|---|
| `add_issue(ReconciliationIssueRef issue_ref)` | 添加对账问题 |
| `mark_failed(ReconciliationFailureReason reason)` | 标记对账失败 |
| `is_clean()` | 判断对账是否无问题 |

| 工厂函数 | 作用 |
|---|---|
| `for_scope(ProcessReconciliationScopeRef scope_ref)` | 为指定范围创建对账报告 |

| 禁止事项 | 说明 |
|---|---|
| 不修复业务 truth | 报告只能暴露或触发受控维护 |
| 不保存外部正文 | issue 只能引用问题和摘要 |
