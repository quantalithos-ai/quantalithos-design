# Step 7. 定义配置项清单

> 本文件是 `projects/L1-process/04-配置设计.md` 的 Step 7 中间产物。
> 本步把 P0 配置项整理成可实现、可校验、可测试的正式清单。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 7
- 回填章节: `projects/L1-process/04-配置设计.md` §7 配置项清单

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 3 控制面 | 确定配置 section | 按 store、boundary、idempotency、projection、jobs、external、outbox、handoff、features、runtime 展开 |
| Step 5 来源优先级 | 确定来源列 | defaults / JSON / env,entry args only local |
| Step 6 profile 矩阵 | 确定默认值语义 | P0 默认 fake / in-memory / fixed / sequence |
| `03_ddd_step_14_config_external_binding.md` §6.2 | 字段级事实源 | 38 个配置项来自已定义 `ProcessRuntimeConfig` 字段 |

## 3. SOP 问题回答

本 Step 的配置项名称、类型、默认值、必填性、来源、作用域、生效方式、敏感级别、失败策略和关联模块见 §4.2。配置项只覆盖 `ProcessRuntimeConfig` 已有字段,不新增 top-level section。

项目本地配置使用 section-local key,例如 `store.adapter_kind`、`outbox.topic_map.runtime_shape_changed`。系统级聚合配置若需要统一管理,可映射为 `process.store.adapter_kind`,但本地 JSON 不重复 `process` 前缀。

## 4. 结构化中间产物

### 4.1 基础配置类型解析规则

| 类型 | 输入形态 | 内部表示 / 归属 | validation |
|---|---|---|---|
| `RetentionDuration` | string,`<positive integer><unit>`;单位只允许 `ms`、`s`、`m`、`h`、`d` | `infra/config.rs` config parser;进入 adapter 前转换为 duration | 空字符串、0、负数、未知单位、大小写不匹配、内部空白或换算溢出 fail-fast |
| `ByteSize` | positive integer | `infra/config.rs` 本地 newtype | 0、负数、非整数或超过实现上限 fail-fast |
| `PageLimit` | positive integer | contracts / config parser 对齐 query page limit | 0、负数、非整数或超过实现上限 fail-fast |
| `RetryBackoffConfig` | object:`initial_delay`、`max_delay`、`multiplier` | `infra/config.rs` | `initial_delay > 0`;`max_delay >= initial_delay`;`multiplier >= 1` |
| `RetryPolicyConfig` | object:`max_attempts`、`backoff` | `infra/config.rs` | `max_attempts >= 0`;若 `max_attempts > 0`,backoff 必须有效 |
| `ExternalAdapterConfig` | object:`adapter_kind` plus optional `endpoint_ref` / `credential_ref` | `infra/config.rs` | `adapter_kind` 只允许 `fake` / `controlled` / `endpoint` / `disabled`;`fake` 必须可输出 fake marker;`controlled` 必须有 controlled endpoint ref;`endpoint` 必须有 endpoint ref;不得 fallback fake success |
| `HandoffTargetConfig` | object:`adapter_kind` plus `destination_ref` / optional `endpoint_ref` / optional `credential_ref` | `infra/config.rs` | `fake` 必须可输出 fake marker;`controlled` 必须有 destination ref 和 controlled endpoint ref;`endpoint` 必须有 destination ref |
| `ProcessTopicMapConfig` | object with 10 topic strings | `infra/config.rs` | 每个 `ProcessOutboxEventKind` 必须有 topic,默认匹配 Step 8 `.v1` topics |

