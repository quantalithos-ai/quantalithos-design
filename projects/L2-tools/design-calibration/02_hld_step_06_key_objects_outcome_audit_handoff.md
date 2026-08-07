# L2-tools 02 概要 Step 6 对象附录: Outcome、审计与安全交接

> 创建日期: 2026-08-05
> 状态: completed
> 主控文件: `design-calibration/02_hld_step_06_key_objects.md`
> 组成部分来源: Step 5 §8 Outcome、审计与安全交接
> Blocker 继承: `L2T-UP-003~007` 持续开放；不声明 Sandbox source mapping、Bus / Observability route、delivery / observation 或 readiness 已成立。

---

## 1. 对象正式化范围

本附录正式化 10 个对象：`ExecutionSourceAssessment`、`ToolInvocationOutcome`、`ToolAuditEntry`、`SandboxExecutionSourceRef`、`BusDeliveryStatusRef`、`ObservationMaterialRef`、`SafeHandoffEligibility`、`SafeHandoffMaterial`、`ExternalSubmissionAttempt`、`OutcomeAuditView`。Raw capture、provider response、Bus history、Observability store、evidence / signoff 与 Runtime recovery 均禁止进入字段。

## 2. `ExecutionSourceAssessment`

### 2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | Outcome、审计与安全交接 |
| 对象类型 | execution-source consumption assessment |
| 主要责任 | 判断外部 execution material 的来源、关联、时点和 mapping 是否足以进入 L2 outcome 归一化。 |

### 2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `assessment_id` | `ExecutionSourceAssessmentId` | L2 source 受理判断标识。 |
| `invocation_id` | `ToolInvocationId` | 被解释的 canonical invocation。 |
| `source_ref` | `SandboxExecutionSourceRef` | 指向正式 Sandbox execution material。 |
| `source_safe_summary` | `ExecutionSourceSafeSummary` | 仅保留 outcome 判断所需最小摘要。 |
| `mapping_assessment` | `ExecutionOutcomeMappingAssessment` | 表达 source 到 normalized outcome 的 mapping 是否正式可解释。 |
| `assessment_state` | `ExecutionSourceAssessmentState` | accepted / rejected / missing / conflicting / unverifiable / mapping-blocked。 |
| `assessed_at` | `AssessmentTime` | 固定 source 消费判断时点。 |

### 2.3 状态集合

| 状态 | 作用 |
|---|---|
| `accepted` | Source authority、correlation、时点和 mapping 均足以进入归一化。 |
| `rejected` | Source 明确不属于指定 invocation 或违反合同边界。 |
| `missing` | Outcome 所需 execution source 尚未到达或不存在。 |
| `conflicting` | Source refs、correlation 或 owner attribution 冲突。 |
| `unverifiable` | 无法验证正式 source authority / material。 |
| `mapping_blocked` | Source 存在，但 ToolInvocation / generic execution / outcome mapping 未闭口。 |

### 2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `permits_normalization()` | 仅在 accepted 时允许形成 source-backed outcome。 |
| `requires_source_gap()` | 判断 missing / conflict / unverifiable / mapping-blocked 是否必须记录 gap。 |
| `matches_invocation(ToolInvocationId invocation_id)` | 防止 source 跨 invocation 误用。 |
| `contains_forbidden_body()` | 检测评估材料是否误含 raw / secret 正文。 |

### 2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `assess(ToolInvocation invocation, SandboxExecutionSourceRef source_ref, ExecutionSourceSafeSummary summary, ExecutionOutcomeMappingAssessment mapping)` | 正式受理 execution source 并形成 L2 assessment。 |
| `mapping_blocked(ToolInvocationId invocation_id, SandboxExecutionSourceRef source_ref, MappingGapReason reason)` | 在 mapping 未闭口时形成显式阻塞判断。 |

### 2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 raw capture、provider response、stdout、secret 或 Sandbox failure body | Assessment 只保留 ref / safe summary。 |
| Source 到达即自动写 outcome | 必须先验证 authority、correlation、时点和 mapping。 |
| 猜测 mapping 或把 capture 直接当 result | `L2T-UP-003` 未闭口。 |

