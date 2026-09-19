# Step 7. 逐模块定义 Trait / Port / Adapter 契约

### 1. Step 状态

- 状态：`done / pass / self_reviewed / step_stop_review`
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 7
- 回填章节：未来正式 `03-详细设计.md` §5.5「Trait / Port / Adapter 契约」与 §6「全局对象 / Trait / API 索引」
- 当前模块：`none`（7.0～7.11 已完成；等待用户明确授权 Step 8）
- 正式回填：未执行；正式 `projects/L5-console/03-详细设计.md` 仍为 `historical_material`
- 实现仓：`/home/aris/Projects/quantalithos-console` 仍为 `planned / not_created`
- 事实声明：本文件中的 TypeScript `interface`、`type` 和 `declare function` 均为 planned contract，不表示源码、SDK 集成、编译、测试、运行或发布事实。

本 Step 按 `entry → access → navigation → views → intent → features → recovery → adapters → state → diagnostics` 串行推进。每个模块都先列 `port capability / 接缝清单`，再写调用方、实现方、输入/输出、错误、取消、读写、失效、fake parity 和禁止越界，最后写模块停审记录。全部模块完成后再进行跨模块接缝审计；在总审计通过前不得创建 Step 8 文件。

### 2. 本步目标

本项目是 framework-neutral 的 TypeScript/ESM 浏览器客户端。Step 7 的目标是把 Step 6 的对象能力接到可落码的边界上，同时保持以下事实边界：

- `adapters` 是唯一进入官方 SDK 或正式 owner service boundary 的实现接缝；业务模块不直连 transport、数据库、服务源码或私有 bus。
- `entry` 只组合宿主依赖和 session shell；`access`、`navigation`、`views`、`intent`、`features`、`recovery` 只维护客户端交互 truth 或 owner-safe 消费结果。
- Console 不拥有成员、项目、工作、流程、治理、制品、workspace、方法、能力、观测、归档或 sandbox truth；不定义 repository、projection、outbox、worker/job 或第二套授权规则。
- Query 读取面必须足够构造 Step 8 DTO、Step 9 flow、Step 10 状态矩阵和 Step 11 客户端 state carrier；Query 本身 no-write。
- Command 只表示本地交互更新或对正式 owner command 的受控委托；transport success、receipt、toast、cache hit 和页面存在均不能推导 `confirmed`、`current`、`active`、`ready` 或授权。
- 上游 exact contract 尚未闭口时，port 仍可闭合安全 carrier、错误姿态和阻塞行为，但 positive adapter 必须返回 `pending / blocked / unknown / unavailable`，不能猜造字段或协议。

### 3. 本步输入与适配原则

| 输入 | 用途 | 不得继承的内容 |
|---|---|---|
| `03_ddd_step_05_module_contracts_axis.md` | 十个 planned 模块、依赖方向、对象/port 归属 | 旧服务端层次、owner domain、repository 名称 |
| `03_ddd_step_06_object_contracts.md` | 对象字段、函数、状态、carrier 和 Step 7 承接清单 | 未经本 Step 讨论的新增对象字段或状态 |
| `02_hld_step_07_api_interface_skeleton.md` | Command/Query/Event/Recovery 用例骨架 | HTTP/RPC path、完整 DTO、假定的事件 envelope |
| `02_hld_step_08_processing_flows.md` | 语境、查询、提交、回查、主题、失效、恢复/a11y 主线 | 隐式 retry、后台 job、projection rebuild |
| `02_hld_step_09_state_machine.md` | 状态主语和只收紧/正式观察规则 | 全局统一 health/readiness 状态 |
| `01-架构设计.md`、正式 `00/02` | SDK-only、owner 分区、局部降级、a11y 与 forbidden-body 红线 | 重新打开需求或架构取舍 |
| `projects/L1-governance` Step 7 | 逐模块 capability→port→停审→跨接缝审计的粒度 | Rust/Cargo、UnitOfWork、repository、Outbox、Projection、Governance truth |

#### 3.1 TypeScript 适配而非 Rust 迁移

详细设计 SOP 的示例使用 Rust trait；本仓运行时方向在 Step 3 已确定为 TypeScript/ESM。因此本 Step 用 TypeScript `interface` 表达 trait/port，用 typed adapter `interface` 表达实现方，使用 `AbortSignal` 表达可取消边界。不存在 Rust trait、`async_trait`、Cargo crate、`UnitOfWork` 或 repository implementation。任何需要 owner truth 事务、幂等、outbox、projection 或 job 的语义都留在正式 owner boundary，并在本文件标为 `not-applicable / pending`。

#### 3.2 共享 port 错误、取消和未知语义

以下是本 Step 的 application-local、body-free 错误词汇。它们描述一次客户端边界调用，不能被解释为 owner 业务错误码，也不能携带 raw response、请求正文、stack、credential、secret 或用户输入。

```ts
/** Port 调用的安全分类；不是 owner protocol error code。 */
export type ConsolePortErrorKind =
  | 'missing-formal-surface'
  | 'unsupported-operation'
  | 'context-not-current'
  | 'visibility-not-current'
  | 'qualification-unknown'
  | 'malformed-safe-material'
  | 'forbidden-body'
  | 'transport-unavailable'
  | 'cancelled'
  | 'ambiguous-outcome'
  | 'reconciliation-unavailable'
  | 'state-scope-mismatch'
  | 'state-carrier-unavailable'
  | 'diagnostic-sink-failed'
  | 'host-binding-unavailable'
  | 'invalid-state-combination'
  | 'consistency-defect';

/** 不包含正文的 port 错误；reason 只能是已批准的安全引用。 */
export interface ConsolePortError {
  readonly kind: ConsolePortErrorKind;
  readonly source: FormalSourceKey | 'host' | 'local';
  readonly operationRef?: LocalReference;
  readonly reasonRef?: OwnerReference<'reason'>;
  readonly retryDisposition: 'never' | 'user-action' | 'formal-reconciliation' | 'unknown';
}

/** 统一的安全 port 结果；不会把异常字符串当业务分支。 */
export type ConsolePortResult<T> =
  | Readonly<{ok: true; value: T}>
  | Readonly<{ok: false; error: ConsolePortError}>;

/** 每次边界调用的客户端控制项；signal 只控制本地等待，不产生 owner replay。 */
export interface ConsolePortCallOptions {
  readonly operationRef: LocalReference<'query' | 'request' | 'invalidation' | 'diagnostic'>;
  readonly signal?: AbortSignal;
}
```

规则：

| 主题 | 本 Step 正式口径 |
|---|---|
| error mapping | adapter 必须把 transport/serialization/host failure 映射为 `ConsolePortError`；调用方不能解析错误字符串、HTTP status 或 SDK 私有异常类来决定业务状态。 |
| cancellation | `AbortSignal` 取消的是本次等待和本地 continuation；取消后不得把未确定结果改成 rejected/confirmed，也不得自动重放。若 owner side effect 可能已经发生，结果必须进入 `ambiguous-outcome`/`unknown`。 |
| unknown | `ambiguous-outcome`、缺少 reconciliation surface 或版本不一致均保持 `unknown/blocked`；不得由 timeout、刷新、cache 或新 local key 变成成功。 |
| read/write | `read` 只返回 owner-safe material/ref/status；`local-write` 只改变 Console state；`delegate-write` 只把已复核输入交给 owner formal boundary；没有 Console-owned owner-truth write。 |
| version | 客户端不发明 owner version。若 formal result 提供 `VersionReference`，adapter 原样映射；缺失时用 freshness/unknown，不能生成 latest token。 |
| invalidation | 失效只收紧本地 snapshot/navigation/request/state；新的 `current`、`fresh`、`confirmed` 必须来自新的 formal observation。 |
| fake parity | fake 必须复现同一输入 shape、成功/blocked/unknown/error 分支和取消边界；fake 不得默认所有 opaque ref 有效，不得以 map 命中直接返回 confirmed。 |
| redaction | `ConsolePortError`、diagnostic、state carrier 和 adapter result 均 body-free；检测到 forbidden body 时拒绝构造并返回 `forbidden-body`。 |

#### 3.3 共享 port capability / 接缝清单

| 接缝组 | 定义模块 | 调用方 | 实现方 | Step 6 承接 | 后续承接 |
|---|---|---|---|---|---|
| local ref source / allocator | `entry`（消费）+ `adapters`（formal ref 输入） | 所有需要 local ref 的 factory/entry | 宿主或受控 local allocator（实现归属待 Step 9/14） | `LocalReference`、`NonEmptyOpaqueValue` | Step 9 flow、Step 14 binding |
| context / visibility / qualification | `access` | `entry`、`navigation`、`views`、`intent`、`features` | `adapters` 的 formal access adapter | `AccessContext`、`VisibilityReference`、`QualificationBoundary` | Step 8 observation、Step 9 revalidation |
| host route / navigation | `navigation` | `entry`、`features`、`recovery` | host/router adapter（framework pending） | `RouteBinding`、`NavigationState` | Step 9 selection/cleanup、Step 14 config |
| owner-safe query | `views` | `views`、`features`、`recovery` | `adapters` owner query adapter | `OwnerSafeQueryMaterial`、`OwnerViewSnapshot`、`SourceStatusAxes` | Step 8 page/empty/error、Step 9 query flow |
| safe-field / redaction | `views` / `adapters` | view mapper、topic composer、diagnostic gate | formal safe mapper | `SafeViewPayload`、`RedactionMarker` | Step 8 safe DTO、Step 12 error |
| controlled command | `intent` | `SubmitControlledIntent` | `adapters` owner command adapter | `DraftIntent`、`CommandReference`、`OwnerCommandObservation` | Step 8 command DTO、Step 9 submit |
| result / reconciliation | `intent` | request presentation、recovery | `adapters` reconciliation adapter | `ResultReference`、`RequestPresentation` | Step 8 result carrier、Step 9/13 |
| topic capability / activation | `features` | topic composer、action guard | `adapters` activation adapter | `OwnerCapabilityReference`、`OwnerContractObservation`、`TopicActivationState` | Step 8 facets、Step 9 composition |
| state carrier / invalidation | `state` | `entry`、`intent`、`views`、`recovery` | host/volatile carrier adapter（medium pending） | `ClientStateRecord`、`InvalidationMarker` | Step 11 lifecycle、Step 14 medium |
| host focus / announcement | `recovery` | page/recovery composition | host accessibility adapter | `AccessibilityState`、`ActionChannelBinding` | Step 9 a11y flow、05/06 matrix |
| diagnostic sink | `diagnostics` | `entry`、`recovery`、query/intent flows | optional sink adapter | `DiagnosticContext` | Step 8 envelope、Step 15 observability |

所有接缝都只传 typed ref、safe payload、状态轴或本地对象；不存在 owner body、数据库句柄、私有 cursor、repository、projection、outbox、worker/job 或 hidden transport instance。

### 4. 分批写入计划

| 批次 | 覆盖内容 | 状态 |
|---|---|---|
| 7.0 | Step 状态、共享 port 规则、模块顺序、错误/取消/未知和写入门禁 | `[x]` 已写入 |
| 7.1 | `entry` 与宿主 bootstrap/生命周期接缝 | `[x]` 已写入 |
| 7.2 | `access` 语境、visibility、qualification、disclosure 接缝 | `[x]` 已写入 |
| 7.3 | `navigation` host route、selection、visibility cleanup 接缝 | `[x]` 已写入 |
| 7.4 | `views` owner-safe query、safe link、source/status mapper 接缝 | `[x]` 已写入 |
| 7.5 | `intent` controlled command、receipt/result、reconciliation 接缝 | `[x]` 已写入 |
| 7.6 | `features` topic query、activation、capability 和 owner partition 接缝 | `[x]` 已写入 |
| 7.7 | `recovery` action dispatcher、focus/announcement/a11y 接缝 | `[x]` 已写入 |
| 7.8 | `adapters` central formal boundary facets、fake/formal parity 和 adapter availability | `[x]` 已写入 |
| 7.9 | `state` carrier、scope、invalidation、cleanup 接缝 | `[x]` 已写入 |
| 7.10 | `diagnostics` sink、redaction、failure isolation 接缝 | `[x]` 已写入 |
| 7.11 | 十模块停审、跨模块接缝审计、Step 8/9/10 承接、回填草稿与门禁 | `[x]` 已写入并停审 |

### 5. SOP 问题回答（当前批次）

1. **哪些模块需要定义 trait / port？**

   十个模块都需要声明自己消费的 typed seam，但只有 `adapters` 实现 SDK/formal owner boundary，宿主相关 port 由 `entry`/`navigation`/`recovery` 声明并由 host adapter 实现。`views`、`intent`、`features` 的业务模块不实现 transport。`state` 的 carrier port 只服务客户端 state，不是 repository；`diagnostics` 的 sink port 只发送 body-free diagnostic context，不是 audit/evidence API。

2. **哪些模块负责实现这些 port？**

   - 正式 owner/SDK seam：`adapters` 的 typed adapter 实现。
   - 浏览器宿主 route/lifecycle/focus：宿主 integration adapter，具体 framework/router 仍 pending；不得在设计中选定框架。
   - 客户端 state carrier：`state` 声明接口，实际 medium adapter 由后续配置/实现阶段注入；当前只能承诺 session-scoped volatile fallback。
   - 诊断 sink：可选 host/observability adapter；未获正式 envelope 时可 disabled。

3. **哪些能力需要 repository、outbox、projection、external client、gateway 或 adapter 接缝？**

   需要的是 formal SDK/owner query、command、result/reconciliation、activation、safe-link、context/visibility/qualification、可选 invalidation、host route、a11y、state carrier 和 diagnostic sink。Console 中没有 repository、outbox、projection、worker/job 或 server gateway；“external client”只允许藏在 `adapters` 的正式 SDK/服务 boundary 实现中。

4. **每个 port 承接 Step 6 的哪些对象能力？**

   每个模块小节的接缝清单逐项引用 Step 6 对象。关键闭环是：`AccessContext`→context port；`RouteBinding`/`NavigationState`→route port；`OwnerSafeQueryMaterial`/`SourceStatusAxes`→query port；`DraftIntent`/`OwnerCommandObservation`→command port；`ResultReference`/`RequestPresentation`→reconciliation port；`OwnerCapabilityReference`/`TopicActivationState`→activation port；`ClientStateRecord`/`InvalidationMarker`→state port；`AccessibilityState`→focus port；`DiagnosticContext`→sink port。

5. **每个 trait/port 的参数、返回和错误是什么？**

   下文每个 port 都给出 TypeScript callable surface。返回值为 `ConsolePortResult<T>` 或明确的 safe outcome union；错误统一为 `ConsolePortError`，业务分支不从异常字符串推断。未闭口 owner surface 只保留已定义的 typed ref / input slot 并记录为 pending，在 adapter 上阻断，而不是发明 `FormalBoundaryInput` 或 owner DTO。

6. **每个读取函数是否覆盖后续 DTO、flow、state matrix 和 state carrier？**

   是，按以下最低读取面闭合：context resolver 返回 lifecycle + actor/scope/visibility/qualification；visibility resolver 返回 topic/ref/reason；owner query 返回 source/status/payload/references 以及 explicit empty/partial/unavailable/unknown；request query 返回 request phase 与正式 receipt/result/reconciliation ref；activation query 返回六个 facet；state carrier 返回完整 `ClientStateRecord` 或明确 missing/scope mismatch；diagnostic sink 返回 emitted/disabled/failed。exact owner fields、page cursor 和 event envelope 仍是 pending，不由 Console 自造。

7. **写入函数的 expected_version、UnitOfWork、幂等、append-only 或 sidecar truth 是否适用？**

   对 Console 不适用。客户端 state carrier 的写入使用 scope match 和替换式 immutable record，不声明 owner optimistic version、UnitOfWork、append-only history、outbox 或 idempotency store。Owner command 的幂等/reconciliation 只透传正式 owner contract；没有正式 basis 就不重放。`ResultReference` 和 `InvalidationMarker` 是 safe sidecar/interaction state，不是 owner truth sidecar。

8. **哪些依赖只能通过 port 访问？**

   SDK transport、owner query/command/result、context/visibility/qualification、capability/activation、safe-link、invalidation source、host route/history/focus/announcement、state medium 和 diagnostic sink 均只能通过对应 port。业务模块不得导入 adapter implementation、SDK private symbol、浏览器 storage API、router instance、DOM query 或 owner service source。

9. **取消或结果未知时如何处理？**

   所有 port 都接受可选 `AbortSignal`。取消只停止本地 continuation；若调用可能触及 owner side effect，返回 `ambiguous-outcome` 或将 `RequestPresentation` 收紧为 `unknown`。Query 取消不得构造 partial 成功；state/diagnostic cancel 不删除已有安全 state，除非显式 cleanup。

10. **各模块完成后如何停审？**

   每个模块末尾有四项检查：对象能力有接缝、调用方/实现方明确、读取/写入及失效边界闭合、无越权依赖。结论为 `pass with pending blockers` 时，只有安全骨架通过；positive adapter、active/confirmed/current 等正向分支仍按 blocker 停止。

11. **所有模块完成后跨接缝审计检查什么？**

   检查重复 port、反向依赖、缺失读取面、缺失 source/version、Query 隐式写入、command/result/reconciliation 闭环、topic capability 映射、state invalidation、a11y/diagnostic 接缝，以及 Step 8/9/10 是否能逐名回指。本文件末尾给出审计表和未关闭项。

<!-- STEP7_BATCH_7_0_END -->

<!-- STEP7_BATCH_7_1_START -->

### 6. Batch 7.1：`entry` 模块与宿主 bootstrap / 生命周期接缝

