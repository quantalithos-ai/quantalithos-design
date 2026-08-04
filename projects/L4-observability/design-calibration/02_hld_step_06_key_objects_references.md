# Step 06 附录 D. Reference / Boundary / Context 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 本文件只给概要骨架,不定义外部协议、adapter trait 或 repository。

---

## R1. `ObservationSourceRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `Observation Intake and Safety` |
| 对象类型 | reference object |
| 主要责任 | 表达 observation material 的来源引用,用于说明 source owner、bus material、source event 或外部安全摘要。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `source_ref_id` | `ObservationSourceRefId` | 来源引用身份。 |
| `source_family` | `ObservationSourceFamily` | 来源家族,如 bus、source owner、runtime、sandbox。 |
| `source_object_ref` | `ExternalObjectRef` | 外部对象安全引用。 |
| `source_summary_ref` | `Option<SafeExternalSummaryRef>` | 可用于观察解释的安全摘要。 |
| `resolution_state` | `ReferenceSnapshotStateRef` | 来源引用可解析性。 |

| 状态 | 作用 |
|---|---|
| `Resolved` / `Unresolved` / `Stale` / `Invalid` | 已解析、不可解析、过期或无效。 |

| 成员函数 | 作用 |
|---|---|
| `resolve(ReferenceSnapshotState snapshot_state)` | 绑定解析状态。 |
| `mark_unresolved(ReferenceResolutionReason reason)` | 标记不可解析。 |

| 工厂函数 | 作用 |
|---|---|
| `from_external_ref(ObservationSourceFamily source_family, ExternalObjectRef source_object_ref)` | 从外部安全引用建立来源对象。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 source body | 只保存安全引用和摘要。 |
| 不拥有 bus truth | bus 投递主干不归本仓。 |

---

## R2. `RuntimeSandboxSignalRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `Correlation and Safe Signal` |
| 对象类型 | reference object |
| 主要责任 | 表达 runtime / sandbox 侧安全观察来源,为 `SafeSignal` 提供来源语境。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `runtime_signal_ref_id` | `RuntimeSandboxSignalRefId` | runtime / sandbox signal 引用身份。 |
| `runtime_scope_ref` | `RuntimeScopeRef` | runtime 范围引用。 |
| `sandbox_scope_ref` | `Option<SandboxScopeRef>` | sandbox 范围引用。 |
| `safe_signal_summary_ref` | `SafeSignalSummaryRef` | 安全 signal 摘要。 |
| `execution_truth_boundary` | `ExecutionTruthBoundaryMarker` | 明确不拥有 execution truth。 |

| 状态 | 作用 |
|---|---|
| `Available` / `Degraded` / `Missing` / `NotVisible` | 可用、降级、缺失或不可见。 |

| 成员函数 | 作用 |
|---|---|
| `mark_degraded(DegradationReason reason)` | 标记 runtime / sandbox signal 降级。 |
| `mark_missing(GapState gap_state)` | 绑定缺失状态。 |

| 工厂函数 | 作用 |
|---|---|
| `from_safe_summary(RuntimeScopeRef runtime_scope_ref, SafeSignalSummaryRef safe_signal_summary_ref)` | 从 runtime 安全摘要建立引用。 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有 tool result body | 只保存 safe summary。 |
| 不裁决执行状态 | execution truth 归 runtime / sandbox。 |

---

## R3. `ReportConsumerRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `Report Handoff and Authenticity` |
| 对象类型 | reference object |
| 主要责任 | 表达 report、acceptance、archive 或 external audit 消费边界,用于 handoff readiness 和交付记录。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `report_consumer_ref_id` | `ReportConsumerRefId` | 消费方引用身份。 |
| `consumer_kind` | `ReportConsumerKind` | 消费方类别。 |
| `consumer_scope` | `ConsumerScope` | 消费方可见范围。 |
| `handoff_purpose` | `HandoffPurpose` | 交接目的。 |
| `boundary_state` | `ConsumerBoundaryState` | 消费边界状态。 |

| 状态 | 作用 |
|---|---|
| `Active` / `Pending` / `Blocked` / `Retired` | 可交接、待确认、阻塞或退役。 |

| 成员函数 | 作用 |
|---|---|
| `block(HandoffBlockReason reason)` | 标记消费边界阻塞。 |
| `retire(ConsumerRetireReason reason)` | 标记消费边界退出。 |

| 工厂函数 | 作用 |
|---|---|
| `for_consumer(ReportConsumerKind consumer_kind, ConsumerScope consumer_scope, HandoffPurpose purpose)` | 建立交接消费者引用。 |

