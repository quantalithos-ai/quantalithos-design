# Step 6 附录 B1. Policy / Guard 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> Policy 只表达判断边界,不保存业务 truth。

---

## B1. `ArtifactFactPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact fact management` |
| 对象类型 | policy / guard |
| 结构责任 | 判断正式 Artifact fact 是否允许成立,并防止派生材料或外部正文越界进入 truth |

| 字段 | 类型 | 作用 |
|---|---|---|
| `intake_context_ref` | `ArtifactIntakeContextRef` | 被判断的输入语境 |
| `content_resolution_state` | `ExternalReferenceResolutionStateRef` | 外部来源解析状态 |

| 成员函数 | 作用 |
|---|---|
| `assert_fact_establishable(ArtifactIntakeContext intake_context)` | 校验输入已满足建立正式事实的前置条件 |
| `assert_no_external_body_ownership(ArtifactContentSourceRef content_source_ref)` | 校验正文 ownership 未被吸入本仓 |
| `assert_no_derived_material_as_truth(ArtifactDerivedViewState derived_state)` | 校验 preview / report 等派生材料未被误作 truth 来源 |
| `assert_single_truth_anchor(ArtifactFactRef artifact_fact_ref)` | 校验未形成冲突事实锚点 |

| 工厂函数 | 作用 |
|---|---|
| `for_intake(ArtifactIntakeContextRef intake_context_ref, ExternalReferenceResolutionStateRef content_resolution_state)` | 从输入与解析状态形成事实建立策略 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 `ArtifactFact` 状态迁移 | 对象本体仍负责自己的生命周期 |
| 不允许配置改变 ownership 边界 | 配置只能影响节奏,不能改变 truth 归属 |

---

## B2. `ArtifactVersionPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact version management` |
| 对象类型 | policy / guard |
| 结构责任 | 判断候选修订、正式发布、替代和历史保留是否满足版本边界 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `artifact_fact_ref` | `ArtifactFactRef` | 被判断的事实主语 |
| `current_version_ref` | `Option<ArtifactVersionRef>` | 当前正式版本 |

| 成员函数 | 作用 |
|---|---|
| `assert_publish_allowed(ArtifactVersionCandidate candidate)` | 校验候选版本可以正式发布 |
| `assert_supersede_allowed(ArtifactVersion current, ArtifactVersion next)` | 校验替代关系合法 |
| `assert_no_silent_overwrite(ArtifactContentFactContext content_context)` | 防止新内容静默覆盖正式版本 |
| `assert_history_traceable(ArtifactVersionRef version_ref)` | 校验历史版本仍可被回指 |

| 工厂函数 | 作用 |
|---|---|
| `for_fact(ArtifactFactRef artifact_fact_ref, Option<ArtifactVersionRef> current_version_ref)` | 从事实主语和当前版本形成版本策略 |

| 禁止事项 | 说明 |
|---|---|
| 不把 current latest 当策略输入真相 | 正式引用单位必须是版本对象 |
| 不绕过候选修订语境 | 自动化或外部变化不能直接创建正式版本 |

---

## B3. `ArtifactLineagePolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact lineage management` |
| 对象类型 | policy / guard |
| 结构责任 | 判断 lineage relation 是否锚定正式 version,并防止 trace / tool / event 直接成为血缘 truth |

| 字段 | 类型 | 作用 |
|---|---|---|
| `source_version_ref` | `ArtifactVersionRef` | 来源版本 |
| `target_version_ref` | `ArtifactVersionRef` | 目标版本 |

| 成员函数 | 作用 |
|---|---|
| `assert_anchor_versions_resolved(ArtifactVersion source, ArtifactVersion target)` | 校验血缘关系锚定在正式版本上 |
| `assert_relation_basis_sufficient(ArtifactLineageBasisRef basis_ref)` | 校验来源 / 替代 / 依赖依据足够 |
| `assert_no_runtime_trace_as_truth(AutomationSourceRef automation_source_ref)` | 防止 runtime 线索直接升级为正式血缘 |
| `assert_no_current_content_shortcut(ArtifactFact fact)` | 防止绕过版本锚点直接连到当前内容 |

| 工厂函数 | 作用 |
|---|---|
| `for_versions(ArtifactVersionRef source_version_ref, ArtifactVersionRef target_version_ref)` | 从两个正式版本形成血缘策略 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 `ArtifactLineageLink` 本体 | 关系成立仍由对象本体表达 |
| 不持有图查询实现细节 | graph query 留给后续详细设计 |

---

## B4. `ArtifactBaselinePolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact baseline management` |
| 对象类型 | policy / guard |
| 结构责任 | 判断受控版本集合是否允许进入正式冻结语境 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `baseline_scope_ref` | `ArtifactBaselineScopeRef` | 候选冻结范围 |
| `membership_refs` | `ArtifactBaselineMembershipRefSet` | 候选成员集合 |

