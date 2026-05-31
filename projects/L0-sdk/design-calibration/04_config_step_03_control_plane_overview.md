# Step 3. 建立配置控制面总览

> 本文件是 `projects/L0-sdk/04-配置设计.md` 的 Step 3 中间产物。
> 本步建立配置来源链、配置进入 SDK runtime 的装配入口、配置控制面总表和模块读取边界。
> 本步不定义最终来源优先级细则,不列完整配置项清单,不写 JSON 示例,不回写 `03-详细设计.md`。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 3
- 回填章节：`projects/L0-sdk/04-配置设计.md` §3 配置控制面总览

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 已确认配置设计承接 `SdkRuntimeConfig` / `ConfigLoader` / `ConfigValidator` / `SdkRuntimeBuilder` | 确认配置进入 SDK 的主装配路径 |
| `04_config_step_02_scope.md` | 已确认 P0 聚焦默认可验证路径和稳定配置接缝 | 决定控制面总表只覆盖 P0 必须项和 P1/P2 接缝 |
| `02_hld_step_11_configuration_impact.md` | 已确认 source、boundary、runner、artifact、outbox、projection、language package、policy、CLI 和 jobs 受配置影响 | 决定配置影响范围和禁止直接读取模块 |
| `03_ddd_step_14_config_dependencies.md` | 已确认配置读取模块、配置组、外部依赖绑定和 `SdkRuntimeBuilder` 输出 | 决定控制面对应模块和装配入口 |
| `03-详细设计.md` §13 | 正式详细设计中的配置绑定点和禁止配置化边界 | 确认本步不新增代码契约 |

已确认结论:

```text
配置进入 L0-sdk 的主路径是:
config sources -> ConfigLoader -> SdkRuntimeConfig -> ConfigValidator -> ValidatedSdkRuntimeConfig -> SdkRuntimeBuilder -> SdkRuntimeHandle。

contracts、domain_*、application_ports 和 language_package_surface 不读取配置。
application_services 不解析配置文件,只接收已构造 port、policy、repository 和 runner dependency。
infra_adapters、cli_entry、jobs 和测试 fixture 可以在受控边界读取或接收配置。
```

## 3. SOP 问题回答

### 3.1 当前系统配置从哪些来源读取?

P0 默认来源链分为四类：代码默认值、JSON 配置文件、环境变量覆盖、secret / credential reference 解析。CLI 和 jobs 可以接收入口级参数,但入口参数必须进入同一套 loader / validator / builder 链路。

| 来源 | 当前口径 | 是否 P0 | 说明 |
|---|---|---|---|
| code defaults | 内置安全默认值,例如 secure policy on、local / in-memory store、fake marker required | 是 | 保障 local / CI 可启动,但不得绕过安全红线 |
| JSON config file | 默认配置文件格式 | 是 | Step 7 负责给模块级 JSON demo 和完整 JSONC 文档示例 |
| environment variables | 覆盖 profile、路径、启用项或测试参数 | 是 | 具体优先级和冲突规则 Step 5 定义 |
| secret / credential refs | 引用外部 secret、token、endpoint credential | 是 | 配置中只保存 ref,不保存 raw secret 或 raw token |
| CLI / job args | 入口级 config path、profile、run id、target | P0 局部 | 只用于入口选择,不替代统一配置文件 |
| remote config / config center | 后续远程配置来源 | P1/P2 | 本轮只保留演进入口,不作为 P0 必需 |

### 3.2 配置进入系统的唯一或主要装配入口是什么?

主要装配入口是 `infra_adapters` 层的配置加载、校验和 runtime builder。

```text
ConfigSource
  -> ConfigLoader
  -> SdkRuntimeConfig
  -> ConfigValidator
  -> ValidatedSdkRuntimeConfig
  -> SdkRuntimeBuilder
  -> SdkRuntimeHandle
```

其中:

- `ConfigLoader` 负责读取配置来源并解析为 `SdkRuntimeConfig`。
- `ConfigValidator` 负责类型、范围、交叉字段和禁止配置化边界校验。
- `SdkRuntimeBuilder` 负责把已校验配置转成 repository、source adapter、boundary adapter、runner、artifact store、projection、outbox、policy set 和 application services。
- `SdkRuntimeHandle` 是 client facade、CLI、jobs 和测试 fixture 消费的装配结果,不暴露 concrete adapter。

### 3.3 哪些模块读取配置,哪些模块不得直接读取配置?

