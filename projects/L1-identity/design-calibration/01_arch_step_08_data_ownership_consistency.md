# Step 8. 数据所有权与一致性策略

> 对应正式章节: `01-架构设计.md` §9
> 本步状态: 已完成
> 前序依赖: Step 7 已完成
> 当前结论: `L1-identity` 只拥有平台级成员身份及其身份侧生命周期、摘要、引用关系、追加历史和自身追溯的正式真相;method / work / governance / memory / archive / runtime / observability / UI 的正文和业务 truth 均不归本仓。跨仓来源只能以 ref、snapshot、safe summary、basis marker 或 report-only finding 进入;projection、event shadow、query view 和对账结果不得反写真相。

---

## 1. Step 状态 + Step 内计划

- 本步目标: 明确本仓正式真相、快照 / 投影、引用关系和明确不拥有的正文 / 真相,并在此基础上定义强一致、最终一致、挂起、降级和 report-only 的架构口径。
- 复杂度判断: 本步必须按架构单元逐个定义数据归属和一致性规则;当前采用一个主控 Step 文件承载所有单元,不拆附录。
- 粒度约束: 本步只讨论架构层数据 ownership 和一致性口径,不写字段、表结构、DDL、cache key、repository 方法、event payload、outbox 机制或重试实现。
- 术语约束: Step 5 中的“本地索引 / 投影 / 引用”是语义结构分类;本步的“快照 / 投影数据、引用关系数据”是数据归属分类,两者相关但不等同。
- 停审要求: 本步完成后停留审核;已按用户“同意”进入 Step 9。

| 计划项 | 产物 | 状态 |
|---|---|---|
| 读取 Step 3 / Step 5 / Step 7 与需求数据归属输入 | 本步输入表 | 已完成 |
| 回答数据所有权和一致性问题 | SOP 问题回答表 | 已完成 |
| 诊断旧数据归属混层与一页式结论问题 | 当前材料 / 旧文档问题诊断表 | 已完成 |
| 记录数据 ownership 取舍 | 设计取舍表 | 已完成 |
| 输出正式真相、快照 / 投影、引用和禁止正文分类 | 结构化中间产物 | 已完成 |
| 按架构单元输出数据所有权表 | 结构化中间产物 | 已完成 |
| 输出一致性策略、失败挂起口径和数据红线 | 结构化中间产物 | 已完成 |
| 完成数据所有权停审和跨边界审计 | 结构化中间产物 | 已完成 |
| 形成正式 §9 回填草稿 | 回填草稿 | 已完成 |
| 自检并决定是否进入 Step 9 | 进入下一步条件 | 已完成 |

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `01_arch_step_03_responsibility_boundary.md` | 提供做 / 不做、易混职责和边界红线,用于排除 ProjectMember、RoleDefinition、memory body、runtime body 等外部 truth |
| `01_arch_step_05_bounded_context_subdomains.md` | 提供八个架构单元,用于逐单元定义 truth、snapshot / projection、reference 和 forbidden body |
| `01_arch_step_07_dependency_direction.md` | 提供依赖裁剪和倒置边界,用于确认外部来源只能以 ref / snapshot / marker / basis 进入 |
| `00-需求文档.md` §10 | 提供 `BR-ID-001`~`BR-ID-015` 业务规则、禁止行为和边界约束 |
| `00-需求文档.md` §11 | 提供需求层数据归属基线,用于架构层进一步拆分“归属 -> 一致性” |
| `00_req_step_10_business_rules_boundaries.md` | 提供禁止正文、追加历史、维护不反写和高风险依据规则 |
| `00_req_step_11_data_ownership.md` | 提供 truth / snapshot / reference / forbidden body 初始分类 |
| `架构设计讨论流程_SOP.md` Step 8 | 约束本步先回答问题、再诊断、再取舍、再结构化,并按架构单元停审 |
| `架构设计书写规范.md` §4.9 | 约束数据归属表、一致性策略表、图示和完成标准 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些数据由本仓拥有真相? | 平台级成员身份主语、稳定身份 ref、墓碑不复用语义、全局生命周期状态、生命周期变化原因的身份侧记录、身份侧角色 / 能力摘要采用状态、身份侧能力声明、成员生涯追加记录、成员与 memory / archive refs 的身份侧关系、identity 自身变化追溯、identity 自身投影 / 引用对账发现。 |
| 哪些数据只是快照、投影或引用? | 成员公开摘要、角色 / 能力来源摘要、外部来源状态、消费投影、trace view、projection cursor / state、对账报告视图属于快照 / 投影或报告;method source ref、ProjectMember ref、governance basis ref、memory / archive ref、evidence ref、observability handoff ref 属于引用关系。 |
| 哪些正文 / 真相本仓明确不拥有? | 认证账号、credential、token、session、ProjectMember、Project、WorkItem、RoleDefinition、CapabilityDefinition、method body、能力评估算法、memory 原文、embedding、archive package、artifact / evidence body、conversation message、runtime context、observability log / metric body、UI 私有展示状态。 |
| 哪些关系必须强一致? | 平台级成员身份建立与身份 ref 稳定性、同一 accepted identity truth 内部的生命周期状态变化、身份侧摘要采用状态、追加历史和引用关系写入必须在本仓 truth 边界内强一致。 |
| 哪些关系可以最终一致? | identity truth 到查询投影 / 消费投影 / event shadow / trace view 的传播,method / work / governance / memory / archive 外部来源与本仓 snapshot / reference state 的同步,下游消费状态与本仓 truth 的可见更新均采用最终一致。 |
| 失败时靠什么口径约束、补偿或挂起? | 缺少内部强一致条件时拒绝 accepted truth;外部来源不可用时保留 pending / stale / unavailable / degraded marker;高风险 lifecycle 缺依据时拒绝或待审;对账发现只 report-only;projection stale 只能暴露状态或重建,不得写 truth。 |
| 哪些数据边界如果不写清,后续最容易串仓? | GlobalMember / ProjectMember、全局 lifecycle / runtime availability、identity role summary / RoleDefinition、能力声明 / 评估算法、career record / project truth、memory ref relation / memory body、trace ref / observability log body、reconciliation finding / external truth repair。 |
| 每个架构单元拥有哪些 truth,只持有哪些 snapshot / projection / reference? | §7.4 已按八个架构单元列出正式真相、快照 / 投影、引用关系和明确不拥有。 |
| 每个架构单元的数据所有权完成后是否通过停审? | §7.8 已给出逐单元停审记录;当前整体等待用户审核。 |
| 所有数据边界完成后是否存在双真相、投影反写真相、引用正文入仓或一致性口径冲突? | §7.9 审计未发现 unresolved 冲突;能力画像摘要的“truth / snapshot 混合”已拆成 identity-side 声明 / 采用状态、外部来源摘要和证据引用三类。 |

