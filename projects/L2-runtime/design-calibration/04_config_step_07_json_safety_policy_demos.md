# L2-runtime Step 7 Annex D2：CFG-06~10 Strict JSON Demos

> 创建日期：2026-08-17
> 状态：`done`
> 规则：strict JSON；数值/ref 是 `example-only/non-normative`，不构成 default、capacity、performance、formal owner contract 或 readiness

## 1. `action_guard` 配置 demo

```json
{
  "action_guard": {
    "version": "v1",
    "allowed_effect_classes": [
      "none",
      "read_only_external"
    ],
    "checked_view_freshness": {
      "max_age_seconds": 120
    }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束/校验 | 失败策略 |
|---|---|---|---|---|---|
| `action_guard.version` | schema string | `v1` | lineage | exact | mismatch fail-fast |
| `action_guard.allowed_effect_classes` | unique enum array | none/read-only | candidate upper set | nonempty；never creates Allowed | invalid fail-fast；missing facts block |
| `action_guard.checked_view_freshness.max_age_seconds` | positive seconds | `120` | max owner-view age | positive；unknown always reject | stale/unknown block |

Five guard kinds, isolation-required policy, unknown block/fence and freshness unknown rejection are static-derived。

## 2. `delegation` 配置 demo

```json
{
  "delegation": {
    "version": "v1",
    "enabled": false,
    "max_depth": 0,
    "max_child_turns": 0,
    "max_child_actions": 0,
    "max_child_context_weight": 0,
    "max_child_duration_seconds": 0
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束/校验 | 失败策略 |
|---|---|---|---|---|---|
| `delegation.version` | schema string | `v1` | lineage | exact | mismatch fail-fast |
| `delegation.enabled` | bool | false | admit child candidates | false iff all limits zero | tuple conflict fail-fast |
| `delegation.max_depth` | nonnegative integer | 0 | child depth cap | enabled -> >0; child decreases | conflict/expansion reject |
| `delegation.max_child_turns` | nonnegative integer | 0 | child turn cap | enabled -> >0 and <= parent | conflict/expansion reject |
| `delegation.max_child_actions` | nonnegative integer | 0 | child action cap | enabled -> >0 and <= parent | conflict/expansion reject |
| `delegation.max_child_context_weight` | nonnegative integer | 0 | child context cap | enabled -> >0 and <= parent/context | conflict/expansion reject |
| `delegation.max_child_duration_seconds` | nonnegative seconds | 0 | child duration cap | enabled -> >0 | conflict reject |

This is a disabled example. It says nothing about member/container availability。

## 3. `checkpoint_recovery` 配置 demo

```json
{
  "checkpoint_recovery": {
    "version": "v1",
    "allowed_recovery_modes": [
      "reconcile_only",
      "manual_review"
    ]
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束/校验 | 失败策略 |
|---|---|---|---|---|---|
| `checkpoint_recovery.version` | schema string | `v1` | lineage | exact | mismatch fail-fast |
| `checkpoint_recovery.allowed_recovery_modes` | unique nonempty enum array | reconcile/manual | allowed decision modes | does not itself permit decision | invalid fail-fast; unavailable mode blocked |

Committed checkpoint + closed fence and manual/reconcile unknown posture are static-derived. Lease and page controls live in jobs, not here。

## 4. `handoff_projection` 配置 demo

```json
{
  "handoff_projection": {
    "version": "v1",
    "projection_page_limit": 25,
    "view_freshness": {
      "max_age_seconds": 180
    },
    "redaction_policy_ref": "ref:example-only:redaction-policy:v1"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束/校验 | 失败策略 |
|---|---|---|---|---|---|
| `handoff_projection.version` | schema string | `v1` | lineage | exact | mismatch fail-fast |
| `handoff_projection.projection_page_limit` | positive integer | `25` | local projection upper bound | actual page also <= job/request bound | range/expansion reject |
| `handoff_projection.view_freshness.max_age_seconds` | positive seconds | `180` | safe view label age | unknown -> explicit degraded | invalid fail-fast |
| `handoff_projection.redaction_policy_ref` | typed ref | example-only ref | redaction policy identity | owner/kind/version/body-free | malformed/incompatible block |

Eligibility is static `local outcome + body-free material`; external emission is not a field. The ref is not a claim that an owner contract exists。

## 5. `idempotency` 配置 demo

```json
{
  "idempotency": {
    "version": "v1",
    "reservation_retention_seconds": 3600,
    "committed_result_retention_seconds": 7200,
    "event_inbox_retention_seconds": 7200,
    "job_state_retention_seconds": 7200,
    "digest_schema_version": "v1"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束/校验 | 失败策略 |
|---|---|---|---|---|---|
| `idempotency.version` | schema string | `v1` | lineage | exact | mismatch fail-fast |
| `idempotency.reservation_retention_seconds` | positive seconds | `3600` | reservation cleanup | <= committed result retention | conflict fail-fast |
| `idempotency.committed_result_retention_seconds` | positive seconds | `7200` | replay result cleanup | covers reservation/replay relation | conflict fail-fast |
| `idempotency.event_inbox_retention_seconds` | positive seconds | `7200` | inbox receipt cleanup | formal redelivery window required for qualification | invalid/pending qualification |
| `idempotency.job_state_retention_seconds` | positive seconds | `7200` | job state/report cleanup | formal replay window required for qualification | invalid/pending qualification |
| `idempotency.digest_schema_version` | schema string | `v1` | exact replay digest | contract match | mismatch fail-fast |

Numbers only show positivity and `committed >= reservation`. They are not safe operational defaults; permanent domain uniqueness survives all cleanup。

## 6. D2 gate

| Check | Result |
|---|---|
| five snippets are strict JSON | pending automated audit at Step 7 close |
| every exposed leaf has explanation row | pass |
| fixed safety rules absent from JSON | pass |
| no duplicate lease/scan/emission/uniqueness setting | pass |
| all numbers marked non-normative | pass |

```text
annex_D2 = done
next_step_07_module = slot_job_json_demos
```
