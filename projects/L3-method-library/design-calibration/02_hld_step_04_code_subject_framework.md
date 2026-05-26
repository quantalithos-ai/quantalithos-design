# Step 4. 代码主体框架映射

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 4
- 回填章节：`projects/L3-method-library/02-概要设计.md` §4 代码主体框架总览

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 2 设计目标 | 概要设计要收稳代码主体框架、主要组成部分、关键对象、接口骨架、处理流和状态机 |
| Step 3 约束条件 | Definition / Use 分离、P0 / P1 分离、7 类 P0 MethodContent、发布一致性、event + snapshot、ViewProfile 服务端解析 |
| 架构设计 §6 | method-library-api、application、domain、outbox-relay、snapshot-exporter、operations-job、plugin-composition-service、PostgreSQL、object storage、L0-bus |
| 架构设计 §7 | inbound adapters -> application services -> domain model / policy -> ports -> outbound adapters |
| 当前 02 §6 / §8 | 已有 A-H 主要组成部分和实现分层参考视图,但业务组成部分与实现分层混用 |

已确认结论：

```text
本步只建立“架构模块 -> 代码主体骨架”的映射。
不写 crate / module / file tree。
不写完整 trait、struct、字段、函数签名或协议 schema。
```

依赖的前序 Step：

```text
Step 1 已确认上游输入边界。
Step 2 已确认设计目标、非范围和当前设计深度。
Step 3 已确认结构性约束条件。
```

---

## 3. SOP 问题回答

### 3.1 架构层已经收稳的模块，分别应落到哪些代码主体骨架上？

回答：

架构层模块需要转译为代码主体，而不是原样搬进概要设计的主要组成部分。

| 架构层模块 / 机制 | 概要设计代码主体骨架 | 说明 |
|---|---|---|
| method-library-api | Command API、Query API、Operations Trigger | 入站入口,只做协议转换、上下文传递和错误映射 |
| method-library-application | MethodContentCommandService、PublishGovernanceService、DefinitionSyncService、SnapshotExportService、ViewProfileResolveService、DefinitionTraceQueryService、MethodOperationsService | 用例编排主体,承接事务、gate、audit、outbox、snapshot、查询协调 |
| method-definition-domain | MethodContent、7 类 MethodContent definition、MethodContentLifecycle、DefinitionReference | 领域真相主体,承载定义资产和生命周期规则 |
| lifecycle / validation domain policy | PublishPolicy、ReferenceValidationPolicy、DefinitionUseBoundaryGuard、FingerprintPolicy、ViewProfileMatchPolicy | 领域策略主体,承载发布、引用、边界、防漂移和视图匹配规则 |
| outbox-relay | OutboxRelayWorker、EventPublishService、EventPublisherPort | 异步传播主体,从 outbox 发布事件到 L0-bus |
| snapshot-exporter | SnapshotExportService、DefinitionSnapshot、SnapshotRepository / SnapshotProjection | 快照供给主体,供下游重建索引和对账 |
| operations-job | SeedInitialMethodAssetsJob、ReplayDefinitionEventsJob、RebuildDefinitionIndexJob、RecalculateFingerprintJob | 运维任务主体,只通过 application / domain 规则触发动作 |
| plugin-composition-service(P1) | MethodPluginService、MethodConfigurationService、PluginCompositionPolicy(P1) | P1 打包组装主体,只保留位置和边界 |
| PostgreSQL / object storage / L0-bus / cache | Repository、UnitOfWork、OutboxStore、AuditStore、BlobRefPort、BusPublisherAdapter、ReadProjection、CacheAdapter | 持久化和外部适配主体,不决定业务规则 |

### 3.2 哪些主体属于 Inbound / Operations，哪些属于 Application Services？

回答：

