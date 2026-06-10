# Step 5. 定义模块实现契约主轴

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 5
- 回填章节:`03-详细设计.md` §5 模块实现契约

### 2. 本步输入

- 上一步中间产物:
  - `projects/L1-governance/design-calibration/03_ddd_step_04_file_layout.md`
- 上游正式文档:
  - `projects/L1-governance/01-架构设计.md`
  - `projects/L1-governance/02-概要设计.md` §4 / §5 / §12
- 概要设计校准来源:
  - `projects/L1-governance/design-calibration/02_hld_step_04_code_subject_framework.md`
  - `projects/L1-governance/design-calibration/02_hld_step_05_components_boundary.md`
  - `projects/L1-governance/design-calibration/02_hld_step_12_detailed_design_handoff.md`
- 规范输入:
  - `standards/document/详细设计书写规范.md` §5.5
  - `standards/document/设计真相源闭环与可落码性标准.md`
  - `standards/document/子项目目录与代码文件组织规范.md`

### 3. SOP 问题回答

1. 本仓详细设计应该拆成哪些实现模块?

   回答:详细设计实现模块与 Step 4 的 workspace member 对齐,采用 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个模块作为主轴。`Governance truth core`、`Governance context and input management`、`Gate and decision management`、`Approval and responsibility management`、`Policy and shared rules management`、`Control and compliance conclusion management`、`Nonconformity corrective loop`、`Governance consumption and traceability`、`Derived maintenance and reconciliation`、`External context mirror support` 是业务主要组成部分,不是 crate 边界;它们跨七个模块实现。

2. 每个模块对应概要设计中的哪个主要组成部分或代码主体?

   回答:`contracts` 承接 Command / Query / Event / Job / View / Receipt / Error 公共协议骨架;`domain` 承接 Governance truth、state、policy、不变量、trace / audit / outbox 成立对象;`application` 承接 command / query / consumer / job service、事务、幂等和 port 调用;`infra` 承接 persistence / projection / reference / publisher / resolver / handoff / external GRC adapter / runtime builder;`api` 承接同步 command / query intake;`worker` 承接 inbound event consumer、outbox publish loop 和常驻维护 worker;`jobs` 承接 projection rebuild、reference refresh、reconciliation、trace / archive handoff 和 external GRC export operations job。

3. 每个模块对外暴露什么?

   回答:
   - `contracts` 对外暴露 public DTO、typed ref、reason、marker、view、event、job、receipt 和 protocol error。
   - `domain` 只暴露领域对象、状态、policy、domain record 和 `DomainError` 给本仓 `application` 使用。
   - `application` 暴露 service、port trait、repository trait、UoW、idempotency 和 `ApplicationError` 给 `api` / `worker` / `jobs` / `infra` 装配使用。
   - `infra` 暴露 adapter、store、config、runtime builder 和 test fake assembly。
   - `api`、`worker`、`jobs` 暴露入口 handler / runner,不作为其他业务模块的依赖对象。

4. 每个模块允许依赖哪些模块,禁止依赖哪些模块?

   回答:依赖方向必须单向。`contracts` 只依赖 `core-contracts`;`domain` 可依赖 `contracts` 和 `core-contracts`;`application` 可依赖 `contracts`、`domain` 和 `core-contracts`;`infra` 可依赖 `contracts`、`domain`、`application` 和 `core-contracts`;`api`、`worker`、`jobs` 可依赖 `contracts`、`application`、`infra` 和 `core-contracts`。禁止 `contracts` / `domain` / `application` 反向依赖更外层模块,禁止 `api`、`worker`、`jobs` 互相依赖,禁止任何非 `core-contracts` sibling 仓进入 Cargo dependency。

5. 哪些对象、trait、handler、repository 应归属于哪个模块?

   回答:
   - DTO、ref、reason、marker、receipt、view、event、job、protocol error 属于 `contracts`。
   - aggregate、entity、value object、state enum、domain policy、domain record、domain error 属于 `domain`。
   - command / query / consumer / job service、repository trait、external resolver trait、publisher trait、handoff trait、UnitOfWork、IdempotencyRepository、ClockPort、IdGeneratorPort 属于 `application`。
   - repository adapter、projection store、reference store、outbox store、source resolver adapter、publisher adapter、handoff adapter、external GRC adapter、config loader、runtime builder 属于 `infra`。
   - synchronous handler 属于 `api`;inbound event consumer 和 outbox / projection worker 属于 `worker`;operations job runner 属于 `jobs`。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| `02-概要设计.md` §5 | 按 10 个业务主要组成部分描述职责,容易被误拆成业务 crate | 本 Step 明确业务组成部分跨七个模块实现,不作为 crate 边界 |
