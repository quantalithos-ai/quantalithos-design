# Step 9. 定义配置加载、校验与生效机制

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 9
> 回填章节: `04-配置设计.md` §9 配置加载、校验与生效机制

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 9 定义配置加载、校验与生效机制 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 7 配置项清单;Step 8 敏感配置;详细设计 Step 14 runtime builder 绑定顺序 |
| 输出文件 | `projects/L1-governance/design-calibration/04_config_step_09_loading_validation_activation.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 10 |

## 2. 本步目标

本 Step 定义 `L1-governance` 配置如何加载、解析、类型校验、交叉字段校验、装配为 validated runtime config,以及如何暴露给 `infra`、`api`、`worker` 和 `jobs`。

本 Step 只回答:

- 配置在什么时机加载: startup、job-run-start、entry-local、test harness。
- 普通来源如何按 Step 5 规则合并,高优先级非法值如何 fail-fast。
- JSON 如何 parse、type validate、range validate 和 cross-field validate。
- 哪些配置组需要交叉字段校验。
- 如何从 parsed config 组装 `GovernanceRuntimeConfig`、store registry、adapter registry、boundary params、runner params 和 test fixture state。
- 校验失败后如何处理,是否允许 fallback。
- 每个配置域加载校验完成后是否停审。

本 Step 不定义:

- 具体 Rust loader 函数签名、error enum 字段或 implementation code。
- 真实 secret provider API、产品级 DB / bus / external GRC schema。
- hot reload 或 runtime reload contract。P0 中 `reload` / `hot` 一律 unsupported,配置变化通过 restart 或 new job run 生效。
- 配置变更审批、审计和回滚流程,这些由 Step 10 定义。
- 失效模式矩阵和告警切口,这些由 Step 11 定义。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_07_config_items.md` | 已完成 | 提供字段级配置项、类型、默认值、必填、来源、作用域、生效方式和失败策略 |
| `04_config_step_08_sensitive_secrets.md` | 已完成 | 提供 sensitive/secret 边界、禁止输出、读取 / 轮换 / 审计承接 |
| `04_config_step_05_sources_priority_conflicts.md` | 已完成 | 提供 ordinary sources 优先级、冲突处理和 fail-fast 规则 |
| `04_config_step_06_environment_profiles_matrix.md` | 已完成 | 提供 profile 组合和 fake / controlled / replay / future production-like 差异 |
| `03_ddd_step_14_config_external_binding.md` §14 | 已完成 | 提供 `GovernanceConfigLoader.load` -> validator -> runtime builder -> facade 暴露顺序 |
| `03_ddd_step_06_object_contracts.md` §16.1 | 已完成 | 提供 `GovernanceRuntimeConfig`、`GovernanceRuntimeBuilderState` 和 adapter availability marker |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 提供 invalid config、target disabled、adapter unavailable 等错误映射方向 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 配置在什么时机加载? | startup runtime config 在 runtime builder 暴露 facade 前加载并冻结。job-run-start config 在每次 job run reserve idempotency 前解析并冻结到 run context / report。entry-local 参数只在当前入口解析,不覆盖全局 config。test fixture 只在 test harness 组装 fake runtime 前加载。P0 不支持 hot reload。 |
| 配置如何 parse 和 type validate? | 运行配置文件必须是严格 JSON。loader 先按 Step 5 合并 defaults/file/env,再解析 JSON object、校验顶层模块、字段类型、枚举、正整数、Duration seconds、timestamp、nullable optional refs、list unique 和 object map key/value。JSONC 只允许文档示例,运行时 parse 必须拒绝注释。 |
| 哪些配置需要 cross-field validate? | profile 与 adapter mode、store kind 与 config ref、external GRC enabled 与 adapter/target、trace/derived event feature 与 topic map、redaction deny list 与 high-cardinality labels、job retention 与 idempotency retention、batch/parallelism 与 profile、resolver family coverage、consumer enabled 与 namespace、operations-replay 与 replay root 都需要交叉校验。 |
| 哪些配置 startup / reload / hot / build-time / static? | P0 只有 startup、job-run-start、entry-local、test harness 和 static design boundary。`reload` / `hot` unsupported。build-time 仅限 Rust workspace / feature dependency discipline,不作为本 Step runtime config。truth/state/query/outbox/idempotency invariant 属 static design boundary,不是配置项。 |
| 校验失败后如何处理? | startup 配置失败:builder state 进入 `Failed`,不暴露 facade。job-run-start 失败:当前 job rejected,不进入 application mutation。entry-local 失败:当前 entry rejected。test fixture 失败:test fail-fast。高优先级非法值不得 fallback 低优先级。secret/raw body 进入普通配置直接 reject。 |
| 每个配置项 / 配置组的加载时机、校验方式、生效方式和失败策略是否与 Step 7 一致? | 是。§8.2 和 §8.3 按配置组和配置域逐项闭合 parse、type validate、cross-field validate、assemble target 和失败策略。 |
| 每个配置域加载校验完成后是否通过停审? | 已通过。§8.8 逐域停审。 |
| 所有加载校验完成后是否存在未校验必填项、cross-field 缺口、热更新无回滚或 runtime builder 影响未回写 03? | 已审计。当前无 unresolved 缺口。P0 不支持 reload/hot,因此无“热更新无回滚”缺口;若未来支持 reload,必须回写 `03` runtime reload / rollback contract。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 7 配置项清单 | 已列字段和失败策略,但未形成 loader 执行顺序 | 本 Step 定义 load / merge / parse / validate / assemble / expose 顺序 |
| Step 8 敏感配置 | 已定义 opaque ref 和禁止输出,但未纳入 parse/type/cross-field 校验 | 本 Step 把 raw secret/body reject 和 sensitive ref shape 校验纳入加载流程 |
| Step 14 runtime builder | 已定义 builder 顺序,但未细化 `04` 配置项到 assemble target | 本 Step 按配置域映射到 runtime config、store registry、adapter registry、handler/job params |
| Step 4 P0 无 hot update | 已分类,但 Step 9 需明确 reload/hot 如何处理 | 本 Step 固定 `reload` / `hot` unsupported and validation reject |
| 正式 `04` | 尚未创建 | 本 Step 只生成中间产物,正式文档等 Step 15 装配 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 加载顺序 | 只有详细设计 runtime builder 顺序 | 增加 source merge、strict JSON parse、type validate、cross-field validate、assemble target | 实现需要可执行 loader 规则 |
| JSONC 口径 | Step 7 只说 demo 可用 JSONC | 运行时 parse 明确拒绝注释,只接受严格 JSON | 防止文档示例误成 runtime 能力 |
| cross-field | Step 7 零散写缺失时 fail-fast | 汇总为配置域交叉校验表 | 防止 adapter/feature/topic/retention 断裂 |
| job-run-start | Step 7 写 batch 可由 job input 收窄 | 明确 job input 只冻结当前 run,不覆盖 startup defaults | 防止 entry/job 越权 |
| hot reload | Step 4 已禁核心 hot update | 本 Step 明确 `reload` / `hot` unsupported | 防止实现侧私造 reload path |
| `03` 影响 | Step 7/8 无回写 | 本 Step 不新增 runtime builder/port;future reload/secret provider 需要回写 | 保持设计边界 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 运行时是否支持 JSONC | A. 支持 JSONC;B. 只支持严格 JSON | 采用 B。JSONC 只作为文档示例 |
| 高优先级非法 env 是否 fallback | A. fallback;B. fail-fast | 采用 B。Step 5 已固定此口径 |
| reload/hot 是否预留半实现 | A. 预留字段但不实现;B. P0 明确 unsupported | 采用 B。避免无 rollback contract 的运行时切换 |
| adapter availability 是否在 loader 校验时探测 | A. loader 直接探测所有外部服务;B. loader 校验 ref 形态,assembly 生成 availability marker | 采用 B。P0 fake/controlled/durable-like 差异由 runtime builder / adapter factory 标记 |
| job input 是否覆盖全局 config | A. 覆盖;B. 只生成 run-local frozen params | 采用 B。避免 job 绕过 startup validation |
| secret provider 不可用是否 fallback fake | A. fallback;B. fail-fast/rejected/failed marker | 采用 B。production-like 不允许 fake fallback |

