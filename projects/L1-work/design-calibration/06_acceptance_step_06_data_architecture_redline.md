# Step 6. 定义数据边界与架构红线验收

> 本文件是 `projects/L1-work/06-验收标准.md` 的 Step 6 中间产物。
> 本步把数据所有权、架构边界、依赖裁剪和禁止反写真相转成可检查红线。
> 本步不展开每个 Command / Event / Job 的协议验收,这些留到 Step 7。

## 1. Step 状态

- 状态: `[x] 已确认`
- 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 6
- 回填章节: `projects/L1-work/06-验收标准.md` §6 数据边界与架构红线验收
- 生成日期: 2026-06-04

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` §10~§12 / §14 | `BR-WORK-001`~`027`、数据归属、接口依赖、`VF-WORK-*` | 红线来源 |
| `01-架构设计.md` §4 / §8 / §9 / §13 | 职责边界、唯一编译期依赖、数据所有权、横切安全和不可接受债务 | 架构验收依据 |
| `02-概要设计.md` §3 / §5 / §10 / §11 | 配置不可越界、组成部分边界、异常与配置影响 | 红线范围补充 |
| `03-详细设计.md` §5~§15 | 模块边界、query no-write、projection no-write、repository / UoW / error / config / audit 契约 | 可落码红线依据 |
| `04-配置设计.md` §4 / §8 / §11 / §12 | 禁止配置化、ref-only sensitive、fail-fast / fail-closed / marker、下游配置门禁 | 配置红线依据 |
| `05-测试方案.md` §5 / §10 / §13 | 规则族覆盖、redaction、forbidden output、evidence path | 证据来源 |

已确认结论:

```text
Work 只拥有项目工作事实真相。
外部正文、运行时执行正文、workspace 聚合正文、observability 全局日志正文和 archive 长期正文不得进入 Work。
Query、projection、reconciliation、report 和 maintenance 不得反写真相。
除 core-contracts 外,其他相邻仓不得作为编译期业务依赖。
```

## 3. SOP 问题回答

### 3.1 哪些数据不得由本仓保存?

本仓不得保存以下正文或真相:

| 禁止保存对象 | 来源边界 | 允许替代 |
|---|---|---|
| identity 正文、GlobalMember / Role / Actor 生命周期正文 | `L1-identity` | `GlobalMemberRef`、`ActorRef`、ProjectMember capability snapshot |
| conversation fact 正文、聊天消息、Chat UI 状态 | `L1-conversation` | conversation ref、trace ref、context summary |
| method-library 定义正文、ViewProfile 正文 | `L3-method-library` | method definition ref / safe snapshot |
| ProcessInstance、Activity、checkpoint、process planning 正文 | `L1-process` | process ref、timebox ref、planning summary |
| Gate、Policy、Control、Approval 决策正文 | `L1-governance` | governance decision ref / summary |
| Artifact、evidence、baseline、ImplementationPlan 正文 | `L1-artifact` | evidence ref、baseline ref、ImplementationPlanRef、PlanItemRef、safe summary |
| agent loop、tool invocation、runtime progress、execution step 正文 | `L2-runtime` | runtime source ref、promote intake marker |
| PersonalWorkspace、ProjectWorkspace、dashboard 聚合正文 | `L1-workspace` | Work view refs、derived read model |
| observability 全局日志正文 | `L4-observability` | trace / audit / handoff ref |
| archive 长期归档包正文 | `L4-archive` | archive handoff ref / marker |
| raw secret、token、payload、source body | 配置 / 外部输入 | ref-only sensitive、digest、redacted marker |

### 3.2 哪些下游不得反向改写真相?

任何下游消费方、相邻仓或维护动作都不得直接创建或修改 Work truth。

| 下游 / 维护面 | 禁止行为 | 正确方式 |
|---|---|---|
| `L1-workspace` | workspace view / UI action 直接改 Project、WorkItem 或 Iteration truth | 调用正式 command 或只读消费 |
| `L1-conversation` | conversation suggestion 直接创建 WorkItem | 通过 formalize / promote 边界 |
| `L1-process` | planning / Activity 推进直接维护 Backlog 或 Iteration truth | 使用 process ref / timebox ref,由 Work command 显式改变 |
| `L1-governance` | governance decision 直接改变 Work truth | 保存 governance ref / summary,由正式入口承接 |
| `L1-artifact` | evidence / ImplementationPlan 正文直接完成或创建 Work truth | 保存 evidence ref / plan ref,由正式规则判断 |
| `L2-runtime` | runtime plan item / progress 直接写 Backlog 或 child WorkItem | 保存 promote request / source ref,等待 review |
| report / reconciliation | report 发现差异后自动修复 truth | 输出 read-only report |

### 3.3 哪些 projection / cache 不得反写真相?

以下派生 / 缓存 / 报告对象只能从 Work truth 派生,不得成为写源:

| 派生对象 | 禁止行为 | 证据方向 |
|---|---|---|
| ProjectBoardView | 看板拖动或重建结果直接写 WorkItem / Iteration | query no-write、projection no-write |
| MemberWorkView | 成员视图反向改变 ProjectMember 或 assignment | query no-write |
| IterationSummaryView | summary 修复 commitment 或 work state | projection no-write |
| WorkSearchProjection | search index 结果创建或修改 WorkItem | projection rebuild no-write |
| ReconciliationReport | 对账报告自动修复 truth / projection / outbox | `TC-WORK-OPS-004` |
| trace / handoff marker | handoff 成功或失败改变业务 truth | handoff marker only |
| cache / local materialized view | cache miss / rebuild 写业务 truth | no-write and stale surface |

### 3.4 哪些 P1 能力不得污染 P0?

P1/P2 能力可以后续增强,但不能改变 P0 truth、边界或证据。

| P1/P2 能力 | 不得污染的 P0 边界 |
|---|---|
| 高级看板 / 多视图 | 不得把视图状态写成 Work truth |
| 自动维护建议 | 不得直接 resolve blocker、spillover 或改变 Iteration |
| 容量趋势 | 不得改变 ProjectMember responsibility 或 commitment |
| 跨项目依赖理解 | 不得改变单项目 dependency truth |
| production-like durable adapter | 不得引入非 core compile dependency 或 fake production success |
| remote config / hot reload | 不得关闭 truth、idempotency、visibility、audit、outbox、query / projection no-write |
| advanced search backend | 不得把 search index 作为 Work truth source |

### 3.5 红线失败时是否一票否决?

红线失败分两类:

| 红线失败类型 | 裁决 |
|---|---|
| 触发 `VF-WORK-*`、raw secret / raw payload 泄露、依赖裁剪失败、证据不可复核 | Step 11 一票否决候选 |
| 未触发一票否决但影响 P0 gate | Step 12 按 S / A 缺陷处理,通常阻断通过 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| 旧 `06-验收标准.md` §6 | “三红线”只有可审计、可追溯、可裁剪,没有完整数据归属红线 | 无法覆盖外部正文、query no-write、projection no-write | 重建红线表 |
| 旧 `06-验收标准.md` §7 | 安全与治理门禁过泛,未绑定 `VF-WORK-*` 和 evidence | 难以判定失败是否一票否决 | 增加否决候选 |
| 新版 `00` / `01` | 数据归属和依赖裁剪已完整 | 可作为红线真相源 | 本步承接 |
| 新版 `04` | 配置不得绕过核心边界 | 需要进入验收红线 | 本步引用配置红线 |
| 新版 `05` | 已有规则族覆盖和 redaction evidence | 可作为红线证据 | 本步引用 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据边界 | 泛化写可审计 / 可追溯 / 可裁剪 | 明确 truth / snapshot / ref / forbidden body | 对齐数据归属 |
| 下游反写 | 未系统列明 | 列明 workspace、conversation、process、governance、artifact、runtime、report / reconciliation 禁止反写 | 防止多真相 |
| Projection / cache | 只写只读视图 | 明确每个派生对象不得反写真相 | 可检查 |
| 配置红线 | 旧 06 未覆盖 | 引入配置不得关闭核心边界、fake 不得 production success | 承接 04 |
| 一票否决 | 散落 | 标出触发 `VF-WORK-*` 的红线失败 | 支撑 Step 11 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只保留旧“三红线” | 简短 | 覆盖不了当前数据归属、配置和依赖裁剪风险 | 不采用 |
| 方案 B: 按数据归属 + 反写禁止 + 派生 no-write + 依赖裁剪组织红线 | 覆盖主要架构风险,可绑定证据 | 表更长,后续 Step 11 仍需归并否决项 | 采用 |
| 方案 C: 把所有安全 / 非功能一起写入本步 | 看起来完整 | 会混淆 Step 9 / Step 10 / Step 11 边界 | 不采用 |

推荐方案 B。

原因:

- L1-work 最大架构风险是多真相和外部正文入仓。
- 红线必须可检查,不能只写原则。
- 非功能和证据红线需要后续 Step 继续裁决,本步只固定数据和架构边界。

## 7. 结构化中间产物

### 7.1 架构红线验收表

| 红线 ID | 红线 | 通过条件 | 失败条件 | 证据来源 | 一票否决候选 |
|---|---|---|---|---|---|
| `RL-WORK-DATA-001` | Work truth ownership | Project、ProjectMember、Backlog、WorkItem、child WorkItem、dependency / blocker、Iteration、promote result 和 trace / audit 归 Work | Work truth 缺失、转交下游仓拥有或被外部来源直接定义 | `EV-WORK-CORE-*`;`EV-WORK-FORMAL-*`;`EV-WORK-ITER-*`;`EV-WORK-DEP-*` | 是,`VF-WORK-001` |
| `RL-WORK-DATA-002` | 外部正文禁止入仓 | identity / conversation / method / process / governance / artifact / runtime / workspace / observability / archive 正文均不保存 | 任一外部正文、raw payload、source body 或 runtime progress body 入仓 / 入 report | `EV-WORK-FORMAL-004`;`EV-WORK-PROMOTE-004`;`EV-WORK-CFG-010`~`012`;redaction report | 是,`VF-WORK-004` / `VF-WORK-005` |
| `RL-WORK-DATA-003` | Snapshot / ref 不成真相 | 外部 snapshot 只服务判断、解释和消费;ref 不接管正文生命周期 | snapshot 被用作独立业务真相或 ref 失效导致 Work 造真相 | `EV-WORK-MEMBER-*`;`EV-WORK-QUERY-*`;`EV-WORK-OPS-*` | 视影响,可能 |
| `RL-WORK-ARCH-001` | ProjectMember / identity 分离 | Work 只表达项目内承担;identity 生命周期仍在 identity | ProjectMember 接管 GlobalMember、Role、Actor 生命周期或正文 | `EV-WORK-MEMBER-001`~`004`;`EV-WORK-NFR-003` | 是,`VF-WORK-003` |
| `RL-WORK-ARCH-002` | Formal work 不被外部步骤污染 | Backlog / WorkItem / child WorkItem 不接收 personal checklist、conversation suggestion、runtime step 直写 | 外部步骤、conversation suggestion、runtime plan item 或 ImplementationPlan body 成为 Work truth | `EV-WORK-FORMAL-*`;`EV-WORK-PROMOTE-*` | 是,`VF-WORK-002` / `VF-WORK-005` |
| `RL-WORK-ARCH-003` | Process / governance / artifact 不反写真相 | process planning、governance decision、artifact evidence 只能作为 ref / summary / marker | process / governance / artifact 直接创建或修改 Work truth | `EV-WORK-FORMAL-*`;`EV-WORK-DEP-*`;`EV-WORK-OPS-*` | 是,`VF-WORK-006` |
| `RL-WORK-ARCH-004` | Query no-write | Query 不写 truth、audit、outbox、idempotency、freshness marker 或 reference state | 任一 Query 触发创建、修复、rebuild 或写入 | `EV-WORK-QUERY-001`~`008` | 是,`VF-WORK-006` |
| `RL-WORK-ARCH-005` | Projection / cache no-write | projection / search / board / cache / summary 只从 truth 派生 | 派生结果反写 Project、WorkItem、Iteration、dependency 或 outbox | `EV-WORK-QUERY-*`;`EV-WORK-OPS-002`;`EV-WORK-OPS-004` | 是,`VF-WORK-006` |
| `RL-WORK-ARCH-006` | Reconciliation / report read-only | 对账和报告只生成 evidence / report,不得自动修复业务 truth | reconciliation report 自动修改 truth、projection 或 outbox | `EV-WORK-OPS-004` | 是,`VF-WORK-006` |
| `RL-WORK-ARCH-007` | 唯一编译期依赖 | 只有 `core-contracts` 作为 compile dependency;其他相邻仓通过 runtime / event / handoff / fake | 非 core sibling repo 进入 Cargo path dependency 或源码业务依赖 | dependency report / build metadata / implementation review | 是,`VF-WORK-008` |
| `RL-WORK-CONFIG-001` | 配置不得关闭核心边界 | 配置不能关闭 truth、metadata、idempotency、visibility、audit / outbox、query / projection no-write 或 redaction | 存在配置使核心边界失效、silent ignore 或 fake production success | `EV-WORK-CFG-013`~`017`;`EV-WORK-NFR-003` | 是,按影响 |
| `RL-WORK-EVID-001` | 证据路径可复核 | artifact / report 固定 `<run_id>`,无 `latest`;redaction passed | 使用 `latest`、错误 root、缺 P0 evidence 或 raw secret / payload 命中 | `EV-WORK-NFR-005`;release evidence pack | 是,证据红线 |

### 7.2 不得保存正文清单

| 类别 | 禁止内容 | 允许内容 |
|---|---|---|
| identity | GlobalMember / Role / Actor 正文 | `GlobalMemberRef`、`ActorRef`、capability snapshot |
| conversation | fact body、chat message、UI state | conversation ref、trace ref、context summary |
| method-library | definition body、ViewProfile body | method ref、definition summary |
| process | ProcessInstance、Activity、checkpoint | process ref、timebox ref |
| governance | Gate / Policy / Approval decision body | governance decision ref / summary |
| artifact | Artifact / evidence / baseline / ImplementationPlan body | evidence ref、baseline ref、plan ref、digest |
| runtime | execution progress、tool invocation、agent plan body | runtime source ref、promote intake marker |
| workspace | dashboard / aggregation body | Work view ref、projection output |
| observability / archive | global log body、archive package body | trace / archive handoff ref |
| config / evidence | raw secret、token、payload、source body | secret ref、credential ref、digest、redacted marker |

### 7.3 红线到否决项映射

| 红线 | 对应否决项 |
|---|---|
| 核心 truth 不成立 | `VF-WORK-001` |
| Formal work 被外部步骤污染 | `VF-WORK-002` / `VF-WORK-005` |
| ProjectMember 接管 identity | `VF-WORK-003` |
| 外部正文入仓 | `VF-WORK-004` |
| query / projection / maintenance 反写 | `VF-WORK-006` |
| 关键变化不可追溯 | `VF-WORK-007` |
| 非 core compile dependency | `VF-WORK-008` |

### 7.4 红线裁决图

#### 红线裁决图: 数据与架构边界

```text
Work truth
  -> Project / ProjectMember / Backlog / WorkItem / Iteration / Promote / Audit
        |
        +-- allowed: safe snapshots / refs / summaries
        |
        +-- forbidden: external body / runtime progress / workspace body

