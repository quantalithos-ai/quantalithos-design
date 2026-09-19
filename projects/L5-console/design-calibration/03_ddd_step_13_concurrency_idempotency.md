# Step 13. 并发、幂等与重入保护

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 13  
> 回填章节：未来正式 `03-详细设计.md` §12  
> 粒度参考：`projects/L1-governance/design-calibration/03_ddd_step_13_concurrency_idempotency.md`  
> 状态：`done / pass / self_reviewed`

## 1. 目标与适用性

Console 的真实并发问题是浏览器异步响应、重复点击、同 scope local state writer、context switch、per-owner fan-out 和 optional invalidation；它不拥有服务端 row/version/idempotency store/event/job。L1-governance 的逐场景、key、重复处理、重入和测试粒度被保留，服务端 optimistic lock/UoW/job 语义不迁入。

## 2. Concurrency principles

| Principle | Contract |
|---|---|
| one scoped writer | 同 `(sessionRef, contextRef)` 的 carrier mutation 由 composition root 串行化；Step 7 无 CAS/revision，不宣称多 writer 安全 |
| correlation guard | async result install 前核对 operation/context/owner/topic/request refs；late result 不覆盖新 context |
| query isolation | Query may run concurrently; each owner partition independent; installation deterministic |
| command single flight | 同一 draft/request attempt 只允许一个 `OwnerCommandPort.submit` in-flight；重复交互不触发第二次 submit |
| owner idempotency authority | owner key/digest/window/replay 只由正式 contract 提供；Console 不生成或储存自有替代物 |
| ambiguity stops mutation | side effect outcome unknown 时进入 unknown and reconcile；禁止自动/隐式 replay |
| monotonic invalidation | duplicate/out-of-order hint may only retain or tighten local state |
| recovery explicit | recovery action一次只执行一个 narrow port；no background loop/backoff/scheduler |

## 3. Concurrency scenarios

| Scenario | Conflict resource | Control | Failure surface | Test cut |
|---|---|---|---|---|
| two local edits same draft | scoped `ClientStateRecord.drafts` | same-scope serial queue; later action validates current draft ref/state | invalid-state-combination/reload | deterministic edit order; stale editor rejected |
| preference vs context cleanup | whole record | context cleanup invalidates queued old-context write by correlation guard | state-scope-mismatch | old patch cannot restore old topic/filter |
| query finishes after context switch | page/snapshot install | capture contextRef; discard result on mismatch | context-not-current | late safe result not installed |
| two queries same owner/topic | owner view | distinct operationRef; latest accepted install chosen by coordinator policy only when same context/input identity; otherwise both returned without overwrite | consistency-defect/ignored late | reverse completion order |
| per-owner topic fan-out | `TopicPageModel` partitions | independent calls; canonical descriptor order at composition | partial/unavailable per owner | completion order does not alter page |
| invalidation races query | snapshot axes | invalidation monotonic; query may restore only if its formal observation is known newer/current under formal contract; otherwise retain stale/unknown | unknown/stale | invalidation after/before response |
| double click submit | draft/request attempt | single-flight key `(draftRef, attemptRef)` in local coordinator; disable all equivalent channels via shared semantic | blocked/in-flight | visual+keyboard simultaneous action |
| submit completes after cancel | owner side effect | adapter dispatch boundary; possible dispatch→ambiguous | unknown | cancel before/after dispatch |
| carrier replace completion uncertain | whole record | mandatory reload; no second owner call | carrier unavailable/unknown | adapter writes then times out |
| reconciliation calls overlap | same request | concurrent reads allowed; install only same/new formal observation; never submit | unknown/consistency defect | pending vs confirmed completion order |
| focus/diagnostic overlap | host/sink | isolated promises | host/sink failure only | no business state change |

## 4. Idempotency applicability matrix

| Interface | Key source | Window | Duplicate handling |
|---|---|---|---|
| local preference save | canonical scope + patch equality inside current call | current state snapshot only | unchanged replacement/no-op; no persistent idempotency record |
| draft discard | draftRef + terminal state | draft lifetime | already discarded remains terminal; submitted is error, not duplicate success |
| context switch | operationRef + target/current context correlation | one in-flight action | coalesce only exact local in-flight request; new formal resolve still authoritative |
| delegated owner Command | formal owner-provided key/digest only | formal contract only | pending; no production submit until exact semantics exist; duplicate UI action blocked locally |
| formal Query | none required | n/a | repeat read allowed; no write/replay record |
| recovery action | planRef + action + current subject identity | one invocation | stale/completed plan rejected; no implicit action replay |
| SDK invalidation | formal event/dedup identity pending | pending | no consumer activation; duplicate observed hint only idempotent tightening |
| Outbound Event / Job | n/a | n/a | not present |

