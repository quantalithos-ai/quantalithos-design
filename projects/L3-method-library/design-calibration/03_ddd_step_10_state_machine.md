# Step 10. 定义状态机与转换矩阵

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 10
- 回填章节：`03-详细设计.md` §9 状态机与转换矩阵

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| 概要设计状态轮廓 | `MethodContentLifecycle`、`OutboxEventStatus`、P1 `PluginLifecycle` / `ConfigurationLifecycle` |
| Step 6 对象契约 | 已确认 `MethodContentLifecycle`、`OutboxStatus`、`IdempotencyStatus`、P1 lifecycle 的对象归属 |
| Step 9 处理流 | 已确认 create / update / submit / publish / deprecate / retire / supersede、outbox relay、job 处理流 |
| 旧 `03-详细设计.md` §7 | 已有 MethodContent 生命周期状态机,但需要按新版 §9 归并并补实现可靠性状态 |

已确认结论：

```text
Step 10 定义状态机,不展开数据库表、锁、事务实现。
P0 正式状态机包括 MethodContentLifecycle、OutboxStatus、IdempotencyStatus、JobRunStatus。
MethodContentLifecycle 是业务状态机。
OutboxStatus、IdempotencyStatus、JobRunStatus 是实现可靠性状态机,不能混入 MethodContent lifecycle。
P1 PluginLifecycle / ConfigurationLifecycle 本轮只保留后置索引和边界,不进入 P0 完整转换矩阵。
```

依赖的前序 Step：

```text
Step 1~9 已确认上游输入、范围、runtime、文件布局、模块契约、对象契约、port 契约、协议契约和逐接口处理流。
```

---

## 3. SOP 问题回答

1. 当前仓有哪些正式状态机？

   回答：P0 正式展开 4 类状态机：`LifecycleState` / `MethodContentLifecycle`、`OutboxStatus`、`IdempotencyStatus`、`JobRunStatus`。其中 `MethodContentLifecycle` 是 Definition truth 的业务生命周期；其他 3 类是可靠执行状态,分别支撑 outbox relay、幂等去重和 operations job。

2. 每个状态机的状态集合是什么？

   回答：`LifecycleState` 包含 `Draft / InReview / Published / Deprecated / Retired / Superseded`。`OutboxStatus` 包含 `Pending / Publishing / Published / RetryableFailed / DeadLettered`。`IdempotencyStatus` 包含 `Processing / Succeeded / Failed`。`JobRunStatus` 包含 `Running / Succeeded / PartiallySucceeded / Failed`。

3. 哪些函数会触发状态转换？

   回答：`MethodContent` 的 create / submit / publish / deprecate / retire / mark_superseded_by 触发业务生命周期转换；`OutboxEvent.mark_in_progress / mark_published / mark_retryable_failure / mark_dead_lettered` 触发 outbox 状态转换；`IdempotencyRepository.try_begin / mark_completed / mark_failed` 触发幂等状态转换；`JobRunRepository.start / complete / fail / complete_with_partial_failure` 触发 job 状态转换。

4. 每个转换的前置条件、副作用和错误是什么？

   回答：本步在 7.3~7.6 的转换矩阵中逐项列出。业务生命周期转换必须校验 source state、revision、gate、fingerprint、reference 和 supersede 链；outbox 转换必须校验当前 relay 状态；幂等转换必须校验 key + request_hash；job 转换必须校验 job_run 是否仍在 running。

5. 非法转换应该返回什么错误，是否写审计？

   回答：业务 lifecycle 非法转换返回 `LIFECYCLE_TRANSITION_NOT_ALLOWED`,不写 audit/outbox。published 核心字段修改返回 `PUBLISHED_CONTENT_IMMUTABLE`。outbox 非法转换返回 `OUTBOX_STATUS_CONFLICT`。幂等冲突返回 `IDEMPOTENCY_CONFLICT`。job 非法转换返回 `JOB_STATUS_CONFLICT`。只有成功的业务生命周期变化才写 lifecycle history / audit；失败的 command 可写 error log / metric,但不写业务 audit。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `03-详细设计.md` §7 | 主要展开 `MethodContentLifecycle`,没有把 outbox / idempotency / job run 状态纳入同一章索引 | 实现者可能遗漏可靠性状态机 |
