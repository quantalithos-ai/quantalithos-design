# Step 7. 定义配置项清单

> 本文件是 `projects/L1-work/04-配置设计.md` 的 Step 7 中间产物。
> 本步把 P0 配置项整理成可实现、可校验、可测试的清单,并提供模块级 JSON demo 与完整 JSONC demo。
> 本步只展开 `03-详细设计.md` 已确认的 `WorkRuntimeConfig` 配置字段,不新增 runtime config section,不创建正式 `04-配置设计.md`。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 7
- 回填章节: `projects/L1-work/04-配置设计.md` §7 配置项清单

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_03_control_plane_overview.md` | 已确认配置控制面、装配入口和模块读取边界 | 固定配置项归属模块和读取位置 |
| `04_config_step_04_classification_boundaries.md` | 已确认配置分类、冷更新口径和禁止配置化项 | 固定生效方式、敏感级别和禁配项不进入清单 |
| `04_config_step_05_sources_priority_conflicts.md` | 已确认普通来源优先级和冲突处理 | 固定配置项来源与 fail-fast 规则 |
| `04_config_step_06_profiles_matrix.md` | 已确认 local-dev / ci-test / integration-like / operations-replay profile | 固定 P0 默认值和环境差异 |
| `03_ddd_step_14_config_external_binding.md` | 已确认 `WorkRuntimeConfig` 配置引用表 | 作为配置项清单的字段真相源 |
| `03_ddd_step_06_object_contracts.md` | 已确认 `WorkRuntimeConfig` root 和 section 归属 | 防止 Step 7 引入未回写的代码契约 |

已确认结论:

```text
Step 7 的配置项清单以 `WorkRuntimeConfig` 的既有 section 为上限。
项目本地 JSON root 直接使用 store / boundary / idempotency / projection / jobs / external / outbox / handoff / features,不重复 work 前缀。
系统级聚合配置若需要嵌入本项目,才使用 work.<module>.<setting> 映射。
```

## 3. 分批写入记录

本 Step 按 `设计文档讨论中间产物规范.md` 的长文档分批写入纪律执行:

| 批次 | 内容 | 状态 |
|---|---|---|
| 7.1 | 文件骨架、输入、SOP 回答、诊断和取舍 | [x] |
| 7.2 | P0 配置项总表 | [x] |
| 7.3 | 模块级 JSON demo 与说明表 | [x] |
| 7.4 | 完整 JSONC demo、03 影响判定、回填草稿和门禁 | [x] |

## 4. SOP 问题回答

### 4.1 每个 P0 配置项的名称、类型、默认值是什么?

本步定义 28 个 P0 配置项,全部来自 `WorkRuntimeConfig` 已确认 section:

```text
store: 3
boundary: 3
idempotency: 3
projection: 3
jobs: 4
external: 5
outbox: 3
handoff: 2
features: 2
```

默认值以 local-dev / ci-test 可验证路径为基准: in-memory store、fake adapters、strict boundary、deterministic-friendly job policy、derived views enabled、advanced search disabled。

### 4.2 哪些配置项必填?

P0 默认路径下,上述配置项都可以由 code defaults 构造,因此不存在“无默认即必填”的 P0 配置项。

存在条件必填:

| 条件 | 条件必填项 | 缺失策略 |
|---|---|---|
| adapter kind 配置为 non-fake / configured | endpoint ref / target ref / credential ref 等 adapter 子字段 | fail-fast,不得自动降级 fake |
| integration-like 使用 configured resolver / publisher / handoff | 对应 adapter ref 和 credential ref | fail-fast 或 explicit unresolved / degraded,不得伪成功 |
| operations-replay 指定历史输入或报告路径 | job local args 或 run-scoped path | 当前 job fail-fast,不影响其他 runtime |

### 4.3 每个配置项从哪里来、作用域是什么?

普通配置来源固定为:

```text
code defaults < JSON config file < environment variables
```

配置项作用域分为:

| 作用域 | 说明 |
|---|---|
| runtime | 启动时构造整个 `WorkRuntime` |
| entry | api / worker / jobs 入口读取后交给 runtime builder |
| adapter | 装配具体 repository / resolver / publisher / handoff |
| job-run | job run 开始读取,run 内保持稳定 |
| query | query handler / projection read policy 使用 |

### 4.4 每个配置项如何生效、是否敏感、失败策略是什么?

P0 核心配置全部是冷更新或 job-run-start 生效,不支持核心热更新。敏感级别在本步只做初步标注:

| 敏感级别 | 说明 |
|---|---|
| public | 可出现在普通配置和文档 demo 中 |
| internal | 可出现在普通配置中,但属于运行参数,需避免误导为业务规则 |
| ref-only sensitive | 只能保存 `SecretRef` / `CredentialRef` / endpoint ref,不得保存 raw secret |

详细 secret 存储、轮换和审计由 Step 8 单独收口。

### 4.5 每个配置项关联哪些模块?

配置读取模块遵守 Step 3 边界:

- `infra::config` 读取并校验 JSON / env。
- `infra::runtime_builder` 装配 adapter 和 application services。
- `api`、`worker`、`jobs` 只读取入口局部参数和 runtime handle。
- `application`、`domain`、`contracts` 不直接读取配置。

### 4.6 每个模块的 JSON demo 应该如何写?

模块级 demo 使用严格 JSON,不带注释。完整示例使用 JSONC,只用于文档说明;实际运行配置必须删除注释。

### 4.7 模块拆分是否按功能边界展开?

本步按 `store`、`boundary`、`idempotency`、`projection`、`jobs`、`external`、`outbox`、`handoff`、`features` 拆分,不使用 `runtime`、`common`、`misc`、`storage` 这类泛化模块承载不同功能。

### 4.8 项目本地配置是否避免重复项目名前缀?

项目本地配置避免重复项目名前缀:

```json
{
  "store": {},
  "boundary": {}
}
```

系统级聚合配置如需承载多个项目,才使用:

```text
work.store.adapter_kind -> store.adapter_kind
work.boundary.max_page_limit -> boundary.max_page_limit
```

### 4.9 完整配置 demo 是否需要文档注释?

需要。完整 demo 使用 JSONC,并明确注释只用于文档说明。模块级 demo 仍使用严格 JSON。

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| `04-配置设计.md` | 本 Step 撰写时尚未存在配置项清单;当前已回填正式 §7 | 本步已成为正式章节回填来源 |
| `03-详细设计.md` §13 | 只定义配置引用和默认口径,不写具体 JSON 示例 | 本步补模块级 JSON demo 和完整 JSONC demo |
| `03_ddd_step_14_config_external_binding.md` | 部分字段默认值写“配置设计给出” | 本步给 P0 文档默认值 |
| Step 3 / Step 4 | clock / id、reports、redaction 属于控制面,但不是 `WorkRuntimeConfig` 独立 section | 本步不新增字段,只在非配置项承接说明中记录 |
| 当前旧 `05/06` | 本 Step 撰写时尚未按新版配置项清单设置测试 / 验收矩阵;当前已生成正式 `05/06` | 历史风险已关闭;测试验收以正式 `05/06` 为准 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置项来源 | 分散在 `03` 配置引用表 | 汇总为 28 项 P0 配置清单 | 让实现、测试和验收有同一表面 |
| 默认值 | 多数只写“配置设计给出” | 给出 P0 local / CI 默认值 | 支撑默认可验证路径 |
| JSON 示例 | 本 Step 撰写前尚未存在 | 每个模块有严格 JSON demo,完整示例用 JSONC | 支撑实现和文档回填 |
| 条件必填 | 尚未显式说明 | non-fake / configured adapter 的 ref 字段条件必填 | 防止缺字段时静默 fake |
| 未闭合控制面 | clock / id、reports、redaction 容易被误写成新字段 | 标记为非新增字段承接,后续如需字段必须回写 03 | 避免 Step 7 静默扩展代码契约 |

## 7. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: Step 7 只列 `WorkRuntimeConfig` 已有字段 | 不新增代码契约,可 1:1 追溯 | clock / id、reports、redaction 只能用说明承接 | 采用 |
| 方案 B: 在 04 中新增 clock / id / reports / redaction section | 配置面更完整 | 会绕过 03 静默新增 runtime config 字段 | 不采用 |
| 方案 C: 不给具体默认值,全部写“实现决定” | 避免文档负责数值 | 测试和验收无法判定默认路径 | 不采用 |
| 方案 D: 一次写入 production-like 全字段 | 看似完整 | 会虚构 DB / MQ / endpoint / KMS 产品字段 | 不采用 |

推荐方案 A + P0 默认值。

原因:

- 当前 `03` 已经把 `WorkRuntimeConfig` 字段边界固定到 9 个 section。
- 配置设计可以给默认值、来源、作用域、生效和失败策略,但不能静默新增 Rust struct 字段。
- production-like 真实字段需要部署 / 运维和 durable adapter 专项,不阻塞 P0。

## 8. 结构化中间产物

### 8.1 P0 配置项清单

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `store.adapter_kind` | `WorkStoreAdapterKind` | `in_memory` | 否 | defaults / JSON / env | runtime / adapter | 启动读取 | public | 不支持值 fail-fast | `infra::config`,`infra::runtime_builder`,`infra::repositories` |
| `store.transaction_timeout` | `Duration` | `5s` | 否 | defaults / JSON / env | adapter | 启动读取 | internal | 非正数或格式错误 fail-fast | `infra::repositories` |
| `store.project_owner_uniqueness` | `ProjectOwnerUniquenessPolicy` | `not_unique` | 否 | defaults / JSON / env | adapter / policy | 启动读取 | public | 不支持值 fail-fast | `infra::repositories` |
| `boundary.max_command_body_bytes` | `ByteSize` | `1048576` | 否 | defaults / JSON / env | entry | 启动读取 | public | 小于最小值或格式错误 fail-fast | `api::command_handlers` |
| `boundary.max_page_limit` | `PageLimit` | `100` | 否 | defaults / JSON / env | query | 启动读取 | public | 小于 1 或超过实现上限 fail-fast | `api::query_handlers`,`infra` list adapters |
| `boundary.query_read_timeout` | `Duration` | `2s` | 否 | defaults / JSON / env | query | 启动读取 | internal | 非正数或格式错误 fail-fast | `api::query_handlers`,`infra::runtime_builder` |
| `idempotency.command_retention` | `Duration` | `24h` | 否 | defaults / JSON / env | adapter / policy | 启动读取 | internal | 小于客户端 retry window fail-fast | `infra::idempotency_store` |
| `idempotency.event_dedup_retention` | `Duration` | `7d` | 否 | defaults / JSON / env | worker / adapter | 启动读取 | internal | 小于 event redelivery window fail-fast | `infra::idempotency_store`,`worker::consumers` |
| `idempotency.reserved_record_max_age` | `Duration` | `15m` | 否 | defaults / JSON / env | adapter / job | 启动读取 | internal | 非正数或大于 command retention fail-fast | `infra::idempotency_store`,`jobs::reconciliation` |
| `projection.adapter_kind` | `WorkProjectionAdapterKind` | `in_memory` | 否 | defaults / JSON / env | adapter | 启动读取 | public | 不支持值 fail-fast | `infra::projection_stores` |
| `projection.stale_threshold` | `Duration` | `60s` | 否 | defaults / JSON / env | query / projection | 启动读取 | internal | 非正数 fail-fast | `infra::projection_stores`,`application` query policy |
| `projection.replace_scope` | `ProjectionReplaceScope` | `project_projection_set` | 否 | defaults / JSON / env | projection job | job-run-start | public | 不支持值 fail-fast | `infra::projection_stores`,`jobs::projection_rebuild` |
| `jobs.default_batch_size` | `BatchSize` | `100` | 否 | defaults / JSON / env | job-run | job-run-start | public | 小于 1 或超过实现上限 fail-fast | `jobs::*`,`worker::*` |
| `jobs.max_parallelism` | `NonZeroUsize` | `1` | 否 | defaults / JSON / env | worker / job-run | job-run-start | public | 小于 1 fail-fast | `worker::*`,`jobs::*` |
| `jobs.retry_limit` | `RetryLimit` | `3` | 否 | defaults / JSON / env | worker / job-run | job-run-start | public | 负数或超过实现上限 fail-fast | `jobs::*`,`worker::*` |
| `jobs.job_timeout` | `Duration` | `300s` | 否 | defaults / JSON / env | job-run | job-run-start | internal | 非正数 fail-fast | `jobs::*` |
| `external.identity` | `ExternalAdapterConfig` | `fake` | 否;configured 时条件必填 | defaults / JSON / env | adapter | 启动读取 | ref-only sensitive | 配置不完整 fail-fast;resolver failure explicit unresolved | `infra::source_resolvers` |
| `external.method_library` | `ExternalAdapterConfig` | `fake` | 否;configured 时条件必填 | defaults / JSON / env | adapter | 启动读取 | ref-only sensitive | 配置不完整 fail-fast;resolver failure explicit unresolved | `infra::source_resolvers` |
| `external.source_work` | `ExternalAdapterConfig` | `fake` | 否;configured 时条件必填 | defaults / JSON / env | adapter | 启动读取 | ref-only sensitive | 配置不完整 fail-fast;source unresolved 不保存正文 | `infra::source_resolvers` |
| `external.evidence` | `ExternalAdapterConfig` | `fake` | 否;configured 时条件必填 | defaults / JSON / env | adapter | 启动读取 | ref-only sensitive | 配置不完整 fail-fast;missing evidence reject / failed marker | `infra::source_resolvers` |
| `external.process_timebox` | `ExternalAdapterConfig` | `fake` | 否;configured 时条件必填 | defaults / JSON / env | adapter | 启动读取 | ref-only sensitive | 配置不完整 fail-fast;unresolved timebox reject / failed marker | `infra::source_resolvers` |
| `outbox.publish_batch_size` | `BatchSize` | `100` | 否 | defaults / JSON / env | worker / job-run | job-run-start | public | 小于 1 或超过实现上限 fail-fast | `worker::outbox_publisher`,`jobs` |
| `outbox.publish_retry` | `RetryPolicyConfig` | `{max_attempts:3,base_delay:1s,max_delay:30s}` | 否 | defaults / JSON / env | worker / job-run | job-run-start | internal | 非法重试策略 fail-fast | `worker::outbox_publisher` |
| `outbox.publisher` | `ExternalAdapterConfig` | `fake` | 否;configured 时条件必填 | defaults / JSON / env | adapter | 启动读取 | ref-only sensitive | 配置不完整 fail-fast;publish failure 只标记 failed | `infra::publishers`,`worker::outbox_publisher` |
| `handoff.trace_target` | `HandoffTargetConfig` | `fake` | 否;configured 时条件必填 | defaults / JSON / env | adapter / job-run | 启动读取 | ref-only sensitive | 配置不完整 fail-fast;handoff failure 写 marker | `infra::handoff_adapters`,`jobs::handoff_delivery` |
| `handoff.archive_target` | `HandoffTargetConfig` | `fake` | 否;configured 时条件必填 | defaults / JSON / env | adapter / job-run | 启动读取 | ref-only sensitive | 配置不完整 fail-fast;archive failure 写 marker | `infra::handoff_adapters`,`jobs::handoff_delivery` |
| `features.derived_views_enabled` | `bool` | `true` | 否 | defaults / JSON / env | runtime / query | 启动读取 | public | 非 bool fail-fast;不得关闭 truth path | `infra::runtime_builder`,`api`,`jobs` |
| `features.advanced_search_enabled` | `bool` | `false` | 否 | defaults / JSON / env | runtime / query | 启动读取 | public | 非 bool fail-fast;缺 search contract 时启用 fail-fast | `infra::runtime_builder`,`api` |

### 8.2 `store` 配置 demo

```json
{
  "store": {
    "adapter_kind": "in_memory",
    "transaction_timeout": "5s",
    "project_owner_uniqueness": "not_unique"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `store.adapter_kind` | `WorkStoreAdapterKind` | `"in_memory"` | 选择 Work truth / outbox / idempotency 相关 store adapter | P0 只要求 `in_memory`;configured / durable 只作后续承接 | 不支持值 fail-fast |
| `store.transaction_timeout` | `Duration` | `"5s"` | 控制 repository transaction / UoW 操作超时 | 必须为正 duration | 格式错误或非正 fail-fast |
| `store.project_owner_uniqueness` | `ProjectOwnerUniquenessPolicy` | `"not_unique"` | 控制 project owner ref 是否强制唯一 | P0 默认不强制唯一;不得改变 Project truth 字段 | 不支持值 fail-fast |

### 8.3 `boundary` 配置 demo

```json
{
  "boundary": {
    "max_command_body_bytes": 1048576,
    "max_page_limit": 100,
    "query_read_timeout": "2s"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `boundary.max_command_body_bytes` | `ByteSize` | `1048576` | 限制 command request body 大小 | 必须大于 0;不得被设为绕过 command validation 的特殊值 | 非法值 fail-fast |
| `boundary.max_page_limit` | `PageLimit` | `100` | 限制 query page size 和 infra list adapter 返回上限 | 必须大于 0;不得超过实现上限 | 非法值 fail-fast |
| `boundary.query_read_timeout` | `Duration` | `"2s"` | 控制 query read path 超时 | 必须为正 duration;query 仍不得写 truth | 格式错误或非正 fail-fast |

### 8.4 `idempotency` 配置 demo

```json
{
  "idempotency": {
    "command_retention": "24h",
    "event_dedup_retention": "7d",
    "reserved_record_max_age": "15m"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `idempotency.command_retention` | `Duration` | `"24h"` | 保留 command idempotency record | 必须覆盖客户端 retry window | 太短或格式错误 fail-fast |
| `idempotency.event_dedup_retention` | `Duration` | `"7d"` | 保留 inbound event dedup record | 必须覆盖 event redelivery window | 太短或格式错误 fail-fast |
| `idempotency.reserved_record_max_age` | `Duration` | `"15m"` | 判断 reserved / unknown 记录是否需要 reconciliation | 必须大于 0 且不大于 `command_retention` | 非法组合 fail-fast |

### 8.5 `projection` 配置 demo

```json
{
  "projection": {
    "adapter_kind": "in_memory",
    "stale_threshold": "60s",
    "replace_scope": "project_projection_set"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `projection.adapter_kind` | `WorkProjectionAdapterKind` | `"in_memory"` | 选择 read model / derived view store adapter | P0 只要求 `in_memory`;不得让 query rebuild truth | 不支持值 fail-fast |
| `projection.stale_threshold` | `Duration` | `"60s"` | 判断 projection stale marker | 必须为正 duration | 非法值 fail-fast |
| `projection.replace_scope` | `ProjectionReplaceScope` | `"project_projection_set"` | 控制 projection rebuild replace 范围 | P0 默认只替换 project projection set | 不支持值 fail-fast |

### 8.6 `jobs` 配置 demo

```json
{
  "jobs": {
    "default_batch_size": 100,
    "max_parallelism": 1,
    "retry_limit": 3,
    "job_timeout": "300s"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `jobs.default_batch_size` | `BatchSize` | `100` | 控制 operations job 默认批量大小 | 必须大于 0 且不超过实现上限 | 非法值 fail-fast |
| `jobs.max_parallelism` | `NonZeroUsize` | `1` | 控制 worker / jobs 并行度 | P0 默认 1;必须大于 0 | 非法值 fail-fast |
| `jobs.retry_limit` | `RetryLimit` | `3` | 控制 job / worker retry 次数 | 必须为非负整数且不超过实现上限 | 非法值 fail-fast |
| `jobs.job_timeout` | `Duration` | `"300s"` | 控制单次 job run 超时 | 必须为正 duration | 非法值 fail-fast |

### 8.7 `external` 配置 demo

```json
{
  "external": {
    "identity": {
      "adapter_kind": "fake"
    },
    "method_library": {
      "adapter_kind": "fake"
    },
    "source_work": {
      "adapter_kind": "fake"
    },
    "evidence": {
      "adapter_kind": "fake"
    },
    "process_timebox": {
      "adapter_kind": "fake"
    }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `external.identity` | `ExternalAdapterConfig` | `{"adapter_kind":"fake"}` | 装配 identity resolver / event fixture 接缝 | configured 时只能配置 ref,不得写 raw identity body 或 raw credential | 配置不完整 fail-fast;resolver failure explicit unresolved |
| `external.method_library` | `ExternalAdapterConfig` | `{"adapter_kind":"fake"}` | 装配 method definition resolver 接缝 | configured 时只能配置 ref,不得保存 method body | 配置不完整 fail-fast;resolver failure explicit unresolved |
| `external.source_work` | `ExternalAdapterConfig` | `{"adapter_kind":"fake"}` | 装配 conversation / runtime / artifact / governance source resolver | configured 时只能配置 source ref / endpoint ref,不得保存 source body | 配置不完整 fail-fast;unresolved 不伪成功 |
| `external.evidence` | `ExternalAdapterConfig` | `{"adapter_kind":"fake"}` | 装配 evidence resolver 接缝 | configured 时只能配置 evidence source ref / credential ref | 配置不完整 fail-fast;missing evidence reject / failed marker |
| `external.process_timebox` | `ExternalAdapterConfig` | `{"adapter_kind":"fake"}` | 装配 process timebox resolver 接缝 | configured 时只能配置 ref,不得把 process truth 写入 Work | 配置不完整 fail-fast;unresolved timebox reject / failed marker |

### 8.8 `outbox` 配置 demo

```json
{
  "outbox": {
    "publish_batch_size": 100,
    "publish_retry": {
      "max_attempts": 3,
      "base_delay": "1s",
      "max_delay": "30s"
    },
    "publisher": {
      "adapter_kind": "fake"
    }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `outbox.publish_batch_size` | `BatchSize` | `100` | 控制 outbox publisher 批量大小 | 必须大于 0 且不超过实现上限 | 非法值 fail-fast |
| `outbox.publish_retry` | `RetryPolicyConfig` | `{"max_attempts":3,"base_delay":"1s","max_delay":"30s"}` | 控制 outbox publish retry | `max_attempts` 非负;delay 必须为正且 base <= max | 非法组合 fail-fast |
| `outbox.publisher` | `ExternalAdapterConfig` | `{"adapter_kind":"fake"}` | 装配 bus publisher adapter | configured 时只能配置 ref / credential ref,不得新增 Cargo dependency | 配置不完整 fail-fast;publish failure 只写 failed marker |

### 8.9 `handoff` 配置 demo

```json
{
  "handoff": {
    "trace_target": {
      "adapter_kind": "fake"
    },
    "archive_target": {
      "adapter_kind": "fake"
    }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `handoff.trace_target` | `HandoffTargetConfig` | `{"adapter_kind":"fake"}` | 装配 trace handoff target | configured 时只能配置 target ref / credential ref,不得保存 observability 正文 | 配置不完整 fail-fast;handoff failure 写 marker |
| `handoff.archive_target` | `HandoffTargetConfig` | `{"adapter_kind":"fake"}` | 装配 archive handoff target | configured 时只能配置 target ref / credential ref,不得保存 archive 正文 | 配置不完整 fail-fast;archive failure 写 marker |

### 8.10 `features` 配置 demo

```json
{
  "features": {
    "derived_views_enabled": true,
    "advanced_search_enabled": false
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `features.derived_views_enabled` | `bool` | `true` | 控制 derived views / projection route wiring | 只能影响派生 / 外围能力,不能关闭 truth write path | 非 bool fail-fast |
| `features.advanced_search_enabled` | `bool` | `false` | 控制高级搜索外围能力 | 缺少 P0 search contract 时不得启用 | 非 bool或缺 contract 时启用 fail-fast |

### 8.11 非配置项承接说明

| 控制面 | 当前处理 | 后续条件 |
|---|---|---|
| clock / id generator | 由 runtime builder 装配 fake / deterministic / system adapters,当前不新增 `WorkRuntimeConfig` 字段 | 若需要显式配置 `clock` / `id_generator`,必须先回写 `03-详细设计.md` |
| reports output | 当前通过 job run args / run-scoped output 进入,不作为全局 runtime config 字段 | 若需要 `reports.root` 等全局配置,必须先回写 `03-详细设计.md` |
| security redaction | 当前作为禁止配置化边界和 handoff / report 校验承接,不得配置关闭 | 若需要 redaction profile 字段,必须先回写 `03-详细设计.md` 并证明不绕过红线 |
| config center / admin override | P1/P2 演进能力,不进入 P0 清单 | 后续需单独配置变更 / 审计 / 回滚设计 |

### 8.12 完整配置 demo

本示例为 JSONC 文档示例。注释只用于说明,实际运行 JSON 配置必须删除注释。

```jsonc
{
  // Work truth / projection / idempotency stores.
  "store": {
    "adapter_kind": "in_memory",
    "transaction_timeout": "5s",
    "project_owner_uniqueness": "not_unique"
  },

  // API and query boundary guards.
  "boundary": {
    "max_command_body_bytes": 1048576,
    "max_page_limit": 100,
    "query_read_timeout": "2s"
  },

  // Command idempotency and inbound event dedup windows.
  "idempotency": {
    "command_retention": "24h",
    "event_dedup_retention": "7d",
    "reserved_record_max_age": "15m"
  },

  // Derived view / projection configuration.
  "projection": {
    "adapter_kind": "in_memory",
    "stale_threshold": "60s",
    "replace_scope": "project_projection_set"
  },

  // Operations jobs and worker loop defaults.
  "jobs": {
    "default_batch_size": 100,
    "max_parallelism": 1,
    "retry_limit": 3,
    "job_timeout": "300s"
  },

  // Runtime-only external seams. Fake adapters are the P0 default.
  "external": {
    "identity": {
      "adapter_kind": "fake"
    },
    "method_library": {
      "adapter_kind": "fake"
    },
    "source_work": {
      "adapter_kind": "fake"
    },
    "evidence": {
      "adapter_kind": "fake"
    },
    "process_timebox": {
      "adapter_kind": "fake"
    }
  },

  // Outbox publishing does not roll back committed Work truth.
  "outbox": {
    "publish_batch_size": 100,
    "publish_retry": {
      "max_attempts": 3,
      "base_delay": "1s",
      "max_delay": "30s"
    },
    "publisher": {
      "adapter_kind": "fake"
    }
  },

  // Trace / archive handoff targets. Raw external body is never configured here.
  "handoff": {
    "trace_target": {
      "adapter_kind": "fake"
    },
    "archive_target": {
      "adapter_kind": "fake"
    }
  },

  // Feature switches may only affect derived / peripheral behavior.
  "features": {
    "derived_views_enabled": true,
    "advanced_search_enabled": false
  }
}
```

### 8.13 系统级聚合配置映射

项目本地配置不重复项目名前缀。若系统级配置文件同时承载多个项目,建议映射如下:

| 系统级 key | L1-work 本地 key |
|---|---|
| `work.store.adapter_kind` | `store.adapter_kind` |
| `work.boundary.max_page_limit` | `boundary.max_page_limit` |
| `work.idempotency.command_retention` | `idempotency.command_retention` |
| `work.projection.replace_scope` | `projection.replace_scope` |
| `work.jobs.default_batch_size` | `jobs.default_batch_size` |
| `work.external.identity` | `external.identity` |
| `work.outbox.publisher` | `outbox.publisher` |
| `work.handoff.trace_target` | `handoff.trace_target` |
| `work.features.advanced_search_enabled` | `features.advanced_search_enabled` |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 7 配置项清单只展开 `WorkRuntimeConfig` 已有 9 个 section 和 28 个字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| P0 默认值采用 in-memory / fake / strict boundary / derived views enabled / advanced search disabled | 否 | 配置默认值,不改变 Rust schema | 无 | 无回写 |
| configured adapter 的 endpoint ref / credential ref 为条件必填,但不在本步写字段全集 | 否 | 条件校验规则,字段全集留给 adapter 专项 | 无 | 无回写 |
| clock / id、reports、redaction 当前不新增配置字段 | 否 | 保持 `03` 配置 root 不变 | 无 | 无回写 |
| 系统级聚合配置使用 `work.<module>.<setting>` 映射,项目本地配置不重复前缀 | 否 | 文档映射规则 | 无 | 无回写 |

说明:

```text
本步没有新增 `WorkRuntimeConfig` 字段、adapter constructor 参数、ConfigError 枚举、runtime profile enum 或函数流。
如果 Step 8 / Step 9 需要把 secret provider、reports root、redaction profile、clock profile、id generator profile 固化为配置字段,必须先回写 `03-详细设计.md`。
```

## 10. 回填草稿

正式 `04-配置设计.md` §7 建议采用以下结构:

```text
7. 配置项清单
  7.1 P0 配置项总表
  7.2 store 配置
  7.3 boundary 配置
  7.4 idempotency 配置
  7.5 projection 配置
  7.6 jobs 配置
  7.7 external 配置
  7.8 outbox 配置
  7.9 handoff 配置
  7.10 features 配置
  7.11 非配置项承接说明
  7.12 完整 JSONC 示例
  7.13 系统级聚合配置映射
  7.14 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §7.1 | `design-calibration/04_config_step_07_config_items.md` §8.1 |
| §7.2 ~ §7.10 | `design-calibration/04_config_step_07_config_items.md` §8.2 ~ §8.10 |
| §7.11 | `design-calibration/04_config_step_07_config_items.md` §8.11 |
| §7.12 | `design-calibration/04_config_step_07_config_items.md` §8.12 |
| §7.13 | `design-calibration/04_config_step_07_config_items.md` §8.13 |
| §7.14 | `design-calibration/04_config_step_07_config_items.md` §9 |

## 11. 待确认事项

无阻塞进入 Step 8 的待确认事项。

后续 Step 必须继续收口:

- Step 8 需要把 `ExternalAdapterConfig` / `HandoffTargetConfig` 中的 secret / credential / endpoint ref 边界单独展开,并明确 raw secret 禁止策略。
- Step 9 需要定义 loader / validator 对本步 28 个配置项的校验顺序、错误分类和 env 覆盖键。
- Step 11 需要把本步 fail-fast / unresolved / degraded / failed marker 规则映射为失效模式表。
- Step 12 需要把配置项清单承接到 `05-测试方案.md` 和 `06-验收标准.md`。

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 配置项清单完整 | 通过 | §8.1 覆盖 `WorkRuntimeConfig` 28 个字段 |
| 每个配置项都有类型、默认值、必填、来源、作用域、生效方式、敏感级别、失败策略和关联模块 | 通过 | §8.1 |
| 每个模块都有严格 JSON demo 和说明表 | 通过 | §8.2 ~ §8.10 |
| 完整 JSONC demo 已标注运行配置必须删除注释 | 通过 | §8.12 |
| 对 03 影响已有判定 | 通过 | §9 当前无回写 |
| 可以进入 Step 8 | 通过 | 下一步定义敏感配置与密钥管理 |
