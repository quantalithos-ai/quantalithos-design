# Step 5. 定义模块实现契约主轴

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 5
- 回填章节:`03-详细设计.md` §5 模块实现契约

### 2. 本步输入

- 上一步中间产物:
  - `projects/L1-process/design-calibration/03_ddd_step_04_file_layout.md`
- 上游正式文档:
  - `projects/L1-process/01-架构设计.md`
  - `projects/L1-process/02-概要设计.md` §4 / §5 / §12
- 概要设计校准来源:
  - `projects/L1-process/design-calibration/02_hld_step_04_code_subject_framework.md`
  - `projects/L1-process/design-calibration/02_hld_step_05_components_boundary.md`
  - `projects/L1-process/design-calibration/02_hld_step_12_detailed_design_handoff.md`
- 规范输入:
  - `standards/document/详细设计书写规范.md` §5.5
  - `standards/document/设计真相源闭环与可落码性标准.md`

### 3. SOP 问题回答

1. 本仓详细设计应该拆成哪些实现模块?

   回答:详细设计实现模块与 Step 4 的 workspace member 对齐,采用 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个模块作为主轴。业务主要组成部分不直接变成 crate;它们跨越多个模块实现。

2. 每个模块对应概要设计中的哪个主要组成部分或代码主体?

   回答:`contracts` 承接 Command / Query / Consumer / Event / Job / View 协议骨架;`domain` 承接 Process truth core、runtime shape、profile、instance、activity、gate、checkpoint、recovery、rhythm、derived state、reference state 的领域对象和 policy;`application` 承接所有用例编排、幂等、事务和 port 调用;`infra` 承接 persistence / projection / external seam / runtime builder;`api` 承接同步 command / query intake;`worker` 承接 inbound consumer、outbox publish loop 和常驻维护;`jobs` 承接 projection rebuild、reference refresh、reconciliation、recovery maintenance 和 handoff operations job。

3. 每个模块对外暴露什么?

   回答:
   - `contracts` 对外暴露 public DTO、typed ref、view、event、job、receipt 和 protocol error。
   - `domain` 只暴露领域对象、policy、state 和 domain error 给本仓 application 使用。
   - `application` 暴露 service、port trait、UoW、idempotency 和 application error 给 api / worker / jobs / infra 装配使用。
   - `infra` 暴露 adapter、runtime builder、config 和 fake runtime assembly。
   - `api`、`worker`、`jobs` 暴露入口 handler / runner,不作为其他业务模块的依赖对象。

4. 每个模块允许依赖哪些模块,禁止依赖哪些模块?

   回答:依赖方向必须单向。`contracts` 只依赖 `core-contracts`;`domain` 可依赖 `contracts` 和 `core-contracts`;`application` 可依赖 `contracts`、`domain` 和 `core-contracts`;`infra` 可依赖 `contracts`、`domain`、`application` 和 `core-contracts`;`api`、`worker`、`jobs` 可依赖 `contracts`、`application`、`infra` 和 `core-contracts`。禁止 `contracts` / `domain` / `application` 反向依赖更外层模块,禁止 `api`、`worker`、`jobs` 互相依赖。

5. 哪些对象、trait、handler、repository 应归属于哪个模块?

   回答:
   - DTO、ref、reason、receipt、view、protocol error 属于 `contracts`。
   - aggregate、value object、state enum、domain policy、domain error 属于 `domain`。
   - command / query / consumer / job service、repository trait、external resolver trait、publisher trait、handoff trait、UnitOfWork、IdempotencyRepository、ClockPort、IdGeneratorPort 属于 `application`。
   - repository adapter、projection store、snapshot store、source resolver adapter、publisher adapter、handoff adapter、config loader、runtime builder 属于 `infra`。
   - synchronous handler 属于 `api`;inbound event consumer 和 outbox worker 属于 `worker`;operations job runner 属于 `jobs`。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| `02-概要设计.md` §5 | 按业务主要组成部分描述职责,容易被误拆成业务 crate | 本 Step 明确业务组成部分跨模块实现,不作为 crate 边界 |
