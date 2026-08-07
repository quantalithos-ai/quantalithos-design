# L2-tools 02 概要 Step 6 对象附录: 工具合同与演进

> 创建日期: 2026-08-05
> 状态: completed
> 主控文件: `design-calibration/02_hld_step_06_key_objects.md`
> 组成部分来源: Step 5 §4 工具合同与演进

---

## 1. 对象正式化范围

本附录正式化 6 个对象：`ToolContract`、`FormalToolDefinition`、`ToolCompatibilityImpact`、`ToolContractView`、`DefinitionSourceRef`、`ToolContractEvolutionFact`。ID、revision、lifecycle reason、actor context 等只作为字段类型，不独立升级为对象。

## 2. `ToolContract`

### 2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 工具合同与演进 |
| 对象类型 | domain aggregate |
| 主要责任 | 作为 L2 自有稳定 Tool identity 与 current definition 的唯一合同锚点。 |

### 2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `tool_id` | `ToolId` | 跨 revision 稳定的工具身份。 |
| `current_definition_revision` | `DefinitionRevision` | 指向当前生效的正式 definition revision。 |
| `lifecycle_state` | `ToolContractLifecycleState` | 表达合同当前是否允许正式消费。 |
| `binding_mode` | `CapabilityBindingMode` | 声明 bound 或 explicit-unbound 分类，不保存 Hub capability 正文。 |
| `established_at` | `DecisionTime` | 合同正式成立时间锚点。 |

### 2.3 状态集合

| 状态 | 作用 |
|---|---|
| `active` | 合同与 current definition 正式成立，可进入受控消费判断。 |
| `retirement_pending` | 退役意图已正式提出，但影响收口尚未完成。 |
| `retired` | 合同已正式退役，不接受新的 invocation；历史仍可读取。 |

### 2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `adopt_revision(FormalToolDefinition definition, ToolCompatibilityImpact impact)` | 在兼容影响已被正式承接后切换 current revision。 |
| `request_retirement(ContractRetirementReason reason)` | 显式进入退役待收口状态。 |
| `complete_retirement(ActorContext actor)` | 在正式前置满足后完成退役。 |
| `accepts_new_invocation()` | 判断当前 lifecycle 是否允许新调用进入。 |

### 2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `establish(ToolId tool_id, FormalToolDefinition definition, CapabilityBindingMode binding_mode)` | 原子建立稳定 identity 与首个 current definition。 |

### 2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用 capability ID、显示名、实现名或 inventory item 代替 `tool_id` | 这些主语均不拥有 Tool identity。 |
| 保存 implementation / provider / SDK / registry 正文 | 合同只拥有工具行动语义，不拥有实现与外部目录。 |
| 由 search、diff、reconciliation 或外部变化直接改 current revision | 正式变化必须经合同 Command 与演进事实收口。 |

## 3. `FormalToolDefinition`

### 3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 工具合同与演进 |
| 对象类型 | versioned domain entity |
| 主要责任 | 表达某一正式 revision 的 invocation、result / error 与 execution-requirement 工具语义。 |

### 3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `definition_id` | `FormalToolDefinitionId` | 正式 definition revision 的对象标识。 |
| `tool_id` | `ToolId` | 关联稳定工具合同。 |
| `revision` | `DefinitionRevision` | 标识不可变语义 revision。 |
| `invocation_semantics` | `InvocationSemanticsSummary` | 描述合同允许的调用语义，不是 transport schema。 |
| `outcome_semantics` | `OutcomeSemanticsSummary` | 描述 normalized result / error 语义边界。 |
| `execution_requirement_basis` | `ExecutionRequirementBasis` | 提供风险 / 治理 / 隔离要求的工具域依据，不产生 authorization decision。 |
| `source_ref` | `DefinitionSourceRef` | 回链正式来源，不保存来源正文。 |

### 3.3 状态集合

| 状态 | 作用 |
|---|---|
| `current` | 当前由 `ToolContract` 指向并用于新 invocation。 |
| `superseded` | 已由新 revision 替代，只用于历史解释。 |
| `withdrawn` | 该 revision 被正式撤回，不再允许新消费。 |

