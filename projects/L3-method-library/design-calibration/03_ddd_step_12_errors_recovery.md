# Step 12. 定义错误模型、异常分支与恢复口径

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 12
- 回填章节：`03-详细设计.md` §11 错误模型、异常分支与恢复口径

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 6 对象契约 | 已确认 `MethodLibraryError` 需要覆盖对象不变量、状态机、payload、reference、snapshot、outbox 等错误 |
| Step 8 协议契约 | 已确认 HTTP status、RPC 可选映射、Event / Job 失败形态 |
| Step 9 处理流 | 已确认每个 Command / Query / Event / Job 的异常分支 |
| Step 10 状态机 | 已确认非法 lifecycle / outbox / idempotency / job 状态转换错误 |
| Step 11 事务与一致性 | 已确认事务失败、outbox 失败、projection 失败和恢复边界 |
| 旧 `03-详细设计.md` §19 | 已有异常与补偿设计草稿,需要按新版 §11 重排 |

已确认结论：

```text
错误模型必须服务于代码实现,不是只列错误码。
所有错误必须能回指模块、协议或处理流。
业务校验失败不写 Definition truth。
Command 本地事务失败整体回滚。
Outbox relay / projection / downstream sync 失败不回滚已提交 truth。
Query 不通过写库修复错误。
```

依赖的前序 Step：

```text
Step 1~11 已确认范围、对象、port、协议、处理流、状态机和事务一致性。
```

---

## 3. SOP 问题回答

1. 每个模块有哪些错误类型？

   回答：`contracts/api` 负责 gateway context、path/body、pagination 和 protocol 错误；`domain::content` 负责 payload/kind、boundary、lifecycle、published immutable、reference 和 supersede 错误；`application` 负责 gate、idempotency、revision、version conflict、snapshot、outbox、job 和 recovery 错误；`infra` 负责 persistence、object storage、bus、governance adapter 和 projection 错误。

2. 哪些错误映射到 HTTP / RPC / Event 失败？

   回答：HTTP 继承 Step 8 映射:400 protocol/idempotency key 缺失,404 not found/P1 disabled,409 lifecycle/idempotency/version conflict,412 revision conflict,422 semantic validation,424 publish gate,500 local construction failure,503 external dependency。RPC 只做等价映射,不得改变业务语义。Event 失败进入 outbox retry/dead-letter 或 inbound dead-letter。Job 失败写入 `JobRunStatus`、`failure_reason` 和 checkpoint。

3. 哪些错误可重试，哪些不可重试，哪些需要人工介入？

   回答：外部依赖短暂不可用、bus publish failed、projection checkpoint conflict 可重试。validation、boundary、lifecycle、published immutable、same key different hash 不可原请求重试,必须修正输入或状态。snapshot hash mismatch、fingerprint mismatch、outbox payload invalid、dead-letter 超限需要人工介入或受控修复流程。

4. 事务失败、并发冲突、重复请求、外部依赖失败如何处理？

   回答：事务失败整体回滚并返回稳定错误；revision / version / supersede 冲突返回冲突类错误,调用方重新读取后再决定是否重试；重复请求按 idempotency 规则返回既有结果或冲突；外部依赖在本地事务提交前失败则阻断 command,提交后失败则进入 retry / recovery。

5. 哪些异常需要写审计、日志或事件？

   回答：成功改变业务状态必须写 lifecycle history / audit / outbox。失败请求不得写 lifecycle history 或业务 outbox。进入 application service 且可关联 actor / target 的失败可以写失败 audit 或 structured log,但不能伪造成业务状态变化。outbox relay 失败写 outbox status / retry reason；inbound event 失败写 dead-letter；job 失败写 job result / checkpoint failure。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `03-详细设计.md` §19 | 错误分类、恢复策略较完整,但和新版 Step 8~11 的章节顺序不一致 | 正式 §11 需要回指协议、处理流、状态机和事务契约 |
