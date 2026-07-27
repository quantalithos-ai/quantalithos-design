# L3-capability-hub 03 详细设计 Step 5: 定义模块实现契约主轴

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 5
> 回填章节: `projects/L3-capability-hub/03-详细设计.md` §5 模块实现契约
> 创建日期: 2026-07-09
> 当前模式: full-restart
> 状态: completed_with_step_9_clarification
> Step 9 batch 9.9 澄清: 2026-07-15;固定 worker event-collaboration continuation loop 只调用 application facade并传 exact capture ref；`infra`依赖只用于 binary wiring,不得让 entry 持有 repository / publisher adapter；不新增模块、callable、trait 或 Port
> 本轮口径: 在 Step 4 已固定 Rust workspace 多 crate 布局的前提下,把详细设计全文的模块主轴固定为 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个实现模块;8 个业务主要组成部分跨这七个模块实现,不拆成业务 crate。本 Step 不写对象字段、trait 方法签名、DTO schema、函数级 flow、状态矩阵、持久化细节、测试结果、run_id、evidence alias、验收签署、implementation ledger 或 planned boundary skeleton。

---

## 0. Step 开工确认

| 项目 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 5 `定义模块实现契约主轴` |
| 用户确认 | 用户已回复“同意”,允许从 Step 4 进入 Step 5 |
| 正式文档写入 | 本 Step 不修改正式 `03-详细设计.md`;正式装配留到 Step 19 |
| 上游基线 | `03_ddd_step_01_upstream_boundary.md`;`03_ddd_step_02_scope.md`;`03_ddd_step_03_constraints.md`;`03_ddd_step_04_file_layout.md`;新版 `02-概要设计.md` §5 / §12 |
| 参考粒度 | `projects/L1-governance/design-calibration/03_ddd_step_05_module_contracts.md`;`projects/L1-artifact/design-calibration/03_ddd_step_05_module_contracts.md`;`projects/L3-method-library/design-calibration/03_ddd_step_05_module_contracts.md` |
| 旧材料处理 | 旧 `03-详细设计.md` 中 provider / access / accounting / decision / secret / query / cost / runtime 主线只作 historical material / pollution audit |
| 进入条件 | pass:Step 4 已完成且用户确认进入 Step 5 |
| next_allowed_action | Step 5 已完成,等待用户确认后进入 Step 6 |

---

## 1. 本步输入

| 输入 | 当前状态 | 本 Step 用途 |
|---|---|---|
| `design-calibration/project_execution_ledger.md` | read | 确认项目级恢复点停在 `03` Step 4,用户确认后允许进入 Step 5。 |
| `design-calibration/03_ddd_calibration_flow.md` | read | 确认文档级 flow、Step 5 产物路径和正式 `03` 后置装配规则。 |
| `design-calibration/03_ddd_step_04_file_layout.md` | completed | 提供 workspace 多 crate 架构、七个实现单元、文件布局树、文件职责表和 `core-contracts` path dependency 落点。 |
| `projects/L3-capability-hub/02-概要设计.md` §5 / §12 | active formal baseline | 提供 8 个主要组成部分、对象候选池、详细设计承接清单和回退规则。 |
| `design-calibration/02_hld_step_05_components_boundary.md` | completed | 提供业务组成部分职责、功能 / capability、对象发现线索、非职责和跨组成部分接缝。 |
| `design-calibration/02_hld_step_12_detailed_design_handoff.md` | completed | 提供详细设计继续展开对象、接口、flow、状态、异常、配置和测试方向。 |
| `standards/document/详细设计讨论流程_SOP.md` Step 5 | read | 要求输出模块总览表、每个模块职责表、模块间调用 / 依赖图和对象 / trait / handler / repository 归属。 |
| `standards/document/详细设计书写规范.md` §5.5 | read | 要求第 5 章以模块为主轴,后续每个模块承载对象、trait / port / adapter、函数、错误和测试切口。 |
| `projects/L1-governance` / `projects/L1-artifact` / `projects/L3-method-library` Step 5 | framework_reference | 参考七实现模块、业务组成部分映射、依赖矩阵、旧材料隔离和回填草稿粒度。 |

---

## 2. SOP 问题回答

### 2.1 本仓详细设计应该拆成哪些实现模块?

本仓详细设计主轴固定为 Step 4 已收稳的七个实现模块:

- `contracts`
- `domain`
- `application`
- `infra`
- `api`
- `worker`
- `jobs`

这七个模块与 workspace member 对齐,可由 Cargo 依赖方向和文件布局强化边界。`能力身份与接入语境`、`注册目录与生命周期`、`接入描述与风险摘要`、`治理与方法关系`、`正式暴露与受控消费`、`追溯、变化与影响`、`派生维护与只读输出`、`外部引用与安全摘要支撑` 是业务主要组成部分,不是 crate 边界。每个业务组成部分都会跨 `contracts`、`domain`、`application`、`infra` 和入口模块协作实现。

### 2.2 每个模块对应概要设计中的哪个主要组成部分或代码主体?

| 模块 | 对应概要设计代码主体 | 对应业务组成部分 |
|---|---|---|
| `contracts` | Command / Query / Inbound Event / Outbound Event / Job / View / Receipt / Error public protocol carrier | 全部 8 个组成部分的 public carrier、typed ref、view、receipt 和 error surface |
| `domain` | Domain Model and Policies | 8 个组成部分的 truth object、relation、state、policy、change record、safe summary 和 projection state |
| `application` | Application Services、Ports、UnitOfWork、Idempotency、transaction orchestration | 8 个组成部分的 command / query / consumer / job use case 编排和 port owner |
| `infra` | Persistence、Projection / Material、Collaboration / External Adapters、runtime builder、config binding | 8 个组成部分的 repository / projection / resolver / safe summary / publisher / handoff adapter 实现 |
| `api` | Inbound synchronous Command / Query entry | 同步 command / query 入口,主要服务 identity、registry、descriptor、relation、exposure、trace / impact 和 query read surface |
| `worker` | Inbound Event Consumer、event-collaboration continuation loop、projection maintenance loop | 治理 / 方法 / external source / downstream / audit / external document changed consumer 和常驻维护 |
| `jobs` | Operations Job runner | consumer view refresh、directory rebuild、audit export preparation、ecosystem discovery rebuild、reconciliation、reference refresh、event collaboration repair |

