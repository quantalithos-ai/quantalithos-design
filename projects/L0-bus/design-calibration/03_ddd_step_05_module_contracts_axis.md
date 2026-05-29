# Step 5. 定义模块实现契约主轴

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 5
- 回填章节：`projects/L0-bus/03-详细设计.md` §5 模块实现契约

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_04_units_file_layout.md` | workspace 多 crate 布局、实现单元、目录树、文件职责、path dependency | 作为模块主轴的直接输入 |
| `projects/L0-bus/02-概要设计.md` §4 | Inbound / Operations、Application Services、Domain Model / Policies、Ports / Persistence / Projection / Adapters 分层 | 映射到详细设计实现模块 |
| `projects/L0-bus/02-概要设计.md` §5 | 六个业务主要组成部分和对象发现线索 | 确认每个业务主线跨哪些模块 |
| `projects/L0-bus/01-架构设计.md` §8 | 依赖方向、编译期依赖、运行期依赖、事件协作依赖和禁止依赖 | 约束模块依赖方向 |
| `standards/document/详细设计书写规范.md` §5.5 | 模块总览表、单模块小节固定结构、职责表和依赖图格式 | 作为正式 `03` 的模块契约写法 |

已确认结论：

```text
Step 5 的模块主轴采用 Step 4 的 workspace member:
contracts / domain / application / infra / api / worker / jobs。

