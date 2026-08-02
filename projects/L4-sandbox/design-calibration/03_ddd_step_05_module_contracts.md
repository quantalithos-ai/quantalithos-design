# Step 5. 定义模块实现契约主轴

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 5
> 回填章节: `03-详细设计.md` §5 模块实现契约
> 生成日期: 2026-07-09
> 状态: completed_wait_user_review
> 所属流程: `03_ddd_calibration_flow.md`
> 本 Step 口径: 在 Step 4 已固定 workspace 多 crate planned layout 的前提下,把 `L4-sandbox` 的详细设计主轴收敛为 7 个实现模块,并把正式 `02-概要设计.md` 的 6 个主要组成部分映射到模块职责、暴露面、依赖方向和后续 Step 6~10 的归属入口。本步不定义对象字段、函数签名、trait 方法、DTO schema、状态矩阵、持久化 shape、配置 key、测试用例或实施 boundary。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 5 | 是。Step 4 审查点后用户已回复“同意”,允许进入 Step 5。 |
| 项目级台账是否允许进入 Step 5 | 是。`project_execution_ledger.md` 原恢复点为 Step 4 `pass_wait_review`,用户确认后可进入 Step 5。 |
| 文档级 flow 是否允许进入 Step 5 | 是。`03_ddd_calibration_flow.md` 原记录 Step 5 `blocked_by_step_4_review`,用户确认后门禁满足。 |
| 是否已读取 Step 4 中间产物 | 是。Step 4 已固定 7 个 workspace member、package / crate / binary、planned 文件树和 `core-contracts` root path dependency。 |
| 是否已读取详细设计 SOP Step 5 | 是。本步必须输出模块总览表、每个模块职责、模块间调用 / 依赖图,并回答对象 / trait / handler / repository 的归属。 |
| 是否已读取详细设计书写规范 §5.5 | 是。正式 §5 后续必须按模块展开 capability、对象、trait、错误和测试切口,但本步只先收稳主轴。 |
| 是否已读取上游正式 `00/01/02` 和 `02` 承接清单 | 是。当前模块主轴承接 execution isolation truth、coherent boundary、policy fail-closed、capture / handoff、failure / cleanup / redline 和 read-side no-write。 |
| 是否发现阻塞 Step 5 的上游 blocker | 否。目标实现仓当前未发现、`04/07` 缺失和后端 / 配置 / handoff 细节未闭口仍为后续门禁,不阻塞本步定义模块主轴。 |

---

## 2. 本步目标

本步要把 `L4-sandbox` 后续详细设计的主组织轴固定下来。正式 `02` 的 6 个主要组成部分是业务结构主语,Step 4 的 7 个 workspace member 是实现模块主轴。本步要让后续 Step 6~17 都能回答“这个对象、trait、DTO、handler、repository、flow、state、error 和 test cut 应该落在哪个模块”。

本步要收稳:

- 详细设计的 7 个实现模块。
- 每个模块对应的 workspace member、package、crate 和主要职责。
- 6 个概要主要组成部分如何跨 `contracts/domain/application/infra/api/worker/jobs` 实现。
- 每个模块对外暴露什么,禁止暴露什么。
- 每个模块允许依赖与禁止依赖的方向。
- 对象、trait、handler、repository、adapter、worker 和 job runner 的归属门禁。
- Step 6 对象契约和 Step 7 trait / port / adapter 契约的承接入口。

本步不处理:

- Rust struct / enum 字段、enum variant、factory、member function 和 invariant。
- trait / port / adapter 的完整函数签名。
- Command / Query / Event / Job request / response / receipt / error schema。
- transaction boundary、repository 方法、DDL、索引、outbox 记录、projection rebuild 细节。
- configuration key、默认值、env var、product profile、后端产品选择。
- 测试 case、验收 evidence、implementation boundary、commit plan。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `03_ddd_step_03_constraints.md` | 已完成 | 提供 Rust、源码英文、`core-contracts` 唯一编译期 sibling 依赖和运行期 / 事件协作依赖隔离口径。 |
| `03_ddd_step_04_file_layout.md` | 已完成且用户已确认继续 | 提供 workspace 多 crate planned layout、7 个实现单元、文件树、文件职责和 binary / job 名称。 |
| `projects/L4-sandbox/00-需求文档.md` | 当前正式需求基线 | 提供 C-SBX-1~5、数据归属、接口依赖、NFR、验收红线和一票否决项。 |
| `projects/L4-sandbox/01-架构设计.md` | 当前正式架构基线 | 提供独立 execution isolation truth、依赖裁剪、数据所有权、运行承载和 fail-closed / cleanup / redline 架构底线。 |
| `projects/L4-sandbox/02-概要设计.md` §4~§12 | 当前直接上游 | 提供代码主体框架、6 个主要组成部分、关键对象轮廓、接口骨架、处理流、状态机、异常和配置影响。 |
| `02_hld_step_05_components_boundary.md` | 已读取 | 提供 6 个主要组成部分、capability、非职责、接缝和对象候选池。 |
| `02_hld_step_12_detailed_design_handoff.md` | 已读取 | 提供 `03` 必须继续展开且不能重发明的代码主体、对象、接口、flow、状态和配置实现契约方向。 |
| `standards/document/详细设计讨论流程_SOP.md` Step 5 | 已读取 | 约束本步必须回答模块拆分、概要映射、暴露面、依赖方向和归属问题。 |
| `standards/document/详细设计书写规范.md` §5.5 | 已读取 | 约束正式 §5 的模块总览表、单模块小节、capability 到对象映射和后续对象 / trait / error / test cut 结构。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已读取 | 约束模块 owner、类型归属、DTO / 对象 / flow / state 后续闭环和禁止实现侧自行补真相源。 |
| `projects/L1-artifact/design-calibration/03_ddd_step_05_module_contracts.md` | 已读取 | 参考 7 模块主轴、依赖图和业务主语跨模块映射粒度。 |
| `projects/L1-governance/design-calibration/03_ddd_step_05_module_contracts.md` | 已读取 | 参考 Step 5 的职责表、归属门禁和 entry module 边界写法。 |
| 旧 `projects/L4-sandbox/03-详细设计.md` | historical_material | 仅用于识别旧单 crate `src/`、旧五段对象、旧 command / provider bridge 和 replay / artifact / audit 混层风险。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取项目级台账、`03` flow、Step 4、详细设计 SOP Step 5 和书写规范 §5.5。 | done | 确认用户确认 Step 4 后允许进入 Step 5。 |
| 2 | 从正式 `00/01/02` 提取模块主轴必须保护的 truth、dependency、read / write 和安全边界。 | done | 明确模块主轴必须闭合 sandbox 重点边界。 |
| 3 | 对照 L1-artifact / L1-governance Step 5 粒度。 | done | 采用 7 个 workspace member 作为实现模块主轴。 |
| 4 | 诊断旧 `03` 的旧模块 / 旧对象 / 旧目录污染。 | done | 确认旧五段主线不继承。 |
| 5 | 回答 SOP Step 5 五个问题。 | done | 固定模块拆分、概要映射、对外暴露、依赖方向和归属门禁。 |
| 6 | 输出模块总览、模块依赖图、六个主要组成部分到模块映射、模块职责骨架和 Step 6 承接表。 | done | 后续 Step 6 可按模块展开对象实现契约。 |
| 7 | 更新 `03_ddd_calibration_flow.md` 和项目级台账。 | done | 当前恢复点停在 Step 5 审查点,不跨到 Step 6。 |
| 8 | 自检未修改正式 `03-详细设计.md`,未创建实现仓或代码,未提交 commit。 | done | 进入用户审查点。 |

---

## 5. SOP 问题回答

### 5.1 本仓详细设计应该拆成哪些实现模块?

详细设计实现模块与 Step 4 的 workspace member 对齐,固定为 7 个模块:

- `contracts`
- `domain`
- `application`
- `infra`
- `api`
- `worker`
- `jobs`

正式 `02` 的 6 个主要组成部分不是 crate 边界,不能拆成 6 个业务 crate。它们跨上述 7 个模块共同实现:

- `Controlled execution intake and identity`
- `Boundary establishment and enforcement`
- `Policy execution decision`
- `Execution capture and material handoff`
- `Failure control and safety closure`
- `Local reference, projection and derived support`

### 5.2 每个模块对应概要设计中的哪个主要组成部分或代码主体?

| 模块 | 对应概要代码主体 / 接口族 | 对应主要组成部分 |
|---|---|---|
| `contracts` | Command / Query / Consumer / Event / Job / View / Receipt / Error 公共协议骨架 | 6 个主要组成部分的 public protocol、view、receipt 和 report surface |
| `domain` | Domain Model | 6 个主要组成部分中的 truth、decision、guard、state、capture / handoff / failure / cleanup / redline 主体 |
| `application` | Application Services;External / Infrastructure Port trait owner | 6 个主要组成部分的 command / query / consumer / job orchestration 和事务 / 幂等 / no-write / no-rollback 规则 |
| `infra` | Ports / Persistence / Projection / Handoff 的 adapter 层 | refs / safe summary、policy summary、backend capability、isolation backend、handoff、publisher、repository、config 和 runtime wiring |
| `api` | `Sandbox Sync Entry` | 同步 Command / Query 入口,承接正式受理、裁定、读取和 error mapping |
| `worker` | `Sandbox async control and handoff consumption unit`;`Sandbox controlled execution fulfillment unit` | 异步 consumer、feedback、control、fulfillment 和 relay loop |
| `jobs` | `Sandbox backend maintenance and cleanup unit`;Operations Job | reference refresh、backend capability refresh、handoff retry、lease / orphan reaper、cleanup guard、redline、projection rebuild、derived maintenance 和 reconciliation |

