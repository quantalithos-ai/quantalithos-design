# Step 5. 定义模块实现契约主轴

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 5
> 回填章节: `03-详细设计.md` §5 模块实现契约,以及 §6 全局对象 / Trait / API 索引的模块定位部分
> 生成日期: 2026-06-12
> 状态: Step 5 已完成,已审核通过

---

## 1. Step 状态 + Step 内计划

本 Step 只定义详细设计全文的模块主轴、模块职责、对外暴露、允许依赖和禁止依赖,并建立对象 / trait / handler / repository 的归属规则。本文不展开对象字段、函数签名、port trait 细节、DTO schema、状态转换矩阵、SQL DDL 或函数级 flow。

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取 Step 4 workspace 文件布局 | 已完成 | §2 |
| 读取 `02` 主要组成部分、代码主体和对象索引 | 已完成 | §2 |
| 读取 `01` 依赖方向与层间约束 | 已完成 | §2 |
| 回答 Step 5 SOP 问题 | 已完成 | §3 |
| 诊断旧实现 / 当前材料的模块边界问题 | 已完成 | §4 |
| 形成改动前后对比 | 已完成 | §5 |
| 明确模块主轴取舍 | 已完成 | §6 |
| 输出模块总览表、模块职责表、模块依赖图和归属规则 | 已完成 | §7 |
| 形成正式 `03` §5 回填草稿 | 已完成 | §9 |
| 更新 `03_ddd_calibration_flow.md` 状态 | 已完成 | `03_ddd_calibration_flow.md` |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `03_ddd_step_04_file_layout.md` | 已审核通过 | 提供 workspace 成员、文件布局、dependency draft 和文件职责 |
| `03_ddd_step_03_constraints.md` | 已审核通过 | 提供 Rust 2024、英文源码、runtime / compile dependency 约束 |
| `02-概要设计.md` §4 | 已收稳 | 提供实现分层: Inbound / Operations、Application Services、Domain Model、Ports / Persistence / Projection / Outbox |
| `02-概要设计.md` §5 | 已收稳 | 提供 8 个主要组成部分及“不承担什么”边界 |
| `02-概要设计.md` §6~§9 | 已收稳 | 提供对象索引、接口骨架、处理流和状态主语 |
| `01-架构设计.md` §8 | 已收稳 | 提供依赖方向、层间约束、跨仓依赖裁剪和禁止依赖 |
| `standards/document/详细设计讨论流程_SOP.md` Step 5 | 最新流程标准 | 规定模块总览、职责表和依赖图 |

---

## 3. SOP 问题回答

### 3.1 本仓详细设计应该拆成哪些实现模块?

本仓详细设计以 7 个 workspace crate 作为顶层实现模块:

- `identity-contracts`
- `identity-domain`
- `identity-application`
- `identity-infra`
- `identity-api`
- `identity-worker`
- `identity-jobs`

这些模块不是业务主要组成部分本身,而是代码实现层。业务主要组成部分会横跨多个模块。例如“全局生命周期”会在 `contracts` 中有 command / result / view schema,在 `domain` 中有 state / policy,在 `application` 中有 command service flow,在 `infra` 中有 repository / resolver adapter,在 `api` 中有 handler。

### 3.2 每个模块对应概要设计中的哪个主要组成部分或代码主体?

- `identity-contracts` 对应 API / 接口骨架、canonical outbound event material、query view、job I/O 和 public error surface。
- `identity-domain` 对应 8 个主要组成部分中的 truth / state / policy / guard / trace / outbox / handoff 领域模型。
- `identity-application` 对应 Application Services,承接 command、query、consumer、maintenance、propagation 的用例编排。
- `identity-infra` 对应 Ports / Persistence / Projection / Outbox 的技术实现,包括 store、resolver、publisher、handoff 和 fake runtime。
- `identity-api` 对应 Inbound 中的 Command Intake / Query Intake。
- `identity-worker` 对应 Inbound Event Consumer、callback consumer 和常驻后台承接。
- `identity-jobs` 对应 Operations Job、publisher / handoff follow-up 和 maintenance runner。

