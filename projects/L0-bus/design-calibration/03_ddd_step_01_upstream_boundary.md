# Step 1. 确认概要设计输入边界

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 1
- 回填章节：`projects/L0-bus/03-详细设计.md` §1 与上游文档的关系声明 / §17 风险与待确认事项

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计书写规范.md` | 新版详细设计 18 章主链、模块实现契约主轴、Rustdoc 注释和图表规则 | 作为正式文档结构与输出约束 |
| `standards/document/详细设计讨论流程_SOP.md` | Step 1~19 讨论流程和门禁 | 作为本轮详细设计校准流程 |
| `standards/document/设计文档讨论中间产物规范.md` | Step 中间产物结构、逐 Step 纪律、正式文档追溯要求 | 作为本文件结构约束 |
| `projects/L0-bus/00-需求文档.md` v0.2.0 | 本仓需求基线 | 确认详细设计不能重新定义的需求边界 |
| `projects/L0-bus/01-架构设计.md` v0.2.0 | 本仓架构基线 | 确认详细设计不能重新定义的系统边界、依赖方向和技术取舍 |
| `projects/L0-bus/02-概要设计.md` v0.2.0 | 代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态机、配置影响和承接清单 | 作为详细设计直接输入 |
| `projects/L0-bus/03-详细设计.md` v0.1.0 | 旧版详细设计草案 | 作为需要重写的旧口径诊断对象 |
| `standards/coding/rust.md` | Rust 编码规范 | Step 3 继续承接,本步只登记为后续输入 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 全局依赖方向和本仓依赖裁剪口径 | Step 3 / Step 4 / Step 14 继续承接 |
| `standards/document/子项目目录与代码文件组织规范.md` | 子项目目录、crate/package、binary 和文件组织规则 | Step 4 继续承接 |

已确认结论：

```text
新版 `02-概要设计.md` 已经足以作为详细设计输入。
旧版 `03-详细设计.md` 基于旧 envelope / routing / callback schema 口径,不能继续作为正式详细设计主线。
详细设计应从 `02-概要设计.md` §12 的承接清单开始,按新版详细设计 SOP 逐 Step 展开。
```

依赖的前序 Step：

```text
无。Step 1 是本轮详细设计校准的起点。
```

---

## 3. SOP 问题回答

### 3.1 当前详细设计直接承接概要设计中的哪些结论？

回答：

当前详细设计直接承接 `02-概要设计.md` 中已经收稳的下列结论。

| 概要设计章节 | 已收稳结论 | 详细设计继续展开 |
|---|---|---|
| §4 代码主体框架总览 | Inbound / Operations、Application Services、Domain Model / Policies、Ports / Persistence / Projection / Adapters 分层，以及 publication / delivery / feedback / recovery / read-only output 主线 | crate / module / file tree、实现单元、模块边界、依赖方向 |
| §5 主要组成部分、职责与边界 | 六个主要组成部分：发布接入、delivery 推进、反馈幂等、失败恢复、审计只读输出、存储引用与后端适配边界 | 每个模块的对象、trait、adapter、错误、持久化和测试切口 |
| §6 关键对象轮廓 | `PublicationMaterial`、`PublicationAcceptance`、`TransportSemantic`、`DeliveryRecord`、`FeedbackResult`、`RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、projection、policy、backend capability 等对象 | 完整 Rust struct / enum / value object、字段、函数、Rustdoc 注释、不变量和错误返回 |
| §7 API / 接口骨架 | Command、Query、Inbound Event Consumer、Outbound Event、Operations Job、Port / Repository 边界 | DTO、event schema、handler、service 函数签名、错误映射、幂等和审计要求 |
| §8 关键处理流 | `AcceptPublication`、outbox fact 消费、delivery 推进、feedback、backend signal、timeout、retry、DLQ、replay preparation、projection、backend capability check | 函数级调用链、事务边界、repository / port 调用和失败分支 |
| §9 状态定义与状态流转 | `PublicationAcceptanceStatus`、`DeliveryStatus`、`FeedbackStatus`、`RetryPlanStatus`、`DeadLetterStatus`、`ReplayPreparationStatus`、`ProjectionStatus` | 状态转换矩阵、非法转换错误、状态守卫函数和转换测试 |
| §10 异常与边界场景 | 契约缺失、payload body、后端不可用、late feedback、projection stale、secret 泄漏、failure material 边界等 | 错误模型、恢复口径、异常分支和红线测试 |
| §11 配置影响轮廓 | runtime config、adapter config、job config、store config、projection config、publisher config、policy factory 注入方向 | `RuntimeConfig`、loader、validator、builder、adapter constructor 和 config error 契约 |
| §12 详细设计承接清单 | 明确 03 必须继续展开的对象、接口、流程、状态、异常、配置和测试切口 | 作为本轮详细设计直接输入门禁 |
| §13 设计风险与待确认事项 | late ack、projection rebuild、backend capability、retry 状态、replay ready、rejected event、publication acceptance query 等风险 | 保留为详细设计风险 / 待确认输入,不得在 Step 1 写成稳定实现契约 |

