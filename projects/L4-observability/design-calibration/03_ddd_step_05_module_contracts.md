# L4-observability 03-详细设计 Step 05 · 模块实现契约总览

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 05
> 回填章节: `03-详细设计.md` §5 模块实现契约
> 当前模式: full-restart
> 当前门禁: Step 05 完成后停审,等待用户确认后才进入 Step 06

## 1. Step 状态

| 项 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 05 `定义模块实现契约总览` |
| 输出文件 | `design-calibration/03_ddd_step_05_module_contracts.md` |
| flow 文件 | `design-calibration/03_ddd_calibration_flow.md` |
| Step 状态 | done_plus_R2 |
| 正式回填状态 | assembled_and_repaired_in_19_R2 |
| gate_status | pass |
| next_allowed_action | closed_consumed_by_04_step_09 |
| downstream targeted repair | `CFG-BLK-09-01` repaired on 2026-07-15；新增 infra-owned、entry-safe prebuilt registration seam，raw transport / actor-policy / schedule binding保持infra-only |

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 05 | 已读取 | 约束本步固定模块主轴、职责、暴露内容、依赖方向和对象 / trait / handler / repository 归属 |
| `standards/document/详细设计书写规范.md` 5.5 | 已读取 | 约束模块总览、单模块小节、capability 映射、trait / error / test 切口和收口摘要 |
| `design-calibration/03_ddd_step_03_constraints.md` | 已完成 | 提供 Rust、依赖裁剪、源码英文和 `core-contracts` 编译期依赖约束 |
| `design-calibration/03_ddd_step_04_file_layout.md` | 已完成 | 提供 7 个 workspace member、文件布局、命名规则和 path dependency 写法 |
| `projects/L4-observability/02-概要设计.md` §4 / §5 / §6 / §12 | 当前正式概要输入 | 提供代码主体框架、10 个主要组成部分、关键对象分布和详细设计承接清单 |
| `02_hld_step_05_components_boundary.md` | 已读取 | 提供 10 个业务主要组成部分、职责、非职责和跨部分接缝 |
| `02_hld_step_06_key_objects*.md` | 已读取索引与摘要 | 提供 Step 06 对象候选池、对象族和不应对象化的名称边界 |
| `projects/L1-governance/design-calibration/03_ddd_step_05_module_contracts.md` | 已读取 | 作为模块主轴、依赖图、职责表粒度参考,不复制 Governance truth |
| `projects/L1-artifact/design-calibration/03_ddd_step_05_module_contracts.md` | 已读取 | 作为业务主语到 7 模块映射和跨模块接缝粒度参考,不复制 Artifact truth |
| 旧 `03_ddd_step_05_module_contracts.md` | historical material | 旧文件混入五个组成部分、health / cost / dashboard truth 和旧自动门禁;本步全量替换 |

## 3. SOP 问题回答

### 3.1 本仓详细设计应该拆成哪些实现模块?

详细设计实现模块与 Step 04 的 workspace member 对齐,固定为 7 个模块:

- `contracts`
- `domain`
- `application`
- `infra`
- `api`
- `worker`
- `jobs`

`L4-observability` 的 10 个主要组成部分是业务结构主语,不是 crate 边界。它们跨这 7 个实现模块协作实现,不能被误拆成 10 个 crate、10 个顶层 Rust module,也不能被 OTel / Prometheus / Grafana / TimescaleDB 等产品维度替代。

### 3.2 每个模块对应概要设计中的哪个主要组成部分或代码主体?

- `contracts`
  - 承接 Command / Query / Inbound Event / Outbound Event / Job / View / Receipt / Error 的公共协议骨架。
  - 为 read query、diagnostic、report handoff、peripheral export 和外部消费提供 public DTO / view surface。
- `domain`
  - 承接 observation-owned fact、safe signal、audit projection、body-free evidence linkage、report handoff、retention、no-write、gap、reference snapshot、maintenance state 和 domain policy。
- `application`
  - 承接 10 个 application service、port trait、UoW、idempotency、stored result、query no-write、consumer dedup 和 job orchestration。
- `infra`
  - 承接 repository、projection store、reference snapshot store、outbox store、publisher、source resolver、handoff / export adapter、config 和 runtime builder。
- `api`
  - 承接 `ObservationSyncEntry` 的同步 command / query handler。
- `worker`
  - 承接 `ObservationAsyncMaterialConsumer`、outbox publisher loop 和 projection maintenance resident loop。