---

## 4. 当前材料 / 旧文档问题诊断

| 诊断项 | 旧处理风险 | 本步处理 |
|---|---|---|
| 旧 Step 8 直接给结论表 | 缺少问题回答、诊断、取舍和架构单元停审,后续概要设计会把表当对象清单 | 按新版 SOP 重写,先收敛数据 ownership 逻辑,再输出结构化表 |
| “能力画像摘要”被写成 truth / snapshot 混合 | 后续实现无法判断哪些字段由 identity 拥有,哪些来自 method / evidence | 拆分为 identity-side 声明 / 采用状态、外部来源摘要和证据引用 |
| 成员公开摘要可能被误作 truth | 查询友好结构会反向约束核心身份状态 | 明确公开摘要是快照 / 投影,可裁剪、可重建、可 stale |
| 生涯记录可能吸收 work truth | 项目、任务、ProjectMember fact 被复制进 identity | 明确 identity 只拥有身份侧追加历史和 work refs,不拥有项目事实 |
| memory ref 关系可能扩展为 memory body | 记忆正文、embedding 或 archive package 可能进入 identity truth、event 或 report | 明确只拥有成员与 ref 的关系和状态 marker,正文为 forbidden body |
| governance basis 可能变成 governance truth | 生命周期依据可能复制 Gate / Policy / Approval 正文 | 明确只保存 basis ref / summary / marker,裁决 truth 归 governance |
| projection / query / report 可能反写 truth | 读模型、对账任务或消费方可能成为第二写源 | 明确 projection 可重建、query 不写、reconciliation report-only |
| outbox / event shadow 可能被误作 truth source | 重放事件或 bus 状态可能反向决定当前身份状态 | 明确 event shadow 只传播 accepted truth,不得定义 truth |
| 运行 / 观测正文可能被诊断需求吸收 | runtime context、logs、metrics 因排查便利进入报告或追溯 | 明确只能保存安全 marker、trace / audit refs 和 safe diagnostic summary |

---

## 5. 改动前后对比

| 维度 | 旧处理风险 | 新处理 |
|---|---|---|
| 数据分类 | 粗略列 truth / snapshot / reference / forbidden body | 先区分归属逻辑,再按架构单元细化 |
| 核心身份 | 成员 identity 与账号、runtime 或 ProjectMember 容易混层 | 平台级成员身份主语和稳定 ref 是本仓正式真相 |
| 生命周期 | 生命周期状态可能被外部 runtime / project 状态影响 | 全局 lifecycle 是本仓 truth;外部依据只作为 reference / basis |
| 角色能力 | 摘要、来源定义和证据混在一类 | identity 拥有身份侧摘要采用状态;method 定义正文外部拥有;证据只引用 |
| 生涯记忆 | 生涯、项目事实和 memory 正文混层 | identity 拥有身份侧追加历史和 ref relation,不拥有外部正文 |
| 消费追溯 | 投影和 trace view 被当成稳定 truth | 投影 / trace view 可重建或延迟,不得反写 |
| 一致性 | 只写强一致 / 最终一致口号 | 按数据关系说明失败处理:拒绝、待审、stale、pending、unavailable、report-only |
| 后续实现 | 容易从数据表直接推字段和 repository | 本步只给 ownership 和一致性口径,字段 / port / schema 留到 `02/03` |

