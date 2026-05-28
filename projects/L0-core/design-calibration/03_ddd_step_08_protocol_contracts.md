# Step 8. 定义 API / Command / Query / Event / Job 协议契约

> 本文件是 `projects/L0-core/03-详细设计.md` 的 Step 8 中间产物。
> 本步只收稳 Command / Query / Outbound Event / Operations Job 的协议形态、DTO schema、错误映射、幂等和审计要求。
> 本步不写逐接口函数级处理流,不写事务伪代码,不写持久化结构,不实现 L0-bus 运行时。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填,本文件不替代正式详细设计。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 8
- 回填章节: `projects/L0-core/03-详细设计.md` §7 API / Command / Query / Event / Job 协议契约 / §6 全局对象、Trait、API 索引

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `02-概要设计.md` §7 | 已确认 Command API、Query API、Outbound Event、Operations Job 骨架 | 作为协议覆盖清单 |
| Step 4 实现单元与文件布局 | 已确认 `crates/contracts/src/commands.rs`、`queries.rs`、`events.rs`、`jobs.rs`、CLI 和 jobs 文件布局 | 作为 DTO 和入口落文件依据 |
| Step 5 模块实现契约主轴 | 已确认 `contracts`、`cli_entry`、`jobs`、`application_services` 的职责边界 | 作为调用方 / 处理方归属依据 |
| Step 6 对象实现契约 | 已确认 application service 函数签名、receipt、metadata、error 支撑对象 | 作为协议函数签名和 schema 字段来源 |
| Step 7 Port / Adapter 契约 | 已确认 outbox、event publisher、toolchain、source / snapshot / projection port | 作为 event / job 处理边界依据 |
| `01-架构设计.md` §10 | 已确认同步入口、异步事实传播、后台延后承接三类交互 | 作为传输方式选择依据 |
| `architecture/proto-draft/README.md` §三 | CloudEvents 1.0 包络和 W3C Trace Context 规则 | 作为 outbound event envelope 约束 |

已确认结论:

```text
L0-core 本轮不实现在线 HTTP / RPC 服务。
同步变更和查询入口先落成 CLI / Rust library 同步入口。
契约事实传播使用 CloudEvents 1.0 语义,但 L0-bus 投递、ack、retry、dead-letter 不在本仓实现。
后台校验、派生、索引、fingerprint 和事实发布使用 Operations Job / worker 入口。
```

---

## 3. 本步写作策略

本步沿用长文档写作规则:

```text
骨架先行 + 分批填充 + 状态推进 + 格式约束 + 最后收口
```

写作约束:

- 每个协议必须独立成小节。
- 每个协议必须写函数签名 / 命令名 / event type / job binary。
- 内部命令和查询必须写 Rust DTO。
- 事件必须写 CloudEvent type、发布方、订阅方、schema、版本策略和幂等 key。
- Operations Job 必须写触发方式、输入、输出和幂等要求。
- 不用“后续实现时再定 schema”替代协议字段。
- 本步不展开调用链和事务顺序;这些留给 Step 9。

---

## 4. 分章节写入计划

| 章节 | 状态 | 主题 | 覆盖模块 | 主要契约 |
|---|---|---|---|---|
| 8.1 | [x] | 协议分类、总表与统一规则 | `contracts` / `cli_entry` / `jobs` / outbound event | 协议清单、传输方式、统一 metadata、错误映射 |
| 8.2 | [x] | Command API 协议 | `commands.rs` / `ContractCommandApi` | 5 个写路径 command |
| 8.3 | [x] | Query API 协议 | `queries.rs` / `ContractQueryApi` | 8 个只读 query |
| 8.4 | [x] | Outbound Event 协议 | `events.rs` / `OutboxPort` / `EventPublisherPort` | 7 个事实事件 |
| 8.5 | [x] | Operations Job 协议 | `jobs.rs` / `core_jobs` | 6 个 job / worker |
| 8.6 | [x] | Step 8 统一复核 | 全部协议 | schema、错误、幂等、审计、Step 9 交接 |

---

## 5. SOP 问题回答

### 5.1 本轮需要定义哪些 API / Command / Query / Event / Job？

本轮定义 26 个协议:

| 类别 | 数量 | 协议 |
|---|---:|---|
| Command API | 5 | `CreateContractDraft`、`UpdateContractDraft`、`SubmitContractForReview`、`PublishContractBaseline`、`UpdateContractLifecycle` |
| Query API | 8 | `GetContractDefinition`、`ListContractDefinitions`、`GetContractReleaseBaseline`、`GetContractReleaseSnapshot`、`TraceContractEvolution`、`GetCompatibilityTrace`、`GetContractPackage`、`GetContractGuideSample` |
| Outbound Event | 7 | `ContractDraftChanged`、`ContractReviewSubmitted`、`ContractBaselinePublished`、`ContractLifecycleChanged`、`ContractCompatibilityStatusChanged`、`ContractSnapshotReady`、`ContractFactPublished` |
| Operations Job | 6 | `ValidateContractChangeJob`、`DeriveReleaseSnapshotJob`、`RebuildContractIndexJob`、`RecalculateFingerprintJob`、`PublishContractFactJob`、`OutboxRelayWorker` |

### 5.2 每个协议的调用方、处理方、传输方式是什么？

已在 §9.1 协议总表和每个协议小节中逐项写明。统一口径如下:

| 类别 | 调用方 / 发布方 | 处理方 / 订阅方 | 传输方式 |
|---|---|---|---|
| Command API | CLI / library caller | `ContractCommandApi` -> application service | CLI command + Rust DTO |
| Query API | CLI / library caller | `ContractQueryApi` -> application service | CLI command + Rust DTO |
| Outbound Event | `ContractFactService` / outbox / relay | L0-bus boundary | CloudEvents payload + outbox |
| Operations Job | scheduler / CLI trigger / worker | `core_jobs` -> application service / worker | job binary + Rust DTO |

### 5.3 外部接口使用 HTTP、RPC、event bus 还是其他方式？

本轮采用:

- 同步写入和查询:CLI / Rust library 同步入口。
- 事件传播:CloudEvents payload + outbox + `EventPublisherPort` 边界。
- 后台处理:job binary + Rust input / output DTO。

本轮不采用:

- 不设计常驻 HTTP server。
- 不设计 gRPC server。
- 不实现 L0-bus runtime、ack、retry、dead-letter。

### 5.4 请求、响应、事件或 job 输入输出 schema 是什么？

已经在每个协议小节中用 Rust DTO 写出。统一落点:

| 类别 | 文件 |
|---|---|
| Command DTO | `crates/contracts/src/commands.rs` |
| Query DTO / View DTO | `crates/contracts/src/queries.rs` |
| Event payload DTO | `crates/contracts/src/events.rs` |
| Job input / output DTO | `crates/contracts/src/jobs.rs` |

### 5.5 每个协议失败时映射成什么错误？

已在每个协议小节中写出场景级错误映射。统一错误码见 §9.1.3。

### 5.6 哪些协议需要幂等键或审计记录？

| 类别 | 幂等要求 | 审计要求 |
|---|---|---|
| Command API | 必须携带 `IdempotencyKey` | 成功写路径必须写审计 |
| Query API | 不需要 `IdempotencyKey` | 不写审计,只保留 trace context |
| Outbound Event | 必须有业务级幂等 key 和 CloudEvent `id` | 事件来源事实必须可追溯 |
| Operations Job | 必须携带 `JobRunId` 和 / 或 `IdempotencyKey` | 运维写路径必须写审计 |

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理结果 | 影响 |
|---|---|---|---|
| 概要设计 §7 | 只有 API / Event / Job 骨架表,没有正式 DTO schema | 已补齐 26 个协议 DTO 和协议元信息 | 实现者可以创建 `commands.rs` / `queries.rs` / `events.rs` / `jobs.rs` |
| Step 6 application service | 已有 service 函数签名,但 command / query DTO 未展开 | 已把 service 函数参数映射成协议 DTO | 入口层可以组装参数 |
| Step 7 event publisher | 已有 `EventPublisherPort`,但 event type 和 payload 尚未固定 | 已补 CloudEvent type、payload、幂等 key | outbox 与 L0-bus 边界可以实现 |
| Step 4 CLI / jobs 文件 | 已有文件落点,但命令名、job 输入输出和错误映射缺失 | 已补 CLI command、job binary、input / output 和错误映射 | CLI 和 job binary 可以按统一协议实现 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| Command | 只有输入骨架 | 每个 command 有 Rust DTO、CLI command、响应和错误映射 | 支撑同步入口实现 |
| Query | 只有查询名和输出骨架 | 每个 query 有 Rust DTO、CLI command、view 输出和错误映射 | 支撑只读入口实现 |
| Event | 只有事件名 | 每个 event 有 CloudEvent type、payload、版本、幂等 key | 支撑 outbox 和 bus 边界 |
| Job | 只有 job 名和边界 | 每个 job 有 binary、input、output、触发和幂等要求 | 支撑后台入口实现 |
| 通信方式 | 容易误解成 HTTP / RPC | 明确同步入口为 CLI / Rust library,事件为 outbox + CloudEvent,后台为 job binary | 对齐架构设计无常驻在线运行时 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 直接设计 HTTP API | 对外常见 | 与本仓无常驻在线运行时冲突 | 不采用 |
| CLI / Rust library 同步入口 | 符合当前架构,实现简单,可被后续 gateway 包装 | 不直接提供在线服务 | 采用 |
| Outbound event 直接实现 bus runtime | 看似闭环 | 侵入 L0-bus 职责 | 不采用 |
| Event 只定义 DTO + CloudEvent 元数据 | 边界清晰,可由 L0-bus 适配 | 需要相邻仓后续登记和投递 | 采用 |

