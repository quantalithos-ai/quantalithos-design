# Step 12. 定义错误模型、异常分支与恢复口径

## 1. Step 状态

- 状态：[x] 已确认
- 所属文档：`projects/L0-bus/03-详细设计.md`
- 本步目标：定义 L0-bus 的代码层错误类型、协议错误映射、异常分支处理、恢复策略和审计 / 事件记录口径。
- 本步不直接修改正式 `03-详细设计.md`，只形成中间产物。

---

## 2. 本步输入

| 输入 | 关键结论 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 12 | 必须输出错误类型表、错误映射表、异常分支处理表和恢复口径表 | 约束本文件结构 |
| `standards/document/详细设计书写规范.md` §5.11 | 错误类型必须能映射模块错误或协议错误，必须区分可重试、不可重试、需人工介入 | 约束正式文档回填 |
| `projects/L0-bus/design-calibration/03_ddd_step_06_object_contracts.md` | 已定义领域对象、状态 enum 和领域函数 | 决定 domain error 来源 |
| `projects/L0-bus/design-calibration/03_ddd_step_08_protocol_contracts.md` | 已定义公共协议错误类别、HTTP / Event / Job 映射 | 决定外部错误映射 |
| `projects/L0-bus/design-calibration/03_ddd_step_09_function_flows.md` | 已定义每个处理流的错误映射、回滚和副作用 | 决定异常分支处理 |
| `projects/L0-bus/design-calibration/03_ddd_step_10_state_matrix.md` | 已定义状态机非法迁移和禁止规则 | 决定非法状态错误 |
| `projects/L0-bus/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | 已定义 repository、UnitOfWork、publisher、source ack、projection 失败恢复 | 决定事务与恢复错误 |

---

## 3. SOP 问题回答

### 3.1 每个模块有哪些错误类型？

| 模块 | 错误类型 | 作用 |
|---|---|---|
| `contracts` | `ValidationError` | 表达 command / query / event / job DTO 字段缺失、格式非法、枚举值非法、引用格式非法 |
| `domain` | `DomainError` | 表达领域对象不变量、状态机非法迁移、payload boundary、read-only projection 等领域错误 |
| `application` | `ApplicationError` | 统一编排 domain / repository / port / UoW 错误，并映射为协议错误类别 |
| `application ports` | `RepositoryError`、`UnitOfWorkError`、`SourcePortError`、`PublisherPortError`、`TransportPortError`、`ProjectionError` | 表达持久化、事务、上游 source、下游 publisher、后端 transport、projection 读写失败 |
| `api` | `ApiError` | 将 `ApplicationError` 映射为 HTTP JSON error response |
| `worker` | `ConsumerError` | 将 consumer 处理失败映射为 rejected / duplicate / retryable / failed result |
| `jobs` | `JobError` | 将 job 处理失败映射为 item skipped / retryable job failure / partial success / failed summary |
| `infra` | adapter-local error | adapter 内部错误必须转换为对应 port error，不直接穿透到 application |

### 3.2 哪些错误映射到 HTTP / RPC / Event 失败？

L0-bus P0 的同步协议是 HTTP JSON，不定义独立 RPC。Event / Job 入口不返回 HTTP 状态，而是返回结构化 result。

| 协议错误类别 | HTTP 映射 | Event / Job 映射 | 典型内部来源 |
|---|---|---|---|
| `ValidationError` | `400` | rejected / failed item | DTO 字段缺失、枚举值非法、分页参数非法 |
| `NotFoundError` | `404` | skipped / not_found item | delivery、dead letter、failure material、projection 不存在 |
| `ConflictError` | `409` | duplicate / conflict / skipped | 版本冲突、幂等冲突、状态冲突、终态 reopen |
| `BoundaryViolationError` | `422` | rejected item / rejected evidence | payload body、secret、raw backend body、projection truth write |
| `DependencyError` | `503` | retryable failure | repository store、source、publisher、transport backend 暂时不可用 |
| `InternalError` | `500` | failed result | 未分类实现缺陷、不可恢复 adapter 错误、rollback 不确定失败 |

### 3.3 哪些错误可重试，哪些不可重试，哪些需要人工介入？

| 分类 | 判断标准 | 典型错误 | 默认处理 |
|---|---|---|---|
| 可自动重试 | 外部依赖或存储暂时不可用，重复执行不会破坏 truth | `DependencyError`、`RepositoryError::Unavailable`、`SourcePortError::Unavailable`、`PublisherPortError::RetryableFailure`、`TransportPortError::BackendUnavailable` | 标记 retryable，保留 evidence，由 job / publisher retry 或调用方重试 |
| 不可自动重试 | 请求或状态本身非法，重复执行仍失败 | `ValidationError`、`BoundaryViolationError`、`DomainError::InvalidStateTransition`、`DomainError::TerminalStateReopenRejected` | 返回 rejected / conflict，不自动重试 |
| 可返回既有结果 | 幂等键命中且请求摘要一致 | `ApplicationError::DuplicateRequest`、`ConsumerError::DuplicateEvent` | 返回 existing result，不重复写 truth |
| 需要人工介入 | schema / boundary violation 发生在已提交 truth 后的发布、replay audit chain 异常、commit 状态不确定 | `PublisherPortError::SchemaViolation`、`ProjectionError::BoundaryViolation`、`UnitOfWorkError::CommitUncertain` | 记录 rejected evidence / critical log，进入人工修复或运维处置 |

### 3.4 事务失败、并发冲突、重复请求、外部依赖失败如何处理？

| 场景 | 处理口径 |
|---|---|
| 事务开始失败 | 不写业务 truth，映射 `DependencyError` 或 `InternalError`；调用方 / job 可重试 |
| 事务内 domain / repository 错误 | rollback 当前 `UnitOfWork`；如果是受控 rejected fact，则提交 rejected fact 后返回错误响应 |
| 事务提交失败 | 视为未完成写入或提交状态不确定；返回 retryable dependency / internal error，并记录 critical evidence |
| 并发版本冲突 | rollback 当前 item；HTTP 返回 `409`，job item skipped / retryable 由 Step 13 幂等并发细化 |
| 重复请求 / 重复事件 | 幂等摘要一致返回既有结果；摘要不一致返回 `409 ConflictError` 并可写 conflict audit |
| source ack 失败 | bus truth 不回滚；重复消费时由 idempotency anchor 返回既有结果 |
| publisher 失败 | truth 不回滚；retryable 失败写 evidence，schema / boundary 失败写 rejected evidence |
| projection 更新失败 | 不回滚 truth；projection item 回滚，Query 返回旧 projection / stale marker |
| transport backend 失败 | 可重试 backend failure 形成 retry candidate；raw body / secret 越界拒绝落库 |

### 3.5 哪些异常需要写审计、日志或事件？

| 异常类型 | 审计 | 日志 | 事件 |
|---|---|---|---|
| 受控业务拒绝，例如 publication rejected、retry not allowed、DLQ not allowed | 写 `BusAuditEntry` | info / warn | 需要时发布 rejected / state changed event |
| 状态冲突、终态 reopen、late feedback | 可写 conflict audit | warn | 不发布成功状态事件 |
| payload / secret / private body 越界 | 必须写 boundary violation audit 或 rejected evidence | warn | 不发布携带违规内容的事件 |
| repository / UoW / dependency 暂不可用 | 不一定能写 audit；必须记录结构化日志 | error | 不发布业务成功事件 |
| publisher retryable failure | 写 publish evidence | warn / error | 不发布二次业务事件，仅等待 publisher retry |
| publisher schema violation | 写 rejected evidence | error | 不发布失败 event，避免错误扩散 |
| projection stale / rebuild conflict | 写 projection evidence 或 audit | warn | 不影响 truth event |
| rollback failure / commit uncertain | 尽量写 critical evidence；若不可写则至少结构化日志 | error / critical | 不发布成功事件 |

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| Step 8 只有协议错误类别，缺少代码层错误 enum 归属 | 实现者不知道错误应该定义在哪个 crate / module | 本步按 `contracts / domain / application / api / worker / jobs / infra` 收敛错误类型 |
| Step 9 的错误映射分散在每个处理流 | 实现者容易在不同 flow 中重复定义不同错误名 | 本步提取统一错误类型表和异常分支表 |
| Step 10 已列出非法状态错误，但未统一外部映射 | domain error 可能被错误地映射成 `500` | 本步明确状态非法通常映射 `409` 或 `422` |
| Step 11 定义了 publisher / projection / source ack 恢复，但没有错误模型 | 恢复实现容易只写日志，不保留 evidence | 本步规定 retryable / rejected / manual recovery 口径 |
| `ApiError`、`ConsumerError`、`JobError` 可能被误当成业务错误 | 会污染 domain / application | 本步规定它们只是边界映射错误，不进入领域对象 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 错误分层 | 只有零散 `ValidationError` / `ConflictError` 等协议类别 | 明确 domain、application、port、api、worker、jobs 的错误归属 |
| 错误映射 | 每个接口局部列出 | 汇总为 HTTP / Event / Job 统一映射 |
| 事务异常 | Step 11 只定义事务边界和恢复原则 | 本步定义 begin / rollback / commit / uncertain commit 的错误处理 |
| 并发 / 幂等 | 只知道有 version 和 unique constraint | 本步先定义 `ConflictError` / duplicate / idempotency conflict，Step 13 再细化 key 和重入 |
| 外部依赖失败 | 分散在 source / publisher / backend / projection 说明中 | 统一分成可重试、不可重试、人工介入 |
| 审计 / 日志 / 事件 | 各 flow 局部描述 | 本步定义哪些异常必须写 audit / evidence，哪些不能发布成功事件 |

---

## 6. 设计取舍

### 6.1 是否为每个处理流定义独立错误 enum

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：每个 flow 一个错误 enum | 最细，但会导致 `AcceptPublicationError`、`RetryCycleError` 等大量重复 | 不采用 |
| 方案 B：按层定义错误 enum，flow 通过 `ApplicationError` 组合 | 推荐 |
| 方案 C：只用一个全局 `BusError` | 简单，但无法体现模块边界和外部映射差异 | 不采用 |

推荐方案 B。它既能保持实现可编码，又不会让错误类型爆炸。

### 6.2 domain error 是否直接映射到 HTTP

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：domain error 直接由 API handler 映射 | handler 需要理解领域细节 | 不采用 |
| 方案 B：domain error 先进入 `ApplicationError`，再由 `ApiError` / `ConsumerError` / `JobError` 映射 | 推荐 |
| 方案 C：domain error 全部映射 `500` | 会把业务冲突误报为系统故障 | 不采用 |

推荐方案 B。application 是编排层，最适合把领域错误转成协议语义。

### 6.3 publisher / projection 失败是否回滚 truth

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：回滚 truth | 会破坏 Step 11 的 committed truth 优先原则 | 不采用 |
| 方案 B：不回滚 truth，写 evidence / stale marker / retry result | 推荐 |
| 方案 C：忽略失败，只打日志 | 丢失恢复线索 | 不采用 |

推荐方案 B。L0-bus 是传递与恢复底座，必须保留可恢复证据。

### 6.4 boundary violation 是否都直接失败并回滚

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：所有 boundary violation 都回滚 | 简单，但无法留下 publication rejected truth | 不采用 |
| 方案 B：接入判定类 violation 可提交 rejected fact；已提交 truth 后的 publisher violation 写 rejected evidence；其他越界输入直接 rejected / rollback | 推荐 |
| 方案 C：允许越界内容落库后再清理 | 违反 payload boundary | 不采用 |

推荐方案 B。它区分“受控拒绝事实”和“不能落库的违规输入”。

---

## 7. 结构化中间产物

### 7.1 错误传播图

```text
Inbound HTTP / Event / Job
  |
  v
