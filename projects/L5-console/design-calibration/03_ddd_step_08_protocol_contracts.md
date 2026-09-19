# Step 8. 定义 API / Command / Query / Event / Job 协议契约

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 8  
> 回填章节：未来正式 `03-详细设计.md` §6 / §7  
> 粒度参考：`projects/L1-governance/design-calibration/03_ddd_step_08_protocol_contracts.md`  
> 状态：`done / pass / self_reviewed`

## 1. Step 状态与事实边界

本文件只定义 planned TypeScript 客户端协议，不表示 HTTP/RPC/topic、SDK method、实现仓、源码、测试或运行结果已经存在。正式 `03-详细设计.md` 仍在 Step 19 前关闭。L1-governance 只提供“协议族→逐协议 schema→字段来源→停审→跨协议审计”的粒度，不迁入其 Governance domain、repository、outbox、projection、worker/job 或 Rust 结构。

Console 的 public surface 是 application-local typed entry；对外正式 Query/Command 仍由 `adapters` 通过 SDK/formal boundary 消费。上游 exact contract 未闭口时，协议保留 typed carrier 与 blocked outcome，不发明 route、method、field、error code、event topic 或 idempotency semantics。

## 2. 输入、批次与 SOP 回答

| 输入 | 用途 | 限制 |
|---|---|---|
| 正式 `02` §7～§9 | API 骨架、处理流和状态主语 | 不直接继承 placeholder DTO 名称为 owner schema |
| Step 6 | 对象、字段、状态、typed ref、safe payload | 不新增 owner domain object |
| Step 7 | port、调用方、实现方、错误/取消/unknown | flow 不临时发明 port |
| L1-governance Step 8 | public surface 闭环和逐族停审深度 | 不迁入服务端协议类别 |

| 批次 | 协议族 | 状态 |
|---|---|---|
| 8.0 | shared metadata/result/page/error surface | done |
| 8.1 | 5 个 Command | done |
| 8.2 | 8 个核心 Query + 8 个 topic Query | done |
| 8.3 | 条件化 SDK invalidation consumer | done / disabled-until-contract |
| 8.4 | Outbound Event / Operations Job 适用性 | done / not-applicable |
| 8.5 | 字段来源、二级类型、protocol-to-flow 总审计 | done |

SOP 回答：本轮共定义 5 Command、16 Query、1 个条件化 Inbound Consumer；无 Outbound Event、无 Operations Job。传输方式一律为 `application-local call` 或 `adapter→SDK/formal boundary`，没有 Console-owned HTTP/RPC/topic。actor/scope/visibility/qualification 只能来自正式 context observation；本地 session/context/request ref 只用于关联，不能充当 owner identity、version、idempotency key 或授权。Query 的 empty/blocked/unavailable/unknown 是显式 union，不从空数组或异常字符串推断。owner exact schema 缺失时必须 `missing-formal-surface`，因此本 Step 可以闭合安全协议而不能宣称 positive production adapter 已激活。

## 3. Shared protocol surface

```ts
/** Console application-local operation metadata；不含 credential 或 owner body。 */
export interface ConsoleOperationMetadata {
  readonly operationRef: LocalReference<'query' | 'request' | 'invalidation'>;
  readonly sessionRef: LocalReference<'session'>;
  readonly contextRef?: LocalReference<'context'>;
}

/** 本地 Command 的统一结果；不是 owner command receipt。 */
export type LocalCommandOutcome<T> =
  | Readonly<{kind: 'applied'; value: T}>
  | Readonly<{kind: 'blocked'; error: ConsolePortError}>
  | Readonly<{kind: 'cancelled'; error: ConsolePortError}>;

/** Query public surface；empty 只能来自 formal empty 或明确本地 missing。 */
export type QuerySurface<T> =
  | Readonly<{kind: 'value'; value: T}>
  | Readonly<{kind: 'empty'}>
  | Readonly<{kind: 'blocked'; reasonRef?: OwnerReference<'reason'>}>
  | Readonly<{kind: 'unavailable'; reasonRef?: OwnerReference<'reason'>}>
  | Readonly<{kind: 'unknown'; reasonRef?: OwnerReference<'reason'>}>;

/** 仅对已取得的安全 snapshots 做客户端窗口；不是 owner cursor。 */
export interface ClientPageSurface<T> {
  readonly items: readonly T[];
  readonly window: ClientPageWindow;
  readonly sourceStatus: readonly SourceStatusAxes[];
}
```