| `03_ddd_step_04_file_layout.md` | 已给出 crate 和文件布局,但还没有模块职责 / 依赖矩阵 | 本 Step 补模块主轴和依赖方向 |
| 旧 `03-详细设计.md` | 保留旧业务对象和旧 service 口径 | 本 Step 只承接新版 `00/01/02` 和 Step 4,不继承旧模块主轴 |
| 后续 Step 6 / 7 / 8 | 对象、trait、DTO 尚未分配正式归属 | 本 Step 给出归属门禁,后续逐模块展开 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 模块主轴 | 仅有 workspace member 和概要实现分层 | 固定 7 个模块主轴和职责边界 | 便于后续对象 / trait / DTO 归属 |
| 业务组成部分 | 可能被误认为 crate / module 边界 | 明确跨 `contracts` / `domain` / `application` / `infra` / entry modules 实现 | 避免十个业务部分拆 crate |
| 依赖方向 | Step 4 只有预告 | 本 Step 固定 allowed / forbidden dependency | 支撑 Cargo dependency matrix |
| handler / worker / job | 只有文件布局 | 明确只作为入口调用 application,不互相依赖 | 防止入口模块承担业务 truth |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 以 workspace member 作为模块主轴 | 与 Step 4 文件布局一致,依赖方向可由 Cargo 强制 | 业务组成部分需要在模块内映射 | 采用 |
| B. 以十个业务主要组成部分作为模块主轴 | 业务语义直观 | 每个组成部分都会跨 DTO、domain、service、repo、outbox,容易形成循环依赖 | 不采用 |
| C. 以概要实现分层作为正式模块但不绑定 crate | 文档表达灵活 | 实现者仍不知道 crate 依赖和文件归属 | 不采用 |
| D. 单独拆 shared / common 模块 | 复用便利 | 违反目录规范,容易成为无边界垃圾桶 | 不采用 |

### 7. 结构化中间产物

#### 7.1 模块总览表

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 依赖对象 |
|---|---|---|---|---|
| `contracts` | `crates/contracts` / `process-contracts` | 定义公共协议、typed ref、view、event、job、receipt 和 protocol error | DTO、ref、view、event、job、fixtures、protocol error | `core-contracts` |
| `domain` | `crates/domain` / `process-domain` | 定义 Process truth 对象、value object、state、policy、不变量和 domain error | aggregate、policy、state enum、DomainError | `contracts`、`core-contracts` |
| `application` | `crates/application` / `process-application` | 编排 command / query / consumer / job 用例、事务、幂等、port 调用和 application port errors | services、ports、UnitOfWork、IdempotencyRepository、application error mappers | `contracts`、`domain`、`core-contracts` |
| `infra` | `crates/infra` / `process-infra` | 实现 repository / adapter / config / runtime builder 和 fake runtime | adapters、stores、runtime builder、config、InfraError | `contracts`、`domain`、`application`、`core-contracts` |
| `api` | `crates/api` / `process-api` | 同步 Command / Query handler 和 API assembly | command handlers、query handlers、routes、ApiError | `contracts`、`application`、`infra`、`core-contracts` |
| `worker` | `crates/worker` / `process-worker` | inbound event consumer、outbox publish loop、projection invalidation worker | consumers、worker runners、WorkerError | `contracts`、`application`、`infra`、`core-contracts` |
| `jobs` | `crates/jobs` / `process-jobs` | operations job runner、projection rebuild、reference refresh、reconciliation、recovery maintenance、trace / archive handoff | job runners、JobError | `contracts`、`application`、`infra`、`core-contracts` |

#### 7.2 模块依赖图: L1-process 模块实现主轴

```text
                         +------------------+
                         |  core-contracts  |
                         +---------+--------+
                                   ^
                                   |
+---------------+                  |
|   contracts   |------------------+
+-------+-------+
        ^
        |
+-------+-------+
|    domain     |
+-------+-------+
        ^
        |
+-------+-------+
|  application  |<-----------------------------+
+-------+-------+                              |
        ^                                      |
        | implements ports                     |
+-------+-------+                              |
|     infra     |------------------------------+
+---+-------+---+
    ^       ^       ^
    |       |       |
+---+--+ +--+----+ ++------+
| api  | |worker| | jobs   |
+------+ +------+ +--------+
```

关键说明:

- 图表达 crate / module 依赖方向,不表达函数级处理流。
- `api`、`worker`、`jobs` 是入口模块,它们通过 `infra::runtime_builder` 获得 application service 装配。
- `infra` 实现 `application` 定义的 port trait,但 `application` 不依赖 `infra`。
- `domain` 不感知 repository、adapter、config、HTTP、bus、DB 或 job runner。
- `contracts` 不感知 domain,因此 query view / command DTO 中使用的共享 enum / ref 必须定义在 `contracts` 或 core contracts。