#### 6.1 `entry` port capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | Step 6 承接 | 后续承接 |
|---|---|---|---|---|---|
| session shell bootstrap | `EntryHostLifecyclePort`、`LocalReferenceSourcePort`、`ClientStateCarrierPort`（消费） | 宿主入口 `bootstrapConsole` | host integration + state adapter | `ConsoleSessionShell`、`StateScopeBinding` | Step 9 bootstrap flow、Step 11 carrier |
| initial page / safe shell presentation | `EntryPresentationPort` | `bootstrapConsole`、`presentTopicPage` | host presentation adapter | `ConsoleSessionShell.currentPage`、`TopicPageModel` | Step 9 page replacement、Step 14 host binding |
| context replacement | Step 9 entry coordinator（组合既有 state/host port，不新增 port） | `replaceShellContext` | entry composition root；底层 state/host adapter | `replaceShellContext`、`clearClientStateForContextChange` | Step 9 context switch flow |
| close / detach | `EntryHostLifecyclePort.close`、`ClientStateCarrierPort.clear` | `closeConsoleSessionShell` | host integration + state adapter | `closeConsoleSessionShell` | Step 11 cleanup、Step 12 failure isolation |
| local reference allocation | `LocalReferenceSourcePort` | 所有 entry factory 的组合根 | host-provided or approved local allocator（具体介质 pending） | `LocalReference`、`NonEmptyOpaqueValue` | Step 9 ref construction、Step 14 binding |

`entry` 不实现 owner query/command、visibility、activation、reconciliation 或 diagnostic policy。它只把已构造的 `ClientStateRecord`、`AccessContext`、`TopicPageModel` 和 host binding 组合成 shell；若任何前置缺失，shell 只能保持 `bootstrapping` 或 `restricted`。

#### 6.2 `entry` port / adapter 契约表

| 名称 | 类型 | 定义位置 | 作用 | 关键函数 |
|---|---|---|---|---|
| `EntryHostLifecyclePort` | host lifecycle port | `entry/host_lifecycle.ts`（planned） | 绑定/解除当前 browser session；不持有 credential | `attach(sessionRef, signal?)`、`close(sessionRef, signal?)` |
| `EntryPresentationPort` | host presentation port | `entry/presentation.ts`（planned） | 将 framework-neutral shell/page 交给宿主呈现 | `present(shell, signal?)`、`clear(sessionRef, signal?)` |
| `LocalReferenceSourcePort` | local ref source port | `entry/reference_source.ts`（planned） | 为 Console-owned `LocalReference` 提供已校验 opaque value | `allocate(kind, signal?)` |
| `EntryStateSnapshotPort` | state facade type alias | `state/client_state_carrier.ts`（planned） | 从唯一 carrier 裁剪 load/replace/clear | `Pick<ClientStateCarrierPort, ...>` |

宿主 adapter 是实现方，不是 `entry` 的业务对象；`EntryPresentationPort` 不接受组件实例、DOM 节点、URL、route string 或 owner payload。`LocalReferenceSourcePort` 的实现不得以数组下标、时间戳、页面标题或随机 UI 文本构造 ref；opaque value 的生成/来源仍须在 Step 9/14 明确。

#### 6.3 TypeScript planned port 契约

```ts
/** 为 Console-owned local reference 提供不透明、非空的候选值。 */
export interface LocalReferenceSourcePort {
  /** 分配指定 kind 的 local ref；不分配 owner ref 或业务 id。 */
  allocate<K extends LocalReferenceKind>(
    kind: K,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<LocalReference<K>>>;
}

/** 只绑定当前 browser session；不代表 server session 或 authentication。 */
export interface EntryHostLifecyclePort {
  /** 建立宿主绑定；取消只停止等待，不撤销 owner 状态。 */
  attach(
    sessionRef: LocalReference<'session'>,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<void>>;

  /** 解除宿主绑定并请求本地安全清理。 */
  close(
    sessionRef: LocalReference<'session'>,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<void>>;
}

/** 将已验证的 shell/page 交给宿主；不创建新的业务状态。 */
export interface EntryPresentationPort {
  /** 呈现当前 shell；presentable 仅表示客户端可呈现。 */
  present(
    shell: ConsoleSessionShell,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<void>>;

  /** 清除页面呈现；不调用 owner command。 */
  clear(
    sessionRef: LocalReference<'session'>,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<void>>;
}

/** entry 组合根的最小依赖；不把 adapter implementation 暴露给业务模块。 */
export interface ConsoleEntryDependencies {
  readonly lifecycle: EntryHostLifecyclePort;
  readonly presentation: EntryPresentationPort;
  readonly references: LocalReferenceSourcePort;
}

/** 组合 root：先 attach，再以安全 state 创建 shell。 */
export declare function bootstrapConsole(
  dependencies: ConsoleEntryDependencies,
  sessionRef: LocalReference<'session'>,
  state: ClientStateRecord,
  signal?: AbortSignal,
): Promise<ConsolePortResult<ConsoleSessionShell>>;
```

`bootstrapConsole` 的确定性顺序是：验证 `sessionRef` → `EntryHostLifecyclePort.attach` → 校验 `StateScopeBinding` → 调用 `createConsoleSessionShell` → 仅在 shell 具有安全最小呈现条件时调用 `EntryPresentationPort.present`。attach 成功不等于 `presentable`；宿主失败返回 `host-binding-unavailable`，不改变 owner 结果。若取消发生在 attach/present 等待中，入口保持可安全关闭的 shell，不把取消映射为 `confirmed`、`rejected` 或 `closed` 以外的 owner 语义。

#### 6.4 调用方、实现方与读写边界

| 接缝 | 调用方 | 实现方 | 读写性质 | 错误 / unknown 姿态 | 失效来源 |
|---|---|---|---|---|---|
| `LocalReferenceSourcePort.allocate` | entry composition、各 factory facade | host/local allocator | local-write（只生成本地 ref） | 分配失败→`state-carrier-unavailable` 或 `consistency-defect`；不得 fallback 为 route/time | session close、context change 时不再复用 |
| `EntryHostLifecyclePort.attach` | `bootstrapConsole` | host adapter | host side effect | host 不可用→`host-binding-unavailable`；不推导 access | host detach、session close |
| `EntryPresentationPort.present` | `bootstrapConsole`、page replacement | host adapter | presentation write | 取消/渲染失败→`cancelled`/`host-binding-unavailable`；不改 shell truth | page/context replacement |
| `EntryHostLifecyclePort.close` | close flow | host adapter | local cleanup side effect | close failure→安全记录 diagnostic，继续本地清理；不回写 owner | logout/revocation/context switch |

Entry 不拥有 expected owner version、UnitOfWork、transaction 或 idempotency key。`ClientStateRecord.stateRef` 只是本地记录引用，不能当 owner version 或 command idempotency basis；状态并发处理留 Step 11/13。

#### 6.5 fake / formal adapter parity 与禁止越界

- fake lifecycle 必须模拟 attach、cancel、host unavailable 和 close failure；不能无条件返回 `presentable`。
- fake presentation 必须验证 shell/page 的 context 与 scope 一致性，并在 `currentPage` 缺失时返回受限结果；不能通过 snapshot 数量猜 readiness。
- fake reference source 必须保证每个 `LocalReferenceKind` 的非空与确定性规则，且不能把 owner opaque ref 当 local ref。
- formal host adapter 不能把 URL、DOM、router instance、cookie/token、组件状态或原始错误正文写入 `ConsoleSessionShell`/`ClientStateRecord`。

#### 6.6 `entry` 模块停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| shell bootstrap 是否有明确调用方/实现方 | 通过（planned） | framework、宿主 binding 和 state medium 留 Step 9/14 |
| local ref 来源是否可追溯 | 安全骨架通过 | allocator authority、跨会话策略仍 pending；实现不得自造值 |
| presentable 是否被误当 readiness | 通过 | `presentable` 仅客户端可呈现；owner/capability readiness 仍由正式边界 |
| 取消/宿主失败是否隔离 | 通过 | 只收紧/关闭本地 shell；不改 owner result |
| 是否越过 owner/DB/transport 边界 | 通过 | entry 只依赖公开 port，不访问 SDK internals、DB 或 DOM 业务状态 |

`entry` 结论：`pass with pending blockers`。可以进入 `access`；不得在本模块创建具体框架入口、路由配置或 owner adapter 实现。

<!-- STEP7_BATCH_7_1_END -->

<!-- STEP7_BATCH_7_2_START -->

### 7. Batch 7.2：`access` 模块语境、visibility、qualification 与 disclosure 接缝

#### 7.1 `access` port capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | Step 6 承接 | 后续承接 |
|---|---|---|---|---|---|
| formal context resolve | `AccessContextResolutionPort` | `entry` bootstrap、context switch flow | `adapters` formal access adapter | `AccessContext`、`ActorScopeReference`、`VisibilityReference` | Step 8 observation、Step 9 bootstrap |
| visibility resolve | `VisibilityQualificationPort.resolveVisibility` | `navigation`、`views`、`features` | `adapters` owner/SDK adapter | `TopicVisibility`、`VisibilityReference` | Step 8 visibility carrier、Step 9 navigation |
| qualification resolve | `VisibilityQualificationPort.resolveQualification` | `intent`/`features` pre-submit | `adapters` formal adapter | `QualificationBoundary`、`DelegationQualificationObservation` | Step 8 facet、Step 9 eligibility |
| disclosure evaluation | local `DisclosureEvaluationPort`（纯函数 seam） | `views`、`features`、`entry` | `access` module | `DisclosureGuard`、`DisclosureDecision` | Step 9 view composition、Step 12 error mapping |
| context invalidation / tightening | Step 9 coordinator 调用既有 object function（不新增 port） | `recovery`、`state`、`entry` | `access` pure functions + formal observation source | `invalidateAccessContext`、`restrictAccessContext` | Step 9 revalidation、Step 10 matrix |

`access` 只保存安全引用与呈现姿态。它不能从 `ActorContext`、route、local role、menu、feature flag 或缓存推导 actor/scope、visibility、qualification 或 disclosure 结论；formal adapter 没有足够来源时必须返回 `unknown`/`restricted`/`unavailable`，而不是补齐字段。

#### 7.2 `access` port / adapter 契约表

| 名称 | 类型 | 定义位置 | 作用 | 关键函数 |
|---|---|---|---|---|
| `AccessContextResolutionPort` | formal query port | `access/context_port.ts`（planned） | 解析或重验 context 及其安全 refs | `resolve(input, signal?)`、`revalidate(context, signal?)` |
| `VisibilityQualificationPort` | formal query port | `access/visibility_port.ts`（planned） | 获取 topic visibility 与 qualification boundary | `resolveVisibility(topic, context, signal?)`、`resolveQualification(topic, context, signal?)` |
| `DisclosureEvaluationPort` | local pure port | `access/disclosure_port.ts`（planned） | 调用 `checkDisclosure`，只收紧呈现 | `evaluate(guard, context, qualification)` |

`AccessContextResolutionPort` 与 `VisibilityQualificationPort` 的实现方只能是 `adapters`；`access` 不拥有 identity、member、policy、gate 或 scope hierarchy。`DisclosureEvaluationPort` 不进行网络、存储或授权判断。

#### 7.3 TypeScript planned port 契约

```ts
/** 只携带 Console 已知的 context 查询引用；exact actor/scope schema 留 Step 8。 */
export interface AccessContextQueryInput {
  readonly sessionRef: LocalReference<'session'>;
  readonly contextRef?: LocalReference<'context'>;
  readonly currentContext?: AccessContext;
}

/** formal context adapter 的安全观察；不含 credential 或 policy body。 */
export interface AccessContextObservation {
  readonly context: AccessContext;
  readonly qualification?: QualificationBoundary;
  readonly visibility?: VisibilityReference;
}

/** context resolve/revalidate 的唯一读取面。 */
export interface AccessContextResolutionPort {
  /** 解析初始或切换后的 formal context。 */
  resolve(
    input: AccessContextQueryInput,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<AccessContextObservation>>;

  /** 对已有 context 执行显式 formal revalidation。 */
  revalidate(
    context: AccessContext,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<AccessContextObservation>>;
}

/** visibility/qualification 只读 formal surface。 */
export interface VisibilityQualificationPort {
  /** 读取指定 topic 的安全入口姿态。 */
  resolveVisibility(
    topicRef: LocalReference<'topic'>,
    context: AccessContext,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<TopicVisibility>>;

  /** 读取提交/动作所需的 formal qualification boundary。 */
  resolveQualification(
    topicRef: LocalReference<'topic'>,
    context: AccessContext,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<QualificationBoundary>>;
}

/** access 内部纯函数 facade；不得自行读取 route、cache 或 payload。 */
export interface DisclosureEvaluationPort {
  evaluate(
    guard: DisclosureGuard,
    context: AccessContext,
    qualification: QualificationBoundary,
  ): ConsolePortResult<DisclosureDecision>;
}

```

`AccessContextObservation` 的 optional 字段不是让调用方猜测缺失值：若 `context.lifecycleState` 为 `verified`/`restricted`，adapter 必须提供能够填满 Step 6 所需 refs；若 formal surface 不能提供 qualification/visibility，返回 `ConsolePortError` 的 `missing-formal-surface` 或一个明确的 `QualificationBoundary` unknown/unavailable 分支。`resolve` 与 `revalidate` 不返回 actor/profile/role 正文。

#### 7.4 函数级边界、错误与取消

| 函数 | 读写 | 成功输出 | 可判定错误 | 取消 / unknown | 失效来源 |
|---|---|---|---|---|---|
| `resolve` | formal read | `AccessContextObservation` | malformed refs→`malformed-safe-material`；正式缺口→`missing-formal-surface`；transport→`transport-unavailable` | 取消停止本地 continuation；未知结果→context `unknown` 或保守 error，不保持旧 verified 作为新结果 | session switch、SDK hint、logout |
| `revalidate` | formal read | 新 observation；只能由正式结果提升 | context 不 current→`context-not-current`；source unavailable→`transport-unavailable` | owner side effect 不适用；取消不得提升 lifecycle | formal invalidation、context change |
| `resolveVisibility` | formal read | `TopicVisibility` | topic/context mismatch→`consistency-defect`；缺 formal source→`missing-formal-surface` | unknown/unavailable 只允许 fail-closed；不得用 route/menu | visibility decision invalidation |
| `resolveQualification` | formal read | `QualificationBoundary` | qualification 无来源→`qualification-unknown`/`missing-formal-surface` | `unknown`/`unavailable` 不得转 qualified | policy/gate/visibility formal change |
| `DisclosureEvaluationPort.evaluate` | local pure | `DisclosureDecision` | invalid state combination→`consistency-defect` | 不产生网络 unknown；输入不完整则 blocked | context/qualification tightening |

Access port 不声明 owner optimistic version、UnitOfWork、事务、幂等或本地缓存写入。formal version 若存在，只通过 Step 6 `OwnerReference<'version'>`/`VersionReference` 在后续 view material 中携带；不能由 access 生成。

#### 7.5 fake / formal adapter parity 与禁止越界

- fake `resolve` 必须覆盖 unresolved、verified、restricted、expired、revoked、conflict、unknown，并验证 actor/scope/visibility refs 的同一 observation 关系；不能把任意 fixture 直接标为 verified。
- fake visibility/qualification 必须复现 missing、partial、unknown、unavailable 和 reason 缺失；不能用 boolean `true` 代替 `TopicVisibility`/`QualificationBoundary`。
- fake 与 formal adapter 都不得返回角色列表、Policy/Gate 规则、credential、scope hierarchy、owner body 或 raw error。
- `DisclosureEvaluationPort` 的 fake 必须与纯函数矩阵一致：context 非 current 或 qualification 非 qualified 时不得产生 `present-safe-fields`。

#### 7.6 `access` 模块停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| context/visibility/qualification 是否有正式读取方 | 通过（adapter port 已命名） | exact owner schema、scope relation、reason vocabulary 留 Step 8/12 |
| `AccessContext` 正向状态是否可由本地产生 | 否 | 只有 formal observation 才能进入 verified/restricted；本地只能收紧 |
| disclosure 是否复制授权规则 | 否 | 只输出 presentation posture；不执行 Policy/Gate |
| 取消/失效是否 fail-closed | 通过 | 取消与 unknown 不保持未经重验的正向姿态 |
| 是否保存 forbidden body | 通过 | 仅 typed ref/marker；无 credential、role、policy 正文 |

`access` 结论：`pass with pending blockers`。可以进入 `navigation`；任何 exact owner mapping 缺失都必须维持 restricted/unknown，不得由实现者补齐。

<!-- STEP7_BATCH_7_2_END -->

<!-- STEP7_BATCH_7_3_START -->

### 8. Batch 7.3：`navigation` 模块 host route、selection 与 visibility cleanup 接缝

#### 8.1 `navigation` port capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | Step 6 承接 | 后续承接 |
|---|---|---|---|---|---|
| host route binding | `HostRouteBindingPort` | `entry`、`navigation` | host/router adapter（framework pending） | `RouteBinding` | Step 9 route flow、Step 14 config |
| route read / selection | `HostRouteBindingPort.readCurrent`、local `NavigationSelectionPort` | `entry`、`features` | host adapter + navigation module | `NavigationState`、`selectNavigationEntry` | Step 9 selection |
| visibility application | `NavigationVisibilityPort`（消费 access result） | `navigation`、`features` | navigation module | `TopicVisibility`、`applyNavigationVisibility` | Step 9 visibility flow |
| sensitive selection cleanup | `NavigationCleanupPort` | `access` invalidation、`recovery`、`state` | navigation module + host adapter | `clearSensitiveNavigation` | Step 10 transitions、Step 11 cleanup |
| safe back navigation | `NavigationHistoryPort` | `entry`/page host | host adapter；只传 local entry refs | `backEntries` | Step 9 recovery/a11y |

