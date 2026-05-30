# Step 16. 定义测试切口与最小验证清单

## 1. Step 状态

- 状态：[x] 已确认
- 所属文档：`projects/L0-bus/03-详细设计.md`
- 本步目标：把 Step 6~15 中已经形成的对象、port、协议、处理流、状态机、一致性、错误、配置和可观测性契约，收敛成详细设计层的最小测试入口。
- 本步不直接修改正式 `03-详细设计.md`，只形成中间产物。
- 本步不替代 `05-测试方案.md`，只说明实现者必须预留和覆盖的最小验证切口。

---

## 2. 本步输入

| 输入 | 关键结论 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 16 | 必须输出模块、接口、状态机、一致性 / 幂等测试切口 | 约束本文件结构 |
| `standards/document/详细设计书写规范.md` §5.15 | 详细设计只定义测试切口、脚本契约、artifact / report 目录，不写完整测试方案 | 约束正式文档回填 |
| `projects/L0-bus/design-calibration/03_ddd_step_05_module_contracts_axis.md` | 已确认 `contracts / domain / application / infra / api / worker / jobs` 模块主轴 | 决定模块测试切口 |
| `projects/L0-bus/design-calibration/03_ddd_step_08_protocol_contracts.md` | 已定义 Command / Query / Inbound Event / Outbound Event / Job 协议清单 | 决定接口测试切口 |
| `projects/L0-bus/design-calibration/03_ddd_step_09_function_flows.md` | 每个处理流已有 §7.x.7 测试切口 | 作为本步汇总来源 |
| `projects/L0-bus/design-calibration/03_ddd_step_10_state_matrix.md` | 已定义 6 个正式状态机和非法转换处理 | 决定状态机测试切口 |
| `projects/L0-bus/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | 已定义事务、锁、版本、唯一约束、projection 和 publisher 一致性口径 | 决定一致性测试切口 |
| `projects/L0-bus/design-calibration/03_ddd_step_12_error_recovery.md` | 已定义错误映射、恢复、人工介入和 rejected evidence | 决定异常测试切口 |
| `projects/L0-bus/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | 已定义并发、幂等、job 重跑和 duplicate 行为 | 决定幂等与并发测试切口 |
| `projects/L0-bus/design-calibration/03_ddd_step_14_config_dependencies.md` | 已定义 in-memory default path、fake / fixture、config boundary | 决定配置与依赖绑定测试切口 |
| `projects/L0-bus/design-calibration/03_ddd_step_15_observability_audit.md` | 已定义日志、指标、审计、trace、redaction | 决定观测与审计测试切口 |

---

## 3. SOP 问题回答

### 3.1 每个模块至少需要哪些单元测试？

| 模块 | 最小单元测试切口 | 原因 |
|---|---|---|
| `contracts` | DTO 序列化 / 反序列化、枚举值解析、公共 metadata 校验、错误 DTO 映射 | 协议是跨入口和跨仓契约，必须稳定 |
| `domain` | 领域对象构造、不变量、状态机合法 / 非法转换、forbidden body boundary | 领域层维护 bus truth 和禁止正文边界 |
| `application` | use case 编排、UnitOfWork 调用顺序、幂等 anchor、port 错误映射、audit / event 副作用 | application 是事务和副作用编排中心 |
| `infra` | in-memory repository 语义、唯一约束、expected version、config loader、adapter error mapping | P0 默认实现必须与未来 durable adapter 语义一致 |
| `api` | HTTP route、header / actor / idempotency 解析、JSON validation、error response mapping | Command / Query 的同步入口必须可测 |
| `worker` | inbound event envelope 解析、duplicate event、source ack failure、consumer retryable failure | consumer 承接 at-least-once 语义 |
| `jobs` | job 参数校验、每 item 事务、partial success、cursor / item idempotency、summary 输出 | operations job 是恢复和投影的重要入口 |

### 3.2 每个接口至少需要哪些正向和异常测试？

