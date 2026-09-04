# 03-详细设计 Step 4：实现单元与文件布局

> 项目：`L2-member-service`
> 对应 SOP：`详细设计讨论流程_SOP.md` Step 4
> 状态：completed
> Gate：pass_with_upstream_blockers
> 日期：2026-08-25
> 布局状态：planned；未创建实现仓或源码文件

## 1. 本步输入

| 输入 | 采用结论 |
|---|---|
| Step 2 实现范围 | 七个 CMP、Host Truth 控制面、17 IB、七条流族 |
| Step 3 Rust / 依赖约束 | Rust 2024 planned、Core compile seam、其余跨仓关系非 Cargo dependency |
| `02_hld_step_04_code_skeleton.md` | Inbound / Operations、Application、Domain、Ports、Persistence / Projection、Adapters / Wiring 双轴 |
| 目录组织规范 | 实现仓 `quantalithos-member-service`；workspace member 使用 `crates/<role>`；package `<project>-<role>` |
| 当前 filesystem | `/home/aris/Projects/quantalithos-member-service` 不存在；不能写 created / compiled |

## 2. 布局形态裁决

选择 planned workspace 多 crate，原因如下：

1. `contracts` 需要与 Host Truth domain 隔离，未来可被受限 SDK / API 边界消费；
2. `domain` 必须无外部产品 client 和 IO，便于独立验证正交状态与不变量；
3. `application` 承载 UoW、port 和用例编排，阻止 API / adapter 越过业务边界；
4. `infra` 承载 repository、projection、outbox、adapter 和 wiring，吸收产品差异；
5. `api`、`worker`、`jobs` 的写权限和运行角色不同，不能合并成万能 service；
6. 未来 exact Core / SDK surface 变化只影响 contracts / adapter binding，不改变 domain 主体。

这只是实现契约布局，不表示 workspace 已创建、crate 已编译、binary 已可运行或任何跨项目合同 ready。

## 3. 实现单元总表

| 实现单元 | 类型 | Cargo package | Rust crate / binary | 责任 | 对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `member-service-contracts` | `member_service_contracts` | typed ref、metadata、Command / Query / Consumer / Event / Job、View / Receipt / Error | 受控 public contracts |
| `crates/domain` | library crate | `member-service-domain` | `member_service_domain` | 29 个 Host Truth 对象、状态轴、policy、guard、纯 transition | 供 application / domain tests |
| `crates/application` | library crate | `member-service-application` | `member_service_application` | use case、handler、UoW、repository / external ports、读写编排 | 供 api / worker / jobs / tests |
| `crates/infra` | library crate | `member-service-infra` | `member_service_infra` | local store、history、outbox、projection、adapter、builder wiring | 仅向入口暴露构造器 |
| `crates/api` | binary + optional library | `member-service-api` | binary `member-service-api` | Command / Query transport-neutral entry mapping；具体 transport deferred | planned entry |
| `crates/worker` | binary + optional library | `member-service-worker` | binary `member-service-worker` | 常驻 Consumer、signal / feedback intake、lease / cancellation wiring | planned worker |
| `crates/jobs` | binary + optional library | `member-service-jobs` | binaries `dispatch_host_actions`、`evaluate_host_health`、`reconcile_host_residuals`、`publish_host_facts`、`rebuild_host_projection` | 一次性 / scheduler-triggered operations jobs | planned jobs |

不建立 `cli`、`common`、`utils`、`worker-manager` 或 `execution` 顶层 crate；没有新的业务组成部分。`config`、`observability` 是 infra / entry 内的职责目录，不单独成为业务 crate。

## 4. 目录 / package / crate / binary 映射