contracts validation
  |-- invalid DTO --------------------------> ValidationError
  v
application service
  |-- domain invariant / state violation ---> DomainError -> ApplicationError
  |-- repository / UoW failure -------------> RepositoryError / UnitOfWorkError -> ApplicationError
  |-- source / publisher / backend failure -> SourcePortError / PublisherPortError / TransportPortError -> ApplicationError
  |-- projection failure -------------------> ProjectionError -> ApplicationError
  v
boundary mapper
  |-- api handler --------------------------> ApiError -> HTTP JSON error
  |-- worker consumer ----------------------> ConsumerError -> consumer result
  |-- job runner ---------------------------> JobError -> job summary / item result
```

关键说明：

- `DomainError` 不直接暴露给 HTTP / Event / Job 调用方，必须先由 application 映射成协议错误类别。
- `ApiError`、`ConsumerError`、`JobError` 是边界错误，不得被 domain 对象依赖。
- infra adapter 的内部错误必须转换成 port error，不能把第三方库错误直接穿透到 application。
- 已提交 truth 之后发生的 publisher / projection 失败，不回滚 truth，只生成 evidence、stale marker 或 retry result。

### 7.2 错误 enum 实现契约

#### 7.2.1 `DomainError`

```rust
/// 领域层错误。
///
/// 用于表达 L0-bus 领域对象不变量、状态机迁移和边界守卫失败。
pub enum DomainError {
    /// 当前对象状态不允许执行目标迁移。
    InvalidStateTransition,
    /// 终态对象被尝试重新打开或回退。
    TerminalStateReopenRejected,
    /// 已拒绝的发布材料被尝试创建 delivery。
    PublicationRejectedCannotScheduleDelivery,
    /// payload body、secret 或私有正文越过 bus 引用边界。
    PayloadBoundaryViolation,
    /// 后端原始状态未经过归一化就被写入 delivery。
    BackendStatusNotNormalized,
    /// feedback 结果不能推动 delivery 完成。
    FeedbackDoesNotCompleteDelivery,
    /// 当前 delivery 状态不允许记录该 feedback。
    FeedbackNotAllowed,
    /// 当前 delivery 或 retry plan 不允许创建或执行 retry。
    RetryNotAllowed,
    /// retry 已耗尽但仍被尝试 dispatch。
    RetryExhaustedCannotDispatch,
    /// 当前 delivery 不允许进入 dead letter。
    DeadLetterNotAllowed,
    /// 已关闭的 dead letter 不允许继续创建 replay preparation。
    DeadLetterClosed,
    /// dead letter 不能直接触发 dispatch。
    DeadLetterCannotDispatchDirectly,
    /// 当前 dead letter 或 audit chain 不允许创建 replay preparation。
    ReplayPreparationNotAllowed,
    /// replay preparation 不是 replay executor，不能直接修改 delivery。
    ReplayPreparationIsNotExecutor,
    /// projection 来源 truth 或 audit 缺失。
    ProjectionSourceMissing,
    /// projection 写入违反只读输出策略。
    ProjectionWriteRejected,
    /// projection 试图反写 bus truth。
    ReadOnlyProjectionViolation,
    /// projection 版本冲突。
    ProjectionVersionConflict,
    /// stale projection 未经过 rebuild 就被标记 active。
    ProjectionRebuildRequired,
    /// projection rebuild 失败。
    ProjectionRebuildFailed,
    /// backend capability check 试图修改 delivery truth。
    BackendCapabilityCannotMutateDelivery,
}
```

#### 7.2.2 `ApplicationError`

```rust
/// 应用层错误。
///
/// 用于把领域错误、端口错误和协议错误归一为可映射到 HTTP / Event / Job 的错误类别。
pub enum ApplicationError {
    /// 请求或输入数据格式非法。
    Validation(ValidationError),
    /// 请求的 bus truth、projection 或外部引用不存在。
    NotFound(NotFoundError),
    /// 版本、状态、幂等或唯一约束冲突。
    Conflict(ConflictError),
    /// payload、secret、后端私有正文或 projection 写入越界。
    BoundaryViolation(BoundaryViolationError),
    /// 外部依赖、存储或后端暂时不可用。
    Dependency(DependencyError),
    /// 未分类内部错误。
    Internal(InternalError),
    /// 领域对象返回的错误。
    Domain(DomainError),
    /// repository port 返回的错误。
    Repository(RepositoryError),
    /// UnitOfWork port 返回的错误。
    UnitOfWork(UnitOfWorkError),
    /// 上游 outbox source port 返回的错误。
    Source(SourcePortError),
    /// outbound publisher port 返回的错误。
    Publisher(PublisherPortError),
    /// transport backend port 返回的错误。
    Transport(TransportPortError),
    /// read projection 读写返回的错误。
    Projection(ProjectionError),
}
```

必须提供的成员函数：

| 函数签名 | 作用 |
|---|---|
| `category(&self) -> ProtocolErrorCategory` | 返回 `validation / not_found / conflict / boundary_violation / dependency / internal` |
| `retryable(&self) -> bool` | 判断调用方或 job 是否可以自动重试 |
| `requires_manual_action(&self) -> bool` | 判断是否需要人工或运维介入 |
| `details_ref(&self) -> Option<ErrorDetailsRef>` | 返回可审计错误详情引用，不返回 payload body |

#### 7.2.3 Port error

```rust
/// Repository 端口错误。
pub enum RepositoryError {
    /// 存储暂时不可用。
    Unavailable,
    /// 乐观版本不匹配。
    VersionConflict,
    /// 唯一约束冲突。
    UniqueViolation,
    /// append-only sequence 冲突。
    SequenceConflict,
    /// 持久化记录无法重建为领域对象。
    CorruptedRecord,
}

