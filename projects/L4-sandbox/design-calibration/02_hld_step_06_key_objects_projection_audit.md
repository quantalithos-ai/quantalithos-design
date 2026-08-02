# Step 6 附录 D. Projection / Reference / Audit 对象骨架

> 主控文件: `02_hld_step_06_key_objects.md`
> 覆盖组成部分: `Local reference, projection and derived support`;跨组成部分 audit / relay 支撑
> 状态: completed_wait_user_review

---

## D1. ReferenceResolutionState

### D1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Local reference, projection and derived support` |
| 对象类型 | state object / reference object |
| 主要责任 | 维护 identity、work、runner、tool、runtime、policy、artifact、observability、investigation 等外部 refs 的长期解析状态和刷新边界。 |

### D1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| reference_state_ref | `ReferenceResolutionStateRef` | 引用解析状态引用。 |
| tracked_refs | `TrackedExternalRefSet` | 被跟踪的外部 refs 集合。 |
| safe_summary_refs | `SafeSummaryRefSet` | body-free summary refs。 |
| resolution_status | `ReferenceResolutionStatus` | resolved、stale、unresolved、invalid、unavailable 等状态候选。 |
| refresh_marker | `ReferenceRefreshMarker` | 刷新、重建或对账 marker。 |
| forbidden_body_markers | `ForbiddenExternalBodyMarkerSet` | 不得入仓的外部正文 markers。 |

### D1.3 状态集合

| 状态 | 作用 |
|---|---|
| Resolved | 引用和摘要可用。 |
| Stale | 引用或摘要需刷新。 |
| Unresolved | 必需引用不可解析。 |
| Invalid | 引用不合法或越界。 |
| Unavailable | 外部来源不可用。 |

### D1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| mark_stale(ReferenceRefreshMarker refresh_marker) | 标记引用需要刷新。 |
| mark_resolved(SafeSummaryRefSet safe_summary_refs) | 标记引用已解析到安全摘要。 |
| rejects_external_body() | 判断是否存在外部正文进入风险。 |
| supports_query_surface() | 判断是否可支撑只读查询。 |

### D1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| track(TrackedExternalRefSet tracked_refs, ForbiddenExternalBodyMarkerSet forbidden_body_markers) | 创建引用解析状态。 |

### D1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不保存外部正文 | 只能保存 refs、summary refs、status 和 markers。 |
| 不作为核心通过前提 | 引用派生状态不替代 intake / boundary / policy truth。 |
| 不由 query service 拼接 refs | refs 和 summary 必须来自正式 resolver / source。 |

---

## D2. DerivedInspectPreviewTrendState

### D2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Local reference, projection and derived support` |
| 对象类型 | state object |
| 主要责任 | 维护 inspect、preview、trend、capacity / cost explanation 等派生材料的 freshness、rebuild 和 failure 状态。 |

### D2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| derived_state_ref | `DerivedInspectPreviewTrendStateRef` | 派生状态引用。 |
| source_refs | `DerivedSourceRefSet` | capture、handoff、failure、usage 等来源 refs。 |
| derived_kind | `DerivedMaterialKind` | inspect、preview、trend、comparison、reconciliation 等类别。 |
| freshness_status | `DerivedFreshnessStatus` | fresh、stale、rebuilding、failed、unavailable 等状态候选。 |
| rebuild_marker | `DerivedRebuildMarker` | 重建 marker。 |
| failure_summary | `DerivedFailureSummary` | 派生失败摘要。 |

### D2.3 状态集合

| 状态 | 作用 |
|---|---|
| Fresh | 派生材料可读取。 |
| Stale | 来源变化后需要重建。 |
| Rebuilding | 正在后台重建。 |
| Failed | 重建或读取失败。 |
| Unavailable | 来源或依赖不可用。 |

### D2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| mark_stale(DerivedRebuildMarker rebuild_marker) | 标记派生材料过期。 |
| start_rebuild(DerivedRebuildMarker rebuild_marker) | 标记派生重建开始。 |
| finish_rebuild(DerivedInspectPreviewTrendView view) | 标记派生视图重建完成。 |
| mark_failed(DerivedFailureSummary failure_summary) | 记录派生失败。 |

