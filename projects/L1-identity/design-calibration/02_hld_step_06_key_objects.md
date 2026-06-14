# Step 6. 关键对象轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 6
> 回填章节: `02-概要设计.md` §6 关键对象轮廓
> 生成日期: 2026-06-11
> 状态: Step 6 已完成,等待审核后进入 Step 7

---

## 1. Step 状态 + Step 内计划

本 Step 不再沿用旧版“一次性关键对象总表”。本轮先建立 Step 6 执行框架,再按 Step 5 已确认的主要组成部分逐个完成对象正式化小循环。

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取 Step 4 代码主体框架、Step 5 主要组成部分和最新版概要 SOP Step 6 约束 | 已完成 | §2 |
| 诊断旧 Step 6 一次性对象总表的问题 | 已完成 | §4 |
| 建立 Step 6 对象正式化执行框架 | 已完成 | §7 |
| 建立对象候选池筛选规则和排除规则 | 已完成 | §7.1~§7.2 |
| 建立按主要组成部分推进的小循环计划 | 已完成 | §7.3 |
| 逐批补充“身份锚定与成员真相”对象轮廓 | 已完成 | §7.5 |
| 逐批补充“全局生命周期”对象轮廓 | 已完成 | §7.6 |
| 逐批补充“角色能力摘要”对象轮廓 | 已完成 | §7.7 |
| 逐批补充“身份生涯记录”对象轮廓 | 已完成 | §7.8 |
| 逐批补充“记忆引用关系”对象轮廓 | 已完成 | §7.9 |
| 逐批补充“身份事实消费与追溯”对象轮廓 | 已完成 | §7.10 |
| 逐批补充“派生维护与对账”对象轮廓 | 已完成 | §7.11 |
| 逐批补充“身份事实传播与外部交接”对象轮廓 | 已完成 | §7.12 |
| 完成跨对象 / 跨组成部分一致性审计 | 已完成 | §7.13 |
| 形成正式 `02` §6 回填草稿 | 已完成 | §9 |
| 列出待确认事项和进入下一步条件 | 已完成 | §10~§11 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `02_hld_step_04_code_subject_framework.md` | 已完成并已获用户认可 | 提供代码主体骨架、业务结构轴和实现分层轴 |
| `02_hld_step_05_components_boundary.md` | 已完成并已获用户认可 | 提供 8 个主要组成部分、capability、对象发现维度表和 Step 6 展开门禁 |
| `02_hld_step_03_constraints.md` | 已完成并已获用户认可 | 提供 truth center、query no-write、forbidden body、report-only、eventual propagation 等对象筛选门禁 |
| `projects/L1-identity/00-需求文档.md` | 当前需求输入 | 提供 `C-ID-1`~`C-ID-5`、功能需求、业务规则、数据边界和 VETO |
| `projects/L1-identity/01-架构设计.md` | 当前架构输入 | 提供语义结构、数据 ownership、交互方式、横切机制和依赖方向 |
| `standards/document/概要设计讨论流程_SOP.md` | 最新流程标准 | 规定 Step 6 必须按主要组成部分逐个完成对象正式化 |
| `standards/document/概要设计书写规范.md` | 最新正式结构标准 | 规定 §6 正式文档的结果结构 |
| 旧 `02_hld_step_06_key_objects.md` | legacy draft | 只作为诊断输入,不得直接继承 |

---

## 3. SOP 问题回答

### 3.1 哪些对象如果不在概要设计层点名,详细设计会重新发明主语?

Step 6 必须点名会成为详细设计主语的对象,包括:

- identity truth / state:成员身份主语、生命周期状态、角色能力摘要、生涯记录、记忆引用关系。
- policy / guard:身份锚定、生命周期迁移、角色能力来源、生涯追加、记忆引用、可见性、对账、outbox / handoff 等不变量承接者。
- projection / read model:成员摘要、trace view、consumer projection、outbox pending view 等只读主语。
- reference / snapshot / boundary object:外部来源解析状态、method / work / memory / archive 来源摘要和 handoff intent。
- trace / audit / history / outbox / report:accepted fact 追溯、传播、维护报告和外部交接主语。

这些对象必须回指 Step 5 的主要组成部分和 capability 来源,否则详细设计会在 DTO、port 或 repository 中重新发明业务主语。

### 3.2 Step 5 的对象候选池中,哪些候选对象正式进入本步独立展开?

本轮先不在框架批次中最终裁定全部对象。正式裁定必须按主要组成部分逐批完成。当前候选池入口来自 Step 5 §7.2 和 §7.4~§7.11:

| 主要组成部分 | 本 Step 必须处理的候选入口 |
|---|---|
| 身份锚定与成员真相 | `GlobalMember`, `IdentityAnchorState`, `IdentityAnchorPolicy`, `MemberAnchorView`, `IdentityTraceRecord` |
| 全局生命周期 | `GlobalLifecycleState`, `LifecycleTransitionPolicy`, `HighRiskLifecycleGuard`, `LifecycleSummaryView`, `LifecycleTraceRecord` |
| 角色能力摘要 | `RoleCapabilitySummary`, `RoleCapabilitySourceState`, `RoleCapabilitySourcePolicy`, `RoleCapabilityView`, `RoleCapabilitySourceSnapshot` |
| 身份生涯记录 | `CareerRecord`, `CareerAppendPolicy`, `CareerSummaryView`, `CareerTraceRecord` |
| 记忆引用关系 | `MemoryReference`, `MemoryReferenceState`, `MemoryReferencePolicy`, `MemoryReferenceView`, `MemoryReferenceTraceRecord` |
| 身份事实消费与追溯 | `MemberSummaryView`, `IdentityTraceRecord`, `AuditTrail`, `VisibilityPolicy`, `IdentityTraceView`, `AuditEntry`, `HistoryRecord` |
| 派生维护与对账 | `ProjectionState`, `ReferenceResolutionState`, `ReconciliationPolicy`, `ReconciliationReport`, `MaintenanceTraceRecord` |
| 身份事实传播与外部交接 | `IdentityOutboxRecord`, `TraceHandoffIntent`, `OutboxState`, `HandoffState`, `OutboundEventPolicy`, `HandoffPolicy`, `OutboxPendingView`, `HandoffTraceRecord` |

每个候选在后续小循环中必须被处理为三类之一:正式关键对象、并入其他对象说明、排除并说明原因。

### 3.3 哪些名称不应作为关键对象展开?

默认不作为 Step 6 关键对象展开:

- API、request、response、event payload、job DTO、receipt、report DTO。
- repository、port、resolver、publisher、handoff adapter、handler、runner。
- database table、index、cursor 存储结构、HTTP path、topic key、queue name。
- 外部 SDK raw response、method / work / governance / memory / archive 原始正文。
- 临时变量、缓存项、内部 helper、框架 glue code。

若后续批次决定某个名称需要作为对象展开,必须说明它为何是概要关键对象,而不是接口或实现细节。

### 3.4 每个对象应该写到什么粒度?

本 Step 可以写:

- 对象名、所属组成部分、对象类型、功能来源和主要责任。
- 关键字段骨架,字段必须写 `字段 / 类型 / 作用`。
- 状态集合骨架,只说明状态语义和方向,不写完整状态矩阵。
- 成员函数 / 工厂函数骨架,参数必须写 `TypeName param_name`。
- 禁止事项和后续详细设计承接点。

本 Step 不写:

- 完整字段全集、完整 enum variants、完整 Rust 签名、返回类型、泛型、生命周期。
- DDL、索引、序列化 schema、topic map、HTTP schema、事务脚本、retry policy。
- repository / port trait 签名和 adapter 实现。

### 3.5 每个主要组成部分的对象正式化如何停审?

每个主要组成部分完成后必须停审:

- Step 5 候选是否全部处理完。
- 正式对象是否都有功能 / capability 来源。
- 被排除名称是否有排除理由。
- 对象是否越过组成部分边界。
- 字段 / 函数是否仍停留在概要骨架深度。
- Step 8 / Step 9 预计会使用的对象是否没有悬空。

---

## 4. 当前材料 / 旧文档问题诊断

| 旧材料 / 倾向 | 问题 | 本轮处理 |
|---|---|---|
| 旧 Step 6 直接给全仓关键对象总表 | 违反最新版 SOP “按主要组成部分逐个完成对象正式化”的要求 | 本轮先建执行框架,后续按 8 个组成部分逐批补充 |
| 旧 Step 6 把对象筛选结论一次性写死 | 无法看出每个对象来自哪个 capability,也难以解释合并 / 排除理由 | 后续每个对象必须写所属组成部分和功能来源 |
| 旧 Step 6 将字段 / 函数集中成全局表 | 对象独立性不足,后续 Step 8 / Step 9 难以反查 | 后续每个对象独立成节,字段 / 状态 / 函数分别成表 |
| 旧 Step 6 对 trace / audit / history / outbox / handoff 归属较粗 | 容易重复建 record 或把传播对象当 truth | 本轮在对应组成部分批次中统一判断独立对象、对象组或并入关系 |
| 旧 Step 6 未体现“框架先行、分批补充” | 容易再次生成一次性全仓对象清单 | 当前只提交框架,不提前填完整对象集 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 生成方式 | 一次性输出全仓对象表 | 先建 Step 6 执行框架,再按主要组成部分小循环补充 |
| 对象来源 | 主要靠对象名称和类型判断 | 每个对象必须回指 Step 5 capability 和对象发现线索 |
| 对象表达 | 全局总表 + 全局字段表 + 全局函数表 | 每个对象独立成节,字段 / 状态 / 成员函数 / 工厂函数分别成表 |
| 排除规则 | 简要说明 API / repository 不作为对象 | 每个组成部分候选都要处理为正式、并入或排除 |
| 停审 | 只有 Step 末尾进入条件 | 每个主要组成部分都必须有对象正式化停审记录 |
| 粒度控制 | 容易接近详细设计 schema | 明确只到概要对象骨架,完整契约后移 `03` |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 保留旧版一次性关键对象总表并局部修补 | 不采用 | 与当前 SOP 和用户确认的分批思路冲突 |
| 先创建 Step 6 框架,再逐个主要组成部分补充 | 采用 | 能保留流式推进,同时获得 governance 式细粒度审查 |
| 先把 8 个组成部分全部对象名写满,后续再补字段 / 函数 | 不采用 | 仍然会提前锁死对象筛选结论,难以逐模块审查 |
| 每个对象独立成节,总表只作为索引 | 采用 | 符合 SOP,也便于 Step 8 / Step 9 反查 |
| 在本 Step 提前定义 port / repository / DTO | 不采用 | 这些属于 Step 7 或详细设计,不应升级为领域对象 |

---

## 7. 结构化中间产物

### 7.1 对象候选处理规则

每个候选对象必须进入以下处理结果之一:

| 处理结果 | 使用条件 | 必填说明 |
|---|---|---|
| 正式关键对象 | 会成为 truth、state、policy、projection、reference、trace、history、outbox、handoff 或 report 主语 | 所属组成部分、功能来源、对象类型、责任、字段 / 状态 / 函数骨架 |
| 并入其他对象 | 候选只是某个对象的状态、字段、视图切片或对象组成员 | 并入目标、并入理由、后续反查位置 |
| 排除 | 候选属于 API、DTO、port、repository、外部正文、实现细节或临时 helper | 排除理由、后续所属 Step 或边界外 owner |

### 7.2 单对象小节模板

后续每个正式关键对象必须使用以下模板:

```text
#### <对象名>

| 项 | 结论 |
|---|---|
| 所属组成部分 | <Step 5 主要组成部分> |
| 功能来源 | <capability / FR / 架构机制> |
| 对象类型 | <Truth / State / Policy / Projection / Reference / Trace / History / Outbox / Handoff / Report> |
| 主要责任 | <一句话说明对象承接什么> |
| 不承担什么 | <避免串线> |
| 后续承接 | <Step 7 / Step 8 / Step 9 / 03> |

关键字段骨架

| 字段 | 类型 | 作用 |
|---|---|---|

状态集合骨架

| 状态 | 作用 | 备注 |
|---|---|---|

成员函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|

工厂函数骨架

| 函数 | 参数 | 作用 |
|---|---|---|

禁止事项

| 禁止项 | 原因 |
|---|---|
```

没有状态集合、成员函数或工厂函数的对象必须显式写“本对象在概要层不单独定义”并说明原因,不得省略判断。

### 7.3 按主要组成部分的小循环计划

| 批次 | 主要组成部分 | 本批目标 | 初始候选 | 停审要求 |
|---|---|---|---|---|
| 6-A | 身份锚定与成员真相 | 正式化成员身份主语、锚定状态 / policy、基础 trace / view 归属 | `GlobalMember`, `IdentityAnchorState`, `IdentityAnchorPolicy`, `MemberAnchorView`, `IdentityTraceRecord` | 建档、防复用、query no-create、账号 / ProjectMember 排除闭合 |
| 6-B | 全局生命周期 | 正式化生命周期状态、迁移 policy、高风险 basis guard 归属 | `GlobalLifecycleState`, `LifecycleTransitionPolicy`, `HighRiskLifecycleGuard`, `LifecycleSummaryView`, `LifecycleTraceRecord` | 生命周期与 runtime / ProjectMember / governance truth 边界闭合 |
| 6-C | 角色能力摘要 | 正式化 role / capability summary、source snapshot、source policy 归属 | `RoleCapabilitySummary`, `RoleCapabilitySourceState`, `RoleCapabilitySourcePolicy`, `RoleCapabilityView`, `RoleCapabilitySourceSnapshot` | method body / RoleDefinition body 不入仓闭合 |
| 6-D | 身份生涯记录 | 正式化 append-only career record 和 append policy | `CareerRecord`, `CareerAppendPolicy`, `CareerSummaryView`, `CareerTraceRecord` | work truth / ProjectMember truth 排除闭合 |
| 6-E | 记忆引用关系 | 正式化 memory reference、reference state、handoff / migration 状态归属 | `MemoryReference`, `MemoryReferenceState`, `MemoryReferencePolicy`, `MemoryReferenceView`, `MemoryReferenceTraceRecord` | memory body / embedding / archive package 排除闭合 |
| 6-F | 身份事实消费与追溯 | 正式化 member summary view、trace / audit / history、visibility policy | `MemberSummaryView`, `IdentityTraceRecord`, `AuditTrail`, `VisibilityPolicy`, `IdentityTraceView`, `AuditEntry`, `HistoryRecord` | query no-write、visibility、正文不泄漏闭合 |
| 6-G | 派生维护与对账 | 正式化 projection state、reference resolution state、reconciliation report | `ProjectionState`, `ReferenceResolutionState`, `ReconciliationPolicy`, `ReconciliationReport`, `MaintenanceTraceRecord` | report-only maintenance 和不修复跨仓 truth 闭合 |
| 6-H | 身份事实传播与外部交接 | 正式化 outbox record、handoff intent、delivery / handoff state 归属 | `IdentityOutboxRecord`, `TraceHandoffIntent`, `OutboxState`, `HandoffState`, `OutboundEventPolicy`, `HandoffPolicy`, `OutboxPendingView`, `HandoffTraceRecord` | accepted fact propagation、publish 不作 accepted 前置、handoff 不保存正文闭合 |
| 6-I | 跨对象一致性审计 | 统一处理重复对象、对象组、Step 8 / Step 9 反查和回填草稿 | 前 8 批输出 | 无 unresolved 对象归属、无悬空状态 / flow 主语 |

### 7.4 当前批次执行边界

当前已完成 6-A “身份锚定与成员真相”、6-B “全局生命周期”、6-C “角色能力摘要”、6-D “身份生涯记录”、6-E “记忆引用关系”、6-F “身份事实消费与追溯”、6-G “派生维护与对账”、6-H “身份事实传播与外部交接”和 6-I “跨对象一致性审计”。Step 6 不再新增主要组成部分对象;后续进入 Step 7 时只允许基于本 Step 已确认对象抽取 API / 接口骨架。

### 7.5 6-A 身份锚定与成员真相

#### 7.5.1 本批输入与目标

本批只处理 Step 5 §7.4 的候选对象,目标是收稳平台级成员身份主语、身份引用稳定性、不可复用语义和 query no-create 边界。

| 输入 | 本批使用方式 |
|---|---|
| `FR-ID-001` 建立身份主语 | `GlobalMember` 必须成为平台级成员身份 truth 主语 |
| `FR-ID-002` 读取身份摘要 | 读取走 query / view,不得隐式创建 `GlobalMember` |
| `FR-ID-003` 身份引用稳定 | `GlobalMemberRef` 建立后长期稳定,退役 / 墓碑后不得复用 |
| `BR-ID-001` 身份引用不复用 | `IdentityAnchorState` 和 `IdentityAnchorPolicy` 必须表达不可复用规则 |
| `BR-ID-002` 查询不得创建 | `IdentityAnchorPolicy` 必须禁止 query / projection / maintenance 创建成员 |
| `BR-ID-003` 身份边界 | 账号、credential、runtime instance 不得等同为 `GlobalMember` |
| `VETO-ID-001` / `VETO-ID-002` | ref 复用和查询隐式创建均为 0 容忍 |
| Step 5 §7.4 | 提供本批候选、功能、非职责和接缝 |

#### 7.5.2 候选处理结论

| 候选 | 处理结果 | 理由 | 后续反查 |
|---|---|---|---|
| `GlobalMember` | 正式关键对象 | 平台级成员身份 truth 主语,承接建档、防复用和其他组成部分的成员主语依赖 | Step 7 command/query;Step 8 create/read flow;Step 9 anchor state |
| `IdentityAnchorState` | 正式关键对象 | 独立表达身份 ref 是否已建立、是否进入不可复用持有状态;不等同全局生命周期 | Step 9 anchor state;Step 10 ref reuse violation |
| `IdentityAnchorPolicy` | 正式关键对象 | 承接创建、查询不建档、ref 不复用、账号 / ProjectMember / runtime 排除等不变量 | Step 8 create guard;Step 10 rejected branches |
| `MemberAnchorView` | 并入后续 `MemberSummaryView` | 只是基础身份摘要读取切片,不是新的 truth;独立 view 可能与 6-F 消费摘要重复 | 6-F `MemberSummaryView`;Step 7 query API |
| `IdentityTraceRecord` | 并入 6-F trace / history 对象组 | 本批只确认建档和锚定变化需要追溯 material;trace record 是跨对象追溯主语 | 6-F `IdentityTraceRecord`;Step 8/9 accepted change trace |

#### 7.5.3 关键对象索引

| 对象 | 所属组成部分 | 对象类型 | 功能来源 | 主要责任 |
|---|---|---|---|---|
| `GlobalMember` | 身份锚定与成员真相 | Truth aggregate | `FR-ID-001`, `FR-ID-003`, `BR-ID-001`, `BR-ID-003` | 承载平台级成员身份主语、稳定 ref 和最小锚定不变量 |
| `IdentityAnchorState` | 身份锚定与成员真相 | State value | `FR-ID-003`, `BR-ID-001`, `VETO-ID-001` | 表达身份 ref 的锚定状态和不可复用持有状态 |
| `IdentityAnchorPolicy` | 身份锚定与成员真相 | Policy / Guard | `FR-ID-001~003`, `BR-ID-001~003`, `VETO-ID-001~002` | 校验创建、拒绝 query create、防止 ref 复用和边界混层 |

#### `GlobalMember`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 身份锚定与成员真相 |
| 功能来源 | `FR-ID-001`, `FR-ID-003`, `BR-ID-001`, `BR-ID-003` |
| 对象类型 | Truth aggregate |
| 主要责任 | 保存平台级成员身份主语和稳定 `GlobalMemberRef`,让生命周期、角色能力、生涯、记忆和消费追溯都能依附同一个 identity truth |
| 不承担什么 | 不承担认证账号、credential、session、runtime instance、ProjectMember 或项目内承担事实 |
| 后续承接 | Step 7 建档 / 读取接口;Step 8 创建和读取流;Step 9 anchor state;`03` 完整契约 |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `member_ref` | `GlobalMemberRef` | 平台级成员身份稳定引用,建立后不得复用给其他成员 |
| `anchor_state` | `IdentityAnchorState` | 当前身份锚定状态,用于防复用和墓碑持有判断 |
| `source_ref` | `IdentitySourceRef` | 建立身份主语的 body-free 来源引用 |
| `created_by_ref` | `ActorRef` | 创建成员身份主语的可信操作者引用 |
| `created_at` | `IdentityTimestamp` | 成员身份主语首次建立时间 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| 本对象不单独定义状态枚举 | `GlobalMember` 的锚定状态由 `IdentityAnchorState` 承接 | 全局可用性和暂停 / 退役状态留给 6-B |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `to_ref()` | 无 | 返回稳定 `GlobalMemberRef` |
| `assert_same_ref(GlobalMemberRef member_ref)` | `GlobalMemberRef member_ref` | 校验调用方引用的是同一个平台级成员主语 |
| `hold_anchor(IdentityAnchorState anchor_state, ActorRef actor_ref)` | `IdentityAnchorState anchor_state`, `ActorRef actor_ref` | 接受已由 policy 校验的锚定状态更新,不改变成员 ref |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `establish(GlobalMemberRef member_ref, IdentitySourceRef source_ref, ActorRef actor_ref, IdentityTimestamp created_at)` | `GlobalMemberRef member_ref`, `IdentitySourceRef source_ref`, `ActorRef actor_ref`, `IdentityTimestamp created_at` | 从受控创建意图建立平台级成员身份主语 |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不保存 credential、token、session、account body | 这些属于认证 / gateway / 安全入口,不是 identity truth |
| 不保存 ProjectMember / WorkItem truth | 项目内承担事实属于 `L1-work` |
| 不从 query / projection / maintenance 自动创建 | 违反 `BR-ID-002` 和 `VETO-ID-002` |
| 不因改名、暂停、退役或墓碑化复用 `member_ref` | 违反 `BR-ID-001` 和 `VETO-ID-001` |

#### `IdentityAnchorState`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 身份锚定与成员真相 |
| 功能来源 | `FR-ID-003`, `BR-ID-001`, `VETO-ID-001` |
| 对象类型 | State value |
| 主要责任 | 表达身份 ref 是否已经建立、是否处于不可复用持有状态,为防复用和墓碑语义提供概要主语 |
| 不承担什么 | 不表达成员全局可用性、暂停、恢复、退役审批或高风险治理依据 |
| 后续承接 | Step 9 anchor state;Step 10 ref reuse rejected branch;6-B 只承接生命周期状态 |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `state_kind` | `IdentityAnchorStateKind` | 锚定状态类别,例如已建立或不可复用持有 |
| `reason_ref` | `Option<IdentityAnchorReasonRef>` | 状态进入不可复用持有时的安全原因引用 |
| `changed_at` | `IdentityTimestamp` | 锚定状态最近变化时间 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| `Established` | 成员身份 ref 已建立并可被其他 identity 能力引用 | 不代表 runtime 可用 |
| `RetiredHeld` | ref 对应成员已不再作为新成员使用,但 ref 仍被保留 | 不等同 6-B 的生命周期完整状态矩阵 |
| `TombstoneHeld` | ref 已进入墓碑持有,用于防止删除后复用 | 终态语义在 Step 9/10 细化 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `is_reusable()` | 无 | 判断该 ref 是否可复用;对已建立 / 持有状态必须返回 false |
| `is_tombstone_held()` | 无 | 判断是否处于墓碑持有状态 |
| `hold_tombstone(IdentityAnchorReasonRef reason_ref, IdentityTimestamp changed_at)` | `IdentityAnchorReasonRef reason_ref`, `IdentityTimestamp changed_at` | 进入墓碑持有状态,不释放 ref |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `established(IdentityTimestamp changed_at)` | `IdentityTimestamp changed_at` | 创建已建立锚定状态 |
| `retired_held(IdentityAnchorReasonRef reason_ref, IdentityTimestamp changed_at)` | `IdentityAnchorReasonRef reason_ref`, `IdentityTimestamp changed_at` | 创建退役后 ref 持有状态 |
| `tombstone_held(IdentityAnchorReasonRef reason_ref, IdentityTimestamp changed_at)` | `IdentityAnchorReasonRef reason_ref`, `IdentityTimestamp changed_at` | 创建墓碑持有状态 |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不表达 runtime availability | runtime 状态不属于 identity truth |
| 不替代 `GlobalLifecycleState` | 生命周期完整状态和高风险处置留给 6-B |
| 不提供 ref 释放 / 重用状态 | ref 复用是 VETO |

