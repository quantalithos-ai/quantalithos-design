# Step 4. 收稳实现单元与文件布局

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 4
- 回填章节:`03-详细设计.md` §4 实现单元与文件布局

### 2. 本步输入

- 上一步中间产物:
  - `projects/L1-governance/design-calibration/03_ddd_step_03_constraints.md`
- 上游正式文档:
  - `projects/L1-governance/02-概要设计.md` §4 / §5 / §12
- 概要设计校准来源:
  - `projects/L1-governance/design-calibration/02_hld_step_04_code_subject_framework.md`
  - `projects/L1-governance/design-calibration/02_hld_step_05_components_boundary.md`
  - `projects/L1-governance/design-calibration/02_hld_step_12_detailed_design_handoff.md`
- 组织规范:
  - `standards/document/详细设计书写规范.md` §5.4
  - `standards/document/子项目目录与代码文件组织规范.md`
  - `standards/document/设计文档讨论中间产物规范.md` §5.7

### 3. SOP 问题回答

1. 本轮实现包含哪些 crate / package / binary / library?

   回答:选择 workspace 多 crate 架构。本轮需要 7 个实现单元:
   - `contracts`:公共 Command / Query / Consumer / Event / Job / View / Receipt / Error DTO,以及共享 ref / reason / marker。
   - `domain`:Governance truth object、value object、状态、policy、不变量和 domain error。
   - `application`:application service、repository / port trait、UoW、idempotency、query / consumer / job orchestration。
   - `infra`:repository / adapter fake、config binding、publisher / resolver / handoff / external GRC adapter 和 runtime builder。
   - `api`:同步 Command / Query handler 入口,只调用 application service。
   - `worker`:入站 event consumer、outbox publisher loop 和常驻 background worker。
   - `jobs`:projection rebuild、external snapshot refresh、reconciliation、trace / archive handoff、external GRC export 等一次性 operations job。

   当前不单独创建 `cli`、`ops`、`config` 或 `observability` crate。配置结构归 `infra`,观测和审计 hook 分别由 `application` / `domain` / `infra` 对应模块承接。若后续需要人工运维命令,优先通过 `jobs` 中具体 job binary 表达;若出现交互式 CLI,必须在实施计划或后续设计中新增 `cli`。

2. 每个实现单元对应概要设计中的哪个代码主体?

   回答:实现单元按工程分层组织,不是按 10 个业务组成部分拆 crate。10 个业务组成部分会跨 crate 分布:
   - contracts 表达外部协议面。
   - domain 承载 truth / state / policy。
   - application 编排 command / query / consumer / job。
   - infra 承载 repository、adapter、publisher、handoff、external GRC export 和 config。
   - api / worker / jobs 分别承载同步入口、常驻异步入口和一次性 operations job。

3. 文件路径应该如何组织,才能体现模块边界?

   回答:目标实现仓为 `/home/aris/Projects/quantalithos-governance`。仓内使用 `crates/<role>`。每个 crate 内按职责文件拆分,不使用 `manager.rs`、`helper.rs`、`utils.rs` 等模糊文件。业务对象按 Governance 主语命名,例如 `governance_context.rs`、`governance_input.rs`、`gate.rs`、`decision.rs`、`approval_responsibility.rs`、`policy_effective.rs`、`control_compliance.rs`、`nonconformity.rs`、`trace_audit.rs`、`outbox.rs`。

4. 哪些文件必须创建,哪些文件只是后续可能扩展?

   回答:本 Step 只列必须创建的最小文件集合。`cli`、`ops`、更细的 adapter 子目录、真实数据库 migrations、report scripts、CI scripts 和 deployment 文件不在本 Step 固定;后续若实施计划需要,必须由 Step 14 / Step 16 / Step 17 或下游文档补齐。

5. 每个文件负责定义哪些对象、trait、handler、repository 或测试?

   回答:本 Step 只定义文件职责和承载面;对象字段、trait 函数签名、handler 函数、repository 函数、测试 case 名称分别留给 Step 6、Step 7、Step 8、Step 9 和 Step 16。

6. 当前仓的 project slug 是什么?

   回答:project slug 为 `governance`。设计仓目录 `projects/L1-governance/` 中的 `L1` 只用于设计导航,不得进入代码仓名、Cargo package、crate、module、file、type 或 function 名称。

7. workspace member 目录是否使用 `crates/<role>`?

   回答:是。使用 `crates/contracts`、`crates/domain`、`crates/application`、`crates/infra`、`crates/api`、`crates/worker`、`crates/jobs`。

