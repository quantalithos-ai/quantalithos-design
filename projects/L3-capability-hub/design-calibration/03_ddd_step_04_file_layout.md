# L3-capability-hub 03 详细设计 Step 4: 收稳实现单元与文件布局

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 4
> 回填章节: `projects/L3-capability-hub/03-详细设计.md` §4 实现单元与文件布局
> 创建日期: 2026-07-09
> 当前模式: full-restart
> 状态: completed_with_step_9_clarification
> Step 9 batch 9.9 澄清: 2026-07-15;移除 worker 文件职责中的旧 `application outbox` 措辞,固定 `event_publisher` 只把 exact durable capture ref 交给 application event-collaboration facade；不新增文件、模块、协议、trait 或 Port
> 本轮口径: 只把 Step 3 约束和新版 `02-概要设计.md` 的代码主体框架落到目标实现仓、workspace、crate / package、binary 和文件路径;不修改正式 `03-详细设计.md`,不写对象字段全集、trait 方法签名、DTO schema、数据库表、topic、配置 key、测试结果、run_id、evidence alias、验收签署、implementation ledger 或 planned boundary skeleton。

---

## 0. Step 开工确认

| 项目 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 4 `收稳实现单元与文件布局` |
| 用户确认 | 用户已回复“同意”,允许从 Step 3 进入 Step 4 |
| 正式文档写入 | 本 Step 不修改正式 `03-详细设计.md`;正式装配留到 Step 19 |
| 上游基线 | `03_ddd_step_01_upstream_boundary.md`;`03_ddd_step_02_scope.md`;`03_ddd_step_03_constraints.md`;新版 `02-概要设计.md` §4 / §5 / §12 |
| 参考粒度 | `projects/L1-governance/design-calibration/03_ddd_step_04_file_layout.md`;`projects/L1-artifact/design-calibration/03_ddd_step_04_file_layout.md`;`projects/L3-method-library/design-calibration/03_ddd_step_04_module_layout.md` |
| 旧材料处理 | 旧 `03-详细设计.md` 中 `registry_service.rs`、`provider_service.rs`、`access_service.rs`、`accounting_service.rs`、`ProviderContract`、`CapabilityDecision`、`CostRecord`、KMS / Vault、`QueryCapabilities` 目录树只作 historical material / pollution audit |

---

## 1. 本步输入

| 输入 | 当前状态 | 本 Step 用途 |
|---|---|---|
| `design-calibration/project_execution_ledger.md` | read | 确认项目级恢复点停在 `03` Step 3,用户确认后允许进入 Step 4。 |
| `design-calibration/03_ddd_calibration_flow.md` | read | 确认文档级 flow、Step 4 产物路径和正式 `03` 后置装配规则。 |
| `design-calibration/03_ddd_step_03_constraints.md` | completed | 提供 Rust、rustdoc、目标仓路径、`core-contracts` path dependency、非 core sibling 排除和安全边界约束。 |
| `projects/L3-capability-hub/02-概要设计.md` §4 / §5 / §7 / §11 / §12 | active formal baseline | 提供代码主体框架、8 个主要组成部分、接口族、配置影响和详细设计承接清单。 |
| `design-calibration/02_hld_step_04_code_subject_framework.md` | completed | 提供业务主要组成部分与实现分层分开的结论。 |
| `design-calibration/02_hld_step_12_detailed_design_handoff.md` | completed | 提供 `03` 继续展开 crate / module / service / port / adapter 的承接边界和回退规则。 |
| `standards/document/详细设计讨论流程_SOP.md` Step 4 | read | 要求输出实现单元总表、目录 / package / crate / binary 映射表、文件布局树、文件职责表和命名检查表。 |
| `standards/document/详细设计书写规范.md` §5.4 | read | 要求先做布局形态决策,并说明 sibling path dependency 落点。 |
| `standards/document/子项目目录与代码文件组织规范.md` | read | 提供实现仓、workspace member、Cargo package、Rust crate、binary 和文件命名规则。 |
| `projects/L1-governance` / `projects/L1-artifact` Step 4 | framework_reference | 参考表格深度、workspace 多 crate 判定、文件职责表和命名检查。 |
| `projects/L3-method-library` Step 4 | framework_reference | 参考 full-restart 下模块化写入和旧材料审计粒度;不复制 method-library 主语。 |

---

## 2. SOP 问题回答

### 2.1 本轮实现包含哪些 crate / package / binary / library?

本轮选择 Rust workspace 多 crate 架构,目标实现仓默认路径为:

```text
/home/aris/Projects/quantalithos-capability-hub
```

必须创建的最小实现单元为:

- `contracts`:公共 Command / Query / Consumer / Event / Job / View / Receipt / Error DTO,以及 typed ref、metadata wrapper、safe summary carrier。
- `domain`:capability access truth object、relation、state、policy、不变量、change record、domain error 和 event candidate formation object。
- `application`:Command / Query / Consumer / Job service 编排、port trait、repository trait、unit-of-work、idempotency、transaction boundary。
- `infra`:repository / projection store / reference resolver / safe summary adapter / publisher / handoff adapter / config / runtime builder / fake adapter。
- `api`:同步 Command / Query handler 和 route / RPC assembly。
- `worker`:Inbound Event Consumer、resident event-collaboration continuation / projection maintenance worker。
- `jobs`:operations job runner,包括 refresh、rebuild、reconciliation、reference resolution 和 event collaboration repair。

当前不单独创建 `cli`、`ops`、`config`、`observability` 或 `ports` crate:

- `config` 归 `infra`。
- port trait 归 `application`。
- observability / audit handoff 归 `infra` adapter 与 `application` handoff service。
- 人工运维或交互式 CLI 当前不是本轮 Step 4 的必要前提;若后续 `07` 需要,必须新增设计结论。

### 2.2 每个实现单元对应概要设计中的哪个代码主体?

实现单元按工程分层组织,不是按 8 个业务主要组成部分逐个拆 crate。8 个业务主要组成部分会横跨 contracts、domain、application、infra、api、worker、jobs:

- `contracts` 承接 Command API、Query API、Inbound Event Consumer、Outbound Event、Operations Job 和 External Port Skeleton 的 public protocol carrier。
- `domain` 承接 `CapabilityIdentity`、`CapabilityRegistryEntry`、`AdapterDescriptor`、`GovernanceSeamRelation`、`CapabilityMethodBodyFreeRelation`、`FormalExposureBoundary`、`ControlledConsumerView`、trace / impact、derived material 和 reference state 的 domain 主语。
- `application` 承接 capability access truth 的同步写路径、只读路径、body-free consumer 路径、operations job 路径和 event candidate 形成路径。
- `infra` 承接 persistence、projection / material、collaboration / external adapter、config validation 和 runtime builder。
- `api` 承接 Command / Query inbound entry。
- `worker` 承接 Inbound Event Consumer 和常驻异步协作 loop。
- `jobs` 承接 Operations Job 骨架。

### 2.3 文件路径应该如何组织,才能体现模块边界?

目标实现仓使用:

```text
quantalithos-capability-hub/
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
```

文件按职责命名,不使用 `utils.rs`、`helpers.rs`、`common.rs`、`manager.rs`、`provider_service.rs`、`access_service.rs`、`accounting_service.rs` 等模糊或旧主线文件名。业务组成部分不直接拆成 crate;它们在 Step 5 作为 module owner 和 service / object / port 归属继续展开。

### 2.4 哪些文件必须创建,哪些文件只是后续可能扩展?

本 Step 固定最小必须创建文件集合:

- workspace root `Cargo.toml`
- 7 个 workspace member 的 `Cargo.toml`
- 每个 member 的 `src/lib.rs`
- contracts / domain / application / infra / api / worker / jobs 的最小职责文件
- `tests/contract`、`tests/domain`、`tests/service`、`tests/integration`、`tests/support` 的测试目录和代表性测试文件

本 Step 不固定:

- migrations、DDL、具体 repository backend 子目录
- CI 文件、部署文件、容器文件
- `scripts/gates`、`scripts/reports`、`scripts/checks`
- 实际 HTTP / RPC framework 文件
- 真实 message bus / DB / search / secret / observability 产品 adapter 文件
- 可选 `cli` / `ops` / `xtask` crate

这些内容如成为交付物,必须由 Step 11 / Step 14 / Step 16 / Step 17 或后续 `04~07` 继续闭口。

### 2.5 每个文件负责定义哪些对象、trait、handler、repository 或测试?

本 Step 只固定文件承载责任,不提前写字段和函数签名:

- `contracts`:typed refs、metadata、Command / Query / Event / Job DTO、view DTO、receipt、protocol error。
- `domain`:identity、registry、descriptor、governance / method relation、exposure、trace / impact、derived material、reference resolution、policy、state、domain error、event candidate formation。
- `application`:command / query / consumer / job services、ports、unit-of-work、idempotency、transaction / stored result、application error。
- `infra`:repositories、projection stores、reference / safe summary adapters、publishers、handoff adapters、config、runtime builder、clock / id adapter、fake adapter。
- `api`:Command / Query handler、route / RPC assembly placeholder、API error mapping。
- `worker`:inbound event consumers、event-collaboration continuation loop、projection refresh worker、worker error。
- `jobs`:refresh、rebuild、reconciliation、reference resolution、event collaboration repair 和 handoff job runner。
- `tests`:contract roundtrip、domain state / policy、service flow、fake infra integration 和 boundary negative tests。

### 2.6 当前仓的 project slug 是什么?

project slug 固定为:

```text
capability-hub
```

设计仓目录 `projects/L3-capability-hub/` 中的 `L3` 只用于设计导航,不得进入实现仓 package、crate、module、file、type、function 或 binary 名称。

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

- `capability-hub-contracts`
- `capability-hub-domain`
- `capability-hub-application`
- `capability-hub-infra`
- `capability-hub-api`
- `capability-hub-worker`
- `capability-hub-jobs`

### 2.9 Rust library crate 是否使用 `<project>_<role>`?

是。固定为:

- `capability_hub_contracts`
- `capability_hub_domain`
- `capability_hub_application`
- `capability_hub_infra`
- `capability_hub_api`
- `capability_hub_worker`
- `capability_hub_jobs`

### 2.10 binary 名是否表达用户入口或具体动作?

是。

- API 入口 binary:
  `capability-hub-api`
- 常驻 worker binary:
  `capability-hub-worker`
- jobs binary:
  - `refresh_controlled_consumer_view`
  - `rebuild_capability_directory_projection`
  - `prepare_capability_audit_export`
  - `rebuild_ecosystem_discovery_summary`
  - `run_capability_reconciliation`
  - `refresh_capability_references`
  - `repair_capability_event_collaboration`

### 2.11 是否有 `L0` / `L1` / `L2` / `L3` / `l0_` / `l1_` 等架构层级泄漏进代码命名?

不允许。

所有 package、crate、module、file、type、function 和 binary 名称都不得包含:

- `L0` / `L1` / `L2` / `L3`
- `l0_` / `l1_` / `l2_` / `l3_`
- `quantalithos_l3`
- `capability_hub_l3`

