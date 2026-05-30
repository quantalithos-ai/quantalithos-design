# L0-bus 05 测试方案 Step 3: 测试对象与测试切口

> 本文件是 `projects/L0-bus/05-测试方案.md` 的 Step 3 中间产物。
> 本步从概要设计和详细设计中抽取必须验证的测试对象,并为每类对象定义测试切口、风险和推荐测试层级。
> 本步不修改正式 `05-测试方案.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 3 |
| 主题 | 抽取测试对象与测试切口 |
| 状态 | 已确认 |
| 正式回填位置 | `05-测试方案.md` §3 |
| 是否修改正式 `05-测试方案.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `05_test_plan_step_02_scope.md` | 已确认 | 继承 P0 / P0-min / P1 / P2 范围与一票否决候选 |
| `02-概要设计.md` §5 | 已完成 | 提取六个主要组成部分与职责边界 |
| `02-概要设计.md` §6 | 已完成 | 提取关键对象分布与对象边界 |
| `02-概要设计.md` §7~§10 | 已完成 | 提取接口、处理流、状态机、异常与边界场景 |
| `02-概要设计.md` §11 | 已完成 | 提取配置影响轮廓 |
| `03-详细设计.md` §5~§8 | 已完成 | 提取模块、对象 / trait / API 索引和逐接口处理流 |
| `03-详细设计.md` §9~§15 | 已完成 | 提取状态机、事务、一致性、错误、幂等、配置、观测和最小验证清单 |
| `04-配置设计.md` §12 | 已完成 | 提取配置 loader / validator / redaction / reports 的测试承接 |

---

## 3. SOP 问题回答

### 3.1 哪些 domain object / value object / policy 必须单测?

必须单测的对象不是“所有 struct 等量覆盖”,而是承担 truth、状态、不变量、边界、policy、projection 派生规则的对象。

| 对象组 | 必须单测的对象 | 关键测试切口 |
|---|---|---|
| Publication | `PublicationMaterial`、`PublicationAcceptance`、`PublicationAcceptanceStatus`、`PublicationAcceptanceResult` | 合法材料构造、缺失 core contract、payload body 越界、accepted / rejected 终态不可改写 |
| Transport semantic | `TransportSemantic`、`PayloadBoundaryGuard` | 平台语义派生、禁止裸后端参数、payload ref / digest / metadata 边界 |
| Delivery | `DeliveryRecord`、`DeliveryAttempt`、`DeliveryStatus`、`DeliveryLifecycle`、`DeliveryHistoryEntry` | `Scheduled / Dispatching / Delivered / Failed / DeadLettered` 迁移、attempt 完成、history 生成；`Completed` 由 feedback 切片覆盖 |
| Feedback | `FeedbackResult`、`FeedbackStatus`、`FeedbackSource`、`IdempotencyAnchor`、`RequestDigest` | ack / fail / timeout / duplicate / late feedback、same key same digest、same key different digest |
| Recovery | `RetryPlan`、`RetryPlanStatus`、`DeadLetterEntry`、`DeadLetterStatus`、`ReplayPreparation`、`ReplayPreparationStatus`、`FailureMaterial` | retry eligibility、active retry 唯一、DLQ material 完整性、缺少 audit chain 时 replay rejected |
| Recovery policy | `RecoveryEligibilityPolicy` | failed delivery 才能 retry / DLQ、retry exhausted 不自动 DLQ、replay 必须依赖 DLQ / approval / audit chain |
| Read output | `BusAuditEntry`、`TransportViewProjection`、`FailureSummaryProjection`、`BackendHealthView`、`ProjectionStatus` | append-only audit、projection 派生、stale / current marker、projection 不成为 truth |
| Read-only policy | `ReadOnlyOutputPolicy` | Query / projection / tap / failure material 只读边界、禁止反写真相 |
| Backend boundary | `BackendCapabilityRef`、`BackendCapabilityView`、`BackendCapabilityPolicy` | 后端能力引用、secret / private body 不泄漏、capability 不直接改 truth |
| Config value object | `RuntimeConfig`、子 config、`ValidatedRuntimeConfig`、`RuntimePolicySet` | 默认值、严格 JSON、profile、secret ref、禁止 raw secret、reload rejection |

