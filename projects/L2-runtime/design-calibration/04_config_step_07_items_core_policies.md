# L2-runtime Step 7 Annex A：CFG-01~05 Core Policy Items

> 创建日期：2026-08-17
> 状态：`done`
> 共同来源：one selected strict JSON
> 共同生效：startup typed snapshot
> 默认值：除表中明确写 `null allowed` 外，全部 `none (required)`；即使 nullable 也必须显式出现

## 1. CFG-01 `profile`

| 配置项 | JSON 类型/允许值 | 默认 | 必填 | 作用域/生效 | 敏感 | 失败 | Typed target |
|---|---|---|---|---|---|---|---|
| `profile.config_schema_version` | string；当前只 `v1` | none | 是 | document/startup | public | unsupported -> SchemaMismatch | `RuntimeConfigSnapshot.config_schema_version` |
| `profile.entry_profile` | enum `api/worker/jobs/test_fake` | none | 是 | process/startup | internal | unknown/matrix mismatch -> fail-fast | `RuntimeProfile.kind` |
| `profile.environment_class` | enum `local_contract/ci_contract/integration_candidate/production_candidate` | none | 是 | validation context only | internal | unknown/matrix mismatch -> fail-fast | loader context；不持久化到 snapshot |

Rules：

- `ci_contract` iff `test_fake`；其他 environment 禁止 TestFake。
- entry assertion 若存在必须等于 `entry_profile`，不能覆盖。
- environment/entry 中不得包含 `ready/live/staging` 语义。

## 2. CFG-02 `scope`

| 配置项 | JSON 类型/允许值 | 默认 | 必填 | 作用域/生效 | 敏感 | 失败 | Typed target |
|---|---|---|---|---|---|---|---|
| `scope.version` | string；当前只 `v1` | none | 是 | policy lineage/startup | public | mismatch -> SchemaMismatch | `RuntimePolicyVersionSet.scope` |
| `scope.allowed_entry_authorities` | unique nonempty enum array：`command_api/query_api/inbound_event_worker/continuation_worker/operations_job/internal_loop` | none | 是 | process entry exposure/startup | internal | empty/unknown/profile expansion -> fail-fast | `RuntimeScopeProfile.allowed_entry_authorities` |

Static-derived：`child_scope_rule=StrictSubset`；`read_scope_rule=ContainedOrReadOnly`。

Profile authority upper sets：

| entry | maximum allowed set | required member |
|---|---|---|
| api | command_api, query_api, internal_loop | internal_loop + at least one API authority |
| worker | inbound_event_worker, continuation_worker, internal_loop | internal_loop + at least one worker authority |
| jobs | operations_job, internal_loop | both |
| test_fake | any nonempty subset of six | at least one; test purpose must declare exact subset |

JSON may narrow but cannot add outside the row. Scope rules themselves are not configurable.

## 3. CFG-03 `context`

| 配置项 | JSON 类型/允许值 | 默认 | 必填 | 作用域/生效 | 敏感 | 失败 | Typed target |
|---|---|---|---|---|---|---|---|
| `context.version` | string `v1` | none | 是 | lineage/startup | public | mismatch | `policy_versions.context` |
| `context.max_segments` | positive `u32` integer | none | 是 | each captured operation | internal | zero/fraction/overflow -> RangeViolation | `ContextCompositionProfile.max_segments` |
| `context.max_weight` | positive `u64` provider-neutral units | none | 是 | each captured operation | internal | zero/fraction/overflow | `max_weight` |
| `context.per_source_max_weight` | positive `u64` or `null` | none | 是 | each captured operation | internal | zero/>total/type error | `per_source_max_weight` |
| `context.omission_policy` | enum `optional_only/no_omission` | none | 是 | composition decision | internal | unknown | `OmissionPolicy` |
| `context.freshness.max_age_seconds` | positive `u64` seconds | none | 是 | source/view check | internal | zero/fraction/overflow | `FreshnessRequirement.max_age` |
| `context.freshness.unknown_disposition` | enum `reject/return_explicit_degraded` | none | 是 | context result posture | internal | unknown or positive-use downgrade | `UnknownFreshnessDisposition` |

Static-derived：`ordering_policy=MandatoryThenStableSource`。

Cross rules：

