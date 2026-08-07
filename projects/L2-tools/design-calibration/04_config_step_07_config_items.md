# L2-tools 04 配置设计 Step 7：配置项清单与 JSON demo

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 7
> 对应书写规范：`standards/document/配置设计书写规范.md` §5.7
> 回填目标：`projects/L2-tools/04-配置设计.md` §7
> 状态：`completed / pass; stop review`
> 模式：`full-restart / single-agent-serial`

## 1. Step 状态与 Step 内计划

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 7 定义 P0 配置项、模块 demo 和完整配置示例 |
| 前序门禁 | Step 6 `completed / pass; stop review`；P0 profile、来源、外部依赖、敏感处理和测试/验收承接已闭合。 |
| 本步状态 | `completed / pass; stop review` |
| 正式文档写入 | 关闭；本文件只形成 §7 回填草稿，不创建正式 `04-配置设计.md`。 |
| 当前 blocker | 无新增；`L2T-UP-001~009` 继续限制外部 positive binding，不限制 P0 配置项清单。 |
| 下一动作 | 用户已连续授权完成全部 `04`；同步 flow/ledger 后创建并执行 Step 8 敏感配置与密钥管理。 |
| 提交 | 不需要；未经用户明确要求不提交。 |

### 1.1 Step 内计划

- [x] 读取 Step 7 SOP/书写规范、Step 3~6 中间产物、`03` §13 和 profile 矩阵。
- [x] 固定项目本地 JSON 命名、模块边界、默认/必填和 scope/activation 词表。
- [x] 按 10 个 `ToolsConfigCandidate` root section 逐域列出 P0 配置项。
- [x] 为每项填写类型、默认、必填、来源、作用域、生效、敏感级别、失败策略和关联模块。
- [x] 提供模块级严格 JSON demo 与完整 JSONC 文档示例。
- [x] 完成逐域停审、跨配置项审计和 `03` 影响判定。

## 2. 本步目标与边界

本 Step 把 Step 3 的 21 个配置域落实为可解析、可校验、可测试的字段级清单。字段只表达 infra composition、adapter/store/entry/job/projection availability、有界技术参数和 opaque reference；不得产生业务 truth、authority、state transition、external delivery/readiness 或安全豁免。

### 2.1 Candidate root 约束

本 Step 只使用 `03-详细设计.md` §13.2 已列出的十个 root section，不新增 `safety`、`config_center`、`admin`、`runtime_orchestration` 或产品专属 root：

```text
profile
boundary
stores
idempotency
projection
jobs
adapters
handoff
clock_id
features
```

`config_ref` 是 loader 在校验后生成的 redacted identity，不是用户可写业务字段。安全/诊断配置作为 `profile`、`boundary`、`adapters`、`features` 的 validator overlay，不能形成第二套 raw configuration truth。

### 2.2 命名、格式和映射规则

| 规则 | 当前结论 |
|---|---|
| 文件格式 | 运行时配置为严格 JSON；完整文档示例可用 JSONC，注释必须在运行前删除。 |
| 字段命名 | JSON 使用 lowerCamelCase；内部 typed field 由实现仓 Rust 命名规范转换。 |
| 本地前缀 | 项目本地文件不强制重复 `l2_tools`；系统聚合文件如需映射，外层使用 `l2_tools.<module>.<setting>`，内层 schema 不变。 |
| 模块拆分 | 按 `profile`、`boundary`、`stores`、`idempotency`、`projection`、`jobs`、`adapters`、`handoff`、`clock_id`、`features` 分组，不使用 `common`、`misc`、`runtime` 泛化桶。 |
| 来源 | 普通项统一 `defaults < strict JSON < allowlisted env`；opaque ref、fixture 和 entry-local 为独立 lane。 |
| 默认 | 只有安全、有界、非敏感且不会创造事实的项允许 default；required capability/ref 无安全 default。 |
| 生效 | `startup`、`entry-local`、`job-startup`、`static`；P0 不支持 hot/reload/admin/remote/LKG。 |
| 敏感 | raw secret/body/credential 不进入 candidate；只能保存 typed opaque ref 或 redacted identity。 |

## 3. 本步输入

| 输入 | 关键结论 | 本步用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | 11 个控制面、21 个配置域、唯一 raw reader 和 builder。 | 为每项绑定 CP、域和 planned owner。 |
| `04_config_step_04_classification_boundaries.md` | 12 类配置、P0 activation 和 `NC-L2T-001~025` 禁止边界。 | 为每项绑定 classification、scope 和不可配置化约束。 |
| `04_config_step_05_sources_priority_conflicts.md` | `D < F < E`、secret/fixture/entry-local lane、冲突和 fail-fast。 | 为每项填写 source/failure。 |
| `04_config_step_06_profiles_matrix.md` | P0 `local-dev`/`ci-test`/`integration-like`；P1/P2 candidate/inactive。 | 填写 profile 差异、fixture 和外部 binding。 |
| `03-详细设计.md` §13.1~§13.9 | 十个 candidate root、七 Store、七 external Port、timeout/retry/degraded 类别和 builder 顺序。 | 不新增 Rust root/Port/error；精确承接既有 seam。 |
| `03_ddd_step_14_config_external_binding.md` | capability、fake/durable/blocked、entry-local 和 safe output 规则。 | 校验每项可落到 infra/config 与 runtime_builder。 |

## 4. SOP 问题逐项回答

### 4.1 每个 P0 配置项的名称、类型和默认值是什么？