---

## 6. 设计取舍

| 方案 / 取舍点 | 采用与否 | 理由 |
|---|---|---|
| 把所有成员相关数据都归 identity | 不采用 | 会吸收 ProjectMember、RoleDefinition、memory body、runtime context 和 UI 展示状态,打穿仓边界。 |
| 只保留成员身份主语,不保存摘要 / 引用 / 生涯 | 不采用 | 无法支撑生命周期、角色能力、生涯记忆和消费追溯核心闭环。 |
| 采用“正式真相 + 快照 / 投影 + 引用关系 + 明确不拥有”四类归属 | 采用 | 与需求层数据归属和架构书写规范一致,能稳定推导一致性策略。 |
| 将能力画像摘要继续保留为混合类型 | 不采用 | 混合类型会导致后续对象、字段和测试无法判断真实 ownership。 |
| 拆分能力画像摘要为 identity-side 声明 / 采用状态、外部来源摘要和证据引用 | 采用 | 既保留 identity 的可解释摘要能力,又防止 method / evidence truth 入仓。 |
| 对跨仓来源使用强一致事务 | 不采用 | 会形成共享事务或源码依赖,违反依赖裁剪和相邻仓 ownership。 |
| 对跨仓来源使用 ref / snapshot / marker 的最终一致 | 采用 | 能承接外部事实变化,同时避免复制正文和形成双 truth。 |
| 允许 projection / report 直接修复 truth | 不采用 | 会让派生结构成为第二写源,违反 `BR-ID-015` 和 `VETO-ID-005`。 |
| 在本步定义 repository、event payload、outbox retry 或数据库表 | 不采用 | 这些属于概要 / 详细 / 实施计划,不是架构 ownership 章节。 |

---

## 7. 结构化中间产物

### 7.1 数据类型判定表

| 数据类型 | identity 中的判断标准 | 本步允许内容 | 本步禁止误读 |
|---|---|---|---|
| 正式真相数据 | 没有 identity 就无法稳定回答平台级成员身份、全局状态、身份侧摘要或自身追溯的问题 | 成员身份主语、稳定 ref、lifecycle、identity-side summary、career record、memory ref relation、own trace / finding | 不等于所有成员相关数据都归 identity |
| 快照 / 投影数据 | 可从本仓 truth 或外部来源重新获得,用于读取、消费、展示、诊断或协作 | public summary、source summary、consumer projection、trace view、projection state、safe report view | 不得作为 accepted truth 的来源 |
| 引用关系数据 | 本仓只需要稳定指向外部对象、外部依据、外部正文或外部承载方 | method source ref、ProjectMember ref、governance basis ref、memory / archive ref、evidence ref、handoff ref | 引用不等于拥有正文或外部 truth |
| 明确不拥有的正文 / 真相 | 保存它会破坏 privacy、ownership、依赖裁剪或相邻仓 truth | method body、work truth、governance truth、memory body、artifact body、runtime body、credential、UI private state | 不得进入 truth、event、projection、report 或诊断正文 |