---

## 9. 结构化中间产物

### 9.1 协议分类、总表与统一规则

#### 9.1.1 协议分类说明

| 分类 | 传输方式 | 所属文件 | 入口 / 发布方 | 处理方 / 订阅方 | 说明 |
|---|---|---|---|---|---|
| Command API | CLI command + Rust library call | `crates/contracts/src/commands.rs` | `ContractCommandApi` | application service | 改写真相,必须携带 actor、metadata、idempotency key |
| Query API | CLI command + Rust library call | `crates/contracts/src/queries.rs` | `ContractQueryApi` | trace / snapshot / release service | 只读查询,不得改写真相 |
| Outbound Event | CloudEvents payload + outbox | `crates/contracts/src/events.rs` | `ContractFactService` / outbox relay | L0-bus 边界和下游消费者 | 只表达已提交事实,不实现投递运行时 |
| Operations Job | job binary + Rust job input DTO | `crates/contracts/src/jobs.rs` | `core_jobs` | application service / worker | 后台校验、派生、重建、复算、事实发布和 outbox relay |

#### 9.1.2 协议总表

| 名称 | 类别 | 调用方 / 发布方 | 处理方 / 订阅方 | 传输方式 | 是否需要处理流 |
|---|---|---|---|---|---|
| `CreateContractDraft` | Command | CLI / library caller | `ContractCommandApi` -> `ContractChangeService` | CLI + Rust DTO | 是 |
| `UpdateContractDraft` | Command | CLI / library caller | `ContractCommandApi` -> `ContractChangeService` | CLI + Rust DTO | 是 |
| `SubmitContractForReview` | Command | CLI / library caller | `ContractCommandApi` -> `ContractChangeService` | CLI + Rust DTO | 是 |
| `PublishContractBaseline` | Command | CLI / library caller | `ContractCommandApi` -> `ContractReleaseService` | CLI + Rust DTO | 是 |
| `UpdateContractLifecycle` | Command | CLI / library caller | `ContractCommandApi` -> `ContractReleaseService` | CLI + Rust DTO | 是 |
| `GetContractDefinition` | Query | CLI / library caller | `ContractQueryApi` -> `ContractTraceService` | CLI + Rust DTO | 共用读路径 |
| `ListContractDefinitions` | Query | CLI / library caller | `ContractQueryApi` -> `ContractTraceService` | CLI + Rust DTO | 共用读路径 |
| `GetContractReleaseBaseline` | Query | CLI / library caller | `ContractQueryApi` -> release / trace service | CLI + Rust DTO | 共用读路径 |
| `GetContractReleaseSnapshot` | Query | CLI / library caller | `ContractQueryApi` -> `ContractSnapshotService` | CLI + Rust DTO | 共用读路径 |
| `TraceContractEvolution` | Query | CLI / library caller | `ContractQueryApi` -> `ContractTraceService` | CLI + Rust DTO | 是 |
| `GetCompatibilityTrace` | Query | CLI / library caller | `ContractQueryApi` -> `ContractCompatibilityService` | CLI + Rust DTO | 是 |
| `GetContractPackage` | Query | CLI / library caller | `ContractQueryApi` -> trace / package read service | CLI + Rust DTO | 共用读路径 |
| `GetContractGuideSample` | Query | CLI / library caller | `ContractQueryApi` -> trace / package read service | CLI + Rust DTO | 共用读路径 |
| `ContractDraftChanged` | Outbound Event | `ContractFactService` / outbox | L0-bus boundary | CloudEvents + outbox | 是 |
| `ContractReviewSubmitted` | Outbound Event | `ContractFactService` / outbox | L0-bus boundary | CloudEvents + outbox | 是 |
| `ContractBaselinePublished` | Outbound Event | `ContractFactService` / outbox | L0-bus boundary | CloudEvents + outbox | 是 |
| `ContractLifecycleChanged` | Outbound Event | `ContractFactService` / outbox | L0-bus boundary | CloudEvents + outbox | 是 |
| `ContractCompatibilityStatusChanged` | Outbound Event | `ContractFactService` / outbox | L0-bus boundary | CloudEvents + outbox | 是 |
| `ContractSnapshotReady` | Outbound Event | `ContractFactService` / outbox | L0-bus boundary | CloudEvents + outbox | 是 |
| `ContractFactPublished` | Outbound Event | `PublishContractFactJob` / outbox relay | L0-bus boundary | CloudEvents + outbox | 是 |
| `ValidateContractChangeJob` | Operations Job | scheduler / CLI trigger | `ValidateContractChangeJob` -> `ContractCompatibilityService` | job binary + Rust DTO | 是 |
| `DeriveReleaseSnapshotJob` | Operations Job | scheduler / CLI trigger | `DeriveReleaseSnapshotJob` -> `ContractSnapshotService` | job binary + Rust DTO | 是 |
| `RebuildContractIndexJob` | Operations Job | scheduler / CLI trigger | `RebuildContractIndexJob` -> `ContractOperationsService` | job binary + Rust DTO | 是 |
| `RecalculateFingerprintJob` | Operations Job | scheduler / CLI trigger | `RecalculateFingerprintJob` -> `ContractOperationsService` | job binary + Rust DTO | 是 |
| `PublishContractFactJob` | Operations Job | scheduler / CLI trigger | `PublishContractFactJob` -> `ContractFactService` | job binary + Rust DTO | 是 |
| `OutboxRelayWorker` | Operations Job | scheduler / long running worker | `OutboxRelayWorker` -> `EventPublisherPort` | job binary + Rust DTO | 是 |

#### 9.1.3 统一错误映射

| 内部错误 | CLI status | ErrorResponse code | 调用方处理 |
|---|---|---|---|
| `ApplicationError::Validation` | `2` | `invalid_argument` | 修正输入后重试 |
| `ApplicationError::NotFound` | `3` | `not_found` | 检查 ID、引用或 query 条件 |
| `ApplicationError::Conflict` | `4` | `conflict` | 重新读取当前版本后重试 |
| `ApplicationError::PreconditionFailed` | `4` | `precondition_failed` | 补齐 gate、fingerprint、状态或引用前置条件 |
| `ApplicationError::Port` | `5` | `dependency_unavailable` | 等待依赖恢复或进入运维恢复 |
| `ApplicationError::Internal` | `1` | `internal` | 保留 trace id 并进入问题排查 |

#### 9.1.4 统一 CloudEvent 约束

| 字段 | 本步约束 |
|---|---|
| `specversion` | 固定 `"1.0"` |
| `source` | 固定 `service:quantalithos-core` |
| `type` | 采用 `core.contract.<verb>` 形式;后续需要与 `architecture/bus-draft/event-catalog.md` 登记同步 |
| `subject` | 默认使用 `ContractDefinitionId`;快照事件使用 `ContractReleaseSnapshotId`;事实发布事件使用 `ContractFactRecordId` |
| `datacontenttype` | `application/vnd.quantalithos.core.<event>.v1+json` |
| `traceparent` | 必填,来自 `CommandMetadata` / `RequestMetadata` |
| `tracestate` | 可选 |
| `actor_id` / `actor_kind` | 必填,来自 `ActorContext` |
| `severity` | 默认 `info`;发布和生命周期收口可用 `notice`;失败类事件不在本步定义 |