| `03_ddd_step_04_file_layout.md` | 已给出 workspace / crate / file layout,但尚未形成模块职责和依赖矩阵 | 本 Step 补模块主轴、对外暴露和 allowed / forbidden dependency |
| 旧 `03-详细设计.md` | 保留旧 `GovernanceRequest / Gate / Decision / Exception / RiskAcceptance` 主线 | 本 Step 只承接新版 `00/01/02` 与 Step 4,不继承旧模块主轴 |
| 后续 Step 6 / 7 / 8 | 对象、trait、DTO 尚未分配正式归属 | 本 Step 给出归属门禁,后续逐模块展开 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 模块主轴 | 仅有 workspace member 和概要实现分层 | 固定 7 个实现模块主轴和职责边界 | 便于后续对象 / trait / DTO 归属 |
| 业务组成部分 | 可能被误认为 crate / module 边界 | 明确跨 `contracts` / `domain` / `application` / `infra` / entry modules 实现 | 避免十个业务部分拆 crate |
| 依赖方向 | Step 4 只有预告 | 本 Step 固定 allowed / forbidden dependency | 支撑 Cargo dependency matrix |
| handler / worker / job | 只有文件布局 | 明确只作为入口调用 application,不互相依赖 | 防止入口模块承担业务 truth |
| sibling repo 协作 | 架构层已裁剪依赖 | 本 Step 固定非 `core-contracts` sibling 不进入 Cargo | 防止实现阶段形成跨 L1 编译期耦合 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 以 workspace member 作为模块主轴 | 与 Step 4 文件布局一致,依赖方向可由 Cargo 强制 | 业务组成部分需要在模块内映射 | 采用 |
| B. 以十个业务主要组成部分作为模块主轴 | 业务语义直观 | 每个组成部分都会跨 DTO、domain、service、repo、projection、outbox,容易形成循环依赖 | 不采用 |
| C. 以概要实现分层作为正式模块但不绑定 crate | 文档表达灵活 | 实现者仍不知道 crate 依赖和文件归属 | 不采用 |
| D. 单独拆 shared / common 模块 | 复用便利 | 违反目录规范,容易成为无边界公共桶 | 不采用 |

### 7. 结构化中间产物

#### 7.1 模块总览表

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 依赖对象 |
|---|---|---|---|---|
| `contracts` | `crates/contracts` / `governance-contracts` | 定义公共协议、typed ref、reason、marker、view、event、job、receipt 和 protocol error | DTO、ref、view、event、job、fixtures、protocol error | `core-contracts` |
| `domain` | `crates/domain` / `governance-domain` | 定义 Governance truth 对象、value object、state、policy、不变量、trace / audit / outbox 成立对象和 domain error | aggregate、entity、value object、policy、state enum、DomainError | `contracts`、`core-contracts` |
| `application` | `crates/application` / `governance-application` | 编排 command / query / consumer / job 用例、事务、幂等、port 调用、outbox / trace / projection 副作用和 application error | services、ports、repositories、UnitOfWork、IdempotencyRepository、ApplicationError | `contracts`、`domain`、`core-contracts` |
| `infra` | `crates/infra` / `governance-infra` | 实现 repository / adapter / store / config / runtime builder 和 fake runtime | adapters、stores、runtime builder、config、InfraError | `contracts`、`domain`、`application`、`core-contracts` |
| `api` | `crates/api` / `governance-api` | 同步 Command / Query handler 和 API assembly | command handlers、query handlers、routes、ApiError | `contracts`、`application`、`infra`、`core-contracts` |
| `worker` | `crates/worker` / `governance-worker` | inbound event consumer、outbox publish loop、projection invalidation / maintenance worker | consumers、worker runners、WorkerError | `contracts`、`application`、`infra`、`core-contracts` |
| `jobs` | `crates/jobs` / `governance-jobs` | operations job runner、outbox publish、projection rebuild、reference refresh、reconciliation、trace / archive handoff、external GRC export | job runners、JobError | `contracts`、`application`、`infra`、`core-contracts` |

