# Step 06 附录 A2. Guard / Consumption / Maintenance 状态对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 本文件只给概要骨架,不定义完整对象契约。

---

## B1. `RetentionMarker`

#### B1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Retention, Replay and No-write Guard` |
| 对象类型 | domain aggregate |
| 主要责任 | 表达观察材料在本仓内的 hold、release、conflict、archive eligibility 和留存生命周期事实。 |

#### B1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `retention_marker_id` | `RetentionMarkerId` | 留存标记身份。 |
| `protected_observation_ref` | `ProtectedObservationRef` | 回指受保护观察材料。 |
| `retention_state` | `RetentionMarkerState` | 表达 hold、release、conflict 或 archive eligible。 |
| `active_protection_ref` | `Option<ActiveReferenceProtectionRef>` | 关联活动引用保护。 |
| `archive_eligibility_ref` | `Option<ArchiveEligibilityRef>` | 记录可归档线索,但不拥有 archive package。 |

#### B1.3 状态集合

| 状态 | 作用 |
|---|---|
| `Hold` | 材料必须保留。 |
| `ReleaseCandidate` | 可进入释放评估。 |
| `Conflict` | 留存与活动引用或交接存在冲突。 |
| `ArchiveEligible` | 可交给 archive 边界继续处理。 |
| `Released` | 本仓留存保护已解除。 |

#### B1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `place_hold(ActiveReferenceProtection protection, ActorContext actor)` | 建立 hold 并绑定活动引用保护。 |
| `mark_release_candidate(RetentionReleaseReason reason, ActorContext actor)` | 标记可释放候选。 |
| `mark_conflict(RetentionConflictReason reason)` | 显式记录留存冲突。 |
| `mark_archive_eligible(ArchiveEligibilityRef archive_eligibility_ref)` | 输出 archive eligibility 线索。 |

#### B1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `for_observation(ProtectedObservationRef protected_observation_ref, RetentionPurpose purpose)` | 为观察材料建立留存标记骨架。 |

#### B1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不删除 source truth | 留存标记只能作用于观察面材料。 |
| 不拥有 archive package | 只能输出 archive eligibility 线索。 |

---

## B2. `ActiveReferenceProtection`

#### B2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Retention, Replay and No-write Guard` |
| 对象类型 | domain entity |
| 主要责任 | 表达观察材料仍被审计、诊断、报告、留存或 replay 语境引用时的保护事实。 |

#### B2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `active_reference_protection_id` | `ActiveReferenceProtectionId` | 活动引用保护身份。 |
| `protected_observation_ref` | `ProtectedObservationRef` | 受保护材料引用。 |
| `protection_reason` | `ActiveProtectionReason` | 表达保护原因。 |
| `protection_state` | `ActiveReferenceProtectionState` | 表达 active、released 或 conflicted。 |
| `consumer_refs` | `ObservationConsumerRefSet` | 记录仍在引用该材料的消费者。 |

#### B2.3 状态集合

| 状态 | 作用 |
|---|---|
| `Active` | 当前仍需保护。 |
| `Conflicted` | 引用保护与清理 / 归档发生冲突。 |
| `PendingRelease` | 等待释放条件闭合。 |
| `Released` | 活动引用保护已解除。 |

#### B2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `attach_consumer(ObservationConsumerRef consumer_ref)` | 添加仍在引用材料的消费者。 |
| `mark_conflict(ProtectionConflictReason reason)` | 显式记录冲突。 |
| `request_release(RetentionReleaseReason reason, ActorContext actor)` | 进入释放评估。 |
| `release(ActorContext actor)` | 在无活动引用后解除保护。 |

#### B2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `protect(ProtectedObservationRef protected_observation_ref, ActiveProtectionReason protection_reason)` | 从受保护材料和原因建立保护事实。 |

#### B2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不绕过合法引用 | 任一合法引用未解除时不能释放。 |
| 不修复外部引用 | 只能记录保护事实,不能修复 source truth。 |

---

## B3. `ReplayScope`

#### B3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Retention, Replay and No-write Guard` |
| 对象类型 | value object |
| 主要责任 | 表达 observation replay / rebuild 的目标范围、允许影响和禁止写源边界。 |

