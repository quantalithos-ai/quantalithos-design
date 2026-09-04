# Step 5：定义模块实现契约主轴（重建版）

> 项目：`L2-member-service`
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 5
> 重建原因：2026-08-25 对照 `L1-governance`、详细设计 Step 6 SOP 与文件组织规范后，旧 Step 5 混用了业务组成部分、实现模块和运行入口，不能作为 Step 6 的文件归属真相源。
> 状态：completed_rebuild
> Gate：pass_with_upstream_blockers
> 日期：2026-08-25

> 格式校准基线：本 Step 采用 `projects/L1-governance/design-calibration/03_ddd_step_05_module_contracts.md` 的粒度顺序（Step 状态、输入、SOP 问题回答、问题诊断、取舍、结构化模块产物、逐模块职责 / 文件映射、依赖与 owner 审计、测试切口预告、回填草稿、Gate），但只移植表达格式，不移植 Governance 领域对象或实现结论。

## 1. 本步输入、范围与重建纪律

| 输入 | 本步采用的结论 | 本步不做什么 |
|---|---|---|
| `03_ddd_step_04_module_layout.md` | 采用 planned workspace 的七个 crate；2026-08-25 文件 owner 校正后，public view、application read path 与 entry object 均已有唯一候选文件 | 不创建实现仓、`Cargo.toml`、源码或测试 |
| `02-概要设计.md` §4~§12 与 `02_hld_step_12_detailed_design_handoff.md` | 七个 `CMP-MS-01~07` 是业务责任轴；29 个对象和 `IB-MS-001~017` 是详细设计输入 | 不把 CMP、对象池或 IB 编号直接改成 crate |
| `01-架构设计.md` | Host Truth Center、向内依赖、local-first、generation、single-active、seam 分类和 Host Truth 边界仍有效 | 不改写任何 owner、跨仓 truth 或架构边界 |
| `L1-governance` Step 5/6 | 参考“七实现模块为主轴、业务组成跨模块实现、非 core 模块对象在 Step 6 明确闭口”的方法 | 不复制治理领域对象、接口或实施事实 |
| `详细设计讨论流程_SOP.md` Step 5/6 与 `详细设计书写规范.md` §5.5 | Step 5 只固定模块、文件 owner、暴露面和依赖；Step 6 才逐模块写字段、函数、状态和对象卡片 | 不提前写 trait 方法、DTO schema、处理流或状态矩阵 |
| `子项目目录与代码文件组织规范.md` | workspace member 固定为 `crates/<role>`；文件按职责命名；不得用 `common`、`utils`、`manager` 作为桶 | 不把 sibling 文件、产品 client 或未确认脚本放入本仓文件树 |

本次只重建 Step 5。旧 `03_ddd_step_06_object_contracts.md` 已失去进入 Step 7 的资格，必须在本 Step 通过后删除并按新的模块与文件 owner 重建；在此之前不得创建 `03_ddd_step_07_trait_port_adapter_contracts.md`。

## 2. SOP 问题回答

### 2.1 本仓详细设计应该拆成哪些实现模块？

回答：详细设计唯一的实现模块主轴与 Step 4 的 workspace member 对齐，固定为以下七个模块：

```text
contracts / domain / application / infra / api / worker / jobs
```

`CMP-MS-01~07` 是 Host Truth 生命周期的业务责任切片，不是 crate、package、顶层目录或依赖方向。一个 CMP 会横跨 contracts DTO、domain object、application service/port、infra adapter 和一个或多个 entry module；一个 crate 也会承接多个 CMP。

### 2.2 每个模块对应哪个代码主体？

| 实现模块 | Step 4 实现单元 | 代码主体定位 |
|---|---|---|
| `contracts` | `crates/contracts` | 对外可传递 DTO、typed ref、reason、marker、view、receipt、event、job 与 protocol error |
| `domain` | `crates/domain` | 29 对象中除 public `SafeHostView` 外的 Host Truth、local record、state、policy 与纯 transition |
| `application` | `crates/application` | command/query/consumer/job use case、operation context、idempotency、stored result、port trait、UoW 编排 |
| `infra` | `crates/infra` | repository/store、resolver/publisher/adapter、config binding、runtime builder 与 fake/durable assembly |
| `api` | `crates/api` | 同步 command/query entry、metadata 校验、application context 构造和 handler disposition |
| `worker` | `crates/worker` | 常驻 signal/feedback consumer、outbox publisher loop、projection maintenance trigger |
| `jobs` | `crates/jobs` | scheduler 触发的一次性 host action、health、cleanup、reconciliation、publication、projection job entry |

### 2.3 每个模块对外暴露什么？

回答：仅 `contracts` 是跨仓可消费的 public protocol crate；其他六个 crate 的暴露面仅服务于本仓组装、entry 或测试，不构成对 sibling 的源码协作承诺。`domain` 对 `application` 暴露对象和 guard；`application` 对 entry 与 infra runtime builder 暴露 service facade 和 port trait；`infra` 对 entry 暴露受验证的 builder/assembly；`api`、`worker`、`jobs` 只暴露本进程入口，不互相作为业务依赖。

### 2.4 允许和禁止的依赖方向是什么？

回答：Cargo 依赖必须向内单向收敛。只有已确认的 `core-contracts` 可以作为 planned compile seam；所有 L1/L2/L4 sibling、Bus、SDK candidate、容器运行时、编排平台、数据库、RPC 与事件产品都只能通过 contracts、application port、infra adapter 或 fake seam 表达，不能因为运行期协作而成为 Cargo dependency。

### 2.5 对象、trait、handler、repository 如何归属？

回答：对象必须先按 crate，再按 Step 4 的唯一文件归属。业务 CMP 只说明“为什么需要”，不能替代“在哪个 crate/file 定义”。特别是 `SafeHostView` 属于 `contracts/src/views.rs`；`HostProjectionState` 属于 `domain/src/projection.rs`；view 的授权与组装属于 `application/src/use_cases/read.rs`；projection 的物理存储属于 `infra/src/persistence/projection_store.rs`。四者不可互换。

## 3. 当前文档问题诊断