### 5.3 每个模块对外暴露什么?

- `contracts` 对外暴露 public DTO、typed ref wrapper、metadata carrier、view、event payload、job input / report、receipt 和 protocol error。
- `domain` 只向本仓 `application` 暴露领域对象、value object、state、guard、domain record、domain policy 和 `DomainError`。
- `application` 暴露 service facade、repository / resolver / backend / handoff / publisher trait、UnitOfWork、idempotency 和 `ApplicationError` 给 `api/worker/jobs/infra` 装配使用。
- `infra` 暴露 repository adapter、resolver adapter、backend adapter、handoff adapter、publisher、config、runtime builder 和 fake assembly。
- `api` 暴露 sync command / query handlers、routes / RPC assembly 和 `ApiError`。
- `worker` 暴露 consumer、fulfillment loop、relay loop、worker runtime 和 `WorkerError`。
- `jobs` 暴露 one-shot job runner、job report mapping 和 `JobsError`。

### 5.4 每个模块允许依赖哪些模块,禁止依赖哪些模块?

依赖方向固定为单向:

- `contracts` 只允许依赖 `core-contracts`。
- `domain` 只允许依赖 `contracts` 和 `core-contracts`。
- `application` 只允许依赖 `domain`、`contracts` 和 `core-contracts`。
- `infra` 只允许依赖 `application`、`domain`、`contracts` 和 `core-contracts`。
- `api`、`worker`、`jobs` 只允许依赖 `application`、`infra`、`contracts` 和 `core-contracts`。

明确禁止:

- `contracts` 依赖 `domain/application/infra/api/worker/jobs`。
- `domain` 依赖 repository、adapter、config、HTTP、bus、DB、backend SDK 或 entry module。
- `application` 依赖 `infra/api/worker/jobs` 或任何 backend / sibling repo SDK。
- `api`、`worker`、`jobs` 互相依赖。
- 新增 `shared`、`common`、`utils` 等无 owner 模块。
- 除 `core-contracts` 外把 `L0-bus`、`L1-identity`、`L1-work`、`L2-tools`、`L2-runtime`、`L2-member-service`、`L1-artifact`、`L4-observability`、`L5-runner`、policy source 或 isolation backend 写成 Cargo dependency。

### 5.5 哪些对象、trait、handler、repository 应归属于哪个模块?