## 8. 结构化中间产物

### 8.1 配置加载流程图

#### 配置加载流程图: L1-governance 配置加载与校验

```text
[code defaults]
  -> [optional strict JSON config file]
  -> [environment variable overrides]
  -> [entry-local selector / job input where allowed]
  -> [source merge with conflict detection]
  -> [strict JSON parse]
  -> [type / enum / range / ref-shape validation]
  -> [cross-field validation]
  -> [sensitive / forbidden body validation]
  -> [assemble validated config refs]
  -> [GovernanceRuntimeConfig::from_validated_refs]
  -> [GovernanceRuntimeBuilderState::for_config]
  -> [store registry + adapter registry + availability markers]
  -> [application services from ports and typed params]
  -> [api / worker / jobs facade exposure]
```

关键说明:

- `entry-local selector / job input` 不是全局覆盖层,只影响当前 entry 或当前 job run。
- `strict JSON parse` 不接受 JSONC 注释。
- `type / enum / range / ref-shape validation` 只校验普通 config 和 refs,不解析 raw secret material。
- `cross-field validation` 必须在 runtime builder 暴露 facade 前完成。
- builder `Ready` 前不得暴露 API / worker / jobs facade。
- P0 没有 reload/hot path;配置变化通过 restart 或 new job run 生效。

