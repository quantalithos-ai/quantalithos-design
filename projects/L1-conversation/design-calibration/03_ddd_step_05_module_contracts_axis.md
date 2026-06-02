# Step 5. 定义模块实现契约主轴

## 1. Step 状态

- 状态: `[x] 已确认`
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 5
- 回填章节: `projects/L1-conversation/03-详细设计.md` §5 模块实现契约

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_04_units_file_layout.md` | workspace 多 crate 布局、目录树、文件职责、path dependency 和依赖图 | 作为模块主轴的直接输入 |
| `projects/L1-conversation/02-概要设计.md` §4 | Inbound / Operations、Application、Domain、Ports、Persistence、Outbox 分层 | 映射到详细设计实现模块 |
| `projects/L1-conversation/02-概要设计.md` §5 | 8 个主要组成部分、职责边界和对象发现线索 | 确认业务主线如何横跨模块 |
| `projects/L1-conversation/02-概要设计.md` §6~§8 | 关键对象、接口骨架和处理流 | 作为对象、handler、service、repository 归属依据 |
| `projects/L1-conversation/02-概要设计.md` §12 | 详细设计承接清单 | 确认 Step 6~16 后续展开口径 |
| `standards/document/详细设计书写规范.md` §5.5 | 模块总览、单模块小节、职责表和依赖图格式 | 作为正式 `03` 的模块契约写法 |

已确认结论:

```text
Step 5 的模块主轴采用 Step 4 的 workspace member:
contracts / domain / application / infra / api / worker / jobs。

