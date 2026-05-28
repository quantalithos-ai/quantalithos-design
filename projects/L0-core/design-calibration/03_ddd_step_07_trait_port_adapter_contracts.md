# Step 7. 逐模块定义 Trait / Port / Adapter 契约

> 本文件是 `projects/L0-core/03-详细设计.md` 的 Step 7 中间产物。
> 本步只收稳跨模块、跨层、跨外部系统的 trait / port / adapter 契约。
> 本步不展开 Command / Query / Event / Job 完整协议 schema,不写逐接口函数级处理流,不写 DDL、事务细节或测试方案。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填,本文件不替代正式详细设计。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 7
- 回填章节: `projects/L0-core/03-详细设计.md` §5 模块实现契约 / §6 全局对象、Trait、API 索引

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 4 实现单元与文件布局 | 已确认 `crates/application/src/ports/` 和 `crates/infra/src/...` 文件布局 | 作为 port trait 和 adapter 落文件依据 |
| Step 5 模块实现契约主轴 | 已确认 `application_ports` 和 `infra_adapters` 模块边界 | 作为 trait 定义方和实现方归属依据 |
| Step 6 对象实现契约 | 已确认 domain object、application service 和 service 依赖字段 | 作为 trait 方法参数、返回对象和错误类型来源 |
| 架构设计依赖方向 | application 只依赖 port trait;infra 实现 port;domain 不依赖 infra | 作为允许依赖 / 禁止依赖判断依据 |
| `standards/document/详细设计书写规范.md` §5.5 / §5.6 | 要求 trait 代码片段、参数类型、返回类型、错误类型、索引表 | 作为本步格式依据 |

已确认结论:

```text
Step 7 必须把所有外部依赖都收敛为 application_ports 中的 trait。
infra_adapters 只能实现这些 port,不能被 domain 或 application 反向依赖。
trait 函数必须写完整参数类型、返回类型和错误类型。
```

---

## 3. 本步写作策略

本步沿用长文档写作规则:

```text
骨架先行 + 分批填充 + 状态推进 + 格式约束 + 最后收口
```

写作约束:

- 如果一次计划写入预计超过 500 行,必须拆成多次写入。
- 每次写入必须保持一个 trait 或 adapter 契约完整,不能拆散同一个 trait 的代码片段和函数表。
- repository、outbox、projection、external client、toolchain、support port 必须写成明确 trait 契约。
- 不允许用“调用数据库”“调用外部服务”“调用工具链”替代 port 方法定义。
- 不在本步写具体 adapter 内部实现、DDL、事务伪代码或协议 schema。

---

## 4. 分章节写入计划

| 章节 | 状态 | 主题 | 覆盖模块 | 主要契约 |
|---|---|---|---|---|
| 7.1 | [x] | Trait / Port / Adapter 总览与统一写法 | `application_ports` / `infra_adapters` | port 分类、trait 模板、adapter 模板、调用方 / 实现方关系 |
| 7.2 | [x] | 事务、时间、ID 与基础支撑端口 | `application_ports` | `UnitOfWork`、`ClockPort`、`IdGeneratorPort` |
| 7.3 | [x] | 核心 repository port | `application_ports` | `ContractDefinitionRepository`、`ContractBaselineRepository`、`SnapshotRepository`、`ContractFactRepository`、`ReferenceRepository` |
| 7.4 | [x] | 审计、outbox 与事件发布 port | `application_ports` | `AuditLogPort`、`OutboxPort`、`EventPublisherPort` |
| 7.5 | [x] | 外部校验与引用解析 port | `application_ports` | `GateDecisionPort`、`ReferenceResolverPort`、`BlobRefPort` |
| 7.6 | [x] | 工具链与 projection / source adapter 契约 | `infra_adapters` / `application_ports` | source store、snapshot store、projection store、toolchain runner、fingerprint runner、snapshot exporter |
| 7.7 | [x] | Adapter 实现方映射与 wiring 边界 | `infra_adapters` / `cli_entry` / `jobs` | adapter 实现表、wiring helper、禁止依赖 |
| 7.8 | [x] | Step 7 统一复核 | 全部相关模块 | trait 覆盖、参数类型、返回类型、错误类型、调用方 / 实现方 |

---

## 5. SOP 问题回答

### 5.1 哪些模块需要定义 trait / port？

需要在 `crates/application/src/ports/` 定义 trait / port 的模块如下:

| 模块 | 需要定义的 port | 原因 |
|---|---|---|
| 基础支撑 | `UnitOfWork`、`ClockPort`、`IdGeneratorPort` | 写路径、审计、outbox 和 job 必须有统一事务、时间和 ID 来源 |
| 真相 repository | `ContractDefinitionRepository`、`ContractBaselineRepository`、`SnapshotRepository`、`ContractFactRepository`、`ReferenceRepository` | application service 只依赖真相读写抽象,不依赖存储实现 |
| 审计 / 事实输出 | `AuditLogPort`、`OutboxPort`、`EventPublisherPort` | 审计、outbox 持久化和 L0-bus 边界必须拆开 |
| 外部校验 / 引用解析 | `GateDecisionPort`、`ReferenceResolverPort`、`BlobRefPort` | 读取外部门禁、引用和 blob 可用性时不能复制外部正文 |
| 资产 / projection / toolchain | `ContractSourceStorePort`、`ReleaseSnapshotStorePort`、`ProjectionStorePort`、`ContractValidationRunnerPort`、`FingerprintRunnerPort`、`SnapshotExporterPort` | source、snapshot、projection 和工具链都是 application 可编排、infra 可替换的外部能力 |

### 5.2 哪些模块负责实现这些 trait / port？

全部由 `core_infra` 实现。`core_cli` 和 `core_jobs` 只负责装配和调用 application service。

| 实现模块 | 实现范围 |
|---|---|
| `source_store/filesystem.rs` | `ContractSourceStorePort` 和必要的源码读写 adapter |
| `snapshot_store/filesystem.rs` | `ReleaseSnapshotStorePort` 和必要的快照资产 adapter |
| `projection_store/file_index.rs` | `ProjectionStorePort` 和 projection 查询 / 重建 adapter |
| `outbox_store/file_outbox.rs` | `OutboxPort` |
| `audit_store/file_audit.rs` | `AuditLogPort` |
| `adapters/*.rs` | gate、resolver、blob、publisher、clock、id、unit of work 等外部 adapter |
| `toolchain/*.rs` | validation、fingerprint、snapshot exporter runner |

### 5.3 repository、outbox、projection、external client 的函数签名是什么？

本步已经按 trait 小节写出完整签名:

| 类别 | 代表 trait | 函数签名位置 |
|---|---|---|
| repository | `ContractDefinitionRepository`、`ContractBaselineRepository`、`SnapshotRepository`、`ContractFactRepository`、`ReferenceRepository` | §9.3 |
| outbox / audit / event | `AuditLogPort`、`OutboxPort`、`EventPublisherPort` | §9.4 |
| external client | `GateDecisionPort`、`ReferenceResolverPort`、`BlobRefPort` | §9.5 |
| source / snapshot / projection | `ContractSourceStorePort`、`ReleaseSnapshotStorePort`、`ProjectionStorePort` | §9.6 |
| toolchain runner | `ContractValidationRunnerPort`、`FingerprintRunnerPort`、`SnapshotExporterPort` | §9.6 |

### 5.4 每个 trait 函数的参数类型、返回类型、错误类型是什么？

已经在每个 trait 的“Trait 定义”和“方法表”中逐项列出。统一规则如下:

- I/O 型函数统一返回 `Result<..., PortError>`。
- 纯时间和 ID 支撑函数可以同步返回具体值,例如 `fn now(&self) -> Timestamp`。
- 写入函数必须显式携带实体、文档、批次、版本或 expected fingerprint。
- 查询函数必须显式携带 query / page / ref / id 类型。
- toolchain 函数只返回报告或计算结果,不直接返回领域状态迁移。

### 5.5 哪些依赖只能通过 trait 访问，不能直接跨层调用？

| 依赖场景 | 必须通过的 trait | 禁止做法 |
|---|---|---|
| application 读取或保存定义 / 基线 / 快照 | repository port | 直接依赖 filesystem 或数据库 adapter |
| application 写审计和 outbox | `AuditLogPort`、`OutboxPort` | service 自己写文件或发布 bus |
| application 读取 gate / resolver / blob | `GateDecisionPort`、`ReferenceResolverPort`、`BlobRefPort` | domain 直接调用外部系统 |
| jobs 执行校验、fingerprint、快照导出 | toolchain runner port | job 直接调用工具并改写真相 |
| cli / jobs 启动运行时 | wiring helper + `CoreInfraPorts` | 在 handler 中散落创建 adapter |

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理结果 | 影响 |
|---|---|---|---|
| Step 6 application service | 已使用 `P: XxxPorts` 作为 service 依赖,但 port trait 尚未定义 | 已定义底层 port、组合 port 写法和 `CoreInfraPorts` 装配边界 | service 构造依赖可实现 |
| Step 4 文件布局 | 已列 `ports/*.rs` 和 `infra/*` 文件,但 source / snapshot / projection / toolchain port 文件不完整 | 已同步回补 Step 4 文件树和文件职责表 | 避免最终文件布局漏掉 port 文件 |
| Step 5 模块主轴 | 已确认 `application_ports` / `infra_adapters` 边界,但缺少实现方映射 | 已补 adapter 实现表和禁止依赖清单 | 依赖方向可以 review |
| 旧版详细设计 | 容易用“调用数据库 / 调用工具链”替代明确接缝 | 已把 repository、outbox、external、toolchain 都落到 trait 函数 | 支撑 1:1 实现 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 外部依赖表达 | 只知道需要 repository、outbox、gate、resolver、toolchain | 每个依赖都有 trait、方法签名、参数、返回和错误类型 | 支撑 1:1 实现 |
| service 依赖 | Step 6 中只有 `P: XxxPorts` 泛型约束 | Step 7 定义组合 port 写法、底层 port 和 `CoreInfraPorts` | 让 service 构造可落地 |
| infra adapter | 只有文件名和职责 | 明确每个 adapter 实现哪个 port | 防止 infra 绕过 application |
| source / snapshot | 只是资产目录和 adapter 文件 | 拆出 `ContractSourceStorePort`、`ReleaseSnapshotStorePort` | 防止资产 I/O 和领域真相混淆 |
| projection | 容易混入 repository | 独立 `ProjectionStorePort` 管重建、水位和查询投影 | 防止查询视图反写定义真相 |
| toolchain | 容易被 jobs 直接调用 | 校验、fingerprint、snapshot export 都作为 port | 保持 job 通过 application 编排 |
| 依赖方向 | 文字约束 | trait 定义方 / 实现方 / 调用方表固定 | 防止 domain / application 反向依赖 infra |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只列 port 名称 | 文档短 | 实现者仍需猜方法和错误类型 | 不采用 |
| 每个底层 port 独立 trait,service 使用组合 port | 边界清晰,便于测试和替换 | trait 数量较多 | 采用 |
| application 直接依赖 infra adapter | 起步简单 | 破坏架构依赖方向 | 不采用 |
| projection 合并进 repository | port 数量少 | 查询视图、重建水位和真相读写混杂 | 不采用 |
| toolchain 作为 jobs 私有实现 | job 写起来快 | application service 无法统一编排和测试 | 不采用 |

---

