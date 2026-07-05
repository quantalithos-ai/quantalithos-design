# Step 4. 收稳实现单元与文件布局

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 4
> 回填章节: `03-详细设计.md` §4 实现单元与文件布局
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步输入

| 输入 | 当前状态 | 用途 |
|---|---|---|
| `projects/L1-artifact/design-calibration/03_ddd_step_03_constraints.md` | 已完成 | 提供 Rust、依赖裁剪、实现仓路径和 path dependency 约束 |
| `projects/L1-artifact/02-概要设计.md` §4 / §5 / §12 | 已读取 | 提供 13 个代码主体、10 个主要组成部分和详细设计承接清单 |
| `projects/L1-artifact/design-calibration/02_hld_step_04_code_subject_framework.md` | 已读取 | 提供代码主体骨架与实现分层映射 |
| `projects/L1-artifact/design-calibration/02_hld_step_05_components_boundary.md` | 已读取 | 提供业务主语和职责边界 |
| `projects/L1-artifact/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 已读取 | 提供 `03` 需要继续下沉的实现级输入 |
| `standards/document/详细设计书写规范.md` §3 / §4 | 已读取 | 提供正式章节和代码块 / 表格约束 |
| `standards/document/子项目目录与代码文件组织规范.md` | 已读取 | 提供实现仓、workspace member、package / crate / binary 命名规则 |
| `projects/L1-governance/design-calibration/03_ddd_step_04_file_layout.md` | 已读取 | 作为 Step 4 的结构和粒度参考 |
| `projects/L1-artifact/03-详细设计.md` | 历史草稿 | 只用于诊断旧目录树和不得继承的旧布局 |

---

## 2. SOP 问题回答

### 2.1 本轮实现包含哪些 crate / package / binary / library?

本轮选择 Rust workspace 多 crate 架构。

必须创建的最小实现单元是:

- `contracts`
- `domain`
- `application`
- `infra`
- `api`
- `worker`
- `jobs`

当前不单独创建 `cli`、`ops`、`config` 或 `observability` crate:

- `config` 归 `infra`
- 审计 / 观测 hook 归 `domain`、`application`、`infra`
- 人工运维或交互式命令当前不是 Step 4 必需前提

### 2.2 每个实现单元对应概要设计中的哪个代码主体?

实现单元按工程分层组织,不是按 10 个业务组成部分逐个拆 crate。

- `contracts`
  - 承接五类接口骨架的公共 DTO、view、event、job surface
- `domain`
  - 承接 `Artifact Truth Domain Core`
- `application`
  - 承接 `Truth Write Services`
  - 承接 `Truth Read / Consumption Services`
  - 承接 `Intake / Review Boundary Services`
  - 承接 `Derived Maintenance Services`
  - 同时定义 `Truth Persistence Ports`、`Reference / Snapshot / Body Source Ports`、`Derived Persistence / Handoff Preparation Ports`、`Event / Audit / Handoff Relay Ports` 的 trait 边界
- `infra`
  - 承接 repository、resolver、publisher、handoff、config 和 runtime wiring
- `api`
  - 承接 `Artifact Sync Entry`
- `worker`
  - 承接 `Artifact Async Intake`
- `jobs`
  - 承接 `Artifact Operations Jobs`

### 2.3 文件路径应该如何组织,才能体现模块边界?

目标实现仓路径固定为:

```text
/home/aris/Projects/quantalithos-artifact
```

仓内目录使用:

```text
crates/<role>
```

每个 crate 内部文件按职责命名,不使用 `utils.rs`、`helpers.rs`、`common.rs`、`manager.rs` 这类模糊文件名。

### 2.4 哪些文件必须创建,哪些文件只是后续可能扩展?

本步只固定必须创建的最小文件集合:

- workspace root `Cargo.toml`
- 7 个 member 的 `Cargo.toml`
- 每个 member 的 `src/lib.rs`
- 对应业务主语、协议族、service 族、adapter 族的最小职责文件
- `tests/` 下的 contract / domain / service / integration / support 测试目录

以下内容不在本步固定:

- migrations
- scripts
- CI files
- deployment files
- 可选 `cli` / `ops` crate
- 具体 durable backend adapter 子目录深度

### 2.5 每个文件负责定义哪些对象、trait、handler、repository 或测试?

本步只固定文件承载责任,不提前写字段全集或函数签名:

- `contracts`:
  request / response / event / job / view / public error
- `domain`:
  Artifact truth、state、policy、audit / outbox formation objects
- `application`:
  command / query / consumer / job orchestration、ports、UoW、idempotency
- `infra`:
  repository / resolver / publisher / handoff / config adapters
- `api`:
  command / query handlers
- `worker`:
  inbound consumers 和常驻 relay / maintenance loops
- `jobs`:
  rebuild / refresh / reconcile / handoff one-shot jobs
- `tests`:
  contract、state matrix、service flow、integration 最小验证

### 2.6 当前仓的 project slug 是什么?

project slug 固定为:

```text
artifact
```

`L1` 只存在于设计仓目录 `projects/L1-artifact/` 中,不得泄漏进实现仓 package、crate、module、file、type 或 function 命名。

### 2.7 workspace member 目录是否使用 `crates/<role>`?

是。固定为:

- `crates/contracts`
- `crates/domain`
- `crates/application`
- `crates/infra`
- `crates/api`
- `crates/worker`
- `crates/jobs`

### 2.8 Cargo package 是否使用 `<project>-<role>`?

是。固定为:

- `artifact-contracts`
- `artifact-domain`
- `artifact-application`
- `artifact-infra`
- `artifact-api`
- `artifact-worker`
- `artifact-jobs`

### 2.9 Rust library crate 是否使用 `<project>_<role>`?

是。固定为:

- `artifact_contracts`
- `artifact_domain`
- `artifact_application`
- `artifact_infra`
- `artifact_api`
- `artifact_worker`
- `artifact_jobs`

### 2.10 binary 名是否表达用户入口或具体动作?

是。

- API 入口 binary:
  `artifact-api`
- 常驻 worker binary:
  `artifact-worker`
- jobs binary:
  - `rebuild_artifact_projections`
  - `refresh_artifact_references`
  - `run_artifact_reconciliation`
  - `prepare_archive_handoff`
  - `prepare_observability_handoff`
  - `prepare_sync_handoff`

### 2.11 是否有 `L0` / `L1` / `l0_` / `l1_` 等架构层级泄漏进代码命名?

不允许。

所有 package、crate、module、file、type、function 和 binary 名称都不得包含:

- `L0`
- `L1`
- `l0_`
- `l1_`
- `quantalithos_l1`

### 2.12 如果本仓存在已确认的编译期依赖, Cargo path dependency 应写在哪个 `Cargo.toml`,使用哪个真实 crate 路径?

当前唯一允许的编译期依赖是 `core-contracts`。

写法固定在 workspace root `Cargo.toml`:

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

需要共享 typed ref、actor、trace、metadata、error 契约的 member 再通过:

```toml
core-contracts.workspace = true
```

进行引用。

### 2.13 哪些运行期依赖或事件协作依赖只能在 adapter / event / projection 章节表达,不能进入文件布局的 Cargo 依赖?

以下都不能进入 Cargo dependency:

- `L0-bus`
- `L1-governance`
- `L1-work`
- `L1-process`
- `L1-conversation`
- `L1-workspace`
- `L3-method-library`
- `L2-runtime`
- `L4-observability`
- `L4-archive`
- `L0-sdk`

它们只能在后续章节中以以下形式出现:

- port trait
- runtime adapter
- event publish / subscribe
- snapshot / safe summary resolver
- handoff target / receipt
- fake adapter / integration seam

---

## 3. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `projects/L1-artifact/03-详细设计.md` | 使用旧单 crate `src/` 目录树,并按旧五部分组织对象 | 本步完全不继承旧目录结构 |
| 正式 `02-概要设计.md` §4 | 只固定代码主体骨架,没有 crate / file 布局 | 本步把代码主体映射到 workspace member 和最小文件集合 |
| Step 3 | 已明确只有 `L0-core` 可作为编译期依赖,但尚未固定放在哪个 `Cargo.toml` | 本步固定 root `Cargo.toml` 的 `[workspace.dependencies]` 写法 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-artifact` 当前未发现 | 不阻塞文件布局设计,但实施前必须检查落地 |