| 旧错误码 | 同时出现 `LIFECYCLE_TRANSITION_INVALID` 和 `LIFECYCLE_TRANSITION_NOT_ALLOWED` | 需要统一为当前 Step 8~10 口径 |
| 旧 §19.3 | 分类里写“是否写 audit”不够区分业务 audit / 失败日志 / dead-letter | 实现者可能在失败状态迁移时写错误的业务 audit |
| Step 9 | 每个 flow 有错误映射,但没有集中说明 retryable / manual recovery | 调用方和测试难以统一断言 |
| Step 11 | 一致性失败已有恢复原则,但未映射到错误类型 | repository / adapter 层实现缺错误收敛边界 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 错误组织 | 按异常场景散写 | 按模块错误类型 + 外部映射 + 异常分支 + 恢复口径组织 | 更适合实现 `MethodLibraryError` 和测试 |
| 错误命名 | 新旧错误码混用 | 以 Step 8~11 当前口径为准 | 防止代码和文档出现双命名 |
| Audit 规则 | “是否写 audit”较笼统 | 区分 lifecycle history、business audit、failure audit/log/dead-letter | 避免失败写成业务事实 |
| Event / Job 错误 | 以文字恢复策略为主 | 明确 outbox status、dead-letter、job result、checkpoint | 支撑 worker 实现 |
| Query 错误 | not found / stale 分散 | 明确 Query 只读,不修复数据 | 保持读写边界 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每个接口只在自己的小节写错误 | 就近阅读方便 | 错误类型会重复和分叉 | 不采用 |
| 全部错误只有一个 `InternalError` | 实现简单 | 无法做协议映射、重试和测试断言 | 不采用 |
| 按模块定义错误,再统一映射到协议 / recovery | 语义清楚,可测试 | 需要维护错误表 | 采用 |
| 失败 command 统一写业务 audit | 看起来审计完整 | 会把失败伪造成业务状态事实 | 不采用 |
| 成功业务变化写 audit/outbox,失败写 structured log / failure audit / dead-letter | 事实边界清楚 | 需要区分记录类型 | 采用 |

---

## 7. 结构化中间产物

### 7.1 错误响应与内部错误模型

统一错误响应:

```json
{
  "request_id": "REQ-100",
  "error": {
    "code": "REVISION_CONFLICT",
    "message": "expected revision does not match",
    "retryable": false,
    "target": {
      "kind": "MethodContent",
      "id": "MC-100"
    },
    "details": {
      "expected_revision": 3,
      "actual_revision": 4
    },
    "trace_id": "TRACE-100",
    "recovery_hint": "reload MethodContent and retry with the latest revision"
  }
}
```

内部 Rust 错误模型建议:

```rust
/// method-library 统一错误类型。
///
/// 该类型必须能映射到 HTTP / RPC / Event / Job 失败语义,并保留可恢复性信息。
pub enum MethodLibraryError {
    /// 协议层错误,承载 HTTP/RPC path、body、header 或请求格式解析失败。
    Protocol(ProtocolError),

    /// 输入校验错误,承载字段、payload、schema 或命令参数不满足契约的失败。
    Validation(ValidationError),

    /// 边界违规错误,承载 Method truth 混入 Use truth 或跨仓事实污染等边界问题。
    Boundary(BoundaryError),

    /// 生命周期错误,承载非法状态迁移或当前状态不允许执行目标操作的失败。
    Lifecycle(LifecycleError),

    /// 定义引用错误,承载引用不存在、引用类型不允许或引用版本不满足发布要求的失败。
    Reference(ReferenceError),

    /// 治理门禁错误,承载 approved gate 缺失、无效、过期或与目标内容不匹配的失败。
    Governance(GovernanceError),

    /// 并发控制错误,承载 revision 冲突、锁冲突或并发写入导致的一致性失败。
    Concurrency(ConcurrencyError),

    /// 幂等处理错误,承载 idempotency key 缺失、请求 hash 冲突或幂等状态不一致。
    Idempotency(IdempotencyError),

    /// 快照错误,承载 definition snapshot 生成、读取、校验或对象存储引用失败。
    Snapshot(SnapshotError),

    /// 指纹错误,承载 canonical fingerprint 计算、比对或持久化值不一致的失败。
    Fingerprint(FingerprintError),

    /// Outbox 错误,承载事件追加、claim、发布确认、重试或 dead-letter 状态失败。
    Outbox(OutboxError),

    /// 投影错误,承载 read model 更新、checkpoint 推进或 projection rebuild 失败。
    Projection(ProjectionError),

    /// 运维作业错误,承载 seed、replay、recalculate 或 rebuild job 的启动和执行失败。
    Job(JobError),

    /// 外部依赖错误,承载 governance、L0-bus、object storage 等外部端口调用失败。
    Dependency(DependencyError),

    /// 持久化错误,承载数据库事务、repository 读写或存储层不可用的失败。
    Persistence(PersistenceError),
}
```

关键说明：