每个 Command / Inbound Event / Job 必须至少覆盖一条正向路径、一条 validation / boundary 异常、一条幂等或重复路径。Query 必须覆盖存在、not found、stale / missing marker，且验证 Query 不写入。

Outbound Event 不按 HTTP 接口测试，而按 `OutboundEventPublishFlow` 和每个 event payload schema 测试：payload 字段完整、schema version 正确、publisher retryable failure 不回滚 truth、schema / boundary violation 生成 rejected evidence。

### 3.3 状态机合法转换和非法转换如何测试？

| 测试对象 | 合法转换测试 | 非法转换测试 |
|---|---|---|
| `PublicationAcceptanceStatus` | `Pending -> Accepted`、`Pending -> Rejected` | `Accepted -> Rejected`、`Rejected -> Accepted` |
| `DeliveryStatus` | `Scheduled -> Dispatching -> Delivered -> Completed`、`Dispatching / Delivered -> Failed`、`Failed -> Scheduled / DeadLettered` | 终态 reopen、跳过 required attempt、Completed 后 dead letter |
| `FeedbackStatus` | ack / fail / timeout 一次生成终态 | 把 feedback 当作可多步迁移的状态机 |
| `RetryPlanStatus` | `New -> Scheduled`、`Scheduled -> Exhausted / Cancelled` | Exhausted 后继续 retry、非 failed delivery 创建 retry |
| `DeadLetterStatus` | `New -> Open -> Reviewing -> Closed` | Closed 后 replay、同 delivery active DLQ 重复创建 |
| `ReplayPreparationStatus` | `New -> Draft -> Ready / Rejected / Superseded` | Ready 后 Rejected、缺失 approval ref 进入 Ready |
| `ProjectionStatus` | `missing/stale -> current`、`current -> stale`、rebuild replace | Query 触发写入、stale 被当作 current 返回 |

### 3.4 事务、一致性、幂等和并发如何验证？

| 验证方向 | 最小验证方式 |
|---|---|
| 事务边界 | 使用 fake UnitOfWork 记录 begin / save / commit / rollback 顺序 |
| truth 与 publisher 解耦 | publisher failure 后 truth 已提交且生成 retry evidence |
| source ack failure | truth 不回滚，重复消费返回 existing |
| projection failure | truth 不回滚，Query 返回旧 view 或 stale / missing marker |
| 幂等 key | same key + same digest 返回 existing；same key + different digest 返回 conflict |
| 并发 version | 两个 worker 同时改同一 delivery，只允许一个 version 成功 |
| job 重跑 | 同一 item 被重复扫描时不重复写 truth |
| forbidden body | 日志、审计、event、projection、evidence 都不能保存 payload body / raw secret |

### 3.5 哪些测试细节应留给测试方案？

| 留给 `05-测试方案.md` 的内容 | 本步只定义 |
|---|---|
| 完整测试矩阵、优先级、覆盖率目标 | 最小测试入口 |
| 测试目录、测试文件命名、fixture 细节 | 需要覆盖的契约边界 |
| CI 分层、执行顺序、耗时控制 | 脚本命令契约和 artifact / report 根目录 |
| 端到端环境、真实消息队列、真实数据库 | P0 in-memory / fake 必须保持的语义 |
| 报告模板、验收报告内容 | report 生成脚本输入输出和失败语义 |

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| Step 9 已在每个处理流下写测试切口，但分散 | 实现者难以判断哪些是最低必须覆盖 | 汇总为模块、协议、状态机和一致性四类入口 |
| Step 10 状态机完整，但没有测试反查表 | 非法转换可能只靠实现者自行补测 | 明确每个状态机的合法 / 非法测试 |
| Step 11~13 已定义事务、幂等、并发，但没有形成测试清单 | 容易漏测 source ack、publisher failure、projection stale 等关键一致性语义 | 汇总成一致性 / 幂等 / 并发表 |
| Step 15 已定义 redaction，但没有验证切口 | 日志或审计可能泄露 forbidden body | 增加 redaction / audit / metric 最小测试 |
| 详细设计容易越界写成完整测试方案 | 影响 `05-测试方案.md` 职责 | 本步只写“必须有测试入口”，不写完整策略 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 模块测试 | 仅在对象 / port / 流程中间接出现 | 每个实现模块都有最小测试切口 |
| 接口测试 | 分散在协议和处理流章节 | Command / Query / Event / Job 形成统一测试索引 |
| 状态机测试 | 只有转换矩阵 | 增加合法转换和非法转换测试入口 |
| 一致性测试 | 分散在事务、错误、并发章节 | 统一抽取事务、projection、publisher、source ack、幂等、job 重跑 |
| 可观测性测试 | 只有埋点契约 | 增加日志、指标、审计、trace、redaction 验证入口 |
| 脚本与产物 | 尚未形成详细设计层命令契约 | 明确 gate / report / redaction check 脚本的输入输出 |

