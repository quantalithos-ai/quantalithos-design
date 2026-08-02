# Step 6 附录 B. Policy / Capture / Handoff 对象骨架

> 主控文件: `02_hld_step_06_key_objects.md`
> 覆盖组成部分: `Policy execution decision`;`Execution capture and material handoff`
> 状态: completed_wait_user_review

---

## B1. PolicyApplicabilitySnapshot

### B1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Policy execution decision` |
| 对象类型 | snapshot / reference object |
| 主要责任 | 承接外部给定 launch / isolation policy、authorization、approval 或 capability 摘要,供 sandbox 执行裁定使用。 |

### B1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| snapshot_ref | `PolicyApplicabilitySnapshotRef` | policy 适用性摘要引用。 |
| context_ref | `ControlledExecutionContextRef` | 回指执行语境。 |
| policy_refs | `PolicySourceRefSet` | 外部 policy / approval / capability refs。 |
| authorization_summary | `AuthorizationSummary` | 给定授权摘要,不保存 approval workflow 正文。 |
| applicability_status | `PolicyApplicabilityStatus` | applicable、missing、conflicted、unsupported、stale 等状态候选。 |
| high_risk_markers | `HighRiskActionMarkerSet` | 高风险动作、边界扩张或外联尝试摘要。 |

### B1.3 状态集合

| 状态 | 作用 |
|---|---|
| Applicable | 摘要足以进行执行裁定。 |
| Missing | 必需 policy 或 authorization 缺失。 |
| Conflicted | policy 输入冲突。 |
| Unsupported | 后端或 policy 来源不支持当前动作。 |
| Stale | 摘要过期,不得直接继续执行。 |

### B1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| can_evaluate() | 判断是否可进入 policy execution decision。 |
| requires_fail_closed() | 判断缺失、冲突、不支持或过期时是否必须保守拒绝。 |
| contains_high_risk_action() | 判断是否包含需独立阻断或解释的动作。 |

### B1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_policy_summary(ControlledExecutionContext context, PolicySourceRefSet policy_refs, AuthorizationSummary authorization_summary) | 从外部 policy 摘要创建适用性快照。 |

### B1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不保存 policy DSL / allowlist / approval 正文 | 只保存 refs 和摘要。 |
| 不自行生成 policy truth | sandbox 只执行给定 policy。 |
| 不把 stale / unknown 写成 allow | 缺失或过期时必须 pending / fail-closed。 |

---

## B2. PolicyExecutionDecision

### B2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Policy execution decision` |
| 对象类型 | decision object / domain entity |
| 主要责任 | 表达 sandbox 对给定 policy 和受控执行语境的继续、拒绝、阻断、等待或 fail-closed 裁定。 |

### B2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| decision_ref | `PolicyExecutionDecisionRef` | policy 执行裁定引用。 |
| context_ref | `ControlledExecutionContextRef` | 回指执行语境。 |
| boundary_requirement_ref | `BoundaryRequirementSetRef` | 回指被裁定的边界需求。 |
| snapshot_ref | `PolicyApplicabilitySnapshotRef` | 回指给定 policy 摘要。 |
| decision_status | `PolicyExecutionDecisionStatus` | accepted、rejected、blocked、pending、fail-closed 等状态候选。 |
| decision_reason | `PolicyExecutionDecisionReason` | 裁定原因摘要。 |
| audit_trace_ref | `SandboxAuditTraceRef` | 回指 policy 裁定审计。 |

### B2.3 状态集合

| 状态 | 作用 |
|---|---|
| Accepted | 给定 policy 允许继续执行。 |
| Rejected | policy 或授权拒绝。 |
| Blocked | 高风险动作或红线前置条件阻断。 |
| Pending | 等待 policy / authorization / capability 摘要。 |
| FailClosed | 缺失、冲突、不支持或不可解析导致保守失败。 |

