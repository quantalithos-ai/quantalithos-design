# 04 配置设计 Step 7 · 定义配置项清单

> 子项目: `L1-identity`
> 目标文档: `04-配置设计.md`
> SOP Step: Step 7 定义配置项清单
> 状态: 已写入;等待用户审核

---

## 1. Step 状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 7 定义配置项清单 |
| 当前状态 | 已写入;等待用户审核 |
| 输入基线 | Step 3 control plane;Step 4 categories / boundaries;Step 5 sources / priority / conflicts;Step 6 profiles / matrix;新版正式 `03-详细设计.md` §13 |
| 输出文件 | `projects/L1-identity/design-calibration/04_config_step_07_config_items.md` |
| 停审方式 | 本 Step 完成后暂停,审核通过后进入 Step 8 sensitive secrets |

本 Step 把 Step 3~6 已确认的配置控制面、分类边界、来源优先级和 profile 矩阵,整理成 `L1-identity` 可审查、可测试、可验收的配置项清单。

本 Step 只回答:

- 每个 P0 配置域有哪些配置项。
- 每个配置项的类型、默认值、必填性、来源、作用域、生效方式、敏感级别、失败策略和关联模块。
- 每个配置项如何回指 Step 3 控制面、Step 4 分类边界、Step 5 来源规则和 Step 6 profile 矩阵。
- 配置项是否改变 `03-详细设计.md` 的 runtime config、builder、adapter constructor、port、error、DTO 或 flow 契约。
- 模块级严格 JSON demo 和完整 JSONC 文档示例如何表达。

本 Step 不定义 raw secret、真实 endpoint、真实账号、部署命令、secret provider API、配置加载代码、具体 env var 名、CI job 名、evidence 路径或实现仓文件结构。

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | 已审核通过 | 提供配置控制面和配置域 / 功能模块 |
| `04_config_step_04_categories_boundaries.md` | 已审核通过 | 提供 startup、job-run-start、entry-local、sensitive、diagnostic 和禁止配置化边界 |
| `04_config_step_05_sources_priority_conflicts.md` | 已审核通过 | 提供 `defaults < file < env` 来源优先级、冲突处理和 secret ref 边界 |
| `04_config_step_06_environment_profiles_matrix.md` | 已审核通过 | 提供 `local-dev`、`ci-test`、`integration-like`、`operations-replay` profile 差异 |
| `03-详细设计.md` §13 | 已完成 | 提供 `profile/store/actor_context/role_catalog/bus/outbox/projection/operations/external_refs/audit/redline/fixture` 配置组织 |
| `03-详细设计.md` §6~§8 | 已完成 | 提供正式 command/query/event/job 名称、port family 和 body-free protocol surface |
| `03-详细设计.md` §9~§15 | 已完成 | 提供 no-write、transaction、state、stored replay、config binding 和 redaction 红线 |
| 旧 `04_config_step_07_config_items.md` | 历史诊断输入 | 只用于识别旧配置项和旧名漂移;不得作为本 Step 真相源 |
| `L1-governance` Step 7 calibration | 参考样式 | 只参考字段完整度和 demo 组织,不复用治理业务配置项 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 配置项的名称、类型、默认值是什么? | 本 Step 按十二个功能模块定义配置项:`profile`、`store`、`actor_context`、`role_catalog`、`bus`、`outbox`、`projection`、`operations`、`external_refs`、`audit`、`redline`、`fixture`。项目本地 key 不重复 `identity` 前缀。 |
| 哪些配置项必填? | P0 必填项包括 profile name、store mode、transaction/idempotency guard、actor context guard、role/capability source mode、bus publisher mode、topic map ref、outbox store、projection store、audit sink、redline guards、clock/id fixture policy。P1/P2 endpoint 类配置若启用,对应 `*_ref` 必填;未启用必须显式 disabled。 |
| 每个配置项从哪里来、作用域是什么? | 普通项来源遵守 Step 5 `defaults < file < env`;entry-local 只用于当前 entry/job 的 selector 或 run input;test fixture 只用于 local-dev / ci-test。作用域分为 startup runtime、job-run-start、entry-local 和 test harness。 |
| 每个配置项如何生效、是否敏感、失败策略是什么? | P0 无核心 hot update。startup 项在 runtime builder 前校验并冻结;job-run-start 项在 job report / stored replay surface 中固化;entry-local 只影响当前入口。敏感项在本 Step 只允许保存 ref,raw secret/body 由 Step 8 收口。必填缺失或非法必须 fail-fast 或 reject 当前 job/entry。 |
| 每个配置项关联哪些模块? | 每个配置项回指 `identity-infra` config/runtime builder、具体 store / adapter、`identity-api`、`identity-worker`、`identity-jobs` 或 application typed parameter。`identity-domain` 和 `identity-contracts` 不读取配置。 |
| 每个模块的 JSON demo 应该如何写? | 模块级 demo 必须是严格 JSON,用于展示配置 shape。完整示例使用 JSONC 并明确注释只用于文档说明,运行时配置必须去掉注释。 |
| 模块拆分是否按功能边界展开? | 已按功能模块拆分。没有使用 `storage`、`common`、`misc`、`runtime` 等泛化模块承载不同功能。`store` 只承载持久化装配,不混入 bus / audit / fixture。 |
| 项目本地配置是否避免重复项目名前缀? | 是。项目本地 key 为 `profile.name`、`store.mode` 等。若系统级聚合需要,映射为 `identity.profile.name`、`identity.store.mode`,但本仓配置清单不强制带项目名前缀。 |
| 完整配置 demo 是否需要文档注释? | 需要。完整 demo 用 `jsonc` 标注,用于说明 profile 差异和 ref-only 边界。模块级 demo 保持严格 JSON。 |
| 每个配置项是否回指 Step 3~6? | 已在配置域批次表、停审记录和跨配置项审计中回指。 |
| 每个配置域配置项完成后是否通过停审? | 已通过。必填、来源、敏感级别、失败策略和 `03` 影响均有记录。 |
| 所有配置项完成后,是否存在重复项、泛化模块混写、必填无失败策略、敏感级别未归类或 `03` 影响未判定? | 已审计。没有 unresolved 冲突。需要注意的是本 Step 定义的是配置设计 surface;如果后续实施要求正式 `IdentityRuntimeConfig` struct 或 adapter constructor 字段,必须在 `03` 中另行闭合。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 3 配置域 | 已拆控制面,但未形成字段级配置项 | 本 Step 按配置域展开 P0 字段表 |
| Step 4 分类边界 | 已说明 startup / job-run-start / entry-local,但未映射到具体字段 | 本 Step 每项写作用域和生效方式 |
| Step 5 来源规则 | 已定义来源优先级,但未给配置项来源 | 本 Step 每项标注允许来源和失败策略 |
| Step 6 profile 矩阵 | 已定义 profile,但未给每个 profile 的配置结构 | 本 Step 给 profile 可用的 store/adapter/job/fixture 配置项 |
| 新版 `03` §13 | 给出 config section 和代码绑定点,但缺少文件结构、默认值和示例 | 本 Step 只在 `04` 层定义配置项清单和 JSON demo |
| 旧 Step 7 | 含旧 command/job/port 名和旧环境口径 | 本 Step 全量替换为新版 `03` 名称和 Step 3~6 结论 |

