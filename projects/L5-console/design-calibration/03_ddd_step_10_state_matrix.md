# Step 10. 状态机与转换矩阵

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 10  
> 回填章节：未来正式 `03-详细设计.md` §9  
> 粒度参考：`projects/L1-governance/design-calibration/03_ddd_step_10_state_matrix.md`  
> 状态：`done / pass / self_reviewed`

## 1. 目标与统一规则

本 Step 将 Step 6 的 discriminated unions、Step 9 flow trigger 和非法迁移闭成逐主语矩阵。Console 只有客户端交互/消费状态，不把 owner 的成员、项目、流程、治理、制品、Workspace、能力、观测、归档或 Sandbox 状态机复制进来。

统一规则：状态名必须逐字使用 Step 6 名称；本地函数只能保持或收紧 formal-derived 状态；positive recovery 只来自新的 formal observation；非法迁移返回 `invalid-state-combination` 或 `consistency-defect`，不得静默 no-op（明确幂等 tightening 除外）；Query 不推进状态；diagnostic/presentation success 不推进业务状态。

## 2. 状态主语筛选与批次

| 候选主语 | 进入矩阵 | 状态族 | 原因 |
|---|---|---|---|
| `AccessContext` | yes | context lifecycle | 有明确 union、flow 读取/替换 |
| `QualificationBoundary` / `TopicVisibility` | yes | formal-derived posture | 有只收紧/正式恢复规则 |
| `NavigationState` | yes | local selection | 有 select/clear 生命周期 |
| `SourceStatusAxes` / snapshot validity | yes | source/reference | flow 必须保真/失效 |
| `DraftIntent` | yes | local lifecycle | 有编辑、校验、提交、丢弃 |
| `RequestPresentation` / `ResultReference` | yes | request/result | formal observation 驱动 |
| `TopicActivationState` | yes | activation posture | formal facet 驱动、local tightening |
| `DegradationState` / `RecoveryPlan` | yes | recovery | 局部降级及显式动作 |
| `ClientStateRecord` / carrier outcome | yes | local carrier | load/replace/invalidate/clear |
| `ConsoleSessionShell` | yes | entry disposition | bootstrap/present/restrict/close |
| `AccessibilityState` / diagnostic outcome | yes, compact | technical presentation | flow 读取/更新但不影响业务状态 |
| refs、DTO wrappers、page/region/action model | no | value/view | 无独立生命周期 |
| owner business status | no | external truth | 只读安全映射，非 Console 状态机 |
| retry counter/cache/lock | no | implementation detail | Step 6 未定义，不得硬造 |

| 批次 | 状态机 | 状态 | 
|---|---|---|
| 10.1 | context/qualification/visibility/navigation | done |
| 10.2 | source axes/snapshot | done |
| 10.3 | draft/request/result | done |
| 10.4 | topic activation/degradation/recovery | done |
| 10.5 | client carrier/shell/a11y/diagnostic | done |
| 10.6 | 跨状态机审计 | done |

## 3. Context lifecycle

```text
unresolved --formal resolve--> verified / restricted / unknown
verified   --local/formal tighten--> restricted
verified/restricted --formal invalidate--> expired / revoked / conflict / unknown
restricted/expired/revoked/conflict/unknown --new formal observation--> verified / restricted
```

| From | To | 触发函数/flow | 前置条件 | 副作用 | 非法时 |
|---|---|---|---|---|---|
| factory | `unresolved` | `createUnresolvedAccessContext` | local context ref | no formal refs | construction violation |
| `unresolved` | `verified/restricted` | `createResolvedAccessContext` / Resolve flow | complete current actor/scope/visibility refs | new immutable context | malformed-safe-material |
| `verified` | `restricted` | `restrictAccessContext` | same context/current visibility | disclosure only tightens | consistency-defect |
| `verified/restricted` | `expired/revoked/conflict/unknown` | `invalidateAccessContext` | formal hint/result or ambiguity | previous refs unusable; cleanup | invalid-state-combination |
| any non-current | `verified/restricted` | context revalidation/switch flow | new complete formal observation | replace context; recompose safely | context-not-current |

