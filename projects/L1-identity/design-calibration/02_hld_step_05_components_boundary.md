# Step 5. 主要组成部分、职责与边界

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 5
> 回填章节: `02-概要设计.md` §5 主要组成部分、职责与边界
> 生成日期: 2026-06-11
> 状态: 已完成,等待用户审核

---

## 1. Step 状态 + Step 内计划

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取 Step 4 代码主体框架、Step 3 约束、`00` 核心能力 / 功能需求、`01` 职责 / 数据 / 交互边界 | 已完成 | §2 |
| 回答 Step 5 SOP 问题 | 已完成 | §3 |
| 诊断旧 Step 5 与当前材料的差距 | 已完成 | §4 |
| 比较改动前后口径 | 已完成 | §5 |
| 记录采用 / 不采用的设计取舍 | 已完成 | §6 |
| 输出组成部分总表、对象发现维度表和各部分交互总图 | 已完成 | §7.1~§7.3 |
| 按主要组成部分逐个小循环展开职责、capability、代码主体、对象发现、接缝和停审 | 已完成 | §7.4~§7.11 |
| 完成 Step 6 展开门禁和跨组成部分闭环审计 | 已完成 | §7.12~§7.13 |
| 判断本 Step 是否需要拆分 | 已完成 | §8 |
| 形成正式 `02` §5 回填草稿 | 已完成 | §9 |
| 列出待确认事项和进入下一步条件 | 已完成 | §10~§11 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `02_hld_step_04_code_subject_framework.md` | 已完成并已获用户认可 | 提供业务结构轴、实现分层轴和代码主体骨架 |
| `02_hld_step_03_constraints.md` | 已完成并已获用户认可 | 提供 truth center、query no-write、forbidden body、report-only、依赖裁剪等门禁 |
| `02_hld_step_02_goals_scope.md` | 已完成并已获用户认可 | 提供本轮概要范围和深度口径 |
| `projects/L1-identity/00-需求文档.md` §7 / §9 / §10 / §11 / §14 / §15 | 当前需求输入 | 提供核心能力、功能需求、业务规则、数据归属、VETO 和待确认事项 |
| `projects/L1-identity/01-架构设计.md` §4 / §6 / §9 / §10 / §11 / §13 | 当前架构输入 | 提供职责边界、语义结构、数据 ownership、交互方式、技术机制和横切关注点 |
| `standards/document/概要设计讨论流程_SOP.md` | 最新流程标准 | 规定本 Step 必须按主要组成部分小循环展开并形成对象候选池 |
| `standards/document/概要设计书写规范.md` | 最新正式结构标准 | 规定第 5 章输出格式和 ASCII 图格式 |
| 旧 `02_hld_step_05_components_boundary.md` | legacy draft | 只作为诊断输入,不得直接继承为新版结论 |

---

## 3. SOP 问题回答

### 3.1 当前概要设计层面,本仓应被划分为哪些主要组成部分?

本轮 `L1-identity` 的概要主要组成部分收敛为 8 个业务结构主语:

1. 身份锚定与成员真相。
2. 全局生命周期。
3. 角色能力摘要。
4. 身份生涯记录。
5. 记忆引用关系。
6. 身份事实消费与追溯。
7. 派生维护与对账。
8. 身份事实传播与外部交接。

这些名称是概要层业务主语,不是代码目录、crate、class、handler、repository 或外部系统名。它们共同围绕平台级成员身份主语展开,并承接 `C-ID-1`~`C-ID-5`。

### 3.2 每个主要组成部分分别承担什么职责?

- 身份锚定与成员真相负责建立、保护和读取平台级成员身份主语。
- 全局生命周期负责成员全局可用性状态和高风险处置依据接缝。
- 角色能力摘要负责 identity-side role / capability summary、来源引用和证据引用。
- 身份生涯记录负责将可信项目参与来源追加为身份侧生涯历史。
- 记忆引用关系负责成员与 memory / archive refs 的关系、状态和迁移 / 冷存接缝。
- 身份事实消费与追溯负责可见摘要、追溯读取、trace / audit / history 和消费投影。
- 派生维护与对账负责 projection rebuild、reference refresh、漂移发现和 report-only finding。
- 身份事实传播与外部交接负责 accepted identity fact 的 outbox、event propagation、trace / archive handoff。

### 3.3 每个主要组成部分明确不承担什么职责?

本仓各组成部分共同不承担认证、账号、credential、token、session、ProjectMember truth、RoleDefinition / CapabilityDefinition body、work task truth、memory body、embedding、archive package、runtime execution body、Gate / Policy / Approval / Control truth、UI 私有展示状态、observability body 和跨仓自动修复。

每个组成部分还必须在自身小节列出更细非职责,避免后续设计把外部 truth、外部正文、实现分层或详细设计 schema 混入概要。

### 3.4 每个主要组成部分需要完成哪些功能 / capability?

本 Step 将 capability 绑定到组成部分小节中逐个列出。总体对应关系是:

- `C-ID-1`:身份锚定与成员真相。
- `C-ID-2`:全局生命周期。
- `C-ID-3`:角色能力摘要。
- `C-ID-4`:身份生涯记录、记忆引用关系。
- `C-ID-5`:身份事实消费与追溯、派生维护与对账、身份事实传播与外部交接。

### 3.5 每个功能需要哪些输入、输出、状态影响、外部协作或后续 Step 承接?

每个主要组成部分的小节都用 `功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开` 表单独记录。当前只写概要骨架,不写 DTO schema、字段全集、函数调用链或事务顺序。

### 3.6 每个主要组成部分包含哪些代码主体 / 模块?

每个主要组成部分的小节都列出代码主体 / 模块,并标注类型、作用和后续展开位置。这里的代码主体 / 模块是概要主语,不等于代码目录、文件路径或最终 Rust type。