| 位置 | 旧问题 | 本步重建处理 |
|---|---|---|
| 旧 Step 5 §2~§6 | `MOD-MS-00~11` 同时表示 CMP、domain/application 切片、persistence、adapter 与 entry | 废除其“模块主轴”资格；仅保留 `CMP-MS-01~07` 作为业务映射输入 |
| 旧 Step 5 依赖图 | 图同时混入调用时序、持久化流与 adapter 流，`application` 与 `infra` 的依赖方向不清 | 用七 crate compile dependency graph 与独立 runtime call seam 表替代 |
| 旧 Step 5 写入权矩阵 | 将 `MOD-MS-07` 称为 source writer，又称 derived/handoff 层 | 区分 domain semantic owner、application UoW writer、infra physical persistence 与 entry disposition |
| 旧 Step 6 | 以“29/29”替代全部 Step 6 对象闭口，且对象按 CMP 堆叠 | 29 个业务对象仍保留，但改为按七 crate/file 分批；补 contracts/application/infra/api/worker/jobs stable carrier |
| 旧 Step 6 support carrier | `HostActionDecisionRef`、`HostSafeSlice`、`VisibilityContext` 等已被引用但没有 owner/shape | Step 5 固定 owning crate/file；Step 6 必须先闭合全部当前边界二级 carrier |
| Step 4 原文件树 | public view 与 domain projection、read 与 handoff、entry disposition owner 有重叠 | 已在 Step 4 §9.1 最小校正，不改变 29 对象或上游边界 |

## 4. 改动前后对比与取舍

| 项 | 旧口径 | 新口径 | 原因 |
|---|---|---|---|
| 实现组织轴 | `MOD-MS-00~11` | `contracts/domain/application/infra/api/worker/jobs` | 必须与 workspace member、Cargo 依赖和文件树一致 |
| 业务组织轴 | CMP 和 MOD 基本一一绑定 | `CMP-MS-01~07` 通过映射矩阵跨七模块实现 | 避免每个业务组成部分形成循环 crate |
| 29 对象 | 被当成 Step 6 的全部对象 | 是冻结业务对象池；不排斥必需的非业务 carrier/entry object | Step 6 SOP 明确要求 non-core object 闭口决策 |
| public view | `SafeHostView` 隐含为 domain projection | public DTO 在 contracts；projection semantic state 在 domain；read assembly 在 application；store 在 infra | 防止 contracts 反向依赖 domain，防止 query 写 truth |
| version/revision | 领域、source、projection、CAS 共用 `revision` 名称 | Step 6 逐一拆为 domain basis、repository version、committed cursor、external source version | 不让 cursor/source version 伪装 optimistic lock |
| entry 状态 | 仅有 Host 生命周期状态 | API/worker/jobs 各有非 Host lifecycle 的 entry/disposition carrier | 防止实现者把调度、消费和 handler 结果写入 Host Truth |

| 方案 | 结论 | 原因 |
|---|---|---|
| 每个 CMP 独立 crate | 不采用 | 一个 CMP 必然同时需要 DTO、domain、service、port、adapter 与入口，容易形成循环依赖 |
| 七 crate 作为唯一实现模块主轴 | 采用 | 与 Step 4 文件布局、目录组织规范和 L1-governance 的可落码方法一致 |
| 建立 `common` / `shared` crate 吸收二级类型 | 不采用 | `contracts` 已是唯一 public shared carrier 边界；额外公共桶会失去 owner |
| 在 Step 7/8 再补 application/infra/entry 对象 | 不采用 | operation context、stored result、availability、entry disposition 已是稳定 carrier，Step 6 必须闭口 |

## 5. 结构化中间产物：模块总览

| 模块 | 所属实现单元 | 主要职责 | 对外暴露 | 允许依赖 |
|---|---|---|---|---|
| `contracts` | `crates/contracts` / `member-service-contracts` | 定义所有 public protocol 及其二级 carrier；表达外部边界但不拥有 external truth | command/query/consumer/event/job DTO、typed ref、reason、marker、view、receipt、protocol error | `core-contracts` planned compile seam |
| `domain` | `crates/domain` / `member-service-domain` | 定义 Host Truth、local record、policy、state和纯 transition；不做 I/O | 29 池中除 `SafeHostView` 外的对象、domain state/policy/error | `contracts` |
| `application` | `crates/application` / `member-service-application` | 编排 command/query/consumer/job、UoW、idempotency、stored result、mapper 和 port | service facade、operation context、port trait、repository trait、application error | `contracts`、`domain` |
| `infra` | `crates/infra` / `member-service-infra` | 实现 application port；提供 local store、adapter、config validation、runtime assembly 与 fake/durable parity | runtime builder、repository/adapter implementation、config/availability state、infra error | `contracts`、`domain`、`application` |
| `api` | `crates/api` / `member-service-api` | 接收同步 command/query，验证 entry metadata，调用 application，映射 transport-neutral disposition | command/query handler、API entry/result、API error | `contracts`、`application`、`infra` |
| `worker` | `crates/worker` / `member-service-worker` | 常驻消费与本地维护循环，经 application 推进允许的 consumer/publisher/projection work | consumer/loop entry、worker item result、worker error | `contracts`、`application`、`infra` |
| `jobs` | `crates/jobs` / `member-service-jobs` | 执行一次性或 scheduler-triggered work，经 application 推进已提交的 host maintenance | job entry/run result、job runner、job error | `contracts`、`application`、`infra` |

关键边界：`domain` 的“暴露”不等于 sibling public API；它只服务于本仓 `application`。`infra` 可实现 `application` 定义的 port，但 `application` 绝不依赖 `infra`。`api`、`worker`、`jobs` 不能直接调用 repository、adapter 或 domain private transition。

## 6. 模块依赖图

#### 模块依赖图：L2-member-service 实现主轴

```text
                  core-contracts
                        ^
                        |
                    contracts
                        ^
                        |
                     domain
                        ^
                        |
                  application <---- port traits declared here
                        ^
                        | implements ports / assembles services
                      infra
                 ^        ^        ^
                 |        |        |
                api    worker    jobs
```

关键说明：