- `per_source_max_weight == null` 表示没有额外 per-source cap，但 total cap 仍强制；非 null 时必须 `<= max_weight`。
- `optional_only` 只能省略被 domain 标为 optional 且已记录 omission reason 的候选；mandatory/stale/unknown/unsafe source 不因配置被默默省略。
- `return_explicit_degraded` 只允许返回带明确 degraded posture 的 context/view；不能满足 `FrozenComplete` 或任何 positive action freshness。
- operation request may narrow segments/weight/freshness age; it cannot enlarge or change ordering/unknown semantics。

## 4. CFG-04 `working_memory`

| 配置项 | JSON 类型/允许值 | 默认 | 必填 | 作用域/生效 | 敏感 | 失败 | Typed target |
|---|---|---|---|---|---|---|---|
| `working_memory.version` | string `v1` | none | 是 | lineage/startup | public | mismatch | `policy_versions.working_memory` |
| `working_memory.max_entries` | positive `u32` | none | 是 | working window/startup | internal | zero/fraction/overflow | `WorkingMemoryProfile.max_entries` |
| `working_memory.compaction_trigger_entries` | positive `u32` | none | 是 | J03/window decision | internal | zero/>=max | `CompactionTrigger.at_or_above_entries` |
| `working_memory.stale_entry_policy` | enum `exclude/mark_degraded` | none | 是 | composition/window | internal | unknown/include-as-current forbidden | `StaleEntryPolicy` |

Cross rules：trigger must be `< max_entries`。`mark_degraded` 只保留显式 degraded label，不把 stale entry 当 current。该域只控制 Runtime-owned working window；任何 `episodic/semantic/index/write/delete/retention/rebuild` key 都是 ForbiddenKey。

## 5. CFG-05 `model_decision`

| 配置项 | JSON 类型/允许值 | 默认 | 必填 | 作用域/生效 | 敏感 | 失败 | Typed target |
|---|---|---|---|---|---|---|---|
| `model_decision.version` | string `v1` | none | 是 | lineage/startup | public | mismatch | `policy_versions.model_decision` |
| `model_decision.allowed_purposes` | unique nonempty subset of 7 exact purpose literals | none | 是 | model intent | internal | empty/unknown/duplicate | `allowed_purposes` |
| `model_decision.logical_selection.allowed_capability_class_refs` | unique typed-ref string array；Candidate 时 nonempty | none | 是 | owner-neutral selection | sensitive | malformed/duplicate/missing-for-Candidate | `ModelSelectionBounds.allowed_capability_classes` |
| `model_decision.logical_selection.allowed_quality_tiers` | unique array `baseline/standard/high`；Candidate 时 nonempty | none | 是 | logical selection | internal | unknown/required-empty | `allowed_quality_tiers` |
| `model_decision.logical_selection.allowed_latency_classes` | unique array `interactive/bounded_batch`；Candidate 时 nonempty | none | 是 | logical selection | internal | unknown/required-empty | `allowed_latency_classes` |
| `model_decision.logical_selection.allowed_data_boundaries` | unique array `safe_refs_only/body_free_summary`；Candidate 时 nonempty | none | 是 | data boundary | internal | raw-body literal/unknown/empty | `allowed_data_boundaries` |
| `model_decision.semantic_schema_ref` | typed ref string or `null` | none | 是 | semantic adapter contract | sensitive | malformed；Candidate+null -> MissingRequired | `Option<ResponseContractRef>` |
| `model_decision.context_requirement` | enum `frozen_complete/frozen_complete_or_explicit_degraded` | none | 是 | model input binding | internal | unknown/incompatible context | `ContextRequirement` |

Exact purpose literals：`select_next_step`、`classify_feedback`、`propose_action`、`compose_delegation`、`reflect`、`recover`、`summarize_safe_outcome`。

`allowed_capability_class_refs` are opaque owner-defined identities, not Runtime-created taxonomy or provider/model names. When `adapter_slots.model_decision.activation=Candidate`, all four selection arrays must be nonempty and `semantic_schema_ref` non-null. Any key/literal containing endpoint/route/token/secret/quota/cost/billing/provider product is forbidden.

## 6. Core policy cross-domain gate

| Check | Result |
|---|---|
| 24 exposed leaves have type/default/required/scope/sensitivity/failure/target | pass |
| three static-derived policy fields are not exposed | pass |
| exact EntryAuthority six-way mapping replaces old four-kind alias | pass |
| model bounds include capability-class dimension without local taxonomy | pass |
| no numeric capacity default or provider setting | pass |
| core domains introduce no new 03 carrier | pass |

```text
annex_A = done
next_step_07_module = safety_policy_items
```