| 禁止事项 | 说明 |
|---|---|
| 不生成最终 verdict | 消费边界不能生成验收结论。 |

---

## R4. `ProtectedObservationRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `Retention, Replay and No-write Guard` |
| 对象类型 | reference object |
| 主要责任 | 表达被 retention、active reference protection 或 replay 保护的 observation-side 对象引用。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `protected_observation_ref_id` | `ProtectedObservationRefId` | 受保护引用身份。 |
| `observation_object_ref` | `ObservationObjectRef` | 被保护对象。 |
| `protection_scope` | `ProtectionScope` | 保护范围。 |
| `retention_marker_ref` | `Option<RetentionMarkerRef>` | 关联留存标记。 |

| 状态 | 作用 |
|---|---|
| `Protected` / `ReleaseCandidate` / `Released` / `Invalid` | 受保护、待释放、已释放或无效。 |

| 成员函数 | 作用 |
|---|---|
| `attach_marker(RetentionMarker marker)` | 绑定留存标记。 |
| `mark_release_candidate(RetentionReleaseReason reason)` | 标记待释放。 |

| 工厂函数 | 作用 |
|---|---|
| `protect(ObservationObjectRef observation_object_ref, ProtectionScope protection_scope)` | 建立受保护 observation 引用。 |

| 禁止事项 | 说明 |
|---|---|
| 不指向 source truth body | 只能保护 observation-side 对象。 |

---

## R5. `DiagnosticRequestContext`

| 项 | 内容 |
|---|---|
| 所属部分 | `Read Query and Diagnostic Consumption` |
| 对象类型 | context object |
| 主要责任 | 表达一次只读查询或诊断请求的 actor、scope、purpose、visibility 和 no-write 审计语境。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `request_context_id` | `DiagnosticRequestContextId` | 请求语境身份。 |
| `actor_ref` | `ActorSafeRef` | 读取主体安全引用。 |
| `diagnostic_scope_ref` | `Option<DiagnosticScopeRef>` | 诊断范围。 |
| `read_purpose` | `ReadPurpose` | 读取目的。 |
| `no_write_guard_scope` | `NoWriteGuardScope` | no-write guard 适用范围。 |

| 状态 | 作用 |
|---|---|
| `Ready` / `Restricted` / `Blocked` / `Invalid` | 可读取、受限、阻塞或无效。 |

| 成员函数 | 作用 |
|---|---|
| `restrict(ReadVisibilityState read_visibility_state)` | 按可见性限制请求。 |
| `block(NoWriteViolation violation)` | 因 no-write 违例阻塞。 |

| 工厂函数 | 作用 |
|---|---|
| `for_read(ActorSafeRef actor_ref, ReadPurpose read_purpose, ConsumerScope consumer_scope)` | 建立读取请求语境。 |

| 禁止事项 | 说明 |
|---|---|
| 不承载写命令 | 请求语境只用于只读和审计。 |

---

## R6. `GapSourceRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `Gap and Degraded Expression` |
| 对象类型 | reference object |
| 主要责任 | 让 gap 能回指缺失、不可见或不可解析的来源,但不吸收该来源正文或 truth。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `gap_source_ref_id` | `GapSourceRefId` | gap 来源引用身份。 |
| `source_kind` | `GapSourceKind` | 缺口来源类型。 |
| `source_ref` | `ExternalObjectRef` | 外部对象安全引用。 |
| `visibility_constraint_ref` | `Option<VisibilityConstraintRef>` | 可见性约束。 |

| 状态 | 作用 |
|---|---|
| `Known` / `Unknown` / `NotVisible` / `Unresolved` | 已知、未知、不可见或不可解析。 |

| 成员函数 | 作用 |
|---|---|
| `mark_not_visible(VisibilityConstraintRef constraint_ref)` | 标记不可见。 |
| `mark_unresolved(ReferenceResolutionReason reason)` | 标记不可解析。 |

| 工厂函数 | 作用 |
|---|---|
| `from_source(GapSourceKind source_kind, ExternalObjectRef source_ref)` | 建立 gap 来源引用。 |

| 禁止事项 | 说明 |
|---|---|
| 不修复来源 | gap source 只用于解释缺口。 |

---

