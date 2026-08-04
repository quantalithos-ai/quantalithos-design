# Step 06 附录 B. Policy / Guard 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 本文件只给概要骨架,不定义完整策略实现。

---

## P1. `IntakeAdmissionPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Observation Intake and Safety` |
| 对象类型 | policy / invariant |
| 主要责任 | 判断候选 observation material 是否具备来源、安全语境和消费目的,从而允许建立 `ObservationReceipt`。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `IntakeAdmissionPolicyId` | 策略身份。 |
| `required_context` | `RequiredIntakeContext` | 说明必须存在的来源、关联和目的语境。 |
| `forbidden_material_rule` | `ForbiddenMaterialRule` | 限制 raw body、secret、payload body 等禁止材料。 |

| 成员函数 | 作用 |
|---|---|
| `evaluate(ObservationSourceRef source_ref, SubmissionPurposeRef purpose_ref, SafetyDisposition disposition)` | 判断是否允许进入 observation truth。 |
| `reject_reason(ReceivedMaterialSummary material_summary)` | 给出拒绝原因。 |

| 工厂函数 | 作用 |
|---|---|
| `default_for_scope(IntakePolicyScope scope)` | 为指定 intake 范围建立策略骨架。 |

| 禁止事项 | 说明 |
|---|---|
| 不读取外部正文 | 只能基于 safe summary、ref 和 safety disposition 判断。 |

---

## P2. `SafetyDispositionPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Observation Intake and Safety` |
| 对象类型 | policy / guard |
| 主要责任 | 对候选材料做 redaction-first 判断,并确定 allow、reject、quarantine 或 degrade。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `SafetyDispositionPolicyId` | 策略身份。 |
| `redaction_requirement` | `RedactionRequirement` | 说明必须完成的脱敏条件。 |
| `quarantine_rule` | `QuarantineRule` | 定义需隔离的风险类别。 |

| 成员函数 | 作用 |
|---|---|
| `classify(ReceivedMaterialSummary material_summary, SafetyEvaluationContext context)` | 给出安全处置类别。 |
| `requires_quarantine(ForbiddenBodyFlag forbidden_body_flag)` | 判断是否必须隔离。 |

| 工厂函数 | 作用 |
|---|---|
| `for_material_kind(ReceivedMaterialKind material_kind)` | 按材料类型建立处置策略。 |

| 禁止事项 | 说明 |
|---|---|
| 不生成安全摘要正文 | 策略只判断边界,不保存正文。 |

---

## P3. `SafeSignalPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Correlation and Safe Signal` |
| 对象类型 | policy / invariant |
| 主要责任 | 判断 log / metric / trace 是否可以作为 `SafeSignal` 进入 observation side,并限制高敏 label、opaque id 和 execution truth 混淆。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `SafeSignalPolicyId` | 策略身份。 |
| `allowed_signal_kind_set` | `SafeSignalKindSet` | 允许的 signal 类型集合。 |
| `label_safety_rule` | `LabelSafetyRule` | 限制高基数或敏感 label。 |
| `correlation_requirement` | `CorrelationRequirement` | 说明 signal 必须绑定的关联语境。 |

| 成员函数 | 作用 |
|---|---|
| `evaluate(CorrelationContext correlation_context, SafeSignalSummaryRef signal_summary_ref)` | 判断 signal 是否可成立。 |
| `requires_degraded_output(SafeSignalSummaryRef signal_summary_ref)` | 判断 signal 是否只能 degraded 输出。 |

| 工厂函数 | 作用 |
|---|---|
| `for_signal_family(SafeSignalKind signal_kind)` | 建立指定 signal 类型的策略。 |

| 禁止事项 | 说明 |
|---|---|
| 不裁决 execution truth | 策略只判断观察输出安全性。 |

---

## P4. `BodyFreeLinkagePolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Audit Projection and Body-free Evidence Linkage` |
| 对象类型 | policy / guard |
| 主要责任 | 保证 `EvidenceLinkage` 只能保存 body-free ref、digest、consumer purpose 和缺口语义。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `BodyFreeLinkagePolicyId` | 策略身份。 |
| `allowed_reference_family_set` | `ReferenceFamilySet` | 允许的 evidence / artifact / governance 引用类别。 |
| `forbidden_body_rule` | `ForbiddenBodyRule` | 阻断 evidence body、artifact body 和 source audit body。 |

