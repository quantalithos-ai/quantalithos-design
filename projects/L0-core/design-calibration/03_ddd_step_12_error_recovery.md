# Step 12. 定义错误模型、异常分支与恢复口径

> 本文件是 `projects/L0-core/03-详细设计.md` 的 Step 12 中间产物。
> 本步只收稳代码层错误类型、错误映射、异常分支、可重试性、审计 / 事件口径和恢复策略。
> 本步不引入在线 HTTP / RPC server,不实现监控系统,不改写正式 `03-详细设计.md`。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填,本文件不替代正式详细设计。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 12
- 回填章节: `projects/L0-core/03-详细设计.md` §11 错误模型、异常分支与恢复口径

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 6 对象实现契约 | `ErrorResponse`、`ErrorCode`、`DomainError` / `ApplicationError` / `PortError` 返回位置 | 作为错误对象和函数返回来源 |
| Step 8 协议契约 | 统一错误映射、Command / Query / Event / Job 场景级错误 | 作为对外错误码和协议边界来源 |
| Step 9 函数级处理流 | 每个 flow 的错误映射、回滚和 port failure 切口 | 作为异常分支来源 |
| Step 10 状态机 | 非法状态迁移和 query stale 处理口径 | 作为状态错误映射来源 |
| Step 11 持久化、事务与一致性 | 事务失败、outbox、projection、snapshot 和 reference 恢复口径 | 作为恢复策略来源 |

已确认结论:

```text
本仓 P0 没有在线 HTTP / RPC server;对外错误先表达为 CLI status + ErrorResponse。
若未来 gateway 包装 HTTP / RPC,必须沿用本步的 ErrorResponse code 和内部错误映射。
Step 8 的错误码口径是主线:invalid_argument / not_found / conflict / precondition_failed / dependency_unavailable / internal。
Step 6 旧 ErrorCode 已同步修正为 InvalidArgument / NotFound / Conflict / PreconditionFailed / DependencyUnavailable / Internal。
Step 10 中不存在 ApplicationError::ProjectionUnavailable;projection 不可用统一映射为 PreconditionFailed 或 Port。
```

---

## 3. 本步写作策略

本步按“错误源头 -> 应用边界 -> 对外响应 -> 恢复动作”展开:

```text
先定内部错误族 -> 再定对外映射 -> 再定异常分支 -> 最后定恢复口径
```

写作约束:

- 不允许只写“返回失败”。
- 每类错误必须说明所属模块、触发条件、是否可重试、对外映射。
- 所有错误映射必须能回指 Step 8 的 `ApplicationError` 族和 `ErrorResponse` code。
- 需要区分不可重试、调用方修正后可重试、依赖恢复后可重试、需要人工介入。
- domain object 不写审计、不发事件;application service / job / relay 决定审计和 outbox。
- query 路径不改写真相,也不写状态变更审计。

---

## 4. 分章节写入计划

| 章节 | 状态 | 主题 |
|---|---|---|
| 12.1 | [x] | 错误模型总览 |
| 12.2 | [x] | 错误类型表 |
| 12.3 | [x] | 内部错误到对外错误映射 |
| 12.4 | [x] | 异常分支处理表 |
| 12.5 | [x] | 恢复口径表 |
| 12.6 | [x] | 审计 / 事件 / 日志口径 |
| 12.7 | [x] | Step 12 统一复核 |

---

## 5. SOP 问题回答

### 5.1 每个模块有哪些错误类型？

| 模块 | 错误类型 | 说明 |
|---|---|---|
| `contracts` | `ContractError`、`ErrorResponse`、`ErrorCode` | DTO / metadata / 对外响应错误 |
| `domain_*` | `DomainError` | 领域对象、值对象、状态机和策略错误 |
| `application_services` | `ApplicationError` | use case 编排、事务、幂等、预条件和错误汇总 |
| `application_ports` | `PortError` | repository、outbox、projection、toolchain、snapshot、publisher 等外部边界错误 |
| `cli_entry` / `jobs` | `ApplicationError` -> `ErrorResponse` | 入口不发明新错误族,只做映射 |