## 3. `ToolInvocationOutcome`

### 3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | Outcome、审计与安全交接 |
| 对象类型 | terminal domain aggregate |
| 主要责任 | 承载一次 canonical invocation 唯一的消费者可见 normalized result / error / no-execution 终态。 |

### 3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `outcome_id` | `ToolInvocationOutcomeId` | 工具语义终态标识。 |
| `invocation_id` | `ToolInvocationId` | 被终结的 canonical invocation。 |
| `contract_anchor_ref` | `InvocationContractAnchorRef` | 固定 outcome 解释所用 definition revision。 |
| `outcome_class` | `ToolOutcomeClass` | Success、tool-failure、execution-failure、capture-failure 或 no-execution。 |
| `normalized_result` | `NormalizedToolResultSummary` | Success 时的合同内结果摘要。 |
| `normalized_error` | `NormalizedToolErrorSummary` | 失败 / no-execution 时的合同内错误摘要。 |
| `source_assessment_ref` | `ExecutionSourceAssessmentRef` | Source-backed outcome 的受理依据；no-execution 可为空语义。 |
| `admission_or_precondition_ref` | `NoExecutionBasisRef` | No-execution 的执行前判断依据。 |
| `decided_at` | `DecisionTime` | Outcome 正式成立时点。 |

### 3.3 状态集合

| 状态 | 作用 |
|---|---|
| `succeeded` | 可信 source 已被映射为合同内 normalized result。 |
| `tool_failed` | 工具语义执行完成但产生合同内业务 / 工具失败。 |
| `execution_failed` | 执行承载失败已被映射为工具消费者可理解的 error。 |
| `capture_failed` | 执行材料捕获失败被明确区分，不伪造 result。 |
| `no_execution_rejected` | Admission 或正式前置拒绝，真实执行未发生。 |
| `no_execution_unavailable` | 所需合同 / source / authorization / carrier 不可用，真实执行未发生。 |

### 3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_terminal()` | Outcome 一旦成立即为该 invocation 的本地工具语义终态。 |
| `is_no_execution()` | 判断真实执行是否未发生。 |
| `is_source_backed()` | 判断终态是否必须回链 accepted source assessment。 |
| `matches_contract(InvocationContractAnchor anchor)` | 验证 outcome 与 invocation definition 语境一致。 |
| `supports_safe_handoff_evaluation()` | 判断本地 outcome / audit 收口后是否可进入安全资格判断。 |

### 3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `succeed(ToolInvocation invocation, ExecutionSourceAssessment source, NormalizedToolResultSummary result)` | 从 accepted source 形成 normalized success。 |
| `fail(ToolInvocation invocation, ExecutionSourceAssessment source, ToolOutcomeClass failure_class, NormalizedToolErrorSummary error)` | 从可信 source 形成分层失败终态。 |
| `no_execution(ToolInvocation invocation, NoExecutionBasisRef basis_ref, NormalizedToolErrorSummary error)` | 从 admission / precondition 事实形成消费者可见无执行终态。 |

### 3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 直接保存 raw capture、provider body、stdout 或 transport error | Outcome 只拥有 normalized 工具语义。 |
| 以 Bus delivery、Observability observation 或 downstream query 改写终态 | 外围状态不反写本地 truth。 |
| 把 external handoff failure 变成原 outcome 的覆盖状态 | Post-outcome 提交失败属于 `ExternalSubmissionAttempt` / gap。 |
| 在 source mapping 未闭口时声称正向 result / error ready | `L2T-UP-003` 阻塞具体 source-backed path。 |

## 4. `ToolAuditEntry`

### 4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | Outcome、审计与安全交接 |
| 对象类型 | append-only audit record |
| 主要责任 | 回链 tool / definition、Binding、invocation、admission / precondition、outcome 与允许 source refs，形成工具域可解释审计。 |

