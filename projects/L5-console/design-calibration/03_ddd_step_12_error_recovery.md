# Step 12. 错误模型、异常分支与恢复口径

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 12  
> 回填章节：未来正式 `03-详细设计.md` §11  
> 粒度参考：`projects/L1-governance/design-calibration/03_ddd_step_12_error_recovery.md`  
> 状态：`done / pass / self_reviewed`

## 1. 目标与分批

本 Step 将 Step 6 construction violation、Step 7 `ConsolePortError`、Step 8 protocol surface、Step 9 异常分支、Step 10 非法迁移和 Step 11 carrier 一致性失败统一为可编码错误与恢复矩阵。L1-governance 的分层映射粒度被保留；HTTP/RPC code、server transaction、worker/job/DLQ 不适用于 Console，不迁入。

| 批次 | 内容 | 状态 |
|---|---|---|
| 12.1 | error layers、module taxonomy、retry class | done |
| 12.2 | Command/Query/consumer/host mapping | done |
| 12.3 | exceptional branches 与 recovery matrix | done |
| 12.4 | redaction/diagnostic/a11y 与跨 Step 审计 | done |

## 2. Error layers

```text
object factory / state transition
  -> ObjectConstructionViolation
module guard / adapter / host / carrier
  -> ConsolePortError
application-local protocol entry
  -> LocalCommandOutcome / QuerySurface / RequestPresentation / RecoveryPresentation
page + accessibility
  -> safe semantic status + explicit recovery action
optional diagnostic facade
  -> emitted / disabled / failed (business result unchanged)
```

Raw `Error`, SDK private exception, HTTP status/body, stack, credential, request/draft/owner body may be inspected only inside an adapter long enough to classify and redact; it must not cross the adapter boundary or determine an owner business state by string parsing.

## 3. Error taxonomy

### 3.1 Object construction violations

| Violation | Owner module(s) | Trigger | Retry | Mapping |
|---|---|---|---|---|
| `empty-opaque-value` | all | local/formal ref value empty | no, fix input/adapter | `malformed-safe-material` or `invalid-state-combination` |
| `duplicate-item` | views/features/state | canonical key duplicate | no, fix mapper/state | `consistency-defect` |
| `unsafe-field` | views/intent/diagnostics | unapproved field/value | no | `forbidden-body` or blocked construction |
| `missing-formal-source` | access/views/intent/features | required owner source/ref absent | after contract/formal read | `missing-formal-surface` |
| `invalid-state-combination` | all state owners | discriminant/field/transition mismatch | no, reload or fix caller | same-named port error |
| `forbidden-body` | adapters/views/state/diagnostics | raw body/credential/secret enters carrier | no | reject and redact; never persist/emit |

Construction failure is local and body-free. It never proves owner rejection/not-found and never emits an owner command.

### 3.2 `ConsolePortErrorKind` definitive semantics

| Error kind | Detection owner | Meaning | Retry class | Protocol/presentation mapping |
|---|---|---|---|---|
| `missing-formal-surface` | adapter registry/mapper | required current formal contract absent | wait for contract / user action | blocked/pending; no call |
| `unsupported-operation` | query/command guard | operation not in approved surface | never until design changes | blocked |
| `context-not-current` | access/state/intent | context not verified/current for operation | explicit revalidation | restricted/blocked |
| `visibility-not-current` | access/navigation/views | visibility/link not current | explicit visibility/link requery | hidden/restricted/blocked |
| `qualification-unknown` | access/intent | formal qualification unavailable/unknown | explicit revalidation | blocked; never denied/qualified inference |
| `malformed-safe-material` | adapter/mapper | supposedly safe output violates typed schema | manual/adapter fix | unknown/blocked; drop material |
| `forbidden-body` | every boundary | prohibited content detected | never with same input | reject/drop; safe diagnostic only |
| `transport-unavailable` | formal/host adapter | call cannot produce a formal observation | user requery/revalidate; never blind command retry | unavailable; command may be unknown depending dispatch |
| `cancelled` | any async port | local wait cancelled before side effect ambiguity | user action | prior state retained; no success/reject inference |
| `ambiguous-outcome` | owner command adapter | owner side effect may have happened, outcome unavailable | formal reconciliation only | request `unknown` |
| `reconciliation-unavailable` | reconciliation adapter | no usable formal result lookup | wait/exit; no replay | unknown/blocked |
| `state-scope-mismatch` | state guard/carrier | requested and stored local scopes differ | explicit cleanup/new scope | restricted/blocked |
| `state-carrier-unavailable` | state/entry | local carrier unavailable or outcome cannot be established | reload/rebootstrap | minimal restricted shell |
| `diagnostic-sink-failed` | diagnostics | optional sink failed | none for business; later diagnostic retry only if explicit | diagnostic `failed`; business unchanged |
| `host-binding-unavailable` | entry/navigation/recovery | route/presentation/focus host unavailable | user/host recovery | safe local state, degraded presentation |
| `invalid-state-combination` | object/guard | legal types in illegal state relation | reload/fix caller | blocked; no mutation |
| `consistency-defect` | mapper/composition/carrier | impossible cross-ref/owner/context relation | manual/design/adapter fix | fail closed; discard affected material |

