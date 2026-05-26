# Step 16. 定义测试切口与最小验证清单

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 16
- 回填章节：`03-详细设计.md` §15 测试切口与最小验证清单

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 5 模块契约 | 已确认 `domain`、`contracts`、`application`、`infra`、`api`、`worker` 的模块职责和边界 |
| Step 8 协议契约 | 已确认 P0 Command / Query / Event / Inbound / Job 协议清单 |
| Step 9 处理流 | 已确认每个关键接口的函数级处理流、事务位置和副作用 |
| Step 10 状态机 | 已确认 `MethodContentLifecycle`、`OutboxStatus`、`IdempotencyStatus`、`JobRunStatus` 转换矩阵 |
| Step 11 一致性 | 已确认持久化对象、事务边界、outbox、projection、checkpoint |
| Step 12 错误模型 | 已确认错误码、HTTP/RPC/Event/Job 映射和恢复口径 |
| Step 13 并发幂等 | 已确认并发场景、幂等键、重入保护 |
| Step 14 配置绑定 | 已确认外部依赖绑定、timeout/retry/降级边界 |
| Step 15 可观测性 | 已确认日志、指标、审计埋点切口 |

已确认结论：

```text
本步只定义最小测试入口,不替代测试方案。
测试方案继续负责测试数据、环境、覆盖率、执行脚本、CI 策略和验收矩阵。
每个关键 Command / Query / Event / Job 至少要有正向和异常测试切口。
状态机必须覆盖合法转换和非法转换。
事务、一致性、幂等和并发必须能被集成测试验证。
```

依赖的前序 Step：

```text
Step 1~15 已确认详细设计的主要实现契约和观测切口。
```

---

## 3. SOP 问题回答

1. 每个模块至少需要哪些单元测试？

   回答：`domain` 需要覆盖 aggregate、payload kind、lifecycle、reference、boundary、fingerprint 不变量；`contracts` 需要覆盖 DTO 序列化、错误响应、event envelope、snapshot schema；`application` 需要覆盖 Command / Query / Job 编排、事务、audit/outbox/idempotency；`infra` 需要覆盖 repository、unique constraint、UnitOfWork、outbox claim、projection checkpoint；`api` 需要覆盖 Gateway context、DTO validation、错误映射；`worker` 需要覆盖 outbox relay、replay、rebuild、seed、dry_run。

2. 每个接口至少需要哪些正向和异常测试？

   回答：7 个 P0 Command、6 个 P0 Query、4 类 outbound event relay、governance inbound / bus result / snapshot payload 等外部依赖流、4 个 Operations Job 都需要最少一组正向和一组异常测试。P1 接口第一批只验证 feature flag disabled 和不阻塞 P0,不展开完整 P1 用例。

3. 状态机合法转换和非法转换如何测试？

   回答：使用表驱动测试覆盖 `Draft -> InReview -> Published -> Deprecated/Retired/Superseded` 等合法迁移,以及 retired/superseded 终态、published 原地修改、outbox published 回 pending、idempotency succeeded 重写、job terminal 再 complete 等非法迁移。

4. 事务、一致性、幂等和并发如何验证？

   回答：通过 application service + repository 集成测试验证同事务写入、失败回滚、outbox 同事务、snapshot metadata 与 payload 关系、projection 可重建、同 key 同 hash 返回既有结果、同 key 不同 hash 冲突、revision conflict、同 version 双 publish、outbox 多 worker claim、checkpoint CAS 等。

5. 哪些测试细节应留给测试方案？

   回答：具体测试数据 fixture、mock / fake adapter 实现、数据库初始化脚本、CI 并发度、性能阈值、覆盖率目标、端到端环境、测试命名规范、测试报告格式、混沌测试和运维告警验证留给 `05-测试方案.md`。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `03-详细设计.md` 测试内容 | 已有大量测试想法,但和新版 Step 5~15 契约未对齐 | 实现者难以判断最小必测集合 |