- `jobs`
  - 承接 `ProjectionMaintenanceJob`、`ReferenceRefreshJob`、`GapScanJob`、`RollupRebuildJob`、observation replay、report handoff delivery 和 external audit export preparation。

### 3.3 每个模块对外暴露什么?

- `contracts` 暴露 typed ref、metadata wrapper、command / query DTO、event payload、job input / report、view、receipt 和 protocol error。
- `domain` 只向本仓 `application` 暴露 domain object、state enum、policy、history / outbox formation object 和 `DomainError`。
- `application` 暴露 service facade、port trait、repository trait、UnitOfWork、IdempotencyRepository、stored result carrier 和 `ApplicationError`。
- `infra` 暴露 adapter、repository implementation、projection store、runtime builder、config loader / validator 和 fake assembly。
- `api` 暴露 command / query handler、route / RPC assembly 和 `ApiError`。
- `worker` 暴露 inbound consumer、outbox publisher runner、projection worker runner 和 `WorkerError`。
- `jobs` 暴露 one-shot job runner、job report mapping 和 `JobError`。

### 3.4 每个模块允许依赖哪些模块,禁止依赖哪些模块?

依赖方向固定为单向:

- `contracts` 只允许依赖 `core-contracts`。
- `domain` 只允许依赖 `contracts`、`core-contracts`。
- `application` 只允许依赖 `domain`、`contracts`、`core-contracts`。
- `infra` 只允许依赖 `application`、`domain`、`contracts`、`core-contracts`。
- `api`、`worker`、`jobs` 只允许依赖 `application`、`infra`、`contracts`、`core-contracts`。

明确禁止:

- `contracts` / `domain` / `application` 反向依赖更外层模块。
- `api`、`worker`、`jobs` 互相依赖。
- 新增 `shared`、`common`、`utils` 这类无边界公共模块。
- 非 `core-contracts` sibling repo 进入 Cargo dependency。
- 外部产品 adapter 反向决定 domain truth、DTO 或状态机。

### 3.5 哪些对象、trait、handler、repository 应归属于哪个模块?

- DTO、typed ref、cursor、marker、receipt、view、event payload、job input / report、public protocol error 属于 `contracts`。
- observation receipt、safety disposition、correlation context、safe signal、audit projection、evidence linkage、report handoff、retention marker、no-write violation、gap、reference snapshot、maintenance state、policy、history record 和 domain error 属于 `domain`。
- command / query / consumer / job service、repository trait、resolver trait、publisher trait、handoff / export trait、UnitOfWork、idempotency replay 和 stored result 属于 `application`。
- repository adapter、read model store、projection store、reference store、publisher adapter、handoff adapter、external export adapter、config loader、runtime builder 和 fake assembly 属于 `infra`。
- synchronous command / query handler 属于 `api`。
- inbound material / audit consumer、pending outbox publisher 和 resident projection worker 属于 `worker`。
- rebuild / refresh / scan / replay / handoff / export one-shot runner 属于 `jobs`。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `03_ddd_step_05_module_contracts.md` | 使用旧五组成部分和 `HealthSummary`、`CostDashboard`、`AlertRule` 等旧 truth 心智 | 全量替换为当前 10 个主要组成部分和 7 个实现模块主轴 |
| `02-概要设计.md` §5 | 10 个业务主要组成部分容易被误拆成 crate / module | 本步明确业务主语跨 `contracts` / `domain` / `application` / `infra` / entry modules 实现 |
| `03_ddd_step_04_file_layout.md` | 已有文件布局,但尚未形成职责、暴露面和 allowed / forbidden dependency 门禁 | 本步补模块职责、依赖方向、对象归属和跨模块接缝 |
| 后续 Step 06~09 | 对象、trait、DTO、flow 若无 owner 容易漂移 | 本步固定对象 / trait / handler / repository 的单一归属原则 |
| 外部产品旧材料 | 易把 dashboard、alert、OTel、Grafana、TimescaleDB 写成模块 truth | 本步固定它们只能通过 `infra` adapter / config / fake,不能成为模块主轴 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 模块主轴 | 只有 workspace member 和旧 schema 摘要 | 固定 7 个正式实现模块及职责边界 | 支撑 Step 06~11 的 owner 判定 |
| 业务组成部分 | 可能被误认为 crate 边界 | 明确 10 个业务主语如何跨 7 个模块实现 | 防止按业务部分拆 crate 造成循环依赖 |
| 依赖方向 | Step 04 只有文件布局 | 固定 allowed / forbidden dependency matrix | 支撑 Cargo 和 trait owner 门禁 |
| entry 模块 | `api` / `worker` / `jobs` 只有目录信息 | 明确只做入口、调度和报告映射,不拥有 truth | 防止入口模块吞掉业务语义 |
| 外部协作 | 旧材料可能把产品能力内化 | 固定 runtime / event / product 协作通过 port / adapter / fake | 保持产品中立和 no-write 边界 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 以 7 个 workspace member 作为详细设计模块主轴 | 与 Step 04 一致,依赖方向可由 Cargo 强化,实现者可直接承接 | 10 个业务主语需要跨模块映射 | 采用 |
| B. 以 10 个主要组成部分作为 crate / module 主轴 | 业务语义直观 | 每个组成部分都会跨 DTO、domain、service、repo、projection 和 adapter,容易形成循环依赖 | 不采用 |
| C. 把 Projection / Handoff / Export 各自拆独立 crate | 派生和交接更显眼 | 过早放大派生层,会稀释 observation truth 主线 | 不采用 |
| D. 增加 `shared` / `common` 承载公共类型 | 初期写起来快 | 违反目录规范,会形成无边界公共桶 | 不采用 |
| E. 按外部产品拆 `otel` / `grafana` / `timescaledb` 模块 | 产品适配直观 | 产品会反向塑造 truth 和核心目录 | 不采用 |