## 9. 结构化中间产物

> 本节将按 7.1~7.8 逐步补齐。

### 9.1 Trait / Port / Adapter 总览与统一写法

本节先固定 Step 7 的统一写法和边界。后续 9.2~9.7 必须按本节格式补齐 port / adapter 契约。

#### 9.1.1 Port 分类总览

| 分类 | 定义模块 | 实现模块 | 典型调用方 | 主要契约 |
|---|---|---|---|---|
| 基础支撑 port | `application_ports` | `infra_adapters` | 所有 application service / jobs | `UnitOfWork`、`ClockPort`、`IdGeneratorPort` |
| 真相 repository port | `application_ports` | `infra_adapters` | `ContractChangeService`、`ContractReleaseService` | `ContractDefinitionRepository`、`ContractBaselineRepository` |
| 快照 / 引用 / 投影 port | `application_ports` | `infra_adapters` | `ContractSnapshotService`、`ContractTraceService`、`ContractOperationsService` | `SnapshotRepository`、`ReferenceRepository`、projection store |
| 事实记录 port | `application_ports` | `infra_adapters` | `ContractFactService`、`ContractOperationsService`、`OutboxRelayWorker` | `ContractFactRepository` |
| 审计 / outbox / event port | `application_ports` | `infra_adapters` | 写路径 service、fact service、operations service | `AuditLogPort`、`OutboxPort`、`EventPublisherPort` |
| 外部引用 / 门禁 / blob port | `application_ports` | `infra_adapters` | 发布、兼容、快照 service | `GateDecisionPort`、`ReferenceResolverPort`、`BlobRefPort` |
| 工具链 port | `application_ports` | `infra_adapters` | compatibility / snapshot / operations service、jobs | validation runner、fingerprint runner、snapshot exporter |

#### 9.1.2 依赖方向图

#### 模块依赖图: Port 定义方、调用方与实现方

```text
[application_services] -- call trait --> [application_ports]
[jobs]                 -- call trait --> [application_ports]

[infra_adapters]       -- impl trait --> [application_ports]

[cli_entry]            -- wiring --> [application_services]
[jobs]                 -- wiring --> [application_services]
[cli_entry]            -- wiring --> [infra_adapters]
[jobs]                 -- wiring --> [infra_adapters]

[domain_*]             -- no direct dependency --> [application_ports]
[application_services] -- no direct dependency --> [infra_adapters]
```

关键说明:

- `application_ports` 是 trait 定义层,不是 infra 实现层。
- `infra_adapters` 只能实现 port,不能被 domain 或 application 反向依赖。
- `cli_entry` 和 `jobs` 可以做 wiring,但业务写入必须经过 application service。
- domain 对象不能依赖 port;domain 只表达领域规则。

#### 9.1.3 Trait 契约固定写法

后续每个 trait 必须按以下结构展开:

````md
#### `<TraitName>`

###### Trait 定义