- enum 名称是实现契约建议,代码可按 crate 组织拆分,但错误语义不能丢。
- 错误必须携带 `code`、`retryable`、`target`、`details`、`trace_id` 或等价结构。
- `message` 面向开发 / 运维,不是唯一判断依据。

### 7.2 错误类型表

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| `GATEWAY_CONTEXT_MISSING` / `GATEWAY_CONTEXT_INVALID` | `api` / `contracts` | Gateway headers 缺失或非法 | 否 | HTTP 400 / RPC `INVALID_ARGUMENT` |
| `PATH_BODY_MISMATCH` | `api` / `contracts` | path content_id 与 body content_id 不一致 | 否 | HTTP 400 / RPC `INVALID_ARGUMENT` |
| `IDEMPOTENCY_KEY_REQUIRED` | `api` / `application` | Command / Job 缺少幂等键 | 否 | HTTP 400 / RPC `INVALID_ARGUMENT` |
| `PAYLOAD_KIND_MISMATCH` | `domain::content` | `kind` 与 payload variant 不一致 | 否 | HTTP 422 / RPC `INVALID_ARGUMENT` |
| `BOUNDARY_VIOLATION` | `domain::policies` | payload 混入 Use truth 或外部实例事实 | 否 | HTTP 422 / RPC `FAILED_PRECONDITION` |
| `REFERENCE_INVALID` | `domain::definitions` | 引用不存在、kind 不允许或格式非法 | 否 | HTTP 422 / RPC `FAILED_PRECONDITION` |
| `REFERENCE_NOT_PUBLISHED` | `domain::definitions` | publish 引用 draft/deprecated/retired/superseded | 否 | HTTP 422 / RPC `FAILED_PRECONDITION` |
| `METHOD_CONTENT_NOT_FOUND` | `application::query` / repository | content 不存在 | 否 | HTTP 404 / RPC `NOT_FOUND` |
| `CONTENT_VERSION_NOT_FOUND` | `application::query` | 指定版本不存在 | 否 | HTTP 404 / RPC `NOT_FOUND` |
| `SNAPSHOT_NOT_FOUND` | `application::sync` | snapshot metadata 不存在 | 否 | HTTP 404 / RPC `NOT_FOUND` |
| `LIFECYCLE_TRANSITION_NOT_ALLOWED` | `domain::content` | 非法 lifecycle 迁移 | 否 | HTTP 409 / RPC `FAILED_PRECONDITION` |
| `PUBLISHED_CONTENT_IMMUTABLE` | `domain::content` | 原地修改 published 核心字段 | 否 | HTTP 409 / RPC `FAILED_PRECONDITION` |
| `REVISION_CONFLICT` | `application` / repository | expected_revision 不匹配 | 否,需重新读取 | HTTP 412 / RPC `ABORTED` |
| `CONTENT_VERSION_CONFLICT` | `application` / repository | 同 family/version 重复发布 | 否,需改 version | HTTP 409 / RPC `ALREADY_EXISTS` |
| `SUPERSEDE_CONFLICT` | `application` / repository | old_content 已被替代或替代链冲突 | 否 | HTTP 409 / RPC `ALREADY_EXISTS` |
| `IDEMPOTENCY_CONFLICT` | `application` | 同 key 不同 request_hash | 否 | HTTP 409 / RPC `ALREADY_EXISTS` |
| `IDEMPOTENCY_STATUS_CONFLICT` | `application` | 幂等记录状态非法推进 | 否 | HTTP 409 / RPC `FAILED_PRECONDITION` |
| `PUBLISH_GATE_REQUIRED` | `application::command_services` | publish / supersede 缺 gate ref | 否 | HTTP 424 / RPC `FAILED_PRECONDITION` |
| `PUBLISH_GATE_INVALID` | `application::command_services` / `GovernancePort` | gate 不存在、过期、target mismatch 或未批准 | 视原因 | HTTP 424 / RPC `FAILED_PRECONDITION` |
| `GOVERNANCE_UNAVAILABLE` | `infra::outbound_adapters` | governance 查询不可用 | 是 | HTTP 503 / RPC `UNAVAILABLE` |
| `FINGERPRINT_BUILD_FAILED` | `domain::policies` / support port | canonical serialization 或 hash 失败 | 否,需修数据/代码 | HTTP 500 / RPC `INTERNAL` |
| `FINGERPRINT_MISMATCH` | `application::operations_services` | 对账发现 fingerprint 不一致 | 否,需 resync/人工确认 | HTTP 409 / RPC `FAILED_PRECONDITION` |
| `SNAPSHOT_BUILD_FAILED` | `application::sync_services` | snapshot 构造或 metadata 写入失败 | 视原因 | HTTP 500 / RPC `INTERNAL` |
| `OBJECT_STORAGE_UNAVAILABLE` | `infra::outbound_adapters` | snapshot payload 读写外部存储失败 | 是 | HTTP 503 / RPC `UNAVAILABLE` |
| `BUS_PUBLISH_FAILED` | `infra::outbound_adapters` | L0-bus publish 失败 | 是 | Event retry / Job failure / HTTP 503 if synchronous |
| `OUTBOX_STATUS_CONFLICT` | `application::sync_services` | outbox 状态非法推进或 claim 冲突 | 是或跳过 | worker retry / metric |
| `OUTBOX_EVENT_INVALID` | `application::sync_services` | outbox payload 不可发布 | 需人工 | dead-letter |
| `PROJECTION_NOT_READY` / `STALE_PROJECTION` | `application::query_services` | 投影未准备或落后 | 是 | HTTP 503 or 200 with stale marker,按接口定义 |
| `PROJECTION_UPDATE_FAILED` | `application::operations_services` | rebuild/upsert projection 失败 | 是 | Job `Failed` / checkpoint 不推进 |
| `CHECKPOINT_CONFLICT` | `application::operations_services` | 多 worker 推进同一 checkpoint | 是 | Job retry / skip |
| `JOB_REQUEST_INVALID` | `application::operations_services` | job 参数、scope、dry_run 写入非法 | 否 | HTTP 400 / RPC `INVALID_ARGUMENT` |
| `JOB_STATUS_CONFLICT` | `application::operations_services` | job_run 状态非法推进 | 否 | HTTP 409 / RPC `FAILED_PRECONDITION` |
| `JOB_DRY_RUN_WRITE_FORBIDDEN` | `application::operations_services` | dry_run 试图写 truth/checkpoint | 否 | HTTP 409 / RPC `FAILED_PRECONDITION` |
| `PERSISTENCE_UNAVAILABLE` / `TRANSACTION_COMMIT_FAILED` | `infra::persistence` | DB 不可用或提交失败 | 是 | HTTP 503 / RPC `UNAVAILABLE` |
| `P1_FEATURE_DISABLED` | `application` / feature flag | P1 endpoint 未启用 | 否 | HTTP 404 / RPC `NOT_FOUND` |

