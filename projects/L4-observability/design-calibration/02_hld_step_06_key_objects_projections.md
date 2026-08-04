# Step 06 附录 C. Projection / Read Model 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 本文件只给概要骨架,不定义查询协议、索引结构或数据库表。

---

## V1. `IntakeStatusView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Observation Intake and Safety` |
| 对象类型 | projection / read model |
| 主要责任 | 为查询和诊断提供 observation intake 当前状态的只读视图。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_id` | `IntakeStatusViewId` | 视图身份。 |
| `receipt_ref` | `ObservationReceiptRef` | 回指准入事实。 |
| `admission_state` | `MaterialAdmissionState` | 展示当前准入状态。 |
| `safety_disposition_ref` | `SafetyDispositionRef` | 回指安全处置。 |
| `last_updated_at` | `ObservedAt` | 视图更新时间。 |

| 状态 | 作用 |
|---|---|
| `Fresh` / `Stale` / `Rebuilding` / `Unavailable` | 新鲜、过期、重建中或不可用。 |

| 成员函数 | 作用 |
|---|---|
| `refresh_from_receipt(ObservationReceipt receipt)` | 从准入事实刷新视图。 |
| `mark_stale(StalenessReason reason)` | 标记视图过期。 |

| 工厂函数 | 作用 |
|---|---|
| `from_receipt(ObservationReceipt receipt)` | 从 receipt 建立视图骨架。 |

| 禁止事项 | 说明 |
|---|---|
| 不修改 receipt | 视图只能读取和重建。 |

---

## V2. `SafeSignalProjectionView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Correlation and Safe Signal` |
| 对象类型 | projection / read model |
| 主要责任 | 提供 safe log / metric / trace 的只读投影视图,供诊断、查询和外围消费使用。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_id` | `SafeSignalProjectionViewId` | 视图身份。 |
| `safe_signal_ref` | `SafeSignalRef` | 回指安全信号。 |
| `correlation_context_ref` | `CorrelationContextRef` | 关联语境。 |
| `signal_kind` | `SafeSignalKind` | signal 类型。 |
| `degraded_output_state` | `Option<DegradedOutputState>` | 输出是否降级。 |

| 状态 | 作用 |
|---|---|
| `Fresh` / `Stale` / `Rebuilding` / `Suppressed` | 视图新鲜、过期、重建中或被抑制。 |

| 成员函数 | 作用 |
|---|---|
| `refresh_from_signal(SafeSignal signal)` | 从 safe signal 刷新。 |
| `suppress(DegradedOutputState degraded_output_state)` | 因安全或降级抑制输出。 |

| 工厂函数 | 作用 |
|---|---|
| `from_signal(SafeSignal signal)` | 从安全信号建立视图。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 raw log / metric / trace | 只保存安全摘要和引用。 |

---

## V3. `SignalRollupView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Correlation and Safe Signal` |
| 对象类型 | projection / read model |
| 主要责任 | 表达 safe signal 在指定窗口上的聚合观察结果,供 query / diagnostic / report 使用。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_id` | `SignalRollupViewId` | rollup 视图身份。 |
| `rollup_window_ref` | `SignalRollupWindowRef` | 回指聚合窗口。 |
| `rollup_kind` | `SignalRollupKind` | 聚合类别。 |
| `rollup_state` | `RollupViewState` | fresh、stale 或 rebuilding。 |
| `safe_label_set` | `SafeLabelSet` | 安全 label 集合。 |

| 状态 | 作用 |
|---|---|
| `Fresh` / `Stale` / `Rebuilding` / `Unavailable` | 可用、过期、重建中或不可用。 |

| 成员函数 | 作用 |
|---|---|
| `refresh(SignalRollupWindow rollup_window)` | 从窗口刷新 rollup。 |
| `mark_rebuilding(RollupRebuildState rebuild_state)` | 标记重建中。 |

| 工厂函数 | 作用 |
|---|---|
| `for_window(SignalRollupWindow rollup_window, SignalRollupKind rollup_kind)` | 为窗口建立 rollup view。 |

| 禁止事项 | 说明 |
|---|---|
| 不表达业务状态 truth | rollup 是观察面聚合。 |

---

## V4. `AuditTimelineView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Audit Projection and Body-free Evidence Linkage` |
| 对象类型 | projection / read model |
| 主要责任 | 把 audit projection 按时间和关联语境组织成可读追溯视图。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_id` | `AuditTimelineViewId` | 时间线视图身份。 |
| `audit_projection_refs` | `AuditProjectionRefSet` | 参与时间线的 audit projection。 |
| `time_window` | `AuditTimelineWindow` | 追溯时间范围。 |
| `visibility_state` | `ReadVisibilityState` | 当前消费者可见性。 |
| `gap_state_refs` | `GapStateRefSet` | 时间线中的缺口。 |

