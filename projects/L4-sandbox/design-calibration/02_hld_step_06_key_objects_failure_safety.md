# Step 6 附录 C. Failure / Control / Cleanup / Redline 对象骨架

> 主控文件: `02_hld_step_06_key_objects.md`
> 覆盖组成部分: `Failure control and safety closure`
> 状态: completed_wait_user_review

---

## C1. FailureClassification

### C1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Failure control and safety closure` |
| 对象类型 | domain entity / state object |
| 主要责任 | 将 timeout、deny、backend failure、resource exceeded、capture failure、handoff failure、orphan 和 redline 等非 happy path 归并为稳定失败分类。 |

### C1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| failure_ref | `FailureClassificationRef` | 失败分类引用。 |
| context_ref | `ControlledExecutionContextRef` | 回指执行语境。 |
| run_ref | `ControlledExecutionRunRef` | 可选回指运行对象。 |
| failure_kind | `SandboxFailureKind` | timeout、deny、backend、capture、handoff、resource、redline 等概要分类。 |
| failure_status | `FailureClassificationStatus` | classified、pending-input、superseded、terminal 等状态候选。 |
| source_markers | `FailureSourceMarkerSet` | 失败来源 markers。 |
| audit_trace_ref | `SandboxAuditTraceRef` | 回指失败审计。 |

### C1.3 状态集合

| 状态 | 作用 |
|---|---|
| PendingInput | 需要更多 material 或 backend/control 反馈。 |
| Classified | 已形成稳定分类。 |
| Superseded | 后续 redline 或 control 改变了失败解释。 |
| Terminal | 失败已作为终态收束。 |

### C1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| is_terminal_failure() | 判断是否阻止后续执行。 |
| requires_cleanup_guard() | 判断是否需要 cleanup guard 保护材料。 |
| requires_redline_containment() | 判断是否升级为 redline containment。 |

### C1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| classify(FailureSourceMarkerSet source_markers, ControlledExecutionContext context, SandboxAuditTrace trace) | 从失败 markers 创建分类。 |
| from_policy_deny(PolicyExecutionDecision decision, SandboxAuditTrace trace) | 从 policy 拒绝创建失败分类。 |
| from_capture_failure(CaptureFact capture, SandboxAuditTrace trace) | 从 capture failure 创建失败分类。 |

### C1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不等于 runtime result | runtime execution truth 不归 sandbox。 |
| 不把失败伪装 success | 所有非 happy path 必须显式分类或 pending。 |
| 不写完整 failure taxonomy | taxonomy 细节后移 Step 9 / Step 10 / `03`。 |

---

## C2. ControlFact

### C2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Failure control and safety closure` |
| 对象类型 | domain entity / fact |
| 主要责任 | 记录 kill、cancel、cleanup、deny、timeout、replay-like investigation request 等控制动作的正式事实和冲突收束。 |

### C2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| control_ref | `ControlFactRef` | 控制事实引用。 |
| context_ref | `ControlledExecutionContextRef` | 回指执行语境。 |
| control_kind | `SandboxControlKind` | kill、cancel、cleanup、deny、timeout、investigation 等概要类别。 |
| control_source | `ControlSourceContext` | 控制来源摘要。 |
| control_status | `ControlFactStatus` | accepted、ignored-duplicate、conflicted、completed、failed 等状态候选。 |
| failure_ref | `FailureClassificationRef` | 可选关联失败分类。 |
| audit_trace_ref | `SandboxAuditTraceRef` | 回指控制审计。 |

### C2.3 状态集合

| 状态 | 作用 |
|---|---|
| Accepted | 控制动作已作为正式事实受理。 |
| IgnoredDuplicate | 重复控制信号已收束。 |
| Conflicted | 与现有执行 / cleanup / redline 状态冲突。 |
| Completed | 控制动作已完成。 |
| Failed | 控制执行失败,需后续处理。 |