| 实现层 | 代码主体 | 作用 |
|---|---|---|
| Inbound / Operations | Command API | 接收创建草稿、更新草稿、提交审核、发布、废弃、退役、supersede 等写请求 |
| Inbound / Operations | Query API | 接收 Get / List / ExportSnapshot / ResolveViewProfile / GetDefinitionTrace 等读请求 |
| Inbound / Operations | Operations Trigger | 接收 seed、replay、rebuild、recalculate 等运维触发 |
| Inbound / Operations | Event Consumer / External Handler | 接收必要的外部依赖事件或 gate 结果通知;不作为下游写回定义入口 |
| Application Services | MethodContentCommandService | 编排 MethodContent 草稿、审核、发布、废弃、退役、supersede 主用例 |
| Application Services | PublishGovernanceService | 编排 approved_gate_ref、actor_ref、发布审计和发布前校验 |
| Application Services | DefinitionSyncService | 编排 outbox、event metadata、snapshot_ref 和 replay 入口 |
| Application Services | SnapshotExportService | 生成可供下游消费的 Definition Snapshot |
| Application Services | ViewProfileResolveService | 编排 ViewProfile 匹配和默认 deny 规则 |
| Application Services | DefinitionTraceQueryService | 聚合版本、fingerprint、audit、event、snapshot 追溯视图 |
| Application Services | MethodOperationsService | 编排 seed、replay、rebuild、fingerprint 复算等后台任务 |

### 3.3 哪些主体属于 Domain Model，哪些属于 Ports / Persistence / Projection / Outbox？

回答：

| 实现层 | 代码主体 | 作用 |
|---|---|---|
| Domain Model | MethodContent | P0 7 类定义资产的共同聚合轮廓 |
| Domain Model | Qualification / RoleDefinition / TaskDefinition / WorkProductDefinition / ProcessTemplateDef / ViewProfile / AIPolicyDef | 7 类 P0 definition 的正式领域主体 |
| Domain Model | MethodContentLifecycle | 定义 draft / in_review / published / deprecated / retired / superseded 的状态规则 |
| Domain Model | DefinitionReference | 表达 definition 之间的引用锚点 |
| Domain Policy | PublishPolicy | 约束发布门禁、published 不可原地修改、supersede |
| Domain Policy | ReferenceValidationPolicy | 校验 definition 间引用是否允许 |
| Domain Policy | DefinitionUseBoundaryGuard | 防止 QualificationProfile、QualificationBinding、ProcessInstance、WorkItem、Artifact instance 等 Use truth 混入本仓 |
| Domain Policy | FingerprintPolicy | 约束 canonical 内容与 fingerprint 生成 / 对比 |
| Domain Policy | ViewProfileMatchPolicy | 约束 role + object_kind + scope 的唯一 active 和默认 deny |
| Ports | MethodContentRepository、AuditLogPort、OutboxPort、GateDecisionPort、BlobRefPort、EventPublisherPort、ClockPort、IdGeneratorPort | application / domain 面向外部能力的抽象接缝 |
| Persistence | UnitOfWork、DefinitionWriteModel、VersionStore、AuditStore、OutboxStore、BlobRefStore | 保存本仓真相和可靠发布记录 |
| Projection | DefinitionReadModel、DefinitionTraceProjection、ViewProfileProjection、SnapshotProjection | 支撑查询、追溯、视图解析和下游快照 |
| Outbox | OutboxEvent、OutboxRelayWorker、EventPublishService | 承接跨仓最终一致传播 |

### 3.4 哪些名称必须在概要设计层先点名，否则详细设计会重新发明主语？

回答：

必须先点名的名称分为 5 类。

| 类型 | 必须点名的名称 | 原因 |
|---|---|---|
| 应用服务 | MethodContentCommandService、PublishGovernanceService、DefinitionSyncService、SnapshotExportService、ViewProfileResolveService、DefinitionTraceQueryService、MethodOperationsService | 这些是详细设计展开 use case、事务和接口处理流的主语 |
| 领域对象 | MethodContent、7 类 definition、MethodContentLifecycle、DefinitionReference、DefinitionSnapshot、OutboxEvent | 这些是定义真相、状态、同步和追溯的共同对象主语 |
| 领域策略 | PublishPolicy、ReferenceValidationPolicy、DefinitionUseBoundaryGuard、FingerprintPolicy、ViewProfileMatchPolicy | 这些是发布、引用、边界和视图解析规则的落点 |
| 端口 / 持久化 | MethodContentRepository、UnitOfWork、AuditLogPort、OutboxPort、GateDecisionPort、BlobRefPort、EventPublisherPort | 这些是 03 继续展开 trait 和事务边界的主语 |
| 后台主体 | OutboxRelayWorker、SeedInitialMethodAssetsJob、ReplayDefinitionEventsJob、RebuildDefinitionIndexJob、RecalculateFingerprintJob | 这些是可靠同步、恢复和基线初始化的主语 |