Route binding 只把 host route key 映射为 `RouteBinding`；它不解析 URL query/body，不将 route、history、menu、feature flag 或 page existence 当作 visibility、qualification、activation 或 authorization。敏感姿态一旦收紧，selection 和 back history 必须按明确 cleanup 规则移除。

#### 8.2 `navigation` port / adapter 契约表

| 名称 | 类型 | 定义位置 | 作用 | 关键函数 |
|---|---|---|---|---|
| `HostRouteBindingPort` | host route port | `navigation/host_route.ts`（planned） | 读取/绑定 framework-neutral `RouteBinding` | `readCurrent(sessionRef, signal?)`、`navigate(route, signal?)` |
| `NavigationSelectionPort` | local pure port | `navigation/selection.ts`（planned） | 校验 route/topic/visibility 对齐并生成 `NavigationState` | `select(state, route, visibility?)` |
| `NavigationVisibilityPort` | local state port | `navigation/visibility.ts`（planned） | 应用 formal `TopicVisibility` 并收紧 selection | `apply(state, visibility)` |
| `NavigationCleanupPort` | local cleanup port | `navigation/cleanup.ts`（planned） | context/visibility invalidation 时清理敏感项 | `clearSensitive(state)` |
| `NavigationHistoryPort` | host history port | `navigation/history.ts`（planned） | 仅操作 local entry refs 的安全返回 | `back(sessionRef)`、`replace(sessionRef, entryRef)` |

`HostRouteBindingPort` 的实现方是宿主 integration adapter；其余 port 是纯/本地实现，不访问 SDK 或 owner service。任何 route binding config 具体键、默认值和发布方式留 Step 14/04。

#### 8.3 TypeScript planned port 契约

```ts
/** 宿主只返回已验证的 framework-neutral route binding。 */
export interface HostRouteBindingPort {
  /** 读取当前语义 route；不存在时返回 undefined，不推导 topic 不存在。 */
  readCurrent(
    sessionRef: LocalReference<'session'>,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<RouteBinding | undefined>>;

  /** 请求宿主切换到语义 route；目标仍需经过 visibility/activation guard。 */
  navigate(
    route: RouteBinding,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<void>>;
}

/** navigation 只消费已经产生的 formal visibility；不自行查询 owner。 */
export interface NavigationVisibilityPort {
  apply(
    state: NavigationState,
    visibility: TopicVisibility,
  ): ConsolePortResult<NavigationState>;
}

/** local selection port；任何 mismatch 都显式失败。 */
export interface NavigationSelectionPort {
  select(
    state: NavigationState,
    route: RouteBinding,
    visibility?: TopicVisibility,
  ): ConsolePortResult<NavigationState>;
}

/** 只清理 local navigation，不发出 owner command。 */
export interface NavigationCleanupPort {
  clearSensitive(
    state: NavigationState,
  ): ConsolePortResult<NavigationState>;
}

/** 宿主 history 只接收/返回本地 entry ref，不暴露 URL 或 owner ref。 */
export interface NavigationHistoryPort {
  back(
    sessionRef: LocalReference<'session'>,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<LocalReference<'navigation-entry'> | undefined>>;

  replace(
    sessionRef: LocalReference<'session'>,
    entryRef: LocalReference<'navigation-entry'>,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<void>>;
}
```

#### 8.4 函数级边界、错误与失效

| 函数 | 读写性质 | 成功输出 | 错误 / 安全姿态 | 取消与失效 |
|---|---|---|---|---|
| `readCurrent` | host read | `RouteBinding \| undefined` | host binding 不可用→`host-binding-unavailable`；undefined 不等 not-found | 取消不改变现有 `NavigationState`；context invalidation 后 route 仍需重新查 visibility |
| `navigate` | host presentation write | void | route/topic mismatch 或 blocked posture→`consistency-defect`/`visibility-not-current`；不绕过 guard | 取消只停止导航等待；不得将页面打开当作 active/current |
| `select` | local write | immutable `NavigationState` | `invalid-state-combination`；unknown/unavailable 只能 minimal shell | context switch 清理 selected topic、visibility 和 back history |
| `apply` | local tightening | immutable state | topic mismatch→`consistency-defect`；visibility unknown/unavailable 清理敏感 selection | 新 formal visibility 可重新构造；本地只收紧 |
| `clearSensitive` | local cleanup | empty/equivalent state | 不以空结果推导 owner 不存在 | logout/revoked/expired/context switch/explicit cleanup |

`NavigationHistoryPort.back/replace` 只返回或接收 `LocalReference<'navigation-entry'>`；语义 route 的读取/切换完全由 `HostRouteBindingPort` 负责。host adapter 可保留的 Console history 只限 local entry ref，不能保存 URL、query parameter、owner ref、credential 或 page payload。history 的持久介质与跨会话行为仍 pending，当前默认 session-scoped volatile。

#### 8.5 fake / formal adapter parity 与禁止越界

- fake route adapter 必须对 route target/topicRef 组合执行与 `createRouteBinding` 相同校验；不能接受任意 string 并返回成功。
- fake history 必须模拟 route unknown、host unavailable、cancelled 和 sensitive cleanup；不能以 route 存在推导 `TopicVisibility.visible`。
- formal route adapter 与 fake 都不得把 browser URL、DOM、router internals、menu order 或 feature flag 写入 owner refs/status。
- `NavigationVisibilityPort` 必须在 posture 收紧时清除与 topic 关联的 selected route/entry/topic；不得只隐藏视觉节点而保留可调用路径。

#### 8.6 `navigation` 模块停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| route binding/selection 是否有明确 port | 通过（host 与 local 分开） | framework/router/config 留 Step 14 |
| route 是否被当作权限 | 否 | 所有敏感入口仍需 access visibility/qualification/activation |
| unknown/unavailable cleanup 是否闭合 | 通过 | 收紧时清理 topic selection/back history；不推导对象不存在 |
| host cancel/error 是否改变 owner state | 否 | 只影响本地 presentation；错误映射为 host/local port error |
| 是否存在跨层直接调用 | 通过 | navigation 不访问 SDK、DB、owner service 或 adapter implementation |

`navigation` 结论：`pass with pending blockers`。可以进入 `views`；route config、browser matrix 和 exact visibility surface 仍不可实现化。

<!-- STEP7_BATCH_7_3_END -->

<!-- STEP7_BATCH_7_4_START -->

### 9. Batch 7.4：`views` 模块 owner-safe query、safe link 与来源状态接缝

#### 9.1 `views` port capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | Step 6 承接 | 后续承接 |
|---|---|---|---|---|---|
| owner-safe query | `OwnerQueryPort` | `views` service、`features` topic composer、`recovery` requery dispatcher | `adapters` owner query adapter | `OwnerSafeQueryMaterial`、`OwnerViewSnapshot`、`SourceStatusAxes` | Step 8 result/page carrier、Step 9 query flow |
| query no-write | `QueryNoWriteGuard` local port | every query entry before adapter call | `views` pure implementation | `QueryIntent`、`QueryNoWriteGuard` | Step 9 flow and Step 16 negative test |
| safe-field mapping | `OwnerSafeMaterialMapper` | snapshot/view composition | `adapters` mapper, consumed by `views` | `SafeViewPayload`、`RedactionMarker`、`SourceReference` | Step 8 safe DTO, Step 12 redaction |
| source/status preservation | `SourceStatusMapper` | snapshot and topic composition | `views` pure implementation fed by formal material | `SourceStatusAxes`、`OwnerViewSnapshot` | Step 10 axes matrix |
| safe-link revalidation | `SafeLinkPort` | `createDrillDownIntent` caller、topic page | `adapters` formal link adapter | `SafeLinkReference`、`SafeLinkNavigationIntent` | Step 8 link carrier、Step 9 navigation |
| owner partition | `OwnerViewCompositionPort` local port | `features` and page composition | `views` module | `OwnerViewModel`、`ReferenceSet` | Step 9 topic composition |

`views` 只接受已裁剪的 body-free material。它不接收 raw SDK response、owner DTO、URL、HTML、binary、credential 或隐式 owner cursor。远端分页、排序、筛选字段和 empty envelope 的 exact contract 尚未由 owner/SDK 正式给出；本 port 只允许消费已被 formal adapter 证明安全的输入，缺少证明时返回 `missing-formal-surface` 或 `unknown`。

#### 9.2 `views` port / adapter 契约表

| 名称 | 类型 | 定义位置 | 作用 | 关键函数 |
|---|---|---|---|---|
| `OwnerQueryPort` | formal read port | `views/owner_query.ts`（planned） | 按 owner/context/ref 读取安全观察 | `query(input, options?)` |
| `OwnerSafeMaterialMapper` | local mapping port | `views/material_mapper.ts`（planned） | 将 formal safe material 绑定 local snapshot/ref | `map(material, snapshotRef, contextRef)` |
| `SourceStatusMapper` | local pure port | `views/source_status.ts`（planned） | 校验五轴来源与 owner 对齐 | `map(material)`、`tighten(status, constraint)` |
| `SafeLinkPort` | formal read/revalidation port | `views/safe_link.ts`（planned） | 重新验证安全 link target，不返回 URL | `revalidate(intent, options?)` |
| `OwnerViewCompositionPort` | local composition port | `views/owner_view.ts`（planned） | 按显式 owner 组合 snapshots | `compose(view, snapshot)` |

`OwnerQueryPort` 是唯一 owner-safe 查询入口；`features` 不为每个主题复制一套 transport port，而是传入静态 owner/topic mapping。`SafeLinkPort` 只返回 typed link ref 或安全阻断，不执行宿主导航；导航由 `HostRouteBindingPort` 承接。

#### 9.3 TypeScript planned port 契约

```ts
/** Query 调用所需的最小、无正文输入；远端 page/cursor 只在正式合同存在时扩展。 */
export interface OwnerQueryInput {
  readonly intent: QueryIntent;
  readonly context: AccessContext;
  readonly owner: OwnerKey;
  readonly subjectRef?: OwnerReference<'object' | 'query-surface'>;
  readonly filter?: FilterIntent;
  readonly clientWindow?: ClientPageWindow;
}

/** formal query 的安全观察；empty 与不可用不由空数组推导。 */
export type OwnerQueryObservation =
  | Readonly<{kind: 'material'; material: OwnerSafeQueryMaterial}>
  | Readonly<{
      kind: 'empty';
      source: SourceReference;
      status: SourceStatusAxes;
      references: SafeReferenceSet;
      visibility?: VisibilityReference;
    }>
  | Readonly<{kind: 'blocked'; reasonRef?: OwnerReference<'reason'>}>
  | Readonly<{kind: 'unavailable'; reasonRef?: OwnerReference<'reason'>}>
  | Readonly<{kind: 'unknown'; reasonRef?: OwnerReference<'reason'>}>;

/** 唯一 owner-safe query 读取面；不得隐式 command、reconcile 或 replay。 */
export interface OwnerQueryPort {
  query(
    input: OwnerQueryInput,
    options?: ConsolePortCallOptions,
  ): Promise<ConsolePortResult<OwnerQueryObservation>>;
}

/** 将已裁剪 material 绑定到 local snapshot；不生成 owner ref 或 payload。 */
export interface OwnerSafeMaterialMapper {
  map(
    material: OwnerSafeQueryMaterial,
    snapshotRef: LocalReference<'snapshot'>,
    contextRef: LocalReference<'context'>,
  ): ConsolePortResult<OwnerViewSnapshot>;
}

/** 只校验 formal source/status 五轴，不选择或合成任何轴值。 */
export interface SourceStatusMapper {
  map(material: OwnerSafeQueryMaterial): ConsolePortResult<SourceStatusAxes>;
  tighten(
    status: SourceStatusAxes,
    constraint: Partial<Omit<SourceStatusAxes, 'owner'>>,
  ): ConsolePortResult<SourceStatusAxes>;
}

/** safe link 只做 target/context 重验证；不产生 URL 或 owner body。 */
export interface SafeLinkPort {
  revalidate(
    intent: SafeLinkNavigationIntent,
    options?: ConsolePortCallOptions,
  ): Promise<ConsolePortResult<SafeLinkReference>>;
}

/** owner partition 组合为 immutable view model。 */
export interface OwnerViewCompositionPort {
  compose(
    view: OwnerViewModel,
    snapshot: OwnerViewSnapshot,
  ): ConsolePortResult<OwnerViewModel>;
}
```

`OwnerQueryObservation.kind='empty'` 只能来自 formal empty/result disposition；adapter 不得在 `material` 的空 `references`、空 `payload.fields` 或 page 无 item 时自行改成 `empty`。`material.status` 中的 `coverage='partial'/'missing'` 必须原样保留；mapper 不得将其提升为 `complete`。`OwnerSafeMaterialMapper.map` 只在 source/status/payload/reference owner 与 context 关系可验证时成功。

#### 9.4 函数级边界、错误、取消与失效

| 函数 | 读写性质 | 成功输出 | 错误 / 安全姿态 | 取消与失效 |
|---|---|---|---|---|
| `OwnerQueryPort.query` | formal read | `OwnerQueryObservation` | Query guard 失败→`unsupported-operation`；safe material 不完整→`malformed-safe-material`；owner surface 缺失→`missing-formal-surface` | Query 取消不产生 partial 成功；若无法判断是否已发出请求则返回 `unknown`，不推进 state |
| `OwnerSafeMaterialMapper.map` | local pure mapping | `OwnerViewSnapshot` | owner/source/status mismatch、forbidden body→`consistency-defect`/`forbidden-body` | 不涉及网络；snapshot 由 context invalidation 收紧 |
| `SourceStatusMapper.map` | local pure read | 五轴状态 | 缺轴、owner 不一致→`malformed-safe-material`；不从文本推导轴值 | 新 formal material 才能提升；cache/render success 不提升 |
| `SourceStatusMapper.tighten` | local tightening | 更保守 `SourceStatusAxes` | 尝试提升轴或混用 `not-covered`→`consistency-defect` | context/visibility/invalidation 可收紧对应 view |
| `SafeLinkPort.revalidate` | formal read | current 或保守 link ref | link revoked/invalid→`visibility-not-current`；surface 缺失→`missing-formal-surface` | 取消或 ambiguous→`unknown`；不得由 route 打开确认 link current |
| `OwnerViewCompositionPort.compose` | local write | owner 一致的 immutable view | owner/context mismatch→`consistency-defect` | source invalidation 只移除/收紧对应 snapshot，不改其它 owner partition |

所有 query 结果的 `current/fresh/complete/available/coherent` 只来自 formal material；`OwnerQueryObservation` 的 `blocked/unavailable/unknown` 不等同 owner 不存在或 denied。`ClientPageWindow` 只影响已取得的安全 snapshots；它不是 owner page cursor、版本或 freshness token。

#### 9.5 fake / formal adapter parity 与禁止越界

- fake query 必须能按同一输入返回 `material`、`empty`、`blocked`、`unavailable`、`unknown`，并执行 `QueryNoWriteGuard`；不能把 fixture 数组为空自动当 formal empty。
- fake material mapper 必须拒绝缺少 `RedactionMarker`、owner 不一致、非有限 number、raw body 或未证明字段；不能通过 snapshot 数量猜 `complete`。
- fake safe-link adapter 必须模拟 current、stale/revoked、missing surface、cancelled 和 ambiguous；不能返回 URL 字符串。
- fake 与 formal adapter 均不得写 owner truth、projection、cache cursor、DB、private bus 或隐式 refresh；query 只读。

#### 9.6 `views` 模块停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| query 读取面是否覆盖 snapshot/view/status | 通过（material/empty/blocked/unavailable/unknown 已分支） | exact owner page/empty/error envelope 留 Step 8 |
| Query 是否 no-write | 通过 | `QueryIntent` 必须先过 guard；reconcile/replay 不可隐式进入 |
| 五轴是否保真 | 通过 | mapper 只校验/收紧，不合成 health/readiness |
| safe link 是否绕过 context | 否 | link revalidate 携带同源 `SafeLinkNavigationIntent.contextRef` |
| fake 是否与 formal parity | 通过（负向和取消分支已列） | exact owner fixture/schema 留 Step 16 |
| 是否越过 owner/body 边界 | 通过 | 只允许 typed refs、safe scalars 与 status markers |

`views` 结论：`pass with pending blockers`。可以进入 `intent`；在 safe-field、empty/page、owner exact result 未闭口前，不得实现 positive mapper 或远端分页适配。

<!-- STEP7_BATCH_7_4_END -->

<!-- STEP7_BATCH_7_5_START -->

### 10. Batch 7.5：`intent` 模块 controlled command、receipt/result 与 reconciliation 接缝

#### 10.1 `intent` port capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | Step 6 承接 | 后续承接 |
|---|---|---|---|---|---|
| command eligibility handoff | `CommandQualificationPort`（消费 features/access observation） | `intent` submit flow | `features`/`access` composition；不访问 transport | `DelegationQualificationObservation`、`SubmissionEligibility` | Step 9 pre-submit flow |
| controlled command delegation | `OwnerCommandPort` | `SubmitControlledIntent` application flow | `adapters` formal command adapter | `DraftIntent`、`CommandReference`、`OwnerCommandObservation` | Step 8 command DTO、Step 9 submit |
| receipt/result mapping | `CommandObservationMapper` | request presentation updater | `adapters` safe mapper + `intent` pure mapping | `ReceiptReference`、`ResultReference`、`RequestPresentation` | Step 8 result carrier |
| result reconciliation | `ResultReconciliationPort` | `ReconcileRequestResult`、recovery dispatcher | `adapters` formal reconciliation adapter | `ResultReference`、`FormalReplayBasis`、`UnknownReplayGuard` | Step 8 reconciliation DTO、Step 13 idempotency |
| draft/request state handoff | `IntentStatePort`（消费 state carrier） | `intent` service | `state` module | `DraftIntent`、`RequestPresentation`、`SubmissionAttemptPresentation` | Step 9 flow、Step 11 lifecycle |