### D2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_sources(DerivedSourceRefSet source_refs, DerivedMaterialKind derived_kind) | 从来源 refs 创建派生状态。 |

### D2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不反写核心 truth | 派生状态只影响读取和维护。 |
| 不保存 preview / dashboard 正文 truth | 只保存 body-free 状态和 refs。 |
| 不阻断核心 capture / cleanup 闭环 | 派生失败不得伪造核心失败。 |

---

## D3. DerivedReadOnlyGuard

### D3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Local reference, projection and derived support` |
| 对象类型 | guard / policy |
| 主要责任 | 确保 query、inspect、preview、trend、backend comparison 和 reconciliation 只能读取或派生,不得成为写路径。 |

### D3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| guard_ref | `DerivedReadOnlyGuardRef` | 只读 guard 引用。 |
| allowed_read_kinds | `AllowedDerivedReadKindSet` | 允许的只读派生类别。 |
| forbidden_write_markers | `ForbiddenDerivedWriteMarkerSet` | 派生路径禁止写核心 truth 的 markers。 |

### D3.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| evaluate(DerivedInspectPreviewTrendState derived_state) | 判断派生状态是否只读合规。 |
| forbids_truth_mutation(DerivedMaterialKind derived_kind) | 判断某派生类别是否禁止写入核心 truth。 |

### D3.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| strict(AllowedDerivedReadKindSet allowed_read_kinds, ForbiddenDerivedWriteMarkerSet forbidden_write_markers) | 创建严格只读 guard。 |

### D3.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不被配置关闭 | 配置不得让派生路径写核心 truth。 |
| 不替代 domain guard | 只保护 read / derived surface。 |

---

## D4. ExternalBodyExclusionGuard

### D4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Local reference, projection and derived support` |
| 对象类型 | guard / policy |
| 主要责任 | 防止 identity、work、tool、runtime、policy、artifact、observability、investigation 或 UI 正文因排障、预览或对账进入 sandbox。 |

### D4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| guard_ref | `ExternalBodyExclusionGuardRef` | 外部正文排除 guard 引用。 |
| forbidden_body_markers | `ForbiddenExternalBodyMarkerSet` | 明确禁止保存的正文类别。 |
| allowed_summary_kinds | `AllowedSafeSummaryKindSet` | 允许保存的 safe summary 类别。 |

### D4.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| evaluate(ReferenceResolutionState reference_state) | 判断引用状态是否存在外部正文入仓风险。 |
| permits_summary(SafeSummaryKind safe_summary_kind) | 判断某摘要类别是否允许保存。 |
| rejects_body(ExternalBodyMarker body_marker) | 判断某正文 marker 是否必须拒绝。 |

### D4.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_allowed_summaries(AllowedSafeSummaryKindSet allowed_summary_kinds, ForbiddenExternalBodyMarkerSet forbidden_body_markers) | 创建正文排除 guard。 |

### D4.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不保存 raw external payload | raw payload 属于外部仓或下游系统。 |
| 不因 debug / replay 放宽 | 排障和 replay 也只能用 refs、summary 和 material。 |

---

## D5. SandboxReadProjection

### D5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Local reference, projection and derived support` |
| 对象类型 | projection / read model |
| 主要责任 | 汇总 execution context、boundary、policy、capture、handoff、failure、cleanup 和 redline 的只读状态面。 |

### D5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| projection_ref | `SandboxReadProjectionRef` | read projection 引用。 |
| context_ref | `ControlledExecutionContextRef` | 回指执行语境。 |
| status_view_refs | `SandboxStatusViewRefSet` | status / boundary / policy / capture / failure / cleanup / redline 视图 refs。 |
| projection_status | `SandboxProjectionStatus` | fresh、stale、rebuilding、degraded 等状态候选。 |
| degraded_markers | `SandboxReadProjectionDegradedMarkerSet` | 读取降级 markers。 |