#### `IdentityAnchorPolicy`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 身份锚定与成员真相 |
| 功能来源 | `FR-ID-001~003`, `BR-ID-001~003`, `VETO-ID-001~002`, `NFR-ID-003` |
| 对象类型 | Policy / Guard |
| 主要责任 | 在创建和读取边界上校验身份锚定不变量:只能由受控写入意图创建,查询不得建档,已持有 ref 不得复用 |
| 不承担什么 | 不读取 repository、不生成 id、不调用外部 adapter、不决定生命周期高风险 basis |
| 后续承接 | Step 7 command/query metadata;Step 8 create/read guard;Step 10 rejected branch;`03` policy contract |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `candidate_member_ref` | `GlobalMemberRef` | 待创建或校验的成员身份 ref |
| `source_ref` | `IdentitySourceRef` | 创建来源引用,用于防止无来源建档 |
| `actor_ref` | `ActorRef` | 触发写入意图的可信操作者 |
| `existing_anchor_state` | `Option<IdentityAnchorState>` | 已存在锚定状态;存在时不得作为新成员复用 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| 本对象在概要层不单独定义状态集合 | policy 是校验对象,不保存长期状态 | 长期状态由 `GlobalMember` / `IdentityAnchorState` 承接 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `assert_can_establish(GlobalMemberRef member_ref, IdentitySourceRef source_ref, ActorRef actor_ref)` | `GlobalMemberRef member_ref`, `IdentitySourceRef source_ref`, `ActorRef actor_ref` | 校验创建输入具备成员 ref、来源和可信 actor |
| `assert_ref_not_reused(GlobalMemberRef member_ref, Option<IdentityAnchorState> existing_anchor_state)` | `GlobalMemberRef member_ref`, `Option<IdentityAnchorState> existing_anchor_state` | 若 ref 已建立、退役持有或墓碑持有,拒绝复用 |
| `assert_query_does_not_create(IdentityOperationChannel channel)` | `IdentityOperationChannel channel` | 防止 query、projection、maintenance 隐式创建成员 |
| `assert_not_external_account_truth(IdentitySourceRef source_ref)` | `IdentitySourceRef source_ref` | 防止把账号、credential、runtime identity 或 ProjectMember 当作 `GlobalMember` truth |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `for_create(GlobalMemberRef member_ref, IdentitySourceRef source_ref, ActorRef actor_ref, Option<IdentityAnchorState> existing_anchor_state)` | `GlobalMemberRef member_ref`, `IdentitySourceRef source_ref`, `ActorRef actor_ref`, `Option<IdentityAnchorState> existing_anchor_state` | 构造创建成员时使用的锚定 guard |
| `for_read(IdentityOperationChannel channel)` | `IdentityOperationChannel channel` | 构造读取边界 guard,用于明确 query no-create |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不查询数据库或扫描外部系统 | policy 只消费 application 已加载的状态和输入 |
| 不生成 `GlobalMemberRef` 或当前时间 | id / clock 来源留给 Step 7 / `03` |
| 不把 not found query 转成 create | 违反 query no-write |
| 不把 `ActorRef` / account / ProjectMember / runtime instance 等同成员 truth | 违反身份边界 |

#### 7.5.4 本批被并入 / 后移的候选

| 候选 | 处理 | 理由 | 后续位置 |
|---|---|---|---|
| `MemberAnchorView` | 并入 `MemberSummaryView` | 它是成员摘要读取中的基础锚点切片,不是独立 truth 或必须单独维护的 projection 主语 | 6-F `MemberSummaryView`;Step 7 query API;Step 8 read flow |
| `IdentityTraceRecord` | 后移到 trace / history 对象组 | 建档、防复用和墓碑持有变化都需要追溯,但 trace record 是跨组成部分追溯对象 | 6-F `IdentityTraceRecord`;Step 8/9 accepted change trace |

#### 7.5.5 本批停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 5 候选是否全部处理 | 通过 | 5 个候选均已正式化、并入或后移 |
| 正式对象是否有功能来源 | 通过 | `GlobalMember`、`IdentityAnchorState`、`IdentityAnchorPolicy` 均回指 `FR-ID-001~003` 和 `BR-ID-001~003` |
| 被排除 / 并入名称是否有理由 | 通过 | `MemberAnchorView` 并入读模型,`IdentityTraceRecord` 后移到跨组成部分 trace 对象组 |
| 是否越过组成部分边界 | 通过 | 未定义生命周期完整状态、角色能力、生涯、memory、消费投影或 outbox |
| 字段 / 函数是否保持概要粒度 | 通过 | 只写字段 / 类型 / 作用和函数参数骨架,未写完整 Rust 签名、返回类型、DDL 或事务 |
| Step 8 / Step 9 预期对象是否悬空 | 暂无悬空 | 创建 / 读取 / 防复用可引用本批对象;trace 和 read view 已标注后续位置 |

### 7.6 6-B 全局生命周期

#### 7.6.1 本批输入与目标

本批只处理 Step 5 §7.5 的候选对象,目标是收稳成员全局可用性状态、显式生命周期迁移、高风险处置 basis guard,并继续保护 lifecycle 与 runtime / ProjectMember / governance truth 的边界。

| 输入 | 本批使用方式 |
|---|---|
| `FR-ID-004` 生命周期可用性 | `GlobalLifecycleState` 必须表达成员在平台范围内是否可用、暂停、退役或墓碑化 |
| `FR-ID-005` 高风险处置依据 | `HighRiskLifecycleGuard` 必须表达高风险 lifecycle action 需要 body-free basis ref |
| `BR-ID-004` 显式变化 | `LifecycleTransitionPolicy` 必须要求显式管理意图、原因和操作者上下文 |
| `BR-ID-005` 治理约束 | 高风险处置不得由后台任务静默执行,不得缺 basis accepted |
| `BR-ID-006` lifecycle 边界 | 生命周期不等同 runtime 容器状态、任务状态或 ProjectMember 状态 |
| `AC-ID-002` / `AC-ID-007` | 必须能证明生命周期可被管理、读取和追溯,非法变化和缺 basis 高风险变化会被拒绝 |
| `VETO-ID-004` | 高风险生命周期处置缺少授权 / 治理依据仍被接受为 0 容忍 |
| Step 5 §7.5 | 提供本批候选、功能、非职责和接缝 |

#### 7.6.2 候选处理结论

| 候选 | 处理结果 | 理由 | 后续反查 |
|---|---|---|---|
| `GlobalLifecycleState` | 正式关键对象 | 成员全局可用性是 identity-owned truth state,必须独立于 `IdentityAnchorState` 和 ProjectMember/runtime 状态 | Step 8 lifecycle command/read flow;Step 9 lifecycle state |
| `LifecycleTransitionPolicy` | 正式关键对象 | 承接显式变化、合法迁移、原因和 actor guard,是生命周期写路径的核心 policy | Step 8 lifecycle transition flow;Step 10 illegal transition |
| `HighRiskLifecycleGuard` | 正式关键对象 | 高风险处置 basis 是独立硬约束,不能埋在普通迁移 policy 中或写成 governance truth | Step 7 basis resolver;Step 8 high-risk flow;Step 10 missing basis |
| `LifecycleSummaryView` | 并入后续 `MemberSummaryView` | 它是成员摘要中的生命周期切片,不是独立 truth owner | 6-F `MemberSummaryView`;Step 7 lifecycle query |
| `GovernanceBasisRef` | 作为字段 / boundary ref | 它是外部治理 / 授权依据引用,不是 identity-owned object | Step 7 basis resolver port;`03` basis schema |
| `LifecycleTraceRecord` | 后移到 trace / history 对象组 | 生命周期变化需要追溯,但 trace record 是跨组成部分追溯主语 | 6-F `IdentityTraceRecord`;Step 8/9 lifecycle accepted trace |

#### 7.6.3 关键对象索引

| 对象 | 所属组成部分 | 对象类型 | 功能来源 | 主要责任 |
|---|---|---|---|---|
| `GlobalLifecycleState` | 全局生命周期 | State value / Truth state | `FR-ID-004`, `BR-ID-004`, `BR-ID-006`, `AC-ID-002` | 表达成员全局可用性状态和最近变化原因 |
| `LifecycleTransitionPolicy` | 全局生命周期 | Policy / Guard | `FR-ID-004`, `BR-ID-004`, `BR-ID-006`, `AC-ID-007` | 校验生命周期状态迁移是否显式、合法且不越界 |
| `HighRiskLifecycleGuard` | 全局生命周期 | Policy / Guard | `FR-ID-005`, `BR-ID-005`, `VETO-ID-004` | 校验高风险生命周期处置是否具备正式 basis ref |

#### `GlobalLifecycleState`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 全局生命周期 |
| 功能来源 | `FR-ID-004`, `BR-ID-004`, `BR-ID-006`, `AC-ID-002` |
| 对象类型 | State value / Truth state |
| 主要责任 | 表达成员在平台范围内的全局可用性,让下游能判断成员是否可被选择、调用、展示或归档 |
| 不承担什么 | 不表达 runtime container health、任务执行状态、ProjectMember 状态或治理裁决 truth |
| 后续承接 | Step 7 lifecycle command/query;Step 8 lifecycle transition flow;Step 9 lifecycle state machine;`03` 完整状态矩阵 |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `state_kind` | `GlobalLifecycleStateKind` | 生命周期状态类别,表达全局可用性 |
| `reason_ref` | `LifecycleReasonRef` | 生命周期变化原因引用,不得为空 |
| `changed_by_ref` | `ActorRef` | 最近一次显式生命周期变化的操作者 |
| `changed_at` | `IdentityTimestamp` | 最近一次生命周期变化时间 |
| `basis_ref` | `Option<GovernanceBasisRef>` | 高风险变化的授权 / 治理依据引用 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| `Available` | 成员在平台范围内可被选择、调用或展示 | 不代表 runtime 实例正在运行 |
| `Paused` | 成员暂不可用,可按正式流程恢复或继续处置 | 需要显式 reason 和 actor |
| `Retired` | 成员已退役,通常不再作为可用成员被选择 | ref 仍不得复用 |
| `Tombstoned` | 成员进入墓碑化生命周期状态 | ref 持有语义仍由 `IdentityAnchorState` 保护 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `can_transition_to(GlobalLifecycleStateKind target_state)` | `GlobalLifecycleStateKind target_state` | 判断目标状态是否可能成为合法迁移候选 |
| `is_available()` | 无 | 判断成员是否处于可用状态 |
| `is_terminal()` | 无 | 判断生命周期状态是否为终态候选 |
| `transition_to(GlobalLifecycleStateKind target_state, LifecycleReasonRef reason_ref, ActorRef actor_ref, IdentityTimestamp changed_at, Option<GovernanceBasisRef> basis_ref)` | `GlobalLifecycleStateKind target_state`, `LifecycleReasonRef reason_ref`, `ActorRef actor_ref`, `IdentityTimestamp changed_at`, `Option<GovernanceBasisRef> basis_ref` | 在 policy 已通过时生成新的生命周期状态 |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `initial_available(ActorRef actor_ref, LifecycleReasonRef reason_ref, IdentityTimestamp changed_at)` | `ActorRef actor_ref`, `LifecycleReasonRef reason_ref`, `IdentityTimestamp changed_at` | 创建成员建档后的初始生命周期状态 |
| `from_transition(GlobalLifecycleState current_state, GlobalLifecycleStateKind target_state, LifecycleReasonRef reason_ref, ActorRef actor_ref, IdentityTimestamp changed_at, Option<GovernanceBasisRef> basis_ref)` | `GlobalLifecycleState current_state`, `GlobalLifecycleStateKind target_state`, `LifecycleReasonRef reason_ref`, `ActorRef actor_ref`, `IdentityTimestamp changed_at`, `Option<GovernanceBasisRef> basis_ref` | 从当前状态生成目标状态骨架 |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不保存 runtime health、container status 或 task state | runtime 和任务执行不属于 identity lifecycle truth |
| 不保存 ProjectMember 状态 | 项目内承担事实属于 `L1-work` |
| 不保存 Gate / Policy / Approval / Control truth | governance 只作为 basis 来源 |
| 不因 `Retired` 或 `Tombstoned` 释放 `GlobalMemberRef` | ref 不复用由 6-A 约束保护 |

#### `LifecycleTransitionPolicy`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 全局生命周期 |
| 功能来源 | `FR-ID-004`, `BR-ID-004`, `BR-ID-006`, `AC-ID-007` |
| 对象类型 | Policy / Guard |
| 主要责任 | 校验生命周期变化必须来自显式写入意图、可信 actor、正式 reason,且迁移方向不违反全局生命周期边界 |
| 不承担什么 | 不解析 governance basis body、不查询 runtime 状态、不读取 ProjectMember 或任务状态 |
| 后续承接 | Step 8 lifecycle command flow;Step 9 lifecycle state transition;Step 10 illegal transition rejected |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `current_state` | `GlobalLifecycleState` | 当前生命周期状态 |
| `target_state` | `GlobalLifecycleStateKind` | 请求进入的目标状态 |
| `reason_ref` | `LifecycleReasonRef` | 显式变化原因引用 |
| `actor_ref` | `ActorRef` | 发起生命周期变化的可信操作者 |
| `operation_channel` | `IdentityOperationChannel` | 变化来源,用于拒绝 query / maintenance 静默写入 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| 本对象在概要层不单独定义状态集合 | policy 是校验对象,不保存长期状态 | 长期状态由 `GlobalLifecycleState` 承接 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `assert_explicit_command(IdentityOperationChannel channel, ActorRef actor_ref, LifecycleReasonRef reason_ref)` | `IdentityOperationChannel channel`, `ActorRef actor_ref`, `LifecycleReasonRef reason_ref` | 校验生命周期变化来自受控 command 且具备 actor / reason |
| `assert_allowed_transition(GlobalLifecycleState current_state, GlobalLifecycleStateKind target_state)` | `GlobalLifecycleState current_state`, `GlobalLifecycleStateKind target_state` | 校验迁移方向合法 |
| `assert_not_project_or_runtime_state(GlobalLifecycleStateKind target_state)` | `GlobalLifecycleStateKind target_state` | 防止把 runtime / ProjectMember 状态塞入全局生命周期 |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `for_transition(GlobalLifecycleState current_state, GlobalLifecycleStateKind target_state, LifecycleReasonRef reason_ref, ActorRef actor_ref, IdentityOperationChannel operation_channel)` | `GlobalLifecycleState current_state`, `GlobalLifecycleStateKind target_state`, `LifecycleReasonRef reason_ref`, `ActorRef actor_ref`, `IdentityOperationChannel operation_channel` | 构造普通生命周期迁移 guard |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不允许后台维护任务静默改变生命周期 | 违反 `BR-ID-004` |
| 不读取 runtime / ProjectMember 状态决定迁移 | 违反 `BR-ID-006` |
| 不把非法迁移降级为 projection stale | lifecycle 是 truth write,非法必须 rejected |

#### `HighRiskLifecycleGuard`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 全局生命周期 |
| 功能来源 | `FR-ID-005`, `BR-ID-005`, `VETO-ID-004`, `OQ-ID-002` |
| 对象类型 | Policy / Guard |
| 主要责任 | 对高风险生命周期动作要求正式授权 / 治理依据引用,并保证 identity 只保存 basis ref 和判断结果,不拥有治理裁决 truth |
| 不承担什么 | 不定义 Gate / Policy / Approval / Control schema,不保存治理正文,不替代 governance 裁决 |
| 后续承接 | Step 7 governance basis resolver port;Step 8 high-risk lifecycle precheck;Step 10 missing / mismatched basis rejected;`03` 完整 basis contract |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `target_state` | `GlobalLifecycleStateKind` | 请求进入的生命周期目标状态 |
| `action_risk_ref` | `LifecycleRiskRef` | 标记该动作是否需要高风险依据 |
| `basis_ref` | `Option<GovernanceBasisRef>` | body-free 授权 / 治理依据引用 |
| `actor_ref` | `ActorRef` | 发起高风险处置的操作者 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| 本对象在概要层不单独定义状态集合 | guard 是判定对象,不保存长期状态 | 若需要 pending basis 状态,后续 Step 8/9 必须明确 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `requires_basis(GlobalLifecycleStateKind target_state)` | `GlobalLifecycleStateKind target_state` | 判断目标动作是否属于高风险候选 |
| `assert_basis_present(GlobalLifecycleStateKind target_state, Option<GovernanceBasisRef> basis_ref)` | `GlobalLifecycleStateKind target_state`, `Option<GovernanceBasisRef> basis_ref` | 高风险动作缺 basis 时拒绝 |
| `assert_basis_matches_action(GovernanceBasisRef basis_ref, LifecycleRiskRef action_risk_ref)` | `GovernanceBasisRef basis_ref`, `LifecycleRiskRef action_risk_ref` | 校验 basis 与动作风险类别匹配;具体解析来源后移 Step 7 / `03` |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `for_action(GlobalLifecycleStateKind target_state, LifecycleRiskRef action_risk_ref, Option<GovernanceBasisRef> basis_ref, ActorRef actor_ref)` | `GlobalLifecycleStateKind target_state`, `LifecycleRiskRef action_risk_ref`, `Option<GovernanceBasisRef> basis_ref`, `ActorRef actor_ref` | 构造高风险 lifecycle guard |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不保存治理裁决正文或 Gate / Policy truth | governance 是依据来源,不是 identity-owned truth |
| 不在缺 basis 时 accepted 高风险动作 | 违反 `VETO-ID-004` |
| 不由后台任务自行补 basis | basis 必须来自正式授权 / 治理边界 |
| 不把 basis ref 解析规则写死在概要对象中 | 读取面和 schema 后移 Step 7 / `03` |

#### 7.6.4 本批被并入 / 后移的候选

| 候选 | 处理 | 理由 | 后续位置 |
|---|---|---|---|
| `LifecycleSummaryView` | 并入 `MemberSummaryView` | 生命周期摘要是成员可见摘要的一部分,不是新的 truth owner | 6-F `MemberSummaryView`;Step 7 lifecycle query |
| `GovernanceBasisRef` | 作为字段 / boundary ref | 它是治理 / 授权依据引用,不是 identity-owned object | Step 7 basis resolver;`03` basis DTO / port |
| `LifecycleTraceRecord` | 后移到 trace / history 对象组 | 生命周期变化必须可追溯,但 trace record 是跨组成部分追溯对象 | 6-F `IdentityTraceRecord`;Step 8/9 lifecycle accepted trace |

#### 7.6.5 本批停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 5 候选是否全部处理 | 通过 | 5 个显式候选和 `GovernanceBasisRef` boundary ref 均已正式化、并入或后移 |
| 正式对象是否有功能来源 | 通过 | `GlobalLifecycleState`、`LifecycleTransitionPolicy`、`HighRiskLifecycleGuard` 均回指 `FR-ID-004~005` / `BR-ID-004~006` |
| 被并入 / 后移名称是否有理由 | 通过 | `LifecycleSummaryView` 并入读模型,`LifecycleTraceRecord` 后移 trace 组,`GovernanceBasisRef` 作为 boundary ref |
| 是否越过组成部分边界 | 通过 | 未定义 governance truth、runtime health、ProjectMember 状态或 basis schema |
| 字段 / 函数是否保持概要粒度 | 通过 | 只写字段 / 类型 / 作用和函数参数骨架,未写完整状态矩阵、Rust 签名、port 或事务 |
| Step 8 / Step 9 预期对象是否悬空 | 暂无悬空 | lifecycle transition / high-risk guard 可引用本批对象;trace 和 summary view 已标注后续位置 |

### 7.7 6-C 角色能力摘要

#### 7.7.1 本批输入与目标

本批只处理 Step 5 §7.6 的候选对象,目标是收稳 identity-side role / capability summary、来源 snapshot、来源状态 policy,并保护 method-library RoleDefinition / CapabilityDefinition body、method body 和能力评估算法正文不进入 identity。

| 输入 | 本批使用方式 |
|---|---|
| `FR-ID-006` 维护成员角色摘要 | `RoleCapabilitySummary` 必须能表达成员身份侧角色摘要和 role source ref |
| `FR-ID-007` 维护成员能力画像摘要 | `RoleCapabilitySummary` 必须能表达能力声明摘要、证据引用和来源引用 |
| `FR-ID-008` 响应来源变化 | `RoleCapabilitySourceSnapshot` 与 `RoleCapabilitySourcePolicy` 必须表达 refreshed / stale / unavailable / pending reconciliation 轮廓 |
| `BR-ID-007` 定义正文边界 | 本批对象不得保存 RoleDefinition / CapabilityDefinition body 或 method body |
| `BR-ID-008` 来源 / 证据不变量 | 角色能力摘要不得形成无来源或无证据声明 |
| `BR-ID-009` 禁止自动评估 | 本批对象不得保存自动评估算法结果正文、绩效推断或不可解释评分 |
| `AC-ID-003` / `AC-ID-008` | 必须能证明摘要有来源 / 证据,来源失效不会静默污染成员摘要 |
| Step 5 §7.6 | 提供本批候选、功能、非职责和 method source boundary 接缝 |

#### 7.7.2 候选处理结论

| 候选 | 处理结果 | 理由 | 后续反查 |
|---|---|---|---|
| `RoleCapabilitySummary` | 正式关键对象 | 承接 identity-owned 成员角色 / 能力摘要,是 C-ID-3 的主要本地 truth / snapshot 主语 | Step 7 command/query;Step 8 role capability flow;Step 9 summary state |
| `RoleCapabilitySourceSnapshot` | 正式关键对象 | 表达 role / capability 来源的 body-free snapshot、version marker 和来源可用性状态,避免直接保存 method-library 正文 | Step 7 method source resolver;Step 8 source change flow;Step 10 source unavailable |
| `RoleCapabilitySourcePolicy` | 正式关键对象 | 承接来源 / 证据必填、definition body 禁止、source stale 不静默 accepted 等不变量 | Step 8 precheck;Step 10 forbidden body / missing source rejected |
| `RoleCapabilitySourceState` | 并入 `RoleCapabilitySourceSnapshot` | 它只是 snapshot 的来源状态字段,独立展开会制造第二个来源 truth | 本批 `RoleCapabilitySourceSnapshot`;Step 9 source state |
| `RoleCapabilityView` | 并入后续 `MemberSummaryView` | 它是成员摘要中的角色能力读取切片,不是新的 truth owner | 6-F `MemberSummaryView`;Step 7 role capability query |
| `RoleCapabilityTraceRecord` | 后移到 trace / history 对象组 | 角色能力变化必须可追溯,但 trace record 是跨组成部分追溯主语 | 6-F `IdentityTraceRecord`;Step 8/9 accepted summary trace |
| `RoleSourceRef` / `CapabilityEvidenceRef` | 作为字段 / boundary ref | 它们是外部来源和证据引用,不是 identity-owned object | Step 7 source / evidence resolver;`03` ref schema |

#### 7.7.3 关键对象索引

| 对象 | 所属组成部分 | 对象类型 | 功能来源 | 主要责任 |
|---|---|---|---|---|
| `RoleCapabilitySummary` | 角色能力摘要 | Truth / Snapshot | `FR-ID-006`, `FR-ID-007`, `BR-ID-008`, `AC-ID-003` | 保存成员身份侧可解释 role / capability 摘要、来源引用和证据引用 |
| `RoleCapabilitySourceSnapshot` | 角色能力摘要 | Reference / Snapshot | `FR-ID-006`~`FR-ID-008`, `BR-ID-007`, `AC-ID-008` | 表达 method-library 来源的 body-free 摘要、版本和状态 |
| `RoleCapabilitySourcePolicy` | 角色能力摘要 | Policy / Guard | `BR-ID-007`~`BR-ID-009`, `VETO-ID-003` | 防止无来源声明、definition body 泄漏和自动评估算法正文进入 identity |