| 类型 | 正式归属模块 | 归属说明 |
|---|---|---|
| typed refs、metadata、Command / Query / Event / Job DTO、View、Receipt、PublicError | `contracts` | 作为 public protocol surface,不得携带 domain 私有状态或 repository 语义。 |
| `ControlledExecutionContext`、`ExecutionEnvironmentIdentity`、`CoherentBoundary`、`PolicyExecutionDecision`、`ControlledExecutionRun`、`CaptureFact`、`HandoffFact`、`FailureClassification`、`CleanupGuard`、`RedlineContainment` 等 | `domain` | 作为 sandbox execution isolation truth、decision、guard、state 和 record owner。 |
| command / query / consumer / job service、repository trait、resolver trait、backend trait、handoff trait、publisher trait、UoW、idempotency | `application` | 作为 use case orchestration 与 port owner,不实现 durable adapter。 |
| repository adapter、projection store、reference store、policy adapter、backend capability adapter、isolation backend adapter、handoff adapter、publisher、config、runtime builder | `infra` | 作为 application port 的实现层,不定义业务 truth。 |
| synchronous command / query handler | `api` | 只做 protocol mapping、调用 application service 和 error mapping。 |
| inbound consumer、handoff feedback consumer、backend lifecycle consumer、fulfillment loop、relay loop | `worker` | 只消费异步输入、调用 application service,不得绕过 application 写核心 truth。 |
| operations job runner | `jobs` | 只执行维护 / 发布 / 重试 / 重建 / 对账 / 回收任务,不得作为业务 command 或核心 truth repair 通道。 |

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `03-详细设计.md` | 旧文档按 `SandboxExecution / SandboxSession / SandboxCommand / SandboxOutput / control` 五段对象和单 crate `src/` 目录组织,还混入 replay、provider bridge、artifact evidence 和 observability store 线索。 | 本步完全不继承旧模块主轴,只把旧内容作为 historical material / pollution risk。 |
| `02-概要设计.md` §5 | 已固定 6 个业务主要组成部分,但它们不是 crate 边界。 | 本步把 6 个业务主语映射到 7 个实现模块,避免业务组成部分被误拆 crate。 |
| `03_ddd_step_04_file_layout.md` | 已固定 workspace member 与文件布局,但还缺少 ownership、exposure 和 dependency 门禁。 | 本步补齐模块职责、对外暴露、依赖方向和归属规则。 |
| 后续 Step 6 | 对象候选池很大,如果没有模块主轴,容易把 DTO、view、adapter state 或 job runner 误写成 domain truth。 | 本步提供 Step 6 承接表,要求对象按模块 capability 回指。 |
| 后续 Step 7~10 | trait、protocol、flow 和 state 若没有 owner,实现者会自行补 repository、event、state 或 DTO 名称。 | 本步固定 trait owner 在 `application`、adapter owner 在 `infra`、protocol owner 在 `contracts`、entry owner 在 `api/worker/jobs`。 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 模块主轴 | 只有 Step 4 的 workspace member 和文件职责。 | 固定为 7 个正式实现模块及其职责、暴露面和依赖门禁。 | 让后续对象 / trait / protocol / flow 有稳定 owner。 |
| 业务组成部分 | `02` 中 6 个主要组成部分停留在概要层。 | 明确 6 个组成部分如何跨 `contracts/domain/application/infra/api/worker/jobs` 实现。 | 防止把业务主语误写成 crate。 |
| 依赖方向 | Step 3/4 给出原则和 root path dependency。 | 本步给出 module dependency matrix 和 forbidden dependency。 | 支撑 Cargo 依赖和代码 review 门禁。 |
| handler / worker / job | Step 4 只有入口文件名。 | 本步明确它们只是 entry / runner,不拥有 truth、port trait 或 repository 语义。 | 防止入口模块吞掉业务语义。 |
| cross-cutting support | reference、projection、relay、handoff、observability material 容易跨模块散落。 | 本步按 contracts / domain / application / infra 分层切开 public surface、truth identity、orchestration 和 adapter。 | 防止 read-side、relay 或 handoff 反写核心 truth。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 以 7 个 workspace member 作为详细设计模块主轴 | 与 Step 4 一致,Cargo 能强化依赖方向,contracts / domain / application / infra / entry module 边界清晰。 | 6 个业务组成部分需要跨模块映射。 | 采用。 |
| B. 以 6 个业务主要组成部分作为 crate / module 主轴 | 业务语义直观。 | 每个组成部分都会跨 DTO、domain、service、repo、adapter、view 和 job,容易制造循环依赖。 | 不采用。 |
| C. 继承旧 `03` 的五段对象主线 | 看似接近旧材料。 | 旧主线混入 runtime、tools、artifact、observability、provider bridge 和 replay 语义,与当前 `00/01/02` 冲突。 | 不采用。 |
| D. 单独拆 `projection`、`config`、`observability` crate | 派生 / 配置 / 观测看起来独立。 | 当前无独立编译复用必要,且容易让派生 / 配置 / 观测反写 truth。 | 不采用。 |
| E. 增加 `shared/common/utils` | 短期复用方便。 | 违反目录规范,会形成无 owner 的类型和 helper 池。 | 不采用。 |

---

## 9. 结构化中间产物

### 9.1 模块总览表

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 依赖对象 |
|---|---|---|---|---|
| `contracts` | `crates/contracts` / `sandbox-contracts` / `sandbox_contracts` | 定义 public protocol、typed refs、metadata、view、event、job、receipt 和 protocol error。 | DTO、view、event payload、job report、receipt、public error、fixtures。 | `core-contracts` |
| `domain` | `crates/domain` / `sandbox-domain` / `sandbox_domain` | 定义 sandbox truth object、state、guard、policy decision、capture / handoff / failure / cleanup / redline record 和 domain error。 | domain objects、value objects、state enum、guard、DomainError。 | `contracts`;`core-contracts` |
| `application` | `crates/application` / `sandbox-application` / `sandbox_application` | 编排 command / query / consumer / job use case、事务、幂等、port 调用、no-write / no-rollback 和 error mapping。 | services、ports、UnitOfWork、IdempotencyRepository、ApplicationError。 | `domain`;`contracts`;`core-contracts` |
| `infra` | `crates/infra` / `sandbox-infra` / `sandbox_infra` | 实现 repository / resolver / backend / handoff / publisher / config / runtime builder 和 fake assembly。 | adapters、repositories、stores、config、runtime_builder、InfraError。 | `application`;`domain`;`contracts`;`core-contracts` |
| `api` | `crates/api` / `sandbox-api` / `sandbox_api`;bin `sandbox-api` | 承接同步 Command / Query 入口。 | command handlers、query handlers、routes、ApiError。 | `application`;`infra`;`contracts`;`core-contracts` |
| `worker` | `crates/worker` / `sandbox-worker` / `sandbox_worker`;bins `sandbox-control-worker`,`sandbox-fulfillment-worker` | 承接异步 consumer、handoff feedback、backend lifecycle、controlled execution fulfillment 和 event relay loop。 | consumers、worker runners、worker runtime、WorkerError。 | `application`;`infra`;`contracts`;`core-contracts` |
| `jobs` | `crates/jobs` / `sandbox-jobs` / `sandbox_jobs`;job binaries | 承接 one-shot operations jobs。 | job runners、job report mapping、JobsError。 | `application`;`infra`;`contracts`;`core-contracts` |

