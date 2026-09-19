# Step 9. 逐接口定义函数级处理流

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 9  
> 回填章节：未来正式 `03-详细设计.md` §8  
> 粒度参考：`projects/L1-governance/design-calibration/03_ddd_step_09_function_flows.md`  
> 状态：`done / pass / self_reviewed`

## 1. 目标、输入与批次

本 Step 将 Step 8 的 5 Command、16 Query 和 1 conditional consumer 逐一绑定到 Step 6 对象函数、Step 7 port、状态副作用、错误与测试切口。L1-governance 的每接口停审方法被保留，但服务端 transaction/repository/outbox/audit/job 模板不适用于 browser Console。

| 批次 | 内容 | 状态 |
|---|---|---|
| 9.0 | shared flow discipline 与总表 | done |
| 9.1 | 5 Command flows | done |
| 9.2 | 8 core Query flows | done |
| 9.3 | 8 management topic Query flows | done |
| 9.4 | conditional invalidation flow | done / disabled-until-contract |
| 9.5 | 跨 flow 审计 | done |

所有 flow 遵守：formal read 在 local state write 之前完成并被校验；local immutable replace 不是 owner transaction；唯一 owner side effect 是 `OwnerCommandPort.submit`；取消后的 owner outcome 不确定时进入 unknown；Query no-write；diagnostic/focus/presentation failure 不改变业务结果。不存在 UnitOfWork、DB transaction、repository save、outbox、projection、worker 或 job。

## 2. Flow 总表

| Flow | 协议 | 入口函数 | 主要边界 | local 状态变化 | 测试切口 |
|---|---|---|---|---|---|
| context switch | `RequestAccessContextSwitch` | `requestAccessContextSwitch(request, signal)` | formal resolve + local replace | context/navigation/state 收紧/替换 | verified、revoked、cancelled |
| preference save | `SaveClientPreference` | `saveClientPreference(request)` | carrier replace | typed preference/window | unsafe patch、scope mismatch |
| draft discard | `DiscardDraftIntent` | `discardDraft(request)` | pure transition + carrier replace | draft→discarded | legal/illegal transition |
| controlled submit | `SubmitControlledIntent` | `submitControlledIntent(request, signal)` | owner delegate-write | request phase only | receipt/result/ambiguous/cancel |
| recovery action | `ApplyRecoveryAction` | `applyRecoveryAction(request, signal)` | selected narrow port | scoped local result | each action + blocked |
| resolve context | `ResolveAccessContext` | `resolveAccessContext(request, signal)` | formal read | none inside Query | all lifecycle/error branches |
| navigation visibility | `GetNavigationVisibility` | `getNavigationVisibility(request, signal)` | formal read | none | visible/restricted/unknown |
| owner view | `QueryOwnerView` | `queryOwnerView(request, signal)` | formal read + pure mapping | none | material/empty/partial/error |
| source status | `GetSourceStatus` | `getSourceStatus(request)` | pure mapping | none | axes parity/malformed |
| safe link | `GetSafeLink` | `getSafeLink(request, signal)` | formal read | none | current/revoked/cancelled |
| request presentation | `GetRequestPresentation` | `getRequestPresentation(request)` | scoped carrier read | none | found/missing/scope error |
| reconciliation | `ReconcileRequestResult` | `reconcileRequestResult(request, signal)` | formal read | none | pending/terminal/unknown |
| activation | `GetTopicActivation` | `getTopicActivation(request, signal)` | formal read + pure map | none | all five postures |
| topic composition ×8 | `Query*Topic` | `queryManagementTopic(request, signal)` | per-owner formal reads | none inside Query | each owner partition |
| invalidation | `ConsumeSdkInvalidationHint` | `consumeSdkInvalidationHint(input, signal)` | optional SDK read + local tighten | scoped invalidation | disabled/scope/duplicate |

## 3. Shared execution template

```text
[Application-local protocol entry]
  | call validateMetadata(ConsoleOperationMetadata metadata)
  | call assertContextAndScope(...)
  v
[Guard / typed mapper]
  | call Step 6 pure function or Step 7 guard port
  v
[Narrow port]
  | formal read / owner delegate-write / host effect / carrier operation
  v
[Outcome mapper]
  | preserve blocked / unavailable / unknown / cancelled
  | local immutable replace only when the protocol permits it
  v
[Presentation]
  | optional diagnostic/focus; failure isolated
```

