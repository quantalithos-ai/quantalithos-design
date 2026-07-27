# L3-capability-hub 01 架构 Step 6: 容器 / 部署架构

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 6
> 回填章节: `01-架构设计.md` §7 容器 / 部署架构
> 创建日期: 2026-07-07
> 状态: `completed_stop_review`
> 当前模式: full-restart
> 本轮口径: 基于新版 `00-需求文档.md`、`01_arch_step_03_responsibility_boundary.md`、`01_arch_step_04_system_context.md` 和 `01_arch_step_05_bounded_context_subdomains.md` 推导运行承载;旧 `01-架构设计.md` §6 只作 historical material / 差异审计输入。
> 文档级 flow: `design-calibration/01_architecture_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 6 容器 / 部署架构 |
| 输出文件 | `design-calibration/01_arch_step_06_container_deployment.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/01_architecture_calibration_flow.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计文档编写通则.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取 SOP / 书写规范 | yes:`架构设计讨论流程_SOP.md` Step 6;`架构设计书写规范.md` §4.7 |
| 已读取前序输入 | yes:`01_arch_step_01_requirement_baseline.md`;`01_arch_step_02_goals_constraints.md`;`01_arch_step_03_responsibility_boundary.md`;`01_arch_step_04_system_context.md`;`01_arch_step_05_bounded_context_subdomains.md`;正式 `00-需求文档.md` |
| 已读取需求中间产物 | yes:`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_13_non_functional_requirements.md`;`00_req_step_15_risks_open_questions.md` |
| 已读取历史输入 | yes:旧 `projects/L3-capability-hub/01-架构设计.md` §6 作为 historical material |
| 已读取参考粒度 | yes:`L1-governance` Step 6;`L3-method-library` Step 6;`L0-sdk` Step 6 |
| 当前模式 | full-restart,每 Step 停审 |
| 进入条件 | pass:用户已确认从 Step 5 进入 Step 6 |
| next_allowed_action | Step 6 已完成,等待用户确认后进入 Step 7。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块骨架 | done | 本 Step 模块表 | pass | 进入运行承载角色思考。 |
| 运行承载角色:先思考 | done | 问题回答 / 诊断 / 取舍 | pass | 进入运行承载角色写入。 |
| 运行承载角色:再写入 | done | 运行单元候选表项 | pass | 进入运行边界图思考。 |
| 运行边界图:先思考 | done | 图对象裁剪 / 关系语义 | pass | 进入运行边界图写入。 |
| 运行边界图:再写入 | done | 容器 / 部署架构图 | pass | 进入部署关系和通信方式思考。 |
| 部署关系和通信方式:先思考 | done | 可同部署 / 必须逻辑可分 / 通信边界 | pass | 进入部署关系和通信方式写入。 |
| 部署关系和通信方式:再写入 | done | 运行单元说明表 / 部署说明 / 通信方式结论 | pass | 进入运行承载停审。 |
| 运行承载停审 | done | 每个运行承载对 Step 5 语义边界影响 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 可保留 / 必须废弃旧口径表 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 下一步门禁 | pass | 等待用户确认 Step 7。 |

---

## 2. 必读文档

### 2.1 公共规范

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | Step 6 输出容器 / 部署架构图、运行单元说明、部署关系和通信方式结论。 | 本 Step 只讨论运行承载角色,不写源码目录、接口协议、事件 schema、数据库、handler、repository、worker 实现或部署脚本。 |
| `standards/document/架构设计书写规范.md` §4.7 | 容器 / 部署架构指本仓运行时正式承载单元及承接关系,不等同于镜像、进程、K8s workload 或 C4 Container 严格实现。 | 图中必须以本仓运行承载为主语,外部对象只能作为运行对接边界。 |
| `standards/document/设计文档讨论中间产物规范.md` | Step 文件必须先思考后写入,并保留 flow / ledger 恢复状态。 | 本文件保留模块级判断、结构化产物和停审状态;正式 `01` 不写入。 |
| `standards/document/设计文档编写通则.md` | 架构设计先边界后实现,正式正文只能承载收口结论。 | 本 Step 不能反向改变 Step 3~5 的职责、上下文和子域语义。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 容器图不得暗示未闭口 port、repository、state、DTO、event、artifact、evidence 或 implementation boundary。 | 本 Step 不写 API、event、state、表、cache、outbox、配置 key 或测试证据格式。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `L0-core` 是唯一编译期依赖候选;`L0-bus` 是事件协作;外部 MCP / A2A / API 是运行期外部来源。 | 运行承载不能把 `L0-bus`、governance、method-library、runtime、tools、SDK 或外部 provider 写成源码级业务依赖。 |