### 5.2 哪些错误映射到 HTTP / RPC / Event 失败？

P0 没有 HTTP / RPC server,但必须定义可被 gateway 复用的稳定映射:

| 内部错误 | CLI status | ErrorResponse code | 未来 HTTP 映射 | 未来 RPC 映射 |
|---|---:|---|---:|---|
| `ApplicationError::Validation` | 2 | `invalid_argument` | 400 | `INVALID_ARGUMENT` |
| `ApplicationError::NotFound` | 3 | `not_found` | 404 | `NOT_FOUND` |
| `ApplicationError::Conflict` | 4 | `conflict` | 409 | `ABORTED` |
| `ApplicationError::PreconditionFailed` | 4 | `precondition_failed` | 412 | `FAILED_PRECONDITION` |
| `ApplicationError::Port` | 5 | `dependency_unavailable` | 503 | `UNAVAILABLE` |
| `ApplicationError::Internal` | 1 | `internal` | 500 | `INTERNAL` |

Event 失败不作为对调用方的同步 HTTP / RPC 响应,而是通过 outbox 状态、relay 输出和恢复任务表达。

### 5.3 哪些错误可重试，哪些不可重试，哪些需要人工介入？

| 错误类别 | 可重试性 | 说明 |
|---|---|---|
| `Validation` | 不可原样重试 | 调用方修正 payload 后重试 |
| `NotFound` | 通常不可原样重试 | 资源确实未创建时需先创建;投影延迟场景可稍后重试 |
| `Conflict` | 可在重新读取最新版本后重试 | expected version、幂等 payload、唯一约束冲突 |
| `PreconditionFailed` | 补齐前置条件后重试 | gate、状态、fingerprint、引用、兼容性等不满足 |
| `Port` | 依赖恢复后重试 | repository、toolchain、outbox、publisher、projection、snapshot store 失败 |
| `Internal` | 需要排查 | 保留 trace id,不得让调用方依赖内部细节 |
| relay 单条发布失败 | 可自动或人工重试 | 标记 failed 或保留 pending,不得删除事件 |
| projection replace 失败 | 可重跑 job | truth 不回滚,旧 projection 保留 |

### 5.4 事务失败、并发冲突、重复请求、外部依赖失败如何处理？

| 场景 | 处理方式 |
|---|---|
| 事务内任一 truth / audit / outbox 写入失败 | 回滚整个事务,返回 `ApplicationError::Port` 或对应业务错误 |
| expected version 冲突 | 返回 `ApplicationError::Conflict`,调用方重新读取后重试 |
| 幂等键重复且 payload 一致 | 返回既有 receipt 或跳过重复写入,Step 13 固定细节 |
| 幂等键重复但 payload 不一致 | 返回 `ApplicationError::Conflict` |
| 外部 toolchain / exporter 失败 | 不写成功状态,返回 `ApplicationError::Port`,job 可重试 |
| event publisher 失败 | truth 不回滚;outbox 标记 failed 或保留 pending |
| projection 写失败 | truth 不回滚;projection 保留 stale,重跑 rebuild |

### 5.5 哪些异常需要写审计、日志或事件？

| 异常 | 审计 | 事件 | 日志 |
|---|---|---|---|
| validation / DTO 错误 | 否 | 否 | debug / warn |
| domain 非法状态迁移 | application 可写失败审计意图 | 否 | warn |
| gate / fingerprint / compatibility 阻断 | 是 | 否;除非状态变化已形成事实 | warn |
| repository / audit / outbox 事务失败 | 事务回滚,不能依赖同事务审计 | 否 | error |
| toolchain / exporter 失败 | 是,由 job 记录失败 | 否 | error |
| outbox 单条 publish 失败 | 是或 relay 失败记录 | 可不产生新事件 | warn / error |
| projection rebuild 失败 | 是,由 operations job 记录 | 否 | error |
| query not found / stale | 否 | 否 | debug / info |

