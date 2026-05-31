# Step 4. 收稳实现单元与文件布局

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 4
- 回填章节：`projects/L0-sdk/03-详细设计.md` §4 实现单元与文件布局

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_02_scope.md` | P0 official client access 闭环、P1 后移能力和实现者可完成代码范围 | 限定本步只创建 P0 必需实现单元 |
| `03_ddd_step_03_coding_runtime_constraints.md` | Rust 契约、三语言产物、本地 sibling repo、path dependency、安全和源码语言约束 | 决定 workspace、语言包目录和依赖边界 |
| `projects/L0-sdk/02-概要设计.md` §4 / §5 / §12 | 代码主体框架、七个主要组成部分和详细设计承接清单 | 把概要主体落成 crate / package / file |
| `standards/document/详细设计书写规范.md` §5.4 | 布局形态、实现单元、目录映射、文件树和文件职责输出格式 | 作为本步输出格式 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓、workspace member、package、crate、binary、scripts、artifacts、reports 规则 | 作为命名和目录约束 |
| `/home/aris/Projects/quantalithos-core` | 已存在 sibling repo，`crates/contracts` 提供 `core-contracts` | 作为 core path dependency 真实路径来源 |
| `/home/aris/Projects/quantalithos-bus` | 已存在 sibling repo，`crates/contracts` 提供 `bus-contracts` | 作为 bus path dependency 真实路径来源 |

已确认结论：

```text
目标实现仓路径: /home/aris/Projects/quantalithos-sdk
project slug: sdk
布局形态: workspace 多 crate 架构 + 三语言 package 产物目录
当前 /home/aris/Projects/quantalithos-sdk 尚未发现,实施计划应要求创建或确认。
P0 编译期依赖只确认 core-contracts 和 bus-contracts。
```

依赖的前序 Step：

```text
Step 2 已确认本轮范围。
Step 3 已确认 Rust、三语言产物、本地依赖和安全边界。
```

---

## 3. SOP 问题回答

### 3.1 本轮实现包含哪些 crate / package / binary / library？

回答：

本轮采用 Rust workspace 多 crate 架构，同时在仓内保留 Python / TypeScript 官方语言包目录。Rust workspace 负责 SDK 本地 truth、policy、port、adapter、runner、builder、candidate 和 evidence；语言包目录负责三语言官方产物源码或模板，不拥有上游 truth。

| 类型 | 实现单元 | 说明 |
|---|---|---|
| library crate | `crates/contracts` | SDK 自身 Command、Query、Event、Job、View、Receipt、Error、上下文 DTO |
| library crate | `crates/domain` | SDK 本地领域对象、状态、策略、不变量 |
| library crate | `crates/application` | application service、port trait、用例编排、事务边界 |
| library crate | `crates/infra` | repository、source adapter、boundary adapter、runner、builder、config、runtime wiring |
| library crate | `crates/client` | Rust developer-facing SDK client facade，不是 server gateway |
| binary crate | `crates/cli` | 维护命令入口，用于本地刷新、查询、候选生成和验证触发 |
| library + binary crate | `crates/jobs` | 一次性 operations job binary 和 job runner helper |
| language package | `packages/python` | Python 官方 SDK 包源码 / 模板 |
| language package | `packages/typescript` | TypeScript 官方 SDK 包源码 / 模板 |
| support | `examples/`、`tests/`、`scripts/`、`artifacts/`、`reports/` | 示例、集成测试、门禁脚本、原始证据和可读报告 |

不在本轮必建的实现单元：

| 实现单元 | 不纳入原因 | 后续处理 |
|---|---|---|
| `crates/api` online server | SDK 不是服务端 gateway 或 HTTP API 服务 | 若未来需要服务端 facade，先回退需求 / 架构 |
| `crates/worker` 常驻 worker | P0 使用一次性 operations job 和 runner，不要求 SDK 常驻进程 | 若未来需要 daemon，再进入后续设计 |
| `crates/registry` / `crates/publisher` | public registry 发布不是 P0 前置 | 保留 artifact ref 和 local stable baseline |
| 全量 L1/L2/L3/L4 service client crate | 服务覆盖顺序未在 P0 收稳 | 通过 formal API boundary 和 service capability view 扩展 |

### 3.2 每个实现单元对应概要设计中的哪个代码主体？

回答：

| 实现单元 | 对应概要设计代码主体 |
|---|---|
| `contracts` | Command API、Query API、Inbound Event Consumer、Outbound Event、Operations Job 的协议骨架 |
| `domain` | `SdkSemanticBaseline`、`DerivedBindingView`、`ServiceClientView`、`BusEventClientView`、policy、candidate、evidence、compatibility、deprecated 状态 |
| `application` | `SdkSemanticBaselineService`、`ContractConsumptionService`、`ServiceClientAssemblyService`、`EventClientAssemblyService`、`PackageCandidateService`、`CandidateValidationService`、`CompatibilityGovernanceService` |
| `infra` | core / bus source adapter、formal / fake boundary adapter、bus boundary adapter、generator、package builder、runner、repository、projection、artifact store |
| `client` | `SdkClientEntry`、`ServiceClientEntry`、`EventClientEntry`、`CapabilityQueryEntry` 的 Rust facade |
| `cli` | 维护入口和本地操作入口，不承载领域真相 |
| `jobs` | `CheckUpstreamFreshness`、`GeneratePackageCandidate`、`BuildLanguagePackages`、`RunCrossLanguageSmoke`、`ValidateDocsExamples`、`CheckCompatibility`、`VerifyBoundaryPolicies`、`RebuildSdkProjections` |
| `packages/python` / `packages/typescript` | 三语言 developer-facing package 产物，不替代 SDK 本地 truth |

### 3.3 文件路径应该如何组织，才能体现模块边界？

回答：

文件路径按实现职责组织，而不是按 Rust / Python / TypeScript 三语言先切主体。跨 crate 依赖方向应保持：

```text
client / cli / jobs
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
 core-contracts / bus-contracts