### 3.3 每个模块对外暴露什么?

- `contracts` 暴露 public DTO、typed ref、view、event payload、job DTO、receipt、error。
- `domain` 暴露领域对象、状态、policy、domain change 和 domain error,不暴露 persistence 或 runtime implementation。
- `application` 暴露 service API、port trait、application error、stored result / idempotency boundary。
- `infra` 暴露 adapter builders、fake / controlled runtime、repository implementations 和 runtime wiring。
- `api` 暴露 router / handler assembly 和 binary entry。
- `worker` 暴露 event consumer / callback dispatcher 和 binary entry。
- `jobs` 暴露 job runner builders 和 job binary entry。

### 3.4 每个模块允许依赖哪些模块,禁止依赖哪些模块?

允许依赖方向:

```text
api / worker / jobs -> application -> domain -> contracts -> core-contracts
api / worker / jobs -> infra -> application / domain / contracts
infra -> application / domain / contracts
```

禁止方向:

- `contracts` 不依赖任何 identity 内部 crate。
- `domain` 不依赖 `application`、`infra`、`api`、`worker`、`jobs`、SQLx、Axum、Tokio、bus 或相邻业务仓 implementation。
- `application` 不依赖 `infra`、`api`、`worker`、`jobs` 或 durable adapter implementation。
- `infra` 不定义业务规则、不新增 domain invariant、不反向修改 domain state。
- `api` / `worker` / `jobs` 不直接访问 repository implementation,必须经 application service。
- 任何模块不得依赖 `quantalithos-bus`、method-library、work、governance、memory / archive、observability 或 runtime implementation 作为 Cargo path dependency。

### 3.5 哪些对象、trait、handler、repository 应归属于哪个模块?

归属规则:

- typed ref、DTO、public event payload、query view、job report、receipt、public error: `contracts`。
- truth object、state enum、policy、guard、domain change、domain error: `domain`。
- service、command / query / consumer / maintenance / propagation use case、port trait、idempotency helper、stored result assembler: `application`。
- SQLx / durable repository implementation、in-memory fake、external resolver adapter、publisher adapter、handoff adapter、report writer、runtime config binding: `infra`。
- HTTP / RPC handler、route、request context extraction: `api`。
- event envelope dispatcher、consumer loop、callback dispatcher: `worker`。
- job runner、job binary、run metadata / scope / cursor entry mapping: `jobs`。

---

## 4. 当前材料 / 旧文档问题诊断

| 材料 / 倾向 | 问题 | 本轮处理 |
|---|---|---|
| 旧 identity 单 crate 以 `src/domain`、`src/application`、`src/persistence` 分目录 | 目录分层存在,但 Cargo 无法约束 public contracts、domain、application、infra 的依赖方向 | Step 5 采用 workspace module 主轴 |
| `02` 的 8 个主要组成部分容易被误当 8 个 crate | 业务组成部分会横跨 contracts/domain/application/infra/entry,不能直接等同代码层 | Step 5 用 workspace crate 做实现模块,用业务族做模块内组织线 |
| `Step 4` 文件职责表已列对象 / port / handler 文件 | 若直接扩写,会过早进入对象字段和 trait 签名 | Step 5 只定义归属规则;细节后移 Step 6 / 7 |
| `infra` 容易承接业务判断 | 外部 resolver / repository adapter 可能把来源失败伪装成 accepted truth | Step 5 明确 infra 只实现 port,业务判断在 application/domain |
| `api` / `worker` / `jobs` 容易绕过 application 直接访问 store | 会破坏 transaction、idempotency、trace / outbox 顺序 | Step 5 明确所有入口必须经 application service |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 模块主轴 | 只有 Step 4 文件布局,尚未明确模块职责和依赖方向 | 7 个 workspace crate 成为正式实现模块主轴 |
| 业务组成部分与代码层 | 容易把 8 个业务组成部分误拆成 8 个 crate | 业务组成部分横跨各实现模块,在模块内按业务族组织 |
| 对象归属 | 对象名在 `02` 中有索引,但未分配到实现模块 | truth / policy 归 domain,DTO / view 归 contracts,service / port 归 application,adapter 归 infra |
| 入口层职责 | API / worker / jobs 可能承载业务判断 | 入口层只做 request/event/job mapping 和 service dispatch |
| infra 职责 | 旧实现可能让 persistence / resolver 决定业务语义 | infra 只实现 application ports,不得定义 invariant |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 以 8 个业务主要组成部分作为顶层 crate | 不采用 | 会导致每个业务 crate 内重复 contracts/domain/application/infra,并增加横向依赖 |
| 以技术分层 workspace crate 作为模块主轴 | 采用 | 与 Step 4 workspace、架构依赖方向和治理仓成熟形态一致 |
| 在每个 crate 内按业务族组织文件 | 采用 | 保留业务可读性,同时不破坏 Cargo 依赖边界 |
| 把 ports 放入 `domain` | 不采用 | 端口服务于 application 编排和外部 adapter,放在 domain 会让核心语义感知外部接缝 |
| 把 handlers 放入 `application` | 不采用 | handler 是入口 mapping,不应污染 use case 与 transaction orchestration |
| 把 fake runtime 放入 tests | 不采用为唯一位置 | fake / controlled runtime 是正式 adapter 等价语义的一部分,应在 `infra` 暴露并由 tests 使用 |

