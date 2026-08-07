# L2-tools 02 概要 Step 6 对象附录: 规范调用与受理

> 创建日期: 2026-08-05
> 状态: completed
> 主控文件: `design-calibration/02_hld_step_06_key_objects.md`
> 组成部分来源: Step 5 §6 规范调用与受理

---

## 1. 对象正式化范围

本附录正式化 5 个对象：`ToolInvocation`、`InvocationAdmission`、`InvocationContractAnchor`、`ToolInvocationView`、`InvocationContextRefs`。Caller request DTO、transport body、Runtime action / plan、handler 和 idempotency algorithm 不属于本步对象。

## 2. `ToolInvocation`

### 2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 规范调用与受理 |
| 对象类型 | domain aggregate |
| 主要责任 | 承载跨 caller / carrier 唯一的 canonical 工具调用语义及其合同锚定。 |

### 2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `invocation_id` | `ToolInvocationId` | 本次 canonical invocation 的稳定标识。 |
| `contract_anchor` | `InvocationContractAnchor` | 固定本次消费的 tool / definition / Binding 语境。 |
| `canonical_intent` | `CanonicalInvocationIntent` | 仅包含合同允许的调用目标与参数语义。 |
| `context_refs` | `InvocationContextRefs` | 保存允许的 caller / actor / work / trace / correlation 引用。 |
| `established_at` | `DecisionTime` | Invocation 规范成立的时间锚点。 |

### 2.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `matches_tool(ToolId tool_id)` | 判断 invocation 是否锚定预期工具。 |
| `matches_revision(DefinitionRevision revision)` | 判断本次调用是否消费指定 definition revision。 |
| `accepts_admission(InvocationAdmission admission)` | 验证 admission 是否属于本 invocation 且发生在真实执行前。 |
| `has_correlation(CorrelationRef correlation_ref)` | 判断允许关联引用是否匹配。 |

### 2.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `canonicalize(FormalInvocationIntent intent, InvocationContractAnchor anchor, InvocationContextRefs context_refs)` | 将正式 caller intent 收束为 canonical invocation，不保留 raw body。 |

### 2.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 raw prompt、caller / transport request、conversation 或 secret | 合同归一化不能使 forbidden body 获准入仓。 |
| 承载 Runtime action choice、plan、loop、checkpoint、retry / recovery | Runtime orchestration 不属于工具调用 truth。 |
| 因 direct / adapter / Sandbox / future SDK carrier 创建私有 invocation 变体 | Caller 与 carrier 不得分叉正式语义。 |

## 3. `InvocationAdmission`

### 3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 规范调用与受理 |
| 对象类型 | decision fact |
| 主要责任 | 在任何真实执行前记录 canonical invocation 的受理、拒绝、等待前置或不可用判断。 |

### 3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `admission_id` | `InvocationAdmissionId` | 执行前判断事实标识。 |
| `invocation_id` | `ToolInvocationId` | 被判断 invocation。 |
| `admission_state` | `InvocationAdmissionState` | admitted / rejected / awaiting-precondition / unavailable。 |
| `decision_reason` | `AdmissionDecisionReason` | 合同内判断原因摘要。 |
| `basis_refs` | `AdmissionBasisRefSet` | 回链 definition / Binding assessment 等正式依据。 |
| `decided_at` | `DecisionTime` | 真实执行前判断时点。 |

### 3.3 状态集合

| 状态 | 作用 |
|---|---|
| `admitted` | 合同与适用 relation 允许调用进入执行前置判断。 |
| `rejected` | 调用不满足合同 / relation 条件，形成 no-execution 输入。 |
| `awaiting_precondition` | 调用已受理，但必须继续消费 authorization / Sandbox 等适用前置。 |
| `unavailable` | 当前合同或所需正式来源不可用于受理。 |

### 3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `permits_precondition_evaluation()` | 判断是否可进入部分 4 的前置判断。 |
| `requires_no_execution_outcome()` | 判断是否应由部分 5 形成消费者可见 no-execution 终态。 |
| `is_decided_before(ExecutionStartRef execution_start_ref)` | 验证 admission 发生在真实执行前。 |

### 3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `admit(ToolInvocation invocation, AdmissionBasisRefSet basis_refs)` | 形成受理事实。 |
| `reject(ToolInvocation invocation, AdmissionDecisionReason reason)` | 形成执行前拒绝事实。 |
| `await_precondition(ToolInvocation invocation, PreconditionClassSet required_classes)` | 形成等待适用前置事实。 |

### 3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 生成 Sandbox run / capture / failure 或任何已执行事实 | Admission 只在真实执行前成立。 |
| 直接充当消费者可见 outcome | No-execution outcome 由部分 5 形成并回链 admission。 |
| 裁决 authorization decision 实质 | 本对象只决定是否进入正式前置消费。 |

## 4. `InvocationContractAnchor`

### 4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 规范调用与受理 |
| 对象类型 | value object |
| 主要责任 | 固定 invocation 消费的稳定 Tool identity、definition revision 和适用 Binding assessment 时点。 |

### 4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `tool_id` | `ToolId` | 被调用稳定工具。 |
| `definition_revision` | `DefinitionRevision` | 本次调用消费的正式 definition revision。 |
| `binding_mode` | `CapabilityBindingMode` | 本次调用适用的 bound / explicit-unbound 分类。 |
| `binding_assessment_ref` | `BindingAssessmentRef` | Bound 场景下回链消费时点评估。 |
| `anchored_at` | `ConsumptionTime` | 固定合同语境的时间锚点。 |

