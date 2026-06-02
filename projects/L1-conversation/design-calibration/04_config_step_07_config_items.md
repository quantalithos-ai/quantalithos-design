# Step 7. 定义配置项清单

> 本文件是 `projects/L1-conversation/04-配置设计.md` 的 Step 7 中间产物。
> 本步把 P0 配置项整理成可实现、可校验、可测试的配置项清单、模块级 JSON demo 和完整配置 demo。
> 本步不写部署命令,不定义测试用例全集,不改变 `03-详细设计.md` 的代码契约。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 7
- 回填章节: `projects/L1-conversation/04-配置设计.md` §7 配置项清单

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_03_control_plane_overview.md` | 配置控制面总表和模块读取边界 | 决定配置模块拆分 |
| `04_config_step_04_classification_boundaries.md` | 配置分类、热 / 冷更新口径和禁止配置化项 | 决定配置项类别、生效方式和禁配规则 |
| `04_config_step_05_sources_priority_conflicts.md` | 来源优先级、冲突处理和 secret ref 规则 | 决定来源、默认值和失败策略 |
| `04_config_step_06_profiles_matrix.md` | local / CI / integration-like / operations-replay profile 矩阵 | 决定配置项默认值和 profile 差异 |
| `03-详细设计.md` §13 | 配置引用表和外部依赖绑定 | 作为配置项候选来源 |

已确认结论:

```text
本项目本地配置不额外包一层 `conversation` 或 `l1_conversation`。
配置模块按功能边界拆分为 runtime、storage、api、worker、outbox、resolver、handoff、jobs、retention、projection、reports、security。
模块级 demo 使用严格 JSON。
完整带注释 demo 使用 JSONC,并明确实际运行配置必须删除注释。
```

## 3. SOP 问题回答

### 3.1 每个 P0 配置项的名称、类型、默认值是什么?

P0 配置项以 `03-详细设计.md` §13.2 的配置引用表为主来源,并按 Step 3 控制面拆分为 12 个顶层模块。默认值优先支持 local-dev 和 ci-test 的默认可验证路径。

### 3.2 哪些配置项必填?

P0 default path 中大多数配置项有安全默认值。必填主要出现在以下场景:

- 指定 JSON config file 后文件必须可读、可解析、无重复 key。
- 选择 configured resolver、publisher、handoff 或 durable-like store 时,对应 endpoint ref / credential ref / root 必须齐备。
- operations-replay 必须提供 job run id、scope 或 replay input root。
- reports output 如果显式覆盖路径,路径必须可写。

### 3.3 每个配置项从哪里来、作用域是什么?

普通配置来源遵守 `code defaults < JSON config file < environment variables`。entry local args 只作为 config source selector、runtime profile selector 或 job 局部输入。作用域按模块分为 process、entry、adapter、job run、report run 和 security boundary。

### 3.4 每个配置项如何生效、是否敏感、失败策略是什么?

P0 核心配置默认启动读取或 job run 开始读取,不支持核心配置热更新。敏感级别分为 none、sensitive-ref 和 forbidden。raw secret、raw token、forbidden body 不允许作为配置项。

### 3.5 每个配置项关联哪些模块?

配置项必须能回到 runtime、storage、api、worker、outbox、resolver、handoff、jobs、retention、projection、reports、security 之一,不得出现 `misc`、`common`、`settings` 这种泛化模块。

### 3.6 每个模块的 JSON demo 应该如何写?

模块级 demo 必须只展示该模块自己的配置,并使用严格 JSON。不同功能不得揉进同一模块。例如 `reports.output` 不写进 `storage`,`outbox.publisher` 不写进 `worker`,`security.redaction_policy` 不写进 `runtime`。

### 3.7 模块拆分是否避免把不同功能揉进泛化模块?

是。当前拆分按配置控制面执行:

| 模块 | 边界 |
|---|---|
| `runtime` | profile、config version、runtime assembly |
| `storage` | truth / projection / snapshot / outbox / idempotency store |
| `api` | command / query intake |
| `worker` | inbound event source 和 outbox relay 入口 |
| `outbox` | publisher adapter 和发布策略 |
| `resolver` | actor / external fact resolver |
| `handoff` | trace / archive handoff adapter |
| `jobs` | batch、retry、timeout、job run |
| `retention` | idempotency、trace、cursor retention |
| `projection` | read model、search、cursor、rebuild |
| `reports` | artifacts 和 reports output |
| `security` | redaction、forbidden body、raw secret 拒绝 |

### 3.8 项目本地配置是否避免重复项目名前缀?

是。`quantalithos-conversation` 的本地配置文件不包一层 `conversation`。如果未来需要平台级聚合配置,可以由外层系统映射为 `conversation.<module>.<setting>`,但本项目配置文件仍以模块名作为顶层 key。

### 3.9 完整配置 demo 是否需要文档注释?

需要。完整配置 demo 用 `jsonc` 展示注释,并在标题处说明实际运行配置必须删除注释。模块级 demo 仍使用严格 `json`。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `03-详细设计.md` §13.2 | 已列配置引用表,但没有 JSON demo、默认值说明和逐项失败策略 | 实现者需要明确配置 schema 和 validator 输入 |
| Step 3 / Step 4 / Step 5 / Step 6 | 已形成控制面、分类、来源、profile,但还未变成配置项 | 测试和验收无法直接引用 |
| `04-配置设计.md` | 尚未创建 | 正式配置说明需要本步作为 §7 主来源 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置项 | 只有详细设计引用表 | 形成可实现、可校验、可测试的配置项清单 | 支撑 loader / validator / runtime builder 实现 |
| JSON demo | 尚未存在 | 每个模块都有严格 JSON demo | 防止不同 agent 发明不同格式 |
| 完整 demo | 尚未存在 | 使用 JSONC 文档示例说明完整配置 | 方便阅读,同时不误导运行时支持注释 |
| 模块拆分 | 容易按 `storage` / `common` 泛化 | 按 12 个控制面拆分 | 避免不同功能揉在同一个 module |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 单个 `runtime` module 放全部配置 | 文件短 | 不同功能揉在一起,测试和验收难定位 | 不采用 |
| 方案 B: 按 12 个配置控制面拆分模块 | 结构清楚,能直接映射到模块和测试 | 文件较长 | 采用 |
| 方案 C: 为本地配置增加 `conversation` 顶层前缀 | 便于平台聚合 | 本仓本地配置重复项目名,不符合已收稳规则 | 不采用 |
| 方案 D: 完整 demo 使用严格 JSON 无注释 | 可直接运行 | 不便解释配置项作用 | 不采用,完整 demo 使用 JSONC 文档示例 |

推荐方案 B。

原因:

- L1-conversation 同时包含 api、worker、jobs、outbox、projection、handoff 和 reports,必须按功能边界拆分。
- Step 7 的主要目的不是让文件最短,而是让实现、测试、验收能从配置项追溯到模块和失败策略。
- 本地配置不重复项目名前缀,可以避免 `conversation.conversation.*` 这类冗余路径。

## 7. 结构化中间产物

### 7.1 配置项清单

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `runtime.profile` | enum: `local-dev` / `ci-test` / `integration-like` / `operations-replay` | `local-dev` | 是 | defaults / file / env / entry selector | process | 启动读取 | none | unsupported profile fail-fast | `infra::runtime_builder` |
| `runtime.config_version` | string | `v1` | 是 | defaults / file / env | process | 启动读取 | none | unsupported version fail-fast | `infra::config` |
| `storage.truth_store.kind` | enum: `in_memory` / `durable_ref` | `in_memory` | 是 | defaults / file / env | adapter | 启动读取 | none | unsupported kind fail-fast | `infra::repositories` |
| `storage.projection_store.kind` | enum: `in_memory` / `durable_ref` | `in_memory` | 是 | defaults / file / env | adapter | 启动读取 | none | unsupported kind fail-fast | `infra::projection_stores` |
| `storage.snapshot_store.kind` | enum: `in_memory` / `durable_ref` | `in_memory` | 是 | defaults / file / env | adapter | 启动读取 | none | unsupported kind fail-fast | `infra::snapshot_stores` |
| `storage.outbox_store.kind` | enum: `in_memory` / `durable_ref` | `in_memory` | 是 | defaults / file / env | adapter | 启动读取 | none | unsupported kind fail-fast | `infra::repositories` |
| `storage.idempotency_store.kind` | enum: `in_memory` / `durable_ref` | `in_memory` | 是 | defaults / file / env | adapter | 启动读取 | none | unsupported kind fail-fast | `application::idempotency` |
| `api.command_intake.enabled` | bool | `true` | 是 | defaults / file / env | entry | 启动读取 | none | invalid bool fail-fast | `api` |
| `api.query_intake.enabled` | bool | `true` | 是 | defaults / file / env | entry | 启动读取 | none | invalid bool fail-fast | `api` |
| `api.metadata_policy` | enum: `strict` | `strict` | 是 | defaults / file / env | entry | 启动读取 | none | non-strict value rejected | `api` |
| `worker.inbound_event_sources.enabled` | bool | `false` | 是 | defaults / file / env | entry | 启动读取 | none | invalid bool fail-fast | `worker::event_consumers` |
| `worker.inbound_event_sources.profile` | enum: `fake` / `configured` | `fake` | 是 | defaults / file / env | entry | 启动读取 | none | configured 缺 ref fail-fast | `worker::event_consumers` |
| `worker.outbox_relay.enabled` | bool | `true` | 是 | defaults / file / env | entry | 启动读取 | none | invalid bool fail-fast | `worker::outbox_relay` |
| `outbox.publisher.kind` | enum: `fake` / `configured` | `fake` | 是 | defaults / file / env | adapter | 启动读取 | none | unsupported kind fail-fast | `infra::outbox_publisher` |
| `outbox.publisher.credential_ref` | `CredentialRef` | `null` | 条件必填 | file / env | adapter | 启动读取 | sensitive-ref | configured publisher 缺失 fail-fast | `infra::outbox_publisher` |
| `outbox.publisher.timeout_ms` | positive integer | `30000` | 是 | defaults / file / env | adapter | 启动读取 | none | out of range fail-fast | `infra::outbox_publisher` |
| `outbox.publisher.retry_profile` | enum: `transient` | `transient` | 是 | defaults / file / env | adapter | 启动读取 | none | unsupported profile fail-fast | `infra::outbox_publisher` |
| `resolver.actor.kind` | enum: `fake` / `configured` | `fake` | 是 | defaults / file / env | adapter | 启动读取 | none | unsupported kind fail-fast | `infra::source_resolvers` |
| `resolver.actor.credential_ref` | `CredentialRef` | `null` | 条件必填 | file / env | adapter | 启动读取 | sensitive-ref | configured resolver 缺失 fail-fast | `infra::source_resolvers` |
| `resolver.external_fact_sources.kind` | enum: `fake` / `configured` | `fake` | 是 | defaults / file / env | adapter | 启动读取 | none | unsupported kind fail-fast | `infra::source_resolvers` |
| `resolver.external_fact_sources.credential_ref` | `CredentialRef` | `null` | 条件必填 | file / env | adapter | 启动读取 | sensitive-ref | configured resolver 缺失 fail-fast | `infra::source_resolvers` |
| `handoff.trace.kind` | enum: `fake` / `configured` | `fake` | 是 | defaults / file / env | adapter | 启动读取 | none | unsupported kind fail-fast | `infra::handoff_adapters` |
| `handoff.trace.credential_ref` | `CredentialRef` | `null` | 条件必填 | file / env | adapter | 启动读取 | sensitive-ref | configured handoff 缺失 fail-fast | `infra::handoff_adapters` |
| `handoff.archive.kind` | enum: `fake` / `configured` | `fake` | 是 | defaults / file / env | adapter | 启动读取 | none | unsupported kind fail-fast | `infra::handoff_adapters` |
| `handoff.archive.credential_ref` | `CredentialRef` | `null` | 条件必填 | file / env | adapter | 启动读取 | sensitive-ref | configured handoff 缺失 fail-fast | `infra::handoff_adapters` |
| `handoff.redaction_required` | bool | `true` | 是 | defaults / file / env | adapter | 启动读取 | none | false rejected | `infra::handoff_adapters` |
| `jobs.batch_limits.default_batch_size` | positive integer | `50` | 是 | defaults / file / env / job args | job run | job 开始读取 | none | out of range fail-fast | `jobs::*` |
| `jobs.batch_limits.max_batch_size` | positive integer | `500` | 是 | defaults / file / env | job run | job 开始读取 | none | out of range fail-fast | `jobs::*` |
| `jobs.retry_policy.max_attempts` | positive integer | `3` | 是 | defaults / file / env | job run | job 开始读取 | none | out of range fail-fast | `jobs::*` |
| `jobs.retry_policy.backoff_ms` | positive integer | `1000` | 是 | defaults / file / env | job run | job 开始读取 | none | out of range fail-fast | `jobs::*` |
| `jobs.timeout_policy.default_timeout_ms` | positive integer | `30000` | 是 | defaults / file / env | job run | job 开始读取 | none | out of range fail-fast | `jobs::*` |
| `retention.idempotency_window_hours` | positive integer | `72` | 是 | defaults / file / env | process | 启动读取 | none | out of range fail-fast | `application::idempotency` |
| `retention.trace_retention_days` | positive integer | `30` | 是 | defaults / file / env | process | 启动读取 | none | out of range fail-fast | `domain::trace` |
| `retention.cursor_ttl_hours` | positive integer | `24` | 是 | defaults / file / env | process | 启动读取 | none | out of range fail-fast | `jobs::cursor_maintenance` |
| `projection.read_model_enabled` | bool | `true` | 是 | defaults / file / env | process | 启动读取 | none | false requires query fallback marker | `infra::projection_stores` |
| `projection.search_enabled` | bool | `false` | 是 | defaults / file / env | process | 启动读取 | none | invalid bool fail-fast | `jobs::projection_rebuild` |
| `projection.rebuild_batch_size` | positive integer | `50` | 是 | defaults / file / env | process | 启动读取 | none | out of range fail-fast | `jobs::projection_rebuild` |
| `reports.artifacts_root` | path | `artifacts/test` | 是 | defaults / file / env / job args | report run | run 开始读取 | none | unwritable path fail-fast | `scripts/gates` |
| `reports.output_root` | path | `reports` | 是 | defaults / file / env / job args | report run | run 开始读取 | none | unwritable path fail-fast | `scripts/reports` |
| `reports.run_id_source` | enum: `job` | `job` | 是 | defaults / file / env / job args | report run | run 开始读取 | none | missing run id fail-fast | `scripts/reports` |
| `security.redaction_policy` | enum: `strict` | `strict` | 是 | defaults / file / env | security boundary | 启动读取 | none | non-strict value rejected | `infra::handoff_adapters` |

### 7.2 模块级 JSON demo 与逐项说明

#### runtime 配置 demo

```json
{
  "runtime": {
    "profile": "local-dev",
    "config_version": "v1"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `runtime.profile` | enum | `local-dev` | 选择配置矩阵 profile | 仅允许已定义 profile | unsupported profile fail-fast |
| `runtime.config_version` | string | `v1` | 标识配置 schema 版本 | P0 仅支持 `v1` | unsupported version fail-fast |

#### storage 配置 demo

```json
{
  "storage": {
    "truth_store": { "kind": "in_memory" },
    "projection_store": { "kind": "in_memory" },
    "snapshot_store": { "kind": "in_memory" },
    "outbox_store": { "kind": "in_memory" },
    "idempotency_store": { "kind": "in_memory" }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `storage.truth_store.kind` | enum | `in_memory` | 装配 truth repository store | P0 默认 in-memory;durable ref 后续接入 | unsupported kind fail-fast |
| `storage.projection_store.kind` | enum | `in_memory` | 装配 read model / projection store | 不得成为第二 truth | unsupported kind fail-fast |
| `storage.snapshot_store.kind` | enum | `in_memory` | 装配 external snapshot store | 不保存来源正文 | unsupported kind fail-fast |
| `storage.outbox_store.kind` | enum | `in_memory` | 装配 conversation outbox store | publish 失败不回滚 truth | unsupported kind fail-fast |
| `storage.idempotency_store.kind` | enum | `in_memory` | 装配幂等记录 store | duplicate / conflict 必须区分 | unsupported kind fail-fast |

#### api 配置 demo

```json
{
  "api": {
    "command_intake": { "enabled": true },
    "query_intake": { "enabled": true },
    "metadata_policy": "strict"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `api.command_intake.enabled` | bool | `true` | 启用 command 入口 | 入口不能绕过 runtime builder | invalid bool fail-fast |
| `api.query_intake.enabled` | bool | `true` | 启用 query 入口 | query 必须经过 visibility guard | invalid bool fail-fast |
| `api.metadata_policy` | enum | `strict` | 要求 metadata / actor / trace 完整 | P0 不允许 non-strict | non-strict rejected |

#### worker 配置 demo

```json
{
  "worker": {
    "inbound_event_sources": { "enabled": false, "profile": "fake" },
    "outbox_relay": { "enabled": true }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `worker.inbound_event_sources.enabled` | bool | `false` | 控制来源事件 consumer 是否启用 | P0 默认 fake / disabled until configured | invalid bool fail-fast |
| `worker.inbound_event_sources.profile` | enum | `fake` | 选择事件源 profile | configured profile 需要 ref 齐备 | 缺 ref fail-fast |
| `worker.outbox_relay.enabled` | bool | `true` | 启用 outbox relay 入口 | 只推进 outbox 状态,不回滚 truth | invalid bool fail-fast |

#### outbox 配置 demo

```json
{
  "outbox": {
    "publisher": {
      "kind": "fake",
      "credential_ref": null,
      "timeout_ms": 30000,
      "retry_profile": "transient"
    }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `outbox.publisher.kind` | enum | `fake` | 选择 outbox publisher adapter | `configured` 需要 credential ref | unsupported kind fail-fast |
| `outbox.publisher.credential_ref` | `CredentialRef` / null | `null` | 指向 publisher 凭据 | raw secret 禁止 | configured 缺失 fail-fast |
| `outbox.publisher.timeout_ms` | positive integer | `30000` | publisher 调用超时 | 必须大于 0 | out of range fail-fast |
| `outbox.publisher.retry_profile` | enum | `transient` | 选择重试策略 | 不得把 failed 配成 success | unsupported profile fail-fast |

#### resolver 配置 demo

```json
{
  "resolver": {
    "actor": { "kind": "fake", "credential_ref": null },
    "external_fact_sources": { "kind": "fake", "credential_ref": null }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `resolver.actor.kind` | enum | `fake` | 选择 actor display resolver | Conversation 不拥有 identity truth | unsupported kind fail-fast |
| `resolver.actor.credential_ref` | `CredentialRef` / null | `null` | 指向 actor resolver 凭据 | raw secret 禁止 | configured 缺失 fail-fast |
| `resolver.external_fact_sources.kind` | enum | `fake` | 选择 external fact resolver | 只能返回引用 / 安全快照 | unsupported kind fail-fast |
| `resolver.external_fact_sources.credential_ref` | `CredentialRef` / null | `null` | 指向来源事实 resolver 凭据 | raw secret 禁止 | configured 缺失 fail-fast |

#### handoff 配置 demo

```json
{
  "handoff": {
    "trace": { "kind": "fake", "credential_ref": null },
    "archive": { "kind": "fake", "credential_ref": null },
    "redaction_required": true
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `handoff.trace.kind` | enum | `fake` | 选择 trace handoff adapter | handoff 失败不回滚 truth | unsupported kind fail-fast |
| `handoff.trace.credential_ref` | `CredentialRef` / null | `null` | 指向 trace handoff 凭据 | raw secret 禁止 | configured 缺失 fail-fast |
| `handoff.archive.kind` | enum | `fake` | 选择 archive handoff adapter | 不拥有长期归档正文 | unsupported kind fail-fast |
| `handoff.archive.credential_ref` | `CredentialRef` / null | `null` | 指向 archive handoff 凭据 | raw secret 禁止 | configured 缺失 fail-fast |
| `handoff.redaction_required` | bool | `true` | 要求交接前通过脱敏检查 | P0 不允许关闭 | false rejected |

#### jobs 配置 demo

```json
{
  "jobs": {
    "batch_limits": { "default_batch_size": 50, "max_batch_size": 500 },
    "retry_policy": { "max_attempts": 3, "backoff_ms": 1000 },
    "timeout_policy": { "default_timeout_ms": 30000 }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `jobs.batch_limits.default_batch_size` | positive integer | `50` | job 默认批量大小 | 1 到 max_batch_size | out of range fail-fast |
| `jobs.batch_limits.max_batch_size` | positive integer | `500` | job 最大批量大小 | 不得小于 default | out of range fail-fast |
| `jobs.retry_policy.max_attempts` | positive integer | `3` | transient failure 最大重试次数 | 不能把 failure 伪装成功 | out of range fail-fast |
| `jobs.retry_policy.backoff_ms` | positive integer | `1000` | 重试退避 | 必须大于 0 | out of range fail-fast |
| `jobs.timeout_policy.default_timeout_ms` | positive integer | `30000` | job 默认超时 | 必须大于 0 | out of range fail-fast |

#### retention 配置 demo

```json
{
  "retention": {
    "idempotency_window_hours": 72,
    "trace_retention_days": 30,
    "cursor_ttl_hours": 24
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `retention.idempotency_window_hours` | positive integer | `72` | 幂等记录保留窗口 | 不得为 0 | out of range fail-fast |
| `retention.trace_retention_days` | positive integer | `30` | trace context 保留窗口 | 不得低于安全下限 | out of range fail-fast |
| `retention.cursor_ttl_hours` | positive integer | `24` | change cursor 保留窗口 | 不得为 0 | out of range fail-fast |

#### projection 配置 demo

```json
{
  "projection": {
    "read_model_enabled": true,
    "search_enabled": false,
    "rebuild_batch_size": 50
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `projection.read_model_enabled` | bool | `true` | 启用 read model | 关闭时 query 必须输出 fallback marker | invalid bool fail-fast |
| `projection.search_enabled` | bool | `false` | 启用 search projection | search 是外围增强,不得阻塞 truth | invalid bool fail-fast |
| `projection.rebuild_batch_size` | positive integer | `50` | 投影重建批量 | 不得超过 jobs max batch | out of range fail-fast |

#### reports 配置 demo

```json
{
  "reports": {
    "artifacts_root": "artifacts/test",
    "output_root": "reports",
    "run_id_source": "job"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `reports.artifacts_root` | path | `artifacts/test` | 测试 artifact 根目录 | 运行时形成 `artifacts/test/<run_id>` | unwritable path fail-fast |
| `reports.output_root` | path | `reports` | 报告根目录 | 不额外加入项目名层级 | unwritable path fail-fast |
| `reports.run_id_source` | enum | `job` | 决定 run id 来源 | `job` 表示由 job / gate 传入 | missing run id fail-fast |

#### security 配置 demo

```json
{
  "security": {
    "redaction_policy": "strict"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `security.redaction_policy` | enum | `strict` | 固定 redaction、raw secret 拒绝和 forbidden body 拒绝下限 | P0 只允许 strict | non-strict rejected |

说明:

```text
raw secret、raw token、forbidden body 不是可配置字段。
它们由 `security.redaction_policy = strict` 和 ConfigValidator 固定拒绝。
```

### 7.3 完整配置 demo

以下示例使用 JSONC,注释只用于文档说明;实际 JSON 配置必须删除注释。

```jsonc
{
  // runtime 只描述 profile 和 schema 版本,不包项目名前缀。
  "runtime": {
    "profile": "local-dev",
    "config_version": "v1"
  },

  // P0 默认使用 in-memory store;durable_ref 是后续接入方向。
  "storage": {
    "truth_store": { "kind": "in_memory" },
    "projection_store": { "kind": "in_memory" },
    "snapshot_store": { "kind": "in_memory" },
    "outbox_store": { "kind": "in_memory" },
    "idempotency_store": { "kind": "in_memory" }
  },

  // api 入口必须使用 strict metadata policy。
  "api": {
    "command_intake": { "enabled": true },
    "query_intake": { "enabled": true },
    "metadata_policy": "strict"
  },

  // worker 默认不启用真实 inbound source,但启用 outbox relay。
  "worker": {
    "inbound_event_sources": { "enabled": false, "profile": "fake" },
    "outbox_relay": { "enabled": true }
  },

  // fake publisher 只用于 local / CI,不能伪装成 production success。
  "outbox": {
    "publisher": {
      "kind": "fake",
      "credential_ref": null,
      "timeout_ms": 30000,
      "retry_profile": "transient"
    }
  },

  // resolver 只能返回引用、状态或安全快照,不能复制来源正文。
  "resolver": {
    "actor": { "kind": "fake", "credential_ref": null },
    "external_fact_sources": { "kind": "fake", "credential_ref": null }
  },

  // handoff 必须保留 redaction requirement。
  "handoff": {
    "trace": { "kind": "fake", "credential_ref": null },
    "archive": { "kind": "fake", "credential_ref": null },
    "redaction_required": true
  },

  // jobs 参数在 job run 开始读取,不支持运行中热更新。
  "jobs": {
    "batch_limits": { "default_batch_size": 50, "max_batch_size": 500 },
    "retry_policy": { "max_attempts": 3, "backoff_ms": 1000 },
    "timeout_policy": { "default_timeout_ms": 30000 }
  },

  // retention 不能用于关闭幂等、trace 或 cursor 安全下限。
  "retention": {
    "idempotency_window_hours": 72,
    "trace_retention_days": 30,
    "cursor_ttl_hours": 24
  },

  // projection 是派生辅助,不能反写 truth。
  "projection": {
    "read_model_enabled": true,
    "search_enabled": false,
    "rebuild_batch_size": 50
  },

  // run_id 由 gate / job 提供,形成 artifacts/test/<run_id>。
  "reports": {
    "artifacts_root": "artifacts/test",
    "output_root": "reports",
    "run_id_source": "job"
  },

  // strict 是 P0 唯一允许值。
  "security": {
    "redaction_policy": "strict"
  }
}
```

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 7 按 `03` §13 配置引用表和 Step 3 控制面生成配置项清单 | 否 | 配置说明细化 | 无 | 无回写 |
| 本地配置不包 `conversation` 或 `l1_conversation` 顶层前缀 | 否 | 配置文件组织规则 | 无 | 无回写 |
| 模块级 demo 使用严格 JSON,完整 demo 使用 JSONC 文档示例 | 否 | 文档格式规则 | 无 | 无回写 |
| raw secret、raw token、forbidden body 不作为配置字段开放 | 否 | 禁止配置化边界 | 无 | 无回写 |
| profile 当前作为配置矩阵值说明,不新增详细设计字段或 enum 值 | 否 | 无代码契约变化 | 无 | 无回写 |

说明:

```text
本步没有新增 adapter trait、repository trait、domain object 字段或 handler 签名。
如果后续实现要求把 profile 或 adapter kind 固化为 Rust enum,应以现有 `RuntimeProfile` / config type 承接;若现有类型不足,在 Step 14 记录 03 回写。
```

## 9. 回填草稿

正式 `04-配置设计.md` §7 建议采用以下结构:

```text
7. 配置项清单
  7.1 配置项清单
  7.2 模块级 JSON demo 与逐项说明
  7.3 完整配置 demo
  7.4 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §7.1 | `design-calibration/04_config_step_07_config_items.md` §7.1 |
| §7.2 | `design-calibration/04_config_step_07_config_items.md` §7.2 |
| §7.3 | `design-calibration/04_config_step_07_config_items.md` §7.3 |
| §7.4 | `design-calibration/04_config_step_07_config_items.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 8 的待确认事项。

后续 Step 必须继续收口:

- Step 8 单独展开 `CredentialRef` / `SecretRef`、raw secret 禁止、轮换和审计。
- Step 9 需要说明 JSON duplicate key 检测、类型校验、交叉字段校验和 runtime builder 生效机制。
- Step 11 需要说明 configured adapter ref 不可达、report path 不可写和 redaction violation 的 fail-fast / degraded 策略。
- Step 15 组装正式文档时,完整 demo 必须标注 JSONC 文档示例,实际运行配置必须删除注释。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 配置项清单已形成 | 通过 | §7.1 |
| 模块级 JSON demo 已形成 | 通过 | §7.2 |
| 完整 JSONC demo 已形成 | 通过 | §7.3 |
| 对 03 影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 8 | 通过 | 下一步定义敏感配置与密钥管理 |
