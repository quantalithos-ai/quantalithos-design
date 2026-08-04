# Step 06 附录 A1. Truth / Signal / Audit / Handoff 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 本文件只给概要骨架,不定义完整对象契约。

---

## A1. `ObservationReceipt`

#### A1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Observation Intake and Safety` |
| 对象类型 | domain aggregate |
| 主要责任 | 表达候选 observation material 进入本仓观察语境后的正式准入事实,并承接 accepted / rejected / quarantined / degraded 的显式变化。 |

#### A1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `observation_receipt_id` | `ObservationReceiptId` | 准入事实的稳定身份。 |
| `source_ref` | `ObservationSourceRef` | 回指正式来源引用,保证可解释来源成立。 |
| `admission_state` | `MaterialAdmissionState` | 表达当前 receipt 是 accepted、rejected、quarantined 还是 degraded。 |
| `safety_disposition_ref` | `SafetyDispositionRef` | 回指安全处置语境。 |
| `submission_purpose_ref` | `SubmissionPurposeRef` | 表达该材料进入观察面的消费目的。 |
| `received_at` | `ObservedAt` | 记录准入变化发生时点。 |

#### A1.3 状态集合

| 状态 | 作用 |
|---|---|
| `Accepted` | 材料可作为 observation truth 主线输入继续流转。 |
| `Rejected` | 材料不能进入正式观察语境。 |
| `Quarantined` | 材料存在安全风险,需隔离并保留审计痕迹。 |
| `Degraded` | 材料可保留有限观察意义,但必须显式降级。 |

#### A1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `accept(SafetyDisposition disposition, ActorContext actor)` | 在安全处置允许时形成 accepted receipt。 |
| `reject(IntakeRejectReason reason, ActorContext actor)` | 对无效或越界材料形成拒绝事实。 |
| `quarantine(QuarantineReason reason, ActorContext actor)` | 对高风险材料形成隔离事实。 |
| `degrade(DegradationReason reason, ActorContext actor)` | 在来源不完整但仍需保留观察语义时降级。 |

#### A1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `receive(ObservationSourceRef source_ref, SubmissionPurposeRef submission_purpose_ref, ReceivedMaterialKind material_kind)` | 从正式来源和消费目的建立新的 receipt 骨架。 |

#### A1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不拥有 source truth | receipt 只表示 observation intake 结果,不等于来源 truth 已写入。 |
| 不保存 raw body | receipt 只能引用来源和安全语境,不能保存未脱敏正文。 |

---

## A2. `SafetyDisposition`

#### A2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Observation Intake and Safety` |
| 对象类型 | domain entity |
| 主要责任 | 表达单次 observation intake 的安全处置语境,承接 redaction、forbidden body 检测和输出可见性边界。 |

#### A2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `safety_disposition_id` | `SafetyDispositionId` | 安全处置身份。 |
| `disposition_kind` | `SafetyDispositionKind` | 表达 allow、reject、quarantine 或 degrade 类别。 |
| `redaction_marker` | `RedactionMarker` | 记录是否完成脱敏和安全标记。 |
| `forbidden_body_flag` | `ForbiddenBodyFlag` | 记录是否检测到禁止正文。 |
| `sanitized_summary_ref` | `SanitizedSummaryRef` | 回指可被后续消费的安全摘要。 |
| `visibility_constraint_ref` | `VisibilityConstraintRef` | 回指当前处置施加的可见性约束。 |

#### A2.3 状态集合

| 状态 | 作用 |
|---|---|
| `Allowed` | 可继续进入 observation truth 主线。 |
| `RejectedUnsafe` | 因 forbidden body 或高风险内容被拒绝。 |
| `Quarantined` | 保留审计痕迹但不允许继续消费。 |
| `DegradedAllowed` | 仅允许有限输出,后续必须显式 degraded。 |

#### A2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `allow_with_redaction(RedactionMarker redaction_marker, SanitizedSummaryRef sanitized_summary_ref)` | 在完成脱敏后允许后续消费。 |
| `reject_unsafe(ForbiddenBodyEvidence evidence, ActorContext actor)` | 明确记录 unsafe 拒绝原因。 |
| `quarantine(QuarantineReason reason, ActorContext actor)` | 形成隔离语境。 |
| `downgrade_output(DegradationReason reason)` | 标记只能产生 degraded output。 |