`retryDisposition` must agree with the table: `never`, `user-action`, `formal-reconciliation`, or `unknown`. It is advice for the UI, not an automatic retry instruction.

### 3.3 Module error ownership

| Module | Creates/classifies | Must not classify |
|---|---|---|
| `entry` | host binding, shell/state scope failure | auth/readiness/owner business error |
| `access` | context/visibility/qualification/disclosure failure | Policy/Gate reason from raw material |
| `navigation` | route shape, selection, history/visibility mismatch | authorization from route/menu |
| `views` | query no-write, safe material/source/link mismatch | owner not-found from empty payload |
| `intent` | draft/state/qualification/request mapping; ambiguous command | owner rejection from transport code |
| `features` | topic-owner/capability/facet/page/a11y binding mismatch | readiness/compliance/verdict |
| `recovery` | stale plan/action/request/context mismatch | generic retry eligibility |
| `adapters` | SDK/formal mapping/transport/contract classification | exposing raw exception/body |
| `state` | scope/carrier/object consistency | owner freshness/terminal result |
| `diagnostics` | factory/redaction/sink failure | business outcome replacement |

## 4. Protocol error mapping

### 4.1 Local Command mapping

| Scenario | Surface | State write | Caller recovery |
|---|---|---|---|
| invalid metadata/ref/scope | `LocalCommandOutcome.blocked(invalid-state-combination/state-scope-mismatch)` | none | correct entry/rebootstrap |
| context/visibility/qualification not current | blocked | optional local tightening only | revalidate/query/exit |
| unsafe/forbidden draft field | blocked `forbidden-body` | do not save unsafe value | edit/discard |
| local carrier unavailable | blocked | unknown if write dispatched; reload | minimal shell/reload |
| user cancels local-only action | cancelled | prior state retained unless write outcome unknown | inspect/reload |
| recovery action disallowed/stale plan | blocked | none | select current allowed action |

### 4.2 Delegated Command mapping

| Internal branch | `SubmitControlledIntentResponse` / request phase | Automatic retry | Required action |
|---|---|---|---|
| exact command mapper missing | blocked `missing-formal-surface` | no | wait for formal contract |
| pre-submit context/qualification/command invalid | blocked | no | revalidate/edit/exit |
| adapter proves no dispatch and transport unavailable | blocked/unavailable; submitted request may be removed if no call occurred | no automatic | user may explicitly retry after full requalification |
| formal receipt | `presented/accepted` | no | wait/reconcile as offered |
| formal pending result | `presented/pending` | no | reconcile/wait |
| formal confirmed/rejected result | matching terminal phase | no | display formal result |
| cancel/timeout after possible dispatch | `presented/unknown` + `ambiguous-outcome` | forbidden | reconciliation/wait/exit |
| formal result malformed/body forbidden | `unknown` + consistency error | forbidden | adapter/manual fix; no reinterpretation |
| local carrier fails after formal observation | response preserves observation, local save error surfaced separately | forbidden | reload then formal reconciliation/read |

### 4.3 Query mapping

| Internal condition | `QuerySurface` | Body/view | Writes |
|---|---|---|---|
| formal explicit empty | `empty` | absent | none |
| visibility/disclosure/contract blocked | `blocked` | absent/minimal shell outside Query | none |
| transport/owner surface unavailable | `unavailable` | absent or previously safe stale view held by caller, never returned as new value | none |
| ambiguous/malformed formal result | `unknown` | discard affected new material | none |
| partial/stale material | `value` with exact `SourceStatusAxes` if safe | safe fields only | none |
| local request missing | `empty` | absent; not owner not-found | none |
| carrier scope mismatch/corrupt | blocked/unknown | discard record | none |
| cancellation | unknown or port cancelled mapped without new value | prior caller state unchanged | none |

### 4.4 Conditional consumer mapping

| Condition | Outcome | State mutation |
|---|---|---|
| contract absent | `disabled` / pending-contract | none |
| source/scope unsupported | `ignored` only when provably out of scope; otherwise blocked | none |
| malformed/forbidden envelope | blocked | none; body not retained |
| safe observation | applied marker | monotonic local invalidation only |
| duplicate safe observation | applied/ignored equivalently | idempotent tightening only |
| order/dedup cannot be established | blocked/unknown | may conservatively stale exact scope, never restore |

No HTTP/RPC/Event numeric mapping is declared because the Console exposes no server endpoint and exact SDK surface is pending. Adapters may map a formal transport internally but public application code only sees the typed surfaces above.

## 5. Exceptional branch handling

