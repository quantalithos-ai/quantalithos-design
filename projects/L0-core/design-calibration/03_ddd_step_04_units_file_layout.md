# Step 4. 收稳实现单元与文件布局

> 本版本是 L0-core 详细设计校准的 Step 4 中间产物。
> 本步只把概要设计中的代码主体骨架落成目标实现仓的 workspace / crate / file tree。
> 本步不展开对象字段、trait 方法全集、协议 schema、DDL、事务细节或函数级处理流。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 4
- 回填章节: `projects/L0-core/03-详细设计.md` §4 实现单元与文件布局

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 2 本轮范围 | L0-core P0 主链完整实现契约,排除 P1 和相邻仓实现 | 限定文件布局只覆盖 P0 必建实现单元 |
| Step 3 实现约束 | Rust 契约、真实源码英文、port / adapter、gateway 安全边界、不锁死具体框架 | 决定目录树必须隔离 domain、contracts、application、infra、entrypoint 和 jobs |
| `02-概要设计.md` §4 | 外部接缝与输入收口、契约承接与发布编排、共享契约核心、领域契约包、本地索引 / 投影 / 引用、后台校验与事实输出、技术承载与外部适配 | 作为 crate 和文件职责映射来源 |
| `02-概要设计.md` §5 | 6 个业务主要组成部分 + 技术承载与外部适配支撑主体集合 | 作为文件职责表的业务归属依据 |
| `01-架构设计.md` §6 | L0-core 没有常驻在线运行时容器;正式承载结构包括契约变更入口、契约源码承载、校验与派生处理单元、发布快照承载、工具链执行环境 | 防止把 Step 4 写成在线 HTTP 服务布局 |
| `projects/L0-core/README.md` | 当前 README 仍偏 proto / buf 旧口径 | 作为现状诊断输入,但不作为本轮详细设计主线 |

已确认结论:

```text
目标实现仓逻辑根目录使用 quantalithos-core/ 表示。
实际代码可以在本机其他目录实现,但应保持本步定义的 workspace / crate / file tree 语义。
本轮采用 workspace 多 crate 架构。
本轮不把 online API server、数据库服务、L0-bus runtime 或 SDK 发布仓写进 L0-core 必建布局。
```

依赖的前序 Step:

```text
Step 1 已确认概要设计输入边界。
Step 2 已确认本轮 P0 实现范围和非范围。
Step 3 已确认编码、runtime、仓库、提交和安全边界约束。
```

---

## 3. SOP 问题回答

### 3.1 本轮实现包含哪些 crate / package / binary / library?

回答:

本轮建议采用 Rust workspace,包含 6 个 P0 实现单元:

| 实现单元 | 类型 | 是否 P0 必建 | 说明 |
|---|---|---|---|
| `core_contracts` | library crate | 是 | 对外共享的 Command / Query / Event / Job / View / Receipt / Error DTO 与公共上下文类型 |
| `core_domain` | library crate | 是 | 共享契约核心、领域契约包、发布基线、快照、引用、事实和领域策略 |
| `core_application` | library crate | 是 | 用例编排服务和 port trait,保护事务、审计、outbox、gate、reference 等接缝 |
| `core_infra` | library crate | 是 | 文件源、快照源、投影、outbox、toolchain 和外部 adapter 的 port 实现 |
| `core_cli` | binary crate | 是 | 契约变更入口、查询入口和运维触发入口;不是在线 API 服务 |
| `core_jobs` | binary crate | 是 | 校验、快照派生、索引重建、fingerprint 复算、事实发布和 outbox relay 执行入口 |

不在本步必建的实现单元:

| 实现单元 | 不纳入原因 | 后续处理 |
|---|---|---|
| `core_http_api` | 架构设计已明确 L0-core 没有常驻在线运行时容器 | 若未来要暴露在线 API,先回退架构 / 概要设计确认 |
| `core_sdk_exporter` | SDK 高层封装和分发属于 `L0-sdk` | 本仓只输出契约快照和事件事实 |
| `proto/` 作为唯一主布局 | 当前 v0.2.0 主线不再把 L0-core 简化为 proto / buf 仓 | 可作为具体契约源码格式候选,但不能替代本轮 workspace 主布局 |
| marketplace / plugin / registry 发布单元 | 属于 P1 或相邻仓能力 | 不进入 P0 文件树 |

### 3.2 每个实现单元对应概要设计中的哪个代码主体?

回答:

| 实现单元 | 对应概要设计代码主体 | 对应业务组成部分 |
|---|---|---|
| `core_contracts` | Command / Query / Outbound Event / Operations Job 骨架,外部接缝 DTO | 契约变更承接、引用追溯查询、后台校验与事实输出 |
| `core_domain` | `ContractDefinition`、`ContractScope`、`ContractVersion`、`ContractLifecycle`、`ContractReleaseBaseline`、`ContractReleaseSnapshot`、`ContractFactRecord`、六个 `ContractPackage`、domain policy | 契约真相与领域契约组织、兼容性门禁与发布基线、快照派生与下游消费、引用索引与追溯查询、后台事实输出 |
| `core_application` | `ContractChangeService`、`ContractReleaseService`、`ContractCompatibilityService`、`ContractSnapshotService`、`ContractTraceService`、`ContractFactService`、`ContractOperationsService`、port trait | 契约承接与发布编排、后台校验与事实输出、技术承载与外部适配 |
| `core_infra` | repository / gate / audit / outbox / reference resolver / blob ref / event publisher / clock / id generator adapter | 技术承载与外部适配支撑主体集合 |
| `core_cli` | `ContractCommandApi`、`ContractQueryApi`、`ContractOperationsTrigger`、`ExternalInputBoundaryGuard` 的入口适配 | 契约变更承接与输入收口、引用索引与追溯查询、后台触发 |
| `core_jobs` | `OutboxRelayWorker`、`ValidateContractChangeJob`、`DeriveReleaseSnapshotJob`、`RebuildContractIndexJob`、`RecalculateFingerprintJob`、`PublishContractFactJob` | 后台校验与事实输出 |

