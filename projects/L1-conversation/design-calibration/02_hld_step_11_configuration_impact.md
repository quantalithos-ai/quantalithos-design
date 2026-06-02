# Step 11. 配置影响轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 11
> 回填章节: `02-概要设计.md` §11 配置影响轮廓
> 生成日期: 2026-06-01
> 状态: 已完成

---

## 1. 本步目标

在主要组成部分、对象、接口、处理流、状态机和异常边界已收稳的前提下,识别 `L1-conversation` 哪些概要层结构会受到配置影响,哪些边界禁止配置化,以及哪些配置实现契约需要交给 `03-详细设计.md` 继续展开。

本步只写概要设计层配置影响轮廓。本步不写配置项清单、默认值、JSON 示例、环境变量名、密钥名称、`ConversationRuntimeConfig` 字段全集、`ConfigError` 枚举全集、adapter constructor 完整参数或配置加载实现。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_03_constraints.md` | 已完成 | 提供配置不可越界约束 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供运行承载、入口、application service、port、store、projection、outbox 和 operations 分层 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供 8 个主要组成部分和职责边界 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供 Command、Query、Consumer、Event 和 Operations Job 接口骨架 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供同步、异步和后台 Job 的处理流 |
| `02_hld_step_09_state_machine.md` | 已完成 | 提供禁止配置化的状态机红线 |
| `02_hld_step_10_exceptions_boundaries.md` | 已完成 | 提供异常场景中可能受配置影响的 projection、reference、handoff 和 outbox 口径 |
| `01-架构设计.md` §7 / §8 / §13 | 已完成 | 提供运行承载、依赖方向和配置不可绕过边界 |

---

## 3. SOP 问题回答

### 3.1 哪些主要组成部分、入口、adapter、job、worker 或外部接缝会受到配置影响？

会受到配置影响的结构主要集中在运行装配、外部接缝、持久化 / 派生承载和后台 Job:

- Inbound 入口:command intake、query intake、event intake、job runner 的运行 profile、adapter 装配和 metadata / auth 接入方式会受配置影响。
- Persistence / projection / snapshot / outbox store:truth store、projection store、snapshot store、outbox store 的技术承载会受配置影响。
- External ports:Actor / Identity、Work、Governance、Artifact、Runtime、Bridges、Bus、Observability、Archive 等外部接缝 endpoint、timeout、secret ref 会受配置影响。
- Operations Jobs:outbox 发布、read model / search / cursor 重建、reference refresh、trace / archive handoff、consistency validation 和 cursor cleanup 的 batch size、retry、timeout 或执行 profile 会受配置影响。
- Derived support:projection 是否启用、搜索投影承载、reference refresh 承载可以受配置影响,但不得改变 truth 成立。

### 3.2 哪些模块只能间接受配置影响，不能直接读取配置？

Domain Model、Domain Policy、状态机对象和核心 Application Service 只能通过构造期注入的 port / repository / clock / id generator / config-derived policy 参数间接受配置影响,不得直接读取配置文件、环境变量或密钥系统。

尤其是以下对象不能直接读取配置:

- `ConversationTruthState`、`ConversationSpace`、`ParticipantScope`、`VisibilityScope`
- `ConversationFact`、`CrossDomainManifestation`、`ConversationTraceContext`
- `ConversationTruthPolicy`、`VisibilityPolicy`、`FactAppendPolicy`、`ManifestationPolicy`、`ReferenceValidityPolicy`、`DerivedViewPolicy`、`TraceRetentionPolicy`
- `ConversationProjectionState`、`ReferenceResolutionState`、`ConversationChangeCursor`

### 3.3 哪些领域规则、状态机、审计链、事务一致性或安全门禁禁止配置化？

禁止配置化的边界包括:

- Conversation truth 归属和来源仓 truth 不转移。
- forbidden body 排除规则。
- participant / visibility 授权视野。
- projection / snapshot / search / cursor 不反写真相。
- outbox / handoff 失败不回滚 truth。
- 状态机禁止迁移,例如 `Closed -> Open`、`Retracted -> Accepted`、`Invalid -> Fresh`、`Failed -> Fresh without rebuild`。
- 事实追加、显化、trace、scope change 和 outbox 的可追溯要求。
- 核心成立强一致与传播 / 派生 / 交接最终一致的分工。
- 幂等重复与幂等冲突必须区分。

### 3.4 哪些配置影响需要在 03-详细设计中继续定义实现契约？

`03-详细设计.md` 需要继续定义:

- `ConversationRuntimeConfig` 的边界和分层,但字段全集留到配置设计。
- `ConfigLoader`、`ConfigValidator`、`ConfigError` 的骨架和注入方式。
- inbound adapters、external ports、repositories、projection stores、outbox publisher、handoff ports、operations jobs 的 `AdapterConfig` / `JobConfig` 方向。
- runtime builder 如何把配置解析结果注入 application services,并保证 domain object / policy 不直接读配置。
- 配置校验失败如何阻止启动或降级运行,但不得绕过领域红线。

### 3.5 哪些配置细节属于 04-配置说明，不能在概要设计中提前展开？

以下内容属于 `04-配置说明` 或配置设计,不进入本步:

- JSON 配置示例、完整配置项清单、默认值、路径和命名。
- 每个 adapter 的 endpoint、timeout、secret ref、batch size、retry 参数的具体字段。
- 本地开发、测试、生产 profile 的完整配置示例。
- 配置文件加载顺序、环境变量映射、密钥系统集成和部署挂载方式。
- 配置变更、热更新、回滚和运维操作流程。

---

## 4. 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| `Conversation 同步入口` / command intake | 是 | profile、external endpoint、timeout、secret ref | 定义 inbound adapter config、metadata / auth adapter 注入、启动校验和 command intake 构造关系 |
| `Conversation 查询入口` / query intake | 是 | profile、external endpoint、timeout、secret ref | 定义 query adapter config、read consistency marker 装配和 visibility guard 注入关系 |
| `Conversation 异步输入` / event intake | 是 | external endpoint、profile、retry、timeout | 定义 inbound event consumer adapter config、event idempotency 装配和 source event validation 入口 |
| `Conversation 后台派生维护` / operations runner | 是 | batch size、retry、timeout、profile | 定义 JobConfig、runner 构造、job metadata 注入和失败 marker 形成边界 |
| `Conversation truth core` | 间接受影响 | store root、profile | 只通过 repository / unit of work 注入受影响;domain truth object 和 truth policy 不直接读配置 |
| `Space / scope management` | 间接受影响 | profile、store root | application service 可通过 repository / clock / id generator 装配受影响;scope invariant 不可配置化 |
| `Collaborative fact append` | 间接受影响 | store root、profile | 只通过 fact history repository、idempotency store 和 source resolver port 装配受影响 |
| `Authorized consumption` | 是 | store root、profile、timeout、feature policy | 定义 read model / cursor / search query adapter、projection fallback 和 degraded marker 的实现契约 |
| `Cross-domain manifestation` | 是 | external endpoint、timeout、secret ref、profile | 定义 Work / Governance / Artifact / Runtime / Bridges reference resolver port config 和 snapshot resolver 注入 |
| `History trace / review` | 是 | external endpoint、secret ref、timeout、retry | 定义 observability / archive handoff adapter config、handoff payload redaction 校验和 failed marker 形成 |
| `Derived consumption support` | 是 | feature policy、batch size、retry、timeout、store root | 定义 projection rebuild、search index、cursor maintenance、consistency validation 的 JobConfig 和 store config |
| `Local reference / snapshot / projection support` | 是 | external endpoint、timeout、secret ref、batch size | 定义 external reference snapshot store、reference refresh job 和 source resolver adapter config |
| `ConversationTruthRepository` / truth store | 是 | store root、profile、secret ref | 定义 persistence config、connection / store builder、migration / validation 入口 |
| `ConversationProjectionRepository` / projection store | 是 | store root、profile、feature policy | 定义 projection store config、disabled / failed projection 的读取 fallback 契约 |
| `ConversationOutboxRepository` / outbox publisher | 是 | store root、batch size、retry、timeout、external endpoint | 定义 outbox store config、publisher adapter config、suppressed / failed marker 形成 |
| `BusEventPort` | 是 | external endpoint、secret ref、timeout、retry | 定义 bus adapter config,但不得改变 outbox 从已提交 truth 产生的原则 |
| `TraceHandoffPort` | 是 | external endpoint、secret ref、timeout、retry | 定义 observability handoff adapter config,但不得允许 forbidden body 外送 |
| `ArchiveHandoffPort` | 是 | external endpoint、secret ref、timeout、retry | 定义 archive handoff adapter config,但不得让 archive 反写 Conversation truth |
| Domain objects / state enums | 否 | 不适用 | 详细设计必须保持 domain object 不读取配置;只能接收已校验的参数或 policy |
| Domain policies / invariants | 间接受影响 | feature policy | 只能接收已校验的 policy 参数;不得通过配置关闭 truth、visibility、body exclusion 和 audit 红线 |

说明:

- 表中“是”表示运行装配、adapter、store、job 或 external seam 会直接受配置影响。
- 表中“间接受影响”表示该部分只能通过已构造的 repository、port、policy 参数或 service dependency 受配置影响。
- 表中“不适用 / 否”表示不应引入配置读取或配置开关。

---

## 5. 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| Conversation truth 归属 | 配置不能让 Chat、Workspace、Runtime、Bridges、Governance、Artifact、Identity、Observability 或 Archive 接管本仓 truth | 需求 / 架构设计 |
| 来源仓 truth 不转移 | external fact 只能引用、快照或显化,不能通过配置复制来源正文或生命周期 | 需求 / 架构设计 / 概要 Step 3 |
| forbidden body 排除 | runtime 推理过程、tool 调用、bridge message body、artifact body、secret 不得通过配置进入 fact、snapshot、outbox 或 trace | 需求 / 架构设计 / 概要 Step 10 |
| participant / visibility 授权视野 | 授权裁剪是本仓核心边界,不能通过 profile 或 feature flag 绕过 | 需求 / 架构设计 / 概要 Step 5 / Step 9 |
| domain state machine 禁止迁移 | `Closed -> Open`、`Retracted -> Accepted`、`Invalid -> Fresh` 等红线不能配置化 | 概要 Step 9 |
| 派生不反写真相 | projection、search、cursor、snapshot 只能派生,不能通过配置变成写入来源 | 架构设计 / 概要 Step 3 / Step 9 |
| outbox / handoff 失败不回滚 truth | 传播和交接是后置动作,失败不能取消已提交事实 | 架构设计 / 概要 Step 8 / Step 9 |
| 幂等语义 | duplicate 与 conflict 必须区分,不能通过配置把冲突当成功 | 概要 Step 8 / Step 10 / 详细设计 |
| 审计与追溯链 | fact append、scope change、manifestation、trace handoff 必须可追溯,不能配置关闭 | 需求 / 架构设计 / 概要 Step 6 |
| 强一致 / 最终一致分层 | 核心 truth 成立强一致,传播 / 派生 / 交接最终一致,不能通过配置混写 | 架构设计 / 概要 Step 3 / Step 8 |
| 安全 / secret 外泄边界 | secret ref 可配置,secret 值和敏感正文不能进入 domain truth 或 outbox payload | 安全规范 / 配置设计 / 详细设计 |
| 下游消费授权 | SDK、Chat、Workspace、Runtime、Bridges 只能消费授权输出,不能通过配置请求未授权全量事实 | 需求 / 架构设计 / 概要 Step 7 / Step 8 |

---

## 6. 配置影响轮廓图

本步补图的原因:配置影响横跨入口、adapter、store、job 和外部接缝,仅靠表格容易误解为 domain object 也可以直接读取配置。下图只表达配置如何影响运行装配,不表达配置加载实现或配置文件内容。

#### 配置影响轮廓图

```text
<Configuration Source>
  │
  ▼
