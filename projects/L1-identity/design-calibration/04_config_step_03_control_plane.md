# 04 配置设计 Step 3 · 建立配置控制面总览

> 子项目: `L1-identity`
> 目标文档: `04-配置设计.md`
> SOP Step: Step 3 建立配置控制面总览
> 状态: 已写入;等待用户审核

---

## 1. Step 状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 3 建立配置控制面总览 |
| 当前状态 | 已写入;等待用户审核 |
| 输入基线 | Step 1 输入边界;Step 2 scope;新版正式 `03-详细设计.md` §5~§8 / §10 / §13~§18 |
| 输出文件 | `projects/L1-identity/design-calibration/04_config_step_03_control_plane.md` |
| 停审方式 | 本 Step 完成后暂停,审核通过后进入 Step 4 categories / boundaries |

本 Step 建立 `L1-identity` 配置来源链、配置进入 runtime 的装配入口、允许读取配置的模块、禁止读取配置的模块、配置控制面和配置域总览。

本 Step 只回答:

- 配置从哪些来源进入系统。
- 配置进入系统的主要装配入口是什么。
- 哪些模块可以读取 raw / validated config,哪些模块只能接收已注入的 port、facade 或 typed 参数。
- Step 2 的 P0 / P1 / P2 范围应先拆成哪些控制面和配置域。
- 每个配置域允许控制哪些行为,禁止控制哪些领域不变量。
- 每个配置域与新版 `03-详细设计.md` 中既有 module / port / flow / repository / operations 的关系。
- 当前控制面拆分是否对 `03-详细设计.md` 产生回写影响。

