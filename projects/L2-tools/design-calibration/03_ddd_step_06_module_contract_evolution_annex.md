# L2-tools Step 6 模块附录: 工具合同与演进对象契约

> 状态: completed / pass
> 主文件: `03_ddd_step_06_object_contracts.md`
> Authority: 正式 `02-概要设计.md` §6.2 / §12.2.1
> 作用: 补齐六个对象的字段来源、完整 callable、enum 与逐对象停审；不新增对象。

## 1. Capability 到对象

| Capability | Owner object | Input | Output / side effect |
|---|---|---|---|
| 建立稳定 Tool identity | `ToolContract` | `ToolId`, first definition, binding mode, decision time | Active contract + first evolution fact in one UoW |
| 固定 revision 语义 | `FormalToolDefinition` | Formal intent, source ref, revision | Immutable definition revision |
| 判断演进影响 | `ToolCompatibilityImpact` | Base/candidate definitions, consumer refs | Append-only assessment, no current switch |
| 提供稳定读取 | `ToolContractView` | Committed contract, current definition, evolution head | Body-free read model |
| 锚定来源 | `DefinitionSourceRef` | Authority, locator, source revision, consumption time | Reference state, never source body |
| 解释正式变化 | `ToolContractEvolutionFact` | Before/after refs, actor, reason, correlation, time | Append-only history fact |

## 2. `ToolContract`

| Field | Type | Required source | Validation |
|---|---|---|---|
| `tool_id` | `ToolId` | `EstablishToolContractRequest.tool_id` or `IdGeneratorPort` under one documented mode | Non-empty, globally stable, never capability / display / implementation ID |
| `current_definition_revision` | `DefinitionRevision` | First definition or adopted candidate | Must resolve to same `tool_id`; exactly one current revision |
| `lifecycle_state` | `ToolContractLifecycleState` | Domain factory / owning transition | `Active -> RetirementPending -> Retired`; no reverse edge |
| `initial_binding_mode` | `BindingMode` | Establish Command | Immutable declaration expected for the first Binding; never a live relation pointer |
| `established_at` | `DecisionTime` | `ClockPort.now()` captured by application | Immutable |
| `retirement_reason` | `Option<ContractRetirementReason>` | Request-retirement Command | Required from `RetirementPending` onward; absent while Active |
| `retired_at` | `Option<DecisionTime>` | Application clock on verified completion | Required only for `Retired` |
| `version` | `ExpectedVersion` | Repository create result / optimistic version | Increment only by successful UoW commit |

| Callable | Return | Preconditions | Postconditions / errors |
|---|---|---|---|
| `ToolContract::establish(ToolId, DefinitionRevision, BindingMode, DecisionTime)` | `Result<ToolContract, DomainError>` | Valid ID; first revision exists; explicit mode | Active v0 contract; `InvalidIdentity`, `MissingDefinition` |
| `adopt_revision(&mut self, &FormalToolDefinition, &ToolCompatibilityImpact, Option<&ConsumerMigrationClosureRef>)` | `Result<(), DomainError>` | Active; matching tool/base; compatible has no closure, conditional has a verified matching closure, incompatible/unverifiable reject | Current revision changes once; `StaleRevision`, `MissingMigrationClosure`, `ClosureMismatch`, `IncompatibleRevision`, `UnverifiableImpact` |
| `request_retirement(&mut self, RetirementReason)` | `Result<(), DomainError>` | Active; non-empty safe reason | `RetirementPending`; `InvalidTransition` |
| `complete_retirement(&mut self, ImpactClosureRef, DecisionTime)` | `Result<(), DomainError>` | Pending; formal impact closure ref; completion time not before establishment | `Retired` with `retired_at`; `MissingClosure`, `InvalidTime`, `InvalidTransition` |
| `accepts_new_invocation(&self)` | `bool` | none | True only for `Active` |

| Variant | English rustdoc | Allowed source | Allowed destination |
|---|---|---|---|
| `Active` | `/// The contract accepts new invocation admission.` | `establish` | `RetirementPending` |
| `RetirementPending` | `/// Retirement was requested and awaits formal impact closure.` | `request_retirement` | `Retired` |
| `Retired` | `/// The contract rejects new invocations while preserving history.` | `complete_retirement` | none |

Stop review: identity, revision pointer, lifecycle and optimistic version have one owner; no registry/provider field; pass.

