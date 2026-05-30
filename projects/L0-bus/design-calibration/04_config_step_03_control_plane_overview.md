# Step 3. 建立配置控制面总览

> 本文件是 `projects/L0-bus/04-配置设计.md` 的 Step 3 中间产物。
> 本步建立配置来源链、配置进入 runtime 的装配入口、配置控制面总表和模块读取边界。
> 本步不定义最终来源优先级细则,不列完整配置项清单,不写 JSON 示例,不回写 `03-详细设计.md`。

---

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 3
- 回填章节：`projects/L0-bus/04-配置设计.md` §3 配置控制面总览

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 已确认配置设计承接 `RuntimeConfig` / `ConfigLoader` / `ConfigValidator` / `RuntimeBuilder` | 确认配置进入系统的主装配路径 |
| `04_config_step_02_scope.md` | 已确认 P0 配置覆盖默认可验证路径和稳定接缝 | 决定控制面总表只覆盖 P0 必须项和 P1/P2 接缝 |
| `02_hld_step_11_configuration_impact.md` | 已确认入口、worker、job、adapter、projection、policy factory 受配置影响,domain 不直接读配置 | 决定配置影响范围和禁止直接读取模块 |
| `03_ddd_step_14_config_dependencies.md` | 已确认配置读取模块、配置组、外部依赖绑定和 RuntimeBuilder 输出 | 决定控制面对应模块和装配入口 |
| `03-详细设计.md` §13 | 正式详细设计中的配置绑定点和禁止配置化边界 | 确认本步不新增代码契约 |

已确认结论:

```text
配置进入 L0-bus 的主路径是:
config sources -> ConfigLoader -> ConfigValidator -> ValidatedRuntimeConfig -> RuntimeBuilder -> RuntimeGraph。

domain 和 contracts 不读取配置。
application 不解析配置文件,只接收已构造 port、policy 和 service dependency。
infra、api、worker、jobs、tests 可以在各自边界读取或接收配置。
```

---

## 3. SOP 问题回答

### 3.1 当前系统配置从哪些来源读取?

P0 默认来源链分为四类：代码默认值、JSON 配置文件、环境变量覆盖、secret / connection reference 解析。

| 来源 | 当前口径 | 是否 P0 | 说明 |
|---|---|---|---|
| code defaults | 内置安全默认值,例如 in-memory store / backend / publisher、ref-only security boundary | 是 | 保障 local / CI 可启动,但不得绕过安全红线 |
| JSON config file | 默认配置文件格式 | 是 | Step 7 负责给模块级 JSON demo 和完整 JSONC 文档示例 |
| environment variables | 覆盖 profile、路径、启用项或测试参数 | 是 | 具体优先级和冲突规则 Step 5 定义 |
| secret refs / connection refs | 引用外部 secret 或连接信息 | 是 | 配置中只保存 ref,不保存 raw secret |
| CLI args | operations job 可以接收 job profile / run 参数 | P0 局部 | 只用于 job 入口,不替代统一配置文件 |
| config center / remote config | 后续远程配置来源 | P1/P2 | 本轮只保留演进入口,不作为 P0 必需 |

### 3.2 配置进入系统的唯一或主要装配入口是什么?

主要装配入口是 `infra` 层的配置加载、校验和 runtime builder。

```text
ConfigSource
  -> ConfigLoader
  -> RuntimeConfig
  -> ConfigValidator
  -> ValidatedRuntimeConfig
  -> RuntimeBuilder
  -> RuntimeGraph
```

其中：

- `ConfigLoader` 负责读取配置来源并解析为 `RuntimeConfig`。
- `ConfigValidator` 负责类型、范围、交叉字段和禁止配置化边界校验。
- `RuntimeBuilder` 负责把已校验配置转成 repository、adapter、port、policy、handler 和 job runner。
- `RuntimeGraph` 是 API、worker、jobs 和测试 fixture 启动时消费的装配结果。

### 3.3 哪些模块读取配置,哪些模块不得直接读取配置?

