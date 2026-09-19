# Step 11. 持久化、事务与一致性契约

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 11  
> 回填章节：未来正式 `03-详细设计.md` §10  
> 粒度参考：`projects/L1-governance/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md`  
> 状态：`done / pass / self_reviewed`

## 1. 目标与适用性裁剪

L1-governance 用 logical store、repository、version、UoW 和 outbox 闭合服务端真相。本项目借鉴其“所有对象逐项判定、函数语义、事务表、失败恢复、anti-pattern 和跨 Step 审计”粒度，但结论完全不同：Console 没有数据库、repository、projection、outbox、audit store、idempotency store 或 UnitOfWork；唯一可写介质是 scoped `ClientStateCarrierPort`，当前唯一正向 binding 是 session-volatile。

## 2. 数据所有权实现表

| Data/object | Owner | Writer | Reader | Consistency requirement |
|---|---|---|---|---|
| `ClientStateRecord` | Console `state` | carrier replace/invalidate/clear | entry/intent/views/recovery | whole-record immutable replace; exact scope |
| `NavigationState` | Console `navigation` | explicit navigation/context cleanup | page/shell | embedded in record; no separate store |
| `DraftIntent[]` | Console `intent` | edit/validate/submit-link/discard | intent/page/recovery | context-bound; terminal cleanup |
| `RequestPresentation[]` | Console `intent` | formal observation mapper + record replace | page/recovery | formal refs only; no command body |
| `TopicPageModel[]` | Console presentation | explicit safe composition + record replace | shell | safe view/ref only; invalidatable |
| `RecoveryPlan[]` / a11y | Console interaction | recovery/page mapper | page/host | deterministic, no scheduled action |
| `InvalidationMarker[]` | Console state | formal hint/local cleanup mapper | state/recovery | body-free, monotonic tightening |
| owner safe snapshots/refs | owner truth; Console cached view only | formal query mapper | views/features | never owner truth; revalidate/invalidate |
| context/visibility/qualification/result/activation | formal owner-derived | adapter observation, local tightening | all client flows | positive state never restored from carrier |
| diagnostic context | ephemeral client carrier | diagnostic facade | optional sink | not persisted by Console design; no audit/evidence |

## 3. Logical carrier contract

| Logical object | Key/scope | Index/order | Version | Durability |
|---|---|---|---|---|
| one `ClientStateRecord` | exact `(sessionRef, optional contextRef)` | one record per injected carrier scope | no owner/optimistic version; `stateRef` is identity only | session-volatile currently |
| `topicPages` | topic key canonical order | deterministic array inside record | none | follows record |
| `drafts` | `draftRef` canonical order | unique within record | none | follows record; cross-context default clear |
| `requests` | `requestRef` canonical order | unique within record | none | follows record; no result body |
| `recoveries` | `planRef` canonical order | unique/current subject | none | follows record |
| `invalidations` | `invalidationRef` canonical order | body-free bounded collection; retention pending | none | follows record |

This is a logical contract, not permission to choose localStorage/IndexedDB/cookie/server sync. Serialization schema, quota, encryption, TTL, migration and cross-tab/session/device semantics are blocked by `CON-Q-044` and belong to 04/implementation once authority exists.

## 4. Carrier function semantics

| Function | Lock/transaction | Return | Error | Consistency rule |
|---|---|---|---|---|
| `load(scope, signal?)` | one carrier read; no DB tx | loaded/missing/scope-mismatch | unavailable/cancelled/malformed | validate full object before exposing; loaded does not restore formal currentness |
| `replace(record, signal?)` | atomic whole-record replacement in one carrier instance | exact adopted record + posture | scope/forbidden/unavailable/cancel ambiguous | no partial merge; uncertain completion requires reload |
| `invalidate(record, marker, signal?)` | compute tightened record then whole-record replace | exact tightened record | scope/consistency/unavailable/cancel | marker applies exact scope; never refresh/elevate |
| `clear(scope, signal?)` | exact-scope deletion/forget | void | mismatch/unavailable/cancel ambiguous | no owner revoke; uncertain completion requires reload |
| `observe()` | binding read only | session-volatile/configured/unavailable | carrier unavailable | currently configured-medium cannot be positive |

The adapter must serialize same-scope mutations per Step 13 or expose a compare/exchange contract in a future approved revision. Since Step 7 has no expected local revision field, implementation must not pretend lost-update protection exists. Until revised, same-scope coordinators are single-writer and operations are sequential.

## 5. Flow transaction boundaries

| Scenario | Begin | Commit | Rollback/failure | Must be atomic together |
|---|---|---|---|---|
| preference/draft local write | after input/scope validation | carrier adopts full record | no owner effect; return typed failure | one whole record only |
| context switch | formal resolve occurs outside carrier operation | cleaned record replace completes | if replace uncertain reload; shell stays restricted | cleanup changes within one record; host presentation separate |
| owner query | none | none | return query surface | no state write inside Query |
| topic composition installation | after all safe partitions compose | explicit record replace | failed replace does not change owner observations | page/ref/status set in one record |
| controlled submit | owner command is separate external transaction | local request presentation replace | local failure never compensates/replays owner; response keeps formal observation | no distributed atomicity claimed |
| formal reconciliation install | formal read outside carrier | explicit request replace | failed replace may be retried as read+map, not command | one request record update |
| invalidation | marker validated before carrier call | tightened whole record adopted | failure preserves safe in-memory state and requires reload/requery | marker + all affected local cleanup in one replacement |
| session close/logout | cleanup/clear requested | carrier clear + shell close each independently observed | either failure keeps restricted/closed presentation; no owner effect | no cross-adapter transaction claimed |
| diagnostic/focus/presentation | none | host/sink result only | isolated | never bundled with business state |

