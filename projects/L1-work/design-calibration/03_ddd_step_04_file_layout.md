# Step 4. 收稳实现单元与文件布局

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 4
- 回填章节:`03-详细设计.md` §4 实现单元与文件布局

### 2. 本步输入

- 上一步中间产物:
  - `projects/L1-work/design-calibration/03_ddd_step_03_constraints.md`
- 上游正式文档:
  - `projects/L1-work/02-概要设计.md` §4 / §12
- 概要设计校准来源:
  - `projects/L1-work/design-calibration/02_hld_step_04_code_subject_framework.md`
  - `projects/L1-work/design-calibration/02_hld_step_05_components_boundary.md`
  - `projects/L1-work/design-calibration/02_hld_step_12_detailed_design_handoff.md`
- 组织规范:
  - `standards/document/详细设计书写规范.md` §5.4
  - `standards/document/子项目目录与代码文件组织规范.md`
  - `standards/document/设计文档讨论中间产物规范.md` §5.7

### 3. SOP 问题回答

1. 当前仓选择单 crate 还是 workspace 多 crate 架构?

   回答:选择 workspace 多 crate 架构。L1-work 有公共 Command / Query / Event / Job / View / Error contracts 供 SDK、workspace、process、archive 等下游消费,又有 API、worker、jobs 多运行入口,并且必须用编译依赖关系强制 domain 不依赖 infra / bus / HTTP / DB。单 crate 模块分层不能足够强地表达这些边界。

2. 实现仓目录是什么?

   回答:目标实现仓目录为 `/home/aris/Projects/quantalithos-work`。设计仓目录 `projects/L1-work/` 只用于文档导航,不得被实现者误用为代码仓目录。当前本地检查尚未发现 `quantalithos-work` 实现仓,这不阻塞详细设计,但必须进入实施计划 PH-01 前置门禁。

3. project slug、Cargo package 和 Rust crate 如何命名?

   回答:project slug 为 `work`。workspace member 目录使用 `crates/<role>`。Cargo package 使用 `work-<role>`。Rust library crate 使用 `work_<role>`。代码命名中不得出现 `L1`、`l1_`、`quantalithos` 项目前缀或重复 project slug 的 member 目录。

4. 本轮需要哪些 workspace member?

   回答:本轮需要 7 个 library / entry crate:
   - `contracts`:公共 DTO、Command、Query、Event、Job、View、Receipt 和 protocol error。
   - `domain`:truth 对象、value object、状态、policy、不变量和 domain error。
   - `application`:application service、repository / port trait、UoW、idempotency、query orchestration 和 job orchestration。
   - `infra`:repository / adapter fake、runtime config binding、publisher / resolver / handoff adapter 和 runtime builder。
   - `api`:同步 Command / Query handler 入口,只调用 application service。
   - `worker`:入站 event consumer、outbox publisher loop 和常驻 background worker。
   - `jobs`:projection rebuild、reference refresh、reconciliation、trace / archive handoff 等一次性 operations job。

   当前不单独创建 `cli` 或 `ops` crate。需要人工运维命令时,先通过 `jobs` 中的明确 job binary 表达;若后续出现交互式 CLI,必须在实施计划或后续设计中新增 `cli`。

5. 如何表达 config 与 observability?

   回答:本轮不单独创建 `config` 或 `observability` crate。配置结构、加载、验证和 runtime builder 放在 `infra` 内;观测 / audit hook 的接口和记录由 `application` / `domain` / `infra` 对应模块承接。原因是当前概要设计没有把配置或观测定义为可被其他仓编译期复用的公共 crate,且 Step 14 / Step 15 会继续定义具体契约。

6. 文件布局如何支持后续对象、trait、协议、flow、状态和测试切口?

   回答:文件按职责而不是业务主要组成部分拆分。业务主要组成部分会跨 crate 出现;例如 `Formal work universe` 同时涉及 `contracts/commands.rs`、`domain/work_item.rs`、`application/work_item_service.rs`、`application/ports.rs`、`infra/repositories.rs` 和 `worker/outbox.rs`。Step 5 会继续定义模块主轴,Step 6~16 再填充对象、trait、协议、flow、状态和测试。