#### B3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `replay_scope_id` | `ReplayScopeId` | replay scope 身份。 |
| `target_refs` | `ReplayTargetRefSet` | replay / rebuild 目标集合。 |
| `allowed_effect` | `ReplayAllowedEffect` | 限定允许影响 observation side 或 derived side。 |
| `scope_state` | `ReplayScopeState` | 表达 draft、approved、blocked 或 closed。 |
| `no_write_guard_ref` | `NoWriteGuardPolicyRef` | 回指 no-write 防线。 |

#### B3.3 状态集合

| 状态 | 作用 |
|---|---|
| `Draft` | 范围仍在准备。 |
| `Approved` | 范围已可用于 replay 协调。 |
| `Blocked` | 因 no-write、retention 或引用冲突被阻塞。 |
| `Closed` | replay scope 已结束。 |

#### B3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `approve(NoWriteGuardPolicy no_write_guard_policy, ActorContext actor)` | 在 no-write 防线闭合后批准范围。 |
| `block(ReplayBlockReason reason)` | 阻断越界 replay。 |
| `narrow_to(MaintenanceTargetRef maintenance_target_ref)` | 缩小 replay 范围。 |
| `close(ReplayCloseReason reason)` | 关闭 replay scope。 |

#### B3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `define(ReplayTargetRefSet target_refs, ReplayAllowedEffect allowed_effect)` | 定义 replay 范围骨架。 |

#### B3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不修复 source truth | replay 只能影响 observation / derived material。 |
| 不绕过 retention marker | 活动引用或 hold 未闭合时不能执行。 |

---

## B4. `NoWriteViolation`

#### B4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Retention, Replay and No-write Guard` |
| 对象类型 | domain entity |
| 主要责任 | 表达 query、diagnostic、maintenance、rebuild、report handoff 或 export 尝试写入 source truth 的违例事实。 |

#### B4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `no_write_violation_id` | `NoWriteViolationId` | 违例身份。 |
| `trigger_context_ref` | `NoWriteTriggerContextRef` | 回指触发语境。 |
| `attempted_write_target` | `ForbiddenWriteTargetRef` | 表达被禁止的写入目标。 |
| `violation_state` | `NoWriteViolationState` | 表达 detected、blocked、recorded 或 closed。 |
| `violation_record_ref` | `NoWriteViolationRecordRef` | 回指审计记录。 |

#### B4.3 状态集合

| 状态 | 作用 |
|---|---|
| `Detected` | 已发现可疑写源尝试。 |
| `Blocked` | 已阻止写源动作。 |
| `Recorded` | 已形成可审计记录。 |
| `Closed` | 违例处理语境已关闭。 |

#### B4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `block(NoWriteGuardPolicy policy, ActorContext actor)` | 根据 no-write policy 阻止写源。 |
| `record(NoWriteViolationRecord violation_record)` | 绑定可审计记录。 |
| `close(NoWriteCloseReason reason, ActorContext actor)` | 关闭违例处理语境。 |

#### B4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `detect(NoWriteTriggerContextRef trigger_context_ref, ForbiddenWriteTargetRef attempted_write_target)` | 从触发语境和目标建立违例对象。 |

#### B4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不代表 source truth 已修复 | 违例只说明被阻止或记录。 |
| 不静默丢弃 | 写源尝试必须有审计轨迹。 |

---

## B5. `ReadVisibilityState`

#### B5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Read Query and Diagnostic Consumption` |
| 对象类型 | state enum / value object |
| 主要责任 | 表达只读查询、诊断、handoff 和外围消费在当前 actor / scope 下的可见性状态。 |

#### B5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `visibility_kind` | `ReadVisibilityKind` | 表达 visible、not-visible、blocked 或 degraded。 |
| `diagnostic_request_context_ref` | `Option<DiagnosticRequestContextRef>` | 回指读取请求语境。 |
| `visibility_constraint_ref` | `Option<VisibilityConstraintRef>` | 说明限制来源。 |
| `gap_state_ref` | `Option<GapStateRef>` | 说明可见性缺口。 |

#### B5.3 状态集合

| 状态 | 作用 |
|---|---|
| `Visible` | 可安全读取。 |
| `ScopedVisible` | 只在限定范围内可见。 |
| `NotVisible` | 当前消费者不可见。 |
| `Blocked` | 因安全、权限或 no-write 约束阻塞。 |
| `Degraded` | 可见但输出降级。 |

#### B5.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_visible()` | 判断是否可输出。 |
| `block(ReadBlockReason reason)` | 进入 blocked。 |
| `degrade(DegradedOutputState degraded_output_state)` | 进入 degraded。 |

