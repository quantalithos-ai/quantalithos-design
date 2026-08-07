# Step 10.2 状态族附录: Binding 与受控来源

> 状态: completed / pass
> Canonical inputs: Step 6 binding-source annex; Step 9 CF-05~07, IF-01, JF-01~02

## 1. `BindingLifecycleState`

```text
[CapabilityBinding]
  Active -> ReplacementPending -> Replaced
  Active -> Invalidated
  ReplacementPending -> Invalidated
```

| 状态 | 作用 | 终态 | 允许操作 |
|---|---|---:|---|
| `Active` | relation 可在消费时点评估。 | 否 | replace, invalidate, read |
| `ReplacementPending` | replacement intent 已写入，尚未提交新 relation。 | 否 | replace, invalidate |
| `Replaced` | 已由 successor relation 替代。 | 是 | read |
| `Invalidated` | relation 不再适用于新 consumption。 | 是 | read |

| From | To | 触发函数 / flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法错误 |
|---|---|---|---|---|---|---|
| factory | `Active` | `CapabilityBinding::declare(...)` / CF-05 | active contract；mode/ref 对称；同一 tool 无 current relation | 写 relation + version | 保存 binding + change fact；stale binding views；stored result | `InvalidBindingMode` / `UniquenessConflict` |
| `Active` | `ReplacementPending` | `begin_replacement(ExpectedVersion)` / CF-06 phase 1 | expected version exact；replacement request identity valid | 写 pending marker/version | phase-1 local claim；不调用 Hub或外部 side effect | `VersionConflict` / `InvalidStateTransition` |
| `ReplacementPending` | `Replaced` | `replace(successor_id, mode, ref)` / CF-06 phase 2 | successor ID distinct；new mode/ref symmetric；same UoW creates successor | old relation terminal + successor ref | save old/new + change fact atomically；mark views stale；replay | `InvalidStateTransition` / `DuplicateRelation` |
| `Active` / `ReplacementPending` | `Invalidated` | `invalidate(reason)` / CF-07 | typed reason；expected version | write invalidation reason | save + change fact + stale/replay | `InvalidStateTransition` / `VersionConflict` |

`ExplicitUnbound` is a `BindingMode` classification, not a lifecycle state. Empty `capability_ref`
never causes a lifecycle or assessment transition.

## 2. `BindingAssessmentState` (immutable consumption snapshot)

| State | Required symmetry | Anchor effect |
|---|---|---|
| `AcceptedBound` | active relation + matching Hub snapshot/authority/revision | may anchor bound consumption |
| `AcceptedExplicitUnbound` | active relation + explicit unbound mode | may anchor unbound mode; not authorization |
| `Missing` | required relation/snapshot absent | conservative anchor only; admission unavailable/rejected |
| `Stale` | snapshot revision/freshness not enough | no positive anchor |
| `Conflicting` | relation/authority/subject/revision mismatch | no positive anchor |
| `Unverifiable` | formal Hub authority/schema unavailable | no positive anchor |

Each assessment is created by `CapabilityBindingAssessment::assess(...)` in CF-08/IF-01/JF-01
consumption context. There is no `Accepted -> Stale` mutation; a later observation creates a new
assessment and optional `ConsistencyGap`.

| From | To | Trigger | Preconditions | Side effect | Illegal handling |
|---|---|---|---|---|---|
| no assessment | one snapshot state | `assess(binding, snapshot, time)` | binding identity and mode/ref symmetry; snapshot candidate attributable | append assessment; add basis/gap for conservative state | `DomainError::InvalidAssessmentInput` |

## 3. Hub snapshot/reference states

| Subject | State | Meaning | Current boundary |
|---|---|---|---|
| `HubControlledSnapshot.resolution_state` | `Resolved` | formal source snapshot usable for assessment | conditional on `L2T-UP-001~002`/Hub seam |
|  | `Stale` | source revision no longer covers requested consumption | append new assessment/gap |
|  | `Conflicting` | authority/subject/revision conflict | fail closed |
|  | `Unverifiable` | Hub authority/schema cannot be proven | current negative default when blocked |
| `HubCapabilityRef` resolution | same four states | typed authority/id/revision locator result | no name/inventory fallback |

## 4. Stop review and tests

| 审查项 | 结论 |
|---|---|
| relation lifecycle separate from assessment/snapshot | pass |
| explicit-unbound not inferred from null | pass |
| source state cannot mutate Binding or old anchor | pass |
| Hub positive state remains conditional | pass |
| tests | declare bound/unbound; replacement version conflict; successor symmetry; invalidated terminal; missing/stale/conflicting/unverifiable assessment; late snapshot preserves old anchor; empty-ref rejection |

```text
state_family = binding_source
stop_review = pass
```