---

## 4. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 布局形态 | 只知道后续要落 Rust 仓 | 固定为 workspace 多 crate 架构 | 需要 contracts 复用、多入口和清晰依赖方向 |
| 目录命名 | 尚未固定 | 固定为 `quantalithos-artifact` + `crates/<role>` | 对齐目录组织规范 |
| package / crate 命名 | 尚未固定 | 固定为 `artifact-<role>` / `artifact_<role>` | 避免架构层级泄漏进代码命名 |
| path dependency 位置 | 只知道要依赖 `L0-core` | 固定到 workspace root `[workspace.dependencies]` | 防止 member 各自漂移 |
| 旧布局影响 | 旧 `03` 仍有遗留目录树 | 新版 `03` 完全改按 Step 4 结论推进 | 避免旧主线污染 |

---

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 单 crate 模块分层架构 | 起步文件更少 | public contracts 复用、入口隔离和依赖方向约束都较弱 | 不采用 |
| B. workspace 多 crate 架构 | contracts 可独立复用,多入口清晰,依赖方向可由 Cargo 强制 | member 数量更多 | 采用 |
| C. 每个业务主要组成部分一个 crate | 业务名与 crate 对齐 | 业务主语跨工程分层,容易产生循环依赖 | 不采用 |
| D. 额外拆 `config` / `observability` 顶层 crate | 横切看似更独立 | 当前没有单独复用价值,属于过早抽象 | 不采用 |

