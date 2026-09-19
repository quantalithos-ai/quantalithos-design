# Step 14. 配置引用与外部依赖绑定

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 14  
> 回填章节：未来正式 `03-详细设计.md` §13  
> 粒度参考：`projects/L1-governance/design-calibration/03_ddd_step_14_config_external_binding.md`  
> 状态：`done / pass / self_reviewed`

## 1. 目标与范围裁剪

本 Step 只定义 browser client 需要的 typed composition/binding points；完整 config 文件格式、env/profile、secret、endpoint、timeout/TTL、browser matrix 和产品选择留给未来正式 `04-配置设计.md`。没有 authority 的值一律不写默认数字。

Console 的业务模块不读取 config；`entry` composition root、`adapters` registry、`state` carrier binding、host integration 和 optional diagnostics sink 通过已验证依赖对象注入。配置不得改变 truth owner、visibility/qualification gate、safe-field/redaction、Query no-write、unknown/no-replay 或 a11y equivalence。

## 2. Typed binding objects

```ts
export type ConsoleRuntimeProfile = 'local-fake' | 'integration-pending' | 'production-pending';

export interface ConsoleAdapterBindingRef {
  readonly slot: FormalBoundaryFacet | 'host-route' | 'host-a11y' | 'state-carrier' | 'diagnostic-sink';
  readonly profile: ConsoleRuntimeProfile;
  readonly bindingRef: LocalReference<'diagnostic'>;
}

export interface ConsoleClientBindingConfig {
  readonly profile: ConsoleRuntimeProfile;
  readonly adapterBindings: readonly ConsoleAdapterBindingRef[];
  readonly enableSdkInvalidation: boolean;
  readonly enableDiagnostics: boolean;
}

export interface ConsoleRuntimeDependencies {
  readonly adapters: FormalAdapterAvailabilityPort;
  readonly hostLifecycle: EntryHostLifecyclePort;
  readonly hostPresentation: EntryPresentationPort;
  readonly hostRoute: HostRouteBindingPort;
  readonly hostA11y: FocusAnnouncementPort;
  readonly stateCarrier: ClientStateCarrierPort;
  readonly diagnostic: DiagnosticEmissionPort;
}

export declare function buildConsoleRuntime(
  config: ConsoleClientBindingConfig,
  dependencies: ConsoleRuntimeDependencies,
): ConsolePortResult<ConsoleEntryDependencies>;
```

`bindingRef` 是 local configuration correlation，不是 endpoint/secret/owner ref；production binding 只有在 exact formal contract + safe-field + qualification + result/reconciliation authority 存在时才可从 `pending` 转 `bound`。当前所有 owner slots 保持 `pending-contract`，state 只允许 session-volatile，diagnostics 可 disabled。

## 3. 配置引用表（binding point only）

| Binding point | Reader | Injected interface | Current safe default/upper bound | 04 handoff |
|---|---|---|---|---|
| runtime profile | entry composition | `ConsoleRuntimeProfile` | local-fake only for design/fake | profile format |
| owner context/visibility/query/command/result/activation/link | adapters registry | narrow Step 7 ports | pending-contract/blocked; no positive adapter | owner endpoint/SDK binding |
| host lifecycle/presentation/route | entry/navigation | host ports | framework-neutral pending | router/framework/browser matrix |
| state carrier | entry/state | `ClientStateCarrierPort` | session-volatile or unavailable | medium/serialization/TTL |
| SDK invalidation | adapters/state | `SdkInvalidationPort` | disabled/pending-contract | event envelope/id/order/dedup |
| diagnostics | diagnostics | `DiagnosticEmissionPort` | disabled permitted | sink/envelope/version |
| a11y focus/announcement | recovery/entry | `FocusAnnouncementPort` | host-bound pending | support matrix/message keys |
| client window/filter | views/features | typed local fields | no persistence promise | preference policy |