### 9.2 模块依赖图: L4-sandbox 模块实现主轴

```text
+------------------+
|  core-contracts  |
+---------+--------+
          ^
          |
+---------+-----+
|   contracts   |
+---------+-----+
          ^
          |
+---------+-----+
|     domain    |
+---------+-----+
          ^
          |
+---------+-----+<-----------------------------+
|  application  |                              |
+---------+-----+                              |
          ^                                    |
          | implements ports                   |
+---------+-----+                              |
|      infra    |------------------------------+
+---+-----+---+-+
    ^     ^   ^
    |     |   |
+---+-+ +-+---+ +----+
| api | |worker| |jobs|
+-----+ +------+ +----+
```

关键说明:

- 图表达 crate / module 依赖方向,不表达函数级处理流或运行时调用顺序。
- `application` 是 service 和 port trait owner,`infra` 实现这些 port,但 `application` 不依赖 `infra`。
- `api`、`worker`、`jobs` 都是入口 / runner 模块,通过 `infra::runtime_builder` 获得 application service 装配。
- `contracts` 不感知 `domain`,因此 public protocol 中的共享 refs、reason、marker、view、receipt 必须定义在 `contracts` 或 `core-contracts`。
- 非 `core-contracts` sibling repo、event bus、backend SDK 和外部系统都不能进入 Cargo dependency。

### 9.3 6 个主要组成部分到模块映射表

| 主要组成部分 | 主 owner 模块 | 共同参与模块 | 映射说明 |
|---|---|---|---|
| `Controlled execution intake and identity` | `domain` + `application` | `contracts`;`infra`;`api`;`worker`;`jobs` | context / identity truth 在 `domain`,受理编排在 `application`,public command/query 在 `contracts`,resolver adapter 在 `infra`,同步入口在 `api`,context event / refresh 在 `worker/jobs`。 |
| `Boundary establishment and enforcement` | `domain` + `application` | `contracts`;`infra`;`api`;`worker`;`jobs` | boundary / decision / capability interpretation 在 `domain`,establish orchestration 在 `application`,backend capability 和 isolation backend adapter 在 `infra`。 |
| `Policy execution decision` | `domain` + `application` | `contracts`;`infra`;`api`;`worker`;`jobs` | policy applicability / execution decision 在 `domain`,policy summary / high-risk orchestration 在 `application`,policy source adapter 在 `infra`,policy summary consumer / refresh 在 `worker/jobs`。 |
| `Execution capture and material handoff` | `domain` + `application` | `contracts`;`infra`;`api`;`worker`;`jobs` | run / capture / handoff fact 在 `domain`,capture / handoff orchestration 在 `application`,handoff / observability / investigation adapter 在 `infra`,feedback consumer 和 retry job 在 `worker/jobs`。 |
| `Failure control and safety closure` | `domain` + `application` | `contracts`;`infra`;`api`;`worker`;`jobs` | failure / control / lease / orphan / cleanup / redline truth 在 `domain`,control / cleanup / containment orchestration 在 `application`,lifecycle / investigation adapters 在 `infra`,async control 和 reaper jobs 在 `worker/jobs`。 |
| `Local reference, projection and derived support` | `application` + `infra` | `contracts`;`domain`;`api`;`worker`;`jobs` | public view 在 `contracts`,projection identity / relay record 在 `domain`,query / derived / reconciliation orchestration 在 `application`,stores / rebuild adapters 在 `infra`,query entry 在 `api`,maintenance 在 `worker/jobs`。 |

### 9.4 模块职责骨架

#### `contracts` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/contracts` / `sandbox-contracts` |
| 对应概要设计主要组成部分 | 6 个组成部分的 public protocol、read surface、event surface、job surface。 |
| 主要责任 | 定义跨入口和下游可复用的 DTO、typed refs、metadata、view、event、job、receipt 和 public error。 |
| 对外暴露 | `refs`;`metadata`;`commands`;`queries`;`events`;`jobs`;`views`;`receipts`;`errors`;`fixtures`。 |
| 允许依赖 | `core-contracts`。 |
| 禁止依赖 | `domain`;`application`;`infra`;`api`;`worker`;`jobs`;非 `core-contracts` sibling repo;backend SDK。 |

#### `domain` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/domain` / `sandbox-domain` |
| 对应概要设计主要组成部分 | 6 个组成部分的 truth、decision、state、guard 和 record 主体。 |
| 主要责任 | 定义 execution context、environment identity、coherent boundary、policy decision、run、capture、handoff、failure、control、cleanup、redline、reference state、projection identity、relay record、audit trace 和 invariant。 |
| 对外暴露 | domain objects、value objects、state enum、guard / policy、`DomainError`。 |
| 允许依赖 | `contracts`;`core-contracts`。 |
| 禁止依赖 | repository、adapter、config、HTTP、bus、DB、object store、isolation backend SDK、`application/infra/api/worker/jobs`。 |