| 目录 | package | crate / binary | 允许依赖 | 禁止依赖 |
|---|---|---|---|---|
| `crates/contracts` | `member-service-contracts` | `member_service_contracts` | `core-contracts`（planned compile）和序列化基础设施待实现决定 | domain、application、runtime client、Bus private model |
| `crates/domain` | `member-service-domain` | `member_service_domain` | `member-service-contracts`、纯标准库 / error 基础 | DB、Bus、SDK runtime、容器、Sandbox、sibling |
| `crates/application` | `member-service-application` | `member_service_application` | contracts、domain、port trait、异步抽象 | 产品 client、具体 DB / broker / HTTP |
| `crates/infra` | `member-service-infra` | `member_service_infra` | contracts、domain、application；Core contract adapter | domain 反向依赖 infra；外部私有模型进入 domain |
| `crates/api` | `member-service-api` | `member-service-api` | contracts、application、infra wiring | 直接写 domain truth 或读取 DB |
| `crates/worker` | `member-service-worker` | `member-service-worker` | contracts、application、infra wiring | 隐式创建 decision / lifecycle action |
| `crates/jobs` | `member-service-jobs` | job binaries | contracts、application、infra wiring | 直接改 sibling / backend truth；隐藏命令入口 |

Cargo path 依赖只在未来实现仓确认后按真实 workspace 落入；本 Step 不创建 `Cargo.toml`。

## 5. Planned 文件布局树

