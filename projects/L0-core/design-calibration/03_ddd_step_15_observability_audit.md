# Step 15. 定义可观测性与审计埋点契约

> 本文件是 `projects/L0-core/03-详细设计.md` 的 Step 15 中间产物。
> 本步只收稳代码中必须记录的日志、指标、trace 和审计事件切口。
> 本步不写告警阈值,不写运维手册,不改写正式 `03-详细设计.md`。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填,本文件不替代正式详细设计。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 15
- 回填章节: `projects/L0-core/03-详细设计.md` §14 可观测性与审计埋点契约

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 8 协议契约 | Command / Query / Event / Job / Outbox relay | 固定埋点对象和操作名 |
| Step 9 函数级处理流 | 每个 flow 的入口、事务边界、错误映射和副作用 | 固定埋点位置 |
| Step 11 持久化、事务与一致性 | audit / outbox / projection / snapshot / reference / idempotency 写路径 | 固定审计记录边界 |
| Step 12 错误模型 | 可重试、不可重试、需人工介入的错误分类 | 固定日志级别和错误字段 |
| Step 13 并发、幂等与重入保护 | 幂等 replay、Conflict、rebuild、relay 重试 | 固定重复请求和重放埋点 |

已确认结论:

```text
trace_id 由 RequestMetadata / CommandMetadata / QueryMetadata 贯穿到日志和审计记录。
日志记录的是“发生了什么”和“在哪一步失败”,审计记录的是“哪一个契约事实真的发生了变化”。
指标记录的是“频率、耗时、失败和重试”,不是业务正文。
本步只定义记录切口,不定义告警阈值、面板和值班流程。
```

---

## 3. 本步写作策略

本步按“trace 传播 -> 日志 -> 指标 -> 审计事件”展开:

```text
先让 trace 可串起来 -> 再定日志位置 -> 再定指标 -> 最后定哪些事实要落审计
```

写作约束:

- 只写实现切口,不写运维告警阈值。
- 审计字段不得越过安全和隐私边界。
- 不把原始正文、敏感凭据或外部系统返回全文写进日志或审计。
- 日志、指标和审计事件必须能回指 Step 9 的处理流名称和 Step 8 的协议名称。

---

## 4. 分章节写入计划

| 章节 | 状态 | 主题 |
|---|---|---|
| 15.1 | [x] | trace 传播规则 |
| 15.2 | [x] | 日志埋点表 |
| 15.3 | [x] | 指标埋点表 |
| 15.4 | [x] | 审计事件表 |
| 15.5 | [x] | 回填草稿 |

---

## 5. SOP 问题回答

### 5.1 哪些处理流必须记录审计？

| 处理流 | 审计要求 | 说明 |
|---|---|---|
| `CreateContractDraftFlow` | 必须 | 形成新的契约真相事实 |
| `UpdateContractDraftFlow` | 必须 | 改变草稿正文、引用或 fingerprint |
| `SubmitContractForReviewFlow` | 必须 | 形成评审状态变化事实 |
| `PublishContractBaselineFlow` | 必须 | 形成发布基线事实和发布门禁事实 |
| `UpdateContractLifecycleFlow` | 必须 | 形成弃用 / 退役 / 替代事实 |
| `ValidateContractChangeJobFlow` | 必须 | 形成兼容性校验事实和 trace 索引 |
| `DeriveReleaseSnapshotJobFlow` | 必须 | 形成快照派生和消费引用事实 |
| `PublishContractFactJobFlow` | 必须 | 形成事实输出整理事实 |
| `OutboxRelayFlow` | 必须记录 relay 状态 | 这是可恢复操作事实,不是新的业务真相 |
| `RebuildContractIndexJobFlow` | 必须 | 形成投影重建和水位推进事实 |
| `RecalculateFingerprintJobFlow` | 必须 | 形成运维复算事实 |

### 5.2 哪些错误分支必须记录日志？