### 3.2 哪些 application service 必须做 service test?

application service 是 P0 主链的编排核心,必须用 fake repository / fake port / fake UnitOfWork 做 service test。

| Service | 必测原因 | 关键测试切口 |
|---|---|---|
| `PublicationAcceptanceService` | 发布材料进入 bus truth 的主入口 | accept / reject、idempotency、payload boundary、audit / outbound event evidence |
| `DeliveryProgressionService` | delivery 生命周期推进主入口 | schedulable scan、dispatch success、backend failure、state conflict |
| `FeedbackRecordingService` | feedback、history、幂等和恢复候选入口 | ack / fail / timeout、duplicate、late feedback、unknown delivery |
| `RecoveryOrchestrationService` | retry 和 DLQ 的受控恢复入口 | allowed retry、not eligible、active retry conflict、DLQ material missing |
| `ReplayPreparationService` | replay 前置材料和审计链入口 | replay ready、missing approval、audit chain invalid、duplicate preparation |
| `ReadOutputService` | Query 和只读输出入口 | projection not found、stale marker、access audit、no write UoW |
| `BackendCapabilityService` | 后端能力检测和语义映射入口 | available / degraded / unavailable、secret unavailable、capability change evidence |
| `OutboxPublisherService` | 已提交事实发布 outbound event | publish success、retryable publisher failure、schema / boundary violation、truth 不回滚 |

### 3.3 哪些 repository / adapter / worker 必须做集成测试?

P0 默认采用 in-memory / fake / fixture,但仍要验证 repository、adapter、worker 的接缝和一致性语义。

| 对象 | 必测原因 | 推荐测试切口 |
|---|---|---|
| `PublicationRepository` | publication acceptance truth 保存入口 | source ref 唯一、expected version、duplicate accept |
| `DeliveryRepository` | delivery / attempt / history truth 保存入口 | `get_for_update`、expected version、同一 delivery 并发推进 |
| `FeedbackRepository` | feedback result 保存入口 | feedback unique key、duplicate / late feedback |
| `RecoveryRepository` | retry / DLQ / replay / failure material 保存入口 | active retry unique、active DLQ unique、approval unique |
| `ReadProjectionRepository` | 派生只读输出保存入口 | projection version、stale marker、rebuild / incremental conflict |
| `BusAuditRepository` | audit append-only 入口 | append-only sequence、audit chain load |
| `IdempotencyRepository` | 幂等锚点保存入口 | scope + key + digest、same / different digest |
| `UnitOfWorkPort` | 写事务边界 | begin / commit / rollback 顺序、commit uncertain、publisher failure 不回滚 truth |
| `OutboxFactSourcePort` | core outbox fact 输入接缝 | committed fact only、duplicate event、source ack failure |
| `OutboxPublisherPort` | outbound event 发布接缝 | existing receipt、retryable failure、schema / boundary rejected |
| `TransportBackendPort` | delivery 后端接缝 | dispatch success、backend unavailable、unsupported semantic、private body rejected |
| `ConfigLoader` / `ConfigValidator` / `RuntimeBuilder` | runtime graph 装配入口 | JSON parse、env override、secret ref、invalid profile、禁止绕过 validator |
| `OutboxRelayConsumer` / `BackendSignalConsumer` / `TimeoutSignalConsumer` | 常驻 worker 入口 | duplicate event、retryable consumer failure、at-least-once recovery |
| `JobRunner` family | operations job 入口 | item transaction、partial success、cursor、job item idempotency |

### 3.4 哪些 Command / Query / Event / Job 必须做协议和流程测试?

协议测试必须覆盖 schema、必填字段、枚举值、错误映射、幂等键和 forbidden body。流程测试必须覆盖从入口到 application service 的主线。