Stop review：all variants/functions exist；revoked never locally returns verified；route/cache/state load cannot trigger recovery；tests cover every invalidation and formal recovery.

## 4. Qualification, visibility and navigation

### 4.1 Qualification/visibility tightening

```text
qualified -> restricted / not-qualified / unknown / unavailable
visible   -> restricted / disabled / unknown / unavailable
any conservative posture --new formal observation only--> qualified / visible
```

| Subject | Local allowed transition | Formal allowed transition | Illegal shortcut |
|---|---|---|---|
| qualification | `qualified→non-qualified posture`; conservative→more conservative | any→exact new formal posture | local role/menu/flag→qualified |
| visibility | `visible→restricted/disabled/unknown/unavailable`; conservative tightening | any→new formal visible/conservative | route/page exists→visible |
| disclosure | present-safe-fields→minimal-shell/blocked | recompute from new formal context/qualification | local safe-looking payload→present-safe-fields |

### 4.2 Navigation state

```text
empty --guarded select--> selected
selected --visibility tighten/context invalidation--> empty or restricted selection
selected --guarded select--> another selected entry
any --explicit cleanup--> empty
```

| From | To | Trigger | Preconditions | Side effect | Illegal error |
|---|---|---|---|---|---|
| factory | empty | `createEmptyNavigationState` | none | empty history | none |
| empty/selected | selected | `selectNavigationEntry` | route shape valid; topic visibility permits presentation | update route/entry/topic/back refs | invalid-state-combination |
| selected | restricted/empty | `applyNavigationVisibility` | same topic formal posture tighter | remove unsafe selection/history | consistency-defect |
| any | empty | `clearSensitiveNavigation` | context change/logout/revocation | clear all sensitive refs | none (idempotent) |

Stop review：visibility and navigation stay distinct；navigation cannot elevate visibility；host navigation success has no state authority.

## 5. Source axes and snapshot validity

Each axis is independent; there is no combined `healthy/ready` state machine.

| Axis | Values | Local transitions | Positive transition authority |
|---|---|---|---|
| freshness | fresh/stale/expired/unknown | fresh→stale/expired/unknown; stale→expired/unknown | new formal material only |
| coverage | complete/partial/missing; not-covered independent | complete→partial/missing; partial→missing | formal result only; not-covered requires formal mapping |
| availability | available/degraded/unavailable/unknown | available→degraded/unavailable/unknown | formal read only |
| consistency | coherent/conflict/unknown | coherent→conflict/unknown | new formal material only |
| ref validity | current/stale/invalidated/revoked/unknown | current→all conservative; stale→invalidated/revoked/unknown | new formal ref only |

```text
[formal material] -> snapshot(current axes)
snapshot --local/formal invalidation--> stale/invalidated/revoked/unknown
snapshot --new formal query result--> new snapshot (never mutate old into current)
```

Illegal: cache hit/render success/timer→fresh/current/complete/available/coherent; empty local array→formal empty; conflict→pick a source. Errors are `invalid-state-combination` or `malformed-safe-material`. Tests cover every axis independently and cross-axis preservation.

## 6. Draft lifecycle

```text
editing <--> invalid
editing/invalid -> reviewable
reviewable -> editing / invalid / submitted / discarded
editing/invalid -> discarded
submitted (terminal for draft)
discarded (terminal)
```