#### A2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `evaluate(ReceivedMaterialSummary material_summary, SafetyEvaluationContext evaluation_context)` | 从候选材料和安全判断上下文生成处置骨架。 |

#### A2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不直接产出 report handoff | 处置语境只能服务准入和后续对象,不能跳过主线直接交接。 |
| 不把 redaction marker 当 truth owner | 安全标记只说明是否可安全表达,不重定义 source truth。 |

---

## A3. `CorrelationContext`

#### A3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Correlation and Safe Signal` |
| 对象类型 | context object |
| 主要责任 | 表达 observation material 与 trace、causation、source、actor / subject 和 safe ref 之间的统一关联语境。 |

#### A3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `correlation_context_id` | `CorrelationContextId` | 关联语境身份。 |
| `trace_ref` | `TraceCorrelationRef` | 表达 trace 相关性。 |
| `causation_ref` | `CausationRef` | 表达因果链条。 |
| `source_ref` | `ObservationSourceRef` | 回指正式来源。 |
| `actor_subject_ref` | `ActorSubjectObservationRef` | 关联 actor / subject 安全引用。 |
| `context_state` | `CorrelationContextState` | 表达语境是否可用、降级或失效。 |

#### A3.3 状态集合

| 状态 | 作用 |
|---|---|
| `Established` | 关联语境完整且可被后续对象消费。 |
| `PendingSource` | 来源或因果线索尚未闭合。 |
| `Degraded` | 语境成立但关联不完整。 |
| `Invalidated` | 语境不再可信或不再可用。 |

#### A3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `bind_source(ObservationSourceRef source_ref, ActorContext actor)` | 把来源正式绑定进关联语境。 |
| `link_runtime_signal(RuntimeSandboxSignalRef runtime_signal_ref)` | 把 runtime / sandbox 信号接入统一关联口径。 |
| `degrade(CorrelationGapReason reason)` | 在来源或因果缺口下转入 degraded。 |
| `invalidate(CorrelationInvalidReason reason, ActorContext actor)` | 标记当前关联语境无效。 |

#### A3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_receipt(ObservationReceipt receipt, CorrelationSeed correlation_seed)` | 从已接受 receipt 和初始关联种子形成语境。 |

#### A3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不从 opaque id 反推业务 truth | 关联语境只能解释 observation side 的关系。 |
| 不拥有 runtime execution truth | trace / causation 只服务观察关联。 |

---

## A4. `SafeSignal`

#### A4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Correlation and Safe Signal` |
| 对象类型 | domain entity |
| 主要责任 | 表达已安全收束的 log / metric / trace 观察事实,并把 signal 与 source truth、execution truth 分开。 |

#### A4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `safe_signal_id` | `SafeSignalId` | 安全信号身份。 |
| `signal_kind` | `SafeSignalKind` | 表达 log、metric、trace 或 summary 类型。 |
| `correlation_context_ref` | `CorrelationContextRef` | 回指统一关联语境。 |
| `signal_state` | `SafeSignalState` | 表达信号是否已成立、降级或被抑制。 |
| `signal_summary_ref` | `SafeSignalSummaryRef` | 回指安全摘要。 |
| `runtime_signal_ref` | `RuntimeSandboxSignalRef` | 回指 runtime / sandbox 来源。 |

#### A4.3 状态集合

| 状态 | 作用 |
|---|---|
| `Admitted` | 信号已可进入 observation truth。 |
| `Projected` | 信号已被派生到只读面。 |
| `Degraded` | 信号成立但只能有限解释。 |
| `Suppressed` | 信号因安全或质量问题不再输出。 |

#### A4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `project_to_read_model(SignalProjectionTarget target)` | 把已成立 signal 投影到只读面。 |
| `mark_degraded(DegradedOutputState degraded_output_state)` | 把 signal 与 degraded 语义绑定。 |
| `suppress(SignalSuppressionReason reason, ActorContext actor)` | 因安全或质量问题抑制输出。 |
| `is_exportable()` | 判断是否允许进入外围只读消费面。 |