### 7.2 数据归属表

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| 平台级成员身份主语 | 正式真相数据 | `L1-identity` 拥有平台级 AI 员工身份本体。 | 不等同认证账号、ProjectMember、runtime instance 或 UI profile。 |
| 成员身份稳定 ref / tombstone 语义 | 正式真相数据 | 本仓拥有 ref 稳定、不复用和墓碑化后仍可追溯的语义。 | 外部系统只能引用,不得重分配或复用。 |
| 全局生命周期状态 | 正式真相数据 | 本仓拥有成员作为平台身份是否可用、暂停、退役或墓碑化的状态边界。 | 不等同项目内状态、任务状态或 runtime 可用性。 |
| 生命周期变化原因 / 操作者摘要 | 正式真相数据 | 本仓保存自身 accepted lifecycle 变化的安全可见原因和操作者摘要。 | 不保存认证 credential、完整外部审计正文或 governance 裁决正文。 |
| 高风险处置依据引用 | 引用关系数据 | 本仓只保存 governance / authorization basis ref 或 safe basis summary。 | Gate、Policy、Approval、Control truth 不归 identity。 |
| 身份侧角色摘要采用状态 | 正式真相数据 | 本仓拥有“某成员身份侧采用了哪些角色 / 职业摘要”的成员视角状态。 | RoleDefinition、CapabilityDefinition 和 method body 不归 identity。 |
| method / role source summary | 快照 / 投影数据 | 本仓可保存用于解释身份摘要的来源摘要、版本或失效状态。 | 来源摘要可 stale / refresh,不替代 method-library truth。 |
| 能力画像 identity-side 声明 | 正式真相数据 | 本仓拥有成员身份侧能力声明、采用状态和可追溯来源关系。 | 不拥有能力评估算法、模型输出正文或绩效评分 truth。 |
| 能力证据 / artifact / audit 引用 | 引用关系数据 | 本仓只保存证据引用或安全摘要。 | 证据正文、artifact body 和外部 audit body 不进入本仓。 |
| 身份侧生涯记录 | 正式真相数据 | 本仓拥有成员生涯中的身份侧追加历史。 | 生涯记录引用项目事实,但不定义 Project、WorkItem 或 ProjectMember truth。 |
| 项目 / ProjectMember / work 来源引用 | 引用关系数据 | 本仓保存 work 来源 ref、来源摘要或状态 marker。 | 项目事实、任务事实和 ProjectMember truth 归 `L1-work`。 |
| 成员与 memory / archive refs 的关系 | 正式真相数据 | 本仓拥有“成员关联哪些 memory / archive ref”的身份侧关系和变化原因。 | 不拥有 memory 原文、embedding、检索索引或 archive package。 |
| memory / archive 状态摘要 | 快照 / 投影数据 | 本仓可保存外部承载状态的 safe summary、pending / unavailable marker。 | 状态摘要不是 archive truth,也不是正文缓存。 |
| 成员公开摘要 / 可见消费摘要 | 快照 / 投影数据 | 本仓可提供可裁剪、可重建、可降级的成员消费摘要。 | 摘要不得绕过 visibility / privacy,也不得反向写 truth。 |
| identity 自身变化追溯 | 正式真相数据 | 本仓拥有自身 accepted truth 变化的追溯材料。 | 追溯只保存安全可见原因、refs 和 marker,不保存外部正文。 |
| trace view / audit view | 快照 / 投影数据 | 本仓可提供由追溯材料派生的只读视图。 | 视图 stale 不等于 truth 丢失,视图不得写回 truth。 |
| event / outbox shadow | 快照 / 投影数据 | 本仓可为传播 accepted truth 保存事件协作影子。 | event transport、bus state 和 consumer 私有状态不定义 identity truth。 |
| projection state / consumer state | 快照 / 投影数据 | 本仓可维护用于查询、消费和重建的派生状态。 | projection state 只能重建 / 标脏,不得成为写源。 |
| 引用 / 投影对账发现 | 快照 / 投影数据 | 本仓可记录 identity 自身引用、投影或消费边界的漂移发现。 | 对账发现是 report-only,不得修改相邻仓 truth。 |
| 认证账号 / credential / token / session / secret | 明确不拥有的正文 / 真相 | 不归 `L1-identity`。 | 不得保存、发布、诊断输出或作为成员 truth。 |
| Project / ProjectMember / WorkItem truth | 明确不拥有的正文 / 真相 | 归 `L1-work`。 | identity 只能引用或接收 safe summary。 |
| RoleDefinition / CapabilityDefinition / method body | 明确不拥有的正文 / 真相 | 归 `L3-method-library`。 | identity 只能保存来源引用和身份侧摘要。 |
| memory body / embedding / vector index / archive package | 明确不拥有的正文 / 真相 | 归 memory / archive / artifact 承载边界。 | identity 只能保存 ref、handoff marker 或状态摘要。 |
| conversation message / runtime context / observability log body / UI private state | 明确不拥有的正文 / 真相 | 归对应外部上下文或消费层。 | 不得因追溯、诊断或展示便利进入 identity。 |