### 2.3 每个模块对外暴露什么?

- `contracts` 对外暴露 public DTO、typed ref、metadata wrapper、view、event、job input / receipt / report 和 protocol error。
- `domain` 只向本仓 `application` 暴露领域对象、状态、policy、record、safe summary carrier、projection state 和 `DomainError`。
- `application` 暴露 service facade、command / query / consumer / job service、port trait、repository trait、UnitOfWork、idempotency、stored result 和 `ApplicationError`。
- `infra` 暴露 repository / projection store / reference store / safe summary resolver / publisher / handoff adapter、config validation、runtime builder、fake adapter 和 `InfraError`。
- `api` 暴露 command handler、query handler、route / RPC assembly placeholder 和 `ApiError`。
- `worker` 暴露 inbound consumer、event-collaboration continuation runner、projection worker 和 `WorkerError`。
- `jobs` 暴露 one-shot operations job runner、job report mapping 和 `JobError`。

### 2.4 每个模块允许依赖哪些模块,禁止依赖哪些模块?

依赖方向必须单向:

- `contracts` 只允许依赖 `core-contracts`。
- `domain` 只允许依赖 `contracts` 和 `core-contracts`。
- `application` 只允许依赖 `domain`、`contracts` 和 `core-contracts`。
- `infra` 只允许依赖 `application`、`domain`、`contracts` 和 `core-contracts`。
- `api`、`worker`、`jobs` 只允许依赖 `application`、`infra`、`contracts` 和 `core-contracts`。

明确禁止:

- `contracts` / `domain` / `application` 反向依赖 `infra`、`api`、`worker` 或 `jobs`。
- `api`、`worker`、`jobs` 互相依赖。
- `domain` 读取 config、repository、adapter、HTTP、bus、DB、job runner 或外部系统。
- `application` 直接依赖 DB、message bus、HTTP client、external SDK 或 concrete adapter。
- 任何非 `core-contracts` sibling repo 进入 Cargo dependency。
- 新增 `shared`、`common`、`utils`、`manager` 这类无边界公共模块。

### 2.5 哪些对象、trait、handler、repository 应归属于哪个模块?

| 类型 | 归属模块 | 说明 |
|---|---|---|
| typed ref、metadata、Command DTO、Query DTO、Event DTO、Job DTO、View DTO、Receipt、public error | `contracts` | 只承载 public protocol 和可序列化 carrier,不承载领域不变量。 |
| aggregate、entity、value object、state enum、policy、safe summary、change record、trace / impact fact、projection state、domain error | `domain` | 承载 capability access truth、relation truth、derived state 和 forbidden body guard。 |
| command / query / consumer / job service、repository trait、resolver trait、publisher trait、handoff trait、UnitOfWork、IdempotencyRepository、ClockPort、IdGeneratorPort | `application` | 编排 transaction、idempotency、stored result、event candidate 和 port 调用。 |
| repository adapter、projection store、reference store、safe summary store、source resolver adapter、publisher adapter、handoff adapter、config、runtime builder、fake adapter | `infra` | 实现 application port,不得替代 application service 或 domain invariant。 |
| command / query handler、route / RPC assembly | `api` | 只做 transport 到 application 的转换和 error mapping。 |
| inbound event consumer、event-collaboration continuation loop、projection worker | `worker` | 只做常驻 consumer / loop runner,不得绕过 application 写 truth或直连publisher adapter。 |
| operations job runner、job report mapping | `jobs` | 只做 one-shot job 调度,不得修复 core truth 或形成新 truth owner。 |

---

## 3. 当前文档问题诊断

| 位置 / 材料 | 当前问题 | 本步处理 |
|---|---|---|
| 正式 `02-概要设计.md` §5 | 8 个业务组成部分容易被误解为 8 个 crate 或 8 个顶层 Rust module。 | 本 Step 明确业务组成部分跨七个工程模块实现,不按业务组成部分拆 crate。 |
| 正式 `02-概要设计.md` §12 | 只说详细设计继续展开 module boundary、service、domain owner、repository / projection / port / job 归属。 | 本 Step 将这些承接点落到七个模块、依赖矩阵和 owner 规则。 |
| Step 4 文件布局 | 已有文件树和文件职责,但尚未固定模块对外暴露、允许依赖和禁止依赖。 | 本 Step 补模块主轴、依赖图、业务组成部分映射和 Step 6 / 7 承接门禁。 |
| 旧 `03-详细设计.md` | 旧目录 / service 围绕 `ProviderContract`、`CapabilityDecision`、`CostRecord`、KMS / Vault、`QueryCapabilities` 和 execution gateway。 | 完全不继承旧模块主轴;只作为 historical material 和污染审计。 |
| 后续 Step 6~9 | 若缺少模块主轴,对象、trait、DTO、flow 和 state 会按全仓总表漂移。 | 本 Step 固定 owner 规则,后续必须逐模块展开。 |

---