packages/python and packages/typescript
        |
        v
 generated or curated SDK package surface
        |
        v
 must align with domain baseline and candidate evidence
```

关键说明：

- `domain` 不依赖 `infra`、`client`、`cli`、`jobs`、Python、TypeScript、HTTP、DB、bus runtime 或 public registry。
- `application` 定义 port trait 和用例编排，依赖 `domain` 与 `contracts`，不依赖具体 adapter。
- `infra` 实现 ports，并注入 core / bus source、formal / fake boundary、runner、builder、repository 和 config。
- `client` 是 Rust SDK facade，不是 server gateway；`packages/python` / `packages/typescript` 是语言包产物目录，不拥有 SDK truth。
- `jobs` 执行维护、生成、验证和投影重建；Query 和 projection rebuild 不改写真相。

### 3.4 哪些文件必须创建，哪些文件只是后续可能扩展？

回答：

| 类别 | 本轮必须创建 | 后续可能扩展 |
|---|---|---|
| workspace | 根 `Cargo.toml`、`README.md`、各 member `Cargo.toml`、各 `src/lib.rs` | workspace lint、release profile、publish metadata |
| Rust crates | `contracts`、`domain`、`application`、`infra`、`client`、`cli`、`jobs` | 专项 service crate、daemon worker、registry publisher |
| language packages | `packages/python`、`packages/typescript` 的最小包结构 | 完整生态发布脚本、文档站点、插件式生成器 |
| examples | Rust / Python / TypeScript quickstart 示例 | 更多产品场景示例 |
| tests | P0 主链、边界、状态和跨语言 smoke 集成测试 | 性能、包体积、全量 endpoint matrix |
| scripts | gate、report、artifact、redaction、language package layout 检查脚本 | release automation |
| artifacts / reports | `artifacts/test/`、`reports/` 标准目录 | 外部报告发布或长期归档 |

### 3.5 每个文件负责定义哪些对象、trait、handler、repository 或测试？

回答：

本步在 §7.5 文件职责表中给出 P0 文件责任。对象字段、成员函数和 enum variant 由 Step 6 展开；trait / port / adapter 方法由 Step 7 展开；Command / Query / Event / Job schema 由 Step 8 展开；逐接口处理流由 Step 9 展开。

### 3.6 当前仓的 project slug 是什么？

回答：`sdk`。

### 3.7 workspace member 目录是否使用 `crates/<role>`？

回答：是。使用 `crates/contracts`、`crates/domain`、`crates/application`、`crates/infra`、`crates/client`、`crates/cli`、`crates/jobs`。

### 3.8 Cargo package 是否使用 `<project>-<role>`？

回答：是。使用 `sdk-contracts`、`sdk-domain`、`sdk-application`、`sdk-infra`、`sdk-client`、`sdk-cli`、`sdk-jobs`。

### 3.9 Rust library crate 是否使用 `<project>_<role>`？

回答：是。使用 `sdk_contracts`、`sdk_domain`、`sdk_application`、`sdk_infra`、`sdk_client`、`sdk_cli`、`sdk_jobs`。

### 3.10 binary 名是否表达用户入口或具体动作？

回答：是。

| package | binary | 说明 |
|---|---|---|
| `sdk-cli` | `sdk` | 本地维护命令入口 |
| `sdk-jobs` | `check_upstream_freshness` | 检查 core / bus / formal API freshness |
| `sdk-jobs` | `generate_package_candidate` | 生成本地 package candidate |
| `sdk-jobs` | `build_language_packages` | 构建 Rust / Python / TypeScript package artifacts |
| `sdk-jobs` | `run_cross_language_smoke` | 运行三语言 smoke |
| `sdk-jobs` | `validate_docs_examples` | 验证 docs / examples |
| `sdk-jobs` | `check_compatibility` | 执行兼容检查 |
| `sdk-jobs` | `verify_boundary_policies` | 验证 redaction / credential / fake boundary |
| `sdk-jobs` | `rebuild_sdk_projections` | 重建只读 projection |

### 3.11 是否有 `L0` / `L1` / `l0_` / `l1_` 等架构层级泄漏进代码命名？

回答：没有。计划实现仓是 `quantalithos-sdk`，仓内 package 使用 `sdk-<role>`，crate 使用 `sdk_<role>`，不使用 `l0_sdk`、`L0Sdk`、`crates/sdk_domain` 或 `crates/l0_sdk_domain`。

### 3.12 如果本仓存在已确认的编译期依赖，Cargo path dependency 应写在哪个 `Cargo.toml`，使用哪个真实 crate 路径？

回答：

`core-contracts` 和 `bus-contracts` 应写在根 `Cargo.toml` 的 `[workspace.dependencies]` 中，由需要它们的 member 使用 `workspace = true`。

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
bus-contracts = { path = "../quantalithos-bus/crates/contracts" }
```