| 成员函数 | 作用 |
|---|---|
| `validate(GovernanceArtifactEvidenceReference boundary_ref, EvidenceConsumerPurpose purpose)` | 判断引用是否可形成 body-free linkage。 |
| `reject_body_material(ExternalBodySignal body_signal)` | 对正文材料给出拒绝语义。 |

| 工厂函数 | 作用 |
|---|---|
| `for_consumer_purpose(EvidenceConsumerPurpose consumer_purpose)` | 为消费目的建立 linkage 策略。 |

| 禁止事项 | 说明 |
|---|---|
| 不读取证据正文 | 只处理引用、摘要和可见性。 |

---

## P5. `EvidenceVisibilityPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Audit Projection and Body-free Evidence Linkage` |
| 对象类型 | policy / invariant |
| 主要责任 | 判断 evidence linkage 对当前消费者是否 visible、restricted、not-visible 或 missing。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `EvidenceVisibilityPolicyId` | 策略身份。 |
| `consumer_scope` | `EvidenceConsumerScope` | 消费者可见范围。 |
| `not_visible_rule` | `EvidenceNotVisibleRule` | 不可见判断规则。 |

| 成员函数 | 作用 |
|---|---|
| `evaluate(EvidenceLinkage linkage, EvidenceConsumerScope consumer_scope)` | 计算可见性状态。 |
| `gap_for_missing(GovernanceArtifactEvidenceReference boundary_ref)` | 对缺失引用生成 gap 线索。 |

| 工厂函数 | 作用 |
|---|---|
| `for_scope(EvidenceConsumerScope consumer_scope)` | 为消费者范围建立策略。 |

| 禁止事项 | 说明 |
|---|---|
| 不把不可见写成不存在 | not-visible 与 missing 必须区分。 |

---

## P6. `AuthenticityHintPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Report Handoff and Authenticity` |
| 对象类型 | policy / guard |
| 主要责任 | 判断 report handoff 输入中的材料应标记为真实执行、待补齐或设计期占位。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `AuthenticityHintPolicyId` | 策略身份。 |
| `accepted_origin_set` | `EvidenceOriginKindSet` | 可视为真实执行来源的类别。 |
| `placeholder_rule` | `PlaceholderDetectionRule` | 标记设计期占位的规则。 |

| 成员函数 | 作用 |
|---|---|
| `assess(EvidenceIndexInputView evidence_index_input_view, GapState gap_state)` | 生成真实性提示。 |
| `requires_real_run(AuthenticityHint hint)` | 判断是否仍需真实执行补齐。 |

| 工厂函数 | 作用 |
|---|---|
| `for_handoff_scope(HandoffScope handoff_scope)` | 为交接范围建立真实性策略。 |

| 禁止事项 | 说明 |
|---|---|
| 不伪造真实 evidence | 策略只能标注真实性,不能生成证据本体。 |

---

## P7. `HandoffReadinessPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Report Handoff and Authenticity` |
| 对象类型 | policy / invariant |
| 主要责任 | 判断 report handoff 是否满足 redaction、evidence linkage、visibility、gap 和 no-write 边界。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `HandoffReadinessPolicyId` | 策略身份。 |
| `required_hint_kind` | `AuthenticityHintKindSet` | 允许进入 ready 的真实性提示类别。 |
| `blocking_rule` | `HandoffBlockingRule` | handoff blocked 的判断规则。 |

| 成员函数 | 作用 |
|---|---|
| `evaluate(ReportHandoffRecord handoff_record, ReadVisibilityState visibility_state, NoWriteGuardPolicy no_write_guard_policy)` | 计算 readiness。 |
| `block_reason(ReportHandoffRecord handoff_record)` | 给出阻塞原因。 |

| 工厂函数 | 作用 |
|---|---|
| `for_consumer(ReportConsumerRef consumer_ref)` | 为消费边界建立 readiness 策略。 |

| 禁止事项 | 说明 |
|---|---|
| 不把 pending 写成 ready | 条件未闭合必须显式 pending 或 blocked。 |

---