---

## 7. 结构化中间产物

### 7.1 模块总览表

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 依赖对象 |
|---|---|---|---|---|
| Contracts Module | `identity-contracts` | 定义 public protocol、typed refs、views、events、jobs、receipts、public errors | DTO、refs、markers、view structs、event payload、job report、receipt、error response | `core-contracts`;serde / thiserror 等基础库 |
| Domain Module | `identity-domain` | 定义 identity-owned truth、state、policy、guard、domain change 和 domain error | domain structs/enums、policy methods、domain change objects | `identity-contracts`, `core-contracts` |
| Application Module | `identity-application` | 定义 use case services、port traits、transaction orchestration、idempotency / stored result boundary | service structs, port traits, application errors, result assembly helpers | `identity-domain`, `identity-contracts`, `core-contracts` |
| Infra Module | `identity-infra` | 实现 repository、resolver、publisher、handoff、projection、report writer、fake runtime 和 runtime config binding | adapter builders、repository impl、fake runtime、wiring functions | `identity-application`, `identity-domain`, `identity-contracts` |
| API Module | `identity-api` | 承接 synchronous command/query entry | router, handlers, request context extraction, `identity-api` binary | `identity-application`, `identity-contracts`, `identity-infra` |
| Worker Module | `identity-worker` | 承接 inbound event consumer、callback consumer 和常驻 worker | consumer dispatcher, callback dispatcher, `identity-worker` binary | `identity-application`, `identity-contracts`, `identity-infra` |
| Jobs Module | `identity-jobs` | 承接 projection/reference/reconciliation/outbox/handoff/retry operations job | job runner, job binaries | `identity-application`, `identity-contracts`, `identity-infra` |

### 7.2 模块职责表

| 模块 | 允许承接 | 禁止承接 |
|---|---|---|
| `identity-contracts` | public request / response / event / job / view / receipt / error schema;typed refs and markers | domain policy、repository trait、adapter implementation、SQLx/Axum/Tokio wiring |
| `identity-domain` | truth object、state enum、policy、guard、domain change、domain error | repository implementation、external resolver、handler、job runner、runtime config |
| `identity-application` | service orchestration、port trait、transaction boundary、idempotency and stored result protocol | SQLx query、HTTP route、event bus implementation、source adapter implementation |
| `identity-infra` | durable/fake repository、resolver adapter、publisher/handoff adapter、projection store、report writer、runtime config binding | business invariant、new public DTO、direct handler logic |
| `identity-api` | route、handler、request context mapping、service dispatch | business transition、repository access、event publish, projection rebuild |
| `identity-worker` | event/callback intake mapping、consumer loop、service dispatch | external truth ownership、domain transition outside service、store bypass |
| `identity-jobs` | job arg parsing、run metadata/scope/cursor mapping、service dispatch | business truth mutation outside service、silent remediation、store bypass |