| shared field | 来源 | 目标 | 缺失处理 | 禁止混同 |
|---|---|---|---|---|
| `operationRef` | `LocalReferenceSourcePort.allocate` | cancel/diagnostic correlation | 入口拒绝 | owner request/idempotency/event id |
| `sessionRef` | `ConsoleSessionShell` | state/host scope | 入口拒绝 | server session/credential |
| `contextRef` | `AccessContext.contextRef` | same-context guard | protected operation blocked | actor/scope/visibility ref |
| `QuerySurface.kind` | formal adapter or explicit local result | presentation/recovery | unknown, never guessed | HTTP status/empty array |
| `ClientPageWindow` | local interaction | client-only slice | use full safe set | owner cursor/page token/version |

## 4. Protocol inventory

| 协议 | 类别 | 调用方 | 处理方 | 传输 | Step 9 flow |
|---|---|---|---|---|---|
| `RequestAccessContextSwitch` | local Command | host/page action | entry/access coordinator | local + formal read | `RequestAccessContextSwitchFlow` |
| `SaveClientPreference` | local Command | page action | state coordinator | local only | `SaveClientPreferenceFlow` |
| `DiscardDraftIntent` | local Command | intent page | intent coordinator | local only | `DiscardDraftIntentFlow` |
| `SubmitControlledIntent` | delegated Command | intent page | intent + adapter | formal owner command | `SubmitControlledIntentFlow` |
| `ApplyRecoveryAction` | local orchestration Command | recovery action | recovery coordinator | selected narrow port | `ApplyRecoveryActionFlow` |
| `ResolveAccessContext` | Query | entry/recovery | access + adapter | formal read | `ResolveAccessContextFlow` |
| `GetNavigationVisibility` | Query | navigation/features | access + adapter | formal read | `GetNavigationVisibilityFlow` |
| `QueryOwnerView` | Query | views/features | views + adapter | formal read | `QueryOwnerViewFlow` |
| `GetSourceStatus` | Query | views/recovery | views mapper | local/formal-safe read | `GetSourceStatusFlow` |
| `GetSafeLink` | Query | page/navigation | views + adapter | formal read | `GetSafeLinkFlow` |
| `GetRequestPresentation` | Query | intent/recovery | state/intent | local read | `GetRequestPresentationFlow` |
| `ReconcileRequestResult` | Query | intent/recovery | intent + adapter | formal read | `ReconcileRequestResultFlow` |
| `GetTopicActivation` | Query | features | features + adapter | formal read | `GetTopicActivationFlow` |
| `Query*Topic`（8 个） | Query family | features | topic coordinator | formal owner reads | `QueryManagementTopicFlow(topic)` |
| `ConsumeSdkInvalidationHint` | conditional consumer | SDK adapter | adapters/state | optional SDK envelope | `ConsumeSdkInvalidationHintFlow` |

## 5. Command protocols

### 5.1 `RequestAccessContextSwitch`

```ts
export interface RequestAccessContextSwitchRequest {
  readonly metadata: ConsoleOperationMetadata;
  readonly current: AccessContext;
  readonly targetContextRef?: LocalReference<'context'>;
}
export type RequestAccessContextSwitchResponse = LocalCommandOutcome<ConsoleSessionShell>;
export declare function requestAccessContextSwitch(
  request: RequestAccessContextSwitchRequest,
  signal?: AbortSignal,
): Promise<RequestAccessContextSwitchResponse>;
```