---

## 6. 当前问题诊断

| 问题 | 影响 | 本步修正 |
|---|---|---|
| Step 6 `ErrorCode` 与 Step 8 统一错误码不一致 | 实现者会生成两套对外错误码 | 已把 Step 6 修正为 Step 8 主线错误码 |
| Step 10 曾引用 `ApplicationError::ProjectionUnavailable` | 该变体未在 Step 8 定义 | 已改为 `ApplicationError::PreconditionFailed` 或 stale view |
| `DomainError`、`ApplicationError`、`PortError` 只出现在返回类型中,缺少集中表 | 难以实现统一错误处理 | 本步固定错误族、变体和映射 |
| outbox / projection / snapshot 失败容易被混成同步失败 | 会导致 truth 被错误回滚或失败被吞掉 | 本步按 Step 11 固定恢复口径 |
| query stale 是错误还是可解释状态未集中说明 | 查询实现可能不一致 | 本步规定“禁止读取时 PreconditionFailed;允许读取时带 stale 标记返回” |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 对外错误码 | Step 6 与 Step 8 不一致 | 统一为 `invalid_argument / not_found / conflict / precondition_failed / dependency_unavailable / internal` |
| 内部错误族 | 函数返回类型分散出现 | 集中定义 `ContractError`、`DomainError`、`ApplicationError`、`PortError` |
| 可重试性 | 分散在处理流或恢复口径中 | 每类错误明确是否可重试和重试前提 |
| 异常分支 | Step 9 有 flow 层错误映射 | 本步补齐检测位置、处理方式、审计 / 事件口径 |
| 恢复策略 | Step 11 有数据恢复口径 | 本步转成代码错误处理和 job / relay 恢复动作 |

---

## 8. 设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否新增 `ApplicationError::ProjectionUnavailable` | 新增专用错误 | 复用 `PreconditionFailed` / stale view | B | Step 8 已有稳定映射,projection stale 是前置条件或视图状态 |
| 是否把所有 `PortError` 对外暴露 | 暴露具体端口错误 | 统一映射 `dependency_unavailable` | B | 调用方不应依赖 repository / filesystem / publisher 细节 |
| toolchain 校验不通过是否算 Port error | 是 | 否,校验不通过是 `PreconditionFailed` | B | runner 失败才是依赖错误;报告不通过是业务前置条件 |
| query stale 是否总是错误 | 是 | 由 query 参数决定:不允许 stale 时错误,允许 stale 时返回 view 标记 | B | 下游有时需要可解释旧视图 |
| relay 单条失败是否终止整批 | 终止整批 | 标记单条失败并继续 | B | 已由 Step 9 确认,避免坏事件阻塞整批 |

---

## 9. 结构化中间产物

### 9.1 错误模型总览

```text
[contracts]
  ContractError
  ErrorResponse
  ErrorCode
      ^
      | map for output
      |
[application_services]
  ApplicationError
      ^
      | map from
      |
+----------------+----------------+----------------+
| DomainError    | PortError      | ContractError  |
| domain rules   | external I/O   | DTO metadata   |
+----------------+----------------+----------------+
```

关键说明:

- `DomainError` 不直接出现在 CLI / job 输出;必须经 `ApplicationError` 或 `ErrorResponse` 映射。
- `PortError` 不携带业务语义;application service 决定它是可重试依赖失败、冲突还是内部错误。
- `ErrorResponse` 是协议边界对象,不是内部错误模型。