`intent` 不实现 owner command、Policy/Gate、业务 validation、幂等存储或 result truth。它只在本地检查 draft/context/qualification 的同源性，并把已复核的 safe command input 委托给 `OwnerCommandPort`；正式 owner 返回的 receipt/result/ref 决定后续呈现。缺少 exact command field contract 时，command port 必须返回 `missing-formal-surface`，不能把 `ClientDraftFields` 当 generic JSON 发送。

#### 10.2 `intent` port / adapter 契约表

| 名称 | 类型 | 定义位置 | 作用 | 关键函数 |
|---|---|---|---|---|
| `CommandQualificationPort` | local qualification seam | `intent/qualification.ts`（planned） | 验证输入已带同源 qualified observation | `check(draft, observation)` |
| `OwnerCommandPort` | formal delegate-write port | `intent/owner_command.ts`（planned） | 将 safe command delegation 交给 owner | `submit(input, options?)` |
| `CommandObservationMapper` | local pure port | `intent/command_observation.ts`（planned） | 将 adapter observation 映射 receipt/result/request phase | `map(request, observation)` |
| `ResultReconciliationPort` | formal read/reconciliation port | `intent/reconciliation.ts`（planned） | 读取正式 result/reconciliation，不重放 mutation | `reconcile(input, options?)` |
| `IntentStatePort` | state facade type alias | `state/client_state_carrier.ts`（planned） | 从唯一 carrier 裁剪 replace/invalidate | `Pick<ClientStateCarrierPort, ...>` |

#### 10.3 TypeScript planned port 契约

```ts
/** 仅携带已复核的 local draft、context 与 owner command surface 引用。 */
export interface ControlledCommandInput {
  readonly draft: Extract<DraftIntent, {state: 'reviewable'}>;
  readonly qualification: Extract<DelegationQualificationObservation, {posture: 'qualified'}>;
  readonly context: AccessContext;
  readonly command: CommandReference;
  /** exact owner metadata 尚未闭口；只允许安全 correlation slot。 */
  readonly correlationRef: LocalReference<'request'>;
}

/** 只消费 owner formal command 的安全观察，不承接 command body。 */
export interface OwnerCommandPort {
  submit(
    input: ControlledCommandInput,
    options?: ConsolePortCallOptions,
  ): Promise<ConsolePortResult<OwnerCommandObservation>>;
}

/** 结果观察的纯映射；不由 transport status 推断 terminal。 */
export interface CommandObservationMapper {
  map(
    request: RequestPresentation,
    observation: OwnerCommandObservation,
  ): ConsolePortResult<RequestPresentation>;
}

/** 正式回查输入；只携带 request/ref/context，不携带 command body。 */
export interface ResultReconciliationInput {
  readonly request: Extract<RequestPresentation, {phase: 'unknown' | 'pending' | 'accepted' | 'submitted'}>;
  readonly context: AccessContext;
  readonly reconciliationRef?: OwnerReference<'reconciliation'>;
}

/** 只读取正式 result/reconciliation；不得调用 owner command。 */
export interface ResultReconciliationPort {
  reconcile(
    input: ResultReconciliationInput,
    options?: ConsolePortCallOptions,
  ): Promise<ConsolePortResult<ResultReference>>;
}

/** 仅验证 draft 与 formal qualification/context/command 同源。 */
export interface CommandQualificationPort {
  check(
    draft: DraftIntent,
    observation: DelegationQualificationObservation,
  ): ConsolePortResult<SubmissionEligibility>;
}
```

`ControlledCommandInput.correlationRef` 只是本地 request 关联，用于把返回 observation 绑定到 `RequestPresentation`；它不是 owner request id、idempotency key 或 command digest。正式 `CommandMetadata`、owner command DTO、idempotency key 和 field mapping 仍由 Step 8/13 的 authority 闭合；在闭口前 `OwnerCommandPort.submit` 应返回 `missing-formal-surface`，而不是忽略草稿字段。

#### 10.4 函数级边界、错误、取消与 unknown

| 函数 | 读写性质 | 成功输出 | 错误 / 安全姿态 | 取消与未知 |
|---|---|---|---|---|
| `CommandQualificationPort.check` | local pure | `eligible-for-delegation` 或 blocked | draft 非 reviewable、context/ref mismatch、qualification 非 qualified→`context-not-current`/`consistency-defect` | 不触发 transport；无 observation 时 blocked |
| `OwnerCommandPort.submit` | delegate-write（owner side effect） | `receipt`、formal `result` 或 `ambiguous` | exact field/surface 缺失→`missing-formal-surface`；safe mapping 失败→`malformed-safe-material`；transport failure→`transport-unavailable` | 取消若 owner side effect 未知→`ambiguous-outcome`；不得将取消改成 rejected/confirmed |
| `CommandObservationMapper.map` | local write | 更新 `RequestPresentation` phase | receipt/result owner/context/request mismatch→`consistency-defect`；transport success 无 observation→`ambiguous-outcome` | ambiguous 保持 unknown；不自动重放 |
| `ResultReconciliationPort.reconcile` | formal read | `ResultReference`（pending/confirmed/rejected/unknown） | reconciliation surface 缺失→`reconciliation-unavailable`；result mapping 失败→`malformed-safe-material` | 取消/timeout→unknown；不触发 command |
| `IntentStatePort.replace` | local state write | replaced local record | scope mismatch/carrier unavailable→`state-scope-mismatch`/`state-carrier-unavailable` | cancel 不删除已有安全 record，除非显式 discard/cleanup |

`ResultReconciliationPort` 的返回 `ResultReference.state='confirmed'/'rejected'` 只能由 formal result observation 构造；receipt、HTTP/SDK success、toast、refresh、cache hit 或本地 phase 都不具备该权限。`retry-command` 只有 `FormalReplayBasis` 两个正式 ref 都存在且 Step 13 明确允许时才可交给后续策略，本 Step 不执行。

#### 10.5 fake / formal adapter parity 与禁止越界

- fake command adapter 必须覆盖 blocked、receipt、formal result、ambiguous、cancelled、transport unavailable 和 malformed safe material；不得以 `true` 或 map hit 直接返回 `confirmed`。
- fake reconciliation adapter 必须区分 missing surface、pending、confirmed、rejected、unknown，并要求 request/context/ref 同源；不能从 requestRef 或 local timestamp 伪造 result ref。
- fake qualification port 必须与 `SubmissionEligibilityGuard` 同一拒绝矩阵；不能因为测试 draft 存在就产生 `qualified`。
- formal/fake adapter 均不得保存 command body、draft user text、credential、idempotency secret、owner result body 或 retry queue。

#### 10.6 `intent` 模块停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| command 输入是否有资格/同源前置 | 通过 | exact owner field/metadata/qualification contract 留 Step 8/13 |
| receipt/result/unknown 是否分离 | 通过 | `OwnerCommandObservation` 三分支 + `ResultReference.state` |
| cancellation 是否可能伪造终态 | 否 | side effect unknown 统一 `ambiguous-outcome`/unknown |
| reconciliation 是否隐式重放 | 否 | port 只读 formal result；replay basis 后置 |
| state 写入是否越成 owner truth | 否 | 仅替换 local draft/request presentation |
| fake parity 是否覆盖负向 | 通过 | exact DTO fixtures 留 Step 16 |

`intent` 结论：`pass with pending blockers`。可以进入 `features`；owner command/result/idempotency exact contract 未闭口前不得实现正向提交或自动恢复。

<!-- STEP7_BATCH_7_5_END -->

<!-- STEP7_BATCH_7_6_START -->

### 11. Batch 7.6：`features` 模块 topic query、activation、capability 与 owner partition 接缝

#### 11.1 `features` port capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | Step 6 承接 | 后续承接 |
|---|---|---|---|---|---|
| topic contract observation | `TopicActivationPort` | topic composition flow | `adapters` per-owner activation adapter | `OwnerCapabilityReference`、`OwnerContractObservation` | Step 8 facet carrier、Step 9 activation flow |
| activation mapping | `TopicActivationMappingPort` | `features` composition | `features` pure implementation | `TopicActivationState`、`evaluateOwnerActivation` | Step 10 activation matrix |
| per-owner topic query | consumed `OwnerQueryPort` | topic composition coordinator | `adapters` owner query adapter | `OwnerViewModel`、`SourceStatusAxes` | Step 9 owner-partitioned flow |
| topic view composition | `TopicCompositionPort` | page/application entry | `features` module | `TopicViewModel`、`ActionEntryModel`、`SafeLinkReference` | Step 9 composition |
| page semantic composition | `TopicPageCompositionPort` | entry/page host | `features` module | `TopicPageModel`、`SemanticRegionModel`、`PageAccessibilityBinding` | Step 9 page flow、Step 14 binding |
| command entry qualification | `DelegationQualificationPort` | controlled action entry | `features` module | `evaluateDelegationQualification`、`CommandReference` | Step 9 submit handoff |

八类 topic 共享同一套 port shape，但绝不共享一个跨 owner 结果或 readiness。调用方必须按 `TopicDescriptor.owners` 的 canonical order 对每个 owner 独立读取 activation 与 query；某一 owner 的 partial/unavailable/blocked 只收紧该 partition，不能被另一个 owner 的成功覆盖。

#### 11.2 `features` port / adapter 契约表

| 名称 | 类型 | 定义位置 | 作用 | 关键函数 |
|---|---|---|---|---|
| `TopicActivationPort` | formal read port | `features/topic_activation.ts`（planned） | 读取 capability 及六个 formal facet 的安全观察 | `observe(input, options?)` |
| `TopicActivationMappingPort` | local pure port | `features/topic_activation.ts`（planned） | 把正式观察映射为 consumption posture | `map(topic, outcome, context)` |
| `TopicCompositionPort` | local composition port | `features/topic_view.ts`（planned） | 组合 owner-partitioned view/actions/links | `compose(input)` |
| `TopicPageCompositionPort` | local page port | `features/topic_page.ts`（planned） | 组合语义区域与 page a11y binding | `compose(route, topicView, regions, bindings, focusKey)` |
| `DelegationQualificationPort` | local guard port | `features/action_entry.ts`（planned） | 对 context/visibility/command/activation 做同源检查 | `evaluate(...)` |

#### 11.3 TypeScript planned port 契约

```ts
/** formal capability/facet 的读取输入；owner 必须属于 topic descriptor。 */
export interface TopicContractReadInput {
  readonly topic: TopicDescriptor;
  readonly owner: OwnerKey;
  readonly context: AccessContext;
}

/** capability observation 与可能的 command surface 都必须来自同一 owner contract。 */
export interface TopicContractMaterial {
  readonly observation: OwnerContractObservation;
  readonly commandReferences: readonly CommandReference[];
}

/** 明确区分“尚无合同”“正式阻断”“暂不可用”，不使用 undefined 猜原因。 */
export type TopicContractReadOutcome =
  | Readonly<{kind: 'observed'; material: TopicContractMaterial}>
  | Readonly<{kind: 'pending'; owner: OwnerKey; reasonRef?: OwnerReference<'reason'>}>
  | Readonly<{kind: 'blocked'; owner: OwnerKey; reasonRef?: OwnerReference<'reason'>}>
  | Readonly<{kind: 'unavailable'; owner: OwnerKey; reasonRef?: OwnerReference<'reason'>}>
  | Readonly<{kind: 'unknown'; owner: OwnerKey; reasonRef?: OwnerReference<'reason'>}>;

/** 读取 per-owner capability/facet；不是 capability registry owner。 */
export interface TopicActivationPort {
  observe(
    input: TopicContractReadInput,
    options?: ConsolePortCallOptions,
  ): Promise<ConsolePortResult<TopicContractReadOutcome>>;
}

/** 只按 Step 6 确定性矩阵计算消费姿态。 */
export interface TopicActivationMappingPort {
  map(
    topic: TopicDescriptor,
    outcome: TopicContractReadOutcome,
    context: AccessContext,
  ): ConsolePortResult<TopicActivationState>;
}

/** topic composition 的完整安全输入；每个数组都按 Step 6 canonical key 去重排序。 */
export interface TopicCompositionInput {
  readonly topic: TopicDescriptor;
  readonly contextRef: LocalReference<'context'>;
  readonly visibility: TopicVisibility;
  readonly activations: readonly TopicActivationState[];
  readonly ownerViews: readonly OwnerViewModel[];
  readonly actions: readonly ActionEntryModel[];
  readonly links: readonly SafeLinkReference[];
}

/** 不读取 owner、transport 或 host router 的本地组合 port。 */
export interface TopicCompositionPort {
  compose(input: TopicCompositionInput): ConsolePortResult<TopicViewModel>;
}

/** framework-neutral page composition；a11y binding 仍只是语义输入。 */
export interface TopicPageCompositionPort {
  compose(
    route: RouteBinding,
    topicView: TopicViewModel,
    regions: readonly SemanticRegionModel[],
    bindings: readonly PageAccessibilityBinding[],
    initialFocusRegionKey: NonEmptyOpaqueValue,
  ): ConsolePortResult<TopicPageModel>;
}

/** command entry 的同源 guard；不调用 owner command。 */
export interface DelegationQualificationPort {
  evaluate(
    context: AccessContext,
    visibility: TopicVisibility,
    command: CommandReference,
    activation: TopicActivationState,
  ): ConsolePortResult<DelegationQualificationObservation>;
}
```

`TopicContractMaterial.commandReferences` 只是 formal command surface ref 集，不是 action 已启用或 command DTO。`mode='read-only'` 时必须为空；`controlled-command` 时 exact command-to-action mapping 由 Step 8 协议与 Step 9 flow 闭合，当前不能按数组顺序、method string、route 或 presentation key 猜测。任何 command ref owner 与 capability owner 不一致都返回 `consistency-defect`。

#### 11.4 activation、query、page 与命令入口边界

| 接缝 | 读写性质 | 正向条件 | 保守/错误姿态 | 取消与失效 |
|---|---|---|---|---|
| `TopicActivationPort.observe` | formal read | 正式 capability、mode、validity、activation ref 与全部适用 facet 可映射 | 无 surface→pending；formal blocked→blocked；transport→unavailable；无法分类→unknown | 取消不保留旧 observation 为 current；active 必须由新 formal observation 恢复 |
| `TopicActivationMappingPort.map` | local pure | 仅 Step 6 矩阵可产 `read-only/partial/active` | missing/unknown facet→blocked；无 observation→pending；restricted context 最多 read-only/partial | 本地只能通过 `tightenTopicActivation` 收紧 |
| consumed `OwnerQueryPort.query` | formal read | 按 topic owner 独立返回 safe material/empty | 单 owner failure 只影响该 partition | 取消该 owner query 不取消其它已安全完成 partition；页面整体不得伪 normal |
| `TopicCompositionPort.compose` | local write | owner/context/topic/activation 全部同源 | 空 ownerViews 不等正式 empty；mismatch→consistency defect | formal status/invalidation 只收紧相关 partition/action |
| `TopicPageCompositionPort.compose` | local write | 必需 region、route/topic、focus/bindings 全部一致 | hidden region 不可聚焦；缺三通道 binding→malformed safe material | page recompose 不提升 activation/source axes |
| `DelegationQualificationPort.evaluate` | local pure | verified context + visible + active controlled-command + current command | 其它均 blocked；不输出 owner authorize | activation/context/visibility 失效后旧 qualified observation 不可复用 |

`active` 只表示某一 capability 的 Console 消费合同可判别，不表示 owner 服务健康、实现完成、测试通过、运行 ready 或业务对象可执行。`pagePosture='normal'` 同样只是当前安全呈现姿态，不是全局 readiness。

#### 11.5 owner/topic adapter mapping 与当前上限

| topic | owner adapter partitions | 当前允许的安全 port 形态 | positive activation 当前上限 |
|---|---|---|---|
| member-management | identity、member-service | independent query + activation observation | pending；exact member/scope/role surface 未闭口 |
| project-workspace | work、process、workspace | three independent query/status partitions | pending/partial；不引入 workspace projection/cursor |
| method-assets | method-library | read-safe query + optional command surface | pending/read-only；command field contract 未闭口 |
| governance-controls | governance、artifact | independent governance/artifact safe refs and views | pending/read-only；不生成 Gate/Decision/SoA/AIIA/Control verdict |
| observability | observability | read-safe audit/metric/report refs | pending/read-only；不生成 audit/evidence/report |
| capability-hub | capability-hub | capability/ref query + activation observation | pending/blocked；不推导 capability readiness |
| archive | archive | body-free archive/ref query | pending/blocked；不执行 archive/recovery |
| sandbox | sandbox | body-free run/isolation/ref query | pending/blocked；不执行 sandbox 或推导 run readiness |

此表不是 adapter availability 声明；所有 positive 分支仍需 formal contract。未停审 L5/L6 不得加入 topic owners 或主链，只能由未来正式 safe-link/ref 合同进入。

#### 11.6 fake / formal adapter parity 与禁止越界

- fake activation 必须逐 facet 提供 satisfied/partial/missing/unknown/not-applicable，并校验 mode；不能用单个 `enabled=true` 产生 active。
- fake topic query 必须保持每个 owner 独立状态和错误；不能把成功 partition 覆盖失败 partition，也不能生成统一 health/readiness。
- fake page composition 必须验证 region/action/channel binding 与 visual/keyboard/assistive-technology 三通道等价；不能从 DOM 或组件树推断。
- formal/fake adapter 均不得注册 capability、创建 member/project/workspace/method/governance/artifact/archive/sandbox truth，或绕过 owner Policy/Gate。