### 4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `audit_entry_id` | `ToolAuditEntryId` | 工具域审计记录标识。 |
| `tool_id` | `ToolId` | 回链稳定 Tool identity。 |
| `invocation_id` | `ToolInvocationId` | 回链 canonical invocation。 |
| `contract_anchor_ref` | `InvocationContractAnchorRef` | 固定 definition / Binding 消费语境。 |
| `judgment_refs` | `ToolJudgmentRefSet` | 回链 admission、requirement、authorization assessment、handoff 等适用判断。 |
| `outcome_id` | `ToolInvocationOutcomeId` | 回链唯一工具语义终态。 |
| `source_refs` | `AllowedSourceRefSet` | 保存允许的 typed refs，不保存 execution body。 |
| `known_gap_refs` | `ConsistencyGapRefSet` | 关联已知 audit / source / handoff 缺口。 |
| `recorded_at` | `AuditTime` | 审计事实形成时点。 |

### 4.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `explains_outcome(ToolInvocationOutcome outcome)` | 判断审计回链是否足以解释指定 outcome。 |
| `has_known_gap(ConsistencyGapRef gap_ref)` | 判断指定缺口是否已显式记录。 |
| `is_body_free()` | 验证审计中无 raw / secret / external-owner body。 |
| `is_correlated()` | 验证 identity、invocation、outcome 与 source refs 的关联闭合。 |

### 4.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record(ToolInvocation invocation, ToolInvocationOutcome outcome, ToolJudgmentRefSet judgment_refs, AllowedSourceRefSet source_refs)` | 与 outcome 收口形成工具域 audit entry。 |
| `record_with_gap(ToolInvocation invocation, ToolInvocationOutcome outcome, ConsistencyGapRefSet gaps)` | 在审计材料存在显式缺口时保留可判断记录。 |

### 4.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 包含 secret、credential、raw prompt / capture、provider body 或高敏完整引用 | Audit 需求不解除 forbidden-body 边界。 |
| 充当 Bus delivery history、Observability store 或 Runtime checkpoint | 这些 truth 有独立 owner。 |
| 静默覆盖既有 entry 或缺口 | 工具域 audit 必须 append-only、可解释。 |

## 5. `SandboxExecutionSourceRef`

### 5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | Outcome、审计与安全交接 |
| 对象类型 | blocked external reference object |
| 主要责任 | 指向与特定 invocation / handoff 关联的正式 Sandbox execution source / failure material，不拥有正文。 |

### 5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `source_ref_id` | `SandboxExecutionSourceRefId` | 本地 typed ref 标识。 |
| `sandbox_authority_ref` | `SandboxAuthorityRef` | 指向正式 Sandbox owner。 |
| `external_execution_ref` | `ExternalSandboxExecutionRef` | 指向 run / capture / failure source，不保存其正文。 |
| `handoff_correlation_ref` | `CorrelationRef` | 回链 L2 execution handoff。 |
| `source_class` | `SandboxExecutionSourceClass` | 区分 success material、tool failure、execution failure、capture failure 等来源类别。 |
| `source_revision_ref` | `ExternalRevisionRef` | 锚定外部 source contract revision。 |
| `resolution_state` | `ExternalReferenceState` | resolved / stale / conflicting / unverifiable / mapping-blocked。 |

### 5.3 状态集合

| 状态 | 作用 |
|---|---|
| `resolved` | Authority、external ref 与 correlation 可验证。 |
| `stale` | Source ref 不满足当前消费时点。 |
| `conflicting` | Authority、execution ref 或 correlation 冲突。 |
| `unverifiable` | 无法证明 source 来自正式 Sandbox boundary。 |
| `mapping_blocked` | Ref 可定位，但其 source class 到工具 outcome 的正式 mapping 未闭口。 |

### 5.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `matches_handoff(CorrelationRef handoff_correlation_ref)` | 验证 source 与 L2 handoff 关联。 |
| `is_from_authority(SandboxAuthorityRef authority_ref)` | 验证 Sandbox owner。 |
| `supports_assessment()` | 判断 ref 是否足以进入 source assessment。 |

