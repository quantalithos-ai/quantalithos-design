# Step 4. 收稳实现单元与文件布局

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 4
- 回填章节:`03-详细设计.md` §4 实现单元与文件布局

### 2. 本步输入

- 上一步中间产物:
  - `projects/L1-process/design-calibration/03_ddd_step_03_constraints.md`
- 上游正式文档:
  - `projects/L1-process/02-概要设计.md` §4 / §5 / §12
- 概要设计校准来源:
  - `projects/L1-process/design-calibration/02_hld_step_04_code_subject_framework.md`
  - `projects/L1-process/design-calibration/02_hld_step_05_components_boundary.md`
  - `projects/L1-process/design-calibration/02_hld_step_12_detailed_design_handoff.md`
- 组织规范:
  - `standards/document/详细设计书写规范.md` §5.4
  - `standards/document/子项目目录与代码文件组织规范.md`
  - `standards/document/设计文档讨论中间产物规范.md` §5.7

### 3. SOP 问题回答

1. 本轮实现包含哪些 crate / package / binary / library?

   回答:选择 workspace 多 crate 架构。本轮需要 7 个实现单元:
   - `contracts`:公共 Command / Query / Consumer / Event / Job / View / Receipt / Error DTO,以及共享 ref / state-visible marker。
   - `domain`:Process truth object、value object、状态、policy、不变量和 domain error。
   - `application`:application service、repository / port trait、UoW、idempotency、query / consumer / job orchestration。
   - `infra`:repository / adapter fake、config binding、publisher / resolver / handoff adapter 和 runtime builder。
   - `api`:同步 Command / Query handler 入口,只调用 application service。
   - `worker`:入站 event consumer、outbox publisher loop 和常驻 background worker。
   - `jobs`:projection rebuild、reference refresh、reconciliation、recovery maintenance、trace / archive handoff 等一次性 operations job。

   当前不单独创建 `cli`、`ops`、`config` 或 `observability` crate。配置结构归 `infra`,观测和审计 hook 分别由 `application` / `domain` / `infra` 对应模块承接。

2. 每个实现单元对应概要设计中的哪个代码主体?

   回答:实现单元按工程分层组织,不是按 10 个业务组成部分拆 crate。10 个业务组成部分会跨 crate 分布:
   - contracts 表达外部协议面。
   - domain 承载 truth / state / policy。
   - application 编排 command / query / consumer / job。
   - infra 承载 repository、adapter、publisher、handoff 和 config。
   - api / worker / jobs 分别承载同步入口、常驻异步入口和一次性 operations job。

3. 文件路径应该如何组织,才能体现模块边界?

   回答:目标实现仓为 `/home/aris/Projects/quantalithos-process`。仓内使用 `crates/<role>`。每个 crate 内按职责文件拆分,不使用 `manager.rs`、`helper.rs`、`utils.rs` 等模糊文件。业务对象按 L1-process 主语命名,例如 `runtime_shape.rs`、`process_profile.rs`、`process_instance.rs`、`waiting_gate.rs`、`checkpoint.rs`、`recovery.rs`、`trace.rs`、`outbox.rs`。

4. 哪些文件必须创建,哪些文件只是后续可能扩展?

   回答:本 Step 只列必须创建的最小文件集合。`cli`、`ops`、更细的 adapter 子目录、真实数据库 migrations、report scripts、CI scripts 和 deployment 文件不在本 Step 固定;后续若实施计划需要,必须由 Step 14 / 16 / 17 或下游文档补齐。

5. 每个文件负责定义哪些对象、trait、handler、repository 或测试?

   回答:本 Step 只定义文件职责和承载面;对象字段、trait 函数签名、handler 函数、repository 函数、测试 case 名称分别留给 Step 6、Step 7、Step 8、Step 9 和 Step 16。

6. 当前仓的 project slug 是什么?

   回答:project slug 为 `process`。设计仓目录 `projects/L1-process/` 中的 `L1` 只用于设计导航,不得进入代码仓名、Cargo package、crate、module、file、type 或 function 名称。