业务主要组成部分不直接变成 crate。
每个业务主要组成部分会横跨 contracts、domain、application、infra 和入口模块。
```

依赖的前序 Step:

```text
Step 4 已确认 workspace 多 crate 架构和文件布局。
```

---

## 3. SOP 问题回答

### 3.1 本仓详细设计应该拆成哪些实现模块？

本仓详细设计按 7 个实现模块展开:

| 模块 | 所属实现单元 | 模块类型 |
|---|---|---|
| `contracts` | `crates/contracts` | 公共协议模块 |
| `domain` | `crates/domain` | 领域模型、状态和策略模块 |
| `application` | `crates/application` | 用例编排、port 和事务边界模块 |
| `infra` | `crates/infra` | adapter、repository、config 和 runtime wiring 模块 |
| `api` | `crates/api` | Command / Query 入口模块 |
| `worker` | `crates/worker` | 常驻 consumer / relay / projection worker 模块 |
| `jobs` | `crates/jobs` | 一次性 operations job 模块 |

`tests`、`scripts`、`artifacts`、`reports` 是验证和交付支撑目录,不作为 §5 的业务实现模块。

### 3.2 每个模块对应概要设计中的哪个主要组成部分或代码主体？

模块和概要设计主要组成部分不是一一对应关系。主要组成部分表达业务传递主线,模块表达代码职责和依赖方向。

| 概要设计主要组成部分 | 涉及模块 |
|---|---|
| `Conversation truth core` | `contracts`、`domain`、`application`、`infra` |
| `Space / scope management` | `contracts`、`domain`、`application`、`api`、`infra` |
| `Collaborative fact append` | `contracts`、`domain`、`application`、`api`、`worker`、`infra` |
| `Authorized consumption` | `contracts`、`domain`、`application`、`api`、`worker`、`infra` |
| `Cross-domain manifestation` | `contracts`、`domain`、`application`、`worker`、`jobs`、`infra` |
| `History trace / review` | `contracts`、`domain`、`application`、`api`、`jobs`、`infra` |
| `Derived consumption support` | `contracts`、`domain`、`application`、`worker`、`jobs`、`infra` |
| `Local reference / snapshot / projection support` | `contracts`、`domain`、`application`、`worker`、`jobs`、`infra` |

### 3.3 每个模块对外暴露什么？

| 模块 | 对外暴露 |
|---|---|
| `contracts` | Command、Query、Consumer、Event、Job、View、Receipt、protocol error DTO、refs、metadata |
| `domain` | 领域对象、状态 enum、policy、领域错误和领域构造函数 |
| `application` | application service、port trait、repository trait、UnitOfWork、idempotency service、application error |
| `infra` | config、runtime builder、repository adapter、resolver adapter、outbox publisher、handoff adapter |
| `api` | command handler、query handler、DTO mapper、error mapper、`conversation-api` binary |
| `worker` | consumer runner、outbox worker、projection worker、worker runtime、`conversation-worker` binary |
| `jobs` | job runner helper、9 个 operation binary |

### 3.4 每个模块允许依赖哪些模块,禁止依赖哪些模块？

| 模块 | 允许依赖 | 禁止依赖 |
|---|---|---|
| `contracts` | `core-contracts`、serde 类基础依赖 | `domain`、`application`、`infra`、`api`、`worker`、`jobs` |
| `domain` | `contracts` 中的 refs / context / value DTO、`core-contracts` | `application`、`infra`、`api`、`worker`、`jobs`、DB / queue / HTTP SDK |
| `application` | `domain`、`contracts`、`core-contracts` | `infra`、`api`、`worker`、`jobs`、具体 DB / queue / HTTP SDK |
| `infra` | `application`、`domain`、`contracts`、外部 adapter 依赖 | `api`、`worker`、`jobs` |
| `api` | `application`、`contracts`、`infra` | `worker`、`jobs`、直接绕过 application 写 repository |
| `worker` | `application`、`contracts`、`infra` | `api`、`jobs`、直接绕过 application 改写 domain |
| `jobs` | `application`、`contracts`、`infra` | `api`、`worker`、直接绕过 application 改写 domain |

### 3.5 哪些对象、trait、handler、repository 应归属于哪个模块？

| 类别 | 归属模块 | 说明 |
|---|---|---|
| Command / Query / Consumer / Event / Job DTO | `contracts` | Step 8 继续定义协议契约 |
| View / Receipt / protocol error DTO | `contracts` | 供 API、worker、jobs 和下游读取使用 |
| refs、context、metadata | `contracts` | 封装本仓协议引用,基础类型继续来自 `core-contracts` |
| 领域对象 / 状态 enum / policy | `domain` | Step 6 逐模块定义对象实现契约 |
| application service | `application` | Step 9 逐接口定义函数级处理流 |
| port trait / repository trait / UnitOfWork trait | `application` | Step 7 定义 trait / port 契约 |
| repository implementation / memory store / adapter | `infra` | Step 7 / Step 11 定义 adapter 和持久化契约 |
| RuntimeConfig / ConfigLoader / RuntimeBuilder | `infra` | Step 14 定义配置引用与外部依赖绑定 |
| command / query handler | `api` | Step 8 / Step 9 定义协议和处理流 |
| event consumer / outbox worker / projection worker | `worker` | Step 8 / Step 9 定义 consumer 和 worker flow |
| operation job binary | `jobs` | Step 8 / Step 9 定义 job 协议和执行流 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` | 模块主轴仍偏 Conversation / Turn / StreamEvents / AG-UI | 与新版 fact、scope、manifestation、trace、projection 和 handoff 主线不一致 |
| 旧版 `03-详细设计.md` | 没有区分业务主要组成部分和实现模块 | 容易按业务主线建 crate,导致 port、DTO、transaction 和 outbox 重复 |
| 当前 Step 4 | 已有 crate / 文件布局,但还缺模块职责、暴露内容和依赖方向 | Step 6~8 无法稳定归属对象、trait、handler、repository |
| 后续 Step 风险 | 若 Step 5 不收稳模块主轴,对象和接口会堆成全局表 | 违反详细设计“按模块展开”的要求 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 模块主轴 | 旧聊天 / 推送对象组 | `contracts / domain / application / infra / api / worker / jobs` | 对齐 Step 4 workspace 布局 |
| 业务组成部分与模块关系 | 容易一一对应 | 明确业务组成部分横跨模块 | 避免按业务主线拆 crate 造成循环依赖 |
| 对象归属 | 容易集中到全局对象章节 | 领域对象归 `domain`,协议归 `contracts`,port 归 `application`,实现归 `infra` | 支撑 Step 6~8 按模块展开 |
| 入口模块 | 旧文混合 command、query、stream、event | `api`、`worker`、`jobs` 分别承接同步入口、常驻 worker 和一次性 job | 运行承载清晰 |
| 依赖方向 | 旧文不清晰 | 入口 / infra 指向 application,application 指向 domain,domain 指向 contracts | 防止 domain 依赖 infra 或入口 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按 8 个主要组成部分定义模块 | 业务语义直观 | 每个组成部分都需要 DTO、domain、service、repository、outbox,会造成重复和循环依赖 | 不采用 |
| 方案 B: 按实现职责和依赖方向定义模块 | 边界稳定,能用 Cargo workspace 强约束依赖方向 | 业务主线需要通过映射表理解 | 采用 |
| 方案 C: 只保留 Step 4 crate 表,不写模块主轴 | 文档短 | Step 6~8 缺少归属规则,容易回到全局对象堆叠 | 不采用 |
| 方案 D: 把 projection / reference / outbox 独立成更多 crate | 局部边界更细 | P0 初始结构过重,且这些职责横跨 domain、application 和 infra | 不采用 |

