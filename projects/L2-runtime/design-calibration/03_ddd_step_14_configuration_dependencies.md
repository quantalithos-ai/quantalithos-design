# L2-runtime 03 Step 14: Typed 配置引用与依赖绑定契约

> 创建日期: 2026-08-09
> 状态: done
> 边界: 定义 Rust 类型、读取点、校验和 builder binding；不定义 04 的 key/env/default/secret source/environment matrix

## 1. Runtime profiles

| Profile | Entry | Required local slots | Conditional external slots | Forbidden |
|---|---|---|---|---|
| `Api` | command/query handler | clock/ID/digest/UoW/idempotency/all local repos/config/visibility | governance/definition/source/memory/model/capability/invocation/child/checkpoint/handoff as capability requires | fake auto-binding; direct Sandbox; worker/job scheduler |
| `Worker` | six event consumers | clock/ID/digest/UoW/inbox/history/target repos/config | event-specific source adapters and ack Port | API route; direct truth mutation |
| `Jobs` | seven job runners/outbox publisher | clock/UoW/lease/job state/repos/config | source/status/publisher/handoff/projection by enabled job | scheduler ownership; unleased execution |
| `TestFake` | tests only | deterministic fake local set | explicit fake external slots | production readiness claim |

## 2. Typed policy profiles

```rust
pub enum ModelPurpose { SelectNextStep, ClassifyFeedback, ProposeAction, ComposeDelegation, Reflect, Recover, SummarizeSafeOutcome }
pub enum SideEffectClass { None, ReadOnlyExternal, ReversibleExternal, IrreversibleExternal, UnknownExternal }
pub enum RecoveryRequestMode { Resume, RestartFromStable, ReconcileOnly, Cancel, ManualReview }
pub struct RuntimeScopeProfile { pub allowed_entry_authorities: Vec<EntryAuthority>, pub child_scope_rule: ChildScopeRule, pub read_scope_rule: ReadScopeRule }
pub struct ContextCompositionProfile { pub max_segments: SegmentCount, pub max_weight: ContextWeight, pub per_source_max_weight: Option<ContextWeight>, pub omission_policy: OmissionPolicy, pub ordering_policy: ContextOrderingPolicy, pub freshness: FreshnessRequirement }
pub struct WorkingMemoryProfile { pub max_entries: EntryCount, pub compaction_trigger: CompactionTrigger, pub stale_entry_policy: StaleEntryPolicy }
pub struct ModelDecisionProfile { pub allowed_purposes: Vec<ModelPurpose>, pub logical_selection_bounds: ModelSelectionBounds, pub semantic_schema_ref: Option<ResponseContractRef>, pub context_requirement: ContextRequirement }
pub struct ActionGuardProfile { pub required_guard_kinds: NonEmptyVec<GuardKind>, pub allowed_effect_classes: Vec<SideEffectClass>, pub isolation_policy: IsolationSelectionPolicy, pub unknown_policy: UnknownGuardPolicy, pub checked_view_freshness: FreshnessRequirement }
pub struct DelegationProfile { pub enabled: bool, pub max_depth: DelegationDepth, pub max_child_turns: TurnCount, pub max_child_actions: AttemptCount, pub max_child_context_weight: ContextWeight, pub max_child_duration: RetentionDuration }
pub struct CheckpointRecoveryProfile { pub stable_source_requirement: StableRecoverySourceRequirement, pub allowed_recovery_modes: Vec<RecoveryRequestMode>, pub unknown_posture: UnknownRecoveryPosture }
pub struct HandoffProjectionProfile { pub handoff_eligibility: HandoffEligibilityPolicy, pub projection_page_limit: PageLimit, pub view_freshness: FreshnessRequirement, pub redaction_policy_ref: TypedRef }
pub struct IdempotencyProfile { pub reservation_retention: RetentionDuration, pub committed_result_retention: RetentionDuration, pub event_inbox_retention: RetentionDuration, pub job_state_retention: RetentionDuration, pub digest_schema_version: SchemaVersion }
```

| Profile | Injection point | Validator | Invalid posture |
|---|---|---|---|
| scope | admission/control/query/delegation | non-wildcard; formal entry kinds; child subset rule | builder fail/entry blocked |
| context | composition service | positive bounds; reserved weights fit; deterministic ordering | builder fail |
| working_memory | context/job service | max entries positive; compaction policy explicit | job disabled/blocked |
| model_decision | model service | provider-neutral; semantic schema present; no route/secret/cost | model slot blocked |
| action_guard | guard/action service | all required guard kinds; unknown fail-closed | action blocked |
| delegation | delegation service | bounded non-expanding depth/turn/action/context | delegation blocked |
| checkpoint_recovery | recovery service | unknown posture manual/wait; stable requirements explicit | checkpoint/recovery blocked |
| handoff_projection | handoff/query/job | body-free/redaction/page bounds/freshness | gap/degraded/build fail |
| idempotency | operation context | retention positive; digest schema known; committed identity preserved | startup fail |

Exact duration/count values are configuration design decisions; detailed design fixes positivity, relation and behavior only.

## 3. Adapter slot bindings