`ImpactClosureRef` is an L2 typed verification carrier, not evidence that an external consumer migrated or a test passed. Exact fields are `tool_id`, `protected_consumer_set_digest`, `consistency_report_key`, `required_source_watermark`, and `closure_basis_refs`. Application loads the named `ReferenceConsistencyReport` and accepts the ref only when the report scope covers the same tool and protected-consumer digest, its source watermark is equal or newer and comparable, its state is `Current`, and it contains no open blocking / integrity-critical gap for the retirement scope. `Partial`, `Stale`, `Failed`, missing or mismatched reports are `UnverifiableImpactClosure`. The carrier contains no run ID, evidence alias, signoff, consumer body or migration-success claim. A later Binding replacement may change live relation mode; it never rewrites this initial declaration.

`ConsumerMigrationClosureRef` is the adoption-specific peer carrier with exact fields `impact_ref`, `tool_id`, `base_revision`, `candidate_revision`, `protected_consumer_set_digest`, `consistency_report_key`, `required_source_watermark`, and `closure_basis_refs`. Application validates it through `ProjectionStore::get_consistency_report` before the UoW. The report must cover the exact impact pair and protected set, be `Current` at an equal/newer comparable watermark, and contain no open blocking / integrity-critical gap for that adoption. Compatible impact forbids a closure; conditionally compatible requires this verified ref; incompatible/unverifiable never permits adoption. It contains no migration body, run/test result, evidence alias or external signoff.

## 3. `FormalToolDefinition`

| Field | Type | Source / guard |
|---|---|---|
| `definition_id` | `FormalToolDefinitionId` | Application ID generator; unique per object |
| `tool_id` | `ToolId` | Owning contract request; must match source subject |
| `revision` | `DefinitionRevision` | Command-supplied expected next revision or repository-derived successor; selected mode fixed by protocol |
| `invocation_semantics` | `InvocationSemanticsSummary` | Validated formal intent; body-free, transport-neutral |
| `outcome_semantics` | `OutcomeSemanticsSummary` | Validated normalized result/error intent |
| `execution_requirement_basis` | `ExecutionRequirementBasis` | Tool-domain requirement declaration; no effective decision |
| `source_ref` | `DefinitionSourceRef` | Must support formalization at consumption time |
| `revision_state` | `DefinitionRevisionState` | `Candidate`, `Current`, `Superseded`, `Withdrawn` |

| Callable | Return | Contract |
|---|---|---|
| `formalize(FormalToolDefinitionId, ToolId, DefinitionRevision, FormalDefinitionIntent, DefinitionSourceRef)` | `Result<Self, DomainError>` | All semantic summaries validate and contain no forbidden body |
| `supports_invocation(&self, &CanonicalInvocationIntent)` | `Result<(), InvocationSemanticMismatch>` | Pure semantic membership test |
| `requires_authorization(&self)` / `requires_sandbox(&self)` | `bool` | Reads requirement basis only |
| `promote_to_current(&mut self)` | `Result<(), DomainError>` | Candidate only; invoked inside owning adoption UoW |
| `mark_superseded(&mut self, DefinitionRevision)` | `Result<(), DomainError>` | Current only; records replacement revision |
| `withdraw(&mut self, WithdrawalReason)` | `Result<(), DomainError>` | Candidate/current according to owning Command; never delete |

| Variant | English rustdoc | Allowed source | Allowed destination |
|---|---|---|---|
| `Candidate` | `/// A validated revision that is not yet current.` | `formalize` | `Current`, `Withdrawn` |
| `Current` | `/// The revision selected for new invocation anchors.` | adoption UoW | `Superseded`, `Withdrawn` |
| `Superseded` | `/// A historical revision replaced by another formal revision.` | adoption UoW | none |
| `Withdrawn` | `/// A revision explicitly removed from future consumption.` | withdrawal Command | none |

Stop review: definition holds semantic summaries only; provider route, wire schema, secret and implementation body absent; pass.

## 4. `ToolCompatibilityImpact`

| Field | Type | Source / guard |
|---|---|---|
| `tool_id` | `ToolId` | Both compared definitions; mismatch rejects |
| `base_revision` | `DefinitionRevision` | Current definition read under UoW snapshot |
| `candidate_revision` | `DefinitionRevision` | Candidate definition |
| `impact_class` | `CompatibilityImpactClass` | Domain comparison plus formally provided consumer references |
| `affected_consumption_refs` | `Vec<ConsumerReferenceSummary>` | Body-free consumer reference input; stable order, deduplicated |
| `assessed_at` | `AssessmentTime` | Application clock |

| Callable | Return | Contract |
|---|---|---|
| `assess(&FormalToolDefinition, &FormalToolDefinition, Vec<ConsumerReferenceSummary>, AssessmentTime)` | `Result<Self, DomainError>` | Pure; missing source/consumer coverage produces `Unverifiable` |
| `blocks_adoption(&self)` | `bool` | True for incompatible/unverifiable; conditional blocks until migration ref supplied |
| `requires_explicit_migration(&self)` | `bool` | True only for conditional class |
| `covers(&self, &ConsumerReferenceSummary)` | `bool` | Exact typed ref match |