#### 9.1.5 统一 Rust DTO 写法

```rust
/// 协议 DTO 必须使用 Rustdoc 中文注释说明作用。
pub struct ProtocolName {
    /// 每个字段必须说明用途。
    pub field_name: FieldType,
}
```

写法约束:

- Command DTO 必须包含业务输入字段;`ActorContext` 和 `CommandMetadata` 由入口函数独立传入,不嵌入 command。
- Query DTO 必须包含查询条件;`QueryMetadata` 由入口函数独立传入。
- Event payload 必须只放已提交事实的引用和摘要,不得放外部正文。
- Job input 必须包含 `job_id`、目标引用、触发原因和重建 / 批处理参数。

#### 9.1.6 本步新增协议支撑类型

以下类型属于 Step 8 协议层新增支撑类型,应落在 `core_contracts` 中。它们不属于 domain aggregate,不表达领域状态机。

```rust
/// Job 运行 ID。
pub struct JobRunId(pub String);

/// 分页游标。
pub struct PageToken(pub String);

/// 契约草稿变化类型。
pub enum ContractDraftChangeKind {
    /// 草稿被创建。
    Created,

    /// 草稿被更新。
    Updated,
}

/// Job 触发原因。
pub enum JobTriggerReason {
    /// 人工触发。
    Manual,

    /// 调度器触发。
    Scheduled,

    /// 上游事实事件触发。
    EventDriven,

    /// 恢复流程触发。
    Recovery,
}

/// 投影重建范围。
pub enum ProjectionRebuildScope {
    /// 重建全部投影。
    All,

    /// 重建单个契约定义相关投影。
    Definition(ContractDefinitionId),

    /// 重建指定发布基线相关投影。
    Baseline(ContractReleaseBaselineId),
}

/// Fingerprint 复算目标。
pub enum FingerprintRecalculationTarget {
    /// 复算契约定义 fingerprint。
    Definition(ContractDefinitionId),

    /// 复算发布快照 fingerprint。
    Snapshot(ContractReleaseSnapshotId),
}

/// 契约事实事件类型。
pub enum ContractFactEventType {
    /// 契约草稿变化事实。
    DraftChanged,

    /// 契约评审提交事实。
    ReviewSubmitted,

    /// 发布基线成立事实。
    BaselinePublished,

    /// 生命周期变化事实。
    LifecycleChanged,

    /// 兼容性状态变化事实。
    CompatibilityStatusChanged,

    /// 快照可用事实。
    SnapshotReady,
}
```

协议视图支撑类型:

```rust
/// 契约定义列表摘要。
pub struct ContractDefinitionSummary {
    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 当前生命周期状态。
    pub lifecycle_state: ContractLifecycleState,

    /// 当前版本。
    pub version: ContractVersion,

    /// 当前 fingerprint。
    pub fingerprint: ContractFingerprint,
}

/// 契约接入示例。
pub struct ContractGuideSample {
    /// 示例标题。
    pub title: String,

    /// 示例目标消费域。
    pub consumer_domain: ContractDomain,

    /// 示例正文引用。
    pub sample_ref: ExternalReferenceRef,
}

/// 外部引用摘要。
pub struct ExternalReferenceSummary {
    /// 外部引用 ID。
    pub reference_id: ExternalReferenceId,

    /// 外部引用标题。
    pub title: String,

    /// 外部引用 URI。
    pub uri: ExternalUri,
}
```

### 9.2 Command API 协议

Command API 是同步写入口。它们通过 `core_cli` 暴露为 CLI command,同时通过 `ContractCommandApi` 暴露为 Rust library 同步入口。Command API 不实现 HTTP server,也不直接调用 infra adapter。

#### 9.2.1 `CreateContractDraft`

##### 用途

创建新的契约草稿,初始化 `ContractDefinition`、生命周期起点和演进记录。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `pub async fn create_contract_draft(&self, command: CreateContractDraft, actor: ActorContext, meta: CommandMetadata) -> Result<ContractChangeReceipt, ApplicationError>` |
| CLI command | `quantalithos-core contract create-draft --payload <json>` |
| 调用方 | 人工维护者、后续 gateway wrapper、初始化脚本 |
| 处理方 | `ContractCommandApi` -> `ContractChangeService.create_contract_draft(CreateContractDraft command, ActorContext actor, CommandMetadata meta)` |

##### 请求 schema

```rust
/// 创建契约草稿命令。
pub struct CreateContractDraft {
    /// 草稿内容规范。
    pub spec: ContractDefinitionDraftSpec,

    /// 源码逻辑引用。
    pub source_ref: ContractSourceRef,

    /// 请求幂等键。
    pub idempotency_key: IdempotencyKey,
}
```

##### 响应 schema

```rust
/// 契约变更回执。
pub struct ContractChangeReceipt {
    /// 通用回执。
    pub receipt: Receipt,

    /// 被创建或更新的契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 当前聚合版本。
    pub version: Version,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| 草稿字段非法或越界 | `ApplicationError::Validation` |
| 同一幂等键重复且 payload 不一致 | `ApplicationError::Conflict` |
| source ref 不可用 | `ApplicationError::PreconditionFailed` |
| repository / audit / outbox 不可用 | `ApplicationError::Port` |

##### 幂等与审计要求

- 必须携带 `IdempotencyKey`。
- 成功后必须写入审计记录和 `ContractDraftChanged` outbox 事件。
- 重复请求 payload 相同应返回同一语义回执;payload 不同必须返回冲突。

#### 9.2.2 `UpdateContractDraft`

##### 用途

更新已有契约草稿正文、引用集合和 fingerprint,保留演进记录。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `pub async fn update_contract_draft(&self, command: UpdateContractDraft, actor: ActorContext, meta: CommandMetadata) -> Result<ContractChangeReceipt, ApplicationError>` |
| CLI command | `quantalithos-core contract update-draft --payload <json>` |
| 调用方 | 人工维护者、后续 gateway wrapper、同步脚本 |
| 处理方 | `ContractCommandApi` -> `ContractChangeService.update_contract_draft(UpdateContractDraft command, ActorContext actor, CommandMetadata meta)` |

##### 请求 schema

```rust
/// 更新契约草稿命令。
pub struct UpdateContractDraft {
    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 更新后的草稿内容规范。
    pub spec: ContractDefinitionDraftSpec,

    /// 期望聚合版本。
    pub expected_version: Version,

    /// 请求幂等键。
    pub idempotency_key: IdempotencyKey,
}
```

##### 响应 schema

```rust
/// 契约变更回执。
pub struct ContractChangeReceipt {
    /// 通用回执。
    pub receipt: Receipt,

    /// 被更新的契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 更新后的聚合版本。
    pub version: Version,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| 契约定义不存在 | `ApplicationError::NotFound` |
| 当前状态不可编辑 | `ApplicationError::PreconditionFailed` |
| `expected_version` 不匹配 | `ApplicationError::Conflict` |
| 草稿字段非法或越界 | `ApplicationError::Validation` |

##### 幂等与审计要求

- 必须携带 `IdempotencyKey` 和 `expected_version`。
- 成功后必须写入审计记录和 `ContractDraftChanged` outbox 事件。
- 查询路径不得隐式更新草稿。

#### 9.2.3 `SubmitContractForReview`

##### 用途

将草稿提交到评审状态,为后续 approved gate 和发布基线收口做准备。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `pub async fn submit_contract_for_review(&self, command: SubmitContractForReview, actor: ActorContext, meta: CommandMetadata) -> Result<ContractReviewReceipt, ApplicationError>` |
| CLI command | `quantalithos-core contract submit-review --payload <json>` |
| 调用方 | 人工维护者、后续 gateway wrapper |
| 处理方 | `ContractCommandApi` -> `ContractChangeService.submit_contract_for_review(SubmitContractForReview command, ActorContext actor, CommandMetadata meta)` |

##### 请求 schema

```rust
/// 提交契约进入评审命令。
pub struct SubmitContractForReview {
    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 期望聚合版本。
    pub expected_version: Version,

    /// 请求幂等键。
    pub idempotency_key: IdempotencyKey,
}
```

##### 响应 schema

```rust
/// 契约评审提交回执。
pub struct ContractReviewReceipt {
    /// 通用回执。
    pub receipt: Receipt,

    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 提交后的生命周期状态。
    pub lifecycle_state: ContractLifecycleState,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| 契约定义不存在 | `ApplicationError::NotFound` |
| 非草稿态或状态迁移非法 | `ApplicationError::PreconditionFailed` |
| `expected_version` 不匹配 | `ApplicationError::Conflict` |
| repository / audit / outbox 不可用 | `ApplicationError::Port` |

##### 幂等与审计要求

- 必须携带 `IdempotencyKey`。
- 成功后必须写入审计记录和 `ContractReviewSubmitted` outbox 事件。
- 不能在本命令内完成发布基线。

#### 9.2.4 `PublishContractBaseline`

##### 用途

在 approved gate、引用校验、兼容状态和 fingerprint 满足前置条件后创建发布基线。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `pub async fn publish_contract_baseline(&self, command: PublishContractBaseline, actor: ActorContext, meta: CommandMetadata) -> Result<ContractBaselineReceipt, ApplicationError>` |
| CLI command | `quantalithos-core contract publish-baseline --payload <json>` |
| 调用方 | 人工维护者、后续 gateway wrapper、发布脚本 |
| 处理方 | `ContractCommandApi` -> `ContractReleaseService.publish_contract_baseline(PublishContractBaseline command, ActorContext actor, CommandMetadata meta)` |

##### 请求 schema

```rust
/// 发布契约基线命令。
pub struct PublishContractBaseline {
    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 已批准门禁引用。
    pub gate_ref: ApprovedGateRef,