Local `operationRef`, `requestRef`, `attemptRef`, `stateRef` and `invalidationRef` are correlation identities, not owner idempotency keys. Hashing draft fields or using timestamp/random UUID would still be an unauthorized idempotency invention.

## 5. Single-flight state (ephemeral, not truth)

Implementation may maintain an ephemeral in-memory controller keyed by safe local refs to suppress duplicate UI continuations, subject to these rules:

- it is not serialized into `ClientStateRecord` and creates no new truth/status;
- losing it on reload cannot authorize replay;
- it holds `AbortController`/Promise handles only, never owner/draft body;
- it is cleared on settled/cancelled/context switch, but ambiguous command retains `RequestPresentation.unknown` in normal state;
- visual/keyboard/assistive triggers share the same action key and controller.

The exact controller library/framework is pending and belongs to implementation/config, not the domain schema.

## 6. Duplicate and reentry handling

| Reentry source | Guard | Result | Recovery |
|---|---|---|---|
| repeat Query | query no-write + operation correlation | independent safe response | install only under current scope |
| repeat local save | current record equality/state guard | unchanged/replaced once | reload on uncertainty |
| double owner submit | single-flight + draft submitted transition | second entry blocked | formal reconcile first attempt |
| page recompose | deterministic canonical inputs | identical semantic model | replace presentation only |
| duplicate invalidation | exact marker/scope + monotonic function | same or more conservative record | requery explicitly |
| repeated recovery click | plan/action single-flight | second blocked until settle | recompute plan from result |
| host route callback loop | compare semantic route/entry; route never authorizes | no-op or guarded select | re-read visibility if needed |
| diagnostic recursion | diagnostic failure cannot emit another diagnostic | failed outcome stops | none |

## 7. Unknown and owner replay protocol

```text
submit started
  -> prove not dispatched: caller may start a new fully-qualified attempt explicitly
  -> receipt/result: map formal observation
  -> may have dispatched but no outcome: RequestPresentation.unknown
       -> formal reconcile available: read only
       -> no reconcile: wait / exit
       -> retry-command: blocked unless future FormalReplayBasis + owner contract explicitly permits
```

Even when `FormalReplayBasis` has refs, current `CON-Q-038` remains open; therefore no production replay path is active. A future revision must define owner operation name, idempotency key source, digest coverage, window, duplicate result surface and cancellation boundary before enabling it.

## 8. Invalidation order rules

Because event id/sequence/order are pending, no last-write-wins logic is permitted. Applying an invalidation after a query always keeps the affected local subject conservative. Applying a query after an invalidation can restore positive state only if the formal contract proves the query observation is current relative to that invalidation; without such proof, the UI remains stale/unknown and asks for an explicit fresh read. Never compare local timestamps to decide authority.

## 9. Test cuts

| Test | Assertion |
|---|---|
| same-scope mutation serialization | no lost local updates under defined coordinator |
| context switch rejects late install | old context query/page cannot return |
| canonical owner fan-out | completion order does not change model/order |
| double submit all channels | exactly one owner port call |
| cancel boundary | before dispatch blocked; after possible dispatch unknown |
| carrier ambiguous write | reload required; no owner replay |
| duplicate invalidation | equivalent/more conservative state only |
| invalidation/query race | no local timestamp-based freshness |
| overlapping reconciliation | terminal formal observation not overwritten by older pending result |
| diagnostic/focus concurrency | business result invariant |

## 10. Cross-Step audit

| Audit | Conclusion |
|---|---|
| all mutable local resources identified | pass |
| idempotency key computable where claimed | pass; only local equality keys; owner idempotency deliberately pending |
| duplicate command safe | pass at UI single-flight; production replay blocked |
| query no-write | pass |
| carrier lost-update honesty | pass with single-writer constraint; no false revision/CAS |
| invalidation order honesty | pass; no activation until contract |
| a11y duplicate path | pass; shared semantic/single-flight |
| tests map each concurrency branch | pass |

持续 blocker：`CON-Q-038` owner idempotency/reconciliation/replay、SDK invalidation id/order/dedup、state carrier revision/medium、framework async coordinator semantics。Step 13 `done/pass/self_reviewed`；正式 03 仍关闭；允许进入 Step 14。无 worker/job、无锁/DB、无测试结果或 commit 声明。