### 5.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_sandbox(SandboxAuthorityRef authority_ref, ExternalSandboxExecutionRef execution_ref, CorrelationRef correlation_ref, SandboxExecutionSourceClass source_class)` | 从正式 Sandbox source seam 建立 typed ref。 |
| `mapping_blocked(ExternalSandboxExecutionRef execution_ref, MappingGapReason reason)` | Mapping 未闭口时形成显式 blocked ref。 |

### 5.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 run、capture、failure、provider response 或 cleanup 正文 | Ref 不迁移 Sandbox execution truth。 |
| 当前伪造 source carrier、receipt 或 mapping authority | `L2T-UP-003~004` 持续开放。 |
| Ref resolved 即直接形成 outcome | 仍必须经过 `ExecutionSourceAssessment`。 |

## 6. `BusDeliveryStatusRef`

### 6.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | Outcome、审计与安全交接 |
| 对象类型 | conditional external status reference |
| 主要责任 | 在正式反馈来源成立时，指向与特定本地 submission attempt 关联的 Bus delivery 状态，不拥有 delivery truth。 |

### 6.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `delivery_status_ref_id` | `BusDeliveryStatusRefId` | 本地 typed ref 标识。 |
| `bus_authority_ref` | `BusAuthorityRef` | 指向 Bus delivery truth owner。 |
| `submission_attempt_id` | `ExternalSubmissionAttemptId` | 关联 L2 本地提交尝试。 |
| `external_delivery_ref` | `ExternalBusDeliveryRef` | 指向正式 delivery fact / status，不保存正文。 |
| `status_safe_summary` | `BusDeliverySafeSummary` | 允许的外部状态摘要。 |
| `consumed_at` | `ConsumptionTime` | 外部状态被 L2 消费的时点。 |

### 6.3 状态集合

| 状态 | 作用 |
|---|---|
| `unknown` | 无正式反馈来源或当前状态未知。 |
| `referenced` | 已获得可验证 external delivery ref；具体状态仍由 Bus 拥有。 |
| `stale` | 外部状态摘要可能已变化。 |
| `conflicting` | Attempt、delivery ref 或 authority 不一致。 |
| `unverifiable` | 无法验证正式反馈来源。 |

### 6.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `matches_attempt(ExternalSubmissionAttemptId attempt_id)` | 验证 status ref 与本地 attempt 关联。 |
| `has_verified_delivery_ref()` | 判断是否具备正式 external delivery ref。 |
| `requires_status_gap()` | 判断 unknown / conflict / unverifiable 是否需显式 gap。 |

### 6.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_feedback(BusAuthorityRef authority_ref, ExternalSubmissionAttemptId attempt_id, ExternalBusDeliveryRef delivery_ref, BusDeliverySafeSummary summary, ConsumptionTime consumed_at)` | 在正式 feedback seam 成立后建立状态 ref。 |
| `unknown(ExternalSubmissionAttemptId attempt_id, ExternalStatusGapReason reason)` | 缺正式反馈时保留未知状态。 |

### 6.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 由本地 submitted 推导 Bus delivered | 本地调用成功不等于外部 delivery truth。 |
| 保存 Bus history 或消息 body | Ref 只保存定位与安全摘要。 |
| 以 delivery 状态改变 outcome / audit | 外部传递不反写本地工具终态。 |

## 7. `ObservationMaterialRef`

### 7.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | Outcome、审计与安全交接 |
| 对象类型 | blocked external material / status reference |
| 主要责任 | 在正式 Observability producer / source / route 成立时，指向与安全材料相关的 observation material 或状态，不拥有 observation store。 |

### 7.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `observation_ref_id` | `ObservationMaterialRefId` | 本地 typed ref 标识。 |
| `observation_authority_ref` | `ObservationAuthorityRef` | 指向正式 observation owner / source。 |
| `submission_attempt_id` | `ExternalSubmissionAttemptId` | 回链 L2 本地提交尝试。 |
| `external_material_ref` | `ExternalObservationMaterialRef` | 指向外部材料 / observation，不保存正文。 |
| `observation_safe_summary` | `ObservationStatusSafeSummary` | 允许的外部状态摘要。 |
| `consumed_at` | `ConsumptionTime` | 外部状态消费时点。 |

