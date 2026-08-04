# L4-observability 03-详细设计 Step 04 · 实现单元与文件布局

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 04
> 回填章节: `03-详细设计.md` §4 实现单元与文件布局
> 当前模式: full-restart
> 当前门禁: Step 04 完成后停审,等待用户确认后才进入 Step 05

## 1. Step 状态

| 项 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 04 `收稳实现单元与文件布局` |
| 输出文件 | `design-calibration/03_ddd_step_04_file_layout.md` |
| flow 文件 | `design-calibration/03_ddd_calibration_flow.md` |
| Step 状态 | done |
| 正式回填状态 | blocked_until_step_19 |
| gate_status | pass |
| next_allowed_action | wait_user_confirmation_before_step_05 |

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 04 | 已读取 | 约束本步必须输出实现单元总表、目录 / package / crate / binary 映射表、文件布局树、文件职责表和命名检查表 |
| `standards/document/详细设计书写规范.md` 5.4 | 已读取 | 约束本步必须先做布局形态决策,并遵守 workspace / single crate 选择规则 |
| `standards/document/子项目目录与代码文件组织规范.md` | 已读取 | 提供实现仓路径、workspace member、package、crate、binary 和文件命名规则 |
| `design-calibration/03_ddd_step_02_scope.md` | 已完成 | 提供本轮 `03` 必须覆盖的模块、对象、接口、flow、状态、事务、错误、幂等、配置和测试切口范围 |
| `design-calibration/03_ddd_step_03_constraints.md` | 已完成 | 提供 Rust、源码英文、目标仓路径、唯一编译期依赖和 runtime / event 依赖隔离约束 |
| `projects/L4-observability/02-概要设计.md` §4 / §5 / §12 | 当前正式概要输入 | 提供代码主体框架、10 个主要组成部分和详细设计承接清单 |
| `02_hld_step_04_code_subject_framework.md` | 已读取 | 提供 Inbound / Operations / Application / Domain / Ports / Persistence / Projection / Outbox 主语 |
| `02_hld_step_05_components_boundary.md` | 已读取 | 提供 10 个业务主要组成部分、职责、非职责和对象发现线索 |
| `02_hld_step_12_detailed_design_handoff.md` | 已读取 | 提供 `03` 继续下沉的稳定输入、回退规则和不得新增主语纪律 |
| `projects/L1-governance/design-calibration/03_ddd_step_04_file_layout.md` | 已读取 | 作为 workspace 多 crate、目录树和职责表粒度参考,不复制 Governance truth |
| `projects/L1-artifact/design-calibration/03_ddd_step_04_file_layout.md` | 已读取 | 作为文件布局和命名检查粒度参考,不复制 Artifact truth |
| 旧 `03_ddd_step_04_file_layout.md` | historical material | 旧文件仍是 schema 主线摘要和自动顺推门禁;本步全量替换 |

## 3. SOP 问题回答

### 3.1 本轮实现包含哪些 crate / package / binary / library?

本轮选择 Rust workspace 多 crate 架构。最小实现单元为:

- `contracts`: public protocol DTO、view、event、job、receipt、error、typed ref carrier。
- `domain`: observation-owned fact、safe signal、audit projection、evidence linkage、handoff、retention、no-write、gap、policy、state、history / outbox formation。
- `application`: command / query / consumer / job service 编排、port trait、unit-of-work、idempotency 和 no-write guard 调用面。
- `infra`: repository、projection store、reference store、adapter、publisher、handoff / export target、config binding 和 runtime builder。
- `api`: 同步 command / query handler 和 API / RPC assembly。
- `worker`: inbound material consumer、outbox publisher、projection maintenance resident loop。
- `jobs`: 一次性 operations job runner,包括 rebuild、refresh、gap scan、rollup、replay、handoff 和 export preparation。

当前不单独创建 `cli`、`ops`、`config` 或 `observability` crate。配置结构归 `infra`,本仓自身 log / metric / trace / audit hook 由 `application` / `infra` 的明确文件承接。若后续出现人工交互式运维入口,应由 Step 17 / `07-实施计划.md` 或后续 ADR 增补 `cli` / `ops` 边界。