---

## 6. 设计取舍

### 6.1 本步是写完整测试方案还是最小测试切口

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：在详细设计中写完整测试方案 | 信息完整，但会重复 `05-测试方案.md` 并降低可维护性 | 不采用 |
| 方案 B：只写最小测试切口和验证入口，完整矩阵留给 `05-测试方案.md` | 推荐 |
| 方案 C：详细设计不写测试内容 | 实施者无法知道哪些契约必须被验证 | 不采用 |

推荐方案 B。详细设计负责约束“这些契约必须可测”，测试方案负责展开“如何组织、执行、报告和验收”。

### 6.2 是否每个协议单独列测试切口

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：只按协议类别汇总 | 文档短，但容易漏掉单个 Command / Query / Job 的差异 | 不采用 |
| 方案 B：Command / Query / Inbound Event / Job 逐项列出，Outbound Event 使用逐 event schema + 通用发布流结合 | 推荐 |
| 方案 C：所有 event 都只测 publisher | 不能验证 event payload schema 差异 | 不采用 |

推荐方案 B。Outbound Event 共享发布机制，但 payload schema 不同，必须至少有逐 event schema 测试。

### 6.3 是否在本步定义脚本契约

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：不定义脚本，全部留给实施计划 | 详细设计无法约束 artifact / report 的来源 | 不采用 |
| 方案 B：定义脚本命令、输入、输出、失败语义，不写脚本内部实现 | 推荐 |
| 方案 C：详细设计直接写完整脚本代码 | 越界到实施 | 不采用 |

推荐方案 B。它能保证实现仓形成稳定的 `artifacts/test/<run_id>` 和 `reports/` 产物，同时不替代编码阶段。

---

## 7. 结构化中间产物

### 7.1 测试切口总图

```text
Detailed design contracts
  |
  +-- module contracts ---------> module unit tests
  |
  +-- protocol contracts -------> API / consumer / publisher / job tests
  |
  +-- state matrix -------------> legal / illegal transition tests
  |
  +-- transaction rules --------> consistency / rollback / recovery tests
  |
  +-- idempotency rules --------> duplicate / conflict / rerun tests
  |
  +-- observability rules ------> log / metric / audit / redaction tests
  |
  v
Test artifacts
  |
  +-- artifacts/test/<run_id>
  |
  v
Reports
  |
  +-- reports/runs/<run_id>
```

关键说明：

- 本图表达详细设计契约如何落到最小测试入口，不表达完整 CI 流程。
- `artifacts/test/<run_id>` 是测试原始产物根目录。
- `reports/` 是人工 / Agent 审查后的报告根目录。
- 每个测试切口都必须能回指 Step 6~15 的某个实现契约。

### 7.2 模块测试切口汇总表