| 处理流章节 | 每个 flow 有测试切口,但散落在接口小节中 | 需要汇总成接口测试总表 |
| 状态机章节 | 状态转换矩阵已确认,但未形成统一测试切口 | 可能只测正向流程,遗漏非法转换 |
| 一致性 / 幂等章节 | 并发、outbox、checkpoint、dry_run 规则已确认 | 需要变成集成测试入口 |
| P1 内容 | P1 endpoint / plugin / configuration 后置 | 测试表需要防止误把 P1 完整测试当 P0 门槛 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 测试组织 | 散落在各章节 | 按模块、接口、状态机、一致性/幂等四类汇总 | 对应书写规范 §5.15 |
| Command 测试 | 单个接口中局部描述 | 统一列出 7 个 Command 的正向/异常最小切口 | 保证 P0 写路径都可验证 |
| Query 测试 | 只强调只读 | 明确 not found、分页、stale、snapshot 校验等异常 | 防止 Query 偷写或静默返回错误一致性 |
| Event / Job 测试 | retry/replay 分散 | 汇总 outbox relay、inbound event、operations job 测试 | 覆盖可靠执行层 |
| 状态机测试 | 依赖状态矩阵阅读 | 单独形成状态机测试切口表 | 确保合法和非法转换都被测 |
| 测试方案边界 | 可能混入环境和脚本 | 明确本步不写测试数据、CI、覆盖率和执行脚本 | 保持详细设计粒度 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 在详细设计中写完整测试方案 | 实施者信息集中 | 会重复 `05-测试方案.md`,且过早绑定测试环境 | 不采用 |
| 只写“需要测试” | 简短 | 无法驱动实现者补最小测试 | 不采用 |
| 写最小测试切口,具体用例展开留测试方案 | 粒度合适,能覆盖契约 | 后续仍需测试方案继续细化 | 采用 |
| 只测 API 层端到端 | 接近用户路径 | 难以定位 domain / repository /状态机错误 | 不采用 |
| 单元 + 集成 + 契约 + worker 测试分层 | 覆盖实现边界,定位清楚 | 测试数量更多 | 采用 |

---

## 7. 结构化中间产物

### 7.1 测试分层图

```text
[Unit tests]
  - domain object / value object / policy
  - DTO / error / event schema
        |
        v
[Application service tests]
  - Command / Query / Job orchestration
  - fake ports / deterministic clock / id generator
        |
        v
[Persistence / adapter integration tests]
  - repository / UnitOfWork / constraints
  - outbox / checkpoint / projection
        |
        v
[API / Worker contract tests]
  - HTTP JSON / Gateway headers / error mapping
  - outbox relay / replay / rebuild / seed
```

关键说明：

- 本步只定义切口,不决定具体测试框架。
- P0 主链必须先测;P1 只测 feature flag 和不阻塞 P0。
- 并发、事务、outbox、checkpoint 不能只靠单元测试,必须有集成测试切口。