### 4.2 配置项清单

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `store.adapter_kind` | `ProcessStoreAdapterKind` | `in_memory` | 否 | defaults / JSON / env | runtime / adapter | startup | public | 不支持值 fail-fast | `infra::config`,`infra::runtime_builder`,`infra::repositories` |
| `store.transaction_timeout` | `RetentionDuration` | `5s` | 否 | defaults / JSON / env | adapter | startup | internal | 非正数或格式错误 fail-fast | `infra::repositories` |
| `store.enable_optimistic_conflict_assertions` | `bool` | `true` | 否 | defaults / JSON / env | adapter / repository | startup | public | 非 bool fail-fast | `infra::repositories` |
| `boundary.max_command_body_bytes` | `ByteSize` | `1048576` | 否 | defaults / JSON / env | entry | startup | public | 小于最小值或格式错误 fail-fast | `api::command_handlers` |
| `boundary.max_page_limit` | `PageLimit` | `100` | 否 | defaults / JSON / env | query | startup | public | 小于 1 或超过实现上限 fail-fast | `api::query_handlers`,`infra` list adapters |
| `boundary.query_read_timeout` | `RetentionDuration` | `2s` | 否 | defaults / JSON / env | query | startup | internal | 非正数或格式错误 fail-fast | `api::query_handlers`,`infra::runtime_builder` |
| `idempotency.command_retention` | `RetentionDuration` | `24h` | 否 | defaults / JSON / env | adapter / policy | startup | internal | 小于客户端 retry window fail-fast | `infra::idempotency_store` |
| `idempotency.event_dedup_retention` | `RetentionDuration` | `7d` | 否 | defaults / JSON / env | worker / adapter | startup | internal | 小于 event redelivery window fail-fast | `infra::idempotency_store`,`worker::consumers` |
| `idempotency.job_retention` | `RetentionDuration` | `7d` | 否 | defaults / JSON / env | jobs / adapter | startup | internal | 小于 scheduler rerun window fail-fast | `infra::idempotency_store`,`jobs::*` |
| `idempotency.reserved_record_max_age` | `RetentionDuration` | `15m` | 否 | defaults / JSON / env | adapter / cleanup | startup | internal | 非正数或大于 command retention fail-fast | `infra::idempotency_store` |
| `projection.adapter_kind` | `ProcessProjectionAdapterKind` | `in_memory` | 否 | defaults / JSON / env | adapter | startup | public | 不支持值 fail-fast | `infra::projection_stores` |
| `projection.stale_threshold` | `RetentionDuration` | `60s` | 否 | defaults / JSON / env | query / projection | startup | internal | 非正数 fail-fast | `infra::projection_stores`,`application` query policy |
| `projection.rebuild_batch_size` | `PageLimit` | `100` | 否 | defaults / JSON / env | projection job | job-run-start | public | 小于 1 或超过实现上限 fail-fast | `jobs::projection_rebuild` |
| `jobs.default_batch_size` | `PageLimit` | `100` | 否 | defaults / JSON / env | job-run | job-run-start | public | 小于 1 或超过实现上限 fail-fast | `jobs::*`,`worker::*` |
| `jobs.max_parallelism` | `u16` | `1` | 否 | defaults / JSON / env | worker / job-run | job-run-start | public | 小于 1 fail-fast | `worker::*`,`jobs::*` |
| `jobs.job_timeout` | `RetentionDuration` | `300s` | 否 | defaults / JSON / env | job-run | job-run-start | internal | 非正数 fail-fast | `jobs::*` |
| `jobs.retry_backoff` | `RetryBackoffConfig` | `{initial_delay:1s,max_delay:30s,multiplier:2}` | 否 | defaults / JSON / env | worker / job-run | job-run-start | internal | 非法 backoff fail-fast | `jobs::*`,`worker::*` |
| `external.method_library` | `ExternalAdapterConfig` | `fake` | 否;endpoint 时条件必填 | defaults / JSON / env | adapter | startup | ref-only sensitive | 配置不完整 fail-fast;resolver failure explicit unresolved | `infra::source_resolvers` |
| `external.work` | `ExternalAdapterConfig` | `fake` | 否;endpoint 时条件必填 | defaults / JSON / env | adapter | startup | ref-only sensitive | 配置不完整 fail-fast;do not mutate Work truth | `infra::source_resolvers` |
| `external.identity` | `ExternalAdapterConfig` | `fake` | 否;endpoint 时条件必填 | defaults / JSON / env | adapter | startup | ref-only sensitive | 配置不完整 fail-fast;capability unavailable surface | `infra::source_resolvers` |
| `external.governance` | `ExternalAdapterConfig` | `fake` | 否;endpoint 时条件必填 | defaults / JSON / env | adapter | startup | ref-only sensitive | 配置不完整 fail-fast;no automatic resume | `infra::source_resolvers` |
| `external.artifact` | `ExternalAdapterConfig` | `fake` | 否;endpoint 时条件必填 | defaults / JSON / env | adapter | startup | ref-only sensitive | 配置不完整 fail-fast;no artifact body | `infra::source_resolvers` |
| `external.runtime` | `ExternalAdapterConfig` | `fake` | 否;endpoint 时条件必填 | defaults / JSON / env | adapter | startup | ref-only sensitive | 配置不完整 fail-fast;no execution log body | `infra::source_resolvers` |
| `external.conversation` | `ExternalAdapterConfig` | `fake` | 否;endpoint 时条件必填 | defaults / JSON / env | adapter | startup | ref-only sensitive | 配置不完整 fail-fast;no conversation body | `infra::source_resolvers` |
| `external.resolver_timeout` | `RetentionDuration` | `2s` | 否 | defaults / JSON / env | adapter | startup | internal | 非正数 fail-fast | `infra::source_resolvers` |
| `external.resolver_retry` | `RetryPolicyConfig` | `{max_attempts:0,backoff:{initial_delay:1s,max_delay:1s,multiplier:1}}` | 否 | defaults / JSON / env | adapter | startup | internal | 非法 retry policy fail-fast | `infra::source_resolvers` |
| `outbox.publisher` | `ExternalAdapterConfig` | `fake` | 否;endpoint 时条件必填 | defaults / JSON / env | adapter | startup | ref-only sensitive | 配置不完整 fail-fast;publish failure 只标记 failed / retry | `infra::publishers` |
| `outbox.publish_batch_size` | `PageLimit` | `100` | 否 | defaults / JSON / env | worker / job-run | job-run-start | public | 小于 1 或超过实现上限 fail-fast | `worker::outbox_publisher`,`jobs` |
| `outbox.publish_retry` | `RetryPolicyConfig` | `{max_attempts:3,backoff:{initial_delay:1s,max_delay:30s,multiplier:2}}` | 否 | defaults / JSON / env | worker / job-run | job-run-start | internal | 非法重试策略 fail-fast | `worker::outbox_publisher` |
| `outbox.topic_map` | `ProcessTopicMapConfig` | Step 8 `.v1` topics | 否 | defaults / JSON / env | publisher | startup | internal | 缺 topic 或 topic 不合法 fail-fast | `infra::publishers`,`worker::outbox_publisher` |
| `handoff.trace_target` | `HandoffTargetConfig` | `fake` | 否;endpoint 时条件必填 | defaults / JSON / env | adapter / job-run | startup | ref-only sensitive | 配置不完整 fail-fast;handoff failure 写 marker | `infra::handoff_adapters`,`jobs::*handoff*` |
| `handoff.archive_target` | `HandoffTargetConfig` | `fake` | 否;endpoint 时条件必填 | defaults / JSON / env | adapter / job-run | startup | ref-only sensitive | 配置不完整 fail-fast;archive failure 写 marker | `infra::handoff_adapters`,`jobs::*handoff*` |
| `handoff.delivery_timeout` | `RetentionDuration` | `5s` | 否 | defaults / JSON / env | adapter / job-run | startup | internal | 非正数 fail-fast | `infra::handoff_adapters` |
| `handoff.delivery_retry` | `RetryPolicyConfig` | `{max_attempts:3,backoff:{initial_delay:1s,max_delay:30s,multiplier:2}}` | 否 | defaults / JSON / env | adapter / job-run | job-run-start | internal | 非法 retry policy fail-fast | `jobs::*handoff*` |
| `features.derived_views_enabled` | `bool` | `true` | 否 | defaults / JSON / env | runtime / query | startup | public | 非 bool fail-fast;不得关闭 truth path | `infra::runtime_builder`,`api`,`jobs` |
| `features.search_enabled` | `bool` | `false` | 否 | defaults / JSON / env | runtime / query | startup | public | 非 bool 或缺 search adapter 时启用 fail-fast | `infra::runtime_builder`,`api` |
| `runtime.clock_kind` | `ClockKind` | `fixed` for P0 deterministic profile | 否 | defaults / JSON / env | runtime | startup | public | 不支持值 fail-fast | `infra::clock_id`,`infra::runtime_builder` |
| `runtime.id_generator_kind` | `IdGeneratorKind` | `sequence` | 否 | defaults / JSON / env | runtime | startup | public | 不支持值 fail-fast | `infra::clock_id`,`infra::runtime_builder` |