| From | To | Trigger | Preconditions | Side effect | Illegal error |
|---|---|---|---|---|---|
| factory | editing | `createDraftIntent` | safe typed fields/context/target | create local draft | construction violation |
| editing/invalid/reviewable | editing | `editDraftIntent` | no submitted/discarded | replace fields; issues cleared/rechecked | invalid-state-combination |
| editing/invalid/reviewable | invalid | `applyDraftValidation` | non-empty client issues | attach issues | invalid-state-combination |
| editing/invalid/reviewable | reviewable | `applyDraftValidation` | zero client issues | no owner-valid implication | invalid-state-combination |
| reviewable | submitted | `markDraftSubmitted` | request ref allocated and submit flow invoked | bind request ref | invalid-state-combination |
| editing/invalid/reviewable | discarded | `discardDraftIntent` | explicit discard/context cleanup | no owner side effect | invalid-state-combination |

Stop review：reviewable is not authorized/owner-valid；submitted does not mean accepted；terminal branches cannot be edited or revived.

## 7. Request and formal result

```text
submitted --formal receipt--> accepted
submitted/accepted --formal pending result--> pending
submitted/accepted/pending/unknown --formal result--> confirmed / rejected / unknown
submitted/accepted/pending --ambiguous/cancel--> unknown
unknown --formal reconciliation--> pending / confirmed / rejected / unknown
```

| From | To | Trigger | Preconditions | Side effect | Illegal error |
|---|---|---|---|---|---|
| factory | submitted | `createSubmittedRequest` | current command, same draft/context/attempt | local request | construction violation |
| submitted/unknown | accepted | `applyFormalReceipt` | formal same-owner receipt | attach receipt | consistency-defect |
| any nonterminal | pending/confirmed/rejected/unknown | `applyFormalResult` | formal result same owner/context/request | attach result; phase mirrors state | consistency-defect |
| submitted/accepted/pending | unknown | `markRequestUnknown` | ambiguous/cancel/timeout/missing semantics | keep safe receipt/ref | none |
| unknown/pending/accepted/submitted | formal mapped state | reconciliation flow + `applyFormalResult` | formal reconciliation observation | no command replay | reconciliation-unavailable |

`confirmed/rejected` are presentation terminal for the same result observation; only a newer formal reconciliation may replace a previously `unknown/pending` branch. Toast, HTTP success, receipt, page refresh or state carrier load are illegal triggers. Result state (`pending/confirmed/rejected/unknown`) is read-only and must agree with request phase.

## 8. Topic activation

```text
pending --formal facets--> read-only / partial / active / blocked
read-only/partial/active --local/formal tighten--> partial / pending / blocked
blocked/pending/partial/read-only --new formal facets--> read-only / partial / active / blocked
```

| From | To | Trigger | Preconditions | Side effect | Illegal error |
|---|---|---|---|---|---|
| no observation | pending | `evaluateOwnerActivation` | no formal surface | owner partition pending | none |
| any | read-only | evaluate formal observation | read mode + required facets satisfied | capability required | malformed-safe-material |
| any | partial | formal partial or `tightenTopicActivation` | capability for positive partial branch | actions disabled/partition marked | consistency-defect |
| any | active | evaluate formal observation | controlled-command; six facets satisfied; verified context | capability required | invalid-state-combination |
| any | blocked | formal missing/unknown facet or local tightening | safe reason optional | hide/disable actions | none |

Local tightening cannot yield active/read-only. Restricted context cannot yield active. `active` is contract-consumption posture, never service/system/readiness. Tests exhaust mode×facet×context matrix.

## 9. Degradation and RecoveryPlan

`DegradationState` exists only when at least one axis is non-normal. It is replaced, not globally aggregated.

```text
none --non-normal observation/invalidation--> degradation
degradation --local tighten--> more conservative degradation
degradation --new formal observation--> revised degradation / none
degradation -> RecoveryPlan -> one explicit action -> new formal/local observation
```

| Transition | Trigger | Preconditions | Side effect | Illegal |
|---|---|---|---|---|
| none→degradation | `createDegradationState` | non-normal local subject axes | local presentation only | normal combination rejected |
| degradation→tighter | `tightenDegradationState` | same subject | preserve axes/reason | elevation rejected |
| degradation→revised/none | `applyFormalRecoveryObservation` | same subject new formal axes | none means recovered presentation | timer/render success rejected |
| degradation→plan | `createRecoveryPlan` | current subject/request/draft | deterministic allowed/blocked actions | missing exit/action duplication rejected |
| plan→action result | `assertRecoveryActionAllowed` + recovery flow | exact plan/context/request match | one action only | unsafe replay/stale plan blocked |