```rust
/// <trait 作用说明>
pub trait TraitName {
    /// <函数作用说明>
    async fn method_name(
        &self,
        input: InputType,
    ) -> Result<OutputType, PortError>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|

###### 不变量与禁止事项

- <约束>
````

写法要求:

- trait 代码块必须使用 `rust`。
- trait 和公开函数必须写 Rustdoc 风格中文注释。
- 函数签名必须包含参数类型、返回类型和错误类型。
- repository 方法必须显式表达乐观锁、版本或查询条件。
- external port 方法必须表达“只传引用 / 只返回结果”,不得隐式复制外部正文。
- 异步 I/O port 可以用 `async fn`;纯支撑 port 如 `ClockPort`、`IdGeneratorPort` 可使用同步函数。

#### 9.1.4 Adapter 契约固定写法

后续 adapter 不写内部实现,只写实现方映射和 wiring 边界。

固定写法:

| Adapter | 实现 port | 所属文件 | 主要责任 | 禁止事项 |
|---|---|---|---|---|

adapter 写法要求:

- adapter 必须实现一个或多个明确 port。
- adapter 不能绕过 application service 改写真相。
- adapter 不定义新的领域规则。
- adapter 内部存储、文件格式、外部 SDK 细节留给 Step 11 或实施计划。

#### 9.1.5 组合 Port 写法

Step 6 中 application service 使用 `P: XxxPorts` 泛型约束。Step 7 采用“组合 port trait”承接。

示例:

```rust
/// 契约变更服务所需端口集合。
pub trait ContractChangePorts:
    ContractDefinitionRepository
    + AuditLogPort
    + OutboxPort
    + UnitOfWork
    + ClockPort
    + IdGeneratorPort
{
}
```

写法要求:

- 组合 port 不定义业务方法,只组合底层能力。
- 底层 port 负责定义具体函数签名。
- service 依赖组合 port,测试时可用 mock 实现组合 port。

#### 9.1.6 本步不展开的内容

| 内容 | 不在本步展开的原因 | 后续 Step |
|---|---|---|
| Command / Query / Event / Job DTO schema | 属于协议契约 | Step 8 |
| 每个接口的调用顺序和事务伪代码 | 需要对象、port、协议都收稳后才能写 | Step 9 |
| 状态转换矩阵 | 属于状态机契约 | Step 10 |
| DDL、索引、事务隔离和一致性细节 | 属于持久化一致性 | Step 11 |
| adapter 内部文件格式和外部 SDK 调用细节 | 需要持久化和配置章节支撑 | Step 11 / Step 14 |

### 9.2 事务、时间、ID 与基础支撑端口

本节定义所有 application service 都会复用的基础支撑 port。它们不承载业务规则,只提供事务边界、时间来源和稳定 ID 来源。

#### 9.2.1 `UnitOfWork`

###### Trait 定义

```rust
/// 事务边界端口,用于保护真相写入、审计记录和 outbox 写入的一致性。
///
/// 具体事务实现由 infra adapter 提供;application service 只能依赖该 trait。
pub trait UnitOfWork {
    /// 在事务中执行一个异步操作,并在成功时提交、失败时回滚。
    async fn transact<T, F, Fut>(&self, operation: F) -> Result<T, PortError>
    where
        F: FnOnce(TransactionContext) -> Fut,
        Fut: Future<Output = Result<T, ApplicationError>>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `async fn transact<T, F, Fut>(&self, operation: F) -> Result<T, PortError> where F: FnOnce(TransactionContext) -> Fut, Fut: Future<Output = Result<T, ApplicationError>>` | 执行事务闭包 | `operation` 是带 `TransactionContext` 的应用操作 | `Result<T, PortError>` | `PortError` 表达事务开启、提交或回滚失败 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ContractChangeService`、`ContractReleaseService`、`ContractFactService`、`ContractOperationsService` | 写路径和恢复路径必须通过事务边界 |
| 定义方 | `crates/application/src/ports/unit_of_work.rs` | 定义 trait 和 `TransactionContext` |
| 实现方 | `core_infra` transaction adapter | 可基于文件锁、数据库事务或后续具体存储实现 |

###### 不变量与禁止事项

- domain 对象不得直接感知 `UnitOfWork`。
- application service 不得绕过 `UnitOfWork` 同时写真相、审计和 outbox。
- `UnitOfWork` 不定义业务规则,只定义事务执行边界。
- 具体隔离级别、锁策略和提交顺序留给 Step 11。

#### 9.2.2 `ClockPort`

###### Trait 定义

```rust
/// 时间来源端口,为 application service、domain factory 和审计记录提供统一时间。
pub trait ClockPort {
    /// 返回当前时间戳。
    fn now(&self) -> Timestamp;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `fn now(&self) -> Timestamp` | 获取当前时间 | 无 | `Timestamp` | 无;实现方必须保证可用 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | 所有写路径 service、operations service、job runner | 创建对象、迁移状态、记录审计、生成 receipt 时使用 |
| 定义方 | `crates/application/src/ports/clock.rs` | 定义时间端口 |
| 实现方 | `crates/infra/src/adapters/clock.rs` | 提供系统时间或测试时间 |

###### 不变量与禁止事项

- domain factory 接收 `Timestamp`,不得自行读取系统时间。
- 测试实现必须可控,以支持确定性测试。
- `ClockPort` 不表达业务时区和展示格式。

#### 9.2.3 `IdGeneratorPort`

###### Trait 定义

```rust
/// 稳定编号生成端口,为契约定义、基线、快照、事实、索引和回执生成 ID。
pub trait IdGeneratorPort {
    /// 生成契约定义 ID。
    fn new_contract_definition_id(&self) -> ContractDefinitionId;

    /// 生成发布基线 ID。
    fn new_contract_release_baseline_id(&self) -> ContractReleaseBaselineId;

    /// 生成发布快照 ID。
    fn new_contract_release_snapshot_id(&self) -> ContractReleaseSnapshotId;

    /// 生成事实记录 ID。
    fn new_contract_fact_record_id(&self) -> ContractFactRecordId;

    /// 生成回执 ID。
    fn new_receipt_id(&self) -> ReceiptId;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `fn new_contract_definition_id(&self) -> ContractDefinitionId` | 生成契约定义 ID | 无 | `ContractDefinitionId` | 无;实现方必须保证唯一性 |
| `fn new_contract_release_baseline_id(&self) -> ContractReleaseBaselineId` | 生成发布基线 ID | 无 | `ContractReleaseBaselineId` | 无 |
| `fn new_contract_release_snapshot_id(&self) -> ContractReleaseSnapshotId` | 生成发布快照 ID | 无 | `ContractReleaseSnapshotId` | 无 |
| `fn new_contract_fact_record_id(&self) -> ContractFactRecordId` | 生成事实记录 ID | 无 | `ContractFactRecordId` | 无 |
| `fn new_receipt_id(&self) -> ReceiptId` | 生成回执 ID | 无 | `ReceiptId` | 无 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ContractChangeService`、`ContractReleaseService`、`ContractSnapshotService`、`ContractFactService`、`ContractOperationsService` | 创建新对象或 receipt 前生成 ID |
| 定义方 | `crates/application/src/ports/id_generator.rs` | 定义 ID 生成端口 |
| 实现方 | `crates/infra/src/adapters/id_generator.rs` | 可使用 UUID、ULID 或后续统一 ID 方案 |

###### 不变量与禁止事项

- domain 对象不得自行生成 ID。
- ID 生成策略必须稳定且可测试。
- 具体 ID 编码格式不在 Step 7 锁死,可在实现约束或后续编码规范中固定。

### 9.3 核心 repository port

本节定义核心 repository port。本批补齐 `ContractDefinitionRepository`、`ContractBaselineRepository`、`SnapshotRepository`、`ContractFactRepository` 和 `ReferenceRepository`。

| Port | 状态 | 说明 |
|---|---|---|
| `ContractDefinitionRepository` | 已补齐 | 读写契约定义真相 |
| `ContractBaselineRepository` | 已补齐 | 读写发布基线 |
| `SnapshotRepository` | 已补齐 | 读写发布快照和快照引用 |
| `ContractFactRepository` | 已补齐 | 读写契约事实记录 |
| `ReferenceRepository` | 已补齐 | 读写外部引用、标准映射和局部投影 |

#### 9.3.1 `ContractDefinitionRepository`

###### Trait 定义

```rust
/// 契约定义真相 repository port。
///
/// 该 port 只读写真相聚合,不负责发布事件、不执行门禁、不解析外部引用。
pub trait ContractDefinitionRepository {
    /// 根据定义 ID 读取契约定义。
    async fn get(
        &self,
        definition_id: ContractDefinitionId,
    ) -> Result<Option<ContractDefinition>, PortError>;

    /// 根据定义 ID 读取并准备写入契约定义。
    async fn get_for_update(
        &self,
        definition_id: ContractDefinitionId,
    ) -> Result<Option<ContractDefinition>, PortError>;

    /// 插入新的契约定义。
    async fn insert(
        &self,
        definition: ContractDefinition,
    ) -> Result<(), PortError>;

    /// 保存已有契约定义,并校验期望聚合版本。
    async fn save(
        &self,
        definition: ContractDefinition,
        expected_version: Version,
    ) -> Result<(), PortError>;

    /// 按查询条件列出契约定义只读摘要。
    async fn list(
        &self,
        query: ContractDefinitionQuery,
        page: PageRequest,
    ) -> Result<ContractDefinitionListPage, PortError>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `async fn get(&self, definition_id: ContractDefinitionId) -> Result<Option<ContractDefinition>, PortError>` | 读取定义 | `definition_id` 是定义 ID | `Result<Option<ContractDefinition>, PortError>` | `PortError` 表示存储读取失败 |
| `async fn get_for_update(&self, definition_id: ContractDefinitionId) -> Result<Option<ContractDefinition>, PortError>` | 读取并准备写入 | `definition_id` 是定义 ID | `Result<Option<ContractDefinition>, PortError>` | `PortError` 表示锁或读取失败 |
| `async fn insert(&self, definition: ContractDefinition) -> Result<(), PortError>` | 插入新定义 | `definition` 是新聚合 | `Result<(), PortError>` | `PortError` 表示唯一键冲突或写入失败 |
| `async fn save(&self, definition: ContractDefinition, expected_version: Version) -> Result<(), PortError>` | 保存已有定义 | `definition` 是聚合;`expected_version` 是乐观锁版本 | `Result<(), PortError>` | `PortError` 表示版本冲突或写入失败 |
| `async fn list(&self, query: ContractDefinitionQuery, page: PageRequest) -> Result<ContractDefinitionListPage, PortError>` | 列表查询 | `query` 是查询条件;`page` 是分页参数 | `Result<ContractDefinitionListPage, PortError>` | `PortError` 表示读取失败 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ContractChangeService`、`ContractReleaseService`、`ContractCompatibilityService`、`ContractTraceService`、`ContractOperationsService` | 创建、更新、发布、校验、查询和重建时读取定义 |
| 定义方 | `crates/application/src/ports/definition_repository.rs` | 定义 repository trait |
| 实现方 | `crates/infra/src/source_store/*` 或后续 persistence adapter | 负责从契约源码 / 持久化层读写真相 |

###### 不变量与禁止事项

- repository 不执行领域状态迁移,状态迁移必须由 `ContractDefinition` 完成。
- repository 不发布 outbox event。
- `save` 必须校验 `expected_version`。
- `get_for_update` 的锁语义和隔离级别留给 Step 11 固定。

#### 9.3.2 `ContractBaselineRepository`

###### Trait 定义

```rust
/// 发布基线 repository port。
///
/// 该 port 读写发布基线,不负责快照导出、不负责兼容性工具链执行。
pub trait ContractBaselineRepository {
    /// 根据基线 ID 读取发布基线。
    async fn get(
        &self,
        baseline_id: ContractReleaseBaselineId,
    ) -> Result<Option<ContractReleaseBaseline>, PortError>;

    /// 根据契约定义 ID 读取当前发布基线。
    async fn get_current_by_definition(
        &self,
        definition_id: ContractDefinitionId,
    ) -> Result<Option<ContractReleaseBaseline>, PortError>;

    /// 插入新的发布基线。
    async fn insert(
        &self,
        baseline: ContractReleaseBaseline,
    ) -> Result<(), PortError>;

    /// 保存发布基线,并校验期望版本。
    async fn save(
        &self,
        baseline: ContractReleaseBaseline,
        expected_version: Version,
    ) -> Result<(), PortError>;

    /// 按契约定义列出历史发布基线。
    async fn list_by_definition(
        &self,
        definition_id: ContractDefinitionId,
    ) -> Result<Vec<ContractReleaseBaseline>, PortError>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `async fn get(&self, baseline_id: ContractReleaseBaselineId) -> Result<Option<ContractReleaseBaseline>, PortError>` | 读取发布基线 | `baseline_id` 是基线 ID | `Result<Option<ContractReleaseBaseline>, PortError>` | `PortError` 表示读取失败 |
| `async fn get_current_by_definition(&self, definition_id: ContractDefinitionId) -> Result<Option<ContractReleaseBaseline>, PortError>` | 读取定义当前基线 | `definition_id` 是定义 ID | `Result<Option<ContractReleaseBaseline>, PortError>` | `PortError` 表示读取失败 |
| `async fn insert(&self, baseline: ContractReleaseBaseline) -> Result<(), PortError>` | 插入新基线 | `baseline` 是发布基线 | `Result<(), PortError>` | `PortError` 表示唯一键冲突或写入失败 |
| `async fn save(&self, baseline: ContractReleaseBaseline, expected_version: Version) -> Result<(), PortError>` | 保存基线 | `baseline` 是发布基线;`expected_version` 是乐观锁版本 | `Result<(), PortError>` | `PortError` 表示版本冲突或写入失败 |
| `async fn list_by_definition(&self, definition_id: ContractDefinitionId) -> Result<Vec<ContractReleaseBaseline>, PortError>` | 列出历史基线 | `definition_id` 是定义 ID | `Result<Vec<ContractReleaseBaseline>, PortError>` | `PortError` 表示读取失败 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ContractReleaseService`、`ContractSnapshotService`、`ContractTraceService`、`ContractOperationsService` | 发布、快照派生、追溯和重建时读取基线 |
| 定义方 | `crates/application/src/ports/baseline_repository.rs` | 定义 repository trait |
| 实现方 | `core_infra` baseline persistence adapter | 负责发布基线持久化 |

###### 不变量与禁止事项

- 发布基线的创建和状态迁移由 domain / application 完成,repository 只保存结果。
- `get_current_by_definition` 不得返回 retired / superseded 基线作为当前基线。
- `save` 必须校验 `expected_version`。
- repository 不导出快照正文。

#### 9.3.3 `SnapshotRepository`

###### Trait 定义

```rust
/// 发布快照 repository port。
///
/// 该 port 管理快照元数据和快照引用,不负责 blob 正文读写和快照导出工具链执行。
pub trait SnapshotRepository {
    /// 根据快照 ID 读取发布快照。
    async fn get(
        &self,
        snapshot_id: ContractReleaseSnapshotId,
    ) -> Result<Option<ContractReleaseSnapshot>, PortError>;

    /// 根据发布基线读取当前快照。
    async fn get_by_baseline(
        &self,
        baseline_id: ContractReleaseBaselineId,
    ) -> Result<Option<ContractReleaseSnapshot>, PortError>;

    /// 插入新的发布快照。
    async fn insert(
        &self,
        snapshot: ContractReleaseSnapshot,
    ) -> Result<(), PortError>;

    /// 保存发布快照,并校验期望版本。
    async fn save(
        &self,
        snapshot: ContractReleaseSnapshot,
        expected_version: Version,
    ) -> Result<(), PortError>;

    /// 列出下游消费引用。
    async fn list_consumption_refs(
        &self,
        baseline_id: ContractReleaseBaselineId,
    ) -> Result<Vec<DownstreamConsumptionRef>, PortError>;

    /// 插入新的下游消费引用。
    async fn insert_consumption_ref(
        &self,
        reference: DownstreamConsumptionRef,
    ) -> Result<(), PortError>;

    /// 保存下游消费引用,并校验期望版本。
    async fn save_consumption_ref(
        &self,
        reference: DownstreamConsumptionRef,
        expected_version: Version,
    ) -> Result<(), PortError>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `async fn get(&self, snapshot_id: ContractReleaseSnapshotId) -> Result<Option<ContractReleaseSnapshot>, PortError>` | 读取快照 | `snapshot_id` 是快照 ID | `Result<Option<ContractReleaseSnapshot>, PortError>` | `PortError` 表示读取失败 |
| `async fn get_by_baseline(&self, baseline_id: ContractReleaseBaselineId) -> Result<Option<ContractReleaseSnapshot>, PortError>` | 按基线读取快照 | `baseline_id` 是基线 ID | `Result<Option<ContractReleaseSnapshot>, PortError>` | `PortError` 表示读取失败 |
| `async fn insert(&self, snapshot: ContractReleaseSnapshot) -> Result<(), PortError>` | 插入快照 | `snapshot` 是快照对象 | `Result<(), PortError>` | `PortError` 表示写入失败 |
| `async fn save(&self, snapshot: ContractReleaseSnapshot, expected_version: Version) -> Result<(), PortError>` | 保存快照 | `snapshot` 是快照对象;`expected_version` 是乐观锁版本 | `Result<(), PortError>` | `PortError` 表示版本冲突或写入失败 |
| `async fn list_consumption_refs(&self, baseline_id: ContractReleaseBaselineId) -> Result<Vec<DownstreamConsumptionRef>, PortError>` | 列出消费引用 | `baseline_id` 是基线 ID | `Result<Vec<DownstreamConsumptionRef>, PortError>` | `PortError` 表示读取失败 |
| `async fn insert_consumption_ref(&self, reference: DownstreamConsumptionRef) -> Result<(), PortError>` | 插入消费引用 | `reference` 是下游消费引用 | `Result<(), PortError>` | `PortError` 表示唯一键冲突或写入失败 |
| `async fn save_consumption_ref(&self, reference: DownstreamConsumptionRef, expected_version: Version) -> Result<(), PortError>` | 保存消费引用 | `reference` 是下游消费引用;`expected_version` 是乐观锁版本 | `Result<(), PortError>` | `PortError` 表示版本冲突或写入失败 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ContractSnapshotService`、`ContractTraceService`、`ContractOperationsService` | 快照派生、查询、追溯和重建时使用 |
| 定义方 | `crates/application/src/ports/snapshot_repository.rs` | 定义 snapshot repository trait |
| 实现方 | `crates/infra/src/snapshot_store/*` | 负责快照元数据和引用持久化 |

###### 不变量与禁止事项

- `SnapshotRepository` 不读写 blob 正文。
- 快照导出由 snapshot exporter port 负责。
- `save` 必须校验 `expected_version`。
- `save_consumption_ref` 必须校验 `expected_version` 或等效状态版本。
- 快照不得反向改写发布基线或契约定义。

#### 9.3.4 `ContractFactRepository`

###### Trait 定义

```rust
/// 契约事实记录 repository port。
///
/// 该 port 管理可追溯事实记录,不负责投递事件;事件投递由 `OutboxPort` 和 `EventPublisherPort` 承担。
pub trait ContractFactRepository {
    /// 拉取待输出事实记录。
    async fn get_pending(
        &self,
        batch_size: BatchSize,
    ) -> Result<Vec<ContractFactRecord>, PortError>;

    /// 插入新的事实记录。
    async fn insert(
        &self,
        fact: ContractFactRecord,
    ) -> Result<(), PortError>;

    /// 保存事实记录,并校验期望版本。
    async fn save(
        &self,
        fact: ContractFactRecord,
        expected_version: Version,
    ) -> Result<(), PortError>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `async fn get_pending(&self, batch_size: BatchSize) -> Result<Vec<ContractFactRecord>, PortError>` | 拉取待输出事实 | `batch_size` 是批大小 | `Result<Vec<ContractFactRecord>, PortError>` | `PortError` 表示读取失败 |
| `async fn insert(&self, fact: ContractFactRecord) -> Result<(), PortError>` | 插入事实记录 | `fact` 是事实记录 | `Result<(), PortError>` | `PortError` 表示唯一键冲突或写入失败 |
| `async fn save(&self, fact: ContractFactRecord, expected_version: Version) -> Result<(), PortError>` | 保存事实记录 | `fact` 是事实记录;`expected_version` 是乐观锁版本 | `Result<(), PortError>` | `PortError` 表示版本冲突或写入失败 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ContractFactService`、`ContractOperationsService`、`OutboxRelayWorker` | 事实创建、事实状态更新、事实发布整理和恢复时使用 |
| 定义方 | `crates/application/src/ports/fact_repository.rs` | 定义 fact repository trait |
| 实现方 | `crates/infra/src/outbox_store/*` 或独立 fact store adapter | 负责事实记录持久化 |

###### 不变量与禁止事项

- `ContractFactRepository` 不发布事件。
- 事实记录和 outbox 事件职责不同:事实记录服务追溯,outbox 服务传播。
- `save` 必须校验 `expected_version`。
- 事实失败记录不得被删除,只能通过状态迁移或归档表达。

#### 9.3.5 `ReferenceRepository`

###### Trait 定义

```rust
/// 引用和投影 repository port。
///
/// 该 port 管理外部引用、标准映射、事件目录引用和局部查询投影。
pub trait ReferenceRepository {
    /// 保存外部引用。
    async fn save_external_reference(
        &self,
        reference: ExternalReference,
    ) -> Result<(), PortError>;

    /// 根据引用 ID 读取外部引用。
    async fn get_external_reference(
        &self,
        reference_id: ExternalReferenceId,
    ) -> Result<Option<ExternalReference>, PortError>;

    /// 保存标准映射索引。
    async fn save_standard_mapping(
        &self,
        index: StandardMappingIndex,
    ) -> Result<(), PortError>;

    /// 保存事件目录引用。
    async fn save_event_catalog_reference(
        &self,
        reference: EventCatalogReference,
    ) -> Result<(), PortError>;

    /// 保存契约只读模型。
    async fn save_read_model(
        &self,
        read_model: ContractReadModel,
    ) -> Result<(), PortError>;

    /// 保存契约追溯投影。
    async fn save_trace_projection(
        &self,
        projection: ContractTraceProjection,
    ) -> Result<(), PortError>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `async fn save_external_reference(&self, reference: ExternalReference) -> Result<(), PortError>` | 保存外部引用 | `reference` 是外部引用对象 | `Result<(), PortError>` | `PortError` 表示写入失败 |
| `async fn get_external_reference(&self, reference_id: ExternalReferenceId) -> Result<Option<ExternalReference>, PortError>` | 读取外部引用 | `reference_id` 是引用 ID | `Result<Option<ExternalReference>, PortError>` | `PortError` 表示读取失败 |
| `async fn save_standard_mapping(&self, index: StandardMappingIndex) -> Result<(), PortError>` | 保存标准映射 | `index` 是标准映射索引 | `Result<(), PortError>` | `PortError` 表示写入失败 |
| `async fn save_event_catalog_reference(&self, reference: EventCatalogReference) -> Result<(), PortError>` | 保存事件目录引用 | `reference` 是事件目录引用 | `Result<(), PortError>` | `PortError` 表示写入失败 |
| `async fn save_read_model(&self, read_model: ContractReadModel) -> Result<(), PortError>` | 保存只读模型 | `read_model` 是查询投影 | `Result<(), PortError>` | `PortError` 表示写入失败 |
| `async fn save_trace_projection(&self, projection: ContractTraceProjection) -> Result<(), PortError>` | 保存追溯投影 | `projection` 是追溯投影 | `Result<(), PortError>` | `PortError` 表示写入失败 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ContractTraceService`、`ContractCompatibilityService`、`ContractOperationsService` | 查询、兼容追溯、投影重建时使用 |
| 定义方 | `crates/application/src/ports/reference_repository.rs` | 定义 reference / projection repository trait |
| 实现方 | `crates/infra/src/projection_store/*` | 负责引用和投影持久化 |

###### 不变量与禁止事项

- `ReferenceRepository` 不解析外部引用,只保存解析结果或引用对象。
- projection 保存不能反向改写 `ContractDefinition`。
- 外部引用只能保存 URI 和元数据,不能保存外部正文。
- 复杂查询方法可在 Step 8 / Step 9 根据 Query 协议继续补充。

### 9.4 审计、outbox 与事件发布 port

本节定义审计、outbox 和事件发布边界。`AuditLogPort` 和 `OutboxPort` 服务 application 写路径;`EventPublisherPort` 服务 outbox relay 或 operations job,只负责把已提交事实交给 `L0-bus` 边界,不实现 bus runtime。

#### 9.4.1 `AuditLogPort`

###### Trait 定义

```rust
/// 审计日志端口,用于记录命令、状态迁移、发布、快照、运维和恢复动作。
pub trait AuditLogPort {
    /// 追加一条审计记录。
    async fn append(
        &self,
        record: AuditRecord,
    ) -> Result<(), PortError>;

    /// 按资源引用读取审计记录。
    async fn list_by_resource(
        &self,
        resource_ref: ResourceRef,
        page: PageRequest,
    ) -> Result<AuditRecordPage, PortError>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `async fn append(&self, record: AuditRecord) -> Result<(), PortError>` | 追加审计记录 | `record` 是审计记录 | `Result<(), PortError>` | `PortError` 表示写入失败 |
| `async fn list_by_resource(&self, resource_ref: ResourceRef, page: PageRequest) -> Result<AuditRecordPage, PortError>` | 按资源读取审计 | `resource_ref` 是资源引用;`page` 是分页 | `Result<AuditRecordPage, PortError>` | `PortError` 表示读取失败 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | 所有写路径 application service、operations service | 写入关键动作审计 |
| 定义方 | `crates/application/src/ports/audit_log.rs` | 定义审计端口 |
| 实现方 | `core_infra` audit adapter | 可基于文件、数据库或后续审计系统实现 |

###### 不变量与禁止事项

- 审计记录不得保存凭据、token 或外部正文。
- 写路径失败时审计与真相写入的一致性由 `UnitOfWork` 和 Step 11 固定。
- 审计查询不改写真相。

#### 9.4.2 `OutboxPort`

###### Trait 定义

```rust
/// Outbox 端口,用于持久化待发布的契约事实事件。
///
/// 该 port 不负责投递到 L0-bus,只负责保存、读取和更新 outbox 记录。
pub trait OutboxPort {
    /// 追加待发布事实事件。
    async fn append(
        &self,
        event: FactOutboxEvent,
    ) -> Result<(), PortError>;