### 3.7 这些代码主体 / 模块在本部分中只需要说明到什么粒度?

只说明名称、类型、作用和后续展开位置。对象字段、成员函数、工厂函数留给 Step 6;接口契约、port / repository 签名和 DTO schema 留给 Step 7 / `03`;处理流留给 Step 8;状态矩阵留给 Step 9 / `03`。

### 3.8 哪些内容虽然相关,但必须由相邻部分或边界外能力承担?

相关但边界外的内容包括:

- 认证、账号、credential、token、session:认证 / gateway / 安全入口。
- ProjectMember、Project、WorkItem、项目参与 truth:`L1-work`。
- RoleDefinition、CapabilityDefinition、method body:`L3-method-library`。
- Gate、Policy、Approval、Control truth:`L1-governance`。
- memory body、embedding、archive package:memory / archive 承载边界。
- runtime execution body、conversation body、artifact body、observability body:对应拥有仓或外部承载方。

### 3.9 哪些职责如果不写清,后续最容易让概要设计滑进实现层或让不同部分串线?

最危险的串线点是:

- 把 `身份事实消费与追溯` 写成 query 修复 truth。
- 把 `派生维护与对账` 写成跨仓 repair。
- 把 `身份事实传播与外部交接` 写成 command accepted 的同步 fan-out。
- 把 `角色能力摘要` 写成 method-library 定义正文复制。
- 把 `记忆引用关系` 写成 memory / archive 正文存储。
- 把 `全局生命周期` 写成 runtime availability 或 ProjectMember 状态。
- 把 `身份锚定与成员真相` 写成账号 / actor / credential。

### 3.10 每个主要组成部分分别包含哪些对象发现线索?

每个主要组成部分小节均按 truth / state、policy / invariant、projection / read model、reference / boundary、audit / history 维度列出对象候选。候选对象只是 Step 6 的对象候选池,不是最终对象定义。

### 3.11 这些线索分别属于 truth / state / policy / projection / reference / audit / history 哪个维度?

本 Step 在对象发现维度表中统一分列。维度不适用时写 `-`,不省略判断。所有 `Step 6 必须独立展开` 的候选都应在 Step 6 独立成节或被明确筛除。

### 3.12 哪些候选对象必须进入 Step 6 独立成节展开?

必须进入 Step 6 候选池的对象包括但不限于:

- `GlobalMember`
- `IdentityAnchorPolicy`
- `GlobalLifecycleState`
- `LifecycleTransitionPolicy`
- `RoleCapabilitySummary`
- `RoleCapabilitySourceSnapshot`
- `CareerRecord`
- `CareerAppendPolicy`
- `MemoryReference`
- `MemoryReferenceState`
- `MemberSummaryView`
- `IdentityTraceRecord`
- `ProjectionState`
- `ReferenceResolutionState`
- `ReconciliationReport`
- `IdentityOutboxRecord`
- `TraceHandoffIntent`

Step 6 可根据对象正式化标准筛除或合并,但必须说明原因。

### 3.13 哪些名称只是 API / repository / port / trigger / DTO / 字段类型,不应在 Step 6 被误写成领域对象?

以下名称当前不是 Step 6 领域对象默认候选:

- command / query / event intake。
- repository、port、resolver、publisher、handoff adapter。
- DTO、request、response、event payload、job receipt。
- database table、HTTP request body、topic key、queue name。
- external SDK raw response、observability raw record。

若后续要把其中某项作为对象展开,必须在 Step 6 说明它为什么是概要关键对象,而不是接口或实现细节。

### 3.14 当前组成部分完成后,功能、候选对象、接缝和禁止事项是否通过停审?

每个组成部分小节末尾均有停审记录。当前 8 个主要组成部分均通过本 Step 级停审,但 Step 6 仍需对对象候选正式化。

### 3.15 所有组成部分完成后,是否存在重复对象、职责重叠、候选对象遗漏或后续展开位置冲突?

本 Step 末尾已形成跨组成部分闭环审计表。当前未发现 unresolved 冲突。仍需在 Step 6 对对象候选池做正式筛选,在 Step 7~9 反查接口、处理流和状态是否引用了未定义主语。

---

## 4. 当前材料 / 旧文档问题诊断

| 旧材料 / 倾向 | 问题 | 本轮处理 |
|---|---|---|
| 旧 Step 5 只有总表和少量审计 | 不符合最新版 SOP 对每个组成部分独立小节、capability、代码主体、对象发现线索和停审记录的要求 | 本轮按 8 个组成部分逐个展开 |
| 旧 Step 5 将事件传播与 handoff 表达得偏技术 | 容易被误判为实现分层而非业务传播 / 交接能力 | 本轮改称“身份事实传播与外部交接”,明确只传播 accepted fact |
| 旧 Step 5 将生涯记录和记忆引用拆开但边界说明不足 | memory body / archive package 和 career / work truth 容易串线 | 本轮分别列非职责和接缝 |
| 旧 Step 5 对对象候选池只给全局表 | Step 6 无法判断每个对象候选来自哪个 capability | 本轮每个组成部分都先列 capability,再列对象发现线索 |
| 旧 Step 5 没有明确 API / repository / port / DTO 不默认进入 Step 6 对象 | 后续容易把接口或实现细节当领域对象 | 本轮单独列出不应误写成领域对象的名称 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 组成部分展开方式 | 总表式 | 每个主要组成部分独立小节 |
| capability 记录 | 总体简表 | 每个组成部分先 capability,再对象发现 |
| 对象候选池 | 全局候选表 | 全局维度表 + 每部分对象发现线索 |
| 停审记录 | 总体通过 | 每部分停审 + 跨部分闭环审计 |
| Step 6 承接 | 候选对象来源不够清晰 | 明确 Step 6 必须独立展开候选和不应升级为对象的名称 |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 沿用旧 8 个组成部分但只补几行说明 | 不采用 | 无法满足最新版 Step 5 小循环和停审要求 |
| 将生涯记录与记忆引用合并为一个组成部分 | 不采用 | 两者都属于 `C-ID-4`,但 career 是 append-only 身份历史,memory 是 reference-only 外部正文边界,对象发现维度不同 |
| 将派生维护、对账、传播、handoff 合并到消费追溯 | 不采用 | 会混淆 query / projection、report-only maintenance 和 accepted fact propagation |
| 将 Inbound / Application / Domain / Ports 作为主要组成部分 | 不采用 | 这些是实现分层,不是业务结构主语 |
| 按 `C-ID-1`~`C-ID-5` 推导主要组成部分,再拆出维护 / 传播接缝 | 采用 | 能承接需求闭环,又能保护 Step 3 的 query no-write、report-only 和 eventual propagation 约束 |