| 旧 §7 状态名 | 多使用持久化值 `draft / in_review` | Rust enum 变体、JSON / DB 值之间的映射不够明确 |
| 旧 §7.3 | 状态图覆盖业务生命周期,但没有写每条转换的触发函数完整签名 | 难以直接写 `can_transition_to` 和 domain method 测试 |
| Step 9 | 已写处理流状态变化,但状态校验规则分散在各 flow | 需要集中成转换矩阵,供代码复用 |
| P1 状态 | `PluginLifecycle` / `ConfigurationLifecycle` 旧文档存在不同写法 | 本轮 P0 校准中不能把 P1 状态误写成已收稳完整契约 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 状态机范围 | 重点只有 MethodContent lifecycle | P0 展开业务状态机 + 可靠性状态机 | 详细设计需要支撑 outbox、job、幂等实现 |
| 状态命名 | 表格多写 `draft / published` | 同时写 `LifecycleState::Draft` 和 persisted value `draft` | Rust 实现和协议 / DB 映射都清楚 |
| 转换矩阵 | 合法迁移列表 + 部分非法迁移 | 每个状态机都有 From / To / 触发函数 / 前置条件 / 副作用 / 错误 | 可直接实现状态校验和测试 |
| 非法转换 | 主要覆盖 lifecycle | 覆盖 lifecycle、outbox、idempotency、job_run | 避免可靠性状态被任意推进 |
| P1 状态 | 旧文档中有分散描述 | 本步只保留 P1 后置索引,不写完整矩阵 | 保持 P0 / P1 边界 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只定义 MethodContentLifecycle | 简洁 | outbox / idempotency / job 状态仍需实现者猜 | 不采用 |
| 把所有状态都混入一个全局状态机 | 看似统一 | 会把业务生命周期和执行可靠性混淆 | 不采用 |
| 按状态机分别定义,并标注业务 / 可靠性边界 | 语义清楚,可测试 | 文档稍长 | 采用 |
| P1 Plugin / Configuration 完整展开 | 后续可直接实现 P1 | 当前 P0 校准范围膨胀,且 P1 状态尚未完全收稳 | 不采用 |
| P1 只保留后置索引 | 保持 P0 闭环 | 后续 P1 需要单独补矩阵 | 采用 |

---

## 7. 结构化中间产物

### 7.1 状态机总表

| 状态机 | 类型 | 所属对象 | Rust enum / value object | 覆盖范围 | 是否 P0 展开 |
|---|---|---|---|---|---|
| MethodContent 生命周期 | 业务状态机 | `MethodContent` / `MethodContentLifecycle` | `LifecycleState` / `MethodContentLifecycle` | definition 从 draft 到 published / retired / superseded | 是 |
| Outbox 发布状态 | 可靠事件状态机 | `OutboxEvent` | `OutboxStatus` | 本地 outbox event 从 pending 到 published / dead-letter | 是 |
| 幂等处理状态 | 可靠请求状态机 | `IdempotencyRecord` | `IdempotencyStatus` | command / job / inbound event 去重处理状态 | 是 |
| Job 运行状态 | 运维任务状态机 | `JobRun` / `JobRunRecord` | `JobRunStatus` | seed / replay / recalculate / rebuild job 的运行结果 | 是 |
| Plugin 生命周期 | P1 后置业务状态机 | `MethodPlugin` | `PluginLifecycle` | P1 package 发布与退役 | 否,只索引 |
| Configuration 生命周期 | P1 后置业务状态机 | `MethodConfiguration` | `ConfigurationLifecycle` | P1 configuration 激活与替换 | 否,只索引 |

### 7.2 P0 状态机关系图

```text
[MethodContentLifecycle]
  business truth state
  Draft -> InReview -> Published -> Deprecated / Retired / Superseded
        |
        | publish / deprecate / retire / supersede append outbox
        v
[OutboxStatus]
  reliable event state
  Pending -> Publishing -> Published
                  |
                  v
             RetryableFailed -> Pending
                  |
                  v
             DeadLettered

[IdempotencyStatus]
  request execution guard
  Processing -> Succeeded
       |
       v
    Failed

[JobRunStatus]
  operations execution state
  Running -> Succeeded / PartiallySucceeded / Failed
```

关键说明：