### 3.2 概要设计中的代码主体框架是否已经足够稳定？

回答：

足够稳定，可以进入详细设计。

| 检查项 | 结论 | 说明 |
|---|---|---|
| 代码主体是否明确 | 是 | §4 已点名 API、service、domain object、policy、repository、port、job、worker |
| 业务主要组成部分是否明确 | 是 | §5 已拆成六个主要组成部分 |
| 实现分层方向是否明确 | 是 | §4 已明确 Inbound / Application / Domain / Ports / Persistence / Projection / Adapters |
| 技术支撑是否与业务主线分离 | 是 | 存储、引用与后端适配边界被定义为支撑边界 |
| 旧口径是否已清理 | 是 | 正式 `02` 已清理 envelope / routing / callback schema 真相仓倾向 |
| 配置影响是否已提前识别 | 是 | §11 已识别配置影响,详细设计可以继续定义配置实现契约 |

### 3.3 概要设计中的关键对象、接口骨架、处理流和状态机是否足够继续展开？

回答：

足够进入详细设计，但每个维度都仍需要在详细设计中补成实现契约。

| 维度 | 是否足够 | 继续展开内容 |
|---|---|---|
| 关键对象 | 足够 | 补完整 Rust 类型、字段约束、函数签名、返回类型、错误类型和 Rustdoc 注释 |
| 接口骨架 | 足够 | 补 DTO、协议映射、schema、handler、错误映射和幂等规则 |
| 处理流 | 足够 | 补 `对象.函数(Type 参数名)` 调用链、事务边界、repository / port 调用和失败分支 |
| 状态机 | 足够 | 补状态转换矩阵、非法转换错误和状态守卫函数 |
| 异常边界 | 足够 | 补错误 enum、错误码、恢复口径、重试 / 补偿边界和测试切口 |
| 配置影响 | 足够 | 补 runtime config、loader、validator、builder、adapter/job/store/projection config 和禁止配置化校验 |

### 3.4 哪些内容仍停留在概要设计轮廓，进入详细设计前必须补清？

回答：

这些内容不是概要设计缺口，而是详细设计必须继续展开的实现契约。

| 仍是轮廓的内容 | 对详细设计的要求 |
|---|---|
| 文件布局 | 决定采用单 crate 模块分层架构还是 workspace 多 crate 架构，并给出目录 / package / crate / binary 映射 |
| 对象字段 | 为 §6 对象补完整字段、字段注释、字段类型、可见性和构造约束 |
| 状态 enum | 为 §9 状态补 Rust enum、variant 注释、转换函数和非法转换错误 |
| Command / Query / Event / Job DTO | 定义完整 DTO / response / view / event payload / job request schema |
| Repository / Port / Adapter | 定义 trait、函数签名、参数、返回类型、错误类型、mock / test double 切口 |
| 函数级处理流 | 把 §8 概要流程展开为 handler -> service -> domain -> repository / port -> event / result 的正式调用链 |
| 事务与一致性 | 定义 `UnitOfWork`、幂等检查、history / audit / outbox 写入顺序和 projection 派生一致性 |
| 错误与恢复 | 定义 error enum、错误映射、retry / DLQ / replay preparation 的恢复口径 |
| 配置契约 | 定义 runtime config、adapter/job/store/projection/publisher config、secret reference 和 config validation |
| 可观测性与审计 | 定义 audit append、trace id、metric/log event、报告材料和禁止正文检查 |
| 测试切口 | 定义模块级单元测试、状态机测试、port contract test、integration test 和 negative test |

### 3.5 哪些需求或架构结论会影响详细设计，但不能在详细设计中重新定义？

回答：