### 4.3 P0 JSONC 文档示例

```jsonc
{
  // 注释只用于文档说明;实际 JSON 配置必须删除注释。
  "store": {
    "adapter_kind": "in_memory",
    "transaction_timeout": "5s",
    "enable_optimistic_conflict_assertions": true
  },
  "boundary": {
    "max_command_body_bytes": 1048576,
    "max_page_limit": 100,
    "query_read_timeout": "2s"
  },
  "idempotency": {
    "command_retention": "24h",
    "event_dedup_retention": "7d",
    "job_retention": "7d",
    "reserved_record_max_age": "15m"
  },
  "projection": {
    "adapter_kind": "in_memory",
    "stale_threshold": "60s",
    "rebuild_batch_size": 100
  },
  "jobs": {
    "default_batch_size": 100,
    "max_parallelism": 1,
    "job_timeout": "300s",
    "retry_backoff": {
      "initial_delay": "1s",
      "max_delay": "30s",
      "multiplier": 2
    }
  },
  "external": {
    "method_library": {
      "adapter_kind": "fake"
    },
    "work": {
      "adapter_kind": "fake"
    },
    "identity": {
      "adapter_kind": "fake"
    },
    "governance": {
      "adapter_kind": "fake"
    },
    "artifact": {
      "adapter_kind": "fake"
    },
    "runtime": {
      "adapter_kind": "fake"
    },
    "conversation": {
      "adapter_kind": "fake"
    },
    "resolver_timeout": "2s",
    "resolver_retry": {
      "max_attempts": 0,
      "backoff": {
        "initial_delay": "1s",
        "max_delay": "1s",
        "multiplier": 1
      }
    }
  },
  "outbox": {
    "publisher": {
      "adapter_kind": "fake"
    },
    "publish_batch_size": 100,
    "publish_retry": {
      "max_attempts": 3,
      "backoff": {
        "initial_delay": "1s",
        "max_delay": "30s",
        "multiplier": 2
      }
    },
    "topic_map": {
      "runtime_shape_changed": "process.runtime_shape.changed.v1",
      "process_profile_changed": "process.profile.changed.v1",
      "process_instance_changed": "process.instance.changed.v1",
      "activity_progressed": "process.activity.progressed.v1",
      "waiting_gate_changed": "process.waiting_gate.changed.v1",
      "checkpoint_created": "process.checkpoint.created.v1",
      "recovery_attempt_changed": "process.recovery_attempt.changed.v1",
      "process_timing_changed": "process.timing.changed.v1",
      "process_trace_available": "process.trace.available.v1",
      "derived_view_changed": "process.derived_view.changed.v1"
    }
  },
  "handoff": {
    "trace_target": {
      "adapter_kind": "fake"
    },
    "archive_target": {
      "adapter_kind": "fake"
    },
    "delivery_timeout": "5s",
    "delivery_retry": {
      "max_attempts": 3,
      "backoff": {
        "initial_delay": "1s",
        "max_delay": "30s",
        "multiplier": 2
      }
    }
  },
  "features": {
    "derived_views_enabled": true,
    "search_enabled": false
  },
  "runtime": {
    "clock_kind": "fixed",
    "id_generator_kind": "sequence"
  }
}
```

## 5. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| `ProcessRuntimeConfig` 10 个 section / 38 个 P0 字段全部来自 `03_ddd_step_14` | 否 | 字段来源已存在 | 无 | 无回写 |
| 默认值由配置设计定义,不改变 Rust 字段 schema | 否 | 配置默认值 | 无 | 无回写 |
| JSONC 示例只作文档示例,实际运行配置必须为严格 JSON | 否 | 文档示例 | 无 | 无回写 |

## 6. 回填草稿

`04-配置设计.md` §7 应展开 `ProcessRuntimeConfig` 既有 10 个 section / 38 个 P0 配置项。配置项清单必须包含配置项、类型、默认值、是否必填、来源、作用域、生效方式、敏感级别、失败策略和关联模块。模块级 JSON demo 和完整 JSONC 示例不得新增 `03` 未定义的 section。

## 7. 待确认事项

- 无阻塞 Step 8 的待确认事项。
- 若后续需要 `reports`、`redaction`、`config_center` 等新 top-level section,必须先回写 `03-详细设计.md`。

## 8. 进入下一步条件

- P0 配置项无字段缺口。
- 每个配置项具备默认值、来源、生效方式和失败策略。
- 详细设计影响判定为无回写。
