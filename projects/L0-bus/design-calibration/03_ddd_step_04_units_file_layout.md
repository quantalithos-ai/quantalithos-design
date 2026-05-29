# Step 4. 收稳实现单元与文件布局

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 4
- 回填章节：`projects/L0-bus/03-详细设计.md` §4 实现单元与文件布局

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_02_scope.md` | P0 闭环范围、对象 / 接口 / event / job / 状态机覆盖范围 | 确认哪些实现单元必须存在 |
| `03_ddd_step_03_coding_runtime_constraints.md` | Rust、ports and adapters、`L0-core` 本地 path dependency、源码语言、运行期依赖边界 | 作为布局和依赖写法约束 |
| `projects/L0-bus/02-概要设计.md` §4 / §5 / §12 | 代码主体框架、六个主要组成部分、详细设计承接清单 | 把代码主体落到 crate / module / file |
| `standards/document/详细设计书写规范.md` §5.4 | 布局形态决策表、实现单元表、目录映射表、文件树和文件职责表格式 | 作为本步输出格式 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓目录、workspace member、package、crate、binary、scripts、reports、artifacts 规则 | 作为命名和目录约束 |
| `/home/aris/Projects/quantalithos-core` | 已存在的 sibling repo，包含 `crates/contracts` | 作为 `core-contracts` path dependency 的真实路径来源 |

已确认结论：

```text
目标实现仓路径: /home/aris/Projects/quantalithos-bus
project slug: bus
布局形态: workspace 多 crate 架构
仓内目录不写 L0 / l0 / quantalithos / bus_ 前缀;使用 crates/<role>。
P0 默认只把 core-contracts 写成本地 path dependency。
```

依赖的前序 Step：

```text
Step 2 已确认本轮范围。
Step 3 已确认 Rust、依赖、源码语言和安全边界。
```

---

## 3. SOP 问题回答

### 3.1 本轮实现包含哪些 crate / package / binary / library？

回答：

本轮采用 workspace 多 crate 架构，包含 6 个 library crate、2 类运行入口 crate 和标准 scripts / reports / artifacts 目录。

| 类型 | 实现单元 | 说明 |
|---|---|---|
| library crate | `crates/contracts` | Command、Query、Event、Job、View、Receipt、Error、Config-facing DTO |
| library crate | `crates/domain` | 领域对象、值对象、状态、策略、不变量 |
| library crate | `crates/application` | application service、port trait、用例编排、事务边界 |
| library crate | `crates/infra` | repository / adapter / config / runtime wiring / in-memory default path |
| library + binary crate | `crates/api` | command / feedback / recovery / query inbound API adapter |
| library + binary crate | `crates/worker` | 常驻 worker、consumer、subscriber loop |
| binary crate | `crates/jobs` | 一次性 operations job binary |
| test / report support | `tests/`、`scripts/`、`artifacts/`、`reports/` | 集成测试、门禁脚本、原始证据和可读报告 |

### 3.2 每个实现单元对应概要设计中的哪个代码主体？

回答：

| 实现单元 | 对应概要设计代码主体 |
|---|---|
| `contracts` | Command API、Query API、Inbound Event Consumer、Outbound Event、Operations Job 的协议骨架 |
| `domain` | `PublicationMaterial`、`DeliveryRecord`、`FeedbackResult`、`RetryPlan`、`BusAuditEntry`、policy、projection、状态集合 |
| `application` | `PublicationAcceptanceService`、`DeliveryProgressionService`、`FeedbackRecordingService`、`RecoveryOrchestrationService`、`ReadOutputService` |
| `infra` | `BusStorePort` 实现、repository adapter、`TransportBackendPort` 实现、config、runtime builder、projection store |
| `api` | `BusCommandApi`、`DeliveryFeedbackApi`、`RecoveryOperationsApi`、`BusQueryApi` |
| `worker` | `OutboxRelayTrigger`、`DeliveryWorkerTrigger`、`ReadOutputWorkerTrigger`、backend signal / timeout consumer |
| `jobs` | outbox relay、delivery progression、retry cycle、projection run / rebuild、backend capability check |

### 3.3 文件路径应该如何组织，才能体现模块边界？

回答：

文件路径按实现层组织，而不是按业务对象全集平铺。跨 crate 依赖方向应保持：

```text
api / worker / jobs
        |
        v
