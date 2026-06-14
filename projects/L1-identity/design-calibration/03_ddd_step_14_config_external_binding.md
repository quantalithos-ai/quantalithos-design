# Step 14. 配置引用与外部依赖绑定

> 对应正式文档章节: `03-详细设计.md` 第 13 章 配置引用与外部依赖绑定
> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 14
> 当前状态: Step 14 已完成;等待用户审核后进入 Step 15 observability / audit
> 本文件性质: 详细设计 Step 14 中间产物,不是正式 `03-详细设计.md`

---

## 1. 14.0 framework / input boundary / batch plan

本批只建立 Step 14 的执行框架、输入边界、SOP 问题初答、材料诊断、设计原则、分批计划和 Step 13 handoff 承接。配置引用明细表、外部依赖绑定表、跨仓依赖表和回填草稿在后续小批次逐步写入。

### 1.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 14 配置引用与外部依赖绑定 |
| 当前批次 | 14.0 framework / input boundary / batch plan |
| 当前结论 | 可以进入 Step 14;本 Step 只写代码绑定点和依赖绑定,不写完整配置手册 |
| 本批边界 | 不新增 object、port、state、error、DTO、config loader API、env var 名、secret provider、数值默认值或部署 runbook |
| 输出文件 | `projects/L1-identity/design-calibration/03_ddd_step_14_config_external_binding.md` |
| 下一批 | 14.1 configuration boundary and code binding inventory |

### 1.2 Step 14 总体目标

Step 14 的目标是让实现者知道:

- 哪些模块允许读取配置,哪些模块只能接收已经注入的 port / typed parameter。
- 配置项与 `identity-infra`、`identity-api`、`identity-worker`、`identity-jobs` 的代码绑定点是什么。
- 哪些外部依赖必须通过 Step 7 的 adapter / port / facade / fake surface 注入。
- 哪些依赖可以写成 Cargo path dependency,哪些只能通过 runtime adapter、event、handoff、projection、fixture 或 fake 表达。
- 哪些配置只能改变技术装配,不得改变 identity truth、状态矩阵、事务、幂等、body-free 和 fake/durable parity 不变量。
- 当实现发现配置绑定需要新的 schema、port、state、error 或 DTO 时,应暂停并回对应 Step 闭口。

本 Step 不定义完整配置文件格式、环境变量名、secret provider、TLS、endpoint、数据库产品、queue 产品、timeout / retry / retention 具体数值、cron 表达式、部署命令或运维 runbook。这些属于 `04-配置设计.md`、实施计划或运维材料。

### 1.3 本步输入