### 9.2 错误类型表

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `ContractError::MissingIdempotencyKey` | `contracts` | 写请求缺少幂等键 | 修正后可重试 | `invalid_argument` |
| `ContractError::InvalidMetadata` | `contracts` | trace、actor、request metadata 不合法 | 修正后可重试 | `invalid_argument` |
| `ContractError::InvalidPayload` | `contracts` | DTO 字段不合法 | 修正后可重试 | `invalid_argument` |
| `DomainError::Validation` | `domain_*` | 值对象、spec、范围规则不合法 | 修正后可重试 | `invalid_argument` |
| `DomainError::BoundaryViolation` | `domain_*` | 外部正文、Use truth、下游实现正文越界进入 | 修正后可重试 | `invalid_argument` |
| `DomainError::InvariantViolation` | `domain_*` | 对象内部不变量不成立 | 通常不可原样重试 | `precondition_failed` |
| `DomainError::IllegalStateTransition` | `domain_*` | 状态机非法转换 | 前置条件变化后可重试 | `precondition_failed` |
| `DomainError::ReferenceUnavailable` | `domain_reference_projection` | 引用 stale / invalidated / 不可解析 | 重新解析后可重试 | `precondition_failed` |
| `DomainError::FingerprintMismatch` | `domain_release` | 发布或快照 fingerprint 不匹配 | 修正输入或重算后可重试 | `precondition_failed` |
| `DomainError::CompatibilityBlocked` | `domain_release` | 兼容性检查不通过 | 修正契约后可重试 | `precondition_failed` |
| `ApplicationError::Validation` | `application_services` | command / query / job 输入不合法 | 修正后可重试 | `invalid_argument` |
| `ApplicationError::NotFound` | `application_services` | definition、baseline、snapshot、fact、projection 不存在 | 资源创建后可重试 | `not_found` |
| `ApplicationError::Conflict` | `application_services` | version、idempotency、唯一约束冲突 | 重新读取后可重试 | `conflict` |
| `ApplicationError::PreconditionFailed` | `application_services` | gate、状态、fingerprint、compatibility、stale 约束不满足 | 前置条件变化后可重试 | `precondition_failed` |
| `ApplicationError::Port` | `application_services` | port / adapter / dependency 失败 | 依赖恢复后可重试 | `dependency_unavailable` |
| `ApplicationError::Internal` | `application_services` | 未分类内部错误或不应出现的不变量破坏 | 需要排查 | `internal` |
| `PortError::Unavailable` | `application_ports` | repository、outbox、toolchain、publisher 不可用 | 是 | `dependency_unavailable` |
| `PortError::Timeout` | `application_ports` | 外部调用超时 | 是 | `dependency_unavailable` |
| `PortError::Conflict` | `application_ports` | 存储唯一键或版本冲突 | 重新读取后可重试 | `conflict` |
| `PortError::InvalidState` | `application_ports` | adapter 发现状态不允许更新 | 前置条件变化后可重试 | `precondition_failed` |
| `PortError::NotFound` | `application_ports` | 存储层目标不存在 | 资源存在后可重试 | `not_found` |
| `PortError::Serialization` | `application_ports` | 读写序列化失败 | 通常需排查 | `internal` |
| `PortError::ExternalToolFailed` | `application_ports` | toolchain / exporter 执行失败 | 可重试或人工介入 | `dependency_unavailable` |
| `PortError::PublishFailed` | `application_ports` | event publisher 单条发布失败 | 可 replay | `dependency_unavailable` |
| `PortError::TransactionFailed` | `application_ports` | 事务 begin / commit / rollback 失败 | 可重试或人工介入 | `dependency_unavailable` |

### 9.3 内部错误映射表