#### `RoleCapabilitySummary`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 角色能力摘要 |
| 功能来源 | `FR-ID-006`, `FR-ID-007`, `BR-ID-008`, `AC-ID-003` |
| 对象类型 | Truth / Snapshot |
| 主要责任 | 承载成员身份侧角色、能力声明、安全摘要、来源引用和证据引用,用于成员解释、筛选和追溯 |
| 不承担什么 | 不保存 RoleDefinition / CapabilityDefinition body、不保存 method body、不自动评估能力等级或绩效 |
| 后续承接 | Step 7 role capability command/query;Step 8 maintain summary / source change flow;Step 9 summary state;`03` 完整 object contract |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `summary_ref` | `RoleCapabilitySummaryRef` | 角色能力摘要身份 |
| `member_ref` | `GlobalMemberRef` | 摘要所属成员 |
| `role_source_ref` | `Option<RoleSourceRef>` | 角色定义来源引用,不得承载定义正文 |
| `capability_source_refs` | `List<CapabilitySourceRef>` | 能力来源引用集合 |
| `evidence_refs` | `List<CapabilityEvidenceRef>` | 能力声明的证据引用集合,不得承载证据正文 |
| `safe_summary_ref` | `RoleCapabilitySafeSummaryRef` | 对外可见摘要引用或摘要 marker |
| `source_snapshot_ref` | `RoleCapabilitySourceSnapshotRef` | 当前摘要所依据的来源 snapshot |
| `summary_state` | `RoleCapabilitySummaryState` | 摘要当前是否 active、stale、unavailable 或 pending reconciliation |
| `changed_by_ref` | `ActorRef` | 最近一次维护摘要的 actor 或受控来源 |
| `changed_at` | `IdentityTimestamp` | 最近一次摘要变化时间 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| `Active` | 摘要有有效来源 / 证据,可用于受控读取和筛选 | 不代表 method-library 定义正文归 identity |
| `Stale` | 来源版本变化或摘要需要刷新 | 不得继续静默当作最新 truth 使用 |
| `Unavailable` | 来源不可用或无法解析 | 读取可降级,写入需按 policy 拒绝或挂起 |
| `PendingReconciliation` | 摘要与来源存在待对账差异 | 修复必须通过正式 role capability 能力或来源边界 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `attach_role_source(RoleSourceRef role_source_ref, RoleCapabilitySourceSnapshot snapshot, ActorRef actor_ref, IdentityTimestamp changed_at)` | `RoleSourceRef role_source_ref`, `RoleCapabilitySourceSnapshot snapshot`, `ActorRef actor_ref`, `IdentityTimestamp changed_at` | 绑定或更新角色来源引用和来源 snapshot |
| `update_capability_summary(List<CapabilitySourceRef> capability_source_refs, List<CapabilityEvidenceRef> evidence_refs, RoleCapabilitySafeSummaryRef safe_summary_ref, ActorRef actor_ref, IdentityTimestamp changed_at)` | `List<CapabilitySourceRef> capability_source_refs`, `List<CapabilityEvidenceRef> evidence_refs`, `RoleCapabilitySafeSummaryRef safe_summary_ref`, `ActorRef actor_ref`, `IdentityTimestamp changed_at` | 更新能力摘要和证据引用 |
| `mark_stale(RoleCapabilitySourceSnapshot snapshot, IdentityTimestamp changed_at)` | `RoleCapabilitySourceSnapshot snapshot`, `IdentityTimestamp changed_at` | 来源变化后将摘要标记为 stale |
| `mark_unavailable(RoleCapabilitySourceRef source_ref, IdentityTimestamp changed_at)` | `RoleCapabilitySourceRef source_ref`, `IdentityTimestamp changed_at` | 来源不可解析或不可用时标记摘要不可用 |
| `requires_reconciliation()` | 无 | 判断摘要是否需要对账或刷新 |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `create_for_member(GlobalMemberRef member_ref, RoleCapabilitySourceSnapshot source_snapshot, RoleCapabilitySafeSummaryRef safe_summary_ref, List<CapabilityEvidenceRef> evidence_refs, ActorRef actor_ref, IdentityTimestamp changed_at)` | `GlobalMemberRef member_ref`, `RoleCapabilitySourceSnapshot source_snapshot`, `RoleCapabilitySafeSummaryRef safe_summary_ref`, `List<CapabilityEvidenceRef> evidence_refs`, `ActorRef actor_ref`, `IdentityTimestamp changed_at` | 创建成员角色能力摘要骨架 |
| `from_source_change(RoleCapabilitySummary current_summary, RoleCapabilitySourceSnapshot new_snapshot, ActorRef actor_ref, IdentityTimestamp changed_at)` | `RoleCapabilitySummary current_summary`, `RoleCapabilitySourceSnapshot new_snapshot`, `ActorRef actor_ref`, `IdentityTimestamp changed_at` | 从来源变化生成摘要状态更新 |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不保存 RoleDefinition / CapabilityDefinition body | 定义正文归 `L3-method-library`,identity 只保存来源引用和安全摘要 |
| 不保存 method body 或自动评估算法正文 | 违反 `BR-ID-007` / `BR-ID-009` |
| 不允许无 source / evidence 的能力声明 accepted | 违反 `BR-ID-008` |
| 不从 method-library private id 字符串推导内部 truth | 外部来源必须经正式 boundary ref / snapshot |
| 不把 `ProjectMember` 角色分配写成本对象 truth | 项目内角色属于 `L1-work` |

#### `RoleCapabilitySourceSnapshot`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 角色能力摘要 |
| 功能来源 | `FR-ID-006`~`FR-ID-008`, `BR-ID-007`, `AC-ID-008` |
| 对象类型 | Reference / Snapshot |
| 主要责任 | 表达 method-library role / capability 来源的 body-free snapshot、版本 marker、解析状态和可见摘要 marker |
| 不承担什么 | 不保存来源定义正文、不承担 method-library truth、不执行能力评估算法 |
| 后续承接 | Step 7 method source resolver;Step 8 source change handling;Step 9 source state;Step 10 source unavailable / stale;`03` snapshot schema |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `snapshot_ref` | `RoleCapabilitySourceSnapshotRef` | 来源 snapshot 身份 |
| `source_ref` | `RoleCapabilitySourceRef` | role / capability 来源引用 |
| `source_version_ref` | `RoleCapabilitySourceVersionRef` | 来源版本 marker |
| `source_state` | `RoleCapabilitySourceStateKind` | 来源解析状态 |
| `safe_summary_ref` | `RoleCapabilitySafeSummaryRef` | 来源安全摘要 marker,不得包含正文 |
| `evidence_refs` | `List<CapabilityEvidenceRef>` | 来源或能力声明的证据引用 |
| `resolved_at` | `IdentityTimestamp` | 最近一次解析 / 刷新时间 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| `Resolved` | 来源可解析,且可形成 body-free 摘要 | 不代表保存 definition body |
| `Stale` | 来源版本已变化或 snapshot 过期 | 后续 flow 必须刷新或标记待对账 |
| `Unavailable` | 来源暂不可用 | 不得用旧值静默覆盖新事实 |
| `Unrecognized` | 来源无法映射到正式 ref / marker | 应进入 rejected、pending 或 report-only 路径 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `matches_source(RoleCapabilitySourceRef source_ref)` | `RoleCapabilitySourceRef source_ref` | 判断 snapshot 是否对应同一正式来源 ref |
| `has_required_evidence()` | 无 | 判断 snapshot 或关联能力声明是否具备来源 / 证据引用 |
| `is_usable_for_summary()` | 无 | 判断 snapshot 是否可用于更新 `RoleCapabilitySummary` |
| `mark_stale(RoleCapabilitySourceVersionRef new_version_ref, IdentityTimestamp changed_at)` | `RoleCapabilitySourceVersionRef new_version_ref`, `IdentityTimestamp changed_at` | 来源版本变化时标记 stale |
| `mark_unavailable(IdentityTimestamp checked_at)` | `IdentityTimestamp checked_at` | 来源不可用时标记 unavailable |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `from_resolved_source(RoleCapabilitySourceRef source_ref, RoleCapabilitySourceVersionRef source_version_ref, RoleCapabilitySafeSummaryRef safe_summary_ref, List<CapabilityEvidenceRef> evidence_refs, IdentityTimestamp resolved_at)` | `RoleCapabilitySourceRef source_ref`, `RoleCapabilitySourceVersionRef source_version_ref`, `RoleCapabilitySafeSummaryRef safe_summary_ref`, `List<CapabilityEvidenceRef> evidence_refs`, `IdentityTimestamp resolved_at` | 从正式来源解析结果创建 body-free snapshot |
| `unavailable(RoleCapabilitySourceRef source_ref, IdentityTimestamp checked_at)` | `RoleCapabilitySourceRef source_ref`, `IdentityTimestamp checked_at` | 构造来源不可用 snapshot |
| `unrecognized(RoleCapabilitySourceRef source_ref, IdentityTimestamp checked_at)` | `RoleCapabilitySourceRef source_ref`, `IdentityTimestamp checked_at` | 构造来源无法识别 snapshot |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不保存 method-library definition body | snapshot 只能保存 ref、version、state 和 safe summary marker |
| 不把 source state 写成第二套 method truth | 来源 truth 仍归 `L3-method-library` |
| 不用不可识别来源生成 accepted summary | 防止无源能力声明 |
| 不保存 evidence body | 证据正文归对应 evidence / artifact / governance 承载方 |

#### `RoleCapabilitySourcePolicy`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 角色能力摘要 |
| 功能来源 | `BR-ID-007`~`BR-ID-009`, `VETO-ID-003`, `AC-ID-003`, `AC-ID-008` |
| 对象类型 | Policy / Guard |
| 主要责任 | 校验角色能力摘要写入必须具备正式来源或证据,且不得携带定义正文、method body、自动评估算法正文或绩效推断 |
| 不承担什么 | 不解析外部协议、不评估能力等级、不替代 method-library 来源校验 |
| 后续承接 | Step 7 source/evidence resolver;Step 8 role capability precheck;Step 10 forbidden body / missing evidence rejected |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `member_ref` | `GlobalMemberRef` | 被维护摘要的成员 |
| `source_snapshot` | `RoleCapabilitySourceSnapshot` | 当前来源解析结果 |
| `evidence_refs` | `List<CapabilityEvidenceRef>` | 能力声明依据引用 |
| `change_reason_ref` | `RoleCapabilityChangeReasonRef` | 摘要变化原因引用 |
| `actor_ref` | `ActorRef` | 发起维护或受控来源的 actor |
| `operation_channel` | `IdentityOperationChannel` | 用于区分 command、source event、maintenance report 等入口 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| 本对象在概要层不单独定义状态集合 | policy 是校验对象,不保存长期状态 | 长期状态由 summary 和 source snapshot 承接 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `assert_member_exists(GlobalMemberRef member_ref)` | `GlobalMemberRef member_ref` | 校验摘要必须依附已建立的成员主语;具体读取面后移 Step 7 |
| `assert_source_or_evidence_present(RoleCapabilitySourceSnapshot snapshot, List<CapabilityEvidenceRef> evidence_refs)` | `RoleCapabilitySourceSnapshot snapshot`, `List<CapabilityEvidenceRef> evidence_refs` | 防止无来源 / 无证据能力声明 |
| `assert_source_usable(RoleCapabilitySourceSnapshot snapshot)` | `RoleCapabilitySourceSnapshot snapshot` | 来源 stale / unavailable / unrecognized 时阻止静默 accepted |
| `assert_no_forbidden_body(RoleCapabilityChangeMaterial change_material)` | `RoleCapabilityChangeMaterial change_material` | 防止 RoleDefinition body、method body、evidence body 或算法正文进入 identity |
| `assert_not_automatic_scoring(RoleCapabilityChangeMaterial change_material)` | `RoleCapabilityChangeMaterial change_material` | 防止将能力等级或绩效推断写成 identity truth |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `for_summary_update(GlobalMemberRef member_ref, RoleCapabilitySourceSnapshot source_snapshot, List<CapabilityEvidenceRef> evidence_refs, RoleCapabilityChangeReasonRef change_reason_ref, ActorRef actor_ref, IdentityOperationChannel operation_channel)` | `GlobalMemberRef member_ref`, `RoleCapabilitySourceSnapshot source_snapshot`, `List<CapabilityEvidenceRef> evidence_refs`, `RoleCapabilityChangeReasonRef change_reason_ref`, `ActorRef actor_ref`, `IdentityOperationChannel operation_channel` | 构造角色能力摘要维护 guard |
| `for_source_change(RoleCapabilitySummary current_summary, RoleCapabilitySourceSnapshot source_snapshot, IdentityOperationChannel operation_channel)` | `RoleCapabilitySummary current_summary`, `RoleCapabilitySourceSnapshot source_snapshot`, `IdentityOperationChannel operation_channel` | 构造来源变化处理 guard |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不允许缺来源 / 缺证据的能力声明 accepted | 违反 `BR-ID-008` |
| 不允许 definition body、method body、artifact body 进入 change material | 违反 `BR-ID-007` / `VETO-ID-003` |
| 不允许 identity 自动推断能力等级或绩效 | 违反 `BR-ID-009` |
| 不把维护对账作为直接修复来源 truth 的通道 | 对账只能报告或触发正式能力 |

#### 7.7.4 本批被并入 / 后移的候选

| 候选 | 处理 | 理由 | 后续位置 |
|---|---|---|---|
| `RoleCapabilitySourceState` | 并入 `RoleCapabilitySourceSnapshot.source_state` | 来源状态必须跟具体 snapshot / version 绑定,独立对象会制造第二来源 truth | 本批 `RoleCapabilitySourceSnapshot`;Step 9 source state |
| `RoleCapabilityView` | 并入 `MemberSummaryView` | 角色能力 view 是成员消费摘要的切片,不是独立 truth | 6-F `MemberSummaryView`;Step 7 query |
| `RoleCapabilityTraceRecord` | 后移到 trace / history 对象组 | 角色能力变化需要追溯,但 trace 是跨组成部分统一对象 | 6-F `IdentityTraceRecord`;Step 8/9 accepted trace |
| `RoleSourceRef` / `CapabilitySourceRef` / `CapabilityEvidenceRef` | 作为字段 / boundary ref | 它们是外部来源 / 证据引用类型,不是 identity-owned object | Step 7 resolver;`03` protocol contracts |

#### 7.7.5 本批停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 5 候选是否全部处理 | 通过 | 5 个显式候选和 role / capability source / evidence boundary refs 均已正式化、并入或后移 |
| 正式对象是否有功能来源 | 通过 | `RoleCapabilitySummary`、`RoleCapabilitySourceSnapshot`、`RoleCapabilitySourcePolicy` 均回指 `FR-ID-006~008` / `BR-ID-007~009` |
| 被并入 / 后移名称是否有理由 | 通过 | source state 并入 snapshot,view 并入 member summary,trace 后移统一 trace 组 |
| 是否越过组成部分边界 | 通过 | 未定义 RoleDefinition / CapabilityDefinition body、method body、ProjectMember role assignment 或能力评估算法 |
| 字段 / 函数是否保持概要粒度 | 通过 | 只写字段 / 类型 / 作用和函数参数骨架,未写完整 DTO、port、resolver、事务或状态矩阵 |
| Step 8 / Step 9 预期对象是否悬空 | 暂无悬空 | summary update、source change、stale / unavailable 分支可引用本批对象;trace 和 read view 已标注后续位置 |

### 7.8 6-D 身份生涯记录

#### 7.8.1 本批输入与目标

本批只处理 Step 5 §7.7 的候选对象,目标是收稳 identity-owned career append history、append-only policy、重复来源处理和 work truth 边界。生涯记录可以说明“某成员身份侧追加了某项目参与来源”,但不能反向定义 Project、WorkItem、ProjectMember 或任务事实。

| 输入 | 本批使用方式 |
|---|---|
| `FR-ID-009` 追加成员生涯记录 | `CareerRecord` 必须表达成员身份侧追加历史和来源引用 |
| `BR-ID-010` append-only 不变量 | `CareerAppendPolicy` 必须禁止改写、删除、重排已确认历史 |
| `BR-ID-011` work truth 边界 | 本批对象不得保存 Project / WorkItem / ProjectMember truth |
| `BR-ID-014` 追溯约束 | 生涯追加必须可追溯到安全可见来源、原因或 actor |
| `NFR-ID-006` / `NFR-ID-007` | 重复项目参与来源不得产生重复 history;纠错必须追加表达 |
| `AC-ID-004` / `AC-ID-009` | 必须能证明项目参与来源可追加、重复来源不会生成重复历史 |
| Step 5 §7.7 | 提供本批候选、功能、非职责和 work participation boundary 接缝 |

#### 7.8.2 候选处理结论

| 候选 | 处理结果 | 理由 | 后续反查 |
|---|---|---|---|
| `CareerRecord` | 正式关键对象 | 生涯是 identity-owned 身份侧追加历史,必须独立承接 project participation source 和长期身份叙事 | Step 7 career command/query;Step 8 append career flow;Step 9 career append state |
| `CareerAppendPolicy` | 正式关键对象 | 承接 append-only、重复来源、纠错追加和 work truth 边界,不能埋进 repository 或 job 逻辑 | Step 8 append precheck;Step 10 duplicate / overwrite rejected |
| `CareerSummaryView` | 并入后续 `MemberSummaryView` | 生涯摘要是成员消费摘要的读取切片,不是新的 truth owner | 6-F `MemberSummaryView`;Step 7 career query |
| `CareerTraceRecord` | 后移到 trace / history 对象组 | 生涯追加需要追溯,但 trace record 是跨组成部分统一对象 | 6-F `IdentityTraceRecord`;Step 8/9 career accepted trace |
| `ProjectParticipationRef` / `WorkSourceRef` | 作为字段 / boundary ref | 它们是指向 work 的来源引用,不是 identity-owned object | Step 7 work participation resolver;`03` source contract |

#### 7.8.3 关键对象索引

| 对象 | 所属组成部分 | 对象类型 | 功能来源 | 主要责任 |
|---|---|---|---|---|
| `CareerRecord` | 身份生涯记录 | Truth / History | `FR-ID-009`, `BR-ID-010`, `BR-ID-011`, `AC-ID-009` | 追加记录成员身份侧生涯历史和 work 来源引用 |
| `CareerAppendPolicy` | 身份生涯记录 | Policy / Guard | `BR-ID-010`, `BR-ID-011`, `NFR-ID-006`, `NFR-ID-007` | 校验生涯追加必须来源可信、幂等安全且不改写既有历史 |

#### `CareerRecord`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 身份生涯记录 |
| 功能来源 | `FR-ID-009`, `BR-ID-010`, `BR-ID-011`, `BR-ID-014`, `AC-ID-009` |
| 对象类型 | Truth / History |
| 主要责任 | 承载成员身份侧生涯追加历史,记录可追溯的 work participation 来源、摘要 marker、追加原因和 actor |
| 不承担什么 | 不拥有 Project、WorkItem、ProjectMember truth,不改写已确认历史,不保存项目正文或任务正文 |
| 后续承接 | Step 7 career append command/query;Step 8 append career flow;Step 9 career append state;Step 10 duplicate / forbidden overwrite;`03` 完整 object contract |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `career_record_ref` | `CareerRecordRef` | 生涯记录身份 |
| `member_ref` | `GlobalMemberRef` | 生涯记录所属成员 |
| `project_participation_ref` | `ProjectParticipationRef` | 指向 work 的项目参与来源引用,不得承载项目 truth |
| `work_source_ref` | `WorkSourceRef` | 追加来源或来源交付引用 |
| `source_marker_ref` | `CareerSourceMarkerRef` | 幂等和重复来源识别 marker |
| `career_summary_ref` | `CareerSafeSummaryRef` | 安全可见的生涯摘要 marker |
| `append_reason_ref` | `CareerAppendReasonRef` | 追加原因引用 |
| `appended_by_ref` | `ActorRef` | 发起追加或受控来源 actor |
| `appended_at` | `IdentityTimestamp` | 生涯记录追加时间 |
| `record_state` | `CareerRecordState` | 当前记录在追加历史中的语义状态 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| `Appended` | 正常追加的生涯记录 | 不允许原地修改为其他项目事实 |
| `CorrectionAppended` | 以新记录表达对既有历史的纠错 | 纠错仍是追加,不是覆盖旧记录 |
| `SupersededByCorrection` | 旧记录被后续纠错记录标记为解释上被替代 | 只能通过追加关系表达,不得删除旧记录 |
| `SourcePendingReview` | 来源可信性或映射需复核 | 不得直接反写 work truth |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `is_append_only()` | 无 | 表达记录不可原地改写、删除或重排 |
| `matches_source_marker(CareerSourceMarkerRef source_marker_ref)` | `CareerSourceMarkerRef source_marker_ref` | 判断是否来自同一幂等来源 |
| `append_correction(CareerRecordRef correction_record_ref, CareerAppendReasonRef reason_ref, ActorRef actor_ref, IdentityTimestamp appended_at)` | `CareerRecordRef correction_record_ref`, `CareerAppendReasonRef reason_ref`, `ActorRef actor_ref`, `IdentityTimestamp appended_at` | 通过新记录表达纠错关系 |
| `mark_source_pending_review(WorkSourceRef work_source_ref, IdentityTimestamp checked_at)` | `WorkSourceRef work_source_ref`, `IdentityTimestamp checked_at` | 来源待复核时标记记录状态 |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `append_from_work_source(GlobalMemberRef member_ref, ProjectParticipationRef project_participation_ref, WorkSourceRef work_source_ref, CareerSourceMarkerRef source_marker_ref, CareerSafeSummaryRef career_summary_ref, CareerAppendReasonRef append_reason_ref, ActorRef actor_ref, IdentityTimestamp appended_at)` | `GlobalMemberRef member_ref`, `ProjectParticipationRef project_participation_ref`, `WorkSourceRef work_source_ref`, `CareerSourceMarkerRef source_marker_ref`, `CareerSafeSummaryRef career_summary_ref`, `CareerAppendReasonRef append_reason_ref`, `ActorRef actor_ref`, `IdentityTimestamp appended_at` | 从可信 work participation 来源创建生涯追加记录 |
| `correction_for_record(CareerRecordRef original_record_ref, GlobalMemberRef member_ref, WorkSourceRef work_source_ref, CareerSafeSummaryRef career_summary_ref, CareerAppendReasonRef append_reason_ref, ActorRef actor_ref, IdentityTimestamp appended_at)` | `CareerRecordRef original_record_ref`, `GlobalMemberRef member_ref`, `WorkSourceRef work_source_ref`, `CareerSafeSummaryRef career_summary_ref`, `CareerAppendReasonRef append_reason_ref`, `ActorRef actor_ref`, `IdentityTimestamp appended_at` | 为既有记录创建追加式纠错记录 |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不原地修改、删除或重排已确认记录 | 违反 `BR-ID-010` 和 append-only 机制 |
| 不保存 Project、WorkItem、ProjectMember truth | work 拥有项目参与和项目内承担事实 |
| 不从项目私有字段推导成员身份 | 成员主语必须来自 `GlobalMemberRef` |
| 不保存项目正文、任务正文或外部 artifact body | 这些正文不属于 identity truth |
| 不用维护对账任务直接修复 work 来源事实 | 对账只能报告或触发正式来源能力 |

#### `CareerAppendPolicy`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 身份生涯记录 |
| 功能来源 | `BR-ID-010`, `BR-ID-011`, `NFR-ID-006`, `NFR-ID-007`, `AC-ID-009` |
| 对象类型 | Policy / Guard |
| 主要责任 | 校验生涯追加必须依附成员主语和可信 work 来源,重复来源不能新增重复历史,纠错必须以追加方式表达 |
| 不承担什么 | 不验证 work 内部 truth 细节、不查询 ProjectMember body、不负责跨仓修复 |
| 后续承接 | Step 7 work participation resolver;Step 8 career append precheck;Step 10 duplicate source / overwrite rejected;`03` 完整 policy contract |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `member_ref` | `GlobalMemberRef` | 被追加生涯的成员 |
| `project_participation_ref` | `ProjectParticipationRef` | work participation 来源引用 |
| `work_source_ref` | `WorkSourceRef` | 来源交付或来源摘要引用 |
| `source_marker_ref` | `CareerSourceMarkerRef` | 幂等和重复来源检测 marker |
| `append_reason_ref` | `CareerAppendReasonRef` | 追加原因 |
| `actor_ref` | `ActorRef` | 发起追加的 actor 或受控来源 |
| `operation_channel` | `IdentityOperationChannel` | 区分受控 command、source event、maintenance report 等入口 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| 本对象在概要层不单独定义状态集合 | policy 是校验对象,不保存长期状态 | 长期状态由 `CareerRecord` 和后续 trace / projection 承接 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `assert_member_exists(GlobalMemberRef member_ref)` | `GlobalMemberRef member_ref` | 校验生涯必须依附已建立成员主语;具体读取面后移 Step 7 |
| `assert_source_trusted(ProjectParticipationRef project_participation_ref, WorkSourceRef work_source_ref)` | `ProjectParticipationRef project_participation_ref`, `WorkSourceRef work_source_ref` | 校验来源来自正式 work participation boundary |
| `assert_not_duplicate(CareerSourceMarkerRef source_marker_ref, List<CareerRecordRef> existing_records)` | `CareerSourceMarkerRef source_marker_ref`, `List<CareerRecordRef> existing_records` | 防止重复来源生成重复生涯历史 |
| `assert_append_only(CareerRecordChangeIntent change_intent)` | `CareerRecordChangeIntent change_intent` | 禁止更新、删除、重排已确认记录 |
| `assert_not_work_truth_write(CareerAppendMaterial append_material)` | `CareerAppendMaterial append_material` | 防止把 Project / WorkItem / ProjectMember truth 写入 identity |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `for_append(GlobalMemberRef member_ref, ProjectParticipationRef project_participation_ref, WorkSourceRef work_source_ref, CareerSourceMarkerRef source_marker_ref, CareerAppendReasonRef append_reason_ref, ActorRef actor_ref, IdentityOperationChannel operation_channel)` | `GlobalMemberRef member_ref`, `ProjectParticipationRef project_participation_ref`, `WorkSourceRef work_source_ref`, `CareerSourceMarkerRef source_marker_ref`, `CareerAppendReasonRef append_reason_ref`, `ActorRef actor_ref`, `IdentityOperationChannel operation_channel` | 构造普通生涯追加 guard |
| `for_correction(CareerRecordRef original_record_ref, GlobalMemberRef member_ref, WorkSourceRef work_source_ref, CareerAppendReasonRef append_reason_ref, ActorRef actor_ref)` | `CareerRecordRef original_record_ref`, `GlobalMemberRef member_ref`, `WorkSourceRef work_source_ref`, `CareerAppendReasonRef append_reason_ref`, `ActorRef actor_ref` | 构造追加式纠错 guard |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不允许 update / delete / reorder 已确认 career record | 生涯历史必须 append-only |
| 不允许重复来源生成重复 history | 违反幂等 / 重放安全 |
| 不允许 identity 反向定义 ProjectMember 或项目事实 | 违反 `BR-ID-011` |
| 不允许后台维护任务静默追加无来源记录 | 追加必须有可信来源、actor 或 reason |