## 6. Consistency strategies

| Concern | Strategy | Recovery |
|---|---|---|
| same scope lost update | single-writer coordinator; sequential mutation; future revision field requires design change | reload and rebuild from formal/local inputs |
| stale async response | capture operation/context/owner/topic refs; discard if current scope changed before install | issue explicit new query if user requests |
| owner/local split | formal call and carrier replace are intentionally not atomic | preserve formal safe ref in response; reconcile/requery; never compensate by command replay |
| duplicate invalidation | `applyClientInvalidation` must be idempotent tightening | same result or more conservative state |
| out-of-order invalidation | no ordering contract; only conservative application allowed | remain stale/unknown and requery; positive state only formal read |
| carrier corruption | reject entire record; do not partial salvage sensitive fields | clear exact scope and bootstrap minimal shell |
| context change | exact cleanup; old record not migrated | create/replace new minimal scoped record |
| cache/TTL | no authority; no timer-based freshness | formal invalidation/requery only |
| partial owner results | partitions remain independent; deterministic composition order | retain safe completed partitions and mark others accurately |

## 7. Query no-write and safe installation

All Step 8 Query functions are pure/formal reads. They may return a safe view/ref/status but cannot call carrier replace, mark fresh, repair page state or reconcile a command implicitly. Installation is a separate caller operation that rechecks current scope and operation correlation. This separation prevents late responses from overwriting a newer context and makes Query tests assert zero carrier writes.

## 8. Cleanup and retention matrix

| Trigger | Clear/retain | Formal revalidation required |
|---|---|---|
| context switch/logout/revoked | clear page/navigation/request/recovery/invalidation; drafts default clear | yes |
| context expired/conflict/unknown | remove sensitive page/action; safe draft only if current policy permits (currently default clear) | yes |
| owner/view invalidation | mark exact partition stale/invalidated; preserve unrelated owners | requery affected partition |
| request invalidation/unknown | retain body-free request/receipt/result refs; block replay | reconciliation if surface exists |
| explicit draft discard | remove/mark discarded draft only | no owner action |
| session end | session-volatile state has no recovery guarantee | new bootstrap |
| diagnostic sink failure | retain no diagnostic payload by default | none |

No numeric retention or capacity default is invented. A bounded implementation policy must be specified by 04 before configured persistence; until then session lifecycle is the only reliable bound.

## 9. Failure recovery

| Failure | Safe result | Forbidden compensation |
|---|---|---|
| carrier unavailable at bootstrap | minimal restricted shell | infer state from URL/DOM/owner body |
| load malformed/forbidden body | reject whole record, clear exact scope when possible | salvage unknown fields |
| replace completion unknown | reload; if still unknown use minimal shell | assume success or repeat owner command |
| formal read succeeds, install fails | return observation plus local-state failure/recovery | rewrite owner state |
| owner command observation succeeds, install fails | return formal observation; reconcile later | resubmit command |
| clear fails on logout | remove presentation in memory; report isolated diagnostic; retry only explicit safe cleanup | leave visible sensitive page |
| invalidation contract disabled | no consumer write; formal queries remain source | synthesize event/cursor/order |

## 10. Anti-patterns

| Invalid design | Why | Required rule |
|---|---|---|
| browser DB/server DB for owner snapshots | creates second truth | one bounded carrier of safe client state only |
| repository/projection abstraction in Console | implies server ownership | use carrier port and formal owner adapters |
| `stateRef` as version/idempotency key | wrong semantics | identity only; owner keys come from formal contract |
| partial object merge | can retain stale/unsafe fields | validate and replace whole record |
| load restores `verified/current/active/confirmed` | carrier is not formal authority | revalidate/requery/reconcile |
| local TTL makes owner data fresh/expired | no authority | formal observation/invalidation only |
| command retry after local save failure | duplicate side effect risk | formal reconciliation only |
| cross-context draft migration by default | disclosure risk | clear unless formal policy later permits |

## 11. Cross-Step closure audit

| Audit | Conclusion |
|---|---|
| Step 6 owned fields have a carrier location | pass; all Console state is within `ClientStateRecord` or ephemeral |
| Step 7 port semantics complete | pass; load/replace/invalidate/clear outcomes and failure semantics explicit |
| Step 8 DTO storage | pass; only local commands explicitly install; owner DTO/body never persisted |
| Step 9 ordering | pass; formal operation, pure mapping, scoped install separated |
| Step 10 state guard | pass; carrier load never restores positive formal state |
| repository/UoW/outbox/projection applicability | explicit not-applicable |
| local concurrency honesty | pass with Step 13 dependency; no false CAS/version claim |
| retention/medium | blocker retained; no invented browser storage/TTL |
| failure recovery | pass; reload/clear/requery/reconcile, never hidden owner compensation |

持续 blocker：state medium/serialization/TTL/capacity/migration/cross-session (`CON-Q-044`), exact invalidation ordering/dedup, framework lifecycle and owner contracts. Step 11 `done/pass/self_reviewed`；正式 03 仍关闭；允许进入 Step 12。没有数据库设计、代码、测试结果或 commit。