8. Cargo package 是否使用 `<project>-<role>`?

   回答:是。使用 `governance-contracts`、`governance-domain`、`governance-application`、`governance-infra`、`governance-api`、`governance-worker`、`governance-jobs`。

9. Rust library crate 是否使用 `<project>_<role>`?

   回答:是。使用 `governance_contracts`、`governance_domain`、`governance_application`、`governance_infra`、`governance_api`、`governance_worker`、`governance_jobs`。

10. binary 名是否表达用户入口或具体动作?

    回答:是。`governance-api` 表达 API server 入口,`governance-worker` 表达常驻 worker 入口。jobs binary 必须表达具体动作,例如 `publish_governance_outbox`、`rebuild_governance_projections`、`refresh_governance_references`、`run_governance_reconciliation`、`prepare_governance_trace_handoff`、`prepare_governance_archive_handoff`、`prepare_external_grc_export`。

11. 是否有 `L0` / `L1` / `l0_` / `l1_` 等架构层级泄漏进代码命名?

    回答:不允许。所有 package、crate、module、file、type、function 和 binary 名称不得包含 `L1`、`l1_`、`quantalithos_l1` 等设计导航信息。

12. 如果本仓存在已确认的编译期依赖,Cargo path dependency 应写在哪个 `Cargo.toml`,使用哪个真实 crate 路径?

    回答:workspace root 可在 `[workspace.dependencies]` 定义:

    ```toml
    core-contracts = { path = "../quantalithos-core/crates/contracts" }
    ```

    需要共享 Actor / Trace / Metadata / event envelope / error / ref 的 member 再通过 `core-contracts.workspace = true` 引用。默认允许 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 引用 `core-contracts`;具体是否引用在 Step 5 crate dependency matrix 进一步收口。

13. 哪些运行期依赖或事件协作依赖只能在 adapter / event / projection 章节表达,不能进入文件布局的 Cargo 依赖?

    回答:`L0-bus`、`L1-identity`、`L1-process`、`L1-work`、`L1-artifact`、`L1-conversation`、`L2-runtime`、`L2-member-service`、`L3-capability-hub`、`L3-method-library`、`L4-observability`、`L4-archive`、`L1-workspace`、`L0-sdk`、`L5-console` 和 external GRC 系统都不能进入 Cargo dependency。它们只能在 `application::ports`、`infra::*_adapters`、`contracts::events`、`worker::consumers`、`jobs::*` 和 tests fake 中表达。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧版 `03-详细设计.md` | 旧文档没有按新版 workspace / role crate 形态组织,且仍以旧 `GovernanceRequest / Gate / Decision / Exception / RiskAcceptance` 心智组织对象 | 本 Step 重新定义 workspace 多 crate 布局 |
