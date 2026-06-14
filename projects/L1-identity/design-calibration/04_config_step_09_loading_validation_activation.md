# 04 配置设计 Step 9 · 定义配置加载、校验与生效机制

> 子项目: `L1-identity`
> 目标文档: `04-配置设计.md`
> SOP Step: Step 9 定义配置加载、校验与生效机制
> 状态: 已写入;等待用户审核

---

## 1. Step 状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 9 定义配置加载、校验与生效机制 |
| 当前状态 | 已写入;等待用户审核 |
| 输入基线 | Step 4 categories / boundaries;Step 5 sources / priority / conflicts;Step 7 config items;Step 8 sensitive secrets;新版正式 `03-详细设计.md` §13~§15 |
| 输出文件 | `projects/L1-identity/design-calibration/04_config_step_09_loading_validation_activation.md` |
| 停审方式 | 本 Step 完成后暂停,审核通过后进入 Step 10 change / audit / rollback |

本 Step 定义 `L1-identity` 配置如何从来源链进入 validated config snapshot,如何 parse、type validate、range validate、cross-field validate、sensitive / forbidden material validate,以及如何在 startup、job-run-start、entry-local 和 test harness 时机生效。

本 Step 只回答:

- 配置加载链如何执行,以及哪些阶段必须在 runtime builder 暴露 facade 前完成。
- 运行时配置为何只接受严格 JSON,文档 JSONC 示例为何不能被 runtime parser 接受。
- 每个配置域如何执行 parse、类型校验、范围校验、交叉字段校验、敏感校验和 assembly target 映射。
- startup、job-run-start、entry-local、test harness、static design boundary、reload / hot 的 P0 口径。
- 校验失败如何 fail-fast、reject current job、reject current entry 或 test fail-fast。
- 配置加载 / 校验 / 生效机制是否改变 `03-详细设计.md` 的 runtime config、builder、adapter constructor、port、error、DTO 或 flow 契约。

本 Step 不定义:

- 具体 Rust loader function、`IdentityRuntimeConfig` struct、validator API、config error enum、adapter constructor signature 或 implementation file。
- 具体 env var 名、CLI flag、JSON schema file、JSON schema language、secret provider API、真实产品 endpoint 或部署命令。
- hot reload、runtime reload、last-known-good、config center 或 admin override;P0 中这些均为 unsupported。
- 配置变更审批、变更审计、rollback 和迁移策略;这些由 Step 10 / Step 13 继续定义。

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_04_categories_boundaries.md` | 已审核通过 | 提供 startup、job-run-start、entry-local、test fixture、static design boundary 和 P0 no hot update |
| `04_config_step_05_sources_priority_conflicts.md` | 已审核通过 | 提供 ordinary source 优先级、conflict fail-fast、entry-local 不覆盖全局和 raw secret forbidden |
| `04_config_step_06_environment_profiles_matrix.md` | 已审核通过 | 提供 profile 与 adapter mode compatibility、operations-replay 和 P1/P2 profile 边界 |
| `04_config_step_07_config_items.md` | 已审核通过 | 提供十二个配置域、配置项类型、默认、必填、来源、作用域、生效、敏感级别和失败策略 |
| `04_config_step_08_sensitive_secrets.md` | 已审核通过 | 提供 sensitive ref、secret、forbidden body、redacted digest、禁止输出和 profile sensitive handling |
| `03-详细设计.md` §13 | 已完成 | 提供 config ownership、runtime builder order、adapter binding、secret-free / body-free config boundary |
| `03-详细设计.md` §14~§15 | 已完成 | 提供 runtime/config observability、redaction 和 config/runtime/adapter test cut |
| 旧 `04_config_step_09_loading_validation_activation.md` | 历史诊断输入 | 只用于识别旧名、旧口径和缺失矩阵;本 Step 按新版 Step 4~8 重写 |
| `L1-governance` Step 9 calibration | 参考样式 | 只参考加载流程图、校验矩阵和 assembly target 粒度,不复用 governance 字段 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 配置在什么时机加载? | startup runtime config 在 runtime builder 创建 application facade、API / worker / jobs entry 前加载、合并、校验并冻结。job-run-start 参数在每次 operations job reserve / dispatch 前解析并冻结到该 run。entry-local 参数只在当前 entry 解析,不得覆盖全局 config。test fixture 只在 local-dev / ci-test 的 fake runtime 或 test harness 组装前加载。P0 不支持 reload / hot。 |
| 配置如何 parse 和 type validate? | 运行时配置必须是严格 JSON。source merge 后先解析 top-level object 和十二个模块,再校验 known fields、enum、bool、integer、positive range、string non-empty、nullable refs、list uniqueness、map key/value 和 lower_snake_case key。JSONC 只允许文档示例,运行时 parser 必须拒绝注释。 |
| 哪些配置需要 range validate? | batch、max_attempts、retention_days、page / query limit、retry/backoff policy ref presence、job run bounded input、fixture timestamp / seed selector 等需要 range 或 non-empty 校验。本 Step 只定义语义范围和失败策略,不锁定产品容量 sizing 或具体 upper bound 数值。 |
| 哪些配置需要 cross-field validate? | profile 与 adapter mode、profile 与 fixture/test override、store mode 与 `dsn_ref`、durable store 与 migration baseline、actor context 与 no-auth boundary、role source mode 与 fixture/snapshot refs、publisher mode 与 endpoint/topic refs、outbox failure mode、operations-replay 与 replay refs、external endpoint mode 与 endpoint refs、handoff target、audit sink/redaction、redline guard、batch 与 entry/job max 均需交叉校验。 |
| 哪些配置 startup / reload / hot / build-time / static? | P0 只有 startup、job-run-start、entry-local、test harness 和 static design boundary。`reload` / `hot` unsupported,出现 reload/hot config 应 validation reject。build-time 只属于 workspace dependency / feature discipline,不是 runtime config。 |
| 校验失败后如何处理? | startup 配置错误 fail-fast,不暴露 runtime facade。job-run-start 错误 reject current job run,不得 reserve / run mutation。entry-local 错误 reject current entry。test fixture 错误 test fail-fast。高优先级非法值不得 fallback。raw secret / forbidden body 进入普通配置直接 validation reject。 |
| 每个配置项 / 配置组的加载时机、校验方式、生效方式和失败策略是否与 Step 7 一致? | 是。§7.2 和 §7.3 按 Step 7 十二个配置域闭合加载、校验、生效、assembly target 和失败策略。 |
| 每个配置域加载校验完成后是否通过停审? | 已通过。§7.8 逐域停审;必填、类型、范围、cross-field、sensitive validation、activation 和 `03` 影响均有记录。 |
| 所有加载校验完成后是否存在未校验必填项、cross-field 缺口、热更新无回滚或 runtime builder 影响未回写 `03`? | 已审计。当前无 unresolved 缺口。P0 rejects reload/hot,因此无 last-known-good / rollback 半契约。若实现需要正式 loader struct、validator API、config error enum 或 secret provider resolution,必须回写 `03`。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 7 配置项清单 | 已列字段、类型、失败策略,但未形成统一加载执行顺序 | 本 Step 定义 source merge -> strict JSON parse -> type/range/cross-field/sensitive validation -> assembly -> facade exposure |
| Step 8 敏感配置 | 已定义 opaque refs 和禁止输出,但需要进入加载校验链 | 本 Step 把 raw secret/body reject、sensitive ref shape 和 redacted issue surface 纳入 validation |
| Step 4 P0 无 hot update | 已定义类别边界,但 Step 9 需要具体 activation reject 规则 | 本 Step 明确 reload/hot unsupported,出现即 validation reject |
| 新版 `03` §13 | 已定义 builder order,但不定义完整 config schema 或 loader function | 本 Step 留在 `04` 语义层,不新增代码契约 |
| 旧 Step 9 | 存在旧名、过早 secret resolve、warning/reject 混用和旧 external port 口径 | 本 Step 全量替换为新版 Step 4~8 结论 |
| 正式 `04` | 尚未装配 | 本 Step 只生成中间产物,正式文档等 Step 15 写入 |

## 5. 改动前后对比

| 项 | 改动前 | 本步后 | 原因 |
|---|---|---|---|
| 加载顺序 | 旧稿只有粗略 overlay -> validate -> assembly | 明确 source merge、strict JSON parse、known-field、type/range、cross-field、sensitive、activation、assembly、facade exposure | 支撑测试和实现审计 |
| JSONC 口径 | Step 7 完整 demo 使用 JSONC | 运行时配置只接受严格 JSON;JSONC 仅文档示例 | 防止文档注释误进 parser |
| secret ref 处理 | 旧稿写 secret resolve 容易暗示 provider API | 改为 ref-shape / sensitive validation;future provider 仅作为回写点 | 避免在 `04` 补 secret provider 契约 |
| cross-field 校验 | 旧稿零散列举 | 按配置域和独立矩阵双写 | 防遗漏 profile/adapter/topic/redline/replay |
| job-run-start | 旧稿可能像全局 overlay | 明确只冻结当前 run,不覆盖 startup invariant | 避免 job input 越权 |
| reload/hot | 旧稿已说不支持但缺 activation reject | 明确 presence of reload/hot config => validation reject | 防半实现 |
| `03` 影响 | 旧稿说实现若需要类型则回写 | 保留该判定,并扩展到 loader API、error enum、provider resolution | 保持 1:1 设计边界 |

## 6. 配置设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 运行时是否接受 JSONC | A. 接受 JSONC;B. 只接受严格 JSON | 采用 B。JSONC 只用于文档说明 |
| 高优先级非法值是否 fallback | A. fallback;B. fail-fast | 采用 B。承接 Step 5 |
| loader 是否解析真实 secret provider | A. 在 P0 定义;B. 只校验 refs,provider 留 future design | 采用 B。当前 `03` 未定义 provider port / error |
| adapter availability 是否由 loader 探测 | A. loader 探测真实依赖;B. loader 校验配置,assembly 产出 adapter mode / availability marker | 采用 B。避免启动探测变成业务成功 |
| job input 是否覆盖全局 config | A. 覆盖;B. 只生成 run-local frozen params | 采用 B。承接 Step 4 / Step 5 |
| reload/hot 是否预留字段 | A. 预留字段;B. P0 显式 unsupported | 采用 B。没有 rollback / last-known-good contract |
| validation issue 是否输出 raw value | A. 输出便于排障;B. redacted issue refs only | 采用 B。承接 Step 8 |
| range 上限是否锁具体产品容量 | A. 锁定;B. 定义正数/有界语义,容量 sizing 留 P1/P2 | 采用 B。当前不做产品部署 sizing |

## 7. 结构化中间产物

### 7.1 配置加载流程图

#### 配置加载流程图: L1-identity 配置加载、校验与生效

```text
[code defaults]
  -> [optional strict JSON config file]
  -> [environment variable overrides]
  -> [entry-local selector / job input where allowed]
  -> [source merge with conflict detection]
  -> [strict JSON parse]
  -> [known-field validation]
  -> [type / enum / range / ref-shape validation]
  -> [cross-field validation]
  -> [sensitive / forbidden material validation]
  -> [activation validation: no reload / hot in P0]
  -> [validated config snapshot]
  -> [IdentityRuntimeConfigShell / validated config-bound markers]
  -> [runtime builder: store registry + adapter registry + ports]
  -> [application facade]
  -> [api / worker / jobs entries]