## 7. 结构化中间产物

### 7.1 模块总览表

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 允许依赖 |
|---|---|---|---|---|
| `contracts` | `crates/contracts` / `observability-contracts` | 定义公共协议、typed ref、metadata、view、event、job、receipt 和 protocol error | DTO、ref、view、event、job、receipt、public error | `core-contracts` |
| `domain` | `crates/domain` / `observability-domain` | 定义 observation truth、state、policy、marker、audit projection、body-free evidence、history / outbox formation 和 domain error | aggregate、entity、value object、state enum、policy、DomainError | `contracts`、`core-contracts` |
| `application` | `crates/application` / `observability-application` | 编排 command / query / consumer / job 用例、事务、幂等、port 调用、no-write guard 和 stored result | services、ports、UoW、idempotency、ApplicationError | `domain`、`contracts`、`core-contracts` |
| `infra` | `crates/infra` / `observability-infra` | 实现 repository / resolver / store / publisher / handoff / export / config / runtime | adapters、stores、runtime_builder、config、fake assembly | `application`、`domain`、`contracts`、`core-contracts` |
| `api` | `crates/api` / `observability-api` | 承接同步 Command / Query 入口 | handlers、route assembly、ApiError | `application`、`infra`、`contracts`、`core-contracts` |
| `worker` | `crates/worker` / `observability-worker` | 承接异步输入消费、outbox publication 和常驻维护循环 | consumers、outbox publisher、projection worker、WorkerError | `application`、`infra`、`contracts`、`core-contracts` |
| `jobs` | `crates/jobs` / `observability-jobs` | 承接 one-shot operations jobs | job runners、run report mapping、JobError | `application`、`infra`、`contracts`、`core-contracts` |

### 7.2 模块依赖图: L4-observability 模块实现主轴

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

- 图只表达 crate / module 依赖方向,不表达函数级处理流。
- `application` 是业务编排中心,但不拥有 adapter 实现。
- `infra` 实现 `application` 定义的 port trait,但不得改写 domain 不变量。
- `api`、`worker`、`jobs` 都是入口模块,只通过 runtime builder / service facade 调用 `application`。
- `contracts` 和 `domain` 不感知 repository、adapter、config、HTTP、bus、DB、OTel、Prometheus、Grafana、TimescaleDB、external audit 或 job runner。

### 7.3 模块与 10 个主要组成部分映射表

