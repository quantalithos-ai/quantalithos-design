# Step 6 附录 B3. Reference / Audit 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> Reference 只保存稳定引用或摘要;history / audit / handoff record 不替代当前 truth。

---

## B20. `ArtifactContentSourceRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact fact management` |
| 对象类型 | reference object |
| 结构责任 | 指向正式 Artifact 内容来源,表达正文位置、来源类型和可验证摘要 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `source_kind` | `ArtifactContentSourceKind` | 来源类别 |
| `external_ref` | `ExternalSourceRef` | 外部稳定引用 |
| `source_version_ref` | `Option<ExternalSourceVersionRef>` | 来源版本引用 |
| `source_digest` | `Option<SourceDigest>` | 来源摘要 / 完整性线索 |

| 成员函数 | 作用 |
|---|---|
| `same_source(ArtifactContentSourceRef other)` | 判断是否指向同一来源 |
| `is_body_location()` | 判断是否为正文位置引用 |

| 工厂函数 | 作用 |
|---|---|
| `from_external(ArtifactContentSourceKind source_kind, ExternalSourceRef external_ref)` | 从外部来源建立内容引用 |

| 禁止事项 | 说明 |
|---|---|
| 不保存正文副本 | 只保存 ref、version 和 digest |
| 不拥有来源生命周期 | 生命周期仍归外部来源 |

---

## B21. `ArtifactDefinitionRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `External reference and local mirror support` |
| 对象类型 | reference object |
| 结构责任 | 回指 method-library 中的 artifact kind、definition 或 work product 定义来源 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `definition_kind` | `ArtifactDefinitionKind` | 定义类别 |
| `external_ref` | `ExternalSourceRef` | 外部定义引用 |
| `definition_version_ref` | `Option<ExternalSourceVersionRef>` | 定义版本 |
| `summary_ref` | `Option<SafeSummaryRef>` | 安全摘要引用 |

| 成员函数 | 作用 |
|---|---|
| `same_definition(ArtifactDefinitionRef other)` | 判断是否为同一定义 |
| `matches_kind(ArtifactDefinitionKind definition_kind)` | 判断定义类别是否匹配 |

| 工厂函数 | 作用 |
|---|---|
| `from_external(ArtifactDefinitionKind definition_kind, ExternalSourceRef external_ref)` | 从 method-library 引用建立定义来源对象 |

| 禁止事项 | 说明 |
|---|---|
| 不保存定义正文 | 只能保存 ref、version 和 summary |
| 不替代 Artifact truth | definition 只解释“是什么”,不解释“当前事实” |

---

## B22. `ArtifactWorkContextRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `External reference and local mirror support` |
| 对象类型 | reference object |
| 结构责任 | 回指 work 侧项目 / 工作项 / 交付语境 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `work_context_kind` | `ArtifactWorkContextKind` | work 语境类别 |
| `external_ref` | `ExternalSourceRef` | 工作语境引用 |
| `summary_ref` | `Option<SafeSummaryRef>` | 本地安全摘要 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有 work truth | 只保存引用和摘要 |
| 不保存 work 正文 | 不保存 backlog / iteration / blocker 正文 |

---

## B23. `ArtifactProcessContextRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `External reference and local mirror support` |
| 对象类型 | reference object |
| 结构责任 | 回指 process / activity / checkpoint 等过程语境 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `process_context_kind` | `ArtifactProcessContextKind` | 过程语境类别 |
| `external_ref` | `ExternalSourceRef` | 过程语境引用 |
| `summary_ref` | `Option<SafeSummaryRef>` | 安全摘要 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有 process execution truth | 只服务输入和追溯解释 |
| 不保存 process 正文 | 仅保留 ref / summary |

---

## B24. `ArtifactGovernanceContextRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `External reference and local mirror support` |
| 对象类型 | reference object |
| 结构责任 | 回指治理审查、证据或结论语境 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `governance_context_kind` | `ArtifactGovernanceContextKind` | 治理语境类别 |
| `external_ref` | `ExternalSourceRef` | 治理语境引用 |
| `summary_ref` | `Option<SafeSummaryRef>` | 治理侧安全摘要 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有 governance truth | decision / AIIA / SoA 仍归治理仓 |
| 不保存治理正文 | 只保存引用和摘要 |