    /// 期望定义聚合版本。
    pub expected_definition_version: Version,

    /// 期望发布指纹。
    pub expected_fingerprint: ContractFingerprint,

    /// 请求幂等键。
    pub idempotency_key: IdempotencyKey,
}
```

##### 响应 schema

```rust
/// 契约发布基线回执。
pub struct ContractBaselineReceipt {
    /// 通用回执。
    pub receipt: Receipt,

    /// 发布基线 ID。
    pub baseline_id: ContractReleaseBaselineId,

    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 兼容性状态。
    pub compatibility_status: CompatibilityStatus,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| 契约定义不存在 | `ApplicationError::NotFound` |
| gate 未批准或不可读 | `ApplicationError::PreconditionFailed` |
| fingerprint 不匹配 | `ApplicationError::PreconditionFailed` |
| 当前生命周期不可发布 | `ApplicationError::PreconditionFailed` |
| 版本冲突 | `ApplicationError::Conflict` |

##### 幂等与审计要求

- 必须携带 `IdempotencyKey`。
- 成功后必须写入审计记录、发布基线、事实记录和 `ContractBaselinePublished` outbox 事件。
- 不在本命令内承诺快照已经完成派生;快照由 job 延后承接。

#### 9.2.5 `UpdateContractLifecycle`

##### 用途

执行契约定义的弃用、退役或 supersede 等生命周期迁移。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `pub async fn update_contract_lifecycle(&self, command: UpdateContractLifecycle, actor: ActorContext, meta: CommandMetadata) -> Result<ContractLifecycleReceipt, ApplicationError>` |
| CLI command | `quantalithos-core contract update-lifecycle --payload <json>` |
| 调用方 | 人工维护者、后续 gateway wrapper、治理脚本 |
| 处理方 | `ContractCommandApi` -> `ContractReleaseService.update_contract_lifecycle(UpdateContractLifecycle command, ActorContext actor, CommandMetadata meta)` |

##### 请求 schema

```rust
/// 更新契约生命周期命令。
pub struct UpdateContractLifecycle {
    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 目标生命周期状态。
    pub target_state: ContractLifecycleState,

    /// 生命周期迁移原因。
    pub reason: LifecycleReason,

    /// 可选替代契约定义 ID。
    pub supersedes_definition_id: Option<ContractDefinitionId>,

    /// 期望聚合版本。
    pub expected_version: Version,

    /// 请求幂等键。
    pub idempotency_key: IdempotencyKey,
}
```

##### 响应 schema

```rust
/// 契约生命周期变更回执。
pub struct ContractLifecycleReceipt {
    /// 通用回执。
    pub receipt: Receipt,

    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 变更后的生命周期状态。
    pub lifecycle_state: ContractLifecycleState,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| 契约定义不存在 | `ApplicationError::NotFound` |
| 状态迁移非法 | `ApplicationError::PreconditionFailed` |
| supersede 缺少替代定义 | `ApplicationError::Validation` |
| `expected_version` 不匹配 | `ApplicationError::Conflict` |

##### 幂等与审计要求

- 必须携带 `IdempotencyKey`。
- 成功后必须写入审计记录和 `ContractLifecycleChanged` outbox 事件。
- 终态迁移成功后不得被后续 command 隐式撤销。

### 9.3 Query API 协议

Query API 是同步只读入口。它们通过 `core_cli` 暴露为 CLI command,同时通过 `ContractQueryApi` 暴露为 Rust library 查询入口。Query API 不写审计、不写 outbox、不触发状态迁移。

#### 9.3.1 `GetContractDefinition`

##### 用途

按定义 ID 查询契约定义详情。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `pub async fn get_contract_definition(&self, query: GetContractDefinition, meta: QueryMetadata) -> Result<ContractDefinitionView, ApplicationError>` |
| CLI command | `quantalithos-core contract get-definition --definition-id <id>` |
| 调用方 | 下游仓、维护者、后续 SDK / gateway wrapper |
| 处理方 | `ContractQueryApi` -> `ContractTraceService.get_contract_definition(GetContractDefinition query, QueryMetadata meta)` |

##### 请求 schema

```rust
/// 查询契约定义详情。
pub struct GetContractDefinition {
    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 是否允许在 read model 不可用时回退读取权威定义。
    pub allow_truth_fallback: bool,
}
```

##### 响应 schema

```rust
/// 契约定义视图。
pub struct ContractDefinitionView {
    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 当前生命周期状态。
    pub lifecycle_state: ContractLifecycleState,

    /// 当前版本。
    pub version: ContractVersion,

    /// 当前 fingerprint。
    pub fingerprint: ContractFingerprint,

    /// 只读视图状态。
    pub read_model_state: ReadModelState,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| 定义不存在 | `ApplicationError::NotFound` |
| read model 不可用且不允许 fallback | `ApplicationError::PreconditionFailed` |
| repository / projection 不可用 | `ApplicationError::Port` |

##### 幂等与审计要求

- 不需要 `IdempotencyKey`。
- 不写审计记录和 outbox。
- 必须携带 `QueryMetadata` 以保留 trace context。

#### 9.3.2 `ListContractDefinitions`

##### 用途

按条件分页查询契约定义列表。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `pub async fn list_contract_definitions(&self, query: ListContractDefinitions, meta: QueryMetadata) -> Result<ContractDefinitionListView, ApplicationError>` |
| CLI command | `quantalithos-core contract list-definitions --payload <json>` |
| 调用方 | 下游仓、维护者、后续 SDK / gateway wrapper |
| 处理方 | `ContractQueryApi` -> `ContractTraceService.list_contract_definitions(ListContractDefinitions query, QueryMetadata meta)` |

##### 请求 schema

```rust
/// 查询契约定义列表。
pub struct ListContractDefinitions {
    /// 查询条件。
    pub query: ContractDefinitionQuery,

    /// 分页请求。
    pub page: PageRequest,
}
```

##### 响应 schema

```rust
/// 契约定义列表视图。
pub struct ContractDefinitionListView {
    /// 列表项。
    pub items: Vec<ContractDefinitionSummary>,

    /// 下一页游标。
    pub next_page_token: Option<PageToken>,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| 查询条件非法 | `ApplicationError::Validation` |
| projection 不可用 | `ApplicationError::Port` |

##### 幂等与审计要求

- 不需要 `IdempotencyKey`。
- 不写审计记录和 outbox。
- 分页结果不得隐式触发 projection 重建。

#### 9.3.3 `GetContractReleaseBaseline`

##### 用途

按发布基线 ID 查询发布基线详情。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `pub async fn get_contract_release_baseline(&self, query: GetContractReleaseBaseline, meta: QueryMetadata) -> Result<ContractReleaseBaselineView, ApplicationError>` |
| CLI command | `quantalithos-core contract get-baseline --baseline-id <id>` |
| 调用方 | 下游仓、维护者、后续 SDK / gateway wrapper |
| 处理方 | `ContractQueryApi` -> release / trace service |

##### 请求 schema

```rust
/// 查询发布基线详情。
pub struct GetContractReleaseBaseline {
    /// 发布基线 ID。
    pub baseline_id: ContractReleaseBaselineId,
}
```

##### 响应 schema

```rust
/// 发布基线视图。
pub struct ContractReleaseBaselineView {
    /// 发布基线 ID。
    pub baseline_id: ContractReleaseBaselineId,

    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 发布状态。
    pub status: ContractReleaseBaselineStatus,