| 状态 | 作用 |
|---|---|
| `Fresh` / `Partial` / `Restricted` / `Rebuilding` | 完整、部分、受限或重建中。 |

| 成员函数 | 作用 |
|---|---|
| `append_projection(AuditProjection audit_projection)` | 追加 audit projection。 |
| `restrict(ReadVisibilityState visibility_state)` | 按可见性限制时间线。 |

| 工厂函数 | 作用 |
|---|---|
| `build(AuditProjectionRefSet projection_refs, AuditTimelineWindow time_window)` | 构建审计时间线视图。 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 source audit truth | 时间线只读展示本仓审计投影。 |

---

## V5. `EvidenceIndexInputView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Audit Projection and Body-free Evidence Linkage` / `Report Handoff and Authenticity` |
| 对象类型 | projection / read model |
| 主要责任 | 为 report handoff 提供 body-free evidence index 输入,包含引用、摘要、缺口和真实性提示输入。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_id` | `EvidenceIndexInputViewId` | evidence index 输入视图身份。 |
| `evidence_linkage_refs` | `EvidenceLinkageRefSet` | 参与交接的证据关联。 |
| `audit_projection_refs` | `AuditProjectionRefSet` | 相关审计投影。 |
| `gap_state_refs` | `GapStateRefSet` | 关联缺口。 |
| `visibility_state` | `ReadVisibilityState` | 对目标消费者的可见性。 |

| 状态 | 作用 |
|---|---|
| `Ready` / `Partial` / `Blocked` / `Rebuilding` | 可交接、部分、阻塞或重建中。 |

| 成员函数 | 作用 |
|---|---|
| `include_linkage(EvidenceLinkage linkage)` | 纳入 body-free linkage。 |
| `attach_gap(GapState gap_state)` | 纳入缺口说明。 |
| `block(HandoffBlockReason reason)` | 阻止交接输入。 |

| 工厂函数 | 作用 |
|---|---|
| `from_audit_projection(AuditProjection audit_projection, ReportConsumerRef consumer_ref)` | 从审计投影和消费者建立 evidence index 输入。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 evidence body | 只允许 body-free 引用和摘要。 |
| 不生成最终验收结论 | 只提供交接输入。 |

---

## V6. `ObservationReadModel`

| 项 | 内容 |
|---|---|
| 所属部分 | `Read Query and Diagnostic Consumption` |
| 对象类型 | projection / read model |
| 主要责任 | 提供安全观察面的 canonical 只读模型,支撑 SDK / console / source owner / runtime / audit 查询。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `read_model_id` | `ObservationReadModelId` | 读模型身份。 |
| `receipt_refs` | `ObservationReceiptRefSet` | 准入事实引用。 |
| `signal_view_refs` | `SafeSignalProjectionViewRefSet` | safe signal 视图引用。 |
| `audit_view_refs` | `AuditTimelineViewRefSet` | audit 视图引用。 |
| `read_visibility_state` | `ReadVisibilityState` | 对当前消费者的可见性。 |

| 状态 | 作用 |
|---|---|
| `Fresh` / `Stale` / `Rebuilding` / `Unavailable` | 新鲜、过期、重建中或不可用。 |

| 成员函数 | 作用 |
|---|---|
| `refresh_from_truth(ProjectionMaintenanceState maintenance_state)` | 从核心 truth 刷新读模型。 |
| `restrict(ReadVisibilityState visibility_state)` | 按可见性限制输出。 |
| `mark_stale(StalenessReason reason)` | 标记读模型过期。 |

| 工厂函数 | 作用 |
|---|---|
| `build(ReadModelScope read_model_scope)` | 为查询范围建立读模型。 |

| 禁止事项 | 说明 |
|---|---|
| 不作为第二 observation truth | 读模型可重建、可延迟、只读。 |

---

## V7. `DiagnosticView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Read Query and Diagnostic Consumption` |
| 对象类型 | projection / read model |
| 主要责任 | 对外展示 explain-only 诊断摘要、gap、correlation 和 no-write 线索。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_id` | `DiagnosticViewId` | 诊断视图身份。 |
| `diagnostic_summary_ref` | `DiagnosticSummaryRef` | 回指诊断摘要。 |
| `diagnostic_scope_ref` | `DiagnosticScopeRef` | 回指诊断范围。 |
| `read_visibility_state` | `ReadVisibilityState` | 可见性结果。 |
| `gap_state_refs` | `GapStateRefSet` | 关联缺口。 |

