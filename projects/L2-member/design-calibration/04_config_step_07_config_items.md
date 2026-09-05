# Step 7. 定义配置项清单与 JSON demo

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 7
> 回填章节：`04-配置设计.md` §7 配置项清单
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_07_config_items.md`
> 状态：`completed / pass_with_upstream_and_design_blockers / stop_review`
> 日期：2026-09-03

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 7：定义配置项清单 |
| 输入 | Step 3 控制面、Step 4 分类、Step 5 来源优先级、Step 6 profile 矩阵、`03 §13` logical binding |
| 输出 | P0 配置项清单、按功能模块 JSON demo、完整 JSONC demo、配置域停审和跨项审计 |
| 当前状态 | 已完成；允许进入 Step 8 |
| 命名规则 | 项目本地配置使用 `<module>.<setting>`；不重复 `l2_member` 项目前缀。系统聚合映射由部署 / 运维材料另行说明。 |
| 数值规则 | 本 Step 采用结构性 posture / bounded-class 枚举，不把未经 workload authority 证明的 timeout、batch、page、parallelism 数字写成目标。 |
| publication 规则 | `publication_blocked` 不提供任何 P0/P1 配置项；24 candidate 继续 zero configuration。 |

## 2. 本步目标与执行边界

本 Step 将已停审的配置域展开为可实现、可校验、可测试的配置项。每一项都必须有类型、默认值、必填性、来源、作用域、生效方式、敏感级别、失败策略和关联模块；默认值只能是安全结构性默认，不能替代未闭合 owner 合同。

本 Step 不新增 `MemberRuntimeConfigRef`、`MemberStoreConfigRef`、`MemberAdapterConfigRef` 之外的代码 carrier，不选择物理 Store / broker / scheduler / secret 产品，不创建 endpoint / topic / route / publisher 配置，也不改变 `03` 的 Port、error、DTO 或 flow。

## 3. 配置项默认值解释

| 标记 | 含义 |
|---|---|
| `profile-default` | 由已选择 profile 提供的结构性默认；若该 profile 没有安全绑定，校验失败，不回退到空值或旧值 |
| `null` | 当前没有安全默认；对于 required 项表示必须显式提供或由受控 profile binding 提供；对于 optional 项表示 blocked / unavailable |
| posture enum | 有限枚举，只表达可用性、保守策略或边界类别，不携带外部业务结论 |
| bounded class | 结构性上限类别；具体数值须由后续 workload / technical authority 绑定，不能在本 Step 伪造性能目标 |

## 4. SOP 问题回答

| 问题 | L2-member 结论 |
|---|---|
| 每个 P0 项的名称、类型、默认值是什么？ | 见 §6 的十列总表；按 `composition`、`stores`、`technical`、boundary、Consumer / projection、jobs、resolvers、handoff、registry、diagnostics、fixtures 分模块列出。 |
| 哪些必须提供？ | `composition.profile`、local truth / UoW 所需 Store、idempotency / typed-result carrier、Clock / ID / digest slot 为 mutation lane 的 required 输入；external / optional slot 可为 null，但对应操作必须 blocked / stale / not-available。 |
| 来源和作用域是什么？ | 普通项遵循 default < JSON < allowlisted env；scope 为 process / startup、new job-run 或 current entry；secret 只通过 opaque ref。 |
| 如何生效、是否敏感？ | composition / Store / technical / registry 为 startup；Job posture 为 job-run-start；boundary 可有 entry-local typed limit；opaque ref 为 sensitive；redaction 为 strict internal。 |
| JSON 如何拆分？ | 每个主要功能域单独模块，禁止 `common`、`misc`、泛化 `runtime`；模块 demo 使用严格 JSON，完整说明 demo 使用 JSONC。 |
| 是否有未配置的 outbound event？ | 有意未配置。24 个 semantic outbound candidate 没有配置项、publisher、outbox、topic、route、retry、DLQ 或 receipt。 |
| 是否影响 03？ | 当前没有。配置项均映射既有 logical refs / ports；若未来需要新字段或构造参数，必须先回开 03。 |

## 5. 配置模块目录

| 模块 | 功能边界 | 主要绑定 |
|---|---|---|
| `composition` | profile、严格解析和 provenance | `MemberRuntimeConfigRef`、`infra/config.rs`、builder |
| `stores` | truth / support / projection / continuation / idempotency / result logical Store | `MemberStoreConfigRef`、UoW、Store adapters |
| `technical` | Clock、ID、digest 技术 slot | `MemberAdapterConfigRef`、technical Ports |
| `command_boundary` | Command 输入安全边界 | API / application boundary |
| `query_boundary` | Query 分页、freshness 和安全 read surface | API / read model / projection |
| `consumer` | Consumer source / dedup posture | worker、receipt / idempotency |
| `projection` | projection activation / freshness / rebuild target posture | CP07、projection Job |
| `jobs` | 五类 Job runner 的可用性和策略类别 | jobs、continuation Store |
| `resolvers` | 八个 owner-specific resolver slot | Work、Identity、Credential、Governance、Runtime、Tools、Method、Host-route Ports |
| `handoff` | host / Runtime / publication / observation / archive / export slot | handoff Ports、blocked seam |
| `registry` | logical API / worker / Job registration | builder registry state |
| `diagnostics` | redaction、provenance 和 low-cardinality telemetry | config diagnostics / observability hooks |
| `fixtures` | test-only deterministic fake / fixture posture | test builder、replay harness |
| `publication_blocked` | 24 candidate 的阻断标记 | `L2M-UP-005`；无可配置项 |

## 6. P0 配置项总表

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `composition.profile` | enum `ProfileName` | `null` | 是 | JSON / allowlisted env | process | startup | internal | fail-fast | `infra/config.rs`, builder |
| `composition.strict_unknown_keys` | bool | `true` | 否 | default / JSON / env | process | startup | internal | fail-fast | config validator |
| `composition.provenance_mode` | enum `redacted` | `redacted` | 是 | default / JSON | process | startup | internal | fail-fast | config diagnostics |
| `stores.truth_ref` | opaque ref | `profile-default` | 是（mutation） | JSON / env ref | process | startup | sensitive | fail-fast / no-write | CP01～CP05 Store |
| `stores.support_ref` | opaque ref or null | `null` | 否 | JSON / env ref | process | startup | sensitive | blocked / not-available | CP06 mirror |
| `stores.projection_ref` | opaque ref or null | `null` | 否 | JSON / env ref | process | startup | sensitive | stale / not-ready | CP07 projection |
| `stores.continuation_ref` | opaque ref or null | `null` | 否（外围） | JSON / env ref | process | startup | sensitive | gap / blocked | attempt / gap |
| `stores.idempotency_ref` | opaque ref | `profile-default` | 是（mutation） | JSON / env ref | process | startup | sensitive | fail-fast / no-write | reservation |
| `stores.result_ref` | opaque ref | `profile-default` | 是（typed replay） | JSON / env ref | process | startup | sensitive | fail-fast / replay blocked | result / receipt / report |
| `technical.clock_ref` | opaque ref or profile selector | `profile-default` | 是 | JSON / env ref | process | startup | internal | fail-fast | Clock Port |
| `technical.id_generator_ref` | opaque ref or profile selector | `profile-default` | 是 | JSON / env ref | process | startup | internal | fail-fast | ID Port |
| `technical.digest_ref` | opaque ref or profile selector | `profile-default` | 是 | JSON / env ref | process | startup | internal | fail-fast | digest Port |
| `command_boundary.body_limit_class` | bounded-class enum | `profile-safe` | 是 | default / JSON / env | process + entry | startup / entry-local | internal | fail-fast / reject entry | API Command |
| `command_boundary.timeout_class` | bounded-class enum | `profile-safe` | 否 | default / JSON / env | entry | entry-local | internal | reject-new-value | API / application |
| `query_boundary.page_limit_class` | bounded-class enum | `profile-safe` | 是 | default / JSON / env | process + entry | startup / entry-local | internal | fail-fast / reject query | API Query |
| `query_boundary.freshness_posture` | enum | `committed-or-stale` | 是 | default / JSON / env | process | startup | internal | fail-closed read | read model |
| `query_boundary.surface_posture` | enum | `safe-default` | 是 | default / JSON | process | startup | internal | fail-closed read | views / outlet |
| `consumer.dedup_posture` | enum | `exact-replay-required` | 是 | default / JSON / env | process | startup | internal | fail-closed receipt | worker |
| `consumer.source_ref` | opaque ref or null | `null` | 否（按 source） | JSON / env ref | process | startup | sensitive | blocked / waiting | source resolver |
| `consumer.envelope_limit_class` | bounded-class enum | `profile-safe` | 否 | default / JSON / env | entry | entry-local | internal | reject envelope | Consumer gate |
| `projection.activation_posture` | enum | `disabled-until-watermark` | 是 | default / JSON / env | process | startup | internal | stale / not-ready | CP07 |
| `projection.freshness_posture` | enum | `stale-until-committed` | 是 | default / JSON / env | process | startup | internal | fail-closed read | CP07 |
| `projection.rebuild_target_ref` | opaque ref or null | `null` | 否 | JSON / env ref | job | job-run-start | sensitive | job blocked | rebuild Job |
| `jobs.runner_posture` | enum | `profile-default` | 是 | default / JSON / env | process | startup | internal | job unavailable | jobs |
| `jobs.batch_class` | bounded-class enum | `profile-safe` | 是 | default / JSON / env | job | job-run-start | internal | reject invocation | jobs |
| `jobs.retry_class` | enum | `no-unknown-retry` | 是 | default / JSON / env | job | job-run-start | internal | no blind retry | jobs |
| `jobs.timeout_class` | bounded-class enum | `profile-safe` | 否 | default / JSON / env | job | job-run-start | internal | item blocked / report | jobs |
| `jobs.parallelism_class` | enum | `deterministic-single` | 是 | default / JSON / env | job | job-run-start | internal | reject invocation | jobs |
| `resolvers.work_ref` | opaque ref or null | `null` | 否（owner pending） | JSON / env ref | process | startup | sensitive | blocked / waiting | Work resolver |
| `resolvers.identity_ref` | opaque ref or null | `null` | 否（owner pending） | JSON / env ref | process | startup | sensitive | blocked / waiting | Identity resolver |
| `resolvers.credential_ref` | opaque ref or null | `null` | 否（owner pending） | JSON / env ref | process | startup | sensitive | fail-closed / blocked | Credential resolver |
| `resolvers.governance_ref` | opaque ref or null | `null` | 否（owner pending） | JSON / env ref | process | startup | sensitive | blocked / unknown | Governance resolver |
| `resolvers.runtime_ref` | opaque ref or null | `null` | 否（owner pending） | JSON / env ref | process | startup | sensitive | blocked / waiting | Runtime resolver |
| `resolvers.tools_ref` | opaque ref or null | `null` | 否（owner pending） | JSON / env ref | process | startup | sensitive | blocked / not-available | Tools resolver |
| `resolvers.method_ref` | opaque ref or null | `null` | 否（owner pending） | JSON / env ref | process | startup | sensitive | blocked / not-available | Method resolver |
| `resolvers.host_route_ref` | opaque ref or null | `null` | 否（owner pending） | JSON / env ref | process | startup | sensitive | blocked / waiting | Host-route resolver |
| `handoff.host_ref` | opaque ref or null | `null` | 否 | JSON / env ref | process | startup | sensitive | blocked | host handoff |
| `handoff.runtime_ref` | opaque ref or null | `null` | 否 | JSON / env ref | process | startup | sensitive | blocked / unknown | Runtime handoff |
| `handoff.publication_ref` | opaque ref or null | `null` | 否 | JSON / env ref | process | startup | sensitive | local attempt / gap | publication handoff |
| `handoff.observation_ref` | opaque ref or null | `null` | 否 | JSON / env ref | process | startup | sensitive | local attempt / gap | observation handoff |
| `handoff.archive_ref` | opaque ref or null | `null` | 否 | JSON / env ref | process | startup | sensitive | blocked / gap | archive handoff |
| `handoff.external_export_ref` | opaque ref or null | `null` | 否 | JSON / env ref | job | job-run-start | sensitive | export blocked | external export Job |
| `registry.api_posture` | enum | `logical-enabled` | 是 | default / JSON / env | process | startup | internal | logical entry unavailable | API registry |
| `registry.worker_posture` | enum | `logical-enabled` | 是 | default / JSON / env | process | startup | internal | logical entry unavailable | worker registry |
| `registry.jobs_posture` | enum | `logical-enabled` | 是 | default / JSON / env | process | startup | internal | logical entry unavailable | Job registry |
| `diagnostics.redaction_mode` | enum | `strict` | 是 | default / JSON | process | startup | internal | fail-fast / reject unsafe config | diagnostics |
| `diagnostics.provenance_visibility` | enum | `internal-only` | 是 | default / JSON | process | startup | internal | redact more | diagnostics |
| `diagnostics.metric_label_mode` | enum | `low-cardinality` | 是 | default / JSON | process | startup | internal | reject unsafe labels | telemetry hooks |
| `fixtures.enabled` | bool | `false` | 否 | test-only fixture | test assembly | test-fixture-deterministic | internal | production reject | test builder |
| `fixtures.clock_mode` | enum | `deterministic` | 否 | test-only fixture | test assembly | test-fixture-deterministic | internal | test setup fail | test builder |
| `fixtures.id_mode` | enum | `deterministic` | 否 | test-only fixture | test assembly | test-fixture-deterministic | internal | test setup fail | test builder |
| `fixtures.external_seam_mode` | enum | `blocked-by-default` | 否 | test-only fixture | test assembly | test-fixture-deterministic | internal | test setup fail | seam fakes |

说明：`required` 以操作 lane 解释。某个 optional ref 缺失并不等于系统 ready；只表示该 owner-specific 操作保持 `Blocked`、`Waiting`、`Unknown`、`Stale` 或 `NotAvailable`。

## 7. 模块级 JSON demo 与逐项说明

以下 demo 均为严格 JSON；`opaque-ref:*` 只是文档中的非秘密引用示例，实际 secret material 不得写入文件。

### 7.1 `composition` 配置 demo

```json
{
  "composition": {
    "profile": "local-dev",
    "strict_unknown_keys": true,
    "provenance_mode": "redacted"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `composition.profile` | enum | `local-dev` | 选择已定义 profile | 必须属于有限 profile 集合；生产形态不得隐式回退 local | fail-fast |
| `composition.strict_unknown_keys` | bool | `true` | 拒绝未知 key | 不能关闭 schema / alias 冲突检查 | fail-fast |
| `composition.provenance_mode` | enum | `redacted` | 记录可解释来源 | 只能输出 source class / fingerprint / issue ref | fail-fast |

### 7.2 `stores` 配置 demo

```json
{
  "stores": {
    "truth_ref": "opaque-ref:profile-default-truth",
    "support_ref": null,
    "projection_ref": null,
    "continuation_ref": null,
    "idempotency_ref": "opaque-ref:profile-default-idempotency",
    "result_ref": "opaque-ref:profile-default-result"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `stores.truth_ref` | opaque ref | `opaque-ref:profile-default-truth` | 绑定 CP01～CP05 logical truth Store | 不含 DSN、产品名或 foreign body | fail-fast / no-write |
| `stores.support_ref` | opaque ref / null | `null` | 绑定 CP06 support Store | null 时不得保存 external body | blocked / not-available |
| `stores.projection_ref` | opaque ref / null | `null` | 绑定 CP07 projection Store | current / available 需 committed watermark | stale / not-ready |
| `stores.continuation_ref` | opaque ref / null | `null` | 承载 attempt / gap | 不得等同 broker / outbox | gap / blocked |
| `stores.idempotency_ref` | opaque ref | `opaque-ref:profile-default-idempotency` | reservation 与 duplicate replay | mutation lane 必须有 carrier | fail-fast / no-write |
| `stores.result_ref` | opaque ref | `opaque-ref:profile-default-result` | typed result / receipt / report | 不得删除未完成 relation | fail-fast / replay blocked |

### 7.3 `technical` 配置 demo

```json
{
  "technical": {
    "clock_ref": "opaque-ref:profile-default-clock",
    "id_generator_ref": "opaque-ref:profile-default-id",
    "digest_ref": "opaque-ref:profile-default-digest"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `technical.clock_ref` | opaque ref | `opaque-ref:profile-default-clock` | 注入 Clock Port | domain 不可自行取时间 | fail-fast |
| `technical.id_generator_ref` | opaque ref | `opaque-ref:profile-default-id` | 注入 ID Port | retry 不得生成第二业务 ID | fail-fast |
| `technical.digest_ref` | opaque ref | `opaque-ref:profile-default-digest` | 注入 canonical digest Port | 必须与协议 canonical input 对齐 | fail-fast |

### 7.4 `command_boundary` 配置 demo

```json
{
  "command_boundary": {
    "body_limit_class": "profile-safe",
    "timeout_class": "profile-safe"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `command_boundary.body_limit_class` | bounded class | `profile-safe` | 限制 Command 输入规模 | 不得绕过 metadata、actor、double anchor、body-free gate | fail-fast / reject entry |
| `command_boundary.timeout_class` | bounded class | `profile-safe` | 表达边界时间类别 | 不写性能目标；运行中不改变已开始操作 | reject-new-value |

### 7.5 `query_boundary` 配置 demo

```json
{
  "query_boundary": {
    "page_limit_class": "profile-safe",
    "freshness_posture": "committed-or-stale",
    "surface_posture": "safe-default"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `query_boundary.page_limit_class` | bounded class | `profile-safe` | 限制分页请求 | 不得使 Query 写 Store 或绕过 visibility | fail-fast / reject query |
| `query_boundary.freshness_posture` | enum | `committed-or-stale` | 指定 stale 的安全展示姿态 | 不得直接声明 current / available | fail-closed read |
| `query_boundary.surface_posture` | enum | `safe-default` | 控制安全 read surface | 不得成为 authorization / capability registry | fail-closed read |

### 7.6 `consumer` 配置 demo

```json
{
  "consumer": {
    "dedup_posture": "exact-replay-required",
    "source_ref": null,
    "envelope_limit_class": "profile-safe"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `consumer.dedup_posture` | enum | `exact-replay-required` | 绑定 Consumer duplicate posture | 不替代 envelope identity / idempotency key | fail-closed receipt |
| `consumer.source_ref` | opaque ref / null | `null` | 选择 source-specific resolver slot | 不携带 event body 或 local policy | blocked / waiting |
| `consumer.envelope_limit_class` | bounded class | `profile-safe` | 限制 envelope 边界 | external event 不得转成 Command | reject envelope |

### 7.7 `projection` 配置 demo

```json
{
  "projection": {
    "activation_posture": "disabled-until-watermark",
    "freshness_posture": "stale-until-committed",
    "rebuild_target_ref": null
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `projection.activation_posture` | enum | `disabled-until-watermark` | 控制 projection 是否可对外展示 | watermark 必须来自 committed source | stale / not-ready |
| `projection.freshness_posture` | enum | `stale-until-committed` | 表达 view 新鲜度 | 不以 config 直接制造 current | fail-closed read |
| `projection.rebuild_target_ref` | opaque ref / null | `null` | 指定 rebuild target slot | 不得由 Query 触发 rebuild | job blocked |

### 7.8 `jobs` 配置 demo

```json
{
  "jobs": {
    "runner_posture": "profile-default",
    "batch_class": "profile-safe",
    "retry_class": "no-unknown-retry",
    "timeout_class": "profile-safe",
    "parallelism_class": "deterministic-single"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `jobs.runner_posture` | enum | `profile-default` | 表达 runner availability | 不等于 scheduler / process ready | job unavailable |
| `jobs.batch_class` | bounded class | `profile-safe` | 表达单次 Job 批量类别 | 不声明容量或 SLO | reject invocation |
| `jobs.retry_class` | enum | `no-unknown-retry` | 区分可重试与 unknown | conflict / unknown 不盲重试 | no blind retry |
| `jobs.timeout_class` | bounded class | `profile-safe` | 表达 Job item 时间类别 | 不改变已完成 item / report | item blocked / report |
| `jobs.parallelism_class` | enum | `deterministic-single` | P0 保证可重复执行 | 不等于 scheduler truth | reject invocation |

### 7.9 `resolvers` 配置 demo

```json
{
  "resolvers": {
    "work_ref": null,
    "identity_ref": null,
    "credential_ref": null,
    "governance_ref": null,
    "runtime_ref": null,
    "tools_ref": null,
    "method_ref": null,
    "host_route_ref": null
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `resolvers.work_ref` | opaque ref / null | `null` | Work-owned context slot | 不返回 Work body | blocked / waiting |
| `resolvers.identity_ref` | opaque ref / null | `null` | Identity anchor slot | 不复制 Identity truth | blocked / waiting |
| `resolvers.credential_ref` | opaque ref / null | `null` | credential verification slot | 不返回 raw credential | fail-closed / blocked |
| `resolvers.governance_ref` | opaque ref / null | `null` | policy safe-result slot | 不建立 local allowlist | blocked / unknown |
| `resolvers.runtime_ref` | opaque ref / null | `null` | Runtime context slot | 不返回 loop / plan / outcome body | blocked / waiting |
| `resolvers.tools_ref` | opaque ref / null | `null` | Tool contract safe-view slot | 不建立 capability registry | blocked / not-available |
| `resolvers.method_ref` | opaque ref / null | `null` | Method definition safe-view slot | 不复制 definition / invocation body | blocked / not-available |
| `resolvers.host_route_ref` | opaque ref / null | `null` | host / route context slot | 不接受任意 URL 自选 owner | blocked / waiting |

### 7.10 `handoff` 配置 demo

```json
{
  "handoff": {
    "host_ref": null,
    "runtime_ref": null,
    "publication_ref": null,
    "observation_ref": null,
    "archive_ref": null,
    "external_export_ref": null
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `handoff.host_ref` | opaque ref / null | `null` | host collaboration slot | 不声明 registration / session / health | blocked |
| `handoff.runtime_ref` | opaque ref / null | `null` | Runtime handoff slot | 不创建 Runtime run | blocked / unknown |
| `handoff.publication_ref` | opaque ref / null | `null` | local publication handoff slot | 不生成 event / publisher / outbox / route | attempt / gap |
| `handoff.observation_ref` | opaque ref / null | `null` | local observation handoff slot | 不声明 observed / evidence | attempt / gap |
| `handoff.archive_ref` | opaque ref / null | `null` | archive handoff slot | archive 不定义 truth | blocked / gap |
| `handoff.external_export_ref` | opaque ref / null | `null` | external export job slot | external status 不反写 truth | export blocked |

### 7.11 `registry` 配置 demo

```json
{
  "registry": {
    "api_posture": "logical-enabled",
    "worker_posture": "logical-enabled",
    "jobs_posture": "logical-enabled"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `registry.api_posture` | enum | `logical-enabled` | 注册 logical API entry | 不创建 listener / server / route | logical entry unavailable |
| `registry.worker_posture` | enum | `logical-enabled` | 注册 logical Consumer entry | 不声明 Bus available | logical entry unavailable |
| `registry.jobs_posture` | enum | `logical-enabled` | 注册 logical Job entry | 不创建 scheduler / process | logical entry unavailable |

### 7.12 `diagnostics` 配置 demo

```json
{
  "diagnostics": {
    "redaction_mode": "strict",
    "provenance_visibility": "internal-only",
    "metric_label_mode": "low-cardinality"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `diagnostics.redaction_mode` | enum | `strict` | 固定安全输出策略 | 不允许 debug / admin 关闭 deny list | fail-fast / reject |
| `diagnostics.provenance_visibility` | enum | `internal-only` | 限制 provenance 可见范围 | 不输出 raw config / identity | redact more |
| `diagnostics.metric_label_mode` | enum | `low-cardinality` | 限制 telemetry 标签 | 不含 member / actor / endpoint / topic / secret | reject unsafe labels |

### 7.13 `fixtures` 配置 demo

```json
{
  "fixtures": {
    "enabled": false,
    "clock_mode": "deterministic",
    "id_mode": "deterministic",
    "external_seam_mode": "blocked-by-default"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `fixtures.enabled` | bool | `false` | 开启 test-only fixture assembly | production-like builder 必须拒绝 true | production reject |
| `fixtures.clock_mode` | enum | `deterministic` | 固定测试时间来源 | 不进入 domain production config | test setup fail |
| `fixtures.id_mode` | enum | `deterministic` | 固定测试 ID 来源 | 不作为运行态 ID fallback | test setup fail |
| `fixtures.external_seam_mode` | enum | `blocked-by-default` | 默认模拟 blocked seam | fake 不关闭 upstream blocker | test setup fail |

### 7.14 `publication_blocked` 说明

```json
{}
```

该模块没有配置项。`L2M-UP-005` 关闭前，24 个 semantic candidate 只保留静态 blocked marker 与安全诊断；不得通过空对象、profile 或 env 隐式创建 publisher、outbox、topic、route、retry、DLQ 或 delivery receipt。

## 8. 配置项停审记录

| 配置域 | 十列是否完整 | 模块拆分 | 默认 / 失败策略 | 敏感级别 | 03 影响 | 结论 |
|---|---:|---|---|---|---|---|
| composition | 是 | 功能边界清楚 | profile 缺失 fail-fast | internal | 无 | 通过 |
| stores | 是 | truth / support / projection / continuation / idempotency / result 分开 | null 只表示 blocked / stale，不表示 ready | sensitive ref | 无 | 通过 |
| technical | 是 | Clock / ID / digest 独立 | 缺 slot fail-fast | internal | 无 | 通过 |
| command / query boundary | 是 | Command 与 Query 分开 | bounded class；非法拒绝 | internal | 无 | 通过 |
| consumer / projection | 是 | source、dedup、watermark 分开 | exact replay / stale posture | internal / sensitive ref | 无 | 通过 |
| jobs | 是 | runner、batch、retry、timeout、parallelism 分开 | unknown 不重试 | internal | 无 | 通过 |
| resolvers / handoff | 是 | owner-specific、handoff-specific | null → blocked / waiting / gap | sensitive ref | 无 | 通过 |
| registry | 是 | logical API / worker / Job 分开 | 不创建 process | internal | 无 | 通过 |
| diagnostics | 是 | redaction / provenance / labels 分开 | strict / low-cardinality | internal | 无 | 通过 |
| fixtures | 是 | test-only 独立模块 | production reject | internal | 无 | 通过 |
| publication_blocked | 不适用（零配置） | 独立阻断说明 | 固定 blocked | static | 无 | 通过 |

## 9. 跨配置项闭环审计表

| 审计项 | 结果 | 缺口 / 修正 |
|---|---|---|
| 每项是否有十列最小字段 | 通过 | §6 全表覆盖；结构性枚举替代未经授权的数字 |
| 模块是否按功能边界拆分 | 通过 | 未使用 `common`、`misc`、泛化 `runtime` 或 `storage` |
| 项目本地 key 是否重复项目名前缀 | 通过 | 使用 `<module>.<setting>`；聚合映射留运维材料 |
| 默认值是否可能把 external slot 伪造成 ready | 通过 | 外部 refs 默认 null；availability / success 不可手工开启 |
| required mutation lane 是否有失败策略 | 通过 | truth、idempotency、result、technical slot 缺失 fail-fast / no-write |
| Query 配置是否可能触发写操作 | 通过 | query boundary / projection 明确 no-write、不可 refresh / rebuild |
| Job 配置是否可能盲重试 unknown / conflict | 通过 | `no-unknown-retry`，未知状态进入 report / blocked |
| sensitive ref 是否混入 raw secret | 通过 | 仅 opaque ref；Step 8 继续定义 provider 和轮换 |
| profile / fixture 是否绕过 blocker | 通过 | fixture test-only；24 candidate zero configuration |
| 是否出现 publisher / outbox / topic / route 配置 | 通过 | `publication_blocked` 无配置项 |
| 是否改变 `03` carrier / Port / error / flow | 未发现 | 当前仅定义既有 logical binding 的字段语义，无回写 |

## 10. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| 配置按功能模块拆分为既有 logical refs / posture | 否 | 04 层的字段组织 | `03 §13` 已有逻辑类别 | 无回写 |
| 使用 `profile-default` 和 bounded-class，避免虚构数值 | 否 | 配置语义约束 | 不适用 | 无回写 |
| external ref 缺失用 blocked / stale / not-available 表达 | 否 | 承接 existing availability | `03 §13` / Step 14 已有 | 无回写 |
| `publication_blocked` zero configuration | 否 | 承接 `L2M-UP-005` | `03 §7、§13` 已有 | 无回写 |
| 未来若需新增字段、改名 carrier、builder / constructor、Port、error 或 flow | 是 | 代码契约变化 | `03 §4～§13` 与 owning Step | 已回写（03 已有回开规则；未来触发器当前未触发） |

当前不存在实际“待回写”或“阻塞待确认”项；未来触发器不进入正式清单。

## 11. 回填草稿：正式 `04-配置设计.md` §7

> 校准来源：
> - `design-calibration/04_config_step_07_config_items.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“P0 配置项总表”“模块级 JSON demo 与逐项说明”“配置项停审记录”和“跨配置项闭环审计表”。

正式 §7 应收口为：

1. 配置按功能模块拆分为 `composition`、`stores`、`technical`、`command_boundary`、`query_boundary`、`consumer`、`projection`、`jobs`、`resolvers`、`handoff`、`registry`、`diagnostics` 和 test-only `fixtures`。
2. 每个配置项均具备类型、默认值、必填性、来源、作用域、生效方式、敏感级别、失败策略和关联模块；普通来源遵循 Step 5 的覆盖顺序。
3. `profile-default` 只表示 profile 提供安全结构性绑定；bounded-class 不是性能目标。物理产品和具体数值须由后续 authority / 07 / 09 承接。
4. external ref 缺失不会生成默认成功；local mutation 缺少 truth / replay / technical carrier 时 fail-fast / no-write；optional surface 进入 blocked / stale / not-ready。
5. `publication_blocked` 是零配置模块；`L2M-UP-005` 前不生成任何 event、publisher、outbox、topic、route、retry、DLQ 或 delivery receipt。

## 12. 待确认事项与 blocker

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| physical Store / UoW 产品和 durable profile | `stores.*_ref` 的最终语法与 profile binding | 保持 opaque ref / profile-default；不得写 DSN 或产品名 |
| secret provider 与 owner credential contract | `sensitive` ref 的读取、轮换和 criticality | 只保留 opaque ref；Step 8 单独收口 |
| Runtime / host / image / Bus exact contract | resolver / handoff ref 是否可激活 | null / blocked / waiting；不声明正向 integration |
| workload / capacity authority | bounded-class 的最终数值 | 本 Step 不设数字目标；交给 07 / 09 / authority |
| `L2M-UP-005` event schema / route | publication config 是否存在 | 无配置；待关闭后定向重开 |

## 13. 进入 Step 8 的条件与停审结论

| 门禁 | 结果 | 依据 |
|---|---|---|
| P0 配置项十列完整 | 通过 | §6 |
| 按功能模块拆分且无泛化模块 | 通过 | §5、§7 |
| 普通来源、作用域、生效方式和失败策略可追溯 | 通过 | Step 5、§6 |
| sensitive ref 与 raw secret 分离 | 通过 | §6、§9；Step 8 继续细化 |
| JSON module demo 严格有效，完整 demo 可组合 | 通过 | §7 |
| 24 candidate 没有配置化 | 通过 | §7.14、§9 |
| 配置项停审与跨项审计完成 | 通过 | §8、§9 |
| 对 03 的影响已判定，无当前回写项 | 通过 | §10 |
| 正式 `04` 未提前创建 | 通过 | 遵守 Step 15 后置装配纪律 |

Step 7 完成。下一步允许创建 `04_config_step_08_sensitive_secrets.md`，单独收口 sensitive / secret 分类、provider 读取、禁止输出、轮换和审计边界。

```text
step_07 = completed
gate_status = pass_with_upstream_and_design_blockers / stop_review
next_allowed_action = create_step_08_sensitive_secrets
formal_04_write_allowed = false_until_step_15
implementation_repo_write_allowed = false
test_execution_allowed = false
commit_required = false
```