| 模块 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `contracts` | Step 8 DTO / metadata / error DTO | JSON roundtrip、必填字段、枚举值、schema version、禁止 payload body 字段 | contract unit test |
| `domain` | Step 6 对象、Step 10 状态机 | 构造、不变量、合法转换、非法转换、forbidden body boundary | domain unit test |
| `application` | Step 9 flow、Step 11 UoW、Step 13 idempotency | 编排顺序、事务提交 / 回滚、duplicate existing、conflict、audit / event 副作用 | application service test |
| `infra` | Step 7 port adapter、Step 11 store | in-memory store 唯一约束、version conflict、repository error mapping、config loader | adapter / repository test |
| `api` | Step 8 Command / Query HTTP JSON | route、header、actor、idempotency key、validation、HTTP error mapping | handler test |
| `worker` | Step 8 Inbound Event Consumer | envelope 解析、event duplicate、source ack failure、retryable consumer failure | consumer test |
| `jobs` | Step 8 Operations Job | job config validation、item transaction、partial success、cursor、job summary | job runner test |

### 7.3 接口测试切口汇总表

| 协议 | 正向测试 | 异常 / 边界测试 | 建议测试类型 |
|---|---|---|---|
| `AcceptPublication` | accepted publication 生成 delivery 候选和 audit | payload body 越界、same key different digest、repository failure | API + application |
| `RecordDeliveryFeedback` | ack / fail feedback 更新 delivery | unknown delivery、duplicate feedback、late feedback conflict | API + application |
| `RequestRetry` | failed delivery 创建 retry plan | delivery 不可重试、active retry 已存在、missing actor | API + application |
| `MoveDeliveryToDeadLetter` | failed delivery 进入 DLQ | completed delivery 不可 DLQ、missing failure material | API + application |
| `PrepareReplay` | approved DLQ 生成 replay preparation | missing approval、audit chain invalid、duplicate approval ref | API + application |
| `GetPublicationAcceptance` | 返回 accepted / rejected view | not found、projection stale marker、Query 不写入 | API query |
| `GetDeliveryStatus` | 返回 delivery 当前状态 | not found、stale marker、终态字段映射 | API query |
| `ListDeliveryHistory` | 分页返回 history | invalid page、not found、敏感访问 audit | API query |
| `GetTransportView` | 返回 transport view | projection missing、stale marker、Query 不 rebuild | API query |
| `GetFailureSummary` | 返回 failure summary | not found、forbidden body 不出现在 view | API query |
| `GetBusAuditTrail` | 返回 audit trail page | invalid filter、敏感查询留痕、分页边界 | API query |
| `GetBackendHealthView` | 返回 backend health view | not found、stale capability marker | API query |
| `ConsumeCommittedOutboxFact` | fact 携带 `core_event_ref`、`core_event_envelope_ref`、`delivery_mode`、`target_scope` 后被接入为 publication acceptance | duplicate event、payload 越界、source ack failure、缺失 core event contract ref | consumer |
| `ConsumeBackendDeliverySignal` | delivered / failed signal 更新 delivery | unknown delivery、backend private body rejected、duplicate signal | consumer |
| `ConsumeTimeoutSignal` | timeout 更新 delivery / feedback | duplicate timeout、terminal delivery conflict | consumer |
| 9 个 Outbound Event payload | 每个 event payload 字段、schema version、source ref 正确 | schema violation、forbidden body rejected | contract + publisher |
| `RunOutboxRelay` | poll fact 并逐 item 处理 | source unavailable、partial success、cursor 不越界 | job runner |
| `RunDeliveryProgression` | scheduled delivery 被 dispatch / failed | backend unavailable、version conflict、item skip | job runner |
| `RunRetryCycle` | due retry plan 产生新 attempt | exhausted、backend failure、duplicate attempt | job runner |
| `RunReadOutputProjection` | 增量刷新 projection | projection write failure、source missing、stale marker | job runner |
| `RebuildReadProjection` | batch rebuild 替换 projection | version conflict、dry run 不写入、boundary violation | job runner |
| `CheckBackendCapability` | 刷新 backend health projection | secret unavailable、capability mismatch、adapter failure | job runner |

#### 7.3.1 Outbound Event payload schema 测试切口