## 4. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 模块主轴 | Step 4 只固定 workspace member 和文件布局。 | 固定七个正式实现模块及职责边界。 | 后续对象、trait、协议和 flow 必须有稳定 owner。 |
| 业务组成部分 | 在概要层作为业务职责轴成立。 | 明确映射到七个实现模块,不作为 crate 边界。 | 避免循环依赖和重复 adapter。 |
| 依赖方向 | Step 4 只固定 `core-contracts` path dependency 落点和非 Cargo 关系。 | 形成 compile / module dependency matrix 和禁止方向。 | 支撑 Step 7 port owner 与 Cargo 依赖门禁。 |
| 入口模块 | Step 4 只有 API / worker / jobs 文件职责。 | 明确入口只调用 application,不拥有 truth、repository trait 或领域 guard。 | 防止 entry module 吞掉业务语义。 |
| 对象 / trait / handler 归属 | 只有概要候选和文件职责。 | 给出归属规则和 Step 6 / 7 handoff。 | 防止后续按对象类型写全仓总表。 |

---

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 以七个 workspace member 作为详细设计模块主轴 | 与 Step 4 一致,依赖方向可由 Cargo 强化,实现者可直接定位文件和 crate。 | 8 个业务组成部分需要跨模块映射。 | 采用。 |
| B. 以 8 个业务主要组成部分作为 crate / module 主轴 | 业务语义直观。 | 每个组成部分都会跨 DTO、domain、service、repo、projection、adapter 和 entry,容易循环依赖。 | 不采用。 |
| C. 单独拆 `ports` / `config` / `observability` crate | 横切职责显眼。 | 当前没有独立复用价值,且会削弱 `application` port owner 和 `infra` config / adapter owner。 | 不采用。 |
| D. 增加 `shared` / `common` / `utils` 模块 | 初期写起来快。 | 违反目录规范,会形成无边界公共桶。 | 不采用。 |
| E. 沿用旧 `provider_service` / `access_service` / `accounting_service` 模块主线 | 改动小。 | 绑定旧 ProviderContract、decision、cost、secret 和 runtime execution 污染。 | 不采用。 |

---

## 6. 结构化中间产物

### 6.1 模块总览表

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 允许依赖 |
|---|---|---|---|---|
| `contracts` | `crates/contracts` / `capability-hub-contracts` | 定义 public protocol carrier、typed ref、metadata、view、event、job、receipt 和 protocol error。 | DTO、typed ref、view、event、job input / receipt / report、fixtures、protocol error。 | `core-contracts` |
| `domain` | `crates/domain` / `capability-hub-domain` | 定义 capability access truth、relation、state、policy、不变量、safe summary、change record、event candidate formation 和 domain error。 | domain object、state enum、policy、record、DomainError。 | `contracts`、`core-contracts` |
| `application` | `crates/application` / `capability-hub-application` | 编排 command / query / consumer / job use case、transaction、idempotency、stored result、event candidate 和 port 调用。 | services、ports、repositories、UnitOfWork、idempotency、ApplicationError。 | `domain`、`contracts`、`core-contracts` |
| `infra` | `crates/infra` / `capability-hub-infra` | 实现 repository、projection store、reference resolver、safe summary adapter、read visibility、publisher、handoff、config、runtime builder 和 fake adapter。 | adapters、stores、runtime builder、config、fake assembly、InfraError。 | `application`、`domain`、`contracts`、`core-contracts` |
| `api` | `crates/api` / `capability-hub-api` | 承接同步 Command / Query handler 和 route / RPC assembly。 | command handlers、query handlers、routes、ApiError。 | `application`、`infra`、`contracts`、`core-contracts` |
| `worker` | `crates/worker` / `capability-hub-worker` | 承接 inbound event consumer、exact capture-ref collaboration continuation 和 projection maintenance worker。 | consumers、event-collaboration continuation runner、projection worker、WorkerError。 | `application`、`infra`仅binary wiring、`contracts`、`core-contracts` |
| `jobs` | `crates/jobs` / `capability-hub-jobs` | 承接 one-shot operations jobs、refresh、rebuild、reconciliation、reference refresh 和 event collaboration repair。 | job runners、job report mapping、JobError。 | `application`、`infra`、`contracts`、`core-contracts` |

### 6.2 模块依赖图: L3-capability-hub 模块实现主轴

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

- 图表达 crate / module 依赖方向,不表达函数级处理流、事务顺序、event topic 或 adapter 产品选型。
- `application` 定义 port trait 和 use case 编排;`infra` 实现这些 port,但不得反向改写 application 或 domain 不变量。
- `api`、`worker`、`jobs` 是入口 / runner 模块,通过 `infra::runtime_builder` 或装配层获得 application service,不得互相依赖。
- `contracts` 不感知 `domain`,因此跨仓公开 carrier 需要使用 `contracts` 或 `core-contracts` 中的 typed ref / marker / metadata。
- `domain` 不感知 DB、HTTP、message bus、config、external provider、governance、method-library、runtime、tools、SDK、marketplace 或 observability 产品。

### 6.3 模块依赖矩阵

| from / to | `core-contracts` | `contracts` | `domain` | `application` | `infra` | `api` | `worker` | `jobs` |
|---|---|---|---|---|---|---|---|---|
| `contracts` | allow | self | deny | deny | deny | deny | deny | deny |
| `domain` | allow | allow | self | deny | deny | deny | deny | deny |
| `application` | allow | allow | allow | self | deny | deny | deny | deny |
| `infra` | allow | allow | allow | allow | self | deny | deny | deny |
| `api` | allow | allow | deny direct business call | allow | allow | self | deny | deny |
| `worker` | allow | allow | deny direct business call | allow | allow | deny | self | deny |
| `jobs` | allow | allow | deny direct business call | allow | allow | deny | deny | self |

说明:

- `api` / `worker` / `jobs` 可因 type mapping 读取 `domain` 类型的返回值只应通过 `application` 暴露的 service result 或 error mapping 完成,不得直接调用 domain transition 或 repository adapter。
- 若实现阶段需要 entry 模块直接引用 domain type,必须在 Step 7 / Step 8 明确是 result mapping 的必要类型,且不得引入 direct business call。
- 非 `core-contracts` sibling 依赖全部视为运行期 / 事件 / ref / safe summary / handoff 协作,不得放入 Cargo dependency matrix。

### 6.4 业务组成部分到实现模块映射

| 业务主要组成部分 | 主 owner 模块 | 共同参与模块 | 说明 |
|---|---|---|---|
| 能力身份与接入语境 | `domain` + `application` | `contracts`、`infra`、`api`、`worker` | identity truth 和 review fact 在 domain;接入 / 更正 / 退役用例在 application;同步入口在 api;external source ref 和 resolver 在 infra。 |
| 注册目录与生命周期 | `domain` + `application` | `contracts`、`infra`、`api`、`jobs` | registry entry、lifecycle、visibility policy 在 domain;纳入 / 退出 / 对账编排在 application;repository 和 projection store 在 infra;reconciliation job 在 jobs。 |
| 接入描述与风险摘要 | `domain` + `application` | `contracts`、`infra`、`api`、`worker`、`jobs` | adapter descriptor、risk summary、secret safe summary 在 domain;descriptor use case 在 application;secret / document safe summary resolver 在 infra;reference refresh 在 worker / jobs。 |
| 治理与方法关系 | `domain` + `application` | `contracts`、`infra`、`api`、`worker` | governance seam 和 method body-free relation 在 domain;attach / replace / invalidate 编排在 application;governance / method ref resolver 和 inbound changed consumer 在 infra / worker。 |
| 正式暴露与受控消费 | `domain` + `application` | `contracts`、`infra`、`api`、`worker`、`jobs` | formal exposure 在 domain;controlled consumer view 构建在 application;view DTO 在 contracts;projection store 和 refresh job 在 infra / jobs。 |
| 追溯、变化与影响 | `domain` + `application` | `contracts`、`infra`、`api`、`worker`、`jobs` | trace / impact fact 在 domain;impact recording 和 handoff 编排在 application;handoff adapter 与 report store 在 infra;event publication / repair 在 worker / jobs。 |
| 派生维护与只读输出 | `application` + `infra` | `contracts`、`domain`、`api`、`worker`、`jobs` | derived material state / policy 在 domain;refresh / rebuild 编排在 application;projection / report stores 在 infra;query view 在 api;one-shot rebuild 在 jobs。 |
| 外部引用与安全摘要支撑 | `application` + `infra` | `contracts`、`domain`、`worker`、`jobs` | reference state 和 policy 在 domain;resolution use case 在 application;resolver / safe summary stores 在 infra;changed event consumer 和 refresh jobs 在 worker / jobs。 |

### 6.5 模块职责表

#### `contracts` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/contracts` / `capability-hub-contracts` |
| 对应概要设计主要组成部分 | 全部 8 个组成部分的 Command / Query / Event / Job / View public carrier |
| 主要责任 | 定义 typed ref、metadata wrapper、Command / Query / Event / Job DTO、view、receipt、public error 和 fixtures |
| 对外暴露 | `refs`;`metadata`;`commands`;`queries`;`events`;`jobs`;`views`;`errors`;`fixtures` |
| 允许依赖 | `core-contracts` |
| 禁止依赖 | `domain`;`application`;`infra`;`api`;`worker`;`jobs`;非 `core-contracts` sibling repo;DB / bus / HTTP / external SDK |
| 后续展开 | Step 6 收敛 typed ref / public marker owner;Step 8 定义 exact DTO;Step 12 定义 public error mapping |

#### `domain` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/domain` / `capability-hub-domain` |
| 对应概要设计主要组成部分 | 8 个组成部分的 truth / relation / state / policy / record / safe summary / derived state |
| 主要责任 | 定义 capability identity、registry、adapter descriptor、governance seam、method relation、formal exposure、trace / impact、derived material、reference state、event candidate formation 和 domain invariant |
| 对外暴露 | domain object、state enum、policy、safe summary、change record、trace / impact fact、event candidate formation object、`DomainError` |
| 允许依赖 | `contracts`;`core-contracts` |
| 禁止依赖 | `application`;`infra`;`api`;`worker`;`jobs`;config;repository;adapter;external provider;governance / method / runtime / tools / SDK source code |
| 后续展开 | Step 6 对象契约;Step 10 状态矩阵;Step 11 truth / relation persistence owner;Step 12 domain error |

#### `application` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/application` / `capability-hub-application` |
| 对应概要设计主要组成部分 | Application Services、Ports、Command / Query / Consumer / Job orchestration、transaction、idempotency、stored result |
| 主要责任 | 编排 validation、load current truth、domain transition、save order、history / trace、stale marker、stored result、event candidate、port resolver 和 handoff |
| 对外暴露 | `services`;`identity_service`;`registry_service`;`descriptor_service`;`relation_service`;`exposure_service`;`trace_impact_service`;`derived_material_service`;`reference_service`;`query_service`;`consumer_service`;`job_service`;`ports`;`unit_of_work`;`idempotency`;`ApplicationError` |
| 允许依赖 | `domain`;`contracts`;`core-contracts` |
| 禁止依赖 | `infra`;`api`;`worker`;`jobs`;concrete DB / message bus / external SDK;runtime execution;tools execution |
| 后续展开 | Step 7 port / repository trait;Step 9 function flow;Step 11 transaction boundary;Step 13 idempotency and retry |