#### `application` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/application` / `sandbox-application` |
| 对应概要设计主要组成部分 | 11 个 application service 主体、Command / Query / Consumer / Job orchestration 和 port trait owner。 |
| 主要责任 | 编排 intake、environment、boundary、policy、run、capture / handoff、failure / control、cleanup、redline、query、consumer、derived、relay 等 use case。 |
| 对外暴露 | service facade、repository / resolver / backend / handoff / publisher traits、UnitOfWork、idempotency、`ApplicationError`。 |
| 允许依赖 | `domain`;`contracts`;`core-contracts`。 |
| 禁止依赖 | `infra`;`api`;`worker`;`jobs`;backend SDK;DB;bus;HTTP client;相邻仓源码。 |

#### `infra` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/infra` / `sandbox-infra` |
| 对应概要设计主要组成部分 | persistence、projection、reference / safe summary、policy summary、backend capability、isolation backend、handoff、event publisher、config、runtime assembly。 |
| 主要责任 | 实现 `application` port,提供 fake / durable adapter、config validation surface 和 runtime builder。 |
| 对外暴露 | repositories、stores、resolvers、policy adapters、backend adapters、handoff adapters、publishers、config、runtime_builder、`InfraError`。 |
| 允许依赖 | `application`;`domain`;`contracts`;`core-contracts`。 |
| 禁止依赖 | `api`;`worker`;`jobs`;让 adapter 改写 domain 不变量;让配置改变 truth / boundary / fail-closed / cleanup / redline 语义。 |

#### Entry 模块

| 模块 | 必须承载 | 不得承载 | 后续展开位置 |
|---|---|---|---|
| `api` | sync command / query handler、request mapping、response mapping、route / RPC assembly、API error mapping。 | domain 私有判断、repository 直接访问、worker/job 调用、长期状态。 | Step 8 Command / Query protocol;Step 9 handler flow。 |
| `worker` | inbound consumer、handoff feedback consumer、backend lifecycle consumer、fulfillment worker、relay worker、worker runtime。 | 核心 truth repair、one-shot operations job、public query surface、绕过 application 写 repository。 | Step 8 Consumer / Event protocol;Step 9 consumer / worker flow;Step 13 重入。 |
| `jobs` | one-shot operations job runner、report mapping、cursor / batch orchestration、maintenance error mapping。 | API 行为、常驻 consumer loop、核心 truth repair、绕过 cleanup guard 的回收。 | Step 8 Job protocol;Step 9 job flow;Step 16 job test cuts。 |

### 9.5 实现单元到 planned module skeleton

| 实现单元 | planned module / file group | 责任边界 | 后续承接 |
|---|---|---|---|
| `contracts` | `refs`;`metadata`;`commands`;`queries`;`events`;`jobs`;`views`;`receipts`;`errors`;`fixtures` | public protocol surface,不包含 domain invariant 和 adapter detail。 | Step 8 DTO / schema;Step 16 contract tests。 |
| `domain` | `execution_context`;`environment_identity`;`boundary`;`backend_capability`;`policy_decision`;`run`;`capture`;`handoff`;`failure`;`control`;`cleanup`;`redline`;`reference_state`;`projection`;`event_relay`;`audit_trace`;`policies`;`errors` | sandbox truth / state / guard / decision / record owner。 | Step 6 对象契约;Step 10 状态矩阵;Step 12 error model。 |
| `application` | `services`;`intake_service`;`environment_service`;`boundary_service`;`policy_service`;`run_service`;`capture_handoff_service`;`failure_control_service`;`cleanup_service`;`redline_service`;`query_service`;`consumer_service`;`derived_service`;`relay_service`;`ports`;`unit_of_work`;`idempotency`;`errors` | use case orchestration、port owner、transaction / idempotency / no-write / no-rollback owner。 | Step 7 port;Step 9 flow;Step 11 transaction;Step 13 idempotency。 |
| `infra` | `config`;`runtime_builder`;`truth_repositories`;`projection_repositories`;`reference_stores`;`event_relay_store`;`idempotency_store`;`context_resolvers`;`policy_adapters`;`backend_capability_adapters`;`isolation_backend_adapters`;`handoff_adapters`;`publishers`;`clock_id`;`errors` | application port implementations and runtime assembly,不定义业务语义。 | Step 7 adapter;Step 11 persistence;Step 14 config binding。 |
| `api` | `command_handlers`;`query_handlers`;`routes`;`errors`;bin `sandbox-api` | sync entry mapping and API error mapping。 | Step 8 / 9 command-query handling。 |
| `worker` | `control_consumers`;`handoff_consumers`;`backend_consumers`;`fulfillment_worker`;`event_relay_worker`;`worker_runtime`;`errors`;worker bins | async consumer / worker loop entry。 | Step 8 consumer / event;Step 9 worker flow。 |
| `jobs` | `event_relay_publish`;`reference_refresh`;`backend_capability_refresh`;`material_handoff_retry`;`lease_orphan_reaper`;`cleanup_guard_evaluation`;`redline_handoff_maintenance`;`projection_rebuild`;`derived_maintenance`;`reconciliation`;`errors`;job bins | one-shot maintenance runner。 | Step 8 job I/O;Step 9 job flow;Step 16 job tests。 |