- 箭头表达 planned Cargo compile dependency，不表达处理流、事件方向、存储读写或部署拓扑。
- `infra` 依赖 `application` 是为实现其 port；反向依赖被禁止。entry 通过 `infra` 的 validated runtime builder 获得 application facade。
- runtime、event、ref、adapter、fake seam 只能在各模块内的 contracts/ports/adapters 表达；它们不是图中的 compile edge。
- `api`、`worker`、`jobs` 互不依赖；共同使用 contracts、application 与 infra assembly，不共享入口私有类型。

## 7. 逐模块职责、暴露面与依赖红线

本节采用 `L1-governance` Step 5 的逐模块粒度：每个 crate 都有独立的职责表、文件 owner 和禁止方向。它不是 Step 6 的对象字段或函数定义；本节的类型名只用于冻结 owner，不构成已可实现的 schema。

### 7.1 `contracts` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/contracts` / `member-service-contracts` |
| 对应概要设计主体 | `IB-MS-001~017` 的 Command、Query、Consumer、Event、Job；`CMP-MS-07` public view；所有 CMP 共用的 typed carrier |
| 主要责任 | 定义 transport-neutral public protocol、typed id/ref、reason、metadata、safe marker、receipt、view、error；只描述可交换的安全载体，不拥有 Host 或外部 truth |
| 对外暴露 | `refs`、`metadata`、`commands`、`queries`、`consumers`、`events`、`jobs`、`views`、`receipts`、`errors`、`redaction` 中的 public 类型 |
| 允许依赖 | `core-contracts` planned compile seam；序列化基础设施是否需要由实现仓依赖审计决定 |
| 禁止依赖 | `domain`、`application`、`infra`、`api`、`worker`、`jobs`；任何 sibling private model、runtime client、Bus product model、database model 或 Sandbox client |

唯一文件 owner 预告：`refs.rs` 拥有 public typed id/ref、tagged decision ref、generation、stable key、reason、marker 与 public 二级 carrier；`metadata.rs` 拥有 command/query/consumer/event/job metadata；`views.rs` 独占 `SafeHostView`、page、freshness、visibility 与 degraded carrier；`receipts.rs` 独占 public local result / replay / receipt / disposition carrier。`contracts` 不可导出 domain-only state 或以 public DTO 包含 raw endpoint、credential、image / manifest、Runtime body、Sandbox body 或 external report body。

### 7.2 `domain` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/domain` / `member-service-domain` |
| 对应概要设计主体 | `CMP-MS-01~07` 的 29 个业务对象中除 `SafeHostView` 外的 Host Truth、local record、state、policy 与纯 transition |
| 主要责任 | 维护 Host Truth、正交状态轴、generation / single-active / no-fallback / body-free 不变量，以及 immutable / append-only domain record；不执行 I/O |
| 对外暴露 | 29 对象中的 domain object、domain-only value object / state、policy / guard、`DomainError`，仅供本仓 application 与 domain test 使用 |
| 允许依赖 | `contracts`；如需已确认 shared category，则经 `contracts` 统一承接 `core-contracts` |
| 禁止依赖 | `application`、`infra`、`api`、`worker`、`jobs`；repository、UoW、config、clock、async runtime、DB、HTTP/RPC、Bus、container / registry、Member / Runtime / Images / Sandbox client 或 sibling truth |

唯一文件 owner 预告：`control.rs`、`qualification.rs`、`assembly.rs`、`host.rs`、`action_attempt.rs`、`association.rs`、`registration.rs`、`endpoint.rs`、`session.rs`、`health_signal.rs`、`health.rs`、`recovery.rs`、`closure.rs`、`reconciliation.rs`、`material.rs`、`projection.rs`、`outbox.rs`、`history.rs`、`state.rs`、`policies.rs` 与 `errors.rs` 分别拥有其同名职责。`HostProjectionState` 只在 `projection.rs`；它不是 `SafeHostView`、物理 projection store 或 authorization service。domain 不定义 application facade；唯一 facade owner 为 `application/src/services.rs`。

### 7.3 `application` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/application` / `member-service-application` |
| 对应概要设计主体 | 七个 CMP 的 command/query/consumer/job 编排；`IB-MS-001~017` 的 host-side use case；UoW、idempotency、read assembly 和外部 seam 声明 |
| 主要责任 | 将 entry input 转为 operation context；读取必要 local truth；调用 domain guard / transition；在 UoW 内协调 repository、history、material、outbox、projection marker 与 stored result；声明 port，不持有产品 client |
| 对外暴露 | service facade、use-case input/output carrier、operation context、idempotency / stored-result carrier、repository / resolver / publisher / UoW / clock / id / operations-context trait、`ApplicationError` |
| 允许依赖 | `contracts`、`domain`；已确认 core shared category 经 contracts 进入 |
| 禁止依赖 | `infra`、`api`、`worker`、`jobs`；具体 DB、broker、HTTP/RPC、SDK、container、registry、Sandbox、sibling client、fake private map |

唯一文件 owner 预告：`services.rs` 拥有 facade 与 capability-to-use-case assembly；`idempotency.rs` 拥有 idempotency / stored-result application carrier；`transactions.rs` 拥有 application UoW orchestration helper；`mappers.rs` 拥有 contracts/domain/public-view mapper；`jobs.rs` 拥有 job selection / application job handler；`use_cases/read.rs` 独占 authorized safe-view / history read assembly，且不写 truth、refresh 或 repair；各 `ports/*.rs` 文件独占相应 trait family。application 只能调用 domain 已定义的方法，不能直接改 domain 私有字段或让 Query 变为 resolver / write path。

### 7.4 `infra` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/infra` / `member-service-infra` |
| 对应概要设计主体 | local persistence / history / idempotency / outbox / projection、resolver / carrier / Member / Runtime / Images / Sandbox / publication adapter seam、config binding、runtime assembly |
| 主要责任 | 实现 application 声明的 repository / port；提供 durable 或 fake-equivalent local store、adapter translation、config validation、availability classification 和 validated runtime builder；不重定义 domain rule |
| 对外暴露 | repository/store / adapter implementation、`RuntimeBuilder`、validated config / availability carrier、infra error、test fake assembly；不作为 sibling public API |
| 允许依赖 | `contracts`、`domain`、`application`；`core-contracts` 仅按 Step 3 已确认 compile baseline 进入 |
| 禁止依赖 | `api`、`worker`、`jobs`；禁止反向让 adapter 修改 domain invariant、通过 product error string 分类业务状态、在 fake 中补未定义业务规则，或把 raw secret / external body 写入 local truth |