#### `infra` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/infra` / `capability-hub-infra` |
| 对应概要设计主要组成部分 | Persistence、Projection / Material、Reference / Safe Summary、Publisher、Handoff、Config、Runtime assembly |
| 主要责任 | 实现 application port,提供 repository adapter、projection store、reference store、resolver、publisher、handoff adapter、idempotency store、clock / id adapter、config validation、runtime builder 和 test fake |
| 对外暴露 | `repositories`;`projection_stores`;`reference_stores`;`idempotency_store`;`source_resolvers`;`publishers`;`handoff_adapters`;`clock_id`;`config`;`runtime_builder`;`fakes`;`InfraError` |
| 允许依赖 | `application`;`domain`;`contracts`;`core-contracts` |
| 禁止依赖 | `api`;`worker`;`jobs`;修改 domain invariant;把 adapter result 直接写成 truth;保存 forbidden body |
| 后续展开 | Step 7 adapter contract;Step 11 persistence / projection consistency;Step 14 config / external binding;Step 16 fake parity tests |

#### `api` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/api` / `capability-hub-api` |
| 对应概要设计主要组成部分 | Synchronous Command / Query intake |
| 主要责任 | 将 Command / Query request 映射为 contracts DTO 和 application service 调用,映射 response / error |
| 对外暴露 | `command_handlers`;`query_handlers`;`routes`;`ApiError` |
| 允许依赖 | `application`;`infra`;`contracts`;`core-contracts` |
| 禁止依赖 | `worker`;`jobs`;直接访问 repository adapter;直接调用 domain transition;执行外部 MCP / A2A / API |
| 后续展开 | Step 8 Command / Query protocol;Step 9 handler to service flow;Step 12 API error mapping |

#### `worker` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/worker` / `capability-hub-worker` |
| 对应概要设计主要组成部分 | Inbound Event Consumer、event candidate publication、projection maintenance loop |
| 主要责任 | 消费 governance / method / external source / downstream / audit / external document changed events并调用 application consumer service；event-collaboration continuation loop只把exact durable capture ref交给application facade；运行projection maintenance loop |
| 对外暴露 | `consumers`;`event_publisher`;`projection_worker`;`WorkerError` |
| 允许依赖 | `application`;`infra`仅用于binary wiring;`contracts`;`core-contracts` |
| 禁止依赖 | `api`;`jobs`;entry直接持有capture repository / publisher adapter;绕过 application 写 core truth;consumer 自行修复 truth;保存 forbidden body |
| 后续展开 | Step 8 inbound event / outbound event protocol;Step 9 consumer and publisher flow;Step 13 dedup and reentry |

#### `jobs` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/jobs` / `capability-hub-jobs` |
| 对应概要设计主要组成部分 | Operations Job、Derived maintenance、Reference refresh、Reconciliation、Audit / discovery preparation、Event collaboration repair |
| 主要责任 | 执行 one-shot refresh / rebuild / reconciliation / reference resolution / event collaboration repair,输出 job receipt / report |
| 对外暴露 | `consumer_view_refresh`;`directory_projection_rebuild`;`audit_export_preparation`;`ecosystem_discovery_rebuild`;`reconciliation`;`reference_refresh`;`event_collaboration_repair`;`JobError` |
| 允许依赖 | `application`;`infra`;`contracts`;`core-contracts` |
| 禁止依赖 | `api`;`worker`;直接修复 core truth;把 job report 反写为 truth;伪造 evidence alias 或验收结果 |
| 后续展开 | Step 8 job protocol;Step 9 job flow;Step 11 report / material persistence;Step 16 job test cuts |

### 6.6 文件与代码主体映射表

