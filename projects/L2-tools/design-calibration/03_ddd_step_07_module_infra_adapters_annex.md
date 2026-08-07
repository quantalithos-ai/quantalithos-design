# L2-tools Step 7 模块附录: infra adapter contracts

> 状态: completed / pass
> 主文件: `03_ddd_step_07_trait_port_adapter_contracts.md`
> Planned files: `repositories.rs`;`projection_store.rs`;`idempotency_store.rs`;`reference_store.rs`;`source_resolvers.rs`;`publishers.rs`;`handoff_adapters.rs`;`clock_id.rs`;`runtime_builder.rs`;`fakes.rs`
> 作用: 固定 application Port 的实现规则、错误映射、durable/fake parity 与 composition boundary；不选择 backend/provider/framework 产品。

## 1. Adapter implementation matrix

| Planned adapter family | Implements | Allowed input authority | Output obligation | Forbidden behavior |
|---|---|---|---|---|
| Local UoW adapter | `ToolsUnitOfWorkManager`;`ToolsUnitOfWork` | One configured local persistence authority | Stable transaction ref, commit receipt/resolution | Nested/hidden transaction, distributed transaction, external side effect |
| Truth store adapters | Six named store traits | L2-owned persisted rows/documents/records | Exact typed object, expected version, semantic uniqueness | Domain branching, last-write-wins, partial outcome/audit |
| Projection/reference adapter | `ProjectionStore` | D1 persisted material and T1/T2 watermark/ref indexes | Watermark compare, stable cursor, explicit stale/conflict | Fallback registry, core repair, external scan |
| Idempotency adapter | `IdempotencyStore` | Technical sidecar under same UoW authority | Atomic reserve and typed result/receipt/report replay | Cache-only authority, replay by rerun, digest normalization drift |
| Core authority adapter | `SharedContractAuthorityPort` | Formal configured Core package/type inventory candidate | Exact package/type/revision compatibility or conservative resolution | Guess Tools schema or frozen commit |
| Hub source adapter | `HubControlledSourcePort` | Formal Hub controlled source binding | Body-free exact ref/revision/safe summary | Registry copy, name lookup fallback, relation write |
| Authorization adapter | `AuthorizationConsumptionPort` | Formal owner binding if closed | Invocation-bound typed result or blocked/unverifiable | Policy evaluation, cached allow, self-authorization |
| Sandbox adapter | `SandboxExecutionPort`;`ExecutionSourceIntakePort` | Formal Sandbox mapping/source binding if closed | Readiness/local response/source mapping only | Run lifecycle, receipt, host fallback, raw capture |
| Collaboration adapter | `SafeEventCollaborationPort` | Formal Bus/Observation binding if closed | Local submit response or independent status refs | Delivery/retry/DLQ/observation store ownership |
| Clock/ID adapter | `ClockPort`;`IdGeneratorPort` | Configured system clock/random/sequence source | Valid typed values | Semantic ID from name/time alone |

## 2. Repository adapter invariants

Every durable and fake repository adapter implements the exact application signature and these guards:

1. Decode persisted values through invariant-validating constructors or trusted persistence decoders whose schema/version is checked; public deserialization cannot bypass domain invariants.
2. Return `Loaded<T>::expected_version` from the persistence compare token. Never synthesize it from a domain field, row count or timestamp.
3. Validate `&dyn ToolsUnitOfWork` belongs to the same persistence authority and is active. A foreign/closed token returns a typed error and performs zero writes.
4. Apply create/append/save only inside the caller UoW. No method commits, rolls back, publishes, refreshes or retries a conflicting mutation.
5. Enforce the semantic unique keys named in the store annex. Equal canonical content returns `ExistingEqual`; different content returns conflict, never overwrites.
6. `OutcomeAuditStore::insert_outcome_audit_pair` is physically indivisible. An adapter unable to guarantee this cannot be bound.
7. Repository pages use stable logical ordering plus `(filter_digest, source_watermark, last_sort_key, cursor_schema_version)` cursor integrity. Adapter-private row offsets are forbidden public cursor material.
8. A returned bundle must be internally symmetric at one local watermark. Partial/mismatched data returns serialization/integrity error, not a partial successful DTO.

The physical persistence backend, schema, table/collection layout and indexes are intentionally unselected; Step 11 defines logical keys/index requirements without selecting a product.

## 3. External adapter mapping algorithm

```text
validated application request
  -> check configured adapter binding and supported operation/version
  -> if no formal binding/schema/mapping/route: PortResolution::Blocked
  -> perform one logical adapter call (no hidden retry)
  -> validate formal authority + subject + revision + correlation
  -> reject any forbidden/raw body before safe mapping
  -> map closed external fields to typed safe resolution
  -> return PortResolution::{Available|Unavailable|Unsupported|Conflicting|Unverifiable}

adapter/framework failure before semantic mapping
  -> PortCallError::{Timeout|InvalidResponse|ForbiddenBody|AdapterFailure}
```

Configured endpoint presence yields `AdapterAvailability::Available` only for a local operation binding; it does not yield `PortResolution::Available`. Semantic availability requires a valid response for the exact request.

### 3.1 Blocked production adapters

