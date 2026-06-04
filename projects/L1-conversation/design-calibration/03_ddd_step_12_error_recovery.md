# Step 12. 定义错误模型、异常分支与恢复口径

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 12
- 回填章节: `projects/L1-conversation/03-详细设计.md` §11 错误模型、异常分支与恢复口径

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_08_protocol_contracts.md` §7.9 | 协议错误映射、幂等与审计矩阵 | 作为错误分类来源 |
| `03_ddd_step_09_function_flows.md` | 每个处理流的错误映射和异常分支 | 作为场景来源 |
| `03_ddd_step_10_state_matrix.md` | 非法状态转换错误 | 作为 domain error 来源 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 事务失败、一致性失败、补偿恢复 | 作为 retry / rollback / evidence 来源 |
| `standards/document/详细设计书写规范.md` §5.11 | 错误类型表、错误映射表、异常分支和恢复口径格式 | 作为输出格式约束 |

已确认约束:

```text
不能只写“返回失败”。
必须区分可重试、不可重试、需人工介入。
错误类型必须能回指模块、协议或处理流。
query 遇到 stale / unresolved 不等同 command 失败,必须通过 marker 暴露。
publish / handoff 失败不得回滚 truth。
```

---

## 3. SOP 问题回答

### 3.1 每个模块有哪些错误类型？

| 模块 | 错误类型 |
|---|---|
| `contracts` / protocol | `ProtocolError` |
| `domain` | `DomainError` |
| `application` | `ApplicationError` |
| repository / transaction | `RepositoryError`、`TransactionError` |
| idempotency | `IdempotencyError` |
| source resolver | `ResolverError` |
| publisher | `PublishError` |
| handoff adapter | `HandoffError` |
| jobs | `JobError` |

### 3.2 哪些错误映射到 HTTP / RPC / Event 失败？

| 错误类型 | HTTP / RPC / Event 映射 |
|---|---|
| `ProtocolError::MissingRequiredField` / `InvalidCommand` / `InvalidQuery` / `InvalidEnvelope` | 4xx / quarantine |
| `ApplicationError::NotFound` | 404 / not found view |
| `ApplicationError::NotVisible` | 403 或 empty authorized view |
| `ApplicationError::Conflict` / `IdempotencyError::Conflict` | 409 / conflict receipt |
| `DomainError::InvalidStateTransition` / `BoundaryViolation` / `RetryLimitExceeded` | 4xx domain rejection / audit |
| `RepositoryError` / `TransactionError` | 5xx / retryable job or command failure |
| `ResolverError` | unresolved / delayed marker,必要时 quarantine |
| `PublishError` | outbox retry / failed marker |
| `HandoffError` | handoff retry / failed marker |
| `JobError` | failed job receipt / partial failure evidence |

### 3.3 哪些错误可重试，哪些不可重试，哪些需要人工介入？

| 分类 | 错误 | 处理 |
|---|---|---|
| 可重试 | transient repository / transaction / resolver / publish / handoff failure | 重试 command、consumer 或 job;保留 retry marker |
| 不可重试 | missing field、invalid state、boundary violation、not visible、invalid source body | 返回拒绝 / quarantine / audit |
| 需人工介入 | outbox `Failed`、handoff `Failed`、projection `Failed` 长期存在、source digest mismatch | operations evidence + repair / replay / manual review |

### 3.4 事务失败、并发冲突、重复请求、外部依赖失败如何处理？

| 场景 | 处理 |
|---|---|
| 事务失败 | 回滚 UnitOfWork,不允许部分 truth 留存 |
| 并发冲突 | 返回 conflict,由 Step 13 定义重试 / 重入保护 |
| 重复 command | 返回已完成 result 或 conflict receipt,不得重复写 truth |
| 重复 event | consumer idempotency 命中则 skip 或返回已消费 receipt |
| publish 失败 | outbox 标记 retry / failed,不回滚 truth |
| resolver 失败 | reference / manifestation unresolved,不补造 source truth |
| handoff 失败 | handoff retry / failed,不改 fact truth |

### 3.5 哪些异常需要写审计、日志或事件？

| 异常 | 审计 / evidence |
|---|---|
| command rejection | command audit + rejection reason |
| idempotency conflict | idempotency conflict evidence |
| invalid state transition | domain audit |
| inbound event invalid | quarantine evidence |
| resolver unresolved / digest mismatch | unresolved / digest mismatch evidence |
| outbox failed | operations evidence |
| handoff failed | handoff failure evidence |
| projection failed | projection error ref |
| cursor expired / invalidated | read / cleanup evidence |

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| Step 8 只给协议错误汇总 | 实现者还缺模块级错误类型表 | 本步补模块错误类型和映射 |
| Step 9 错误分散在每个 flow | 需要聚合异常分支和恢复方式 | 本步按场景归纳 |
| Step 10 已给非法转换语义 | 需要映射到具体 `DomainError` | 本步落成错误模型,并要求状态矩阵引用的 domain error variant 全部进入错误类型表 |
| Step 11 已给补偿策略 | 需要区分 retry / manual / reject | 本步落成恢复口径 |

## 5. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否每个 flow 定义独立错误 enum | A. 每 flow 一个 enum;B. 模块级 enum + 场景 variant | 采用 B。减少 public surface,保持协议映射清晰 |
| query stale 是否视为错误 | A. 直接失败;B. 返回 marker 或 degraded view | 采用 B。stale / unresolved 是读状态,不是必然错误 |
| publish / handoff transient failure 是否对外返回 command 失败 | A. 回滚 command;B. command 已提交,后续 job 补偿 | 采用 B。truth 与传播解耦 |
| resolver failure 是否创建 rejected fact | A. rejected fact;B. unresolved reference / manifestation marker | 采用 B。不能把外部不可解析误写成 conversation fact |

## 6. 结构化中间产物

### 6.1 错误类型表

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `ProtocolError::MissingRequiredField` | `contracts` | command / event / job 缺必填字段 | 否 | 400 / quarantine / failed job input |
| `ProtocolError::InvalidCommand` | `contracts` | command 字段齐全但 target pair、mode、operation 或当前 boundary 不支持 | 否 | 400 |
| `ProtocolError::InvalidQuery` | `contracts` | page、cursor、projection kind、consumer 参数非法 | 否 | 400 |
| `ProtocolError::InvalidEnvelope` | `contracts` | inbound event envelope 缺 event id、source ref、idempotency key | 否 | quarantine |
| `ApplicationError::NotFound` | `application` | space、fact、manifestation、trace、handoff 不存在 | 否 | 404 / job failed evidence |
| `ApplicationError::NotVisible` | `application` | consumer 不在 visibility scope | 否 | 403 或 empty authorized view |
| `ApplicationError::Conflict` | `application` | version、state、idempotency 冲突 | 视场景 | 409 |
| `ApplicationError::CursorNotResumable` | `application` | cursor expired / invalidated | 否 | 409 / reset cursor marker |
| `DomainError::InvalidStateTransition` | `domain` | 状态转换不符合 Step 10 | 否 | 4xx / domain audit |
| `DomainError::InvalidInitialState` | `domain` | 初始 factory / constructor 的前置 truth、ref、actor 或 policy 不满足 | 否 | 4xx / domain audit |
| `DomainError::BoundaryViolation` | `domain` | projection / outbox / external adapter 试图改 truth | 否 | 4xx / audit |
| `DomainError::SourceTruthViolation` | `domain` | 试图保存外部来源正文或补造来源事实 | 否 | 4xx / quarantine |
| `DomainError::SequenceRegression` | `domain` | fact / outbox / cursor sequence 倒退 | 否 | 409 |
| `DomainError::SourcePositionRegression` | `domain` | projection rebuild source position 倒退或覆盖 newer committed position | 否 | 409 / projection evidence |
| `DomainError::DigestMismatch` | `domain` | snapshot digest 与 source digest 不一致 | 需人工判断 | unresolved / digest evidence |
| `DomainError::SnapshotMismatch` | `domain` | manifestation refresh snapshot 与 external fact ref / source version 不匹配 | 否 | unresolved / mismatch evidence |
| `DomainError::InvalidExternalReference` | `domain` | object ref、version ref、digest 或 external reference 格式 / 权限 / 边界非法 | 否 | invalid marker / quarantine |
| `DomainError::DuplicateAppend` | `domain` | duplicate append path 试图绕过幂等结果生成新的 `ConversationFact` | 否 | 409 / idempotency conflict evidence |
| `DomainError::ImmutableReceipt` | `domain` | 已 rejected / completed 的 append receipt 被反向改写 | 否 | 409 / domain audit |
| `DomainError::RetryLimitExceeded` | `domain` | outbox、trace handoff 或 archive handoff 的 `mark_retry(...)` 超过 retry limit | 否 | failed marker / operations evidence |
| `RepositoryError` | `infra` / repository | 读写存储失败、唯一键冲突、版本冲突 | transient 可重试 | 5xx / retry marker |
| `TransactionError` | `infra` / UnitOfWork | begin / commit / rollback 失败 | transient 可重试 | 5xx |
| `IdempotencyError::Conflict` | `application` | 同 key 不同请求内容或不同 result | 否 | 409 |
| `ResolverError` | source resolver adapter | 外部来源不可解析、超时、digest 不一致 | 部分可重试 | unresolved / delayed / quarantine |
| `PublishError` | outbox publisher | event build / transport / topic publish 失败 | transport 可重试 | outbox retry / failed |
| `HandoffError::DestinationUnavailable` | handoff adapter | 目标暂不可用 | 是 | handoff retry |
| `HandoffError::Timeout` | handoff adapter | adapter 调用超时 | 是 | handoff retry |
| `HandoffError::RateLimited` | handoff adapter | 目标要求稍后重试 | 是 | handoff retry |
| `HandoffError::DestinationRejected` | handoff adapter | 目标永久拒绝 | 否 | handoff failed |
| `HandoffError::InvalidArchivePackage` | handoff adapter | archive adapter 返回包正文或非法 package ref | 否 | archive handoff failed |
| `HandoffError::ForbiddenBody` | handoff adapter | handoff payload / archive material 违反 forbidden body policy | 否 | handoff failed |
| `HandoffError::AdapterMisconfigured` | handoff adapter | destination adapter 配置非法 | 否 | handoff failed |
| `JobError::InvalidInput` | jobs | job run id、scope、metadata、idempotency key 非法 | 否 | failed job receipt |
| `JobError::MissingOutbox` | jobs | publish job candidate 在锁定时缺失 | 否 | failed job receipt |
| `JobError::MissingVisibilityScope` | jobs | refresh / projection job 缺可见范围 | 否 | failed job receipt |
| `JobError::MissingTraceContext` | jobs | handoff job 缺 trace context | 否 | failed job receipt |
| `JobError::MissingTraceHandoff` | jobs | trace handoff candidate 在锁定时缺失 | 否 | failed job receipt |
| `JobError::MissingArchiveHandoff` | jobs | archive handoff candidate 在锁定时缺失 | 否 | failed job receipt |
| `JobError::RepositoryFailure` | jobs | repository / transaction 失败 | transient 可重试 | failed or partial job receipt |
| `JobError::ResolverFailure` | jobs | resolver 失败 | 部分可重试 | unresolved / partial job receipt |
| `JobError::PublishFailure` | jobs | outbox publish 失败 | transport 可重试 | outbox retry / partial receipt |
| `JobError::HandoffFailure` | jobs | handoff adapter failure 已映射到 job surface | 部分可重试 | handoff retry / failed + partial receipt |
| `JobError::PartialFailure` | jobs | 部分 outbox、projection、snapshot、handoff 失败 | 是或人工 | job evidence + failed refs |

### 6.2 错误映射表

| 内部错误 | HTTP / RPC / Event 映射 | 调用方应如何处理 |
|---|---|---|
| `ProtocolError::MissingRequiredField` | HTTP 400 / command reject | 修正请求后重试 |
| `ProtocolError::InvalidCommand` | HTTP 400 / command reject | 修正 command target、mode 或 operation 后重试 |
| `ProtocolError::InvalidEnvelope` | consumer quarantine | 修正来源事件或重放合法事件 |
| `ApplicationError::NotFound` | HTTP 404 / job failed evidence | 检查引用是否存在 |
| `ApplicationError::NotVisible` | HTTP 403 或 empty view marker | 不应重试同一权限上下文 |
| `ApplicationError::CursorNotResumable` | HTTP 409 / cursor reset marker | 重新读取 read model 并创建新 cursor |
| `DomainError::InvalidStateTransition` | HTTP 409 / domain audit | 按当前状态重新发起合法 command |
| `DomainError::InvalidInitialState` | HTTP 409 / domain audit | 修正 factory input、前置 truth 或 ref 后重新发起 |
| `DomainError::BoundaryViolation` | HTTP 400 / audit | 修正实现或请求边界 |
| `DomainError::SourcePositionRegression` | HTTP 409 / projection evidence | 重新读取 committed source position 后重建 |
| `DomainError::DigestMismatch` | unresolved / digest mismatch evidence | 保留旧 snapshot / manifestation,等待人工或 refresh policy 处理 |
| `DomainError::SnapshotMismatch` | unresolved / mismatch evidence | 修正 external ref / snapshot 后重试 refresh |
| `DomainError::InvalidExternalReference` | invalid marker / quarantine | 修正 external ref、version ref 或权限边界 |
| `DomainError::DuplicateAppend` | HTTP 409 / idempotency conflict evidence | 使用已有 result / receipt 或更换 idempotency key |
| `DomainError::ImmutableReceipt` | HTTP 409 / domain audit | 重新提交新 request,不得改写既有 receipt |
| `DomainError::RetryLimitExceeded` | outbox / handoff `Failed` marker | 停止自动 retry,交由 operations review 或新 intent |
| `RepositoryError` | HTTP 500 / retryable job marker | 可按 retry policy 重试 |
| `ResolverError` | unresolved / delayed marker | 等待 refresh job 或人工处理 digest mismatch |
| `PublishError` | outbox `RetryPending` / `Failed` | 由 publish job 重试或 operations 处理 |
| `HandoffError` retryable variants | handoff `RetryPending` | 由 handoff job 按 retry policy 重试 |
| `HandoffError` permanent variants | handoff `Failed` | operations review 或新 handoff intent |
| `JobError::InvalidInput` | failed `JobRunReceipt` | 修正 job input、scope、metadata 或 idempotency key 后重新触发 |
| `JobError::PartialFailure` | `JobRunReceipt` partial failure | 读取 failed refs 后局部重跑 |

### 6.3 异常分支处理表

| 场景 | 检测位置 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|---|
| command metadata 缺 `request.idempotency_key` | protocol validation | reject request | command audit |
| idempotency duplicate | `IdempotencyRepository.reserve(...)` | 返回已完成 result 或 skip | idempotency evidence |
| idempotency conflict | `IdempotencyRepository.mark_conflict(...)` | 409 conflict | conflict evidence |
| space / fact / trace missing | application service | return not found | read / command audit |
| visibility denied | query / command policy | empty view / 403 / command reject | read audit |
| invalid state transition | domain method | reject and rollback | domain audit |
| invalid initial state | domain factory / constructor | reject and rollback | domain audit |
| forbidden payload body | fact / manifestation / publish validation | reject or quarantine | boundary audit |
| immutable receipt overwrite | fact append receipt transition | reject and rollback | receipt evidence |
| duplicate append bypass | append idempotency / fact factory | reject conflict | idempotency evidence |
| invalid external reference | reference validation policy | invalid marker or quarantine | reference evidence |
| snapshot mismatch | manifestation / reference refresh | unresolved / mismatch marker | digest / snapshot evidence |
| source position regression | projection rebuild completion | reject rebuild completion or mark failed | projection evidence |
| inbound event envelope invalid | worker consumer | quarantine | quarantine evidence |
| resolver unavailable | resolver adapter | unresolved / delayed marker | resolver evidence |
| digest mismatch | resolver / snapshot validation | unresolved / manual evidence | digest mismatch evidence |
| repository write failure | repository adapter | rollback UnitOfWork | error log |
| publish transport failure | outbox publish job | mark retry / failed | outbox evidence |
| retry limit exceeded | outbox / handoff state method | mark failed via explicit failed path,not retry again | operations evidence |
| handoff transport failure | handoff job | mark retry / failed | handoff evidence |
| projection rebuild failure | projection job | mark `ProjectionFreshnessState::Failed` | projection error ref |
| cursor expired | query / cleanup job | reset cursor or cleanup | cursor evidence |

### 6.4 恢复口径表

| 场景 | 恢复方式 | 是否可自动重试 | 人工介入条件 |
|---|---|---|---|
| transient repository / transaction failure | retry whole command / consumer / job after rollback | 是 | 连续失败超过运维阈值 |
| idempotency duplicate | return prior result / skip event | 不需要 | 不适用 |
| idempotency conflict | reject conflict | 否 | 需要排查上游 key 复用 |
| source unresolved | refresh job 重试 resolver | 是 | 长期 unresolved 或 digest mismatch |
| inbound quarantine | 等待修正事件或人工 replay | 否 | 需要确认来源事件合法性 |
| projection failed | rebuild job 重跑 | 是 | 多次 rebuild failed |
| outbox retry pending | publish job 重跑 | 是 | retry exhausted -> `Failed` |
| handoff retry pending | handoff job 重跑 | 是 | retry exhausted -> `Failed` |
| retry limit exceeded | 停止 `mark_retry(...)`,改走 `mark_failed(...)` 或创建新 operations intent | 否 | 需要 operations review |
| cursor expired | 重新建立 cursor | 否 | 不适用 |
| invalid state transition | 调用方按当前状态重新发合法 command | 否 | 若实现误触发需要修代码 |

## 7. 回填草稿

正式文档 §11 建议采用以下结构:

```text
## 11. 错误模型、异常分支与恢复口径