| Outbound Event | 正向测试 | 异常 / 边界测试 | 建议测试类型 |
|---|---|---|---|
| `PublicationAcceptedEvent` | accepted payload 含 publication / delivery candidate ref | payload body 不进入 event | contract |
| `PublicationRejectedEvent` | rejected reason 使用稳定 error code / details ref | raw rejected payload 不进入 event | contract |
| `DeliveryStateChangedEvent` | from / to 状态、delivery ref、attempt ref 正确 | backend raw status 不直接进入 event | contract |
| `FeedbackRecordedEvent` | feedback status、source ref、delivery ref 正确 | raw backend private body 不进入 event | contract |
| `DeadLetterCreatedEvent` | dead letter ref、failure material ref、delivery ref 正确 | failure raw body 不进入 event | contract |
| `ReplayPreparationReadyEvent` | replay preparation ref、approval ref、audit chain ref 正确 | missing approval 不允许发布 ready event | contract |
| `TransportViewUpdatedEvent` | transport view ref、projection version、consistency marker 正确 | stale view 不伪装成 current | contract |
| `FailureMaterialAvailableEvent` | failure material ref、classification、details ref 正确 | forbidden body 不进入 event | contract |
| `BackendCapabilityChangedEvent` | backend id、capability summary、health marker 正确 | secret / private backend response 不进入 event | contract |

### 7.4 状态机测试切口表

| 状态机 | 合法转换切口 | 非法转换切口 | 建议测试类型 |
|---|---|---|---|
| `PublicationAcceptanceStatus` | `Pending -> Accepted / Rejected` | Accepted / Rejected 互相改写 | domain unit test |
| `DeliveryStatus` | `Scheduled`、`Dispatching`、`Delivered`、`Completed`、`Failed`、`DeadLettered`; timeout 使用 `FeedbackStatus::Timeout` + `DeliveryStatus::Failed`; retry reschedule 使用 `Failed -> Scheduled` | 终态 reopen、跳跃转换、backend raw status 直接写入 | domain + application |
| `FeedbackStatus` | ack / fail / timeout 一次生成终态 | 把 feedback 当作多步生命周期迁移 | domain unit test |
| `RetryPlanStatus` | `Scheduled`、`Exhausted`、`Cancelled` | Exhausted 后继续 retry、非 failed delivery retry | domain + application |
| `DeadLetterStatus` | `Open`、`Reviewing`、`Closed` | Closed 后 replay、重复 active DLQ | domain + application |
| `ReplayPreparationStatus` | `Draft`、`Ready`、`Rejected`、`Superseded` | Ready 后 rejected、无 approval ready | domain unit test |
| `ProjectionStatus` | missing / stale / current / rebuilding | Query 触发写入、stale 当 current | projection service test |

### 7.5 一致性 / 幂等 / 并发测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `accept_publication_same_key_same_digest_returns_existing` | Command idempotency | 同 key 同 digest 不重复 insert | application service |
| `accept_publication_same_key_different_digest_conflicts` | Request digest mismatch | 返回 `409` / `IdempotencyConflict` | application service |
| `consume_outbox_fact_duplicate_returns_existing` | Event idempotency | 重复 fact 不重复写 acceptance | consumer |
| `record_feedback_races_with_timeout` | delivery lock + feedback unique | ack 与 timeout 只有一个主状态推进成功 | concurrency unit |
| `delivery_progression_double_worker_version_conflict` | `get_for_update` + `expected_version` | 双 worker 只有一个推进 delivery | repository + service |
| `request_retry_duplicate_active_plan` | active retry unique | 重复 retry 返回 existing / conflict | application service |
| `dead_letter_races_with_retry_cycle` | recovery conflict | DLQ 与 retry 不会同时成功 | concurrency unit |
| `prepare_replay_duplicate_approval_ref` | replay unique key | 同 `dead_letter_id + approval_ref` 不重复创建 | application service |
| `projection_incremental_races_with_rebuild` | projection version | 增量与 rebuild 一个成功、一个 version conflict | repository + job |
| `source_ack_failure_then_redelivery` | source ack recovery | truth 不回滚，重复消费 existing | consumer integration |
| `publisher_retry_duplicate_event` | publish evidence idempotency | 重复 publish 返回 existing receipt | publisher adapter |
| `job_rerun_skips_processed_item` | job item idempotency | job 重跑不重复写 truth | job runner |