#### B5.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `evaluate(DiagnosticRequestContext request_context, ReadVisibilityPolicy visibility_policy)` | 从请求语境和可见性策略计算状态。 |

#### B5.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不绕过 redaction | 可见性必须在安全输出之后成立。 |
| 不形成业务授权 truth | 只表达 observation read visibility。 |

---

## B6. `DiagnosticSummary`

#### B6.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Read Query and Diagnostic Consumption` |
| 对象类型 | domain entity / summary object |
| 主要责任 | 聚合 safe signal、audit projection、gap 和 no-write 线索形成只读诊断摘要。 |

#### B6.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `diagnostic_summary_id` | `DiagnosticSummaryId` | 诊断摘要身份。 |
| `diagnostic_scope_ref` | `DiagnosticScopeRef` | 回指诊断范围。 |
| `summary_state` | `DiagnosticSummaryState` | 表达 fresh、stale、partial 或 unavailable。 |
| `safe_signal_refs` | `SafeSignalRefSet` | 关联安全信号。 |
| `gap_state_refs` | `GapStateRefSet` | 关联显式缺口。 |
| `no_write_violation_refs` | `NoWriteViolationRefSet` | 关联 no-write 线索。 |

#### B6.3 状态集合

| 状态 | 作用 |
|---|---|
| `Fresh` | 摘要与当前观察面一致。 |
| `Partial` | 摘要存在缺口但可解释。 |
| `Stale` | 摘要可能落后。 |
| `Unavailable` | 暂不可输出摘要。 |

#### B6.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `attach_signal(SafeSignal signal)` | 纳入安全信号。 |
| `attach_gap(GapState gap_state)` | 纳入缺口说明。 |
| `mark_stale(StalenessReason reason)` | 标记摘要过期。 |
| `mark_unavailable(DiagnosticUnavailableReason reason)` | 标记不可输出。 |

#### B6.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `build(DiagnosticScope diagnostic_scope, DiagnosticRequestContext request_context)` | 从诊断范围和请求语境建立摘要。 |

#### B6.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不下发控制命令 | 诊断摘要只解释观察事实。 |
| 不修复 source truth | 摘要不能触发业务修复。 |

---

## B7. `DiagnosticScope`

#### B7.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Read Query and Diagnostic Consumption` |
| 对象类型 | value object |
| 主要责任 | 表达诊断读取覆盖的观察材料、时间窗口、consumer scope 和可见性约束。 |

#### B7.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `diagnostic_scope_id` | `DiagnosticScopeId` | 诊断范围身份。 |
| `target_refs` | `DiagnosticTargetRefSet` | 诊断目标集合。 |
| `time_window` | `DiagnosticTimeWindow` | 诊断时间范围。 |
| `read_visibility_state` | `ReadVisibilityState` | 当前范围的可见性结果。 |
| `consumer_scope` | `ConsumerScope` | 消费者允许读取范围。 |

#### B7.3 状态集合

| 状态 | 作用 |
|---|---|
| `Defined` | 范围已定义。 |
| `Restricted` | 范围受可见性限制。 |
| `Invalid` | 范围不合法或无法解释。 |

#### B7.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `restrict(ReadVisibilityState read_visibility_state)` | 按可见性结果限制范围。 |
| `contains(DiagnosticTargetRef target_ref)` | 判断目标是否在范围内。 |
| `invalidate(DiagnosticScopeInvalidReason reason)` | 标记范围无效。 |

#### B7.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `define(DiagnosticTargetRefSet target_refs, DiagnosticTimeWindow time_window, ConsumerScope consumer_scope)` | 定义诊断范围骨架。 |

#### B7.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不扩大读取权限 | 诊断范围不能绕过可见性策略。 |
| 不绑定 UI layout | 范围对象不是 console view state。 |

---

## B8. `GapState`

#### B8.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Gap and Degraded Expression` |
| 对象类型 | domain entity |
| 主要责任 | 表达材料缺失、引用不可解析、证据不可见或来源不完整时的显式缺口事实。 |

#### B8.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `gap_state_id` | `GapStateId` | 缺口身份。 |
| `gap_source_ref` | `GapSourceRef` | 回指缺口来源。 |
| `gap_kind` | `GapKind` | 表达 missing、unresolved、not-visible 或 unsafe。 |
| `gap_state` | `GapLifecycleState` | 表达 open、acknowledged、mitigated 或 closed。 |
| `affected_object_ref` | `AffectedObservationObjectRef` | 说明被影响对象。 |

