# Step 4. 收稳实现单元与文件布局

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 4
> 回填章节: `03-详细设计.md` §4 实现单元与文件布局
> 生成日期: 2026-06-12
> 状态: Step 4 已完成,已审核通过

---

## 1. Step 状态 + Step 内计划

本 Step 把新版 `02` 的代码主体骨架和 Step 3 的实现约束落到目标实现仓的 workspace、crate、binary、目录和文件路径。本文只定义文件布局和文件职责,不展开对象字段、trait 签名、DTO schema、状态矩阵、SQL DDL 或函数级 flow。

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取 Step 2 范围与 Step 3 实现约束 | 已完成 | §2 |
| 读取 `02` 代码主体框架和实现分层视图 | 已完成 | §2 |
| 读取目录与代码文件组织规范 | 已完成 | §2 |
| 检查当前 `quantalithos-identity` 实现仓目录 | 已完成 | §3 / §4 |
| 对比 `quantalithos-governance` workspace 形态 | 已完成 | §4 / §6 |
| 回答 Step 4 SOP 问题 | 已完成 | §3 |
| 诊断旧实现布局与新版范围差距 | 已完成 | §4 |
| 形成 workspace 与单 crate 取舍 | 已完成 | §6 |
| 输出实现单元总表、目录 / package / crate / binary 映射表、文件布局树、文件职责表、命名检查表和依赖表 | 已完成 | §7 |
| 形成正式 `03` §4 回填草稿 | 已完成 | §9 |
| 更新 `03_ddd_calibration_flow.md` 状态 | 已完成 | `03_ddd_calibration_flow.md` |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `03_ddd_step_02_scope.md` | 已审核通过 | 确认本轮 `03` 覆盖 P0 identity 实现契约全链路 |
| `03_ddd_step_03_constraints.md` | 已审核通过 | 提供 Rust 2024、英文源码、`core-contracts`、runtime / event 依赖裁剪和当前实现仓 reality |
| `02-概要设计.md` §4 | 已收稳 | 提供代码主体框架和实现分层视图 |
| `02-概要设计.md` §5~§9 | 已收稳 | 提供 8 个主要组成部分、对象索引、接口骨架、处理流和状态主语 |
| `standards/document/子项目目录与代码文件组织规范.md` | 已读取 | workspace、package、crate、binary、文件命名规则 |
| `/home/aris/Projects/quantalithos-identity` | 当前实现仓 | 现有单 crate 旧实现布局,仅作迁移诊断 |
| `/home/aris/Projects/quantalithos-governance` | 相邻成熟实现仓 | workspace 多 crate 参考形态,不反向决定 identity 业务契约 |

---

## 3. SOP 问题回答

### 3.1 本轮实现包含哪些 crate / package / binary / library?

本轮正式采用 Rust workspace 多 crate 形态。workspace members:

- `crates/contracts`
- `crates/domain`
- `crates/application`
- `crates/infra`
- `crates/api`
- `crates/worker`
- `crates/jobs`

主要 binary:

- `identity-api`: 同步 command / query API 入口。
- `identity-worker`: inbound event consumer / background worker 入口。
- `rebuild_identity_projection`
- `refresh_identity_references`
- `run_identity_reconciliation`
- `publish_identity_outbox`
- `deliver_trace_handoff`
- `retry_identity_propagation_failures`

选择 workspace 的原因是本轮 `03` 要同时覆盖 public contracts、domain、application ports、infra adapters、API handler、event worker 和 operations jobs。若继续使用当前旧单 crate,会让 contracts、domain、application、infra 和入口层在同一 dependency surface 中互相污染。

### 3.2 每个实现单元对应概要设计中的哪个代码主体?