| 内部错误 | CLI / HTTP / RPC / Event 映射 | 调用方应如何处理 |
|---|---|---|
| `ContractError::MissingIdempotencyKey` | CLI 2 / HTTP 400 / `INVALID_ARGUMENT` / no event | 补齐幂等键后重试 |
| `DomainError::Validation` | CLI 2 / HTTP 400 / `INVALID_ARGUMENT` / no event | 修正字段、范围或 spec |
| `DomainError::BoundaryViolation` | CLI 2 / HTTP 400 / `INVALID_ARGUMENT` / no event | 移除越界正文或改为引用 |
| `DomainError::IllegalStateTransition` | CLI 4 / HTTP 412 / `FAILED_PRECONDITION` / no event | 读取当前状态,走合法流程 |
| `DomainError::ReferenceUnavailable` | CLI 4 / HTTP 412 / `FAILED_PRECONDITION` / no event | 重新解析引用或更换引用 |
| `DomainError::FingerprintMismatch` | CLI 4 / HTTP 412 / `FAILED_PRECONDITION` / no event | 重新生成 canonical 内容或指纹 |
| `DomainError::CompatibilityBlocked` | CLI 4 / HTTP 412 / `FAILED_PRECONDITION` / no event | 修正契约或走治理裁决 |
| `ApplicationError::NotFound` | CLI 3 / HTTP 404 / `NOT_FOUND` / no event | 检查 ID 或先创建资源 |
| `ApplicationError::Conflict` | CLI 4 / HTTP 409 / `ABORTED` / no event | 重新读取最新版本后重试 |
| `ApplicationError::PreconditionFailed` | CLI 4 / HTTP 412 / `FAILED_PRECONDITION` / no event | 补齐 gate、状态、引用、fingerprint 或允许 stale |
| `ApplicationError::Port` | CLI 5 / HTTP 503 / `UNAVAILABLE` / relay failed state | 等待依赖恢复,使用 replay / rebuild / retry |
| `ApplicationError::Internal` | CLI 1 / HTTP 500 / `INTERNAL` / no event | 保留 trace id 并排查 |

### 9.4 异常分支处理表

| 场景 | 检测位置 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|---|
| command payload 字段非法 | CLI / command DTO validation | 返回 `Validation`;不进入事务 | 不写审计,不写事件 |
| 缺少幂等键 | `CommandMetadata.idempotency_key()` | 返回 `Validation`;不进入事务 | 不写审计,不写事件 |
| 外部正文越界进入 | `BoundaryGuard` / `DefinitionUseBoundaryGuard` | 返回 `Validation`;不写 truth | 可写失败日志,不写事件 |
| definition 不存在 | repository get / get_for_update | 返回 `NotFound`;不创建占位对象 | 不写事件 |
| expected version 不匹配 | repository save | 返回 `Conflict`;回滚事务 | 可写失败审计意图,不写事件 |
| 非法生命周期迁移 | domain state function | 返回 `PreconditionFailed`;回滚事务 | application 可写失败审计意图,不写事件 |
| gate 未批准或不可读 | `GateDecisionPort` / release policy | 返回 `PreconditionFailed`;不发布 | 写失败审计意图,不写发布事件 |
| fingerprint 不匹配 | `FingerprintPolicy.ensure_publishable(...)` | 返回 `PreconditionFailed`;不发布 | 写失败审计意图,不写发布事件 |
| compatibility 不通过 | `ContractCompatibilityService` | 生成 incompatible trace;阻断发布 | 写兼容状态变化事件,不写 baseline published |
| repository / audit / outbox 事务内失败 | `UnitOfWork.transact(...)` | 回滚事务,返回 `Port` | 事务内审计不保证存在;写 error log |
| outbox event payload 构造失败 | event factory | 返回 `Validation`;回滚来源事务 | 不写事件 |
| event publisher 单条失败 | `OutboxRelayFlow` | 标记 failed 并继续后续事件 | 写 relay 失败记录,不新造业务事件 |
| event publisher 全局不可用 | `OutboxRelayWorker.run_once(...)` | 停止批次,返回 `Port` | 写 worker 失败日志 |
| snapshot exporter 失败 | `DeriveReleaseSnapshotJobFlow` | 返回 `Port`;不写 ready metadata | 写 job 失败审计 |
| snapshot metadata 成功前 outbox 失败 | snapshot 写事务 | 回滚 metadata 和消费引用 | 不写 ready 事件 |
| projection stale 且 query 不允许 stale | query service | 返回 `PreconditionFailed` | 不写审计,不写事件 |
| projection replace 失败 | `RebuildContractIndexJobFlow` | 返回 `Port`;旧 projection 保留 | 写 job 失败审计 |
| reference resolver 失败 | reference operation / validation | 标记 stale 或返回 `PreconditionFailed` | 写引用失效审计意图 |
| toolchain runner 失败 | validation / fingerprint job | 返回 `Port`;不写成功结论 | 写 job 失败审计 |
| toolchain 校验报告不通过 | compatibility service | 返回或记录 `PreconditionFailed`;生成 incompatible 追溯 | 写 compatibility changed 事件 |