| 状态 | 作用 |
|---|---|
| `Fresh` / `Partial` / `Stale` / `Unavailable` | 新鲜、部分、过期或不可用。 |

| 成员函数 | 作用 |
|---|---|
| `refresh(DiagnosticSummary summary)` | 从诊断摘要刷新视图。 |
| `mark_partial(GapState gap_state)` | 因缺口标记 partial。 |
| `hide(ReadVisibilityState read_visibility_state)` | 根据可见性隐藏或降级。 |

| 工厂函数 | 作用 |
|---|---|
| `from_summary(DiagnosticSummary summary, DiagnosticScope scope)` | 从诊断摘要和范围建立视图。 |

| 禁止事项 | 说明 |
|---|---|
| 不下发控制命令 | 诊断视图只解释事实。 |

---

## V8. `GapStatusView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Gap and Degraded Expression` |
| 对象类型 | projection / read model |
| 主要责任 | 为 read、handoff、diagnostic 和 peripheral 提供统一 gap / degraded 状态读侧。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_id` | `GapStatusViewId` | gap 视图身份。 |
| `gap_state_refs` | `GapStateRefSet` | 缺口集合。 |
| `degraded_output_state_refs` | `DegradedOutputStateRefSet` | 降级输出状态集合。 |
| `affected_object_refs` | `AffectedObservationObjectRefSet` | 受影响对象集合。 |
| `last_updated_at` | `ObservedAt` | 更新时间。 |

| 状态 | 作用 |
|---|---|
| `Clear` / `OpenGaps` / `Degraded` / `Blocked` | 无缺口、有缺口、降级或阻塞。 |

| 成员函数 | 作用 |
|---|---|
| `refresh_from_gap(GapState gap_state)` | 从 gap 更新视图。 |
| `mark_blocked(DegradedOutputState state)` | 标记阻塞。 |

| 工厂函数 | 作用 |
|---|---|
| `for_scope(GapViewScope gap_view_scope)` | 为指定范围建立 gap 视图。 |

| 禁止事项 | 说明 |
|---|---|
| 不隐藏缺口 | 空结果不能代替 gap。 |

---

## V9. `DashboardAlertExportView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Peripheral Consumption and Export` |
| 对象类型 | projection / read model |
| 主要责任 | 为 dashboard、alert、management report、analysis 和 export 提供统一外围只读视图。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_id` | `DashboardAlertExportViewId` | 外围视图身份。 |
| `consumer_ref` | `PeripheralConsumerRef` | 消费者引用。 |
| `read_model_ref` | `ObservationReadModelRef` | 观察读模型引用。 |
| `diagnostic_view_ref` | `Option<DiagnosticViewRef>` | 诊断视图引用。 |
| `gap_status_view_ref` | `Option<GapStatusViewRef>` | 缺口视图引用。 |