#### 7.3 模块职责表

##### `contracts` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/contracts` / `process-contracts` |
| 对应概要设计主要组成部分 | Command / Query / Event / Job 骨架;Process consumption and traceability;Derived maintenance and reconciliation |
| 主要责任 | 定义跨入口和下游可复用协议 DTO,不承载领域不变量 |
| 对外暴露 | refs、metadata、commands、queries、events、jobs、views、errors、fixtures |
| 允许依赖 | `core-contracts` |
| 禁止依赖 | `domain`、`application`、`infra`、`api`、`worker`、`jobs` |

##### `domain` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/domain` / `process-domain` |
| 对应概要设计主要组成部分 | 全部 truth / policy / state 主体,尤其 Process truth core、Runtime shape management、Profile adoption、Process execution、Gate coordination、Checkpoint and recovery、rhythm |
| 主要责任 | 定义领域对象、状态、policy、不变量和 domain error |
| 对外暴露 | `RuntimeProcessShape`、`ProcessProfile`、`ProcessInstance`、`Activity`、`Token`、`Gateway`、`WaitingGate`、`ProcessCheckpoint`、`RecoveryAttempt`、`ProcessStageState`、`ProcessTimeboxBinding`、policy、DomainError |
| 允许依赖 | `contracts`、`core-contracts` |
| 禁止依赖 | `application`、`infra`、`api`、`worker`、`jobs`;禁止读取 config、repository、adapter 或外部服务 |

##### `application` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/application` / `process-application` |
| 对应概要设计主要组成部分 | Application Services、Ports and External Seams、Operations orchestration |
| 主要责任 | 编排用例、事务、幂等、repository / port 调用、outbox / trace / projection 副作用 |
| 对外暴露 | command / query / consumer / job services、port trait、UnitOfWork、IdempotencyRepository、application port errors / mappers |
| 允许依赖 | `contracts`、`domain`、`core-contracts` |
| 禁止依赖 | `infra`、`api`、`worker`、`jobs`;禁止直接依赖 DB / HTTP / bus / external SDK |

##### `infra` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/infra` / `process-infra` |
| 对应概要设计主要组成部分 | Persistence / Projection、Ports implementation、Config binding、Runtime assembly |
| 主要责任 | 实现 application port,提供 fake / durable repository、snapshot store、publisher、resolver、handoff adapter、config 和 runtime builder |
| 对外暴露 | repositories、projection stores、reference stores、source resolvers、publishers、handoff adapters、config、runtime_builder、InfraError |
| 允许依赖 | `contracts`、`domain`、`application`、`core-contracts` |
| 禁止依赖 | `api`、`worker`、`jobs`;禁止让 adapter 改写 domain 不变量 |

##### `api` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/api` / `process-api` |
| 对应概要设计主要组成部分 | Inbound command / query intake |
| 主要责任 | 将同步 Command / Query 请求解析为 contracts DTO,调用 application service,映射 protocol / application error |
| 对外暴露 | command handlers、query handlers、routes、ApiError |
| 允许依赖 | `contracts`、`application`、`infra`、`core-contracts` |
| 禁止依赖 | `domain` 直接业务调用、`worker`、`jobs`;禁止直接访问 repository adapter |

##### `worker` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/worker` / `process-worker` |
| 对应概要设计主要组成部分 | Inbound Event Consumer、Outbox and Handoff、Derived maintenance trigger |
| 主要责任 | 消费入站事件、运行 outbox publisher loop、触发 projection invalidation / maintenance,并调用 application service |
| 对外暴露 | consumers、outbox_publisher、projection_worker、WorkerError |
| 允许依赖 | `contracts`、`application`、`infra`、`core-contracts` |
| 禁止依赖 | `api`、`jobs`;禁止绕过 application 写 repository |

##### `jobs` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/jobs` / `process-jobs` |
| 对应概要设计主要组成部分 | Operations Job、Derived maintenance and reconciliation、External context mirror support、trace / archive handoff |
| 主要责任 | 执行一次性 projection rebuild、reference refresh、reconciliation、recovery maintenance、trace handoff 和 archive handoff job |
| 对外暴露 | job runners、JobError |
| 允许依赖 | `contracts`、`application`、`infra`、`core-contracts` |
| 禁止依赖 | `api`、`worker`;禁止把 job 结果反写成未定义 truth |