## R7. `PeripheralConsumerRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `Peripheral Consumption and Export` |
| 对象类型 | reference object |
| 主要责任 | 表达 dashboard、alert、management report、GRC export 或 anomaly analysis 的外围消费边界。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `peripheral_consumer_ref_id` | `PeripheralConsumerRefId` | 消费方引用身份。 |
| `consumer_kind` | `PeripheralConsumerKind` | dashboard、alert、GRC、analysis 等类别。 |
| `consumer_scope` | `ConsumerScope` | 消费范围。 |
| `export_allowed` | `ExportAllowedFlag` | 是否允许导出。 |
| `consumer_state` | `PeripheralConsumerState` | 消费边界状态。 |

| 状态 | 作用 |
|---|---|
| `Active` / `Limited` / `Blocked` / `Retired` | 活跃、受限、阻塞或退役。 |

| 成员函数 | 作用 |
|---|---|
| `limit(ConsumerLimitReason reason)` | 限制消费范围。 |
| `block(PeripheralBlockReason reason)` | 阻塞消费。 |

| 工厂函数 | 作用 |
|---|---|
| `for_kind(PeripheralConsumerKind consumer_kind, ConsumerScope consumer_scope)` | 建立外围消费者引用。 |

| 禁止事项 | 说明 |
|---|---|
| 不反向定义 truth | 消费方状态不能改变 observation truth。 |

---

## R8. `SubjectObservationReference`

| 项 | 内容 |
|---|---|
| 所属部分 | `Product-neutral Adapter and Reference Support` |
| 对象类型 | reference object |
| 主要责任 | 表达 actor、subject、governed entity 或观察主体的安全引用,用于审计和诊断解释。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `subject_observation_reference_id` | `SubjectObservationReferenceId` | 主体引用身份。 |
| `subject_kind` | `ObservationSubjectKind` | actor、subject、domain owner 等主体类别。 |
| `subject_safe_ref` | `SubjectSafeRef` | 上游安全引用。 |
| `identity_boundary_marker` | `IdentityBoundaryMarker` | 明确不拥有 identity truth。 |
| `snapshot_state_ref` | `ReferenceSnapshotStateRef` | 主体引用 freshness 状态。 |

| 状态 | 作用 |
|---|---|
| `Resolved` / `Stale` / `NotVisible` / `Invalid` | 已解析、过期、不可见或无效。 |

| 成员函数 | 作用 |
|---|---|
| `refresh(ReferenceSnapshotState snapshot_state)` | 刷新主体引用状态。 |
| `mark_not_visible(VisibilityConstraintRef constraint_ref)` | 标记不可见。 |

| 工厂函数 | 作用 |
|---|---|
| `from_safe_ref(ObservationSubjectKind subject_kind, SubjectSafeRef subject_safe_ref)` | 从安全主体引用建立对象。 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有 identity lifecycle | 只保存 safe ref 和 snapshot 状态。 |

---

## R9. `GovernanceArtifactEvidenceReference`

| 项 | 内容 |
|---|---|
| 所属部分 | `Audit Projection and Body-free Evidence Linkage` / `Product-neutral Adapter and Reference Support` |
| 对象类型 | reference object |
| 主要责任 | 统一表达 governance、artifact、evidence、baseline 和完整性线索的 body-free 跨域引用。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `boundary_ref_id` | `GovernanceArtifactEvidenceReferenceId` | 跨域引用身份。 |
| `reference_family` | `GovernanceArtifactEvidenceFamily` | governance、artifact、evidence 或 baseline 类别。 |
| `external_safe_ref` | `ExternalObjectRef` | 外部对象安全引用。 |
| `digest_summary` | `Option<DigestSummary>` | 可选完整性摘要。 |
| `reference_snapshot_state_ref` | `ReferenceSnapshotStateRef` | 引用 freshness / resolution 状态。 |

| 状态 | 作用 |
|---|---|
| `Linked` / `Missing` / `NotVisible` / `Invalid` | 已关联、缺失、不可见或无效。 |

| 成员函数 | 作用 |
|---|---|
| `attach_digest(DigestSummary digest_summary)` | 绑定 body-free 摘要。 |
| `mark_missing(GapState gap_state)` | 标记缺失。 |
| `mark_not_visible(EvidenceVisibilityReason reason)` | 标记不可见。 |

| 工厂函数 | 作用 |
|---|---|
| `from_external_ref(GovernanceArtifactEvidenceFamily family, ExternalObjectRef external_safe_ref)` | 从外部安全引用建立 body-free reference。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 governance / artifact / evidence 正文 | 只保存 ref、digest 和可见性。 |
| 不拥有 artifact lineage truth | 只引用外部 truth。 |

---

## R10. `RuntimeSandboxSummaryRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `Product-neutral Adapter and Reference Support` |
| 对象类型 | reference object |
| 主要责任 | 表达 runtime / sandbox 侧安全摘要和观察来源,供 signal、diagnostic 和 gap 使用。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `runtime_sandbox_summary_ref_id` | `RuntimeSandboxSummaryRefId` | 摘要引用身份。 |
| `runtime_scope_ref` | `RuntimeScopeRef` | runtime 范围。 |
| `sandbox_scope_ref` | `Option<SandboxScopeRef>` | sandbox 范围。 |
| `safe_summary_ref` | `SafeExternalSummaryRef` | 安全摘要引用。 |
| `execution_boundary_marker` | `ExecutionTruthBoundaryMarker` | 不拥有 execution truth 的边界标记。 |

| 状态 | 作用 |
|---|---|
| `Available` / `Stale` / `Missing` / `Blocked` | 可用、过期、缺失或阻塞。 |

| 成员函数 | 作用 |
|---|---|
| `mark_stale(ReferenceStaleReason reason)` | 标记过期。 |
| `mark_missing(GapState gap_state)` | 标记缺失。 |

| 工厂函数 | 作用 |
|---|---|
| `from_safe_summary(RuntimeScopeRef runtime_scope_ref, SafeExternalSummaryRef safe_summary_ref)` | 从 runtime 安全摘要建立引用。 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 provider response body | 只引用安全摘要。 |

---

## R11. `ArchiveReportHandoffRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `Product-neutral Adapter and Reference Support` |
| 对象类型 | reference object |
| 主要责任 | 表达 archive、report、external audit 或 acceptance handoff 的边界引用。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `archive_report_handoff_ref_id` | `ArchiveReportHandoffRefId` | 交接引用身份。 |
| `handoff_family` | `ArchiveReportHandoffFamily` | archive、report、external audit 或 acceptance 类别。 |
| `consumer_ref` | `ReportConsumerRef` | 消费方引用。 |
| `handoff_record_ref` | `Option<ReportHandoffRecordRef>` | 关联交接事实。 |
| `archive_boundary_marker` | `ArchiveBoundaryMarker` | 不拥有 archive package 的边界标记。 |

| 状态 | 作用 |
|---|---|
| `Pending` / `Ready` / `Blocked` / `Delivered` / `Failed` | 待处理、可交接、阻塞、已交付或失败。 |

| 成员函数 | 作用 |
|---|---|
| `attach_handoff(ReportHandoffRecord handoff_record)` | 绑定交接事实。 |
| `block(HandoffBlockReason reason)` | 标记阻塞。 |
| `mark_delivered(HandoffLifecycleRecord lifecycle_record)` | 标记已交付。 |

| 工厂函数 | 作用 |
|---|---|
| `for_consumer(ArchiveReportHandoffFamily family, ReportConsumerRef consumer_ref)` | 为消费边界建立 handoff ref。 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有 archive package | 只交接引用和状态。 |
| 不生成验收签署 | 只表达 handoff 边界。 |

---

## R12. `MaintenanceTargetRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived Maintenance and Replay Coordination` |
| 对象类型 | reference object |
| 主要责任 | 表达 projection maintenance、reference refresh、gap scan、rollup rebuild 或 replay 的目标范围。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `maintenance_target_ref_id` | `MaintenanceTargetRefId` | 维护目标引用身份。 |
| `target_kind` | `MaintenanceTargetKind` | projection、reference、gap、rollup、replay 等类型。 |
| `target_object_ref` | `ObservationObjectRef` | observation-side 目标对象。 |
| `allowed_effect` | `MaintenanceAllowedEffect` | 允许影响范围。 |
| `no_write_guard_scope` | `NoWriteGuardScope` | no-write guard 范围。 |

| 状态 | 作用 |
|---|---|
| `Eligible` / `Blocked` / `Running` / `Completed` / `Invalid` | 可维护、阻塞、执行中、完成或无效。 |

| 成员函数 | 作用 |
|---|---|
| `block(MaintenanceBlockReason reason)` | 阻塞维护目标。 |
| `mark_running(ProjectionMaintenanceRecord maintenance_record)` | 标记执行中。 |
| `mark_completed(ProjectionMaintenanceRecord maintenance_record)` | 标记完成。 |

| 工厂函数 | 作用 |
|---|---|
| `for_object(MaintenanceTargetKind target_kind, ObservationObjectRef target_object_ref, MaintenanceAllowedEffect allowed_effect)` | 建立维护目标引用。 |

| 禁止事项 | 说明 |
|---|---|
| 不指向 source truth 修复目标 | 维护目标只能是 observation-side 或 derived-side 对象。 |
