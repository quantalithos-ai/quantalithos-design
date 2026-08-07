# L2-tools 02 概要 Step 6 对象附录: Capability Binding 与受控来源

> 创建日期: 2026-08-05
> 状态: completed
> 主控文件: `design-calibration/02_hld_step_06_key_objects.md`
> 组成部分来源: Step 5 §5 Capability Binding 与受控来源

---

## 1. 对象正式化范围

本附录正式化 6 个对象：`CapabilityBinding`、`CapabilityBindingAssessment`、`HubControlledSnapshot`、`CapabilityBindingView`、`HubCapabilityRef`、`CapabilityBindingChangeFact`。Hub registry / descriptor / exposure body、provider route 与本地 allowlist 均不进入对象字段。

## 2. `CapabilityBinding`

### 2.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | Capability Binding 与受控来源 |
| 对象类型 | domain relation aggregate |
| 主要责任 | 维护稳定 Tool identity 与 Hub capability 的 body-free relation，或显式声明 unbound。 |

### 2.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `binding_id` | `CapabilityBindingId` | L2 自有 relation 标识。 |
| `tool_id` | `ToolId` | 关系所属稳定工具。 |
| `binding_mode` | `CapabilityBindingMode` | 明确 bound 或 explicit-unbound，不以空值推断。 |
| `hub_capability_ref` | `HubCapabilityRef` | Bound 模式下关联 Hub 正式 capability ref。 |
| `relation_state` | `CapabilityBindingRelationState` | 表达 relation 是否仍为当前正式关系。 |
| `established_at` | `DecisionTime` | 关系正式成立时点。 |

### 2.3 状态集合

| 状态 | 作用 |
|---|---|
| `bound_active` | 已显式绑定 Hub capability，仍需 assessment 判断当前可消费性。 |
| `explicit_unbound` | 正式声明该工具不依赖 Hub capability relation。 |
| `replacement_pending` | 已提出替换，但旧 relation 在正式切换前仍保持可解释。 |
| `invalidated` | Relation 已正式失效，不再支持新的受影响调用。 |

### 2.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `replace_ref(HubCapabilityRef capability_ref, BindingChangeReason reason)` | 显式替换 bound relation 的外部引用。 |
| `invalidate(BindingInvalidationReason reason)` | 正式使关系失效并保留原因。 |
| `is_explicit_unbound()` | 判断 unbound 是否由正式分类成立。 |
| `requires_source_assessment()` | 判断当前 relation 是否需要 Hub source assessment。 |

### 2.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `establish_bound(ToolId tool_id, HubCapabilityRef capability_ref)` | 建立 body-free bound relation。 |
| `declare_unbound(ToolId tool_id, BindingClassificationReason reason)` | 显式建立 unbound 分类。 |

### 2.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用缺失 `hub_capability_ref` 推断 unbound | 空值表示信息不足，不是正式分类。 |
| 保存 Hub registry、descriptor、exposure、applicability 或 provider 正文 | Relation 不迁移 Hub truth。 |
| 将 Binding 解释为 allowlist 或 authorization | Capability relation 不产生调用许可。 |

## 3. `CapabilityBindingAssessment`

### 3.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | Capability Binding 与受控来源 |
| 对象类型 | assessment fact |
| 主要责任 | 在特定消费时点评估 Binding relation 与 Hub controlled source 是否足以支持当前消费。 |

### 3.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `assessment_id` | `CapabilityBindingAssessmentId` | 本次评估事实标识。 |
| `binding_id` | `CapabilityBindingId` | 被评估 relation。 |
| `snapshot_ref` | `HubControlledSnapshotRef` | 本次消费的 Hub 安全快照引用。 |
| `assessment_state` | `BindingAssessmentState` | 当前 valid / stale / conflict / missing / unverifiable 状态。 |
| `gap_refs` | `ConsistencyGapRefSet` | 关联缺失或冲突解释。 |
| `assessed_at` | `AssessmentTime` | 固定评估时点。 |

### 3.3 状态集合

| 状态 | 作用 |
|---|---|
| `valid` | Relation 与正式来源在该消费时点可验证。 |
| `stale` | 来源摘要可能过期，受影响消费不得假设仍有效。 |
| `conflicting` | Relation、owner 或 source revision 存在冲突。 |
| `missing` | Bound relation 缺少所需正式 source / snapshot。 |
| `unverifiable` | 当前 authority 或来源不足以作正向判断。 |

### 3.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `permits_bound_consumption()` | 仅在 assessment 为 valid 时允许 bound 路径继续。 |
| `requires_fail_closed()` | 判断是否必须保守阻断受影响消费。 |
| `explains_gap(ConsistencyGapRef gap_ref)` | 判断指定 gap 是否属于本次评估。 |