### 2.2 本仓输入

| 文档 | 读取结论 | 对本 Step 的影响 |
|---|---|---|
| `01_arch_step_03_responsibility_boundary.md` | 本仓做 access truth、identity、registry、descriptor、risk / review、governance seam、body-free method relation、formal exposure、traceability / change impact 和派生维护 / safe summary 边界。 | 运行承载必须服务这些职责,不得新增 provider runtime、execution、cost、KMS、marketplace 或 SDK client 职责。 |
| `01_arch_step_04_system_context.md` | 上下文对象为外部 MCP / A2A / API 来源、`L0-core / L0-bus`、`L1-governance`、`L3-method-library`、`L2-runtime / L2-tools`、`L0-sdk`,外围 console / marketplace / observability 只入表。 | 图中外部对象只能作为运行时对接边界出现,不能重画系统上下文或扩大主图。 |
| `01_arch_step_05_bounded_context_subdomains.md` | 内部语义结构为五个核心子域、四个支撑子域和五类本地索引 / 投影 / 引用。 | 运行单元承载这些语义,但不能反向重划子域或按旧 MCP / A2A / Provider / Cost / Access 切容器。 |
| 正式 `00-需求文档.md` §7 / §9 / §12 | 核心能力闭环和能力级接口面已按 identity、registry、descriptor、governance / method relation、formal exposure / change awareness 收束。 | 同步入口、异步协作、后台维护和受控消费承载必须覆盖这些能力面,但不写接口名或协议。 |
| `00_req_step_11_data_ownership.md` | 数据分为 truth、snapshot、ref 和 forbidden body。 | 运行承载必须区分 access truth carrier 与 derived / consumer / trace carrier,不得让快照和引用反写真相。 |
| `00_req_step_13_non_functional_requirements.md` | 核心闭环不被外围增强拖垮;禁止正文;关键变化可追溯;派生视图可滞后但可解释。 | 部署关系要保留逻辑可分,同时允许 P0 同部署以降低起步复杂度。 |
| `00_req_step_15_risks_open_questions.md` | governance seam、method relation、descriptor 分类、secret safe summary、SDK exposure、外围边界和 API / DTO / state / boundary 仍未闭口。 | 本 Step 不能通过容器名或运行单元名提前关闭这些待确认项。 |

### 2.3 历史材料与参考粒度

| 文档 | 当前定位 | 本 Step 处理 |
|---|---|---|
| 旧 `projects/L3-capability-hub/01-架构设计.md` §6 | historical material | 只审计旧 `capability-hub-api / registry service / provider service / access decision service / cost accounting / PostgreSQL / KMS / provider` 图。 |
| `L1-governance` Step 6 | reference material | 参考同步入口、异步输入、后台维护、truth carrier、derived carrier 和外部交接边界的粒度。 |
| `L3-method-library` Step 6 | reference material | 参考“运行角色名 + 逻辑可分 / 阶段可同部署 + 技术产品后移”的写法。 |
| `L0-sdk` Step 6 | reference material | 参考 SDK exposure 不等于 SDK client / package 部署结构的裁剪方式。 |

---

## 3. 整体模块骨架

Step 6 描述运行承载角色,不是代码组织、协议交互图、基础设施部署手册、子域结构图或数据库 / 消息产品选型。