7. 测试文件和报告脚本是否在本 Step 固定?

   回答:本 Step 只固定测试目录骨架和命名原则。具体 gate script、report script、test case 与 evidence 路径由 Step 16、测试方案和实施计划承接。实现仓应预留 `tests/contract/`、`tests/service/`、`tests/integration/` 和 `tests/support/`。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| `03-详细设计.md` 旧版 | 旧文档没有按新版 workspace / role crate 形态组织 | 本 Step 重新定义 workspace 多 crate 布局 |
| `02-概要设计.md` | 只给实现分层和代码主体骨架,明确不定义源码目录 | 本 Step 把概要层映射到具体 crate / file layout |
| Step 3 | 已确认只有 `core-contracts` 是编译期依赖,但尚未说明进入哪个 crate | 本 Step 明确由需要共享 metadata / actor / trace / event envelope 的 crate 使用,具体依赖矩阵留给 Step 5 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-work` 当前未发现 | 不阻塞详细设计;进入实施计划 PH-01 前置门禁 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 布局形态 | 概要层只描述 Inbound / Application / Domain / Ports / Persistence / Projection / Outbox / Operations | 选择 workspace 多 crate 架构 | 需要公共 contracts、多入口和强依赖边界 |
| 目录命名 | 未固定实现仓目录和 member 名 | 固定 `/home/aris/Projects/quantalithos-work` 与 `crates/<role>` | 对齐目录组织规范 |
| package / crate 名 | 未固定 | `work-<role>` / `work_<role>` | 防止 `L1` 或 `quantalithos` 泄漏进代码命名 |
| config / observability | 可能被误拆成顶层 crate | 暂归 `infra` / `application` / `domain` 模块,不单独建 crate | 当前没有编译期复用需求 |
| 测试目录 | 未固定 | 预留 contract / service / integration / support | 支撑后续 Step 16 和实施计划 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 单 crate 模块分层架构 | 初始代码少,搭建快 | contracts 难以被下游单独依赖;domain 纯净只能靠 review;API / worker / jobs 多入口边界不清 | 不采用 |
| B. workspace 多 crate 架构 | contracts 可独立复用;依赖方向可由 Cargo 强制;多入口清晰;适合长期平台化 | 初始 Cargo / crate 数量更多 | 采用 |
| C. 每个业务主要组成部分一个 crate | 业务名与 crate 对齐 | 业务组成部分跨实现分层,会导致 service / domain / infra 循环依赖 | 不采用 |
| D. 单独创建 config / observability crate | 复用边界明确 | 当前没有对外复用需求,会过早抽象 | 不采用 |

### 7. 结构化中间产物

#### 7.1 规则来源

- `standards/document/子项目目录与代码文件组织规范.md`
- `standards/document/详细设计书写规范.md` §5.4
- `standards/document/设计文档讨论中间产物规范.md` §5.7
- `standards/coding/rust.md`
- `projects/L1-work/design-calibration/03_ddd_step_03_constraints.md`

#### 7.2 实现仓目录判定

| 项 | 结论 | 说明 |
|---|---|---|
| 设计仓目录 | `projects/L1-work` | 只用于设计文档导航 |
| 实现仓目录 | `/home/aris/Projects/quantalithos-work` | 真实代码仓位置;当前未发现,实施计划 PH-01 前置确认 |
| project slug | `work` | package / crate / binary 命名前缀来源 |
| 架构层级 | `L1` 只保留在设计仓路径 | 不进入实现仓、Cargo package、crate、module、file、type 或 function 名称 |

#### 7.3 布局形态决策表

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层架构 | 否 | 本仓有公共 contracts、多运行入口和强边界需求 | 不采用 |
| workspace 多 crate 架构 | 是 | contracts / domain / application / infra / api / worker / jobs 边界清晰,Cargo 可强制依赖方向 | 需要建立多 member workspace 和 crate dependency matrix |
| 业务组成部分拆 crate | 否 | 业务组成部分跨分层,不适合作为 crate 边界 | 业务组成部分由模块 / service / object 组合表达 |

#### 7.4 目录 / Package / Crate / Binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `work-contracts` | `work_contracts` | Command / Query / Consumer / Event / Job / View / Receipt / Error DTO,以及跨入口共享 ref / reason / metadata wrapper | 是 |
| `crates/domain` | library crate | `work-domain` | `work_domain` | Project、Backlog、WorkItem、Iteration、Promote、Dependency、Blocker、policy、state 和 domain error | 否 |
| `crates/application` | library crate | `work-application` | `work_application` | application services、repository / port trait、UoW、idempotency、query / consumer / job orchestration | 否 |
| `crates/infra` | library crate | `work-infra` | `work_infra` | fake / durable repository adapter、resolver、publisher、handoff adapter、config binding、runtime builder | 否 |
| `crates/api` | library crate 或 binary package | `work-api` | `work_api` / `work-api` | Command / Query inbound handler 和 API server assembly | 否 |
| `crates/worker` | library crate 或 binary package | `work-worker` | `work_worker` / `work-worker` | inbound event consumer、outbox publisher loop、projection invalidation worker | 否 |
| `crates/jobs` | library crate 或 binary package | `work-jobs` | `work_jobs` / job binary names | operations job runner、projection rebuild、reference refresh、reconciliation、trace / archive handoff | 否 |

Binary 口径:

- `work-api` 可作为 API server binary 名。
- `work-worker` 可作为常驻 worker binary 名。
- jobs binary 名必须表达具体动作,例如 `rebuild_project_board_views`、`refresh_external_references`、`run_work_reconciliation`、`handoff_work_traces`、`handoff_archive_packages`。
- 若实施计划 P0 只要求 library skeleton,可以先不落 binary;但 package / crate 名仍以本表为准。

#### 7.5 文件布局树

```text
quantalithos-work/
  Cargo.toml                         # workspace root
  crates/
    contracts/
      Cargo.toml
      src/
        lib.rs                       # public contracts exports
        refs.rs                      # typed refs, ids, reasons, state-visible marker types
        metadata.rs                  # conversation-local metadata wrappers and envelope helpers
        commands.rs                  # Command request / result DTO
        queries.rs                   # Query request / response DTO
        events.rs                    # inbound and outbound event payload DTO
        jobs.rs                      # operations job input / receipt DTO
        views.rs                     # query / projection visible view DTO
        errors.rs                    # protocol error DTO and error code
        fixtures.rs                  # contract fixtures used by tests
    domain/
      Cargo.toml
      src/
        lib.rs                       # domain exports
        project.rs                   # Project aggregate and lifecycle
        project_member.rs            # ProjectMember responsibility truth
        backlog.rs                   # Backlog truth and availability
        work_item.rs                 # WorkItem and ChildWorkItem truth
        dependency.rs                # WorkDependency and WorkBlocker
        iteration.rs                 # Iteration and IterationCommitment
        promote.rs                   # PromoteResult and promote domain decisions
        reference.rs                 # local reference and snapshot domain value objects
        projection.rs                # derived view state domain objects
        outbox.rs                    # WorkOutboxRecord formation objects
        audit.rs                     # WorkAuditTrail and trace records
        policies.rs                  # domain policies and guards
        errors.rs                    # DomainError
    application/
      Cargo.toml
      src/
        lib.rs                       # application exports
        services.rs                  # service assembly facade
        project_service.rs           # project command use cases
        member_service.rs            # project member use cases
        work_item_service.rs         # formal work and backlog use cases
        promote_service.rs           # formalize / promote orchestration
        dependency_service.rs        # dependency and blocker use cases
        iteration_service.rs         # iteration commitment use cases
        query_service.rs             # authorized query use cases
        consumer_service.rs          # inbound event consumer orchestration
        projection_service.rs        # projection rebuild / freshness use cases
        outbox_service.rs            # outbox publication orchestration
        trace_service.rs             # trace / archive handoff orchestration
        ports.rs                     # repository, resolver, publisher, handoff, clock, id traits
        unit_of_work.rs              # UnitOfWork trait and handle
        idempotency.rs               # idempotency records, digest, duplicate / conflict
        errors.rs                    # ApplicationError
    infra/
      Cargo.toml
      src/
        lib.rs                       # infra exports
        config.rs                    # runtime config structs and validation
        runtime_builder.rs           # assembly of repositories, adapters and services
        repositories.rs              # fake / durable truth repository adapters
        projection_stores.rs         # projection and read model stores
        reference_stores.rs          # snapshot and external reference stores
        outbox_store.rs              # outbox repository adapter
        idempotency_store.rs         # idempotency repository adapter
        source_resolvers.rs          # identity / conversation / method / process / artifact resolvers
        publishers.rs                # bus / fake publisher adapter
        handoff_adapters.rs          # observability / archive handoff adapters
        clock_id.rs                  # clock and id generator adapters
        errors.rs                    # InfraError
    api/
      Cargo.toml
      src/
        lib.rs                       # api exports
        command_handlers.rs          # Command handler boundary
        query_handlers.rs            # Query handler boundary
        routes.rs                    # route / RPC assembly placeholder
        errors.rs                    # API error mapping
    worker/
      Cargo.toml
      src/
        lib.rs                       # worker exports
        consumers.rs                 # inbound event consumers
        outbox_publisher.rs          # outbox publish loop
        projection_worker.rs         # projection invalidation / maintenance loop
        errors.rs                    # WorkerError
    jobs/
      Cargo.toml
      src/
        lib.rs                       # jobs exports
        projection_rebuild.rs        # rebuild derived work views
        reference_refresh.rs         # refresh external reference snapshots
        reconciliation.rs            # reconciliation job
        trace_handoff.rs             # observability handoff job
        archive_handoff.rs           # archive handoff job
        errors.rs                    # JobError
  tests/
    contract/
      command_contract_tests.rs
      query_contract_tests.rs
      event_contract_tests.rs
      job_contract_tests.rs
    service/
      project_service_tests.rs
      work_item_service_tests.rs
      promote_service_tests.rs
      iteration_service_tests.rs
    integration/
      outbox_projection_tests.rs
      consumer_flow_tests.rs
      job_flow_tests.rs
    support/
      fixtures.rs
      fake_runtime.rs