### 9.5 恢复口径表

| 失败场景 | 保留状态 | 恢复动作 | 可重试性 | 人工介入 |
|---|---|---|---|---|
| command 事务失败 | truth / audit / outbox 全部回滚 | 修复输入或依赖后重试 command | 取决于错误类型 | Port / Internal 可需要 |
| version conflict | 原聚合状态保持 | 重新读取最新版本并重新提交 | 是 | 通常不需要 |
| gate 未通过 | definition 不进入 published | 补齐 approved gate 后重试发布 | 是 | 可能需要评审 |
| compatibility blocked | 兼容状态为 `Incompatible` | 修正契约或治理裁决后重新校验 | 是 | 可能需要 |
| snapshot exporter 失败 | baseline 保持 released;无 ready snapshot | 重跑 `DeriveReleaseSnapshotJob` | 是 | exporter 连续失败需要 |
| snapshot orphan asset | asset 存在但无 metadata | 清理 orphan 或重跑派生 | 是 | 可能需要 |
| outbox publish 失败 | outbox `failed` 或 `pending` | `replay_outbox` / relay 重跑 | 是 | 连续失败需要 |
| mark published 失败 | outbox 可能仍 pending | 幂等 publish 或人工标记 | 是 | 可能需要 |
| projection replace 失败 | 旧 projection active / stale | 重跑 `RebuildContractIndexJob` | 是 | 连续失败需要 |
| reference invalidated | 引用 `Invalidated` 或 `Stale` | 更换引用或重新解析 | 是 | 引用来源失效需要 |
| serialization / corrupted store | 读取失败 | 停止写入并排查 store | 否 | 是 |

### 9.6 审计、日志与事件口径

| 错误 / 异常 | 审计 | 日志 | 事件 |
|---|---|---|---|
| 输入校验失败 | 不写 | `debug` 或 `warn` | 不写 |
| 非法状态迁移 | application service 可写失败审计意图 | `warn` | 不写 |
| 发布前置条件失败 | 写失败审计意图 | `warn` | 不写 baseline published |
| 兼容性校验不通过 | 写兼容审计 | `info` / `warn` | 写 `ContractCompatibilityStatusChanged` |
| truth 写事务失败 | 事务内审计回滚;事务外记录日志 | `error` | 不写 |
| outbox append 失败 | 回滚来源事务 | `error` | 不写 |
| outbox publish 失败 | 写 relay 失败记录 | `warn` / `error` | 不新造业务事件 |
| projection rebuild 失败 | 写 operations 审计 | `error` | 不写 |
| query not found | 不写 | `debug` | 不写 |
| query stale | 不写 | `info` | 不写 |
| internal invariant broken | 尽可能写错误日志 | `error` | 不写 |

### 9.7 ErrorResponse 映射规则