```text
quantalithos-member-service/                    # planned implementation repo
  Cargo.toml                                    # planned workspace; no file created now
  crates/
    contracts/
      Cargo.toml
      src/
        lib.rs                                  # public contract exports
        refs.rs                                 # typed ids, refs, tagged decision refs, generation and stable keys
        metadata.rs                             # command/query/event/job metadata and correlation carriers
        commands.rs                             # IB-MS-001/002/004/005/007/008/012/013 inputs
        queries.rs                              # IB-MS-003/006/009/011/015 inputs
        consumers.rs                            # signal, action, cleanup and handoff feedback envelopes
        events.rs                               # body-free material event candidate
        jobs.rs                                 # operations job input / receipt contracts
        views.rs                                # SafeHostView, page, freshness, visibility and degraded public carriers
        receipts.rs                             # local acceptance, attempt, submission and gap results
        errors.rs                               # transport-neutral public error categories
        redaction.rs                            # forbidden-body / safe-field markers
    domain/
      Cargo.toml
      src/
        lib.rs
        subject.rs                              # project/global dual-anchor guards
        control.rs                              # HostIntent, HostOrchestrationDecision, HostControlPolicy
        qualification.rs                        # HostQualificationContext, RequiredQualificationPolicy
        assembly.rs                             # HostAssembly, HostReadinessDecision
        host.rs                                 # MemberExecutionHost, HostGenerationFence
        action_attempt.rs                       # HostActionAttempt
        association.rs                          # HostExternalAssociation
        registration.rs                         # HostRegistration, RegistrationSessionPolicy
        endpoint.rs                             # HostEndpoint
        session.rs                              # HostSession
        health_signal.rs                        # HealthSignalSnapshot
        health.rs                               # HostHealthAssessment, HostFailureClassification
        recovery.rs                             # HostRecoveryDecision
        closure.rs                              # HostClosure, CleanupAttempt
        reconciliation.rs                       # ResidualFinding, ReconciliationCase
        material.rs                             # HostFactMaterial, HostHandoffRecord
        projection.rs                           # HostProjectionState and internal derived-state guards; never public view DTOs
        outbox.rs                               # HostOutboxRecord
        history.rs                              # HostHistoryEntry
        state.rs                                # orthogonal state enums and transition guards
        policies.rs                             # no-fallback, redaction and scope policies
        errors.rs                               # domain errors and invariant violations
    application/
      Cargo.toml
      src/
        lib.rs
        services.rs                             # application facade and capability-to-use-case assembly
        ports/
          mod.rs
          repositories.rs                       # source / history / outbox / projection store traits
          unit_of_work.rs                       # local transaction and expected revision surface
          qualification.rs                      # Identity / Work / Images / credential / binding resolvers
          carrier.rs                            # host carrier / registry / lifecycle adapters
          session.rs                            # Member / Runtime registration and session seams
          sandbox.rs                            # host binding / release / cleanup seams
          publication.rs                        # material publication / handoff / feedback seams
          runtime.rs                            # async runtime, clock, id and job context ports
        use_cases/
          mod.rs
          intent.rs                             # IB-MS-001/002/003
          qualification.rs                      # IB-MS-004/006
          assembly.rs                           # IB-MS-005
          progression.rs                        # generation and action attempt use cases
          registration.rs                       # IB-MS-007/008/009
          health.rs                             # IB-MS-010/011
          recovery.rs                           # IB-MS-012
          closure.rs                            # IB-MS-013/014
          materialization.rs                    # committed material, outbox and handoff orchestration
          read.rs                               # authorized safe-view and history query assembly; no-write
        transactions.rs                         # read / write set and UoW orchestration helpers
        mappers.rs                              # contracts <-> domain, error and safe view mapping
        idempotency.rs                          # replay / request digest / stored result boundary
        jobs.rs                                 # job selectors and application job handlers
        errors.rs                               # application / port error mapping
    infra/
      Cargo.toml
      src/
        lib.rs
        persistence/
          mod.rs
          source_store.rs                       # Host Truth repositories
          history_store.rs                      # append-only history
          idempotency_store.rs                  # stable request key and stored result
          outbox_store.rs                       # publication marker / attempt
          projection_store.rs                   # cursor / rebuild / safe view
          unit_of_work.rs                       # concrete local transaction adapter
        adapters/
          mod.rs
          identity_work.rs                      # runtime / ref qualification adapters
          images.rs                             # pinned supply placeholder adapter
          member.rs                             # registration / signal placeholder adapter
          runtime.rs                            # Host Session / handoff placeholder adapter
          sandbox.rs                            # binding / release / cleanup placeholder adapter
          carrier.rs                            # neutral host carrier / registry adapter
          publication.rs                        # event / handoff publisher adapter
        runtime_builder.rs                      # validated dependency injection, adapter availability and facade composition
        config.rs                               # validated config binding types; full keys in 04
        observability.rs                        # log / metric / trace / audit sink seam
        errors.rs                               # infrastructure error mapping; no product error body
    api/
      Cargo.toml
      src/
        main.rs                                # planned process entry
        lib.rs
        command_handlers.rs                     # ApiCommandEntry, command mapping and local result disposition
        query_handlers.rs                       # ApiQueryEntry, query mapping and no-write read disposition
        transport_error.rs                      # transport-neutral public error mapping
    worker/
      Cargo.toml
      src/
        main.rs                                # planned process entry
        lib.rs
        consumers.rs                            # inbound signal / action / cleanup / handoff consumers and receipt disposition
        outbox_publisher.rs                     # long-running local outbox publication loop
        projection_worker.rs                    # long-running projection invalidation / maintenance trigger
        worker_context.rs                       # lease, cancellation and operation context
        errors.rs                               # worker entry and item-result error mapping
    jobs/
      Cargo.toml
      src/
        lib.rs
        job_entry.rs                            # JobEntry, run context and run disposition; not a Host lifecycle state
        dispatch_host_actions.rs                # planned job binary
        evaluate_host_health.rs                 # planned job binary
        progress_host_cleanup.rs                # planned job binary
        reconcile_host_residuals.rs             # planned job binary
        publish_host_facts.rs                   # planned job binary
        rebuild_host_projection.rs              # planned job binary
        reconcile_handoff_gaps.rs               # planned job binary
        errors.rs                               # job entry and run-result error mapping
```

## 6. 文件职责映射审计