---

## 6. 结构化中间产物

### 6.1 布局形态决策表

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层 | 否 | contracts 复用、多入口和依赖裁剪约束不足 | 不采用 |
| workspace 多 crate | 是 | 13 个代码主体可清晰落位,contracts 可独立复用 | 需要 workspace root 和 member matrix |
| 业务组成部分拆 crate | 否 | 10 个组成部分是业务轴,不是工程分层轴 | 不采用 |

### 6.2 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| `contracts` | library crate | Command / Query / Consumer / Event / Job / View / Error DTO 与共享 public carrier | `02` §7 / §12 |
| `domain` | library crate | Artifact truth object、state、policy、不变量、audit / outbox formation object | `02` §5 / §6 / §9 |
| `application` | library crate | command / query / consumer / job orchestration、ports、UoW、idempotency | `02` §7 / §8 / §12 |
| `infra` | library crate | repository / resolver / publisher / handoff / config / runtime wiring | `02` §4 / §11 / §12 |
| `api` | library crate + binary package | 同步 Command / Query 入口与 server assembly | `02` §4 / §7 |
| `worker` | library crate + binary package | 异步 consumers、resident relay / maintenance loop | `02` §4 / §7 |
| `jobs` | library crate + binary package | rebuild / refresh / reconcile / handoff one-shot jobs | `02` §4 / §7 / §8 |

### 6.3 目录 / Package / Crate / Binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `artifact-contracts` | `artifact_contracts` | public DTO、view、event、job、error、shared ref | 是 |
| `crates/domain` | library crate | `artifact-domain` | `artifact_domain` | truth、policy、state、audit / outbox formation | 否 |
| `crates/application` | library crate | `artifact-application` | `artifact_application` | service orchestration、ports、UoW、idempotency | 否 |
| `crates/infra` | library crate | `artifact-infra` | `artifact_infra` | repository / adapter / config / runtime builder | 否 |
| `crates/api` | binary-oriented crate | `artifact-api` | `artifact_api` / `artifact-api` | sync inbound entry | 否 |
| `crates/worker` | binary-oriented crate | `artifact-worker` | `artifact_worker` / `artifact-worker` | async intake and resident loops | 否 |
| `crates/jobs` | binary-oriented crate | `artifact-jobs` | `artifact_jobs` / action binaries | one-shot maintenance and handoff jobs | 否 |

### 6.4 文件布局树

