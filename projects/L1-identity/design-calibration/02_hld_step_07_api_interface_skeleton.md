# Step 7. API / 接口骨架

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 7
> 回填章节: `02-概要设计.md` §7 API / 接口骨架
> 生成日期: 2026-06-11
> 状态: Step 7 已完成,等待审核后进入 Step 8

---

## 1. Step 状态 + Step 内计划

本 Step 不沿用旧版一次性接口总表。本轮先建立 Step 7 执行框架,再按 Step 5 的 8 个主要组成部分逐个抽取 Command、Query、Inbound Event Consumer、Outbound Event 和 Operations Job。每批完成后停审,最后做跨接口一致性审计。

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取 Step 5 主要组成部分、Step 6 关键对象和最新版 Step 7 SOP / 书写规范 | 已完成 | §2 |
| 回答 Step 7 SOP 问题 | 已完成 | §3 |
| 诊断旧 Step 7 一次性接口总表的问题 | 已完成 | §4 |
| 比较改动前后口径 | 已完成 | §5 |
| 记录采用 / 不采用的设计取舍 | 已完成 | §6 |
| 建立接口分类规则、接口骨架模板和逐批计划 | 已完成 | §7.1~§7.4 |
| 逐批补充“身份锚定与成员真相”接口骨架 | 已完成 | §7.5 |
| 逐批补充“全局生命周期”接口骨架 | 已完成 | §7.6 |
| 逐批补充“角色能力摘要”接口骨架 | 已完成 | §7.7 |
| 逐批补充“身份生涯记录”接口骨架 | 已完成 | §7.8 |
| 逐批补充“记忆引用关系”接口骨架 | 已完成 | §7.9 |
| 逐批补充“身份事实消费与追溯”接口骨架 | 已完成 | §7.10 |
| 逐批补充“派生维护与对账”接口骨架 | 已完成 | §7.11 |
| 逐批补充“身份事实传播与外部交接”接口骨架 | 已完成 | §7.12 |
| 完成跨接口一致性审计 | 已完成 | §7.13 |
| 形成正式 `02` §7 回填草稿 | 已完成 | §9 |
| 列出待确认事项和进入下一步条件 | 已完成 | §10~§11 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `02_hld_step_05_components_boundary.md` | 已完成并已获用户认可 | 提供 8 个主要组成部分、capability 和接口候选来源 |
| `02_hld_step_06_key_objects.md` | 已完成并已获用户认可 | 提供接口必须承接的对象主语、状态主语和边界 refs |
| `02_hld_step_03_constraints.md` | 已完成并已获用户认可 | 提供 command / query 分离、eventual propagation、report-only、forbidden body、visibility 等接口分类门禁 |
| `projects/L1-identity/00-需求文档.md` | 当前需求输入 | 提供 `FR-ID-001~014`、能力级接口面、依赖和验收边界 |
| `projects/L1-identity/01-架构设计.md` | 当前架构输入 | 提供同步、异步、后台 / 延后承接、依赖裁剪和外部接缝机制 |
| `standards/document/概要设计讨论流程_SOP.md` | 最新流程标准 | 规定 Step 7 必须按主要组成部分标注接口归属和停审 |
| `standards/document/概要设计书写规范.md` | 最新正式结构标准 | 规定 §7 Command / Query / Event / Job 表格式 |
| 旧 `02_hld_step_07_api_interface_skeleton.md` | legacy draft | 只作为诊断输入,不得直接继承为新版结论 |

---

## 3. SOP 问题回答

### 3.1 哪些接口属于 Command,负责改写真相?

Command 只覆盖显式改写 identity-owned truth、state、append-only history、reference relation、trace、outbox 或 handoff intent 的正式用例入口。Command 输入必须显式判断是否需要 `ActorContext`、`CommandMetadata` 和幂等信息。

当前预期 Command 来源:

| 主要组成部分 | Command 候选来源 | 必须承接对象 |
|---|---|---|
| 身份锚定与成员真相 | 建立成员身份主语 | `GlobalMember`, `IdentityAnchorState`, `IdentityAnchorPolicy` |
| 全局生命周期 | 调整成员全局生命周期 | `GlobalLifecycleState`, `LifecycleTransitionPolicy`, `HighRiskLifecycleGuard` |
| 角色能力摘要 | 维护 role / capability summary | `RoleCapabilitySummary`, `RoleCapabilitySourcePolicy` |
| 身份生涯记录 | 追加 career record / correction | `CareerRecord`, `CareerAppendPolicy` |
| 记忆引用关系 | 关联 / 更新 memory reference | `MemoryReference`, `MemoryReferenceState`, `MemoryReferencePolicy` |
| 身份事实传播与外部交接 | 准备特定 handoff intent 若需人工 / 显式触发 | `TraceHandoffIntent`, `HandoffPolicy` |

不会把 query、projection rebuild、reference refresh、outbox publish、reconciliation 或 adapter callback 写成业务 Command。

### 3.2 哪些接口属于 Query,只读取投影或只读视图?

Query 只读取 truth summary、projection、trace、audit、report 或 degraded / not visible / stale surface。Query 输入必须显式判断是否需要 `ActorContext` 和 visibility context。Query 不得创建成员、刷新外部来源、重建 projection、修复 truth 或触发 outbox publish。

当前预期 Query 来源:

| 主要组成部分 | Query 候选来源 | 读取对象 |
|---|---|---|
| 身份锚定与成员真相 | 读取成员锚定 / 基础身份 | `GlobalMember`, `IdentityAnchorState`, `MemberSummaryView` |
| 全局生命周期 | 读取 lifecycle 摘要 | `GlobalLifecycleState`, `MemberSummaryView` |
| 角色能力摘要 | 读取 role / capability summary | `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, `MemberSummaryView` |
| 身份生涯记录 | 列出生涯记录 | `CareerRecord`, `MemberSummaryView` |
| 记忆引用关系 | 列出 memory references | `MemoryReference`, `MemoryReferenceState`, `MemberSummaryView` |
| 身份事实消费与追溯 | 读取成员摘要、trace、audit | `MemberSummaryView`, `IdentityTraceRecord`, `AuditTrail`, `VisibilityPolicy` |
| 派生维护与对账 | 读取 reconciliation report | `ReconciliationReport`, `ProjectionState`, `ReferenceResolutionState` |
| 身份事实传播与外部交接 | 读取 pending outbox / handoff state | `IdentityOutboxRecord`, `TraceHandoffIntent`, `OutboxState`, `HandoffState` |

### 3.3 哪些外部事实需要通过 Inbound Event Consumer 进入本仓?

Inbound Event Consumer 只消费外部已成立事实、来源状态变化或 handoff callback,转成本地 snapshot、reference state、append candidate、pending review、stale marker 或 report-only finding。它不得拥有外部 truth,不得静默改写核心 identity truth。

当前预期外部来源:

| 来源 | 可能进入的本地对象 | 边界 |
|---|---|---|
| method-library role / capability source | `RoleCapabilitySourceSnapshot`, `ReferenceResolutionState` | 不保存 RoleDefinition / CapabilityDefinition body |
| work project participation source | `CareerRecord` 候选或 `ReferenceResolutionState` | 不保存 Project / WorkItem / ProjectMember truth |
| governance basis / authorization | lifecycle basis reference state | 不拥有 Gate / Policy / Approval / Control truth |
| memory / archive carrier | `MemoryReferenceState`, `ReferenceResolutionState` | 不保存 memory body、embedding 或 archive package |
| observability / archive / handoff receipt | `HandoffState`, `ReconciliationReport` 或 trace marker | 不保存 raw log、receipt body 或 archive package |

### 3.4 哪些已提交事实需要通过 Outbound Event 对外传播?

Outbound Event 只能来自 accepted identity fact、trace availability、projection freshness 或 outbox material。发布失败不得回滚 accepted truth。

当前预期传播事实:

| 事实来源 | 出站事件方向 | 边界 |
|---|---|---|
| member established / anchor changed | member changed event | 只带 ref、change kind、safe summary marker、trace ref |
| lifecycle changed | lifecycle changed event | basis 只带 ref / marker |
| role capability summary changed | role capability changed event | 不带 method body |
| career record appended | career changed event | 不带 work truth |
| memory reference changed | memory reference changed event | 不带 memory body / archive package |
| projection / reference state changed | derived state changed event | 不代表新业务 truth |
| trace / handoff prepared | trace available / handoff prepared event | 不替代 observability / archive owner truth |

### 3.5 哪些恢复、发布、重建、对账动作属于 Operations Job,而不是业务 command?

Operations Job 基于已持久化 facts 或 markers 做发布、重建、刷新、对账、handoff follow-up 或恢复。Job 不能作为业务 command,不能修复相邻仓 truth,不能绕过 command 写 identity truth。

当前预期 Job:

| Job 类别 | 承接对象 | 边界 |
|---|---|---|
| projection rebuild | `ProjectionState`, `MemberSummaryView` | 重建 view,不改 truth |
| reference refresh | `ReferenceResolutionState`, `MemoryReferenceState`, `RoleCapabilitySourceSnapshot` | 刷新 state / marker,不保存正文 |
| reconciliation | `ReconciliationPolicy`, `ReconciliationReport` | report-only |
| outbox publish | `IdentityOutboxRecord`, `OutboxState` | 发布失败不回滚 truth |
| handoff follow-up | `TraceHandoffIntent`, `HandoffState` | 不伪造 receipt |

### 3.6 Command 输入骨架是否需要 `ActorContext`、`CommandMetadata`、`IdempotencyKey`?

需要。所有 Command 输入骨架默认必须显式包含:

- `ActorContext`:可信操作者 / 系统 actor 上下文。
- `CommandMetadata`:trace context、request metadata、source marker 等概要上下文。
- `IdempotencyKey` 或等价幂等 marker:防重复创建、重复追加、重复引用变化或重复 handoff intent。

若某个 Command 后续决定不需要其中某项,必须在该批次小节给出理由。

### 3.7 Query 输入骨架是否需要 `ActorContext`?

需要。所有 Query 输入骨架默认必须显式包含:

- `ActorContext` 或受控 system actor。
- `QueryMetadata`:page cursor、consistency hint、visibility context、trace correlation 等概要上下文。

Query 可返回 not found、not visible、stale、degraded、unavailable 或 empty page,但不得写 truth 或刷新外部来源。

### 3.8 Event Consumer 输入骨架是否需要 event id、幂等键或 envelope?

需要。所有 Inbound Event Consumer 输入骨架默认必须显式包含:

- event envelope / source event id。
- source ref / schema version / source cursor 或 version marker。
- dedup key / idempotency marker。
- trace context。

缺少这些上下文时,后续 Step 8 / Step 10 必须走 rejected、quarantine、pending review、failed report 或 no-op,不得直接写核心 truth。

### 3.9 每个接口属于哪个主要组成部分,承接哪个对象或对象能力?

本 Step 不允许全仓一次性拍接口名。必须按 Step 5 的 8 个主要组成部分逐批处理,每个接口都要回指 Step 6 对象或对象能力。

### 3.10 是否存在接口无人承接、对象能力没有入口、接口类别混淆或跨组成部分越界?

当前框架阶段只建立审计规则,不提前宣称全量通过。后续每批必须检查:

- 接口是否能反查 Step 6 对象。
- 对象能力是否需要 Command、Query、Event、Job 或只作为内部能力。
- 是否把 Query / Job / Consumer 错写成 Command。
- 是否把 adapter / repository / handler / runner 错写成正式 API。
- 是否越过 forbidden body、report-only、eventual propagation 或 dependency inversion 边界。

---

## 4. 当前材料 / 旧文档问题诊断

| 旧材料 / 倾向 | 问题 | 本轮处理 |
|---|---|---|
| 旧 Step 7 一次性列完全仓接口 | 与最新版 SOP “按主要组成部分逐个停审”不一致 | 改为先建框架,后续按 7-A~7-I 批次补充 |
| 旧 Step 7 使用 `LifecyclePolicy` 等旧名 | 与新版 Step 6 对象名 `LifecycleTransitionPolicy` / `HighRiskLifecycleGuard` 不一致 | 所有接口必须回指新版 Step 6 对象 |
| 旧 Step 7 把 External Port 单独作为接口类 | 正式书写规范要求 Command / Query / Inbound Event / Outbound Event / Operations Job;port 是边界承接,不应与 API 类别混用 | 本轮把外部接缝作为每批接口边界和后续 Step 7 附表,不把 repository / adapter 当 API |
| 旧 Step 7 对 query degraded / visibility / no-write 口径较粗 | 容易导致 Step 8 / `03` 自行补 query response surface | 后续 query 表必须写 not found / not visible / stale / degraded / unavailable 口径 |
| 旧 Step 7 对 event / job 幂等上下文较粗 | 后续实现容易缺 event id、dedup key、run metadata | 本轮模板强制写 event envelope / idempotency / run metadata |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 生成方式 | 一次性接口总表 | 先建 Step 7 框架,再按主要组成部分逐批抽取接口 |
| 对象承接 | 部分接口引用旧对象名或泛化对象能力 | 每个接口必须回指 Step 6 正式对象 |
| 接口分类 | Command / Query / Event / Job / Port 混合 | Command / Query / Inbound Event / Outbound Event / Operations Job 为主;外部接缝作为边界记录 |
| 停审方式 | 只有总表级停审 | 每个主要组成部分完成后停审,最后跨接口审计 |
| 粒度 | 部分接口输入输出过粗,缺上下文判断 | 模板要求显式判断 actor、metadata、幂等、event envelope、run metadata 和 visibility |
| 越界控制 | 主要靠边界文字 | 每类接口都绑定 forbidden body、query no-write、report-only、eventual propagation 门禁 |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 保留旧 Step 7 并局部替换对象名 | 不采用 | 旧稿与新版 Step 6 和当前 SOP 执行方式都不一致 |
| 一次性生成所有接口表 | 不采用 | 会重复 identity 早期粒度问题,难以逐组成部分停审 |
| 先建 Step 7 框架,再按主要组成部分逐批补接口 | 采用 | 与 Step 6 做法一致,能保持 governance 式审查粒度 |
| 在本 Step 定义完整 DTO / event payload / port trait | 不采用 | 属于 `03-详细设计.md` 或 Step 8 之后的详细承接 |
| 把外部 Port 作为第六类 API 并列 | 不采用为主分类 | 书写规范只要求五类接口;port 作为外部接缝和后续详细设计承接记录 |

---

## 7. 结构化中间产物

### 7.1 接口分类规则

| 类别 | 判定条件 | 必填上下文 | 不得做什么 |
|---|---|---|---|
| Command API | 显式改写 identity-owned truth / state / history / relation / outbox / handoff intent | `ActorContext`, `CommandMetadata`, `IdempotencyKey` | 不从 query 触发;不保存外部正文;不绕过 policy |
| Query API | 只读取 truth summary、projection、trace、audit、report 或 degraded surface | `ActorContext`, `QueryMetadata`, `VisibilityContextRef` | 不创建、不刷新、不修复 truth;不触发 job |
| Inbound Event Consumer | 消费外部已成立事实或来源变化,更新本地 snapshot / reference state / stale marker / pending input | event envelope, source event id, source ref, version / cursor, dedup key, trace context | 不拥有外部 truth;不直接生成核心 truth |
| Outbound Event | 传播本仓 accepted fact、trace availability 或派生 freshness marker | outbox record, payload marker, trace ref, topic / consumer boundary | 不携带正文;不让下游失败回滚 truth |
| Operations Job | 基于已持久化 facts / markers 做 publish、rebuild、refresh、reconcile、handoff follow-up | run metadata, scope, cursor, system actor, idempotency key | 不作为业务 command;不修复相邻仓 truth |

### 7.2 单接口骨架模板

后续每个接口必须至少落入以下表之一。

Command API:

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|---|

Query API:

| API | 输入骨架 | 输出骨架 | 读取来源 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|

Inbound Event Consumer:

| Consumer | 来源 | 输入骨架 | 本地结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|

Outbound Event:

| Event | 产生来源 | 输出骨架 | 主要消费者 | 边界 |
|---|---|---|---|---|

Operations Job:

| Job | 输入来源 | 输出结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|

外部接缝记录:

| 接缝 | 使用接口 | 输入 / 输出骨架 | 后续承接 | 边界 |
|---|---|---|---|---|

### 7.3 按主要组成部分的小循环计划

| 批次 | 主要组成部分 | 本批目标 | 预期接口类别 | 停审要求 |
|---|---|---|---|---|
| 7-A | 身份锚定与成员真相 | 抽取建档与基础读取接口 | Command, Query, Outbound Event | ref 不复用、query no-create、账号 / ProjectMember 排除闭合 |
| 7-B | 全局生命周期 | 抽取 lifecycle command / query / event | Command, Query, Outbound Event | 高风险 basis、runtime / ProjectMember 边界闭合 |
| 7-C | 角色能力摘要 | 抽取 role capability command / query / source event | Command, Query, Inbound Event, Outbound Event | method body / evidence body 不入仓闭合 |
| 7-D | 身份生涯记录 | 抽取 career append / query / work source event | Command, Query, Inbound Event, Outbound Event | append-only、work truth 排除闭合 |
| 7-E | 记忆引用关系 | 抽取 memory ref command / query / archive event | Command, Query, Inbound Event, Outbound Event | memory body / archive package 排除闭合 |
| 7-F | 身份事实消费与追溯 | 抽取 summary / trace / audit query | Query | visibility、query no-write、正文不泄漏闭合 |
| 7-G | 派生维护与对账 | 抽取 projection rebuild / reference refresh / reconciliation job 和 report query | Query, Operations Job, optional Outbound Event | report-only、不修复跨仓 truth 闭合 |
| 7-H | 身份事实传播与外部交接 | 抽取 outbox publish / handoff jobs 和 outbound events | Outbound Event, Operations Job, optional Query | accepted fact propagation、publish 不作 accepted 前置、handoff 不保存正文闭合 |
| 7-I | 跨接口一致性审计 | 统一接口命名、分类、对象承接、Step 8 展开范围 | 全部 | 无无人承接接口、无对象能力悬空、无分类混淆 |

### 7.4 当前批次执行边界

当前已完成 7-A “身份锚定与成员真相”、7-B “全局生命周期”、7-C “角色能力摘要”、7-D “身份生涯记录”、7-E “记忆引用关系”、7-F “身份事实消费与追溯”、7-G “派生维护与对账”和 7-H “身份事实传播与外部交接”。下一批应进入 7-I “跨接口一致性审计”,不得在本批次中直接生成 Step 8 处理流。

### 7.5 7-A 身份锚定与成员真相接口骨架

#### 7.5.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-001` | 平台必须能建立新的 AI 员工身份主语 |
| `FR-ID-002` | 平台必须能按身份引用读取成员摘要或不可见 / 不存在结果 |
| `FR-ID-003` | 平台必须保证成员身份引用稳定且不复用 |
| `BR-ID-001` | 成员身份引用建立后不得复用 |
| `BR-ID-002` | 读取成员不得隐式创建成员身份 |
| `BR-ID-003` | 账号、credential、runtime instance、ProjectMember 不得等同 `GlobalMember` truth |
| Step 5 “身份锚定与成员真相” | 建立成员身份主语、读取基础身份锚点、防止 identity ref 复用 |
| Step 6 `GlobalMember` | Command 写入的成员身份 truth 主语 |
| Step 6 `IdentityAnchorState` | 表达 established / held 类锚定状态 |
| Step 6 `IdentityAnchorPolicy` | 创建、防复用、query no-create 和边界混层 guard |
| Step 6 `MemberSummaryView` | 基础锚点读取切片的后续统一 read model |
| Step 6 `IdentityTraceRecord` / `IdentityOutboxRecord` | accepted member fact 的追溯和传播 material,完整传播留给 7-H |