### 9.6 归属门禁表

| 设计项 | 必须归属 | 禁止归属 / 禁止做法 |
|---|---|---|
| public DTO / view / receipt / protocol error | `contracts` | 不得定义在 `api` 私有 handler 或 `application` service 内。 |
| sandbox truth object / state enum / guard / domain record | `domain` | 不得定义在 `application` helper、repository adapter、worker 或 job runner 内。 |
| repository / resolver / backend / handoff / publisher trait | `application` | 不得由 `infra` 私自定义 trait 后让 service 反向依赖。 |
| durable / fake repository adapter | `infra` | 不得进入 `application` 或 `domain`。 |
| context / policy / backend / handoff external adapter | `infra` | 不得把 external SDK 或 sibling repo 类型暴露到 `contracts/domain/application`。 |
| command / query handler | `api` | 不得直接写 repository 或绕过 application service。 |
| consumer / fulfillment / relay loop | `worker` | 不得修核心 truth,不得与 `jobs` 互相调用。 |
| operations job runner | `jobs` | 不得作为业务 command,不得绕过 cleanup guard 或 redline containment。 |
| read projection / derived view identity | `contracts` public view + `domain` identity + `application` orchestration + `infra` store | 不得由 query 临时拼 view ref 或反写核心 truth。 |
| event relay | `domain` relay record + `application` relay service + `infra` publisher + `worker/jobs` runner | 下游 publish failure 不得回滚 source truth。 |

### 9.7 模块依赖矩阵

| From / To | `core-contracts` | `contracts` | `domain` | `application` | `infra` | `api` | `worker` | `jobs` |
|---|---|---|---|---|---|---|---|---|
| `contracts` | allow | self | no | no | no | no | no | no |
| `domain` | allow | allow | self | no | no | no | no | no |
| `application` | allow | allow | allow | self | no | no | no | no |
| `infra` | allow | allow | allow | allow | self | no | no | no |
| `api` | allow | allow | no direct business call | allow | allow for assembly | self | no | no |
| `worker` | allow | allow | no direct business call | allow | allow for assembly | no | self | no |
| `jobs` | allow | allow | no direct business call | allow | allow for assembly | no | no | self |

说明:

- `api/worker/jobs` 可以通过 `application` service 使用 domain 语义,但不得直接调用 domain object 执行业务判断。
- `infra` 可以依赖 `domain` 是为了实现 repository / adapter 类型转换,但不得以 adapter 决定 domain 不变量。
- `no direct business call` 表示入口模块不得绕过 `application` service 调用 domain transition。

### 9.8 Step 6 承接表

| Step 6 模块批次 | 必须闭口的对象组 | 可 defer 到后续 Step 的内容 | 进入 Step 6 门禁 |
|---|---|---|---|
| `contracts` shared vocabulary | typed refs、metadata carrier、public marker、reason、view identity、receipt shell、protocol error family 的 owner 决策 | exact DTO 字段全集进入 Step 8;serialization compatibility test 进入 Step 16 | public 类型 owner 不再漂移到 `application/api`。 |
| `domain` core truth | context、environment identity、boundary、backend capability summary、policy decision、run、capture、handoff、failure、control、cleanup、redline、reference state、projection identity、relay record、audit trace | repository trait、adapter detail、DTO 字段全集、transaction save order | 每个对象都能回指 6 个主要组成部分和 Step 4 file group。 |
| `application` service helper | service input / output carrier owner、idempotency record、UoW handle、application error group、service facade ownership | trait method signatures 进入 Step 7;flow exact order 进入 Step 9 | application 对象不吞 domain truth,只承接编排和 port owner。 |
| `infra` adapter state | config summary carrier、adapter outcome owner、fake parity state、runtime builder input group | durable schema、adapter function signatures、product-specific config | infra 对象只承接实现边界,不定义业务语义。 |
| `api` entry object | API handler input mapping shell、API error mapping owner | route / RPC exact schema 与 handler flow | API 只做 entry mapping,不直接拥有 command semantics。 |
| `worker` entry object | consumer receipt shell、worker runtime context、fulfillment loop report shell、relay loop result shell | event envelope DTO 与 consumer flow | worker 不修核心 truth,不与 jobs 互相依赖。 |
| `jobs` entry object | job input / report shell owner、job runner context、partial failure accumulator owner | exact job I/O schema、cursor / batch / retry flow | jobs 不作为业务 command,不绕过 guard。 |