### 2.12 如果本仓存在已确认的编译期依赖,Cargo path dependency 应写在哪个 `Cargo.toml`,使用哪个真实 crate 路径?

当前唯一允许的编译期 sibling 依赖是 `core-contracts`。写法固定在 workspace root `Cargo.toml`:

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

需要 shared ref、metadata、actor / trace context、error / result / event envelope 的 member 再通过:

```toml
core-contracts.workspace = true
```

进行引用。默认候选 member 是 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`;具体 member dependency matrix 留给 Step 5 收口。

### 2.13 哪些运行期依赖或事件协作依赖只能在 adapter / event / projection 章节表达,不能进入文件布局的 Cargo 依赖?

以下都不能进入 Cargo dependency:

- `L0-bus`
- `L1-governance`
- `L3-method-library`
- `L0-sdk`
- `L2-runtime`
- `L2-tools`
- marketplace / product / console
- observability / audit / archive
- external MCP / A2A / API provider
- secret / KMS / Vault platform

它们只能在后续章节中以 port trait、adapter、event publish / subscribe、snapshot / safe summary resolver、handoff target、controlled consumer view、external binding 或 fake seam 表达。

---

## 3. 当前文档问题诊断

| 位置 / 材料 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `03-详细设计.md` §3 目录树 | 旧目录按 `api/application/domain/infra/projection/types/config` 单 crate 风格展开,且包含 provider / access / accounting / secret_store / decision cache。 | 完全不继承旧目录树;本 Step 重新定义 workspace 多 crate 布局。 |
| 旧 `application/provider_service.rs` | 旧主线围绕 ProviderContract、quota、route、secret 托管。 | 禁入;descriptor / secret safe summary 归 domain + application + infra adapter 分层。 |
| 旧 `application/access_service.rs` | 旧主线围绕 `QueryCapabilities` 和 allow / deny decision。 | 禁入;formal exposure / controlled consumer view 分层,Query 不反写真相。 |
| 旧 `application/accounting_service.rs` | 旧主线承接 CostRecord / finance audit。 | 禁入;cost / billing ledger 不归本仓。 |
| 正式 `02-概要设计.md` §4 | 只给业务代码主体和实现分层,明确不是目录树。 | 本 Step 把分层转成 workspace member、crate 和文件职责。 |
| 正式 `02-概要设计.md` §5 | 8 个业务组成部分不是工程 crate 边界。 | 本 Step 不按业务组成部分拆 crate,只在文件职责中保留归属线索。 |
| Step 3 | 已确认 `core-contracts` 是唯一编译期 sibling 依赖,但尚未写入 Cargo 落点。 | 本 Step 固定 root `[workspace.dependencies]` 写法。 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-capability-hub` 当前未发现。 | 不阻塞 design;Step 17 / `07` 继续作为实施前置门禁。 |

---

## 4. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 布局形态 | Step 3 只固定 Rust 和仓库约束。 | 采用 workspace 多 crate 架构。 | 本仓有 public contracts、多运行入口、domain 纯净和 infra 隔离需求。 |
| 目录命名 | 旧 `03` 使用单 crate `src/` 目录树。 | 固定 `quantalithos-capability-hub/crates/<role>`。 | 对齐目录组织规范和参考项目粒度。 |
| package / crate 命名 | 未固定,旧文档混入旧业务主语。 | 固定 `capability-hub-<role>` / `capability_hub_<role>`。 | 避免 L 层和 `quantalithos` 前缀泄漏进代码内部命名。 |
| path dependency 位置 | 只知道依赖 `core-contracts`。 | 固定在 workspace root `[workspace.dependencies]`。 | 防止 member 依赖写法漂移。 |
| 业务组成部分 | 容易误拆为 8 个业务 crate。 | 业务组成部分在 Step 5 映射到模块 / service / object,不作为 crate 边界。 | 避免业务轴和工程分层混用。 |
| 外部依赖 | 多个 sibling repo 本地存在。 | 只有 `quantalithos-core` 可进入 Cargo path dependency。 | 保护依赖裁剪和 truth owner。 |

---

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 单 crate 模块分层架构 | 初始文件更少,搭建快。 | public contracts 难以单独复用;API / worker / jobs 多入口边界弱;domain 纯净只能靠 review。 | 不采用。 |
| B. workspace 多 crate 架构 | contracts 可独立复用;依赖方向可由 Cargo 强制;多入口清晰;适合长期平台化。 | 初始 workspace 和 member 数量更多。 | 采用。 |
| C. 每个业务主要组成部分一个 crate | 业务名与 crate 看似对齐。 | 业务组成部分跨 contracts / domain / application / infra / projection / jobs,会造成循环依赖和重复 adapter。 | 不采用。 |
| D. 单独创建 `config` / `observability` / `ports` crate | 横切职责看似独立。 | 当前没有独立复用价值,且 `ports` 不在目录规范 top-level role 中;会过早抽象。 | 不采用。 |
| E. 沿用旧 `src/application/provider_service.rs` 等目录 | 改动最小。 | 旧目录绑定 ProviderContract、decision、cost、KMS / Vault 和 QueryCapabilities 主线。 | 不采用。 |

---

## 6. 结构化中间产物

### 6.1 布局形态决策表

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层架构 | 否 | 本仓有公共 contracts、多运行入口、下游 consumer view / SDK exposure public surface 和强 domain / infra 隔离需求。 | 不采用。 |
| workspace 多 crate 架构 | 是 | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 可以分别承接 protocol、truth、service、adapter 和入口职责。 | 需要建立 workspace root、member Cargo、crate dependency matrix 和 tests 目录。 |
| 业务组成部分拆 crate | 否 | 8 个业务主要组成部分是业务职责轴,不是工程分层轴。 | Step 5 用模块总览表承接业务组成部分。 |
| 单独横切 crate | 否 | `config`、`observability`、`ports` 当前不需要独立 public crate。 | `config` 归 `infra`,ports 归 `application`,observability / audit handoff 归 application + infra。 |