### 3.3 文件路径应该如何组织,才能体现模块边界?

回答:

按 “workspace 先强制依赖方向,crate 内再按实现职责分包” 组织。

```text
core_cli
  | call
  v
core_application
  | uses
  v
core_domain

core_application
  | defines ports
  v
core_infra
  | implements ports
  ^
  | called by
core_cli / core_jobs

core_contracts
  | shared DTO dependency
  v
core_cli / core_jobs / core_application / core_infra
```

关键说明:

- `core_domain` 不依赖 `core_infra`、`core_cli`、`core_jobs`、HTTP、DB、bus 或外部工具。
- `core_application` 定义 port trait,但不依赖具体 adapter。
- `core_infra` 实现 port,承接 source store、snapshot store、outbox、reference resolver、toolchain 和 event publisher。
- `core_cli` 是同步入口适配,不是常驻在线 API 服务。
- `core_jobs` 是构建期 / 运维期后台处理入口,不是 `L0-bus` runtime。

### 3.4 哪些文件必须创建,哪些文件只是后续可能扩展?

回答:

| 类别 | 必须创建 | 说明 |
|---|---|---|
| workspace 根 | `Cargo.toml`、`README.md` | 固定 workspace 和实现仓说明入口 |
| 契约源码承载 | `contract-source/README.md`、`contract-source/core/README.md`、`contract-source/packages/identity/README.md`、`contract-source/packages/conversation/README.md`、`contract-source/packages/work/README.md`、`contract-source/packages/process/README.md`、`contract-source/packages/governance/README.md`、`contract-source/packages/artifact/README.md` | 先固定来源目录,不在 Step 4 锁死具体源文件格式 |
| 发布快照承载 | `release-snapshots/README.md` | 先固定快照输出目录,快照格式在协议 / 持久化章节细化 |
| P0 crate | `crates/contracts` / `core_contracts`、`crates/domain` / `core_domain`、`crates/application` / `core_application`、`crates/infra` / `core_infra`、`crates/cli` / `core-cli`、`crates/jobs` / `core-jobs` | 支撑 P0 主链完整实现 |
| 最小集成测试入口 | `tests/contract_change_flow.rs`、`tests/release_snapshot_flow.rs`、`tests/trace_query_flow.rs`、`tests/operations_jobs.rs` | 只列详细设计可承接的最小测试切口 |

后续可能扩展但本轮不创建为 P0 必建文件:

| 扩展文件 / 目录 | 触发条件 |
|---|---|
| `proto/` | 若后续确认 proto 是某类契约源码或快照的正式承载格式 |
| `crates/http_api/` | 若后续确认 L0-core 需要常驻在线 API 服务 |
| `crates/sdk_exporter/` | 若后续确认某些导出逻辑不属于 L0-sdk |
| `crates/marketplace_adapter/` | 若后续 P1 引入 marketplace / package listing |

### 3.5 每个文件负责定义哪些对象、trait、handler、repository 或测试?

回答:

本步在 §7.4 文件职责表中只分配文件责任。对象字段和成员函数由 Step 6 展开;trait / port / adapter 方法由 Step 7 展开;Command / Query / Event / Job schema 由 Step 8 展开;逐接口处理流由 Step 9 展开;持久化和事务由 Step 11 展开。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` §3 | 基于 shared primitive / ID / Ref / DTO 的旧目录树 | 与新版契约来源主线不一致 |
| `projects/L0-core/README.md` | 仍偏 proto / buf 仓口径 | 若直接照搬,会把 L0-core 重新压回 proto-only 仓 |
| `02-概要设计.md` §4 | 是代码主体框架,不是目录树 | 需要转译为 crate / file tree,不能直接复制 |
| `02-概要设计.md` §5 | 6 个业务组成部分是业务主线,不是 crate 划分 | 需要用实现分层承载业务主线,避免每个业务组成部分一个 crate |
| 后续 Step 风险 | 如果 Step 4 不先固定文件布局,Step 5~8 会把对象、trait、API 堆在全局章节 | 不利于 1:1 实现 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 布局形态 | 旧文和 README 倾向 proto / primitive 文件集合 | 采用 Rust workspace 多 crate 架构,并保留契约源码 / 快照承载目录 | 同时支撑代码契约、公共 DTO、后台处理和契约来源资产 |
| crate 划分 | 未明确 | `contracts` / `domain` / `application` / `infra` / `cli` / `jobs` | 用编译依赖关系保护 domain 纯净和 public contract 复用 |
| API 入口 | 容易理解为常驻 HTTP API 服务 | `core_cli` 承载同步入口适配,不预设在线服务 | 对齐架构设计“无常驻在线运行时容器” |
| 后台处理 | 旧文没有稳定 job 承载位置 | `core_jobs` 承载校验、快照、索引、fingerprint、事实发布和 outbox relay | 对齐概要设计后台校验与事实输出 |
| 契约源码 | 旧 README 只给 proto 目录 | 先给 `contract-source/` 作为契约真相来源目录,不锁死格式 | 保持结构化契约源码主线,避免提前绑定单一工具 |
| P1 扩展 | 容易把 plugin、marketplace、SDK exporter 一起建出来 | 只列后续扩展,不进入 P0 必建树 | 对齐 Step 2 非范围 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 单 crate 模块分层架构 | 起步简单,文件少 | 公共契约、domain 纯净、infra adapter、cli 和 jobs 边界只能靠约定 | 不采用 |
| 方案 B: 每个业务主要组成部分一个 crate | 业务主线直观 | 6 条业务主线都要穿过 domain / application / infra / jobs,会导致跨 crate 循环和重复对象 | 不采用 |
| 方案 C: workspace 多 crate 架构,按实现职责拆 `contracts` / `domain` / `application` / `infra` / `cli` / `jobs` | 依赖方向清晰,公共契约可复用,适合多入口和长期平台化 | 初始结构略重,需要实施计划控制纵切顺序 | 采用 |
| 方案 D: 继续沿用 proto / buf 目录作为主布局 | 与旧 README 一致,工具链直观 | 无法承载发布基线、追溯、后台校验和应用服务契约;会回到旧口径 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 布局形态决策表

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层架构 | 否 | L0-core 有公共契约给其他仓复用,存在 CLI / job / relay 多入口,且必须强制 domain 不依赖 infra / bus / toolchain | 若采用会降低边界强度,后续 review 成本高 |
| workspace 多 crate 架构 | 是 | 符合公共契约复用、多入口、domain 纯净、infra 较重、长期平台化等条件 | 需要建立 6 个 crate,但依赖方向可由 Cargo 强制约束 |

### 7.2 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| `core_contracts` | library crate | 定义 Command / Query / Event / Job / View / Receipt / Error DTO、`ActorContext`、`CommandMetadata`、`QueryMetadata` 等公共协议对象 | §4 外部接缝;§7 API / 接口骨架;§11 详细设计承接 |
| `core_domain` | library crate | 定义共享契约核心、领域契约包、发布基线、快照、引用、追溯、事实记录和领域策略 | §4 共享契约核心;§5.4~§5.8;§6 关键对象;§9 状态 |
| `core_application` | library crate | 定义 application service、use case 编排、port trait 和应用错误边界 | §4 Application Services;§5.3~§5.9;§8 关键处理流 |
| `core_infra` | library crate | 实现 source store、snapshot store、projection、outbox、reference resolver、blob ref、gate decision、event publisher、clock、id generator 等 adapter | §4 Ports / Persistence / Projection / External Adapters;§5.9 |
| `core_cli` | binary crate | 承载 `ContractCommandApi`、`ContractQueryApi`、`ContractOperationsTrigger` 的同步入口适配和输出映射 | §4 Inbound / Operations;§5.3;§5.7;§5.8 |
| `core_jobs` | binary crate | 承载校验、快照派生、索引重建、fingerprint 复算、事实发布和 outbox relay 执行入口 | §5.8 后台校验与事实输出 |

### 7.3 文件布局树

```text
quantalithos-core/
  Cargo.toml                                      # workspace 根配置
  README.md                                      # 实现仓说明入口
  contract-source/                               # 结构化契约源码承载根目录
    README.md                                    # 契约源码目录说明
    core/
      README.md                                  # 共享契约核心源码说明
    packages/
      identity/
        README.md                                # identity 契约包源码说明
      conversation/
        README.md                                # conversation 契约包源码说明
      work/
        README.md                                # work 契约包源码说明
      process/
        README.md                                # process 契约包源码说明
      governance/
        README.md                                # governance 契约包源码说明
      artifact/
        README.md                                # artifact 契约包源码说明
    references/
      README.md                                  # 标准 / ADR / 评审 / 下游反馈引用说明
  release-snapshots/                             # 只读发布快照承载根目录
    README.md                                    # 发布快照目录说明
  crates/
    core_contracts/                           # 公共协议对象 crate
      Cargo.toml
      src/
        lib.rs                                   # 导出 contracts public API
        actor.rs                                 # ActorContext / ActorRef
        metadata.rs                              # CommandMetadata / QueryMetadata / RequestMetadata
        commands.rs                              # Command DTO
        queries.rs                               # Query DTO
        events.rs                                # Outbound Event DTO
        jobs.rs                                  # Operations Job input / output DTO
        views.rs                                 # Query view / snapshot view DTO
        receipts.rs                              # command / job receipt DTO
        errors.rs                                # API / protocol error DTO
    core_domain/                              # 领域模型与领域策略 crate
      Cargo.toml
      src/
        lib.rs                                   # 导出 domain public API
        error.rs                                 # Domain error
        definition/
          mod.rs                                 # ContractDefinition 模块入口
          aggregate.rs                           # ContractDefinition aggregate
          scope.rs                               # ContractScope
          version.rs                             # ContractVersion
          lifecycle.rs                           # ContractLifecycle
          evolution.rs                           # ContractEvolutionRecord
        packages/
          mod.rs                                 # ContractPackage 模块入口
          identity.rs                            # IdentityContractPackage
          conversation.rs                        # ConversationContractPackage
          work.rs                                # WorkContractPackage
          process.rs                             # ProcessContractPackage
          governance.rs                          # GovernanceContractPackage
          artifact.rs                            # ArtifactContractPackage
        release/
          mod.rs                                 # release domain 模块入口
          baseline.rs                            # ContractReleaseBaseline
          compatibility.rs                       # CompatibilityStatus
          policy.rs                              # ReleasePolicy
        snapshot/
          mod.rs                                 # snapshot domain 模块入口
          release_snapshot.rs                    # ContractReleaseSnapshot
          downstream_ref.rs                      # DownstreamConsumptionRef
        reference/
          mod.rs                                 # reference domain 模块入口
          external_reference.rs                  # ExternalReference
          standard_mapping.rs                    # StandardMappingIndex
          event_catalog.rs                       # EventCatalogReference
        projection/
          mod.rs                                 # projection domain 模块入口
          read_model.rs                          # ContractReadModel
          trace_projection.rs                    # ContractTraceProjection
          compatibility_trace.rs                 # CompatibilityTraceIndex
        fact/
          mod.rs                                 # fact domain 模块入口
          record.rs                              # ContractFactRecord
        policies/
          mod.rs                                 # domain policy 模块入口
          scope_policy.rs                        # ScopePolicy
          boundary_guard.rs                      # BoundaryGuard / DefinitionUseBoundaryGuard
          reference_validation.rs                # ReferenceValidationPolicy
          fingerprint.rs                         # FingerprintPolicy
    core_application/                         # 应用服务与 port crate
      Cargo.toml
      src/
        lib.rs                                   # 导出 application public API
        error.rs                                 # Application error
        services/
          mod.rs                                 # application service 模块入口
          change_service.rs                      # ContractChangeService
          release_service.rs                     # ContractReleaseService
          compatibility_service.rs               # ContractCompatibilityService
          snapshot_service.rs                    # ContractSnapshotService
          trace_service.rs                       # ContractTraceService
          fact_service.rs                        # ContractFactService
          operations_service.rs                  # ContractOperationsService
        ports/
          mod.rs                                 # port trait 模块入口
          unit_of_work.rs                        # UnitOfWork port
          definition_repository.rs               # ContractDefinitionRepository port
          baseline_repository.rs                 # ContractBaselineRepository port
          snapshot_repository.rs                 # SnapshotRepository port
          reference_repository.rs                # ReferenceRepository port
          audit_log.rs                           # AuditLogPort
          idempotency.rs                         # IdempotencyRepository port
          outbox.rs                              # OutboxPort
          gate_decision.rs                       # GateDecisionPort
          reference_resolver.rs                  # ReferenceResolverPort
          blob_ref.rs                            # BlobRefPort
          event_publisher.rs                     # EventPublisherPort
          clock.rs                               # ClockPort
          id_generator.rs                        # IdGeneratorPort
          source_store.rs                        # ContractSourceStorePort
          snapshot_store.rs                      # ReleaseSnapshotStorePort
          projection_store.rs                    # ProjectionStorePort
          validation_runner.rs                   # ContractValidationRunnerPort
          fingerprint_runner.rs                  # FingerprintRunnerPort
          snapshot_exporter.rs                   # SnapshotExporterPort
    core_infra/                               # 基础设施适配 crate
      Cargo.toml
      src/
        lib.rs                                   # 导出 infra adapter
        error.rs                                 # Infra error
        source_store/
          mod.rs                                 # 契约源码 store adapter 入口
          filesystem.rs                          # filesystem contract source adapter
        snapshot_store/
          mod.rs                                 # 发布快照 store adapter 入口
          filesystem.rs                          # filesystem release snapshot adapter
        projection_store/
          mod.rs                                 # read / trace projection adapter 入口
          file_index.rs                          # file based projection index adapter
        audit_store/
          mod.rs                                 # audit store adapter 入口
          file_audit.rs                          # file based audit adapter
        idempotency_store/
          mod.rs                                 # 幂等 store adapter 入口
          file_idempotency.rs                    # file based idempotency adapter
        outbox_store/
          mod.rs                                 # outbox store adapter 入口
          file_outbox.rs                         # file based outbox adapter
        adapters/
          mod.rs                                 # 外部 adapter 入口
          unit_of_work.rs                        # transaction / file lock unit of work adapter
          gate_decision.rs                       # gate decision ref adapter
          reference_resolver.rs                  # external reference resolver adapter
          blob_ref.rs                            # blob ref validator adapter
          event_publisher.rs                     # L0-bus boundary publisher adapter
          clock.rs                               # system clock adapter
          id_generator.rs                        # id generator adapter
        toolchain/
          mod.rs                                 # 校验 / 派生工具链入口
          validator.rs                           # contract validation runner
          fingerprint.rs                         # canonical fingerprint runner
          snapshot_exporter.rs                   # snapshot export runner
    core_cli/                                 # 同步入口适配 crate
      Cargo.toml
      src/
        main.rs                                  # CLI process bootstrap
        lib.rs                                   # CLI library entry
        commands/
          mod.rs                                 # CLI command 模块入口
          command_api.rs                         # ContractCommandApi adapter
          query_api.rs                           # ContractQueryApi adapter
          operations_trigger.rs                  # ContractOperationsTrigger adapter
        context.rs                               # gateway / actor / metadata context loading
        output.rs                                # command / query / job output rendering
        error_mapping.rs                         # application error to CLI status mapping
    core_jobs/                                # 后台处理入口 crate
      Cargo.toml
      src/
        lib.rs                                   # job shared wiring
        bin/
          validate_contract_change.rs            # ValidateContractChangeJob binary
          derive_release_snapshot.rs             # DeriveReleaseSnapshotJob binary
          rebuild_contract_index.rs              # RebuildContractIndexJob binary
          recalculate_fingerprint.rs             # RecalculateFingerprintJob binary
          publish_contract_fact.rs               # PublishContractFactJob binary
          outbox_relay.rs                        # OutboxRelayWorker binary
        jobs/
          mod.rs                                 # operations job 模块入口
          validate_contract_change.rs            # ValidateContractChangeJob implementation
          derive_release_snapshot.rs             # DeriveReleaseSnapshotJob implementation
          rebuild_contract_index.rs              # RebuildContractIndexJob implementation
          recalculate_fingerprint.rs             # RecalculateFingerprintJob implementation
          publish_contract_fact.rs               # PublishContractFactJob implementation
        outbox_relay/
          mod.rs                                 # outbox relay 模块入口
          worker.rs                              # relay loop
          checkpoint.rs                          # relay checkpoint / cursor
  tests/
    contract_change_flow.rs                      # command path integration test entry
    release_snapshot_flow.rs                     # publish / snapshot integration test entry
    trace_query_flow.rs                          # query / trace integration test entry
    operations_jobs.rs                           # operations job integration test entry