| 错误分支 | 日志级别 | 记录目的 |
|---|---|---|
| 输入校验失败 | `warn` | 帮助调用方定位参数问题 |
| 幂等键重复且 payload 不一致 | `warn` | 识别调用方重复发错请求 |
| expected version 冲突 | `info` / `warn` | 识别并发写冲突 |
| 非法状态迁移 | `warn` | 识别状态机调用错误 |
| gate / reference / blob 不可用 | `warn` | 识别前置条件或外部依赖失败 |
| repository / audit / outbox / idempotency / projection 失败 | `error` | 识别存储或写路径失败 |
| toolchain runner 失败 | `error` | 识别派生或校验失败 |
| internal invariant broken | `error` | 需要人工排查 |

### 5.3 哪些关键路径需要指标？

| 指标 | 类型 | 打点位置 | 标签 |
|---|---|---|---|
| `core_command_total` | counter | 每个 Command 入口 | `operation`, `result` |
| `core_command_latency_ms` | histogram | 每个 Command 入口完成时 | `operation`, `result` |
| `core_query_total` | counter | 每个 Query 入口 | `query`, `result` |
| `core_job_total` | counter | 每个 Job 入口 | `job`, `result` |
| `core_job_latency_ms` | histogram | 每个 Job 完成时 | `job`, `result` |
| `core_idempotency_replay_total` | counter | `IdempotencyRepository.reserve(...)` 命中 replay 时 | `operation` |
| `core_conflict_total` | counter | expected version 冲突或幂等冲突时 | `operation`, `reason` |
| `core_outbox_pending_total` | gauge | outbox relay poll 时 | `store` |
| `core_outbox_publish_total` | counter | outbox relay publish 成功时 | `event_type`, `result` |
| `core_projection_stale_total` | gauge | projection 标记 stale / rebuilding 时 | `projection_name` |
| `core_snapshot_export_total` | counter | snapshot exporter 完成时 | `result` |
| `core_audit_append_total` | counter | audit append 成功时 | `audit_type` |

### 5.4 日志、指标、审计字段分别记录什么？

| 类型 | 必须字段 | 禁止字段 |
|---|---|---|
| 日志 | `trace_id`、`request_id`、`operation`、`actor_ref`、`resource_ref`、`status`、`error_code`、`duration_ms` | 原始正文、凭据、token、外部返回全文 |
| 指标 | `operation`、`job`、`result`、`reason`、`event_type` | 用户正文、敏感标识、自由文本消息 |
| 审计 | `actor_ref`、`trace_id`、`resource_ref`、`before_ref`、`after_ref`、`occurred_at`、`reason` | 原始正文、凭据、外部大对象正文 |

### 5.5 哪些监控和告警细节应留给运维手册？

| 项目 | 当前处理方式 | 后续文档 |
|---|---|---|
| 告警阈值 | 不在本步定义 | 运维手册 |
| 面板布局 | 不在本步定义 | 运维手册 |
| SLO / SLA | 不在本步定义 | 运维手册 |
| 值班流程 | 不在本步定义 | 运维手册 |
| 日志保留周期 | 不在本步定义 | 运维手册 / 平台规范 |

---

## 6. 追踪传播规则

```text
[RequestMetadata / CommandMetadata / QueryMetadata]
  trace_id
  request_id
  requested_at
        |
        v
[application_service / job / relay]
        |
        +--> logs
        +--> audit records
        +--> metrics tags
```

规则:

- 所有写路径和关键读路径都要把 `trace_id` 传进日志和审计。
- `span_name` 由协议名或处理流名派生,例如 `CreateContractDraftFlow`。
- `request_id` 用于串联单次请求的入口和回执,不得作为业务主键。
- `actor_ref`、`resource_ref`、`operation` 共同构成可追溯上下文。

---

## 7. 当前问题诊断

| 问题 | 影响 | 本步修正 |
|---|---|---|
| 日志、指标和审计边界容易混在一起 | 实现者可能把原始正文写进日志或把状态变化只写日志不写审计 | 本步分离三类埋点的职责 |
| Step 12 已规定哪些错误需要审计,但未规定打点位置 | 审计 / 日志实现会散落在 handler 或 repository 中 | 本步固定到 command / job / relay 处理流 |
| Step 9 已有处理流,但没有统一 trace 传播规则 | 调试时无法把日志串成单次请求 | 本步固定 trace_id / request_id 贯穿规则 |
| 指标粒度不足 | 无法区分 command / job / replay / conflict | 本步按 operation / job / result 打点 |