业务主要组成部分不直接变成 crate。
每个业务主要组成部分会横跨 contracts、domain、application、infra 和入口模块。
```

依赖的前序 Step：

```text
Step 4 已确认 workspace 多 crate 架构和文件布局。
```

---

## 3. SOP 问题回答

### 3.1 本仓详细设计应该拆成哪些实现模块？

回答：

本仓详细设计按 7 个实现模块展开：

| 模块 | 所属实现单元 | 模块类型 |
|---|---|---|
| `contracts` | `crates/contracts` | 公共协议模块 |
| `domain` | `crates/domain` | 领域模型与策略模块 |
| `application` | `crates/application` | 用例编排与 port 定义模块 |
| `infra` | `crates/infra` | adapter、store、config、runtime wiring 模块 |
| `api` | `crates/api` | inbound API 入口模块 |
| `worker` | `crates/worker` | 常驻 worker / consumer 模块 |
| `jobs` | `crates/jobs` | 一次性 operations job 模块 |

`tests`、`scripts`、`artifacts`、`reports` 是验证和交付支撑目录，不作为业务实现模块进入 §5 主轴。

### 3.2 每个模块对应概要设计中的哪个主要组成部分或代码主体？

回答：

模块和概要设计主要组成部分不是一一对应关系。主要组成部分表达业务传递主线，模块表达代码职责和依赖方向。

| 概要设计主要组成部分 | 涉及模块 |
|---|---|
| 发布材料接入与传递语义形成 | `contracts`、`domain`、`application`、`api`、`worker`、`infra` |
| 订阅 delivery 推进 | `contracts`、`domain`、`application`、`worker`、`jobs`、`infra` |
| 结果反馈与幂等留痕 | `contracts`、`domain`、`application`、`api`、`worker`、`infra` |
| 失败恢复与重放准备 | `contracts`、`domain`、`application`、`api`、`jobs`、`infra` |
| 审计、历史与只读输出 | `contracts`、`domain`、`application`、`api`、`worker`、`jobs`、`infra` |
| 存储、引用与后端适配边界 | `application`、`infra`，并被 `api` / `worker` / `jobs` 通过 runtime wiring 使用 |

### 3.3 每个模块对外暴露什么？

回答：

| 模块 | 对外暴露 |
|---|---|
| `contracts` | Command / Query / Event / Job / View / Receipt / protocol error DTO |
| `domain` | 领域对象、状态 enum、policy、领域错误和领域构造函数 |
| `application` | application service、port trait、application command / result、application error |
| `infra` | config、runtime builder、adapter implementation、in-memory default path |
| `api` | API handler、DTO mapper、`bus-api` binary entry |
| `worker` | worker runner、consumer loop、`bus-worker` binary entry |
| `jobs` | job runner helper、operation binary entry |

### 3.4 每个模块允许依赖哪些模块，禁止依赖哪些模块？

回答：

| 模块 | 允许依赖 | 禁止依赖 |
|---|---|---|
| `contracts` | `core-contracts`、serde 类基础依赖 | `domain`、`application`、`infra`、`api`、`worker`、`jobs` |
| `domain` | `contracts`、`core-contracts` | `application`、`infra`、`api`、`worker`、`jobs`、MQ / DB SDK |
| `application` | `domain`、`contracts`、`core-contracts` | `infra`、`api`、`worker`、`jobs`、具体 MQ / DB SDK |
| `infra` | `application`、`domain`、`contracts`、外部 adapter 依赖 | `api`、`worker`、`jobs` |
| `api` | `application`、`contracts`、`infra` | `worker`、`jobs`、直接依赖 MQ / DB SDK 改写 truth |
| `worker` | `application`、`contracts`、`infra` | `api`、`jobs`、直接绕过 application 改写 domain |
| `jobs` | `application`、`contracts`、`infra` | `api`、`worker`、直接绕过 application 改写 domain |

### 3.5 哪些对象、trait、handler、repository 应归属于哪个模块？

回答：

| 类别 | 归属模块 | 说明 |
|---|---|---|
| Command / Query / Event / Job DTO | `contracts` | Step 8 继续定义协议契约 |
| View / Receipt / protocol error DTO | `contracts` | 供 API、worker、jobs、下游只读消费使用 |
| 领域对象 / 状态 enum / policy | `domain` | Step 6 继续逐模块定义对象实现契约 |
| application service | `application` | Step 9 继续定义函数级处理流 |
| port trait / repository trait / UnitOfWork trait | `application` | Step 7 继续定义 trait / port 契约 |
| repository implementation / memory store | `infra` | Step 7 / Step 11 继续定义 adapter 和持久化契约 |
| config / runtime builder | `infra` | Step 14 继续定义配置引用与外部依赖绑定 |
| API handler / DTO mapper | `api` | Step 8 / Step 9 继续定义协议和处理流 |
| worker runner / consumer loop | `worker` | Step 8 / Step 9 继续定义 event consumer 和 worker flow |
| operation job binary | `jobs` | Step 8 / Step 9 继续定义 job 协议和执行流 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` | 模块主轴仍围绕旧 envelope / routing / callback schema | 与新版业务主线和 Step 4 workspace 布局不一致 |
| 旧版 `03-详细设计.md` | 没有清晰说明业务主要组成部分和实现模块的差异 | 容易按业务组成部分建 crate，导致横切 port / transaction / DTO 重复 |
| 当前 Step 4 | 已经有 crate / 文件布局，但还缺模块职责、暴露内容和依赖方向 | Step 6~8 无法稳定归属对象、trait、handler、repository |
| 后续 Step 风险 | 若 Step 5 不收稳模块主轴，Step 6 可能把对象全集堆成一个全局表 | 违反新版详细设计“按模块展开”的要求 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 模块主轴 | 旧对象组和粗略目录 | `contracts / domain / application / infra / api / worker / jobs` | 对齐 Step 4 workspace 布局 |
| 业务组成部分与模块关系 | 容易一一对应 | 明确业务组成部分横跨模块 | 避免按业务主线拆 crate 造成循环依赖 |
| 对象归属 | 容易堆到全局对象章节 | 领域对象归 `domain`，协议归 `contracts`，port 归 `application`，实现归 `infra` | 支撑 Step 6~8 按模块展开 |
| 依赖方向 | 旧文不清楚 | 明确依赖只能从入口 / infra 指向 application / domain / contracts | 防止 domain 依赖 infra 或入口 |
| handler / worker / job | 旧文混合在流程里 | 分别归 `api`、`worker`、`jobs` | 运行入口清晰 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：按业务组成部分定义模块，如 `publication`、`delivery`、`recovery` | 业务语义直观 | port、DTO、事务、projection、adapter 会横切重复，容易循环依赖 | 不采用 |
| 方案 B：按实现职责和依赖方向定义模块 | 能稳定边界，支撑 Cargo workspace 强约束 | 业务主线需要通过映射表理解 | 采用 |
| 方案 C：只保留 Step 4 crate 表，不再写模块主轴 | 文档短 | Step 6~8 缺少归属规则，容易回到全局对象堆叠 | 不采用 |
| 方案 D：把 `infra` 拆成 `persistence`、`transport`、`projection` 多 crate | 细粒度清晰 | P0 文件和依赖过多，生产 adapter 未定，过早拆分 | 不采用 |