---

## 7. 结构化中间产物

### 7.1 组成部分总表

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| 身份锚定与成员真相 | 建立和保护平台级成员身份主语、稳定 identity ref 和 tombstone 语义 | Identity Command / Query Service、Member Identity Domain Model、Identity Repository Boundary、Identity Anchor Policy | 不做认证、账号、session、credential、ProjectMember、runtime identity |
| 全局生命周期 | 管理成员全局可用性状态、生命周期变化原因和高风险处置 basis 接缝 | Lifecycle Application Service、Lifecycle State / Transition Guard、Governance Basis Resolver Port、Lifecycle Trace Boundary | 不做 runtime availability、任务状态、项目内状态、治理裁决 truth |
| 角色能力摘要 | 管理 identity-side role / capability summary、来源引用、证据引用和来源状态 | Role Capability Application Service、Role Capability Summary、Method Source Resolver、Role Capability Source Snapshot | 不保存 RoleDefinition / CapabilityDefinition body、method body、自动评估算法正文 |
| 身份生涯记录 | 将可信项目参与来源追加为身份侧 career history | Career Memory Application Service、Career Record、Career Append Policy、Work Participation Source Boundary | 不拥有 Project、WorkItem、ProjectMember truth,不改写历史 |
| 记忆引用关系 | 管理成员与 memory / archive refs 的关系、状态和迁移 / 冷存接缝 | Memory Reference Service、Memory Reference Domain Model、Memory Archive Handoff Boundary、Reference State | 不保存 memory body、embedding、index、archive package |
| 身份事实消费与追溯 | 提供可见身份摘要、追溯读取、trace / audit / history 和消费投影 | Consumption Query Service、Member Summary View、Identity Trace Record、Visibility Boundary、Projection Store Boundary | 不反写 truth,不绕过 visibility,不输出外部正文 |
| 派生维护与对账 | 重建投影、刷新引用状态、发现漂移并形成 report-only finding | Maintenance Service、Projection Rebuild Job、Reference Refresh Job、Reconciliation Report Store | 不修复相邻仓 truth,不静默改变 identity truth |
| 身份事实传播与外部交接 | 将 accepted identity fact 发布给下游,并对 trace / archive / observability 做安全交接 | Outbox Publisher、Identity Outbox Record、Event Envelope Boundary、Trace Handoff Intent、Handoff Port | 不重算 truth,不把发布成功作为 accepted 前置,不伪造 handoff 成功 |

#### 各部分交互总图

```text
外部管理入口 / 来源事件 / 消费查询 / 运维任务
│
▼
身份锚定与成员真相
├─ 全局生命周期
├─ 角色能力摘要
├─ 身份生涯记录
├─ 记忆引用关系
└─ 身份事实消费与追溯
   ├─ 派生维护与对账
   └─ 身份事实传播与外部交接
```

关键说明:
- 该图表达主要组成部分之间的大体依附和交接关系,不是接口调用时序。
- 身份锚定与成员真相是中心主语;生命周期、角色能力、生涯和记忆都依附成员身份成立。
- 消费追溯读取和传播 accepted fact,但不得成为第二 truth 写源。
- 派生维护与对账只做可重建派生和 report-only finding,不修复相邻仓 truth。

### 7.2 对象发现维度表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| 身份锚定与成员真相 | `GlobalMember`, `IdentityAnchorState` | `IdentityAnchorPolicy` | `MemberAnchorView` | `ActorRef`, `IdentitySourceRef` | `IdentityTraceRecord` | `GlobalMember`, `IdentityAnchorPolicy` |
| 全局生命周期 | `GlobalLifecycleState` | `LifecycleTransitionPolicy`, `HighRiskLifecycleGuard` | `LifecycleSummaryView` | `GovernanceBasisRef` | `LifecycleTraceRecord` | `GlobalLifecycleState`, `LifecycleTransitionPolicy` |
| 角色能力摘要 | `RoleCapabilitySummary`, `RoleCapabilitySourceState` | `RoleCapabilitySourcePolicy` | `RoleCapabilityView` | `RoleSourceRef`, `CapabilityEvidenceRef` | `RoleCapabilityTraceRecord` | `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot` |
| 身份生涯记录 | `CareerRecord` | `CareerAppendPolicy` | `CareerSummaryView` | `ProjectParticipationRef`, `WorkSourceRef` | `CareerTraceRecord` | `CareerRecord`, `CareerAppendPolicy` |
| 记忆引用关系 | `MemoryReference`, `MemoryReferenceState` | `MemoryReferencePolicy` | `MemoryReferenceView` | `MemoryRef`, `ArchiveRef`, `ArchiveHandoffRef` | `MemoryReferenceTraceRecord` | `MemoryReference`, `MemoryReferenceState` |
| 身份事实消费与追溯 | `IdentityTraceRecord`, `AuditTrail` | `VisibilityPolicy` | `MemberSummaryView`, `IdentityTraceView` | `ConsumerRef`, `VisibilityContextRef` | `AuditEntry`, `HistoryRecord` | `MemberSummaryView`, `IdentityTraceRecord`, `VisibilityPolicy` |
| 派生维护与对账 | `ProjectionState`, `ReferenceResolutionState` | `ReconciliationPolicy` | `ReconciliationReport` | `ExternalReferenceRef`, `MaintenanceScopeRef` | `MaintenanceTraceRecord` | `ProjectionState`, `ReferenceResolutionState`, `ReconciliationReport` |
| 身份事实传播与外部交接 | `OutboxState`, `HandoffState` | `OutboundEventPolicy`, `HandoffPolicy` | `OutboxPendingView` | `TopicKey`, `HandoffTargetRef` | `HandoffTraceRecord` | `IdentityOutboxRecord`, `TraceHandoffIntent` |