## P8. `RetentionProtectionPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Retention, Replay and No-write Guard` |
| 对象类型 | policy / invariant |
| 主要责任 | 判断观察材料是否必须 hold、是否可 release、是否存在 conflict 或 archive eligibility。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `RetentionProtectionPolicyId` | 策略身份。 |
| `protection_rule` | `ActiveProtectionRule` | 活动引用保护规则。 |
| `release_rule` | `RetentionReleaseRule` | 释放条件规则。 |

| 成员函数 | 作用 |
|---|---|
| `evaluate(RetentionMarker retention_marker, ActiveReferenceProtection protection)` | 判断留存状态。 |
| `can_release(RetentionMarker retention_marker)` | 判断能否释放。 |
| `conflict_reason(RetentionMarker retention_marker)` | 给出冲突原因。 |

| 工厂函数 | 作用 |
|---|---|
| `for_purpose(RetentionPurpose retention_purpose)` | 为留存目的建立策略。 |

| 禁止事项 | 说明 |
|---|---|
| 不定义 retention days | 具体参数交给配置设计。 |

---

## P9. `ReplayBoundaryPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Retention, Replay and No-write Guard` |
| 对象类型 | policy / guard |
| 主要责任 | 限制 replay / rebuild 只能影响 observation truth 派生面和维护解释,不得写源或扩大范围。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `ReplayBoundaryPolicyId` | 策略身份。 |
| `allowed_effect_set` | `ReplayAllowedEffectSet` | 允许影响集合。 |
| `forbidden_target_rule` | `ForbiddenReplayTargetRule` | 禁止目标规则。 |

| 成员函数 | 作用 |
|---|---|
| `approve(ReplayScope replay_scope, NoWriteGuardPolicy no_write_guard_policy)` | 判断 replay scope 是否允许。 |
| `requires_narrowing(ReplayScope replay_scope)` | 判断范围是否必须缩小。 |

| 工厂函数 | 作用 |
|---|---|
| `for_maintenance_target(MaintenanceTargetRef maintenance_target_ref)` | 为维护目标建立 replay 边界策略。 |

| 禁止事项 | 说明 |
|---|---|
| 不允许 source repair target | 禁止把 source truth 修复写入 replay scope。 |

---

## P10. `NoWriteGuardPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Retention, Replay and No-write Guard` |
| 对象类型 | policy / guard |
| 主要责任 | 在 query、diagnostic、maintenance、handoff 和 export 路径阻断任何 source truth 写入。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `NoWriteGuardPolicyId` | 策略身份。 |
| `forbidden_write_target_set` | `ForbiddenWriteTargetSet` | 禁止写入目标集合。 |
| `guard_scope` | `NoWriteGuardScope` | guard 适用范围。 |

| 成员函数 | 作用 |
|---|---|
| `evaluate(NoWriteTriggerContextRef trigger_context_ref, ForbiddenWriteTargetRef attempted_target)` | 判断是否违例。 |
| `block(NoWriteViolation violation)` | 阻断违例。 |
| `allow_read_only(MaintenanceTargetRef maintenance_target_ref)` | 判断只读维护是否允许。 |

| 工厂函数 | 作用 |
|---|---|
| `global_guard(NoWriteGuardScope guard_scope)` | 建立全仓 no-write guard。 |

| 禁止事项 | 说明 |
|---|---|
| 不允许旁路 | query / diagnostic / maintenance / export 都必须经过 guard。 |

---

## P11. `ReadVisibilityPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Read Query and Diagnostic Consumption` |
| 对象类型 | policy / invariant |
| 主要责任 | 判断 observation read / diagnostic read / handoff read 对当前消费者是否安全可见。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `ReadVisibilityPolicyId` | 策略身份。 |
| `consumer_scope` | `ConsumerScope` | 消费者范围。 |
| `redaction_requirement` | `RedactionRequirement` | 输出前置脱敏要求。 |
| `visibility_constraint_set` | `VisibilityConstraintSet` | 约束集合。 |

| 成员函数 | 作用 |
|---|---|
| `evaluate(DiagnosticRequestContext request_context, ObservationReadModel read_model)` | 计算可见性。 |
| `requires_degraded(ReadVisibilityState state)` | 判断是否必须 degraded 输出。 |