| 主要组成部分 | 主 owner 模块 | 共同参与模块 | 当前固定口径 |
|---|---|---|---|
| `Observation Intake and Safety` | `domain` + `application` | `contracts`、`infra`、`api`、`worker` | intake fact / safety disposition 在 domain,写路径和 redaction-first 编排在 application |
| `Correlation and Safe Signal` | `domain` + `application` | `contracts`、`infra`、`worker`、`jobs` | correlation 和 safe signal 状态在 domain,rollup / projection 编排在 application |
| `Audit Projection and Body-free Evidence Linkage` | `domain` + `application` | `contracts`、`infra`、`worker` | audit projection 和 evidence linkage 在 domain,source material / body-free reference 通过 port 承接 |
| `Report Handoff and Authenticity` | `domain` + `application` | `contracts`、`infra`、`api`、`jobs` | handoff record / authenticity hint 在 domain,交接准备和 non-signoff guard 在 application |
| `Retention, Replay and No-write Guard` | `domain` + `application` | `contracts`、`infra`、`jobs` | retention marker、active protection、no-write violation 在 domain,guard 和 replay 编排在 application |
| `Read Query and Diagnostic Consumption` | `application` | `contracts`、`domain`、`infra`、`api` | query no-write 和 visibility 判断在 application,view DTO 在 contracts,projection store 在 infra |
| `Gap and Degraded Expression` | `domain` + `application` | `contracts`、`infra`、`worker`、`jobs` | gap / degraded state 在 domain,classification 和 propagation 在 application |
| `Peripheral Consumption and Export` | `application` + `infra` | `contracts`、`domain`、`api`、`jobs` | export preparation 和 delivery state 受 application guard 约束,产品 adapter 在 infra |
| `Product-neutral Adapter and Reference Support` | `infra` + `application` | `contracts`、`domain`、`worker`、`jobs` | external safe summary resolver 在 infra,reference snapshot state 和 freshness guard 归 domain / application |
| `Derived Maintenance and Replay Coordination` | `application` + `jobs` | `contracts`、`domain`、`infra`、`worker` | operations job 只维护本仓派生状态,不得修 source truth |

### 7.4 单模块契约总览

#### `contracts` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/contracts` / `observability-contracts` |
| 对应代码主体 | Command / Query / Event / Job 公共协议骨架;Read / Diagnostic / Handoff / Export public surface |
| 主要责任 | 定义跨入口和下游可复用协议 DTO、typed ref、reason、marker、view、event、job、receipt 和 protocol error |
| 对外暴露 | `refs`、`metadata`、`commands`、`queries`、`events`、`jobs`、`views`、`errors` |
| 允许依赖 | `core-contracts` |
| 禁止依赖 | `domain`、`application`、`infra`、`api`、`worker`、`jobs`;禁止依赖非 `core-contracts` sibling repo |

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续 Step 承接 |
|---|---|---|---|---|---|
| public typed carrier | core shared ids、safe refs、metadata | `ObservationRef`、`AuditProjectionRef`、`EvidenceLinkageRef`、`HandoffRef` 等 typed ref | 无本地写入 | 只承接可公开的 body-free carrier | Step 06 / Step 08 |
| command / query DTO | command / query protocol input | request / response / receipt DTO | 无本地写入 | 不包含 raw body / source truth body | Step 08 |
| event / job surface | event envelope、job metadata | payload、job report、job receipt | 无本地写入 | 不表达 bus truth 或 job execution truth | Step 08 / Step 16 |
| read / diagnostic / export view | projection state、visibility state | public view DTO | 无本地写入 | query no-write | Step 08 |

| 对象 / 对象组 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| typed refs / markers | public typed carrier | public value object / marker | 传递 observation、audit、evidence、handoff、retention、gap、reference、maintenance ref | 不持有正文、不解析外部 truth |
| Command / Query DTO | command / query DTO | DTO | 承载 request / response / error surface | 不承载 domain invariant |
| Event / Job DTO | event / job surface | DTO | 承载 event payload、job input、job report | 不代表 bus / scheduler truth |
| View DTO | read / diagnostic / export view | DTO | 承载安全可见读面 | 不写 projection、不修 truth |

#### `domain` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/domain` / `observability-domain` |
| 对应代码主体 | Domain Model、Domain Policy、history / record、outbox formation |
| 主要责任 | 定义 observation-owned fact、state、policy、marker、audit projection、evidence linkage、handoff、retention、gap、reference snapshot、maintenance state 和 domain error |
| 对外暴露 | domain aggregate、entity、value object、state enum、policy、history record、DomainError |
| 允许依赖 | `contracts`、`core-contracts` |
| 禁止依赖 | `application`、`infra`、`api`、`worker`、`jobs`;禁止读取 config、repository、adapter、外部产品或 source service |

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续 Step 承接 |
|---|---|---|---|---|---|
| observation fact guard | safe material summary、source ref、actor context | `ObservationReceipt`、`SafetyDisposition` | domain state transition only | 不保存 raw body | Step 06 / Step 10 |
| signal / audit domain | correlation context、safe signal、source audit ref | `SafeSignal`、`AuditProjection`、`EvidenceLinkage` | domain record formation | audit projection 不替代 source truth | Step 06 |
| handoff / retention / no-write domain | evidence index input、consumer ref、protected ref | `ReportHandoffRecord`、`RetentionMarker`、`NoWriteViolation` | marker / violation state | 不伪造 run_id / signoff;不清理 source truth | Step 06 / Step 10 |
| read / gap / peripheral domain state | visibility context、gap source、consumer ref | `DiagnosticSummary`、`GapState`、`PeripheralDeliveryState` | state / record formation | query / export 不写 source truth | Step 06 |
| reference / maintenance domain state | safe summary ref、maintenance target | `ReferenceSnapshotState`、`ProjectionMaintenanceState` | freshness / progress state | 不拥有外部 lifecycle | Step 06 / Step 10 |