### 3.2 每个实现单元对应概要设计中的哪个代码主体?

实现单元按工程分层组织,不是按 10 个业务主要组成部分逐个拆 crate。10 个业务组成部分会跨 crate 分布:

- `contracts` 承接 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 的公开协议面。
- `domain` 承接 Domain Model、Domain Policy、state、history、marker、outbox formation。
- `application` 承接 Application Services、service orchestration、port trait、UoW、idempotency 和 transaction boundary。
- `infra` 承接 Persistence、Projection、Reference Snapshot、Outbox、Product-neutral Adapter、Config 和 Runtime Wiring。
- `api` 承接 `ObservationSyncEntry`。
- `worker` 承接 `ObservationAsyncMaterialConsumer` 与常驻 outbox / projection loop。
- `jobs` 承接 `ProjectionMaintenanceJob`、`ReferenceRefreshJob`、`GapScanJob`、`RollupRebuildJob` 和其他 operations job。

### 3.3 文件路径应该如何组织,才能体现模块边界?

目标实现仓路径固定为:

```text
/home/aris/Projects/quantalithos-observability
```

仓内使用:

```text
crates/<role>
```

每个 crate 内按职责命名文件,不得使用 `utils.rs`、`helpers.rs`、`common.rs`、`manager.rs` 这类模糊文件名。文件名应表达 observability 主语,例如 `observation_intake.rs`、`safe_signal.rs`、`audit_evidence.rs`、`report_handoff.rs`、`retention_replay.rs`、`gap_visibility.rs`、`reference_snapshot.rs`、`external_export.rs`。

### 3.4 哪些文件必须创建,哪些文件只是后续可能扩展?

本步固定最小必须文件集合:

- workspace root `Cargo.toml`。
- 7 个 member 的 `Cargo.toml`。
- 每个 member 的 `src/lib.rs`。
- contracts 中按协议族拆分的 DTO / view / error 文件。
- domain 中按对象族与策略拆分的职责文件。
- application 中按 service 族、ports、UoW、idempotency 拆分的职责文件。
- infra 中按 repository / projection / adapter / publisher / handoff / config 拆分的职责文件。
- api / worker / jobs 中承接入口、consumer、publisher、job runner 的最小文件。
- `tests/` 下的 contract、domain、service、integration、support 测试目录。

以下内容不在本步固定:

- durable backend migrations。
- CI / deployment / container files。
- production dashboard / alert 资源。
- scripts / reports / artifacts 目录。
- 可选 `cli` / `ops` crate。
- 具体产品 adapter 子目录深度。
- 完整函数签名、字段全集、DTO schema、DDL、配置 key 或测试 case 全集。

### 3.5 每个文件负责定义哪些对象、trait、handler、repository 或测试?

本步只固定文件承载责任,不提前写字段全集或函数签名:

- `contracts`: public request / response / event / job / view / receipt / error / ref carrier。
- `domain`: observation truth、audit projection、safe signal、handoff、retention、gap、policy、state、history / outbox formation。
- `application`: command / query / consumer / job service、port trait、UoW、idempotency、stored result 和 error。
- `infra`: fake / durable repository、projection store、reference snapshot store、publisher、handoff、external export、runtime builder 和 config。
- `api`: command / query handler、route / RPC assembly 和 error mapping。
- `worker`: inbound consumers、outbox publisher loop、projection maintenance loop 和 worker error。
- `jobs`: one-shot job runner 和 job error。
- `tests`: DTO roundtrip、state transition、service flow、no-write、forbidden body、consumer duplicate 和 fake infra integration 的最小落点。

对象字段留给 Step 06,trait 函数签名留给 Step 07,协议 schema 留给 Step 08,函数级 flow 留给 Step 09,测试用例全集留给 Step 16。

### 3.6 当前仓的 project slug 是什么?

project slug 固定为:

```text
observability
```

设计仓目录 `projects/L4-observability/` 中的 `L4` 只用于设计导航,不得进入实现仓 package、crate、module、file、type、function 或 binary 名称。

### 3.7 workspace member 目录是否使用 `crates/<role>`?