| `02-概要设计.md` §4 | 只给实现分层和代码主体骨架,明确不定义源码目录 | 本 Step 把概要层映射到具体 crate / file layout |
| Step 3 | 已确认只有 `L0-core` 是编译期依赖,但尚未说明进入哪个 Cargo | 本 Step 明确 root `[workspace.dependencies]` 和 member 引用口径 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-governance` 当前未发现 | 不阻塞详细设计;进入实施计划 PH-01 前置门禁 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 布局形态 | 概要层只描述 Inbound / Operations / Application / Domain / Ports / Persistence / Projection / Outbox / Handoff | 选择 workspace 多 crate 架构 | 需要公共 contracts、多入口和强依赖边界 |
| 目录命名 | 未固定实现仓目录和 member 名 | 固定 `/home/aris/Projects/quantalithos-governance` 与 `crates/<role>` | 对齐目录组织规范 |
| package / crate 名 | 未固定 | `governance-<role>` / `governance_<role>` | 防止 `L1` 或 `quantalithos` 泄漏进代码命名 |
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
| `domain` | library crate | Governance truth object、状态、policy、不变量、domain error | §5 主要组成部分;§6 关键对象;§9 状态 |
| `application` | library crate | command / query / consumer / job service 编排,port trait,UoW,幂等 | §7 API / 接口骨架;§8 处理流 |
| `infra` | library crate | repository / adapter / publisher / resolver / handoff / external GRC / config / runtime builder | §4 实现分层;§11 配置影响 |
| `api` | library crate 或 binary package | command / query handler 和 route / RPC assembly | §7 Command / Query |
| `worker` | library crate 或 binary package | inbound event consumer、outbox publish loop、projection maintenance loop | §7 Consumer / Outbound Event |
| `jobs` | library crate 或 binary package | outbox publish、projection rebuild、snapshot refresh、reconciliation、trace / archive handoff、external GRC export | §7 Operations Job;§8 Job flow |

#### 7.3 目录 / Package / Crate / Binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `governance-contracts` | `governance_contracts` | Command / Query / Consumer / Event / Job / View / Receipt / Error DTO,以及跨入口共享 ref / reason / metadata wrapper | 是 |
| `crates/domain` | library crate | `governance-domain` | `governance_domain` | GovernanceContext、Gate、Decision、Approval、Policy、Control、Compliance、Nonconformity、projection、reference、trace、outbox、policy、state、domain error | 否 |
| `crates/application` | library crate | `governance-application` | `governance_application` | application services、repository / port trait、UoW、idempotency、query / consumer / job orchestration | 否 |
| `crates/infra` | library crate | `governance-infra` | `governance_infra` | fake / durable repository adapter、resolver、publisher、handoff adapter、external GRC adapter、config binding、runtime builder | 否 |
| `crates/api` | library crate 或 binary package | `governance-api` | `governance_api` / `governance-api` | Command / Query inbound handler 和 API server assembly | 否 |
| `crates/worker` | library crate 或 binary package | `governance-worker` | `governance_worker` / `governance-worker` | inbound event consumer、outbox publisher loop、projection invalidation worker | 否 |
| `crates/jobs` | library crate 或 binary package | `governance-jobs` | `governance_jobs` / job binary names | operations job runner、outbox publish、projection rebuild、reference refresh、reconciliation、trace / archive handoff、external GRC export | 否 |

#### 7.4 文件布局树

```text
quantalithos-governance/
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
        governance_context.rs        # GovernanceContext and context readiness state
        governance_input.rs          # GovernanceInput and input acceptance state
        gate.rs                      # Gate lifecycle
        decision.rs                  # GovernanceDecision and DecisionRecord
        approval_responsibility.rs   # ApprovalResponsibility and ResponsibilityChain
        policy_effective.rs          # PolicyEffectiveFact and PolicyConflictRecord
        shared_rules.rs              # SharedRuleSet and scope constraints
        control_compliance.rs        # ControlApplicability, ControlReview, AIIA / SoA conclusion
        nonconformity.rs             # NonconformityRecord, CorrectiveAction, VerificationResult
        reference_snapshot.rs        # local reference and snapshot domain value objects
        projection.rs                # DerivedGovernanceViewState and report state
        trace_audit.rs               # GovernanceTraceRecord and GovernanceAuditTrail
        outbox.rs                    # GovernanceOutboxRecord formation objects
        policies.rs                  # domain policies and guards
        errors.rs                    # DomainError
    application/
      Cargo.toml
      src/
        lib.rs                       # application exports
        services.rs                  # service assembly facade
        context_service.rs           # context and input command use cases
        decision_service.rs          # gate and decision use cases
        approval_service.rs          # approval and responsibility use cases
        policy_service.rs            # policy effective fact, shared rules and conflict use cases
        control_compliance_service.rs # control, AIIA and SoA use cases
        nonconformity_service.rs     # nonconformity corrective loop use cases
        query_service.rs             # authorized query use cases
        consumer_service.rs          # inbound event consumer orchestration
        projection_service.rs        # projection rebuild / freshness use cases
        outbox_service.rs            # outbox publication orchestration
        handoff_service.rs           # trace and archive handoff orchestration
        external_grc_service.rs      # external GRC export orchestration
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
        source_resolvers.rs          # identity / method / process / work / artifact / runtime / conversation / observability resolvers
        publishers.rs                # bus / fake publisher adapter
        handoff_adapters.rs          # observability and archive handoff adapters
        external_grc_adapters.rs     # external GRC export target adapters
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
        outbox_publish.rs            # publish governance outbox once
        projection_rebuild.rs        # rebuild derived governance views
        reference_refresh.rs         # refresh external context snapshots
        reconciliation.rs            # reconciliation job
        trace_handoff.rs             # observability handoff job
        archive_handoff.rs           # archive handoff job
        external_grc_export.rs       # external GRC export preparation job
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
      query_flow_tests.rs            # authorized query tests
      consumer_flow_tests.rs         # consumer flow tests
      job_flow_tests.rs              # operations job flow tests
    integration/
      governance_core_flow_tests.rs  # command + fake infra integration tests
      outbox_projection_tests.rs     # outbox and projection integration tests
      handoff_export_tests.rs        # trace / archive / external GRC handoff tests
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
| `crates/domain/src/governance_context.rs` | domain | `GovernanceContext` | 承载治理语境 truth |
| `crates/domain/src/governance_input.rs` | domain | `GovernanceInput` | 承载可裁决输入 truth |
| `crates/domain/src/gate.rs` | domain | `Gate` | 承载治理裁决入口和生命周期 |
| `crates/domain/src/decision.rs` | domain | `GovernanceDecision`、`DecisionRecord` | 承载正式裁决和历史修正 |
| `crates/domain/src/approval_responsibility.rs` | domain | approval responsibility objects | 承载审批、投票、委托和责任链 |
| `crates/domain/src/policy_effective.rs` | domain | policy fact and conflict objects | 承载 Policy 生效事实和冲突 |
| `crates/domain/src/shared_rules.rs` | domain | shared rules objects | 承载组织级 hard constraint |
| `crates/domain/src/control_compliance.rs` | domain | control and compliance conclusion objects | 承载 Control、AIIA、SoA 结论 |
| `crates/domain/src/nonconformity.rs` | domain | nonconformity corrective objects | 承载不符合、纠正和复验闭环 |
| `crates/domain/src/reference_snapshot.rs` | domain | snapshot / reference value objects | 承载外部引用状态,不保存正文 |
| `crates/domain/src/projection.rs` | domain | derived state domain objects | 承载派生视图状态,不反写真相 |
| `crates/domain/src/trace_audit.rs` | domain | trace / audit objects | 承载治理追溯与审计链 |
| `crates/domain/src/outbox.rs` | domain | outbox record formation | 从 committed truth 形成传播意图 |
| `crates/domain/src/policies.rs` | domain | governance policies | 承载不变量和 guard |
| `crates/application/src/ports.rs` | application | repository / resolver / publisher / handoff traits | 定义 application 到 infra 的边界 |
| `crates/application/src/idempotency.rs` | application | idempotency model | 定义 request digest、duplicate、conflict 和 result replay |
| `crates/application/src/*_service.rs` | application | command / query / consumer / job services | 编排 transaction、domain 和 ports |
| `crates/infra/src/repositories.rs` | infra | truth repository adapters | 提供 fake / durable store 承接 |
| `crates/infra/src/source_resolvers.rs` | infra | external source adapters | 解析 identity / method / process / work / artifact / runtime / conversation / observability 引用 |
| `crates/infra/src/external_grc_adapters.rs` | infra | external GRC target adapter | 只导出 Governance facts,不定义 truth |
| `crates/api/src/*_handlers.rs` | api | API handlers | 转换 contracts DTO 与 application service |
| `crates/worker/src/consumers.rs` | worker | inbound consumer handlers | 承接外部事件并调用 application consumer service |
| `crates/jobs/src/*.rs` | jobs | operations job runners | 执行 publish、rebuild、refresh、reconcile、handoff、export |
| `tests/*` | tests | contract / domain / service / integration tests | 承接 Step 16 测试切口 |

