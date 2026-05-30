# Step 1. 确认配置输入边界

> 本文件是 `projects/L0-bus/04-配置设计.md` 的 Step 1 中间产物。
> 本步只确认配置设计需要承接哪些上游输入、哪些内容不再由配置设计回答、哪些缺口需要进入待确认事项。
> 本步不创建正式 `04-配置设计.md`,不提前定义完整配置项 schema,不回写 `03-详细设计.md`。

---

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 1
- 回填章节：`projects/L0-bus/04-配置设计.md` §1 与上游文档的关系声明

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` | L0-bus 的定位、目标 / 非目标、P0 核心闭环、使用方、边界规则、数据归属和依赖 | 确认配置设计只能服务事件传递、失败恢复、只读输出和总线留痕,不能重新定义业务 payload、事件 schema 或 SDK 体验 |
| `01-架构设计.md` | 职责边界、系统上下文、限界上下文、运行单元、依赖方向、数据所有权、横切关注点 | 确认配置不能绕过 core / bus / sdk / observability / governance 边界,不能把 MQ 后端差异暴露成平台语义 |
| `02-概要设计.md` | 代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态机、配置影响轮廓 | 确认哪些组成部分受配置影响,哪些领域对象和状态机禁止直接读取配置 |
| `03-详细设计.md` | Rust workspace、crate 分层、`RuntimeConfig`、配置绑定点、外部依赖绑定、禁止配置化边界、测试切口和风险 | 固定配置设计的主要事实源,尤其是 §13 配置引用与外部依赖绑定 |
| `05-测试方案.md` | 旧版测试方向,包含测试环境、配置矩阵和测试场景 | 只作为后续 Step 12 的下游承接参考;当前存在旧对象口径,不作为配置事实源 |
| `06-验收标准.md` | 旧版验收方向,包含进入 / 退出条件、功能门禁和非功能门禁 | 只作为后续 Step 12 的下游承接参考;当前存在旧对象口径,不作为配置事实源 |

已确认结论:

```text
L0-bus 是事件传递运行主干,不是事件 schema 真相仓、SDK 客户端体验仓、observability 长期存储仓、governance decision 仓或 MQ 产品部署仓。
配置设计必须承接 03 中的 RuntimeConfig / ConfigLoader / ConfigValidator / RuntimeBuilder / adapter binding,继续说明配置来源、优先级、profile、JSON 示例、密钥边界、加载校验和失败策略。
正式配置设计只承接上游设计,不重新定义 Rust 对象、函数签名、trait、事件 schema、状态机、事务语义或部署命令。
```

---

## 3. SOP 问题回答

### 3.1 当前配置设计要承接哪些需求、非功能、安全和环境差异?

需要承接 `00-需求文档.md` 中的仓级定位、目标 / 非目标、P0 传递闭环、失败恢复闭环、总线级留痕、Outbox relay 和消费边界。

安全和边界方面需要承接：

- bus 不保存 business payload body。
- bus 不保存 raw secret、governance decision body、observability long-term log body。
- failure material 不等于 governance decision。
- SDK / observability / governance / operator 消费只读输出,不得反写 bus truth。
- replay 必须依赖 dead-letter、delivery history 和 audit chain。

环境差异方面需要承接：

- local / CI 使用 in-memory store、in-memory backend、fixture source 和 in-memory publisher。
- test / integration 需要可控 batch、timeout、retry、projection 和 fake consumer。
- staging / production-like 后续可能替换 durable store、MQ backend、secret provider 和 observability consumer。
- P0 不要求生产 MQ / durable store 全量实现,但必须保留 adapter / profile / secret ref 的配置接缝。

### 3.2 详细设计中哪些配置引用、runtime builder、adapter 或外部依赖需要进入配置设计?

必须进入配置设计的详细设计输入包括：

- `RuntimeConfig` 根配置。
- `StoreConfig`、`BackendConfig`、`OutboxSourceConfig`、`PublisherConfig`。
- `ApiConfig`、`WorkerConfig`、`JobConfig`、`ProjectionConfig`。
- `RecoveryPolicyConfig`、`SecurityBoundaryConfig`、`ClockConfig`、`IdGeneratorConfig`。
- `ConfigLoader::load(ConfigSource source) -> Result<RuntimeConfig, ConfigError>`。
- `ConfigValidator::validate(RuntimeConfig config) -> Result<ValidatedRuntimeConfig, ConfigError>`。
- `RuntimeBuilder::build(ValidatedRuntimeConfig config) -> Result<RuntimeGraph, ConfigError>`。
- `RuntimeBuilder::build_policy_set(ValidatedRuntimeConfig config) -> Result<RuntimePolicySet, ConfigError>`。
- in-memory / fake default path 和后续 production adapter 的配置接缝。
- `L0-core` `core-contracts` 本地 path dependency。
- MQ backend、bus store、publisher、source、observability、governance、SDK 的运行期 / 事件协作依赖。

配置设计需要继续回答这些配置从哪里来、如何覆盖、如何按 profile 生效、哪些是必填、哪些禁止配置化、失败如何处理。

### 3.3 哪些测试和验收场景依赖配置矩阵?

后续测试和验收至少依赖以下配置矩阵：

| 场景 | 依赖的配置维度 |
|---|---|
| publication acceptance 默认路径 | store、publisher、policy、clock、id generator |
| outbox relay fixture / fake source | outbox source、cursor、batch size、ack 策略 |
| delivery worker 推进 | backend、worker profile、timeout、retry candidate |
| backend signal / timeout 归一化 | backend capability profile、timeout profile、signal source |
| retry / DLQ / replay preparation | recovery policy、job batch、approval ref policy、audit chain policy |
| projection 与 read-only output | projection store、rebuild mode、consistency marker |
| raw secret / forbidden body 拒绝 | security boundary、secret ref、redaction 策略 |
| stale projection / backend unavailable | fail-fast、degraded、stale marker、retryable error |
| CI gate | config profile、artifact root、fixture source、redaction check |

当前 `05-测试方案.md` 和 `06-验收标准.md` 仍是旧版对象口径,后续需要基于新版 `03` 和 `04` 重新校准。

### 3.4 哪些内容不应在配置设计中重新定义?

配置设计不应重新定义：

- 需求目标、用户故事、功能需求、验收标准。
- 系统上下文、架构模块、部署容器、技术选择。
- Rust workspace、crate、module、file layout。
- struct / enum / value object / trait / port / adapter / DTO / error 的正式代码契约。
- publication、delivery、feedback、retry、DLQ、replay、projection 的状态机和事务语义。
- HTTP path、topic 命名全集、数据库表、索引、迁移。
- 具体测试用例、覆盖率阈值、验收脚本。
- 具体部署命令、容器挂载、值班流程、告警面板。
- 生产 MQ / durable store 产品最终选型。

如果配置设计发现必须改变上述代码契约,应先进入详细设计回写清单。

### 3.5 当前上游是否存在会阻塞配置设计的缺口?

不存在阻塞 Step 1~Step 2 的缺口。`00~03` 已足够支撑配置设计启动。

但存在后续必须收口的缺口：

- 正式 `04-配置设计.md` 尚未创建。
- 当前没有完整 JSON 配置示例、模块级 demo 和完整 JSONC 文档示例。
- 还没有配置来源优先级、冲突处理、环境 / profile 矩阵。
- 还没有敏感配置和 secret ref 的正式配置说明。
- 还没有配置加载、校验、生效、变更、审计、回滚和失效策略。
- `05-测试方案.md` 和 `06-验收标准.md` 需要按新版 `03/04` 后续重校准。
- `/home/aris/Projects/quantalithos-bus` 目标实现仓状态和 `core-contracts` 本地 path dependency 需要在 `07` 前确认。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `projects/L0-bus/04-配置设计.md` | 文件尚未创建 | 配置控制面无法被测试、验收、实施和运维引用 |
| `projects/L0-bus/03-详细设计.md` §13 | 已定义配置绑定点和依赖绑定,但没有定义 JSON 示例、来源优先级、profile、配置项清单、密钥策略和失效策略 | 实现者知道“有哪些配置对象”,但不知道“配置如何填写、覆盖、校验和失败” |
| `projects/L0-bus/05-测试方案.md` | 仍使用 EventEnvelope、RoutingRule、ChannelBinding、DeliverySemantic 等旧对象口径 | 不能直接作为新版配置测试矩阵事实源 |
| `projects/L0-bus/06-验收标准.md` | 仍使用 Envelope / Routing / BusAuditTrail 等旧验收口径 | 不能直接作为新版配置验收门禁事实源 |
| `projects/L0-bus/design-calibration/03_ddd_step_18_risks_open_questions.md` | 已记录 `04-配置设计.md` 缺失会导致实施脑补配置 | 本轮必须优先补齐配置设计,否则 `07` 无法可靠安排 config loader 和 profile 实施 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置设计入口 | 配置内容停留在 `03-详细设计.md` §13 的代码绑定点 | 新增独立配置设计校准流程,最终产出 `04-配置设计.md` | 配置是运行、测试、验收、实施和运维共同引用的控制面 |
| 上游承接 | 可能直接从 03 的 config struct 扩写 | 明确从 `00/01/02/03` 承接边界,`05/06` 只作下游参考 | 防止把旧测试验收对象或部署猜测写成配置事实 |
| 详细设计关系 | 只知道 04 承接 03 | 每个 Step 显式判断是否影响 03 | 防止在 04 中静默新增 RuntimeConfig 字段、adapter 参数、trait 或 error |
| 下游关系 | `05/06` 仍按旧对象口径描述测试和验收 | 先由 04 提供新版配置矩阵,后续再重校准 05/06 | 测试验收应承接新版配置控制面 |
| 非范围 | 容易把部署命令、MQ 选型、测试用例放进配置设计 | 明确 04 不写部署命令、不选型生产 MQ、不替代测试验收 | 保持文档层次清晰 |

---

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：只在 `03-详细设计.md` §13 继续补配置 | 改动少,靠近 RuntimeConfig 代码契约 | 无法系统表达配置来源、profile、JSON demo、密钥、变更审计和失效策略 | 不采用 |
| 方案 B：新增正式 `04-配置设计.md`,按 SOP 逐 Step 收敛 | 配置控制面清晰,能支撑 05/06/07/09,也能防止实施脑补配置 | 需要额外维护 15 个 Step 中间产物 | 采用 |
| 方案 C：等实施阶段再设计配置 | 当前文档推进快 | 实现者会自行定义 env / JSON / CLI / secret 策略,跨仓口径容易漂移 | 不采用 |

推荐方案 B。

原因:

- `L0-bus` 同时有 API、worker、jobs、store、backend、publisher、projection 和 policy,配置面较宽,不适合只藏在详细设计里。
- 详细设计只应定义代码绑定点,配置设计才负责填写方式、来源优先级、环境矩阵、密钥和失败策略。
- 后续测试、验收和实施都依赖配置矩阵,必须先有独立 `04`。

---

## 7. 结构化中间产物

### 7.1 上游输入映射表

| 来源文档 | 配置输入 | 回填章节 |
|---|---|---|
| `00-需求文档.md` | `L0-bus` 是事件传递、订阅推进、失败恢复和总线留痕主干;不做 schema 真相、SDK 体验、governance decision、observability long-term store、MQ 部署 | §1 / §2 / §4 / §8 / §11 |
| `01-架构设计.md` | core / bus / sdk / observability / governance / MQ backend 边界;运行单元;in-memory default path;后端 adapter 替换边界;禁止正文边界 | §1 / §3 / §4 / §5 / §6 |
| `02-概要设计.md` | 代码主体框架、主要组成部分、受配置影响的入口 / adapter / job / worker / projection / policy,禁止 domain 直接读取配置 | §3 / §4 / §7 / §9 |
| `03-详细设计.md` | `RuntimeConfig`、子 config、`ConfigLoader`、`ConfigValidator`、`RuntimeBuilder`、配置绑定点、外部依赖绑定、禁止配置化校验 | §3 / §5 / §7 / §8 / §9 / §11 |
| `05-测试方案.md` | 配置相关测试方向和环境矩阵方向,但旧对象口径需重校准 | §12,仅作下游承接参考 |
| `06-验收标准.md` | 配置相关验收门禁方向,但旧对象口径需重校准 | §12,仅作下游承接参考 |

### 7.2 不再回答的问题清单

| 问题 | 交给哪份文档 / 哪一层 |
|---|---|
| Event、Error、TraceContext、Metadata、ActorRef 和 CloudEvents schema 如何定义 | `L0-core` |
| `RuntimeConfig`、子 config、`ConfigError`、trait、adapter constructor 的正式代码契约如何定义 | `03-详细设计.md` |
| publication、delivery、feedback、retry、DLQ、replay、projection 的状态机和事务如何实现 | `03-详细设计.md` |
| HTTP path、topic 命名、数据库表、索引和迁移如何设计 | `03-详细设计.md` 或后续实施专项 |
| 测试用例、fixture、CI gate 和报告如何组织 | `05-测试方案.md` |
| 什么配置结果算验收通过或失败 | `06-验收标准.md` |
| 实施批次、commit boundary、开发目录、git config 和提交规范如何安排 | `07-实施计划.md` |
| 容器挂载、发布命令、告警阈值、值班流程如何执行 | 部署与运维手册 |
| SDK 高层配置体验如何封装 | `L0-sdk` |
| Governance approval / decision 如何产生 | `L1-governance` |

### 7.3 配置设计必须回答的问题清单

| 问题 | 目标章节 |
|---|---|
| L0-bus 有哪些配置控制面,配置如何进入 runtime builder | §3 |
| 哪些配置允许改变运行装配,哪些行为禁止配置化 | §4 |
| 配置来源有哪些,按什么优先级覆盖,冲突如何处理 | §5 |
| local / CI / test / staging / production-like profile 有哪些差异 | §6 |
| 每个 P0 配置项的名称、类型、默认值、必填性、来源、作用域、生效方式、敏感级别和失败策略是什么 | §7 |
| 模块级 JSON demo 和完整 JSONC 文档示例如何组织 | §7 |
| secret ref、connection ref、backend credential 和敏感配置如何存储、读取、轮换、审计和脱敏 | §8 |
| 配置如何加载、解析、校验、装配、冷更新或热更新 | §9 |
| 配置变更如何评审、审计和回滚 | §10 |
| 配置缺失、非法、冲突、不可达、过期或漂移时如何 fail-fast / fail-closed / degraded | §11 |
| 配置设计如何交付给测试、验收、实施和运维 | §12 |
| 配置如何新增、废弃、迁移和演进 | §13 |

### 7.4 配置输入边界图

```text
00 Requirements
  |  positioning / goals / non-goals / boundary rules
  v