#### 7.8.4 本批被并入 / 后移的候选

| 候选 | 处理 | 理由 | 后续位置 |
|---|---|---|---|
| `CareerSummaryView` | 并入 `MemberSummaryView` | 生涯摘要是成员消费摘要的读取切片,不是独立 truth | 6-F `MemberSummaryView`;Step 7 query |
| `CareerTraceRecord` | 后移到 trace / history 对象组 | 生涯追加需要追溯,但 trace 是跨组成部分统一对象 | 6-F `IdentityTraceRecord`;Step 8/9 accepted trace |
| `ProjectParticipationRef` / `WorkSourceRef` | 作为字段 / boundary ref | 它们是 work 来源引用,不是 identity-owned object | Step 7 work source resolver;`03` protocol contracts |
| `Project` / `WorkItem` / `ProjectMember` | 排除 | 这些是 `L1-work` truth 或正文,不能进入 identity 对象轮廓 | 边界外;只通过 refs / source summary 协作 |

#### 7.8.5 本批停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 5 候选是否全部处理 | 通过 | 4 个显式候选和 work boundary refs 均已正式化、并入、后移或排除 |
| 正式对象是否有功能来源 | 通过 | `CareerRecord`、`CareerAppendPolicy` 均回指 `FR-ID-009` / `BR-ID-010~011` |
| 被并入 / 后移 / 排除名称是否有理由 | 通过 | summary view 并入 member summary,trace 后移统一 trace 组,work refs 作为 boundary refs,work truth 排除 |
| 是否越过组成部分边界 | 通过 | 未定义 Project、WorkItem、ProjectMember truth 或 work protocol schema |
| 字段 / 函数是否保持概要粒度 | 通过 | 只写字段 / 类型 / 作用和函数参数骨架,未写 repository、resolver、事务、DDL 或完整状态矩阵 |
| Step 8 / Step 9 预期对象是否悬空 | 暂无悬空 | append career、duplicate source、correction append 分支可引用本批对象;trace 和 read view 已标注后续位置 |

### 7.9 6-E 记忆引用关系

#### 7.9.1 本批输入与目标

本批只处理 Step 5 §7.8 的候选对象,目标是收稳成员与外部 memory / archive refs 的身份侧关系、引用状态、迁移 / 冷存 marker 和正文排除边界。记忆引用关系可以说明“某成员关联了某个外部记忆或归档引用”,但不能保存 memory 原文、embedding、检索索引、artifact body、conversation body 或 archive package。

| 输入 | 本批使用方式 |
|---|---|
| `FR-ID-010` 保存成员相关 memory refs | `MemoryReference` 必须表达成员与外部 memory ref 的身份侧关系 |
| `FR-ID-011` 支持记忆引用迁移或冷存协作 | `MemoryReferenceState` 必须表达 migrated / archived / handoff pending / failed 等迁移结果方向 |
| `BR-ID-012` forbidden body | `MemoryReferencePolicy` 必须阻止正文、embedding、index、archive package 进入 identity |
| `BR-ID-014` 追溯约束 | memory ref 关联、状态刷新和迁移 / 冷存变化必须可追溯到安全可见来源、原因或 actor |
| `AC-ID-004` / `AC-ID-010` | 必须能证明 memory ref 可维护、迁移只记录引用状态且不保存原文或向量 |
| `VETO-ID-003` | 保存 memory / artifact / conversation / runtime 正文为 0 容忍 |
| `OQ-ID-003` / `R-ID-003` | memory refs 的承载方和迁移结果 surface 未完全闭口,本批只能保留 ref / marker,不预设外部 receipt schema |
| Step 5 §7.8 | 提供本批候选、功能、非职责和 memory / archive boundary 接缝 |

#### 7.9.2 候选处理结论

| 候选 | 处理结果 | 理由 | 后续反查 |
|---|---|---|---|
| `MemoryReference` | 正式关键对象 | 成员与外部 memory / archive ref 的身份侧关系属于 identity-owned reference truth,必须独立承接关联、刷新和迁移状态 | Step 7 memory ref command/query;Step 8 link / refresh / migrate flow;Step 9 reference state |
| `MemoryReferenceState` | 正式关键对象 | 引用可能 pending、linked、stale、unavailable、migrated、archived 或 handoff failed,状态语义不能埋入普通字段 | Step 8 refresh / handoff result flow;Step 9 reference state machine |
| `MemoryReferencePolicy` | 正式关键对象 | 承接 member existence、source trust、forbidden body、migration marker body-free 等不变量 | Step 8 precheck;Step 10 forbidden body / unresolved ref rejected |
| `MemoryReferenceView` | 并入后续 `MemberSummaryView` | 它是成员摘要中的 memory ref 可见切片,不是新的 truth owner | 6-F `MemberSummaryView`;Step 7 memory ref query |
| `MemoryReferenceTraceRecord` | 后移到 trace / history 对象组 | memory ref 变化必须追溯,但 trace record 是跨组成部分统一对象 | 6-F `IdentityTraceRecord`;Step 8/9 accepted trace |
| `MemoryRef` / `ArchiveRef` / `ArchiveHandoffRef` | 作为字段 / boundary marker | 它们是外部 memory / archive 承载方引用或交接 marker,不是 identity-owned object | Step 7 memory / archive boundary;`03/04` handoff / config schema |

#### 7.9.3 关键对象索引

| 对象 | 所属组成部分 | 对象类型 | 功能来源 | 主要责任 |
|---|---|---|---|---|
| `MemoryReference` | 记忆引用关系 | Truth / Reference relation | `FR-ID-010`, `FR-ID-011`, `BR-ID-012`, `AC-ID-010` | 保存成员与外部 memory / archive refs 的身份侧关系和安全状态 |
| `MemoryReferenceState` | 记忆引用关系 | State value | `FR-ID-010`, `FR-ID-011`, `AC-ID-004`, `AC-ID-010` | 表达 memory / archive 引用解析、迁移、冷存和 handoff 结果方向 |
| `MemoryReferencePolicy` | 记忆引用关系 | Policy / Guard | `BR-ID-012`, `BR-ID-014`, `VETO-ID-003`, `NFR-ID-004` | 防止无成员、无来源、正文泄漏或 archive package 泄漏的引用变化被 accepted |

#### `MemoryReference`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 记忆引用关系 |
| 功能来源 | `FR-ID-010`, `FR-ID-011`, `BR-ID-012`, `BR-ID-014`, `AC-ID-010` |
| 对象类型 | Truth / Reference relation |
| 主要责任 | 承载成员与外部 memory / archive refs 的身份侧关系,记录引用状态、来源、迁移 / 冷存 marker 和变化原因 |
| 不承担什么 | 不保存 memory 原文、embedding、检索索引、archive package、artifact body、conversation body 或外部承载方内部 truth |
| 后续承接 | Step 7 memory ref command/query;Step 8 link / refresh / migrate flow;Step 9 reference state;Step 10 forbidden body;`03` 完整 object contract |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `memory_reference_ref` | `MemoryReferenceRef` | 成员记忆引用关系身份 |
| `member_ref` | `GlobalMemberRef` | 引用关系所属成员 |
| `memory_ref` | `Option<MemoryRef>` | 外部 memory 承载方引用,不得承载正文 |
| `archive_ref` | `Option<ArchiveRef>` | 外部 archive / cold storage 引用,不得承载 package |
| `archive_handoff_ref` | `Option<ArchiveHandoffRef>` | 迁移、冷存或 handoff 协作 marker |
| `source_ref` | `MemoryReferenceSourceRef` | 引用关系来源或来源交付引用 |
| `reference_state` | `MemoryReferenceState` | 当前引用解析、迁移或 handoff 状态 |
| `change_reason_ref` | `MemoryReferenceReasonRef` | 关联、刷新、迁移或冷存变化原因 |
| `changed_by_ref` | `ActorRef` | 最近一次改变引用关系的 actor 或受控来源 |
| `changed_at` | `IdentityTimestamp` | 最近一次引用关系变化时间 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| 本对象不单独定义状态枚举 | 状态由 `MemoryReferenceState` 承接 | 避免字段状态和独立状态对象重复 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `belongs_to(GlobalMemberRef member_ref)` | `GlobalMemberRef member_ref` | 判断引用关系是否属于指定成员 |
| `link_memory_ref(MemoryRef memory_ref, MemoryReferenceSourceRef source_ref, MemoryReferenceReasonRef reason_ref, ActorRef actor_ref, IdentityTimestamp changed_at)` | `MemoryRef memory_ref`, `MemoryReferenceSourceRef source_ref`, `MemoryReferenceReasonRef reason_ref`, `ActorRef actor_ref`, `IdentityTimestamp changed_at` | 在 policy 已通过时关联或更新 memory ref |
| `attach_archive_ref(ArchiveRef archive_ref, ArchiveHandoffRef archive_handoff_ref, MemoryReferenceReasonRef reason_ref, ActorRef actor_ref, IdentityTimestamp changed_at)` | `ArchiveRef archive_ref`, `ArchiveHandoffRef archive_handoff_ref`, `MemoryReferenceReasonRef reason_ref`, `ActorRef actor_ref`, `IdentityTimestamp changed_at` | 记录迁移 / 冷存后的 archive 引用和 handoff marker |
| `update_reference_state(MemoryReferenceState reference_state, MemoryReferenceReasonRef reason_ref, ActorRef actor_ref, IdentityTimestamp changed_at)` | `MemoryReferenceState reference_state`, `MemoryReferenceReasonRef reason_ref`, `ActorRef actor_ref`, `IdentityTimestamp changed_at` | 更新引用解析、stale、unavailable、migrated 或 handoff 状态 |
| `has_external_body()` | 无 | 概要层表达正文检测入口;具体 material schema 后移 Step 7 / `03` |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `link_for_member(GlobalMemberRef member_ref, MemoryRef memory_ref, MemoryReferenceSourceRef source_ref, MemoryReferenceReasonRef reason_ref, ActorRef actor_ref, IdentityTimestamp changed_at)` | `GlobalMemberRef member_ref`, `MemoryRef memory_ref`, `MemoryReferenceSourceRef source_ref`, `MemoryReferenceReasonRef reason_ref`, `ActorRef actor_ref`, `IdentityTimestamp changed_at` | 从受控 memory ref 关联意图创建成员记忆引用关系 |
| `from_archive_handoff(GlobalMemberRef member_ref, ArchiveRef archive_ref, ArchiveHandoffRef archive_handoff_ref, MemoryReferenceReasonRef reason_ref, ActorRef actor_ref, IdentityTimestamp changed_at)` | `GlobalMemberRef member_ref`, `ArchiveRef archive_ref`, `ArchiveHandoffRef archive_handoff_ref`, `MemoryReferenceReasonRef reason_ref`, `ActorRef actor_ref`, `IdentityTimestamp changed_at` | 从归档 / 冷存协作结果创建或更新引用关系骨架 |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不保存 memory 原文、embedding、检索索引 | 违反 `BR-ID-012` 和 `VETO-ID-003` |
| 不保存 archive package、artifact body、conversation body | 外部正文和包体属于相邻承载方 |
| 不把 memory / archive carrier 内部 truth 写成本对象字段 | identity 只拥有成员关联关系和状态 |
| 不预设 handoff receipt schema 或外部 target 类型 | `OQ-ID-003` 仍要求后续 `03/04` 闭口 |
| 不用不可解析 ref 静默生成 active 关系 | 外部来源必须经正式 boundary 或进入 pending / rejected / report-only |

#### `MemoryReferenceState`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 记忆引用关系 |
| 功能来源 | `FR-ID-010`, `FR-ID-011`, `AC-ID-004`, `AC-ID-010`, `R-ID-003` |
| 对象类型 | State value |
| 主要责任 | 表达 memory / archive 引用在身份侧的解析、可用性、迁移、冷存和 handoff 结果方向 |
| 不承担什么 | 不表达外部 memory 正文状态全集、不保存 archive package 元数据、不替代外部承载方状态机 |
| 后续承接 | Step 8 refresh / migration flow;Step 9 reference state machine;Step 10 stale / unavailable;`03` 完整 state matrix |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `state_kind` | `MemoryReferenceStateKind` | 引用状态类别 |
| `memory_ref` | `Option<MemoryRef>` | 当前状态关联的 memory ref |
| `archive_ref` | `Option<ArchiveRef>` | 当前状态关联的 archive ref |
| `handoff_ref` | `Option<ArchiveHandoffRef>` | 当前状态关联的 migration / handoff marker |
| `reason_ref` | `Option<MemoryReferenceReasonRef>` | 状态变化原因 |
| `checked_at` | `IdentityTimestamp` | 最近一次刷新、检查或迁移状态确认时间 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| `Linked` | memory ref 已与成员建立身份侧关系 | 不代表正文在 identity 内可读 |
| `PendingVerification` | 引用已收到但来源或承载状态仍需确认 | 后续 flow 决定 accepted / rejected / report-only |
| `Stale` | 外部引用状态或版本可能过期 | 不得用作最新事实静默传播 |
| `Unavailable` | 外部 memory / archive 承载方不可用或无法解析 | 读取可降级,写入必须按 policy 处理 |
| `Migrated` | 引用已迁移到新 memory 或 archive ref | 只记录新 ref / marker,不保存迁移正文 |
| `Archived` | 引用已进入冷存或归档关系 | 只记录 archive ref / handoff marker |
| `HandoffPending` | 迁移 / 冷存 handoff 已发起但结果未确认 | 不伪造成 completed |
| `HandoffFailed` | handoff 失败或需要人工 / 后台复核 | 后续重试和诊断由 Step 8/10/03 细化 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `is_usable_for_summary()` | 无 | 判断该状态是否可进入成员可见摘要 |
| `requires_refresh()` | 无 | 判断是否需要刷新或对账 |
| `is_handoff_terminal()` | 无 | 判断 handoff 是否已进入完成或失败终态候选 |
| `mark_stale(MemoryReferenceReasonRef reason_ref, IdentityTimestamp checked_at)` | `MemoryReferenceReasonRef reason_ref`, `IdentityTimestamp checked_at` | 标记引用过期或需刷新 |
| `mark_unavailable(MemoryReferenceReasonRef reason_ref, IdentityTimestamp checked_at)` | `MemoryReferenceReasonRef reason_ref`, `IdentityTimestamp checked_at` | 标记外部承载方不可用 |
| `mark_migrated(MemoryRef memory_ref, ArchiveRef archive_ref, ArchiveHandoffRef handoff_ref, IdentityTimestamp checked_at)` | `MemoryRef memory_ref`, `ArchiveRef archive_ref`, `ArchiveHandoffRef handoff_ref`, `IdentityTimestamp checked_at` | 标记迁移或冷存结果 |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `linked(MemoryRef memory_ref, IdentityTimestamp checked_at)` | `MemoryRef memory_ref`, `IdentityTimestamp checked_at` | 创建已关联状态 |
| `pending_verification(MemoryRef memory_ref, MemoryReferenceReasonRef reason_ref, IdentityTimestamp checked_at)` | `MemoryRef memory_ref`, `MemoryReferenceReasonRef reason_ref`, `IdentityTimestamp checked_at` | 创建待确认状态 |
| `archived(ArchiveRef archive_ref, ArchiveHandoffRef handoff_ref, IdentityTimestamp checked_at)` | `ArchiveRef archive_ref`, `ArchiveHandoffRef handoff_ref`, `IdentityTimestamp checked_at` | 创建归档 / 冷存状态 |
| `handoff_failed(ArchiveHandoffRef handoff_ref, MemoryReferenceReasonRef reason_ref, IdentityTimestamp checked_at)` | `ArchiveHandoffRef handoff_ref`, `MemoryReferenceReasonRef reason_ref`, `IdentityTimestamp checked_at` | 创建 handoff 失败状态 |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不把外部承载方完整状态机复制进 identity | 本对象只表达身份侧引用状态 |
| 不用 `Unavailable` 或 `Stale` 自动修复外部 truth | 维护 / 对账不能反写 memory / archive |
| 不将 `HandoffPending` 当作归档成功 | 防止伪造 handoff 成功 |
| 不在状态中保存 archive package metadata | 仍属于 forbidden body / package 边界 |

#### `MemoryReferencePolicy`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 记忆引用关系 |
| 功能来源 | `FR-ID-010`, `FR-ID-011`, `BR-ID-012`, `BR-ID-014`, `VETO-ID-003` |
| 对象类型 | Policy / Guard |
| 主要责任 | 校验 memory ref 关联、刷新、迁移和冷存协作必须依附成员主语、正式来源和 body-free 引用材料 |
| 不承担什么 | 不调用外部 memory / archive adapter、不解析正文、不生成 migration receipt、不决定长期归档策略 |
| 后续承接 | Step 7 memory / archive boundary;Step 8 link / refresh / migrate precheck;Step 10 forbidden body / missing source rejected;`03` policy contract |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `member_ref` | `GlobalMemberRef` | 被维护引用关系的成员 |
| `memory_ref` | `Option<MemoryRef>` | 待关联或刷新 memory ref |
| `archive_ref` | `Option<ArchiveRef>` | 待记录或校验 archive ref |
| `archive_handoff_ref` | `Option<ArchiveHandoffRef>` | 迁移 / 冷存 handoff marker |
| `source_ref` | `MemoryReferenceSourceRef` | 来源或协作结果引用 |
| `reason_ref` | `MemoryReferenceReasonRef` | 本次引用变化原因 |
| `actor_ref` | `ActorRef` | 发起变化的 actor 或受控来源 |
| `operation_channel` | `IdentityOperationChannel` | 区分 command、source event、handoff callback、maintenance report 等入口 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| 本对象在概要层不单独定义状态集合 | policy 是校验对象,不保存长期状态 | 长期状态由 `MemoryReference` / `MemoryReferenceState` 承接 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `assert_member_exists(GlobalMemberRef member_ref)` | `GlobalMemberRef member_ref` | 校验 memory ref 关系必须依附已建立成员主语;具体读取面后移 Step 7 |
| `assert_reference_present(Option<MemoryRef> memory_ref, Option<ArchiveRef> archive_ref)` | `Option<MemoryRef> memory_ref`, `Option<ArchiveRef> archive_ref` | 防止没有任何外部 ref 的关系变化 accepted |
| `assert_source_trusted(MemoryReferenceSourceRef source_ref)` | `MemoryReferenceSourceRef source_ref` | 校验来源来自正式 memory / archive boundary 或受控 command |
| `assert_body_free(MemoryReferenceChangeMaterial change_material)` | `MemoryReferenceChangeMaterial change_material` | 防止 memory 原文、embedding、index、artifact body 或 package 泄漏 |
| `assert_handoff_marker_body_free(ArchiveHandoffRef archive_handoff_ref)` | `ArchiveHandoffRef archive_handoff_ref` | 校验 handoff marker 只表达交接引用,不携带 package |
| `assert_not_external_owner_write(MemoryReferenceChangeMaterial change_material)` | `MemoryReferenceChangeMaterial change_material` | 防止 identity 反向写入 memory / archive owner truth |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `for_link(GlobalMemberRef member_ref, MemoryRef memory_ref, MemoryReferenceSourceRef source_ref, MemoryReferenceReasonRef reason_ref, ActorRef actor_ref, IdentityOperationChannel operation_channel)` | `GlobalMemberRef member_ref`, `MemoryRef memory_ref`, `MemoryReferenceSourceRef source_ref`, `MemoryReferenceReasonRef reason_ref`, `ActorRef actor_ref`, `IdentityOperationChannel operation_channel` | 构造 memory ref 关联 guard |
| `for_refresh(GlobalMemberRef member_ref, MemoryReferenceRef memory_reference_ref, MemoryReferenceSourceRef source_ref, ActorRef actor_ref, IdentityOperationChannel operation_channel)` | `GlobalMemberRef member_ref`, `MemoryReferenceRef memory_reference_ref`, `MemoryReferenceSourceRef source_ref`, `ActorRef actor_ref`, `IdentityOperationChannel operation_channel` | 构造引用状态刷新 guard |
| `for_archive_handoff(GlobalMemberRef member_ref, ArchiveRef archive_ref, ArchiveHandoffRef archive_handoff_ref, MemoryReferenceSourceRef source_ref, MemoryReferenceReasonRef reason_ref, ActorRef actor_ref)` | `GlobalMemberRef member_ref`, `ArchiveRef archive_ref`, `ArchiveHandoffRef archive_handoff_ref`, `MemoryReferenceSourceRef source_ref`, `MemoryReferenceReasonRef reason_ref`, `ActorRef actor_ref` | 构造迁移 / 冷存 handoff 结果 guard |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不允许带 memory body、embedding、index、artifact body 的 material accepted | 违反 `BR-ID-012` / `VETO-ID-003` |
| 不允许带 archive package 或 package metadata 的 handoff marker accepted | identity 只保存 ref / marker |
| 不允许缺成员、缺来源、缺 ref 的关系变化 accepted | 防止无主语或无来源引用污染 identity truth |
| 不允许 maintenance report 直接修复 memory / archive owner truth | 对账只能报告或触发正式边界能力 |
| 不在 policy 中硬编码外部 carrier target schema | carrier / target / receipt surface 后移 `03/04` |

#### 7.9.4 本批被并入 / 后移的候选

| 候选 | 处理 | 理由 | 后续位置 |
|---|---|---|---|
| `MemoryReferenceView` | 并入 `MemberSummaryView` | memory ref 可见摘要是成员消费摘要切片,不是独立 truth | 6-F `MemberSummaryView`;Step 7 query |
| `MemoryReferenceTraceRecord` | 后移到 trace / history 对象组 | memory ref 关联、刷新、迁移和 handoff 变化需要追溯,但 trace 是跨组成部分统一对象 | 6-F `IdentityTraceRecord`;Step 8/9 accepted trace |
| `MemoryRef` / `ArchiveRef` / `ArchiveHandoffRef` | 作为字段 / boundary marker | 它们指向外部承载方或交接 marker,不拥有 identity 内部 truth | Step 7 memory / archive boundary;`03/04` protocol / config |
| memory body / embedding / index / archive package | 排除 | 这些是 forbidden body 或外部包体,不得进入 identity 对象轮廓 | 边界外;只通过 refs / marker / safe summary 协作 |

#### 7.9.5 本批停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 5 候选是否全部处理 | 通过 | 5 个显式候选和 memory / archive boundary refs 均已正式化、并入、后移或作为边界 marker |
| 正式对象是否有功能来源 | 通过 | `MemoryReference`、`MemoryReferenceState`、`MemoryReferencePolicy` 均回指 `FR-ID-010~011` / `BR-ID-012` |
| 被并入 / 后移 / 排除名称是否有理由 | 通过 | view 并入 member summary,trace 后移统一 trace 组,refs 作为 boundary marker,正文和 package 排除 |
| 是否越过组成部分边界 | 通过 | 未定义 memory / archive carrier truth、handoff receipt schema、archive package 或正文存储 |
| 字段 / 函数是否保持概要粒度 | 通过 | 只写字段 / 类型 / 作用和函数参数骨架,未写 port、repository、DTO、事务、DDL 或完整状态矩阵 |
| Step 8 / Step 9 预期对象是否悬空 | 暂无悬空 | link / refresh / migrate / archive handoff 分支可引用本批对象;trace 和 read view 已标注后续位置 |

