# Step 9. 逐接口定义函数级处理流

> 本文件是 `projects/L0-core/03-详细设计.md` 的 Step 9 中间产物。
> 本步只收稳 Command / Query / Outbound Event / Operations Job 的函数级调用链、事务边界、错误映射、状态与事件副作用、测试切口。
> 本步不定义新协议 schema,不定义状态转换矩阵全集,不写 DDL / 索引 / 存储格式。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填,本文件不替代正式详细设计。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 9
- 回填章节: `projects/L0-core/03-详细设计.md` §8 逐接口函数级处理流

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 8 协议契约 | 已确认 26 个 Command / Query / Event / Job 协议 | 作为处理流覆盖清单 |
| Step 7 Port / Adapter 契约 | 已确认 repository、outbox、event publisher、toolchain、source / snapshot / projection port | 作为函数调用链中的外部接缝 |
| Step 6 对象实现契约 | 已确认 application service、domain object、policy、receipt 对象函数 | 作为函数级调用图和伪代码来源 |
| Step 5 模块主轴 | 已确认 `contracts` / `application_services` / `application_ports` / `infra_adapters` / `cli_entry` / `jobs` 边界 | 作为调用方、处理方和禁止依赖依据 |
| `02-概要设计.md` §8 | 已有关键处理流骨架 | 作为本步细化的处理流族来源 |

已确认结论:

```text
Step 9 必须回指 Step 8 的协议,不能新增协议。
Step 9 必须回指 Step 6 / 7 的对象函数和 port,不能用泛泛的“调用数据库 / 调用工具链”。
写路径必须明确事务开始、提交、回滚、状态变化和 outbox 事件写入。
查询路径必须明确只读边界,不得写审计、outbox 或 projection。
```

---

## 3. 本步写作策略

本步沿用长文档写作规则:

```text
骨架先行 + 分批填充 + 状态推进 + 格式约束 + 最后收口
```

写作约束:

- 每个需要实现的 Command / Query / Event / Job 必须能在处理流表中找到入口。
- 每个处理流必须有 ASCII 调用图。
- 关键伪代码必须使用 Rust 风格,并在关键调用前标注 `// [对象.函数(Type 参数名)]`。
- 本步可以对简单 query 复用“通用只读处理流”,但每个 query 必须在总表中明确绑定该流。
- 事件处理流以“写入 outbox”和“relay 发布”两段表达;L0-core 不实现 L0-bus 订阅 / ack / retry / dead-letter。
- 状态转换的完整矩阵留给 Step 10,本步只写本处理流触发的状态副作用。

---

## 4. 分章节写入计划

| 章节 | 状态 | 主题 | 覆盖协议 |
|---|---|---|---|
| 9.1 | [x] | 处理流总览与统一规则 | 全部协议 |
| 9.2 | [x] | Command API 处理流 | 5 个 Command |
| 9.3 | [x] | Query API 处理流 | 8 个 Query |
| 9.4 | [x] | Outbound Event 处理流 | 7 个 Event |
| 9.5 | [x] | Operations Job 处理流 | 6 个 Job / Worker |
| 9.6 | [x] | Step 9 统一复核 | 全部处理流 |

---

## 5. SOP 问题回答

### 5.1 哪些协议必须拥有函数级处理流？

全部 26 个协议必须能映射到处理流:

| 类别 | 处理方式 |
|---|---|
| 5 个 Command | 每个独立处理流 |
| 8 个 Query | 普通 query 复用 `CommonReadFlow`;追溯 / 兼容 query 独立处理流 |
| 7 个 Event | 绑定 `OutboxMaterializeFlow` 和 `OutboxRelayFlow` |
| 6 个 Job / Worker | 5 个 job 独立处理流;`OutboxRelayWorker` 复用 `OutboxRelayFlow` |

### 5.2 每个处理流的入口函数是什么？

入口函数已在 §9.1 总表和各处理流小节列出。统一入口如下:

- Command:`ContractCommandApi.<command>(CommandDto command, ActorContext actor, CommandMetadata meta)`
- Query:`ContractQueryApi.<query>(QueryDto query, QueryMetadata meta)`
- Event materialize:来源 application service 内调用 `OutboxPort.append(FactOutboxEvent event)`
- Job:`<Job>.run(JobInput input, ActorContext actor, CommandMetadata meta)`
- Relay:`OutboxRelayWorker.run_once(OutboxRelayWorkerInput input)`

### 5.3 入口函数调用哪些 application service、domain method、repository 和 outbox？

| 处理族 | Application service | Domain / Policy | Repository / Port |
|---|---|---|---|
| 草稿创建 / 更新 | `ContractChangeService` | `BoundaryGuard`、`DefinitionUseBoundaryGuard`、`ContractDefinition` | `ContractDefinitionRepository`、`AuditLogPort`、`OutboxPort` |
| 评审提交 | `ContractChangeService` | `ContractDefinition.submit_for_review(...)` | `ContractDefinitionRepository`、`AuditLogPort`、`OutboxPort` |
| 发布基线 | `ContractReleaseService` | `FingerprintPolicy`、`ContractReleaseBaseline`、`ContractDefinition.publish(...)` | `GateDecisionPort`、definition / baseline repository、`AuditLogPort`、`OutboxPort` |
| 生命周期迁移 | `ContractReleaseService` | `ContractDefinition.deprecate/retire/supersede(...)` | `ContractDefinitionRepository`、`AuditLogPort`、`OutboxPort` |
| 查询 | `ContractTraceService` / `ContractCompatibilityService` / `ContractSnapshotService` | read model / projection 只读方法 | repository / projection / audit 只读 port |
| Job | `ContractOperationsService` / compatibility / snapshot / fact service | policy、snapshot、projection、fact object | toolchain、projection、snapshot、outbox、audit port |

### 5.4 事务在哪里开始，在哪里提交，哪些错误触发回滚？

| 场景 | 事务边界 | 触发回滚的错误 |
|---|---|---|
| Command 写路径 | `UnitOfWork.transact(...)` 包住 truth save、audit、outbox | validation、precondition、conflict、repository、audit、outbox 错误 |
| Query 读路径 | 不开启写事务 | 不适用 |
| Event materialize | 与来源写事务共用 | payload 构造、outbox append 失败 |
| Outbox relay | publish 在事务外;mark published / failed 单条事务 | mark 状态失败需要后续 replay |
| Projection rebuild | projection replace / watermark 更新使用批次事务 | projection 写入失败 |
| Toolchain job | 工具链执行在事务外;结果写入时进入事务 | 结果保存、审计、outbox 失败 |

### 5.5 哪些状态会被修改，哪些事件会被写入？

| 处理流 | 状态变化 | 事件 |
|---|---|---|
| `CreateContractDraftFlow` | 创建 `Draft` | `ContractDraftChanged` |
| `UpdateContractDraftFlow` | `Draft` 内版本 / fingerprint 更新 | `ContractDraftChanged` |
| `SubmitContractForReviewFlow` | `Draft` -> `InReview` | `ContractReviewSubmitted` |
| `PublishContractBaselineFlow` | definition published / baseline released | `ContractBaselinePublished` |
| `UpdateContractLifecycleFlow` | deprecated / retired / superseded | `ContractLifecycleChanged` |
| `ValidateContractChangeJobFlow` | compatibility status 更新 | `ContractCompatibilityStatusChanged` |
| `DeriveReleaseSnapshotJobFlow` | snapshot building -> ready | `ContractSnapshotReady` |
| `PublishContractFactJobFlow` | fact pending -> queued | fact outbox event |
| `OutboxRelayFlow` | outbox pending -> published / failed | 可形成 `ContractFactPublished` 摘要 |

### 5.6 每个处理流至少需要哪些测试切口？

已在各处理流小节列出。统一最低要求:

- 每个写路径至少 1 个正向测试、1 个非法状态测试、1 个事务回滚测试。
- 每个 query 至少 1 个正向测试、1 个 not found / stale 测试。
- 每个 job 至少 1 个正向测试、1 个外部 port 失败测试、1 个不改写真相边界测试。
- outbox relay 至少覆盖成功发布、单条发布失败、publisher 全局不可用。

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理结果 | 影响 |
|---|---|---|---|
| Step 8 协议契约 | 已定义协议和 schema,但没有函数级调用顺序 | 已补处理流总表、调用图和伪代码 | 实现者可以按 flow 写 use case |
| Step 7 Port 契约 | 已定义 port 方法,但没有逐接口使用位置 | 已把 repository、outbox、toolchain、projection port 放入各 flow | 测试切口和错误回滚边界清晰 |
| Step 6 application service | 已定义 service 函数签名,但函数体处理顺序未展开 | 已展开主要 service 的调用顺序 | 可以 1:1 编写函数体 |
| 概要设计 §8 | 只有处理流骨架,不是可编码伪代码 | 已下沉到对象函数和 port 方法级别 | 支撑详细设计正式回填 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| Command 写路径 | 只有协议和 service 函数 | 有 handler -> service -> domain -> repository / outbox 调用图和伪代码 | 支撑实现 use case |
| Query 读路径 | 只有 query DTO | 有只读调用链、fallback、stale 边界 | 防止查询路径写入副作用 |
| Event 输出 | 只有 event DTO | 有 outbox materialize 和 relay 发布流程 | 防止把 L0-bus runtime 写入本仓 |
| Job 后台处理 | 只有 job input / output | 有 job runner -> service -> port 调用链和错误口径 | 支撑后台任务实现和测试 |
| 事务边界 | 分散在 port / service 描述中 | 每个写路径明确 begin / commit / rollback 口径 | 支撑后续 Step 11 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每个协议完全独立展开 | 最直观 | 文件极长,重复大量只读和 outbox 逻辑 | 不完全采用 |
| 简单 query 复用通用只读流,关键 query 独立展开 | 降低重复,仍可实现 | 需要总表明确绑定 | 采用 |
| 每个 event 都写完整发布流程 | 细 | 与 outbox relay 重复 | 不采用 |
| event 分为“事实写入 outbox”和“relay 发布” | 符合 outbox 设计 | 需要在事件表标明触发来源 | 采用 |