| 输入 | 当前状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_03_constraints.md` | 已完成 | 固定 Rust workspace、`core-contracts` 编译期依赖候选、运行期 / 事件协作依赖不得进 Cargo |
| `03_ddd_step_04_file_layout.md` | 已完成 | 固定 `infra/config.rs`、runtime builder、adapter 文件职责和 workspace crate 形态 |
| `03_ddd_step_05_module_contracts.md` | 已完成 | 固定 `infra` 负责 config binding / runtime assembly,`api` / `worker` / `jobs` 只做 entry mapping |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供 runtime / entry / marker / state / adapter availability 的对象来源和禁止新增对象红线 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 repository、UnitOfWork、Clock、IdGenerator、resolver、publisher、handoff、adapter availability、facade 和 fake parity |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 command/query/event/job metadata、topic key、receipt/report 和 body-free protocol surface |
| `03_ddd_step_09_function_flows.md` | 已完成 | 提供 command、query、consumer、callback、publish、maintenance、handoff job 的 adapter 调用位置 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 提供 truth、projection、outbox、handoff、idempotency、job 等状态不可被配置改写的边界 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 提供 logical store、transaction、version、cursor、stored replay 和 no hidden write 规则 |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 提供 disabled、unavailable、degraded、retryable、terminal failure 的映射边界 |
| `03_ddd_step_13_concurrency_idempotency.md` | 已完成 | 提供 retention、in-flight timeout、digest algorithm、retry schedule、worker transport binding 的配置承接点 |
| `projects/L1-identity/04-配置设计.md` | Draft | 提供配置控制面、profile、adapter mode、配置项、敏感配置和加载校验语义 |
| `projects/L1-governance/design-calibration/03_ddd_step_14_config_external_binding.md` | 参考材料 | 只参考 Step 14 粒度和表结构,不复制 governance 业务对象 |

### 1.4 SOP 问题初答

| SOP 问题 | Step 14 初答 |
|---|---|
| 哪些模块需要读取配置? | 只有 `identity-infra` 的 config/runtime builder、`identity-api` / `identity-worker` / `identity-jobs` 的 entry 装配层可读取配置或 validated config snapshot。`identity-application` 只接收 Step 7 port、facade、typed参数或 service 构造参数。`identity-domain` 和 `identity-contracts` 不读取配置。 |
| 配置项的类型、默认值和读取位置是什么? | `04-配置设计.md` 已给出 profile、store、actor_context、role_catalog、bus、outbox、projection、operations、external_refs、audit、redline、fixture 等配置项。本 Step 后续只把这些配置项映射到代码读取模块和注入点,不重新定义完整 schema 或 env var 名。 |
| 哪些外部依赖需要通过 adapter 注入? | method-library role catalog source、governance basis resolver、work/project/career source、artifact、memory/archive、bus publisher、audit/trace sink、handoff / callback、operations report writer、clock/id generator、store 和 fake/controlled/disabled adapters 均通过 Step 7 port / adapter surface 注入。 |
| 外部依赖的超时、重试、降级策略是什么? | Step 14 只绑定 timeout / retry / availability / disabled 的配置入口和代码使用点;具体数值由 `04-配置设计.md` 或后续运维配置定义。错误分类必须服从 Step 12,terminal/retryable 必须服从 Step 10/13。 |
| 哪些配置细节应留给配置设计文档? | 文件格式、环境变量名、secret ref 解析方式、endpoint、topic transport route、数值默认值、profile merge、hot reload、deployment command、runbook 和证据脚本路径留给配置设计、测试方案或实施计划。 |
| 哪些跨仓 Rust 编译期依赖需要通过本地 path dependency 引入? | 当前只允许 `core-contracts = { path = "../quantalithos-core/crates/contracts" }` 作为编译期依赖候选。是否每个 member crate 使用该 workspace dependency 由 Step 4/5/后续实现需要决定。 |
| 哪些运行期依赖或事件协作依赖需要通过 adapter / event / projection / fake 表达? | `quantalithos-bus`、`quantalithos-method-library`、`quantalithos-work`、`quantalithos-governance`、memory/archive、artifact、observability、runtime、downstream consumers 均不能进入 identity Cargo path dependency,只能通过 port、event、projection、handoff、fixture 或 fake 表达。 |
| 依赖仓库不存在时,当前实现应暂停、使用 fixture / fake,还是等待对应仓库完成? | 编译期 `core-contracts` 不存在或缺 shared type 时暂停并回设计闭口。运行期依赖不存在时,P0 使用 fake / controlled fixture;若正式 flow 需要上游 typed schema、port、mapper 或 stable ref 但尚未定义,必须暂停回 Step 6/7/8/9/14 闭口,不得在实现侧私造 sibling DTO。 |

### 1.5 当前材料诊断

| 材料 / 倾向 | 当前问题 | Step 14 处理 |
|---|---|---|
| `04-配置设计.md` 已经很细 | 容易把 Step 14 写成第二份配置手册 | Step 14 只写代码绑定点和依赖注入表,字段细节回指 `04` |
| Step 7 已定义 fake / controlled / disabled adapter contract | 配置若绕过 port 直接让 entry 访问 fake map,会破坏 fake/durable parity | Step 14 固定 config 只选择 adapter mode / fixture,不开放 private map |
| Step 13 把 retention / digest / retry / worker transport 留给 Step 14 | 这些是配置绑定点,但不是可改变 invariant 的开关 | Step 14 明确“可配置技术参数”和“不可配置设计规则” |
| `identity-api` / `identity-worker` / `identity-jobs` 需要 entry-local 参数 | 若 Step 14 直接发明 CLI flag / env var 名,会越过配置设计和实施计划 | 本 Step 只定义 entry-local 参数类别和绑定位置,不定义具体 flag 名 |
| 外部依赖仓本地存在 | 容易把 method/work/governance/bus 误写成 Cargo dependency | Step 14 必须输出跨仓依赖表,除 `core-contracts` 外全部 runtime/event/fake 协作 |
| P0 local/CI 需要可运行 | 若真实 endpoint 必填,P0 会无法闭环 | Step 14 承认 fake / controlled / disabled adapter 是正式装配策略,但禁止伪造业务成功 |

### 1.6 设计原则

| 原则 | 说明 |
|---|---|
| infra owns config | raw config 只在 `identity-infra` config loader / runtime builder 和 entry composition root 读取 |
| application owns behavior | application 只接收 port / typed params,不得读取 raw config 或根据 config 绕过 flow |
| domain/contracts are config-free | domain state / policy / DTO schema 不感知配置 |
| config selects adapters, not truth | config 可选择 store、adapter、fixture、profile、retry、retention、timeout、batch,不得改变 identity truth owner |
| body-free by default | raw secret、raw external body、RoleDefinition body、memory body、Artifact body、ProjectMember truth 不进入 config、outbox、projection、report、stored result 或 log |
| disabled is explicit | disabled/unavailable adapter 必须返回正式 disabled / unavailable / degraded surface,不得假成功 |
| no private fake route | fake/controlled fixture 只能通过正式 port shape 暴露,不得给 service / test 私有 map |
| runtime dependency is not Cargo dependency | 运行期、事件、handoff、projection 和 downstream 协作不得写成 identity Cargo path dependency |
| config cannot reopen terminal state | terminal outbox/handoff/idempotency/job state 不能靠 config retry 或改写 |
| missing binding is a blocker | 若实现需要新 config schema、port、mapper、state、DTO 或 error,暂停回对应 Step 闭口 |

### 1.7 Step 14 分批计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 14.0 | framework / input boundary / batch plan | [x] 已写入 |
| 14.1 | configuration boundary and code binding inventory | [x] 已写入 |
| 14.2 | config reference table by section / module | [x] 已写入 |
| 14.3 | external dependency binding table and adapter strategy | [x] 已写入 |
| 14.4 | cross-repo dependency binding / runtime builder order / validation boundaries | [x] 已写入 |
| 14.5 | cross-step closure / Step 15 handoff /回填草稿 | [x] 已写入 |

### 1.8 Step 14 写入红线

| 红线 | 说明 |
|---|---|
| 不写完整配置手册 | 不写最终 JSON schema、env var 名、secret provider、部署命令或具体数值 |
| 不新增对象 / port / DTO / state / error | 如果需要新增,记录 blocker 并回 Step 6~12 闭口 |
| 不把 config 写进 contracts/domain | public DTO 和 domain object 不携带 runtime config |
| 不让 entry 绕过 facade | API/worker/jobs entry 不得因 config 直接拿 repository、publisher、projection、handoff 或 fake map |
| 不用 config 改业务不变量 | lifecycle、role/capability、career/memory、outbox/handoff、projection、idempotency 和 query no-write 规则不可被配置覆盖 |
| 不保存 raw secret/body | config summary、error、audit、report、outbox、projection 和 evidence 只允许 ref / digest / safe marker |
| 不把 sibling runtime 依赖写成 Cargo dependency | 除 `core-contracts` 外,其他仓以 adapter/event/handoff/fake 协作 |
| 不让 fake/disabled 伪成功 | disabled/unavailable/failure 必须暴露为正式 safe issue 或 degraded/rejected surface |

### 1.9 Step 13 handoff 承接表

| Step 13 handoff topic | Step 14 承接方式 | 不可改变项 |
|---|---|---|
| idempotency retention / expiry | 定义 retention / cleanup 的配置绑定位置和 owner | key source、channel namespace、digest compare、stored replay required |
| in-flight timeout | 定义 timeout / delayed surface 的配置绑定点 | no second writer rule |
| digest algorithm binding | 定义 algorithm marker / canonicalizer owner 的配置位置 | body-free stable material set 和 raw body exclusion |
| retry schedule | 定义 outbox/handoff/job retry schedule 的配置引用 | retryable vs terminal classification |
| worker transport binding | 定义 ack/retry/dead-letter 到 worker adapter 的绑定 | worker ack 不等于 application accepted;receipt/stored result 仍由 application 产生 |
| publisher / handoff adapter config | 定义 topic/target、adapter mode、timeout、availability 的绑定 | Published 不等于 downstream consumed;Delivered 需要 attempt + receipt |
| runtime / adapter availability | 定义 disabled/degraded/unavailable adapter 的 config surface | runtime assembly 不产生业务 accepted/rejected |
| external resolver config | 定义 resolver mode、fixture、timeout、degraded policy 的绑定 | resolver 不保存 raw body;source version 不当 optimistic version |
| job scope scheduling | 定义 maintenance scope、trigger、batch、run input 的配置绑定点 | job duplicate replay 不能 relist/rescan/re-execute |
| local path dependencies | 定义 compile-time 与 runtime/event dependency 分类 | runtime/event/projection collaboration 不进入 Cargo dependency |

### 1.10 14.0 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否承接 Step 13 handoff | 通过 | §1.9 已逐项承接 |
| 是否限定 Step 14 范围 | 通过 | 只写配置引用和外部依赖绑定 |
| 是否新增 schema / port / state / error | 未新增 | 本批只写计划和红线 |
| 是否保持 1:1 真相源 | 通过 | 输入均回指 Step 3~13、`04-配置设计.md` 和 governance Step 14 粒度参考 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 14.1 | configuration boundary and code binding inventory |

---

## 2. 14.1 configuration boundary and code binding inventory

本批承接 14.0,只定义配置读取边界、配置类别到代码读取位置的 inventory、runtime builder 注入边界、entry-local / job-run-start 参数边界和禁止配置化项。本批不展开完整配置引用表,不定义配置文件格式、env var 名、secret provider、数值默认值或 loader API。

### 2.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 14.1 configuration boundary and code binding inventory |
| 当前结论 | `identity-infra` owns raw config;entry composition root 只消费 validated config snapshot;application/domain/contracts 不读 raw config |
| 本批边界 | 不新增 `IdentityRuntimeConfigShell` 字段、不新增 config loader trait、不新增 public DTO、不定义 env var / CLI flag |
| 关闭事项 | DDD-S14-OPEN-001 |
| 下一批 | 14.2 config reference table by section / module |

### 2.2 配置读取边界

| 模块 | 是否允许读取 raw config | 允许读取 / 持有 | 允许动作 | 禁止动作 |
|---|---|---|---|---|
| `identity-contracts` | 否 | public DTO 中的 typed ref / marker,不包含 runtime config | 定义配置相关 public boundary ref 时只能作为普通 ref 字段 | 读取 profile、store、adapter、secret、topic、fixture、runtime config |
| `identity-domain` | 否 | domain object / state / policy 输入中的 prepared summary 或 typed marker | 根据 application 传入的 policy summary / risk summary 执行纯判断 | 调用 config loader、根据 profile 改状态机、读取 adapter mode |
| `identity-application` | 否 | Step 7 port、facade、typed service parameter、prepared config-bound marker | 编排 use case、调用 port、使用已注入的 timeout/retry/batch marker 或 policy summary | 读取 raw config、解析 env、选择 concrete adapter、绕过 idempotency / UoW / facade |
| `identity-infra` | 是 | raw config source、validated config snapshot、`IdentityRuntimeConfigShell`、adapter catalog | load / parse / validate config,解析 ref,构造 runtime builder,实现 durable/fake/controlled/disabled adapters | 定义业务 invariant、伪造业务 success、保存 raw secret/body 到业务 store |
| `identity-api` | 受限 | validated runtime snapshot、entry-local selector、route binding、application facade | 装配 handler、构造 entry context、调用 dispatch catalog / facade | 直连 repository、publisher、handoff、projection、UoW 或 external adapter |
| `identity-worker` | 受限 | validated runtime snapshot、consumer binding、transport ack policy、application facade | 装配 consumer/callback entry、构造 context、调用 facade、执行 ack/retry/dead-letter 外围动作 | 把 ack 当 application receipt、直连 store/adapter、后台写业务 state |
| `identity-jobs` | 受限 | validated runtime snapshot、job-run-start config、job input、application facade | 装配 job runner、冻结 job config、构造 operation context、调用 facade | 直接扫描 store、rebuild projection、publish outbox、deliver handoff 或保存 job report |

“受限”表示 entry composition root 可以读取 validated config snapshot 或 entry-local 参数,但不得读取 secret raw value、外部 body、完整配置文件 body,也不得绕过 application facade。

### 2.3 配置类别到代码读取位置 inventory

| 配置类别 | 冻结时机 | 读取位置 | 注入 / 使用位置 | 不变量 |
|---|---|---|---|---|
| static design boundary | 不属于运行时配置 | design review / config validation redline | redline guard / validation report | 不得通过任何 source 覆盖 |
| startup runtime config | runtime 构造前 | `identity-infra::config` / runtime builder | repositories、UoW、publisher、resolver、handoff、clock/id、audit、facade assembly | 启动后 P0 不热更新 |
| job-run-start config | 每次 job run 开始 | `identity-jobs` entry + infra validated snapshot | application job facade input / typed service parameter | job report 必须可复核;duplicate replay 不 relist |
| entry-local parameters | 单次 entry | `identity-api` / `identity-worker` / `identity-jobs` entry | operation context factory、dispatch target catalog、page/run/scope marker | 不能覆盖 startup store / adapter / redline |
| policy-like technical knobs | startup 或 job-run-start | infra config + job runner | retry/retention/timeout/batch typed marker | 不得改变 domain policy、状态矩阵或 terminal 分类 |
| sensitive ref config | startup 或 job-run-start | infra config + secret ref resolver boundary | concrete adapter 内存边界 / redacted evidence | raw secret 不进入 application/domain/contracts/report |
| diagnostic / redaction config | startup | infra config / observability adapter | Step 15 log/metric/audit/report redaction | 不得扩大可输出内容 |
| test fixture / deterministic config | local-dev / ci-test startup | infra fake/controlled fixture loader | fake clock/id/resolver/publisher/handoff fixtures | 只能返回正式 port shape;不开放 private map |
| feature / peripheral enablement | startup | infra runtime builder | optional adapter / route / job registration | feature disabled 不得伪造业务 success |

### 2.4 Runtime builder 注入 inventory

| Builder 输入 | 正式来源 | Builder 输出 / 注入对象 | 下游可见面 | 禁止事项 |
|---|---|---|---|---|
| profile / config evidence | `IdentityRuntimeConfigShell` + `04-配置设计.md` profile | runtime assembly state、config evidence marker | entry readiness / observability | 保存 raw env、full config body、secret |
| store refs | `store.*` validated config | truth repos、projection repo、reference repo、outbox/result/idempotency repos、UoW manager | application port trait implementations | repository 隐式创建业务 truth 或 hidden transaction |
| adapter mode refs | `*.mode` / adapter catalog | fake / controlled / endpoint / disabled adapter impl | Step 7 resolver/publisher/handoff/availability ports | disabled/fake 返回 valid/published/delivered success |
| topic binding refs | `bus.topic_map_ref` / topic binding catalog | topic binding port、publisher adapter | outbox publish service | 改写 Step 8 event kind / payload schema |
| handoff target refs | handoff / audit / operations config | handoff target / delivery adapters | handoff prepare/deliver job service | 保存 bucket/path/raw target/receipt body |
| external source refs | role/governance/work/artifact/memory external config | source / reference resolver adapters | command precheck、consumer/job refresh | 返回 external raw body 或把 source version 当 optimistic version |
| clock/id fixture refs | fixture / runtime adapter config | `IdentityClockPort`,`IdentityIdGeneratorPort` | application services / entry factory | handler/domain/repository 临时拼 id 或读 system time |
| job runner config | operations / outbox / projection config + job input | job runner facade / typed job parameters | application job service | job runner 直连 store 或绕过 stored job report |
| redaction/audit config | `audit.*` / redline config | log/audit/report adapter + Step 15 evidence marker | observability only | redaction config 允许输出 forbidden body |

### 2.5 Entry-local 参数边界

| Entry | Entry-local 可携带 | 只能影响 | 不得影响 |
|---|---|---|---|
| API command | route ref、request marker、actor/metadata、idempotency key、trace context、profile selector if formally allowed | 当前 request validation、operation context、dispatch target | store/adapter selection、domain transition rule、idempotency requirement |
| API query | route ref、query marker、actor/metadata、page cursor、profile selector if formally allowed | 当前 query validation、operation context、page request | query no-write、visibility policy、projection rebuild |
| Worker consumer | envelope marker、consumer binding ref、transport delivery marker、idempotency key、trace context | current envelope dispatch、ack/retry/dead-letter after application result | application receipt semantics、consumer dedupe key source、reference state ownership |
| Handoff callback | callback envelope marker、target/handoff marker、idempotency key、trace context | current callback dispatch and transport ack | delivered receipt requirement、handoff state terminal guard |
| Operations job | job request marker、job run ref、job idempotency key、scope/cursor/run input refs、dry-run diagnostic selector if formally allowed | current job run context、scope expansion request、report output ref | duplicate replay rule、job no-truth-repair,repository scan fallback |

Entry-local 参数必须经 entry validation、operation context factory 和 dispatch target catalog 进入 application facade。Entry-local 参数不得成为 hidden config override。

### 2.6 禁止配置化项 inventory

| 禁止配置化项 | 绑定到的前序规则 | 违规处理 |
|---|---|---|
| identity 内实现登录 / token / session / credential 校验 | Step 3 no-auth boundary;`04` redline | config validation reject |
| RoleDefinition / CapabilityDefinition body 进入 identity | Step 3/6 ref-only;Step 7 resolver body-free | config validation reject / fixture reject |
| ProjectMember truth 进入 identity | Step 3 data ownership;Step 6 source marker | config validation reject |
| memory / archive body、Artifact body、external raw body 入库 | Step 6 body-free marker;Step 7 resolver/handoff rules | config validation reject / adapter reject |
| query 写 truth / projection rebuild / stored result | Step 7 query no-write;Step 9 query flow;Step 13 repeated read | implementation blocker |
| operations job 修复 core truth | Step 9 maintenance jobs;Step 13 job no-truth-repair | config validation reject / implementation blocker |
| outbox publish failure 回滚 accepted truth | Step 7 outbox;Step 10 state;Step 12 recovery | implementation blocker |
| handoff delivered 无 receipt marker | Step 6/7 handoff;Step 10 state | implementation blocker |
| idempotency key / digest / channel source 被替换 | Step 8 metadata;Step 13 key/digest matrix | implementation blocker |
| terminal outbox/handoff/idempotency/job state 被 retry config 重开 | Step 10 terminal matrix;Step 13 retry guard | config validation reject / implementation blocker |
| fake/controlled/disabled adapter 默认成功 | Step 7 fake parity;Step 12 disabled mapping | test / implementation blocker |
| non-core sibling repo 作为 Cargo dependency | Step 3 dependency pruning;Step 4 workspace | implementation gate reject |

### 2.7 14.1 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否关闭 DDD-S14-OPEN-001 | 通过 | §2.2~§2.6 已覆盖 infra/api/worker/jobs 配置读取边界和 code binding inventory |
| 是否保持 Step 14 范围 | 通过 | 未写完整 config reference table,未写 env var/CLI/schema |
| 是否新增 schema / port / state / error | 未新增 | 复用 Step 6 `IdentityRuntimeConfigShell`、Step 7 port/facade、`04` 配置语义 |
| 是否有新的 blocker | 无 | 当前材料足以进入 14.2 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 14.2 | config reference table by section / module |

---

## 3. 14.2 config reference table by section / module

本批把 `04-配置设计.md` §7 的十二个配置 section 映射到详细设计代码绑定点。表中的“默认口径来源”只回指 `04-配置设计.md`,不在 Step 14 重新定义具体默认值、最终 JSON schema、环境变量名或 secret provider。外部依赖逐项绑定留到 14.3。

### 3.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 14.2 config reference table by section / module |
| 当前结论 | `profile`、`store`、`actor_context`、`role_catalog`、`bus`、`outbox`、`projection`、`operations`、`external_refs`、`audit`、`redline`、`fixture` 均已映射到读取模块和注入点 |
| 本批边界 | 不定义完整 schema、env var、CLI flag、secret provider、deployment profile 或数值默认值 |
| 关闭事项 | DDD-S14-OPEN-002 |
| 下一批 | 14.3 external dependency binding table and adapter strategy |

### 3.2 Config reference table

| 配置项 / group | 类型口径 | 读取模块 | 注入 / 使用位置 | 默认口径来源 | 禁止改变的不变量 |
|---|---|---|---|---|---|
| `profile.name` | enum | `identity-infra::config`;entry composition root | `IdentityRuntimeConfigShell.profile_ref`;API/worker/jobs entry selector | `04-配置设计.md` §6/§7 | profile 不改变 domain invariant 或 store schema |
| `profile.adapter_mode_policy` | enum | `identity-infra::config` | runtime builder adapter mode validation | `04` §7 | adapter mode policy 不伪造 external success |
| `profile.allow_test_override` | bool | `identity-infra::config`;test harness | fake/controlled fixture enablement | `04` §5/§7/§9 | 只能 local-dev / ci-test;不得污染 integration-like |
| `store.mode` | enum | `identity-infra::config` | repository factory、UoW manager、stored result/idempotency store | `04` §7 | store mode 不改变 transaction order 或 truth ownership |
| `store.dsn_ref` | secret ref/null | `identity-infra::config`;secret ref resolver boundary | durable store adapter memory boundary | `04` §7/§8 | raw DSN / credential 不进入 application/domain/report |
| `store.migration.required_version` | string marker | `identity-infra::config` | migration gate / runtime assembly validation | `04` §7/§9 | migration mismatch fail-fast,不得自动迁移业务 truth |
| `store.transaction_mode` | enum | `identity-infra::config` | UnitOfWork manager construction | `04` §7 | 不允许 hidden transaction 或 per-repo implicit commit |
| `store.idempotency.enabled` | bool invariant | `identity-infra::config` | idempotency store validation | `04` §7/§9 | false fail-fast;不能关闭 command/event/job idempotency |
| `store.dead_letter.retention_days` | integer | `identity-infra::config`;worker runtime | inbound dead-letter store / worker retention policy | `04` §7 | retention 不替代 stored replay 或 receipt semantics |
| `actor_context.required` | bool invariant | `identity-infra::config`;entry validators | API/worker/job entry validation | `04` §7/§9 | 不能关闭 actor context requirement |
| `actor_context.require_trace_id` | bool | `identity-infra::config`;entry validators | operation context factory input validation | `04` §7 | trace id 不能替代 idempotency key / request digest |
| `actor_context.trusted_header_profile` | enum | `identity-api`;`identity-worker` entry assembly | actor metadata extraction policy | `04` §7 | 不实现 credential validation;只消费 trusted actor context |
| `actor_context.idempotency_key_required` | bool invariant | entry validators | command/event/callback/job metadata validation where applicable | `04` §7 | 不能放宽 Step 13 key source |
| `role_catalog.source_mode` | enum | `identity-infra::config` | role source resolver adapter mode | `04` §7 | source mode 不允许保存 RoleDefinition body |
| `role_catalog.snapshot_ref` | ref/null | `identity-infra::config`;resolver adapter | controlled/endpoint role snapshot source | `04` §7/§8 | snapshot ref 不等于 identity truth version |
| `role_catalog.fixture_ref` | ref | fake/controlled fixture loader | fake role catalog resolver fixture | `04` §7 | fixture 只能返回正式 safe summary / snapshot marker |
| `role_catalog.fingerprint_required` | bool | `identity-infra::config`;role sync service parameter | RoleCatalog sync / drift guard | `04` §7 | fingerprint 不可关闭 role source consistency guard |
| `role_catalog.unknown_role_strategy` | enum | `identity-infra::config`;application service typed parameter | Hire / role assignment precheck | `04` §7 | 不能把 unknown role 配成 accepted default |
| `role_catalog.reconcile.batch_size` | integer | `identity-jobs` job-run-start | role catalog reconciliation job parameter | `04` §7/§9 | batch 不改变 reconciliation no-truth-repair boundary |
| `bus.publisher_mode` | enum | `identity-infra::config` | outbox publisher adapter factory | `04` §7 | publisher mode 不改变 accepted truth / outbox material |
| `bus.endpoint_ref` | secret ref/null | `identity-infra::config`;publisher adapter | endpoint publisher memory boundary | `04` §7/§8 | raw endpoint credential 不进入 outbox/job report |
| `bus.topic_map_ref` | ref | `identity-infra::config`;topic binding adapter | `IdentityTopicBindingPort`;publisher route map | `04` §7/§9 | topic binding 不改 Step 8 event kind / payload |
| `bus.require_known_event_kind` | bool invariant | `identity-infra::config`;publisher adapter | topic completeness validation | `04` §7/§9 | unknown event kind 不得 silently publish |
| `outbox.store_name` | string marker | `identity-infra::config` | outbox repository adapter binding | `04` §7 | store name 不改变 outbox state matrix |
| `outbox.publish.batch_size` | integer | `identity-jobs` job-run-start | PublishOutboxEvents job parameter | `04` §7/§9 | batch 不允许 publisher relist duplicate replay |
| `outbox.publish.max_attempts` | integer | `identity-infra::config`;publish job | retry guard / attempt policy | `04` §7 | max attempts 不 reopen terminal state |
| `outbox.publish.backoff_policy_ref` | ref | `identity-infra::config`;publish job | retry schedule binding | `04` §7 | backoff 不决定 retryable vs terminal classification |
| `outbox.publish.failure_mode` | enum invariant | `identity-infra::config`;publish job | publish failure handling validation | `04` §7/§9 | 必须 mark-failed-no-rollback |
| `projection.store_name` | string marker | `identity-infra::config` | projection repository adapter binding | `04` §7 | projection store 不允许 query 写 truth |
| `projection.checkpoint_name` | string marker | `identity-infra::config`;jobs/query config | projection checkpoint binding | `04` §7 | checkpoint 不替代 truth cursor / projection source cursor |
| `projection.rebuild.batch_size` | integer | `identity-jobs` job-run-start | RebuildMemberSummaryProjection job parameter | `04` §7/§9 | rebuild 不修复 member/lifecycle/role/career/memory truth |
| `projection.query.not_ready_strategy` | enum | `identity-infra::config`;query facade parameter | query not-ready / degraded surface selection | `04` §7 | query not-ready 不触发 hidden rebuild |
| `operations.run_id_required` | bool invariant | `identity-jobs` entry validator | job request validation / report identity guard | `04` §7 | job run id 不替代 idempotency key |
| `operations.replay.report_root_ref` | ref | `identity-jobs` job-run-start | operations report writer / replay evidence output | `04` §7/§8 | report root ref 不保存 raw historical body |
| `operations.replay.input_root_ref` | ref | `identity-jobs` job-run-start | operations replay input selector | `04` §7/§8 | replay input ref 不 bypass stored replay semantics |
| `operations.dead_letter.replay_enabled` | bool | `identity-infra::config`;jobs entry | dead-letter replay job registration / guard | `04` §7 | disabled replay 不等于 succeeded job |
| `external_refs.artifact.mode` | enum | `identity-infra::config` | artifact resolver adapter mode | `04` §7 | artifact body 不进入 identity |
| `external_refs.artifact.endpoint_ref` | secret ref/null | `identity-infra::config`;artifact adapter | artifact endpoint memory boundary | `04` §7/§8 | raw artifact endpoint/body 不入 stored surface |
| `external_refs.memory_archive.mode` | enum | `identity-infra::config` | memory/archive resolver or handoff adapter mode | `04` §7 | memory body / archive package 不进入 identity |
| `external_refs.memory_archive.endpoint_ref` | secret ref/null | `identity-infra::config`;memory/archive adapter | endpoint memory boundary | `04` §7/§8 | raw memory/archive credential/body forbidden |
| `external_refs.governance.mode` | enum | `identity-infra::config` | governance basis resolver adapter mode | `04` §7 | governance basis missing cannot be default accepted |
| `external_refs.governance.endpoint_ref` | secret ref/null | `identity-infra::config`;governance adapter | endpoint memory boundary | `04` §7/§8 | governance policy/body not stored in identity |
| `external_refs.career_consumer.mode` | enum | `identity-infra::config`;worker assembly | career event consumer binding / disabled guard | `04` §7 | disabled consumer must not fake accepted receipt |
| `audit.sink_mode` | enum | `identity-infra::config` | audit/trace sink adapter mode | `04` §7 | audit sink mode 不关闭 accepted audit requirement |
| `audit.sink_ref` | secret ref/null | `identity-infra::config`;audit adapter | endpoint/captured audit sink memory boundary | `04` §7/§8 | raw sink credential not logged or reported |
| `audit.compensation_enabled` | bool invariant | `identity-infra::config` | audit compensation validation | `04` §7/§9 | false fail-fast;不能关闭 audit compensation |
| `audit.redaction_profile` | enum | `identity-infra::config`;Step 15 observability adapter | log/audit/report redaction | `04` §7/§8 | redaction 不扩大可输出 forbidden body |
| `redline.no_auth_in_identity` | bool invariant | `identity-infra::config` | startup redline validation | `04` §7/§9 | 必须 true;identity 不实现 auth |
| `redline.ref_only_guard` | bool invariant | `identity-infra::config` | ref-only body guard validation | `04` §7/§9 | 必须 true;external bodies forbidden |
| `redline.projection_no_write_guard` | bool invariant | `identity-infra::config` | projection/query guard validation | `04` §7/§9 | 必须 true;query/projection 不写真相 |
| `redline.outbox_no_event_creation_guard` | bool invariant | `identity-infra::config` | outbox publisher guard validation | `04` §7/§9 | 必须 true;publisher 不创造业务事件 |
| `fixture.clock_mode` | enum | fake/test runtime config | `IdentityClockPort` fake adapter | `04` §7 | fixed clock 不可替代 cursor/version/idempotency key |
| `fixture.id_sequence_mode` | enum | fake/test runtime config | `IdentityIdGeneratorPort` fake adapter | `04` §7 | deterministic ids 仍必须经 IdGeneratorPort |
| `fixture.seed_ref` | ref/null | fixture loader | fake resolver/store/publisher/handoff seed | `04` §7/§8 | seed 不得包含 raw secret/body or private fake map |

### 3.3 Section-level binding summary

| Config section | 主读取模块 | 主注入点 | 主要 Step 7/9 使用点 | 失败策略来源 |
|---|---|---|---|---|
| `profile.*` | `identity-infra::config` + entry composition | runtime assembly,entry readiness | Step 7 runtime wiring;Step 9 entry dispatch | `04` §9/§11 |
| `store.*` | `identity-infra::config` | repositories,UoW,idempotency/stored result | Step 7 repositories;Step 11 persistence;Step 13 replay | `04` §9/§11 |
| `actor_context.*` | entry validators | operation context factory | Step 7 operation context;Step 8 metadata;Step 13 key/digest | `04` §9/§11 |
| `role_catalog.*` | infra config + role resolver/job | role source resolver,reconcile job | Step 7 source resolver;Step 9 role command/consumer/job | `04` §9/§11 |
| `bus.*` | infra config + publisher | topic binding,publisher adapter | Step 7 publisher/topic port;Step 9 outbox publish | `04` §9/§11 |
| `outbox.*` | infra config + jobs | outbox store,publish job retry/batch | Step 7 outbox repo;Step 9 publish/retry;Step 13 reentry | `04` §9/§11 |
| `projection.*` | infra config + query/jobs | projection repo,query not-ready,rebuild job | Step 7 projection repo;Step 9 query/rebuild | `04` §9/§11 |
| `operations.*` | jobs entry | job validation,report/replay roots,dead-letter replay | Step 7 job report;Step 9 operations jobs;Step 13 job replay | `04` §9/§11 |
| `external_refs.*` | infra config | external source/reference resolvers,consumer bindings | Step 7 external ports;Step 9 command/consumer/refresh | `04` §9/§11 |
| `audit.*` | infra config | audit/trace sink,redaction,compensation | Step 7 audit repo/handoff;Step 15 observability | `04` §9/§11 |
| `redline.*` | infra config | startup validation / implementation gate | Step 3/6/7/9/13 redlines | `04` §9/§11 |
| `fixture.*` | fake/test runtime config | fake clock/id/resolver/publisher/handoff fixtures | Step 7 fake parity;Step 16 tests | `04` §9/§11 |

### 3.4 Config reference invariants

| Invariant | Applies to | Source |
|---|---|---|
| profile is not adapter mode | `profile.*`, all `*.mode` | `04-配置设计.md` §6/§13 |
| startup config is frozen in P0 | profile/store/adapter/topic/audit/redline/fixture | `04` §4/§9 |
| job-run-start config is frozen per run | outbox/projection/operations/role reconcile knobs | `04` §4/§9;Step 13 job replay |
| entry-local cannot override startup runtime binding | profile selector, job input, page cursor | `04` §5;14.1 entry-local boundary |
| sensitive config is ref-only | `*_ref`, DSN/endpoint/sink/report/input refs | `04` §8 |
| redline guards must be true | `redline.*`, invariant booleans | `04` §7/§9/§11 |
| config cannot alter stored replay | store/idempotency/outbox/job knobs | Step 13 |
| config cannot turn query into write path | projection query/rebuild knobs | Step 7/9/13 |
| config cannot allow raw external bodies | role/artifact/memory/governance/audit/fixture | Step 3/6/7;`04` §8 |

### 3.5 14.2 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否关闭 DDD-S14-OPEN-002 | 通过 | §3.2 逐项覆盖 `04` §7 配置项,§3.3 按 section 汇总 |
| 是否保持 Step 14 范围 | 通过 | 未定义最终 schema、env var、secret provider、具体数值或部署命令 |
| 是否新增 schema / port / state / error | 未新增 | 只做配置项到代码绑定点映射 |
| 是否有新的 blocker | 无 | 当前材料足以进入 14.3 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 14.3 | external dependency binding table and adapter strategy |

---

## 4. 14.3 external dependency binding table and adapter strategy

本批承接 Step 7 external resolver / publisher / handoff / adapter ports、Step 9 operations job flow 和 Step 12 recovery mapping,定义 L1-identity 的外部依赖如何绑定到正式 adapter surface。外部依赖在本批只表达绑定位置、使用接口、超时 / 重试配置来源和降级策略;不写跨仓 Cargo dependency 表,不定义 endpoint、topic、bucket、secret provider、transport route 或 adapter implementation。

### 4.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 14.3 external dependency binding table and adapter strategy |
| 当前结论 | 外部依赖均可通过 Step 7 repository/resolver/publisher/handoff/availability/fake surface 绑定;无新增 port / DTO / error 需求 |
| 本批边界 | 不定义 endpoint、transport topic、secret provider、raw health check body、adapter code 或跨仓 Cargo dependency |
| 关闭事项 | DDD-S14-OPEN-003 |
| 下一批 | 14.4 cross-repo dependency binding / runtime builder order / validation boundaries |

### 4.2 External dependency binding table

| 依赖 | 绑定位置 | 使用接口 | 超时 / 重试来源 | 降级 / 失败策略 | 禁止事项 |
|---|---|---|---|---|---|
| local / durable truth store | `identity-infra` repository adapters | Step 7 core truth repositories + `IdentityUnitOfWorkManager` | `store.*`;store timeout 留 `04` / implementation config | unavailable -> no write / dependency unavailable;commit unknown 走 Step 13 stored surface check | hidden commit、query auto-create、source version 当 optimistic version |
| idempotency / stored result store | `identity-infra` result/idempotency adapters | `IdentityIdempotencyRepository`,`IdentityStoredResultRepository`,`IdentityJobReportRepository` | `store.idempotency.*`;retention 由 14.2 / Step 13 绑定 | unavailable before mutation -> no accepted write;stored missing/wrong-kind -> replay consistency defect | duplicate replay 重跑 command/event/job |
| projection store | `identity-infra` projection adapter | `IdentityProjectionRepository` | `projection.*`;rebuild batch from job-run-start | query missing/stale -> missing/degraded/not-ready;rebuild job handles maintenance | query rebuild、拼 view ref、projection 写 core truth |
| reference state / sidecar store | `identity-infra` reference adapter | `IdentityReferenceStateRepository`,`IdentityExternalReferenceResolverPort` | `external_refs.*`;refresh schedule / batch 留 job config | unavailable/stale -> degraded or failed reference item;same-bundle version rule holds | business source ref 当 bundle key;external source version 当 expected_version |
| reconciliation / report store | `identity-infra` report adapters | `IdentityReconciliationReportRepository`,`IdentityJobReportRepository` | `operations.*`;report root ref from job-run-start | report failure -> job failed/partial safe issue;query never regenerates report | raw diagnostic/remediation body 入 report |
| L0-bus / outbound event transport | `identity-infra` publisher adapter | `IdentityTopicBindingPort`,`IdentityOutboxPublisherPort` | `bus.*`,`outbox.publish.*`;retry schedule from config,classification from Step 7/12 | retryable -> outbox `RetryableFailed`;permanent/unsupported/skipped -> terminal marker/report;truth unchanged | Published 当 downstream consumed;fallback topic;raw broker payload/secret in store |
| role catalog / method-library source | `identity-infra` source resolver adapter | `IdentityExternalSourceResolverPort.resolve_role_capability_source`,`resolve_capability_evidence` | `role_catalog.*`;resolver timeout from config | invalid/stale/unavailable -> rejected/delayed/degraded per Step 12 | RoleDefinition / CapabilityDefinition / artifact body 入 identity |
| governance basis source | `identity-infra` governance resolver adapter | `IdentityExternalSourceResolverPort.resolve_governance_basis` | `external_refs.governance.*`;high-risk fail-closed | unavailable/stale/invalid/not found -> high-risk action not accepted | basis ref presence == valid;保存 governance policy body |
| work / career source | `identity-infra` work resolver or consumer adapter | `resolve_work_participation`;worker consumer facade | `external_refs.career_consumer.mode`;worker ack binding from config | unavailable/untrusted -> delayed/quarantined/pending branch per Step 12 | identity 拥有 ProjectMember truth;consumer ack 当 receipt |
| artifact / evidence source | `identity-infra` artifact resolver adapter | `resolve_capability_evidence`;reference refresh sidecar | `external_refs.artifact.*` | unavailable -> fail-closed / delayed / degraded according to flow | Artifact body、evidence body、raw file content 入库 |
| memory / archive source | `identity-infra` memory/archive resolver and handoff adapters | `resolve_memory_reference_source`,`resolve_archive_handoff_source`,`IdentityHandoffDeliveryPort` | `external_refs.memory_archive.*`;handoff retry from config | unavailable -> pending/degraded/failed ref;delivery retryable/permanent uses Step 7 outcome | memory text、embedding、archive package、receipt body 入库 |
| trace / archive handoff target | `identity-infra` handoff target/delivery adapters | `IdentityHandoffTargetPort`,`IdentityHandoffDeliveryPort` | handoff target refs and retry schedule from config | delivered requires attempt+receipt;retryable/permanent/cancelled/unsupported map to handoff state/report | bucket/path/raw endpoint/receipt body;HTTP 2xx == delivered |
| audit / trace sink | `identity-infra` audit adapter / repository | audit repository + Step 15 observability sink | `audit.*`;compensation invariant from config | sink unavailable -> compensation/local marker/degraded evidence | turning off accepted audit;raw log/debug body |
| adapter availability registry | `identity-infra` runtime builder / adapter registry | `IdentityAdapterAvailabilityPort` | `profile.*`,`*.mode`;health timeout from config | disabled/unavailable/degraded visible before attempt | endpoint URL as adapter identity;disabled/fake success |
| system clock | `identity-infra` clock adapter | `IdentityClockPort` | `fixture.clock_mode`;runtime clock config | unavailable before required timestamp -> dependency unavailable | domain/system time direct read;timestamp as cursor/version |
| id generator | `identity-infra` id generator adapter | `IdentityIdGeneratorPort` | `fixture.id_sequence_mode`;runtime id config | unavailable before id generation -> dependency unavailable | handler/repository/fake 拼 id/ref |
| secret ref facility boundary | `identity-infra` config/adapter memory boundary | infra-internal ref resolution only;no application port | sensitive `*_ref`;P0 hot rotation not enabled | missing secret ref -> fail-fast or reject run per `04` | adding secret resolver port in application;raw secret in config evidence/log/report |
| fake / controlled fixture source | `identity-infra` fake runtime / fixture loader | same Step 7 formal ports as durable adapters | `fixture.*`;profile compatibility from `04` | controlled outcome returns formal valid/stale/unavailable/retryable/permanent surface | private fake map、default valid、default Published/Delivered |
| operations replay input/output refs | `identity-jobs` entry + infra report boundary | job request/report DTO,existing report repositories | `operations.replay.*`;job-run-start frozen | invalid refs -> reject run with safe failure report | replay input ref bypasses idempotency/stored replay;raw historical body in report |

### 4.3 Adapter mode strategy

| Adapter mode | 来源 | 允许用途 | 必须返回 | 禁止事项 |
|---|---|---|---|---|
| `fake` | `profile.*` + section `*.mode` / fixture config | local-dev / ci-test deterministic execution | formal Step 7 port result,configured fixture outcome,deterministic clock/id | default valid,default Published/Delivered,private map,service bypass |
| `controlled` | integration-like / failure injection config | controlled seam、degraded / unavailable / invalid / retryable / permanent scenarios | formal Step 7 outcome with safe issue refs | panic/raw error string as business classification |
| `endpoint` | integration-like or future P1 endpoint config | real-like external dependency through adapter | body-free safe summary/outcome/receipt/issue marker | raw endpoint/secret/body leaking past infra adapter |
| `disabled` | explicit disabled config for P1/P2 dependency or route | unavailable surface,entry/job guard,feature disabled proof | `Disabled` / unavailable issue or rejected/degraded surface | fake success、silent no-op success、accepted receipt without application result |

Adapter mode is a runtime assembly concern. Application service may see adapter availability and formal port outcomes, but it must not inspect raw adapter config or infer business result from mode name.

### 4.4 Failure / degradation binding table

| Failure family | Formal source | Config binding | Required surface | Forbidden fallback |
|---|---|---|---|---|
| startup config invalid | config validator | `profile/store/bus/audit/redline/fixture` | fail-fast / runtime assembly failed with safe issue | start with partial fake success |
| job-run-start config invalid | jobs entry validator | operations/outbox/projection/reconcile job input | reject run / safe failed report | silently use previous run config |
| entry-local metadata missing | API/worker/jobs entry validator | actor_context / route / binding / job metadata | reject current entry | create stored result before facade |
| resolver invalid/stale/unavailable/not found | external resolver port | external_refs / role_catalog adapter config | rejected/delayed/degraded/quarantined according to Step 12 | treat opaque ref as valid |
| reference refresh resolver unavailable | external reference resolver port | external_refs refresh config | failed reference item / retryable issue / degraded surface | infer invalid from raw error string |
| topic binding missing/unsupported | topic binding port | `bus.topic_map_ref` | block publisher / unsupported topic issue | fallback topic construction |
| publisher retryable failed | publisher outcome | `outbox.publish.*` | outbox `RetryableFailed` + job issue | rollback accepted truth |
| publisher permanent/skipped/unsupported | publisher outcome | `outbox.publish.*` | outbox failed/skipped/unsupported terminal marker + report issue | retry terminal marker by schedule |
| handoff target unavailable/unsupported | handoff target port | handoff target config | retryable / cancelled / unsupported safe issue | fallback target/path construction |
| handoff delivery retryable/permanent | handoff delivery outcome | handoff retry config | `RetryableFailed` or `Failed` with attempt/issue | Delivered without receipt marker |
| audit sink unavailable | audit adapter / repository | `audit.*` | compensation/local marker/degraded evidence | disable accepted audit |
| fake/controlled fixture missing | fixture loader | `fixture.*` | fail-fast local/CI or disabled/unavailable safe issue | private map default success |

### 4.5 External dependency redlines

| Redline | Applies to | Stop condition |
|---|---|---|
| no raw external body | resolver,artifact,memory/archive,governance,work,role source,handoff,audit | adapter attempts to return/store body beyond safe summary/marker |
| no adapter raw error taxonomy | controlled/endpoint adapters | service classifies retry/permanent from string/HTTP code without formal outcome |
| no downstream consumed claim | bus publisher | code treats `Published` as downstream consumed |
| no delivered without receipt | handoff delivery/callback | code marks `Delivered` without `HandoffReceiptRef` and `HandoffAttemptRef` |
| no fake shortcut | fake/controlled adapters | fake exposes private map or default valid/success |
| no entry adapter bypass | API/worker/jobs | entry directly calls resolver/publisher/handoff adapter |
| no cross-repo compile leak | all runtime dependencies | implementation adds non-core sibling Cargo dependency |
| no config-based invariant weakening | all dependencies | config flag changes state matrix,query no-write,job no-repair,stored replay or body-free rule |

### 4.6 14.3 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否关闭 DDD-S14-OPEN-003 | 通过 | §4.2~§4.5 覆盖 resolver、publisher、handoff、audit、store、clock/id、fake/controlled/disabled |
| 是否保持 Step 14 范围 | 通过 | 未定义 endpoint、transport topic、secret provider、adapter code 或 Cargo dependency |
| 是否新增 schema / port / state / error | 未新增 | 复用 Step 7 ports、Step 9 flows、Step 12 recovery surface 和 `04` 配置语义 |
| 是否有新的 blocker | 无 | 当前材料足以进入 14.4 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 14.4 | cross-repo dependency binding / runtime builder order / validation boundaries |

---

## 5. 14.4 cross-repo dependency binding / runtime builder order / validation boundaries

本批把 Step 3/4/5 的编译期依赖裁剪规则、Step 7/14.3 的 adapter surface 和 `04-配置设计.md` 的加载校验语义收束成三类产物:跨仓依赖绑定表、runtime builder 装配顺序和配置校验边界。本文不定义 implementation code、Cargo.toml 实际内容、endpoint、secret provider、transport route 或 observability metric。

### 5.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 14.4 cross-repo dependency binding / runtime builder order / validation boundaries |
| 当前结论 | 只有 `core-contracts` 可以作为当前编译期 path dependency;其他 sibling repo 均通过 runtime adapter / event / handoff / fixture / fake 协作 |
| 本批边界 | 不修改 Cargo 文件,不写 endpoint / topic / secret provider,不进入 Step 15 observability |
| 关闭事项 | DDD-S14-OPEN-004 |
| 下一批 | 14.5 cross-step closure / Step 15 handoff |

### 5.2 Cross-repo dependency binding table

| 依赖仓库 | 全局依赖类型 | 本地路径 | Cargo 引用方式 / 协作方式 | 使用位置 | 不可用时处理 |
|---|---|---|---|---|---|
| `quantalithos-core` | compile-time shared contracts | `/home/aris/Projects/quantalithos-core` | workspace root may use `core-contracts = { path = "../quantalithos-core/crates/contracts" }`;member crate uses workspace dependency only when needed | contracts/domain/application/infra/api/worker/jobs shared actor、metadata、page、error、CloudEvent envelope | compile-time dependency missing -> pause implementation and close upstream contract gap |
| `quantalithos-bus` | runtime / event transport | `/home/aris/Projects/quantalithos-bus` | no Cargo dependency;use `IdentityTopicBindingPort` + `IdentityOutboxPublisherPort` + fake/controlled/endpoint adapter | outbox publish job,worker delivery boundary | bus unavailable -> outbox retryable/failed marker;accepted truth unchanged |
| `quantalithos-method-library` | runtime source / event collaboration | `/home/aris/Projects/quantalithos-method-library` | no Cargo dependency;use role/capability source resolver,source snapshot refs,consumer event markers,fixture | role catalog sync,role/capability commands,source consumer | source unavailable/stale/invalid -> rejected/delayed/degraded per Step 12;no RoleDefinition body |
| `quantalithos-work` | runtime source / event collaboration | `/home/aris/Projects/quantalithos-work` | no Cargo dependency;use work participation resolver,career event consumer,source marker / fixture | career append/consumer,work participation safe summary | unavailable/untrusted -> delayed/quarantined/pending;no ProjectMember truth |
| `quantalithos-governance` | runtime basis / event collaboration | `/home/aris/Projects/quantalithos-governance` | no Cargo dependency;use governance basis resolver,GovernanceBasisRef marker,fixture | high-risk lifecycle precheck | unavailable/invalid/not found -> fail-closed / rejected;no governance policy body |
| memory / archive repo family | runtime source / handoff target | project-specific sibling paths | no Cargo dependency;use memory/archive resolver,handoff target/delivery port,callback envelope,fixture | memory reference relation,archive handoff,callback processing | unavailable -> pending/degraded/failed marker;no memory body/archive package |
| artifact / evidence repo family | runtime source | project-specific sibling paths | no Cargo dependency;use artifact/evidence resolver,ExternalReferenceRef bundle,fixture | capability evidence / reference sidecar | unavailable -> fail-closed/delayed/degraded;no artifact/evidence body |
| observability / audit sink repo family | runtime sink | project-specific sibling paths | no Cargo dependency;use audit adapter / local repository / Step 15 observability binding | audit sink,trace export,release evidence | sink unavailable -> compensation/local marker;accepted audit not disabled |
| runtime / operations platform | runtime scheduler / entry host | project-specific sibling paths | no Cargo dependency;jobs/worker entry consumes validated config and application facade | job trigger,worker loop,entry assembly | platform unavailable before dispatch -> entry/runtime unavailable surface;no stored business result |
| SDK / downstream consumers | downstream integration | project-specific sibling paths | no Cargo dependency;public contracts/event payloads are published through outbox/API | external consumers of identity events/query | downstream unavailable cannot roll back identity accepted truth |

Any new compile-time dependency on a sibling repo other than `core-contracts` is a design blocker. It must be justified by Step 3/4/5 and re-opened before implementation.

### 5.3 Runtime builder assembly order

| Order | Builder stage | Inputs | Outputs | Validation boundary |
|---:|---|---|---|---|
| 1 | load raw config sources | code defaults,config file,environment variables,entry selector/job input where applicable | raw config overlay + redacted source summary | raw secret/body rejected before evidence |
| 2 | parse / type / range validate | raw config overlay | typed validated config candidate | malformed / range failure -> config issue;no adapter construction |
| 3 | cross-field validate | typed candidate + profile rules | compatible config candidate | profile/test override,redline,topic,store,adapter compatibility checked |
| 4 | resolve sensitive refs at infra boundary | `*_ref` fields | adapter memory material + redacted digest/evidence | raw secret does not enter `IdentityRuntimeConfigShell` or application |
| 5 | create `IdentityRuntimeConfigShell` | profile,evidence,binding refs,adapter mode refs,issue refs | validated/degraded/invalid config shell | invalid shell cannot enter assembly |
| 6 | construct store/UoW adapters | store refs,migration validation | repository implementations,UoW manager | store unavailable -> failed/degraded assembly;no business write |
| 7 | construct base technical adapters | clock/id config,fixture mode | `IdentityClockPort`,`IdentityIdGeneratorPort` | fake/deterministic only through configured fixture |
| 8 | construct external adapters | role/governance/work/artifact/memory/bus/handoff/audit configs | resolver,publisher,handoff,audit availability surfaces | disabled/unavailable visible;no fake success |
| 9 | build adapter availability registry | adapter refs/modes/health summaries | `IdentityAdapterAvailabilityPort` data | availability body-free;endpoint URL not identity |
| 10 | assemble application facade | application services + port implementations | `IdentityApplicationFacade` | facade only sees Step 7 port traits / typed parameters |
| 11 | assemble entry modules | API routes,worker bindings,job runners,dispatch target catalog | entry dispatch surfaces | entry cannot see repositories/adapters/UoW directly |
| 12 | publish runtime assembly state | assembly ref,profile,adapter refs,state kind,issues | `IdentityRuntimeAssemblyState` | `Assembled` means wiring ready,not business accepted or adapter delivered |

The builder order is logical,not a Rust function signature. Implementation may split stages into modules, but must preserve the dependency direction and validation gates.

### 5.4 Validation boundary matrix

| Validation item | Owner | Must validate | Must not validate / decide |
|---|---|---|---|
| config parse/type/range | `identity-infra::config` | syntax,type,range,known section/key | domain transition legality |
| profile compatibility | `identity-infra::config` | profile allowlist,adapter mode policy,test override compatibility | business accepted/rejected result |
| redline guards | `identity-infra::config` + implementation gate | no-auth,ref-only,projection no-write,outbox no-event-creation | runtime exception to bypass redline |
| secret/sensitive refs | `identity-infra` secret boundary | ref presence,redacted digest,adapter memory availability | application-visible secret value |
| store / migration | infra runtime builder | mode,dsn ref,migration required version,transaction mode | hidden schema repair or automatic truth migration |
| topic completeness | infra topic binding validator | enabled event topic keys all mapped | event kind / payload schema change |
| adapter availability | infra adapter registry | configured mode,disabled/unavailable/degraded/available marker | operation accepted or downstream consumed |
| entry readiness | API/worker/jobs composition root | runtime assembled,target route/binding/job enabled | command accepted/query visible/receipt/job report |
| job-run-start config | jobs entry | run id,batch,scope,input/output refs | duplicate replay relist/rescan |
| fixture compatibility | fake runtime / fixture loader | fixture allowed profile,body-free seed,deterministic clock/id config | private fake map or default success |

### 5.5 Cross-repo / builder redlines

| Redline | Stop condition | Correct closure |
|---|---|---|
| non-core sibling as Cargo dependency | `identity-*` crate imports bus/method/work/governance/memory/archive/artifact implementation | move to Step 7 port + infra adapter or reopen Step 3 dependency decision |
| entry receives adapter implementation | API/worker/jobs has repository/publisher/resolver/handoff adapter field | entry receives application facade and dispatch catalog only |
| config validation creates business result | runtime not assembled creates stored rejected command/result/job report | return entry/runtime surface;no application store writes |
| builder silently substitutes fake adapter | missing endpoint/secret/binding becomes fake success outside local/CI | fail-fast/degraded/disabled safe surface |
| runtime assembly claims health | `Assembled` used as resolver valid/publisher delivered/handoff completed | require adapter availability/outcome and formal receipt/attempt markers |
| topic/target string leaks to domain/application | domain/application sees broker topic,bucket,path,endpoint | keep raw route in infra;application sees refs/markers only |
| fixture seed includes raw body/secret | fixture contains RoleDefinition body,memory text,artifact body,secret | fixture reject;replace with safe summary/ref marker |

### 5.6 14.4 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否关闭 DDD-S14-OPEN-004 | 通过 | §5.2 明确 compile/runtime/event/handoff/fake 分类 |
| runtime builder 顺序是否可实现 | 通过 | §5.3 写出 logical assembly order and validation gates |
| config validation boundary 是否清楚 | 通过 | §5.4 区分 config validation、runtime readiness 和 business result |
| 是否新增 schema / port / state / error | 未新增 | 复用 Step 6 runtime objects、Step 7 ports、Step 14 config refs |
| 是否有新的 blocker | 无 | 当前材料足以进入 14.5 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 14.5 | cross-step closure / Step 15 handoff |

---

## 6. 14.5 cross-step closure / Step 15 handoff

本批只做 Step 14 的跨步闭环审计、open item closure、Step 15 handoff 和回填草稿完善。本批不定义日志字段全集、metric 名称、alert 阈值、运维流程、测试 ID 或 implementation commit boundary。

### 6.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 14.5 cross-step closure / Step 15 handoff |
| 当前结论 | Step 14 已完成,可以进入 Step 15 observability / audit |
| 本批边界 | 不新增 object、port、state、error、DTO、config schema、log/metric/audit schema |
| 关闭事项 | DDD-S14-OPEN-005 |
| 下一步 | Step 15 |

### 6.2 Cross-step closure audit

| Closure item | Formal source | Step 14 result | Status |
|---|---|---|---|
| config ownership boundary | Step 4 file layout;Step 5 module contracts;Step 6 runtime config shell | 14.1 固定 infra owns raw config,application/domain/contracts config-free | closed |
| config reference table | `04-配置设计.md` §7/§9;Step 7/9 use points | 14.2 逐项绑定 12 个 config section 到读取模块和注入点 | closed |
| external dependency binding | Step 7 external ports;Step 9 operations/outbox/handoff flows;Step 12 recovery | 14.3 固定 resolver/publisher/handoff/audit/store/clock/id/fake/disabled strategy | closed |
| cross-repo dependency classification | Step 3 dependency pruning;Step 4 workspace;Step 5 dependency direction | 14.4 固定 only `core-contracts` compile-time;others runtime/event/handoff/fake | closed |
| runtime builder order | Step 6 runtime state;Step 7 runtime wiring;`04` loading validation | 14.4 给出 logical assembly order and validation gates | closed |
| validation boundary | Step 10 runtime/adapter states;Step 12 entry/recovery mapping | 14.4 区分 config validation、runtime readiness、adapter availability、business result | closed |
| Step 13 handoff | Step 13 §6.4 retention/retry/worker/adapter/job handoff | 14.1~14.4 已承接 retention、retry、digest marker、worker transport、adapter availability、job scheduling | closed |
| raw body / secret exclusion | Step 3 no external body;Step 6 body-free objects;`04` sensitive config | 14.1~14.4 明确 secret/body 不进入 application/domain/contracts/report/log/evidence | closed |
| fake/durable parity | Step 7 fake parity;Step 12 recovery parity;Step 13 duplicate no-rerun | 14.3/14.4 固定 fake/controlled/disabled uses formal port shape,no private map/default success | closed |

### 6.3 Remaining open item closure

| Open item | Closure |
|---|---|
| DDD-S14-OPEN-001 configuration boundary inventory | Closed in 14.1. Infra reads raw config;entry reads validated snapshot;application/domain/contracts do not read raw config. |
| DDD-S14-OPEN-002 config reference table | Closed in 14.2. All `04` §7 config items are mapped to reading module,injection point,default source and invariant. |
| DDD-S14-OPEN-003 external dependency binding | Closed in 14.3. Store,resolver,publisher,handoff,audit,clock/id,fake/controlled/disabled are bound to formal Step 7/12 surfaces. |
| DDD-S14-OPEN-004 cross-repo dependency / runtime builder | Closed in 14.4. `core-contracts` is the only compile-time sibling;runtime builder order and validation boundaries are defined. |
| DDD-S14-OPEN-005 Step 14 closure / Step 15 handoff | Closed in 14.5. Handoff below lists observability/audit inputs and forbidden material. |

### 6.4 Step 15 observability / audit handoff

| Observability topic | Step 15 should instrument | Safe fields / refs | Must not record |
|---|---|---|---|
| config load / validate | config parse/type/range/cross-field result,profile,validation state | config evidence ref,profile ref,config issue refs,source kind,redacted digest | raw config body,env raw value,secret,endpoint credential |
| runtime assembly | assembly state transitions and readiness failure | runtime assembly ref,profile ref,adapter refs,assembly state kind,issue refs | adapter raw health body,endpoint URL as label,secret |
| adapter availability | disabled/degraded/unavailable/available checks | adapter ref,adapter mode ref,availability kind,issue ref | raw health response,credential,external body |
| entry dispatch guard | pre-dispatch failure,unknown route/binding/job,target disabled | entry ref,route/binding/job marker,dispatch target ref,issue ref | raw request/event/job body,secret,page payload |
| external resolver calls | resolver outcome by family and failure class | adapter ref,source/basis/reference ref,safe summary ref,state kind,issue ref | RoleDefinition body,ProjectMember truth,memory text,artifact body,governance policy body |
| outbox publish | publish attempt outcome and retryable/terminal classification | outbox record ref,topic key ref,attempt ref,outcome kind,issue ref | broker topic raw string,payload body,adapter response body |
| handoff delivery | target resolution,delivery attempt,receipt/failure outcome | handoff intent ref,target ref,scope ref,attempt ref,receipt ref,issue ref | bucket/path/raw endpoint,archive package,receipt body |
| audit compensation | audit sink unavailable and local compensation marker | audit subject ref,audit trail ref,config issue ref,compensation marker | raw log/debug body,secret,external response body |
| job-run-start config | job config frozen/rejected,run input/output refs | job run ref,job kind,scope marker,batch marker,input/output refs,issue ref | raw replay input,historical body,secret path material |
| fake/controlled fixture | profile-compatible fixture load and controlled outcome | profile ref,fixture ref digest,adapter mode ref,controlled outcome kind | fixture raw body/private fake map |
| cross-repo dependency guard | implementation/config attempts to use disallowed compile dependency | dependency name,crate family,issue ref | local filesystem secret,source code body |

Step 15 can define logs、metrics and audit events over safe refs、state kinds、issue refs、outcome kinds and redacted digests. It cannot introduce new replay material,raw diagnostic payloads,secret values or external body snapshots.

### 6.5 Step 16 test cut handoff

| Test cut family | Contract to verify |
|---|---|
| config ownership | application/domain/contracts cannot read raw config or secret material |
| config redline validation | no-auth/ref-only/projection-no-write/outbox-no-event guards cannot be disabled |
| profile / adapter compatibility | local/CI allow fixture;integration-like rejects test override |
| topic completeness | enabled event kinds require topic binding before publisher starts |
| disabled adapter | disabled returns formal unavailable/disabled surface,no fake success |
| external resolver body-free | resolver/fake fixtures cannot return or store external body |
| outbox publish failure | publisher failure marks outbox/report only,no truth rollback |
| handoff delivered guard | delivered requires attempt + receipt refs;no raw receipt body |
| runtime builder boundary | invalid config cannot assemble runtime;assembled does not mean adapter healthy |
| non-core Cargo dependency | implementation gate rejects bus/method/work/governance/memory/archive/artifact compile dependency |

Step 16 should assign concrete test IDs later. Step 14 intentionally does not define test IDs or automation scripts.

### 6.6 Implementation redlines carried forward

| Redline | Stop condition |
|---|---|
| no raw config / secret leakage | raw config/env/secret/endpoint credential appears outside infra adapter memory boundary |
| no application config read | application service reads config loader/env directly |
| no domain config read | domain policy/state uses profile/adapter mode directly |
| no entry adapter bypass | API/worker/jobs entry directly calls repository/resolver/publisher/handoff/UoW |
| no fake default success | fake/controlled/disabled returns valid/published/delivered/completed without formal configured outcome |
| no config invariant bypass | config changes state matrix,query no-write,job no-repair,stored replay,terminal retry guard or body-free boundary |
| no non-core Cargo dependency | identity crate imports sibling implementation other than `core-contracts` |
| no runtime health conflation | runtime `Assembled` is treated as resolver valid,publisher delivered,handoff delivered or business accepted |

### 6.7 14.5 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否完成 Step 14 全部批次 | 通过 | 14.0~14.5 均已写入 |
| 是否关闭 Step 13 handoff | 通过 | retention、retry、worker transport、adapter availability、job scheduling、local dependency 分类均已承接 |
| 是否保持 1:1 真相源 | 通过 | 未新增 schema、port、state、error、DTO 或 config loader API |
| 是否有 unresolved blocker | 无 | 当前材料足以进入 Step 15 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | Step 15 | observability / audit |

---

## 7. 回填草稿

正式 `03-详细设计.md` 第 13 章后续可按下列结构装配:

```md
## 13. 配置引用与外部依赖绑定