### 7.10 6-F 身份事实消费与追溯

#### 7.10.1 本批输入与目标

本批只处理 Step 5 §7.9 的候选对象,目标是收稳成员身份事实的只读消费摘要、变化追溯、trace / audit / history 读取和 visibility 裁剪边界。消费与追溯可以读取和展示 accepted identity facts 的安全摘要,但不得创建、修复、刷新或反写 identity truth,也不得泄漏外部正文。

| 输入 | 本批使用方式 |
|---|---|
| `FR-ID-012` 身份事实消费边界 | `MemberSummaryView` 必须表达可供相邻仓读取 / 订阅的成员摘要视图 |
| `FR-ID-013` 身份变化追溯 | `IdentityTraceRecord` 和 `AuditTrail` 必须表达身份变化、角色能力变化、生涯追加和 memory ref 变化的追溯 material |
| `BR-ID-013` 消费边界 | `VisibilityPolicy` 必须防止 consumer 越权读取或反写 identity truth |
| `BR-ID-014` 审计约束 | trace / audit 必须保留安全可见原因、来源、actor、basis 或 marker |
| `AC-ID-005` | 必须能证明相邻仓可消费身份事实,身份变化可追溯,维护对账不修复相邻仓 truth |
| `OQ-ID-004` | 字段级 visibility / privacy 裁剪未完全闭口,本批只定义概要 policy 和 view 边界 |
| Step 3 query no-write / visibility 约束 | 读取、projection、trace view 不得隐式创建、刷新或修复 truth;不可见内容不得通过 debug / trace / report 泄漏 |
| Step 5 §7.9 | 提供本批候选、功能、非职责和 consumption / trace 接缝 |

#### 7.10.2 候选处理结论

| 候选 | 处理结果 | 理由 | 后续反查 |
|---|---|---|---|
| `MemberSummaryView` | 正式关键对象 | 汇聚成员锚定、生命周期、角色能力、生涯和 memory ref 的可见摘要,是消费边界的主要 read model | Step 7 query API;Step 8 read member summary flow;Step 10 not visible / degraded |
| `IdentityTraceRecord` | 正式关键对象 | 承接 accepted identity fact 变化追溯,前序 6-A~6-E 的 trace 候选均归并到此对象组 | Step 7 trace query;Step 8 accepted change trace;Step 9 trace append semantics |
| `AuditTrail` | 正式关键对象 | 将多个 trace / audit entries 组织为可审计时间线,用于审计读取和复盘 | Step 7 audit query;Step 8 read trace / audit flow;`03` audit schema |
| `VisibilityPolicy` | 正式关键对象 | 承接 consumer / actor / visibility context 的可见性裁剪和正文排除 guard | Step 7 query metadata;Step 8 read guard;Step 10 not visible / redacted |
| `IdentityTraceView` | 并入 `AuditTrail` / query view | 它是 trace / audit 的读取投影,不是独立 truth 或独立追溯 material owner | 本批 `AuditTrail`;Step 7 trace query DTO |
| `AuditEntry` | 并入 `AuditTrail.entries` | 单条 audit entry 是 audit trail 的组成字段,不单独作为概要关键对象展开 | 本批 `AuditTrail`;`03` entry schema |
| `HistoryRecord` | 并入 `IdentityTraceRecord` 对象组 | 历史记录语义与 accepted fact trace 高度重叠,本步统一为 trace record,避免第二套 history truth | 本批 `IdentityTraceRecord`;Step 8/9 trace append |
| `ConsumerRef` / `VisibilityContextRef` | 作为字段 / boundary ref | 它们是消费方和可见性上下文引用,不是 identity-owned truth object | Step 7 query metadata;`03` visibility contract |

#### 7.10.3 关键对象索引

| 对象 | 所属组成部分 | 对象类型 | 功能来源 | 主要责任 |
|---|---|---|---|---|
| `MemberSummaryView` | 身份事实消费与追溯 | Projection / Read model | `FR-ID-012`, `BR-ID-013`, `AC-ID-005` | 提供按 visibility 裁剪后的成员身份事实消费摘要 |
| `IdentityTraceRecord` | 身份事实消费与追溯 | Trace / History record | `FR-ID-013`, `BR-ID-014`, `NFR-ID-005` | 追加记录 accepted identity fact 的安全追溯 material |
| `AuditTrail` | 身份事实消费与追溯 | Audit / History aggregate | `FR-ID-013`, `BR-ID-014`, `AC-ID-005` | 将成员相关 trace / audit entries 组织为可审计时间线 |
| `VisibilityPolicy` | 身份事实消费与追溯 | Policy / Guard | `BR-ID-013`, `OQ-ID-004`, `NFR-ID-004` | 校验 query / trace / event 可见性,防止正文和不可见字段泄漏 |