---

## 9. 结构化中间产物

### 9.1 处理流总览与统一规则

#### 9.1.1 处理流总表

| 处理流 | 对应协议 | 入口函数 | 主要事务 | 状态变化 | 测试切口 |
|---|---|---|---|---|---|
| `CreateContractDraftFlow` | `CreateContractDraft` | `ContractCommandApi.create_contract_draft(...)` | 写事务 | 创建 `ContractDefinition` 草稿态 | 正向创建、越界输入、幂等冲突、outbox 失败 |
| `UpdateContractDraftFlow` | `UpdateContractDraft` | `ContractCommandApi.update_contract_draft(...)` | 写事务 | 更新草稿版本和 fingerprint | 正向更新、非草稿态、版本冲突、引用不可用 |
| `SubmitContractForReviewFlow` | `SubmitContractForReview` | `ContractCommandApi.submit_contract_for_review(...)` | 写事务 | draft -> in_review | 正向提交、非法状态、版本冲突 |
| `PublishContractBaselineFlow` | `PublishContractBaseline` | `ContractCommandApi.publish_contract_baseline(...)` | 写事务 | definition published / baseline released | 正向发布、gate 未通过、fingerprint 不匹配、outbox 失败 |
| `UpdateContractLifecycleFlow` | `UpdateContractLifecycle` | `ContractCommandApi.update_contract_lifecycle(...)` | 写事务 | deprecated / retired / superseded | 正向迁移、非法迁移、终态保护 |
| `CommonReadFlow` | `GetContractDefinition`、`ListContractDefinitions`、`GetContractReleaseBaseline`、`GetContractReleaseSnapshot`、`GetContractPackage`、`GetContractGuideSample` | `ContractQueryApi.*(...)` | 无写事务 | 无 | 正向读取、not found、projection unavailable |
| `TraceContractEvolutionFlow` | `TraceContractEvolution` | `ContractQueryApi.trace_contract_evolution(...)` | 无写事务 | 无 | 正向追溯、projection stale、audit 读取失败 |
| `GetCompatibilityTraceFlow` | `GetCompatibilityTrace` | `ContractQueryApi.get_compatibility_status(...)` | 无写事务 | 无 | 正向查询、索引不可用 |
| `OutboxMaterializeFlow` | 7 个 outbound event | source service / `ContractFactService` | 与来源写事务一致 | 与来源 flow 一致 | event payload、幂等 key、outbox 写失败 |
| `OutboxRelayFlow` | `ContractFactPublished`、`OutboxRelayWorker` | `OutboxRelayWorker.run_once(...)` | outbox 状态更新事务 | outbox pending -> published / failed | 发布成功、单条失败、publisher 不可用 |
| `ValidateContractChangeJobFlow` | `ValidateContractChangeJob` | `ValidateContractChangeJob.run(...)` | 写事务用于状态和审计 | compatibility status 变化 | 校验通过、校验失败、runner 失败 |
| `DeriveReleaseSnapshotJobFlow` | `DeriveReleaseSnapshotJob` | `DeriveReleaseSnapshotJob.run(...)` | 写事务 | snapshot building -> ready | 派生成功、baseline missing、exporter 失败 |
| `RebuildContractIndexJobFlow` | `RebuildContractIndexJob` | `RebuildContractIndexJob.run(...)` | projection 替换事务 | projection stale / rebuilding -> active | 重建成功、source 读取失败、projection 写失败 |
| `RecalculateFingerprintJobFlow` | `RecalculateFingerprintJob` | `RecalculateFingerprintJob.run(...)` | 运维审计事务 | 无直接真相迁移 | 复算成功、目标缺失、算法不支持 |
| `PublishContractFactJobFlow` | `PublishContractFactJob` | `PublishContractFactJob.run(...)` | 事实 / outbox 写事务 | fact pending -> queued | 批量成功、事实状态非法、outbox 失败 |

#### 9.1.2 统一调用图约束

```text
[Entry]
  | call entry_function(ProtocolDto dto, ActorContext actor, Metadata meta)
  v
[ApplicationService]
  | tx begin/write or readonly
  | call Port.method(Type param)
  v
[DomainObject / Policy]
  | call DomainObject.method(Type param)
  v
[Repository / Outbox / Projection / Toolchain]
  | save / append / replace / publish
```

关键说明:

- 图中出现的函数必须能在 Step 6 / Step 7 / Step 8 找到。
- 写路径必须标注 `tx begin`、`save`、`append outbox`、`tx commit`。
- 查询路径必须标注 `readonly`,不得出现 `save`、`append outbox`。
- Job 可以调用 toolchain port,但真相写入必须回到 application service。

#### 9.1.3 统一事务规则

| 场景 | 事务规则 |
|---|---|
| Command 写路径 | 使用 `UnitOfWork.transact(...)` 包住 repository save、audit append、outbox append |
| Query 读路径 | 不开启写事务;允许 repository / projection 只读调用 |
| Event materialize | 与来源 Command / Job 共用写事务 |
| Outbox relay | 每条事件发布后单独更新 outbox 状态;单条失败不回滚整批 |
| Projection rebuild | 使用 projection replacement 事务或批次水位;不得改写真相 |
| Toolchain job | 工具链执行可以在事务外;写状态和审计时再进入事务 |

### 9.2 Command API 处理流

#### 9.2.1 `CreateContractDraftFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `CreateContractDraft` |
| 入口函数 | `ContractCommandApi.create_contract_draft(CreateContractDraft command, ActorContext actor, CommandMetadata meta)` |
| 目标 | 创建草稿契约定义,写审计和 `ContractDraftChanged` outbox |

##### 函数级调用图

```text
[ContractCommandApi]
  | call create_contract_draft(CreateContractDraft command, ActorContext actor, CommandMetadata meta)
  v
[ContractChangeService]
  | tx begin
  | call BoundaryGuard.inspect_draft(ContractDefinitionDraftSpec spec)
  | call DefinitionUseBoundaryGuard.ensure_definition_truth(ContractDefinitionDraftSpec candidate)
  | call ScopePolicy.evaluate(ContractScope scope, ContractDefinitionDraftSpec candidate)
  v
[ContractDefinition]
  | call ContractDefinition::create_draft(ContractDefinitionId id, ContractDefinitionDraftSpec spec, ActorContext actor, Timestamp now)
  v
[ContractDefinitionRepository + AuditLogPort + OutboxPort]
  | save insert(ContractDefinition definition)
  | append AuditRecord
  | append ContractDraftChanged
  | tx commit
```

##### 关键伪代码

```rust
// [ContractCommandApi.create_contract_draft(CreateContractDraft command, ActorContext actor, CommandMetadata meta)]
// 同步入口只组装上下文并委托 application service,不直接访问 repository。
pub async fn create_contract_draft(...) -> Result<ContractChangeReceipt, ApplicationError> {
    self.change_service.create_contract_draft(command, actor, meta).await
}

// [UnitOfWork.transact(TransactionOperation operation)]
// 包住定义插入、审计和 outbox 写入,任一失败都回滚。
self.ports.transact(|tx| async move {
    // [BoundaryGuard.inspect_draft(ContractDefinitionDraftSpec spec)]
    // 防止外部正文、运行实例或业务真相混入共享定义。
    self.boundary_guard.inspect_draft(command.spec.clone())?;

    // [DefinitionUseBoundaryGuard.ensure_definition_truth(ContractDefinitionDraftSpec candidate)]
    // 防止 Use truth 被写成 Definition truth。
    self.definition_use_guard.ensure_definition_truth(command.spec.clone())?;

    // [IdGeneratorPort.new_contract_definition_id()]
    // 生成新的契约定义 ID。
    let definition_id = self.ports.new_contract_definition_id();

    // [ClockPort.now()]
    // 获取创建时间,domain 不直接读系统时间。
    let now = self.ports.now();

    // [ContractDefinition::create_draft(ContractDefinitionId definition_id, ContractDefinitionDraftSpec spec, ActorContext actor, Timestamp now)]
    // 创建草稿聚合,初始生命周期为 draft。
    let definition = ContractDefinition::create_draft(definition_id, command.spec, actor.clone(), now)?;

    // [ContractDefinitionRepository.insert(ContractDefinition definition)]
    // 插入定义真相。
    self.ports.insert(definition.clone()).await?;

    // [AuditLogPort.append(AuditRecord record)]
    // 记录创建动作审计。
    self.ports.append(AuditRecord::from_command(meta.clone(), actor.clone(), now)).await?;

    // [OutboxPort.append(FactOutboxEvent event)]
    // 写入草稿变化事实,不直接投递 L0-bus。
    self.ports.append(FactOutboxEvent::contract_draft_changed(definition.clone(), meta.clone(), now)).await?;

    Ok(ContractChangeReceipt::from_definition(definition, meta, now))
}).await
```