#### 7.5.2 本批问题回答

| 问题 | 结论 |
|---|---|
| 本批是否需要 Command? | 需要。建立成员身份主语会创建 `GlobalMember` 和初始 `IdentityAnchorState`,必须作为受控 Command。 |
| 本批是否需要 Query? | 需要。读取基础身份锚点必须独立于创建,返回 found / not found / not visible / stale / degraded 结果,不得写 truth。 |
| 本批是否需要 Inbound Event Consumer? | 暂不需要。外部来源可以作为创建依据引用,但不能通过外部事件直接建立 `GlobalMember` truth。 |
| 本批是否需要 Outbound Event? | 需要确认事件骨架。成员建立或锚定变化是 accepted identity fact,需要为 7-H 的 outbox publish 留出事件 material。 |
| 本批是否需要 Operations Job? | 暂不需要。projection rebuild、reference refresh、outbox publish 和对账分别留给 7-G / 7-H。 |

#### 7.5.3 当前材料诊断

| 风险 | 具体表现 | 本批处理 |
|---|---|---|
| 把读取写成创建 | 若 `GetGlobalMemberAnchor` 在 not found 时隐式创建成员,会违反 `BR-ID-002` | Query API 明确 no-write,not found 只返回失败 / 空结果 |
| 把账号或 ProjectMember 当成员 truth | 若创建输入直接接收 account body、credential、runtime id 或 ProjectMember truth,会越过身份边界 | Command 只接收 body-free source ref 和受控创建意图,不保存外部正文 |
| 把 event consumer 当建档入口 | 若外部事件可直接创建成员,会绕过 actor、幂等和 anchor policy | 本批不定义建档类 Inbound Event Consumer |
| 把基础读取和完整消费摘要混在一起 | 7-A 只处理 identity anchor 基础读取;完整 consumer summary 属于 7-F | Query 输出只表达 anchor slice / safe marker,不提前展开全量 `MemberSummaryView` schema |
| 把 outbox 发布写入 command 同步成功条件 | 发布失败不应回滚 accepted member truth | 本批只确认 outbound event material;发布 job 留给 7-H |

#### 7.5.4 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 用一个 upsert 接口同时创建和读取成员 | 不采用 | 会模糊 query no-create,也会弱化 ref 不复用规则 |
| 允许外部 source event 自动建档 | 不采用 | 建档需要可信 actor、幂等键和 `IdentityAnchorPolicy` 即时判断 |
| 将完整成员消费摘要放入 7-A | 不采用 | 完整摘要涉及 lifecycle、role、career、memory 和 visibility,应在 7-F 统一收敛 |
| 只定义建档 command,不定义事件骨架 | 不采用 | accepted member fact 必须能被下游最终一致消费,7-H 需要本批给出事件来源 |
| Command 中固定完整 id generator 方法 | 不采用 | 本 Step 只确认需要稳定 `GlobalMemberRef` 生成 / 分配接缝;完整方法名和契约留给 `03` |

#### 7.5.5 Command API 骨架

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|---|
| `EstablishGlobalMember` | `ActorContext`, `CommandMetadata`, `IdempotencyKey`, `GlobalMemberCreateIntent`, `IdentitySourceRef` | `GlobalMemberCommandResult`:`GlobalMemberRef`, `IdentityAnchorStateKind`, `IdentityTraceRecordRef`, `IdentityOutboundMaterialRef`, accepted / rejected / duplicate marker | 校验 actor 与 source ref;取得或分配稳定 `GlobalMemberRef`;读取已有 anchor state;调用 `IdentityAnchorPolicy.assert_can_establish(...)` 和 `assert_ref_not_reused(...)`;创建 `GlobalMember.establish(...)`;记录 trace material;准备 outbound material | 新增 `GlobalMember`;初始 `IdentityAnchorState=Established`;accepted trace material;pending outbound material;幂等结果 | 身份锚定与成员真相 | 不保存 account / credential / ProjectMember / runtime body;不由 query 或 job 触发;不把 outbound publish 成功作为 accepted 条件 |

本批只定义一个建档 Command。改名、暂停、退役和墓碑化不属于 7-A:改名若进入 identity 后续需先判断是否是 summary label 变化;暂停、退役和墓碑化属于 7-B 全局生命周期。

#### 7.5.6 Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `GetGlobalMemberAnchor` | `ActorContext`, `QueryMetadata`, `VisibilityContextRef`, `GlobalMemberRef`, optional `ConsistencyHintRef` | `GlobalMemberAnchorResult`:`GlobalMemberRef`, `IdentityAnchorSummaryRef`, `IdentityAnchorStateKind`, `ProjectionStateRef`, `VisibilityResultRef`, found / not_found / not_visible / stale / degraded marker | `GlobalMember` truth summary、`IdentityAnchorState`、可用时读取 `MemberSummaryView` 的 anchor slice | 身份锚定与成员真相 | 不创建 `GlobalMember`;不刷新外部 source;不修复 projection;不可见时不泄露 source body 或内部原因正文 |

完整成员摘要读取、trace 查询和 audit 查询在 7-F “身份事实消费与追溯”统一展开。7-A 的 query 只保证成员锚点读取不会变成创建入口。

#### 7.5.7 Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| 暂不定义 | 外部成员 / 账号 / 项目成员事件 | 不适用 | 不适用 | 身份锚定与成员真相 | 外部事件不得直接建立 `GlobalMember`;如后续需要 source claim,只能作为 `IdentitySourceRef` 或待审来源进入 Command / 后续 flow |

#### 7.5.8 Outbound Event 骨架

| Event | 产生来源 | 输出骨架 | 主要消费者 | 边界 |
|---|---|---|---|---|
| `GlobalMemberEstablished` | `EstablishGlobalMember` accepted result | `GlobalMemberRef`, `IdentityChangeKindRef=member_established`, `IdentityAnchorSummaryRef`, `IdentityTraceRecordRef`, `IdentityOutboundPayloadMarkerRef`, event schema marker | work、process、conversation、governance、workspace、runtime 等需要成员锚点的相邻仓 | 不携带账号、credential、ProjectMember、runtime 或 source body;事件发布失败不回滚成员建档 |
| `IdentityAnchorChanged` | anchor state 被正式改变的 accepted fact | `GlobalMemberRef`, `IdentityChangeKindRef=anchor_changed`, `IdentityAnchorStateKind`, `IdentityTraceRecordRef`, `IdentityOutboundPayloadMarkerRef` | 需要跟踪成员锚定状态的相邻仓和追溯消费方 | 7-A 只产生 established 类变化;retired / tombstone 类变化在 7-B/Step 9 继续收口 |

#### 7.5.9 Operations Job 骨架

| Job | 输入来源 | 输出结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|
| 暂不定义 | 不适用 | 不适用 | 身份锚定与成员真相 | 建档和基础读取都不是 job;projection rebuild 和 outbox publish 分别留给 7-G / 7-H |

#### 7.5.10 外部接缝记录

| 接缝 | 使用接口 | 输入 / 输出骨架 | 后续承接 | 边界 |
|---|---|---|---|---|
| `GlobalMemberRef` 生成 / 分配接缝 | `EstablishGlobalMember` | 输入 create intent / allocation scope;输出稳定 `GlobalMemberRef` | Step 12 / `03` 定义 id generator 或 repository allocation contract | 不允许复用 retired / tombstone ref;不从外部账号 id 直接复用为 member ref |
| 成员 truth repository 边界 | `EstablishGlobalMember`, `GetGlobalMemberAnchor` | 读取 existing anchor;保存 `GlobalMember`;读取 anchor summary | `03` 定义 repository port、事务和唯一约束 | 不把 repository 写成 query 自动创建 |
| visibility / redaction 边界 | `GetGlobalMemberAnchor` | 输入 `ActorContext`, `VisibilityContextRef`;输出 `VisibilityResultRef` | 7-F / `03` 细化字段级裁剪 | 不可见不等于不存在;不可见不得泄露 source body |
| accepted fact material 边界 | `EstablishGlobalMember` | 输出 trace ref、payload marker、pending outbound material | 7-H 和 Step 8 细化 outbox / publish flow | 发布失败不回滚 accepted truth |

#### 7.5.11 本批接口审计

| 审查项 | 结论 | 说明 |
|---|---|---|
| Command 是否回到对象能力 | 通过 | `EstablishGlobalMember` 回到 `GlobalMember.establish(...)` 和 `IdentityAnchorPolicy` |
| Query 是否保持 no-write | 通过 | `GetGlobalMemberAnchor` 只读取 truth summary / projection slice,not found 不创建 |
| 是否存在无人承接接口 | 通过 | 本批接口均回指 Step 5 capability 和 Step 6 对象 |
| 是否越过账号 / ProjectMember / runtime 边界 | 通过 | 输入和事件均只使用 body-free ref / marker |
| 是否把外部 event 写成建档入口 | 通过 | 本批不定义建档类 Inbound Event Consumer |
| 是否提前展开详细 schema / port trait | 通过 | 仅保留输入 / 输出骨架和接缝记录,完整契约后移 `03` |

#### 7.5.12 本批回填草稿

正式 `02-概要设计.md` §7 中,本批可汇总为:

- `EstablishGlobalMember` 是身份锚定的唯一建档 Command 骨架,用于建立 `GlobalMember` 和初始 anchor state。
- `GetGlobalMemberAnchor` 是基础身份锚点 Query 骨架,读取不存在、不可见、stale 或 degraded 时不得隐式创建成员。
- `GlobalMemberEstablished` / `IdentityAnchorChanged` 是本批确认的 outbound event material,发布和重试机制后移到传播与交接部分。
- 本批不定义建档类 inbound event 或 operations job。

#### 7.5.13 本批待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 7-A 只定义一个建档 Command | 若不认可,需讨论是否还有独立 rename / anchor hold command 属于本批 | 当前把 lifecycle / retired / tombstone 变化后移 7-B |
| 是否认可 `GetGlobalMemberAnchor` 只读基础锚点,完整摘要留给 7-F | 若不认可,7-A 会膨胀为消费摘要接口 | 当前保持基础读取与完整消费摘要分离 |
| 是否认可不定义建档类 Inbound Event Consumer | 若不认可,需重新讨论外部事件创建成员是否违反受控建档边界 | 当前只允许外部来源作为 body-free source ref / marker |

#### 7.5.14 进入 7-B 的条件

进入 7-B “全局生命周期”前,需要用户确认:

- `EstablishGlobalMember` / `GetGlobalMemberAnchor` / `GlobalMemberEstablished` / `IdentityAnchorChanged` 的分类和边界可以作为后续 Step 8 / Step 9 输入。
- 身份锚定创建和生命周期变化保持分离。
- Query no-create、ref 不复用、账号 / ProjectMember / runtime 排除已满足本批停审。

### 7.6 7-B 全局生命周期接口骨架

#### 7.6.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-004` | 平台必须能表达成员全局生命周期和可用性 |
| `FR-ID-005` | 高风险生命周期处置必须保留授权 / 治理依据引用 |
| `BR-ID-004` | 生命周期变化必须来自显式管理意图、原因和操作者上下文 |
| `BR-ID-005` | 高风险处置不得缺少正式 basis,也不得由后台任务静默执行 |
| `BR-ID-006` | 全局生命周期不等同 runtime、ProjectMember 或任务状态 |
| `VETO-ID-004` | 缺少授权 / 治理依据的高风险生命周期处置不得 accepted |
| Step 5 “全局生命周期” | 生命周期调整、basis 校验、读取摘要和 accepted fact 输出 |
| Step 6 `GlobalLifecycleState` | lifecycle truth state 主语 |
| Step 6 `LifecycleTransitionPolicy` | 显式 command、合法迁移、原因和 actor guard |
| Step 6 `HighRiskLifecycleGuard` | 高风险目标状态的 basis ref guard |
| Step 6 `MemberSummaryView` | 生命周期摘要读取切片的统一 read model |
| Step 6 `IdentityTraceRecord` / `IdentityOutboxRecord` | accepted lifecycle fact 的追溯和传播 material,完整传播留给 7-H |

#### 7.6.2 本批问题回答

| 问题 | 结论 |
|---|---|
| 本批是否需要 Command? | 需要。生命周期变化会改写 `GlobalLifecycleState`,必须走显式 command,并携带 actor、reason、幂等信息。 |
| 本批是否需要 Query? | 需要。下游需要读取成员当前可用性摘要,但读取不得修复状态或触发生命周期变化。 |
| 本批是否需要 Inbound Event Consumer? | 暂不需要。governance / authorization 只作为 basis ref 来源,不通过外部事件直接改写生命周期 truth。 |
| 本批是否需要 Outbound Event? | 需要。accepted lifecycle change 是 identity fact,需要为下游消费和 7-H publish job 留出 event material。 |
| 本批是否需要 Operations Job? | 暂不需要。后台任务不得静默改变生命周期;projection rebuild 和 outbox publish 留给 7-G / 7-H。 |

#### 7.6.3 当前材料诊断

| 风险 | 具体表现 | 本批处理 |
|---|---|---|
| 把 runtime availability 当 lifecycle truth | 用容器健康、执行实例或任务状态更新 `GlobalLifecycleState` | Command 输入只接受 lifecycle change intent,不接受 runtime status body |
| 把 ProjectMember 状态当全局生命周期 | 项目内分配状态反向定义成员全局可用性 | 明确 ProjectMember 只可作为外部上下文 / 消费方,不能写 lifecycle truth |
| 高风险处置缺 basis 仍 accepted | 退役、墓碑化等动作绕过 governance / authorization basis | `HighRiskLifecycleGuard` 在 command precheck 中拦截 missing / mismatched basis |
| 后台任务静默处置生命周期 | maintenance job 自动暂停、退役或墓碑化成员 | 本批不定义 lifecycle operations job,后台只能做投影 / 对账 / 发布 |
| lifecycle query 变成修复入口 | 读取发现 stale 后直接刷新或改写 truth | Query 只返回 found / not_found / not_visible / stale / degraded,不写 truth |

#### 7.6.4 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 将 pause / retire / tombstone 拆成多个 Command | 不采用为概要主表 | 它们共享 lifecycle transition 语义;具体 intent variant 和状态矩阵留给 Step 8/9/`03` |
| 用 `UpdateGlobalLifecycleState` 统一生命周期变化 | 采用 | 能集中承接 actor、reason、basis、幂等和非法迁移 guard |
| 用 governance event 直接触发生命周期变化 | 不采用 | 会绕过 identity 的显式 command 和本仓 transition policy |
| 在 Query 中返回完整成员摘要 | 不采用 | lifecycle query 只返回 lifecycle slice;完整摘要由 7-F 统一收敛 |
| 在本 Step 定义 basis resolver 详细 schema | 不采用 | 当前只确认需要 basis resolution 接缝;完整 resolver port、schema、失败码后移 `03` |

#### 7.6.5 Command API 骨架

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|---|
| `UpdateGlobalLifecycleState` | `ActorContext`, `CommandMetadata`, `IdempotencyKey`, `GlobalMemberRef`, `LifecycleTransitionIntent`, `LifecycleReasonRef`, optional `GovernanceBasisRef` | `LifecycleCommandResult`:`GlobalMemberRef`, `GlobalLifecycleStateKind`, `LifecycleReasonRef`, optional `GovernanceBasisRef`, `IdentityTraceRecordRef`, `IdentityOutboundMaterialRef`, accepted / rejected / duplicate / pending_basis marker | 读取 `GlobalMember` 与当前 `GlobalLifecycleState`;调用 `LifecycleTransitionPolicy.assert_explicit_command(...)` 和 `assert_allowed_transition(...)`;若目标状态高风险,调用 `HighRiskLifecycleGuard.assert_basis_present(...)` / `assert_basis_matches_action(...)`;生成新 `GlobalLifecycleState`;记录 trace material;准备 outbound material | 更新 `GlobalLifecycleState`;必要时更新 anchor held marker 的后续处理线索;accepted trace material;pending outbound material;幂等结果 | 全局生命周期 | 不保存 governance body;不读取 runtime / ProjectMember truth 决定迁移;缺 basis 或非法迁移不得 accepted;不把 publish 成功作为 command 成功条件 |

本批只定义一个生命周期更新 Command。具体 intent 是否拆成 pause、resume、retire、tombstone 等 variant,以及哪些 target state 属于高风险,在 Step 8/9 和 `03` 中按状态矩阵细化。

#### 7.6.6 Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `GetGlobalLifecycleSummary` | `ActorContext`, `QueryMetadata`, `VisibilityContextRef`, `GlobalMemberRef`, optional `ConsistencyHintRef` | `GlobalLifecycleSummaryResult`:`GlobalMemberRef`, `GlobalLifecycleStateKind`, `LifecycleSummaryRef`, `ProjectionStateRef`, `VisibilityResultRef`, found / not_found / not_visible / stale / degraded marker | `GlobalMember` 存在性、`GlobalLifecycleState` truth summary、可用时读取 `MemberSummaryView` 的 lifecycle slice | 全局生命周期 | 不改变 lifecycle truth;不补 basis;不读取 runtime health;不可见时不泄露治理 basis body |