    /// 发布 fingerprint。
    pub fingerprint: ContractFingerprint,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| 基线不存在 | `ApplicationError::NotFound` |
| repository 不可用 | `ApplicationError::Port` |

##### 幂等与审计要求

- 不需要 `IdempotencyKey`。
- 不写审计记录和 outbox。

#### 9.3.4 `GetContractReleaseSnapshot`

##### 用途

按快照 ID 查询发布快照详情和快照引用。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `pub async fn get_release_snapshot(&self, query: GetContractReleaseSnapshot, meta: QueryMetadata) -> Result<ContractReleaseSnapshotView, ApplicationError>` |
| CLI command | `quantalithos-core contract get-snapshot --snapshot-id <id>` |
| 调用方 | 下游仓、维护者、后续 SDK / gateway wrapper |
| 处理方 | `ContractQueryApi` -> `ContractSnapshotService.get_release_snapshot(GetContractReleaseSnapshot query, QueryMetadata meta)` |

##### 请求 schema

```rust
/// 查询发布快照详情。
pub struct GetContractReleaseSnapshot {
    /// 发布快照 ID。
    pub snapshot_id: ContractReleaseSnapshotId,
}
```

##### 响应 schema

```rust
/// 发布快照视图。
pub struct ContractReleaseSnapshotView {
    /// 发布快照 ID。
    pub snapshot_id: ContractReleaseSnapshotId,

    /// 来源发布基线 ID。
    pub baseline_id: ContractReleaseBaselineId,

    /// 快照引用。
    pub snapshot_ref: ReleaseSnapshotRef,

    /// 快照状态。
    pub status: ContractReleaseSnapshotStatus,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| 快照不存在 | `ApplicationError::NotFound` |
| 快照尚未 ready | `ApplicationError::PreconditionFailed` |
| snapshot repository 不可用 | `ApplicationError::Port` |

##### 幂等与审计要求

- 不需要 `IdempotencyKey`。
- 不写审计记录和 outbox。

#### 9.3.5 `TraceContractEvolution`

##### 用途

查询契约定义的演进、审计、快照、事实和引用追溯视图。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `pub async fn trace_contract_evolution(&self, query: TraceContractEvolution, actor: Option<ActorContext>, meta: QueryMetadata) -> Result<ContractTraceView, ApplicationError>` |
| CLI command | `quantalithos-core contract trace-evolution --payload <json>` |
| 调用方 | 维护者、审查者、下游排障流程 |
| 处理方 | `ContractQueryApi` -> `ContractTraceService.trace_contract_evolution(TraceContractEvolution query, Option<ActorContext> actor, QueryMetadata meta)` |

##### 请求 schema

```rust
/// 查询契约演进追溯。
pub struct TraceContractEvolution {
    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 是否包含审计记录摘要。
    pub include_audit: bool,

    /// 是否包含 outbox / fact 摘要。
    pub include_facts: bool,

    /// 分页请求。
    pub page: PageRequest,
}
```

##### 响应 schema

```rust
/// 契约追溯视图。
pub struct ContractTraceView {
    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 追溯项列表。
    pub items: Vec<TraceItem>,

    /// 投影状态。
    pub projection_state: ProjectionState,

    /// 下一页游标。
    pub next_page_token: Option<PageToken>,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| 定义不存在 | `ApplicationError::NotFound` |
| projection stale / rebuilding 且不允许读取 | `ApplicationError::PreconditionFailed` |
| projection / audit / fact 读取失败 | `ApplicationError::Port` |

##### 幂等与审计要求

- 不需要 `IdempotencyKey`。
- 不写审计记录和 outbox。
- 可选 `ActorContext` 只用于追溯读取上下文,不是鉴权机制。

#### 9.3.6 `GetCompatibilityTrace`

##### 用途

查询某个契约定义的兼容性状态和兼容判断追溯。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `pub async fn get_compatibility_status(&self, query: GetCompatibilityTrace, actor: Option<ActorContext>, meta: QueryMetadata) -> Result<CompatibilityTraceView, ApplicationError>` |
| CLI command | `quantalithos-core contract get-compatibility --definition-id <id>` |
| 调用方 | 发布流程、维护者、下游排障流程 |
| 处理方 | `ContractQueryApi` -> `ContractCompatibilityService.get_compatibility_status(GetCompatibilityTrace query, Option<ActorContext> actor, QueryMetadata meta)` |

##### 请求 schema

```rust
/// 查询兼容性追溯。
pub struct GetCompatibilityTrace {
    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 是否包含工具链报告摘要。
    pub include_validation_report: bool,
}
```

##### 响应 schema

```rust
/// 兼容性追溯视图。
pub struct CompatibilityTraceView {
    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 当前兼容性状态。
    pub compatibility_status: CompatibilityStatus,

    /// 兼容追溯项。
    pub trace_items: Vec<CompatibilityTraceItem>,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| 定义不存在 | `ApplicationError::NotFound` |
| 兼容性索引不可用 | `ApplicationError::PreconditionFailed` |
| projection / repository 读取失败 | `ApplicationError::Port` |

##### 幂等与审计要求

- 不需要 `IdempotencyKey`。
- 不写审计记录和 outbox。

#### 9.3.7 `GetContractPackage`

##### 用途

按消费域读取对应契约包视图。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `pub async fn get_contract_package(&self, query: GetContractPackage, meta: QueryMetadata) -> Result<ContractPackageView, ApplicationError>` |
| CLI command | `quantalithos-core contract get-package --consumer-domain <domain>` |
| 调用方 | L1 六域仓、维护者、后续 SDK wrapper |
| 处理方 | `ContractQueryApi` -> package read service / trace service |

##### 请求 schema

```rust
/// 查询消费域契约包。
pub struct GetContractPackage {
    /// 消费域。
    pub consumer_domain: ContractDomain,

    /// 可选包版本。
    pub package_version: Option<ContractPackageVersion>,
}
```

##### 响应 schema

```rust
/// 契约包视图。
pub struct ContractPackageView {
    /// 消费域。
    pub consumer_domain: ContractDomain,

    /// 契约包 ID。
    pub package_id: ContractPackageId,

    /// 包版本。
    pub package_version: ContractPackageVersion,

    /// 包内定义引用。
    pub definition_refs: Vec<ContractDefinitionId>,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| 契约包不存在 | `ApplicationError::NotFound` |
| 消费域非法 | `ApplicationError::Validation` |
| repository / projection 不可用 | `ApplicationError::Port` |

##### 幂等与审计要求

- 不需要 `IdempotencyKey`。
- 不写审计记录和 outbox。

#### 9.3.8 `GetContractGuideSample`

##### 用途

按消费域读取接入说明、示例和引用摘要。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| 函数签名 | `pub async fn get_contract_guide_sample(&self, query: GetContractGuideSample, actor: Option<ActorContext>, meta: QueryMetadata) -> Result<ContractGuideSampleView, ApplicationError>` |
| CLI command | `quantalithos-core contract get-guide-sample --consumer-domain <domain>` |
| 调用方 | L1 六域仓、维护者、后续 SDK wrapper |
| 处理方 | `ContractQueryApi` -> package read service / trace service |

##### 请求 schema

```rust
/// 查询接入说明和示例。
pub struct GetContractGuideSample {
    /// 消费域。
    pub consumer_domain: ContractDomain,

    /// 是否包含外部引用摘要。
    pub include_external_refs: bool,
}
```

##### 响应 schema

```rust
/// 契约接入说明和示例视图。
pub struct ContractGuideSampleView {
    /// 消费域。
    pub consumer_domain: ContractDomain,

    /// 示例集合。
    pub samples: Vec<ContractGuideSample>,

    /// 外部引用摘要。
    pub external_refs: Vec<ExternalReferenceSummary>,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| 消费域非法 | `ApplicationError::Validation` |
| 示例或引用不存在 | `ApplicationError::NotFound` |
| projection / reference repository 不可用 | `ApplicationError::Port` |

##### 幂等与审计要求

- 不需要 `IdempotencyKey`。
- 不写审计记录和 outbox。
- 不复制外部正文,只返回引用摘要。

### 9.4 Outbound Event 协议

Outbound Event 只表达已经提交的契约事实。事件先进入 `OutboxPort`,再由 `OutboxRelayWorker` 调用 `EventPublisherPort` 交给 L0-bus 边界。L0-core 不实现订阅、ack、retry、dead-letter 或消费者组。

#### 9.4.1 `ContractDraftChanged`

##### 用途

表达契约草稿被创建或更新。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| Event type | `core.contract.draft_changed` |
| Topic / stream | `quantalithos.core.contract.v1` |
| 发布方 | `ContractFactService` / `OutboxPort` |
| 订阅方 | L0-bus boundary;下游消费者经 L0-bus 订阅 |

##### Event schema

```rust
/// 契约草稿变化事件载荷。
pub struct ContractDraftChanged {
    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 变化类型。
    pub change_kind: ContractDraftChangeKind,