---

## B25. `AutomationSourceRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `Automation output control boundary` |
| 对象类型 | reference object |
| 结构责任 | 指向 runtime / capability / tool 侧自动化来源 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `automation_kind` | `AutomationSourceKind` | 自动化来源类别 |
| `external_ref` | `ExternalSourceRef` | 外部来源引用 |
| `execution_ref` | `Option<ExternalExecutionRef>` | 关联执行或调用引用 |
| `source_digest` | `Option<SourceDigest>` | 来源摘要 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有 runtime truth | 只用来解释来源和重放边界 |
| 不把 tool output 当正文 | 只保存 ref 和 digest |

---

## B26. `AdjacentConsumerRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact consumption and traceability` |
| 对象类型 | reference object |
| 结构责任 | 指向消费 Artifact truth 的邻接仓、入口或交接目标 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `consumer_kind` | `AdjacentConsumerKind` | 消费方类别 |
| `external_ref` | `ExternalSourceRef` | 消费方稳定引用 |
| `consumption_scope_ref` | `ArtifactConsumerScopeRef` | 当前消费范围 |
| `channel_ref` | `Option<ArtifactHandoffChannelRef>` | 对应交接或输出通道 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有消费方私有状态 | 只表达 Artifact 侧视角的消费目标 |
| 不替代 backref / trace | 消费发生仍需专门记录 |

---

## B27. `ArtifactFactChangeRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact fact management` |
| 对象类型 | history record |
| 结构责任 | 记录 ArtifactFact 建立、挂起和关闭变化 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `ArtifactFactChangeRecordId` | 变化记录身份 |
| `artifact_fact_ref` | `ArtifactFactRef` | 对应事实主语 |
| `change_kind` | `ArtifactFactChangeKind` | 变化类别 |
| `actor_ref` | `ActorRef` | 触发变化的 actor |
| `basis_ref` | `ArtifactChangeBasisRef` | 变化依据 |

| 工厂函数 | 作用 |
|---|---|
| `record_change(ArtifactFactRef artifact_fact_ref, ArtifactFactChangeKind change_kind, ActorRef actor_ref)` | 为事实变化建立历史记录 |

| 禁止事项 | 说明 |
|---|---|
| 不替代当前事实状态 | 当前状态仍以 `ArtifactFact` 为准 |

---

## B28. `ArtifactVersionChangeRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact version management` |
| 对象类型 | history record |
| 结构责任 | 记录版本发布、替代、冻结和退役变化 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `ArtifactVersionChangeRecordId` | 变化记录身份 |
| `artifact_version_ref` | `ArtifactVersionRef` | 对应版本 |
| `change_kind` | `ArtifactVersionChangeKind` | 变化类别 |
| `actor_ref` | `ActorRef` | 触发变化的 actor |

| 工厂函数 | 作用 |
|---|---|
| `record_change(ArtifactVersionRef artifact_version_ref, ArtifactVersionChangeKind change_kind, ActorRef actor_ref)` | 为版本变化建立历史记录 |

| 禁止事项 | 说明 |
|---|---|
| 不替代历史版本读取面 | 历史浏览仍应通过正式 version / summary |

---

## B29. `ArtifactLineageChangeRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact lineage management` |
| 对象类型 | history record |
| 结构责任 | 记录血缘关系建立、拒绝和退役变化 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `ArtifactLineageChangeRecordId` | 变化记录身份 |
| `artifact_lineage_link_ref` | `ArtifactLineageLinkRef` | 对应血缘关系 |
| `change_kind` | `ArtifactLineageChangeKind` | 变化类别 |
| `basis_ref` | `ArtifactLineageBasisRef` | 变化依据 |

| 工厂函数 | 作用 |
|---|---|
| `record_change(ArtifactLineageLinkRef artifact_lineage_link_ref, ArtifactLineageChangeKind change_kind)` | 为血缘变化建立记录 |

| 禁止事项 | 说明 |
|---|---|
| 不替代关系真相 | 正式关系仍以 `ArtifactLineageLink` 为准 |