- `contracts` 承接 Command / Query / Event / Job / View / Receipt / Error / Ref 的 public protocol surface。
- `domain` 承接 Member Identity Domain Model、Lifecycle State / Transition Guard、Summary / Career / Reference / History、Outbox / Handoff state。
- `application` 承接 Identity / Lifecycle / Role Capability / Career Memory / Consumption / Maintenance application service、port trait 和 transaction orchestration。
- `infra` 承接 repository、resolver、publisher、handoff、projection、report writer、runtime wiring 和 fake / controlled adapter。
- `api` 承接 Command Intake / Query Intake。
- `worker` 承接 Event Intake、callback consumer 和常驻后台承接。
- `jobs` 承接 Projection Rebuild、Reference Refresh、Reconciliation、Outbox Publish、Handoff Delivery 和 Retry operations job。

### 3.3 文件路径应该如何组织,才能体现模块边界?

文件路径按实现层分开,再在每个 crate 内按 identity 业务族拆文件:

- public schema 在 `crates/contracts/src/*.rs`。
- domain truth / policy / state 在 `crates/domain/src/*.rs`。
- application services 和 ports 在 `crates/application/src/*.rs`。
- durable / fake adapters 在 `crates/infra/src/*.rs`。
- API / worker / jobs 只做入口、dispatch 和 runtime wiring,不得承载业务规则。

业务族命名统一使用英文 snake_case,例如 `member_identity`, `lifecycle`, `role_capability`, `career`, `memory_reference`, `projection`, `trace_audit`, `outbox_handoff`。

### 3.4 哪些文件必须创建,哪些文件只是后续可能扩展?

P0 必须创建:

- workspace root `Cargo.toml`。
- 7 个 member 的 `Cargo.toml` 和 `src/lib.rs`。
- `api` 与 `worker` 的 `src/main.rs`。
- `jobs/src/bin/*.rs` 的 6 个 operations job binary。
- 支撑 Step 6~16 的核心 contracts / domain / application / infra 文件。

后续可能扩展:

- `crates/cli` 或 `crates/ops` 暂不进入 P0,因为当前 `02` 未定义用户 CLI 或人工 ops command。
- `crates/config` 和 `crates/observability` 暂不单独成 crate,配置与观测先作为 `infra` / `application` / `jobs` 的模块边界,Step 14 / Step 15 再判断是否需要独立。
- `crates/sdk` 不进入本仓;SDK 属于 `L0-sdk` 或上层消费封装。

### 3.5 每个文件负责定义哪些对象、trait、handler、repository 或测试?

Step 4 只定义文件职责,不定义完整对象字段或函数签名。文件职责表见 §7.4。

总原则:

- `contracts` 文件定义 DTO、typed ref、public marker、view、event payload、job input / output、receipt 和 public error。
- `domain` 文件定义 truth object、state enum、policy、guard、domain change、domain error。
- `application` 文件定义 service、port trait、command result assembly、idempotency / stored result boundary、transaction orchestration。
- `infra` 文件定义 repository implementation、fake runtime、resolver adapter、publisher / handoff adapter、projection store、report writer。
- `api` / `worker` / `jobs` 文件只做 runtime entry、handler dispatch 和 wiring。

### 3.6 当前仓的 project slug 是什么?

project slug 是 `identity`。

代码内部不得使用 `l1_identity`、`L1Identity`、`quantalithos_identity` 作为 module / crate / type 前缀。Cargo package 用 `identity-<role>`;Rust lib crate 用 `identity_<role>`。

### 3.7 workspace member 目录是否使用 `crates/<role>`?

是。正式布局使用:

```text
crates/contracts
crates/domain
crates/application
crates/infra
crates/api
crates/worker
crates/jobs
```

不得使用 `crates/identity_contracts`、`crates/l1_identity_domain` 或 `src/l1_identity/*`。

### 3.8 Cargo package 是否使用 `<project>-<role>`?

是:

- `identity-contracts`
- `identity-domain`
- `identity-application`
- `identity-infra`
- `identity-api`
- `identity-worker`
- `identity-jobs`

### 3.9 Rust library crate 是否使用 `<project>_<role>`?

是:

- `identity_contracts`
- `identity_domain`
- `identity_application`
- `identity_infra`
- `identity_api`
- `identity_worker`
- `identity_jobs`

### 3.10 binary 名是否表达用户入口或具体动作?