#### B8.3 状态集合

| 状态 | 作用 |
|---|---|
| `Open` | 缺口已发现且未处理。 |
| `Acknowledged` | 缺口已被确认。 |
| `Mitigated` | 缺口通过降级或替代解释缓解。 |
| `Closed` | 缺口已不再存在。 |

#### B8.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `acknowledge(ActorContext actor)` | 确认缺口存在。 |
| `mitigate(DegradedOutputState degraded_output_state)` | 用降级输出缓解缺口。 |
| `close(GapCloseReason reason, ActorContext actor)` | 关闭缺口。 |

#### B8.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `open(GapSourceRef gap_source_ref, GapKind gap_kind, AffectedObservationObjectRef affected_object_ref)` | 建立缺口对象。 |

#### B8.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不补造默认成功 | gap 必须显式对外表达。 |
| 不写回 source truth | gap closure 不能等于外部事实被修复。 |

---

## B9. `DegradedOutputState`

#### B9.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Gap and Degraded Expression` |
| 对象类型 | state enum / value object |
| 主要责任 | 表达观察输出只能以 partial、stale、not-visible、unsafe 或 blocked 形式交付的状态。 |

#### B9.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `degraded_output_kind` | `DegradedOutputKind` | 降级类别。 |
| `gap_state_ref` | `Option<GapStateRef>` | 关联缺口。 |
| `visibility_constraint_ref` | `Option<VisibilityConstraintRef>` | 关联可见性约束。 |
| `degraded_reason` | `DegradedReason` | 降级原因。 |

#### B9.3 状态集合

| 状态 | 作用 |
|---|---|
| `Partial` | 只能输出部分结果。 |
| `Stale` | 输出可能过期。 |
| `NotVisible` | 当前消费者不可见。 |
| `UnsafeSuppressed` | 因安全风险被抑制。 |
| `Blocked` | 因策略或 no-write 约束被阻塞。 |

#### B9.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_deliverable()` | 判断是否允许交付降级输出。 |
| `attach_gap(GapState gap_state)` | 绑定导致降级的缺口。 |
| `block(DegradedBlockReason reason)` | 进入 blocked。 |

#### B9.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_gap(GapState gap_state, DegradedReason degraded_reason)` | 从缺口建立降级状态。 |

#### B9.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不伪装成完整输出 | consumer 必须能看见降级状态。 |
| 不替代 gap state | degraded 是输出语义,gap 是缺口事实。 |

---

## B10. `PeripheralDeliveryState`

#### B10.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Peripheral Consumption and Export` |
| 对象类型 | state enum / delivery state |
| 主要责任 | 表达 dashboard、alert、management report、GRC export 或 analysis 消费面的交付状态。 |

#### B10.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `delivery_kind` | `PeripheralDeliveryKind` | 交付类别。 |
| `consumer_ref` | `PeripheralConsumerRef` | 消费方引用。 |
| `delivery_state` | `PeripheralDeliveryLifecycleState` | pending、ready、delivered、failed 等状态。 |
| `degraded_output_state` | `Option<DegradedOutputState>` | 交付是否降级。 |

#### B10.3 状态集合

| 状态 | 作用 |
|---|---|
| `Pending` | 交付尚未准备好。 |
| `Ready` | 可向外围消费者交付。 |
| `Delivered` | 已完成交付。 |
| `Failed` | 交付失败。 |
| `Suppressed` | 因安全或策略原因被抑制。 |

#### B10.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `mark_ready(PeripheralExportPolicy export_policy)` | 在策略允许后进入 ready。 |
| `deliver(PeripheralConsumerRef consumer_ref)` | 记录交付。 |
| `fail(PeripheralDeliveryFailureReason reason)` | 记录失败。 |
| `suppress(PeripheralSuppressReason reason)` | 抑制不安全或越界交付。 |

#### B10.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `prepare(PeripheralConsumerRef consumer_ref, DashboardAlertExportView export_view)` | 从消费者和只读视图准备交付状态。 |

#### B10.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不反写 observation truth | 外围交付不能修改核心对象。 |
| 不绑定具名产品配置 | delivery state 只表达平台语义。 |

---

## B11. `ExternalAuditExportPreparation`

