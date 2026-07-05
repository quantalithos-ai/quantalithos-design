# Step 6 附录 B2. Projection / Read Model 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> Projection / read model 只能只读、可重建、可过期,不得反写真相。

---

## B11. `ArtifactFactSummaryView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact fact management` |
| 对象类型 | projection / read model |
| 结构责任 | 提供 Artifact fact 的只读摘要和当前内容事实语境说明 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_ref` | `ArtifactFactSummaryViewRef` | 视图身份 |
| `artifact_fact_ref` | `ArtifactFactRef` | 对应正式事实 |
| `current_version_ref` | `Option<ArtifactVersionRef>` | 当前版本锚点 |
| `summary_state` | `ArtifactSummaryViewState` | 摘要是否可读、过期或不可用 |

| 成员函数 | 作用 |
|---|---|
| `matches_fact(ArtifactFactRef artifact_fact_ref)` | 判断视图是否属于指定事实 |
| `is_stale()` | 判断是否需要重建 |

| 工厂函数 | 作用 |
|---|---|
| `from_fact(ArtifactFact fact)` | 从正式事实构造摘要视图 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 `ArtifactFact` truth | 正式状态以核心对象为准 |
| 不保存正文副本 | 只输出摘要和引用 |

---

## B12. `ArtifactVersionSummaryView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact version management` |
| 对象类型 | projection / read model |
| 结构责任 | 提供 ArtifactVersion 的只读摘要,供历史浏览、引用检查和消费解释使用 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_ref` | `ArtifactVersionSummaryViewRef` | 视图身份 |
| `artifact_version_ref` | `ArtifactVersionRef` | 对应正式版本 |
| `artifact_fact_ref` | `ArtifactFactRef` | 所属事实主语 |
| `summary_state` | `ArtifactSummaryViewState` | 摘要可读状态 |

| 成员函数 | 作用 |
|---|---|
| `matches_version(ArtifactVersionRef artifact_version_ref)` | 判断是否属于指定版本 |
| `is_history_visible()` | 判断是否适合历史回看 |

| 工厂函数 | 作用 |
|---|---|
| `from_version(ArtifactVersion version)` | 从正式版本构造摘要视图 |

| 禁止事项 | 说明 |
|---|---|
| 不改变版本状态 | summary 不能把 candidate 变 published |
| 不以最新文件替代版本 | 只能回指稳定 version ref |

---

## B13. `ArtifactLineageSummaryView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact lineage management` |
| 对象类型 | projection / read model |
| 结构责任 | 汇总某个 ArtifactVersion 的来源、替代、依赖和影响关系摘要 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_ref` | `ArtifactLineageSummaryViewRef` | 视图身份 |
| `artifact_version_ref` | `ArtifactVersionRef` | 目标版本 |
| `relation_refs` | `ArtifactLineageLinkRefSet` | 相关血缘关系集合 |
| `summary_state` | `ArtifactSummaryViewState` | 摘要可读状态 |

| 成员函数 | 作用 |
|---|---|
| `contains_relation(ArtifactLineageLinkRef relation_ref)` | 判断是否包含指定关系 |
| `is_complete()` | 判断血缘摘要是否完整 |

| 工厂函数 | 作用 |
|---|---|
| `from_lineage(ArtifactVersionRef artifact_version_ref, ArtifactLineageLinkRefSet relation_refs)` | 从正式血缘关系构造摘要 |

| 禁止事项 | 说明 |
|---|---|
| 不替代正式 lineage truth | 正式关系仍以 `ArtifactLineageLink` 为准 |
| 不执行图查询策略 | 查询优化留给详细设计 |

---

## B14. `ArtifactBaselineSummaryView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact baseline management` |
| 对象类型 | projection / read model |
| 结构责任 | 提供基线成员集合、冻结语境和历史定位的只读摘要 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_ref` | `ArtifactBaselineSummaryViewRef` | 视图身份 |
| `artifact_baseline_ref` | `ArtifactBaselineRef` | 对应正式基线 |
| `member_count` | `ArtifactBaselineMemberCount` | 成员数量摘要 |
| `summary_state` | `ArtifactSummaryViewState` | 摘要可读状态 |

