# Step 6 附录 B2. Projection / Read Model 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> Projection / read model 只能只读、可重建、可过期,不得反写真相。

---

## B13. `GovernanceDashboardView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived maintenance and reconciliation` |
| 对象类型 | projection / read model |
| 结构责任 | 汇总治理事实状态、待裁决项、Policy / Control / Nonconformity 摘要给授权消费 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_ref` | `DerivedGovernanceViewRef` | 视图身份 |
| `scope_ref` | `GovernanceScopeRef` | dashboard 范围 |
| `source_cursor` | `GovernanceTruthCursor` | 来源 truth 位置 |
| `freshness_state` | `DerivedGovernanceViewFreshnessState` | 视图新鲜度 |

| 成员函数 | 作用 |
|---|---|
| `is_stale()` | 判断是否需要重建 |
| `covers_scope(GovernanceScopeRef scope_ref)` | 判断是否覆盖查询 scope |

| 工厂函数 | 作用 |
|---|---|
| `from_truth(GovernanceTruthSnapshot snapshot, GovernanceScopeRef scope_ref)` | 从 Governance truth 摘要构造 dashboard 视图 |

| 禁止事项 | 说明 |
|---|---|
| 不作为 truth source | dashboard 不能生成或修改治理事实 |
| 不绕过可见性 | 查询输出必须受 ReadVisibilityPolicy 约束 |

---

## B14. `DecisionSummaryView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Gate and decision management` |
| 对象类型 | projection / read model |
| 结构责任 | 提供 Gate / Decision 的只读摘要和消费状态 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_ref` | `DecisionSummaryViewRef` | 视图身份 |
| `decision_ref` | `GovernanceDecisionRef` | 对应裁决 |
| `gate_ref` | `GateRef` | 对应 Gate |
| `summary_state` | `DecisionSummaryState` | 摘要是否可读、过期或不可见 |

| 成员函数 | 作用 |
|---|---|
| `matches_decision(GovernanceDecisionRef decision_ref)` | 判断视图是否属于指定裁决 |
| `is_visible_to(ReadVisibilityPolicy policy)` | 判断是否可输出给 actor |

| 工厂函数 | 作用 |
|---|---|
| `from_decision(GovernanceDecision decision, Gate gate)` | 从已成立裁决构造摘要 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 Decision truth | 裁决状态以 GovernanceDecision 为准 |
| 不保存 evidence body | 只可包含依据引用或摘要 |

---

## B15. `PolicyEffectiveView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Policy and shared rules management` |
| 对象类型 | projection / read model |
| 结构责任 | 展示某 scope 下已生效 Policy、shared rules 和冲突状态 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_ref` | `PolicyEffectiveViewRef` | 视图身份 |
| `scope_ref` | `GovernanceScopeRef` | 生效范围 |
| `policy_refs` | `PolicyEffectiveFactRefSet` | 生效 Policy 引用 |
| `conflict_refs` | `PolicyConflictRefSet` | 相关冲突引用 |
| `freshness_state` | `DerivedGovernanceViewFreshnessState` | 视图新鲜度 |

| 成员函数 | 作用 |
|---|---|
| `contains_policy(PolicyEffectiveFactRef policy_ref)` | 判断视图是否包含某 Policy |
| `has_unresolved_conflict()` | 判断是否存在未解决冲突 |

| 工厂函数 | 作用 |
|---|---|
| `from_policy_truth(PolicyTruthSnapshot snapshot, GovernanceScopeRef scope_ref)` | 从 Policy truth 摘要构造视图 |

| 禁止事项 | 说明 |
|---|---|
| 不决定 Policy 生效 | 生效事实以 PolicyEffectiveFact 为准 |
| 不执行 Policy | Runtime / capability 只消费结论 |

---

## B16. `ControlCoverageView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Control and compliance conclusion management` |
| 对象类型 | projection / read model |
| 结构责任 | 展示 Control applicability、review、AIIA / SoA 覆盖和缺口摘要 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_ref` | `ControlCoverageViewRef` | 视图身份 |
| `context_ref` | `GovernanceContextRef` | 治理语境 |
| `control_refs` | `ControlApplicabilityRefSet` | 控制适用事实集合 |
| `coverage_state` | `ControlCoverageState` | 控制覆盖状态 |
| `freshness_state` | `DerivedGovernanceViewFreshnessState` | 视图新鲜度 |