P1 需要先点名但不展开：

```text
MethodPluginService
MethodConfigurationService
PluginCompositionPolicy
MethodPlugin
MethodConfiguration
```

### 3.5 哪些内容已经是代码目录、文件路径或框架实现，不应在本步展开？

回答：

以下内容不进入 Step 4。

| 不展开内容 | 原因 |
|---|---|
| Rust crate / module / file tree | 属于详细设计 |
| 完整 trait 名单和函数签名 | 属于详细设计对象实现契约 |
| struct / enum 字段全集 | 属于详细设计 |
| HTTP / RPC / Event / Job schema | 属于详细设计接口契约 |
| SQL 表、索引、事务伪代码 | 属于详细设计 |
| 具体缓存、搜索、消息中间件实现 | 属于详细设计或实现选型 |
| 部署拓扑、进程拆分和资源配额 | 属于架构 / 实施计划 / 运维设计 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §6.2 总体分层图 / 主要部分分层 | A-H 混合了业务职责、入口层、应用层和基础设施适配 | Step 5 如果沿用 A-H,会把业务主要组成部分和实现分层混成同一级 |
| §6.3 A. 对外入口与访问部分 | 更像 Inbound / Operations 实现层 | 不适合作为业务主要组成部分,但应该保留为代码主体框架的一层 |
| §6.3 H. 基础设施适配部分 | 更像 Persistence / Outbound Adapters 实现层 | 不适合作为业务主要组成部分,应转入实现分层视图 |
| §8.7 实现分层参考视图 | 方向正确,但出现较晚,且与 A-H 的关系需要前置讲清 | 新版 §4 应先把“业务主线”和“实现分层”拆开 |
| §8.8 A-H 到实现分层的映射 | 有价值,但建立在旧 A-H 上 | 需要改成“业务主要组成部分候选 -> 实现分层”的关系 |
| 全文代码主体名称 | 部分主体只写通用描述,例如 application service / domain policy | 03 容易重新发明服务、策略、端口和 worker 名称 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 主要组成部分来源 | A-H 中包含入口层和基础设施层 | 业务主要组成部分只保留功能职责主线;入口和基础设施进入实现分层 | 主要组成部分回答“做什么”,实现分层回答“代码如何安放” |
| 代码主体命名 | 部分使用 application / domain / persistence 泛称 | 点名服务、领域对象、策略、端口、投影、worker / job | 03 需要稳定主语继续展开 |
| 实现分层位置 | 放在旧 §8 后段作为参考 | 新版 §4 前置为代码主体框架 | 进入 Step 5 前必须先收稳业务主线与实现层关系 |
| outbox / snapshot | 分散在同步、基础设施、应用编排中 | 明确为 DefinitionSyncService、SnapshotExportService、OutboxPort、OutboxRelayWorker 等主体 | 防止事件发布和快照导出无主语 |
| P1 表达 | MethodPlugin / Configuration 作为 G 部分出现 | P1 只点名服务、对象和策略位置,不进入 P0 主图细节 | 避免 P1 污染 P0 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 沿用旧 A-H 作为主要组成部分 | 改动小,已有内容多 | 入口、应用、领域、基础设施和业务职责混层 | 不采用 |
| 完全按 Inbound / Application / Domain / Persistence 分概要章节 | 接近代码实现 | 会把概要设计写成技术分层,丢失业务职责主线 | 不采用 |
| 用业务主要组成部分表达“做什么”,再用实现分层表达“代码如何安放” | 层次清楚,能支撑详细设计 | 需要重排旧 §6 / §8 | 采用 |

---

## 7. 结构化中间产物

### 7.1 架构模块到代码主体映射图

