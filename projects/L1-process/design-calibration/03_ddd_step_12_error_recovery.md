# L1-process 03 DDD Step 12 错误模型、异常分支与恢复口径

> SOP: `standards/document/详细设计讨论流程_SOP.md` Step 12
> 书写规范: `standards/document/详细设计书写规范.md` §5.11
> 上游输入: `projects/L1-process/01-架构设计.md` §8;`projects/L1-process/02-概要设计.md` §10
> 直接输入:
> - `projects/L1-process/design-calibration/03_ddd_step_06_object_contracts.md`
> - `projects/L1-process/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
> - `projects/L1-process/design-calibration/03_ddd_step_08_protocol_contracts.md`
> - `projects/L1-process/design-calibration/03_ddd_step_09_function_flows.md`
> - `projects/L1-process/design-calibration/03_ddd_step_10_state_matrix.md`
> - `projects/L1-process/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md`
> 创建日期: 2026-06-06
> 状态: Completed

---

## 1. Step 状态

本 Step 已完成。

---

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 6 对象契约 | domain object / policy error variant | 复用 `DomainError::{InvalidStateTransition, BoundaryViolation, SourceTruthViolation, ReferenceResolutionFailed, RecoveryForkViolation, ExternalBodyRejected}` |
| Step 7 trait / port 契约 | repository / resolver / publisher / handoff / UoW / idempotency error | 复用已定义 port error,不新增 application-local placeholder error |
| Step 8 protocol 契约 | public API / consumer / job error surface | Command / Query 统一返回 `ProcessApiError`;Consumer 返回 `ConsumerReceipt`;Job 返回 `JobRunReceipt` 或 `JobError` |
| Step 9 函数流 | 每个 command / consumer / job 的异常分支 | 将分散异常分支收口为可落码的检测位置、处理方式和审计 / 事件口径 |
| Step 10 状态矩阵 | 非法转换和状态副作用 | 非法 domain transition 默认 `InvalidStateTransition`;projection / outbox / handoff 是派生或技术状态,不回滚已提交 truth |
| Step 11 事务一致性 | UoW、duplicate result store、补偿边界 | duplicate 必须读 `OperationResultRepository`;事务失败必须 rollback;补偿不得反写外部 truth |

---

## 3. SOP 问题回答

1. 每个模块有哪些错误类型?

   回答:domain 层只有 Step 6 的 `DomainError` 六类。application port 层只有 Step 7 的 `RepositoryError`、`ResolverError`、`PublishError`、`HandoffError`、`UnitOfWorkError`、`IdempotencyError`。protocol 层只有 Step 8 的 `ProcessApiError`、`ConsumerDisposition`、`JobError`、`JobDisposition` 和 query `ProcessViewStatus`。实现不得额外发明第二套错误 enum。

2. 哪些错误映射到 HTTP / RPC / Event 失败?

   回答:Command / Query handler 对外只暴露 `ProcessApiError`。Inbound Event consumer 不抛 public API error,而是返回 `ConsumerReceipt.disposition` 和 marker。Operations job 对外返回 `JobRunReceipt` 或 `JobError`。Publisher / handoff adapter error 不直接暴露给业务 caller,必须映射到 outbox / handoff state marker 和 job receipt。

3. 哪些错误可重试,哪些不可重试,哪些需要人工介入?

   回答:临时 repository / source / publisher / handoff dependency failure 可重试。schema invalid、domain policy reject、digest mismatch、body rejected、boundary violation、idempotency digest conflict 不可重试,除非 caller 修改输入。permanent publish / handoff failure、projection disabled、reconciliation drift、operation result missing 需要人工或运维介入。

4. 事务失败、并发冲突、重复请求、外部依赖失败如何处理?

   回答:事务内 business write 失败必须 rollback。同 operation + 同 key + 同 digest duplicate 读取 `OperationResultRepository` 原 result / receipt;同 operation + 同 key + 不同 digest 返回 conflict。optimistic version conflict rollback 并映射为暂不可完成 / caller reload。外部 source unavailable 在 command 中映射 temporary unavailable,在 consumer 中写 delayed receipt,在 job 中形成 partial / delayed result。

5. 哪些异常需要写审计、日志或事件?

   回答:只有已成立的 truth change、consumer marker、job marker、outbox publication state、projection state 和 handoff marker 才可写 trace / audit / outbox。失败的 domain transition 不写 success trace / outbox。quarantine / delayed / noop 是 consumer receipt / marker,不是 command success event。reconciliation issue 写 report,不自动修复。

---

## 4. 当前文档问题诊断

| 来源 | 问题 | 本 Step 收口 |
|---|---|---|
| Step 6 | `DomainError` 只固定 enum,没有对 public surface 的映射 | 补 domain error -> `ProcessApiError` / consumer / job 的映射 |
| Step 7 | port error 分散在 trait 契约里 | 补统一 retryability 和 caller action |
| Step 8 | protocol DTO 已有 error / receipt surface,但缺完整内部映射 | 补 `ProcessApiError`、`ConsumerReceipt`、`JobRunReceipt`、`JobError` 的使用边界 |
| Step 9 | 异常分支写在各 flow 内 | 聚合成异常分支处理表,避免实现者逐个 flow 自行选边 |
| Step 11 | 已定义补偿场景,但未区分 retryable / non-retryable / manual | 补恢复口径表 |

---

## 5. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否新增 application 统一 error enum | A. 新增 `ApplicationError`;B. 直接映射现有 port / domain error 到 protocol surface | 采用 B。Step 7 / Step 8 已有足够 surface,避免新增未使用 enum |
| duplicate result missing | A. 从当前 truth 重算;B. 返回 result missing error | 采用 B。映射为 `ProcessApiError::IdempotencyResultMissing` 或 job `DependencyUnavailable`,不得重算 |
| consumer invalid payload | A. 抛 API error;B. 返回 quarantine receipt | 采用 B。consumer 是 event surface,失败也必须可记录 marker |
| publish / handoff 外部失败 | A. rollback source truth;B. 更新技术状态 marker | 采用 B。已提交 truth 不因外部副作用失败回滚 |
| reconciliation drift | A. 自动修复;B. 只报告 | 采用 B。reconciliation report 不拥有 truth 修复权 |

---

## 6. 结构化中间产物

### 6.1 错误类型表

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `DomainError::InvalidStateTransition` | `domain::errors` | 对象状态迁移不在 Step 10 矩阵内 | 否,caller 必须修正状态 / 请求 | Command -> `ProcessApiError::DomainRejected`;Consumer -> `Quarantined` 或 `Noop`;Job -> `JobRunReceipt { disposition: JobDisposition::PartialFailure, ... }` when per item |
| `DomainError::BoundaryViolation` | `domain::errors` | 请求跨 process ownership / actor / subject boundary | 否 | `ProcessApiError::DomainRejected` 或 consumer `Quarantined` |
| `DomainError::SourceTruthViolation` | `domain::errors` | 外部 source truth 缺失、非法或不允许进入 Process | 通常否;source unavailable 由 `ResolverError::SourceUnavailable` 表达 | `ProcessApiError::DomainRejected`;consumer `Quarantined` |
| `DomainError::ReferenceResolutionFailed` | `domain::errors` | required external ref unresolved / stale / invalid / unavailable | stale / unavailable 可重试;invalid 不可重试 | command `DomainRejected` 或 `TemporarilyUnavailable`;consumer `Delayed` / `Quarantined`;query `Degraded` / `Unavailable` |
| `DomainError::RecoveryForkViolation` | `domain::errors` | recovery 操作会 fork process truth | 否,需要人工处理恢复策略 | `ProcessApiError::DomainRejected`;job partial report |
| `DomainError::ExternalBodyRejected` | `domain::errors` | 外部正文试图进入 Process 持久化边界 | 否,caller / adapter 必须移除 body | `ProcessApiError::DomainRejected`;consumer `Quarantined`;job `InvalidInput` or partial |
| `RepositoryError::NotFound` | `application::errors` | repository 未找到 requested truth / projection | 否,除非 caller 改 ref 或等待异步创建 | command `NotFound`;query `Missing`;job skipped / partial |
| `RepositoryError::Conflict` | `application::errors` | optimistic version 不匹配或 unique key 冲突 | 是,caller reload 后重试 | command `TemporarilyUnavailable` with dependency/conflict ref or `DomainRejected` when semantic conflict;job delayed / partial |
| `RepositoryError::StorageUnavailable` | `application::errors` | storage dependency 暂不可用 | 是 | `ProcessApiError::TemporarilyUnavailable`;consumer delayed when receipt can be stored,otherwise adapter retry;job `DependencyUnavailable` |
| `RepositoryError::InvalidFilter` | `application::errors` | list scope / filter 不被 repository 支持 | 否,输入错误 | query `InvalidRequest`;job `InvalidInput` |
| Missing sidecar truth | repository read returns `None` for a ref held by committed primary truth | context / snapshot / marker / record expected by primary truth is absent,for example `WaitingGate.pause_context_ref` has no `PauseContext` | 否,需要修复数据或重建 sidecar | command -> `ProcessApiError::DomainRejected` / invariant failure without success side effects;query -> `ProcessViewStatus::Degraded` with `ProcessDegradedMarker`;job -> partial failure |
| `RepositoryError::SerializationFailed` | `application::errors` | stored representation 不能序列化 / 反序列化 | 否,需要人工介入 | `TemporarilyUnavailable`;job `DependencyUnavailable`;operations alert |
| `ResolverError::NotFound` | `application::errors` | 外部对象不存在或不可见 | 否,除非外部稍后创建 | command `NotFound` or `DomainRejected`;consumer `Quarantined` / `Noop`;job partial |
| `ResolverError::UnsupportedVersion` | `application::errors` | source event / version 不被本 boundary 支持 | 否,需要升级 adapter 或输入 | command `InvalidRequest` / `DomainRejected`;consumer `Quarantined`;job `InvalidInput` |
| `ResolverError::SourceUnavailable` | `application::errors` | external source 临时不可用 | 是 | command `TemporarilyUnavailable`;consumer `Delayed`;job `DependencyUnavailable` or partial |
| `ResolverError::DigestMismatch` | `application::errors` | supplied digest 与 resolved summary 不一致 | 否,输入或 source truth 错误 | command `DomainRejected`;consumer `Quarantined`;job partial |
| `ResolverError::InvalidPayload` | `application::errors` | source payload 不符合 Process boundary | 否 | command `InvalidRequest` / `DomainRejected`;consumer `Quarantined`;job `InvalidInput` |
| `ResolverError::BodyNotAllowed` | `application::errors` | resolver 收到不允许跨入 Process 的正文 | 否 | command `DomainRejected`;consumer `Quarantined`;job `InvalidInput` or partial |
| `PublishError::Retryable(PublishFailureRef)` | `application::errors` | publisher temporary failure | 是 | outbox `RetryPending`;job receipt `PartialFailure` or `Delayed` |
| `PublishError::Permanent(PublishFailureRef)` | `application::errors` | publisher permanent failure | 否,需要人工 / 配置修复 | outbox `Failed`;job `PartialFailure` report |
| `PublishError::InvalidEvent` | `application::errors` | outbox truth change 无法构造合法 event | 否,设计 / 实现缺口 | outbox `Failed`;job `PartialFailure`;必须告警 |
| `HandoffError::Retryable(HandoffFailureRef)` | `application::errors` | observability / archive handoff temporary failure | 是 | handoff marker `Failed` with retryable marker;job `PartialFailure` / delayed |
| `HandoffError::Permanent(HandoffFailureRef)` | `application::errors` | handoff permanent failure | 否,需要人工 / 配置修复 | handoff marker `Failed`;job `PartialFailure` report |
| `HandoffError::InvalidTarget` | `application::errors` | handoff target 不合法或不属于本 boundary | 否 | job `InvalidInput` or per-item failed marker |
| `UnitOfWorkError::BeginFailed` | `application::errors` | transaction 无法开始 | 是 | command `TemporarilyUnavailable`;consumer / job retry by caller |
| `UnitOfWorkError::CommitFailed` | `application::errors` | commit 未成功返回 | 未知,需要 adapter 按幂等键恢复 | command `TemporarilyUnavailable`;consumer / job retry using same key |
| `UnitOfWorkError::RollbackFailed` | `application::errors` | rollback 失败或状态未知 | 需要人工介入 | `TemporarilyUnavailable`;operations alert;禁止继续写补偿 truth |
| `IdempotencyError::Conflict` | `application::errors` | same operation + same key + different digest | 否,caller 必须换 key 或保持原 request | `ProcessApiError::IdempotencyConflict`;job `JobError::IdempotencyConflict` |
| `IdempotencyError::StoreUnavailable` | `application::errors` | idempotency store 暂不可用 | 是 | `TemporarilyUnavailable`;job `DependencyUnavailable`;consumer retry |
| `IdempotencyError::ResultMissing` | `application::errors` | completed record 指向缺失 result | 否,需要人工修复 result store | `ProcessApiError::IdempotencyResultMissing`;job `DependencyUnavailable` |
| `IdempotencyError::DigestMismatch` | `application::errors` | stored digest 与 request digest 不一致 | 否 | `IdempotencyConflict`;job `IdempotencyConflict`;consumer duplicate conflict quarantine |
| `ProcessApiError::*` | `contracts::errors` | public command / query error surface | 由内部错误决定 | HTTP / RPC adapter 直接映射此 enum |
| `ConsumerDisposition::{Quarantined, Delayed, Noop, Duplicate}` | `contracts::events` | inbound consumer 非 success path | `Delayed` 可重试;`Duplicate` 不重试;`Quarantined` 人工 / source 修正 | Event ack with `ConsumerReceipt` |
| `JobError::*` / `JobDisposition::*` | `contracts::jobs` | operations job validation、dependency、partial failure | `DependencyUnavailable` 可重试;`InvalidInput` 不可重试;`PartialFailure` 由 report 决定 | Job runner response |
| `ProcessViewStatus::{Missing, NotVisible, Degraded, Unavailable}` | `contracts::views` | query read surface 非 available | degraded / unavailable 可稍后重试;missing / not visible 不应盲重试 | Query response status / `ProcessApiError` |

### 6.2 错误映射表

| 内部错误 | HTTP / RPC / Event 映射 | 调用方应如何处理 |
|---|---|---|
| request DTO required field missing / invalid enum | `ProcessApiError::InvalidRequest`;consumer invalid envelope -> `ConsumerDisposition::Quarantined`;job -> `JobError::InvalidInput` | 修正请求或 event schema 后重试;不得进入 domain transition |
| authorization / visibility denied | `ProcessApiError::NotAuthorized` 或 query `ProcessViewStatus::NotVisible` | caller 更换 actor / scope;不得通过 query 触发修复 |
| `IdempotencyReservation::Duplicate(result_ref)` and result exists | same operation + same key + same digest;command returns stored command result;consumer returns stored `ConsumerReceipt` with duplicate semantics;job returns previous `JobRunReceipt` | caller 接受原 result / receipt;不得重新执行 side effect |
| duplicate result missing | `ProcessApiError::IdempotencyResultMissing(result_ref)`;job `JobError::DependencyUnavailable(DependencyRef)` | 人工修复 operation result store;不得从 current truth 重算 |
| idempotency same operation + same key + different digest | `ProcessApiError::IdempotencyConflict`;job `JobError::IdempotencyConflict`;consumer quarantine/conflict receipt | caller 使用新 key 或原 request digest |
| repository `NotFound` on command dependency | `ProcessApiError::NotFound(ProcessSubjectRef)` | caller 修正 ref;不写 trace / outbox |
| repository `NotFound` on query projection | query response `Missing` or `ProcessApiError::NotFound` by query contract | caller 可等待 projection rebuild only when source truth exists |
| repository `Conflict` | command `TemporarilyUnavailable` or conflict-specific domain rejection;job delayed / partial | reload latest version and retry same operation if still valid |
| repository `StorageUnavailable` / idempotency store unavailable | `ProcessApiError::TemporarilyUnavailable`;consumer caller retry;job `DependencyUnavailable` | 使用同 idempotency / dedup key 重试 |
| domain `InvalidStateTransition` | `ProcessApiError::DomainRejected`;consumer `Quarantined` or `Noop`;job partial item failure | caller 修正目标状态或等待合法状态;不得保存 success trace |
| domain `BoundaryViolation` / `RecoveryForkViolation` | `ProcessApiError::DomainRejected`;consumer `Quarantined`;job partial report | 人工检查 boundary / recovery plan |
| domain / resolver body rejected | command `DomainRejected`;consumer `Quarantined`;job `InvalidInput` or partial | 移除 body,只传 ref / digest / summary |
| resolver source unavailable | command `TemporarilyUnavailable`;consumer `Delayed`;job `DependencyUnavailable` or partial receipt | 稍后重试;不得伪造 snapshot |
| resolver digest mismatch / invalid payload | command `DomainRejected`;consumer `Quarantined`;job partial failed item | 修正 source digest / payload;不得写 resolved marker |
| publisher retryable failure | no API error to original command;outbox `RetryPending`;job receipt `PartialFailure` or `Delayed` | publish job later retry pending outbox |
| publisher permanent failure / invalid event | outbox `Failed`;job receipt `PartialFailure` with report | 人工修复 mapping / configuration;不得 drop outbox |
| handoff retryable failure | `TraceHandoffState::Failed` with retryable marker;job partial / delayed | handoff job retry or operator rerun |
| handoff permanent failure / invalid target | handoff marker `Failed` or job `InvalidInput`;job report | 人工修复 target / config;不得保存 external body |
| projection rebuild failure | `DerivedProcessViewState::Failed`;query `Degraded` / `Unavailable`;job partial / failed receipt | 修复 builder / source data 后重建 projection |
| reconciliation issue found | `ReconciliationReport` with `HasIssues` / `Partial`;job receipt `Completed` or `PartialFailure` | 人工审查 report;reconciliation job 不修复 truth |
| UoW begin failed | `TemporarilyUnavailable`;consumer / job retry by caller | 稍后同 key 重试 |
| UoW commit failed | `TemporarilyUnavailable` with unknown completion;consumer / job retry using same key | 先通过 idempotency result 判断是否已完成;不得盲写第二次 |
| UoW rollback failed | `TemporarilyUnavailable`;operations alert | 人工核对 storage state;禁止写补偿 truth 掩盖 |

### 6.3 异常分支处理表

| 场景 | 检测位置 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|---|
| Command request schema invalid | API command handler / request validator | 返回 `ProcessApiError::InvalidRequest` | 否;不开始 UoW |
| Command actor unauthorized | API / application authorization guard | 返回 `NotAuthorized` | 否;可写 adapter log,不写 process trace |
| Command idempotency duplicate | `IdempotencyRepository::reserve_command` | `OperationResultRepository::get_result`;返回 stored command result | 否;不得新写 trace / outbox |
| Command duplicate result missing | `OperationResultRepository::get_result` | 返回 `IdempotencyResultMissing` | 否;需要 operations alert |
| Command idempotency conflict | idempotency reservation | rollback UoW;返回 `IdempotencyConflict` | 否 |
| Domain state transition illegal | domain object member function | rollback UoW;返回 `DomainRejected` | 不写 success trace / outbox |
| Recovery fork violation | `RecoveryContinuityPolicy` / recovery domain object | rollback UoW;返回 `DomainRejected` | 不写 recovery success history;可由 caller 创建人工 issue |
| External body enters command path | resolver / domain guard | rollback UoW;返回 `DomainRejected` | 不写 body;不写 success trace |
| Repository dependency missing before command transition | application service dependency load | rollback UoW;返回 `NotFound` | 否 |
| Repository conflict on save | repository optimistic save | rollback UoW;返回 retryable mapped error | 否;caller reload |
| Operation result save failure | `OperationResultRepository::save_result` | rollback whole command;返回 temporary unavailable | 否;不得 complete idempotency |
| Idempotency complete failure | `IdempotencyRepository::complete` | rollback whole command | 否;同 key retry must not see partial truth |
| Query target missing | query repository | 返回 `Missing` surface or `NotFound` by query contract | 否;query 不写 UoW |
| Query projection stale / failed | query mapper reads `DerivedProcessViewState` | 返回 `Degraded` / `Unavailable` marker | 否;不得在 query 中 rebuild |
| Consumer envelope invalid | consumer handler before reservation | 返回 `ConsumerReceipt` with `Quarantined` when metadata usable,otherwise adapter rejects before process service | 写 quarantine marker only if dedup / source identity usable |
| Consumer duplicate | `reserve_event` duplicate | load stored `ConsumerReceipt`;return duplicate surface | 不写新 marker / trace |
| Consumer source unavailable | resolver / source adapter | write delayed marker and stored `ConsumerReceipt` when possible | 写 delayed marker;不写 success marker |
| Consumer digest mismatch / body rejected | resolver / payload guard | write quarantine receipt | 写 quarantine marker;不写 snapshot resolved state |
| Consumer valid no affected subject | consumer service guard | return `Noop` receipt | 可写 noop marker;不写 command truth |
| Consumer repository failure after marker staged | repository / UoW | rollback UoW;adapter may retry event with same dedup key | 不留下 partial marker |
| Publish job duplicate | `reserve_job` duplicate | return stored `JobRunReceipt` | 不重算 counters;不 publish |
| Publish event mapping invalid | publisher mapper from outbox truth ref | mark outbox `Failed`;job partial report | 写 outbox failure state;不改 source truth |
| Publisher retryable error | publisher port | mark outbox `RetryPending`;continue batch | 写 retry marker;不回滚 source truth |
| Publisher permanent error | publisher port | mark outbox `Failed`;report partial | 写 failure marker;不 drop outbox |
| Projection rebuild item failure | projection builder / repository | mark `DerivedProcessViewState::Failed`;job partial | 写 projection failed marker only |
| Snapshot refresh source unavailable | resolver in refresh job | mark reference unavailable or count partial | 写 unavailable marker;不 fabricate snapshot |
| Reconciliation drift found | reconciliation scanner | save report with issue refs | 写 report;不 repair truth |
| Handoff invalid target | handoff job validation | reject item or job `InvalidInput` | No trace body;may write failed marker for existing handoff |
| Handoff retryable failure | handoff port | mark handoff `Failed` with retryable failure marker;job partial | 写 marker;不保存 observability / archive body |
| Handoff delivered save conflict | repository optimistic save | retry item by reloading marker;do not call external handoff again unless idempotency allows | 不写 duplicate body;marker decides |
| Recovery maintenance partial failure | maintenance job item loop | commit successful item tx;save report / receipt partial | 写 per-attempt history only for committed items |
| UoW commit unknown | `UnitOfWorkHandle::commit` | return temporary unavailable;next retry checks idempotency result | 不追加补偿 truth until completion known |
| Rollback failure | `UnitOfWorkHandle::rollback` | surface temporary unavailable and alert | 不继续写 audit / event in same flow |

### 6.4 恢复口径表

| 场景 | 可重试性 | 恢复方式 | 不允许的做法 |
|---|---|---|---|
| `RepositoryError::StorageUnavailable` | 可重试 | caller / job 使用同 idempotency key 稍后重试 | 生成新 key 造成重复 business write |
| `RepositoryError::Conflict` | 可重试但需 reload | reload latest version,重新校验 policy 后提交 | 忽略 expected version 覆盖保存 |
| `ResolverError::SourceUnavailable` | 可重试 | command 返回 temporary unavailable;consumer delayed;job partial / dependency unavailable | 伪造 external snapshot 或复制外部 truth |
| `PublishError::Retryable` | 可重试 | outbox `RetryPending`;publish job 后续重试 | rollback source command truth |
| `HandoffError::Retryable` | 可重试 | handoff marker `Failed` with retryable marker;handoff job retry | 删除 handoff intent |
| UoW commit unknown | 可通过幂等恢复 | retry same key first reads idempotency / result store | 在未确认 completion 前二次写 truth |
| `InvalidRequest` / unsupported version | 不可重试原请求 | caller 修正 schema / version | service 自动猜测字段或兼容未定义 payload |
| `IdempotencyConflict` | 不可重试原 key | 使用原 request 或新 key | same key different digest 继续执行 domain |
| `DomainRejected` | 不可重试原状态 | caller 等待合法状态或修正业务输入 | 写 rejected transition 的 success trace |
| `DigestMismatch` / `BodyNotAllowed` | 不可重试原 payload | 修正 source digest /移除 body | 存储外部正文或降级为 resolved |
| permanent publish / handoff failure | 需要人工介入 | 修复 topic / destination / mapping / adapter config,再由 operations rerun | silently drop event / handoff marker |
| duplicate result missing | 需要人工介入 | 修复 `operation_results` 与 idempotency completion 一致性 | 从 current truth 重建 result / receipt / counters |
| projection disabled / failed repeatedly | 需要人工介入 | 修复 builder / source cursor / adapter,再触发 rebuild | query path 自动 repair projection |
| reconciliation drift | 需要人工介入 | 按 report issue refs 开独立修复流程 | reconciliation job 直接修改 truth |
| rollback failure | 需要人工介入 | 暂停该 operation path,核对 storage / transaction logs | 继续写补偿记录掩盖不一致 |

### 6.5 Command / Query 映射规则

| 内部来源 | `ProcessApiError` variant | 规则 |
|---|---|---|
| request validation | `InvalidRequest(ProtocolErrorRef)` | handler 必须在 UoW 前校验 required fields / enum / scope |
| authorization / visibility guard | `NotAuthorized(AuthorizationErrorRef)` | actor 不满足 command / query scope |
| idempotency same operation + same key + different digest | `IdempotencyConflict(IdempotencyConflictRef)` | 不进入 domain transition |
| duplicate result missing | `IdempotencyResultMissing(ApplicationResultRef)` | 不重算 result |
| repository not found | `NotFound(ProcessSubjectRef)` | dependency ref 不存在或不可见 |
| domain reject | `DomainRejected(DomainErrorRef)` | 包括 invalid transition、boundary、fork、body reject 等 |
| storage / source temporary unavailable | `TemporarilyUnavailable(DependencyRef)` | caller 可同 key 重试 |

Query 特殊规则:

- query 读取 projection stale 时优先返回包含 `ProcessViewStatus::Degraded` 的 query response surface,不得打开 write UoW。
- query 读取 projection disabled / unavailable 时返回 `Unavailable` 或 `ProcessApiError::TemporarilyUnavailable`,按 Step 8 query contract 选择。
- query 不触发 resolver refresh、projection rebuild、reconciliation repair。

### 6.6 Consumer 映射规则

| 内部来源 | `ConsumerDisposition` | marker / receipt 规则 |
|---|---|---|
| accepted source event | `Accepted` | 保存 snapshot / reference / stale marker、trace ref、stored `ConsumerReceipt` |
| same event duplicate | `Duplicate` | 读取 stored `ConsumerReceipt`;不得重算 marker ref |
| invalid envelope / unsupported schema / digest mismatch / body rejected | `Quarantined` | 保存 `QuarantineMarker`;不得写 resolved snapshot |
| source unavailable / repository dependency temporary unavailable before state can be resolved | `Delayed` | 保存 `DelayedConsumerMarker`;外部 caller 可稍后重投同 event |
| valid event but no affected Process subject or already represented marker | `Noop` | 保存 `NoopConsumerMarker` when metadata usable |

Consumer 禁止事项:

- consumer 不得直接调用 command-only transition,例如 complete activity 或 resume waiting gate。
- consumer 不得把 external source body 写入 Process storage。
- duplicate consumer 不得根据当前 repository state 构造新的 receipt。

### 6.7 Job 映射规则

| 内部来源 | `JobRunReceipt` / `JobError` | 规则 |
|---|---|---|
| job request invalid | `Err(JobError::InvalidInput)` | 不开始 item loop |
| job idempotency conflict | `Err(JobError::IdempotencyConflict)` | 不执行 job side effect |
| dependency unavailable before job can start | `Err(JobError::DependencyUnavailable)` | caller 后续同 job key 重试 |
| all items succeeded | `Ok(JobRunReceipt { disposition = Completed, ... })` | counters 来自本次 run |
| some items failed but report produced | `Ok(JobRunReceipt { disposition = PartialFailure, report_ref: Some(_), ... })` | per-item committed changes 保留 |
| job delayed by temporary dependency | `Ok(JobRunReceipt { disposition = Delayed, ... })` when receipt can be stored | caller / scheduler later retry |
| duplicate job | stored previous `JobRunReceipt` | counters 不重算;disposition 以 stored receipt 为准 |

Job 禁止事项:

- publish / handoff job 不得回滚 source command truth。
- projection / reconciliation job 不得创建 business truth。
- refresh job 不得写 external body。

---

## 7. 对 Step 6-11 的闭环约束

| 约束 | 落码要求 |
|---|---|
| Domain error 不直接进入 public JSON | API 必须映射到 `ProcessApiError::DomainRejected(DomainErrorRef)` 或 event/job marker |
| Port error 不泄漏 adapter internals | `DependencyRef` / failure ref 只携带可公开引用,不携带连接串、body 或外部 payload |
| Duplicate result surface 唯一来源 | `OperationResultRepository`,不是 current truth / projection / counter |
| Failed transition 不写 success trace | trace / outbox 只记录 committed truth change 或显式 marker |
| Retryable failure 必须有状态承载 | outbox `RetryPending`;consumer `Delayed`;handoff `Failed` with retryable marker;job `Delayed` / partial |
| Manual intervention 必须可定位 | permanent failure、result missing、rollback failure、drift report 必须保留 ref / report ref |

---

## 8. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_12_error_recovery.md`
>
> 延伸阅读:
> - Step 6 `DomainError`
> - Step 7 application port errors
> - Step 8 `ProcessApiError` / `ConsumerReceipt` / `JobRunReceipt`
> - Step 9 function flow exception branches
> - Step 11 transaction and recovery compensation rules