### 3.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `assess(CapabilityBinding binding, HubControlledSnapshot snapshot, AssessmentTime assessed_at)` | 基于 relation 与消费时点安全快照形成评估事实。 |
| `mark_unverifiable(CapabilityBindingId binding_id, SourceGapReason reason)` | 在正式来源不足时形成不可验证事实。 |

### 3.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 用 last-known-good 或本地 registry 将非 valid 评估改为 valid | 受影响路径必须 fail closed。 |
| 把 Hub visibility / applicability 解释为 authorization | Assessment 只回答 relation/source 可消费性。 |
| 原地覆盖旧评估 | 新消费时点必须形成新 assessment。 |

## 4. `HubControlledSnapshot`

### 4.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | Capability Binding 与受控来源 |
| 对象类型 | external-owner safe snapshot |
| 主要责任 | 保存某一消费时点允许进入 L2 的 Hub owner attribution、revision ref 与 body-free summary。 |

### 4.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `snapshot_id` | `HubControlledSnapshotId` | 本地快照标识。 |
| `capability_ref` | `HubCapabilityRef` | 指向 Hub 正式 capability。 |
| `hub_revision_ref` | `HubRevisionRef` | 锚定被消费的 Hub revision。 |
| `owner_attribution` | `ExternalOwnerAttribution` | 明确该语义仍由 Hub 拥有。 |
| `controlled_summary` | `HubCapabilitySafeSummary` | 仅包含本次 relation 判断所需摘要。 |
| `consumed_at` | `ConsumptionTime` | 固定快照消费时点。 |

### 4.3 状态集合

| 状态 | 作用 |
|---|---|
| `current_at_consumption` | 在记录的消费时点来源可验证。 |
| `stale_detected` | 后续检测发现可能陈旧，但不改写既有消费事实。 |
| `conflict_detected` | 后续检测发现 owner / revision 冲突。 |
| `source_unavailable` | 当前无法从正式 Hub seam 获取可验证摘要。 |

### 4.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_owned_by(HubAuthorityRef authority_ref)` | 判断快照 owner attribution 是否匹配正式 Hub authority。 |
| `mark_stale(HubSourceChangeRef change_ref)` | 记录新变化线索，不修改旧消费内容。 |
| `supports_binding(CapabilityBinding binding)` | 判断快照是否与指定 relation 一致。 |

### 4.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `capture(HubCapabilityRef capability_ref, HubRevisionRef revision_ref, HubCapabilitySafeSummary summary, ConsumptionTime consumed_at)` | 从受控 Hub seam 形成 body-free 消费快照。 |

### 4.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 registry / descriptor / exposure / provider 正文 | Snapshot 只保留允许摘要。 |
| 将 snapshot 视为 Hub truth 的本地副本 | Owner 与 lifecycle 始终在 Hub。 |
| 后到变化穿越改写旧 snapshot | 新变化形成新 snapshot / assessment / gap。 |

## 5. `CapabilityBindingView`

### 5.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | Capability Binding 与受控来源 |
| 对象类型 | read model |
| 主要责任 | 稳定读取 L2 relation、最新可引用 assessment 与允许的 Hub source 摘要。 |

### 5.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `binding_id` | `CapabilityBindingId` | 被读取 relation。 |
| `tool_id` | `ToolId` | 关联稳定工具。 |
| `binding_mode` | `CapabilityBindingMode` | 显式 bound / unbound 分类。 |
| `relation_state` | `CapabilityBindingRelationState` | 当前正式 relation 状态。 |
| `assessment_summary` | `BindingAssessmentSafeSummary` | 最近指定消费语境的 assessment 摘要。 |
| `hub_capability_ref` | `HubCapabilityRef` | Bound 场景的外部引用。 |

### 5.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `is_explicit_unbound()` | 判断 view 是否表达正式 unbound。 |
| `is_currently_consumable()` | 判断当前读取语境是否有 valid assessment。 |
| `has_source_gap()` | 判断 relation 是否存在显式 source gap。 |

### 5.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `project(CapabilityBinding binding, CapabilityBindingAssessment assessment)` | 从 relation truth 与指定 assessment 形成安全 view。 |

### 5.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 读取时自动修复 relation 或刷新 Hub truth | Query 不取得写权。 |
| 暴露 Hub controlled body | View 只返回 ref 与安全摘要。 |
| 把可消费 relation 表述为调用已获授权 | Authorization 由部分 4 单独消费。 |

## 6. `HubCapabilityRef`