```text
L3-method-library
|
+-- 1. 方法定义生命周期与发布治理
|   +-- Command API                         接收写请求
|   +-- MethodContentCommandService         编排草稿/审核/发布/废弃/退役/supersede
|   +-- PublishGovernanceService            编排 gate_ref、actor_ref、audit、outbox
|   +-- MethodContentLifecycle              维护生命周期状态规则
|   +-- PublishPolicy                       维护发布与 published 不可变规则
|
+-- 2. 方法定义真相与规则
|   +-- MethodContent                       P0 定义资产共同聚合轮廓
|   +-- Qualification                       胜任力定义
|   +-- RoleDefinition                      角色定义
|   +-- TaskDefinition                      任务定义
|   +-- WorkProductDefinition               制品定义
|   +-- ProcessTemplateDef                  流程模板定义
|   +-- ViewProfile                         视图策略定义
|   +-- AIPolicyDef                         AI Policy 定义
|
+-- 3. 关系校验与边界保护
|   +-- ReferenceValidationPolicy           校验 definition 间引用
|   +-- DefinitionUseBoundaryGuard          阻止下游 Use truth 写入
|   +-- FingerprintPolicy                   约束 canonical fingerprint
|   +-- ViewProfileMatchPolicy              约束视图匹配与默认 deny
|
+-- 4. 定义同步与快照供给
|   +-- DefinitionSyncService               编排 outbox、event、replay
|   +-- SnapshotExportService               导出 Definition Snapshot
|   +-- OutboxEvent                         可靠事件记录
|   +-- OutboxRelayWorker                   从 outbox 发布到 L0-bus
|   +-- DefinitionSnapshot                  下游同步快照
|
+-- 5. 查询解析与审计追溯
|   +-- Query API                           接收只读查询
|   +-- ViewProfileResolveService           解析 active ViewProfile
|   +-- DefinitionTraceQueryService         查询版本/fingerprint/audit/event/snapshot
|   +-- DefinitionReadModel                 支撑列表与详情查询
|   +-- DefinitionTraceProjection           支撑审计追溯查询
|
+-- 6. 基线初始化与恢复运维
|   +-- Operations Trigger                  接收运维触发
|   +-- MethodOperationsService             编排 seed/replay/rebuild/recalculate
|   +-- SeedInitialMethodAssetsJob          初始化基础方法资产
|   +-- ReplayDefinitionEventsJob           重放定义事件
|   +-- RebuildDefinitionIndexJob           重建查询投影
|   +-- RecalculateFingerprintJob           复算 fingerprint
|
+-- 7. P1 资产打包与配置组装
|   +-- MethodPluginService                 P1 方法资产包发布编排
|   +-- MethodConfigurationService          P1 组织方法集激活编排
|   +-- PluginCompositionPolicy             P1 plugin/config 组合规则
|   +-- MethodPlugin                        P1 方法资产包对象
|   +-- MethodConfiguration                 P1 方法配置对象
|
+-- 8. 端口、持久化与外部适配
    +-- MethodContentRepository             读写定义真相
    +-- UnitOfWork                          承接发布事务边界
    +-- AuditLogPort                        写审计记录
    +-- OutboxPort                          写 outbox 事件
    +-- GateDecisionPort                    读取/校验 gate 结果
    +-- BlobRefPort                         校验 blob 引用
    +-- EventPublisherPort                  发布事件到 L0-bus
    +-- ReadProjection / SnapshotProjection 支撑查询和 snapshot
```

关键说明：

- 该图表达的是“架构模块与机制在概要设计层落成哪些代码主体主语”,不是目录树。
- `1~7` 是业务主要组成部分候选,第 `8` 是实现支撑主体集合,不应在 Step 5 中当成业务主要组成部分。
- `Command API`、`Query API`、`Operations Trigger` 是入口代码主体,不是业务部分本身。
- P1 主体只保留位置和边界,不作为 P0 详细展开前置条件。

### 7.2 实现分层视图