### D5.3 状态集合

| 状态 | 作用 |
|---|---|
| Fresh | 视图与核心 truth 同步。 |
| Stale | 核心 truth 变化后待刷新。 |
| Rebuilding | 正在重建投影。 |
| Degraded | 投影可读但不完整。 |
| Unavailable | 投影不可用,不得伪造核心状态。 |

### D5.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| mark_stale(SandboxProjectionStaleReason reason) | 标记投影过期。 |
| rebuild_from_truth(SandboxTruthSnapshot truth_snapshot) | 从核心 truth 快照重建投影。 |
| is_degraded() | 判断投影是否降级。 |

### D5.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| create(ControlledExecutionContext context, SandboxStatusViewRefSet status_view_refs) | 创建 sandbox 读取投影。 |

### D5.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不作为 truth source | projection 可重建,不得反写核心。 |
| 不保存外部正文 | 只保存本仓视图 refs 和状态摘要。 |

---

## D6. DerivedInspectPreviewTrendView

### D6.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Local reference, projection and derived support` |
| 对象类型 | projection / read model |
| 主要责任 | 提供 inspect、preview、trend 和结果分析辅助的只读视图。 |

### D6.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| view_ref | `DerivedInspectPreviewTrendViewRef` | 派生视图引用。 |
| derived_state_ref | `DerivedInspectPreviewTrendStateRef` | 回指派生状态。 |
| source_refs | `DerivedSourceRefSet` | 来源 refs。 |
| preview_summary | `SafePreviewSummary` | 安全预览摘要。 |
| trend_summary | `SafeTrendSummary` | 趋势摘要。 |
| visible_status | `DerivedVisibleStatus` | 面向查询的派生状态。 |

### D6.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| from_derived_state(DerivedInspectPreviewTrendState derived_state, SafePreviewSummary preview_summary) | 构造派生只读视图。 |
| is_safe_to_show() | 判断视图是否可被展示。 |

### D6.4 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不包含原始 output body | 只包含安全摘要。 |
| 不驱动核心状态迁移 | preview / trend 不能改变 capture / handoff / cleanup truth。 |

---

## D7. BackendCapabilityComparisonView

### D7.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Local reference, projection and derived support` |
| 对象类型 | projection / read model |
| 主要责任 | 提供后端 capability、boundary outcome、capacity / cost markers 的只读比较视图。 |

### D7.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| view_ref | `BackendCapabilityComparisonViewRef` | backend comparison 视图引用。 |
| capability_refs | `BackendCapabilitySummaryRefSet` | 被比较的后端能力摘要 refs。 |
| boundary_outcome_refs | `BoundaryEstablishmentDecisionRefSet` | 相关边界裁定 refs。 |
| comparison_summary | `BackendCapabilityComparisonSummary` | 比较摘要,不定义后端选择 truth。 |
| simulation_markers | `PolicySimulationMarkerSet` | policy simulation / risk analysis markers。 |

### D7.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| from_capabilities(BackendCapabilitySummarySet capabilities, BoundaryEstablishmentDecisionSet decisions) | 从能力摘要和边界结果构造比较视图。 |
| does_not_select_backend() | 明确该视图不决定正式后端选择。 |

### D7.4 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不定义后端产品 lifecycle | 只读比较不拥有 backend truth。 |
| 不替代 boundary decision | 正式建立裁定仍由 `BoundaryEstablishmentDecision` 承接。 |

---

## D8. SandboxReconciliationReport

### D8.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Local reference, projection and derived support` |
| 对象类型 | report / projection |
| 主要责任 | 对核心 truth、projection、handoff、event relay 和 derived material 做只读对账报告。 |

### D8.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| report_ref | `SandboxReconciliationReportRef` | 对账报告引用。 |
| scope_ref | `SandboxReconciliationScopeRef` | 对账范围。 |
| checked_truth_refs | `SandboxTruthRefSet` | 被检查的核心 truth refs。 |
| checked_projection_refs | `SandboxProjectionRefSet` | 被检查的 projection refs。 |
| findings | `SandboxReconciliationFindingSet` | 对账发现摘要。 |
| report_status | `SandboxReconciliationReportStatus` | clean、issues-found、degraded、failed 等状态候选。 |

