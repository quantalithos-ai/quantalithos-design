# Step 2. 明确本轮实现范围和非范围

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 2
- 回填章节：`projects/L0-bus/03-详细设计.md` §2 本次详细设计目标与范围

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_01_upstream_boundary.md` | 已确认的上游关系映射、旧版 `03` 诊断和本文必须回答 / 不再回答范围 | 作为本步范围裁剪的直接输入 |
| `projects/L0-bus/02-概要设计.md` §2 | 概要设计目标、非范围和设计深度口径 | 防止详细设计回退成需求或架构讨论 |
| `projects/L0-bus/02-概要设计.md` §4~§12 | 代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态机、配置影响和详细设计承接清单 | 裁剪本轮必须覆盖的模块、对象、接口、流程和状态机 |
| `projects/L0-bus/02-概要设计.md` §13 | 设计风险与待确认事项 | 识别哪些内容只能保守推进或放入 Step 18 |
| `standards/document/详细设计书写规范.md` | 详细设计 18 章主链和实现契约粒度 | 限制本步目标必须是实现契约目标 |
| `standards/document/设计文档讨论中间产物规范.md` | 中间产物结构、逐 Step 纪律和正式文档追溯要求 | 作为本文件结构约束 |

已确认结论：

```text
本轮详细设计覆盖 L0-bus 的 P0 可实现闭环:
publication acceptance -> delivery -> feedback -> recovery -> read-only output。

本轮详细设计也必须覆盖支撑该闭环的持久化、事务、幂等、配置引用、审计、可观测性、测试切口和实施承接。

本轮不展开生产级 MQ 产品选型、集群部署、UI、SDK 体验、治理决策、业务 payload 正文或 L0-core 共享契约定义。
```

依赖的前序 Step：

```text
Step 1 已确认详细设计直接承接 00 / 01 / 02 v0.2.0,旧版 03 只作为问题诊断材料。
```

---

## 3. SOP 问题回答

### 3.1 本轮详细设计必须覆盖哪些模块？

回答：

本轮必须覆盖两类模块：业务主线模块和实现支撑模块。业务主线来自概要设计 §5 的六个主要组成部分；实现支撑来自概要设计 §4 的实现分层和 §11 的配置影响。

| 模块范围 | 必须覆盖 | 不在本步提前决定 |
|---|---|---|
| 发布材料接入与传递语义形成 | command handler、outbox fact consumer、publication acceptance service、transport semantic service、payload boundary guard | 具体 crate / 文件名由 Step 4 决定 |
| 订阅 delivery 推进 | delivery service、delivery lifecycle、delivery worker / progression job、backend dispatch port | 后端产品 adapter 细节由 Step 14 裁剪 |
| 结果反馈与幂等留痕 | feedback command / signal consumer、idempotency anchor、delivery history、feedback result | 订阅方业务幂等实现不进入本仓 |
| 失败恢复与重放准备 | retry request / retry cycle、DLQ、replay preparation、recovery eligibility policy、failure material | 治理审批系统和 UI 操作台不进入本仓 |
| 审计、历史与只读输出 | audit append、transport view projection、failure summary projection、query service、read-only output policy | observability 长期存储和 dashboard 不进入本仓 |
| 存储、引用与后端适配边界 | repository port、unit of work、outbox publisher port、transport backend port、backend capability policy | 生产数据库 / MQ 集群部署方案不进入本仓 |
| 配置引用与运行装配 | runtime config、loader、validator、builder、adapter / job / store / projection / publisher config | 完整配置说明和部署填写指导交给 `04-配置说明.md` |
| 横切实现支撑 | error model、transaction、idempotency、concurrency、observability、audit、test slices | 排期、任务拆分和 commit 边界交给 `07-实施计划.md` |

### 3.2 本轮必须定义哪些对象、接口、事件、job 和状态机？

回答：

必须定义的内容以概要设计 §12 的详细设计承接清单为准。本轮不得删减这些主语，也不得在详细设计中静默改名。

| 类型 | 本轮必须定义 |
|---|---|
| Domain / record / value object / policy | `PublicationMaterial`、`PublicationAcceptance`、`TransportSemantic`、`PayloadBoundaryGuard`、`DeliveryRecord`、`DeliveryAttempt`、`DeliveryLifecycle`、`FeedbackResult`、`IdempotencyAnchor`、`DeliveryHistoryEntry`、`RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、`FailureMaterial`、`RecoveryEligibilityPolicy`、`BusAuditEntry`、`TransportViewProjection`、`FailureSummaryProjection`、`ReadOnlyOutputPolicy`、`BackendCapabilityRef`、`BackendCapabilityPolicy` |
| Command API | `AcceptPublication`、`RecordDeliveryFeedback`、`RequestRetry`、`MoveDeliveryToDeadLetter`、`PrepareReplay` |
| Query API | `GetPublicationAcceptance`、`GetDeliveryStatus`、`ListDeliveryHistory`、`GetTransportView`、`GetFailureSummary`、`GetBusAuditTrail`、`GetBackendHealthView` |
| Inbound Event Consumer | `ConsumeCommittedOutboxFact`、`ConsumeBackendDeliverySignal`、`ConsumeTimeoutSignal` |
| Outbound Event | publication accepted / rejected、delivery state changed、feedback recorded、dead letter created、replay ready、projection updated、backend capability changed |
| Operations Job | outbox relay、delivery progression、retry cycle、projection run / rebuild、backend capability check |
| 状态机 | `PublicationAcceptanceStatus`、`DeliveryStatus`、`FeedbackStatus`、`RetryPlanStatus`、`DeadLetterStatus`、`ReplayPreparationStatus`、`ProjectionStatus` |
| Port / repository / adapter | publication / delivery / recovery / audit / projection repository、unit of work、transport backend port、outbox publisher port、clock / id generator、config loader / validator |