推荐方案:方案 B。

原因:

- 详细设计要指导实现,不是重复概要设计的业务组成部分。
- `L1-conversation` 的业务主线必须跨协议、领域、应用、适配、入口和 job 协同。
- 按实现职责拆模块能让对象、trait、handler、repository、adapter 和 job 都有稳定归属。

---

## 7. 结构化中间产物

### 7.1 模块总览表

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 依赖对象 |
|---|---|---|---|---|
| `contracts` | `crates/contracts` | 定义跨入口和下游可复用协议结构 | Command、Query、Consumer、Event、Job、View、Receipt、error DTO | `core-contracts` |
| `domain` | `crates/domain` | 维护 Conversation truth、状态、不变量和领域策略 | 领域对象、状态 enum、policy、领域错误 | `contracts`、`core-contracts` |
| `application` | `crates/application` | 编排 use case、事务、幂等、port 调用和 outbox / handoff 意图 | service、port trait、repository trait、UnitOfWork、application error | `domain`、`contracts` |
| `infra` | `crates/infra` | 实现 port、store、adapter、config 和 runtime wiring | repository adapter、resolver adapter、publisher、handoff adapter、runtime builder | `application`、`domain`、`contracts` |
| `api` | `crates/api` | 接收同步 command / query 请求 | handler、DTO mapper、error mapper、binary entry | `application`、`contracts`、`infra` |
| `worker` | `crates/worker` | 承接常驻 consumer、outbox relay 和 projection worker | consumer loop、worker runner、binary entry | `application`、`contracts`、`infra` |
| `jobs` | `crates/jobs` | 承接一次性 operations job | job runner、operation binary | `application`、`contracts`、`infra` |

### 7.2 模块依赖图

#### 模块依赖图: L1-conversation 模块实现主轴

```text
contracts
  |
  | use shared primitives
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
  | calls services through runtime wiring
  v
application
  ^
  | provides implementations
infra

worker
  | calls services through runtime wiring
  v
application
  ^
  | provides implementations
infra

jobs
  | calls services through runtime wiring
  v
application
  ^
  | provides implementations
infra
```

关键说明:

- 图表达模块依赖方向,不表达函数级处理流。
- `domain` 不得依赖 `application`、`infra`、`api`、`worker`、`jobs`。
- `application` 定义 port trait,`infra` 实现 port trait,入口模块通过 runtime wiring 使用实现。
- `api`、`worker`、`jobs` 是入口模块,不互相依赖。

### 7.3 模块职责表

