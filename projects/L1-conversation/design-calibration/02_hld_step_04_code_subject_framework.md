# Step 4. 代码主体框架映射

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 4
> 回填章节: `02-概要设计.md` §4 代码主体框架总览
> 生成日期: 2026-06-01
> 状态: 已完成

---

## 1. 本步目标

把架构设计中已经收稳的语义上下文、运行承载和依赖方向转译为后续详细设计可以继续展开的代码主体骨架。重点是确认哪些是 `L1-conversation` 的业务主要组成部分,哪些只是 Inbound / Application / Domain / Ports / Persistence / Projection / Outbox / Operations 等实现分层。

本步不定义代码目录、crate、文件路径、完整 trait、完整 struct、API schema、数据库表或部署结构。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_01_upstream_boundary.md` | 已完成 | 提供上游边界和旧文档不可继承口径 |
| `02_hld_step_02_goals_scope.md` | 已完成 | 提供代码主体骨架层的设计深度 |
| `02_hld_step_03_constraints.md` | 已完成 | 提供 truth center、依赖裁剪、数据归属、通信分层和配置不可越界约束 |
| `01-架构设计.md` §6 | 已完成 | 提供 Conversation 真相核心、支撑上下文和本地索引 / 投影 / 引用层 |
| `01-架构设计.md` §7 | 已完成 | 提供同步入口、异步输入、后台派生、真相承载和派生承载 |
| `01-架构设计.md` §8 | 已完成 | 提供核心语义、编排 / 承接、外部接缝、派生辅助和技术承载分层 |
| `01-架构设计.md` §9 / §10 | 已完成 | 提供数据所有权、一致性和同步 / 异步 / 后台承接口径 |

---

## 3. SOP 问题回答

### 3.1 架构层已经收稳的模块，分别应落到哪些代码主体骨架上？

架构层的语义上下文不直接等同代码目录,而应先映射为代码主体骨架:

- `Conversation 真相核心` 落到核心 domain model、domain policy、truth repository、fact history store 和 outbox 事件形成主体。
- `对话空间与范围管理上下文` 落到 space / participant scope / visibility scope 的 command service、domain object、repository 和授权读边界。
- `协作事实追加上下文` 落到 fact append command service、append policy、conversation fact、fact source reference、append receipt 和 fact history repository。
- `授权消费上下文` 落到 query service、visibility guard、conversation read model、subscription / change cursor view 和 projection repository。
- `跨域事实显化上下文` 落到 manifestation command / event service、external fact reference、source snapshot、manifestation record 和 source reference resolver port。
- `历史追溯上下文` 落到 trace / review query service、trace context、review anchor、audit / archive handoff record 和 observability / archive handoff port。
- `派生消费辅助上下文` 落到 projection refresh service、search / index maintenance job、change cursor maintenance job、derived view state 和 rebuild status。
- `本地索引 / 投影 / 引用层` 落到 snapshot / projection / reference store、external reference projection、stale / unresolved state 和相关 adapter,但不成为外部正文 owner。

### 3.2 哪些主体属于 Inbound / Operations，哪些属于 Application Services？

| 分层类别 | 代码主体骨架 | 判断口径 |
|---|---|---|
| Inbound | command intake、query intake、event intake、subscription intake | 只负责把同步请求、查询请求、入站事件或订阅请求转成 application input,不做业务判定 |
| Operations | projection rebuild job、snapshot refresh job、change cursor maintenance job、trace / archive handoff job | 只负责受控维护、重建、交接或补偿触发,不得生成新业务事实 |
| Application Services | space / scope command service、fact append command service、manifestation service、authorized read service、trace review service、derived maintenance service | 负责事务编排、幂等、权限 / 可见性检查调用、domain 调用、repository / port 调用和 outbox 形成 |

Inbound 和 Operations 是进入系统的承载形态;Application Services 是用例编排主体。它们都不是业务主要组成部分名称。

### 3.3 哪些主体属于 Domain Model，哪些属于 Ports / Persistence / Projection / Outbox？

| 分层类别 | 代码主体骨架 | 判断口径 |
|---|---|---|
| Domain Model | `ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`ConversationFact`、`FactSourceRef`、`CrossDomainManifestation`、`ExternalFactRef`、`ConversationTraceContext`、`DerivedViewState` | 表达本仓业务规则、状态、不变量和禁止事项 |
| Domain Policy / Guard | `VisibilityPolicy`、`FactAppendPolicy`、`ManifestationPolicy`、`ReferenceValidityPolicy`、`DerivedViewPolicy`、`TraceRetentionPolicy` | 判断是否允许成立、显化、消费、派生或交接 |
| Ports | actor / identity reference port、work context port、governance reference port、artifact reference port、runtime result port、bus event port、observability handoff port、archive handoff port | 表达外部协作能力,不把外部仓正文拉进本仓 truth |
| Persistence | conversation truth repository、space / scope repository、fact history repository、manifestation repository、trace context repository | 保存本仓正式 truth 和追溯上下文 |
| Projection | conversation read projection、visibility projection、search index projection、change cursor projection、external snapshot projection | 保存派生只读结构,可延迟、可重建、不得反写 |
| Outbox | conversation fact outbox、manifestation outbox、trace handoff outbox | 记录已成立事实传播和交接意图,传播失败不取消 truth |