#### 7.6 命名检查表

| 检查项 | 通过条件 | 结果 |
|---|---|---|
| 实现仓目录 | `/home/aris/Projects/quantalithos-governance` | 待实施计划 PH-01 确认 |
| project slug | `governance` | 通过 |
| member 目录 | `crates/<role>`,不含 `governance_` / `l1_` / `quantalithos` 前缀 | 通过 |
| Cargo package | `governance-<role>` | 通过 |
| Rust library crate | `governance_<role>` | 通过 |
| binary 名 | `governance-api`、`governance-worker` 或具体 job action name | 通过 |
| 架构层级泄漏 | 代码命名中不出现 `L1` / `l1_` | 通过 |
| 顶层职责目录 | 不出现 `utils`、`common`、`helper` | 通过 |
| 外部仓文件 | 不把 sibling repo 文件写入本仓目录树 | 通过 |

#### 7.7 Crate 依赖方向预告

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
- `application` 不依赖具体 `infra` adapter。
- `api`、`worker`、`jobs` 不直接改写 truth,只能调用 application service。
- 非 `core-contracts` 的 sibling 仓不得出现在 Cargo dependency。

#### 7.8 编译期依赖落点表

| 依赖仓库 | 全局依赖类型 | Cargo.toml 位置 | path dependency 写法 | 说明 |
|---|---|---|---|---|
| `quantalithos-core` / `core-contracts` | 编译期依赖 | workspace root `Cargo.toml` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | member crate 通过 `core-contracts.workspace = true` 引用 |
| `quantalithos-bus` | 事件协作依赖 | 不写入 Cargo | 不适用 | 通过 publisher / consumer adapter 表达 |
| `quantalithos-identity`、`quantalithos-process`、`quantalithos-work`、`quantalithos-artifact`、`quantalithos-method-library`、`quantalithos-runtime`、`quantalithos-conversation` | 运行期 / 事件协作依赖 | 不写入 Cargo | 不适用 | 通过 port、adapter、snapshot、event、fake 表达 |
| `quantalithos-observability`、`quantalithos-archive`、external GRC system | handoff / export / 下游消费依赖 | 不写入 Cargo | 不适用 | 通过 handoff / export adapter 和 job 表达 |