| 对象 / 对象组 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| intake objects | observation fact guard | aggregate / entity / record | 建立 receipt、safety disposition、intake decision | 不保存 source raw body |
| signal / audit objects | signal / audit domain | entity / aggregate / value object | 建立 correlation、safe signal、audit projection、evidence linkage | 不裁决 runtime / governance / artifact truth |
| handoff / retention / no-write objects | handoff / retention / no-write domain | aggregate / state / record | 建立 handoff readiness、retention marker、active protection、violation record | 不生成验收结论、不修 source truth |
| visibility / gap / peripheral objects | read / gap / peripheral domain state | state / summary / record | 表达可见性、diagnostic、gap、degraded、delivery | 不执行 read-side write |
| reference / maintenance objects | reference / maintenance domain state | state / policy / execution record | 表达 reference freshness、maintenance progress、replay coordination | 不拥有外部正文 |

#### `application` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/application` / `observability-application` |
| 对应代码主体 | Application Services、Ports、UoW、Idempotency、No-write guard |
| 主要责任 | 编排 command / query / consumer / job 用例、事务、幂等、repository / port 调用、outbox / stale marker / stored result 副作用 |
| 对外暴露 | services、ports、repositories、UnitOfWork、IdempotencyRepository、ApplicationError |
| 允许依赖 | `contracts`、`domain`、`core-contracts` |
| 禁止依赖 | `infra`、`api`、`worker`、`jobs`;禁止直接依赖 DB / HTTP / bus / external SDK |

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续 Step 承接 |
|---|---|---|---|---|---|
| command orchestration | Command DTO、ActorContext、CommandMetadata | command result、stored result | writes observation-owned facts、history、outbox / stale marker | no-write source truth guard | Step 07 / Step 09 / Step 11 |
| query orchestration | Query DTO、QueryMetadata | view response、visibility surface | read only; may record read access only through explicit command / audit path if later allowed | query no-write | Step 08 / Step 09 |
| consumer orchestration | event envelope、dedup key、trace context | consumer receipt | dedup、quarantine、reference snapshot、projection stale | event collaboration only | Step 08 / Step 13 |
| job orchestration | JobMetadata、job input、cursor | job report、progress view | rebuild / refresh / scan / handoff side effects within observability boundary | job no-source-repair | Step 08 / Step 09 / Step 13 |
| port ownership | service needs | repository / resolver / publisher / handoff / export traits | trait definitions only | infra implements; application owns semantics | Step 07 |

| 对象 / 对象组 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| application services | command / query / consumer / job orchestration | service object | 编排 use case、policy、repository、outbox、stored result | 不保存 adapter state |
| port traits | port ownership | trait | 定义 repository、resolver、publisher、handoff、export、clock、id 边界 | 不绑定产品 |
| idempotency / stored result | command / consumer / job orchestration | application state carrier | duplicate replay、conflict、stored result | 不替代 domain state |

#### `infra` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/infra` / `observability-infra` |
| 对应代码主体 | Persistence、Projection、Reference Snapshot、Outbox、Product-neutral Adapter、Config、Runtime Builder |
| 主要责任 | 实现 application port,提供 fake / durable repository、projection store、reference store、publisher、handoff / export adapter、config 和 runtime builder |
| 对外暴露 | repositories、projection stores、reference stores、outbox stores、source resolvers、publishers、handoff adapters、external export adapters、config、runtime_builder、entry-safe registrar、InfraError |
| 允许依赖 | `contracts`、`domain`、`application`、`core-contracts` |
| 禁止依赖 | `api`、`worker`、`jobs`;禁止让 adapter 改写 domain 不变量或替代 application service |

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续 Step 承接 |
|---|---|---|---|---|---|
| persistence adapter | repository trait calls | stored observation / audit / retention / gap records | durable or fake storage | persistence not truth owner | Step 07 / Step 11 |
| projection / read store | projection write / read calls | read model / diagnostic / peripheral views | projection state | rebuild from committed facts only | Step 11 |
| source resolver | safe ref / source ref | safe summary / not-visible / unresolved | reference snapshot input | no external body | Step 07 / Step 14 |
| publisher / handoff / export adapter | outbox / handoff / export request | publication / delivery result | adapter result state | product-neutral; downstream failure no rollback | Step 07 / Step 14 |
| runtime builder / config | runtime config | assembled services + least-authority registrar handles | startup / adapter availability / pre-exposure registration | config cannot change truth boundary；registrar不能暴露locator/material/private registry | Step 14 |

