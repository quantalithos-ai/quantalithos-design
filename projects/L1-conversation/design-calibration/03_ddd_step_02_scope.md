# Step 2. 明确本轮实现范围和非范围

## 1. Step 状态

- 状态: `[x] 已确认`
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 2
- 回填章节: `projects/L1-conversation/03-详细设计.md` §2 本次详细设计目标与范围

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_01_upstream_boundary.md` | 已确认的上游关系映射、旧版 `03` 诊断和本文必须回答 / 不再回答范围 | 作为本步范围裁剪的直接输入 |
| `projects/L1-conversation/02-概要设计.md` §2 | 概要设计目标、范围和设计深度口径 | 防止详细设计回退成需求或架构讨论 |
| `projects/L1-conversation/02-概要设计.md` §5~§12 | 主要组成部分、关键对象、接口骨架、处理流、状态机、配置影响和详细设计承接清单 | 裁剪本轮必须覆盖的模块、对象、接口、流程和状态机 |
| `projects/L1-conversation/02-概要设计.md` §13 | 设计风险与待确认事项 | 识别哪些内容只能保守推进或放入 Step 18 |
| `standards/document/详细设计书写规范.md` | 详细设计 18 章主链和实现契约粒度 | 限制本步目标必须是实现契约目标 |
| `standards/document/设计文档讨论中间产物规范.md` | 中间产物结构、逐 Step 纪律和正式文档追溯要求 | 作为本文件结构约束 |

已确认结论:

```text
本轮详细设计覆盖 L1-conversation 的 P0 Conversation truth center 可实现闭环:
space / scope -> fact append -> authorized consumption -> cross-domain manifestation -> trace / review -> derived support -> reference / snapshot support -> outbox / handoff。

本轮详细设计也必须覆盖支撑该闭环的文件布局、对象、trait、DTO、处理流、状态机、持久化、配置引用、审计、可观测性、测试切口和实施承接。