`03-详细设计.md` §11 必须写入本 Step 的错误类型表、错误映射表、异常分支处理表和恢复口径表。正式错误 surface 以 `ProcessApiError`、`ConsumerReceipt`、`JobRunReceipt`、`JobError`、query view status 和 Step 7 port error 为准。Command / Query 不得暴露 domain / adapter 内部错误结构;Consumer 不得抛 command API error;Job duplicate 不得重算 counters。所有 retryable / non-retryable / manual intervention 场景必须明确恢复方式和禁止事项。

---

## 9. 待确认事项

- 无阻塞 Step 13 的待确认事项。
- Step 13 必须展开 idempotency key / digest 字段集合、并发窗口、lease / retry backoff 和重入保护;本 Step 只固定错误映射与恢复分类。
- Step 14 必须保证 `DependencyRef`、publisher destination、handoff target 和 resolver source 配置可追踪到本 Step 的 dependency unavailable / permanent failure 映射。
- Step 16 必须为本 Step 每类错误至少指定一个最小测试切口。

---

## 10. 完成检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| 错误类型可回指模块 / protocol | 通过 | 所有错误均来自 Step 6 / 7 / 8 |
| 区分 retryable / non-retryable / manual | 通过 | 见 §6.4 |
| 异常分支不是笼统“返回失败” | 通过 | 见 §6.3 |
| duplicate result missing 不重算 | 通过 | 明确映射 `IdempotencyResultMissing` |
| publish / projection / handoff 补偿闭合 | 通过 | outbox / projection / handoff marker 均有恢复口径 |
| 可进入 Step 13 并发幂等 | 通过 | 下一步展开 key / digest / lease / retry 细节 |