```

关键说明:

- 该目录树是目标实现仓布局,不表示当前 design 仓已有这些文件。
- `contract-source/` 和 `release-snapshots/` 固定承载目录,但不在 Step 4 决定具体源文件格式。
- `core_cli` 表达同步入口适配,不是在线 HTTP / RPC 服务。
- `core_jobs` 表达构建期 / 运维期后台处理,不是业务 runtime worker。
- `core_infra` 中的 event publisher 只负责把事实交给 `L0-bus` 边界,不实现 bus 投递运行时。

### 7.4 文件职责表

下表只列对实现边界有设计意义的文件;`Cargo.toml`、`lib.rs`、`mod.rs` 等导出 / 聚合文件已在目录树中标注职责。

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `Cargo.toml` | workspace | workspace members / dependency policy | 固定 workspace 多 crate 架构 |
| `contract-source/README.md` | contract source | 契约源码目录说明 | 说明结构化契约源码是本仓真相来源 |
| `contract-source/core/README.md` | contract source | 共享契约核心源码说明 | 说明核心契约源码放置规则 |
| `contract-source/packages/identity/README.md` | contract source | identity 契约包源码说明 | 说明 identity 契约包源码边界 |
| `contract-source/packages/conversation/README.md` | contract source | conversation 契约包源码说明 | 说明 conversation 契约包源码边界 |
| `contract-source/packages/work/README.md` | contract source | work 契约包源码说明 | 说明 work 契约包源码边界 |
| `contract-source/packages/process/README.md` | contract source | process 契约包源码说明 | 说明 process 契约包源码边界 |
| `contract-source/packages/governance/README.md` | contract source | governance 契约包源码说明 | 说明 governance 契约包源码边界 |
| `contract-source/packages/artifact/README.md` | contract source | artifact 契约包源码说明 | 说明 artifact 契约包源码边界 |
| `contract-source/references/README.md` | contract source | 外部引用说明 | 说明标准、ADR、评审、下游反馈只保存引用 |
| `release-snapshots/README.md` | release snapshot | 快照目录说明 | 说明只读发布快照承载规则 |
| `crates/contracts/src/actor.rs` | contracts | Actor DTO | 定义 `ActorContext` / `ActorRef` 等操作者上下文 |
| `crates/contracts/src/metadata.rs` | contracts | Metadata DTO | 定义 `CommandMetadata` / `QueryMetadata` / `RequestMetadata` |
| `crates/contracts/src/commands.rs` | contracts | Command DTO | 定义创建、更新、提交、发布、生命周期变更等命令载荷 |
| `crates/contracts/src/queries.rs` | contracts | Query DTO | 定义获取、列表、追溯、快照、兼容追溯等查询载荷 |
| `crates/contracts/src/events.rs` | contracts | Outbound Event DTO | 定义契约草稿变化、发布、生命周期、快照、事实输出等事件载荷 |
| `crates/contracts/src/jobs.rs` | contracts | Operations Job DTO | 定义校验、派生、重建、复算、事实发布等 job 输入 / 输出 |
| `crates/contracts/src/views.rs` | contracts | View DTO | 定义契约详情、列表、快照、追溯和兼容视图 |
| `crates/contracts/src/receipts.rs` | contracts | Receipt DTO | 定义 command / job 处理回执 |
| `crates/contracts/src/errors.rs` | contracts | Protocol error DTO | 定义对外错误响应结构 |
| `crates/domain/src/definition/aggregate.rs` | domain | `ContractDefinition` | 维护共享契约定义真相与不变量 |
| `crates/domain/src/definition/scope.rs` | domain | `ContractScope` | 表达契约范围和跨仓共享边界 |
| `crates/domain/src/definition/version.rs` | domain | `ContractVersion` | 表达契约版本位置和演进序列 |
| `crates/domain/src/definition/lifecycle.rs` | domain | `ContractLifecycle` | 表达 draft / in_review / published / deprecated / retired / superseded 状态 |
| `crates/domain/src/definition/evolution.rs` | domain | `ContractEvolutionRecord` | 记录契约演进追溯锚点 |
| `crates/domain/src/packages/identity.rs` | domain | `IdentityContractPackage` | 承载 identity 对外共享契约包 |
| `crates/domain/src/packages/conversation.rs` | domain | `ConversationContractPackage` | 承载 conversation 对外共享契约包 |
| `crates/domain/src/packages/work.rs` | domain | `WorkContractPackage` | 承载 work 对外共享契约包 |
| `crates/domain/src/packages/process.rs` | domain | `ProcessContractPackage` | 承载 process 对外共享契约包 |
| `crates/domain/src/packages/governance.rs` | domain | `GovernanceContractPackage` | 承载 governance 对外共享契约包 |
| `crates/domain/src/packages/artifact.rs` | domain | `ArtifactContractPackage` | 承载 artifact 对外共享契约包 |
| `crates/domain/src/release/baseline.rs` | domain | `ContractReleaseBaseline` | 表达正式发布基线 |
| `crates/domain/src/release/compatibility.rs` | domain | `CompatibilityStatus` | 表达兼容性判断状态 |
| `crates/domain/src/release/policy.rs` | domain | `ReleasePolicy` | 约束发布、废弃、退役和 supersede 规则 |
| `crates/domain/src/snapshot/release_snapshot.rs` | domain | `ContractReleaseSnapshot` | 表达只读发布快照 |
| `crates/domain/src/snapshot/downstream_ref.rs` | domain | `DownstreamConsumptionRef` | 表达下游消费引用关系 |
| `crates/domain/src/reference/external_reference.rs` | domain | `ExternalReference` | 表达标准、ADR、评审、下游反馈等外部引用 |
| `crates/domain/src/projection/read_model.rs` | domain | `ContractReadModel` | 表达契约只读查询模型 |
| `crates/domain/src/projection/trace_projection.rs` | domain | `ContractTraceProjection` | 表达版本、引用、审计和事实追溯投影 |
| `crates/domain/src/fact/record.rs` | domain | `ContractFactRecord` | 表达契约变化可感知事实 |
| `crates/domain/src/policies/scope_policy.rs` | domain | `ScopePolicy` | 判断候选契约是否具有跨仓共享价值 |
| `crates/domain/src/policies/boundary_guard.rs` | domain | `BoundaryGuard` / `DefinitionUseBoundaryGuard` | 防止外部正文、运行实例和业务真相混入本仓 |
| `crates/domain/src/policies/reference_validation.rs` | domain | `ReferenceValidationPolicy` | 校验定义引用和外部引用是否允许 |
| `crates/domain/src/policies/fingerprint.rs` | domain | `FingerprintPolicy` | 约束 canonical 内容与 fingerprint 生成 / 对比规则 |
| `crates/application/src/services/change_service.rs` | application | `ContractChangeService` | 编排草稿、更新、提交前准备和输入收口 |
| `crates/application/src/services/release_service.rs` | application | `ContractReleaseService` | 编排发布、废弃、退役和 supersede |
| `crates/application/src/services/compatibility_service.rs` | application | `ContractCompatibilityService` | 编排 gate、fingerprint 和兼容判断 |
| `crates/application/src/services/snapshot_service.rs` | application | `ContractSnapshotService` | 编排发布快照生成、导出和恢复入口 |
| `crates/application/src/services/trace_service.rs` | application | `ContractTraceService` | 编排版本、引用、审计和事实追溯视图 |
| `crates/application/src/services/fact_service.rs` | application | `ContractFactService` | 编排事实输出、审计和 outbox 写入 |
| `crates/application/src/services/operations_service.rs` | application | `ContractOperationsService` | 编排 seed、replay、rebuild、recalculate 等操作 |
| `crates/application/src/ports/unit_of_work.rs` | application ports | `UnitOfWork` | 定义事务边界端口 |
| `crates/application/src/ports/definition_repository.rs` | application ports | `ContractDefinitionRepository` | 定义契约真相读写端口 |
| `crates/application/src/ports/baseline_repository.rs` | application ports | `ContractBaselineRepository` | 定义发布基线读写端口 |
| `crates/application/src/ports/snapshot_repository.rs` | application ports | `SnapshotRepository` | 定义发布快照读写端口 |
| `crates/application/src/ports/reference_repository.rs` | application ports | `ReferenceRepository` | 定义引用、标准映射和消费引用读写端口 |
| `crates/application/src/ports/audit_log.rs` | application ports | `AuditLogPort` | 定义审计记录写入端口 |
| `crates/application/src/ports/idempotency.rs` | application ports | `IdempotencyRepository` | 定义幂等预占、replay 和 complete 端口 |
| `crates/application/src/ports/outbox.rs` | application ports | `OutboxPort` | 定义 outbox 事实写入端口 |
| `crates/application/src/ports/gate_decision.rs` | application ports | `GateDecisionPort` | 定义 approved gate 查询端口 |
| `crates/application/src/ports/reference_resolver.rs` | application ports | `ReferenceResolverPort` | 定义外部引用解析端口 |
| `crates/application/src/ports/blob_ref.rs` | application ports | `BlobRefPort` | 定义 blob 引用校验端口 |
| `crates/application/src/ports/event_publisher.rs` | application ports | `EventPublisherPort` | 定义事实交给 `L0-bus` 边界的发布端口 |
| `crates/application/src/ports/clock.rs` | application ports | `ClockPort` | 定义时间来源端口 |
| `crates/application/src/ports/id_generator.rs` | application ports | `IdGeneratorPort` | 定义稳定编号生成端口 |
| `crates/application/src/ports/source_store.rs` | application ports | `ContractSourceStorePort` | 定义契约源码资产读写端口 |
| `crates/application/src/ports/snapshot_store.rs` | application ports | `ReleaseSnapshotStorePort` | 定义发布快照资产读写端口 |
| `crates/application/src/ports/projection_store.rs` | application ports | `ProjectionStorePort` | 定义查询投影、索引水位和批量重建端口 |
| `crates/application/src/ports/validation_runner.rs` | application ports | `ContractValidationRunnerPort` | 定义契约校验工具链端口 |
| `crates/application/src/ports/fingerprint_runner.rs` | application ports | `FingerprintRunnerPort` | 定义 canonical fingerprint 工具链端口 |
| `crates/application/src/ports/snapshot_exporter.rs` | application ports | `SnapshotExporterPort` | 定义发布快照导出工具链端口 |
| `crates/infra/src/source_store/filesystem.rs` | infra | filesystem source adapter | 从结构化契约源码目录读取和写入契约源 |
| `crates/infra/src/snapshot_store/filesystem.rs` | infra | filesystem snapshot adapter | 读写只读发布快照 |
| `crates/infra/src/projection_store/file_index.rs` | infra | file projection adapter | 读写查询索引和追溯投影 |
| `crates/infra/src/audit_store/file_audit.rs` | infra | file audit adapter | 追加和查询审计记录 |
| `crates/infra/src/idempotency_store/file_idempotency.rs` | infra | file idempotency adapter | 持久化幂等预占和 replay 结果 |
| `crates/infra/src/outbox_store/file_outbox.rs` | infra | file outbox adapter | 持久化待发布事实 |
| `crates/infra/src/adapters/unit_of_work.rs` | infra | unit of work adapter | 提供事务 / 文件锁 / 一致性提交边界 |
| `crates/infra/src/adapters/gate_decision.rs` | infra | gate adapter | 读取或校验 approved gate 引用 |
| `crates/infra/src/adapters/reference_resolver.rs` | infra | reference resolver adapter | 解析外部引用是否存在或可用 |
| `crates/infra/src/adapters/blob_ref.rs` | infra | blob ref adapter | 校验 blob 引用而不吸收正文 |
| `crates/infra/src/adapters/event_publisher.rs` | infra | `EventPublisherPort` adapter | 将事实交给 `L0-bus` 边界 |
| `crates/infra/src/adapters/clock.rs` | infra | clock adapter | 提供系统时间来源 |
| `crates/infra/src/adapters/id_generator.rs` | infra | id generator adapter | 提供稳定编号来源 |
| `crates/infra/src/toolchain/validator.rs` | infra | validation runner | 承接契约校验工具链 |
| `crates/infra/src/toolchain/fingerprint.rs` | infra | fingerprint runner | 承接 canonical fingerprint 生成 / 对比 |
| `crates/infra/src/toolchain/snapshot_exporter.rs` | infra | snapshot exporter runner | 承接快照派生和导出 |
| `crates/cli/src/commands/command_api.rs` | cli | `ContractCommandApi` adapter | 接收写请求并调用 application service |
| `crates/cli/src/commands/query_api.rs` | cli | `ContractQueryApi` adapter | 接收查询请求并调用 query / trace service |
| `crates/cli/src/commands/operations_trigger.rs` | cli | `ContractOperationsTrigger` adapter | 接收运维触发并调用 operations service |
| `crates/cli/src/context.rs` | cli | actor / metadata context loading | 加载外层可信入口传入的上下文,不做认证授权 |
| `crates/jobs/src/jobs/validate_contract_change.rs` | jobs | `ValidateContractChangeJob` | 校验候选契约变化是否满足规则 |
| `crates/jobs/src/jobs/derive_release_snapshot.rs` | jobs | `DeriveReleaseSnapshotJob` | 基于发布基线派生或刷新快照 |
| `crates/jobs/src/jobs/rebuild_contract_index.rs` | jobs | `RebuildContractIndexJob` | 重建查询索引和追溯投影 |
| `crates/jobs/src/jobs/recalculate_fingerprint.rs` | jobs | `RecalculateFingerprintJob` | 复算 canonical fingerprint 并用于漂移判断 |
| `crates/jobs/src/jobs/publish_contract_fact.rs` | jobs | `PublishContractFactJob` | 将已提交事实整理为可传播记录 |
| `crates/jobs/src/outbox_relay/worker.rs` | jobs | `OutboxRelayWorker` | 从 outbox 读取事实并调用 event publisher port |
| `tests/contract_change_flow.rs` | integration tests | contract change flow test | 覆盖变更入口和输入收口主链 |
| `tests/release_snapshot_flow.rs` | integration tests | release snapshot flow test | 覆盖发布基线和快照派生主链 |
| `tests/trace_query_flow.rs` | integration tests | trace query flow test | 覆盖追溯查询主链 |
| `tests/operations_jobs.rs` | integration tests | operations jobs test | 覆盖后台 job 主链 |

---

## 8. 回填草稿

可直接回填到正式 `03-详细设计.md` §4 的草稿结构:

```md
## 4. 实现单元与文件布局