### C2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| conflicts_with(ControlFact existing_control) | 判断同一执行内控制冲突。 |
| requires_termination() | 判断是否需要终止运行。 |
| requires_cleanup_guard() | 判断是否触发 cleanup guard。 |

### C2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| accept(ControlSourceContext source, SandboxControlKind control_kind, ControlledExecutionContext context) | 创建正式控制事实。 |
| duplicate(ControlFact existing_control, ControlSourceContext source) | 创建重复控制收束记录。 |
| conflict(ControlFact existing_control, ControlSourceContext source, ControlConflictReason reason) | 创建控制冲突事实。 |

### C2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不执行业务 replay | replay-like request 只作为调查 / 控制事实,不重放业务。 |
| 不推进 runtime recover | runtime recover truth 外部拥有。 |
| 不由调用方私有日志替代 | 控制必须形成 sandbox 正式事实。 |

---

## C3. LeaseRecord

### C3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Failure control and safety closure` |
| 对象类型 | domain entity / lifecycle record |
| 主要责任 | 记录隔离环境 lease、过期判断和后台 reaper / orphan 检测所需的生命周期边界。 |

### C3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| lease_ref | `LeaseRecordRef` | lease 记录引用。 |
| isolation_handle_ref | `IsolationEnvironmentHandleRef` | 回指隔离环境 handle。 |
| context_ref | `ControlledExecutionContextRef` | 回指执行语境。 |
| lease_status | `LeaseStatus` | active、expiring、expired、released、orphan-suspected 等状态候选。 |
| lease_window | `LeaseWindow` | lease 有效区间概要。 |
| reaper_marker | `ReaperEligibilityMarker` | 是否进入 reaper 检查的 marker。 |

### C3.3 状态集合

| 状态 | 作用 |
|---|---|
| Active | lease 当前有效。 |
| Expiring | 即将过期,需要后台检查。 |
| Expired | 已过期,可能触发 orphan / cleanup。 |
| Released | 隔离环境已释放。 |
| OrphanSuspected | lease 与后端状态不一致。 |

### C3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| is_expired(EvaluationInstant now) | 判断 lease 是否过期。 |
| requires_orphan_detection() | 判断是否需要孤儿环境检测。 |
| mark_released(SandboxAuditTrace trace) | 标记 lease 对应环境释放。 |

### C3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| open(IsolationEnvironmentHandle handle, LeaseWindow lease_window) | 为隔离环境创建 lease。 |

### C3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不代表 backend lifecycle truth | 只表达 sandbox 对 lifecycle 的约束。 |
| 不允许过期环境继续托管外运行 | 过期必须进入检查、回收或 containment。 |

---

## C4. OrphanRecoveryRecord

### C4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Failure control and safety closure` |
| 对象类型 | history record / lifecycle record |
| 主要责任 | 记录孤儿环境发现、确认、保守回收和未能回收的事实。 |

### C4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| orphan_record_ref | `OrphanRecoveryRecordRef` | 孤儿回收记录引用。 |
| lease_ref | `LeaseRecordRef` | 回指 lease。 |
| isolation_handle_ref | `IsolationEnvironmentHandleRef` | 回指隔离环境 handle。 |
| orphan_status | `OrphanRecoveryStatus` | suspected、confirmed、recovering、recovered、failed 等状态候选。 |
| backend_lifecycle_summary | `BackendLifecycleSummary` | 后端生命周期摘要,不保存后端正文。 |
| cleanup_guard_ref | `CleanupGuardRef` | 回指 cleanup guard。 |
| audit_trace_ref | `SandboxAuditTraceRef` | 回指审计 trace。 |

### C4.3 状态集合

| 状态 | 作用 |
|---|---|
| Suspected | 发现 sandbox truth 与后端状态不一致。 |
| Confirmed | 确认为孤儿环境。 |
| Recovering | 正在保守回收。 |
| Recovered | 已回收并保留审计。 |
| Failed | 回收失败,需后续控制或 redline 处理。 |