是。入口 binary 使用职责清楚的英文名:

- `identity-api` 表达同步 API 入口。
- `identity-worker` 表达常驻 event consumer / background worker。
- jobs binary 使用具体动作名,例如 `publish_identity_outbox` 和 `run_identity_reconciliation`。

### 3.11 是否有 `L0` / `L1` / `l0_` / `l1_` 等架构层级泄漏进代码命名?

正式布局禁止架构层级进入代码命名。`L1-identity` 只出现在设计仓路径和文档中。实现仓目录是 `/home/aris/Projects/quantalithos-identity`,代码内部使用 `identity`。

### 3.12 如果本仓存在已确认的编译期依赖,Cargo path dependency 应写在哪个 `Cargo.toml`,使用哪个真实 crate 路径?

`core-contracts` path dependency 写在 workspace root `[workspace.dependencies]`:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

需要引用 shared actor / metadata / error / envelope 的 member 使用:

```toml
core-contracts.workspace = true
```

禁止每个 member 重复写 path,避免路径漂移。`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 是否引用由后续 Step 的真实依赖决定,但只能从 workspace dependency 继承。

### 3.13 哪些运行期依赖或事件协作依赖只能在 adapter / event / projection 章节表达,不能进入文件布局的 Cargo 依赖?

以下不得进入 Cargo path dependency:

- `quantalithos-bus`
- `quantalithos-method-library`
- `quantalithos-work`
- `quantalithos-governance`
- memory / archive / observability / runtime / downstream consumers

它们只能在 Step 7 / 8 / 9 / 14 中以 resolver port、event envelope、publisher adapter、handoff adapter、projection consumer 或 config binding 表达。

---

## 4. 当前材料 / 旧文档问题诊断

| 材料 / 倾向 | 问题 | 本轮处理 |
|---|---|---|
| 当前 `quantalithos-identity` 是单 crate skeleton | 旧实现已有 `src/domain`、`src/application`、`src/inbound`、`src/persistence` 等,但混合 public contract、domain、application、infra 和 entry surface | 不直接继承;作为迁移参考 |
| 当前实现仓已有旧 migrations 和旧对象名 | 新版 `02/03` 尚未闭合 Step 6~11,不能让旧 DDL / 旧对象反向决定布局 | Step 4 不承接旧 migrations 作为新版 schema |
| `02` 覆盖 command/query/consumer/job/outbox/handoff 全链路 | 单 crate 可以快速落地,但 public contracts 和 infra 容易互相依赖 | 采用 workspace 多 crate |
| `quantalithos-governance` 已采用 workspace | 可作为相邻成熟形态参考,但不能复制 governance 业务对象或 commit boundary | 只参考 role 命名和 dependency shape |
| Step 3 已确认 `core-contracts` 是唯一编译期依赖候选 | 如果 path 写入 member `Cargo.toml`,容易重复和漂移 | 放入 root workspace dependencies |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 实现形态 | 当前 identity 实现仓为旧单 crate skeleton | 新版详细设计采用 workspace 多 crate |
| public contracts | 旧实现散落在单 crate module 中 | 独立 `crates/contracts` |
| domain / application / infra | 旧实现同 crate,依赖边界靠约定 | 独立 `domain`、`application`、`infra` crate |
| API / worker / jobs | 旧实现由 `src/main.rs` 和 module 承载 | 独立 `api`、`worker`、`jobs` member 和 binary |
| `core-contracts` dependency | 当前 identity 未声明 | root workspace dependency 统一声明 |
| 旧 migrations | 已存在旧 SQL migrations | 不作为新版 Step 4 布局来源;Step 11 再决定 schema |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 继续沿用当前单 crate module 分层 | 不采用 | 本轮 P0 范围包含 public contracts、domain、application ports、infra、api、worker、jobs,单 crate 会弱化依赖边界 |
| 采用 workspace 多 crate | 采用 | 对齐目录规范和相邻 governance 成熟形态,能让 contracts/domain/application/infra/entry 分层由 Cargo 依赖约束体现 |
| 增加 `cli` / `ops` crate | 不采用 | 当前 `02` 未定义用户 CLI 或人工 ops command,P0 不创建无来源入口 |
| 单独增加 `config` crate | 不采用 | 配置 shell 属于 Step 14,当前先放在 `infra` / entry wiring;若 Step 14 证明需要再回写 |
| 单独增加 `observability` crate | 不采用 | Step 15 才定义观测 / 审计埋点契约,当前不提前建 crate |
| 把 `L0-bus` 写成 workspace dependency | 不采用 | bus 是事件协作依赖,不是本仓编译期依赖 |

---

## 7. 结构化中间产物

### 7.1 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| `identity-contracts` | library crate | Public refs、DTO、event payload、job I/O、view、receipt、public error schema | §7 API / 接口骨架;§8 处理流;§10 异常 |
| `identity-domain` | library crate | Truth object、state、policy、guard、domain change、domain error | §5 主要组成部分;§6 对象索引;§9 状态 |
| `identity-application` | library crate | Application services、port traits、transaction orchestration、idempotency / stored result boundary | §4 实现分层;§8 处理流;§12 承接清单 |
| `identity-infra` | library crate | Repository / adapter implementation、fake runtime、resolver、publisher、handoff、projection、report writer | §4 实现分层;§11 配置影响;§12 承接清单 |
| `identity-api` | library + binary crate | Command / query API entry、handler dispatch、runtime bootstrap | §7 Command / Query;§8 command/query flow |
| `identity-worker` | library + binary crate | Inbound event consumer、callback consumer、background worker runtime | §7 Inbound Event Consumer;§8 consumer flow |
| `identity-jobs` | library + binary crate | Operations job runner and job binaries | §7 Operations Job;§8 job flow |

### 7.2 目录 / package / crate / binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | lib | `identity-contracts` | `identity_contracts` | Public protocol and shared identity contracts | 是 |
| `crates/domain` | lib | `identity-domain` | `identity_domain` | Domain model and policies | 仅 crate 内 / workspace 内 |
| `crates/application` | lib | `identity-application` | `identity_application` | Use cases, ports and orchestration | workspace 内 |
| `crates/infra` | lib | `identity-infra` | `identity_infra` | Adapter implementation and runtime wiring | workspace 内 |
| `crates/api` | lib + bin | `identity-api` | lib `identity_api`, bin `identity-api` | Synchronous command/query entry | 运行入口 |
| `crates/worker` | lib + bin | `identity-worker` | lib `identity_worker`, bin `identity-worker` | Event consumer / callback worker | 运行入口 |
| `crates/jobs` | lib + bins | `identity-jobs` | lib `identity_jobs`, job bins | Operations jobs | 运行入口 |

### 7.3 文件布局树

```text
quantalithos-identity/
  Cargo.toml                         # workspace members and shared dependencies
  README.md                          # project overview and local run notes
  crates/
    contracts/
      Cargo.toml                     # identity-contracts package
      src/
        lib.rs                       # public contracts module exports
        refs.rs                      # typed refs and public markers
        metadata.rs                  # identity protocol metadata wrappers
        commands.rs                  # command request/result DTOs
        queries.rs                   # query request/response DTOs
        events.rs                    # outbound event payloads and inbound event DTOs
        jobs.rs                      # operations job input/output/report DTOs
        views.rs                     # query views and redaction/degraded surfaces
        receipts.rs                  # command/job/handoff receipts
        errors.rs                    # public rejection/error DTOs
    domain/
      Cargo.toml                     # identity-domain package
      src/
        lib.rs                       # domain module exports
        member_identity.rs           # GlobalMember and anchor state/policy
        lifecycle.rs                 # lifecycle state and transition guards
        role_capability.rs           # role capability summary/source policy
        career.rs                    # append-only career record and policy
        memory_reference.rs          # memory reference state and policy
        trace_audit.rs               # identity trace and audit domain records
        projection.rs                # projection/reference/reconciliation domain state
        outbox_handoff.rs            # outbox and handoff state/policy
        changes.rs                   # accepted identity truth changes
        errors.rs                    # domain errors
    application/
      Cargo.toml                     # identity-application package
      src/
        lib.rs                       # application module exports
        ports.rs                     # repository/resolver/publisher/handoff/report ports
        services.rs                  # service composition facade
        command_service.rs           # command use cases
        query_service.rs             # query use cases and no-write boundary
        consumer_service.rs          # inbound event consumer use cases
        maintenance_service.rs       # projection/reference/reconciliation use cases
        propagation_service.rs       # outbox publish and handoff use cases
        results.rs                   # command/job stored result surfaces
        idempotency.rs               # idempotency and duplicate replay helpers
        errors.rs                    # application errors
    infra/
      Cargo.toml                     # identity-infra package
      src/
        lib.rs                       # infra module exports
        config.rs                    # validated runtime config shell and bindings
        unit_of_work.rs              # transaction boundary implementation
        repositories.rs              # durable repository adapters
        projection_store.rs          # projection lookup and stale marker store
        reference_store.rs           # external reference state store
        resolvers.rs                 # method/work/governance/memory resolver adapters
        publisher.rs                 # outbound event publisher adapter
        handoff.rs                   # trace/archive handoff adapter
        report_writer.rs             # reconciliation/report writer
        memory_runtime.rs            # fake/controlled runtime for tests
    api/
      Cargo.toml                     # identity-api package
      src/
        lib.rs                       # api module exports
        main.rs                      # identity-api binary entry
        router.rs                    # route registration
        handlers.rs                  # command/query handler dispatch
        request_context.rs           # actor/metadata extraction
    worker/
      Cargo.toml                     # identity-worker package
      src/
        lib.rs                       # worker module exports
        main.rs                      # identity-worker binary entry
        consumers.rs                 # inbound event consumer dispatch
        callbacks.rs                 # handoff/archive callback dispatch
    jobs/
      Cargo.toml                     # identity-jobs package
      src/
        lib.rs                       # job runner exports
        runner.rs                    # common job runner wiring
        bin/
          rebuild_identity_projection.rs
          refresh_identity_references.rs
          run_identity_reconciliation.rs
          publish_identity_outbox.rs
          deliver_trace_handoff.rs
          retry_identity_propagation_failures.rs
  tests/
    contract_roundtrip_tests.rs      # public DTO serialization compatibility
    domain_state_tests.rs            # domain state and guard tests
    service_flow_tests.rs            # application accepted/rejected flow tests
    query_no_write_tests.rs          # query no-write and degraded surface tests
    fake_runtime_tests.rs            # infra fake/controlled runtime equivalence tests