### 7.2 模块测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `domain::content` aggregate 不变量 | Step 6 `MethodContent`;Step 10 lifecycle | create/update/publish/deprecate/retire/supersede 合法;published 不可原地改;revision 受控变化 | 单元测试 / 表驱动 |
| 7 类 `MethodContentPayload` kind 匹配 | Step 6 payload;Step 12 `PAYLOAD_KIND_MISMATCH` | kind 与 payload variant 匹配;错误 kind 返回稳定错误 | 单元测试 |
| `domain::definitions` reference 校验 | Step 6 ref;Step 12 reference error | draft reference、published reference、target kind 不允许、not published 引用失败 | 单元测试 |
| `domain::policies` boundary guard | Step 5/6 Definition / Use 边界 | payload 混入 Use truth 时失败;合法 definition payload 通过 | 单元测试 |
| fingerprint canonical 规则 | Step 6 fingerprint;Step 11/12 fingerprint | 相同语义生成稳定 fingerprint;非语义字段不进入 fingerprint | 单元测试 / property test |
| contracts DTO 序列化 | Step 8 API / Event / Job 协议 | Command / Query / Event / Job DTO JSON 字段、schema_version、错误响应稳定 | 契约测试 |
| `application::command_services` 编排 | Step 9 Command flow;Step 11 tx;Step 12 error | 幂等、事务、domain method、audit、snapshot、outbox 顺序正确 | 应用服务集成测试 |
| `application::query_services` 只读 | Step 9 Query flow | Query 不写 audit/outbox/idempotency;not found/stale 有稳定响应 | 应用服务测试 |
| `application::sync_services` snapshot/outbox | Step 9/11 sync | snapshot metadata、payload ref、outbox event 关系正确 | 应用服务集成测试 |
| `application::operations_services` job | Step 9 job flow;Step 13 dry_run | seed/replay/recalculate/rebuild 不绕过规则;dry_run 不写 truth/checkpoint | 应用服务 / worker 测试 |
| repository / UnitOfWork | Step 7/11 persistence | insert/save/get_for_update、rollback、unique constraint、revision conflict | 数据库集成测试 |
| outbox repository | Step 10/11/13 outbox | pending -> publishing -> published/retry/dead-letter;claim CAS | 数据库集成测试 |
| projection / checkpoint repository | Step 11/13 projection | projection upsert 可重建;checkpoint CAS;失败不推进 | 数据库集成测试 |
| outbound adapter fake | Step 7/14 dependencies | governance/storage/bus success/failure 可控注入 | adapter contract / fake 测试 |
| API handler / extractor | Step 8/14 Gateway | Gateway headers、idempotency key、body/path mismatch、错误映射 | API contract 测试 |
| worker runner | Step 9/13 worker | relay/replay/rebuild job 可恢复,不会直接改 truth | worker 集成测试 |
| observability / audit | Step 15 | 成功业务变化写 audit;失败写 log/metric;secret 不入记录 | 应用服务 / contract 测试 |

### 7.3 接口测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `CreateMethodContentDraft` 正向 / kind mismatch | Step 8/9 Command;Step 12 error | 成功创建 draft、revision=1、写 audit/idempotency;kind 不匹配回滚 | API / 应用服务集成 |
| `UpdateMethodContentDraft` 正向 / published 更新失败 | Step 8/9 Command;Step 10 lifecycle | draft 更新成功且 revision +1;published 更新返回 `PUBLISHED_CONTENT_IMMUTABLE` 或状态错误 | API / 应用服务集成 |
| `SubmitMethodContentForReview` 正向 / 重复提交失败 | Step 8/9 Command;Step 10 lifecycle | draft -> in_review;重复提交返回 `LIFECYCLE_TRANSITION_NOT_ALLOWED` | API / 应用服务集成 |
| `PublishMethodContent` 正向 / gate invalid | Step 8/9 Command;Step 11 tx | publish 写 state/version/fingerprint/snapshot/audit/outbox;gate invalid 不提交 | API / 应用服务集成 |
| `PublishMethodContent` reference invalid / snapshot failure | Step 9/11/12 | reference not published 失败;object storage failure 阻断 publish | 应用服务集成 / fake adapter |
| `DeprecateMethodContent` 正向 / draft 失败 | Step 8/9 Command;Step 10 lifecycle | published -> deprecated 并写 outbox;draft deprecate 失败 | API / 应用服务集成 |
| `RetireMethodContent` 正向 / retired 重入 | Step 8/9 Command;Step 10 lifecycle | published/deprecated -> retired;已 retired 再 retire 返回稳定冲突或幂等结果 | API / 应用服务集成 |
| `SupersedeMethodContent` 正向 / 双 revision conflict | Step 8/9 Command;Step 11 tx | old -> superseded,new -> published 同事务;old/new revision 任一冲突整体失败 | 应用服务集成 |
| `GetMethodContent` 正向 / not found | Step 8/9 Query | published/authoring read_mode 返回正确;not found 返回 404;不写 audit | API contract / query test |
| `ListMethodContents` 正向 / pagination invalid | Step 8/9 Query | 分页、filter、consistency 字段正确;非法 page 参数返回 400 | API contract |
| `GetMethodContentVersion` 正向 / version not found | Step 8/9 Query | version record、fingerprint、snapshot_ref 正确;不存在返回 404 | API / repository integration |
| `GetDefinitionSnapshot` 正向 / hash mismatch | Step 8/9 Query;Step 12 snapshot | snapshot payload 可读且 fingerprint 校验;hash mismatch 返回错误 | API / fake storage |
| `ResolveViewProfile` 正向 / no match | Step 8/9 Query | 解析 published ViewProfile;无匹配返回受控空结果或错误 | query service test |
| `GetDefinitionTrace` 正向 / projection stale | Step 8/9 Query | 返回 version/audit/outbox/snapshot trace;stale 标记或错误符合契约 | query / projection test |
| Outbox relay published event 正向 / bus failure | Step 8/9 Event;Step 11 outbox | pending event 发布成功 mark published;bus failure mark retryable,truth 不回滚 | worker integration |
| Outbox relay deprecated/retired/fingerprint event | Step 8/9 Event | event_type、topic、payload 字段正确;event_id 稳定 | worker contract |
| Governance inbound event 正向 / payload hash conflict | Step 8/9 Inbound | 同 event_id 同 hash ack/skip;同 event_id 不同 hash dead-letter 或冲突 | inbound event test |
| Bus publish result 正向 / unknown event | Step 8/9 External | ack 成功推进状态;unknown event_id 受控错误/跳过 | worker test |
| `SeedInitialMethodAssets` 正向 / dry_run | Step 8/9 Job | seed 复用 Command service;dry_run 不写 truth/outbox;重复 seed 幂等 | worker / application integration |
| `ReplayDefinitionEvents` 正向 / cursor invalid | Step 8/9 Job;Step 13 checkpoint | replay 复用原 event_id;非法 cursor 失败;bus failure 不推进 checkpoint | worker integration |
| `RecalculateFingerprint` 正向 / mismatch dry_run | Step 8/9 Job | 无 mismatch 返回空报告;mismatch dry_run 不改 truth/outbox | job service test |
| `RebuildReadModels` 正向 / projection failure | Step 8/9 Job;Step 11 projection | projection 可重建;失败不推进 checkpoint;不改变 MethodContent revision | worker / repository integration |
| P1 endpoint disabled | Step 8/14 P1 feature flag | P1 关闭返回 `P1_FEATURE_DISABLED`;不影响 P0 endpoint | API contract |