### C4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| confirm(BackendLifecycleSummary backend_lifecycle_summary) | 标记孤儿确认。 |
| mark_recovered(SandboxAuditTrace trace) | 标记保守回收完成。 |
| mark_failed(OrphanRecoveryFailureReason reason, SandboxAuditTrace trace) | 标记回收失败。 |

### C4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| suspect(LeaseRecord lease, IsolationEnvironmentHandle handle, BackendLifecycleSummary backend_lifecycle_summary) | 创建疑似孤儿记录。 |

### C4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不重写 runtime / member / backend truth | 只记录 sandbox 侧发现和收束。 |
| 不绕过 cleanup guard | 回收不能先删证据或破坏调查材料。 |

---

## C5. CleanupGuard

### C5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Failure control and safety closure` |
| 对象类型 | guard / domain entity |
| 主要责任 | 在 cleanup / reaper / release 前确认 capture、handoff、audit、investigation 和 redline material 不会被破坏。 |

### C5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| cleanup_guard_ref | `CleanupGuardRef` | cleanup guard 引用。 |
| context_ref | `ControlledExecutionContextRef` | 回指执行语境。 |
| capture_ref | `CaptureFactRef` | 回指捕获事实。 |
| handoff_ref | `HandoffFactRef` | 回指交接事实。 |
| investigation_summary | `InvestigationHandoffSummary` | 安全调查 / 保留状态摘要。 |
| guard_status | `CleanupGuardStatus` | allowed、blocked、pending、completed 等状态候选。 |
| blocking_reasons | `CleanupBlockingReasonSet` | 阻断 cleanup 的原因集合。 |

### C5.3 状态集合

| 状态 | 作用 |
|---|---|
| PendingEvidence | 等待 capture / handoff / audit material 安全交接。 |
| PendingInvestigation | 等待调查或安全交接状态。 |
| Blocked | cleanup 被阻断。 |
| Allowed | cleanup 可继续。 |
| Completed | cleanup 已完成且保留 trace。 |

### C5.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| evaluate(CaptureFact capture, HandoffFact handoff, InvestigationHandoffSummary investigation_summary) | 判断 cleanup 是否允许、阻断或 pending。 |
| blocks_cleanup() | 判断当前 guard 是否阻断 cleanup。 |
| allow(CleanupSafetyGuard safety_guard, SandboxAuditTrace trace) | 在 safety guard 通过后允许 cleanup。 |
| block(CleanupBlockingReasonSet blocking_reasons, SandboxAuditTrace trace) | 记录 cleanup 阻断原因。 |

### C5.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| open(ControlledExecutionContext context, CaptureFact capture, HandoffFact handoff) | 创建 cleanup guard。 |

### C5.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不允许先删证据 | 材料未安全交接或调查未放行时必须 blocked / pending。 |
| 不拥有 artifact retention truth | retention 正文外部拥有,本对象只消费摘要。 |

---

## C6. RedlineContainment

### C6.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Failure control and safety closure` |
| 对象类型 | domain entity / safety record |
| 主要责任 | 记录 escape-like、越权访问、未授权外联或其他安全红线事件的保守 containment、留痕和调查交接。 |

### C6.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| redline_ref | `RedlineContainmentRef` | redline containment 引用。 |
| context_ref | `ControlledExecutionContextRef` | 回指执行语境。 |
| boundary_ref | `CoherentBoundaryRef` | 回指相关边界。 |
| redline_kind | `SecurityRedlineKind` | escape-like、unauthorized-network、host-access 等概要类别。 |
| containment_status | `RedlineContainmentStatus` | detected、contained、handoff-pending、released、terminal 等状态候选。 |
| investigation_handoff_ref | `InvestigationHandoffRef` | 调查交接引用。 |
| audit_trace_ref | `SandboxAuditTraceRef` | 回指安全审计 trace。 |

### C6.3 状态集合

| 状态 | 作用 |
|---|---|
| Detected | 已识别红线信号。 |
| Contained | 已保守阻断或隔离影响。 |
| HandoffPending | 等待安全调查交接。 |
| Released | 在调查或安全条件满足后解除 containment。 |
| Terminal | 以安全终态收束。 |