字段来源：`current` 来自当前 shell；`targetContextRef` 只能来自受控 local ref source 或正式 context observation，不从 route/label 拼接。函数调用 `AccessContextResolutionPort.resolve`，成功后调用 `replaceShellContext` 与 context-change cleanup；缺 formal surface、取消或 mismatch 保持旧 shell restricted/unknown。无 owner write、无 idempotency key、无审计事件。

### 5.2 `SaveClientPreference`

```ts
export interface ClientPreferencePatch {
  readonly topicRef?: LocalReference<'topic'>;
  readonly filter?: FilterIntent;
  readonly pageWindow?: ClientPageWindow;
}
export interface SaveClientPreferenceRequest {
  readonly metadata: ConsoleOperationMetadata;
  readonly scope: StateScopeBinding;
  readonly patch: ClientPreferencePatch;
}
export type SaveClientPreferenceResponse = LocalCommandOutcome<ClientStateRecord>;
```

只保存布局/筛选/window 等 Console-owned 状态。`patch` 不允许 role、priority、approval、readiness、owner status、credential 或 raw body；介质未闭口时只能写当前 session-volatile carrier。重复调用按 replace semantics 处理，不声明 server idempotency。

### 5.3 `DiscardDraftIntent`

```ts
export interface DiscardDraftIntentRequest {
  readonly metadata: ConsoleOperationMetadata;
  readonly draft: DraftIntent;
  readonly reasonKey: NonEmptyOpaqueValue;
}
export type DiscardDraftIntentResponse = LocalCommandOutcome<Extract<DraftIntent, {state: 'discarded'}>>;
```

只调用 `discardDraftIntent` 并替换 local state；submitted/discarded draft 的非法转换返回 `invalid-state-combination`。`reasonKey` 是批准的本地 message key，不是 owner reason/evidence；不向 owner 发 command。

### 5.4 `SubmitControlledIntent`

```ts
export interface SubmitControlledIntentRequest {
  readonly metadata: ConsoleOperationMetadata;
  readonly draft: Extract<DraftIntent, {state: 'reviewable'}>;
  readonly context: Extract<AccessContext, {lifecycleState: 'verified' | 'restricted'}>;
  readonly command: CommandReference;
  readonly qualification: Extract<DelegationQualificationObservation, {posture: 'qualified'}>;
  readonly ownerInputContractRef?: OwnerReference<'command-surface'>;
}
export type SubmitControlledIntentResponse =
  | Readonly<{kind: 'presented'; presentation: RequestPresentation}>
  | Readonly<{kind: 'blocked'; error: ConsolePortError}>;
```

`metadata.operationRef` 映射 `ControlledCommandInput.correlationRef`；它不是 owner request id。`draft.fields` 只有在 `ownerInputContractRef` 与 exact field mapper 已正式存在时才能映射 owner DTO；否则返回 `missing-formal-surface`。owner idempotency key 不在本请求中自造；若 owner SDK 将来正式提供，其字段和来源必须回退本 Step 修订。输出只接受 `OwnerCommandObservation.receipt/result/ambiguous` 的安全映射；transport success、toast 或取消不能产生 confirmed。

### 5.5 `ApplyRecoveryAction`

```ts
export interface ApplyRecoveryActionRequest {
  readonly metadata: ConsoleOperationMetadata;
  readonly plan: RecoveryPlan;
  readonly action: RecoveryAction;
  readonly context: AccessContext;
  readonly request?: RequestPresentation;
}
export interface RecoveryPresentation {
  readonly view: RecoveryViewModel;
  readonly accessibility: AccessibilityState;
  readonly ownerObservation?: OwnerQueryObservation | AccessContextObservation | ResultReference;
  readonly draft?: DraftIntent;
}
export type ApplyRecoveryActionResponse = LocalCommandOutcome<RecoveryPresentation>;
```

