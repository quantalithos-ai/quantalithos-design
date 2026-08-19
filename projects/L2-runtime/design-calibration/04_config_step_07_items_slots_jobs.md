# L2-runtime Step 7 Annex C：CFG-11 Adapter Slots 与 CFG-12 Jobs

> 创建日期：2026-08-17
> 状态：`done`
> 共同来源：one selected strict JSON
> 共同生效：startup builder/job registry
> 共同边界：activation 是配置姿态，不是 availability/readiness/执行事实

## 1. CFG-11 `adapter_slots` exact object

`adapter_slots` 必须且只能包含以下 13 个 object key，顺序不影响语义但 canonical fingerprint 按本表顺序。slot identity 由 key 派生，不在 child object 中重复。

```text
governance
definition_resolver
source_resolver
durable_memory
capability_exposure
invocation_caller
model_context_materializer
model_decision
child_runtime
checkpoint_commit
handoff_submission
event_publisher
projection_store
```

每个 slot object 必须包含且只能包含五个 leaf：

| 相对字段 | JSON 类型/允许值 | 默认 | 必填 | 敏感 | Typed target | 基本失败 |
|---|---|---|---|---|---|---|
| `requirement` | enum `required/optional` | none | 是 | internal | `SlotRequirement` | unknown/missing -> TypeMismatch/MissingRequired |
| `activation` | enum `disabled/blocked/candidate` | none | 是 | internal | `SlotActivation` | unknown/missing；`ready` -> forbidden |
| `contract_ref` | typed ref string or `null` | none | 是 | sensitive | `Option<AdapterContractRef>` | malformed/owner-kind mismatch |
| `expected_schema` | schema string or `null` | none | 是 | internal | `Option<SchemaVersion>` | unsupported/mismatch |
| `blocker_ref` | blocker ref string or `null` | none | 是 | sensitive | `Option<BlockerRef>` | malformed/body text/tuple conflict |

### 1.1 Slot tuple invariant

| activation | requirement | contract_ref | expected_schema | blocker_ref | 结果 |
|---|---|---|---|---|---|
| Disabled | must Optional | must null | must null | must null | slot absent by explicit design; no adapter/fake call |
| Blocked | Required or Optional | both null or both non-null | both null or both non-null | must non-null | valid negative posture; affected capability remains blocked |
| Candidate | Required or Optional | must non-null | must non-null | must null | eligible only for builder compatibility/implementation qualification |

Additional rules：

- Candidate does not imply `AdapterAvailabilityState::Candidate`; adapter realization must independently validate contract/schema/capability and may remain PendingContract/Blocked/Unavailable/Degraded。
- `contract_ref` and `expected_schema` are an inseparable pair in every activation posture: both null or both non-null. Disabled requires both null；Candidate requires both non-null；Blocked permits either complete pair posture but never a half-binding。
- Required+Blocked returns `BuildDisposition::Blocked` and denies entry exposure。
- Optional+Blocked preserves an explicit known blocker. Only when the existing entry contract permits the affected optional path to return a finite negative result may a Bound composition expose that path through a negative-only facade；otherwise composition is Blocked. Optional+Disabled means the capability is not configured。
- TestFake realization is outside this object and only allowed for `ci_contract + test_fake`; it still validates the same slot tuple and cannot report Ready。
- Unknown slot key, legacy alias, endpoint, route, credential, provider, quota, cost or extension map is forbidden。

## 2. Thirteen slot contracts

