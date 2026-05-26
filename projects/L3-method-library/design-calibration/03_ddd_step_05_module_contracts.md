# Step 5. 定义模块实现契约主轴

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 5
- 回填章节：`03-详细设计.md` §5 模块实现契约

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 4 实现单元与文件布局 | 已确认 6 crate Rust workspace 与 P0 必建文件树 |
| `02-概要设计.md` §4 | 已确认实现分层: Inbound / Operations、Application Services、Domain Model / Policies、Ports、Persistence / Projection / Outbound Adapters |
| `02-概要设计.md` §5 | 已确认 7 个业务主要组成部分、职责和边界 |
| `standards/document/详细设计书写规范.md` §5.5 | 要求第 5 章按模块展开对象、trait、adapter、错误和测试切口 |

已确认结论：

```text
Step 5 的模块不是业务主要组成部分,也不是粗粒度 crate 名。
模块实现契约应按 Rust 实现职责和依赖方向拆分,并能承接 Step 6~16 的对象、trait、协议、处理流、状态、持久化和测试切口。
```

依赖的前序 Step：

```text
Step 1 已确认上游输入边界。
Step 2 已确认 P0 / P1 范围。
Step 3 已确认 Rust 契约与安全边界。
Step 4 已确认 workspace / crate / file tree。
```

---

## 3. SOP 问题回答

1. 本仓详细设计应该拆成哪些实现模块？

   回答：建议拆成 13 个 P0 实现模块:`domain::content`、`domain::definitions`、`domain::policies`、`contracts`、`application::command_services`、`application::sync_services`、`application::query_services`、`application::operations_services`、`application::ports`、`infra::persistence`、`infra::outbound_adapters`、`api`、`worker`。这些模块覆盖 Step 4 的 6 crate,并能让每类对象、trait、handler、repository 找到明确归属。

2. 每个模块对应概要设计中的哪个主要组成部分或代码主体？

   回答：`domain::*` 对应“方法定义真相与规则”和“关系校验与边界保护”;`application::*` 对应生命周期治理、同步快照、查询追溯、恢复运维的编排主线;`contracts` 对应 API / Command / Query / Event / Job 骨架;`infra::*` 对应端口实现、持久化、projection 和外部 adapter;`api` 对应 Inbound / Operations;`worker` 对应 OutboxRelayWorker 和 Operations Job。

3. 每个模块对外暴露什么？

   回答：Domain 模块暴露领域类型、value object、domain policy 和 domain error;Contracts 模块暴露 DTO / envelope / schema 类型;Application 模块暴露 service、port trait 和 application error;Infra 模块暴露 adapter 组装函数和 port implementation;API 模块暴露 route / handler 绑定;Worker 模块暴露 worker / job runner。

4. 每个模块允许依赖哪些模块，禁止依赖哪些模块？

   回答：依赖方向必须是 `api/worker -> application -> domain + contracts + ports`, `infra -> application ports + domain + contracts`, `domain -> none external`。Domain 禁止依赖 contracts、application、infra、api、worker 和任何外部协议。Application 禁止依赖 infra 具体实现。API 和 Worker 禁止绕过 application 直接写 repository 或 domain truth。Infra 禁止反向调用 API / Worker。

5. 哪些对象、trait、handler、repository 应归属于哪个模块？

   回答：`MethodContent`、7 类 definition、lifecycle、fingerprint、reference 属于 domain;Command / Query / Event / Snapshot / Job DTO 属于 contracts;`MethodContentCommandService`、`DefinitionSyncService`、`ViewProfileResolveService`、`MethodOperationsService` 属于 application service 模块;repository / unit_of_work / audit / outbox / projection 等 trait 属于 application::ports;PostgreSQL repository、outbox store、projection adapter 属于 infra::persistence;L0-bus、blob、governance adapter 属于 infra::outbound_adapters;HTTP / RPC handler 属于 api;outbox relay 和 operations job runner 属于 worker。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `03-详细设计.md` 旧版 | 旧版以 A-H、对象、接口、数据流多线并行展开 | 新版第 5 章无法按模块一站式承接实现契约 |
