# Step 1. 确认配置输入边界

> 本文件是 `projects/L0-sdk/04-配置设计.md` 的 Step 1 中间产物。
> 本步只确认配置设计需要承接哪些上游输入、哪些内容不再由配置设计回答、哪些缺口需要进入后续 Step。
> 本步不创建正式 `04-配置设计.md`,不提前定义完整 JSON schema,不回写 `03-详细设计.md`。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 1
- 回填章节：`projects/L0-sdk/04-配置设计.md` §1 与上游文档的关系声明

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` | `L0-sdk` 的官方三语言客户端接入层定位、目标 / 非目标、使用方、依赖、核心能力闭环、功能需求、数据归属和边界规则 | 确认配置设计只能服务 SDK source、boundary、runner、package candidate、evidence、compatibility、redaction 和 credential 控制面,不能重定义 core / bus / service truth |
| `01-架构设计.md` | `L0-sdk` 与 `L0-core`、`L0-bus`、formal API、fake / fixture target、语言包、文档示例、下游调用方的职责边界和依赖方向 | 确认配置只能影响运行装配、profile、adapter、runner、artifact、projection、outbox 和 policy,不能把 SDK 配置成 gateway、auth provider、bus runtime 或服务端聚合层 |
| `02-概要设计.md` | 代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态机和配置影响轮廓 | 确认哪些主要部分受配置影响,哪些禁止配置化边界必须由 `ConfigValidator` 和 builder 守住 |
| `03-详细设计.md` | Rust workspace、crate / module、`SdkRuntimeConfig`、`ConfigLoader`、`ConfigValidator`、`SdkRuntimeBuilder`、配置引用表、外部依赖绑定和配置禁止项 | 固定配置设计的主要事实源,尤其是 §13 的配置引用、依赖注入链、运行期 adapter 绑定和跨仓本地 path dependency |
| `05-测试方案.md` | 当前尚未按新版 `04` 重校准的测试方向 | 只作为 Step 12 的下游承接参考;不作为配置事实源 |
| `06-验收标准.md` | 当前尚未按新版 `04` 重校准的验收方向 | 只作为 Step 12 的下游承接参考;不作为配置事实源 |

已确认结论:

```text
L0-sdk 是官方三语言客户端接入层,不是 core 契约真相仓、bus runtime、L1+ 服务端聚合层、auth / governance provider、UI 组件库或公共 registry 运营仓。
配置设计必须承接 03 中的 SdkRuntimeConfig / ConfigLoader / ConfigValidator / SdkRuntimeBuilder / adapter binding,继续说明配置来源、优先级、profile、JSON 示例、密钥边界、加载校验和失败策略。
正式配置设计只承接上游设计,不重新定义 Rust struct、enum、trait、function、DTO、状态机、协议 schema 或事务语义。
```

## 3. SOP 问题回答

### 3.1 当前配置设计要承接哪些需求、非功能、安全和环境差异?

需要承接 `00-需求文档.md` 中的官方客户端接入层定位、Rust / Python / TypeScript 三语言一致性目标、`L0-core` / `L0-bus` truth 消费关系、formal API / fake boundary、package candidate、验证证据、兼容演进、文档示例和多消费者接入路径。

非功能和安全方面需要承接:

- trace propagation、error mapping、redaction 和 credential protection 必须跨语言一致。
- SDK 不保存业务正文、事件 payload 正文、生产 request / response body、观测正文、UI / runtime 状态正文或凭据正文。
- fake / fixture success 必须带 fake marker,不能被配置成 production success。
- package candidate 的 verified / stable 门禁不能被配置绕过。
- compatibility breaking / rejected 不能通过配置关闭。
- stale / unknown / unsupported 不能通过配置伪装成 fresh / supported。
- SDK 不能通过配置变成 auth provider、gateway、governance decision maker、bus runtime 或 public release manager。

环境差异方面需要承接:

- local / CI 使用 local sibling repo、fixture source、fake endpoint、in-memory 或 local filesystem store、local runner 和 explicit fake marker。
- integration / test 需要可控 source snapshot、boundary target、smoke runner、docs runner、compatibility runner、artifact root、report root 和 projection rebuild profile。
- production-like 后续可能接入 formal API endpoint、bus endpoint、secret provider、artifact store、outbox sink 和 projection store,但 P0 不要求完整公共 registry 发布或生产 endpoint 矩阵。
- 不同语言 package 可以有不同 packaging profile,但不能形成不同平台语义。

### 3.2 详细设计中哪些配置引用、runtime builder、adapter 或外部依赖需要进入配置设计?

必须进入配置设计的详细设计输入包括:

- `SdkRuntimeConfig.store`、`SdkRuntimeConfig.sources`、`SdkRuntimeConfig.boundaries`。
- `SdkRuntimeConfig.runners`、`SdkRuntimeConfig.artifacts`、`SdkRuntimeConfig.outbox`。
- `SdkRuntimeConfig.projections`、`SdkRuntimeConfig.language_packages`、`SdkRuntimeConfig.policies`。
- `SdkRuntimeConfig.cli`、`SdkRuntimeConfig.jobs`。
- `ConfigLoader`、`ConfigValidator`、`SdkRuntimeBuilder`、`SdkRuntimeHandle`。
- source adapter builder、boundary adapter builder、runner adapter builder、artifact store builder、projection / outbox adapter builder 和 policy factory。
- `core-contracts` 与 `bus-contracts` 的本地 path dependency。
- formal API boundary、fake / fixture endpoint、bus event boundary、language generator、package builder、smoke / docs / compatibility / boundary verifier、artifact store、repository、projection 和 outbox 的运行期绑定。

配置设计需要继续回答这些配置从哪里来、如何覆盖、如何按 profile 生效、哪些是必填、哪些禁止配置化、失败如何处理。

### 3.3 哪些测试和验收场景依赖配置矩阵?

后续测试和验收至少依赖以下配置矩阵:

| 场景 | 依赖的配置维度 |
|---|---|
| runtime bootstrap 默认路径 | store、sources、boundaries、runners、policies、cli profile |
| source snapshot refresh | core source、bus source、formal API source、freshness threshold、snapshot ref |
| fake / fixture 最小接入 | fake endpoint profile、fake marker、boundary guard、artifact / report root |
| formal API 调用封装 | endpoint ref、transport profile、timeout / retry profile、credential ref、redaction policy |
| bus event client view | bus endpoint、subscription profile、event boundary adapter、outbox sink |
| language package build | Rust / Python / TypeScript package profile、generator profile、artifact output root |
| smoke / docs / compatibility validation | runner profile、fixture target、docs example target、compatibility baseline、report root |
| package candidate gate | evidence store、artifact refs、compatibility decision、redaction status、stable gate |
| projection and query | projection store、rebuild profile、pagination profile、consistency marker |
| security lower bound | redaction、credential protection、secret ref、forbidden raw body rejection |

当前 `05-测试方案.md` 和 `06-验收标准.md` 后续需要基于新版 `03/04` 重新校准,尤其是配置校验、fake marker、安全下限、artifact / report、runner profile 和 package candidate gate。

### 3.4 哪些内容不应在配置设计中重新定义?

配置设计不应重新定义:

- 需求目标、用户故事、功能需求和验收标准。
- 系统上下文、限界上下文、职责边界、依赖方向和架构取舍。
- Rust workspace、crate、module、file layout 和 package directory layout。
- struct / enum / value object / trait / port / adapter / DTO / error 的正式代码契约。
- snapshot freshness、capability support、package candidate、verification evidence、compatibility 和 deprecated API 的状态机。
- Command / Query / Event / Operations Job 的协议 schema、HTTP path、topic 命名和函数流。
- 具体测试用例、fixture、coverage、CI gate、report / artifact 格式全集。
- 实施阶段、commit boundary、git 配置、开发目录和提交规范。
- 公共 registry 发布、部署命令、生产 endpoint 矩阵和值班流程。

如果配置设计发现必须改变上述代码契约,应先进入详细设计回写清单。

### 3.5 当前上游是否存在会阻塞配置设计的缺口?

不存在阻塞 Step 1~Step 2 的缺口。`00~03` 已足够支撑配置设计启动。

但存在后续必须收口的缺口:

- 正式 `04-配置设计.md` 尚未创建。
- 当前没有完整 JSON 配置示例、模块级 demo、逐项说明表和完整 JSONC 文档示例。
- 还没有配置来源优先级、冲突处理、环境 / profile 矩阵。
- 还没有敏感配置、secret ref、credential ref 和禁止输出边界的正式配置说明。
- 还没有配置加载、校验、生效、变更、审计、回滚和失效策略。
- `05-测试方案.md` 和 `06-验收标准.md` 需要在 `04` 完成后按新版配置控制面重校准。
- `/home/aris/Projects/quantalithos-sdk` 目标实现仓状态、`quantalithos-core` 与 `quantalithos-bus` 本地 path dependency 需要在 `07` 前确认。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `projects/L0-sdk/04-配置设计.md` | 文件尚未创建 | SDK runtime、CLI、jobs、adapter、runner、artifact、outbox、projection 和 policy 的配置控制面无法被测试、验收、实施和运维共同引用 |
| `projects/L0-sdk/03-详细设计.md` §13 | 已定义 `SdkRuntimeConfig` 入口、配置绑定点和依赖绑定,但没有定义 JSON 示例、来源优先级、profile、配置项清单、密钥策略和失效策略 | 实现者知道“有哪些配置对象”,但不知道“配置如何填写、覆盖、校验和失败” |
| `projects/L0-sdk/02-概要设计.md` §11 | 已识别配置影响轮廓和禁止配置化边界,但没有给出模块级配置 demo 和完整配置示例 | 可以指导 03 建立配置入口,但不足以指导 04 的配置项落地 |
| `projects/L0-sdk/05-测试方案.md` | 尚未按新版 `04` 重新校准 | 不能直接作为新版配置测试矩阵事实源 |
| `projects/L0-sdk/06-验收标准.md` | 尚未按新版 `04` 重新校准 | 不能直接作为新版配置验收门禁事实源 |
| `projects/L0-sdk/design-calibration/03_ddd_step_18_risks_open_questions.md` | 已记录配置设计缺失会导致实施阶段脑补 JSON、env 和 profile | 本轮必须补齐配置设计,否则 `07` 不能可靠安排 config loader 和 profile 实施 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置设计入口 | 配置内容停留在 `03-详细设计.md` §13 的代码绑定点 | 新增独立配置设计校准流程,最终产出 `04-配置设计.md` | 配置是运行、测试、验收、实施和运维共同引用的控制面 |
| 上游承接 | 可能直接从 `SdkRuntimeConfig` 表扩写 | 明确从 `00/01/02/03` 承接边界,`05/06` 只作下游参考 | 防止把测试方向、部署猜测或旧配置说法写成配置事实 |
| 详细设计关系 | 只知道 04 承接 03 | 每个 Step 显式判断是否影响 03 | 防止在 04 中静默新增 config 字段、adapter 参数、trait 或 error |
| SDK 特有配置面 | 尚未系统收敛 source、boundary、runner、artifact、outbox、projection、language package、policy、CLI、jobs | 明确这些都是后续配置设计必须回答的输入边界 | SDK 配置面横跨三语言 package、验证证据和运行期 adapter,不能只写单一 runtime 配置 |
| 下游关系 | `05/06` 尚未按新版配置控制面重校准 | 先由 04 提供配置矩阵,后续再重校准 05/06 | 测试验收应承接配置设计,不是反向发明配置 |
| 非范围 | 容易把协议 schema、测试用例、发包命令和公共 registry 运营写进配置 | 明确 04 不写这些内容 | 保持配置设计层次清晰 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：只在 `03-详细设计.md` §13 继续补配置 | 改动少,靠近 `SdkRuntimeConfig` 代码契约 | 无法系统表达配置来源、profile、JSON demo、密钥、变更审计、失效策略和下游测试矩阵 | 不采用 |
| 方案 B：新增正式 `04-配置设计.md`,按 SOP 逐 Step 收敛 | 配置控制面清晰,能支撑 05/06/07/09,也能防止实施脑补配置 | 需要额外维护 15 个 Step 中间产物 | 采用 |
| 方案 C：等实施阶段再设计配置 | 当前文档推进快 | 实现者会自行定义 JSON / env / CLI / secret / profile 策略,跨语言和跨仓口径容易漂移 | 不采用 |

推荐方案 B。

原因:

- `L0-sdk` 同时有 source、boundary、runner、artifact、outbox、projection、language package、policy、CLI 和 jobs,配置面较宽。
- 详细设计只应定义代码绑定点,配置设计才负责填写方式、来源优先级、环境矩阵、密钥和失败策略。
- 后续测试、验收和实施都依赖配置矩阵,必须先有独立 `04`。

## 7. 结构化中间产物

### 7.1 上游输入映射表

| 来源文档 | 配置输入 | 回填章节 |
|---|---|---|
| `00-需求文档.md` | 官方三语言客户端接入层、`L0-core` / `L0-bus` truth 消费、formal API / fake boundary、package candidate、验证证据、兼容演进、安全与可追踪默认 | §1 / §2 / §4 / §6 / §8 / §11 |
| `01-架构设计.md` | SDK 与 core / bus / formal API / fake target / language package / docs runner /下游调用方的边界、依赖方向和运行期协作 | §1 / §3 / §4 / §5 / §6 |
| `02-概要设计.md` | 主要组成部分、配置影响轮廓、禁止配置化边界、受配置影响的 adapter / job / runner / projection / policy | §3 / §4 / §7 / §9 |
| `03-详细设计.md` | `SdkRuntimeConfig`、子 config、`ConfigLoader`、`ConfigValidator`、`SdkRuntimeBuilder`、配置绑定点、外部依赖绑定、跨仓本地 path dependency、禁止配置化校验 | §3 / §5 / §7 / §8 / §9 / §11 |
| `05-测试方案.md` | 配置相关测试方向,需要等待新版 `04` 输出配置矩阵后重校准 | §12,仅作下游承接参考 |
| `06-验收标准.md` | 配置相关验收方向,需要等待新版 `04` 输出配置门禁后重校准 | §12,仅作下游承接参考 |

### 7.2 不再回答的问题清单

| 问题 | 交给哪份文档 / 哪一层 |
|---|---|
| Shared DTO、ErrorCode、TraceContext、Metadata、CloudEvents 和 envelope 如何定义 | `L0-core` |
| Publication、delivery、feedback、retry、DLQ、replay 和 tap 语义如何定义 | `L0-bus` |
| `SdkRuntimeConfig`、子 config、`ConfigError`、trait、adapter constructor 的正式代码契约如何定义 | `03-详细设计.md` |
| Command / Query / Event / Job 的协议字段、Rust DTO 和函数流如何定义 | `03-详细设计.md` |
| SDK 状态机和事务 / 幂等语义如何实现 | `03-详细设计.md` |
| 测试用例、fixture、coverage、CI gate、report / artifact 格式如何组织 | `05-测试方案.md` |
| 什么配置结果算验收通过或失败 | `06-验收标准.md` |
| 实施批次、commit boundary、开发目录、git config 和提交规范如何安排 | `07-实施计划.md` |
| 生产 endpoint 矩阵、公共 registry 发布、部署命令和值班流程如何执行 | 发布专项或部署与运维手册 |
| auth / identity / gateway / governance decision 如何产生 | 对应安全入口、identity、gateway 或 governance 仓 |

### 7.3 配置设计必须回答的问题清单

| 问题 | 目标章节 |
|---|---|
| L0-sdk 有哪些配置控制面,配置如何进入 `SdkRuntimeBuilder` | §3 |
| 哪些配置允许改变运行装配,哪些行为禁止配置化 | §4 |
| 配置来源有哪些,按什么优先级覆盖,冲突如何处理 | §5 |
| local / CI / test / integration / production-like profile 有哪些差异 | §6 |
| 每个 P0 配置项的名称、类型、默认值、必填性、来源、作用域、生效方式、敏感级别和失败策略是什么 | §7 |
| 模块级 JSON demo、逐项说明表和完整 JSONC 文档示例如何组织 | §7 |
| secret ref、credential ref、endpoint ref 和敏感配置如何存储、读取、轮换、审计和脱敏 | §8 |
| 配置如何加载、解析、校验、装配、冷更新或热更新 | §9 |
| 配置变更如何评审、审计和回滚 | §10 |
| 配置缺失、非法、冲突、不可达、过期或漂移时如何 fail-fast / fail-closed / degraded | §11 |
| 配置设计如何交付给测试、验收、实施和运维 | §12 |
| 配置如何新增、废弃、迁移和演进 | §13 |

### 7.4 配置输入边界图

#### 配置来源链图: L0-sdk 配置输入边界

```text
00 Requirements
  |  official client layer / goals / non-goals / safety boundaries
  v