### 11.1 错误类型表
引用: design-calibration/03_ddd_step_12_error_recovery.md §6.1

### 11.2 错误映射表
引用: design-calibration/03_ddd_step_12_error_recovery.md §6.2

### 11.3 异常分支处理表
引用: design-calibration/03_ddd_step_12_error_recovery.md §6.3

### 11.4 恢复口径表
引用: design-calibration/03_ddd_step_12_error_recovery.md §6.4
```

正式回填时必须保留:

| 正式章节 | 必须保留内容 |
|---|---|
| §11.1 | 模块级错误类型、触发条件、可重试性、对外映射 |
| §11.2 | HTTP / RPC / Event / Job receipt 映射 |
| §11.3 | command、query、consumer、publish、handoff、projection 的异常处理 |
| §11.4 | retry、quarantine、unresolved、manual intervention 的恢复口径 |

## 8. 待确认事项

本步无阻塞性待确认事项。后续 Step 需要继续细化:

| 事项 | 当前口径 | 后续承接 |
|---|---|---|
| 具体 HTTP status / response body schema | 本步只定义映射语义 | API 实现 / 测试方案 |
| retry 退避和最大次数 | 本步只定义可重试性 | Step 13 / Step 14 |
| 审计字段明细 | 本步只定义必须写 evidence 的场景 | Step 15 |

## 9. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 错误类型明确 | 通过 | protocol、domain、application、repository、resolver、publish、handoff、job 已覆盖 |
| 错误映射明确 | 通过 | HTTP / Event / Job receipt 映射已列出 |
| 可重试性明确 | 通过 | transient、non-retry、manual intervention 已区分 |
| 异常分支明确 | 通过 | command、query、consumer、job 场景已覆盖 |
| 恢复口径明确 | 通过 | retry、quarantine、unresolved、failed marker 已覆盖 |
| 可进入 Step 13 并发、幂等与重入保护 | 通过 | 下一步可基于本步 conflict / retry / duplicate 口径细化并发和幂等 |