### 6.2 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| `contracts` | library crate | Command / Query / Consumer / Event / Job / View / Receipt / Error DTO 与 public carrier。 | `02` §7 / §12 |
| `domain` | library crate | capability access truth object、relation、state、policy、不变量、change record、event candidate formation 和 domain error。 | `02` §4 / §5 / §6 / §9 |
| `application` | library crate | Command / Query / Consumer / Job service 编排、port trait、repository trait、UoW、idempotency、stored result 和 transaction boundary。 | `02` §7 / §8 / §10 / §12 |
| `infra` | library crate | repository、projection store、reference resolver、safe summary adapter、publisher、handoff adapter、config、runtime builder 和 fake adapter。 | `02` §4 / §7 / §11 / §12 |
| `api` | library crate + binary package | 同步 Command / Query handler 和 API / RPC server assembly。 | `02` §4 / §7 |
| `worker` | library crate + binary package | inbound event consumer、event-collaboration continuation loop、projection maintenance loop。 | `02` §4 / §7 / §8 |
| `jobs` | library crate + binary package | consumer view refresh、directory rebuild、audit export、ecosystem discovery rebuild、reconciliation、reference refresh、event collaboration repair。 | `02` §7 / §8 / §12 |

### 6.3 目录 / Package / Crate / Binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `capability-hub-contracts` | `capability_hub_contracts` | public DTO、view、event、job、receipt、error、typed ref、metadata wrapper。 | 是 |
| `crates/domain` | library crate | `capability-hub-domain` | `capability_hub_domain` | identity、registry、descriptor、seam、relation、exposure、trace / impact、derived material、reference state、policy、domain error。 | 否 |
| `crates/application` | library crate | `capability-hub-application` | `capability_hub_application` | application service、ports、UoW、idempotency、stored result、transaction orchestration。 | 否 |
| `crates/infra` | library crate | `capability-hub-infra` | `capability_hub_infra` | repositories、projection stores、reference resolvers、safe summary adapters、publishers、handoff adapters、config、runtime builder。 | 否 |
| `crates/api` | binary-oriented crate | `capability-hub-api` | `capability_hub_api` / `capability-hub-api` | Command / Query inbound handler 和 API server assembly。 | 否 |
| `crates/worker` | binary-oriented crate | `capability-hub-worker` | `capability_hub_worker` / `capability-hub-worker` | inbound consumer、event-collaboration continuation loop 和 projection maintenance worker。 | 否 |
| `crates/jobs` | binary-oriented crate | `capability-hub-jobs` | `capability_hub_jobs` / action binaries | operations job runner 和一次性维护任务。 | 否 |

### 6.4 文件布局树

