# Step 06 R06.7-A. Runtime / Infra / Entry Authority and Inventory

## 1. Batch status

| Item | Current decision |
|---|---|
| Formal document | `03-详细设计.md` |
| Detailed-design step | Step 06, object implementation contracts |
| Repair batch | `R06.7-A` |
| Batch scope | runtime availability, infra runtime composition, and API / worker / jobs entry carrier authority and inventory |
| Current status | `done_consumed_by_R06.7-E` |
| R06.7 current pointer | `R06.7-E_done_waiting_user_before_R06.8` |
| Current module | authority / inventory and historical-conflict ruling |
| Written in this batch | source precedence, owner registry, inventory, defer boundary, conflict ledger, later-batch gate |
| Deliberately not written | trait body、protocol DTO、config key、persistence schema；availability三张对象卡由R06.7-B闭合，technical carrier十五张对象卡由R06.7-C闭合，五个entry-state候选由R06.7-D逐项审查并全部裁定为DX |
| Formal-document write | none; formal `03` remains frozen until Step 19 |
| Implementation write | none |
| Verification status | design-only; planned checks remain `planned/not_run` |
| Commit status | no commit requested or created |

This batch remains the authority and inventory source for the R06.7 runtime / entry repair. The current availability object source is `03_ddd_step_06_runtime_availability.md`, the technical-carrier source is `03_ddd_step_06_runtime_infra_entry_carriers_r06_7c.md`, the entry-candidate qualification source is `03_ddd_step_06_entry_local_carriers_r06_7d.md`, and the final cross-module inventory source is `03_ddd_step_06_runtime_entry_cross_module_r06_7e.md`; older family tables and frozen downstream snippets remain input or historical material when they conflict with these sources. A name appearing in a frozen file does not by itself grant that file definition ownership.

## 2. Purpose and stop rule

R06.7 exists to close the stable carriers that allow a complete runtime assembly to reach entry modules without moving business truth, raw binding material, or provider details into those modules. The batch must prove four things before a later schema batch is allowed:

1. Every current type has one definition owner, one construction owner, and an explicit consumer boundary.
2. Every type that is intentionally deferred has a named downstream owner and a reason it must not be defined here.
3. Every historical name that mixes public outcome, durable state, and entry action is explicitly excluded.
4. The five later R06.7 batches can be written without inventing a second config model, registrar model, disposition model, or runtime truth model.

`R06.7-A` originally stopped after this authority and inventory record. That gate was consumed by the user's explicit confirmations; R06.7-B、C、D、E are now complete design-only. The current stop is before `R06.8`; A~E do not authorize R06.8、Step 07、formal-document assembly、any `04` file or implementation work.

## 3. Authority order and read record

### 3.1 Authority order

The following order is used when two documents name the same type or boundary differently:

| Order | Authority | Use in this batch |
|---:|---|---|
| 1 | Requirements and architecture truth boundary | Determines that observability owns observation-side facts and projections, not external business truth. |
| 2 | Current formal `02-概要设计.md` and its current calibration outputs | Determines runtime, entry, no-write, body-free, handoff, availability, and maintenance intent. |
| 3 | Current Step 04 file layout and Step 05 module contracts | Determines physical owner, dependency direction, and forbidden reverse dependencies. |
| 4 | Current Step 06 owner addenda and application façade / record documents | Determines already-closed application types and their non-duplication rules. |
| 5 | This R06.7-A inventory and conflict ledger | Determines R06.7 ownership and explicit defer decisions. |
| 6 | Frozen Step 07 / Step 08 / Step 09 / Step 14 use-sites | Use only to find definition/use conflicts and required handoff shape; they do not override current owner decisions. |
| 7 | Old formal documents, README, old ledgers, old boundaries | Historical material only. |

### 3.2 Inputs consumed

