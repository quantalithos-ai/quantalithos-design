# Step 6 附录 CP07. Member Read Model 对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 对应 capability: `02_hld_step_05_components_boundary.md` §13
> 状态: completed / pass / stop_review
> 本文件只定义由 CP01~06 committed refs / resolution 派生的 body-free 只读视图;任何 core / support / external truth、authorization、registry、definition body 与 consumer write 均不归 Read Model。

## C1. `MemberSummaryView`

| 项 | 内容 |
|---|---|
| 所属部分 | CP07 Member Read Model |
| 对象类型 | rebuildable read projection |
| 主要责任 | 为授权 consumer 提供项目型 member 的在场、交互阶段、外部协作 gap 与 Runtime safe status 的 body-free 摘要。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `summary_view_id` | `MemberSummaryViewId` | 视图 revision 标识。 |
| `subject_ref` | `ProjectMemberRef` | 摘要所属项目型执行主语。 |
| `identity_anchor_ref` | `GlobalMemberRef` | 只读身份锚。 |
| `presence_summary` | `MemberPresenceSummary` | 从 CP01 committed facts 派生的安全状态分类。 |
| `interaction_summary` | `MemberInteractionSummary` | 从 CP02~05 派生的低基数 decision / attempt / gap 摘要。 |
| `runtime_safe_view_ref` | `Optional<RuntimeSafeViewRef>` | Runtime owner 提供的安全视图引用。 |
| `source_watermark` | `ProjectionWatermark` | 已应用本地事实与 external resolution 的位置。 |
| `freshness` | `ProjectionFreshness` | current / stale / rebuilding / degraded / unknown。 |
| `projection_state_ref` | `MemberProjectionStateId` | 本次视图的重建与 gap 状态。 |
| `generated_at` | `Timestamp` | 视图生成时点。 |

该 view revision 创建后不可变;后续事实通过新 revision / watermark 表达。它不是 presence、Runtime、host 或 downstream truth。

| 成员函数 | 作用 |
|---|---|
| `is_current_at(ProjectionWatermark required_watermark)` | 判断视图是否达到 consumer 要求的来源位置。 |
| `is_safe_to_expose(ProjectionVisibilityContext visibility_context)` | 检查可见范围与 body-free 分类。 |
| `degradation_surface()` | 返回 stale / gap / unknown 的安全解释,不触发修复。 |

| 工厂函数 | 作用 |
|---|---|
| `rebuild(ProjectMemberRef subject_ref, GlobalMemberRef identity_anchor_ref, List<MemberCommittedFactRef> committed_facts, List<ExternalContextResolution> resolutions, Optional<RuntimeSafeViewRef> runtime_safe_view_ref, MemberProjectionState projection_state, ReadProjectionPolicy policy)` | 从可证明来源重建 body-free summary revision。 |

| 禁止事项 | 说明 |
|---|---|
| 不从 Query 回写 presence / screening / outbound truth | View 只有读取权。 |
| stale / degraded 不伪装 current | freshness 必须随响应暴露。 |
| 不含 raw body、hidden reasoning、secret、complete log 或 evidence | 只返回安全分类与 refs。 |

## C2. `CapabilityOutletView`

| 项 | 内容 |
|---|---|
| 所属部分 | CP07 Member Read Model |
| 对象类型 | optional ref-derived read projection |
| 主要责任 | 从 Tools contract / binding 与 Method definition 的正式 safe refs 派生成员可见能力出口,并显式表达裁剪、stale 与 gap。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `outlet_view_id` | `CapabilityOutletViewId` | 视图 revision 标识。 |
| `subject_ref` | `ProjectMemberRef` | 能力出口所属项目型 member。 |
| `activation_status` | `CapabilityOutletStatus` | available / not_available / stale / gap。 |
| `tool_contract_refs` | `List<ToolContractViewRef>` | Tools owner 提供的正式 safe view refs。 |
| `capability_binding_refs` | `List<CapabilityBindingViewRef>` | 正式 binding safe view refs;不复制 registry。 |
| `method_definition_refs` | `List<MethodDefinitionRef>` | 可选方法定义引用;不保存正文。 |
| `resolution_refs` | `List<ExternalContextResolutionId>` | 每项 ref 的 neutral consumption 依据。 |
| `source_watermark` | `ProjectionWatermark` | 已应用来源版本位置。 |
| `gap_refs` | `List<ExternalContextGapId>` | unresolved / stale / activation gap。 |
| `generated_at` | `Timestamp` | 视图生成时点。 |

| 状态 | 作用 |
|---|---|
| `available` | 激活且所有展示项 refs / resolutions 足够;不表示 authorized 或 invocable。 |
| `not_available` | outlet 被明确裁剪 / 未激活,不影响 C1~C4。 |
| `stale` | 至少一个来源落后,不得冒充 current。 |
| `gap` | contract / binding / method ref 或 consumer contract 未闭口。 |