#### A4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_summary(CorrelationContext correlation_context, SafeSignalSummaryRef signal_summary_ref, SafeSignalKind signal_kind)` | 从关联语境和安全摘要建立 signal。 |

#### A4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不保存 raw backend record | signal 只保留安全摘要和边界引用。 |
| 不裁决执行成功或失败 | safe signal 不是 runtime / sandbox execution truth。 |

---

## A5. `SignalRollupWindow`

#### A5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Correlation and Safe Signal` |
| 对象类型 | value object |
| 主要责任 | 表达 safe signal 聚合、rollup 和 rebuild 所依赖的正式时间窗口与窗口状态。 |

#### A5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `signal_rollup_window_id` | `SignalRollupWindowId` | 窗口身份。 |
| `window_kind` | `RollupWindowKind` | 表达 minute / hour / custom 等窗口粒度。 |
| `window_start_at` | `WindowStartAt` | 窗口开始时间。 |
| `window_end_at` | `WindowEndAt` | 窗口结束时间。 |
| `window_state` | `RollupWindowState` | 表达窗口是否开放、封存或重建中。 |
| `signal_count` | `SignalCount` | 记录当前窗口内信号规模。 |

#### A5.3 状态集合

| 状态 | 作用 |
|---|---|
| `Open` | 仍允许继续接受 signal。 |
| `Sealed` | 已关闭并用于稳定 rollup。 |
| `Rebuilding` | 正在被重建或重放修正。 |
| `Invalidated` | 当前窗口不再可用于消费。 |

#### A5.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `accept_signal(SafeSignal signal)` | 把 signal 纳入窗口统计。 |
| `seal(ActorContext actor)` | 在窗口完成后封存。 |
| `reopen_for_rebuild(MaintenanceTargetRef maintenance_target_ref)` | 为重建任务重新打开窗口。 |

#### A5.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `open_window(RollupWindowKind window_kind, WindowStartAt window_start_at, WindowEndAt window_end_at)` | 建立新的 rollup window。 |

#### A5.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不表达完整 metric schema | 窗口只承接聚合边界,不承接序列化格式。 |
| 不替代 projection view | rollup window 不是最终消费视图。 |

---

## A6. `AuditProjection`

#### A6.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Audit Projection and Body-free Evidence Linkage` |
| 对象类型 | domain aggregate |
| 主要责任 | 表达基于安全 observation material 形成的只读审计投影事实,并承接来源、责任语境和可追溯 append 变化。 |

#### A6.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `audit_projection_id` | `AuditProjectionId` | 审计投影身份。 |
| `projection_kind` | `AuditProjectionKind` | 表达投影用于审计、合规、诊断或报告的类别。 |
| `correlation_context_ref` | `CorrelationContextRef` | 回指统一关联语境。 |
| `visibility_state` | `AuditProjectionVisibilityState` | 表达可见、受限或带 gap 的投影状态。 |
| `consumer_purpose` | `AuditConsumerPurpose` | 记录投影服务的消费目的。 |
| `latest_append_record_ref` | `AuditAppendRecordRef` | 回指最新 append 变化。 |

#### A6.3 状态集合

| 状态 | 作用 |
|---|---|
| `Visible` | 投影可被正式读取。 |
| `Restricted` | 可存在但受可见性约束。 |
| `GapAnnotated` | 投影成立但显式附带 gap。 |
| `ArchivedReadOnly` | 只作为只读追溯材料存在。 |

#### A6.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `append_fact(EvidenceLinkage evidence_linkage, ActorContext actor)` | 把新的 body-free 证据线索追加进投影。 |
| `mark_restricted(EvidenceVisibilityReason reason)` | 标记当前投影受限。 |
| `attach_gap(GapState gap_state)` | 给投影附加显式缺口说明。 |
| `publish_to_timeline(AuditTimelineView timeline_view)` | 把投影输出到 canonical audit view。 |

