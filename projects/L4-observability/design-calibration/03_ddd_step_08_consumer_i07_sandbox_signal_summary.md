# L4-observability 03-详细设计 Step 08 - S08-E Consumer I07 `ConsumeSandboxSignalSummary`

> 状态: `defined_with_affected_open`；正式 `03` frozen to Step 19

## 1. Protocol identity and truth boundary

| item | exact contract |
|---|---|
| name / code | `ConsumeSandboxSignalSummary` / `0x0307` |
| producer | authenticated `ObservationProducerFamily::Sandbox` |
| envelope | `ObservationInboundEventEnvelope<SandboxSignalSummaryPayload>` |
| assembler | `ObservationInboundInputAssembler::consume_sandbox_signal_summary` |
| service | `ObservationInboundEventService::consume_sandbox_signal_summary` |
| result | `ObservationConsumerResult` -> shared receipt |
| flow | `ConsumeSandboxSignalSummaryFlow` |

I07 imports only a body-free sandbox signal summary and optional relation hints. Sandbox owns
execution/request/result/isolation truth. Observability cannot alter sandbox state, retain execution
body, declare a run safe, or treat an optional local receipt/state hint as authority.

## 2. Public payload and exact callable

```rust
pub struct SandboxSignalSummaryPayload {
    pub sandbox_signal_ref: RuntimeSandboxSignalRef,
    pub receipt_ref: Option<ObservationReceiptRef>,
    pub signal_summary_ref: SafeSignalSummaryRef,
    pub safety_state: Option<SafetyDispositionState>,
}

impl ObservationInboundPayload for SandboxSignalSummaryPayload {
    const CONSUMER: ObservationInboundConsumerName =
        ObservationInboundConsumerName::ConsumeSandboxSignalSummary;
    const PRODUCER: ObservationProducerFamily = ObservationProducerFamily::Sandbox;
}
```

```rust
fn consume_sandbox_signal_summary(
    &self,
    actor_ref: ActorSafeRef,
    envelope: ObservationInboundEventEnvelope<SandboxSignalSummaryPayload>,
) -> Result<ConsumeSandboxSignalSummaryInput, ApplicationError>;

fn consume_sandbox_signal_summary<'a>(
    &'a self,
    input: ConsumeSandboxSignalSummaryInput,
) -> ApplicationServiceFuture<'a, ObservationConsumerResult>;
```

| field | authority / target | validation | forbidden fallback |
|---|---|---|---|
| `sandbox_signal_ref` | Sandbox body-free boundary ref | required, producer/source compatible | run id, source event, locator, trace |
| `receipt_ref` | optional explicit Observability receipt relation | if Some, exact local lookup and source relation | latest receipt, signal ref cast, new receipt mint |
| `signal_summary_ref` | safe-summary projection | required typed ref | raw stdout/stderr/log/result body |
| `safety_state` | optional producer observation | finite value; never local state authority | infer from summary, overwrite local disposition |

The two Options are independent. `receipt_ref=None/safety_state=Some`, Some/None and both None have
distinct canonical encodings and branch behavior; no field fills the other.

## 3. Assembly, digest and identities

Header order is static slot -> producer/source/event/version/schema/dedup/time/trace -> exact payload.
Effective actor comes only from the worker binding. Complete private input contains six shared controls
and four payload fields; the assembler is synchronous, zero-I/O and returns no partial value.

Canonical payload order:

```text
sandbox_signal_ref
receipt_ref (Option)
signal_summary_ref
safety_state (Option)
```

Logical key is `(I07, actor, dedup_key)`; secondary identity is `(I07, Sandbox, source_event_ref)`.
Both are atomically reserved. Request digest excludes dedup/time/trace/transport/generated refs and raw
material. Replay uses the exact original stored-result pointer and never re-evaluates current safety.

## 4. Local target matrix and affected

Incoming `safety_state` is a source observation, not permission to invoke a local
`SafetyDisposition` transition. Current Step 06/07 does not provide a total relation that maps all four
Option combinations to one local `SafeSignal`, receipt-linked observation, gap, or durable no-change.

| input relation | target requirement | prohibited inference |
|---|---|---|
| receipt Some and exact local relation exists | owner may evaluate a body-free receipt/signal association | overwrite local safety state from payload |
| receipt Some but missing/foreign | typed missing/relation error or delayed branch | create replacement receipt or choose same-source latest |
| receipt None | only an owner-defined standalone safe-signal/reference branch or explicit no-change | infer receipt from sandbox ref |
| safety state Some | retain as typed source observation only if selected schema has a field | call local transition/set local state |
| safety state None | absence remains absence | derive Safe/Rejected from summary presence |

Register:

```text
S08-E-I07-DURABLE-LANDING-01=open_internal_affected
S08-E-I07-SAFETY-AUTHORITY-01=open_internal_affected
S08-E-I07-ACTION-MATRIX-01=open_internal_affected
S08-E-I07-DOWNSTREAM-WRITE-CAPABILITY-01=open_internal_affected
```

Closure requires an exhaustive branch matrix, exact local relation keys/version guards, one owner
transition or durable no-change, a named total C-05 mapper, and a minimal dependency view. A generic
“signal input marker” is not a durable owner.

## 5. UoW, result and error behavior

Only atomic `Acquired` can write. Future accepted order is exact relation reads -> one selected
transition -> primary/H-record/cursor/outbox -> stored result -> reservation completion -> one commit.
Known failure rolls back all; unknown commit enters dual-index probe. No receipt is reconstructed from
current local safety/signal rows.

| branch | public surface | action boundary |
|---|---|---|
| malformed/mismatched payload | Ephemeral `Rejected` | no reserve/write; exact mapper |
| unsupported registered schema | Ephemeral `UnsupportedSchema` | no decoder fallback |
| temporary exact relation dependency | Ephemeral `Delayed` | retry only via shared recovery owner |
| conflict/in-flight | typed rejection/delayed | no second writer/winner disclosure |
| accepted owner transition/no-change | Stored fresh | only after known commit |
| duplicate | Stored replay | original bytes/refs/outcome; no handler rerun |
| unknown/corrupt | no terminal completion | probe/manual; never default Retry |

Shared outbox/quarantine/indeterminate completion and recovery-class affected remain open. The I07
mapper must be pure, total and no-wildcard; application result and transport action stay separate.

## 6. Redaction, observability and no-backwrite

Only finite protocol/producer/schema/outcome/error/recovery/action tokens, bounded counts, presence and
redacted typed refs may enter telemetry. Raw sandbox input/output/log, provider error, credential,
locator, digest, actor/source/event/ref values as metric labels are forbidden. Forbidden material is
not made safe by hashing or truncation.

I07 cannot mutate sandbox truth, local safety state from source assertion, retention, evidence,
report handoff or external delivery. Telemetry/receipt/dead-letter do not prove sandbox safety or
execution acceptance.

## 7. Final review

| check | conclusion |
|---|---|
| public payload and input | complete field schema; both Options independent |
| exact callables | current Step 07 assembler/service named |
| upstream blocker | none newly found; runtime binding remains Step 14 work |
| local blockers | none hidden; four local affected explicitly routed |
| status | `defined_with_affected_open`, not runtime-ready |
| count after I07 | `37/60`; Consumer `7/9`; `0/60` unconditional complete |
| flow handoff | only `ConsumeSandboxSignalSummaryFlow` |
| implementation/evidence | not implemented/tested/run; no commit/run_id/evidence/signoff |