| Key / derived slot | Canonical Port | Used by | Candidate gate | Blocked/Disabled behavior | Current blocker input |
|---|---|---|---|---|---|
| `governance` / Governance | `GovernancePreconditionPort` | admission/action guard | formal effective decision/policy safe-view contract + scope/freshness schema | admission/action affected path Blocked/Waiting; no local approval | owner contract/qualification pending where absent |
| `definition_resolver` / DefinitionResolver | `DefinitionResolverPort` | goal-plan progress/method-role-process refs | body-free definition ref/version contract | progress Waiting/Blocked; no method body copy | `L2R-UP-008` baseline caveat |
| `source_resolver` / SourceResolver | `SourceResolverPort` | source capture/context/progress/J02 | typed source/snapshot/availability schema | source Pending/Stale/Unknown; no body fallback | owner-specific + `L2R-UP-006/008` |
| `durable_memory` / DurableMemory | `MemoryRetrievalPort` | context/memory/J03/Q05 | ref-only retrieval and lifecycle contract | working-memory-only path or Blocked; no durable write | `L2R-UP-005` |
| `capability_exposure` / CapabilityExposure | `CapabilityExposurePort` | action guard | identity/formal exposure/descriptor schema | guard Waiting/Blocked/Unknown; no registry write | owner contract pending where absent |
| `invocation_caller` / InvocationCaller | `InvocationCallerPort` | action submission/J05 | canonical L2-tools action/receipt/feedback/status contract | no submit; attempt/effect remains fenced | `L2R-UP-001/003/007` |
| `model_context_materializer` / ModelContextMaterializer | `ModelContextMaterializerPort` | model input binding | body-free materialization/redaction contract | model turn Blocked/Degraded; no raw prompt | `L2R-UP-004/006` |
| `model_decision` / ModelDecision | `ModelDecisionPort` | model turn/result | provider-neutral semantic request/result + logical class support | turn Blocked/Unavailable/Unknown | `L2R-UP-004` |
| `child_runtime` / ChildRuntime | `ChildRuntimePort` | delegation | child request/result/status seam | delegation Disabled/Blocked/Unknown; no lifecycle | `L2R-ENTRY-001` |
| `checkpoint_commit` / CheckpointCommit | `CheckpointCommitPort` | checkpoint/recovery/J04/J05 | physical commit/receipt/status-only reconcile contract | Prepared/CommitUnknown distinct; no resume proof | `L2R-CP-001` |
| `handoff_submission` / HandoffSubmission | `HandoffSubmissionPort` | handoff/J06 | body-free producer/route/ack/status contract | local candidate/gap/Unknown only | `L2R-UP-002/007` |
| `event_publisher` / EventPublisher | `EventPublisherPort` | outbound/J07 | exact stored event schema/route/publish receipt | outbox pending/unknown; no delivered/observed | `L2R-UP-006/007` |
| `projection_store` / ProjectionStore | `ProjectionStorePort` | safe query/J01 | committed-history cursor/store contract | Empty/Stale/Degraded/Unknown view | `L2R-UP-006/007` + physical store unselected |

Runtime has no Sandbox slot. Isolation requirements are inputs to the action guard and the positive external call remains `InvocationCallerPort` into L2-tools. Local `HandoffRepositoryPort` is not an adapter slot.

## 3. Slot-to-policy/profile cross gates

| Gate | Must hold | Failure posture |
|---|---|---|
| S-01 | Api/Worker/Jobs non-test profiles contain no fake realization | `FakeBindingForbidden` |
| S-02 | model_decision Candidate => model policy four arrays nonempty + semantic schema ref matches slot schema | `SlotMismatch/CrossFieldConflict` |
| S-03 | model_context_materializer Candidate => redaction/body-free contract ref/schema present | `SlotMismatch` |
| S-04 | invocation_caller Candidate does not add a Sandbox slot and references formal Tools contract | `DependencyDirectionViolation/ForbiddenKey` |
| S-05 | delegation enabled => child_runtime not Disabled; Candidate requires exact refs | CrossFieldConflict |
| S-06 | recovery modes resume/restart + positive job candidate => checkpoint_commit Candidate and CP blocker absent | blocked/reject candidate |
| S-07 | handoff/publish jobs Candidate => matching handoff/event slot Candidate | blocked/reject candidate |
| S-08 | projection/query positive path => projection_store Candidate; otherwise explicit degraded/blocked path only | blocked/degraded |
| S-09 | blocker_ref cannot be suppressed by Candidate or mismatched to known upstream blocker | CrossFieldConflict |
| S-10 | `Ready`, legacy aliases and provider settings are impossible schema values | ForbiddenKey/UnknownKey |

## 4. CFG-12 `jobs` exact object

`jobs` 必须且只能包含以下 7 个 object key；job operation and retry policy are derived from the key。

```text
rebuild_safe_runtime_views
refresh_source_snapshots
compact_working_memory
resume_eligible_runs
reconcile_unknown_effects
reconcile_handoff_gaps
publish_runtime_outbox
```

每个 job object 必须包含且只能包含六个 leaf：

| 相对字段 | JSON 类型/允许值 | 默认 | 必填 | 敏感 | Typed target | 基本失败 |
|---|---|---|---|---|---|---|
| `activation` | enum `disabled/blocked/candidate` | none | 是 | internal | `JobActivation` | unknown/Ready/missing |
| `blocker_ref` | blocker ref string or `null` | none | 是 | sensitive | `Option<BlockerRef>` | malformed/tuple conflict |
| `partition_count` | positive `u32` | none | 是 | internal | `PartitionCount` | zero/fraction/overflow |
| `lease_ttl_seconds` | positive `u64` seconds | none | 是 | internal | `LeaseTtl` | zero/fraction/overflow |
| `page_limit` | positive `u32` | none | 是 | internal | `PageLimit` | zero/fraction/overflow/request expansion |
| `max_page_attempts` | positive `u32` | none | 是 | internal | `AttemptCount` | zero/fraction/overflow/static retry conflict |