##### 事务边界

| 阶段 | 是否在事务内 | 说明 |
|---|---|---|
| 输入解析 / metadata 构造 | 否 | CLI / context 层完成 |
| boundary / scope policy | 是 | 与写入一致,避免规则通过后写入失败不一致 |
| repository insert | 是 | 定义真相写入 |
| audit append | 是 | 与真相写入一致 |
| outbox append | 是 | 与真相写入一致 |

##### 错误映射

| 错误 | 回滚 | 映射 |
|---|---|---|
| boundary / scope validation failed | 是 | `ApplicationError::Validation` |
| source ref invalid | 是 | `ApplicationError::PreconditionFailed` |
| idempotency conflict | 是 | `ApplicationError::Conflict` |
| repository / audit / outbox failed | 是 | `ApplicationError::Port` |

##### 状态与事件副作用

| 类型 | 副作用 |
|---|---|
| 状态 | 新建 `ContractDefinition` 进入 `Draft` |
| 审计 | 追加 create draft 审计 |
| 事件 | 写入 `ContractDraftChanged` outbox |

##### 测试切口

- 正向创建草稿,返回 `ContractChangeReceipt`。
- 越界正文被 `BoundaryGuard` 拒绝。
- 幂等键重复且 payload 不一致返回冲突。
- outbox 写入失败时 repository insert 回滚。

#### 9.2.2 `UpdateContractDraftFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `UpdateContractDraft` |
| 入口函数 | `ContractCommandApi.update_contract_draft(UpdateContractDraft command, ActorContext actor, CommandMetadata meta)` |
| 目标 | 更新草稿正文、版本和 fingerprint,写演进审计和 `ContractDraftChanged` outbox |

##### 函数级调用图

```text
[ContractCommandApi]
  | call update_contract_draft(UpdateContractDraft command, ActorContext actor, CommandMetadata meta)
  v
[ContractChangeService]
  | tx begin
  | call ContractDefinitionRepository.get_for_update(ContractDefinitionId definition_id)
  | call BoundaryGuard.inspect_draft(ContractDefinitionDraftSpec spec)
  v
[ContractDefinition]
  | call update_draft(ContractDefinitionDraftSpec spec, ActorContext actor, Timestamp now)
  v
[ContractDefinitionRepository + AuditLogPort + OutboxPort]
  | save definition with expected_version
  | append AuditRecord
  | append ContractDraftChanged
  | tx commit
```

##### 关键伪代码

```rust
// [UnitOfWork.transact(TransactionOperation operation)]
// 保护读取锁定、更新、审计和 outbox。
self.ports.transact(|tx| async move {
    // [ContractDefinitionRepository.get_for_update(ContractDefinitionId definition_id)]
    // 读取并锁定待更新定义。
    let mut definition = self.ports
        .get_for_update(command.definition_id)
        .await?
        .ok_or(ApplicationError::NotFound)?;

    // [BoundaryGuard.inspect_draft(ContractDefinitionDraftSpec spec)]
    // 更新内容仍需边界检查。
    self.boundary_guard.inspect_draft(command.spec.clone())?;

    // [ClockPort.now()]
    // 获取更新时间。
    let now = self.ports.now();

    // [ContractDefinition.update_draft(ContractDefinitionDraftSpec spec, ActorContext actor, Timestamp now)]
    // domain 校验当前状态可编辑并推进版本 / fingerprint。
    definition.update_draft(command.spec, actor.clone(), now)?;

    // [ContractDefinitionRepository.save(ContractDefinition definition, Version expected_version)]
    // 用 expected_version 做乐观锁。
    self.ports.save(definition.clone(), command.expected_version).await?;

    // [AuditLogPort.append(AuditRecord record)]
    // 记录更新审计。
    self.ports.append(AuditRecord::from_command(meta.clone(), actor.clone(), now)).await?;

    // [OutboxPort.append(FactOutboxEvent event)]
    // 写入草稿更新事实。
    self.ports.append(FactOutboxEvent::contract_draft_changed(definition.clone(), meta.clone(), now)).await?;

    Ok(ContractChangeReceipt::from_definition(definition, meta, now))
}).await
```

##### 事务边界

| 阶段 | 是否在事务内 | 说明 |
|---|---|---|
| `get_for_update` | 是 | 防止并发更新 |
| domain update | 是 | 依赖已锁定聚合 |
| repository save | 是 | 乐观锁保存 |
| audit / outbox | 是 | 与定义更新保持一致 |

##### 错误映射

| 错误 | 回滚 | 映射 |
|---|---|---|
| definition not found | 是 | `ApplicationError::NotFound` |
| non draft / non editable | 是 | `ApplicationError::PreconditionFailed` |
| expected version mismatch | 是 | `ApplicationError::Conflict` |
| boundary validation failed | 是 | `ApplicationError::Validation` |

##### 状态与事件副作用

| 类型 | 副作用 |
|---|---|
| 状态 | `Draft` 内部版本、fingerprint、updated_at 变化 |
| 审计 | 追加 update draft 审计 |
| 事件 | 写入 `ContractDraftChanged` outbox |

##### 测试切口

- 正向更新草稿。
- 已发布定义更新被拒绝。
- `expected_version` 冲突回滚。
- repository save 成功但 audit 失败时整体回滚。

#### 9.2.3 `SubmitContractForReviewFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `SubmitContractForReview` |
| 入口函数 | `ContractCommandApi.submit_contract_for_review(SubmitContractForReview command, ActorContext actor, CommandMetadata meta)` |
| 目标 | 将定义从 `Draft` 推进到评审状态,写审计和 `ContractReviewSubmitted` outbox |

##### 函数级调用图

```text
[ContractCommandApi]
  | call submit_contract_for_review(SubmitContractForReview command, ActorContext actor, CommandMetadata meta)
  v
[ContractChangeService]
  | tx begin
  | call ContractDefinitionRepository.get_for_update(ContractDefinitionId definition_id)
  v
[ContractDefinition]
  | call submit_for_review(ActorContext actor, Timestamp now)
  v
[ContractDefinitionRepository + AuditLogPort + OutboxPort]
  | save definition with expected_version
  | append AuditRecord
  | append ContractReviewSubmitted
  | tx commit
```

##### 关键伪代码

```rust
// [UnitOfWork.transact(TransactionOperation operation)]
// 评审提交和事件写入必须一致。
self.ports.transact(|tx| async move {
    // [ContractDefinitionRepository.get_for_update(ContractDefinitionId definition_id)]
    // 锁定定义。
    let mut definition = self.ports.get_for_update(command.definition_id).await?
        .ok_or(ApplicationError::NotFound)?;

    // [ClockPort.now()]
    // 获取提交时间。
    let now = self.ports.now();

    // [ContractDefinition.submit_for_review(ActorContext actor, Timestamp now)]
    // domain 执行 Draft -> InReview 迁移。
    definition.submit_for_review(actor.clone(), now)?;

    // [ContractDefinitionRepository.save(ContractDefinition definition, Version expected_version)]
    // 保存状态迁移。
    self.ports.save(definition.clone(), command.expected_version).await?;

    // [AuditLogPort.append(AuditRecord record)]
    // 记录提交评审审计。
    self.ports.append(AuditRecord::from_command(meta.clone(), actor.clone(), now)).await?;

    // [OutboxPort.append(FactOutboxEvent event)]
    // 写入评审提交事实。
    self.ports.append(FactOutboxEvent::contract_review_submitted(definition.clone(), meta.clone(), now)).await?;

    Ok(ContractReviewReceipt::from_definition(definition, meta, now))
}).await
```

##### 事务边界

| 阶段 | 是否在事务内 | 说明 |
|---|---|---|
| `get_for_update` | 是 | 锁定定义 |
| 状态迁移 | 是 | 防止状态被并发修改 |
| save / audit / outbox | 是 | 保持迁移事实一致 |

##### 错误映射

| 错误 | 回滚 | 映射 |
|---|---|---|
| definition not found | 是 | `ApplicationError::NotFound` |
| non draft state | 是 | `ApplicationError::PreconditionFailed` |
| version conflict | 是 | `ApplicationError::Conflict` |
| outbox failed | 是 | `ApplicationError::Port` |

##### 状态与事件副作用

| 类型 | 副作用 |
|---|---|
| 状态 | `Draft` -> `InReview` |
| 审计 | 追加 submit review 审计 |
| 事件 | 写入 `ContractReviewSubmitted` outbox |

##### 测试切口

- 草稿成功提交评审。
- 已发布定义提交评审被拒绝。
- 版本冲突不写事件。

#### 9.2.4 `PublishContractBaselineFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `PublishContractBaseline` |
| 入口函数 | `ContractCommandApi.publish_contract_baseline(PublishContractBaseline command, ActorContext actor, CommandMetadata meta)` |
| 目标 | 校验 gate、fingerprint 和兼容性后创建发布基线,写事实和 `ContractBaselinePublished` outbox |

##### 函数级调用图