```text
quantalithos-capability-hub/
  Cargo.toml                                # workspace root, members, shared dependencies
  crates/
    contracts/
      Cargo.toml
      src/
        lib.rs                              # public contracts exports
        refs.rs                             # typed ids, refs, reason, relation markers
        metadata.rs                         # command, query, event, job metadata wrappers
        commands.rs                         # Command request / result DTO
        queries.rs                          # Query request / response DTO
        events.rs                           # inbound and outbound event DTO
        jobs.rs                             # operations job input / receipt / report DTO
        views.rs                            # query and projection-visible view DTO
        errors.rs                           # protocol error DTO and error code
        fixtures.rs                         # contract fixtures for tests
    domain/
      Cargo.toml
      src/
        lib.rs                              # domain exports
        identity.rs                         # capability identity and access review domain objects
        registry.rs                         # registry entry, lifecycle and visibility domain objects
        descriptor.rs                       # adapter descriptor, risk and secret safe summary domain objects
        governance_method.rs                # governance seam and method body-free relation domain objects
        exposure.rs                         # formal exposure and controlled consumer view domain objects
        trace_impact.rs                     # traceability, change impact and downstream impact domain objects
        derived_material.rs                 # directory projection, audit export, discovery and reconciliation domain objects
        reference_resolution.rs             # external ref, consumer ref, audit ref and resolution state domain objects
        event_candidate.rs                  # committed access fact to event candidate formation
        policies.rs                         # domain policies and invariant guards
        errors.rs                           # DomainError
    application/
      Cargo.toml
      src/
        lib.rs                              # application exports
        services.rs                         # service assembly facade
        identity_service.rs                 # identity intake, correction, retirement and review fact use cases
        registry_service.rs                 # registry lifecycle and visibility use cases
        descriptor_service.rs               # descriptor, risk summary and secret safe summary use cases
        relation_service.rs                 # governance seam and method relation use cases
        exposure_service.rs                 # formal exposure and controlled consumer view use cases
        trace_impact_service.rs             # traceability, impact and handoff summary use cases
        derived_material_service.rs         # projection / export / discovery / report orchestration
        reference_service.rs                # reference resolution and consumer ref use cases
        query_service.rs                    # read-only query orchestration
        consumer_service.rs                 # inbound event consumer orchestration
        job_service.rs                      # operations job orchestration
        ports.rs                            # repository, resolver, publisher, handoff, clock, id traits
        unit_of_work.rs                     # UnitOfWork trait and transaction handle
        idempotency.rs                      # request digest, duplicate, conflict and stored result
        errors.rs                           # ApplicationError
    infra/
      Cargo.toml
      src/
        lib.rs                              # infra exports
        config.rs                           # config structs and validation surface
        runtime_builder.rs                  # assembly of repositories, adapters and services
        repositories.rs                     # truth and relation repository adapters
        projection_stores.rs                # consumer view, directory and report stores
        reference_stores.rs                 # external reference and safe summary stores
        idempotency_store.rs                # idempotency repository adapter
        read_visibility.rs                  # resolver-first visibility and owner-scope adapter
        source_resolvers.rs                 # external source, governance, method, secret, consumer and audit resolvers
        publishers.rs                       # event collaboration publisher adapter
        handoff_adapters.rs                 # observability / audit and downstream handoff adapters
        clock_id.rs                         # clock and id generator adapters
        fakes.rs                            # fake adapters shared by tests
        errors.rs                           # InfraError
    api/
      Cargo.toml
      src/
        lib.rs                              # api exports
        command_handlers.rs                 # Command handler boundary
        query_handlers.rs                   # Query handler boundary
        routes.rs                           # route / RPC assembly placeholder
        errors.rs                           # API error mapping
    worker/
      Cargo.toml
      src/
        lib.rs                              # worker exports
        consumers.rs                        # inbound event consumers
        event_publisher.rs                  # exact capture-ref collaboration continuation loop
        projection_worker.rs                # projection stale marker and maintenance loop
        errors.rs                           # WorkerError
    jobs/
      Cargo.toml
      src/
        lib.rs                              # jobs exports
        consumer_view_refresh.rs            # refresh controlled consumer view
        directory_projection_rebuild.rs     # rebuild search / browse projection
        audit_export_preparation.rs         # prepare audit-friendly export summary
        ecosystem_discovery_rebuild.rs      # rebuild read-only ecosystem discovery summary
        reconciliation.rs                   # run capability reconciliation
        reference_refresh.rs                # refresh external reference resolution
        event_collaboration_repair.rs       # repair event collaboration status
        errors.rs                           # JobError
  tests/
    contract/
      command_contract_tests.rs             # command DTO roundtrip and validation
      query_contract_tests.rs               # query DTO and view contract tests
      event_contract_tests.rs               # inbound / outbound event contract tests
      job_contract_tests.rs                 # job input / receipt contract tests
    domain/
      state_transition_tests.rs             # state matrix tests
      policy_tests.rs                       # policy and invariant tests
    service/
      command_flow_tests.rs                 # application command flow tests
      query_flow_tests.rs                   # query no-write tests
      consumer_flow_tests.rs                # consumer no direct core truth write tests
      job_flow_tests.rs                     # job no core truth repair tests
    integration/
      capability_core_flow_tests.rs         # command + fake infra integration tests
      projection_and_event_tests.rs         # projection and event candidate integration tests
      handoff_and_reference_tests.rs        # handoff and reference integration tests
    support/
      fixtures.rs                           # shared test fixtures
      fakes.rs                              # shared fake adapters
```