## 5. 改动前后对比

| 项 | 改动前 | 本步后 | 原因 |
|---|---|---|---|
| 配置项组织 | 分散候选 | 按十二个功能模块组织 | 避免泛化模块和遗漏 |
| profile 名称 | 旧 dev/test/staging 输入 | `local-dev`、`ci-test`、`integration-like`、`operations-replay` | 对齐 Step 6 |
| adapter mode | mock/stub 混写 | `fake`、`controlled`、`endpoint`、`disabled` | 区分 profile 与 adapter |
| secret | 可能被误写成字符串 | 仅使用 `*_ref` | 防 raw secret 入文档 |
| JSON demo | 尚无 | 模块级严格 JSON demo + 完整 JSONC 文档示例 | 支撑配置设计书写规范和实现 schema |
| `03` 影响 | Step 13 不写具体 key | 本 Step 不新增 runtime object / port;只为既有绑定点命名和定默认 | 当前无回写 |

## 6. 配置设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否只输出全局配置项表 | A. 只列全局表;B. 按配置域分批并停审 | 采用 B。SOP 要求配置域小循环闭环 |
| 顶层是否加 `identity` 前缀 | A. 项目本地也加 `identity`;B. 项目本地不重复前缀,系统聚合另行映射 | 采用 B。避免项目本地配置冗余 |
| 是否用泛化模块承载配置 | A. 使用 `storage/common/misc`;B. 使用正式 config sections | 采用 B。承接 `03` §13 的十二个 section |
| adapter mode 是否引入产品枚举 | A. 写 PostgreSQL/NATS/Vault 等产品;B. 写 `in-memory/fake/controlled/endpoint/disabled` 语义 | 采用 B。P0 不锁产品,真实产品留 ADR / P1/P2 |
| 模块级 demo 是否使用 JSONC | A. 使用 JSONC;B. 使用严格 JSON | 采用 B。避免误导运行配置支持注释 |
| 完整 demo 是否使用 JSONC | A. 使用 JSON;B. 使用 JSONC 文档示例 | 采用 B。便于说明,但明确运行时必须去注释 |

## 7. 结构化中间产物

### 7.1 配置项命名和组织规则

| 规则 | 结论 |
|---|---|
| 配置文件格式 | 默认严格 JSON;完整文档示例可使用 JSONC,但运行时必须删除注释 |
| 顶层命名 | 项目本地文件不重复 `identity` 前缀 |
| 系统聚合映射 | 若未来统一聚合配置,映射为 `identity.<module>.<setting>`;本 Step 不要求实现聚合 loader |
| 模块拆分 | 按 `profile`、`store`、`actor_context`、`role_catalog`、`bus`、`outbox`、`projection`、`operations`、`external_refs`、`audit`、`redline`、`fixture` |
| 字段风格 | JSON 使用 lower_snake_case,与 `03` §13 config section 命名一致 |
| 敏感字段 | 字段只能保存 `*_ref`;不得保存 raw secret、token、URL credential、SQL、HTTP body、external payload body |
| 默认值策略 | P0 defaults 支撑 local-dev / ci-test;integration-like 和 operations-replay 通过 file/env/job input 补 ref |
| 失败策略 | startup invalid fail-fast;job invalid rejected;entry-local invalid reject current entry;fixture invalid test fail-fast |

