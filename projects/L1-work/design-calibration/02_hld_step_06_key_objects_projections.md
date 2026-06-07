# Step 6 附录 B2. Projection / Read Model 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> Projection 只服务读取、展示、搜索和对账,不得成为第二 truth。

---

## B10. `ProjectBoardView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived consumption support` |
| 对象类型 | projection / read model |
| 结构责任 | 提供项目看板式只读消费视图 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `project_id` | `ProjectId` | 视图所属项目 |
| `work_cards` | `WorkCardSummarySet` | 看板卡片摘要 |
| `view_state` | `DerivedWorkViewState` | 新鲜度和重建状态 |

| 成员函数 | 作用 |
|---|---|
| `filter_by_member(ProjectMemberRef member_ref)` | 只读筛选成员工作 |
| `mark_stale(WorkTruthCursor cursor)` | 标记视图过期 |

| 工厂函数 | 作用 |
|---|---|
| `from_truth(ProjectWorkTruthSnapshot snapshot)` | 从 Work truth 摘要重建 |

禁止事项:不得成为 Project、WorkItem 或 Iteration 的第二 truth。

---

## B11. `MemberWorkView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived consumption support` |
| 对象类型 | projection / read model |
| 结构责任 | 提供成员维度的正式工作只读视图 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `member_ref` | `ProjectMemberRef` | 视图所属项目成员 |
| `assigned_work_refs` | `FormalWorkRefSet` | 成员承担工作 |
| `view_state` | `DerivedWorkViewState` | 新鲜度和重建状态 |

| 成员函数 | 作用 |
|---|---|
| `contains(FormalWorkRef work_ref)` | 判断成员视图是否包含工作 |
| `mark_stale(WorkTruthCursor cursor)` | 标记视图过期 |

| 工厂函数 | 作用 |
|---|---|
| `from_truth(ProjectMemberTruthSummary member, ProjectWorkTruthSnapshot snapshot)` | 从成员摘要和 truth 摘要重建 |

禁止事项:不得替代 ProjectMember truth 或成员权限裁决。

---

## B12. `IterationSummaryView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Iteration commitment` |
| 对象类型 | projection / read model |
| 结构责任 | 提供 Iteration 承诺范围和完成摘要 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `iteration_id` | `IterationId` | 所属 Iteration |
| `committed_refs` | `FormalWorkRefSet` | 承诺工作集合 |
| `summary_state` | `DerivedWorkViewState` | 新鲜度和重建状态 |

| 成员函数 | 作用 |
|---|---|
| `summarize_progress()` | 生成只读进展摘要 |
| `mark_stale(WorkTruthCursor cursor)` | 标记摘要过期 |

| 工厂函数 | 作用 |
|---|---|
| `from_truth(IterationTruthSummary iteration, ProjectWorkTruthSnapshot snapshot)` | 从 Iteration / commitment 摘要和 formal work 摘要重建 |

禁止事项:不得改变 IterationCommitment。

---

## B13. `WorkSearchProjection`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived consumption support` |
| 对象类型 | projection / index |
| 结构责任 | 提供正式工作搜索和筛选索引 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `project_id` | `ProjectId` | 搜索范围 |
| `indexed_work_refs` | `FormalWorkRefSet` | 已索引正式工作 |
| `index_state` | `DerivedWorkViewState` | 索引新鲜度 |

| 成员函数 | 作用 |
|---|---|
| `query(WorkSearchCriteria criteria)` | 执行只读搜索 |
| `mark_rebuilding(WorkTruthCursor cursor)` | 标记重建中 |

| 工厂函数 | 作用 |
|---|---|
| `from_truth(ProjectWorkTruthSnapshot snapshot)` | 从 truth 重建索引 |

禁止事项:不得通过搜索结果反写正式工作状态。

---

## B14. `ReconciliationReport`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived consumption support` |
| 对象类型 | maintenance report |
| 结构责任 | 表达 truth、projection、outbox 和外部引用之间的对账结果 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `report_id` | `ReconciliationReportId` | 对账报告身份 |
| `scope_ref` | `WorkReconciliationScopeRef` | 对账范围 |
| `result_state` | `ReconciliationResultState` | 对账结果状态 |

| 成员函数 | 作用 |
|---|---|
| `has_drift()` | 判断是否存在漂移 |
| `requires_rebuild()` | 判断是否需要派生重建 |

| 工厂函数 | 作用 |
|---|---|
| `from_check(WorkReconciliationCheck check)` | 从对账检查形成报告 |

禁止事项:不得用对账报告直接修正业务 truth。