### 3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `supports_invocation(ContractInvocationIntent intent)` | 判断调用意图是否处于该 revision 的合同语义内。 |
| `requires_governed_execution()` | 返回该 revision 是否声明需消费正式 authorization 结果。 |
| `requires_sandbox_execution()` | 返回该 revision 是否声明隔离承载要求。 |
| `mark_superseded(DefinitionRevision replacement_revision)` | 将 revision 标记为已替代并保留替代锚点。 |

### 3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `formalize(ToolId tool_id, DefinitionRevision revision, FormalDefinitionIntent intent, DefinitionSourceRef source_ref)` | 从正式维护意图形成不可变 definition revision。 |

### 3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 包含完整 HTTP / RPC / MCP / A2A / SDK schema | 协议与适配细节留给后续边界合同。 |
| 包含 provider route、quota、cost、secret 或 implementation body | 这些事实属于外部 owner 或实现层。 |
| 修改既有 revision 的语义正文 | 语义变化必须产生新 revision 与 evolution fact。 |

## 4. `ToolCompatibilityImpact`

### 4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 工具合同与演进 |
| 对象类型 | assessment value object |
| 主要责任 | 记录 candidate definition 相对 current revision 的兼容影响及不可解释缺口。 |

### 4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `tool_id` | `ToolId` | 被评估工具。 |
| `base_revision` | `DefinitionRevision` | 当前比较基线。 |
| `candidate_revision` | `DefinitionRevision` | 候选 revision。 |
| `impact_class` | `CompatibilityImpactClass` | 表达兼容、条件兼容、不兼容或不可验证。 |
| `affected_consumption_refs` | `AffectedConsumptionRefSet` | 关联受影响消费线索，不保存消费正文。 |
| `assessed_at` | `AssessmentTime` | 固定评估时点。 |

### 4.3 状态集合

| 状态 | 作用 |
|---|---|
| `compatible` | 当前证据支持在既有消费边界内演进。 |
| `conditionally_compatible` | 需要显式迁移 / 重评或受限消费后才可承接。 |
| `incompatible` | 新 revision 会破坏既有正式消费语义。 |
| `unverifiable` | 来源、引用或消费影响不足，不能作兼容声明。 |

### 4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `requires_explicit_migration()` | 判断是否必须在采用 revision 前形成迁移 / 重评安排。 |
| `blocks_revision_adoption()` | 判断影响结论是否阻止 current revision 切换。 |
| `covers_consumption_ref(ConsumerReference ref)` | 判断某个消费引用是否已进入影响范围。 |

### 4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `assess(FormalToolDefinition current, FormalToolDefinition candidate, ConsumerReferenceSummary consumers)` | 形成概要兼容影响判断，不自动采用 candidate。 |

### 4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 把文本 diff 结果直接等同兼容结论 | Diff 只是输入，不能自动批准演进。 |
| 缺少来源时默认为兼容 | 不可验证必须显式表达。 |
| 写入迁移脚本或下游实现计划 | 具体迁移留给 03 / 07。 |

## 5. `ToolContractView`

### 5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 工具合同与演进 |
| 对象类型 | read model |
| 主要责任 | 向正式消费者提供稳定、正文安全的合同与 current definition 摘要。 |

### 5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `tool_id` | `ToolId` | 读取目标的稳定 identity。 |
| `current_revision` | `DefinitionRevision` | 当前正式 revision。 |
| `lifecycle_summary` | `ToolContractLifecycleSummary` | 合同当前可消费状态摘要。 |
| `definition_summary` | `FormalDefinitionSafeSummary` | 调用 / outcome / requirement 的允许摘要。 |
| `evolution_head_ref` | `EvolutionFactRef` | 指向最近正式演进事实。 |

### 5.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_consumable()` | 判断 view 是否表示可进入进一步受理判断的合同。 |
| `matches_revision(DefinitionRevision revision)` | 判断消费者期望 revision 与 current revision 是否一致。 |

### 5.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `project(ToolContract contract, FormalToolDefinition definition, EvolutionFactRef evolution_ref)` | 从已成立 truth 形成受控读取视图。 |

### 5.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 通过读取触发修订、来源刷新或外部写入 | Query 不取得写权。 |
| 暴露 definition source body、provider body 或 secret | View 只允许安全摘要与 ref。 |
| 作为搜索索引的唯一 truth | Search projection 可重建且独立于稳定合同读取。 |

## 6. `DefinitionSourceRef`

### 6.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 工具合同与演进 |
| 对象类型 | reference object |
| 主要责任 | 回链 formal definition 的正式来源、owner attribution 与评审语境，不复制来源正文。 |