---

## B30. `ArtifactBaselineChangeRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact baseline management` |
| 对象类型 | history record |
| 结构责任 | 记录基线冻结、替代和退役变化 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `ArtifactBaselineChangeRecordId` | 变化记录身份 |
| `artifact_baseline_ref` | `ArtifactBaselineRef` | 对应基线 |
| `change_kind` | `ArtifactBaselineChangeKind` | 变化类别 |
| `actor_ref` | `ActorRef` | 触发变化的 actor |

| 工厂函数 | 作用 |
|---|---|
| `record_change(ArtifactBaselineRef artifact_baseline_ref, ArtifactBaselineChangeKind change_kind, ActorRef actor_ref)` | 为基线变化建立记录 |

| 禁止事项 | 说明 |
|---|---|
| 不把临时清单写成历史事实 | 历史基线必须回指正式 baseline |

---

## B31. `ArtifactInputResolutionRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact intake convergence` |
| 对象类型 | audit record |
| 结构责任 | 记录输入收束过程中来源解析、边界判断和拒绝原因 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `ArtifactInputResolutionRecordId` | 审计记录身份 |
| `intake_context_ref` | `ArtifactIntakeContextRef` | 对应输入语境 |
| `resolution_kind` | `ArtifactInputResolutionKind` | 本次解析动作类型 |
| `resolution_result` | `ArtifactInputResolutionResult` | 本次解析结果 |

| 工厂函数 | 作用 |
|---|---|
| `record_resolution(ArtifactIntakeContextRef intake_context_ref, ArtifactInputResolutionKind resolution_kind, ArtifactInputResolutionResult resolution_result)` | 记录一次输入收束动作 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 intake state | 最终状态仍由 `ArtifactIntakeContext` 承接 |

---

## B32. `ArtifactReviewTraceRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact review and responsibility context` |
| 对象类型 | audit record |
| 结构责任 | 记录 review / responsibility 的关键变化和解释链 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `ArtifactReviewTraceRecordId` | 追溯记录身份 |
| `review_anchor_ref` | `ArtifactReviewAnchorRef` | 对应审查锚点 |
| `assignment_ref` | `Option<ArtifactResponsibilityAssignmentRef>` | 对应责任语境 |
| `trace_kind` | `ArtifactReviewTraceKind` | 追溯类别 |

| 工厂函数 | 作用 |
|---|---|
| `record_trace(ArtifactReviewAnchorRef review_anchor_ref, ArtifactReviewTraceKind trace_kind)` | 记录审查或责任变化 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 review truth | 正式语境仍由 review / responsibility 对象承接 |

---

## B33. `AutomationIntakeAuditRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Automation output control boundary` |
| 对象类型 | audit record |
| 结构责任 | 记录自动化来源进入本仓时的判断、拒绝和交接链 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `AutomationIntakeAuditRecordId` | 审计记录身份 |
| `automation_input_ref` | `AutomationArtifactInputRef` | 对应自动化输入 |
| `audit_kind` | `AutomationAuditKind` | 审计类别 |
| `audit_result` | `AutomationAuditResult` | 判断结果 |

| 工厂函数 | 作用 |
|---|---|
| `record_audit(AutomationArtifactInputRef automation_input_ref, AutomationAuditKind audit_kind, AutomationAuditResult audit_result)` | 记录一次自动化边界判断 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 runtime 正文 | 只保存来源 ref 和审计结果 |

---

## B34. `ArtifactTraceRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact consumption and traceability` |
| 对象类型 | audit record |
| 结构责任 | 记录正式读取、导出、归档、观测和同步消费的追溯链 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `ArtifactTraceRecordId` | 追溯记录身份 |
| `consumer_ref` | `AdjacentConsumerRef` | 消费方 |
| `truth_anchor_ref` | `ArtifactTruthAnchorRef` | 被消费 truth 锚点 |
| `trace_kind` | `ArtifactTraceOperationKind` | 读取 / 导出 / handoff 动作类别 |
| `trace_state` | `ArtifactTraceState` | 追溯记录状态 |