| 文件路径 | 代码主体 | 类型 | 责任 |
|---|---|---|---|
| `crates/contracts/src/refs.rs` | typed refs / reason / marker | shared contract | public protocol 可复用引用类型,承接 capability id、source ref、governance ref、method ref、consumer ref、audit ref。 |
| `crates/contracts/src/metadata.rs` | command / query / event / job metadata | DTO support | 承接 actor、trace、idempotency、source event、operator metadata。 |
| `crates/contracts/src/commands.rs` | Command request / result | DTO | 写入口协议 carrier,不承载 domain transition。 |
| `crates/contracts/src/queries.rs` | Query request / response | DTO | 读入口协议 carrier、page、freshness、visibility、degraded surface。 |
| `crates/contracts/src/events.rs` | inbound / outbound event carrier | DTO | 事件消费和事件协作输出 carrier,不固定 topic / bus 产品。 |
| `crates/contracts/src/jobs.rs` | job input / receipt / report | DTO | operations job public surface。 |
| `crates/contracts/src/views.rs` | query / projection / consumer view | DTO | controlled consumer view、directory projection、report view carrier。 |
| `crates/domain/src/identity.rs` | capability identity truth | domain object group | 能力身份、接入语境、review fact、identity change。 |
| `crates/domain/src/registry.rs` | registry truth | domain object group | registry entry、lifecycle、visibility、registry change。 |
| `crates/domain/src/descriptor.rs` | descriptor truth / safe summary | domain object group | adapter descriptor、risk constraint summary、secret ref / safe summary、descriptor change。 |
| `crates/domain/src/governance_method.rs` | governance / method relation truth | domain relation group | governance seam、governance result ref、method body-free relation、method asset ref。 |
| `crates/domain/src/exposure.rs` | formal exposure / consumer view boundary | domain object / projection state | formal exposure、visibility / applicability、controlled consumer view、freshness policy。 |
| `crates/domain/src/trace_impact.rs` | trace / impact truth | domain fact / record | traceability record、change impact fact、downstream impact summary、handoff marker。 |
| `crates/domain/src/derived_material.rs` | derived material state | projection state / report | directory projection、audit export summary、ecosystem discovery summary、reconciliation report。 |
| `crates/domain/src/reference_resolution.rs` | external ref / safe summary state | domain state / ref | reference resolution state、external document ref、runtime / tools consumer ref、SDK ref、observability ref。 |
| `crates/domain/src/event_candidate.rs` | event candidate formation | domain record | 从 committed fact / change record / material refresh 形成 event candidate,不负责投递。 |
| `crates/domain/src/policies.rs` | domain policies | policy | capability identity、registry visibility、descriptor boundary、governance seam、method relation、exposure、freshness、derived material、reference resolution guard。 |
| `crates/application/src/*_service.rs` | use case orchestration | service | 逐业务组成部分编排 command / query / consumer / job service。 |
| `crates/application/src/ports.rs` | ports and repositories | trait owner | repository、projection、resolver、publisher、handoff、clock、id trait owner。 |
| `crates/application/src/unit_of_work.rs` | UnitOfWork | trait / transaction handle | 定义 transaction boundary 和 save order 承接点。 |
| `crates/application/src/idempotency.rs` | idempotency and stored result | application helper | 定义 request digest、duplicate replay、conflict 和 stored result 语义。 |
| `crates/infra/src/repositories.rs` | truth / relation repository adapters | adapter | 实现 identity、registry、descriptor、relation、exposure、trace repository。 |
| `crates/infra/src/projection_stores.rs` | projection / report stores | adapter | 实现 consumer view、directory、audit export、discovery、reconciliation material store。 |
| `crates/infra/src/reference_stores.rs` | reference / safe summary stores | adapter | 实现 external ref、safe summary、consumer ref、audit ref state store。 |
| `crates/infra/src/read_visibility.rs` | read visibility resolver | adapter | 在 query body load 前解析 actor、owner、formal visibility、reference / material scope；不写 truth、不创建 UoW。 |
| `crates/infra/src/source_resolvers.rs` | external source / governance / method / secret / consumer / audit resolvers | adapter | 通过 port 解析 ref 和 safe summary,不迁入外部正文。 |
| `crates/api/src/*_handlers.rs` | sync handler | entry | 映射 contracts DTO 到 application service。 |
| `crates/worker/src/*.rs` | consumer / runner | entry | 运行 inbound consumer、exact capture-ref collaboration continuation 和 projection maintenance loop。 |
| `crates/jobs/src/*.rs` | job runner | entry | 运行 one-shot maintenance / rebuild / reconciliation / repair job。 |

### 6.7 对象 / trait / handler / repository 归属门禁

| 候选类型 | 归属规则 | 禁止漂移 |
|---|---|---|
| public DTO / view / event / job report | 必须在 `contracts`。 | 不得放入 `domain` 后再由 API 复用。 |
| truth object / relation / state / policy | 必须在 `domain`。 | 不得放入 `application` service 或 `infra` adapter。 |
| application service / repository trait / external port trait | 必须在 `application`。 | 不得让 `infra` 先定义 trait 再让 application 适配。 |
| repository / resolver / publisher / handoff adapter | 必须在 `infra`。 | 不得让 `application` 依赖 concrete adapter。 |
| command / query handler | 必须在 `api`。 | 不得直接访问 repository 或 domain transition。 |
| inbound consumer / event-collaboration continuation loop / projection worker | 必须在 `worker`。 | 不得写 core truth repair或直连capture repository/publisher adapter。 |
| one-shot refresh / rebuild / reconciliation / repair runner | 必须在 `jobs`。 | 不得把 job report 或 repair output 变成 truth owner。 |
| test fixtures / fake adapters | public contract fixtures 可在 `contracts`;fake adapter implementation 在 `infra`;integration helper 在 `tests/support`。 | 不得让 production code 依赖 `tests/support`。 |

### 6.8 Step 6 对象组承接清单

| Step 6 对象组 | owner 模块 | 主要来源 | 当前 Step 只确定什么 |
|---|---|---|---|
| shared vocabulary / typed ref / public marker | `contracts` | Step 4 `refs.rs`;`02` §6 关键对象 ref | 归属与 public carrier owner,不写字段。 |
| identity / intake objects | `domain` | 能力身份与接入语境 | `CapabilityIdentity`、`CapabilityAccessReviewFact`、`ExternalCapabilitySourceRef`、identity policy / record owner。 |
| registry lifecycle objects | `domain` | 注册目录与生命周期 | registry entry、lifecycle、visibility policy、change record owner。 |
| descriptor / risk / secret safe summary objects | `domain` | 接入描述与风险摘要 | descriptor、risk summary、secret ref、safe summary、descriptor boundary policy owner。 |
| governance seam / method relation objects | `domain` | 治理与方法关系 | seam relation、governance result ref、method relation、method asset ref、boundary policy owner。 |
| exposure / controlled consumer view objects | `domain` | 正式暴露与受控消费 | formal exposure、visibility / applicability、controlled consumer view、freshness policy owner。 |
| trace / impact objects | `domain` | 追溯、变化与影响 | traceability record、change impact fact、downstream impact summary owner。 |
| derived material / report objects | `domain` | 派生维护与只读输出 | directory projection、audit export summary、ecosystem discovery summary、reconciliation report、derived policy owner。 |
| reference resolution objects | `domain` | 外部引用与安全摘要支撑 | reference resolution state、external document ref、consumer ref、SDK ref、observability ref owner。 |
| application helper objects | `application` | Step 8 processing flows;Step 11 / Step 13 承接 | UnitOfWork、idempotency、stored result、request digest、service result 等是否在 Step 6 闭口由 Step 6 判断。 |
| infra adapter state objects | `infra` | Step 7 / Step 11 / Step 14 承接 | adapter state / config validation result / fake parity 是否在 Step 6 闭口由 Step 6 判断。 |
| entry disposition / job report carrier | `contracts` + `api` / `worker` / `jobs` | Step 7 / Step 8 承接 | receipt / report public carrier 在 `contracts`;handler / runner disposition owner 在 entry module。 |

