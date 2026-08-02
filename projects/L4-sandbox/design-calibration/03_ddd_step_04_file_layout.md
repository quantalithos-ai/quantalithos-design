# Step 4. 收稳实现单元与文件布局

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 4
> 回填章节: `03-详细设计.md` §4 实现单元与文件布局
> 生成日期: 2026-07-09
> 状态: completed_wait_user_review
> 所属流程: `03_ddd_calibration_flow.md`
> 本 Step 口径: 把正式 `02-概要设计.md` 已收稳的代码主体框架、4 个运行单元、6 个主要组成部分和 Step 3 工程约束落到目标实现仓、workspace member、Cargo package、Rust crate / binary、文件树和文件职责。本步只定义 planned layout,不创建实现仓、不写 Rust 源码、不写对象字段、trait 签名、DTO schema、数据库表、配置 key、测试用例或实施 commit boundary。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 4 | 是。Step 3 审查点后用户已明确回复“同意”。 |
| 项目级台账是否允许进入 Step 4 | 是。`project_execution_ledger.md` 已将恢复点停在 `03-详细设计.md` Step 3,用户确认后允许进入 Step 4。 |
| 文档级 flow 是否允许进入 Step 4 | 是。`03_ddd_calibration_flow.md` 已记录 Step 3 `pass_wait_review`,进入 Step 4 的门禁已满足。 |
| 是否已读取 Step 3 中间产物 | 是。Step 3 已明确 Rust、源码英文、`core-contracts` 唯一编译期依赖和目标实现仓未发现的实施前置检查。 |
| 是否已读取详细设计 SOP Step 4 | 是。Step 4 必须输出实现单元总表、目录 / package / crate / binary 映射、文件布局树、文件职责表、命名检查和依赖表。 |
| 是否已读取目录组织规范 | 是。已读取 `standards/document/子项目目录与代码文件组织规范.md`,确认实现仓、workspace member、package、crate、binary 和文件命名规则。 |
| 是否发现阻塞 Step 4 的上游 blocker | 否。目标实现仓 `/home/aris/Projects/quantalithos-sandbox` 当前未发现,但不阻塞设计布局;后续 Step 17 / `07` 必须作为实施前置检查。 |

---

## 2. 本步目标

本步要把 `L4-sandbox` 的实现组织说到实现者可以创建仓库目录和文件的粒度,同时不提前进入对象、协议、事务和状态细节。

本步要收稳:

- 目标实现仓 project slug 与默认路径。
- workspace 多 crate vs 单 crate 模块分层的布局形态决策。
- 本轮必须创建的 crate / package / binary / library。
- 4 个运行单元到实现单元的承接关系。
- 每个实现单元对应正式 `02` 的代码主体组、主要组成部分或接口族。
- 目录 / package / crate / binary 映射。
- planned 文件布局树和文件职责表。
- 命名检查和 `core-contracts` Cargo path dependency 位置。
- 哪些运行期依赖、事件协作依赖、backend 产品和 handoff target 不得进入 Cargo dependency。

本步不处理:

- Rust struct / enum / value object 字段、member function、factory 和 invariant。
- trait / port / adapter 函数签名。
- Command / Query / Event / Job DTO、error surface、receipt 和 envelope schema。
- 数据库、object store、message bus、isolation backend、OTel、secret、GRC 或 deployment 产品选型。
- `scripts/`、`artifacts/`、`reports/` 和验收 evidence layout。除非后续 `05/06/07` 明确要求,本步不创建这些目录。
- phase / commit boundary、implementation ledger、planned boundary skeleton 或提交计划。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `03_ddd_step_02_scope.md` | 已完成 | 提供本轮详细设计范围、非范围和实现者可完成代码范围。 |
| `03_ddd_step_03_constraints.md` | 已完成且用户确认继续 | 提供 Rust、源码英文、`core-contracts`、依赖裁剪、提交规范和目标仓前置检查。 |
| `projects/L4-sandbox/00-需求文档.md` | 当前正式需求基线 | 提供 C-SBX-1~5、数据归属、依赖裁剪、接口依赖和红线。 |
| `projects/L4-sandbox/01-架构设计.md` | 当前正式架构基线 | 提供 4 类运行承载、依赖方向、数据所有权、一致性和横切边界。 |
| `projects/L4-sandbox/02-概要设计.md` §4 / §5 / §7 / §12 | 当前直接上游 | 提供代码主体框架、6 个主要组成部分、6 类接口骨架和详细设计承接清单。 |
| `02_hld_step_04_code_subject_framework.md` | 已读取 | 提供 4 个运行单元、实现分层和代码主体骨架。 |
| `02_hld_step_05_components_boundary.md` | 已读取 | 提供 6 个业务主要组成部分、capability 和对象候选归属。 |
| `02_hld_step_12_detailed_design_handoff.md` | 已读取 | 提供 `03` 应继续下沉的 module / builder / handler / consumer / job runner 输入。 |
| `standards/document/详细设计书写规范.md` §5.4 | 已读取 | 提供布局形态、映射表、目录树、文件职责表和 path dependency 写法要求。 |
| `standards/document/子项目目录与代码文件组织规范.md` | 已读取 | 提供实现仓路径、workspace member、package / crate / binary 和文件命名规则。 |
| `projects/L1-artifact/design-calibration/03_ddd_step_04_file_layout.md` | 已读取 | 参考 workspace 多 crate 粒度、表格结构和文件职责写法。 |
| `projects/L1-governance/design-calibration/03_ddd_step_04_file_layout.md` | 已读取 | 参考 Step 4 的问题回答和命名检查写法。 |
| 旧 `projects/L4-sandbox/03-详细设计.md` | historical_material | 仅用于识别旧单 crate `src/`、旧 application/domain/infra/projection/types/config 目录和旧对象词污染风险。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取项目级台账、`03` flow、Step 3、详细设计 SOP Step 4、书写规范 §5.4 和目录组织规范。 | done | 确认当前允许进入 Step 4。 |
| 2 | 从正式 `02` §4 / §5 / §7 / §12 和对应中间产物提取运行单元、代码主体、接口族和承接清单。 | done | 形成实现单元候选池。 |
| 3 | 对照 L1-artifact / L1-governance Step 4 粒度判断布局形态。 | done | 采用 workspace 多 crate 架构。 |
| 4 | 诊断旧 `03` 的旧目录树和旧对象词污染。 | done | 确认旧 `src/` 布局不继承。 |
| 5 | 回答 SOP Step 4 十三个问题。 | done | 明确 crate / package / binary / library、文件路径、命名和依赖写法。 |
| 6 | 输出布局形态决策表、实现单元表、映射表、文件布局树和文件职责表。 | done | 满足正式 §4 回填输入要求。 |
| 7 | 输出命名检查表、Cargo path dependency 表、运行期 / 事件依赖排除表和回填草稿。 | done | Step 5 可继续定义模块实现契约主轴。 |
| 8 | 更新 `03_ddd_calibration_flow.md` 和项目级台账。 | done | 当前恢复点停在 Step 4 审查点,不跨到 Step 5。 |
| 9 | 自检未修改正式 `03-详细设计.md`,未创建实现仓或代码,未提交 commit。 | done | 进入用户审查点。 |