- `MethodContentLifecycle` 是唯一业务生命周期真相。
- `OutboxStatus` 不表达 definition 是否 published,只表达事件是否已发出。
- `IdempotencyStatus` 不表达 command 成功后的业务状态,只表达同一请求是否已处理。
- `JobRunStatus` 不替代 job 内部处理对象的状态,只记录 job 运行结果。

### 7.3 `LifecycleState` / `MethodContentLifecycle`

#### 7.3.1 状态集合表

| Rust enum variant | persisted / JSON value | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|---|
| `LifecycleState::Draft` | `draft` | 草稿定义,可修改但不能被下游作为权威引用 | 否 | update_draft / submit_for_review |
| `LifecycleState::InReview` | `in_review` | 已提交评审,等待 gate 或发布动作 | 否 | publish |
| `LifecycleState::Published` | `published` | 已发布权威 definition,默认可被新增引用 | 否 | deprecate / retire / supersede / query / snapshot |
| `LifecycleState::Deprecated` | `deprecated` | 已弃用,历史可追溯,默认不允许新增引用 | 否 | retire / supersede / query / trace |
| `LifecycleState::Retired` | `retired` | 已退役,只保留追溯 | 是 | query / trace only |
| `LifecycleState::Superseded` | `superseded` | 已被新 definition 替代,必须保留替代链 | 是 | query / trace only |

#### 7.3.2 状态转换图

```text
MethodContent::create_draft(...)
        |
        v
 LifecycleState::Draft
        |
        | call MethodContent.submit_for_review(ActorContext actor, Timestamp now)
        v
 LifecycleState::InReview
        |
        | call MethodContent.publish(ApprovedGateRef gate_ref,
        |                            ContentVersion version,
        |                            CanonicalFingerprint fingerprint,
        |                            ActorContext actor,
        |                            Timestamp now)
        v
 LifecycleState::Published
     |              |               |
     |              |               |
     |              |               +-- call MethodContent.mark_superseded_by(...)
     |              |                       v
     |              |                LifecycleState::Superseded
     |              |
     |              +-- call MethodContent.retire(...)
     |                       v
     |                LifecycleState::Retired
     |
     +-- call MethodContent.deprecate(...)
              v
       LifecycleState::Deprecated
          |             |
          |             +-- call MethodContent.mark_superseded_by(...)
          |                     v
          |              LifecycleState::Superseded
          |
          +-- call MethodContent.retire(...)
                  v
           LifecycleState::Retired
```

关键说明：

- 第一版不支持 `InReview -> Draft` 驳回流；如后续引入,必须新增明确 review decision command。
- `Draft -> Published` 不允许,必须先 `submit_for_review` 后 `publish`。
- `Retired` 和 `Superseded` 是终态,不能恢复。