本章定义 L1-identity 实现需要读取哪些配置、这些配置如何绑定到代码模块、外部依赖如何通过 adapter / port / event / fake 注入,以及跨仓依赖如何保持架构裁剪。

### 13.1 Configuration ownership and reading boundary

Raw config 只由 infra config loader、runtime builder 和 entry composition root 读取。Application 只接收 injected ports、application facade、typed parameters 或 prepared config-bound markers。Domain 和 contracts 不读取配置。API、worker、jobs entry 只能消费 validated config snapshot 和 entry-local / job-run-start 参数,并必须经 dispatch target catalog 和 application facade 进入用例边界。

### 13.2 Config reference table

配置引用表按 `profile`、`store`、`actor_context`、`role_catalog`、`bus`、`outbox`、`projection`、`operations`、`external_refs`、`audit`、`redline`、`fixture` 组织。每个配置项必须标明读取模块、注入对象、默认口径来源和禁止改变的不变量。完整文件格式、env var、secret provider、数值默认值和部署 profile 由 `04-配置设计.md` 与运维材料承接。

### 13.3 External dependency binding

外部依赖通过 Step 7 ports 和 adapter surface 注入。Store、idempotency/result、projection/reference/report、bus publisher、role/governance/work/artifact/memory resolver、handoff、audit、clock/id、fake/controlled/disabled adapter 均只能返回 body-free safe refs、state kinds、attempt/receipt/issue markers 或 formal outcome。除 `core-contracts` 外,method-library、work、governance、bus、memory/archive、artifact、observability、runtime 和 downstream consumers 均不得作为 Cargo path dependency。