---

## 5. SOP 问题回答

### 5.1 本轮实现包含哪些 crate / package / binary / library?

本轮选择 Rust workspace 多 crate 架构。必须创建的最小实现单元为:

- `contracts`:公共 Command / Query / Consumer / Event / Job / View / Receipt / Error DTO,以及共享 ref / reason / metadata wrapper。
- `domain`:sandbox truth object、value object、状态、guard、policy / invariant 和 domain error。
- `application`:application service、repository / port trait、unit-of-work、idempotency、command / query / consumer / job orchestration。
- `infra`:repository / adapter fake、config binding、context resolver、policy summary adapter、backend capability adapter、isolation backend adapter、handoff adapter、publisher 和 runtime builder。
- `api`:同步 Command / Query handler 入口,承接 `Sandbox Sync Entry`。
- `worker`:常驻异步 consumer、control / handoff feedback consumer、controlled execution fulfillment worker 和 event relay loop。
- `jobs`:一次性 operations job,承接 reference refresh、backend capability refresh、handoff retry、lease / orphan reaper、cleanup guard evaluation、redline handoff maintenance、projection rebuild、derived maintenance 和 reconciliation。

当前不单独创建 `cli`、`ops`、`config` 或 `observability` crate:

- `config` 归 `infra`。
- trace / audit / observability hook 分别由 `contracts`、`domain`、`application`、`infra` 中对应职责承接。
- 人工运维或交互式命令当前不是 Step 4 必需前提;如后续出现交互式 CLI,必须由后续设计或 `07` 明确新增 `cli`。

### 5.2 每个实现单元对应概要设计中的哪个代码主体?

实现单元按工程分层组织,不是按 6 个业务主要组成部分逐个拆 crate。6 个业务主要组成部分会跨 crate 分布:

- `contracts`
  - 承接 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 和 public view / receipt / error 协议面。
- `domain`
  - 承接 `Controlled execution intake and identity` 到 `Failure control and safety closure` 的 truth、decision、guard、状态和不变量。
- `application`
  - 承接 `ControlledExecutionIntakeService`、`ExecutionEnvironmentService`、`BoundaryEstablishmentService`、`PolicyExecutionService`、`ControlledExecutionCarrierService`、`CaptureHandoffService`、`FailureControlService`、`CleanupReaperService`、`RedlineContainmentService`、`SandboxReadService`、`SandboxDerivedMaintenanceService`。
- `infra`
  - 承接 `ContextReferenceResolverPort`、`PolicySummaryPort`、`BackendCapabilityPort`、`IsolationBackendPort`、`MaterialHandoffPort`、`ObservabilityMaterialPort`、`EventRelayPort`、`InvestigationHandoffPort`、truth / projection persistence 和 runtime wiring 的 adapter。
- `api`
  - 承接 `Sandbox Sync Entry`。
- `worker`
  - 承接 `Sandbox async control and handoff consumption unit` 与 `Sandbox controlled execution fulfillment unit` 的常驻处理。
- `jobs`
  - 承接 `Sandbox backend maintenance and cleanup unit` 与 operations job 家族。

### 5.3 文件路径应该如何组织,才能体现模块边界?

目标实现仓 planned path 固定为:

```text
/home/aris/Projects/quantalithos-sandbox
```

仓内使用:

```text
crates/<role>
```

每个 crate 内部文件按职责命名,不使用 `service.rs`、`manager.rs`、`helper.rs`、`utils.rs`、`common.rs` 这类模糊文件名。文件名称必须表达 L4-sandbox 的正式主语,例如 `execution_context.rs`、`boundary.rs`、`policy_decision.rs`、`capture.rs`、`cleanup.rs`、`redline.rs`、`isolation_backend_adapters.rs`。

### 5.4 哪些文件必须创建,哪些文件只是后续可能扩展?

本步只固定必须创建的 planned 最小文件集合:

- workspace root `Cargo.toml`。
- 7 个 member 的 `Cargo.toml`。
- 每个 member 的 `src/lib.rs`。
- 对应业务主语、协议族、service 族、adapter 族和 operations job 的最小职责文件。
- root `tests/` 下的 contract / domain / service / integration / support 测试目录。

以下内容本步不固定:

- migrations。
- CI / deployment files。
- `scripts/gates`、`scripts/reports`、`scripts/checks`。
- `artifacts/` 和 `reports/`。
- 可选 `cli` / `ops` crate。
- 具体 durable backend adapter 子目录深度。
- 具体 Docker / gVisor / Firecracker / k8s profile 文件。

### 5.5 每个文件负责定义哪些对象、trait、handler、repository 或测试?

本步只固定文件承载责任,不提前写字段全集或函数签名:

- `contracts`:
  request / response、view、event、consumer envelope payload、job input / report、receipt、public error、metadata carrier。
- `domain`:
  execution context、identity、boundary、policy decision、run / capture / handoff、failure / control / lease / cleanup / redline、projection / relay / audit trace 的 domain objects 和 guards。
- `application`:
  command / query / consumer / job orchestration、ports、UoW、idempotency、error mapping。
- `infra`:
  repository、resolver、policy summary adapter、backend capability adapter、isolation backend adapter、publisher、handoff、observability、investigation、config、clock / id、runtime builder。
- `api`:
  command / query handlers 和 route / RPC assembly boundary。
- `worker`:
  inbound consumers、control / handoff feedback consumers、controlled execution fulfillment worker、outbox publisher loop、worker runtime。
- `jobs`:
  operations job runner 文件,每个文件对应一个 job family。
- `tests`:
  contract、domain、service、integration、support 最小验证切口;具体 case 留给 Step 16。

### 5.6 当前仓的 project slug 是什么?

project slug 固定为:

```text
sandbox
```

设计仓目录 `projects/L4-sandbox/` 中的 `L4` 只用于设计导航,不得进入实现仓 package、crate、module、file、type、function 或 binary 名称。

### 5.7 workspace member 目录是否使用 `crates/<role>`?

是。固定为:

- `crates/contracts`
- `crates/domain`
- `crates/application`
- `crates/infra`
- `crates/api`
- `crates/worker`
- `crates/jobs`

### 5.8 Cargo package 是否使用 `<project>-<role>`?

是。固定为:

- `sandbox-contracts`
- `sandbox-domain`
- `sandbox-application`
- `sandbox-infra`
- `sandbox-api`
- `sandbox-worker`
- `sandbox-jobs`

### 5.9 Rust library crate 是否使用 `<project>_<role>`?

是。固定为:

- `sandbox_contracts`
- `sandbox_domain`
- `sandbox_application`
- `sandbox_infra`
- `sandbox_api`
- `sandbox_worker`
- `sandbox_jobs`

### 5.10 binary 名是否表达用户入口或具体动作?

是。

- API 入口 binary:
  `sandbox-api`
- 常驻 worker binary:
  `sandbox-control-worker`
  `sandbox-fulfillment-worker`
- jobs binary:
  `publish_sandbox_event_relay`
  `refresh_sandbox_references`
  `refresh_backend_capabilities`
  `retry_material_handoffs`
  `run_lease_orphan_reaper`
  `evaluate_cleanup_guards`
  `maintain_redline_handoffs`
  `rebuild_sandbox_projections`
  `maintain_derived_inspect_preview_trend`
  `run_sandbox_reconciliation`

### 5.11 是否有 `L0` / `L1` / `l0_` / `l1_` 等架构层级泄漏进代码命名?

不允许。所有 package、crate、module、file、type、function 和 binary 名称都不得包含:

- `L0`
- `L1`
- `L2`
- `L3`
- `L4`
- `l0_`
- `l1_`
- `l4_`
- `quantalithos_l4`

### 5.12 如果本仓存在已确认的编译期依赖,Cargo path dependency 应写在哪个 `Cargo.toml`,使用哪个真实 crate 路径?

当前唯一允许的编译期 sibling 依赖是 `core-contracts`。

写法固定在 workspace root `Cargo.toml`:

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

需要共享 actor、trace、metadata、typed ref、error 或 cross-project contract carrier 的 member 再通过:

```toml
core-contracts.workspace = true
```

进行引用。具体哪个 member 必须引用,在 Step 5 的 crate dependency matrix 和 Step 7 的 port / adapter contract 中继续收口。

### 5.13 哪些运行期依赖或事件协作依赖只能在 adapter / event / projection 章节表达,不能进入文件布局的 Cargo 依赖?

以下都不能进入 Cargo dependency:

- `L0-bus`
- `L1-identity`
- `L1-work`
- `L1-governance`
- `L3-capability-hub`
- `L3-method-library`
- `L2-tools`
- `L2-runtime`
- `L2-member-service`
- `L1-artifact`
- `L4-observability`
- `L5-runner`
- `L0-sdk`
- `L5-console` / `L5-chat` / `L5-sync`
- Docker / gVisor / Firecracker / Kubernetes / local process / host backend
- DB / object store / OTel / secrets / GRC / investigation system

它们只能在后续章节中以以下形式出现:

- port trait
- runtime adapter
- event publish / subscribe
- snapshot / safe summary resolver
- handoff target / receipt
- backend capability summary
- fake adapter / integration seam

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `03-详细设计.md` §3.3 | 使用旧单 crate `src/` 目录树,包含旧 `application/session_service.rs`、`domain/execution`、`infra/runtime_host`、`projection`、`types`、`config` 等结构。 | 本步完全不继承旧目录结构,改为 workspace 多 crate planned layout。 |
| 旧 `03` 文件与模块映射 | 仍按旧“执行请求与会话建立 / 隔离环境 / 命令执行 / 输出回收 / 失败恢复”五段主线组织。 | 本步按正式 `02` 的 6 个主要组成部分、4 类运行单元和接口族重新映射。 |
| 正式 `02` §4 | 只固定代码主体骨架,明确不直接决定 crate / module / file。 | 本步把该骨架落到 `contracts/domain/application/infra/api/worker/jobs`。 |
| Step 3 | 已确认 `core-contracts` 是唯一 path dependency,但还没有说明写入哪个 Cargo。 | 本步固定 root `[workspace.dependencies]` 写法。 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-sandbox` 当前未发现。 | 不阻塞详细设计;进入 Step 17 / `07` 实施前置检查。 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 布局形态 | 只有概要层实现分层和旧 `src/` historical layout。 | 选择 workspace 多 crate planned layout。 | 需要公共 contracts、多运行入口和强依赖边界。 |
| 目录命名 | 旧材料中混入 `src/api`、`src/types`、`src/config`、`src/projection`。 | 固定 `crates/<role>`。 | 对齐目录组织规范并保护 crate 边界。 |
| package / crate 名 | 未固定。 | `sandbox-<role>` / `sandbox_<role>`。 | 防止 `L4` 或 `quantalithos` 泄漏进内部代码命名。 |
| 运行单元承接 | `Sandbox Sync Entry` 等只停留在概要层。 | 分别落到 `api`、`worker`、`jobs`。 | 让实现者能创建入口和 worker 文件。 |
| 后端产品 | 旧 README / 旧 `03` 容易固定 Docker/gVisor/local process 目录。 | 只创建 `isolation_backend_adapters.rs` planned seam,不锁产品目录。 | 防止后端反向定义业务边界。 |
| 测试目录 | 未固定。 | root `tests/contract/domain/service/integration/support` planned 目录。 | 为 Step 16 / `05` 留出最小验证切口。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 单 crate 模块分层架构 | 初始文件少,创建快。 | contracts 难以单独复用;domain 纯净只能靠 review;api / worker / jobs 多入口边界不清;infra backend 接缝较重。 | 不采用。 |
| B. workspace 多 crate 架构 | contracts 可独立复用;依赖方向可由 Cargo 强制;多入口清晰;适合长期平台化基础设施仓。 | 初始 Cargo / crate 数量更多。 | 采用。 |
| C. 每个业务主要组成部分一个 crate | 业务名与 crate 名表面一致。 | 业务组成部分跨 contracts / domain / application / infra,会制造循环依赖。 | 不采用。 |
| D. 继承旧 `src/` 目录树 | 与 historical material 接近。 | 旧目录混入旧会话 / command / replay / artifact / audit 主线,不符合正式 `02`。 | 不采用。 |
| E. 单独创建 `config` / `observability` crate | 看似复用边界清晰。 | 当前没有独立编译复用需求,会过早抽象并可能反写 truth。 | 不采用。 |

---

## 9. 结构化中间产物

### 9.1 布局形态决策表

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层架构 | 否 | 本仓存在公共 contracts、多运行入口、heavy infra / backend 接缝和强 domain 纯净要求。 | 不采用。 |
| workspace 多 crate 架构 | 是 | contracts / domain / application / infra / api / worker / jobs 边界清晰,Cargo 可强制依赖方向。 | 需要建立 7 个 workspace member 和 root dependency matrix。 |
| 业务组成部分拆 crate | 否 | 6 个业务组成部分跨工程分层,不适合作为 crate 边界。 | 业务组成部分由 Step 5 模块主轴和 Step 6 对象契约表达。 |

### 9.2 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| `contracts` | library crate | 公共 DTO、typed ref carrier、metadata carrier、view、event、job report、receipt 和 public error surface | §7 API / 接口骨架;§12 详细设计承接清单 |
| `domain` | library crate | sandbox truth object、value object、状态、guard、decision、capture / handoff / failure / cleanup / redline 不变量 | §5 主要组成部分;§6 关键对象;§9 状态定义 |
| `application` | library crate | command / query / consumer / job service 编排,port trait,UoW,idempotency,save order 和 error mapping | §4 代码主体框架;§7 接口骨架;§8 处理流 |
| `infra` | library crate | repository adapter、resolver、policy summary adapter、backend capability adapter、isolation backend adapter、handoff adapter、publisher、config、runtime builder | §4 代码主体框架;§7 Port 骨架;§11 配置影响 |
| `api` | library crate + binary package | `Sandbox Sync Entry` 的 command / query handler 和 route / RPC assembly boundary | §4 运行单元;§7 Command / Query |
| `worker` | library crate + binary package | async control / handoff / feedback consumer、controlled execution fulfillment worker、event relay loop | §4 运行单元;§7 Consumer / Outbound Event |
| `jobs` | library crate + binary package | operations jobs: relay、reference refresh、backend capability refresh、handoff retry、lease / orphan reaper、cleanup guard、redline、projection、derived、reconciliation | §4 运行单元;§7 Operations Job;§8 Job flow |

### 9.3 目录 / Package / Crate / Binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `sandbox-contracts` | `sandbox_contracts` | Command / Query / Consumer / Event / Job / View / Receipt / Error DTO,以及 metadata / ref carrier | 是 |
| `crates/domain` | library crate | `sandbox-domain` | `sandbox_domain` | execution context、boundary、policy decision、run / capture / handoff、failure / cleanup / redline、projection / relay / audit trace domain model | 否 |
| `crates/application` | library crate | `sandbox-application` | `sandbox_application` | application services、port trait、repository trait、unit-of-work、idempotency、command / query / consumer / job orchestration | 否 |
| `crates/infra` | library crate | `sandbox-infra` | `sandbox_infra` | fake / durable repository adapter、resolver、policy adapter、backend adapter、handoff adapter、publisher、config、runtime builder | 否 |
| `crates/api` | library crate + binary package | `sandbox-api` | `sandbox_api` / `sandbox-api` | sync command / query handler 和 route / RPC assembly boundary | 否 |
| `crates/worker` | library crate + binary package | `sandbox-worker` | `sandbox_worker` / `sandbox-control-worker`;`sandbox-fulfillment-worker` | async consumers、controlled execution fulfillment worker、event relay / worker runtime | 否 |
| `crates/jobs` | library crate + binary package | `sandbox-jobs` | `sandbox_jobs` / job binary names | operations job runner 和维护任务 | 否 |
| `tests` | integration tests | none | test targets | contract / domain / service / integration / support tests | 否 |

### 9.4 文件布局树

```text
quantalithos-sandbox/
  Cargo.toml                                 # workspace root and shared dependencies
  crates/
    contracts/
      Cargo.toml
      src/
        lib.rs                               # public contracts exports
        refs.rs                              # typed refs, ids, reasons, shared enums and marker carriers
        metadata.rs                          # command, query, event and job metadata wrappers
        commands.rs                          # Command request / response / stored result DTO
        queries.rs                           # Query request / response / page / consistency DTO
        events.rs                            # inbound and outbound event payload DTO
        jobs.rs                              # operations job input / report / receipt DTO
        views.rs                             # query and projection-visible view DTO
        receipts.rs                          # command, handoff, relay and consumer receipts
        errors.rs                            # public protocol error DTO and error code
        fixtures.rs                          # contract fixtures used by tests
    domain/
      Cargo.toml
      src/
        lib.rs                               # domain exports
        execution_context.rs                 # ControlledExecutionContext and context resolution state
        environment_identity.rs              # ExecutionEnvironmentIdentity and responsibility chain
        boundary.rs                          # BoundaryRequirementSet, CoherentBoundary and boundary guard
        backend_capability.rs                # BackendCapabilitySummary and capability interpretation
        policy_decision.rs                   # PolicyApplicabilitySnapshot, PolicyExecutionDecision and high-risk decision
        run.rs                               # ControlledExecutionRun and run lifecycle domain rules
        capture.rs                           # CaptureFact, CapturedMaterialRef and capture completeness guard
        handoff.rs                           # HandoffFact and handoff ownership guard
        failure.rs                           # FailureClassification and failure reason taxonomy
        control.rs                           # ControlFact and control conflict guard
        cleanup.rs                           # LeaseRecord, OrphanRecoveryRecord and CleanupGuard
        redline.rs                           # RedlineContainment and containment guard
        reference_state.rs                   # ReferenceResolutionState and external summary freshness
        projection.rs                        # SandboxReadProjection and derived view state
        event_relay.rs                       # SandboxEventRelayRecord domain formation
        audit_trace.rs                       # SandboxAuditTrace and audit backref formation
        policies.rs                          # domain policies and invariant guards
        errors.rs                            # DomainError
    application/
      Cargo.toml
      src/
        lib.rs                               # application exports
        services.rs                          # service assembly facade
        intake_service.rs                    # OpenControlledExecutionContext orchestration
        environment_service.rs               # execution environment identity orchestration
        boundary_service.rs                  # EstablishExecutionBoundary orchestration
        policy_service.rs                    # EvaluatePolicyExecution orchestration
        run_service.rs                       # StartControlledExecutionRun orchestration
        capture_handoff_service.rs           # RecordCaptureResult and OpenMaterialHandoff orchestration
        failure_control_service.rs           # SubmitSandboxControl and ClassifySandboxFailure orchestration
        cleanup_service.rs                   # EvaluateCleanupReadiness and reaper orchestration
        redline_service.rs                   # RecordRedlineContainment orchestration
        query_service.rs                     # authorized query and read projection orchestration
        consumer_service.rs                  # inbound event consumer orchestration
        derived_service.rs                   # projection, derived, comparison and reconciliation orchestration
        relay_service.rs                     # outbound event relay orchestration
        ports.rs                             # repository, resolver, backend, handoff, publisher, clock and id traits
        unit_of_work.rs                      # UnitOfWork trait and transaction handle
        idempotency.rs                       # idempotency records, request digest and duplicate / conflict surface
        errors.rs                            # ApplicationError
    infra/
      Cargo.toml
      src/
        lib.rs                               # infra exports
        config.rs                            # runtime config structs and validation surface
        runtime_builder.rs                   # assembly of repositories, adapters and services
        truth_repositories.rs                # fake / durable truth repository adapters
        projection_repositories.rs           # projection and read model repository adapters
        reference_stores.rs                  # external reference and safe summary stores
        event_relay_store.rs                 # event relay repository adapter
        idempotency_store.rs                 # idempotency repository adapter
        context_resolvers.rs                 # identity / work / runtime / runner / tool context resolver adapters
        policy_adapters.rs                   # policy / authorization / capability summary adapters
        backend_capability_adapters.rs       # backend capability summary adapters
        isolation_backend_adapters.rs        # isolation backend adapter seam
        handoff_adapters.rs                  # material, observability and investigation handoff adapters
        publishers.rs                        # event publisher and fake relay adapters
        clock_id.rs                          # clock and id generator adapters
        errors.rs                            # InfraError
    api/
      Cargo.toml
      src/
        lib.rs                               # api exports
        command_handlers.rs                  # Command handler boundary
        query_handlers.rs                    # Query handler boundary
        routes.rs                            # route / RPC assembly placeholder
        errors.rs                            # API error mapping
        bin/
          sandbox-api.rs                     # sync API server entry
    worker/
      Cargo.toml
      src/
        lib.rs                               # worker exports
        control_consumers.rs                 # control and caller context event consumers
        handoff_consumers.rs                 # material / observability / investigation handoff feedback consumers
        backend_consumers.rs                 # backend lifecycle and capability event consumers
        fulfillment_worker.rs                # controlled execution fulfillment loop
        event_relay_worker.rs                # outbound relay worker loop
        worker_runtime.rs                    # worker runtime assembly
        errors.rs                            # WorkerError
        bin/
          sandbox-control-worker.rs          # async control and handoff consumer entry
          sandbox-fulfillment-worker.rs      # controlled execution fulfillment worker entry
    jobs/
      Cargo.toml
      src/
        lib.rs                               # jobs exports
        event_relay_publish.rs               # PublishSandboxEventRelay
        reference_refresh.rs                 # RefreshSandboxReferenceStates
        backend_capability_refresh.rs        # RefreshBackendCapabilitySummaries
        material_handoff_retry.rs            # RetryPendingMaterialHandoffs
        lease_orphan_reaper.rs               # RunLeaseOrphanReaper
        cleanup_guard_evaluation.rs          # EvaluatePendingCleanupGuards
        redline_handoff_maintenance.rs       # MaintainRedlineContainmentHandoffs
        projection_rebuild.rs                # RebuildSandboxReadProjections
        derived_maintenance.rs               # MaintainDerivedInspectPreviewTrend
        reconciliation.rs                    # RunSandboxReconciliation
        errors.rs                            # JobsError
        bin/
          publish_sandbox_event_relay.rs
          refresh_sandbox_references.rs
          refresh_backend_capabilities.rs
          retry_material_handoffs.rs
          run_lease_orphan_reaper.rs
          evaluate_cleanup_guards.rs
          maintain_redline_handoffs.rs
          rebuild_sandbox_projections.rs
          maintain_derived_inspect_preview_trend.rs
          run_sandbox_reconciliation.rs
  tests/
    contract/
      protocol_contract_tests.rs             # public contract serialization and compatibility tests
    domain/
      state_guard_tests.rs                   # state and guard tests
    service/
      command_flow_tests.rs                  # application service flow tests
      query_no_write_tests.rs                # query no-write tests
    integration/
      adapter_boundary_tests.rs              # fake adapter and boundary integration tests
    support/
      fixtures.rs                            # shared test fixtures
      fakes.rs                               # shared fake dependencies