### 6.9 Step 7+ 承接清单

| 后续 Step | 本 Step 交付给后续的边界 |
|---|---|
| Step 6 对象实现契约 | 按 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 顺序筛选对象组;核心 truth / relation / policy 必须回到 `domain`,public carrier 回到 `contracts`。 |
| Step 7 Trait / Port / Adapter 契约 | repository trait、resolver trait、publisher trait、handoff trait、UnitOfWork、clock / id trait 归 `application`;具体 adapter 归 `infra`;entry runner 不定义 port。 |
| Step 8 Protocol 契约 | Command / Query / Event / Job / View / Receipt / Error DTO 归 `contracts`;handler / consumer / job runner 只做 mapping 和调用。 |
| Step 9 Function Flow | Command / Query / Consumer / Job flow 以 `application` service 为中心,`api` / `worker` / `jobs` 只作为入口,`infra` 只作为 port implementation。 |
| Step 10 State Matrix | 状态主语必须来自 `domain` object / projection state / reference state;entry runner 不新增状态机。 |
| Step 11 Persistence / Transaction | truth / relation / history / reference / material repository trait 归 `application`,adapter 归 `infra`;query no-write、consumer no-core-truth-write、job no-core-truth-repair 必须可测试。 |
| Step 12 Error / Recovery | DomainError、ApplicationError、InfraError、ApiError、WorkerError、JobError 和 protocol error mapping 按模块分层。 |
| Step 13 Concurrency / Idempotency | idempotency owner 在 `application`;dedup receipt / job reentry 由 `worker` / `jobs` 调 application 处理。 |
| Step 14 Config / External Binding | config struct / validation / runtime builder 在 `infra`;domain 不读配置。 |
| Step 15 Observability / Audit | trace / impact fact 在 `domain`;handoff port 在 `application`;handoff adapter 在 `infra`;不拥有 observability store。 |
| Step 16 Test Cuts | contract、domain、service、integration、entry、job test cut 按模块归属写入。 |

### 6.10 历史材料差异审计

| 历史材料口径 | 当前裁决 | 原因 |
|---|---|---|
| 旧 `ProviderContract` 作为 provider / contract 模块主线 | 禁入。 | 旧对象混入 provider runtime、quota、route、cost、failover 和 secret。当前由 descriptor / risk summary / secret ref / safe summary 分层替代。 |
| 旧 `CapabilityDecision` / allow-deny / `access_service.rs` | 禁入。 | 旧主线把 governance decision、runtime enforcement 和 formal exposure 混写。当前由 governance seam、formal exposure、controlled consumer view 分层表达。 |
| 旧 `QueryCapabilities` | 禁入旧语义。 | 当前 Query 只是 controlled consumer view 或 directory projection 读取,不得反写真相。 |
| 旧 `CostRecord` / `accounting_service.rs` | 禁入。 | cost / billing ledger 不归 capability-hub。 |
| 旧 KMS / Vault / `secret_store` | 禁入。 | secret 平台和 secret 正文不归本仓;只保留 `SecretRef` 和 `SecretHandlingSafeSummary`。 |
| 旧 outbox relay 产品实现 | 禁入当前模块主轴。 | 当前只固定 immutable snapshot / capture、external collaboration adapter和repair job归属；physical binding后移,不得新增outbox/relay/attempt store。 |
| 旧 runtime / tools execution gateway | 禁入。 | execution 不归本仓;entry / worker / job 不得执行外部能力调用。 |

---

## 7. 回填草稿

> 注意: 本节只是 Step 19 装配正式 `03-详细设计.md` 时的回填草稿,当前不直接修改正式文档。

````md
## 5. 模块实现契约