```

#### 7.6 文件职责表

| 文件路径 | 所属实现单元 | 定义内容 | 主要责任 |
|---|---|---|---|
| `crates/contracts/src/refs.rs` | contracts | typed ids, refs, reason refs, view marker refs | 为 DTO、domain 和 tests 提供共享引用类型 |
| `crates/contracts/src/commands.rs` | contracts | Command request / result DTO | 写入口协议 |
| `crates/contracts/src/queries.rs` | contracts | Query request / response DTO | 读入口协议 |
| `crates/contracts/src/events.rs` | contracts | inbound / outbound event payload | event 协作协议 |
| `crates/contracts/src/jobs.rs` | contracts | operations job input / receipt | job 协议 |
| `crates/domain/src/project.rs` | domain | Project aggregate | 项目主语 truth |
| `crates/domain/src/work_item.rs` | domain | WorkItem / ChildWorkItem | 正式工作全集和拆分边界 |
| `crates/domain/src/promote.rs` | domain | PromoteResult | formalize / promote 结果 truth |
| `crates/domain/src/policies.rs` | domain | policy / guard | 不变量和校验 |
| `crates/application/src/ports.rs` | application | repository / resolver / publisher / handoff traits | 外部接缝和持久化边界 |
| `crates/application/src/idempotency.rs` | application | idempotency record / digest / conflict | 幂等和重入保护 |
| `crates/infra/src/runtime_builder.rs` | infra | runtime assembly | 装配 repositories、adapters 和 services |
| `crates/api/src/command_handlers.rs` | api | command handler | 将 inbound command 转交 application |
| `crates/worker/src/consumers.rs` | worker | event consumers | 消费相邻仓事件并调用 application service |
| `crates/jobs/src/projection_rebuild.rs` | jobs | projection rebuild job | 从 truth 重建 derived views |
| `tests/contract/*_tests.rs` | tests | DTO / wire contract tests | 验证 public contracts |
| `tests/service/*_tests.rs` | tests | application / domain use case tests | 验证 service orchestration |
| `tests/integration/*_tests.rs` | tests | fake runtime integration tests | 验证 outbox、projection、consumer、job 组合路径 |

#### 7.7 命名检查表

| 检查项 | 通过条件 | 结果 |
|---|---|---|
| 实现仓目录 | `/home/aris/Projects/quantalithos-work` | 待实施计划 PH-01 确认 |
| project slug | `work` | 通过 |
| member 目录 | `crates/<role>`,不含 `work_` / `l1_` / `quantalithos` 前缀 | 通过 |
| Cargo package | `work-<role>` | 通过 |
| Rust library crate | `work_<role>` | 通过 |
| binary 名 | `work-api`、`work-worker` 或具体 job action name | 通过 |
| 架构层级泄漏 | 代码命名中不出现 `L1` / `l1_` | 通过 |
| 顶层职责目录 | 不出现 `utils`、`common`、`helper` | 通过 |
| 外部仓文件 | 不把 sibling repo 文件写入本仓目录树 | 通过 |

#### 7.8 Crate 依赖方向预告

正式 crate dependency matrix 留给 Step 5,本 Step 先固定方向预告:

```text
contracts
  -> core-contracts

domain
  -> contracts
  -> core-contracts

application
  -> contracts
  -> domain
  -> core-contracts

infra
  -> contracts
  -> domain
  -> application
  -> core-contracts

api / worker / jobs
  -> contracts
  -> application
  -> infra
  -> core-contracts
```

禁止方向:

- `contracts` 不依赖 `domain`、`application`、`infra`、`api`、`worker` 或 `jobs`。
- `domain` 不依赖 `application`、`infra`、`api`、`worker` 或 `jobs`。
- `application` 不依赖 `infra`、`api`、`worker` 或 `jobs`。
- `api`、`worker`、`jobs` 不互相依赖。

### 8. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_04_file_layout.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”和“待确认事项”小节,了解 L1-work 为什么采用 workspace 多 crate 架构、各 crate / package / binary 如何命名,以及实现仓目录与设计仓目录如何区分。

## 4. 实现单元与文件布局

本项目目标实现仓为 `/home/aris/Projects/quantalithos-work`,project slug 为 `work`。正式代码采用 Rust 2024 workspace 多 crate 架构,以 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个 workspace member 表达公共契约、领域模型、用例编排、基础设施适配和运行入口边界。

### 4.1 布局形态决策表

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层架构 | 否 | 本仓有公共 contracts、多运行入口和强边界需求 | 不采用 |
| workspace 多 crate 架构 | 是 | contracts / domain / application / infra / api / worker / jobs 边界清晰,Cargo 可强制依赖方向 | 需要建立多 member workspace 和 crate dependency matrix |

### 4.2 目录 / Package / Crate / Binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `work-contracts` | `work_contracts` | Command / Query / Event / Job / View / Error DTO | 是 |
| `crates/domain` | library crate | `work-domain` | `work_domain` | truth 对象、状态、policy 和 domain error | 否 |
| `crates/application` | library crate | `work-application` | `work_application` | application service、port trait、UoW 和幂等 | 否 |
| `crates/infra` | library crate | `work-infra` | `work_infra` | repository / adapter / config / runtime builder | 否 |
| `crates/api` | library crate 或 binary package | `work-api` | `work_api` / `work-api` | Command / Query inbound handler | 否 |
| `crates/worker` | library crate 或 binary package | `work-worker` | `work_worker` / `work-worker` | event consumer 和 outbox worker | 否 |
| `crates/jobs` | library crate 或 binary package | `work-jobs` | `work_jobs` / job binary names | operations job runner | 否 |

### 4.3 文件布局树

```text
quantalithos-work/
  Cargo.toml
  crates/
    contracts/
    domain/
    application/
    infra/
    api/
    worker/
    jobs/
  tests/
    contract/
    service/
    integration/
    support/
```

### 4.4 依赖方向预告

`contracts` 只能依赖 `core-contracts`;`domain` 可依赖 `contracts` 和 `core-contracts`;`application` 可依赖 `contracts`、`domain` 和 `core-contracts`;`infra` 实现 application ports;`api`、`worker`、`jobs` 只作为入口调用 application / infra 装配,不得互相依赖。

### 9. 待确认事项

- `/home/aris/Projects/quantalithos-work` 当前未发现;实施计划 PH-01 必须确认目标实现仓创建和路径。
- Step 5 需要正式收稳 crate dependency matrix、模块职责和每个 crate 允许 / 禁止依赖。
- Step 14 / `04-配置设计.md` 需要继续展开 `infra/src/config.rs` 与 runtime builder 细节。
- Step 16 / `05-测试方案.md` 需要决定 scripts / reports / artifacts 是否进入本轮交付物。

### 10. 进入下一步条件

- 已选择 workspace 多 crate 架构。
- 已固定实现仓目录、project slug、workspace member、Cargo package、Rust crate / binary 命名。
- 已给出文件布局树、文件职责表、命名检查表和依赖方向预告。
- 可以进入 Step 5 “定义模块实现契约主轴”。