本 Step 不定义最终配置项、默认值、环境变量名、JSON / TOML schema、secret provider、来源优先级、冲突处理、环境矩阵、加载函数、热更新策略、部署命令、产品选型、测试编号或实施 boundary。

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 已审核通过 | 提供新 `03` 作为直接上游、旧 `04` 降级为历史诊断输入的规则 |
| `04_config_step_02_scope.md` | 已审核通过 | 提供 P0 / P1 / P2 scope、非范围和无配置判定 |
| `03-详细设计.md` §5 | 已完成 | 提供七个 crate 的职责、依赖方向和禁止承接边界 |
| `03-详细设计.md` §6 | 已完成 | 提供 object / trait / API 索引,尤其 runtime config shell、runtime assembly state 和 port family |
| `03-详细设计.md` §7 | 已完成 | 提供 command / query / inbound / callback / job protocol names |
| `03-详细设计.md` §8 / §10 / §12 | 已完成 | 提供 function flow、persistence / transaction、idempotency / stored replay 红线 |
| `03-详细设计.md` §13 | 已完成 | 提供配置 ownership、config reference table、external dependency binding、runtime builder 和 forbidden config boundary |
| `03-详细设计.md` §14 / §15 | 已完成 | 提供 observability / redaction 和 config/runtime/adapter 最小测试切口 |
| `03-详细设计.md` §17 / §18 | 已完成 | 提供下游 `04/05/06/07` 复核风险和正式装配说明 |
| 旧 `04-配置设计.md` 与旧 `04_config_step_03_control_plane.md` | 历史诊断输入 | 只用于识别旧名漂移;不得作为本 Step 真相源 |
| `L1-governance` Step 3 calibration | 参考样式 | 只参考粒度和表格组织,不复用治理业务对象 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前系统配置从哪些来源读取? | 来源链先按 `code defaults -> config file -> environment variables -> secret refs -> test fixture / controlled override` 建立总览。Step 3 只确认来源类型和覆盖方向预览;最终优先级、冲突处理、secret raw value 禁止覆盖规则留给 Step 5 / Step 8。 |
| 配置进入系统的唯一或主要装配入口是什么? | 主要入口是 infra config loader 完成 raw config parse / validation 后,把 validated config refs / typed config shell 交给 runtime builder / entry composition root,再装配 repository、UnitOfWork、clock/id、resolver、publisher、handoff、audit、adapter availability registry、application facade 和 API / worker / jobs entry surfaces。 |
| 是否需要在本 Step 正式新增 `IdentityRuntimeConfig` schema? | 不需要。新版 `03` 已正式出现 `IdentityRuntimeConfigShell`、`IdentityRuntimeAssemblyState` 和 runtime builder / config binding 边界,但未授权本 Step新增完整 Rust config struct 或文件 schema。本 Step 只定义配置控制面。 |
| 哪些模块读取配置,哪些模块不得直接读取配置? | `identity-infra` 可以读取 raw / validated config 并执行 runtime assembly。`identity-api`、`identity-worker`、`identity-jobs` 只能消费 validated config snapshot、entry-local / job-run-start 参数和 application facade。`identity-application` 只接收 injected ports、facade、typed parameters 或 prepared config-bound markers。`identity-domain` 和 `identity-contracts` 不读取配置。 |
| 配置控制哪些行为,不控制哪些领域不变量? | 配置控制 profile、runtime assembly、store / UoW binding、actor context input、role/capability source binding、bus / outbox publication、projection/reference/report storage、operations jobs、external resolver / handoff adapters、audit / redline / observability、clock/id 和 deterministic fixture 等执行接缝。配置不得控制 identity truth ownership、状态机合法迁移、事务顺序、expected version、stored replay、query no-write、job no-truth-repair、outbox payload 来源、projection 不反写、body-free/secret-free 边界。 |
| 每个配置控制面应拆成哪些配置域 / 功能模块? | 本 Step 拆为 profile / runtime assembly、store / transaction carrier、actor context / entry-local、role and capability source binding、bus / outbox publication、projection / reference / report、operations job runners、external resolver / handoff adapters、audit / redline / observability、clock / id / deterministic fixture 十类控制面。 |
| 每个配置域对应哪些详细设计 runtime config、builder、adapter 或外部依赖? | 每个配置域必须回指新版 `03` 中已存在的 module、port family、protocol、flow、repository、job 或 redline;不能只写“需要配置”,也不能从旧 `04` 或旧 implementation 反推新配置域。 |
| 配置变化会影响哪些下游文档? | 影响正式 `04` 后续 Step 4~14,并给 `05` 的 config/runtime/adapter 测试、`06` 的配置验收和 redline evidence、`07` 的配置落地 boundary 与开工门禁提供输入。若配置结论改变 `03` 代码契约,必须先回写 `03`。 |
| 跨控制面是否有重叠、领域不变量误配置化或 `03` 契约影响未识别? | 已完成跨控制面审计。重叠项按 owner 收口:store owner 归 store / transaction,transport route 归 bus / outbox,runner owner 归 operations jobs,secret owner 归 Step 8。当前未发现必须新增 `03` schema / port / state / error / DTO / flow 的缺口。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 2 scope | 已确认 `L1-identity` 不是 no-config project,但尚未形成配置控制面 | 本 Step 建立来源链、控制面总表和配置域 / 功能模块表 |
| 新版 `03` §13 | 定义了配置 ownership、external binding 和 builder boundary,但不是正式 `04` 控制面结构 | 本 Step 把 `03` 绑定点整理为配置设计控制面 |
| 新版 `03` §5~§8 | module / port / protocol / flow 已闭合,但配置设计不能按旧 flow 名展开 | 本 Step 只使用新版 names,旧名不进入正式控制面 |
| 旧 `04-配置设计.md` | 含早于新版 `03` 的 profile、command、job、adapter 口径 | 降级为历史诊断输入,不继承对象名或配置项 |
| 旧 Step 3 calibration | 混入过期 port / job / flow 名,并提前写 profile 口径 | 全量替换为新版 `03` 派生控制面 |
| 后续 Step 5~8 | 来源优先级、配置项、secret 和 schema 尚未定义 | 本 Step 不提前填值,只留下后续承接 |

## 5. 改动前后对比