| 模块 / crate | 配置关系 | 允许行为 | 禁止行为 |
|---|---|---|---|
| `contracts` | 不读取配置 | 定义 DTO / event / job schema | 不引入 runtime config 或环境变量 |
| `domain` | 不读取配置 | 接收已校验参数、状态、policy 判断结果 | 不读取 JSON / env / secret,不依赖 `RuntimeConfig` |
| `application` | 间接受配置影响 | 接收 port trait、policy set、service dependency | 不解析配置文件,不直接依赖 DB / MQ config |
| `infra` | 直接读取和装配配置 | `ConfigLoader`、`ConfigValidator`、`RuntimeBuilder`、adapter constructor | 不把 adapter 私有配置泄漏给 domain |
| `api` | 入口级配置 | 接收 `ApiConfig` 和 `RuntimeGraph` 中的 service / handler | 不绕过 validator 自行读取不受控配置 |
| `worker` | 入口级配置 | 接收 `WorkerConfig`、source、backend signal consumer 和 service | 不把 worker 参数写入 domain object |
| `jobs` | 入口级配置 | 接收 `JobConfig`、cursor、batch、retry、projection job runner | 不绕过 recovery / projection policy |
| `tests` | 测试级配置 | 使用 fixture / in-memory / deterministic config | 不把测试便利配置作为生产默认值 |

### 3.4 配置控制哪些行为,不控制哪些领域不变量?

配置控制运行装配和外部接缝,不控制领域不变量和安全红线。

| 配置可以控制 | 配置不得控制 |
|---|---|
| 使用哪个 store / backend / publisher / source profile | 是否保存 payload body |
| API / worker / job 是否启用及其 profile | 是否允许 raw secret |
| batch size、timeout、cursor、checkpoint、retry category | 是否关闭关键 audit / history |
| projection store、rebuild mode、stale marker 策略 | 是否允许 projection 反写 truth |
| policy ref、capability ref、secret ref、connection ref | 是否允许 replay 绕过 DLQ / history / audit chain |
| deterministic clock / id generator 测试 profile | 是否让 backend raw status 直接写入 `DeliveryStatus` |
| local / CI / test / staging / production-like profile 差异 | 是否用业务幂等替代 bus 幂等 |

### 3.5 配置变化会影响哪些下游文档?

| 下游文档 | 受影响内容 | 本步提供的输入 |
|---|---|---|
| `05-测试方案.md` | config loader / validator、profile matrix、failure modes、secret ref、redaction、in-memory default path | 控制面总表和模块读取边界 |
| `06-验收标准.md` | 禁止配置化红线、配置错误一票否决、P0 默认可验证路径 | 配置不得控制的领域不变量 |
| `07-实施计划.md` | config loader、validator、runtime builder、adapter wiring 的实施顺序 | 配置进入系统的装配路径 |
| 部署与运维手册 | 真实环境配置文件、secret 挂载、profile 选择、运行手册 | 配置来源类型和后续承接边界 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `03-详细设计.md` §13 | 已列配置绑定点,但没有控制面总览 | 读者难以看出配置从哪里进入系统,又影响哪些运行部分 |
| `02-概要设计.md` §11 | 已有配置影响轮廓,但不说明配置来源链 | 无法支撑 `04` 后续来源优先级、profile 和配置项清单 |
| 当前 `04` 缺失 | 没有统一说明哪些模块能读取配置、哪些模块禁止读取配置 | 实现阶段容易让 domain 或 application 读取环境变量 / JSON |
| 当前旧 `05/06` | 配置测试和验收仍可能按旧对象组织 | 需要先给出新版配置控制面,后续再重写测试验收 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置来源 | 只有“后续配置设计”提示 | 初步确定 code defaults、JSON file、env override、secret refs / connection refs、CLI args 和 P1/P2 config center | 为 Step 5 来源优先级做输入 |
| 装配入口 | 分散在 loader、validator、builder 描述中 | 明确主路径为 `ConfigLoader -> ConfigValidator -> RuntimeBuilder -> RuntimeGraph` | 防止各入口私自读取配置 |
| 模块读取边界 | 详细设计已提到,但未形成 `04` 视图 | 明确 contracts/domain 不读,application 间接受影响,infra / api / worker / jobs / tests 受控读取 | 保护 domain 纯粹和 ports and adapters |
| 控制面 | 只列 config struct | 按运行入口、store、source、backend、publisher、worker/job、projection、policy、security、clock/id 组织控制面 | 配置设计要面向行为控制,不只是字段列表 |
| 下游影响 | 未集中说明 | 明确 `05/06/07/09` 如何承接控制面 | 保持文档链路可追溯 |

---

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：每个入口各自读取配置 | 启动代码直观 | API、worker、jobs 容易出现不同覆盖顺序和校验规则 | 不采用 |
| 方案 B：`infra` 统一 loader / validator / builder,入口只消费 `RuntimeGraph` 或入口 config | 配置来源、校验和禁止边界集中,可测试和可审计 | 需要在 runtime builder 中维护装配图 | 采用 |
| 方案 C：完全只依赖代码默认值,不提供文件和 env 覆盖 | 最简单 | 无法支撑 profile、测试矩阵、部署和后续生产 adapter | 不采用 |
| 方案 D：P0 直接接入 config center | 接近生产治理 | 会改变 loader 生命周期和可用性假设,超出 P0 | 不采用 |