| Input | Relevant conclusion |
|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 06 | Step 06 must proceed by module, capability, inventory, object card, field-source audit, state audit, and stop review. |
| `standards/document/详细设计书写规范.md` | An `FC` type needs an independent implementable card; a family table cannot replace a current object card. |
| `standards/document/设计文档讨论中间产物规范.md` | Intermediate material precedes formal assembly; every batch updates flow and ledger, then stops for confirmation. |
| `standards/document/设计真相源闭环与可落码性标准.md` | No unowned field, state, carrier, error, or phase boundary may be delegated to implementation. |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `L0-core` remains the only compile-time sibling dependency; runtime and provider cooperation stays behind ports / adapters. |
| `03_ddd_step_04_file_layout.md` | Runtime builder is an infra implementation unit; `api`, `worker`, and `jobs` are separate entry modules. |
| `03_ddd_step_05_module_contracts.md` | `worker` and `jobs` may depend on infra; infra must not depend back on entry modules; registrar is an infra technical seam, not an application business port. |
| `03_ddd_step_06_object_contracts.md` current R06.6 sections | Application façades, result layers, runtime availability intent, and historical disposition exclusions are already constrained. |
| `03_ddd_step_06_application_report_error_service.md` | R06.6原先暂列entry-local层；R06.7-E current sync已删除generic entry layer，保留application result、durable report、technical completion/callback与public outcome的独立owner。 |
| frozen Step 07 / Step 14 | Existing registration and runtime-builder use-sites expose duplicate-definition and locator-leak risks that R06.7 must settle. |

### 3.3 Historical-material rule

The old README, old formal `03`, old `04` to `07`, old implementation ledger, and old boundary skeletons are not current definitions. In particular, old product names, runtime product assumptions, P95 values, cold-storage periods, hash-chain proposals, event counts, provider status names, and old evidence paths cannot enter the R06.7 inventory without a new upstream decision.

## 4. Boundary facts that R06.7 must preserve

### 4.1 Truth ownership

The runtime builder assembles capabilities. It does not become an owner of observation truth. An availability snapshot says only that a product-neutral adapter family or exact binding was classified at a probe boundary. It does not prove an external call succeeded, an event was delivered, a report was accepted, an evidence item is authentic, or an acceptance decision exists.

The API, worker, and jobs modules map and dispatch. They do not own `ObservationReceipt`, source truth, external lifecycle truth, report verdict, evidence body, acceptance signature, or provider response body. Process-local dispatch metadata and exact one-shot mapping values are not durable business lifecycles; the historical generic loop/disposition candidates are not current objects.

### 4.2 Body-free and least-authority boundary

The following must remain outside entry-safe carriers:

- raw configuration values and source documents;
- transport, scheduler, endpoint, credential, topic, route, cron, and private registry locators;
- provider error bodies, response bodies, payload bodies, and source audit bodies;
- repository, adapter, UoW, concrete service, and private registry handles;
- fabricated external run IDs, evidence aliases, verdicts, signatures, or acceptance receipts.

Entry modules receive only typed services, safe metadata, bounded invocation material, and prebuilt registrar capabilities. A bounded invocation frame is not a configuration carrier and is not persisted as business truth.

### 4.3 Layer separation

R06.7 preserves the following independent layers:

| Layer | Owner / role | R06.7 treatment |
|---|---|---|
| Stored operation result | application / durable result owner | Consume only; do not replace with entry disposition. |
| Durable job report | application jobs / report owner | Consume only; do not use as scheduler or entry state. |
| Application return carrier | application façade | Consume only; do not promote to transport action. |
| Generic entry disposition | none; `EntryDisposition=HX` after R06.7-E | Do not define, alias, wrap, persist, or use it as an intermediate mapping layer. |
| Public protocol outcome | contracts / Step 08 | Defer; no public DTO is defined in R06.7. |
| Transport completion | infra registration seam | Close as `InboundConsumerCompletion` carrier; it is not a business result. |

## 5. Module and dependency authority

### 5.1 Fixed dependency direction

```text
core-contracts
      |
      v
  contracts  <----- domain
      ^              |
      |              v
  application <-----+
      ^
      |
    infra
    ^  ^  ^
    |  |  |
   api worker jobs
```

The diagram expresses compile-time / module direction only. It does not grant an entry module access to infra internals or allow infra to import an entry crate.

### 5.2 R06.7 owner boundary