完整字段清单见 §8.2。字段类型使用 typed category、bounded integer、bool、opaque ref、enum list 或 bounded map；不使用裸产品名、raw URL credential、业务状态或无限制 string。安全 default 仅用于 local/CI 可确定的边界和 category；required adapter/store/UoW/ref 没有隐式 default。

### 4.2 哪些配置项必填？

`profile.name`、所有 required local Store/UoW/Idempotency/Clock/ID slot、Command/Query/Consumer/Job bounds、adapter slots、handoff phase policy 和 redaction floor 为 startup 必填或条件必填。外围 feature 关闭时，其 target/adapter 可不提供；feature 开启时对应 item 变为 required，并由 cross-section validator 拒绝缺失组合。

### 4.3 每项来源、作用域和生效方式是什么？

每项均在 §8.2 记录来源、scope、activation。普通 file/env 只能覆盖已登记 canonical item；entry-local 只能选择完整 snapshot 或当前 job scope；fixture 仅显式 Local/CI；startup 项在 builder 前冻结，job-startup 项在 job 开始冻结，entry-local 只影响当前 entry。

### 4.4 每项如何处理敏感级别和失败？

§8.2 将敏感级别分为 `public`、`internal`、`sensitive-ref`、`secret-ref-only`；后两类只保存 opaque locator，详细存储/读取/轮换留 Step 8。所有 required/conditional item 都有 `fail-fast`、`entry-reject`、`job-reject`、`blocked`、`degraded` 或 `manual-unknown` 明确策略，不以空值或低优先级回退隐藏错误。

### 4.5 模块和 JSON demo 如何组织？

模块按十个 root section 展开；每个模块在 §9 给出严格 JSON demo 和字段说明。完整示例在 §10 使用 JSONC，仅作文档示例，运行时必须转换为严格 JSON。

### 4.6 是否存在 03 回写？

当前没有。所有字段都落在 `ToolsConfigCandidate` 已有 root section 或既有 typed parameter/ref seam；任何新增 root、field、enum、Port、constructor、lifecycle 或 error 必须先回写 `03`，再重新进入配置校准。

## 5. 当前材料诊断

| 材料/位置 | 问题 | 本 Step 处理 |
|---|---|---|
| Step 3 控制面 | 只有域级能力，缺字段级 schema。 | 形成 10 root / 21 domain 的 canonical item rows。 |
| Step 4 分类 | activation/sensitivity 词表未落到 item。 | 每项明确 `startup`/`entry-local`/`job-startup`/`static` 和 sensitivity。 |
| Step 5 来源 | 来源矩阵未给 exact canonical path。 | 为每项固定 source lane、冲突和 failure。 |
| Step 6 profiles | profile 只有组合语义，没有字段差异。 | 在 profile/environment 列中标注 P0/P1/P2 可用性和 fixture/ref 规则。 |
| 旧 README/05/06 | 旧 Python、Policy、MCP、DB/broker、SLA 和验收结果与当前文档冲突。 | 标为 `historical_material`，不恢复旧 key/product/threshold/result。 |

## 6. 改动前后对比

| 项 | 本步前 | 本步后 | 原因 |
|---|---|---|---|
| 配置粒度 | 21 个域和 candidate root | 逐项 typed path、默认/必填、source/scope/activation/sensitivity/failure/owner | 支撑 Step 8~12 和可落码校验。 |
| JSON 组织 | 无正式示例 | 十个功能模块严格 JSON + 一个完整 JSONC | 满足配置书写规范且避免泛化桶。 |
| 作用域 | startup/entry/job 仅类别 | 每项冻结时机与 profile 差异 | 防止 mid-flight drift 和 entry 越权。 |
| 敏感 | 只有 raw secret 禁止 | 每项标注 `public/internal/sensitive-ref/secret-ref-only` | Step 8 可逐项回指。 |
| 03 影响 | 尚未字段审计 | 逐项确认无新 Rust contract；future trigger 明确 | 防止配置偷偷扩展详细设计。 |

## 7. 设计取舍

| 议题 | 选择 | 取舍 |
|---|---|---|
| 项目本地是否重复 `l2_tools` 前缀 | 不重复 | 保持本地文件简洁；系统聚合映射由外层负责。 |
| 是否新增 `safety` root | 不新增 | 安全是既有 section 的 validator overlay，避免第二 truth。 |
| Store 是否合并成 `storage` | 不合并 | 保留七个 logical Store、UoW 和 technical sidecar 的责任边界。 |
| adapter availability 是否可直接配置为 Available | 不可 | 配置只能选择 mode/ref；只有 formal Port resolution 能产生 Available。 |
| timeout/retry 是否开放裸数字 | 不开放语义裸数字 | 使用 typed category 和有限边界；unknown/manual fence 不可覆盖。 |
| replay 是否独立配置 root/profile | 不独立 | 由 `idempotency` 和 `jobs` 的 bounded scope 承接。 |
| P1/P2 是否进入默认 demo | 只作为显式 candidate/blocked 示例 | 防止 fixture/fake/endpoint 被误判 production ready。 |

## 8. 结构化配置项产物

### 8.1 类型、来源和失败策略词表