| 模块 | 本 Step 回答的问题 | 本 Step 不回答的问题 | 输出 |
|---|---|---|---|
| 运行承载角色 | 本仓运行时需要哪些正式承载角色。 | 不写 crate、bin、service、handler、repository、目录、进程名或技术产品名。 | 运行单元候选表项。 |
| 运行边界图 | 本仓运行承载与外部来源、相邻关系、下游消费、事件协作、truth 和派生承载如何连接。 | 不写 API、event、topic、DTO、port、事务或运行时顺序。 | 容器 / 部署架构图。 |
| 部署关系和通信方式 | 哪些单元必须逻辑可分,哪些可阶段性同部署。 | 不写 Docker、K8s、端口、资源、实例数、环境变量、重试、fallback 或运维脚本。 | 运行单元说明表、部署说明、通信方式结论。 |
| 运行承载停审 | 每个运行承载是否反向改变 Step 5 语义边界。 | 不重新划分子域,不提前进入数据所有权或依赖方向。 | 停审记录。 |
| 旧材料差异审计 | 旧运行承载哪些可保留为抽象方向,哪些必须废弃。 | 不继承旧 Draft 状态、旧技术栈、旧服务名或旧四子域。 | 差异审计表。 |
| 自检与停审 | 本 Step 是否足以进入 Step 7。 | 不提前通过依赖方向、数据一致性、通信协议、技术选型或 ADR 门禁。 | 自检表和下一步许可。 |

---

## 4. 模块思考记录

### 4.1 运行承载角色:先思考

问题回答:

- `L3-capability-hub` 需要同步入口承载,用于承接 identity、registry、descriptor、governance seam、method relation、formal exposure 和追溯读取 / 变更的正式入口。
- 外部 MCP / A2A / API 来源需要作为运行时外部边界进入图,但不应成为 provider runtime、调用网关、failover、retry、routing 或 invocation result 容器。
- governance、method-library、runtime、tools、SDK、console、marketplace 和 observability 需要作为运行对接边界或消费边界出现,但不得成为本仓内部运行单元。
- 内部至少要区分同步入口、异步协作、后台维护与派生、access truth carrier、derived / consumer / trace carrier。
- `L0-bus` 是事件协作运行边界,不是本仓业务 truth 或源码依赖;outbox、topic、consumer group、payload 均不在本 Step 定义。

诊断:

- 旧 §6 的 `provider service` 会把 adapter descriptor 误写成 provider runtime / provider contract。
- 旧 §6 的 `access decision service` 会把 formal exposure 和 controlled consumer view 误写成 runtime allow / deny execution。
- 旧 §6 的 `cost accounting / cost worker` 会把 cost / billing 非目标重新带入本仓。
- 旧 §6 的 `PostgreSQL / KMS / Vault / external providers` 作为容器会提前锁定存储、安全基础设施和 provider 执行依赖。

取舍:

- 使用运行角色名表达承载单元:同步入口、异步协作、后台维护与派生、正式 access truth 承载、受控消费 / 追溯派生承载。
- 外部来源、相邻仓、下游消费和事件协作只作为外部运行边界出现。
- 不建立 `provider service`、`access decision service`、`cost worker`、`KMS`、`marketplace publisher` 或 `runtime gateway` 容器。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否使用运行角色名 | pass | 运行单元均为架构承载角色,不是 service / repository / handler / worker 实现名。 |
| 是否保护 access truth | pass | access truth carrier 与 derived / consumer carrier 已语义分离。 |
| 是否避免旧技术产品 | pass | 未选 PostgreSQL、KMS、Vault、cache、outbox、provider client 或消息产品。 |
| 是否可进入“运行承载角色:再写入” | pass | 可转成运行单元表项。 |

### 4.2 运行承载角色:再写入