### 7.3 组成部分小循环

### 7.4 身份锚定与成员真相

#### 7.4.1 本部分职责

身份锚定与成员真相负责建立平台级 AI 员工身份主语,保护 identity ref 稳定性和不可复用语义,并为其他组成部分提供成员身份存在性和基础摘要的中心主语。

#### 7.4.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 建立成员身份主语 | 管理意图、操作者上下文、身份来源引用 | 稳定成员 identity ref、建档结果 | 创建 identity truth、记录创建追溯、准备 outbox material | Step 6 / Step 7 / Step 8 / Step 9 |
| 读取基础身份锚点 | 成员 identity ref、读取上下文 | 基础身份摘要或 not found / not visible / stale | 不写 truth,可读取 projection 或 truth 摘要 | Step 7 / Step 8 |
| 防止 identity ref 复用 | 创建、退役、墓碑化、重复来源处理 | 接受、拒绝或 duplicate result | 保留 tombstone / retired 后不可复用语义 | Step 6 / Step 9 / Step 10 |

#### 7.4.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| Identity Command / Query Service | Application Service | 编排建档、读取锚点、防复用和结果返回 | Step 7 / Step 8 |
| Member Identity Domain Model | Domain Model | 承载成员身份主语、稳定 ref 和基础不变量 | Step 6 |
| Identity Repository Boundary | Persistence Boundary | 保存和读取 identity truth | Step 7 / `03` |
| Identity Anchor Policy | Policy / Invariant | 判断创建、复用、tombstone 等锚定规则 | Step 6 |

#### 7.4.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `GlobalMember`, `IdentityAnchorState` | `GlobalMember` 独立成节;`IdentityAnchorState` 是否独立由 Step 6 判断 |
| Policy / Invariant | `IdentityAnchorPolicy` | 独立成节 |
| Projection / Read model | `MemberAnchorView` | 可能并入 `MemberSummaryView`,Step 6 说明 |
| Reference / Boundary | `IdentitySourceRef`, `ActorRef` | 作为字段类型 / 边界 ref,默认不独立成节 |
| Audit / History | `IdentityTraceRecord` | 可在 trace / history 对象组中独立成节 |

#### 7.4.5 本部分不承担什么

- 不承担认证、登录、账号绑定、credential、token、session。
- 不承担 ProjectMember、项目分配、任务执行者或 runtime instance 的 truth。
- 不通过 query、projection 或 maintenance 自动创建成员。

#### 7.4.6 与其他部分的接缝

- 向全局生命周期、角色能力摘要、生涯、记忆引用提供稳定成员主语。
- 向消费追溯提供基础身份摘要和 visibility 判断输入。
- 向事件传播提供 accepted identity creation material。

#### 7.4.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | 通过 | 建档、读取锚点、防复用已覆盖 |
| 候选对象是否有功能来源 | 通过 | `GlobalMember` 和 `IdentityAnchorPolicy` 均来自 `C-ID-1` |
| 接缝是否清楚 | 通过 | 只输出成员主语和 accepted fact material |
| 禁止事项是否清楚 | 通过 | 已排除账号、ProjectMember、runtime |
| 是否越界 | 通过 | 未引入外部 truth 或实现细节 |

### 7.5 全局生命周期

#### 7.5.1 本部分职责

全局生命周期负责表达成员在平台范围内是否可用、暂停、退役或墓碑化,并为高风险生命周期处置保留正式 basis 接缝和追溯线索。

#### 7.5.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 调整全局生命周期 | 生命周期变更意图、actor、reason | lifecycle command result | 更新生命周期状态、记录 trace / audit、准备 outbox | Step 6 / Step 8 / Step 9 |
| 校验高风险处置依据 | 高风险动作、governance basis ref / summary | 接受、拒绝或 pending basis | 不拥有治理 truth,只保存依据引用和判断结果 | Step 7 / Step 8 / Step 10 / `03` |
| 读取生命周期摘要 | member ref、visibility context | 可见生命周期摘要或 degraded / not visible | 不写 truth | Step 7 / Step 8 |

#### 7.5.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| Lifecycle Application Service | Application Service | 编排生命周期命令、basis 校验和结果保存 | Step 7 / Step 8 |
| Lifecycle State / Transition Guard | Domain Model / Policy | 承载生命周期状态和允许迁移规则 | Step 6 / Step 9 |
| Governance Basis Resolver Port | Boundary Port | 解析或校验高风险处置依据引用 | Step 7 / `03` |
| Lifecycle Trace Boundary | Audit / History Boundary | 记录生命周期变化原因和可见追溯 | Step 6 / Step 8 |

#### 7.5.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `GlobalLifecycleState` | 独立成节 |
| Policy / Invariant | `LifecycleTransitionPolicy`, `HighRiskLifecycleGuard` | 至少 `LifecycleTransitionPolicy` 独立成节 |
| Projection / Read model | `LifecycleSummaryView` | 可能并入 `MemberSummaryView`,Step 6 说明 |
| Reference / Boundary | `GovernanceBasisRef` | 边界 ref,默认不独立成节 |
| Audit / History | `LifecycleTraceRecord` | 可并入 `IdentityTraceRecord` 对象组 |