本轮不展开 Chat UI、Workspace 聚合视图、Runtime 推理循环、Bridges 外部平台协议、Governance 裁决、Artifact 正文、Identity 生命周期、全局 Observability / Archive 存储、具体 SSE / WebSocket / AG-UI 协议产品、完整配置说明、完整测试方案、验收标准和实施计划。
```

依赖的前序 Step:

```text
Step 1 已确认详细设计直接承接 00 / 01 / 02,旧版 03 只作为问题诊断材料。
```

---

## 3. SOP 问题回答

### 3.1 本轮详细设计必须覆盖哪些模块？

本轮必须覆盖两类模块:Conversation truth center 主线模块和实现支撑模块。主线模块来自概要设计 §5 的 8 个主要组成部分;实现支撑模块来自概要设计 §4 的实现分层、§11 的配置影响和 §12 的详细设计承接清单。

必须覆盖的主线模块包括:

- `Conversation truth core`
- `Space / scope management`
- `Collaborative fact append`
- `Authorized consumption`
- `Cross-domain manifestation`
- `History trace / review`
- `Derived consumption support`
- `Local reference / snapshot / projection support`

必须覆盖的实现支撑包括 application services、domain policies、repository / unit of work、ports / adapters、outbox / handoff、projection stores、runtime config、observability / audit 和 test slices。

### 3.2 本轮必须定义哪些对象、接口、事件、job 和状态机？

本轮必须定义 `02-概要设计.md` §6 / §7 / §9 / §12 已收稳的全部关键主语:

- 30 个关键对象及其字段、函数、不变量和归属模块。
- 10 个 Command API、11 个 Query API、6 个 Inbound Event Consumer、9 个 Outbound Event、9 个 Operations Job。
- 15 组状态机,包括 truth、space、participant scope、visibility scope、scope change、fact、receipt、manifestation、reference、projection、cursor、outbox、trace retention、trace handoff 和 archive handoff。
- policy、repository、port、adapter、unit of work、config、audit、error、test slice 等实现支撑契约。

### 3.3 哪些能力属于 P1 / 后续阶段,不应在本轮展开？

不应在本轮展开为 P0 实现契约的能力包括:

- Chat UI 页面、组件、客户端状态、消息折叠、已读、草稿和排序策略。
- Workspace 个人首页、项目视野、inbox、任务板、项目聚合视图。
- Bridges 的 Mattermost / Slack / Telegram 等外部平台协议生命周期。
- Runtime 的 LLM 推理、agent loop、tool 调用、memory 写入和运行时上下文管理。
- Governance 的 gate / policy / approval 裁决真相。
- Artifact 的正文、版本、证据链和生命周期真相。
- Identity 的成员创建、生命周期、认证、授权裁决和角色定义。
- 全局 Observability / Archive 的 trace store、metrics store、长期归档包正文和恢复主体。
- 具体 SSE / WebSocket / AG-UI、搜索产品、数据库产品、队列产品、缓存产品和部署产品。

这些能力可以通过引用、port、event、handoff、projection 或下游消费边界体现,但不得写成本仓本轮必须实现的业务 truth。

### 3.4 哪些内容属于测试方案、实施计划、配置设计或运维手册？

详细设计只写实现契约和最小测试切口。以下内容必须后移:

- 完整配置 JSON 示例、默认值、环境变量名、secret 挂载方式和 profile 说明交给 `04-配置设计.md`。
- 完整测试策略、测试用例全集、自动化脚本、fixture、报告目录和证据格式交给 `05-测试方案.md`。
- 验收项、验收人、验收证据和通过 / 不通过标准交给 `06-验收标准.md`。
- 开发阶段、commit boundary、编码顺序、提交规范、报告生成、回滚方式交给 `07-实施计划.md`。
- 生产部署拓扑、告警阈值、备份恢复、日常运维 playbook 交给部署 / 运维文档。

### 3.5 实现者拿到本文后,应能完成哪些代码范围？

实现者拿到正式 `03-详细设计.md` 后,应能在目标实现仓完成 `L1-conversation` 的 P0 可运行代码骨架和可验证闭环:

- 仓库、crate / package、module、file、test 目录布局。
- Conversation truth、space、scope、fact、manifestation、trace、projection、reference、outbox、handoff 的 domain object 和 state enum。
- Command / Query / Consumer / Event / Job DTO、handler、application service、repository、port 和 adapter trait。
- 函数级处理流、unit of work、idempotency、transaction ordering、state guard、error mapping 和 recovery marker。
- runtime config struct、loader / validator / builder 注入、external dependency binding。
- observability、audit、trace、evidence marker 和最小测试切口。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` §1 / §2 | 范围仍围绕 Conversation / Turn / participant、StreamEvents、AG-UI 和 event-to-turn mapping | 会把新版 Conversation truth center 主线拉回旧聊天 / 推送口径 |
| 旧版 `03-详细设计.md` §3 / §5 | 模块按“对话空间与参与者、Turn 事实流、事件转对话、实时推送、检索投影”组织 | 与新版 8 个主要组成部分不一致 |
| 旧版对象范围 | `Turn`、`TurnKind`、`TurnPayload`、`StreamEvent`、`EventTurnMapping` 等旧对象作为主线 | 与新版 `ConversationFact`、`FactSourceRef`、`CrossDomainManifestation`、`ReferenceResolutionState` 等对象不一致 |
| 旧版流程范围 | `PostTurn`、`AppendSystemTurnFromEvent`、`StreamConversationEvents` 是主线 | 缺少 `AppendConversationFact`、`ManifestExternalFact`、authorized query、consumer、outbox、handoff job 等新主线 |
| 当前 `02-概要设计.md` | 已给出承接清单,但没有替代详细设计范围表 | 需要本 Step 把承接清单转成正式详细设计范围 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 本轮主线 | Conversation / Turn / StreamEvents / AG-UI | space / scope、fact、authorized consumption、manifestation、trace、derived support、reference、outbox / handoff | 对齐新版需求、架构和概要设计 |
| 范围表达 | 以旧对象和粗略采集流程表达 | 以模块、对象、接口、事件、job、状态机和横切契约表达 | 支撑后续 1:1 实现 |
| P1 能力 | 散落或隐含 | 显式列出后续能力和本轮处理口径 | 防止实现阶段范围膨胀 |
| 文档边界 | 详细设计混入配置、测试、实施、部署和运维内容 | 详细设计只写实现契约,其他文档各自承接 | 保持文档职责清晰 |
| 实现者交付 | 不清楚拿到 `03` 后能写到什么程度 | 明确应能完成 P0 Conversation truth center 可运行代码骨架和可验证闭环 | 满足“按详细设计 1:1 还原实现”的要求 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A:继续以 Turn / StreamEvents 作为详细设计核心范围 | 改动少,接近旧草案 | 会违背新版概要设计,并让实现者误把推送和展示层当 truth | 不采用 |
| 方案 B:覆盖 P0 Conversation truth center 闭环和必要横切契约,P1 只保留扩展边界 | 能支撑可运行闭环,又不会把 UI、runtime、bridges、observability 和 archive 提前写成本仓职责 | 需要 Step 6~15 细致展开 | 采用 |
| 方案 C:一次覆盖 Chat UI、Workspace、Runtime、Bridges、Governance、Artifact、Identity、Observability / Archive 协作细节 | 看似完整 | 范围过大,且大量能力属于其他仓,会污染 Conversation truth 边界 | 不采用 |

