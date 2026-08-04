# Step 06 附录 E. Audit / History / Change Record 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 本文件只给概要骨架,不定义事件 payload、outbox schema 或数据库表。

---

## H1. `IntakeDecisionRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Observation Intake and Safety` |
| 对象类型 | audit record / history record |
| 主要责任 | 记录 observation intake 的 accepted、rejected、quarantined、degraded 等决策变化。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `IntakeDecisionRecordId` | 记录身份。 |
| `receipt_ref` | `ObservationReceiptRef` | 回指准入事实。 |
| `decision_kind` | `IntakeDecisionKind` | 决策类别。 |
| `decision_reason` | `IntakeDecisionReason` | 决策原因。 |
| `actor_ref` | `ActorSafeRef` | 执行动作或系统 actor。 |
| `recorded_at` | `ObservedAt` | 记录时间。 |

| 状态 | 作用 |
|---|---|
| 不适用 | 记录对象本身不可变,不表达生命周期。 |

| 成员函数 | 作用 |
|---|---|
| `summarize()` | 输出可审计摘要。 |

| 工厂函数 | 作用 |
|---|---|
| `record_decision(ObservationReceipt receipt, IntakeDecisionKind decision_kind, IntakeDecisionReason reason, ActorSafeRef actor_ref)` | 从准入事实记录决策。 |

| 禁止事项 | 说明 |
|---|---|
| 不修改 receipt | record 只追溯变化。 |

---

## H2. `CorrelationLinkRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Correlation and Safe Signal` |
| 对象类型 | audit record / history record |
| 主要责任 | 记录 correlation context 建立、降级、失效或 signal linkage 的变化。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `CorrelationLinkRecordId` | 记录身份。 |
| `correlation_context_ref` | `CorrelationContextRef` | 关联语境引用。 |
| `safe_signal_ref` | `Option<SafeSignalRef>` | 相关 signal。 |
| `link_change_kind` | `CorrelationLinkChangeKind` | 建立、降级、失效等变化类别。 |
| `reason` | `CorrelationChangeReason` | 变化原因。 |

| 状态 | 作用 |
|---|---|
| 不适用 | 记录对象不可变。 |

| 成员函数 | 作用 |
|---|---|
| `summarize()` | 输出关联变化摘要。 |

| 工厂函数 | 作用 |
|---|---|
| `record_change(CorrelationContext context, CorrelationLinkChangeKind change_kind, CorrelationChangeReason reason)` | 记录关联变化。 |

| 禁止事项 | 说明 |
|---|---|
| 不重写 correlation context | 只记录变化。 |

---

## H3. `AuditAppendRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Audit Projection and Body-free Evidence Linkage` |
| 对象类型 | audit record / history record |
| 主要责任 | 记录 audit projection 的追加、限制、gap 附着或 evidence linkage 关联变化。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `AuditAppendRecordId` | 记录身份。 |
| `audit_projection_ref` | `AuditProjectionRef` | 回指审计投影。 |
| `append_kind` | `AuditAppendKind` | 追加类别。 |
| `evidence_linkage_ref` | `Option<EvidenceLinkageRef>` | 相关 evidence linkage。 |
| `gap_state_ref` | `Option<GapStateRef>` | 相关 gap。 |

| 状态 | 作用 |
|---|---|
| 不适用 | 记录对象不可变。 |

| 成员函数 | 作用 |
|---|---|
| `summarize()` | 输出 audit append 摘要。 |

| 工厂函数 | 作用 |
|---|---|
| `append(AuditProjection projection, AuditAppendKind append_kind)` | 从投影变化建立记录。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 source audit body | 只保存 append 语义和引用。 |

---

## H4. `HandoffLifecycleRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Report Handoff and Authenticity` |
| 对象类型 | audit record / history record |
| 主要责任 | 记录 report handoff 的 pending、ready、blocked、dispatched、failed 等生命周期变化。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `HandoffLifecycleRecordId` | 记录身份。 |
| `handoff_record_ref` | `ReportHandoffRecordRef` | 回指交接事实。 |
| `lifecycle_change_kind` | `HandoffLifecycleChangeKind` | 生命周期变化类别。 |
| `readiness_state` | `HandoffReadinessState` | 变化后的 readiness。 |
| `consumer_ref` | `ReportConsumerRef` | 目标消费者。 |