| 对象 / 对象组 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| repository / store adapters | persistence adapter | infra adapter / stored row mapper | 保存本仓 facts、projection、outbox、idempotency | 不执行业务 guard |
| resolver / publisher adapters | source resolver; publisher / handoff / export adapter | infra adapter | 连接 runtime / event / external product boundary | 不引入 Cargo sibling dependency |
| config / runtime builder / registrar | runtime builder / config / technical registration seam | infra config / assembly object / opaque process-local registration capability | 装配服务、fake runtime并把预解析transport/scheduler绑定为有限register动作 | 不改变 domain / application 语义；不允许lookup/downcast/adapter调用 |

#### `api`、`worker`、`jobs` 入口模块

| 模块 | 必须承载 | 不得承载 | 后续展开位置 |
|---|---|---|---|
| `api` | sync command / query handler、request mapping、response mapping、route / RPC assembly | 直接访问 repository、私有业务判断、跨入口共享状态、source truth write | Step 08 Command / Query protocol;Step 09 handler flow |
| `worker` | inbound material / audit consumers、outbox publish loop、projection maintenance loop、consumer receipt mapping；把9个typed handler交给infra registrar并持有opaque registered-loop handle | 核心 truth 修复、one-shot job、public query surface、绕过 application 写 store；读取transport/actor-policy locator或private registry | Step 08 Consumer protocol;Step 13 并发 / 重入;Step 14 registration seam |
| `jobs` | rebuild / refresh / gap scan / rollup / replay / handoff / export one-shot runner；把9个typed handler交给infra schedule registrar并持有opaque registered-schedule handle | API 行为、常驻 consumer 循环、source truth repair、真实验收结论生成；读取schedule locator或补造Job request | Step 08 Job protocol;Step 09 job flow;Step 14 registration seam |

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 协作边界 | 后续 Step 承接 |
|---|---|---|---|---|---|
| sync entry | command / query request | handler result | application call only | no direct repo write | Step 08 / Step 09 |
| async entry | event / material envelope | consumer receipt | application consumer call, outbox publish loop | no source truth repair | Step 08 / Step 13 |
| operations entry | job input / cursor | job report | application job service call | no real run_id / signoff fabrication | Step 08 / Step 09 / Step 16 |

### 7.5 跨模块接缝与后续展开表

| 接缝 | owner 模块 | 使用模块 | 当前固定口径 | 后续展开 |
|---|---|---|---|---|
| typed ref / metadata / marker / receipt | `contracts` | 全部模块 | 公共协议类型只能在 `contracts` 或 `core-contracts` 定义 | Step 06 / Step 08 |
| observation truth / state / policy | `domain` | `application` | truth 所有权不可漂移到 entry、adapter、projection 或 external product | Step 06 / Step 10 |
| repository / resolver / publisher / handoff / export traits | `application` | `infra` | trait owner 固定在 `application`;adapter 只实现不改语义 | Step 07 |
| query view / diagnostic / export public surface | `contracts` + `application` | `api`、`jobs`、downstream consumers | view type 在 `contracts`,组装语义在 `application` | Step 08 / Step 09 |
| read model / projection / rebuild material | `infra` + `domain` | `application`、`jobs` | persistence 形态在 infra,正式 freshness / progress state 在 domain | Step 11 |
| inbound handler / consumer / job runner | `api` / `worker` / `jobs` | `application` | 入口模块只做解析、调度、报告映射 | Step 08 / Step 09 |
| config and external binding | `infra` + `application` | `api`、`worker`、`jobs` | config 只能注入参数和 adapter binding,不能改变 truth boundary；entry只接收locator-free metadata和prebuilt registrar | Step 14 |

### 7.5-a `19.R2 / CFG-BLK-09-01` entry registration ownership repair