### 7.3 状态集合

| 状态 | 作用 |
|---|---|
| `route_blocked` | Producer / source / route 未闭口，当前保守状态。 |
| `unknown` | Route 可能存在但无正式可验证 observation 状态。 |
| `referenced` | 获得正式 external material / observation ref。 |
| `stale` | 外部摘要可能已变化。 |
| `conflicting` | Authority、attempt 或 material ref 冲突。 |
| `unverifiable` | 无法证明材料来自正式 observation source。 |

### 7.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `matches_attempt(ExternalSubmissionAttemptId attempt_id)` | 验证 ref 与本地 attempt 关联。 |
| `has_verified_observation_ref()` | 判断是否具备正式 external material / observation ref。 |
| `requires_route_gap()` | 判断 route-blocked / unverifiable 是否必须显式 gap。 |

### 7.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_formal_source(ObservationAuthorityRef authority_ref, ExternalSubmissionAttemptId attempt_id, ExternalObservationMaterialRef material_ref, ObservationStatusSafeSummary summary, ConsumptionTime consumed_at)` | 在正式 source / route 成立后建立 typed ref。 |
| `route_blocked(ExternalSubmissionAttemptId attempt_id, ObservationRouteGapReason reason)` | 当前正向边界未闭口时形成 blocked ref。 |

### 7.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 当前声明 producer、source family、event schema、route 或 observed | `L2T-UP-005~007` 持续开放。 |
| 保存 Observability store、projection 或 evidence 正文 | External ref 不迁移 observation truth。 |
| 以 observation 驱动 Runtime retry / recovery 或改写 outcome | Observation 是外围消费，不是工具终态控制器。 |

## 8. `SafeHandoffEligibility`

### 8.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | Outcome、审计与安全交接 |
| 对象类型 | policy / guard assessment |
| 主要责任 | 对已成立 outcome / audit 与目标 collaboration class 执行四项合取安全门禁。 |

### 8.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `eligibility_id` | `SafeHandoffEligibilityId` | 安全资格判断标识。 |
| `outcome_id` | `ToolInvocationOutcomeId` | 被评估的已成立本地终态。 |
| `audit_entry_id` | `ToolAuditEntryId` | 回链工具域 audit。 |
| `target_class` | `ExternalCollaborationClass` | 区分 Bus / Observability 等目标类别，不指定 route。 |
| `minimal_necessary_check` | `SafetyCheckResult` | 判断材料是否仅含目标所需最小内容。 |
| `body_free_check` | `SafetyCheckResult` | 判断无 raw / external-owner body。 |
| `redaction_check` | `SafetyCheckResult` | 判断敏感内容已按边界脱敏。 |
| `correlation_check` | `SafetyCheckResult` | 判断材料可安全关联且不会暴露高敏正文。 |
| `eligibility_state` | `SafeHandoffEligibilityState` | eligible / ineligible / unverifiable。 |

### 8.3 状态集合

| 状态 | 作用 |
|---|---|
| `eligible` | 四项检查全部通过，可以准备目标特定 safe material。 |
| `ineligible` | 至少一项明确失败，禁止外部提交。 |
| `unverifiable` | 无法证明任一安全条件，按 ineligible 处理。 |

### 8.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `all_checks_pass()` | 仅在四项检查全部通过时返回 true。 |
| `permits_material_preparation()` | 判断是否允许创建 `SafeHandoffMaterial`。 |
| `failed_checks()` | 提供失败检查类别摘要，不泄露被过滤正文。 |
| `matches_target(ExternalCollaborationClass target_class)` | 防止跨目标复用安全判断。 |

### 8.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `evaluate(ToolInvocationOutcome outcome, ToolAuditEntry audit, ExternalCollaborationClass target_class, SensitivityContext sensitivity)` | 对特定目标执行四项合取门禁。 |

### 8.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 任一检查失败仍标记 eligible | 四项条件是合取关系。 |
| 以“已加密”作为 raw body 外发例外 | 加密不解除最小化、body-free 与脱敏要求。 |
| 裁决 Bus delivery / Observability acceptance policy | 本对象只判断 L2 材料安全资格。 |

