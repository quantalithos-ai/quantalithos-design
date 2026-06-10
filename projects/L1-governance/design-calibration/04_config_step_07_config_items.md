# Step 7. 定义配置项清单

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 7
> 回填章节: `04-配置设计.md` §7 配置项清单

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 定义配置项清单 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 3 控制面;Step 4 分类边界;Step 5 来源优先级;Step 6 profile 矩阵;详细设计 Step 14 配置绑定 |
| 输出文件 | `projects/L1-governance/design-calibration/04_config_step_07_config_items.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 8 |

## 2. 本步目标

本 Step 把 `L1-governance` P0 配置项整理成可实现、可校验、可测试的正式清单。

本 Step 只回答:

- 每个 P0 配置项的名称、类型、默认值、必填性、来源、作用域、生效方式、敏感级别、失败策略和关联模块。
- 每个配置项属于哪个配置域、控制面、配置分类、来源规则和 profile 差异。
- 配置文件应按哪些功能模块组织,不得把不同功能揉进 `storage`、`common`、`misc`、`runtime` 等泛化模块。
- 每个功能模块严格 JSON demo 怎么写。
- 完整 JSONC 文档示例如何展示,以及实际运行 JSON 必须删除注释的警告。
- 每个配置域是否完成停审,跨配置项是否存在重复、敏感级别遗漏、必填无失败策略或 `03` 回写缺口。

本 Step 不定义:

- secret provider 的真实读取、轮换、审计和明文禁止输出细节,这些留给 Step 8。
- config loader / validator 的函数流程、error enum 和 runtime builder 生效机制,这些留给 Step 9。
- 配置变更审计、回滚、失效模式和降级策略,这些留给 Step 10 / Step 11。
- 部署命令、容器挂载、真实 DB / bus / search / secret provider 产品、cron 表达式和生产 runbook。
- 正式 `04-配置设计.md` 装配;正式文档必须等 Step 15。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | 已完成 | 提供配置控制面和配置域 / 功能模块 |
| `04_config_step_04_categories_boundaries.md` | 已完成 | 提供 startup、job-run-start、entry-local、sensitive、diagnostic 和禁止配置化边界 |
| `04_config_step_05_sources_priority_conflicts.md` | 已完成 | 提供 `defaults < file < env` 来源优先级、冲突处理和 secret ref 边界 |
| `04_config_step_06_environment_profiles_matrix.md` | 已完成 | 提供 `local-dev`、`ci-test`、`integration-like`、`operations-replay` profile 差异 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供 `GovernanceRuntimeConfig` 字段、config section、adapter binding 和 topic binding |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供 runtime config、adapter availability、job registry 和 infra state refs |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 store、resolver、publisher、handoff、external GRC、adapter registry、Clock / IdGenerator port |
| `03-详细设计.md` §13 | 已完成 | 提供正式配置引用与外部依赖绑定约束 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 配置项的名称、类型、默认值是什么? | 本 Step 将 P0 配置项按 10 个功能域展开:runtime profile、store binding、external resolvers、inbound consumers、outbox publisher/topic、operations jobs、handoff/archive/external GRC、redaction/boundary、idempotency/projection/reference、clock/id/test fixtures。字段名采用项目本地 JSON 模块名,不重复 `governance` 前缀。 |
| 哪些配置项必填? | core startup runtime 必填项包括 profile、config identity、5 类 logical store、publisher adapter、clock/id adapter、boundary limits、idempotency retention、redaction policy、必需 topic map。可选外围项包括 external GRC、trace available event、derived view event和特定 handoff target;一旦 enabled,对应 target/topic/adapter ref 变为必填。 |
| 每个配置项从哪里来、作用域是什么? | 普通项来源遵守 Step 5 `defaults < config file < env`;entry-local 只用于当前 entry/job 的 profile 或 run input;test fixture 只用于 local/CI。作用域分为 startup runtime、job-run-start、entry-local 和 test harness。 |
| 每个配置项如何生效、是否敏感、失败策略是什么? | P0 无核心 hot update。startup 项在 runtime builder 前校验并冻结;job-run-start 项在 job report/receipt 中固化;entry-local 只影响当前入口。敏感项在本 Step 只允许保存 ref,raw secret/body 由 Step 8 收口。必填缺失或非法必须 fail-fast 或 reject 当前 job。 |
| 每个配置项关联哪些模块? | 每个配置项回指 `infra::config`、`infra::runtime_builder`、具体 store / adapter、`api`、`worker`、`jobs` 或 application typed policy 参数。`domain` 和 `contracts` 不读取配置。 |
| 每个模块的 JSON demo 应该如何写? | 本 Step §8.5~§8.14 按功能模块给出严格 JSON demo,不含注释,可作为 loader schema 的结构参考。 |
| 模块拆分是否按功能边界展开? | 是。模块按 runtime、stores、externalResolvers、inboundConsumers、outbox、jobs、handoff、externalGrc、redaction、boundary、clockId、testFixtures 拆分;不使用 `common` / `misc` / 泛化 `storage` 容器混写无关项。 |
| 项目本地配置是否避免重复项目名前缀? | 是。项目本地配置文件顶层不强制写 `governance.runtime`。若未来系统级聚合配置需要统一文件,再映射为 `governance.runtime.profile` 等聚合路径。 |
| 完整配置 demo 是否需要文档注释? | 完整示例使用 JSONC,只用于文档说明;实际运行配置必须删除注释并使用严格 JSON。模块级 demo 一律使用严格 JSON。 |
| 每个配置项是否回指 Step 3~6 和详细设计影响判定? | 是。§8.3 配置域批次表回指控制面、分类、来源规则、环境差异和 `03` 影响判定。 |
| 每个配置域配置项完成后是否通过停审? | 已通过。§8.16 记录每个配置域停审结论。 |
| 所有配置项完成后是否存在重复项、泛化模块混写、必填无失败策略、敏感级别未归类或 03 影响未判定? | 已完成跨配置项闭环审计。当前未发现 unresolved 冲突;若后续要引入真实产品、secret provider、remote config center 或 hot reload,进入 Step 13/14 风险与 `03` 回写。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 3 配置域 | 已拆控制面,但未形成字段级配置项 | 本 Step 按配置域展开 P0 字段表 |
| Step 4 分类边界 | 已说明 startup / job-run-start / entry-local,但未映射到具体字段 | 本 Step 每项写作用域和生效方式 |
| Step 5 来源规则 | 已定义来源优先级,但未给配置项来源 | 本 Step 每项标注允许来源和失败策略 |
| Step 6 profile 矩阵 | 已定义 profile,但未给每个 profile 的配置结构 | 本 Step 给 profile 可用的 store/adapter/job/fixture 配置项 |
| 详细设计 Step 14 | 给出 config section 和代码绑定点,但缺少文件结构、默认值和示例 | 本 Step 正式给配置项清单和 JSON demo |
| 正式 `04` | 当前尚不存在 | 本 Step 只生成中间产物,正式文档等 Step 15 装配 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置项粒度 | 只有 config section / binding point | 字段级配置项含类型、默认、必填、来源、作用域、敏感级别和失败策略 | 实现、测试、验收需要可校验字段 |
| 模块组织 | 只有 runtime / adapter 概念 | 按功能模块组织 JSON: runtime、stores、externalResolvers、inboundConsumers、outbox、jobs、handoff、externalGrc、redaction、boundary、clockId、testFixtures | 避免泛化配置桶 |
| profile 默认值 | Step 6 仅给 profile 用途 | 配置项默认值明确指向 `local-dev` / `ci-test` / `integration-like` / `operations-replay` 的 P0 fake / in-memory / replay 口径 | 支撑 loader default 和 CI fixture |
| sensitive refs | 只规定 raw secret 禁止 | 字段级标注 sensitive ref / non-sensitive / redacted issue ref | Step 8 可以承接 |
| JSON demo | 尚无 | 模块级严格 JSON demo + 完整 JSONC 文档示例 | 支撑配置设计书写规范和实现 schema |
| `03` 影响 | Step 14 不写具体 key | 本 Step 不新增 runtime object / port;只为既有绑定点命名和定默认 | 当前无回写 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 顶层是否加 `governance` 前缀 | A. 项目本地也加 `governance`;B. 项目本地不重复前缀,系统聚合另行映射 | 采用 B。SOP 要求项目本地配置避免重复项目前缀 |
| store 是否统一放进 `storage` | A. 全部放 `storage`;B. 用 `stores` 但按 logical store 明确子项 | 采用 B。store 是一个功能域,但必须保留 truth/projection/reference/outbox/idempotency 五类 logical store |
| adapter kind 是否引入产品枚举 | A. 写 PostgreSQL/NATS/Redis 等具体产品;B. 写 `in_memory` / `fake` / `controlled` / `disabled` / future `durable_ref` 语义 | 采用 B。P0 不锁产品,真实产品留 ADR / P1/P2 |
| retry / timeout 默认数值是否精确到生产建议 | A. 给生产 sizing;B. 给 P0 deterministic defaults 和校验范围 | 采用 B。生产 sizing 属部署运维和 P1/P2 |
| external GRC 默认是否启用 | A. 默认启用;B. 默认 disabled | 采用 B。external GRC 不定义 Governance truth,且 P0 产品未锁定 |
| feature event 默认是否全开 | A. 所有 outbound feature 默认开;B. core truth outbound topic 必填,外围 trace / derived view event 默认关闭或显式启用 | 采用 B。避免 topic 缺失阻塞核心 P0 |

## 8. 结构化中间产物

### 8.1 配置项命名和组织规则

| 规则 | 结论 |
|---|---|
| 配置文件格式 | 默认严格 JSON;完整文档示例可使用 JSONC,但运行时必须删除注释 |
| 顶层命名 | 项目本地文件不重复 `governance` 前缀 |
| 系统聚合映射 | 若未来统一聚合配置,映射为 `governance.<module>.<setting>`;本 Step 不要求实现聚合 loader |
| 模块拆分 | 按功能域: `runtime`、`stores`、`externalResolvers`、`inboundConsumers`、`outbox`、`jobs`、`handoff`、`externalGrc`、`redaction`、`boundary`、`clockId`、`testFixtures` |
| 字段风格 | JSON 使用 lowerCamelCase;typed ref 值使用 opaque string ref |
| 敏感字段 | 字段只能保存 `*Ref`;不得保存 raw secret、token、URL credential、SQL、HTTP body、external payload body |
| 默认值策略 | P0 defaults 支撑 local-dev/ci-test;integration-like 和 operations-replay 通过 file/env/job input 补 ref |
| 失败策略 | startup invalid fail-fast;job invalid rejected;entry-local invalid reject current entry;fixture invalid test fail-fast |

### 8.2 配置项总表

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `runtime.profile` | string ref | `local-dev` | 是 | defaults/file/env/entry-local selector | startup / entry-local selector | startup 冻结;entry-local 只选当前入口 | non-sensitive | unknown profile fail-fast | `infra::config`, `runtime_builder`, `api`, `worker`, `jobs` |
| `runtime.configRef` | string ref or generated | generated from validated config digest | 是 | generated by loader | startup | validation 后生成 | redacted identity | validation issue fail-fast | `infra::config` |
| `runtime.adapterMode` | enum string | `fake` for local/CI | 是 | defaults/file/env | startup | builder assembly 前冻结 | non-sensitive | unsupported mode fail-fast | `infra::runtime_builder` |
| `runtime.strictValidation` | bool | `true` | 是 | defaults/file/env | startup | validator 执行 | non-sensitive | false in P0 fail-fast | `infra::config` |
| `stores.truth.kind` | enum string | `in_memory` | 是 | defaults/file/env | startup | builder 创建 repository 前冻结 | non-sensitive | missing/unsupported fail-fast | `infra::repositories`, UoW |
| `stores.truth.configRef` | string ref | `store:truth:memory` | 是 | defaults/file/env | startup | builder 解析 ref | sensitive-ref when durable | invalid ref fail-fast | truth repositories |
| `stores.projection.kind` | enum string | `in_memory` | 是 | defaults/file/env | startup | builder 创建 projection store 前冻结 | non-sensitive | missing/unsupported fail-fast | `infra::projection_stores` |
| `stores.projection.configRef` | string ref | `store:projection:memory` | 是 | defaults/file/env | startup | builder 解析 ref | sensitive-ref when durable | invalid ref fail-fast | projection repository |
| `stores.reference.kind` | enum string | `in_memory` | 是 | defaults/file/env | startup | builder 创建 reference store 前冻结 | non-sensitive | missing/unsupported fail-fast | `infra::reference_stores` |
| `stores.reference.configRef` | string ref | `store:reference:memory` | 是 | defaults/file/env | startup | builder 解析 ref | sensitive-ref when durable | invalid ref fail-fast | reference snapshot repository |
| `stores.outbox.kind` | enum string | `in_memory` | 是 | defaults/file/env | startup | builder 创建 outbox store 前冻结 | non-sensitive | missing/unsupported fail-fast | `infra::outbox_store` |
| `stores.outbox.configRef` | string ref | `store:outbox:memory` | 是 | defaults/file/env | startup | builder 解析 ref | sensitive-ref when durable | invalid ref fail-fast | outbox repository |
| `stores.idempotency.kind` | enum string | `in_memory` | 是 | defaults/file/env | startup | builder 创建 idempotency/result store 前冻结 | non-sensitive | missing/unsupported fail-fast | idempotency/result repositories |
| `stores.idempotency.configRef` | string ref | `store:idempotency:memory` | 是 | defaults/file/env | startup | builder 解析 ref | sensitive-ref when durable | invalid ref fail-fast | idempotency/result repositories |
| `externalResolvers.families[].family` | enum string | all P0 families present as fake | 是 | defaults/file/env/test fixture | startup | resolver registry assembly | non-sensitive | missing required family fail-fast | `infra::source_resolvers` |
| `externalResolvers.families[].adapterRef` | string ref | `resolver:<family>:fake` | 是 | defaults/file/env | startup | builder 注入 resolver | sensitive-ref when endpoint-backed | invalid ref fail-fast | `ExternalGovernanceSourceResolverPort` |
| `externalResolvers.families[].mode` | enum string | `fake` | 是 | defaults/file/env/test fixture | startup | resolver behavior frozen | non-sensitive | production-like fake rejected | resolver adapters |
| `externalResolvers.families[].unavailableDisposition` | enum string | `degraded` | 是 | defaults/file/env | startup | application error mapping uses typed parameter | non-sensitive | unsupported value fail-fast | resolver wrappers, query degraded |
| `inboundConsumers.enabled` | bool | `true` in CI/integration;`false` in local unless worker runs | 是 | defaults/file/env | startup | worker consumer registration | non-sensitive | invalid worker profile fail-fast | `worker::consumers` |
| `inboundConsumers.namespaces[]` | string refs | required P0 namespaces | 是 when `enabled=true` | defaults/file/env | startup | consumer registry assembly | non-sensitive | missing namespace fail-fast | worker consumers |
| `inboundConsumers.supportedSchemaVersion` | string | `v1` | 是 | defaults/file/env | startup | envelope validation | non-sensitive | unsupported version rejected/dead-letter | inbound event handler |
| `inboundConsumers.dedupRetentionSeconds` | integer seconds | `86400` | 是 | defaults/file/env | startup | idempotency retention guard | non-sensitive | below redelivery window fail-fast | idempotency store, worker |
| `outbox.publisher.adapterRef` | string ref | `publisher:fake` | 是 | defaults/file/env | startup | builder 注入 publisher | sensitive-ref when endpoint-backed | missing fail-fast | `GovernanceOutboxPublisherPort` |
| `outbox.publisher.mode` | enum string | `fake` | 是 | defaults/file/env/test fixture | startup | publisher behavior frozen | non-sensitive | production-like fake rejected | `infra::publishers` |
| `outbox.publishBatchSize` | positive integer | `50` | 是 | defaults/file/env/job input when allowed | startup default / job-run-start | frozen per run | non-sensitive | out of range reject/fail-fast | worker publish loop, jobs |
| `outbox.publishRetryPolicyRef` | string ref | `retry:outbox:p0` | 是 | defaults/file/env | startup / job-run-start | retry wrapper reads ref | non-sensitive | invalid ref fail-fast/reject job | outbox service |
| `outbox.transportTopicBindings` | object map | core event keys mapped to fake routes | 是 for enabled event kinds | defaults/file/env | startup | publisher route map frozen | sensitive-ref if route carries credentials | missing enabled key fail-fast | publisher adapter |
| `outbox.deadLetterAfterAttempts` | positive integer | `3` | 是 | defaults/file/env | startup / job-run-start | publish item policy | non-sensitive | less than 1 fail-fast | outbox publisher/job |
| `jobs.enabledKinds[]` | enum list | all P0 job kinds enabled except external GRC export | 是 | defaults/file/env | startup | jobs registry assembly | non-sensitive | unknown kind fail-fast | `jobs`, worker |
| `jobs.defaultBatchSize` | positive integer | `50` | 是 | defaults/file/env/job input when allowed | startup default / job-run-start | frozen per job | non-sensitive | out of range reject/fail-fast | job runners |
| `jobs.maxParallelism` | positive integer | `1` | 是 | defaults/file/env | startup / job-run-start | runner concurrency cap | non-sensitive | greater than P0 cap fail-fast unless profile permits | worker/jobs |
| `jobs.jobTimeoutSeconds` | positive integer | `300` | 是 | defaults/file/env | startup / job-run-start | frozen per job | non-sensitive | out of range reject/fail-fast | job runners |
| `jobs.retryPolicyRef` | string ref | `retry:jobs:p0` | 是 | defaults/file/env | startup / job-run-start | retry wrapper reads ref | non-sensitive | invalid ref fail-fast/reject job | job service |
| `jobs.reportRetentionSeconds` | integer seconds | `604800` | 是 | defaults/file/env | startup | stored report cleanup guard | non-sensitive | less than idempotency retention fail-fast | result store |
| `handoff.traceTargets[]` | target refs | `target:trace:fake` | 是 when trace handoff job enabled | defaults/file/env/job input | startup target registry / job-run-start target | ref-sensitive | target missing reject job | handoff adapter |
| `handoff.archiveTargets[]` | target refs | `target:archive:fake` | 是 when archive handoff job enabled | defaults/file/env/job input | startup target registry / job-run-start target | ref-sensitive | target missing reject job | archive adapter |
| `handoff.emitTraceAvailableEvent` | bool | `false` | 是 | defaults/file/env | startup | controls optional outbox append | non-sensitive | true without topic binding fail-fast | handoff job/outbox |
| `handoff.handoffRetryPolicyRef` | string ref | `retry:handoff:p0` | 是 | defaults/file/env | startup / job-run-start | handoff retry wrapper | non-sensitive | invalid ref reject/fail-fast | handoff service |
| `externalGrc.enabled` | bool | `false` | 是 | defaults/file/env | startup | external export registration | non-sensitive | true without adapter/target fail-fast | external GRC adapter/jobs |
| `externalGrc.adapterRef` | optional string ref | `null` | 必填 only when enabled | defaults/file/env | startup | builder 注入 export port | sensitive-ref | enabled missing fail-fast | `ExternalGrcExportPort` |
| `externalGrc.targetRef` | optional string ref | `null` | 必填 only when enabled | defaults/file/env/job input | startup / job-run-start | export target validation | ref-sensitive | missing reject/fail-fast | external GRC export job |
| `externalGrc.exportBatchSize` | positive integer | `25` | 是 when enabled | defaults/file/env/job input | job-run-start | frozen per export job | non-sensitive | invalid reject job | export job |
| `redaction.denyFieldRefs[]` | string refs | P0 forbidden body/secret field refs | 是 | defaults/file/env | startup | validator and logger use frozen refs | security-critical | empty fail-fast | log/metric/audit/trace hooks |
| `redaction.safeDiagnosticRefPrefix` | string | `diag:governance` | 是 | defaults/file/env | startup | diagnostic ref generator prefix | non-sensitive | invalid prefix fail-fast | infra errors, reports |
| `redaction.allowHighCardinalityLabels` | bool | `false` | 是 | defaults/file/env | startup | metrics label validation | non-sensitive | true in P0 fail-fast | observability hooks |
| `boundary.maxCommandBodyBytes` | positive integer | `1048576` | 是 | defaults/file/env | startup | API request guard | non-sensitive | out of range fail-fast | API handlers |
| `boundary.maxPageLimit` | positive integer | `100` | 是 | defaults/file/env | startup | query/page guard | non-sensitive | out of range fail-fast | API/query/jobs |
| `boundary.queryReadTimeoutSeconds` | positive integer | `30` | 是 | defaults/file/env | startup | query service timeout | non-sensitive | out of range fail-fast | query handlers |
| `idempotency.commandRetentionSeconds` | integer seconds | `86400` | 是 | defaults/file/env | startup | cleanup guard | non-sensitive | less than retry window fail-fast | idempotency store |
| `idempotency.eventDedupRetentionSeconds` | integer seconds | `86400` | 是 | defaults/file/env | startup | event dedup guard | non-sensitive | less than redelivery window fail-fast | worker/idempotency |
| `idempotency.jobRetentionSeconds` | integer seconds | `604800` | 是 | defaults/file/env | startup | job duplicate replay guard | non-sensitive | less than report retention fail-fast | jobs/result store |
| `idempotency.reservedRecordMaxAgeSeconds` | integer seconds | `3600` | 是 | defaults/file/env | startup | commit-unknown audit guard | non-sensitive | invalid fail-fast | idempotency maintenance |
| `projection.staleThresholdSeconds` | integer seconds | `300` | 是 | defaults/file/env | startup | query degraded threshold | non-sensitive | invalid fail-fast | projection/query service |
| `projection.rebuildBatchSize` | positive integer | `50` | 是 | defaults/file/env/job input | startup default / job-run-start | frozen per rebuild | non-sensitive | invalid reject/fail-fast | projection rebuild job |
| `projection.derivedViewEventsEnabled` | bool | `false` | 是 | defaults/file/env | startup | optional derived view outbox append | non-sensitive | true without topic fail-fast | projection job/outbox |
| `reference.refreshBatchSize` | positive integer | `50` | 是 | defaults/file/env/job input | startup default / job-run-start | frozen per refresh | non-sensitive | invalid reject/fail-fast | reference refresh job |
| `reference.failedReferenceRetryPolicyRef` | string ref | `retry:reference:p0` | 是 | defaults/file/env | startup / job-run-start | resolver retry wrapper | non-sensitive | invalid ref fail-fast/reject job | reference resolver/job |
| `clockId.clockAdapterRef` | string ref | `clock:deterministic` in CI;`clock:system` in local | 是 | defaults/file/env/test fixture | startup | builder 注入 ClockPort | non-sensitive | missing fail-fast | `ClockPort` |
| `clockId.idGeneratorRef` | string ref | `id:deterministic` in CI;`id:local-sequence` in local | 是 | defaults/file/env/test fixture | startup | builder 注入 IdGeneratorPort | non-sensitive | missing fail-fast | `IdGeneratorPort` |
| `testFixtures.fixtureSetRef` | string ref | `fixture:governance:p0` | 是 in CI tests only | test config/test env | test harness | fixture load before runtime | non-sensitive;must be fake | missing test fail-fast | tests/fake runtime |
| `testFixtures.replayArtifactRootRef` | string ref | `null` | 是 in operations-replay | replay config/env/job input | job-run-start | replay runner reads refs | ref-sensitive | missing replay rejected | operations replay jobs |
| `testFixtures.fixedClockInstant` | timestamp string | `2026-01-01T00:00:00Z` in CI | 是 in deterministic tests | test fixture | test harness | frozen per test run | non-sensitive | invalid test fail-fast | clock fake |

### 8.3 按配置域组织的配置项批次表

| 配置域 | 配置项 | 控制面 | 分类 | 来源规则 | 环境差异 | 03 影响判定 |
|---|---|---|---|---|---|---|
| runtime profile | `runtime.profile`, `runtime.configRef`, `runtime.adapterMode`, `runtime.strictValidation` | runtime assembly / profile | startup runtime config;entry-local selector | defaults < file < env;entry-local 只选当前入口 | local/CI 默认 fake;integration-like 可 controlled;operations-replay 使用 replay config | 无回写;承接 `GovernanceRuntimeConfig.profile_ref` |
| logical stores | `stores.*.kind`, `stores.*.configRef` | store binding / transaction carrier | startup runtime config;sensitive ref config | defaults < file < env;durable ref 只保存 ref | P0 local/CI in_memory;integration-like 可 durable-like ref;production-like future | 无回写;承接 store refs |
| external resolvers | `externalResolvers.families[]` | inbound integration / source resolver | startup runtime config;test fixture config | defaults < file < env;fixture 仅 test | P0 fake;integration-like controlled;operations-replay replay refs | 无回写;承接 resolver port |
| inbound consumers | `inboundConsumers.*` | inbound integration / source resolver | startup runtime config;policy-like technical knobs | defaults < file < env | local 可 disabled;CI/integration-like enabled;operations-replay 按 replay input | 无回写;consumer DTO 已在 Step 8 闭合 |
| outbox publisher | `outbox.publisher.*`, `outbox.transportTopicBindings`, `outbox.publish*` | outbound publication / topic map | startup runtime config;job-run-start config | defaults < file < env;batch 可 job input | local/CI fake route;integration-like controlled route;production-like future transport | 无回写;topic-neutral key 不变 |
| operations jobs | `jobs.*` | operations job runners | startup runtime config;job-run-start config | defaults < file < env;job input 只覆盖 run-local scope | CI deterministic;operations-replay 必填 run id / replay refs | 无回写;job DTO/metadata 已闭合 |
| handoff / archive | `handoff.*` | handoff / archive / external export | startup runtime config;sensitive ref config;job-run-start target | defaults < file < env;job input target allowed | P0 fake targets;integration-like controlled target;production-like future | 无回写;target ref 不保存正文 |
| external GRC | `externalGrc.*` | handoff / archive / external export | feature peripheral enablement;sensitive ref config | defaults disabled;file/env explicit enable | P0 disabled;test may fake;production-like future | 无回写;disabled 不影响 truth |
| redaction / diagnostics | `redaction.*` | observability / redaction | diagnostic / redaction config | defaults < file < env | all profiles must keep deny list;CI tests assert redaction | 无回写;承接 Step 15 safe output |
| API/query boundary | `boundary.*` | observability / redaction;runtime assembly | startup runtime config;policy-like technical knobs | defaults < file < env | all profiles valid;entry-local 不绕过 | 无回写;handler guard 参数 |
| idempotency | `idempotency.*` | idempotency / result / report | startup runtime config;policy-like technical knobs | defaults < file < env | operations-replay retention must cover replay;CI deterministic | 无回写;承接 Step 13 duplicate replay |
| projection/reference maintenance | `projection.*`, `reference.*` | operations jobs;store binding | startup runtime config;job-run-start config | defaults < file < env;batch 可 job input | operations-replay validates rebuild/refresh;local optional | 无回写;不反写真相 |
| clock / id | `clockId.*` | clock / id / deterministic test | startup runtime config;test fixture config | defaults < file < env;fixture 仅 test | CI deterministic;local system/local-sequence;integration controlled | 无回写;承接 Clock/Id ports |
| test / replay fixtures | `testFixtures.*` | environment / profile matrix | test fixture / deterministic config;job-run-start replay | test config/test env/job input | local optional;CI fixture required;operations-replay replay root required | 无回写;production-like reject fixture |

### 8.4 系统级聚合配置映射说明

项目本地配置文件使用本 Step 的顶层模块名,例如 `runtime.profile`。若未来存在系统级聚合配置文件,可以做如下只读映射:

| 项目本地路径 | 系统聚合路径 | 说明 |
|---|---|---|
| `runtime.profile` | `governance.runtime.profile` | 只加项目 key,不改变配置语义 |
| `stores.truth.configRef` | `governance.stores.truth.configRef` | 聚合层不得展开 raw DB / credential |
| `externalResolvers.families[]` | `governance.externalResolvers.families[]` | 聚合层不得引入 sibling Cargo dependency |
| `outbox.transportTopicBindings` | `governance.outbox.transportTopicBindings` | 聚合层只传 route refs,不改变 event schema |
| `jobs.enabledKinds[]` | `governance.jobs.enabledKinds[]` | 聚合层只控制 runner availability |
| `handoff.traceTargets[]` | `governance.handoff.traceTargets[]` | 聚合层只传 target refs |
| `externalGrc.enabled` | `governance.externalGrc.enabled` | 聚合层默认仍 disabled |
| `redaction.denyFieldRefs[]` | `governance.redaction.denyFieldRefs[]` | 聚合层不得放宽 forbidden body |

聚合配置不是 P0 必需能力。若实现 loader 支持聚合配置,必须在 Step 9 加载校验中明确 source selector、冲突处理和 redaction 规则。

### 8.5 `runtime` 配置 demo

```json
{
  "runtime": {
    "profile": "local-dev",
    "configRef": "generated",
    "adapterMode": "fake",
    "strictValidation": true
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `runtime.profile` | string ref | `local-dev` | 选择 runtime profile | 必须属于 Step 6 profile 集合 | unknown fail-fast |
| `runtime.configRef` | string ref | `generated` | 标识已校验 config | loader 可生成;不得携带 body | validation issue fail-fast |
| `runtime.adapterMode` | enum string | `fake` | 选择 adapter assembly mode | P0 可 `fake` / `controlled`;production-like fake rejected | unsupported fail-fast |
| `runtime.strictValidation` | bool | `true` | 启用严格校验 | P0 必须 true | false fail-fast |

### 8.6 `stores` 配置 demo

```json
{
  "stores": {
    "truth": {
      "kind": "in_memory",
      "configRef": "store:truth:memory"
    },
    "projection": {
      "kind": "in_memory",
      "configRef": "store:projection:memory"
    },
    "reference": {
      "kind": "in_memory",
      "configRef": "store:reference:memory"
    },
    "outbox": {
      "kind": "in_memory",
      "configRef": "store:outbox:memory"
    },
    "idempotency": {
      "kind": "in_memory",
      "configRef": "store:idempotency:memory"
    }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `stores.truth.kind` | enum string | `in_memory` | 选择 truth logical store adapter | P0 支持 in_memory;durable 只作为 future ref | unsupported fail-fast |
| `stores.truth.configRef` | string ref | `store:truth:memory` | truth store config identity | 不保存 DB / secret / URL body | missing fail-fast |
| `stores.projection.kind` | enum string | `in_memory` | 选择 projection store | query 不写 truth | unsupported fail-fast |
| `stores.reference.kind` | enum string | `in_memory` | 选择 reference snapshot store | 不保存 external body | unsupported fail-fast |
| `stores.outbox.kind` | enum string | `in_memory` | 选择 outbox store | publisher 不现查 current truth | unsupported fail-fast |
| `stores.idempotency.kind` | enum string | `in_memory` | 选择 idempotency/result store | 必须支持 stored result/receipt/report | unsupported fail-fast |

### 8.7 `externalResolvers` 配置 demo

```json
{
  "externalResolvers": {
    "families": [
      {
        "family": "identity",
        "adapterRef": "resolver:identity:fake",
        "mode": "fake",
        "unavailableDisposition": "degraded"
      },
      {
        "family": "method",
        "adapterRef": "resolver:method:fake",
        "mode": "fake",
        "unavailableDisposition": "degraded"
      },
      {
        "family": "process",
        "adapterRef": "resolver:process:fake",
        "mode": "fake",
        "unavailableDisposition": "degraded"
      },
      {
        "family": "work",
        "adapterRef": "resolver:work:fake",
        "mode": "fake",
        "unavailableDisposition": "degraded"
      },
      {
        "family": "artifact",
        "adapterRef": "resolver:artifact:fake",
        "mode": "fake",
        "unavailableDisposition": "degraded"
      },
      {
        "family": "runtime",
        "adapterRef": "resolver:runtime:fake",
        "mode": "fake",
        "unavailableDisposition": "degraded"
      },
      {
        "family": "conversation",
        "adapterRef": "resolver:conversation:fake",
        "mode": "fake",
        "unavailableDisposition": "degraded"
      },
      {
        "family": "observability",
        "adapterRef": "resolver:observability:fake",
        "mode": "fake",
        "unavailableDisposition": "degraded"
      }
    ]
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `externalResolvers.families[].family` | enum string | `identity` | 选择 resolver family | 必须属于 Step 6 `GovernanceSourceResolverFamily` | unknown fail-fast |
| `externalResolvers.families[].adapterRef` | string ref | `resolver:identity:fake` | 指向 resolver adapter config | 不保存 endpoint / credential body | missing fail-fast |
| `externalResolvers.families[].mode` | enum string | `fake` | 标识 adapter behavior | local/CI fake;integration-like controlled | invalid profile combination fail-fast |
| `externalResolvers.families[].unavailableDisposition` | enum string | `degraded` | 映射 unavailable 的 query/job surface | 不得 auto-accept decision | unsupported fail-fast |

### 8.8 `inboundConsumers` 配置 demo

```json
{
  "inboundConsumers": {
    "enabled": true,
    "namespaces": [
      "identity.actor-capability",
      "process.governance-context",
      "work.governance-context",
      "artifact.evidence",
      "method.policy",
      "method.control",
      "runtime.signal",
      "conversation.context",
      "observability.alert"
    ],
    "supportedSchemaVersion": "v1",
    "dedupRetentionSeconds": 86400
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `inboundConsumers.enabled` | bool | `true` | 控制 worker consumer registry | disabled 只关闭 consumer,不改 core truth | invalid profile fail-fast |
| `inboundConsumers.namespaces[]` | string refs | `identity.actor-capability` | 列出可消费 namespace | enabled 时不得为空;不得创建 command mutation | missing fail-fast |
| `inboundConsumers.supportedSchemaVersion` | string | `v1` | inbound envelope 版本校验 | 只支持已闭合版本 | unsupported event rejected/dead-letter |
| `inboundConsumers.dedupRetentionSeconds` | integer | `86400` | consumer duplicate window | 必须覆盖 redelivery window | invalid fail-fast |

### 8.9 `outbox` 配置 demo

```json
{
  "outbox": {
    "publisher": {
      "adapterRef": "publisher:fake",
      "mode": "fake"
    },
    "publishBatchSize": 50,
    "publishRetryPolicyRef": "retry:outbox:p0",
    "deadLetterAfterAttempts": 3,
    "transportTopicBindings": {
      "governance.context.changed.v1": "topic:fake:governance-context-changed",
      "governance.gate.changed.v1": "topic:fake:gate-changed",
      "governance.decision.changed.v1": "topic:fake:decision-changed",
      "governance.approval.changed.v1": "topic:fake:approval-changed",
      "governance.policy.effective.changed.v1": "topic:fake:policy-effective-changed",
      "governance.shared-rule-set.changed.v1": "topic:fake:shared-rule-set-changed",
      "governance.policy-conflict.changed.v1": "topic:fake:policy-conflict-changed",
      "governance.control-applicability.changed.v1": "topic:fake:control-applicability-changed",
      "governance.compliance-conclusion.changed.v1": "topic:fake:compliance-conclusion-changed",
      "governance.nonconformity.changed.v1": "topic:fake:nonconformity-changed"
    }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `outbox.publisher.adapterRef` | string ref | `publisher:fake` | 指向 publisher adapter | 不保存 bus credential | missing fail-fast |
| `outbox.publisher.mode` | enum string | `fake` | 标识 publisher behavior | production-like fake rejected | invalid fail-fast |
| `outbox.publishBatchSize` | positive integer | `50` | pending outbox 批量发布大小 | 范围由 Step 9 validator 固定 | invalid fail-fast/reject job |
| `outbox.publishRetryPolicyRef` | string ref | `retry:outbox:p0` | outbox retry policy identity | 本 Step 不展开 policy body | invalid ref fail-fast |
| `outbox.deadLetterAfterAttempts` | positive integer | `3` | 达到次数后进入 dead-letter | 不得小于 1 | invalid fail-fast |
| `outbox.transportTopicBindings` | object map | fake topic refs | 绑定 topic-neutral key 到 route ref | enabled event key 必须完整 | missing key fail-fast |

### 8.10 `jobs` 配置 demo

```json
{
  "jobs": {
    "enabledKinds": [
      "publishGovernanceOutbox",
      "rebuildGovernanceProjections",
      "refreshExternalContextSnapshots",
      "runGovernanceReconciliation",
      "prepareGovernanceTraceHandoff",
      "prepareGovernanceArchiveHandoff"
    ],
    "defaultBatchSize": 50,
    "maxParallelism": 1,
    "jobTimeoutSeconds": 300,
    "retryPolicyRef": "retry:jobs:p0",
    "reportRetentionSeconds": 604800
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `jobs.enabledKinds[]` | enum list | `publishGovernanceOutbox` | 注册可运行 job kind | 不得包含未闭合 job | unknown fail-fast |
| `jobs.defaultBatchSize` | positive integer | `50` | job scan 默认批量 | job input 可在当前 run 内收窄 | invalid fail-fast/reject job |
| `jobs.maxParallelism` | positive integer | `1` | runner 并发上限 | P0 deterministic 默认 1 | invalid fail-fast |
| `jobs.jobTimeoutSeconds` | positive integer | `300` | job timeout | frozen per run | invalid reject/fail-fast |
| `jobs.retryPolicyRef` | string ref | `retry:jobs:p0` | job retry policy identity | policy body 不在本 Step 展开 | invalid ref fail-fast |
| `jobs.reportRetentionSeconds` | integer | `604800` | stored job report retention | 必须覆盖 duplicate replay window | invalid fail-fast |

### 8.11 `handoff` 和 `externalGrc` 配置 demo

```json
{
  "handoff": {
    "traceTargets": [
      "target:trace:fake"
    ],
    "archiveTargets": [
      "target:archive:fake"
    ],
    "emitTraceAvailableEvent": false,
    "handoffRetryPolicyRef": "retry:handoff:p0"
  },
  "externalGrc": {
    "enabled": false,
    "adapterRef": null,
    "targetRef": null,
    "exportBatchSize": 25
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `handoff.traceTargets[]` | target refs | `target:trace:fake` | trace handoff target registry | target ref 不保存 URL/secret/body | missing target reject job |
| `handoff.archiveTargets[]` | target refs | `target:archive:fake` | archive handoff target registry | target ref 不保存 archive package body | missing target reject job |
| `handoff.emitTraceAvailableEvent` | bool | `false` | 控制可选 trace available outbox event | true 时 topic binding 必须有对应 key | missing topic fail-fast |
| `handoff.handoffRetryPolicyRef` | string ref | `retry:handoff:p0` | handoff retry policy identity | 不保存 adapter error body | invalid ref fail-fast |
| `externalGrc.enabled` | bool | `false` | 是否启用 external GRC export | disabled 不影响 core truth | true without adapter/target fail-fast |
| `externalGrc.adapterRef` | optional string ref | `null` | external GRC adapter config ref | enabled 时必填;不保存 credential | missing fail-fast |
| `externalGrc.targetRef` | optional string ref | `null` | export target ref | enabled/job target 时必填 | missing reject/fail-fast |
| `externalGrc.exportBatchSize` | positive integer | `25` | export job 批量大小 | only used when enabled | invalid reject job |

### 8.12 `redaction` 和 `boundary` 配置 demo

```json
{
  "redaction": {
    "denyFieldRefs": [
      "field:raw-secret",
      "field:raw-token",
      "field:external-body",
      "field:artifact-body",
      "field:conversation-body",
      "field:method-body",
      "field:runtime-body",
      "field:observability-body",
      "field:archive-body",
      "field:external-grc-body"
    ],
    "safeDiagnosticRefPrefix": "diag:governance",
    "allowHighCardinalityLabels": false
  },
  "boundary": {
    "maxCommandBodyBytes": 1048576,
    "maxPageLimit": 100,
    "queryReadTimeoutSeconds": 30
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `redaction.denyFieldRefs[]` | string refs | `field:raw-secret` | forbidden body / secret 输出拒绝表 | P0 不得为空;不得允许 raw body | empty/unsafe fail-fast |
| `redaction.safeDiagnosticRefPrefix` | string | `diag:governance` | 生成 safe diagnostic refs | 不含 body / secret | invalid fail-fast |
| `redaction.allowHighCardinalityLabels` | bool | `false` | 控制 metric label 安全 | P0 必须 false | true fail-fast |
| `boundary.maxCommandBodyBytes` | positive integer | `1048576` | API command body 限制 | 不得绕过 DTO / actor / metadata | invalid fail-fast |
| `boundary.maxPageLimit` | positive integer | `100` | query/page 上限 | entry-local 不得超过此上限 | invalid fail-fast |
| `boundary.queryReadTimeoutSeconds` | positive integer | `30` | query read timeout | query 不触发 repair | invalid fail-fast |

### 8.13 `idempotency`、`projection` 和 `reference` 配置 demo

```json
{
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
    "refreshBatchSize": 50,
    "failedReferenceRetryPolicyRef": "retry:reference:p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `idempotency.commandRetentionSeconds` | integer | `86400` | command duplicate replay retention | 覆盖 retry / commit unknown window | invalid fail-fast |
| `idempotency.eventDedupRetentionSeconds` | integer | `86400` | consumer event dedup retention | 覆盖 redelivery window | invalid fail-fast |
| `idempotency.jobRetentionSeconds` | integer | `604800` | job duplicate report replay retention | 不得小于 report retention | invalid fail-fast |
| `idempotency.reservedRecordMaxAgeSeconds` | integer | `3600` | reserved record audit window | 支撑 commit unknown 诊断 | invalid fail-fast |
| `projection.staleThresholdSeconds` | integer | `300` | query stale/degraded threshold | query 不触发 rebuild | invalid fail-fast |
| `projection.rebuildBatchSize` | positive integer | `50` | projection rebuild batch | job input 可收窄 | invalid reject/fail-fast |
| `projection.derivedViewEventsEnabled` | bool | `false` | 可选 derived view changed event | true 时 topic binding 必须完整 | missing topic fail-fast |
| `reference.refreshBatchSize` | positive integer | `50` | reference refresh batch | job input 可收窄 | invalid reject/fail-fast |
| `reference.failedReferenceRetryPolicyRef` | string ref | `retry:reference:p0` | failed reference retry policy | 不展开 policy body | invalid ref fail-fast |

### 8.14 `clockId` 和 `testFixtures` 配置 demo

```json
{
  "clockId": {
    "clockAdapterRef": "clock:deterministic",
    "idGeneratorRef": "id:deterministic"
  },
  "testFixtures": {
    "fixtureSetRef": "fixture:governance:p0",
    "replayArtifactRootRef": null,
    "fixedClockInstant": "2026-01-01T00:00:00Z"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `clockId.clockAdapterRef` | string ref | `clock:deterministic` | 选择 ClockPort adapter | CI deterministic;production-like future runtime clock | missing fail-fast |
| `clockId.idGeneratorRef` | string ref | `id:deterministic` | 选择 IdGeneratorPort adapter | domain/handler 不拼 id | missing fail-fast |
| `testFixtures.fixtureSetRef` | string ref | `fixture:governance:p0` | CI/local fake seed | production-like reject | missing test fail-fast |
| `testFixtures.replayArtifactRootRef` | optional string ref | `null` | operations replay artifact root ref | operations-replay 必填;不保存 raw artifact body | missing replay rejected |
| `testFixtures.fixedClockInstant` | timestamp string | `2026-01-01T00:00:00Z` | deterministic test instant | only test profile | invalid test fail-fast |

### 8.15 完整配置 demo

以下示例是 JSONC 文档示例,注释只用于解释。实际运行配置必须删除所有注释,并保存为严格 JSON。

```jsonc
{
  // Runtime profile controls startup assembly only.
  "runtime": {
    "profile": "ci-test",
    "configRef": "generated",
    "adapterMode": "fake",
    "strictValidation": true
  },

  // Logical stores are refs, not product-specific DSNs or credentials.
  "stores": {
    "truth": {
      "kind": "in_memory",
      "configRef": "store:truth:memory"
    },
    "projection": {
      "kind": "in_memory",
      "configRef": "store:projection:memory"
    },
    "reference": {
      "kind": "in_memory",
      "configRef": "store:reference:memory"
    },
    "outbox": {
      "kind": "in_memory",
      "configRef": "store:outbox:memory"
    },
    "idempotency": {
      "kind": "in_memory",
      "configRef": "store:idempotency:memory"
    }
  },

  // Resolver adapters return body-free refs, summaries, snapshots, or resolution states.
  "externalResolvers": {
    "families": [
      {
        "family": "identity",
        "adapterRef": "resolver:identity:fake",
        "mode": "fake",
        "unavailableDisposition": "degraded"
      },
      {
        "family": "method",
        "adapterRef": "resolver:method:fake",
        "mode": "fake",
        "unavailableDisposition": "degraded"
      },
      {
        "family": "process",
        "adapterRef": "resolver:process:fake",
        "mode": "fake",
        "unavailableDisposition": "degraded"
      },
      {
        "family": "work",
        "adapterRef": "resolver:work:fake",
        "mode": "fake",
        "unavailableDisposition": "degraded"
      },
      {
        "family": "artifact",
        "adapterRef": "resolver:artifact:fake",
        "mode": "fake",
        "unavailableDisposition": "degraded"
      },
      {
        "family": "runtime",
        "adapterRef": "resolver:runtime:fake",
        "mode": "fake",
        "unavailableDisposition": "degraded"
      },
      {
        "family": "conversation",
        "adapterRef": "resolver:conversation:fake",
        "mode": "fake",
        "unavailableDisposition": "degraded"
      },
      {
        "family": "observability",
        "adapterRef": "resolver:observability:fake",
        "mode": "fake",
        "unavailableDisposition": "degraded"
      }
    ]
  },

  // Consumers are event/snapshot consumers, not command emulators.
  "inboundConsumers": {
    "enabled": true,
    "namespaces": [
      "identity.actor-capability",
      "process.governance-context",
      "work.governance-context",
      "artifact.evidence",
      "method.policy",
      "method.control",
      "runtime.signal",
      "conversation.context",
      "observability.alert"
    ],
    "supportedSchemaVersion": "v1",
    "dedupRetentionSeconds": 86400
  },

  // Topic bindings map topic-neutral keys to route refs only.
  "outbox": {
    "publisher": {
      "adapterRef": "publisher:fake",
      "mode": "fake"
    },
    "publishBatchSize": 50,
    "publishRetryPolicyRef": "retry:outbox:p0",
    "deadLetterAfterAttempts": 3,
    "transportTopicBindings": {
      "governance.context.changed.v1": "topic:fake:governance-context-changed",
      "governance.gate.changed.v1": "topic:fake:gate-changed",
      "governance.decision.changed.v1": "topic:fake:decision-changed",
      "governance.approval.changed.v1": "topic:fake:approval-changed",
      "governance.policy.effective.changed.v1": "topic:fake:policy-effective-changed",
      "governance.shared-rule-set.changed.v1": "topic:fake:shared-rule-set-changed",
      "governance.policy-conflict.changed.v1": "topic:fake:policy-conflict-changed",
      "governance.control-applicability.changed.v1": "topic:fake:control-applicability-changed",
      "governance.compliance-conclusion.changed.v1": "topic:fake:compliance-conclusion-changed",
      "governance.nonconformity.changed.v1": "topic:fake:nonconformity-changed"
    }
  },

  // Job settings are technical runner knobs. Jobs must not repair core truth.
  "jobs": {
    "enabledKinds": [
      "publishGovernanceOutbox",
      "rebuildGovernanceProjections",
      "refreshExternalContextSnapshots",
      "runGovernanceReconciliation",
      "prepareGovernanceTraceHandoff",
      "prepareGovernanceArchiveHandoff"
    ],
    "defaultBatchSize": 50,
    "maxParallelism": 1,
    "jobTimeoutSeconds": 300,
    "retryPolicyRef": "retry:jobs:p0",
    "reportRetentionSeconds": 604800
  },

  // Handoff and external GRC targets are refs. Raw package bodies and credentials are excluded.
  "handoff": {
    "traceTargets": [
      "target:trace:fake"
    ],
    "archiveTargets": [
      "target:archive:fake"
    ],
    "emitTraceAvailableEvent": false,
    "handoffRetryPolicyRef": "retry:handoff:p0"
  },
  "externalGrc": {
    "enabled": false,
    "adapterRef": null,
    "targetRef": null,
    "exportBatchSize": 25
  },

  // Redaction config must be strict in every profile.
  "redaction": {
    "denyFieldRefs": [
      "field:raw-secret",
      "field:raw-token",
      "field:external-body",
      "field:artifact-body",
      "field:conversation-body",
      "field:method-body",
      "field:runtime-body",
      "field:observability-body",
      "field:archive-body",
      "field:external-grc-body"
    ],
    "safeDiagnosticRefPrefix": "diag:governance",
    "allowHighCardinalityLabels": false
  },

  // Boundary limits reject invalid input. They do not bypass actor, metadata, or visibility guards.
  "boundary": {
    "maxCommandBodyBytes": 1048576,
    "maxPageLimit": 100,
    "queryReadTimeoutSeconds": 30
  },

  // Retention values must preserve duplicate replay and commit-unknown recovery windows.
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
    "refreshBatchSize": 50,
    "failedReferenceRetryPolicyRef": "retry:reference:p0"
  },

  // Deterministic clock and id adapters are test profile tools.
  "clockId": {
    "clockAdapterRef": "clock:deterministic",
    "idGeneratorRef": "id:deterministic"
  },
  "testFixtures": {
    "fixtureSetRef": "fixture:governance:p0",
    "replayArtifactRootRef": null,
    "fixedClockInstant": "2026-01-01T00:00:00Z"
  }
}
```

### 8.16 配置项停审记录

| 配置域 / 配置项 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| runtime | 类型 / 默认值 / 必填 / 来源 / 生效方式 | 通过 | `strictValidation=false` 在 P0 fail-fast |
| stores | 5 类 logical store 是否齐全 | 通过 | durable 产品不在 P0 锁定 |
| externalResolvers | 8 类 resolver family 是否齐全 | 通过 | controlled/real-like 只作为 adapter mode,不引入 sibling Cargo |
| inboundConsumers | namespace / version / dedup retention 是否闭合 | 通过 | local 可 disabled;enabled 时 namespace 必填 |
| outbox | publisher、batch、retry、topic map 是否闭合 | 通过 | optional event topic 仅在 feature enabled 时必填 |
| jobs | enabled kinds、batch、parallelism、timeout、retention 是否闭合 | 通过 | external GRC export 默认未启用 |
| handoff | trace/archive target、retry、trace available feature 是否闭合 | 通过 | target 只保存 ref |
| externalGrc | disabled default、adapter/target 条件必填是否闭合 | 通过 | enabled 时 fail-fast 校验 |
| redaction | deny list、安全诊断和 high-cardinality 策略是否闭合 | 通过 | P0 deny list 不得为空 |
| boundary | command body、page、query timeout 是否闭合 | 通过 | 不绕过安全 guard |
| idempotency | command/event/job/reserved retention 是否闭合 | 通过 | retention cross-field 校验留 Step 9 |
| projection/reference | stale threshold、batch、retry policy refs 是否闭合 | 通过 | rebuild/refresh 不反写真相 |
| clockId/testFixtures | deterministic test 与 production-like 边界是否闭合 | 通过 | production-like reject fixture/fake override |

### 8.17 跨配置项闭环审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在重复配置项 | 无 | logical store 和 idempotency/result store 各有唯一 owner |
| 是否存在泛化模块混写 | 无 | 顶层模块均按功能域拆分,未使用 `common` / `misc` |
| 必填项是否都有失败策略 | 通过 | startup fail-fast;job rejected;entry-local rejected;test fail-fast |
| 敏感级别是否都已归类 | 通过 | raw secret/body 均禁止;ref-sensitive 已标注 |
| profile 差异是否已表达 | 通过 | local/CI/integration-like/operations-replay 均有适用来源和默认 |
| topic map 是否可证明完整 | 通过 | core outbound topic keys 必填;optional feature true 时再要求 optional topic |
| fake adapter 是否可能代表 production readiness | 否 | production-like future profile reject fake/test fixture override |
| entry-local 是否覆盖全局配置 | 否 | 只选当前 entry/profile/job input,不覆盖 startup invariant |
| 配置项是否改变 truth / state / transaction / query / outbox 不变量 | 否 | 禁止配置化边界仍由 Step 4 固定 |
| 是否新增 `03` runtime config 字段或 port | 否 | 字段均承接 Step 14 config binding 或 Step 6/7 object/port |
| 是否存在 unresolved `03` 回写缺口 | 未发现 | 真实产品、secret provider、remote config center、hot reload 留 Step 13/14 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 项目本地配置按功能模块拆分,不重复 `governance` 前缀 | 否 | 配置文件组织 | 不适用 | 无回写 |
| P0 配置项承接 `GovernanceRuntimeConfig`、Boundary、Idempotency、Projection、Job、Outbox、Handoff、ExternalGrc、Feature config sections | 否 | 字段命名与默认值细化 | 不适用 | 无回写 |
| `adapterMode` 使用 fake / controlled / disabled 等配置语义,不新增 domain enum | 否 | infra config schema | 不适用 | 无回写 |
| external GRC 默认 disabled,enabled 时 adapter/target ref 必填 | 否 | 承接 Step 14 disabled 口径 | 不适用 | 无回写 |
| 完整 demo 使用 JSONC,运行时必须严格 JSON | 否 | 文档示例约束 | 不适用 | 无回写 |
| 若后续实现要求真实 secret provider、remote config center、admin override、hot reload、产品级 DSN schema 或 adapter constructor 新参数 | 是 | runtime loader / validator / builder / adapter constructor contract | `03` §13 / Step 14 或对应 object/port Step | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_07_config_items.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“配置项总表”“按配置域组织的配置项批次表”“模块级 JSON demo”“完整配置 demo”“配置项停审记录”“跨配置项闭环审计表”和“对详细设计的影响判定”小节,了解配置项如何从 Step 3~6 和详细设计 Step 14 收敛。

正式 `04-配置设计.md` §7 应回填:

- 配置项命名和组织规则。
- 配置项总表。
- 按配置域组织的配置项批次表。
- 系统级聚合配置映射说明。
- 模块级严格 JSON demo 和配置项说明表。
- 完整 JSONC 文档示例,并明确实际运行配置必须删除注释。
- 配置项停审记录。
- 跨配置项闭环审计表。
- 对详细设计的影响判定。

回填要求:

- 不得把模块级 demo 写成 JSONC;模块级 demo 必须是严格 JSON。
- 不得把 raw secret、raw endpoint credential、raw bus topic secret、external body 或 product-specific DSN 写进示例。
- 不得把 `runtime.adapterMode` 当成 domain state / business policy。
- 不得把 disabled external GRC 写成 core command unavailable。
- 不得把 fake profile 证据写成 production readiness。
- 不得提前创建正式 `04-配置设计.md`;正式文档只能在 Step 15 装配。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| secret provider、credential ref 解析、轮换和审计 | 影响 sensitive ref config | Step 8 正式定义 |
| loader 对 JSON schema、env var、cross-field validation 的具体实现 | 影响 startup fail-fast 和 job rejected surface | Step 9 正式定义 |
| config 变更审计、rollback 和 invalid previous config 处理 | 影响 operations / runbook | Step 10 正式定义 |
| failure / degraded / unavailable 的精确错误映射 | 影响 API / worker / jobs response | Step 11 正式定义 |
| `staging-like` / `production-like` 产品和 secret provider | 影响 P1/P2 | Step 13 / Step 14 记录演进与风险 |
| remote config center / admin override 是否进入未来版本 | 影响 runtime loader / audit / rollback contract | P0 unsupported;Step 13 / 14 记录 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 配置项清单已定义 | 通过 | 见 §8.2 |
| 配置项按配置域组织 | 通过 | 见 §8.3 |
| 模块级严格 JSON demo 已提供 | 通过 | 见 §8.5~§8.14 |
| 完整 JSONC 文档示例已提供并标注运行时必须删注释 | 通过 | 见 §8.15 |
| 每个配置项都有类型、默认值、必填、来源、作用域、生效、敏感级别、失败策略和关联模块 | 通过 | 见 §8.2 |
| 配置项停审完成 | 通过 | 见 §8.16 |
| 跨配置项闭环审计没有 unresolved 冲突 | 通过 | 见 §8.17 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 8 | 通过 | 下一步定义敏感配置与密钥管理 |