#### B11.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Peripheral Consumption and Export` |
| 对象类型 | state object |
| 主要责任 | 表达 external audit / GRC 导出材料准备态,包括可见性、真实性提示、缺口和 retryable 语义。 |

#### B11.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `export_preparation_id` | `ExternalAuditExportPreparationId` | 导出准备身份。 |
| `consumer_ref` | `PeripheralConsumerRef` | 外部审计或 GRC 消费方。 |
| `readiness_state` | `HandoffReadinessState` | 导出准备是否 ready。 |
| `evidence_index_input_view_ref` | `EvidenceIndexInputViewRef` | 导出材料输入读侧。 |
| `gap_state_refs` | `GapStateRefSet` | 导出材料相关缺口。 |

#### B11.3 状态集合

| 状态 | 作用 |
|---|---|
| `Collecting` | 正在收集只读材料。 |
| `ReadyForExport` | 可安全导出。 |
| `Blocked` | 因缺口或可见性被阻塞。 |
| `RetryableFailed` | 失败但可重试。 |
| `Cancelled` | 导出准备被取消。 |

#### B11.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `mark_ready(HandoffReadinessState readiness_state, ActorContext actor)` | 在 handoff readiness 允许时标记 ready。 |
| `block(GapState gap_state)` | 因缺口阻塞。 |
| `mark_retryable_failure(ExportFailureReason reason)` | 记录可重试失败。 |

#### B11.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `prepare_for_consumer(PeripheralConsumerRef consumer_ref, EvidenceIndexInputView evidence_index_input_view)` | 为外部审计消费者准备导出材料。 |

#### B11.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不成为 Governance truth | 外部导出只是只读消费材料。 |
| 不保存 evidence body | 只能交接 body-free 索引和摘要。 |

---

## B12. `ReferenceSnapshotState`

#### B12.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Product-neutral Adapter and Reference Support` |
| 对象类型 | state object |
| 主要责任 | 表达外部 reference / safe summary / snapshot 在本仓观察面中的 freshness、resolution 和可用性状态。 |

#### B12.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `reference_snapshot_state_id` | `ReferenceSnapshotStateId` | 快照状态身份。 |
| `snapshot_subject_ref` | `ReferenceSubjectRef` | 快照对应的外部对象引用。 |
| `freshness_state` | `ReferenceFreshnessState` | fresh、stale、unresolved 或 invalid。 |
| `last_refresh_record_ref` | `Option<ReferenceRefreshRecordRef>` | 最近刷新记录。 |
| `safe_summary_ref` | `Option<SafeExternalSummaryRef>` | 外部安全摘要引用。 |

#### B12.3 状态集合

| 状态 | 作用 |
|---|---|
| `Fresh` | 快照可用于正式观察语境。 |
| `Stale` | 快照过期但可显式降级消费。 |
| `Unresolved` | 外部引用无法解析。 |
| `Invalid` | 引用或摘要不可信。 |

#### B12.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `refresh(ReferenceRefreshRecord refresh_record)` | 绑定刷新结果。 |
| `mark_stale(ReferenceStaleReason reason)` | 标记过期。 |
| `mark_unresolved(ReferenceResolutionReason reason)` | 标记不可解析。 |
| `invalidate(ReferenceInvalidReason reason)` | 标记无效。 |

#### B12.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `track(ReferenceSubjectRef snapshot_subject_ref)` | 为外部引用建立快照状态。 |

#### B12.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不拥有外部 lifecycle | 只记录本仓观察面需要的 freshness。 |
| 不保存外部正文 | 快照只能包含 safe summary。 |

---

## B13. `ProjectionMaintenanceState`

#### B13.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived Maintenance and Replay Coordination` |
| 对象类型 | state object |
| 主要责任 | 表达 read / diagnostic / gap / peripheral projection 的维护状态和可重建性。 |

#### B13.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `projection_maintenance_state_id` | `ProjectionMaintenanceStateId` | 投影维护状态身份。 |
| `maintenance_target_ref` | `MaintenanceTargetRef` | 维护目标。 |
| `maintenance_state` | `ProjectionMaintenanceLifecycleState` | idle、scheduled、running、failed 或 completed。 |
| `rebuild_progress_view_ref` | `Option<RebuildProgressViewRef>` | 对外解释进度。 |
| `policy_ref` | `DerivedMaintenancePolicyRef` | 回指维护边界策略。 |

#### B13.3 状态集合