```ts
// [QueryNoWriteGuard.assertQueryReadOnly(QueryIntent intent)]
// Query entry rejects any effect other than read-local/read-formal/presentation.
const guard = assertQueryReadOnly(request.input.intent);
```

Transaction boundary：每个 local carrier `replace` 是一次单记录、scope-checked operation；它不与 formal SDK call 构成分布式事务。formal call 成功但 local replace 失败时，保留 formal observation/ref 只作为本次返回，标记 local carrier failure，不反向补偿 owner。delegated command outcome ambiguous 时不得再次 submit；只能显式 reconciliation。

## 4. Command flows

### 4.1 `RequestAccessContextSwitchFlow`

```text
[requestAccessContextSwitch]
  | validate metadata/current/target same session
  | call AccessContextResolutionPort.resolve(AccessContextQueryInput input, AbortSignal signal)
  v
[formal observation]
  | call clearClientStateForContextChange(ClientStateRecord state, AccessContext next)
  | call replaceShellContext(ConsoleSessionShell shell, AccessContext next, ClientStateRecord state)
  | call EntryPresentationPort.present(ConsoleSessionShell shell, AbortSignal signal)
```

失败：missing surface/transport/cancel→旧 shell 只收紧为 restricted/unknown；revoked/expired observation 清理 sensitive navigation/draft/request；presentation 失败不撤销已完成的 local safe cleanup。测试：verified switch、restricted switch、scope mismatch、cancel before/after formal result、host failure。

### 4.2 `SaveClientPreferenceFlow`

```text
[saveClientPreference]
  | call StateScopeGuardPort.assertMatches(StateScopeBinding expected, StateScopeBinding actual)
  | validate patch contains only filter/window/topic local fields
  | build immutable ClientStateRecord next
  | call ClientStateCarrierPort.replace(ClientStateRecord next, AbortSignal signal)
```

无 formal call/transaction/event。carrier unavailable 返回 blocked，不能 fallback 到 arbitrary browser storage。重复相同 patch 可返回 unchanged；不得影响 visibility、qualification、activation、source axes 或 request result。

### 4.3 `DiscardDraftIntentFlow`

```text
[discardDraft]
  | call discardDraftIntent(DraftIntent draft, NonEmptyOpaqueValue reasonKey)
  | call ClientStateCarrierPort.replace(ClientStateRecord next, AbortSignal signal)
```

editing/invalid/reviewable 可 discard；submitted/discarded 非法。replace 失败时不能声称已持久保存，但返回构造结果供当前 page 收紧；不调用 owner command。

### 4.4 `SubmitControlledIntentFlow`

```text
[submitControlledIntent]
  | call CommandQualificationPort.check(DraftIntent draft, DelegationQualificationObservation qualification)
  | call createSubmittedRequest(LocalReference requestRef, LocalReference contextRef, CommandReference command)
  | call OwnerCommandPort.submit(ControlledCommandInput input, ConsolePortCallOptions options)
  v
[CommandObservationMapper]
  | call CommandObservationMapper.map(RequestPresentation request, OwnerCommandObservation observation)
  | call ClientStateCarrierPort.replace(ClientStateRecord next, AbortSignal signal)
```

exact owner input mapper 缺失时在 submit 前返回 `missing-formal-surface`。`receipt`→accepted/pending，formal result→confirmed/rejected/unknown，ambiguous/cancel-after-dispatch→unknown。carrier replace 失败不能重发 command；formal outcome 仍随响应返回并给 reconciliation 恢复方向。测试：guard blocked、missing exact surface、receipt、formal terminal、transport before dispatch、cancel/timeout after possible dispatch、state carrier failure。

### 4.5 `ApplyRecoveryActionFlow`

```text
[applyRecoveryAction]
  | call RecoveryActionGuardPort.assertAllowed(RecoveryPlan plan, RecoveryAction action, AccessContext context, RequestPresentation request?)
  | exactly one of:
  |   call RecoveryExecutionPort.requery(RecoveryRequeryInput input, options)
  |   call RecoveryExecutionPort.revalidateContext(RecoveryPlan plan, AccessContext context, signal)
  |   call RecoveryExecutionPort.reconcileResult(RecoveryPlan plan, ResultReconciliationInput input, options)
  |   call RecoveryExecutionPort.keepDraft(RecoveryPlan plan, DraftIntent draft)
  |   call RecoveryExecutionPort.exit(RecoveryPlan plan, LocalReference sessionRef, signal)
  | call PageAccessibilityMapperPort.map(...)
  | optional call FocusAnnouncementPort.focus/announce(...)
```