### 3.3 哪些能力属于 P1 / 后续阶段，不应在本轮展开？

回答：

这些能力可以在接口或扩展点上保留边界，但不能在本轮详细设计中写成必须实现的完整功能。

| P1 / 后续能力 | 本轮处理口径 | 原因 |
|---|---|---|
| 生产级 Kafka / NATS / Redis / RabbitMQ adapter 全量实现 | 只定义 `TransportBackendPort`、capability ref、adapter config 和默认可验证 adapter 边界 | 产品选型和部署形态未在架构层收稳 |
| exactly-once / effectively-once 专项 | 本轮按 at-least-once + idempotency anchor 设计 | 需求和概要已经把默认语义定为 at-least-once |
| 分布式 scheduler、leader election、跨节点 worker 协调 | 只定义 job contract、lock / concurrency guard 和 checkpoint 口径 | 属于运行部署和高可用专项 |
| DLQ / replay / backend health UI | 只定义 query / command / projection / audit 契约 | UI 不属于 L0-bus 仓实现目标 |
| governance decision / approval engine | 只保存 approval / governance reference，不实现治理决策 | governance 是外部消费方 / 上层仓职责 |
| observability 长期存储、dashboard、告警平台 | 只定义 audit、metric、log、trace marker 和 read-only output | 观测平台不是本仓 |
| SDK client ergonomics | 只定义 query output 和事件输出契约 | SDK 是下游消费仓或后续封装 |
| public crates 发布和版本发布流程 | 只按本地 path dependency 和 package 命名约束设计 | 当前开发共识是不上传公共 crates |
| 自动根据 backend capability change 重排 delivery | 本轮只记录 capability changed event / audit / view，是否自动重排进入 Step 18 | 概要设计仍列为待确认风险 |
| Query 缺失 projection 时自动修写真相 | 本轮只返回 consistency marker 或触发受控 job 建议 | read-only output 不得反写 truth |

### 3.4 哪些内容属于测试方案、实施计划、配置设计或运维手册？

回答：

详细设计需要给出代码实现契约和最小测试切口，但不能替代后续文档。