### 7.3 一致性策略表

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 成员身份建档与稳定 ref 建立 | 正式真相数据 ↔ 正式真相数据 | 本仓 accepted truth 内强一致 | 条件不满足则不建立身份,不得部分生成可复用 ref | 身份锚点一旦漂移,平台级引用基础失效。 |
| 成员读取与公开摘要 | 正式真相数据 ↔ 快照 / 投影数据 | truth 优先,投影最终一致 | 投影缺失或 stale 时按可见降级返回或显式暴露 stale,不得创建成员 | 查询不写入是硬边界。 |
| 生命周期变化与成员状态 | 正式真相数据 ↔ 正式真相数据 | 本仓 accepted truth 内强一致 | 非法状态、缺原因或缺操作者上下文时拒绝 accepted change | 生命周期是 identity 自身核心状态。 |
| 高风险生命周期与治理依据 | 正式真相数据 ↔ 引用关系数据 | accepted 时依据引用必须成立;外部详情最终一致 | governance 不可用、依据缺失或不匹配时拒绝或待审,不得伪通过 | identity 消费 basis,不拥有 governance truth。 |
| 角色摘要与 method 来源 | 正式真相数据 ↔ 快照 / 投影数据 ↔ 引用关系数据 | identity 摘要采用状态强一致;method 来源同步最终一致 | 来源不可用时保留 stale / pending marker,不得复制 RoleDefinition 正文 | 本仓拥有成员视角摘要,不拥有定义正文。 |
| 能力声明与证据引用 | 正式真相数据 ↔ 引用关系数据 | identity-side 声明 accepted 时必须有来源或证据引用 | 缺证据 / 来源则拒绝或 pending,不得写入无来源声明 | 防止无依据能力画像。 |
| 生涯追加与 work 来源 | 正式真相数据 ↔ 引用关系数据 | 生涯追加在本仓强一致;work 来源跨仓最终一致 | 来源缺失时不追加或进入待对账,不得反写 work truth | 生涯是身份侧历史,不是项目事实。 |
| memory ref 关系与外部承载状态 | 正式真相数据 ↔ 快照 / 投影数据 ↔ 引用关系数据 | ref relation 在本仓强一致;承载状态最终一致 | 外部不可用时标记 pending / unavailable,不得保存正文补齐 | 成员关联关系归 identity,正文归外部承载方。 |
| identity truth 到 trace / audit material | 正式真相数据 ↔ 正式真相数据 / 快照数据 | accepted truth 与自身追溯应保持同一 accepted 边界内一致;视图最终一致 | 不能形成无追溯 accepted truth;视图可重建或标 stale | 追溯是 identity 自身 accountability 边界。 |
| identity truth 到 event / outbox shadow | 正式真相数据 ↔ 快照 / 投影数据 | truth 优先,event shadow 最终一致 | 发布失败只影响传播状态,不得回滚或改写已接受 truth | 事件只传播 accepted fact,不是第二 truth。 |
| identity truth 到 query / consumer projection | 正式真相数据 ↔ 快照 / 投影数据 | 最终一致 / 可重建 | projection stale 时暴露状态、重建或降级,不得写 truth | projection 为消费服务,不是写模型。 |
| 引用状态与对账发现 | 引用关系数据 ↔ 快照 / 投影数据 | 最终一致 / report-only | 只报告漂移、缺失或待处理,不得修复相邻仓 truth | 对账是发现机制,不是跨仓修复器。 |
| forbidden body 与本仓存储 / event / report | 引用关系数据 ↔ 明确不拥有的正文 / 真相 | 边界约束一致 | 发现正文泄漏必须视为边界违规;不能通过降级变成允许 | 正文排除覆盖写入、读取、事件、追溯、报告和诊断。 |

### 7.4 按架构单元组织的数据所有权表

| 架构单元 | 正式真相数据 | 快照 / 投影数据 | 引用关系数据 | 明确不拥有的正文 / 真相 |
|---|---|---|---|---|
| 平台级成员身份真相 | 成员身份主语、稳定 ref、墓碑不复用语义 | 成员公开摘要、可见身份摘要 | actor / trace refs、外部身份来源 ref | 认证账号、credential、token、session、runtime id |
| 成员生命周期边界 | 全局 lifecycle state、变化原因、操作者摘要 | lifecycle summary、可见状态摘要 | governance / authorization basis ref | Gate / Policy / Approval truth、ProjectMember 状态、runtime availability |
| 角色能力摘要 | identity-side role summary、capability declaration、summary adopted state | method source summary、capability source snapshot、stale marker | method source ref、evidence ref、audit ref | RoleDefinition、CapabilityDefinition、method body、能力评估算法、绩效评分 |
| 身份生涯与记忆引用 | career append record、member-memory ref relation、ref change reason | career summary、memory / archive status summary | project ref、ProjectMember ref、memory ref、archive ref、handoff ref | Project、WorkItem、ProjectMember truth、memory body、embedding、archive package |
| 身份事实消费与追溯 | identity own trace / audit material、accepted change accountability | trace view、consumer projection、redacted summary | observability handoff ref、consumer ref | observability log body、conversation message、UI private display state |
| 外部来源引用 | 本仓对外部来源引用的接受状态和来源可用性 marker | source snapshot、source stale / unavailable summary | method / work / governance / memory / archive source refs | 外部来源正文、外部表结构、外部 private id 解析规则 |
| 消费投影与对账 | reconciliation finding owned by identity as report material | projection state、consumer view、report view | external source refs、projection source cursor ref | external truth repair data、下游 consumer 私有状态 |
| 事件协作影子 | 无独立业务 truth;只承接 accepted identity truth 的传播记录 | outbox / event shadow、delivery state、replay view | bus / topic / subscriber refs if formally defined later | event transport ownership、consumer state、bus internal log body |

### 7.5 补偿 / 挂起 / 降级口径

| 场景 | 架构口径 | 不允许的处理 |
|---|---|---|
| 本仓核心 truth 条件不足 | 拒绝 accepted change 或保持未接受状态 | 先写部分 truth,后续再补依据 |
| 高风险 lifecycle 缺治理依据 | 拒绝或待审,保留可追溯原因 | 伪造 basis、默认通过或由后台任务静默执行 |
| 外部 method / work / memory 来源不可用 | 标记 stale / pending / unavailable,后续对账或刷新 | 复制外部正文、字符串猜测来源或改写外部 truth |
| query projection stale | 暴露 stale / degraded 状态或触发重建 | query path 隐式创建或修复 truth |
| event / outbox 传播失败 | 保留传播失败状态,后续由事件协作机制收敛 | 让 event shadow 决定当前 identity truth |
| 对账发现外部漂移 | 生成 report-only finding,由拥有 truth 的仓处理 | 维护任务直接修改 method / work / archive / governance truth |
| 发现 forbidden body | 视为边界违规并阻断进入正式材料 | 通过脱敏不足的摘要继续保存正文 |