### 7.2 配置项清单

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `profile.name` | enum:`local-dev` / `ci-test` / `integration-like` / `operations-replay` | `local-dev` | 是 | default/file/env/entry-local selector | runtime / entry | startup / current entry | internal | 非法值 fail-fast | infra config, api, worker, jobs |
| `profile.adapter_mode_policy` | enum:`p0-safe` | `p0-safe` | 是 | default/file | runtime | startup | internal | 非法值 fail-fast | runtime builder |
| `profile.allow_test_override` | bool | profile-derived | 是 | default/file/env | runtime | startup | internal | integration-like 为 true 时 fail-fast | test harness |
| `store.mode` | enum:`in-memory` / `durable` / `controlled` | profile-derived | 是 | default/file/env/test override | runtime | startup | internal | 缺失 fail-fast | repositories,UoW |
| `store.dsn_ref` | secret ref/null | null | durable 时必填 | file/env -> secret refs | runtime | startup | sensitive-ref | durable 缺失 fail-fast | persistence adapter |
| `store.migration.required_version` | string | `identity-schema-p0` | durable 时必填 | default/file/env | runtime | startup | internal | 不匹配 fail-fast | migration gate |
| `store.transaction_mode` | enum:`single-uow` | `single-uow` | 是 | default/file | runtime | startup | internal | 非法值 fail-fast | UnitOfWork |
| `store.idempotency.enabled` | bool | true | 是 | default | runtime | startup/static | internal | false fail-fast | idempotency store |
| `store.dead_letter.retention_days` | integer | 30 | 是 | default/file/env | runtime | startup | internal | 非法范围 fail-fast | worker dead-letter store |
| `actor_context.required` | bool | true | 是 | default | command/query/event entry | startup | internal | false fail-fast | entry validators |
| `actor_context.require_trace_id` | bool | true | 是 | default/file | command/query/event entry | startup | internal | 缺 trace 拒绝当前入口 | operation context factory |
| `actor_context.trusted_context_profile` | enum:`trusted-upstream` / `fixture` | profile-derived | 是 | file/env/test override | entry | startup | internal | fixture 越界 fail-fast | api/worker/jobs entry |
| `actor_context.idempotency_key_required` | bool | true | 是 | default | command/event/job entry | startup | internal | 缺失拒绝当前写入口 | idempotency facade |
| `role_catalog.source_mode` | enum:`fake` / `controlled` / `endpoint` / `disabled` | profile-derived | 是 | default/file/env/test fixture | runtime | startup | internal | 缺失 fail-fast | role/capability resolver |
| `role_catalog.snapshot_ref` | ref/null | null | controlled/endpoint 时必填 | file/env/secret refs | runtime | startup | ref-sensitive | 缺失 fail-fast when required | role/capability resolver |
| `role_catalog.fixture_ref` | ref/null | profile-derived | local/CI 必填 | file/test fixture | test/runtime | startup | internal | 缺失 fail-fast for local/CI | fake resolver |
| `role_catalog.fingerprint_required` | bool | true | 是 | default/file | runtime | startup | internal | false fail-fast | source consistency guard |
| `role_catalog.unknown_role_strategy` | enum:`reject-write` | `reject-write` | 是 | default | command | startup | internal | 非法值 fail-fast | MaintainRoleCapabilitySummary |
| `bus.publisher_mode` | enum:`fake` / `controlled` / `endpoint` / `disabled` | profile-derived | 是 | default/file/env/test fixture | runtime | startup | internal | 缺失 fail-fast | outbox publisher adapter |
| `bus.endpoint_ref` | secret ref/null | null | endpoint 时必填 | file/env -> secret refs | runtime | startup | sensitive-ref | endpoint 缺失 fail-fast | bus adapter |
| `bus.topic_map_ref` | ref | profile-derived | publisher enabled 时必填 | file/env/test fixture | runtime | startup | ref-sensitive | 缺失阻断 publisher | topic binding port |
| `bus.require_known_event_kind` | bool | true | 是 | default | publisher | startup | internal | false fail-fast | topic validator |
| `outbox.store_name` | string | `identity-outbox` | 是 | default/file/env | runtime | startup | internal | 空值 fail-fast | outbox repository |
| `outbox.publish.batch_size` | integer | 50 | 是 | default/file/env/job input | job | job-run-start | internal | 非法范围拒绝 run | PublishIdentityOutbox |
| `outbox.publish.max_attempts` | integer | 5 | 是 | default/file/env | job | startup/job-run-start | internal | 非法范围 fail-fast | outbox retry policy |
| `outbox.publish.backoff_policy_ref` | ref | `retry:identity-outbox:p0` | 是 | default/file/env | job | startup/job-run-start | internal | 缺失 fail-fast | outbox retry wrapper |
| `outbox.publish.failure_mode` | enum:`mark-failed-no-rollback` | `mark-failed-no-rollback` | 是 | default | job | startup/static | internal | 非法值 fail-fast | outbox state update |
| `projection.store_name` | string | `member-summary-projection` | 是 | default/file/env | runtime | startup | internal | 空值 fail-fast | projection repository |
| `projection.checkpoint_name` | string | `member-summary` | 是 | default/file/env/job input | job/query | startup/job-run-start | internal | 空值拒绝 run | projection checkpoint |
| `projection.rebuild.batch_size` | integer | 100 | 是 | default/file/env/job input | job | job-run-start | internal | 非法范围拒绝 run | RebuildIdentityProjection |
| `projection.query.not_ready_strategy` | enum:`return-not-ready` | `return-not-ready` | 是 | default | query | startup | internal | 非法值 fail-fast | query service |
| `operations.run_id_required` | bool | true | 是 | default | jobs | startup | internal | 缺失拒绝 run | jobs entry |
| `operations.replay.report_root_ref` | ref/null | null | operations-replay 必填 | file/env/job input | job/report | job-run-start | ref-sensitive | 缺失拒绝 replay run | operations report writer |
| `operations.replay.input_root_ref` | ref/null | null | operations-replay 必填 | file/env/job input | job | job-run-start | ref-sensitive | 缺失拒绝 replay run | replay runner |
| `operations.propagation_retry.enabled` | bool | profile-derived | 是 | default/file/env | job | startup/job-run-start | internal | disabled 时拒绝 retry run | RetryIdentityPropagationFailures |
| `external_refs.artifact_evidence.mode` | enum:`disabled` / `fake` / `controlled` / `endpoint` | `disabled` | 是 | default/file/env | runtime | startup | internal | P1 enabled 缺 ref fail-fast | artifact/evidence resolver |
| `external_refs.artifact_evidence.endpoint_ref` | secret ref/null | null | endpoint 时必填 | file/env -> secret refs | runtime | startup | sensitive-ref | 缺失 fail-fast | artifact/evidence adapter |
| `external_refs.memory_archive.mode` | enum:`disabled` / `fake` / `controlled` / `endpoint` | `disabled` | 是 | default/file/env | runtime | startup | internal | unavailable fail-closed | memory/archive resolver |
| `external_refs.memory_archive.endpoint_ref` | secret ref/null | null | endpoint 时必填 | file/env -> secret refs | runtime | startup | sensitive-ref | 缺失 fail-fast | memory/archive adapter |
| `external_refs.governance_basis.mode` | enum:`disabled` / `controlled` / `endpoint` | `disabled` | 是 | default/file/env | runtime | startup | internal | high-risk action fail-closed | governance basis resolver |
| `external_refs.governance_basis.endpoint_ref` | secret ref/null | null | endpoint 时必填 | file/env -> secret refs | runtime | startup | sensitive-ref | 缺失 fail-fast | governance adapter |
| `external_refs.work_source.mode` | enum:`disabled` / `fake` / `controlled` / `endpoint` | profile-derived | 是 | default/file/env/test fixture | runtime | startup | internal | disabled 不消费 work source | work source resolver |
| `external_refs.trace_handoff.target_ref` | ref/null | profile-derived | DeliverTraceHandoff enabled 时必填 | file/env/job input | job | job-run-start | ref-sensitive | 缺失拒绝 run | handoff adapter |
| `audit.sink_mode` | enum:`local` / `captured` / `controlled` / `endpoint` | profile-derived | 是 | default/file/env/test override | runtime | startup | internal | 缺失 fail-fast | audit / trace sink |
| `audit.sink_ref` | secret ref/null | null | endpoint 时必填 | file/env -> secret refs | runtime | startup | sensitive-ref | endpoint 缺失 fail-fast | audit adapter |
| `audit.compensation_enabled` | bool | true | 是 | default | runtime | startup/static | internal | false fail-fast | audit repository |
| `audit.redaction_profile` | enum:`identity-safe` | `identity-safe` | 是 | default/file | runtime/report | startup | security-critical | 非法值 fail-fast | observability hooks |
| `redline.no_auth_in_identity` | bool | true | 是 | default | runtime | startup/static | security-critical | false fail-fast | redline guard |
| `redline.ref_only_guard` | bool | true | 是 | default | runtime | startup/static | security-critical | false fail-fast | redline guard |
| `redline.projection_no_write_guard` | bool | true | 是 | default | runtime | startup/static | security-critical | false fail-fast | query/projection tests |
| `redline.outbox_no_event_creation_guard` | bool | true | 是 | default | runtime | startup/static | security-critical | false fail-fast | outbox tests |
| `redline.stored_replay_guard` | bool | true | 是 | default | runtime | startup/static | security-critical | false fail-fast | idempotency tests |
| `fixture.clock_mode` | enum:`system` / `fixed` | profile-derived | 是 | default/file/test fixture | runtime/test | startup | internal | fixed outside local/CI fail-fast | clock adapter |
| `fixture.id_sequence_mode` | enum:`runtime` / `deterministic` | profile-derived | 是 | default/file/test fixture | runtime/test | startup | internal | deterministic outside local/CI fail-fast | id generator |
| `fixture.seed_ref` | ref/null | null | ci-test deterministic suites 必填 | test fixture/file | test | startup | internal | 缺失 fail test startup | fixture loader |