### 7.6 错误 / 恢复测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `validation_error_maps_to_protocol_error` | Step 12 error mapping | validation error 映射 HTTP 400 / rejected item | API / consumer |
| `boundary_violation_rejects_forbidden_body` | forbidden body boundary | payload body、raw secret、backend private body 不落库 | domain + adapter |
| `repository_unavailable_is_retryable` | dependency recovery | repository unavailable 返回 retryable dependency error | application |
| `commit_uncertain_records_manual_action` | UnitOfWork recovery | commit uncertain 记录 evidence 和人工介入 marker | application + infra |
| `publisher_failure_does_not_rollback_truth` | publisher recovery | truth 已提交，publish evidence 标记 retryable | publisher flow |
| `projection_failure_does_not_rollback_truth` | projection recovery | truth 不回滚，projection stale / missing 可解释 | projection job |

### 7.7 配置 / 依赖绑定测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `default_in_memory_profile_boots` | RuntimeConfig default | 默认 in-memory path 可启动 api / worker / jobs | config + smoke |
| `invalid_config_fails_fast` | ConfigLoader | 缺失必要依赖或非法 enum 启动失败 | config unit |
| `secret_ref_required_for_backend` | Secret boundary | 配置不接受 raw secret，只接受 `SecretRef` | config validation |
| `fake_clock_and_id_generator_are_deterministic` | technical ports | 测试 profile 使用 deterministic fake | unit |
| `runtime_wiring_uses_ports_not_concrete_cross_calls` | dependency binding | api / worker / jobs 通过 application port 和 infra wiring 协作 | architecture test |

### 7.8 可观测性 / 审计 / redaction 测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `audit_written_for_write_paths` | Step 15 audit table | Command / Event / Job 写路径生成必要 audit | application |
| `sensitive_query_writes_access_audit` | sensitive query audit | `GetBusAuditTrail`、DLQ / failure material 读取留痕 | API query |
| `metrics_use_low_cardinality_labels` | metric label rule | 指标不包含 record id、payload digest 全量、secret | unit / snapshot |
| `logs_do_not_include_forbidden_body` | redaction rule | 日志不含 payload body / raw secret / private body | redaction check |
| `events_and_projection_do_not_include_forbidden_body` | event / projection boundary | event payload 和 projection view 不泄露 forbidden body | contract + projection |
| `trace_ref_is_propagated_without_redefining_schema` | L0-core trace reference | request / event / job / publisher 保留 trace ref | application / adapter |

### 7.9 脚本契约表

| 脚本 | 类型 | 参数 | 输入 | 输出 | 失败语义 |
|---|---|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | gate | `--run-id` / `--artifact-root` / `--config-profile` | 源码、配置、测试环境 | `artifacts/test/<run_id>` | 非 0 exit code 且保留 failure artifact |
| `scripts/reports/generate_reports.sh` | report | `--run-id` / `--artifact-root` / `--report-root` | `artifacts/test/<run_id>` | `reports/runs/<run_id>` | 非 0 exit code 且说明缺失 artifact |
| `scripts/checks/check_redaction.sh` | check | `--artifact-root` / `--report-root` | artifacts + reports | `reports/runs/<run_id>/redaction-check.md` | 发现 raw secret / raw body 时失败 |

脚本契约规则：

- artifact root 固定为 `artifacts/test/<run_id>`，不再额外添加项目名层级。
- report root 固定为 `reports/`，每次运行输出到 `reports/runs/<run_id>`。
- 脚本命令和失败语义进入详细设计，脚本实现细节进入实施计划或代码仓。

### 7.10 不进入本步的完整测试方案范围