infra -> application -> domain
   |          |           |
   +----------+-----------+
              |
              v
          contracts
              |
              v
       core-contracts
```

关键说明：

- `domain` 不依赖 `infra`、`api`、`worker`、`jobs`。
- `application` 拥有 port trait 和用例编排，依赖 `domain` 与 `contracts`。
- `infra` 实现 application ports，并提供 runtime builder。
- `api`、`worker`、`jobs` 是入口 crate，不直接改写领域对象。

### 3.4 哪些文件必须创建，哪些文件只是后续可能扩展？

回答：

| 类别 | 本轮必须创建 | 后续可能扩展 |
|---|---|---|
| workspace | 根 `Cargo.toml`、各 member `Cargo.toml`、各 `src/lib.rs` | 发布 profile、workspace lint 配置 |
| contracts | commands、queries、events、jobs、views、errors、receipts | proto / OpenAPI 生成目录 |
| domain | publication、delivery、feedback、recovery、read_output、backend、errors | 更细对象文件拆分 |
| application | 各主线 service、ports、error、transaction boundary | 专项 consistency service |
| infra | config、runtime_builder、memory_store、repository adapters、transport adapter、publisher adapter、observability | 生产 MQ / DB adapter |
| api | command、feedback、recovery、query handler 和 DTO mapper | 具体 HTTP / RPC framework router |
| worker | outbox relay、delivery、backend signal、timeout、read output worker | 多节点协调 worker |
| jobs | 一次性 operations job binary | 运维 CLI / xtask |
| scripts | gate、report、artifact / redaction check | release automation |

### 3.5 每个文件负责定义哪些对象、trait、handler、repository 或测试？

回答：

本步在 §7.5 文件职责表中给出每个 P0 文件的责任。对象字段、trait 函数签名和 handler 调用链由 Step 6~9 展开。

### 3.6 当前仓的 project slug 是什么？

回答：`bus`。

### 3.7 workspace member 目录是否使用 `crates/<role>`？

回答：是。使用 `crates/contracts`、`crates/domain`、`crates/application`、`crates/infra`、`crates/api`、`crates/worker`、`crates/jobs`。

### 3.8 Cargo package 是否使用 `<project>-<role>`？

回答：是。使用 `bus-contracts`、`bus-domain`、`bus-application`、`bus-infra`、`bus-api`、`bus-worker`、`bus-jobs`。

### 3.9 Rust library crate 是否使用 `<project>_<role>`？

回答：是。使用 `bus_contracts`、`bus_domain`、`bus_application`、`bus_infra`、`bus_api`、`bus_worker`。`bus-jobs` 主要提供 binary，也可保留 `bus_jobs` lib 供 job binary 复用。

### 3.10 binary 名是否表达用户入口或具体动作？

回答：是。

| package | binary | 说明 |
|---|---|---|
| `bus-api` | `bus-api` | API 入口 |
| `bus-worker` | `bus-worker` | 常驻 worker 入口 |
| `bus-jobs` | `run_outbox_relay` | 一次性 outbox relay |
| `bus-jobs` | `run_delivery_progression` | 一次性 delivery 推进 |
| `bus-jobs` | `run_retry_cycle` | 一次性 retry cycle |
| `bus-jobs` | `rebuild_projection` | 一次性 projection rebuild |
| `bus-jobs` | `check_backend_capability` | 一次性后端能力检查 |

### 3.11 是否有 `L0` / `L1` / `l0_` / `l1_` 等架构层级泄漏进代码命名？

回答：没有。实现仓目录是 `quantalithos-bus`，仓内使用 `bus-*` package 和 `bus_*` crate，不使用 `l0_bus`、`L0Bus`、`crates/bus_domain` 或 `crates/l0_bus_domain`。

### 3.12 如果本仓存在已确认的编译期依赖，Cargo path dependency 应写在哪个 `Cargo.toml`，使用哪个真实 crate 路径？

回答：

`core-contracts` 应写在根 `Cargo.toml` 的 `[workspace.dependencies]` 中，由需要它的 member 使用 `workspace = true`。

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

路径来自已检查的真实 sibling repo：`/home/aris/Projects/quantalithos-core/crates/contracts`。

### 3.13 哪些运行期依赖或事件协作依赖只能在 adapter / event / projection 章节表达，不能进入文件布局的 Cargo 依赖？

回答：

| 关系 | 类型 | 正确落点 |
|---|---|---|
| MQ backend | 运行期依赖 | `crates/infra/src/transport_backend.rs`、Step 7 port、Step 14 config |
| Bus store / persistence | 运行期依赖 | `crates/infra/src/memory_store.rs`、repository adapter、Step 11 持久化 |
| 发布方仓 | 事件协作依赖 | `contracts/events.rs`、`worker/outbox_relay_worker.rs`、Step 8 / Step 9 |
| 订阅方仓 | 事件协作依赖 | delivery target ref、feedback API、backend signal consumer |
| SDK / observability / governance | 只读消费 / 事件协作 | query view、projection、outbound event，不写 Cargo path dependency |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` | 目录仍围绕旧 envelope / routing / callback schema 展开 | 无法承接新版 publication / delivery / feedback / recovery 主线 |
| 旧版 `03-详细设计.md` | 未按 workspace / package / crate / binary 约束输出映射表 | 实现者无法直接创建仓库结构 |
| 旧版 `03-详细设计.md` | 未明确 `core-contracts` 的真实 path dependency 写法 | 实现阶段可能凭空写错路径或扩大 core 依赖 |
| 当前流程 | `quantalithos-bus` 目标仓当前未发现 | 需要在本步给出计划目录，由实施计划要求创建或确认 |
| 当前范围 | API、worker、job、contracts、domain、infra 边界较多 | 单 crate 模块分层不足以强制边界 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 布局形态 | 旧文未按新版规则决策 | 明确采用 workspace 多 crate 架构 | bus 有公共契约、多入口、worker/job 和平台化边界 |
| 仓内目录 | 旧文可能按旧对象组或 `src/*` 粗分 | 使用 `crates/<role>` | 遵守目录组织规范，强制 crate 边界 |
| package / crate 命名 | 未统一 | package 用 `bus-<role>`，crate 用 `bus_<role>` | 避免 `L0` 泄漏和跨仓命名冲突 |
| binary | 未明确 | `bus-api`、`bus-worker`、具体 job action binary | 运行入口和一次性 job 可区分 |
| core 依赖 | 未写真实路径 | 根 workspace dependency 指向 `../quantalithos-core/crates/contracts` | 当前只确认 `core-contracts` 是编译期依赖 |
| reports / artifacts / scripts | 旧文没有统一目录 | 引入标准目录和脚本位置 | 支撑测试、验收和实施证据产出 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：单 crate 模块分层架构 | 初期文件少，开发快 | 公共契约、API、worker、jobs、infra 边界都靠 review 约束，长期易混 | 不采用 |
| 方案 B：workspace 多 crate 架构 | 能用 Cargo 依赖强制 contracts / domain / application / infra / entrypoint 边界 | 初期文件和配置更多 | 采用 |
| 方案 C：按业务组成部分建 crate，如 `publication`、`delivery`、`recovery` | 业务主线清晰 | 横切事务、端口、DTO、投影和入口会重复，crate 间循环风险高 | 不采用 |
| 方案 D：为每个 MQ / DB 后端建独立 crate | 后续生产 adapter 清晰 | P0 后端未定，当前会制造空壳 | 不采用 |

