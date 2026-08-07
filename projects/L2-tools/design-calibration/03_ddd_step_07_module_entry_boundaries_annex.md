# L2-tools Step 7 模块附录: api / worker / jobs entry boundaries

> 状态: completed / pass
> 主文件: `03_ddd_step_07_trait_port_adapter_contracts.md`
> 作用: 固定 entry callable、依赖注入和禁止写权；协议字段、logical route/event/job names 在 Step 8 展开。

## 1. `api` entry boundary

```rust
pub trait ToolCommandUseCases: Send + Sync {
    fn execute<'a>(
        &'a self,
        command: ToolCommandRequest,
        metadata: CommandMetadata,
    ) -> PortFuture<'a, Result<ToolCommandResult, ApplicationError>>;
}

pub trait ToolQueryUseCases: Send + Sync {
    fn execute<'a>(
        &'a self,
        query: ToolQueryRequest,
        metadata: QueryMetadata,
    ) -> PortFuture<'a, Result<ToolQueryResult, ApplicationError>>;
}
```

`ToolCommandRequest/Result` and `ToolQueryRequest/Result` are closed dispatch enums whose variants are exactly the `13` and `11` Step 8 protocols. Every variant and payload receives English rustdoc. Concrete handlers may provide one named function per protocol but must delegate to these exact application methods.

API handler order is fixed: decode logical protocol version -> validate metadata/request -> call application facade -> encode typed result or `ProtocolError`. It cannot access repository, external Port, UoW manager, domain constructor, clock/ID adapter or raw provider material. Transport/framework method/path is not selected; Step 8 uses stable logical operation names.

## 2. `worker` entry boundary

```rust
pub trait ToolConsumerUseCases: Send + Sync {
    fn consume<'a>(
        &'a self,
        input: ToolInboundConsumerInput,
    ) -> PortFuture<'a, Result<ConsumerReceipt, ApplicationError>>;
}

pub trait SafeMaterialContinuationUseCases: Send + Sync {
    fn continue_material<'a>(
        &'a self,
        input: SafeMaterialContinuationInput,
    ) -> PortFuture<'a, Result<ExternalSubmissionAttemptView, ApplicationError>>;
}

/// Body-free local view returned by one continuation; not a delivery receipt.
pub struct ExternalSubmissionAttemptView {
    pub attempt_id: ExternalSubmissionAttemptId,
    pub material_ref: SafeHandoffMaterialRef,
    pub event_id: ToolEventId,
    pub event_name: ToolOutboundEventName,
    pub schema_version: ToolProtocolSchemaVersion,
    pub target_class: ExternalCollaborationClass,
    pub state: ExternalSubmissionAttemptState,
    pub external_submission_locator: Option<ExternalSubmissionLocator>,
    pub route_contract_revision: Option<ExternalRevisionRef>,
    pub gap_refs: ConsistencyGapRefSet,
    pub correlation_ref: CorrelationRef,
}
```

`SafeMaterialContinuationInput` and `ContinuationKey` are not defined by this entry module. Their
only Rust-facing schema and constructors are in
`03_ddd_step_06_object_contracts_recalibration_annex.md` §4.2; this facade imports those canonical
application carriers. The deleted local copy is a superseded explanatory draft and must not be
assembled into formal 03 as a second definition.

`ToolInboundConsumerInput` is a closed enum of five validated `InboundEventEnvelope<Payload>` variants. Worker validates source isolation and envelope before application call but does not classify domain truth. It returns the exact `ConsumerReceipt` to its future transport adapter. Broker acknowledgment/retry/DLQ ownership is not part of this trait; an entry runtime may map the receipt to its own carrier only after Step 8/12 defines the semantic mapping.