### 6.5 文件职责表

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `Cargo.toml` | workspace root | workspace members、edition、shared dependencies | 固定 workspace 和 `core-contracts` path dependency 入口。 |
| `crates/contracts/src/refs.rs` | contracts | typed ids、refs、reason、relation marker | 提供 public protocol 可复用的共享引用类型。 |
| `crates/contracts/src/metadata.rs` | contracts | Command / Query / Event / Job metadata carrier | 承接 actor、trace、idempotency、source event 和 operator metadata。 |
| `crates/contracts/src/commands.rs` | contracts | Command request / result DTO | 定义同步写入口协议 carrier。 |
| `crates/contracts/src/queries.rs` | contracts | Query request / response DTO | 定义只读入口协议 carrier。 |
| `crates/contracts/src/events.rs` | contracts | inbound / outbound event DTO | 定义事件消费和事件协作输出协议 carrier。 |
| `crates/contracts/src/jobs.rs` | contracts | job input / receipt / report DTO | 定义 operations job public surface。 |
| `crates/contracts/src/views.rs` | contracts | view / projection DTO | 定义 query、consumer view、directory projection 和 report view carrier。 |
| `crates/contracts/src/errors.rs` | contracts | protocol error DTO | 定义 public error code 和 mapping carrier。 |
| `crates/domain/src/identity.rs` | domain | identity、access review、identity change objects | 承载能力身份与接入语境 truth。 |
| `crates/domain/src/registry.rs` | domain | registry entry、lifecycle、visibility、change record | 承载注册目录与生命周期 truth。 |
| `crates/domain/src/descriptor.rs` | domain | adapter descriptor、risk summary、secret ref / safe summary | 承载接入描述与风险摘要 truth,阻断 ProviderContract 回流。 |
| `crates/domain/src/governance_method.rs` | domain | governance seam、method relation、body-free relation records | 承载治理与方法关系 relation truth。 |
| `crates/domain/src/exposure.rs` | domain | formal exposure、formal visibility、consumer view freshness | 承载正式暴露 truth 与受控消费 projection 边界。 |
| `crates/domain/src/trace_impact.rs` | domain | traceability、change impact、downstream impact summary | 承载追溯、变化与影响事实。 |
| `crates/domain/src/derived_material.rs` | domain | directory projection、audit export、discovery、reconciliation report state | 承载派生材料 domain state 和 no-truth-write guard。 |
| `crates/domain/src/reference_resolution.rs` | domain | external ref、consumer ref、audit ref、reference resolution state | 承载外部引用与安全摘要支撑的状态语义。 |
| `crates/domain/src/event_candidate.rs` | domain | event candidate formation object | 从 committed truth / change record 形成 event candidate,不负责投递。 |
| `crates/domain/src/policies.rs` | domain | domain policy and guard | 承载不可配置化 invariant 和 forbidden body guard。 |
| `crates/domain/src/errors.rs` | domain | `DomainError` | 定义领域错误分类。 |
| `crates/application/src/services.rs` | application | service assembly facade | 聚合 application service 构造入口。 |
| `crates/application/src/*_service.rs` | application | command / query / consumer / job service | 编排 validation、repository / port、domain transition、stored result 和 side effect。 |
| `crates/application/src/ports.rs` | application | repository、projection、resolver、publisher、handoff、clock、id traits | 定义 application 到 infra 的边界。 |
| `crates/application/src/unit_of_work.rs` | application | unit-of-work trait and transaction handle | 固定事务边界和 save order 承接点。 |
| `crates/application/src/idempotency.rs` | application | idempotency records、digest、stored result | 定义 duplicate replay、conflict 和 result ref 语义。 |
| `crates/application/src/errors.rs` | application | `ApplicationError` | 定义 service / orchestration error surface。 |
| `crates/infra/src/config.rs` | infra | config structs and validation surface | 承接 runtime builder / adapter / job / handoff 配置验证,不定义完整配置手册。 |
| `crates/infra/src/runtime_builder.rs` | infra | runtime builder | 组装 repository、port adapter、service、handler 和 runner。 |
| `crates/infra/src/repositories.rs` | infra | truth / relation repository adapters | 承接 identity、registry、descriptor、relation、exposure、trace truth store。 |
| `crates/infra/src/projection_stores.rs` | infra | projection and report stores | 承接 consumer view、directory、audit export、discovery、reconciliation material。 |
| `crates/infra/src/reference_stores.rs` | infra | reference and safe summary stores | 承接 external ref、safe summary、consumer ref、audit ref state。 |
| `crates/infra/src/read_visibility.rs` | infra | resolver-first read visibility adapter | 在任何 truth / projection / report body read 前解析 actor、owner、formal visibility、reference 或 material scope；不写入 truth、不创建 UoW。 |
| `crates/infra/src/source_resolvers.rs` | infra | external source / governance / method / secret / consumer / audit resolver adapters | 通过 adapter 解析 ref 和 safe summary,不迁入外部正文。 |
| `crates/infra/src/publishers.rs` | infra | event collaboration adapter | 实现 `CapabilityAccessEventCollaborationPort`,转发 stored candidate 并返回 external typed collaboration outcome；不保存 local delivery truth。 |
| `crates/infra/src/handoff_adapters.rs` | infra | observability / audit / downstream handoff adapters | 交接 safe summary / handoff marker,不保存 raw audit store。 |
| `crates/infra/src/fakes.rs` | infra | fake adapters | 支撑 contract / service / integration tests 的 fake parity。 |
| `crates/api/src/command_handlers.rs` | api | command handlers | 转换 contracts DTO 到 application Command service。 |
| `crates/api/src/query_handlers.rs` | api | query handlers | 转换 contracts DTO 到 application Query service,保持 no-write。 |
| `crates/api/src/routes.rs` | api | route / RPC assembly placeholder | 挂接 handler,不锁定具体 framework。 |
| `crates/worker/src/consumers.rs` | worker | inbound event consumers | 承接 governance / method / downstream / audit / external ref changed events。 |
| `crates/worker/src/event_publisher.rs` | worker | event collaboration continuation loop | 只把 exact durable capture ref 交给 application event-collaboration facade；不持有 capture repository、publisher adapter 或 application outbox。 |
| `crates/worker/src/projection_worker.rs` | worker | projection maintenance loop | 驱动 stale marker / projection maintenance,不修 core truth。 |
| `crates/jobs/src/*.rs` | jobs | operations job runner | 执行 refresh、rebuild、reconciliation、reference refresh 和 event collaboration repair。 |
| `tests/contract/*.rs` | tests | contract tests | 验证 DTO roundtrip、metadata、error 和 public carrier。 |
| `tests/domain/*.rs` | tests | domain tests | 验证 state matrix、policy guard 和 forbidden body。 |
| `tests/service/*.rs` | tests | service flow tests | 验证 command / query / consumer / job flow 红线。 |
| `tests/integration/*.rs` | tests | fake infra integration tests | 验证 repository、projection、event candidate、handoff 和 reference seams。 |
| `tests/support/*.rs` | tests | fixtures and fake adapters | 提供共享测试支撑,不作为 production code。 |

### 6.6 编译期依赖落点表

| 依赖仓库 | 全局依赖类型 | Cargo.toml 位置 | path dependency 写法 | 说明 |
|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | workspace root `Cargo.toml` 的 `[workspace.dependencies]` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | member crate 通过 `core-contracts.workspace = true` 引用,具体 member matrix 留给 Step 5。 |
| `quantalithos-bus` | 事件协作依赖 | 不进入 Cargo.toml | 不适用 | 后续只在 publisher port / adapter / fake 中表达。 |
| `quantalithos-governance` | 运行期 / 事件协作依赖 | 不进入 Cargo.toml | 不适用 | 后续只在 governance result ref port / adapter 中表达。 |
| `quantalithos-method-library` | 运行期 / 事件协作依赖 | 不进入 Cargo.toml | 不适用 | 后续只在 method asset ref port / adapter 中表达。 |
| `quantalithos-sdk` | 下游消费边界 | 不进入 Cargo.toml | 不适用 | 后续只表达 SDK exposure consumer ref,不实现 SDK client。 |
| runtime / tools / marketplace / observability / secret platform / external provider | 运行期 / downstream / external | 不进入 Cargo.toml | 不适用 | 只能通过 port、adapter、handoff、controlled view、safe summary 或 fake seam 表达。 |

