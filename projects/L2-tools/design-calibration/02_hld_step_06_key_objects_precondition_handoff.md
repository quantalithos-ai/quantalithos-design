# L2-tools 02 概要 Step 6 对象附录: 执行前置与条件交接

> 创建日期: 2026-08-05
> 状态: completed
> 主控文件: `design-calibration/02_hld_step_06_key_objects.md`
> 组成部分来源: Step 5 §7 执行前置与条件交接
> Blocker 继承: `L2T-UP-001~004` 持续开放；对象仅表达 L2 逻辑消费与本地事实，不证明正向合同 ready。

---

## 1. 对象正式化范围

本附录正式化 6 个对象：`ExecutionRequirement`、`AuthorizationConsumptionAssessment`、`ExecutionHandoff`、`ExecutionHandoffAttempt`、`AuthorizationResultRef`、`SandboxReadinessSnapshot`。Authorization policy / decision body、Sandbox request / run / capture / receipt / cleanup 与本地 allowlist 均不进入对象字段。

## 2. `ExecutionRequirement`

### 2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 执行前置与条件交接 |
| 对象类型 | domain requirement fact |
| 主要责任 | 根据已受理 invocation 与正式 definition 形成 L2 工具域的治理和隔离承载要求。 |

### 2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `requirement_id` | `ExecutionRequirementId` | 本次要求判断标识。 |
| `invocation_id` | `ToolInvocationId` | 被判断 invocation。 |
| `authorization_requirement` | `AuthorizationRequirementClass` | 表达是否必须消费正式 authorization 结果。 |
| `isolation_requirement` | `IsolationRequirementClass` | 表达是否必须经 Sandbox 隔离边界。 |
| `carrier_requirement` | `ExecutionCarrierRequirement` | 表达允许的承载类别约束，不指定 provider / route。 |
| `basis_refs` | `ExecutionRequirementBasisRefSet` | 回链 definition / Binding / invocation 的正式依据。 |
| `decided_at` | `DecisionTime` | 要求形成时点。 |

### 2.3 状态集合

| 状态 | 作用 |
|---|---|
| `requirements_satisfied_without_governance` | 不要求 authorization，仍须满足其他适用承载条件。 |
| `authorization_required` | 必须消费正式 authorization 结果后才能继续。 |
| `sandbox_required` | 必须经正式 Sandbox seam，禁止宿主直跑。 |
| `authorization_and_sandbox_required` | 两类前置均须成立，任一不可验证即不得执行。 |
| `unsupported` | 当前正式合同无法表达或满足执行承载要求。 |

### 2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `requires_authorization()` | 判断是否必须消费正式 authorization 结果。 |
| `requires_sandbox()` | 判断是否必须经 Sandbox isolation seam。 |
| `permits_carrier(ExecutionCarrierClass carrier_class)` | 判断候选承载类别是否满足工具域要求。 |
| `is_supported()` | 判断当前要求是否能进入前置消费。 |

### 2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `derive(ToolInvocation invocation, FormalToolDefinition definition, CapabilityBindingAssessment binding_assessment)` | 从正式调用语境形成工具域要求，不生成 effective decision。 |

### 2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 产生 allow / deny 或 authorization truth | Requirement 只说明必须承接哪些正式前置。 |
| 指定 Sandbox environment、provider route 或执行命令 | 具体 execution truth / mapping 属于外部 seam 与 03。 |
| 由配置绕过 governed / sandbox-required 分类 | 关键安全前置不可配置化取消。 |

## 3. `AuthorizationConsumptionAssessment`

### 3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 执行前置与条件交接 |
| 对象类型 | external-result consumption assessment |
| 主要责任 | 判断本次 invocation 的正式 authorization result 来源、时点和允许摘要是否足以被 L2 消费。 |

### 3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `assessment_id` | `AuthorizationConsumptionAssessmentId` | L2 消费判断标识。 |
| `invocation_id` | `ToolInvocationId` | 被授权前置约束的 invocation。 |
| `authorization_result_ref` | `AuthorizationResultRef` | 指向外部 owner 的正式结果。 |
| `decision_safe_summary` | `AuthorizationDecisionSafeSummary` | 仅保留允许消费的 allow / deny / constrained 摘要。 |
| `assessment_state` | `AuthorizationConsumptionState` | 表达 accepted-allow / accepted-deny / missing / stale / conflict / unverifiable。 |
| `consumed_at` | `ConsumptionTime` | 固定本次同步前置消费时点。 |

