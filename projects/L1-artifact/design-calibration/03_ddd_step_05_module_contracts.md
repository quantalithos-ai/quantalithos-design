# Step 5. 定义模块实现契约主轴

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 5
> 回填章节: `03-详细设计.md` §5 模块实现契约
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. Step 状态

- 状态: `[x]` 已确认
- 当前目标: 在 Step 4 已固定 workspace / crate / file layout 的前提下,把 `L1-artifact` 的详细设计主轴固定为 7 个实现模块,并明确职责、对外暴露、依赖方向、对象归属和跨模块接缝
- 本步不做的事: 不提前展开对象字段全集、trait 函数签名、DTO schema、状态矩阵、事务边界、配置项、DDL 或实施 boundary

## 2. 本步输入

| 输入 | 当前状态 | 用途 |
|---|---|---|
| `projects/L1-artifact/design-calibration/03_ddd_step_04_file_layout.md` | 已完成 | 提供 workspace member、package / crate / binary 命名和最小文件集合 |
| `projects/L1-artifact/design-calibration/03_ddd_step_03_constraints.md` | 已完成 | 提供 Rust、依赖裁剪、运行路径分离和 path dependency 约束 |
| `projects/L1-artifact/02-概要设计.md` §4 / §5 / §12 | 已读取 | 提供 13 个代码主体、10 个主要组成部分和详细设计承接清单 |
| `projects/L1-artifact/design-calibration/02_hld_step_05_components_boundary.md` | 已读取 | 提供 10 个主要组成部分与对象发现线索 |
| `projects/L1-artifact/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 已读取 | 提供详细设计对代码主体、对象、接口和流的承接口径 |
| `projects/L1-governance/design-calibration/03_ddd_step_05_module_contracts.md` | 已读取 | 作为 Step 5 结构和粒度参考 |
| `standards/document/详细设计书写规范.md` §5.5 | 已读取 | 约束模块契约章节组织方式 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已生效 | 约束模块 ownership、port 闭口和后续暂停规则 |
| `standards/document/子项目目录与代码文件组织规范.md` | 已读取 | 约束 crate 边界、shared/common 禁止和入口职责收敛 |

## 3. SOP 问题回答

### 3.1 本仓详细设计应该拆成哪些实现模块?

详细设计实现模块与 Step 4 的 workspace member 对齐,固定为 7 个模块:

- `contracts`
- `domain`
- `application`
- `infra`
- `api`
- `worker`
- `jobs`

`L1-artifact` 的 10 个主要组成部分是业务主语,不是 crate 边界。它们必须跨这 7 个实现模块协作实现,不能被误拆成 10 个 crate 或 10 个顶层 Rust module。

### 3.2 每个模块对应概要设计中的哪个代码主体或主要组成部分?

- `contracts`
  - 承接 Command / Query / Event / Job / View / Receipt / Error 的公共协议骨架
  - 为 `Artifact consumption and traceability`、`Derived maintenance and handoff preparation` 提供对外只读 surface
- `domain`
  - 承接 `Artifact Truth Domain Core`
  - 承接 truth、support state、policy、change / trace / handoff / refresh record 的正式所有权
- `application`
  - 承接 `Truth Write Services`
  - 承接 `Truth Read / Consumption Services`
  - 承接 `Intake / Review Boundary Services`
  - 承接 `Derived Maintenance Services`
  - 同时定义四类 port family 的 trait 边界
- `infra`
  - 实现 `Truth Persistence Ports`
  - 实现 `Reference / Snapshot / Body Source Ports`
  - 实现 `Projection / Preview / Report Read Models`
  - 实现 `Derived Persistence / Handoff Preparation Ports`
  - 实现 `Event / Audit / Handoff Relay Ports`
- `api`
  - 承接 `Artifact Sync Entry`
- `worker`
  - 承接 `Artifact Async Intake`
  - 承接常驻 relay / stale / maintenance loop
- `jobs`
  - 承接 `Artifact Operations Jobs`

### 3.3 每个模块对外暴露什么?

- `contracts`
  - 暴露 typed ref、metadata、command / query DTO、event payload、job input / report、view、cursor、marker、public protocol error
- `domain`
  - 只向本仓 `application` 暴露 aggregate、entity、value object、state、policy、change record、DomainError
- `application`
  - 暴露 service facade、repository trait、resolver trait、publisher trait、handoff trait、UnitOfWork、IdempotencyRepository、ApplicationError
- `infra`
  - 暴露 adapter、repository implementation、projection store、runtime builder、config loader / validator、test fake assembly
- `api`
  - 暴露 command / query handler 和同步入口装配
- `worker`
  - 暴露 inbound consumer、relay runner、long-running worker runner
- `jobs`
  - 暴露 one-shot job runner 和 run report mapping

### 3.4 每个模块允许依赖哪些模块,禁止依赖哪些模块?

依赖方向固定为单向:

- `contracts` 只允许依赖 `core-contracts`
- `domain` 只允许依赖 `contracts`、`core-contracts`
- `application` 只允许依赖 `domain`、`contracts`、`core-contracts`
- `infra` 只允许依赖 `application`、`domain`、`contracts`、`core-contracts`
- `api`、`worker`、`jobs` 只允许依赖 `application`、`infra`、`contracts`、`core-contracts`

明确禁止:

- `contracts` / `domain` / `application` 反向依赖更外层模块
- `api`、`worker`、`jobs` 互相依赖
- 新增 `shared`、`common`、`utils` 这类无边界公共模块
- 任何非 `core-contracts` sibling repo 进入 Cargo dependency

### 3.5 哪些对象、trait、handler、repository 应归属于哪个模块?

- DTO、typed ref、marker、cursor、public error、event payload、job input / report、query view 属于 `contracts`
- `ArtifactFact`、`ArtifactVersion`、`ArtifactLineageLink`、`ArtifactBaseline`、`ArtifactIntakeContext`、`ArtifactReviewAnchor`、`AutomationArtifactInput`、`ArtifactDerivedViewState`、`ExternalReferenceResolutionState`、各类 policy / change / trace / handoff record 属于 `domain`
- command / query / consumer / job service、truth repository trait、reference resolver trait、handoff / relay trait、UnitOfWork、idempotency replay 属于 `application`
- truth repository adapter、read model store、mirror / snapshot resolver、publisher / handoff adapter、config loader、runtime builder 属于 `infra`
- synchronous command / query handler 属于 `api`
- inbound event consumer、pending relay loop、stale / refresh trigger worker 属于 `worker`
- rebuild / refresh / reconcile / handoff prepare runner 属于 `jobs`

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| `02-概要设计.md` §4 | 只固定代码主体骨架,尚未给出详细设计层的模块主轴 | 本步将 13 个代码主体收敛到 7 个实现模块 |
| `02-概要设计.md` §5 | 已固定 10 个主要组成部分,但未明确它们如何跨 crate 实现 | 本步补齐“业务主语”和“实现模块”之间的映射 |
| `03_ddd_step_04_file_layout.md` | 已固定文件布局,但还没有 ownership / dependency / exposure 门禁 | 本步补模块职责、依赖方向和跨模块接缝 |
| 旧 `projects/L1-artifact/03-详细设计.md` | 旧结构容易把业务主语、运行主体和实现目录混写 | 本步只承接新版 `00/01/02` 与 Step 4,不继承旧模块主轴 |
| 后续 Step 6~9 | 对象、trait、协议和流若没有模块主轴容易发生归属漂移 | 本步把后续展开入口固定到单一模块 owner |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 模块主轴 | 只有 workspace member 名称 | 固定为 7 个正式实现模块及其职责 | 防止后续按对象或接口临时分层 |
| 业务组成部分 | 只在概要层成立 | 明确 10 个业务主语如何映射到 7 个模块 | 防止把业务主语误写成 crate |
| 依赖方向 | 只有 Step 3 / Step 4 的原则约束 | 固定 allowed / forbidden dependency matrix | 为 Cargo、trait owner 和装配边界提供门禁 |
| cross-cutting 主体 | Projection、handoff、relay、reference 容易散落到多处 | 明确 contracts / domain / application / infra 各自负责哪一层 | 降低 Step 6~11 重复定义风险 |
| 入口模块 | `api` / `worker` / `jobs` 只有目录信息 | 明确只做入口与调度,不拥有 truth 和 port 定义 | 防止入口模块吞掉业务语义 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 以 7 个 workspace member 作为详细设计模块主轴 | 与 Step 4 一致,依赖方向可被 Cargo 强化,实现者可直接承接 | 10 个业务主语需要跨模块映射 | 采用 |
| B. 以 10 个主要组成部分作为 crate / module 主轴 | 业务语义直观 | 每个组成部分都会跨 DTO、domain、service、repo 和 projection,容易形成循环依赖 | 不采用 |
| C. 把 Projection / Handoff / Relay 各自拆独立 crate | 运行主体更显眼 | 过早放大派生层,会稀释 truth 主线和 Step 3 的依赖裁剪 | 不采用 |
| D. 增加 `shared` / `common` 承载公共类型 | 初期写起来快 | 违反目录规范,会形成无边界桶 | 不采用 |

## 7. 结构化中间产物

### 7.1 模块总览表

| 模块 | 所属实现单元 | 核心职责 | 对外暴露 | 允许依赖 |
|---|---|---|---|---|
| `contracts` | `crates/contracts` / `artifact-contracts` | 定义公共协议、typed ref、view、event、job、receipt 和 protocol error | DTO、view、event、job、public error | `core-contracts` |
| `domain` | `crates/domain` / `artifact-domain` | 定义 Artifact truth、support state、policy、不变量和 change / trace / handoff record | aggregate、entity、value object、policy、DomainError | `contracts`、`core-contracts` |
| `application` | `crates/application` / `artifact-application` | 编排 command / query / consumer / job 用例、事务、幂等和 port 调用 | services、ports、UoW、idempotency、ApplicationError | `domain`、`contracts`、`core-contracts` |
| `infra` | `crates/infra` / `artifact-infra` | 实现 repository / resolver / store / publisher / handoff / config / runtime | adapters、stores、runtime_builder、config、fake assembly | `application`、`domain`、`contracts`、`core-contracts` |
| `api` | `crates/api` / `artifact-api` | 承接同步 Command / Query 入口 | handlers、route assembly、ApiError | `application`、`infra`、`contracts`、`core-contracts` |
| `worker` | `crates/worker` / `artifact-worker` | 承接异步输入消费和常驻维护循环 | consumers、relay runners、WorkerError | `application`、`infra`、`contracts`、`core-contracts` |
| `jobs` | `crates/jobs` / `artifact-jobs` | 承接 one-shot operations job | job runners、run report mapping、JobError | `application`、`infra`、`contracts`、`core-contracts` |

### 7.2 模块依赖图

```text
+------------------+
|  core-contracts  |
+---------+--------+
          ^
          |