## 9. `SafeHandoffMaterial`

### 9.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | Outcome、审计与安全交接 |
| 对象类型 | immutable safe material |
| 主要责任 | 表达已通过目标特定安全门禁的最小、body-free、redacted、correlated 外部协作材料。 |

### 9.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `material_id` | `SafeHandoffMaterialId` | 本地安全材料标识。 |
| `eligibility_id` | `SafeHandoffEligibilityId` | 回链目标特定资格判断。 |
| `target_class` | `ExternalCollaborationClass` | 材料适用的协作目标类别。 |
| `fact_class` | `SafeFactClass` | 表达合同、Binding、outcome、audit 或 gap 等安全事实类别。 |
| `safe_summary` | `BodyFreeFactSummary` | 最小、已脱敏的事实摘要。 |
| `correlation_refs` | `SafeCorrelationRefSet` | 允许的关联引用集合。 |
| `source_truth_refs` | `LocalTruthRefSet` | 回链已成立 L2 truth，不保存正文。 |
| `prepared_at` | `MaterialPreparationTime` | 材料准备时点。 |

### 9.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_body_free()` | 验证无 raw prompt / capture / provider / secret body。 |
| `is_correlated()` | 验证安全引用足以回链本地 truth。 |
| `is_for_target(ExternalCollaborationClass target_class)` | 防止材料跨目标不当复用。 |
| `matches_eligibility(SafeHandoffEligibility eligibility)` | 验证材料由对应资格判断产生。 |

### 9.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `prepare(SafeHandoffEligibility eligibility, BodyFreeFactSummary summary, SafeCorrelationRefSet correlations, LocalTruthRefSet truth_refs)` | 仅在 eligibility 为 eligible 时创建不可变材料。 |

### 9.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 包含 secret、credential、raw prompt / capture、provider body 或完整高敏引用 | 材料必须保持正文安全。 |
| 充当 outbound event schema / payload 定稿 | 具体 event / route / schema 留 Step 7 / 03，且当前可能 blocked。 |
| 由后台 Job 自行修改内容或 eligibility | 新目标 / 变化必须重新评估并形成新材料。 |

## 10. `ExternalSubmissionAttempt`

### 10.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | Outcome、审计与安全交接 |
| 对象类型 | append-only submission fact |
| 主要责任 | 记录 outcome / audit 成立后，L2 将安全材料提交到 event collaboration boundary 的本地尝试、降级与 gap。 |

### 10.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `attempt_id` | `ExternalSubmissionAttemptId` | 本地提交尝试标识。 |
| `material_id` | `SafeHandoffMaterialId` | 被提交安全材料。 |
| `target_class` | `ExternalCollaborationClass` | Bus / Observability 等逻辑目标类别。 |
| `attempt_state` | `ExternalSubmissionAttemptState` | prepared / submitted-locally / locally-failed / route-blocked / degraded。 |
| `local_failure_summary` | `SubmissionLocalFailureSummary` | L2 可知的本地失败摘要。 |
| `delivery_status_ref` | `BusDeliveryStatusRef` | 条件关联外部 delivery ref。 |
| `observation_material_ref` | `ObservationMaterialRef` | 条件关联 observation ref。 |
| `attempted_at` | `AttemptTime` | 本地提交时点。 |

### 10.3 状态集合

| 状态 | 作用 |
|---|---|
| `prepared` | 安全材料已准备，尚未调用协作边界。 |
| `submitted_locally` | L2 已调用正式 event port；不等于 delivered / observed。 |
| `locally_failed` | L2 / adapter 边界内提交明确失败。 |
| `route_blocked` | Producer / source / route 尚未闭口，无法正向提交。 |
| `degraded` | 外部状态未知、反馈不可验证或部分目标不可用。 |

### 10.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_local_submission()` | 判断本地 event port 是否已被调用。 |
| `has_verified_delivery_ref()` | 判断是否获得正式 Bus delivery status ref。 |
| `has_verified_observation_ref()` | 判断是否获得正式 observation material ref。 |
| `requires_gap()` | 判断 locally-failed / route-blocked / degraded 是否需要一致性 gap。 |