| 对象 | 类型 | 主要职责 | 运行关系 | 说明 |
|---|---|---|---|---|
| 下游消费 / 管理入口边界 | 运行时对接的正式外部边界 | 承接 runtime、tools、SDK、console 和审计 / 管理入口对本仓正式接入事实的消费或管理进入点。 | 通过入口关系进入同步入口承载,或消费派生 / 追溯承载。 | 它只作为外部运行边界出现,不属于本仓内部运行承载。 |
| 外部能力来源边界 | 运行时对接的正式外部边界 | 承接外部 MCP / A2A / API 来源引用、能力来源语境和接入对象背景。 | 被同步入口或异步协作承载消费为接入事实输入线索。 | 不代表本仓执行外部调用、provider runtime、retry、failover 或 route。 |
| 相邻关系输入边界 | 运行时对接的正式外部边界 | 承接 governance result ref / safe summary、method asset ref 和 body-free relation 语境。 | 被同步入口或异步协作承载消费。 | 不拥有 approval、Policy、shared_rules 或 method body。 |
| Capability Hub 同步入口承载 | 同步入口单元 | 承接 identity、registry、descriptor、seam、relation、formal exposure、追溯读取和受控消费读取的正式入口。 | 处理后推进 access truth 承载,并读取派生 / 追溯承载形成响应。 | 不定义 API、RPC、route、command、query、handler、auth 或错误 schema。 |
| Capability Hub 异步协作承载 | 异步消费单元 | 承接治理结果变化、方法资产关系线索、下游消费影响、能力接入变化协作和外部变化输入。 | 消费相邻关系输入边界与 `L0-bus` 运行对接边界,处理后推进或标记 access truth。 | 不定义 event name、topic、payload、consumer group、outbox 或 relay。 |
| Capability Hub 后台维护与派生承载 | 后台处理单元 | 承接 registry maintenance、reconciliation、consumer view 维护、搜索 / 导出摘要、审计友好材料和外围发现派生。 | 从 access truth 承载派生结果,写入派生 / 追溯承载或输出外部交接材料。 | 只能派生和维护,不得创建、批准、关闭或覆盖核心 access truth。 |
| Capability Hub access truth 承载 | 正式存储承载 | 承载 capability identity、registry、adapter descriptor、governance seam relation、method relation、formal exposure、change / consumer impact truth。 | 被同步入口、异步协作和后台维护共同依赖。 | 这是本仓正式 access truth 承载,不写具体数据库、表结构、事务或存储产品。 |
| 受控消费 / 追溯派生承载 | 正式存储承载 | 承载 controlled consumer view、查询 / 搜索摘要、导出摘要、追溯读取材料、downstream impact summary 和审计友好摘要。 | 由后台维护与派生承载维护,被同步入口和下游消费边界读取。 | 可重建、可滞后、可解释,不得成为第二份 access truth。 |
| `L0-bus` 运行对接边界 | 正式基础设施依赖 | 支撑 capability access fact 变化输出和外部变化输入的事件协作。 | 与异步协作承载形成运行对接。 | 不形成业务源码依赖,不拥有本仓业务 truth。 |

### 4.3 运行边界图:先思考

问题回答:

- 图的主语必须是 `L3-capability-hub` 的正式运行承载,外部对象只作为运行边界出现。
- 图中应表达入口、消费、处理、承载 / 依赖关系,不表达接口协议、事件传播顺序、数据流、事务或部署环境。
- access truth carrier 和受控消费 / 追溯派生承载必须同时出现,否则后续数据所有权容易把 consumer view 反写成 truth。

诊断:

- 如果图中写 `provider service / access decision / cost worker`,会复活旧职责边界。
- 如果图中写 PostgreSQL、KMS、provider API client、cache 或 outbox,会提前进入技术选型和配置设计。
- 如果图中只画外部 MCP / A2A / API 到 runtime/tools,会变成系统上下文或执行调用链,不是本仓运行承载。

取舍:

- 采用“本仓运行边界框 + 内部承载纵向主链 + 外部边界在框外”的画法。
- 内部主链为同步入口 / 异步协作 -> access truth -> 后台派生 -> 受控消费 / 追溯派生。
- `L0-bus` 单独作为事件协作运行对接边界,不画出 topic、outbox 或消息后端。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否以本仓运行承载为主语 | pass | 外部对象只作为边界。 |
| 是否避免协议和实现细节 | pass | 未写 API、topic、event、DTO、DB、KMS 或 provider client。 |
| 是否区分 truth 与派生 | pass | access truth 承载和受控消费 / 追溯派生承载分离。 |
| 是否可进入“运行边界图:再写入” | pass | 可形成容器 / 部署架构图。 |

### 4.4 运行边界图:再写入