### C6.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| contain(RedlineContainmentGuard guard, SandboxAuditTrace trace) | 按 guard 执行保守 containment。 |
| request_investigation_handoff(InvestigationHandoffSummary investigation_summary) | 发起安全调查交接。 |
| release(RedlineReleaseSummary release_summary, SandboxAuditTrace trace) | 在允许时解除 containment。 |
| blocks_cleanup() | 判断 redline 是否阻断 cleanup / release。 |

### C6.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| detect(ControlledExecutionContext context, CoherentBoundary boundary, SecurityRedlineKind redline_kind, SandboxAuditTrace trace) | 从红线信号创建 containment 对象。 |

### C6.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不作为 advisory-only 提示 | 红线必须有 containment / handoff / audit。 |
| 不拥有 investigation lifecycle | 调查正文和生命周期外部拥有。 |
| 不允许 cleanup 绕过 containment | redline 未收束时 cleanup 必须受 guard 控制。 |

---

## C7. ControlConflictGuard

### C7.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Failure control and safety closure` |
| 对象类型 | guard / policy |
| 主要责任 | 判断同一执行内 kill、cancel、cleanup、replay-like investigation 等 control 信号是否重复、乱序或冲突。 |

### C7.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| guard_ref | `ControlConflictGuardRef` | control conflict guard 引用。 |
| conflict_rules | `ControlConflictRuleSet` | 控制冲突规则摘要。 |
| terminal_control_kinds | `TerminalControlKindSet` | 终态控制类型集合。 |

### C7.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| evaluate(ControlFact incoming_control, ControlFact existing_control) | 判断 incoming control 是否重复或冲突。 |
| is_terminal_override(ControlFact incoming_control) | 判断是否允许终态覆盖。 |

### C7.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| strict(ControlConflictRuleSet conflict_rules, TerminalControlKindSet terminal_control_kinds) | 创建严格控制冲突 guard。 |

### C7.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不让调用方差异产生第二套 control 语义 | 同一 control 信号必须统一收束。 |
| 不静默吞掉冲突 | 冲突必须记录为 control fact 或 pending。 |

---

## C8. CleanupSafetyGuard

### C8.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Failure control and safety closure` |
| 对象类型 | guard / policy |
| 主要责任 | 对 cleanup guard 的放行进行二次安全判断,防止材料、handoff 或调查状态被破坏。 |

### C8.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| guard_ref | `CleanupSafetyGuardRef` | cleanup safety guard 引用。 |
| required_handoff_status | `RequiredHandoffStatusSet` | cleanup 前必须满足的 handoff 状态。 |
| required_investigation_status | `RequiredInvestigationStatusSet` | cleanup 前必须满足的调查状态。 |
| safety_rules | `CleanupSafetyRuleSet` | cleanup 安全规则摘要。 |

### C8.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| evaluate(CleanupGuard cleanup_guard) | 判断 cleanup guard 是否可安全放行。 |
| explains_blockers(CleanupGuard cleanup_guard) | 返回阻断原因摘要。 |

### C8.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_rules(CleanupSafetyRuleSet safety_rules, RequiredHandoffStatusSet required_handoff_status) | 创建 cleanup safety guard。 |

### C8.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不被配置绕过 | cleanup 安全红线不得配置关闭。 |
| 不拥有 artifact retention 正文 | 只消费摘要和 refs。 |

---

## C9. RedlineContainmentGuard

### C9.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Failure control and safety closure` |
| 对象类型 | guard / policy |
| 主要责任 | 判断红线事件必须如何 containment、是否阻断执行、是否阻断 cleanup、是否需要 investigation handoff。 |

### C9.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| guard_ref | `RedlineContainmentGuardRef` | redline guard 引用。 |
| redline_rules | `SecurityRedlineRuleSet` | 红线处置规则摘要。 |
| containment_requirements | `ContainmentRequirementSet` | containment 必须动作集合。 |
| investigation_requirements | `InvestigationRequirementSet` | 调查交接要求。 |