#### 7.3.3 转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| none | `LifecycleState::Draft` | `MethodContent::create_draft(ContentId content_id, ContentFamilyId content_family_id, MethodContentKind kind, String name, Option<String> description, MethodContentPayload payload, ActorContext actor, Timestamp now)` | kind / payload 匹配;payload 未混入 Use truth | 初始化 lifecycle、revision、created_at | `PAYLOAD_KIND_MISMATCH` / `BOUNDARY_VIOLATION` |
| `LifecycleState::Draft` | `LifecycleState::Draft` | `MethodContent.update_draft(String name, Option<String> description, MethodContentPayload payload, ActorContext actor, Timestamp now)` | 当前为 draft;expected revision 匹配 | 更新 payload / references / updated_at / revision | `PUBLISHED_CONTENT_IMMUTABLE` / `LIFECYCLE_TRANSITION_NOT_ALLOWED` |
| `LifecycleState::Draft` | `LifecycleState::InReview` | `MethodContent.submit_for_review(ActorContext actor, Timestamp now)` | 当前为 draft;payload / boundary 校验通过 | 写 lifecycle history / audit | `LIFECYCLE_TRANSITION_NOT_ALLOWED` |
| `LifecycleState::InReview` | `LifecycleState::Published` | `MethodContent.publish(ApprovedGateRef gate_ref, ContentVersion version, CanonicalFingerprint fingerprint, ActorContext actor, Timestamp now)` | gate 有效;version / fingerprint 存在;refs 均为 published | 固定 version / fingerprint / gate;写 snapshot / audit / outbox | `PUBLISH_GATE_INVALID` / `FINGERPRINT_BUILD_FAILED` / `REFERENCE_NOT_PUBLISHED` |
| `LifecycleState::Published` | `LifecycleState::Deprecated` | `MethodContent.deprecate(String reason, ActorContext actor, Timestamp now)` | reason 非空;当前为 published | 写 lifecycle history / audit / deprecated event | `LIFECYCLE_TRANSITION_NOT_ALLOWED` |
| `LifecycleState::Published` | `LifecycleState::Retired` | `MethodContent.retire(String reason, ActorContext actor, Timestamp now)` | reason 非空;当前为 published | 写 lifecycle history / audit / retired event | `LIFECYCLE_TRANSITION_NOT_ALLOWED` |
| `LifecycleState::Deprecated` | `LifecycleState::Retired` | `MethodContent.retire(String reason, ActorContext actor, Timestamp now)` | reason 非空;当前为 deprecated | 写 lifecycle history / audit / retired event | `LIFECYCLE_TRANSITION_NOT_ALLOWED` |
| `LifecycleState::Published` | `LifecycleState::Superseded` | `MethodContent.mark_superseded_by(ContentId next_content_id, String reason, ActorContext actor, Timestamp now)` | next_content_id 存在;kind 一致;新 definition 将被发布 | 设置 superseded_by_content_id;写 audit / lifecycle event | `SUPERSEDE_TARGET_REQUIRED` / `SUPERSEDE_KIND_MISMATCH` |
| `LifecycleState::Deprecated` | `LifecycleState::Superseded` | `MethodContent.mark_superseded_by(ContentId next_content_id, String reason, ActorContext actor, Timestamp now)` | next_content_id 存在;kind 一致;新 definition 将被发布 | 设置 superseded_by_content_id;写 audit / lifecycle event | `SUPERSEDE_TARGET_REQUIRED` / `SUPERSEDE_KIND_MISMATCH` |

#### 7.3.4 非法转换处理表

| 非法转换 / 操作 | 原因 | 错误 | 是否写 audit / outbox |
|---|---|---|---|
| `Draft -> Published` | 绕过 review / gate | `LIFECYCLE_TRANSITION_NOT_ALLOWED` | 否 |
| `Draft -> Retired` | 未发布内容没有 retire 语义 | `LIFECYCLE_TRANSITION_NOT_ALLOWED` | 否 |
| `InReview -> Deprecated` | 未发布内容不能弃用 | `LIFECYCLE_TRANSITION_NOT_ALLOWED` | 否 |
| `Published -> Draft` | published 是权威历史,不能回退 | `LIFECYCLE_TRANSITION_NOT_ALLOWED` | 否 |
| `Deprecated -> Published` | deprecated 后不能重新成为新增引用源 | `LIFECYCLE_TRANSITION_NOT_ALLOWED` | 否 |
| `Retired -> any` | retired 是终态 | `LIFECYCLE_TRANSITION_NOT_ALLOWED` | 否 |
| `Superseded -> any` | superseded 是终态 | `LIFECYCLE_TRANSITION_NOT_ALLOWED` | 否 |
| 修改 published payload / refs / version / fingerprint / gate | 破坏下游对账和 snapshot 一致性 | `PUBLISHED_CONTENT_IMMUTABLE` | 否 |

### 7.4 `OutboxStatus`

#### 7.4.1 状态集合表

| Rust enum variant | persisted / JSON value | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|---|
| `OutboxStatus::Pending` | `pending` | 事件已在本地事务内写入,等待 relay | 否 | mark_in_progress |
| `OutboxStatus::Publishing` | `publishing` | relay 正在发布事件 | 否 | mark_published / mark_retryable_failure |
| `OutboxStatus::Published` | `published` | 事件已成功发布到 L0-bus | 是 | query / trace |
| `OutboxStatus::RetryableFailed` | `retryable_failed` | 发布失败但可重试 | 否 | retry to pending / mark_dead_lettered |
| `OutboxStatus::DeadLettered` | `dead_lettered` | 多次失败后进入人工处理队列 | 是 | query / operations recovery only |

#### 7.4.2 状态转换图