| 成员函数 | 作用 |
|---|---|
| `matches_baseline(ArtifactBaselineRef artifact_baseline_ref)` | 判断是否属于指定基线 |
| `has_members()` | 判断是否有正式成员 |

| 工厂函数 | 作用 |
|---|---|
| `from_baseline(ArtifactBaseline baseline)` | 从正式基线构造摘要视图 |

| 禁止事项 | 说明 |
|---|---|
| 不替代成员冻结 truth | 成员集合仍以 `ArtifactBaselineMembership` 为准 |
| 不把临时清单当基线摘要 | 只可来自正式 baseline truth |

---

## B15. `ArtifactReviewSummaryView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact review and responsibility context` |
| 对象类型 | projection / read model |
| 结构责任 | 提供 review anchor、responsibility 和审查状态的只读摘要 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_ref` | `ArtifactReviewSummaryViewRef` | 视图身份 |
| `review_anchor_ref` | `ArtifactReviewAnchorRef` | 对应审查锚点 |
| `responsibility_assignment_ref` | `Option<ArtifactResponsibilityAssignmentRef>` | 当前责任承担语境 |
| `summary_state` | `ArtifactSummaryViewState` | 摘要可读状态 |

| 成员函数 | 作用 |
|---|---|
| `matches_anchor(ArtifactReviewAnchorRef review_anchor_ref)` | 判断是否属于指定锚点 |
| `is_actionable()` | 判断是否仍需要责任或维护动作 |

| 工厂函数 | 作用 |
|---|---|
| `from_review(ArtifactReviewAnchor review_anchor, Option<ArtifactResponsibilityAssignmentRef> responsibility_assignment_ref)` | 从 review 语境构造摘要 |

| 禁止事项 | 说明 |
|---|---|
| 不替代审查锚点 truth | 正式语境仍由 `ArtifactReviewAnchor` 承接 |
| 不保存下游 view state | 只输出 Artifact 侧可解释摘要 |

---

## B16. `ArtifactReadSurfaceView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Artifact consumption and traceability` |
| 对象类型 | projection / read model |
| 结构责任 | 作为对外正式读取面的统一承载,输出可读 truth、受限状态和回指依据 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_ref` | `ArtifactReadSurfaceViewRef` | 读面身份 |
| `consumable_ref` | `ConsumableArtifactReferenceRef` | 对应可消费引用 |
| `surface_state` | `ArtifactReadSurfaceState` | 读面状态 |
| `trace_ref` | `Option<ArtifactTraceRecordRef>` | 对应追溯记录 |

| 状态 | 作用 |
|---|---|
| `Ready` / `Restricted` / `Stale` / `Unavailable` | 可读、受限、过期和不可用 |

| 成员函数 | 作用 |
|---|---|
| `is_visible_to(ArtifactReadVisibilityPolicy policy)` | 判断对某消费方是否可见 |
| `requires_backref()` | 判断本次读取是否必须生成回指 |

| 工厂函数 | 作用 |
|---|---|
| `from_consumable(ConsumableArtifactReference consumable_ref)` | 从正式可消费引用构造读面 |

| 禁止事项 | 说明 |
|---|---|
| 不绕过 visibility policy | 读面只是输出承载,不可跳过可见性判断 |
| 不回写核心 truth | 读面生成失败不能改变 ArtifactFact / Version |

---