| 内容 | 留给哪一层 / 哪份文档 | 本轮详细设计最多做到 |
|---|---|---|
| 完整测试矩阵、测试报告目录、测试脚本命名、运行证据 | `05-测试方案.md` | 定义测试切口、contract test 和必须覆盖的不变量 |
| 验收项、验收人、验收证据、通过 / 不通过标准 | `06-验收标准.md` | 提供可被验收引用的接口、状态、错误和观测契约 |
| 实施阶段、commit boundary、编码顺序、报告产物、提交规范 | `07-实施计划.md` | 提供实现承接清单和模块依赖顺序 |
| 配置 JSON 样例、配置项说明、默认值、环境变量、部署填写说明 | `04-配置说明.md` | 定义配置 struct、loader、validator、builder 和错误类型 |
| 生产部署拓扑、集群参数、备份恢复演练、日常运维 playbook | 运维手册 / 部署文档 | 定义运行 job、健康视图、恢复命令接口和观测 marker |
| API 网关安全、身份校验、授权策略 | 网关 / 安全文档 / 上游架构 | 透传 actor / metadata / trace，不在本仓实现认证授权 |
| L0-core 共享契约 schema | `L0-core` 文档和代码 | 引用 core 类型，不重新定义 |

### 3.5 实现者拿到本文后，应能完成哪些代码范围？

回答：

实现者拿到正式 `03-详细设计.md` 后，应能在目标实现仓完成 L0-bus 的 P0 可运行代码骨架和可验证闭环。

```text
Formal 03 implementation scope
|
+-- Rust project structure and module layout
+-- Domain objects, value objects, records, policies and state enums
+-- Command / Query / Consumer / Job handlers and application services
+-- Repository / UnitOfWork / Port / Adapter traits
+-- Default verifiable adapters and test doubles
+-- Persistence, transaction, idempotency, history, audit and outbox contracts
+-- Projection and read-only query contracts
+-- Runtime config structs, loader, validator and builder injection
+-- Error model, recovery behavior, concurrency guard and observability markers
+-- Test slices required by 05-test-plan
```

关键说明：