```

说明:

- 目录树是 planned layout,目标实现仓当前未发现,并未创建实际文件。
- `bin/` 文件名使用 hyphen 或 snake_case 的具体入口名;Rust module 文件使用 snake_case。
- `scripts/`、`artifacts/`、`reports/` 未列入本步 planned layout,因为当前 Step 4 不定义测试脚本、报告生成或验收证据目录。

### 9.5 文件职责表

| 文件路径 | 所属实现单元 | 定义内容 | 主要责任 |
|---|---|---|---|
| `Cargo.toml` | workspace root | workspace members、workspace dependencies、shared package metadata | 定义 `core-contracts` path dependency 位置和 workspace 成员 |
| `crates/contracts/src/refs.rs` | `contracts` | typed refs、ids、reason carriers、shared finite enum / marker | 承接 actor / context / trace / external refs，以及跨 DTO / domain 复用的 kind、selector、status 与 marker |
| `crates/contracts/src/metadata.rs` | `contracts` | command / query / event / job metadata DTO | 统一 actor、trace、idempotency、source 和 schema metadata carrier |
| `crates/contracts/src/commands.rs` | `contracts` | Command request / response / stored result DTO | 支撑 `OpenControlledExecutionContext` 等 command 协议 |
| `crates/contracts/src/queries.rs` | `contracts` | Query request / response / page / consistency DTO | 支撑 status、summary、projection、derived 和 trace query 协议 |
| `crates/contracts/src/events.rs` | `contracts` | inbound / outbound event payload DTO | 支撑 consumer、relay 和 truth change 事件协议 |
| `crates/contracts/src/jobs.rs` | `contracts` | operations job input / report / receipt DTO | 支撑 maintenance job 和 report contract |
| `crates/contracts/src/views.rs` | `contracts` | public view DTO | 支撑 Query 和 projection read surface |
| `crates/contracts/src/receipts.rs` | `contracts` | command、handoff、relay、consumer receipt DTO | 表达 accepted / pending / failed / duplicate / delayed 等 public result |
| `crates/contracts/src/errors.rs` | `contracts` | protocol error DTO and code | 表达 public error surface,不承载 domain 私有状态 |
| `crates/domain/src/execution_context.rs` | `domain` | `ControlledExecutionContext` and resolution state | 维护正式受控执行语境、受理 / 拒绝和责任链不变量 |
| `crates/domain/src/environment_identity.rs` | `domain` | `ExecutionEnvironmentIdentity` | 维护 execution environment identity 和 actor / context binding |
| `crates/domain/src/boundary.rs` | `domain` | `BoundaryRequirementSet`;`CoherentBoundary`;boundary guard | 维护 resource / filesystem / network / process boundary 不变量 |
| `crates/domain/src/backend_capability.rs` | `domain` | `BackendCapabilitySummary` interpretation | 解释 backend capability 摘要,不拥有 backend product truth |
| `crates/domain/src/policy_decision.rs` | `domain` | `PolicyApplicabilitySnapshot`;`PolicyExecutionDecision`;`HighRiskActionDecision` | 维护 given policy 下的 accepted / rejected / blocked / fail-closed 裁定 |
| `crates/domain/src/run.rs` | `domain` | `ControlledExecutionRun` | 维护已成立 context + boundary + policy 下的运行生命周期 |
| `crates/domain/src/capture.rs` | `domain` | `CaptureFact`;`CapturedMaterialRef` | 维护 capture completeness 和 material ref 分层 |
| `crates/domain/src/handoff.rs` | `domain` | `HandoffFact` | 维护 material / observability / investigation handoff ownership guard |
| `crates/domain/src/failure.rs` | `domain` | `FailureClassification` | 维护 deny / timeout / backend / capture / redline 等失败分类 |
| `crates/domain/src/control.rs` | `domain` | `ControlFact` | 维护 kill / cancel / stop / conflict 等 control fact |
| `crates/domain/src/cleanup.rs` | `domain` | `LeaseRecord`;`OrphanRecoveryRecord`;`CleanupGuard` | 维护 cleanup / reaper 前置安全条件 |
| `crates/domain/src/redline.rs` | `domain` | `RedlineContainment` | 维护 escape-like / unauthorized / security redline containment |
| `crates/domain/src/reference_state.rs` | `domain` | `ReferenceResolutionState` | 维护外部 refs / safe summary freshness state |
| `crates/domain/src/projection.rs` | `domain` | `SandboxReadProjection`;derived state | 维护 read projection 和 derived state 的 domain identity |
| `crates/domain/src/event_relay.rs` | `domain` | `SandboxEventRelayRecord` | 形成 outbound relay domain record,不发布事件 |
| `crates/domain/src/audit_trace.rs` | `domain` | `SandboxAuditTrace` | 维护审计回链和 trace material identity |
| `crates/domain/src/policies.rs` | `domain` | domain policies and guards | 统一 invariant guard 组合 |
| `crates/application/src/intake_service.rs` | `application` | intake command orchestration | 编排受理、refs resolution、idempotency、truth save |
| `crates/application/src/environment_service.rs` | `application` | execution identity orchestration | 编排 execution environment identity 建立和绑定 |
| `crates/application/src/boundary_service.rs` | `application` | boundary establishment orchestration | 编排 boundary requirement、backend capability 和 isolation backend 交互 |
| `crates/application/src/policy_service.rs` | `application` | policy decision orchestration | 编排 policy summary、high-risk decision 和 fail-closed mapping |
| `crates/application/src/run_service.rs` | `application` | run start orchestration | 编排 launch、handle lifecycle 和 run state |
| `crates/application/src/capture_handoff_service.rs` | `application` | capture / handoff orchestration | 编排 capture result、material refs、handoff fact 和 no-rollback |
| `crates/application/src/failure_control_service.rs` | `application` | failure / control orchestration | 编排 control signal、failure classification 和 conflict guard |
| `crates/application/src/cleanup_service.rs` | `application` | cleanup / reaper orchestration | 编排 lease、orphan、cleanup guard 和 reaper result |
| `crates/application/src/redline_service.rs` | `application` | redline orchestration | 编排 containment、investigation handoff 和 audit side effect |
| `crates/application/src/query_service.rs` | `application` | query orchestration | 读取 projection / status / trace,执行 no-write guard |
| `crates/application/src/consumer_service.rs` | `application` | inbound consumer orchestration | 处理 source events、dedupe、marker 和 feedback |
| `crates/application/src/derived_service.rs` | `application` | projection / derived / reconciliation orchestration | 维护只读派生和对账,不修 core truth |
| `crates/application/src/relay_service.rs` | `application` | event relay orchestration | 编排 outbound event relay and feedback mapping |
| `crates/application/src/ports.rs` | `application` | repository / resolver / backend / handoff / publisher traits | 定义外部和 persistence 接缝,不依赖相邻仓源码 |
| `crates/application/src/unit_of_work.rs` | `application` | UnitOfWork trait | 定义事务边界和 save order handle |
| `crates/application/src/idempotency.rs` | `application` | idempotency record and digest | 定义 duplicate / conflict / stored result 应用语义 |
| `crates/infra/src/config.rs` | `infra` | runtime config structs and validation surface | 定义 infra-level validated config carrier,不替代 `04` 配置手册 |
| `crates/infra/src/runtime_builder.rs` | `infra` | runtime wiring | 组装 repository、adapter 和 application services |
| `crates/infra/src/truth_repositories.rs` | `infra` | truth repository adapters | 实现 truth persistence port 的 fake / durable seam |
| `crates/infra/src/projection_repositories.rs` | `infra` | projection adapters | 实现 projection / read model repository seam |
| `crates/infra/src/context_resolvers.rs` | `infra` | context resolver adapters | 对接 identity / work / runtime / runner / tool safe summary |
| `crates/infra/src/policy_adapters.rs` | `infra` | policy summary adapters | 对接 policy / authorization / capability summary,不拥有 policy truth |
| `crates/infra/src/backend_capability_adapters.rs` | `infra` | backend capability adapters | 对接 backend capability summary,不拥有 backend lifecycle |
| `crates/infra/src/isolation_backend_adapters.rs` | `infra` | isolation backend adapter seam | 对接 process / fs / network / resource lifecycle |
| `crates/infra/src/handoff_adapters.rs` | `infra` | handoff adapters | 对接 material / observability / investigation handoff |
| `crates/infra/src/publishers.rs` | `infra` | event publisher adapters | 发布 outbound events 或 fake relay |
| `crates/api/src/command_handlers.rs` | `api` | command handlers | 将 sync command input 转给 application service |
| `crates/api/src/query_handlers.rs` | `api` | query handlers | 将 sync query input 转给 query service |
| `crates/api/src/bin/sandbox-api.rs` | `api` | API binary entry | 启动 sync entry runtime |
| `crates/worker/src/control_consumers.rs` | `worker` | control / context event consumers | 消费 control requested、context changed 等异步输入 |
| `crates/worker/src/handoff_consumers.rs` | `worker` | handoff feedback consumers | 消费 material / observability / investigation handoff status |
| `crates/worker/src/backend_consumers.rs` | `worker` | backend lifecycle consumers | 消费 backend capability / lifecycle signal |
| `crates/worker/src/fulfillment_worker.rs` | `worker` | controlled execution fulfillment loop | 承接已成立 run 的执行 fulfillment |
| `crates/worker/src/event_relay_worker.rs` | `worker` | relay worker loop | 常驻发布 relay,不回滚 source truth |
| `crates/jobs/src/event_relay_publish.rs` | `jobs` | PublishSandboxEventRelay | 一次性 relay publish job |
| `crates/jobs/src/reference_refresh.rs` | `jobs` | RefreshSandboxReferenceStates | 刷新 external refs / safe summaries |
| `crates/jobs/src/backend_capability_refresh.rs` | `jobs` | RefreshBackendCapabilitySummaries | 刷新 backend capability summaries |
| `crates/jobs/src/material_handoff_retry.rs` | `jobs` | RetryPendingMaterialHandoffs | 重试 pending / failed material handoff |
| `crates/jobs/src/lease_orphan_reaper.rs` | `jobs` | RunLeaseOrphanReaper | 执行 lease / orphan 保守回收 |
| `crates/jobs/src/cleanup_guard_evaluation.rs` | `jobs` | EvaluatePendingCleanupGuards | 评估 cleanup guard |
| `crates/jobs/src/redline_handoff_maintenance.rs` | `jobs` | MaintainRedlineContainmentHandoffs | 维护 redline investigation handoff |
| `crates/jobs/src/projection_rebuild.rs` | `jobs` | RebuildSandboxReadProjections | 重建 read projections |
| `crates/jobs/src/derived_maintenance.rs` | `jobs` | MaintainDerivedInspectPreviewTrend | 维护 inspect / preview / trend 派生面 |
| `crates/jobs/src/reconciliation.rs` | `jobs` | RunSandboxReconciliation | 执行 sandbox 对账 report |
| `tests/contract/protocol_contract_tests.rs` | `tests` | protocol contract tests | 检查 public DTO / error / receipt compatibility |
| `tests/domain/state_guard_tests.rs` | `tests` | domain state and guard tests | 检查状态和 guard |
| `tests/service/command_flow_tests.rs` | `tests` | command flow tests | 检查 application command orchestration |
| `tests/service/query_no_write_tests.rs` | `tests` | query no-write tests | 检查 query / projection 不反写 |
| `tests/integration/adapter_boundary_tests.rs` | `tests` | fake adapter integration tests | 检查 adapter seam 和 dependency crop |

2026-07-18 Step 6 regression `6R-03` batch 7 对本表执行定向回写：`refs.rs` 的 planned 职责与 `L1-governance` / `L1-artifact` 参考粒度一致，明确包含跨模块 shared finite enum 与 marker。planned tree 不增加独立 kind、status、state 或 marker module；`commands.rs`、`queries.rs`、`events.rs`、`jobs.rs`、`views.rs`、`receipts.rs` 只拥有各自 DTO / payload / view / receipt，并复用 `refs.rs` 中的 canonical shared enum。该回写关闭文件职责描述缺口，不改变七 crate、文件集合、Cargo 依赖或业务 owner。

### 9.6 命名检查表

| 检查项 | 通过条件 | 结果 |
|---|---|---|
| 实现仓目录 | `/home/aris/Projects/quantalithos-<project>` | 通过。planned path 为 `/home/aris/Projects/quantalithos-sandbox`;当前未发现目标仓,不伪造已落地。 |
| project slug | 使用仓名中的项目部分 | 通过。slug = `sandbox`。 |
| workspace member 目录 | `crates/<role>`,不含项目名前缀 | 通过。使用 `contracts/domain/application/infra/api/worker/jobs`。 |
| Cargo package | `<project>-<role>` | 通过。使用 `sandbox-contracts` 等。 |
| Rust library crate | `<project>_<role>` | 通过。使用 `sandbox_contracts` 等。 |
| binary 名 | 表达用户入口或具体动作 | 通过。API / worker / jobs binary 均表达入口或动作。 |
| 架构层级泄漏 | 代码命名中不出现 `L0` / `L1` / `L2` / `L3` / `L4` / `l4_` | 通过。planned code names 不含架构层级。 |
| 仓内项目前缀重复 | member 目录不写 `sandbox_contracts` 或 `quantalithos_sandbox_*` | 通过。member 目录为短职责名。 |
| 文件名 | `snake_case.rs` 且表达职责 | 通过。Rust module 文件均使用 snake_case 且指向具体职责。 |
| 顶层职责目录 | 不使用 `utils` / `common` / `helper` 顶层 role | 通过。未使用这些 role。 |

### 9.7 Cargo path dependency 表

| 依赖仓库 | 全局依赖类型 | Cargo.toml 位置 | path dependency 写法 | 说明 |
|---|---|---|---|---|
| `quantalithos-core` | 编译期依赖 | workspace root `Cargo.toml` 的 `[workspace.dependencies]` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | 唯一当前允许的 sibling path dependency;供 actor / trace / metadata / typed ref / error / shared contract carrier 使用。 |

member 需要引用时使用:

```toml
[dependencies]
core-contracts.workspace = true
```

### 9.8 运行期 / 事件协作依赖排除表

| 关系 | 依赖类型 | 不进入 Cargo 的原因 | 后续表达位置 |
|---|---|---|---|
| `L0-bus` | 事件协作 | bus 不承载 sandbox truth,且当前未确认为编译期依赖 | Step 7 port;Step 8 event;Step 14 adapter binding |
| `L1-identity` / `L1-work` | 运行期 / 事件协作 | 只提供 refs / safe summary / responsibility context | `context_resolvers.rs`;port / adapter 契约 |
| policy sources / `L1-governance` / `L3-capability-hub` / `L2-tools` | 运行期 / 事件协作 | policy truth 外部拥有,sandbox 只消费 given policy summary | `policy_adapters.rs`;policy port 契约 |
| `L2-runtime` / `L2-member-service` / `L5-runner` | 运行期 / 事件协作 | 调用方 / 编排方 truth 不归 sandbox | api / worker adapters;event / handoff 协议 |
| `L1-artifact` / `L4-observability` / investigation target | 材料交接 / 事件协作 | downstream truth 外部拥有,handoff failure 不回滚 source truth | `handoff_adapters.rs`;handoff port 契约 |
| Docker / gVisor / Firecracker / k8s / host backend | 运行期 / 基础设施 | backend product 不定义 sandbox business truth | `isolation_backend_adapters.rs`;config binding |
| DB / object store / OTel / secrets / GRC | 运行期 / 产品候选 | 产品选型后移 `04/07/ADR`,不形成业务 compile dependency | infra adapters;future config / implementation plan |

---

## 10. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_04_file_layout.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“设计取舍”和“待确认事项”小节,了解实现单元、目录布局和 Cargo 依赖约束如何从概要代码主体和 Step 3 约束收敛。

## 4. 实现单元与文件布局

目标实现仓 planned path 为 `/home/aris/Projects/quantalithos-sandbox`。当前本地未发现该目标仓,因此本章只定义 planned layout,不表示实现仓已经创建。布局采用 Rust workspace 多 crate 架构,以 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个 workspace member 承接公共协议、领域规则、应用编排、基础设施适配、同步入口、常驻异步入口和后台维护任务。

### 4.1 布局形态决策表

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| 单 crate 模块分层架构 | 否 | 本仓存在公共 contracts、多运行入口和重 infra / backend 接缝 | 不采用 |
| workspace 多 crate 架构 | 是 | contracts / domain / application / infra / api / worker / jobs 边界清晰,Cargo 可强制依赖方向 | 创建 7 个 workspace member |

### 4.2 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计章节 |
|---|---|---|---|
| `contracts` | library crate | 公共 DTO、view、event、job、receipt、error | §7 / §12 |
| `domain` | library crate | sandbox truth object、state、guard、decision、不变量 | §5 / §6 / §9 |
| `application` | library crate | command / query / consumer / job 编排,port trait,UoW,idempotency | §7 / §8 |
| `infra` | library crate | repository、resolver、backend、handoff、publisher、config、runtime builder adapters | §4 / §7 / §11 |
| `api` | library crate + binary package | `Sandbox Sync Entry` | §4 / §7 |
| `worker` | library crate + binary package | async consumer、controlled execution fulfillment、event relay worker | §4 / §7 |
| `jobs` | library crate + binary package | operations jobs | §7 / §8 |

### 4.3 目录 / package / crate / binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `crates/contracts` | library crate | `sandbox-contracts` | `sandbox_contracts` | 公共协议契约 | 是 |
| `crates/domain` | library crate | `sandbox-domain` | `sandbox_domain` | 领域对象与不变量 | 否 |
| `crates/application` | library crate | `sandbox-application` | `sandbox_application` | 应用编排与 port trait | 否 |
| `crates/infra` | library crate | `sandbox-infra` | `sandbox_infra` | adapter、repository、config、runtime builder | 否 |
| `crates/api` | library crate + binary | `sandbox-api` | `sandbox_api` / `sandbox-api` | 同步入口 | 否 |
| `crates/worker` | library crate + binary | `sandbox-worker` | `sandbox_worker` / `sandbox-control-worker`;`sandbox-fulfillment-worker` | 异步 consumer 和 fulfillment worker | 否 |
| `crates/jobs` | library crate + binary | `sandbox-jobs` | `sandbox_jobs` / job binary names | 后台维护任务 | 否 |

### 4.4 文件布局树

正式正文应摘录 `design-calibration/03_ddd_step_04_file_layout.md` §9.4 的 planned tree,保留 workspace root、7 个 crate 和 root `tests/` 的完整最小文件集合。

### 4.5 Cargo 依赖

唯一当前允许的 sibling path dependency 是:

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

运行期依赖、事件协作依赖、基础设施依赖、downstream handoff target 和 backend 产品不得写入 Cargo path dependency;后续通过 port、adapter、event、handoff、safe summary、backend capability 和 fake seam 表达。

---

## 11. 待确认事项

| 待确认项 | 当前状态 | 是否阻塞 Step 5 | 处理口径 |
|---|---|---|---|
| 目标实现仓 `/home/aris/Projects/quantalithos-sandbox` 当前未发现 | open_for_07 | 否 | Step 4 仍定义 planned layout;Step 17 / `07` 必须作为 PH-01 前置检查。 |
| 目标仓 edition / rust-version | open_for_step_17_or_07 | 否 | 不能从 `quantalithos-core` 直接复制为已落盘事实;目标仓创建后确认。 |
| member dependency matrix | open_for_step_5 | 否 | Step 5 定义模块实现契约主轴时继续收口 crate 依赖方向。 |
| 具体 backend product 子目录 | open_for_step_7_14_and_04_07 | 否 | 当前只定义 `isolation_backend_adapters.rs` seam,不锁 Docker / gVisor / Firecracker / k8s。 |
| migrations / scripts / artifacts / reports | open_for_05_06_07 | 否 | 当前不属于 Step 4 必需 layout;后续测试 / 验收 / 实施文档决定。 |

---

## 12. 进入下一步条件

- 已明确 project slug = `sandbox`。
- 已明确 planned target path = `/home/aris/Projects/quantalithos-sandbox`,并记录当前未发现目标仓。
- 已明确采用 workspace 多 crate 架构。
- 已明确 `contracts/domain/application/infra/api/worker/jobs` 七个实现单元。
- 已明确目录 / package / crate / binary 映射。
- 已输出可直接创建的 planned 文件布局树和文件职责表。
- 已明确 root `Cargo.toml` 中 `core-contracts` path dependency 写法。
- 已明确运行期 / 事件协作 / backend / handoff target 不进入 Cargo path dependency。
- 用户审查通过后,可以进入 Step 5 “定义模块实现契约主轴”。