#### A6.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `project_from_signal(CorrelationContext correlation_context, AuditConsumerPurpose consumer_purpose)` | 从统一关联语境建立审计投影骨架。 |

#### A6.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不替代 Governance truth | audit projection 只能表达观察面事实。 |
| 不保存 source audit 正文 | 只能保留 body-free 线索和可见性语境。 |

---

## A7. `EvidenceLinkage`

#### A7.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Audit Projection and Body-free Evidence Linkage` |
| 对象类型 | domain entity |
| 主要责任 | 表达不保存正文的 evidence / artifact / governance 线索关联事实,并保留可见性、完整性和消费目的语义。 |

#### A7.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `evidence_linkage_id` | `EvidenceLinkageId` | 证据关联身份。 |
| `boundary_ref` | `GovernanceArtifactEvidenceReference` | 回指外部证据边界对象。 |
| `linkage_state` | `EvidenceLinkageState` | 表达 linked、missing、not-visible 或 invalid。 |
| `digest_summary` | `DigestSummary` | 保存 body-free 完整性摘要。 |
| `consumer_purpose` | `EvidenceConsumerPurpose` | 说明该关联服务的消费目的。 |
| `visibility_reason` | `Option<EvidenceVisibilityReason>` | 说明当前不可见或受限原因。 |

#### A7.3 状态集合

| 状态 | 作用 |
|---|---|
| `Linked` | 引用和摘要均已成立。 |
| `Missing` | 目标对象缺失但必须显式表达。 |
| `NotVisible` | 目标存在但当前不可见。 |
| `InvalidDigest` | 引用存在但完整性摘要不可用。 |

#### A7.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `link_boundary_ref(GovernanceArtifactEvidenceReference boundary_ref, EvidenceConsumerPurpose consumer_purpose)` | 建立 body-free 关联。 |
| `mark_missing(GapState gap_state)` | 在引用缺失时显式标记 missing。 |
| `mark_not_visible(EvidenceVisibilityReason reason)` | 在可见性受限时转入 not-visible。 |
| `verify_digest(DigestSummary digest_summary, ActorContext actor)` | 记录完整性摘要已校验。 |

#### A7.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `body_free_link(GovernanceArtifactEvidenceReference boundary_ref, EvidenceConsumerPurpose consumer_purpose)` | 从外部边界对象建立 body-free 关联骨架。 |

#### A7.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不保存 evidence body 或 artifact body | body-free 是硬边界。 |
| 不静默跳过缺失 | 缺失必须进入 `Missing` 或 `NotVisible`。 |

---

## A8. `ReportHandoffRecord`

#### A8.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Report Handoff and Authenticity` |
| 对象类型 | domain aggregate |
| 主要责任 | 表达 observation-side report handoff 的正式交接事实,并承接 readiness、交接对象、evidence index input 和真实性提示边界。 |

#### A8.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `report_handoff_record_id` | `ReportHandoffRecordId` | 交接事实身份。 |
| `consumer_ref` | `ReportConsumerRef` | 回指正式消费边界对象。 |
| `handoff_readiness` | `HandoffReadinessState` | 表达当前是否 ready、blocked、pending 或 failed。 |
| `evidence_index_input_view_ref` | `EvidenceIndexInputViewRef` | 回指交接输入读侧。 |
| `authenticity_hint_ref` | `AuthenticityHintRef` | 回指真实性提示对象。 |
| `handoff_scope` | `HandoffScope` | 说明交接涉及的对象范围。 |

#### A8.3 状态集合

| 状态 | 作用 |
|---|---|
| `PendingEvaluation` | 交接条件尚未闭合。 |
| `Ready` | 可进行只读交接。 |
| `Blocked` | 因 gap、visibility 或 no-write 约束被阻塞。 |
| `Dispatched` | 已完成交接发送。 |
| `Failed` | 交接执行失败但不得回滚核心 truth。 |