| 文件组 | 定义内容 | 主要责任 | 对应 CMP / IB |
|---|---|---|---|
| `contracts/src/{refs,metadata,redaction}.rs` | typed ref、双锚、tagged decision ref、metadata、safe marker | public field source 和敏感数据边界；所有 public 二级 carrier 必须在此组或其同 crate 文件中有唯一 owner | all; `IB-MS-001~017` |
| `contracts/src/{commands,queries,consumers,events,jobs}.rs` | public input / envelope / job IO | transport-neutral DTO | `IB-MS-001~017` |
| `contracts/src/views.rs` | `SafeHostView`、page、freshness、visibility、degraded surface | public read-model DTO；不得依赖 domain object 或执行 authorization / refresh | Query |
| `contracts/src/{receipts,errors}.rs` | local receipt、handler / consumer / job disposition、error | result / duplicate / gap / rejection 分层 | Command / Event / Job |
| `domain/src/control..assembly.rs` | intent、decision、qualification、assembly | CMP-MS-01/02 truth and policy | `IB-MS-001~006` |
| `domain/src/host..session.rs` | host、generation、attempt、association、registration、session | CMP-MS-03/04 truth | `IB-MS-007/008/010/013` |
| `domain/src/health..recovery.rs` | signal、assessment、failure、recovery | CMP-MS-05 local fact / decision | `IB-MS-010~012` |
| `domain/src/{closure,reconciliation,material,projection,outbox,history}.rs` | closure、cleanup、residual、case、material、handoff、projection-state、outbox、history | CMP-MS-06/07 的 domain record / policy 边界；`SafeHostView` 仅定义在 `contracts/src/views.rs` | `IB-MS-013~017` |
| `application/src/ports` | all local and external seams | dependency inversion and owner boundary | all use cases |
| `application/src/use_cases/{materialization,read}.rs` | material / handoff 与 safe read 分离 | 前者编排 material / outbox / handoff；后者只读组装 public view / history page | `IB-MS-015~017` |
| `application/src/{services,idempotency,transactions,mappers,jobs}.rs` | service facade、operation context、stored result、UoW helper、public mapper、job report assembly | application-only stable carrier；不成为 domain truth 或 port implementation | all use cases |
| `application/src/use_cases` | application handlers and read paths | UoW, guard, mapping, local result；每个用例文件按 command / query / consumer / job 职责命名 | 17 IB + jobs |
| `infra/src/persistence` | repository / UoW implementation | local source, history, outbox, projection | source write / read |
| `infra/src/{runtime_builder,config,errors}.rs` | runtime assembly、config binding、adapter availability、infra error | 不保存 raw config / secret / product body，也不改变 domain invariant | startup / all entries |
| `infra/src/adapters` | external adapter implementations | runtime / event / ref / adapter translation | blocker seams |
| `api/src` | public entry mapping | actor / metadata / DTO / error | Commands / Queries |
| `worker/src/{consumers,outbox_publisher,projection_worker}.rs` | long-running consumers and maintenance loops | signal / feedback intake、outbox publication、projection trigger；均经 application surface | `IB-MS-010/017` |
| `jobs/src/{job_entry,*.rs}` | persisted work progression and one-shot job entries | job input / disposition、attempt / outbox / projection / reconciliation；不把 scheduler state 写成 Host lifecycle | operations jobs |

## 7. 命名与依赖检查表

| 检查项 | 结果 | 说明 |
|---|---|---|
| 实现仓名 | pass | planned `quantalithos-member-service` |
| project slug | pass | `member-service`，不含 `L2` |
| member 目录 | pass | `crates/<role>`，不重复项目名前缀 |
| package / crate 命名 | pass | hyphen package、underscore lib crate |
| binary 命名 | pass | api / worker 和具体 job action |
| 顶层 role | pass | contracts / domain / application / infra / api / worker / jobs |
| 架构层级泄漏 | pass | 不使用 `l2_`、`l1_` 或 `core_` 作为本仓职责名 |
| 文件职责 | pass | 不使用顶层 `utils.rs`、`common.rs`、`manager.rs` |
| 依赖方向 | pass | entry -> application -> domain / ports -> infra；domain 不反向 |
| 实现状态 | pass | 全部 marked planned；无源码 / 编译 / 测试 claim |

## 8. 依赖仓库映射

| 依赖仓库 | 类型 | Cargo / 协作位置 | 当前处理 |
|---|---|---|---|
| `quantalithos-core/crates/contracts` | compile | 未来 workspace dependency `core-contracts = { path = "../../quantalithos-core/crates/contracts" }`（路径以实现仓真实层级复核） | planned；只在准确目标确认后写入 |
| `quantalithos-bus` | event | `HostFactPublicationPort` / consumer adapter | 不进入 Cargo dependency |
| `quantalithos-sdk` | limited compile / fake | future optional `sdk-contracts` candidate | `MSVC-UP-008` 前不得绑定 |
| L1 / L2 / L4 sibling | runtime / event / ref / adapter | ports / adapters | 不进入 Cargo dependency，不共享 storage / private model |