| Scenario | Detection point | Handling | Audit/event |
|---|---|---|---|
| direct URL/menu tries hidden topic | access/navigation guard | block or minimal shell; clear unsafe selection | no audit/event; optional safe diagnostic |
| owner returns forbidden body | adapter mapper/redaction | reject entire affected material | no body; optional `blocked` diagnostic |
| one topic owner unavailable | owner query adapter | mark only partition unavailable; compose remaining safe partitions | no business event |
| all topic owners empty | formal observations | only then page can be formal empty | none |
| context revoked during query | install guard | discard late result; clear sensitive state | optional safe diagnostic |
| context changes during command wait | command mapper/install guard | outcome unknown unless formal result binds old context; do not expose in new context | reconciliation under original safe refs or exit |
| route/presentation fails after state change | host adapter | state remains safe; show minimal recovery via available channel | diagnostic only |
| focus/announcement fails | a11y host | preserve business result and semantic bindings | diagnostic only, no recursion |
| diagnostic sink fails | diagnostic facade | return `failed`; do not re-emit failure | no audit/evidence |
| carrier malformed | state load | reject whole record, clear exact scope when possible | safe diagnostic without record body |
| carrier write ambiguous | state adapter | mandatory reload; minimal shell until known | diagnostic only |
| formal result schema changes | adapter | `malformed-safe-material`/unknown; no field guessing | contract blocker |

## 6. Recovery matrix

| Subject/error | Allowed recovery | Blocked recovery | Completion evidence |
|---|---|---|---|
| expired/conflict/unknown context | revalidate-context, exit | owner command/query normal path before new context | new formal context observation |
| revoked context | exit or acquire a new formal context | reuse prior refs/draft/request in new context | new formal context; never local reuse |
| stale/partial/degraded owner view | requery, exit; keep safe stale presentation if disclosure permits | refresh by cache/timer; choose source in conflict | new formal owner query observation |
| unavailable query surface | user requery later/exit | background loop hidden from user | formal response |
| unknown request | reconcile-result when ref/surface exists, wait, exit | command replay | formal result/reconciliation observation |
| missing reconciliation surface | wait/exit | replay or infer from receipt | future formal contract/result only |
| unsafe/malformed material | discard affected material; adapter/manual fix | best-effort field salvage | new valid formal material |
| state scope/corruption | clear scope/rebootstrap | migrate/merge unknown record | newly validated local record + formal revalidation |
| host/a11y failure | alternate equivalent channel, exit | bypass guard via keyboard/AT | same semantic action outcome |
| diagnostic failure | ignore for business; optional later safe diagnostic | retry business operation | none required |

Recovery is explicit and reason-specific. There is no “retry all.” `RecoveryPlan.allowedActions` is the executable ceiling; the plan/action itself never proves the subject recovered.

## 7. Cancellation matrix

| Operation | Cancel before dispatch | Cancel after possible side effect | State rule |
|---|---|---|---|
| formal Query | cancelled/unknown, no new value | no owner mutation; still no partial success | retain/tighten prior state |
| delegated Command | blocked/cancelled if adapter proves no dispatch | ambiguous-outcome/unknown | never rejected/confirmed/replayed |
| carrier replace/clear | prior state if adapter proves no write | reload required | no success claim |
| host presentation/focus | host failure/cancelled | safe business state preserved | alternate channel/minimal shell |
| diagnostic emit | diagnostic failed/cancelled | business result unchanged | no recursive diagnostic |

## 8. Redaction and safe explanation

Allowed error fields: `kind`, safe `source`, local `operationRef`, approved `reasonRef`, retry disposition. Forbidden: arbitrary message/details/map, stack, status body, URL/query, draft fields, safe payload copied wholesale, actor/profile, Policy/Gate rationale, evidence/audit/report body, credential/secret/token, storage key, browser fingerprint.

User-facing text is selected from controlled local `messageKey` based on typed error/posture. The text cannot reveal whether an invisible owner object exists. A missing `reasonRef` must not be replaced by adapter error text.

## 9. Diagnostic and formal audit boundary

Console may emit a body-free `DiagnosticContext` through an optional sink. It does not create or claim formal audit, trace, evidence, report or compliance records. A safe owner `traceRef` may be linked but not interpreted. No Console error branch writes an outbound event or audit record. Formal owner auditing of a delegated command, if any, is owner responsibility and cannot be inferred from Console receipt/result.

## 10. Cross-Step closure audit

| Audit | Conclusion |
|---|---|
| every Step 7 error kind has semantics | pass |
| Step 8 protocol branches map typed errors | pass |
| every Step 9 exceptional path has recovery ceiling | pass |
| Step 10 illegal transitions map errors | pass |
| Step 11 consistency failures avoid owner compensation | pass |
| retryable vs non-retryable vs manual | pass; user action/formal reconciliation/design fix distinguished |
| cancellation and ambiguous command | pass; never auto replay or terminal inference |
| redaction/forbidden body | pass; rejected content never carried forward |
| audit/diagnostic distinction | pass |
| HTTP/RPC/Event code honesty | pass; intentionally pending/not-applicable |

持续 blocker：exact owner error/result/reconciliation taxonomy、adapter dispatch boundary、diagnostic envelope/message vocabulary、state medium、browser/a11y behavior matrix。Step 12 `done/pass/self_reviewed`；正式 03 仍关闭；允许进入 Step 13。未实现、未执行测试、未制造 evidence/readiness。