### 6.7 命名检查表

| 检查项 | 通过条件 | 结果 |
|---|---|---|
| project slug | 使用 `capability-hub`。 | pass |
| 实现仓目录 | 使用 `/home/aris/Projects/quantalithos-capability-hub`。 | pass |
| workspace member | 使用 `crates/<role>`。 | pass |
| Cargo package | 使用 `capability-hub-<role>`。 | pass |
| Rust crate | 使用 `capability_hub_<role>`。 | pass |
| binary | 使用 `capability-hub-api`、`capability-hub-worker` 或具体 action name。 | pass |
| L 层泄漏 | package / crate / module / file / type / function / binary 不出现 `L3`、`l3_`。 | pass |
| `quantalithos` 泄漏 | `quantalithos` 只出现在实现仓目录,不进入 package / crate / module。 | pass |
| 仓内目录重复项目前缀 | member 目录不写 `crates/capability_hub_domain` 等重复项目前缀。 | pass |
| 模糊文件名 | 不使用 `utils.rs`、`helpers.rs`、`common.rs`、`manager.rs`。 | pass |
| 旧主线文件名 | 不使用 `provider_service.rs`、`access_service.rs`、`accounting_service.rs`、`secret_store`、`decision_cache`。 | pass |

### 6.8 历史材料差异审计

| 历史材料口径 | 当前裁决 | 原因 |
|---|---|---|
| 旧单 crate `src/application/registry_service.rs` | 不继承原路径和职责。 | registry 仍存在,但当前需在 workspace 中由 domain / application / infra 分层承接。 |
| 旧 `provider_service.rs` / `domain/contract` | 禁入旧命名,descriptor 相关改由 `descriptor.rs` 和 `descriptor_service.rs` 承接。 | 旧 ProviderContract 混入 provider runtime、quota、route、cost 和 secret 正文。 |
| 旧 `access_service.rs` / `domain/decision` | 禁入旧命名。 | 旧 CapabilityDecision / QueryCapabilities 混入 runtime allow / deny enforcement。 |
| 旧 `accounting_service.rs` / `domain/accounting` | 禁入。 | cost / billing ledger 不归本仓。 |
| 旧 `infra/secret_store` | 禁入。 | secret / KMS / Vault 平台和 secret value 不归本仓;只保留 secret ref / safe summary adapter。 |
| 旧 `projection/capability_decision_view` | 禁入旧语义。 | 当前使用 controlled consumer view / directory projection,不得形成 decision cache。 |
| 旧 KMS / Vault / provider lookup / policy refresh 文件 | 禁入当前文件布局。 | 当前只定义 ref、safe summary、adapter boundary 和 unavailable / forbidden surface。 |
| 旧 outbox relay / retry 产品目录 | 禁入当前布局。 | 只保留 immutable snapshot / capture、external collaboration adapter 和 repair job;physical binding后移,不得新增outbox/relay/attempt store。 |

---

## 7. 回填草稿

> 注意: 本节只是 Step 19 装配正式 `03-详细设计.md` 时的回填草稿,当前不直接修改正式文档。

```md
## 4. 实现单元与文件布局

> 校准来源:
> - `design-calibration/03_ddd_step_04_file_layout.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“文件布局树”“文件职责表”和“历史材料差异审计”小节,了解实现单元、目录、package、crate、binary 和文件职责如何从 Step 3 约束与概要设计代码主体框架收敛。

本仓目标实现采用 Rust workspace 多 crate 架构。目标实现仓默认位于 `/home/aris/Projects/quantalithos-capability-hub`,仓内使用 `crates/<role>`。本章只定义实现单元、路径和文件职责,对象字段、trait 方法、DTO schema、函数级 flow、状态矩阵和持久化契约由后续 Step 6~13 继续展开。

### 4.1 布局形态决策表

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层架构 | 否 | public contracts、多运行入口和 domain / infra 隔离需求较强。 | 不采用。 |
| workspace 多 crate 架构 | 是 | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 可分别承接 protocol、truth、service、adapter 和入口职责。 | 建立 workspace root 和 7 个 member。 |
| 业务组成部分拆 crate | 否 | 8 个业务主要组成部分是业务职责轴,不是工程分层轴。 | Step 5 用模块总览继续映射。 |

### 4.2 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| `contracts` | library crate | Command / Query / Consumer / Event / Job / View / Receipt / Error DTO 与 public carrier。 | `02` §7 / §12 |
| `domain` | library crate | capability access truth object、relation、state、policy、不变量、change record 和 domain error。 | `02` §4 / §5 / §6 / §9 |
| `application` | library crate | service 编排、port trait、repository trait、UoW、idempotency、stored result 和 transaction boundary。 | `02` §7 / §8 / §12 |
| `infra` | library crate | repository、projection store、resolver、safe summary adapter、publisher、handoff、config 和 runtime builder。 | `02` §4 / §7 / §11 / §12 |
| `api` | library crate + binary package | 同步 Command / Query handler 和 API / RPC server assembly。 | `02` §4 / §7 |
| `worker` | library crate + binary package | inbound event consumer、event-collaboration continuation loop、projection maintenance loop。 | `02` §4 / §7 / §8 |
| `jobs` | library crate + binary package | refresh、rebuild、reconciliation、reference resolution 和 event collaboration repair。 | `02` §7 / §8 / §12 |