---

## 8. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| trace | 只隐含存在 | 明确 `trace_id` 从 metadata 贯穿到日志和审计 |
| 日志 | 可能散落在各层 | 固定日志位置、级别和字段边界 |
| 指标 | 容易只统计总数 | 按 command / job / replay / conflict / outbox / projection 分类 |
| 审计 | 易和日志混写 | 明确哪些处理流必须写审计事件 |

---

## 9. 设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否把 trace 单独做一张表 | 是 | 否,作为日志和审计字段 | B | trace 是传播上下文,不是独立业务事实 |
| 审计是否记录完整正文 | 记录完整正文 | 只记录引用和必要字段 | B | 避免越过安全和隐私边界 |
| 指标是否按处理流细分 | 只做总数 | 按 operation / job / result 细分 | B | 能定位冲突、replay 和失败热点 |
| 失败日志是否统一打 error | 是 | 按错误类型区分 warn / error | B | 更符合调用方修复和运维排查的语义 |

---

## 10. 结构化中间产物

### 10.1 日志埋点表

| 位置 | 日志级别 | 字段 | 目的 |
|---|---|---|---|
| Command 入口开始 | `info` | `trace_id`、`request_id`、`operation`、`actor_ref` | 追踪一次写请求开始 |
| Command 成功结束 | `info` | `trace_id`、`request_id`、`operation`、`resource_ref`、`duration_ms` | 追踪成功路径和耗时 |
| Query 入口开始 | `debug` / `info` | `trace_id`、`request_id`、`query`、`consistency_mode` | 追踪读路径 |
| Query stale / not found | `debug` / `info` | `trace_id`、`query`、`result` | 识别可解释读面状态 |
| Job 开始 | `info` | `trace_id`、`job_id`、`job`、`input_ref` | 追踪后台任务开始 |
| Job 成功结束 | `info` | `trace_id`、`job_id`、`job`、`result`、`duration_ms` | 追踪后台任务完成 |
| Validation / gate / reference failure | `warn` | `trace_id`、`operation`、`error_code`、`reason` | 识别前置条件失败 |
| Conflict / idempotency replay | `warn` / `info` | `trace_id`、`operation`、`idempotency_key`、`result` | 识别重复请求和并发冲突 |
| Port / toolchain / publisher failure | `error` | `trace_id`、`operation`、`dependency`、`error_code` | 识别外部依赖失败 |
| Outbox relay 单条失败 | `warn` | `trace_id`、`event_id`、`event_type`、`error_code` | 识别单条发布失败 |

### 10.2 指标埋点表

| 指标 | 类型 | 打点位置 | 标签 |
|---|---|---|---|
| `core_command_total` | counter | Command 完成时 | `operation`, `result` |
| `core_command_latency_ms` | histogram | Command 完成时 | `operation`, `result` |
| `core_query_total` | counter | Query 完成时 | `query`, `result` |
| `core_job_total` | counter | Job 完成时 | `job`, `result` |
| `core_job_latency_ms` | histogram | Job 完成时 | `job`, `result` |
| `core_idempotency_replay_total` | counter | reserve 命中 replay 时 | `operation` |
| `core_conflict_total` | counter | 幂等冲突或 expected version 冲突时 | `operation`, `reason` |
| `core_outbox_pending_total` | gauge | relay poll 时 | `store` |
| `core_outbox_publish_total` | counter | relay publish 成功时 | `event_type`, `result` |
| `core_projection_stale_total` | gauge | projection 标记 stale / rebuilding 时 | `projection_name` |
| `core_snapshot_export_total` | counter | snapshot exporter 完成时 | `result` |
| `core_audit_append_total` | counter | audit append 成功时 | `audit_type` |

### 10.3 审计事件表