```text
[ContractCommandApi]
  | call publish_contract_baseline(PublishContractBaseline command, ActorContext actor, CommandMetadata meta)
  v
[ContractReleaseService]
  | call GateDecisionPort.ensure_approved(ApprovedGateRef gate_ref, ActorContext actor)
  | tx begin
  | call ContractDefinitionRepository.get_for_update(ContractDefinitionId definition_id)
  | call ContractBaselineRepository.get_current_by_definition(ContractDefinitionId definition_id)
  v
[ReleasePolicy + FingerprintPolicy + ContractReleaseBaseline]
  | call FingerprintPolicy.ensure_publishable(ContractFingerprint fingerprint)
  | call ContractReleaseBaseline::create_draft(...)
  | call ContractReleaseBaseline.mark_released(ApprovedGateRef gate_ref, ActorContext actor, Timestamp now)
  v
[Repositories + AuditLogPort + OutboxPort]
  | save definition
  | insert baseline
  | append AuditRecord
  | append ContractBaselinePublished
  | tx commit
```

##### 关键伪代码

```rust
// [GateDecisionPort.ensure_approved(ApprovedGateRef gate_ref, ActorContext actor)]
// 在事务前读取外部门禁结果,失败则不进入写事务。
let gate = self.ports.ensure_approved(command.gate_ref.clone(), actor.clone()).await?;

// [UnitOfWork.transact(TransactionOperation operation)]
// 保护定义发布状态、基线、审计和 outbox。
self.ports.transact(|tx| async move {
    // [ContractDefinitionRepository.get_for_update(ContractDefinitionId definition_id)]
    // 锁定待发布定义。
    let mut definition = self.ports.get_for_update(command.definition_id).await?
        .ok_or(ApplicationError::NotFound)?;

    // [FingerprintPolicy.ensure_publishable(ContractFingerprint fingerprint)]
    // 校验发布 fingerprint 满足稳定规则。
    self.fingerprint_policy.ensure_publishable(command.expected_fingerprint.clone())?;

    // [IdGeneratorPort.new_contract_release_baseline_id()]
    // 生成发布基线 ID。
    let baseline_id = self.ports.new_contract_release_baseline_id();

    // [ClockPort.now()]
    // 获取发布时间。
    let now = self.ports.now();

    // [ContractReleaseBaseline::create_draft(ContractReleaseBaselineId baseline_id, ContractDefinition definition, CompatibilityStatus compatibility_status, ApprovedGateRef gate_ref, ActorContext actor, Timestamp now)]
    // 创建发布基线准备态。
    let mut baseline = ContractReleaseBaseline::create_draft(
        baseline_id,
        definition.clone(),
        CompatibilityStatus::ready_for_publish(),
        command.gate_ref.clone(),
        actor.clone(),
        now,
    )?;

    // [ContractReleaseBaseline.mark_released(ApprovedGateRef gate_ref, ActorContext actor, Timestamp now)]
    // 将基线标记为 released。
    baseline.mark_released(command.gate_ref.clone(), actor.clone(), now)?;

    // [ContractDefinition.publish(ApprovedGateRef gate_ref, ActorContext actor, Timestamp now)]
    // 将定义标记为已发布。
    definition.publish(command.gate_ref.clone(), actor.clone(), now)?;

    // [ContractDefinitionRepository.save(ContractDefinition definition, Version expected_version)]
    // 保存定义发布状态。
    self.ports.save(definition.clone(), command.expected_definition_version).await?;

    // [ContractBaselineRepository.insert(ContractReleaseBaseline baseline)]
    // 插入发布基线。
    self.ports.insert(baseline.clone()).await?;

    // [AuditLogPort.append(AuditRecord record)]
    // 记录发布审计。
    self.ports.append(AuditRecord::from_command(meta.clone(), actor.clone(), now)).await?;

    // [OutboxPort.append(FactOutboxEvent event)]
    // 写入发布基线事实。
    self.ports.append(FactOutboxEvent::contract_baseline_published(baseline.clone(), meta.clone(), now)).await?;

    Ok(ContractBaselineReceipt::from_baseline(baseline, meta, now))
}).await
```

##### 事务边界

| 阶段 | 是否在事务内 | 说明 |
|---|---|---|
| gate decision read | 否 | 外部读取不持有写事务 |
| definition lock | 是 | 防止并发发布 |
| baseline create / definition publish | 是 | 两者必须一致 |
| audit / outbox | 是 | 发布事实必须与基线一致 |

##### 错误映射

| 错误 | 回滚 | 映射 |
|---|---|---|
| gate not approved | 否 | `ApplicationError::PreconditionFailed` |
| definition not found | 是 | `ApplicationError::NotFound` |
| fingerprint mismatch / not publishable | 是 | `ApplicationError::PreconditionFailed` |
| version conflict | 是 | `ApplicationError::Conflict` |
| baseline insert / outbox failed | 是 | `ApplicationError::Port` |

##### 状态与事件副作用

| 类型 | 副作用 |
|---|---|
| 状态 | `ContractDefinition` 进入 published;`ContractReleaseBaseline` 进入 released |
| 审计 | 追加 publish baseline 审计 |
| 事件 | 写入 `ContractBaselinePublished` outbox;后续调度 `DeriveReleaseSnapshotJob` |

##### 测试切口

- approved gate 后发布成功。
- gate 未通过时不写基线。
- fingerprint 不匹配时不写基线。
- baseline 插入成功但 outbox 失败时整体回滚。

#### 9.2.5 `UpdateContractLifecycleFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `UpdateContractLifecycle` |
| 入口函数 | `ContractCommandApi.update_contract_lifecycle(UpdateContractLifecycle command, ActorContext actor, CommandMetadata meta)` |
| 目标 | 执行弃用、退役或 supersede,写审计和 `ContractLifecycleChanged` outbox |

##### 函数级调用图

```text
[ContractCommandApi]
  | call update_contract_lifecycle(UpdateContractLifecycle command, ActorContext actor, CommandMetadata meta)
  v
[ContractReleaseService]
  | tx begin
  | call ContractDefinitionRepository.get_for_update(ContractDefinitionId definition_id)
  v
[ContractDefinition]
  | call deprecate(LifecycleReason reason, ActorContext actor, Timestamp now)
  | or call retire(LifecycleReason reason, ActorContext actor, Timestamp now)
  | or call supersede(ContractDefinitionId new_definition_id, ActorContext actor, Timestamp now)
  v
[ContractDefinitionRepository + AuditLogPort + OutboxPort]
  | save definition with expected_version
  | append AuditRecord
  | append ContractLifecycleChanged
  | tx commit
```

##### 关键伪代码

```rust
// [UnitOfWork.transact(TransactionOperation operation)]
// 生命周期迁移、审计和 outbox 保持一致。
self.ports.transact(|tx| async move {
    // [ContractDefinitionRepository.get_for_update(ContractDefinitionId definition_id)]
    // 锁定定义。
    let mut definition = self.ports.get_for_update(command.definition_id).await?
        .ok_or(ApplicationError::NotFound)?;

    // [ClockPort.now()]
    // 获取迁移时间。
    let now = self.ports.now();

    match command.target_state {
        // [ContractDefinition.deprecate(LifecycleReason reason, ActorContext actor, Timestamp now)]
        // 标记弃用。
        ContractLifecycleState::Deprecated => definition.deprecate(command.reason.clone(), actor.clone(), now)?,

        // [ContractDefinition.retire(LifecycleReason reason, ActorContext actor, Timestamp now)]
        // 标记退役终态。
        ContractLifecycleState::Retired => definition.retire(command.reason.clone(), actor.clone(), now)?,

        // [ContractDefinition.supersede(ContractDefinitionId new_definition_id, ActorContext actor, Timestamp now)]
        // 标记被替代。
        ContractLifecycleState::Superseded => {
            let new_id = command.supersedes_definition_id.ok_or(ApplicationError::Validation)?;
            definition.supersede(new_id, actor.clone(), now)?
        }

        _ => return Err(ApplicationError::PreconditionFailed),
    }

    // [ContractDefinitionRepository.save(ContractDefinition definition, Version expected_version)]
    // 保存生命周期迁移。
    self.ports.save(definition.clone(), command.expected_version).await?;

    // [AuditLogPort.append(AuditRecord record)]
    // 记录生命周期迁移审计。
    self.ports.append(AuditRecord::from_command(meta.clone(), actor.clone(), now)).await?;

    // [OutboxPort.append(FactOutboxEvent event)]
    // 写入生命周期变更事实。
    self.ports.append(FactOutboxEvent::contract_lifecycle_changed(definition.clone(), meta.clone(), now)).await?;

    Ok(ContractLifecycleReceipt::from_definition(definition, meta, now))
}).await
```

##### 事务边界

| 阶段 | 是否在事务内 | 说明 |
|---|---|---|
| definition lock | 是 | 防止并发迁移 |
| domain lifecycle transition | 是 | 终态保护在 domain 内执行 |
| repository save | 是 | 乐观锁 |
| audit / outbox | 是 | 迁移事实一致 |

##### 错误映射

| 错误 | 回滚 | 映射 |
|---|---|---|
| definition not found | 是 | `ApplicationError::NotFound` |
| illegal lifecycle transition | 是 | `ApplicationError::PreconditionFailed` |
| missing supersede target | 是 | `ApplicationError::Validation` |
| version conflict | 是 | `ApplicationError::Conflict` |

##### 状态与事件副作用