```text
外部调用 / 外部事件 / 运维任务
  - author / reviewer / admin / console
  - identity / process / capability-hub / artifact / governance / UI
  - L0-bus / operations
        |
        v
+--------------------------------------------------------------+
| Inbound / Operations                                         |
| Command API / Query API / Event Handler / Operations Trigger |
+-------------------------------+------------------------------+
                                |
                                v
+--------------------------------------------------------------+
| Application Services                                          |
| MethodContentCommandService / PublishGovernanceService        |
| DefinitionSyncService / SnapshotExportService                 |
| ViewProfileResolveService / DefinitionTraceQueryService       |
| MethodOperationsService / P1 PluginConfigurationService       |
+-------------------------------+------------------------------+
                                |
                                v
+--------------------------------------------------------------+
| Domain Model / Domain Policies                               |
| MethodContent + 7 definitions                                 |
| Lifecycle / Publish / Reference / Boundary / Fingerprint      |
| ViewProfileMatch / P1 Composition                             |
+-------------------------------+------------------------------+
                                |
                                v
+--------------------------------------------------------------+
| Ports                                                         |
| Repository / UnitOfWork / AuditLog / Outbox / GateDecision    |
| BlobRef / EventPublisher / Clock / IdGenerator / Cache        |
+-------------------------------+------------------------------+
                                |
                                v
+--------------------------------------------------------------+
| Persistence / Projection / Outbound Adapters                  |
| PostgreSQL write model / version store / audit store / outbox |
| read model / trace projection / snapshot projection           |
| L0-bus adapter / object storage adapter / governance adapter  |
+--------------------------------------------------------------+
```

关键说明：

- 该图表达请求、事件和运维触发如何进入实现分层,不表达部署拓扑或具体进程拆分。
- 业务主要组成部分可以跨多个实现层;实现层也会承载多个业务组成部分。
- Domain 不依赖 HTTP、PostgreSQL、L0-bus、object storage 或下游系统。
- Ports 是抽象接缝,在概要设计层只点名,完整 trait 与函数签名留给 `03-详细设计.md`。

### 7.3 业务主要组成部分与实现分层关系说明表

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | 表达 method-library 在业务上承担哪些职责主线,例如方法定义生命周期、定义真相、关系校验、定义同步、查询追溯、恢复运维、P1 打包组装 |
| 实现分层 | 表达代码如何安放这些主体,例如 Inbound / Operations、Application Services、Domain Model / Policies、Ports、Persistence / Projection / Outbound Adapters |
| 二者关系 | 一个业务组成部分通常会跨多个实现层;一个实现层也会承接多个业务组成部分 |
| 不能混用的原因 | 如果把 Inbound / Persistence 当业务主要组成部分,Step 5 会退化成技术分层;如果把业务部分当代码层,Step 6 / 7 / 8 会缺少清晰落点 |
| 本步边界 | 本步只收稳代码主体框架,不决定文件目录、完整接口契约、数据库表或具体框架实现 |

### 7.4 关键判断

必须作为业务主要组成部分继续进入 Step 5 的名称：

```text
1. 方法定义生命周期与发布治理
2. 方法定义真相与规则
3. 关系校验与边界保护
4. 定义同步与快照供给
5. 查询解析与审计追溯
6. 基线初始化与恢复运维
7. P1 资产打包与配置组装
```

只作为实现分层或支撑主体出现,不作为业务主要组成部分的名称：

```text
Inbound / Operations
Application Services
Domain Model / Domain Policies
Ports
Persistence / Projection / Outbound Adapters
Command API
Query API
Repository
UnitOfWork
PostgreSQL adapter
L0-bus adapter
Object storage adapter
```

判断理由：

```text
业务主要组成部分回答“method-library 对平台提供什么结构性能力”。
实现分层回答“这些能力在代码中如何被入口、编排、领域、端口和适配器承载”。
二者不是同一条轴,不能在正式概要设计中混成同级列表。
```

---

## 8. 回填草稿

以下内容可回填到新版 `02-概要设计.md` §4。

````md
## 4. 代码主体框架总览

本章把架构设计中已经收稳的模块、边界和主线,转译为后续详细设计可以继续展开的代码主体框架。

### 4.1 架构模块到代码主体映射图