推荐方案 B。

原因:

- `L0-bus` 的配置影响面跨 API、worker、jobs、adapter、store、projection 和 policy,必须集中校验。
- 禁止配置化边界需要由 `ConfigValidator` 和 `RuntimeBuilder` 统一拦截,不能分散到各入口。
- P0 仍可通过 code defaults + JSON + env + secret ref 支撑本地和 CI,不需要远程配置中心。

---

## 7. 结构化中间产物

### 7.1 配置来源链图: L0-bus 配置覆盖链

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
[secret refs / connection refs]
  |
  v
[validated runtime config]
```

关键说明:

- 该图表达配置来源类别和大致覆盖方向,具体优先级、冲突处理和不可用策略由 Step 5 定义。
- JSON 是默认配置文件格式;完整 JSON demo 由 Step 7 定义。
- secret / connection 只以 reference 形式出现,不得把 raw secret 写入配置正文。
- config center / remote config 不进入 P0 来源链,只保留 P1/P2 演进入口。

### 7.2 配置装配总图: L0-bus runtime 装配路径

```text
Config sources
  |
  v
ConfigLoader
  |
  v
RuntimeConfig
  |
  v
ConfigValidator
  |-- reject forbidden boundary override
  |-- reject raw secret
  |-- reject invalid profile combination
  v
ValidatedRuntimeConfig
  |
  v
RuntimeBuilder
  |
  +-- API handlers
  +-- Worker handlers
  +-- Operations jobs
  +-- Repositories / UnitOfWork
  +-- Transport backend adapter
  +-- Outbox source adapter
  +-- Outbox publisher adapter
  +-- Projection adapter
  +-- Runtime policy set
  v
RuntimeGraph
```

关键说明:

- 该图表达配置如何进入 runtime,不表达业务处理流程。
- `RuntimeGraph` 是启动 API、worker、jobs 和测试 fixture 的装配结果。
- `domain` 不直接读取配置;policy 由 runtime / application 通过已校验配置构造。
- 禁止配置化边界必须在 validator 和 builder 阶段同时保护。

### 7.3 配置控制面总表

| 控制面 | 作用 | 对应模块 | 是否 P0 |
|---|---|---|---|
| Runtime assembly | 聚合配置来源、校验和 runtime graph 装配 | `infra::config` / `infra::runtime_builder` | 是 |
| API entry profile | 控制 API 入口启用、timeout、request boundary、handler profile | `api` | 是 |
| Worker entry profile | 控制 delivery / signal / timeout worker 的启用、batch、timeout、retry category | `worker` | 是 |
| Operations job profile | 控制 outbox relay、retry、projection、backend capability job 的 batch、cursor、checkpoint | `jobs` | 是 |
| Store profile | 控制 bus truth、history、audit、DLQ、idempotency、projection 的 store adapter | `infra::repositories` / `infra::uow` | 是 |
| Outbox source profile | 控制 committed outbox fact 的 source、cursor、ack 和 fixture source | `infra::outbox::source` | 是 |
| Transport backend profile | 控制 in-memory backend、后续 backend profile、capability、timeout 和 secret ref | `infra::transport` | 是 |
| Outbox publisher profile | 控制 outbound event publisher、in-memory sink、publish timeout 和 retry category | `infra::outbox::publisher` | 是 |
| Projection profile | 控制 read-only output store、rebuild mode、stale marker 和 consistency marker | `infra::projection` / `jobs` | 是 |
| Recovery policy profile | 控制 retry、DLQ、replay preparation 的策略引用和边界 | `application` policy factory / `jobs` | 是 |
| Security boundary profile | 控制 secret ref、privileged operation ref、forbidden body 和 redaction | `infra::config` / adapter constructor | 是 |
| Clock / id generator profile | 控制 system / deterministic fake clock 和 ID 生成方式 | `infra::technical` / tests | 是 |
| Config center source | 远程配置来源和热更新入口 | 后续 infra extension | 否,P1/P2 |
| Production adapter product fields | MQ / DB / KMS 产品字段全集 | 后续 adapter / ops | 否,P1/P2 |

### 7.4 模块读取边界表

| 模块 | 直接读取配置 | 可接收的配置结果 | 关键限制 |
|---|---|---|---|
| `contracts` | 否 | 无 | 不绑定运行环境 |
| `domain` | 否 | 已校验值、policy 判断结果 | 不依赖 `RuntimeConfig` |
| `application` | 否 | port、policy set、service dependency | 不解析 JSON / env |
| `infra` | 是 | `RuntimeConfig` / `ValidatedRuntimeConfig` | 负责统一校验和 adapter 构造 |
| `api` | 入口级 | `ApiConfig` / handler graph | 不绕过 `ConfigValidator` |
| `worker` | 入口级 | `WorkerConfig` / worker graph | 不把 worker 参数写入 domain |
| `jobs` | 入口级 | `JobConfig` / job graph | 不绕过 recovery / projection policy |
| `tests` | 测试级 | fixture / in-memory config | 不把测试便利项升级为生产默认 |

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 3 建立配置来源链和控制面总览,不新增配置字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| 主装配路径采用 `ConfigLoader -> ConfigValidator -> RuntimeBuilder -> RuntimeGraph` | 否 | 与 `03` §13 和 Step 14 中间产物一致 | 无 | 无回写 |
| contracts / domain 不读取配置,application 间接受影响,infra / api / worker / jobs / tests 受控读取 | 否 | 与 `03` §13 绑定点一致 | 无 | 无回写 |
| config center / remote config 不进入 P0 来源链 | 否 | 范围裁剪,不改变 `03` 代码契约 | 无 | 无回写 |

说明:

- 本步只建立控制面视图,没有新增 `RuntimeConfig` 字段。
- Step 5 会继续定义来源优先级和冲突处理;Step 7 才会定义配置项清单。

---

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §3。

```md
## 3. 配置控制面总览

