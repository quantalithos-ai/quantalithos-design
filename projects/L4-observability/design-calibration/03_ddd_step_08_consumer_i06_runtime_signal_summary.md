# L4-observability 03-详细设计 Step 08 - S08-E Consumer I06 `ConsumeRuntimeSignalSummary`

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 08
> 状态: `defined_with_affected_open`；不是 runtime-ready 或 unconditional complete
> 回填目标: 正式 `03-详细设计.md` §7；只在 Step 19 装配

## 1. Scope and authority

I06 接收 authenticated Runtime producer 提供的 body-free safe signal summary，最多形成
Observability 自有的 safe-signal/correlation/reference observation。它不拥有 runtime execution、
run lifecycle、log/metric/trace body、provider result、sandbox result 或业务 truth。

| item | exact contract |
|---|---|
| protocol | `ObservationInboundConsumerName::ConsumeRuntimeSignalSummary` |
| stable code | `0x0306` |
| producer | `ObservationProducerFamily::Runtime`；authenticated registration only |
| payload | `RuntimeSignalSummaryPayload`，owner=`contracts::events` |
| assembler | `ObservationInboundInputAssembler::consume_runtime_signal_summary` |
| service | `ObservationInboundEventService::consume_runtime_signal_summary` |
| result | `ObservationConsumerResult` -> shared `ObservationConsumerReceipt` |
| reserved flow | `ConsumeRuntimeSignalSummaryFlow` |
| locator | Step 14 config/runtime binding；不进入 payload/digest/result |

Current Step 06 input row、digest registry、finite operation/producer map 与 Step 07 exact callables
共同固定本 schema；旧 Step 09 `pass` 和其 target table 只作 historical diagnosis，不是本协议 owner。

## 2. SOP 23-question closure

| area | I06 answer |
|---|---|
| caller/handler/transport | authenticated Runtime event -> worker exact slot -> assembler -> inbound service；async completion via C-05 |
| envelope | shared `ObservationInboundEventEnvelope<RuntimeSignalSummaryPayload>`；header before payload |
| target construction | complete application input is constructable；accepted local signal/correlation landing remains affected |
| missing fields | required payload field reject；optional correlation remains absent and cannot be minted |
| actor | effective `ActorSafeRef` only from trusted worker binding |
| error | finite protocol/application/domain/repository/UoW mapping；no runtime/provider body |
| idempotency | logical `(operation, actor, dedup_key)` plus secondary `(I06, Runtime, source_event_ref)` |
| result/replay | exact immutable stored Consumer receipt；duplicate only via `Replayed` access |
| audit/redaction | body-free refs and finite kinds only；no raw signal or execution body |
| downstream | one reserved Step 09 flow；no generic Consumer flow |
| cross-protocol | shared carrier/recovery/action affected remain explicit |

Questions specific to Query/page or trusted-source actor exceptions beyond the registered Runtime
integration are not applicable. The authenticated producer does not authorize a payload actor,
visibility bypass, body admission or business-truth write.

## 3. Public payload schema

```rust
/// Body-free runtime signal summary admitted by I06.
pub struct RuntimeSignalSummaryPayload {
    pub runtime_signal_ref: RuntimeSandboxSignalRef,
    pub signal_summary_ref: SafeSignalSummaryRef,
    pub signal_kind: SafeSignalKind,
    pub correlation_context_ref: Option<CorrelationContextRef>,
}

impl ObservationInboundPayload for RuntimeSignalSummaryPayload {
    const CONSUMER: ObservationInboundConsumerName =
        ObservationInboundConsumerName::ConsumeRuntimeSignalSummary;
    const PRODUCER: ObservationProducerFamily = ObservationProducerFamily::Runtime;
}
```

| field | authority | validation / target | missing or forbidden fallback |
|---|---|---|---|
| `runtime_signal_ref` | authenticated Runtime body-free contract | exact runtime boundary ref; copied to private input | required; no run id, trace id, locator or source-event cast |
| `signal_summary_ref` | producer safe-summary projection | nonempty typed ref; candidate `SafeSignal.summary_ref` | required; no log/metric/trace body or synthetic summary |
| `signal_kind` | finite producer schema | static Runtime-kind compatibility; candidate `SafeSignal.signal_kind` | required; no route/default/string classifier |
| `correlation_context_ref` | optional explicit local relation ref | if Some, exact local context lookup and runtime relation | absence stays None; no `trace_ref` or current latest context substitution |

Payload contains no actor、tenant、credential、run state、execution result、raw telemetry、timestamp、
source/version、dedup or transport fields. Those shared authorities remain in the envelope/worker context.

## 4. Exact callables and construction

```rust
pub trait ObservationInboundInputAssembler: Send + Sync {
    fn consume_runtime_signal_summary(
        &self,
        actor_ref: ActorSafeRef,
        envelope: ObservationInboundEventEnvelope<RuntimeSignalSummaryPayload>,
    ) -> Result<ConsumeRuntimeSignalSummaryInput, ApplicationError>;
}

pub trait ObservationInboundEventService: Send + Sync {
    fn consume_runtime_signal_summary<'a>(
        &'a self,
        input: ConsumeRuntimeSignalSummaryInput,
    ) -> ApplicationServiceFuture<'a, ObservationConsumerResult>;
}
```

The concrete input contains the six Consumer controls owned by Step 06 plus the four payload fields:
operation context、inbound event identity、request digest candidates、source/source-version/schema
relation and typed business values. Assembly is synchronous, zero-I/O and all-or-nothing.