No binding point accepts arbitrary URL, route string, feature flag as authority, raw JSON, secret, owner body, storage key, or private SDK instance.

## 4. External dependency binding matrix

| Dependency | Binding seam | Used by | Failure posture |
|---|---|---|---|
| official `@quantalithos/sdk` / formal owner services | `adapters` narrow ports | access/views/intent/features | missing surface/transport unavailable/unknown; no direct module import |
| identity/member-service | per-owner context/query ports | member topic/access | pending/blocked/partial; no lifecycle/role truth |
| work/process/workspace | independent owner query ports | project/workspace topic | per-owner partial/unavailable; no projection/cursor |
| method-library/artifact | query/safe-link/command facets | method topic | read-only/pending until exact contract |
| governance/artifact | safe query/qualification/result refs | governance topic | read-only/pending; no verdict/Gate truth |
| observability | read-safe metric/audit/report refs | observability topic/diagnostics | disabled/read-only; no audit owner |
| capability-hub | capability/activation port | capability topic | pending/blocked; no registration/readiness |
| archive/sandbox | safe refs/query only | archive/sandbox topics | pending/blocked; no archive/restore/run command |
| browser host/router/a11y | host ports | entry/navigation/recovery | host-binding-unavailable; no URL-derived authority |
| configured state medium | state carrier | entry/intent/views/recovery | session-volatile fallback; no durability claim |
| optional diagnostic sink | diagnostic port | all flows | emitted/disabled/failed; business isolated |

No sibling project is a compile-time or direct service dependency of Console design; all cross-project behavior is via formal SDK/service boundary and typed adapter.

## 5. Binding order and fail-closed startup

```text
validate profile/config shape
  -> register narrow formal/host/state/diagnostic slots
  -> observe adapter availability
  -> reject forbidden boundary switches
  -> build ConsoleEntryDependencies
  -> bootstrap shell with session-volatile/minimal state
```

`buildConsoleRuntime` must not mark a slot active merely because a package, method name, route, fake, or config flag exists. Missing optional diagnostic/invalidation bindings can produce disabled runtime posture. Missing context/query/command contracts leave affected features pending/blocked while unrelated local shell/navigation remains safe.

## 6. Forbidden configuration matrix

| Forbidden switch | Why | Required result |
|---|---|---|
| change truth owner or add local owner projection | second truth | reject config |
| direct DB/repository/private bus/BFF/worker/job | bypass formal boundary | reject design/config |
| disable context/visibility/qualification/safe-field guard | security bypass | reject config |
| convert Query to refresh/reconcile/write | violates no-write | reject config |
| convert receipt/transport/toast/cache into confirmed/current/active | false state elevation | reject config |
| enable command without exact owner contract/idempotency/reconciliation | unsafe side effect | pending/blocked, not active |
| enable invalidation without event id/order/dedup contract | unsafe stale propagation | disabled |
| persist raw owner/external body or credentials | forbidden boundary | reject config and material |
| make a11y channel run separate action logic | second path | reject binding |
| configure sibling private schemas as local truth | boundary breach | reject dependency |

## 7. Config/external binding stop review

| Check | Conclusion |
|---|---|
| config ownership isolated to composition/adapter binding | pass |
| every external dependency has a narrow seam | pass |
| missing dependency posture explicit | pass; pending/blocked/unavailable/disabled |
| config cannot alter state/truth/security invariants | pass |
| state medium/TTL/endpoint values not invented | pass; deferred to 04 |
| sibling dependency裁剪 | pass; no direct repo or private surface |
| test/implementation handoff | Step 16/17 input recorded |

持续 blocker：framework/router/browser support, state medium/TTL, exact SDK owner contracts, SDK invalidation envelope, diagnostic sink, performance/compatibility authority. Step 14 `done/pass/self_reviewed`；正式 03 仍关闭；允许进入 Step 15。没有写 config file、实现、测试结果或 commit。