### 3.3 状态集合

| 状态 | 作用 |
|---|---|
| `accepted_allow` | 正式来源可验证，外部结果允许本次调用继续其他前置。 |
| `accepted_deny` | 正式来源可验证，外部结果要求 no-execution。 |
| `accepted_constrained` | 正式结果可消费，但附带必须继续满足的安全约束。 |
| `missing` | 必需结果不存在。 |
| `stale` | 结果不满足本次消费时点的可用性要求。 |
| `conflicting` | Authority、result 或安全摘要相互冲突。 |
| `unverifiable` | Owner / source / result contract 不足以验证；当前 blocker 下必须 fail closed。 |

### 3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `permits_execution_preparation()` | 仅在可验证 allow / constrained 且约束可满足时允许继续。 |
| `requires_no_execution()` | 判断正式 deny 或保守状态是否必须收束为 no-execution。 |
| `requires_fail_closed()` | 判断 missing / stale / conflict / unverifiable 是否触发保守失败。 |
| `matches_invocation(ToolInvocationId invocation_id)` | 防止复用其他 invocation 的 authorization result。 |

### 3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `consume(ToolInvocation invocation, ExecutionRequirement requirement, AuthorizationResultRef result_ref, AuthorizationDecisionSafeSummary summary, ConsumptionTime consumed_at)` | 从正式外部结果形成 L2 消费判断。 |
| `fail_closed(ToolInvocationId invocation_id, AuthorizationGapReason reason)` | 在 owner / source / result 不可验证时形成保守判断。 |

### 3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 自行推导 effective allow / deny | L2 只消费正式 owner 的结果。 |
| 以 Hub visibility、Binding、Sandbox policy 或本地 allowlist 替代正式结果 | 相邻语义不能成为 authorization fallback。 |
| 缓存 last-known-good 并跨 invocation 复用 | 每次 governed invocation 必须锚定本次正式结果与时点。 |

## 4. `ExecutionHandoff`

### 4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 执行前置与条件交接 |
| 对象类型 | domain handoff context |
| 主要责任 | 在适用前置成立后准备面向执行 seam 的 canonical、最小且可关联交接语境。 |

### 4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `handoff_id` | `ExecutionHandoffId` | L2 执行交接语境标识。 |
| `invocation_id` | `ToolInvocationId` | 被交接 canonical invocation。 |
| `requirement_ref` | `ExecutionRequirementRef` | 回链工具域执行要求。 |
| `authorization_assessment_ref` | `AuthorizationConsumptionAssessmentRef` | Governed 场景的 L2 消费判断引用。 |
| `sandbox_readiness_snapshot_ref` | `SandboxReadinessSnapshotRef` | Sandbox-required 场景的消费时点摘要引用。 |
| `canonical_execution_summary` | `CanonicalExecutionSafeSummary` | 面向 adapter 的合同内最小语义，不是 Sandbox request body。 |
| `correlation_ref` | `CorrelationRef` | 关联后续 attempt 与 source material。 |

### 4.3 状态集合

| 状态 | 作用 |
|---|---|
| `preparing` | Handoff 语境正在验证所需前置。 |
| `eligible` | L2 判断适用前置满足，可尝试交接。 |
| `blocked` | Authorization、Sandbox readiness、mapping 或 carrier 条件不成立。 |
| `invalidated` | 交接前发现其 invocation / snapshot / ref 已不再适用。 |

### 4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `evaluate_eligibility(ExecutionRequirement requirement, AuthorizationConsumptionAssessment authorization, SandboxReadinessSnapshot readiness)` | 根据适用前置判断 L2 handoff eligibility。 |
| `mark_blocked(ExecutionHandoffGapReason reason)` | 显式记录不能交接的本地 gap。 |
| `matches_correlation(CorrelationRef correlation_ref)` | 判断后续 source / attempt 是否可回链。 |
| `is_body_free()` | 验证交接语境不包含禁止正文。 |

### 4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `prepare(ToolInvocation invocation, ExecutionRequirement requirement, PreconditionAssessmentRefs assessment_refs, CanonicalExecutionSafeSummary summary)` | 从已受理调用与前置判断准备 L2 handoff。 |