```

关键说明:

- `entry-local selector / job input` 不是全局覆盖层,只影响当前 entry 或当前 job run。
- `strict JSON parse` 不接受 JSONC 注释;JSONC 只用于 Step 7 文档示例。
- `ref-shape validation` 校验 opaque refs 和 safe selectors,不解析真实 secret material。
- `cross-field validation` 和 sensitive validation 必须在 runtime builder 暴露 facade 前完成。
- builder assembled 只表示 wiring ready,不代表 adapter healthy、publisher delivered、handoff delivered 或 business accepted。
- P0 没有 reload/hot path;配置变化通过 restart 或 new job run 生效。

### 7.2 配置加载校验总表

| 配置项 / 配置组 | 加载时机 | 校验方式 | 生效方式 | 失败策略 |
|---|---|---|---|---|
| `profile.*` | startup;profile selector 可 entry-local | enum、known profile、`p0-safe` policy、test override compatibility | startup 冻结;entry-local 仅当前入口 | invalid fail-fast / entry rejected |
| `store.*` | startup | known mode、required fields、ref shape、migration baseline、transaction mode、idempotency true、retention positive | runtime builder store registry / UnitOfWork | required missing / invalid fail-fast |
| `actor_context.*` | startup + per-entry metadata | bool invariant、trusted profile enum、trace/idempotency presence rule | entry validators and operation context factory | startup fail-fast / current entry rejected |
| `role_catalog.*` | startup;test fixture before fake runtime | source mode enum、snapshot/fixture ref shape、fingerprint required、unknown strategy | role/capability resolver adapter | invalid startup fail-fast |
| `bus.*` | startup | publisher mode enum、endpoint ref shape、topic map ref shape、known event kind true | publisher adapter + topic binding | missing enabled topic / invalid mode fail-fast |
| `outbox.*` | startup;batch may be job-run-start | non-empty store name、positive batch、max attempts positive、backoff ref shape、failure mode enum | outbox repository + publish job defaults / frozen run params | startup fail-fast / current job rejected |
| `projection.*` | startup;batch/checkpoint selector may be job-run-start | non-empty names、positive batch、not-ready enum | projection repository + query guard + rebuild defaults | startup fail-fast / current job rejected |
| `operations.*` | startup defaults;run-local refs at job-run-start | run id required bool、replay refs required by profile、propagation retry enabled/profile compatibility | jobs entry guard + frozen job params | current job rejected |
| `external_refs.*` | startup | mode enum、explicit disabled,endpoint ref required for endpoint,profile compatibility | external resolver / handoff adapter availability | startup fail-fast or fail-closed by Step 11 |
| `audit.*` | startup | sink mode enum、sink ref required when endpoint、compensation true、redaction profile enum | audit / trace / observability hooks | startup fail-fast |
| `redline.*` | startup/static guard | all booleans true;source override false forbidden | runtime redline guard | startup fail-fast |
| `fixture.*` | startup/test harness | clock/id mode enum、seed ref shape、profile compatibility | Clock / Id adapter or fake runtime seed | startup/test fail-fast |
| activation controls | startup validation | no reload/hot/config-center/admin-override flags in P0 | static unsupported | validation reject |

### 7.3 按配置域组织的加载 / 校验 / 生效表

| 配置域 | 配置项 / 配置组 | parse | type / range validate | cross-field validate | assemble target | 失败策略 |
|---|---|---|---|---|---|---|
| profile | `profile.name` | JSON string | allowed P0 profile enum | entry-local selector only current entry;staging/production-like not P0 must-pass | validated profile marker | fail-fast / reject entry |
| profile | `profile.adapter_mode_policy` | JSON string | enum:`p0-safe` | all configured adapter modes must comply | runtime builder policy marker | fail-fast |
| profile | `profile.allow_test_override` | JSON bool | bool | true only local-dev / ci-test | fixture gate | fail-fast |
| store | `store.mode` + `store.dsn_ref` | JSON enum/ref/null | mode enum,ref shape | durable requires `dsn_ref`;in-memory must not carry raw DSN | store registry / repository factory / UoW | fail-fast |
| store | `store.migration.required_version` | JSON string | non-empty | durable / controlled store must match schema baseline marker | migration gate marker | fail-fast |
| store | `store.transaction_mode` | JSON string | enum:`single-uow` | no alternative transaction mode allowed | UnitOfWork guard | fail-fast |
| store | `store.idempotency.enabled` | JSON bool | bool | must be true | idempotency repository binding | fail-fast |
| store | `store.dead_letter.retention_days` | JSON integer | positive bounded integer | retention cannot undercut replay / quarantine policy,exact window finalized Step 11/12 | worker dead-letter retention marker | fail-fast |
| actor_context | `actor_context.required` / `require_trace_id` / `idempotency_key_required` | JSON bool | bool | all required true for write paths | entry validators | fail-fast / reject entry |
| actor_context | `actor_context.trusted_context_profile` | JSON enum | trusted-upstream / fixture | fixture only local-dev / ci-test;identity still no auth | entry context mapper | fail-fast |
| role_catalog | `source_mode` + `snapshot_ref` + `fixture_ref` | JSON enum/ref/null | enum/ref shape | fake requires fixture in local/CI;controlled/endpoint requires snapshot or protected source ref;disabled cannot accept write requiring role validity | resolver adapter marker | fail-fast |
| role_catalog | `fingerprint_required` / `unknown_role_strategy` | JSON bool/enum | true / reject-write | cannot be relaxed | source consistency guard | fail-fast |
| bus | `publisher_mode` + `endpoint_ref` | JSON enum/ref/null | mode enum,ref shape | endpoint requires endpoint_ref;disabled means publisher job rejected/disabled by Step 11 | publisher adapter marker | fail-fast |
| bus | `topic_map_ref` + `require_known_event_kind` | JSON ref/bool | ref shape,true | publisher enabled requires topic map covering all identity outbound event kinds | topic binding marker | fail-fast |
| outbox | `store_name` | JSON string | non-empty | logical store must be distinct enough for outbox semantics | outbox repository binding | fail-fast |
| outbox | `publish.batch_size` / `max_attempts` | JSON integer | positive bounded integer | job input may lower,not exceed startup max | publish job defaults / run params | fail-fast / reject job |
| outbox | `backoff_policy_ref` / `failure_mode` | JSON ref/enum | ref shape,enum | failure_mode must be `mark-failed-no-rollback` | retry policy marker | fail-fast |
| projection | `store_name` / `checkpoint_name` | JSON string | non-empty | query must not rebuild or synthesize checkpoint | projection repo / checkpoint marker | fail-fast |
| projection | `rebuild.batch_size` / `query.not_ready_strategy` | JSON integer/enum | positive bounded / return-not-ready | not-ready cannot trigger write or external body read | rebuild defaults / query guard | fail-fast / reject job |
| operations | `run_id_required` | JSON bool | true | every operations job requires run identity | jobs entry guard | fail-fast / reject job |
| operations | `replay.report_root_ref` / `input_root_ref` | JSON ref/null | ref shape | operations-replay requires both refs and de-identified marker | frozen replay run input | reject job |
| operations | `propagation_retry.enabled` | JSON bool | bool | disabled rejects retry job;enabled cannot reopen terminal states | retry job availability marker | fail-fast / reject job |
| external_refs | artifact / memory / governance `mode` + `endpoint_ref` | JSON enum/ref/null | enum,ref shape | endpoint requires endpoint_ref;disabled/fail-closed semantics preserved | resolver adapter availability marker | fail-fast / fail-closed |
| external_refs | `work_source.mode` | JSON enum | disabled/fake/controlled/endpoint | fake only local/CI;disabled means no work source consumption | work source resolver marker | fail-fast |
| external_refs | `trace_handoff.target_ref` | JSON ref/null | ref shape | DeliverTraceHandoff enabled requires target;job input target must be allowed | handoff adapter target marker | fail-fast / reject job |
| audit | `sink_mode` + `sink_ref` | JSON enum/ref/null | enum,ref shape | endpoint requires sink_ref;core audit cannot be disabled | audit sink marker | fail-fast |
| audit | `compensation_enabled` / `redaction_profile` | JSON bool/enum | true / identity-safe | cannot relax compensation or redaction profile | audit compensation and redaction hooks | fail-fast |
| redline | all guards | JSON bool | true | any false or source override false forbidden | startup redline guard | fail-fast |
| fixture | `clock_mode` / `id_sequence_mode` | JSON enum | allowed enum | fixed/deterministic only local-dev / ci-test unless controlled runtime explicitly allowed | Clock / Id adapter marker | fail-fast |
| fixture | `seed_ref` | JSON ref/null | ref shape | ci-test deterministic suites require seed;no raw body/secret | fake runtime seed marker | test fail-fast |

### 7.4 Cross-field validation matrix

| 规则编号 | Cross-field rule | Inputs | Validation | Failure |
|---|---|---|---|---|
| ID-CFG-XF-001 | profile vs test override | `profile.name`, `profile.allow_test_override` | only local-dev / ci-test may enable test override | startup fail-fast |
| ID-CFG-XF-002 | profile vs fixture | `profile.name`, `fixture.*`, `role_catalog.fixture_ref` | fixtures only local-dev / ci-test | startup/test fail-fast |
| ID-CFG-XF-003 | profile vs adapter mode | all `*.mode`, `profile.adapter_mode_policy` | no mode outside `p0-safe`;production-like future rejects fake | startup fail-fast |
| ID-CFG-XF-004 | store durable vs dsn ref | `store.mode`, `store.dsn_ref` | durable requires opaque dsn ref;raw DSN forbidden | startup fail-fast |
| ID-CFG-XF-005 | migration baseline | `store.mode`, `store.migration.required_version` | durable/controlled store baseline must match expected marker | startup fail-fast |
| ID-CFG-XF-006 | transaction / idempotency invariants | `store.transaction_mode`, `store.idempotency.enabled` | `single-uow` and true only | startup fail-fast |
| ID-CFG-XF-007 | actor context no-auth boundary | `actor_context.*`, config sources | no token/session/credential validation config allowed in identity | startup fail-fast |
| ID-CFG-XF-008 | actor trace/idempotency requirements | `actor_context.require_trace_id`, `idempotency_key_required` | write entries require trace/idempotency metadata | current entry rejected |
| ID-CFG-XF-009 | role fake source | `role_catalog.source_mode`, `fixture_ref`, profile | fake requires fixture and test/local profile | startup fail-fast |
| ID-CFG-XF-010 | role controlled/endpoint source | `source_mode`, `snapshot_ref` | controlled/endpoint requires snapshot/protected source ref | startup fail-fast |
| ID-CFG-XF-011 | role source invariants | `fingerprint_required`, `unknown_role_strategy` | fingerprint true;unknown role reject-write | startup fail-fast |
| ID-CFG-XF-012 | bus endpoint | `bus.publisher_mode`, `endpoint_ref`, `topic_map_ref` | endpoint requires endpoint_ref and topic_map_ref | startup fail-fast |
| ID-CFG-XF-013 | topic completeness | `bus.topic_map_ref`, outbound event kind catalog | topic map covers all enabled identity outbound event kinds | startup fail-fast |
| ID-CFG-XF-014 | outbox failure invariant | `outbox.publish.failure_mode` | must be `mark-failed-no-rollback` | startup fail-fast |
| ID-CFG-XF-015 | batch / max attempts ranges | outbox/projection batch, `max_attempts` | positive bounded;job input cannot exceed startup max | startup fail-fast / job rejected |
| ID-CFG-XF-016 | projection query no-write | `projection.query.not_ready_strategy` | must be `return-not-ready` and not trigger rebuild | startup fail-fast |
| ID-CFG-XF-017 | operations replay profile | `profile.name`, `operations.replay.*_ref`, job input | operations-replay requires report/input refs and run id | job rejected |
| ID-CFG-XF-018 | propagation retry terminal guard | `operations.propagation_retry.enabled` | enabled retry cannot reopen terminal outbox/handoff states | job rejected by flow |
| ID-CFG-XF-019 | external endpoint refs | `external_refs.*.mode`, `endpoint_ref` | endpoint requires endpoint_ref;disabled explicit allowed | startup fail-fast |
| ID-CFG-XF-020 | governance basis fail-closed | `external_refs.governance_basis.mode` | disabled/unavailable high-risk action fails closed | current command rejected/fail-closed |
| ID-CFG-XF-021 | work source disabled | `external_refs.work_source.mode` | disabled means worker does not consume work source events | startup/worker guard |
| ID-CFG-XF-022 | handoff target | `external_refs.trace_handoff.target_ref`, job input | enabled delivery requires allowed target ref | job rejected |
| ID-CFG-XF-023 | audit sink and compensation | `audit.sink_mode`, `sink_ref`, `compensation_enabled` | endpoint requires sink_ref;compensation true | startup fail-fast |
| ID-CFG-XF-024 | redaction profile | `audit.redaction_profile` | must be `identity-safe` in P0 | startup fail-fast |
| ID-CFG-XF-025 | redline guards | all `redline.*` | all true;no env false override | startup fail-fast |
| ID-CFG-XF-026 | fixture deterministic mode | `fixture.clock_mode`, `id_sequence_mode`, profile | fixed/deterministic only local-dev / ci-test | startup/test fail-fast |
| ID-CFG-XF-027 | sensitive refs | all sensitive / sensitive-adjacent refs | raw secret/body patterns rejected;issue surface redacted | startup fail-fast / job rejected |
| ID-CFG-XF-028 | no static invariant override | any config source | truth/state/query/outbox/idempotency invariants not configurable | validation reject |
| ID-CFG-XF-029 | reload / hot unsupported | any activation config | no reload/hot/config center/admin override in P0 | validation reject |

### 7.5 生效方式矩阵

| 生效方式 | 本项目 P0 口径 | 适用配置 | 失败处理 |
|---|---|---|---|
| static design boundary | 不是配置项 | truth ownership、state matrix、query no-write、outbox accepted-only source、stored replay、transaction order、body-free / secret-free boundary | 配置中出现 override key => validation reject |
| startup | runtime builder 前加载、校验并冻结 | profile、store、actor context guards、role source、bus/topic、outbox defaults、projection defaults、external refs、audit/redline、fixture boundary | invalid => fail-fast,不暴露 facade |
| job-run-start | job run 开始前冻结 | run id、batch lowering、replay roots、handoff target、projection checkpoint selector where allowed、current run scope | invalid => current job rejected,不进入 mutation/job body |
| entry-local | 只影响当前入口 | profile/config source selector where allowed、actor context marker、request metadata、page cursor、job request source、dry-run diagnostic selector | invalid => current entry rejected |
| test harness | fake runtime / fixture load 前生效 | fixed clock、deterministic id、fixture seed、fake adapter seed | invalid => test fail-fast |
| reload | P0 unsupported | 无 | presence of reload config => validation reject |
| hot | P0 unsupported | 无 | presence of hot config => validation reject |
| build-time | 不作为 runtime config | Rust workspace dependency and feature discipline | 由 implementation gate 检查,不是 config loader |

### 7.6 Runtime builder assemble target table

| Validated config group | Assemble target | Exposed to | Not exposed to |
|---|---|---|---|
| `profile.*` | validated profile marker, adapter mode policy marker | infra runtime builder, entry facade | domain, public contracts |
| `store.*` | store registry, repository adapters, UnitOfWork binding, idempotency/result/dead-letter retention markers | application through repository / UoW ports | raw DSN, product store config, raw migration body |
| `actor_context.*` | entry validators, operation context factory constraints | api / worker / jobs entry | auth/token/session implementation |
| `role_catalog.*` | role/capability resolver adapter marker, fixture/snapshot source marker | application resolver port | RoleDefinition / CapabilityDefinition body |
| `bus.*` | publisher adapter marker, topic binding marker | outbox publisher service / worker | event schema mutation or broker credential |
| `outbox.*` | outbox repository binding, publish job default params, retry policy marker | application/outbox job via ports and typed params | current truth reconstruction |
| `projection.*` | projection repository binding, query not-ready guard, rebuild job defaults | query service and jobs facade | query-time writes or ad hoc view refs |
| `operations.*` | jobs entry guard, frozen job run params, replay root digests | jobs entry / operations job services | raw replay body or truth repair capability |
| `external_refs.*` | resolver / handoff adapter availability markers | application through resolver / handoff ports | sibling repo DTO/body, raw endpoint credential |
| `audit.*` | audit sink marker, trace/audit hooks, redaction profile marker | infra/api/worker/jobs observability hooks | raw log target credential or raw matched values |
| `redline.*` | startup redline guard marker | runtime validator and tests | runtime relax path |
| `fixture.*` | fake runtime seed marker, Clock / Id adapter marker | test harness, local fake runtime | production-like runtime |

### 7.7 Config validation issue surface

| Issue class | Created by | Carries | Must not carry |
|---|---|---|---|
| `ParseFailed` | strict JSON parser | config source ref,redacted location,issue ref | raw file body |
| `UnknownModule` | known-module validator | module name,issue ref | raw module body |
| `UnknownField` | known-field validator | module path,field name,issue ref | raw value |
| `DuplicateKey` | source parser / merger | config source ref,key path,issue ref | duplicate raw value |
| `UnsupportedSource` | source loader | source kind,profile,issue ref | source body |
| `MissingRequired` | schema validator | module path,field name,issue ref | secret |
| `InvalidType` | type validator | module path,expected type,issue ref | raw sensitive value |
| `InvalidEnum` | enum validator | module path,allowed value class,issue ref | raw sensitive value |
| `InvalidRange` | range validator | module path,range class,issue ref | raw body |
| `InvalidRefShape` | ref-shape validator | module path,ref kind,issue ref | full sensitive ref when sensitive |
| `CrossFieldConflict` | cross-field validator | involved module paths,rule ref,issue ref | raw values when sensitive |
| `ForbiddenSecretMaterial` | sensitive validator | module path,forbidden material class,issue ref | detected material |
| `ForbiddenBodyMaterial` | body-free validator | module path,forbidden body class,issue ref | detected body |
| `ForbiddenInvariantOverride` | static boundary validator | forbidden key class,issue ref | attempted payload |
| `UnsupportedActivation` | activation validator | requested activation kind,issue ref | raw config |
| `UnsafeRedactionRelax` | redline / redaction validator | guard/profile path,issue ref | attempted raw value |

### 7.8 加载校验停审记录

| 配置域 / 配置组 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| profile | known profile、adapter policy、test override、entry-local scope | 通过 | staging/production-like 保持 P1/P2 |
| store | mode/dsn/migration/transaction/idempotency/dead-letter | 通过 | durable product schema 留 P1/P2 |
| actor_context | no-auth、trace、idempotency metadata、fixture profile | 通过 | 不新增 auth 配置 |
| role_catalog | source mode、fixture/snapshot refs、fingerprint、unknown strategy | 通过 | 不保存 RoleDefinition body |
| bus | publisher mode、endpoint ref、topic map、known event kind | 通过 | topic registry owner Step 14 跟踪 |
| outbox | store name、batch、max attempts、backoff、no rollback | 通过 | runtime failure 细节由 Step 11 |
| projection | store/checkpoint、batch、not-ready no-write | 通过 | query no-write 保持 |
| operations | run id、replay refs、retry enablement | 通过 | replay artifact/report owner Step 12/14 承接 |
| external_refs | endpoint refs、disabled/fail-closed、work source mode | 通过 | P1 endpoint 产品留后续 |
| audit | sink/ref、compensation、redaction profile | 通过 | compensation 不可关闭 |
| redline | all guards true and no source relax | 通过 | false fail-fast |
| fixture | fixed/deterministic/seed test-only | 通过 | production-like rejected |
| activation | reload/hot/config center/admin override unsupported | 通过 | future reload requires `03` |
| validation issue surface | redacted issue refs, no raw value | 通过 | exact digest algorithm留 Step 10/14 |

### 7.9 跨加载校验审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 未校验必填项 | 未发现 | Step 7 required fields covered by §7.2 / §7.3 |
| 类型 / 范围校验缺口 | 未发现 | enum/bool/int/ref/list/map/non-empty/positive covered |
| cross-field 缺口 | 未发现 | profile、store、actor、role、bus、outbox、projection、operations、external refs、audit、redline、fixture covered |
| hot/reload 无回滚 | 不适用 | P0 rejects reload/hot config |
| 高优先级非法值 fallback | 无 | fail-fast |
| raw secret/body 进入 issue surface | 不允许 | issue carries only redacted refs / classes |
| runtime builder 半装配暴露 facade | 不允许 | validation complete before facade exposure |
| job input 覆盖 startup invariant | 不允许 | job input only run-local frozen params |
| entry-local 覆盖 global config | 不允许 | entry-local only current entry |
| adapter availability 被解释为 business accepted | 不允许 | assembly marker is not adapter healthy or delivered |
| 实现需要新增 loader / validator / error / provider contract | 可能 | 若需要代码契约,必须回写 `03`;当前 `04` 不定义 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---|---|---|---|
| 运行时配置只接受严格 JSON,JSONC 仅用于文档示例 | 否 | 配置格式规则 | 不适用 | 无回写 |
| P0 加载链固定为 source merge -> strict parse -> known-field -> type/range/ref-shape -> cross-field -> sensitive -> activation validate -> runtime builder assembly | 否 | 承接 `03` §13 builder order | 不适用 | 无回写 |
| reload / hot / config center / admin override 在 P0 unsupported,出现即 reject | 否 | 承接 Step 4 / Step 5 | 不适用 | 无回写 |
| builder facade exposure 必须晚于 validation complete | 否 | 承接 `03` §13 runtime builder boundary | 不适用 | 无回写 |
| config validation issue surface 只输出 redacted issue refs and failure classes | 否 | 承接 Step 8 / `03` §14 observability | 不适用 | 无回写 |
| job-run-start 和 entry-local 只冻结当前 run / entry,不得覆盖 startup invariant | 否 | 承接 entry facade restriction and idempotency boundary | 不适用 | 无回写 |
| 若后续要求 formal loader struct、validator API、config error enum、runtime reload、last-known-good、secret provider resolution、product-specific adapter constructor 或 config center | 是 | runtime config / builder / adapter constructor / error / rollback / audit contract | `03` §13~§15 或对应 object-port-flow Step | 阻塞待确认 |

## 9. 回填草稿

正式 `04-配置设计.md` §9 可回填:

```md
## 9. 配置加载、校验与生效机制