### D8.3 状态集合

| 状态 | 作用 |
|---|---|
| Clean | 未发现对账问题。 |
| IssuesFound | 发现 projection / handoff / relay 不一致。 |
| Degraded | 依赖不可用导致对账降级。 |
| Failed | 对账失败。 |

### D8.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| has_blocking_findings() | 判断对账发现是否阻断后续维护。 |
| mark_degraded(SandboxReconciliationDegradedReason reason) | 标记对账降级。 |

### D8.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| create(SandboxReconciliationScopeRef scope_ref, SandboxTruthRefSet truth_refs, SandboxProjectionRefSet projection_refs) | 创建对账报告。 |

### D8.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不自动修正核心 truth | 对账只能报告,修复需走正式 flow。 |
| 不读取外部正文 | 对账基于 refs、summary 和本仓 truth。 |

---

## D9. SandboxAuditTrace

### D9.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 跨所有主要组成部分 |
| 对象类型 | audit record / history record |
| 主要责任 | 统一记录受理、boundary、policy、capture、handoff、failure、control、cleanup、redline、projection 和 reconciliation 的审计 trace。 |

### D9.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| audit_trace_ref | `SandboxAuditTraceRef` | 审计 trace 引用。 |
| trace_subject_ref | `SandboxTraceSubjectRef` | 被审计主体引用。 |
| trace_kind | `SandboxAuditTraceKind` | intake、boundary、policy、capture、handoff、failure、cleanup、redline、derived 等类别。 |
| actor_context | `AuditActorContext` | 发起或系统 actor 摘要。 |
| reason_summary | `AuditReasonSummary` | 审计原因摘要。 |
| material_refs | `AuditMaterialRefSet` | 关联 capture / observability / investigation material refs。 |
| occurred_at | `AuditInstant` | 审计发生时间。 |

### D9.3 状态集合

| 状态 | 作用 |
|---|---|
| Recorded | trace 已记录。 |
| Linked | trace 已关联到正式 subject。 |
| RelayPending | 等待 event / observability relay。 |
| RelayFailed | relay 失败,但 trace truth 不消失。 |

### D9.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| link_to_subject(SandboxTraceSubjectRef trace_subject_ref) | 关联正式审计主体。 |
| attach_material(AuditMaterialRefSet material_refs) | 关联审计材料 refs。 |
| requires_event_relay() | 判断是否需要 event relay。 |

### D9.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| record(SandboxAuditTraceKind trace_kind, AuditActorContext actor_context, AuditReasonSummary reason_summary) | 创建审计 trace。 |

### D9.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不保存 raw audit store 正文 | 物理日志 / observability store 外部拥有。 |
| 不替代各 domain fact | trace 只能审计,不能成为业务 truth 本身。 |
| 不伪造 subject | trace subject 必须来自正式对象 ref。 |

---

## D10. SandboxEventRelayRecord

### D10.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 跨 `Execution capture and material handoff` 与 `Local reference, projection and derived support` |
| 对象类型 | outbox record / handoff record |
| 主要责任 | 记录已成立 sandbox fact 向 bus、downstream consumer 或 observability relay 的传播状态和失败语义。 |

### D10.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| relay_record_ref | `SandboxEventRelayRecordRef` | event relay 记录引用。 |
| source_fact_ref | `SandboxSourceFactRef` | 被传播的已成立 sandbox fact。 |
| target_refs | `EventRelayTargetRefSet` | 事件、downstream consumer 或 observability 目标 refs。 |
| relay_kind | `SandboxEventRelayKind` | fact changed、handoff changed、failure changed、cleanup changed、redline changed 等类别。 |
| relay_status | `SandboxEventRelayStatus` | pending、published、failed、retryable、dead-letter 等状态候选。 |
| relay_failure_summary | `RelayFailureSummary` | relay 失败摘要。 |
| audit_trace_ref | `SandboxAuditTraceRef` | 回指审计 trace。 |