| 协议类别 | 必测对象 | 测试切口 |
|---|---|---|
| Command API | `AcceptPublication`、`RecordDeliveryFeedback`、`RequestRetry`、`MoveDeliveryToDeadLetter`、`PrepareReplay` | HTTP JSON schema、header、actor / metadata、idempotency、error mapping、audit |
| Query API | `GetPublicationAcceptance`、`GetDeliveryStatus`、`ListDeliveryHistory`、`GetTransportView`、`GetFailureSummary`、`GetBusAuditTrail`、`GetBackendHealthView` | no write UoW、not found、stale marker、pagination / filter、access audit |
| Inbound Event Consumer | `ConsumeCommittedOutboxFact`、`ConsumeBackendDeliverySignal`、`ConsumeTimeoutSignal` | event envelope、event id、source ref、idempotency、duplicate、rejected / retryable failure |
| Outbound Event | `PublicationAcceptedEvent`、`PublicationRejectedEvent`、`DeliveryStateChangedEvent`、`FeedbackRecordedEvent`、`DeadLetterCreatedEvent`、`ReplayPreparationReadyEvent`、`TransportViewUpdatedEvent`、`FailureMaterialAvailableEvent`、`BackendCapabilityChangedEvent` | schema roundtrip、topic / kind、forbidden body absent、trace ref、publisher evidence |
| Operations Job | `RunOutboxRelay`、`RunDeliveryProgression`、`RunRetryCycle`、`RunReadOutputProjection`、`RebuildReadProjection`、`CheckBackendCapability` | job input / output schema、cursor、batch、partial success、item idempotency、summary |

### 3.5 哪些状态机、事务、一致性、幂等和恢复行为必须单列切口?

这些行为跨对象、跨 service、跨 repository,不能只靠对象单测覆盖。

| 横切行为 | 必须单列的测试切口 | 推荐层级 |
|---|---|---|
| Publication acceptance state | `Draft -> Accepted`、`Draft -> Rejected`、accepted / rejected 终态不可互改 | domain unit / service |
| Delivery lifecycle | `Scheduled / Dispatching / Delivered / Failed / DeadLettered` 合法迁移和非法跳转；`Completed` 由 feedback ack 覆盖 | domain unit / service / concurrency |
| Feedback result | ack / fail / timeout 一次生成即终态,duplicate / late feedback 处理 | domain unit / service |
| Retry / DLQ / replay state | retry scheduled / exhausted、DLQ active / archived、replay ready / rejected | domain unit / service |
| Projection status | missing / stale / rebuilding / current,Query 不自动 rebuild | service / repository |
| UnitOfWork consistency | 单 command / event / item 一个 UoW,truth 提交后 publisher / source ack / projection 失败不回滚 truth | service / integration |
| Idempotency | same key same digest existing、same key different digest conflict、event / job item duplicate | service / concurrency |
| Error recovery | validation / boundary 不重试、dependency retryable、commit uncertain manual evidence | service / adapter |
| Config failure mode | invalid JSON / unsupported key fail-fast、secret unavailable fail-closed、reload request rejected | config unit / integration |
| Observability / redaction | log / audit / event / projection / evidence 不含 payload body / raw secret / private body | redaction check / snapshot |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 旧 `05` 的测试对象已经过时 | 仍围绕 EventEnvelope、RoutingRule、CallbackEnvelope | 无法覆盖新版 publication / delivery / feedback / recovery / read-only output 主线 | 本步重新按新版 `02/03/04` 抽取对象 |
| 旧 `05` 缺少对象到切口的映射 | 对象、接口、状态机、事务和配置没有统一测试入口 | 后续用例容易只按接口列,漏掉不变量和一致性 | 本步建立对象 / 切口 / 风险 / 层级总表 |
| 配置与证据对象未进入测试对象 | 没有 `RuntimeConfig`、validator、redaction、reports 相关切口 | 配置错误和证据缺失无法验收 | 本步把配置控制面和证据归档列入 P0 测试对象 |
| 横切行为容易被分散遗漏 | 幂等、事务、publisher failure、Query no-write 不是单个对象 | 关键红线可能没有用例覆盖 | 本步单列横切切口 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 测试对象来源 | 旧协议对象和经验用例 | 概要 §5~§11 + 详细 §5~§15 | 与设计事实对齐 |
| 对象组织方式 | 按旧 envelope / routing 分类 | 按主要组成部分、对象、service、port、协议和横切行为分类 | 能支撑 Step 4 分层 |
| 风险表达 | 缺少对象级风险 | 每个对象绑定风险和推荐测试层级 | 便于 Step 6 生成用例 |
| 配置覆盖 | 基本缺失 | `RuntimeConfig`、loader、validator、redaction、runtime builder 进入测试对象 | 承接 `04` |
| 最小验证清单 | 未体现 | 覆盖 detailed design §15 的 module / protocol / state / consistency / idempotency / error / config / observability | 防止测试空洞 |