## B17. `ArtifactPreviewView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived maintenance and handoff preparation` |
| 对象类型 | projection / read model |
| 结构责任 | 为下游提供只读 preview,解释某个版本或基线的快速消费材料 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_ref` | `ArtifactPreviewViewRef` | 预览视图身份 |
| `artifact_truth_anchor_ref` | `ArtifactTruthAnchorRef` | 预览对应的 truth 锚点 |
| `preview_state` | `ArtifactPreviewState` | 预览状态 |
| `freshness_state` | `ArtifactDerivedFreshnessState` | 预览是否新鲜 |

| 状态 | 作用 |
|---|---|
| `Ready` / `Stale` / `Rebuilding` / `Unavailable` | 可用、过期、重建中和不可用 |

| 成员函数 | 作用 |
|---|---|
| `is_stale()` | 判断是否需要重建 |
| `covers_anchor(ArtifactTruthAnchorRef artifact_truth_anchor_ref)` | 判断是否覆盖指定锚点 |

| 工厂函数 | 作用 |
|---|---|
| `from_truth(ArtifactTruthAnchorRef artifact_truth_anchor_ref, ArtifactDerivedFreshnessState freshness_state)` | 从 truth 锚点构造 preview |

| 禁止事项 | 说明 |
|---|---|
| 不作为正式 truth | preview 只是读取友好层 |
| 不保存外部正文副本 | 仍以 content ref / summary 表达 |

---

## B18. `ArtifactReportView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived maintenance and handoff preparation` |
| 对象类型 | projection / read model |
| 结构责任 | 汇总 fact / version / lineage / baseline / review / trace 的只读报告视图 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_ref` | `ArtifactReportViewRef` | 报告视图身份 |
| `report_scope_ref` | `ArtifactReportScopeRef` | 报告覆盖范围 |
| `report_state` | `ArtifactReportState` | 报告状态 |
| `source_cursor` | `ArtifactTruthCursor` | 报告基于的 truth 位置 |

| 状态 | 作用 |
|---|---|
| `Ready` / `Stale` / `Generating` / `Unavailable` | 可读、过期、生成中和不可用 |

| 成员函数 | 作用 |
|---|---|
| `covers_scope(ArtifactReportScopeRef report_scope_ref)` | 判断是否覆盖指定范围 |
| `is_generating()` | 判断是否仍在生成 |

| 工厂函数 | 作用 |
|---|---|
| `from_truth_cursor(ArtifactReportScopeRef report_scope_ref, ArtifactTruthCursor source_cursor)` | 从 truth 位置生成报告视图骨架 |

| 禁止事项 | 说明 |
|---|---|
| 不决定正式业务状态 | report 只是只读输出 |
| 不把下游导出结果回写主线 | export material 不替代 report source |

---

## B19. `ArtifactReconciliationReport`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived maintenance and handoff preparation` |
| 对象类型 | projection / report |
| 结构责任 | 汇总主线 truth、mirror、preview、report 和 handoff 之间的对账结果 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `report_ref` | `ArtifactReconciliationReportRef` | 对账报告身份 |
| `reconciliation_scope_ref` | `ArtifactReconciliationScopeRef` | 对账覆盖范围 |
| `reconciliation_state` | `ArtifactReconciliationState` | 对账结果状态 |
| `finding_count` | `ArtifactReconciliationFindingCount` | 对账发现数量 |
| `source_cursor` | `ArtifactTruthCursor` | 对账基于的 truth 位置 |

| 状态 | 作用 |
|---|---|
| `Clean` / `GapDetected` / `Stale` / `Failed` | 无缺口、发现缺口、报告过期和对账失败 |

| 成员函数 | 作用 |
|---|---|
| `has_gap()` | 判断是否存在对账缺口 |
| `needs_refresh()` | 判断是否需要重新对账 |

| 工厂函数 | 作用 |
|---|---|
| `from_scope(ArtifactReconciliationScopeRef reconciliation_scope_ref, ArtifactTruthCursor source_cursor)` | 从指定范围和 truth 位置构造对账报告 |

| 禁止事项 | 说明 |
|---|---|
| 不自动修复主线 truth | 对账只能报告问题,不能隐式修复 |
| 不把失败解释成 truth 失败 | reconciliation 失败与核心同步失败必须分离 |