### 4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 Sandbox request / command / environment / secret 正文 | 具体 mapping 与 execution truth 不属于 L2 handoff context。 |
| 将 eligible 表述为 Sandbox ready / accepted / receipt | Eligible 只是 L2 本地判断。 |
| Sandbox-required 时切换为宿主直跑或其他未授权 carrier | Isolation 要求不可旁路。 |

## 5. `ExecutionHandoffAttempt`

### 5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 执行前置与条件交接 |
| 对象类型 | append-only attempt fact |
| 主要责任 | 记录 L2 对 execution seam 的本地交接尝试、即时本地结果和已知 gap，不拥有外部 receipt / run。 |

### 5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `attempt_id` | `ExecutionHandoffAttemptId` | 本地尝试事实标识。 |
| `handoff_id` | `ExecutionHandoffId` | 被尝试交接语境。 |
| `attempt_state` | `ExecutionHandoffAttemptState` | attempted / locally-failed / carrier-unavailable / blocked-gap。 |
| `local_failure_summary` | `HandoffLocalFailureSummary` | 仅记录 L2 可知的本地失败摘要。 |
| `external_receipt_ref` | `ExternalReceiptRef` | 仅在未来正式 receipt contract 成立时允许引用；当前为空缺口语义。 |
| `attempted_at` | `AttemptTime` | 本地尝试时点。 |

### 5.3 状态集合

| 状态 | 作用 |
|---|---|
| `attempted` | L2 已调用正式 carrier，但不能由此推断外部 accepted。 |
| `locally_failed` | 尝试在 L2 / adapter 边界内明确失败。 |
| `carrier_unavailable` | 正式执行 seam 当前不可用。 |
| `blocked_gap` | Mapping、receipt 或 contract 缺口阻止正向交接。 |

### 5.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `has_external_receipt()` | 判断未来是否存在可验证正式 receipt ref。 |
| `is_local_failure()` | 判断失败是否发生在 L2 可拥有边界。 |
| `explains_handoff(ExecutionHandoffId handoff_id)` | 判断 attempt 是否归属于指定 handoff。 |

### 5.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record_attempt(ExecutionHandoff handoff, AttemptTime attempted_at)` | 记录已发起本地 carrier 调用的事实。 |
| `record_local_failure(ExecutionHandoff handoff, HandoffLocalFailureSummary failure)` | 记录未形成外部成功声明的本地失败。 |
| `record_blocked_gap(ExecutionHandoff handoff, ExecutionHandoffGapReason reason)` | 记录开放合同阻止交接的 gap。 |

### 5.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 使用 `accepted`、`running`、`completed` 等 Sandbox lifecycle 状态 | 外部 execution truth 不属于本地 attempt。 |
| 伪造 receipt、DLQ、feedback 或 cleanup ref | `L2T-UP-004` 未闭口。 |
| 与 post-outcome `ExternalSubmissionAttempt` 合并 | 两者目标、时点和外部 owner 不同。 |

## 6. `AuthorizationResultRef`

### 6.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 执行前置与条件交接 |
| 对象类型 | blocked external reference object |
| 主要责任 | 在正式 owner / result contract 成立时指向本次 authorization decision；当前缺口必须显式不可验证。 |

### 6.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `result_ref_id` | `AuthorizationResultRefId` | 本地 typed ref 标识。 |
| `authorization_authority_ref` | `AuthorizationAuthorityRef` | 指向正式 owner；当前 owner-pending。 |
| `external_decision_ref` | `ExternalAuthorizationDecisionRef` | 指向本次外部结果，不保存 decision body。 |
| `invocation_correlation_ref` | `CorrelationRef` | 防止结果跨 invocation 复用。 |
| `source_revision_ref` | `ExternalRevisionRef` | 锚定结果来源 revision / authority 语境。 |
| `resolution_state` | `ExternalReferenceState` | resolved / stale / conflicting / unverifiable。 |

### 6.3 状态集合

| 状态 | 作用 |
|---|---|
| `resolved` | Owner、source、decision ref 和 correlation 均可验证。 |
| `stale` | 结果不满足本次消费时点要求。 |
| `conflicting` | Owner、source 或 decision refs 冲突。 |
| `unverifiable` | 正式 owner / source / contract 未闭口；当前默认状态。 |