| 工厂函数 | 作用 |
|---|---|
| `for_consumer_scope(ConsumerScope consumer_scope)` | 为消费者范围建立策略。 |

| 禁止事项 | 说明 |
|---|---|
| 不定义身份授权 truth | 只消费 actor / subject safe ref 和上下文。 |

---

## P12. `GapClassificationPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Gap and Degraded Expression` |
| 对象类型 | policy / classifier |
| 主要责任 | 区分 missing、unresolved、not-visible、unsafe output、blocked 等 gap 类型。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `GapClassificationPolicyId` | 策略身份。 |
| `classification_rule_set` | `GapClassificationRuleSet` | 缺口分类规则集合。 |
| `default_gap_kind` | `GapKind` | 无法细分时的默认 gap 类型。 |

| 成员函数 | 作用 |
|---|---|
| `classify(GapSourceRef gap_source_ref, VisibilityConstraintRef visibility_constraint_ref)` | 给出 gap 类型。 |
| `requires_handoff_block(GapState gap_state)` | 判断 gap 是否阻塞 handoff。 |

| 工厂函数 | 作用 |
|---|---|
| `standard()` | 建立标准缺口分类策略。 |

| 禁止事项 | 说明 |
|---|---|
| 不把 missing 当 success | 缺口必须显式表达。 |

---

## P13. `DegradedOutputPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Gap and Degraded Expression` |
| 对象类型 | policy / guard |
| 主要责任 | 判断 read、diagnostic、handoff 和 peripheral 输出何时只能以 degraded / blocked / not-visible 形式表达。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `DegradedOutputPolicyId` | 策略身份。 |
| `degradation_rule_set` | `DegradationRuleSet` | 降级规则集合。 |
| `unsafe_output_rule` | `UnsafeOutputRule` | 禁止输出规则。 |

| 成员函数 | 作用 |
|---|---|
| `evaluate(GapState gap_state, ReadVisibilityState visibility_state)` | 计算 degraded output。 |
| `must_suppress(DegradedOutputState degraded_output_state)` | 判断是否必须抑制输出。 |

| 工厂函数 | 作用 |
|---|---|
| `for_output_surface(OutputSurfaceKind output_surface_kind)` | 为输出面建立降级策略。 |

| 禁止事项 | 说明 |
|---|---|
| 不把 degraded 隐藏成正常输出 | 消费方必须可见降级状态。 |

---

## P14. `PeripheralExportPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Peripheral Consumption and Export` |
| 对象类型 | policy / invariant |
| 主要责任 | 限制 dashboard、alert、management report、external audit / GRC 和 analysis 的只读消费与导出范围。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `PeripheralExportPolicyId` | 策略身份。 |
| `allowed_consumer_kind_set` | `PeripheralConsumerKindSet` | 允许的外围消费者类别。 |
| `export_boundary_rule` | `ExportBoundaryRule` | 导出边界规则。 |
| `no_write_guard_ref` | `NoWriteGuardPolicyRef` | 回指 no-write 防线。 |

| 成员函数 | 作用 |
|---|---|
| `evaluate(PeripheralConsumerRef consumer_ref, DashboardAlertExportView export_view)` | 判断是否允许交付。 |
| `requires_suppression(PeripheralConsumerRef consumer_ref, DegradedOutputState state)` | 判断是否必须抑制外围输出。 |

| 工厂函数 | 作用 |
|---|---|
| `for_consumer_kind(PeripheralConsumerKind consumer_kind)` | 为外围消费者建立策略。 |

| 禁止事项 | 说明 |
|---|---|
| 不让外部工具定义 truth | 外围产品只能消费只读材料。 |

---

## P15. `ReferenceFreshnessPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Product-neutral Adapter and Reference Support` |
| 对象类型 | policy / invariant |
| 主要责任 | 判断外部 safe ref / snapshot 是否 fresh、stale、unresolved 或 invalid。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `ReferenceFreshnessPolicyId` | 策略身份。 |
| `freshness_window` | `ReferenceFreshnessWindow` | freshness 判断窗口。 |
| `unresolved_rule` | `ReferenceUnresolvedRule` | 不可解析规则。 |