RecoveryPlan itself has no “executing/succeeded” state; it is immutable guidance. A recovery action does not prove recovery—only the resulting formal/local observation can update the subject.

## 10. Client carrier and shell

### 10.1 Carrier disposition

```text
missing --replace--> loaded
loaded --replace/invalidate--> loaded(new record)
loaded/missing --clear--> missing
any --adapter failure/cancel ambiguity--> unknown to caller; mandatory reload
scope mismatch -> blocked (never migrate implicitly)
```

Whole-record replace must use exact scope. Duplicate invalidation is idempotent tightening. There is no optimistic owner version, DB transaction or cross-session durability state. On uncertain write, caller reloads; it must not assume old or new record won.

### 10.2 Shell disposition

```text
bootstrapping -> presentable / restricted / closed
presentable -> presentable(new safe page) / restricted / closed
restricted -> restricted / presentable(new formal context + safe page) / closed
closed (terminal)
```

| From | To | Trigger | Preconditions | Side effect | Illegal error |
|---|---|---|---|---|---|
| factory | bootstrapping/restricted | `createConsoleSessionShell` | valid session/state scope | no owner readiness | construction violation |
| bootstrapping/restricted/presentable | presentable | `presentTopicPage` | page/context/state exact match and safe | replace page | consistency-defect |
| any open | restricted | `replaceShellContext` or failure cleanup | cleaned state/new context | remove old page | state-scope-mismatch |
| any open | closed | `closeConsoleSessionShell` | explicit close/logout | clear current page | none |
| closed | any open | forbidden | must create new shell/session | none | invalid-state-combination |

`presentable` remains client-only. State load cannot by itself move restricted→presentable; formal revalidation and safe page composition are required.

## 11. Accessibility and diagnostic technical states

| Subject | State values | Allowed transitions | Business-state authority |
|---|---|---|---|
| accessibility focus | valid region keys | move to another presentable region | none |
| announcement | absent / queued safe binding | queue/replace/consume by host | none |
| action semantic | enabled/disabled/hidden | recompute from same guards; local only tightens without new formal input | none |
| diagnostic availability | enabled/disabled | composition binding only | none |
| diagnostic emission | emitted/disabled/failed | result per emission; no lifecycle persistence | none |

Hidden/disabled actions must be equal across visual/keyboard/assistive channels. Focus/announcement/sink failure never changes context, qualification, visibility, request result, activation or recovery allowance.

## 12. Cross-state audit

| Audit | Conclusion |
|---|---|
| enum names match Step 6 | pass; no synonyms introduced |
| trigger functions exist | pass; all triggers reference Step 6/7/9 |
| owner/client states separated | pass; formal states are mapped read-only, local states immutable |
| illegal transitions typed | pass; construction/port consistency errors identified; Step 12 final mapping pending |
| positive state authority | pass; only new formal observation for verified/visible/fresh/current/confirmed/active |
| no global readiness | pass; axes and owner partitions remain independent |
| request/result agreement | pass; receipt/phase/result distinct; unknown no replay |
| invalidation monotonicity | pass; local state only tightens |
| a11y equivalence | pass; no second business transition path |
| terminal handling | pass; draft submitted/discarded, shell closed, confirmed/rejected are not locally reopened |
| tests | every legal edge, forbidden reverse edge and formal-only recovery has Step 16 input |

持续 blocker：exact formal schema/state mapping、invalidation ordering、state medium/concurrency、framework host binding 和 a11y support matrix。它们不改变状态红线，阻塞 positive adapter/implementation。Step 10 `done/pass/self_reviewed`；正式 03 仍关闭；允许进入 Step 11。未实现、未测试、未提交。