| 项 | 改动前 | 本步后 | 原因 |
|---|---|---|---|
| 配置来源 | 只有 Step 2 的范围级描述 | 建立来源链图和覆盖方向预览 | 支撑 Step 5 来源优先级与冲突处理 |
| 配置入口 | 旧文档散写 config loader / profile / adapter | 固定为 infra config load / validate -> runtime builder / composition root -> adapter / facade assembly | 防止 application / domain / contracts 直接读取 raw config |
| 控制面拆分 | P0/P1/P2 未按控制面停审 | 拆成 10 个控制面和若干配置域 | 后续 Step 4 / Step 7 可逐域展开 |
| 旧名处理 | 旧 control plane 仍可能带旧 command/job/port 名 | 只使用 `EstablishGlobalMember`、`MaintainRoleCapabilitySummary`、`PublishIdentityOutbox`、`RebuildIdentityProjection`、`RefreshExternalReferenceState` 等新版口径 | 避免旧 `04` 反向约束新版 `03` |
| 禁止控制能力 | Step 2 只列总体红线 | 每个配置域都写允许 / 禁止能力 | 防止领域不变量被配置化 |
| 详细设计影响 | 总体声明不新增代码契约 | 每个控制面做 `03` 影响判定 | 保持配置设计不静默新增 schema / port / state / DTO |

## 6. 配置设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 来源链是否写成最终优先级 | A. 当前直接定义最终优先级;B. 只写来源和覆盖方向预览 | 采用 B。最终优先级与冲突处理属于 Step 5 |
| 控制面是否按 crate 技术层拆 | A. 只按七个 crate 拆;B. 按功能控制面拆,再回指 crate / port / flow | 采用 B。配置设计面向配置控制和审查,不是文件索引 |
| 是否当前列完整配置项清单 | A. 直接列 key/default/env/schema;B. 先拆控制面 / 配置域 | 采用 B。Step 7 才定义配置项清单 |
| 是否提前锁定 profile 名称和矩阵 | A. 继承旧 `04` profile;B. 仅保留 profile 控制面,Step 6 再裁决 | 采用 B。旧 profile 不能直接成为新版真相源 |
| 是否新增 `IdentityRuntimeConfig` | A. 在 `04` Step 3 定义完整 schema;B. 只承接 `IdentityRuntimeConfigShell` / runtime assembly boundary | 采用 B。新增 schema 会越过新版 `03` |
| 是否允许 entry 直接读 raw config | A. entry 自行读取 raw config;B. entry 只消费 validated snapshot / entry-local 参数 | 采用 B。符合 `03` §13 raw config ownership |
| 是否把 adapter disabled 当作业务通过 | A. disabled/fake 可默认 success;B. disabled/fake/controlled 必须返回正式 outcome / issue surface | 采用 B。符合 fake/durable parity 和 redaction 红线 |

## 7. 结构化中间产物

### 7.1 配置来源链图

#### 配置来源链图: L1-identity 配置覆盖链

```text
[code defaults]
  -> [config file]
  -> [environment variables]
  -> [secret refs]
  -> [test fixture / controlled override]

        |
        v

[infra config load / parse / validate]
  -> [validated config refs / typed config shell]
  -> [runtime builder / entry composition root]
  -> [repositories / UoW / resolvers / publisher / handoff / audit / clock-id adapters]
  -> [application facade]
  -> [api / worker / jobs entrypoints]
```

关键说明:

- 图只表达来源类型、覆盖方向预览和装配入口,不表达最终优先级、冲突处理、部署命令或产品选择。
- `secret refs` 表示普通配置中只能出现 secret reference;raw secret material 的读取、轮换和审计留给 Step 8。
- `test fixture / controlled override` 只服务 deterministic test、local-dev 和 ci-test,不得成为 production-like profile 的隐式最高优先级来源。
- `identity-domain`、`identity-contracts` 和 `identity-application` 不读取 raw config;配置必须先在 `identity-infra` 中变成 validated config refs、port 注入或 typed 参数。
- GlobalMember truth、lifecycle state matrix、RoleCapabilitySummary truth、CareerRecord truth、MemoryReference state、outbox payload marker 和 stored replay 语义不受配置来源覆盖。

### 7.2 配置控制面总表