Current `04` Step 09发现原Step 14把`InboundConsumerBindingConfig`和`JobScheduleBindingConfig`直接复用为worker/jobs entry slice字段。前者携带`TransportBindingRef`和`PolicyBindingRef`，后者携带`ScheduleBindingRef`；同时entry又被禁止构造adapter或取得private registry，因此原契约无法在不泄露locator的条件下完成注册。本修复只闭合technical composition seam，不重开业务scope。

| Subject | Unique owner | Entry receives | Owner keeps private | Forbidden shortcut |
|---|---|---|---|---|
| raw Consumer transport / actor-policy binding | `infra::config` + `infra::runtime_builder` | `ValidatedInboundConsumerRegistration` safe metadata + `Arc<dyn InboundConsumerRegistrar>` | transport locator/handle、actor-policy locator/mapper、provider cause | raw binding进入worker；worker按ref查private registry |
| raw Job schedule binding | `infra::config` + `infra::runtime_builder` | `ValidatedJobScheduleRegistration` safe metadata + `Arc<dyn JobScheduleRegistrar>` | schedule locator/trigger、scheduler handle、provider cause | schedule ref进入jobs；jobs构造scheduler adapter |
| Consumer handler catalog | `infra::runtime_builder`拥有technical trait/catalog shape；`worker`实现并构造 | registrar只接收9个finite optional typed handler | inbound/publication façade与context factory仍由worker bundle持有 | generic free-text callback、direct repository/resolver、infra反向依赖worker |
| Job handler catalog | `infra::runtime_builder`拥有technical trait/catalog shape；`jobs`实现并构造 | registrar只接收9个finite optional typed handler | publication/maintenance façade与context factory仍由jobs bundle持有 | schedule补造actor/key/scope/target/cursor/input、infra反向依赖jobs |
| registered runtime handle | infra创建、entry持有process-local ownership | opaque lifecycle handle only | concrete transport/scheduler、locator/material、private registry | downcast、binding lookup、业务调用、持久化为truth |

Registration遵守以下模块规则：

1. `infra`可以定义并实现technical registrar trait，因为它拥有已解析transport/scheduler；这些trait不是application business port，也不进入`contracts` public protocol。
2. `worker`/`jobs`依赖`infra`并实现finite handler callback，不形成反向依赖；`infra`仍不得依赖entry crate。
3. Registrar在process exposure前校验safe metadata、private binding和handler catalog exact totality；missing/extra/type-family mismatch只映射existing `RuntimeAssemblyError::EntryBindingIncomplete`。
4. Registration必须all-or-nothing。失败时撤销并等待所有已prepare的loop/schedule，返回zero active root；成功前不得消费event或触发Job。
5. Consumer invocation只携带existing typed envelope与已映射`ActorSafeRef`；Job invocation只携带existing `ObservationJobRequest<T>`。两条路径均不得输出locator/material或生成业务identity。
6. Opaque registered handle只负责process-local lifecycle，不是adapter、repository、UoW、business truth、run/evidence或验收载体。

### 7.6 模块错误类型和测试切口总表

| 模块 | 错误类型 owner | 主要错误面 | 测试切口 |
|---|---|---|---|
| `contracts` | `ProtocolError` / public error DTO | validation、unsupported version、visibility denied、degraded / unavailable surface | DTO roundtrip、schema version、public error mapping |
| `domain` | `DomainError` | invalid transition、forbidden body、redaction missing、body-free violation、no-write violation、handoff non-signoff | state transition、policy guard、forbidden body negative |
| `application` | `ApplicationError` | idempotency conflict、expected version conflict、port failure、quarantine、dead-letter, no-write blocked | service flow、idempotency replay、query no-write、consumer duplicate |
| `infra` | `InfraError` | storage unavailable、adapter unavailable、config invalid、publication failed、handoff failed | fake adapter contract、config negative、projection rebuild source |
| `api` | `ApiError` | request mapping、protocol error response、application error mapping | command / query handler tests |
| `worker` | `WorkerError` | consumer receipt mapping、dedup failure、publication loop failure | consumer duplicate、quarantine、retry / dead-letter |
| `jobs` | `JobError` | job input invalid、cursor stale、partial failure、report mapping | job flow、failure report、no-source-repair |

### 7.7 Step 06 入口与收口摘要