    /// 当前聚合版本。
    pub version: Version,

    /// 当前 fingerprint。
    pub fingerprint: ContractFingerprint,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| outbox 写入失败 | `ApplicationError::Port` |
| CloudEvent envelope 构造失败 | `ApplicationError::Validation` |

##### 幂等与审计要求

- 事件幂等 key: `definition_id + version + change_kind`。
- `subject` 使用 `ContractDefinitionId`。
- 成功写入 outbox 后不代表 L0-bus 已投递。

#### 9.4.2 `ContractReviewSubmitted`

##### 用途

表达契约草稿已经进入评审状态。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| Event type | `core.contract.review_submitted` |
| Topic / stream | `quantalithos.core.contract.v1` |
| 发布方 | `ContractFactService` / `OutboxPort` |
| 订阅方 | L0-bus boundary;评审、治理或追溯消费者经 L0-bus 订阅 |

##### Event schema

```rust
/// 契约评审提交事件载荷。
pub struct ContractReviewSubmitted {
    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 当前聚合版本。
    pub version: Version,

    /// 变更后的生命周期状态。
    pub lifecycle_state: ContractLifecycleState,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| outbox 写入失败 | `ApplicationError::Port` |
| CloudEvent envelope 构造失败 | `ApplicationError::Validation` |

##### 幂等与审计要求

- 事件幂等 key: `definition_id + lifecycle_state + version`。
- `subject` 使用 `ContractDefinitionId`。
- 事件只表达评审提交,不表达 approved gate 已通过。

#### 9.4.3 `ContractBaselinePublished`

##### 用途

表达某个契约发布基线已经正式成立。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| Event type | `core.contract.baseline_published` |
| Topic / stream | `quantalithos.core.contract.v1` |
| 发布方 | `ContractFactService` / `OutboxPort` |
| 订阅方 | L0-bus boundary;L0-sdk、L1 仓、archive / observability 经 L0-bus 订阅 |

##### Event schema

```rust
/// 契约发布基线成立事件载荷。
pub struct ContractBaselinePublished {
    /// 发布基线 ID。
    pub baseline_id: ContractReleaseBaselineId,

    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 发布 fingerprint。
    pub fingerprint: ContractFingerprint,

    /// 发布时兼容性状态。
    pub compatibility_status: CompatibilityStatus,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| outbox 写入失败 | `ApplicationError::Port` |
| CloudEvent envelope 构造失败 | `ApplicationError::Validation` |

##### 幂等与审计要求

- 事件幂等 key: `baseline_id + fingerprint`。
- `subject` 使用 `ContractDefinitionId`。
- 事件不承诺发布快照已派生完成。

#### 9.4.4 `ContractLifecycleChanged`

##### 用途

表达契约定义生命周期发生弃用、退役或 supersede 等正式迁移。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| Event type | `core.contract.lifecycle_changed` |
| Topic / stream | `quantalithos.core.contract.v1` |
| 发布方 | `ContractFactService` / `OutboxPort` |
| 订阅方 | L0-bus boundary;下游消费方和追溯消费者经 L0-bus 订阅 |

##### Event schema

```rust
/// 契约生命周期变更事件载荷。
pub struct ContractLifecycleChanged {
    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 变更前状态。
    pub previous_state: ContractLifecycleState,

    /// 变更后状态。
    pub new_state: ContractLifecycleState,

    /// 生命周期变更原因。
    pub reason: LifecycleReason,

    /// 可选替代契约定义 ID。
    pub supersedes_definition_id: Option<ContractDefinitionId>,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| outbox 写入失败 | `ApplicationError::Port` |
| CloudEvent envelope 构造失败 | `ApplicationError::Validation` |

##### 幂等与审计要求

- 事件幂等 key: `definition_id + previous_state + new_state`。
- `subject` 使用 `ContractDefinitionId`。
- 终态迁移事件必须可审计追溯。

#### 9.4.5 `ContractCompatibilityStatusChanged`

##### 用途

表达兼容性校验结论发生变化。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| Event type | `core.contract.compatibility_status_changed` |
| Topic / stream | `quantalithos.core.contract.v1` |
| 发布方 | `ContractCompatibilityService` / `ContractFactService` / `OutboxPort` |
| 订阅方 | L0-bus boundary;发布流程、审查视图和追溯消费者经 L0-bus 订阅 |

##### Event schema

```rust
/// 契约兼容性状态变化事件载荷。
pub struct ContractCompatibilityStatusChanged {
    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 兼容性状态。
    pub compatibility_status: CompatibilityStatus,

    /// 兼容性追溯索引 ID。
    pub trace_index_id: CompatibilityTraceIndexId,

    /// 可选校验报告引用。
    pub validation_report_ref: Option<ExternalReferenceRef>,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| outbox 写入失败 | `ApplicationError::Port` |
| CloudEvent envelope 构造失败 | `ApplicationError::Validation` |

##### 幂等与审计要求

- 事件幂等 key: `definition_id + compatibility_status + trace_index_id`。
- `subject` 使用 `ContractDefinitionId`。
- 事件只传播结论摘要和引用,不携带完整工具链报告正文。

#### 9.4.6 `ContractSnapshotReady`

##### 用途

表达发布快照已经派生完成,可以被下游只读消费。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| Event type | `core.contract.snapshot_ready` |
| Topic / stream | `quantalithos.core.contract.v1` |
| 发布方 | `ContractSnapshotService` / `ContractFactService` / `OutboxPort` |
| 订阅方 | L0-bus boundary;L0-sdk、L1 仓和 archive 经 L0-bus 订阅 |

##### Event schema

```rust
/// 契约发布快照可用事件载荷。
pub struct ContractSnapshotReady {
    /// 发布快照 ID。
    pub snapshot_id: ContractReleaseSnapshotId,

    /// 来源发布基线 ID。
    pub baseline_id: ContractReleaseBaselineId,

    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 快照引用。
    pub snapshot_ref: ReleaseSnapshotRef,

    /// 快照 fingerprint。
    pub fingerprint: ContractFingerprint,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| outbox 写入失败 | `ApplicationError::Port` |
| CloudEvent envelope 构造失败 | `ApplicationError::Validation` |

##### 幂等与审计要求

- 事件幂等 key: `snapshot_id + fingerprint`。
- `subject` 使用 `ContractReleaseSnapshotId`。
- 事件不包含快照正文,只包含 `ReleaseSnapshotRef`。

#### 9.4.7 `ContractFactPublished`

##### 用途

表达某条契约事实已经交给 event publisher 边界。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| Event type | `core.contract.fact_published` |
| Topic / stream | `quantalithos.core.contract.v1` |
| 发布方 | `PublishContractFactJob` / `OutboxRelayWorker` |
| 订阅方 | L0-bus boundary;observability / archive 经 L0-bus 订阅 |

##### Event schema

```rust
/// 契约事实发布事件载荷。
pub struct ContractFactPublished {
    /// 契约事实记录 ID。
    pub fact_id: ContractFactRecordId,

    /// Outbox 事件 ID。
    pub outbox_event_id: OutboxEventId,

    /// 原始事实事件类型。
    pub original_event_type: ContractFactEventType,