- 图中范围是详细设计必须支持的代码范围，不是一次 commit 或一个 sprint 的拆分。
- production MQ / database adapter 可以作为 trait 和可替换 adapter 边界存在，但完整生产适配不在本轮展开。
- 正式 `03` 应足以让实现者完成可编译、可测试、可运行的默认路径，不依赖额外口头约定。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` §1 / §2 | 范围仍围绕 envelope、routing、callback schema 和共享契约真相展开 | 会把 `L0-bus` 写回 `L0-core` 的职责 |
| 旧版 `03-详细设计.md` §2 | 没有清晰区分本轮实现范围、P1 后续能力和其他文档范围 | 实现者容易把配置说明、测试矩阵、运维手册和生产 adapter 全部混进详细设计 |
| 旧版 `03-详细设计.md` 接口范围 | Query、Operations Job、outbound event、projection 和 backend capability 边界不完整 | 无法覆盖新版概要设计的 read-only output 和 recovery 闭环 |
| 旧版 `03-详细设计.md` 状态范围 | delivery / feedback / retry / DLQ / replay / projection 状态没有形成完整范围声明 | 后续状态机章节容易漏项 |
| 旧版 `03-详细设计.md` 配置范围 | 未明确详细设计与 `04-配置说明.md` 的边界 | 容易在详细设计中写配置样例而忽略配置实现契约 |
| 当前 `02-概要设计.md` | 已经给出承接清单，但没有替代详细设计范围表 | 需要本 Step 把承接清单转成正式详细设计范围 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 本轮主线 | envelope / routing / callback schema | publication acceptance -> delivery -> feedback -> recovery -> read-only output | 对齐新版需求、架构和概要设计 |
| 范围表达 | 以旧对象和粗略章节表达 | 以模块、对象、接口、事件、job、状态机和横切契约表达 | 支撑后续 1:1 实现 |
| P1 能力 | 散落或隐含 | 显式列出后续能力和本轮处理口径 | 防止实现阶段范围膨胀 |
| 文档边界 | 详细设计混入配置、测试、实施和运维内容 | 详细设计只写实现契约，其他文档各自承接 | 保持文档职责清晰 |
| 实现者交付 | 不清楚拿到 `03` 后能写到什么程度 | 明确应能完成 P0 可运行代码骨架和可验证闭环 | 满足“按详细设计 1:1 还原实现”的要求 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：只覆盖最小发布和投递路径 | 文档短、实现快 | feedback、recovery、audit、projection 和幂等会在实现时临时补，破坏主线闭环 | 不采用 |
| 方案 B：覆盖 P0 闭环和必要横切契约，P1 只保留扩展边界 | 能支撑可运行闭环，又不会把生产 MQ / UI / 运维专项提前写死 | 需要 Step 6~15 比较细地展开 | 采用 |
| 方案 C：一次覆盖所有生产 adapter、高可用、UI、SDK 和治理集成 | 看似完整 | 范围过大，且多个上游决策未稳定，会拖慢核心闭环实现 | 不采用 |

推荐方案：方案 B。

原因：

- `L0-bus` 是基础运行主干，P0 必须形成完整闭环，不能只写入口或只写 delivery。
- 生产 adapter、高可用和 UI 等能力需要稳定运行场景和部署条件，放入本轮会污染详细设计。
- 方案 B 能让另一个 agent 先完成可编译、可测试、可运行的默认路径，同时为后续 adapter 和运维增强保留正确接缝。

---

## 7. 结构化中间产物

### 7.1 设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 定义 P0 传递闭环实现契约 | 覆盖 publication acceptance、delivery、feedback、recovery、read-only output | 实现者可以按模块完成 command、consumer、job、query 和 outbound event 路径 |
| 定义对象和状态实现契约 | 把概要设计 §6 / §9 的对象和状态补成 Rust 类型、字段、函数和状态矩阵 | 实现者可以创建 domain model、value object、record、policy 和 enum |
| 定义端口和持久化边界 | 把 repository、unit of work、transport backend、outbox publisher、projection repository 等补成 trait | 实现者可以实现默认 adapter、test double 和替换边界 |
| 定义函数级处理流 | 把概要设计 §8 的处理流展开到 handler -> service -> domain -> repository / port -> event / result | 实现者可以还原关键函数调用链、事务边界和失败分支 |
| 定义横切契约 | 覆盖错误、幂等、并发、配置引用、审计、可观测性和测试切口 | 实现者不用临时发明错误模型、锁、配置加载、审计和测试结构 |
| 定义实施承接边界 | 把详细设计可实现内容交给实施计划继续拆分 | 实施计划可以按功能边界和依赖顺序组织开发 |

### 7.2 本轮范围表

| 范围 | 必须展开到的深度 |
|---|---|
| 实现单元与文件布局 | crate / module / file / binary / test 目录级别，具体由 Step 4 定义 |
| 模块实现契约 | 每个主要模块的职责、对象、trait、service、handler、repository、error、测试切口 |
| 对象实现契约 | struct / enum / value object / policy 的字段、类型、函数签名、Rustdoc 注释和禁止事项 |
| 协议实现契约 | Command / Query / Consumer / Event / Job 的 DTO、response、schema、handler、错误映射 |
| 函数级处理流 | 逐接口说明对象.函数(Type 参数名) 调用、事务、幂等、audit、event 和失败分支 |
| 状态机 | 状态枚举、允许迁移、禁止迁移、状态守卫、非法迁移错误和状态测试 |
| 持久化与一致性 | repository、unit of work、transaction ordering、history / audit / outbox / projection 一致性 |
| 配置实现契约 | RuntimeConfig、ConfigLoader、ConfigValidator、builder 注入和禁止配置化校验 |
| 可观测性与测试切口 | audit、trace、metric、log、report evidence、contract test 和 negative test |

### 7.3 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、用户故事、业务规则、数据归属重新定义 | `00-需求文档.md` |
| 系统上下文、限界上下文、技术选型、部署拓扑重新取舍 | `01-架构设计.md` / 架构专项 |
| 主要组成部分、关键对象、接口名、处理流名、状态集合重新命名 | `02-概要设计.md` 对应 Step |
| L0-core 的 Event、Error、TraceContext、Metadata、ActorRef、CloudEvents schema 定义 | `projects/L0-core` |
| 完整配置 JSON 示例、默认值、配置项填写说明、环境变量说明 | `04-配置说明.md` |
| 完整测试矩阵、测试脚本、测试报告和证据归档格式 | `05-测试方案.md` |
| 验收步骤、验收证据和验收通过条件 | `06-验收标准.md` |
| 开发排期、commit boundary、编码顺序、实施报告和交付节奏 | `07-实施计划.md` |
| 生产 MQ / DB / scheduler / dashboard / alerting 部署细节 | 运维手册 / 部署文档 / 后续专项 |
| 网关认证、授权策略、租户安全策略 | 网关 / 安全文档 / identity / governance 相关仓 |

### 7.4 本轮必须保守处理的待确认输入

| 待确认输入 | 本轮保守处理 |
|---|---|
| late ack 如何影响 failed / DLQ delivery | 不直接把 failed / DLQ 改回 completed，进入 Step 12 / Step 18 继续说明 |
| projection missing 是否自动 rebuild | Query 返回 consistency marker；rebuild 由受控 job / operator 触发 |
| backend capability change 是否自动重排 delivery | 只发布 capability changed event / view / audit，不自动重排 delivery |
| 是否新增 `BackendCapabilityStatus` | 不新增 bus truth 状态集合，只在 view / audit 表达能力变化 |
| `PublicationRejectedEvent` 是否对外传播 | 本轮按传播 rejected fact 推进，schema 和消费者边界由 Step 8 定义 |
| `GetPublicationAcceptance` 是否保留独立 Query | 本轮保留独立 Query，DTO 和 not-found 行为由 Step 8 / Step 9 定义 |

### 7.5 实现者可完成代码范围

| 代码范围 | 完成标准 |
|---|---|
| Rust 项目骨架 | 目录、crate / module、package name、binary / library 边界清楚 |
| 领域模型 | 关键对象、状态 enum、状态守卫、policy 和错误类型可按文档创建 |
| 应用服务 | command、query、consumer、job service 函数签名和处理职责清楚 |
| 端口与适配 | repository、unit of work、transport backend、outbox publisher、projection repository、clock / id generator trait 清楚 |
| 默认可验证路径 | 可以实现 in-memory / fake adapter、contract test 和核心闭环集成测试 |
| 配置装配 | runtime config、validator、builder、adapter constructor 和禁止配置化规则清楚 |
| 横切能力 | transaction ordering、idempotency、history、audit、outbox、projection、trace / metric / log marker 清楚 |

---

## 8. 回填草稿

正式 `03-详细设计.md` 的 §2 应从本文件摘录并收敛为以下结构：

```md
## 2. 本次详细设计目标与范围