```text
OutboxEvent::new_pending(...)
        |
        v
OutboxStatus::Pending
        |
        | call OutboxEvent.mark_in_progress(Timestamp now)
        v
OutboxStatus::Publishing
   |                 |
   |                 | call OutboxEvent.mark_retryable_failure(FailureReason reason,
   |                 |                                        Option<Timestamp> next_retry_at)
   |                 v
   |          OutboxStatus::RetryableFailed
   |                 |             |
   |                 | retry due   | retry limit exceeded
   |                 v             v
   |          OutboxStatus::Pending  OutboxStatus::DeadLettered
   |
   | call OutboxEvent.mark_published(Timestamp now)
   v
OutboxStatus::Published
```

#### 7.4.3 转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| none | `OutboxStatus::Pending` | `OutboxEvent::new_pending(DefinitionEventEnvelope envelope, PayloadHash payload_hash, IdempotencyKey key, Timestamp now)` | event envelope 合法;payload_hash 存在 | outbox record 可被 relay 扫描 | `OUTBOX_EVENT_INVALID` |
| `OutboxStatus::Pending` | `OutboxStatus::Publishing` | `OutboxEvent.mark_in_progress(Timestamp now)` | 当前 pending;未被其他 worker 锁定 | 记录 publish_started_at / attempt_count | `OUTBOX_STATUS_CONFLICT` |
| `OutboxStatus::Publishing` | `OutboxStatus::Published` | `OutboxEvent.mark_published(Timestamp now)` | bus ack 成功 | 记录 published_at | `OUTBOX_STATUS_CONFLICT` |
| `OutboxStatus::Publishing` | `OutboxStatus::RetryableFailed` | `OutboxEvent.mark_retryable_failure(FailureReason reason, Option<Timestamp> next_retry_at)` | bus 发布失败且未超过重试上限 | 记录 failure_reason / next_retry_at | `OUTBOX_STATUS_CONFLICT` |
| `OutboxStatus::RetryableFailed` | `OutboxStatus::Pending` | `OutboxEvent.retry_after_due(Timestamp now)` | now >= next_retry_at | 允许下一轮 relay | `OUTBOX_RETRY_NOT_DUE` |
| `OutboxStatus::RetryableFailed` | `OutboxStatus::DeadLettered` | `OutboxEvent.mark_dead_lettered(FailureReason reason, Timestamp now)` | 超过重试上限或人工转入 | 记录 dead_letter_reason | `OUTBOX_STATUS_CONFLICT` |

#### 7.4.4 非法转换处理表

| 非法转换 / 操作 | 原因 | 错误 | 是否写 audit / outbox |
|---|---|---|---|
| `Pending -> Published` | 绕过 publishing 锁定 | `OUTBOX_STATUS_CONFLICT` | 否 |
| `Published -> Pending` | 已发布事件不可重新进入待发布状态 | `OUTBOX_STATUS_CONFLICT` | 否 |
| `DeadLettered -> Published` | dead letter 必须人工恢复或重新 replay | `OUTBOX_STATUS_CONFLICT` | 否 |
| 在 relay 中构造新业务事件 | 破坏 outbox 可靠发布边界 | `OUTBOX_EVENT_INVALID` | 否 |

### 7.5 `IdempotencyStatus`

#### 7.5.1 状态集合表

| Rust enum variant | persisted / JSON value | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|---|
| `IdempotencyStatus::Processing` | `processing` | 请求已开始处理,结果尚未确定 | 否 | mark_completed / mark_failed |
| `IdempotencyStatus::Succeeded` | `succeeded` | 请求已成功完成,可返回既有 result_ref | 是 | get result |
| `IdempotencyStatus::Failed` | `failed` | 请求已失败并记录失败结果 | 是 | get failure / manual recovery |

#### 7.5.2 状态转换图

```text
IdempotencyRepository.try_begin(...)
        |
        v
IdempotencyStatus::Processing
      |                   |
      | call mark_completed(...)
      v                   | call mark_failed(...)
IdempotencyStatus::Succeeded
                          v
                 IdempotencyStatus::Failed
```