#### 7.2 模块依赖图: L1-governance 模块实现主轴

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
+---------+-----+
|  application  |<-----------------------------+
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

- 图表达 crate / module 依赖方向,不表达函数级处理流。
- `api`、`worker`、`jobs` 是入口模块,它们通过 `infra::runtime_builder` 获得 application service 装配。
- `infra` 实现 `application` 定义的 port trait,但 `application` 不依赖 `infra`。
- `domain` 不感知 repository、adapter、config、HTTP、bus、DB、external GRC SDK 或 job runner。
- `contracts` 不感知 domain,因此 command / query / event / job / view 中使用的共享 enum、ref、reason、marker 必须定义在 `contracts` 或 `core-contracts`。

#### 7.3 模块职责表

##### `contracts` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/contracts` / `governance-contracts` |
| 对应概要设计主要组成部分 | Command / Query / Event / Job 骨架;Governance consumption and traceability;Derived maintenance and reconciliation;External context mirror support |
| 主要责任 | 定义跨入口和下游可复用协议 DTO,不承载领域不变量 |
| 对外暴露 | refs、metadata、commands、queries、events、jobs、views、errors、fixtures |
| 允许依赖 | `core-contracts` |
| 禁止依赖 | `domain`、`application`、`infra`、`api`、`worker`、`jobs`;禁止依赖非 `core-contracts` sibling repo |

##### `domain` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/domain` / `governance-domain` |
| 对应概要设计主要组成部分 | 全部 Governance truth / state / policy 主体,尤其 context、input、gate、decision、approval、policy、control、compliance、nonconformity、trace、audit、outbox、reference、projection state |
| 主要责任 | 定义领域对象、状态、policy、不变量、domain record 和 domain error |
| 对外暴露 | `GovernanceContext`、`GovernanceInput`、`Gate`、`GovernanceDecision`、`ApprovalResponsibility`、`PolicyEffectiveFact`、`SharedRuleSet`、`ControlApplicability`、`AIIAConclusion`、`SoAConclusion`、`NonconformityRecord`、`GovernanceTraceRecord`、`GovernanceOutboxRecord`、policy、DomainError |
| 允许依赖 | `contracts`、`core-contracts` |
| 禁止依赖 | `application`、`infra`、`api`、`worker`、`jobs`;禁止读取 config、repository、adapter 或外部服务 |

##### `application` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/application` / `governance-application` |
| 对应概要设计主要组成部分 | Application Services、Ports and External Seams、Operations orchestration |
| 主要责任 | 编排 command / query / consumer / job 用例、事务、幂等、repository / port 调用、outbox / trace / audit / projection stale / stored result 副作用 |
| 对外暴露 | service facade、context / decision / approval / policy / control / nonconformity / query / consumer / projection / outbox / handoff / external GRC services、port trait、UnitOfWork、IdempotencyRepository、ApplicationError |
| 允许依赖 | `contracts`、`domain`、`core-contracts` |
| 禁止依赖 | `infra`、`api`、`worker`、`jobs`;禁止直接依赖 DB / HTTP / bus / external SDK |

##### `infra` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/infra` / `governance-infra` |
| 对应概要设计主要组成部分 | Persistence / Projection、Ports implementation、Config binding、Runtime assembly、External seam adapters |
| 主要责任 | 实现 application port,提供 fake / durable repository、projection store、reference store、publisher、resolver、handoff adapter、external GRC adapter、config 和 runtime builder |
| 对外暴露 | repositories、projection stores、reference stores、outbox stores、source resolvers、publishers、handoff adapters、external GRC adapters、config、runtime_builder、InfraError |
| 允许依赖 | `contracts`、`domain`、`application`、`core-contracts` |
| 禁止依赖 | `api`、`worker`、`jobs`;禁止让 adapter 改写 domain 不变量或替代 application service |