### 7.3 业务组成部分到模块映射表

| 业务主要组成部分 | Contracts | Domain | Application | Infra | Entry |
|---|---|---|---|---|---|
| 身份锚定与成员真相 | member refs, command/query DTO, anchor view | `GlobalMember`, `IdentityAnchorState`, `IdentityAnchorPolicy` | establish/read member service | member repository, id generator | API |
| 全局生命周期 | lifecycle command/result/view, basis refs | `GlobalLifecycleState`, transition policy, high-risk guard | lifecycle command/query service | member/lifecycle repository, governance basis resolver | API |
| 角色能力摘要 | role summary DTO, source event DTO, view | summary/source state/policy | maintain summary and source consumer service | method source resolver, reference store | API / Worker |
| 身份生涯记录 | career command/event/query DTO | `CareerRecord`, append policy | append career and work event service | work source resolver, career repository | API / Worker |
| 记忆引用关系 | memory command/event/query DTO, handoff receipt | `MemoryReference`, state/policy | maintain memory ref and archive callback service | memory/archive resolver and handoff adapter | API / Worker |
| 身份事实消费与追溯 | summary/trace/audit views and errors | trace/audit domain records, visibility policy | query service and trace/audit read service | projection store, trace/audit repository | API |
| 派生维护与对账 | job DTO, report view | projection/reference/report state, reconciliation policy | maintenance service | projection/reference store, report writer | Jobs |
| 身份事实传播与外部交接 | outbound payload, outbox/handoff query DTO, job DTO | outbox/handoff state/policy | propagation service | publisher, handoff adapter, outbox store | Worker / Jobs |

### 7.4 对象 / trait / handler / repository 归属规则

| 设计元素 | 归属模块 | 说明 |
|---|---|---|
| `GlobalMember`、`IdentityAnchorState`、`GlobalLifecycleState` 等 truth/state | `identity-domain` | Step 6 定义字段、函数、状态和不变量 |
| `IdentityAnchorPolicy`、`HighRiskLifecycleGuard`、`VisibilityPolicy` 等 policy / guard | `identity-domain` | 不读取 repository、不调用 adapter |
| `EstablishGlobalMemberRequest`、`MemberSummaryView`、`IdentityOutboxChangedPayload` 等 DTO/view/payload | `identity-contracts` | Step 8 定义 schema 和 serialization |
| `MemberRepositoryPort`、`RoleCapabilitySourceResolverPort`、`IdentityOutboxPublisherPort` 等 port trait | `identity-application` | Step 7 定义 trait 签名和 fake 等价语义 |
| `IdentityCommandService`、`IdentityQueryService`、`MaintenanceService` 等 service | `identity-application` | Step 9 定义函数级 flow |
| `SqlxMemberRepository`、`InMemoryIdentityRuntime`、`MethodSourceResolverAdapter` | `identity-infra` | 实现 application ports |
| HTTP route / handler | `identity-api` | 只做 request mapping、metadata extraction、service call |
| inbound event consumer / callback dispatcher | `identity-worker` | 只做 event mapping、dedupe context、service call |
| operations job runner / binary | `identity-jobs` | 只做 job input、run context、service call |
| integration / flow tests | `tests/` 或对应 crate tests | 测试切口由 Step 16 定义 |

### 7.5 模块依赖图: L1-identity 模块实现主轴

```text
                +-------------------+
                | identity-api      |
                +---------+---------+
                          | call
                          v
                +-------------------+
                | identity-worker   |
                +---------+---------+
                          | call
                          v
                +-------------------+
                | identity-jobs     |
                +---------+---------+
                          | call
                          v
                  +-------+-------+
                  | application   |
                  +---+-------+---+
                      | call  ^ impl port
                      v       |
                  +---+-------+---+
                  | domain        |
                  +---+-------+---+
                      | use   ^
                      v       | use
                  +---+-------+---+
                  | contracts    |
                  +-------+-----+
                          ^
                          | use
                  +-------+-----+
                  | core-contracts |
                  +---------------+

                  +---------------+
                  | infra         |
                  +-------+-------+
                          | implements ports for application
                          v
                  +---------------+
                  | external adapters / stores |
                  +---------------+
```