推荐方案：方案 B。

原因：

- 详细设计的目标是指导实现，不是重复概要设计的业务组成部分。
- `L0-bus` 的业务主线必须跨协议、领域、应用、适配、入口和 job 协同。
- 按实现职责拆模块能让后续对象、trait、handler、repository 都有稳定归属。

---

## 7. 结构化中间产物

### 7.1 模块总览表

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 依赖对象 |
|---|---|---|---|---|
| `contracts` | `crates/contracts` | 定义跨入口和跨仓可复用协议结构 | Command、Query、Event、Job、View、Receipt、protocol error DTO | `core-contracts` |
| `domain` | `crates/domain` | 维护 bus 传递语义、状态、不变量和领域策略 | 领域对象、状态 enum、policy、领域错误 | `contracts`、`core-contracts` |
| `application` | `crates/application` | 编排用例、事务、幂等、port 调用和事件写入 | application service、port trait、application error | `domain`、`contracts` |
| `infra` | `crates/infra` | 实现 port、store、adapter、projection、config 和 runtime wiring | repository adapter、runtime builder、config、in-memory default path | `application`、`domain`、`contracts` |
| `api` | `crates/api` | 接收同步 command / query / operations 请求 | API handler、DTO mapper、`bus-api` binary | `application`、`contracts`、`infra` |
| `worker` | `crates/worker` | 承接常驻 consumer / worker 运行循环 | worker runner、consumer loop、`bus-worker` binary | `application`、`contracts`、`infra` |
| `jobs` | `crates/jobs` | 承接一次性 operations job | job runner、operation binary | `application`、`contracts`、`infra` |

### 7.2 模块依赖图

#### 模块依赖图: L0-bus 模块实现主轴

```text
contracts
  |
  | use core shared contracts
  v
core-contracts

domain
  | depends on
  v
contracts

application
  | orchestrates
  v
domain
  |
  v
contracts

infra
  | implements ports defined by
  v
application
  | uses
  v
domain

api
  | calls application services through runtime wiring
  v
application
  ^
  | provides implementations
infra

worker
  | calls application services through runtime wiring
  v
application
  ^
  | provides implementations
infra

jobs
  | calls application services through runtime wiring
  v
application
  ^
  | provides implementations
infra
```

关键说明：

- 图表达模块依赖方向，不表达函数级处理流。
- `domain` 不得依赖 `application`、`infra`、`api`、`worker`、`jobs`。
- `application` 定义 port trait，`infra` 实现 port trait，入口模块通过 runtime wiring 使用实现。
- `api`、`worker`、`jobs` 是入口模块，不互相依赖。

### 7.3 模块职责表

#### `contracts` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/contracts` / `bus-contracts` |
| 对应概要设计主要组成部分 | API / 接口骨架、Command / Query / Event / Job / View |
| 主要责任 | 定义跨入口和跨仓可复用的协议 DTO，不承载领域不变量 |
| 对外暴露 | Command、Query、Event、Job、View、Receipt、protocol error DTO |
| 允许依赖 | `core-contracts`、serde 类基础依赖 |
| 禁止依赖 | `domain`、`application`、`infra`、`api`、`worker`、`jobs` |