| 词 | 语义 |
|---|---|
| D/F/E | code default / strict JSON file / allowlisted environment；普通优先级固定为 D < F < E。 |
| R | typed opaque secret/connection/certificate/target ref lane；不承载 material。 |
| X | explicit Local/CI deterministic fixture lane；不能静默进入 integration/staging/production-like。 |
| L | entry-local selector 或 job-startup snapshot；只选择完整已验证组合，不逐字段覆盖 global candidate。 |
| startup | 完整 candidate 校验和 runtime builder 前冻结；变更需新 assembly/restart。 |
| entry-local | 当前 API/worker/job entry 生效；不改变 global runtime。 |
| job-startup | bounded Job 开始时冻结；运行中不读取新值。 |
| static | 设计不变量/安全 floor；不是可覆盖配置。 |
| public / internal / sensitive-ref / secret-ref-only | 输出和存储敏感级别；raw secret/body 永远禁止。 |
| fail-fast / entry-reject / job-reject / blocked / degraded / manual-unknown | 配置失败或依赖未闭合的安全结果；不使用 silent fallback。 |

### 8.2 P0 配置项总表

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| profile.name | enum ref | local-dev | 是 | D/F/E/L | startup; L 仅 selector | builder 前冻结 | public | 未登记或 source mismatch -> fail-fast | infra/config, builder, entry |
| profile.configIdentityMode | enum | redacted-generated | 是 | D/F/E | startup | loader 生成 config_ref | internal | 非 redacted mode -> fail-fast | config loader |
| boundary.command.maxRequestBytes | bounded integer ref | policy:command:bounded-default | 是 | D/F/E/X/L | startup/entry-local | API bundle 冻结 | internal | missing/unbounded/invalid -> fail-fast or entry-reject | api, contracts mapper |
| boundary.command.allowedSchemaVersions | non-empty enum list | [v1] | 是 | F/E/X | startup | command validator registry | public | empty/unknown -> fail-fast | api, application |
| boundary.query.pageLimit | bounded integer ref | policy:query:bounded-default | 是 | D/F/E/X/L | startup/entry-local | Query snapshot | internal | out of bound -> entry-reject | api, projection mapper |
| boundary.query.freshnessClass | enum | stale-allowed | 是 | D/F/E/X/L | startup/entry-local | query mapper policy | public | unknown -> entry-reject | api, ProjectionStore |
| boundary.consumer.allowedEnvelopeVersions | non-empty enum list | [v1] | 是 | F/E/X | startup | worker validator | public | unsupported -> reject/quarantine | worker, contracts |
| boundary.consumer.maxEnvelopeBytes | bounded integer ref | policy:consumer:bounded-default | 是 | D/F/E/X | startup | worker admission | internal | invalid -> fail-fast | worker envelope guard |
| boundary.job.allowedKinds | enum list | four bounded Job kinds | 是 | F/E/X | startup | Job registry | public | unknown/empty -> fail-fast | jobs, worker |
| boundary.job.maxScopeItems | bounded integer ref | policy:job:bounded-default | 是 | D/F/E/X/L | startup/job-startup | Job snapshot | internal | unbounded/invalid -> job-reject | jobs runners |
| stores.contract.adapterRef | opaque adapter ref | none | 是 | F/E/R/X | startup | Store registry | sensitive-ref when external | missing/capability mismatch -> fail-fast | ToolContractStore |
| stores.binding.adapterRef | opaque adapter ref | none | 是 | F/E/R/X | startup | Store registry | sensitive-ref when external | missing/capability mismatch -> fail-fast | CapabilityBindingStore |
| stores.invocation.adapterRef | opaque adapter ref | none | 是 | F/E/R/X | startup | Store registry | sensitive-ref when external | missing/capability mismatch -> fail-fast | ToolInvocationStore |
| stores.handoff.adapterRef | opaque adapter ref | none | 是 | F/E/R/X | startup | Store registry | sensitive-ref when external | missing/capability mismatch -> fail-fast | ExecutionHandoffStore |
| stores.outcomeAudit.adapterRef | opaque adapter ref | none | 是 | F/E/R/X | startup | pair capability check | sensitive-ref when external | missing pair atomicity -> fail-fast | OutcomeAuditStore |
| stores.submission.adapterRef | opaque adapter ref | none | 是 | F/E/R/X | startup | Store registry | sensitive-ref when external | missing CAS/semantic key -> fail-fast | ExternalSubmissionStore |
| stores.projection.adapterRef | opaque adapter ref | none | 是 | F/E/R/X | startup | projection registry | sensitive-ref when external | missing watermark/page -> fail-fast | ProjectionStore |
| stores.uow.bindingRef | opaque UoW capability ref | none | 是 | F/E/R/X | startup | one UoW before entry bundles | sensitive-ref when external | split/no pair authority -> fail-fast | ToolsUnitOfWorkManager |
| idempotency.commandConsumer.adapterRef | opaque adapter ref | none | 是 | F/E/R/X | startup | sidecar registry | sensitive-ref when external | no claim/replay -> fail-fast | IdempotencyStore |
| idempotency.commandConsumer.retentionClass | enum ref | policy:idempotency:command-default | 是 | D/F/E/X | startup | retention guard | internal | unsafe retention -> fail-fast | idempotency store |
| idempotency.continuationJob.adapterRef | opaque adapter ref | none | 是 | F/E/R/X | startup | sidecar registry | sensitive-ref when external | no stored receipt/report -> fail-fast | worker, jobs |
| idempotency.continuationJob.retentionClass | enum ref | policy:idempotency:continuation-default | 是 | D/F/E/X | startup | retention guard | internal | below replay floor -> fail-fast | worker, jobs |
| projection.readFreshnessClass | enum | stale-allowed | 是 | D/F/E/X/L | startup/job-startup | projection mapper | public | unsupported -> degraded/unavailable | projection/query |
| projection.rebuildEnabled | bool | true in ci-test; false otherwise | 是 | D/F/E/X | startup | register bounded rebuild Job | public | no capability -> fail-fast | jobs, ProjectionStore |
| projection.rebuildBatchLimit | bounded integer ref | policy:projection:bounded-default | 是 | D/F/E/X/L | job-startup | Job snapshot | internal | invalid -> job-reject | jobs |
| projection.statusRefreshEnabled | bool | false | 是 | D/F/E/X | startup | peripheral registration | public | no status Port -> blocked | worker, jobs |
| jobs.enabledKinds | enum list | four core kinds; external status off | 是 | D/F/E/X | startup | Job registry | public | unknown -> fail-fast | jobs |
| jobs.batchLimit | bounded integer ref | policy:job:bounded-default | 是 | D/F/E/X/L | job-startup | per-run snapshot | internal | invalid -> job-reject | jobs |
| jobs.parallelismClass | enum ref | policy:job:single-worker-default | 是 | D/F/E/X | startup/job-startup | runner cap | internal | unsupported/unbounded -> fail-fast | jobs |
| jobs.timeoutClass | enum ref | policy:timeout:job-slice | 是 | D/F/E/X | startup/job-startup | runner policy | internal | unknown -> job-reject | jobs |
| jobs.retryClass | enum ref | none | 是 | D/F/E/X | startup/job-startup | runner policy | internal | retry-after-unknown -> UnsafeOverrideAttempt | jobs |
| jobs.reportRetentionClass | enum ref | policy:report:bounded-default | 是 | D/F/E/X | startup | report guard | internal | below replay floor -> fail-fast | jobs, idempotency |
| adapters.core.mode | enum | candidate-blocked | 是 | F/E/X | startup | Core Port selection | public | unsupported schema -> blocked | SharedContractAuthorityPort |
| adapters.core.adapterRef | opaque adapter ref | none | 是 | F/E/X/R | startup | resolver registry | sensitive-ref when external | missing -> fail-fast/blocked | source resolvers |
| adapters.hub.mode | enum | blocked-aware | 是 | F/E/X | startup | Hub Port binding | public | owner/source gap -> blocked | HubControlledSourcePort |
| adapters.authorization.mode | enum | blocked-aware | 是 | F/E/X | startup | Auth Port binding | public | missing/stale/conflict -> fail-closed | AuthorizationConsumptionPort |
| adapters.sandbox.mode | enum | blocked-aware | 是 | F/E/X | startup | Sandbox Port binding | public | mapping gap -> blocked; no host fallback | SandboxExecutionPort |
| adapters.source.mode | enum | blocked-aware | 是 | F/E/X | startup | source Port binding | public | mapping unknown -> no outcome | ExecutionSourceIntakePort |
| adapters.collaboration.mode | enum | route-blocked | 是 | F/E/X | startup | collaboration Port binding | public | route/source gap -> local degradation | SafeEventCollaborationPort |
| adapters.visibility.adapterRef | opaque adapter ref | none | 是 | F/E/R/X | startup | visibility resolver | sensitive-ref when external | unavailable -> Query unavailable | visibility resolver |
| adapters.timeoutClass | enum ref | policy:timeout:observational | 是 | D/F/E/X | startup | resolver wrapper | internal | invalid -> fail-fast | infra adapters |
| adapters.bodyPolicyRef | opaque policy ref | policy:body-free:v1 | 是 | D/F/E/R/X | startup/static | validator overlay | secret-ref-only if external | missing/weakening -> fail-closed | config validator |
| handoff.targetRefs | bounded opaque ref list | empty | 条件 | F/E/R/X/L | startup/job-startup | target registry | sensitive-ref | enabled + empty/mismatch -> job-reject/ineligible | handoff service |
| handoff.phasePolicyRef | typed policy ref | policy:handoff:one-call | 是 | D/F/E/X | startup | Prepared/unknown fence | internal | weakening -> UnsafeOverrideAttempt | handoff service |
| handoff.timeoutClass | enum ref | policy:timeout:side-effect | 是 | D/F/E/X | startup/job-startup | side-effect wrapper | internal | invalid -> fail-fast | handoff adapters |
| handoff.retryClass | enum ref | manual-resolution | 是 | D/F/E/X | startup/job-startup | no generic retry | internal | retry after unknown -> reject | handoff adapters |
| clock_id.clockRef | opaque adapter ref | none | 是 | F/E/X/R | startup | independent ClockPort | sensitive-ref when external | missing -> fail-fast | clock_id |
| clock_id.idGeneratorRef | opaque adapter ref | none | 是 | F/E/X/R | startup | independent IdGeneratorPort | sensitive-ref when external | missing -> fail-fast | clock_id |
| clock_id.deterministicMode | bool | false except explicit ci-test | 是 | D/F/E/X | startup | test adapter selection | internal | true outside Local/CI -> fail-fast | infra test support |
| features.outboundEvents | bool | false local; explicit CI/integration | 是 | D/F/E/X | startup | peripheral registration | public | enabled without target/adapter -> fail-fast/blocked | builder, worker |
| features.projectionJobs | bool | true ci-test; explicit elsewhere | 是 | D/F/E/X | startup | Job registration | public | missing adapter -> fail-fast | jobs |
| features.externalStatusRefresh | bool | false | 是 | D/F/E/X | startup | status registration | public | no status Port -> blocked | worker, jobs |
| features.redactionFloor | enum ref | policy:redaction:strict | 是 | D/F/E/R/X | startup/static | validator overlay | secret-ref-only if external | weaker floor -> UnsafeOverrideAttempt | config/diagnostics |
| features.diagnosticClass | enum | body-free-low-cardinality | 是 | D/F/E/X | startup | safe mapper | internal | raw/high-cardinality -> fail-fast | diagnostics |