| 成员函数 | 作用 |
|---|---|
| `is_available()` | 只回答 projection activation / source sufficiency。 |
| `contains_definition_body()` | 始终应为 false;用于守护 projection 边界。 |
| `can_invoke(ToolContractViewRef tool_contract_ref)` | 始终不直接授权调用;返回 non_authorizing 结果。 |
| `matches_resolution(List<ExternalContextResolution> resolutions)` | 检查 refs、scope、freshness 与 watermark 一致。 |

| 工厂函数 | 作用 |
|---|---|
| `project(ProjectMemberRef subject_ref, CapabilityOutletActivation activation, List<ToolContractViewRef> tool_contract_refs, List<CapabilityBindingViewRef> capability_binding_refs, List<MethodDefinitionRef> method_definition_refs, List<ExternalContextResolution> resolutions, List<ExternalContextGap> gaps, ProjectionWatermark source_watermark, ReadProjectionPolicy policy)` | 形成 available / not_available / stale / gap 的 ref-derived view。 |

| 禁止事项 | 说明 |
|---|---|
| 不建立 local registry / inventory / allowlist | Outlet 只派生外部正式 refs。 |
| available 不等于 authorization / invocation permission / execution readiness | Runtime -> Tools 正式链仍负责调用。 |
| 不复制 Tool / Method definition 或 provider route | definition 与 adapter truth 外置。 |

## C3. `MemberProjectionState`

| 项 | 内容 |
|---|---|
| 所属部分 | CP07 Member Read Model |
| 对象类型 | projection state / rebuild support truth |
| 主要责任 | 表达某类 member projection 已应用的来源 watermark、freshness、重建能力和未闭合 gap。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `projection_state_id` | `MemberProjectionStateId` | 投影状态标识。 |
| `subject_ref` | `ProjectMemberRef` | 投影所属主语。 |
| `projection_kind` | `MemberProjectionKind` | summary / capability_outlet / diagnostic。 |
| `status` | `MemberProjectionStatus` | current / stale / rebuilding / degraded / failed / disabled / unknown。 |
| `source_watermark` | `ProjectionWatermark` | 已应用的 committed facts / resolution 位置。 |
| `target_watermark` | `Optional<ProjectionWatermark>` | 已知应追赶的目标位置。 |
| `gap_refs` | `List<TypedRef>` | 影响当前状态的 interaction / external / projection gaps。 |
| `rebuildable` | `Boolean` | 是否能仅从 committed sources 重建。 |
| `safe_reason` | `Optional<SafeReasonCategory>` | 非 current 状态的安全原因。 |
| `updated_at` | `Timestamp` | 本地状态更新时间。 |

| 状态 | 作用 |
|---|---|
| `current` | 已追到可证明 target watermark。 |
| `stale` | 来源已前进,当前 view 落后。 |
| `rebuilding` | 正在从 committed sources 重新生成,旧 view 仍须标 stale。 |
| `degraded` | 部分来源 / resolution 不可用,可返回有限视图。 |
| `failed` | 最近重建失败,不得伪装 current。 |
| `disabled` | 可选 projection 明确未激活。 |
| `unknown` | 无法证明 watermark / rebuild 完整性。 |

| 成员函数 | 作用 |
|---|---|
| `mark_stale(ProjectionWatermark target_watermark, SafeReasonCategory safe_reason)` | 来源前进时显式标记落后。 |
| `start_rebuild(ProjectionWatermark target_watermark)` | 记录重建目标,不修改 core truth。 |
| `complete_rebuild(ProjectionWatermark applied_watermark, Timestamp updated_at)` | 仅在来源覆盖与完整性成立时进入 current。 |
| `mark_failed(SafeReasonCategory safe_reason, Timestamp updated_at)` | 记录独立 projection failure。 |
| `can_serve(ProjectionConsistencyHint consistency_hint)` | 返回 current / stale-allowed / degraded / unavailable surface。 |

| 工厂函数 | 作用 |
|---|---|
| `initialize(ProjectMemberRef subject_ref, MemberProjectionKind projection_kind, ProjectionActivation activation, ProjectionWatermark initial_watermark, Timestamp created_at)` | 建立 current / disabled 的初始 projection state。 |

| 禁止事项 | 说明 |
|---|---|
| rebuild 不补造或修复 core / external truth | 只能重放允许的 committed refs / resolution。 |
| failed 不自动变 current | 必须有成功覆盖 target watermark 的新事实。 |
| projection failure 不阻断 C1~C4 | 派生路径与核心闭环隔离。 |

## C4. `MemberDiagnosticView`

| 项 | 内容 |
|---|---|
| 所属部分 | CP07 Member Read Model |
| 对象类型 | optional body-free diagnostic projection |
| 主要责任 | 为维护者提供筛选、交互关联、出站与 external resolution 的安全诊断 / 解释面,不替代日志或配置 truth。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `diagnostic_view_id` | `MemberDiagnosticViewId` | 视图 revision 标识。 |
| `subject_ref` | `ProjectMemberRef` | 诊断目标主语。 |
| `diagnostic_categories` | `Set<MemberDiagnosticCategory>` | 低基数状态 / 失败 / gap 类别。 |
| `trace_refs` | `List<InteractionTraceEntryId>` | 允许回链的 body-free trace refs。 |
| `gap_refs` | `List<TypedRef>` | interaction / publication / external / projection gap refs。 |
| `source_resolution_refs` | `List<ExternalContextResolutionId>` | 解释 external freshness / conflict 的 neutral refs。 |
| `explanation_refs` | `List<SafeExplanationRef>` | 正式 policy / config / source 的安全解释引用。 |
| `projection_state_ref` | `MemberProjectionStateId` | 诊断视图自身 freshness。 |
| `generated_at` | `Timestamp` | 生成时点。 |