| 状态 | 作用 |
|---|---|
| 不适用 | 记录对象不可变。 |

| 成员函数 | 作用 |
|---|---|
| `summarize()` | 输出 handoff 生命周期摘要。 |

| 工厂函数 | 作用 |
|---|---|
| `record_transition(ReportHandoffRecord handoff_record, HandoffLifecycleChangeKind change_kind)` | 记录 handoff 状态变化。 |

| 禁止事项 | 说明 |
|---|---|
| 不伪造交接成功 | 记录必须忠实表达 blocked / failed。 |

---

## H5. `RetentionChangeRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Retention, Replay and No-write Guard` |
| 对象类型 | audit record / history record |
| 主要责任 | 记录 retention marker 的 hold、release、conflict、archive eligibility 等变化。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `RetentionChangeRecordId` | 记录身份。 |
| `retention_marker_ref` | `RetentionMarkerRef` | 回指留存标记。 |
| `change_kind` | `RetentionChangeKind` | 变化类别。 |
| `protection_ref` | `Option<ActiveReferenceProtectionRef>` | 相关活动保护。 |
| `reason` | `RetentionChangeReason` | 变化原因。 |

| 状态 | 作用 |
|---|---|
| 不适用 | 记录对象不可变。 |

| 成员函数 | 作用 |
|---|---|
| `summarize()` | 输出留存变化摘要。 |

| 工厂函数 | 作用 |
|---|---|
| `record_change(RetentionMarker marker, RetentionChangeKind change_kind, RetentionChangeReason reason)` | 记录留存变化。 |

| 禁止事项 | 说明 |
|---|---|
| 不触发 cleanup | 记录只追溯变化,不执行清理。 |

---

## H6. `NoWriteViolationRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Retention, Replay and No-write Guard` |
| 对象类型 | audit record / history record |
| 主要责任 | 记录 no-write violation 的检测、阻断、确认和关闭轨迹。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `NoWriteViolationRecordId` | 记录身份。 |
| `violation_ref` | `NoWriteViolationRef` | 回指违例事实。 |
| `attempted_write_target` | `ForbiddenWriteTargetRef` | 被禁止写入目标。 |
| `trigger_context_ref` | `NoWriteTriggerContextRef` | 触发语境。 |
| `record_kind` | `NoWriteViolationRecordKind` | 检测、阻断、关闭等类别。 |

| 状态 | 作用 |
|---|---|
| 不适用 | 记录对象不可变。 |

| 成员函数 | 作用 |
|---|---|
| `summarize()` | 输出违例摘要。 |

| 工厂函数 | 作用 |
|---|---|
| `record_violation(NoWriteViolation violation, NoWriteViolationRecordKind record_kind)` | 记录违例变化。 |

| 禁止事项 | 说明 |
|---|---|
| 不说明 source 已修复 | 只说明本仓阻断或记录违例。 |

---

## H7. `ReadAccessRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Read Query and Diagnostic Consumption` |
| 对象类型 | audit record / history record |
| 主要责任 | 记录只读查询、诊断读取和可见性判断的访问审计。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `ReadAccessRecordId` | 记录身份。 |
| `request_context_ref` | `DiagnosticRequestContextRef` | 请求语境。 |
| `visibility_state` | `ReadVisibilityState` | 可见性判断结果。 |
| `access_kind` | `ReadAccessKind` | query、diagnostic、handoff-read 等类别。 |
| `recorded_at` | `ObservedAt` | 记录时间。 |

| 状态 | 作用 |
|---|---|
| 不适用 | 记录对象不可变。 |

| 成员函数 | 作用 |
|---|---|
| `summarize()` | 输出访问摘要。 |