是。固定为:

- `crates/contracts`
- `crates/domain`
- `crates/application`
- `crates/infra`
- `crates/api`
- `crates/worker`
- `crates/jobs`

### 3.8 Cargo package 是否使用 `<project>-<role>`?

是。固定为:

- `observability-contracts`
- `observability-domain`
- `observability-application`
- `observability-infra`
- `observability-api`
- `observability-worker`
- `observability-jobs`

### 3.9 Rust library crate 是否使用 `<project>_<role>`?

是。固定为:

- `observability_contracts`
- `observability_domain`
- `observability_application`
- `observability_infra`
- `observability_api`
- `observability_worker`
- `observability_jobs`

### 3.10 binary 名是否表达用户入口或具体动作?

是。

- API 入口 binary: `observability-api`。
- 常驻 worker binary: `observability-worker`。
- jobs binary:
  - `publish_observation_outbox`
  - `rebuild_observation_read_models`
  - `rebuild_signal_rollups`
  - `refresh_reference_snapshots`
  - `scan_observation_gaps`
  - `coordinate_observation_replay`
  - `prepare_report_handoff_delivery`
  - `prepare_external_audit_export`
  - `rebuild_peripheral_views`

### 3.11 是否有 `L0` / `L1` / `L2` / `l0_` / `l1_` 等架构层级泄漏进代码命名?

不允许。所有 package、crate、module、file、type、function 和 binary 名称都不得包含:

- `L0` / `L1` / `L2` / `L3` / `L4`
- `l0_` / `l1_` / `l2_` / `l3_` / `l4_`
- `quantalithos_l4`
- `l4_observability`

### 3.12 如果本仓存在已确认的编译期依赖,Cargo path dependency 应写在哪个 `Cargo.toml`,使用哪个真实 crate 路径?

当前唯一允许的编译期依赖是 `core-contracts`。

写法固定在 workspace root `Cargo.toml`:

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

需要共享 id、safe ref、metadata、correlation、error、safety marker 的 member 再通过:

```toml
core-contracts.workspace = true
```

进行引用。是否每个 member 都实际引用 `core-contracts`,留给 Step 05 的 crate dependency matrix 和 Step 07 的 trait / protocol 细化。

### 3.13 哪些运行期依赖或事件协作依赖只能在 adapter / event / projection 章节表达,不能进入文件布局的 Cargo 依赖?

以下都不能进入 Cargo dependency:

- `L0-bus`
- `L1-governance`
- `L1-artifact`
- `L1-identity`
- `L2-runtime`
- `L4-sandbox`
- `L4-archive`
- `L0-sdk`
- `L5-console`
- OTel、Prometheus、Grafana、TimescaleDB、object store、search、alert sink、GRC / external audit 产品

它们只能在后续章节中以以下形式出现:

- port trait
- runtime adapter
- event publish / subscribe
- snapshot / safe summary resolver
- read projection / handoff target
- product-neutral adapter config
- fake adapter / integration seam

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `03_ddd_step_04_file_layout.md` | 只有薄 schema 摘要,没有布局形态决策、实现单元、目录树、文件职责和命名检查 | 全量替换为当前 Step 04 产物 |
| 旧正式 `03-详细设计.md` | 旧正文未能给出可创建的 workspace / crate / file layout,并夹带产品和性能旧口径 | 继续作为 historical material,正式 `03` 只在 Step 19 装配 |
| 当前正式 `02` §4 | 已给出代码主体框架,但明确不定义源码目录 | 本步把代码主体映射到 workspace member 和最小文件集合 |
| Step 03 | 已固定 `L0-core` 唯一编译期依赖和目标仓当前未发现 | 本步固定 root `Cargo.toml` path dependency 写法,并保留目标仓缺失为 Step 17 / `07` gate |
| 业务组成部分 | 10 个业务组成部分容易被误拆成 10 个 crate | 本步明确 crate 以工程分层拆分,业务组成部分在 Step 05 映射到模块和 service |
| 外部产品 | 旧材料容易把 TimescaleDB、Grafana、OTel 等产品写成本仓内部模块 | 本步只保留产品中立 adapter / config / fake 文件边界,不写成核心 crate |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 布局形态 | 未按当前标准决策 | 选择 workspace 多 crate 架构 | contracts、domain purity、多入口和 infra 边界需要 Cargo 强约束 |
| 实现仓路径 | 目标仓存在性未闭口 | 固定设计目标 `/home/aris/Projects/quantalithos-observability`,并记录当前未发现 | 对齐目录规范,不伪造实现仓 |
| member 目录 | 旧材料无稳定 member | 固定 `crates/contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` | 对齐组织规范和 L1 粒度 |
| package / crate 名 | 未固定 | `observability-<role>` / `observability_<role>` | 防止 `L4` 或项目全名前缀泄漏 |
| path dependency | 只知道 `core-contracts` 可用 | 固定 root `[workspace.dependencies]` 写法 | 防止 member 各自漂移 |
| 文件树 | 无法直接创建 | 给出最小可创建目录树和文件职责 | 支撑 Step 05~17 下沉 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 单 crate 模块分层架构 | 起步文件少,实现快 | contracts、api、worker、jobs、infra 和 domain 边界只能靠 review 约束;长期平台化和多入口隔离不足 | 不采用 |
| B. workspace 多 crate 架构 | contracts 可独立表达,domain 不依赖 infra/API,多入口清晰,Cargo 可强制依赖方向 | 初始 Cargo / crate 数量更多 | 采用 |
| C. 每个业务主要组成部分一个 crate | 业务名与目录直观 | 10 个组成部分跨 Domain / Application / Infra / Protocol 分层,容易形成循环依赖 | 不采用 |
| D. 单独创建 `config` / `observability` / `ops` 顶层 crate | 横切关注点看似更独立 | 当前没有独立复用需求,会过早抽象并放大边界 | 不采用 |
| E. 按外部产品创建 crate,例如 `otel`、`prometheus`、`grafana` | 产品适配直观 | 产品会反向塑造 truth 和核心目录,违反产品中立 | 不采用 |

## 7. 结构化中间产物

### 7.1 布局形态决策表

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层架构 | 否 | 本仓存在同步入口、异步 consumer、operations jobs、公共协议面和较重 infra adapter,仅靠 module 边界不足 | 不采用 |
| workspace 多 crate 架构 | 是 | contracts / domain / application / infra / api / worker / jobs 能清晰承接概要实现分层,Cargo 可强制 domain 纯净和多入口隔离 | 需要建立 workspace root、7 个 member 和后续 crate dependency matrix |
| 业务组成部分拆 crate | 否 | 10 个组成部分是业务轴,不是工程分层轴;每个组成部分都会跨 contracts / domain / application / infra | 不采用 |
| 产品 adapter 拆 crate | 否 | 外部产品只是产品中立候选,不是 truth source 或当前核心布局 | 不采用 |

### 7.2 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| `contracts` | library crate | Command / Query / Consumer / Event / Job / View / Receipt / Error DTO,typed ref carrier 和 public protocol surface | `02` §4 / §7 / §12 |
| `domain` | library crate | observation-owned fact、state、policy、marker、audit projection、body-free evidence linkage、history / outbox formation 和 domain error | `02` §5 / §6 / §9 / §12 |
| `application` | library crate | 10 组 application service、port trait、UoW、idempotency、stored result、query no-write 和 job orchestration | `02` §4 / §7 / §8 / §12 |
| `infra` | library crate | repository、projection store、reference snapshot、outbox、publisher、adapter、handoff / export target、config 和 runtime builder | `02` §4 / §10 / §11 / §12 |
| `api` | binary-oriented crate | 同步 command / query entry、handler、route / RPC assembly 和 error mapping | `02` §4 / §7 |
| `worker` | binary-oriented crate | inbound event / material consumer、outbox publisher loop、projection maintenance resident loop | `02` §4 / §7 / §8 |
| `jobs` | binary-oriented crate | publish、rebuild、refresh、gap scan、rollup、replay、report handoff、external export 等 one-shot operations jobs | `02` §4 / §7 / §8 / §12 |