```text
L3-method-library
|
+-- 1. 方法定义生命周期与发布治理
|   +-- Command API                         接收写请求
|   +-- MethodContentCommandService         编排草稿/审核/发布/废弃/退役/supersede
|   +-- PublishGovernanceService            编排 gate_ref、actor_ref、audit、outbox
|   +-- MethodContentLifecycle              维护生命周期状态规则
|   +-- PublishPolicy                       维护发布与 published 不可变规则
|
+-- 2. 方法定义真相与规则
|   +-- MethodContent                       P0 定义资产共同聚合轮廓
|   +-- Qualification                       胜任力定义
|   +-- RoleDefinition                      角色定义
|   +-- TaskDefinition                      任务定义
|   +-- WorkProductDefinition               制品定义
|   +-- ProcessTemplateDef                  流程模板定义
|   +-- ViewProfile                         视图策略定义
|   +-- AIPolicyDef                         AI Policy 定义
|
+-- 3. 关系校验与边界保护
|   +-- ReferenceValidationPolicy           校验 definition 间引用
|   +-- DefinitionUseBoundaryGuard          阻止下游 Use truth 写入
|   +-- FingerprintPolicy                   约束 canonical fingerprint
|   +-- ViewProfileMatchPolicy              约束视图匹配与默认 deny
|
+-- 4. 定义同步与快照供给
|   +-- DefinitionSyncService               编排 outbox、event、replay
|   +-- SnapshotExportService               导出 Definition Snapshot
|   +-- OutboxEvent                         可靠事件记录
|   +-- OutboxRelayWorker                   从 outbox 发布到 L0-bus
|   +-- DefinitionSnapshot                  下游同步快照
|
+-- 5. 查询解析与审计追溯
|   +-- Query API                           接收只读查询
|   +-- ViewProfileResolveService           解析 active ViewProfile
|   +-- DefinitionTraceQueryService         查询版本/fingerprint/audit/event/snapshot
|   +-- DefinitionReadModel                 支撑列表与详情查询
|   +-- DefinitionTraceProjection           支撑审计追溯查询
|
+-- 6. 基线初始化与恢复运维
|   +-- Operations Trigger                  接收运维触发
|   +-- MethodOperationsService             编排 seed/replay/rebuild/recalculate
|   +-- SeedInitialMethodAssetsJob          初始化基础方法资产
|   +-- ReplayDefinitionEventsJob           重放定义事件
|   +-- RebuildDefinitionIndexJob           重建查询投影
|   +-- RecalculateFingerprintJob           复算 fingerprint
|
+-- 7. P1 资产打包与配置组装
|   +-- MethodPluginService                 P1 方法资产包发布编排
|   +-- MethodConfigurationService          P1 组织方法集激活编排
|   +-- PluginCompositionPolicy             P1 plugin/config 组合规则
|   +-- MethodPlugin                        P1 方法资产包对象
|   +-- MethodConfiguration                 P1 方法配置对象
|
+-- 8. 端口、持久化与外部适配
    +-- MethodContentRepository             读写定义真相
    +-- UnitOfWork                          承接发布事务边界
    +-- AuditLogPort                        写审计记录
    +-- OutboxPort                          写 outbox 事件
    +-- GateDecisionPort                    读取/校验 gate 结果
    +-- BlobRefPort                         校验 blob 引用
    +-- EventPublisherPort                  发布事件到 L0-bus
    +-- ReadProjection / SnapshotProjection 支撑查询和 snapshot
```

关键说明：

- 该图表达的是“架构模块与机制在概要设计层落成哪些代码主体主语”,不是目录树。
- `1~7` 是业务主要组成部分候选,第 `8` 是实现支撑主体集合,不应在 Step 5 中当成业务主要组成部分。
- `Command API`、`Query API`、`Operations Trigger` 是入口代码主体,不是业务部分本身。
- P1 主体只保留位置和边界,不作为 P0 详细展开前置条件。

### 4.2 实现分层视图