| 控制面 | 作用 | 对应模块 | 是否 P0 | 对详细设计绑定 |
|---|---|---|---|---|
| profile / runtime assembly | 选择 runtime profile,校验 config refs,装配 facade 和 adapter availability | `identity-infra`, runtime builder / composition root, `identity-api`, `identity-worker`, `identity-jobs` | 是 | `IdentityRuntimeConfigShell`, `IdentityRuntimeAssemblyState`, `03` §13 |
| store / transaction carrier | 选择 truth、append-only、projection、reference、outbox、idempotency、result/report store adapter 和 UoW | repositories, UoW manager, result/report stores | 是 | `03` §6 port family, §10 persistence / transaction, §12 idempotency |
| actor context / entry-local | 控制 Gateway trusted context、operation metadata、idempotency key / digest 和 entry-local job-run-start 参数 | `identity-api`, `identity-worker`, `identity-jobs`, application facade | 是 | `IdentityOperationContext`, entry facade restriction, command/query/job protocols |
| role and capability source binding | 控制 role/capability source resolver、source snapshot、fingerprint drift 和 unavailable/degraded surface | role/capability resolver ports, source snapshot repository | 是 | `MaintainRoleCapabilitySummary`, role/capability source refs, external resolver binding |
| bus / outbox publication | 控制 outbox store、topic-neutral route binding、publisher adapter、publish batch/retry/failure marker | outbox repository, publisher port, `PublishIdentityOutbox` | 是 | outbound material, outbox state, topic/publisher adapter binding |
| projection / reference / report | 控制 summary projection、stable lookup、reference state、reconciliation/report store 和 read availability | projection/read/reference/report repositories, query service | 是 | `ReadMemberSummary`, `RebuildIdentityProjection`, `RefreshExternalReferenceState`, reconciliation report |
| operations job runners | 控制 publish、rebuild、refresh、reconcile、handoff、retry propagation 等 runner availability / batch / retry | `identity-jobs`, application job services | 是 | job DTO / report / stored replay, no-truth-repair rules |
| external resolver / handoff adapters | 控制 governance basis、work source、artifact/evidence ref、memory/archive、trace handoff 和 archive callbacks 的 adapter binding | resolver / handoff ports, worker callbacks, jobs | P1/P2 | external dependency binding;inbound/callback protocols |
| audit / redline / observability | 控制 safe logs、metrics、business audit/trace cut、redaction guard 和 forbidden material scan | audit/trace repositories, observability hooks, redline checker | 是 | `03` §14 / §15, body-free and secret-free boundary |
| clock / id / deterministic fixture | 控制 clock/id adapter、deterministic fake、fixture source 和 controlled test override | clock/id ports, fake runtime, test harness | 是 | `IdentityClockPort`, `IdentityIdGeneratorPort`, fake/durable parity |

### 7.3 配置域 / 功能模块总表