```text
quantalithos-artifact/
  Cargo.toml                               # workspace root and shared dependencies
  crates/
    contracts/
      Cargo.toml
      src/
        lib.rs                             # public exports
        refs.rs                            # typed ids, refs, reasons and markers
        metadata.rs                        # command, query, event and job metadata wrappers
        commands.rs                        # command request and result DTO
        queries.rs                         # query request and response DTO
        events.rs                          # inbound and outbound event payload DTO
        jobs.rs                            # operations job input and receipt DTO
        views.rs                           # query and projection-visible view DTO
        errors.rs                          # protocol-visible error DTO
    domain/
      Cargo.toml
      src/
        lib.rs                             # domain exports
        artifact_fact.rs                   # ArtifactFact and ArtifactContentFactContext
        artifact_version.rs                # ArtifactVersion and ArtifactVersionCandidate
        artifact_lineage.rs                # ArtifactLineageLink
        artifact_baseline.rs               # ArtifactBaseline and ArtifactBaselineMembership
        artifact_intake.rs                 # ArtifactIntakeContext and ArtifactSubmissionRecord
        artifact_review.rs                 # ArtifactReviewAnchor and ArtifactResponsibilityAssignment
        automation_boundary.rs             # AutomationArtifactInput
        artifact_consumption.rs            # ConsumableArtifactReference and ArtifactConsumptionBackref
        artifact_projection.rs             # ArtifactDerivedViewState and report state
        external_reference.rs              # ExternalReferenceResolutionState and local mirror values
        trace_audit.rs                     # trace and audit domain objects
        outbox.rs                          # outbox formation objects
        policies.rs                        # domain policies and guards
        errors.rs                          # DomainError
    application/
      Cargo.toml
      src/
        lib.rs                             # application exports
        services.rs                        # application service assembly facade
        fact_service.rs                    # fact establishment use cases
        version_service.rs                 # version publish and replace use cases
        lineage_service.rs                 # lineage establishment use cases
        baseline_service.rs                # baseline freeze and read use cases
        intake_service.rs                  # intake convergence and review boundary use cases
        consumption_service.rs             # read surface and backref use cases
        consumer_service.rs                # inbound consumer orchestration
        maintenance_service.rs             # projection, refresh and reconciliation orchestration
        handoff_service.rs                 # archive, observability and sync handoff orchestration
        ports.rs                           # repository, resolver, publisher, handoff, clock and id traits
        unit_of_work.rs                    # UnitOfWork trait and handles
        idempotency.rs                     # request digest, duplicate, conflict and replay
        errors.rs                          # ApplicationError
    infra/
      Cargo.toml
      src/
        lib.rs                             # infra exports
        config.rs                          # runtime config structs and validation
        runtime_builder.rs                 # wiring of repos, adapters and services
        truth_repositories.rs              # fact, version, lineage, baseline repositories
        projection_stores.rs               # summary, preview, report and reconciliation stores
        reference_stores.rs                # context, definition and mirror stores
        outbox_store.rs                    # outbox repository adapter
        idempotency_store.rs               # idempotency repository adapter
        source_resolvers.rs                # work, process, governance, method, runtime and content resolvers
        publishers.rs                      # bus and fake publisher adapters
        handoff_adapters.rs                # archive, observability and sync handoff adapters
        clock_id.rs                        # clock and id generator adapters
        errors.rs                          # InfraError
    api/
      Cargo.toml
      src/
        lib.rs                             # api exports
        command_handlers.rs                # command boundary
        query_handlers.rs                  # query boundary
        routes.rs                          # route or RPC assembly
        errors.rs                          # API error mapping
        main.rs                            # artifact-api binary
    worker/
      Cargo.toml
      src/
        lib.rs                             # worker exports
        consumers.rs                       # inbound event consumers
        relay_worker.rs                    # outbox relay and publication loop
        maintenance_worker.rs              # resident invalidation or scheduling loop
        errors.rs                          # WorkerError
        main.rs                            # artifact-worker binary
    jobs/
      Cargo.toml
      src/
        lib.rs                             # jobs exports
        errors.rs                          # JobError
        bin/
          rebuild_artifact_projections.rs  # rebuild derived views
          refresh_artifact_references.rs   # refresh external references
          run_artifact_reconciliation.rs   # reconciliation job
          prepare_archive_handoff.rs       # archive handoff job
          prepare_observability_handoff.rs # observability handoff job
          prepare_sync_handoff.rs          # sync handoff job
  tests/
    contract/
      command_contract_tests.rs            # command DTO contract tests
      query_contract_tests.rs              # query DTO and view contract tests
      event_contract_tests.rs              # inbound and outbound event contract tests
      job_contract_tests.rs                # job input and receipt contract tests
    domain/
      state_transition_tests.rs            # state matrix tests
      policy_tests.rs                      # policy and guard tests
    service/
      command_flow_tests.rs                # command service flow tests
      query_flow_tests.rs                  # authorized read flow tests
      consumer_flow_tests.rs               # consumer orchestration tests
      maintenance_flow_tests.rs            # maintenance and handoff flow tests
    integration/
      artifact_core_flow_tests.rs          # command + fake infra integration tests
      projection_handoff_tests.rs          # projection and handoff integration tests
    support/
      fixtures.rs                          # shared fixtures
      fakes.rs                             # shared fake adapters
```