### 8.2 配置加载校验表

| 配置项 / 配置组 | 加载时机 | 校验方式 | 生效方式 | 失败策略 |
|---|---|---|---|---|
| `runtime.*` | startup;profile selector 可 entry-local | JSON object、enum、bool、known profile、strictValidation true | startup 冻结;selector 只影响当前 entry | invalid fail-fast / entry rejected |
| `stores.*` | startup | required groups、known kind、ref shape、logical store completeness | runtime builder store registry | required missing fail-fast |
| `externalResolvers.*` | startup;test fixture before fake runtime | list parse、unique families、known family/mode/disposition、ref shape | adapter registry + resolver port injection | missing family / invalid mode fail-fast |
| `inboundConsumers.*` | startup | bool、namespace list、version enum、dedup retention range | worker consumer registry | invalid fail-fast;unsupported event rejected at runtime |
| `outbox.*` | startup;batch may job-run-start | publisher ref shape、mode/profile compatibility、topic map coverage、batch/range | publisher adapter + publish runner params | missing enabled topic fail-fast;job batch invalid rejected |
| `jobs.*` | startup;batch/timeout may job-run-start | enabled kind enum、positive integer、retention cross-field、parallelism/profile compatibility | jobs registry + frozen job params | startup fail-fast or job rejected |
| `handoff.*` | startup;target may job-run-start | target ref shape、retry ref shape、feature/topic cross-field | adapter registry target set;frozen job target | missing enabled target fail-fast/reject job |
| `externalGrc.*` | startup;target may job-run-start | enabled bool、adapter/target conditional required、batch range | export adapter registration when enabled | enabled missing adapter/target fail-fast/reject job |
| `redaction.*` | startup | deny list non-empty、field ref shape、high-cardinality false in P0、prefix safe | validator/logging/diagnostic hooks | unsafe config fail-fast |
| `boundary.*` | startup | positive integer/range,timeout range,page max | API/query/job guard params | invalid fail-fast |
| `idempotency.*` | startup | integer seconds、retention cross-field,positive age | idempotency/result store cleanup params | invalid fail-fast |
| `projection.*` | startup;batch may job-run-start | stale threshold positive,batch positive,feature/topic cross-field | query degraded params + rebuild job defaults | invalid fail-fast/reject job |
| `reference.*` | startup;batch may job-run-start | refresh batch positive,retry ref shape | reference refresh job defaults | invalid fail-fast/reject job |
| `clockId.*` | startup;fixture before fake runtime | clock/id ref shape,profile compatibility | ClockPort / IdGeneratorPort injection | missing fail-fast |
| `testFixtures.*` | test harness / operations-replay job start | fixture ref shape,timestamp parse,replay root required by profile,de-identified marker | fake runtime seed or replay job frozen input | test fail-fast / replay job rejected |