`RecoveryPresentation` 是 `RecoveryViewModel + AccessibilityState + optional safe value` 的组合呈现，不是新 truth object。guard 先核对 plan/action/context/request 同源，再恰好执行一次 `requery/revalidate-context/reconcile-result/keep-draft/exit`；没有 schedule/backoff/loop/automatic replay。

### 5.6 Command family 停审

| 检查 | 结论 |
|---|---|
| DTO 是否构造 Step 6 对象 | local command 字段闭合；delegated owner DTO 因 exact contract pending 明确 blocked |
| actor/metadata/idempotency | 不从 body 推导 actor；local correlation 不冒充 idempotency；owner key pending |
| 错误/取消 | typed `ConsolePortError`；side effect ambiguous 必须 unknown |
| owner truth | 只有 `OwnerCommandPort.submit` 可委托；其他 command local-only |
| 后续 flow | 五个 Command 均有 Step 9 独立 flow |

## 6. Query protocols

### 6.1 Core query schema

```ts
export interface ResolveAccessContextRequest { readonly metadata: ConsoleOperationMetadata; readonly input: AccessContextQueryInput; }
export type ResolveAccessContextResponse = QuerySurface<AccessContextObservation>;

export interface GetNavigationVisibilityRequest { readonly metadata: ConsoleOperationMetadata; readonly topicRef: LocalReference<'topic'>; readonly context: AccessContext; }
export type GetNavigationVisibilityResponse = QuerySurface<TopicVisibility>;

export interface QueryOwnerViewRequest { readonly metadata: ConsoleOperationMetadata; readonly input: OwnerQueryInput; readonly filter?: FilterIntent; readonly window?: ClientPageWindow; }
export type QueryOwnerViewResponse = QuerySurface<OwnerViewModel>;

export interface GetSourceStatusRequest { readonly metadata: ConsoleOperationMetadata; readonly snapshot: OwnerViewSnapshot; }
export type GetSourceStatusResponse = QuerySurface<SourceStatusAxes>;

export interface GetSafeLinkRequest { readonly metadata: ConsoleOperationMetadata; readonly intent: SafeLinkNavigationIntent; }
export type GetSafeLinkResponse = QuerySurface<SafeLinkReference>;

export interface GetRequestPresentationRequest { readonly metadata: ConsoleOperationMetadata; readonly requestRef: LocalReference<'request'>; readonly scope: StateScopeBinding; }
export type GetRequestPresentationResponse = QuerySurface<RequestPresentation>;

export interface ReconcileRequestResultRequest { readonly metadata: ConsoleOperationMetadata; readonly input: ResultReconciliationInput; }
export type ReconcileRequestResultResponse = QuerySurface<ResultReference>;

export interface GetTopicActivationRequest { readonly metadata: ConsoleOperationMetadata; readonly input: TopicContractReadInput; }
export type GetTopicActivationResponse = QuerySurface<TopicActivationState>;
```

| Query | value 来源 | empty | blocked | unavailable / unknown |
|---|---|---|---|---|
| Resolve context | formal context observation | 不适用 | missing/invalid context | transport/ambiguous |
| Navigation visibility | formal visibility | 不适用 | formal restricted/disabled 可作为 value；contract missing 为 blocked | transport/unknown |
| Owner view | formal safe material→snapshot/model | 仅 formal `empty` | disclosure/no-write/contract | per-owner unavailable/unknown |
| Source status | snapshot formal axes | local snapshot missing | scope mismatch | malformed/unknown axes |
| Safe link | formal revalidation | formal no-link | revoked/not-visible | unavailable/unknown |
| Request presentation | scoped local record | explicit missing | scope mismatch | carrier unavailable/corrupt |
| Reconciliation | formal result | 不适用 | no reconciliation surface | unavailable/unknown |
| Topic activation | all formal facets mapped | 不适用 | pending/blocked 是 value posture | unavailable/unknown maps conservatively |

