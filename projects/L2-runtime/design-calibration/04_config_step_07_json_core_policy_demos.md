# L2-runtime Step 7 Annex D1：CFG-01~05 Strict JSON Demos

> 创建日期：2026-08-17
> 状态：`done`
> 规则：每段均为可解析 strict JSON；数值/ref 是 `example-only/non-normative`，不是默认、容量、performance baseline、formal ref 或 readiness

## 1. `profile` 配置 demo

```json
{
  "profile": {
    "config_schema_version": "v1",
    "entry_profile": "api",
    "environment_class": "local_contract"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束/校验 | 失败策略 |
|---|---|---|---|---|---|
| `profile.config_schema_version` | string enum | `v1` | 选择 exact raw schema | 当前只支持 v1 | schema mismatch fail-fast |
| `profile.entry_profile` | enum | `api` | 选择 Runtime facade kind | 与 environment/assertion/scope/jobs 相容 | conflict fail-fast |
| `profile.environment_class` | enum | `local_contract` | 选择 validator matrix | 不进入 snapshot/readiness | unknown/conflict fail-fast |

## 2. `scope` 配置 demo

```json
{
  "scope": {
    "version": "v1",
    "allowed_entry_authorities": [
      "command_api",
      "query_api",
      "internal_loop"
    ]
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束/校验 | 失败策略 |
|---|---|---|---|---|---|
| `scope.version` | schema string | `v1` | policy lineage | supported exact version | mismatch fail-fast |
| `scope.allowed_entry_authorities` | unique enum array | Api exact set | 收窄 entry authority | nonempty subset；profile required authority | expansion/empty fail-fast |

Assembler additionally sets `StrictSubset` and `ContainedOrReadOnly`; these keys must not appear in JSON。

## 3. `context` 配置 demo

```json
{
  "context": {
    "version": "v1",
    "max_segments": 16,
    "max_weight": 1000,
    "per_source_max_weight": 250,
    "omission_policy": "optional_only",
    "freshness": {
      "max_age_seconds": 300,
      "unknown_disposition": "reject"
    }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束/校验 | 失败策略 |
|---|---|---|---|---|---|
| `context.version` | schema string | `v1` | lineage | exact | mismatch fail-fast |
| `context.max_segments` | positive integer | `16` | segment upper bound | positive wrapper | range fail-fast |
| `context.max_weight` | positive integer | `1000` | total provider-neutral weight | positive wrapper | range fail-fast |
| `context.per_source_max_weight` | positive integer/null | `250` | optional per-source cap | <= total | cross-field fail-fast |
| `context.omission_policy` | enum | `optional_only` | optional source omission posture | no mandatory unsafe omission | unknown/fail-open reject |
| `context.freshness.max_age_seconds` | positive seconds | `300` | freshness upper age | positive; request may narrow | range/expansion reject |
| `context.freshness.unknown_disposition` | enum | `reject` | unknown freshness result | reject or explicit degraded only | unknown enum fail-fast |

The numbers demonstrate type and relation only. Stable ordering is static-derived。

## 4. `working_memory` 配置 demo

```json
{
  "working_memory": {
    "version": "v1",
    "max_entries": 128,
    "compaction_trigger_entries": 96,
    "stale_entry_policy": "exclude"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束/校验 | 失败策略 |
|---|---|---|---|---|---|
| `working_memory.version` | schema string | `v1` | lineage | exact | mismatch fail-fast |
| `working_memory.max_entries` | positive integer | `128` | working window cap | positive | range fail-fast |
| `working_memory.compaction_trigger_entries` | positive integer | `96` | create-new-window trigger | `< max_entries` | cross-field fail-fast |
| `working_memory.stale_entry_policy` | enum | `exclude` | stale candidate handling | exclude/explicit degraded only | unknown/fail-open reject |

No durable-memory body/index/write/delete/retention setting is accepted。

## 5. `model_decision` 配置 demo

```json
{
  "model_decision": {
    "version": "v1",
    "allowed_purposes": [
      "select_next_step",
      "classify_feedback",
      "propose_action",
      "compose_delegation",
      "reflect",
      "recover",
      "summarize_safe_outcome"
    ],
    "logical_selection": {
      "allowed_capability_class_refs": [],
      "allowed_quality_tiers": [],
      "allowed_latency_classes": [],
      "allowed_data_boundaries": []
    },
    "semantic_schema_ref": null,
    "context_requirement": "frozen_complete_or_explicit_degraded"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束/校验 | 失败策略 |
|---|---|---|---|---|---|
| `model_decision.version` | schema string | `v1` | lineage | exact | mismatch fail-fast |
| `model_decision.allowed_purposes` | unique enum array | all seven | model intent upper set | nonempty/known/unique | invalid fail-fast |
| `...allowed_capability_class_refs` | typed-ref array | empty | owner-defined capability bounds | Candidate requires nonempty | Candidate conflict fail-fast |
| `...allowed_quality_tiers` | enum array | empty | logical quality bounds | Candidate requires nonempty | Candidate conflict fail-fast |
| `...allowed_latency_classes` | enum array | empty | logical latency bounds | Candidate requires nonempty | Candidate conflict fail-fast |
| `...allowed_data_boundaries` | enum array | empty | body boundary | Candidate requires nonempty; raw body forbidden | conflict/security reject |
| `model_decision.semantic_schema_ref` | typed ref/null | `null` | semantic result schema | Candidate requires non-null | missing Candidate ref fail-fast |
| `model_decision.context_requirement` | enum | explicit-degraded allowed | model input eligibility | degraded remains explicit | incompatible input blocked |

Empty selection arrays and null schema are valid only while `adapter_slots.model_decision` is Disabled/Blocked. No provider identity or route is implied。

## 6. D1 gate

| Check | Result |
|---|---|
| five module snippets parse as strict JSON | pending automated audit at Step 7 close |
| every exposed leaf has explanation row | pass |
| values satisfy local example relations | pass |
| model example is negative/blockable, not readiness | pass |
| no static-derived key leaked | pass |

```text
annex_D1 = done
next_step_07_module = safety_policy_json_demos
```