For an open upstream contract, composition installs an explicit blocked adapter implementing the full trait. It returns a stable `PortBlocker` carrying only `blocker_id`, `owner_project`, `contract_family`, `affected_operation` and `reopen_condition`. It does not panic, fabricate a value, silently no-op or route to a fake. Current mandatory blocked paths:

| Port operation | Blocker |
|---|---|
| Authorization `consume_result` / clue validation positive path | `L2T-UP-001~002` |
| Sandbox readiness/handoff/source positive mapping | `L2T-UP-003~004` |
| Event collaboration route/delivery/observation positive path | `L2T-UP-004~006` |
| Tools-specific shared Core schema resolution | `L2T-UP-008` |

Hub logical source may also bind blocked/unavailable unless its exact current contract is configured and validated. No default positive adapter exists.

## 4. Durable / fake parity gate

| Parity dimension | Durable implementation | Fake implementation | Required equality |
|---|---|---|---|
| Trait surface | Exact application trait | Same trait | All methods, owned result types, Send futures |
| Optimistic version | Persistence-issued compare token | Deterministic fake-issued token | Same stale/conflict behavior |
| UoW | Staged writes visible only after commit | Transaction-local staged snapshot | Same rollback and commit-unknown simulation |
| Uniqueness | Physical unique constraint + canonical equality | In-memory semantic key + same equality | Equal vs conflict distinction |
| Pagination | Stable sort/cursor/watermark | Same logical sort/cursor contract | No insertion-order shortcut |
| Idempotency | Atomic reserve + typed stored surface | Same atomic winner model | Same replay/conflict/in-flight outcome |
| Outcome/audit | Indivisible pair | Indivisible pair | No half-state fixture |
| External resolution | Formal mapping or blocked adapter | Scripted typed resolution | Same authority/correlation/body validation |
| Failure injection | Safe typed backend/port errors | Explicit scripted failures | Same application error mapping |

Fakes must not expose helper methods to mutate impossible states through production tests. Fixture seeding may install historical invalid data only in dedicated integrity/recovery tests and must label it as invalid fixture, not a supported state. Fake success never counts as external integration evidence.

## 5. Runtime builder / composition boundary

`infra::runtime_builder` validates a typed dependency graph and returns entry-specific bundles:

```rust
pub struct ApiApplicationBundle {
    pub command_use_cases: Arc<dyn ToolCommandUseCases>,
    pub query_use_cases: Arc<dyn ToolQueryUseCases>,
}

pub struct WorkerApplicationBundle {
    pub consumer_use_cases: Arc<dyn ToolConsumerUseCases>,
    pub continuation_use_cases: Arc<dyn SafeMaterialContinuationUseCases>,
}

pub struct JobApplicationBundle {
    pub job_use_cases: Arc<dyn ToolJobUseCases>,
}
```

The exact standard-library/shared-pointer choice may be `Arc` because trait objects are `Send + Sync`; it does not choose an async executor. Builder stages, formal config schema and adapter binding names are Step 14 outputs. Step 7 fixes these validation rules:

- One single local persistence/UoW authority backs all stores participating in atomic families.
- No required trait is absent or represented by an implicit null/default.
- Open external seams bind explicit blocked adapters; they never bind fakes in a production profile.
- Entry bundles expose application facades only, not repositories/external ports/domain objects.
- Adapter declared operation/version/authority support is validated before bundle construction.
- Config cannot disable forbidden-body, correlation, fail-closed, exact-version or four-gate invariants.

## 6. Infra error boundary

`InfraError` remains internal to composition/adapter construction. Runtime calls map it to `RepositoryError`, `PortCallError`, `UnitOfWorkError` or `TechnicalPortError` at the implemented trait boundary. Mappings are exhaustive and body-free:

| Infra condition | Application-facing error/resolution |
|---|---|
| Store connectivity/transient call failure | `RepositoryError::Unavailable` |
| Persisted schema/enum mismatch | `RepositoryError::SerializationConflict` |
| Compare token mismatch | `RepositoryError::VersionConflict` |
| Semantic unique-key collision | equal => `ExistingEqual`; otherwise `UniquenessConflict` |
| Commit response lost | `UnitOfWorkError::CommitOutcomeUnknown` |
| No configured formal external contract | `PortResolution::Blocked` |
| External timeout before valid response | `PortCallError::Timeout` |
| Authority/revision/correlation mismatch | `PortResolution::Conflicting` or `Unverifiable` |
| Raw/forbidden external body | `PortCallError::ForbiddenBody` |

Raw backend errors may be recorded only through the safe observability mapping of Step 15; never returned or persisted in Tool truth/audit/material.

## 7. Stop review

| Review item | Result | Gap / correction |
|---|---|---|
| All application traits have an infra/fake implementation family | pass | `InvocationCallerPort` correctly implemented by application, not infra |
| Repository version/UoW/uniqueness/bundle behavior exact | pass | no hidden transaction/retry |
| External adapter mapping preserves authority/body/blocker boundary | pass | explicit blocked production adapters |
| Durable/fake parity covers paging, idempotency and atomic pairs | pass | fake success not integration evidence |
| Composition exposes application facades only | pass | stores/ports hidden from entries |
| Backend/framework/provider product remains unselected | pass | binding details deferred to Step 14/04 |
| Error mapping is exhaustive and body-free | pass | no raw detail leakage |