### 7.3 HTTP / RPC / Event / Job 映射表

| 内部错误 | HTTP 映射 | RPC 映射 | Event / Job 映射 | 调用方应如何处理 |
|---|---|---|---|---|
| Protocol / gateway / missing idempotency | 400 | `INVALID_ARGUMENT` | JobRequest invalid -> failed | 修正请求 |
| Not found | 404 | `NOT_FOUND` | replay 找不到 cursor -> failed | 确认 ID 或重新同步 |
| Revision conflict | 412 | `ABORTED` | job item conflict -> partial/failed | 重新读取最新 revision |
| Lifecycle / immutable / idempotency conflict | 409 | `FAILED_PRECONDITION` / `ALREADY_EXISTS` | 不重试原请求 | 按当前状态重发合法命令 |
| Boundary / reference semantic error | 422 | `FAILED_PRECONDITION` | inbound malformed -> dead-letter | 修正 definition 或引用 |
| Publish gate error | 424 | `FAILED_PRECONDITION` / `UNAVAILABLE` | job publish item failed | 补 gate 或等待 governance 恢复 |
| Local construction error | 500 | `INTERNAL` | job failed | 修复代码、canonical 或 snapshot 构造问题 |
| External dependency unavailable | 503 | `UNAVAILABLE` | retry / dead-letter | 按 retry policy 重试 |
| Projection stale | 503 或带 stale marker 的 200 | `UNAVAILABLE` 或正常响应附 consistency | job checkpoint 不推进 | 触发 rebuild 或读强一致源 |
| Bus publish failed | 不适用于已提交 Command | worker failure | outbox retry / dead-letter | relay retry 或 replay |

### 7.4 异常分支处理表