| 状态 | 作用 |
|---|---|
| `Recorded` / `Delivered` / `Failed` / `Retryable` / `Retired` | 已记录、已送达、失败、可重试和已退役 |

| 成员函数 | 作用 |
|---|---|
| `mark_delivered()` | 标记消费 / 交接已完成 |
| `mark_failed(ArtifactTraceFailureReason reason)` | 标记本次动作失败 |
| `mark_retryable(ArtifactTraceRetryReason reason)` | 标记后续可重试 |

| 工厂函数 | 作用 |
|---|---|
| `record_trace(AdjacentConsumerRef consumer_ref, ArtifactTruthAnchorRef truth_anchor_ref, ArtifactTraceOperationKind trace_kind)` | 为一次消费或交接建立追溯记录 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 backref truth | 正式消费锚点仍由 `ArtifactConsumptionBackref` 承接 |
| 不把 trace 成功解释成核心成功 | 外围动作成功与主线成立必须分离 |

---

## B35. `ArtifactHandoffRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived maintenance and handoff preparation` |
| 对象类型 | handoff record |
| 结构责任 | 记录 archive / observability / sync 等交接材料的准备、送达和失败状态 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `ArtifactHandoffRecordId` | 交接记录身份 |
| `handoff_target_ref` | `AdjacentConsumerRef` | 交接目标 |
| `handoff_state` | `ArtifactHandoffState` | 交接状态 |
| `trace_ref` | `Option<ArtifactTraceRecordRef>` | 对应追溯记录 |
| `last_result` | `Option<ArtifactHandoffResult>` | 最近一次交接结果 |

| 状态 | 作用 |
|---|---|
| `Pending` / `Prepared` / `Delivered` / `Failed` / `Retryable` / `Cancelled` | 待处理、材料已准备、已送达、失败、可重试和已取消 |

| 成员函数 | 作用 |
|---|---|
| `mark_prepared()` | 标记交接材料已就绪 |
| `mark_delivered(ArtifactTraceRecord trace_record)` | 标记交接已送达 |
| `mark_failed(ArtifactHandoffFailureReason reason)` | 标记交接失败 |
| `mark_retryable(ArtifactHandoffRetryReason reason)` | 标记后续可重试 |

| 工厂函数 | 作用 |
|---|---|
| `for_target(AdjacentConsumerRef handoff_target_ref)` | 为某个交接目标建立记录 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 archive / sync 目标系统 truth | 只表达 Artifact 侧交接状态 |
| 不允许交接失败回写主线 | handoff 问题不能改写 Artifact truth |

---

## B36. `ExternalMirrorRefreshRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `External reference and local mirror support` |
| 对象类型 | history / refresh record |
| 结构责任 | 记录 local mirror 和 snapshot 的刷新结果、降级原因和来源位置 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `ExternalMirrorRefreshRecordId` | 刷新记录身份 |
| `external_ref` | `ExternalSourceRef` | 被刷新的外部引用 |
| `refresh_state` | `ExternalMirrorRefreshState` | 刷新状态 |
| `captured_source_version_ref` | `Option<ExternalSourceVersionRef>` | 刷新时捕获的来源版本 |
| `captured_at` | `RecordedAt` | 刷新时间点 |

| 状态 | 作用 |
|---|---|
| `Scheduled` / `Resolved` / `Degraded` / `Failed` / `Stale` | 已计划、已成功、降级成功、失败和已过期 |

| 成员函数 | 作用 |
|---|---|
| `mark_resolved(ExternalSourceVersionRef captured_source_version_ref)` | 标记刷新成功 |
| `mark_degraded(ExternalMirrorDegradeReason reason)` | 标记仅形成降级镜像 |
| `mark_failed(ReferenceRefreshFailureReason reason)` | 标记刷新失败 |

| 工厂函数 | 作用 |
|---|---|
| `for_reference(ExternalSourceRef external_ref)` | 为某个外部引用建立刷新记录 |

| 禁止事项 | 说明 |
|---|---|
| 不补造外部 truth | 降级和失败只能暴露状态,不能伪造来源内容 |
| 不替代 resolution state | 当前可用性仍由 `ExternalReferenceResolutionState` 承接 |