唯一文件 owner 预告：`persistence/{source_store,history_store,idempotency_store,outbox_store,projection_store,unit_of_work}.rs` 分别拥有物理 store / transaction implementation；`adapters/{identity_work,images,member,runtime,sandbox,carrier,publication}.rs` 分别拥有对应外部 seam translation；`runtime_builder.rs` 独占 dependency injection、adapter availability 与 facade composition；`config.rs` 只拥有 validated config binding type；`observability.rs` 只拥有 sink seam，不拥有 observability truth。`infra` 的 `projection_store.rs` 不拥有 `HostProjectionState` 语义或 public `SafeHostView` schema。

### 7.5 `api` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/api` / `member-service-api` |
| 对应概要设计主体 | 同步 Command / Query intake，特别是 `IB-MS-001~009`、`011~013`、`015` 的 transport-neutral entry mapping |
| 主要责任 | 验证 entry metadata 和 public input；构造 application operation context；调用 facade；将 application result / error 映射为 command 或 query disposition；不拥有业务 truth |
| 对外暴露 | `ApiCommandEntry`、`ApiQueryEntry`、handler disposition、transport-neutral error mapping、planned process entry |
| 允许依赖 | `contracts`、`application`、`infra` runtime builder；`core-contracts` 仅随 contracts 的已确认类别使用 |
| 禁止依赖 | 直接 domain transition、repository / store / adapter 调用；`worker`、`jobs`；具体 HTTP / RPC product assumption；将 authorization / transport status 伪装为 Host state |

唯一文件 owner 预告：`command_handlers.rs` 拥有 command entry / command disposition；`query_handlers.rs` 拥有 query entry / visible / not-visible / degraded disposition；`transport_error.rs` 拥有 transport-neutral mapping。API handler 不创建 `HostActionAttempt`、`HostRecoveryDecision` 或任何 external completion；这些只能由 application 及已提交事实流程形成。

### 7.6 `worker` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/worker` / `member-service-worker` |
| 对应概要设计主体 | `IB-MS-010`、`IB-MS-017` inbound signal / feedback，`IB-MS-016` outbox publication loop，projection maintenance trigger |
| 主要责任 | 验证 consumer envelope / identity / correlation，构造 operation context 并调用 application；运行长期 outbox / projection loop；保留 item receipt / disposition；不把消息到达变为 lifecycle decision |
| 对外暴露 | consumer entry、outbox publisher loop、projection worker、worker context、worker item result / error；不作为 API 或 jobs 的业务依赖 |
| 允许依赖 | `contracts`、`application`、`infra` runtime builder；`core-contracts` 仅随 contracts 的已确认类别使用 |
| 禁止依赖 | 直接 domain transition、repository / adapter 调用；`api`、`jobs`；把 receipt、timeout、observed signal 或 offset 写成 external completion / Host Truth |

唯一文件 owner 预告：`consumers.rs` 拥有 signal / action / cleanup / handoff feedback entry 和 consumer disposition；`outbox_publisher.rs` 拥有 publication loop entry；`projection_worker.rs` 只拥有 projection maintenance trigger；`worker_context.rs` 拥有 lease / cancellation / operation context carrier；`errors.rs` 拥有 worker error mapping。Consumer 对未闭合 event envelope 必须 fail closed、hold 或 record local gap，不能从 fake、route 或 error text猜测字段。

### 7.7 `jobs` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/jobs` / `member-service-jobs` |
| 对应概要设计主体 | `CAP-MS-10`、`18~19`、`21~28` 所需的 persisted action / health / cleanup / reconciliation / publication / projection / handoff maintenance |
| 主要责任 | 接收 scheduler-triggered job input，构造 operations context，调用 application 推进已提交 attempt、outbox、projection 或 reconciliation work；形成 job run disposition；不产生新授权 |
| 对外暴露 | `JobEntry`、run context / disposition、具体 job runner、job error；不作为 api / worker 依赖 |
| 允许依赖 | `contracts`、`application`、`infra` runtime builder；`core-contracts` 仅随 contracts 的已确认类别使用 |
| 禁止依赖 | 直接 domain transition、repository / adapter 调用；`api`、`worker`；把 scheduler trigger、retry 或 batch 结果变成 formal intent / decision、external completion 或 Host lifecycle state |

唯一文件 owner 预告：`job_entry.rs` 独占 `JobEntry`、run context 与 run disposition；各具体 job 文件仅承载一个 action family：dispatch、health evaluation、cleanup progression、residual reconciliation、fact publication、projection rebuild、handoff gap reconciliation。job runner 对 blocked external seam 只能产生 blocked / waiting / unknown / gap 类本地结果，不能伪造 successful external effect。

## 8. 文件与代码主体映射表

Step 4 的文件树是唯一 planned layout；本表将其中的 file group 绑定到 Step 5 的代码主体，供 Step 6 逐模块落卡。没有列出的源码文件不得被本 Step 隐式创建；不以 `common.rs`、`utils.rs`、`manager.rs` 或 `wiring.rs` 吸收未归属内容。