| 内容 | 归属 |
|---|---|
| 测试分层策略、覆盖率目标、CI 阶段拆分 | `05-测试方案.md` |
| 测试 fixture 文件组织、mock 数据、测试命名规范 | `05-测试方案.md` / 实施计划 |
| 完整报告字段、报告审查流程 | `05-测试方案.md` / `06-验收标准.md` |
| 性能压测、容量测试、长期稳定性测试 | 后续测试方案或运维专项 |
| 真实 MQ / durable store / transport backend 集成环境 | P1 集成测试方案 |

---

## 8. 回填草稿

正式 `03-详细设计.md` 的 §15 按以下方式回填：

```md
## 15. 测试切口与最小验证清单

### 15.1 测试切口总图

从 `design-calibration/03_ddd_step_16_test_slices.md` §7.1 摘录。

### 15.2 模块测试切口汇总表

从 `design-calibration/03_ddd_step_16_test_slices.md` §7.2 摘录。

### 15.3 接口测试切口汇总表

从 `design-calibration/03_ddd_step_16_test_slices.md` §7.3 摘录。

### 15.4 状态机测试切口表

从 `design-calibration/03_ddd_step_16_test_slices.md` §7.4 摘录。

### 15.5 一致性 / 幂等 / 并发测试切口表

从 `design-calibration/03_ddd_step_16_test_slices.md` §7.5 摘录。

### 15.6 错误 / 恢复测试切口表

从 `design-calibration/03_ddd_step_16_test_slices.md` §7.6 摘录。

### 15.7 配置 / 依赖绑定测试切口表

从 `design-calibration/03_ddd_step_16_test_slices.md` §7.7 摘录。

### 15.8 可观测性 / 审计 / redaction 测试切口表

从 `design-calibration/03_ddd_step_16_test_slices.md` §7.8 摘录。

### 15.9 脚本契约表

从 `design-calibration/03_ddd_step_16_test_slices.md` §7.9 摘录。

### 15.10 不进入本章的完整测试方案范围

从 `design-calibration/03_ddd_step_16_test_slices.md` §7.10 摘录。
```

说明：

- 正式详细设计只回填最小测试切口，不展开完整测试计划。
- `05-测试方案.md` 必须继续引用本章，把每个测试切口展开为测试用例、fixture、执行命令和报告要求。
- 如果后续测试方案发现缺少某个最小切口，需要回到本 Step 补充，而不是只在测试方案中默默增加。

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| Outbound Event 是否每个 event 都单独写测试 | A. 只测通用 publisher；B. 通用 publisher + 每个 payload schema；C. 每个 event 都写完整端到端 | 推荐 B | 机制共享但 schema 不同，P0 不需要每个 event 都端到端 |
| 是否在详细设计中定义脚本契约 | A. 不定义；B. 定义命令输入输出和失败语义；C. 写完整脚本实现 | 推荐 B | 可约束 artifact / report，又不越界到实现 |
| 是否把真实 MQ / durable store 集成测试列为 P0 | A. P0 必须真实依赖；B. P0 用 in-memory / fake，真实依赖 P1；C. 不测依赖 | 推荐 B | P0 先保证语义，真实 adapter 稳定后扩展 |
| redaction 是否只靠人工 review | A. 只人工；B. 自动检查 + 人工审查；C. 不检查 | 推荐 B | forbidden body 是安全红线，必须有自动门禁 |
| Query 是否必须测试“不写入” | A. 必须；B. 不需要；C. 只测普通 Query | 推荐 A | Query 不自动 rebuild / 不改写真相是核心边界 |

---

## 10. 进入下一步条件

```text
详细设计中的关键契约都有最小测试入口。
模块、协议、状态机、一致性 / 幂等 / 并发、错误恢复、配置依赖、可观测性和脚本契约均已形成测试切口。
本步没有替代完整测试方案，只为后续 05-测试方案提供展开依据。
可以进入 Step 17，收口详细设计到实施计划的承接清单。
```