| 工厂函数 | 作用 |
|---|---|
| `record_access(DiagnosticRequestContext request_context, ReadVisibilityState visibility_state, ReadAccessKind access_kind)` | 记录只读访问。 |

| 禁止事项 | 说明 |
|---|---|
| 不授权访问 | 只记录访问和可见性结果。 |

---

## H8. `GapTransitionRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Gap and Degraded Expression` |
| 对象类型 | audit record / history record |
| 主要责任 | 记录 gap 的 open、acknowledged、mitigated、closed 或 escalated 变化。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `GapTransitionRecordId` | 记录身份。 |
| `gap_state_ref` | `GapStateRef` | 回指缺口事实。 |
| `transition_kind` | `GapTransitionKind` | 变化类别。 |
| `degraded_output_state` | `Option<DegradedOutputState>` | 相关降级状态。 |
| `reason` | `GapTransitionReason` | 变化原因。 |

| 状态 | 作用 |
|---|---|
| 不适用 | 记录对象不可变。 |

| 成员函数 | 作用 |
|---|---|
| `summarize()` | 输出缺口变化摘要。 |

| 工厂函数 | 作用 |
|---|---|
| `record_transition(GapState gap_state, GapTransitionKind transition_kind, GapTransitionReason reason)` | 记录 gap 变化。 |

| 禁止事项 | 说明 |
|---|---|
| 不伪造 gap closed | closed 必须来自明确语境。 |

---

## H9. `PeripheralDeliveryRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Peripheral Consumption and Export` |
| 对象类型 | audit record / history record |
| 主要责任 | 记录 dashboard、alert、report、GRC export 或 analysis material 的只读交付变化。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `PeripheralDeliveryRecordId` | 记录身份。 |
| `delivery_state` | `PeripheralDeliveryState` | 交付状态。 |
| `consumer_ref` | `PeripheralConsumerRef` | 目标消费者。 |
| `export_preparation_ref` | `Option<ExternalAuditExportPreparationRef>` | 相关外部导出准备。 |
| `record_kind` | `PeripheralDeliveryRecordKind` | ready、delivered、failed、suppressed 等类别。 |

| 状态 | 作用 |
|---|---|
| 不适用 | 记录对象不可变。 |

| 成员函数 | 作用 |
|---|---|
| `summarize()` | 输出交付摘要。 |

| 工厂函数 | 作用 |
|---|---|
| `record_delivery(PeripheralDeliveryState delivery_state, PeripheralDeliveryRecordKind record_kind)` | 记录外围交付变化。 |

| 禁止事项 | 说明 |
|---|---|
| 不作为产品配置事实 | 记录只表达平台只读交付。 |

---

## H10. `ReferenceRefreshRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Product-neutral Adapter and Reference Support` |
| 对象类型 | audit record / history record |
| 主要责任 | 记录外部引用或快照 refresh 的 fresh、stale、unresolved、invalid 等变化。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `ReferenceRefreshRecordId` | 记录身份。 |
| `snapshot_state_ref` | `ReferenceSnapshotStateRef` | 快照状态引用。 |
| `refresh_kind` | `ReferenceRefreshKind` | 刷新类别。 |
| `freshness_state` | `ReferenceFreshnessState` | 刷新后的 freshness。 |
| `gap_state_ref` | `Option<GapStateRef>` | 刷新导致的 gap。 |

| 状态 | 作用 |
|---|---|
| 不适用 | 记录对象不可变。 |

| 成员函数 | 作用 |
|---|---|
| `summarize()` | 输出引用刷新摘要。 |

| 工厂函数 | 作用 |
|---|---|
| `record_refresh(ReferenceSnapshotState snapshot_state, ReferenceRefreshKind refresh_kind)` | 记录引用刷新。 |

| 禁止事项 | 说明 |
|---|---|
| 不修复外部对象 | 只记录本仓 snapshot 观察结果。 |

---