### B2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| permits_execution() | 判断是否允许进入受控执行运行。 |
| must_block_launch() | 判断是否必须阻断 launch。 |
| to_failure_classification_seed() | 为 failure classification 提供 deny / fail-closed 种子。 |

### B2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| accept(PolicyApplicabilitySnapshot snapshot, BoundaryRequirementSet requirements, SandboxAuditTrace trace) | 创建允许继续裁定。 |
| reject(PolicyApplicabilitySnapshot snapshot, PolicyExecutionDecisionReason reason, SandboxAuditTrace trace) | 创建拒绝裁定。 |
| fail_closed(PolicyApplicabilitySnapshot snapshot, PolicyExecutionDecisionReason reason, SandboxAuditTrace trace) | 创建保守失败裁定。 |

### B2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不拥有 policy source truth | policy definition、approval、allowlist 和 capability truth 外部拥有。 |
| 不把后端不支持转写成允许 | backend / policy 不支持时只能 pending / rejected / fail-closed。 |
| 不解释 tools semantic policy | 工具语义归 `L2-tools`。 |

---

## B3. HighRiskActionDecision

### B3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Policy execution decision` |
| 对象类型 | decision object |
| 主要责任 | 对文件系统、网络、进程、资源或边界扩张等高风险动作形成显式允许、阻断或待确认裁定。 |

### B3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| action_decision_ref | `HighRiskActionDecisionRef` | 高风险动作裁定引用。 |
| policy_decision_ref | `PolicyExecutionDecisionRef` | 回指 policy 执行裁定。 |
| action_markers | `HighRiskActionMarkerSet` | 被裁定的高风险动作摘要。 |
| authorization_summary | `AuthorizationSummary` | 给定授权摘要。 |
| action_status | `HighRiskActionDecisionStatus` | allowed、blocked、pending、unsupported 等状态候选。 |
| block_reason | `HighRiskActionBlockReason` | 阻断原因摘要。 |

### B3.3 状态集合

| 状态 | 作用 |
|---|---|
| Allowed | 动作在给定 policy 范围内。 |
| Blocked | 动作越界或未授权,必须阻断。 |
| PendingAuthorization | 等待授权摘要。 |
| Unsupported | 当前边界或后端不支持安全执行。 |

### B3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| blocks_execution() | 判断动作是否阻断执行继续。 |
| requires_redline_containment() | 判断是否需要进入 redline containment。 |

### B3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| decide(PolicyApplicabilitySnapshot snapshot, HighRiskActionMarkerSet action_markers) | 从 policy snapshot 和动作摘要创建高风险动作裁定。 |

### B3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不定义 action taxonomy 全集 | 完整 taxonomy 留给后续详细设计 / policy 来源。 |
| 不允许 unknown 高风险动作继续 | unknown 必须 pending / blocked / fail-closed。 |

---

## B4. PolicyApplicabilityGuard

### B4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Policy execution decision` |
| 对象类型 | guard / policy |
| 主要责任 | 判断给定 policy / authorization 摘要是否适用于当前 execution context、boundary 和高风险动作。 |

### B4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| guard_ref | `PolicyApplicabilityGuardRef` | 适用性 guard 引用。 |
| required_policy_markers | `RequiredPolicyMarkerSet` | 必需 policy / authorization markers。 |
| conflict_rules | `PolicyConflictRuleSummary` | policy 冲突判断摘要。 |

### B4.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| evaluate(PolicyApplicabilitySnapshot snapshot, BoundaryRequirementSet requirements) | 判断 policy 摘要是否适用。 |
| conflicts(PolicyApplicabilitySnapshot snapshot) | 判断是否存在冲突。 |

### B4.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_required_markers(RequiredPolicyMarkerSet required_policy_markers, PolicyConflictRuleSummary conflict_rules) | 创建 policy 适用性 guard。 |

### B4.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不读取 policy 正文 | 只使用 snapshot / summary。 |
| 不生成 approval 或 allowlist | 外部 policy truth 不归本仓。 |

---

## B5. FailClosedPolicyGuard