### D10.3 状态集合

| 状态 | 作用 |
|---|---|
| Pending | 待传播。 |
| Published | 已发布或已交接。 |
| Failed | 传播失败。 |
| Retryable | 可重试失败。 |
| DeadLetter | 不可重试或进入人工处理。 |

### D10.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| mark_published(RelayReceiptSummary receipt_summary) | 标记发布成功。 |
| mark_failed(RelayFailureSummary relay_failure_summary) | 标记发布失败。 |
| is_retryable() | 判断是否可重试。 |

### D10.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| open(SandboxSourceFactRef source_fact_ref, EventRelayTargetRefSet target_refs, SandboxEventRelayKind relay_kind) | 为已成立 fact 创建 relay 记录。 |

### D10.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不成为 bus truth | bus 只是协作传播,不是 sandbox truth store。 |
| 不让 relay failure 取消已成立 truth | 发布失败只能影响 relay / handoff / projection 状态。 |
| 不写 event payload schema | payload 和 topic 留给 Step 7 / `03`。 |

---

## D11. SandboxExecutionStatusView

### D11.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Controlled execution intake and identity` |
| 对象类型 | projection / read model |
| 主要责任 | 提供 execution context、identity、boundary、policy、run、capture、failure 和 cleanup 的综合只读状态入口。 |

### D11.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| view_ref | `SandboxExecutionStatusViewRef` | 执行状态视图引用。 |
| context_ref | `ControlledExecutionContextRef` | 回指执行语境。 |
| environment_identity_ref | `ExecutionEnvironmentIdentityRef` | 回指执行环境身份。 |
| visible_execution_status | `VisibleSandboxExecutionStatus` | 面向查询的综合状态。 |
| status_source_refs | `SandboxStatusSourceRefSet` | 参与组装的 status view refs。 |
| degraded_markers | `SandboxExecutionStatusDegradedMarkerSet` | 读取降级 markers。 |

### D11.3 状态集合

| 状态 | 作用 |
|---|---|
| VisiblePending | 受理或引用解析未完成。 |
| VisibleReady | context、boundary、policy 前置已满足。 |
| VisibleRunning | 正在受控执行。 |
| VisibleCompleted | 执行和 capture 主线完成。 |
| VisibleFailed | 失败 / control / cleanup / redline 主线生效。 |
| VisibleDegraded | 读取面降级。 |

### D11.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assemble(SandboxStatusSourceRefSet status_source_refs) | 从各状态视图组装综合状态。 |
| is_degraded() | 判断综合状态读取是否降级。 |

### D11.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不成为全局状态机 | 只读汇总不能替代各对象状态。 |
| 不反写核心 truth | 状态展示不推进执行。 |

---

## D12. PolicyDecisionSummaryView

### D12.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Policy execution decision` |
| 对象类型 | projection / read model |
| 主要责任 | 提供 policy execution decision、high-risk action decision 和 fail-closed 原因的只读摘要。 |

### D12.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| view_ref | `PolicyDecisionSummaryViewRef` | policy 决策摘要视图引用。 |
| policy_decision_ref | `PolicyExecutionDecisionRef` | 回指 policy 裁定。 |
| high_risk_action_refs | `HighRiskActionDecisionRefSet` | 回指高风险动作裁定。 |
| visible_policy_status | `VisiblePolicyDecisionStatus` | accepted、rejected、blocked、pending、fail-closed 等查询状态。 |
| fail_closed_summary | `FailClosedSummary` | 保守拒绝摘要。 |

### D12.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| from_policy_decision(PolicyExecutionDecision decision, HighRiskActionDecisionSet high_risk_actions) | 构造 policy 决策只读摘要。 |
| blocks_execution() | 判断摘要是否展示为阻断执行。 |

### D12.4 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不泄露 policy 正文 | 只展示摘要和状态。 |
| 不替代 policy decision truth | 视图只读。 |