完整成员摘要、跨字段 visibility 裁剪、trace / audit 读取在 7-F 统一展开。7-B query 只表达 lifecycle 可用性摘要读取入口。

#### 7.6.7 Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| 暂不定义 | governance / authorization / runtime / work 外部事件 | 不适用 | 不适用 | 全局生命周期 | 外部事件不得直接改写 `GlobalLifecycleState`;governance / authorization 只作为 `GovernanceBasisRef` 或 resolution source,具体读取面后移 `03` |

#### 7.6.8 Outbound Event 骨架

| Event | 产生来源 | 输出骨架 | 主要消费者 | 边界 |
|---|---|---|---|---|
| `GlobalLifecycleChanged` | `UpdateGlobalLifecycleState` accepted result | `GlobalMemberRef`, `IdentityChangeKindRef=lifecycle_changed`, `GlobalLifecycleStateKind`, `LifecycleReasonRef`, optional `GovernanceBasisRef`, `IdentityTraceRecordRef`, `IdentityOutboundPayloadMarkerRef` | work、process、conversation、governance、workspace、runtime 等需要成员可用性摘要的相邻仓 | 不携带 governance basis body、runtime status body 或 ProjectMember truth;事件发布失败不回滚 lifecycle truth |
| `GlobalMemberAvailabilityChanged` | lifecycle state 影响可选择 / 可调用摘要时的 accepted fact material | `GlobalMemberRef`, `AvailabilitySummaryRef`, `GlobalLifecycleStateKind`, `IdentityTraceRecordRef`, `IdentityOutboundPayloadMarkerRef` | 需要快速消费成员可用性的相邻仓 | 是 lifecycle change 的消费友好事件骨架;是否与 `GlobalLifecycleChanged` 合并留给 `03` |

#### 7.6.9 Operations Job 骨架

| Job | 输入来源 | 输出结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|
| 暂不定义 | 不适用 | 不适用 | 全局生命周期 | 后台任务不得静默 pause / retire / tombstone;只允许 7-G/7-H 处理 projection、outbox 和对账 |

#### 7.6.10 外部接缝记录

| 接缝 | 使用接口 | 输入 / 输出骨架 | 后续承接 | 边界 |
|---|---|---|---|---|
| 成员 truth repository 边界 | `UpdateGlobalLifecycleState`, `GetGlobalLifecycleSummary` | 读取 `GlobalMember`;读取 / 保存 `GlobalLifecycleState`;读取 lifecycle summary | `03` 定义 repository port、事务和并发语义 | 不从 repository fake 或 query path 自行修复 lifecycle |
| governance / authorization basis resolution 边界 | `UpdateGlobalLifecycleState` | 输入 optional `GovernanceBasisRef`, target action risk;输出 basis accepted / missing / mismatched / unavailable marker | Step 12 / `03` 定义 resolver port 和 body-free summary | identity 不保存 Gate / Policy / Approval / Control truth 或 basis body |
| visibility / redaction 边界 | `GetGlobalLifecycleSummary` | 输入 `ActorContext`, `VisibilityContextRef`;输出 `VisibilityResultRef` | 7-F / `03` 细化字段级裁剪 | 不可见时不能泄露高风险 basis 详情 |
| accepted fact material 边界 | `UpdateGlobalLifecycleState` | 输出 trace ref、payload marker、pending outbound material | 7-H 和 Step 8 细化 outbox / publish flow | 发布失败不回滚 lifecycle truth |

#### 7.6.11 本批接口审计

| 审查项 | 结论 | 说明 |
|---|---|---|
| Command 是否回到对象能力 | 通过 | `UpdateGlobalLifecycleState` 回到 `GlobalLifecycleState`、`LifecycleTransitionPolicy` 和 `HighRiskLifecycleGuard` |
| Query 是否保持 no-write | 通过 | `GetGlobalLifecycleSummary` 只读取 lifecycle truth summary / projection slice |
| 高风险 basis 是否闭合到概要层 | 通过 | 明确需要 `GovernanceBasisRef` 和 body-free resolution 接缝,详细 schema 后移 `03` |
| 是否越过 runtime / ProjectMember 边界 | 通过 | 输入和事件均不接收 runtime status body 或 ProjectMember truth |
| 是否把外部 event 写成 lifecycle 入口 | 通过 | 本批不定义 lifecycle 类 Inbound Event Consumer |
| 是否提前展开详细 schema / port trait | 通过 | 仅保留输入 / 输出骨架和接缝记录,完整契约后移 `03` |

#### 7.6.12 本批回填草稿

正式 `02-概要设计.md` §7 中,本批可汇总为:

- `UpdateGlobalLifecycleState` 是全局生命周期的统一 Command 骨架,用于显式调整 `GlobalLifecycleState`。
- `GetGlobalLifecycleSummary` 是生命周期只读 Query 骨架,读取 stale / degraded / not visible 时不得改写 truth。
- 高风险目标状态必须经 `GovernanceBasisRef` 和 body-free basis resolution 接缝校验;缺 basis 或 mismatch 不得 accepted。
- `GlobalLifecycleChanged` / `GlobalMemberAvailabilityChanged` 是本批确认的 outbound event material,发布机制后移 7-H。
- 本批不定义 lifecycle 类 inbound event 或 operations job。

#### 7.6.13 本批待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 lifecycle 写入口统一为 `UpdateGlobalLifecycleState` | 若不认可,需拆 pause / resume / retire / tombstone command 并重新审查状态边界 | 当前用 intent 表达具体目标,详细 variant 后移 Step 8/9/`03` |
| 是否认可高风险 basis 只保存 body-free `GovernanceBasisRef` | 若不认可,会破坏 governance truth ownership | 当前只定义 basis ref / resolution marker |
| 是否认可不定义 lifecycle 类 Inbound Event Consumer / Operations Job | 若不认可,需重新论证外部事件或后台任务是否会绕过显式 command | 当前坚持显式 command 才能改写 lifecycle truth |
| 是否认可 `GlobalMemberAvailabilityChanged` 作为可合并事件骨架 | 若不认可,后续可在 `03` 合并进 `GlobalLifecycleChanged` payload | 当前保留为消费友好 event material |

#### 7.6.14 进入 7-C 的条件

进入 7-C “角色能力摘要”前,需要用户确认:

- `UpdateGlobalLifecycleState` / `GetGlobalLifecycleSummary` / `GlobalLifecycleChanged` 的分类和边界可以作为后续 Step 8 / Step 9 输入。
- lifecycle 与 runtime、ProjectMember、governance truth 的边界保持分离。
- 缺 basis 高风险处置不 accepted、后台任务不静默改 lifecycle 的口径已满足本批停审。

### 7.7 7-C 角色能力摘要接口骨架

#### 7.7.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-006` | 平台必须能维护成员身份侧角色摘要 |
| `FR-ID-007` | 平台必须能维护成员能力画像摘要和证据引用 |
| `FR-ID-008` | 平台必须能响应 role / capability 定义来源变化 |
| `BR-ID-007` | RoleDefinition / CapabilityDefinition 正文不归 identity 保存 |
| `BR-ID-008` | 角色能力摘要必须有来源或证据,不得形成无来源声明 |
| `BR-ID-009` | Identity 不负责自动评估能力等级或推断绩效 |
| `VETO-ID-003` | method body、definition body、evidence body 不得进入 identity truth / event / report |
| Step 5 “角色能力摘要” | 维护 role / capability safe summary、消费 method source change、输出 accepted summary change |
| Step 6 `RoleCapabilitySummary` | identity-owned role / capability 摘要主语 |
| Step 6 `RoleCapabilitySourceSnapshot` | body-free 来源 snapshot、version marker 和 source state |
| Step 6 `RoleCapabilitySourcePolicy` | 来源 / 证据必填、forbidden body 和自动评分 guard |
| Step 6 `MemberSummaryView` | role capability 读取切片的统一 read model |
| Step 6 `IdentityTraceRecord` / `IdentityOutboxRecord` | accepted role capability fact 的追溯和传播 material,完整传播留给 7-H |

#### 7.7.2 本批问题回答

| 问题 | 结论 |
|---|---|
| 本批是否需要 Command? | 需要。维护成员身份侧 role / capability 摘要会写 `RoleCapabilitySummary`,必须走受控 Command。 |
| 本批是否需要 Query? | 需要。消费者需要读取可见 role / capability summary,但读取不得刷新来源或修复摘要。 |
| 本批是否需要 Inbound Event Consumer? | 需要。method-library 来源变化需要被消费为 `RoleCapabilitySourceSnapshot` 状态变化、summary stale 或 pending reconciliation。 |
| 本批是否需要 Outbound Event? | 需要。accepted summary change 或 source-state-derived change 需要为下游消费和 7-H publish job 留出 event material。 |
| 本批是否需要 Operations Job? | 暂不需要。source refresh / reconciliation 属于 7-G,本批只定义同步维护和来源事件消费入口。 |

#### 7.7.3 当前材料诊断

| 风险 | 具体表现 | 本批处理 |
|---|---|---|
| 保存 method-library 正文 | Command 或 event payload 直接携带 RoleDefinition / CapabilityDefinition body | 输入只允许 source ref、version marker、safe summary marker 和 evidence refs |
| 无来源能力声明 accepted | 管理员直接写“高级能力”但没有 source / evidence | `RoleCapabilitySourcePolicy.assert_source_or_evidence_present(...)` 作为 command precheck |
| 自动评分进入 identity truth | 把算法输出、绩效评分或不可解释等级写入摘要 | 本批只允许 safe summary marker / evidence refs,不定义 scoring command |
| 来源变化静默污染摘要 | method source stale / unavailable 时继续把旧摘要当最新事实 | Inbound consumer 只更新 snapshot state、mark stale / unavailable 或 pending reconciliation |
| Query 触发外部刷新 | 读取摘要时同步调用 method-library 或修复 summary | Query 只读本地 truth / projection slice,source refresh 后移 7-G |

#### 7.7.4 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 分别定义 role summary command 和 capability summary command | 不采用为概要主表 | 二者共享来源、证据、forbidden body 和追溯边界;具体 intent variant 后移 Step 8/`03` |
| 用 `MaintainRoleCapabilitySummary` 统一维护 role / capability 摘要 | 采用 | 能集中承接 source snapshot、evidence refs、actor、幂等和 forbidden body guard |
| 让 method-library 事件直接重写能力摘要为 active | 不采用 | 外部来源变化只能提供 snapshot / state marker;是否 accepted 更新 summary 仍需本仓 policy |
| 在 Query 中实时解析 method-library 来源 | 不采用 | 读取不得调用外部来源或修复 stale summary |
| 在本 Step 定义完整 source / evidence resolver schema | 不采用 | 当前只确认需要 resolver / source event 接缝;完整 protocol 和 port 后移 `03` |

#### 7.7.5 Command API 骨架

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|---|
| `MaintainRoleCapabilitySummary` | `ActorContext`, `CommandMetadata`, `IdempotencyKey`, `GlobalMemberRef`, `RoleCapabilityChangeIntent`, `RoleCapabilitySourceRef`, optional `RoleCapabilitySourceVersionRef`, `List<CapabilityEvidenceRef>`, `RoleCapabilitySafeSummaryRef`, `RoleCapabilityChangeReasonRef` | `RoleCapabilityCommandResult`:`GlobalMemberRef`, `RoleCapabilitySummaryRef`, `RoleCapabilitySourceSnapshotRef`, `RoleCapabilitySummaryState`, `IdentityTraceRecordRef`, `IdentityOutboundMaterialRef`, accepted / rejected / duplicate / pending_source marker | 读取成员存在性和当前 summary;解析或接收 body-free source snapshot;调用 `RoleCapabilitySourcePolicy.assert_source_or_evidence_present(...)`、`assert_source_usable(...)`、`assert_no_forbidden_body(...)`、`assert_not_automatic_scoring(...)`;创建或更新 `RoleCapabilitySummary`;记录 trace material;准备 outbound material | 新增或更新 `RoleCapabilitySummary`;保存 / 关联 `RoleCapabilitySourceSnapshot`;accepted trace material;pending outbound material;幂等结果 | 角色能力摘要 | 不保存 RoleDefinition / CapabilityDefinition / method / evidence body;不自动评估能力或绩效;source stale / unavailable / unrecognized 不得静默 accepted |

本批只定义统一维护 Command。role-only、capability-only、evidence correction、source rebind 等具体 intent variant 在 Step 8/`03` 继续细化。

#### 7.7.6 Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `GetRoleCapabilitySummary` | `ActorContext`, `QueryMetadata`, `VisibilityContextRef`, `GlobalMemberRef`, optional `RoleCapabilitySummaryRef`, optional `ConsistencyHintRef` | `RoleCapabilitySummaryResult`:`GlobalMemberRef`, `RoleCapabilitySummaryRef`, `RoleCapabilitySafeSummaryRef`, `RoleCapabilitySummaryState`, `RoleCapabilitySourceSnapshotRef`, `ProjectionStateRef`, `VisibilityResultRef`, found / not_found / not_visible / stale / degraded marker | `RoleCapabilitySummary` truth / snapshot、`RoleCapabilitySourceSnapshot` state、可用时读取 `MemberSummaryView` 的 role capability slice | 角色能力摘要 | 不刷新 method source;不补 evidence;不保存或返回 definition body / evidence body;不可见时不泄露来源正文 |

完整成员摘要、跨字段 visibility 裁剪、trace / audit 读取在 7-F 统一展开。7-C query 只表达 role capability slice 的只读入口。

#### 7.7.7 Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `HandleRoleCapabilitySourceChanged` | `L3-method-library` role / capability source change | event envelope, source event id, dedup key, trace context, `RoleCapabilitySourceRef`, `RoleCapabilitySourceVersionRef`, `RoleCapabilitySafeSummaryRef`, source state marker, optional `List<CapabilityEvidenceRef>` | 创建 / 更新 `RoleCapabilitySourceSnapshot`;将相关 `RoleCapabilitySummary` 标记 stale / unavailable / pending reconciliation;准备 derived-state outbound material | 角色能力摘要 | 不保存 source definition body、method body 或 evidence body;不直接把外部事件写成 active summary,除非后续 Step 8/`03` 明确 accepted source-update flow |

若来源事件无法识别 source ref、版本 marker 或 safe summary marker,后续 Step 10 应进入 rejected、quarantine、pending review 或 report-only,不得静默更新摘要。

#### 7.7.8 Outbound Event 骨架

| Event | 产生来源 | 输出骨架 | 主要消费者 | 边界 |
|---|---|---|---|---|
| `RoleCapabilitySummaryChanged` | `MaintainRoleCapabilitySummary` accepted result | `GlobalMemberRef`, `RoleCapabilitySummaryRef`, `RoleCapabilitySafeSummaryRef`, `RoleCapabilitySummaryState`, `RoleCapabilitySourceSnapshotRef`, `IdentityTraceRecordRef`, `IdentityOutboundPayloadMarkerRef` | work、process、conversation、governance、workspace、runtime 等需要成员 role / capability 摘要的相邻仓 | 不携带 definition body、method body、evidence body 或评分算法结果;发布失败不回滚 summary truth |
| `RoleCapabilitySourceStateChanged` | `HandleRoleCapabilitySourceChanged` 消费来源变化后形成的本地 source state change | `GlobalMemberRef`, optional `RoleCapabilitySummaryRef`, `RoleCapabilitySourceSnapshotRef`, `RoleCapabilitySourceStateKind`, `IdentityTraceRecordRef`, `IdentityOutboundPayloadMarkerRef` | 需要感知摘要 stale / unavailable / pending reconciliation 的相邻仓和维护任务 | 只传播 source state / safe marker,不传播来源正文;是否合并进 summary event 留给 `03` |

#### 7.7.9 Operations Job 骨架

| Job | 输入来源 | 输出结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|
| 暂不定义 | 不适用 | 不适用 | 角色能力摘要 | source refresh、stale reconciliation、projection rebuild 留给 7-G;本批不让后台任务直接修复摘要 truth |

#### 7.7.10 外部接缝记录

| 接缝 | 使用接口 | 输入 / 输出骨架 | 后续承接 | 边界 |
|---|---|---|---|---|
| 成员 truth repository 边界 | `MaintainRoleCapabilitySummary`, `GetRoleCapabilitySummary` | 读取 `GlobalMember`;读取 / 保存 `RoleCapabilitySummary`;读取 role capability summary slice | `03` 定义 repository port、事务和并发语义 | 不在 query path 创建或刷新 summary |
| method source resolution 边界 | `MaintainRoleCapabilitySummary`, `HandleRoleCapabilitySourceChanged` | 输入 `RoleCapabilitySourceRef`, version marker;输出 `RoleCapabilitySourceSnapshot` / unresolved marker | Step 12 / `03` 定义 resolver port、event schema 和 body-free snapshot schema | identity 不保存 RoleDefinition / CapabilityDefinition / method body |
| evidence reference boundary | `MaintainRoleCapabilitySummary`, `HandleRoleCapabilitySourceChanged` | 输入 `List<CapabilityEvidenceRef>`;输出 evidence present / unresolved / unavailable marker | `03` 定义 evidence ref validation / resolver contract | 不保存 evidence / artifact body |
| visibility / redaction 边界 | `GetRoleCapabilitySummary` | 输入 `ActorContext`, `VisibilityContextRef`;输出 `VisibilityResultRef` | 7-F / `03` 细化字段级裁剪 | 不可见时不能泄露来源正文或证据正文 |
| accepted fact material 边界 | `MaintainRoleCapabilitySummary`, `HandleRoleCapabilitySourceChanged` | 输出 trace ref、payload marker、pending outbound material | 7-H 和 Step 8 细化 outbox / publish flow | 发布失败不回滚 accepted summary / source state change |

#### 7.7.11 本批接口审计