| 来源 | 已收稳结论 | 详细设计处理方式 |
|---|---|---|
| 需求文档 §2 | `L0-bus` 是跨仓事件传递、delivery、恢复和留痕主干仓 | 只能展开实现契约,不得改成业务事件正文仓、SDK 仓或治理仓 |
| 需求文档 §9 | F-001~F-008 覆盖发布接入、传递语义、delivery、feedback、恢复、审计输出、outbox relay 和后端适配 | 模块、接口、对象、处理流和测试切口必须覆盖这些能力 |
| 需求文档 §10 | BR-001~BR-012 约束 core / bus、payload、传递语义、幂等、replay、read-only output、governance、audit、backend adapter | 详细设计必须转成 guard、policy、error、test 和 config validation |
| 需求文档 §11 | bus truth、snapshot、reference、forbidden body 四类数据归属 | 持久化、projection、reference、audit 和 validator 契约必须守住数据归属 |
| 架构设计 §6 | 接入、delivery、反馈、恢复、只读输出、后端适配等限界上下文 | 模块拆分必须承接这些上下文,不能按旧 envelope / routing 主题重切 |
| 架构设计 §8 | `L0-core` 是编译期依赖；MQ backend / store 是运行期依赖；发布方 / 订阅方是事件协作依赖 | Step 3 / Step 4 / Step 14 必须区分 Cargo path dependency、adapter 和事件协作 |
| 架构设计 §9 | bus truth 强一致,projection / read output 派生,reference 不拥有正文 | 事务、repository、projection 和 query 契约必须按此口径展开 |
| 架构设计 §10 | 同步入口、事件消费、事实传播、operations job 分离 | handler、consumer、publisher 和 job 不能混成一个万能 service |
| 架构设计 §11 | Rust + ports and adapters + durable bus store + in-memory default path | 详细设计必须给出 Rust module、trait、adapter 和默认可验证路径 |
| 概要设计 §13 | 待确认项不能进入承接清单 | 详细设计必须保守处理,必要时放入 Step 18 风险与待确认事项 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` 文档头部 | 仍引用旧详细设计结构、旧通则和旧 `02-概要设计.md` v0.1.0 | 与新版 18 章主链和新版概要设计不一致 |
| 旧版 `03-详细设计.md` §1 | 把本仓描述成持有 EventEnvelope / CommandEnvelope / CallbackEnvelope 等共享传递主干契约真相 | 与新版 `L0-core` 负责共享契约、`L0-bus` 负责传递运行主干的边界冲突 |
| 旧版 `03-详细设计.md` §2 | 内容采集流程仍围绕 envelope、routing、retry、audit 旧对象组 | 无法承接新版 publication / delivery / feedback / recovery / read-only output 主线 |
| 旧版 `03-详细设计.md` §3 | 目录树基于 `src/api/application/domain/infra/projection/types/config` 粗略展开旧主题 | 不能直接作为当前文件布局依据,需要由 Step 4 重定 |
| 旧版对象线索 | EventEnvelope、CommandEnvelope、CallbackEnvelope、RoutingRule 等仍是主角 | 会误导实现者重新实现 core / envelope 契约而不是 bus truth / delivery truth |
| 当前正式 `02-概要设计.md` | 已收稳详细设计承接清单,但旧 `03` 未同步 | 需要按 SOP 重写详细设计,不是局部修补 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 详细设计输入 | 旧 `02` v0.1.0 和旧 envelope / routing 口径 | 新 `00/01/02` v0.2.0 | 上游已经重写并收稳 |
| 主组织轴 | 按旧对象组和粗略目录组织 | 按模块实现契约组织 | 对齐新版详细设计书写规范 |
| Step 产物 | 无详细设计工作台 | 新建 `03_ddd_calibration_flow.md` 和 Step 中间产物 | 保持可追溯和可 review |
| 正式 `03` 写入方式 | 直接扩写旧文档 | Step 1~18 逐步收敛,Step 19 统一重写 | 避免新旧口径混合 |
| 未决项处理 | 散落或隐含 | 输入不足风险和待确认事项显式收纳 | 防止实现阶段脑补 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：在旧版 `03` 上局部修补 | 改动少 | 旧主线已经偏离新版 `02`,容易残留 envelope / routing 旧口径 | 不采用 |
| 方案 B：按新版详细设计 SOP 建工作台,逐 Step 生成中间产物,最后统一重写正式 `03` | 可追溯、可 review、能防止主语漂移 | 需要更多步骤 | 采用 |
| 方案 C：直接一次性重写正式 `03` | 看似快 | 长文档容易遗漏、风格不一致,且违反中间产物门禁 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `00-需求文档.md` §2 本仓定位与边界 | `L0-bus` 是跨仓事件传递、delivery、恢复和留痕主干仓 | 文件布局、模块边界、port / adapter 边界必须防止越界 |
| `00-需求文档.md` §9 功能需求 | F-001~F-008 发布接入、传递语义、delivery、feedback、恢复、只读输出、outbox relay、后端适配 | 模块、API、job、对象和处理流必须覆盖完整 P0/P0-min 能力 |
| `00-需求文档.md` §10 业务规则与边界约束 | BR-001~BR-012 核心边界和不变量 | guard、policy、error、config validation 和测试切口 |
| `00-需求文档.md` §11 数据需求与数据归属 | bus truth、snapshot、reference、forbidden body 四类数据归属 | 持久化、事务、projection、reference、validator 和审计契约 |
| `00-需求文档.md` §12 接口与依赖 | 发布接入、delivery、feedback、恢复、只读消费、后端适配和运行状态接口面 | Command / Query / Event / Job / Port 协议契约 |
| `01-架构设计.md` §6 限界上下文与子域划分 | 发布接入、delivery、feedback、恢复、只读输出、后端适配等上下文 | 模块布局和对象归属 |
| `01-架构设计.md` §8 依赖方向与层间约束 | `L0-core` 编译期依赖、MQ / store 运行期依赖、发布方 / 订阅方事件协作依赖 | crate dependency、adapter、event consumer 和 test double 边界 |
| `01-架构设计.md` §9 数据所有权与一致性策略 | bus truth 强一致、projection 派生、reference 不拥有正文 | 事务、repository、projection、job 和恢复口径 |
| `01-架构设计.md` §10 关键交互与通信方式 | 同步入口、事件消费、outbound fact、operations job、query 只读 | handler、consumer、publisher、job 和 query contract |
| `01-架构设计.md` §11 关键技术选型 | Rust、ports and adapters、durable bus store、in-memory default path、outbox、projection、capability check | Rust module、trait、adapter、store、默认可验证路径和配置绑定 |
| `02-概要设计.md` §4 代码主体框架总览 | Inbound / Application / Domain / Ports / Persistence / Projection / Adapters 分层 | 实现单元、文件布局和模块依赖图 |
| `02-概要设计.md` §5 主要组成部分、职责与边界 | 六个主要组成部分及对象发现线索 | 模块实现契约主轴 |
| `02-概要设计.md` §6 关键对象轮廓 | 关键对象字段、状态、函数和禁止事项轮廓 | 完整 Rust struct / enum / value object 契约 |
| `02-概要设计.md` §7 API / 接口骨架 | Command / Query / Consumer / Event / Job / Port 边界 | 协议 schema、DTO、handler、错误映射 |
| `02-概要设计.md` §8 关键处理流 | 写路径、事件消费、job、query、outbound event 路径 | 函数级调用链、事务边界、port 调用和失败分支 |
| `02-概要设计.md` §9 状态定义与状态流转 | 状态族、允许迁移和禁止迁移 | 状态转换矩阵、状态守卫函数和非法迁移错误 |
| `02-概要设计.md` §10 异常与边界场景 | 异常场景、红线和处理流反查 | error enum、错误映射、恢复口径和 negative tests |
| `02-概要设计.md` §11 配置影响轮廓 | 配置影响、禁止配置化边界和实现契约方向 | runtime config、loader、validator、builder 和 adapter config |
| `02-概要设计.md` §12 详细设计承接清单 | 详细设计稳定输入和回退规则 | 本轮详细设计的直接执行门禁 |
| `02-概要设计.md` §13 设计风险与待确认事项 | late ack、projection rebuild、backend capability、retry 状态、replay ready 等风险 | Step 18 集中收纳,不得在前序 Step 写死 |

### 7.2 本文不再回答

本文不再回答：

- 不重新回答 `L0-bus` 为什么单独成仓。
- 不重新定义需求目标、用户故事、功能需求、业务规则、验收标准和追溯矩阵。
- 不重新定义系统上下文、限界上下文、依赖方向、数据所有权、通信方式和技术选型。
- 不重新定义 `L0-core` 的 Event、Error、TraceContext、Metadata、ActorRef、CloudEvents schema 或事件目录正文。
- 不重新定义业务 payload 正文、订阅方业务幂等、governance decision、observability 长期存储或 SDK client 体验。
- 不在详细设计中改变概要设计已经收稳的对象、接口、处理流和状态机主语。

### 7.3 本文必须回答

本文必须回答：

- `L0-bus` 目标仓的实现单元、crate / module / file 布局如何组织。
- 每个模块包含哪些对象、trait、adapter、repository、error 和测试切口。
- §6 中的关键对象如何落成 Rust struct / enum / value object,字段、函数和注释如何定义。
- §7 中的 Command / Query / Consumer / Event / Job 如何落成 DTO、handler、schema 和错误映射。
- §8 中的每个关键处理流如何落成函数级调用链、事务边界、repository / port 调用和失败分支。
- §9 中的状态机如何落成转换矩阵、状态守卫函数和非法转换错误。
- bus truth、history、audit、outbox、projection、idempotency、DLQ、replay preparation 如何持久化并保持一致。
- runtime config、adapter config、job config、store config、projection config 和禁止配置化边界如何实现。
- 可观测性、审计埋点、测试切口和实施计划承接清单如何定义。

### 7.4 输入不足风险清单

| 风险 | 是否阻塞进入 Step 2 | 当前处理 |
|---|---|---|
| 旧版 `03-详细设计.md` 与新版 `02` 主线不一致 | 否 | 旧 03 仅作诊断材料,Step 19 删除旧文件后重建正式文档 |
| 目标代码仓目录尚未在本轮详细设计中确认 | 否 | Step 3 / Step 4 结合 `/home/aris/Projects`、目录组织规范和依赖裁剪规则确认 |
| crate 布局是单 crate 还是 workspace 多 crate 尚未确认 | 否 | Step 4 专门决策,不能在 Step 1 预设 |
| backend adapter 和 durable store 具体产品未完全定案 | 否 | 详细设计先定义 port / adapter 契约和默认可验证路径,产品细节进入配置和实施 |
| late ack、projection missing、backend capability 变化等待确认项仍存在 | 否 | 作为 Step 18 风险输入,前序 Step 按 §13 当前挂起口径保守展开 |
| 配置说明 `04` 尚未重建 | 否 | 详细设计 Step 14 只定义配置实现契约,具体 JSON 示例和配置手册交给 04 |

---

## 8. 回填草稿

正式 `projects/L0-bus/03-详细设计.md` §1 “与上游文档的关系声明”应从本文件摘录并整理以下内容：

- §7.1 “上游关系映射表”
- §7.2 “本文不再回答”
- §7.3 “本文必须回答”

正式 `projects/L0-bus/03-详细设计.md` §17 “风险与待确认事项”应承接：

- §7.4 “输入不足风险清单”中仍未在后续 Step 关闭的风险。

本 Step 不直接改正式 `03-详细设计.md`。Step 19 生成正式文档时,再统一补充校准来源、延伸阅读、正式文档语气和交叉引用。

---

## 9. 待确认事项

| 待确认项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否继续沿用旧版 `03-详细设计.md` 的结构 | A：沿用并局部修补；B：只作诊断,Step 19 删除后重建 | 建议 B | 旧结构和旧主语与新版 `02` 不一致,局部修补会残留旧口径 |
| 是否在 Step 1 决定 crate 布局 | A：现在决定；B：留给 Step 4 | 建议 B | Step 1 只确认输入边界,crate 布局需要结合目录组织规范和依赖裁剪 |
| 是否把 §13 待确认项写成详细设计硬输入 | A：写死；B：作为风险输入保守展开 | 建议 B | 概要设计已明确待确认项不进入承接清单 |

以上待确认项不阻塞进入 Step 2。除非后续讨论明确改变,后续 Step 按“建议方案”继续展开。

---

## 10. 进入下一步条件

- 已明确详细设计承接哪些需求、架构和概要设计结论。
- 已明确旧版 `03-详细设计.md` 只作为诊断材料,不作为新版详细设计主线。
- 已明确本文不再回答什么、必须回答什么。
- 已识别不会阻塞 Step 2 的输入不足风险。
- 已足以进入 Step 2 “明确本轮实现范围和非范围”。