```text
select I06 + authenticated Runtime registration
  -> validate source event/source/version/schema/dedup/time/trace
  -> decode only RuntimeSignalSummaryPayload
  -> validate four payload fields and explicit Option tag
  -> canonicalize one candidate set
  -> construct one private I06 input
```

Wrong producer/name/schema/body binding never falls through to I07 or another decoder.

## 5. Canonical material and identity

Exact request material order after the shared I06 prefix is:

```text
runtime_signal_ref
signal_summary_ref
signal_kind
correlation_context_ref (explicit Option tag)
```

The prefix remains operation、effective actor、producer、source event、source、optional source version
and schema. `dedup_key`、occurred_at、trace_ref、delivery attempt、transport cursor、generated refs、
row version and raw material are excluded. One canonicalizer call yields the candidate set consumed
unchanged by reserve/save/replay.

| relation | rule |
|---|---|
| same logical + event + digest, Completed | exact stored replay; no handler or resolver rerun |
| same logical, different digest | conflict; winner hidden |
| same source event, changed dedup | secondary conflict; no second writer |
| compatible Reserved | in-flight; no recursive polling or default Retry |
| index disagreement/result corruption | consistency/manual path; no receipt reconstruction |

## 6. Local landing and UoW boundary

I06 input is constructable, but current Step 06/07 does not select one total I06 landing for the
`correlation_context_ref=None` branch or prove whether a signal is created, an existing context is
linked, a gap is recorded, or the operation is a durable no-op. Register:

```text
S08-E-I06-DURABLE-LANDING-01=open_internal_affected
```

Closure must provide an exhaustive matrix with one of these explicit results per branch: exact
`SafeSignal` transition through its owner, owner-backed correlation/reference transition, owner-backed
gap transition, or durable no-change receipt. It may not create a generic input marker or choose the
first/latest correlation context.

Future accepted ordering is fixed:

```text
atomic reserve(logical + event identity)
  -> exact relation/version reads
  -> one owner-approved transition or explicit durable no-change
  -> stage primary + exact H-family record/follower/outbox set
  -> save immutable Consumer result
  -> mark reservation Completed
  -> commit once
```

Result-before-completion、cursor-after-borrow-stage and whole-set rollback inherit
`R06-F-AFFECT-UOW-01`. Replay never reads current signal/context/ref rows to fill receipt refs.

## 7. Result, error and C-05 matrix

| branch | receipt surface | writes | recovery/action boundary |
|---|---|---|---|
| malformed header/body/ref | Ephemeral `Rejected` | none | input correction; exact mapper required |
| registered unsupported schema | Ephemeral `UnsupportedSchema` | none | same input not retried by default |
| temporary exact context dependency outage | Ephemeral `Delayed` | none | retry only under shared recovery owner |
| compatible in-flight | Ephemeral `Delayed` | none | no second reservation |
| accepted transition/no-change | Stored fresh | exact committed set | action only after known commit |
| completed duplicate | Stored replay | none | immutable original surface; target acknowledge |
| conflict/CAS failure | typed error or legal receipt per exact owner | no accepted partial set | no winner disclosure |
| commit/probe unknown or corrupt result | no terminal receipt/action | unknown | `ProbeBeforeRetry`/manual boundary |

Register `S08-E-I06-ACTION-MATRIX-01=open_internal_affected`: Step 06/07 must provide a named pure,
total, no-wildcard I06 mapper consuming commit certainty、receipt branch/outcome/access、ref/error
presence、shared recovery class and static policy. Application never returns C-05 and registrar never
reclassifies.

## 8. Redaction, telemetry and truth boundary

Allowed diagnostics: finite I06/Runtime/schema/outcome/error/recovery/action tokens, bounded counts,
presence flags and redacted refs. Forbidden everywhere: raw log/metric/trace material, summary body,
execution/run result, stack/SQL/provider response, credential/locator, digest bytes/hex, source event
or actor as metric labels. Telemetry failure does not change result or reopen a writer.

I06 may record only Observability-owned body-free safe-signal/correlation/reference projection selected
by the repaired landing. It never writes Runtime truth, changes a run, asserts execution success,
creates evidence/retention/report handoff, or calls an external delivery port.

Register `S08-E-I06-DOWNSTREAM-WRITE-CAPABILITY-01=open_internal_affected` until a minimal I06 service
dependency view and Step 09/16 forbidden-call cuts exclude unrelated writers.

## 9. Affected and final review

| ID | status | closure owner |
|---|---|---|
| `S08-E-I06-DURABLE-LANDING-01` | open internal | Step 06 domain/application branch matrix |
| `S08-E-I06-ACTION-MATRIX-01` | open internal | Step 06/07 exact worker mapper |
| `S08-E-I06-DOWNSTREAM-WRITE-CAPABILITY-01` | open internal | Step 06/07 minimal dependency composition |
| shared Consumer result/quarantine/indeterminate items | open | shared Step 06/07/12 owners |
| `S08-RECOVERY-CLASS-OWNER-01` | open | global Step 12 |
| `R06-F-AFFECT-UOW-01` | downstream open | Step 09/11 propagation |
| `03-RPR-S09-PER-FLOW` | open | `ConsumeRuntimeSignalSummaryFlow` |

| final check | conclusion |
|---|---|
| payload/input/callables | field-level and constructable |
| upstream blocker | none newly found; transport binding is normal Step 14 work |
| runtime readiness | no; landing/action/dependency and shared affected remain open |
| protocol status | `defined_with_affected_open` |
| count after I06 | `36/60`; Consumer `6/9`; unconditional complete `0/60` |
| implementation/test/evidence | not run or claimed; no commit/run_id/evidence alias/signoff |