Derived surfaces
  -> query / projection / search / board / report / reconciliation
        |
        +-- allowed: read, rebuild, report, marker
        |
        +-- forbidden: write truth

Dependencies
  -> compile: core-contracts only
  -> runtime / event / handoff: all other siblings
```

关键说明:

- 红线失败不是普通功能缺陷;多数会进入一票否决候选。
- 外部正文、raw secret、raw payload 和 source body 只要进入正式数据或证据,即为红线失败。
- Query / projection / report 只读边界必须通过证据证明。
- 非 core 编译期依赖属于架构裁剪失败。

## 8. 验收输入影响判定

| 验收结论 | 是否影响上游设计 / 测试 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 确认 Work truth ownership 和外部正文排除为 P0 红线 | 否 | 数据边界门禁 | 无 | 无回写 |
| 确认 query / projection / reconciliation / report no-write 为 P0 红线 | 否 | 架构红线门禁 | 无 | 无回写 |
| 确认唯一编译期依赖为 `core-contracts` | 否 | 依赖裁剪门禁 | 无 | 无回写 |
| 确认配置不得关闭核心边界或伪造 fake production success | 否 | 配置红线承接 | 无 | 无回写 |
| 确认红线失败进入 Step 11 一票否决候选 | 否 | 验收裁决承接 | Step 11 | 待后续 Step |

说明:

```text
本步没有新增数据归属、依赖类型、配置字段或测试证据。
本步只把已确认的边界规则转成验收红线。
```

## 9. 回填草稿

正式 `06-验收标准.md` §6 建议采用以下结构:

```text
6. 数据边界与架构红线验收
  6.1 Work truth ownership 红线
  6.2 外部正文和敏感材料禁止入仓
  6.3 下游 / 派生 / 维护不得反写真相
  6.4 依赖裁剪和配置红线
  6.5 红线到一票否决候选映射