---

## 6. 测试设计取舍

### 6.1 是否按技术模块列测试对象

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 只按 `contracts / domain / application / infra / api / worker / jobs` 列 | 和代码目录一致 | 容易漏掉业务主线和横切红线 | 不采用 |
| B. 按业务组成部分 + 技术对象 + 横切行为三层抽取 | 能对应需求、设计和实现 | 表格更长 | 采用 |
| C. 只按用例列对象 | 直接面向执行 | 用例前对象边界不清,无法支撑测试分层 | 不采用 |

结论: Step 3 先建立业务组成部分到测试对象的映射,再补充 service / port / protocol / 横切切口。

### 6.2 是否每个 DTO / struct 都单独列为测试对象

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 每个 DTO / struct 都单列 | 覆盖看似完整 | 文档膨胀,不利于 review | 不采用 |
| B. 只列承担不变量、状态、边界、协议和接缝的对象 | 聚焦风险 | 需要后续 Step 6 补足具体用例 | 采用 |
| C. 只列 P0 API | 简洁 | 会遗漏 domain、repository、config、redaction | 不采用 |

结论: DTO 族按协议类别归并;领域对象、状态机、policy、repository、adapter 和配置对象按风险单列。

### 6.3 是否把 reports / artifacts 当作测试对象

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 在 Step 3 就纳入证据归档切口 | 能提前约束验收证据 | 详细规则要等 Step 13 展开 | 采用 |
| B. 等 Step 13 再首次提及 | Step 3 更轻 | 前面用例可能没有证据意识 | 不采用 |
| C. 完全交给实施计划 | 实现自由 | 测试方案无法证明结果可验收 | 不采用 |

结论: Step 3 只把 reports / artifacts 作为测试切口,具体目录、文件格式和生成规则在 Step 13 展开。

---

## 7. 结构化中间产物

### 7.1 测试对象分布图

```text
+---------------------------------------------------------------+
| P0 bus mainline                                               |
|                                                               |
| Publication -> Delivery -> Feedback -> Recovery               |
|      |             |            |            |                 |
|      v             v            v            v                 |
| Domain object  Application service  Repository / Port          |
|      |             |            |            |                 |
|      +-------------+------------+------------+                 |
|                    |                                      |
|                    v                                      |
|           Protocol / Worker / Job                         |
|                    |                                      |
|                    v                                      |
|        Read-only output / Audit / Evidence                 |
|                    |                                      |
|                    v                                      |
|        Config / Redaction / Reports gate                  |
+---------------------------------------------------------------+
```

图后说明：

- domain object 验证不变量、状态和边界。
- application service 验证事务、幂等、repository / port 编排和副作用顺序。
- protocol / worker / job 验证入口 schema、错误映射和处理流。
- config / redaction / reports 是 P0 验收证据链的一部分,不是附属内容。

### 7.2 测试对象与测试切口总表