推荐方案:方案 B。

原因:

- `L1-conversation` 的核心职责是 Conversation truth center,不是聊天 UI 或外部平台消息服务。
- P0 必须形成可实现的 space / scope、fact append、authorized read、manifestation、trace、projection、reference 和 handoff 闭环。
- 下游 UI、workspace、runtime、bridges、observability 和 archive 需要通过边界协作,不能进入本仓详细设计核心范围。

---

## 7. 结构化中间产物

### 7.1 设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 定义 P0 Conversation truth center 实现契约 | 覆盖 space / scope、fact append、authorized consumption、manifestation、trace、derived support、reference、outbox 和 handoff | 实现者可以按模块完成 command、query、consumer、job、policy、repository、port 和 adapter |
| 定义对象和状态实现契约 | 把概要设计 §6 / §9 的对象和状态补成 Rust 类型、字段、函数和状态矩阵 | 实现者可以创建 domain model、value object、record、policy 和 enum |
| 定义接口和协议实现契约 | 把概要设计 §7 的 Command / Query / Consumer / Event / Job 补成 DTO、handler、metadata 和错误映射 | 实现者可以实现同步写入、授权读取、事件消费、outbox 发布和后台 job |
| 定义函数级处理流 | 把概要设计 §8 的处理流展开到 handler -> service -> domain / policy -> repository / port -> event / result | 实现者可以还原关键函数调用链、事务边界和失败分支 |
| 定义横切契约 | 覆盖错误、幂等、并发、配置引用、审计、可观测性和测试切口 | 实现者不用临时发明错误模型、锁、配置加载、审计和测试结构 |
| 定义实施承接边界 | 把详细设计可实现内容交给实施计划继续拆分 | 实施计划可以按功能边界和依赖顺序组织开发 |

### 7.2 本轮范围表

| 范围 | 必须展开到的深度 |
|---|---|
| 实现单元与文件布局 | crate / module / package / file / binary / test 目录级别,具体由 Step 4 定义 |
| 模块实现契约 | 每个主要模块的职责、对象、trait、service、handler、repository、error、测试切口 |
| 对象实现契约 | struct / enum / value object / policy 的字段、类型、函数签名、Rustdoc 注释和禁止事项 |
| 协议实现契约 | Command / Query / Consumer / Event / Job 的 DTO、response、schema、handler、错误映射 |
| 函数级处理流 | 逐接口说明对象.函数(Type 参数名) 调用、事务、幂等、audit、event 和失败分支 |
| 状态机 | 状态枚举、允许迁移、禁止迁移、状态守卫、非法迁移错误和状态测试 |
| 持久化与一致性 | repository、unit of work、transaction ordering、outbox、projection、reference、handoff 一致性 |
| 配置实现契约 | ConversationRuntimeConfig、ConfigLoader、ConfigValidator、builder 注入和禁止配置化校验 |
| 可观测性与测试切口 | audit、trace、metric、log、report evidence、contract test 和 negative test |

### 7.3 必须覆盖的模块范围

| 模块范围 | 必须覆盖 | 不在本步提前决定 |
|---|---|---|
| `Conversation truth core` | truth state、truth policy、outbox record、truth repository、unit of work | 具体 crate / 文件名由 Step 4 决定 |
| `Space / scope management` | conversation space、participant scope、visibility scope、scope change、visibility policy | 具体权限裁决实现不由本仓重新定义 |
| `Collaborative fact append` | conversation fact、fact source ref、fact append policy、append receipt、fact history | runtime 推理过程、tool 调用过程和外部消息正文不进入本仓 |
| `Authorized consumption` | read model、change cursor、visibility filtering、query service、projection fallback | 具体 SSE / WebSocket / AG-UI 协议不进入本轮 |
| `Cross-domain manifestation` | external fact ref、safe snapshot、manifestation record、reference validity、manifestation policy | 来源仓正文和生命周期不进入本仓 |
| `History trace / review` | trace context、review anchor、trace handoff、archive handoff、retention policy | 全局 observability / archive store 不进入本仓 |
| `Derived consumption support` | projection state、search projection、cursor projection、derived view policy、rebuild jobs | 具体搜索产品、队列产品、缓存产品不提前选型 |
| `Local reference / snapshot / projection support` | reference resolution state、external reference projection、snapshot store、refresh job、source resolver port | 外部正文、secret 和来源 truth 不进入本仓 |
| 实现支撑 | config、repository、outbox、adapter、audit、error、test slices | 配置说明、完整测试方案和实施计划后移 |