#### `contracts` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/contracts` / `conversation-contracts` |
| 对应概要设计主要组成部分 | API / 接口骨架、Command / Query / Event / Job / View |
| 主要责任 | 定义跨入口和下游可复用协议 DTO,不承载领域不变量 |
| 对外暴露 | Command、Query、Consumer、Event、Job、View、Receipt、protocol error DTO、refs、metadata |
| 允许依赖 | `core-contracts`、serde 类基础依赖 |
| 禁止依赖 | `domain`、`application`、`infra`、`api`、`worker`、`jobs` |

#### `domain` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/domain` / `conversation-domain` |
| 对应概要设计主要组成部分 | 8 个主要组成部分中的 truth / state / policy / projection / reference / audit |
| 主要责任 | 维护 Conversation truth、space、scope、fact、manifestation、trace、projection、reference、outbox 的不变量 |
| 对外暴露 | 领域对象、状态 enum、policy、领域错误、领域构造函数 |
| 允许依赖 | `contracts`、`core-contracts` |
| 禁止依赖 | `application`、`infra`、`api`、`worker`、`jobs`、DB / queue / HTTP SDK |

#### `application` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/application` / `conversation-application` |
| 对应概要设计主要组成部分 | Application Services、Port / Repository 边界、关键处理流 |
| 主要责任 | 编排 command、query、consumer、job 的 use case、事务、幂等、repository / port 调用和 outbox 写入 |
| 对外暴露 | application service、port trait、repository trait、UnitOfWork、application error |
| 允许依赖 | `domain`、`contracts`、`core-contracts` |
| 禁止依赖 | `infra`、`api`、`worker`、`jobs`、具体 DB / queue / HTTP SDK |

#### `infra` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/infra` / `conversation-infra` |
| 对应概要设计主要组成部分 | Ports / Persistence / Projection / Outbox / Adapters、配置影响 |
| 主要责任 | 实现 application ports,提供 repository、projection、snapshot、resolver、publisher、handoff、config 和 runtime builder |
| 对外暴露 | repository adapter、source resolver、outbox publisher、handoff adapter、runtime builder |
| 允许依赖 | `application`、`domain`、`contracts`、外部 adapter 依赖 |
| 禁止依赖 | `api`、`worker`、`jobs` |

#### `api` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/api` / `conversation-api` |
| 对应概要设计主要组成部分 | Command API、Query API、authorized consumption 入口 |
| 主要责任 | 把外部同步 command / query 映射到 application service,返回协议 response / receipt |
| 对外暴露 | command handler、query handler、DTO mapper、`conversation-api` binary |
| 允许依赖 | `application`、`contracts`、`infra` |
| 禁止依赖 | `worker`、`jobs`、直接绕过 application 写 repository |

#### `worker` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/worker` / `conversation-worker` |
| 对应概要设计主要组成部分 | Inbound Event Consumer、Outbox relay、Derived consumption support |
| 主要责任 | 运行常驻 consumer / worker loop,把来源事件、outbox 发布和派生维护转入 application service |
| 对外暴露 | event consumer、outbox worker、projection worker、`conversation-worker` binary |
| 允许依赖 | `application`、`contracts`、`infra` |
| 禁止依赖 | `api`、`jobs`、直接绕过 application 改写 domain |

#### `jobs` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/jobs` / `conversation-jobs` |
| 对应概要设计主要组成部分 | Operations Job、projection rebuild、snapshot refresh、handoff delivery、consistency validation |
| 主要责任 | 提供一次性 operations job 入口,复用 application service 和 infra runtime builder |
| 对外暴露 | job runner helper、operation binary |
| 允许依赖 | `application`、`contracts`、`infra` |
| 禁止依赖 | `api`、`worker`、直接绕过 application 改写 domain |

### 7.4 归属映射表