    /// 发布回执。
    pub publish_receipt: EventPublishReceipt,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| event publisher 调用失败 | `ApplicationError::Port` |
| outbox 状态更新失败 | `ApplicationError::Port` |

##### 幂等与审计要求

- 事件幂等 key: `fact_id + outbox_event_id`。
- `subject` 使用 `ContractFactRecordId`。
- 发布失败不得删除 outbox 记录。

### 9.5 Operations Job 协议

Operations Job 是后台延后承接入口。Job 可以由 CLI trigger、调度器或运维脚本启动,但执行写入时必须调用 application service 或 worker,不能绕过 application service 直接改写真相。

#### 9.5.1 `ValidateContractChangeJob`

##### 用途

校验候选契约变化是否满足结构、引用、fingerprint 和兼容性要求。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| Job binary | `core-validate-contract-change` |
| 触发方式 | CLI trigger / scheduler |
| 函数签名 | `pub async fn run(&self, input: ValidateContractChangeJobInput, actor: ActorContext, meta: CommandMetadata) -> Result<ValidateContractChangeJobOutput, ApplicationError>` |
| 处理方 | `ValidateContractChangeJob` -> `ContractCompatibilityService.validate_contract_change(ValidateContractChange command, ActorContext actor, CommandMetadata meta)` |

##### 输入 schema

```rust
/// 契约变更校验作业输入。
pub struct ValidateContractChangeJobInput {
    /// Job ID。
    pub job_id: JobRunId,

    /// 契约定义 ID。
    pub definition_id: ContractDefinitionId,

    /// 可选候选源码引用。
    pub candidate_source_ref: Option<ContractSourceRef>,

    /// 触发原因。
    pub reason: JobTriggerReason,

    /// 请求幂等键。
    pub idempotency_key: IdempotencyKey,
}
```

##### 输出 schema

```rust
/// 契约变更校验作业输出。
pub struct ValidateContractChangeJobOutput {
    /// Job ID。
    pub job_id: JobRunId,

    /// 校验回执。
    pub receipt: CompatibilityValidationReceipt,

    /// 是否建议进入发布前置条件。
    pub publish_precondition_ready: bool,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| 契约定义不存在 | `ApplicationError::NotFound` |
| 工具链执行失败 | `ApplicationError::Port` |
| 校验不通过 | `ApplicationError::PreconditionFailed` |

##### 幂等与审计要求

- 幂等 key: `definition_id + job_id` 或显式 `idempotency_key`。
- 成功和失败都必须保留 job 回执摘要。
- 校验失败不等于发布失败,不得直接退役契约。

#### 9.5.2 `DeriveReleaseSnapshotJob`

##### 用途

从发布基线派生只读发布快照。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| Job binary | `core-derive-release-snapshot` |
| 触发方式 | baseline 发布后调度 / CLI trigger |
| 函数签名 | `pub async fn run(&self, input: DeriveReleaseSnapshotJobInput, actor: ActorContext, meta: CommandMetadata) -> Result<DeriveReleaseSnapshotJobOutput, ApplicationError>` |
| 处理方 | `DeriveReleaseSnapshotJob` -> `ContractSnapshotService.derive_release_snapshot(DeriveReleaseSnapshot command, ActorContext actor, CommandMetadata meta)` |

##### 输入 schema

```rust
/// 发布快照派生作业输入。
pub struct DeriveReleaseSnapshotJobInput {
    /// Job ID。
    pub job_id: JobRunId,

    /// 发布基线 ID。
    pub baseline_id: ContractReleaseBaselineId,

    /// 是否允许覆盖尚未 ready 的同基线快照。
    pub allow_replace_building_snapshot: bool,

    /// 请求幂等键。
    pub idempotency_key: IdempotencyKey,
}
```

##### 输出 schema

```rust
/// 发布快照派生作业输出。
pub struct DeriveReleaseSnapshotJobOutput {
    /// Job ID。
    pub job_id: JobRunId,

    /// 快照回执。
    pub receipt: ContractSnapshotReceipt,

    /// 发布快照 ID。
    pub snapshot_id: ContractReleaseSnapshotId,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| 发布基线不存在 | `ApplicationError::NotFound` |
| 基线不可派生快照 | `ApplicationError::PreconditionFailed` |
| 快照导出或存储失败 | `ApplicationError::Port` |

##### 幂等与审计要求

- 幂等 key: `baseline_id + job_id` 或显式 `idempotency_key`。
- 成功后必须写入 `ContractSnapshotReady` outbox 事件。
- 派生失败必须保留旧快照可消费状态,不能删除旧快照。

#### 9.5.3 `RebuildContractIndexJob`

##### 用途

重建契约只读模型、兼容性追溯和 trace projection。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| Job binary | `core-rebuild-contract-index` |
| 触发方式 | CLI trigger / scheduler / projection stale 恢复 |
| 函数签名 | `pub async fn run(&self, input: RebuildContractIndexJobInput, actor: ActorContext, meta: CommandMetadata) -> Result<RebuildContractIndexJobOutput, ApplicationError>` |
| 处理方 | `RebuildContractIndexJob` -> `ContractOperationsService.rebuild_contract_index(RebuildContractIndex command, ActorContext actor, CommandMetadata meta)` |

##### 输入 schema

```rust
/// 契约索引重建作业输入。
pub struct RebuildContractIndexJobInput {
    /// Job ID。
    pub job_id: JobRunId,

    /// 重建范围。
    pub scope: ProjectionRebuildScope,

    /// 批大小。
    pub batch_size: BatchSize,

    /// 请求幂等键。
    pub idempotency_key: IdempotencyKey,
}
```

##### 输出 schema

```rust
/// 契约索引重建作业输出。
pub struct RebuildContractIndexJobOutput {
    /// Job ID。
    pub job_id: JobRunId,

    /// 运维回执。
    pub receipt: OperationsReceipt,

    /// 重建水位。
    pub watermark: ProjectionWatermark,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| 重建范围非法 | `ApplicationError::Validation` |
| projection 写入失败 | `ApplicationError::Port` |
| source / repository 读取失败 | `ApplicationError::Port` |

##### 幂等与审计要求

- 幂等 key: `scope + job_id` 或显式 `idempotency_key`。
- 重建只允许改写 projection,不得改写 definition truth。
- 需要记录运维审计。

#### 9.5.4 `RecalculateFingerprintJob`

##### 用途

复算契约定义或快照 canonical fingerprint,用于漂移判断和发布前检查。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| Job binary | `core-recalculate-fingerprint` |
| 触发方式 | CLI trigger / scheduler / 发布前检查 |
| 函数签名 | `pub async fn run(&self, input: RecalculateFingerprintJobInput, actor: ActorContext, meta: CommandMetadata) -> Result<RecalculateFingerprintJobOutput, ApplicationError>` |
| 处理方 | `RecalculateFingerprintJob` -> `ContractOperationsService.recalculate_fingerprint(RecalculateFingerprint command, ActorContext actor, CommandMetadata meta)` |

##### 输入 schema

```rust
/// Fingerprint 复算作业输入。
pub struct RecalculateFingerprintJobInput {
    /// Job ID。
    pub job_id: JobRunId,

    /// 复算目标。
    pub target: FingerprintRecalculationTarget,

    /// 期望算法。
    pub algorithm: FingerprintAlgorithm,

    /// 请求幂等键。
    pub idempotency_key: IdempotencyKey,
}
```

##### 输出 schema

```rust
/// Fingerprint 复算作业输出。
pub struct RecalculateFingerprintJobOutput {
    /// Job ID。
    pub job_id: JobRunId,

    /// 运维回执。
    pub receipt: OperationsReceipt,