| 状态 | 作用 |
|---|---|
| `Idle` | 当前无维护任务。 |
| `Scheduled` | 已计划维护。 |
| `Running` | 正在维护。 |
| `Failed` | 维护失败。 |
| `Completed` | 维护完成。 |

#### B13.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `schedule(DerivedMaintenancePolicy policy, ActorContext actor)` | 安排维护任务。 |
| `start(ProjectionMaintenanceRecord maintenance_record)` | 标记开始。 |
| `fail(MaintenanceFailureReason reason)` | 记录失败。 |
| `complete(ProjectionMaintenanceRecord maintenance_record)` | 记录完成。 |

#### B13.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `for_target(MaintenanceTargetRef maintenance_target_ref)` | 为维护目标建立状态对象。 |

#### B13.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不覆盖 observation truth | 维护只作用于派生结构。 |
| 不隐藏 stale / rebuilding | 读侧必须能看见维护状态。 |

---

## B14. `ReplayCoordinationState`

#### B14.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived Maintenance and Replay Coordination` |
| 对象类型 | state object |
| 主要责任 | 表达 replay 协调的批准、阻塞、执行和影响解释状态。 |

#### B14.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `replay_coordination_state_id` | `ReplayCoordinationStateId` | replay 协调状态身份。 |
| `replay_scope_ref` | `ReplayScopeRef` | 回指 replay 范围。 |
| `coordination_state` | `ReplayCoordinationLifecycleState` | draft、approved、running、blocked 或 completed。 |
| `no_write_violation_ref` | `Option<NoWriteViolationRef>` | 关联 no-write 阻塞。 |
| `execution_record_ref` | `Option<ReplayExecutionRecordRef>` | 关联 replay 执行记录。 |

#### B14.3 状态集合

| 状态 | 作用 |
|---|---|
| `Draft` | 协调尚未批准。 |
| `Approved` | 已批准可执行。 |
| `Running` | 正在执行 replay。 |
| `Blocked` | 因边界或 no-write 被阻塞。 |
| `Completed` | replay 协调完成。 |

#### B14.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `approve(ReplayCoordinationPolicy policy, ActorContext actor)` | 根据策略批准 replay。 |
| `block(NoWriteViolation no_write_violation)` | 因违例进入 blocked。 |
| `start(ReplayExecutionRecord execution_record)` | 记录开始执行。 |
| `complete(ReplayExecutionRecord execution_record)` | 记录完成。 |

#### B14.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `coordinate(ReplayScope replay_scope)` | 从 replay scope 建立协调状态。 |

#### B14.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不扩大 replay scope | 协调只能在已批准范围内执行。 |
| 不修复外部 truth | replay 完成不表示外部事实被修复。 |

---

## B15. `RollupRebuildState`

#### B15.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived Maintenance and Replay Coordination` |
| 对象类型 | state object |
| 主要责任 | 表达 signal rollup / metric rollup / diagnostic rollup 的重建状态。 |

#### B15.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `rollup_rebuild_state_id` | `RollupRebuildStateId` | rollup 重建状态身份。 |
| `rollup_window_ref` | `SignalRollupWindowRef` | 回指要重建的窗口。 |
| `maintenance_target_ref` | `MaintenanceTargetRef` | 回指维护目标。 |
| `rebuild_state` | `RollupRebuildLifecycleState` | queued、running、failed、completed。 |
| `rebuild_progress_view_ref` | `Option<RebuildProgressViewRef>` | 对外进度解释。 |

#### B15.3 状态集合

| 状态 | 作用 |
|---|---|
| `Queued` | 已排队等待重建。 |
| `Running` | 正在重建。 |
| `Failed` | 重建失败。 |
| `Completed` | 重建完成。 |
| `Cancelled` | 重建被取消。 |

#### B15.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `start(ProjectionMaintenanceRecord maintenance_record)` | 标记开始重建。 |
| `fail(MaintenanceFailureReason reason)` | 记录失败。 |
| `complete(ProjectionMaintenanceRecord maintenance_record)` | 记录完成。 |
| `cancel(MaintenanceCancelReason reason, ActorContext actor)` | 取消重建。 |

#### B15.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `for_window(SignalRollupWindow rollup_window, MaintenanceTargetRef maintenance_target_ref)` | 为 rollup window 建立重建状态。 |

#### B15.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不改变原始 signal 事实 | rollup rebuild 只重建派生聚合。 |
| 不隐藏失败 | failed 必须对 read / diagnostic 可见。 |