| 成员函数 | 作用 |
|---|---|
| `assert_only_formal_versions(ArtifactBaselineMembershipRefSet membership_refs)` | 校验成员只包含正式版本 |
| `assert_freeze_context_ready(ArtifactReviewAnchor review_anchor)` | 校验冻结前责任 / 审查语境闭口 |
| `assert_no_dynamic_current_resolution()` | 防止运行时解析 current version 替代明确成员 |
| `assert_historical_baseline_preserved(ArtifactBaselineRef artifact_baseline_ref)` | 校验历史基线不会被改写 |

| 工厂函数 | 作用 |
|---|---|
| `for_candidate(ArtifactBaselineScopeRef baseline_scope_ref, ArtifactBaselineMembershipRefSet membership_refs)` | 从候选范围和成员集合形成基线策略 |

| 禁止事项 | 说明 |
|---|---|
| 不让外部清单替代成员集合 | 发布说明或裁决不能直接充当 baseline |
| 不把消费端范围解释回写为 truth | 下游 scope 只能引用正式 baseline |

---

## B5. `ArtifactIntakePolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact intake convergence` |
| 对象类型 | policy / guard |
| 结构责任 | 判断输入收束是否守住来源解析、正文边界和最小可接受性 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `source_ref` | `ArtifactContentSourceRef` | 被判断来源 |
| `resolution_state` | `ExternalReferenceResolutionStateRef` | 对应解析状态 |

| 成员函数 | 作用 |
|---|---|
| `assert_source_resolvable(ArtifactContentSourceRef source_ref)` | 校验来源可被正式解析 |
| `assert_no_external_body_ingest(ArtifactContentSourceRef source_ref)` | 校验未把正文 ownership 带入本仓 |
| `assert_input_minimally_acceptable(ArtifactIntakeContext intake_context)` | 校验收束语境满足最小输入条件 |
| `assert_ready_for_truth_write(ArtifactSubmissionRecord submission)` | 校验提交可以移交主线写路径 |

| 工厂函数 | 作用 |
|---|---|
| `for_source(ArtifactContentSourceRef source_ref, ExternalReferenceResolutionStateRef resolution_state)` | 从来源和解析状态形成 intake 策略 |

| 禁止事项 | 说明 |
|---|---|
| 不补造外部 truth | unresolved 只能等待或拒绝 |
| 不替代 intake state | 具体收束状态仍由 `ArtifactIntakeContext` 表达 |

---

## B6. `ArtifactReviewPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact review and responsibility context` |
| 对象类型 | policy / guard |
| 结构责任 | 判断 review / responsibility 是否锚定同一正式 Artifact truth,并且解释语境闭口 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `truth_anchor_ref` | `ArtifactTruthAnchorRef` | 被审查 truth 锚点 |
| `responsibility_assignment_ref` | `ArtifactResponsibilityAssignmentRef` | 对应责任分配 |

| 成员函数 | 作用 |
|---|---|
| `assert_review_anchor_resolved(ArtifactReviewAnchor review_anchor)` | 校验审查锚点已闭口 |
| `assert_same_truth_anchor(ArtifactReviewAnchor review_anchor, ArtifactTruthAnchorRef truth_anchor_ref)` | 校验责任和审查都围绕同一 truth |
| `assert_responsibility_explainable(ArtifactResponsibilityAssignment assignment)` | 校验责任承担依据完整 |
| `assert_no_view_state_as_basis(ArtifactReadSurfaceView read_surface)` | 防止只读视图被误用为审查依据 |

| 工厂函数 | 作用 |
|---|---|
| `for_anchor(ArtifactTruthAnchorRef truth_anchor_ref, ArtifactResponsibilityAssignmentRef responsibility_assignment_ref)` | 从 truth 锚点与责任语境形成 review 策略 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 identity / governance truth | 只消费其摘要和责任语境 |
| 不以消费副本作为 review basis | review 只能回到正式 truth |

---

## B7. `AutomationBoundaryPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Automation output control boundary` |
| 对象类型 | policy / guard |
| 结构责任 | 判断自动化产出是否只能以候选输入或候选关系线索进入 Artifact 主线 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `automation_source_ref` | `AutomationSourceRef` | 自动化来源引用 |
| `resolution_state` | `ExternalReferenceResolutionStateRef` | 来源解析状态 |

