# Step 6 附录 A. Intake / Identity / Boundary 对象骨架

> 主控文件: `02_hld_step_06_key_objects.md`
> 覆盖组成部分: `Controlled execution intake and identity`;`Boundary establishment and enforcement`
> 状态: completed_wait_user_review

---

## A1. ControlledExecutionContext

### A1.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Controlled execution intake and identity` |
| 对象类型 | context object / domain aggregate |
| 主要责任 | 承载一次正式受控执行请求在 sandbox 内部的语境、来源归责、最小拒绝前提和后续对象回指。 |

### A1.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| context_ref | `ControlledExecutionContextRef` | 本次受控执行语境的 sandbox 内部唯一引用。 |
| source_refs | `ExecutionSourceRefSet` | 记录 tools、runtime、member-service、runner 或人工入口的来源 refs,不保存来源正文。 |
| responsibility_context | `ExecutionResponsibilityContext` | 保存 actor / work / trace / reason 的 safe summary,用于归责和拒绝说明。 |
| intake_status | `ControlledExecutionIntakeStatus` | 表达 accepted、rejected、pending 或 unresolved 的受理状态候选。 |
| resolution_ref | `ExecutionContextResolutionRef` | 回指上下文引用解析结果。 |
| audit_trace_ref | `SandboxAuditTraceRef` | 回指受理、拒绝和后续变更的审计 trace。 |

### A1.3 状态集合

| 状态 | 作用 |
|---|---|
| PendingResolution | 引用、summary 或责任链仍待解析。 |
| Accepted | 已形成正式受控执行语境,允许进入 boundary / policy 判断。 |
| Rejected | 不满足最小语境或拒绝前提,不得启动真实执行。 |
| Unresolved | 必需外部 refs 不可解析或冲突,需等待或人工介入。 |
| Closed | 本次语境已被终止、清理或归档为只读。 |

### A1.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| accept(ExecutionContextResolution resolution, ExecutionEnvironmentIdentity identity) | 在引用解析和执行环境身份成立后标记正式受理。 |
| reject(ControlledExecutionRejectReason reason, SandboxAuditTrace trace) | 记录受理拒绝及其来源归责。 |
| attach_boundary(BoundaryEstablishmentDecision decision) | 建立与边界裁定的回指,不直接改变 boundary truth。 |
| attach_policy_decision(PolicyExecutionDecision decision) | 建立与 policy 裁定的回指,不生成 policy truth。 |
| is_executable_context() | 判断当前语境是否可进入真实执行前置链路。 |

### A1.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| open_from_request(ExecutionSourceRefSet source_refs, ExecutionResponsibilityContext responsibility_context, SandboxAuditTrace trace) | 从正式受控执行请求创建待解析语境。 |
| reject_unresolved(ExecutionSourceRefSet source_refs, ControlledExecutionRejectReason reason, SandboxAuditTrace trace) | 在缺少必需 refs 时创建拒绝语境。 |

### A1.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不保存 identity / work / runner / tool / runtime 正文 | 只能保存 refs、safe summary 和 responsibility context。 |
| 不代表 runtime ExecutionInstance | 本对象只表达 sandbox 受控执行语境。 |
| 不补记宿主直跑为正式受控执行 | 正式语境必须先于真实执行成立。 |

---

## A2. ExecutionEnvironmentIdentity

### A2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Controlled execution intake and identity` |
| 对象类型 | entity / value object |
| 主要责任 | 表达 sandbox 内部一次执行环境身份,用于后续 boundary、policy、capture、failure 和 cleanup 统一回指。 |

### A2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| environment_identity_ref | `ExecutionEnvironmentIdentityRef` | 本次执行环境身份引用。 |
| context_ref | `ControlledExecutionContextRef` | 回指正式受控执行语境。 |
| responsibility_anchor | `ExecutionResponsibilityAnchor` | 承接 actor / member / work / runner 责任链摘要。 |
| trace_context | `SandboxTraceContext` | 为审计、观测材料和错误追踪提供同源 trace。 |
| identity_status | `ExecutionEnvironmentIdentityStatus` | 表达 active、closed、invalidated 等状态候选。 |

### A2.3 状态集合

| 状态 | 作用 |
|---|---|
| Active | 身份已成立,可被 boundary / policy / capture 引用。 |
| Closed | 执行环境已收束,只可读取和审计。 |
| Invalidated | 责任链或 refs 被确认不可用,后续执行不得继续。 |

