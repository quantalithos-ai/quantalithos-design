# L2-tools 03 详细设计 Step 4: 收稳实现单元与文件布局

> 创建日期: 2026-08-05
> 状态: completed
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/03_ddd_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/03-详细设计.md`
> 回填章节: 正式 03 §4
> 当前写入许可: 只允许本 Step 中间产物与 flow / ledger；正式 03 仍禁止写入。

---

## 1. Step 开工与输入

| 项目 | 记录 |
|---|---|
| 前序门禁 | Step 3 `completed / pass`;`next_allowed_action=create_step_04_file_layout`。 |
| 目标实现仓 | 计划路径 `/home/aris/Projects/quantalithos-tools`；当前不存在。 |
| 正式输入 | 正式 02 §4、§5、§7、§8、§11、§12；正式 01 §8。 |
| 标准输入 | 详细设计 SOP Step 4；详细设计书写规范 §5.4；子项目目录与代码文件组织规范。 |
| 依赖输入 | Step 3 的真实 `core-contracts` candidate；非 Core runtime / event seam 裁剪。 |
| historical material | 旧单 crate `src/application/*_service.rs`、Provider / Policy / Executor / Cost / KMS / MCP 目录不继承。 |

## 2. SOP 问题回答

### 2.1 实现单元

采用 workspace 多 crate 架构，最小 member 集合为 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。六个业务组成部分跨七个工程 member 实现，不按业务组成部分拆 crate。

| 实现单元 | 类型 | 代码主体 | 是否必须 |
|---|---|---|---|
| `contracts` | library crate | Public Command / Query / Consumer / Event / Job / View / Receipt / Error carriers、typed refs、metadata | 是 |
| `domain` | library crate | 41 个 domain / fact / assessment / ref / view / projection 主语的规则、不变量和状态 | 是 |
| `application` | library crate | Service facade、owned Port / Repository / UoW / idempotency、use-case 编排 | 是 |
| `infra` | library crate | Backend-neutral stores、adapters、projection stores、config candidate、runtime builder、fakes | 是 |
| `api` | library + binary crate | 同步 Command / Query handler 与 transport-neutral entry assembly | 是 |
| `worker` | library + binary crate | Inbound Consumer、event collaboration continuation、projection maintenance | 是 |
| `jobs` | library + binary crate | 四个 Operations Job runner 与 report mapping | 是 |

不创建 `ports`、`config`、`observability`、`common`、`utils`、`cli` 或 `ops` member；Port 由 `application` 拥有，config / adapter 由 `infra` 承载，观测 / 审计交接由 application + infra 分层。若未来新增入口，必须先更新正式 03 / 07，不由实现者自行加 crate。

### 2.2 Project slug、仓名与命名

```text
project_slug = tools
implementation_repo = /home/aris/Projects/quantalithos-tools
```

设计仓中的 `L2-tools` 只用于架构导航。实现仓 package、crate、module、file、type、function、test 和 binary 不得包含 `L0`、`L1`、`L2`、`L3`、`l2_` 或 `quantalithos` 前缀。

### 2.3 Package、crate、binary 映射

| member directory | Cargo package | Rust library crate | binary | 对外暴露 |
|---|---|---|---|---|
| `crates/contracts` | `tools-contracts` | `tools_contracts` | none | 是，供本 workspace 与 future consumer 使用 |
| `crates/domain` | `tools-domain` | `tools_domain` | none | 否，仅 application 使用 |
| `crates/application` | `tools-application` | `tools_application` | none | 否，entry / jobs 使用 facade |
| `crates/infra` | `tools-infra` | `tools_infra` | none | 否，仅 composition / entry wiring 使用 |
| `crates/api` | `tools-api` | `tools_api` | `tools-api` | 否，运行入口 |
| `crates/worker` | `tools-worker` | `tools_worker` | `tools-worker` | 否，运行入口 |
| `crates/jobs` | `tools-jobs` | `tools_jobs` | `check_capability_binding_consistency`, `check_reference_integrity`, `rebuild_tool_derived_views`, `refresh_external_status_refs` | 否，一次性操作入口 |

Package 使用 `<project>-<role>`，crate 使用 `<project>_<role>`；binary 表达用户入口或具体 action，不使用架构层级名称。

### 2.4 文件组织原则

- `contracts` 按 public protocol family 和 shared carrier 拆文件。
- `domain` 按六业务组成部分及 shared policy 拆文件；不以 `service.rs`、`manager.rs` 或旧 provider 名命名。
- `application` 按 use-case / protocol family 拆 service 文件，所有 Port / Repository / UoW / idempotency 归 application。
- `infra` 按 store、resolver、publisher、handoff、config、builder、fake 拆文件；不让具体 backend 名进入核心文件名。
- `api`、`worker`、`jobs` 只承载入口转换、生命周期和 runner，不持有 domain truth 或直接写 repository。
- 测试按 contract、domain、service、integration、support 分目录；测试文件不得被当作 production contract。

### 2.5 必须创建与后续可扩展文件

必须创建：workspace root `Cargo.toml`、七个 member 的 `Cargo.toml` / `src/lib.rs`、下方树中列出的 production files、四个 job binary 文件和测试目录中的代表性 test files。下面的 `scripts/`、`artifacts/`、`reports/` 不在本轮创建，直到 05/06/07 明确其交付责任。

可后续扩展但不能在当前布局中假定存在：具体 HTTP / RPC framework、DB migrations、SQL / table、broker client、scheduler、search index、telemetry backend、secret platform、container / deployment、CLI、xtask、真实 external adapter。它们必须在相应下游文档或 ADR 中获得 authority。

## 3. 当前材料问题诊断

| 材料 | 问题 | 本步处理 |
|---|---|---|
| 旧正式 03 | 单 crate + fixed RPC / DB / cache / bus，且含 registry / executor / policy / cost。 | 完全 historical；不复用目录或文件名。 |
| 正式 02 §4 | 只有代码主体图，没有可创建路径。 | 以七 member 和文件职责表落地。 |
| Step 3 | 只有 compile candidate，没有 member dependency 位置。 | root `Cargo.toml` 提供唯一 path dependency；member matrix 留 Step 5。 |
| 目标仓缺失 | 无现有文件可以作为布局事实。 | 所有路径标记 planned；不声称已创建 / 编译。 |
| 业务组成部分数量 | 六个业务部分容易被误解为六个 crate。 | 明确业务部分跨七个工程 member。 |

## 4. 改动前后与取舍

| 主题 | 旧 / 未定状态 | 本步结论 |
|---|---|---|
| 布局形态 | 旧单 crate 或未指定 | workspace 多 crate |
| member | 旧文件夹混合业务与技术职责 | 七个固定 member |
| shared dependency | 语义上 Core-only | root `[workspace.dependencies]` 的真实 `core-contracts` candidate |
| external repo | 可能被误写成 path dependency | 只在 Port / adapter / event / projection 章节表达 |
| file granularity | 摘要级 | 每个必须创建文件有职责和 owner |

采用 workspace 多 crate，因为本仓有公共协议 carrier、多入口、domain purity 和 backend-neutral infra 约束。拒绝按六业务部分拆 crate，拒绝恢复旧目录，拒绝在目标仓不存在时伪造现有文件。

## 5. 结构化中间产物

### 5.1 Workspace 依赖方向

```text
core-contracts
      ^
      |
  contracts
      ^
    domain
      ^
  application  <---- infra (implements application ports)
      ^             ^
      |             |
   api / worker / jobs (entry wiring only)
```

允许方向：`contracts -> core-contracts`；`domain -> contracts`；`application -> domain + contracts`；`infra -> application + domain + contracts`；`api/worker/jobs -> application + infra + contracts`。禁止反向依赖、entry 互相依赖、domain 依赖 infra 或任何非 Core sibling。

### 5.2 计划目录树

```text
quantalithos-tools/
  Cargo.toml                                      # workspace members and shared dependency aliases
  crates/
    contracts/
      Cargo.toml
      src/
        lib.rs                                    # public exports and crate rustdoc
        refs.rs                                   # typed IDs, refs, authority markers
        metadata.rs                              # actor, command/query, event/job metadata
        commands.rs                              # 13 Command request/result carriers
        queries.rs                                # 11 Query request/response carriers
        consumers.rs                              # 5 inbound Consumer envelopes/receipts
        events.rs                                 # 4 outbound event candidates
        jobs.rs                                   # 4 Job inputs/reports
        views.rs                                  # query views, pages, freshness markers
        errors.rs                                 # protocol-safe error code and details
    domain/
      Cargo.toml
      src/
        lib.rs                                    # domain exports
        contract.rs                               # ToolContract and FormalToolDefinition
        binding.rs                                # CapabilityBinding and Hub snapshot
        invocation.rs                             # ToolInvocation and admission
        precondition.rs                           # requirement, authorization assessment
        handoff.rs                                # handoff, attempt, Sandbox readiness
        outcome.rs                                # source assessment, outcome, audit
        safe_handoff.rs                           # eligibility, material, submission attempt
        integrity.rs                              # refs, gaps, reports, projections
        shared.rs                                 # shared value objects and invariant helpers
        policies.rs                               # non-configurable policy guards
        errors.rs                                 # DomainError
    application/
      Cargo.toml
      src/
        lib.rs                                    # application exports
        contract_service.rs                       # four contract Commands and contract Queries
        binding_service.rs                        # three binding Commands and binding Query
        invocation_service.rs                     # SubmitToolInvocation and invocation Query
        precondition_service.rs                   # EvaluateExecutionPreconditions
        handoff_service.rs                        # PrepareExecutionHandoff
        outcome_service.rs                        # AcceptExecutionSource and outcome Query
        safe_handoff_service.rs                   # PrepareSafeExternalHandoff
        integrity_service.rs                      # gap resolution, integrity and derived Queries
        consumer_service.rs                       # five inbound Consumers
        job_service.rs                            # four Operations Jobs
        ports.rs                                  # owned repository / external / clock / ID ports
        unit_of_work.rs                           # transaction boundary and stored result
        idempotency.rs                            # key, digest, duplicate, conflict, replay
        errors.rs                                 # ApplicationError
    infra/
      Cargo.toml
      src/
        lib.rs                                    # infra exports
        config.rs                                 # typed config candidate and validator
        runtime_builder.rs                        # composition root and entry assembly
        repositories.rs                           # truth / history / attempt repositories
        projection_store.rs                       # ProjectionStore and derived material stores
        idempotency_store.rs                      # idempotency adapter
        reference_store.rs                        # ref / snapshot / gap store
        source_resolvers.rs                       # Hub/Auth/Sandbox/observation blocked adapters
        publishers.rs                             # SafeEventCollaborationPort adapter
        handoff_adapters.rs                       # safe material / audit handoff adapters
        clock_id.rs                               # clock and ID adapters
        fakes.rs                                  # deterministic fake implementations
        errors.rs                                 # InfraError
    api/
      Cargo.toml
      src/
        lib.rs                                    # api exports
        command_handlers.rs                       # Command DTO -> application calls
        query_handlers.rs                         # Query DTO -> application calls
        routes.rs                                 # transport-neutral route assembly seam
        errors.rs                                 # public error mapping
      bin/
        tools_api.rs                              # planned API process entry
    worker/
      Cargo.toml
      src/
        lib.rs                                    # worker exports
        consumers.rs                              # inbound Consumer dispatch
        collaboration_worker.rs                   # safe material continuation loop
        projection_worker.rs                      # derived projection maintenance loop
        errors.rs                                 # WorkerError
      bin/
        tools_worker.rs                           # planned worker process entry
    jobs/
      Cargo.toml
      src/
        lib.rs                                    # job exports
        runners.rs                                # job lifecycle / report mapping
        errors.rs                                 # JobError
      bin/
        check_capability_binding_consistency.rs
        check_reference_integrity.rs
        rebuild_tool_derived_views.rs
        refresh_external_status_refs.rs
  tests/
    contract/
      command_contract_tests.rs
      query_contract_tests.rs
      consumer_contract_tests.rs
      event_contract_tests.rs
      job_contract_tests.rs
    domain/
      object_invariant_tests.rs
      state_transition_tests.rs
      forbidden_body_tests.rs
    service/
      command_flow_tests.rs
      query_no_write_tests.rs
      consumer_flow_tests.rs
      job_flow_tests.rs
    integration/
      repository_uow_tests.rs
      blocked_port_tests.rs
      projection_rebuild_tests.rs
      safe_handoff_tests.rs
    support/
      fixtures.rs
      fakes.rs
```

### 5.3 文件职责表

| 文件 / 路径 | Owner | 定义内容 | 不能承担 |
|---|---|---|---|
| `crates/contracts/src/refs.rs` | contracts | Typed IDs / refs / authority and freshness markers | Domain transition or external body |
| `crates/contracts/src/metadata.rs` | contracts | Actor, command/query metadata, idempotency and trace carriers | Authorization decision or transport-specific headers |
| `crates/contracts/src/commands.rs` | contracts | 13 Command request/result secondary types | Store write or domain policy |
| `crates/contracts/src/queries.rs` | contracts | 11 Query request/response/view carriers | Refresh, repair or external orchestration |
| `crates/contracts/src/consumers.rs` | contracts | Envelope, dedup, source authority and receipt carriers | Direct subject mutation |
| `crates/contracts/src/events.rs` | contracts | Four safe event candidate carriers | Delivery, retry, DLQ or observation truth |
| `crates/contracts/src/jobs.rs` | contracts | Job input/report/watermark carriers | Real `run_id` or execution evidence |
| `crates/contracts/src/views.rs` | contracts | Stable read views, page, freshness, gap and unavailable surface | Domain truth or write side effect |
| `crates/contracts/src/errors.rs` | contracts | Protocol-safe codes and redacted details | Backend error leakage or raw payload |
| `crates/domain/src/contract.rs` .. `integrity.rs` | domain | Six business groups of 41 objects and guards | I/O, config, repository, transport |
| `crates/domain/src/shared.rs` | domain | Shared value objects / safe summaries used by domain groups | Unbounded common bucket |
| `crates/domain/src/policies.rs` | domain | Non-configurable safety and owner invariants | External policy truth |
| `crates/application/src/*_service.rs` | application | Use-case validation, domain invocation, UoW, stored result and side-effect order | Concrete backend, route or raw body |
| `crates/application/src/ports.rs` | application | Caller-owned repositories / external ports / resolver / clock / ID | Adapter implementation |
| `crates/application/src/unit_of_work.rs` | application | Local atomicity and commit outcome handling | Distributed transaction or external receipt |
| `crates/application/src/idempotency.rs` | application | Canonical digest and stored replay semantics | Generic cache fallback |
| `crates/infra/src/repositories.rs` | infra | Repository adapters | Owning domain state or alternative semantics |
| `crates/infra/src/projection_store.rs` | infra | Projection and report persistence | Core truth repair |
| `crates/infra/src/source_resolvers.rs` | infra | Blocked-aware external adapters and fakes | Positive provider readiness claim |
| `crates/infra/src/publishers.rs` | infra | Safe event collaboration adapter | Delivery / retry / DLQ truth |
| `crates/infra/src/runtime_builder.rs` | infra | Composition root and dependency injection | Business decision or default safety bypass |
| `crates/api/src/*` | api | DTO conversion, handler and route seam | Repository / domain direct access |
| `crates/worker/src/*` | worker | Consumer and continuation lifecycle | Direct truth writes or adapter ownership |
| `crates/jobs/src/*` | jobs | Four job runners and reports | Subject repair, acceptance evidence |
| `tests/**` | tests | Contract, state, flow and blocked seam tests | Production fixtures presented as evidence |

### 5.4 Compile dependency placement

Planned workspace root `Cargo.toml` is the only location for the known Core alias:

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

Member manifests use `core-contracts.workspace = true` only where Step 5 dependency matrix requires it. This is a design candidate, not a claim that the target repository or manifest currently exists. Hub, Sandbox, Runtime, Bus, Observability, SDK and external providers never appear in the path dependency table.

### 5.5 Naming check

| Check | Result |
|---|---|
| Planned repo path is `/home/aris/Projects/quantalithos-tools` | pass |
| Project slug is `tools` | pass |
| Member directories use `crates/<role>` | pass |
| Package names use `tools-<role>` | pass |
| Library crates use `tools_<role>` | pass |
| Binary names use `tools-api`, `tools-worker`, or concrete action | pass |
| No `L0` / `L1` / `L2` / `L3` or `quantalithos` leaks into code names | pass |
| No `common` / `utils` / `manager` top-level bucket | pass |
| No runtime / event sibling is represented as Cargo dependency | pass |
| No unconfirmed scripts / artifacts / reports are claimed as present | pass |

## 6. Historical material audit

The former `src/application/provider_service.rs`, `access_service.rs`, `accounting_service.rs`, fixed `api/handlers.rs`, PostgreSQL / Redis / NATS adapters and `types/provider.rs` are historical only. They are not renamed into the planned tree because their names encode out-of-scope registry, authorization, cost, secret or executor truth.

## 7. 回填草稿

正式 §4 应只保留布局形态决策、七 member 映射、planned directory tree、dependency direction、Core path candidate 和文件职责。Step 4 的诊断、历史污染和“当前仓不存在”证据应通过 calibration source link 阅读，不在正式章节宣称已有文件或构建状态。

## 8. 进入下一步条件

| 条件 | 结果 |
|---|---|
| 实现单元总表完整 | pass |
| package / crate / binary 映射完整 | pass |
| 目录树可直接交给实现者创建 | pass |
| 每个必须文件有唯一职责 | pass |
| Core path dependency 来自真实 sibling layout | pass |
| runtime / event seam 未进入 Cargo | pass |
| 目标仓不存在未被伪造为 existing | pass |
| 正式 03 未修改 | pass |

```text
step_status = completed
gate_status = pass
gate_reason = planned workspace, seven members, package/crate/binary mapping, directly creatable file tree and Core-only compile dependency placement are closed without claiming target-repository files or external readiness
next_allowed_action = create_step_05_module_contracts
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