Activation tuple：Disabled => `blocker_ref=null`；Blocked => blocker non-null；Candidate => blocker null. Bound fields remain required and positive even when Disabled/Blocked so the exact typed `JobControl` is always constructible; they are dormant until Candidate execution and are still validated to prevent unsafe later activation through document replacement。

## 5. Seven job contracts and static retry mapping

| Key / derived operation | Static `JobRetryPolicy` | Required Candidate seams | Page behavior | Stop/fail-closed rule |
|---|---|---|---|---|
| `rebuild_safe_runtime_views` / RebuildSafeRuntimeViews | LocalBeforeEffect | projection_store + committed history/local lease | contiguous history -> projection CAS -> cursor commit | gap/lease loss/commit unknown preserves prior cursor |
| `refresh_source_snapshots` / RefreshSourceSnapshots | LocalBeforeEffect | source_resolver + local marker/history stores | each source gets explicit disposition | no body fallback/owner readiness inference |
| `compact_working_memory` / CompactWorkingMemory | LocalBeforeEffect | local working-memory/history stores only | create new window/version atomically | conflict/unknown keeps old window/cursor; no durable delete |
| `resume_eligible_runs` / ResumeEligibleRuns | NoAutomaticRetry | checkpoint_commit + recovery/lease/local stores | only committed stable point + closed fence | `max_page_attempts` must equal 1; CP/unknown/manual remains blocked |
| `reconcile_unknown_effects` / ReconcileUnknownEffects | StatusReconcileOnly | invocation/checkpoint status seams as target requires | same marker/checkpoint identity status query | never submit new effect or key |
| `reconcile_handoff_gaps` / ReconcileHandoffGaps | StatusReconcileOnly | handoff_submission status/ack seam | verified matching ack may close gap | gap cannot self-close/resend/claim observed |
| `publish_runtime_outbox` / PublishRuntimeOutbox | SamePayloadPublish | event_publisher + local outbox/lease | exact event ID and payload digest | never reconstruct current truth or mark delivered/observed |

## 6. Job cross gates

| Gate | Must hold | Failure |
|---|---|---|
| J-01 | all seven exact entries present; no aliases/extra/missing | MissingRequired/UnknownKey |
| J-02 | Api/Worker profiles: all activation Disabled | CrossFieldConflict |
| J-03 | Candidate only under Jobs or TestFake profile | CrossFieldConflict |
| J-04 | Candidate required external/local seams complete; Blocked dependency cannot be hidden | blocked/reject candidate |
| J-05 | resume max_page_attempts exactly 1 | CrossFieldConflict |
| J-06 | actual request page_limit <= job page_limit; projection page additionally <= policy page limit | operation reject |
| J-07 | live lease with matching epoch required before page read/write; ttl is not scheduler cadence | page reject/stop |
| J-08 | partition_count is a logical upper bound, not a process/container count | invalid semantic alias forbidden |
| J-09 | operation/retry keys cannot appear in JSON; static mapping exact | ForbiddenKey |
| J-10 | scheduler/cadence/cron/member/container/image keys forbidden | ForbiddenKey |

## 7. Current blocker posture

| Job | Current positive qualification blocker |
|---|---|
| rebuild views | projection physical contract + `L2R-UP-006/007/L2R-IMPL-001` |
| refresh sources | owner-specific source contract + `L2R-UP-006/008` |
| compact memory | implementation/local store qualification + `L2R-IMPL-001` |
| resume runs | `L2R-CP-001/L2R-IMPL-001` |
| reconcile effects | `L2R-UP-001/003/007`, `L2R-CP-001` |
| reconcile gaps | `L2R-UP-002/007` |
| publish outbox | `L2R-UP-006/007` |

This table prevents positive qualification; it does not require every document to mark every job Blocked. A document may set Disabled. Candidate is only valid after corresponding blocker truth is formally closed and supplied to implementation-time qualification; the current design does not assert that closure。

## 8. Slot/job annex gate

| Check | Result |
|---|---|
| exact 13 slots x 5 exposed leaves | pass; 65 leaves |
| exact 7 jobs x 6 exposed leaves | pass; 42 leaves |
| slot/job identities and retry policies static-derived | pass |
| tuple invariants are deterministic | pass |
| no direct Sandbox/Handoff alias/Ready/provider secret | pass |
| current blockers preserved without fabricated qualification | pass |
| no new 03 carrier required | pass |

```text
annex_C = done
next_step_07_module = strict_json_module_demos
```