| Step 4 文件布局 | 已有 crate 和文件路径,但还没明确“第 5 章按哪些模块写” | Step 6 / 7 / 8 会再次分散到全局对象和接口清单 |
| `02-概要设计.md` §5 | 7 个业务主要组成部分是业务责任主线 | 如果直接当详细设计模块,会跨越多个 crate 和文件,不利于编码 |
| `02-概要设计.md` §4 | 实现分层是技术安放方式 | 如果只按 Inbound / Domain / Ports 写,会丢失业务闭环和模块对象归属 |
| P1 资产打包与配置组装 | 概要设计有 P1 位置,但 Step 2 已确认不进入本轮 P0 主线 | 第 5 章不能把 P1 模块写成 P0 必实现模块 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 第 5 章组织方式 | 可能按 A-H 或 7 个业务组成部分写 | 按 13 个可实现模块写 | 模块实现契约必须贴近代码和依赖方向 |
| crate 与模块关系 | 6 crate 已固定,但 crate 粒度太粗 | 每个 crate 下拆出职责模块 | 让对象、trait、handler、repository 有明确归属 |
| 业务主线映射 | 业务组成部分可能直接变成模块 | 业务组成部分映射到多个实现模块 | 一个业务主线通常跨 domain / app / infra / api |
| 对象归属 | 对象可能再次被全局列出 | 对象必须落到 domain / contracts / application / infra / api / worker 模块 | 支撑 Step 6 逐模块定义对象契约 |
| P1 处理 | P1 容易进入模块总表 | P1 不作为 P0 模块,只作为风险和后续扩展 | 保持 P0 / P1 分离 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 直接按 7 个业务主要组成部分写第 5 章 | 与概要设计 §5 对齐 | 每个部分横跨多个 crate,实现者仍需拼装对象、port、adapter 和 handler | 不采用 |
| 直接按 6 个 crate 写第 5 章 | 与文件布局一致 | crate 粒度过粗,`application` / `domain` 内部职责不够清楚 | 不采用 |
| 按 crate 内可实现模块写第 5 章 | 兼顾代码落点和职责边界 | 模块数量较多,需要总表和依赖图控制复杂度 | 采用 |

---

## 7. 结构化中间产物

### 7.1 模块总览表

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 依赖对象 |
|---|---|---|---|---|
| `domain::content` | `method_library_domain` | 定义 P0 MethodContent 共同聚合、生命周期、版本、fingerprint、reference | `MethodContent`、`MethodContentKind`、`MethodContentLifecycle`、`DefinitionVersion`、`Fingerprint`、`DefinitionReference` | 无外部依赖 |
| `domain::definitions` | `method_library_domain` | 定义 7 类 P0 definition subtype 的专属语义 | `Qualification`、`RoleDefinition`、`TaskDefinition`、`WorkProductDefinition`、`ProcessTemplateDef`、`ViewProfile`、`AIPolicyDef` | `domain::content` |
| `domain::policies` | `method_library_domain` | 定义发布、引用校验、边界保护、fingerprint、ViewProfile 匹配规则 | `PublishPolicy`、`ReferenceValidationPolicy`、`DefinitionUseBoundaryGuard`、`FingerprintPolicy`、`ViewProfileMatchPolicy` | `domain::content`、`domain::definitions` |
| `contracts` | `method_library_contracts` | 定义外部和内部协议 DTO | command / query / event / snapshot / job DTO、`ActorContext`、`CommandMetadata`、error response | 不依赖 application / infra / api / worker |
| `application::command_services` | `method_library_application` | 编排草稿、提交审核、发布、废弃、退役、supersede 写路径 | `MethodContentCommandService`、`PublishGovernanceService` | `domain::*`、`contracts`、`application::ports` |
| `application::sync_services` | `method_library_application` | 编排 event、snapshot、replay、resync | `DefinitionSyncService`、`SnapshotExportService` | `domain::*`、`contracts`、`application::ports` |
| `application::query_services` | `method_library_application` | 编排列表、详情、trace、ResolveViewProfile、CompareFingerprint 只读路径 | `ViewProfileResolveService`、`DefinitionTraceQueryService` | `domain::*`、`contracts`、`application::ports` |
| `application::operations_services` | `method_library_application` | 编排 seed、replay、rebuild、recalculate operations job | `MethodOperationsService` | `domain::*`、`contracts`、`application::ports` |
| `application::ports` | `method_library_application` | 定义外部能力抽象和事务边界 | `UnitOfWork`、`MethodContentRepository`、`AuditLogPort`、`OutboxPort`、`GateDecisionPort`、`BlobRefPort`、`EventPublisherPort`、projection ports | `domain::*`、`contracts` |
| `infra::persistence` | `method_library_infra` | 实现 PostgreSQL write model、audit、outbox、projection、transaction | PostgreSQL repository / UnitOfWork / projection adapters | `application::ports`、`domain::*`、`contracts` |
| `infra::outbound_adapters` | `method_library_infra` | 实现 L0-bus、object storage、governance gate 等外部 adapter | `L0EventPublisher`、`ObjectStorageBlobRefAdapter`、`GateDecisionClient` | `application::ports`、`contracts` |
| `api` | `method_library_api` | 暴露 Command / Query / Snapshot / Operations 入口,提取 gateway context,映射错误 | routes、handlers、extractors、response mapper | `contracts`、`application::*` |
| `worker` | `method_library_worker` | 运行 outbox relay 和 operations jobs | outbox relay runner、seed / replay / rebuild / recalculate job runner | `contracts`、`application::*`、`infra::*` |