推荐方案：方案 B。原因是 `L0-bus` 是平台级传递主干，同时拥有公共协议、领域语义、应用编排、适配器、API、worker 和 operations job；workspace 多 crate 能用 Cargo 依赖关系保护这些边界。

---

## 7. 结构化中间产物

### 7.1 布局形态决策表

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层架构 | 否 | `L0-bus` 有公共协议、多个入口、worker / job、持久化和 adapter 边界，需要更强约束 | 不作为本轮目标布局 |
| workspace 多 crate 架构 | 是 | 符合公共契约复用、多运行入口、domain 纯净和长期平台化要求 | 使用 `crates/<role>`，用 Cargo 依赖关系约束边界 |

### 7.2 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| `crates/contracts` | library crate | 定义 Command、Query、Event、Job、View、Receipt、Error DTO | §4.1 / §7 / §12 |
| `crates/domain` | library crate | 定义领域对象、状态、策略、投影对象和领域错误 | §5 / §6 / §9 |
| `crates/application` | library crate | 定义 application service、port trait、事务边界和用例编排 | §4.2 / §8 |
| `crates/infra` | library crate | 实现 repository、store、transport backend、outbox publisher、config、runtime builder | §5.9 / §11 |
| `crates/api` | library + binary crate | 提供 command / feedback / recovery / query inbound API 入口 | §7 / §8 |
| `crates/worker` | library + binary crate | 提供常驻 outbox relay、delivery、backend signal、timeout、read output worker | §7 / §8 |
| `crates/jobs` | library + binary crate | 提供一次性 operations job binary | §7 / §8 |
| `tests` | integration tests | 跨 crate 验证 P0 闭环、边界和红线 | Step 16 / `05-测试方案.md` |
| `scripts` | shell scripts | 执行 gate、生成 reports、检查 artifacts 和脱敏 | `07-实施计划.md` |
| `artifacts` / `reports` | generated evidence / reviewed reports | 保存机器原始证据和人类可读报告 | `05-测试方案.md` / `06-验收标准.md` |