#### 7.5.3 转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| none | `IdempotencyStatus::Processing` | `IdempotencyRepository.try_begin(UnitOfWorkTx tx, IdempotencyKey key, IdempotencyScope scope, RequestHash request_hash)` | key 不存在 | 创建 processing record | `IDEMPOTENCY_CONFLICT` |
| `IdempotencyStatus::Processing` | `IdempotencyStatus::Succeeded` | `IdempotencyRepository.mark_completed(UnitOfWorkTx tx, IdempotencyKey key, ResultRef response_ref)` | 当前 processing;request_hash 匹配 | 保存 result_ref | `IDEMPOTENCY_STATUS_CONFLICT` |
| `IdempotencyStatus::Processing` | `IdempotencyStatus::Failed` | `IdempotencyRepository.mark_failed(UnitOfWorkTx tx, IdempotencyKey key, FailureReason reason)` | 当前 processing;request_hash 匹配 | 保存 failure reason | `IDEMPOTENCY_STATUS_CONFLICT` |

#### 7.5.4 非法转换处理表

| 非法转换 / 操作 | 原因 | 错误 | 是否写 audit / outbox |
|---|---|---|---|
| 同 key 不同 request_hash | 可能复用了幂等键表达不同业务请求 | `IDEMPOTENCY_CONFLICT` | 否 |
| `Succeeded -> Processing` | 已成功请求不能重新执行 | `IDEMPOTENCY_STATUS_CONFLICT` | 否 |
| `Failed -> Processing` | 第一版不自动重试同一幂等记录 | `IDEMPOTENCY_STATUS_CONFLICT` | 否 |
| 缺少 command / job 幂等键 | 无法保证重入保护 | `IDEMPOTENCY_KEY_REQUIRED` | 否 |

### 7.6 `JobRunStatus`

#### 7.6.1 状态集合表

| Rust enum variant | persisted / JSON value | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|---|
| `JobRunStatus::Running` | `running` | job 已开始执行 | 否 | complete / complete_with_partial_failure / fail |
| `JobRunStatus::Succeeded` | `succeeded` | job 全部处理成功 | 是 | query result |
| `JobRunStatus::PartiallySucceeded` | `partially_succeeded` | job 部分成功,部分失败可后续恢复 | 是 | query result / resume with new run |
| `JobRunStatus::Failed` | `failed` | job 未完成且需要恢复或人工处理 | 是 | query result / retry with new run |

#### 7.6.2 状态转换图

```text
JobRunRepository.start(JobRun job_run)
        |
        v
JobRunStatus::Running
     |             |                 |
     | complete    | partial         | fail
     v             v                 v
Succeeded   PartiallySucceeded      Failed
```

#### 7.6.3 转换矩阵

| From | To | 触发函数 | 前置条件 | 副作用 | 非法时错误 |
|---|---|---|---|---|---|
| none | `JobRunStatus::Running` | `JobRunRepository.start(UnitOfWorkTx tx, JobRun job_run)` | job_name / scope / idempotency key 合法 | 创建 job_run record | `JOB_REQUEST_INVALID` |
| `JobRunStatus::Running` | `JobRunStatus::Succeeded` | `JobRunRepository.complete(UnitOfWorkTx tx, JobRunId job_run_id, JobResult result)` | 全部 batch 成功;checkpoint 已推进 | 保存 result summary | `JOB_STATUS_CONFLICT` |
| `JobRunStatus::Running` | `JobRunStatus::PartiallySucceeded` | `JobRunRepository.complete_with_partial_failure(UnitOfWorkTx tx, JobRunId job_run_id, JobResult result, FailureReason reason)` | 部分 batch 成功且有可恢复失败 | 保存 processed_count / failure_reason / next_cursor | `JOB_STATUS_CONFLICT` |
| `JobRunStatus::Running` | `JobRunStatus::Failed` | `JobRunRepository.fail(UnitOfWorkTx tx, JobRunId job_run_id, FailureReason reason)` | 无法继续执行或首批失败 | 保存 failure_reason | `JOB_STATUS_CONFLICT` |

#### 7.6.4 非法转换处理表

| 非法转换 / 操作 | 原因 | 错误 | 是否写 audit / outbox |
|---|---|---|---|
| `Succeeded -> Running` | 已完成 job 不可复用同一 run_id 重跑 | `JOB_STATUS_CONFLICT` | 否 |
| `Failed -> Succeeded` | 失败后必须新建 run 或走恢复流程 | `JOB_STATUS_CONFLICT` | 否 |
| `PartiallySucceeded -> Running` | resume 必须创建新 run 或显式恢复 run | `JOB_STATUS_CONFLICT` | 否 |
| dry_run 写入 MethodContent truth | dry_run 只允许产生 preview/report | `JOB_DRY_RUN_WRITE_FORBIDDEN` | 否 |