/// UnitOfWork 端口错误。
pub enum UnitOfWorkError {
    /// 无法开启事务。
    BeginFailed,
    /// 提交事务失败且确认未提交。
    CommitFailed,
    /// 提交结果不确定。
    CommitUncertain,
    /// 回滚事务失败。
    RollbackFailed,
    /// 事务句柄非法或已过期。
    InvalidHandle,
}

/// 上游 outbox source 端口错误。
pub enum SourcePortError {
    /// 上游 source 暂时不可用。
    Unavailable,
    /// 拉取游标非法。
    CursorInvalid,
    /// source ack 失败。
    AckFailed,
    /// source fact 越过 payload boundary。
    BoundaryViolation,
}

/// Outbound publisher 端口错误。
pub enum PublisherPortError {
    /// publisher 暂时不可用或超时。
    RetryableFailure,
    /// outbound event schema 不符合发布契约。
    SchemaViolation,
    /// outbound event 携带了不允许发布的正文或 secret。
    BoundaryViolation,
    /// event id 已经发布。
    Duplicate,
}

/// Transport backend 端口错误。
pub enum TransportPortError {
    /// 后端暂时不可用。
    BackendUnavailable,
    /// 当前 delivery 所需能力与后端能力不匹配。
    CapabilityMismatch,
    /// dispatch 调用超时。
    DispatchTimeout,
    /// 后端 signal 无法归一化为 bus result。
    NormalizeFailed,
    /// 后端响应包含不允许落库的私有正文。
    PrivateBodyViolation,
}