## H11. `ProjectionMaintenanceRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived Maintenance and Replay Coordination` |
| 对象类型 | audit record / history record |
| 主要责任 | 记录 projection rebuild、read model refresh、rollup maintenance 等派生维护动作。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `ProjectionMaintenanceRecordId` | 记录身份。 |
| `maintenance_target_ref` | `MaintenanceTargetRef` | 维护目标。 |
| `maintenance_kind` | `ProjectionMaintenanceKind` | 维护类别。 |
| `maintenance_state` | `ProjectionMaintenanceLifecycleState` | 维护状态。 |
| `no_write_guard_result` | `NoWriteGuardResult` | no-write guard 判断结果。 |

| 状态 | 作用 |
|---|---|
| 不适用 | 记录对象不可变。 |

| 成员函数 | 作用 |
|---|---|
| `summarize()` | 输出维护摘要。 |

| 工厂函数 | 作用 |
|---|---|
| `record_maintenance(MaintenanceTargetRef target_ref, ProjectionMaintenanceKind maintenance_kind, NoWriteGuardResult guard_result)` | 记录派生维护。 |

| 禁止事项 | 说明 |
|---|---|
| 不代表 truth mutation | 派生维护记录不等于核心 truth 改写。 |

---

## H12. `GapScanRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived Maintenance and Replay Coordination` |
| 对象类型 | audit record / history record |
| 主要责任 | 记录 gap scan 的目标、发现、输出 gap 和扫描结果。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `GapScanRecordId` | 记录身份。 |
| `maintenance_target_ref` | `MaintenanceTargetRef` | 扫描目标。 |
| `discovered_gap_refs` | `GapStateRefSet` | 扫描发现的 gap。 |
| `scan_state` | `GapScanState` | 扫描状态。 |
| `scan_reason` | `GapScanReason` | 扫描原因。 |

| 状态 | 作用 |
|---|---|
| `Scheduled` / `Running` / `Completed` / `Failed` | 排期、运行、完成或失败。 |

| 成员函数 | 作用 |
|---|---|
| `attach_gap(GapState gap_state)` | 记录发现的 gap。 |
| `mark_failed(GapScanFailureReason reason)` | 记录扫描失败。 |

| 工厂函数 | 作用 |
|---|---|
| `start_scan(MaintenanceTargetRef target_ref, GapScanReason scan_reason)` | 建立 gap scan 记录。 |

| 禁止事项 | 说明 |
|---|---|
| 不自动关闭 gap | 扫描只发现和记录缺口。 |

---

## H13. `ReplayExecutionRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived Maintenance and Replay Coordination` |
| 对象类型 | audit record / history record |
| 主要责任 | 记录 replay 执行的 scope、状态、no-write guard、影响摘要和失败原因。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `ReplayExecutionRecordId` | 记录身份。 |
| `replay_scope_ref` | `ReplayScopeRef` | replay 范围。 |
| `coordination_state_ref` | `ReplayCoordinationStateRef` | 协调状态。 |
| `execution_state` | `ReplayExecutionState` | running、completed、failed、blocked 等状态。 |
| `impact_summary` | `ReplayImpactSummary` | observation-side 影响摘要。 |
| `no_write_guard_result` | `NoWriteGuardResult` | no-write guard 结果。 |

| 状态 | 作用 |
|---|---|
| `Scheduled` / `Running` / `Completed` / `Failed` / `Blocked` | 排期、运行、完成、失败或阻塞。 |

| 成员函数 | 作用 |
|---|---|
| `mark_running()` | 标记 replay 开始。 |
| `mark_completed(ReplayImpactSummary impact_summary)` | 记录完成与影响。 |
| `mark_failed(ReplayFailureReason reason)` | 记录失败。 |
| `mark_blocked(NoWriteViolation no_write_violation)` | 因 no-write 违例阻塞。 |

| 工厂函数 | 作用 |
|---|---|
| `record_execution(ReplayScope replay_scope, ReplayCoordinationState coordination_state, NoWriteGuardResult guard_result)` | 建立 replay 执行记录。 |

| 禁止事项 | 说明 |
|---|---|
| 不表示 source replay 成功 | 只记录本仓 observation-side replay。 |
| 不生成真实验收 evidence | replay execution record 不是验收证据。 |