| 模块 / crate | 配置关系 | 允许行为 | 禁止行为 |
|---|---|---|---|
| `contracts` | 不读取配置 | 定义 DTO / event / job / package surface 契约 | 不引入 runtime config 或环境变量 |
| `domain_*` | 不读取配置 | 接收显式参数、状态、policy 判断结果 | 不读取 JSON / env / secret,不依赖 `SdkRuntimeConfig` |
| `application_ports` | 不读取配置 | 定义 port trait | 不绑定运行环境 |
| `application_services` | 间接受配置影响 | 接收 port、repository、policy set、runner dependency | 不解析配置文件,不直接依赖 endpoint / store config |
| `infra_adapters` | 直接读取和装配配置 | `ConfigLoader`、`ConfigValidator`、`SdkRuntimeBuilder`、adapter constructor | 不把 adapter 私有配置泄漏给 domain |
| `client` | 间接受配置影响 | 接收 `SdkRuntimeHandle` 或已派生 client profile | 不解析 raw config,不持有 concrete adapter |
| `cli_entry` | 入口级配置 | 接收 config path / profile / run id,委托 runtime builder | 不在 handler 中手工拼 adapter |
| `jobs` | 入口级配置 | 接收 job profile / target / artifact root,委托 runtime builder | 不绕过 application service 或 policy |
| `tests` | 测试级配置 | 使用 fixture / in-memory / fake explicit config | 不把测试便利配置作为生产默认值 |

### 3.4 配置控制哪些行为,不控制哪些领域不变量?

配置控制运行装配和外部接缝,不控制 SDK truth、状态机和安全红线。

| 配置可以控制 | 配置不得控制 |
|---|---|
| 使用哪个 store / source / boundary / runner / artifact / projection profile | 是否重新定义 core / bus / service truth |
| CLI / jobs 入口 profile、run id、target、artifact root | 是否让 domain 读取 raw config |
| formal / fake / bus boundary endpoint ref、timeout、credential ref | 是否把 fake success 标记为 production success |
| package language enablement、generator profile、local package output root | 是否让 `Stable` 等于 public registry publish |
| smoke / docs / compatibility / boundary runner profile | 是否绕过 evidence / compatibility gate |
| redaction、credential、trace、error mapping 的策略 profile | 是否关闭 redaction / credential protection 下限 |
| projection store、rebuild mode、stale marker | 是否让 query / projection 反写 truth |
| deterministic clock / id generator 测试 profile | 是否保存 raw secret、业务正文或生产 request / response body |

### 3.5 配置变化会影响哪些下游文档?

| 下游文档 | 受影响内容 | 本步提供的输入 |
|---|---|---|
| `05-测试方案.md` | config loader / validator、profile matrix、fake marker、secret ref、redaction、runner / artifact root | 控制面总表和模块读取边界 |
| `06-验收标准.md` | 禁止配置化红线、配置错误一票否决、P0 默认可验证路径 | 配置不得控制的 SDK truth 和安全下限 |
| `07-实施计划.md` | config loader、validator、runtime builder、adapter wiring、package runner 的实施顺序 | 配置进入系统的装配路径 |
| 部署与运维手册 | 真实环境配置文件、secret 挂载、profile 选择、运行手册 | 配置来源类型和后续承接边界 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `03-详细设计.md` §13 | 已列配置绑定点,但没有配置控制面总览 | 读者难以看出配置从哪里进入 SDK,又影响哪些运行部分 |
| `02-概要设计.md` §11 | 已有配置影响轮廓,但不说明配置来源链 | 无法支撑 `04` 后续来源优先级、profile 和配置项清单 |
| 当前 `04` 缺失 | 没有统一说明哪些模块能读取配置、哪些模块禁止读取配置 | 实现阶段容易让 domain、application 或 client 读取环境变量 / JSON |
| 当前 `05/06` | 配置测试和验收尚未按新版控制面组织 | 需要先给出新版配置控制面,后续再重写测试验收 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置来源 | 只有“后续配置设计”提示 | 初步确定 code defaults、JSON file、env override、secret / credential refs、CLI / job args 和 P1/P2 remote config | 为 Step 5 来源优先级做输入 |
| 装配入口 | 分散在 loader、validator、builder 描述中 | 明确主路径为 `ConfigLoader -> ConfigValidator -> SdkRuntimeBuilder -> SdkRuntimeHandle` | 防止各入口私自读取配置 |
| 模块读取边界 | 详细设计已提到,但未形成 `04` 视图 | 明确 contracts/domain/application_ports 不读,application 间接受影响,infra / cli / jobs / tests 受控读取 | 保护 domain 纯粹和 ports and adapters |
| 控制面 | 只列 config struct | 按 runtime、store、sources、boundaries、runners、artifacts、outbox、projections、language packages、policies、cli/jobs 组织控制面 | 配置设计要面向行为控制,不只是字段列表 |
| 下游影响 | 未集中说明 | 明确 `05/06/07/09` 如何承接控制面 | 保持文档链路可追溯 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：每个入口各自读取配置 | 启动代码直观 | client、CLI、jobs、runner 容易出现不同覆盖顺序和校验规则 | 不采用 |
| 方案 B：`infra_adapters` 统一 loader / validator / builder,入口只消费 `SdkRuntimeHandle` 或入口 profile | 配置来源、校验和禁止边界集中,可测试和可审计 | 需要在 runtime builder 中维护装配图 | 采用 |
| 方案 C：完全只依赖代码默认值,不提供文件和 env 覆盖 | 最简单 | 无法支撑 profile、测试矩阵、部署和后续 production boundary | 不采用 |
| 方案 D：P0 直接接入 config center | 接近生产治理 | 会改变 loader 生命周期和可用性假设,超出 P0 | 不采用 |