### B5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Policy execution decision` |
| 对象类型 | guard / policy |
| 主要责任 | 在 policy 缺失、冲突、不支持、不可解析或授权不明时强制生成保守裁定。 |

### B5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| guard_ref | `FailClosedPolicyGuardRef` | fail-closed guard 引用。 |
| fail_closed_rules | `FailClosedRuleSet` | 触发保守失败的规则摘要。 |
| unsupported_policy | `UnsupportedPolicyHandlingSummary` | 不支持 policy 或后端能力时的处理摘要。 |

### B5.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| enforce(PolicyApplicabilitySnapshot snapshot) | 返回 accepted 以外的保守裁定种子。 |
| should_fail_closed(PolicyApplicabilityStatus status) | 判断某适用性状态是否必须保守失败。 |

### B5.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| strict(FailClosedRuleSet fail_closed_rules, UnsupportedPolicyHandlingSummary unsupported_policy) | 创建严格 fail-closed guard。 |

### B5.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不允许 permissive fallback | 缺失、冲突、不支持或授权不明不得继续执行。 |
| 不被配置关闭 | 配置不得改变 fail-closed 核心边界。 |

---

## B6. ControlledExecutionRun

### B6.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Execution capture and material handoff` |
| 对象类型 | domain entity |
| 主要责任 | 承载在已成立 context、boundary 和 policy decision 下发生的受控执行运行事实,不等同 runtime ExecutionInstance。 |

### B6.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| run_ref | `ControlledExecutionRunRef` | sandbox 受控执行运行引用。 |
| context_ref | `ControlledExecutionContextRef` | 回指执行语境。 |
| boundary_ref | `CoherentBoundaryRef` | 回指已成立边界。 |
| isolation_handle_ref | `IsolationEnvironmentHandleRef` | 回指隔离环境 handle。 |
| policy_decision_ref | `PolicyExecutionDecisionRef` | 回指允许继续的 policy 裁定。 |
| run_status | `ControlledExecutionRunStatus` | preparing、running、completed、failed、terminated 等状态候选。 |
| capture_ref | `CaptureFactRef` | 回指输出捕获事实。 |

### B6.3 状态集合

| 状态 | 作用 |
|---|---|
| Preparing | context、boundary 和 policy 均成立,准备启动。 |
| Running | 已在正式隔离边界内执行。 |
| Completed | 运行完成,等待或已进入 capture / handoff。 |
| Failed | 运行失败并需 failure classification。 |
| Terminated | 被 control signal 或 cleanup / redline 终止。 |

### B6.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| start(CoherentBoundary boundary, PolicyExecutionDecision decision) | 标记在成立边界和 policy 下启动。 |
| complete(CaptureFact capture) | 标记运行完成并关联 capture。 |
| fail(FailureClassification failure) | 标记运行失败并关联失败分类。 |
| terminate(ControlFact control) | 根据控制事实终止运行。 |

### B6.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| prepare(ControlledExecutionContext context, CoherentBoundary boundary, PolicyExecutionDecision decision) | 创建准备执行的运行对象。 |

### B6.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不等同 runtime ExecutionInstance | runtime loop、checkpoint 和 recover truth 不归本对象。 |
| 不承载 tools semantic result | 工具语义结果归 tools / runtime。 |
| 不可绕过 boundary / policy 创建 | 必须回指 established boundary 和 accepted policy decision。 |

---

## B7. CaptureFact

### B7.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Execution capture and material handoff` |
| 对象类型 | domain entity / fact |
| 主要责任 | 记录一次受控执行输出、候选材料、completion context 或 capture failure 的正式捕获事实。 |

### B7.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| capture_ref | `CaptureFactRef` | 捕获事实引用。 |
| run_ref | `ControlledExecutionRunRef` | 回指受控执行运行。 |
| output_summary | `ExecutionOutputSummary` | stdout / stderr / completion 概要,不写完整原始输出正文。 |
| material_refs | `CapturedMaterialRefSet` | 回指候选材料 refs。 |
| observability_material_ref | `ObservabilityMaterialRef` | 回指观测材料。 |
| capture_status | `CaptureFactStatus` | complete、partial、failed、unavailable 等状态候选。 |
| capture_failure_reason | `CaptureFailureReason` | 捕获失败原因摘要。 |