### 7.2 模块依赖图

#### 模块依赖图: L3-method-library 模块实现主轴

```text
[api]
  | call command/query
  v
[application::command_services]
  | call domain
  v
[domain::policies]
  | call
  v
[domain::content] <--- call --- [domain::definitions]

[api]
  | call query
  v
[application::query_services]
  | call domain/policy
  v
[domain::policies]

[worker]
  | call
  v
[application::sync_services]
  | use port
  v
[application::ports] <--- impl port --- [infra::persistence]

[worker]
  | call
  v
[application::operations_services]
  | use port
  v
[application::ports] <--- impl port --- [infra::outbound_adapters]
```

关键说明：

- 图表达模块依赖方向,不表达函数级处理流。
- `domain::*` 不依赖 `contracts`、`application::*`、`infra::*`、`api` 或 `worker`。
- `infra::*` 实现 `application::ports`,但 application 不反向依赖 infra。
- `api` 和 `worker` 必须通过 application service 进入业务主链,不得直接写 repository 或 domain truth。
- `contracts` 是横切 DTO 层,服务于 `api`、`worker`、`application::*` 和 `infra::*`,但不参与本图主干箭头。

### 7.3 模块职责表

| 模块 | 允许依赖 | 禁止依赖 | 归属对象 / 代码主体 |
|---|---|---|---|
| `domain::content` | 标准库、领域内部 value object | contracts、application、infra、api、worker、HTTP、PostgreSQL、bus | `MethodContent`、`MethodContentLifecycle`、`Fingerprint`、`DefinitionReference` |
| `domain::definitions` | `domain::content` | application、infra、api、worker、下游 Use truth | 7 类 P0 subtype |
| `domain::policies` | `domain::content`、`domain::definitions` | repository、event publisher、gate client、HTTP handler | publish / reference / boundary / fingerprint / view profile policy |
| `contracts` | 基础序列化类型、稳定 primitive / shared id type | application service、infra adapter、handler 实现 | command / query / event / snapshot / job DTO |
| `application::command_services` | domain、contracts、ports | infra concrete adapter、HTTP framework、bus client | command services、publish governance |
| `application::sync_services` | domain、contracts、ports | infra concrete adapter、HTTP framework | definition sync、snapshot export |
| `application::query_services` | domain、contracts、ports | infra concrete adapter、UI rendering | trace query、ViewProfile resolve |
| `application::operations_services` | domain、contracts、ports | direct DB write、external bus client | operations service |
| `application::ports` | domain、contracts | concrete PostgreSQL / L0-bus / object storage clients | repository / UnitOfWork / audit / outbox / event / projection traits |
| `infra::persistence` | domain、contracts、application::ports | api handler、worker runner business branch | PostgreSQL repository、UnitOfWork、outbox store、projection adapters |
| `infra::outbound_adapters` | contracts、application::ports | domain mutation、api handler | L0-bus publisher、blob ref adapter、gate client |
| `api` | contracts、application services | direct repository, direct domain mutation, infra transaction bypass | routes、handlers、extractors、error mapping |
| `worker` | contracts、application services、infra composition | direct domain truth mutation bypassing application | outbox relay、operations job runner |

