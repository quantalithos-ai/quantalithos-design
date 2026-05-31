# Step 13. 定义并发、幂等与重入保护

> 本文件是 `projects/L0-sdk/03-详细设计.md` 的 Step 13 中间产物。
> 本步只收稳 SDK 并发更新、重复请求、重复事件、job 重跑、outbox 重放和 projection rebuild 的保护方式。
> 本步不新增 port 函数、不新增正式状态 enum variant、不引入 P0 分布式锁服务。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填，本文件不替代正式详细设计。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 13
- 回填章节：`projects/L0-sdk/03-详细设计.md` §12 并发、幂等与重入保护

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_08_protocol_contracts.md` | Command、Inbound Event、Outbound Event、Job 的幂等要求和 key 来源 | 固定幂等键来源 |
| `03_ddd_step_09_function_flows.md` | 每个 flow 的事务边界、锁定位置、错误映射和状态副作用 | 固定冲突资源和重入来源 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | `SdkIdempotencyRepository`、`ExpectedVersion`、`UnitOfWork`、outbox、projection 和 artifact 恢复规则 | 固定锁、版本、唯一键和事务策略 |
| `03_ddd_step_12_error_recovery.md` | `Conflict`、`Dependency`、`BoundaryViolation`、outbox publish failure、runner failure 的处理方式 | 固定失败错误和重复调用返回 |

已确认结论：

```text
Command API 必须携带 CommandMetadata.request.idempotency_key，且写路径必须校验其为 Some(...)。
Inbound Event Consumer 必须能从 event_id + source_ref + idempotency_key 形成消费幂等键。
Operations Job 必须携带 job_run_id；写路径 job 还必须形成业务 item 幂等键。
Query API 不需要幂等键，不开启写事务，不触发 refresh / rebuild。
Runtime boundary call / publish 不写 SDK domain truth，但 write-like runtime call 仍需要调用层幂等键和 `RuntimeIdempotencyRepository` 技术控制记录，避免重复边界调用。
同 key 同 digest 返回既有 receipt；同 key 不同 digest 返回 Conflict。
```

---

## 3. SOP 问题回答

### 3.1 哪些处理流可能并发修改同一资源？

| 冲突资源 | 可能并发的处理流 | 主要风险 | 控制口径 |
|---|---|---|---|
| 当前 `SdkSemanticBaseline` | `UpdateSdkSemanticBaselineFlow`、candidate / compatibility job 读取当前 baseline | baseline 更新与 candidate 生成读到不一致版本 | baseline 写入使用 `get_for_update` + `ExpectedVersion`；candidate 只读取 committed baseline |
| `DerivedBindingView` / `LanguageBindingView` | `RefreshDerivedBindingViewFlow`、core / bus / formal API changed consumer、freshness job | stale mark 与 refresh 并发覆盖 freshness | view 保存使用 `ExpectedVersion`；stale mark 与 refresh 在 UoW 内完成 |
| `ServiceClientView` | `RefreshDerivedBindingViewFlow`、`ConsumeFormalApiChangedFlow`、runtime `InvokeServiceCapability` 只读 | formal API 变化与调用视图读取并发 | 写路径带版本；runtime call 不反写 view |
| `BusEventClientView` | `RefreshDerivedBindingViewFlow`、`ConsumeBusSemanticChangedFlow`、runtime `PublishBusEvent` 只读 | bus semantic 变化与 publish 读取并发 | 写路径带版本；publish 不改写 event client view |
| `PackageCandidate` | `BuildLanguagePackagesFlow`、`RunCrossLanguageSmokeFlow`、`ValidateDocsExamplesFlow`、`VerifyBoundaryPoliciesFlow`、`ConsumeValidationRunFinishedFlow`、`CheckCompatibilityFlow` | candidate artifact、evidence 和状态被并发推进 | `CandidateRepository.get_for_update` + `CandidateRepository.save(expected_version)` |
| `VerificationEvidence` | validation jobs、validation run event consumer 重复进入 | 同一验证事实被重复插入 | evidence ID / event key / job item key 去重，insert 唯一约束兜底 |
| `CompatibilityDecision` | `RecordCompatibilityDecisionFlow`、`CheckCompatibilityFlow` | 同一 candidate / baseline 出现互相冲突的 decision | command / job 幂等键 + decision 记录唯一性；candidate stable gate 重新读取 |
| `DeprecatedApiRecord` | `DeprecateSdkApiFlow` 重复提交或并发迁移 | deprecated lifecycle 被非法覆盖 | record 写入使用 `ExpectedVersion` 和状态矩阵 |
| `sdk_outbox_events` | 写路径 append、outbound event publisher 重试 | outbox 重复 append 或重复 publish | append 与 truth 同事务；publish 使用 outbox event id 幂等 |
| projection read model | write flow required projection update、`RebuildSdkProjectionsFlow` | rebuild 覆盖较新的 projection | projection version / rebuild scope 控制，truth 不被 rebuild 改写 |

### 3.2 哪些接口、事件或 job 可能被重复调用？

| 类别 | 可能重复的入口 | 重复来源 | 默认处理 |
|---|---|---|---|
| Command API | 6 个 command | CLI / client 超时重试、人工重复执行 | 同 key 同 digest 返回既有 receipt；不同 digest 返回 `Conflict` |
| Query API | 12 个 query | 客户端轮询或重试 | 不需要幂等键，只读返回当前 view / marker |
| Inbound Event Consumer | 4 个 consumer | at-least-once event、source ack 失败、scheduler 重放 | duplicate skip 或返回既有处理结果 |
| Outbound Event publisher | 6 个 SDK outbound event topic | publisher 失败重试、mark published 失败后重放 | 使用同一 outbox event id / CloudEvent id 重发，最终只标记一次 published |
| Operations Job | 8 个 job | scheduler 重跑、多实例、部分失败后恢复 | job summary 按 `job_run_id`；业务 item 按 target id / scope 去重 |
| Runtime boundary call | `InvokeServiceCapability`、`PublishBusEvent`、`ReadServiceCapability`、`OpenEventSubscription` | caller 超时或 client retry | 不写 SDK domain truth；write-like runtime call 可写 `RuntimeIdempotencyRepository` 技术控制记录，同 key 同 digest 可返回既有 boundary result ref 或让 caller 显式重试 |

### 3.3 幂等键来自请求、事件、job 参数还是数据库唯一约束？

| 来源 | 使用位置 | 说明 |
|---|---|---|
| `CommandMetadata.request.idempotency_key` | Command API、runtime write-like client method | Command API 进入 `SdkIdempotencyRepository` 前校验为 `Some(...)`；runtime write-like method 进入 `RuntimeIdempotencyRepository` 前校验为 `Some(...)`；二者都规范化为带 operation scope 的 key |
| normalized command DTO digest | Command API | 与 idempotency key 绑定，用于区分同请求 replay 和 key 复用冲突 |
| `event_id + source_ref + idempotency_key` | Inbound Event Consumer | 规范化为消费幂等 key；缺任一字段按 Step 12 返回 validation / rejected |
| `job_run_id` | Job summary | 标识一次 job run，不单独作为业务 item 去重依据 |
| `job_run_id + target id / scope + input digest` | Operations Job item | 防止同一 job 重跑重复写 evidence、candidate、projection |
| repository unique key | truth / projection / outbox | 最后一层并发保护，不能替代幂等 digest 判断 |
| `outbox_event_id` / CloudEvent id | Outbound Event publish | 重复 publish 必须保持同一 event identity |

### 3.4 重复请求应该返回既有结果、跳过、覆盖还是报错？

| 重复类型 | 处理方式 |
|---|---|
| same idempotency key + same digest + completed | 返回既有 receipt / result ref |
| same idempotency key + same digest + in progress | 返回 `Conflict`，调用方稍后用同一 key 重试 |
| same idempotency key + different digest | 返回 `Conflict`，不得覆盖旧记录 |
| duplicate inbound event + same digest | skip 或返回 prior consume result |
| duplicate inbound event + different digest | 返回 `Conflict` / rejected，不得混用 source |
| duplicate job run item + same digest | skip 或 replay item summary |
| new job run 扫描到已完成业务 item | 根据 truth 状态 skip，不重复写 evidence / decision / projection |
| duplicate outbox publish | 允许使用同一 event id 重发；mark published 幂等 |
| version conflict | 不覆盖，返回 `Conflict` 或 job item retry / skip |

### 3.5 并发冲突如何测试？

| 测试方向 | 必须覆盖 |
|---|---|
| 乐观锁 | 两个写事务基于同一 `ExpectedVersion` 保存同一对象，后提交者 `Conflict` |
| command replay | 同一 command 同 key 同 digest 第二次返回既有 receipt |
| command key conflict | 同 key 不同 digest 返回 `Conflict` |
| inbound event duplicate | 同一 `event_id + source_ref + idempotency_key` 消费两次，第二次不重复写 truth / outbox |
| candidate 多 job 并发 | build / smoke / docs / boundary / compatibility 并发更新同一 candidate，只有合法转换成功 |
| outbox retry | publish 成功但 mark published 失败后重跑，使用同一 event id 并最终标记一次 |
| projection rebuild 并发 | rebuild batch 不反写真相，旧 projection version 不能覆盖新 projection |

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步修正 |
|---|---|---|
| Step 8 已写幂等要求，但 key 计算分散在各接口 | 实现者难以统一 `SdkIdempotencyRepository.reserve(...)` / `RuntimeIdempotencyRepository.reserve(...)` 入参 | 本步汇总规范化 key 和 digest 来源 |
| Step 11 已写锁 / 版本，但未按资源列出并发冲突 | 实现者不知道哪些 flow 会互相冲突 | 本步按 SDK truth / view / candidate / outbox / projection 汇总冲突 |
| `job_run_id` 容易被误认为业务幂等键 | 新 job run 扫描旧 item 可能重复写 evidence 或 projection | 本步区分 job summary key 与业务 item key |
| runtime boundary 不写 truth，但仍可能重复调用外部边界 | caller retry 可能重复触发 formal API 或 bus publish | 本步要求 runtime write-like call 也带 idempotency key，结果不反写 SDK truth |
| outbox append 与 publish 幂等容易混淆 | 可能把 post-commit publish failure 当成 command replay | 本步区分 command 幂等、outbox append 幂等和 publisher 重放幂等 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 并发资源 | 分散在事务表和处理流中 | 形成冲突资源总表 |
| Command 幂等 | 要求携带 key | 明确 key + normalized digest + receipt replay |
| Event 幂等 | 每个 consumer 有幂等描述 | 明确 `event_id + source_ref + idempotency_key` 规范化 |
| Job 幂等 | 每个 job 有 `job_run_id` | 明确业务 item key 才防重复写 truth |
| Runtime boundary | 只说明不写 truth | 补充重复调用保护和不得反写 truth |
| Projection rebuild | 只说明 truth 不变 | 补充 version / scope 防旧 rebuild 覆盖新 projection |

---

## 6. 设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 幂等是否只依赖 repository 唯一约束 | 只靠唯一键 | 使用 `SdkIdempotencyRepository` / `RuntimeIdempotencyRepository` + digest + 唯一约束兜底 | B | 唯一键不能判断同 key 不同 payload，也不能返回既有 receipt / result ref |
| 幂等 key 是否扩展 repository 签名增加 scope | 修改 `reserve(scope, key, digest, uow)` | 在调用前把 operation scope 编入 `IdempotencyKey` | B | 不改 Step 7 port 签名，同时保留 key 可计算性 |
| job 幂等是否只用 `job_run_id` | 只用 `job_run_id` | `job_run_id` 管 summary，target item key 管业务写入 | B | 新 job run 仍可能扫描到同一业务 item |
| 并发冲突是否自动重试 | Command 和 job 都自动重试 | Command 返回 `Conflict`；job item 可有限 retry / skip | B | Command 调用方需要显式看到冲突，job 可在 item 粒度恢复 |
| runtime boundary 是否保存结果用于 replay | 保存所有 boundary result body | 只允许保存 result ref / diagnostic ref，不保存正文 | B | 符合 boundary / redaction 策略 |

---

## 7. 结构化中间产物

### 7.1 并发与幂等控制图

```text
[Command / Event / Job item]
  |
  | compute canonical IdempotencyKey + CommandDigest
  v