### 7.4 必须定义的对象、接口、事件、job 和状态机

| 类型 | 本轮必须定义 |
|---|---|
| Domain / record / value object / policy | `ConversationTruthState`、`ConversationTruthPolicy`、`ConversationOutboxRecord`、`ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`VisibilityPolicy`、`ScopeChangeRecord`、`ConversationFact`、`FactSourceRef`、`FactAppendPolicy`、`FactAppendReceipt`、`ConversationReadModel`、`ConversationChangeCursor`、`CrossDomainManifestation`、`ExternalFactRef`、`ExternalFactSnapshot`、`ManifestationPolicy`、`ReferenceValidityPolicy`、`ConversationTraceContext`、`ReviewAnchor`、`TraceHandoffRecord`、`ArchiveHandoffRecord`、`TraceRetentionPolicy`、`ConversationProjectionState`、`SearchIndexProjection`、`ChangeCursorProjection`、`DerivedViewPolicy`、`ReferenceResolutionState`、`ExternalReferenceProjection` |
| Command API | `CreateConversationSpace`、`CloseConversationSpace`、`UpdateParticipantScope`、`UpdateVisibilityScope`、`AppendConversationFact`、`RetractConversationFact`、`ManifestExternalFact`、`CreateReviewAnchor`、`RequestTraceHandoff`、`RequestArchiveHandoff` |
| Query API | `GetConversationReadModel`、`ListConversationFacts`、`GetConversationFact`、`GetConversationChangeCursor`、`PollConversationChanges`、`SearchConversationHistory`、`GetCrossDomainManifestation`、`GetConversationTraceContext`、`GetReviewAnchor`、`GetConversationProjectionState`、`GetExternalReferenceProjection` |
| Inbound Event Consumer | `ConsumeWorkContextChanged`、`ConsumeGovernanceFactCommitted`、`ConsumeArtifactFactCommitted`、`ConsumeRuntimeResultCommitted`、`ConsumeBridgeMappedFactReceived`、`ConsumeIdentityActorChanged` |
| Outbound Event | `ConversationSpaceChangedEvent`、`ConversationScopeChangedEvent`、`ConversationFactAppendedEvent`、`ConversationFactRetractedEvent`、`CrossDomainManifestationChangedEvent`、`ConversationChangeAvailableEvent`、`TraceHandoffRequestedEvent`、`ArchiveHandoffRequestedEvent`、`ConversationProjectionStateChangedEvent` |
| Operations Job | `PublishConversationOutbox`、`RebuildConversationReadModels`、`RebuildConversationSearchIndex`、`MaintainConversationChangeCursors`、`RefreshExternalReferenceSnapshots`、`DeliverTraceHandoff`、`DeliverArchiveHandoff`、`ValidateConversationConsistency`、`CleanupExpiredConversationCursors` |
| 状态主语 | `ConversationTruthState`、`ConversationSpaceLifecycleState`、`ParticipantScopeState`、`VisibilityScopeState`、`ScopeChangeRecord`、`ConversationFactState`、`FactAppendResult`、`ManifestationState`、`ReferenceResolutionState`、`ProjectionFreshnessState`、`ConversationChangeCursorState`、`ConversationOutboxPublicationState`、`TraceRetentionState`、`TraceHandoffState`、`ArchiveHandoffState` |
| Port / repository / adapter | actor / identity resolver port、source fact resolver port、bus outbox publisher port、observability handoff port、archive handoff port、truth repository、fact repository、scope repository、manifestation repository、trace repository、projection repository、snapshot repository、cursor repository、idempotency repository、unit of work |

### 7.5 P1 / 后续能力表

| P1 / 后续能力 | 本轮处理口径 | 原因 |
|---|---|---|
| Chat UI 展示、客户端状态、消息交互细节 | 只保留 authorized consumption / downstream read boundary | 属于 `L5-chat` |
| Workspace 个人首页、项目视野、inbox 和任务板 | 只保留 query / event / projection 输出边界 | 属于 `L1-workspace` |
| 外部平台协议生命周期 | 只保留 bridge mapped fact consumer 和 reference / fact boundary | 属于 `L6-bridges` |
| Runtime 推理、tool 调用、memory 写入 | 只允许 result fact / source ref / consumer boundary | 属于 `L2-runtime` / `L2-tools` |
| Governance 裁决和 Artifact 正文 | 只允许 external fact ref / snapshot / manifestation | 来源 truth 属于对应仓 |
| Identity 生命周期和授权裁决 | 只使用 actor / participant ref 与展示 snapshot marker | 成员 truth 属于 `L1-identity` |
| 全局 observability / archive store | 只定义 handoff record 和 handoff port | 全局存储和长期恢复属于 `L4` 仓 |
| 具体协议 / 产品选型 | 只定义 port / adapter / projection contract | 详细设计不提前锁定 SSE、WebSocket、AG-UI、搜索、队列、缓存或数据库产品 |
| 完整配置、测试、验收、实施、运维文档 | 只保留实现契约和最小切口 | 分别由 `04`、`05`、`06`、`07` 或运维文档承接 |

### 7.6 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、用户故事、业务规则、数据归属重新定义 | `00-需求文档.md` |
| 系统上下文、限界上下文、技术选型、部署拓扑重新取舍 | `01-架构设计.md` / 架构专项 |
| 主要组成部分、关键对象、接口名、处理流名、状态集合重新命名 | `02-概要设计.md` 对应 Step |
| `L0-core` 的共享 ID、ActorRef、TraceContext、Error、metadata、evidence、配置和报告口径 | `projects/L0-core` |
| `L0-bus` 的事件发布、订阅、ack、retry、dead-letter、replay、tap truth | `projects/L0-bus` |
| `L0-sdk` 的默认 client / integration access 和 SDK consumer 边界 | `projects/L0-sdk` |
| `L1-identity` 的成员、AI member、system actor、角色和生命周期 | `projects/L1-identity` |
| 完整配置 JSON 示例、默认值、配置项填写说明、环境变量说明 | `04-配置设计.md` |
| 完整测试矩阵、测试脚本、测试报告和证据归档格式 | `05-测试方案.md` |
| 验收项、验收人、验收证据和通过 / 不通过标准 | `06-验收标准.md` |
| 实施阶段、commit boundary、编码顺序、提交规范、报告产物 | `07-实施计划.md` |
| 生产部署拓扑、集群参数、备份恢复演练、日常运维 playbook | 运维手册 / 部署文档 |

### 7.7 实现者可完成代码范围图

```text
Formal 03 implementation scope
|
+-- Project structure and module / package layout
+-- Conversation truth, space, scope, fact and manifestation domain objects
+-- Trace, review, projection, reference, outbox and handoff records
+-- Command / Query / Consumer / Event / Job handlers and application services
+-- Repository / UnitOfWork / Port / Adapter traits
+-- State enums, transition guards and invalid transition errors
+-- Persistence, transaction, idempotency, outbox and projection contracts
+-- Runtime config structs, loader, validator and builder injection
+-- Error model, recovery behavior, concurrency guard and observability markers
+-- Test slices required by 05-test-plan
```

关键说明:

- 图中范围是详细设计必须支持的代码范围,不是一次 commit 或一个 sprint 的拆分。
- UI、workspace、runtime、bridges、governance、artifact、identity、observability 和 archive 只能通过边界协作出现,不作为本仓业务 truth。
- 正式 `03` 应足以让实现者完成可编译、可测试、可运行的默认路径,不依赖额外口头约定。

---

## 8. 回填草稿

正式 `03-详细设计.md` §2 “本次详细设计目标与范围”应摘录并整理:

- 本文件 §7.1 设计目标表。
- 本文件 §7.2 本轮范围表。
- 本文件 §7.3 必须覆盖的模块范围。
- 本文件 §7.4 必须定义的对象、接口、事件、job 和状态机。
- 本文件 §7.5 P1 / 后续能力表。
- 本文件 §7.6 非范围表。

实现者可完成代码范围图可作为 §2 的范围说明图保留。

---

## 9. 待确认事项

- 无阻塞进入 Step 3 的待确认事项。
- 来源仓字段级契约、projection / search / cursor 技术承载、配置说明独立成文、consistency validation 修复边界、handoff payload 脱敏类型和 actor 展示快照来源继续作为后续 Step 输入,不得在 Step 2 写成稳定实现契约。

---

## 10. 进入下一步条件

- [x] 已明确本轮详细设计必须覆盖哪些模块。
- [x] 已明确本轮必须定义哪些对象、接口、事件、job 和状态机。
- [x] 已明确哪些能力属于 P1 / 后续阶段。
- [x] 已明确哪些内容属于配置设计、测试方案、验收标准、实施计划或运维手册。
- [x] 已明确实现者拿到正式 `03-详细设计.md` 后应能完成的代码范围。
- [x] 已足以进入 Step 3 “收稳编码规范、语言 / runtime、仓库约束”。