/// Projection 读写错误。
pub enum ProjectionError {
    /// projection 来源 truth 或 audit 缺失。
    SourceMissing,
    /// projection 来源已经过期。
    StaleSource,
    /// projection version 冲突。
    VersionConflict,
    /// projection payload 违反只读输出策略。
    BoundaryViolation,
    /// projection store 暂时不可用。
    StoreUnavailable,
    /// projection rebuild 失败。
    RebuildFailed,
}
```

#### 7.2.4 Boundary error

```rust
/// API 边界错误。
///
/// 只由 HTTP handler 构造，用于生成 HTTP JSON error response。
pub struct ApiError {
    /// 协议错误类别。
    pub category: ProtocolErrorCategory,
    /// 对外稳定错误码。
    pub code: ErrorCode,
    /// 是否建议调用方重试。
    pub retryable: bool,
    /// 错误详情引用。
    pub details_ref: Option<ErrorDetailsRef>,
}

/// Consumer 边界错误。
///
/// 只由 worker consumer 构造，用于生成 rejected、duplicate、retryable 或 failed result。
pub struct ConsumerError {
    /// consumer result 类别。
    pub result_kind: ConsumerErrorKind,
    /// 对外稳定错误码。
    pub code: ErrorCode,
    /// 是否允许 source 或调度器重试。
    pub retryable: bool,
}