推荐方案 B。

原因:

- `L0-sdk` 的配置影响面跨 source、boundary、runner、artifact、outbox、projection、language package、policy、CLI 和 jobs,必须集中校验。
- 禁止配置化边界需要由 `ConfigValidator` 和 `SdkRuntimeBuilder` 统一拦截,不能分散到各入口。
- P0 仍可通过 code defaults + JSON + env + secret / credential ref 支撑本地和 CI,不需要远程配置中心。

## 7. 结构化中间产物

### 7.1 配置来源链图: L0-sdk 配置覆盖链

```text
[code defaults]
  |
  v
[JSON config file]
  |
  v
[environment overrides]
  |
  v
[secret refs / credential refs]
  |
  v
[validated SDK runtime config]
```

关键说明:

- 该图表达配置来源类别和大致覆盖方向,具体优先级、冲突处理和不可用策略由 Step 5 定义。
- JSON 是默认配置文件格式;完整 JSON demo 由 Step 7 定义。
- secret / credential 只以 reference 形式出现,不得把 raw secret 或 raw token 写入配置正文。
- remote config / config center 不进入 P0 来源链,只保留 P1/P2 演进入口。

### 7.2 配置装配总图: L0-sdk runtime 装配路径

```text
Config sources
  |
  v
ConfigLoader
  |
  v
SdkRuntimeConfig
  |
  v
ConfigValidator
  |-- reject disabled redaction / credential protection
  |-- reject fake-as-production
  |-- reject raw secret / raw token
  |-- reject invalid profile combination
  v
ValidatedSdkRuntimeConfig
  |
  v
SdkRuntimeBuilder
  |
  +-- source adapters
  +-- boundary adapters
  +-- runner adapters
  +-- repositories / stores
  +-- artifact store / outbox / projections
  +-- runtime policy set
  +-- application services
  v
SdkRuntimeHandle
```

关键说明:

- 该图表达配置如何进入 SDK runtime,不表达业务处理流程。
- `SdkRuntimeHandle` 是 client、CLI、jobs 和测试 fixture 的装配结果。
- `domain_*` 和 `application_services` 不直接读取 raw config;policy 由 runtime builder 通过已校验配置构造。
- 禁止配置化边界必须在 validator 和 builder 阶段同时保护。

### 7.3 配置控制面总表

| 控制面 | 作用 | 对应模块 | 是否 P0 |
|---|---|---|---|
| Runtime assembly | 聚合配置来源、校验和 `SdkRuntimeHandle` 装配 | `infra_adapters::config` / runtime builder | 是 |
| Store profile | 控制 SDK truth、idempotency、repository、projection store | repository / UoW adapters | 是 |
| Source profile | 控制 core / bus / formal API snapshot source 和 freshness | source adapters / jobs | 是 |
| Boundary profile | 控制 formal API、fake / fixture、bus event boundary | boundary adapters | 是 |
| Runner profile | 控制 generator、package builder、smoke、docs、compatibility、boundary verifier | runner adapters / jobs | 是 |
| Artifact profile | 控制 package artifact、evidence artifact、report ref 存储 | artifact store / reports | 是 |
| Outbox profile | 控制 SDK outbound event / report event 暂存与发布边界 | outbox adapter / publisher | 是 |
| Projection profile | 控制 read model、query、projection rebuild 和 stale marker | projection adapter / jobs | 是 |
| Language package profile | 控制 Rust / Python / TypeScript package candidate 生成边界 | package builder / language surface | 是 |
| Policy profile | 控制 redaction、credential、trace、error mapping、fake marker、boundary guard | policy factory / validator | 是 |
| CLI / job entry profile | 控制 config path、profile、run id、target、artifact root、report root | `cli_entry` / `jobs` | 是 |
| Remote config source | 远程配置来源和热更新入口 | 后续 infra extension | 否,P1/P2 |
| Public registry publish profile | 公共发包 endpoint、credential、rollback 相关配置 | 后续发布专项 | 否,P1 |