```

正文草稿:

```text
本章红线用于判断 `L1-work` 是否仍然是项目工作事实真相仓。Work 只拥有 Project、ProjectMember、Backlog、WorkItem、child WorkItem、依赖 / 阻塞、Iteration、promote 结果和追溯记录。外部正文、runtime 执行正文、workspace 聚合正文、observability 全局日志正文、archive 长期正文和 raw secret / payload 均不得进入 Work 数据或验收证据。

Query、projection、search、board、reconciliation、report 和 maintenance 只能读、重建、标记或报告,不得反向创建或修改业务 truth。除 `core-contracts` 外,其他相邻仓不得成为编译期业务依赖。
```

## 10. 待确认事项

无阻塞进入 Step 7 的待确认事项。

后续 Step 必须继续收口:

- Step 7 逐项定义 Command / Query / Event / Job 与跨仓同步验收。
- Step 8 定义状态机、事务和一致性验收。
- Step 10 定义证据完整性、redaction 和审计门禁。
- Step 11 正式裁决一票否决项。

## 11. 进入下一步条件

- [x] 不得保存的数据清单已经列明。
- [x] 下游不得反写真相的范围已经列明。
- [x] projection / cache / report no-write 已经列明。
- [x] P1/P2 能力不得污染 P0 的边界已经列明。
- [x] 红线失败是否进入一票否决候选已经标出。
- [x] 用户审核并确认本 Step。