| 审查项 | 结论 | 说明 |
|---|---|---|
| Command 是否回到对象能力 | 通过 | `MaintainRoleCapabilitySummary` 回到 `RoleCapabilitySummary`、`RoleCapabilitySourceSnapshot` 和 `RoleCapabilitySourcePolicy` |
| Query 是否保持 no-write | 通过 | `GetRoleCapabilitySummary` 只读 summary / source snapshot / projection slice |
| Inbound Consumer 是否只消费外部事实 | 通过 | `HandleRoleCapabilitySourceChanged` 只更新 body-free snapshot state 和 stale / pending marker |
| forbidden body 是否闭合 | 通过 | 明确禁止 definition body、method body、evidence body 和评分算法结果进入输入、输出、事件 |
| 是否越过 method-library ownership | 通过 | method-library 仍拥有 role / capability definition truth,identity 只保存 ref / marker / snapshot |
| 是否提前展开详细 schema / port trait | 通过 | 仅保留输入 / 输出骨架和接缝记录,完整契约后移 `03` |

#### 7.7.12 本批回填草稿

正式 `02-概要设计.md` §7 中,本批可汇总为:

- `MaintainRoleCapabilitySummary` 是角色能力摘要的统一 Command 骨架,用于维护 identity-side role / capability safe summary。
- `GetRoleCapabilitySummary` 是角色能力摘要只读 Query 骨架,读取时不得刷新 method source 或返回定义正文。
- `HandleRoleCapabilitySourceChanged` 是 method-library 来源变化的 Inbound Event Consumer 骨架,只更新 body-free source snapshot 和 stale / unavailable / pending marker。
- `RoleCapabilitySummaryChanged` / `RoleCapabilitySourceStateChanged` 是本批确认的 outbound event material,发布机制后移 7-H。
- 本批不定义 source refresh / reconciliation operations job。

#### 7.7.13 本批待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 role / capability 写入口统一为 `MaintainRoleCapabilitySummary` | 若不认可,需拆 role-only / capability-only command 并重新审查来源和证据边界 | 当前用 intent 表达具体维护目标,详细 variant 后移 Step 8/`03` |
| 是否认可 method source event 只更新 snapshot / stale marker,不直接 active accepted summary | 若不认可,需在 Step 8/`03` 定义来源事件直接 accepted 的严格 policy | 当前避免外部事件绕过本仓 summary policy |
| 是否认可 evidence 只保存 `CapabilityEvidenceRef` | 若不认可,会破坏 artifact / evidence body ownership | 当前只定义 evidence ref / resolver marker |
| 是否认可不定义 role capability operations job | 若不认可,需说明 source refresh / reconciliation 是否前移 | 当前后移到 7-G |

#### 7.7.14 进入 7-D 的条件

进入 7-D “身份生涯记录”前,需要用户确认:

- `MaintainRoleCapabilitySummary` / `GetRoleCapabilitySummary` / `HandleRoleCapabilitySourceChanged` 的分类和边界可以作为后续 Step 8 / Step 9 输入。
- role / capability summary 与 method-library definition truth 的边界保持分离。
- 无来源 / 无证据声明不 accepted、source stale / unavailable 不静默污染 summary 的口径已满足本批停审。

### 7.8 7-D 身份生涯记录接口骨架

#### 7.8.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-009` | 平台必须能追加成员生涯记录 |
| `BR-ID-010` | 生涯记录只能追加,不得改写、删除或重排已确认历史 |
| `BR-ID-011` | Project、WorkItem、ProjectMember truth 不得由 identity 反向定义 |
| `BR-ID-014` | 生涯追加必须可追溯到安全可见来源、原因或 actor |
| `NFR-ID-006` | 重复项目参与来源不得产生重复 history |
| `NFR-ID-007` | 纠错必须以追加形式表达,不得原地覆盖 |
| `VETO-ID-003` | ProjectMember、work item、artifact 等正文不得进入 identity truth / event / report |
| Step 5 “身份生涯记录” | 追加生涯记录、处理重复来源、读取生涯摘要 |
| Step 6 `CareerRecord` | identity-owned append-only career history 主语 |
| Step 6 `CareerAppendPolicy` | 来源可信、幂等安全、append-only、work truth 排除 guard |
| Step 6 `MemberSummaryView` | career 读取切片的统一 read model |
| Step 6 `IdentityTraceRecord` / `IdentityOutboxRecord` | accepted career append fact 的追溯和传播 material,完整传播留给 7-H |

#### 7.8.2 本批问题回答

| 问题 | 结论 |
|---|---|
| 本批是否需要 Command? | 需要。平台管理员或受控系统入口可以按正式来源追加生涯记录,会写 `CareerRecord`。 |
| 本批是否需要 Query? | 需要。消费者需要读取成员可见 career summary,但读取不得追加、纠错或修复历史。 |
| 本批是否需要 Inbound Event Consumer? | 需要。`L1-work` 的项目参与来源可通过事件协作触发生涯追加候选或 accepted append flow。 |
| 本批是否需要 Outbound Event? | 需要。accepted career append 是 identity fact,需要为下游消费和 7-H publish job 留出 event material。 |
| 本批是否需要 Operations Job? | 暂不需要。重复来源对账和 projection rebuild 后移 7-G,本批不让 job 直接追加历史。 |

#### 7.8.3 当前材料诊断

| 风险 | 具体表现 | 本批处理 |
|---|---|---|
| 把 career 写成可修改履历 | update / delete / reorder 既有 `CareerRecord` | 只定义 append / correction append,不定义 update / delete command |
| 把 work truth 复制进 identity | 输入或事件保存 Project、WorkItem、ProjectMember body | 只允许 `ProjectParticipationRef`、`WorkSourceRef`、safe summary marker 和 source marker |
| 重复来源生成重复历史 | 重放同一 work participation event 新增多条 career record | Command / Consumer 输入强制携带 `CareerSourceMarkerRef` / dedup key |
| 纠错覆盖原记录 | 修正旧项目经历时直接修改旧 record | 纠错必须追加新 `CareerRecord`,旧记录可被解释性标记 superseded by correction |
| maintenance 静默追加 | 对账任务发现 work 来源后直接追加 career truth | 本批不定义 career operations job,对账只能报告或触发正式入口 |

#### 7.8.4 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 分开定义 append command 和 correction command | 不采用为概要主表 | 二者共享来源可信、append-only、幂等和 work truth 排除边界;具体 intent variant 后移 Step 8/`03` |
| 用 `AppendCareerRecord` 统一追加和纠错追加 | 采用 | 能集中承接 source marker、reason、actor、idempotency 和 append-only guard |
| 让 work event 直接写入 ProjectMember / 项目事实摘要 | 不采用 | identity 只追加身份侧 career history,work truth 仍归 `L1-work` |
| 在 Query 中组装完整项目履历正文 | 不采用 | career query 只返回 safe summary / refs / visibility marker |
| 在本 Step 定义 work resolver 完整 schema | 不采用 | 当前只确认需要 work participation source 接缝;完整协议和 port 后移 `03` |

#### 7.8.5 Command API 骨架

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|---|
| `AppendCareerRecord` | `ActorContext`, `CommandMetadata`, `IdempotencyKey`, `GlobalMemberRef`, `CareerAppendIntent`, `ProjectParticipationRef`, `WorkSourceRef`, `CareerSourceMarkerRef`, `CareerSafeSummaryRef`, `CareerAppendReasonRef`, optional `CareerRecordRef original_record_ref` | `CareerCommandResult`:`GlobalMemberRef`, `CareerRecordRef`, `CareerRecordState`, `CareerSourceMarkerRef`, `IdentityTraceRecordRef`, `IdentityOutboundMaterialRef`, accepted / duplicate / rejected / conflict marker | 读取成员存在性和已有 source marker;校验 work source 为 body-free ref / marker;调用 `CareerAppendPolicy.assert_source_trusted(...)`、`assert_not_duplicate(...)`、`assert_append_only(...)`、`assert_not_work_truth_write(...)`;创建 `CareerRecord.append_from_work_source(...)` 或 correction record;记录 trace material;准备 outbound material | 新增 `CareerRecord`;必要时追加式纠错关系;accepted trace material;pending outbound material;幂等 / duplicate 结果 | 身份生涯记录 | 不更新 / 删除 / 重排旧记录;不保存 Project / WorkItem / ProjectMember body;重复来源不新增重复 history;不把 publish 成功作为 command 成功条件 |

本批只定义统一追加 Command。普通追加、纠错追加、冲突来源处理的具体 intent variant 在 Step 8/`03` 继续细化。

#### 7.8.6 Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `ListCareerRecords` | `ActorContext`, `QueryMetadata`, `VisibilityContextRef`, `GlobalMemberRef`, optional `CareerCursorRef`, optional `CareerRecordFilterRef`, optional `ConsistencyHintRef` | `CareerRecordListResult`:`GlobalMemberRef`, `List<CareerSafeSummaryRef>`, `CareerCursorRef`, `ProjectionStateRef`, `VisibilityResultRef`, found / empty / not_found / not_visible / stale / degraded marker | `CareerRecord` append history、可用时读取 `MemberSummaryView` 的 career slice | 身份生涯记录 | 不追加记录;不纠错;不调用 work source;不返回 Project / WorkItem / ProjectMember body;不可见时不泄露工作来源正文 |

完整成员摘要、跨字段 visibility 裁剪、trace / audit 读取在 7-F 统一展开。7-D query 只表达 career slice 的只读入口。

#### 7.8.7 Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `HandleWorkParticipationAccepted` | `L1-work` project participation accepted fact | event envelope, source event id, dedup key, trace context, `GlobalMemberRef`, `ProjectParticipationRef`, `WorkSourceRef`, `CareerSourceMarkerRef`, `CareerSafeSummaryRef`, optional `CareerAppendReasonRef` | 通过 `CareerAppendPolicy` 校验后追加 `CareerRecord`,或返回 duplicate / rejected / pending review marker;准备 outbound material | 身份生涯记录 | 不保存 Project / WorkItem / ProjectMember body;不反写 work truth;来源不可信或成员不存在不得静默 accepted |

若 work 事件缺少 `GlobalMemberRef`、source marker 或 safe summary marker,后续 Step 10 应进入 rejected、quarantine、pending review 或 report-only,不得自行从项目私有字段推导成员身份。

#### 7.8.8 Outbound Event 骨架

| Event | 产生来源 | 输出骨架 | 主要消费者 | 边界 |
|---|---|---|---|---|
| `CareerRecordAppended` | `AppendCareerRecord` accepted result 或 `HandleWorkParticipationAccepted` accepted result | `GlobalMemberRef`, `CareerRecordRef`, `CareerSafeSummaryRef`, `CareerSourceMarkerRef`, `ProjectParticipationRef`, `IdentityTraceRecordRef`, `IdentityOutboundPayloadMarkerRef` | work、process、conversation、governance、workspace、runtime 等需要成员生涯摘要的相邻仓 | 不携带 Project / WorkItem / ProjectMember body;事件发布失败不回滚 career append |
| `CareerCorrectionAppended` | correction append accepted result | `GlobalMemberRef`, `CareerRecordRef correction_record_ref`, optional `CareerRecordRef original_record_ref`, `CareerSafeSummaryRef`, `IdentityTraceRecordRef`, `IdentityOutboundPayloadMarkerRef` | 审计、消费摘要和需要解释历史纠错的相邻仓 | 纠错仍是追加事件,不表示旧记录被删除或原地修改 |

#### 7.8.9 Operations Job 骨架

| Job | 输入来源 | 输出结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|
| 暂不定义 | 不适用 | 不适用 | 身份生涯记录 | career projection rebuild、duplicate source reconciliation 和 drift report 留给 7-G;job 不直接追加或修复 career truth |

#### 7.8.10 外部接缝记录

| 接缝 | 使用接口 | 输入 / 输出骨架 | 后续承接 | 边界 |
|---|---|---|---|---|
| 成员 truth repository 边界 | `AppendCareerRecord`, `ListCareerRecords`, `HandleWorkParticipationAccepted` | 读取 `GlobalMember`;读取 / 保存 `CareerRecord`;按 source marker 查重 | `03` 定义 repository port、唯一约束、事务和并发语义 | 不在 query path 或 maintenance report 中追加 truth |
| work participation source boundary | `AppendCareerRecord`, `HandleWorkParticipationAccepted` | 输入 `ProjectParticipationRef`, `WorkSourceRef`, `CareerSourceMarkerRef`, `CareerSafeSummaryRef`;输出 trusted / duplicate / unresolved marker | Step 12 / `03` 定义 resolver / event schema 和 body-free source summary | identity 不保存 Project、WorkItem、ProjectMember truth |
| visibility / redaction 边界 | `ListCareerRecords` | 输入 `ActorContext`, `VisibilityContextRef`;输出 `VisibilityResultRef` | 7-F / `03` 细化字段级裁剪 | 不可见时不能泄露项目或任务正文 |
| accepted fact material 边界 | `AppendCareerRecord`, `HandleWorkParticipationAccepted` | 输出 trace ref、payload marker、pending outbound material | 7-H 和 Step 8 细化 outbox / publish flow | 发布失败不回滚 career truth |

#### 7.8.11 本批接口审计

| 审查项 | 结论 | 说明 |
|---|---|---|
| Command 是否回到对象能力 | 通过 | `AppendCareerRecord` 回到 `CareerRecord` 和 `CareerAppendPolicy` |
| Query 是否保持 no-write | 通过 | `ListCareerRecords` 只读 career append history / projection slice |
| Inbound Consumer 是否只消费外部事实 | 通过 | `HandleWorkParticipationAccepted` 消费 work accepted fact,但不保存 work body 或反写 work truth |
| append-only 是否闭合 | 通过 | 本批不定义 update / delete / reorder,纠错也通过追加新记录表达 |
| duplicate source 是否闭合到概要层 | 通过 | 强制使用 `CareerSourceMarkerRef` / dedup key,重复来源不新增重复 history |
| 是否提前展开详细 schema / port trait | 通过 | 仅保留输入 / 输出骨架和接缝记录,完整契约后移 `03` |

#### 7.8.12 本批回填草稿

正式 `02-概要设计.md` §7 中,本批可汇总为:

- `AppendCareerRecord` 是身份生涯记录的统一 Command 骨架,用于普通追加和纠错追加。
- `ListCareerRecords` 是生涯记录只读 Query 骨架,读取时不得追加、纠错或调用 work source。
- `HandleWorkParticipationAccepted` 是 work 项目参与来源的 Inbound Event Consumer 骨架,只能消费 body-free source refs / marker。
- `CareerRecordAppended` / `CareerCorrectionAppended` 是本批确认的 outbound event material,发布机制后移 7-H。
- 本批不定义 career operations job。

#### 7.8.13 本批待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可普通追加和纠错追加统一为 `AppendCareerRecord` | 若不认可,需拆分 command 并重新审查 append-only 和纠错语义 | 当前用 intent / optional original record ref 表达具体目标,详细 variant 后移 Step 8/`03` |
| 是否认可 work participation event 可以触发 accepted career append | 若不认可,需改为 pending review / command-only 模式 | 当前允许在 policy 通过时追加,但不保存 work body |
| 是否认可 duplicate source 以 `CareerSourceMarkerRef` / dedup key 闭合 | 若不认可,后续实现会缺少幂等判定来源 | 当前把 source marker 列为 command / event 必填骨架 |
| 是否认可不定义 career operations job | 若不认可,需说明对账 / projection 是否前移 | 当前后移到 7-G |

#### 7.8.14 进入 7-E 的条件

进入 7-E “记忆引用关系”前,需要用户确认:

- `AppendCareerRecord` / `ListCareerRecords` / `HandleWorkParticipationAccepted` 的分类和边界可以作为后续 Step 8 / Step 9 输入。
- career history 保持 append-only,纠错仍通过追加表达。
- Project / WorkItem / ProjectMember truth 不进入 identity,重复来源不新增重复 history 的口径已满足本批停审。

### 7.9 7-E 记忆引用关系接口骨架

#### 7.9.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-010` | 平台必须能保存成员相关 memory refs |
| `FR-ID-011` | 平台必须能支持记忆引用迁移或冷存协作 |
| `BR-ID-012` | identity 不保存 memory 原文、向量、artifact body 或 archive package |
| `BR-ID-014` | memory ref 变化必须可追溯到安全可见来源、原因或 actor |
| `NFR-ID-004` | 禁止保存外部正文、credential、token、raw secret |
| `VETO-ID-003` | memory / artifact / conversation / runtime 正文进入 identity 为 0 容忍 |
| `OQ-ID-003` / `R-ID-003` | memory refs 的正式承载方、handoff target、migration result surface 后移 `03/04` |
| Step 5 “记忆引用关系” | 关联 memory ref、刷新引用状态、记录迁移 / 冷存协作 |
| Step 6 `MemoryReference` | 成员与外部 memory / archive refs 的身份侧关系主语 |
| Step 6 `MemoryReferenceState` | pending、linked、stale、unavailable、migrated、archived、handoff failed 等状态主语 |
| Step 6 `MemoryReferencePolicy` | member existence、source trust、body-free、handoff marker guard |
| Step 6 `MemberSummaryView` | memory reference 读取切片的统一 read model |
| Step 6 `IdentityTraceRecord` / `IdentityOutboxRecord` | accepted memory reference fact 的追溯和传播 material,完整传播留给 7-H |

#### 7.9.2 本批问题回答

| 问题 | 结论 |
|---|---|
| 本批是否需要 Command? | 需要。关联 / 更新 memory ref 关系会写 `MemoryReference` 和 `MemoryReferenceState`,必须走受控 Command。 |
| 本批是否需要 Query? | 需要。消费者需要读取成员可见 memory / archive refs,但读取不得刷新外部承载方或修复状态。 |
| 本批是否需要 Inbound Event Consumer? | 需要。memory / archive 承载方的迁移、冷存或 handoff 结果需要进入本地引用状态,但只保存 refs / markers。 |
| 本批是否需要 Outbound Event? | 需要。accepted memory ref change 或 handoff state change 是 identity fact,需要为下游消费和 7-H publish job 留出 event material。 |
| 本批是否需要 Operations Job? | 暂不需要。reference refresh、handoff retry / follow-up 和 reconciliation 后移 7-G / 7-H。 |

#### 7.9.3 当前材料诊断