| 成员函数 | 作用 |
|---|---|
| `assert_candidate_only(AutomationArtifactInput automation_input)` | 校验自动化输入只作为候选变化存在 |
| `assert_no_direct_truth_creation(AutomationArtifactInput automation_input)` | 防止自动化结果直接创建核心 truth |
| `assert_source_traceable(AutomationSourceRef automation_source_ref)` | 校验来源可追溯 |
| `assert_requires_formal_convergence(AutomationArtifactInput automation_input)` | 强制先进入 intake / review 再进入主线 |

| 工厂函数 | 作用 |
|---|---|
| `for_source(AutomationSourceRef automation_source_ref, ExternalReferenceResolutionStateRef resolution_state)` | 从自动化来源形成边界策略 |

| 禁止事项 | 说明 |
|---|---|
| 不把 tool output 当 Artifact truth | 工具结果只能提供候选线索 |
| 不绕过审查 / 责任语境 | 高影响自动化变化必须可解释 |

---

## B8. `ArtifactReadVisibilityPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact consumption and traceability` |
| 对象类型 | policy / guard |
| 结构责任 | 判断某个消费方是否可以看到指定 Artifact truth 或其只读派生结果 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `consumer_ref` | `AdjacentConsumerRef` | 请求读取的消费方 |
| `truth_anchor_ref` | `ArtifactTruthAnchorRef` | 被读取的正式 truth |

| 成员函数 | 作用 |
|---|---|
| `assert_visible(AdjacentConsumerRef consumer_ref, ArtifactTruthAnchorRef truth_anchor_ref)` | 校验消费方可见性 |
| `assert_can_read_stale_view(ArtifactDerivedViewState derived_state)` | 判断是否允许读取过期派生结果 |
| `assert_backref_required(AdjacentConsumerRef consumer_ref)` | 判断该读取是否必须生成 backref |

| 工厂函数 | 作用 |
|---|---|
| `for_consumer(AdjacentConsumerRef consumer_ref, ArtifactTruthAnchorRef truth_anchor_ref)` | 从消费方和 truth 锚点形成可见性策略 |

| 禁止事项 | 说明 |
|---|---|
| 不替代产品入口鉴权 | 鉴权实现留给后续接口和详细设计 |
| 不让 preview / report 绕过 truth 可见性 | 派生读取仍受同一可见性约束 |

---

## B9. `ArtifactTraceabilityPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact consumption and traceability` |
| 对象类型 | policy / guard |
| 结构责任 | 判断消费、导出、观测和交接是否留下足够 backref / trace 证据 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `consumer_ref` | `AdjacentConsumerRef` | 当前消费或交接对象 |
| `operation_kind` | `ArtifactTraceOperationKind` | 读取、导出、归档、观测或同步哪类动作 |

| 成员函数 | 作用 |
|---|---|
| `assert_backref_complete(ArtifactConsumptionBackref backref)` | 校验已记录消费锚点 |
| `assert_handoff_traceable(ArtifactHandoffRecord handoff_record)` | 校验交接动作可被回看解释 |
| `assert_no_unanchored_consumption(ArtifactTruthAnchorRef truth_anchor_ref)` | 防止无锚点消费 |

| 工厂函数 | 作用 |
|---|---|
| `for_operation(AdjacentConsumerRef consumer_ref, ArtifactTraceOperationKind operation_kind)` | 从消费方和动作类别形成追溯策略 |

| 禁止事项 | 说明 |
|---|---|
| 不把 trace 记录当 truth 主体 | trace 只解释消费,不生成核心事实 |
| 不忽略失败和降级 | unavailable / retryable 也必须可追溯 |

---

## B10. `ExternalReferenceValidityPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `External reference and local mirror support` |
| 对象类型 | policy / guard |
| 结构责任 | 判断 external ref、snapshot 和 local mirror 在不同路径下是否可用 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `external_ref` | `ExternalSourceRef` | 被判断外部引用 |
| `resolution_state` | `ExternalReferenceResolutionStateRef` | 当前解析状态 |

| 成员函数 | 作用 |
|---|---|
| `assert_reference_usable(ExternalReferenceResolutionState resolution_state)` | 判断当前外部引用是否可用 |
| `assert_snapshot_not_stale_for_write(ExternalReferenceResolutionState resolution_state)` | 判断写路径是否允许使用该镜像 |
| `assert_degraded_only_for_read(ExternalReferenceResolutionState resolution_state)` | 判断降级语义是否只能停留在读取 / 展示侧 |

| 工厂函数 | 作用 |
|---|---|
| `for_reference(ExternalSourceRef external_ref, ExternalReferenceResolutionStateRef resolution_state)` | 从外部引用和解析状态形成有效性策略 |

| 禁止事项 | 说明 |
|---|---|
| 不允许 stale / unresolved 直接推进 truth write | 主线写入必须依赖正式可解释来源 |
| 不让 mirror 替代外部来源 truth | snapshot 只是本地支撑材料 |