## 9. 历史差异审计

旧 03 的 `worker`、`runtime_sessions`、`capability_mounts`、`execution_callbacks`、`sandbox_bindings` 目录曾被当作业务主线或直接存储 truth。当前布局只保留 `worker` 作为运行入口角色，`HostSession`、qualification、binding 和 material 归属当前 29 对象与 port；不建立旧目录对应的独立业务模块或对象。

## 9.1 Step 5/6 文件归属校正（2026-08-25）

本节是对原 Step 4 已完成布局的最小校正，不改变 workspace、七个 crate、29 个业务对象、CMP、IB 或跨仓边界。校正原因是 Step 5/6 审计发现此前的文件树不足以保证 public read DTO、application read path 和非 core entry object 的唯一文件 owner。

| 问题 | 原口径 | 校正后口径 | 原因 |
|---|---|---|---|
| `SafeHostView` | 同时被 `contracts/src/views.rs` 与 `domain/src/projection.rs` 暗示承载 | public `SafeHostView` 固定归 `contracts/src/views.rs`；domain 只保留 `HostProjectionState` 与内部 derived guard | public contracts 不得依赖 domain；view 不能成为 domain truth 或 authorization 执行器 |
| CMP-07 application use case | `handoff.rs` 混合 material / handoff / public read | `materialization.rs` 承接 material / outbox / handoff；`read.rs` 承接授权后的只读 view / history page assembly | command-side materialization 与 query no-write 必须能直接定位到不同文件 |
| infra assembly | `wiring.rs` 名称过宽 | `runtime_builder.rs` 承接 config validation、adapter availability、facade assembly | `runtime builder` 是稳定对象组；禁止用通用 wiring 桶掩盖状态与失败边界 |
| application facade | `domain/src/services.rs` 被列为 capability-to-use-case assembly | `application/src/services.rs` 是唯一 owner；`domain` 不再含 `services.rs` | facade、operation context 和 use-case assembly 属于 application；留在 domain 会使纯 domain 反向承担 UoW / port 编排 |
| API / worker / jobs entry object | 只列 handler / consumer / job binary，未预留 entry / disposition owner | 分别固定在 `api/{command_handlers,query_handlers}.rs`、`worker/{consumers,outbox_publisher,projection_worker}.rs`、`jobs/job_entry.rs` | Step 6 必须为 entry、receipt、disposition 等唯一 carrier 规定文件 owner |

文件归属红线：一个 public DTO、domain object、application helper、port trait、infra adapter state 或 entry object 只能有一个 owning crate / module / file；跨层只可通过已导出的 typed carrier 或 mapper 传递，不能在多个 crate 定义同名 shadow 类型。

## 10. 回填草稿与 Gate

正式 §4 应采用本文件 §3~§8 的 planned workspace、映射表、树、文件职责和依赖审计；正文必须标注“实现仓尚未创建”，不能写实际源码文件、Cargo lock、binary、运行结果或 compile evidence。

| 检查项 | 结果 | 说明 |
|---|---|---|
| 实现单元可直接映射 | pass | §3、§4 |
| 文件树和职责完整 | pass_after_2026-08-25_owner_correction | §5、§6、§9.1；为 Step 5/6 提供唯一 crate / file owner |
| 目录 / package / crate / binary 规则通过 | pass | §7 |
| Core / SDK / sibling 依赖分类正确 | pass_with_upstream_blockers | §8；`MSVC-UP-001~008` 未关闭 |
| 未创建源码或伪造实现状态 | pass | planned 明确 |
| 历史目录污染已裁剪 | pass | §9 |
| 可进入 Step 5 | pass | 进入模块实现契约主轴 |

```text
step_04_status = completed_with_owner_correction
step_04_gate = pass_with_upstream_blockers
next_allowed_step = Step 5 module_contracts_rework
formal_03_write_allowed = false_until_step_19
```