### 7.6 数据边界红线

| 红线 | 违反后果 | 来源 |
|---|---|---|
| identity truth 不得复用成员 ref | 破坏平台级身份长期引用 | `BR-ID-001`, `VETO-ID-001` |
| query / projection / report 不得写 identity truth | 读写混层,形成第二写源 | `BR-ID-002`, `BR-ID-013`, `BR-ID-015` |
| ProjectMember / project / task truth 不得入仓 | 打穿 `L1-work` ownership | `BR-ID-006`, `BR-ID-011`, `VETO-ID-003` |
| RoleDefinition / CapabilityDefinition / method body 不得入仓 | 打穿 method-library truth | `BR-ID-007`, `VETO-ID-003` |
| memory / artifact / archive / runtime / conversation 正文不得进入 truth、event、projection、report 或诊断 | 外部正文泄漏,隐私和归属失效 | `BR-ID-012`, `VETO-ID-003`, `AC-ID-012` |
| 高风险 lifecycle 不得缺 basis accepted | 处置绕过治理 / 授权边界 | `BR-ID-005`, `VETO-ID-004` |
| 对账不得修复相邻仓 truth | 后台维护绕过正式能力 | `BR-ID-015`, `VETO-ID-005` |
| 运行期 / event shadow 不得成为 truth source | 事件或 transport 状态反向定义业务事实 | `VETO-ID-006`, Step 7 |

### 7.7 数据所有权关系图

```text
+------------------------------------------------------------------+
|                         L1-identity data boundary                |
|                                                                  |
|  +---------------------------+                                   |
|  | 正式真相数据              |                                   |
|  | member / lifecycle /      |                                   |
|  | identity-side summary /   |                                   |
|  | career / memory relation  |                                   |
|  +-------------+-------------+                                   |
|                |                                                 |
|                | 派生 / 可重建 / 可裁剪                           |
|                v                                                 |
|  +---------------------------+        +------------------------+  |
|  | 快照 / 投影 / report      |<------>| 引用关系数据           |  |
|  | public summary / view /   |        | method/work/governance |  |
|  | projection / finding      |        | memory/archive refs    |  |
|  +-------------+-------------+        +-----------+------------+  |
|                |                                  |               |
|                | 只能指向,不得吸收正文             | 只能指向       |
|                v                                  v               |
|  +------------------------------------------------------------+  |
|  | 明确不拥有的正文 / 真相                                    |  |
|  | ProjectMember / RoleDefinition / memory body / runtime body |  |
|  +------------------------------------------------------------+  |
|                                                                  |
+------------------------------------------------------------------+
```

图示说明:

- 正式真相数据是 identity 的唯一写入核心;快照 / 投影 / report 只能派生或重建。
- 引用关系数据可以指向外部对象或外部正文,但不能把外部正文复制成本仓 truth。
- 明确不拥有的正文 / 真相不得进入本仓 truth、projection、event、report 或诊断正文。
- 图中箭头只表示数据归属关系,不表示同步流程、事务机制、事件顺序或实现依赖。

### 7.8 数据所有权停审记录

| 架构单元 | truth 唯一性 | projection / report 禁止反写 | external body 禁止保存 | 一致性口径是否清楚 | 结论 |
|---|---|---|---|---|---|
| 平台级成员身份真相 | 是 | 是 | 是 | 是 | 已通过 |
| 成员生命周期边界 | 是 | 是 | 是 | 是 | 已通过 |
| 角色能力摘要 | 是 | 是 | 是 | 是 | 已通过 |
| 身份生涯与记忆引用 | 是 | 是 | 是 | 是 | 已通过 |
| 身份事实消费与追溯 | 是 | 是 | 是 | 是 | 已通过 |
| 外部来源引用 | 是 | 是 | 是 | 是 | 已通过 |
| 消费投影与对账 | 是 | 是 | 是 | 是 | 已通过 |
| 事件协作影子 | 是 | 是 | 是 | 是 | 已通过 |

### 7.9 跨数据边界审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在双 truth | 未发现 | 外部来源均以 ref、snapshot、summary、marker 或 basis 进入。 |
| 是否存在 projection / report 反写 truth | 未允许 | projection 可重建;query 不写;reconciliation report-only。 |
| 是否存在引用正文入仓 | 未允许 | forbidden body 覆盖存储、事件、报告、追溯和诊断正文。 |
| 是否存在强一致误用 | 未发现 | 跨仓来源采用引用有效性、最终一致、pending / stale / unavailable 或 report-only。 |
| 是否存在最终一致误用 | 未发现 | 本仓核心 truth accepted path 内部仍要求强一致,不能用最终一致掩盖部分写入。 |
| 是否存在失败补偿口径冲突 | 未发现 | 拒绝、待审、pending、stale、unavailable、degraded、report-only 已区分。 |
| 是否存在能力画像摘要 ownership 歧义 | 已处理 | 拆分 identity-side 声明 / 采用状态、外部来源摘要和证据引用。 |
| 是否存在 unresolved 数据归属冲突 | 未发现 | memory / archive 承载方和具体状态枚举仍为后续 surface 待确认,不影响 ref-only 边界。 |