| 类型 | 副作用 |
|---|---|
| 状态 | 进入 deprecated / retired / superseded |
| 审计 | 追加 lifecycle change 审计 |
| 事件 | 写入 `ContractLifecycleChanged` outbox |

##### 测试切口

- published -> deprecated 成功。
- published -> retired 成功。
- supersede 缺少替代 ID 被拒绝。
- retired 终态再次修改被拒绝。

### 9.3 Query API 处理流

#### 9.3.1 `CommonReadFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `GetContractDefinition`、`ListContractDefinitions`、`GetContractReleaseBaseline`、`GetContractReleaseSnapshot`、`GetContractPackage`、`GetContractGuideSample` |
| 入口函数 | `ContractQueryApi.*(QueryDto query, QueryMetadata meta)` |
| 目标 | 从 read model、repository 或 snapshot repository 返回只读视图 |

##### 函数级调用图

```text
[ContractQueryApi]
  | call query_function(QueryDto query, QueryMetadata meta)
  v
[ApplicationService]
  | readonly
  | call ProjectionStorePort / Repository get/list
  v
[ReadModel / Domain View]
  | call matches_query(...)
  | call is_read_only()
  v
[View DTO]
  | return ContractDefinitionView / ListView / BaselineView / SnapshotView / PackageView / GuideSampleView
```

##### 关键伪代码

```rust
// [ContractQueryApi.get_contract_definition(GetContractDefinition query, QueryMetadata meta)]
// 查询入口只读,不写审计和 outbox。
pub async fn get_contract_definition(...) -> Result<ContractDefinitionView, ApplicationError> {
    self.trace_service.get_contract_definition(query, meta).await
}

// [ContractTraceService.get_contract_definition(GetContractDefinition query, QueryMetadata meta)]
// 优先读取 read model;允许 fallback 时读取权威定义。
let read_model = self.ports.get_read_model(query.definition_id).await?;

if let Some(model) = read_model {
    // [ContractReadModel.to_view()]
    // 从只读模型生成视图。
    return Ok(model.to_view());
}

if query.allow_truth_fallback {
    // [ContractDefinitionRepository.get(ContractDefinitionId definition_id)]
    // fallback 只读权威定义,不得写 projection。
    let definition = self.ports.get(query.definition_id).await?
        .ok_or(ApplicationError::NotFound)?;
    return Ok(ContractDefinitionView::from_definition(definition));
}

Err(ApplicationError::PreconditionFailed)
```

##### 事务边界

| 阶段 | 是否在事务内 | 说明 |
|---|---|---|
| query input validation | 否 | 基础参数校验 |
| projection / repository read | 否 | 只读调用,不进入写事务 |
| fallback read | 否 | 只读 fallback,不得写 projection |

##### 错误映射

| 错误 | 映射 |
|---|---|
| invalid query | `ApplicationError::Validation` |
| target not found | `ApplicationError::NotFound` |
| read model unavailable and fallback disabled | `ApplicationError::PreconditionFailed` |
| repository / projection read failed | `ApplicationError::Port` |

##### 状态与事件副作用

| 类型 | 副作用 |
|---|---|
| 状态 | 无 |
| 审计 | 无 |
| 事件 | 无 |

##### 测试切口

- read model 命中返回视图。
- read model 缺失且 fallback 开启时读取权威定义。
- fallback 关闭时返回 precondition failed。
- 查询过程不调用 `save` / `append`。

#### 9.3.2 `TraceContractEvolutionFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `TraceContractEvolution` |
| 入口函数 | `ContractQueryApi.trace_contract_evolution(TraceContractEvolution query, Option<ActorContext> actor, QueryMetadata meta)` |
| 目标 | 返回定义演进、审计、快照和事实的追溯视图 |

##### 函数级调用图

```text
[ContractQueryApi]
  | call trace_contract_evolution(TraceContractEvolution query, Option<ActorContext> actor, QueryMetadata meta)
  v
[ContractTraceService]
  | readonly
  | call ReferenceRepository / ProjectionStorePort get trace projection
  | call AuditLogPort.list_by_resource(ResourceRef resource_ref, PageRequest page)
  | call SnapshotRepository.list_consumption_refs(ContractReleaseBaselineId baseline_id)
  v
[ContractTraceProjection]
  | call contains_snapshot(ReleaseSnapshotRef snapshot_ref)
  | expose projection_state
  v
[ContractTraceView]
```

##### 关键伪代码

```rust
// [ContractTraceService.trace_contract_evolution(TraceContractEvolution query, Option<ActorContext> actor, QueryMetadata meta)]
// 追溯查询是只读组合查询。
pub async fn trace_contract_evolution(...) -> Result<ContractTraceView, ApplicationError> {
    // [ReferenceRepository.get_trace_projection(ContractDefinitionId definition_id)]
    // 读取追溯投影。具体 repository 方法可在 Step 11 收敛。
    let projection = self.ports.get_trace_projection(query.definition_id).await?
        .ok_or(ApplicationError::NotFound)?;

    if projection.projection_state.is_stale_or_rebuilding() {
        return Err(ApplicationError::PreconditionFailed);
    }

    // [AuditLogPort.list_by_resource(ResourceRef resource_ref, PageRequest page)]
    // 按需读取审计摘要。
    let audit_page = if query.include_audit {
        Some(self.ports.list_by_resource(ResourceRef::definition(query.definition_id), query.page.clone()).await?)
    } else {
        None
    };

    // [ContractTraceView::from_projection(ContractTraceProjection projection, Option<AuditRecordPage> audit_page)]
    // 组装只读追溯视图。
    Ok(ContractTraceView::from_projection(projection, audit_page))
}
```

##### 事务边界

| 阶段 | 是否在事务内 | 说明 |
|---|---|---|
| projection read | 否 | 只读 |
| audit read | 否 | 只读 |
| view assembly | 否 | 内存组装 |

##### 错误映射

| 错误 | 映射 |
|---|---|
| projection not found | `ApplicationError::NotFound` |
| projection stale / rebuilding | `ApplicationError::PreconditionFailed` |
| audit / projection read failed | `ApplicationError::Port` |

##### 状态与事件副作用

| 类型 | 副作用 |
|---|---|
| 状态 | 无 |
| 审计 | 无 |
| 事件 | 无 |

##### 测试切口

- active projection 返回追溯视图。
- stale projection 返回 precondition failed。
- include_audit=false 时不调用 `AuditLogPort`。

#### 9.3.3 `GetCompatibilityTraceFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `GetCompatibilityTrace` |
| 入口函数 | `ContractQueryApi.get_compatibility_status(GetCompatibilityTrace query, Option<ActorContext> actor, QueryMetadata meta)` |
| 目标 | 返回兼容性状态和兼容追溯项 |

##### 函数级调用图

```text
[ContractQueryApi]
  | call get_compatibility_status(GetCompatibilityTrace query, Option<ActorContext> actor, QueryMetadata meta)
  v
[ContractCompatibilityService]
  | readonly
  | call ReferenceRepository / ProjectionStorePort get compatibility trace
  v
[CompatibilityTraceIndex]
  | call append_trace(...) is not used in query path
  | read current compatibility_status
  v
[CompatibilityTraceView]
```

##### 关键伪代码

```rust
// [ContractCompatibilityService.get_compatibility_status(GetCompatibilityTrace query, Option<ActorContext> actor, QueryMetadata meta)]
// 兼容性查询只读,不得刷新索引。
pub async fn get_compatibility_status(...) -> Result<CompatibilityTraceView, ApplicationError> {
    // [ReferenceRepository.get_compatibility_trace(ContractDefinitionId definition_id)]
    // 读取兼容追溯索引。具体 repository 方法可在 Step 11 收敛。
    let trace = self.ports.get_compatibility_trace(query.definition_id).await?
        .ok_or(ApplicationError::NotFound)?;

    if trace.trace_state.is_stale_or_rebuilding() {
        return Err(ApplicationError::PreconditionFailed);
    }

    // [CompatibilityTraceView::from_trace_index(CompatibilityTraceIndex trace)]
    // 组装兼容性视图。
    Ok(CompatibilityTraceView::from_trace_index(trace, query.include_validation_report))
}
```

##### 事务边界

| 阶段 | 是否在事务内 | 说明 |
|---|---|---|
| compatibility trace read | 否 | 只读 |
| view assembly | 否 | 内存组装 |

##### 错误映射

| 错误 | 映射 |
|---|---|
| trace not found | `ApplicationError::NotFound` |
| trace stale / rebuilding | `ApplicationError::PreconditionFailed` |
| projection read failed | `ApplicationError::Port` |

##### 状态与事件副作用

| 类型 | 副作用 |
|---|---|
| 状态 | 无 |
| 审计 | 无 |
| 事件 | 无 |

##### 测试切口

- active compatibility trace 返回视图。
- stale trace 返回 precondition failed。
- 查询路径不调用 validation runner。

### 9.4 Outbound Event 处理流

#### 9.4.1 Event 与来源 Flow 绑定表