#### 7.4 文件与代码主体映射表

| 文件路径 | 代码主体 | 类型 | 责任 |
|---|---|---|---|
| `crates/contracts/src/commands.rs` | Command DTO / result | DTO | 写入口协议字段和结果面 |
| `crates/contracts/src/queries.rs` | Query DTO / view response | DTO | 读入口协议字段、page、visibility 和 degraded surface |
| `crates/contracts/src/events.rs` | inbound / outbound event payload | DTO | event 协作契约和 outbox payload |
| `crates/contracts/src/jobs.rs` | Operations job contracts | DTO | job 输入、receipt 和错误 surface |
| `crates/domain/src/runtime_shape.rs` | Runtime shape management | aggregate / state | RuntimeProcessShape lifecycle truth |
| `crates/domain/src/process_profile.rs` | Profile adoption management | aggregate | ProcessProfile adoption truth |
| `crates/domain/src/process_instance.rs` | Process execution management | aggregate | ProcessInstance lifecycle truth |
| `crates/domain/src/activity.rs` | Process execution management | entity / state | Activity lifecycle and feedback binding |
| `crates/domain/src/token_gateway.rs` | Process execution management | entity / state | Token and Gateway flow control |
| `crates/domain/src/waiting_gate.rs` | Gate coordination | aggregate / value object | WaitingGate and PauseContext |
| `crates/domain/src/checkpoint.rs` | Checkpoint and recovery | aggregate | ProcessCheckpoint validity |
| `crates/domain/src/recovery.rs` | Checkpoint and recovery | aggregate / history | RecoveryAttempt continuity |
| `crates/domain/src/rhythm.rs` | Process timing and rhythm | state / binding | ProcessStageState and ProcessTimeboxBinding |
| `crates/domain/src/reference.rs` | External context mirror support | value object / state | external refs, snapshots, ReferenceResolutionState |
| `crates/domain/src/projection.rs` | Derived maintenance and reconciliation | state / value object | DerivedProcessViewState |
| `crates/domain/src/trace.rs` | Process consumption and traceability | record | ProcessTraceRecord and ProcessAuditTrail |
| `crates/domain/src/outbox.rs` | Process truth core / Outbox | record | ProcessOutboxRecord formation |
| `crates/application/src/shape_service.rs` | Runtime shape command service | service | shape sync orchestration |
| `crates/application/src/profile_service.rs` | Profile command service | service | profile adoption / tailoring orchestration |
| `crates/application/src/instance_service.rs` | Instance command service | service | instance start / lifecycle orchestration |
| `crates/application/src/activity_service.rs` | Activity progression service | service | activity progression and feedback orchestration |
| `crates/application/src/waiting_gate_service.rs` | Waiting gate service | service | open / resume waiting gate orchestration |
| `crates/application/src/recovery_service.rs` | Recovery service | service | checkpoint and recovery orchestration |
| `crates/application/src/rhythm_service.rs` | Rhythm service | service | stage and timebox binding orchestration |
| `crates/application/src/ports.rs` | Ports and external seams | trait | repository、resolver、publisher、handoff traits |
| `crates/infra/src/repositories.rs` | Persistence adapters | adapter | truth repository implementations |
| `crates/infra/src/source_resolvers.rs` | External context mirrors | adapter | method / work / identity / governance / artifact / runtime / conversation resolvers |
| `crates/api/src/command_handlers.rs` | Command intake | handler | 同步写入口 |
| `crates/worker/src/consumers.rs` | Event intake | handler | inbound event consumer |
| `crates/jobs/src/projection_rebuild.rs` | Operations job | runner | projection rebuild |

#### 7.5 对象归属预告

正式对象契约留给 Step 6,本 Step 只固定归属:

| 对象类别 | 归属模块 | 示例 |
|---|---|---|
| protocol DTO / result / receipt / view / event / job | `contracts` | `StartProcessInstanceRequest`、`ProcessInstanceCommandResult`、`ProcessTimelineView`、`ActivityProgressedEvent` |
| typed ref / reason / query visible marker | `contracts` | `ProcessInstanceRef`、`ActivityRef`、`WaitingGateReasonRef`、`ProjectionFreshnessState` |
| truth aggregate / entity / value object | `domain` | `RuntimeProcessShape`、`ProcessProfile`、`ProcessInstance`、`Activity`、`WaitingGate` |
| policy / invariant guard | `domain` | `ShapeDefinitionPolicy`、`InstanceProgressionPolicy`、`RecoveryContinuityPolicy` |
| trace / audit / outbox domain record | `domain` | `ProcessTraceRecord`、`ProcessAuditTrail`、`ProcessOutboxRecord` |
| application service | `application` | `ProcessShapeSyncService`、`ProcessInstanceCommandService`、`AuthorizedProcessQueryService` |
| repository / port trait | `application` | `ProcessInstanceRepository`、`MethodDefinitionResolverPort`、`ProcessOutboxPublisherPort` |
| adapter / fake / runtime builder | `infra` | `InMemoryProcessInstanceRepository`、`FakeOutboxPublisher`、`ProcessRuntimeBuilder` |
| handler / consumer / job runner | `api` / `worker` / `jobs` | `handle_start_process_instance`、`consume_runtime_activity_feedback`、`run_projection_rebuild` |

#### 7.6 模块测试切口预告

正式测试切口留给 Step 16,本 Step 只固定测试归属:

| 模块 | 测试归属 |
|---|---|
| `contracts` | DTO roundtrip、schema validation、fixture builder |
| `domain` | object invariant、state transition、policy guard |
| `application` | command / query / consumer / job service flow、idempotency、transaction boundary |
| `infra` | fake repository、fake adapter、config validation |
| `api` | handler validation、error mapping、duplicate replay surface |
| `worker` | consumer dedup、outbox publish retry、worker failure mapping |
| `jobs` | job input validation、receipt、partial failure、no truth rewrite |

### 8. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_05_module_contracts.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“模块总览表”“模块依赖图”“模块职责表”“文件与代码主体映射表”和“对象归属预告”小节,了解模块主轴与依赖方向如何收敛。

## 5. 模块实现契约

本仓详细设计以 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个模块为实现主轴。业务主要组成部分跨模块实现,不直接成为 crate 边界。

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 依赖对象 |
|---|---|---|---|---|
| `contracts` | `process-contracts` | 公共协议、typed ref、view、event、job、receipt 和 protocol error | DTO、ref、view、event、job、fixtures、protocol error | `core-contracts` |
| `domain` | `process-domain` | Process truth 对象、state、policy、不变量和 domain error | aggregate、policy、state enum、DomainError | `contracts`、`core-contracts` |
| `application` | `process-application` | command / query / consumer / job 编排、事务、幂等、port 调用 | services、ports、UnitOfWork、application port errors / mappers | `contracts`、`domain`、`core-contracts` |
| `infra` | `process-infra` | repository / adapter / config / runtime builder | adapters、stores、runtime builder、config、InfraError | `contracts`、`domain`、`application`、`core-contracts` |
| `api` | `process-api` | Command / Query handler | handlers、routes、ApiError | `contracts`、`application`、`infra`、`core-contracts` |
| `worker` | `process-worker` | event consumer、outbox publish loop、projection worker | consumers、worker runners、WorkerError | `contracts`、`application`、`infra`、`core-contracts` |
| `jobs` | `process-jobs` | operations job runner | job runners、JobError | `contracts`、`application`、`infra`、`core-contracts` |

`contracts` 和 `domain` 不得依赖 `application`、`infra`、`api`、`worker` 或 `jobs`。`application` 不得依赖 `infra` 或入口模块。`api`、`worker`、`jobs` 只能作为入口调用 application service,不得互相依赖或绕过 application 写 repository。

### 9. 待确认事项

- 无阻塞 Step 6 的待确认事项。
- Step 6 必须按本 Step 的归属展开对象契约;public protocol 使用的二级类型必须放在 `contracts` 或 core contracts,不得引用 domain-only 类型。
- Step 7 必须按本 Step 的归属展开 port / adapter trait;repository trait 归 `application`,adapter 归 `infra`。

### 10. 进入下一步条件

- 已固定七个模块主轴。
- 已固定模块职责、对外暴露、允许依赖和禁止依赖。
- 已固定对象、trait、handler、repository、adapter 和测试切口的归属原则。
- 可以进入 Step 6 “逐模块定义对象实现契约”。