+---------+-----+
|   contracts   |
+---------+-----+
          ^
          |
+---------+-----+
|     domain    |
+---------+-----+
          ^
          |
+---------+-----+<-----------------------------+
|  application  |                              |
+---------+-----+                              |
          ^                                    |
          | implements ports                   |
+---------+-----+                              |
|      infra    |------------------------------+
+---+-----+---+-+
    ^     ^   ^
    |     |   |
+---+-+ +-+---+ +----+
| api | |worker| |jobs|
+-----+ +------+ +----+
```

关键说明:

- 图只表达 crate / module 依赖方向,不表达函数级处理流。
- `application` 是业务编排中心,但不拥有 adapter 实现。
- `infra` 实现 `application` 定义的 port trait,但不得改写 domain 不变量。
- `api`、`worker`、`jobs` 都是入口模块,只调用 `application`。

### 7.3 模块与 10 个主要组成部分映射表

| 主要组成部分 | 主 owner 模块 | 共同参与模块 | 说明 |
|---|---|---|---|
| `Artifact fact management` | `domain` + `application` | `contracts`、`infra`、`api` | fact truth 在 domain,写路径在 application,同步入口在 api |
| `Artifact version management` | `domain` + `application` | `contracts`、`infra`、`api` | version truth 与 publish / supersede 编排围绕 truth 主线 |
| `Artifact lineage management` | `domain` + `application` | `contracts`、`infra`、`api`、`worker` | lineage record 属于 truth 主线,但会触发 relay / stale |
| `Artifact baseline management` | `domain` + `application` | `contracts`、`infra`、`api` | baseline freeze 属于 truth 写路径 |
| `Artifact intake convergence` | `application` | `domain`、`contracts`、`infra`、`api`、`worker` | intake 主体是边界收束服务,同步与异步入口共用 |
| `Artifact review and responsibility context` | `domain` + `application` | `contracts`、`infra`、`api` | review / responsibility 围绕 truth anchor 成立 |
| `Automation output control boundary` | `application` | `domain`、`contracts`、`infra`、`worker` | 自动化输入只以 candidate / boundary 语义进入 |
| `Artifact consumption and traceability` | `application` | `contracts`、`domain`、`infra`、`api` | public read surface 在 contracts,query orchestration 在 application |
| `Derived maintenance and handoff preparation` | `application` + `infra` | `contracts`、`domain`、`jobs`、`worker` | 派生维护是 application 编排,持久化和交接材料在 infra |
| `External reference and local mirror support` | `infra` + `application` | `domain`、`contracts`、`worker`、`jobs` | resolver / mirror adapter 在 infra,使用与判断在 application |

### 7.4 模块职责表

#### `contracts` 模块

| 项 | 内容 |
|---|---|
| 对应代码主体 | Command / Query / Event / Job 公共协议骨架;Projection / Preview / Report 的 public view surface |
| 必须承载 | typed refs、actor / metadata wrappers、commands、queries、events、jobs、views、public error、cursor、marker、receipt |
| 不得承载 | domain invariant、repository trait、runtime config、DB shape、adapter 细节 |
| 后续展开位置 | Step 6 的 ref / summary owner;Step 8 的 exact DTO;Step 12 的 public error / degraded surface |

#### `domain` 模块

| 项 | 内容 |
|---|---|
| 对应代码主体 | `Artifact Truth Domain Core` |
| 必须承载 | `ArtifactFact`、`ArtifactContentFactContext`、`ArtifactVersion`、`ArtifactLineageLink`、`ArtifactBaseline`、`ArtifactIntakeContext`、`ArtifactReviewAnchor`、`AutomationArtifactInput`、`ConsumableArtifactReference`、`ArtifactDerivedViewState`、`ExternalReferenceResolutionState`、各类 policy / change / trace / handoff / refresh record |
| 不得承载 | HTTP / bus / DB / object store / archive / observability adapter、config、application orchestration |
| 后续展开位置 | Step 6 对象契约;Step 10 状态矩阵;Step 12 DomainError |

#### `application` 模块

| 项 | 内容 |
|---|---|
| 对应代码主体 | `Truth Write Services`、`Truth Read / Consumption Services`、`Intake / Review Boundary Services`、`Derived Maintenance Services` 以及四类 port family trait owner |
| 必须承载 | command / query / consumer / job service、truth repository trait、reference resolver trait、read model store trait、handoff / relay trait、UnitOfWork、IdempotencyRepository、ApplicationError |
| 不得承载 | durable adapter、transport handler、domain struct 字段最终所有权 |
| 后续展开位置 | Step 7 trait / port;Step 8 protocol source map;Step 9 function flow;Step 11 事务边界 |

#### `infra` 模块

| 项 | 内容 |
|---|---|
| 对应代码主体 | `Truth Persistence Ports`、`Reference / Snapshot / Body Source Ports`、`Projection / Preview / Report Read Models`、`Derived Persistence / Handoff Preparation Ports`、`Event / Audit / Handoff Relay Ports` 的实现层 |
| 必须承载 | repository / store / resolver / publisher / handoff adapter、config loader / validator、runtime builder、test fake runtime |
| 不得承载 | truth ownership、业务 guard 判断、public DTO truth 定义 |
| 后续展开位置 | Step 7 adapter signature;Step 11 persistence / consistency;Step 14 config binding |

#### `api` / `worker` / `jobs` 模块

| 模块 | 必须承载 | 不得承载 | 后续展开位置 |
|---|---|---|---|
| `api` | sync command / query handler、request mapping、response mapping、runtime assembly | 直接访问 repository、私有业务判断、跨入口共享状态 | Step 8 Command / Query protocol |
| `worker` | inbound consumer、outbox / stale / refresh loop、source event dedup receipt | 核心 truth 修复、one-shot maintenance job、public query surface | Step 8 Consumer protocol;Step 13 并发 / 重入 |
| `jobs` | rebuild / refresh / reconcile / archive / observability / sync handoff runner | API 行为、常驻 consumer 循环、核心 truth repair | Step 8 Job protocol;Step 15 audit / evidence |

### 7.5 跨模块接缝与后续展开表

| 接缝 | owner 模块 | 使用模块 | 当前固定口径 | 后续展开 |
|---|---|---|---|---|
| typed ref / metadata / marker / receipt | `contracts` | 全部模块 | 公共协议类型只能在 `contracts` 或 `core-contracts` 定义 | Step 6 / Step 8 |
| truth aggregate / support state / policy | `domain` | `application` | truth 所有权不可漂移到 entry、adapter 或 projection | Step 6 / Step 10 |
| repository / resolver / relay / handoff traits | `application` | `infra` | trait owner 固定在 `application`;adapter 只实现不改语义 | Step 7 |
| query view / preview / report public surface | `contracts` + `application` | `api`、`jobs` | view type 在 `contracts`,组装语义在 `application` | Step 8 / Step 9 |
| read model persistence / freshness / rebuild material | `infra` + `domain` | `application`、`jobs` | persistence 形态在 infra,正式 freshness state 在 domain | Step 11 |
| inbound handler / consumer / job runner | `api` / `worker` / `jobs` | `application` | 入口模块只做解析、调度、报告映射 | Step 8 / Step 9 |

## 8. 当前结论与 Step 6 入口

当前 Step 5 已闭合以下结论:

- `L1-artifact` 的详细设计主轴固定为 7 个实现模块,与 Step 4 workspace member 一致。
- 10 个主要组成部分是业务主语,不得被误拆成 crate 或被入口模块替代。
- contracts / domain / application / infra / api / worker / jobs 的 owner、对外暴露、依赖方向和禁止依赖已固定。
- 后续 Step 6~11 发生对象、trait、protocol、transaction 归属争议时,必须先回到本文件判断 owner,不能由实现者自行选边。

Step 6 需要在本文件主轴下继续完成:

- 逐模块定义正式对象契约
- 把 Step 5 已点名的对象和 record 固定到单一模块 owner
- 为 Step 7 trait / port / adapter 契约准备明确的对象输入面

当前没有新增阻塞 Step 6 的待确认事项。