```

### 7.4 文件职责表

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `Cargo.toml` | workspace | members、workspace package、workspace dependencies | 固定 Rust 2024、`core-contracts` path dependency 和 shared deps |
| `crates/contracts/src/refs.rs` | contracts | typed refs、public markers | 防止字符串拼接 external ref / subject / source |
| `crates/contracts/src/commands.rs` | contracts | command request/result DTO | 支撑 6 个 Command public contract |
| `crates/contracts/src/queries.rs` | contracts | query request/response envelope | 支撑 14 个 Query public contract |
| `crates/contracts/src/events.rs` | contracts | inbound event DTO、outbound payload | 支撑 5 consumer 和 10 canonical outbound material |
| `crates/contracts/src/jobs.rs` | contracts | job input/output/report DTO | 支撑 6 operations job |
| `crates/contracts/src/views.rs` | contracts | read model view、degraded/redacted surface | 支撑 query no-write and visibility |
| `crates/domain/src/member_identity.rs` | domain | member identity domain object and anchor policy | 承接身份锚定与成员真相 |
| `crates/domain/src/lifecycle.rs` | domain | lifecycle state and guards | 承接全局生命周期 |
| `crates/domain/src/role_capability.rs` | domain | role capability summary/source policy | 承接角色能力摘要 |
| `crates/domain/src/career.rs` | domain | career record and append policy | 承接身份生涯记录 |
| `crates/domain/src/memory_reference.rs` | domain | memory reference state/policy | 承接记忆引用关系 |
| `crates/domain/src/trace_audit.rs` | domain | trace and audit domain records | 承接身份事实消费与追溯 |
| `crates/domain/src/projection.rs` | domain | projection/reference/reconciliation state | 承接派生维护与对账 |
| `crates/domain/src/outbox_handoff.rs` | domain | outbox and handoff state/policy | 承接事实传播与外部交接 |
| `crates/application/src/ports.rs` | application | repository/resolver/publisher/handoff/report traits | 定义倒置边界 |
| `crates/application/src/command_service.rs` | application | command use cases | 编排 accepted/rejected/duplicate command flow |
| `crates/application/src/query_service.rs` | application | query use cases | 守住 query no-write and visibility |
| `crates/application/src/consumer_service.rs` | application | inbound event use cases | 编排 external source event / callback intake |
| `crates/application/src/maintenance_service.rs` | application | projection/reference/reconciliation use cases | 编排 report-only maintenance |
| `crates/application/src/propagation_service.rs` | application | outbox/handoff use cases | 编排 publish、deliver、retry |
| `crates/infra/src/memory_runtime.rs` | infra | fake/controlled runtime | 支撑 service-flow and adapter equivalence tests |
| `crates/infra/src/repositories.rs` | infra | durable repository adapters | 实现 persistence save/read ports |
| `crates/infra/src/resolvers.rs` | infra | external source resolvers | 隔离 method/work/governance/memory runtime dependency |
| `crates/infra/src/publisher.rs` | infra | publisher adapter | 支撑 outbox publish |
| `crates/infra/src/handoff.rs` | infra | handoff adapter | 支撑 trace/archive handoff |
| `crates/api/src/handlers.rs` | api | command/query handlers | 只做 request mapping and service dispatch |
| `crates/worker/src/consumers.rs` | worker | event consumer dispatch | 只做 event mapping and service dispatch |
| `crates/jobs/src/runner.rs` | jobs | job runner shared wiring | 只做 run metadata、scope、cursor 和 service dispatch |

### 7.5 命名检查表

| 检查项 | 通过条件 | 结果 |
|---|---|---|
| project slug | 使用 `identity` | 通过 |
| workspace member | 使用 `crates/<role>` | 通过 |
| Cargo package | 使用 `identity-<role>` | 通过 |
| Rust lib crate | 使用 `identity_<role>` | 通过 |
| binary name | `identity-api`、`identity-worker` 或具体 job action | 通过 |
| 架构层级泄漏 | 不出现 `L1`、`l1_`、`L0`、`l0_` 代码命名 | 通过 |
| 仓内目录项目前缀 | 不使用 `crates/identity_contracts` 等重复前缀 | 通过 |
| running/event dependency | 不把 bus/method/work/governance 写成 Cargo dependency | 通过 |
| path dependency reality | `core-contracts` 使用真实路径 `../quantalithos-core/crates/contracts` | 通过 |

### 7.6 Cargo dependency 表

| 依赖仓库 | 全局依赖类型 | Cargo.toml 位置 | path dependency 写法 | 说明 |
|---|---|---|---|---|
| `L0-core` / `core-contracts` | 编译期依赖 | workspace root `Cargo.toml` 的 `[workspace.dependencies]` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | member 通过 `core-contracts.workspace = true` 引用 |
| `L0-bus` | 事件协作依赖 | 不进入 Cargo.toml | 不适用 | Step 7 / 8 通过 publisher / consumer port 表达 |
| `L3-method-library` | 运行期 / 事件协作 | 不进入 Cargo.toml | 不适用 | 通过 resolver / source event adapter 表达 |
| `L1-work` | 运行期 / 事件协作 | 不进入 Cargo.toml | 不适用 | 通过 work source resolver / event adapter 表达 |
| `L1-governance` | 运行期 / 事件协作 | 不进入 Cargo.toml | 不适用 | 通过 governance basis resolver 表达 |

### 7.7 Workspace 依赖方向草案

```text
identity-api
  -> identity-application
  -> identity-contracts
  -> identity-infra