### 8.3 按配置域组织的加载 / 校验 / 生效表

| 配置域 | 配置项 / 配置组 | parse | type validate | cross-field validate | assemble target | 失败策略 |
|---|---|---|---|---|---|---|
| runtime profile | `runtime.*` | parse top-level object | profile string,bool,adapter mode enum | profile must allow adapter mode;strictValidation true;no hot/reload flags | `GovernanceRuntimeConfig.profile_ref`, `config_ref` | startup fail-fast |
| logical stores | `stores.*` | parse nested store objects | kind enum,configRef string refs | all five logical stores present;durable refs not in local/CI unless allowed;outbox/idempotency not collapsed into indistinguishable store | `GovernanceInfraStoreRegistryState`, repository adapters | startup fail-fast |
| external resolvers | `externalResolvers.families[]` | parse list | family/mode/disposition enums,adapter ref | required family coverage;unique family;mode/profile compatibility;production-like no fake | `GovernanceAdapterConfigRefSet`, resolver adapter states | startup fail-fast |
| inbound consumers | `inboundConsumers.*` | parse object/list | bool,version string,duration seconds | enabled requires namespaces;version must be supported;dedup retention >= expected redelivery window | worker consumer registry, idempotency params | startup fail-fast |
| outbox publisher/topic | `outbox.*` | parse object/map | adapter ref,mode,batch int,retry ref,topic map | publisher mode/profile compatibility;enabled event keys complete;optional feature topics present when feature enabled;deadLetterAfterAttempts >= 1 | publisher adapter, topic route map, publish job defaults | startup fail-fast;run batch rejected |
| operations jobs | `jobs.*` | parse list/object | job kind enum,integers,retry ref | enabled kinds closed;external GRC export only when externalGrc enabled;report retention >= job idempotency window;parallelism valid for profile | job registry, runner params | startup fail-fast;job rejected |
| handoff/archive | `handoff.*` | parse target refs/list/bool | target ref,retry ref,bool | enabled handoff job requires target;emitTraceAvailableEvent requires topic key;target not raw secret | `GovernanceRuntimeConfig.trace_handoff_target_refs`, `archive_handoff_target_refs`, handoff adapter registry,feature flag | startup fail-fast;job rejected |
| external GRC | `externalGrc.*` | parse object | bool,optional refs,batch int | enabled implies adapterRef and targetRef;disabled implies no core command dependency;production-like no fake | `external_grc_adapter_ref`, `external_grc_target_ref`, export job availability | startup fail-fast;job rejected |
| redaction/diagnostics | `redaction.*` | parse list/prefix/bool | field refs,string,bool | deny list non-empty;must include forbidden body classes;high-cardinality labels false in P0 | redaction checker,diagnostic ref generator | startup fail-fast |
| boundary | `boundary.*` | parse object | positive ints,duration seconds | page limit <= configured max;entry-local cannot exceed startup max | API/query/job guard params | startup fail-fast |
| idempotency/result | `idempotency.*` | parse object | integer seconds | command/event/job retention covers retry/redelivery/replay windows;reserved max age positive | idempotency/result store params | startup fail-fast |
| projection/reference | `projection.*`,`reference.*` | parse objects | positive ints,bool,retry ref | derived event requires topic;batch within page max;refresh retry ref valid | query params,projection/reference job defaults | startup fail-fast;job rejected |
| clock/id | `clockId.*` | parse object | ref strings | deterministic refs only in test/CI unless profile explicitly controlled;missing port blocks mutation | `clock_adapter_ref` -> ClockPort, `id_generator_ref` -> IdGeneratorPort | startup fail-fast |
| test/replay fixtures | `testFixtures.*` | parse fixture object | ref strings,timestamp,nullable refs | fixture only local/CI;operations-replay requires replay root;production-like rejects fixture | fake runtime seed,replay job input | test fail-fast/replay rejected |

### 8.4 Cross-field validation matrix