```text
外部调用 / 外部事件 / 运维任务
        |
        v
+--------------------------------------------------------------+
| Inbound / Operations                                         |
| Command API / Query API / Event Handler / Operations Trigger |
+-------------------------------+------------------------------+
                                |
                                v
+--------------------------------------------------------------+
| Application Services                                          |
| MethodContentCommandService / PublishGovernanceService        |
| DefinitionSyncService / SnapshotExportService                 |
| ViewProfileResolveService / DefinitionTraceQueryService       |
| MethodOperationsService / P1 PluginConfigurationService       |
+-------------------------------+------------------------------+
                                |
                                v
+--------------------------------------------------------------+
| Domain Model / Domain Policies                               |
| MethodContent + 7 definitions                                 |
| Lifecycle / Publish / Reference / Boundary / Fingerprint      |
| ViewProfileMatch / P1 Composition                             |
+-------------------------------+------------------------------+
                                |
                                v
+--------------------------------------------------------------+
| Ports                                                         |
| Repository / UnitOfWork / AuditLog / Outbox / GateDecision    |
| BlobRef / EventPublisher / Clock / IdGenerator / Cache        |
+-------------------------------+------------------------------+
                                |
                                v
+--------------------------------------------------------------+
| Persistence / Projection / Outbound Adapters                  |
| PostgreSQL write model / version store / audit store / outbox |
| read model / trace projection / snapshot projection           |
| L0-bus adapter / object storage adapter / governance adapter  |
+--------------------------------------------------------------+
```

关键说明：

- 该图表达请求、事件和运维触发如何进入实现分层,不表达部署拓扑或具体进程拆分。
- 业务主要组成部分可以跨多个实现层;实现层也会承载多个业务组成部分。
- Domain 不依赖 HTTP、PostgreSQL、L0-bus、object storage 或下游系统。
- Ports 是抽象接缝,完整 trait 与函数签名留给 `03-详细设计.md`。

### 4.3 业务主要组成部分与实现分层关系说明

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | 表达 method-library 在业务上承担哪些职责主线,例如方法定义生命周期、定义真相、关系校验、定义同步、查询追溯、恢复运维、P1 打包组装 |
| 实现分层 | 表达代码如何安放这些主体,例如 Inbound / Operations、Application Services、Domain Model / Policies、Ports、Persistence / Projection / Outbound Adapters |
| 二者关系 | 一个业务组成部分通常会跨多个实现层;一个实现层也会承接多个业务组成部分 |
| 不能混用的原因 | 如果把 Inbound / Persistence 当业务主要组成部分,Step 5 会退化成技术分层;如果把业务部分当代码层,Step 6 / 7 / 8 会缺少清晰落点 |
| 本步边界 | 本步只收稳代码主体框架,不决定文件目录、完整接口契约、数据库表或具体框架实现 |

### 4.4 关键判断

业务主要组成部分回答“method-library 对平台提供什么结构性能力”。

实现分层回答“这些能力在代码中如何被入口、编排、领域、端口和适配器承载”。

因此 `Inbound / Operations`、`Application Services`、`Domain Model / Policies`、`Ports`、`Persistence / Projection / Outbound Adapters` 不作为业务主要组成部分,而作为承载业务主体的实现组织轴。
````

---

## 9. 待确认事项

| 问题 | 当前建议 | 是否阻塞 Step 4 |
|---|---|---|
| 是否同意旧 A-H 中 A / H 不再作为业务主要组成部分 | 建议 A 归入 Inbound / Operations,H 归入 Persistence / Outbound Adapters | 阻塞 |
| 是否同意 Step 5 按 7 个业务主要组成部分继续展开 | 建议采用 7 个业务主线,不按技术层展开 | 阻塞 |
| 是否同意 Step 4 点名这些服务、策略、端口和 worker 名称 | 建议作为 03 的稳定主语,但不在 02 写完整签名 | 不阻塞 |
| 是否同意 P1 只保留位置和边界 | 建议不把 P1 作为 P0 详细展开前置条件 | 不阻塞 |

---

## 10. 进入下一步条件

进入 Step 5 前需要确认：

- [x] 是否同意新版 §4 用“业务主要组成部分 + 实现分层”两条轴表达代码主体框架
- [x] 是否同意 `对外入口与访问`、`基础设施适配` 不再作为业务主要组成部分
- [x] 是否同意 Step 5 按 7 个业务主要组成部分逐一展开职责与边界
- [x] 是否同意本步不展开目录、完整 trait、struct、协议 schema 和 DDL