---

## 10. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_05_module_contracts.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”和“待确认事项”小节,了解模块实现契约如何从概要设计骨架收敛到可继续 1:1 落码的模块主轴。

### 5. 模块实现契约

`L4-sandbox` 的详细设计以 7 个实现模块为主轴:`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。正式 `02-概要设计.md` 的 6 个主要组成部分是业务结构主语,不作为 crate 边界。它们跨 7 个实现模块完成 public protocol、domain truth、application orchestration、adapter implementation 和 entry runner。

模块依赖方向固定为:

```text
core-contracts
  <- contracts
      <- domain
          <- application
              <- infra
                  <- api / worker / jobs
```

其中 `application` 定义 port trait,`infra` 实现 port,`api/worker/jobs` 只作为入口或 runner 调用 application service。`contracts/domain/application` 不得依赖 `infra/api/worker/jobs`;`api/worker/jobs` 不得互相依赖;除 `core-contracts` 外,任何 sibling repo、event bus、backend SDK 或外部系统都不得进入 Cargo dependency。

模块总览如下:

| 模块 | 主要责任 | 禁止事项 |
|---|---|---|
| `contracts` | public DTO、typed refs、metadata、view、event、job、receipt、protocol error | 不承载 domain invariant、repository trait、adapter detail |
| `domain` | sandbox truth object、state、guard、decision、capture / handoff / failure / cleanup / redline record | 不依赖 repository、adapter、config、backend、entry module |
| `application` | command / query / consumer / job service、port trait、UoW、idempotency、no-write / no-rollback | 不依赖 `infra`,不直接依赖 sibling repo 或 backend SDK |
| `infra` | repository / resolver / backend / handoff / publisher adapter、config、runtime builder | 不定义业务 truth,不让配置改写核心语义 |
| `api` | sync command / query handler | 不直接访问 repository,不拥有 truth |
| `worker` | consumer、feedback、fulfillment、relay loop | 不修核心 truth,不作为 one-shot job |
| `jobs` | maintenance / retry / rebuild / reconcile / reap one-shot runner | 不作为业务 command,不绕过 guard |

后续 Step 6 必须按上述模块主轴展开对象实现契约;Step 7 必须按 `application` port owner 与 `infra` adapter owner 展开 trait / adapter;Step 8 必须把 public protocol 收口到 `contracts`;Step 9~10 必须让 flow 和 state 回指对应 module owner。

---

## 11. 待确认事项

| 待确认 | 当前处理 | 是否阻塞 Step 6 |
|---|---|---|
| 目标实现仓 `/home/aris/Projects/quantalithos-sandbox` 当前未发现 | 作为 Step 17 / `07` 实施前置检查;当前只写 planned layout 和 module contract。 | 否 |
| `core-contracts` 中 shared typed ref / metadata 具体可用类型 | Step 6 / Step 8 需要按当前实现或上游 contracts 可检索情况闭口;若缺失则回报上游缺口。 | 不阻塞进入 Step 6,但阻塞正式装配前的 exact schema。 |
| isolation backend、DB、object store、bus、observability、investigation 产品 | 保持 adapter / config / implementation plan 承接,不进入模块主轴。 | 否 |
| handoff ack / failed / retryable、material retention、cleanup release、redline investigation 回链 | 进入 Step 6 对象 owner、Step 7 port、Step 8 protocol、Step 9 flow 和 Step 10 state matrix 逐步闭口。 | 否 |
| 正式 `04-配置设计.md` 与 `07-实施计划.md` 缺失 | downstream blocker;后续进入对应文档时创建。 | 否 |

---

## 12. 自检

| 检查项 | 结果 |
|---|---|
| 是否修改正式 `03-详细设计.md` | 否。本步只创建 Step 5 中间产物并更新台账。 |
| 是否创建目标实现仓或 Rust 源码 | 否。 |
| 是否提前定义对象字段、trait 方法、DTO schema、状态矩阵或 DDL | 否。 |
| 是否把 tools semantic execution、runtime agent loop、member lifecycle、artifact truth、observability store 或 policy definition 混入 sandbox | 否。 |
| 是否新增上游 blocker | 否。仅保留既有 downstream / implementation 前置检查。 |
| 是否需要提交 commit | 否。用户未要求提交。 |

---

## 13. 进入下一步条件

```text
模块主轴已经稳定,且每个对象、trait、handler、repository、adapter、worker 和 job runner 都能找到归属模块。
```

用户确认本文件后,才能进入 Step 6 `逐模块定义对象实现契约`。Step 6 必须按模块小循环从 capability 推导对象、字段、函数、状态和不变量,不得从全局对象清单直接平铺。
