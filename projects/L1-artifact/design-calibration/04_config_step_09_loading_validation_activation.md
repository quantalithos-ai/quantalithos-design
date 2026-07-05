# Step 9. 定义配置加载、校验与生效机制

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 9
> 回填章节: `04-配置设计.md` §9 配置加载、校验与生效机制

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 9 定义配置加载、校验与生效机制 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 5 来源优先级;Step 6 profile 矩阵;Step 7 配置项清单;Step 8 敏感配置;详细设计 Step 14/15/16 |
| 输出文件 | `projects/L1-artifact/design-calibration/04_config_step_09_loading_validation_activation.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 10 |

## 2. 本步目标

本 Step 定义 `L1-artifact` 配置如何加载、合并、解析、校验、冻结并装配为 `ArtifactRuntimeConfig` 与 run-local validated params。

本 Step 只回答:

- 配置在哪些时机加载: startup、current entry、current job run、test harness。
- `defaults < file < env` 如何进入严格 JSON parse、type/range 校验、cross-field 校验和 sensitive validation。
- 哪些配置域在 startup 冻结,哪些只能在当前 job run 冻结,哪些只是 entry-local selector。
- `ArtifactConfigLoader.load(profile)`、`ArtifactConfigValidator.validate(...)`、`ArtifactRuntimeConfig::from_validated_refs(...)` 和 `ArtifactRuntimeBuilderState::for_config(...)` 的正式承接口径。
- 校验失败时如何 fail-fast / reject,以及 builder 何时允许暴露 facade。

本 Step 不定义:

- 具体 Rust 函数签名、error enum 字段、serde schema 或实现代码。
- 具体 secret provider API、产品级 DB / bus / object store / external endpoint schema。
- hot reload、runtime reload、last-known-good config、admin override。
- 配置变更审批、变更审计、回滚策略和失效模式矩阵,这些留给 Step 10 / Step 11。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 已完成 | 提供来源主优先级、entry-local / job-local 边界和 unsupported source 规则 |
| `04_config_step_06_environment_profiles_matrix.md` | 已完成 | 提供 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 的 profile 组合 |
| `04_config_step_07_config_items.md` | 已完成 | 提供字段级配置项、类型、默认值、作用域、生效方式和失败策略 |
| `04_config_step_08_sensitive_secrets.md` | 已完成 | 提供 sensitive / secret 边界、禁止输出和读取 / 轮换承接 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供 `infra/config.rs`、`infra/runtime_builder.rs`、`ArtifactRuntimeConfig` 和 builder 顺序 |
| `03_ddd_step_15_observability_audit.md` | 已完成 | 提供 config validation log / metric / audit 的 redacted 边界 |
| `03_ddd_step_16_test_cuts.md` | 已完成 | 提供 config validation、forbidden boundary 和 runtime entry state 的测试承接 |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 提供 invalid config、target disabled、adapter unavailable 的恢复口径 |
| `projects/L1-governance/design-calibration/04_config_step_09_loading_validation_activation.md` | 已参考 | 提供 Step 9 粒度框架,本文件按 Artifact 语义重写 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 配置在什么时机加载? | startup runtime config 在 facade 暴露前加载并冻结。current entry 只解析 selector/path/root 这类 entry-local 参数。current job run 在读取 `ArtifactJobRequest<T>` 后、进入 job body 前冻结 run-local 参数。test harness 在 fake runtime 组装前加载 fixture。P0 不支持 hot reload。 |
| 如何 parse 和 type validate? | 运行配置文件必须是严格 JSON。先按 Step 5 合并 `defaults < file < env`,再校验顶层模块、字段类型、enum、正整数、Duration seconds、timestamp、nullable ref、list uniqueness 和 object map key/value。JSONC 只允许文档示例,运行时解析必须拒绝注释。 |
| 哪些配置需要 cross-field validate? | profile 与 adapter mode、store kind 与 configRef、inbound sourceMode 与 namespace、topic binding completeness、optional event feature 与 topic key、handoff target set 与显式 job target、retention windows、batch size 与 `boundary.maxPageLimit`、redaction 安全规则、clock/id 与 profile、fixture / replay root 与 profile 都需要交叉校验。 |
| 哪些配置 startup / job-run-start / entry-local / test harness 生效? | startup: runtime、stores、sourceResolvers、inboundConsumers、relay、handoff、boundary、idempotency、projection、reference、redaction、clockId。job-run-start: allowed batch/scope/target/replay root/current output root。entry-local: profile selector、config source selector、job request source、artifact/report root、dry-run diagnostics。test harness: fixture set、fixed clock、deterministic id。 |
| 校验失败后如何处理? | startup 配置失败时 builder 进入 `Failed`,不暴露 API / worker / jobs facade。current entry 参数失败时当前入口 reject。current job run 参数失败时当前 job reject,不进入 application mutation。test harness 失败时测试 fail-fast。高优先级非法值不得 fallback 低优先级。 |
| 是否允许 reload / hot? | 不允许。P0 对 `reload` / `hot` / config center / admin override 一律视为 unsupported source 或 unsupported activation。配置变更通过 restart 或 new job run 生效。 |
| 每个配置域加载校验完成后是否通过停审? | 已通过。见 §8.8 加载校验停审记录。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 7 配置项清单 | 已列字段、类型和失败策略,但未形成 loader 顺序 | 本 Step 固定 load -> merge -> parse -> validate -> assemble -> expose 顺序 |
| Step 8 敏感配置 | 已定义 opaque ref 和 raw secret 禁入边界,但未落到 validator | 本 Step 将 sensitive / secret 检查纳入 parse 后校验流程 |
| Step 14 builder 绑定 | 已定义 runtime builder 顺序,但未按 `04` 配置域展开 | 本 Step 把各配置域映射到 builder assemble target |
| Step 5 来源规则 | 已定义 `defaults < file < env`,但未说明 entry-local / job-local 何时参与 | 本 Step 补 current entry 和 current job run 两个窗口 |
| Step 4 无 hot update | 已裁决 P0 不支持,但缺 runtime activation 口径 | 本 Step 固定 `reload` / `hot` unsupported |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置加载顺序 | 只有 Step 14 builder 顺序 | 增加 merge、strict parse、type/range/cross-field/sensitive validate | 实现需要唯一 loader 口径 |
| entry-local / job-local | Step 5 / 7 仅定义边界 | 本 Step 明确各自加载窗口和冻结时点 | 防止入口越权覆盖 runtime frozen fields |
| JSONC 口径 | 仅在 Step 7 作为文档示例 | 运行时 parse 明确拒绝 JSONC | 防止示例误当 runtime 能力 |
| runtime exposure | 只说由 infra builder 暴露 | 本 Step 明确 `Ready` 前不得暴露 facade | 避免半装配 runtime |
| 校验失败 surface | 只有 fail-fast / reject 概念 | 增加 redacted issue surface 分类 | 为 Step 10 / 11 和测试提供承接面 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 运行时是否支持 JSONC | A. 支持;B. 仅支持严格 JSON | 采用 B。JSONC 只保留给文档示例 |
| 高优先级非法值是否 fallback | A. 回退低优先级;B. fail-fast / reject | 采用 B。与 Step 5 完全一致 |
| reload / hot 是否做半实现预留 | A. 留接口不落地;B. P0 明确 unsupported | 采用 B。当前没有 rollback contract |
| adapter availability 是否在 parse 时探测 | A. parse 时探测外部服务;B. parse 验 ref,assembly 产 availability marker | 采用 B。产品/网络可用性不属于 parse 阶段 |
| current job run 是否可改全局 runtime | A. 允许;B. 只冻结 run-local params | 采用 B。保持 startup validated runtime 不变 |
| config validation issue 是否包含 raw value | A. 带原值;B. 只保留 redacted issue ref 和 safe class | 采用 B。遵守 Step 8 / Step 15 redaction 红线 |

## 8. 结构化中间产物

### 8.1 配置加载流程图

#### 配置加载流程图: L1-artifact 配置加载与生效

```text
[entry-local selector chooses profile/config source]
  -> [code defaults]
  -> [selected strict JSON config file]
  -> [environment overrides]
  -> [source merge with conflict detection]
  -> [strict JSON parse]
  -> [type / enum / range / ref-shape validation]
  -> [cross-field validation]
  -> [sensitive / forbidden body validation]
  -> [ArtifactRuntimeConfig::from_validated_refs(...)]
  -> [ArtifactRuntimeBuilderState::for_config(...)]
  -> [store registry + adapter registry + availability markers]
  -> [application services from ports and typed params]
  -> [api / worker / jobs facade exposure when Ready]