### 7.3 目录 / Package / Crate / Binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `observability-contracts` | `observability_contracts` | public DTO、view、event、job、receipt、error、typed ref carrier | 对外协议暴露;不等于 sibling path dependency |
| `crates/domain` | library crate | `observability-domain` | `observability_domain` | observation truth、policy、state、marker、history / outbox formation | 否 |
| `crates/application` | library crate | `observability-application` | `observability_application` | service orchestration、ports、UoW、idempotency、no-write guard | 否 |
| `crates/infra` | library crate | `observability-infra` | `observability_infra` | repository / adapter / config / runtime builder | 否 |
| `crates/api` | binary-oriented crate | `observability-api` | `observability_api` / `observability-api` | sync command / query entry | 否 |
| `crates/worker` | binary-oriented crate | `observability-worker` | `observability_worker` / `observability-worker` | async material consumers and resident loops | 否 |
| `crates/jobs` | binary-oriented crate | `observability-jobs` | `observability_jobs` / action binaries | one-shot maintenance, handoff and export jobs | 否 |

### 7.4 文件布局树

```text
quantalithos-observability/
  Cargo.toml                                  # workspace root and shared dependencies
  crates/
    contracts/
      Cargo.toml
      src/
        lib.rs                                # public exports
        refs.rs                               # typed ids, refs, reasons, visibility markers
        metadata.rs                           # command, query, event, job metadata wrappers
        commands.rs                           # command request and result DTO
        queries.rs                            # query request and response DTO
        events.rs                             # inbound and outbound event payload DTO
        jobs.rs                               # operations job input, report and receipt DTO
        views.rs                              # read, diagnostic, handoff and export view DTO
        errors.rs                             # protocol-visible error DTO and codes
    domain/
      Cargo.toml
      src/
        lib.rs                                # domain exports
        observation_intake.rs                 # ObservationReceipt, SafetyDisposition, intake records
        safe_signal.rs                        # CorrelationContext, SafeSignal, SignalRollupWindow
        audit_evidence.rs                     # AuditProjection and EvidenceLinkage
        report_handoff.rs                     # ReportHandoffRecord, AuthenticityHint, readiness state
        retention_replay.rs                   # RetentionMarker, ActiveReferenceProtection, ReplayScope
        no_write.rs                           # NoWriteViolation and no-write domain guard objects
        read_diagnostic.rs                    # ReadVisibilityState, DiagnosticSummary, DiagnosticScope
        gap_degraded.rs                       # GapState and DegradedOutputState
        peripheral_export.rs                  # PeripheralDeliveryState and ExternalAuditExportPreparation
        reference_snapshot.rs                 # ReferenceSnapshotState and cross-domain safe references
        maintenance.rs                        # ProjectionMaintenanceState, ReplayCoordinationState, RollupRebuildState
        policies.rs                           # domain policies and invariant guards
        history.rs                            # intake, audit, read, delivery, refresh and execution records
        outbox.rs                             # outbox and handoff formation objects
        errors.rs                             # DomainError
    application/
      Cargo.toml
      src/
        lib.rs                                # application exports
        services.rs                           # service assembly facade
        intake_service.rs                     # observation intake and safety use cases
        signal_service.rs                     # correlation and safe signal use cases
        audit_evidence_service.rs             # audit projection and evidence linkage use cases
        report_handoff_service.rs             # report handoff and authenticity use cases
        retention_replay_service.rs           # retention, replay and no-write orchestration
        read_query_service.rs                 # read query use cases
        diagnostic_service.rs                 # diagnostic view use cases
        gap_visibility_service.rs             # gap and degraded expression use cases
        peripheral_service.rs                 # dashboard, alert and external export read orchestration
        maintenance_service.rs                # projection, reference, gap, rollup and replay job orchestration
        ports.rs                              # repository, resolver, publisher, handoff, export, clock and id traits
        unit_of_work.rs                       # UnitOfWork trait and transaction handle
        idempotency.rs                        # request digest, duplicate, conflict and stored result
        errors.rs                             # ApplicationError
    infra/
      Cargo.toml
      src/
        lib.rs                                # infra exports
        config.rs                             # runtime config structs and validation shell
        runtime_builder.rs                    # wiring of repositories, adapters and services
        observation_repositories.rs           # observation truth and violation repository adapters
        projection_stores.rs                  # signal, read, diagnostic, gap and peripheral stores
        audit_stores.rs                       # audit projection and history stores
        reference_stores.rs                   # reference snapshot and freshness stores
        outbox_store.rs                       # outbox and handoff repository adapters
        idempotency_store.rs                  # idempotency repository adapter
        source_resolvers.rs                   # identity, governance, artifact, runtime, sandbox and archive resolvers
        publishers.rs                         # event publisher and fake publisher adapters
        handoff_adapters.rs                   # report, archive and consumer handoff adapters
        external_export_adapters.rs           # dashboard, alert and external audit / GRC export adapters
        observability_hooks.rs                # this repo's own log, metric, trace and audit hooks
        clock_id.rs                           # clock and id generator adapters
        errors.rs                             # InfraError
    api/
      Cargo.toml
      src/
        lib.rs                                # api exports
        command_handlers.rs                   # command boundary
        query_handlers.rs                     # query boundary
        routes.rs                             # route or RPC assembly
        errors.rs                             # API error mapping
        main.rs                               # observability-api binary
    worker/
      Cargo.toml
      src/
        lib.rs                                # worker exports
        consumers.rs                          # inbound material and audit event consumers
        outbox_publisher.rs                   # outbox publication loop
        projection_worker.rs                  # resident projection maintenance loop
        errors.rs                             # WorkerError
        main.rs                               # observability-worker binary
    jobs/
      Cargo.toml
      src/
        lib.rs                                # jobs exports
        errors.rs                             # JobError
        bin/
          publish_observation_outbox.rs       # publish observation outbox once
          rebuild_observation_read_models.rs  # rebuild read and diagnostic projections
          rebuild_signal_rollups.rs           # rebuild safe signal rollups
          refresh_reference_snapshots.rs      # refresh external safe references
          scan_observation_gaps.rs            # scan and update gap status
          coordinate_observation_replay.rs    # coordinate observation-side replay
          prepare_report_handoff_delivery.rs  # prepare report handoff material
          prepare_external_audit_export.rs    # prepare external audit / GRC export
          rebuild_peripheral_views.rs         # rebuild dashboard / alert / export views
  tests/
    contract/
      command_contract_tests.rs               # command DTO contract tests
      query_contract_tests.rs                 # query DTO and view contract tests
      event_contract_tests.rs                 # inbound and outbound event contract tests
      job_contract_tests.rs                   # job input and receipt contract tests
    domain/
      state_transition_tests.rs               # state matrix tests
      policy_tests.rs                         # policy and guard tests
      forbidden_body_tests.rs                 # forbidden body and redaction negative tests
    service/
      command_flow_tests.rs                   # command service flow tests
      query_no_write_tests.rs                 # query no-write tests
      consumer_flow_tests.rs                  # consumer dedup and quarantine tests
      job_flow_tests.rs                       # operations job flow tests
    integration/
      observation_core_flow_tests.rs          # command + fake infra integration tests
      projection_handoff_tests.rs             # projection and handoff integration tests
      external_export_tests.rs                # product-neutral export adapter tests
    support/
      fixtures.rs                             # shared fixtures
      fakes.rs                                # shared fake adapters
```