#### 7.5.5 本部分不承担什么

- 不承担 runtime availability、container health、任务状态。
- 不承担 ProjectMember 状态或项目内分配状态。
- 不拥有 Gate、Policy、Approval、Control truth。
- 不允许后台维护任务静默执行高风险处置。

#### 7.5.6 与其他部分的接缝

- 依赖身份锚定提供成员主语。
- 通过 governance basis boundary 消费高风险依据。
- 向消费追溯和事件传播输出生命周期 accepted fact。

#### 7.5.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | 通过 | 生命周期调整、basis 校验、读取摘要已覆盖 |
| 候选对象是否有功能来源 | 通过 | 来自 `FR-ID-004`~`FR-ID-005` |
| 接缝是否清楚 | 通过 | governance 只作为 basis 来源 |
| 禁止事项是否清楚 | 通过 | 已排除 runtime / ProjectMember / governance truth |
| 是否越界 | 通过 | 未定义 basis schema,后移 `03` |

### 7.6 角色能力摘要

#### 7.6.1 本部分职责

角色能力摘要负责维护成员身份侧职业、角色、能力摘要和证据引用,并在 role / capability 来源变化时更新、失效或标记待对账。

#### 7.6.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 维护角色摘要 | member ref、role source ref、reason | role summary result | 更新身份侧摘要和来源状态 | Step 6 / Step 8 |
| 维护能力摘要 | member ref、capability source / evidence ref | capability summary result | 更新能力声明摘要、记录证据引用 | Step 6 / Step 8 |
| 响应来源变化 | method source change、source version marker | summary refreshed / stale / unavailable | 更新 source state、准备 trace / outbox | Step 7 / Step 8 / Step 9 |

#### 7.6.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| Role Capability Application Service | Application Service | 编排摘要维护和来源变化处理 | Step 7 / Step 8 |
| Role Capability Summary | Domain Model / Snapshot | 承载 identity-side role / capability safe summary | Step 6 |
| Method Source Resolver | Boundary Port | 读取或接收 method-library 来源摘要 / marker | Step 7 / `03` |
| Role Capability Source Snapshot | Reference / Snapshot | 表达来源状态、版本和 stale / unavailable 轮廓 | Step 6 |

#### 7.6.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `RoleCapabilitySummary`, `RoleCapabilitySourceState` | `RoleCapabilitySummary` 独立成节 |
| Policy / Invariant | `RoleCapabilitySourcePolicy` | 可独立成节或并入 summary policy |
| Projection / Read model | `RoleCapabilityView` | 可能并入 `MemberSummaryView` |
| Reference / Boundary | `RoleSourceRef`, `CapabilityEvidenceRef` | 作为 ref / 字段类型,默认不独立成节 |
| Audit / History | `RoleCapabilityTraceRecord` | 可并入 trace / history 对象组 |
| Reference / Snapshot | `RoleCapabilitySourceSnapshot` | 独立成节 |

#### 7.6.5 本部分不承担什么

- 不保存 RoleDefinition / CapabilityDefinition 正文。
- 不拥有 method body、能力评估算法正文或绩效评分。
- 不从 method-library private id 字符串推导内部 identity truth。

#### 7.6.6 与其他部分的接缝

- 依赖身份锚定提供成员主语。
- 通过 method source boundary 消费 role / capability 来源摘要。
- 向消费追溯提供可见 role / capability summary。
- 向传播与交接输出 accepted summary change。

#### 7.6.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | 通过 | role、capability、source change 均覆盖 |
| 候选对象是否有功能来源 | 通过 | 来自 `FR-ID-006`~`FR-ID-008` |
| 接缝是否清楚 | 通过 | method-library 只经 source resolver / snapshot |
| 禁止事项是否清楚 | 通过 | 已排除 definition body 和算法正文 |
| 是否越界 | 通过 | 来源协议仍后移 `03` |

### 7.7 身份生涯记录

#### 7.7.1 本部分职责

身份生涯记录负责将可信项目参与来源追加为成员身份侧 career history,支撑长期身份叙事和审计追溯。

#### 7.7.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 追加生涯记录 | work participation ref、actor / source、reason | career record ref / result | append-only history、trace / outbox material | Step 6 / Step 8 / Step 9 |
| 处理重复项目参与来源 | source marker、member ref | duplicate / no-op / conflict | 不新增重复 career record | Step 8 / Step 10 |
| 读取生涯摘要 | member ref、visibility context | career summary view | 不写 truth,按 visibility 裁剪 | Step 7 / Step 8 |

#### 7.7.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| Career Memory Application Service | Application Service | 编排 career append 和重复来源处理 | Step 7 / Step 8 |
| Career Record | Domain Model / History | 承载身份侧追加生涯历史 | Step 6 |
| Career Append Policy | Policy / Invariant | 保证 append-only 和重复来源处理 | Step 6 |
| Work Participation Source Boundary | Boundary Port | 消费 work participation ref / summary | Step 7 / `03` |

#### 7.7.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `CareerRecord` | 独立成节 |
| Policy / Invariant | `CareerAppendPolicy` | 独立成节或并入 `CareerRecord` 说明 |
| Projection / Read model | `CareerSummaryView` | 可并入 `MemberSummaryView` |
| Reference / Boundary | `ProjectParticipationRef`, `WorkSourceRef` | 边界 ref,默认不独立成节 |
| Audit / History | `CareerTraceRecord` | 可并入 career / trace 对象组 |

#### 7.7.5 本部分不承担什么