> 校准来源:
> - `design-calibration/03_ddd_step_04_units_file_layout.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/03_ddd_step_04_units_file_layout.md` 的“布局形态决策表”“实现单元总表”“文件布局树”“文件职责表”和“待确认事项”小节,了解本章如何把概要设计代码主体转译成目标实现仓布局。

### 4.1 布局形态决策

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层架构 | 否 | L0-core 有公共契约给其他仓复用,存在 CLI / job / relay 多入口,且必须强制 domain 不依赖 infra / bus / toolchain | 若采用会降低边界强度,后续 review 成本高 |
| workspace 多 crate 架构 | 是 | 符合公共契约复用、多入口、domain 纯净、infra 较重、长期平台化等条件 | 需要建立 6 个 crate,但依赖方向可由 Cargo 强制约束 |

### 4.2 实现单元总表

命名规则：

- 文件目录使用短语义名，例如 `crates/application`。
- Cargo package 使用 `core-*` 前缀，例如 `core-application`。
- Rust library crate 使用 `core_*` 前缀，例如 `core_application`。
- 目录名不重复写入 `l0`，因为目标实现仓本身已经表达 L0-core 项目边界。

| 目录 / 资产根 | 类型 | Cargo package / Rust crate | 职责 | 对应概要设计章节 |
|---|---|---|---|---|
| `contract-source/` | asset root | - | 结构化契约源码真相 | §4 / §5 |
| `release-snapshots/` | asset root | - | 只读发布快照 | §5 / §8 |
| `crates/contracts` | library crate | `core-contracts` / `core_contracts` | 定义 Command / Query / Event / Job / View / Receipt / Error DTO、`ActorContext`、`CommandMetadata`、`QueryMetadata` 等公共协议对象 | §4 外部接缝;§7 API / 接口骨架;§11 详细设计承接 |
| `crates/domain` | library crate | `core-domain` / `core_domain` | 定义共享契约核心、领域契约包、发布基线、快照、引用、追溯、事实记录和领域策略 | §4 共享契约核心;§5.4~§5.8;§6 关键对象;§9 状态 |
| `crates/application` | library crate | `core-application` / `core_application` | 定义 application service、use case 编排、port trait 和应用错误边界 | §4 Application Services;§5.3~§5.9;§8 关键处理流 |
| `crates/infra` | library crate | `core-infra` / `core_infra` | 实现 source store、snapshot store、projection、outbox、reference resolver、blob ref、gate decision、event publisher、clock、id generator 等 adapter | §4 Ports / Persistence / Projection / External Adapters;§5.9 |
| `crates/cli` | binary crate | `core-cli` / `core` | 承载 `ContractCommandApi`、`ContractQueryApi`、`ContractOperationsTrigger` 的同步入口适配和输出映射 | §4 Inbound / Operations;§5.3;§5.7;§5.8 |
| `crates/jobs` | binary crate | `core-jobs` / `core-*` job binaries | 承载校验、快照派生、索引重建、fingerprint 复算、事实发布和 outbox relay 执行入口 | §5.8 后台校验与事实输出 |

