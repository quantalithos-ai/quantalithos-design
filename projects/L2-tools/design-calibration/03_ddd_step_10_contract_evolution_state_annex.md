# Step 10.1 状态族附录: 合同演进

> 状态: completed / pass
> Canonical inputs: Step 6 contract-evolution annex; Step 9 CF-01~04, QF-01~02, JF-02

## 1. `ToolContractLifecycleState`

```text
[ToolContract]
  Active -> RetirementPending -> Retired
```

| 状态 | 作用 | 终态 | 允许操作 |
|---|---|---:|---|
| `Active` | 接受新的 invocation admission。 | 否 | `adopt_revision`, `request_retirement`, read |
| `RetirementPending` | 退役请求已成立，等待 impact closure。 | 否 | `complete_retirement`, read |
| `Retired` | 拒绝新 invocation，保留历史解释。 | 是 | read only |

| From | To | 触发函数 / flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法错误 |
|---|---|---|---|---|---|---|
| factory | `Active` | `ToolContract::establish(ToolId, DefinitionRevision, BindingMode, DecisionTime)` / CF-01 | tool id、first definition、explicit binding mode、clock valid；同一 UoW 无重复 identity | 写 current revision、initial mode、version | 保存 contract + first definition/evolution fact + stored result；标记受影响 D1 stale | `InvalidInput` / `UniquenessConflict` |
| `Active` | `RetirementPending` | `request_retirement(&mut self, RetirementReason)` / CF-04 phase 1 | reason 非空；loaded version 匹配；未已退役 | 写 `retirement_reason` | 保存 contract、append evolution fact、stale current views、complete replay | `InvalidStateTransition` / `VersionConflict` |
| `RetirementPending` | `Retired` | `complete_retirement(&mut self, ImpactClosureRef, DecisionTime)` / CF-04 phase 2 | closure 对应 current report、watermark 覆盖且无 blocking gap；无新 invocation fence 冲突 | 写 `retired_at`; lifecycle terminal | 保存 contract + retirement fact；一页 stale + continuation gap（如有）；replay | `InvalidStateTransition` / `UnverifiableClosure` |

禁止 `Retired -> Active`；恢复只能创建新的正式 contract/revision，不能在本状态机偷渡 Runtime reactivation。

## 2. `DefinitionRevisionState`

```text
[FormalToolDefinition]
  Candidate -> Current -> Superseded
  Candidate -> Withdrawn
  Current -> Withdrawn
```

| 状态 | 作用 | 终态 | 允许操作 |
|---|---|---:|---|
| `Candidate` | 已形式化但尚未成为 current。 | 否 | promote, withdraw |
| `Current` | 新 invocation anchor 可引用的 revision。 | 否 | supersede, withdraw |
| `Superseded` | 被新 revision 替代的历史 revision。 | 是 | read |
| `Withdrawn` | 正式撤回、不得再成为 current。 | 是 | read |

| From | To | 触发函数 / flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法错误 |
|---|---|---|---|---|---|---|
| factory | `Candidate` | `FormalToolDefinition::formalize(...)` / CF-02 | source ref `Resolved`；semantic summaries body-free；revision unique | 写 immutable candidate | 保存 definition + impact/replay as named flow | `InvalidInput` / `UnverifiableSource` |
| `Candidate` | `Current` | `promote_to_current(&mut self)` / CF-03 | active contract；compatible/verified conditional closure；expected current revision exact | candidate current | same UoW old current superseded + contract pointer + evolution fact + stale first page | `InvalidStateTransition` / `IncompatibleRevision` |
| `Current` | `Superseded` | `mark_superseded(&mut self, DefinitionRevision)` / CF-03 | replacement revision is new current and same tool | immutable old revision marked superseded | same atomic adoption UoW | `InvalidStateTransition` / `RevisionMismatch` |
| `Candidate` / `Current` | `Withdrawn` | `withdraw(&mut self, WithdrawalReason)` / named correction branch | reason, authority and version valid; no adoption in same conflicting UoW | terminal withdrawn | append evolution fact; no current pointer change for candidate; stale views only if current withdrawn | `InvalidStateTransition` / `VersionConflict` |

No `Superseded -> Current` rollback exists. Compatibility impact is a separate immutable assessment:
`Compatible` may pass guard; `ConditionallyCompatible` requires verified closure; `Incompatible` and
`Unverifiable` stop before writes.

## 3. `ExternalReferenceState` for `DefinitionSourceRef`

| State | Meaning | Construction | Permits new formalization |
|---|---|---|---:|
| `Resolved` | authority/locator/revision formally attributable. | `DefinitionSourceRef::from_authority` after source resolution | yes |
| `Stale` | source revision may no longer cover request. | new source observation / JF-02 | no |
| `Conflicting` | authority/subject/revision clues conflict. | resolver result | no |
| `Unverifiable` | formal authority or schema cannot be proven. | `L2T-UP-008` blocked branch | no |

This is a consumption snapshot. A later JF result creates a new ref/assessment and gap; it never
rewrites an existing definition or invocation anchor.

## 4. Stop review and tests

| 审查项 | 结论 |
|---|---|
| enum/variant names exactly match Step 6 | pass |
| trigger callable exists in Step 6 and flow exists in Step 9 | pass |
| current pointer, history fact and optimistic version are atomic | pass |
| illegal reverse transitions fail closed | pass |
| source blocker does not become compatible/current | pass |
| minimum tests | `establish`; duplicate identity; candidate source blocked; compatible/conditional/incompatible adoption; stale expected current; retirement closure missing/stale; terminal resurrection rejected; exact replay |

```text
state_family = contract_evolution
stop_review = pass
```