- 不拥有 Project、WorkItem、ProjectMember truth。
- 不修改、删除或重排已确认 career history。
- 不根据项目私有字段自行推断成员身份。

#### 7.7.6 与其他部分的接缝

- 依赖身份锚定提供成员主语。
- 通过 work participation boundary 消费项目参与来源。
- 向消费追溯提供 career summary / trace。
- 向传播与交接输出 career append accepted fact。

#### 7.7.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | 通过 | append、duplicate、read summary 已覆盖 |
| 候选对象是否有功能来源 | 通过 | 来自 `FR-ID-009` |
| 接缝是否清楚 | 通过 | work 只提供 participation ref / summary |
| 禁止事项是否清楚 | 通过 | 已排除 project / ProjectMember truth |
| 是否越界 | 通过 | 未写 work protocol schema |

### 7.8 记忆引用关系

#### 7.8.1 本部分职责

记忆引用关系负责维护成员与外部 memory / archive refs 的身份侧关系、状态、迁移和冷存接缝,同时确保正文、embedding、index 和 archive package 不进入 identity。

#### 7.8.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 关联 memory ref | member ref、memory ref、source / reason | memory reference result | 更新 ref relation、trace / outbox material | Step 6 / Step 8 |
| 刷新 memory / archive 引用状态 | memory / archive source marker | refreshed / stale / unavailable state | 更新 reference state,不复制正文 | Step 8 / Step 9 |
| 记录迁移 / 冷存协作 | archive ref、handoff / migration marker | migrated / pending / failed marker | 更新 handoff / reference state | Step 6 / Step 8 / Step 9 |

#### 7.8.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| Memory Reference Service | Application Service | 编排 memory ref 关联、刷新和迁移结果处理 | Step 7 / Step 8 |
| Memory Reference Domain Model | Domain Model / Reference Object | 承载成员与外部 memory / archive refs 的身份侧关系 | Step 6 |
| Memory Reference State | State Object | 表达 pending / stale / unavailable / migrated 等引用状态 | Step 6 / Step 9 |
| Memory Archive Handoff Boundary | Boundary Port | 接入 archive / memory 迁移、冷存或 handoff 结果 | Step 7 / `03` |

#### 7.8.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `MemoryReference`, `MemoryReferenceState` | 均进入 Step 6 候选池,至少 `MemoryReference` 独立成节 |
| Policy / Invariant | `MemoryReferencePolicy` | 可独立成节或并入 `MemoryReference` |
| Projection / Read model | `MemoryReferenceView` | 可并入 `MemberSummaryView` |
| Reference / Boundary | `MemoryRef`, `ArchiveRef`, `ArchiveHandoffRef` | ref / boundary marker,默认不独立成节 |
| Audit / History | `MemoryReferenceTraceRecord` | 可并入 trace / history 对象组 |

#### 7.8.5 本部分不承担什么

- 不保存 memory 原文、embedding、检索索引。
- 不保存 artifact body、archive package 或 conversation body。
- 不作为 memory / archive 的正文 owner。

#### 7.8.6 与其他部分的接缝

- 依赖身份锚定提供成员主语。
- 通过 memory / archive boundary 接入引用状态或迁移结果。
- 向消费追溯提供可见 memory ref 摘要。
- 向传播与交接提供 handoff / reference state 变化 material。

#### 7.8.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | 通过 | 关联、刷新、迁移 / 冷存均覆盖 |
| 候选对象是否有功能来源 | 通过 | 来自 `FR-ID-010`~`FR-ID-011` |
| 接缝是否清楚 | 通过 | memory / archive 只经 ref / handoff marker |
| 禁止事项是否清楚 | 通过 | 已排除正文、embedding、package |
| 是否越界 | 通过 | 承载方和 receipt schema 后移 `03/04` |

### 7.9 身份事实消费与追溯

#### 7.9.1 本部分职责

身份事实消费与追溯负责向下游和审计场景提供可见身份摘要、变化追溯、trace / audit / history 读取和消费投影,并确保读取路径不写 truth。

#### 7.9.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 读取成员摘要 | member ref、consumer / visibility context | member summary / not found / not visible / stale / degraded | 不写 truth,可读取 projection | Step 7 / Step 8 / Step 10 |
| 读取身份变化追溯 | member ref、trace scope、visibility context | trace / audit / history view | 不泄漏外部正文 | Step 6 / Step 7 / Step 8 |
| 提供消费投影 | consumer scope、version / cursor marker | consumer-ready summary / stale marker | 读取或标记 projection 状态 | Step 7 / Step 9 |

#### 7.9.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| Consumption Query Service | Application Service | 编排摘要、trace、audit、projection 读取 | Step 7 / Step 8 |
| Member Summary View | Projection / Read Model | 提供可见身份摘要 | Step 6 |
| Identity Trace Record | Audit / History Model | 承接 identity truth 变化追溯 | Step 6 |
| Visibility Boundary | Policy / Boundary | 约束 not visible / redacted / degraded 响应 | Step 6 / Step 7 / `03` |
| Projection Store Boundary | Persistence / Projection Boundary | 承载可重建消费视图 | Step 7 / `03` |

#### 7.9.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `IdentityTraceRecord`, `AuditTrail` | `IdentityTraceRecord` 独立成节;`AuditTrail` 由 Step 6 判断 |
| Policy / Invariant | `VisibilityPolicy` | 独立成节或作为 query policy 对象 |
| Projection / Read model | `MemberSummaryView`, `IdentityTraceView` | `MemberSummaryView` 独立成节 |
| Reference / Boundary | `ConsumerRef`, `VisibilityContextRef` | ref / context,默认不独立成节 |
| Audit / History | `AuditEntry`, `HistoryRecord` | 进入 trace / history 对象组候选 |

#### 7.9.5 本部分不承担什么