| 审计事件 | 触发位置 | 记录字段 | 消费方 |
|---|---|---|---|
| `ContractDraftCreated` | `CreateContractDraftFlow` 成功提交后 | `actor_ref`、`trace_id`、`definition_id`、`version` | audit / trace query |
| `ContractDraftUpdated` | `UpdateContractDraftFlow` 成功提交后 | `actor_ref`、`trace_id`、`definition_id`、`before_ref`、`after_ref` | audit / trace query |
| `ContractReviewSubmitted` | `SubmitContractForReviewFlow` 成功提交后 | `actor_ref`、`trace_id`、`definition_id`、`version` | audit / trace query |
| `ContractBaselinePublished` | `PublishContractBaselineFlow` 成功提交后 | `actor_ref`、`trace_id`、`baseline_id`、`gate_ref`、`fingerprint` | audit / trace query |
| `ContractLifecycleChanged` | `UpdateContractLifecycleFlow` 成功提交后 | `actor_ref`、`trace_id`、`definition_id`、`from_state`、`to_state` | audit / trace query |
| `ContractCompatibilityStatusChanged` | `ValidateContractChangeJobFlow` 成功提交后 | `actor_ref`、`trace_id`、`definition_id`、`trace_index_id`、`status` | audit / trace query |
| `ContractSnapshotReady` | `DeriveReleaseSnapshotJobFlow` 成功提交后 | `actor_ref`、`trace_id`、`snapshot_id`、`baseline_id`、`fingerprint` | audit / trace query |
| `ContractFactRecorded` | `PublishContractFactJobFlow` 成功提交后 | `actor_ref`、`trace_id`、`fact_id`、`delivery_status` | audit / trace query |
| `OutboxRelayPublished` | `OutboxRelayFlow` 标记 published 后 | `trace_id`、`event_id`、`event_type`、`published_at` | ops / audit query |
| `OutboxRelayFailed` | `OutboxRelayFlow` 标记 failed 后 | `trace_id`、`event_id`、`event_type`、`reason` | ops / audit query |
| `ProjectionRebuilt` | `RebuildContractIndexJobFlow` 成功提交后 | `trace_id`、`projection_name`、`rebuild_id`、`watermark` | audit / trace query |
| `ReferenceInvalidated` | reference 失效处理后 | `trace_id`、`reference_id`、`reason` | audit / trace query |

---

## 11. 回填草稿

正式 `03-详细设计.md` 回填时应遵守:

```text
1. §14 先写 trace 传播规则,再写日志埋点表、指标埋点表和审计事件表。
2. 每个埋点必须能回指具体处理流。
3. 审计事件不得保存正文或敏感凭据。
4. 指标只写计数、耗时和状态,不写业务正文。
5. 本章不写告警阈值和运维手册内容。
```

建议正式文档 §14 结构:

| 正式章节位置 | 回填内容 |
|---|---|
| `14.1 trace 传播规则` | `trace_id`、`request_id`、`span_name`、字段边界 |
| `14.2 日志埋点表` | 位置、级别、字段、目的 |
| `14.3 指标埋点表` | 指标、类型、位置、标签 |
| `14.4 审计事件表` | 审计事件、触发位置、记录字段、消费方 |

---

## 12. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把 trace 单独做成一类记录 | A. 独立表; B. 作为日志 / 审计字段 | B | trace 是关联上下文,不是独立业务事实 | 已按 B 作为本轮口径 |
| 审计是否记录完整正文 | A. 记录正文; B. 只记录引用和必要字段 | B | 避免越过安全和隐私边界 | 已按 B 作为本轮口径 |
| 指标是否按处理流细分 | A. 只做总数; B. 按 operation / job / result 细分 | B | 便于定位冲突、replay 和失败热点 | 已按 B 作为本轮口径 |
| 日志是否记录 raw payload | A. 记录; B. 不记录,只记录安全字段 | B | 防止泄露正文和敏感信息 | 已按 B 作为本轮口径 |

---

## 13. 进入下一步条件

Step 15 完成后必须满足:

- 实现者知道在什么代码位置记录哪些日志、指标和审计事件。
- `trace_id`、`request_id`、`operation` 和 `actor_ref` 的传播规则已经固定。
- 告警阈值和运维流程已经被明确留给后续文档。
- 审计字段和日志字段不会越过安全边界。
- 可以进入 Step 16 “定义测试切口与最小验证清单”。