##### `api` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/api` / `governance-api` |
| 对应概要设计主要组成部分 | Inbound command / query intake |
| 主要责任 | 将同步 Command / Query 请求解析为 contracts DTO,调用 application service,映射 protocol / application error |
| 对外暴露 | command handlers、query handlers、routes、ApiError |
| 允许依赖 | `contracts`、`application`、`infra`、`core-contracts` |
| 禁止依赖 | `domain` 直接业务调用、`worker`、`jobs`;禁止直接访问 repository adapter |

##### `worker` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/worker` / `governance-worker` |
| 对应概要设计主要组成部分 | Inbound Event Consumer、Outbox and Handoff、Derived maintenance trigger |
| 主要责任 | 消费入站事件、运行 outbox publisher loop、触发 projection invalidation / maintenance,并调用 application service |
| 对外暴露 | consumers、outbox_publisher、projection_worker、WorkerError |
| 允许依赖 | `contracts`、`application`、`infra`、`core-contracts` |
| 禁止依赖 | `api`、`jobs`;禁止绕过 application 写 repository 或形成新 truth |

##### `jobs` 模块

| 项 | 内容 |
|---|---|
| 所属实现单元 | `crates/jobs` / `governance-jobs` |
| 对应概要设计主要组成部分 | Operations Job、Derived maintenance and reconciliation、External context mirror support、Governance consumption and traceability |
| 主要责任 | 执行 outbox publish、projection rebuild、external reference refresh、reconciliation、trace handoff、archive handoff 和 external GRC export job |
| 对外暴露 | job runners、JobError |
| 允许依赖 | `contracts`、`application`、`infra`、`core-contracts` |
| 禁止依赖 | `api`、`worker`;禁止把 job report、reconciliation report、external GRC export 或 handoff receipt 反写成核心 truth |

#### 7.4 文件与代码主体映射表