[Idempotency repository]
  |-- completed + same digest ----> return existing receipt
  |-- in_progress + same digest --> Conflict, retry later
  |-- same key + different digest -> Conflict
  v
[UnitOfWork]
  |
  | get_for_update / expected_version / unique key
  v
[SDK truth + required projection + outbox append]
  |
  | complete idempotency record in same transaction
  v
[Receipt / outbox_event_ref]
```

关键说明：

- 幂等保护发生在 application service 边界，domain object 不感知 idempotency key。
- SDK domain 写路径使用 `SdkIdempotencyRepository` 并携带 `UnitOfWorkHandle`；runtime boundary write-like call 使用 `RuntimeIdempotencyRepository`，不携带 `UnitOfWorkHandle`，不写 SDK domain truth。
- `IdempotencyKey` 在调用 repository 前完成规范化，内容包含 operation / source / target / caller key。
- 乐观锁保护同一资源并发更新；幂等记录保护同一调用重复进入。
- outbox publish 是 post-commit 重放边界，不回滚 command truth。

### 7.2 并发场景表

| 场景 | 冲突资源 | 控制方式 | 失败错误 | 测试切口 |
|---|---|---|---|---|
| 两个 baseline update 并发 | 当前 `SdkSemanticBaseline` | `get_for_update` + `save(expected_version)` + baseline version unique | `Conflict` | 同 version 双写，后者失败 |
| baseline update 与 candidate generate 并发 | baseline committed version | candidate 只读 committed baseline；baseline 写入版本化 | `Conflict` / `NotFound` | baseline 更新中 candidate 不读未提交状态 |
| refresh view 与 upstream changed consumer 并发 | `DerivedBindingView` / language views | view version + stale mark UoW | `Conflict` | stale mark 与 refresh 交错 |
| formal API changed 与 service client view refresh 并发 | `ServiceClientView` | `save(expected_version)` | `Conflict` | 两个 formal ref 更新只保留一个最新 committed view |
| bus semantic changed 与 event client view refresh 并发 | `BusEventClientView` | `save(expected_version)` | `Conflict` | event mapping stale 与 refresh 交错 |
| generate candidate 重复提交 | `package_candidates.candidate_version` | candidate version unique + command idempotency | `Conflict` | 同 candidate version 只插入一次 |
| build package 与 validation job 并发更新 candidate | `PackageCandidate` | candidate lock + expected version +状态矩阵 | `Conflict` | build / smoke 并发只允许合法状态推进 |
| 多个 validation job 同时写 evidence | `verification_evidence` / `PackageCandidate` | evidence unique key + candidate lock | `Conflict` | smoke / docs / boundary 并发不重复验证同一 item |
| validation run event 与 validation job 重复进入 | `verification_evidence` / candidate evidence set | `event_id + run_ref` 幂等 + evidence insert unique | `Conflict` / replay | 重复 run event 不写第二条 evidence |
| compatibility command 与 compatibility job 并发 | `CompatibilityDecision` / `PackageCandidate` | decision 幂等 key + candidate gate 重新读取 | `Conflict` | 手工 decision 与 job decision 交错 |
| deprecate lifecycle 并发 | `DeprecatedApiRecord` | `ExpectedVersion` + lifecycle 状态矩阵 | `Conflict` | deprecated / pending removal 并发 |
| outbox publisher 多实例处理同一 event | `sdk_outbox_events.outbox_event_id` | load pending + mark published 小事务 + same CloudEvent id | `Dependency` / skip | 双 publisher 最终只 published 一次 |
| projection rebuild 与写路径 projection update 并发 | projection key / projection version | rebuild scope + projection version check | `Dependency` / `Conflict` | 旧 rebuild 不覆盖新 projection |
| artifact write 成功但 truth 提交失败后重跑 build | artifact ref / candidate artifact metadata | digest verify + candidate lock；orphan artifact 不可见 | `Dependency` / replay | 重跑不会把 orphan 自动挂回 candidate |

### 7.3 幂等键表

| 接口 / Job / Event | 幂等键 | 幂等窗口 | 重复请求处理 |
|---|---|---|---|
| `UpdateSdkSemanticBaseline` | `operation:update_baseline + CommandMetadata.request.idempotency_key` | 至少覆盖 baseline history | 缺失则 validation；同 digest 返回既有 receipt；不同 digest `Conflict` |
| `RefreshDerivedBindingView` | `operation:refresh_view + CommandMetadata.request.idempotency_key + refresh_scope digest` | 至少覆盖 source ref version | 缺失则 validation；同 digest replay；source newer 时需新 key |
| `InvokeServiceCapability` | `operation:invoke_service + CommandMetadata.request.idempotency_key + capability_ref` | caller 控制的短窗口 | 缺失则 validation；使用 `RuntimeIdempotencyRepository`；不写 SDK domain truth；同 digest 可返回既有 result ref / diagnostic ref |
| `PublishBusEvent` | `operation:publish_bus_event + CommandMetadata.request.idempotency_key + event_mapping_ref` | caller 控制的短窗口 | 缺失则 validation；使用 `RuntimeIdempotencyRepository`；不写 SDK domain truth；同 digest 可返回既有 bus publish ref |
| `RecordCompatibilityDecision` | `operation:record_compatibility + CommandMetadata.request.idempotency_key + candidate_id` | 覆盖 candidate / baseline decision 追溯 | 缺失则 validation；同 digest replay；不同 decision digest `Conflict` |
| `DeprecateSdkApi` | `operation:deprecate_api + CommandMetadata.request.idempotency_key + api_ref` | 覆盖 deprecated lifecycle | 缺失则 validation；同 digest replay；非法 lifecycle `Conflict` |
| `ConsumeCoreContractChanged` | `event_id + source_ref + idempotency_key` | 永久或随 source ref 保留 | duplicate skip / prior result |
| `ConsumeBusSemanticChanged` | `event_id + source_ref + idempotency_key` | 永久或随 source ref 保留 | duplicate skip / prior result |
| `ConsumeFormalApiChanged` | `event_id + source_ref + idempotency_key` | 永久或随 source ref 保留 | duplicate skip / prior result |
| `ConsumeValidationRunFinished` | `event_id + run_ref + idempotency_key` | 覆盖 candidate validation history | duplicate 不重复写 evidence |
| `RunCheckUpstreamFreshness` | `job_run_id + source set + refresh_if_stale` | job run summary 生命周期 | 只读重复返回 summary；refresh 时进入 refresh flow 幂等 |
| `RunGeneratePackageCandidate` | `job_run_id + baseline_version + candidate_version` | candidate version 生命周期 | 已存在 candidate 返回 existing / conflict |
| `RunBuildLanguagePackages` | `job_run_id + candidate_id + language set` | candidate 生命周期 | 已 attach artifact 且 digest 一致则 skip |
| `RunCrossLanguageSmoke` | `job_run_id + candidate_id + suite_ref` | candidate validation history | 同 digest replay evidence summary |
| `RunValidateDocsExamples` | `job_run_id + candidate_id + docs_example_set_ref` | candidate validation history | 同 digest replay docs evidence summary |
| `RunCheckCompatibility` | `job_run_id + candidate_id + baseline_version` | candidate / baseline decision history | 已有同 digest decision 则 replay |
| `RunVerifyBoundaryPolicies` | `job_run_id + candidate_id + policy_set_ref` | candidate validation history | 同 digest replay boundary evidence |
| `RunRebuildSdkProjections` | `job_run_id + projection_set + rebuild_scope` | rebuild run 生命周期 | 同 digest replay summary；不同 scope 新 key |
| Outbound event publish | `outbox_event_id` / CloudEvent id | outbox event 生命周期 | already published 返回 published ref |

### 7.4 重入保护表

| 场景 | 重入来源 | 保护方式 | 恢复方式 |
|---|---|---|---|
| Command 超时后 caller 重试 | CLI / Rust client retry | SDK domain 写路径使用 `SdkIdempotencyRepository.find/reserve/complete`；runtime boundary 使用 `RuntimeIdempotencyRepository.find/reserve/complete` | completed 返回 receipt / runtime result ref；in progress 稍后重试 |
| 同 key 不同 payload | caller 误用 idempotency key | digest 比对 + `mark_conflict` | 返回 `Conflict`，要求更换 key |
| inbound event ack 失败后重复投递 | event bus at-least-once | canonical event idempotency key | skip / prior result，并允许 ack |
| validation event 重复进入 | runner event replay | `event_id + run_ref` + evidence unique key | 不重复写 evidence |
| job 失败后重跑 | scheduler / operator | job item key + truth 状态检查 | 已完成 item skip，失败 item 重试 |
| artifact orphan 后重跑 build | truth 事务失败 | candidate truth 不引用 orphan；digest verify 后重新 attach | cleanup job 可删除 orphan |
| outbox publish 成功但 mark failed | publisher crash | same outbox event id / CloudEvent id | 重发同一 event，mark published 幂等 |
| projection rebuild 中断 | process crash / dependency failure | rebuild scope + batch UoW | 从 scope / cursor 重跑 batch |
| runtime boundary call 超时 | client retry | `RuntimeIdempotencyRepository` + caller idempotency key + boundary result ref / diagnostic ref | 不写 SDK domain truth，caller 决定重试 |

### 7.5 实现约束

| 约束 | 内容 |
|---|---|
| key 规范化 | SDK domain 写路径在调用 `SdkIdempotencyRepository.reserve(IdempotencyKey key, CommandDigest digest, UnitOfWorkHandle uow)` 前构造 canonical key；runtime boundary 在调用 `RuntimeIdempotencyRepository.reserve(IdempotencyKey key, CommandDigest digest)` 前构造 runtime-scoped canonical key |
| digest 计算 | digest 来自 normalized DTO / event payload / job item input，不包含 trace id、timestamp、diagnostic message |
| receipt replay | `complete(...)` 保存 `CommandReceiptRef`，重复请求返回 receipt 指向的结果视图 |
| in-progress 处理 | P0 不阻塞等待；返回 `Conflict`，调用方稍后重试 |
| job item 粒度 | job 可以整体失败，但已完成 item 不重复写 truth |
| query | 不使用 idempotency repository，不开启写事务 |
| test adapter | in-memory adapter 必须模拟 version conflict、idempotency conflict 和 duplicate outbox publish |

---

## 8. 回填草稿

正式 `03-详细设计.md` §12 建议按以下结构回填：

```text
12. 并发、幂等与重入保护
  12.1 并发与幂等控制图
  12.2 并发场景表
  12.3 幂等键表
  12.4 重入保护表
  12.5 实现约束