所有 Query 先通过 `QueryNoWriteGuard`；不得写 owner/local truth，只有调用方在拿到结果后显式 composition/replace 才能写 local state。public response 没有 owner page cursor、projection marker 或 repository key，因为 Console 不拥有 projection/repository；若 owner exact page DTO 将来出现，必须以 opaque formal ref 进入 adapter contract，不能复用 `ClientPageWindow`。

### 6.2 Management topic query family

```ts
export interface QueryManagementTopicRequest<K extends ManagementTopicKey = ManagementTopicKey> {
  readonly metadata: ConsoleOperationMetadata;
  readonly descriptor: TopicDescriptor & Readonly<{key: K}>;
  readonly context: AccessContext;
  readonly filter?: FilterIntent;
  readonly window?: ClientPageWindow;
}
export type QueryManagementTopicResponse = QuerySurface<TopicPageModel>;
```

| 协议 | `descriptor.key` | owner partitions | 正向上限（当前） |
|---|---|---|---|
| `QueryMemberManagementTopic` | `member-management` | identity/member-service | pending/read-only；无 lifecycle/role truth |
| `QueryProjectWorkspaceTopic` | `project-workspace` | work/process/workspace | pending/partial；无 projection/cursor/rebuild |
| `QueryMethodAssetTopic` | `method-assets` | method-library/artifact | pending/read-only |
| `QueryGovernanceControlTopic` | `governance-controls` | governance/artifact | pending/read-only；无 verdict |
| `QueryObservabilityTopic` | `observability-audit` | observability | pending/read-only；无 audit/evidence body |
| `QueryCapabilityHubTopic` | `capability-hub` | capability-hub | pending/blocked；无 registration/readiness |
| `QueryArchiveTopic` | `archive-management` | archive | pending/blocked；无 archive/recovery command |
| `QuerySandboxTopic` | `sandbox-management` | sandbox | pending/blocked；无 run readiness |

每个协议使用相同 outer schema，但静态 `TopicDescriptor.ownerKeys` 和 per-owner `OwnerQueryInput` 不同；不得用一个 owner 的 success 填补另一个 owner，或合成全局 normal/compliant/ready。页面 `empty` 只有所有适用 owner 都返回 formal empty 且无 partial/blocked/unavailable/unknown 时成立。

### 6.3 Query family 停审

| 检查 | 结论 |
|---|---|
| request/response 二级类型 | 全部回指 Step 6/7；`QuerySurface`/`ClientPageSurface` 已定义 |
| empty/not-visible/stale/failed surface | explicit union + `SourceStatusAxes`；不靠空数组或 thrown error |
| page helper | 只定义 client window；formal owner page contract pending 且未伪造 |
| no-write | 所有 Query 无 repository/outbox/projection/local implicit write |
| protocol-to-flow | 8 core Query 各自 flow；8 topic Query由参数化 flow逐协议停审 |

## 7. Conditional inbound consumer

```ts
export interface SdkInvalidationEnvelope {
  /** Candidate slots only: exact kinds cannot be activated before the SDK contract extends shared vocabulary. */
  readonly contractRef: OwnerReference<'trace'>;
  readonly sourceRef: OwnerReference<'object'>;
  readonly invalidationRef: LocalReference<'invalidation'>;
  readonly observedContextRef?: LocalReference<'context'>;
}

export type SdkInvalidationConsumerOutcome =
  | Readonly<{kind: 'disabled'}>
  | Readonly<{kind: 'ignored'; reason: 'scope-mismatch' | 'unsupported-contract'}>
  | Readonly<{kind: 'applied'; marker: InvalidationMarker}>
  | Readonly<{kind: 'blocked'; error: ConsolePortError}>;
```