| 文件路径 | 代码主体 | 类型 | 责任 |
|---|---|---|---|
| `crates/contracts/src/refs.rs` | typed ids / refs / reasons / markers | shared contract | public protocol 可复用的共享类型 |
| `crates/contracts/src/metadata.rs` | metadata wrappers | DTO | command / query / event / job metadata |
| `crates/contracts/src/commands.rs` | Command DTO / result | DTO | 写入口协议字段和结果面 |
| `crates/contracts/src/queries.rs` | Query DTO / response | DTO | 读入口协议字段、page、visibility、freshness、degraded surface |
| `crates/contracts/src/events.rs` | inbound / outbound event payload | DTO | event 协作契约和 outbox payload |
| `crates/contracts/src/jobs.rs` | operations job input / report | DTO | job public surface |
| `crates/contracts/src/views.rs` | query / projection view | DTO | read model surface |
| `crates/domain/src/governance_context.rs` | Governance context truth | aggregate / value object | 治理语境成立 |
| `crates/domain/src/governance_input.rs` | Governance input truth | aggregate / state | 可裁决输入成立 |
| `crates/domain/src/gate.rs` | Gate lifecycle | aggregate | 治理入口和等待裁决状态 |
| `crates/domain/src/decision.rs` | Governance decision truth | aggregate / record | 正式裁决、替代和历史修正 |
| `crates/domain/src/approval_responsibility.rs` | Approval and responsibility | aggregate / value object | 审批、投票、委托和责任链 |
| `crates/domain/src/policy_effective.rs` | Policy effective fact | aggregate / record | Policy 生效事实、scope、priority、conflict |
| `crates/domain/src/shared_rules.rs` | Shared rules | aggregate / policy input | 组织级 hard constraint |
| `crates/domain/src/control_compliance.rs` | Control and compliance conclusion | aggregate / record | Control、AIIA、SoA 结论 |
| `crates/domain/src/nonconformity.rs` | Nonconformity corrective loop | aggregate / entity | 不符合、纠正、复验、关闭 |
| `crates/domain/src/reference_snapshot.rs` | External reference state | value object / state | 外部引用、snapshot、resolution marker |
| `crates/domain/src/projection.rs` | Derived governance view state | state / value object | 派生视图 freshness / stale 状态 |
| `crates/domain/src/trace_audit.rs` | Trace / audit | record | 治理追溯和审计链 |
| `crates/domain/src/outbox.rs` | Governance outbox | record | 已成立 fact 的传播意图 |
| `crates/domain/src/policies.rs` | Domain policies | policy | 不变量和 guard |
| `crates/application/src/context_service.rs` | Context / input command service | service | 治理语境和输入用例编排 |
| `crates/application/src/decision_service.rs` | Gate / decision command service | service | Gate 和 Decision 用例编排 |
| `crates/application/src/approval_service.rs` | Approval service | service | 审批、投票、委托和责任链编排 |
| `crates/application/src/policy_service.rs` | Policy service | service | Policy fact、shared rules、conflict 编排 |
| `crates/application/src/control_compliance_service.rs` | Control compliance service | service | Control、AIIA、SoA 编排 |
| `crates/application/src/nonconformity_service.rs` | Nonconformity service | service | 不符合纠正闭环编排 |
| `crates/application/src/query_service.rs` | Authorized query service | service | query no-write、visibility、freshness、degraded response |
| `crates/application/src/consumer_service.rs` | Consumer orchestration | service | inbound event dedup、snapshot / reference update、stale marker |
| `crates/application/src/projection_service.rs` | Projection maintenance | service | rebuild、refresh、reconciliation use cases |
| `crates/application/src/outbox_service.rs` | Outbox publication | service | pending scan、publish、mark result |
| `crates/application/src/handoff_service.rs` | Trace / archive handoff | service | observability / archive handoff orchestration |
| `crates/application/src/external_grc_service.rs` | External GRC export | service | external GRC export preparation |
| `crates/application/src/ports.rs` | Ports and external seams | trait | repository、resolver、publisher、handoff、clock、id traits |
| `crates/application/src/unit_of_work.rs` | UnitOfWork | trait | transaction handle |
| `crates/application/src/idempotency.rs` | Idempotency model | repository / value object | request digest、duplicate、conflict、stored result replay |
| `crates/infra/src/repositories.rs` | Truth repositories | adapter | fake / durable truth repository implementations |
| `crates/infra/src/projection_stores.rs` | Projection stores | adapter | view and report stores |
| `crates/infra/src/reference_stores.rs` | Reference stores | adapter | external snapshot and reference state stores |
| `crates/infra/src/source_resolvers.rs` | External source resolvers | adapter | identity / method / process / work / artifact / runtime / conversation / observability refs |
| `crates/infra/src/publishers.rs` | Publishers | adapter | bus / fake publisher |
| `crates/infra/src/handoff_adapters.rs` | Handoff adapters | adapter | observability / archive handoff |
| `crates/infra/src/external_grc_adapters.rs` | External GRC adapters | adapter | external GRC export target |
| `crates/infra/src/runtime_builder.rs` | Runtime assembly | adapter | service / adapter 装配 |
| `crates/api/src/command_handlers.rs` | Command intake | handler | 同步写入口 |
| `crates/api/src/query_handlers.rs` | Query intake | handler | 同步读入口 |
| `crates/worker/src/consumers.rs` | Event intake | handler | inbound event consumer |
| `crates/worker/src/outbox_publisher.rs` | Outbox worker | runner | outbox publish loop |
| `crates/jobs/src/projection_rebuild.rs` | Projection job | runner | projection rebuild |
| `crates/jobs/src/reference_refresh.rs` | Reference job | runner | external reference refresh |
| `crates/jobs/src/reconciliation.rs` | Reconciliation job | runner | truth / projection / reference / outbox 对账 |
| `crates/jobs/src/trace_handoff.rs` | Trace handoff job | runner | observability handoff |
| `crates/jobs/src/archive_handoff.rs` | Archive handoff job | runner | archive package preparation |
| `crates/jobs/src/external_grc_export.rs` | External GRC export job | runner | external GRC export preparation |

#### 7.5 对象归属预告

正式对象契约留给 Step 6,本 Step 只固定归属:

| 对象类别 | 归属模块 | 示例 |
|---|---|---|
| protocol DTO / result / receipt / view / event / job | `contracts` | `CreateGovernanceContextRequest`、`GovernanceCommandResult`、`DecisionSummaryView`、`GovernanceDecisionChangedEvent`、`GovernanceJobReport` |
| typed ref / reason / query marker / freshness marker | `contracts` | `GovernanceContextRef`、`DecisionReasonRef`、`GovernedSubjectRef`、`GovernanceViewStatus`、`DerivedGovernanceFreshnessState` |
| truth aggregate / entity / value object | `domain` | `GovernanceContext`、`GovernanceInput`、`Gate`、`GovernanceDecision`、`ApprovalResponsibility`、`PolicyEffectiveFact`、`ControlApplicability`、`NonconformityRecord` |
| policy / invariant guard | `domain` | `GovernanceTruthPolicy`、`DecisionPolicy`、`ApprovalResponsibilityPolicy`、`SharedRulesPolicy`、`ComplianceConclusionPolicy`、`NonconformityClosurePolicy` |
| trace / audit / outbox domain record | `domain` | `GovernanceTraceRecord`、`GovernanceAuditTrail`、`GovernanceOutboxRecord`、`DecisionRecord`、`PolicyChangeRecord` |
| application service | `application` | `GovernanceContextService`、`GovernanceDecisionService`、`ApprovalCoordinationService`、`PolicyGovernanceService`、`ControlComplianceService`、`NonconformityService`、`AuthorizedGovernanceQueryService`、`GovernanceDerivedMaintenanceService` |
| repository / port trait | `application` | `GovernanceContextRepository`、`GovernanceDecisionRepository`、`PolicyRepository`、`ReferenceSnapshotRepository`、`GovernanceOutboxPublisherPort`、`ArchiveHandoffPort` |
| adapter / fake / runtime builder | `infra` | `InMemoryGovernanceDecisionRepository`、`FakeGovernanceOutboxPublisher`、`GovernanceRuntimeBuilder` |
| handler / consumer / job runner | `api` / `worker` / `jobs` | `handle_record_governance_decision`、`consume_work_governance_context_changed`、`run_governance_reconciliation` |

#### 7.6 业务组成部分到模块映射表

| 业务主要组成部分 | `contracts` | `domain` | `application` | `infra` | `api` / `worker` / `jobs` |
|---|---|---|---|---|---|
| `Governance truth core` | truth refs、event / result DTO | truth policy、trace、audit、outbox record | transaction、outbox、stored result services | truth / outbox / audit stores | command handlers、outbox worker |
| `Governance context and input management` | context / input command DTO、refs | `GovernanceContext`、`GovernanceInput`、context policy | `GovernanceContextService`、source resolver ports | source resolver adapters、context repos | command handlers、consumer trigger |
| `Gate and decision management` | gate / decision DTO、decision result view | `Gate`、`GovernanceDecision`、`DecisionRecord` | `GovernanceDecisionService` | decision repository | command handlers |
| `Approval and responsibility management` | approval DTO、vote / delegation refs | `ApprovalResponsibility`、`ResponsibilityChain` | `ApprovalCoordinationService`、identity capability port | identity resolver adapter | command handlers / consumers |
| `Policy and shared rules management` | policy DTO、conflict query view | `PolicyEffectiveFact`、`SharedRuleSet`、`PolicyConflictRecord` | `PolicyGovernanceService` | policy repository、method snapshot adapter | command handlers / consumers |
| `Control and compliance conclusion management` | control / conclusion DTO、coverage view | `ControlApplicability`、`ControlReview`、`AIIAConclusion`、`SoAConclusion` | `ControlComplianceService` | evidence / method resolver adapter | command handlers / consumers |
| `Nonconformity corrective loop` | nonconformity DTO、status view | `NonconformityRecord`、`CorrectiveAction`、`VerificationResult` | `NonconformityService` | nonconformity repository | command handlers |
| `Governance consumption and traceability` | query DTO、view DTO、handoff job DTO | trace / audit records、visibility policy | `AuthorizedGovernanceQueryService`、`GovernanceTraceService`、handoff ports | projection store、trace store、handoff adapters | query handlers、handoff jobs |
| `Derived maintenance and reconciliation` | job DTO、report DTO、freshness marker | `DerivedGovernanceViewState`、derived policy | `GovernanceDerivedMaintenanceService` | projection stores、report stores | projection / reconciliation jobs |
| `External context mirror support` | external ref DTO、snapshot summary DTO | `ReferenceResolutionState`、snapshot value objects | consumer / refresh services、resolver ports | reference stores、source resolvers | consumers、reference refresh job |

#### 7.7 模块测试切口预告