01 Architecture
  |  context / dependency direction / runtime collaboration / ownership
  v
02 High-level design
  |  components / objects / flows / states / configuration impact
  v
03 Detailed design
  |  SdkRuntimeConfig / ConfigLoader / ConfigValidator / SdkRuntimeBuilder
  v
04 Configuration design
  |  source priority / profiles / config items / secrets / validation / failure modes
  v
05 Tests + 06 Acceptance + 07 Implementation + 09 Ops
```

关键说明:

- 图表达 `04` 的输入来源和输出承接方向,不表达部署命令或代码调用顺序。
- `04` 以 `00~03` 为事实输入,不直接从未重校准的 `05/06` 反推配置事实。
- `03` 定义代码绑定点,`04` 定义配置控制面和填写 / 校验 / 失效规则。
- 如果 `04` 发现需要改变 `03` 代码契约,必须先回写 `03`。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 1 只确认 `04-配置设计.md` 的上游输入边界 | 否 | 无代码契约变化 | 无 | 无回写 |
| 当前 `05/06` 只作为下游承接方向参考,不作为配置事实源 | 否 | 下游文档校准关系 | 无 | 无回写 |
| 本步不新增 `SdkRuntimeConfig` 字段、不改变 `ConfigLoader` / `ConfigValidator` / `SdkRuntimeBuilder` 签名、不新增 `ConfigError` 枚举值 | 否 | 无代码契约变化 | 无 | 无回写 |

说明:

- 本步没有发现必须立即回写 `03-详细设计.md` 的配置结论。
- 后续 Step 如果决定新增 runtime config 字段、拆分 config struct、改变 adapter constructor 参数、新增配置错误类型或改变配置加载流程,必须在对应 Step 标记为 `待回写`。

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §1。

```md
## 1. 与上游文档的关系声明