| 收口主题 | 结论 | 后续承接 |
|---|---|---|
| shared vocabulary / typed ref / public marker 收口 | public carrier 归 `contracts`;共享基础语义只来自 `core-contracts`;不得新增 `shared/common` 模块 | Step 06 / Step 08 |
| domain object owner | observation、signal、audit、evidence、handoff、retention、no-write、read visibility、gap、peripheral、reference、maintenance state 均归 `domain` | Step 06 |
| non-core module object decision | application services、idempotency、stored result、port trait、infra adapter state、entry handler state、job report mapping 均需在对应模块闭口;不得机械后推给实现者 | Step 06 / Step 07 / Step 08 |
| trait / port owner | repository、resolver、publisher、handoff、export、clock、id、UoW、idempotency trait 均归 `application` 定义,`infra` 实现 | Step 07 |
| protocol owner | command / query / event / job public surface 归 `contracts`;handler / runner 归 `api` / `worker` / `jobs` | Step 08 |
| transaction owner | transaction boundary、save order、outbox / history / projection stale 副作用由 `application` 定义 | Step 09 / Step 11 |
| state owner | domain state enum 在 `domain`;runtime availability、job progress、adapter availability 等若为唯一 carrier,由对应模块在 Step 06 明确闭口 | Step 06 / Step 10 |
| test owner | contract tests 对 `contracts`;policy / state tests 对 `domain`;service flow 对 `application`;adapter / integration 对 `infra`;entry tests 对 `api` / `worker` / `jobs` | Step 16 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_05_module_contracts.md`
>
> 延伸阅读:
> - 建议继续阅读本文件 §7 的模块总览、模块依赖图、10 个主要组成部分映射、单模块契约总览和 Step 06 入口摘要。

## 5. 模块实现契约

本仓详细设计主轴固定为 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个实现模块,与 Step 04 workspace member 对齐。10 个业务主要组成部分不是 crate 边界,而是跨七个模块协作实现。

依赖方向为: `contracts -> domain -> application`, `infra` 实现 `application` 定义的 port,`api` / `worker` / `jobs` 只作为入口和 runner 调用 `application`。`contracts` 只依赖 `core-contracts`;`domain` 不依赖 repository、adapter、config 或外部产品;`application` 不依赖 `infra`;`api`、`worker`、`jobs` 互不依赖。任何非 `core-contracts` sibling repo 不得进入 Cargo dependency。

对象、trait、handler、repository 的归属原则为: public DTO / view / event / job / receipt / error 归 `contracts`;domain object / state / policy / history record 归 `domain`;service、port trait、UoW、idempotency 和 stored result 归 `application`;repository adapter、projection store、resolver、publisher、handoff / export adapter、config、runtime builder和entry-safe registrar归 `infra`;同步 handler 归 `api`;consumer、finite inbound handler catalog和registered-loop handle归 `worker`;one-shot runner、finite Job handler catalog和registered-schedule handle归 `jobs`。Registrar只是infra-entry technical seam，不进入application port或public protocol。

## 9. 待确认事项

| 待确认项 | 当前处理 | 是否阻塞 Step 06 |
|---|---|---|
| 目标实现仓当前未发现 | 保留为 Step 17 / `07` 实施前置 gate | 否 |
| 每个 member 的实际 `core-contracts` 引用 | 归 Step 07 / Step 14 结合 trait 和 runtime binding 细化;当前只固定允许方向 | 否 |
| application / infra / entry 模块中的对象是否在 Step 06 闭口 | 已明确不能机械后推,Step 06 逐模块判定并记录 defer 理由 | 否 |
| 外部产品 adapter 是否拆更细模块 | 留给 Step 14 和 `04-配置设计.md`;当前只固定归 `infra` | 否 |

## 10. 自检与进入下一步条件

| 检查项 | 结论 |
|---|---|
| 是否固定详细设计模块主轴 | pass |
| 是否说明 10 个业务组成部分不作为 crate 边界 | pass |
| 是否输出模块总览表和模块依赖图 | pass |
| 是否明确每个模块的职责、对外暴露、允许依赖和禁止依赖 | pass |
| 是否明确对象、trait、handler、repository 归属 | pass |
| 是否排除 `shared/common/utils` 无边界模块 | pass |
| 是否排除非 `core-contracts` sibling Cargo dependency | pass |
| 是否为 Step 06 逐模块对象契约提供入口 | pass |
| `CFG-BLK-09-01` registrar / handler / registered handle owner是否唯一且不产生反向Cargo依赖 | pass_after_R2 |
| 是否保持正式 `03-详细设计.md` 到 Step 19 才装配 | pass |
| gate_status | pass |
| next_allowed_action | closed_consumed_by_04_step_09 |