### 7.3 配置域批次表

| 配置域 | 配置项 | 控制面 | 分类 | 来源规则 | 环境差异 | `03` 影响判定 |
|---|---|---|---|---|---|---|
| profile | `profile.*` | profile / runtime assembly | startup runtime;entry-local selector | defaults < file < env;entry-local 只选当前入口 | 四 P0 profile 必须明确 | 无回写;承接 config refs |
| store | `store.*` | store / transaction carrier | startup;sensitive ref | defaults < file < env;durable ref 只保存 ref | local/CI in-memory;integration controlled/durable-like | 无回写;不改变 repository/UoW |
| actor_context | `actor_context.*` | actor context / entry-local | startup;entry-local metadata | default/file/env/request metadata | local/CI 可 fixture;identity 不做 auth | 无回写;不改变 ActorContext schema |
| role_catalog | `role_catalog.*` | role and capability source binding | startup;test fixture | default/file/env/fixture/ref | local/CI fixture;integration controlled | 无回写;不保存 RoleDefinition body |
| bus | `bus.*` | bus / outbox publication | startup;sensitive ref | default/file/env/ref | fake/controlled/endpoint by profile | 无回写;不改变 event schema |
| outbox | `outbox.*` | bus / outbox publication | startup;job-run-start | default/file/env/job input | all P0 profiles preserve retry semantics | 无回写;不改变 outbox state |
| projection | `projection.*` | projection / reference / report | startup;job-run-start | default/file/env/job input | operations-replay uses replay checkpoint | 无回写;query no-write |
| operations | `operations.*` | operations job runners | job-run-start;ref-sensitive | file/env/job input | replay profile requires report/input refs | 无回写;不新增 job DTO |
| external_refs | `external_refs.*` | external resolver / handoff adapters | startup;sensitive ref;P1 feature | default/file/env/ref/job input | P0 disabled/fake;P1 controlled/endpoint | 无回写;只配置 availability |
| audit | `audit.*` | audit / redline / observability | startup;sensitive ref;diagnostic | default/file/env/ref | local captured;CI captured;integration controlled | 无回写;compensation 不可关闭 |
| redline | `redline.*` | audit / redline / observability | static/startup guard | default only or stricter file | all profiles true | 无回写;只是校验入口 |
| fixture | `fixture.*` | clock / id / deterministic fixture | test fixture;startup | default/file/test fixture | local/CI only | 无回写;不进入 production-like |