### A2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| close(SandboxAuditTrace trace) | 标记执行环境身份收束。 |
| invalidate(ExecutionIdentityInvalidationReason reason, SandboxAuditTrace trace) | 在责任语境失效时阻断后续执行。 |
| can_anchor_boundary() | 判断是否可作为 boundary 建立回指。 |

### A2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| bind(ControlledExecutionContext context, ExecutionResponsibilityAnchor responsibility_anchor, SandboxTraceContext trace_context) | 为已受理 context 建立执行环境身份。 |

### A2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不等于 GlobalMember 或 actor truth | 只表达执行环境身份,不拥有身份生命周期。 |
| 不作为权限源 | 权限和 policy 来源在外部,本对象只提供责任语境。 |
| 不允许匿名身份作为正式成功 | 缺少必需身份锚点时必须 rejected / unresolved。 |

---

## A3. ExecutionContextResolution

### A3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Controlled execution intake and identity` |
| 对象类型 | reference object / state object |
| 主要责任 | 汇总受控执行请求中外部 refs、safe summary、缺失项和冲突项的解析结果。 |

### A3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| resolution_ref | `ExecutionContextResolutionRef` | 解析结果引用。 |
| context_ref | `ControlledExecutionContextRef` | 回指待解析或已解析的执行语境。 |
| resolved_refs | `ResolvedContextRefSet` | 保存已确认的 body-free typed refs。 |
| safe_summaries | `ContextSafeSummarySet` | 保存可用于判断的上游摘要。 |
| unresolved_items | `UnresolvedContextItemSet` | 记录缺失、不可用或待确认的 refs。 |
| conflict_markers | `ContextResolutionConflictSet` | 记录同一语境内冲突的来源或摘要。 |

### A3.3 状态集合

| 状态 | 作用 |
|---|---|
| Resolved | 必需 refs 和摘要均可用于后续判断。 |
| Partial | 非核心摘要缺失,只能进入 pending / degraded 读取语义。 |
| Unresolved | 必需 refs 缺失或不可解析。 |
| Conflicted | refs 或摘要冲突,不得继续执行。 |

### A3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| requires_rejection() | 判断解析结果是否必须拒绝受理。 |
| missing_required_refs() | 列出阻塞正式受理的缺失引用。 |
| supports_execution_identity() | 判断是否足以建立 `ExecutionEnvironmentIdentity`。 |

### A3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_resolver_result(ControlledExecutionContextRef context_ref, ContextResolverOutcome outcome) | 从 reference resolver 输出形成解析对象。 |

### A3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不保存外部正文 | 只保存 refs、safe summary、缺失项和冲突 marker。 |
| 不替代外部仓可见性判断 | 上游是否存在、可见和可用仍由 resolver / source summary 提供。 |

---

## A4. ControlledExecutionIntakeGuard

### A4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Controlled execution intake and identity` |
| 对象类型 | guard |
| 主要责任 | 判断受控执行请求是否满足正式入口、责任链和最小拒绝前提。 |

### A4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| guard_ref | `ControlledExecutionIntakeGuardRef` | guard 判断引用。 |
| required_context_markers | `RequiredContextMarkerSet` | 标识必须存在的 source / identity / work / trace markers。 |
| rejection_policy | `IntakeRejectionPolicySummary` | 受理拒绝的概要规则摘要。 |
| evaluated_at | `EvaluationInstant` | 表达判断发生的逻辑时间。 |

### A4.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| evaluate(ExecutionContextResolution resolution) | 基于解析结果生成 accepted / rejected / pending 判断。 |
| explain_rejection(ExecutionContextResolution resolution) | 生成不含外部正文的拒绝原因摘要。 |

### A4.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_policy_summary(IntakeRejectionPolicySummary rejection_policy, RequiredContextMarkerSet required_context_markers) | 从给定 intake policy 摘要创建 guard。 |

### A4.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不自行查询外部正文 | 只消费 resolution 和 policy summary。 |
| 不放行匿名或旁路执行 | 缺少正式语境时必须 rejected / pending。 |

---

## A5. ContextReferenceResolution

### A5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Controlled execution intake and identity` |
| 对象类型 | reference object |
| 主要责任 | 作为外部 refs 与 sandbox context 之间的边界对象,说明每类引用解析到什么 body-free 程度。 |