/// Job 边界错误。
///
/// 只由 job runner 构造，用于生成 job summary 或 item result。
pub struct JobError {
    /// job result 类别。
    pub result_kind: JobErrorKind,
    /// 对外稳定错误码。
    pub code: ErrorCode,
    /// 失败 item 数。
    pub failed_items: u32,
    /// 是否允许 job 重跑。
    pub retryable: bool,
}
```

### 7.3 错误类型总表

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `ValidationError` | `contracts` | DTO 字段缺失、枚举值非法、分页参数非法 | 否 | HTTP `400`；Event / Job rejected |
| `DomainError::InvalidStateTransition` | `domain` | 当前状态不允许目标迁移 | 否 | `ConflictError` / HTTP `409` |
| `DomainError::TerminalStateReopenRejected` | `domain` | 终态对象被重新打开 | 否 | `ConflictError` / HTTP `409` |
| `DomainError::PublicationRejectedCannotScheduleDelivery` | `domain` | rejected publication 进入 delivery 主线 | 否 | `ConflictError` / HTTP `409`；写 boundary audit |
| `DomainError::PayloadBoundaryViolation` | `domain` | payload body / secret 越界 | 否 | `BoundaryViolationError` / HTTP `422`；Event rejected |
| `DomainError::BackendStatusNotNormalized` | `domain` | raw backend status 直接写 truth | 否 | `BoundaryViolationError` / HTTP `422`；Consumer rejected |
| `DomainError::FeedbackDoesNotCompleteDelivery` | `domain` | 非 ack feedback 推动 completed | 否 | `ConflictError` / HTTP `409` |
| `DomainError::FeedbackNotAllowed` | `domain` | 当前 delivery 不允许记录 feedback | 否 | `ConflictError` / HTTP `409` |
| `DomainError::RetryNotAllowed` | `domain` | 非 failed delivery 创建 retry 或 active retry 冲突 | 否 | `ConflictError` / HTTP `409` |
| `DomainError::RetryExhaustedCannotDispatch` | `domain` | exhausted retry 仍被 dispatch | 否 | `ConflictError` / HTTP `409`；写 recovery boundary audit |
| `DomainError::DeadLetterNotAllowed` | `domain` | 非 failed delivery 进入 DLQ | 否 | `ConflictError` / HTTP `409` |
| `DomainError::DeadLetterClosed` | `domain` | closed DLQ 创建 replay preparation | 否 | `ConflictError` / HTTP `409` |
| `DomainError::DeadLetterCannotDispatchDirectly` | `domain` | DLQ 直接 dispatch | 否 | `BoundaryViolationError` / HTTP `422` |
| `DomainError::ReplayPreparationNotAllowed` | `domain` | audit chain 或 approval 不满足 replay preparation | 否或人工 | `ConflictError` / HTTP `409` |
| `DomainError::ReplayPreparationIsNotExecutor` | `domain` | replay preparation 直接改 delivery | 否 | `BoundaryViolationError` / HTTP `422` |
| `DomainError::ReadOnlyProjectionViolation` | `domain` | projection 试图反写 truth | 否 | `BoundaryViolationError` / HTTP `422` |
| `DomainError::ProjectionVersionConflict` | `domain` | projection replace version 不匹配 | 是，受控重试 | `ConflictError` / HTTP `409`；Job item conflict |
| `RepositoryError::Unavailable` | `application ports` | store 暂时不可用 | 是 | `DependencyError` / HTTP `503`；Job retryable |
| `RepositoryError::VersionConflict` | `application ports` | `expected_version` 不匹配 | 视场景 | `ConflictError` / HTTP `409`；Job skip / retry |
| `RepositoryError::UniqueViolation` | `application ports` | 幂等键、source ref、active retry、DLQ 等唯一冲突 | 否或返回既有结果 | `ConflictError` / HTTP `409` |
| `RepositoryError::SequenceConflict` | `application ports` | audit append sequence 冲突 | 是 | `ConflictError` / retryable item |
| `UnitOfWorkError::BeginFailed` | `application ports` | 事务无法开始 | 是 | `DependencyError` / HTTP `503` |
| `UnitOfWorkError::CommitFailed` | `application ports` | 事务确认未提交 | 是 | `DependencyError` / HTTP `503` |
| `UnitOfWorkError::CommitUncertain` | `application ports` | 提交结果不确定 | 需人工 | `InternalError` / HTTP `500`；critical evidence |
| `UnitOfWorkError::RollbackFailed` | `application ports` | rollback 未能清理 staged writes / locks | 需人工 | `InternalError` / HTTP `500`；critical log |
| `SourcePortError::Unavailable` | `application ports` | 上游 outbox source 不可用 | 是 | Job retryable |
| `SourcePortError::AckFailed` | `application ports` | bus truth 已提交后 source ack 失败 | 是 | Job warning / retryable evidence |
| `PublisherPortError::RetryableFailure` | `application ports` | publisher 暂时不可用 | 是 | publish retry evidence |
| `PublisherPortError::SchemaViolation` | `application ports` | outbound event schema 不合法 | 否，需人工 | rejected publish evidence |
| `PublisherPortError::BoundaryViolation` | `application ports` | outbound event 携带 payload body / secret | 否，需人工 | rejected publish evidence |
| `TransportPortError::BackendUnavailable` | `application ports` | backend 不可用或超时 | 是 | delivery failed / retry candidate |
| `TransportPortError::PrivateBodyViolation` | `application ports` | backend response 携带私有正文 | 否 | boundary rejected / audit |
| `ProjectionError::StoreUnavailable` | `application ports` | projection store 不可用 | 是 | projection job retryable |
| `ProjectionError::BoundaryViolation` | `application ports` | projection 输出违反 read-only policy | 否，需人工 | projection rejected evidence |
| `ProjectionError::RebuildFailed` | `application ports` | rebuild batch 失败 | 是或人工 | job failed / stale marker |

### 7.4 错误映射表

| 内部错误 | HTTP / RPC / Event 映射 | 调用方应如何处理 |
|---|---|---|
| `ValidationError` | HTTP `400 validation_error`；Event / Job `rejected` | 修正请求或输入数据后重新提交 |
| `NotFoundError` | HTTP `404 not_found`；Event / Job `not_found` / `skipped` | 确认引用是否存在；job 可跳过该 item |
| `DomainError::InvalidStateTransition` | HTTP `409 state_conflict`；Event / Job `conflict` | 不自动重试，读取最新状态后重新决策 |
| `DomainError::TerminalStateReopenRejected` | HTTP `409 terminal_state_reopen_rejected`；Event / Job `conflict` | 不自动重试，避免 reopen 终态 |
| `DomainError::PayloadBoundaryViolation` | HTTP `422 boundary_violation`；Event / Job `rejected` | 改为传递 `PayloadRef` / `PayloadDigest`，不得提交正文 |
| `DomainError::BackendStatusNotNormalized` | Event `rejected`；Job `failed item` | 修复 backend adapter normalize 逻辑 |
| `DomainError::RetryNotAllowed` | HTTP `409 retry_not_allowed`；Job `skipped` | 等待 delivery 进入可恢复状态或人工处置 |
| `DomainError::DeadLetterNotAllowed` | HTTP `409 dead_letter_not_allowed`；Job `skipped` | 不自动重试，确认 failure material |
| `DomainError::ReplayPreparationNotAllowed` | HTTP `409 replay_preparation_not_allowed` | 补齐 approval / audit chain 后重新请求 |
| `DomainError::ReadOnlyProjectionViolation` | HTTP `422 read_only_projection_violation`；Job `rejected` | 修复调用方，不允许 projection 反写真相 |
| `RepositoryError::Unavailable` | HTTP `503 dependency_unavailable`；Job `retryable` | 调用方按退避重试，job 保留 cursor |
| `RepositoryError::VersionConflict` | HTTP `409 version_conflict`；Job `conflict` / `retryable item` | 重新读取最新版本后重试或跳过 |
| `RepositoryError::UniqueViolation` | HTTP `409 unique_conflict`；Event `duplicate` or `conflict` | 幂等摘要一致返回既有结果；不一致返回冲突 |
| `UnitOfWorkError::BeginFailed` | HTTP `503 transaction_unavailable`；Job `retryable` | 稍后重试 |
| `UnitOfWorkError::CommitFailed` | HTTP `503 commit_failed`；Job `retryable` | 可重试，但必须依赖幂等键防止重复写 |
| `UnitOfWorkError::CommitUncertain` | HTTP `500 commit_uncertain`；Job `failed` | 不自动盲重试，进入人工确认或恢复工具 |
| `UnitOfWorkError::RollbackFailed` | HTTP `500 rollback_failed`；Job `failed` | 人工介入，检查锁和 staged writes |
| `SourcePortError::Unavailable` | Job `retryable` | source 恢复后从 cursor 继续 |
| `SourcePortError::AckFailed` | Job `warning` / `retryable evidence` | 不回滚 bus truth；重复消费走 idempotency |
| `PublisherPortError::RetryableFailure` | publish result `retryable_failed` | 保留 evidence，publisher retry |
| `PublisherPortError::SchemaViolation` | publish result `rejected` | 人工修复 schema / event builder |
| `PublisherPortError::BoundaryViolation` | publish result `rejected` | 人工修复，禁止发布正文或 secret |
| `TransportPortError::BackendUnavailable` | Job `retryable item`；delivery failed candidate | 重试 dispatch 或进入 retry plan |
| `TransportPortError::PrivateBodyViolation` | Event / Job `rejected` | 修复 adapter，禁止保存私有响应正文 |
| `ProjectionError::StoreUnavailable` | Query `503` 或 Job `retryable` | 保留旧 projection 或 stale marker，稍后重试 |
| `ProjectionError::SourceMissing` | Query `404` / consistency marker；Job `skipped` | 等待 truth / audit 可读或人工检查 |
| `ProjectionError::VersionConflict` | HTTP `409 projection_conflict`；Job `conflict` | 重新读取 projection version 后重试 |
| `ProjectionError::BoundaryViolation` | Job `rejected` | 人工修复 projection derive / read-only policy |

### 7.5 异常分支处理表

| 场景 | 检测位置 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|---|
| DTO 字段缺失或枚举非法 | `contracts` validation / API handler | 返回 `ValidationError`，不进入 application 写事务 | 不写业务 audit；记录 access log |
| `AcceptPublication` payload body 越界 | `PayloadBoundaryGuard` | 创建 `PublicationAcceptance::Rejected` 和 audit；HTTP 返回 `422` | 写 rejected audit，可发布 rejected event |
| `ConsumeCommittedOutboxFact` invalid fact | consumer validation | 当前 fact rejected 或 rollback，不影响后续 fact | 写 rejected / skipped summary |
| publication duplicate 且摘要一致 | `IdempotencyRepository.find(...)` | 返回既有 acceptance result，不重复写 truth | 可写 duplicate audit |
| publication duplicate 但摘要不一致 | `IdempotencyRepository.mark_conflict(...)` | 返回 `409 ConflictError`，不覆盖原 truth | 写 conflict audit |
| delivery 不存在 | application service load | HTTP `404` 或 job item skipped | 可写 not_found audit；不发布成功事件 |
| delivery 状态非法迁移 | domain method / state matrix | rollback 当前事务；返回 `409` 或 item conflict | 写 conflict audit；不发布 state changed success event |
| terminal state reopen | domain method | rollback 当前事务；返回 `409` | 可写 conflict audit |
| backend raw status 未归一化 | `TransportBackendPort.normalize_signal(...)` / domain guard | 拒绝 signal，rollback truth 写入 | 必须写 boundary audit |
| backend response 携带私有正文 | transport adapter / boundary guard | 拒绝落库，返回 boundary violation | 必须写 boundary audit，不发布成功事件 |
| feedback duplicate | idempotency / feedback unique key | 摘要一致返回既有 feedback；摘要不一致返回 conflict | 可写 duplicate / conflict audit |
| late ack 到达 failed / dead-lettered delivery | feedback service | 返回 conflict 或 late feedback result，不修改 delivery | 可写 late feedback audit |
| retry on non-failed delivery | `RecoveryEligibilityPolicy.can_retry(...)` | 返回 `RetryNotAllowed`，rollback retry plan 写入 | 写 rejected recovery audit |
| retry exhausted 后继续 dispatch | retry job / domain guard | item skipped，返回 `RetryExhaustedCannotDispatch` | 必须写 recovery boundary audit |
| DLQ on non-failed delivery | `RecoveryEligibilityPolicy.can_dead_letter(...)` | 返回 `DeadLetterNotAllowed`，rollback DLQ 写入 | 写 rejected recovery audit |
| closed DLQ prepare replay | replay service / domain guard | 返回 `DeadLetterClosed`，不创建 preparation | 可写 conflict audit |
| audit chain invalid | replay service | 返回 `ReplayPreparationNotAllowed`，不创建 preparation | 写 replay rejected audit |
| projection 反写真相 | `ReadOnlyOutputPolicy` | 拒绝 projection write | 必须写 boundary audit / evidence |
| projection source missing | projection job | item skipped，写 consistency marker | 写 projection evidence，不发 truth event |
| projection version conflict | repository save / replace batch | 当前 item / batch rollback | 写 projection conflict audit |
| repository unavailable | repository adapter | rollback 当前事务，返回 retryable dependency | 写 error log；audit 视事务可用性 |
| repository version conflict | repository save | rollback 当前事务，返回 conflict | 可写 conflict audit |
| UnitOfWork begin failed | application service | 不写 truth，返回 retryable dependency | 写 error log |
| UnitOfWork commit failed | application service | 视为未提交或 retryable；依赖幂等键重试 | 写 error log / evidence |
| UnitOfWork commit uncertain | application service | 停止自动推进，返回 internal / manual action | 写 critical log / evidence |
| rollback failed | application service | 返回 internal，禁止继续同 handle 操作 | 写 critical log |
| source ack failed | `OutboxFactSourcePort.ack_consumed(...)` | bus truth 不回滚；保留 ack failure evidence | 写 warning evidence |
| publisher retryable failure | `OutboxPublisherPort.publish(...)` | truth 不回滚；写 `RetryableFailed` evidence | 写 publish evidence，不发二次业务 event |
| publisher schema violation | publisher service | truth 不回滚；写 rejected evidence | 写 rejected evidence，人工修复 |
| publisher boundary violation | publisher service | truth 不回滚；写 rejected evidence | 写 boundary evidence，人工修复 |
| backend unavailable / timeout | transport port | delivery attempt 失败或 item retryable；形成 recovery candidate | 写 failure audit / history |
| job 单 item 失败 | job runner item loop | 只回滚该 item，继续后续 item | job summary 记录 failed / skipped |

### 7.6 恢复口径表

| 错误 / 场景 | 恢复类型 | 自动动作 | 人工动作 | 不能做什么 |
|---|---|---|---|---|
| validation error | 不可重试 | 无 | 修正请求 / 输入 | 不能用 job 重试掩盖输入错误 |
| payload boundary violation in publication | 受控拒绝 | 提交 rejected acceptance 和 audit | 调整调用方只传 ref / digest | 不能保存 payload body |
| boundary violation after truth commit | 人工介入 | 写 rejected evidence | 修复 event builder / projection derive / adapter | 不能回滚已提交 truth |
| repository unavailable | 自动重试 | rollback 当前事务，退避重试 | 如果持续失败再运维排查 | 不能部分提交 |
| version conflict | 重新读取后重试或跳过 | job item 可按策略重试；HTTP 调用方重新读 | 必要时人工判断最新状态 | 不能覆盖新版本 |
| unique violation with same digest | 返回既有结果 | 读取 anchor 指向结果 | 无 | 不能重复创建 truth |
| unique violation with different digest | 不自动重试 | 写 conflict anchor / audit | 调用方换 idempotency key 或人工处理 | 不能覆盖原 anchor |
| commit failed | 自动重试但必须幂等 | 返回 retryable，调用方带同一幂等键重试 | 持续失败时排查 store | 不能无幂等盲重试 |
| commit uncertain | 人工介入 | 停止自动推进，保留 trace / evidence | 运维确认事务结果后修复 | 不能自动重复写入 |
| rollback failed | 人工介入 | 停止使用当前 handle | 清理锁 / staged writes | 不能继续提交该事务 |
| source ack failed | 自动恢复 | 保留 ack failure；重复消费走幂等 | source 长期异常时人工处理 | 不能回滚 bus truth |
| publisher retryable failure | 自动恢复 | evidence 标记 retryable，publisher retry | 持续失败时排查 event bus | 不能回滚 truth |
| publisher schema / boundary violation | 人工介入 | evidence 标记 rejected | 修复 schema / builder / policy | 不能发布违规 event |
| backend unavailable | 自动恢复 | 标记 attempt failed 或 retry candidate | 多次失败后 DLQ / operator 处理 | 不能把 raw error body 落库 |
| retry exhausted | 受控人工 / 后续命令 | 标记 exhausted | 调用 `MoveDeliveryToDeadLetter` | 不能自动越权进入 DLQ |
| DLQ created | 受控人工 | 保存 failure material 和 audit | operator review / replay preparation | 不能直接 dispatch |
| replay preparation ready | 后续流程处理 | 只发布 ready event | replay executor 另行处理 | 不能直接修改 delivery |
| projection store unavailable | 自动重试 | projection job 重跑 | 长期失败时重建 projection | 不能回滚 truth |
| projection stale | 受控重建 | Query 返回 stale marker | operator / job rebuild | Query 不能隐藏写入修复 |

### 7.7 审计、日志与事件规则

| 规则 | 要求 |
|---|---|
| 业务 truth 状态变化失败 | 如果事务可用，写 conflict / rejected audit；事务不可用时至少结构化日志 |
| boundary violation | 必须写 boundary audit 或 rejected evidence，且不得记录 payload body / secret / private body |
| dependency failure | 写结构化 error log，包含 trace id、operation、retryable、details_ref |
| publish failure | 写 publish evidence；retryable 与 rejected 必须区分 |
| projection failure | 写 projection evidence 或 consistency marker，不发布 truth success event |
| source ack failure | 写 ack failure evidence，重复消费由 idempotency 兜底 |
| rollback / commit uncertain | 写 critical log，标记 manual action required |
| duplicate / idempotency hit | 可写 duplicate audit；不得重复发布 state changed event |
| rejected fact | 可以发布 rejected event，但事件 payload 只能包含 ref / digest / reason code |

### 7.8 错误 code 约束

| 错误类别 | code 命名规则 | 示例 |
|---|---|---|
| validation | `validation.<field_or_shape>` | `validation.missing_delivery_id` |
| not found | `not_found.<resource>` | `not_found.delivery` |
| conflict | `conflict.<resource_or_state>` | `conflict.delivery_version` |
| boundary violation | `boundary.<rule>` | `boundary.payload_body_rejected` |
| dependency | `dependency.<adapter_or_port>` | `dependency.repository_unavailable` |
| internal | `internal.<operation>` | `internal.commit_uncertain` |

约束：

- `ErrorCode` 必须稳定，不直接使用 Rust enum debug 字符串作为对外 code。
- `message` 可以面向调用方，但不得包含 payload body、secret、后端私有响应正文。
- `details_ref` 指向可审计详情，详情内容仍必须遵守边界策略。

### 7.9 Rust 转换函数约束

| 函数签名 | 作用 | 关键规则 |
|---|---|---|
| `impl From<DomainError> for ApplicationError` | 将领域错误归一到 application | 状态冲突映射 conflict，payload / projection 反写映射 boundary |
| `impl From<RepositoryError> for ApplicationError` | 将 repository 错误归一 | unavailable 映射 dependency，version / unique 映射 conflict |
| `impl From<UnitOfWorkError> for ApplicationError` | 将事务错误归一 | commit uncertain / rollback failed 映射 internal 且 manual action |
| `impl From<PublisherPortError> for ApplicationError` | 将 publisher 错误归一 | retryable failure 映射 dependency；schema / boundary 映射 boundary + manual |
| `impl From<TransportPortError> for ApplicationError` | 将 backend 错误归一 | backend unavailable retryable；private body violation boundary |
| `ApiError::from_application(ApplicationError error, RequestContext ctx)` | 构造 HTTP error response | 必须填充 request_id、trace_id、code、retryable、details_ref |
| `ConsumerError::from_application(ApplicationError error, EventMetadata meta)` | 构造 consumer result | validation / boundary -> rejected；dependency -> retryable |
| `JobError::from_item_errors(Vec<JobItemError> errors, JobMetadata meta)` | 构造 job summary | 支持 partial success，不因单 item 失败覆盖成功 item |

---

## 8. 回填草稿

正式 `03-详细设计.md` 的 §11 按以下方式回填：

```md
## 11. 错误模型、异常分支与恢复口径