[current job run]
  -> [decode ArtifactJobRequest<T>]
  -> [validate run-local inputs against frozen runtime]
  -> [freeze run context / report context]
  -> [dispatch job body]
```

关键说明:

- entry-local selector 只决定当前入口使用哪个 profile / config source / local output root,不是普通覆盖层。
- `strict JSON parse` 明确拒绝注释和 JSONC 文法。
- `sensitive / forbidden body validation` 只检查 ref 形态和禁入材料,不解析 raw secret。
- builder 未进入 `Ready` 前,不得暴露 handler、consumer、job runner facade。
- current job run 只能基于已冻结 runtime 做 run-local 收窄,不能回写 startup config。

### 8.2 配置加载校验表

| 配置项 / 配置组 | 加载时机 | 校验方式 | 生效方式 | 失败策略 |
|---|---|---|---|---|
| `runtime.*` | startup;profile 可由 entry-local selector 选择 | JSON object、known profile、bool | startup 冻结 | startup fail-fast / current entry reject |
| `stores.*` | startup | required groups、known kind、configRef shape | store registry + repository/UoW binding | startup fail-fast |
| `sourceResolvers.*` | startup;fixture-only 在 test harness | adapter ref shape、mode enum、disposition enum | resolver adapter registry | startup fail-fast |
| `inboundConsumers.*` | startup | sourceMode enum、namespace list、schema version string | worker consumer registry | startup fail-fast |
| `relay.*` | startup;batch may be run-local if formal job allows | adapter ref、topic map、positive int、retry ref shape | publisher adapter + runner defaults | startup fail-fast / current job reject |
| `jobs.*` | startup;batch/timeout may be run-local if allowed | known job runner params、positive int、retry ref shape | job runner defaults | startup fail-fast / current job reject |
| `handoff.*` | startup;target selection may narrow at current job run | target ref list、bool | target registry + feature flags | startup fail-fast / current job reject |
| `boundary.*` | startup | positive int、timeout range | API/query/job guard params | startup fail-fast |
| `idempotency.*` | startup | integer seconds、retention relations | idempotency/result retention params | startup fail-fast |
| `projection.*` | startup;batch may narrow at current job run | positive int、bool | query freshness params + rebuild defaults | startup fail-fast / current job reject |
| `reference.*` | startup;batch may narrow at current job run | positive int | refresh defaults | startup fail-fast / current job reject |
| `redaction.*` | startup | deny list non-empty、field ref shape、bool safe default | redaction / diagnostic hooks | startup fail-fast |
| `clockId.*` | startup;test harness may substitute deterministic refs | ref shape、profile compatibility | `ClockPort` + `IdGeneratorPort` injection | startup fail-fast |
| `testFixtures.*` | test harness / `operations-replay` run start | fixture ref shape、timestamp、replay root required by profile | fake runtime seed or replay run-local context | test fail-fast / current job reject |

### 8.3 按配置域组织的加载 / 校验 / 生效表

| 配置域 | parse | type validate | cross-field validate | assemble target | 失败策略 |
|---|---|---|---|---|---|
| runtime | parse `runtime` object | `profile` string,`strictValidation` bool | profile must be known;`strictValidation` 在 P0 不允许为 false | `ArtifactRuntimeConfig.profile_ref`,`config_ref` | startup fail-fast |
| logical stores | parse `stores.{truth,projection,reference,relay,idempotency}` | `kind` enum,`configRef` string ref | 五类 logical store 必须齐全;kind 与 profile 兼容 | store registry,repositories,UoW manager | startup fail-fast |
| source resolvers | parse `sourceResolvers` object | adapter ref,mode,disposition | mode 与 profile 兼容;`integration-like`/`operations-replay` 不得回落 fake success | resolver adapter states | startup fail-fast |
| inbound consumers | parse `inboundConsumers` object/list | `enabledNamespaces` string list,`sourceMode`,`supportedSchemaVersion` | `sourceMode != disabled` 时 namespace 非空;version 必须在允许集内 | worker consumer registry | startup fail-fast |
| relay publisher/topic | parse `relay` object/map | adapter ref,batch int,retry ref,topic map | enabled core event keys 完整;optional feature event keys 需随 feature 打开而存在 | publisher adapter,topic route map,runner defaults | startup fail-fast / current job reject |
| jobs runner | parse `jobs` object | positive ints,retry ref | `maxParallelism` 与 profile 兼容;run-local override 只能收窄当前 run | job runner params | startup fail-fast / current job reject |
| handoff targets/features | parse `handoff` object | target ref lists,bool | target set 非空 when enabled;`emitTraceAvailableEventFromHandoff=true` 需要 topic binding | handoff target registry,feature flags | startup fail-fast / current job reject |
| boundary | parse `boundary` object | body bytes/page limit/read timeout | run-local batch 不得超过 `maxPageLimit` | handler/query guard params | startup fail-fast |
| idempotency/result | parse `idempotency` object | integer seconds | retention 必须覆盖 retry/redelivery/replay window;reserved max age 正值 | idempotency/result cleanup params | startup fail-fast |
| projection/reference | parse `projection` and `reference` objects | positive ints,bool | `derivedViewEventsEnabled=true` 需要 optional topic key;batch <= `maxPageLimit` | query freshness params + maintenance defaults | startup fail-fast / current job reject |
| redaction/diagnostic | parse `redaction` object | field refs,prefix,bool | deny list 非空且包含 forbidden classes;`allowHighCardinalityLabels` 在 P0 只能 false | redaction checker,diagnostic ref generator | startup fail-fast |
| clock/id | parse `clockId` object | adapter refs | `ci-test` 必须 deterministic;`operations-replay` 允许 deterministic replay | `ClockPort`,`IdGeneratorPort` | startup fail-fast |
| fixtures/replay | parse `testFixtures` object | fixture ref,timestamp,nullable replay root ref | `ci-test` 需要 fixture set;`operations-replay` 需要去标识化 replay root | fake runtime seeds,replay run context | test fail-fast / current job reject |

### 8.4 Cross-field validation matrix

| Cross-field rule | Inputs | Validation | Failure |
|---|---|---|---|
| profile known and supported | `runtime.profile` | 必须属于 Step 6 P0 profile | startup fail-fast |
| strict validation required | `runtime.strictValidation` | P0 只能为 `true` | startup fail-fast |
| logical store completeness | `stores.*` | 五类 store 全部存在且 ref 形态合法 | startup fail-fast |
| profile vs resolver mode | `runtime.profile`,`sourceResolvers.mode` | `ci-test` / `local-dev` 可 fake;`integration-like` / `operations-replay` 允许 controlled/replay-backed;不允许未定义 mode | startup fail-fast |
| consumer mode vs namespace | `inboundConsumers.sourceMode`,`enabledNamespaces` | `sourceMode != disabled` 时 namespace 非空 | startup fail-fast |
| consumer schema version | `inboundConsumers.supportedSchemaVersion` | 必须与 formal allowlist 匹配 | startup fail-fast |
| relay topic completeness | `relay.transportTopicBindings` | 六个核心 outbound event key 必须齐全 | startup fail-fast |
| optional trace event topic | `handoff.emitTraceAvailableEventFromHandoff`,`relay.transportTopicBindings` | 打开时必须存在 `artifact.trace.available` route | startup fail-fast |
| optional derived view event topic | `projection.derivedViewEventsEnabled`,`relay.transportTopicBindings` | 打开时必须存在 `artifact.derived_view_state.changed` route | startup fail-fast |
| batch/page relation | `jobs.defaultBatchSize`,`relay.publishBatchSize`,`projection.rebuildBatchSize`,`reference.refreshBatchSize`,`boundary.maxPageLimit` | batch 不得超过 page limit;run-local override 只能更小 | startup fail-fast / current job reject |
| retention consistency | `idempotency.*`,`jobs.jobTimeoutSeconds` | retention 需覆盖 command retry、event dedup、job report replay 窗口 | startup fail-fast |
| handoff target registry | `handoff.*Targets`, current job target selector | 显式选择的 target 必须属于 startup target set | current job reject |
| redaction safety | `redaction.denyFieldRefs`,`redaction.allowHighCardinalityLabels` | deny list 非空且高基数标签保持 false | startup fail-fast |
| clock/id profile compatibility | `runtime.profile`,`clockId.*` | `ci-test` 必须 deterministic;`local-dev` 可 system/local-sequence | startup fail-fast |
| fixture profile rule | `runtime.profile`,`testFixtures.fixtureSetRef` | fixture set 只在 test harness / `ci-test` 使用 | test fail-fast |
| replay root rule | `runtime.profile`,`testFixtures.replayArtifactRootRef` | `operations-replay` 必须提供去标识化 replay root ref | current job reject |
| forbidden invariant override | any unknown override key aimed at state/truth/visibility/idempotency invariants | 不接受通过配置放宽 static design boundary | validation reject |

### 8.5 生效方式矩阵

| 生效方式 | P0 口径 | 适用配置 | 失败处理 |
|---|---|---|---|
| static design boundary | 非配置项 | truth ownership、state matrix、query no-write、consumer no-truth-write、job no-truth-repair | validation reject |
| startup | runtime builder 前加载并冻结 | runtime、stores、sourceResolvers、inboundConsumers、relay、jobs defaults、handoff、boundary、idempotency、projection、reference、redaction、clockId | builder `Failed`,不暴露 facade |
| current entry | 仅影响当前入口 | profile selector、config source selector、job request source、artifact/report root、dry-run diagnostics | current entry reject |
| current job run | 在 job body 前冻结 | current scope/current batch/current target/replay root/current output root | current job reject |
| test harness | fake runtime 组装前 | fixture set、fixed clock、deterministic id | test fail-fast |
| reload | P0 unsupported | 无 | validation reject |
| hot | P0 unsupported | 无 | validation reject |

### 8.6 Runtime builder assemble target table

| Validated config group | Assemble target | Exposed to | Not exposed to |
|---|---|---|---|
| `runtime.*` | `ArtifactRuntimeConfig`,`ArtifactRuntimeBuilderState` | `infra::runtime_builder`,entry facade | `domain`,public `contracts` |
| `stores.*` | store registry,repositories,UoW manager | `application` via Step 7 ports | raw DSN/product config |
| `sourceResolvers.*` | resolver adapter states and `ExternalArtifactSourceResolverPort` impl | application source resolver port | sibling body/external body |
| `inboundConsumers.*` | worker consumer registry,dedup params | worker entry | core truth mutation |
| `relay.*` | publisher adapter,topic route map,relay runner defaults | worker relay publisher/jobs | event schema mutation |
| `jobs.*` | job runner defaults and concurrency limits | jobs entry/facade | repository direct access |
| `handoff.*` | archive/observability/sync target sets and handoff adapter registry | handoff job services | synthesized adapter ref from target ref |
| `boundary.*` | API/query/job guard params | api/query/jobs | domain state machine |
| `idempotency.*` | idempotency/result cleanup params | idempotency/result stores | protocol invariant override |
| `projection.*`,`reference.*` | query freshness params,maintenance defaults | query services/jobs | truth mutation |
| `redaction.*` | redaction checker,diagnostic ref generator | infra/api/worker/jobs observability hooks | raw matched values |
| `clockId.*` | separate `ClockPort` / `IdGeneratorPort` refs | application services via ports | combined synthetic clock/id adapter |
| `testFixtures.*` | fake runtime seed,replay run-local context | tests/operations replay | production-like runtime |

### 8.7 Config validation issue surface

| Issue class | Created by | Carries | Must not carry |
|---|---|---|---|
| `ParseFailed` | strict JSON parser | config source ref,redacted location,issue ref | raw file body |
| `UnknownField` | schema validator | module path,field name,issue ref | arbitrary payload dump |
| `MissingRequired` | schema validator | module path,field name,issue ref | secret |
| `InvalidType` | type validator | module path,expected type,issue ref | raw sensitive value |
| `InvalidEnum` | enum validator | module path,allowed class,issue ref | full sensitive ref |
| `InvalidRange` | range validator | module path,range class,issue ref | raw body |
| `CrossFieldConflict` | cross-field validator | involved module paths,rule ref,issue ref | raw values when sensitive |
| `ForbiddenSecretMaterial` | sensitive validator | module path,forbidden class,issue ref | detected material |
| `ForbiddenInvariantOverride` | static boundary validator | forbidden key class,issue ref | attempted override payload |
| `UnsupportedSource` | source loader | source kind/profile,issue ref | source body |
| `UnsupportedActivation` | activation validator | requested activation kind,issue ref | raw config |

### 8.8 加载校验停审记录

| 配置域 / 配置组 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| runtime | merge、parse、profile、strictValidation、生效方式 | 通过 | reload/hot rejected |
| stores | logical completeness、kind/ref、assemble target | 通过 | durable 产品 schema 留后续 |
| sourceResolvers | mode/profile compatibility、availability handoff | 通过 | fake fallback 未被允许到 integration/replay |
| inboundConsumers | namespace/version/sourceMode | 通过 | unsupported event 仍由 runtime receipt 处理 |
| relay/jobs | batch/timeout/topic completeness/run-local freeze | 通过 | current job override only narrows current run |
| handoff | target set、feature/topic relation | 通过 | target selector 不得逃出 registry |
| boundary/idempotency/projection/reference | range、batch/page、retention、optional feature relation | 通过 | no query/job truth repair preserved |
| redaction | deny list/high-cardinality/safe diagnostic prefix | 通过 | unsafe relax fail-fast |
| clockId/testFixtures | deterministic/profile compatibility、replay root rule | 通过 | fixture 仅 test harness |
| sensitive validation | raw secret/body reject and redacted issue refs | 通过 | no raw material in issue surface |

### 8.9 跨加载校验审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 未校验必填项 | 未发现 | Step 7 required fields 全覆盖 |
| 类型 / range 校验缺口 | 未发现 | enum/int/bool/ref/list/map/timestamp 均覆盖 |
| cross-field 缺口 | 未发现 | profile/topic/target/retention/redaction/fixture/replay 已覆盖 |
| 高优先级非法值 fallback | 不允许 | fail-fast / reject |
| builder 半装配暴露 facade | 不允许 | only `Ready` exposes facade |
| current job run 覆盖 startup invariant | 不允许 | run-local params only |
| raw secret/body 进入 issue surface | 不允许 | 只输出 redacted issue refs |
| 是否需要回写 `03` | 当前无 | future reload/provider/product schema 才需回写 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 运行时只接受严格 JSON,JSONC 仅用于文档示例 | 否 | 配置格式规则 | 不适用 | 无回写 |
| P0 加载链固定为 merge -> strict parse -> type/range/cross-field/sensitive validate -> runtime builder assembly | 否 | 承接 Step 14 builder 顺序 | 不适用 | 无回写 |
| builder `Ready` 前不得暴露 facade | 否 | 承接 `ArtifactRuntimeBuilderState` | 不适用 | 无回写 |
| reload / hot / config center / admin override 在 P0 unsupported | 否 | 范围裁剪 | 不适用 | 无回写 |
| 若未来引入 runtime reload、last-known-good config、secret provider resolution 或 product-specific adapter constructor | 是 | runtime config / builder / error / rollback contract 变更 | `03` Step 14 / Step 12 / 相关 flow | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_09_loading_validation_activation.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“配置加载流程图”“配置加载校验表”“按配置域组织的加载 / 校验 / 生效表”“Cross-field validation matrix”“生效方式矩阵”“Runtime builder assemble target table”“Config validation issue surface”和“跨加载校验审计表”小节。

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

- 必须明确 runtime 只接受严格 JSON,不是 JSONC。
- 必须覆盖 parse、type validate、range validate、cross-field validate 和 sensitive validation。
- 不得允许高优先级非法值 fallback。
- 不得引入 P0 reload / hot path。
- 不得让 builder 在 `Ready` 前暴露 facade。
- 正式 `04-配置设计.md` 仍等 Step 15 装配。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| config validation issue class 是否最终需要成为正式 infra error variant | 影响实现错误类型 | 当前只作为配置设计 issue surface |
| range 上限是否需要未来容量 sizing | 影响 P1/P2 tuning | P0 只要求安全范围和 fail-fast |
| future secret provider 是在 loader 还是 adapter factory 解析 | 影响 `03` builder / adapter contract | P0 不定义 |
| last-known-good / reload 是否进入未来版本 | 影响 rollback contract | 留 Step 13 / Step 14 风险记录 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置加载流程已定义 | 通过 | 见 §8.1 |
| 类型和范围校验已覆盖 | 通过 | 见 §8.2 / §8.3 |
| 交叉字段校验已覆盖 | 通过 | 见 §8.4 |
| 生效方式与 unsupported activation 已明确 | 通过 | 见 §8.5 |
| runtime builder assemble target 已明确 | 通过 | 见 §8.6 |
| validation issue surface 已 redacted 化 | 通过 | 见 §8.7 |
| 加载校验停审完成 | 通过 | 见 §8.8 |
| 跨加载校验审计无 unresolved 冲突 | 通过 | 见 §8.9 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 10 | 通过 | 下一步定义配置变更、审计与回滚 |