### A5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| reference_resolution_ref | `ContextReferenceResolutionRef` | 引用解析边界记录。 |
| identity_refs | `IdentityAnchorRefSet` | actor / member 等身份锚点引用。 |
| work_refs | `WorkContextRefSet` | project / work / implementation context 引用。 |
| caller_refs | `CallerExecutionRefSet` | tools / runtime / member-service / runner 请求来源引用。 |
| policy_refs | `PolicySourceRefSet` | 给定 policy / approval / capability 来源引用。 |
| forbidden_body_markers | `ForbiddenExternalBodyMarkerSet` | 记录明确不得入仓的正文类别。 |

### A5.3 状态集合

| 状态 | 作用 |
|---|---|
| Complete | 当前所需引用均已解析到 safe summary。 |
| Stale | 引用存在但摘要可能过期。 |
| Unavailable | 引用来源不可用,需要 pending / rejected。 |
| Invalid | 引用格式、归属或边界不合法。 |

### A5.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| contains_forbidden_body() | 判断是否存在外部正文入仓风险。 |
| supports_intake() | 判断引用解析是否足以进行正式受理。 |
| to_execution_resolution() | 形成 `ExecutionContextResolution` 所需的 body-free 输入。 |

### A5.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_ref_summary(ContextRefSummarySet summaries, ForbiddenExternalBodyMarkerSet forbidden_body_markers) | 从 refs 和 safe summaries 创建引用解析边界对象。 |

### A5.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不保存外部正文或 full snapshot | 本对象只记录 refs、safe summary 和 forbidden markers。 |
| 不替代 `ReferenceResolutionState` | 本对象用于 intake context,长期刷新状态由 local support 对象承接。 |

---

## A6. CoherentBoundary

### A6.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Boundary establishment and enforcement` |
| 对象类型 | domain aggregate / value object |
| 主要责任 | 表达 resource、filesystem、network、process、workspace 和 mount 限制作为一组共同成立的隔离边界。 |

### A6.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| boundary_ref | `CoherentBoundaryRef` | 隔离边界引用。 |
| context_ref | `ControlledExecutionContextRef` | 回指执行语境。 |
| environment_identity_ref | `ExecutionEnvironmentIdentityRef` | 回指执行环境身份。 |
| requirement_ref | `BoundaryRequirementSetRef` | 回指边界需求集合。 |
| resource_limits | `ResourceLimitSummary` | 资源限制概要,不写后端配置细节。 |
| filesystem_boundary | `FilesystemBoundarySummary` | 文件系统 / workspace / mount 限制概要。 |
| network_boundary | `NetworkBoundarySummary` | 网络访问限制概要。 |
| process_boundary | `ProcessBoundarySummary` | 进程、子进程和信号边界概要。 |
| boundary_status | `CoherentBoundaryStatus` | established、rejected、pending、failed 等状态候选。 |

### A6.3 状态集合

| 状态 | 作用 |
|---|---|
| Required | 边界需求已形成但尚未建立。 |
| Established | 所有必需限制已共同成立。 |
| Rejected | 需求不可满足或不被允许。 |
| PendingCapability | 等待 backend capability 或 workspace 摘要。 |
| Failed | 建立过程中失败,不得继续真实执行。 |
| Released | 执行环境已释放或收束。 |

### A6.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| assert_coherent() | 判断所有必需限制是否作为同一组成立。 |
| rejects_silent_degrade() | 判断是否存在后端忽略或未验证限制的风险。 |
| can_launch_execution() | 判断当前边界是否可支撑真实执行启动。 |
| release(BoundaryReleaseReason reason, SandboxAuditTrace trace) | 标记边界释放或收束。 |

### A6.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| establish(BoundaryRequirementSet requirements, BoundaryEstablishmentDecision decision, IsolationEnvironmentHandle handle) | 在需求、裁定和 handle 成立后创建有效边界。 |
| reject(BoundaryRequirementSet requirements, BoundaryRejectReason reason) | 在限制不可落实或不允许时创建拒绝边界记录。 |

### A6.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不写 Docker/gVisor/k8s 等产品字段 | 后端产品不是业务边界 truth。 |
| 不允许部分边界成功 | 任一必需限制缺失时不得 established。 |
| 不保存宿主文件系统正文 | 只保存边界概要和 refs。 |

---

## A7. BoundaryRequirementSet

### A7.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Boundary establishment and enforcement` |
| 对象类型 | value object |
| 主要责任 | 汇总本次执行必须成立的资源、文件系统、网络、进程、workspace 和 lifecycle 限制需求。 |

