# Step 3. 建立配置控制面总览

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 3
> 回填章节: `04-配置设计.md` §3 配置控制面总览

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 3 建立配置控制面总览 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 1 输入边界;Step 2 范围;新版 `00/01/02/03`;详细设计 Step 14 配置引用 |
| 输出文件 | `projects/L1-governance/design-calibration/04_config_step_03_control_plane.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 4 |

## 2. 本步目标

建立 `L1-governance` 的配置来源链、配置进入 runtime 的装配入口、允许读取配置的模块、不得读取配置的模块、配置控制面和配置域总览。

本 Step 只回答:

- 配置从哪些来源进入系统。
- 配置进入系统的主要装配入口是什么。
- 哪些模块可以读取 raw / validated config,哪些模块只能接收已注入的 port 或 typed 参数。
- P0 / P1 / P2 配置范围应先拆成哪些控制面和配置域。
- 每个配置域允许控制哪些行为,禁止控制哪些领域不变量。
- 每个配置域与详细设计 runtime config、builder、adapter、external dependency 的关系。
- 当前控制面拆分是否对 `03-详细设计.md` 产生回写影响。

本 Step 不定义最终配置项、默认值、环境变量名、JSON schema、secret 存储方式、来源优先级、冲突处理、环境矩阵、加载函数、热更新策略、部署命令或产品选型。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 已完成 | 提供上游输入边界和旧 `05/06` 方向输入口径 |
| `04_config_step_02_scope.md` | 已完成 | 提供 P0 / P1 / P2 配置范围和非范围 |
| `03-详细设计.md` §13 | 已完成 | 提供 runtime / adapter / store / consumer / publisher / handoff / redaction 绑定点 |
| `03-详细设计.md` §4~§6 / §15 / §17 | 已完成 | 提供模块边界、文件布局、观测安全字段和待确认风险 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供 config refs、runtime builder、adapter binding、topic binding 和禁止配置化边界 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供 `GovernanceRuntimeConfig`、adapter availability、store registry 和 runtime builder state |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供 repository、resolver、publisher、handoff、external export 和 adapter registry ports |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前系统配置从哪些来源读取? | 来源链先按 `code defaults -> config file -> environment variables -> secret refs -> test fixture / controlled override` 建立总览。Step 3 只确认这些来源类型和覆盖方向预览;具体优先级、冲突处理、secret raw value 禁止覆盖规则留给 Step 5 / Step 8。 |
| 配置进入系统的唯一或主要装配入口是什么? | 主要入口是 `infra::config` 加载 / 校验后的 validated config refs,再由 `infra::runtime_builder` 装配 store、resolver、publisher、handoff、external export、clock / id、API / worker / jobs facade。 |
| 哪些模块读取配置,哪些模块不得直接读取配置? | `infra` 读取 raw / validated config 并执行 runtime assembly;`api`、`worker`、`jobs` 只能接收已校验的 boundary / runner 参数或 facade。`application` 只依赖 port trait 和 typed policy 参数;`domain`、`contracts` 不读取配置。 |
| 配置控制哪些行为,不控制哪些领域不变量? | 配置控制 runtime profile、adapter availability、store binding、external resolver / consumer / publisher / topic / handoff / export / redaction / job runner 等执行接缝。配置不得控制 Governance truth 归属、正文排除、正式裁决边界、shared rules、状态机合法迁移、expected version、query no-write、projection 不反写、outbox snapshot 来源、duplicate replay 和 external export 不定义 truth。 |
| 配置变化会影响哪些下游文档? | 影响正式 `04` 后续 Step 4~14,并给 `05-测试方案.md` 的环境矩阵与配置失败测试、`06-验收标准.md` 的配置门禁、`07-实施计划.md` 的配置落地批次、部署运维手册的具体环境文件和 secret 操作提供输入。若配置结论改变 `03` 代码契约,必须先回写 `03`。 |
| 每个配置控制面应拆成哪些配置域 / 功能模块? | 本 Step 将控制面拆为 runtime assembly、store binding、inbound integration、outbound publication、operations jobs、handoff / export、observability / redaction、idempotency / result、clock / id / deterministic test、environment profile 十类,再映射到具体配置域。 |
| 每个配置域对应哪些详细设计 runtime config、builder、adapter 或外部依赖? | 每个配置域必须回指 `GovernanceRuntimeConfig` 字段、runtime builder 装配顺序、Step 7 port、Step 14 config section / adapter binding 或外部依赖 seam;不能只写“需要配置”。 |
| 每个配置域完成后是否通过停审? | 本 Step 的配置域均通过控制面停审:来源链清楚、允许控制能力清楚、禁止控制能力清楚、未发现新增 `03` 代码契约。 |
| 跨控制面是否有重叠、领域不变量误配置化或 03 契约影响未识别? | 已完成跨控制面审计。重叠项按 owner 收口:store owner 归 store binding,runner owner 归 operations jobs,transport topic owner 归 outbound publication,secret owner 归后续 Step 8。当前未发现需要回写 `03` 的新增契约。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 2 范围表 | 已列 P0 / P1 / P2 范围,但未形成控制面总览 | 本 Step 建立控制面表和配置域表 |
| `03` §13 | 只列配置绑定点,未按配置控制面组织 | 本 Step 把绑定点归入 runtime、store、integration、publication、jobs、handoff、observability 等控制面 |
| Step 14 配置引用表 | 含多种 config section,但仍偏代码绑定 | 本 Step 从配置设计视角归并为功能模块和停审项 |
| 正式 `04` | 当前不存在 | 本 Step 继续中间产物链,正式文档等 Step 15 装配 |
| 后续 Step | Step 5~8 尚未定义优先级、配置项、secret 规则 | 本 Step 不提前填具体值,只记录后续承接关系 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置来源 | 只有 Step 2 目标描述 | 建立来源链图和覆盖方向预览 | 支撑后续 Step 5 来源优先级 |
| 配置入口 | 散落在 `infra/config.rs`、runtime builder 和 Step 14 | 固定为 `infra::config` -> `runtime_builder` -> facade assembly | 防止 application / domain 直接读取配置 |
| 控制面拆分 | P0 范围尚未按模块停审 | 拆成 10 个控制面和多项配置域 | 后续 Step 4 / 7 可逐域展开 |
| 禁止控制能力 | Step 2 只列范围级边界 | 每个配置域都写允许 / 禁止能力 | 防止把领域不变量误配置化 |
| 详细设计影响 | 只在 Step 1 / 2 总体声明 | 每个控制面都做 `03` 影响判定 | 保持配置设计不静默新增代码契约 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 来源链是否写成最终优先级 | A. 写最终优先级;B. 只写来源和覆盖方向预览 | 采用 B。最终优先级与冲突处理留 Step 5 |
| 控制面是否按技术层拆 | A. 只按 crate / adapter 技术层;B. 按功能控制面并回指技术模块 | 采用 B。配置设计面向配置控制和审查,不是文件索引 |
| 是否当前写配置项清单 | A. 直接列配置项;B. 先拆控制面 / 配置域 | 采用 B。SOP 明确不得直接进入配置项清单 |
| 是否提前锁定 durable 产品 | A. 锁定具体产品;B. 只固定 store / adapter 角色 | 采用 B。产品选择未由上游锁定 |
| 是否把 external export disabled 写成关闭核心能力 | A. disabled 阻止核心 command;B. disabled 只关闭外围 export job | 采用 B。external export 不定义 Governance truth |

## 8. 结构化中间产物

### 8.1 配置来源链图

#### 配置来源链图: L1-governance 配置覆盖链

```text
[code defaults]
  -> [config file]
  -> [environment variables]
  -> [secret refs]
  -> [test fixture / controlled override]

        |
        v