#### 11.7 `features` 模块停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| activation 是否有 formal port 和完整 facet 读取面 | 通过（安全 carrier 已闭） | exact owner facet schema 与 command-action mapping 留 Step 8 |
| positive state 是否携带 capability | 通过 | `TopicActivationState` Step 6 union 保持不变 |
| owner partitions 是否被聚合成第二 truth | 否 | 每 owner 独立 observation/query/status；局部失败不扩散/不掩盖 |
| action entry 是否直接执行 command | 否 | 仅输出 `DelegationQualificationObservation`，随后交 intent guard/command port |
| page a11y 是否从 DOM 推导 | 否 | `PageAccessibilityBinding` 显式进入 recovery mapper |
| activation 是否冒充 readiness | 否 | 文义、port 结果和错误姿态均限定为消费合同 |

`features` 结论：`pass with pending blockers`。可以进入 `recovery`；所有 owner exact facet/command-action mapping 未闭口前，生产 adapter 必须保持 pending/read-only/blocked，不能 active。

<!-- STEP7_BATCH_7_6_END -->

<!-- STEP7_BATCH_7_7_START -->

### 12. Batch 7.7：`recovery` 模块动作调度、focus/announcement 与 a11y 接缝

#### 12.1 `recovery` port capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | Step 6 承接 | 后续承接 |
|---|---|---|---|---|---|
| recovery action validation | `RecoveryActionGuardPort` | `ApplyRecoveryAction` | `recovery` pure implementation | `RecoveryPlan`、`assertRecoveryActionAllowed` | Step 9 recovery flow |
| explicit requery | `RecoveryExecutionPort.requery` | recovery action handler | coordinator using `OwnerQueryPort` | `RecoveryAction='requery'`、`DegradationState` | Step 9 query recovery |
| explicit context revalidation | `RecoveryExecutionPort.revalidateContext` | recovery action handler | coordinator using `AccessContextResolutionPort` | `revalidate-context`、`AccessContext` | Step 9 context recovery |
| explicit result reconciliation | `RecoveryExecutionPort.reconcileResult` | recovery action handler | coordinator using `ResultReconciliationPort` | `reconcile-result`、`RequestPresentation` | Step 9/13 |
| keep draft / exit | `RecoveryExecutionPort.keepDraft/exit` | recovery action handler | coordinator using state + entry host ports | `DraftIntent`、`RecoveryPlan` | Step 9/11 |
| page binding to a11y state | `PageAccessibilityMapperPort` | entry/page composition | `recovery` pure implementation | `PageAccessibilityBinding`→`ActionChannelBinding`、`AccessibilityState` | Step 9 a11y flow |
| focus / announcement | `FocusAnnouncementPort` | page/recovery composition | host accessibility adapter | `AccessibilityState`、`AnnouncementBinding` | Step 9/12、05/06 matrix |

恢复动作只能由用户显式选择、当前 `RecoveryPlan` 允许并通过 guard 后执行。`RecoveryExecutionPort` 是 orchestration seam，不是后台 retry/job；一次调用恰好对应一个显式动作，禁止 schedule、backoff、loop、automatic replay 或批量 owner repair。

#### 12.2 `recovery` port / adapter 契约表

| 名称 | 类型 | 定义位置 | 作用 | 关键函数 |
|---|---|---|---|---|
| `RecoveryActionGuardPort` | local guard port | `recovery/recovery_guard.ts`（planned） | 验证 plan/action/context/request 同源 | `assertAllowed(...)` |
| `RecoveryExecutionPort` | orchestration port | `recovery/recovery_execution.ts`（planned） | 把五种 explicit action 分派到已有窄 port | `requery`、`revalidateContext`、`reconcileResult`、`keepDraft`、`exit` |
| `PageAccessibilityMapperPort` | local mapper port | `recovery/accessibility_mapper.ts`（planned） | 显式映射 page bindings 为 channel bindings/state | `map(page, semantics)` |
| `FocusAnnouncementPort` | host accessibility port | `recovery/focus_announcement.ts`（planned） | 请求 focus 与受控 message-key 播报 | `focus(state, signal?)`、`announce(binding, signal?)` |

`PageAccessibilityMapperPort` 由 `recovery` 定义并单向消费 `features.TopicPageModel`，`features` 不引用 `recovery`，因此不存在模块循环。它逐字段复制 focus/action/channel/trigger key，不读取 DOM、CSS、component instance 或 rendered text。

#### 12.3 TypeScript planned port 契约

```ts
/** 只验证当前 plan 明确允许的一个动作。 */
export interface RecoveryActionGuardPort {
  assertAllowed(
    plan: RecoveryPlan,
    action: RecoveryAction,
    context: AccessContext,
    request?: RequestPresentation,
  ): ConsolePortResult<RecoveryAction>;
}

/** 显式 requery 所需输入；不得从 degradation ref 反推 owner query。 */
export interface RecoveryRequeryInput {
  readonly plan: RecoveryPlan;
  readonly query: OwnerQueryInput;
}

/** 每个恢复动作具有独立 typed 输入/输出；不存在 generic retry。 */
export interface RecoveryExecutionPort {
  requery(
    input: RecoveryRequeryInput,
    options?: ConsolePortCallOptions,
  ): Promise<ConsolePortResult<OwnerQueryObservation>>;

  revalidateContext(
    plan: RecoveryPlan,
    context: AccessContext,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<AccessContextObservation>>;

  reconcileResult(
    plan: RecoveryPlan,
    input: ResultReconciliationInput,
    options?: ConsolePortCallOptions,
  ): Promise<ConsolePortResult<ResultReference>>;

  keepDraft(
    plan: RecoveryPlan,
    draft: DraftIntent,
  ): ConsolePortResult<DraftIntent>;

  exit(
    plan: RecoveryPlan,
    sessionRef: LocalReference<'session'>,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<void>>;
}

/** 将 page 的显式 binding 和共享 action semantic 变成初始 a11y state。 */
export interface PageAccessibilityMapperPort {
  map(
    page: TopicPageModel,
    actionSemantics: readonly InteractionActionSemantic[],
  ): ConsolePortResult<AccessibilityState>;
}

/** 宿主只消费 key/status，不接收 owner body 或任意 message text。 */
export interface FocusAnnouncementPort {
  focus(
    state: AccessibilityState,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<void>>;

  announce(
    announcement: AnnouncementBinding,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<void>>;
}
```

#### 12.4 动作调度和 a11y 边界

| 函数 | 依赖的正式/本地输入 | 输出 | 错误 / 安全姿态 | 禁止事项 |
|---|---|---|---|---|
| `requery` | guard-passed plan + explicit `OwnerQueryInput` | `OwnerQueryObservation` | missing query surface→blocked；cancelled→保持 degradation | 不扫描 topic 或从 reason string 拼 query；不自动重复 |
| `revalidateContext` | guard-passed plan + current context | `AccessContextObservation` | revoked/unknown/transport error→restricted/unknown | 不沿用旧 verified 作为新结果 |
| `reconcileResult` | guard-passed request plan + reconciliation input | `ResultReference` | 无 formal ref/surface→`reconciliation-unavailable`；cancel→unknown | 不提交 command、不生成幂等 ref |
| `keepDraft` | current safe draft + plan preserveDraft=true | same/local safe draft | stale/revoked context 或 unsafe field→blocked/cleanup | 不跨 context 保留，除非后续正式 policy 允许 |
| `exit` | plan + sessionRef | local close | host close failure只记安全 diagnostic；本地 cleanup 仍优先 | 不撤销 owner command/业务对象 |
| `PageAccessibilityMapperPort.map` | page regions/bindings + shared semantics | `AccessibilityState` | 缺三通道等价、hidden focus、key mismatch→`malformed-safe-material` | 不从 DOM/颜色/layout 猜语义 |
| `FocusAnnouncementPort` | validated state/binding | host effect only | host unavailable/cancelled→安全降级，不改业务状态 | 不接受 arbitrary text/error/owner body；辅助路径不额外执行 action |

`FocusAnnouncementPort.focus`/`announce` 的失败不能改变 context、visibility、activation、request result 或 recovery allowed actions。它可以产生 body-free `DiagnosticContext.outcome='sink-failed'` 等价的本地诊断，但正式错误分类留 Step 12/15。browser/assistive-technology 支持矩阵仍由 `CON-Q-046` 阻塞，不宣称已验证兼容。

#### 12.5 fake / formal adapter parity 与禁止越界

- fake recovery executor 必须先调用同一 `RecoveryActionGuardPort`，并模拟 missing surface、cancelled、unknown、state scope mismatch 和 host close failure；不能绕过 guard 直接返回成功。
- fake a11y mapper 必须逐项验证 visual/keyboard/assistive-technology 三通道同 actionKey；不能为测试便捷省略辅助技术 binding。
- fake focus/announcement adapter 必须只记录 key/status，不保存 rendered text、owner body 或 error string；sink/host failure 不影响业务返回。
- formal/fake recovery 均不得执行 command retry、后台 job、projection rebuild、owner repair、Policy/Gate bypass 或跨 owner fallback。

#### 12.6 `recovery` 模块停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 每个 recovery action 是否有独立 typed seam | 通过 | Step 9 需固定逐动作调用顺序与状态更新 |
| recovery 是否隐式 retry/replay | 否 | 无 generic retry/schedule/loop；reconcile 只读 formal result |
| PageAccessibilityBinding 是否显式映射 | 通过 | mapper 归 recovery，features 不反向依赖；具体 host support 留 05/06 |
| focus/announcement 失败是否改变业务 truth | 否 | 失败隔离为 host/diagnostic posture |
| unknown request 是否可绕过 formal basis | 否 | guard + reconciliation port 双门禁 |
| 局部故障是否扩散全局 | 否 | action input 保留精确 `DegradationSubject`/owner/query/request |

`recovery` 结论：`pass with pending blockers`。可以进入 `adapters`；Step 9 必须逐动作闭合 flow，Step 12/15 必须闭合安全错误/诊断映射，支持矩阵仍 pending。

<!-- STEP7_BATCH_7_7_END -->

<!-- STEP7_BATCH_7_8_START -->

### 13. Batch 7.8：`adapters` 模块正式边界 facets、可用性与 fake/formal parity

#### 13.1 `adapters` port capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | Step 6 承接 | 后续承接 |
|---|---|---|---|---|---|
| formal context / visibility / qualification | 实现 `AccessContextResolutionPort`、`VisibilityQualificationPort` | `entry`、`access`、`navigation`、`intent`、`features` | SDK/formal access adapter | `AccessContext`、`QualificationBoundary`、`VisibilityReference` | Step 8 context carrier、Step 9 resolve/revalidate flow |
| owner-safe query / field mapping | 实现 `OwnerQueryPort`、`OwnerSafeMaterialMapper` | `views`、`features`、`recovery` | per-owner query + safe-field adapter | `OwnerSafeQueryMaterial`、`SafeViewPayload`、`SourceStatusAxes` | Step 8 query/result schema、Step 9 query flow |
| controlled command | 实现 `OwnerCommandPort` | `intent` submit flow | per-owner command adapter | `ControlledCommandInput`、`OwnerCommandObservation` | Step 8 command/result schema、Step 9 submit flow |
| result reconciliation | 实现 `ResultReconciliationPort` | `intent`、`recovery` | per-owner reconciliation adapter | `ResultReference`、`RequestPresentation` | Step 8 reconciliation carrier、Step 9/13 |
| capability / topic contract observation | 实现 `TopicActivationPort` | `features` | per-owner activation adapter | `OwnerContractObservation`、`OwnerCapabilityReference` | Step 8 facet schema、Step 9 activation flow |
| safe-link revalidation | 实现 `SafeLinkPort` | `views`、`features` | formal safe-link adapter | `SafeLinkReference`、`SafeLinkNavigationIntent` | Step 8 link carrier、Step 9 navigation flow |
| optional SDK invalidation | `SdkInvalidationPort`、`SdkInvalidationMapperPort` | `entry`/state invalidation coordinator | optional public-SDK adapter | `SdkInvalidationObservation`、`InvalidationMarker` | Step 8 envelope、Step 9 invalidation、Step 13 dedup/order |
| adapter availability | `FormalAdapterAvailabilityPort` | `entry` composition root、diagnostic posture mapper | adapters registry/config binding | formal facet + owner slot | Step 14 config、Step 15 diagnostics |

Port 的语义 owner 仍是消费模块：`access` 定义语境 port，`views` 定义查询/安全材料 port，`intent` 定义 command/reconciliation port，`features` 定义 activation port；`adapters` 只实现这些接口并拥有正式边界绑定。这样调用方依赖窄接口而不依赖 adapter class、SDK client 或 transport。Step 5 中候选名 `SdkAccessPort` 不保留为泛化 client interface：它在本 Step 被拆成上述 consumer-owned narrow ports 和唯一的 `FormalAdapterAvailabilityPort`，避免通过一个 `invoke(method, body)` 重新暴露 raw SDK/owner DTO。

#### 13.2 formal boundary facet 与 availability 契约

```ts
/** Console 可绑定的正式边界槽位；不是 SDK method registry。 */
export type FormalBoundaryFacet =
  | 'access-context'
  | 'visibility-qualification'
  | 'owner-query'
  | 'owner-command'
  | 'result-reconciliation'
  | 'topic-activation'
  | 'safe-link'
  | 'sdk-invalidation';

/** 一个可用性槽位；owner 只用于 per-owner facet。 */
export interface FormalAdapterSlot {
  readonly facet: FormalBoundaryFacet;
  readonly owner?: OwnerKey;
}

/** 只描述本地 binding/合同是否足够装配，不表示远端健康或 readiness。 */
export type FormalAdapterAvailabilityObservation =
  | Readonly<{slot: FormalAdapterSlot; posture: 'bound'}>
  | Readonly<{
      slot: FormalAdapterSlot;
      posture: 'pending-contract' | 'disabled' | 'unavailable' | 'unknown';
      reasonRef?: OwnerReference<'reason'>;
    }>;

/** composition root 可读取的唯一 adapter availability 面。 */
export interface FormalAdapterAvailabilityPort {
  observe(
    slot: FormalAdapterSlot,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<FormalAdapterAvailabilityObservation>>;
}
```

`FormalAdapterSlot` 的组合规则是确定性的：`owner-query`、`owner-command`、`result-reconciliation`、`topic-activation` 和 `safe-link` 必须带 `owner`；`access-context`、`visibility-qualification`、`sdk-invalidation` 是否为全局 SDK slot 或 per-owner slot 必须由未来正式合同明确，在未明确前 `owner` 不得由 route/topic 推断。非法组合返回 `consistency-defect`。`posture='bound'` 只说明本地已有经校验的 binding 与所需正式合同；它不表示服务可达、数据 fresh、capability active、command eligible、测试通过或运行 ready。

当前校准时点没有任何 positive production binding 可以被登记为 `bound`：exact Query/Command/Result/Ref、safe-field、qualification、activation、reconciliation 和 invalidation envelope 均仍 pending。实现阶段若 authority 仍未补齐，registry 必须返回 `pending-contract`/`disabled`，不得把 SDK package 存在、方法名相似或 fake 可运行当作 `bound`。

#### 13.3 optional SDK invalidation 契约

```ts
/** 只限定当前 session/context 和显式 owner 集；不携带 cursor。 */
export interface SdkInvalidationReadInput {
  readonly scope: StateScopeBinding;
  readonly owners: readonly OwnerKey[];
}

/** 缺少 envelope authority 时必须保持 pending/disabled。 */
export type SdkInvalidationReadOutcome =
  | Readonly<{kind: 'observed'; observation: SdkInvalidationObservation}>
  | Readonly<{kind: 'pending-contract'; reasonRef?: OwnerReference<'reason'>}>
  | Readonly<{kind: 'disabled'}>
  | Readonly<{kind: 'unavailable'; reasonRef?: OwnerReference<'reason'>}>
  | Readonly<{kind: 'unknown'; reasonRef?: OwnerReference<'reason'>}>;

/** 可选的 body-free invalidation hint 读取面；不是 private bus consumer。 */
export interface SdkInvalidationPort {
  observe(
    input: SdkInvalidationReadInput,
    options?: ConsolePortCallOptions,
  ): Promise<ConsolePortResult<SdkInvalidationReadOutcome>>;
}

/** 将单个安全 hint 绑定为本地 marker；local ref 必须由 ref source 提供。 */
export interface SdkInvalidationMapperPort {
  map(
    observation: SdkInvalidationObservation,
    invalidationRef: LocalReference<'invalidation'>,
  ): ConsolePortResult<InvalidationMarker>;
}
```

`SdkInvalidationPort` 只能消费官方 SDK 公开、body-free 且经正式说明的 hint surface。它不订阅私有 bus、不保存 event payload/cursor/replay position，也不把 hint 当 owner truth change。`kind='observed'` 只允许触发 `applyClientInvalidation`、requery 或 context revalidation等收紧动作；不得直接产生 fresh/current/visible/qualified/active/confirmed。由于 event id、dedup、ordering、resume 和 cancellation 语义尚未闭合，连续 consumer 当前必须保持 `pending-contract/disabled`；重复 hint 最多重复执行幂等的本地收紧，不能驱动 command 或恢复正向状态。

#### 13.4 formal adapter implementation matrix（planned）