| 配置域 / 功能模块 | 来源控制面 | 对应详细设计模块 | 允许配置的能力 | 禁止控制的能力 |
|---|---|---|---|---|
| profile selector | profile / runtime assembly | runtime builder, entry composition root | 选择 validated profile 和 adapter mode 组合 | 改变 domain 状态机、truth ownership、accepted 语义或 stored replay 规则 |
| runtime config shell / assembly validation | profile / runtime assembly | `IdentityRuntimeConfigShell`, `IdentityRuntimeAssemblyState` | 校验 config refs、assembly readiness 和 safe validation issue refs | 保存 raw config、secret、external body 或把 `Assembled` 解释为 adapter healthy |
| adapter availability registry | profile / runtime assembly | adapter availability markers and registry | 标记 fake / controlled / endpoint / disabled / degraded / unavailable | 用 availability 绕过 business error、visibility、idempotency 或 redline |
| core truth store binding | store / transaction carrier | member、lifecycle、role/capability、career、memory repositories | 选择 truth store adapter 和 UoW carrier | 改变 schema、expected version、state transition 或 transaction order |
| append-only / trace / audit store binding | store / transaction carrier | trace、audit、history repositories | 选择 append-only store 和 retention carrier | 用 logs 替代 business audit 或写 raw external/source body |
| projection/read store binding | projection / reference / report | stable summary view and read repositories | 选择 projection store、lookup index 和 stale/degraded surface | query 写 truth、临时拼 view ref 或 projection 反写 core truth |
| reference/report store binding | projection / reference / report | reference snapshot and reconciliation report repositories | 选择 reference state、typed sidecar、report store 和 failure marker承载 | 保存 external body 或用 refresh/reconciliation 自动修正 truth |
| outbox store / payload marker binding | bus / outbox publication | outbox repository and outbound material marker | 保存 accepted-only outbox record、payload marker 和 publication state | publisher 从 current truth 临时拼 payload 或失败回滚 command transaction |
| idempotency/result/report replay store | store / transaction carrier | idempotency, stored command result, receipt, job report repositories | 配置 duplicate replay store 和 retention承载 | 关闭幂等、重跑 mutation、重读当前 truth 拼 replay surface |
| trusted actor context input | actor context / entry-local | API / worker / jobs entry context factory | 要求 Gateway trusted actor、trace/correlation metadata 和 source channel marker | identity 内部做 login/token/session/credential 校验 |
| operation metadata / request digest input | actor context / entry-local | command/query/consumer/job dispatch facade | 要求 idempotency key、request digest、operation name 和 channel | 允许无 metadata 写路径进入 accepted transaction |
| role/capability source resolver | role and capability source binding | role/capability source resolver port and snapshot repository | 选择 role/capability source family、snapshot/fingerprint mode 和 unavailable surface | 保存 role definition body、源码正文或反写 source truth |
| work source resolver / career consumer | external resolver / handoff adapters | work source resolver, career consumer flow | 启用 work participation event source、safe summary refs 和 dedup | 反写 work/process truth 或覆盖 CareerRecord history |
| memory/archive resolver and handoff | external resolver / handoff adapters | memory/archive resolver, archive handoff/callback | 启用 memory ref validation、archive handoff target 和 callback availability | 保存 memory text、archive package body 或假装 archive delivered |
| governance basis resolver | external resolver / handoff adapters | governance basis resolver and lifecycle guard | 选择 governance basis summary resolver、degraded/unavailable outcome | 保存 governance policy body 或绕过 lifecycle high-risk guard |
| artifact/evidence ref resolver | external resolver / handoff adapters | artifact/evidence ref resolver | 启用 evidence ref validation、safe summary marker 和 unavailable issue | 保存 artifact body、evidence body 或 raw adapter response |
| bus publisher adapter | bus / outbox publication | publisher port, `PublishIdentityOutbox` job | 选择 fake / controlled / endpoint publisher 和 retry/dead-letter class | command 事务内直接发布外部 bus 或默认发布成功 |
| topic-neutral route binding | bus / outbox publication | outbound topic key mapping | 将 formal event/topic-neutral key 绑定到 transport route | ad hoc 拼 topic、改变 event kind、payload schema 或业务语义 |
| operations job runner binding | operations job runners | `PublishIdentityOutbox`, `RebuildIdentityProjection`, `RefreshExternalReferenceState`, `RunIdentityReconciliation`, handoff / retry jobs | 配置 runner availability、batch、retry、timeout、parallelism 和 report store | job 修复 core truth、绕过 application service 或 duplicate replay 重跑 job body |
| trace handoff adapter | external resolver / handoff adapters | `PrepareTraceHandoff`, `DeliverTraceHandoff` | 启用 handoff target、package marker、receipt marker 和 failure surface | 保存 observability ledger body 或让 downstream status 定义 identity truth |
| propagation retry adapter | operations job runners | `RetryIdentityPropagationFailures` | 配置 retry scope、attempt limit 和 terminal marker | 静默丢弃 failed propagation 或把 retry success 当作 command accepted |
| redaction/safe diagnostics | audit / redline / observability | logs, metrics, trace/audit/report hooks | 配置 safe field policy、deny list、diagnostic issue refs | 输出 raw request/event/job/config/source/archive/receipt/adapter/fake private material |
| deterministic clock/id | clock / id / deterministic fixture | clock/id ports and fake runtime | 配置 deterministic fake clock/id 和 fixture-scoped ids | handler/domain 拼 id/time 或 production-like profile 使用 test override |
| fixture source | clock / id / deterministic fixture | test harness, fake adapters, contract fixtures | 配置 deterministic role/member/outbox/projection/reference fixtures | 用 fixture 替代正式 external contract、port outcome 或 production source |