| 文件路径 | 代码主体 | 类型 | Step 5 固定责任 |
|---|---|---|---|
| `crates/contracts/src/refs.rs` | id / ref / reason / marker / state carrier | public shared contract | 所有穿过 public protocol 的二级 carrier；包括 `HostActionDecisionRef`、`HostClosureDecisionRef`、`HostSafeSlice`、`VisibilityContext` 的唯一 schema owner |
| `crates/contracts/src/metadata.rs` | metadata / correlation carrier | public DTO helper | command / query / consumer / event / job 的 authority、idempotency、correlation carrier |
| `crates/contracts/src/{commands,queries,consumers,events,jobs}.rs` | protocol input / output | public DTO | 按协议类别定义 DTO，不引用 domain-only type |
| `crates/contracts/src/views.rs` | `SafeHostView` / page / freshness / visibility result | public DTO | public safe read surface；不执行 authorization / refresh |
| `crates/contracts/src/{receipts,errors,redaction}.rs` | receipt / disposition / protocol error / body-safe marker | public DTO / enum | entry 结果、error 和 forbidden-body boundary |
| `crates/domain/src/{subject,control,qualification,assembly}.rs` | subject guard / intent / decision / qualification / assembly | domain truth / policy | `CMP-MS-01~02` semantic owner |
| `crates/domain/src/{host,action_attempt,association,registration,endpoint,session}.rs` | host generation / attempt / association / registration / session | domain truth | `CMP-MS-03~04` semantic owner |
| `crates/domain/src/{health_signal,health,recovery,closure,reconciliation}.rs` | health / recovery / closure / cleanup / finding / case | domain truth | `CMP-MS-05~06` semantic owner |
| `crates/domain/src/{material,projection,outbox,history,state,policies,errors}.rs` | material / handoff / projection state / outbox / history / guards / error | domain record / policy | `CMP-MS-07` semantic owner；不定义 public view |
| `crates/application/src/services.rs` | service facade / use-case assembly | application service | 唯一 facade owner；入口只经它进入 application |
| `crates/application/src/ports/*.rs` | repository / resolver / publisher / UoW / runtime traits | trait | 所有 dependency-inversion seam 的声明 owner |
| `crates/application/src/use_cases/*.rs` | command / query / consumer use cases | application service | 按 IB / internal use-case 编排；`read.rs` 无写入，`materialization.rs` 不承担 public query |
| `crates/application/src/{transactions,idempotency,mappers,jobs,errors}.rs` | UoW / replay / mapper / job service / error | application carrier / service | operation context、stored result、application error、job selection / report assembly |
| `crates/infra/src/persistence/*.rs` | durable/fake local store / concrete UoW | adapter | physical persistence，不重写 semantic owner |
| `crates/infra/src/adapters/*.rs` | external seam adapter | adapter | typed ref / safe summary translation；不保存 external body |
| `crates/infra/src/{runtime_builder,config,observability,errors}.rs` | builder / config / sink / infra error | adapter / carrier | wiring、availability、validated binding；不拥有 Host Truth |
| `crates/api/src/{command_handlers,query_handlers,transport_error}.rs` | command/query entry / disposition | entry handler | 同步 entry mapping；不直接读写 persistence |
| `crates/worker/src/{consumers,outbox_publisher,projection_worker,worker_context,errors}.rs` | consumer / long loop / worker result | entry runner | asynchronous entry and disposition；均经 application facade |
| `crates/jobs/src/{job_entry,dispatch_host_actions,evaluate_host_health,progress_host_cleanup,reconcile_host_residuals,publish_host_facts,rebuild_host_projection,reconcile_handoff_gaps,errors}.rs` | job entry / runner / run result | entry runner | operations job start and disposition；均经 application facade |

## 9. 对象、trait、repository 与 entry 的归属预告

Step 6 必须把以下预告变成逐对象的 Rust-facing schema、字段来源、factory / method、state 与 module stop review；Step 7 才可定义 trait method signature。此表不能被当成“对象已闭口”的替代品。

| 对象或主体类别 | owning crate / file | Step 6 必须闭口的内容 | 禁止替代 |
|---|---|---|---|
| public DTO / result / receipt / view / event / job | `contracts` 的 protocol / view / receipt 文件 | struct / enum / newtype shape、字段、variant、来源、safe boundary | domain-only DTO、transport product type、sibling private schema |
| public id / ref / reason / marker / ref set / state carrier | `contracts/src/refs.rs` | `HostActionDecisionRef`、`HostClosureDecisionRef`、`HostSafeSlice`、`VisibilityContext` 与所有当前被对象 / protocol 引用的二级 carrier | 裸字符串、同义 shadow ref、由 adapter 或 entry 私造类型 |
| Host Truth / record / policy / domain state | corresponding `domain/src/*.rs` | 29 业务对象中 domain owner、pure behavior、invariant、semantic state | repository model、adapter response、global HostStatus |
| public read view | `contracts/src/views.rs` | `SafeHostView` / page / freshness / visibility / degraded shape | `HostProjectionState`、domain read object、authorization executor |
| application facade / operation context / idempotency / stored result / mapper / job report assembly | corresponding `application/src/{services,idempotency,transactions,mappers,jobs}.rs` | stable non-business carrier，尤其 entry-to-operation mapping、request digest / duplicate replay、stored public result | domain truth、infra private store type、entry private counter |
| repository / UoW / resolver / carrier / session / Sandbox / publication / runtime trait | corresponding `application/src/ports/*.rs` | trait owner、seam class、typed request/result / error family boundary | infra trait、sibling compile dependency、product client |
| repository / projection / idempotency / outbox adapter / fake / runtime builder / availability | corresponding `infra/src/{persistence,adapters,runtime_builder,config}.rs` | stable adapter state / config binding / availability carrier；fake/durable parity constraints | domain object、application port trait、external truth body |
| API command/query entry and disposition | `api/src/{command_handlers,query_handlers,transport_error}.rs` | entry metadata mapping、operation-context factory use、result/disposition state | domain transition、repository result inferred disposition |
| worker consumer / loop entry and disposition | `worker/src/{consumers,outbox_publisher,projection_worker,worker_context,errors}.rs` | envelope validation, item receipt / result, lease / cancellation carrier | lifecycle decision、external completion、broker offset as truth |
| job entry / run context / disposition | `jobs/src/{job_entry,*.rs}` | scheduler input validation、run report / result carrier、stable work selector | formal intent / decision、scheduler state as Host lifecycle |

### 9.1 业务组成部分到七模块映射