> 校准来源:
> - `design-calibration/03_ddd_step_05_module_contracts.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“模块职责表”“业务组成部分到实现模块映射”和“历史材料差异审计”小节,了解模块实现主轴如何从 Step 4 文件布局和概要设计组成部分收敛。

本仓详细设计以 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个实现模块为主轴。8 个业务主要组成部分跨这七个模块实现,不拆成业务 crate。后续对象、trait / port / adapter、协议、flow、状态、持久化、错误、幂等、配置、审计和测试切口都必须回到所属模块展开。

### 5.1 模块总览

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 允许依赖 |
|---|---|---|---|---|
| `contracts` | `crates/contracts` / `capability-hub-contracts` | public protocol carrier、typed ref、metadata、view、event、job、receipt 和 protocol error。 | DTO、typed ref、view、event、job input / receipt / report、protocol error。 | `core-contracts` |
| `domain` | `crates/domain` / `capability-hub-domain` | capability access truth、relation、state、policy、不变量、safe summary、change record 和 event candidate formation。 | domain object、state enum、policy、record、DomainError。 | `contracts`、`core-contracts` |
| `application` | `crates/application` / `capability-hub-application` | command / query / consumer / job use case、transaction、idempotency、stored result、event candidate 和 port 调用。 | services、ports、repositories、UnitOfWork、idempotency、ApplicationError。 | `domain`、`contracts`、`core-contracts` |
| `infra` | `crates/infra` / `capability-hub-infra` | repository、projection store、reference resolver、safe summary adapter、read visibility、publisher、handoff、config、runtime builder 和 fake adapter。 | adapters、stores、runtime builder、config、fake assembly、InfraError。 | `application`、`domain`、`contracts`、`core-contracts` |
| `api` | `crates/api` / `capability-hub-api` | 同步 Command / Query handler 和 route / RPC assembly。 | command handlers、query handlers、routes、ApiError。 | `application`、`infra`、`contracts`、`core-contracts` |
| `worker` | `crates/worker` / `capability-hub-worker` | inbound event consumer、exact capture-ref collaboration continuation 和 projection maintenance worker。 | consumers、event-collaboration continuation runner、projection worker、WorkerError。 | `application`、`infra`仅binary wiring、`contracts`、`core-contracts` |
| `jobs` | `crates/jobs` / `capability-hub-jobs` | one-shot operations jobs、refresh、rebuild、reconciliation、reference refresh 和 event collaboration repair。 | job runners、job report mapping、JobError。 | `application`、`infra`、`contracts`、`core-contracts` |

### 5.2 模块依赖图

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

- 图表达 crate / module 依赖方向,不表达函数级处理流、事务顺序、event topic 或 adapter 产品选型。
- `application` 定义 port trait 和 use case 编排;`infra` 实现这些 port,但不得反向改写 application 或 domain 不变量。
- `api`、`worker`、`jobs` 是入口 / runner 模块,不得互相依赖,不得绕过 application 写 truth。

### 5.3 业务组成部分到实现模块映射

| 业务主要组成部分 | 主 owner 模块 | 共同参与模块 |
|---|---|---|
| 能力身份与接入语境 | `domain` + `application` | `contracts`、`infra`、`api`、`worker` |
| 注册目录与生命周期 | `domain` + `application` | `contracts`、`infra`、`api`、`jobs` |
| 接入描述与风险摘要 | `domain` + `application` | `contracts`、`infra`、`api`、`worker`、`jobs` |
| 治理与方法关系 | `domain` + `application` | `contracts`、`infra`、`api`、`worker` |
| 正式暴露与受控消费 | `domain` + `application` | `contracts`、`infra`、`api`、`worker`、`jobs` |
| 追溯、变化与影响 | `domain` + `application` | `contracts`、`infra`、`api`、`worker`、`jobs` |
| 派生维护与只读输出 | `application` + `infra` | `contracts`、`domain`、`api`、`worker`、`jobs` |
| 外部引用与安全摘要支撑 | `application` + `infra` | `contracts`、`domain`、`worker`、`jobs` |

### 5.4 归属门禁

public DTO / view / event / job report 归 `contracts`;truth object / relation / state / policy 归 `domain`;application service / repository trait / external port trait 归 `application`;adapter / store / resolver / publisher / handoff / config / runtime builder 归 `infra`;handler 归 `api`;consumer / exact capture-ref collaboration continuation / projection worker 归 `worker`;one-shot operations runner 归 `jobs`。

任何模块不得恢复旧 `ProviderContract`、`CapabilityDecision`、`CostRecord`、`QueryCapabilities`、KMS / Vault、policy refresh、runtime / tools execution gateway 或 marketplace / cost / observability store 主线。
````

---

## 8. 待确认事项

| 待确认项 | 当前处理 | 是否阻塞 Step 6 |
|---|---|---|
| 目标实现仓 `/home/aris/Projects/quantalithos-capability-hub` 当前未发现 | 作为 Step 17 / `07` implementation prerequisite,不阻塞 design Step 5。 | 否 |
| entry 模块是否需要直接引用少量 domain result type | 当前默认通过 application service result 和 contracts DTO mapping;若必须直接引用,Step 8 明确。 | 否 |
| event candidate / publisher 是否需要具体 outbox store | 已由Step 8 / Step 9裁决为不需要；application-owned immutable snapshot / capture关闭pre-intent窗口,external delivery由collaboration Port拥有。 | 否 |
| exact API framework / message bus / DB / search / secret / observability 产品 | 不在 Step 5;Step 11 / Step 14 / `04` / `07` 后续处理。 | 否 |

---

## 9. 自检与停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否只定义模块主轴 | pass | 已固定七个实现模块、依赖方向、业务组成部分映射和归属门禁。 |
| 是否按 Step 4 文件布局承接 | pass | 模块名、package、crate、文件职责均沿用 Step 4。 |
| 是否把 8 个业务组成部分误拆成 crate | pass | 明确业务组成部分跨七个实现模块实现。 |
| 是否提前写对象字段 / trait 方法 / DTO schema / flow / state matrix | pass | 未写字段全集、函数签名、协议 schema、状态矩阵或持久化细节。 |
| 是否保护 capability-hub 边界 | pass | 未合并 runtime execution、tools execution、governance approval、method body、SDK client、marketplace listing、secret 正文、cost ledger、provider runtime 或 observability store。 |
| 是否隔离旧材料污染 | pass | 旧 `ProviderContract`、`CapabilityDecision`、`CostRecord`、`QueryCapabilities`、KMS / Vault、execution gateway 等均未继承。 |
| 是否修改正式 `03-详细设计.md` | no | 本 Step 只创建中间产物,正式文档仍等 Step 19 装配。 |
| 是否伪造测试、证据、run_id、签署或 commit | no | 未写真实测试结果、evidence alias、验收签署、run_id 或 commit。 |

---

## 10. 进入下一步条件

- 已明确详细设计模块主轴为 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。
- 已明确 8 个业务组成部分如何跨七个实现模块承接。
- 已明确 module dependency matrix、allowed / forbidden dependency、entry module 限制和非 `core-contracts` sibling 禁止进入 Cargo。
- 已明确对象、trait、handler、repository、adapter、job runner 的归属门禁。
- 已明确 Step 6 对象组和 Step 7+ 的承接方向。
- 已隔离旧正式文档和 README 的污染项。
- 用户审查确认后才允许进入 Step 6 `逐模块定义对象实现契约`。