| 对象 / trait / handler / repository | 归属模块 | 后续展开 Step |
|---|---|---|
| Command / Query / Consumer / Event / Job DTO | `contracts` | Step 8 |
| View / Receipt / protocol error DTO、refs、metadata | `contracts` | Step 8 |
| `ConversationTruthState`、`ConversationTruthPolicy`、`ConversationOutboxRecord` | `domain` | Step 6 / Step 10 |
| `ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`ScopeChangeRecord` | `domain` | Step 6 / Step 10 |
| `ConversationFact`、`FactSourceRef`、`FactAppendPolicy`、`FactAppendReceipt` | `domain` | Step 6 / Step 10 |
| `ConversationReadModel`、`ConversationChangeCursor`、`VisibilityPolicy` | `domain` | Step 6 / Step 10 |
| `CrossDomainManifestation`、`ExternalFactRef`、`ExternalFactSnapshot`、`ManifestationPolicy`、`ReferenceValidityPolicy` | `domain` | Step 6 / Step 10 |
| `ConversationTraceContext`、`ReviewAnchor`、`TraceHandoffRecord`、`ArchiveHandoffRecord`、`TraceRetentionPolicy` | `domain` | Step 6 / Step 10 |
| `ConversationProjectionState`、`SearchIndexProjection`、`ChangeCursorProjection`、`DerivedViewPolicy` | `domain` | Step 6 / Step 10 |
| `ReferenceResolutionState`、`ExternalReferenceProjection` | `domain` | Step 6 / Step 10 |
| `ConversationSpaceCommandService`、`ParticipantScopeCommandService`、`VisibilityScopeCommandService` | `application` | Step 9 |
| `ConversationFactAppendService`、`AuthorizedConversationQueryService`、`ConversationManifestationService` | `application` | Step 9 |
| `ConversationTraceReviewService`、`ConversationDerivedMaintenanceService`、`ExternalSnapshotRefreshService`、`ConversationOutboxService` | `application` | Step 9 |
| repository trait、resolver port、publisher port、handoff port、`UnitOfWork` | `application` | Step 7 |
| repository implementation、projection store、snapshot store、resolver adapter、publisher adapter、runtime builder | `infra` | Step 7 / Step 11 / Step 14 |
| Command / Query handler、DTO mapper、error mapper | `api` | Step 8 / Step 9 |
| Inbound event consumer、outbox worker、projection worker | `worker` | Step 8 / Step 9 |
| Operations job binary | `jobs` | Step 8 / Step 9 |

### 7.5 正式文档模块小节骨架

正式 `03` 的 §5 应按以下固定结构展开每个模块。本 Step 只收稳主轴,对象、trait、函数、错误和测试切口分别由 Step 6~16 回填。

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

正式 `03-详细设计.md` 的 §5 应从本文件摘录并收敛为以下结构:

```md
## 5. 模块实现契约

> 校准来源:
> - `design-calibration/03_ddd_step_05_module_contracts_axis.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/03_ddd_step_05_module_contracts_axis.md` §7.1~§7.5,了解模块主轴、依赖方向和对象归属。

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
| 是否把 `projection` 独立成 crate | A. 独立 crate;B. 暂归 `domain` 对象和 `infra` store;C. 并入 `application` | 推荐 B | projection 既有只读对象也有存储实现,P0 暂不需要单独 crate |
| port trait 是否放 `application` | A. 放 `domain`;B. 放 `application`;C. 放独立 `ports` crate | 推荐 B | port 是 use case 对外依赖,放 application 能避免 domain 感知基础设施 |
| `api` / `worker` / `jobs` 是否允许依赖 `infra` | A. 不允许;B. 允许用于 runtime builder;C. 只允许 jobs | 推荐 B | 入口模块需要 wiring 具体实现,但不得绕过 application 改写 truth |
| `contracts` 是否承载领域错误 | A. 承载全部错误;B. 只承载协议错误 DTO,领域错误在 `domain`;C. 不承载错误 | 推荐 B | 协议错误和领域错误边界不同,不能混成一个错误类型 |

---

## 10. 进入下一步条件

```text
模块主轴已经稳定。
每个对象、trait、handler、repository、adapter 和 job 都能找到归属模块。
可以进入 Step 6,逐模块定义对象实现契约。
```