### 4.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `matches_contract(ToolContract contract)` | 判断 anchor 与稳定合同一致。 |
| `matches_definition(FormalToolDefinition definition)` | 判断 definition identity / revision 一致。 |
| `requires_binding_assessment()` | 判断 bound 场景是否具备必需 assessment ref。 |

### 4.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `anchor(ToolContract contract, FormalToolDefinition definition, CapabilityBindingView binding_view, ConsumptionTime consumed_at)` | 在 invocation 建立时固定可解释合同语境。 |

### 4.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 随 current definition 或 Hub 来源变化原地更新 | 历史 invocation 必须保持原消费时点解释。 |
| 保存 definition / Hub source 正文 | Anchor 只保存 identity、revision 与 assessment ref。 |
| 以 caller 或 carrier schema 作为合同锚点 | 正式语义只由 L2 contract / definition 决定。 |

## 5. `ToolInvocationView`

### 5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 规范调用与受理 |
| 对象类型 | read model |
| 主要责任 | 提供 invocation、合同锚定、admission 与可选终态引用的正文安全稳定读取。 |

### 5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `invocation_id` | `ToolInvocationId` | 被读取 invocation。 |
| `contract_anchor_summary` | `InvocationContractAnchorSummary` | Tool / revision / Binding 的安全摘要。 |
| `canonical_intent_summary` | `CanonicalIntentSafeSummary` | 合同内调用意图摘要，不含 raw body。 |
| `admission_summary` | `InvocationAdmissionSummary` | 执行前判断及原因摘要。 |
| `outcome_ref` | `ToolInvocationOutcomeRef` | 已形成时指向消费者可见终态。 |
| `context_ref_summary` | `InvocationContextRefSummary` | 允许的 caller / actor / work / trace / correlation refs 摘要。 |

### 5.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_admitted()` | 判断 admission 是否允许进入后续前置。 |
| `has_terminal_outcome()` | 判断是否已关联 L2 工具语义终态。 |
| `is_body_free()` | 验证 view 未包含禁止正文。 |

### 5.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `project(ToolInvocation invocation, InvocationAdmission admission, ToolInvocationOutcomeRef outcome_ref)` | 从已成立 truth 形成稳定 read model。 |

### 5.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 拉取 Runtime / caller 正文补齐展示 | View 只使用允许的本地 truth 与 refs。 |
| 读取时更新 admission、handoff 或 outcome | Query 不取得写权。 |
| 把外部 accepted / run / delivery / observed 写成 invocation 状态 | 外部状态保留在各自 owner / snapshot。 |

## 6. `InvocationContextRefs`

### 6.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 规范调用与受理 |
| 对象类型 | context / reference object |
| 主要责任 | 聚合解释 invocation 所需的 caller、actor、work、trace 与 correlation typed refs 及安全摘要。 |

### 6.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `caller_ref` | `CallerRef` | 指向正式调用方 identity / boundary。 |
| `actor_ref` | `ActorRef` | 指向行为者语境，不复制身份正文。 |
| `work_ref` | `WorkRef` | 指向外部工作对象，不拥有其生命周期。 |
| `trace_ref` | `TraceRef` | 指向关联追踪语境，不替代 Observability store。 |
| `correlation_ref` | `CorrelationRef` | 关联 caller、invocation、handoff 与 outcome。 |
| `caller_safe_summary` | `CallerContextSafeSummary` | 仅保存解释本次调用所需摘要。 |

### 6.3 状态集合

| 状态 | 作用 |
|---|---|
| `sufficient` | 必需引用在本次消费时点可验证。 |
| `degraded` | 非关键引用存在 gap，但仍能解释当前允许路径。 |
| `insufficient` | 必需 caller / correlation 语境缺失，不能形成可解释 invocation。 |

### 6.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `has_required_refs(RequiredContextClassSet required_classes)` | 判断指定调用是否具备必需 refs。 |
| `matches_correlation(CorrelationRef correlation_ref)` | 判断关联引用是否一致。 |
| `contains_forbidden_body()` | 检测 context 是否误含禁止正文。 |

### 6.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_formal_context(FormalCallerContext context, ConsumptionTime consumed_at)` | 从正式 caller boundary 提取 typed refs 与 safe summary。 |

### 6.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 prompt、conversation、plan、loop、checkpoint、recovery 或 raw request | 这些正文属于 Runtime / caller 边界。 |
| 将所有引用统一宣称由 Runtime 拥有 | Actor、work、trace 等继续服从各自 owner。 |
| 以缺失引用补造匿名 identity 或本地正文 | 引用不足必须显式 degraded / insufficient。 |

## 7. 本组成部分停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 候选处理完整 | pass | 5 个候选全部独立成节。 |
| Capability 来源 | pass | 规范化、锚定、受理、无执行前置与稳定读取均有对象承接。 |
| Invocation / DTO 分工 | pass | `ToolInvocation` 是 domain truth，不是 transport request body。 |
| Admission / outcome 分工 | pass | Admission 是执行前判断；消费者终态留给 `ToolInvocationOutcome`。 |
| Context boundary | pass | 只保存 typed refs / safe summary，不吸收 Runtime 正文。 |
| 字段 / 函数粒度 | pass | 参数带类型，未写协议、幂等算法或实现。 |

```text
component_status = completed
gate_status = pass
next_allowed_action = complete_precondition_handoff_object_appendix
```