### 7.7 P1 后置状态索引

| 状态机 | 暂定状态 | 本轮边界 |
|---|---|---|
| `PluginLifecycle` | `Draft / Published / Deprecated / Retired` | 只允许引用 `PublishedContentRef`,不复制 P0 definition payload;完整矩阵留到 P1 plugin/configuration 设计 |
| `ConfigurationLifecycle` | `Draft / Active / Superseded / Retired` | 激活后只形成 effective content set,不反向修改 `MethodContent`;完整矩阵留到 P1 设计 |

### 7.8 状态机实现红线

| 红线 | 说明 |
|---|---|
| repository 不实现业务状态机 | repository 只能保存状态字段,不能决定 lifecycle 是否可迁移 |
| application service 不直接赋值 lifecycle_state | 必须调用 `MethodContent` / `MethodContentLifecycle` 成员函数 |
| Query 不改变任何状态 | Query 不推进 lifecycle、outbox、idempotency 或 job |
| OutboxStatus 不等于 MethodContentLifecycle | event published 只说明事件已发出,不说明 definition 状态 |
| IdempotencyStatus 不等于业务结果 | succeeded 只说明请求已处理成功,业务状态仍以 write model 为准 |
| JobRunStatus 不替代 checkpoint | job run 记录执行结果,checkpoint 记录可恢复位置 |

---

## 8. 回填草稿

可直接回填到 `03-详细设计.md` 的起草结构：

````md
## 9. 状态机与转换矩阵

### 9.1 状态机总表

| 状态机 | 类型 | 所属对象 | Rust enum / value object | 覆盖范围 | 是否 P0 展开 |
|---|---|---|---|---|---|

### 9.2 P0 状态机关系图

```text
[MethodContentLifecycle]
  business truth state
  Draft -> InReview -> Published -> Deprecated / Retired / Superseded

[OutboxStatus]
  reliable event state
  Pending -> Publishing -> Published

[IdempotencyStatus]
  request execution guard
  Processing -> Succeeded / Failed

[JobRunStatus]
  operations execution state
  Running -> Succeeded / PartiallySucceeded / Failed
```

### 9.3 MethodContentLifecycle

必须包含:
- 状态集合表
- 状态转换图
- 转换矩阵
- 非法转换处理表

### 9.4 OutboxStatus

必须包含:
- 状态集合表
- 状态转换图
- 转换矩阵
- 非法转换处理表

### 9.5 IdempotencyStatus

必须包含:
- 状态集合表
- 状态转换图
- 转换矩阵
- 非法转换处理表

### 9.6 JobRunStatus

必须包含:
- 状态集合表
- 状态转换图
- 转换矩阵
- 非法转换处理表

### 9.7 P1 后置状态索引

| 状态机 | 暂定状态 | 本轮边界 |
|---|---|---|

### 9.8 状态机实现红线

| 红线 | 说明 |
|---|---|
````

---

## 9. 待确认事项

- `OutboxStatus::DeadLettered` 是否第一版落库实现,还是先作为错误恢复预留状态。当前建议保留 enum 和文档,第一批实现可只在 retry limit 触发时写入。
- `IdempotencyStatus::Failed` 是否保存失败响应并对同 key 返回既有失败,还是允许同 key 重试。当前建议第一版不自动重试同一幂等记录。
- `JobRunStatus::PartiallySucceeded` 是否第一批需要。当前建议保留,因为 seed / replay / rebuild 都可能部分处理成功。
- `ConfigurationLifecycle` 使用 `Superseded / Retired` 还是旧文档中的 `Archived`。当前建议 P1 后续单独确认,本轮不落完整矩阵。

---

## 10. 进入下一步条件

- P0 状态机范围已经确认。
- `MethodContentLifecycle`、`OutboxStatus`、`IdempotencyStatus`、`JobRunStatus` 的状态集合和转换矩阵已经确认。
- 非法转换错误码和是否写 audit/outbox 已明确。
- P1 状态已明确为后置索引,不阻塞 P0。
- 可以进入 Step 11 定义持久化、事务与一致性契约。