| consumer-owned port | planned adapter file | boundary partition | 允许输出 | 当前 positive 实现上限 |
|---|---|---|---|---|
| `AccessContextResolutionPort` | `adapters/sdk_access_adapter.ts` | official SDK/formal context | `AccessContextObservation` 或 typed port error | pending；scope/context exact surface 未闭口 |
| `VisibilityQualificationPort` | `adapters/sdk_access_adapter.ts` | formal visibility/qualification | `TopicVisibility`、`QualificationBoundary` | pending/blocked；不得复制 Policy/Gate |
| `OwnerQueryPort` | `adapters/owner_query_adapter.ts` | 每个 `OwnerKey` 独立 | `OwnerQueryObservation` | pending；exact query/result/empty/page contract 未闭口 |
| `OwnerSafeMaterialMapper` | `adapters/owner_query_adapter.ts` | per-owner safe-field mapping | `OwnerSafeQueryMaterial`→snapshot-safe material | blocked；无正式 allowlist 不构造 payload |
| `OwnerCommandPort` | `adapters/owner_command_adapter.ts` | 每个 command owner 独立 | `OwnerCommandObservation` | blocked；exact fields/metadata/idempotency 未闭口 |
| `ResultReconciliationPort` | `adapters/reconciliation_adapter.ts` | request command owner | `ResultReference` | pending；formal reconciliation semantics 未闭口 |
| `TopicActivationPort` | `adapters/topic_activation_adapter.ts`（planned） | 每个 capability owner 独立 | `TopicContractReadOutcome` | pending/read-only/blocked；不得用 feature flag 激活 |
| `SafeLinkPort` | `adapters/safe_link_adapter.ts`（planned） | link target owner | `SafeLinkReference` | pending；不得返回 URL 或未停审 L5/L6 私有 ref |
| `SdkInvalidationPort` | `adapters/invalidation_adapter.ts` | optional public SDK hint | `SdkInvalidationReadOutcome` | disabled/pending-contract；无 cursor/replay |
| `FormalAdapterAvailabilityPort` | `adapters/adapter_registry.ts`（planned） | validated local bindings | availability observation | 只能诚实返回当前 binding posture |

上表中的文件均为 planned path，不表示目标实现仓或这些文件已存在。业务模块只接收对应 interface 的注入实例；不得 import 上表 adapter implementation。`adapters` 可以 type-only 引用消费模块定义的输入/输出类型，但不得引用页面组件、DOM、router/store instance、feature composition service 或 recovery executor。

#### 13.5 adapter 调用、映射与错误边界

| 阶段 | adapter 必须做什么 | 失败姿态 | 禁止事项 |
|---|---|---|---|
| slot selection | 由 typed facet + 显式 owner 选择固定 adapter | slot 缺失→`missing-formal-surface`/`pending-contract` | 解析 opaque ref、route 或 method string 选 owner |
| request mapping | 只从 typed input 映射正式 public contract | exact schema 缺失→`missing-formal-surface` | 发送 generic JSON、draft fields、UI state 或隐藏 metadata |
| boundary invocation | 只使用官方 SDK/public formal service surface | transport→`transport-unavailable`；cancel 按读/写语义处理 | 直连 DB、private API/bus、owner source 或绕过 Policy/Gate |
| response validation | 先验证 owner、ref kind、required facet、版本/来源和 redaction | malformed→`malformed-safe-material`/`consistency-defect` | 将 HTTP/SDK success 当业务 success |
| safe mapping | 只产 Step 6/7 已定义的 safe carrier | forbidden body→`forbidden-body` 且不返回被拒材料 | 保存 raw response、error body、stack、credential/secret |
| availability reporting | 报告本地 binding/contract posture | 未知→`unknown`；缺合同→`pending-contract` | 主动探测后综合 health/readiness |

Query adapter 必须 no-write：不得把 owner query 变成 create/update/reconcile/refresh command，也不得在读取期间写 owner state、注册 capability、生成正式 result 或进行 projection repair。Command adapter 的取消若无法证明 owner 未执行，必须产出 `ambiguous-outcome` 或 `OwnerCommandObservation.kind='ambiguous'`；不得自动换 requestRef/idempotency ref 重试。Reconciliation adapter 只读正式结果，永不调用 command adapter。

来源与版本规则：owner/source/version/ref 只从正式 response 的已批准字段映射；没有 version 时保留无 version/unknown，不用响应时间、本地时间、ETag 猜测或 cache key 代替。adapter 不能更改 `SourceStatusAxes` 的任一轴来掩盖 transport/safe-field 缺口，也不能将一个 owner 的成功复制到另一个 owner partition。

#### 13.6 formal / fake parity matrix

| port family | fake 必须覆盖 | formal/fake 共同不变量 |
|---|---|---|
| access | unresolved、verified、restricted、revoked、conflict、unknown、cancelled | 无正式 refs 不得 verified/qualified；不返回角色/Policy 正文 |
| query | material、formal empty、blocked、unavailable、unknown、malformed、cancelled | Query no-write；空集合不自动等于 formal empty；轴值不提升 |
| safe mapper | allowed safe scalar/ref、missing allowlist、forbidden body、owner mismatch | 不保留被拒字段或 raw fixture；redaction marker 必填 |
| command | blocked、receipt、formal result、ambiguous、cancelled、transport failure | receipt/transport success 不等 terminal；无 exact DTO 不发送 |
| reconciliation | pending、confirmed、rejected、unknown、missing surface、cancelled | 只读；不重放；result/context/owner 同源 |
| activation | 六 facet 的 satisfied/partial/missing/unknown/not-applicable 组合 | 不用 boolean enabled、route、page 或 fake registration 产生 active |
| safe link | current、stale、revoked、unknown、missing surface | 只返回 typed ref；不返回 URL；目标仍需重验 context |
| invalidation | observed、pending-contract、disabled、unavailable、duplicate hint、cancelled | 只收紧；无 payload/cursor/replay；不触发 command |
| availability | bound、pending-contract、disabled、unavailable、unknown、invalid slot | bound 只表示 binding；不宣称 service/capability readiness |

Fake 必须经过与 formal adapter 相同的 input factory、owner/ref-kind 校验、redaction gate、错误分类和取消分支。Fixture 可以提供正式 carrier 的测试替身，但不能绕过缺失合同在 production registry 中注册 `bound`；fake 的成功仅是未来 Step 16 的测试输入，不是实现、集成或 readiness 证据。

#### 13.7 `adapters` 模块停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 正式边界是否只有 adapters 实现 | 通过 | consumer-owned narrow ports 明确；业务模块不接触 SDK client/transport |
| generic `SdkAccessPort` 是否形成穿透 | 已否决 | 拆为窄 port + `FormalAdapterAvailabilityPort`；不提供 invoke/body escape hatch |
| query/command/reconciliation 是否分离 | 通过 | query no-write；command delegate-write；reconciliation formal read-only |
| safe-field/redaction 是否在边界失败关闭 | 通过（安全骨架） | exact allowlist/schema 未闭口，positive mapper blocked |
| invalidation 是否变成 private bus consumer | 否 | optional public hint、无 cursor/replay/payload，只收紧；当前 disabled/pending |
| fake/formal parity 是否覆盖负向与取消 | 通过 | exact protocol fixtures 留 Step 8/16 |
| adapter availability 是否冒充 readiness | 否 | 仅 binding/contract posture；当前无 positive production slot 声明 |

`adapters` 结论：`pass with pending blockers`。可以进入 `state`；所有 exact formal surface 未闭口前，只允许实现接口骨架、blocked/unknown/disabled adapter 和 fake parity，禁止实现或登记 positive production binding。

<!-- STEP7_BATCH_7_8_END -->

<!-- STEP7_BATCH_7_9_START -->

### 14. Batch 7.9：`state` 模块 carrier、scope、invalidation 与 cleanup 接缝

#### 14.1 `state` port capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | Step 6 承接 | 后续承接 |
|---|---|---|---|---|---|
| scoped state load | `ClientStateCarrierPort.load` | `entry` bootstrap、context replacement、recovery | session-volatile carrier；未来获 authority 后可注入 configured medium adapter | `StateScopeBinding`、`ClientStateRecord` | Step 9 bootstrap、Step 11 lifecycle |
| immutable state replacement | `ClientStateCarrierPort.replace` | `entry`、`intent`、page/query composition | same carrier adapter | `createClientStateRecord`、draft/request/page state | Step 9 write order、Step 11 consistency、Step 13 concurrency |
| explicit invalidation | `ClientStateCarrierPort.invalidate` | SDK hint/context/status coordinator | state carrier + `applyClientInvalidation` | `InvalidationMarker`、`ClientStateRecord` | Step 9 invalidation flow、Step 11/13 |
| safe cleanup | `ClientStateCarrierPort.clear` | context switch、logout/revocation、session close、user discard | state carrier | `clearClientStateForContextChange`、scope binding | Step 9 cleanup、Step 11 retention |
| scope qualification | `StateScopeGuardPort` | every carrier operation | `state` pure implementation | `matchesStateScope` | Step 10 scope matrix、Step 16 negative tests |
| carrier posture | `ClientStateCarrierAvailabilityPort` | `entry` composition root、diagnostic mapper | state adapter binding | medium availability only | Step 14 config；04 configuration |

`state` 只持有 Console-owned interaction truth。它不是 owner repository、query cache、server session store、offline database、event log 或 audit trail；load/replace/invalidate/clear 均不得读取或写入 owner truth。当前有 authority 的安全上限是当前 browser session 内的 volatile carrier。任何 localStorage、sessionStorage、IndexedDB、cookie、service worker、server-side store、跨标签页/跨会话同步、加密、migration、TTL 或容量承诺都保持 pending，不能由实现者自行选择。

#### 14.2 state port / adapter 契约表

| 名称 | 类型 | 定义位置 | 作用 | 关键函数 |
|---|---|---|---|---|
| `ClientStateCarrierPort` | local state carrier port | `state/client_state_carrier.ts`（planned） | scoped load、whole-record replace、explicit invalidation、clear | `load`、`replace`、`invalidate`、`clear` |
| `StateScopeGuardPort` | local pure guard port | `state/state_scope.ts`（planned） | 验证 session/context exact match | `check(binding, requested)` |
| `ClientStateCarrierAvailabilityPort` | local adapter availability port | `state/client_state_carrier.ts`（planned） | 报告 session-volatile/configured/unavailable 姿态 | `observe()` |
| `EntryStateSnapshotPort` | narrowed type alias | `state/client_state_carrier.ts`（planned） | 给 `entry` 暴露 load/replace/clear | `Pick<...>` |
| `IntentStatePort` | narrowed type alias | `state/client_state_carrier.ts`（planned） | 给 `intent` 暴露 replace/invalidate | `Pick<...>` |

`EntryStateSnapshotPort` 与 `IntentStatePort` 不是额外 carrier 或 adapter；它们只是 `ClientStateCarrierPort` 的最小能力视图，分别闭合 7.1 和 7.5 中的消费名称。所有写入最终进入同一个注入的 carrier 实例，不能让 entry、intent、views 各建一份互不一致的 store。`EntryContextReplacementPort` 同样不作为独立接口存在；context replacement 是 Step 9 的 entry coordinator 顺序，调用 `clearClientStateForContextChange`、`ClientStateCarrierPort.replace/clear` 和 host presentation port。

#### 14.3 TypeScript planned port 契约

```ts
/** 明确区分不存在与 scope 错配；两者都不表示 owner object 不存在。 */
export type ClientStateLoadOutcome =
  | Readonly<{kind: 'loaded'; record: ClientStateRecord}>
  | Readonly<{kind: 'missing'; requestedScope: StateScopeBinding}>
  | Readonly<{
      kind: 'scope-mismatch';
      requestedScope: StateScopeBinding;
      storedScope: StateScopeBinding;
    }>;

/** carrier 成功写入的安全回执；不代表跨会话 durability。 */
export interface ClientStateReplacementOutcome {
  readonly kind: 'replaced';
  readonly record: ClientStateRecord;
  readonly carrierPosture: 'session-volatile' | 'configured-medium';
}

/** 仅描述本地 carrier 的装配姿态，不表示 persistence readiness。 */
export type ClientStateCarrierAvailabilityObservation =
  | Readonly<{posture: 'session-volatile'}>
  | Readonly<{posture: 'configured-medium'}>
  | Readonly<{posture: 'unavailable'}>;

/** 有界客户端 state carrier；不暴露 storage key、transaction 或 raw value。 */
export interface ClientStateCarrierPort {
  load(
    scope: StateScopeBinding,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<ClientStateLoadOutcome>>;

  replace(
    record: ClientStateRecord,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<ClientStateReplacementOutcome>>;

  invalidate(
    record: ClientStateRecord,
    marker: InvalidationMarker,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<ClientStateReplacementOutcome>>;

  clear(
    scope: StateScopeBinding,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<void>>;
}

/** 所有 carrier 操作前执行 exact scope check；不解析 opaque refs。 */
export interface StateScopeGuardPort {
  check(
    binding: StateScopeBinding,
    requested: StateScopeBinding,
  ): ConsolePortResult<StateScopeBinding>;
}

/** composition root 用于选择安全姿态；当前只允许 session-volatile 正向值。 */
export interface ClientStateCarrierAvailabilityPort {
  observe(): ConsolePortResult<ClientStateCarrierAvailabilityObservation>;
}

/** 只是同一 carrier 的窄视图，不创建第二 state owner。 */
export type EntryStateSnapshotPort = Pick<
  ClientStateCarrierPort,
  'load' | 'replace' | 'clear'
>;

/** intent 只能替换已验证 record 或应用显式 marker。 */
export type IntentStatePort = Pick<
  ClientStateCarrierPort,
  'replace' | 'invalidate'
>;
```

`ClientStateReplacementOutcome.record` 必须等于 carrier 经 `createClientStateRecord` 校验后实际采用的 immutable record，不能是旧 record、部分 merge 或 storage raw object。`carrierPosture='configured-medium'` 只表示未来有经配置绑定的实现；它不承诺 durable、encrypted、offline、跨 tab、跨 session、跨 device、TTL 或 migration。当前 authority 下 availability adapter 只能返回 `session-volatile` 或 `unavailable`；不得提前返回 `configured-medium`。

#### 14.4 load / replace / invalidate / clear 语义

| 函数 | 读写性质 | 成功语义 | 错误 / unknown 姿态 | 必须保持的不变量 |
|---|---|---|---|---|
| `load` | local read | 返回完整 validated record、明确 missing 或 scope mismatch | carrier 不可用→`state-carrier-unavailable`；取消→`cancelled`，不得把旧 record 当新读取 | loaded 只证明本地 shape/scope；不证明 context/ref/status 仍 current/fresh |
| `replace` | local whole-record write | 用一个已验证、scope-consistent record 替换当前 snapshot | scope 错配→`state-scope-mismatch`；unsafe/body→`forbidden-body`；取消后结果不确定则强制 reload | 不做 ad hoc partial merge；不生成 owner version/result/ref |
| `invalidate` | local tightening write | 先执行 `applyClientInvalidation(record, marker)`，再替换收紧后的完整 record | marker/record scope mismatch→`state-scope-mismatch`/`consistency-defect`；carrier 失败不得丢旧安全内存值 | 只 stale/invalidated/cleanup；绝不 refresh 或提升状态 |
| `clear` | explicit local cleanup | 清除给定 exact scope 的 carrier state | scope mismatch→fail closed；取消/失败后重新 load 判定，不宣称已清除 | 只由明确 lifecycle/user action 调用；不撤销 owner command/object |
| `observe` | local binding read | session-volatile/configured/unavailable | 无法判定→`state-carrier-unavailable` | posture 不等 durability/readiness |

Scope 规则：sessionRef 必须 exact equality；带 context 的 record 只能由相同 contextRef 读取/替换/失效。pre-context record 不得携带 page、draft、request、recovery 或 owner safe view。`scope-mismatch` 的 storedScope 只包含 local refs，调用方可选择显式清除，但不得自动复用或迁移。context switch/revocation/logout 必须先用 `clearClientStateForContextChange` 生成最小 state，再替换或清除旧 scope；当前默认清空 draft，不假定可跨 context 保留。

载入 state 后，`verified`、`visible`、`current`、`fresh`、`active`、`confirmed` 等正向值都不能因载体命中而重新成立。Step 9 必须安排 context revalidation、相关 owner requery/reconciliation 或本地只收紧；Step 11 再固定恢复顺序与原子性。carrier 不维护 cache TTL，不依据本地时间自动刷新或淘汰 owner truth。

#### 14.5 invalidation、并发和失败隔离

- `invalidate` 接受一个已构造的 `InvalidationMarker`，不接受 SDK event body、cursor、sequence 或 arbitrary callback。marker 只影响其精确 scope；owner/topic/view/request 之外的 partition 保持不变。
- 同一 marker 被重复应用时必须得到等价或更保守的 state；这只是本地 tightening 幂等性，不代表 SDK event dedup 已闭口。跨 marker 的 order/dedup、并发 replace 和 stale writer 处理留 Step 13。
- 在 Step 13 未闭口前，调用方必须串行化同一 session/context 的 replace/invalidate，并在取消、carrier failure 或可疑竞态后重新 `load`；不得以最后完成的 Promise 自动覆盖更新。
- state carrier failure 只使当前客户端 interaction state 降级/需重建，不得改变 owner result、资格、visibility、activation、audit 或 evidence。无法安全恢复时清理到最小 shell，而不是保留敏感旧页面。
- carrier 内不得序列化 SDK client、AbortSignal、adapter implementation、DOM/component/router/store instance、function、Error/stack、credential/secret、raw response、owner body、retry schedule 或 diagnostic payload。

#### 14.6 fake / configured / volatile adapter parity 与禁止越界

- session-volatile fake/adapter 必须覆盖 missing、loaded、scope mismatch、replace、duplicate invalidation、clear、cancelled 和 carrier unavailable；不能因为是内存 map 就跳过 object/scope/redaction 校验。
- 未来 configured-medium adapter 必须实现完全相同的 outcome/错误/cleanup 语义；不能暴露 storage key、raw serialization、transaction handle 或介质专属异常给业务模块。
- fake 与任何 production adapter 都不得在 load 时把 stale/current、pending/confirmed、pending/active 自动升级，不得通过 state 命中推导 authorization 或 readiness。
- 介质未获 authority 时，不得用浏览器 API 的“常见默认”替代配置决策；当前只允许 session-scoped volatile fallback，且 session 结束即不承诺恢复。