### 7.5 文件职责表

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `Cargo.toml` | workspace root | workspace members、edition、shared deps | 固定 workspace 和 `core-contracts` 入口 |
| `crates/contracts/src/refs.rs` | contracts | ids、refs、reasons、visibility markers | 提供 public protocol 复用的 typed carrier |
| `crates/contracts/src/commands.rs` | contracts | command DTO | 定义同步写入口协议 |
| `crates/contracts/src/queries.rs` | contracts | query DTO | 定义只读入口协议和 page / filter surface |
| `crates/contracts/src/events.rs` | contracts | inbound / outbound event DTO | 定义事件协作协议 |
| `crates/contracts/src/jobs.rs` | contracts | operations job DTO | 定义 job input、report 和 receipt surface |
| `crates/contracts/src/views.rs` | contracts | read / diagnostic / handoff / export view DTO | 定义查询、诊断和交接读取面 |
| `crates/domain/src/observation_intake.rs` | domain | `ObservationReceipt`、`SafetyDisposition`、intake records | 承载准入与安全处置事实 |
| `crates/domain/src/safe_signal.rs` | domain | `CorrelationContext`、`SafeSignal`、rollup state | 承载安全信号和关联语境 |
| `crates/domain/src/audit_evidence.rs` | domain | `AuditProjection`、`EvidenceLinkage` | 承载只读审计投影和 body-free 证据线索 |
| `crates/domain/src/report_handoff.rs` | domain | report handoff and readiness objects | 承载交接、真实性提示和 non-signoff 语义 |
| `crates/domain/src/retention_replay.rs` | domain | retention, protection and replay objects | 承载留存、活动引用保护和 replay scope |
| `crates/domain/src/no_write.rs` | domain | `NoWriteViolation` and guard support objects | 承载 no-write 违例事实和 guard 主语 |
| `crates/domain/src/gap_degraded.rs` | domain | gap and degraded state | 承载 missing / blocked / not-visible / unsafe output 语义 |
| `crates/domain/src/reference_snapshot.rs` | domain | external safe ref and snapshot state | 承载外部引用和快照状态,不承载外部正文 |
| `crates/domain/src/policies.rs` | domain | domain policy and invariant guards | 承载 redaction-first、body-free、visibility、no-write 和 export guard |
| `crates/application/src/ports.rs` | application | repository / resolver / publisher / handoff / export traits | 定义 application 到 infra 和外部边界的依赖倒置面 |
| `crates/application/src/intake_service.rs` | application | intake service | 编排 observation material admission、redaction 和 result surface |
| `crates/application/src/audit_evidence_service.rs` | application | audit / evidence service | 编排审计投影追加和 evidence linkage |
| `crates/application/src/report_handoff_service.rs` | application | report handoff service | 编排 handoff readiness、evidence index input 和 outbox |
| `crates/application/src/retention_replay_service.rs` | application | retention / replay / no-write service | 编排留存保护、replay boundary 和 violation record |
| `crates/application/src/maintenance_service.rs` | application | maintenance orchestration | 编排 rebuild、refresh、gap scan、rollup 和 replay job |
| `crates/infra/src/observation_repositories.rs` | infra | observation truth repository adapters | 承接 observation-owned facts 和 violation persistence |
| `crates/infra/src/projection_stores.rs` | infra | projection stores | 承接 signal、read、diagnostic、gap 和 peripheral projection persistence |
| `crates/infra/src/source_resolvers.rs` | infra | external safe summary resolvers | 解析 identity / governance / artifact / runtime / sandbox / archive 安全摘要 |
| `crates/infra/src/handoff_adapters.rs` | infra | handoff adapters | 向 report consumer / archive / downstream consumer 准备交接 |
| `crates/infra/src/external_export_adapters.rs` | infra | dashboard / alert / external audit adapters | 承接产品中立只读导出 |
| `crates/api/src/command_handlers.rs` | api | command handlers | 接收同步 command 并调用 application |
| `crates/api/src/query_handlers.rs` | api | query handlers | 接收只读 query 并调用 application |
| `crates/worker/src/consumers.rs` | worker | inbound consumers | 接收 bus / source material 并调用 consumer service |
| `crates/worker/src/outbox_publisher.rs` | worker | outbox publish loop | 推进 outbox publication,不改变核心 truth |
| `crates/jobs/src/bin/scan_observation_gaps.rs` | jobs | gap scan runner | 执行 observation gap scan |
| `crates/jobs/src/bin/prepare_report_handoff_delivery.rs` | jobs | report handoff runner | 准备 report handoff material,不伪造真实 signoff |