| Event | 来源 flow | outbox 写入位置 | relay 发布位置 |
|---|---|---|---|
| `ContractDraftChanged` | `CreateContractDraftFlow` / `UpdateContractDraftFlow` | 来源 command 写事务内 | `OutboxRelayFlow` |
| `ContractReviewSubmitted` | `SubmitContractForReviewFlow` | 来源 command 写事务内 | `OutboxRelayFlow` |
| `ContractBaselinePublished` | `PublishContractBaselineFlow` | 来源 command 写事务内 | `OutboxRelayFlow` |
| `ContractLifecycleChanged` | `UpdateContractLifecycleFlow` | 来源 command 写事务内 | `OutboxRelayFlow` |
| `ContractCompatibilityStatusChanged` | `ValidateContractChangeJobFlow` | job 写事务内 | `OutboxRelayFlow` |
| `ContractSnapshotReady` | `DeriveReleaseSnapshotJobFlow` | job 写事务内 | `OutboxRelayFlow` |
| `ContractFactPublished` | `PublishContractFactJobFlow` / `OutboxRelayFlow` | fact job 或 relay 状态更新时 | `OutboxRelayFlow` |

#### 9.4.2 `OutboxMaterializeFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | 7 个 outbound event |
| 入口函数 | 来源 service 内部调用 `OutboxPort.append(FactOutboxEvent event)` |
| 目标 | 在来源真相写事务内生成待发布事实事件 |

##### 函数级调用图

```text
[Source Application Service]
  | tx begin
  | save domain truth
  | append audit
  v
[FactOutboxEvent]
  | call FactOutboxEvent::<event_factory>(SourceObject source, CommandMetadata meta, Timestamp now)
  v
[OutboxPort]
  | call append(FactOutboxEvent event)
  | tx commit
```

##### 关键伪代码

```rust
// [FactOutboxEvent::contract_baseline_published(ContractReleaseBaseline baseline, CommandMetadata meta, Timestamp now)]
// 从已提交来源对象构造 CloudEvent payload 和业务幂等 key。
let event = FactOutboxEvent::contract_baseline_published(baseline.clone(), meta.clone(), now)?;

// [OutboxPort.append(FactOutboxEvent event)]
// 与来源真相同事务写入 outbox,不直接投递 L0-bus。
self.ports.append(event).await?;
```

##### 事务边界

| 阶段 | 是否在事务内 | 说明 |
|---|---|---|
| domain truth save | 是 | 来源 flow 决定 |
| event payload materialize | 是 | 基于已保存或即将保存的事实对象 |
| outbox append | 是 | 与来源 truth 一致 |

##### 错误映射

| 错误 | 回滚 | 映射 |
|---|---|---|
| payload 构造失败 | 是 | `ApplicationError::Validation` |
| outbox append 失败 | 是 | `ApplicationError::Port` |

##### 状态与事件副作用

| 类型 | 副作用 |
|---|---|
| 状态 | 不额外修改 domain 状态 |
| 审计 | 由来源 flow 负责 |
| 事件 | outbox 增加 pending event |

##### 测试切口

- 每个来源 flow 成功时写入正确 event type。
- event 幂等 key 与 Step 8 一致。
- outbox append 失败时来源 truth 回滚。

#### 9.4.3 `OutboxRelayFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `OutboxRelayWorker`、`ContractFactPublished` |
| 入口函数 | `OutboxRelayWorker.run_once(OutboxRelayWorkerInput input)` |
| 目标 | 拉取 pending outbox event,发布到 L0-bus 边界,更新 outbox 状态 |

##### 函数级调用图

```text
[OutboxRelayWorker]
  | call run_once(OutboxRelayWorkerInput input)
  v
[OutboxPort]
  | call fetch_pending(BatchSize batch_size)
  v
[EventPublisherPort]
  | call publish(FactOutboxEvent event)
  v
[OutboxPort]
  | call mark_published(OutboxEventId event_id, Timestamp published_at)
  | or call mark_failed(OutboxEventId event_id, OutboxFailureReason reason, Timestamp failed_at)
```

##### 关键伪代码

```rust
// [OutboxPort.fetch_pending(BatchSize batch_size)]
// 拉取一批待发布事件。
let events = self.ports.fetch_pending(input.batch_size).await?;

for event in events {
    // [EventPublisherPort.publish(FactOutboxEvent event)]
    // 将事件交给 L0-bus 边界;不实现 bus runtime。
    match self.ports.publish(event.clone()).await {
        Ok(receipt) => {
            // [ClockPort.now()]
            // 获取发布时间。
            let published_at = self.ports.now();

            // [OutboxPort.mark_published(OutboxEventId event_id, Timestamp published_at)]
            // 标记单条事件已发布。
            self.ports.mark_published(event.event_id, published_at).await?;
        }
        Err(error) => {
            // [ClockPort.now()]
            // 获取失败时间。
            let failed_at = self.ports.now();

            // [OutboxPort.mark_failed(OutboxEventId event_id, OutboxFailureReason reason, Timestamp failed_at)]
            // 记录单条失败,不中断整批。
            self.ports.mark_failed(event.event_id, OutboxFailureReason::from(error), failed_at).await?;
        }
    }
}
```

##### 事务边界

| 阶段 | 是否在事务内 | 说明 |
|---|---|---|
| fetch pending | 否 / 短读事务 | 不持有长事务调用 publisher |
| publish | 否 | 外部边界调用 |
| mark published / failed | 是 | 单条状态更新 |

##### 错误映射

| 错误 | 处理 | 映射 |
|---|---|---|
| fetch pending failed | 整批停止 | `ApplicationError::Port` |
| single publish failed | 标记单条 failed,继续下一条 | 不终止整批 |
| mark published failed | 返回 `ApplicationError::Port` | 需要后续 replay |

##### 状态与事件副作用

| 类型 | 副作用 |
|---|---|
| 状态 | outbox pending -> published / failed |
| 审计 | relay 可记录运维摘要,不写业务审计 |
| 事件 | 不创建新业务事实;`ContractFactPublished` 可作为发布边界事实摘要 |

##### 测试切口

- pending 事件发布成功后标记 published。
- 单条发布失败标记 failed 并继续后续事件。
- publisher 不可用时不删除 outbox。

### 9.5 Operations Job 处理流

#### 9.5.1 `ValidateContractChangeJobFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `ValidateContractChangeJob` |
| 入口函数 | `ValidateContractChangeJob.run(ValidateContractChangeJobInput input, ActorContext actor, CommandMetadata meta)` |
| 目标 | 执行契约变化校验,更新兼容性状态和追溯索引 |

##### 函数级调用图

```text
[ValidateContractChangeJob]
  | call run(ValidateContractChangeJobInput input, ActorContext actor, CommandMetadata meta)
  v
[ContractCompatibilityService]
  | call validate_contract_change(ValidateContractChange command, ActorContext actor, CommandMetadata meta)
  | call ContractDefinitionRepository.get(ContractDefinitionId definition_id)
  | call ContractValidationRunnerPort.validate_definition_source(...)
  | call FingerprintRunnerPort.calculate_definition_fingerprint(...)
  v
[CompatibilityStatus + CompatibilityTraceIndex]
  | call mark_compatible(...) or mark_incompatible(...)
  v
[ReferenceRepository + AuditLogPort + OutboxPort]
  | save trace index
  | append audit
  | append ContractCompatibilityStatusChanged
```

##### 关键伪代码

```rust
// [ValidateContractChangeJob.run(ValidateContractChangeJobInput input, ActorContext actor, CommandMetadata meta)]
// Job 只负责转成 application command。
let command = ValidateContractChange::from_job_input(input)?;

// [ContractCompatibilityService.validate_contract_change(ValidateContractChange command, ActorContext actor, CommandMetadata meta)]
// 兼容性服务编排 repository、toolchain 和 projection 写入。
self.compatibility_service.validate_contract_change(command, actor, meta).await
```

##### 事务边界

| 阶段 | 是否在事务内 | 说明 |
|---|---|---|
| toolchain validation | 否 | 避免长事务持有外部工具执行 |
| compatibility status / trace write | 是 | 写追溯、审计和 outbox |

##### 错误映射

| 错误 | 映射 |
|---|---|
| definition not found | `ApplicationError::NotFound` |
| validation runner failed | `ApplicationError::Port` |
| validation report failed | `ApplicationError::PreconditionFailed` |

##### 状态与事件副作用

| 类型 | 副作用 |
|---|---|
| 状态 | `CompatibilityStatus` 更新 |
| 审计 | 追加 validation job 审计 |
| 事件 | 状态变化时写入 `ContractCompatibilityStatusChanged` |

##### 测试切口

- 校验通过生成 compatible 追溯。
- 校验失败生成 incompatible 追溯。
- runner 失败不写兼容结论。

#### 9.5.2 `DeriveReleaseSnapshotJobFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `DeriveReleaseSnapshotJob` |
| 入口函数 | `DeriveReleaseSnapshotJob.run(DeriveReleaseSnapshotJobInput input, ActorContext actor, CommandMetadata meta)` |
| 目标 | 从发布基线导出快照资产,保存快照元数据并写 `ContractSnapshotReady` |

##### 函数级调用图

```text
[DeriveReleaseSnapshotJob]
  | call run(DeriveReleaseSnapshotJobInput input, ActorContext actor, CommandMetadata meta)
  v
[ContractSnapshotService]
  | call derive_release_snapshot(DeriveReleaseSnapshot command, ActorContext actor, CommandMetadata meta)
  | call ContractBaselineRepository.get(ContractReleaseBaselineId baseline_id)
  | call SnapshotExporterPort.export_release_snapshot(SnapshotExportRequest request)
  | call ReleaseSnapshotStorePort.write_snapshot_document(...)
  v
[ContractReleaseSnapshot]
  | call ContractReleaseSnapshot::from_baseline(...)
  | call mark_ready(ContractFingerprint fingerprint, SnapshotBlobRef body_ref, Timestamp now)
  v
[SnapshotRepository + AuditLogPort + OutboxPort]
  | insert snapshot
  | append audit
  | append ContractSnapshotReady
```