### 7.3 目录 / package / crate / binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `bus-contracts` | `bus_contracts` | 公共协议 DTO / event / view / error | 是 |
| `crates/domain` | library crate | `bus-domain` | `bus_domain` | 领域对象、状态、策略、不变量 | 否 |
| `crates/application` | library crate | `bus-application` | `bus_application` | 应用服务和 port trait | 否 |
| `crates/infra` | library crate | `bus-infra` | `bus_infra` | port 实现、config、runtime wiring | 否 |
| `crates/api` | library + binary | `bus-api` | `bus_api` / `bus-api` | API handler 和 API 进程入口 | 是 |
| `crates/worker` | library + binary | `bus-worker` | `bus_worker` / `bus-worker` | 常驻 worker 入口 | 是 |
| `crates/jobs` | library + binary | `bus-jobs` | `bus_jobs` / action binaries | 一次性 operations job | 是 |

### 7.4 文件布局树

```text
quantalithos-bus/
  Cargo.toml                         # workspace 定义、workspace dependencies、member 列表
  README.md                          # 实现仓入口说明
  crates/
    contracts/
      Cargo.toml                     # package bus-contracts, crate bus_contracts
      src/
        lib.rs                       # 导出 contracts 模块
        commands.rs                  # Command DTO: AcceptPublication 等
        queries.rs                   # Query DTO: GetDeliveryStatus 等
        events.rs                    # inbound / outbound event payload
        jobs.rs                      # Operations job request / result DTO
        views.rs                     # read-only view DTO
        receipts.rs                  # command / job receipt DTO
        errors.rs                    # protocol-level error DTO
    domain/
      Cargo.toml                     # package bus-domain, crate bus_domain
      src/
        lib.rs                       # 导出领域模块
        publication.rs               # publication material / acceptance / semantic / guard
        delivery.rs                  # delivery record / attempt / lifecycle
        feedback.rs                  # feedback result / idempotency / history
        recovery.rs                  # retry / DLQ / replay preparation / failure material
        read_output.rs               # audit / transport view / failure summary / read-only policy
        backend.rs                   # backend capability ref / policy
        errors.rs                    # domain error and invariant violation
    application/
      Cargo.toml                     # package bus-application, crate bus_application
      src/
        lib.rs                       # 导出 application services 和 ports
        publication_acceptance.rs    # publication acceptance use case
        delivery_progression.rs      # delivery progression use case
        feedback_recording.rs        # feedback and idempotency use case
        recovery_orchestration.rs    # retry / DLQ recovery use case
        replay_preparation.rs        # replay preparation use case
        read_output.rs               # projection and read-only output use case
        outbound_events.rs           # outbound event writing use case
        errors.rs                    # application error
        ports/
          mod.rs                     # 导出 port traits
          repositories.rs            # repository traits
          unit_of_work.rs            # transaction boundary trait
          transport_backend.rs       # backend delivery port
          outbox_fact_source.rs      # committed outbox fact source port
          outbox_publisher.rs        # outbound event publisher port
          clock.rs                   # clock port
          id_generator.rs            # id generator port
    infra/
      Cargo.toml                     # package bus-infra, crate bus_infra
      src/
        lib.rs                       # 导出 infra adapters
        config.rs                    # RuntimeConfig / ConfigLoader / ConfigValidator
        runtime_builder.rs           # wire services, repositories, adapters and jobs
        memory_store.rs              # in-memory default store
        repositories.rs              # repository adapter implementations
        transport_backend.rs         # in-memory / fake transport backend adapter
        outbox_fact_source.rs        # outbox fact source adapter
        outbox_publisher.rs          # outbound event publisher adapter
        projections.rs               # read projection adapter
        observability.rs             # log / metric / trace / audit markers
    api/
      Cargo.toml                     # package bus-api, crate bus_api, binary bus-api
      src/
        lib.rs                       # 导出 handler 和 mapping
        command_api.rs               # AcceptPublication / recovery command handlers
        feedback_api.rs              # RecordDeliveryFeedback handler
        recovery_api.rs              # retry / DLQ / replay operation handlers
        query_api.rs                 # read-only query handlers
        dto_mapping.rs               # external DTO to application command mapping
        bin/
          bus_api.rs                 # bus-api binary entry
    worker/
      Cargo.toml                     # package bus-worker, crate bus_worker, binary bus-worker
      src/
        lib.rs                       # 导出 worker runners
        outbox_relay_worker.rs       # committed outbox fact consumer loop
        delivery_worker.rs           # delivery progression loop
        backend_signal_worker.rs     # backend delivery signal consumer loop
        timeout_worker.rs            # timeout signal consumer loop
        read_output_worker.rs        # projection update loop
        bin/
          bus_worker.rs              # bus-worker binary entry
    jobs/
      Cargo.toml                     # package bus-jobs, crate bus_jobs, operation binaries
      src/
        lib.rs                       # 复用 job runner helpers
        bin/
          run_outbox_relay.rs        # one-shot outbox relay
          run_delivery_progression.rs # one-shot delivery progression
          run_retry_cycle.rs         # one-shot retry cycle
          rebuild_projection.rs      # one-shot projection rebuild
          check_backend_capability.rs # one-shot backend capability check
  tests/
    accept_publication_flow_tests.rs # publication acceptance integration tests
    delivery_feedback_flow_tests.rs  # delivery and feedback integration tests
    recovery_flow_tests.rs           # retry / DLQ / replay integration tests
    read_output_flow_tests.rs        # projection and query integration tests
    boundary_redaction_tests.rs      # forbidden body / secret boundary tests
  scripts/
    gates/
      run_ci_gate.sh                 # CI gate
      run_release_gate.sh            # release-like gate
    reports/
      generate_reports.sh            # artifacts -> reports
    checks/
      check_artifacts.sh             # artifact structure check
      check_redaction.sh             # secret / body redaction check
  artifacts/
    test/                            # generated raw evidence, gitignored by default
  reports/
    README.md                        # human-readable reports entry
    runs/                            # generated reviewed run reports
    acceptance/                      # acceptance handoff reports
    review/                          # review notes
```