7. workspace member 目录是否使用 `crates/<role>`?

   回答:是。使用 `crates/contracts`、`crates/domain`、`crates/application`、`crates/infra`、`crates/api`、`crates/worker`、`crates/jobs`。

8. Cargo package 是否使用 `<project>-<role>`?

   回答:是。使用 `process-contracts`、`process-domain`、`process-application`、`process-infra`、`process-api`、`process-worker`、`process-jobs`。

9. Rust library crate 是否使用 `<project>_<role>`?

   回答:是。使用 `process_contracts`、`process_domain`、`process_application`、`process_infra`、`process_api`、`process_worker`、`process_jobs`。

10. binary 名是否表达用户入口或具体动作?

    回答:是。`process-api` 表达 API server 入口,`process-worker` 表达常驻 worker 入口。jobs binary 必须表达具体动作,例如 `rebuild_process_projections`、`refresh_external_context_snapshots`、`run_process_reconciliation`、`maintain_recovery_attempts`、`prepare_process_trace_handoff`、`prepare_process_archive_handoff`。

11. 是否有 `L0` / `L1` / `l0_` / `l1_` 等架构层级泄漏进代码命名?

    回答:不允许。所有 package、crate、module、file、type、function 和 binary 名称不得包含 `L1`、`l1_`、`quantalithos_l1` 等设计导航信息。

12. 如果本仓存在已确认的编译期依赖,Cargo path dependency 应写在哪个 `Cargo.toml`,使用哪个真实 crate 路径?

    回答:workspace root 可在 `[workspace.dependencies]` 定义:

    ```toml
    core-contracts = { path = "../quantalithos-core/crates/contracts" }
    ```

    需要共享 Actor / Trace / Metadata / event envelope / error / ref 的 member 再通过 `core-contracts.workspace = true` 引用。默认允许 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 引用 `core-contracts`;具体是否引用在 Step 5 crate dependency matrix 进一步收口。

13. 哪些运行期依赖或事件协作依赖只能在 adapter / event / projection 章节表达,不能进入文件布局的 Cargo 依赖?

    回答:`L0-bus`、`L3-method-library`、`L1-work`、`L1-identity`、`L1-governance`、`L1-artifact`、`L2-runtime`、`L2-member-service`、`L1-conversation`、`L1-workspace`、`L0-sdk`、`L4-observability`、`L4-archive` 都不能进入 Cargo dependency。它们只能在 `application::ports`、`infra::*_adapters`、`contracts::events`、`worker::consumers`、`jobs::*` 和 tests fake 中表达。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `03-详细设计.md` | 旧文档没有按新版 workspace / role crate 形态组织,且混入旧 `ProcessTemplate` / `WaitingGateState` 文件心智 | 本 Step 重新定义 workspace 多 crate 布局 |