| Concern | Definition owner | Construction / assembly owner | R06.7 restriction |
|---|---|---|---|
| Availability scope, state, kind | `application::ports::runtime` | infra probe implementation constructs snapshots | Do not define an infra shadow enum or rewrite application semantics. |
| Runtime builder and assembly error | `infra::runtime_builder` | infra runtime builder | Do not expose a partial runtime or provider detail. |
| Technical registration metadata | `infra::runtime_builder` | infra runtime builder from validated config and private slots | Do not define the same registration item in Step 07, Step 14, or an entry module. |
| Consumer / job callback carrier | infra-owned technical seam, consumed by worker / jobs | worker / jobs construct exact finite catalogs | Do not make callbacks generic free-text maps or application business ports. |
| API handler state | `api` | API composition root | Mapping-only, no repository or domain mutation. |
| Worker loop state | `worker` | worker loop / composition root | Process-local coordination only; application service owns writes. |
| Job runner context | `jobs` | jobs composition root from complete request metadata | Lossless construction only; no fabricated request identity. |
| Entry action/result mapping | exact API mapper、C-05 completion或C-08/C-09 callback | matching entry mapper | No generic carrier, `shared/common` alias, or contracts expansion. |
| Public outcomes and DTOs | `contracts` / Step 08 | protocol mapper | R06.7 may reference names only where needed for inventory; it does not define them. |

### 5.3 Application façade boundary

The five canonical application façade bundles remain the only business call surface for entries. R06.7 may define the runtime carrier that transports these handles, but it must not add a sixth façade, move the façade into infra, or allow an entry to downcast to a repository or adapter.

## 6. Current inventory

The inventory below is a union of current Step 06 owner records, the current Step 05 module boundary, and the frozen downstream use-sites. Duplicate appearances are use-sites, not additional definitions.

### 6.1 Application runtime availability inventory

| Type | Qualification | Current semantic owner | Assembly / consumer | R06.7-A ruling |
|---|---|---|---|---|
| `AdapterAvailabilityScope` | `FC` | `application::ports::runtime` | infra probe constructs; API / worker / jobs read | Keep application-owned; field card is R06.7-B. |
| `AdapterAvailabilityKind` | `FC` | `application::ports::runtime` | infra probe and config validation classify | Keep finite and product-neutral; no provider status passthrough. |
| `AdapterAvailabilityState` | `FC` | `application::ports::runtime` | infra snapshot assembly; entry read-only surface | Keep immutable snapshot semantics; exact fields are R06.7-B. |
| `AdapterAvailabilityProbe` | `DX` | application port, Step 07 | infra implements | Do not define trait signature in R06.7-A or B; only consume its carrier contract. |

The existing application runtime carrier is not copied into `infra::runtime_builder`. Infra owns construction and probing mechanics, while application owns the meaning of the returned availability state.

### 6.2 Infra runtime-builder inventory

| Type | Qualification | Intended unique owner | Primary use |
|---|---|---|---|
| `ValidatedInboundConsumerRegistration` | `FC` | `infra::runtime_builder` | Locator-free operation / producer / schema metadata for one pre-resolved consumer. |
| `ValidatedJobScheduleRegistration` | `FC` | `infra::runtime_builder` | Locator-free operation metadata for one pre-resolved schedule. |
| `InboundConsumerDelivery` | `FC` | infra technical registration seam | Move-only delivery passed to one exact worker handler. |
| `InboundEnvelopeFrame` | `FC` | infra technical registration seam | Bounded, opaque, single-consumption invocation frame. |
| `InboundConsumerCompletion` | `FC` | infra technical registration seam | Acknowledge / retry / dead-letter transport action carrying the existing receipt. |
| `InboundConsumerHandlerCatalog` | `FC` | infra-owned catalog shape; worker constructs | Nine finite typed handler slots with exact enablement totality. |
| `ObservationJobInvocation` | `FC` | infra technical registration seam | Nine existing typed Job request wrappers; no new request DTO. |
| `ObservationJobInvocationResult` | `FC` | infra technical registration seam | Nine existing typed Job response wrappers. |
| `ObservationJobInvocationFailure` | `FC` | infra technical registration seam | Protocol/application failure before a complete public response exists. |
| `ObservationJobHandlerCatalog` | `FC` | infra-owned catalog shape; jobs constructs | Nine finite typed Job handler slots with exact enablement totality. |
| `ValidatedWorkerEntryConfig` | `FC_affected` | `infra::runtime_builder` | Historical A inventory included bounded publication loop parameters；R06.8-B current schema is Consumer registrations only. |
| `ValidatedJobsEntryConfig` | `FC` | `infra::runtime_builder` | Locator-free schedule registrations and bounded job parameters. |
| `BuiltObservabilityRuntime` | `FC_affected` | `infra::runtime_builder` | Historical A aggregate candidate；R06.8-B supersedes it with three named profile-specific runtimes, each containing exactly one assignment. |
| `RuntimeAssemblyIssueRef` | `TC` candidate | `infra::runtime_builder` | Safe correlation for one startup assembly issue; not evidence or run identity. |
| `RuntimeAssemblyError` | `FC` | `infra::runtime_builder` | Finite startup-only failure returned instead of a partial runtime. |