| 风险 | 具体表现 | 本批处理 |
|---|---|---|
| 保存 memory body / embedding | Command 或 event payload 携带原文、向量、检索索引 | 输入只允许 `MemoryRef`、`ArchiveRef`、`ArchiveHandoffRef`、source ref 和 safe marker |
| 保存 archive package | handoff result 把 package metadata 或归档包体写入 identity | Inbound consumer 只接受 body-free handoff marker 和 archive ref |
| 把外部 carrier 状态机复制进 identity | 直接建完整 memory/archive owner 状态 | `MemoryReferenceState` 只表达身份侧引用状态,不拥有外部 carrier truth |
| Query 触发外部刷新 | 读取 memory refs 时调用 archive / memory adapter 修复状态 | Query 只读本地 relation / projection slice,refresh 后移 7-G |
| Handoff pending 伪装成功 | 迁移未确认时直接标记 archived / migrated | Inbound consumer 必须区分 pending、failed、migrated、archived marker |

#### 7.9.4 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 拆分 link memory、attach archive、update state 多个 Command | 不采用为概要主表 | 它们共享 member/source/body-free/trace/outbox 边界;具体 intent variant 后移 Step 8/`03` |
| 用 `MaintainMemoryReference` 统一同步维护入口 | 采用 | 能集中承接 memory / archive refs、source、reason、actor、幂等和 forbidden body guard |
| 将 archive handoff result 写成 Command | 不采用为主入口 | 外部 handoff 结果更自然来自 Inbound Event / callback;但仍受本仓 policy 校验 |
| 在 Query 中返回 memory 摘要正文 | 不采用 | identity 只返回 refs / safe summary marker / state,正文归外部承载方 |
| 在本 Step 固定 handoff target / receipt schema | 不采用 | 上游已挂起 `OQ-ID-003`;概要层只保留 refs / marker 和后续 `03/04` 承接 |

#### 7.9.5 Command API 骨架

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|---|
| `MaintainMemoryReference` | `ActorContext`, `CommandMetadata`, `IdempotencyKey`, `GlobalMemberRef`, `MemoryReferenceChangeIntent`, optional `MemoryReferenceRef`, optional `MemoryRef`, optional `ArchiveRef`, optional `ArchiveHandoffRef`, `MemoryReferenceSourceRef`, `MemoryReferenceReasonRef` | `MemoryReferenceCommandResult`:`GlobalMemberRef`, `MemoryReferenceRef`, `MemoryReferenceStateKind`, optional `MemoryRef`, optional `ArchiveRef`, optional `ArchiveHandoffRef`, `IdentityTraceRecordRef`, `IdentityOutboundMaterialRef`, accepted / rejected / duplicate / pending_verification marker | 读取成员存在性和当前 memory reference;调用 `MemoryReferencePolicy.assert_reference_present(...)`、`assert_source_trusted(...)`、`assert_body_free(...)`、`assert_handoff_marker_body_free(...)`、`assert_not_external_owner_write(...)`;创建或更新 `MemoryReference`;更新 `MemoryReferenceState`;记录 trace material;准备 outbound material | 新增或更新 `MemoryReference`;保存 body-free state / marker;accepted trace material;pending outbound material;幂等结果 | 记忆引用关系 | 不保存 memory body、embedding、index、artifact body、archive package 或 package metadata;不写外部 owner truth;handoff pending 不伪装成 completed |

本批只定义统一维护 Command。link memory、attach archive、mark stale / unavailable、record migration 等具体 intent variant 在 Step 8/`03` 继续细化。

#### 7.9.6 Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `ListMemoryReferences` | `ActorContext`, `QueryMetadata`, `VisibilityContextRef`, `GlobalMemberRef`, optional `MemoryReferenceCursorRef`, optional `MemoryReferenceFilterRef`, optional `ConsistencyHintRef` | `MemoryReferenceListResult`:`GlobalMemberRef`, `List<MemoryReferenceSummaryRef>`, `MemoryReferenceCursorRef`, `ProjectionStateRef`, `VisibilityResultRef`, found / empty / not_found / not_visible / stale / degraded marker | `MemoryReference` relation、`MemoryReferenceState`、可用时读取 `MemberSummaryView` 的 memory reference slice | 记忆引用关系 | 不刷新外部 memory / archive;不返回正文、embedding、index 或 package;不可见时不泄露 carrier 内部状态 |

完整成员摘要、跨字段 visibility 裁剪、trace / audit 读取在 7-F 统一展开。7-E query 只表达 memory reference slice 的只读入口。

#### 7.9.7 Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `HandleMemoryReferenceSourceStateChanged` | memory / archive carrier source state event | event envelope, source event id, dedup key, trace context, `GlobalMemberRef`, `MemoryReferenceRef`, `MemoryReferenceSourceRef`, optional `MemoryRef`, optional `ArchiveRef`, `MemoryReferenceStateKind`, safe state marker | 更新 `MemoryReferenceState` 为 linked / stale / unavailable / pending verification;准备 outbound material | 记忆引用关系 | 不保存 memory body、embedding、index、archive package;不可识别 source 进入 pending / rejected / report-only |
| `HandleArchiveHandoffResult` | archive / memory handoff callback 或 event | event envelope, source event id, dedup key, trace context, `GlobalMemberRef`, optional `MemoryReferenceRef`, `ArchiveRef`, `ArchiveHandoffRef`, handoff result marker, `MemoryReferenceReasonRef` | 按 marker 更新 `MemoryReferenceState` 为 migrated / archived / handoff pending / handoff failed;准备 outbound material | 记忆引用关系 | 不定义或保存完整 receipt schema;不保存 package body / metadata;不伪造 handoff completed |

若 handoff result 缺少 typed ref、target marker 或 result marker,后续 Step 10 应进入 rejected、quarantine、pending review 或 report-only,不得自行拼接 target 或 receipt。

#### 7.9.8 Outbound Event 骨架

| Event | 产生来源 | 输出骨架 | 主要消费者 | 边界 |
|---|---|---|---|---|
| `MemoryReferenceChanged` | `MaintainMemoryReference` accepted result 或 source state event accepted result | `GlobalMemberRef`, `MemoryReferenceRef`, `MemoryReferenceSummaryRef`, `MemoryReferenceStateKind`, optional `MemoryRef`, optional `ArchiveRef`, `IdentityTraceRecordRef`, `IdentityOutboundPayloadMarkerRef` | work、process、conversation、governance、workspace、runtime 等需要成员 memory refs 摘要的相邻仓 | 不携带 memory body、embedding、index、artifact body、archive package;事件发布失败不回滚 ref relation |
| `MemoryArchiveHandoffStateChanged` | `HandleArchiveHandoffResult` accepted result | `GlobalMemberRef`, `MemoryReferenceRef`, `ArchiveRef`, `ArchiveHandoffRef`, `MemoryReferenceStateKind`, `IdentityTraceRecordRef`, `IdentityOutboundPayloadMarkerRef` | 需要感知迁移 / 冷存 / handoff 状态的相邻仓和维护任务 | 只传播 refs / marker / state,不传播 receipt body 或 package metadata |

#### 7.9.9 Operations Job 骨架

| Job | 输入来源 | 输出结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|
| 暂不定义 | 不适用 | 不适用 | 记忆引用关系 | reference refresh 和 reconciliation 留给 7-G;handoff publish / follow-up 留给 7-H;job 不直接伪造外部结果 |

#### 7.9.10 外部接缝记录

| 接缝 | 使用接口 | 输入 / 输出骨架 | 后续承接 | 边界 |
|---|---|---|---|---|
| 成员 truth repository 边界 | `MaintainMemoryReference`, `ListMemoryReferences`, `HandleMemoryReferenceSourceStateChanged`, `HandleArchiveHandoffResult` | 读取 `GlobalMember`;读取 / 保存 `MemoryReference`;更新 `MemoryReferenceState` | `03` 定义 repository port、事务和并发语义 | 不在 query path 或 maintenance report 中改写 relation |
| memory / archive source boundary | `MaintainMemoryReference`, `HandleMemoryReferenceSourceStateChanged` | 输入 `MemoryRef`, `ArchiveRef`, `MemoryReferenceSourceRef`, source state marker;输出 trusted / unresolved / unavailable marker | Step 12 / `03` 定义 resolver / event schema 和 body-free source summary | identity 不保存 memory body、embedding、index 或 carrier truth |
| archive handoff boundary | `HandleArchiveHandoffResult`, `MaintainMemoryReference` | 输入 `ArchiveRef`, `ArchiveHandoffRef`, result marker;输出 handoff pending / migrated / archived / failed marker | Step 12 / `03/04` 定义 handoff target、receipt marker、retry 和 config surface | 本 Step 不固定 receipt schema,不保存 archive package |
| visibility / redaction 边界 | `ListMemoryReferences` | 输入 `ActorContext`, `VisibilityContextRef`;输出 `VisibilityResultRef` | 7-F / `03` 细化字段级裁剪 | 不可见时不能泄露 external carrier 内部状态或正文 |
| accepted fact material 边界 | `MaintainMemoryReference`, `HandleMemoryReferenceSourceStateChanged`, `HandleArchiveHandoffResult` | 输出 trace ref、payload marker、pending outbound material | 7-H 和 Step 8 细化 outbox / publish flow | 发布失败不回滚 memory reference truth |

#### 7.9.11 本批接口审计

| 审查项 | 结论 | 说明 |
|---|---|---|
| Command 是否回到对象能力 | 通过 | `MaintainMemoryReference` 回到 `MemoryReference`、`MemoryReferenceState` 和 `MemoryReferencePolicy` |
| Query 是否保持 no-write | 通过 | `ListMemoryReferences` 只读 relation / state / projection slice |
| Inbound Consumer 是否只消费外部事实 / marker | 通过 | source state 和 handoff result 只以 refs / marker 更新本地引用状态 |
| forbidden body 是否闭合 | 通过 | 明确禁止 memory body、embedding、index、artifact body、archive package 和 receipt body 进入输入、输出、事件 |
| handoff 未闭口事项是否保守处理 | 通过 | 只保留 `ArchiveHandoffRef` 和 result marker,完整 target / receipt / config 后移 `03/04` |
| 是否提前展开详细 schema / port trait | 通过 | 仅保留输入 / 输出骨架和接缝记录,完整契约后移 `03` |

#### 7.9.12 本批回填草稿

正式 `02-概要设计.md` §7 中,本批可汇总为:

- `MaintainMemoryReference` 是记忆引用关系的统一 Command 骨架,用于维护成员与 memory / archive refs 的身份侧关系。
- `ListMemoryReferences` 是记忆引用只读 Query 骨架,读取时不得刷新外部承载方或返回正文。
- `HandleMemoryReferenceSourceStateChanged` 和 `HandleArchiveHandoffResult` 是 memory / archive 来源状态与 handoff 结果的 Inbound Event Consumer 骨架,只消费 refs / marker。
- `MemoryReferenceChanged` / `MemoryArchiveHandoffStateChanged` 是本批确认的 outbound event material,发布机制后移 7-H。
- 本批不定义 reference refresh、reconciliation 或 handoff follow-up job。

#### 7.9.13 本批待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 memory / archive 同步维护统一为 `MaintainMemoryReference` | 若不认可,需拆 link memory / attach archive / update state command 并重新审查 forbidden body | 当前用 intent 表达具体维护目标,详细 variant 后移 Step 8/`03` |
| 是否认可 archive handoff result 用 Inbound Event Consumer 承接 | 若不认可,需改为 command-only 或 job-only 模式 | 当前按外部 handoff callback / event 处理,但仍经本仓 policy |
| 是否认可本 Step 不固定 handoff target / receipt schema | 若不认可,会提前关闭 `OQ-ID-003` | 当前只保留 refs / marker,完整 surface 后移 `03/04` |
| 是否认可不定义 memory reference operations job | 若不认可,需说明 refresh / reconciliation / follow-up 是否前移 | 当前后移到 7-G / 7-H |

#### 7.9.14 进入 7-F 的条件

进入 7-F “身份事实消费与追溯”前,需要用户确认:

- `MaintainMemoryReference` / `ListMemoryReferences` / `HandleMemoryReferenceSourceStateChanged` / `HandleArchiveHandoffResult` 的分类和边界可以作为后续 Step 8 / Step 9 输入。
- memory / archive 只保存 refs、state 和 marker,不保存正文、embedding、index、archive package 或 receipt body。
- handoff pending / failed / migrated / archived 状态不被伪造成成功的口径已满足本批停审。

### 7.10 7-F 身份事实消费与追溯接口骨架

#### 7.10.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-012` | 相邻仓必须能通过正式边界消费成员身份事实 |
| `FR-ID-013` | 平台必须能读取身份变化追溯 |
| `BR-ID-013` | 消费方只能读 / 订阅 / 展示身份事实,不得反写 identity truth |
| `BR-ID-014` | 身份变化必须可追溯到安全可见原因、来源、actor、basis 或 marker |
| `OQ-ID-004` | 字段级 visibility / privacy 裁剪后移 `03`,本步只定义概要 visibility 边界 |
| Step 5 “身份事实消费与追溯” | 读取成员摘要、读取 trace / audit、提供消费投影状态 |
| Step 6 `MemberSummaryView` | 成员身份事实消费 read model |
| Step 6 `IdentityTraceRecord` | accepted identity fact 变化追溯 material |
| Step 6 `AuditTrail` | 可审计时间线读取 aggregate |
| Step 6 `VisibilityPolicy` | summary / trace / audit 读取的 visibility guard |

#### 7.10.2 本批问题回答

| 问题 | 结论 |
|---|---|
| 本批是否需要 Command? | 不需要。消费与追溯读取不得创建、修复、刷新或改写 identity truth。 |
| 本批是否需要 Query? | 需要。成员摘要、trace 和 audit 都是只读消费入口。 |
| 本批是否需要 Inbound Event Consumer? | 不需要。消费追溯不接收外部事实,只读取本仓 accepted facts / trace / projection。 |
| 本批是否需要 Outbound Event? | 不在本批新增。事件传播统一留给 7-H,本批只说明 query 输出不得替代 event material。 |
| 本批是否需要 Operations Job? | 不需要。projection rebuild、reference refresh 和 reconciliation 留给 7-G。 |

#### 7.10.3 当前材料诊断

| 风险 | 具体表现 | 本批处理 |
|---|---|---|
| Query 反向写 truth | 读取 not found / stale 时自动创建成员、刷新来源或修复 projection | 所有 Query 明确 no-write,只返回 not found / not visible / stale / degraded |
| visibility 被绕过 | trace、audit 或 debug 读取输出不可见字段 | 所有 Query 必须携带 `ActorContext`、`QueryMetadata`、`VisibilityContextRef` |
| 外部正文泄漏 | summary / trace / audit 返回 method body、work body、memory body、artifact body 或 archive package | 输出只使用 safe summary ref、trace ref、marker 和 redaction result |
| trace 被当成第二 truth | 通过 trace / audit 推导并覆盖业务状态 | trace / audit 只读,不替代 `GlobalMember`、lifecycle、role、career、memory truth |
| 读取触发维护任务 | Query 发现 stale 后直接跑 rebuild / refresh | 本批 Query 只暴露 stale / degraded marker,维护留给 7-G |

#### 7.10.4 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 把前面各批的 slice query 合并成一个 summary query | 采用 | `ReadMemberSummary` 提供面向相邻仓的统一消费入口,但不替代专项 slice query |
| 在本批定义 trace / audit 读取 Query | 采用 | `FR-ID-013` 要求身份变化可追溯,需要独立读取入口 |
| 在本批定义 projection rebuild job | 不采用 | 维护行为属于 7-G,否则 Query 和 Job 边界会混淆 |
| 在本批定义字段级 redaction schema | 不采用 | `OQ-ID-004` 已挂起到 `03`,概要层只定义 visibility 上下文和结果 marker |
| 把 query response 当 outbound event payload | 不采用 | Query response 是同步读取面,event material 和 publish flow 留给 7-H |

#### 7.10.5 Command API 骨架

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|---|
| 暂不定义 | 不适用 | 不适用 | 不适用 | 不适用 | 身份事实消费与追溯 | 本批禁止通过 Command 修复 summary、trace、audit 或 projection |

#### 7.10.6 Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `ReadMemberSummary` | `ActorContext`, `QueryMetadata`, `VisibilityContextRef`, `GlobalMemberRef`, optional `ConsumerRef`, optional `ConsistencyHintRef` | `MemberSummaryResult`:`GlobalMemberRef`, `MemberSummaryViewRef`, `IdentityAnchorSummaryRef`, `LifecycleSummaryRef`, optional `RoleCapabilitySummaryRef`, `List<CareerSafeSummaryRef>`, `List<MemoryReferenceSummaryRef>`, `ProjectionStateRef`, `VisibilityResultRef`, found / not_found / not_visible / stale / degraded marker | `MemberSummaryView`,必要时读取各 truth summary / projection slice | 身份事实消费与追溯 | 不创建成员;不刷新来源;不修复 projection;不返回外部正文或不可见字段 |
| `ReadIdentityTrace` | `ActorContext`, `QueryMetadata`, `VisibilityContextRef`, `GlobalMemberRef`, optional `IdentityTraceSubjectRef`, optional `IdentityChangeKindRef`, optional `TraceCursorRef` | `IdentityTraceResult`:`GlobalMemberRef`, `List<IdentityTraceRecordRef>`, `TraceCursorRef`, `VisibilityResultRef`, found / empty / not_visible / degraded marker | `IdentityTraceRecord` append history 和 redacted trace view | 身份事实消费与追溯 | trace 只读;不把 trace 当第二 truth;不可见 reason / source / basis 必须裁剪 |
| `ReadAuditTrail` | `ActorContext`, `QueryMetadata`, `VisibilityContextRef`, `GlobalMemberRef`, `AuditScopeRef`, optional `AuditCursorRef` | `AuditTrailResult`:`GlobalMemberRef`, `AuditTrailRef`, `List<IdentityTraceRecordRef>`, `AuditCursorRef`, `VisibilityResultRef`, found / empty / not_visible / degraded marker | `AuditTrail` 或按 scope 组装的 trace refs | 身份事实消费与追溯 | audit 读取不修复缺失 trace;不保存 observability raw log;cursor 不得当 truth cursor |

#### 7.10.7 Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| 暂不定义 | 不适用 | 不适用 | 不适用 | 身份事实消费与追溯 | 本批不消费外部事件;外部来源进入前序 7-C~7-E 或后续 7-G/7-H |