| Cross-field rule | Inputs | Validation | Failure |
|---|---|---|---|
| profile vs adapter mode | `runtime.profile`, `runtime.adapterMode`, adapter modes | `production-like` rejects fake/test;`integration-like` may use controlled;`local-dev` / `ci-test` may use fake | startup fail-fast |
| logical store completeness | `stores.truth/projection/reference/outbox/idempotency` | all five logical store refs present and valid | startup fail-fast |
| resolver family coverage | `externalResolvers.families[]` | required P0 families present exactly once | startup fail-fast |
| consumer enabled requires namespaces | `inboundConsumers.enabled`, `namespaces[]` | enabled => non-empty namespace set and version supported | startup fail-fast |
| topic completeness | `outbox.transportTopicBindings`, enabled outbound features | every enabled topic-neutral key has route ref | startup fail-fast |
| optional event feature topics | `handoff.emitTraceAvailableEvent`, `projection.derivedViewEventsEnabled`, topic map | true => corresponding optional topic key present | startup fail-fast |
| external GRC enablement | `externalGrc.enabled`, `adapterRef`, `targetRef`, jobs enabled | enabled => adapterRef+targetRef;disabled => export job disabled/rejected | startup fail-fast or job rejected |
| target availability | `handoff.*Targets`, job target input | target must be in enabled target set before job body | job rejected or failed marker by Step 11 |
| retention consistency | idempotency/job/event/report retention | retention must cover duplicate replay/redelivery/report window | startup fail-fast |
| batch and page limits | `jobs.defaultBatchSize`, `outbox.publishBatchSize`, `projection.rebuildBatchSize`, `reference.refreshBatchSize`, `boundary.maxPageLimit` | batch <= maxPageLimit unless job input explicitly lower | startup fail-fast / job rejected |
| redaction safety | `redaction.denyFieldRefs`, `allowHighCardinalityLabels` | deny list non-empty and includes forbidden classes;high-cardinality false in P0 | startup fail-fast |
| sensitive refs | all `*Ref` sensitive configs | raw secret/body patterns rejected;full sensitive ref not emitted in issues | startup fail-fast / job rejected |
| replay profile | `runtime.profile`, `testFixtures.replayArtifactRootRef`, job input | operations-replay requires de-identified replay root ref | job rejected |
| no config invariant override | any config source | cannot set truth/state/query/outbox/idempotency invariant flags | config validation reject |

### 8.5 生效方式矩阵

| 生效方式 | 本项目 P0 口径 | 适用配置 | 失败处理 |
|---|---|---|---|
| static design boundary | 不是配置项 | truth ownership、state matrix、query no-write、outbox source、duplicate replay、external GRC no-truth | 配置中出现相关 override key => validation reject |
| startup | runtime builder 前加载并冻结 | runtime、stores、resolver、consumer、outbox/topic、jobs defaults、handoff targets、redaction、boundary、idempotency、projection/reference defaults、clock/id | invalid => builder `Failed`,不暴露 facade |
| job-run-start | job run 开始时冻结 | job input scope、batch、target、replay root、current run page/cursor where allowed | invalid => job rejected,不进入 application mutation |
| entry-local | 只影响当前入口选择 | profile selector、config source selector、job request source、artifact/report output root、dry-run diagnostic selector | invalid => current entry rejected |
| test harness | fake runtime / fixture load 前生效 | fixture set、fixed clock、deterministic id、fake adapter seed | invalid => test fail-fast |
| reload | P0 unsupported | 无 | presence of reload config => validation reject |
| hot | P0 unsupported | 无 | presence of hot config => validation reject |
| build-time | 不作为 runtime config | Rust workspace dependency discipline | 违规由 implementation gate,不是 config loader |

### 8.6 Runtime builder assemble target table