#### 14.7 `state` 模块停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| load/replace/invalidate/clear 是否有完整窄接口 | 通过 | Step 9 固定顺序；Step 11 固定 lifecycle/原子性 |
| scope mismatch 是否与 missing 分离 | 通过 | 两者均不推导 owner 不存在；mismatch 不自动迁移 |
| entry/intent state port 是否重复 | 否 | 两者是同一 `ClientStateCarrierPort` 的 `Pick` 视图 |
| invalidation 是否可能提升 formal 状态 | 否 | 只调用 `applyClientInvalidation` 并整体替换收紧 record |
| 介质/TTL/跨会话是否被猜造 | 否 | 当前仅 session-volatile；configured medium 仍 pending |
| carrier 命中是否冒充 freshness/readiness | 否 | load 后仍需 formal revalidation/requery/reconciliation |
| fake 是否保持 scope/redaction/negative parity | 通过 | concurrency/medium-specific contract 留 Step 11/13/16 |

`state` 结论：`pass with pending blockers`。可以进入 `diagnostics`；介质、序列化、容量、TTL、跨会话、并发和 migration 未闭口前，不得实现 configured persistence 或宣称 state 可恢复/持久。

<!-- STEP7_BATCH_7_9_END -->

<!-- STEP7_BATCH_7_10_START -->

### 15. Batch 7.10：`diagnostics` 模块 sink、redaction 与 failure isolation 接缝

#### 15.1 `diagnostics` port capability / 接缝清单

| capability / 对象能力 | 需要的接缝 | 调用方 | 实现方 | Step 6 承接 | 后续承接 |
|---|---|---|---|---|---|
| diagnostic construction | `DiagnosticContextFactoryPort` | `entry`、query/intent coordinators、`recovery` | `diagnostics` pure implementation | `DiagnosticContext`、`InteractionPhase`、`SafeOutcomeMarker` | Step 9 phase mapping、Step 15 instrumentation |
| redaction / emission eligibility | `DiagnosticRedactionGatePort` | every diagnostic emit path | `diagnostics` pure implementation | `RedactionMarker`、`isDiagnosticSafeToEmit` | Step 12 error/redaction、Step 15 |
| optional sink emission | `DiagnosticSinkPort` | diagnostic coordinator only | optional host/observability sink adapter | body-free `DiagnosticContext` | Step 8 envelope、Step 15 sink binding |
| sink posture | `DiagnosticSinkAvailabilityPort` | `entry` composition root | host/config binding adapter | enabled/disabled only | Step 14 config、04 configuration |
| failure isolation | `DiagnosticEmissionPort` | all callers through one facade | `diagnostics` coordinator | emitted/disabled/failed outcome | Step 9 call sites、Step 12 recovery |

客户端诊断是可禁用的辅助路径，不是业务主线前置。`DiagnosticContext` 只用于定位 Console 交互阶段和安全 outcome；它不是 observability owner 的 metric/audit/report body，不是 governance audit/evidence，不是 signoff/verdict，也不能用于推进 context、visibility、qualification、source axes、request result、activation 或 recovery。若没有正式 sink envelope/config，诊断必须安全地 `disabled`，而不是把 raw error 发往临时端点。

#### 15.2 diagnostics port / adapter 契约表

| 名称 | 类型 | 定义位置 | 作用 | 关键函数 |
|---|---|---|---|---|
| `DiagnosticContextFactoryPort` | local pure factory port | `diagnostics/diagnostic_context.ts`（planned） | 从批准的 safe refs/markers 构造 context | `create(candidate)` |
| `DiagnosticRedactionGatePort` | local pure guard port | `diagnostics/redaction_gate.ts`（planned） | 在 sink 前执行 body-free/redaction 检查 | `check(context)` |
| `DiagnosticSinkPort` | optional external sink port | `diagnostics/diagnostic_sink.ts`（planned） | 发出一个已通过 gate 的 context | `emit(context, signal?)` |
| `DiagnosticSinkAvailabilityPort` | local binding port | `diagnostics/diagnostic_sink.ts`（planned） | 报告 enabled/disabled 绑定姿态 | `observe()` |
| `DiagnosticEmissionPort` | failure-isolating facade | `diagnostics/diagnostic_emission.ts`（planned） | factory→gate→availability→sink，返回安全 outcome | `emit(candidate, signal?)` |

只有 `DiagnosticEmissionPort` 可被业务流程注入；调用方不得直接调用 sink 来绕过 gate/availability。sink adapter 可以绑定未来正式 observability/host surface，但 `diagnostics` 不因此拥有观测 truth，也不得将 sink receipt 当 audit/evidence。具体 envelope name/version、endpoint、sampling、batching、retention、transport 与 metric vocabulary 均保持 pending。

#### 15.3 TypeScript planned port 契约

```ts
/** 仅接受 Step 6 已批准字段；不存在 arbitrary metadata/error slot。 */
export interface DiagnosticContextCandidate {
  readonly diagnosticRef: LocalReference<'diagnostic'>;
  readonly phase: InteractionPhase;
  readonly outcome: SafeOutcomeMarker;
  readonly owner?: OwnerKey;
  readonly topicRef?: LocalReference<'topic'>;
  readonly requestRef?: LocalReference<'request'>;
  readonly traceRef?: OwnerReference<'trace'>;
  readonly redaction: RedactionMarker;
}

/** 将 candidate 交给既有 object factory；不截取或清洗 raw body。 */
export interface DiagnosticContextFactoryPort {
  create(
    candidate: DiagnosticContextCandidate,
  ): ConsolePortResult<DiagnosticContext>;
}

/** 失败时只返回错误分类，不返回被拒 context/body。 */
export interface DiagnosticRedactionGatePort {
  check(
    context: DiagnosticContext,
  ): ConsolePortResult<DiagnosticContext>;
}

/** sink 本身只接受 validated body-free context。 */
export interface DiagnosticSinkPort {
  emit(
    context: DiagnosticContext,
    signal?: AbortSignal,
  ): Promise<ConsolePortResult<void>>;
}

/** enabled 只表示 binding 存在，不表示 sink 健康或 evidence ready。 */
export type DiagnosticSinkAvailabilityObservation =
  | Readonly<{posture: 'enabled'}>
  | Readonly<{posture: 'disabled'}>;

export interface DiagnosticSinkAvailabilityPort {
  observe(): ConsolePortResult<DiagnosticSinkAvailabilityObservation>;
}

/** 每次调用都有可判别结果；failed 被隔离，不改业务返回。 */
export type DiagnosticEmissionOutcome =
  | Readonly<{kind: 'emitted'}>
  | Readonly<{kind: 'disabled'}>
  | Readonly<{
      kind: 'failed';
      errorKind:
        | 'forbidden-body'
        | 'malformed-safe-material'
        | 'consistency-defect'
        | 'diagnostic-sink-failed'
        | 'cancelled';
    }>;

export interface DiagnosticEmissionPort {
  emit(
    candidate: DiagnosticContextCandidate,
    signal?: AbortSignal,
  ): Promise<DiagnosticEmissionOutcome>;
}
```

`DiagnosticEmissionPort.emit` 故意接收 candidate 并不返回 `ConsolePortResult`：facade 内部必须执行 factory 与 redaction gate，调用方无法提交未校验的 context 或绕过 gate。construction/redaction/sink/cancel failure 必须被转换为 `DiagnosticEmissionOutcome.kind='failed'` 并与原业务结果隔离，调用方不得因诊断失败把成功 query 改为失败、把 unknown command 改为 rejected 或把 recovery action 重放。`failed.errorKind` 只能记录安全枚举，不得包含 error message、stack、HTTP status/body 或 sink response。若 factory/gate 拒绝，sink 根本不能被调用。

#### 15.4 emission 顺序、redaction 与失败隔离

确定性调用顺序：构造 `DiagnosticContextCandidate` → `DiagnosticContextFactoryPort.create` → `DiagnosticRedactionGatePort.check` → `DiagnosticSinkAvailabilityPort.observe` → disabled 时返回 `disabled`，enabled 时调用 `DiagnosticSinkPort.emit` → 映射为 `emitted/failed`。任何阶段都不读取页面 DOM、draft fields、query payload、owner response、Error 对象或 arbitrary metadata。

| 阶段 | 允许输入 / 输出 | 失败姿态 | 业务影响上限 |
|---|---|---|---|
| factory | phase/outcome + typed safe refs + redaction marker | forbidden body→`failed/forbidden-body`；invalid shape/relation→`failed/malformed-safe-material` 或 `failed/consistency-defect` | 不调用 sink；原业务结果不变 |
| redaction gate | 完整 `DiagnosticContext` | body disposition 非 absent/redacted→`failed/forbidden-body`；ref mismatch→`failed/consistency-defect` | 不回显被拒内容；不触发 recovery/retry |
| availability | 无业务 payload | disabled→`disabled` | 主线继续；不认为 observability 不可用是业务失败 |
| sink emit | gate-passed context | sink failure→`failed/diagnostic-sink-failed`；cancel→`failed/cancelled` | 不改 owner/client state；最多返回给诊断 facade |
| outcome consume | emitted/disabled/failed | 调用方可忽略或用受控本地姿态呈现 | 不递归 emit sink failure；不生成 audit/evidence |

允许进入 context 的关联值只有 Step 6 字段：`diagnosticRef`、phase、safe outcome、可选 owner/topic/request/trace ref、redaction marker。明确禁止：用户文本、draft field/value、`SafeViewPayload`、URL/query、route parameter、owner object/response body、metric/report/audit/evidence body、credential/secret、error/stack、adapter config、browser fingerprint 或任意 key/value attributes。禁止材料不能通过 hash、truncate、mask 或 stringify 变成允许材料；应在进入 factory 前拒绝。

`SafeOutcomeMarker='sink-failed'` 只允许用于另一个本地呈现/调试对象时表达此前 sink failure；为了防止递归，sink failure 处理路径不得再次调用 `DiagnosticEmissionPort.emit`。正式 Step 15 必须规定是否完全舍弃该 marker，不能创建无限 diagnostic-on-diagnostic 链。

#### 15.5 取消、sink availability 与 authority 上限

- 取消只停止诊断本地等待；业务操作的取消/unknown 语义由其原 port 独立处理。诊断取消不能撤销 query/command/recovery，也不能覆盖原 outcome。
- `enabled` 只说明经配置的 sink binding 存在；不说明 endpoint healthy、事件已持久化、审计完整、metric current、report 可用或运行 ready。
- 当前 diagnostic envelope/version/sink vocabulary 未闭口，生产 binding 的安全默认是 `disabled`。实现可提供 disabled adapter 与 failure-isolation facade；不得自行定义遥测 schema、endpoint 或采样阈值。
- 若未来 sink 是 `L4-observability` 的正式 surface，Console 仍只提交经批准的客户端 diagnostic envelope；不会读取/写入 audit/metric/report truth，也不将 response 作为证据。
- sink 失败不得写入 `ClientStateRecord` 作为业务 truth。若 UI 必须呈现辅助姿态，只能使用受控 message/status key；具体 error/recovery 映射留 Step 12/15。

#### 15.6 fake / disabled / formal sink parity 与禁止越界

- fake sink 必须覆盖 emitted、disabled、failed、cancelled 与 redaction rejection，并记录的只能是已验证 `DiagnosticContext`；不得保留 rejected candidate/raw fixture。
- disabled adapter 必须确定性返回 `disabled`，不能抛异常或导致业务流程失败；formal sink 缺合同/config 时必须使用 disabled posture。
- fake/formal sink 都不得接受 arbitrary metadata map、Error、stack、payload/body、credential、secret 或 rendered text；不得将测试日志输出当正式 audit/evidence。
- formal sink receipt/transport success（若未来存在）仍只映射为 `emitted`，不表示 durable、complete、compliant、audited 或 evidence-ready。

#### 15.7 `diagnostics` 模块停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| sink 前是否强制 factory + redaction gate | 通过 | 业务调用方只依赖 `DiagnosticEmissionPort` |
| emitted/disabled/failed 是否可判别 | 通过 | envelope/receipt exact contract 留 Step 8/15 |
| sink failure 是否改变业务结果 | 否 | failure outcome 隔离，不更新 context/result/activation/state |
| forbidden body 是否可能通过 hash/truncate 进入 | 否 | 禁止材料在 factory 前拒绝，不做“清洗后发送” |
| diagnostic 是否冒充 audit/evidence/report | 否 | 仅客户端辅助 context；无 verdict/signoff/readiness 语义 |
| 无 authority 时默认姿态 | `disabled` | 不猜 endpoint/schema/sampling/threshold |
| fake/formal parity 是否覆盖负向 | 通过 | Step 16 再定义测试切口，不伪造测试结果 |

`diagnostics` 结论：`pass with pending blockers`。十个模块的 Step 7 小循环已全部完成，可以进入 7.11 跨模块总审计；diagnostic envelope/sink/config 未闭口前，生产 sink 必须保持 disabled。

<!-- STEP7_BATCH_7_10_END -->

<!-- STEP7_BATCH_7_11_START -->

### 16. Batch 7.11：十模块停审与跨模块接缝闭环审计

#### 16.1 SOP 问题最终回答

| SOP 问题 | 最终回答 | 证据 / 限制 |
|---|---|---|
| 哪些模块需要 port，谁实现 | 十模块均有明确消费/宿主/本地接缝；正式 SDK/owner port 由 `adapters` 实现，host port 由宿主 integration 实现，本地 guard/mapper 由语义模块实现 | §6～§15；业务模块不 import transport implementation |
| repository/outbox/projection/gateway 是否需要 | Console 不需要 repository、outbox、projection、UnitOfWork、worker/job 或 server gateway；只需要 formal SDK/owner、host、state carrier、diagnostic sink adapter | §2、§5、§13～§15；这些服务端构件在本仓明确 N/A |
| 参数/返回/错误是否落码 | 是（安全骨架） | 所有正式 port 有 TypeScript callable surface，返回 `ConsolePortResult<T>` 或受控 safe outcome；exact owner protocol 仍由 Step 8 阻塞 |
| Query 读取面是否足够 | 是（Step 7 层） | context/visibility、owner material/empty/status/ref、activation facets、request result/reconciliation、state load、availability 与 diagnostic outcome 均可判别 |
| 写入 version/transaction/幂等是否闭合 | 对 Console owner-truth 不适用；本地 whole-record replace/scope guard 已闭合；owner command 幂等仅透传正式 basis | §10、§14；无 UnitOfWork/expected owner version/idempotency store |
| 取消/unknown 是否闭合 | 是 | read 取消不构造成功；delegate-write outcome 不确定时 ambiguous/unknown；reconciliation 不重放；state/diagnostic failure 隔离 |
| 每个模块是否停审 | 是 | §6.6、§7.6、§8.6、§9.6、§10.6、§11.7、§12.6、§13.7、§14.7、§15.7 |
| 跨模块是否仍有 unresolved 冲突 | 无结构冲突；存在持续 external blockers | exact formal schema/config 未闭口会阻塞 positive adapter/Step 8 精确协议/实现，但不要求在 Step 7 猜造 |

#### 16.2 十模块停审总表

| 模块 | 已闭合 port / seam | 调用方 / 实现方结论 | 读取 / 写入边界 | 持续 blocker | 结论 |
|---|---|---|---|---|---|
| `entry` | local ref、host lifecycle/presentation、state narrow view | composition root 调用 host/state adapter | 只组合 shell；无 owner read/write | framework、host binding、ref authority | pass with pending blockers |
| `access` | context resolve/revalidate、visibility/qualification、disclosure | access/entry 调用，formal adapter 实现；disclosure local | formal read + local tightening；不授权 | scope/visibility/qualification exact schema | pass with pending blockers |
| `navigation` | host route/history、selection、visibility、cleanup | navigation/entry 调用，host + local implementation | host presentation/local state only | router/config/browser support | pass with pending blockers |
| `views` | owner query、safe mapper/status、safe link、composition | views/features/recovery 调用，formal + local implementation | Query no-write；safe material only | query/result/empty/page/safe-field contract | pass with pending blockers |
| `intent` | qualification、owner command、observation mapper、reconciliation、state view | intent 调用，formal adapter + local mapper | delegate-write 与 formal read 分离；unknown 不 replay | command/result/reconciliation/idempotency | pass with pending blockers |
| `features` | activation read/map、topic/page composition、delegation guard | features/entry 调用，formal activation + local implementation | per-owner read/composition；不注册 capability | activation facets、command-action mapping | pass with pending blockers |
| `recovery` | action guard/executor、a11y mapper、focus/announce | explicit user action coordinator + host adapter | 一次一个动作；无 retry/job/owner repair | Step 9 ordering、a11y/browser matrix | pass with pending blockers |
| `adapters` | formal slots/availability、optional invalidation、所有 narrow formal implementations | 唯一 SDK/formal boundary | typed mapping；无 DB/bus/raw body；query/command/reconcile 分离 | 全部 exact formal contracts | pass with pending blockers |
| `state` | load/replace/invalidate/clear、scope/availability、narrow aliases | entry/intent/recovery 调用，同一 carrier 实现 | local whole-record state only；当前 volatile | medium/TTL/serialization/concurrency | pass with pending blockers |
| `diagnostics` | factory/redaction/sink/availability/emission facade | flows 调用 facade，optional sink 实现 | body-free optional side path；failed isolated | envelope/sink/config/support matrix | pass with pending blockers |

十个结论中的 `pass` 只表示 Step 7 port 骨架和边界冲突审计通过；`pending blockers` 仍阻止 positive production adapter、`bound/active/configured-medium/enabled` 声明以及实现启动。它不表示编译、集成、测试、运行或 readiness 已发生。

#### 16.3 duplicate port、语义归属与反向依赖审计