### A7.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| requirement_ref | `BoundaryRequirementSetRef` | 边界需求集合引用。 |
| context_ref | `ControlledExecutionContextRef` | 回指受控执行语境。 |
| environment_identity_ref | `ExecutionEnvironmentIdentityRef` | 回指已成立且与 context 匹配的执行环境身份。 |
| boundary_profile_ref | `SandboxOpaqueRef` | 回指已验证并注入 boundary service 的 coherent boundary profile,不保存 raw config。 |
| limit_template_ref | `SandboxOpaqueRef` | 回指覆盖 resource / filesystem / network / process 的同代完整限制模板。 |
| runtime_generation_ref | `SandboxOpaqueRef` | 回指 LD-24 已原子发布的 runtime generation,用于阻止跨代混用。 |
| resource_requirements | `ResourceRequirementSet` | CPU、memory、time、IO 等资源需求概要。 |
| filesystem_requirements | `FilesystemRequirementSet` | workspace、mount、read/write 边界需求概要。 |
| network_requirements | `NetworkRequirementSet` | network deny / allow / no-egress 等需求概要。 |
| process_requirements | `ProcessRequirementSet` | process、subprocess、signal、privilege 边界需求概要。 |
| lifecycle_requirements | `BoundaryLifecycleRequirementSet` | lease、cleanup 和 release 前提概要。 |

### A7.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| requires_network_denial() | 判断是否必须拒绝或限制网络。 |
| requires_filesystem_write_guard() | 判断是否存在写边界 guard。 |
| missing_required_dimension() | 判断是否缺少必需边界维度。 |

### A7.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_context_and_requirements(ControlledExecutionContext context, ExecutionEnvironmentIdentity identity, ResourceRequirementSet resource_requirements, FilesystemRequirementSet filesystem_requirements, NetworkRequirementSet network_requirements, ProcessRequirementSet process_requirements, BoundaryLifecycleRequirementSet lifecycle_requirements, SandboxOpaqueRef boundary_profile_ref, SandboxOpaqueRef limit_template_ref, SandboxOpaqueRef runtime_generation_ref) | 从已受理语境、匹配身份、显式四维要求、builder注入profile / template和已发布runtime generation形成边界需求。 |

### A7.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不依赖后序 policy 裁定 | policy 在 boundary 后消费 requirement / coherence;本对象不得读取 `PolicyApplicabilitySnapshot` 或 `PolicyExecutionDecision`。 |
| 不写 raw config 或具体后端产品参数 | 只保存已验证 profile / template和已发布generation的body-free ref;配置正文和后端产品配置不进入domain。 |

---

## A8. BoundaryEstablishmentDecision

### A8.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Boundary establishment and enforcement` |
| 对象类型 | decision object |
| 主要责任 | 记录边界建立成功、拒绝、等待或失败的正式裁定。 |

### A8.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| decision_ref | `BoundaryEstablishmentDecisionRef` | 边界建立裁定引用。 |
| requirement_ref | `BoundaryRequirementSetRef` | 回指被裁定的边界需求。 |
| backend_capability_ref | `BackendCapabilitySummaryRef` | 回指能力摘要。 |
| decision_status | `BoundaryEstablishmentDecisionStatus` | established、rejected、pending、failed 等状态候选。 |
| decision_reason | `BoundaryDecisionReason` | 说明裁定原因,不含后端原始响应。 |
| audit_trace_ref | `SandboxAuditTraceRef` | 回指边界裁定审计。 |

### A8.3 状态集合

| 状态 | 作用 |
|---|---|
| Established | 能力和限制均成立。 |
| Rejected | 不允许或不可满足,不得继续。 |
| PendingCapability | 能力摘要缺失或过期。 |
| Unsupported | 后端明确不支持必需限制。 |
| Failed | 建立操作失败或无法验证。 |

### A8.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| permits_launch() | 判断是否允许进入真实执行。 |
| fail_closed_reason() | 返回保守拒绝或失败原因摘要。 |
| requires_cleanup_guard() | 判断失败建立是否需要 cleanup / orphan 处理。 |

### A8.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| established(BoundaryRequirementSet requirements, BackendCapabilitySummary capability, IsolationEnvironmentHandle handle, SandboxAuditTrace trace) | 创建建立成功裁定。 |
| reject(BoundaryRequirementSet requirements, BoundaryDecisionReason reason, SandboxAuditTrace trace) | 创建拒绝裁定。 |
| pending_capability(BoundaryRequirementSet requirements, BackendCapabilitySummary capability) | 创建等待能力摘要裁定。 |