```

回填来源：

| 正式章节 | 回填来源 |
|---|---|
| §12.1 | 本文件 §7.1 |
| §12.2 | 本文件 §7.2 |
| §12.3 | 本文件 §7.3 |
| §12.4 | 本文件 §7.4 |
| §12.5 | 本文件 §7.5 |

需要在正式文档中显式引用：

```text
本章结论来自 design-calibration/03_ddd_step_13_concurrency_idempotency.md。
如需理解并发冲突、幂等键计算、重复调用处理和 job 重跑策略，应继续阅读该中间产物全文。
```

---

## 9. 待确认事项

无。

已自动采用的方案：

| 决策 | 已采用方案 | 原因 |
|---|---|---|
| repository 签名 | 不修改 Step 7，调用前规范化 `IdempotencyKey` | 避免新增未授权 port |
| job 幂等 | `job_run_id` 管 summary，target item key 管业务写入 | 防止新 job run 重复写旧 item |
| runtime boundary replay | 只 replay ref / diagnostic，不保存正文 | 符合 redaction / credential 边界 |
| outbox 重放 | 保持同一 event id 重发 | post-commit publish failure 不回滚 truth |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 已列出真实影响实现的并发资源和冲突处理 | [x] |
| 已列出 Command / Event / Job / Runtime boundary 的幂等键来源 | [x] |
| 已说明重复请求返回 existing、skip、conflict 或 retry 的规则 | [x] |
| 已说明 job 重跑、outbox 重放和 projection rebuild 的重入保护 | [x] |
| 已给出并发冲突测试切口 | [x] |

下一步可进入 Step 14：定义配置引用与外部依赖绑定。