<ConfigLoader / ConfigValidator>
  │
  ▼
<Runtime Builder>
  │
  ├─ inbound adapters
  │
  ├─ repositories / projection stores / outbox store
  │
  ├─ external ports / handoff adapters
  │
  └─ operations jobs
  │
  ▼
<Application Services>
  │ injected dependencies only
  ▼
<Domain Objects / Policies>
  │ no direct config read
  ▼
<Truth / Projection / Outbox / Handoff>
```

关键说明:

- 配置只进入 loader、validator、runtime builder、adapter、repository、port 和 job 装配。
- Application Services 只接收已构造依赖,Domain Objects / Policies 不直接读取配置。
- 图不表达 JSON 示例、配置字段、默认值、环境变量、密钥系统、部署挂载或热更新流程。
- 配置校验失败可以阻止启动或降级外围能力,但不能放开 truth、visibility、body exclusion 或 state machine 红线。

---

## 7. 交给详细设计展开的配置实现契约方向

| 契约方向 | 详细设计应回答 | 不应提前写入概要设计的内容 |
|---|---|---|
| Runtime config 边界 | 配置对象如何分层,哪些属于 runtime builder,哪些属于 adapter / job / store | 完整字段清单、默认值、JSON 示例 |
| Config loader / validator | 如何加载、校验、组合 profile,校验失败如何阻止启动或降级外围能力 | 环境变量名、文件路径、完整错误码 |
| Adapter config | inbound、event、bus、resolver、handoff adapters 如何从配置构造 | constructor 完整参数和具体协议字段 |
| Store config | truth store、projection store、snapshot store、outbox store 如何注入 | 数据库、索引、迁移、连接池细节 |
| Job config | outbox publish、projection rebuild、reference refresh、handoff、consistency validation 如何接收 batch / retry / timeout 类参数 | 具体数值、调度表达式、重试退避算法 |
| Config-derived policy params | 哪些 policy 参数可以由配置间接提供,且必须先通过 validator | 通过配置关闭不变量或授权门禁 |
| Config error boundary | 配置错误如何影响启动、adapter 可用性、job 可用性和 degraded marker | 完整 `ConfigError` enum 和协议映射 |
| Runtime builder 注入关系 | 如何保证 domain object / policy 不直接读取配置 | 完整代码结构、crate module layout |

---

## 8. 当前文档问题诊断与修正结果

| 诊断项 | 修正前风险 | 本步修正 |
|---|---|---|
| 配置影响未显式收口 | 详细设计可能把配置读入 domain object | 明确配置只进入 loader / validator / runtime builder / adapter / store / job |
| 配置边界可能绕过领域规则 | profile / feature flag 可能关闭授权、body exclusion 或状态机红线 | 单列禁止配置化边界表 |
| Job / adapter 配置与业务状态混淆 | retry / timeout / endpoint 可能被误解为状态机规则 | 将配置影响限定为运行装配和技术参数 |
| 外部接缝配置不清 | resolver / bus / handoff 可能在详细设计临时补字段 | 交给详细设计定义 adapter config 和注入关系 |
| 04 配置说明职责不清 | 概要设计可能提前写 JSON 和默认值 | 明确 JSON、默认值、路径、环境变量和密钥名称后移 |

---

## 9. 输出约束检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否使用配置影响轮廓表 | 通过 | §4 使用规范要求的四列表 |
| 是否使用禁止配置化边界表 | 通过 | §5 覆盖 domain invariant、状态机、审计链、一致性和安全门禁 |
| 是否说明详细设计承接方向 | 通过 | §7 列出 runtime config、loader、validator、adapter config、job config 等方向 |
| 是否避免配置项清单和示例 | 通过 | 未写 JSON / YAML / TOML 示例、默认值、环境变量名、密钥名称 |
| 是否说明直接 / 间接受配置影响 | 通过 | §4 区分“是”“间接受影响”“否 / 不适用” |
| 是否按需补配置影响轮廓图 | 通过 | §6 补运行装配图,并说明不表达实现细节 |

---

## 10. 回填草稿

正式 `02-概要设计.md` §11 可以按以下结构回填:

```text
## 11. 配置影响轮廓