##### 关键伪代码

```rust
// [DeriveReleaseSnapshotJob.run(DeriveReleaseSnapshotJobInput input, ActorContext actor, CommandMetadata meta)]
// Job 转换输入为快照派生命令。
let command = DeriveReleaseSnapshot::from_job_input(input)?;

// [ContractSnapshotService.derive_release_snapshot(DeriveReleaseSnapshot command, ActorContext actor, CommandMetadata meta)]
// application service 编排导出、资产写入和元数据保存。
self.snapshot_service.derive_release_snapshot(command, actor, meta).await
```

##### 事务边界

| 阶段 | 是否在事务内 | 说明 |
|---|---|---|
| baseline read | 否 / 只读 | 读取发布基线 |
| snapshot export | 否 | 工具链执行不持有写事务 |
| snapshot asset write | 否 / asset 事务 | 写快照资产 |
| snapshot metadata / audit / outbox | 是 | 保存 ready 快照和事件 |

##### 错误映射

| 错误 | 映射 |
|---|---|
| baseline not found | `ApplicationError::NotFound` |
| baseline not releasable | `ApplicationError::PreconditionFailed` |
| exporter / snapshot store failed | `ApplicationError::Port` |

##### 状态与事件副作用

| 类型 | 副作用 |
|---|---|
| 状态 | `ContractReleaseSnapshot` building -> ready |
| 审计 | 追加 snapshot derive 审计 |
| 事件 | 写入 `ContractSnapshotReady` |

##### 测试切口

- released baseline 派生快照成功。
- exporter 失败时不写 ready 元数据。
- snapshot metadata 保存成功但 outbox 失败时回滚元数据。

#### 9.5.3 `RebuildContractIndexJobFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `RebuildContractIndexJob` |
| 入口函数 | `RebuildContractIndexJob.run(RebuildContractIndexJobInput input, ActorContext actor, CommandMetadata meta)` |
| 目标 | 重建 read model、trace projection 和 projection watermark |

##### 函数级调用图

```text
[RebuildContractIndexJob]
  | call run(RebuildContractIndexJobInput input, ActorContext actor, CommandMetadata meta)
  v
[ContractOperationsService]
  | call rebuild_contract_index(RebuildContractIndex command, ActorContext actor, CommandMetadata meta)
  | call ContractDefinitionRepository.list(...)
  | call ContractBaselineRepository.list_by_definition(...)
  v
[ContractReadModel / ContractTraceProjection]
  | call ContractReadModel::from_definition(...)
  | call ContractTraceProjection::from_trace_sources(...)
  v
[ProjectionStorePort]
  | call replace_read_models(ContractReadModelBatch batch, ProjectionRebuildId rebuild_id)
  | call replace_trace_projections(ContractTraceProjectionBatch batch, ProjectionRebuildId rebuild_id)
```

##### 关键伪代码

```rust
// [ContractOperationsService.rebuild_contract_index(RebuildContractIndex command, ActorContext actor, CommandMetadata meta)]
// 重建 projection,不得改写真相。
let definitions = self.ports.list(command.query, command.page).await?;

// [ContractReadModel::from_definition(ContractReadModelId read_model_id, ContractDefinition definition, ActorContext actor, Timestamp now)]
// 从权威定义生成只读模型。
let read_models = definitions
    .items
    .into_iter()
    .map(|definition| ContractReadModel::from_definition(self.ports.new_read_model_id(), definition, actor.clone(), now))
    .collect::<Result<Vec<_>, _>>()?;

// [ProjectionStorePort.replace_read_models(ContractReadModelBatch batch, ProjectionRebuildId rebuild_id)]
// 批量替换只读模型。
self.ports.replace_read_models(ContractReadModelBatch::new(read_models), command.rebuild_id).await?;
```

##### 事务边界

| 阶段 | 是否在事务内 | 说明 |
|---|---|---|
| truth scan | 否 / 只读 | 不锁全量真相 |
| projection build | 否 | 内存构建 |
| projection replace | 是 | 批次替换和 watermark 一致 |

##### 错误映射

| 错误 | 映射 |
|---|---|
| rebuild scope invalid | `ApplicationError::Validation` |
| truth read failed | `ApplicationError::Port` |
| projection replace failed | `ApplicationError::Port` |

##### 状态与事件副作用

| 类型 | 副作用 |
|---|---|
| 状态 | projection rebuilding -> active |
| 审计 | 追加 operations 审计 |
| 事件 | 默认不发业务事件 |

##### 测试切口

- 全量重建成功并更新 watermark。
- 单定义重建只影响相关 projection。
- projection 写失败不改写真相。

#### 9.5.4 `RecalculateFingerprintJobFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `RecalculateFingerprintJob` |
| 入口函数 | `RecalculateFingerprintJob.run(RecalculateFingerprintJobInput input, ActorContext actor, CommandMetadata meta)` |
| 目标 | 复算定义或快照 fingerprint,用于漂移判断 |

##### 函数级调用图

```text
[RecalculateFingerprintJob]
  | call run(RecalculateFingerprintJobInput input, ActorContext actor, CommandMetadata meta)
  v
[ContractOperationsService]
  | call recalculate_fingerprint(RecalculateFingerprint command, ActorContext actor, CommandMetadata meta)
  | call FingerprintRunnerPort.calculate_definition_fingerprint(...)
  | or call FingerprintRunnerPort.calculate_snapshot_fingerprint(...)
  v
[FingerprintPolicy]
  | call compare(ContractFingerprint expected, ContractFingerprint actual)
  | call detects_drift(ContractFingerprint before, ContractFingerprint after)
  v
[AuditLogPort]
  | append operations audit
```

##### 关键伪代码

```rust
// [FingerprintRunnerPort.calculate_definition_fingerprint(DefinitionFingerprintRequest request)]
// 计算 canonical fingerprint。
let result = self.ports.calculate_definition_fingerprint(request).await?;

// [FingerprintPolicy.compare(ContractFingerprint expected, ContractFingerprint actual)]
// 对比已有指纹和复算结果。
let comparison = self.fingerprint_policy.compare(expected, result.fingerprint.clone());

// [AuditLogPort.append(AuditRecord record)]
// 记录复算结果摘要,不直接改写发布真相。
self.ports.append(AuditRecord::from_fingerprint_result(result.clone(), comparison, meta)).await?;
```

##### 事务边界

| 阶段 | 是否在事务内 | 说明 |
|---|---|---|
| fingerprint calculation | 否 | 工具链执行不持有写事务 |
| audit append | 是 | 记录运维摘要 |

##### 错误映射

| 错误 | 映射 |
|---|---|
| target not found | `ApplicationError::NotFound` |
| unsupported algorithm | `ApplicationError::Validation` |
| runner failed | `ApplicationError::Port` |

##### 状态与事件副作用

| 类型 | 副作用 |
|---|---|
| 状态 | 不直接修改 definition / snapshot 真相 |
| 审计 | 追加 fingerprint recalculation 审计 |
| 事件 | 默认不发业务事件;漂移事件是否需要另立由 Step 18 跟踪 |

##### 测试切口

- 定义 fingerprint 复算成功。
- 快照 fingerprint 复算成功。
- 算法不支持返回 validation。
- 复算发现漂移但不直接改写真相。

#### 9.5.5 `PublishContractFactJobFlow`

##### 入口与目标

| 项 | 内容 |
|---|---|
| 对应协议 | `PublishContractFactJob` |
| 入口函数 | `PublishContractFactJob.run(PublishContractFactJobInput input, ActorContext actor, CommandMetadata meta)` |
| 目标 | 整理待发布事实,写入 outbox,更新事实输出状态 |

##### 函数级调用图

```text
[PublishContractFactJob]
  | call run(PublishContractFactJobInput input, ActorContext actor, CommandMetadata meta)
  v
[ContractFactService]
  | call publish_contract_fact(PublishContractFact command, ActorContext actor, CommandMetadata meta)
  | tx begin
  | load pending fact records
  v
[ContractFactRecord]
  | call mark_queued(...)
  v
[Fact repository + OutboxPort + AuditLogPort]
  | save fact state
  | append FactOutboxEvent
  | append audit
  | tx commit
```

##### 关键伪代码

```rust
// [ContractFactService.publish_contract_fact(PublishContractFact command, ActorContext actor, CommandMetadata meta)]
// 整理事实到 outbox,不直接调用 EventPublisherPort。
self.ports.transact(|tx| async move {
    // [FactRepository.get_pending(...)]
    // 读取待处理事实。具体 repository 在 Step 11 收敛。
    let facts = self.ports.get_pending_facts(command.fact_id, command.batch_size).await?;

    for mut fact in facts {
        // [ContractFactRecord.mark_queued(ActorContext actor, Timestamp now)]
        // 标记事实已进入 outbox 队列。
        fact.mark_queued(actor.clone(), now)?;

        // [OutboxPort.append(FactOutboxEvent event)]
        // 写入待发布 outbox。
        self.ports.append(FactOutboxEvent::from_fact(fact.clone(), meta.clone(), now)).await?;
    }

    Ok(ContractFactReceipt::from_batch(...))
}).await
```