### 6.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `matches_invocation(CorrelationRef correlation_ref)` | 验证结果与本次 invocation 的关联。 |
| `is_from_authority(AuthorizationAuthorityRef authority_ref)` | 验证来源 owner。 |
| `supports_consumption()` | 仅在 ref resolved 时允许进入 L2 assessment。 |

### 6.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_formal_result(AuthorizationAuthorityRef authority_ref, ExternalAuthorizationDecisionRef decision_ref, CorrelationRef correlation_ref, ExternalRevisionRef revision_ref)` | 在正式 contract 成立后建立 typed ref。 |
| `unverifiable(AuthorizationGapReason reason)` | 当前 owner / source 缺失时形成显式 gap ref。 |

### 6.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 当前声明已存在 owner、schema、freshness 或 result route | `L2T-UP-001~002` 仍开放。 |
| 保存 policy / approval / taxonomy / decision 正文 | Ref 不迁移 authorization truth。 |
| 由 L2 生成或更改 external decision ref | Ref 只能承接正式 owner 结果。 |

## 7. `SandboxReadinessSnapshot`

### 7.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 执行前置与条件交接 |
| 对象类型 | external-owner safe snapshot |
| 主要责任 | 保存执行前消费时点的 Sandbox authority、capability / readiness 安全摘要与已知 mapping gap。 |

### 7.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `snapshot_id` | `SandboxReadinessSnapshotId` | 本地快照标识。 |
| `sandbox_authority_ref` | `SandboxAuthorityRef` | 指向正式 Sandbox owner。 |
| `execution_capability_ref` | `SandboxExecutionCapabilityRef` | 指向适用执行能力，不保存 environment / command body。 |
| `readiness_safe_summary` | `SandboxReadinessSafeSummary` | 允许的前置摘要；不等于外部 ready truth。 |
| `mapping_status` | `SandboxMappingStatus` | 表达 ToolInvocation 到 generic execution mapping 是否 formal / blocked。 |
| `consumed_at` | `ConsumptionTime` | 固定执行前消费时点。 |

### 7.3 状态集合

| 状态 | 作用 |
|---|---|
| `eligible_source_available` | 有正式来源摘要可供 L2 评估；不等于外部 accepted。 |
| `mapping_blocked` | 语义 mapping 未闭口，不能准备正向 handoff。 |
| `stale` | 摘要可能不满足本次执行前消费时点。 |
| `conflicting` | Authority、capability 或 mapping 线索冲突。 |
| `unavailable` | 正式 Sandbox seam 当前不可用。 |

### 7.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `supports_requirement(ExecutionRequirement requirement)` | 判断快照是否覆盖本次隔离 / carrier 要求。 |
| `has_formal_mapping()` | 判断正向语义 mapping 是否已由正式合同成立。 |
| `requires_blocked_handoff()` | 判断当前 snapshot 是否必须阻止交接。 |

### 7.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `capture(SandboxAuthorityRef authority_ref, SandboxExecutionCapabilityRef capability_ref, SandboxReadinessSafeSummary summary, SandboxMappingStatus mapping_status, ConsumptionTime consumed_at)` | 从正式 Sandbox seam 形成执行前安全快照。 |

### 7.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 把 snapshot 状态命名为 Sandbox accepted / running / completed | Snapshot 不拥有 execution lifecycle。 |
| 保存 environment、run、capture、failure、receipt、cleanup 正文 | 这些事实由 Sandbox 拥有。 |
| Mapping blocked 时回退宿主执行或伪造 ready | `L2T-UP-003~004` 必须诚实承接。 |

## 8. 本组成部分停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 候选处理完整 | pass | 6 个候选全部独立成节。 |
| Capability 来源 | pass | Requirement、authorization consumption、readiness、handoff 与 attempt 均有对象承接。 |
| Requirement / decision 分工 | pass | L2 requirement 不产生 effective authorization truth。 |
| Handoff / execution 分工 | pass | L2 context / attempt 不拥有 accepted、run、receipt 或 cleanup。 |
| Blocker 诚实 | pass | `L2T-UP-001~004` 继续开放，ref / snapshot 可为 unverifiable / blocked。 |
| 字段 / 函数粒度 | pass | 未写 schema、mapping、route、freshness 数值或实现。 |

```text
component_status = completed
gate_status = pass
next_allowed_action = complete_outcome_audit_handoff_object_appendix
```