identity-worker
  -> identity-application
  -> identity-contracts
  -> identity-infra

identity-jobs
  -> identity-application
  -> identity-contracts
  -> identity-infra

identity-infra
  -> identity-application
  -> identity-domain
  -> identity-contracts

identity-application
  -> identity-domain
  -> identity-contracts

identity-domain
  -> identity-contracts

identity-contracts
  -> core-contracts
```

关键说明:
- 图表达 crate dependency direction,不表达函数调用时序。
- `identity-domain` 不依赖 infra、api、worker、jobs。
- `identity-application` 定义 port,`identity-infra` 实现 port。
- `identity-contracts` 是 public protocol base,只依赖 `core-contracts` 和基础 serialization / error helper。

---

## 8. 复杂度判断 / 是否拆分

本 Step 文件已足够表达 workspace 和文件路径,不需要拆附录。

后续需要注意:

- Step 5 必须把 §7.3 的文件布局转成模块实现契约主轴,说明每个模块的职责、暴露面和依赖方向。
- Step 6 不能把 §7.4 的 domain 文件名当作对象字段结论;必须按模块 capability 小循环推导对象。
- Step 7 需要在 `application/src/ports.rs` 及 infra 文件之间闭合 port / adapter contract。
- Step 11 才能决定旧 migrations 是否删除、迁移或重建;Step 4 不继承旧 DDL。

当前不创建 Step 5~19 的未来文件。

---

## 9. 回填草稿

正式 `03-详细设计.md` §4 后续应回填:

### 4.1 实现仓形态

`L1-identity` 新版实现采用 Rust workspace 多 crate 形态。目标实现仓为 `/home/aris/Projects/quantalithos-identity`,project slug 为 `identity`。当前旧单 crate skeleton 只作为迁移诊断输入,不作为新版 `03` 的正式布局来源。

### 4.2 Workspace members

workspace members 为 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。Cargo package 分别为 `identity-contracts`、`identity-domain`、`identity-application`、`identity-infra`、`identity-api`、`identity-worker`、`identity-jobs`;Rust lib crate 分别为 `identity_contracts`、`identity_domain`、`identity_application`、`identity_infra`、`identity_api`、`identity_worker`、`identity_jobs`。

### 4.3 Binary

P0 binary 包括 `identity-api`、`identity-worker`、`rebuild_identity_projection`、`refresh_identity_references`、`run_identity_reconciliation`、`publish_identity_outbox`、`deliver_trace_handoff`、`retry_identity_propagation_failures`。

### 4.4 Dependency

workspace root 统一声明:

```toml
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