### 2.1 设计目标

从 `design-calibration/03_ddd_step_02_scope.md` §7.1 摘录。

### 2.2 本轮实现范围

从 `design-calibration/03_ddd_step_02_scope.md` §7.2 摘录，并补充 Step 4 确认后的实现单元名称。

### 2.3 非范围

从 `design-calibration/03_ddd_step_02_scope.md` §7.3 摘录。

### 2.4 保守推进项

从 `design-calibration/03_ddd_step_02_scope.md` §7.4 摘录，并在 Step 18 与风险表保持一致。
```

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 默认 adapter 范围如何裁剪 | A. 只定义 trait；B. 定义 trait + in-memory / fake 默认可验证 adapter；C. 定义生产 MQ adapter | 推荐 B | 只定义 trait 不足以验证闭环；生产 adapter 过早。B 能支撑测试和首批实现 |
| `PublicationRejectedEvent` 是否进入本轮协议契约 | A. 不定义；B. 定义 rejected outbound event；C. 只写 audit 不传播 | 推荐 B | 概要设计已按传播 rejected fact 推进，且 rejected 是接入事实，适合形成外部可观察事实 |
| `GetPublicationAcceptance` 是否作为独立 Query | A. 合并进 transport view；B. 保留独立 Query；C. 只从 audit 查 | 推荐 B | acceptance 是接入事实，独立 Query 能减少下游为查接入结果而读取复杂 projection |
| backend capability 是否新增状态机 | A. 新增 `BackendCapabilityStatus`；B. 只做 view / audit / event，不做 bus truth 状态；C. 完全后移 | 推荐 B | 能表达能力变化，又不把外部后端状态误写成本仓 truth |

---

## 10. 进入下一步条件

```text
本轮详细设计要实现什么、不实现什么已经清楚。
P0 闭环、必须覆盖的对象 / 接口 / 事件 / job / 状态机已经列明。
P1 / 后续能力和其他文档归属已经分离。
可以进入 Step 3,继续收稳编码规范、语言 / runtime 和仓库约束。
```