| 业务组成部分 | `contracts` | `domain` | `application` | `infra` | `api` / `worker` / `jobs` |
|---|---|---|---|---|---|
| `CMP-MS-01` intent / orchestration decision | command/query DTO、intent / decision ref / result | `HostIntent`、`HostOrchestrationDecision`、`HostControlPolicy` | intent / decision service、truth repo / current-fact port、idempotency | source / history store、required resolver adapter | command + query handler |
| `CMP-MS-02` qualification / assembly | command/query DTO、qualification / readiness ref / gap | `HostQualificationContext`、`HostAssembly`、`HostReadinessDecision`、`RequiredQualificationPolicy` | qualification / assembly use case、resolver ports | local store、Identity/Work/Images/credential/Sandbox/carrier adapters | command/query handler、source-change consumer / due job trigger |
| `CMP-MS-03` host / carrier progression | internal input / receipt、generation / effect / association ref | `MemberExecutionHost`、`HostActionAttempt`、`HostExternalAssociation`、`HostGenerationFence` | progression use case、carrier/binding port、UoW | host / attempt / association store、carrier/Sandbox adapter | action outcome consumer、dispatch job |
| `CMP-MS-04` registration / Host Session | registration/session DTO、endpoint/session ref / safe response | `HostRegistration`、`HostEndpoint`、`HostSession`、`RegistrationSessionPolicy` | registration/session use case、Member/Runtime session port | registration/session store、Member/Runtime adapter | registration command/query handler、signal consumer |
| `CMP-MS-05` health / recovery | signal / command/query DTO、assessment/failure/recovery ref | `HealthSignalSnapshot`、`HostHealthAssessment`、`HostFailureClassification`、`HostRecoveryDecision` | health/recovery use case、signal intake port | health store、Member/Runtime/Sandbox/carrier adapter | health consumer、command/query handler、evaluation job |
| `CMP-MS-06` closure / reconciliation | closure DTO、cleanup/finding/case ref / receipt | `HostClosure`、`CleanupAttempt`、`ResidualFinding`、`ReconciliationCase` | closure/reconciliation use case、release / cleanup port | closure store、Sandbox/carrier adapter | cleanup feedback consumer、command handler、cleanup/reconcile job |
| `CMP-MS-07` material / safe consumption | material/event/job/query/view/receipt DTO | `HostFactMaterial`、`HostHandoffRecord`、`HostProjectionState`、`HostOutboxRecord`、`HostHistoryEntry` | materialization/read use case、publication / handoff / projection port | history/outbox/projection store、publication adapter | outbox / projection worker、publish/rebuild/handoff-gap job、query handler |

`SafeHostView` 是 `CMP-MS-07` 的 public read object，但它的 owning crate/file 仍是 `contracts/src/views.rs`，不是 `domain`；本表的 business row 不改变这个文件归属。

### 9.2 semantic owner、writer、store 与 entry disposition 分层

| 事项 | semantic owner | 允许写入者 | physical persistence owner | entry / completion boundary | 禁止混同 |
|---|---|---|---|---|---|
| Host Truth / policy / state | `domain` object / policy | `application` use case 在 UoW 内调用 domain transition | `infra` repository / UoW adapter | API / worker / jobs 只映射 disposition | entry receipt、adapter outcome、DB row |
| public DTO / view / receipt | `contracts` | application mapper 形成；entry 只 transport-map | infra projection / result store 可保存其已定义 surface | API / worker / jobs visible result | domain object、transport body |
| operation context / idempotency / stored result | `application` | application service | infra idempotency / result store | duplicate replay / handler disposition | domain revision、broker offset、source version |
| adapter availability / config binding | `infra` | runtime builder / validated config loader | infra config / adapter state | startup / entry blocked / unavailable | domain readiness、external owner truth |
| handler / consumer / job disposition | owning entry crate | entry after application result | optional entry-local / stored public receipt only via application port | accepted / rejected / duplicate / deferred / failed mapping | Host lifecycle / decision / external completion |
| Host Projection State vs public safe view | `domain::HostProjectionState` vs `contracts::SafeHostView` | application rebuild/read mapping | infra projection store | query visible / degraded / unavailable disposition | source truth、broker offset、authorization decision |

### 9.3 version、cursor 与 external source version 的名称红线

| 名称类别 | owning layer | 允许语义 | 不得表示 |
|---|---|---|---|
| domain basis / revision | domain object | same-object transition basis、supersede relation、domain evaluation basis | repository CAS、broker offset、external source version |
| repository expected / persisted version | application port + infra implementation | optimistic concurrency / compare-and-swap | domain business revision、projection cursor、message dedup key |
| committed projection cursor | domain projection state + infra projection store | last committed local change consumed by projection rebuild | source truth version、external event offset、Host generation |
| external source version | contracts typed ref / resolver result | source-side version / digest as opaque matching input | local expected version、generation、idempotency digest |
| idempotency / stable effect / publication / handoff key | contracts / application carrier | request replay or one external effect / delivery attempt identity | revision, timestamp, queue offset or arbitrary regenerated key |

## 10. Seam 分类矩阵

本矩阵只分类 future collaboration，不能证明具体 dependency、adapter、fake 或 integration 已 ready。每一项在 Step 7 定义 trait owner、Step 8 定义 protocol schema、Step 9 定义调用流、Step 11 定义 transaction / consistency，并持续受 `MSVC-UP-001~008` 限制。