### 6.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | Capability Binding 与受控来源 |
| 对象类型 | reference object |
| 主要责任 | 以 typed ref 指向 Hub 拥有的 capability identity / revision，不迁移其正文和生命周期。 |

### 6.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `capability_ref_id` | `HubCapabilityRefId` | 本地 typed ref 标识。 |
| `hub_authority_ref` | `HubAuthorityRef` | 指向正式 Hub authority。 |
| `capability_identity_ref` | `ExternalCapabilityIdentityRef` | 指向 Hub capability identity。 |
| `revision_ref` | `HubRevisionRef` | 可选锚定消费 revision。 |
| `resolution_state` | `ExternalReferenceState` | 当前 resolved / stale / conflict / unverifiable。 |

### 6.3 状态集合

| 状态 | 作用 |
|---|---|
| `resolved` | Authority、identity 与 revision 当前可验证。 |
| `stale` | 引用可能指向非当前 revision。 |
| `conflicting` | 多来源 owner / identity / revision 不一致。 |
| `unverifiable` | 无法证明引用来自正式 Hub authority。 |

### 6.4 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `matches_identity(ExternalCapabilityIdentityRef identity_ref)` | 判断 ref 是否指向预期 capability。 |
| `matches_revision(HubRevisionRef revision_ref)` | 判断 revision 锚点是否一致。 |
| `mark_unverifiable(SourceGapReason reason)` | 记录引用无法验证。 |

### 6.5 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `from_hub(HubAuthorityRef authority_ref, ExternalCapabilityIdentityRef identity_ref, HubRevisionRef revision_ref)` | 从正式 Hub authority 建立 typed ref。 |

### 6.6 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 保存 capability descriptor、exposure、visibility 或 provider body | Ref 不承载 Hub 业务正文。 |
| 用字符串名称匹配替代 typed identity | 名称不能提供稳定 owner / revision 解释。 |
| 把 unresolved ref 回退到本地 inventory | 不得形成第二 registry truth。 |

## 7. `CapabilityBindingChangeFact`

### 7.1 基本信息

| 项 | 内容 |
|---|---|
| 所属部分 | Capability Binding 与受控来源 |
| 对象类型 | history record |
| 主要责任 | Append-only 记录 Binding 分类、建立、替换与失效的正式变化及原因。 |

### 7.2 关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|
| `change_fact_id` | `CapabilityBindingChangeFactId` | 变化事实标识。 |
| `binding_id` | `CapabilityBindingId` | 被变更 relation。 |
| `change_kind` | `CapabilityBindingChangeKind` | 分类、建立、替换、失效等变化类型。 |
| `previous_ref` | `HubCapabilityRefSummary` | 变化前外部引用摘要。 |
| `current_ref` | `HubCapabilityRefSummary` | 变化后外部引用摘要。 |
| `change_reason` | `BindingChangeReason` | 正式变化原因。 |
| `actor_context` | `ActorContext` | 发起变化的安全行为者语境。 |

### 7.3 成员函数骨架

| 成员函数 | 作用 |
|---|---|
| `explains_relation(CapabilityBindingId binding_id)` | 判断事实是否解释指定 relation 变化。 |
| `changes_binding_mode()` | 判断变化是否改变 bound / explicit-unbound 分类。 |
| `is_replayable_for_view()` | 判断是否可供只读 view 重建。 |

### 7.4 工厂函数骨架

| 工厂函数 | 作用 |
|---|---|
| `record_change(ActorContext actor, CapabilityBinding binding, CapabilityBindingChangeKind change_kind, BindingChangeReason reason)` | 记录已由正式边界收口的 relation 变化。 |

### 7.5 禁止事项

| 禁止事项 | 说明 |
|---|---|
| 由 reconciliation 自动创建或替换 Binding | 对账只能报告，正式变化重入 Command。 |
| 保存 Hub source body | History 只保存 ref / summary 与本地原因。 |
| 覆盖旧变化事实 | Relation history 必须 append-only。 |

## 8. 本组成部分停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| 候选处理完整 | pass | 6 个候选全部独立成节。 |
| Capability 来源 | pass | 分类、建替、评估、失效、读取、变化检测均有对象承接。 |
| Relation / assessment 分工 | pass | Relation 是 L2 truth；assessment 是消费时点判断。 |
| Ref / snapshot 分工 | pass | Ref 定位外部对象；snapshot 保存允许摘要与时点。 |
| Explicit-unbound | pass | 由正式 mode 表达，不由空 ref 推断。 |
| 边界诚实 | pass | 不拥有 Hub truth、allowlist 或 authorization；无新增 blocker。 |

```text
component_status = completed
gate_status = pass
next_allowed_action = complete_invocation_admission_object_appendix
```