| 测试对象 | 来源章节 | 测试切口 | 风险 | 推荐测试层级 |
|---|---|---|---|---|
| Publication domain objects | `02` §6.3~§6.6、`03` §5.3 / §6.1 | material 构造、accept / reject、不变量、payload boundary | 非法材料进入 bus 或 payload 越界 | domain unit |
| Transport semantic and backend boundary | `02` §6.5 / §6.22~§6.23、`03` §13 | semantic derive、capability mapping、禁止裸后端参数 | 后端差异泄漏到平台语义 | domain unit / service |
| Delivery domain objects | `02` §6.7~§6.9、`03` §9 | lifecycle、attempt、history、非法迁移 | delivery 状态不可追溯或非法跳转 | domain unit / service |
| Feedback and idempotency objects | `02` §6.10~§6.12、`03` §12 | feedback 终态、duplicate、same / different digest | 重复反馈污染 truth | domain unit / service |
| Recovery objects and policy | `02` §6.13~§6.17、`03` §9 / §11 | retry、DLQ、replay preparation、eligibility | replay 绕过材料链或 retry / DLQ 越界 | domain unit / service |
| Audit and read-only objects | `02` §6.18~§6.21、`03` §14 | audit append、projection derive、read-only policy | 只读输出反写真相或泄露正文 | domain unit / service |
| Config objects and validator | `03` §13、`04` §7~§11 | defaults、JSON parse、env override、secret ref、reload rejected | 配置错误静默生效或明文密钥泄露 | config unit / integration |
| Application services | `03` §5.4、`03` §8 | UoW、idempotency、repository / port 编排、audit / event 副作用 | 写路径顺序错误或副作用回滚语义错误 | service test |
| Repository ports | `03` §6.2、`03` §10 | unique、expected version、lock、append-only、projection version | 并发和一致性失效 | repository integration |
| External adapter ports | `03` §6.2 / §13 | source、publisher、transport、clock、id generator | source ack / publisher failure / backend failure 语义错误 | adapter integration |
| API handlers | `03` §7 / §8 | HTTP JSON、header、validation、error mapping | 协议字段和错误响应不稳定 | API / contract |
| Worker consumers | `03` §7 / §8 | inbound event schema、duplicate、retryable failure | at-least-once 消费不可靠 | consumer integration |
| Operations jobs | `03` §7 / §8 | item transaction、cursor、partial success、summary | job 重跑或部分成功不可追溯 | job runner |
| Outbound events | `03` §6.3 / §8.17 | schema、topic、trace ref、forbidden body absent | 下游消费材料不可信或泄露正文 | contract / publisher |
| State machines | `03` §9 | 合法 / 非法迁移、跨状态机禁止规则 | truth 状态不可裁决 | domain unit / service |
| Transaction and consistency | `03` §10 | UoW、publisher failure、source ack failure、projection failure | 已提交 truth 被错误回滚或副作用丢失 | service / integration |
| Error and recovery | `03` §11 | validation、boundary、dependency、commit uncertain | 重试策略错误或人工证据缺失 | service / adapter |
| Observability and redaction | `03` §14、`04` §12 | log、metric、audit、event、projection、evidence redaction | payload body、raw secret、private body 泄露 | snapshot / redaction check |
| Reports and artifacts | `03` §15.3、`04` §12 | artifact root、report root、redaction report、run summary | 测试结果无法被验收引用 | script / report check |

### 7.3 最小验证清单覆盖表

| 详细设计 §15 切口 | Step 3 覆盖对象 | 后续展开 |
|---|---|---|
| module tests | domain objects、application services、infra adapters、api / worker / jobs | Step 4 / Step 6 |
| protocol tests | Command / Query / Inbound Event / Outbound Event / Job | Step 4 / Step 6 |
| state machine tests | publication、delivery、feedback、retry、DLQ、replay、projection | Step 6 |
| consistency tests | repository、UnitOfWork、publisher、source ack、projection | Step 4 / Step 6 |
| idempotency tests | `IdempotencyAnchor`、`RequestDigest`、event id、job item key | Step 6 / Step 7 |
| error recovery tests | validation、boundary、dependency、commit uncertain、manual evidence | Step 6 / Step 10 |
| config tests | `RuntimeConfig`、loader、validator、secret ref、reload rejected | Step 8 / Step 10 |
| observability tests | log / metric / audit / event / projection / evidence redaction | Step 10 / Step 13 |