当前只允许 `SdkInvalidationPort.observe` 返回 `disabled/pending-contract`，因为 event id、schema version、ordering、dedup、replay 和 payload contract 未闭口。上面的 envelope 是 Console 所需的最小 body-free shape 候选，不能标 active；不得将 `contractRef` 当 event id、将 `invalidationRef` 当 cursor，或保存 raw payload。未来激活时，source/contract/scope 均验证通过后才能映射 `SdkInvalidationObservation`→`InvalidationMarker`；重复提示最多重复执行只收紧的 local invalidation，不建立 consumer receipt store。

## 8. 不适用协议族

| 类别 | 结论 | 原因 |
|---|---|---|
| Outbound Event | not-applicable | Console 无自有业务 truth；diagnostic emission 不是业务 event |
| Operations Job | not-applicable | requery/revalidate/reconcile 都是用户显式 flow；无 worker/rebuild/export/publish job |
| Admin/internal server API | not-applicable | Console 是 browser client，不提供服务端管理面 |

不得为了满足通用模板新增 event bus、outbox、job report、consumer receipt、DLQ、scheduler 或 BFF。

## 9. 字段来源与构造闭环

| 输入契约 | 目标对象 / view | 必填来源 | 派生来源 | 缺失行为 |
|---|---|---|---|---|
| context switch | `AccessContext`/shell | session/current context | formal resolve observation | restricted/blocked |
| preference | `ClientStateRecord` | state scope + typed patch | immutable replace | reject unsafe field |
| discard draft | `DraftIntent.discarded` | existing draft + reason key | local transition | invalid transition |
| submit intent | `ControlledCommandInput`/`RequestPresentation` | reviewable draft、verified/restricted context、qualified observation、command ref | local correlation | exact owner contract absent→blocked |
| recovery | `RecoveryPresentation` | plan/action/context | selected narrow port result | action blocked/unknown |
| core queries | corresponding safe view/ref | context + typed input | formal adapter/local mapper | explicit surface branch |
| topic queries | `TopicPageModel` | descriptor/context | activation + per-owner views + semantic bindings | partitioned partial/blocked |
| invalidation | `InvalidationMarker` | formal envelope/source/scope | safe mapper | disabled/ignored/blocked |

## 10. 跨协议 public surface 审计与门禁

| 审计项 | 结论 | blocker / 修正 |
|---|---|---|
| public 二级类型均有 schema/归属 | pass | exact owner DTO 刻意不定义 |
| HLD placeholder→DDD mapping | pass | `*Query`→`*Request/*Response` 一对一；8 topic queries 保留独立协议名 |
| owner/local ref 不混同 | pass | operation/session/context ref 不作 owner id/version/key |
| command result/receipt/unknown | pass | formal observation 分层；无 bool success |
| page/cursor/projection | pass with blocker | `ClientPageWindow` local-only；owner page contract pending |
| inbound envelope/dedup/order | blocked for activation | `CON-Q-034/038/044`；consumer 保持 disabled |
| actor/visibility/qualification | pass with blocker | 只接受 formal observation；exact schema pending |
| protocol→Step 9 flow | pass | 5+16+1 均有 flow 名与停审入口 |
| forbidden body | pass | schema 只允许 safe fields/refs；raw payload 一律拒绝 |
| Event/Job 适用性 | pass | 明确 not-applicable，未迁入服务端构造 |

持续 blocker：`CON-Q-034～047`、owner exact Query/Command/Result/Ref、scope/visibility/qualification/safe-field、reconciliation/idempotency、activation、invalidation envelope、state/cache/TTL、diagnostic/a11y、framework/router/bundler 和量化 authority。它们阻塞 positive production adapter/consumer 与实现，不阻塞本 Step 的 fail-closed typed surface。

三层门禁：Step 8 `done/pass/self_reviewed`；正式 03 继续关闭；允许更新 flow/ledger 后进入 Step 9。未创建实现仓、源码、测试、run、artifact、report、evidence、verdict、signoff 或 readiness，未提交 commit。