| Validated config group | Assemble target | Exposed to | Not exposed to |
|---|---|---|---|
| `runtime.*` | `GovernanceRuntimeConfig`, `GovernanceRuntimeBuilderState` | `infra::runtime_builder`, entry facade | `domain`, public `contracts` |
| `stores.*` | `GovernanceInfraStoreRegistryState`, repository adapters, UoW manager | `application` via repository ports | raw store config / product DSN |
| `externalResolvers.*` | resolver adapter states and `ExternalGovernanceSourceResolverPort` impls | application source resolver port | sibling repo DTO/body |
| `inboundConsumers.*` | worker consumer registry and dedup params | worker entry, idempotency repo | domain truth object |
| `outbox.*` | publisher adapter, topic route map, outbox job defaults | outbox publisher service/job | event schema mutation |
| `jobs.*` | job runner registry and default runner params | jobs entry/facade | repository direct access |
| `handoff.*` | trace/archive target sets and handoff adapter registry | handoff job service | external package body or synthesized adapter refs |
| `externalGrc.*` | optional export adapter, optional export target and job availability | export job service | core command acceptance or synthesized target/adapter refs |
| `redaction.*` | redaction checker and diagnostic ref generator | infra/api/worker/jobs observability hooks | raw matched values |
| `boundary.*` | API/query/page guard params | api/query/jobs entry validators | domain state machine |
| `idempotency.*` | idempotency/result retention params | idempotency/result store | command metadata requirement |
| `projection.*` / `reference.*` | query freshness params and maintenance job defaults | query service/jobs | truth mutation |
| `clockId.*` | separate ClockPort and IdGeneratorPort impl refs | application services via ports | handler/domain ad hoc id/time or synthesized combined ref |
| `testFixtures.*` | fake runtime seeds and replay frozen input | tests/operations replay runner | production-like runtime |

### 8.7 Config validation issue surface

| Issue class | Created by | Carries | Must not carry |
|---|---|---|---|
| `ParseFailed` | strict JSON parser | config source ref,redacted location,issue ref | raw file body |
| `UnknownField` | schema validator | module path,field name,issue ref | sibling body |
| `MissingRequired` | schema validator | module path,field name,issue ref | secret |
| `InvalidType` | type validator | module path,expected type,issue ref | raw value if sensitive |
| `InvalidEnum` | type validator | module path,allowed class,issue ref | raw sensitive value |
| `InvalidRange` | range validator | module path,range class,issue ref | raw body |
| `CrossFieldConflict` | cross-field validator | involved module paths,rule ref,issue ref | raw values when sensitive |
| `ForbiddenSecretMaterial` | sensitive validator | module path,forbidden class,issue ref | detected material |
| `ForbiddenInvariantOverride` | static boundary validator | forbidden key class,issue ref | attempted payload |
| `UnsupportedSource` | source loader | source kind,profile,issue ref | source body |
| `UnsupportedReload` | activation validator | requested activation kind,issue ref | raw config |

### 8.8 加载校验停审记录

| 配置域 / 配置组 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| runtime | parse/type/cross-field/activation/03 impact | 通过 | reload/hot rejected |
| stores | 必填 logical store、ref shape、assembly target | 通过 | durable product schema 留 P1/P2 |
| externalResolvers | family coverage、mode/profile compatibility | 通过 | production-like fake rejected |
| inboundConsumers | enabled namespace、version、dedup retention | 通过 | unsupported version runtime rejected/dead-letter |
| outbox/topic | topic completeness、feature topic、publisher mode | 通过 | missing enabled topic fail-fast |
| jobs | enabled kind、retention、batch、parallelism | 通过 | external GRC export tied to externalGrc.enabled |
| handoff/externalGrc | target/adapter conditional required | 通过 | disabled external GRC does not block core truth |
| redaction/boundary | deny list,high-cardinality,page/body/time limits | 通过 | unsafe relax fail-fast |
| idempotency/projection/reference | retention/stale/batch/retry cross-field | 通过 | query/job no truth repair preserved |
| clockId/testFixtures | deterministic/profile compatibility | 通过 | production-like fixture rejected |
| sensitive validation | raw secret/body reject and redacted issue refs | 通过 | no raw material in issue surface |