### 8.4 配置域停审前的 profile 差异规则

| Profile | 可使用的默认项 | 必须显式提供的项 | 禁止项 |
|---|---|---|---|
| local-dev | bounded policy refs、blocked-aware mode、empty optional target | required Store/UoW/Clock/ID slot | production provider、raw secret、implicit fixture fallback |
| ci-test | 安全 defaults、deterministic clock/ID | test file、fixture selector、isolated sidecar | 真实 secret、未标记 fake、非确定性时钟 |
| integration-like | 安全 baseline | controlled adapter/connection/target refs | CI fixture 冒充 provider、endpoint-as-ready |
| staging-like | 安全 baseline | future qualified durable/provider refs | fixture/fake fallback、未审计 override |
| production-like | 不启用当前成功默认 | future approved deployment/secret refs | 当前启用、raw material、admin/hot/reload |

### 8.5 模块级严格 JSON demo：profile

```json
{
  "profile": {
    "name": "ci-test",
    "configIdentityMode": "redacted-generated"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| profile.name | enum ref | ci-test | 选择完整 profile | 只允许登记 profile；fixture 只限 Local/CI | fail-fast |
| profile.configIdentityMode | enum | redacted-generated | 生成安全 config identity | 不得接受 raw source dump | fail-fast |

### 8.6 模块级严格 JSON demo：boundary

```json
{
  "boundary": {
    "command": {"maxRequestBytes": "policy:command:bounded-default", "allowedSchemaVersions": ["v1"]},
    "query": {"pageLimit": "policy:query:bounded-default", "freshnessClass": "stale-allowed"},
    "consumer": {"allowedEnvelopeVersions": ["v1"], "maxEnvelopeBytes": "policy:consumer:bounded-default"},
    "job": {
      "allowedKinds": ["check_capability_binding_consistency", "check_reference_integrity", "rebuild_tool_derived_views", "refresh_external_status_refs"],
      "maxScopeItems": "policy:job:bounded-default"
    }
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| boundary.command | bounded ref + version list | policy ref, v1 | 限制 Command 输入 | list 非空；不改 metadata/identity | fail-fast / entry-reject |
| boundary.query | bounded ref + freshness enum | policy ref, stale-allowed | 限制 Query page/degraded read | 不触发 refresh/write | entry-reject |
| boundary.consumer | bounded ref + version list | policy ref, v1 | 限制 envelope/body | 不接受未知 source/body | fail-fast / quarantine |
| boundary.job | bounded ref + closed Job enum | four named kinds | 限制 Job scope | 不允许隐式全扫 | job-reject |
### 8.7 模块级严格 JSON demo：stores

```json
{
  "stores": {
    "contract": {"adapterRef": "store:contract:local"},
    "binding": {"adapterRef": "store:binding:local"},
    "invocation": {"adapterRef": "store:invocation:local"},
    "handoff": {"adapterRef": "store:handoff:local"},
    "outcomeAudit": {"adapterRef": "store:outcome-audit:local"},
    "submission": {"adapterRef": "store:submission:local"},
    "projection": {"adapterRef": "store:projection:local"},
    "uow": {"bindingRef": "uow:local:atomic"}
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| stores.contract/binding/invocation/handoff | opaque adapter ref | store:<surface>:local | 绑定四个 logical Store | CAS、semantic key、immutable append | fail-fast |
| stores.outcomeAudit | opaque adapter ref | store:outcome-audit:local | 绑定 pair-atomic surface | 必须支持不可拆 pair | fail-fast |
| stores.submission | opaque adapter ref | store:submission:local | 绑定 material/attempt/status | 必须支持 attempt CAS/status append | fail-fast |
| stores.projection | opaque adapter ref | store:projection:local | 绑定 projection/reference/report | 必须支持 watermark/page | fail-fast |
| stores.uow.bindingRef | opaque capability ref | uow:local:atomic | 指定唯一 local transaction authority | 不得 split/补偿写 | fail-fast |

### 8.8 模块级严格 JSON demo：idempotency

```json
{
  "idempotency": {
    "commandConsumer": {"adapterRef": "store:idempotency:local", "retentionClass": "policy:idempotency:command-default"},
    "continuationJob": {"adapterRef": "store:replay:local", "retentionClass": "policy:idempotency:continuation-default"}
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| idempotency.commandConsumer.adapterRef | opaque ref | local sidecar ref | 保存 claim/result/receipt | same key/digest replay immutable | fail-fast |
| idempotency.commandConsumer.retentionClass | policy ref | command default | 保护 command/consumer replay | 不得低于 replay floor | fail-fast |
| idempotency.continuationJob.* | opaque ref + policy ref | local replay refs | 保存 continuation/job report | 不得重建 current truth | fail-fast |

### 8.9 模块级严格 JSON demo：projection

```json
{
  "projection": {
    "readFreshnessClass": "stale-allowed",
    "rebuildEnabled": true,
    "rebuildBatchLimit": "policy:projection:bounded-default",
    "statusRefreshEnabled": false
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| projection.readFreshnessClass | enum | stale-allowed | 表达 Query freshness | 不得 live truth fallback | degraded/unavailable |
| projection.rebuildEnabled | bool | true | 注册 bounded rebuild Job | 不让 Query inline rebuild | fail-fast if capability missing |
| projection.rebuildBatchLimit | bounded ref | policy ref | 限制 rebuild slice | scope/cursor 必须有界 | job-reject |
| projection.statusRefreshEnabled | bool | false | 注册外围 status refresh | 不改变 attempt/outcome | blocked if Port missing |

### 8.10 模块级严格 JSON demo：jobs

~~~json
{
  "jobs": {
    "enabledKinds": [
      "check_capability_binding_consistency",
      "check_reference_integrity",
      "rebuild_tool_derived_views",
      "refresh_external_status_refs"
    ],
    "batchLimit": "policy:job:bounded-default",
    "parallelismClass": "policy:job:single-worker-default",
    "timeoutClass": "policy:timeout:job-slice",
    "retryClass": "none",
    "reportRetentionClass": "policy:report:bounded-default"
  }
}
~~~

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| jobs.enabledKinds | closed enum list | four named Jobs | 注册 bounded runners | 不加入 scheduler/run/evidence kind | fail-fast |
| jobs.batchLimit | bounded ref | policy ref | 限制 target page | 不得隐式全扫 | job-reject |
| jobs.parallelismClass | policy ref | single-worker | 限制并发类别 | 不以无界数字覆盖 | fail-fast |
| jobs.timeoutClass / retryClass | policy ref / enum | slice / none | 分类技术失败 | unknown/manual fence 固定 | job-reject |
| jobs.reportRetentionClass | policy ref | report default | 保存 JobReport replay surface | 不短于 replay obligation | fail-fast |

### 8.11 模块级严格 JSON demo：adapters

~~~json
{
  "adapters": {
    "core": {"mode": "candidate-blocked", "adapterRef": "adapter:core:blocked"},
    "hub": {"mode": "blocked-aware"},
    "authorization": {"mode": "blocked-aware"},
    "sandbox": {"mode": "blocked-aware"},
    "source": {"mode": "blocked-aware"},
    "collaboration": {"mode": "route-blocked"},
    "visibility": {"adapterRef": "adapter:visibility:local"},
    "timeoutClass": "policy:timeout:observational",
    "bodyPolicyRef": "policy:body-free:v1"
  }
}
~~~

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| adapters.core/hub/authorization/sandbox/source | mode + optional ref | blocked-aware modes | 保留外部 seam 状态 | endpoint/ref 不产生 Available | blocked/fail-closed |
| adapters.collaboration | mode | route-blocked | 保留安全事件 route gap | 不声明 delivered/observed | local degradation |
| adapters.visibility.adapterRef | opaque ref | local visibility | 读取 scoped visibility | 不得 default visible | Query unavailable |
| adapters.timeoutClass | policy ref | observational | 约束观察型 resolver | 不扩展 side-effect retry | fail-fast |
| adapters.bodyPolicyRef | policy ref | body-free | 固定 body-free floor | 只能收紧 | fail-closed |

### 8.12 模块级严格 JSON demo：handoff

~~~json
{
  "handoff": {
    "targetRefs": [],
    "phasePolicyRef": "policy:handoff:one-call",
    "timeoutClass": "policy:timeout:side-effect",
    "retryClass": "manual-resolution"
  }
}
~~~

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| handoff.targetRefs | bounded opaque ref list | [] | 指定 safe material target | 空集只表示无目标 | ineligible/job-reject |
| handoff.phasePolicyRef | policy ref | one-call | 固定 Prepared/one call/phase-2 | 不绕过 Prepared/unknown | UnsafeOverrideAttempt |
| handoff.timeoutClass | policy ref | side-effect | 分类 side-effect timeout | ambiguity stays unknown | fail-fast |
| handoff.retryClass | enum | manual-resolution | 禁止 generic retry | unknown 后不二次调用 | reject |

### 8.13 模块级严格 JSON demo：clockId

Rust planned field clock_id 映射到 JSON lowerCamel root clockId；系统聚合映射不改变 canonical shape。

~~~json
{
  "clockId": {
    "clockRef": "clock:deterministic:ci",
    "idGeneratorRef": "id:deterministic:ci",
    "deterministicMode": true
  }
}
~~~

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| clock_id.clockRef | opaque ref | deterministic clock | 注入 ClockPort | 不生成 semantic identity | fail-fast |
| clock_id.idGeneratorRef | opaque ref | deterministic ID | 注入 IdGeneratorPort | generated ID 不进 digest | fail-fast |
| clock_id.deterministicMode | bool | true | CI fixture mode | 只允许 Local/CI | fail-fast |

### 8.14 模块级严格 JSON demo：features

~~~json
{
  "features": {
    "outboundEvents": false,
    "projectionJobs": true,
    "externalStatusRefresh": false,
    "redactionFloor": "policy:redaction:strict",
    "diagnosticClass": "body-free-low-cardinality"
  }
}
~~~

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| features.outboundEvents | bool | false | 注册外围 event continuation | 不关闭 local outcome/audit/idempotency | fail-fast/blocked if incomplete |
| features.projectionJobs | bool | true | 注册 projection Jobs | 不让 Query 写 projection | fail-fast if capability missing |
| features.externalStatusRefresh | bool | false | 注册 status feedback Job | 不声明 Observed/Delivered | blocked if unavailable |
| features.redactionFloor | policy ref | strict | 固定最小安全输出 | 只能收紧 | UnsafeOverrideAttempt |
| features.diagnosticClass | enum | body-free-low-cardinality | 选择 safe diagnostic mapper | raw/high-cardinality forbidden | fail-fast |

### 8.15 完整 JSONC 文档示例

下面示例仅用于文档说明，实际运行配置必须删除注释并通过严格 JSON parser。所有 adapter/store/target 值均为 symbolic opaque ref，不代表真实服务、secret、route 或 readiness。

~~~jsonc
{
  "profile": {
    "name": "ci-test",
    "configIdentityMode": "redacted-generated"
  },
  "boundary": {
    "command": {
      "maxRequestBytes": "policy:command:bounded-default",
      "allowedSchemaVersions": ["v1"]
    },
    "query": {
      "pageLimit": "policy:query:bounded-default",
      "freshnessClass": "stale-allowed"
    },
    "consumer": {
      "allowedEnvelopeVersions": ["v1"],
      "maxEnvelopeBytes": "policy:consumer:bounded-default"
    },
    "job": {
      "allowedKinds": [
        "check_capability_binding_consistency",
        "check_reference_integrity",
        "rebuild_tool_derived_views",
        "refresh_external_status_refs"
      ],
      "maxScopeItems": "policy:job:bounded-default"
    }
  },
  "stores": {
    "contract": {"adapterRef": "store:contract:local"},
    "binding": {"adapterRef": "store:binding:local"},
    "invocation": {"adapterRef": "store:invocation:local"},
    "handoff": {"adapterRef": "store:handoff:local"},
    "outcomeAudit": {"adapterRef": "store:outcome-audit:local"},
    "submission": {"adapterRef": "store:submission:local"},
    "projection": {"adapterRef": "store:projection:local"},
    "uow": {"bindingRef": "uow:local:atomic"}
  },
  "idempotency": {
    "commandConsumer": {
      "adapterRef": "store:idempotency:local",
      "retentionClass": "policy:idempotency:command-default"
    },
    "continuationJob": {
      "adapterRef": "store:replay:local",
      "retentionClass": "policy:idempotency:continuation-default"
    }
  },
  "projection": {
    "readFreshnessClass": "stale-allowed",
    "rebuildEnabled": true,
    "rebuildBatchLimit": "policy:projection:bounded-default",
    "statusRefreshEnabled": false
  },
  "jobs": {
    "enabledKinds": [
      "check_capability_binding_consistency",
      "check_reference_integrity",
      "rebuild_tool_derived_views",
      "refresh_external_status_refs"
    ],
    "batchLimit": "policy:job:bounded-default",
    "parallelismClass": "policy:job:single-worker-default",
    "timeoutClass": "policy:timeout:job-slice",
    "retryClass": "none",
    "reportRetentionClass": "policy:report:bounded-default"
  },
  "adapters": {
    "core": {"mode": "candidate-blocked", "adapterRef": "adapter:core:blocked"},
    "hub": {"mode": "blocked-aware"},
    "authorization": {"mode": "blocked-aware"},
    "sandbox": {"mode": "blocked-aware"},
    "source": {"mode": "blocked-aware"},
    "collaboration": {"mode": "route-blocked"},
    "visibility": {"adapterRef": "adapter:visibility:local"},
    "timeoutClass": "policy:timeout:observational",
    "bodyPolicyRef": "policy:body-free:v1"
  },
  "handoff": {
    "targetRefs": [],
    "phasePolicyRef": "policy:handoff:one-call",
    "timeoutClass": "policy:timeout:side-effect",
    "retryClass": "manual-resolution"
  },
  "clockId": {
    "clockRef": "clock:deterministic:ci",
    "idGeneratorRef": "id:deterministic:ci",
    "deterministicMode": true
  },
  "features": {
    "outboundEvents": false,
    "projectionJobs": true,
    "externalStatusRefresh": false,
    "redactionFloor": "policy:redaction:strict",
    "diagnosticClass": "body-free-low-cardinality"
  }
}
~~~

### 8.16 配置项逐域停审记录

| 配置域 | 类型/默认/必填 | 来源/scope/生效 | 敏感/失败 | profile/03 影响 | 结论 |
|---|---|---|---|---|---|
| profile/config.identity | 完整 | D/F/E/L；startup | internal；fail-fast | 三 P0 profile；无回写 | 通过 |
| boundary.command/query/consumer/job | 完整 | D/F/E/X/L；startup/entry/job | public/internal；entry/job reject | CI deterministic；无回写 | 通过 |
| stores.logical/uow | 完整 | F/E/R/X；startup | sensitive-ref；capability fail-fast | local fake/controlled；无回写 | 通过 |
| idempotency.commandConsumer/continuationJob | 完整 | D/F/E/R/X；startup | internal/sensitive-ref；replay fail-fast | bounded replay；无回写 | 通过 |
| projection.readRebuild | 完整 | D/F/E/X/L；startup/job | public/internal；degraded/job reject | Query no-write；无回写 | 通过 |
| jobs.boundedRunner | 完整 | D/F/E/X/L；startup/job | internal；job reject | four named Jobs；无回写 | 通过 |
| adapters.* | 完整 | F/E/R/X；startup | public/sensitive-ref；blocked/fail-closed | blockers retained；无回写 | 通过 |
| handoff.* | 完整 | D/F/E/R/X/L；startup/job | internal/sensitive-ref；ineligible/unknown | one-call fence；无回写 | 通过 |
| clock_id | 完整 | F/E/R/X；startup | sensitive-ref/internal；fail-fast | CI deterministic only；无回写 | 通过 |
| features/redaction/diagnostic | 完整 | D/F/E/R/X；startup/static | internal/secret-ref-only；unsafe override | peripheral only；无回写 | 通过 |

### 8.17 跨配置项闭环审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 配置项是否重复或拥有两个 raw reader | 通过 | 每个 canonical item 只由 infra/config 解析；adapter 只接 typed ref。 |
| 是否存在 storage/common/misc 泛化桶 | 通过 | 十个 root 按功能边界拆分；七 Store 保留独立子项。 |
| 必填/条件必填是否都有失败策略 | 通过 | startup fail-fast、entry/job reject、external blocked、unknown manual 明确。 |
| JSON demo 是否严格且与 root schema 对齐 | 通过 | 模块 demo 严格 JSON；完整 demo JSONC；clock_id 映射为 clockId。 |
| 来源是否统一且高优先级非法不回退 | 通过 | D < F < E；R/X/L 独立；无 remote/admin/CLI/watch。 |
| profile 差异是否完整 | 通过 | 三个 P0 与 P1/P2 candidate 均有来源、fixture/ref 和 failure 差异。 |
| sensitive level 是否遗漏 | 通过 | raw material 禁止；opaque/policy refs 已标注。 |
| feature 是否关闭 core truth/safety | 通过 | 只注册外围 event/projection/status/job；core floor static。 |
| target/adapter/health 是否误当 route/readiness | 通过 | target 空集是无目标；formal Port resolution 才表达 availability。 |
| timeout/retry 是否破坏 unknown/manual fence | 通过 | 使用 category/policy ref；Prepared/unknown 不自动二次调用。 |
| 03 是否需要回写 | 无 | 未新增 root/enum/Port/constructor/lifecycle/error。 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 十个 candidate root 的 JSON path、lowerCamel 映射和 bounded policy refs | 否 | config schema detail | 03 §13.2 已预留 root | 无回写 |
| 七 Store、UoW、Idempotency、Clock/ID、Port ref 的字段化 | 否 | existing infra binding detail | 03 §13.3~§13.6 | 无回写 |
| clock_id Rust field 映射 JSON clockId | 否 | serialization naming | planned field unchanged | 无回写 |
| module demos 使用 symbolic refs、不锁产品 | 否 | documentation example | 不适用 | 无回写 |
| 未来要求新增 root/field/enum/Port/constructor、hot reload 或 raw secret resolver | 是 | code/lifecycle contract | 先回写 03 §4~§15 与对应 calibration Step | future design-change trigger，当前未触发 |

## 10. 正式 04 §7 回填草稿

校准来源为本文件。正式 §7 应依次装配：

1. 配置项命名、十个 root、项目本地前缀和 JSON/JSONC 规则。
2. P0 配置项总表，保留类型、默认/必填、来源、作用域、生效、敏感级别、失败策略和关联模块。
3. profile 与配置域追踪规则。
4. 十个模块的严格 JSON demo 与逐项说明。
5. 完整 JSONC 文档示例，并明确运行时必须移除注释。
6. 逐域停审、跨配置项审计和 03 无回写判定。

正式章节不得新增 exact env name、真实 endpoint、数据库/broker/secret 产品、raw secret、测试结果、run/evidence/sign-off 或 readiness claim。

## 11. 待确认事项

| 事项 | 影响 | 需要谁确认 | 未确认前处理 |
|---|---|---|---|
| bounded policy ref 的最终注册表和数值边界 | Step 9/11/12 | 架构/测试/实施负责人 | 使用 typed policy ref；未登记 ref fail-fast。 |
| durable Store/UoW/connection ref 的具体实现绑定 | Step 8/9/13/14 | 实施/安全/运维 | product-neutral opaque ref；缺 capability 阻断 assembly。 |
| integration-like target/adapter 是否需要额外 conditional item | Step 9/12 | external owner/架构 | 不扩 root；新增 contract 先回写 03。 |
| remote config/admin/hot reload 是否进入未来版本 | Step 13/14 | 架构/安全 | 当前 source/key reject。 |

以上事项不是当前 Step blocker；没有待回写或阻塞待确认。

## 12. Step 7 review gate

| 门禁 | 状态 | 说明 |
|---|---|---|
| P0 配置项完整 | 通过 | 十个 root、21 domain、54 canonical items 已列。 |
| 每项字段列完整 | 通过 | 类型、默认、必填、来源、scope、activation、sensitivity、failure、owner 完整。 |
| 模块级严格 JSON demo 完整 | 通过 | 十个 root 均覆盖。 |
| 完整 JSONC 示例和运行时说明 | 通过 | §8.15；运行时必须删除注释。 |
| 配置项逐域停审 | 通过 | §8.16 十组均通过。 |
| 跨配置项审计无 unresolved | 通过 | §8.17。 |
| 03 影响判定 | 通过 | 当前无回写；future trigger 已记录。 |
| 正式 04 是否提前写入 | 否 | 正式文档待 Step 15 整体装配。 |
| 下一动作 | 继续授权 | 用户已授权完成全部 04；更新 flow/ledger 后串行创建 Step 8。 |