### C9.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| evaluate(RedlineContainment containment) | 判断 containment 是否满足规则。 |
| requires_investigation(RedlineContainment containment) | 判断是否需要调查交接。 |
| blocks_release(RedlineContainment containment) | 判断是否阻断释放或 cleanup。 |

### C9.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_rules(SecurityRedlineRuleSet redline_rules, ContainmentRequirementSet containment_requirements) | 创建红线 containment guard。 |

### C9.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不将 redline 降为 warning | 红线必须 containment。 |
| 不定义完整安全调查流程 | 调查生命周期外部拥有。 |

---

## C10. FailureControlStatusView

### C10.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Failure control and safety closure` |
| 对象类型 | projection / read model |
| 主要责任 | 为查询和对账提供 failure classification、control fact 和 conflict 状态摘要。 |

### C10.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| view_ref | `FailureControlStatusViewRef` | failure / control 状态视图引用。 |
| failure_ref | `FailureClassificationRef` | 回指失败分类。 |
| control_refs | `ControlFactRefSet` | 相关控制事实 refs。 |
| visible_failure_status | `VisibleFailureStatus` | 面向查询的失败状态。 |
| visible_control_status | `VisibleControlStatus` | 面向查询的控制状态。 |
| degraded_markers | `FailureControlViewDegradedMarkerSet` | 读取降级 markers。 |

### C10.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| from_failure_and_control(FailureClassification failure, ControlFactSet controls) | 构造只读状态视图。 |
| is_terminal() | 判断 failure / control 是否终态。 |

### C10.4 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不推进 control 状态 | 视图只读。 |
| 不替代 runtime result | 只表达 sandbox failure / control。 |

---

## C11. CleanupReadinessView

### C11.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Failure control and safety closure` |
| 对象类型 | projection / read model |
| 主要责任 | 表达 cleanup guard、handoff、investigation 和 lease / orphan 状态是否允许 cleanup / release。 |

### C11.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| view_ref | `CleanupReadinessViewRef` | cleanup readiness 视图引用。 |
| cleanup_guard_ref | `CleanupGuardRef` | 回指 cleanup guard。 |
| lease_ref | `LeaseRecordRef` | 回指 lease。 |
| orphan_record_ref | `OrphanRecoveryRecordRef` | 可选回指孤儿记录。 |
| visible_cleanup_status | `VisibleCleanupStatus` | allowed、blocked、pending、completed 等查询状态。 |
| blocking_reasons | `CleanupBlockingReasonSet` | 阻断原因摘要。 |

### C11.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| from_cleanup_guard(CleanupGuard cleanup_guard, LeaseRecord lease) | 构造 cleanup readiness view。 |
| blocks_release() | 判断是否阻断环境释放。 |

### C11.4 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不成为 cleanup truth | 只读视图不能放行 cleanup。 |
| 不保存 investigation 正文 | 只显示调查状态摘要。 |

---

## C12. RedlineContainmentView

### C12.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Failure control and safety closure` |
| 对象类型 | projection / read model |
| 主要责任 | 为查询、安全审查和对账提供 redline containment 状态摘要。 |

### C12.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| view_ref | `RedlineContainmentViewRef` | redline containment 视图引用。 |
| redline_ref | `RedlineContainmentRef` | 回指 redline containment。 |
| visible_redline_status | `VisibleRedlineStatus` | detected、contained、handoff-pending、released、terminal 等查询状态。 |
| investigation_handoff_ref | `InvestigationHandoffRef` | 调查交接引用。 |
| safety_markers | `RedlineSafetyMarkerSet` | 安全审查 markers。 |

### C12.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| from_redline(RedlineContainment redline) | 构造 redline 只读视图。 |
| requires_attention() | 判断是否需要安全审查关注。 |

### C12.4 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不解除 containment | 解除必须通过 redline domain 对象和 guard。 |
| 不保存调查正文 | 只保存 refs、summary 和 markers。 |