#### 7.10.8 Outbound Event 骨架

| Event | 产生来源 | 输出骨架 | 主要消费者 | 边界 |
|---|---|---|---|---|
| 暂不新增 | 不适用 | 不适用 | 不适用 | 身份事实消费与追溯 | 本批 Query 输出不作为 outbound event;accepted fact 事件统一在 7-H 收敛 |

#### 7.10.9 Operations Job 骨架

| Job | 输入来源 | 输出结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|
| 暂不定义 | 不适用 | 不适用 | 身份事实消费与追溯 | projection rebuild、trace projection refresh、reconciliation 留给 7-G |

#### 7.10.10 外部接缝记录

| 接缝 | 使用接口 | 输入 / 输出骨架 | 后续承接 | 边界 |
|---|---|---|---|---|
| summary projection boundary | `ReadMemberSummary` | 输入 `GlobalMemberRef`, visibility context;输出 `MemberSummaryView` / stale / degraded marker | Step 8 / Step 9 / `03` 定义 projection freshness、cursor 和 fallback | Query 不写 truth,不触发 rebuild |
| trace repository boundary | `ReadIdentityTrace`, `ReadAuditTrail` | 输入 member / subject / scope / cursor;输出 trace refs / redacted trace material | `03` 定义 trace query port、分页和排序 contract | trace 只读,不替代业务 truth |
| visibility / redaction boundary | 全部 Query | 输入 `ActorContext`, `ConsumerRef`, `VisibilityContextRef`;输出 `VisibilityResultRef` / redacted marker | `03` 定义字段级 redaction schema | 不可见内容不得通过 summary、trace、audit、diagnostic 泄漏 |
| consumer boundary | `ReadMemberSummary` | 输入 consumer / scope;输出 safe summary refs 和 degraded marker | Step 12 / `03` 定义 consumer-facing DTO | consumer 只能读,不得反写 identity truth |

#### 7.10.11 本批接口审计

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只定义 Query | 通过 | 本批不新增 Command、Inbound Event、Outbound Event 或 Job |
| Query 是否保持 no-write | 通过 | 三个 Query 均只读 summary / trace / audit,stale 只返回 marker |
| visibility 是否闭合到概要层 | 通过 | 所有 Query 强制携带 visibility context 和 result marker,字段级 schema 后移 `03` |
| forbidden body 是否闭合 | 通过 | 明确禁止外部正文通过 summary、trace、audit 或 diagnostic 输出 |
| trace / audit 是否被当作第二 truth | 通过 | trace / audit 只读,不修复业务 truth 或 projection |
| 是否提前展开详细 schema / port trait | 通过 | 仅保留输入 / 输出骨架和接缝记录,完整契约后移 `03` |

#### 7.10.12 本批回填草稿

正式 `02-概要设计.md` §7 中,本批可汇总为:

- `ReadMemberSummary` 是成员身份事实消费的统一 Query 骨架。
- `ReadIdentityTrace` 是身份变化追溯 Query 骨架。
- `ReadAuditTrail` 是审计时间线 Query 骨架。
- 本批不定义 Command、Inbound Event、Outbound Event 或 Operations Job。
- 所有读取都必须经过 visibility / redaction 边界,并以 not visible / stale / degraded marker 表达失败或降级,不得写 truth 或泄漏外部正文。

#### 7.10.13 本批待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 7-F 只定义 Query | 若不认可,需要重新论证消费追溯是否允许写入 | 当前坚持 query no-write |
| 是否认可 `ReadMemberSummary` 作为统一消费摘要入口 | 若不认可,需要拆成更多 slice query 并重审 7-A~7-E 关系 | 当前保留统一入口,前序 slice query 仍可作为专项读取 |
| 是否认可 trace / audit 读取不触发修复 | 若不认可,会混入 7-G 维护职责 | 当前只返回 missing / stale / degraded marker |
| 是否认可字段级 redaction schema 后移 `03` | 若不认可,本 Step 会越界进入 protocol schema | 当前只保留 visibility context / result marker |

#### 7.10.14 进入 7-G 的条件

进入 7-G “派生维护与对账”前,需要用户确认:

- `ReadMemberSummary` / `ReadIdentityTrace` / `ReadAuditTrail` 的分类和边界可以作为后续 Step 8 / Step 9 输入。
- 读取路径不得创建、刷新、修复或反写 identity truth。
- visibility、not visible、stale、degraded 和 forbidden body 不泄漏口径已满足本批停审。

### 7.11 7-G 派生维护与对账接口骨架

#### 7.11.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-014` | 支持 identity 投影、外部引用状态和对账结果的维护读取与后台维护 |
| `BR-ID-015` | 维护 / 对账只能 report-only 或更新本仓派生状态,不得修复相邻仓 truth |
| `VETO-ID-005` | maintenance / reconciliation 修改相邻仓 truth 或绕过正式 command 写入 identity truth 为 0 容忍 |
| `AC-ID-005` | 需要证明消费者可消费身份事实、变化可追溯、对账不修复相邻仓 truth |
| 架构 ADR-ID-ARCH-009 | 后台 projection / reference / reconciliation 只能延后、可报告、可降级,不得成为 accepted truth 前置 |
| Step 5 “派生维护与对账” | projection rebuild、reference refresh、漂移发现和 report-only finding |
| Step 6 `ProjectionState` | identity-owned projection freshness / stale / degraded / rebuild 状态主语 |
| Step 6 `ReferenceResolutionState` | 外部 reference resolved / stale / unavailable / unrecognized / refresh failed 状态主语 |
| Step 6 `ReconciliationPolicy` | report-only、no cross-repo repair、no command bypass、no query refresh guard |
| Step 6 `ReconciliationReport` | 对账范围、issue refs、finding、失败和 partial result 的 report-only 主语 |

#### 7.11.2 本批问题回答

| 问题 | 结论 |
|---|---|
| 本批是否需要 Command? | 不需要。派生维护不能作为业务 Command 改写 identity truth,更不能修复外部 truth。 |
| 本批是否需要 Query? | 需要。需要读取 projection state、reference resolution state 和 reconciliation report。 |
| 本批是否需要 Inbound Event Consumer? | 暂不需要。外部来源状态进入前序 7-C~7-E 的 source consumer 或由本批 job 主动刷新 marker,不在此新增事件消费面。 |
| 本批是否需要 Outbound Event? | 暂不新增。维护状态变化是否需要传播统一交给 7-H 的 outbox / handoff 批次复核,本批只生成可被读取的派生状态和报告。 |
| 本批是否需要 Operations Job? | 需要。projection rebuild、reference refresh 和 reconciliation 都是后台维护任务,不是业务 command。 |

#### 7.11.3 当前材料诊断

| 风险 | 具体表现 | 本批处理 |
|---|---|---|
| 对账变成跨仓修复 | job 发现 work / method / memory / governance 漂移后直接修改相邻仓或本仓核心 truth | 所有 job 只能更新 `ProjectionState`、`ReferenceResolutionState` 或生成 `ReconciliationReport` |
| projection 被当作第二 truth | 重建 summary 后覆盖 `GlobalMember`、lifecycle、role、career、memory truth | `RebuildIdentityProjection` 只重建派生视图和状态,不写核心 truth |
| reference refresh 保存外部正文 | 刷新时把 method body、work body、memory body、archive package 写入报告或状态 | 只保存 refs、safe marker、issue refs 和状态 marker |
| Query 触发维护 | 读取 state / report 时同步执行 rebuild、refresh 或 reconciliation | Query 只读,维护必须由 Operations Job 显式运行 |
| 失败被吞掉 | refresh failed / partial reconciliation 被伪装成 resolved 或 clean | 输出必须保留 stale、degraded、failed、partial、finding detected marker |

#### 7.11.4 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 把 rebuild / refresh / reconciliation 写成业务 Command | 不采用 | 它们不代表业务 actor 改写 identity truth,只能作为后台维护任务 |
| 为 projection state / reference state 提供 Query | 采用 | 消费方和运维需要读取 freshness / stale / degraded,但读取必须 no-write |
| 为 reconciliation report 提供 Query | 采用 | report-only finding 需要可读、可追溯、可降级 |
| 本批直接发布 derived-state changed event | 不采用 | 事件传播机制、outbox material 和 publish job 在 7-H 统一收敛 |
| 在报告中保存外部 source body | 不采用 | 违反 forbidden body 和跨仓 truth 边界 |

#### 7.11.5 Command API 骨架

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|---|
| 暂不定义 | 不适用 | 不适用 | 不适用 | 不适用 | 派生维护与对账 | 本批禁止通过 Command 重建 projection、刷新外部引用、修复 truth 或生成自动修复计划 |

#### 7.11.6 Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `GetProjectionState` | `ActorContext`, `QueryMetadata`, `VisibilityContextRef`, `IdentityProjectionRef`, optional `GlobalMemberRef`, optional `ConsistencyHintRef` | `ProjectionStateResult`:`IdentityProjectionRef`, `ProjectionStateRef`, `ProjectionStateKind`, optional `IdentityProjectionCursorRef`, `VisibilityResultRef`, found / not_found / stale / degraded / rebuild_failed marker | `ProjectionState` 和 projection metadata | 派生维护与对账 | 不触发 rebuild;不返回 projection body 中不可见字段;不把 cursor 当 truth cursor |
| `GetReferenceResolutionState` | `ActorContext`, `QueryMetadata`, `VisibilityContextRef`, `ExternalReferenceRef`, optional `IdentityReferenceOwnerRef`, optional `ConsistencyHintRef` | `ReferenceResolutionStateResult`:`ExternalReferenceRef`, `ReferenceResolutionStateRef`, `ReferenceResolutionStateKind`, optional `ReferenceIssueRef`, `VisibilityResultRef`, found / not_found / resolved / stale / unavailable / unrecognized / refresh_failed marker | `ReferenceResolutionState` | 派生维护与对账 | 不调用外部 resolver;不保存或返回外部正文;unrecognized / unavailable 不得伪装成 resolved |
| `ReadReconciliationReport` | `ActorContext`, `QueryMetadata`, `VisibilityContextRef`, `MaintenanceScopeRef`, optional `ReconciliationReportRef`, optional `ReportCursorRef` | `ReconciliationReportResult`:`MaintenanceScopeRef`, optional `ReconciliationReportRef`, `ReconciliationReportState`, `List<ReconciliationIssueRef>`, `ReportCursorRef`, `VisibilityResultRef`, found / empty / not_visible / finding_detected / failed / partial marker | `ReconciliationReport` store 和 redacted report view | 派生维护与对账 | report-only;不返回外部 body;不把 finding 当自动 remediation plan |

#### 7.11.7 Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| 暂不定义 | 不适用 | 不适用 | 不适用 | 派生维护与对账 | 本批不新增外部事件消费面;source event 进入 7-C~7-E,后台 refresh 通过 job 处理 |

#### 7.11.8 Outbound Event 骨架

| Event | 产生来源 | 输出骨架 | 主要消费者 | 边界 |
|---|---|---|---|---|
| 暂不新增 | 不适用 | 不适用 | 不适用 | 派生状态或 report 是否需要传播,留给 7-H 与 outbox / publish 机制一起复核;本批不提前定义 event payload |

#### 7.11.9 Operations Job 骨架

| Job | 输入来源 | 输出结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|
| `RebuildIdentityProjection` | job run metadata, system actor, `MaintenanceScopeRef`, `IdentityProjectionRef`, optional `GlobalMemberRef`, optional `IdentityProjectionCursorRef` | 更新 `ProjectionState` 为 rebuilt / stale / degraded / rebuild_failed;必要时生成 report issue ref | 派生维护与对账 | 只重建 identity-owned projection;不写 `GlobalMember`、lifecycle、role、career、memory truth;不在 query path 运行 |
| `RefreshExternalReferenceState` | job run metadata, system actor, `MaintenanceScopeRef`, `ExternalReferenceRef` 或 reference owner scope, optional `ReferenceRefreshCursorRef` | 更新 `ReferenceResolutionState` 为 resolved / stale / unavailable / unrecognized / refresh_failed;必要时生成 report issue ref | 派生维护与对账 | 只刷新 body-free reference marker;不修复外部 owner truth;不保存 source body / package |
| `RunIdentityReconciliation` | job run metadata, system actor, `MaintenanceScopeRef`, target refs, optional `ReconciliationCursorRef`, `ReconciliationPolicyRef` | 创建 `ReconciliationReport`;状态为 no_finding / finding_detected / failed / partial;记录 issue refs 和 trace marker | 派生维护与对账 | report-only;不自动修复;不绕过正式 command;不生成 remediation command |

#### 7.11.10 外部接缝记录

| 接缝 | 使用接口 | 输入 / 输出骨架 | 后续承接 | 边界 |
|---|---|---|---|---|
| projection store boundary | `GetProjectionState`, `RebuildIdentityProjection` | 输入 projection ref / scope / cursor;输出 `ProjectionState`、freshness / stale / failed marker | Step 8 / Step 9 / `03` 定义 rebuild flow、cursor、事务和失败语义 | projection 不是第二 truth,不能覆盖核心 truth |
| reference resolver boundary | `GetReferenceResolutionState`, `RefreshExternalReferenceState` | 输入 `ExternalReferenceRef`、owner scope、refresh cursor;输出 resolution state / issue marker | Step 12 / `03` 定义 resolver port、body-free summary 和错误分类 | 不保存外部正文,不修复外部仓 truth |
| reconciliation report store boundary | `ReadReconciliationReport`, `RunIdentityReconciliation` | 输入 maintenance scope / report ref / cursor;输出 report state、issue refs、finding refs | Step 8 / Step 10 / `03` 定义 report schema、finding 分类和 visibility | report 不等于修复计划,不自动触发 command |
| visibility / redaction boundary | 全部 Query 和 report 读取 | 输入 `ActorContext`, `VisibilityContextRef`;输出 `VisibilityResultRef` / redacted marker | `03` 定义字段级 redaction schema | 不可见 finding、source、basis 或 external ref 不得泄漏 |
| maintenance run metadata boundary | 全部 Job | 输入 run id、system actor、scope、cursor、dry-run / diagnostic marker | `04/05/06` 定义配置、测试和验收口径 | job 失败必须可报告,不得伪装成功 |

#### 7.11.11 本批接口审计

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否没有业务 Command | 通过 | 本批只定义 Query 和 Operations Job,不提供业务写入口 |
| Query 是否保持 no-write | 通过 | 三个 Query 只读 state / report,不触发 rebuild、refresh 或 reconciliation |
| Job 是否只写派生状态 / report | 通过 | 三个 Job 只更新 `ProjectionState`、`ReferenceResolutionState` 或 `ReconciliationReport` |
| report-only 是否闭合 | 通过 | `RunIdentityReconciliation` 不修复相邻仓 truth,不生成自动 remediation command |
| forbidden body 是否闭合 | 通过 | reference state 和 report 只保存 refs、marker、issue refs,不保存 source body 或 package |
| 是否提前展开详细 runner / retry / schema | 通过 | 只保留 job 骨架和接缝,runner、重试、cursor、schema 后移 Step 8~12 / `03/04` |

#### 7.11.12 本批回填草稿

正式 `02-概要设计.md` §7 中,本批可汇总为:

- `GetProjectionState` 是 identity-owned projection 状态只读 Query。
- `GetReferenceResolutionState` 是外部引用解析状态只读 Query。
- `ReadReconciliationReport` 是 report-only 对账报告读取 Query。
- `RebuildIdentityProjection`、`RefreshExternalReferenceState`、`RunIdentityReconciliation` 是派生维护与对账 Operations Job。
- 本批不定义业务 Command、Inbound Event Consumer 或 Outbound Event。
- 所有维护任务只能更新 projection state、reference resolution state 或 report,不得修复相邻仓 truth 或绕过正式 command 写 identity truth。

#### 7.11.13 本批待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可本批不定义业务 Command | 若不认可,需要重新论证维护任务是否可以改写 identity truth | 当前坚持 maintenance 不是业务 command |
| 是否认可 Query 不触发 rebuild / refresh / reconciliation | 若不认可,会破坏 query no-write 和可预测读取边界 | 当前 Query 只返回 stale / degraded / failed marker |
| 是否认可三类 Job 只写派生状态 / report | 若不认可,会触碰相邻仓 truth repair 或 command bypass | 当前只允许更新 `ProjectionState`、`ReferenceResolutionState`、`ReconciliationReport` |
| 是否认可本批不新增 Outbound Event | 若不认可,需提前定义 derived-state event 与 outbox 关系 | 当前留给 7-H 统一复核 |

#### 7.11.14 进入 7-H 的条件

进入 7-H “身份事实传播与外部交接”前,需要用户确认:

- `GetProjectionState` / `GetReferenceResolutionState` / `ReadReconciliationReport` 的分类和 no-write 边界可以作为后续 Step 8 / Step 9 输入。
- `RebuildIdentityProjection` / `RefreshExternalReferenceState` / `RunIdentityReconciliation` 只写派生状态或 report,不修复相邻仓 truth。
- report-only、forbidden body、stale / degraded / failed / partial 不隐藏的口径已满足本批停审。

### 7.12 7-H 身份事实传播与外部交接接口骨架

#### 7.12.1 本批输入与承接

| 来源 | 本批承接点 |
|---|---|
| `FR-ID-012` | 相邻仓需要通过正式边界消费 accepted identity fact |
| `FR-ID-013` | 身份变化 trace / audit / archive / observability material 需要可追溯交接 |
| `BR-ID-013` | 消费方只能读 / 订阅 / 展示,不得通过传播反写 identity truth |
| `BR-ID-014` | 传播和 handoff 必须可追溯到安全可见原因、来源、actor、basis 或 marker |
| `VETO-ID-003` | event / handoff material 携带 memory、artifact、conversation、runtime body 或 secret 为 0 容忍 |
| `AC-ID-005` | 必须证明身份事实可被消费、变化可追溯、传播失败不回滚 accepted truth |
| Step 5 “身份事实传播与外部交接” | accepted fact outbox、event propagation、trace / audit / archive handoff |
| Step 6 `IdentityOutboxRecord` / `OutboxState` | pending publish、published、retryable failed、failed、skipped 状态主语 |
| Step 6 `TraceHandoffIntent` / `HandoffState` | trace / audit / archive handoff intent 与 delivery / failure 状态主语 |
| Step 6 `OutboundEventPolicy` / `HandoffPolicy` | accepted-only、visibility、body-free、publish / handoff 不作 accepted 前置 guard |