关键说明:
- 图表达模块依赖方向,不表达函数级处理流。
- `api`、`worker`、`jobs` 都调用 `application`;图中纵向排列只是入口族展示,不是它们互相调用。
- `infra` 实现 `application` 定义的 ports,但不定义业务规则。
- `domain` 只依赖 `contracts` / `core-contracts`,不得依赖 runtime、store、handler 或 adapter。

### 7.6 模块依赖审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否以对象清单替代模块 | 未发现 | 模块按 workspace crate 和职责定义 |
| 是否重新定义架构边界 | 未发现 | 承接 `01` 的依赖方向和 `02` 的实现分层 |
| 是否存在 L1 / quantalithos 前缀泄漏 | 未发现 | 代码模块使用 `identity-*` / `identity_*` |
| 是否允许 runtime/event dependency 进入 Cargo | 未发现 | 只有 `core-contracts` 是 compile dependency |
| 是否有入口层直接写 truth 的风险 | 已识别并禁止 | API / worker / jobs 只能 dispatch service |
| 是否有 infra 反向定义 domain 的风险 | 已识别并禁止 | infra 只实现 application ports |

---

## 8. 复杂度判断 / 是否拆分

本 Step 只定义模块主轴,不需要拆附录。

Step 6 复杂度高,必须按模块小循环执行:

1. 先收敛 `contracts` shared vocabulary / typed refs / public markers。
2. 再逐业务族展开 `domain` 对象能力和不变量。
3. 再处理 application helper / state carrier 只在确有功能来源时进入。
4. 最后做跨模块对象归属审计。

当前不创建 Step 6~19 的未来文件。

---

## 9. 回填草稿

正式 `03-详细设计.md` §5 后续应回填:

### 5.1 模块主轴

`L1-identity` 新版详细设计以 `identity-contracts`、`identity-domain`、`identity-application`、`identity-infra`、`identity-api`、`identity-worker`、`identity-jobs` 七个 workspace crate 作为模块实现契约主轴。业务主要组成部分横跨这些模块,不得把 8 个业务组成部分直接拆成 8 个 crate。

### 5.2 依赖方向

`contracts` 只依赖 `core-contracts` 和基础序列化 / 错误工具;`domain` 依赖 `contracts`;`application` 依赖 `domain` 和 `contracts`,并定义 port trait;`infra` 实现 application ports;`api`、`worker`、`jobs` 只做入口 mapping 和 service dispatch。

### 5.3 归属规则

typed refs、DTO、view、event payload、job DTO、receipt 和 public error 归 `contracts`;truth、state、policy、guard、domain change 和 domain error 归 `domain`;service、port trait、idempotency 和 stored result boundary 归 `application`;repository / resolver / publisher / handoff adapter 和 fake runtime 归 `infra`;handler、consumer、job runner 分别归 `api`、`worker`、`jobs`。

正式正文要等 Step 19 统一装配,当前不直接回填。

---

## 10. 待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 7 个 workspace crate 作为模块主轴 | 若不认可,Step 4 需要回退调整布局 | 当前按 Step 4 审核通过继续 |
| 是否认可业务组成部分横跨模块而非直接成为 crate | 若不认可,会导致 crate 之间横向业务耦合增加 | 当前采用实现层主轴 + 业务族文件组织 |
| 是否认可 ports 归 application 而不是 domain | 若不认可,Step 7 port 契约归属会变化 | 当前按 dependency inversion 由 application 定义 port |
| 是否认可 fake / controlled runtime 归 infra | 若不认可,Step 7 / 16 fake 等价语义会缺少正式实现位置 | 当前归 infra 并由 tests 使用 |

---

## 11. 进入 Step 6 的条件

进入 Step 6 前必须满足:

- 用户审核通过模块总览表。
- 用户确认 `contracts/domain/application/infra/api/worker/jobs` 的职责和暴露面。
- 用户确认对象、trait、handler、repository 的归属规则。
- 用户确认 Step 6 应按模块 capability 小循环展开,不能回到全局对象大表。