### 7.4 状态机测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `MethodContentLifecycle` 合法迁移 | Step 10 §7.3 | none -> draft,draft -> in_review,in_review/draft -> published,published -> deprecated/retired/superseded,deprecated -> retired/superseded | 单元测试 / 表驱动 |
| `MethodContentLifecycle` 非法迁移 | Step 10 §7.3 | retired/superseded 终态不可迁移;draft 不可 retire;published 不可 update_draft | 单元测试 / 表驱动 |
| `OutboxStatus` 合法迁移 | Step 10 §7.4 | pending -> publishing -> published;publishing -> retryable_failed;retryable_failed -> pending/dead_lettered | 单元测试 |
| `OutboxStatus` 非法迁移 | Step 10 §7.4 | published -> pending 失败;非持有 worker mark published 失败 | 单元 / repository integration |
| `IdempotencyStatus` 合法迁移 | Step 10 §7.5 | none -> processing -> succeeded/failed;同 key 同 hash 返回既有结果 | 单元 / repository integration |
| `IdempotencyStatus` 非法迁移 | Step 10 §7.5 | 同 key 不同 hash 冲突;succeeded 不能被覆盖;processing 重复进入冲突 | repository integration |
| `JobRunStatus` 合法迁移 | Step 10 §7.6 | running -> succeeded/partially_succeeded/failed | 单元 / repository integration |
| `JobRunStatus` 非法迁移 | Step 10 §7.6 | terminal job 再 complete/fail 返回 `JOB_STATUS_CONFLICT` | 单元 / repository integration |