#### `MemberSummaryView`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 身份事实消费与追溯 |
| 功能来源 | `FR-ID-002`, `FR-ID-004`, `FR-ID-006`~`FR-ID-013`, `BR-ID-013`, `AC-ID-005` |
| 对象类型 | Projection / Read model |
| 主要责任 | 汇聚成员锚点、生命周期、角色能力、生涯和 memory ref 的安全可见摘要,供相邻仓和授权读取方消费 |
| 不承担什么 | 不创建成员、不修复 truth、不保存 consumer 私有状态、不保存外部正文或不可见字段 |
| 后续承接 | Step 7 read query;Step 8 read member summary flow;Step 9 projection state;Step 10 not visible / stale / degraded;`03` view contract |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_ref` | `MemberSummaryViewRef` | 成员摘要视图身份 |
| `member_ref` | `GlobalMemberRef` | 摘要所属成员 |
| `anchor_summary_ref` | `IdentityAnchorSummaryRef` | 身份锚定安全摘要 marker |
| `lifecycle_summary_ref` | `LifecycleSummaryRef` | 生命周期可见摘要 marker |
| `role_capability_summary_ref` | `Option<RoleCapabilitySummaryRef>` | 角色能力摘要引用 |
| `career_summary_refs` | `List<CareerSafeSummaryRef>` | 生涯可见摘要引用集合 |
| `memory_reference_summary_refs` | `List<MemoryReferenceSummaryRef>` | memory / archive ref 可见摘要引用集合 |
| `visibility_result_ref` | `VisibilityResultRef` | 本次视图裁剪结果 marker |
| `projection_state_ref` | `ProjectionStateRef` | 视图 freshness / stale / degraded 状态引用,完整对象后移 6-G |
| `source_cursor_ref` | `IdentityProjectionCursorRef` | 视图构建来源 cursor / version marker |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| 本对象在概要层不单独定义完整状态集合 | 视图 freshness 由后续 `ProjectionState` 承接 | 本批只表达 read model 形状和 no-write 边界 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `belongs_to(GlobalMemberRef member_ref)` | `GlobalMemberRef member_ref` | 判断摘要是否属于指定成员 |
| `apply_visibility(VisibilityPolicy visibility_policy, VisibilityContextRef visibility_context_ref)` | `VisibilityPolicy visibility_policy`, `VisibilityContextRef visibility_context_ref` | 按可见性策略裁剪摘要 |
| `is_safe_for_consumer(ConsumerRef consumer_ref)` | `ConsumerRef consumer_ref` | 判断当前摘要是否可供指定 consumer 使用 |
| `mark_degraded(ProjectionStateRef projection_state_ref, VisibilityResultRef visibility_result_ref)` | `ProjectionStateRef projection_state_ref`, `VisibilityResultRef visibility_result_ref` | 标记读取结果因 projection 或可见性降级 |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `from_identity_facts(GlobalMemberRef member_ref, IdentityAnchorSummaryRef anchor_summary_ref, LifecycleSummaryRef lifecycle_summary_ref, Option<RoleCapabilitySummaryRef> role_capability_summary_ref, List<CareerSafeSummaryRef> career_summary_refs, List<MemoryReferenceSummaryRef> memory_reference_summary_refs, IdentityProjectionCursorRef source_cursor_ref)` | `GlobalMemberRef member_ref`, `IdentityAnchorSummaryRef anchor_summary_ref`, `LifecycleSummaryRef lifecycle_summary_ref`, `Option<RoleCapabilitySummaryRef> role_capability_summary_ref`, `List<CareerSafeSummaryRef> career_summary_refs`, `List<MemoryReferenceSummaryRef> memory_reference_summary_refs`, `IdentityProjectionCursorRef source_cursor_ref` | 从 accepted identity facts 或可重建 projection 创建成员摘要视图 |
| `not_visible(GlobalMemberRef member_ref, VisibilityResultRef visibility_result_ref)` | `GlobalMemberRef member_ref`, `VisibilityResultRef visibility_result_ref` | 构造不可见读取结果的概要视图 marker |
| `degraded(GlobalMemberRef member_ref, ProjectionStateRef projection_state_ref, VisibilityResultRef visibility_result_ref)` | `GlobalMemberRef member_ref`, `ProjectionStateRef projection_state_ref`, `VisibilityResultRef visibility_result_ref` | 构造降级读取结果的概要视图 marker |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不通过 query 创建、刷新或修复 `GlobalMember` 或其他 truth | 违反 query no-write 和 `BR-ID-002` |
| 不保存 consumer 私有展示状态 | consumer 私有状态不归 identity truth |
| 不绕过 visibility 输出不可见字段 | 违反 `BR-ID-013` 和 `OQ-ID-004` |
| 不保存 method / work / memory / artifact / conversation body | 正文排除适用于读路径和 projection |
| 不把 stale projection 当作最新 accepted truth | freshness / stale 需显式表达 |

#### `IdentityTraceRecord`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 身份事实消费与追溯 |
| 功能来源 | `FR-ID-013`, `BR-ID-014`, `NFR-ID-005`, `NFR-ID-007` |
| 对象类型 | Trace / History record |
| 主要责任 | 为 accepted identity fact 变化追加安全追溯 material,覆盖建档、生命周期、角色能力、生涯、memory ref 和后续传播 / 维护相关变化 |
| 不承担什么 | 不替代业务 truth、不保存外部正文、不作为完整 event sourcing truth log、不修复历史 |
| 后续承接 | Step 7 trace query / append boundary;Step 8 accepted change trace;Step 9 append semantics;Step 10 trace missing / redaction;`03` trace contract |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `trace_record_ref` | `IdentityTraceRecordRef` | 追溯记录身份 |
| `member_ref` | `GlobalMemberRef` | 被追溯变化关联的成员 |
| `subject_ref` | `IdentityTraceSubjectRef` | 变化主语,例如 member、lifecycle、role summary、career、memory reference |
| `change_kind_ref` | `IdentityChangeKindRef` | 变化类别 marker |
| `reason_ref` | `Option<IdentityChangeReasonRef>` | 安全可见变化原因 |
| `source_ref` | `Option<IdentitySourceRef>` | 来源或外部交付引用 |
| `basis_ref` | `Option<GovernanceBasisRef>` | 高风险变化或授权场景的依据引用 |
| `actor_ref` | `Option<ActorRef>` | 触发变化的 actor 或受控来源 |
| `visibility_marker_ref` | `VisibilityMarkerRef` | trace 对外读取时的可见性 marker |
| `occurred_at` | `IdentityTimestamp` | accepted change 发生或记录时间 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| `Appended` | 追溯记录已追加 | 不能原地改写为新事实 |
| `Redacted` | 对外读取需裁剪部分字段 | 不删除原始安全 marker |
| `SupersededByCorrection` | 后续纠错 trace 在解释上替代本条 | 纠错仍以追加记录表达 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `belongs_to(GlobalMemberRef member_ref)` | `GlobalMemberRef member_ref` | 判断 trace 是否属于指定成员 |
| `matches_subject(IdentityTraceSubjectRef subject_ref)` | `IdentityTraceSubjectRef subject_ref` | 判断 trace 是否对应指定变化主语 |
| `redact_for(VisibilityPolicy visibility_policy, VisibilityContextRef visibility_context_ref)` | `VisibilityPolicy visibility_policy`, `VisibilityContextRef visibility_context_ref` | 按可见性策略生成可读 trace material |
| `append_correction(IdentityTraceRecordRef correction_trace_ref, IdentityChangeReasonRef reason_ref, ActorRef actor_ref, IdentityTimestamp occurred_at)` | `IdentityTraceRecordRef correction_trace_ref`, `IdentityChangeReasonRef reason_ref`, `ActorRef actor_ref`, `IdentityTimestamp occurred_at` | 通过追加方式表达追溯纠错关系 |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `from_accepted_change(GlobalMemberRef member_ref, IdentityTraceSubjectRef subject_ref, IdentityChangeKindRef change_kind_ref, Option<IdentityChangeReasonRef> reason_ref, Option<IdentitySourceRef> source_ref, Option<GovernanceBasisRef> basis_ref, Option<ActorRef> actor_ref, IdentityTimestamp occurred_at)` | `GlobalMemberRef member_ref`, `IdentityTraceSubjectRef subject_ref`, `IdentityChangeKindRef change_kind_ref`, `Option<IdentityChangeReasonRef> reason_ref`, `Option<IdentitySourceRef> source_ref`, `Option<GovernanceBasisRef> basis_ref`, `Option<ActorRef> actor_ref`, `IdentityTimestamp occurred_at` | 从 accepted identity fact 变化创建追溯记录 |
| `redacted_view_record(IdentityTraceRecord trace_record, VisibilityMarkerRef visibility_marker_ref)` | `IdentityTraceRecord trace_record`, `VisibilityMarkerRef visibility_marker_ref` | 创建对外读取时的裁剪记录骨架 |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不用 trace record 替代 `GlobalMember`、lifecycle、role、career 或 memory truth | trace 是追溯 material,不是第二 truth |
| 不保存外部正文、证据正文、memory body 或 archive package | 追溯也必须遵守 forbidden body |
| 不原地改写或删除已确认 trace | 追溯需要 append-only 语义 |
| 不把 debug log 当正式 trace | 正式 trace 必须绑定 accepted change 和安全可见来源 |
| 不绕过 visibility 输出敏感原因或来源 | trace 读取必须经 `VisibilityPolicy` |

#### `AuditTrail`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 身份事实消费与追溯 |
| 功能来源 | `FR-ID-013`, `BR-ID-014`, `AC-ID-005`, `NFR-ID-005` |
| 对象类型 | Audit / History aggregate |
| 主要责任 | 将成员相关 trace / audit entries 按范围、时间和可见性组织为可审计时间线,支持审计者复盘身份演变 |
| 不承担什么 | 不创建业务 truth、不保存 observability body、不替代外部审计仓长期存储 |
| 后续承接 | Step 7 audit query;Step 8 read audit trail flow;Step 10 trace not visible / missing;`03` audit DTO / persistence |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `audit_trail_ref` | `AuditTrailRef` | 审计时间线身份 |
| `member_ref` | `GlobalMemberRef` | 时间线所属成员 |
| `trace_record_refs` | `List<IdentityTraceRecordRef>` | 纳入时间线的追溯记录引用 |
| `audit_scope_ref` | `AuditScopeRef` | 本次审计读取范围 |
| `visibility_result_ref` | `VisibilityResultRef` | 本次审计读取裁剪结果 |
| `cursor_ref` | `AuditCursorRef` | 分页或顺序读取 cursor marker |
| `assembled_at` | `IdentityTimestamp` | 时间线视图组装时间 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| 本对象在概要层不单独定义长期状态集合 | audit trail 多数为读取组装或可重建投影 | 完整 freshness / cursor 规则后移 Step 7/9/03 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `filter_by_scope(AuditScopeRef audit_scope_ref)` | `AuditScopeRef audit_scope_ref` | 按审计范围筛选 trace refs |
| `apply_visibility(VisibilityPolicy visibility_policy, VisibilityContextRef visibility_context_ref)` | `VisibilityPolicy visibility_policy`, `VisibilityContextRef visibility_context_ref` | 对审计时间线应用可见性裁剪 |
| `contains_trace(IdentityTraceRecordRef trace_record_ref)` | `IdentityTraceRecordRef trace_record_ref` | 判断时间线是否包含某条 trace |
| `is_complete_for_scope(AuditScopeRef audit_scope_ref)` | `AuditScopeRef audit_scope_ref` | 判断当前时间线对指定范围是否完整 |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `assemble_for_member(GlobalMemberRef member_ref, AuditScopeRef audit_scope_ref, List<IdentityTraceRecordRef> trace_record_refs, VisibilityResultRef visibility_result_ref, AuditCursorRef cursor_ref, IdentityTimestamp assembled_at)` | `GlobalMemberRef member_ref`, `AuditScopeRef audit_scope_ref`, `List<IdentityTraceRecordRef> trace_record_refs`, `VisibilityResultRef visibility_result_ref`, `AuditCursorRef cursor_ref`, `IdentityTimestamp assembled_at` | 从 trace refs 组装成员审计时间线 |
| `empty_not_visible(GlobalMemberRef member_ref, AuditScopeRef audit_scope_ref, VisibilityResultRef visibility_result_ref)` | `GlobalMemberRef member_ref`, `AuditScopeRef audit_scope_ref`, `VisibilityResultRef visibility_result_ref` | 构造不可见审计结果 marker |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不通过 audit trail 修复缺失 truth 或 trace | 读取面不得写 truth |
| 不保存 observability raw log、debug body 或外部正文 | audit trail 只组织安全 trace refs / markers |
| 不把分页 cursor 当 truth cursor | cursor 是读取 marker,不能反推 accepted truth |
| 不绕过 visibility 给审计者输出全部字段 | 审计读取仍需授权和裁剪 |

#### `VisibilityPolicy`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 身份事实消费与追溯 |
| 功能来源 | `BR-ID-013`, `OQ-ID-004`, `NFR-ID-004`, `AC-ID-005` |
| 对象类型 | Policy / Guard |
| 主要责任 | 校验成员摘要、trace、audit、event material 对指定 consumer / actor / context 是否可见,并决定 redacted、not visible 或 degraded 轮廓 |
| 不承担什么 | 不实现字段级 schema、不查询外部授权系统、不保存 consumer 私有状态、不改变业务 truth |
| 后续承接 | Step 7 query metadata / visibility context;Step 8 read guard;Step 10 not visible / redacted / forbidden body;`03` visibility contract |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `consumer_ref` | `ConsumerRef` | 请求消费身份事实的下游或调用方 |
| `actor_ref` | `Option<ActorRef>` | 代表当前操作者或系统 actor |
| `visibility_context_ref` | `VisibilityContextRef` | 可见性上下文引用 |
| `scope_ref` | `VisibilityScopeRef` | 本次读取或传播涉及的字段 / 对象范围 |
| `redaction_profile_ref` | `Option<RedactionProfileRef>` | 裁剪策略 marker,完整配置后移 Step 11 / `03` |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| 本对象在概要层不单独定义状态集合 | policy 是校验对象,不保存长期状态 | 可见性结果以 `VisibilityResultRef` / marker 表达 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `assert_can_read_summary(ConsumerRef consumer_ref, GlobalMemberRef member_ref, VisibilityContextRef visibility_context_ref)` | `ConsumerRef consumer_ref`, `GlobalMemberRef member_ref`, `VisibilityContextRef visibility_context_ref` | 校验 consumer 是否可读取成员摘要 |
| `assert_can_read_trace(ConsumerRef consumer_ref, IdentityTraceSubjectRef subject_ref, VisibilityContextRef visibility_context_ref)` | `ConsumerRef consumer_ref`, `IdentityTraceSubjectRef subject_ref`, `VisibilityContextRef visibility_context_ref` | 校验 trace / audit 读取可见性 |
| `redact_summary(MemberSummaryView summary_view, VisibilityContextRef visibility_context_ref)` | `MemberSummaryView summary_view`, `VisibilityContextRef visibility_context_ref` | 对成员摘要应用字段级裁剪轮廓 |
| `redact_trace(IdentityTraceRecord trace_record, VisibilityContextRef visibility_context_ref)` | `IdentityTraceRecord trace_record`, `VisibilityContextRef visibility_context_ref` | 对追溯记录应用字段级裁剪轮廓 |
| `assert_no_forbidden_body(IdentityReadMaterial read_material)` | `IdentityReadMaterial read_material` | 防止读路径、trace 或 audit 输出外部正文 |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `for_consumer(ConsumerRef consumer_ref, Option<ActorRef> actor_ref, VisibilityContextRef visibility_context_ref, VisibilityScopeRef scope_ref)` | `ConsumerRef consumer_ref`, `Option<ActorRef> actor_ref`, `VisibilityContextRef visibility_context_ref`, `VisibilityScopeRef scope_ref` | 构造身份事实消费可见性 guard |
| `for_audit(ConsumerRef consumer_ref, ActorRef actor_ref, AuditScopeRef audit_scope_ref, VisibilityContextRef visibility_context_ref)` | `ConsumerRef consumer_ref`, `ActorRef actor_ref`, `AuditScopeRef audit_scope_ref`, `VisibilityContextRef visibility_context_ref` | 构造审计读取可见性 guard |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不通过 policy 写入或修复 identity truth | 可见性只影响读取 / 输出 |
| 不把不可见字段降级为 debug 输出 | forbidden body 和不可见内容不得绕路泄漏 |
| 不保存 consumer 私有权限状态或 UI 展示状态 | 这些属于消费方或授权边界 |
| 不在概要层提前定义字段级 redaction schema | `OQ-ID-004` 要求后续 `03` 闭口 |
| 不用字符串拼接推导 subject / scope | 跨仓 subject / visibility 必须 typed ref / context |

#### 7.10.4 本批被并入 / 后移的候选

| 候选 | 处理 | 理由 | 后续位置 |
|---|---|---|---|
| `IdentityTraceView` | 并入 `AuditTrail` / query view | 它是 trace / audit 的读取投影,不是追溯 material owner | 本批 `AuditTrail`;Step 7 trace query |
| `AuditEntry` | 并入 `AuditTrail.entries` | 单条 entry 是 audit trail 的组成项,概要层不独立展开 | 本批 `AuditTrail`;`03` entry schema |
| `HistoryRecord` | 并入 `IdentityTraceRecord` | 历史记录和 accepted change trace 在本仓 P0 高度重叠,保留一套追溯对象避免重复 truth | 本批 `IdentityTraceRecord`;Step 8/9 trace append |
| `ConsumerRef` / `VisibilityContextRef` / `VisibilityResultRef` | 作为字段 / boundary ref | 它们是读取上下文和结果 marker,不是 identity-owned truth | Step 7 query metadata;`03` visibility contract |
| consumer private state / UI display state | 排除 | 消费方私有状态不得反向定义 identity truth | 边界外;只读消费 |

#### 7.10.5 本批停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 5 候选是否全部处理 | 通过 | 7 个显式候选和 consumer / visibility refs 均已正式化、并入、后移或作为边界 marker |
| 正式对象是否有功能来源 | 通过 | `MemberSummaryView`、`IdentityTraceRecord`、`AuditTrail`、`VisibilityPolicy` 均回指 `FR-ID-012~013` / `BR-ID-013~014` |
| 被并入 / 后移 / 排除名称是否有理由 | 通过 | trace view / audit entry / history record 并入 trace-audit 对象组,consumer refs 作为 boundary refs,consumer 私有状态排除 |
| 是否越过组成部分边界 | 通过 | 未定义 query 写入、projection repair、字段级 visibility schema、consumer 私有状态或 outbox / handoff |
| 字段 / 函数是否保持概要粒度 | 通过 | 只写字段 / 类型 / 作用和函数参数骨架,未写 repository、DTO、完整 redaction schema、事务或 DDL |
| Step 8 / Step 9 预期对象是否悬空 | 暂无悬空 | read summary、read trace / audit、visibility redaction 分支可引用本批对象;projection state 已标注后续 6-G |

### 7.11 6-G 派生维护与对账

#### 7.11.1 本批输入与目标

本批只处理 Step 5 §7.10 的候选对象,目标是收稳 identity 自身投影重建、外部引用状态刷新、漂移发现和 report-only finding 的对象轮廓。派生维护与对账可以更新本仓可重建 projection state、reference resolution state 或 report,但不能修复 `L1-work`、`L3-method-library`、`L1-governance`、memory / archive 或下游 consumer truth,也不能绕过 command 写 identity truth。

| 输入 | 本批使用方式 |
|---|---|
| `FR-ID-014` 投影 / 引用对账 | `ProjectionState`、`ReferenceResolutionState`、`ReconciliationReport` 必须承接重建、刷新和 finding |
| `BR-ID-015` 维护对账边界 | `ReconciliationPolicy` 必须保证 maintenance 只能 report-only 或更新派生 state |
| `VETO-ID-005` | 维护 / 对账修复相邻仓 truth 或绕过 command 写 identity truth 为 0 容忍 |
| `AC-ID-005` | 必须能证明维护对账不修复相邻仓 truth |
| Step 3 report-only maintenance 约束 | projection rebuild、reference refresh、reconciliation 只能重建派生、标记 stale / degraded 或生成 finding |
| Step 5 §7.10 | 提供本批候选、功能、非职责和 maintenance boundary 接缝 |

#### 7.11.2 候选处理结论

| 候选 | 处理结果 | 理由 | 后续反查 |
|---|---|---|---|
| `ProjectionState` | 正式关键对象 | 表达成员摘要、消费投影或其他本仓 projection 的 freshness、stale、degraded、rebuild failed 状态 | Step 7 projection query/job;Step 8 rebuild flow;Step 9 projection state |
| `ReferenceResolutionState` | 正式关键对象 | 统一表达外部来源 / 引用解析的 resolved、stale、unavailable、unrecognized 状态,供 role、career、memory 等来源刷新复用 | Step 7 resolver boundary;Step 8 reference refresh flow;Step 9 reference state |
| `ReconciliationPolicy` | 正式关键对象 | 承接 report-only、不跨仓 repair、不绕过 command 写 truth、不伪造成同步成功等维护不变量 | Step 8 reconciliation precheck;Step 10 forbidden repair;Step 11 config boundary |
| `ReconciliationReport` | 正式关键对象 | 保存维护 / 对账发现、范围、状态和安全 issue refs,是 report-only finding 的主语 | Step 7 report query/job;Step 8 reconciliation flow;Step 10 report failed |
| `MaintenanceTraceRecord` | 并入 `IdentityTraceRecord` / report trace | 维护任务本身需要可追溯,但不应形成第二套 history;可作为 `IdentityTraceRecord` change kind 或 report entry | 6-F `IdentityTraceRecord`;本批 `ReconciliationReport`;Step 8 maintenance trace |
| `ExternalReferenceRef` / `MaintenanceScopeRef` | 作为字段 / boundary ref | 它们是外部引用和维护范围 marker,不是 identity-owned truth object | Step 7 job/query schema;`03` scope / cursor contract |

#### 7.11.3 关键对象索引

| 对象 | 所属组成部分 | 对象类型 | 功能来源 | 主要责任 |
|---|---|---|---|---|
| `ProjectionState` | 派生维护与对账 | Projection / State value | `FR-ID-014`, `BR-ID-015`, `AC-ID-005` | 表达可重建投影的 freshness、stale、degraded 和 rebuild result |
| `ReferenceResolutionState` | 派生维护与对账 | Reference / State value | `FR-ID-014`, `BR-ID-015`, `AC-ID-005` | 表达外部引用解析、刷新、不可用和待对账状态 |
| `ReconciliationPolicy` | 派生维护与对账 | Policy / Guard | `BR-ID-015`, `VETO-ID-005`, 架构 report-only maintenance | 防止维护 / 对账修复相邻仓 truth 或绕过 command 写 truth |
| `ReconciliationReport` | 派生维护与对账 | Report / Finding | `FR-ID-014`, `BR-ID-015`, `AC-ID-005` | 保存 report-only 对账发现、失败、范围和安全 issue refs |

#### `ProjectionState`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 派生维护与对账 |
| 功能来源 | `FR-ID-014`, `BR-ID-015`, `AC-ID-005`, 架构 query no-write |
| 对象类型 | Projection / State value |
| 主要责任 | 表达 identity 自身可重建投影的 freshness、stale、degraded、rebuild pending、failed 或 rebuilt 状态,供读取和维护流显式降级 |
| 不承担什么 | 不保存核心 truth,不修复 truth,不保存 consumer 私有状态,不替代 accepted fact cursor |
| 后续承接 | Step 7 projection query/job;Step 8 rebuild projection flow;Step 9 projection state;Step 10 stale / degraded;`03` projection contract |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `projection_state_ref` | `ProjectionStateRef` | 投影状态身份 |
| `projection_ref` | `IdentityProjectionRef` | 被维护的 projection 或 view 引用 |
| `member_ref` | `Option<GlobalMemberRef>` | 与成员相关的 projection 可绑定成员 |
| `state_kind` | `ProjectionStateKind` | freshness / stale / degraded / rebuild 状态类别 |
| `source_cursor_ref` | `Option<IdentityProjectionCursorRef>` | projection 对应的 accepted fact cursor / version marker |
| `maintenance_scope_ref` | `MaintenanceScopeRef` | 最近一次维护范围 |
| `issue_ref` | `Option<MaintenanceIssueRef>` | degraded 或 failed 时的安全问题引用 |
| `checked_at` | `IdentityTimestamp` | 最近一次检查或重建时间 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| `Fresh` | projection 与已知 accepted cursor 对齐 | 不代表核心 truth 由 projection 拥有 |
| `Stale` | projection 落后或来源 cursor 已变化 | 读取必须暴露 stale / degraded marker |
| `RebuildPending` | 已安排重建但未完成 | 不阻塞 accepted truth |
| `Rebuilt` | 最近一次重建完成 | 需携带 cursor / checked marker |
| `Degraded` | projection 可读但不完整或受限 | 不能伪造成完整成功 |
| `RebuildFailed` | 重建失败并需要报告 / 重试 | 失败不能触发跨仓 repair |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `is_fresh()` | 无 | 判断 projection 是否可作为最新读取候选 |
| `requires_rebuild()` | 无 | 判断是否需要后台重建 |
| `mark_stale(IdentityProjectionCursorRef source_cursor_ref, IdentityTimestamp checked_at)` | `IdentityProjectionCursorRef source_cursor_ref`, `IdentityTimestamp checked_at` | 标记 projection stale |
| `mark_rebuilt(IdentityProjectionCursorRef source_cursor_ref, IdentityTimestamp checked_at)` | `IdentityProjectionCursorRef source_cursor_ref`, `IdentityTimestamp checked_at` | 标记重建完成 |
| `mark_degraded(MaintenanceIssueRef issue_ref, IdentityTimestamp checked_at)` | `MaintenanceIssueRef issue_ref`, `IdentityTimestamp checked_at` | 标记降级读取 |
| `mark_rebuild_failed(MaintenanceIssueRef issue_ref, IdentityTimestamp checked_at)` | `MaintenanceIssueRef issue_ref`, `IdentityTimestamp checked_at` | 标记重建失败 |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `fresh(IdentityProjectionRef projection_ref, Option<GlobalMemberRef> member_ref, IdentityProjectionCursorRef source_cursor_ref, IdentityTimestamp checked_at)` | `IdentityProjectionRef projection_ref`, `Option<GlobalMemberRef> member_ref`, `IdentityProjectionCursorRef source_cursor_ref`, `IdentityTimestamp checked_at` | 创建 fresh projection state |
| `stale(IdentityProjectionRef projection_ref, Option<GlobalMemberRef> member_ref, IdentityProjectionCursorRef source_cursor_ref, MaintenanceScopeRef maintenance_scope_ref, IdentityTimestamp checked_at)` | `IdentityProjectionRef projection_ref`, `Option<GlobalMemberRef> member_ref`, `IdentityProjectionCursorRef source_cursor_ref`, `MaintenanceScopeRef maintenance_scope_ref`, `IdentityTimestamp checked_at` | 创建 stale projection state |
| `failed(IdentityProjectionRef projection_ref, MaintenanceIssueRef issue_ref, MaintenanceScopeRef maintenance_scope_ref, IdentityTimestamp checked_at)` | `IdentityProjectionRef projection_ref`, `MaintenanceIssueRef issue_ref`, `MaintenanceScopeRef maintenance_scope_ref`, `IdentityTimestamp checked_at` | 创建 rebuild failed state |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不把 projection 当第二 truth | projection 只能派生和重建 |
| 不通过 rebuild 修复 `GlobalMember`、lifecycle、role、career 或 memory truth | 违反 query / projection no-write |
| 不把 stale projection 静默输出为 fresh | freshness 必须显式表达 |
| 不保存 consumer 私有状态或 UI 展示状态 | 不属于 identity-owned projection |
| 不用分页 cursor 替代 accepted fact cursor | cursor 类型和来源需后续 Step 7/03 闭口 |

#### `ReferenceResolutionState`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 派生维护与对账 |
| 功能来源 | `FR-ID-014`, `BR-ID-015`, `AC-ID-005`, 架构 external reference boundary |
| 对象类型 | Reference / State value |
| 主要责任 | 表达外部来源或引用的解析、刷新、stale、unavailable、unrecognized 和 pending reconciliation 状态,让来源失效不会污染 identity truth |
| 不承担什么 | 不保存外部正文,不拥有外部 truth,不自动修复 method / work / governance / memory / archive |
| 后续承接 | Step 7 resolver / reference refresh boundary;Step 8 refresh reference flow;Step 9 reference state;Step 10 source unavailable;`03` resolution contract |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `resolution_state_ref` | `ReferenceResolutionStateRef` | 引用解析状态身份 |
| `external_reference_ref` | `ExternalReferenceRef` | 被解析或刷新的外部引用 |
| `reference_owner_ref` | `IdentityReferenceOwnerRef` | 本仓中使用该外部引用的对象或关系 |
| `state_kind` | `ReferenceResolutionStateKind` | 解析状态类别 |
| `source_version_ref` | `Option<ExternalSourceVersionRef>` | 外部来源版本 marker |
| `safe_summary_ref` | `Option<ExternalReferenceSafeSummaryRef>` | 可保存的安全摘要 marker,不得为正文 |
| `issue_ref` | `Option<MaintenanceIssueRef>` | 解析失败、不可用或对账发现引用 |
| `checked_at` | `IdentityTimestamp` | 最近一次解析 / 刷新时间 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| `Resolved` | 外部引用可解析且安全摘要可用 | 不代表 identity 拥有外部 truth |
| `Stale` | 来源版本变化或状态过期 | 后续 refresh / reconciliation 处理 |
| `Unavailable` | 外部来源不可用 | 不得用默认值补造事实 |
| `Unrecognized` | 外部引用无法映射到正式 ref / marker | 应进入 rejected、pending 或 report-only |
| `PendingReconciliation` | 引用状态与本仓 projection / truth 存在待解释差异 | 修复需回到正式 owner 能力 |
| `RefreshFailed` | 刷新任务失败 | 生成 issue / report,不修复外部 truth |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `is_usable_for_truth_update()` | 无 | 判断解析结果是否可被后续 command / source flow 采用 |
| `is_report_only()` | 无 | 判断状态是否只能形成 finding 而不能写 truth |
| `mark_stale(ExternalSourceVersionRef source_version_ref, IdentityTimestamp checked_at)` | `ExternalSourceVersionRef source_version_ref`, `IdentityTimestamp checked_at` | 标记来源过期 |
| `mark_unavailable(MaintenanceIssueRef issue_ref, IdentityTimestamp checked_at)` | `MaintenanceIssueRef issue_ref`, `IdentityTimestamp checked_at` | 标记外部来源不可用 |
| `mark_pending_reconciliation(MaintenanceIssueRef issue_ref, IdentityTimestamp checked_at)` | `MaintenanceIssueRef issue_ref`, `IdentityTimestamp checked_at` | 标记需要对账解释 |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `resolved(ExternalReferenceRef external_reference_ref, IdentityReferenceOwnerRef reference_owner_ref, ExternalSourceVersionRef source_version_ref, ExternalReferenceSafeSummaryRef safe_summary_ref, IdentityTimestamp checked_at)` | `ExternalReferenceRef external_reference_ref`, `IdentityReferenceOwnerRef reference_owner_ref`, `ExternalSourceVersionRef source_version_ref`, `ExternalReferenceSafeSummaryRef safe_summary_ref`, `IdentityTimestamp checked_at` | 创建已解析状态 |
| `unavailable(ExternalReferenceRef external_reference_ref, IdentityReferenceOwnerRef reference_owner_ref, MaintenanceIssueRef issue_ref, IdentityTimestamp checked_at)` | `ExternalReferenceRef external_reference_ref`, `IdentityReferenceOwnerRef reference_owner_ref`, `MaintenanceIssueRef issue_ref`, `IdentityTimestamp checked_at` | 创建不可用状态 |
| `unrecognized(ExternalReferenceRef external_reference_ref, IdentityReferenceOwnerRef reference_owner_ref, MaintenanceIssueRef issue_ref, IdentityTimestamp checked_at)` | `ExternalReferenceRef external_reference_ref`, `IdentityReferenceOwnerRef reference_owner_ref`, `MaintenanceIssueRef issue_ref`, `IdentityTimestamp checked_at` | 创建无法识别状态 |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不保存 method / work / governance / memory / archive 正文 | external reference 只能保存 ref、version、state 和 safe summary marker |
| 不用 unavailable / unrecognized 结果生成 accepted truth | 防止默认补造外部事实 |
| 不修复外部 owner truth | 维护只能 report-only 或触发正式 owner 能力 |
| 不从外部私有 ID 字符串拼接本仓 subject | typed ref / source marker 约束 |

#### `ReconciliationPolicy`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 派生维护与对账 |
| 功能来源 | `BR-ID-015`, `VETO-ID-005`, `AC-ID-005`, 架构 report-only maintenance |
| 对象类型 | Policy / Guard |
| 主要责任 | 校验 projection rebuild、reference refresh 和 reconciliation 只能更新派生状态或生成 finding,不得跨仓 repair 或绕过 command 写 truth |
| 不承担什么 | 不执行修复、不读取外部正文、不定义 job runner、retry、schedule 或 adapter 签名 |
| 后续承接 | Step 7 job/query boundary;Step 8 maintenance precheck;Step 10 forbidden repair;Step 11 maintenance scope config;`03` policy contract |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `maintenance_scope_ref` | `MaintenanceScopeRef` | 本次维护 / 对账范围 |
| `operation_channel` | `IdentityOperationChannel` | 维护、query、command、source event 等入口类别 |
| `actor_ref` | `Option<ActorRef>` | 受控维护 actor 或系统 actor |
| `target_ref` | `IdentityMaintenanceTargetRef` | 本次维护对象,例如 projection、reference 或 report |
| `finding_intent_ref` | `Option<ReconciliationFindingIntentRef>` | 对账发现意图 marker |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| 本对象在概要层不单独定义状态集合 | policy 是校验对象,不保存长期状态 | 长期结果由 `ProjectionState`、`ReferenceResolutionState` 和 `ReconciliationReport` 承接 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `assert_report_only(MaintenanceScopeRef maintenance_scope_ref, IdentityMaintenanceTargetRef target_ref)` | `MaintenanceScopeRef maintenance_scope_ref`, `IdentityMaintenanceTargetRef target_ref` | 校验维护目标只能是 projection / reference state / report |
| `assert_not_truth_write(IdentityMaintenanceIntent maintenance_intent)` | `IdentityMaintenanceIntent maintenance_intent` | 防止维护绕过 command 写 identity truth |
| `assert_not_cross_repo_repair(IdentityMaintenanceIntent maintenance_intent)` | `IdentityMaintenanceIntent maintenance_intent` | 防止修复相邻仓 truth |
| `assert_not_query_path_refresh(IdentityOperationChannel operation_channel)` | `IdentityOperationChannel operation_channel` | 防止 query path 同步刷新 truth 或外部来源 |
| `assert_body_free(ReconciliationFindingMaterial finding_material)` | `ReconciliationFindingMaterial finding_material` | 防止 report / finding 带入外部正文 |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `for_projection_rebuild(MaintenanceScopeRef maintenance_scope_ref, IdentityProjectionRef projection_ref, Option<ActorRef> actor_ref)` | `MaintenanceScopeRef maintenance_scope_ref`, `IdentityProjectionRef projection_ref`, `Option<ActorRef> actor_ref` | 构造 projection rebuild guard |
| `for_reference_refresh(MaintenanceScopeRef maintenance_scope_ref, ExternalReferenceRef external_reference_ref, Option<ActorRef> actor_ref)` | `MaintenanceScopeRef maintenance_scope_ref`, `ExternalReferenceRef external_reference_ref`, `Option<ActorRef> actor_ref` | 构造 reference refresh guard |
| `for_reconciliation(MaintenanceScopeRef maintenance_scope_ref, ReconciliationFindingIntentRef finding_intent_ref, Option<ActorRef> actor_ref)` | `MaintenanceScopeRef maintenance_scope_ref`, `ReconciliationFindingIntentRef finding_intent_ref`, `Option<ActorRef> actor_ref` | 构造 reconciliation report guard |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不允许维护任务创建、更新或删除核心 identity truth | 违反 report-only maintenance |
| 不允许修复 `L1-work`、`L3-method-library`、`L1-governance`、memory / archive 或 downstream truth | 违反 `BR-ID-015` / `VETO-ID-005` |
| 不允许 query path 同步刷新 truth 或外部来源 | 读取路径必须 no-write |
| 不允许 finding 携带外部正文或包体 | report 也受 forbidden body 约束 |
| 不在概要层定义 job runner、retry、schedule | 这些后移 Step 7/8/11/03 |

#### `ReconciliationReport`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 派生维护与对账 |
| 功能来源 | `FR-ID-014`, `BR-ID-015`, `AC-ID-005`, 架构 observability / report-only |
| 对象类型 | Report / Finding |
| 主要责任 | 保存投影、引用或消费边界的对账发现、维护结果、失败 issue 和 report-only 结论,用于审计和后续正式修复入口 |
| 不承担什么 | 不修复 truth、不保存外部正文、不作为自动执行修复计划、不替代 trace / audit truth |
| 后续承接 | Step 7 report query/job;Step 8 reconciliation flow;Step 10 drift / failed report;`03` report contract |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `report_ref` | `ReconciliationReportRef` | 对账报告身份 |
| `maintenance_scope_ref` | `MaintenanceScopeRef` | 报告覆盖范围 |
| `target_refs` | `List<IdentityMaintenanceTargetRef>` | 被检查的 projection、reference 或 report target |
| `finding_refs` | `List<ReconciliationFindingRef>` | 对账发现引用集合 |
| `issue_refs` | `List<MaintenanceIssueRef>` | 维护失败、漂移或不可用问题引用 |
| `report_state` | `ReconciliationReportState` | 报告状态 |
| `generated_by_ref` | `Option<ActorRef>` | 生成报告的系统 actor 或受控 actor |
| `generated_at` | `IdentityTimestamp` | 报告生成时间 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| `Generated` | 报告已生成且可读取 | 不代表发现已修复 |
| `NoFinding` | 本次范围未发现漂移 | 仍是 report-only 结论 |
| `FindingDetected` | 发现 projection / reference / consumer 边界漂移 | 修复需回到正式 owner 能力 |
| `Failed` | 维护或对账执行失败 | 失败必须显式暴露 |
| `Partial` | 部分范围完成、部分失败或不可用 | 不得伪造成全量成功 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `has_findings()` | 无 | 判断报告是否包含对账发现 |
| `is_failed()` | 无 | 判断报告是否失败 |
| `mark_failed(MaintenanceIssueRef issue_ref, IdentityTimestamp generated_at)` | `MaintenanceIssueRef issue_ref`, `IdentityTimestamp generated_at` | 标记维护 / 对账失败 |
| `append_finding(ReconciliationFindingRef finding_ref, MaintenanceIssueRef issue_ref)` | `ReconciliationFindingRef finding_ref`, `MaintenanceIssueRef issue_ref` | 追加 report-only finding |
| `assert_report_only()` | 无 | 表达报告不能被解释为自动修复计划 |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `generated(MaintenanceScopeRef maintenance_scope_ref, List<IdentityMaintenanceTargetRef> target_refs, List<ReconciliationFindingRef> finding_refs, List<MaintenanceIssueRef> issue_refs, Option<ActorRef> generated_by_ref, IdentityTimestamp generated_at)` | `MaintenanceScopeRef maintenance_scope_ref`, `List<IdentityMaintenanceTargetRef> target_refs`, `List<ReconciliationFindingRef> finding_refs`, `List<MaintenanceIssueRef> issue_refs`, `Option<ActorRef> generated_by_ref`, `IdentityTimestamp generated_at` | 创建对账报告 |
| `no_finding(MaintenanceScopeRef maintenance_scope_ref, List<IdentityMaintenanceTargetRef> target_refs, Option<ActorRef> generated_by_ref, IdentityTimestamp generated_at)` | `MaintenanceScopeRef maintenance_scope_ref`, `List<IdentityMaintenanceTargetRef> target_refs`, `Option<ActorRef> generated_by_ref`, `IdentityTimestamp generated_at` | 创建无发现报告 |
| `failed(MaintenanceScopeRef maintenance_scope_ref, MaintenanceIssueRef issue_ref, Option<ActorRef> generated_by_ref, IdentityTimestamp generated_at)` | `MaintenanceScopeRef maintenance_scope_ref`, `MaintenanceIssueRef issue_ref`, `Option<ActorRef> generated_by_ref`, `IdentityTimestamp generated_at` | 创建失败报告 |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不把 finding 当作已修复状态 | report-only 只描述问题 |
| 不包含外部正文、raw log、archive package 或 debug body | report 也必须正文排除 |
| 不自动写入相邻仓或核心 identity truth | 修复必须经正式 owner 能力 |
| 不隐藏 partial / failed 状态 | 维护结果必须可观测且不可伪成功 |
| 不替代 `IdentityTraceRecord` 的 accepted change trace | report 是维护发现,不是业务变化 truth |

#### 7.11.4 本批被并入 / 后移的候选

| 候选 | 处理 | 理由 | 后续位置 |
|---|---|---|---|
| `MaintenanceTraceRecord` | 并入 `IdentityTraceRecord` / `ReconciliationReport` | 维护过程需要追溯,但不应形成第二套 history;维护结果可通过 trace change kind 或 report finding 表达 | 6-F `IdentityTraceRecord`;本批 `ReconciliationReport`;Step 8 maintenance flow |
| `ExternalReferenceRef` | 作为字段 / boundary ref | 它是外部来源引用,不是 identity-owned truth | Step 7 resolver / refresh schema;`03` protocol contract |
| `MaintenanceScopeRef` | 作为字段 / boundary ref | 它是 job / report 范围 marker,不是长期业务对象 | Step 7 job/query schema;Step 11 config impact;`03` scope contract |
| repair action / remediation plan | 排除 | 修复计划和执行必须回到拥有 truth 的正式能力,不属于 report-only 对账对象 | 边界外;后续 owner 仓或正式 command flow |

#### 7.11.5 本批停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 5 候选是否全部处理 | 通过 | 5 个显式候选和 external reference / maintenance scope refs 均已正式化、并入、后移或作为边界 marker |
| 正式对象是否有功能来源 | 通过 | `ProjectionState`、`ReferenceResolutionState`、`ReconciliationPolicy`、`ReconciliationReport` 均回指 `FR-ID-014` / `BR-ID-015` |
| 被并入 / 后移 / 排除名称是否有理由 | 通过 | maintenance trace 并入 trace/report,external reference 和 scope 作为 boundary refs,repair action 排除 |
| 是否越过组成部分边界 | 通过 | 未定义跨仓 repair、command truth write、job runner、retry、schedule 或 outbox / handoff |
| 字段 / 函数是否保持概要粒度 | 通过 | 只写字段 / 类型 / 作用和函数参数骨架,未写 repository、job DTO、cursor schema、事务或 DDL |
| Step 8 / Step 9 预期对象是否悬空 | 暂无悬空 | projection rebuild、reference refresh、reconciliation report-only 分支可引用本批对象;传播 / handoff 已标注后续 6-H |

### 7.12 6-H 身份事实传播与外部交接

#### 7.12.1 本批输入与目标

本批只处理 Step 5 §7.11 的候选对象,目标是收稳 accepted identity fact 的 outbox material、发布状态、trace / audit / archive handoff 意图和交接状态。身份事实传播与外部交接只传播或交接 accepted material,不能重算 truth,不能把 publish / handoff 成功作为 command accepted 前置,也不能携带外部正文、secret 或不可见字段。

| 输入 | 本批使用方式 |
|---|---|
| `FR-ID-012` 身份事实消费 | `IdentityOutboxRecord` 必须承接面向下游的身份变化通知 material |
| `FR-ID-013` 身份变化追溯 | `TraceHandoffIntent` 必须承接 trace / audit / archive / observability 交接意图 |
| `BR-ID-013` 消费边界 | `OutboundEventPolicy` 必须防止下游传播绕过 visibility 或反写 identity truth |
| `BR-ID-014` 审计约束 | outbox / handoff 必须可追溯到 accepted change、trace context 或 safe marker |
| `AC-ID-005` | 必须能证明身份事实可被消费、变化可追溯、传播失败不回滚 accepted truth |
| Step 3 accepted fact 最终一致传播约束 | publish / handoff 失败不能回滚 accepted identity truth,只能 pending / retryable / failed |
| Step 5 §7.11 | 提供本批候选、功能、非职责和 outbox / handoff 接缝 |

#### 7.12.2 候选处理结论

| 候选 | 处理结果 | 理由 | 后续反查 |
|---|---|---|---|
| `IdentityOutboxRecord` | 正式关键对象 | 承接 accepted identity fact 的安全 payload snapshot / marker 和 pending publish state,是 event propagation 主语 | Step 7 event boundary;Step 8 prepare / publish outbox flow;Step 9 outbox state |
| `TraceHandoffIntent` | 正式关键对象 | 表达 trace / audit / archive / observability handoff 的交接意图、target、scope 和 safe material marker | Step 7 handoff boundary;Step 8 prepare handoff flow;Step 9 handoff state |
| `OutboxState` | 正式关键对象 | 发布状态具有 pending、published、retryable、failed 等独立语义,不应埋入 outbox 普通字段 | Step 8 publish flow;Step 9 outbox state |
| `HandoffState` | 正式关键对象 | handoff 状态具有 pending、delivered、retryable、failed 等独立语义,需与 outbox delivery 区分 | Step 8 handoff flow;Step 9 handoff state |
| `OutboundEventPolicy` | 正式关键对象 | 承接 accepted-only、visibility、body-free、publish 不作 accepted 前置等传播不变量 | Step 8 event publish precheck;Step 10 forbidden publish |
| `HandoffPolicy` | 正式关键对象 | 承接 handoff target、safe material、body-free、不得伪造成功等交接不变量 | Step 8 handoff precheck;Step 10 handoff failed |
| `OutboxPendingView` | 并入 `IdentityOutboxRecord` 查询视图 | 它是 pending outbox 的读取切片,不是新的 truth owner | 本批 `IdentityOutboxRecord`;Step 7 outbox query/job |
| `HandoffTraceRecord` | 并入 `IdentityTraceRecord` / `TraceHandoffIntent` | handoff 过程需要追溯,但不应形成第二套 trace;可作为 trace change kind 或 intent history marker | 6-F `IdentityTraceRecord`;本批 `TraceHandoffIntent`;Step 8 handoff trace |
| `TopicKey` / `HandoffTargetRef` | 作为字段 / boundary ref | 它们是下游 topic 和交接目标引用,不是 identity-owned object | Step 7 event / handoff boundary;`03/04` protocol / config |

#### 7.12.3 关键对象索引

| 对象 | 所属组成部分 | 对象类型 | 功能来源 | 主要责任 |
|---|---|---|---|---|
| `IdentityOutboxRecord` | 身份事实传播与外部交接 | Outbox record | `FR-ID-012`, `BR-ID-013`, accepted fact propagation | 保存待发布 accepted identity fact 的安全 payload marker 和 delivery state |
| `TraceHandoffIntent` | 身份事实传播与外部交接 | Handoff object | `FR-ID-013`, `BR-ID-014`, trace / archive handoff | 表达 trace / audit / archive / observability 的安全交接意图 |
| `OutboxState` | 身份事实传播与外部交接 | State value | `FR-ID-012`, accepted fact eventual propagation | 表达 outbox publish 生命周期和失败可见性 |
| `HandoffState` | 身份事实传播与外部交接 | State value | `FR-ID-013`, `BR-ID-014`, handoff recovery | 表达 handoff 生命周期和失败可见性 |
| `OutboundEventPolicy` | 身份事实传播与外部交接 | Policy / Guard | `BR-ID-013`, `VETO-ID-003`, eventual propagation | 防止传播非 accepted truth、不可见字段或外部正文 |
| `HandoffPolicy` | 身份事实传播与外部交接 | Policy / Guard | `BR-ID-014`, `VETO-ID-003`, handoff boundary | 防止 handoff 目标 / material / receipt 被实现侧脑补或伪成功 |

#### `IdentityOutboxRecord`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 身份事实传播与外部交接 |
| 功能来源 | `FR-ID-012`, `BR-ID-013`, `AC-ID-005`, 架构 accepted fact propagation |
| 对象类型 | Outbox record |
| 主要责任 | 保存 accepted identity fact 的安全 payload snapshot / marker、topic / consumer boundary 和 outbox delivery state,供异步发布 |
| 不承担什么 | 不重算 truth、不保存外部正文、不同步等待下游成功、不把 publish 结果作为 command accepted 前置 |
| 后续承接 | Step 7 event envelope boundary;Step 8 prepare / publish outbox flow;Step 9 outbox state;Step 10 publish failed;`03` outbox contract |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `outbox_record_ref` | `IdentityOutboxRecordRef` | outbox 记录身份 |
| `member_ref` | `GlobalMemberRef` | 变化关联成员 |
| `subject_ref` | `IdentityOutboundSubjectRef` | 变化主语,例如 member、lifecycle、role summary、career、memory reference |
| `change_kind_ref` | `IdentityChangeKindRef` | accepted change 类别 |
| `payload_marker_ref` | `IdentityOutboundPayloadMarkerRef` | 安全 payload snapshot / marker,不得携带正文 |
| `topic_key_ref` | `TopicKeyRef` | 下游 topic / routing boundary marker |
| `trace_record_ref` | `IdentityTraceRecordRef` | 与 accepted change 关联的 trace |
| `outbox_state` | `OutboxState` | 当前发布状态 |
| `created_at` | `IdentityTimestamp` | outbox 记录创建时间 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| 本对象不单独定义状态枚举 | 发布状态由 `OutboxState` 承接 | 避免状态字段和独立状态对象重复 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `belongs_to(GlobalMemberRef member_ref)` | `GlobalMemberRef member_ref` | 判断 outbox 是否属于指定成员变化 |
| `matches_subject(IdentityOutboundSubjectRef subject_ref)` | `IdentityOutboundSubjectRef subject_ref` | 判断 outbox 是否对应指定变化主语 |
| `mark_published(OutboxState outbox_state, IdentityTimestamp changed_at)` | `OutboxState outbox_state`, `IdentityTimestamp changed_at` | 在 publish 成功后更新状态 |
| `mark_retryable(OutboxState outbox_state, IdentityTimestamp changed_at)` | `OutboxState outbox_state`, `IdentityTimestamp changed_at` | 在 publish 可重试失败时更新状态 |
| `mark_failed(OutboxState outbox_state, IdentityTimestamp changed_at)` | `OutboxState outbox_state`, `IdentityTimestamp changed_at` | 在 publish 失败时更新状态 |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `from_accepted_change(GlobalMemberRef member_ref, IdentityOutboundSubjectRef subject_ref, IdentityChangeKindRef change_kind_ref, IdentityOutboundPayloadMarkerRef payload_marker_ref, TopicKeyRef topic_key_ref, IdentityTraceRecordRef trace_record_ref, IdentityTimestamp created_at)` | `GlobalMemberRef member_ref`, `IdentityOutboundSubjectRef subject_ref`, `IdentityChangeKindRef change_kind_ref`, `IdentityOutboundPayloadMarkerRef payload_marker_ref`, `TopicKeyRef topic_key_ref`, `IdentityTraceRecordRef trace_record_ref`, `IdentityTimestamp created_at` | 从 accepted identity fact 变化创建 pending outbox |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不从 outbox 重算或修改 accepted truth | outbox 只传播已成立事实 |
| 不把 publish 成功作为 command accepted 前置 | 传播最终一致,失败不能回滚 accepted truth |
| 不保存外部正文、secret、不可见字段或 archive package | event material 也受 forbidden body 和 visibility 约束 |
| 不伪造 published 状态 | delivery 失败必须 pending / retryable / failed 显式表达 |
| 不把 `TopicKeyRef` 写成配置外的硬编码协议 | topic / envelope schema 后移 Step 7/11/03 |

#### `TraceHandoffIntent`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 身份事实传播与外部交接 |
| 功能来源 | `FR-ID-013`, `BR-ID-014`, `AC-ID-005`, 架构 trace / archive handoff |
| 对象类型 | Handoff object |
| 主要责任 | 表达 trace、audit、archive 或 observability 承接方的交接意图、目标、scope、安全 material marker 和 handoff state |
| 不承担什么 | 不保存 archive package、observability raw log、external body 或外部承接方 receipt schema |
| 后续承接 | Step 7 handoff boundary;Step 8 prepare / deliver handoff flow;Step 9 handoff state;Step 10 handoff failed;`03/04` handoff contract |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `handoff_intent_ref` | `TraceHandoffIntentRef` | handoff 意图身份 |
| `member_ref` | `GlobalMemberRef` | handoff 关联成员 |
| `trace_record_refs` | `List<IdentityTraceRecordRef>` | 需要交接的 trace 引用集合 |
| `audit_trail_ref` | `Option<AuditTrailRef>` | 需要交接的 audit trail 引用 |
| `handoff_target_ref` | `HandoffTargetRef` | 外部承接方目标引用 |
| `handoff_scope_ref` | `HandoffScopeRef` | 交接范围 marker |
| `safe_material_ref` | `TraceHandoffSafeMaterialRef` | 安全交接 material marker,不得为正文或 package |
| `handoff_state` | `HandoffState` | 当前交接状态 |
| `created_at` | `IdentityTimestamp` | handoff intent 创建时间 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| 本对象不单独定义状态枚举 | handoff 生命周期由 `HandoffState` 承接 | target / receipt schema 后移 `03/04` |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `targets(HandoffTargetRef handoff_target_ref)` | `HandoffTargetRef handoff_target_ref` | 判断是否面向指定 handoff target |
| `contains_trace(IdentityTraceRecordRef trace_record_ref)` | `IdentityTraceRecordRef trace_record_ref` | 判断 intent 是否包含指定 trace |
| `mark_delivered(HandoffState handoff_state, IdentityTimestamp changed_at)` | `HandoffState handoff_state`, `IdentityTimestamp changed_at` | 在 handoff 成功后更新状态 |
| `mark_retryable(HandoffState handoff_state, IdentityTimestamp changed_at)` | `HandoffState handoff_state`, `IdentityTimestamp changed_at` | 在 handoff 可重试失败后更新状态 |
| `mark_failed(HandoffState handoff_state, IdentityTimestamp changed_at)` | `HandoffState handoff_state`, `IdentityTimestamp changed_at` | 在 handoff 失败后更新状态 |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `prepare(GlobalMemberRef member_ref, List<IdentityTraceRecordRef> trace_record_refs, Option<AuditTrailRef> audit_trail_ref, HandoffTargetRef handoff_target_ref, HandoffScopeRef handoff_scope_ref, TraceHandoffSafeMaterialRef safe_material_ref, IdentityTimestamp created_at)` | `GlobalMemberRef member_ref`, `List<IdentityTraceRecordRef> trace_record_refs`, `Option<AuditTrailRef> audit_trail_ref`, `HandoffTargetRef handoff_target_ref`, `HandoffScopeRef handoff_scope_ref`, `TraceHandoffSafeMaterialRef safe_material_ref`, `IdentityTimestamp created_at` | 创建 pending trace / audit / archive handoff intent |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不保存 archive package、observability raw log 或 trace body | handoff 只保存 safe material marker |
| 不伪造 delivered 状态或 receipt | 外部承接结果必须通过正式 boundary 回写 marker |
| 不把 handoff 成功作为 accepted truth 前置 | handoff 是后续交接,不能阻塞 command accepted |
| 不在概要层定义 target / receipt schema | handoff target 和 receipt 后移 Step 7/03/04 |
| 不绕过 visibility / redaction 交接不可见字段 | handoff material 必须安全裁剪 |

#### `OutboxState`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 身份事实传播与外部交接 |
| 功能来源 | `FR-ID-012`, accepted fact eventual propagation, `AC-ID-005` |
| 对象类型 | State value |
| 主要责任 | 表达 outbox publish 的 pending、published、retryable、failed 和 skipped 状态,让传播失败可见且可恢复 |
| 不承担什么 | 不表达 command truth 状态、不决定下游消费成功语义、不保存 topic implementation 细节 |
| 后续承接 | Step 8 publish outbox flow;Step 9 outbox state;Step 10 publish failed;`03` state matrix |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `state_kind` | `OutboxStateKind` | 发布状态类别 |
| `attempt_ref` | `Option<OutboxDeliveryAttemptRef>` | 最近一次发布尝试 marker |
| `issue_ref` | `Option<OutboxDeliveryIssueRef>` | 失败或可重试问题引用 |
| `changed_at` | `IdentityTimestamp` | 状态变化时间 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| `PendingPublish` | outbox 已创建,等待发布 | command accepted 不等待发布 |
| `Published` | 已成功发布到正式 boundary | 不代表所有下游已消费 |
| `RetryableFailed` | 发布失败但可重试 | 后续 job / recovery 处理 |
| `Failed` | 发布失败且需报告或人工处理 | 不回滚 accepted truth |
| `SkippedByPolicy` | 因可见性或策略不允许传播 | 必须保留原因 marker |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `is_terminal()` | 无 | 判断发布状态是否为终态候选 |
| `is_retryable()` | 无 | 判断是否可由后台重试 |
| `mark_published(OutboxDeliveryAttemptRef attempt_ref, IdentityTimestamp changed_at)` | `OutboxDeliveryAttemptRef attempt_ref`, `IdentityTimestamp changed_at` | 标记发布成功 |
| `mark_retryable_failed(OutboxDeliveryIssueRef issue_ref, IdentityTimestamp changed_at)` | `OutboxDeliveryIssueRef issue_ref`, `IdentityTimestamp changed_at` | 标记可重试失败 |
| `mark_failed(OutboxDeliveryIssueRef issue_ref, IdentityTimestamp changed_at)` | `OutboxDeliveryIssueRef issue_ref`, `IdentityTimestamp changed_at` | 标记失败 |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `pending(IdentityTimestamp changed_at)` | `IdentityTimestamp changed_at` | 创建待发布状态 |
| `skipped_by_policy(OutboxDeliveryIssueRef issue_ref, IdentityTimestamp changed_at)` | `OutboxDeliveryIssueRef issue_ref`, `IdentityTimestamp changed_at` | 创建因策略跳过状态 |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不用 `Published` 代表下游业务已处理 | 只能表达本仓发布 boundary 成功 |
| 不把失败状态写成 accepted truth 失败 | accepted truth 与传播状态分离 |
| 不隐藏 retryable / failed marker | 失败必须可观测 |

#### `HandoffState`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 身份事实传播与外部交接 |
| 功能来源 | `FR-ID-013`, `BR-ID-014`, trace / archive handoff recovery |
| 对象类型 | State value |
| 主要责任 | 表达 trace / audit / archive handoff 的 pending、delivered、retryable、failed 和 cancelled 状态 |
| 不承担什么 | 不表达 memory ref relation 状态全集、不保存外部 receipt body、不决定外部 archive truth |
| 后续承接 | Step 8 handoff flow;Step 9 handoff state;Step 10 handoff failed;`03/04` handoff state |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `state_kind` | `HandoffStateKind` | handoff 状态类别 |
| `attempt_ref` | `Option<HandoffAttemptRef>` | 最近一次交接尝试 marker |
| `receipt_ref` | `Option<HandoffReceiptRef>` | 外部承接 receipt marker,不得为 body |
| `issue_ref` | `Option<HandoffIssueRef>` | 失败或可重试问题引用 |
| `changed_at` | `IdentityTimestamp` | 状态变化时间 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| `PendingHandoff` | handoff intent 已创建,等待交接 | 不代表 delivered |
| `Delivered` | 已收到正式 receipt marker | 不保存 receipt body |
| `RetryableFailed` | 交接失败但可重试 | 后续恢复处理 |
| `Failed` | 交接失败且需报告或人工处理 | 不回滚 accepted truth |
| `Cancelled` | 交接按策略取消 | 必须有原因 marker |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `is_terminal()` | 无 | 判断 handoff 是否终态候选 |
| `is_retryable()` | 无 | 判断是否可重试 |
| `mark_delivered(HandoffReceiptRef receipt_ref, IdentityTimestamp changed_at)` | `HandoffReceiptRef receipt_ref`, `IdentityTimestamp changed_at` | 标记交接完成 |
| `mark_retryable_failed(HandoffIssueRef issue_ref, IdentityTimestamp changed_at)` | `HandoffIssueRef issue_ref`, `IdentityTimestamp changed_at` | 标记可重试失败 |
| `mark_failed(HandoffIssueRef issue_ref, IdentityTimestamp changed_at)` | `HandoffIssueRef issue_ref`, `IdentityTimestamp changed_at` | 标记失败 |
| `mark_cancelled(HandoffIssueRef issue_ref, IdentityTimestamp changed_at)` | `HandoffIssueRef issue_ref`, `IdentityTimestamp changed_at` | 标记取消 |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `pending(IdentityTimestamp changed_at)` | `IdentityTimestamp changed_at` | 创建待交接状态 |
| `failed(HandoffIssueRef issue_ref, IdentityTimestamp changed_at)` | `HandoffIssueRef issue_ref`, `IdentityTimestamp changed_at` | 创建失败状态 |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不把 `PendingHandoff` 当作 delivered | 防止伪造交接成功 |
| 不保存 receipt body 或 archive package | 只允许 receipt ref / marker |
| 不用 handoff 状态修复外部 archive / observability truth | handoff 是交接状态,不是外部 truth owner |

#### `OutboundEventPolicy`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 身份事实传播与外部交接 |
| 功能来源 | `BR-ID-013`, `VETO-ID-003`, accepted fact propagation |
| 对象类型 | Policy / Guard |
| 主要责任 | 校验 outbox / event material 只能来自 accepted identity fact,并且满足 visibility、body-free、topic boundary 和 eventual propagation 约束 |
| 不承担什么 | 不发布消息、不定义 event envelope schema、不查询下游状态、不改变 accepted truth |
| 后续承接 | Step 7 event boundary;Step 8 prepare / publish precheck;Step 10 forbidden event material;Step 11 topic / profile config;`03` policy contract |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `subject_ref` | `IdentityOutboundSubjectRef` | 待传播变化主语 |
| `change_kind_ref` | `IdentityChangeKindRef` | 待传播变化类别 |
| `payload_marker_ref` | `IdentityOutboundPayloadMarkerRef` | 安全 payload marker |
| `topic_key_ref` | `TopicKeyRef` | 下游 topic / routing marker |
| `visibility_context_ref` | `VisibilityContextRef` | 传播可见性上下文 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| 本对象在概要层不单独定义状态集合 | policy 是校验对象,不保存长期状态 | 长期状态由 `IdentityOutboxRecord` / `OutboxState` 承接 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `assert_from_accepted_change(IdentityChangeKindRef change_kind_ref, IdentityTraceRecordRef trace_record_ref)` | `IdentityChangeKindRef change_kind_ref`, `IdentityTraceRecordRef trace_record_ref` | 校验 outbox material 来自 accepted change 和正式 trace |
| `assert_payload_body_free(IdentityOutboundPayloadMarkerRef payload_marker_ref)` | `IdentityOutboundPayloadMarkerRef payload_marker_ref` | 防止 event 携带外部正文、secret 或 package |
| `assert_visible_for_topic(TopicKeyRef topic_key_ref, VisibilityContextRef visibility_context_ref)` | `TopicKeyRef topic_key_ref`, `VisibilityContextRef visibility_context_ref` | 校验传播目标可见性 |
| `assert_publish_not_acceptance_gate()` | 无 | 明确 publish 成功不得成为 command accepted 前置 |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `for_outbox(IdentityOutboundSubjectRef subject_ref, IdentityChangeKindRef change_kind_ref, IdentityOutboundPayloadMarkerRef payload_marker_ref, TopicKeyRef topic_key_ref, VisibilityContextRef visibility_context_ref)` | `IdentityOutboundSubjectRef subject_ref`, `IdentityChangeKindRef change_kind_ref`, `IdentityOutboundPayloadMarkerRef payload_marker_ref`, `TopicKeyRef topic_key_ref`, `VisibilityContextRef visibility_context_ref` | 构造 outbox/event guard |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不允许未 accepted change 进入 outbox | 防止传播未成立事实 |
| 不允许 event payload 携带外部正文或不可见字段 | event 也受 forbidden body 和 visibility 约束 |
| 不允许下游失败回滚 accepted truth | 违反 eventual propagation |
| 不在概要层定义 topic 字符串或 envelope schema | 后移 Step 7/03/04 |

#### `HandoffPolicy`

| 项 | 结论 |
|---|---|
| 所属组成部分 | 身份事实传播与外部交接 |
| 功能来源 | `BR-ID-014`, `VETO-ID-003`, trace / archive handoff boundary |
| 对象类型 | Policy / Guard |
| 主要责任 | 校验 handoff intent 的 target、scope、safe material、trace refs 和 receipt marker 均符合安全交接边界 |
| 不承担什么 | 不执行 handoff、不定义外部 receipt schema、不保存 archive / observability body、不改变 accepted truth |
| 后续承接 | Step 7 handoff boundary;Step 8 handoff precheck;Step 10 handoff failed / forbidden body;Step 11 target config;`03/04` contract |

关键字段骨架:

| 字段 | 类型 | 作用 |
|---|---|---|
| `handoff_target_ref` | `HandoffTargetRef` | 外部承接目标 |
| `handoff_scope_ref` | `HandoffScopeRef` | 交接范围 |
| `safe_material_ref` | `TraceHandoffSafeMaterialRef` | 安全交接 material marker |
| `trace_record_refs` | `List<IdentityTraceRecordRef>` | 交接涉及 trace 引用 |
| `visibility_context_ref` | `VisibilityContextRef` | 交接可见性上下文 |

状态集合骨架:

| 状态 | 作用 | 备注 |
|---|---|---|
| 本对象在概要层不单独定义状态集合 | policy 是校验对象,不保存长期状态 | 长期状态由 `TraceHandoffIntent` / `HandoffState` 承接 |

成员函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `assert_target_allowed(HandoffTargetRef handoff_target_ref, HandoffScopeRef handoff_scope_ref)` | `HandoffTargetRef handoff_target_ref`, `HandoffScopeRef handoff_scope_ref` | 校验 handoff target 与 scope 合法 |
| `assert_trace_refs_present(List<IdentityTraceRecordRef> trace_record_refs)` | `List<IdentityTraceRecordRef> trace_record_refs` | 校验交接至少绑定正式 trace |
| `assert_safe_material_body_free(TraceHandoffSafeMaterialRef safe_material_ref)` | `TraceHandoffSafeMaterialRef safe_material_ref` | 防止交接正文或包体 |
| `assert_visible_for_handoff(VisibilityContextRef visibility_context_ref)` | `VisibilityContextRef visibility_context_ref` | 校验交接可见性 |
| `assert_receipt_is_marker(HandoffReceiptRef receipt_ref)` | `HandoffReceiptRef receipt_ref` | 校验 receipt 只能是 marker / ref |

工厂函数骨架:

| 函数 | 参数 | 作用 |
|---|---|---|
| `for_handoff(HandoffTargetRef handoff_target_ref, HandoffScopeRef handoff_scope_ref, TraceHandoffSafeMaterialRef safe_material_ref, List<IdentityTraceRecordRef> trace_record_refs, VisibilityContextRef visibility_context_ref)` | `HandoffTargetRef handoff_target_ref`, `HandoffScopeRef handoff_scope_ref`, `TraceHandoffSafeMaterialRef safe_material_ref`, `List<IdentityTraceRecordRef> trace_record_refs`, `VisibilityContextRef visibility_context_ref` | 构造 trace / audit / archive handoff guard |

禁止事项:

| 禁止项 | 原因 |
|---|---|
| 不允许 handoff material 携带外部正文、raw log 或 package | 交接只允许 safe marker |
| 不允许无 trace refs 的 handoff intent | handoff 必须可追溯 |
| 不允许实现侧自造 target / receipt schema | target / receipt 后移 `03/04` |
| 不允许 handoff 成功回写为业务 truth 变化 | 交接状态与业务 truth 分离 |

#### 7.12.4 本批被并入 / 后移的候选

| 候选 | 处理 | 理由 | 后续位置 |
|---|---|---|---|
| `OutboxPendingView` | 并入 `IdentityOutboxRecord` 查询视图 | pending view 只是 outbox records 的读取切片,不是独立 truth | 本批 `IdentityOutboxRecord`;Step 7 outbox query/job |
| `HandoffTraceRecord` | 并入 `IdentityTraceRecord` / `TraceHandoffIntent` | handoff 需要追溯,但不应形成第二套 trace;状态和 intent 已有正式主语 | 6-F `IdentityTraceRecord`;本批 `TraceHandoffIntent`;Step 8 handoff flow |
| `TopicKey` / `TopicKeyRef` | 作为字段 / boundary ref | topic / routing 是事件边界 marker,不是 identity-owned object | Step 7 event boundary;Step 11 config impact;`03/04` topic contract |
| `HandoffTargetRef` / `HandoffReceiptRef` | 作为字段 / boundary ref | target / receipt 是外部交接边界 marker,不是 identity-owned object | Step 7 handoff boundary;`03/04` handoff contract |
| event envelope schema / handoff adapter / publisher runner | 排除 | 这些属于 Step 7 / `03` 接口或实现承载,不是 Step 6 关键对象 | Step 7 / Step 8 / `03` |

#### 7.12.5 本批停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 5 候选是否全部处理 | 通过 | 8 个显式候选和 topic / handoff target refs 均已正式化、并入、后移或作为边界 marker |
| 正式对象是否有功能来源 | 通过 | `IdentityOutboxRecord`、`TraceHandoffIntent`、`OutboxState`、`HandoffState`、`OutboundEventPolicy`、`HandoffPolicy` 均回指 `FR-ID-012~013` / `BR-ID-013~014` 和 accepted fact propagation 架构机制 |
| 被并入 / 后移 / 排除名称是否有理由 | 通过 | pending view 并入 outbox 查询视图,handoff trace 并入 trace / intent,topic / target / receipt 作为 boundary refs,envelope / adapter / runner 排除 |
| 是否越过组成部分边界 | 通过 | 未定义 event envelope schema、publisher adapter、handoff receipt schema、外部正文或下游 consumer truth |
| 字段 / 函数是否保持概要粒度 | 通过 | 只写字段 / 类型 / 作用和函数参数骨架,未写 topic 字符串、port、repository、runner、DTO 或事务 |
| Step 8 / Step 9 预期对象是否悬空 | 暂无悬空 | prepare outbox、publish outbox、prepare handoff、handoff delivery / failed 分支可引用本批对象;下一批进入跨对象一致性审计 |

### 7.13 6-I 跨对象一致性审计

#### 7.13.1 审计目标

本批不新增主要组成部分对象,只统一审计 6-A~6-H 的对象归属、重复对象合并、状态主语、边界引用、Step 8 / Step 9 反查和正式 §6 回填条件。

| 审计项 | 目标 |
|---|---|
| 正式对象索引 | 确认所有正式关键对象都有所属组成部分、对象类型和功能来源 |
| 合并 / 后移 / 排除闭合 | 确认 Step 5 候选没有悬空名称 |
| 状态对象归属 | 确认状态不是散落字段或重复状态机 |
| trace / audit / history 归属 | 确认跨组成部分追溯对象统一到 `IdentityTraceRecord` / `AuditTrail` |
| projection / report / outbox / handoff 边界 | 确认只读、report-only 和 eventual propagation 没有串线 |
| Step 8 / Step 9 反查 | 确认后续处理流和状态流转有稳定对象主语 |

#### 7.13.2 最终正式关键对象索引

| 对象 | 所属组成部分 | 对象类型 | 功能来源 | 后续主要承接 |
|---|---|---|---|---|
| `GlobalMember` | 身份锚定与成员真相 | Truth aggregate | `FR-ID-001`, `FR-ID-003`, `BR-ID-001`, `BR-ID-003` | Step 7 create/read;Step 8 establish member;Step 9 anchor |
| `IdentityAnchorState` | 身份锚定与成员真相 | State value | `FR-ID-003`, `BR-ID-001`, `VETO-ID-001` | Step 9 anchor state |
| `IdentityAnchorPolicy` | 身份锚定与成员真相 | Policy / Guard | `FR-ID-001~003`, `BR-ID-001~003`, `VETO-ID-001~002` | Step 8 create/read guard |
| `GlobalLifecycleState` | 全局生命周期 | State value / Truth state | `FR-ID-004`, `BR-ID-004`, `BR-ID-006` | Step 8 lifecycle flow;Step 9 lifecycle state |
| `LifecycleTransitionPolicy` | 全局生命周期 | Policy / Guard | `FR-ID-004`, `BR-ID-004`, `BR-ID-006` | Step 8 lifecycle guard |
| `HighRiskLifecycleGuard` | 全局生命周期 | Policy / Guard | `FR-ID-005`, `BR-ID-005`, `VETO-ID-004` | Step 8 high-risk lifecycle;Step 10 missing basis |
| `RoleCapabilitySummary` | 角色能力摘要 | Truth / Snapshot | `FR-ID-006`, `FR-ID-007`, `BR-ID-008` | Step 8 role capability flow;Step 9 summary state |
| `RoleCapabilitySourceSnapshot` | 角色能力摘要 | Reference / Snapshot | `FR-ID-006~008`, `BR-ID-007` | Step 7 source resolver;Step 8 source change |
| `RoleCapabilitySourcePolicy` | 角色能力摘要 | Policy / Guard | `BR-ID-007~009`, `VETO-ID-003` | Step 8 source / evidence guard |
| `CareerRecord` | 身份生涯记录 | Truth / History | `FR-ID-009`, `BR-ID-010~011`, `BR-ID-014` | Step 8 append career;Step 9 append state |
| `CareerAppendPolicy` | 身份生涯记录 | Policy / Guard | `BR-ID-010~011`, `NFR-ID-006~007` | Step 8 career append guard |
| `MemoryReference` | 记忆引用关系 | Truth / Reference relation | `FR-ID-010~011`, `BR-ID-012`, `AC-ID-010` | Step 8 memory ref link / refresh / migrate |
| `MemoryReferenceState` | 记忆引用关系 | State value | `FR-ID-010~011`, `AC-ID-010` | Step 9 memory reference state |
| `MemoryReferencePolicy` | 记忆引用关系 | Policy / Guard | `BR-ID-012`, `BR-ID-014`, `VETO-ID-003` | Step 8 memory ref guard |
| `MemberSummaryView` | 身份事实消费与追溯 | Projection / Read model | `FR-ID-012`, `BR-ID-013`, `AC-ID-005` | Step 7 query;Step 8 read summary |
| `IdentityTraceRecord` | 身份事实消费与追溯 | Trace / History record | `FR-ID-013`, `BR-ID-014`, `NFR-ID-005` | Step 8 accepted change trace |
| `AuditTrail` | 身份事实消费与追溯 | Audit / History aggregate | `FR-ID-013`, `BR-ID-014`, `AC-ID-005` | Step 7 audit query;Step 8 read audit |
| `VisibilityPolicy` | 身份事实消费与追溯 | Policy / Guard | `BR-ID-013`, `OQ-ID-004`, `NFR-ID-004` | Step 8 query / trace / event visibility |
| `ProjectionState` | 派生维护与对账 | Projection / State value | `FR-ID-014`, `BR-ID-015`, `AC-ID-005` | Step 8 projection rebuild;Step 9 projection state |
| `ReferenceResolutionState` | 派生维护与对账 | Reference / State value | `FR-ID-014`, `BR-ID-015`, `AC-ID-005` | Step 8 reference refresh;Step 9 reference state |
| `ReconciliationPolicy` | 派生维护与对账 | Policy / Guard | `BR-ID-015`, `VETO-ID-005` | Step 8 reconciliation guard |
| `ReconciliationReport` | 派生维护与对账 | Report / Finding | `FR-ID-014`, `BR-ID-015`, `AC-ID-005` | Step 8 reconciliation report |
| `IdentityOutboxRecord` | 身份事实传播与外部交接 | Outbox record | `FR-ID-012`, `BR-ID-013`, accepted fact propagation | Step 8 prepare / publish outbox;Step 9 outbox state |
| `TraceHandoffIntent` | 身份事实传播与外部交接 | Handoff object | `FR-ID-013`, `BR-ID-014`, trace / archive handoff | Step 8 prepare / deliver handoff;Step 9 handoff state |
| `OutboxState` | 身份事实传播与外部交接 | State value | `FR-ID-012`, eventual propagation | Step 9 outbox state |
| `HandoffState` | 身份事实传播与外部交接 | State value | `FR-ID-013`, `BR-ID-014` | Step 9 handoff state |
| `OutboundEventPolicy` | 身份事实传播与外部交接 | Policy / Guard | `BR-ID-013`, `VETO-ID-003` | Step 8 event material guard |
| `HandoffPolicy` | 身份事实传播与外部交接 | Policy / Guard | `BR-ID-014`, `VETO-ID-003` | Step 8 handoff material guard |

#### 7.13.3 合并 / 后移 / 排除审计

| 名称 | 最终处理 | 审计结论 |
|---|---|---|
| `MemberAnchorView`, `LifecycleSummaryView`, `RoleCapabilityView`, `CareerSummaryView`, `MemoryReferenceView` | 并入 `MemberSummaryView` | 统一为成员摘要 read model 切片,无重复 view truth |
| `LifecycleTraceRecord`, `RoleCapabilityTraceRecord`, `CareerTraceRecord`, `MemoryReferenceTraceRecord`, `MaintenanceTraceRecord`, `HandoffTraceRecord` | 并入 `IdentityTraceRecord` 或 `ReconciliationReport` / `TraceHandoffIntent` | 统一追溯对象,避免每个组成部分重复建 trace truth |
| `RoleCapabilitySourceState` | 并入 `RoleCapabilitySourceSnapshot.source_state` | 来源状态必须绑定 snapshot / version |
| `IdentityTraceView`, `AuditEntry`, `HistoryRecord` | 并入 `AuditTrail` / `IdentityTraceRecord` | 统一 trace / audit / history 对象组 |
| `OutboxPendingView` | 并入 `IdentityOutboxRecord` 查询视图 | pending view 是 outbox records 的读取切片 |
| `GovernanceBasisRef`, `ProjectParticipationRef`, `WorkSourceRef`, `RoleSourceRef`, `CapabilitySourceRef`, `CapabilityEvidenceRef` | boundary refs | 保留为字段 / 接缝引用,不成为 identity-owned object |
| `MemoryRef`, `ArchiveRef`, `ArchiveHandoffRef`, `ExternalReferenceRef`, `MaintenanceScopeRef`, `TopicKeyRef`, `HandoffTargetRef`, `HandoffReceiptRef` | boundary refs / markers | 后续 Step 7 / `03/04` 定义协议和配置,本 Step 不脑补 schema |
| `Project`, `WorkItem`, `ProjectMember`, `RoleDefinition`, `CapabilityDefinition` | 排除 | 相邻仓 truth / body,不得进入 identity 对象轮廓 |
| memory body、embedding、index、archive package、artifact body、conversation body、runtime body、credential、secret | 排除 | forbidden body,不得进入 truth、projection、event、trace、report 或 handoff |
| repository、port、resolver、publisher、handoff adapter、handler、runner、event envelope schema、job DTO、DDL、topic 字符串 | 排除 / 后移 | 属于 Step 7 / `03` / `04` 或实现层,不是 Step 6 关键对象 |

#### 7.13.4 状态对象归属审计

| 状态维度 | 正式主语 | 审计结论 |
|---|---|---|
| 身份 ref 锚定与不可复用 | `IdentityAnchorState` | 不与 lifecycle 状态混合 |
| 成员全局可用性 | `GlobalLifecycleState` | 不表达 runtime / ProjectMember 状态 |
| role / capability 来源状态 | `RoleCapabilitySourceSnapshot.source_state` | 不另建 `RoleCapabilitySourceState` |
| career append 语义 | `CareerRecord.record_state` | 只表达追加历史,不写 work truth |
| memory / archive 引用状态 | `MemoryReferenceState` | 不表达外部 carrier 完整状态机 |
| 成员摘要 projection freshness | `ProjectionState` | 不作为第二 truth |
| 外部引用解析状态 | `ReferenceResolutionState` | 不自动修复外部 truth |
| outbox publish 状态 | `OutboxState` | 与 command accepted 状态分离 |
| trace / archive handoff 状态 | `HandoffState` | 与 memory reference migration state 区分 |

#### 7.13.5 Step 8 / Step 9 反查清单

| 后续流 / 状态 | 可反查对象 | 当前结论 |
|---|---|---|
| 建立成员身份主语 | `GlobalMember`, `IdentityAnchorState`, `IdentityAnchorPolicy`, `IdentityTraceRecord`, `IdentityOutboxRecord` | 对象主语闭合 |
| 读取成员摘要 | `MemberSummaryView`, `VisibilityPolicy`, `ProjectionState` | query no-write 主语闭合 |
| 生命周期迁移 | `GlobalLifecycleState`, `LifecycleTransitionPolicy`, `HighRiskLifecycleGuard`, `IdentityTraceRecord` | lifecycle / basis guard 主语闭合 |
| 维护角色能力摘要 | `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, `RoleCapabilitySourcePolicy`, `ReferenceResolutionState` | source / summary 主语闭合 |
| 追加生涯记录 | `CareerRecord`, `CareerAppendPolicy`, `IdentityTraceRecord` | append-only 主语闭合 |
| 关联 / 刷新 / 迁移 memory refs | `MemoryReference`, `MemoryReferenceState`, `MemoryReferencePolicy`, `ReferenceResolutionState` | ref-only 主语闭合 |
| 读取 trace / audit | `IdentityTraceRecord`, `AuditTrail`, `VisibilityPolicy` | trace / visibility 主语闭合 |
| 重建投影 | `ProjectionState`, `ReconciliationPolicy`, `ReconciliationReport` | projection no-write 主语闭合 |
| 刷新外部引用状态 | `ReferenceResolutionState`, `ReconciliationPolicy`, `ReconciliationReport` | reference refresh report-only 主语闭合 |
| 生成对账发现 | `ReconciliationPolicy`, `ReconciliationReport`, `IdentityTraceRecord` | report-only finding 主语闭合 |
| 准备 / 发布 outbox | `IdentityOutboxRecord`, `OutboxState`, `OutboundEventPolicy` | eventual propagation 主语闭合 |
| 准备 / 交付 handoff | `TraceHandoffIntent`, `HandoffState`, `HandoffPolicy` | handoff 主语闭合 |