---

## 8. 回填草稿

````md
## 9. 数据所有权与一致性策略

> 校准来源:
> - `design-calibration/01_arch_step_08_data_ownership_consistency.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“数据归属表”“一致性策略表”“按架构单元组织的数据所有权表”和“跨数据边界审计表”小节,了解本章如何从职责边界、子域划分和依赖裁剪收束数据 ownership。

`L1-identity` 的数据所有权以平台级成员身份真相为核心。它拥有成员身份主语、稳定身份 ref、全局生命周期、身份侧角色 / 能力摘要采用状态、身份侧能力声明、成员生涯追加记录、成员与 memory / archive refs 的身份侧关系以及自身变化追溯;它只以快照、投影、引用或 report-only 方式承接 method、work、governance、memory / archive、runtime、observability 和下游消费边界。

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| 平台级成员身份主语 | 正式真相数据 | `L1-identity` 拥有平台级 AI 员工身份本体。 | 不等同认证账号、ProjectMember、runtime instance 或 UI profile。 |
| 成员身份稳定 ref / tombstone 语义 | 正式真相数据 | 本仓拥有 ref 稳定、不复用和墓碑化后仍可追溯的语义。 | 外部系统只能引用,不得重分配或复用。 |
| 全局生命周期状态 | 正式真相数据 | 本仓拥有成员作为平台身份是否可用、暂停、退役或墓碑化的状态边界。 | 不等同项目内状态、任务状态或 runtime 可用性。 |
| 身份侧角色 / 能力摘要采用状态 | 正式真相数据 | 本仓拥有成员视角的角色、职业和能力摘要采用关系。 | method 定义正文、能力评估算法和绩效评分不归 identity。 |
| method / role source summary | 快照 / 投影数据 | 本仓可保存用于解释身份摘要的来源摘要、版本或失效状态。 | 来源摘要可 stale / refresh,不替代 method-library truth。 |
| 身份侧生涯记录 | 正式真相数据 | 本仓拥有成员生涯中的身份侧追加历史。 | 生涯记录引用项目事实,但不定义 Project、WorkItem 或 ProjectMember truth。 |
| 成员与 memory / archive refs 的关系 | 正式真相数据 | 本仓拥有成员关联外部 memory / archive ref 的身份侧关系。 | 不拥有 memory 原文、embedding、检索索引或 archive package。 |
| 成员公开摘要 / 可见消费摘要 | 快照 / 投影数据 | 本仓可提供可裁剪、可重建、可降级的成员消费摘要。 | 摘要不得绕过 visibility / privacy,也不得反向写 truth。 |
| 高风险处置依据引用 | 引用关系数据 | 本仓只保存 governance / authorization basis ref 或 safe basis summary。 | Gate、Policy、Approval、Control truth 不归 identity。 |
| 项目 / ProjectMember / work 来源引用 | 引用关系数据 | 本仓保存 work 来源 ref、来源摘要或状态 marker。 | 项目事实、任务事实和 ProjectMember truth 归 `L1-work`。 |
| 引用 / 投影对账发现 | 快照 / 投影数据 | 本仓可记录 identity 自身引用、投影或消费边界的漂移发现。 | 对账发现是 report-only,不得修改相邻仓 truth。 |
| 外部正文与外部主真相 | 明确不拥有的正文 / 真相 | method body、work truth、governance truth、memory body、runtime body、credential、UI 私有状态等不归 identity。 | 不得进入本仓 truth、projection、event、report 或诊断正文。 |

### 9.1 一致性策略

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 成员身份建档与稳定 ref 建立 | 正式真相数据 ↔ 正式真相数据 | 本仓 accepted truth 内强一致 | 条件不满足则不建立身份,不得部分生成可复用 ref | 身份锚点一旦漂移,平台级引用基础失效。 |
| 生命周期变化与成员状态 | 正式真相数据 ↔ 正式真相数据 | 本仓 accepted truth 内强一致 | 非法状态、缺原因或缺操作者上下文时拒绝 accepted change | 生命周期是 identity 自身核心状态。 |
| 高风险生命周期与治理依据 | 正式真相数据 ↔ 引用关系数据 | accepted 时依据引用必须成立;外部详情最终一致 | governance 不可用、依据缺失或不匹配时拒绝或待审,不得伪通过 | identity 消费 basis,不拥有 governance truth。 |
| 角色摘要与 method 来源 | 正式真相数据 ↔ 快照 / 投影数据 ↔ 引用关系数据 | identity 摘要采用状态强一致;method 来源同步最终一致 | 来源不可用时保留 stale / pending marker,不得复制 RoleDefinition 正文 | 本仓拥有成员视角摘要,不拥有定义正文。 |
| 生涯追加与 work 来源 | 正式真相数据 ↔ 引用关系数据 | 生涯追加在本仓强一致;work 来源跨仓最终一致 | 来源缺失时不追加或进入待对账,不得反写 work truth | 生涯是身份侧历史,不是项目事实。 |
| memory ref 关系与外部承载状态 | 正式真相数据 ↔ 快照 / 投影数据 ↔ 引用关系数据 | ref relation 在本仓强一致;承载状态最终一致 | 外部不可用时标记 pending / unavailable,不得保存正文补齐 | 成员关联关系归 identity,正文归外部承载方。 |
| identity truth 到 query / consumer projection | 正式真相数据 ↔ 快照 / 投影数据 | 最终一致 / 可重建 | projection stale 时暴露状态、重建或降级,不得写 truth | projection 为消费服务,不是写模型。 |
| 引用状态与对账发现 | 引用关系数据 ↔ 快照 / 投影数据 | 最终一致 / report-only | 只报告漂移、缺失或待处理,不得修复相邻仓 truth | 对账是发现机制,不是跨仓修复器。 |
| forbidden body 与本仓存储 / event / report | 引用关系数据 ↔ 明确不拥有的正文 / 真相 | 边界约束一致 | 发现正文泄漏必须视为边界违规;不能通过降级变成允许 | 正文排除覆盖写入、读取、事件、追溯、报告和诊断。 |

### 9.2 数据边界图

```text
+------------------------------------------------------------------+
|                         L1-identity data boundary                |
|                                                                  |
|  +---------------------------+                                   |
|  | 正式真相数据              |                                   |
|  | member / lifecycle /      |                                   |
|  | identity-side summary /   |                                   |
|  | career / memory relation  |                                   |
|  +-------------+-------------+                                   |
|                |                                                 |
|                | 派生 / 可重建 / 可裁剪                           |
|                v                                                 |
|  +---------------------------+        +------------------------+  |
|  | 快照 / 投影 / report      |<------>| 引用关系数据           |  |
|  | public summary / view /   |        | method/work/governance |  |
|  | projection / finding      |        | memory/archive refs    |  |
|  +-------------+-------------+        +-----------+------------+  |
|                |                                  |               |
|                | 只能指向,不得吸收正文             | 只能指向       |
|                v                                  v               |
|  +------------------------------------------------------------+  |
|  | 明确不拥有的正文 / 真相                                    |  |
|  | ProjectMember / RoleDefinition / memory body / runtime body |  |
|  +------------------------------------------------------------+  |
|                                                                  |
+------------------------------------------------------------------+
```

正式真相数据是 identity 的唯一写入核心;快照 / 投影 / report 只能派生、重建、裁剪或标脏。引用关系数据可以指向外部对象或外部正文,但不能把外部正文复制成本仓 truth。明确不拥有的正文 / 真相不得进入本仓 truth、projection、event、report 或诊断正文。
````

---

## 9. 待确认事项

本步不新增阻塞性待确认事项。需求层已登记的 `OQ-ID-001`~`OQ-ID-006` 继续有效。

| 待确认项 | 本步处理 |
|---|---|
| `OQ-ID-001` method-library 到 identity 的角色 / 能力来源方式 | 本步只确认 method source ref / summary 的 ownership 与最终一致口径,具体 resolver / event 协议后移 Step 9 / `03`。 |
| `OQ-ID-002` 高风险 lifecycle 动作枚举 | 本步只确认高风险 lifecycle 需要 basis ref 且 accepted 时不能缺依据,具体动作枚举后移 `03/06`。 |
| `OQ-ID-003` memory refs 的正式承载方和迁移结果 surface | 本步只确认 ref relation 归 identity、正文归外部承载方,具体状态枚举和 handoff surface 后移 Step 9 / `03`。 |
| `OQ-ID-004` 成员摘要 visibility / privacy 字段级裁剪 | 本步只确认摘要是 projection / snapshot 且不得泄漏正文,字段级 visibility 后移 Step 12 / `03`。 |
| `OQ-ID-005` P0 performance / availability 阈值 | 本步不设置性能或可用性阈值;后移 `05/06`。 |
| `OQ-ID-006` 既有 `04` 是否保留或重写 | 本步不引用既有 `04`;配置数据 ownership 后续随新版 `04` 复核。 |

---

## 10. 进入下一步条件

Step 8 已完成。进入 Step 9 前必须满足:

- 用户已通过“同意”确认本步数据所有权与一致性策略。
- `01_architecture_calibration_flow.md` 中 Step 8 状态已更新为 `已完成`。
- Step 9 只能承接本步 ownership 和一致性口径去讨论交互方式,不得用交互便利反向改变数据归属。
- 若审核发现双 truth、projection / report 反写、引用正文入仓、强一致 / 最终一致误用或失败挂起口径冲突,必须先回到本 Step 修正,不能带着冲突进入 Step 9。