### 7.4 P0 对象覆盖状态表

| P0 范围 | 核心测试对象 | 覆盖状态 |
|---|---|---|
| Publication acceptance | Publication objects、Command API、Publication repository、audit | 已覆盖 |
| Transport semantic | TransportSemantic、BackendCapabilityPolicy、TransportBackendPort | 已覆盖 |
| Delivery progression | DeliveryRecord、DeliveryAttempt、DeliveryLifecycle、DeliveryProgressionService | 已覆盖 |
| Feedback recording | FeedbackResult、IdempotencyAnchor、FeedbackRecordingService、FeedbackRepository | 已覆盖 |
| Recovery operations | RetryPlan、DeadLetterEntry、ReplayPreparation、Recovery policy / repository | 已覆盖 |
| Read-only output | Query API、ReadOutputService、projection objects、ReadOnlyOutputPolicy | 已覆盖 |
| Outbox relay boundary | OutboxFactSourcePort、OutboxRelayConsumer、PublicationAcceptanceService | 已覆盖 |
| In-memory default path | in-memory repository / backend / publisher / source fixture | 已覆盖 |
| Config control plane | ConfigLoader、ConfigValidator、RuntimeBuilder、redaction checker | 已覆盖 |
| Reports and artifacts | CI gate script、report generator、redaction report | 已覆盖 |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/05_test_plan_step_03_test_objects_slices.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“测试设计取舍”和“待确认事项”小节，了解本章测试对象与测试切口如何从概要设计和详细设计中抽取。

本轮测试对象从新版 `02-概要设计.md` 和 `03-详细设计.md` 抽取,不沿用旧版 envelope / routing / callback 主线。测试对象分为 domain object / value object / policy、application service、repository / adapter / worker、Command / Query / Event / Job 协议、状态机与横切行为、配置控制面、观测审计和证据归档。

P0 必须覆盖 Publication、Delivery、Feedback、Recovery、Read-only output、Outbox relay、Backend boundary、Config control plane 和 Reports / artifacts。每个测试对象必须绑定测试切口、风险和推荐测试层级,后续 Step 4 再决定这些切口分别落在 unit、service、integration、API / consumer / job 或 release gate。

---

## 9. 待确认事项

当前没有阻塞进入 Step 4 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否在 Step 3 把每个 DTO 都单列 | A. 全部单列;B. 按协议类别归并;C. 只列 Command | 采用 B | DTO 数量多,按协议类别归并更适合测试方案;具体字段在 Step 6 用例和 schema tests 展开 |
| 是否把 reports / artifacts 视为测试对象 | A. Step 3 纳入;B. Step 13 再提;C. 不纳入测试对象 | 采用 A | 证据归档是验收前提,需要从测试切口阶段就纳入 |
| 是否把 production adapter 列为当前测试对象 | A. 全量列入;B. 只列 port / unsupported / unavailable 接缝;C. 完全不列 | 采用 B | P1 adapter 不进入 P0 全量测试,但接缝必须稳定 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 domain object / value object / policy 已有测试切口 | 已满足 |
| P0 application service 已有 service test 切口 | 已满足 |
| P0 repository / adapter / worker 已有集成测试切口 | 已满足 |
| P0 Command / Query / Event / Job 已有协议和流程测试切口 | 已满足 |
| 状态机、事务、一致性、幂等、恢复、配置、观测已单列切口 | 已满足 |
| 详细设计 §15 最小验证清单已覆盖 | 已满足 |

结论: 可以进入 Step 4,制定测试策略与分层。