### A8.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不把 backend failure 写成 success | 无法验证时只能 pending / failed / rejected。 |
| 不保存后端 SDK 原始响应 | 原始响应属于 adapter / detailed design 边界。 |

---

## A9. BackendCapabilitySummary

### A9.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Boundary establishment and enforcement` |
| 对象类型 | snapshot / reference object |
| 主要责任 | 表达后端承载能力的 body-free 摘要,用于判断边界需求能否落实。 |

### A9.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| backend_capability_ref | `BackendCapabilitySummaryRef` | 能力摘要引用。 |
| backend_ref | `IsolationBackendRef` | 后端承载引用,不表示产品 truth。 |
| supported_boundary_dimensions | `SupportedBoundaryDimensionSet` | 说明支持哪些资源 / FS / network / process 维度。 |
| unsupported_markers | `UnsupportedBoundaryMarkerSet` | 说明不能落实或不能验证的限制。 |
| freshness_status | `CapabilityFreshnessStatus` | 表达 fresh、stale、unknown 等状态候选。 |
| collected_at | `CapabilitySummaryInstant` | 摘要生成时间。 |

### A9.3 状态集合

| 状态 | 作用 |
|---|---|
| Fresh | 可用于当前边界裁定。 |
| Stale | 只能触发 refresh 或 pending。 |
| Unknown | 缺失能力信息,不得 permissive fallback。 |
| Unsupported | 已知不支持必需能力。 |

### A9.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| supports(BoundaryRequirementSet requirements) | 判断能力摘要是否支持需求。 |
| missing_required_support(BoundaryRequirementSet requirements) | 列出不可落实的必需限制。 |
| must_fail_closed() | 判断能力未知或不支持时是否必须保守失败。 |

### A9.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_backend_probe(IsolationBackendRef backend_ref, BackendCapabilityProbeSummary probe_summary) | 从后端探测摘要形成 body-free capability summary。 |

### A9.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不拥有 backend product lifecycle | 后端产品、host、cluster、workspace 正文不入仓。 |
| 不定义正式 profile | profile、seccomp、AppArmor、cap-drop 等后移配置 / 测试。 |

---

## A10. IsolationEnvironmentHandle

### A10.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Boundary establishment and enforcement` |
| 对象类型 | reference object / entity |
| 主要责任 | 表达 sandbox 对已建立隔离环境的正式 handle 和 lifecycle marker,不泄漏后端 SDK 原始句柄。 |

### A10.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| isolation_handle_ref | `IsolationEnvironmentHandleRef` | sandbox 内部 handle 引用。 |
| backend_ref | `IsolationBackendRef` | 后端承载引用。 |
| environment_identity_ref | `ExecutionEnvironmentIdentityRef` | 回指执行环境身份。 |
| boundary_ref | `CoherentBoundaryRef` | 回指已成立边界。 |
| lifecycle_marker | `IsolationEnvironmentLifecycleMarker` | 表达 created、active、released、orphan-suspected 等状态候选。 |
| lease_ref | `LeaseRecordRef` | 回指 lease 管理对象。 |

### A10.3 状态集合

| 状态 | 作用 |
|---|---|
| Created | 后端环境已创建但未进入运行。 |
| Active | 环境可用于已授权受控执行。 |
| ReleasePending | 等待 cleanup guard 或后端释放。 |
| Released | 环境已释放。 |
| OrphanSuspected | 生命周期与 sandbox truth 不一致,需要 orphan recovery。 |

### A10.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| mark_active(CoherentBoundary boundary) | 标记环境进入可执行状态。 |
| request_release(CleanupGuard cleanup_guard) | 在 cleanup guard 允许时请求释放。 |
| suspect_orphan(LeaseRecord lease) | 标记疑似孤儿环境。 |

### A10.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| create(ExecutionEnvironmentIdentity identity, IsolationBackendRef backend_ref, CoherentBoundary boundary) | 创建隔离环境 handle。 |

### A10.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不暴露 backend SDK 原始 handle | 原始句柄属于 adapter / detailed design。 |
| 不代表 host / cluster lifecycle truth | 只表达 sandbox 对正式环境的引用和状态 marker。 |

---

## A11. BoundaryCoherenceGuard

### A11.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Boundary establishment and enforcement` |
| 对象类型 | guard / policy |
| 主要责任 | 校验 boundary requirement 和 established boundary 是否覆盖所有必需维度并拒绝 silent degrade。 |

