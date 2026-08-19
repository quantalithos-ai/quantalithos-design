# L2-runtime Step 7 Annex D3：CFG-11~12 Strict JSON Demos

> 创建日期：2026-08-17
> 状态：`done`
> 示例 posture：`local_contract + api`，external slots explicit Blocked/Disabled，all jobs Disabled
> 规则：bounds are `example-only/non-normative`; blocker IDs retain negative truth only

## 1. `adapter_slots` 配置 demo

```json
{
  "adapter_slots": {
    "governance": {
      "requirement": "required",
      "activation": "blocked",
      "contract_ref": null,
      "expected_schema": null,
      "blocker_ref": "L2R-IMPL-001"
    },
    "definition_resolver": {
      "requirement": "required",
      "activation": "blocked",
      "contract_ref": null,
      "expected_schema": null,
      "blocker_ref": "L2R-UP-008"
    },
    "source_resolver": {
      "requirement": "required",
      "activation": "blocked",
      "contract_ref": null,
      "expected_schema": null,
      "blocker_ref": "L2R-UP-006"
    },
    "durable_memory": {
      "requirement": "optional",
      "activation": "disabled",
      "contract_ref": null,
      "expected_schema": null,
      "blocker_ref": null
    },
    "capability_exposure": {
      "requirement": "required",
      "activation": "blocked",
      "contract_ref": null,
      "expected_schema": null,
      "blocker_ref": "L2R-IMPL-001"
    },
    "invocation_caller": {
      "requirement": "required",
      "activation": "blocked",
      "contract_ref": null,
      "expected_schema": null,
      "blocker_ref": "L2R-UP-001"
    },
    "model_context_materializer": {
      "requirement": "required",
      "activation": "blocked",
      "contract_ref": null,
      "expected_schema": null,
      "blocker_ref": "L2R-UP-004"
    },
    "model_decision": {
      "requirement": "required",
      "activation": "blocked",
      "contract_ref": null,
      "expected_schema": null,
      "blocker_ref": "L2R-UP-004"
    },
    "child_runtime": {
      "requirement": "optional",
      "activation": "disabled",
      "contract_ref": null,
      "expected_schema": null,
      "blocker_ref": null
    },
    "checkpoint_commit": {
      "requirement": "required",
      "activation": "blocked",
      "contract_ref": null,
      "expected_schema": null,
      "blocker_ref": "L2R-CP-001"
    },
    "handoff_submission": {
      "requirement": "optional",
      "activation": "blocked",
      "contract_ref": null,
      "expected_schema": null,
      "blocker_ref": "L2R-UP-002"
    },
    "event_publisher": {
      "requirement": "optional",
      "activation": "blocked",
      "contract_ref": null,
      "expected_schema": null,
      "blocker_ref": "L2R-UP-006"
    },
    "projection_store": {
      "requirement": "optional",
      "activation": "blocked",
      "contract_ref": null,
      "expected_schema": null,
      "blocker_ref": "L2R-UP-006"
    }
  }
}
```

### 1.1 Common leaf explanation

| Relative item | Type | Example posture | Purpose | Constraint | Failure |
|---|---|---|---|---|---|
| `requirement` | enum | required/optional | builder capability requirement | Disabled iff Optional | tuple mismatch fail-fast |
| `activation` | enum | blocked/disabled | negative/candidate binding posture | no Ready；tuple exact | unknown/tuple fail-fast |
| `contract_ref` | typed ref/null | null | owner contract identity | Candidate requires non-null | malformed/missing Candidate fail |
| `expected_schema` | schema/null | null | expected contract schema | Candidate requires non-null | mismatch/missing Candidate fail |
| `blocker_ref` | blocker ref/null | formal blocker/null | explicit negative cause | Blocked iff non-null; Candidate/Disabled null | conflict fail-fast |

### 1.2 Per-slot example meaning

| Slot | Example | Meaning | Does not mean |
|---|---|---|---|
| governance | Blocked | affected admission/action path remains blocked | governance unavailable globally or approval denied |
| definition_resolver | Blocked | immutable/current definition qualification unresolved | method body copied into Runtime |
| source_resolver | Blocked | no qualified positive source resolution | source owner absent globally |
| durable_memory | Disabled | this profile does not configure durable retrieval | working memory disabled |
| capability_exposure | Blocked | no qualified exposure view seam | capability registry owned locally |
| invocation_caller | Blocked | no Tools submission | direct Sandbox fallback |
| model_context_materializer | Blocked | no qualified body-free materialization | raw prompt allowed |
| model_decision | Blocked | no provider-neutral semantic call | provider route selected |
| child_runtime | Disabled | delegation disabled for this profile | member lifecycle unavailable globally |
| checkpoint_commit | Blocked | no physical commit proof | local prepared checkpoint is committed |
| handoff_submission | Blocked | local material may exist, submission does not | delivered/accepted/observed |
| event_publisher | Blocked | outbox remains local pending/unknown | event delivered |
| projection_store | Blocked | only explicit stale/degraded/blocked view path | domain truth unavailable |