### 7.6 命名检查表

| 检查项 | 通过条件 | 结果 |
|---|---|---|
| project slug | 使用 `observability` | pass |
| 实现仓目录 | 使用 `/home/aris/Projects/quantalithos-observability` | pass |
| workspace member 目录 | 使用 `crates/<role>` | pass |
| Cargo package | 使用 `observability-<role>` | pass |
| Rust crate | 使用 `observability_<role>` | pass |
| binary 名 | 表达用户入口或具体动作 | pass |
| 架构层级泄漏 | 无 `L0` / `L1` / `L2` / `L3` / `L4` / `l4_` 命名进入代码 | pass |
| 目录重复前缀 | 无 `crates/observability_domain` 之类重复命名 | pass |
| 外部仓文件边界 | 目录树只列本仓文件,不把 `quantalithos-core` 或其他 sibling repo 文件写入本仓 | pass |
| 产品中立 | 无 `crates/otel`、`crates/grafana`、`crates/timescaledb` 等产品 crate | pass |

### 7.7 编译期依赖表

| 依赖仓库 | 全局依赖类型 | Cargo.toml 位置 | path dependency 写法 | 说明 |
|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | workspace root `Cargo.toml` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | 当前唯一允许进入 Cargo 依赖的 sibling repo |

运行期依赖、事件协作依赖、handoff 依赖、下游消费和外部产品不得进入 Cargo dependency。它们在 Step 07 / Step 08 / Step 14 中通过 port、event、adapter、projection、handoff、export target 或 fake 策略定义。