| 场景 | 检测位置 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|---|
| DTO / Gateway headers 缺失 | API handler | 返回 400,不进入 application service | 不写业务 audit;写 access log / metric |
| command 缺幂等键 | API handler / application service | 返回 `IDEMPOTENCY_KEY_REQUIRED` | 不写业务 audit |
| payload/kind 不匹配 | `MethodContent::create_draft` / validation service | 回滚事务,返回 422 | 不写 lifecycle history/outbox;可写失败 log |
| boundary violation | `BoundaryGuard` | 回滚事务,返回 422 | 不写 truth/outbox;可写失败 audit/log |
| content not found | repository / query service | 返回 404 | Query 不写 audit;Command 可写失败 log |
| revision conflict | repository save | 回滚事务,返回 412 | 不写 lifecycle history/outbox |
| lifecycle illegal transition | domain lifecycle method | 回滚事务,返回 409 | 不写 lifecycle history/outbox |
| published immutable violation | domain aggregate | 回滚事务,返回 409 | 不写 lifecycle history/outbox |
| gate required / invalid | `PublishGovernanceService` | publish 不提交,返回 424 | 可写失败 audit/log,不写 outbox |
| governance unavailable | `GovernancePort` | publish 不提交,返回 503 | 可写 failure metric,不写 outbox |
| reference not published | `ReferenceValidationService` | publish 不提交,返回 422 | 不写 outbox |
| fingerprint build failed | `FingerprintHasher` / canonical builder | publish 不提交,返回 500 | 可写 failure audit/log |
| snapshot payload write failed | `ObjectStoragePort` | publish 不提交,返回 503/500 | 不写 outbox;orphan blob 后续清理 |
| outbox append failed | `OutboxRepository.append` | 回滚业务事务 | 不写 published truth |
| transaction commit failed | `UnitOfWorkTx.commit` | 返回 503/500,本地事务视为失败 | 不写成功 audit/outbox;记录 error log |
| bus publish failed | `BusPublisherPort.publish` | 已提交 truth 不回滚;mark retryable failure | 写 outbox failure status / metric |
| outbox payload invalid | relay | 标记 dead-letter 或 failure | 写 dead-letter / operations log |
| projection rebuild failed | projection repository | job failed/partial,checkpoint 不推进 | 写 job result / failure_reason |
| query projection stale | query service | 返回 stale marker 或 `STALE_PROJECTION` | 不写库;写 metric |
| inbound event malformed | event consumer | 不改 truth,写 dead-letter | 写 inbound dead-letter |
| duplicate inbound event | idempotency repository | 同 hash 跳过或返回 ack | 不重复写 projection |
| job dry_run 写 truth | job service guard | 阻断,返回 `JOB_DRY_RUN_WRITE_FORBIDDEN` | 写 job failure,不写 truth |

### 7.5 恢复口径表

| 错误 / 场景 | 恢复责任方 | 恢复方式 | 是否自动 |
|---|---|---|---|
| validation / payload / boundary | 调用方 / 方法作者 | 修正请求内容后重新提交 | 否 |
| lifecycle illegal | 调用方 / maintainer | 读取当前状态,选择合法 Command | 否 |
| revision conflict | 调用方 | 重新读取最新 revision 后重试 | 否,由调用方决定 |
| idempotency same key different hash | 调用方 | 使用新的 idempotency key | 否 |
| gate missing / invalid | maintainer / governance | 申请或更新 approved gate | 否 |
| governance unavailable | 平台 / 调用方 | 等待外部依赖恢复后重试 | 可按调用方策略重试 |
| object storage unavailable | 平台运维 | 修复 storage 后重试 publish/export | 可重试 |
| snapshot hash mismatch | 平台运维 | 停止返回 payload,重建 snapshot 或修复 storage | 人工介入 |
| bus publish failed | worker / operations | outbox retry,超过阈值 dead-letter | 自动优先 |
| outbox dead-letter | operations | 修复 payload/依赖后 replay | 人工介入 |
| downstream missed event | downstream / operations | `ReplayDefinitionEvents` 或 snapshot resync | 可自动触发 |
| fingerprint mismatch | maintainer / operations | `RecalculateFingerprint(dry_run=true)` 形成报告,再决定 resync 或修复 | 人工确认 |
| projection stale/rebuild failed | operations | `RebuildReadModels` 从 write model / outbox 重建 | 可自动或人工 |
| job partial failure | operations | 按 `next_cursor` / failure report resume | 半自动 |
| persistence unavailable | platform | 等 DB 恢复后重试未提交请求 | 可重试 |

### 7.6 审计、日志、事件记录规则