### 11.1 错误传播图

从 `design-calibration/03_ddd_step_12_error_recovery.md` §7.1 摘录。

### 11.2 错误 enum 实现契约

从 `design-calibration/03_ddd_step_12_error_recovery.md` §7.2 摘录。

### 11.3 错误类型总表

从 `design-calibration/03_ddd_step_12_error_recovery.md` §7.3 摘录。

### 11.4 错误映射表

从 `design-calibration/03_ddd_step_12_error_recovery.md` §7.4 摘录。

### 11.5 异常分支处理表

从 `design-calibration/03_ddd_step_12_error_recovery.md` §7.5 摘录。

### 11.6 恢复口径表

从 `design-calibration/03_ddd_step_12_error_recovery.md` §7.6 摘录。

### 11.7 审计、日志与事件规则

从 `design-calibration/03_ddd_step_12_error_recovery.md` §7.7 摘录。

### 11.8 错误 code 与转换函数约束

从 `design-calibration/03_ddd_step_12_error_recovery.md` §7.8~§7.9 摘录。
```

说明：

- 正式文档中不得把 `ApiError`、`ConsumerError`、`JobError` 写成 domain 错误。
- 正式文档中必须保留 `retryable`、`requires_manual_action` 和 `details_ref` 口径。
- Step 13 需要承接 `RepositoryError::VersionConflict`、`RepositoryError::UniqueViolation`、idempotency duplicate / conflict 和 job 重跑场景，继续细化并发、幂等与重入保护。

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 是否新增每个 flow 专用错误 enum | A. 新增；B. 不新增，按层错误 + `ApplicationError` 组合；C. 只用全局 `BusError` | 推荐 B | 能保持模块边界，同时避免错误类型爆炸 |
| `CommitUncertain` 是否允许自动重试 | A. 允许；B. 不允许，进入人工确认；C. 交给调用方决定 | 推荐 B | 提交状态不确定时盲重试可能重复写 truth |
| `AcceptPublication` 的 payload boundary violation 是否提交 rejected fact | A. 提交 rejected fact；B. 直接 rollback；C. 保存 payload 后异步清理 | 推荐 A | 接入判定本身是 bus truth，拒绝事实也需要审计；但不得保存 payload body |
| `PublisherPortError::SchemaViolation` 是否映射 dependency retry | A. 映射 dependency retry；B. 映射 boundary / rejected evidence；C. 映射 internal | 推荐 B | schema 错误不是暂时依赖失败，自动重试不能修复 |
| projection source missing 是否返回 `404` 还是 `409 stale` | A. 只返回 `404`；B. 根据 Query 类型返回 `404` 或 consistency marker；C. 自动 rebuild | 推荐 B | 查询必须如实表达缺失或过期，不能隐藏写副作用 |

---

## 10. 进入下一步条件

```text
错误类型、外部映射、异常分支和恢复策略已经足够实现者写错误处理代码。
模块错误类型、协议错误映射、事务失败、外部依赖失败、publisher / projection 恢复和审计 / evidence 口径均已定义。
可以进入 Step 13,定义并发、幂等与重入保护。
```