| `02-概要设计.md` §4 | 只给实现分层和代码主体骨架,明确不定义源码目录 | 本 Step 把概要层映射到具体 crate / file layout |
| Step 3 | 已确认只有 `L0-core` 是编译期依赖,但尚未说明进入哪个 Cargo | 本 Step 明确 root `[workspace.dependencies]` 和 member 引用口径 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-process` 当前未发现 | 不阻塞详细设计;进入实施计划 PH-01 前置门禁 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 布局形态 | 概要层只描述 Inbound / Application / Domain / Ports / Persistence / Projection / Outbox / Operations | 选择 workspace 多 crate 架构 | 需要公共 contracts、多入口和强依赖边界 |
| 目录命名 | 未固定实现仓目录和 member 名 | 固定 `/home/aris/Projects/quantalithos-process` 与 `crates/<role>` | 对齐目录组织规范 |
| package / crate 名 | 未固定 | `process-<role>` / `process_<role>` | 防止 `L1` 或 `quantalithos` 泄漏进代码命名 |
| config / observability | 可能被误拆成顶层 crate | 暂归 `infra` / `application` / `domain` 模块,不单独建 crate | 当前没有编译期复用需求 |
| 测试目录 | 未固定 | 预留 contract / domain / service / integration / support | 支撑后续 Step 16 和实施计划 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 单 crate 模块分层架构 | 初始代码少,搭建快 | contracts 难以被下游单独依赖;domain 纯净只能靠 review;API / worker / jobs 多入口边界不清 | 不采用 |
| B. workspace 多 crate 架构 | contracts 可独立复用;依赖方向可由 Cargo 强制;多入口清晰;适合长期平台化 | 初始 Cargo / crate 数量更多 | 采用 |
| C. 每个业务主要组成部分一个 crate | 业务名与 crate 对齐 | 业务组成部分跨实现分层,会导致 service / domain / infra 循环依赖 | 不采用 |
| D. 单独创建 config / observability crate | 复用边界明确 | 当前没有对外复用需求,会过早抽象 | 不采用 |

### 7. 结构化中间产物

#### 7.1 布局形态决策表

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层架构 | 否 | 本仓有公共 contracts、多运行入口和强边界需求 | 不采用 |
| workspace 多 crate 架构 | 是 | contracts / domain / application / infra / api / worker / jobs 边界清晰,Cargo 可强制依赖方向 | 需要建立多 member workspace 和 crate dependency matrix |
| 业务组成部分拆 crate | 否 | 业务组成部分跨分层,不适合作为 crate 边界 | 业务组成部分由模块 / service / object 组合表达 |

#### 7.2 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| `contracts` | library crate | 公共 DTO、ref、view、event、job、receipt、protocol error | §7 API / 接口骨架;§12 承接清单 |
| `domain` | library crate | 过程 truth object、状态、policy、不变量、domain error | §5 主要组成部分;§6 关键对象;§9 状态 |
| `application` | library crate | command / query / consumer / job service 编排,port trait,UoW,幂等 | §7 API / 接口骨架;§8 处理流 |
| `infra` | library crate | repository / adapter / publisher / resolver / handoff / config / runtime builder | §4 实现分层;§11 配置影响 |
| `api` | library crate 或 binary package | command / query handler 和 route / RPC assembly | §7 Command / Query |
| `worker` | library crate 或 binary package | inbound event consumer、outbox publish loop、projection maintenance loop | §7 Consumer / Outbound Event |
| `jobs` | library crate 或 binary package | projection rebuild、snapshot refresh、reconciliation、recovery maintenance、trace / archive handoff | §7 Operations Job;§8 Job flow |

#### 7.3 目录 / Package / Crate / Binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `process-contracts` | `process_contracts` | Command / Query / Consumer / Event / Job / View / Receipt / Error DTO,以及跨入口共享 ref / reason / metadata wrapper | 是 |
| `crates/domain` | library crate | `process-domain` | `process_domain` | RuntimeProcessShape、ProcessProfile、ProcessInstance、Activity、Token、Gateway、WaitingGate、Checkpoint、Recovery、policy、state、domain error | 否 |
| `crates/application` | library crate | `process-application` | `process_application` | application services、repository / port trait、UoW、idempotency、query / consumer / job orchestration | 否 |
| `crates/infra` | library crate | `process-infra` | `process_infra` | fake / durable repository adapter、resolver、publisher、handoff adapter、config binding、runtime builder | 否 |
| `crates/api` | library crate 或 binary package | `process-api` | `process_api` / `process-api` | Command / Query inbound handler 和 API server assembly | 否 |
| `crates/worker` | library crate 或 binary package | `process-worker` | `process_worker` / `process-worker` | inbound event consumer、outbox publisher loop、projection invalidation worker | 否 |
| `crates/jobs` | library crate 或 binary package | `process-jobs` | `process_jobs` / job binary names | operations job runner、projection rebuild、reference refresh、reconciliation、recovery maintenance、trace / archive handoff | 否 |

#### 7.4 文件布局树

```text
quantalithos-process/
  Cargo.toml                         # workspace root and shared dependencies
  crates/
    contracts/
      Cargo.toml
      src/
        lib.rs                       # public contracts exports
        refs.rs                      # typed ids, refs, reasons, shared state-visible markers
        metadata.rs                  # command, query, event, job metadata wrappers
        commands.rs                  # Command request / result DTO
        queries.rs                   # Query request / response DTO
        events.rs                    # inbound and outbound event payload DTO
        jobs.rs                      # operations job input / receipt DTO
        views.rs                     # query / projection-visible view DTO
        errors.rs                    # protocol error DTO and error code
        fixtures.rs                  # contract fixtures used by tests
    domain/
      Cargo.toml
      src/
        lib.rs                       # domain exports
        runtime_shape.rs             # RuntimeProcessShape and shape state
        process_profile.rs           # ProcessProfile and tailoring state
        process_instance.rs          # ProcessInstance lifecycle
        activity.rs                  # Activity lifecycle and feedback binding
        token_gateway.rs             # Token and Gateway flow control
        waiting_gate.rs              # WaitingGate and PauseContext
        checkpoint.rs                # ProcessCheckpoint
        recovery.rs                  # RecoveryAttempt and recovery history state
        rhythm.rs                    # ProcessStageState and ProcessTimeboxBinding
        reference.rs                 # local reference and snapshot domain value objects
        projection.rs                # DerivedProcessViewState and read model state
        trace.rs                     # ProcessTraceRecord and ProcessAuditTrail
        outbox.rs                    # ProcessOutboxRecord formation objects
        policies.rs                  # domain policies and guards
        errors.rs                    # DomainError
    application/
      Cargo.toml
      src/
        lib.rs                       # application exports
        services.rs                  # service assembly facade
        shape_service.rs             # runtime shape command use cases
        profile_service.rs           # profile adoption / tailoring use cases
        instance_service.rs          # instance start / lifecycle use cases
        activity_service.rs          # activity progression and feedback use cases
        waiting_gate_service.rs      # waiting gate open / resume use cases
        recovery_service.rs          # checkpoint and recovery use cases
        rhythm_service.rs            # stage / timebox binding use cases
        query_service.rs             # authorized query use cases
        consumer_service.rs          # inbound event consumer orchestration
        projection_service.rs        # projection rebuild / freshness use cases
        outbox_service.rs            # outbox publication orchestration
        trace_service.rs             # trace / archive handoff orchestration
        ports.rs                     # repository, resolver, publisher, handoff, clock, id traits
        unit_of_work.rs              # UnitOfWork trait and handle
        idempotency.rs               # idempotency records, digest, duplicate / conflict
        errors.rs                    # application port errors and protocol mappers
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
        source_resolvers.rs          # method / work / identity / governance / artifact / runtime / conversation resolvers
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
        projection_rebuild.rs        # rebuild derived process views
        reference_refresh.rs         # refresh external context snapshots
        reconciliation.rs            # reconciliation job
        recovery_maintenance.rs      # maintain recovery attempts
        trace_handoff.rs             # observability handoff job
        archive_handoff.rs           # archive handoff job
        errors.rs                    # JobError
  tests/
    contract/
      command_contract_tests.rs      # command DTO roundtrip and validation
      query_contract_tests.rs        # query DTO / view contract tests
      event_contract_tests.rs        # inbound / outbound event contract tests
      job_contract_tests.rs          # job input / receipt contract tests
    domain/
      state_transition_tests.rs      # state matrix tests
      policy_tests.rs                # policy guard tests
    service/
      command_flow_tests.rs          # application command flow tests
      consumer_flow_tests.rs         # consumer flow tests
      job_flow_tests.rs              # operations job flow tests
    integration/
      process_core_flow_tests.rs     # command + fake infra integration tests
    support/
      fixtures.rs                    # shared test fixtures
      fakes.rs                       # shared fake adapters