```text
+------------------------------+      +------------------------------+
| 下游消费 / 管理入口边界       |      | 外部能力来源边界             |
| runtime / tools / SDK / UI    |      | external MCP / A2A / API     |
+--------------+---------------+      +--------------+---------------+
               | 入口 / 消费                         | 来源
               v                                      v

      +===============================================================+
      |              L3-capability-hub 正式运行承载                   |
      |                                                               |
      |  +---------------------------+   +---------------------------+ |
      |  | Capability Hub 同步入口   |   | Capability Hub 异步协作   | |
      |  | sync entry                |   | async collaboration       | |
      |  +-------------+-------------+   +-------------+-------------+ |
      |                | 处理                          | 处理 / 消费   |
      |                v                               v                |
      |  +-------------+-------------------------------+-------------+ |
      |  |             Capability Hub access truth 承载               | |
      |  |             identity / registry / descriptor / exposure    | |
      |  +-------------+-------------------------------+-------------+ |
      |                | 处理 / 派生                                    |
      |                v                                                |
      |  +-------------+-------------+   +---------------------------+ |
      |  | 后台维护与派生承载        |-->| 受控消费 / 追溯派生承载  | |
      |  | maintenance / derivation  |   | consumer / trace carrier  | |
      |  +-------------+-------------+   +-------------+-------------+ |
      |                | 输出 / 交接                    | 读取 / 消费   |
      +================+=================+==============+==============+
                       |                 |
                       v                 v
        +--------------+------+   +------+------------------+
        | L0-bus 运行对接边界 |   | 相邻关系输入边界       |
        | event collaboration |   | governance / method    |
        +---------------------+   +-------------------------+
```

该图表达 `L3-capability-hub` 的正式运行承载结构,不表达源码目录、接口协议、事件名、数据库表、技术产品、部署参数或运行时调用顺序。

图示说明:

- `Capability Hub 同步入口` 和 `Capability Hub 异步协作` 是运行入口差异,不是两套 capability access truth。
- `Capability Hub access truth 承载` 是本仓唯一正式 access truth 承载;受控消费、追溯、搜索、导出和审计摘要不得反写真相。
- 外部能力来源边界只提供接入对象和来源语境,不表示本仓执行外部 MCP / A2A / API 调用。
- 相邻关系输入边界只承接 governance result ref / safe summary 与 method asset ref,不拥有治理正文或方法正文。
- `L0-bus` 是事件协作运行边界,不是业务源码依赖或本仓内部模块。

### 4.5 部署关系和通信方式:先思考

问题回答:

- 同步入口、异步协作和后台维护派生需要逻辑可分,因为入口请求、外部变化输入、派生维护、追溯材料和消费快照的节奏不同。
- P0 可以把同步入口、异步协作和后台维护派生同部署,但职责边界必须清楚;后续可因吞吐、隔离、恢复、重建、导出或审计压力拆分。
- access truth 承载和受控消费 / 追溯派生承载即使物理同库,架构语义也必须分离。
- 通信方式只确认入口、消费、处理、承载 / 依赖和事件协作运行边界,不选择 HTTP、RPC、SDK facade、event topic、outbox、repository 或 transaction。

诊断:

- 旧单服务 + PostgreSQL + KMS + bus(outbox) 图把部署起步、技术产品和业务职责混成一层。
- 如果当前写 Docker、K8s、端口、环境变量、实例数、存储引擎或消息产品,会进入实施 / 配置文档。
- 如果当前写 provider retry、failover、route、quota、cost aggregation 或 KMS lookup,会让旧 Provider Contract / Cost / KMS 口径回流。

取舍:

- 保留“逻辑可分、阶段可同部署”的口径。
- 存储产品、消息产品、缓存、搜索、KMS/Vault 绑定和外部 provider adapter 机制后移到技术选型、配置、概要 / 详细设计中按边界重裁。
- 通信方式结论只列运行关系和不展开项。

本模块门禁:

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否区分逻辑可分与实际部署 | pass | P0 可同部署,架构上保持同步 / 异步 / 后台 / truth / 派生分离。 |
| 是否避免部署实施细节 | pass | 未写 Docker、K8s、端口、资源、实例数或环境变量。 |
| 是否避免协议和数据细节 | pass | 未写 API、event、repository、事务、cache、projection 或 schema。 |
| 是否可进入“部署关系和通信方式:再写入” | pass | 可形成部署说明和通信方式表。 |

### 4.6 部署关系和通信方式:再写入

#### 4.6.1 部署说明