> 校准来源:
> - `design-calibration/04_config_step_09_loading_validation_activation.md`

`L1-identity` 的运行时配置只接受严格 JSON。完整文档示例中的 JSONC 注释不得进入 runtime parser。P0 加载链为 code defaults、optional strict JSON config file、environment variable overrides、entry-local selector / job input where allowed、source merge with conflict detection、strict JSON parse、known-field validation、type / enum / range / ref-shape validation、cross-field validation、sensitive / forbidden material validation、activation validation、validated config snapshot、runtime builder assembly 和 entry facade exposure。

startup 配置在 runtime builder 暴露 API / worker / jobs facade 前完成校验并冻结。job-run-start 参数只冻结当前 job run,不得覆盖 startup invariant。entry-local 参数只影响当前 entry。test fixture 只在 local-dev / ci-test 的 test harness 或 fake runtime 组装前生效。P0 不支持 reload、hot、config center 或 admin override。

校验失败按作用域处理:startup fail-fast;job-run-start reject current job;entry-local reject current entry;test fixture fail test startup。所有 validation issue 只输出 redacted issue refs、safe failure classes、module paths 和 rule refs,不得输出 raw secret、full sensitive ref、external body、adapter raw response 或 fake private fixture map。
```

## 10. 待确认事项

| 编号 | 待确认事项 | 影响 | 当前处理 |
|---|---|---|---|
| ID-CONFIG-Q37 | 实现是否需要正式 `IdentityRuntimeConfig` / config loader / validator API | 影响 `03` object / infra contract | 当前不新增;若实施需要 1:1 类型,先回写 `03` |
| ID-CONFIG-Q38 | config validation issue enum 是否需要进入 public / infra error model | 影响错误契约和测试断言 | 当前作为 `04` issue surface;若改变 `03` error enum,需回写 |
| ID-CONFIG-Q39 | batch / retention / page upper bound 是否需要产品容量 sizing | 影响 production-like tuning | P0 只定义 positive / bounded 语义;容量 sizing 留 P1/P2 / 运维 |
| ID-CONFIG-Q40 | topic map owner 与 outbound event kind catalog 如何在 implementation 读取 | 影响 `bus.topic_map_ref` validation | Step 12/14 继续记录下游承接,不在 Step 9 补 port |
| ID-CONFIG-Q41 | validation issue digest / redacted ref digest 算法是否固定 | 影响 audit/evidence 稳定性 | Step 10/14 再定语义;若要代码算法,回写 `03` |
| ID-CONFIG-Q42 | future reload / last-known-good / config center 是否进入路线 | 影响 runtime reload / rollback / audit | P0 unsupported;Step 13/14 记录演进风险 |

## 11. 进入下一步条件

- 配置加载流程图已完成。
- strict JSON / JSONC 文档示例边界已明确。
- parse、known-field、type、range、ref-shape、cross-field、sensitive / forbidden material validation 已覆盖。
- 十二个配置域的加载时机、生效方式、assembly target 和失败策略已明确。
- P0 reload / hot / config center / admin override unsupported 口径已明确。
- Config validation issue surface 已定义为 redacted issue refs,不输出 raw secret / body。
- 加载校验停审和跨加载校验审计没有 unresolved 冲突。
- 对 `03-详细设计.md` 的影响判定已记录,当前无必须回写项。
- 未提前定义 Rust struct、loader function、env var、secret provider API、real endpoint、error enum、测试编号、evidence 路径或 implementation boundary。

下一步进入 Step 10:定义配置变更、审计与回滚。
