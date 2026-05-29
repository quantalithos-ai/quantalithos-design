# Step 12. 详细设计承接清单

## 1. Step 状态

- 状态：[x] 已创建
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 12
- 回填章节：`projects/L0-bus/02-概要设计.md` §12 详细设计承接清单

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 4 代码主体框架 | 已收稳业务主线与实现分层关系 |
| Step 5 主要组成部分 | 已收稳六个主要组成部分及职责边界 |
| Step 6 关键对象轮廓 | 已收稳关键对象、字段骨架、状态、成员函数、工厂函数和禁止事项 |
| Step 7 API / 接口骨架 | 已收稳 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 和 port / repository 边界 |
| Step 8 关键处理流 | 已收稳关键写路径、事件消费、operations job、query 通用读路径和 outbound event 通用发布路径 |
| Step 9 状态机 | 已收稳状态所有权、状态定义、核心迁移、禁止迁移和传播关系 |
| Step 10 异常边界 | 已收稳关键异常、边界红线和处理流异常反查 |
| Step 11 配置影响 | 已收稳配置影响轮廓、禁止配置化边界和详细设计配置契约方向 |

已确认结论：

```text
Step 12 只做概要设计到详细设计的交付清单。
不新增对象、接口、流程、状态或配置项。
```

---

## 3. SOP 问题回答

### 3.1 哪些代码主体框架已经由概要设计收稳，详细设计不能重新发明？

回答：

详细设计必须承接事件传递主线和 ports and adapters 分层。业务主要组成部分是：发布材料接入与传递语义形成、订阅 delivery 推进、结果反馈与幂等留痕、失败恢复与重放准备、审计历史与只读输出、存储引用与后端适配边界。实现分层是 Inbound / Operations、Application Services、Domain Model / Policies、Ports / Persistence / Projection / Adapters。

### 3.2 哪些对象、接口、处理流和状态机已经成为详细设计输入？

回答：

对象以 Step 6 的正式关键对象为输入；接口以 Step 7 的 Command / Query / Event / Job 分类为输入；处理流以 Step 8 的独立处理流和通用读 / 发布路径为输入；状态机以 Step 9 的状态所有权、状态定义、允许迁移、禁止迁移和传播关系为输入。

### 3.3 详细设计应继续展开哪些字段、协议、函数、事务、异常和测试内容？

回答：

详细设计继续展开 Rust struct / enum / trait、DTO schema、repository trait、application service 函数签名、transaction / unit of work、error enum / error mapping、adapter result type、projection consistency marker、config implementation contract、test matrix 和 integration boundary。详细设计不能改名或暗改概要设计已经收稳的主语。

### 3.4 如果详细设计发现主语需要变更，应回退到哪里修正？

回答：

如果详细设计发现对象、接口、流程、状态机或配置边界需要变更，应回退到对应概要设计 Step 修正：对象回 Step 6，接口回 Step 7，处理流回 Step 8，状态机回 Step 9，异常边界回 Step 10，配置影响回 Step 11。不能在详细设计中直接暗改。

### 3.5 哪些配置影响需要交给详细设计收口为实现契约？

回答：

详细设计需要收口 `RuntimeConfig`、`ConfigLoader`、`ConfigValidator`、`AdapterConfig`、`JobConfig`、`StoreConfig`、`ProjectionConfig`、`PublisherConfig`、`ConfigError`、runtime builder 注入关系、adapter constructor、repository constructor 和 policy factory 构造关系。

### 3.6 哪些未闭环内容不能写入承接清单，而应进入风险与待确认事项？

回答：

仍带方案选择性质的内容不能写入承接清单作为硬结论，应进入 Step 13：late ack 是否允许改回 completed、projection missing 是否自动触发 rebuild、backend capability 变化是否自动重调度 delivery、RequestRetry 是否直接让 failed -> scheduled、PrepareReplay 是否一步到 ready、是否给 backend capability 定义独立状态集合。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `02-概要设计.md` | 没有稳定的详细设计承接清单 | 03 可能重新发明对象、接口、流程和状态机 |
| Step 4~11 | 各 Step 已经形成大量稳定主语 | 如果不集中交付，详细设计难以判断哪些不能变 |
| Step 9~11 | 存在少量待确认项 | 需要进入 Step 13，而不是混入详细设计输入 |
| 正式文档生成前 | 中间产物仍分散在多个文件 | Step 14 需要统一摘录并形成正式 §12 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 详细设计输入 | 分散在 Step 4~11 | 集中形成承接清单 | 便于 03 一比一展开 |
| 变更规则 | 未集中说明 | 明确发现主语变化必须回退概要设计 | 防止详细设计暗改概要结论 |
| 待确认项 | 容易被当成已收稳结论 | 标记进入 Step 13 | 保持承接清单只含稳定内容 |
| 配置承接 | 只在 Step 11 描述 | 纳入详细设计实现契约方向 | 保证配置设计与详细设计联动 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：不写承接清单，直接进入详细设计 | 少写一章 | 详细设计容易漂移或重复决策 | 不采用 |
| 方案 B：把所有 Step 4~11 内容完整复制到承接清单 | 最完整 | 正式文档冗长，且重复中间产物 | 不采用 |
| 方案 C：按主题列稳定输入和详细设计继续展开方向，待确认项进入 Step 13 | 清晰、可审查、可承接 | 需要后续 Step 13 再收口风险 | 采用 |

