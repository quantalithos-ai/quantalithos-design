# Step 7. 定义配置项清单

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 7
> 回填章节: `04-配置设计.md` §7 配置项清单

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 定义配置项清单 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 3 控制面;Step 4 分类边界;Step 5 来源优先级;Step 6 profile 矩阵;详细设计 Step 14 配置绑定 |
| 输出文件 | `projects/L1-artifact/design-calibration/04_config_step_07_config_items.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 8 |

## 2. 本步目标

本 Step 把 `L1-artifact` 的 P0 配置项整理成可实现、可校验、可测试的正式清单。

本 Step 只回答:

- 每个 P0 配置项的名称、类型、默认值、必填性、来源、作用域、生效方式、敏感级别、失败策略和 formal binding。
- 配置文件按哪些功能模块组织,以及这些模块如何映射到 Step 14 的正式 config sections。
- 哪些配置项属于 startup runtime、job-run-start、entry-local、test fixture 或 peripheral feature。
- 每个模块的严格 JSON demo 如何书写。
- 完整 JSONC 文档示例如何展示,以及运行时必须删除注释的警告。
- 每个配置域是否完成停审,跨配置项是否存在重复、敏感级别遗漏、必填无失败策略或 `03` 回写缺口。

本 Step 不定义:

- secret provider 的真实读取、轮换、审计和明文禁止输出细节,这些留给 Step 8。
- config loader / validator / runtime builder 的函数流程、error enum 和生效机制,这些留给 Step 9。
- 配置变更审计、回滚、失效模式和降级策略,这些留给 Step 10 / Step 11。
- 部署命令、容器挂载、真实 DB / bus / object store / HTTP 产品、cron 表达式和生产 runbook。
- 正式 `04-配置设计.md` 装配;正式文档必须等 Step 15。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | 已完成 | 提供配置控制面和配置域清单 |
| `04_config_step_04_categories_boundaries.md` | 已完成 | 提供 startup、job-run-start、entry-local、test fixture 和禁止配置化边界 |
| `04_config_step_05_sources_priority_conflicts.md` | 已完成 | 提供 `defaults < file < env` 来源优先级、冲突处理和 secret ref 边界 |
| `04_config_step_06_environment_profiles_matrix.md` | 已完成 | 提供 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 的 profile 差异 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供 `ArtifactRuntimeConfig` 等 formal config sections、binding 点和 jobs entry-local 规则 |
| `03_ddd_step_15_observability_audit.md` | 已完成 | 提供 redaction、diagnostic ref 和 metrics/cardinality 边界 |
| `03_ddd_step_16_test_cuts.md` | 已完成 | 提供 fixture、deterministic fake、operations replay 和 integration seam 承接要求 |
| `03-详细设计.md` §13 / §15 / §17 | 已完成 | 提供正式配置绑定、观测边界和风险约束 |
| `L1-governance` `04_config_step_07_config_items.md` | 已参考 | 提供 Step 7 粒度框架,本文件按 Artifact 语义重写 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 配置项的名称、类型、默认值是什么? | 本 Step 将配置项按 14 个功能模块展开: `runtime`、`stores`、`sourceResolvers`、`inboundConsumers`、`relay`、`jobs`、`handoff`、`boundary`、`idempotency`、`projection`、`reference`、`redaction`、`clockId`、`testFixtures`。字段名采用项目本地 JSON 模块名,不重复 `artifact` 前缀。 |
| 哪些配置项必填? | core startup runtime 必填项包括 profile、5 类 logical store binding、source resolver adapter、relay publisher adapter、clock/id adapter、boundary limits、idempotency retention、core topic bindings。外围项如 handoff targets 和 derived/trace events 在 enabled 时变为必填。 |
| 每个配置项从哪里来、作用域是什么? | 普通项来源遵守 Step 5 `defaults < file < env`;entry-local 只用于当前 entry 或当前 jobs bin;job-local 只用于当前 job request;fixture 只用于 test/replay。作用域分为 startup runtime、job-run-start、entry-local 和 test harness。 |
| 每个配置项如何生效、是否敏感、失败策略是什么? | P0 无核心 hot update。startup 项在 runtime builder 前校验并冻结;job-run-start 项在 job report / receipt 语境中固化;entry-local 只影响当前入口。敏感项只允许保存 ref,raw secret/body 由 Step 8 收口。必填缺失或非法必须 fail-fast 或 reject 当前 job/entry。 |
| 每个配置项关联哪些正式绑定点? | 每个配置项回指 `ArtifactRuntimeConfig`、`ArtifactBoundaryConfig`、`ArtifactIdempotencyConfig`、`ArtifactProjectionConfig`、`ArtifactReferenceConfig`、`ArtifactJobConfig`、`ArtifactRelayConfig`、`ArtifactHandoffConfig` 或 Step 14 的 jobs entry-local binding。 |
| 模块拆分是否按功能边界展开? | 是。模块按 runtime、stores、sourceResolvers、inboundConsumers、relay、jobs、handoff、boundary、idempotency、projection、reference、redaction、clockId、testFixtures 拆分;不使用 `common`、`misc`、`runtimeConfig`、`storage` 等泛化桶混写无关项。 |
| 项目本地配置是否避免重复项目名前缀? | 是。项目本地配置文件顶层不强制写 `artifact.runtime.profile`。若未来存在系统级聚合配置,再映射为 `artifact.runtime.profile` 等聚合路径。 |
| 完整配置 demo 是否需要文档注释? | 完整示例使用 JSONC,只用于文档说明;实际运行配置必须删除注释并使用严格 JSON。模块级 demo 一律使用严格 JSON。 |
| 每个配置域是否通过停审? | 已通过。见 §8.8 配置域停审记录。 |
| 所有配置项完成后是否存在重复项、敏感遗漏、必填无失败策略或 `03` 影响未判定? | 已完成跨配置项闭环审计。当前未发现 unresolved 冲突;若未来需要 remote config、真实 product adapter 或 secret-provider integration,进入 Step 13 / Step 14。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 3 配置域 | 已拆控制面,但未形成字段级配置项 | 本 Step 按配置域展开字段级配置项清单 |
| Step 4 分类边界 | 已说明 startup / job-run-start / entry-local,但未映射到具体字段 | 本 Step 为每项写作用域和生效方式 |
| Step 5 来源规则 | 已定义来源优先级,但未给每个字段的允许来源 | 本 Step 每项标注来源和失败策略 |
| Step 6 profile 矩阵 | 已定义 profile,但未给每个 profile 的具体结构 | 本 Step 给 profile 可用的模块项和默认值 |
| Step 14 formal binding | 已给 formal config sections 和 code binding,但缺少文件结构和字段名 | 本 Step 补齐本地 JSON 模块结构和字段名 |
| Step 15 observability | redaction / diagnostic 边界已明确,但缺少字段落点 | 本 Step 给 redaction 模块补齐具体字段 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置项粒度 | 只有 config section / binding point | 字段级配置项含类型、默认、必填、来源、作用域、敏感级别和失败策略 | 实现、测试、验收需要可校验字段 |
| 模块组织 | 只有 runtime / adapter 概念 | 按功能模块组织 JSON: runtime、stores、sourceResolvers、inboundConsumers、relay、jobs、handoff、boundary、idempotency、projection、reference、redaction、clockId、testFixtures | 避免泛化配置桶 |
| profile 默认值 | Step 6 仅给 profile 用途 | 字段级默认值明确指向 `local-dev` / `ci-test` / `integration-like` / `operations-replay` 口径 | 支撑 loader defaults 和 CI fixtures |
| adapter mode 语义 | Step 6 只在环境矩阵层说明 | 本 Step 把 mode 落到具体模块字段 | 避免后续把 profile 当成单个开关 |
| JSON demo | 尚无 | 模块级严格 JSON demo + 完整 JSONC 文档示例 | 支撑配置设计书写规范 |
| `03` 影响 | Step 14 不写具体文件字段 | 本 Step 不新增 runtime object / port;只为既有 binding 点命名和定默认 | 当前无回写 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 顶层是否加 `artifact` 前缀 | A. 项目本地也加 `artifact`;B. 项目本地不重复前缀,系统聚合另行映射 | 采用 B。项目本地配置避免重复项目前缀 |
| stores 是否统一塞进 `storage` | A. 全放 `storage`;B. 用 `stores` 但保留 truth/projection/reference/relay/idempotency 五类 logical store | 采用 B。既保留同域聚合,又不丢 logical ownership |
| resolver / relay / handoff 是否只用单个 ref | A. 只保留 opaque ref,不展开本地模块字段;B. 在本地 JSON 中给出 loader-facing 结构,再折叠到 Step 14 formal refs | 采用 B。Step 14 已明确详细文件格式留给 `04` |
| runtime 是否增加全局 adapterMode | A. 增加;B. 不增加全局 mode,只在具体模块写 mode | 采用 B。Step 6 已要求 profile 与 adapter mode 分离 |
| retry / timeout 默认值是否写生产 sizing | A. 给生产 sizing;B. 给 P0 deterministic defaults 和范围 | 采用 B。生产 sizing 属部署运维和 P1/P2 |
| 完整示例是否直接用 JSON | A. 只给 JSON;B. 模块 demo 用 JSON,完整文档示例用 JSONC | 采用 B。兼顾运行严格性和文档可读性 |

## 8. 结构化中间产物

### 8.1 配置项命名和组织规则

| 规则 | 结论 |
|---|---|
| 配置文件格式 | 默认严格 JSON;完整文档示例可使用 JSONC,但运行时必须删除注释 |
| 顶层命名 | 项目本地文件不重复 `artifact` 前缀 |
| 系统聚合映射 | 若未来统一聚合配置,可映射为 `artifact.<module>.<setting>`;本 Step 不要求实现聚合 loader |
| 模块拆分 | `runtime`、`stores`、`sourceResolvers`、`inboundConsumers`、`relay`、`jobs`、`handoff`、`boundary`、`idempotency`、`projection`、`reference`、`redaction`、`clockId`、`testFixtures` |
| 字段风格 | JSON 使用 lowerCamelCase;typed ref 值使用 opaque string ref |
| 敏感字段 | 字段只能保存 `*Ref`、`*Refs`、route ref 或 target ref;不得保存 raw secret、token、password、SQL、HTTP body、external payload body |
| 默认值策略 | P0 defaults 支撑 `local-dev` / `ci-test`;`integration-like` / `operations-replay` 通过 file/env/job input 补 ref |
| failure 策略 | startup invalid fail-fast;job invalid rejected;entry-local invalid reject current entry;fixture invalid test fail-fast |

### 8.2 配置项总表

| 配置项 | 类型 | 默认值 | 必填性 | 来源 | 作用域 / 生效 | 敏感级别 | 失败策略 | formal binding |
|---|---|---|---|---|---|---|---|---|
| `runtime.profile` | string ref | `local-dev` | 是 | defaults/file/env/entry-local selector | startup 冻结;entry-local 只选当前 entry | non-sensitive | unknown profile fail-fast | `ArtifactRuntimeConfig.profile_ref` |
| `runtime.strictValidation` | bool | `true` | 是 | defaults/file/env | startup validator | non-sensitive | false in P0 fail-fast | loader/validator local rule |
| `stores.truth.kind` | enum string | `in_memory` | 是 | defaults/file/env | startup 冻结 | non-sensitive | unsupported fail-fast | folds into `truth_store_ref` |
| `stores.truth.configRef` | string ref | `store:truth:memory` | 是 | defaults/file/env | startup 冻结 | ref-sensitive when durable | invalid ref fail-fast | `ArtifactRuntimeConfig.truth_store_ref` |
| `stores.projection.kind` | enum string | `in_memory` | 是 | defaults/file/env | startup 冻结 | non-sensitive | unsupported fail-fast | folds into `projection_store_ref` |
| `stores.projection.configRef` | string ref | `store:projection:memory` | 是 | defaults/file/env | startup 冻结 | ref-sensitive when durable | invalid ref fail-fast | `ArtifactRuntimeConfig.projection_store_ref` |
| `stores.reference.kind` | enum string | `in_memory` | 是 | defaults/file/env | startup 冻结 | non-sensitive | unsupported fail-fast | folds into `reference_store_ref` |
| `stores.reference.configRef` | string ref | `store:reference:memory` | 是 | defaults/file/env | startup 冻结 | ref-sensitive when durable | invalid ref fail-fast | `ArtifactRuntimeConfig.reference_store_ref` |
| `stores.relay.kind` | enum string | `in_memory` | 是 | defaults/file/env | startup 冻结 | non-sensitive | unsupported fail-fast | folds into `relay_store_ref` |
| `stores.relay.configRef` | string ref | `store:relay:memory` | 是 | defaults/file/env | startup 冻结 | ref-sensitive when durable | invalid ref fail-fast | `ArtifactRuntimeConfig.relay_store_ref` |
| `stores.idempotency.kind` | enum string | `in_memory` | 是 | defaults/file/env | startup 冻结 | non-sensitive | unsupported fail-fast | folds into `idempotency_store_ref` |
| `stores.idempotency.configRef` | string ref | `store:idempotency:memory` | 是 | defaults/file/env | startup 冻结 | ref-sensitive when durable | invalid ref fail-fast | `ArtifactRuntimeConfig.idempotency_store_ref` |
| `sourceResolvers.adapterRef` | string ref | `resolver:artifact:fake` | 是 | defaults/file/env | startup 冻结 | ref-sensitive when endpoint-backed | missing/invalid fail-fast | `ArtifactRuntimeConfig.source_resolver_ref` |
| `sourceResolvers.mode` | enum string | `fake` | 是 | defaults/file/env/test fixture | startup 冻结 | non-sensitive | unsupported mode fail-fast | loader-local selector |
| `sourceResolvers.unavailableDisposition` | enum string | `degraded` | 是 | defaults/file/env | startup 冻结 | non-sensitive | unsupported value fail-fast | Step 12 mapping input |
| `inboundConsumers.enabledNamespaces` | string list | `[]` in `local-dev`;P0 list elsewhere | 是 | defaults/file/env | startup 冻结 | non-sensitive | unknown namespace fail-fast | Step 14 worker binding |
| `inboundConsumers.sourceMode` | enum string | `disabled` in `local-dev`;`fixture_only` in `ci-test` | 是 | defaults/file/env/test fixture | startup 冻结 | non-sensitive | unsupported mode fail-fast | Step 14 inbound source binding |
| `inboundConsumers.supportedSchemaVersion` | string | `v1` | 是 | defaults/file/env | startup 冻结 | non-sensitive | unknown version rule fail-fast | Step 14 schema allowlist |
| `relay.publisherAdapterRef` | string ref | `publisher:fake` | 是 | defaults/file/env | startup 冻结 | ref-sensitive when transport-backed | missing/invalid fail-fast | `ArtifactRuntimeConfig.relay_publisher_ref` |
| `relay.publishBatchSize` | positive integer | `50` | 是 | defaults/file/env/job-local where allowed | startup default;job-run-start 冻结 | non-sensitive | invalid reject/fail-fast | `ArtifactRelayConfig.publish_batch_size` |
| `relay.publishRetryPolicyRef` | string ref | `retry:relay:p0` | 是 | defaults/file/env | startup/job-run-start | non-sensitive | invalid ref fail-fast | `ArtifactRelayConfig.publish_retry_policy` |
| `relay.transportTopicBindings` | object map | core event keys mapped to fake routes | enabled topics 必填 | defaults/file/env | startup 冻结 | route ref-sensitive | missing enabled key fail-fast | `ArtifactRelayConfig.transport_topic_bindings` |
| `jobs.defaultBatchSize` | positive integer | `50` | 是 | defaults/file/env/job-local where allowed | startup default;job-run-start 冻结 | non-sensitive | invalid reject/fail-fast | `ArtifactJobConfig.default_batch_size` |
| `jobs.maxParallelism` | positive integer | `1` | 是 | defaults/file/env | startup/job-run-start | non-sensitive | invalid fail-fast | `ArtifactJobConfig.max_parallelism` |
| `jobs.retryPolicyRef` | string ref | `retry:jobs:p0` | 是 | defaults/file/env | startup/job-run-start | non-sensitive | invalid ref fail-fast | `ArtifactJobConfig.retry_policy` |
| `jobs.jobTimeoutSeconds` | positive integer | `300` | 是 | defaults/file/env | startup/job-run-start | non-sensitive | invalid reject/fail-fast | `ArtifactJobConfig.job_timeout` |
| `handoff.archiveTargets` | string ref list | `[\"target:archive:fake\"]` | enabled 时必填 | defaults/file/env/job-local target selector | startup target registry;job-run-start selection | ref-sensitive | missing reject/fail-fast | `ArtifactHandoffConfig.archive_targets` |
| `handoff.observabilityTargets` | string ref list | `[\"target:observability:fake\"]` | enabled 时必填 | defaults/file/env/job-local target selector | startup target registry;job-run-start selection | ref-sensitive | missing reject/fail-fast | `ArtifactHandoffConfig.observability_targets` |
| `handoff.syncTargets` | string ref list | `[\"target:sync:fake\"]` | enabled 时必填 | defaults/file/env/job-local target selector | startup target registry;job-run-start selection | ref-sensitive | missing reject/fail-fast | `ArtifactHandoffConfig.sync_targets` |
| `handoff.emitTraceAvailableEventFromHandoff` | bool | `false` | 是 | defaults/file/env | startup 冻结 | non-sensitive | true without topic binding fail-fast | `ArtifactFeatureConfig.emit_trace_available_event_from_handoff` |
| `boundary.maxCommandBodyBytes` | positive integer | `1048576` | 是 | defaults/file/env | startup 冻结 | non-sensitive | invalid fail-fast | `ArtifactBoundaryConfig.max_command_body_bytes` |
| `boundary.maxPageLimit` | positive integer | `100` | 是 | defaults/file/env | startup 冻结 | non-sensitive | invalid fail-fast | `ArtifactBoundaryConfig.max_page_limit` |
| `boundary.queryReadTimeoutSeconds` | positive integer | `30` | 是 | defaults/file/env | startup 冻结 | non-sensitive | invalid fail-fast | `ArtifactBoundaryConfig.query_read_timeout` |
| `idempotency.commandRetentionSeconds` | integer seconds | `86400` | 是 | defaults/file/env | startup 冻结 | non-sensitive | below retry window fail-fast | `ArtifactIdempotencyConfig.command_retention` |
| `idempotency.eventDedupRetentionSeconds` | integer seconds | `86400` | 是 | defaults/file/env | startup 冻结 | non-sensitive | below redelivery window fail-fast | `ArtifactIdempotencyConfig.event_dedup_retention` |
| `idempotency.jobRetentionSeconds` | integer seconds | `604800` | 是 | defaults/file/env | startup 冻结 | non-sensitive | below replay/report window fail-fast | `ArtifactIdempotencyConfig.job_retention` |
| `idempotency.reservedRecordMaxAgeSeconds` | integer seconds | `3600` | 是 | defaults/file/env | startup 冻结 | non-sensitive | invalid fail-fast | `ArtifactIdempotencyConfig.reserved_record_max_age` |
| `projection.staleThresholdSeconds` | integer seconds | `300` | 是 | defaults/file/env | startup 冻结 | non-sensitive | invalid fail-fast | `ArtifactProjectionConfig.stale_threshold` |
| `projection.rebuildBatchSize` | positive integer | `50` | 是 | defaults/file/env/job-local where allowed | startup default;job-run-start 冻结 | non-sensitive | invalid reject/fail-fast | `ArtifactProjectionConfig.rebuild_batch_size` |
| `projection.derivedViewEventsEnabled` | bool | `false` | 是 | defaults/file/env | startup 冻结 | non-sensitive | true without topic binding fail-fast | `ArtifactFeatureConfig.derived_view_events_enabled` |
| `reference.staleThresholdSeconds` | integer seconds | `300` | 是 | defaults/file/env | startup 冻结 | non-sensitive | invalid fail-fast | `ArtifactReferenceConfig.stale_threshold` |
| `reference.refreshBatchSize` | positive integer | `50` | 是 | defaults/file/env/job-local where allowed | startup default;job-run-start 冻结 | non-sensitive | invalid reject/fail-fast | `ArtifactReferenceConfig.refresh_batch_size` |
| `redaction.denyFieldRefs` | string ref list | P0 forbidden body / secret field refs | 是 | defaults/file/env | startup 冻结 | security-critical | empty/unsafe fail-fast | Step 15 redaction guard |
| `redaction.safeDiagnosticRefPrefix` | string | `diag:artifact` | 是 | defaults/file/env | startup 冻结 | non-sensitive | invalid prefix fail-fast | Step 15 diagnostic refs |
| `redaction.allowHighCardinalityLabels` | bool | `false` | 是 | defaults/file/env | startup 冻结 | non-sensitive | true in P0 fail-fast | Step 15 metrics guard |
| `clockId.clockAdapterRef` | string ref | `clock:system` in local, `clock:deterministic` in CI | 是 | defaults/file/env/test fixture | startup 冻结 | non-sensitive | missing/invalid fail-fast | `ArtifactRuntimeConfig.clock_adapter_ref` |
| `clockId.idGeneratorRef` | string ref | `id:local-sequence` in local, `id:deterministic` in CI | 是 | defaults/file/env/test fixture | startup 冻结 | non-sensitive | missing/invalid fail-fast | `ArtifactRuntimeConfig.id_generator_ref` |
| `testFixtures.fixtureSetRef` | string ref | `fixture:artifact:p0` | `ci-test` 时必填 | test config/test env | test harness | ref-sensitive | missing test fail-fast | Step 16 fixture binding |
| `testFixtures.replayArtifactRootRef` | string ref | `null` | `operations-replay` 时必填 | replay config/env/job-local | job-run-start | ref-sensitive | missing replay reject | Step 16 replay evidence |
| `testFixtures.fixedClockInstant` | timestamp string | `2026-01-01T00:00:00Z` in deterministic tests | test-only | test fixture | test harness | non-sensitive | invalid test fail-fast | deterministic fake clock |

### 8.3 按配置域组织的配置项批次表

| 配置域 | 配置项 | 控制面 | 分类 | 来源规则 | 环境差异 | `03` 影响判定 |
|---|---|---|---|---|---|---|
| runtime | `runtime.profile`, `runtime.strictValidation` | runtime assembly / profile | startup runtime config;entry-local selector | defaults < file < env;entry-local 只选当前入口 | local/CI 默认 fake-friendly;integration/replay 使用 file/env | 无回写;承接 `ArtifactRuntimeConfig.profile_ref` |
| logical stores | `stores.truth.*`, `stores.projection.*`, `stores.reference.*`, `stores.relay.*`, `stores.idempotency.*` | store binding / transaction carrier | startup runtime config;sensitive ref config | defaults < file < env | P0 local/CI in-memory;integration-like 可 durable-like ref;prod-like future | 无回写;承接 5 类 store refs |
| source resolvers | `sourceResolvers.*` | inbound integration / source resolver | startup runtime config;test fixture config | defaults < file < env;fixture only test | local/CI fake;integration controlled;replay replay-backed | 无回写;formal field仍为 single resolver ref |
| inbound consumers | `inboundConsumers.*` | inbound integration / source resolver | startup runtime config;test fixture config | defaults < file < env | local 可 disabled;CI fixture-only;integration controlled | 无回写;承接 Step 14 worker binding |
| relay | `relay.*` | outbound publication / topic map | startup runtime config;job-run-start config | defaults < file < env;batch 可 job-local | local/CI fake route;integration controlled route | 无回写;topic-neutral key 不变 |
| jobs | `jobs.*` | operations jobs | startup runtime config;job-run-start config | defaults < file < env;job-local 只覆盖当前 run | CI deterministic;replay requires replay inputs | 无回写;承接 `ArtifactJobConfig` |
| handoff | `handoff.*` | handoff / target delivery | startup runtime config;sensitive ref config;job-run-start target | defaults < file < env;job-local target only | P0 fake targets;integration controlled target;prod-like future | 无回写;target ref 不保存正文 |
| boundary | `boundary.*` | boundary limits / read surface | startup runtime config | defaults < file < env | all profiles valid;entry-local 不绕过 | 无回写;handler/query guard 参数 |
| idempotency | `idempotency.*` | idempotency / stored surface | startup runtime config;technical knobs | defaults < file < env | replay must cover report/result retention | 无回写;承接 Step 13 duplicate replay |
| projection | `projection.*` | projection rebuild / derived events | startup runtime config;job-run-start config | defaults < file < env;batch 可 job-local | replay validates rebuild;local optional | 无回写;derived event feature only |
| reference | `reference.*` | reference refresh | startup runtime config;job-run-start config | defaults < file < env;batch 可 job-local | replay validates refresh | 无回写;不反写真相 |
| redaction | `redaction.*` | observability / redaction | diagnostic / redaction config | defaults < file < env | all profiles must keep deny list | 无回写;承接 Step 15 safe output |
| clock/id | `clockId.*` | clock / id / deterministic test | startup runtime config;test fixture config | defaults < file < env;fixture only test | CI deterministic;local system/local-sequence;integration controlled | 无回写;承接 Clock/Id ports |
| fixtures/replay | `testFixtures.*` | test harness / replay | test fixture / deterministic config | test config/test env/job-local | CI fixture required;replay root required in operations-replay | 无回写;prod-like reject fixture |

### 8.4 Jobs entry-local 参数 schema

Jobs crate binaries 使用 Step 14 已闭口的本地参数层。它只选择当前 config/profile、request source 和本地 artifact/report 输出根,不得重定义 job protocol metadata。

| 参数 | CLI flag | Env key | 默认 / 缺失处理 | 适用 binary | DTO 承载边界 |
|---|---|---|---|---|---|
| config source selector | `--config <path>` | `ARTIFACT_CONFIG` | 缺失使用默认 config discovery;flag/env 冲突 rejected | all jobs bins | `ArtifactJobsEntryLocalArgs.configPath` |
| profile selector | `--profile <profile>` | `ARTIFACT_PROFILE` | 缺失使用 config/default profile;unknown profile rejected | all jobs bins | `ArtifactJobsEntryLocalArgs.profile` |
| job request file | `--job-request <path>` | `ARTIFACT_JOB_REQUEST` | 与 stdin source 二选一 | all jobs bins | `ArtifactJobsEntryRequestSource::File`;full `ArtifactJobRequest<T>` |
| job request stdin | `--job-request-stdin` | `ARTIFACT_JOB_REQUEST_STDIN=true` | 与 file source 二选一 | all jobs bins | `ArtifactJobsEntryRequestSource::Stdin`;full `ArtifactJobRequest<T>` |
| artifact output root | `--artifact-root <path>` | `ARTIFACT_ARTIFACT_ROOT` | default `artifacts/test/<run_id>` | all jobs bins | local artifact writer only |
| report output root | `--report-root <path>` | `ARTIFACT_REPORT_ROOT` | default `reports/runs/<run_id>` | all jobs bins | local report writer only |
| dry-run diagnostics | `--dry-run-diagnostics` | `ARTIFACT_JOB_DRY_RUN_DIAGNOSTICS=true` | default `false`;true 时只做校验和诊断输出 | all jobs bins | local diagnostic selector |

约束:

- 不新增 `--run-id`、`--idempotency-key`、`--actor-ref`、`--trace-id`、`--scope`、`--target` 同义 flag;这些 protocol metadata/input 只来自 `ArtifactJobRequest<T>`。
- env 只承载 selector、path 或 boolean,不得承载完整 job input body。
- `artifact_root` / `report_root` 不写入 stored result、job report 或 domain truth。

### 8.5 核心模块 JSON demo

`runtime`、`stores`、`sourceResolvers`、`inboundConsumers` 模块示例:

```json
{
  "runtime": {
    "profile": "local-dev",
    "strictValidation": true
  },
  "stores": {
    "truth": { "kind": "in_memory", "configRef": "store:truth:memory" },
    "projection": { "kind": "in_memory", "configRef": "store:projection:memory" },
    "reference": { "kind": "in_memory", "configRef": "store:reference:memory" },
    "relay": { "kind": "in_memory", "configRef": "store:relay:memory" },
    "idempotency": { "kind": "in_memory", "configRef": "store:idempotency:memory" }
  },
  "sourceResolvers": {
    "adapterRef": "resolver:artifact:fake",
    "mode": "fake",
    "unavailableDisposition": "degraded"
  },
  "inboundConsumers": {
    "enabledNamespaces": [],
    "sourceMode": "disabled",
    "supportedSchemaVersion": "v1"
  }
}
```

### 8.6 Relay / jobs / handoff JSON demo

```json
{
  "relay": {
    "publisherAdapterRef": "publisher:fake",
    "publishBatchSize": 50,
    "publishRetryPolicyRef": "retry:relay:p0",
    "transportTopicBindings": {
      "artifact.fact.changed": "route:relay:artifact-fact",
      "artifact.version.changed": "route:relay:artifact-version",
      "artifact.lineage.changed": "route:relay:artifact-lineage",
      "artifact.baseline.changed": "route:relay:artifact-baseline",
      "artifact.review.changed": "route:relay:artifact-review",
      "artifact.consumable.changed": "route:relay:artifact-consumable"
    }
  },
  "jobs": {
    "defaultBatchSize": 50,
    "maxParallelism": 1,
    "retryPolicyRef": "retry:jobs:p0",
    "jobTimeoutSeconds": 300
  },
  "handoff": {
    "archiveTargets": ["target:archive:fake"],
    "observabilityTargets": ["target:observability:fake"],
    "syncTargets": ["target:sync:fake"],
    "emitTraceAvailableEventFromHandoff": false
  }
}
```

### 8.7 Boundary / maintenance / redaction / clockId / fixtures JSON demo

```json
{
  "boundary": {
    "maxCommandBodyBytes": 1048576,
    "maxPageLimit": 100,
    "queryReadTimeoutSeconds": 30
  },
  "idempotency": {
    "commandRetentionSeconds": 86400,
    "eventDedupRetentionSeconds": 86400,
    "jobRetentionSeconds": 604800,
    "reservedRecordMaxAgeSeconds": 3600
  },
  "projection": {
    "staleThresholdSeconds": 300,
    "rebuildBatchSize": 50,
    "derivedViewEventsEnabled": false
  },
  "reference": {
    "staleThresholdSeconds": 300,
    "refreshBatchSize": 50
  },
  "redaction": {
    "denyFieldRefs": [
      "field:artifact:raw-body",
      "field:artifact:secret-ref"
    ],
    "safeDiagnosticRefPrefix": "diag:artifact",
    "allowHighCardinalityLabels": false
  },
  "clockId": {
    "clockAdapterRef": "clock:system",
    "idGeneratorRef": "id:local-sequence"
  },
  "testFixtures": {
    "fixtureSetRef": "fixture:artifact:p0",
    "replayArtifactRootRef": null,
    "fixedClockInstant": "2026-01-01T00:00:00Z"
  }
}
```

### 8.8 完整 JSONC 文档示例

下例只用于文档展示。实际运行配置必须删除注释并使用严格 JSON。

```jsonc
{
  "runtime": {
    "profile": "ci-test",
    "strictValidation": true
  },
  "stores": {
    "truth": { "kind": "in_memory", "configRef": "store:truth:memory" },
    "projection": { "kind": "in_memory", "configRef": "store:projection:memory" },
    "reference": { "kind": "in_memory", "configRef": "store:reference:memory" },
    "relay": { "kind": "in_memory", "configRef": "store:relay:memory" },
    "idempotency": { "kind": "in_memory", "configRef": "store:idempotency:memory" }
  },
  "sourceResolvers": {
    "adapterRef": "resolver:artifact:fake",
    "mode": "fake",
    "unavailableDisposition": "degraded"
  },
  "inboundConsumers": {
    "enabledNamespaces": [
      "work",
      "process",
      "governance",
      "method-library",
      "runtime",
      "external-content"
    ],
    "sourceMode": "fixture_only",
    "supportedSchemaVersion": "v1"
  },
  "relay": {
    "publisherAdapterRef": "publisher:fake",
    "publishBatchSize": 50,
    "publishRetryPolicyRef": "retry:relay:p0",
    "transportTopicBindings": {
      "artifact.fact.changed": "route:relay:artifact-fact",
      "artifact.version.changed": "route:relay:artifact-version",
      "artifact.lineage.changed": "route:relay:artifact-lineage",
      "artifact.baseline.changed": "route:relay:artifact-baseline",
      "artifact.review.changed": "route:relay:artifact-review",
      "artifact.consumable.changed": "route:relay:artifact-consumable"
    }
  },
  "jobs": {
    "defaultBatchSize": 50,
    "maxParallelism": 1,
    "retryPolicyRef": "retry:jobs:p0",
    "jobTimeoutSeconds": 300
  },
  "handoff": {
    "archiveTargets": ["target:archive:fake"],
    "observabilityTargets": ["target:observability:fake"],
    "syncTargets": ["target:sync:fake"],
    "emitTraceAvailableEventFromHandoff": false
  },
  "boundary": {
    "maxCommandBodyBytes": 1048576,
    "maxPageLimit": 100,
    "queryReadTimeoutSeconds": 30
  },
  "idempotency": {
    "commandRetentionSeconds": 86400,
    "eventDedupRetentionSeconds": 86400,
    "jobRetentionSeconds": 604800,
    "reservedRecordMaxAgeSeconds": 3600
  },
  "projection": {
    "staleThresholdSeconds": 300,
    "rebuildBatchSize": 50,
    "derivedViewEventsEnabled": false
  },
  "reference": {
    "staleThresholdSeconds": 300,
    "refreshBatchSize": 50
  },
  "redaction": {
    "denyFieldRefs": ["field:artifact:raw-body", "field:artifact:secret-ref"],
    "safeDiagnosticRefPrefix": "diag:artifact",
    "allowHighCardinalityLabels": false
  },
  "clockId": {
    "clockAdapterRef": "clock:deterministic",
    "idGeneratorRef": "id:deterministic"
  },
  "testFixtures": {
    "fixtureSetRef": "fixture:artifact:p0",
    "replayArtifactRootRef": null,
    "fixedClockInstant": "2026-01-01T00:00:00Z"
  }
}
```

### 8.9 配置域停审记录

| 配置域 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| runtime | profile/defaults/strict validation 是否闭口 | 通过 | `configRef` 仍为 loader 生成,不作为文件输入 |
| stores | 5 类 logical store 是否都显式出现 | 通过 | durable product 留 Step 13 / 14 |
| sourceResolvers | 是否只给 ref/mode,不引入 sibling Cargo dependency | 通过 | family-specific endpoint 细节留 Step 8/13 |
| inboundConsumers | 是否只控制 source mode/schema allowlist | 通过 | namespace 枚举正文留测试/实施承接 |
| relay | topic binding 是否完整且不改 event schema | 通过 | optional topics 在 feature enabled 时再补 |
| jobs | 是否只给 runner 参数,不改 protocol metadata | 通过 | enabledKinds 目前从 profile/部署侧承接,暂不单列 |
| handoff | target refs 是否 body-free | 通过 | target product 细节留后续 |
| boundary | 是否不绕过 auth/visibility/idempotency | 通过 | 仅拒绝或截断 |
| idempotency | retention 是否有失败策略 | 通过 | 具体窗口调优留后续 |
| projection/reference | rebuild/refresh 是否不反写真相 | 通过 | only batch/threshold/events fields |
| redaction | deny list / diagnostics 是否不放宽安全边界 | 通过 | Step 8 继续收口敏感配置 |
| clockId/testFixtures | deterministic 口径是否只进 test/replay | 通过 | production-like 禁 fixture |

### 8.10 跨配置项闭环审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在重复字段在多个模块表达同一语义 | 无 | profile 与 mode 已分离 |
| 是否存在必填字段没有失败策略 | 无 | 每项均标注 fail-fast / reject |
| 是否存在 raw secret / raw body 字段 | 无 | 只允许 refs / scalars |
| 是否存在用 profile 改写领域不变量的字段 | 无 | profile 仅做环境组合 |
| 是否存在 topic binding 改 event schema 的字段 | 无 | only route mapping |
| 是否存在 entry-local/job-local 越权字段 | 无 | 只保留 selector/path/root |
| 是否需要回写 `03` | 未发现 | 当前只定义 loader-facing schema 和 defaults |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 本地 JSON 模块拆为 `runtime`、`stores`、`sourceResolvers`、`inboundConsumers`、`relay`、`jobs`、`handoff`、`boundary`、`idempotency`、`projection`、`reference`、`redaction`、`clockId`、`testFixtures` | 否 | 文件结构 / loader-facing schema | 不适用 | 无回写 |
| stores/sourceResolvers/relay 等模块字段折叠为 Step 14 formal refs 和 scalars | 否 | binding 映射澄清 | 不适用 | 无回写 |
| jobs entry-local 参数继续使用 Step 14 既有 flags/env | 否 | 入口约束重申 | 不适用 | 无回写 |
| 若未来需要 remote config、真实 secret-provider fields、dynamic adapter replacement 或 product-specific endpoint schema | 是 | runtime loader / builder / secret contract 变更 | `03` §13 / Step 14 | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_07_config_items.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“配置项总表”“按配置域组织的配置项批次表”“Jobs entry-local 参数 schema”“模块 JSON demo”“完整 JSONC 文档示例”“配置域停审记录”和“跨配置项闭环审计表”小节,了解配置项如何从 Step 3~6 和 Step 14 binding 收敛。

正式 `04-配置设计.md` §7 应回填:

- 配置项命名和组织规则。
- 配置项总表。
- 按配置域组织的配置项批次表。
- jobs entry-local 参数 schema。
- 模块级 JSON demo。
- 完整 JSONC 文档示例。
- 配置域停审记录。
- 跨配置项闭环审计表。
- 对详细设计的影响判定。

回填要求:

- 不得在正式正文中引入未在本 Step 出现的新字段。
- 不得把完整 JSONC 示例当成可直接运行的配置文件。
- 不得让模块拆分退化为 `misc`、`common`、`storage` 等泛化桶。
- 不得引入 raw secret、raw body、product-specific endpoint fields。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| `integration-like` controlled seam 的具体 ref 命名约定 | 影响 Step 8 / Step 13 | 后续定义 |
| `operations-replay` 的 replay artifact root 是否需要更细分为 trace/report/outbox roots | 影响 Step 12 承接 | 后续定义 |
| optional relay topics 是否在 P0 开启 | 影响 relay topic bindings | Step 11 / Step 12 再定 |
| `inboundConsumers.enabledNamespaces` 的正式枚举表是否进入实现仓 contracts docs | 影响测试 / 实施承接 | Step 12 再定 |
| `staging-like` / `production-like` durable refs 的具体产品选择 | 影响 Step 13 / Step 14 | 后续记录为演进风险 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 字段级配置项已定义 | 通过 | 见 §8.2 |
| 配置项已映射到配置域和 formal binding | 通过 | 见 §8.2 / §8.3 |
| jobs entry-local schema 已记录 | 通过 | 见 §8.4 |
| 模块 JSON demo 和完整示例已给出 | 通过 | 见 §8.5 ~ §8.8 |
| 配置域停审和跨配置项审计已完成 | 通过 | 见 §8.9 / §8.10 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 8 | 通过 | 下一步定义敏感配置与密钥管理 |