每次调用恰好一个 action，无 generic retry、loop 或 parallel fan-out。a11y failure 只产生安全 diagnostic，不改恢复结果。`retry-command` 即使出现在 `UnknownNextAction` 也不得由本 flow 执行，除非未来 formal replay contract 修订 Step 8/13。

### 4.6 Command flow 停审

| Flow | DTO 构造 | Step 6 函数 | Step 7 port | side effect | 结论 |
|---|---|---|---|---|---|
| context switch | closed | cleanup/replace shell | context/state/presentation | local only | pass |
| preference | closed | state immutable replace | scope/carrier | local only | pass with medium pending |
| discard | closed | discard draft | carrier | local only | pass |
| submit | safe shell closed; owner DTO blocked | request/result functions | qualification/command/mapper/carrier | owner delegate + local presentation | pass with exact-contract blocker |
| recovery | closed per action | recovery/a11y functions | recovery/focus/carrier | local/formal read only | pass |

## 5. Core Query flows

### 5.1 `ResolveAccessContextFlow`

Validate session/context refs → `AccessContextResolutionPort.resolve` → validate observation refs/lifecycle → map port error to `QuerySurface`. Query does not install the context; context switch/bootstrap caller does so explicitly. Tests cover unresolved/verified/restricted/expired/revoked/conflict/unknown and cancellation.

### 5.2 `GetNavigationVisibilityFlow`

Validate topic/context → `VisibilityQualificationPort.resolveVisibility` → ensure topic/context same observation → return exact posture. No route/menu/flag fallback; no navigation mutation. Tests cover visible/restricted/disabled/unknown/unavailable and mismatched topic.

### 5.3 `QueryOwnerViewFlow`

```text
[queryOwnerView]
  | call assertQueryReadOnly(QueryIntent intent)
  | call DisclosureEvaluationPort.evaluate(DisclosureGuard guard, AccessContext context, QualificationBoundary qualification)
  | call OwnerQueryPort.query(OwnerQueryInput input, ConsolePortCallOptions options)
  | material -> call OwnerSafeMaterialMapper.map(material, snapshotRef, contextRef)
  |          -> call SourceStatusMapper.map(material)
  |          -> call OwnerViewCompositionPort.compose(view, snapshot)
  | empty/blocked/unavailable/unknown -> preserve branch
  | optional call applyClientFilter / local ClientPageWindow
```

Snapshot ref must come from `LocalReferenceSourcePort`, never time/random/owner id. Filtering/window only apply after safe mapping. Any forbidden body aborts construction. No cache write/refresh/projection repair.

### 5.4 `GetSourceStatusFlow`

Validate snapshot source/status owner equality → `SourceStatusMapper.map` or return existing validated axes → never aggregate to health/compliance/readiness. It is pure and no-write. Tests cover each axis combination, owner mismatch, missing axis and not-covered semantics.

### 5.5 `GetSafeLinkFlow`

Validate intent context and current target → `SafeLinkPort.revalidate` → return typed target or blocked/unknown. Navigation occurs only in a later guarded host action. No URL is returned or persisted.

### 5.6 `GetRequestPresentationFlow`

`StateScopeGuardPort.assertMatches` → `ClientStateCarrierPort.load` → locate exact local request ref in same context → value/empty/blocked/unavailable. Missing is local empty, not owner not-found; no reconciliation or command is triggered.

### 5.7 `ReconcileRequestResultFlow`

Validate request phase/context/reconciliation ref → `ResultReconciliationPort.reconcile` → return formal `ResultReference`. Caller may later call `applyFormalResult` and carrier replace. No command submit/replay; cancellation/timeout remains unknown.

### 5.8 `GetTopicActivationFlow`

`TopicActivationPort.observe` → `TopicActivationMappingPort.map` → enforce descriptor owner membership and all six facets → return pending/read-only/partial/active/blocked. Active requires formal capability and current facets; no page/flag/adapter existence shortcut.

### 5.9 Core Query stop review

All eight flows have typed entries, exact Step 7 calls, explicit empty/blocked/unavailable/unknown and no-write semantics. Owner query/page/exact fields remain blocked at the adapter seam, not guessed in the flow. Each flow has positive and negative test cuts; formal positive tests require authorized fixtures/contracts.