`ContinuationKey` is deterministically derived from `(material_ref, material_class, target_class,
schema version)` and is not a scheduler/run/transport ID. `SafeMaterialContinuationInput` cannot
carry source truth bodies, an arbitrary event name, route, retry counter or provider request. The
application reloads the immutable material, derives the one legal event class, and validates the
input class/target/correlation before any attempt. `ExternalSubmissionAttemptView` is constructed
only from a committed local attempt plus its attributable gaps; `Prepared` and
`SubmissionOutcomeUnknown` are returned as in-flight/manual states and never trigger automatic
resubmission. Worker does not call `SafeEventCollaborationPort` directly.

`ContinuationKey::derive(material_ref, material_class, target_class, schema_version)` is the only
constructor. It rejects an empty or unknown material class, a target mismatch, an unsupported
schema version or a non-canonical material ref; it does not include a worker run, scheduler lease,
transport route or retry counter. `SafeMaterialContinuationInput::from_committed_material(...)`
must receive the committed material ref and its exact class/target, and the application rechecks
that the supplied `correlation_ref` belongs to the material before loading any attempt. A
continuation input with a valid key but a missing material returns
`ProtocolError::blocked_without_subject` and does not create an attempt.

## 3. `jobs` entry boundary

```rust
pub trait ToolJobUseCases: Send + Sync {
    fn run<'a>(
        &'a self,
        request: ToolJobRequest,
        metadata: JobMetadata,
    ) -> PortFuture<'a, Result<JobReport, ApplicationError>>;
}
```

`ToolJobRequest` is a closed enum of four job inputs. Each one-shot binary maps its input to exactly one variant, validates system actor/job key/watermark and returns a typed `JobReport`. The runner does not create a real run ID, scheduler state, lease, acceptance evidence or signoff. Cursor continuation uses the same job key/digest semantics defined by Step 13 and cannot silently widen scope.

## 4. Entry dependency and write-authority table

| Entry | Injected dependency | May construct | May persist | May call external Port | Owns truth |
|---|---|---|---|---|---|
| API Command handler | `Arc<dyn ToolCommandUseCases>` | Command DTO/metadata and protocol response | no | no | no |
| API Query handler | `Arc<dyn ToolQueryUseCases>` | Query DTO/metadata and protocol response | no | no | no |
| Worker consumer | `Arc<dyn ToolConsumerUseCases>` | validated envelope dispatch + receipt | no | no | no |
| Worker continuation | `Arc<dyn SafeMaterialContinuationUseCases>` | continuation input + attempt view | no | no | no |
| Job runner | `Arc<dyn ToolJobUseCases>` | job request/metadata + report | no | no | no |

Application facades own all persistence and external call sequencing. Entry binaries may receive an infra-built bundle at composition time, but library handlers never depend on `tools_infra` concrete adapter types.

## 5. Error/receipt boundary

| Entry result | Entry mapping obligation | Forbidden inference |
|---|---|---|
| `ToolCommandResult` | Preserve `EntryDisposition`, result refs and committed version | Accepted is not external execution/delivery |
| `ToolQueryResult` | Preserve visibility/freshness/gap/unavailable surface | Empty is not forbidden; stale is not current |
| `ConsumerReceipt` | Preserve accepted/duplicate/rejected/quarantined/gap and retry hint | Receipt is not broker delivery/DLQ truth |
| `JobReport` | Preserve watermark/cursor/count/disposition/gaps | Completed is not test/acceptance evidence |
| `ApplicationError` | Exhaustively map to `ProtocolError` or entry-specific safe failure | No raw error/log/body leakage |

## 6. Stop review

| Review item | Result | Gap / correction |
|---|---|---|
| All 13/11/5/4 surfaces have one closed application dispatch boundary | pass | exact schemas deferred only to Step 8 |
| Four outbound event classes have one committed-material continuation boundary | pass | no transient reconstruction |
| Entries inject application facades only | pass | repositories/ports/domain hidden |
| Consumer/Job cannot directly repair core subject | pass | formal Command/service re-entry only |
| Receipt/report do not imply broker/run/test evidence | pass | explicit negative semantics |
| No transport/framework/scheduler product selected | pass | logical operation names in Step 8 |