> 校准来源：
> - `design-calibration/04_config_step_01_upstream_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“对详细设计的影响判定”“回填草稿”和“待确认事项”小节，了解本章配置设计输入边界如何从上游文档收敛而来。

本配置设计承接 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 与 `03-详细设计.md`。

`00-需求文档.md` 确定 `L0-sdk` 是 Quantalithos 面向内部产品、AI runtime、运维脚本和第三方开发者的 Rust / Python / TypeScript 三语言官方客户端接入层。配置设计不得把它扩展为 core 契约真相仓、bus runtime、L1+ 服务端聚合层、auth / governance provider、UI 组件库或公共 registry 运营仓。

`01-架构设计.md` 确定 SDK 与 `L0-core`、`L0-bus`、formal API、fake / fixture target、语言包、文档示例和下游调用方的职责边界。配置设计只能控制运行装配、profile、adapter 选择、source / boundary / runner / artifact / outbox / projection / policy 等接缝,不能通过配置绕开上游 truth、安全红线、状态机、验证证据、兼容治理和只读输出边界。

`02-概要设计.md` 确定代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态机和配置影响轮廓。配置设计继续展开受配置影响的 source、boundary、runner、artifact、outbox、projection、language package、policy、CLI 和 jobs,但不让 domain object 或 application service 直接读取 raw config。

`03-详细设计.md` 确定 `SdkRuntimeConfig`、`ConfigLoader`、`ConfigValidator`、`SdkRuntimeBuilder`、`SdkRuntimeHandle`、adapter / runner / store / projection / outbox / policy factory 绑定和外部依赖绑定。配置设计只承接这些实现契约,不重新定义 Rust struct、enum、trait、function、DTO、状态机、协议 schema 或事务语义。

本章未发现需要立即回写 `03-详细设计.md` 的配置结论。后续章节若改变 runtime config、builder、adapter、trait、error 或函数流,必须先进入详细设计回写清单并完成回写后再定稿。

`05-测试方案.md` 与 `06-验收标准.md` 当前作为下游承接方向参考。配置设计完成后应把配置矩阵、配置错误场景、fake marker、安全下限、artifact / report、runner profile 和 package candidate gate 回流给测试与验收文档继续校准。
```