[infra::config load / parse / validate]
  -> [validated config refs]
  -> [infra::runtime_builder]
  -> [store / resolver / publisher / handoff / export / clock-id adapters]
  -> [application facade]
  -> [api / worker / jobs entrypoints]
```

关键说明:

- 图只表达来源类型、覆盖方向预览和装配入口,不表达最终优先级、冲突处理、部署命令或产品选择。
- `secret refs` 表示普通配置中只能出现 secret reference;raw secret material 的读取、轮换和审计留给 Step 8。
- `test fixture / controlled override` 只用于 deterministic test / fake runtime;不得成为 production-like profile 的隐式高优先级来源。
- `domain`、`contracts` 和 `application` 不读取 raw config;配置必须先在 `infra` 中变成 validated refs、port 注入或 typed 参数。
- 架构不变量、领域不变量和事务 / 幂等 / outbox 语义不受配置来源覆盖。

### 8.2 配置控制面总表

| 控制面 | 作用 | 对应模块 | 是否 P0 | 对详细设计绑定 |
|---|---|---|---|---|
| runtime assembly / profile | 选择 runtime profile,校验 config ref,装配 facade 和 adapter availability | `infra::config`, `infra::runtime_builder`, `api`, `worker`, `jobs` | 是 | `GovernanceRuntimeConfig.profile_ref`, `GovernanceRuntimeBuilderState` |
| store binding / transaction carrier | 选择 truth、projection、reference、outbox、idempotency / result logical store adapter | `infra` stores, repository adapters, UoW manager | 是 | `GovernanceStoreConfigRef`, store registry, Step 11 logical stores |
| inbound integration / source resolver | 控制外部语境、定义、证据、运行反馈和告警输入的 resolver / consumer availability | worker consumers, source resolvers, reference snapshot store | 是 | `source_resolver_refs`, Step 7 resolver ports, inbound consumer flows |
| outbound publication / topic map | 控制 outbox publisher adapter、topic-neutral key 到 transport route 的绑定和 publish availability | outbox publisher adapter, worker publisher loop, publish job | 是 | `publisher_ref`, Step 8 topic key, Step 14 topic binding |
| operations job runners | 控制 publish、rebuild、refresh、reconcile、handoff、archive、export 等 runner 的 batch / retry / availability | `jobs`, worker maintenance loop, application job services | 是 | job metadata / report, Step 9 job flows, Step 13 duplicate replay |
| handoff / archive / external export | 控制 trace handoff、archive handoff、external export target 是否可用及 adapter binding | handoff adapters, external export adapter, adapter registry | 是 | `trace_handoff_target_refs`, `archive_handoff_target_refs`, `external_grc_adapter_ref`, `external_grc_target_ref`, handoff ports |
| observability / redaction | 控制安全日志、指标、trace / audit hook、redaction deny list 和 safe diagnostic refs | log / metric / trace hooks, redaction checker | 是 | Step 15 observability, Step 14 redaction binding |
| idempotency / result / report | 控制 command / consumer / job duplicate replay 所需 store、retention 和 stored surface availability | idempotency store, result / receipt / report store | 是 | `idempotency_store_ref`, Step 13 retention / duplicate rules |
| clock / id / deterministic test | 控制 clock、id generator、fixture profile 和 deterministic fake runtime | `infra::clock_id`, tests, runtime builder | 是 | `clock_adapter_ref`, `id_generator_ref`, `ClockPort`, `IdGeneratorPort` |
| environment / profile matrix | 描述 dev / test / staging / production-like profile 的配置差异和可用 adapter 组合 | config files, profile selector, test harness | 是 | `GovernanceRuntimeProfileRef`;详细矩阵留 Step 6 |

### 8.3 配置域 / 功能模块总表

| 配置域 / 功能模块 | 来源控制面 | 对应详细设计模块 | 允许配置的能力 | 禁止控制的能力 |
|---|---|---|---|---|
| runtime profile selection | runtime assembly / profile | `GovernanceRuntimeConfig.profile_ref`, runtime builder | 选择 validated profile,决定 fake / durable / disabled / degraded adapter 组合 | 改变 domain state matrix、truth ownership 或 command accepted 语义 |
| runtime config identity | runtime assembly / profile | `GovernanceInfraConfigRef`, config validator | 记录 redacted config identity 和 validation issue refs | 保存 raw config、secret、URL、topic 或产品错误正文 |
| adapter availability registry | runtime assembly / profile | `GovernanceAdapterAvailabilityMarker`, adapter registry port | 标记 enabled / disabled / degraded / unavailable | 用 availability 改写业务 truth 或隐藏 blocking config error |
| truth store binding | store binding / transaction carrier | truth repositories, UoW manager | 选择 truth store adapter 和 transaction carrier | 改变 truth schema、expected version、transaction ordering |
| projection store binding | store binding / transaction carrier | projection repository, query freshness surface | 选择 projection store 和 rebuild 承载 | 让 query 写 truth 或 projection rebuild 反写真相 |
| reference snapshot store binding | store binding / transaction carrier | reference snapshot repository | 选择 external reference state / snapshot store | 保存外部正文或让 unresolved reference 自动成立裁决 |
| outbox store binding | store binding / transaction carrier | outbox repository, stored payload snapshot | 选择 outbox record / payload snapshot store | publisher 从 current truth 临时拼 payload 或 publish failure 回滚 truth |
| idempotency / result store binding | idempotency / result / report | idempotency, stored result / receipt / report repositories | 选择 duplicate replay store 和 retention 承载 | 关闭 duplicate replay 或删除未对账 stored surface |
| source resolver family binding | inbound integration / source resolver | external source resolver ports | 选择 resolver family adapter 和 fake / unavailable surface | 引入非 core sibling Cargo dependency 或保存来源正文 |
| inbound consumer binding | inbound integration / source resolver | worker consumers, consumer receipt store | 启用 consumer namespace、schema allowlist、dedup window | 把 external event 当成本仓 command 或写核心 truth |
| publisher adapter binding | outbound publication / topic map | outbox publisher port, worker publisher | 选择 publisher adapter、publication retry class、fake publisher | 改变 outbox event kind、payload schema、source identity |
| transport topic binding | outbound publication / topic map | Step 8 topic-neutral key, publisher config | 将 topic-neutral key 绑定到 transport route | ad hoc 拼 topic 或用 topic 改变事件语义 |
| job runner binding | operations job runners | job services, job metadata / report store | 配置 runner availability、batch、retry、timeout、parallelism | job 反写核心 truth 或 duplicate 重新运行 mutation |
| projection rebuild binding | operations job runners | projection rebuild job | 配置 rebuild scope、batch 和 target store | rebuild 时修复业务 truth 或生成 ad hoc projection identity |
| reference refresh binding | operations job runners | reference refresh job, source resolvers | 配置 refresh scope、resolver availability、failed marker | refresh 时保存 external body 或自动改变正式裁决 |
| reconciliation binding | operations job runners | reconciliation service / report | 配置 reconciliation scope、report store 和 diagnostic refs | reconciliation 自动修正 truth |
| trace handoff target binding | handoff / archive / external export | trace handoff adapter and marker store | 启用 handoff target、adapter availability、package / receipt marker | 保存 observability ledger body 或让接收方改写 truth |
| archive handoff binding | handoff / archive / external export | archive handoff adapter, archive marker | 启用 archive target、handoff failure marker | 保存 archive package body 或要求 archive 完成才算 command accepted |
| external export binding | handoff / archive / external export | external export adapter, export job | 启用 / 禁用 external export target | external system status 反向定义 Governance truth |
| redaction / safe output binding | observability / redaction | logs, metrics, audit, trace hooks | 配置 safe field allowlist / deny list 和 diagnostic ref 生成 | 输出 forbidden body、raw secret、raw external payload 或 high-cardinality text |
| boundary limits | observability / redaction | API / query boundary, page limits | 配置 request body limit、page limit、query timeout | 绕过 actor、metadata、visibility、idempotency 或 authorization guard |
| clock / id adapter binding | clock / id / deterministic test | ClockPort, IdGeneratorPort | 选择 deterministic fake 或 runtime clock / id adapter | 让 handler / domain 拼 id 或使用隐式 DB default time |
| test fake profile binding | environment / profile matrix | test harness, fake adapters, fixtures | 配置 deterministic fake、in-memory store、fixture source | 把测试 override 作为生产配置来源或跳过正式状态 |
| environment profile binding | environment / profile matrix | profile selector and runtime builder | 表达 dev / test / staging / production-like 差异 | 在 profile 中改变领域不变量或静默启用未闭合产品依赖 |

### 8.4 配置控制面停审记录

| 配置域 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| runtime profile selection | 来源链、允许控制能力、禁止控制能力、03 契约影响 | 通过 | 只选择 profile 与 adapter 组合,不新增 runtime builder 签名 |
| runtime config identity | raw config 与 secret 是否进入对象 | 通过 | 只保存 validated refs / redacted issue refs |
| adapter availability registry | disabled / degraded 是否误改业务语义 | 通过 | availability 只影响 startup、degraded、delayed、job report surface |
| truth store binding | store 是否改变 truth / transaction | 通过 | store 只承载 repository,不改变 expected version / UoW |
| projection store binding | query / rebuild 是否反写真相 | 通过 | projection 只读 / rebuild 替换 view,不写 core truth |
| reference snapshot store binding | external body 是否进入本仓 | 通过 | 只保存 ref / snapshot / resolution state |
| outbox store binding | payload 来源是否稳定 | 通过 | publisher 读取 stored payload snapshot,不现查 current truth |
| idempotency / result store binding | duplicate replay 是否闭合 | 通过 | retention 数值留 Step 7 / Step 13,控制面不关闭 replay |
| source resolver family binding | 是否引入相邻仓编译依赖 | 通过 | 通过 port / event / fake,不新增 Cargo dependency |
| inbound consumer binding | consumer 是否写核心 truth | 通过 | 只写 local snapshot / reference state / stale marker / receipt |
| publisher adapter binding | publish failure 是否回滚 truth | 通过 | failure 只写 publication marker / job report |
| transport topic binding | topic 是否改变 event schema | 通过 | topic 只映射 route,不改 event kind / payload |
| job runner binding | job 是否修复业务 truth | 通过 | job 写 marker / report / derived state,不改 core truth |
| handoff / archive / export binding | downstream 是否反向定义 truth | 通过 | disabled / failed 只影响外围 job surface |
| redaction / safe output binding | forbidden body / secret 是否输出 | 通过 | 具体 deny list 留 Step 8 / Step 9,边界已固定 |
| boundary limits | 是否绕过安全门禁 | 通过 | limits 只拒绝请求或分页,不改变授权 / visibility |
| clock / id adapter binding | id / time 来源是否唯一 | 通过 | 由 ports 注入,domain / handler 不拼 id |
| test fake / environment profile binding | test override 是否越界 | 通过 | fake profile 只服务测试和 P0 local;生产 profile 不继承 override |

### 8.5 跨控制面审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 控制面是否覆盖 Step 2 P0 范围 | 通过 | runtime、store、consumer、publisher、jobs、handoff/export、observability/redaction、test profile 均已覆盖 |
| 控制面是否直接进入配置项清单 | 通过 | 本 Step 只拆控制面 / 配置域;配置项留 Step 7 |
| 来源链是否误写最终优先级 | 通过 | 仅表达覆盖方向预览;最终优先级留 Step 5 |
| 是否存在控制面重叠 | 通过 | store owner、runner owner、topic owner、secret owner 已分离;Step 7 再按配置项去重 |
| 是否把领域不变量配置化 | 通过 | truth、state、transaction、visibility、outbox、idempotency、external export 边界均列入禁止控制能力 |
| 是否遗漏详细设计绑定点 | 通过 | `GovernanceRuntimeConfig` 字段、Step 7 port、Step 14 config section、Step 11 store 均已映射 |
| 是否需要新增 `03` runtime config 字段 | 未发现 | 当前只重组既有绑定点,不新增代码契约 |
| 是否需要新增 adapter constructor / port | 未发现 | 当前不改变 Step 7 port,后续 Step 7 若发现缺口再阻塞回写 |
| 是否引入产品选型 | 通过 | 仍保持 product-neutral / fake / disabled / degraded 口径 |
| 是否保留旧 `05/06` 环境矩阵为真相源 | 通过 | 旧下游只作为方向输入,正式 profile 矩阵留 Step 6 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 配置入口固定为 `infra::config` -> `runtime_builder` -> adapter / facade assembly | 否 | 承接 `03` §13 和 Step 14 | 不适用 | 无回写 |
| 配置控制面拆为 runtime、store、inbound、outbound、jobs、handoff/export、observability、idempotency、clock/id、profile | 否 | 对既有绑定点做配置设计分组 | 不适用 | 无回写 |
| `application`、`domain`、`contracts` 不读取 raw config | 否 | 承接模块边界 | 不适用 | 无回写 |
| 每个配置域均声明禁止控制领域不变量 | 否 | 设计边界重申 | 不适用 | 无回写 |
| 后续若配置项要求新增 `GovernanceRuntimeConfig` 字段、adapter constructor 参数、port、error、flow 或 DTO | 是 | 代码契约变更 | `03` §4~§13 或对应 calibration Step | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_03_control_plane.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“配置来源链图”“配置控制面总表”“配置域 / 功能模块总表”“配置控制面停审记录”“跨控制面审计表”和“对详细设计的影响判定”小节,了解配置控制面如何从详细设计绑定点收敛。

正式 `04-配置设计.md` §3 应回填:

- `L1-governance` 配置来源链图。
- 配置入口: `infra::config` 加载 / 校验,`infra::runtime_builder` 装配 runtime,`api` / `worker` / `jobs` 使用已校验参数或 facade。
- 配置控制面总表。
- 配置域 / 功能模块总表。
- 配置控制面停审记录。
- 跨控制面审计表。
- 对详细设计的影响判定。

回填要求:

- 不得写具体配置项默认值、环境变量名、secret 存储路径、部署命令或产品选型。
- 不得把来源链图误写成最终优先级规则;最终优先级留 Step 5。
- 不得把领域不变量、状态机、事务语义、visibility、idempotency 或 outbox payload source 写成普通配置。
- 不得提前创建或修改 `03` 代码契约;发现缺口必须回写 `03` 或阻塞待确认。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| code defaults、config file、env、secret refs、test override 的最终优先级 | 影响冲突处理和 fail-fast 规则 | Step 5 正式定义 |
| dev / test / staging / production-like profile 的具体矩阵 | 影响测试和验收承接 | Step 6 正式定义 |
| 每个配置域的具体配置项、默认值、必填性和来源 | 影响 implementation config schema | Step 7 正式定义 |
| secret provider、raw secret 禁止输出和轮换审计 | 影响安全和运维 | Step 8 正式定义 |
| config loader / validator / runtime builder 具体失败策略 | 影响启动和 reload | Step 9 / Step 11 正式定义 |
| durable store、bus、metric、diagnostic、external export 产品是否锁定 | 影响 P1 / P2 配置项和 ADR | 后续 Step 13 / Step 14 记录风险或待确认 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置来源链图已建立 | 通过 | 见 §8.1 |
| 配置进入系统的主要装配入口已明确 | 通过 | `infra::config` -> `runtime_builder` |
| 允许读取配置和禁止读取配置的模块已明确 | 通过 | `infra` 读取 raw / validated config;application/domain/contracts 不读取 raw config |
| 配置控制面和配置域已拆分 | 通过 | 见 §8.2 / §8.3 |
| 每个配置域已停审 | 通过 | 见 §8.4 |
| 跨控制面审计没有 unresolved 冲突 | 通过 | 见 §8.5 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 4 | 通过 | 下一步定义配置分类与禁止配置化边界 |