The `FC` qualification means each type requires an independent later card. This inventory does not count the current family table as a completed card.

### 6.3 Technical defer inventory

These names are necessary to describe the assembly boundary but are not data-object cards for R06.7-A:

| Name | Qualification | Unique later owner | Why deferred |
|---|---|---|---|
| `InboundConsumerHandler` | `DX` | Step 07 infra-entry technical seam | Trait signature and future shape belong to port / adapter contract work. |
| `ObservationJobHandler` | `DX` | Step 07 infra-entry technical seam | Trait signature must consume the exact invocation carrier without defining a second Job protocol. |
| `InboundConsumerRegistrar` | `DX` | Step 07 infra-entry technical seam | Registration capability is technical composition, not an application business port. |
| `JobScheduleRegistrar` | `DX` | Step 07 infra-entry technical seam | Scheduler binding remains private to infra. |
| `RegisteredInboundConsumerSet` | `DX` | Step 07 opaque handle trait | Handle has process lifecycle only; no lookup, invocation, serialization, or downcast. |
| `RegisteredJobScheduleSet` | `DX` | Step 07 opaque handle trait | Handle has process lifecycle only; no schedule lookup or Job synthesis. |
| `RegistrationFuture` and handler future aliases | `DX` | Step 07 | Async object-safety syntax is not a Step 06 business object. |
| `RawObservabilityConfig` and full validated root | `DX` | Step 14 / `04` | Raw source, precedence, key, default, secret, and binding schema are config concerns. |
| Transport / actor-policy / scheduler locator types | `DX` | Step 14 / infra private implementation | They must never cross into worker or jobs. |

### 6.4 API / worker / jobs entry inventory

| Type | Qualification | Intended owner | Current boundary |
|---|---|---|---|
| `ObservationCommandHandlerState` | `DX` after D review | no canonical object owner | Static exact route + API root assignment + per-call application context/input already carry the capability; shared last result is forbidden. |
| `ObservationQueryHandlerState` | `DX` after D review | no canonical object owner | Static exact route + read façade carry the capability; visibility/consistency are per request and query remains zero-write. |
| `OutboxPublisherLoopState` | `DX` after D review | no resident-loop owner | Formal publication authority is the complete `PublishObservationOutbox` Operations Job; no second worker entry mode. |
| `ProjectionWorkerLoopState` | `DX` after D review | no resident-loop owner | Maintenance is carried by eight typed Operations Jobs; no worker trigger/config/façade or shadow maintenance state. |
| `ObservationJobRunnerContext` | `DX` after D review | no canonical object owner | C-07 complete invocation + C-10 exact handler + application context seam already carry the one-shot call. |
| `EntryDisposition` | `HX` after R06.7-E | none | Deleted as a redundant generic layer; equivalent alias/wrapper or renamed disposition is forbidden. |

`ObservationConsumerDisposition`、`ObservationJobDisposition` and `EntryDisposition` are not current inventory items. They are `HX` historical exclusions. Their mixed meanings are replaced only by `InboundConsumerCompletion`, C-08/C-09 callback carriers, application result carriers, stored result / report state, and typed public outcomes according to the exact flow.

## 7. Historical and conflict ledger

### 7.1 Disposition conflict

The old `ObservationConsumerDisposition` combined an application result, a durable receipt classification, and a worker transport action. The old `ObservationJobDisposition` combined public Job outcome, durable report state, and entry action. Both are excluded. R06.7 must not restore either name as an alias, wrapper, or compatibility enum.

The allowed replacements are deliberately separate:

| Old mixed concern | Current carrier / owner |
|---|---|
| Stored operation fact | application `OperationResultDisposition` and stored receipt / result owner |
| Durable Job lifecycle | application `JobReportState` and `ObservationJobReportDraft` |
| Public response meaning | Step 08 `ObservationConsumerOutcome` / `ObservationJobOutcome` |
| Worker transport action | infra `InboundConsumerCompletion` |
| API one-shot mapping | exact public outcome/surface or typed `ApiError`; no generic intermediate carrier |
| Job callback mapping | C-08 complete result or C-09 failure; no generic intermediate carrier |

### 7.2 Registration-definition conflict

The frozen Step 07 and Step 14 materials repeat the R2 registration carriers in multiple locations. R06.7-A fixes the definition rule:

1. `ValidatedInboundConsumerRegistration` and `ValidatedJobScheduleRegistration` are defined by `infra::runtime_builder`.
2. The runtime builder keeps private transport, actor-policy, scheduler, and provider material.
3. Worker and jobs receive safe metadata plus a registrar capability; they do not resolve locators.
4. Step 07 may define the technical trait signatures and opaque handle traits, but may not redefine the data carriers.
5. Step 14 may define raw-to-validated derivation and startup validation, but may not redefine the validated carriers or runtime assembly result.

### 7.3 Availability-owner conflict

`AdapterAvailabilityScope`, `AdapterAvailabilityKind`, and `AdapterAvailabilityState` remain application-owned because the application port returns their semantics. Infra may implement the probe and assemble a snapshot, but no infra-specific availability enum or adapter-product status may be introduced.

### 7.4 EntryDisposition owner gap（historical，resolved by E deletion）

At the A checkpoint, `EntryDisposition` was deliberately recorded as `UR`, not silently assigned to a new shared module:

- `api`, `worker`, and `jobs` cannot depend on one another;
- Step 05 prohibits an unbounded `shared` / `common` module;
- publishing an internal entry action in `contracts` would broaden the public protocol surface;
- assigning it to infra would make technical composition own entry semantics;
- assigning it to application would collapse entry action into application result layers.

R06.7-E tested the following historical candidates:

| Candidate | Required proof |
|---|---|
| Separate module-local equivalent types | No cross-module comparison requires a common type; names and mappings remain explicit. |
| A narrowly bounded contracts carrier | It is genuinely part of a public or cross-crate contract and does not leak transport semantics. |
| An application mapping carrier | It remains distinct from stored result, public outcome, and transport completion, with no reverse dependency. |

The audit rejected all three candidates because the value added no independent invariant, lifecycle, or cross-module contract. Current result: `R06.7-ENTRY-DISPOSITION-OWNER=resolved_by_deletion_in_R06.7-E_design_only`; no implementation may import a guessed path or restore an equivalent alias/wrapper.

### 7.5 Unaffected blockers

`R06.6-F2-H13-UPSTREAM` remains open and is not processed by R06.7-A. The formal `02` replay mapping still conflicts with the current per-target H13 writer. `R06-F-AFFECT-UOW-01` also remains an open downstream affected-use register. Neither blocker authorizes changing the R06.7 inventory.

## 8. R06.7 batch plan and gates

| Batch | Scope | Required output | Current status | Stop condition |
|---|---|---|---|---|
| `R06.7-A` | authority, inventory, historical conflicts | this file, owner registry, defer ledger, batch gate | done_consumed_by_B | historical A stop passed by explicit user confirmation |
| `R06.7-B` | application runtime availability | `03_ddd_step_06_runtime_availability.md`;three independent object cards, state / kind semantics, factory and read-only behavior | done_consumed_by_C | availability owner and exact fields closed；consumed by confirmed C batch |
| `R06.7-C` | infra runtime builder and technical carriers | `03_ddd_step_06_runtime_infra_entry_carriers_r06_7c.md`;registration, delivery, frame, completion, invocation, catalogs, entry slices, runtime assembly and startup error cards | done_consumed_by_D | fifteen object cards、exact constructors、finite catalogs and complete-or-error assembly closed |
| `R06.7-D` | API / worker / jobs entry-local candidates | `03_ddd_step_06_entry_local_carriers_r06_7d.md`;five independent qualification reviews、entry mapping boundary、single publication Job mode、affected seams | done_consumed_by_E | five candidates are DX；no shared result/default visibility/resident loop/runner wrapper |
| `R06.7-E` | cross-module audit | `03_ddd_step_06_runtime_entry_cross_module_r06_7e.md`;field source, state/result layer, error mapping, defer and test handoff audit | done_waiting_user_before_R06.8 | no unresolved R06.7 owner or duplicate generic disposition remains；C-11/C-13 and three executable seams handed to R06.8 |