### 3.4 哪些名称必须在概要设计层先点名，否则详细设计会重新发明主语？

必须先点名的代码主体名称包括:

- 业务主要组成部分:Conversation truth core、space / scope management、collaborative fact append、authorized consumption、cross-domain manifestation、history trace / review、derived consumption support、local reference / snapshot / projection support。
- Application services:ConversationSpaceCommandService、ParticipantScopeCommandService、VisibilityScopeCommandService、ConversationFactAppendService、ConversationManifestationService、AuthorizedConversationQueryService、ConversationTraceReviewService、ConversationDerivedMaintenanceService。
- Domain objects / policies:ConversationSpace、ParticipantScope、VisibilityScope、ConversationFact、FactSourceRef、CrossDomainManifestation、ExternalFactRef、ConversationTraceContext、ConversationProjectionState、VisibilityPolicy、FactAppendPolicy、ManifestationPolicy、ReferenceValidityPolicy、DerivedViewPolicy。
- Ports / stores:ConversationTruthRepository、ConversationFactHistoryRepository、ManifestationRepository、ConversationProjectionRepository、ExternalReferenceSnapshotRepository、ConversationOutboxRepository、ActorReferencePort、WorkContextPort、GovernanceReferencePort、ArtifactReferencePort、BusEventPort、TraceHandoffPort、ArchiveHandoffPort。
- Operations jobs:ProjectionRebuildJob、ExternalSnapshotRefreshJob、ChangeCursorMaintenanceJob、TraceHandoffJob、ArchiveHandoffJob。

这些名称先作为骨架主语出现,完整字段、函数签名、DTO、错误码、事务边界和测试切口留到详细设计。

### 3.5 哪些内容已经是代码目录、文件路径或框架实现，不应在本步展开？

本步不展开:

- `crates/domain`、`crates/application`、`crates/infra`、`src/...` 等具体目录和文件路径。
- HTTP / gRPC / message consumer / job runner 的具体框架。
- 完整 Rust struct / enum / trait 定义。
- repository 函数签名、事务句柄、数据库表、索引、迁移脚本。
- CloudEvent / JSON / proto schema、错误码、幂等键格式。
- 具体缓存、搜索、队列、数据库或调度产品。

---

## 4. 架构模块到代码主体映射图

```text
+==================================================================+
|                 L1-conversation code subject map                 |
+==================================================================+
|                                                                  |
|  Architecture context                       Code subjects        |
|                                                                  |
|  Conversation truth core                  -> domain truth         |
|     space / scope / facts / trace            repositories        |
|     manifestation                            outbox subjects     |
|                                                                  |
|  Space and scope management              -> command services     |
|     participant / visibility boundary        scope objects        |
|                                              visibility policy    |
|                                                                  |
|  Collaborative fact append               -> append service       |
|     human / AI / system facts                fact objects         |
|                                              fact history store   |
|                                                                  |
|  Authorized consumption                   -> query services      |
|     reads / subscriptions / cursors          read projections     |
|                                              visibility guard     |
|                                                                  |
|  Cross-domain manifestation              -> manifestation svc    |
|     source refs / snapshots                  reference ports      |
|                                              manifestation store  |
|                                                                  |
|  History trace and review                 -> trace services      |
|     review / audit / handoff                 handoff ports        |
|                                              trace store          |
|                                                                  |
|  Derived consumption support              -> maintenance jobs    |
|     projection / search / change cursor      projection stores    |
|                                              rebuild states       |
|                                                                  |
|  Local reference / snapshot support       -> snapshot adapters   |
|     actor / work / governance / artifact     reference stores     |
|                                                                  |
+==================================================================+
```

关键说明：

- 左侧是架构层已收稳的语义上下文,右侧是概要设计需要先点名的代码主体骨架。
- 该图不表达源码目录、crate、文件路径、接口协议、数据库表或运行时调用顺序。
- `Chat`、`Workspace`、`Runtime`、`Bridges`、`Governance`、`Artifact`、`Identity`、`Observability`、`Archive` 只能通过 reference、snapshot、event、port 或 handoff 边界出现,不能成为本仓内部代码主体 owner。
- 本地 snapshot / projection / reference support 是辅助主体,只能服务降级显示、授权消费、追溯和派生,不得保存外部正文。

