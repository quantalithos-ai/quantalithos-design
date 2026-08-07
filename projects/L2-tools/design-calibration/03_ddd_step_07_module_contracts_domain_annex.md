# L2-tools Step 7 模块附录: `contracts` / `domain` boundary

> 状态: completed / pass
> 主文件: `03_ddd_step_07_trait_port_adapter_contracts.md`
> 输入: Step 5 `contracts/domain` 主轴；Step 6 shared carrier 与六组 domain object 附录
> 作用: 证明这两个 crate 不需要 I/O Port，并固定它们向 application 暴露的纯 callable boundary。

## 1. `contracts` capability / seam list

| Capability | Public callable | Input | Output | I/O / state |
|---|---|---|---|---|
| Validate entry metadata | `CommandMetadata::validate`;`QueryMetadata::validate`;`JobMetadata::validate` | owned/borrowed carrier | typed metadata error or validated value | none |
| Canonical digest framing | `canonical_digest_frame` per write envelope | public request metadata + semantic request | stable digest frame | none; encoding implementation belongs to application |
| Validate inbound envelope | `InboundEventEnvelope<T>::validate_envelope` | supported versions/source constraints | validated envelope marker | none |
| Map public pages | `Page<T>::empty`;`Page<T>::map_items` | items/watermark/freshness | new page | none |
| Map safe protocol error | `ProtocolError::from_application_error` | typed application-safe error projection | protocol-safe error | none; exhaustive code mapping |
| Construct receipt/report/result carriers | closed factories in Step 6 contracts annex | typed local refs and dispositions | immutable carrier | none |
| Map public Command/Query views | Step 8 `map_*_view` pure functions | already-loaded domain objects/refs/versions | exact body-free public view | none |

`contracts` defines no repository, resolver, clock, ID generator, publisher, handoff, transport, SDK client or runtime trait. It is safe to compile for downstream consumers without pulling application/infra dependencies.

## 2. `domain` callable boundary by object group

| Group | Pure constructors / transitions exposed to application | Inputs that must already be resolved | Explicitly forbidden dependency |
|---|---|---|---|
| Contract/evolution | `establish`, `formalize`, `assess`, `adopt_revision`, `request_retirement`, `complete_retirement`, safe view mappers | IDs, clock values, source refs, prior loaded versions, consumer refs | Store, Core resolver, wall clock, config |
| Binding/source | `declare`, `replace`, `invalidate`, `assess`, snapshot/ref/view factories | Hub safe source outcome, IDs/times, relation version | Hub client/registry/query |
| Invocation/admission | `canonicalize`, anchor/context factories, `admit`, `await_precondition`, `reject`, `unavailable` | Loaded contract/definition/binding assessment, typed caller context | Runtime plan/loop/request object |
| Precondition/handoff | requirement derive, authorization assessment factories, handoff prepare/evaluate, attempt factories | Typed external Port resolutions, clock/IDs | Authorization provider, Sandbox client/lifecycle |
| Outcome/safe handoff | source assess, terminal outcome factories, audit record, four-gate evaluation, material/attempt factories | Accepted safe source or no-execution basis, IDs/times | Source body, Bus/Observability client/status ownership |
| Integrity/derived | ref assess, gap transition, report/projection/diff/diagnostic/guidance factories | Repository read sets, formal authority resolutions, watermark | Projection store, external refresh, SDK generation |

Domain functions return `DomainError` only. Application maps repository, port, transaction and metadata errors before/after calling them; domain never receives `RepositoryError`, `PortCallError` or framework error.

## 3. Pure policy boundary

`domain::policies` exposes concrete stateless functions rather than object-safe traits:

```rust
/// Rejects any carrier that can contain raw request, result, provider, secret or evidence body.
pub fn verify_forbidden_body_free<T: SafeCarrierInspection>(value: &T)
    -> Result<(), DomainError>;

/// Applies all four target-specific safe-material checks as a non-configurable conjunction.
pub fn evaluate_safe_handoff(
    input: &SafeHandoffPolicyInput,
) -> Result<SafeHandoffEligibilityState, DomainError>;

/// Verifies exact typed identity, revision and correlation symmetry.
pub fn verify_reference_symmetry(
    input: &ReferenceSymmetryInput,
) -> Result<(), DomainError>;
```

`SafeCarrierInspection` is a sealed domain-internal trait implemented only for the Step 6 safe summary/ref/material types. It cannot be implemented by external crates to bless arbitrary bytes. Policy thresholds that would change owner, body-free, correlation, fail-closed or four-gate semantics are not configuration.

## 4. Stop review

| Review item | Result | Gap / correction |
|---|---|---|
| Public carrier functions are deterministic and I/O-free | pass | none |
| Domain constructors receive all ID/time/external inputs explicitly | pass | none |
| Domain has no async, repository, adapter, runtime or config dependency | pass | none |
| Policy helper cannot be used to self-authorize or bless raw body | pass | sealed inspection + closed functions |
| Step 8/9 can call stable validators/mappers without inventing helpers | pass | named callable boundary plus Step 8 exact view mapper signatures |
| No new business object/state introduced | pass | only sealed technical inspection trait |