### 7.5 文件职责表

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `Cargo.toml` | workspace | workspace members、workspace dependencies | 统一 Rust edition、member、`core-contracts` path dependency |
| `crates/contracts/src/commands.rs` | contracts | Command DTO | 定义 `AcceptPublication`、`RecordDeliveryFeedback`、`RequestRetry` 等输入 |
| `crates/contracts/src/queries.rs` | contracts | Query DTO | 定义只读查询 request / response |
| `crates/contracts/src/events.rs` | contracts | Event DTO | 定义 inbound / outbound event payload，不定义 core schema |
| `crates/contracts/src/jobs.rs` | contracts | Job DTO | 定义 operations job request / result |
| `crates/contracts/src/views.rs` | contracts | View DTO | 定义 transport view、failure summary、audit view |
| `crates/domain/src/publication.rs` | domain | publication 对象和策略 | 定义接入材料、接入事实、传递语义和 payload guard |
| `crates/domain/src/delivery.rs` | domain | delivery 对象和状态规则 | 定义 delivery record、attempt、lifecycle |
| `crates/domain/src/feedback.rs` | domain | feedback / idempotency / history | 定义反馈结果、幂等锚点和历史条目 |
| `crates/domain/src/recovery.rs` | domain | recovery 对象和策略 | 定义 retry、DLQ、replay preparation、failure material |
| `crates/domain/src/read_output.rs` | domain | audit / projection / read policy | 定义审计记录、只读投影和只读策略 |
| `crates/domain/src/backend.rs` | domain | backend capability 引用和策略 | 隔离后端能力和平台传递语义 |
| `crates/application/src/publication_acceptance.rs` | application | application service | 编排发布接入事务和端口调用 |
| `crates/application/src/delivery_progression.rs` | application | application service | 编排 delivery 形成、派发和状态推进 |
| `crates/application/src/feedback_recording.rs` | application | application service | 编排反馈、幂等判断和 history append |
| `crates/application/src/recovery_orchestration.rs` | application | application service | 编排 retry / DLQ 恢复路径 |
| `crates/application/src/replay_preparation.rs` | application | application service | 编排 replay preparation |
| `crates/application/src/read_output.rs` | application | application service | 编排 projection 更新和 query read model |
| `crates/application/src/ports/repositories.rs` | application ports | repository traits | 定义 publication / delivery / recovery / audit / projection repositories |
| `crates/application/src/ports/transport_backend.rs` | application ports | backend port trait | 定义后端传输能力边界 |
| `crates/infra/src/config.rs` | infra | RuntimeConfig / loader / validator | 承接配置实现契约 |
| `crates/infra/src/runtime_builder.rs` | infra | Runtime builder | 组装 service、repository、adapter、worker、job |
| `crates/infra/src/memory_store.rs` | infra | in-memory default store | 提供 P0 默认可验证路径 |
| `crates/api/src/command_api.rs` | api | command handler | 把外部 command 转入 application service |
| `crates/api/src/query_api.rs` | api | query handler | 提供只读查询入口 |
| `crates/worker/src/outbox_relay_worker.rs` | worker | worker runner | 消费 committed outbox fact |
| `crates/worker/src/delivery_worker.rs` | worker | worker runner | 推进 delivery |
| `crates/jobs/src/bin/rebuild_projection.rs` | jobs | job binary | 触发 projection rebuild |
| `tests/recovery_flow_tests.rs` | tests | integration test | 验证 retry / DLQ / replay 闭环 |
| `scripts/gates/run_release_gate.sh` | scripts | gate script | 运行 release-like gate 并输出 artifacts |
| `scripts/reports/generate_reports.sh` | scripts | report script | 从 artifacts 生成 reports |