The batches are sequential. Completion of C does not imply permission to begin D. Each later batch must read this file, the current ledger, the flow, and its immediate upstream definitions before writing.

## 9. R06.7-A historical stop review

| Check | Result |
|---|---|
| Current source precedence is explicit | pass_design_only |
| Runtime / entry inventory is complete for the named R06.7 scope | pass_design_only |
| Every inventory item has a proposed owner or explicit unresolved/defer status | pass_design_only at A stop；R06.7-E later resolved `EntryDisposition` by deletion |
| Historical disposition names are excluded | pass_design_only |
| R2 registration ownership is singular | pass_design_only; infra runtime-builder is the only data-definition owner |
| Raw binding and locator boundary is explicit | pass_design_only |
| Application availability semantics are not duplicated in infra | pass_design_only |
| No field or trait schema was prematurely invented | pass_design_only |
| H13 and UoW downstream blockers are preserved | pass_design_only |
| Formal `03`, frozen Step 07+, `04`, implementation ledger, and boundaries were not modified | pass_design_only; only Step 06 master, flow, and project ledger were synchronized |
| Runtime or integration tests were executed | no; `planned/not_run` |
| Real run IDs, evidence aliases, signatures, or commits were created | no |

### 9.1 R06.7-A unresolved items carried forward

| Item | Next owner / batch | Blocking scope |
|---|---|---|
| Exact application availability field and member cards | resolved_in_R06.7-B | `03_ddd_step_06_runtime_availability.md` §§5~8 |
| Exact technical carrier fields and constructors | resolved_in_R06.7-C | `03_ddd_step_06_runtime_infra_entry_carriers_r06_7c.md` §§6~25 |
| Exact entry candidate qualification and mapping boundary | resolved_in_R06.7-D | all five candidates DX；three executable seams carried to R06.8/affected review |
| Final `EntryDisposition` placement | resolved_by_deletion_in_R06.7-E_design_only | `HX`; no alias/wrapper restoration |
| Trait signatures and async future aliases | Step 07 | Outside R06.7-A to D |
| Raw config keys, defaults, source precedence, and binding schema | Step 14 / `04` | Outside R06.7 |
| H13 replay record mapping | formal `03` reassembly / upstream controlled decision | Outside R06.7 |

## 10. Consumed reading and controlled handoff

R06.7-D and E consumed A/B/C and the following targeted inputs without modifying frozen Step 07+ material:

1. This file, `project_execution_ledger.md`, and `03_ddd_calibration_flow.md` for the confirmed recovery point.
2. `03_ddd_step_06_object_contracts.md` current R06.7-A/B checkpoints and application runtime support owners.
3. `03_ddd_step_06_runtime_availability.md` as the canonical source for the three availability objects.
4. Step 05 runtime / entry dependency matrix and Step 14 logical builder stages for the no-reverse-dependency and complete-or-error boundaries.
5. Frozen Step 07~14 entry use-sites, formal `02` Operations Job authority and L1 entry qualification references, without editing frozen files or copying trait/future definitions.

The next allowed action is `wait_user_confirmation_before_R06.8`. After confirmation, read the E final audit §§1~18, this A inventory、R06.7-B/C/D、the Step 06 master §6.29、flow and project ledger, then perform the zero-unowned-type、affected-definition and executable-seam closure owned by R06.8. No automatic transition is permitted.

## 11. Truthfulness and change boundary

This file records design decisions and planned verification cuts only. It does not claim an implementation repository exists, a runtime assembled, an adapter was healthy, a consumer delivered an event, a Job ran, a test passed, an evidence alias was issued, or an acceptance decision was signed.

No implementation commit, run ID, evidence alias, acceptance signature, test result, implementation ledger boundary, or formal-document section was created by R06.7-A~E.