---

## 5. 实现分层视图

```text
+==================================================================+
|                    L1-conversation layer view                    |
+==================================================================+
|                                                                  |
|  Inbound / Operations                                            |
|  command intake / query intake / event intake / jobs              |
|                              |                                   |
|                              v                                   |
|  Application Services                                             |
|  space scope / fact append / manifestation / query / trace /      |
|  derived maintenance                                             |
|                              |                                   |
|                              v                                   |
|  Domain Model and Policies                                        |
|  ConversationSpace / ParticipantScope / VisibilityScope /         |
|  ConversationFact / CrossDomainManifestation / TraceContext /     |
|  VisibilityPolicy / FactAppendPolicy / ManifestationPolicy        |
|                              |                                   |
|                 +------------+-------------+                     |
|                 |                          |                     |
|                 v                          v                     |
|  Ports and External Seams             Persistence / Projection    |
|  actor / work / governance /          truth repo / fact history   |
|  artifact / bus / trace / archive     manifest store / snapshots |
|                                       read models / cursors       |
|                              |                                   |
|                              v                                   |
|  Outbox and Handoff                                              |
|  fact changed / manifestation changed / trace handoff / archive   |
|                                                                  |
+==================================================================+
```

关键说明：

- 该图表达实现分层和依赖方向,不表达业务模块拆分、部署拓扑、具体框架或目录结构。
- Inbound / Operations 只负责进入和触发;Application Services 负责用例编排;Domain Model and Policies 负责业务不变量。
- Ports and External Seams 只能表达外部能力边界;Persistence / Projection 分别承载 truth 和派生只读结构。
- Outbox and Handoff 表达已成立事实传播和追溯 / 归档交接,不能反向决定 Conversation truth。

---

## 6. 业务主要组成部分与实现分层关系说明

### 6.1 业务主要组成部分

| 业务主要组成部分 | 从架构承接 | 后续 Step 5 展开方向 |
|---|---|---|
| Conversation truth core | Conversation 真相核心 | 定义本仓拥有的空间、范围、事实、显化和追溯核心边界 |
| Space / scope management | 对话空间与范围管理上下文 | 定义空间、参与范围、可见范围的职责和边界 |
| Collaborative fact append | 协作事实追加上下文 | 定义人类、AI member、系统结果性事实如何追加为正式事实 |
| Authorized consumption | 授权消费上下文 | 定义查询、订阅、变化感知和下游消费如何受可见范围约束 |
| Cross-domain manifestation | 跨域事实显化上下文 | 定义外部正式事实如何以引用、快照或显化记录进入对话 |
| History trace / review | 历史追溯上下文 | 定义复盘、审计、追溯和观测 / 归档交接的对话域边界 |
| Derived consumption support | 派生消费辅助上下文 | 定义投影、索引、检索、变化游标和重建状态 |
| Local reference / snapshot / projection support | 本地索引 / 投影 / 引用层 | 定义外部引用、展示快照和派生辅助的承载边界 |

### 6.2 实现分层不是业务主要组成部分

| 实现分层 | 作用 | 为什么不能当业务主要组成部分 |
|---|---|---|
| Inbound adapters | 接收 command、query、event、subscription 或 job trigger | 它描述进入方式,不描述业务职责 |
| Operations jobs | 执行投影重建、快照刷新、游标维护、追溯交接等维护任务 | 它描述运行触发形态,不拥有新的业务事实 |
| Application services | 编排用例、事务、幂等、domain 调用和 port 调用 | 它横跨多个业务组成部分,不是业务分解维度 |
| Domain model | 承载对象、状态、不变量和 policy | 它是实现层承载,具体对象归属于不同业务组成部分 |
| Ports / adapters | 表达外部能力接缝和技术适配 | 它们不能反向定义 Conversation truth |
| Persistence / projection / outbox | 持久化 truth、派生视图和传播意图 | 它们是技术承载和一致性边界,不是业务模块名称 |

### 6.3 关键判断

- 业务主要组成部分回答“本仓有哪些可被设计和评审的业务主体”。
- 实现分层回答“每个业务主体在代码中通过什么层次被承载”。
- 同一个业务主要组成部分会跨越多个实现分层,例如 `Collaborative fact append` 同时需要 inbound、application service、domain object、truth repository 和 outbox。
- 同一个实现分层会服务多个业务主要组成部分,例如 Application Services 同时承接 space / scope、fact append、manifestation、query、trace 和 derived maintenance。
- 后续 Step 5 必须按业务主要组成部分展开,不能按 Inbound / Application / Domain / Ports 这些实现分层展开。