## 8. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_04_file_layout.md`
>
> 延伸阅读:
> - 建议继续阅读本文件 §7 的结构化中间产物,了解实现单元、目录、crate、binary、文件职责和依赖写法如何从概要骨架收敛而来。

## 4. 实现单元与文件布局

本仓目标实现选择 Rust workspace 多 crate 架构。实现仓目录固定为 `/home/aris/Projects/quantalithos-observability`,仓内使用 `crates/<role>` 布局,当前最小实现单元为 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。

Cargo package 使用 `observability-<role>`,Rust library crate 使用 `observability_<role>`,binary 名使用 `observability-api`、`observability-worker` 或具体 job action 名。代码命名不得包含 `L4`、`l4_` 或其他架构层级。唯一允许的编译期 sibling 依赖是 `core-contracts`,由 workspace root `Cargo.toml` 统一声明:

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

`L0-bus`、`L1-governance`、`L1-artifact`、`L1-identity`、`L2-runtime`、`L4-sandbox`、`L4-archive`、SDK、Console 和外部观测 / 审计产品不得写成 Cargo dependency,只能通过 port、event、adapter、projection、handoff、export target 或 fake 策略协作。

## 9. 待确认事项

| 待确认项 | 当前处理 | 是否阻塞 Step 05 |
|---|---|---|
| 目标实现仓当前未发现 | 保留为 Step 17 / `07` 实施前置 gate;Step 04 仍可定义目标布局 | 否 |
| 目标仓 Rust edition / rust-version | 创建或核实目标 Cargo workspace 时落盘;本步不伪造 | 否 |
| 每个 member 是否实际引用 `core-contracts` | 留给 Step 05 crate dependency matrix 和 Step 07 port / protocol 细化 | 否 |
| 具体产品 adapter 子目录深度 | 留给 Step 14 和 `04-配置设计.md` | 否 |
| scripts / reports / artifacts 目录 | 当前不是 `03` Step 04 必需交付物;若 `05/06/07` 要求再补 | 否 |

## 10. 自检与进入下一步条件

| 检查项 | 结论 |
|---|---|
| 是否先完成布局形态决策 | pass |
| 是否输出实现单元总表 | pass |
| 是否输出目录 / package / crate / binary 映射表 | pass |
| 是否输出可直接创建的文件布局树 | pass |
| 是否输出文件职责表和命名检查表 | pass |
| 是否遵守 `子项目目录与代码文件组织规范.md` | pass |
| 是否避免把 10 个业务组成部分误拆成 10 个 crate | pass |
| 是否只把 `L0-core` 写成编译期 path dependency | pass |
| 是否把外部产品和 runtime / event 依赖排除出 Cargo dependency | pass |
| 是否保持正式 `03-详细设计.md` 到 Step 19 才装配 | pass |
| gate_status | pass |
| next_allowed_action | wait_user_confirmation_before_step_05 |