01 Architecture
  |  context / runtime units / dependencies / data ownership
  v
02 High-level design
  |  components / objects / flows / states / config impact
  v
03 Detailed design
  |  RuntimeConfig / ConfigLoader / ConfigValidator / RuntimeBuilder
  v
04 Configuration design
  |  source priority / profiles / config items / secrets / validation / failure modes
  v
05 Tests + 06 Acceptance + 07 Implementation + 09 Ops
```

关键说明：

- `04` 以 `00~03` 为事实输入,不直接从旧版 `05/06` 反推配置事实。
- `03` 定义代码绑定点,`04` 定义配置控制面和填写 / 校验 / 失效规则。
- 如果 `04` 发现需要改变 `03` 代码契约,必须先回写 `03`。
- `05/06/07/09` 应承接 `04` 的配置矩阵和门禁输入。

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 1 只确认 `04-配置设计.md` 的上游输入边界 | 否 | 无代码契约变化 | 无 | 无回写 |
| 当前 `05/06` 只作为下游承接方向参考,不作为配置事实源 | 否 | 下游文档校准关系 | 无 | 无回写 |
| 本步不新增 `RuntimeConfig` 字段、不改变 `ConfigLoader` / `ConfigValidator` / `RuntimeBuilder` 签名、不新增 `ConfigError` 枚举值 | 否 | 无代码契约变化 | 无 | 无回写 |

说明:

- 本步没有发现必须立即回写 `03-详细设计.md` 的配置结论。
- 后续 Step 如果决定新增 runtime config 字段、拆分 config struct、改变 adapter constructor 参数、新增配置错误类型或改变配置加载流程,必须在对应 Step 标记为 `待回写`。

---

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

`00-需求文档.md` 确定 `L0-bus` 是基于 `L0-core` 共享契约的跨仓事件传递、订阅推进、失败恢复和总线级留痕主干仓。配置设计不得把它扩展为事件 schema 真相仓、SDK 客户端体验仓、observability 长期存储仓、governance decision 仓或 MQ 产品部署仓。

`01-架构设计.md` 确定 core / bus / sdk / observability / governance / MQ backend 的职责边界,并确定传递语义应独立于具体后端产品。配置设计只能控制运行装配、profile、adapter 选择、source / publisher / store / projection / policy 等接缝,不能通过配置绕开传递语义、安全红线、审计链、状态机和只读输出边界。

`02-概要设计.md` 确定代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态机和配置影响轮廓。配置设计继续展开受配置影响的入口、worker、job、adapter、repository、projection 和 policy factory,但不让 domain object 直接读取配置。

`03-详细设计.md` 确定 `RuntimeConfig`、`StoreConfig`、`BackendConfig`、`OutboxSourceConfig`、`PublisherConfig`、`ApiConfig`、`WorkerConfig`、`JobConfig`、`ProjectionConfig`、`RecoveryPolicyConfig`、`SecurityBoundaryConfig`、`ConfigLoader`、`ConfigValidator`、`RuntimeBuilder` 和外部依赖绑定。配置设计只承接这些实现契约,不重新定义 Rust struct、enum、trait、function、DTO、状态机或事务语义。

本章未发现需要立即回写 `03-详细设计.md` 的配置结论。后续章节若改变 runtime config、builder、adapter、trait、error 或函数流,必须先进入详细设计回写清单并完成回写后再定稿。

`05-测试方案.md` 与 `06-验收标准.md` 当前作为下游承接方向参考。它们仍含旧版对象口径,配置设计完成后应把配置矩阵、配置错误场景和配置门禁回流给测试与验收文档继续校准。
```