    /// 拉取一批待发布事件。
    async fn fetch_pending(
        &self,
        batch_size: BatchSize,
    ) -> Result<Vec<FactOutboxEvent>, PortError>;

    /// 标记事件已发布。
    async fn mark_published(
        &self,
        event_id: OutboxEventId,
        published_at: Timestamp,
    ) -> Result<(), PortError>;

    /// 标记事件发布失败。
    async fn mark_failed(
        &self,
        event_id: OutboxEventId,
        reason: OutboxFailureReason,
        failed_at: Timestamp,
    ) -> Result<(), PortError>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `async fn append(&self, event: FactOutboxEvent) -> Result<(), PortError>` | 写入待发布事件 | `event` 是 outbox 事件 | `Result<(), PortError>` | `PortError` 表示写入失败 |
| `async fn fetch_pending(&self, batch_size: BatchSize) -> Result<Vec<FactOutboxEvent>, PortError>` | 拉取待发布事件 | `batch_size` 是批大小 | `Result<Vec<FactOutboxEvent>, PortError>` | `PortError` 表示读取失败 |
| `async fn mark_published(&self, event_id: OutboxEventId, published_at: Timestamp) -> Result<(), PortError>` | 标记已发布 | `event_id` 是事件 ID;`published_at` 是发布时间 | `Result<(), PortError>` | `PortError` 表示更新失败 |
| `async fn mark_failed(&self, event_id: OutboxEventId, reason: OutboxFailureReason, failed_at: Timestamp) -> Result<(), PortError>` | 标记发布失败 | `event_id` 是事件 ID;`reason` 是失败原因;`failed_at` 是失败时间 | `Result<(), PortError>` | `PortError` 表示更新失败 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ContractFactService`、`ContractOperationsService`、`OutboxRelayWorker` | 写入事实事件、拉取待发布事件、更新发布状态 |
| 定义方 | `crates/application/src/ports/outbox.rs` | 定义 outbox 端口 |
| 实现方 | `crates/infra/src/outbox_store/*` | 负责 outbox 持久化 |

###### 不变量与禁止事项

- `OutboxPort` 不直接调用 L0-bus。
- outbox event 只能来自已提交事实,不能凭空构造业务真相。
- ack、retry、dead-letter 的运行策略不在本 port 中实现,后续由 job / operations 流程定义。

#### 9.4.3 `EventPublisherPort`

###### Trait 定义

```rust
/// 事件发布端口,用于把已提交 outbox 事实交给 L0-bus 边界。
///
/// 该 port 只表达发布边界,不实现 L0-bus runtime、ack、retry 或 dead-letter。
pub trait EventPublisherPort {
    /// 发布一个契约事实事件。
    async fn publish(
        &self,
        event: FactOutboxEvent,
    ) -> Result<EventPublishReceipt, PortError>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `async fn publish(&self, event: FactOutboxEvent) -> Result<EventPublishReceipt, PortError>` | 发布事实事件 | `event` 是已提交 outbox 事件 | `Result<EventPublishReceipt, PortError>` | `PortError` 表示发布边界失败 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `OutboxRelayWorker`、`ContractOperationsService` | 从 outbox 取出事实后调用发布边界 |
| 定义方 | `crates/application/src/ports/event_publisher.rs` | 定义发布端口 |
| 实现方 | `crates/infra/src/adapters/event_publisher.rs` | 适配 L0-bus 边界 |

###### 不变量与禁止事项

- `EventPublisherPort` 不拥有事实真相。
- 事件发布失败不能删除 outbox 记录。
- L0-bus 的 topic、ack、retry、dead-letter 策略不在本 trait 中定义,留给 Step 8 / Step 9 / 相邻仓契约。

### 9.5 外部校验与引用解析 port

本节定义门禁、外部引用解析和 blob 引用校验端口。它们只返回引用或校验结果,不得把外部正文吸收到 L0-core 真相层。

#### 9.5.1 `GateDecisionPort`

###### Trait 定义

```rust
/// 门禁决策端口,用于读取和校验 approved gate 引用。
///
/// 该 port 不执行治理流程,只校验外部治理边界已经形成的门禁结果。
pub trait GateDecisionPort {
    /// 根据门禁引用读取门禁决策。
    async fn get_decision(
        &self,
        gate_ref: ApprovedGateRef,
    ) -> Result<Option<GateDecision>, PortError>;

    /// 校验门禁引用是否允许发布。
    async fn ensure_approved(
        &self,
        gate_ref: ApprovedGateRef,
        actor: ActorContext,
    ) -> Result<GateDecision, PortError>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `async fn get_decision(&self, gate_ref: ApprovedGateRef) -> Result<Option<GateDecision>, PortError>` | 读取门禁结果 | `gate_ref` 是门禁引用 | `Result<Option<GateDecision>, PortError>` | `PortError` 表示读取失败 |
| `async fn ensure_approved(&self, gate_ref: ApprovedGateRef, actor: ActorContext) -> Result<GateDecision, PortError>` | 校验门禁已通过 | `gate_ref` 是门禁引用;`actor` 是操作者 | `Result<GateDecision, PortError>` | `PortError` 表示未通过、不可用或读取失败 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ContractReleaseService`、`ContractCompatibilityService` | 发布基线和兼容检查前校验 gate |
| 定义方 | `crates/application/src/ports/gate_decision.rs` | 定义门禁端口 |
| 实现方 | `crates/infra/src/adapters/gate_decision.rs` | 适配治理或门禁引用来源 |

###### 不变量与禁止事项

- `GateDecisionPort` 不实现治理审批流程。
- 发布服务只能引用 approved gate,不能自己伪造通过结果。
- 门禁正文或审批正文不进入 L0-core 真相层。

#### 9.5.2 `ReferenceResolverPort`

###### Trait 定义

```rust
/// 外部引用解析端口,用于确认标准、ADR、评审、事件目录等引用是否存在和可用。
///
/// 该 port 只返回解析结果,不复制外部正文。
pub trait ReferenceResolverPort {
    /// 解析外部引用。
    async fn resolve_external_reference(
        &self,
        reference: ExternalReference,
    ) -> Result<ReferenceResolveResult, PortError>;

    /// 解析事件目录引用。
    async fn resolve_event_catalog(
        &self,
        catalog_ref: EventCatalogRef,
    ) -> Result<EventCatalogResolveResult, PortError>;

    /// 检查引用是否仍可访问。
    async fn check_availability(
        &self,
        uri: ExternalUri,
    ) -> Result<ReferenceAvailability, PortError>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `async fn resolve_external_reference(&self, reference: ExternalReference) -> Result<ReferenceResolveResult, PortError>` | 解析外部引用 | `reference` 是外部引用对象 | `Result<ReferenceResolveResult, PortError>` | `PortError` 表示解析失败 |
| `async fn resolve_event_catalog(&self, catalog_ref: EventCatalogRef) -> Result<EventCatalogResolveResult, PortError>` | 解析事件目录引用 | `catalog_ref` 是事件目录引用 | `Result<EventCatalogResolveResult, PortError>` | `PortError` 表示解析失败 |
| `async fn check_availability(&self, uri: ExternalUri) -> Result<ReferenceAvailability, PortError>` | 检查 URI 可用性 | `uri` 是外部 URI | `Result<ReferenceAvailability, PortError>` | `PortError` 表示检查失败 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ContractCompatibilityService`、`ContractTraceService`、`ContractOperationsService` | 兼容检查、追溯刷新、引用重建时使用 |
| 定义方 | `crates/application/src/ports/reference_resolver.rs` | 定义引用解析端口 |
| 实现方 | `crates/infra/src/adapters/reference_resolver.rs` | 适配本地文件、标准索引、事件目录或后续外部系统 |

###### 不变量与禁止事项

- resolver 不返回外部正文,只返回可用性、标题、版本、hash 或引用元数据。
- resolver 不决定引用是否允许发布;发布规则由 `ReferenceValidationPolicy` 判断。
- 网络、文件或外部系统错误必须映射为 `PortError`。

#### 9.5.3 `BlobRefPort`

###### Trait 定义

```rust
/// Blob 引用校验端口,用于确认契约正文、快照正文或事实 payload 引用是否存在且可读取。
///
/// 该 port 不读取或返回 blob 正文,只返回引用校验结果。
pub trait BlobRefPort {
    /// 校验契约正文引用。
    async fn validate_contract_body_ref(
        &self,
        body_ref: ContractBodyRef,
    ) -> Result<BlobRefValidation, PortError>;

    /// 校验快照正文引用。
    async fn validate_snapshot_blob_ref(
        &self,
        blob_ref: SnapshotBlobRef,
    ) -> Result<BlobRefValidation, PortError>;

    /// 校验事实 payload 引用。
    async fn validate_fact_payload_ref(
        &self,
        payload_ref: FactPayloadRef,
    ) -> Result<BlobRefValidation, PortError>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `async fn validate_contract_body_ref(&self, body_ref: ContractBodyRef) -> Result<BlobRefValidation, PortError>` | 校验契约正文引用 | `body_ref` 是契约正文引用 | `Result<BlobRefValidation, PortError>` | `PortError` 表示校验失败 |
| `async fn validate_snapshot_blob_ref(&self, blob_ref: SnapshotBlobRef) -> Result<BlobRefValidation, PortError>` | 校验快照正文引用 | `blob_ref` 是快照正文引用 | `Result<BlobRefValidation, PortError>` | `PortError` 表示校验失败 |
| `async fn validate_fact_payload_ref(&self, payload_ref: FactPayloadRef) -> Result<BlobRefValidation, PortError>` | 校验事实 payload 引用 | `payload_ref` 是事实 payload 引用 | `Result<BlobRefValidation, PortError>` | `PortError` 表示校验失败 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ContractChangeService`、`ContractSnapshotService`、`ContractFactService` | 保存正文引用、派生快照、生成事实前校验引用 |
| 定义方 | `crates/application/src/ports/blob_ref.rs` | 定义 blob 引用校验端口 |
| 实现方 | `crates/infra/src/adapters/blob_ref.rs` | 适配对象存储、本地文件或后续 blob provider |

###### 不变量与禁止事项

- `BlobRefPort` 不返回 blob 正文。
- blob 正文不进入 L0-core domain object。
- 校验结果只证明引用可用,不代表业务兼容或发布通过。

### 9.6 工具链与 projection / source adapter 契约

本节定义源码资产、发布快照资产、查询投影和工具链执行的 port。它们都放在 `application_ports`,由 `infra_adapters` 实现。

本节的边界原则:

- source store 只处理 `contract-source/` 结构化资产,不替代 `ContractDefinitionRepository` 的聚合真相读写。
- snapshot store 只处理 `release-snapshots/` 资产和 manifest,不替代 `SnapshotRepository` 的快照元数据读写。
- projection store 只处理查询投影、索引水位和批量重建,不得反向改写真相聚合。
- toolchain runner 只执行校验、fingerprint 和 snapshot export,不得直接保存领域对象或发布事件。

#### 9.6.1 `ContractSourceStorePort`

###### Trait 定义

```rust
/// 契约源码资产端口,用于读取、写入和枚举 contract-source 下的结构化契约源码。
///
/// 该 port 只处理源码资产和源码引用,不负责领域状态迁移、不发布事件。
pub trait ContractSourceStorePort {
    /// 读取契约定义源码文档。
    async fn read_definition_source(
        &self,
        source_ref: ContractSourceRef,
    ) -> Result<ContractSourceDocument, PortError>;

    /// 写入契约定义源码文档,并可选校验期望指纹。
    async fn write_definition_source(
        &self,
        document: ContractSourceDocument,
        expected_fingerprint: Option<ContractFingerprint>,
    ) -> Result<ContractSourceWriteReceipt, PortError>;

    /// 读取契约包源码文档。
    async fn read_package_source(
        &self,
        source_ref: ContractPackageSourceRef,
    ) -> Result<ContractPackageSourceDocument, PortError>;

    /// 按条件枚举契约源码引用。
    async fn list_source_refs(
        &self,
        query: ContractSourceQuery,
        page: PageRequest,
    ) -> Result<ContractSourceRefPage, PortError>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `async fn read_definition_source(&self, source_ref: ContractSourceRef) -> Result<ContractSourceDocument, PortError>` | 读取定义源码 | `source_ref` 是源码逻辑引用 | `Result<ContractSourceDocument, PortError>` | `PortError` 表示读取、解析或引用不存在 |
| `async fn write_definition_source(&self, document: ContractSourceDocument, expected_fingerprint: Option<ContractFingerprint>) -> Result<ContractSourceWriteReceipt, PortError>` | 写入定义源码 | `document` 是源码文档;`expected_fingerprint` 是可选并发校验指纹 | `Result<ContractSourceWriteReceipt, PortError>` | `PortError` 表示写入失败或指纹冲突 |
| `async fn read_package_source(&self, source_ref: ContractPackageSourceRef) -> Result<ContractPackageSourceDocument, PortError>` | 读取包源码 | `source_ref` 是包源码引用 | `Result<ContractPackageSourceDocument, PortError>` | `PortError` 表示读取、解析或引用不存在 |
| `async fn list_source_refs(&self, query: ContractSourceQuery, page: PageRequest) -> Result<ContractSourceRefPage, PortError>` | 枚举源码引用 | `query` 是筛选条件;`page` 是分页参数 | `Result<ContractSourceRefPage, PortError>` | `PortError` 表示枚举失败 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ContractOperationsService`、`ValidateContractChangeJob`、`RebuildContractIndexJob` | seed、校验和索引重建时读取源码资产 |
| 定义方 | `crates/application/src/ports/source_store.rs` | 定义源码资产端口 |
| 实现方 | `crates/infra/src/source_store/filesystem.rs` | 基于 `contract-source/` 目录实现源码读写 |

###### 不变量与禁止事项

- 不允许 source store 直接迁移 `ContractDefinition` 生命周期。
- 不允许 source store 直接写 outbox 或审计。
- 读取源码正文只服务校验、导入或重建流程,不能成为查询接口的长期真相返回。

#### 9.6.2 `ReleaseSnapshotStorePort`

###### Trait 定义

```rust
/// 发布快照资产端口,用于写入、读取和校验 release-snapshots 下的只读快照资产。
pub trait ReleaseSnapshotStorePort {
    /// 写入发布快照文档。
    async fn write_snapshot_document(
        &self,
        document: ReleaseSnapshotDocument,
        expected_fingerprint: ContractFingerprint,
    ) -> Result<ReleaseSnapshotWriteReceipt, PortError>;

    /// 读取发布快照 manifest。
    async fn read_snapshot_manifest(
        &self,
        snapshot_ref: ReleaseSnapshotRef,
    ) -> Result<ReleaseSnapshotManifest, PortError>;

    /// 检查发布快照资产是否存在且指纹匹配。
    async fn verify_snapshot_asset(
        &self,
        snapshot_ref: ReleaseSnapshotRef,
        expected_fingerprint: ContractFingerprint,
    ) -> Result<ReleaseSnapshotAssetVerification, PortError>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `async fn write_snapshot_document(&self, document: ReleaseSnapshotDocument, expected_fingerprint: ContractFingerprint) -> Result<ReleaseSnapshotWriteReceipt, PortError>` | 写入快照资产 | `document` 是快照文档;`expected_fingerprint` 是预期指纹 | `Result<ReleaseSnapshotWriteReceipt, PortError>` | `PortError` 表示写入失败或指纹不一致 |
| `async fn read_snapshot_manifest(&self, snapshot_ref: ReleaseSnapshotRef) -> Result<ReleaseSnapshotManifest, PortError>` | 读取快照 manifest | `snapshot_ref` 是快照引用 | `Result<ReleaseSnapshotManifest, PortError>` | `PortError` 表示读取失败 |
| `async fn verify_snapshot_asset(&self, snapshot_ref: ReleaseSnapshotRef, expected_fingerprint: ContractFingerprint) -> Result<ReleaseSnapshotAssetVerification, PortError>` | 校验快照资产 | `snapshot_ref` 是快照引用;`expected_fingerprint` 是预期指纹 | `Result<ReleaseSnapshotAssetVerification, PortError>` | `PortError` 表示校验失败 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ContractSnapshotService`、`DeriveReleaseSnapshotJob`、`ContractOperationsService` | 快照导出、快照校验和恢复时使用 |
| 定义方 | `crates/application/src/ports/snapshot_store.rs` | 定义快照资产端口 |
| 实现方 | `crates/infra/src/snapshot_store/filesystem.rs` | 基于 `release-snapshots/` 目录实现只读快照资产存取 |

###### 不变量与禁止事项

- snapshot store 不创建发布基线,也不修改 `ContractReleaseSnapshot` 元数据。
- 快照资产写入后应按只读语义处理;覆盖策略留给 Step 11 固定。
- snapshot store 不向下游仓推送 SDK 或制品包。

#### 9.6.3 `ProjectionStorePort`

###### Trait 定义

```rust
/// 查询投影端口,用于查询视图、追溯投影和索引重建水位的持久化。
///
/// 该 port 只维护 projection,不得反向改写契约定义、发布基线或快照真相。
pub trait ProjectionStorePort {
    /// 批量替换契约只读模型。
    async fn replace_read_models(
        &self,
        batch: ContractReadModelBatch,
        rebuild_id: ProjectionRebuildId,
    ) -> Result<ProjectionWriteReceipt, PortError>;

    /// 批量替换追溯投影。
    async fn replace_trace_projections(
        &self,
        batch: ContractTraceProjectionBatch,
        rebuild_id: ProjectionRebuildId,
    ) -> Result<ProjectionWriteReceipt, PortError>;

    /// 读取投影重建水位。
    async fn get_watermark(
        &self,
        projection_name: ProjectionName,
    ) -> Result<Option<ProjectionWatermark>, PortError>;

    /// 标记某个投影为过期。
    async fn mark_stale(
        &self,
        projection_name: ProjectionName,
        reason: ProjectionStaleReason,
        marked_at: Timestamp,
    ) -> Result<(), PortError>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `async fn replace_read_models(&self, batch: ContractReadModelBatch, rebuild_id: ProjectionRebuildId) -> Result<ProjectionWriteReceipt, PortError>` | 批量替换只读模型 | `batch` 是只读模型批次;`rebuild_id` 是重建批次 ID | `Result<ProjectionWriteReceipt, PortError>` | `PortError` 表示写入失败 |
| `async fn replace_trace_projections(&self, batch: ContractTraceProjectionBatch, rebuild_id: ProjectionRebuildId) -> Result<ProjectionWriteReceipt, PortError>` | 批量替换追溯投影 | `batch` 是追溯投影批次;`rebuild_id` 是重建批次 ID | `Result<ProjectionWriteReceipt, PortError>` | `PortError` 表示写入失败 |
| `async fn get_watermark(&self, projection_name: ProjectionName) -> Result<Option<ProjectionWatermark>, PortError>` | 读取重建水位 | `projection_name` 是投影名称 | `Result<Option<ProjectionWatermark>, PortError>` | `PortError` 表示读取失败 |
| `async fn mark_stale(&self, projection_name: ProjectionName, reason: ProjectionStaleReason, marked_at: Timestamp) -> Result<(), PortError>` | 标记投影过期 | `projection_name` 是投影名称;`reason` 是过期原因;`marked_at` 是标记时间 | `Result<(), PortError>` | `PortError` 表示更新失败 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ContractTraceService`、`ContractOperationsService`、`RebuildContractIndexJob` | 查询、追溯和索引重建时使用 |
| 定义方 | `crates/application/src/ports/projection_store.rs` | 定义投影端口 |
| 实现方 | `crates/infra/src/projection_store/file_index.rs` | 基于文件索引实现 projection 存取 |

###### 不变量与禁止事项

- projection store 不是真相 repository。
- 重建 projection 不得修改 `ContractDefinition`、`ContractReleaseBaseline`、`ContractReleaseSnapshot`。
- `ReferenceRepository` 可保存引用类对象;`ProjectionStorePort` 专门承接查询投影批量重建和索引水位。

#### 9.6.4 `ContractValidationRunnerPort`

###### Trait 定义

```rust
/// 契约校验工具链端口,用于执行结构、引用和兼容性前置校验。
///
/// 该 port 只返回校验报告,不直接保存领域对象。
pub trait ContractValidationRunnerPort {
    /// 校验契约定义源码文档。
    async fn validate_definition_source(
        &self,
        request: ContractValidationRequest,
    ) -> Result<ContractValidationReport, PortError>;

    /// 校验契约包源码文档。
    async fn validate_package_source(
        &self,
        request: ContractPackageValidationRequest,
    ) -> Result<ContractValidationReport, PortError>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `async fn validate_definition_source(&self, request: ContractValidationRequest) -> Result<ContractValidationReport, PortError>` | 校验定义源码 | `request` 是校验请求 | `Result<ContractValidationReport, PortError>` | `PortError` 表示工具链执行失败 |
| `async fn validate_package_source(&self, request: ContractPackageValidationRequest) -> Result<ContractValidationReport, PortError>` | 校验包源码 | `request` 是包校验请求 | `Result<ContractValidationReport, PortError>` | `PortError` 表示工具链执行失败 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ContractCompatibilityService`、`ContractOperationsService`、`ValidateContractChangeJob` | 变更校验和后台校验时使用 |
| 定义方 | `crates/application/src/ports/validation_runner.rs` | 定义校验工具链端口 |
| 实现方 | `crates/infra/src/toolchain/validator.rs` | 适配本地校验工具或后续可替换工具链 |

###### 不变量与禁止事项

- 校验报告不是发布事实,必须由 application service 判断是否写入事实或审计。
- runner 不读取 gate,不发布 outbox。
- runner 返回的错误必须映射为 `PortError`,业务不通过应体现在 `ContractValidationReport`。

#### 9.6.5 `FingerprintRunnerPort`

###### Trait 定义

```rust
/// Fingerprint 工具链端口,用于计算 canonical 指纹和执行指纹对比。
pub trait FingerprintRunnerPort {
    /// 计算契约定义 canonical 指纹。
    async fn calculate_definition_fingerprint(
        &self,
        request: DefinitionFingerprintRequest,
    ) -> Result<FingerprintCalculationResult, PortError>;

    /// 计算发布快照 canonical 指纹。
    async fn calculate_snapshot_fingerprint(
        &self,
        request: SnapshotFingerprintRequest,
    ) -> Result<FingerprintCalculationResult, PortError>;

    /// 对比两个 fingerprint。
    async fn compare_fingerprint(
        &self,
        request: FingerprintCompareRequest,
    ) -> Result<FingerprintCompareResult, PortError>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `async fn calculate_definition_fingerprint(&self, request: DefinitionFingerprintRequest) -> Result<FingerprintCalculationResult, PortError>` | 计算定义指纹 | `request` 是定义指纹请求 | `Result<FingerprintCalculationResult, PortError>` | `PortError` 表示工具链执行失败 |
| `async fn calculate_snapshot_fingerprint(&self, request: SnapshotFingerprintRequest) -> Result<FingerprintCalculationResult, PortError>` | 计算快照指纹 | `request` 是快照指纹请求 | `Result<FingerprintCalculationResult, PortError>` | `PortError` 表示工具链执行失败 |
| `async fn compare_fingerprint(&self, request: FingerprintCompareRequest) -> Result<FingerprintCompareResult, PortError>` | 对比指纹 | `request` 是指纹对比请求 | `Result<FingerprintCompareResult, PortError>` | `PortError` 表示工具链执行失败 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ContractCompatibilityService`、`ContractSnapshotService`、`ContractOperationsService`、`RecalculateFingerprintJob` | 发布前校验、快照对账和漂移检测时使用 |
| 定义方 | `crates/application/src/ports/fingerprint_runner.rs` | 定义 fingerprint 工具链端口 |
| 实现方 | `crates/infra/src/toolchain/fingerprint.rs` | 实现 canonical fingerprint 计算和对比 |

###### 不变量与禁止事项

- `FingerprintRunnerPort` 只计算结果,不决定发布是否通过。
- 发布可用性判断仍由 `FingerprintPolicy` 和 application service 完成。
- 指纹算法必须和 `FingerprintPolicy` 中的算法声明一致。

#### 9.6.6 `SnapshotExporterPort`

###### Trait 定义

```rust
/// 发布快照导出工具链端口,用于从发布基线生成可下游消费的快照文档。
pub trait SnapshotExporterPort {
    /// 从发布基线导出发布快照。
    async fn export_release_snapshot(
        &self,
        request: SnapshotExportRequest,
    ) -> Result<SnapshotExportResult, PortError>;

    /// 校验导出结果与预期快照引用是否一致。
    async fn verify_export(
        &self,
        snapshot_ref: ReleaseSnapshotRef,
        expected_fingerprint: ContractFingerprint,
    ) -> Result<SnapshotExportVerification, PortError>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `async fn export_release_snapshot(&self, request: SnapshotExportRequest) -> Result<SnapshotExportResult, PortError>` | 导出发布快照 | `request` 是快照导出请求 | `Result<SnapshotExportResult, PortError>` | `PortError` 表示导出失败 |
| `async fn verify_export(&self, snapshot_ref: ReleaseSnapshotRef, expected_fingerprint: ContractFingerprint) -> Result<SnapshotExportVerification, PortError>` | 校验导出结果 | `snapshot_ref` 是快照引用;`expected_fingerprint` 是预期指纹 | `Result<SnapshotExportVerification, PortError>` | `PortError` 表示校验失败 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | `ContractSnapshotService`、`DeriveReleaseSnapshotJob`、`ContractOperationsService` | 从发布基线派生快照和校验快照时使用 |
| 定义方 | `crates/application/src/ports/snapshot_exporter.rs` | 定义快照导出端口 |
| 实现方 | `crates/infra/src/toolchain/snapshot_exporter.rs` | 实现 canonical snapshot 导出 |

###### 不变量与禁止事项

- exporter 不直接保存 `ContractReleaseSnapshot` 元数据。
- exporter 不发布下游 SDK 或 registry 包。
- exporter 输出必须交给 `ReleaseSnapshotStorePort` 和 `SnapshotRepository` 形成资产与元数据链路。

### 9.7 Adapter 实现方映射与 wiring 边界

本节只定义 infra adapter 实现哪些 port,以及 CLI / jobs 如何装配这些 adapter。adapter 内部文件格式、锁策略、重试策略、配置读取和外部 SDK 调用留给 Step 11 / Step 14。

#### 9.7.1 Adapter 实现方总表

| Adapter | 实现 port | 所属文件 | 主要责任 | 禁止事项 |
|---|---|---|---|---|
| `FilesystemContractSourceStore` | `ContractSourceStorePort`、可选实现 `ContractDefinitionRepository` 的文件源读写部分 | `crates/infra/src/source_store/filesystem.rs` | 读取、写入和枚举 `contract-source/` 结构化源码资产 | 不迁移领域状态;不写 outbox;不替代发布门禁 |
| `FilesystemReleaseSnapshotStore` | `ReleaseSnapshotStorePort`、可选实现 `SnapshotRepository` 的文件快照部分 | `crates/infra/src/snapshot_store/filesystem.rs` | 写入和校验 `release-snapshots/` 只读快照资产 | 不创建发布基线;不推送 SDK;不反写源码 |
| `FileProjectionIndexStore` | `ProjectionStorePort`、可选实现 `ReferenceRepository` 的 projection 部分 | `crates/infra/src/projection_store/file_index.rs` | 维护只读模型、追溯投影和 projection 水位 | 不改写真相聚合;不自行决定投影业务语义 |
| `FileOutboxStore` | `OutboxPort` | `crates/infra/src/outbox_store/file_outbox.rs` | 持久化待发布事实事件和投递状态 | 不直接调用 L0-bus;不删除失败事实 |
| `FileAuditLogStore` | `AuditLogPort` | `crates/infra/src/audit_store/file_audit.rs` | 追加和查询审计记录 | 不保存敏感凭据;不改写真相 |
| `FileIdempotencyStore` | `IdempotencyRepository` | `crates/infra/src/idempotency_store/file_idempotency.rs` | 预占幂等键、保存 replay decision 和完成 receipt | 不保存完整 payload;不发布事件 |
| `GateDecisionAdapter` | `GateDecisionPort` | `crates/infra/src/adapters/gate_decision.rs` | 读取和校验 approved gate 引用 | 不实现治理审批流程;不伪造通过结果 |
| `ReferenceResolverAdapter` | `ReferenceResolverPort` | `crates/infra/src/adapters/reference_resolver.rs` | 解析标准、ADR、事件目录等外部引用是否存在可用 | 不复制外部正文;不决定是否发布 |
| `BlobRefAdapter` | `BlobRefPort` | `crates/infra/src/adapters/blob_ref.rs` | 校验 blob 引用是否存在且可读 | 不返回 blob 正文;不吸收外部大对象 |
| `L0BusEventPublisherAdapter` | `EventPublisherPort` | `crates/infra/src/adapters/event_publisher.rs` | 将已提交 outbox 事实交给 L0-bus 边界 | 不实现 bus runtime;不处理业务状态迁移 |
| `SystemClockAdapter` | `ClockPort` | `crates/infra/src/adapters/clock.rs` | 提供系统时间 | 不在 domain 内直接读取系统时间 |
| `StableIdGeneratorAdapter` | `IdGeneratorPort` | `crates/infra/src/adapters/id_generator.rs` | 生成稳定 ID | 不在 domain 内生成随机 ID |
| `FileUnitOfWorkAdapter` | `UnitOfWork` | `crates/infra/src/adapters/unit_of_work.rs` | 提供事务 / 文件锁 / 一致性提交边界 | 不承载业务规则;不吞掉 application error |
| `ContractValidationRunner` | `ContractValidationRunnerPort` | `crates/infra/src/toolchain/validator.rs` | 执行契约结构、引用和兼容前置校验 | 不保存领域对象;不发布事件 |
| `CanonicalFingerprintRunner` | `FingerprintRunnerPort` | `crates/infra/src/toolchain/fingerprint.rs` | 计算和对比 canonical fingerprint | 不决定发布是否通过;不改写定义 |
| `CanonicalSnapshotExporter` | `SnapshotExporterPort` | `crates/infra/src/toolchain/snapshot_exporter.rs` | 从发布基线导出 canonical release snapshot | 不保存快照元数据;不发布 SDK 包 |

说明:

- 上表中的 `FileAuditLogStore` 和 `FileUnitOfWorkAdapter` 需要在 Step 4 文件布局回填时补入 `audit_store/` 和 `adapters/unit_of_work.rs`。
- “可选实现 repository 的文件源读写部分”只表示同一个 infra 文件可以实现多个 port,不表示 application 可以直接依赖该具体类型。
- 如果后续改成数据库实现,port 契约不变,只替换 adapter。

#### 9.7.2 Wiring 边界图

```text
[cli_entry]
  |
  | build runtime
  v
[infra_adapters] -- impl --> [application_ports]
  |                              ^
  | construct                    | generic bound
  v                              |
[application_services] ----------+
  |
  | call domain objects
  v
[domain_*]

[jobs]
  |
  | build runtime
  v
[infra_adapters] -- impl --> [application_ports]
  |
  v
[application_services]
```

关键说明:

- `cli_entry` 和 `jobs` 可以创建 concrete adapter,也可以创建 application service。
- application service 的字段类型必须是 `P: XxxPorts`,不能是 `FilesystemContractSourceStore` 这类具体 adapter。
- domain 对象只接收已解析的值对象、时间和 ID,不能接收 port 或 adapter。
- jobs 执行写入动作时必须调用 application service,不能直接调用 repository 改写真相。

#### 9.7.3 Wiring helper 契约

```rust
/// L0-core runtime 装配配置。
///
/// 该结构只服务入口装配,不进入 domain。
pub struct CoreRuntimeConfig {
    /// 契约源码根目录。
    pub contract_source_root: ContractSourceRoot,

    /// 发布快照根目录。
    pub release_snapshot_root: ReleaseSnapshotRoot,

    /// projection 索引根目录。
    pub projection_index_root: ProjectionIndexRoot,

    /// 审计记录根目录。
    pub audit_root: AuditRoot,

    /// outbox 根目录。
    pub outbox_root: OutboxRoot,

    /// 幂等记录根目录。
    pub idempotency_root: IdempotencyRoot,

    /// 外部引用解析配置。
    pub reference_resolver_config: ReferenceResolverConfig,
}

/// CLI runtime 装配结果。
pub struct CoreCliRuntime<P>
where
    P: ContractChangePorts
        + ContractReleasePorts
        + ContractSnapshotPorts
        + ContractTracePorts
        + ContractOperationsPorts,
{
    /// 契约命令入口。
    pub command_api: ContractCommandApi<P>,

    /// 契约查询入口。
    pub query_api: ContractQueryApi<P>,

    /// 运维触发入口。
    pub operations_trigger: ContractOperationsTrigger<P>,
}

/// Job runtime 装配结果。
pub struct CoreJobRuntime<P>
where
    P: ContractCompatibilityPorts
        + ContractSnapshotPorts
        + ContractOperationsPorts
        + ContractFactPorts,
{
    /// 校验作业。
    pub validate_contract_change_job: ValidateContractChangeJob<P>,

    /// 快照派生作业。
    pub derive_release_snapshot_job: DeriveReleaseSnapshotJob<P>,

    /// 索引重建作业。
    pub rebuild_contract_index_job: RebuildContractIndexJob<P>,

    /// fingerprint 复算作业。
    pub recalculate_fingerprint_job: RecalculateFingerprintJob<P>,

    /// outbox relay worker。
    pub outbox_relay_worker: OutboxRelayWorker<P>,
}

/// 构建 CLI runtime。
pub fn build_cli_runtime(
    config: CoreRuntimeConfig,
) -> Result<CoreCliRuntime<CoreInfraPorts>, InfraError>;

/// 构建后台 job runtime。
pub fn build_job_runtime(
    config: CoreRuntimeConfig,
) -> Result<CoreJobRuntime<CoreInfraPorts>, InfraError>;
```

###### 函数表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `pub fn build_cli_runtime(config: CoreRuntimeConfig) -> Result<CoreCliRuntime<CoreInfraPorts>, InfraError>` | 装配 CLI 入口运行时 | `config` 是 source / snapshot / projection / audit / outbox / idempotency / reference resolver 配置 | `Result<CoreCliRuntime<CoreInfraPorts>, InfraError>` | `InfraError` 表示配置或 adapter 初始化失败 |
| `pub fn build_job_runtime(config: CoreRuntimeConfig) -> Result<CoreJobRuntime<CoreInfraPorts>, InfraError>` | 装配 job 运行时 | `config` 是 source / snapshot / projection / audit / outbox / idempotency / reference resolver 配置 | `Result<CoreJobRuntime<CoreInfraPorts>, InfraError>` | `InfraError` 表示配置或 adapter 初始化失败 |

#### 9.7.4 `CoreInfraPorts` 组合实现边界

`CoreInfraPorts` 是 infra 层的 adapter 聚合对象,用于把多个具体 adapter 组合成 application service 需要的组合 port。

```rust
/// L0-core infra 端口聚合。
///
/// 该类型实现 application_ports 中的底层 port 和组合 port。
pub struct CoreInfraPorts {
    /// 事务边界 adapter。
    pub unit_of_work: FileUnitOfWorkAdapter,

    /// 契约源码 adapter。
    pub source_store: FilesystemContractSourceStore,

    /// 发布快照 adapter。
    pub snapshot_store: FilesystemReleaseSnapshotStore,

    /// projection adapter。
    pub projection_store: FileProjectionIndexStore,

    /// outbox adapter。
    pub outbox_store: FileOutboxStore,

    /// 审计 adapter。
    pub audit_log_store: FileAuditLogStore,

    /// 幂等 adapter。
    pub idempotency_store: FileIdempotencyStore,

    /// 外部门禁 adapter。
    pub gate_decision_adapter: GateDecisionAdapter,

    /// 外部引用解析 adapter。
    pub reference_resolver_adapter: ReferenceResolverAdapter,

    /// blob 引用 adapter。
    pub blob_ref_adapter: BlobRefAdapter,

    /// 事件发布 adapter。
    pub event_publisher_adapter: L0BusEventPublisherAdapter,

    /// 时间 adapter。
    pub clock: SystemClockAdapter,

    /// ID adapter。
    pub id_generator: StableIdGeneratorAdapter,

    /// 校验工具链 adapter。
    pub validation_runner: ContractValidationRunner,

    /// fingerprint 工具链 adapter。
    pub fingerprint_runner: CanonicalFingerprintRunner,

    /// 快照导出工具链 adapter。
    pub snapshot_exporter: CanonicalSnapshotExporter,
}
```

约束:

- `CoreInfraPorts` 可以实现多个底层 port,也可以实现 Step 6 中 service 使用的组合 port。
- `CoreInfraPorts` 不暴露给 domain crate。
- `CoreInfraPorts` 不应被 command DTO、event DTO 或 domain object 持有。
- 单元测试可以使用 mock ports 替代 `CoreInfraPorts`。

#### 9.7.5 禁止依赖清单

| 禁止方向 | 说明 | 替代做法 |
|---|---|---|
| `domain_* -> application_ports` | domain 不能知道 port 存在 | application service 先取到数据,再把值对象传入 domain |
| `domain_* -> infra_adapters` | domain 不能读取文件、调用工具链或发事件 | 通过 application port 调用外部能力 |
| `application_services -> infra_adapters` | application service 不能依赖具体 adapter | 依赖 `P: XxxPorts` 或底层 port trait |
| `jobs -> repository concrete adapter` | job 不能绕过 application service 改写真相 | job 调用 `ContractOperationsService` 或对应 application service |
| `cli_entry -> domain aggregate direct mutation` | CLI 不直接改领域对象 | CLI 组装 command / context 后调用 application service |
| `infra_adapters -> domain policy mutation` | infra 不表达业务规则 | infra 只实现 I/O;业务判断回到 domain policy / application service |

### 9.8 Step 7 统一复核

#### 9.8.1 Trait 覆盖复核

| 能力 | Trait / Port | 是否覆盖 | 说明 |
|---|---|---|---|
| 事务边界 | `UnitOfWork` | 是 | 写路径和恢复路径统一通过事务边界 |
| 时间来源 | `ClockPort` | 是 | domain 只接收 `Timestamp`,不读系统时间 |
| ID 生成 | `IdGeneratorPort` | 是 | 创建定义、基线、快照、事实和 receipt 时使用 |
| 定义真相 | `ContractDefinitionRepository` | 是 | 支撑定义创建、更新、发布和查询 |
| 发布基线 | `ContractBaselineRepository` | 是 | 支撑发布基线读写和当前基线查询 |
| 发布快照元数据 | `SnapshotRepository` | 是 | 支撑快照元数据和消费引用 |
| 契约事实记录 | `ContractFactRepository` | 是 | 支撑事实记录创建、状态更新和恢复 |
| 引用与局部投影 | `ReferenceRepository` | 是 | 支撑外部引用、标准映射和小范围投影写入 |
| 审计 | `AuditLogPort` | 是 | 支撑命令、状态迁移和运维动作审计 |
| Outbox | `OutboxPort` | 是 | 支撑事实事件待发布队列 |
| 事件发布边界 | `EventPublisherPort` | 是 | 支撑 outbox relay 调用 L0-bus 边界 |
| 门禁引用 | `GateDecisionPort` | 是 | 只校验 approved gate,不实现审批 |
| 外部引用解析 | `ReferenceResolverPort` | 是 | 只返回引用解析结果,不复制正文 |
| Blob 引用 | `BlobRefPort` | 是 | 只校验引用可用性,不读取正文 |
| 源码资产 | `ContractSourceStorePort` | 是 | 支撑 `contract-source/` 资产读写 |
| 快照资产 | `ReleaseSnapshotStorePort` | 是 | 支撑 `release-snapshots/` 资产读写和校验 |
| Projection 重建 | `ProjectionStorePort` | 是 | 支撑 projection 批量替换、水位和 stale 标记 |
| 校验工具链 | `ContractValidationRunnerPort` | 是 | 支撑契约源码和包校验 |
| Fingerprint 工具链 | `FingerprintRunnerPort` | 是 | 支撑 canonical fingerprint 计算和对比 |
| 快照导出工具链 | `SnapshotExporterPort` | 是 | 支撑从发布基线导出快照 |

#### 9.8.2 参数 / 返回 / 错误类型复核

| 检查项 | 结果 | 说明 |
|---|---|---|
| trait 函数是否写出参数类型 | 通过 | 每个方法表均写出完整函数签名 |
| trait 函数是否写出返回类型 | 通过 | I/O 型函数统一 `Result<..., PortError>` |
| trait 函数是否写出错误类型 | 通过 | port 失败统一 `PortError`;纯同步支撑函数无错误 |
| 写路径是否显式版本 / 指纹 / 批次 | 通过 | repository `save` 带 `expected_version`;source / snapshot 写入带 expected fingerprint;projection 写入带 rebuild id |
| toolchain 是否只返回报告 / 结果 | 通过 | validation、fingerprint、snapshot exporter 不直接改写真相 |

#### 9.8.3 调用方 / 实现方复核

| 角色 | 允许行为 | 禁止行为 |
|---|---|---|
| `application_services` | 依赖底层 port 或组合 port;编排 use case | 依赖 concrete infra adapter |
| `infra_adapters` | 实现 application port;封装文件、外部系统和工具链 | 定义领域规则;被 domain 反向依赖 |
| `cli_entry` | 加载可信上下文、构造 command / query、装配 runtime | 直接改 domain aggregate 或绕过 application service |
| `jobs` | 装配 runtime、调用 application service 或 worker | 直接调用 repository concrete adapter 改写真相 |
| `domain_*` | 执行纯领域规则和状态迁移 | 依赖 port、adapter、filesystem、bus、toolchain |

#### 9.8.4 Step 8 / 9 / 11 交接项

| 后续 Step | 需要承接的内容 | 本步交付物 |
|---|---|---|
| Step 8 协议契约 | Command / Query / Event / Job DTO 和 JSON / Rust schema | port 参数名、receipt / report / query 类型名、调用方边界 |
| Step 9 函数级处理流 | 每个接口调用哪些 service、domain 函数和 port | trait 方法、调用方 / 实现方、wiring 边界 |
| Step 10 状态机 | repository / toolchain 返回结果如何影响状态迁移 | 状态迁移仍在 domain / application,不在 port 内发生 |
| Step 11 持久化与一致性 | repository、outbox、audit、projection、snapshot store 的存储细节 | port 函数、写入对象、expected version / fingerprint |
| Step 14 配置依赖 | adapter 初始化配置和外部引用配置 | `CoreRuntimeConfig`、wiring helper |

#### 9.8.5 已回补到 Step 4 的文件布局项

本步新增了若干 port / adapter 文件名,已同步回补到 Step 4 的文件树和文件职责表:

| 需要补入位置 | 文件 / 目录 | 原因 |
|---|---|---|
| `crates/application/src/ports/` | `source_store.rs`、`snapshot_store.rs`、`projection_store.rs`、`validation_runner.rs`、`fingerprint_runner.rs`、`snapshot_exporter.rs`、`idempotency.rs` | Step 7 已确认这些是正式 application port |
| `crates/infra/src/audit_store/` | `mod.rs`、`file_audit.rs` | `AuditLogPort` 需要明确实现落点 |
| `crates/infra/src/idempotency_store/` | `mod.rs`、`file_idempotency.rs` | `IdempotencyRepository` 需要明确实现落点 |
| `crates/infra/src/adapters/` | `unit_of_work.rs` | `UnitOfWork` 需要明确实现落点 |

#### 9.8.6 Step 13 回补:幂等仓储端口

Step 13 明确 Command / Job 幂等需要可持久化的 reserve / replay / complete 边界。本节作为 Step 13 对 Step 7 的 port 契约回补。

###### Trait 定义

```rust
/// 幂等记录仓储端口,用于写路径预占幂等键、判断重放结果并保存完成回执。
pub trait IdempotencyRepository {
    /// 预占幂等键,或返回既有完成结果 / 冲突状态。
    async fn reserve(
        &self,
        scope: IdempotencyScope,
        key: IdempotencyKey,
        operation: OperationName,
        payload_fingerprint: RequestPayloadFingerprint,
        request_id: RequestId,
        now: Timestamp,
    ) -> Result<IdempotencyDecision, PortError>;

    /// 将幂等记录标记为完成并保存可重放 receipt。
    async fn complete(
        &self,
        scope: IdempotencyScope,
        key: IdempotencyKey,
        receipt: Receipt,
        completed_at: Timestamp,
    ) -> Result<(), PortError>;
}
```

###### 方法表

| 函数签名 | 作用 | 参数说明 | 返回 | 错误类型 |
|---|---|---|---|---|
| `async fn reserve(&self, scope: IdempotencyScope, key: IdempotencyKey, operation: OperationName, payload_fingerprint: RequestPayloadFingerprint, request_id: RequestId, now: Timestamp) -> Result<IdempotencyDecision, PortError>` | 预占幂等键或判断重复调用 | 参数分别为幂等作用域、键、操作名、payload 指纹、首次请求 ID 和时间 | `Result<IdempotencyDecision, PortError>` | `PortError` 表示存储边界失败 |
| `async fn complete(&self, scope: IdempotencyScope, key: IdempotencyKey, receipt: Receipt, completed_at: Timestamp) -> Result<(), PortError>` | 保存完成状态和可重放回执 | `receipt` 是已完成写请求的回执;`completed_at` 是完成时间 | `Result<(), PortError>` | `PortError` 表示完成记录保存失败 |

###### 调用方 / 实现方

| 角色 | 模块 / 对象 | 说明 |
|---|---|---|
| 调用方 | 所有 Command 写路径 service、Operations Job service | 在业务写入前 reserve,成功提交后 complete |
| 定义方 | `crates/application/src/ports/idempotency.rs` | 定义幂等仓储端口 |
| 实现方 | `crates/infra/src/idempotency_store/` 或对应 repository adapter | 通过文件型 index、数据库表或 KV 实现唯一键预占 |

###### 不变量与禁止事项

- `reserve(...)` 必须对 `(scope, key)` 提供原子唯一约束。
- 同一 key 但 payload fingerprint 不一致时必须返回 `IdempotencyDecision::PayloadMismatch`。
- `complete(...)` 必须与 truth / audit / outbox 成功写入处于同一事务边界或具备等效原子性。
- `IdempotencyRepository` 不保存完整 payload,不替代 audit,不发布事件。

结论:

```text
Step 7 已满足进入 Step 8 的条件。
所有跨模块、跨层、跨外部系统的实现接缝都有 trait / port / adapter 契约。
```

---

## 10. 回填草稿

正式 `03-详细设计.md` 回填时应遵守:

```text
1. 第 5 章仍按 Step 5 的模块主轴展开。
2. `application_ports` 模块放置 trait 正文、方法表、调用方 / 实现方和不变量。
3. `infra_adapters` 模块放置 adapter 实现方映射、wiring helper、CoreInfraPorts 和禁止依赖清单。
4. 第 6 章只做 Trait / Port / Adapter 索引,不重复正文。
5. Step 4 文件布局已同步补齐 source / snapshot / projection / toolchain / idempotency port 文件、audit_store、idempotency_store 和 unit_of_work adapter。
```

建议正式文档 §5 中新增或展开以下小节:

| 正式章节位置 | 回填内容 |
|---|---|
| `application_ports` | 事务、repository、audit、outbox、event、external、source、snapshot、projection、toolchain port |
| `infra_adapters` | adapter 实现表、wiring helper、`CoreInfraPorts`、禁止依赖清单 |
| `cli_entry` | 只说明 CLI 通过 wiring 得到 application service,不直接依赖 domain |
| `jobs` | 只说明 jobs 通过 wiring 得到 application service 和 worker,不绕过 application 改写真相 |

---

## 11. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| service 是否使用组合 port trait | A. 每个 service 直接持有所有底层 port; B. 每个 service 使用组合 port trait; C. service 直接依赖 infra | B | 能在 Step 6 的 `P: XxxPorts` 上继续展开,同时保持测试和 wiring 清晰 | 已确认采用 B |
| projection store 是否作为 repository port | A. 合并进 repository; B. 独立 projection / index port; C. 留给 infra 内部 | B | projection 是查询视图和重建能力,不应混入定义真相 repository | 已确认采用 B |
| toolchain runner 是否放在 application_ports | A. 是,作为 port; B. 否,由 infra 内部直接调用; C. 放到 jobs 私有 | A | application service 和 jobs 都需要通过 port 访问工具链,不能直接依赖 infra 实现 | 已确认采用 A |

---

## 12. 进入下一步条件

Step 7 完成后必须满足:

- 所有 repository、audit、outbox、idempotency、gate、resolver、blob、publisher、clock、id、unit of work、toolchain、projection 依赖都有 trait 契约。
- 每个 trait 函数都有参数类型、返回类型和错误类型。
- 每个 trait 都明确调用方、定义位置和实现方。
- `infra_adapters` 中每个 adapter 实现哪个 port 已明确。
- domain / application 不直接依赖 infra 的边界已固定。
- 可以进入 Step 8 “定义 API / Command / Query / Event / Job 协议契约”。