## 6. Management topic Query flows

Each of the eight public protocols invokes the same generic algorithm with a statically validated `TopicDescriptor`; it remains an independent flow instance with its own owner set and fixtures.

```text
[Query<Management>Topic]
  | call ResolveAccessContextFlow / validate supplied current context
  | call GetNavigationVisibilityFlow(topicRef, context)
  | for each descriptor.ownerKeys in canonical order:
  |   call GetTopicActivationFlow(topic, owner, context)
  |   if consumption posture permits read:
  |     call QueryOwnerViewFlow(owner input)
  |   preserve owner-specific blocked/unavailable/unknown
  | call TopicCompositionPort.compose(TopicCompositionInput input)
  | call TopicPageCompositionPort.compose(route, topicView, regions, bindings, focusKey)
  | call PageAccessibilityMapperPort.map(page, actionSemantics)
```

The algorithm may schedule independent reads concurrently only under Step 13 rules; aggregation is deterministic by descriptor owner order, never completion order. One partition failure does not cancel safe completed partitions, and never yields global normal.

| Public flow | required partitions | special guard/test |
|---|---|---|
| `QueryMemberManagementTopicFlow` | identity, member-service | member lifecycle/role body absent |
| `QueryProjectWorkspaceTopicFlow` | work, process, workspace | partial partitions; no projection/cursor |
| `QueryMethodAssetTopicFlow` | method-library, artifact where formally linked | read-only until command map exists |
| `QueryGovernanceControlTopicFlow` | governance, artifact | Gate/SoA/AIIA/Control result remains formal ref/view |
| `QueryObservabilityTopicFlow` | observability | metrics/audit view read-only; no threshold verdict |
| `QueryCapabilityHubTopicFlow` | capability-hub | no registration/readiness inference |
| `QueryArchiveTopicFlow` | archive | no archive/restore command |
| `QuerySandboxTopicFlow` | sandbox | no run/start/readiness inference |

Per-flow stop review passes at safe skeleton level. Positive owner calls remain pending where exact formal contract/activation is absent; expected outcome there is pending/blocked, not fabricated success.

## 7. Conditional invalidation flow

```text
[consumeSdkInvalidationHint]
  | call SdkInvalidationPort.observe(SdkInvalidationReadInput input, options)
  | disabled/pending-contract -> return disabled; no state write
  | observed -> validate formal contract/source/scope/context
  | call SdkInvalidationMapperPort.map(observation, markerRef)
  | call ClientStateCarrierPort.invalidate(InvalidationMarker marker, signal)
```

Current executable design branch is only disabled/pending-contract. Event id/schema/dedup/order/replay are unresolved, so observed cannot be bound to a production adapter. If later activated, invalidation is monotonic/local: repeated identical observation may repeat a tighten operation with the same result; no cursor, receipt store or owner state transition is created. Malformed/forbidden payload is rejected without preserving body.

## 8. Cross-flow audit

| Audit | Conclusion | Detail |
|---|---|---|
| protocol coverage | pass | all 5 Commands, 16 Queries, 1 consumer mapped |
| function existence | pass | every called function/port is from Step 6/7; no repository/UoW invented |
| transaction boundary | pass | local carrier operation separated from formal read/write; no fake distributed transaction |
| query no-write | pass | composition/installation occurs in explicit caller Command/page coordinator |
| owner side effect | pass | only submit flow; ambiguous prevents replay |
| state trigger | pass | Step 10 candidates named for context/navigation/draft/request/activation/degradation/state/shell |
| event/outbox/audit | not-applicable | no Console business event; diagnostic is isolated |
| concurrency/order | deferred with input | deterministic topic aggregation and stale-result rejection handed to Step 13 |
| error/recovery | pass to Step 12 | every branch has typed posture; exact taxonomy remains next |
| test cuts | pass | per-flow positive/negative/cancel/scope cuts recorded; no result claimed |
| phase boundary | pass | exact adapters remain blocked; no later framework/config/test artifact assumed |

持续 blocker与 Step 8 相同，尤其 exact owner contract、reconciliation/idempotency、invalidation envelope、state medium 和 host/framework binding。Step 9 `done/pass/self_reviewed`；正式 03 未修改；允许更新 flow/ledger 后进入 Step 10。没有实现、测试执行、commit 或 readiness 声明。