该 view 为可裁剪增强项,无业务生命周期状态;缺失不得影响 C1~C4 或 Member Summary。

| 成员函数 | 作用 |
|---|---|
| `is_safe_to_expose(ProjectionVisibilityContext visibility_context)` | 检查维护者可见范围与 body-free gate。 |
| `explains_gap(TypedRef gap_ref)` | 判断视图是否包含该 gap 的安全来源链。 |
| `is_current_at(ProjectionWatermark required_watermark)` | 检查 projection freshness。 |

| 工厂函数 | 作用 |
|---|---|
| `rebuild(ProjectMemberRef subject_ref, List<InteractionTraceEntry> trace_entries, List<TypedRef> gap_refs, List<ExternalContextResolution> resolutions, List<SafeExplanationRef> explanation_refs, MemberProjectionState projection_state, ReadProjectionPolicy policy)` | 从允许 sources 重建 optional diagnostic view。 |

| 禁止事项 | 说明 |
|---|---|
| 不输出原始日志、正文、高基数标签或 secret | 诊断不扩大数据权限。 |
| 不自动调 screening / publication / configuration | 只读解释,不形成写控制面。 |
| 不生成 evidence / verdict / readiness | 视图不是验收证据。 |

## C5. `ReadProjectionPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | CP07 Member Read Model |
| 对象类型 | domain policy / projection and query guard |
| 主要责任 | 保护 committed-source-only、visibility、body-free、source sufficiency、freshness、rebuildability、no-write 与 outlet non-authorizing 边界。 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `source_requirement` | `CommittedProjectionSourceRequirement` | 只消费 CP01~06 committed refs / resolution。 |
| `visibility_rule` | `ProjectionVisibilityRule` | Query 必须受正式 actor / scope 约束。 |
| `body_boundary` | `ForbiddenBodyBoundary` | 禁止正文、secret、hidden reasoning、definition body 与完整日志。 |
| `freshness_rule` | `ProjectionFreshnessRule` | watermark、stale、degraded、unknown 必须显式。 |
| `rebuild_rule` | `ProjectionRebuildRule` | rebuild 只能从 committed sources 生成。 |
| `no_write_rule` | `ProjectionNoWriteRule` | Query / projection / job 均无 core write 权。 |
| `outlet_rule` | `CapabilityOutletRule` | outlet 可裁剪且永不授权调用。 |

该 policy 无业务生命周期状态。

| 成员函数 | 作用 |
|---|---|
| `validate_sources(List<MemberCommittedFactRef> committed_facts, List<ExternalContextResolution> resolutions, ProjectionWatermark source_watermark)` | 检查来源覆盖、freshness 与 gap。 |
| `evaluate_visibility(ActorContext actor, ProjectionVisibilityContext visibility_context)` | 返回 visible / restricted / denied / unknown 的只读判断。 |
| `validate_view(ProjectionBodyInspection body_inspection, ProjectionFreshness freshness)` | 执行 body-free 与 freshness 暴露门禁。 |
| `evaluate_outlet(CapabilityOutletActivation activation, List<ExternalContextResolution> resolutions, List<ExternalContextGap> gaps)` | 返回 available / not_available / stale / gap,不授权调用。 |
| `allows_core_write()` | 始终返回 false。 |

| 工厂函数 | 作用 |
|---|---|
| `read_only_rebuildable()` | 创建 committed-source-only、body-free、no-write、non-authorizing 的 projection policy。 |

| 禁止事项 | 说明 |
|---|---|
| 不允许 Query / Consumer / Job 修复 core truth | 正式变化必须重入对应 owner command / consumer boundary。 |
| 不允许配置隐藏 stale / gap 或放宽 visibility / body gate | 这些是架构 invariant。 |
| 不把 capability outlet 变成 registry / invocation gateway | Runtime -> Tools 正式链保持唯一。 |

## 6. CP07 对象正式化停审

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 5 的 5 个候选全部处理 | pass | 5/5 独立成节。 |
| summary / outlet / diagnostic / state 分层 | pass | 各视图用途、activation 与 freshness 不混写。 |
| projection no-write / rebuildable | pass | 无 core write port,失败不影响 C1~C4。 |
| outlet optional / non-authorizing | pass | not_available / stale / gap 显式,无 registry / invocation。 |
| body-free / visibility / freshness gate 完整 | pass | raw body、definition body、complete log 均排除。 |
| Step 8 / 9 可反查 | pass | project、query、rebuild、reconcile 与状态传播均可展开。 |

CP07 结论为 `completed / pass / stop_review`。下一允许动作是回填 Step 8 / 9 反查、七部分停审与跨对象总审计;通过前不得创建 Step 7。