### 7.4 配置控制面停审记录

| 配置域 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| profile selector | 来源链、允许控制能力、禁止控制能力、`03` 契约影响 | 通过 | 只选择 profile 与 adapter 组合,不新增 runtime config schema |
| runtime config shell / assembly validation | raw config、secret 和 adapter health 是否误入 business surface | 通过 | `Assembled` 只表示 wiring ready,不表示 adapter healthy |
| adapter availability registry | disabled / degraded 是否误改业务语义 | 通过 | availability 只影响装配、report 和失败表面 |
| core truth store binding | store 是否改变 truth / transaction | 通过 | store 只承载 repository,不改变 expected version / UoW |
| append-only / trace / audit store binding | audit 是否被 logs 替代 | 通过 | business audit / trace 仍走正式 object / repository |
| projection/read store binding | query / rebuild 是否反写真相 | 通过 | projection 只读;rebuild 不改 core truth |
| reference/report store binding | refresh / reconcile 是否修正 truth | 通过 | 只写 reference state / report / marker |
| outbox store / payload marker binding | publisher 是否能创造事件 | 通过 | 只能发布 accepted transaction 持久化的 outbox material |
| idempotency/result/report replay store | duplicate replay 是否可关闭 | 通过 | 不允许配置关闭幂等或 stored replay |
| trusted actor context input | 是否引入 identity 内认证 | 通过 | 只消费 Gateway 注入 context |
| operation metadata / request digest input | 写路径是否可缺 metadata | 通过 | 无 metadata 写路径应 reject / delayed,不进入 accepted |
| role/capability source resolver | 是否保存外部定义正文 | 通过 | 只保存 ref、snapshot marker、safe summary 或 fingerprint |
| work / memory / governance / artifact resolvers | 是否反写外部 truth 或保存正文 | 通过 | 均通过 port / event / safe ref,不引入 sibling implementation dependency |
| bus publisher / topic binding | topic 是否改变 event schema | 通过 | route binding 不改变 event kind / payload |
| operations job runner binding | job 是否修复业务 truth | 通过 | job 写 marker / report / derived state,不改 core truth |
| trace handoff / propagation retry | downstream 是否定义 identity truth | 通过 | downstream receipt 只影响 handoff / propagation state |
| redaction/safe diagnostics | forbidden body / secret 是否输出 | 通过 | 具体 deny list 留 Step 8 / Step 9,边界已固定 |
| deterministic clock/id / fixture | test override 是否越界 | 通过 | 只服务 deterministic test / local-dev / ci-test |

### 7.5 跨控制面审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 控制面是否覆盖 Step 2 P0 范围 | 通过 | `EstablishGlobalMember`、`MaintainRoleCapabilitySummary`、`ReadMemberSummary`、`PublishIdentityOutbox`、`RebuildIdentityProjection`、`RefreshExternalReferenceState` 相关配置控制面均已覆盖 |
| 是否直接进入配置项清单 | 通过 | 本 Step 只拆控制面 / 配置域;配置项留 Step 7 |
| 来源链是否误写最终优先级 | 通过 | 仅表达覆盖方向预览;最终优先级留 Step 5 |
| 是否存在控制面重叠 | 通过 | store、transport route、runner、secret、fixture owner 已分离 |
| 是否把领域不变量配置化 | 通过 | truth ownership、state matrix、transaction、visibility、stored replay、outbox source、projection no-write、job no-repair 均列入禁止控制能力 |
| 是否遗漏详细设计绑定点 | 通过 | `03` module、port family、protocol、flow、state/persistence、config binding、observability/redaction、test cut 均已映射 |
| 是否需要新增 `03` runtime config 字段 | 未发现 | 当前只重组既有绑定点,不新增代码契约 |
| 是否需要新增 adapter constructor / port | 未发现 | 当前不改变 `03` port;后续 Step 7 若发现缺口再阻塞回写 |
| 是否保留旧对象 / 旧 job / 旧 port 名为正式口径 | 通过 | 本 Step 正式控制面只使用新版 `03` 名称 |
| 是否引入产品选型 | 通过 | 仍保持 product-neutral / fake / controlled / disabled / degraded 口径 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---|---|---|---|
| 配置入口固定为 infra config loader -> runtime builder / composition root -> adapter / facade assembly | 否 | 承接 `03` §13 和 module boundary | 不适用 | 无回写 |
| 配置控制面拆为 profile、store、actor context、role/capability source、bus/outbox、projection/reference/report、operations、external resolver/handoff、audit/redline、clock/id/fixture | 否 | 对既有绑定点做配置设计分组 | 不适用 | 无回写 |
| `identity-application`、`identity-domain`、`identity-contracts` 不读取 raw config | 否 | 承接配置 ownership 和依赖方向 | 不适用 | 无回写 |
| 每个配置域均声明禁止控制领域不变量 | 否 | 设计边界重申 | 不适用 | 无回写 |
| 后续若配置项要求新增 runtime config 字段、builder signature、adapter constructor 参数、port、error、flow 或 DTO | 是 | 代码契约变更 | `03` 对应 module / object / port / protocol / flow / error / config 章节 | 阻塞待确认 |