### 11.1 配置影响轮廓表
摘录 `design-calibration/02_hld_step_11_configuration_impact.md` §4。

### 11.2 禁止配置化边界
摘录 `design-calibration/02_hld_step_11_configuration_impact.md` §5。

### 11.3 配置影响轮廓图
摘录 `design-calibration/02_hld_step_11_configuration_impact.md` §6。

### 11.4 详细设计承接说明
摘录 `design-calibration/02_hld_step_11_configuration_impact.md` §7。
```

回填时必须在 §11 开头列出本章引用来源:

- `design-calibration/02_hld_step_03_constraints.md`
- `design-calibration/02_hld_step_04_code_subject_framework.md`
- `design-calibration/02_hld_step_05_components_boundary.md`
- `design-calibration/02_hld_step_07_api_interface_skeleton.md`
- `design-calibration/02_hld_step_08_processing_flows.md`
- `design-calibration/02_hld_step_09_state_machine.md`
- `design-calibration/02_hld_step_10_exceptions_boundaries.md`
- `design-calibration/02_hld_step_11_configuration_impact.md`

---

## 11. 待确认事项

当前 Step 11 无阻塞性待确认事项。

后续 Step 12 需要继续确认:

- 哪些配置影响必须进入详细设计承接清单。
- 哪些配置细节必须明确转交给 `04-配置说明`。
- 如果正式配置设计判断本仓某些运行形态不需要独立配置,是否仍按标准产出配置说明文档并声明不需要配置。

---

## 12. 进入下一步条件

Step 11 已满足进入 Step 12 的条件:

- 已明确哪些概要层结构受配置影响。
- 已明确哪些 domain invariant、状态机红线、审计链、事务一致性和安全门禁禁止配置化。
- 已明确哪些配置实现契约交给 `03-详细设计.md` 继续展开。
- 未提前写入配置项清单、JSON 示例、默认值、环境变量名、密钥名称或实现级配置类型定义。