#### A8.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `mark_ready(AuthenticityHint authenticity_hint, ActorContext actor)` | 在真实性提示闭合后标记 ready。 |
| `block(HandoffBlockReason reason, ActorContext actor)` | 因缺口或限制进入 blocked。 |
| `dispatch(ReportConsumerRef consumer_ref, ActorContext actor)` | 记录正式交接发送。 |
| `fail(HandoffFailureReason reason)` | 记录交接失败。 |

#### A8.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `prepare(AuditProjection audit_projection, EvidenceIndexInputView evidence_index_input_view, ReportConsumerRef consumer_ref)` | 从 audit / evidence 输入准备 handoff 骨架。 |

#### A8.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不生成真实 `run_id` 或 evidence alias | 交接事实不是运行证据本体。 |
| 不替代 final verdict 或 signoff | handoff 只交接观察线索和真实性提示。 |

---

## A9. `AuthenticityHint`

#### A9.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Report Handoff and Authenticity` |
| 对象类型 | value object |
| 主要责任 | 区分真实执行证据、待真实执行补齐材料和设计期占位,防止交接面伪造真实验收材料。 |

#### A9.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `authenticity_hint_id` | `AuthenticityHintId` | 提示身份。 |
| `hint_kind` | `AuthenticityHintKind` | 表达 real-execution、pending-real-run、design-placeholder 等类别。 |
| `evidence_origin_kind` | `EvidenceOriginKind` | 说明证据来源类型。 |
| `placeholder_state` | `PlaceholderState` | 标记是否仍是占位材料。 |
| `explanation_ref` | `AuthenticityExplanationRef` | 回指对消费方可见的解释摘要。 |

#### A9.3 状态集合

| 状态 | 作用 |
|---|---|
| `VerifiedExecution` | 已明确指向真实执行证据。 |
| `PendingRealExecution` | 仍待真实执行补齐。 |
| `DesignPlaceholder` | 明确只是设计期或示例材料。 |
| `Unavailable` | 无法给出真实性提示。 |

#### A9.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `confirm_real_execution(EvidenceOriginKind evidence_origin_kind, ActorContext actor)` | 标记已绑定真实执行证据。 |
| `mark_pending_real_run(AuthenticityGapReason reason)` | 标记仍需真实执行补齐。 |
| `mark_placeholder(PlaceholderReason reason)` | 标记当前只是假定或演示材料。 |

#### A9.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `assess(EvidenceIndexInputView evidence_index_input_view, GapState gap_state)` | 从交接输入和缺口状态评估真实性提示。 |

#### A9.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不伪造真实证据 | 提示只能说明真假边界,不能创造真实证据本体。 |
| 不隐藏占位材料 | 设计期占位必须明确可见。 |

---

## A10. `HandoffReadinessState`

#### A10.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Report Handoff and Authenticity` |
| 对象类型 | state enum |
| 主要责任 | 统一表达 report handoff 当前是否 ready、blocked、pending、failed 或 not-visible。 |

#### A10.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `readiness_kind` | `HandoffReadinessKind` | readiness 主类别。 |
| `blocking_reason` | `Option<HandoffBlockReason>` | 记录阻塞原因。 |
| `visibility_state` | `VisibilityStateKind` | 说明是否因可见性受限而不可交接。 |

#### A10.3 状态集合

| 状态 | 作用 |
|---|---|
| `Pending` | 条件尚未闭合。 |
| `Ready` | 可进行只读交接。 |
| `Blocked` | 因缺口、可见性或 no-write 约束被阻塞。 |
| `Failed` | 尝试交接失败。 |
| `NotVisible` | 当前消费者不可见。 |

#### A10.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `can_dispatch()` | 判断当前是否允许交接发送。 |
| `requires_authenticity_hint()` | 判断是否仍缺真实性提示。 |
| `is_terminal()` | 判断当前状态是否已到达终态。 |

#### A10.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `evaluate(ReadVisibilityState read_visibility_state, AuthenticityHint authenticity_hint, GapState gap_state)` | 从可见性、真实性提示和缺口语境计算 readiness。 |

#### A10.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不隐藏 blocked 原因 | readiness 不能只有真假,必须能解释 why。 |
| 不绕过 no-write guard | ready 不等于允许任何写源动作。 |