| Variant | English rustdoc | Effect |
|---|---|---|
| `Compatible` | `/// Existing protected consumption semantics remain compatible.` | May pass adoption guard |
| `ConditionallyCompatible` | `/// Adoption requires a formal migration or re-evaluation reference.` | Blocks until closure |
| `Incompatible` | `/// Candidate breaks a protected consumption contract.` | Blocks adoption |
| `Unverifiable` | `/// Required source or consumer impact cannot be verified.` | Fail closed |

Stop review: assessment does not mutate current or invent migration; pass.

## 5. `ToolContractView`

| Field | Type | Source |
|---|---|---|
| `tool_id` | `ToolId` | Contract |
| `current_revision` | `DefinitionRevision` | Contract current pointer |
| `lifecycle` | `ToolContractLifecycleSummary` | Domain-to-contract mapper |
| `definition_summary` | `FormalDefinitionSafeSummary` | Current definition safe mapper |
| `binding_summary` | `BindingModeSafeSummary` | Contract binding mode only |
| `evolution_head` | `Option<EvolutionFactRef>` | History repository |
| `visibility` | `ConsumptionVisibility` | Application visibility decision |

| Callable | Contract |
|---|---|
| `project(&ToolContract, &FormalToolDefinition, Option<EvolutionFactRef>, ConsumptionVisibility)` | Exact contract / revision match required; no I/O |
| `is_consumable()` | Visible + active only; not authorization |
| `matches_revision(DefinitionRevision)` | Exact equality |
| `is_body_free()` | Must always return true or construction fails |

Stop review: Query view fully constructible from repository reads and mapper; no refresh/write; pass.

## 6. `DefinitionSourceRef`

| Field | Type | Source / guard |
|---|---|---|
| `source_ref_id` | `DefinitionSourceRefId` | ID generator |
| `authority_ref` | `ContractAuthorityRef` | `SharedContractAuthorityPort` or formally accepted L2 authority input |
| `source_locator` | `ExternalLocatorSummary` | Resolver output; body-free |
| `source_revision` | `ExternalRevisionRef` | Resolver output |
| `resolution_state` | `ExternalReferenceState` | Consumption assessment |
| `consumed_at` | `ConsumptionTime` | Clock at resolution |

Callables: `from_authority(...) -> Result<Self, DomainError>`; `matches_authority(&ContractAuthorityRef) -> bool`; `supports_formalization() -> bool`; `with_stale_assessment(SourceChangeRef, ConsumptionTime) -> ReferenceValidityAssessment`. Existing refs are immutable; no in-place consumption-time rewrite.

Variants for `ExternalReferenceState`: `Resolved`, `Stale`, `Conflicting`, `Unverifiable`; only `Resolved` supports a new definition. Stop review: `L2T-UP-008` candidate remains explicit; pass.

## 7. `ToolContractEvolutionFact`

| Field | Type | Source |
|---|---|---|
| `evolution_fact_id` | `EvolutionFactId` | Application ID generator before UoW save |
| `tool_id` | `ToolId` | Mutated contract |
| `change_kind` | `ContractEvolutionKind` | Owning operation closed mapping |
| `previous_revision` / `current_revision` | `Option<DefinitionRevision>` | Pre/post domain snapshot |
| `actor_ref` | `ActorRef` | Command metadata |
| `reason` | `ChangeReason` | Validated Command field |
| `correlation_ref` | `CorrelationRef` | Command metadata |
| `recorded_at` | `DecisionTime` | Application clock |

| Variant | English rustdoc | Required revision pair |
|---|---|---|
| `Established` | `/// Records creation of a stable contract and its first current revision.` | none -> current |
| `RevisionAdopted` | `/// Records replacement of the current definition revision.` | previous -> current |
| `RetirementRequested` | `/// Records a formal request to retire the contract.` | current -> same current |
| `Retired` | `/// Records completion of contract retirement.` | current -> same current |
| `RevisionWithdrawn` | `/// Records formal withdrawal of a definition revision.` | affected revision present |

Factory `record(...)` validates the revision pair against the kind. Fact is append-only, persisted in the same UoW as the subject mutation, and is the only source of `ToolContractChanged` candidate material. Stop review: pass.

## 8. Module Gate

| Check | Result |
|---|---|
| Six objects map to contract capabilities | pass |
| Every required field has one formal source | pass |
| Factory inputs cover required fields | pass |
| State enums have legal origins/destinations | pass |
| Query / diff / job cannot change current | pass |
| No provider / registry / wire / secret body | pass |