---

## 7. 结构化中间产物

### 7.1 详细设计承接清单表

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| 业务主线：publication acceptance -> delivery -> feedback -> recovery -> read-only output | 03 继续定义 module / crate / package 组织、application service 编排和 repository / adapter 落点 |
| 实现分层：Inbound / Operations、Application Services、Domain Model / Policies、Ports / Persistence / Projection / Adapters | 03 继续定义每层的 Rust module、trait、struct、dependency direction 和 constructor 注入 |
| 六个主要组成部分 | 03 继续按组成部分展开对象、接口、处理流、事务和测试矩阵，不按运行容器重新切分业务边界 |
| `PublicationMaterial`、`PublicationAcceptance`、`TransportSemantic`、`PayloadBoundaryGuard` | 03 继续定义字段全集、value object、constructor、validation、reject error 和 repository 关系 |
| `DeliveryRecord`、`DeliveryAttempt`、`DeliveryLifecycle` | 03 继续定义 delivery aggregate、attempt record、state transition function、backend port result mapping 和 persistence contract |
| `FeedbackResult`、`IdempotencyAnchor`、`DeliveryHistoryEntry` | 03 继续定义 feedback DTO、idempotency key scope、history append contract、duplicate handling 和 transaction boundary |
| `RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、`FailureMaterial`、`RecoveryEligibilityPolicy` | 03 继续定义 recovery service、retry / DLQ / replay repository、trusted chain validation、policy factory 和 recovery errors |
| `BusAuditEntry`、`TransportViewProjection`、`FailureSummaryProjection`、`ReadOnlyOutputPolicy` | 03 继续定义 audit append contract、projection builder、projection repository、consistency marker 和 read-only guard |
| `BackendCapabilityRef`、`BackendCapabilityPolicy` | 03 继续定义 backend capability source、adapter config、secret reference、capability check result 和 mapping policy |
| Command API：`AcceptPublication`、`RecordDeliveryFeedback`、`RequestRetry`、`MoveDeliveryToDeadLetter`、`PrepareReplay` | 03 继续定义 protocol DTO、handler、application service function signature、error mapping 和 idempotency contract |
| Query API：`GetPublicationAcceptance`、`GetDeliveryStatus`、`ListDeliveryHistory`、`GetTransportView`、`GetFailureSummary`、`GetBusAuditTrail`、`GetBackendHealthView` | 03 继续定义 query DTO、view DTO、pagination / filter、consistency marker、not-found / stale behavior |
| Inbound Event Consumer：`ConsumeCommittedOutboxFact`、`ConsumeBackendDeliverySignal`、`ConsumeTimeoutSignal` | 03 继续定义 event envelope binding、source ref、event id、idempotency key、dead signal handling 和 consumer transaction |
| Outbound Event：accepted / rejected / state changed / feedback recorded / DLQ / replay ready / projection updated / capability changed | 03 继续定义 event schema、outbox publisher contract、topic / routing mapping、retry behavior 和 payload boundary |
| Operations Job：outbox relay、delivery progression、retry cycle、projection run / rebuild、backend capability check | 03 继续定义 job runner、cursor / checkpoint、batch, timeout, retry config injection、lock and concurrency control |
| Port / Repository 边界 | 03 继续定义 repository trait、unit of work、optimistic locking、store adapter、clock / id generator 和 test doubles |
| Step 8 独立处理流 | 03 继续定义 full service call graph、transaction scope、error branch、idempotency conflict and integration tests |
| Query 通用只读处理流 | 03 继续定义 read repository, projection stale / missing behavior, consistency marker and authorization context pass-through |
| Outbound Event 通用发布路径 | 03 继续定义 outbox table / store contract、publisher retry、event status and replay of publication |
| 状态机：`PublicationAcceptanceStatus`、`DeliveryStatus`、`FeedbackStatus`、`RetryPlanStatus`、`DeadLetterStatus`、`ReplayPreparationStatus`、`ProjectionStatus` | 03 继续定义 Rust enum、transition validation、state error mapping、persistence representation and transition tests |
| 禁止迁移清单 | 03 继续定义 transition guard、error type and negative test cases |
| 异常与边界场景 | 03 继续定义 error enum、adapter exception mapping、idempotency conflict response、projection error and audit material |
| 边界红线：不保存 payload body、不保存 backend private response、不让 projection 反写 truth、不绕过 trusted chain | 03 继续定义 validator / guard / repository separation and tests proving the red lines |
| 配置影响轮廓 | 03 继续定义 `RuntimeConfig`、`ConfigLoader`、`ConfigValidator`、`AdapterConfig`、`JobConfig`、`StoreConfig`、`ProjectionConfig`、`PublisherConfig`、`ConfigError` |
| 禁止配置化边界 | 03 继续定义 config validation rules and builder restrictions; 04 配置说明继续定义配置填写、校验和使用说明 |

### 7.2 详细设计继续展开方向说明

| 展开方向 | 详细设计应补充 | 不应在详细设计中做什么 |
|---|---|---|
| 数据结构 | Rust struct / enum / value object、字段类型、字段注释、枚举值注释 | 不改 Step 6 已收稳的对象主语 |
| 函数与服务 | application service、domain method、factory、repository trait、adapter trait 的正式签名 | 不新增绕过概要流程的新入口 |
| 协议与 DTO | command / query / event / job DTO、request / response、event schema | 不改变 Step 7 接口分类 |
| 事务与一致性 | `UnitOfWork`、repository 保存顺序、idempotency、history / audit 同步关系 | 不让 projection 或 query 反写 truth |
| 状态机 | enum、transition guard、forbidden transition error、状态迁移测试 | 不新增 Step 9 未定义的状态集合 |
| 异常处理 | error enum、error mapping、adapter exception、retry / DLQ / projection stale behavior | 不把错误码设计反向改变概要边界 |
| 配置契约 | runtime config、loader、validator、adapter / job config、builder 注入 | 不写业务对象直接读取配置文件 |
| 测试输入 | 单元测试、集成测试、contract test、negative transition test、configuration validation test | 不在详细设计里替代测试方案全集 |

### 7.3 概要设计回退规则说明

```text
如果详细设计发现上述主语需要变更，说明概要设计尚未真正收稳，应先回到概要设计修正，而不是在详细设计中暗改。
```

具体回退规则：

| 详细设计发现的问题 | 回退位置 |
|---|---|
| 需要新增 / 删除 / 改名关键对象 | 回到 Step 6 关键对象轮廓 |
| 需要新增 / 删除 / 改名正式 API / Event / Job | 回到 Step 7 API / 接口骨架 |
| 需要改变关键处理流顺序或职责归属 | 回到 Step 8 关键处理流 |
| 需要新增状态集合或改变允许 / 禁止迁移 | 回到 Step 9 状态机 |
| 需要改变异常红线或恢复边界 | 回到 Step 10 异常与边界场景 |
| 需要改变配置影响或禁止配置化边界 | 回到 Step 11 配置影响轮廓 |
| 仍是方案选择或风险判断 | 进入 Step 13 设计风险与待确认事项 |

### 7.4 不进入承接清单的待确认项

| 待确认项 | 当前处理 |
|---|---|
| late ack 是否允许把 failed 改回 completed | 进入 Step 13，当前不作为详细设计硬输入 |
| projection missing 是否自动触发 rebuild | 进入 Step 13，当前不作为详细设计硬输入 |
| backend capability 变化是否自动重新调度 delivery | 进入 Step 13，当前不作为详细设计硬输入 |
| `RequestRetry` 是否让 `DeliveryStatus.failed -> scheduled` | 进入 Step 13，当前按推荐方案推进但不作为不可变输入 |
| `PrepareReplay` 是否一步到 ready | 进入 Step 13，当前按推荐方案推进但不作为不可变输入 |
| 是否定义 `BackendCapabilityStatus` | 进入 Step 13，当前推荐不新增状态集合 |

---

## 8. 回填草稿

正式 `projects/L0-bus/02-概要设计.md` §12 “详细设计承接清单”应从本文件摘录并整理以下内容：

- §12.1 “详细设计承接清单表”
- §12.2 “详细设计继续展开方向说明”
- §12.3 “概要设计回退规则说明”
- §12.4 “不进入承接清单的待确认项”

不在本 Step 重复粘贴正式文档完整正文。Step 14 生成正式文档时，应按本文件摘录并补充校准来源、延伸阅读、正式文档语气和章节衔接。

---

## 9. 待确认事项

| 待确认项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| Step 12 是否纳入待确认项 | A：纳入承接清单；B：单列为不进入承接清单并交给 Step 13 | 建议 B | 承接清单必须只包含稳定输入 |
| 是否在本步列开发任务 | A：列；B：不列，留给实施计划 | 建议 B | 概要设计承接清单不是实施计划 |
| 是否在本步画图 | A：画；B：不画 | 建议 B | 书写规范明确本章禁止画图 |

以上待确认项不阻塞进入 Step 13。除非后续讨论明确改变，否则后续 Step 按“建议方案”继续展开。

---

## 10. 进入下一步条件

- 已明确概要设计向详细设计交付哪些稳定输入。
- 已明确详细设计继续展开哪些字段、协议、函数、事务、异常、配置和测试内容。
- 已明确发现主语变更时必须回退到概要设计对应 Step。
- 已明确仍未闭环的内容不进入承接清单，而进入 Step 13。
- 已避免新增对象、接口、流程、状态、开发任务、排期、测试用例全集和实施指令。