### 6.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `source_ref_id` | `DefinitionSourceRefId` | 本地引用标识。 |
| `authority_ref` | `ContractAuthorityRef` | 指向正式 definition authority；未闭口时显式 gap。 |
| `source_locator` | `ExternalLocatorSummary` | 正文安全的外部定位摘要。 |
| `source_revision` | `ExternalRevisionRef` | 锚定消费的来源 revision。 |
| `consumed_at` | `ConsumptionTime` | 固定 definition 形成时的来源消费时点。 |

### 6.3 状态集合

| 状态 | 作用 |
|---|---|
| `resolved` | Authority 与来源 revision 当前可验证。 |
| `stale` | 来源可能已变化，但不穿越改写既有 definition。 |
| `conflicting` | Authority 或 revision 线索冲突。 |
| `unverifiable` | 缺正式 authority / 来源，不能支撑新 definition。 |

### 6.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `matches_authority(ContractAuthorityRef authority_ref)` | 判断引用是否归属于期望 authority。 |
| `mark_stale(SourceChangeRef change_ref)` | 记录新变化线索而不改写历史消费时点。 |
| `supports_formalization()` | 判断该 ref 是否足以支撑新的 formal definition。 |

### 6.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_authority(ContractAuthorityRef authority_ref, ExternalRevisionRef revision, ConsumptionTime consumed_at)` | 从正式 authority 与 revision 建立 typed ref。 |

### 6.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存来源文档、provider schema 或实现正文 | Ref 只提供可追溯定位。 |
| 在 `L2T-UP-008` 未闭口时伪造 Core Tools-specific authority | Compile baseline 不等于具体 contract 已存在。 |
| 通过刷新原地改写既有消费时点 | 后到变化形成新 ref / assessment / gap。 |

## 7. `ToolContractEvolutionFact`

### 7.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | 工具合同与演进 |
| 对象类型 | history record |
| 主要责任 | Append-only 记录合同建立、revision 采用、更正与退役的正式变化及解释锚点。 |

### 7.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `evolution_fact_id` | `ToolContractEvolutionFactId` | 演进事实标识。 |
| `tool_id` | `ToolId` | 被演进合同。 |
| `change_kind` | `ToolContractChangeKind` | 建立、revision-adopted、更正、retirement-requested、retired 等类型。 |
| `from_revision` | `DefinitionRevisionRef` | 变化前 revision 引用；首建时可为空语义。 |
| `to_revision` | `DefinitionRevisionRef` | 变化后 revision 引用；退役时用于保留最后语境。 |
| `impact_ref` | `CompatibilityImpactRef` | 关联兼容影响判断。 |
| `actor_context` | `ActorContext` | 发起正式变化的安全行为者语境。 |

### 7.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `explains_revision(DefinitionRevision revision)` | 判断该事实是否解释指定 revision 的正式地位。 |
| `is_terminal_change()` | 判断事实是否表示合同完成退役。 |
| `is_replayable_for_view()` | 判断是否可作为只读 view 重建输入。 |

### 7.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record_change(ActorContext actor, ToolContract contract, ToolContractChangeKind change_kind, CompatibilityImpactRef impact_ref)` | 记录已正式收口的合同变化。 |

### 7.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 由 history replay 自动改写 current definition | Current truth 仍由 `ToolContract` 正式边界收口。 |
| 写成 outbound event payload / outbox schema | 事件协作接口留 Step 7 / 03。 |
| 覆盖或删除旧事实 | 历史必须 append-only 且可解释。 |

## 8. 本组成部分停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 候选处理完整 | pass | Step 5 的 6 个候选全部独立成节。 |
| Capability 来源 | pass | 建立、修订、影响、退役、读取均有对象承接。 |
| Identity / definition 分工 | pass | Stable identity 在 contract，revision semantics 在 definition。 |
| Current / history 分工 | pass | Current pointer 在 contract，append-only explanation 在 evolution fact。 |
| 字段 / 函数粒度 | pass | 类型与参数齐备，未写完整 schema、签名或实现。 |
| 边界诚实 | pass | 不拥有 implementation、Hub、provider、SDK 正文；Core authority 缺口未伪造。 |

```text
component_status = completed
gate_status = pass
next_allowed_action = complete_binding_source_object_appendix
```