#### 7.13.6 不变量覆盖审计

| 不变量 | 承接对象 | 审计结论 |
|---|---|---|
| identity ref 不复用 | `IdentityAnchorState`, `IdentityAnchorPolicy` | 已覆盖 |
| query / projection no-write | `IdentityAnchorPolicy`, `MemberSummaryView`, `ProjectionState`, `VisibilityPolicy` | 已覆盖 |
| 高风险 lifecycle basis | `HighRiskLifecycleGuard`, `GlobalLifecycleState` | 已覆盖,具体 basis resolver 后移 Step 7 / `03` |
| RoleDefinition / method body 不入仓 | `RoleCapabilitySourceSnapshot`, `RoleCapabilitySourcePolicy` | 已覆盖 |
| career append-only | `CareerRecord`, `CareerAppendPolicy`, `IdentityTraceRecord` | 已覆盖 |
| memory / archive ref-only | `MemoryReference`, `MemoryReferenceState`, `MemoryReferencePolicy` | 已覆盖 |
| consumer 只读与 visibility | `MemberSummaryView`, `VisibilityPolicy`, `AuditTrail` | 已覆盖,字段级 schema 后移 `03` |
| report-only maintenance | `ProjectionState`, `ReferenceResolutionState`, `ReconciliationPolicy`, `ReconciliationReport` | 已覆盖 |
| accepted fact eventual propagation | `IdentityOutboxRecord`, `OutboxState`, `OutboundEventPolicy` | 已覆盖 |
| handoff 不保存正文且不伪成功 | `TraceHandoffIntent`, `HandoffState`, `HandoffPolicy` | 已覆盖 |