- 不通过 query / projection 创建或修复成员。
- 不绕过 visibility 输出不可见字段或外部正文。
- 不让 consumer 私有状态反向定义 identity truth。

#### 7.9.6 与其他部分的接缝

- 读取身份锚定、生命周期、角色能力、生涯和记忆引用的可见摘要。
- 接收派生维护的 stale / degraded / projection state。
- 为事件传播和外部交接提供可见安全摘要边界。

#### 7.9.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | 通过 | summary、trace、consumer projection 已覆盖 |
| 候选对象是否有功能来源 | 通过 | 来自 `FR-ID-012`~`FR-ID-013` |
| 接缝是否清楚 | 通过 | 只读消费所有 accepted facts |
| 禁止事项是否清楚 | 通过 | 已排除 query write 和正文泄漏 |
| 是否越界 | 通过 | visibility 字段级 schema 后移 `03` |

### 7.10 派生维护与对账

#### 7.10.1 本部分职责

派生维护与对账负责重建 identity 自身投影、刷新外部引用状态、发现漂移并形成 report-only finding,不能修复相邻仓 truth 或绕过 command 写入 identity truth。

#### 7.10.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 重建消费投影 | maintenance scope、cursor / page marker | rebuilt / stale / failed report | 更新 projection state | Step 7 / Step 8 / Step 9 |
| 刷新外部引用状态 | reference refresh scope、external ref | reference resolved / unavailable / stale | 更新 reference state | Step 7 / Step 8 / Step 9 |
| 生成对账发现 | reconciliation scope、identity state / projection state | reconciliation report / finding | 只报告漂移,不修复外部 truth | Step 6 / Step 8 / Step 10 |

#### 7.10.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| Maintenance Service | Application Service / Job Orchestrator | 编排 projection rebuild、reference refresh 和 reconciliation | Step 7 / Step 8 |
| Projection Rebuild Job | Operations Job | 重建 identity 自身可重建投影 | Step 7 / Step 8 |
| Reference Refresh Job | Operations Job | 刷新外部引用状态 marker | Step 7 / Step 8 |
| Reconciliation Report Store | Report Boundary | 保存 report-only finding | Step 6 / Step 7 / `03` |

#### 7.10.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ProjectionState`, `ReferenceResolutionState` | 均进入 Step 6 候选池 |
| Policy / Invariant | `ReconciliationPolicy` | 可独立成节或后移 `03` |
| Projection / Read model | `ReconciliationReport` | 独立成节 |
| Reference / Boundary | `ExternalReferenceRef`, `MaintenanceScopeRef` | ref / scope,默认不独立成节 |
| Audit / History | `MaintenanceTraceRecord` | 可并入 trace / history 对象组 |

#### 7.10.5 本部分不承担什么

- 不修复 `L1-work`、`L3-method-library`、`L1-governance`、memory / archive 或 downstream consumer truth。
- 不在 query path 同步刷新 truth。
- 不以 maintenance job 绕过 command 的 actor / reason / basis。

#### 7.10.6 与其他部分的接缝

- 从消费追溯读取 projection / trace / reference state。
- 可能读取 identity truth 和外部 reference summary,但只更新派生 state 或 report。
- 向消费追溯输出 stale / degraded / finding。

#### 7.10.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | 通过 | rebuild、refresh、reconcile 已覆盖 |
| 候选对象是否有功能来源 | 通过 | 来自 `FR-ID-014` 和架构 report-only maintenance |
| 接缝是否清楚 | 通过 | 只更新 projection / reference / report |
| 禁止事项是否清楚 | 通过 | 已排除跨仓修复 |
| 是否越界 | 通过 | scope / cursor / policy schema 后移 `03` |

### 7.11 身份事实传播与外部交接

#### 7.11.1 本部分职责

身份事实传播与外部交接负责把 accepted identity fact 安全传播给下游,并对 trace、audit、archive 或 observability 承接方做可追溯 handoff。

#### 7.11.2 本部分功能 / capability 清单

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 准备 outbox material | accepted truth change、trace context | outbox record / pending publish state | 与 accepted truth 保持一致,不等待下游成功 | Step 6 / Step 8 / Step 9 |
| 发布身份事实事件 | pending outbox、topic / consumer boundary | published / retryable / failed state | 更新 outbox delivery marker | Step 7 / Step 8 / Step 9 |
| 准备 trace / archive handoff | trace / audit / archive handoff scope | handoff intent / receipt marker | 更新 handoff state,不保存外部正文 | Step 6 / Step 8 / Step 9 |

#### 7.11.3 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| Outbox Publisher | Operations / Publisher | 发布 pending accepted fact event | Step 7 / Step 8 |
| Identity Outbox Record | Outbox Record | 承载待发布的安全 payload snapshot / marker 轮廓 | Step 6 |
| Event Envelope Boundary | Boundary / Protocol Skeleton | 定义对下游可见的事件 envelope 方向 | Step 7 / `03` |
| Trace Handoff Intent | Handoff Object | 表达 trace / audit / archive handoff 交接意图 | Step 6 |
| Handoff Port | Boundary Port | 交给外部承接方,接收 receipt / failure marker | Step 7 / `03` |

#### 7.11.4 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `OutboxState`, `HandoffState` | 可作为状态对象进入 Step 6 / Step 9 候选 |
| Policy / Invariant | `OutboundEventPolicy`, `HandoffPolicy` | 可并入 outbox / handoff 对象或后移 `03` |
| Projection / Read model | `OutboxPendingView` | 默认作为 read model,由 Step 6 判断 |
| Reference / Boundary | `TopicKey`, `HandoffTargetRef` | boundary ref,默认不独立成节 |
| Audit / History | `HandoffTraceRecord` | 可进入 trace / history 对象组 |
| Outbox / Handoff | `IdentityOutboxRecord`, `TraceHandoffIntent` | 均独立成节候选 |