### 8. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_04_file_layout.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“设计取舍”和“待确认事项”小节,了解实现单元、目录 / package / crate / binary 映射和文件职责如何收敛。

## 4. 实现单元与文件布局

本仓目标实现仓为 `/home/aris/Projects/quantalithos-governance`,project slug 为 `governance`。本轮采用 Rust workspace 多 crate 架构,使用 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个 workspace member。`L1` 只保留在设计仓路径中,不得进入实现仓、Cargo package、Rust crate、module、file、type、function 或 binary 名称。

### 4.1 布局形态决策

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层架构 | 否 | 本仓有公共 contracts、多运行入口和强边界需求 | 不采用 |
| workspace 多 crate 架构 | 是 | contracts / domain / application / infra / api / worker / jobs 边界清晰,Cargo 可强制依赖方向 | 建立多 member workspace 和 crate dependency matrix |
| 业务组成部分拆 crate | 否 | 业务组成部分跨分层,不适合作为 crate 边界 | 业务组成部分由模块 / service / object 组合表达 |

### 4.2 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| `contracts` | library crate | 公共 DTO、ref、view、event、job、receipt、protocol error | §7 / §12 |
| `domain` | library crate | Governance truth object、状态、policy、不变量、domain error | §5 / §6 / §9 |
| `application` | library crate | service 编排、port trait、UoW、幂等 | §7 / §8 |
| `infra` | library crate | repository / adapter / publisher / resolver / handoff / external GRC / config / runtime builder | §4 / §11 |
| `api` | library crate 或 binary package | command / query handler 和 route / RPC assembly | §7 |
| `worker` | library crate 或 binary package | inbound event consumer、outbox publish loop、projection maintenance loop | §7 |
| `jobs` | library crate 或 binary package | operations job runner | §7 / §8 |

### 4.3 目录 / Package / Crate / Binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `governance-contracts` | `governance_contracts` | public contracts | 是 |
| `crates/domain` | library crate | `governance-domain` | `governance_domain` | domain truth and policies | 否 |
| `crates/application` | library crate | `governance-application` | `governance_application` | use case orchestration and ports | 否 |
| `crates/infra` | library crate | `governance-infra` | `governance_infra` | adapters and runtime builder | 否 |
| `crates/api` | library crate / binary | `governance-api` | `governance_api` / `governance-api` | API handlers | 否 |
| `crates/worker` | library crate / binary | `governance-worker` | `governance_worker` / `governance-worker` | event and outbox worker | 否 |
| `crates/jobs` | library crate / binary | `governance-jobs` | `governance_jobs` / job binary names | operations jobs | 否 |

### 9. 待确认事项

- 无阻塞 Step 5 的待确认事项。
- 实施计划需要把 `/home/aris/Projects/quantalithos-governance` 是否存在作为 PH-01 前置检查。
- Step 5 需要把本 Step 的 crate 依赖方向预告收口为正式 crate dependency matrix。
- Step 6~8 如果发现当前文件布局不足以容纳正式对象、trait 或 protocol,必须回到本 Step 修正,不得在正式 `03` 暗加未校准文件。

### 10. 进入下一步条件

- 已选择 workspace 多 crate 架构。
- 已固定目标实现仓目录、project slug、workspace member、Cargo package、Rust crate 和 binary 命名。
- 已给出文件布局树、文件职责表、命名检查表和编译期依赖落点。
- 可以进入 Step 5 “定义模块实现契约主轴”。