| seam / 依赖 | 类型 | 声明 owner | 实现 / 消费位置 | 当前上限 |
|---|---|---|---|---|
| `L0-core` shared category | compile | `contracts` | planned Cargo path dependency；domain/application 经 contracts 使用 | `core-contracts` category only；本仓 schema 不 shadow |
| `L0-sdk` server boundary | limited compile / fake | `application` port placeholder | future infra adapter / fake only after `MSVC-UP-008` | target / server self-test pending；不进 runtime host main path |
| `L0-bus` material publication / feedback | event + ref | `application::ports::publication` | infra publication adapter；worker consumer / jobs publish | route / envelope / receipt pending；local submitted 不等于 delivery |
| `L1-identity` qualification | runtime + event + ref | `application::ports::qualification` | infra identity/work adapter; source-change consumer placeholder | `GlobalMemberRef` + safe qualification; body / authorization truth external |
| `L1-work` project-member qualification | runtime + event + ref | `application::ports::qualification` | infra identity/work adapter; source-change consumer placeholder | `ProjectMemberRef` + scope qualification; Work truth external |
| `L2-member` registration / signal | runtime + event + ref | `application::ports::session` / qualification | infra member adapter; api/worker entry | exact request/signal/credential schema pending (`MSVC-UP-002`) |
| `L2-runtime` Host Session / execution handoff | runtime + ref | `application::ports::session` / publication | infra runtime adapter; matching feedback consumer | run / turn / outcome / entry contract pending (`MSVC-UP-001`) |
| `L2-member-images` pinned supply | runtime + ref | `application::ports::qualification` | infra images adapter | exact manifest / digest / verification pending; no verification -> blocked (`MSVC-UP-003`) |
| `L4-sandbox` host binding / release / cleanup | runtime + ref | `application::ports::sandbox` | infra sandbox adapter; feedback consumer / cleanup job | bind / release / cleanup schema pending; no tool execute or policy truth (`MSVC-UP-004`) |
| carrier / registry / host backend | adapter | `application::ports::carrier` | infra carrier adapter; progression / job consumer | product neutral; backend state is not Host Truth |
| config / clock / id / async scheduler | adapter / fake | `application::ports::runtime` | infra runtime builder; api/worker/jobs context | exact product deferred; fake proves only local contract |
| local truth / history / outbox / projection / idempotency | local persistence | `application::ports::{repositories,unit_of_work}` | infra persistence; application use cases | local-first only; no sibling storage |
| observability sink | event + ref / adapter | infra observability seam | worker/jobs/application material handoff | no observability backend truth or evidence claim |

## 11. 禁止依赖与 owner 审计

### 11.1 cargo / source dependency 审计

| 检查项 | 结论 | 说明 |
|---|---|---|
| `contracts -> domain` | forbidden | public DTO 只能用 `contracts` / `core-contracts` carrier；`SafeHostView` 不引用 `HostProjectionState` |
| `domain -> application / infra / entry` | forbidden | domain 保持 IO-free；facade 已校正至 `application/src/services.rs` |
| `application -> infra / entry` | forbidden | port trait / use case 内不引用 concrete adapter、handler 或 job runner |
| `infra -> api / worker / jobs` | forbidden | builder 提供 assembly，但不依赖 entry crate |
| entry -> domain / persistence direct | forbidden | API/worker/jobs 仅依赖 application facade 和 infra builder |
| entry-to-entry | forbidden | `api`、`worker`、`jobs` 不互为业务调用方 |
| sibling compile dependency | forbidden except `L0-core` | runtime/event/ref/adapter/fake collaboration不得进入 Cargo |
| product type leakage | forbidden | domain/application contracts 不带 DB/broker/container/HTTP/Sandbox/Runtime private model |

### 11.2 owner 完整性审计

| 审计项 | 结论 | 证据 / Step 6 要求 |
|---|---|---|
| 七模块主轴唯一 | pass | Step 4 workspace member 与本文件 §5、§7 一致 |
| 29 个业务对象仍完整 | pass | §9.1 按 CMP 映射；Step 6 改按 crate/file 分批落卡 |
| `SafeHostView` / `HostProjectionState` 分离 | pass | contracts view / domain state / application read / infra store 四个 owner 已区分 |
| application facade owner | pass_after_correction | Step 4 §9.1 已改为 `application/src/services.rs` |
| public 二级 carrier owner | conditional_pass | `HostActionDecisionRef`、`HostClosureDecisionRef`、`HostSafeSlice`、`VisibilityContext` 固定在 `contracts/src/refs.rs`；Step 6 必须给出 exact Rust-facing shape |
| non-core stable carrier | conditional_pass | operation context、stored result、availability、entry disposition 已固定 crate/file；Step 6 不得 defer |
| port / adapter owner | pass | trait 在 application，implementation / fake 在 infra，entry 不定义 trait |
| external contract truth | pass_with_blockers | all upstream exact schema stays pending / placeholder / fail-closed |

### 11.3 模块测试切口预告

正式测试设计留给 Step 16；本 Step 只固定每个模块未来必须能承接的验证面。

| 模块 | 未来测试切口 |
|---|---|
| `contracts` | DTO / enum / ref / receipt roundtrip；metadata / idempotency presence；body-free / redaction / public view schema |
| `domain` | pure transition、state guard、generation / single-active / no-fallback、append-only / material formation、forbidden transition |
| `application` | Command / Query / Consumer / Job orchestration、duplicate / conflict / stored replay、UoW rollback、query no-write、unknown / gap mapping |
| `infra` | fake/durable behavioral parity、adapter outcome classification、runtime builder / availability、config validation、no raw body persistence |
| `api` | command/query metadata validation、operation-context mapping、protocol/application error and query disposition mapping |
| `worker` | envelope validation、dedup / late / unsupported path、outbox loop / projection trigger、consumer receipt mapping |
| `jobs` | job input / work selector、blocked / waiting / unknown disposition、batch / cursor discipline、no hidden decision / action |

## 12. Step 6 重建输入、回填草稿与 Gate

### 12.0 与 `L1-governance` Step 5 的格式对齐审计

| 对齐项 | 本仓采用方式 | 领域差异 / 限制 |
|---|---|---|
| Step 状态与输入 | 保留状态、对应 SOP、回填章节、上游输入和历史材料说明 | 仅使用 member-service 的 00/01/02 与本仓校准材料 |
| SOP 问题回答 | 先回答模块主轴、代码主体、暴露面、依赖方向和 owner | `CMP-MS-01~07` 仅为业务责任轴，不复制治理组成部分 |
| 问题诊断与取舍 | 逐项记录旧材料污染、方案比较和采用理由 | 不把兄弟项目的对象、协议或实现事实当作本仓真相 |
| 结构化模块产物 | 模块总览、依赖图、逐模块职责、文件映射、owner / seam 审计 | 本仓固定七模块和 `MSVC-UP-001~008` pending 口径 |
| 回填与 Gate | 保留 Step 6 输入、模块顺序、非 core 闭口、进入条件和禁止事项 | 正式 `03` 仍只能在 Step 19 装配 |

该审计只证明格式和粒度对齐，不改变 Step 5 的依赖、owner、对象分母或上游 blocker。

### 12.1 Step 6 逐模块执行计划