### 7.6 命名检查表

| 检查项 | 通过条件 | 结果 |
|---|---|---|
| project slug | 使用 `bus` | 通过 |
| 实现仓目录 | `/home/aris/Projects/quantalithos-bus` | 通过 |
| workspace member | 使用 `crates/<role>` | 通过 |
| Cargo package | 使用 `bus-<role>` | 通过 |
| Rust library crate | 使用 `bus_<role>` | 通过 |
| binary | 使用 `bus-api`、`bus-worker` 或具体动作名 | 通过 |
| 架构层级泄漏 | 不出现 `L0` / `l0_` / `L1` / `l1_` | 通过 |
| 仓内目录重复项目前缀 | 不写 `crates/bus_domain`、`crates/l0_bus_domain` | 通过 |
| 文件名 | 使用 `snake_case.rs`，不使用 `utils.rs` / `helper.rs` | 通过 |
| reports / artifacts | 不写 `reports/<project>` 或 `artifacts/test/<project>/<run_id>` | 通过 |

### 7.7 跨仓 path dependency 表

| 依赖仓库 | 全局依赖类型 | Cargo.toml 位置 | path dependency 写法 | 说明 |
|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `quantalithos-bus/Cargo.toml` 的 `[workspace.dependencies]` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | 当前只确认依赖 core 共享契约 |