#### 7.12.2 本批问题回答

| 问题 | 结论 |
|---|---|
| 本批是否需要 Command? | 需要一个受控 `PrepareTraceHandoff`。它只创建 handoff intent,不发布、不交付、不改变业务 truth。 |
| 本批是否需要 Query? | 需要。需要读取 pending outbox 和 handoff state,供运维、诊断和恢复使用。 |
| 本批是否需要 Inbound Event Consumer? | 需要。handoff receipt / failure callback 是外部承接结果,只能更新 `HandoffState` marker。 |
| 本批是否需要 Outbound Event? | 需要统一列出前序 accepted fact material 对应的 outbound event skeleton,但发布机制由 job 执行。 |
| 本批是否需要 Operations Job? | 需要。outbox publish 和 handoff delivery / follow-up 都是后台任务,失败不回滚 accepted truth。 |

#### 7.12.3 当前材料诊断

| 风险 | 具体表现 | 本批处理 |
|---|---|---|
| publish 变成 command accepted 前置 | 建档 / lifecycle / role / career / memory command 等待下游发布成功才返回 accepted | 前序 command 只生成 pending outbox material;`PublishIdentityOutbox` 后台执行 |
| event 携带外部正文或不可见字段 | payload 中塞入 method body、work body、memory body、archive package、secret 或 redacted 字段 | `OutboundEventPolicy` 要求 payload marker body-free 且按 topic visibility 裁剪 |
| 未 accepted fact 被传播 | pending / rejected / stale / report finding 被当成身份事实事件发布 | outbox material 只能来自 accepted change 和正式 trace |
| handoff 伪成功 | intent 创建或请求发送后直接标记 delivered | delivered 必须来自正式 receipt marker;pending / retryable / failed 必须显式保留 |
| handoff target / receipt schema 被概要层脑补 | 当前 Step 直接定义 adapter、receipt body、target 字符串或 archive package | 本批只保留 refs / marker;正式 schema 后移 `03/04` |

#### 7.12.4 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 把每个业务 accepted fact 的 event 留在前序批次独立发布 | 不采用 | 前序只确认 event material 来源,发布与状态恢复必须在 7-H 统一处理 |
| 增加 `PrepareTraceHandoff` Command | 采用 | 特定 handoff intent 可能需要显式 actor / reason / target,但它不改变业务 truth |
| 把 outbox publish 写成 Operations Job | 采用 | 发布是基于 pending material 的后续交付,失败不回滚 accepted truth |
| 把 handoff receipt 写成 Command | 不采用 | receipt / failure 是外部承接结果,更适合作为 Inbound Event Consumer / callback |
| 在本批定义 topic 字符串、event envelope schema、handoff adapter schema | 不采用 | 这些属于 `03/04` 详细协议 / 配置,概要层只定义接口骨架和边界 |

#### 7.12.5 Command API 骨架

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|---|
| `PrepareTraceHandoff` | `ActorContext`, `CommandMetadata`, `IdempotencyKey`, `GlobalMemberRef`, `HandoffScopeRef`, `HandoffTargetRef`, `List<IdentityTraceRecordRef>`, optional `AuditTrailRef`, `TraceHandoffSafeMaterialRef`, `HandoffReasonRef`, `VisibilityContextRef` | `TraceHandoffCommandResult`:`GlobalMemberRef`, `TraceHandoffIntentRef`, `HandoffStateKind`, `HandoffTargetRef`, `HandoffScopeRef`, `IdentityTraceRecordRef` 或 handoff trace marker, accepted / duplicate / rejected marker | 读取 trace / audit refs;调用 `HandoffPolicy.assert_target_allowed(...)`、`assert_trace_refs_present(...)`、`assert_safe_material_body_free(...)`、`assert_visible_for_handoff(...)`;创建 `TraceHandoffIntent` 为 pending;记录 trace marker | 新增 pending `TraceHandoffIntent`;保存 `HandoffState::PendingHandoff`;追加 handoff trace marker;幂等结果 | 身份事实传播与外部交接 | 不执行交付;不保存 receipt body、archive package、raw log 或外部正文;不改变业务 truth;target / receipt schema 后移 `03/04` |

#### 7.12.6 Query API 骨架

| API | 输入骨架 | 输出骨架 | 读取来源 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `ListPendingIdentityOutbox` | `ActorContext`, `QueryMetadata`, `VisibilityContextRef`, optional `GlobalMemberRef`, optional `TopicKeyRef`, optional `OutboxStateKind`, optional `OutboxCursorRef` | `IdentityOutboxListResult`:`List<IdentityOutboxRecordRef>`, `OutboxCursorRef`, `VisibilityResultRef`, found / empty / not_visible / degraded marker | `IdentityOutboxRecord` 和 `OutboxState` | 身份事实传播与外部交接 | 只读 pending / retryable / failed 状态;不发布;不返回 payload body |
| `GetIdentityOutboxState` | `ActorContext`, `QueryMetadata`, `VisibilityContextRef`, `IdentityOutboxRecordRef` | `IdentityOutboxStateResult`:`IdentityOutboxRecordRef`, `OutboxStateKind`, optional `OutboxDeliveryAttemptRef`, optional `OutboxDeliveryIssueRef`, `VisibilityResultRef`, found / not_found / not_visible marker | `IdentityOutboxRecord` / `OutboxState` | 身份事实传播与外部交接 | 不把 `Published` 解释为下游业务已处理;不泄露 topic 私有字段 |
| `GetTraceHandoffState` | `ActorContext`, `QueryMetadata`, `VisibilityContextRef`, `TraceHandoffIntentRef` | `TraceHandoffStateResult`:`TraceHandoffIntentRef`, `HandoffStateKind`, optional `HandoffAttemptRef`, optional `HandoffReceiptRef`, optional `HandoffIssueRef`, `VisibilityResultRef`, found / not_found / pending / delivered / failed marker | `TraceHandoffIntent` / `HandoffState` | 身份事实传播与外部交接 | 只返回 receipt marker;不返回 receipt body、archive package 或 raw log |

#### 7.12.7 Inbound Event Consumer 骨架

| Consumer | 来源 | 输入骨架 | 本地结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `HandleTraceHandoffResult` | archive / observability / audit handoff callback 或 event | event envelope, source event id, dedup key, trace context, `TraceHandoffIntentRef`, `HandoffTargetRef`, `HandoffAttemptRef`, optional `HandoffReceiptRef`, optional `HandoffIssueRef`, handoff result marker | 调用 `HandoffPolicy.assert_receipt_is_marker(...)` 或 failure marker guard;更新 `HandoffState` 为 delivered / retryable failed / failed / cancelled;记录 trace marker | 身份事实传播与外部交接 | 不保存 receipt body、archive package、raw log;不伪造 delivered;不反写外部承接方 truth |

若 handoff callback 缺少 intent ref、target ref、attempt ref 或 result marker,后续 Step 10 应进入 rejected、quarantine、pending review 或 report-only,不得自行拼接 receipt 或 target。

#### 7.12.8 Outbound Event 骨架

| Event | 产生来源 | 输出骨架 | 主要消费者 | 边界 |
|---|---|---|---|---|
| `GlobalMemberEstablished` | `EstablishGlobalMember` accepted outbox material | `GlobalMemberRef`, `IdentityOutboundSubjectRef`, `IdentityChangeKindRef`, `IdentityOutboundPayloadMarkerRef`, `IdentityTraceRecordRef`, `TopicKeyRef` | work、process、conversation、governance、workspace、runtime 等需要成员创建事实的相邻仓 | 只发布 accepted fact marker;不携带账号、credential、ProjectMember truth 或不可见字段 |
| `IdentityAnchorChanged` | `EstablishGlobalMember` 或后续 anchor accepted outbox material | `GlobalMemberRef`, `IdentityAnchorStateKind`, `IdentityOutboundPayloadMarkerRef`, `IdentityTraceRecordRef`, `TopicKeyRef` | 需要 identity anchor 变化的相邻仓 | 不携带账号、credential、runtime body 或 ProjectMember truth |
| `GlobalLifecycleChanged` | `UpdateGlobalLifecycleState` accepted outbox material | `GlobalMemberRef`, `LifecycleStateKind`, basis ref / marker, `IdentityTraceRecordRef`, `IdentityOutboundPayloadMarkerRef`, `TopicKeyRef` | 需要成员生命周期状态的相邻仓 | basis 只带 ref / marker;发布失败不回滚 lifecycle truth |
| `GlobalMemberAvailabilityChanged` | `UpdateGlobalLifecycleState` 产生可用性变化时的 accepted outbox material | `GlobalMemberRef`, availability marker, basis ref / marker, `IdentityTraceRecordRef`, `IdentityOutboundPayloadMarkerRef`, `TopicKeyRef` | 需要成员可用性快速判断的相邻仓 | 不替代 lifecycle truth;不携带高风险 basis body |
| `RoleCapabilitySummaryChanged` | `MaintainRoleCapabilitySummary` 或 source accepted outbox material | `GlobalMemberRef`, `RoleCapabilitySummaryRef`, safe summary marker, `IdentityTraceRecordRef`, `IdentityOutboundPayloadMarkerRef`, `TopicKeyRef` | method、work、process、conversation、governance 等需要角色能力摘要的相邻仓 | 不携带 RoleDefinition / CapabilityDefinition body 或 evidence body |
| `RoleCapabilitySourceStateChanged` | `HandleRoleCapabilitySourceChanged` accepted outbox material | `GlobalMemberRef`, `RoleCapabilitySourceRef`, source state marker, `IdentityTraceRecordRef`, `IdentityOutboundPayloadMarkerRef`, `TopicKeyRef` | 需要感知 role / capability source stale / unavailable 的相邻仓和维护任务 | 不携带 method body、role definition body、capability definition body 或 evidence body |
| `CareerRecordAppended` | `AppendCareerRecord` 或 work accepted source outbox material | `GlobalMemberRef`, `CareerRecordRef`, `CareerSafeSummaryRef`, source marker, `IdentityTraceRecordRef`, `IdentityOutboundPayloadMarkerRef`, `TopicKeyRef` | work、process、conversation、governance 等需要履历摘要的相邻仓 | 不携带 Project / WorkItem / ProjectMember body |
| `CareerCorrectionAppended` | career correction append accepted outbox material | `GlobalMemberRef`, `CareerRecordRef correction_record_ref`, optional `CareerRecordRef original_record_ref`, `CareerSafeSummaryRef`, `IdentityTraceRecordRef`, `IdentityOutboundPayloadMarkerRef`, `TopicKeyRef` | 审计、消费摘要和需要解释历史纠错的相邻仓 | 纠错仍是追加事件,不表示旧记录被删除或原地修改 |
| `MemoryReferenceChanged` | `MaintainMemoryReference`、memory source 或 handoff result accepted outbox material | `GlobalMemberRef`, `MemoryReferenceRef`, `MemoryReferenceStateKind`, optional `MemoryRef`, optional `ArchiveRef`, `IdentityTraceRecordRef`, `IdentityOutboundPayloadMarkerRef`, `TopicKeyRef` | 需要 memory / archive ref 摘要的相邻仓和维护任务 | 不携带 memory body、embedding、archive package 或 receipt body |
| `MemoryArchiveHandoffStateChanged` | `HandleArchiveHandoffResult` accepted outbox material | `GlobalMemberRef`, `MemoryReferenceRef`, `ArchiveRef`, `ArchiveHandoffRef`, `MemoryReferenceStateKind`, `IdentityTraceRecordRef`, `IdentityOutboundPayloadMarkerRef`, `TopicKeyRef` | 需要感知迁移 / 冷存 / handoff 状态的相邻仓和维护任务 | 只传播 refs / marker / state,不传播 receipt body 或 package metadata |

本批只定义 outbound event skeleton。事件 envelope、topic routing、payload version、redaction schema 和 publisher adapter 后移 `03/04`。

#### 7.12.9 Operations Job 骨架

| Job | 输入来源 | 输出结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|
| `PublishIdentityOutbox` | job run metadata, system actor, `IdentityOutboxRecordRef` 或 `TopicKeyRef` / state scope, optional `OutboxCursorRef`, optional retry policy marker | 调用 `OutboundEventPolicy`;发布 pending / retryable outbox;更新 `OutboxState` 为 published / retryable failed / failed / skipped by policy | 身份事实传播与外部交接 | 发布失败不回滚 accepted truth;不发布未 accepted material;不保存下游 body |
| `DeliverTraceHandoff` | job run metadata, system actor, `TraceHandoffIntentRef` 或 `HandoffTargetRef` / state scope, optional `HandoffCursorRef`, optional retry policy marker | 调用 `HandoffPolicy`;向 handoff boundary 交付 safe material marker;更新 `HandoffState` 为 retryable failed / failed,delivered 需 receipt marker | 身份事实传播与外部交接 | 不伪造 delivered;不保存 receipt body / package;不改变业务 truth |
| `RetryIdentityPropagationFailures` | job run metadata, system actor, propagation failure scope, optional `OutboxCursorRef`, optional `HandoffCursorRef` | 选择 retryable outbox / handoff records 并重新执行 publish / deliver;不可恢复项生成 issue marker | 身份事实传播与外部交接 | 只处理 retryable marker;不绕过 policy;不把重试成功当作新业务 fact |

#### 7.12.10 外部接缝记录

| 接缝 | 使用接口 | 输入 / 输出骨架 | 后续承接 | 边界 |
|---|---|---|---|---|
| outbox store boundary | `ListPendingIdentityOutbox`, `GetIdentityOutboxState`, `PublishIdentityOutbox`, `RetryIdentityPropagationFailures` | 输入 outbox ref / topic / cursor;输出 outbox state、attempt ref、issue ref | Step 8 / Step 9 / `03` 定义 outbox prepare / publish flow、状态矩阵、事务和去重 | outbox 不重算 truth,不保存 payload body |
| outbound publisher boundary | `PublishIdentityOutbox` | 输入 topic key、payload marker、trace ref;输出 delivery attempt / issue marker | `03/04` 定义 envelope schema、topic routing、adapter profile | publish 失败不回滚 accepted truth,不表示下游业务已处理 |
| handoff store boundary | `PrepareTraceHandoff`, `GetTraceHandoffState`, `DeliverTraceHandoff`, `HandleTraceHandoffResult` | 输入 handoff intent / target / scope;输出 handoff state、attempt / receipt / issue marker | Step 8 / Step 9 / `03` 定义 handoff flow、状态矩阵、去重和并发 | handoff intent 不保存 receipt body 或 package |
| handoff delivery boundary | `DeliverTraceHandoff`, `HandleTraceHandoffResult` | 输入 safe material marker、target ref;输出 receipt / failure marker | `03/04` 定义 target、receipt、adapter 和 config | 不自造 target / receipt schema,不伪造 delivered |
| visibility / redaction boundary | event material、query、handoff | 输入 `VisibilityContextRef`;输出 `VisibilityResultRef` / safe marker | `03` 定义字段级 redaction 和 topic / handoff 可见性 | 不可见字段不得通过 event、query、handoff、diagnostic 泄漏 |

#### 7.12.11 本批接口审计

| 审查项 | 结论 | 说明 |
|---|---|---|
| Command 是否只创建 handoff intent | 通过 | `PrepareTraceHandoff` 只创建 pending intent,不发布、不交付、不改变业务 truth |
| Query 是否保持 no-write | 通过 | 三个 Query 只读 outbox / handoff state |
| Inbound Consumer 是否只处理外部结果 marker | 通过 | `HandleTraceHandoffResult` 只消费 receipt / failure marker,不保存 body |
| Outbound Event 是否只来自 accepted fact | 通过 | 十类 canonical event 均来自前序 accepted outbox material |
| Operations Job 是否与 accepted truth 分离 | 通过 | publish / deliver / retry 失败不回滚 accepted truth,成功也不产生新业务 fact |
| 是否提前展开详细 schema / adapter | 通过 | topic、envelope、receipt、adapter、runner、retry 细节后移 Step 8~12 / `03/04` |

#### 7.12.12 本批回填草稿

正式 `02-概要设计.md` §7 中,本批可汇总为:

- `PrepareTraceHandoff` 是显式准备 trace / audit / archive handoff intent 的 Command,只创建 pending intent。
- `ListPendingIdentityOutbox`、`GetIdentityOutboxState`、`GetTraceHandoffState` 是传播 / 交接状态只读 Query。
- `HandleTraceHandoffResult` 是 handoff receipt / failure marker 的 Inbound Event Consumer。
- `GlobalMemberEstablished`、`IdentityAnchorChanged`、`GlobalLifecycleChanged`、`GlobalMemberAvailabilityChanged`、`RoleCapabilitySummaryChanged`、`RoleCapabilitySourceStateChanged`、`CareerRecordAppended`、`CareerCorrectionAppended`、`MemoryReferenceChanged`、`MemoryArchiveHandoffStateChanged` 是 accepted identity fact 的 outbound event skeleton。
- `PublishIdentityOutbox`、`DeliverTraceHandoff`、`RetryIdentityPropagationFailures` 是传播 / 交接 Operations Job。
- publish / handoff 失败不得回滚 accepted truth;event / handoff material 不得携带外部正文、secret、不可见字段、receipt body 或 archive package。

#### 7.12.13 本批待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 `PrepareTraceHandoff` 作为唯一新增 Command | 若不认可,需要改为纯 job 生成 intent 或拆分更多 handoff command | 当前只允许创建 pending handoff intent,不改变业务 truth |
| 是否认可本批统一收敛前序 accepted event skeleton | 若不认可,需回到 7-A~7-E 分散定义发布边界 | 当前前序只给 material,7-H 统一发布 |
| 是否认可 handoff receipt 走 Inbound Event Consumer | 若不认可,需说明 receipt 是否由 command 或 job 直接写入 | 当前外部结果只以 marker / callback 进入 |
| 是否认可 topic / envelope / receipt / adapter schema 后移 `03/04` | 若不认可,本 Step 会越界进入 protocol / config 设计 | 当前只保留 refs、marker 和接口骨架 |

#### 7.12.14 进入 7-I 的条件