### 6.5 文件职责表

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `Cargo.toml` | workspace root | workspace members、edition、shared deps | 固定 workspace 和 `core-contracts` 入口 |
| `crates/contracts/src/refs.rs` | contracts | ids、refs、reasons、markers | 提供 public protocol 复用的共享 carrier |
| `crates/contracts/src/commands.rs` | contracts | command DTO | 定义同步写入口协议 |
| `crates/contracts/src/queries.rs` | contracts | query DTO | 定义只读入口协议 |
| `crates/contracts/src/events.rs` | contracts | inbound / outbound event DTO | 定义事件协作协议 |
| `crates/contracts/src/jobs.rs` | contracts | operations job DTO | 定义 job public surface |
| `crates/contracts/src/views.rs` | contracts | read surface view DTO | 定义 query / projection 读取面 |
| `crates/domain/src/artifact_fact.rs` | domain | `ArtifactFact`、`ArtifactContentFactContext` | 承载制品事实锚点 |
| `crates/domain/src/artifact_version.rs` | domain | `ArtifactVersion`、candidate | 承载正式版本锚点 |
| `crates/domain/src/artifact_lineage.rs` | domain | lineage objects | 承载来源 / 替代 / 依赖 / 影响关系 |
| `crates/domain/src/artifact_baseline.rs` | domain | baseline objects | 承载正式冻结集合 |
| `crates/domain/src/artifact_consumption.rs` | domain | read anchor and backref objects | 承载消费与追溯回指 |
| `crates/application/src/ports.rs` | application | repository / resolver / publisher / handoff traits | 定义 application 到 infra 的边界 |
| `crates/application/src/fact_service.rs` | application | fact establishment service | 编排 fact 建立相关事务和 side effects |
| `crates/application/src/maintenance_service.rs` | application | maintenance orchestration service | 编排 rebuild / refresh / reconcile 和相关 side effects |
| `crates/infra/src/truth_repositories.rs` | infra | truth repo adapters | 承接 fact / version / lineage / baseline 持久化 |
| `crates/infra/src/source_resolvers.rs` | infra | external source adapters | 解析 work / process / governance / method / runtime / content 来源 |
| `crates/infra/src/handoff_adapters.rs` | infra | downstream handoff adapters | 向 archive / observability / sync 输出材料 |
| `crates/api/src/command_handlers.rs` | api | command handlers | 接收同步写请求并调用 application |
| `crates/api/src/query_handlers.rs` | api | query handlers | 接收只读请求并调用 application |
| `crates/worker/src/consumers.rs` | worker | inbound consumers | 接收外部事件并调用 consumer service |
| `crates/worker/src/relay_worker.rs` | worker | relay loop | 推进 outbox 发布 |
| `crates/jobs/src/bin/rebuild_artifact_projections.rs` | jobs | projection rebuild runner | 执行派生视图重建 |
| `crates/jobs/src/bin/prepare_archive_handoff.rs` | jobs | archive handoff runner | 生成 archive 交接材料 |

### 6.6 命名检查表

| 检查项 | 通过条件 | 结果 |
|---|---|---|
| project slug | 使用 `artifact` | pass |
| 实现仓目录 | 使用 `/home/aris/Projects/quantalithos-artifact` | pass |
| workspace member 目录 | 使用 `crates/<role>` | pass |
| Cargo package | 使用 `artifact-<role>` | pass |
| Rust crate | 使用 `artifact_<role>` | pass |
| binary 名 | 表达用户入口或具体动作 | pass |
| 架构层级泄漏 | 无 `L0` / `L1` / `l1_` 命名进入代码 | pass |
| 目录重复前缀 | 无 `crates/artifact_domain` 之类重复命名 | pass |

### 6.7 编译期依赖表

| 依赖仓库 | 全局依赖类型 | Cargo.toml 位置 | path dependency 写法 | 说明 |
|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | workspace root `Cargo.toml` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | 当前唯一允许进入 Cargo 依赖的 sibling repo |

---

## 7. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_04_file_layout.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“设计取舍”和“当前文档问题诊断”小节,了解实现单元与文件布局如何从概要骨架收敛而来。

## 4. 实现单元与文件布局

本仓目标实现选择 Rust workspace 多 crate 架构。实现仓目录固定为 `/home/aris/Projects/quantalithos-artifact`,仓内使用 `crates/<role>` 布局,当前最小实现单元为 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。唯一允许的编译期 sibling 依赖是 `core-contracts`,由 workspace root `Cargo.toml` 统一声明 path dependency。

---

## 8. 待确认事项

- 当前没有阻塞 Step 5 的待确认事项。
- Step 5 需要继续把 10 个主要组成部分映射到这 7 个实现单元,但不得把业务组成部分直接当成 crate 名。
- Step 17 / `07-实施计划.md` 需要把“目标实现仓当前未发现”写成开工前 gate。

---

## 9. 进入下一步条件

- 已确定实现仓目录、workspace 形态、member 目录和 package / crate / binary 命名规则。
- 已明确每个实现单元对应哪些代码主体。
- 已给出可直接创建的目录树与最小文件集合。
- 已明确 `core-contracts` 的真实 path dependency 位置和写法。
- 可以进入 Step 5 “定义模块实现契约主轴”。