---

## 10. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 是否接受本轮配置设计先以新版 `00/01/02/03` 为主输入,暂不把当前 `05/06` 的旧口径作为配置事实源 | A. 接受;B. 同时承接旧 `05/06`;C. 先重写 `05/06` 再做配置 | 推荐 A | 配置设计应先基于新版设计主链形成事实源,再反向支撑 `05/06` 重校准 |
| 是否接受正式 `04-配置设计.md` 只在 Step 15 统一创建 | A. 接受;B. 每个 Step 直接改正式文档;C. 先创建空正式文档并逐步填 | 推荐 A | 符合配置 SOP,能避免未确认内容进入正式文档 |
| 是否接受本步不回写 `03-详细设计.md` | A. 接受;B. 先扩写 `03` 配置章节;C. 等 Step 7 后再判断 | 推荐 A | Step 1 只确认输入边界,没有改变代码契约;后续若发现字段或签名缺口再回写 |

---

## 11. 进入下一步条件

- [x] 配置设计以上游 `00/01/02/03` 为主输入。
- [x] 当前 `05/06` 仅作为下游方向参考,不作为配置事实源。
- [x] 正式 `04-配置设计.md` 在 Step 15 统一整理。
- [x] 本步无需回写 `03-详细设计.md`。
- [x] Step 1 状态从 `[~]` 更新为 `[x]`。