### A11.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| guard_ref | `BoundaryCoherenceGuardRef` | coherence guard 引用。 |
| required_dimensions | `BoundaryDimensionSet` | 必须整体成立的边界维度。 |
| strictness_level | `BoundaryStrictnessLevel` | 表达基础 / 强隔离等概要层严格度。 |

### A11.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| evaluate(BoundaryRequirementSet requirements, BackendCapabilitySummary capability) | 判断需求能否被完整落实。 |
| reject_partial_boundary(CoherentBoundary boundary) | 检查是否存在部分建立或 silent ignore。 |

### A11.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| from_requirement(BoundaryRequirementSet requirements) | 从已冻结的完整需求集合创建 guard;不可降级是对象不变量,不是后序 policy 输入。 |

### A11.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不把不可落实写成 warning | 必需边界不可落实必须 rejected / failed。 |
| 不定义产品级 security profile | profile 细节后移。 |

---

## A12. BackendCapabilityGuard

### A12.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Boundary establishment and enforcement` |
| 对象类型 | guard |
| 主要责任 | 基于 backend capability summary 判断边界需求是否可验证、可落实或必须 fail-closed。 |

### A12.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| guard_ref | `BackendCapabilityGuardRef` | backend capability guard 引用。 |
| capability_ref | `BackendCapabilitySummaryRef` | 被判断的能力摘要。 |
| requirement_ref | `BoundaryRequirementSetRef` | 被判断的边界需求。 |

### A12.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| decide(BoundaryRequirementSet requirements, BackendCapabilitySummary capability) | 形成建立、拒绝或等待能力的判断。 |
| must_refresh_capability() | 判断当前能力摘要是否过期。 |

### A12.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| bind(BackendCapabilitySummary capability, BoundaryRequirementSet requirements) | 绑定能力摘要和需求;unsupported / stale / unknown按固定保守裁决处理,不得读取后序 policy。 |

### A12.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不替代 `BoundaryEstablishmentDecision` | guard 只判断,正式裁定由 decision 对象承接。 |
| 不允许 unknown capability 继续执行 | unknown 只能 pending / fail-closed。 |

---

## A13. BoundaryStatusView

### A13.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | `Boundary establishment and enforcement` |
| 对象类型 | projection / read model |
| 主要责任 | 提供边界建立、能力支持和隔离环境 handle 的只读状态摘要。 |

### A13.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| view_ref | `BoundaryStatusViewRef` | 只读视图引用。 |
| boundary_ref | `CoherentBoundaryRef` | 回指边界对象。 |
| decision_ref | `BoundaryEstablishmentDecisionRef` | 回指建立裁定。 |
| isolation_handle_ref | `IsolationEnvironmentHandleRef` | 回指环境 handle。 |
| visible_status | `BoundaryVisibleStatus` | 面向查询的状态标签。 |
| degraded_markers | `BoundaryDegradedMarkerSet` | 标识能力过期、pending 或 read degraded 情况。 |

### A13.3 状态集合

| 状态 | 作用 |
|---|---|
| VisibleEstablished | 可见为已建立。 |
| VisibleRejected | 可见为拒绝建立。 |
| VisiblePending | 等待能力、workspace 或后端反馈。 |
| VisibleFailed | 建立失败或不可验证。 |
| ViewDegraded | 核心 truth 可存在,但读取投影不完整。 |

### A13.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| from_boundary(CoherentBoundary boundary, BoundaryEstablishmentDecision decision) | 从核心 truth 构造只读状态视图。 |
| is_degraded() | 判断视图是否降级。 |

### A13.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 不反写 boundary truth | 视图只能读取和派生。 |
| 不宣布后端产品健康 truth | 只表达 sandbox 边界状态。 |

---

## A14. 实施计划回查修复记录

| 回查 ID | 发现位置 | 原冲突 | 修复结果 | 后序约束 |
|---|---|---|---|---|
| `SBX-IMP-BOUNDARY-POLICY-CYCLE-001` | `07` Step 6 对 `PH-05 -> PH-06 -> PH-07` 的可落码复核 | `BoundaryRequirementSet` 原持有 `policy_ref` 并由 `from_context_and_policy(...)` 构造,使 Boundary 依赖尚未产生的 Policy snapshot。 | 移除policy输入,改由accepted context、匹配identity、显式四维requirements、builder注入的validated profile / template和LD-24发布的runtime generation构造。 | Policy下一阶段消费boundary requirement / coherence;Run同时要求coherent boundary与Accepted policy。 |