正式测试切口留给 Step 16,本 Step 只固定模块级测试职责:

| 模块 | 测试切口 |
|---|---|
| `contracts` | DTO roundtrip、fixture、metadata / idempotency presence、event / job schema、no body leak fixtures |
| `domain` | state transition、policy accept / reject、不变量、forbidden transition、trace / outbox formation guard |
| `application` | command / query / consumer / job orchestration、idempotency duplicate / conflict、UoW rollback、query no-write |
| `infra` | fake repository behavior、adapter error mapping、runtime builder wiring、config validation |
| `api` | handler validation、error mapping、metadata enforcement |
| `worker` | event envelope validation、dedup、unsupported version、outbox publish loop behavior |
| `jobs` | job input validation、page / batch behavior、failed refs、stale marker、handoff / export report |

### 8. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_05_module_contracts.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”和“待确认事项”小节,了解 L1-governance 模块主轴、依赖方向、对象归属和后续对象 / trait / 协议契约如何展开。

## 5. 模块实现契约

L1-governance 的详细设计模块主轴与 workspace member 对齐,包括 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个模块。业务主要组成部分不直接变成 crate;它们跨模块实现。

### 5.1 模块总览表

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 依赖对象 |
|---|---|---|---|---|
| `contracts` | `governance-contracts` | 公共协议、typed ref、reason、marker、view、event、job、receipt 和 protocol error | DTO / ref / view / event / job / error | `core-contracts` |
| `domain` | `governance-domain` | Governance truth 对象、value object、state、policy、不变量和 domain error | aggregate / policy / state / DomainError | `contracts`、`core-contracts` |
| `application` | `governance-application` | 用例编排、事务、幂等、port 调用和 application error | services / ports / UoW / idempotency | `contracts`、`domain`、`core-contracts` |
| `infra` | `governance-infra` | repository / adapter / store / config / runtime builder | adapters / stores / runtime builder | `contracts`、`domain`、`application`、`core-contracts` |
| `api` | `governance-api` | 同步 Command / Query handler | handlers / routes / ApiError | `contracts`、`application`、`infra`、`core-contracts` |
| `worker` | `governance-worker` | inbound consumer、outbox publisher loop、projection maintenance worker | consumers / worker runners | `contracts`、`application`、`infra`、`core-contracts` |
| `jobs` | `governance-jobs` | outbox publish、projection rebuild、reference refresh、reconciliation、trace / archive handoff、external GRC export job | job runners | `contracts`、`application`、`infra`、`core-contracts` |

### 5.2 模块依赖图

```text
contracts -> core-contracts
domain -> contracts -> core-contracts
application -> domain -> contracts -> core-contracts
infra -> application -> domain -> contracts -> core-contracts
api / worker / jobs -> infra -> application
```

禁止方向:

- `contracts` 不依赖 `domain`、`application`、`infra`、`api`、`worker` 或 `jobs`。
- `domain` 不依赖 repository、adapter、config、HTTP、bus、DB、external GRC SDK 或 job runner。
- `application` 不依赖 `infra`、`api`、`worker` 或 `jobs`。
- `api`、`worker`、`jobs` 不互相依赖,不得绕过 application 直接写 repository。
- 非 `core-contracts` sibling repo 不得进入 Cargo dependency。

### 9. 待确认事项

- Step 6 需要逐模块定义对象契约,不得把本 Step 的对象归属预告当成字段 schema。
- Step 7 需要逐模块定义 repository / port / adapter trait,并校验 `application` 不依赖 `infra`。
- Step 8 需要确保 `contracts` 中 command / query / event / job / view 用到的共享 enum、ref、reason、marker 不依赖 domain-only 类型。
- Step 11 需要把本 Step 的 repository / projection / reference / outbox 归属落实到事务和一致性契约。
- Step 14 需要把 `infra` config 和 runtime builder 限制为运行承载,不得让配置改变 domain invariant 或依赖裁剪。

### 10. 进入下一步条件

- 已固定七个模块主轴、职责、对外暴露和依赖方向。
- 已确认十个业务主要组成部分跨模块实现,不作为 crate 边界。
- 已给出对象、trait、handler、repository 的模块归属预告。
- 可以进入 Step 6 “逐模块定义对象实现契约”。