#### 7.13.7 Step 6 最终停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 6-A~6-H 是否全部完成 | 通过 | 8 个主要组成部分均已按小循环完成 |
| Step 5 候选对象是否全部处理 | 通过 | 所有候选均已正式化、并入、后移或排除 |
| 是否存在重复 truth owner | 通过 | trace、summary、state、outbox、handoff 均已统一主语 |
| 是否存在相邻仓 truth / forbidden body 入仓 | 通过 | ProjectMember、RoleDefinition、memory body、archive package、runtime body 等均已排除 |
| 是否保持概要粒度 | 通过 | 未写 repository / port / DTO / DDL / transaction / full enum / complete Rust signature |
| Step 8 / Step 9 是否有悬空对象主语 | 通过 | 关键处理流和状态维度均可反查正式对象 |
| 是否可以进入 Step 7 | 通过 | Step 7 可基于本 Step 对象抽取 command / query / event / job / boundary 接口骨架 |

---

## 8. 复杂度判断 / 是否拆分

Step 6 已按主要组成部分小循环拆分完成。拆分是必要的,原因:

- Step 5 已输出 8 个主要组成部分,每个部分都有独立 capability、对象线索和非职责。
- 旧的一次性对象总表已证明会丢失对象来源、合并理由和排除理由。
- trace / audit / history / outbox / handoff 等横切对象必须在局部归属和跨对象审计之间往返判断。
- Step 6 的字段 / 函数骨架若一次性生成,容易越界进入详细设计。

实际拆分方式:

- 主文件保留 Step 6 统一框架、候选池规则、小循环计划、跨对象审计和回填草稿。
- 6-A~6-H 连续写入本文件,每批都保留候选处理、对象索引、对象独立小节、并入 / 后移 / 排除和停审记录。
- 6-I 统一完成跨对象一致性审计,未新增主要组成部分对象。
- 不创建 Step 7~Step 14 的未来文件。

---

## 9. 回填草稿

正式 `02-概要设计.md` §6 后续应回填以下结构。正式正文要等 Step 14 统一装配,当前只形成回填草稿:

1. 对象候选池筛选说明。
2. 关键对象索引表。
3. 按主要组成部分组织的关键对象独立小节。
4. 每个对象的基本信息、关键字段、状态集合、成员函数、工厂函数和禁止事项。
5. 被并入 / 排除候选对象说明。
6. 每个主要组成部分对象正式化停审记录。
7. Step 8 / Step 9 反查清单。
8. 跨对象 / 跨组成部分一致性审计表。

正式 §6 应至少包含以下对象索引:

| 类别 | 对象 |
|---|---|
| Truth / core state | `GlobalMember`, `IdentityAnchorState`, `GlobalLifecycleState`, `RoleCapabilitySummary`, `CareerRecord`, `MemoryReference` |
| Policy / guard | `IdentityAnchorPolicy`, `LifecycleTransitionPolicy`, `HighRiskLifecycleGuard`, `RoleCapabilitySourcePolicy`, `CareerAppendPolicy`, `MemoryReferencePolicy`, `VisibilityPolicy`, `ReconciliationPolicy`, `OutboundEventPolicy`, `HandoffPolicy` |
| Reference / snapshot / projection state | `RoleCapabilitySourceSnapshot`, `MemoryReferenceState`, `ProjectionState`, `ReferenceResolutionState` |
| Projection / read model | `MemberSummaryView` |
| Trace / audit / report | `IdentityTraceRecord`, `AuditTrail`, `ReconciliationReport` |
| Outbox / handoff | `IdentityOutboxRecord`, `TraceHandoffIntent`, `OutboxState`, `HandoffState` |

正式 §6 不应包含 repository、port、handler、runner、adapter、event envelope schema、job DTO、DDL、topic 字符串、完整状态矩阵或完整 Rust 契约。

---

## 10. 待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可 Step 6 先建立框架、再按 6-A~6-I 逐批补充 | 若不认可,需要重新决定 Step 6 写入方式 | 当前按用户确认的“先写框架,再补充”执行 |
| 是否认可每个对象必须独立成节,总表只作为索引 | 若不认可,可能退回一次性总表 | 当前按最新版 SOP 执行 |
| 是否允许在单批过长时创建 Step 6 附录 | 若不允许,后续全部批次继续写入主文件 | 当前仅保留可能性,未创建附录 |
| 是否认可 6-A 的对象正式化结论 | 若不认可,需要重排锚定对象和后续输入 | 当前正式化 `GlobalMember`、`IdentityAnchorState`、`IdentityAnchorPolicy`,并入 / 后移 `MemberAnchorView`、`IdentityTraceRecord` |
| 是否认可 6-B 的对象正式化结论 | 若不认可,需要重排 lifecycle 对象和后续 6-C 输入 | 当前正式化 `GlobalLifecycleState`、`LifecycleTransitionPolicy`、`HighRiskLifecycleGuard`,并入 / 后移 `LifecycleSummaryView`、`LifecycleTraceRecord`,保留 `GovernanceBasisRef` 为 boundary ref |
| 是否认可 6-C 的对象正式化结论 | 若不认可,需要重排 role capability 对象和后续 6-D 输入 | 当前正式化 `RoleCapabilitySummary`、`RoleCapabilitySourceSnapshot`、`RoleCapabilitySourcePolicy`,并入 / 后移 `RoleCapabilitySourceState`、`RoleCapabilityView`、`RoleCapabilityTraceRecord`,保留 source / evidence refs 为 boundary refs |
| 是否认可 6-D 的对象正式化结论 | 若不认可,需要重排 career 对象和后续 6-E 输入 | 当前正式化 `CareerRecord`、`CareerAppendPolicy`,并入 / 后移 `CareerSummaryView`、`CareerTraceRecord`,保留 work refs 为 boundary refs,排除 work truth |
| 是否认可 6-E 的对象正式化结论 | 若不认可,需要重排 memory reference 对象和后续 6-F 输入 | 当前正式化 `MemoryReference`、`MemoryReferenceState`、`MemoryReferencePolicy`,并入 / 后移 `MemoryReferenceView`、`MemoryReferenceTraceRecord`,保留 memory / archive refs 为 boundary markers,排除正文和 package |
| 是否认可 6-F 的对象正式化结论 | 若不认可,需要重排 consumption / trace 对象和后续 6-G 输入 | 当前正式化 `MemberSummaryView`、`IdentityTraceRecord`、`AuditTrail`、`VisibilityPolicy`,并入 `IdentityTraceView`、`AuditEntry`、`HistoryRecord`,保留 consumer / visibility refs 为 boundary refs |
| 是否认可 6-G 的对象正式化结论 | 若不认可,需要重排 maintenance / reconciliation 对象和后续 6-H 输入 | 当前正式化 `ProjectionState`、`ReferenceResolutionState`、`ReconciliationPolicy`、`ReconciliationReport`,并入 `MaintenanceTraceRecord`,保留 external reference / maintenance scope 为 boundary refs |
| 是否认可 6-H 的对象正式化结论 | 若不认可,需要重排 propagation / handoff 对象和 Step 6 审计结论 | 当前正式化 `IdentityOutboxRecord`、`TraceHandoffIntent`、`OutboxState`、`HandoffState`、`OutboundEventPolicy`、`HandoffPolicy`,并入 `OutboxPendingView`、`HandoffTraceRecord`,保留 topic / target / receipt refs 为 boundary refs |
| 是否认可 6-I 的跨对象一致性审计 | 若不认可,需要回到对应批次修正对象归属 | 当前审计未发现 unresolved 对象归属、重复 truth owner 或 Step 8 / Step 9 悬空主语 |
| 是否认可 Step 6 完成并进入 Step 7 | 若不认可,需明确退回哪个批次或哪个对象 | 当前满足进入 Step 7 条件 |

---

## 11. 进入下一步条件

当前 Step 6 已完成。进入 Step 7 前必须满足的条件如下:

- 6-A~6-H 的主要组成部分对象正式化全部完成并通过停审:已满足。
- 每个 Step 5 候选对象都被处理为正式对象、并入或排除:已满足。
- 每个正式对象都能回指主要组成部分和功能来源:已满足。
- 字段、状态、成员函数、工厂函数均保持概要骨架粒度:已满足。
- Step 8 / Step 9 预计会引用的对象没有悬空:已满足。
- 跨对象 / 跨组成部分审计无 unresolved 冲突:已满足。
- 正式 `02` §6 回填草稿已形成:已满足。

用户审核通过后,可以进入 Step 7 `API / 接口骨架`。Step 7 必须基于本 Step 的对象结果抽取 command、query、event、job 和外部接缝,不得重新发明对象主语。