| 成员函数 | 作用 |
|---|---|
| `evaluate(ReferenceSnapshotState snapshot_state, ReferenceRefreshRecord refresh_record)` | 计算 freshness。 |
| `requires_gap(ReferenceSnapshotState snapshot_state)` | 判断是否需要生成 gap。 |

| 工厂函数 | 作用 |
|---|---|
| `for_reference_family(ReferenceFamily reference_family)` | 为引用家族建立 freshness 策略。 |

| 禁止事项 | 说明 |
|---|---|
| 不补造外部 truth | stale 或 unresolved 只能显式表达。 |

---

## P16. `AdapterBoundaryPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Product-neutral Adapter and Reference Support` |
| 对象类型 | policy / guard |
| 主要责任 | 防止具名采集、存储、展示或导出产品把配置、正文或私有语义写成 observation truth。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `AdapterBoundaryPolicyId` | 策略身份。 |
| `allowed_adapter_family_set` | `AdapterFamilySet` | 允许的产品中立 adapter 家族。 |
| `forbidden_product_truth_rule` | `ForbiddenProductTruthRule` | 禁止产品配置成为 truth source。 |

| 成员函数 | 作用 |
|---|---|
| `validate_adapter_output(SafeExternalSummaryRef summary_ref, AdapterFamily adapter_family)` | 判断 adapter 输出是否可进入观察语境。 |
| `reject_product_truth(ProductTruthSignal product_truth_signal)` | 拒绝外部产品 truth 污染。 |

| 工厂函数 | 作用 |
|---|---|
| `product_neutral()` | 建立产品中立 adapter 边界策略。 |

| 禁止事项 | 说明 |
|---|---|
| 不绑定 Grafana / Prometheus / OTel 等具名产品为 truth | 产品只能是后续配置候选。 |

---

## P17. `DerivedMaintenancePolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived Maintenance and Replay Coordination` |
| 对象类型 | policy / invariant |
| 主要责任 | 限制 projection rebuild、gap scan、reference refresh 和 rollup rebuild 只能作用于派生结构。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `DerivedMaintenancePolicyId` | 策略身份。 |
| `allowed_target_kind_set` | `MaintenanceTargetKindSet` | 允许维护目标类别。 |
| `derived_only_rule` | `DerivedOnlyRule` | 只允许派生维护的规则。 |

| 成员函数 | 作用 |
|---|---|
| `evaluate(MaintenanceTargetRef maintenance_target_ref, NoWriteGuardPolicy no_write_guard_policy)` | 判断维护目标是否允许。 |
| `requires_readonly_mode(MaintenanceTargetRef maintenance_target_ref)` | 判断是否必须只读维护。 |

| 工厂函数 | 作用 |
|---|---|
| `for_target_kind(MaintenanceTargetKind target_kind)` | 为维护目标类型建立策略。 |

| 禁止事项 | 说明 |
|---|---|
| 不覆盖核心 observation truth | 派生维护不能修改核心事实。 |

---

## P18. `ReplayCoordinationPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived Maintenance and Replay Coordination` |
| 对象类型 | policy / guard |
| 主要责任 | 控制 replay 协调的批准、阻塞、缩小范围和结果解释。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_id` | `ReplayCoordinationPolicyId` | 策略身份。 |
| `approval_rule` | `ReplayApprovalRule` | replay 批准规则。 |
| `blocking_rule` | `ReplayBlockingRule` | replay 阻塞规则。 |
| `impact_scope_rule` | `ReplayImpactScopeRule` | 影响范围解释规则。 |

| 成员函数 | 作用 |
|---|---|
| `approve(ReplayScope replay_scope, RetentionMarker retention_marker, NoWriteGuardPolicy no_write_guard_policy)` | 判断 replay 是否可批准。 |
| `block_reason(ReplayCoordinationState coordination_state)` | 给出阻塞原因。 |
| `impact_summary(ReplayExecutionRecord execution_record)` | 生成影响摘要。 |

| 工厂函数 | 作用 |
|---|---|
| `for_replay_scope(ReplayScope replay_scope)` | 为 replay scope 建立协调策略。 |

| 禁止事项 | 说明 |
|---|---|
| 不扩大影响范围 | 策略不能把派生影响扩展到 source truth。 |