| 审计项 | 结论 | 校准结果 |
|---|---|---|
| 泛化 SDK client port | pass（已否决） | Step 5/02 候选 `SdkAccessPort` 不进入实现接口；按 consumer-owned narrow ports + availability slot 拆分，无 `invoke(method, body)` |
| state facade 重复 | pass | `EntryStateSnapshotPort`、`IntentStatePort` 只是同一 `ClientStateCarrierPort` 的 `Pick`，不创建第二 store |
| context replacement/invalidation port 过度抽象 | pass（已修正） | replacement 是 Step 9 coordinator；context tightening 调既有 object functions，不为纯编排伪造新 external port |
| query port 重复 | pass | 八类 topic 共用 `OwnerQueryPort`，per-owner 差异由 typed mapping/adapter partition 表达 |
| command/reconciliation 混用 | pass | `OwnerCommandPort` 唯一 delegate-write；`ResultReconciliationPort` 唯一 result read；recovery 不重发 command |
| route/history 重复 | pass | route binding 负责语义 route；history 只返回 local entry ref；两者都不拥有 visibility |
| activation/availability/readiness 混用 | pass | activation 是 capability consumption posture；adapter/state/sink availability 各有明确主语，均非 readiness |
| features/recovery 循环 | pass | `features.PageAccessibilityBinding` 单向进入 `recovery.PageAccessibilityMapperPort`；features 不反向 import recovery |
| access/views 循环 | pass | 最小 ref 类型归 access；safe payload/view 归 views；access 不引用 view model |
| adapter 反向依赖 UI | pass | adapters 只 type-only 依赖安全 input/output，不依赖 page component、router/store、feature/recovery implementation |
| state/diagnostic 成为 shared truth | pass | 两者仅提供 carrier/sink seam；不拥有业务规则、owner status 或全局 health |

依赖方向保持：`entry` 只作 composition root；consumer 模块依赖自己声明的 port；`adapters`/host/state/diagnostic implementations 由入口注入。业务模块不得 import adapter implementation，adapter 不回调 UI 组件。没有 DB、repository、projection、outbox、private bus、BFF、worker/job 或跨 owner transaction 入口。

#### 16.4 读取面、来源、version 与 public helper 审计

| 读取面 / helper | Step 7 可判别输出 | source / version 规则 | 后续仍需闭合 |
|---|---|---|---|
| access context | context lifecycle + actor/scope/visibility refs + optional qualification/visibility observation | 只来自 formal adapter；本地只收紧 | Step 8 exact response/error/reason schema |
| navigation route/history | semantic `RouteBinding` 或 undefined；local entry ref 或 undefined | host binding；不把 URL/menu 当 source | Step 9 host ordering；Step 14 binding config |
| owner query | material、formal empty、blocked、unavailable、unknown；material 含 source/status/payload/refs | owner/source/version 原样映射；无 version 不生成 | Step 8 per-owner DTO、page/cursor/empty envelope |
| safe-field mapper | redaction marker + safe scalar/ref payload | 无正式 allowlist/safe-field ref则 blocked | Step 8 field schema；Step 12 rejection mapping |
| request result | receipt/result/ambiguous；reconcile 返回四态 result ref | formal result/ref/observedAt；不使用本地时间或 transport success | Step 8 command/result schema；Step 13 idempotency |
| activation | capability + 六 facet + command surface refs 或 pending/blocked/unavailable/unknown | per-owner formal contract only | Step 8 facet/command-action mapping |
| invalidation | observed/pending-contract/disabled/unavailable/unknown，observed 只含 scope/time/reason ref | optional public SDK hint；无 event body/cursor | Step 8 envelope；Step 13 id/dedup/order |
| client state | loaded/missing/scope-mismatch + carrier posture | local immutable record；无 owner version | Step 11 lifecycle/atomicity；Step 13 local concurrency |
| diagnostic | emitted/disabled/failed | body-free context；sink receipt不升级为 audit/evidence | Step 8 envelope；Step 15 sink vocabulary |

远端 pagination/cursor 尚无 authority，因此 Step 7 不发明 repository-style `Page<T>`/`PageInfo` helper；`ClientPageWindow` 明确只裁剪已取得的安全本地 snapshot。若 Step 8 获得 owner formal page contract，必须定义 owner-specific public carrier 并回查 `OwnerQueryPort` 是否需要扩展；不能把 cursor 临时塞入 `LocalReference`、state 或 filter。所有 formal positive value 都有 source；缺 source/version 时保持 blocked/unknown/无 version，而非以 cache、local time、route 或 response order补齐。

#### 16.5 Query no-write、command/result 与失效闭环审计

| 审计主线 | port 链 | 通过条件 | 结论 |
|---|---|---|---|
| protected Query | access context → `QueryNoWriteGuard` → `OwnerQueryPort` → safe mapper/status → local composition | 无 owner mutation、implicit reconcile/refresh、cursor advance、projection repair | pass |
| controlled command | delegation qualification → command qualification → `OwnerCommandPort` → observation mapper → state replace | exact surface/fields、current context/visibility/activation/command 同源；否则 blocked | pass with external blocker |
| ambiguous command | command cancel/transport ambiguity → request unknown → `ResultReconciliationPort` | 不自动 replay；无 formal basis 不标 confirmed/rejected | pass |
| result completion | formal result → `ResultReference` → command mapper/completion guard | receipt/toast/cache/route/transport success 均不足 | pass |
| SDK invalidation | `SdkInvalidationPort` → mapper → `ClientStateCarrierPort.invalidate` | 只收紧精确 scope；显式 Query/revalidation/reconciliation 才能恢复 | pass, consumer remains pending/disabled |
| context change | formal revalidation/context switch → object cleanup → carrier replace/clear → host presentation | 清理旧 page/navigation/request/recovery；draft 当前默认清理 | pass; exact flow留 Step 9/11 |
| diagnostics | factory → redaction gate → availability → sink | disabled/failed 均不改变原业务结果；无递归 emission | pass |

Console 不存在 owner optimistic write、expected version、UnitOfWork、outbox 或 append-only truth。`ClientStateCarrierPort.replace` 是本地 whole-record replace，不声称数据库事务或跨 tab 原子性；同 scope 并发、stale writer 和 cancellation recovery 交 Step 11/13。Query 成功不能清除既有 invalidation，除非新 formal observation 被 Step 9 明确映射为新的 safe state。

#### 16.6 activation、a11y、diagnostic 与局部故障审计

| 审计项 | 结论 | 后续约束 |
|---|---|---|
| topic/owner partition | pass | 每个 owner 独立 activation/query/status；一个 partition 成功不掩盖其它 partial/unavailable/blocked |
| positive activation | structurally closed, production blocked | `active` 仅六 facet + controlled-command + verified context 成立；exact contracts 未到不得激活 |
| action visibility/qualification | pass | route/menu/page/feature flag 不授权；enabled entry仍必须经 intent guards |
| page-to-a11y mapping | pass | `PageAccessibilityBinding` 显式映射 `ActionChannelBinding`；三通道同 actionKey，不从 DOM/颜色推导 |
| focus/announcement failure | isolated | 不改 context、visibility、request result、activation 或 recovery allowed actions |
| diagnostic redaction | pass | no arbitrary metadata/body/error/stack；forbidden material 不经 hash/truncate 进入 |
| sink failure | isolated | outcome 仅 emitted/disabled/failed；不生成 audit/evidence/report/verdict/signoff |
| local degradation | pass | 精确到 context/owner/topic/view/request；不存在统一 Console health/readiness |

browser/assistive-technology 支持矩阵、host framework 和 diagnostic sink 仍由 `CON-Q-045/046` 等事项阻塞；本 Step 只闭合可落码的语义接口与否决路径，不宣称兼容性或无障碍验证已经执行。

#### 16.7 Step 8 / Step 9 / Step 10 承接矩阵

| 后续批次 | 必须逐名承接的 Step 7 内容 | 当前禁止偷渡的内容 |
|---|---|---|
| Step 8 access/navigation 协议 | `AccessContextQueryInput/Observation`、visibility/qualification outcome、host route/ref carrier | actor/profile/role 正文、URL schema、Policy/Gate rule |
| Step 8 query 协议 | `OwnerQueryInput/Observation`、safe material、formal empty/status/ref、safe link | raw owner DTO、generic JSON、假定 cursor/page/field allowlist |
| Step 8 command/result 协议 | `ControlledCommandInput`、`OwnerCommandObservation`、`ResultReconciliationInput/ResultReference` | 本地生成 CommandMetadata/idempotency、transport success终态 |
| Step 8 activation/consumer 协议 | `TopicContractReadInput/Outcome`、六 facet、`SdkInvalidationReadInput/Outcome` | feature flag active、私有 bus payload/cursor、伪 event id/dedup |
| Step 8 diagnostics | `DiagnosticContextCandidate`、emission outcome；无 Outbound Event/Operations Job | arbitrary metadata、audit/evidence/report envelope、自造 sink taxonomy |
| Step 9 function flows | bootstrap、context/visibility、owner query、draft/local preference、submit、reconcile、topic composition、conditional invalidation、recovery/a11y、state/diagnostic ordering | 隐式 retry、后台 loop/job、adapter direct import、跨 owner fallback |
| Step 10 state matrices | context lifecycle、visibility/navigation、reference/source axes、draft、request/result、activation、degradation/recovery、a11y、state scope/shell disposition | owner domain state machine、统一 health/readiness、cache/time/route 伪触发 |

概要阶段的 `SaveClientPreference`、`RequestAccessContextSwitch` 与本地 draft command 不需要新的 external port：它们由 Step 9 coordinator 调用 Step 6 pure functions 与唯一 state carrier。概要候选 `SdkAccessPort` 已由本 Step 正式裁剪为 narrow ports；Step 8 必须采用当前命名，不得重新引入 generic gateway。Outbound Event 和 Operations Job 仍明确 `N/A`。

#### 16.8 Step 6 open item 承接结论

| Step 6 承接项 | Step 7 结论 | 后续 Step / blocker |
|---|---|---|
| local ref source | `LocalReferenceSourcePort.allocate<K>` 已闭合 kind-preserving 输入/输出 | authority/跨会话策略留 Step 9/14；不可拼 route/time |
| context/visibility/qualification | 三个 formal/local seam 已闭合安全读取与 fail-closed | exact schema留 Step 8；`CON-Q-034～037` |
| host route/navigation | route/history/selection/visibility/cleanup 已闭合 | framework/config留 Step 14；browser matrix pending |
| owner query/safe field | material/empty/blocked/unavailable/unknown + mapper/status/link 已闭合 | exact per-owner protocol/safe fields留 Step 8 |
| command/result/reconciliation | delegate-write、receipt/result/ambiguous、formal read-back 已分离 | DTO/idempotency留 Step 8/13；无 basis 不 replay |
| topic activation | capability + 六 facet + per-owner mapping 已闭合 | positive production activation仍由 exact contract 阻塞 |
| state/invalidation | optional hint + marker mapper + scoped carrier 已闭合 | consumer disabled/pending；medium/concurrency留 Step 11/13 |
| page/a11y host | page binding mapper + focus/announce 已闭合 | Step 9 ordering、05/06 compatibility verification |
| diagnostics | factory/gate/optional sink/failure isolation 已闭合 | envelope/config留 Step 8/14/15；默认 disabled |
| fake parity | 每一 formal/host/carrier/sink family 均列负向/unknown/cancelled parity | exact fixtures/test cases留 Step 16，不表示测试已运行 |

#### 16.9 正式 `03` §5 / §6 回填草稿

以下仅供 Step 19 装配，不修改当前正式 `03-详细设计.md`。

**§5 模块 Trait / Port / Adapter 摘要**

- `entry` 定义 local ref 与 host lifecycle/presentation seam；只组合已验证 state/page。
- `access` 定义 context、visibility、qualification 和 disclosure seam；formal adapter 只能提供/收紧安全引用，不复制授权规则。
- `navigation` 定义 route/history、selection、visibility 与 cleanup seam；route 不等权限，history 不保存 URL/owner body。
- `views` 定义唯一 owner-safe Query、safe material/status/link mapper；Query no-write，source/status/version 不由 Console 生成。
- `intent` 定义 qualification、owner command、observation mapping 与 result reconciliation；receipt/transport success 不等正式终态，unknown 不自动重放。
- `features` 定义 per-owner activation、topic/page composition 和 delegation guard；`active` 只表示消费合同可判别，不表示 readiness。
- `recovery` 定义五种显式动作、安全 guard 和 page-to-a11y/focus/announcement seam；没有 generic retry/job。
- `adapters` 是唯一 SDK/formal-boundary implementation；泛化 `SdkAccessPort` 被否决，所有 formal slots 按窄 port 注入；optional invalidation 当前 disabled/pending。
- `state` 定义唯一 scoped carrier 与窄别名；当前仅 session-volatile，不承诺 TTL/持久/跨会话。
- `diagnostics` 定义 body-free factory/redaction/optional sink；emitted/disabled/failed 与业务结果隔离，不构成 audit/evidence/report。

**§6 Trait / Port / Adapter 索引摘要**

| 归属模块 | 索引主体 | 实现方 | 主要消费者 |
|---|---|---|---|
| `entry` | `LocalReferenceSourcePort`、`EntryHostLifecyclePort`、`EntryPresentationPort` | local/host adapter | composition root |
| `access` | `AccessContextResolutionPort`、`VisibilityQualificationPort`、`DisclosureEvaluationPort` | adapters / access local | entry/navigation/views/intent/features |
| `navigation` | `HostRouteBindingPort`、`NavigationHistoryPort`、selection/visibility/cleanup ports | host / navigation local | entry/features/recovery |
| `views` | `OwnerQueryPort`、`OwnerSafeMaterialMapper`、`SourceStatusMapper`、`SafeLinkPort`、`OwnerViewCompositionPort` | adapters / views local | views/features/recovery |
| `intent` | `CommandQualificationPort`、`OwnerCommandPort`、`CommandObservationMapper`、`ResultReconciliationPort` | adapters / intent local | intent/recovery |
| `features` | `TopicActivationPort`、mapping/composition/page/delegation ports | adapters / features local | topic/page composition |
| `recovery` | `RecoveryActionGuardPort`、`RecoveryExecutionPort`、`PageAccessibilityMapperPort`、`FocusAnnouncementPort` | recovery coordinator / host | recovery/page flows |
| `adapters` | `FormalAdapterAvailabilityPort`、`SdkInvalidationPort`、`SdkInvalidationMapperPort` | adapters | entry/state coordinator |
| `state` | `ClientStateCarrierPort`、`StateScopeGuardPort`、availability + narrow aliases | volatile/configured adapter | entry/intent/recovery |
| `diagnostics` | context factory、redaction gate、sink/availability、`DiagnosticEmissionPort` | diagnostics local / optional sink | all flow coordinators |

正式装配时每个模块必须在 §5.x.5 保留 port 表、TypeScript interface、调用方/实现方、错误/取消/读写与禁止事项；§6 逐名索引定义位置和消费者。过程批次、停审表和当前 blocker 留 calibration，不写入正式正文。

#### 16.10 持续 blocker 与实现暂停条件

| blocker 类别 | 当前状态 | 阻塞范围 | 安全上限 |
|---|---|---|---|
| `CON-Q-034～043` exact owner/专项合同 | open/pending | Step 8 DTO、positive formal adapters、topic activation/action | pending/blocked/read-only/unknown；不猜 schema |
| scope/visibility/qualification/safe-field/redaction | open/pending | access/views/features positive mapping | fail-closed/minimal；无 source 不构造 positive value |
| reconciliation/idempotency/cancel ambiguity | open/pending | command submit/replay/result recovery | unknown + formal reconciliation；无 basis 不 replay |
| SDK invalidation envelope/id/dedup/order | open/pending | optional consumer | disabled/pending-contract；显式 Query 为核心路径 |
| state medium/cache/TTL/serialization/cross-session | open/pending | configured carrier | 仅 session-volatile；不承诺 offline/durable/restore |
| diagnostic envelope/sink vocabulary/config | open/pending | production diagnostic binding | disabled；body-free facade 可落码 |
| browser/a11y support matrix、framework/router/bundler/package manager | open/pending | host adapters、compatibility、concrete UI | framework-neutral semantic contracts only |
| 性能、容量、兼容与量化阈值 authority | open/pending | 04/05/06 与实施约束 | 不写固定数字或已验证结论 |
| 未停审 L5/L6 link/ref | open/pending | safe link / peripheral navigation | 不进入主链，不消费私有状态 |

任一实现若需要发明 owner DTO/field/path/error、存储 medium、event envelope、diagnostic schema、browser support 或 quantitative threshold，必须暂停并回到对应 blocker；不得以 fake、旧 README/旧正式文档、页面存在或 SDK package 存在作为 authority。

#### 16.11 三层门禁与 Step 7 结论

| 门禁层 | 结果 | 说明 |
|---|---|---|
| Step / 模块级 | `done / pass / self_reviewed` | 7.0～7.11 完成；十模块逐一停审；duplicate/依赖/读取面/version/no-write/command-result/activation/state/a11y/diagnostic 审计通过。 |
| 文档级 | `step_stop_review` | 本 calibration 文件完成；正式 `03-详细设计.md` 未修改；未创建 Step 8 文件。 |
| 项目级 | `step_stop_review` | flow 与项目台账恢复点切换为等待用户明确授权 Step 8；持续 blocker 原样传递。 |

Step 7 技术结论：所有跨模块、宿主与正式外部接缝均已有可落码的安全 port/adapter 骨架，Step 8/9/10 可以逐名承接；结构上没有需要继续在 Step 7 猜造的冲突。流程结论：立即停审，未经用户明确授权不得创建或进入 Step 8。未创建实现仓、源码、package、测试或构建产物，未运行测试，未伪造 baseline、commit、run_id、artifact、report、evidence、verdict、signoff 或 readiness；当前不需要提交 commit。

<!-- STEP7_BATCH_7_11_END -->
