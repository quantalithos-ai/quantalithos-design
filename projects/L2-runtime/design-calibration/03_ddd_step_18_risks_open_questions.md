# L2-runtime 03 Step 18: blocker、风险与未闭合项级联审计

> 创建日期: 2026-08-09
> 状态: done
> 本 Step 只登记 blocker/pending/waiting/fail-closed；不补上游正向接口、不声称 readiness

## 1. Upstream blocker cascade

| Blocker | Upstream owner/seam | Affected objects | Affected Ports/protocols/Flows/states | Config/test/implementation impact | Fail-closed rule |
|---|---|---|---|---|---|
| `L2R-UP-001` | L2-tools + L4-sandbox action/receipt/feedback/cleanup | `ActionCandidate`, `ActionDecision`, `ActionPreconditionDecision`, `ActionSubmissionAttempt`, `SideEffectMarker`, `ActionFeedbackRecord`, `RecoveryDecision` | `InvocationCallerPort`; `EvaluateActionPreconditions`, internal Submit, feedback consumer, effect reconcile; SM-07/08/10/12; Runtime has no Sandbox Port | invocation slot blocked; fake only candidate/reject/unknown; negative tests no execution/cleanup success; phases IU-06/07 blocked | missing/pending/unknown never Allowed, Completed, cleanup-complete or retry permission |
| `L2R-UP-002` | safe handoff material producer/route/observed/ack seam | `SafeHandoffMaterial`, `HandoffAttempt`, `HandoffGap`, `HandoffReconciliationRecord` | `HandoffSubmissionPort`/`EventPublisherPort`; CreateHandoff, internal submit, ack consumer, gap job; SM-14/13 | handoff/publisher slots pending; outbox candidate/gap tests; IU-09/10 blocked | local outcome commits first; candidate/ack/gap never delivered/accepted/observed |
| `L2R-UP-003` | Core tools schema/SDK client | canonical action contract/input refs | `InvocationCallerPort`, action protocol secondary types | no local shadow tool schema; contract tests use typed placeholder refs; IU-01/06 waiting | no positive tool submit without formal schema |
| `L2R-UP-004` | model owner route/secret/quota/cost/semantic adapter | `LogicalModelSelection`, `ModelIntent`, `ModelTurn`, `ModelSubmission`, `ModelSemanticResult`, `ModelDecision` | ModelDecisionPort; Start/Classify/Consume; SM-06/17 | model slot Candidate/Blocked only; fake finite semantic results; IU-05 blocked | provider-neutral only; no route/secret/quota/cost/raw body/readiness |
| `L2R-UP-005` | durable episodic/semantic memory owner | `RetrievalRequest`, `MemoryCandidate`, `SourceAvailability`, working window/use | MemoryRetrievalPort/ContextRepository; Compose/Record/Refresh/Compact/queries; SM-05/15 | durable slot blocked; working-only tests; IU-04 blocked | no durable body/write/retention/delete/readiness; pending optional vs required explicit |
| `L2R-UP-006` | Runtime-specific Core/Bus/Observability schemas/routes | envelopes, event payloads, outbox snapshots, projection/view markers | EventPublisher/EventInbox/Projection; all consumers/outbound/query/job; SM-16/18 | compile/event route remains candidate; protocol schema validation pending; IU-01/10/13 waiting | no local shared authority or delivered/observed claim |
| `L2R-UP-007` | Sandbox/Observability implementation qualification absent | adapter availability, handoff/projection/observation candidates | Sandbox/Handoff/Projection/Event/Observation adapters; SM-14/16/17 | blocked/candidate fake only; no production positive test/evidence; IU-06/09/10/12 blocked | design files/fakes/ping cannot produce Ready/observed |
| `L2R-UP-008` | dirty Method Library current workspace | source/definition refs and progress inputs | DefinitionResolver/SourceResolver; progress/context/source flows; SM-03/15 | immutable baseline unavailable; current formal content only; IU-03/04 waiting | no commit/rev/immutable claim; conflicting definition remains pending |

## 2. Cross-cut / entry blockers