    /// 计算结果。
    pub result: FingerprintCalculationResult,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| 复算目标不存在 | `ApplicationError::NotFound` |
| 算法不支持 | `ApplicationError::Validation` |
| fingerprint runner 执行失败 | `ApplicationError::Port` |

##### 幂等与审计要求

- 幂等 key: `target + algorithm + job_id` 或显式 `idempotency_key`。
- 复算结果不能直接发布为真相,必须经后续策略和门禁判断。
- 需要记录运维审计。

#### 9.5.5 `PublishContractFactJob`

##### 用途

整理已提交事实并更新事实输出状态。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| Job binary | `core-publish-contract-fact` |
| 触发方式 | CLI trigger / scheduler |
| 函数签名 | `pub async fn run(&self, input: PublishContractFactJobInput, actor: ActorContext, meta: CommandMetadata) -> Result<PublishContractFactJobOutput, ApplicationError>` |
| 处理方 | `PublishContractFactJob` -> `ContractFactService.publish_contract_fact(PublishContractFact command, ActorContext actor, CommandMetadata meta)` |

##### 输入 schema

```rust
/// 契约事实发布作业输入。
pub struct PublishContractFactJobInput {
    /// Job ID。
    pub job_id: JobRunId,

    /// 可选事实记录 ID;为空时按批次拉取。
    pub fact_id: Option<ContractFactRecordId>,

    /// 批大小。
    pub batch_size: BatchSize,

    /// 请求幂等键。
    pub idempotency_key: IdempotencyKey,
}
```

##### 输出 schema

```rust
/// 契约事实发布作业输出。
pub struct PublishContractFactJobOutput {
    /// Job ID。
    pub job_id: JobRunId,

    /// 事实回执集合。
    pub receipts: Vec<ContractFactReceipt>,

    /// 本次处理数量。
    pub processed_count: u32,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| 指定事实不存在 | `ApplicationError::NotFound` |
| 事实状态不可发布 | `ApplicationError::PreconditionFailed` |
| outbox 写入失败 | `ApplicationError::Port` |

##### 幂等与审计要求

- 幂等 key: `fact_id + job_id` 或显式 `idempotency_key`。
- 不直接调用 L0-bus;只整理事实和 outbox。
- 需要记录运维审计。

#### 9.5.6 `OutboxRelayWorker`

##### 用途

从 outbox 拉取待发布事件,调用 `EventPublisherPort`,并更新 outbox 发布状态。

##### 函数签名 / 路由

| 项 | 内容 |
|---|---|
| Job binary | `core-outbox-relay` |
| 触发方式 | long running worker / 手工单批 replay |
| 函数签名 | `pub async fn run_once(&self, input: OutboxRelayWorkerInput) -> Result<OutboxRelayWorkerOutput, ApplicationError>` |
| 处理方 | `OutboxRelayWorker` -> `OutboxPort.fetch_pending(BatchSize batch_size)` -> `EventPublisherPort.publish(FactOutboxEvent event)` |

##### 输入 schema

```rust
/// Outbox relay worker 输入。
pub struct OutboxRelayWorkerInput {
    /// Worker run ID。
    pub run_id: JobRunId,

    /// 批大小。
    pub batch_size: BatchSize,

    /// 是否只执行一次。
    pub run_once: bool,
}
```

##### 输出 schema

```rust
/// Outbox relay worker 输出。
pub struct OutboxRelayWorkerOutput {
    /// Worker run ID。
    pub run_id: JobRunId,

    /// 已发布数量。
    pub published_count: u32,

    /// 发布失败数量。
    pub failed_count: u32,
}
```

##### 错误映射

| 场景 | 错误 |
|---|---|
| outbox 读取失败 | `ApplicationError::Port` |
| event publisher 全局不可用 | `ApplicationError::Port` |
| 单条事件发布失败 | 不终止整批;记录 `mark_failed` |

##### 幂等与审计要求

- 单条事件幂等依赖 CloudEvent `id` 和业务幂等 key。
- 发布成功后必须调用 `OutboxPort.mark_published(OutboxEventId event_id, Timestamp published_at)`。
- 发布失败不得删除 outbox 记录,必须调用 `mark_failed` 或保留待重试状态。

### 9.6 Step 8 统一复核

#### 9.6.1 协议覆盖复核

| 类别 | 应覆盖数量 | 已覆盖数量 | 结果 |
|---|---:|---:|---|
| Command API | 5 | 5 | 通过 |
| Query API | 8 | 8 | 通过 |
| Outbound Event | 7 | 7 | 通过 |
| Operations Job | 6 | 6 | 通过 |

#### 9.6.2 Schema 复核

| 检查项 | 结果 | 说明 |
|---|---|---|
| 每个 Command 是否有 Rust DTO | 通过 | §9.2 已覆盖 |
| 每个 Query 是否有 Rust DTO 和 view DTO | 通过 | §9.3 已覆盖 |
| 每个 Event 是否有 payload DTO | 通过 | §9.4 已覆盖 |
| 每个 Job 是否有 input / output DTO | 通过 | §9.5 已覆盖 |
| 每个协议是否有错误映射 | 通过 | 每节均有场景级错误映射 |
| 每个写路径是否有幂等要求 | 通过 | Command / Job 均要求幂等键或 JobRunId |

#### 9.6.3 通信方式复核

| 场景 | 本步选择 | 是否符合架构 |
|---|---|---|
| 同步写入 | CLI command + Rust DTO | 符合无常驻在线运行时 |
| 同步查询 | CLI command + Rust DTO | 符合只读同步入口 |
| 事实传播 | CloudEvents payload + outbox | 符合 L0-core 不实现 bus runtime |
| 后台处理 | job binary + Rust DTO | 符合后台延后承接 |

#### 9.6.4 Step 9 交接项

| 后续处理流 | 对应协议 | Step 9 需要展开 |
|---|---|---|
| 草稿写路径 | `CreateContractDraft`、`UpdateContractDraft` | handler -> service -> domain -> repository / audit / outbox 调用顺序 |
| 评审提交路径 | `SubmitContractForReview` | 状态迁移、版本检查、审计和 outbox |
| 发布基线路径 | `PublishContractBaseline` | gate、fingerprint、compatibility、baseline、fact、outbox |
| 生命周期迁移路径 | `UpdateContractLifecycle` | 状态矩阵、supersede 关系和事件副作用 |
| 通用读路径 | 普通 query | read model / repository fallback 和 stale 处理 |
| 追溯读路径 | `TraceContractEvolution`、`GetCompatibilityTrace` | projection、audit、fact 组合读取 |
| 后台校验与复算路径 | `ValidateContractChangeJob`、`RecalculateFingerprintJob` | toolchain runner、policy、trace index |
| 快照派生路径 | `DeriveReleaseSnapshotJob` | exporter、snapshot store、snapshot repository、event |
| 索引重建路径 | `RebuildContractIndexJob` | source / repository 扫描、projection replace、水位 |
| 事实发布路径 | `PublishContractFactJob`、`OutboxRelayWorker` | fact 状态、outbox 拉取、publisher、mark published / failed |

---

## 10. 回填草稿

正式 `03-详细设计.md` 回填时应遵守:

```text
1. §7 按 Command API、Query API、Outbound Event、Operations Job 四组展开。
2. 每个协议必须保留函数签名 / 路由、schema、错误映射、幂等与审计要求。
3. §6 全局索引只列协议名称、类别、所属文件和处理流位置,不重复完整 schema。
4. Step 9 必须以本文件的协议清单为唯一处理流输入。
5. Event type 的 `core.contract.*` 需要在风险 / 待确认事项中跟踪与 bus event catalog 的正式登记关系。
```

建议正式文档 §7 结构:

| 正式章节位置 | 回填内容 |
|---|---|
| `7.1 协议总览` | 协议分类、总表、统一错误映射、CloudEvent 约束 |
| `7.2 Command API` | 5 个 command 协议 |
| `7.3 Query API` | 8 个 query 协议 |
| `7.4 Outbound Event` | 7 个 event 协议 |
| `7.5 Operations Job` | 6 个 job / worker 协议 |
| `7.6 协议复核` | schema、错误、幂等、审计和 Step 9 交接 |

---

## 11. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 同步入口是否设计 HTTP / RPC | A. HTTP; B. gRPC; C. CLI / Rust library | C | 当前架构明确无常驻在线运行时,后续 gateway 可包装 CLI / library 能力 | 已确认采用 C |
| Outbound event type 是否使用 `core.contract.*` | A. 使用 `core.contract.*`; B. 归入某个 L1 domain; C. 暂不定义 type | A | 本仓事件表达共享契约事实,不属于 L1 六域业务语义;不定义 type 会阻塞实现 | 已确认采用 A,但 Step 18 跟踪 event catalog 登记 |
| Query 是否写审计 | A. 所有 query 写审计; B. 仅写 trace context 不写审计; C. 按调用方动态决定 | B | 本仓不做鉴权和观测存储,查询审计属于后续 observability / gateway 能力 | 已确认采用 B |
| Job 是否允许直接调用 repository | A. 允许; B. 只读可允许、写入必须 service; C. 完全不允许 | B | job 可读 batch 输入,但写入真相必须经 application service 保持规则一致 | 已确认采用 B |

---

## 12. 进入下一步条件

Step 8 完成后必须满足:

- 所有 Command / Query / Event / Job 都有独立协议小节。
- 每个协议都有函数签名 / CLI command / event type / job binary。
- 每个协议都有请求、响应、event 或 job input / output schema。
- 每个协议都有错误映射。
- 写路径、event 和 job 都有幂等要求。
- Command / Job 的审计要求、Query 的只读边界、Event 的 outbox 边界已明确。
- 可以进入 Step 9 “逐接口定义函数级处理流”。