### B7.3 状态集合

| 状态 | 作用 |
|---|---|
| Complete | 所需输出和材料已捕获。 |
| Partial | 捕获部分完成,需说明缺失或风险。 |
| Failed | 捕获失败,必须进入 failure / control 语义。 |
| Unavailable | 材料不可用或下游读取降级。 |

### B7.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| is_complete() | 判断 capture 是否完整。 |
| requires_failure_classification() | 判断 capture failure 是否需要失败归类。 |
| create_handoff_seed() | 为 handoff fact 提供不含下游 truth 的材料种子。 |

### B7.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| complete(ControlledExecutionRun run, ExecutionOutputSummary output_summary, CapturedMaterialRefSet material_refs, ObservabilityMaterial observability_material) | 创建完整捕获事实。 |
| partial(ControlledExecutionRun run, ExecutionOutputSummary output_summary, CaptureFailureReason reason) | 创建部分捕获事实。 |
| failed(ControlledExecutionRun run, CaptureFailureReason reason) | 创建捕获失败事实。 |

### B7.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不保存完整大材料正文 | 大材料存储和 retention 后移。 |
| 不宣布 formal artifact truth | capture 只是候选材料事实。 |
| 不用 observability material 掩盖 capture failure | 观测不能替代结果捕获。 |

---

## B8. CapturedMaterialRef

### B8.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Execution capture and material handoff` |
| 对象类型 | reference object / value object |
| 主要责任 | 表达 sandbox 已捕获的候选输出、文件、诊断或材料引用,并保持其与下游 formal truth 分层。 |

### B8.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| material_ref | `CapturedMaterialRef` | 候选材料引用。 |
| capture_ref | `CaptureFactRef` | 回指捕获事实。 |
| material_kind | `CapturedMaterialKind` | stdout、stderr、file、diagnostic、candidate-output 等概要类别。 |
| material_source | `MaterialSourceContext` | 材料来源语境摘要。 |
| safety_summary | `CapturedMaterialSafetySummary` | 材料安全摘要,用于 handoff / cleanup guard。 |
| downstream_handoff_ref | `DownstreamHandoffRef` | 可选下游交接引用。 |

### B8.3 状态集合

| 状态 | 作用 |
|---|---|
| Captured | 材料已被 sandbox 捕获。 |
| HandoffPending | 已准备交接但未确认。 |
| HandoffFailed | 下游交接失败。 |
| HandoffAccepted | 下游确认接收,但不代表 sandbox 拥有下游 truth。 |
| RetentionBlocked | cleanup guard 阻止删除。 |

### B8.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| can_be_handed_off() | 判断材料是否具备交接前提。 |
| mark_handoff_pending(HandoffFact handoff) | 关联交接事实。 |
| blocks_cleanup(CleanupGuard cleanup_guard) | 判断该材料是否阻断 cleanup。 |

### B8.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_capture(CaptureFact capture, CapturedMaterialKind material_kind, MaterialSourceContext material_source) | 从 capture 形成候选材料引用。 |

### B8.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不等于 Artifact / baseline / evidence | 下游 formal truth 由下游确认。 |
| 不保存未治理正文 | 材料正文、size、retention、storage 后移。 |

---

## B9. ObservabilityMaterial

### B9.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Execution capture and material handoff` |
| 对象类型 | material fact / reference object |
| 主要责任 | 表达可交接给 observability 的 usage、audit、trace、metric、failure 和 cleanup/redline material。 |