#### `domain` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/domain` / `bus-domain` |
| 对应概要设计主要组成部分 | 六个主要组成部分中的 truth / state / policy / projection / reference / audit |
| 主要责任 | 维护 bus 传递语义、状态流转、不变量、禁止正文边界和恢复规则 |
| 对外暴露 | 领域对象、状态 enum、policy、领域错误 |
| 允许依赖 | `contracts`、`core-contracts` |
| 禁止依赖 | `application`、`infra`、`api`、`worker`、`jobs`、MQ / DB SDK |

#### `application` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/application` / `bus-application` |
| 对应概要设计主要组成部分 | Application Services、Port / Repository 边界、关键处理流 |
| 主要责任 | 编排 use case、事务、幂等检查、repository / backend port 调用和 outbound event 写入 |
| 对外暴露 | application service、port trait、application command / result、application error |
| 允许依赖 | `domain`、`contracts`、`core-contracts` |
| 禁止依赖 | `infra`、`api`、`worker`、`jobs`、具体 MQ / DB SDK |

#### `infra` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/infra` / `bus-infra` |
| 对应概要设计主要组成部分 | Ports / Persistence / Projection / Adapters、配置影响 |
| 主要责任 | 实现 application ports，提供 in-memory default path、config、runtime builder 和 adapter wiring |
| 对外暴露 | repository adapter、transport backend adapter、outbox adapter、projection adapter、runtime builder |
| 允许依赖 | `application`、`domain`、`contracts`、外部 adapter 依赖 |
| 禁止依赖 | `api`、`worker`、`jobs` |

#### `api` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/api` / `bus-api` |
| 对应概要设计主要组成部分 | `BusCommandApi`、`DeliveryFeedbackApi`、`RecoveryOperationsApi`、`BusQueryApi` |
| 主要责任 | 把外部同步请求映射到 application service，返回协议 response / receipt |
| 对外暴露 | API handler、DTO mapper、`bus-api` binary |
| 允许依赖 | `application`、`contracts`、`infra` |
| 禁止依赖 | `worker`、`jobs`、直接绕过 application 写 repository |

#### `worker` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/worker` / `bus-worker` |
| 对应概要设计主要组成部分 | `OutboxRelayTrigger`、`DeliveryWorkerTrigger`、`ReadOutputWorkerTrigger`、backend / timeout consumer |
| 主要责任 | 运行常驻 consumer / worker loop，把外部事件或调度信号转入 application service |
| 对外暴露 | worker runner、consumer loop、`bus-worker` binary |
| 允许依赖 | `application`、`contracts`、`infra` |
| 禁止依赖 | `api`、`jobs`、直接绕过 application 改写 domain |

#### `jobs` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/jobs` / `bus-jobs` |
| 对应概要设计主要组成部分 | outbox relay、delivery progression、retry cycle、projection rebuild、backend capability check |
| 主要责任 | 提供一次性 operations job 入口，复用 application service 和 infra runtime builder |
| 对外暴露 | job runner helper、operation binary |
| 允许依赖 | `application`、`contracts`、`infra` |
| 禁止依赖 | `api`、`worker`、直接绕过 application 改写 domain |

### 7.4 归属映射表