## 10. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 是否接受本轮配置设计先以新版 `00/01/02/03` 为主输入,暂不把当前 `05/06` 作为配置事实源 | A. 接受;B. 同时承接当前 `05/06`;C. 先重写 `05/06` 再做配置 | 推荐 A | 配置设计应先基于新版设计主链形成事实源,再反向支撑 `05/06` 重校准 |
| 是否接受正式配置文档统一命名为 `04-配置设计.md` | A. 接受;B. 改为配置说明;C. 同时维护两份 | 推荐 A | standards 主链和 SDK 文档元信息已使用配置设计口径,避免后续交叉引用漂移 |
| 是否接受正式 `04-配置设计.md` 只在 Step 15 统一创建 | A. 接受;B. 每个 Step 直接改正式文档;C. 先创建空正式文档并逐步填 | 推荐 A | 符合配置 SOP,能避免未确认内容进入正式文档 |
| 是否接受本步不回写 `03-详细设计.md` | A. 接受;B. 先扩写 `03` 配置章节;C. 等 Step 7 后再判断 | 推荐 A | Step 1 只确认输入边界,没有改变代码契约;后续若发现字段或签名缺口再回写 |

## 11. 进入下一步条件

- [x] 配置设计以上游 `00/01/02/03` 为主输入。
- [x] 当前 `05/06` 仅作为下游方向参考,不作为配置事实源。
- [x] 正式配置文档统一命名为 `04-配置设计.md`。
- [x] 正式 `04-配置设计.md` 在 Step 15 统一整理。
- [x] 本步无需回写 `03-详细设计.md`。
- [x] Step 1 状态从 `[~]` 更新为 `[x]`。