---

## 7. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| 将 Conversation / Turn / participant / StreamEvents 作为第一层心智 | 旧对象和协议线索直接充当主要结构,缺少代码主体框架 | 改为先从架构上下文映射出业务主要组成部分和实现分层 |
| 旧图把 chat / console / bridges / work / identity 放在同一交互图内 | 容易把外部上下文对象误认为本仓内部代码主体 | Step 4 明确外部对象只能通过 port、event、snapshot、reference 或 handoff 出现 |
| 旧文档直接谈实时推送、AG-UI 和检索 | 协议与派生能力前置,可能反向塑造 truth | Step 4 仅将它们归入 authorized consumption 或 derived consumption support |
| 缺少 Application / Domain / Port / Projection / Outbox 的承载关系 | 详细设计会重新发明服务、对象、存储和 outbox 主语 | 本步先点名关键代码主体骨架 |

---

## 8. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 第一层结构 | 旧 Conversation / Turn / participant / StreamEvents | 新版 Conversation truth center 下的业务主要组成部分 |
| 实现层表达 | 未清楚区分业务模块和实现分层 | 明确 Inbound、Operations、Application、Domain、Ports、Persistence、Projection、Outbox 是实现分层 |
| 外部关系 | 外部仓容易进入内部结构图 | 外部仓只能通过接缝、引用、快照、事件或交接出现 |
| 下游承接 | 详细设计需要自行补服务、对象、port、store 主语 | Step 4 先提供可继续展开的代码主体骨架 |
| 越界防护 | 依赖旧非目标提醒 | 用 Step 3 约束门禁检查每个代码主体 |

---

## 9. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按 Inbound / Application / Domain / Ports 直接作为主要章节 | 容易对接代码分层 | 会把实现分层误当业务模块,不符合概要设计“主要组成部分”要求 | 不采用 |
| 方案 B: 先列业务主要组成部分,再说明它们落到哪些实现分层 | 既能表达业务结构,又能承接详细设计代码主体 | 需要多一层映射说明 | 采用 |
| 方案 C: 直接设计 crate / module / 文件路径 | 对实现最直接 | 过早进入详细设计和实施计划,也容易受仓库结构变化影响 | 不采用 |
| 方案 D: 沿用旧 Conversation / Turn / StreamEvents 主线 | 迁移成本低 | 无法覆盖授权消费、跨域显化、追溯、派生和本地引用层的完整骨架 | 不采用 |

---

## 10. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §4 “代码主体框架总览”摘录本文件 §4 的架构模块到代码主体映射图。
- §4 同时摘录本文件 §5 的实现分层视图。
- §4 需要保留本文件 §6.1 的业务主要组成部分表和 §6.2 的实现分层说明。
- §5 “主要组成部分、职责与边界”必须按 §6.1 的业务主要组成部分展开,不能按实现分层展开。
- 不在本 Step 重复粘贴正式全文,后续 Step 14 从结构化中间产物摘录生成正式文档。

---

## 11. 待确认事项

### 11.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| Step 5 是否按实现分层展开 | A. 按 Inbound / Application / Domain / Ports 展开;B. 按业务主要组成部分展开,实现分层作为每部分内部承载说明 | B | 用户已明确主要部分不是模块名,每个主要部分下再展开对象、接口和流程更清晰 | 已确认采用 B |
| 是否在 Step 4 定代码目录 / crate | A. 是;B. 否,只点名代码主体骨架 | B | SOP 明确本步不写具体代码目录和文件路径 | 已确认采用 B |
| `Local reference / snapshot / projection support` 是否是业务主要组成部分 | A. 完全独立业务能力;B. 作为支撑主要部分进入 Step 5,但不拥有外部正文;C. 并入 derived support 不单列 | B | 它跨越显化、授权消费、历史阅读和降级显示,需要边界说明,但必须受数据归属约束 | 推荐采用 B |

### 11.2 本 Step 未确认事项

本步不新增阻塞 Step 5 的待确认事项。Step 5 需要继续确认每个业务主要组成部分的职责、不承担职责、包含对象候选和边界接缝。

---

## 12. 进入下一步条件

- 已明确架构模块如何映射为代码主体骨架。
- 已输出架构模块到代码主体映射图。
- 已输出实现分层视图。
- 已明确业务主要组成部分与实现分层的区别。
- 未提前写入代码目录、文件路径、完整 trait / struct、协议 schema、数据库表或部署结构。
- 可以进入 Step 5“主要组成部分、职责与边界”。