| Slot | Trait | Requirement | Blocker/current default | Positive activation requirements |
|---|---|---|---|---|
| Governance | `GovernancePreconditionPort` | required for admission/action paths | pending if formal read contract missing | contract/schema/scope/freshness compatible |
| DefinitionResolver | `DefinitionResolverPort` | required for progress needing Method/Role/Process refs | Method dirty baseline caveat | current formal ref contract |
| SourceResolver | `SourceResolverPort` | required for source-based paths | owner-specific pending allowed | typed source/snapshot/availability contract |
| DurableMemory | `MemoryRetrievalPort` | optional/blocked; working-only fallback | `L2R-UP-005` | owner retrieval/lifecycle contract |
| ModelDecision | `ModelDecisionPort` | required for model capability | `L2R-UP-004` | provider-neutral semantic adapter qualification |
| CapabilityExposure | `CapabilityExposurePort` | required for capability action | pending external | identity/exposure/descriptor schema |
| InvocationCaller | `InvocationCallerPort` | required for tool action submission | `L2R-UP-001/003` | formal L2-tools action/receipt/feedback contract; Runtime has no direct Sandbox slot |
| ModelContextMaterializer | `ModelContextMaterializerPort` | required for model input materialization | owner/redaction contract pending | body-free materialization contract |
| ChildRuntime | `ChildRuntimePort` | conditional for delegation | entry/member lifecycle external | child request/result seam only |
| CheckpointCommit | `CheckpointCommitPort` | required for stable checkpoint | `L2R-CP-001` | physical atomicity/status/reconcile contract |
| EventPublisher | `EventPublisherPort` | conditional worker/job | `L2R-UP-006/007` | Bus schema/route/implementation qualification |
| HandoffSubmission | `HandoffSubmissionPort` | conditional handoff | `L2R-UP-002` | producer/route/ack contract; local `HandoffRepositoryPort` is not a slot |
| ProjectionStore | `ProjectionStorePort` | required for safe view profiles | local physical store not selected | committed-history cursor/store contract |

No slot contains secret values, provider endpoint/route/quota/cost or sibling package dependency. A secret/credential may appear only as an opaque external credential reference owned by the adapter configuration authority, whose exact form belongs to 04 and implementation security review.

## 4. Job control bindings

```rust
pub struct JobControl { pub operation: JobOperation, pub activation: JobActivation, pub blocker_ref: Option<BlockerRef>, pub partition_count: PartitionCount, pub lease_ttl: LeaseTtl, pub page_limit: PageLimit, pub max_page_attempts: AttemptCount, pub retry_policy: JobRetryPolicy }
pub enum JobActivation { Disabled, Blocked, Candidate }
pub enum JobRetryPolicy { LocalBeforeEffect, StatusReconcileOnly, SamePayloadPublish, NoAutomaticRetry }
```

| Job | Activation dependency | Retry policy | Validation |
|---|---|---|---|
| rebuild views | projection/history slots | local before effect | page/partition positive; cursor contract |
| refresh sources | source resolver | local before effect | freshness/source partition |
| compact memory | working memory repo | local before effect | no durable delete; window version |
| resume runs | checkpoint/recovery/lease | no automatic external retry | committed stable/closed fence |
| reconcile effects | status/feedback/checkpoint Ports | status reconcile only | no submit capability in job |
| reconcile gaps | handoff status/ack | status reconcile only | no self-close |
| publish outbox | publisher/outbox | same payload publish | stable event ID/digest |

Cadence/scheduler trigger/environment activation are not chosen here.

## 5. Limits and binding points

| Limit type | Consumed by | Enforcement point | Cross-relation |
|---|---|---|---|
| `PageLimit` | repositories/queries/jobs | protocol validation and Port call | positive, bounded; job/report counts <= limit |
| `ContextWeight`/segments | composition/model/delegation | domain budget | reserved + usable <= max; child <= parent |
| `AttemptCount` | action/delegation/jobs | domain/service | unknown effect never consumes into automatic retry |
| `DelegationDepth` | delegation | domain boundary | child strictly less than parent |
| `LeaseTtl` | jobs/continuation | lease claim/renew | positive; runner stops before/at expiry |
| retention duration | idempotency/inbox/outbox/job reports | infra cleanup policy | domain uniqueness survives cleanup |
| freshness requirement | source/query/context | resolver/view/domain guard | stale/unknown never satisfies current |

## 6. Validator and builder sequence

```text
load candidate snapshot
  -> parse typed profiles/slots/controls/limits
  -> validate local invariants
  -> validate cross-profile relations
  -> bind required local Ports
  -> bind external candidate or BlockedAdapter
  -> construct services/facade
  -> expose only profile entry objects
```

Builder fails startup for missing required local truth/technical Ports or invalid configuration. It may expose degraded profile only when missing external capability has a typed blocked adapter and no positive entry can call it. `TestFake` is the only profile that auto-accepts fake implementations.

## 7. Dependency classification audit

| Dependency | Class | Configuration representation |
|---|---|---|
| `core-contracts` | compile candidate | manifest/version schema, not runtime slot |
| Governance/Hub/Method/Tools/Sandbox/Model/Memory | runtime/ref/adapter | typed adapter slots/contract refs |
| Bus/Observability | event | publisher/consumer/observation slots |
| SDK | downstream ref | no Runtime binding |
| fakes | fake | TestFake profile only |

No runtime/event/ref/adapter dependency is represented as Cargo/package dependency.

## 8. Step gate

| Check | Result |
|---|---|
| every policy profile has fields/injection/validator/failure | pass |
| exactly 13 canonical adapter slots have Trait/requirement/blocker/activation gate | pass |
| seven jobs have independent control/retry validation | pass |
| limits have enforcement/cross-relations | pass |
| no 04 key/env/default/secret/environment matrix invented | pass |

```text
step_14 = done
next_allowed_action = step_15_per_flow_observation_audit
```