### 7.4 归属映射表

| 代码主体 | 归属模块 | 后续展开 Step |
|---|---|---|
| `MethodContent` / lifecycle / version / fingerprint / reference | `domain::content` | Step 6 / Step 10 |
| 7 类 P0 definition subtype | `domain::definitions` | Step 6 |
| `PublishPolicy` / `ReferenceValidationPolicy` / `BoundaryGuard` | `domain::policies` | Step 6 / Step 10 / Step 12 |
| Command / Query / Event / Snapshot / Job DTO | `contracts` | Step 8 |
| `MethodContentCommandService` / `PublishGovernanceService` | `application::command_services` | Step 6 / Step 9 / Step 11 |
| `DefinitionSyncService` / `SnapshotExportService` | `application::sync_services` | Step 6 / Step 9 / Step 11 |
| `ViewProfileResolveService` / `DefinitionTraceQueryService` | `application::query_services` | Step 6 / Step 9 |
| `MethodOperationsService` | `application::operations_services` | Step 6 / Step 9 |
| Repository / UnitOfWork / Audit / Outbox / EventPublisher / Projection trait | `application::ports` | Step 7 |
| PostgreSQL repository / outbox / projection implementation | `infra::persistence` | Step 7 / Step 11 |
| L0-bus / blob / governance adapter | `infra::outbound_adapters` | Step 7 / Step 14 |
| routes / handlers / gateway context extractor / error mapper | `api` | Step 8 / Step 9 / Step 12 |
| outbox relay / operations job runner | `worker` | Step 8 / Step 9 / Step 13 |

### 7.5 P1 不进入本轮模块主轴

| P1 主体 | 本轮处理方式 | 后续位置 |
|---|---|---|
| `MethodPlugin` | 不作为 P0 模块展开 | P1 时新增 `domain::plugin` / `application::plugin_services` |
| `MethodConfiguration` | 不作为 P0 模块展开 | P1 时新增 `domain::configuration` / `application::configuration_services` |
| `PluginCompositionPolicy` | 不作为 P0 policy 展开 | P1 时并入 `domain::policies` |
| marketplace metadata adapter | 不进入 P0 infra | L6-marketplace 契约收稳后新增 |

---

## 8. 回填草稿

可直接回填到 `03-详细设计.md` 的起草文字：

````md
## 5. 模块实现契约

### 5.1 模块总览

