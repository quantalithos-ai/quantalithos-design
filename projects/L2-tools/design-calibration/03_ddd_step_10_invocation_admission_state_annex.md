# Step 10.3 状态族附录: 调用受理

> 状态: completed / pass
> Canonical inputs: Step 6 invocation/admission annex; Step 9 CF-08/09/11, IF-03, QF-04/05

## 1. `ContextSufficiency`

| 状态 | 作用 | 触发 | 后续 |
|---|---|---|---|
| `Sufficient` | required caller/actor/correlation/context refs present and attributable | `InvocationContextRefs::from_formal_context` / CF-08 | canonicalize and admission evaluation |
| `Degraded` | non-blocking ref missing/stale but definition permits continuation | same factory | canonicalize; gap visible |
| `Insufficient` | blocking ref missing or forbidden body present | same factory | canonicalize conservative frame, admission rejected/unavailable |

These are immutable construction classifications; no late ref mutates the original context.

## 2. `AdmissionState`

```text
[SubmitToolInvocation]
  -> Admitted
  -> AwaitingPrecondition
  -> Rejected
  -> Unavailable
```

| 状态 | 作用 | 终态 | 允许操作 |
|---|---|---:|---|
| `Admitted` | 可进入适用的执行前置判断。 | 是（事实） | read / precondition evaluation |
| `AwaitingPrecondition` | 合同内调用成立，但需正式 precondition。 | 是（事实） | read / named precondition flow |
| `Rejected` | 合同、Binding 或 context 不满足。 | 是 | read; create no-execution outcome |
| `Unavailable` | 必需 source/contract 当前不可用。 | 是 | read; create no-execution unavailable |

| From | To | 触发函数 / flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法错误 |
|---|---|---|---|---|---|---|
| request | `Admitted` | `InvocationAdmission::admit(...)` / CF-08 | active contract; canonical intent supported; context sufficient/degraded allowed; no applicable external precondition | immutable admission fact | save invocation + admission + stored result; no external call | `InvalidInput` / `InvalidStateTransition` |
| request | `AwaitingPrecondition` | `await_precondition(...)` / CF-08 | definition requirement applies authorization/Sandbox; context not rejected | immutable fact | save invocation/admission; result exposes awaiting; no external call yet | `InvalidStateTransition` |
| request | `Rejected` | `reject(...)` / CF-08/09 | deterministic contract/context/binding failure | immutable fact | same UoW creates `ToolInvocationOutcome::NoExecutionRejected` + audit + replay | `InvalidStateTransition` |
| request | `Unavailable` | `unavailable(...)` / CF-08/09 | required formal source unavailable/unverifiable; no positive fallback | immutable fact | same UoW creates `NoExecutionUnavailable` + gap/audit + replay | `InvalidStateTransition` |

There is no `AwaitingPrecondition -> Admitted` mutation. A later command creates new
authorization/readiness assessment and a separate handoff fact; the original admission remains a
historical decision.

## 3. Stop review and tests

| 审查项 | 结论 |
|---|---|
| context classification has a single factory | pass |
| admission states match Step 6 and Step 8 DTOs | pass |
| no-execution outcome is linked but not merged | pass |
| late external material cannot flip admission | pass |
| tests | sufficient/degraded/insufficient; unsupported intent; active/retired contract; bound missing assessment; awaiting precondition; reject/unavailable atomic outcome; duplicate and digest conflict; terminal re-admission rejected |

```text
state_family = invocation_admission
stop_review = pass
```