Step 6 必须严格采用以下顺序；每完成一个模块或明确对象组都要做模块内停审，不能恢复旧的按 `MOD-MS-*` / CMP 堆叠写法。

| 顺序 | 模块 / 小循环 | 必须先收稳的内容 | 停审条件 |
|---|---|---|---|
| 6.1 | `contracts` shared carrier | public ids/ref/reason/marker/state、`HostActionDecisionRef`、`HostClosureDecisionRef`、`HostSafeSlice`、`VisibilityContext`、metadata / receipt / view support carrier | 每个 public 二级类型有唯一 crate/module/file、Rust-facing shape、来源与禁止替代 |
| 6.2 | `domain` | 29 object 的 domain-owned portion、policy、state / invariant、source field / revision distinction | 每个 domain object 先有 capability map 后有 object card；没有 I/O / public DTO leakage |
| 6.3 | `application` | facade、operation context、idempotency、stored result、mapper、use-case / job helper | entry-to-operation / duplicate replay / query no-write 可回指；不 defer stable carrier |
| 6.4 | `infra` | runtime builder、config binding、availability、fake/durable adapter state | port trait 与 adapter state 不重定义；blocked seam 不冒充 ready |
| 6.5 | `api` | command/query entry / disposition | handler 不直连 domain / repo；visible/not-visible/degraded 分支有独立 carrier |
| 6.6 | `worker` | consumer / loop entry、worker context、item disposition | consumer 不创建 decision；receipt / event identity / unknown path 闭合 |
| 6.7 | `jobs` | job entry / run context / run disposition | job 不创建 new formal decision；scheduler state 与 Host state 分离 |
| 6.8 | cross-module audit | object field source、state owner、DTO/public carrier、port prerequisite、test cut / Step 7 handoff | 无 duplicate owner、无未归属二级 carrier、无 source dependency leakage |

### 12.2 Step 5 正式回填草稿

> 校准来源：
> - `design-calibration/03_ddd_step_05_module_contracts.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“逐模块职责、暴露面与依赖红线”“文件与代码主体映射表”“对象、trait、repository 与 entry 的归属预告”“Seam 分类矩阵”和“禁止依赖与 owner 审计”小节，了解本仓如何以七模块而不是七个 CMP 作为可落码主轴。

## 5. 模块实现契约

`L2-member-service` 采用与 planned workspace member 对齐的七模块主轴：`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。`CMP-MS-01~07` 是跨模块的业务责任切片，不直接成为 crate、顶层目录或 Cargo 依赖方向。

### 5.1 模块总览表

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 依赖对象 |
|---|---|---|---|---|
| `contracts` | `member-service-contracts` | public DTO、typed carrier、view、receipt、error | public protocol | `core-contracts` planned compile seam |
| `domain` | `member-service-domain` | Host Truth、policy、state、pure transition | domain object / guard | `contracts` |
| `application` | `member-service-application` | use case、UoW、idempotency、port / facade | service / port / application carrier | `contracts`、`domain` |
| `infra` | `member-service-infra` | store、adapter、config、runtime builder | assembly / implementation | `contracts`、`domain`、`application` |
| `api` | `member-service-api` | synchronous command/query entry | handler / disposition | `contracts`、`application`、`infra` |
| `worker` | `member-service-worker` | consumer / long-running local loop | worker entry / receipt | `contracts`、`application`、`infra` |
| `jobs` | `member-service-jobs` | persisted maintenance job entry | job entry / run disposition | `contracts`、`application`、`infra` |

### 5.2 模块依赖图

```text
contracts -> core-contracts
domain -> contracts
application -> domain -> contracts
infra -> application -> domain -> contracts
api / worker / jobs -> infra -> application
```

禁止 `contracts` 依赖 domain，禁止 domain 依赖 I/O / adapter，禁止 application 依赖 infra，禁止 entry 直写 repository 或互相依赖。除 `L0-core` 的已确认 shared category 外，所有 sibling 关系保持 runtime / event / ref / adapter / fake seam，不进入 Cargo。

### 12.3 待确认事项与进入下一步条件

| 待确认 / blocker | 本 Step 已固定的上限 | 后续闭口位置 |
|---|---|---|
| `MSVC-UP-001` Runtime Host Session / execution handoff | port owner / file owner fixed；exact request/result / feedback schema pending | Step 6 carrier, Step 7 port, Step 8 protocol, Step 9 flow 保持 placeholder |
| `MSVC-UP-002` Member registration / signal / credential | entry / adapter owner fixed；positive registration / signal schema pending | Step 6 / 7 / 8 条件闭口，fail closed |
| `MSVC-UP-003` Images pinned supply | qualification port / adapter owner fixed；no verified supply => blocked | Step 6 / 7 / 8 条件闭口 |
| `MSVC-UP-004` Sandbox bind / release / cleanup | host-side port / adapter owner fixed；无 sandbox truth | Step 6 / 7 / 8 / 9 only safe placeholder |
| `MSVC-UP-005~008` policy / credential / Core / Bus / SDK | seam owner fixed；exact external contract、route、compile target仍 pending | Step 6~14 按各自契约继续挂起 |

进入 Step 6 的条件：

- [x] 七个实现模块与 Step 4 workspace member 一一对应。
- [x] 每个模块的职责、暴露面、允许 / 禁止依赖和 planned file owner 已固定。
- [x] `CMP-MS-01~07` 已映射到七模块，未被误写为 crate。
- [x] 29 个业务对象、public `SafeHostView`、application / infra / entry stable carrier 均有 crate/file 归属预告。
- [x] compile / runtime / event / ref / adapter / fake seam 已分类；仅 `L0-core` 保持 planned compile baseline。
- [x] Step 6 的模块顺序、module stop review 与 cross-module audit 输入已固定。
- [x] 没有创建实现仓、源码、测试、artifact、report、evidence、verdict、signoff、readiness 或 commit。

```text
step_05_status = completed_rebuild
step_05_gate = pass_with_upstream_blockers
step_06_status = invalidated_pending_rebuild
next_allowed_step = Step 6 object_contracts_rebuild
formal_03_write_allowed = false_until_step_19
```