本章只固定逻辑运行承载结构,不固定部署平台、进程边界、存储产品或消息产品。`Capability Hub 同步入口承载`、`Capability Hub 异步协作承载` 和 `Capability Hub 后台维护与派生承载` 在早期可以同部署,但架构上必须保持逻辑可分,以便分别处理同步入口压力、外部变化输入失败、派生重建、消费快照维护、审计摘要和外围导出。`Capability Hub access truth 承载` 与 `受控消费 / 追溯派生承载` 即使物理同库也必须语义分离。

#### 4.6.2 通信方式结论

| 通信关系 | 架构口径 | 不在本 Step 展开 |
|---|---|---|
| 下游消费 / 管理入口边界 -> 同步入口承载 | 同步入口和读取 / 变更入口关系。 | API、route、DTO、auth、SDK method、console action。 |
| 外部能力来源边界 -> 同步入口 / 异步协作承载 | 外部来源引用、接入对象和变化线索的消费关系。 | provider client、认证协议、runtime invocation、retry、failover、route。 |
| 相邻关系输入边界 -> 同步入口 / 异步协作承载 | governance result ref / safe summary 与 method asset ref 的关系输入。 | approval schema、Policy body、method body、事件名、topic。 |
| 同步入口 / 异步协作承载 -> access truth 承载 | 正式接入事实处理和承载关系。 | repository、事务、表结构、optimistic lock、状态枚举。 |
| access truth 承载 -> 后台维护与派生承载 | 从 truth source 触发维护、派生、对账和摘要整理。 | job 名、调度、重试、补偿算法、projection schema。 |
| 后台维护与派生承载 -> 受控消费 / 追溯派生承载 | 派生结果、追溯读取材料和消费快照承载关系。 | cache、index、search backend、export artifact、evidence alias。 |
| 异步协作承载 <-> `L0-bus` 运行对接边界 | capability access fact 变化输出和外部变化输入的事件协作边界。 | event name、payload、topic、outbox、consumer group、relay。 |

---

## 5. 运行承载停审

| 运行承载 | 对 Step 5 语义边界的影响 | 风险检查 | 停审结论 |
|---|---|---|---|
| Capability Hub 同步入口承载 | 只承接 identity、registry、descriptor、seam、relation、exposure 和读取入口,不新增语义 truth。 | 不得变成具体 API service、handler、SDK facade 或协议清单。 | pass |
| Capability Hub 异步协作承载 | 只承接外部变化、治理 / 方法关系输入和下游影响线索,不替代核心 truth。 | 不得把 event schema、topic、outbox、consumer group 或 relay 写成容器。 | pass |
| Capability Hub 后台维护与派生承载 | 只从 access truth 派生 consumer view、追溯材料、搜索 / 导出摘要和维护结果。 | 不得由 job、搜索、导出、对账或审计摘要创建新业务接入结论。 | pass |
| Capability Hub access truth 承载 | 承载本仓正式 access truth,不得与下游执行状态、provider runtime 或治理 / 方法正文合并。 | 不得指定数据库、表、事务、缓存、KMS、provider client 或存储实现。 | pass |
| 受控消费 / 追溯派生承载 | 服务受控消费、追溯读取、摘要和外围导出,不得成为第二 truth。 | 不得让 `CapabilityDecision` 类快照、search index、export 或 audit summary 反写 formal exposure。 | pass |
| 外部能力来源边界 | 只作为外部接入对象来源,不成为 provider runtime 容器。 | 不得写 provider failover、retry、routing、quota、cost 或 invocation result。 | pass |
| 相邻关系输入边界 | 只承接 governance / method ref 与 safe summary。 | 不得拥有 approval、Policy、shared_rules、method body 或 definition source truth。 | pass |
| `L0-bus` 运行对接边界 | 只作为事件协作基础设施依赖。 | 不得形成业务仓源码依赖或把 bus 写成本仓 truth store。 | pass |

---

## 6. 旧材料差异审计

### 6.1 可保留方向