### B9.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| observability_material_ref | `ObservabilityMaterialRef` | 观测材料引用。 |
| run_ref | `ControlledExecutionRunRef` | 回指受控执行运行。 |
| trace_context | `SandboxTraceContext` | 同源 trace 语境。 |
| usage_summary | `ExecutionUsageSummary` | 资源使用摘要。 |
| audit_summary | `SandboxAuditSummary` | 审计材料摘要。 |
| failure_markers | `FailureObservationMarkerSet` | 失败、cleanup 或 redline 观测 markers。 |
| handoff_status | `ObservabilityHandoffStatus` | observability material 交接状态候选。 |

### B9.3 状态集合

| 状态 | 作用 |
|---|---|
| Prepared | 材料已准备交接。 |
| HandoffPending | 等待观测系统接收。 |
| HandoffFailed | 观测材料交接失败。 |
| HandoffRecorded | 已记录交接事实,不代表 observability store truth。 |

### B9.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| to_handoff_seed() | 为 observability handoff 生成材料种子。 |
| includes_failure_marker() | 判断是否包含 failure / cleanup / redline marker。 |

### B9.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| prepare(ControlledExecutionRun run, ExecutionUsageSummary usage_summary, SandboxAuditSummary audit_summary) | 准备观测材料。 |

### B9.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不等于 observability store | 存储、retention、alert stream 不归 sandbox。 |
| 不替代 `CaptureFact` | 观测材料不能掩盖输出捕获缺失。 |

---

## B10. HandoffFact

### B10.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Execution capture and material handoff` |
| 对象类型 | domain entity / handoff record |
| 主要责任 | 记录 capture material、observability material 或 event relay 向下游显式交接的事实和状态。 |

### B10.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| handoff_ref | `HandoffFactRef` | 交接事实引用。 |
| capture_ref | `CaptureFactRef` | 回指捕获事实。 |
| material_refs | `CapturedMaterialRefSet` | 被交接的候选材料 refs。 |
| target_refs | `HandoffTargetRefSet` | artifact、runtime、runner、observability 等目标 refs。 |
| handoff_status | `HandoffStatus` | pending、delivered、failed、retryable 等状态候选。 |
| handoff_reason | `HandoffReason` | 交接原因或失败原因摘要。 |
| event_relay_ref | `SandboxEventRelayRecordRef` | 可选事件传播记录回指。 |

### B10.3 状态集合

| 状态 | 作用 |
|---|---|
| Pending | 交接已发起但未被确认。 |
| Delivered | 下游已确认接收。 |
| Failed | 交接失败且需后续处理。 |
| Retryable | 失败可重试。 |
| BlockedByCleanupGuard | cleanup guard 阻断删除或释放。 |

### B10.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| mark_delivered(HandoffReceiptSummary receipt_summary) | 记录下游接收摘要。 |
| mark_failed(HandoffFailureSummary failure_summary) | 记录交接失败摘要。 |
| is_cleanup_blocking() | 判断 handoff 状态是否阻断 cleanup。 |
| does_not_transfer_ownership() | 明确交接不迁移下游 formal truth ownership。 |

### B10.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| open(CaptureFact capture, CapturedMaterialRefSet material_refs, HandoffTargetRefSet target_refs) | 从 capture 和目标 refs 创建交接事实。 |

### B10.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不宣布下游 formal truth | artifact、runtime、runner、observability truth 均由下游拥有。 |
| 不伪造 ack | pending / failed / retryable 必须显式表达。 |
| 不写完整 handoff 协议 | ack / failed / retryable 协议细节后移。 |

---

## B11. CaptureCompletenessGuard

### B11.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Execution capture and material handoff` |
| 对象类型 | guard / policy |
| 主要责任 | 判断 capture 是否达到本次执行的最低材料完整性要求。 |

### B11.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| guard_ref | `CaptureCompletenessGuardRef` | capture 完整性 guard 引用。 |
| required_material_kinds | `RequiredMaterialKindSet` | 必需输出 / 材料类别。 |
| partial_policy | `PartialCapturePolicySummary` | 部分捕获时的处理摘要。 |