### 13.4 Runtime builder and validation boundary

Runtime builder 负责把 validated config refs 装配为 repositories、UnitOfWork、clock/id、resolver、publisher、handoff、audit、adapter availability registry、application facade 和 entry surfaces。Builder order 必须先完成 raw config parse/type/range/cross-field validation,再解析 sensitive refs,再创建 `IdentityRuntimeConfigShell`,最后装配 store、base adapters、external adapters、facade 和 entry modules。`IdentityRuntimeAssemblyState::Assembled` 只表示 wiring ready,不代表 adapter healthy、publisher delivered、handoff delivered 或 business accepted。

### 13.5 Cross-repo and forbidden configuration boundary

Only `core-contracts = { path = "../quantalithos-core/crates/contracts" }` is allowed as current compile-time sibling dependency. Runtime, event, handoff, projection, fake and downstream collaboration must stay behind ports/adapters/events. Config validation must fail or return explicit disabled/degraded/unavailable surfaces instead of silently substituting fake success. Configuration cannot weaken identity truth ownership, state matrices, transaction order, idempotency/stored replay, query no-write, job no-truth-repair, terminal retry guard or body-free/secret-free boundaries.
```

本草稿只作为 Step 19 装配输入,当前不写入正式 `03-详细设计.md`。

---

## 8. 待确认事项

| 编号 | 事项 | 所属批次 | 当前处理 |
|---|---|---|---|
| DDD-S14-OPEN-001 | 配置读取边界和 code binding inventory 是否完整覆盖 infra/api/worker/jobs | 14.1 | 已闭合 |
| DDD-S14-OPEN-002 | config reference table 是否能逐项回指 `04-配置设计.md` 配置项和 Step 7/9 使用点 | 14.2 | 已闭合 |
| DDD-S14-OPEN-003 | 外部依赖绑定表是否覆盖 resolver、publisher、handoff、audit、store、clock/id、fake/controlled/disabled | 14.3 | 已闭合 |
| DDD-S14-OPEN-004 | 跨仓依赖是否明确区分 Cargo path dependency、runtime adapter、event collaboration、handoff 和 fake | 14.4 | 已闭合 |
| DDD-S14-OPEN-005 | runtime builder 顺序、config validation boundary 和 Step 15 handoff 是否闭合 | 14.5 | 已闭合 |

---

## 9. 进入下一步条件

进入 Step 15 前必须满足:

- 用户审核通过 Step 14。
- Step 15 只写 observability / audit cut points,不得定义告警阈值、运维流程、raw log body、secret output 或测试 ID。
- Step 15 必须承接 §6.4 的 safe fields / forbidden material,并继续保持 Step 12/13/14 的 body-free、stored replay、query no-write、fake parity 和 config boundary。