| 对象 / trait / handler / repository | 归属模块 | 后续展开 Step |
|---|---|---|
| Command / Query / Event / Job DTO | `contracts` | Step 8 |
| View / Receipt / protocol error DTO | `contracts` | Step 8 |
| `PublicationMaterial`、`PublicationAcceptance`、`TransportSemantic`、`PayloadBoundaryGuard` | `domain` | Step 6 |
| `DeliveryRecord`、`DeliveryAttempt`、`DeliveryLifecycle` | `domain` | Step 6 / Step 10 |
| `FeedbackResult`、`IdempotencyAnchor`、`DeliveryHistoryEntry` | `domain` | Step 6 / Step 10 |
| `RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、`FailureMaterial`、`RecoveryEligibilityPolicy` | `domain` | Step 6 / Step 10 |
| `BusAuditEntry`、`TransportViewProjection`、`FailureSummaryProjection`、`ReadOnlyOutputPolicy` | `domain` | Step 6 / Step 10 |
| `BackendCapabilityRef`、`BackendCapabilityPolicy` | `domain` | Step 6 |
| `PublicationAcceptanceService`、`DeliveryProgressionService`、`FeedbackRecordingService` | `application` | Step 9 |
| `RecoveryOrchestrationService`、`ReplayPreparationService`、`ReadOutputService` | `application` | Step 9 |
| repository trait、`UnitOfWork`、`TransportBackendPort`、`OutboxPublisherPort` | `application` | Step 7 |
| repository implementation、memory store、transport backend adapter | `infra` | Step 7 / Step 11 |
| `RuntimeConfig`、`ConfigLoader`、`ConfigValidator`、runtime builder | `infra` | Step 14 |
| `BusCommandApi`、`DeliveryFeedbackApi`、`RecoveryOperationsApi`、`BusQueryApi` handler | `api` | Step 8 / Step 9 |
| outbox relay、delivery、backend signal、timeout、read output worker | `worker` | Step 8 / Step 9 |
| operation job binary | `jobs` | Step 8 / Step 9 |

### 7.5 正式文档模块小节骨架

正式 `03` 的 §5 应按以下固定结构展开每个模块。本 Step 只收稳主轴，`对象实现契约`、`Trait / Port / Adapter 契约`、`关键函数`、`错误类型`、`测试切口`分别由 Step 6~16 回填。

```text
### 5.x <module> 模块
#### 5.x.1 模块职责
#### 5.x.2 文件与代码主体映射
#### 5.x.3 对象实现契约
#### 5.x.4 Trait / Port / Adapter 契约
#### 5.x.5 模块内关键函数
#### 5.x.6 模块错误类型
#### 5.x.7 模块测试切口
```

---

## 8. 回填草稿

正式 `03-详细设计.md` 的 §5 应从本文件摘录并收敛为以下结构：

```md
## 5. 模块实现契约

### 5.1 模块总览

从 `design-calibration/03_ddd_step_05_module_contracts_axis.md` §7.1 摘录。

### 5.2 模块依赖图

从 `design-calibration/03_ddd_step_05_module_contracts_axis.md` §7.2 摘录。

### 5.3~5.9 各模块实现契约

从 `design-calibration/03_ddd_step_05_module_contracts_axis.md` §7.3 的各模块职责表创建正式小节。
对象、trait、函数、错误和测试切口由 Step 6~16 回填。

### 5.10 归属映射

从 `design-calibration/03_ddd_step_05_module_contracts_axis.md` §7.4 摘录。
```

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 是否把 `projection` 从 `domain` 独立成 crate | A. 独立 crate；B. 暂归 `domain` 对象和 `infra` repository；C. 并入 `application` | 推荐 B | projection 既有只读对象也有存储实现，P0 暂不需要单独 crate |
| port trait 是否放 `application` | A. 放 `domain`；B. 放 `application`；C. 放独立 `ports` crate | 推荐 B | port 是 use case 对外依赖，放 application 能避免 domain 感知基础设施 |
| API / worker / jobs 是否允许依赖 `infra` | A. 不允许；B. 允许用于 runtime builder；C. 只允许 jobs | 推荐 B | 入口模块需要 wiring 具体实现，但不得绕过 application 改写 truth |
| `contracts` 是否承载领域错误 | A. 承载全部错误；B. 只承载协议错误 DTO，领域错误在 `domain`；C. 不承载错误 | 推荐 B | 协议错误和领域错误边界不同，不能混为一个错误类型 |

---

## 10. 进入下一步条件

```text
模块主轴已经稳定。
每个对象、trait、handler、repository、adapter 和 job 都能找到归属模块。
可以进入 Step 6,逐模块定义对象实现契约。
```