| 状态 | 作用 |
|---|---|
| `Fresh` / `Stale` / `Suppressed` / `Unavailable` | 新鲜、过期、被抑制或不可用。 |

| 成员函数 | 作用 |
|---|---|
| `refresh(ObservationReadModel read_model)` | 从观察读模型刷新。 |
| `suppress(PeripheralExportPolicy policy)` | 因外围策略抑制输出。 |

| 工厂函数 | 作用 |
|---|---|
| `for_consumer(PeripheralConsumerRef consumer_ref, ObservationReadModel read_model)` | 为外围消费者建立视图。 |

| 禁止事项 | 说明 |
|---|---|
| 不绑定 dashboard 产品 | 视图是产品中立只读面。 |
| 不反写核心 truth | 外围读侧不可写入。 |

---

## V10. `ReferenceSnapshotView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Product-neutral Adapter and Reference Support` |
| 对象类型 | projection / read model |
| 主要责任 | 展示外部引用快照的 freshness、resolution、safe summary 和 gap 状态。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_id` | `ReferenceSnapshotViewId` | 快照视图身份。 |
| `snapshot_state_refs` | `ReferenceSnapshotStateRefSet` | 快照状态集合。 |
| `freshness_summary` | `ReferenceFreshnessSummary` | freshness 摘要。 |
| `gap_state_refs` | `GapStateRefSet` | 引用缺口集合。 |
| `last_refresh_record_ref` | `Option<ReferenceRefreshRecordRef>` | 最近刷新记录。 |

| 状态 | 作用 |
|---|---|
| `Fresh` / `Stale` / `Unresolved` / `Invalid` | 快照可用、过期、不可解析或无效。 |

| 成员函数 | 作用 |
|---|---|
| `refresh(ReferenceSnapshotState snapshot_state)` | 从快照状态刷新视图。 |
| `attach_gap(GapState gap_state)` | 绑定引用缺口。 |

| 工厂函数 | 作用 |
|---|---|
| `from_snapshot_state(ReferenceSnapshotState snapshot_state)` | 从快照状态建立视图。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存外部正文 | 只展示 safe summary 和状态。 |

---

## V11. `RebuildProgressView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived Maintenance and Replay Coordination` |
| 对象类型 | projection / read model |
| 主要责任 | 为 projection rebuild、rollup rebuild、gap scan 和 replay 提供只读进度解释。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_id` | `RebuildProgressViewId` | 进度视图身份。 |
| `maintenance_state_ref` | `ProjectionMaintenanceStateRef` | 投影维护状态引用。 |
| `replay_coordination_state_ref` | `Option<ReplayCoordinationStateRef>` | replay 协调状态引用。 |
| `rollup_rebuild_state_ref` | `Option<RollupRebuildStateRef>` | rollup 重建状态引用。 |
| `progress_summary` | `MaintenanceProgressSummary` | 进度摘要。 |

| 状态 | 作用 |
|---|---|
| `Queued` / `Running` / `Failed` / `Completed` / `Blocked` | 排队、执行、失败、完成或阻塞。 |

| 成员函数 | 作用 |
|---|---|
| `refresh_from_maintenance(ProjectionMaintenanceState state)` | 从维护状态刷新。 |
| `attach_replay(ReplayCoordinationState state)` | 关联 replay 协调状态。 |
| `mark_blocked(ReplayBlockReason reason)` | 标记阻塞。 |

| 工厂函数 | 作用 |
|---|---|
| `for_maintenance(ProjectionMaintenanceState state)` | 为维护状态建立进度视图。 |

| 禁止事项 | 说明 |
|---|---|
| 不代表 source repair progress | 进度只解释 observation / derived side。 |