### 10.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `prepare(SafeHandoffMaterial material)` | 创建尚未提交的本地 attempt。 |
| `record_submission(SafeHandoffMaterial material, AttemptTime attempted_at)` | 记录 L2 已调用协作边界，不声明外部成功。 |
| `record_route_blocked(SafeHandoffMaterial material, ObservationRouteGapReason reason)` | 当前 route 未闭口时形成显式 blocked attempt。 |
| `record_local_failure(SafeHandoffMaterial material, SubmissionLocalFailureSummary failure)` | 记录本地提交失败。 |

### 10.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 将 `submitted_locally` 写成 delivered / observed / accepted | 外部状态由 Bus / Observability owner 提供。 |
| 因提交失败回滚 outcome / audit | Local truth first，不存在跨 owner 事务。 |
| 与 `ExecutionHandoffAttempt` 合并 | 本对象发生在 outcome 之后，目标是外围事实传播。 |
| 驱动 Runtime retry / recovery | 外围 handoff 不拥有运行主线。 |

## 11. `OutcomeAuditView`

### 11.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | Outcome、审计与安全交接 |
| 对象类型 | read model |
| 主要责任 | 稳定读取 normalized outcome、Tool audit、安全资格 / 本地提交状态与允许 external refs。 |

### 11.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `invocation_id` | `ToolInvocationId` | 查询目标 invocation。 |
| `outcome_summary` | `ToolInvocationOutcomeSummary` | 消费者可见的 normalized 终态摘要。 |
| `audit_summary` | `ToolAuditSafeSummary` | 工具域追溯摘要与已知 gap。 |
| `safe_handoff_summary` | `SafeHandoffStateSummary` | Eligibility、material 与本地 submission 摘要。 |
| `delivery_status_ref` | `BusDeliveryStatusRef` | 条件外部 delivery ref，不升级为本地终态。 |
| `observation_material_ref` | `ObservationMaterialRef` | 条件 observation ref，不升级为本地 audit。 |

### 11.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `has_terminal_outcome()` | 判断 L2 工具语义终态是否成立。 |
| `has_explainable_audit()` | 判断 audit 与已知 gap 是否足以解释 outcome。 |
| `has_submission_gap()` | 判断安全材料准备 / 提交是否存在本地 gap。 |
| `external_status_is_unknown()` | 判断 delivery / observation 是否仍无正式可验证反馈。 |

### 11.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `project(ToolInvocationOutcome outcome, ToolAuditEntry audit, SafeHandoffSummary handoff_summary, ExternalStatusRefs external_refs)` | 从本地 truth 与允许 refs 形成稳定读取视图。 |

### 11.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 查询外部系统后原地改写 outcome / audit | 外部反馈只能形成新 snapshot / ref / gap。 |
| 暴露 raw source、provider body、Bus history 或 observation store | View 保持 body-free。 |
| 将 delivery / observation unknown 解释为失败或成功 | Unknown 必须保持独立外部状态语义。 |

## 12. 本组成部分停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 候选处理完整 | pass | 10 个候选全部独立成节。 |
| Capability 来源 | pass | Source intake、outcome、audit、安全门禁 / 材料、submission、读取均有对象承接。 |
| Source / outcome 分工 | pass | Source ref / assessment 不直接成为 normalized outcome。 |
| Outcome / audit / handoff 分工 | pass | 本地终态与审计先成立，外围提交只形成本地 attempt / gap。 |
| External status 分工 | pass | Bus delivery 与 Observability observation refs 分开，均不反写本地 truth。 |
| 安全门禁 | pass | Minimal necessary、body-free、redacted、correlated 四项合取，无加密例外。 |
| Blocker 诚实 | pass | Mapping / route / feedback / readiness 未伪造，使用 blocked / unknown / unverifiable。 |

```text
component_status = completed
gate_status = pass
next_allowed_action = complete_integrity_derived_object_appendix
```