```

#### 7.5 文件职责表

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `Cargo.toml` | workspace root | workspace members、edition、shared dependencies | 固定 workspace 和 `core-contracts` path dependency |
| `crates/contracts/src/refs.rs` | contracts | ids、refs、reason、shared enum / marker | 提供 public protocol 可复用的共享类型 |
| `crates/contracts/src/commands.rs` | contracts | command request / result DTO | 定义同步写入口协议 |
| `crates/contracts/src/queries.rs` | contracts | query request DTO | 定义只读入口协议 |
| `crates/contracts/src/events.rs` | contracts | inbound / outbound event DTO | 定义事件消费与发布协议 |
| `crates/contracts/src/jobs.rs` | contracts | operations job input / receipt DTO | 定义 job public surface |
| `crates/contracts/src/views.rs` | contracts | query view / projection view DTO | 定义 read surface |
| `crates/domain/src/runtime_shape.rs` | domain | `RuntimeProcessShape` | 承载方法来源形成 runtime shape 的 truth |
| `crates/domain/src/process_profile.rs` | domain | `ProcessProfile` | 承载项目采用过程语境 |
| `crates/domain/src/process_instance.rs` | domain | `ProcessInstance` | 承载一次过程运行 truth |
| `crates/domain/src/activity.rs` | domain | `Activity` | 承载过程节点状态和反馈绑定 |
| `crates/domain/src/token_gateway.rs` | domain | `Token`、`Gateway` | 承载过程流控位置与分支合流 |
| `crates/domain/src/waiting_gate.rs` | domain | `WaitingGate`、`PauseContext` | 承载暂停等待和恢复依据 |
| `crates/domain/src/checkpoint.rs` | domain | `ProcessCheckpoint` | 承载恢复语境摘要 |
| `crates/domain/src/recovery.rs` | domain | `RecoveryAttempt` | 承载恢复尝试状态 |
| `crates/domain/src/rhythm.rs` | domain | `ProcessStageState`、`ProcessTimeboxBinding` | 承载过程节奏和 timebox 绑定 |
| `crates/domain/src/reference.rs` | domain | snapshot / reference value objects | 承载外部引用状态,不保存正文 |
| `crates/domain/src/projection.rs` | domain | derived state domain objects | 承载派生视图状态,不反写真相 |
| `crates/domain/src/trace.rs` | domain | trace / audit objects | 承载过程追溯与审计链 |
| `crates/domain/src/outbox.rs` | domain | outbox record formation | 从 committed truth 形成传播意图 |
| `crates/domain/src/policies.rs` | domain | process policies | 承载不变量和 guard |
| `crates/application/src/ports.rs` | application | repository / resolver / publisher / handoff traits | 定义 application 到 infra 的边界 |
| `crates/application/src/idempotency.rs` | application | idempotency model | 定义 request digest、duplicate、conflict 和 result replay |
| `crates/application/src/*_service.rs` | application | command / query / consumer / job services | 编排 transaction、domain 和 ports |
| `crates/infra/src/repositories.rs` | infra | truth repository adapters | 提供 fake / durable store 承接 |
| `crates/infra/src/source_resolvers.rs` | infra | external source adapters | 解析 method / work / identity / governance / artifact / runtime / conversation 引用 |
| `crates/api/src/*_handlers.rs` | api | API handlers | 转换 contracts DTO 与 application service |
| `crates/worker/src/consumers.rs` | worker | inbound consumer handlers | 承接外部事件并调用 application consumer service |
| `crates/jobs/src/*.rs` | jobs | operations job runners | 执行 rebuild、refresh、reconcile、maintenance、handoff |
| `tests/*` | tests | contract / domain / service / integration tests | 承接 Step 16 测试切口 |

#### 7.6 命名检查表

| 检查项 | 通过条件 | 结果 |
|---|---|---|
| project slug | 使用 `process` | 通过 |
| 实现仓目录 | `/home/aris/Projects/quantalithos-process` | 通过;当前实现仓未发现,进入实施前置 |
| workspace member | 使用 `crates/<role>` | 通过 |
| Cargo package | 使用 `process-<role>` | 通过 |
| Rust crate | 使用 `process_<role>` | 通过 |
| 架构层级泄漏 | 不出现 `L1` / `l1_` / `quantalithos_l1` | 通过 |
| 重复项目前缀 | 不写 `crates/process_domain` 或 `crates/process-contracts` | 通过 |
| 模糊文件名 | 不使用 `manager.rs`、`helper.rs`、`utils.rs` 顶层职责文件 | 通过 |

#### 7.7 跨仓 path dependency 表

| 依赖仓库 | 全局依赖类型 | Cargo.toml 位置 | path dependency 写法 | 说明 |
|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | workspace root `Cargo.toml` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | 真实路径已检查存在 |

运行期、事件协作、handoff 和下游消费依赖不得进入 path dependency 表。

### 8. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_04_file_layout.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“文件布局树”“文件职责表”和“命名检查表”小节,了解实现仓目录、workspace member、package / crate 命名和 path dependency 口径。

## 4. 实现单元与文件布局

本仓遵守 `standards/document/子项目目录与代码文件组织规范.md`。目标实现仓为 `/home/aris/Projects/quantalithos-process`,project slug 为 `process`。本轮采用 workspace 多 crate 架构,使用 `crates/contracts`、`crates/domain`、`crates/application`、`crates/infra`、`crates/api`、`crates/worker`、`crates/jobs` 表达实现边界。

### 4.1 布局形态决策

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层架构 | 否 | 公共 contracts、多运行入口和 domain 纯净边界需要强约束 | 不采用 |
| workspace 多 crate 架构 | 是 | Cargo workspace 可强制 contracts / domain / application / infra / api / worker / jobs 边界 | 建立多 member workspace |

### 4.2 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| `contracts` | library crate | 公共 DTO、ref、view、event、job、receipt、protocol error | §7 / §12 |
| `domain` | library crate | 过程 truth object、状态、policy、不变量、domain error | §5 / §6 / §9 |
| `application` | library crate | service 编排、port trait、UoW、幂等 | §7 / §8 |
| `infra` | library crate | repository、adapter、publisher、resolver、handoff、config | §4 / §11 |
| `api` | library crate 或 binary package | command / query handler | §7 Command / Query |
| `worker` | library crate 或 binary package | event consumer、outbox publisher、projection worker | §7 Consumer / Event |
| `jobs` | library crate 或 binary package | operations job runner | §7 Operations Job |

### 4.3 目录 / Package / Crate / Binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `process-contracts` | `process_contracts` | public contracts | 是 |
| `crates/domain` | library crate | `process-domain` | `process_domain` | domain model and policies | 否 |
| `crates/application` | library crate | `process-application` | `process_application` | application services and ports | 否 |
| `crates/infra` | library crate | `process-infra` | `process_infra` | adapters and runtime builder | 否 |
| `crates/api` | library crate / binary package | `process-api` | `process_api` / `process-api` | API handlers | 否 |
| `crates/worker` | library crate / binary package | `process-worker` | `process_worker` / `process-worker` | event and outbox workers | 否 |
| `crates/jobs` | library crate / binary package | `process-jobs` | `process_jobs` / job binary names | operations jobs | 否 |

### 4.4 跨仓 path dependency

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

除 `L0-core` 外,其他相邻仓不得进入 Cargo path dependency。

### 9. 待确认事项

- 无阻塞 Step 5 的待确认事项。
- 实施计划需要确认或创建 `/home/aris/Projects/quantalithos-process`。
- Step 5 需要继续给出 crate dependency matrix,明确哪些 crate 可依赖 `process_contracts`、`process_domain`、`process_application`、`process_infra`。

### 10. 进入下一步条件

- 已选择 workspace 多 crate 架构。
- 已固定实现仓目录、project slug、workspace member、Cargo package、Rust crate / binary 命名。
- 已给出最小文件布局树和文件职责表。
- 已确认唯一 path dependency 为 `core-contracts`。
- 可以进入 Step 5 “定义模块实现契约主轴”。