### 7.4 系统级聚合 key 映射说明

项目本地配置不强制带 `identity` 前缀。若未来系统级配置聚合器需要统一 namespace,仅做机械映射:

| 本地 key | 系统聚合 key 示例 | 说明 |
|---|---|---|
| `profile.name` | `identity.profile.name` | 聚合层加项目名前缀 |
| `store.mode` | `identity.store.mode` | 本仓正式清单仍以本地 key 为准 |
| `role_catalog.source_mode` | `identity.role_catalog.source_mode` | 不改变配置语义 |
| `bus.publisher_mode` | `identity.bus.publisher_mode` | 不改变 event / topic contract |
| `audit.redaction_profile` | `identity.audit.redaction_profile` | 不改变 redaction policy |

系统聚合映射不得引入新的配置项、默认值、来源优先级或 profile 名称。

### 7.5 模块级 JSON demo 与配置项说明

#### profile 配置 demo

```json
{
  "profile": {
    "name": "ci-test",
    "adapter_mode_policy": "p0-safe",
    "allow_test_override": true
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `profile.name` | enum | `ci-test` | 选择四类 P0 profile 之一 | 只允许正式 profile | 非法值 fail-fast |
| `profile.adapter_mode_policy` | enum | `p0-safe` | 限制 adapter mode 不越过 P0 安全边界 | 只允许 `p0-safe` | 非法值 fail-fast |
| `profile.allow_test_override` | bool | true | 标记当前 profile 是否允许 fixture / deterministic override | 仅 local-dev / ci-test 可为 true | 越界 fail-fast |

#### store 配置 demo

```json
{
  "store": {
    "mode": "in-memory",
    "dsn_ref": null,
    "migration": {
      "required_version": "identity-schema-p0"
    },
    "transaction_mode": "single-uow",
    "idempotency": {
      "enabled": true
    },
    "dead_letter": {
      "retention_days": 30
    }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `store.mode` | enum | `in-memory` | 选择持久化 adapter 形态 | durable 需要 `dsn_ref` | 缺失 fail-fast |
| `store.dsn_ref` | secret ref/null | null | durable store 的 DSN 引用 | 不允许 raw DSN | durable 缺失 fail-fast |
| `store.migration.required_version` | string | `identity-schema-p0` | 校验 schema baseline | 不能为空 | 不匹配 fail-fast |
| `store.transaction_mode` | enum | `single-uow` | 固定事务同成同败模式 | 只能 `single-uow` | 非法值 fail-fast |
| `store.idempotency.enabled` | bool | true | 固定启用幂等 store | 不允许 false | false fail-fast |
| `store.dead_letter.retention_days` | integer | 30 | worker dead-letter 留存天数 | 正整数 | 非法范围 fail-fast |

#### actor_context 配置 demo

```json
{
  "actor_context": {
    "required": true,
    "require_trace_id": true,
    "trusted_context_profile": "trusted-upstream",
    "idempotency_key_required": true
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `actor_context.required` | bool | true | 要求入口必须提供可信 actor context | 不允许 false | false fail-fast |
| `actor_context.require_trace_id` | bool | true | 保证审计链 trace 可追溯 | 不允许关闭 P0 写路径 trace | 缺失 trace 拒绝当前入口 |
| `actor_context.trusted_context_profile` | enum | `trusted-upstream` | 选择可信上下文映射形态 | `fixture` 仅 local/CI | 越界 fail-fast |
| `actor_context.idempotency_key_required` | bool | true | 要求 command / event / job metadata 幂等键 | 不允许 false | 缺失拒绝当前入口 |

#### role_catalog 配置 demo

```json
{
  "role_catalog": {
    "source_mode": "fake",
    "snapshot_ref": null,
    "fixture_ref": "fixture://identity/roles/p0",
    "fingerprint_required": true,
    "unknown_role_strategy": "reject-write"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `role_catalog.source_mode` | enum | `fake` | 选择 role/capability 来源 adapter | profile 限定 mode | 缺失 fail-fast |
| `role_catalog.snapshot_ref` | ref/null | null | controlled / endpoint snapshot 引用 | 不保存 RoleDefinition / CapabilityDefinition body | 缺失 fail-fast when required |
| `role_catalog.fixture_ref` | ref/null | `fixture://identity/roles/p0` | local/CI role fixture | 仅 local/CI | 缺失 fail-fast for local/CI |
| `role_catalog.fingerprint_required` | bool | true | 要求 source fingerprint 可对账 | 不允许 false | false fail-fast |
| `role_catalog.unknown_role_strategy` | enum | `reject-write` | unknown role 写路径处理 | 只能拒绝写入 | 非法值 fail-fast |

#### bus / outbox 配置 demo

```json
{
  "bus": {
    "publisher_mode": "fake",
    "endpoint_ref": null,
    "topic_map_ref": "fixture://identity/topic-map/p0",
    "require_known_event_kind": true
  },
  "outbox": {
    "store_name": "identity-outbox",
    "publish": {
      "batch_size": 50,
      "max_attempts": 5,
      "backoff_policy_ref": "retry:identity-outbox:p0",
      "failure_mode": "mark-failed-no-rollback"
    }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `bus.publisher_mode` | enum | `fake` | 选择 publisher adapter | disabled 只能用于不运行 publisher 的 profile | 缺失 fail-fast |
| `bus.endpoint_ref` | secret ref/null | null | endpoint bus credential / endpoint 引用 | 不允许 raw endpoint secret | endpoint 缺失 fail-fast |
| `bus.topic_map_ref` | ref | `fixture://identity/topic-map/p0` | event kind 到 transport route 的映射引用 | 不改变 event kind / payload | 缺失阻断 publisher |
| `outbox.store_name` | string | `identity-outbox` | outbox store 逻辑名 | 非空 | 空值 fail-fast |
| `outbox.publish.batch_size` | integer | 50 | publish job 一次扫描量 | 正整数且有上限 | 非法范围拒绝 run |
| `outbox.publish.failure_mode` | enum | `mark-failed-no-rollback` | bus 失败后的本地处理 | 只能保留失败,不回滚 truth | 非法值 fail-fast |

#### projection / operations 配置 demo

```json
{
  "projection": {
    "store_name": "member-summary-projection",
    "checkpoint_name": "member-summary",
    "rebuild": {
      "batch_size": 100
    },
    "query": {
      "not_ready_strategy": "return-not-ready"
    }
  },
  "operations": {
    "run_id_required": true,
    "replay": {
      "report_root_ref": null,
      "input_root_ref": null
    },
    "propagation_retry": {
      "enabled": true
    }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `projection.store_name` | string | `member-summary-projection` | projection store 逻辑名 | 非空 | 空值 fail-fast |
| `projection.rebuild.batch_size` | integer | 100 | rebuild 一批处理 target 数 | 正整数且有上限 | 非法范围拒绝 run |
| `projection.query.not_ready_strategy` | enum | `return-not-ready` | projection 未就绪时查询表现 | query 不触发 rebuild | 非法值 fail-fast |
| `operations.run_id_required` | bool | true | 每次 operations job 必须有 run id | 不允许 false | 缺失拒绝 run |
| `operations.replay.report_root_ref` | ref/null | null | replay report 输出根引用 | 不包含 raw report secret | operations-replay 缺失拒绝 run |
| `operations.propagation_retry.enabled` | bool | true | 是否允许 propagation retry job | 不重开 terminal state | disabled 时拒绝 retry run |

#### external_refs 配置 demo

```json
{
  "external_refs": {
    "artifact_evidence": {
      "mode": "disabled",
      "endpoint_ref": null
    },
    "memory_archive": {
      "mode": "disabled",
      "endpoint_ref": null
    },
    "governance_basis": {
      "mode": "disabled",
      "endpoint_ref": null
    },
    "work_source": {
      "mode": "disabled"
    },
    "trace_handoff": {
      "target_ref": null
    }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `external_refs.artifact_evidence.mode` | enum | `disabled` | capability evidence ref validation adapter | P1 明确启用才运行 | enabled 缺 ref fail-fast |
| `external_refs.memory_archive.mode` | enum | `disabled` | memory/archive ref 和 archive status adapter | disabled 时相关动作 fail-closed | unavailable fail-closed |
| `external_refs.governance_basis.mode` | enum | `disabled` | lifecycle high-risk basis resolver | high-risk action 必须 fail-closed | unavailable fail-closed |
| `external_refs.work_source.mode` | enum | `disabled` | work participation / career source adapter | 不反写外部 truth | disabled 不消费 |
| `external_refs.trace_handoff.target_ref` | ref/null | null | trace handoff target | 不保存 target body | enabled 缺失拒绝 run |

#### audit / redline / fixture 配置 demo

```json
{
  "audit": {
    "sink_mode": "captured",
    "sink_ref": null,
    "compensation_enabled": true,
    "redaction_profile": "identity-safe"
  },
  "redline": {
    "no_auth_in_identity": true,
    "ref_only_guard": true,
    "projection_no_write_guard": true,
    "outbox_no_event_creation_guard": true,
    "stored_replay_guard": true
  },
  "fixture": {
    "clock_mode": "fixed",
    "id_sequence_mode": "deterministic",
    "seed_ref": "fixture://identity/seeds/p0"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `audit.sink_mode` | enum | `captured` | audit / trace / metrics 输出形态 | core audit 不可关闭 | 缺失 fail-fast |
| `audit.redaction_profile` | enum | `identity-safe` | redaction 规则集 | 不允许 raw secret / body 输出 | 非法值 fail-fast |
| `redline.ref_only_guard` | bool | true | 防外部正文落入 identity | 不允许 false | false fail-fast |
| `redline.stored_replay_guard` | bool | true | 防 duplicate replay 重跑 mutation | 不允许 false | false fail-fast |
| `fixture.clock_mode` | enum | `fixed` | 测试固定时间 | fixed 仅 local/CI | 越界 fail-fast |
| `fixture.seed_ref` | ref/null | `fixture://identity/seeds/p0` | 测试数据 seed 引用 | 不包含 raw body / secret | 缺失 fail test startup |

### 7.6 完整配置 demo

```jsonc
{
  // 注释只用于文档说明;实际 JSON 配置必须删除注释。
  "profile": {
    "name": "ci-test",
    "adapter_mode_policy": "p0-safe",
    "allow_test_override": true
  },
  "store": {
    "mode": "in-memory",
    "dsn_ref": null,
    "migration": {
      "required_version": "identity-schema-p0"
    },
    "transaction_mode": "single-uow",
    "idempotency": {
      "enabled": true
    },
    "dead_letter": {
      "retention_days": 30
    }
  },
  "actor_context": {
    "required": true,
    "require_trace_id": true,
    "trusted_context_profile": "trusted-upstream",
    "idempotency_key_required": true
  },
  "role_catalog": {
    "source_mode": "fake",
    "snapshot_ref": null,
    "fixture_ref": "fixture://identity/roles/p0",
    "fingerprint_required": true,
    "unknown_role_strategy": "reject-write"
  },
  "bus": {
    "publisher_mode": "fake",
    "endpoint_ref": null,
    "topic_map_ref": "fixture://identity/topic-map/p0",
    "require_known_event_kind": true
  },
  "outbox": {
    "store_name": "identity-outbox",
    "publish": {
      "batch_size": 50,
      "max_attempts": 5,
      "backoff_policy_ref": "retry:identity-outbox:p0",
      "failure_mode": "mark-failed-no-rollback"
    }
  },
  "projection": {
    "store_name": "member-summary-projection",
    "checkpoint_name": "member-summary",
    "rebuild": {
      "batch_size": 100
    },
    "query": {
      "not_ready_strategy": "return-not-ready"
    }
  },
  "operations": {
    "run_id_required": true,
    "replay": {
      "report_root_ref": null,
      "input_root_ref": null
    },
    "propagation_retry": {
      "enabled": true
    }
  },
  "external_refs": {
    "artifact_evidence": {
      "mode": "disabled",
      "endpoint_ref": null
    },
    "memory_archive": {
      "mode": "disabled",
      "endpoint_ref": null
    },
    "governance_basis": {
      "mode": "disabled",
      "endpoint_ref": null
    },
    "work_source": {
      "mode": "disabled"
    },
    "trace_handoff": {
      "target_ref": null
    }
  },
  "audit": {
    "sink_mode": "captured",
    "sink_ref": null,
    "compensation_enabled": true,
    "redaction_profile": "identity-safe"
  },
  "redline": {
    "no_auth_in_identity": true,
    "ref_only_guard": true,
    "projection_no_write_guard": true,
    "outbox_no_event_creation_guard": true,
    "stored_replay_guard": true
  },
  "fixture": {
    "clock_mode": "fixed",
    "id_sequence_mode": "deterministic",
    "seed_ref": "fixture://identity/seeds/p0"
  }
}
```

### 7.7 配置项停审记录

| 配置域 / 配置项 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| profile | 类型、默认、profile 矩阵、entry-local selector | 通过 | 不新增 runtime enum |
| store | 必填、secret ref、transaction/idempotency guard | 通过 | durable 产品留 P1/P2 |
| actor_context | no-auth、trace、idempotency | 通过 | 不实现 credential 校验 |
| role_catalog | role/capability source ref、fixture、fingerprint | 通过 | 不保存 RoleDefinition body |
| bus/outbox | topic map、publisher、retry、failure mode | 通过 | topic 不改变 event schema |
| projection/operations | rebuild、query not-ready、replay refs、retry | 通过 | job 不修 core truth |
| external_refs | P1/P2 adapter mode、endpoint refs、handoff target | 通过 | default disabled/fail-closed |
| audit/redline | compensation、safe redaction、guards | 通过 | guards 不可关闭 |
| fixture | fixed clock/id、seed ref | 通过 | 仅 local-dev / ci-test |

### 7.8 跨配置项闭环审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在重复配置项 | 无 | profile / adapter mode / fixture 分离 |
| 是否存在泛化模块混写 | 无 | 使用 `03` §13 十二个 section |
| 必填项是否都有失败策略 | 通过 | startup fail-fast、job/entry reject 均已标注 |
| 敏感级别是否归类 | 通过 | secret / endpoint / report root 只保存 ref |
| 是否出现 raw secret / external body | 无 | demo 只含 ref/null |
| 是否保留旧 command/job/port 名 | 无 | 使用新版 protocol/job 名 |
| 是否改变 `03` runtime config、builder、adapter constructor、port、error、DTO 或 flow | 未发现 | 本 Step 只定义 `04` 配置项 surface |
| 是否需要正式 env var 名 | 未定义 | 后续若需要,必须在 `04` 明确或回写 `03` entry schema |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---|---|---|---|
| 配置项按 `profile/store/actor_context/role_catalog/bus/outbox/projection/operations/external_refs/audit/redline/fixture` 组织 | 否 | 承接 `03` §13 config reference table | 不适用 | 无回写 |
| 项目本地 key 不强制 `identity.*` 前缀 | 否 | 配置文件命名语义 | 不适用 | 无回写 |
| module JSON demo 使用严格 JSON,完整 demo 使用 JSONC 文档示例 | 否 | 文档表达 | 不适用 | 无回写 |
| all secret / endpoint / report roots use refs only | 否 | 安全配置语义 | 不适用 | 无回写 |
| 如果实现需要强类型 `IdentityRuntimeConfig` struct、builder signature 或 adapter constructor 字段 | 是 | 代码契约变更 | `03` §13 / Step 14 或对应 Step 6/7 | 阻塞待确认 |

## 9. 回填草稿

正式 `04-配置设计.md` §7 可回填:

```md
## 7. 配置项清单

> 校准来源:
> - `design-calibration/04_config_step_07_config_items.md`

`L1-identity` 项目本地配置按 `profile`、`store`、`actor_context`、`role_catalog`、`bus`、`outbox`、`projection`、`operations`、`external_refs`、`audit`、`redline`、`fixture` 十二个模块组织。项目本地 key 不重复 `identity` 前缀;系统级聚合需要时可机械映射为 `identity.<module>.<setting>`。

模块级配置 demo 使用严格 JSON。完整示例可使用 JSONC 作为文档说明,但实际运行配置必须删除注释并保持严格 JSON。所有 sensitive 配置只允许保存 `*_ref`;不得在配置文件、env、fixture、日志、audit、report 或 evidence 中保存 raw secret、raw endpoint credential 或 raw external body。
```

## 10. 待确认事项

| 编号 | 待确认事项 | 影响 | 当前处理 |
|---|---|---|---|
| ID-CONFIG-Q26 | 是否需要正式 `IdentityRuntimeConfig` Rust struct | 影响 `03` object / infra contract | 当前不新增;若实现需要则回写 `03` |
| ID-CONFIG-Q27 | secret provider 真实读取、轮换和审计 | 影响 sensitive refs | Step 8 定义 |
| ID-CONFIG-Q28 | config loader parse / validation / activation function | 影响实现顺序和错误 surface | Step 9 定义 |
| ID-CONFIG-Q29 | operations replay artifact/report root 的正式 schema | 影响 tests / evidence / jobs entry | Step 12 或下游测试方案承接 |
| ID-CONFIG-Q30 | P1 durable / endpoint 产品配置项是否进入本轮正式 `04` | 影响 Step 13 / 14 演进风险 | 当前只保留 ref / disabled / endpoint 语义 |

## 11. 进入下一步条件

- P0 配置项无 unresolved 缺口。
- 每个配置项均有类型、默认、必填、来源、作用域、生效方式、敏感级别、失败策略和关联模块。
- 模块级 JSON demo 已使用严格 JSON。
- 完整配置 demo 已标注为 JSONC 文档示例。
- 配置域停审和跨配置项闭环审计没有 unresolved 冲突。
- 对 `03-详细设计.md` 的影响判定已记录,当前无必须回写项。
- 未定义 raw secret、真实 endpoint、secret provider API、env var 名、测试编号、evidence 路径或实施 boundary。

下一步进入 Step 8:定义敏感配置与密钥管理。
