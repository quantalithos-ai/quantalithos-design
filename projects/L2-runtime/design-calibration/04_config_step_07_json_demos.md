# L2-runtime Step 7 Annex D4：Complete Strict JSON Example

> 创建日期：2026-08-17
> 状态：`done`
> Example profile：`local_contract + api`
> 重要：这是 parser/cross-field fixture，不是 code default、capacity、performance target、formal contract binding、deployment artifact 或 readiness evidence

## 1. Complete strict JSON

以下代码块不含注释，必须能由 strict JSON parser 直接读取。数值只演示类型和字段关系；所有 external slot 均为 explicit Blocked/Disabled，所有 job 均 Disabled。

```json
{
  "profile": {
    "config_schema_version": "v1",
    "entry_profile": "api",
    "environment_class": "local_contract"
  },
  "scope": {
    "version": "v1",
    "allowed_entry_authorities": [
      "command_api",
      "query_api",
      "internal_loop"
    ]
  },
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
  },
  "working_memory": {
    "version": "v1",
    "max_entries": 128,
    "compaction_trigger_entries": 96,
    "stale_entry_policy": "exclude"
  },
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
  },
  "action_guard": {
    "version": "v1",
    "allowed_effect_classes": [
      "none",
      "read_only_external"
    ],
    "checked_view_freshness": {
      "max_age_seconds": 120
    }
  },
  "delegation": {
    "version": "v1",
    "enabled": false,
    "max_depth": 0,
    "max_child_turns": 0,
    "max_child_actions": 0,
    "max_child_context_weight": 0,
    "max_child_duration_seconds": 0
  },
  "checkpoint_recovery": {
    "version": "v1",
    "allowed_recovery_modes": [
      "reconcile_only",
      "manual_review"
    ]
  },
  "handoff_projection": {
    "version": "v1",
    "projection_page_limit": 25,
    "view_freshness": {
      "max_age_seconds": 180
    },
    "redaction_policy_ref": "ref:example-only:redaction-policy:v1"
  },
  "idempotency": {
    "version": "v1",
    "reservation_retention_seconds": 3600,
    "committed_result_retention_seconds": 7200,
    "event_inbox_retention_seconds": 7200,
    "job_state_retention_seconds": 7200,
    "digest_schema_version": "v1"
  },
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
  },
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

## 2. Example interpretation

| Aspect | Meaning | Not a claim |
|---|---|---|
| local Api | validates Api authority/profile shape | API server/route exists |
| blocked external slots | negative facade/path posture | upstream service globally unavailable |
| disabled memory/child | profile does not configure those optional capabilities | owner implementation absent |
| disabled jobs | exact controls can be assembled but runners are not exposed | scheduler/job implementation exists |
| example refs/numbers | parser and relation fixture | formal ref, capacity, SLA or production default |
| blocker refs | known design blocker identity | blocker has been observed at runtime |

## 3. D4 gate

| Check | Result |
|---|---|
| exactly 12 top-level roots | pending automated audit at Step 7 close |
| exactly 13 slot objects | pending automated audit at Step 7 close |
| exactly 7 job objects | pending automated audit at Step 7 close |
| no comments/trailing commas/JSONC syntax | pending parser audit |
| no legacy alias/Ready/raw secret/provider route | pass by review |
| example contains no positive external/job activation | pass |

```text
annex_D4 = done
next_step_07_module = automated_json_and_cross_item_audit
```