### 8.9 跨加载校验审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 未校验必填项 | 未发现 | Step 7 required fields covered by §8.2/§8.3 |
| 类型校验缺口 | 未发现 | enum/int/bool/ref/list/map/timestamp all covered |
| cross-field 缺口 | 未发现 | profile,topic,feature,retention,target,redaction,batch covered |
| hot/reload 无回滚 | 不适用 | P0 rejects reload/hot config |
| 高优先级非法值 fallback | 无 | fail-fast |
| raw secret/body 进入 issue surface | 不允许 | issue only redacted refs |
| runtime builder 半装配暴露 facade | 不允许 | only Ready exposes facade |
| job input 覆盖 startup invariant | 不允许 | job input only run-local frozen params |
| adapter constructor 新参数未回写 `03` | 当前无 | future product/secret provider requires design change |
| 错误模型缺口 | 当前无 | Step 11 will detail失效模式;本 Step fixes issue classes |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 运行时配置只接受严格 JSON,JSONC 仅用于文档示例 | 否 | 配置格式规则 | 不适用 | 无回写 |
| P0 加载链固定为 source merge -> parse -> type validate -> cross-field validate -> runtime builder assembly | 否 | 承接 Step 14 builder 顺序 | 不适用 | 无回写 |
| reload / hot activation 在 P0 unsupported,出现即 reject | 否 | 承接 P0 无 hot update | 不适用 | 无回写 |
| builder `Ready` 前不得暴露 facade | 否 | 承接 `GovernanceRuntimeBuilderState` | 不适用 | 无回写 |
| config validation issue surface 只输出 redacted issue refs | 否 | 承接 Step 8 / `03` observability | 不适用 | 无回写 |
| 若后续要求 runtime reload、last-known-good config、secret provider resolution、product-specific adapter constructor 或 config center | 是 | runtime config / builder / rollback / adapter constructor / error model contract | `03` §13 / Step 14 / Step 12 error recovery | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_09_loading_validation_activation.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“配置加载流程图”“配置加载校验表”“按配置域组织的加载 / 校验 / 生效表”“Cross-field validation matrix”“Runtime builder assemble target table”“Config validation issue surface”“加载校验停审记录”和“跨加载校验审计表”小节,了解配置如何从 Step 7 / Step 8 转换为 runtime builder 可消费的 validated refs。

正式 `04-配置设计.md` §9 应回填:

- 配置加载流程图。
- 配置加载校验表。
- 按配置域组织的加载 / 校验 / 生效表。
- Cross-field validation matrix。
- 生效方式矩阵。
- Runtime builder assemble target table。
- Config validation issue surface。
- 加载校验停审记录。
- 跨加载校验审计表。
- 对详细设计的影响判定。

回填要求:

- 必须明确运行时配置是严格 JSON,不是 JSONC。
- 必须覆盖 parse、type validate、range validate、cross-field validate 和 sensitive / forbidden body validation。
- 不得允许 high-priority invalid value fallback。
- 不得引入 P0 reload / hot path。
- 不得让 job input 或 entry-local 参数覆盖 startup invariant。
- 不得让 builder 在 `Ready` 前暴露 facade。
- 不得提前创建正式 `04-配置设计.md`;正式文档只能在 Step 15 装配。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Config validation issue enum 是否需要在实现中成为正式 infra error variant | 影响 implementation error type | 当前作为配置设计 issue surface;若改变 `03` error enum,实施前回写 |
| range 上限是否需要产品/容量 sizing | 影响 production-like tuning | P0 使用安全默认和 validator;容量 sizing 留 P1/P2 |
| secret provider 解析是否进入 loader 或 adapter factory | 影响 `03` runtime builder / adapter constructor | P0 不解析 raw secret;future 回写 |
| reload / last-known-good 是否进入未来版本 | 影响 rollback contract | Step 13 / 14 记录演进 |
| validation issue digest 算法 | 影响 redaction / audit | 不在本 Step 锁定算法;只要求 opaque redacted issue refs |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置加载流程已定义 | 通过 | 见 §8.1 |
| 类型校验和范围校验已覆盖 | 通过 | 见 §8.2 / §8.3 |
| 交叉字段校验已覆盖 | 通过 | 见 §8.4 |
| 生效方式和 P0 reload/hot 口径已明确 | 通过 | 见 §8.5 |
| runtime builder assembly target 已明确 | 通过 | 见 §8.6 |
| 校验失败 surface 已定义为 redacted issue refs | 通过 | 见 §8.7 |
| 加载校验停审完成 | 通过 | 见 §8.8 |
| 跨加载校验审计没有 unresolved 冲突 | 通过 | 见 §8.9 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 10 | 通过 | 下一步定义配置变更、审计与回滚 |