进入 7-I “跨接口一致性审计”前,需要用户确认:

- `PrepareTraceHandoff`、outbox / handoff Query、`HandleTraceHandoffResult`、outbound event skeleton 和 propagation jobs 的分类可以作为后续 Step 8 / Step 9 输入。
- accepted fact propagation、publish 不作 accepted 前置、handoff 不保存正文 / 不伪成功的边界已满足本批停审。
- topic、event envelope、handoff target、receipt 和 adapter schema 后移 `03/04` 的口径可以接受。

### 7.13 7-I 跨接口一致性审计

#### 7.13.1 审计目标

本批不新增业务接口,只对 7-A~7-H 的 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 和外部接缝做一致性审计。目标是确认接口分类没有混淆、每个接口都有 Step 6 对象承接、事件命名不分叉、Step 8 可按接口展开处理流,且没有被本 Step 提前写成 DTO / port / adapter / runner 细节。

#### 7.13.2 接口总表

| 类别 | 接口 | 所属批次 | 主要对象承接 | Step 8 展开方向 |
|---|---|---|---|---|
| Command | `EstablishGlobalMember` | 7-A | `GlobalMember`, `IdentityAnchorState`, `IdentityAnchorPolicy` | create member / anchor accepted flow |
| Command | `UpdateGlobalLifecycleState` | 7-B | `GlobalLifecycleState`, `LifecycleTransitionPolicy`, `HighRiskLifecycleGuard` | lifecycle transition / high-risk basis flow |
| Command | `MaintainRoleCapabilitySummary` | 7-C | `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, `RoleCapabilitySourcePolicy` | maintain summary / evidence-source guard flow |
| Command | `AppendCareerRecord` | 7-D | `CareerRecord`, `CareerAppendPolicy` | append-only career / correction flow |
| Command | `MaintainMemoryReference` | 7-E | `MemoryReference`, `MemoryReferenceState`, `MemoryReferencePolicy` | memory ref relation / state update flow |
| Command | `PrepareTraceHandoff` | 7-H | `TraceHandoffIntent`, `HandoffState`, `HandoffPolicy` | prepare handoff intent flow |
| Query | `GetGlobalMemberAnchor` | 7-A | `GlobalMember`, `IdentityAnchorState` | anchor read no-create flow |
| Query | `GetGlobalLifecycleSummary` | 7-B | `GlobalLifecycleState`, `MemberSummaryView` | lifecycle read / visibility flow |
| Query | `GetRoleCapabilitySummary` | 7-C | `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot` | role-capability read / stale marker flow |
| Query | `ListCareerRecords` | 7-D | `CareerRecord`, `MemberSummaryView` | career list / visibility flow |
| Query | `ListMemoryReferences` | 7-E | `MemoryReference`, `MemoryReferenceState`, `MemberSummaryView` | memory ref list / visibility flow |
| Query | `ReadMemberSummary` | 7-F | `MemberSummaryView`, `VisibilityPolicy`, `ProjectionState` | member summary read / degraded flow |
| Query | `ReadIdentityTrace` | 7-F | `IdentityTraceRecord`, `VisibilityPolicy` | trace read / redaction flow |
| Query | `ReadAuditTrail` | 7-F | `AuditTrail`, `IdentityTraceRecord`, `VisibilityPolicy` | audit read / redaction flow |
| Query | `GetProjectionState` | 7-G | `ProjectionState` | projection state read flow |
| Query | `GetReferenceResolutionState` | 7-G | `ReferenceResolutionState` | reference state read flow |
| Query | `ReadReconciliationReport` | 7-G | `ReconciliationReport`, `ReconciliationPolicy` | report read / visibility flow |
| Query | `ListPendingIdentityOutbox` | 7-H | `IdentityOutboxRecord`, `OutboxState` | outbox state read flow |
| Query | `GetIdentityOutboxState` | 7-H | `IdentityOutboxRecord`, `OutboxState` | single outbox state read flow |
| Query | `GetTraceHandoffState` | 7-H | `TraceHandoffIntent`, `HandoffState` | handoff state read flow |
| Inbound Event Consumer | `HandleRoleCapabilitySourceChanged` | 7-C | `RoleCapabilitySourceSnapshot`, `ReferenceResolutionState` | method source changed / stale or accepted source flow |
| Inbound Event Consumer | `HandleWorkParticipationAccepted` | 7-D | `CareerRecord`, `CareerAppendPolicy` | work participation append / duplicate guard flow |
| Inbound Event Consumer | `HandleMemoryReferenceSourceStateChanged` | 7-E | `MemoryReferenceState`, `ReferenceResolutionState` | memory source state update flow |
| Inbound Event Consumer | `HandleArchiveHandoffResult` | 7-E | `MemoryReference`, `MemoryReferenceState` | archive result marker flow |
| Inbound Event Consumer | `HandleTraceHandoffResult` | 7-H | `TraceHandoffIntent`, `HandoffState`, `HandoffPolicy` | handoff receipt / failure marker flow |
| Operations Job | `RebuildIdentityProjection` | 7-G | `ProjectionState`, `ReconciliationReport` | projection rebuild flow |
| Operations Job | `RefreshExternalReferenceState` | 7-G | `ReferenceResolutionState`, `ReconciliationReport` | reference refresh flow |
| Operations Job | `RunIdentityReconciliation` | 7-G | `ReconciliationPolicy`, `ReconciliationReport` | report-only reconciliation flow |
| Operations Job | `PublishIdentityOutbox` | 7-H | `IdentityOutboxRecord`, `OutboxState`, `OutboundEventPolicy` | outbox publish flow |
| Operations Job | `DeliverTraceHandoff` | 7-H | `TraceHandoffIntent`, `HandoffState`, `HandoffPolicy` | handoff delivery flow |
| Operations Job | `RetryIdentityPropagationFailures` | 7-H | `IdentityOutboxRecord`, `TraceHandoffIntent`, `OutboxState`, `HandoffState` | retry propagation / handoff failures flow |

#### 7.13.3 Outbound Event 命名审计

| Event | 首次确认批次 | 7-H 收敛状态 | 说明 |
|---|---|---|---|
| `GlobalMemberEstablished` | 7-A | 保留 | 成员建档 accepted fact event |
| `IdentityAnchorChanged` | 7-A | 保留 | anchor change event material |
| `GlobalLifecycleChanged` | 7-B | 保留 | lifecycle state change event |
| `GlobalMemberAvailabilityChanged` | 7-B | 保留 | availability change event |
| `RoleCapabilitySummaryChanged` | 7-C | 保留 | role / capability summary accepted change |
| `RoleCapabilitySourceStateChanged` | 7-C | 保留 | source state accepted / stale marker change |
| `CareerRecordAppended` | 7-D | 保留 | career append accepted event |
| `CareerCorrectionAppended` | 7-D | 保留 | correction append accepted event |
| `MemoryReferenceChanged` | 7-E | 保留 | memory reference accepted state / relation change |
| `MemoryArchiveHandoffStateChanged` | 7-E | 保留 | archive / migration handoff state event |

本审计已将 7-H 的临时总称 event 名收敛回前序 canonical 名称,避免 Step 8 同时继承 `IdentityLifecycleChanged` / `GlobalLifecycleChanged` 或 `CareerRecordChanged` / `CareerRecordAppended` 这类双命名。

#### 7.13.4 分类边界审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| Command 是否只改写本仓 truth / intent | 通过 | 6 个 Command 均有 Step 6 对象主语;`PrepareTraceHandoff` 只创建 handoff intent,不是业务 truth 改写 |
| Query 是否 no-write | 通过 | 14 个 Query 均只读 truth summary、projection、trace、audit、report、outbox 或 handoff state |
| Inbound Event Consumer 是否只消费外部已成立事实 / marker | 通过 | 5 个 Consumer 均要求 event envelope、source event id、dedup key 和 body-free refs / marker |
| Outbound Event 是否只来自 accepted fact material | 通过 | 10 个 canonical event 均由前序 accepted command / consumer outbox material 产生 |
| Operations Job 是否不作为业务 command | 通过 | 6 个 Job 均基于已有 state / marker / report / pending material 执行,不绕过 command 写 truth |
| 外部接缝是否没有变成主接口类别 | 通过 | repository、resolver、publisher、handoff、visibility 等只作为边界记录,不与 API 类别混用 |

#### 7.13.5 对象承接审计

| 主要组成部分 | 接口覆盖 | Step 6 对象承接 | 结论 |
|---|---|---|---|
| 身份锚定与成员真相 | Command / Query / Outbound Event | `GlobalMember`, `IdentityAnchorState`, `IdentityAnchorPolicy`, `IdentityTraceRecord`, `IdentityOutboxRecord` | 无悬空接口 |
| 全局生命周期 | Command / Query / Outbound Event | `GlobalLifecycleState`, `LifecycleTransitionPolicy`, `HighRiskLifecycleGuard`, `IdentityTraceRecord`, `IdentityOutboxRecord` | 无悬空接口 |
| 角色能力摘要 | Command / Query / Inbound Event / Outbound Event | `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, `RoleCapabilitySourcePolicy`, `ReferenceResolutionState` | 无悬空接口 |
| 身份生涯记录 | Command / Query / Inbound Event / Outbound Event | `CareerRecord`, `CareerAppendPolicy`, `IdentityTraceRecord`, `IdentityOutboxRecord` | 无悬空接口 |
| 记忆引用关系 | Command / Query / Inbound Event / Outbound Event | `MemoryReference`, `MemoryReferenceState`, `MemoryReferencePolicy`, `ReferenceResolutionState` | 无悬空接口 |
| 身份事实消费与追溯 | Query | `MemberSummaryView`, `IdentityTraceRecord`, `AuditTrail`, `VisibilityPolicy`, `ProjectionState` | 无悬空接口 |
| 派生维护与对账 | Query / Operations Job | `ProjectionState`, `ReferenceResolutionState`, `ReconciliationPolicy`, `ReconciliationReport` | 无悬空接口 |
| 身份事实传播与外部交接 | Command / Query / Inbound Event / Outbound Event / Operations Job | `IdentityOutboxRecord`, `TraceHandoffIntent`, `OutboxState`, `HandoffState`, `OutboundEventPolicy`, `HandoffPolicy` | 无悬空接口 |

#### 7.13.6 Step 8 展开范围

| Step 8 处理流族 | 来源接口 | 必须展开 | 不得在 Step 8 偷换边界 |
|---|---|---|---|
| 建档 / anchor flow | `EstablishGlobalMember`, `GetGlobalMemberAnchor` | 创建、防复用、trace / outbox material、读取 no-create | 不引入账号、ProjectMember 或 runtime truth |
| lifecycle flow | `UpdateGlobalLifecycleState`, `GetGlobalLifecycleSummary` | 合法迁移、高风险 basis、trace / outbox、读取降级 | 不让后台 job 静默 pause / retire / tombstone |
| role capability flow | `MaintainRoleCapabilitySummary`, `HandleRoleCapabilitySourceChanged`, `GetRoleCapabilitySummary` | source / evidence guard、snapshot / stale、summary accepted path | 不保存 method body、role definition body 或 evidence body |
| career flow | `AppendCareerRecord`, `HandleWorkParticipationAccepted`, `ListCareerRecords` | append-only、source marker dedup、correction append | 不保存 Project / WorkItem / ProjectMember body |
| memory reference flow | `MaintainMemoryReference`, source / archive consumers, `ListMemoryReferences` | body-free ref relation、state update、handoff marker | 不保存 memory body、embedding、archive package 或 receipt body |
| consumption query flow | `ReadMemberSummary`, `ReadIdentityTrace`, `ReadAuditTrail` | visibility、redaction、not visible、stale / degraded | Query 不触发 rebuild / refresh / repair |
| maintenance flow | 7-G Jobs / Queries | projection rebuild、reference refresh、report-only reconciliation | 不修复相邻仓 truth,不生成自动 remediation command |
| propagation / handoff flow | 7-H Command / Consumer / Jobs / Queries / Events | prepare handoff、publish outbox、deliver handoff、retry / failure marker | publish / handoff 不作 accepted 前置,不伪造 delivered |

#### 7.13.7 后移到 `03/04` 的接口细节

| 后移项 | 后移原因 | 后续承接 |
|---|---|---|
| DTO 字段级 schema、payload version、error envelope | Step 7 只定义接口骨架 | `03-详细设计.md` protocol contracts |
| repository / resolver / publisher / handoff port trait | Step 7 不把 port 当主接口类别 | `03` trait / port / adapter contracts |
| event envelope、topic routing、schema version | 属于详细协议与配置绑定 | `03/04` |
| handoff target、receipt、package marker schema | 当前只允许 refs / marker,不保存 receipt body / package | `03/04` |
| projection cursor、reference refresh cursor、job retry policy | Step 7 只定义 job 输入骨架 | Step 8~12 / `03/04` |
| 字段级 visibility / redaction schema | `OQ-ID-004` 已后移 | `03` visibility / query contracts |

#### 7.13.8 Step 7 审计结论

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在无人承接接口 | 未发现 | 所有接口均能回指 Step 6 对象或对象能力 |
| 是否存在对象能力悬空 | 未发现 | Step 6 的主要对象均至少被 Command、Query、Consumer、Event 或 Job 使用 |
| 是否存在分类混淆 | 未发现 | Command、Query、Consumer、Event、Job 和外部接缝边界已分离 |
| 是否存在双命名 event | 已修正 | 7-H event 表已收敛到 7-A~7-E canonical 名称 |
| 是否提前写入未来 Step | 未发现 | 未创建 Step 8~14 文件;处理流、状态、port、DTO schema 保持后移 |
| 是否可以进入 Step 8 | 可以,待用户审核 | Step 8 仍需逐主要组成部分展开处理流,不得一次性生成全仓流总表 |

---

## 8. 复杂度判断 / 是否拆分

Step 7 必须拆成主要组成部分小循环。原因:

- Step 6 已按主要组成部分完成对象正式化,接口必须逐批回指这些对象。
- Command / Query / Event / Job 的分类错误会直接影响 Step 8 处理流和 Step 9 状态触发。
- event / job / external boundary 很容易混入 DTO、port、adapter 或实现 runner,需要逐批停审。
- 一次性接口总表已经在旧稿中出现对象名漂移和分类偏粗问题。

拆分方式:

- 主文件保留 Step 7 统一框架、分类规则、小循环计划、每批输出和最终审计。
- 后续内容继续写入本文件的连续批次小节;若单批过长,可在当前 Step 到达后创建 `02_hld_step_07_api_interface_skeleton_<batch>.md` 附录。
- 不创建 Step 8~Step 14 的未来文件。

---

## 9. 回填草稿

正式 `02-概要设计.md` §7 后续应回填:

1. 接口分类说明。
2. 按主要组成部分组织的接口骨架总表。
3. Command API 骨架表。
4. Query API 骨架表。
5. Inbound Event Consumer 骨架表。
6. Outbound Event 骨架表。
7. Operations Job 骨架表。
8. 外部接缝 / 后续详细设计承接表。
9. 接口归属停审记录和跨接口一致性审计表。

正式正文要等 Step 14 统一装配,当前不直接回填。

---

## 10. 待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 Step 7 先建立框架、再按 7-A~7-I 逐批补充 | 若不认可,需要重新决定 Step 7 写入方式 | 当前沿用 Step 6 的分批方式 |
| 是否认可不把 External Port 作为主接口类别并列 | 若不认可,后续需增加独立 port 表作为主表 | 当前将外部接缝作为每批边界和后续详细设计承接记录 |
| 是否认可 7-A “身份锚定与成员真相”接口骨架 | 若不认可,需先修正建档 / 读取 / 事件边界 | 已认可,已进入 7-B |
| 是否认可 7-B “全局生命周期”接口骨架 | 若不认可,需先修正 lifecycle command / query / event / basis 边界 | 已认可,已进入 7-C |
| 是否认可 7-C “角色能力摘要”接口骨架 | 若不认可,需先修正 role capability command / query / source event / forbidden body 边界 | 已认可,已进入 7-D |
| 是否认可 7-D “身份生涯记录”接口骨架 | 若不认可,需先修正 career append / query / work source event / append-only 边界 | 已认可,已进入 7-E |
| 是否认可 7-E “记忆引用关系”接口骨架 | 若不认可,需先修正 memory reference command / query / source event / handoff marker 边界 | 已认可,已进入 7-F |
| 是否认可 7-F “身份事实消费与追溯”接口骨架 | 若不认可,需先修正 summary / trace / audit query 和 visibility 边界 | 已认可,已进入 7-G |
| 是否认可 7-G “派生维护与对账”接口骨架 | 若不认可,需先修正 projection / reference / reconciliation query、job 和 report-only 边界 | 已认可,已进入 7-H |
| 是否认可 7-H “身份事实传播与外部交接”接口骨架 | 若不认可,需先修正 handoff command、outbox / handoff query、receipt consumer、outbound event 和 propagation job 边界 | 已认可,已进入 7-I |
| 是否认可 7-I “跨接口一致性审计” | 若不认可,需先修正接口分类、event 命名、对象承接或 Step 8 展开范围 | 当前等待审核;通过后进入 Step 8 |
| 是否认可下一步进入 Step 8 “关键处理流 / 重要函数数据流” | 若不认可,需继续修正 Step 7 | 当前按 SOP 顺序执行 |

---

## 11. 进入下一步条件

当前 Step 7 已完成,等待用户审核。进入 Step 8 前必须满足:

- 7-A~7-H 的主要组成部分接口骨架全部完成并通过停审:已满足。
- Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 分类清楚:已满足。
- 每个接口都有 Step 6 对象或对象能力承接:已满足。
- 每个 Command 都显式判断 `ActorContext`、`CommandMetadata` 和幂等信息:已满足。
- 每个 Query 都显式判断 `ActorContext`、`QueryMetadata`、visibility 和 degraded / not visible 口径:已满足。
- 每个 Inbound Event Consumer 都显式判断 event envelope、source event id、version / cursor 和 dedup key:已满足。
- 每个 Operations Job 都显式判断 run metadata、scope、cursor、system actor 和 report / retry boundary:已满足。
- 跨接口一致性审计无 unresolved 冲突:已满足。

用户审核通过后,进入 Step 8。Step 8 仍必须按主要组成部分逐批展开处理流,不得一次性生成全仓 flow 总表。