| Blocker | Affected surface | Required posture |
|---|---|---|
| `L2R-CP-001` | checkpoint physical atomicity/serialization/status/reconcile; SM-11/12; Commit/Resume flows | `Prepared`/`CommitPending`/`CommitUnknown` distinct; no stable/resume positive qualification |
| `L2R-ENTRY-001` | actor/member/product entry, API/worker/jobs binding | external entry supplies typed actor/scope; no member/product lifecycle in Runtime; entry blocked until boundary closes |
| `L2R-IMPL-001` | all planned implementation files/tests | target repo absent; all implementation units planned/blocked/waiting only |
| `L2R-LANG-001` | Rust baseline | Rust 2024/1.93 planned baseline; exact dependencies/runtime/transport/DB/scheduler not selected |
| `L2R-HIST-001` | historical protocol counts | old 15-command/merged event tables are historical material; current 02 per-item list controls 17 command contract |

## 3. Risk cascade by design invariant

| Risk | Origin | Failure if unhandled | Detection/test cut | Mitigation boundary |
|---|---|---|---|---|
| `R-01` local commit vs receipt conflation | CP/Tools/Handoff | duplicate effect or false stable/outcome | commit unknown/receipt mismatch tests | typed receipts + fences + local-first UoW |
| `R-02` capability/approval/execution merge | action orchestration | unauthorized/unguarded external action | guard unknown/owner boundary tests | separate views/Ports/objects |
| `R-03` model raw/provider leakage | model adapter | secret/body/cost leakage | body-free schema/redaction tests | logical selection + semantic result only |
| `R-04` durable memory ownership drift | memory mediation | retention/index/body duplication | working-only negative tests | refs/candidates/use records |
| `R-05` late event reverse write | consumers | old result overwrites current truth | event ordering/inbox tests | append/quarantine/new decision |
| `R-06` projection becomes truth | query/rebuild | stale view changes domain status | projection cursor/gap tests | history-only rebuild/read-only store |
| `R-07` unbounded loop/recovery retry | runtime loop | duplicate side effects/run divergence | budget/fence/lease tests | checkpoint/continuation/unknown manual |
| `R-08` config fail-open | builder/slot | blocked seam activated | profile/slot tests | typed blocked adapter/no Ready |
| `R-09` entry lifecycle creep | API/worker/jobs | member/product container ownership drift | entry negative tests | facade-only entry boundary |
| `R-10` historical pollution | old 03/README/count tables | wrong inventory/implementation | 17-count and old-phrase audit | historical_material record |

## 4. Open questions that block positive qualification

| Question | Owner needed | Affected Step | Current answer |
|---|---|---|---|
| exact Core runtime metadata/ref/error schema and version | L0-core | 7/8/14 | compile candidate only; pending exact contract |
| Bus event route/ordering/receipt schema | L0-bus | 7/8/9/13/15 | event seam; no route/readiness |
| Tools canonical action/receipt/feedback/cleanup contract | L2-tools/Sandbox | 7/8/9/10/12/13 | pending/fail-closed |
| model semantic adapter and owner route policy | model owner | 7/8/9/14 | provider-neutral candidate only |
| durable episodic/semantic memory lifecycle | memory owner | 7/8/9/11/14 | working-only refs; pending |
| checkpoint physical commit/reconcile | persistence owner | 7/9/10/11/12/13 | CP-001 blocked |
| Observability positive handoff/observed backend | L4-observability | 7/8/9/15 | candidate observation only |
| actor/member/product entry boundary | entry owner | 8/9/14/17 | external pending |
| target implementation repository and exact dependency versions | implementation owner | 17 | absent; no implementation authorization |

## 5. Formal assembly gate impact

Step 19 may assemble the formal document only with blocker states preserved as `pending`, `blocked`, `waiting`, `unknown` or `fail-closed`. It may not replace a missing positive contract with a local definition, fake readiness, test result, artifact/report/evidence alias or acceptance verdict.

## 6. Step gate

| Check | Result |
|---|---|
| all upstream blockers cascade to object/Port/protocol/Flow/state/config/test/phase | pass |
| no blocker locally redefined as positive implementation | pass |
| historical conflicts recorded without current truth pollution | pass |
| formal assembly impact explicit | pass |

```text
step_18 = done
next_allowed_action = step_19_delete_and_rebuild_formal_03
```