### B11.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| evaluate(CaptureFact capture) | 判断 capture 是否完整、部分或失败。 |
| requires_failure(CaptureFact capture) | 判断 capture 缺口是否需要 failure classification。 |

### B11.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_requirement(RequiredMaterialKindSet required_material_kinds, PartialCapturePolicySummary partial_policy) | 创建 capture 完整性 guard。 |

### B11.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不用观测材料替代结果材料 | observability material 不能伪装 capture complete。 |
| 不把 partial 默认为 success | 部分捕获必须显式暴露。 |

---

## B12. HandoffOwnershipGuard

### B12.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Execution capture and material handoff` |
| 对象类型 | guard / policy |
| 主要责任 | 保护 material handoff 不迁移 Artifact、runtime、runner 或 observability 的 formal truth ownership。 |

### B12.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| guard_ref | `HandoffOwnershipGuardRef` | handoff ownership guard 引用。 |
| downstream_owner_markers | `DownstreamOwnerMarkerSet` | 标识下游 truth owner 类别。 |
| allowed_handoff_kinds | `AllowedHandoffKindSet` | 允许交接的材料 / 观测 / 事件类别。 |

### B12.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| evaluate(HandoffFact handoff) | 判断交接是否保持 ownership 边界。 |
| forbids_truth_promotion(CapturedMaterialRef material_ref) | 判断材料是否存在静默升格风险。 |

### B12.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| strict(DownstreamOwnerMarkerSet downstream_owner_markers, AllowedHandoffKindSet allowed_handoff_kinds) | 创建严格 ownership guard。 |

### B12.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不允许 candidate material 自动变 formal artifact | 必须由 artifact 仓正式接收 / 建模。 |
| 不允许 observability ack 代替 capture truth | 交接边界不能改变 truth owner。 |

---

## B13. CaptureSummaryView

### B13.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Execution capture and material handoff` |
| 对象类型 | projection / read model |
| 主要责任 | 提供 capture fact、material refs 和 observability material 的只读摘要。 |

### B13.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| view_ref | `CaptureSummaryViewRef` | capture 摘要视图引用。 |
| capture_ref | `CaptureFactRef` | 回指捕获事实。 |
| run_ref | `ControlledExecutionRunRef` | 回指受控执行运行。 |
| visible_capture_status | `VisibleCaptureStatus` | 面向查询的 capture 状态。 |
| material_summary | `CapturedMaterialSummary` | 候选材料安全摘要。 |
| degraded_markers | `CaptureViewDegradedMarkerSet` | 读取降级或材料缺失 marker。 |

### B13.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| from_capture(CaptureFact capture) | 从捕获事实构造只读摘要。 |
| is_degraded() | 判断视图是否降级。 |

### B13.4 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不反写 capture truth | 视图只读。 |
| 不暴露未治理大材料正文 | 只展示安全摘要和 refs。 |

---

## B14. MaterialHandoffStatusView

### B14.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Execution capture and material handoff` |
| 对象类型 | projection / read model |
| 主要责任 | 提供材料、观测和事件交接状态的只读摘要,用于查询、cleanup guard 和对账。 |

### B14.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| view_ref | `MaterialHandoffStatusViewRef` | handoff 状态视图引用。 |
| handoff_ref | `HandoffFactRef` | 回指交接事实。 |
| target_summary | `HandoffTargetSummary` | 下游目标摘要。 |
| visible_handoff_status | `VisibleHandoffStatus` | pending、delivered、failed、retryable 等查询状态。 |
| cleanup_blocking_marker | `CleanupBlockingMarker` | 是否阻断 cleanup 的只读 marker。 |

### B14.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| from_handoff(HandoffFact handoff) | 从 handoff fact 构造只读状态视图。 |
| blocks_cleanup() | 判断当前 handoff 状态是否阻断 cleanup。 |

### B14.4 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不代表下游正式状态 | 只读展示 sandbox 已知 handoff 状态。 |
| 不替代 handoff fact | 视图不能成为交接 truth。 |