##### 事务边界

| 阶段 | 是否在事务内 | 说明 |
|---|---|---|
| pending fact load | 是 | 与状态更新一致 |
| fact state update | 是 | pending -> queued |
| outbox append | 是 | 与 fact state 一致 |
| audit append | 是 | 运维审计 |

##### 错误映射

| 错误 | 回滚 | 映射 |
|---|---|---|
| fact not found | 是 | `ApplicationError::NotFound` |
| fact not publishable | 是 | `ApplicationError::PreconditionFailed` |
| outbox append failed | 是 | `ApplicationError::Port` |

##### 状态与事件副作用

| 类型 | 副作用 |
|---|---|
| 状态 | fact pending -> queued |
| 审计 | 追加 fact publish job 审计 |
| 事件 | 写入 fact outbox event |

##### 测试切口

- 单条事实整理成功。
- 批量事实整理成功。
- 非 pending 事实被拒绝。
- outbox 失败回滚 fact 状态。

#### 9.5.6 `OutboxRelayWorkerFlow`

`OutboxRelayWorkerFlow` 已在 §9.4.3 展开。本节只固定 job 协议入口与 §9.4 的复用关系。

| 项 | 内容 |
|---|---|
| 对应协议 | `OutboxRelayWorker` |
| 入口函数 | `OutboxRelayWorker.run_once(OutboxRelayWorkerInput input)` |
| 复用处理流 | §9.4.3 `OutboxRelayFlow` |
| 主要边界 | 不删除失败事件,不实现 L0-bus runtime |

### 9.6 Step 9 统一复核

#### 9.6.1 处理流覆盖复核

| 类别 | 协议数量 | 处理流覆盖 | 结果 |
|---|---:|---|---|
| Command API | 5 | 5 个独立 flow | 通过 |
| Query API | 8 | 1 个通用 flow + 2 个关键 query flow | 通过 |
| Outbound Event | 7 | 来源绑定表 + materialize flow + relay flow | 通过 |
| Operations Job | 6 | 5 个 job flow + relay 复用 flow | 通过 |

#### 9.6.2 调用链复核

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否回指 Step 8 协议 | 通过 | 每个 flow 均列对应协议 |
| 是否回指 Step 6 service / domain 函数 | 通过 | Command / Job flow 均使用 service 和 domain 方法名 |
| 是否回指 Step 7 port | 通过 | repository、outbox、audit、toolchain、projection、publisher 均按 port 表达 |
| 是否避免“调用数据库 / 工具链”泛化表达 | 通过 | 均写出具体 port 方法或待 Step 11 收敛的 repository 读方法 |
| 查询路径是否只读 | 通过 | query flow 无 save / outbox / audit 写入 |
| event 是否避免实现 bus runtime | 通过 | relay 只调用 `EventPublisherPort` |

#### 9.6.3 事务边界复核

| 处理族 | 是否明确事务 | 结果 |
|---|---|---|
| Command 写路径 | 是 | `UnitOfWork.transact(...)` 包住 truth / audit / outbox |
| Query 读路径 | 是 | 无写事务 |
| Event materialize | 是 | 与来源写事务共用 |
| Outbox relay | 是 | publish 在事务外;状态更新单条事务 |
| Job | 是 | 工具链在事务外;结果写入在事务内 |

#### 9.6.4 Step 10 / 11 / 16 交接项

| 后续 Step | 需要承接的内容 | 本步交付物 |
|---|---|---|
| Step 10 状态机 | 状态集合和转换矩阵 | 本步列出触发状态变化的处理流 |
| Step 11 持久化、事务与一致性 | 事务隔离、锁、repository 方法、projection 替换策略 | 本步列出每个 flow 的事务范围和 port 调用 |
| Step 12 错误恢复 | 错误分类、回滚、重试和恢复策略 | 本步列出错误映射和回滚口径 |
| Step 13 幂等并发 | idempotency key、expected version、job run id、relay 去重 | 本步列出幂等和冲突触发点 |
| Step 16 测试切口 | 正向、异常、回滚、只读和 port failure 测试 | 本步列出每个 flow 最小测试切口 |

#### 9.6.5 Step 13 回补:写路径幂等调用外壳

Step 13 明确 Command / Job 幂等需要 `IdempotencyRepository` 参与处理流。本节作为 Step 13 对 Step 9 的函数流回补,正式文档组装时应补入所有 Command / Job 写路径的统一外壳。

```text
[Command / Job Flow]
  | compute canonical payload fingerprint
  v
[UnitOfWork.transact(...)]
  | open write transaction
  v
[IdempotencyRepository.reserve(...)]
  |-- Replay(receipt)        -> return receipt
  |-- PayloadMismatch        -> ApplicationError::Conflict
  |-- InProgress             -> ApplicationError::Conflict
  |-- Reserved               -> continue
  v
[UnitOfWork.transact(...)]
  | write truth / audit / outbox
  | complete idempotency record with receipt
  v
[Receipt]
```

统一伪代码骨架:

```rust
// [UnitOfWork.transact(...)]
// 在同一事务内完成幂等 reserve、truth、audit、outbox 和幂等 complete。
self.ports.unit_of_work.transact(|| async {
    // [IdempotencyRepository.reserve(...)]
    // 根据 scope、key、operation 和 canonical payload fingerprint 预占幂等键。
    match self.ports.idempotency.reserve(scope, key, operation, payload_fingerprint, meta.request.request_id, now).await? {
        IdempotencyDecision::Replay(receipt) => return Ok(receipt.into()),
        IdempotencyDecision::PayloadMismatch => return Err(ApplicationError::Conflict),
        IdempotencyDecision::InProgress => return Err(ApplicationError::Conflict),
        IdempotencyDecision::Reserved => {}
    }

    // ... domain / repository / audit / outbox writes ...

    // [IdempotencyRepository.complete(...)]
    // 保存可重放 receipt;如果失败,整个写事务失败。
    self.ports.idempotency.complete(scope, key, receipt.clone(), now).await?;

    Ok(receipt)
}).await
```

适用范围:

| 处理流 | 是否适用 | 说明 |
|---|---|---|
| 5 个 Command flow | 是 | 所有改写真相的同步入口必须使用 |
| 5 个 Operations Job flow | 是 | 使用 `JobRunId` / `IdempotencyKey` 和业务目标计算幂等键 |
| `OutboxRelayFlow` | 部分适用 | 单条 event 主要依赖 CloudEvent id + outbox 状态,不使用 command receipt replay |
| Query flow | 否 | query 不改写真相,不需要幂等记录 |

---

## 10. 回填草稿

正式 `03-详细设计.md` 回填时应遵守:

```text
1. §8 按处理流族组织,不按协议 schema 重复 Step 8。
2. 每个写路径必须保留调用图、关键伪代码、事务边界、错误映射、状态与事件副作用、测试切口。
3. 普通查询可复用 CommonReadFlow,但必须列明每个 query 的绑定关系。
4. Outbound Event 不写成 bus 投递实现,只写 outbox materialize 和 relay boundary。
5. Command / Job 写路径必须补入 Step 13 回补的幂等调用外壳。
6. Step 10 / 11 / 16 回填时必须从本文件的状态变化、事务边界和测试切口继续展开。
```

建议正式文档 §8 结构:

| 正式章节位置 | 回填内容 |
|---|---|
| `8.1 处理流总览` | 处理流总表、统一调用图、统一事务规则 |
| `8.2 Command 写路径` | 5 个 command flow |
| `8.3 Query 读路径` | common read、trace、compatibility flow |
| `8.4 Outbound Event 输出` | event 绑定表、materialize、relay |
| `8.5 Operations Job` | validation、snapshot、rebuild、fingerprint、fact、relay |
| `8.6 处理流复核` | 调用链、事务、状态、事件、测试切口交接 |

---

## 11. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 普通 Query 是否每个单独展开完整伪代码 | A. 全部单独展开; B. 复用 CommonReadFlow,关键 query 单独展开 | B | 普通 query 只读结构高度一致,复用更清晰;追溯和兼容因 stale 边界独立展开 | 已确认采用 B |
| Event 是否每个单独展开完整业务流程 | A. 每个 event 单独展开; B. 来源 flow + materialize + relay | B | event 本身不是独立业务入口,来源写事务和 relay 边界更重要 | 已确认采用 B |
| Toolchain 执行是否放在写事务内 | A. 放入事务; B. 事务外执行,结果写入再开事务 | B | 避免长事务持有外部工具执行 | 已确认采用 B |
| Relay 单条失败是否终止整批 | A. 终止整批; B. 标记单条失败并继续 | B | 防止单条坏事件阻塞整批传播;失败保留可恢复 | 已确认采用 B |

---

## 12. 进入下一步条件

Step 9 完成后必须满足:

- 所有协议都能映射到处理流。
- 每个关键处理流都有 ASCII 调用图。
- 每个关键处理流都有 Rust 风格关键伪代码。
- 写路径明确事务开始、提交、回滚和 outbox 写入。
- 查询路径明确只读边界。
- Job 明确工具链、projection、snapshot、fact 和 relay 调用边界。
- 每个处理流都有错误映射、状态与事件副作用、测试切口。
- 可以进入 Step 10 “定义状态机与转换矩阵”。