| 模块 | 所属实现单元 | 职责 | 对外暴露 | 依赖对象 |
|---|---|---|---|---|
| `domain::content` | `method_library_domain` | 定义 P0 MethodContent 共同聚合、生命周期、版本、fingerprint、reference | `MethodContent`、`MethodContentKind`、`MethodContentLifecycle`、`DefinitionVersion`、`Fingerprint`、`DefinitionReference` | 无外部依赖 |
| `domain::definitions` | `method_library_domain` | 定义 7 类 P0 definition subtype 的专属语义 | `Qualification`、`RoleDefinition`、`TaskDefinition`、`WorkProductDefinition`、`ProcessTemplateDef`、`ViewProfile`、`AIPolicyDef` | `domain::content` |
| `domain::policies` | `method_library_domain` | 定义发布、引用校验、边界保护、fingerprint、ViewProfile 匹配规则 | `PublishPolicy`、`ReferenceValidationPolicy`、`DefinitionUseBoundaryGuard`、`FingerprintPolicy`、`ViewProfileMatchPolicy` | `domain::content`、`domain::definitions` |
| `contracts` | `method_library_contracts` | 定义外部和内部协议 DTO | command / query / event / snapshot / job DTO、`ActorContext`、`CommandMetadata`、error response | 不依赖 application / infra / api / worker |
| `application::command_services` | `method_library_application` | 编排草稿、提交审核、发布、废弃、退役、supersede 写路径 | `MethodContentCommandService`、`PublishGovernanceService` | `domain::*`、`contracts`、`application::ports` |
| `application::sync_services` | `method_library_application` | 编排 event、snapshot、replay、resync | `DefinitionSyncService`、`SnapshotExportService` | `domain::*`、`contracts`、`application::ports` |
| `application::query_services` | `method_library_application` | 编排列表、详情、trace、ResolveViewProfile、CompareFingerprint 只读路径 | `ViewProfileResolveService`、`DefinitionTraceQueryService` | `domain::*`、`contracts`、`application::ports` |
| `application::operations_services` | `method_library_application` | 编排 seed、replay、rebuild、recalculate operations job | `MethodOperationsService` | `domain::*`、`contracts`、`application::ports` |
| `application::ports` | `method_library_application` | 定义外部能力抽象和事务边界 | `UnitOfWork`、`MethodContentRepository`、`AuditLogPort`、`OutboxPort`、`GateDecisionPort`、`BlobRefPort`、`EventPublisherPort`、projection ports | `domain::*`、`contracts` |
| `infra::persistence` | `method_library_infra` | 实现 PostgreSQL write model、audit、outbox、projection、transaction | PostgreSQL repository / UnitOfWork / projection adapters | `application::ports`、`domain::*`、`contracts` |
| `infra::outbound_adapters` | `method_library_infra` | 实现 L0-bus、object storage、governance gate 等外部 adapter | `L0EventPublisher`、`ObjectStorageBlobRefAdapter`、`GateDecisionClient` | `application::ports`、`contracts` |
| `api` | `method_library_api` | 暴露 Command / Query / Snapshot / Operations 入口,提取 gateway context,映射错误 | routes、handlers、extractors、response mapper | `contracts`、`application::*` |
| `worker` | `method_library_worker` | 运行 outbox relay 和 operations jobs | outbox relay runner、seed / replay / rebuild / recalculate job runner | `contracts`、`application::*`、`infra::*` |

### 5.2 模块依赖图

#### 模块依赖图: L3-method-library 模块实现主轴

```text
[api]
  | call command/query
  v
[application::command_services]
  | call domain
  v
[domain::policies]
  | call
  v
[domain::content] <--- call --- [domain::definitions]

[api]
  | call query
  v
[application::query_services]
  | call domain/policy
  v
[domain::policies]

[worker]
  | call
  v
[application::sync_services]
  | use trait
  v
[application::ports]
  ^                 ^
  | impl port       | impl port
[infra::persistence] [infra::outbound_adapters]

[worker]
  | call
  v
[application::operations_services]
  | call domain
  v
[domain::policies]

[application::operations_services]
  | use trait
  v
[application::ports]
```

关键说明：

- 图表达模块依赖方向,不表达函数级处理流。
- `domain::*` 不依赖 `contracts`、`application::*`、`infra::*`、`api` 或 `worker`。
- `infra::*` 实现 `application::ports`,但 application 不反向依赖 infra。
- `api` 和 `worker` 必须通过 application service 进入业务主链,不得直接写 repository 或 domain truth。

### 5.3 模块展开规则

后续每个模块必须按以下固定结构展开:

```text
### 5.x <module_name> 模块
#### 5.x.1 模块职责
#### 5.x.2 文件与代码主体映射
#### 5.x.3 对象实现契约
#### 5.x.4 Trait / Port / Adapter 契约
#### 5.x.5 模块内关键函数
#### 5.x.6 模块错误类型
#### 5.x.7 模块测试切口
```

P1 的 `MethodPlugin`、`MethodConfiguration`、`PluginCompositionPolicy`、marketplace metadata adapter 不进入本轮 P0 模块展开。
````

---

## 9. 待确认事项

- 是否同意第 5 章按 13 个可实现模块展开,而不是按 7 个业务组成部分或 6 个 crate 粗略展开。
- 是否同意 `domain::*` 不依赖 `contracts`,由 application 负责 DTO 到 domain 的转换。
- 是否同意 P1 主体不进入本轮模块主轴,只在风险和后续扩展中保留。

---

## 10. 进入下一步条件

- 模块主轴已经稳定。
- 每个对象、trait、handler、repository 都能找到归属模块。
- 模块依赖方向已经明确,且不违反 domain / application / infra / api / worker 边界。
- 用户确认后,可以进入 Step 6 逐模块定义对象实现契约。