| 状态 | 作用 |
|---|---|
| `Complete` / `GapDetected` / `PendingEvidence` / `Stale` | 覆盖完整、存在缺口、等待证据和过期 |

| 成员函数 | 作用 |
|---|---|
| `has_gap()` | 判断是否存在覆盖缺口 |
| `requires_review()` | 判断是否需要复核 |
| `covers_context(GovernanceContextRef context_ref)` | 判断是否覆盖指定语境 |

| 工厂函数 | 作用 |
|---|---|
| `from_control_truth(ControlTruthSnapshot snapshot, GovernanceContextRef context_ref)` | 从控制 truth 摘要构造覆盖视图 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 SoA 结论 | coverage view 只是摘要,不批准 SoA |
| 不保存 standard / control body | 只保存 ref 和摘要 |

---

## B17. `NonconformityStatusView`

| 项 | 内容 |
|---|---|
| 所属部分 | `Nonconformity corrective loop` |
| 对象类型 | projection / read model |
| 结构责任 | 展示不符合、纠正、复验和关闭状态摘要 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_ref` | `NonconformityStatusViewRef` | 视图身份 |
| `nonconformity_ref` | `NonconformityRef` | 对应不符合 |
| `status_state` | `NonconformityStatusViewState` | 当前摘要状态 |
| `freshness_state` | `DerivedGovernanceViewFreshnessState` | 视图新鲜度 |

| 成员函数 | 作用 |
|---|---|
| `is_open()` | 判断不符合是否仍未闭环 |
| `requires_action()` | 判断是否需要纠正动作 |
| `matches(NonconformityRef nonconformity_ref)` | 判断是否属于指定不符合 |

| 工厂函数 | 作用 |
|---|---|
| `from_nonconformity(NonconformityRecord record)` | 从不符合 truth 构造状态视图 |

| 禁止事项 | 说明 |
|---|---|
| 不关闭不符合 | 关闭必须由 NonconformityRecord 执行 |
| 不替代 corrective action | 只读展示纠正状态 |

---

## B18. `GovernanceReconciliationReport`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived maintenance and reconciliation` |
| 对象类型 | report / reconciliation read model |
| 结构责任 | 表达 Governance truth、projection、snapshot、outbox 和 handoff 的对账结果 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `report_id` | `GovernanceReconciliationReportId` | 对账报告身份 |
| `scope_ref` | `GovernanceScopeRef` | 对账范围 |
| `source_cursor` | `GovernanceTruthCursor` | 对账来源位置 |
| `finding_refs` | `GovernanceReconciliationFindingRefSet` | 对账发现集合 |
| `report_state` | `ReconciliationReportState` | 报告状态 |

| 状态 | 作用 |
|---|---|
| `Generated` / `Failed` / `Superseded` | 已生成、失败和被替代 |

| 成员函数 | 作用 |
|---|---|
| `has_blocking_findings()` | 判断是否存在阻塞发现 |
| `covers_scope(GovernanceScopeRef scope_ref)` | 判断是否覆盖范围 |
| `requires_rebuild()` | 判断是否需要触发派生重建 |

| 工厂函数 | 作用 |
|---|---|
| `from_reconciliation(GovernanceReconciliationInput input, GovernanceReconciliationFindingRefSet finding_refs)` | 从对账输入和发现构造报告 |

| 禁止事项 | 说明 |
|---|---|
| 不直接修复 truth | 报告只暴露问题和维护线索 |
| 不成为 external GRC truth | external GRC 只能消费或导出 |