### 4.3 目录 / Package / Crate / Binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `capability-hub-contracts` | `capability_hub_contracts` | public DTO、view、event、job、receipt、error、typed ref、metadata wrapper。 | 是 |
| `crates/domain` | library crate | `capability-hub-domain` | `capability_hub_domain` | identity、registry、descriptor、relation、exposure、trace / impact、derived material、reference state、policy。 | 否 |
| `crates/application` | library crate | `capability-hub-application` | `capability_hub_application` | services、ports、UoW、idempotency、transaction orchestration。 | 否 |
| `crates/infra` | library crate | `capability-hub-infra` | `capability_hub_infra` | repositories、projection stores、resolvers、adapters、config、runtime builder。 | 否 |
| `crates/api` | binary-oriented crate | `capability-hub-api` | `capability_hub_api` / `capability-hub-api` | Command / Query inbound handler 和 API server assembly。 | 否 |
| `crates/worker` | binary-oriented crate | `capability-hub-worker` | `capability_hub_worker` / `capability-hub-worker` | inbound consumer、event-collaboration continuation loop 和 projection maintenance worker。 | 否 |
| `crates/jobs` | binary-oriented crate | `capability-hub-jobs` | `capability_hub_jobs` / action binaries | operations job runner。 | 否 |

### 4.4 文件布局树

```text
quantalithos-capability-hub/
  Cargo.toml
  crates/
    contracts/
      Cargo.toml
      src/{lib.rs,refs.rs,metadata.rs,commands.rs,queries.rs,events.rs,jobs.rs,views.rs,errors.rs,fixtures.rs}
    domain/
      Cargo.toml
      src/{lib.rs,identity.rs,registry.rs,descriptor.rs,governance_method.rs,exposure.rs,trace_impact.rs,derived_material.rs,reference_resolution.rs,event_candidate.rs,policies.rs,errors.rs}
    application/
      Cargo.toml
      src/{lib.rs,services.rs,identity_service.rs,registry_service.rs,descriptor_service.rs,relation_service.rs,exposure_service.rs,trace_impact_service.rs,derived_material_service.rs,reference_service.rs,query_service.rs,consumer_service.rs,job_service.rs,ports.rs,unit_of_work.rs,idempotency.rs,errors.rs}
    infra/
      Cargo.toml
      src/{lib.rs,config.rs,runtime_builder.rs,repositories.rs,projection_stores.rs,reference_stores.rs,idempotency_store.rs,read_visibility.rs,source_resolvers.rs,publishers.rs,handoff_adapters.rs,clock_id.rs,fakes.rs,errors.rs}
    api/
      Cargo.toml
      src/{lib.rs,command_handlers.rs,query_handlers.rs,routes.rs,errors.rs}
    worker/
      Cargo.toml
      src/{lib.rs,consumers.rs,event_publisher.rs,projection_worker.rs,errors.rs}
    jobs/
      Cargo.toml
      src/{lib.rs,consumer_view_refresh.rs,directory_projection_rebuild.rs,audit_export_preparation.rs,ecosystem_discovery_rebuild.rs,reconciliation.rs,reference_refresh.rs,event_collaboration_repair.rs,errors.rs}
  tests/
    contract/
    domain/
    service/
    integration/
    support/
```

### 4.5 编译期依赖落点

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

运行期依赖、事件协作依赖、downstream consumer、external provider、secret 平台、observability / audit、marketplace 和 SDK 均不得进入 Cargo path dependency。它们只通过 port、adapter、event、handoff、controlled view、safe summary 或 fake seam 表达。
```

---

## 8. 待确认事项

| 事项 | 是否阻塞 Step 5 | 当前处理 |
|---|---|---|
| `/home/aris/Projects/quantalithos-capability-hub` 当前未发现。 | 不阻塞 Step 5。 | Step 4 只定义设计布局;Step 17 / `07` 必须作为实施前置检查。 |
| 目标仓 root `Cargo.toml` 尚不存在。 | 不阻塞 Step 5。 | 本 Step 给出计划写法;实施前按实际仓状态核对。 |
| API / RPC framework 未选型。 | 不阻塞 Step 5。 | `api/routes.rs` 只作为 assembly placeholder;具体 framework 后移 Step 14 / `04` / `07`。 |
| durable storage / message backend / search / secret / observability 产品未选型。 | 不阻塞 Step 5。 | 只定义 repository、projection、publisher、handoff、resolver 文件职责;产品 adapter 后续收口。 |
| tests 是否需要 scripts / reports / artifacts 目录。 | 不阻塞 Step 5。 | 当前不作为 Step 4 必须文件;若 Step 16 / `05~07` 要求,再按目录规范追加。 |

当前未发现阻塞 Step 5 的上游 blocker。

---

## 9. 进入下一步条件

| 条件 | 当前结果 |
|---|---|
| 已确认布局形态为 workspace 多 crate 架构。 | pass |
| 已明确目标实现仓路径、project slug、workspace member、Cargo package、Rust crate 和 binary 命名。 | pass |
| 已输出实现单元总表。 | pass |
| 已输出目录 / package / crate / binary 映射表。 | pass |
| 已输出可直接创建的文件布局树。 | pass |
| 已输出文件职责表。 | pass |
| 已输出 `core-contracts` 编译期依赖落点。 | pass |
| 已明确运行期 / 事件协作 / downstream / external 依赖不得进入 Cargo path dependency。 | pass |
| 已审计旧目录和旧主线不继承。 | pass |
| 已确认本 Step 不修改正式 `03-详细设计.md`。 | pass |

next_allowed_action: 等待用户确认后进入 Step 5 `定义模块实现契约主轴`;Step 5 必须先读取本文件、`03_ddd_step_03_constraints.md`、新版 `02-概要设计.md` §5 / §12、详细设计 SOP Step 5、详细设计书写规范 §5.5 和参考项目 Step 5;不得跳到对象字段、trait 方法、DTO schema、函数级 flow 或正式 `03` 装配。