### 7.8 运行期 / 事件协作依赖禁止进入 Cargo 表

| 依赖 | 类型 | 禁止原因 | 正确落点 |
|---|---|---|---|
| MQ backend | 运行期依赖 | 具体产品未定，且不应污染 domain / application | `TransportBackendPort`、infra adapter、config |
| Bus store / persistence | 运行期依赖 | store 产品未定 | repository port、memory store、Step 11 |
| 发布方仓 | 事件协作依赖 | 发布方拥有业务事实和 payload truth | contracts event / outbox fact reference |
| 订阅方仓 | 事件协作依赖 | 订阅方拥有业务处理和业务幂等 | delivery target ref / feedback contract |
| `L0-sdk` / observability / governance | 只读消费 / 事件协作 | 下游消费 bus，不反向成为 bus 编译依赖 | query view / projection / outbound event |

---

## 8. 回填草稿

正式 `03-详细设计.md` 的 §4 应从本文件摘录并收敛为以下结构：

```md
## 4. 实现单元与文件布局

### 4.1 布局形态决策

从 `design-calibration/03_ddd_step_04_units_file_layout.md` §7.1 摘录。

### 4.2 实现单元总表

从 `design-calibration/03_ddd_step_04_units_file_layout.md` §7.2 摘录。

### 4.3 目录 / package / crate / binary 映射

从 `design-calibration/03_ddd_step_04_units_file_layout.md` §7.3 摘录。

### 4.4 文件布局树

从 `design-calibration/03_ddd_step_04_units_file_layout.md` §7.4 摘录。

### 4.5 文件职责表

从 `design-calibration/03_ddd_step_04_units_file_layout.md` §7.5 摘录。

### 4.6 命名与跨仓依赖检查

从 `design-calibration/03_ddd_step_04_units_file_layout.md` §7.6~§7.8 摘录。
```

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| API 入口是否立即选择 HTTP 框架 | A. Step 4 锁定；B. 只保留 `api` crate 和 handler，框架由 Step 8 / Step 14 决定；C. 不提供 API binary | 推荐 B | 本步只定文件布局，handler 可以先稳定，具体 HTTP / RPC 适配不应提前写死 |
| 是否创建 `crates/ops` | A. P0 创建；B. 暂不创建，operations 通过 `api` 和 `jobs` 承接；C. 用 `cli` 替代 | 推荐 B | 当前 P0 已有 recovery API 和 job binary，额外 ops crate 会增加空壳 |
| 是否创建生产 MQ adapter 文件 | A. 立即创建 `nats_adapter.rs` / `kafka_adapter.rs`；B. 只创建 `transport_backend.rs` 和 in-memory / fake adapter；C. 不做 backend adapter | 推荐 B | 生产 MQ 未定，P0 需要默认可验证路径 |
| 是否依赖 `core-domain` | A. 依赖；B. 暂只依赖 `core-contracts`；C. 复制 core 类型 | 推荐 B | 当前只确认共享契约依赖，扩大依赖需 Step 7 证明 |

---

## 10. 进入下一步条件

```text
实现者可以根据本步产出创建 /home/aris/Projects/quantalithos-bus 的 workspace 目录和 P0 文件。
实现单元、package、crate、binary、scripts、reports、artifacts 和 core path dependency 已经明确。
可以进入 Step 5,继续定义模块实现契约主轴。
```
