# Step 15. 可观测性与审计埋点契约

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 15  
> 回填章节：未来正式 `03-详细设计.md` §14  
> 粒度参考：`projects/L1-governance/design-calibration/03_ddd_step_15_observability_audit.md`  
> 状态：`done / pass / self_reviewed`

## 1. Boundary statement

Console owns only optional, body-free client diagnostics. It does not own formal audit, evidence, compliance record, observability truth, trace truth, report or readiness. Formal owner `traceRef` can be correlated but never created/interpreted as proof. Diagnostic disabled/failed cannot change the business outcome.

## 2. Diagnostic envelope and sink contract

`DiagnosticContextCandidate` → factory → redaction gate → availability → sink is the only permitted chain. The authoritative field set is Step 6/7: diagnosticRef, interaction phase, safe outcome, optional owner/topic/request/trace refs, redaction marker. There is no arbitrary attributes map.

| Stage | Input | Output | Failure isolation |
|---|---|---|---|
| candidate build | typed refs/enums only | candidate | do not read DOM/body/error text |
| factory | candidate | validated `DiagnosticContext` | failed/malformed; no sink call |
| redaction gate | context | same safe context | forbidden-body/consistency; no rejected material returned |
| availability | none/body-free slot | enabled/disabled | disabled is normal optional posture |
| sink | validated context | emitted or typed failure | business response unchanged |

Envelope name/version, transport, batching, sampling, retention and backend are pending `CON-Q-045/046` and 04/operations; until formalized the sink may remain disabled.

## 3. Structured diagnostic/log cuts

| Location | Level/class (semantic, backend-neutral) | Allowed fields | Purpose |
|---|---|---|---|
| bootstrap start/end | lifecycle | phase/outcome/session correlation via diagnosticRef only | diagnose host boot posture |
| context resolve/revalidate | access | phase/outcome, optional owner/trace ref | distinguish restricted/unknown/unavailable without body |
| owner query partition | query | owner, topicRef, outcome | locate partial partition; no payload/filter text |
| delegated submit | submit | requestRef, owner, outcome | distinguish started/receipt/result/unknown; no command/draft body |
| reconciliation | reconcile | requestRef/outcome/traceRef | observe read-only recovery |
| invalidation | query/context | owner/topic/outcome | observe local tightening; no event payload/id/cursor until contract |
| recovery action | recovery | request/topic ref, safe outcome | action path without raw reason |
| host/a11y | accessibility | safe outcome, topic/request ref | equivalence/host failure |
| diagnostic sink failure | internal safe counter/outcome only | error kind enum | prevent recursion |

No log level mapping (debug/info/warn/error), SDK logger, console API, persistence or retention is asserted; the table defines semantic cuts only.

## 4. Metric cuts

Metrics are optional diagnostic aggregates, not owner/business metrics and never thresholds/verdicts.

| Metric concept | Type | Cut | Allowed low-cardinality dimensions |
|---|---|---|---|
| client operation outcome | counter | protocol/flow completion | phase, safe outcome, owner key where applicable |
| formal adapter availability | gauge/snapshot | registry observation | facet, posture |
| owner partition posture | counter/snapshot | topic composition | topic key, owner, pending/partial/blocked/unavailable |
| command ambiguity | counter | submit mapper | owner, outcome=`unknown` |
| local carrier outcome | counter | load/replace/invalidate/clear | operation, carrier posture, safe error kind |
| accessibility host outcome | counter | focus/announce | operation, safe outcome |
| diagnostic emission | counter | facade result | emitted/disabled/failed + safe failure kind |

Forbidden labels: actor/scope/object/request/receipt/result/trace opaque values, route/URL/query, free text, field names from owner payload, stack/error message, secret/token, browser fingerprint, run/test/evidence id. No alert threshold or SLO is invented.

## 5. Formal audit / evidence matrix

| Event/flow | Console diagnostic allowed | Console formal audit/evidence allowed | Owner responsibility |
|---|---|---|---|
| navigation/query | body-free interaction diagnostic | no | query/access owner records its own audit if required |
| delegated command | submit/receipt/result/unknown diagnostic | no | command owner records formal command/audit/decision |
| reconciliation | read outcome diagnostic | no | result owner owns result/reconciliation truth |
| governance/SoA/AIIA/control view | owner safe refs/status only | no local verdict/evidence | governance/artifact owners |
| observability/archive/sandbox/capability view | safe read posture | no local report/readiness | respective owner |
| invalidation | local applied/disabled diagnostic | no consumer audit receipt | SDK/owner contract if formally defined |
| recovery/a11y | action/host diagnostic | no | no business audit implied |

Sink receipt or successful emit is never audit/evidence/signoff. A displayed owner audit ref remains a ref, not Console-created evidence.

## 6. Forbidden-field guard

The following must fail before sink/log/metric/state: user text, draft fields/values, `SafeViewPayload` contents, raw request/response/event/command/result, policy/gate rationale, evidence/audit/report body, URL/query/path params, DOM/component tree, cookie/token/credential/secret, error message/stack, SDK private type, adapter config/endpoint, storage key, arbitrary metadata.

Hashing, truncating, masking or serializing forbidden content does not make it allowed. Only approved typed refs/enums may cross.

## 7. Failure and recursion rules

- factory/gate failure does not call sink;
- sink failure returns diagnostic `failed` and cannot emit another diagnostic about itself;
- disabled sink returns `disabled`, not an application error;
- cancellation returns diagnostic failed/cancelled only; original Query/Command/Recovery surface stands;
- no diagnostic failure creates `DegradationState` for owner data or changes access/request/activation;
- diagnostics cannot trigger retry, requery, reconciliation or command replay.

## 8. Observability test cuts

| Cut | Assertion |
|---|---|
| candidate whitelist | only Step 6 fields accepted |
| forbidden body | factory/gate rejects and sink not invoked |
| disabled sink | business outcome unchanged, diagnostic disabled |
| sink failure/cancel | no recursion, business state invariant |
| low-cardinality metrics | no opaque refs/free text/secret labels |
| formal audit separation | no Console audit/evidence object/event/store |
| owner trace ref | optional safe correlation only, no proof inference |
| a11y diagnostic | failure does not create alternative action path |

## 9. Stop review

| Check | Conclusion |
|---|---|
| log/metric/diagnostic cuts located in code flows | pass |
| field whitelist and redaction executable | pass |
| formal audit/evidence boundary explicit | pass |
| sink failure isolation | pass |
| backend/threshold claims avoided | pass |
| Step 16 verification inputs available | pass |

持续 blocker：diagnostic envelope/version/sink, backend, sampling/retention, metric vocabulary, browser support and quantitative thresholds. Step 15 `done/pass/self_reviewed`；正式 03 仍关闭；允许进入 Step 16。未生成日志、指标、artifact、report、evidence 或测试结果。