| 旧材料方向 | 审计结论 | 当前承接 |
|---|---|---|
| `capability-hub-api` 对外入口 | 可保留为运行方向 | 抽象为 `Capability Hub 同步入口承载`,不继承 API、RPC、handler 或 service 名。 |
| registry 管理能力 | 可保留为 access truth 运行方向 | 抽象为同步入口、access truth 承载和后台维护派生,不按 MCP / A2A 协议拆容器。 |
| governance subscription / capability event | 可保留为事件协作方向 | 抽象为异步协作承载与 `L0-bus` 运行对接边界,不继承 event 名、topic 或 outbox。 |
| external MCP / A2A / API 来源 | 可保留为外部来源方向 | 抽象为外部能力来源边界,不继承 provider runtime 或 invocation。 |
| 下游 runtime / tools 消费能力 | 可保留为消费方向 | 抽象为下游消费边界和受控消费 / 追溯派生承载,不继承 QueryCapabilities / allow-deny decision。 |

### 6.2 必须废弃或挂起的旧口径

| 旧口径 | 处理方式 | 原因 |
|---|---|---|
| `provider service` / `Provider Contract` 容器 | 废弃 | 会把 adapter descriptor 膨胀为 provider runtime、secret、quota、route、cost、failover 和 retry。 |
| `access decision service` / `QueryCapabilities` 容器 | 废弃 | 会把 formal exposure 与 controlled consumer view 误写成 runtime allow / deny decision 或 Policy cache。 |
| `cost accounting` / `cost worker` | 废弃 | cost / billing / finance ledger 是非目标,不得进入运行承载主线。 |
| `KMS/Vault` 作为核心容器 | 废弃 | 本仓不拥有 secret 平台 truth;后续仅允许 secret ref / safe summary 边界再裁剪。 |
| `PostgreSQL`、cache、outbox、bus 产品名作为已定容器 | 废弃 | Step 6 不选择存储、缓存、消息产品或 outbox 实现。 |
| external providers 作为执行依赖 | 废弃 | 外部 MCP / A2A / API 是接入对象来源,不是本仓外部调用执行链。 |
| provider failover / retry / routing / quota / SLA / Policy 30s | 废弃 | 这些属于 runtime/provider/governance/配置或旧 NFR 口径,不得由 Step 6 固定。 |
| 旧正式 `01-架构设计.md` Step 7 之后依赖、数据、交互、技术和 ADR 结论 | 挂起 | 当前只完成 Step 6,后续必须按新 flow 逐 Step 重写。 |

---

## 7. 自检与停审

### 7.1 自检表

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否列出本 Step 必读文档 | pass | 已列公共规范、本仓输入、历史输入和参考粒度。 |
| 是否先搭整体模块再逐模块推进 | pass | 已按运行承载角色、运行边界图、部署关系和通信方式、运行承载停审、旧材料审计推进。 |
| 是否完成“先思考、再写入” | pass | 三个核心模块均包含思考记录和结构化写入。 |
| 是否形成容器 / 部署架构图 | pass | 已输出本仓运行边界框、内部承载和外部运行对接边界。 |
| 是否形成运行单元说明表 | pass | 已按对象、类型、主要职责、运行关系、说明输出。 |
| 是否形成部署说明和通信方式结论 | pass | 已说明逻辑可分、阶段可同部署和通信关系口径。 |
| 是否执行运行承载停审 | pass | 已检查每个运行承载是否反向改变 Step 5 语义边界。 |
| 是否避免正式 `01` 正文写入 | pass | 未修改 `01-架构设计.md` 正式正文。 |
| 是否避免提前进入后续 Step | pass | 未定义依赖方向、数据矩阵、接口协议、技术选型、部署参数或 ADR。 |
| 是否避免旧材料反推 | pass | 旧 §6 只作差异审计,未继承旧服务名、技术栈或旧子域。 |
| 是否可进入 Step 7 | pass | 运行承载结构已足以支撑依赖方向与层间约束讨论。 |

### 7.2 下一步门禁

| 下一步 | gate_status | 进入条件 |
|---|---|---|
| Step 7 依赖方向与层间约束 | pass_after_user_review | 只能使用本 Step 的运行承载、通信方式和停审结论作为输入,不得从旧 Step 7 或旧正式 `01` 直接继承依赖方向。 |
| 正式 `01-架构设计.md` 装配 | blocked | 必须等 Step 16 完成后统一装配。 |

---

## 8. 当前执行位置

| 当前模块 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step 6 completed_stop_review | pass | 容器 / 部署架构图、运行单元说明、部署说明、通信方式结论、运行承载停审、旧材料审计和自检均完成。 | `wait_user_review_to_step_07` |