| 场景 | lifecycle history | business audit | outbox event | dead-letter / checkpoint | structured log / metric |
|---|---:|---:|---:|---:|---:|
| 成功 create/update/submit | 视 lifecycle 是否变化 | 是 | 默认否 | 否 | 是 |
| 成功 publish/deprecate/retire/supersede | 是 | 是 | 是 | 否 | 是 |
| validation / boundary 失败 | 否 | 可选失败 audit | 否 | 否 | 是 |
| lifecycle illegal | 否 | 可选失败 audit | 否 | 否 | 是 |
| gate invalid / unavailable | 否 | 可选失败 audit | 否 | 否 | 是 |
| transaction rollback | 否 | 否 | 否 | 否 | 是 |
| bus publish failed | 否 | 否 | 否 | outbox failure status | 是 |
| inbound event failure | 否 | 可选 | 否 | inbound dead-letter | 是 |
| job failed / partial | 否 | job audit 可选 | 仅按 job 语义 | job_run / checkpoint | 是 |
| query not found / stale | 否 | 否 | 否 | 否 | 是 |

规则说明：

- `business audit` 不能替代 lifecycle history。
- 失败 audit 如果实现,必须标记 `result=failed`,不能写成状态变化成功。
- outbox event 只记录业务变化事实,不能记录普通失败请求。

### 7.7 错误处理红线

| 红线 | 说明 |
|---|---|
| 不允许捕获异常后返回成功 | 除非已有明确幂等成功结果 |
| 不允许 validation / boundary 失败后留下半条 MethodContent | 失败必须回滚 |
| 不允许无 gate 发布或先发布后补 gate | gate 是 publish 前置条件 |
| 不允许 snapshot 失败后生成 published snapshot_ref | snapshot 必须可读取或 publish 失败 |
| 不允许 bus 失败回滚已提交 truth | 通过 outbox retry / replay 恢复 |
| 不允许 replay 创造新的业务 event_id | replay 必须复用原 event_id |
| 不允许 fingerprint mismatch 自动改 published fingerprint | 必须先 dry_run 报告和治理确认 |
| 不允许 projection rebuild 反写 write model | projection 非 truth |
| 不允许 Query 为了恢复数据而写库 | 恢复走 Command 或 Operations Job |

---

## 8. 回填草稿

可直接回填到 `03-详细设计.md` 的起草结构：

````md
## 11. 错误模型、异常分支与恢复口径

### 11.1 错误响应与内部错误模型

```json
{
  "request_id": "REQ-100",
  "error": {
    "code": "REVISION_CONFLICT",
    "message": "expected revision does not match",
    "retryable": false,
    "target": {},
    "details": {},
    "trace_id": "TRACE-100",
    "recovery_hint": "reload and retry"
  }
}
```

### 11.2 错误类型表

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|

### 11.3 HTTP / RPC / Event / Job 映射表

| 内部错误 | HTTP 映射 | RPC 映射 | Event / Job 映射 | 调用方应如何处理 |
|---|---|---|---|---|

### 11.4 异常分支处理表

| 场景 | 检测位置 | 处理方式 | 是否写审计 / 事件 |
|---|---|---|---|

### 11.5 恢复口径表

| 错误 / 场景 | 恢复责任方 | 恢复方式 | 是否自动 |
|---|---|---|---|

### 11.6 审计、日志、事件记录规则

| 场景 | lifecycle history | business audit | outbox event | dead-letter / checkpoint | structured log / metric |
|---|---:|---:|---:|---:|---:|

### 11.7 错误处理红线

| 红线 | 说明 |
|---|---|
````

---

## 9. 待确认事项

- 失败 Command 是否第一版落 `AuditRecord(result=failed)`。当前建议可选,但必须至少有 structured log / metric。
- `PROJECTION_NOT_READY` 是返回 HTTP 503,还是 200 附 `consistency.stale=true`。当前建议按 Query 的强一致要求区分。
- `SNAPSHOT_BUILD_FAILED` 细分为本地构造失败和 object storage 写失败是否在代码中拆 enum。当前建议内部拆分,对外可归一映射。
- `OutboxEvent.mark_retryable_failure(...)` 与 Step 10 的 `RetryableFailed` 命名是否在正式文档统一为 `retryable_failed`。

---

## 10. 进入下一步条件

- 模块级错误类型已经确认。
- HTTP / RPC / Event / Job 映射已经确认。
- 可重试、不可重试、人工介入的恢复口径已经确认。
- 事务失败、并发冲突、重复请求、外部依赖失败的处理方式已经确认。
- 审计、日志、outbox、dead-letter、checkpoint 的记录规则已经确认。
- 可以进入 Step 13 定义并发、幂等与重入保护。