### 7.4 模块读取边界表

| 模块 | 直接读取配置 | 可接收的配置结果 | 关键限制 |
|---|---|---|---|
| `contracts` | 否 | 无 | 不绑定运行环境 |
| `domain_*` | 否 | 已校验值、policy 判断结果 | 不依赖 `SdkRuntimeConfig` |
| `application_ports` | 否 | 无 | 不绑定 endpoint / store |
| `application_services` | 否 | port、repository、policy set、runner dependency | 不解析 JSON / env |
| `infra_adapters` | 是 | `SdkRuntimeConfig` / `ValidatedSdkRuntimeConfig` | 负责统一校验和 adapter 构造 |
| `client` | 否 | `SdkRuntimeHandle` / client profile | 不直接解析 raw config |
| `cli_entry` | 入口级 | config path、profile、run id | 必须委托 runtime builder |
| `jobs` | 入口级 | job profile、target、artifact root、report root | 必须委托 runtime builder |
| `tests` | 测试级 | fixture / in-memory / fake config | 不把测试便利项升级为生产默认 |

## 8. 对详细设计的影响判定
| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 3 建立配置来源链和控制面总览,不新增配置字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| 主装配路径采用 `ConfigLoader -> ConfigValidator -> SdkRuntimeBuilder -> SdkRuntimeHandle` | 否 | 与 `03` §13 和 Step 14 中间产物一致 | 无 | 无回写 |
| contracts / domain / application_ports 不读取配置,application services 间接受影响,infra / cli / jobs / tests 受控读取 | 否 | 与 `03` §13 绑定点一致 | 无 | 无回写 |
| remote config / config center 不进入 P0 来源链 | 否 | 范围裁剪,不改变 `03` 代码契约 | 无 | 无回写 |
说明:
- 本步只建立控制面视图,没有新增 `SdkRuntimeConfig` 字段。
- Step 5 会继续定义来源优先级和冲突处理;Step 7 才会定义配置项清单。

## 9. 回填草稿
以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §3。

````md
## 3. 配置控制面总览

> 校准来源：
> - `design-calibration/04_config_step_03_control_plane_overview.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“配置来源链图”“配置装配总图”“配置控制面总表”和“对详细设计的影响判定”小节，了解本章如何建立配置控制面总览。

L0-sdk 的配置控制面以 `SdkRuntimeConfig` 为根对象,经由 `ConfigLoader`、`ConfigValidator` 和 `SdkRuntimeBuilder` 进入 runtime。配置来源包括 code defaults、JSON config file、environment overrides、secret refs / credential refs 和局部 CLI / job args。remote config / config center 不进入 P0 默认来源链,仅作为 P1/P2 演进入口。

配置进入 runtime 的主路径为：

```text
Config sources
  -> ConfigLoader
  -> SdkRuntimeConfig
  -> ConfigValidator
  -> ValidatedSdkRuntimeConfig
  -> SdkRuntimeBuilder
  -> SdkRuntimeHandle
```

`SdkRuntimeHandle` 是 client、CLI、jobs 和测试 fixture 的装配结果。`domain_*` 和 `application_services` 不直接读取 raw config;source、boundary、runner、artifact、outbox、projection、language package、policy、CLI 和 jobs 通过已校验配置进入对应 adapter 或 service。
````

## 10. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 是否接受 P0 配置来源先限定为 code defaults、JSON config file、environment overrides、secret / credential refs 和局部 CLI / job args | A. 接受;B. P0 加入 remote config;C. 只保留 code defaults | 推荐 A | 可支撑 local / CI / test,又不改变 runtime 生命周期 |
| 是否接受 `SdkRuntimeHandle` 作为 client、CLI、jobs 和测试 fixture 的装配结果 | A. 接受;B. 各入口分别构造 adapter;C. client 直接读取配置 | 推荐 A | 与 03 的 runtime builder 口径一致,能集中校验和隐藏 concrete adapter |
| 是否接受本步不回写 `03-详细设计.md` | A. 接受;B. 先扩写 `03` 配置章节;C. 等 Step 7 后再判断 | 推荐 A | Step 3 只建立控制面视图,没有改变代码契约 |

## 11. 进入下一步条件

- [x] 用户确认配置来源链图。
- [x] 用户确认配置装配总图。
- [x] 用户确认配置控制面总表。
- [x] 用户确认 SDK truth 和安全红线不进入配置控制面。
- [x] 用户确认本步无需回写 `03-详细设计.md`。
- [x] Step 3 状态从 `[~]` 更新为 `[x]`。