The example uses blocker IDs to demonstrate negative posture. It does not prove any adapter implementation, owner response, route or qualification exists。

## 2. `jobs` 配置 demo

```json
{
  "jobs": {
    "rebuild_safe_runtime_views": {
      "activation": "disabled",
      "blocker_ref": null,
      "partition_count": 1,
      "lease_ttl_seconds": 30,
      "page_limit": 25,
      "max_page_attempts": 2
    },
    "refresh_source_snapshots": {
      "activation": "disabled",
      "blocker_ref": null,
      "partition_count": 1,
      "lease_ttl_seconds": 30,
      "page_limit": 25,
      "max_page_attempts": 2
    },
    "compact_working_memory": {
      "activation": "disabled",
      "blocker_ref": null,
      "partition_count": 1,
      "lease_ttl_seconds": 30,
      "page_limit": 25,
      "max_page_attempts": 2
    },
    "resume_eligible_runs": {
      "activation": "disabled",
      "blocker_ref": null,
      "partition_count": 1,
      "lease_ttl_seconds": 30,
      "page_limit": 10,
      "max_page_attempts": 1
    },
    "reconcile_unknown_effects": {
      "activation": "disabled",
      "blocker_ref": null,
      "partition_count": 1,
      "lease_ttl_seconds": 30,
      "page_limit": 10,
      "max_page_attempts": 1
    },
    "reconcile_handoff_gaps": {
      "activation": "disabled",
      "blocker_ref": null,
      "partition_count": 1,
      "lease_ttl_seconds": 30,
      "page_limit": 10,
      "max_page_attempts": 1
    },
    "publish_runtime_outbox": {
      "activation": "disabled",
      "blocker_ref": null,
      "partition_count": 1,
      "lease_ttl_seconds": 30,
      "page_limit": 25,
      "max_page_attempts": 2
    }
  }
}
```

### 2.1 Common leaf explanation

| Relative item | Type | Example | Purpose | Constraint | Failure |
|---|---|---|---|---|---|
| `activation` | enum | disabled | runner exposure posture | Api requires Disabled | cross-field fail-fast |
| `blocker_ref` | blocker ref/null | null | explicit Blocked cause | Disabled/Candidate null; Blocked non-null | tuple fail-fast |
| `partition_count` | positive integer | 1 | logical partition upper bound | not process/container count | range fail-fast |
| `lease_ttl_seconds` | positive seconds | 30 | live claim upper duration | not cadence; expired actor stops | range/lease stop |
| `page_limit` | positive integer | 10/25 | scanned page upper bound | request must narrow; projection min with policy | range/expansion reject |
| `max_page_attempts` | positive integer | 1/2 | bounded local page attempt cap | recovery exact 1; static retry policy | cross-field fail-fast |

### 2.2 Per-job static mapping

| Job key | Derived operation | Derived retry | Example activation |
|---|---|---|---|
| rebuild_safe_runtime_views | RebuildSafeRuntimeViews | LocalBeforeEffect | Disabled |
| refresh_source_snapshots | RefreshSourceSnapshots | LocalBeforeEffect | Disabled |
| compact_working_memory | CompactWorkingMemory | LocalBeforeEffect | Disabled |
| resume_eligible_runs | ResumeEligibleRuns | NoAutomaticRetry | Disabled |
| reconcile_unknown_effects | ReconcileUnknownEffects | StatusReconcileOnly | Disabled |
| reconcile_handoff_gaps | ReconcileHandoffGaps | StatusReconcileOnly | Disabled |
| publish_runtime_outbox | PublishRuntimeOutbox | SamePayloadPublish | Disabled |

The numbers only demonstrate positive types and the `resume attempts=1` relation. They are not defaults or safe production settings. Disabled objects do not expose a runner or schedule anything。

## 3. D3 gate

| Check | Result |
|---|---|
| 13 exact slot keys present once | pass by manual inventory; automated at Step 7 close |
| each slot has exactly five leaves | pass |
| 7 exact job keys present once | pass by manual inventory; automated at Step 7 close |
| each job has exactly six leaves | pass |
| all examples are negative/disabled; no readiness | pass |
| legacy aliases/Sandbox slot/retry field absent | pass |

```text
annex_D3 = done
next_step_07_module = complete_strict_json_demo
```