#### 7.11.5 本部分不承担什么

- 不重算 accepted truth。
- 不把下游 publish / handoff 成功作为 command accepted 前置。
- 不伪造 delivery 或 handoff 成功。
- 不携带外部正文、secret 或不可见字段。

#### 7.11.6 与其他部分的接缝

- 接收身份锚定、生命周期、角色能力、生涯、记忆等部分的 accepted fact material。
- 向 downstream consumers 传播身份变化。
- 向 archive / observability / audit 承接方交接安全 trace material。
- 向派生维护提供 failed / retryable / pending marker。

#### 7.11.7 本部分停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 功能是否清楚 | 通过 | outbox、publish、handoff 均覆盖 |
| 候选对象是否有功能来源 | 通过 | 来自 `FR-ID-012`~`FR-ID-013` 和 accepted fact propagation 架构机制 |
| 接缝是否清楚 | 通过 | 只传播 / 交接 accepted material |
| 禁止事项是否清楚 | 通过 | 已排除同步 fan-out 前置和正文泄漏 |
| 是否越界 | 通过 | event envelope / receipt schema 后移 `03` |

### 7.12 Step 6 展开门禁

| 门禁项 | 当前结论 | Step 6 承接方式 |
|---|---|---|
| 对象候选必须回指主要组成部分 capability | 已满足 | Step 6 每个对象基本信息表必须写所属组成部分和功能来源 |
| 候选对象不能只是 API / repository / port / DTO | 已列出排除规则 | Step 6 先做对象候选池筛选说明 |
| 字段和函数不得在 Step 5 展开 | 已满足 | Step 6 再写关键字段 / 成员函数 / 工厂函数骨架 |
| `Step 6 必须独立展开` 的候选不得悬空 | 已列候选池 | Step 6 独立成节或说明筛除原因 |
| trace / audit / history / outbox / handoff 候选需要统一归属 | 已识别 | Step 6 需判断独立对象还是对象组 |

### 7.13 跨组成部分闭环审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在重复 truth owner | 未发现 | `GlobalMember`、lifecycle、role summary、career、memory refs 各有边界 |
| 是否把外部正文当成本仓对象 | 未发现 | RoleDefinition body、ProjectMember truth、memory body、archive package 已排除 |
| 是否把 projection / report 当 truth | 未发现 | 消费追溯只读,派生维护只做 projection / reference / report |
| 是否把 outbox / handoff 当 command accepted 前置 | 未发现 | 传播与交接只承接 accepted material |
| 是否有候选对象无 capability 来源 | 未发现 | 全部候选均回指 `FR-ID-*` 或架构机制 |
| 是否有接口 / port / DTO 被误列为关键对象 | 未发现 | 已列排除规则,Step 6 继续筛选 |
| 是否存在后续展开位置悬空 | 未发现 | Step 6~9 或 `03` 均已标注 |
| 是否存在 unresolved 冲突 | 未发现 | 仍需 Step 6 对对象候选正式化 |

### 7.14 后续展开一致性检查结论

- Step 6 必须从 §7.2 和各部分对象发现线索出发,不能重新生成一张无来源对象总表。
- Step 7 的接口骨架必须能回指本 Step 的组成部分和代码主体,不能按外部系统或 transport 产品重新分类。
- Step 8 的处理流必须能回指本 Step 的 capability,不能出现无所属组成部分的 flow。
- Step 9 的状态必须能回指本 Step 的 truth / state / projection / reference / outbox / handoff 候选。
- Step 10 的异常边界必须覆盖本 Step 每个组成部分的非职责和高风险串线点。

---

## 8. 复杂度判断 / 是否拆分

本 Step 内容较长,但仍保留在单一 Step 文件中,原因是当前 8 个主要组成部分都需要在同一张候选池和跨部分审计中比较,拆成多个附录会增加对象候选重复和职责漂移风险。

如果后续审核认为某个组成部分需要更细讨论,应在 Step 5 审核后补当前 Step 附录,而不是进入 Step 6 后再回头发明对象来源。

---

## 9. 回填草稿

正式 `02-概要设计.md` §5 后续应回填:

1. 组成部分总表。
2. 各部分交互总图。
3. 对象发现维度表。
4. 每个主要组成部分的职责、capability、代码主体、对象发现线索、非职责和接缝摘要。
5. Step 6 展开门禁。
6. 跨组成部分闭环审计表。

正式正文要等 Step 14 统一装配,当前不直接回填。

---

## 10. 待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 8 个主要组成部分作为本轮概要业务结构主语 | 若不认可,Step 6 对象候选池需要重排 | 当前按 `C-ID-1`~`C-ID-5` 和 Step 4 框架收敛 |
| 是否认可生涯记录与记忆引用关系拆分 | 若不认可,`C-ID-4` 对象候选会合并 | 当前因 truth / reference / forbidden body 维度不同而拆分 |
| 是否认可派生维护与对账、传播与外部交接独立成部分 | 若不认可,Step 7~9 可能混淆 query、maintenance 和 outbox / handoff | 当前按 query no-write、report-only 和 eventual propagation 约束拆分 |
| 是否认可 Step 6 必须从本 Step 候选池正式化对象 | 若不认可,Step 6 可能重新生成对象主语 | 当前按最新版 SOP 执行 |

---

## 11. 进入下一步条件

进入 Step 6 前必须满足:

- 用户审核通过 8 个主要组成部分的划分。
- 用户审核通过每个组成部分的职责、非职责、capability、代码主体、接缝和停审记录。
- 用户认可对象发现维度表可作为 Step 6 对象候选池。
- 用户认可 API、repository、port、trigger、DTO 和外部 SDK raw response 不默认升级为 Step 6 关键对象。
- 用户认可本 Step 没有展开关键对象字段、成员函数、工厂函数、完整接口契约或详细处理流。