### 4.3 文件布局树

```text
<使用 §7.3 文件布局树>
```

### 4.4 文件职责表

<使用 §7.4 文件职责表>
```

---

## 9. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 本轮采用哪种布局形态 | A. 单 crate 模块分层; B. workspace 多 crate; C. proto / buf 主布局 | B | 本仓是跨仓共享契约来源,需要公共契约复用、多入口和 domain 纯净边界 | 已自动确认采用 B |
| `ContractCommandApi` / `ContractQueryApi` 是否落成在线 API 服务 | A. 直接建 HTTP API; B. 先落成 CLI / library 同步入口; C. 不实现入口 | B | 架构设计明确没有常驻在线运行时容器,但概要设计需要正式入口主体 | 已自动确认采用 B |
| 是否把 proto 目录作为 P0 主布局 | A. 是; B. 否,只作为后续契约源码格式候选; C. 完全删除 proto 概念 | B | 当前 v0.2.0 主线是结构化契约来源仓,不能回退为 proto-only,但 proto 仍可能是后续源格式或快照格式之一 | 已自动确认采用 B |

---

## 10. 进入下一步条件

- 已明确采用 workspace 多 crate 架构。
- 已明确 `contracts` / `domain` / `application` / `infra` / `cli` / `jobs` 六个 P0 实现单元。
- 已明确 `contract-source/` 和 `release-snapshots/` 的承载目录。
- 已明确 `crates/cli` / `core-cli` 不是在线 API 服务,`crates/jobs` / `core-jobs` 不是 `L0-bus` runtime。
- 已明确文件路径、所属模块、定义内容和主要责任。
- 可以进入 Step 5 “定义模块实现契约主轴”。