> 校准来源：
> - `design-calibration/04_config_step_03_control_plane_overview.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“配置来源链图”“配置装配总图”“配置控制面总表”和“对详细设计的影响判定”小节，了解本章如何建立配置控制面总览。

L0-bus 的配置控制面以 `RuntimeConfig` 为根对象,经由 `ConfigLoader`、`ConfigValidator` 和 `RuntimeBuilder` 进入 runtime。配置来源包括 code defaults、JSON config file、environment overrides、secret refs / connection refs 和局部 CLI args。config center / remote config 不进入 P0 默认来源链,仅作为 P1/P2 演进入口。

配置进入 runtime 的主路径为：

```text
Config sources
  -> ConfigLoader
  -> RuntimeConfig
  -> ConfigValidator
  -> ValidatedRuntimeConfig
  -> RuntimeBuilder
  -> RuntimeGraph
```

`contracts` 和 `domain` 不读取配置。`application` 只接收已构造 port、policy set 和 service dependency,不解析 JSON 或环境变量。`infra` 负责配置加载、校验和 runtime builder。`api`、`worker`、`jobs` 只在入口边界接收已校验的入口配置和 runtime graph。

P0 配置控制面包括 runtime assembly、API entry profile、worker entry profile、operations job profile、store profile、outbox source profile、transport backend profile、outbox publisher profile、projection profile、recovery policy profile、security boundary profile、clock / id generator profile。

配置只控制运行装配、profile、adapter、source、publisher、projection、policy ref、secret ref、batch、timeout、cursor 和测试可复现性。配置不得控制或绕开以下领域不变量：保存 payload body、保存 raw secret、关闭关键 audit / history、projection 反写 truth、replay 绕过 DLQ / history / audit chain、backend raw status 直接写入 `DeliveryStatus`、业务幂等替代 bus 幂等。

本章未发现需要回写 `03-详细设计.md` 的配置结论。
```

---

## 10. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| P0 来源链是否包含 config center / remote config | A. 包含;B. 不包含,只保留 P1/P2 演进入口;C. 完全不提 | 推荐 B | P0 应保持可本地和 CI 验证,remote config 会改变 loader 生命周期 |
| CLI args 是否作为全局配置来源 | A. 是;B. 否,只作为 operations job 局部输入;C. 不允许 CLI args | 推荐 B | 避免 CLI 覆盖全局配置导致来源混乱,但 job 需要局部运行参数 |
| API / worker / jobs 是否允许各自绕过 `ConfigValidator` 读取 env | A. 允许;B. 不允许,只能接收已校验配置;C. 测试环境允许 | 推荐 B | 保持配置校验集中,防止入口语义漂移 |

---

## 11. 进入下一步条件

- [x] 配置来源链图已形成。
- [x] 配置装配总图已形成。
- [x] 配置控制面总表已形成。
- [x] 模块读取边界已明确。
- [x] 本步无需回写 `03-详细设计.md`。
- [x] Step 3 状态从 `[~]` 更新为 `[x]`。