| ApplicationError | ErrorCode | ErrorResponse code 字符串 | message 规则 | details 规则 |
|---|---|---|---|---|
| `Validation` | `ErrorCode::InvalidArgument` | `invalid_argument` | 说明哪个输入类别非法 | 可包含字段名,不包含正文 |
| `NotFound` | `ErrorCode::NotFound` | `not_found` | 说明资源类别不存在 | 可包含资源类型和 ID |
| `Conflict` | `ErrorCode::Conflict` | `conflict` | 说明版本、幂等或唯一约束冲突 | 可包含 expected / actual version |
| `PreconditionFailed` | `ErrorCode::PreconditionFailed` | `precondition_failed` | 说明缺失的 gate、状态、引用或 fingerprint 前置条件 | 可包含状态名、引用 ID |
| `Port` | `ErrorCode::DependencyUnavailable` | `dependency_unavailable` | 说明依赖类别暂不可用 | 不暴露内部路径、token、堆栈 |
| `Internal` | `ErrorCode::Internal` | `internal` | 使用通用内部错误消息 | 仅保留 trace id |

---

## 10. 回填草稿

正式 `03-详细设计.md` 回填时应遵守:

```text
1. §11 先写错误模型总览,再写错误类型表和映射表。
2. `ErrorCode` 必须使用 Step 12 统一后的六个变体。
3. 不新增 ApplicationError::ProjectionUnavailable。
4. 每个异常分支必须写检测位置、处理方式、审计 / 事件口径。
5. outbox、projection、snapshot、reference 的恢复必须承接 Step 11,不能写成“返回失败”。
6. HTTP / RPC 映射只能作为未来 gateway 包装映射,不能暗示 L0-core 本轮实现在线服务。
```

建议正式文档 §11 结构:

| 正式章节位置 | 回填内容 |
|---|---|
| `11.1 错误模型总览` | 错误族和映射方向图 |
| `11.2 错误类型表` | Contract / Domain / Application / Port error |
| `11.3 对外错误映射` | CLI status、ErrorResponse code、未来 HTTP / RPC 映射 |
| `11.4 异常分支处理` | command / query / event / job / relay 异常 |
| `11.5 恢复口径` | retry、replay、rebuild、manual intervention |
| `11.6 审计、日志与事件口径` | 哪些错误写审计 / 日志 / 事件 |

---

## 11. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 对外 `ErrorCode` 是否沿用 Step 6 旧命名 | A. 沿用旧命名; B. 改成 Step 8 统一错误码对应变体 | B | Step 8 已是协议主线,旧命名缺少 conflict / dependency unavailable | 已按 B 修正 Step 6 |
| 是否新增 `ApplicationError::ProjectionUnavailable` | A. 新增; B. 不新增,用 `PreconditionFailed` 或 stale view | B | 避免错误族膨胀,符合 Step 8 统一映射 | 已按 B 修正 Step 10 |
| `PortError` 是否直接暴露具体 adapter 错误 | A. 暴露; B. 统一映射 dependency unavailable | B | 外部调用方不应依赖 infra 细节 | 已按 B 作为本轮口径 |
| query stale 是否一定失败 | A. 一律失败; B. 由 query 参数决定是否允许 stale view | B | 支撑可解释旧视图,同时保留严格查询 | 已按 B 作为本轮口径 |
| relay 单条失败是否写业务事件 | A. 写失败业务事件; B. 只写 relay 状态 / 审计 / 日志 | B | 发布失败不是新的契约业务事实,避免污染事件流 | 已按 B 作为本轮口径 |

---

## 12. 进入下一步条件

Step 12 完成后必须满足:

- 每个模块的错误类型已经列出。
- 内部错误到 CLI / ErrorResponse / 未来 HTTP / RPC 的映射已经固定。
- 可重试、不可重试、需人工介入的错误已经区分。
- command / query / event / job / relay 的异常分支已经写出检测位置和处理方式。
- 事务失败、并发冲突、重复请求、外部依赖失败已经有明确处理口径。
- 审计、日志和事件写入边界已经明确。
- Step 6 / Step 10 中发现的错误口径不一致已经修正。
- 可以进入 Step 13 “定义并发、幂等与重入保护”。