路径来自已检查的真实 sibling repo：

```text
/home/aris/Projects/quantalithos-core/crates/contracts
/home/aris/Projects/quantalithos-bus/crates/contracts
```

### 3.13 哪些运行期依赖或事件协作依赖只能在 adapter / event / projection 章节表达，不能进入文件布局的 Cargo 依赖？

回答：

| 关系 | 类型 | 正确落点 |
|---|---|---|
| formal API / service endpoint | 运行期依赖 | `FormalApiBoundaryPort`、infra adapter、Step 14 config |
| fake / fixture endpoint | 运行期验证依赖 | `FakeFixtureEndpointPort`、validation config、test fixtures |
| bus runtime / broker | 运行期依赖 | `BusBoundaryPort`、event client adapter、config |
| identity / governance / gateway | 外部安全或治理依赖 | actor / credential ref / context pass-through |
| UI / runtime / product repos | 下游消费方 | package surface、query view、docs examples |
| public registry | 后续发布运营依赖 | artifact ref、candidate status、implementation handoff |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` | 仍以 `src/api`、`application/codegen_service.rs`、`domain/client`、`release_service.rs` 等单 crate 旧布局组织 | 无法承接新版 semantic baseline、derived view、candidate evidence 和 compatibility 主线 |
| 旧版 `03-详细设计.md` | 把 binding、wrapper、subscription、release manifest 作为主结构 | 容易把 SDK 写成 binding-only 或 public release 仓 |
| 旧版 `03-详细设计.md` | 未按 workspace / package / crate / binary 输出映射 | 实现者无法直接创建目标仓 |
| 旧版 `03-详细设计.md` | 未明确 `core-contracts` 与 `bus-contracts` 的真实 path dependency | 实现阶段可能凭空扩大依赖 |
| 当前实现环境 | `/home/aris/Projects/quantalithos-sdk` 尚未发现 | Step 4 必须给出计划目录，由实施计划要求创建或确认 |
| 三语言产物 | 容易把三语言目录当成三个 truth | 需要明确 Rust workspace 承载 truth，语言包只承载官方 package surface |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 布局形态 | 旧文偏单 crate `src/*` | workspace 多 crate + 三语言 package 目录 | SDK 有公共 facade、candidate / evidence、runner / builder 和多语言产物 |
| 主体拆分 | binding / wrapper / subscription / release | contracts / domain / application / infra / client / cli / jobs / packages | 对齐新版官方客户端语义核心和验证闭环 |
| Rust SDK surface | 混在 `api` 或 `client_service` 中 | 独立 `crates/client` 作为 Rust developer-facing facade | 避免误解为 server API，同时给 Rust SDK 明确发布单元 |
| Python / TypeScript | 未稳定目录 | `packages/python`、`packages/typescript` | 明确语言包产物位置，但不让其拥有 truth |
| 编译期依赖 | 未明确 | 只使用 `core-contracts`、`bus-contracts` path dependency | 防止依赖服务仓、gateway 或 runtime |
| 运行入口 | 旧文偏 release service | `sdk` CLI + action job binaries | P0 需要本地维护、生成、验证和投影重建入口 |
| reports / artifacts / scripts | 旧文未统一 | 遵守标准目录，不带 `<project>` 层 | 支撑测试、验收和实施证据 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：单 crate 模块分层架构 | 起步文件少 | 无法强制区分 domain、infra、client facade、jobs 和公共 contracts；三语言产物容易混入 truth | 不采用 |
| 方案 B：workspace 多 crate + `packages/python` / `packages/typescript` | 用 Cargo 强制 Rust 边界，同时明确三语言包产物位置 | 初始结构更重，需要实施计划控制纵切开发 | 采用 |
| 方案 C：按 Rust / Python / TypeScript 三个语言目录作为顶层主体 | 语言产物直观 | 会把同一平台语义拆成三套 truth，违背 CrossLanguageConceptMap | 不采用 |
| 方案 D：只保留生成产物目录，不保留语言包源码 / 模板 | 结构更轻 | 无法让 smoke、docs example 和 candidate evidence 稳定引用语言包 surface | 不采用 |

推荐方案：方案 B。

原因：

- `L0-sdk` 同时是官方客户端接入层和本地维护 / 验证闭环，只有 workspace 能强制领域、应用、适配器和入口边界。
- 三语言包必须存在可引用的 package surface，但 SDK truth 仍应由 Rust domain / application / evidence 主线维护。
- P0 不做 public registry 发布，目录只需支撑本地 candidate、artifact、smoke、docs validation 和 compatibility。

---

## 7. 结构化中间产物

### 7.1 布局形态决策表

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层架构 | 否 | SDK 同时需要公共 Rust facade、domain truth、adapter、runner、builder、job 和 evidence 边界 | 不作为本轮目标布局 |
| workspace 多 crate 架构 | 是 | 符合公共契约复用、多运行入口、domain 纯净、infra 较重和长期平台化要求 | 使用 `crates/<role>`，用 Cargo 依赖关系约束 Rust 边界 |
| 按语言顶层目录组织 | 否 | Rust / Python / TypeScript 目录不能各自拥有平台语义 truth | 仅作为 `packages/` 产物目录保留 |

### 7.2 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| `crates/contracts` | library crate | 定义 SDK Command、Query、Event、Job、View、Receipt、Error 和 context DTO | §7 / §12 |
| `crates/domain` | library crate | 定义 semantic baseline、derived view、service / event view、policy、candidate、evidence、compatibility、deprecated 对象与状态 | §5 / §6 / §9 |
| `crates/application` | library crate | 定义 application service、port trait、用例编排、事务边界和 outbox 写入边界 | §4.2 / §7 / §8 |
| `crates/infra` | library crate | 实现 repository、source adapter、boundary adapter、generator、package builder、runner、artifact store、config、projection | §5.2~§5.7 / §11 |
| `crates/client` | library crate | 提供 Rust developer-facing SDK facade、service client、event client 和 capability query entry | §5.3 / §5.4 / §7 |
| `crates/cli` | binary crate | 提供本地维护入口，触发 refresh、candidate、query、validation 和 reports | §8 / §11 |
| `crates/jobs` | library + binary crate | 提供一次性 operations job binary | §7.4 / §8 |
| `packages/python` | Python package | 承载 Python 官方 SDK package surface 和 smoke / docs example 可引用源码 | §5.6 / §7 / §8 |
| `packages/typescript` | TypeScript package | 承载 TypeScript 官方 SDK package surface 和 smoke / docs example 可引用源码 | §5.6 / §7 / §8 |
| `tests` | integration tests | 跨 crate 验证 P0 闭环、状态、边界和三语言 smoke | Step 16 / `05-测试方案.md` |
| `scripts` | shell scripts | 执行 gate、生成 reports、检查 artifacts、redaction 和语言包布局 | `07-实施计划.md` |
| `artifacts` / `reports` | generated evidence / reviewed reports | 保存机器原始证据和人类可读报告 | `05-测试方案.md` / `06-验收标准.md` |

### 7.3 目录 / package / crate / binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `sdk-contracts` | `sdk_contracts` | SDK 公共协议 DTO / event / view / error | 是 |
| `crates/domain` | library crate | `sdk-domain` | `sdk_domain` | SDK 本地 truth、状态、策略、不变量 | 否 |
| `crates/application` | library crate | `sdk-application` | `sdk_application` | 应用服务和 port trait | 否 |
| `crates/infra` | library crate | `sdk-infra` | `sdk_infra` | port 实现、config、runtime wiring | 否 |
| `crates/client` | library crate | `sdk-client` | `sdk_client` | Rust SDK developer-facing facade | 是 |
| `crates/cli` | binary crate | `sdk-cli` | `sdk_cli` / `sdk` | 本地维护命令入口 | 是 |
| `crates/jobs` | library + binary | `sdk-jobs` | `sdk_jobs` / action binaries | 一次性 operations job | 是 |
| `packages/python` | Python package | 不适用 | 不适用 | Python SDK package surface | 是 |
| `packages/typescript` | TypeScript package | 不适用 | 不适用 | TypeScript SDK package surface | 是 |

### 7.4 文件布局树

```text
quantalithos-sdk/
  Cargo.toml                              # workspace 定义、workspace dependencies、member 列表
  README.md                               # 实现仓入口说明
  crates/
    contracts/
      Cargo.toml                          # package sdk-contracts, crate sdk_contracts
      src/
        lib.rs                            # 导出 contracts public API
        metadata.rs                       # ActorContext / ClientCallContext / CommandMetadata / JobMetadata
        commands.rs                       # Command DTO
        queries.rs                        # Query DTO
        events.rs                         # inbound / outbound event payload
        jobs.rs                           # Operations job request / result DTO
        views.rs                          # read-only view DTO
        receipts.rs                       # command / job receipt DTO
        errors.rs                         # protocol-level error DTO
    domain/
      Cargo.toml                          # package sdk-domain, crate sdk_domain
      src/
        lib.rs                            # 导出 domain public API
        semantic.rs                       # SdkSemanticBaseline / ClientCapabilityModel / CrossLanguageConceptMap
        upstream_view.rs                  # DerivedBindingView / LanguageBindingView / UpstreamVersionRef / freshness
        service_client.rs                 # ServiceClientView / ServiceCapabilityRef / capability support
        event_client.rs                   # BusEventClientView / EventSemanticMapping
        boundary_policy.rs                # error / trace / redaction / credential / boundary guard policies
        package_candidate.rs              # PackageCandidate / language artifacts / candidate status
        evidence.rs                       # VerificationEvidence / redaction marker / evidence ref
        compatibility.rs                  # CompatibilityDecision / CompatibilityPolicy
        deprecated.rs                     # DeprecatedApiRecord / MigrationGuideRef
        errors.rs                         # domain error and invariant violation
    application/
      Cargo.toml                          # package sdk-application, crate sdk_application
      src/
        lib.rs                            # 导出 application services 和 ports
        semantic_baseline_service.rs      # UpdateSdkSemanticBaseline use case
        contract_consumption_service.rs   # RefreshDerivedBindingView / upstream changed use case
        service_client_assembly.rs        # InvokeServiceCapability use case
        event_client_assembly.rs          # PublishBusEvent / OpenEventSubscription use case
        package_candidate_service.rs      # GeneratePackageCandidate / BuildLanguagePackages use case
        candidate_validation_service.rs   # smoke / docs / boundary evidence use case
        compatibility_governance.rs       # compatibility and deprecated use case
        query_service.rs                  # read-only query use case
        outbound_events.rs                # outbound event writing use case
        errors.rs                         # application error
        ports/
          mod.rs                          # 导出 port traits
          repositories.rs                 # repository traits
          unit_of_work.rs                 # transaction boundary trait
          source_ports.rs                 # core / bus / formal API source ports
          boundary_ports.rs               # formal / fake / bus boundary ports
          generator_ports.rs              # language binding generator and package builder ports
          runner_ports.rs                 # smoke / docs / compatibility / boundary runner ports
          artifact_ports.rs               # package artifact and evidence artifact store ports
          outbox_publisher.rs             # outbound event publisher port
          clock.rs                        # clock port
          id_generator.rs                 # id generator port
    infra/
      Cargo.toml                          # package sdk-infra, crate sdk_infra
      src/
        lib.rs                            # 导出 infra adapters
        config.rs                         # RuntimeConfig / ConfigLoader / ConfigValidator
        runtime_builder.rs                # wire services, repositories, adapters, client, jobs
        memory_store.rs                   # in-memory default store
        repositories.rs                   # repository adapter implementations
        core_contract_source.rs           # core-contracts snapshot source adapter
        bus_semantic_source.rs            # bus-contracts semantic source adapter
        formal_api_boundary.rs            # formal API boundary adapter
        fake_fixture_endpoint.rs          # fake / fixture endpoint adapter
        bus_boundary.rs                   # bus publish / subscribe boundary adapter
        language_binding_generator.rs     # language binding generator adapter
        package_builder.rs                # Rust / Python / TypeScript package builder adapter
        runner_adapters.rs                # smoke / docs / compatibility / boundary runners
        artifact_store.rs                 # package artifact and evidence artifact store
        projections.rs                    # read projection adapter
        outbox_publisher.rs               # outbound event publisher adapter
        observability.rs                  # log / metric / trace / audit markers
    client/
      Cargo.toml                          # package sdk-client, crate sdk_client
      src/
        lib.rs                            # 导出 Rust SDK public API
        sdk_client.rs                     # SdkClientEntry facade
        service_client.rs                 # ServiceClientEntry facade
        event_client.rs                   # EventClientEntry facade
        capability_queries.rs             # CapabilityQueryEntry facade
        context.rs                        # client context builder and credential refs
        errors.rs                         # Rust SDK public error mapping
        mapping.rs                        # public DTO to contracts mapping
    cli/
      Cargo.toml                          # package sdk-cli, binary sdk
      src/
        lib.rs                            # 复用 CLI command helpers
        commands.rs                       # CLI command definitions
        bin/
          sdk.rs                          # sdk binary entry
    jobs/
      Cargo.toml                          # package sdk-jobs, crate sdk_jobs, operation binaries
      src/
        lib.rs                            # 复用 job runner helpers
        bin/
          check_upstream_freshness.rs     # one-shot freshness check
          generate_package_candidate.rs   # one-shot candidate generation
          build_language_packages.rs      # one-shot language package build
          run_cross_language_smoke.rs     # one-shot smoke run
          validate_docs_examples.rs       # one-shot docs example validation
          check_compatibility.rs          # one-shot compatibility check
          verify_boundary_policies.rs     # one-shot boundary policy verification
          rebuild_sdk_projections.rs      # one-shot projection rebuild
  packages/
    python/
      pyproject.toml                      # Python package metadata
      src/quantalithos_sdk/
        __init__.py                       # Python package public exports
        client.py                         # Python SDK client facade
        service_client.py                 # Python service client facade
        event_client.py                   # Python event client facade
        errors.py                         # Python error mapping
        context.py                        # Python call context / credential refs
        py.typed                          # typing marker
    typescript/
      package.json                        # TypeScript package metadata
      tsconfig.json                       # TypeScript compiler config
      src/
        index.ts                          # TypeScript package public exports
        client.ts                         # TypeScript SDK client facade
        serviceClient.ts                  # TypeScript service client facade
        eventClient.ts                    # TypeScript event client facade
        errors.ts                         # TypeScript error mapping
        context.ts                        # TypeScript call context / credential refs
  examples/
    rust/                                 # Rust quickstart and docs example sources
    python/                               # Python quickstart and docs example sources
    typescript/                           # TypeScript quickstart and docs example sources
  tests/
    semantic_baseline_flow_tests.rs       # semantic baseline integration tests
    derived_view_freshness_tests.rs       # upstream freshness and derived view tests
    service_boundary_flow_tests.rs        # formal / fake service boundary tests
    event_client_boundary_tests.rs        # bus event client boundary tests
    package_candidate_evidence_tests.rs   # candidate / package / evidence tests
    compatibility_deprecated_tests.rs     # compatibility and deprecated tests
    cross_language_smoke_tests.rs         # Rust / Python / TypeScript smoke tests
    boundary_redaction_tests.rs           # forbidden body / secret / fake success tests
  scripts/
    gates/
      run_ci_gate.sh                      # CI gate
      run_acceptance_gate.sh              # acceptance-like gate
    reports/
      generate_reports.sh                 # artifacts -> reports
    checks/
      check_artifacts.sh                  # artifact structure check
      check_redaction.sh                  # secret / body redaction check
      check_language_package_layout.sh    # Python / TypeScript package layout check
  artifacts/
    test/                                 # generated raw evidence, gitignored by default
  reports/
    README.md                             # human-readable reports entry
    runs/                                 # generated reviewed run reports
    acceptance/                           # acceptance handoff reports
    review/                               # review notes
```

### 7.5 文件职责表

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `Cargo.toml` | workspace | workspace members、workspace dependencies | 统一 Rust edition、member、`core-contracts` / `bus-contracts` path dependency |
| `crates/contracts/src/commands.rs` | contracts | Command DTO | 定义 SDK 本地写命令输入 |
| `crates/contracts/src/queries.rs` | contracts | Query DTO | 定义只读查询 request / response |
| `crates/contracts/src/events.rs` | contracts | Event DTO | 定义 inbound / outbound SDK 维护事实 event |
| `crates/contracts/src/jobs.rs` | contracts | Job DTO | 定义 operations job request / result |
| `crates/domain/src/semantic.rs` | domain | semantic baseline 对象 | 定义共同语义、能力模型和跨语言概念映射 |
| `crates/domain/src/upstream_view.rs` | domain | upstream view 对象和 freshness 状态 | 定义派生视图、语言视图、版本引用和 freshness |
| `crates/domain/src/service_client.rs` | domain | service client view | 定义 formal API / fake boundary 可暴露能力 |
| `crates/domain/src/event_client.rs` | domain | event client view | 定义 bus event client view 和 semantic mapping |
| `crates/domain/src/boundary_policy.rs` | domain | 横切 policy 和 guard | 定义 error、trace、redaction、credential 和 fake boundary 底线 |
| `crates/domain/src/package_candidate.rs` | domain | candidate 对象和状态 | 定义 candidate、language artifact 和 stable gate |
| `crates/domain/src/evidence.rs` | domain | evidence 对象 | 定义验证结果、redaction marker 和 artifact ref |
| `crates/domain/src/compatibility.rs` | domain | compatibility decision | 定义兼容判断和迁移门禁 |
| `crates/domain/src/deprecated.rs` | domain | deprecated record | 定义 deprecated lifecycle 和 migration guide ref |
| `crates/application/src/contract_consumption_service.rs` | application | application service | 编排上游 snapshot 消费、derived view 和 freshness |
| `crates/application/src/service_client_assembly.rs` | application | application service | 编排 service capability call/read 和 boundary guard |
| `crates/application/src/event_client_assembly.rs` | application | application service | 编排 bus publish / subscription view |
| `crates/application/src/package_candidate_service.rs` | application | application service | 编排 candidate 和 language package build |
| `crates/application/src/candidate_validation_service.rs` | application | application service | 编排 smoke、docs、boundary evidence |
| `crates/application/src/ports/source_ports.rs` | application ports | source port traits | 定义 core / bus / formal API source 边界 |
| `crates/application/src/ports/boundary_ports.rs` | application ports | boundary port traits | 定义 formal / fake / bus runtime 边界 |
| `crates/application/src/ports/runner_ports.rs` | application ports | runner port traits | 定义 smoke、docs、compatibility、boundary verification runner |
| `crates/infra/src/config.rs` | infra | RuntimeConfig / loader / validator | 承接配置实现契约 |
| `crates/infra/src/runtime_builder.rs` | infra | runtime builder | 组装 service、repository、adapter、client、job |
| `crates/infra/src/memory_store.rs` | infra | in-memory default store | 提供 P0 默认可验证路径 |
| `crates/infra/src/package_builder.rs` | infra | package builder adapter | 构建 Rust / Python / TypeScript package artifact |
| `crates/client/src/sdk_client.rs` | client | Rust facade | 暴露 Rust SDK client 入口 |
| `crates/client/src/service_client.rs` | client | Rust facade | 暴露 service capability call/read 入口 |
| `crates/client/src/event_client.rs` | client | Rust facade | 暴露 bus event publish / subscription 入口 |
| `crates/jobs/src/bin/run_cross_language_smoke.rs` | jobs | job binary | 运行三语言 smoke 并生成 evidence |
| `packages/python/src/quantalithos_sdk/client.py` | Python package | Python facade | 暴露 Python SDK client 入口 |
| `packages/typescript/src/client.ts` | TypeScript package | TypeScript facade | 暴露 TypeScript SDK client 入口 |
| `tests/cross_language_smoke_tests.rs` | tests | integration test | 验证三语言 package surface 的语义一致 |
| `scripts/reports/generate_reports.sh` | scripts | report script | 从 `artifacts/test/<run_id>/` 生成 `reports/` |

### 7.6 命名检查表

| 检查项 | 通过条件 | 结果 |
|---|---|---|
| project slug | 使用 `sdk` | 通过 |
| 实现仓目录 | `/home/aris/Projects/quantalithos-sdk` | 计划通过，当前仓待创建 |
| workspace member | 使用 `crates/<role>`，不含项目前缀 | 通过 |
| Cargo package | 使用 `sdk-<role>` | 通过 |
| Rust library crate | 使用 `sdk_<role>` | 通过 |
| binary | 使用 `sdk` 或具体 action name | 通过 |
| 架构层级泄漏 | 不出现 `L0` / `l0_` / `L1` / `l1_` | 通过 |
| 仓内目录重复项目前缀 | 不写 `crates/sdk_domain`、`crates/l0_sdk_domain` | 通过 |
| 文件名 | Rust 文件使用 `snake_case.rs`，不使用 `utils.rs` / `helper.rs` | 通过 |
| reports / artifacts | 不写 `reports/<project>` 或 `artifacts/test/<project>/<run_id>` | 通过 |

### 7.7 跨仓 path dependency 表

| 依赖仓库 | 全局依赖类型 | Cargo.toml 位置 | path dependency 写法 | 说明 |
|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | `quantalithos-sdk/Cargo.toml` 的 `[workspace.dependencies]` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | 当前只确认依赖 core 共享契约 |
| `quantalithos-bus` | 编译期依赖 | `quantalithos-sdk/Cargo.toml` 的 `[workspace.dependencies]` | `bus-contracts = { path = "../quantalithos-bus/crates/contracts" }` | 当前只确认依赖 bus 公共契约 |

### 7.8 运行期 / 事件协作依赖禁止进入 Cargo 表

| 依赖 | 类型 | 禁止原因 | 正确落点 |
|---|---|---|---|
| formal API / service endpoint | 运行期依赖 | 服务仓拥有业务 truth，SDK 只调用边界 | `FormalApiBoundaryPort`、adapter、config |
| fake / fixture endpoint | 运行期验证依赖 | fake 不能伪装生产能力 | `FakeFixtureEndpointPort`、test config、evidence |
| bus runtime / broker | 运行期依赖 | publication / delivery truth 属于 `L0-bus` | `BusBoundaryPort`、event client adapter |
| identity / governance / gateway | 外部安全 / 治理依赖 | SDK 不执行认证、授权或审批 | context / credential ref pass-through |
| public registry | 后续发布运营依赖 | P0 stable 只是本地稳定基线 | artifact ref、candidate status、handoff |

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
| 是否创建 `crates/api` | A. 创建 online API crate；B. 不创建，由 `crates/client` 表达 Rust SDK facade；C. 用 `cli` 临时代替 public API | 推荐 B | SDK 不是 server gateway，Rust developer-facing facade 更准确 |
| 是否创建 `crates/worker` | A. 创建常驻 worker；B. 暂不创建，用 `jobs` 承接 P0 operations；C. 只保留 scripts | 推荐 B | P0 不要求 SDK 常驻进程，jobs 足以承接验证闭环 |
| Python / TypeScript 是否作为 truth 目录 | A. 三语言各自拥有完整 truth；B. 只作为 package surface，truth 在 Rust workspace；C. 不保留语言包源码 | 推荐 B | 保持共同语义，且支持 smoke / docs / candidate evidence |
| 是否依赖 `core-domain` 或 `bus-domain` | A. 立即依赖；B. 暂只依赖 `core-contracts` / `bus-contracts`；C. 复制类型 | 推荐 B | 当前只确认公共契约依赖，扩大依赖需 Step 7 / Step 14 证明 |

---

## 10. 进入下一步条件

```text
实现者可以根据本步产出创建 /home/aris/Projects/quantalithos-sdk 的 workspace、语言包目录、tests、scripts、artifacts 和 reports。
实现单元、package、crate、binary、Python / TypeScript package surface、scripts、reports、artifacts 和 core / bus path dependency 已经明确。
可以进入 Step 5,继续定义模块实现契约主轴。
```