## 9. 回填草稿

正式 `04-配置设计.md` §3 可回填:

```md
## 3. 配置控制面总览

> 校准来源:
> - `design-calibration/04_config_step_03_control_plane.md`

`L1-identity` 的配置从 code defaults、config file、environment variables、secret refs 和 test fixture / controlled override 进入,经 infra config loader 加载、解析和校验后,由 runtime builder / entry composition root 装配 repositories、UnitOfWork、resolvers、publisher、handoff、audit、clock / id adapters 和 application facade,再提供给 API / worker / jobs entrypoints。

raw config 只能由 `identity-infra` 读取。`identity-api`、`identity-worker` 和 `identity-jobs` 只能消费 validated config snapshot、entry-local / job-run-start 参数和 application facade。`identity-application` 只接收 injected ports、typed parameters 或 prepared config-bound markers。`identity-domain` 与 `identity-contracts` 不读取配置。

本仓配置控制面分为 profile / runtime assembly、store / transaction carrier、actor context / entry-local、role and capability source binding、bus / outbox publication、projection / reference / report、operations job runners、external resolver / handoff adapters、audit / redline / observability、clock / id / deterministic fixture 十类。
```

## 10. 待确认事项

| 编号 | 待确认事项 | 影响 | 当前处理 |
|---|---|---|---|
| ID-CONFIG-Q5 | code defaults、config file、env、secret refs、test override 的最终优先级 | 影响冲突处理和 fail-fast 规则 | Step 5 正式定义 |
| ID-CONFIG-Q6 | profile 名称、profile 矩阵和 adapter mode 组合 | 影响环境、测试、验收和实现配置文件 | Step 6 正式定义 |
| ID-CONFIG-Q7 | 每个配置域的具体配置项、默认值、必填性、来源和作用域 | 影响 implementation config schema | Step 7 正式定义 |
| ID-CONFIG-Q8 | secret provider、raw secret 禁止输出、轮换和审计 | 影响安全和运维 | Step 8 正式定义 |
| ID-CONFIG-Q9 | config loader / validator / runtime builder 具体失败策略 | 影响启动、entry reject、job reject 和 degradation surface | Step 9 / Step 11 正式定义 |
| ID-CONFIG-Q10 | 真实 durable store、broker、handoff、observability backend 产品选择 | 影响 production adapter 和 integration evidence | 后续 `04/07` 或运维材料裁决;本 Step 不选型 |

## 11. 进入下一步条件

- 配置来源链图已建立。
- 配置进入系统的主要装配入口已明确。
- 允许读取配置和禁止读取配置的模块已明确。
- 配置控制面和配置域已拆分。
- 每个配置域已完成停审记录。
- 跨控制面审计没有 unresolved 冲突。
- 对 `03-详细设计.md` 的影响判定已记录,当前无必须回写项。
- 未提前定义配置项、默认值、env var、schema、secret provider、profile 矩阵、测试编号或实施 boundary。

下一步进入 Step 4:定义配置分类与禁止配置化边界。