### 7.5 一致性 / 幂等测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| Command 同事务写入 | Step 11 transaction | publish 成功时 MethodContent、version、snapshot metadata、audit、outbox、idempotency 同时存在 | 数据库集成 |
| Command 失败回滚 | Step 11/12 | gate invalid、reference invalid、outbox append failed 不留下 published truth | 应用服务集成 |
| Snapshot payload failure | Step 9/11/12 | object storage put 失败阻断 publish;不写 published snapshot_ref | fake adapter 集成 |
| Outbox 失败不回滚 truth | Step 11/12 | bus publish failure 只影响 outbox status,不回滚已提交 MethodContent | worker integration |
| Projection 可重建 | Step 11 | rebuild 从 write model/outbox 重建 projection;不反写 truth | repository / worker integration |
| 同 key 同 hash 幂等 | Step 13 | 重复 Command / Job 返回既有 result_ref,不重复写 audit/outbox/version | 应用服务集成 |
| 同 key 不同 hash 冲突 | Step 13 | 返回 `IDEMPOTENCY_CONFLICT`,不执行业务写入 | 应用服务 / repository integration |
| revision 并发冲突 | Step 13 | 两个请求基于同 revision 更新,只允许一个成功 | 并发集成测试 |
| 同 version 双 publish | Step 13 | 同 `content_family_id + version` 并发 publish 只允许一个成功 | 并发数据库集成 |
| 同 old content 双 supersede | Step 13 | old content 只能建立一个 supersede link | 并发数据库集成 |
| Outbox 多 worker claim | Step 13 | 多 worker 同时 claim 同一 event,只有一个成功 | 并发 worker / repository integration |
| Checkpoint CAS | Step 13 | 两个 replay/rebuild job 推进同 checkpoint,冲突者重读或失败 | 并发 repository integration |
| dry_run 写入禁止 | Step 13 | dry_run job 不写 truth/outbox/checkpoint;尝试写入返回 `JOB_DRY_RUN_WRITE_FORBIDDEN` | job service test |
| 配置降级边界 | Step 14 | governance unavailable 阻断 publish;bus unavailable 不回滚 truth;observability failure 不阻断业务 | fake adapter integration |
| 可观测性切口 | Step 15 | 成功 Command 写 audit;失败记录 log/metric;secret/raw key 不入日志 | contract / unit |

### 7.6 本步不覆盖的测试细节

| 留给测试方案的内容 | 原因 |
|---|---|
| 具体 fixture 和样本 MethodContent payload | 属于测试数据设计 |
| 测试数据库启动、清理和 migration 脚本 | 属于测试环境设计 |
| mock / fake adapter 的代码实现 | 属于测试工程实现 |
| 覆盖率目标和 CI 阈值 | 属于测试方案和 CI 策略 |
| 性能、压测、容量、SLO | 属于性能测试和运维方案 |
| 告警规则和 dashboard | 属于运维手册 / 可观测性设计 |
| P1 plugin/configuration 完整用例 | P1 后置,不进入 P0 最小验证清单 |

---

## 8. 回填草稿

可直接回填到 `03-详细设计.md` 的起草结构：

````md
## 15. 测试切口与最小验证清单

### 15.1 测试分层

```text
[Unit] -> [Application Service] -> [Persistence / Adapter Integration] -> [API / Worker Contract]
```

### 15.2 模块测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|

### 15.3 接口测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|

### 15.4 状态机测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|

### 15.5 一致性 / 幂等测试切口表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|

### 15.6 不覆盖内容

| 留给测试方案的内容 | 原因 |
|---|---|
````

---

## 9. 待确认事项

- P0 第一批是否要求 API contract 测试覆盖全部 7 个 Command,还是允许先用 application service 集成测试覆盖部分 Command。当前建议关键 Command 同时覆盖 API 与 application service。
- `ResolveViewProfile` 无匹配时返回空视图还是错误码。当前测试切口保留“受控空结果或错误”,正式回填前应与 Query 语义统一。
- `RetireMethodContent` 对已 retired 重复请求是幂等返回还是冲突。当前测试切口允许按错误模型确认,正式回填前建议定为冲突或幂等之一。
- `FingerprintMismatchReported` 是否持久 audit 会影响测试断言。当前至少测试 job result,审计断言待 Step 15 待确认项收口。

---

## 10. 进入下一步条件

- 每个模块都有最小单元或集成测试切口。
- 每个关键 P0 Command / Query / Event / Job 都有正向和异常测试切口。
- 状态机测试切口覆盖合法转换和非法转换。
- 事务、一致性、幂等、并发、outbox、checkpoint、dry_run 都有可执行测试入口。
- 已明确哪些内容留给 `05-测试方案.md`。
- 可以进入 Step 17 收口详细设计到实施计划的承接清单。