`L0-bus`、method-library、work、governance、memory / archive / observability / runtime 和 downstream consumers 不进入 Cargo path dependency。

正式正文要等 Step 19 统一装配,当前不直接回填。

---

## 10. 待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可从当前单 crate skeleton 迁移到 workspace 多 crate | 影响 implementation migration 和 `07` commit boundary | 当前 Step 4 采用 workspace,待用户审核 |
| 是否需要单独 `cli` / `ops` crate | 影响新增 entry unit | 当前 P0 不创建;若后续新增人工操作入口需回退 Step 4 |
| 是否需要单独 `config` / `observability` crate | 影响 Step 14 / 15 | 当前先作为 infra / entry module,若后续复杂度证明需要再回写 |
| 旧 migrations 如何处理 | 影响 Step 11 和 implementation plan | Step 4 不继承旧 DDL;后续 Step 11 决定 |

---

## 11. 进入 Step 5 的条件

进入 Step 5 前必须满足:

- 用户审核通过 workspace 多 crate 形态。
- 用户确认 `contracts/domain/application/infra/api/worker/jobs` 是 P0 实现单元。
- 用户确认当前旧单 crate skeleton 不作为新版正式布局来源。
- 用户确认 `core-contracts` path dependency 只在 workspace root 统一声明。
- 用户确认运行期 / 事件协作仓库不得进入 Cargo dependency。
