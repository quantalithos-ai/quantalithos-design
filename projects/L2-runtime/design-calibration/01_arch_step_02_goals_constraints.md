# L2-runtime 01 架构 Step 2: 明确架构目标与约束

> 创建日期: 2026-08-07
> 状态: done_stop_review
> 当前模式: full-restart
> 回填位置: `01-架构设计.md` 第 2 章、第 3 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | `01_arch_step_01_requirement_baseline.md`、`00-需求文档.md`、架构 SOP / 书写规范、全局依赖规则、当前上游正式架构链 |
| 目标 | 将需求基线转译为架构目标、不可变约束、当前阶段可接受取舍和架构非目标 |
| 允许 | 收束结构性结果、owner 红线、truth 边界、失败姿态和阶段性架构收缩 |
| 禁止 | 画上下文 / 容器 / 依赖图，确定技术栈、协议字段、数据库、事务、API、实现目录或测试用例 |
| 用户门禁 | 用户以“继续”确认进入本 Step；本 Step 完成后立即停审，不自动进入 Step 3 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 架构目标问题回答与范围收束 | done | Step 2 SOP 问题回答 | pass |
| 旧材料目标 / 约束污染诊断 | done | historical_material 差异表 | pass |
| 架构目标 | done | `AGO-L2R-001~008` | pass |
| 不可变约束 | done | `AIC-L2R-001~012` | pass |
| 当前阶段可接受取舍 | done | `AT-L2R-001~007` | pass |
| 架构非目标 | done | `ANG-L2R-001~010` | pass |
| 复杂度与可落码性判断 | done | 复杂度驱动与后续输入门禁 | pass |
| 回填草稿与自检 | done_stop_review | 第 2 / 3 章候选与确认门禁 | pass |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 这个仓在架构层面要确保什么成立？ | Runtime 必须形成以受控 run 为中心的可恢复决策闭环：目标 / 计划工作态、上下文与记忆调解、provider-neutral model decision、行动 / 子代理编排、checkpoint / recovery 和 local outcome handoff 各自有清楚边界，并能沿同一 run 关联而不互相夺取真相。 |
| 哪些约束是不可变的？ | Runtime truth 只有一个 owner；相邻仓仍拥有其 definition、approval、execution、isolation、observation、artifact 和 provider control truth；除 `L0-core` 外不形成 sibling package 依赖；治理前置、能力前置或隔离前置不明确时只能 fail closed；unknown side effect、commit unknown、迟到 / 重复反馈不得盲重试或逆写历史；forbidden body、secret 和 hidden reasoning 不得进入 Runtime truth。 |
| 哪些约束是当前阶段可以接受的取舍？ | 在外部 owner 未闭口时，Runtime 只保留最小的 working / candidate / ref / attempt / gap 语义：长期记忆写入、model adapter 的物理路由、事件交付确认、丰富 replay / analytics、持久化原子性细节和数值性能目标均不进入当前核心闭环；这些收缩不会改变 Runtime 的本地真相和失败边界。 |
| 哪些目标可以明确判断，甚至量化？ | 当前可以判断结构性条件：每个核心能力节点都有唯一 owner、来源关联、合法失败出口和 local-truth-first 处理；可以对“未授权正文 / secret / hidden reasoning 不落入 truth”“外部 delivery / observed 不反写 outcome”“未知副作用不自动重试”等规则做后续验证。没有当前 workload、实现和测量 authority，不固定 P95、SLO、吞吐或可用性数字。 |
| 哪些事情虽相关，但不是本仓架构当前要解决的问题？ | Tools execution、capability registry / adapter truth、method body、Governance approval / policy truth、Sandbox isolation truth、Observability backend、provider secret / route / quota / cost、member-service 生命周期、member-images、marketplace、产品入口和 Artifact / Evidence / report 正文不属于 Runtime 架构主线。 |

## 3. 旧材料目标 / 约束污染诊断

| 历史口径 | 当前诊断 | 处置 |
|---|---|---|
| “Runtime 是 member 容器内的大脑进程” | 把逻辑运行 owner 绑定到宿主和部署形态，无法承接未来不同部署边界，也会吞并 member-service 生命周期。 | `historical_material`；目标改为受控 run 真相，不预设进程 / 容器。 |
| StateGraph、LangGraph、Temporal、Python 等主线 | 将技术机制提前写成架构目标，掩盖 run、history 和 handoff 边界尚未收敛。 | `historical_material`；技术机制留到 Step 10，且必须受本 Step 红线约束。 |
| 固定 loop / checkpoint / memory P95 与 99.9% SLA | 没有 workload、baseline 或测量 authority，属于未经核验的性能事实。 | 不继承数字；当前只保留可验证的结构性预算、失败和边界条件。 |
| Policy Cache、provider registry、vector store 直连 | 会复制 Governance、Hub、provider 或 durable memory 的 truth。 | 降级为 `runtime / ref / adapter` pending seam，不成为 Runtime owner。 |
| ExecutionPlan / WorkItem / Process backflow 主线 | 将 Work / Process / Artifact 正文和业务状态反向并入 Runtime。 | `historical_material`；Runtime 只保留 goal / plan working state 与外部 refs。 |
| 完整 ReasoningTrace 持久化、raw provider / tool body | 违反 body-free、secret 和 hidden reasoning 红线，扩大 handoff 暴露面。 | 不进入目标、约束或数据主线；只允许安全 decision summary / correlation。 |
| member IPC、SDK compile、同容器双进程 | 在入口、部署和消费关系未校准前锁定反向依赖。 | 下沉到 Step 4 / 6 / 9；SDK 作为下游 consumer，不能成为 Runtime package 依赖。 |

## 4. 设计取舍

### 4.1 取舍原则

本 Step 的取舍只针对 Runtime 可能承担但当前证据不足或会扩大核心闭环的内容。边界外 owner 的职责直接进入“架构非目标”，不以“阶段性取舍”掩盖 owner 归属。所有取舍均保留 `pending`、`blocked`、`degraded` 或 `fail-closed` 状态，不能被解释为实现或 readiness。

### 4.2 当前阶段可接受取舍表

| 取舍 | 当前口径 |
|---|---|
| `AT-L2R-001` durable episodic / semantic memory 深度 | 当前仅把 working memory、retrieval candidate、typed ref 和 unavailable / degraded 语义纳入核心；长期正文、索引、保留、删除和重建只保留最小承接，不纳入核心闭环，等待 owner 合同。 |
| `AT-L2R-002` model adapter 路由策略 | 当前只保证 provider-neutral intent、逻辑 selection 和明确失败；不为物理 provider fallback、quota / cost 优化或 route failover 建立 Runtime 主结构。 |
| `AT-L2R-003` 事件 handoff 完整交付 | 当前只保证已提交 Runtime fact、safe material、submission attempt 和 gap；delivery receipt、observed projection、downstream acceptance 作为独立外围结果，不回写本地 outcome。 |
| `AT-L2R-004` replay / analytics / learning | 当前作为只读或候选增强处理，不进入 run 推进、checkpoint 恢复或正式 outcome 的核心因果链。 |
| `AT-L2R-005` checkpoint 持久化细节 | 当前只收束 stable point、历史不可变、resume 起点和 unknown fence；存储介质、事务 / UoW、版本字段和原子写入机制留到概要 / 详细设计。 |
| `AT-L2R-006` 性能与容量目标 | 当前只保留 context budget、delegation budget、暴露最小化和可降级结构要求；不固定 P95、吞吐、并发、SLO 或成本数字。 |
| `AT-L2R-007` 运行入口和部署形态 | 当前只定义逻辑 Runtime boundary 和受控触发语义；入口协议、进程 / 容器拆分和宿主生命周期留到系统上下文、容器 / 部署和通信步骤。 |

这些取舍的共同代价是当前无法宣称长期 memory write、真实 model execution、可靠 delivery、完整 replay 或性能 readiness；收益是保持本地 truth、owner separation 和后续可替换 seam 不被未闭口上游绑死。

## 5. 结构化中间产物

### 5.1 架构目标结论

| 目标 ID | 架构目标 | 说明 | 追溯来源 |
|---|---|---|---|
| `AGO-L2R-001` | 承载以 controlled run 为中心的运行决策真相 | 如果 run、turn、暂停、等待和终止由入口、工具或成员宿主各自解释，恢复与结果语义会分叉。 | `ARB-L2R-001~003`; `G-L2R-001`; `C-L2R-1` |
| `AGO-L2R-002` | 支撑 goal / plan、context / memory 和 decision 的连续工作语境 | 目标分解、来源选择和当前决策必须在同一运行关联下连续推进，不能退化为互不关联的调用记录。 | `ARB-L2R-002~003,007`; `G-L2R-001~003`; `C-L2R-1~3` |
| `AGO-L2R-003` | 守住 Runtime orchestration 与外部 truth owner 的结构分离 | Runtime 可以编排和消费结果，但不能因需要连续运行而复制工具、能力、方法、治理、隔离或 artifact 真相。 | `ARB-L2R-004~006`; `AHC-L2R-001~003`; `G-L2R-002~003` |
| `AGO-L2R-004` | 允许 provider-neutral model 与受控 action / delegation 决策独立演进 | 逻辑模型意图和行动选择必须可追溯，但物理 provider、工具执行和子代理宿主可以由适配 seam 承接。 | `ARB-L2R-005~006`; `C-L2R-3~4`; `AT-L2R-002` |
| `AGO-L2R-005` | 支撑稳定点恢复而不重复未知副作用 | checkpoint、resume、reflection 和 recovery 必须形成新的可关联决定，并保护 immutable history 与 unknown fence。 | `ARB-L2R-008`; `AHC-L2R-006`; `G-L2R-004`; `C-L2R-5` |
| `AGO-L2R-006` | 保证 local truth first 的运行结果交接 | 本地 outcome、handoff attempt / gap、delivery、observed 和 downstream acceptance 必须是可区分的结构，外部失败不得改写本地结果。 | `ARB-L2R-011`; `AHC-L2R-008`; `G-L2R-005` |
| `AGO-L2R-007` | 让安全运行材料保持最小暴露且可关联 | decision / action / handoff 只携带 owner、ref、scope、freshness、purpose 和 correlation 所需的 safe material，不携带 forbidden body、secret 或 hidden reasoning。 | `ARB-L2R-010`; `AHC-L2R-007,009`; `C-L2R-2~5` |
| `AGO-L2R-008` | 保留可裁剪、可替换的外围扩展边界 | model adapter、durable memory、replay / analytics 和事件消费者可以在后续阶段接入，但不应成为当前核心 run truth 的隐式前置。 | `ARB-L2R-012`; `AT-L2R-001~004`; `L2R-UP-002,004,005` |

### 5.2 不可变约束结论

| 约束 ID | 约束 | 说明 | 直接保护的边界 |
|---|---|---|---|
| `AIC-L2R-001` | 不允许出现第二个 Runtime run / working state / decision / outcome truth owner | 编排调用方、成员宿主和下游消费者不得各自维护可覆盖 Runtime 真相。 | 单一 Runtime truth |
| `AIC-L2R-002` | 不因运行编排而拥有 Tools、Hub、Method、Governance、Sandbox、Observability、Artifact、provider 或 member lifecycle truth | consumer / coordinator 关系不能转化为 owner 转移。 | owner separation |
| `AIC-L2R-003` | 不复制外部 definition、policy、tool、isolation、capture、artifact、evidence 或 memory 正文 | Runtime 只保存允许的 ref、safe snapshot、candidate 或本地工作态。 | definition / execution /正文边界 |
| `AIC-L2R-004` | 除 `L0-core` 外不形成 sibling Cargo、path 或 package 编译依赖 | runtime、event、ref、adapter、fake 是协作 seam，不是 package 类型。 | 依赖方向 |
| `AIC-L2R-005` | governed、capability-bound 或 sandbox-required action 的前置缺失、冲突、stale、unknown 时必须 fail closed | 只能 reject、wait、blocked 或记录 gap，不得 host fallback 或自我授权。 | 安全失败边界 |
| `AIC-L2R-006` | 不对 commit unknown、side-effect unknown、late、duplicate 或 out-of-order feedback 盲重试 | 未确认副作用不能被当作无副作用，历史不能被逆写。 | 恢复与副作用边界 |
| `AIC-L2R-007` | 不把 secret、raw provider / tool / sandbox / artifact body 或 hidden reasoning 写入 truth、checkpoint 或 handoff | 安全摘要只能 body-free、redacted、可关联。 | 最小暴露 |
| `AIC-L2R-008` | 不允许 delivery、receipt、observed、downstream summary 或 acceptance 反写 local outcome | Runtime 先确认本地事实，再独立交接外部状态。 | local truth first |
| `AIC-L2R-009` | context、decision、action 和 handoff 必须有 owner / ref / scope / freshness / purpose / correlation 来源 | 不得从自由字符串、私有索引或未验证摘要猜测正式事实。 | source anchoring |
| `AIC-L2R-010` | `L2R-UP-001~008` 和 Step 1 风险未闭口前不得伪造 schema、route、adapter、receipt、evidence 或 readiness | fake、目录和静态设计不等于正向集成事实。 | pending preservation |
| `AIC-L2R-011` | 不以旧框架、语言、容器、SLA 或性能数字作为架构前提 | 没有当前 workload 和测量 authority 时只能保留结构性目标。 | 技术与 NFR 边界 |
| `AIC-L2R-012` | 不让 SDK、产品入口或 member-service 生命周期反向决定 Runtime package 边界 | Runtime 暴露下游可消费 seam，但不反向依赖下游实现。 | downstream direction |

### 5.3 当前阶段可接受取舍结论

见第 4.2 节 `AT-L2R-001~007`。这些取舍仅描述当前架构收缩，不授予任何外部 owner 的实现事实，也不替代后续 Step 的 schema、通信、配置、测试或验收门禁。

### 5.4 架构非目标结论

| 非目标 ID | 非目标 | 不展开原因 |
|---|---|---|
| `ANG-L2R-001` | 不设计 Tools execution、ToolDefinition 或 normalized tool outcome truth | 工具行动合同由 `L2-tools` 拥有，Runtime 只做 action orchestration 和结果 incorporation。 |
| `ANG-L2R-002` | 不设计 capability identity、registry、adapter descriptor 或 formal exposure truth | 能力接入事实由 `L3-capability-hub` 拥有，Runtime 只消费 controlled ref / safe summary。 |
| `ANG-L2R-003` | 不承载 method、role、process definition body 或运行外的正式业务过程状态 | 定义与过程 truth 由 `L3-method-library` / 上游业务 owner 保有。 |
| `ANG-L2R-004` | 不设计 effective governance、approval、policy 或 authorization truth | `L1-governance` 是裁决 truth owner，Runtime 不维护 local allowlist / policy cache。 |
| `ANG-L2R-005` | 不设计 Sandbox environment、execution run、capture、cleanup 或 isolation truth | 隔离执行由 `L4-sandbox` 拥有，Runtime 只承接条件 handoff 和安全结果引用。 |
| `ANG-L2R-006` | 不设计 Observability backend、retention、audit projection 或 observed truth | 观测与审计投影由 `L4-observability` 拥有，Runtime 只交接 safe material。 |
| `ANG-L2R-007` | 不承载 provider secret、physical route、quota、cost、billing 或 failover truth | 这些属于 provider / security / finance / adapter owner，不是 Runtime model decision。 |
| `ANG-L2R-008` | 不承载 member-service / member-images / marketplace / product UI 生命周期 | 宿主、构建、生态和入口均在本仓边界外。 |
| `ANG-L2R-009` | 不承载 Artifact、Evidence、report 正文、lineage truth 或正式验收 verdict | `L1-artifact` 和验收流程拥有正文 / 证据 / verdict，Runtime 只保留 refs / safe summaries。 |
| `ANG-L2R-010` | 不在本 Step 定义数据库、DTO、API path、repository、handler、事务或实现目录 | 这些属于后续概要、详细、配置、测试和实施阶段，不能反向约束本步架构目标。 |

## 6. 复杂度与可落码性判断

### 6.1 主要复杂度来源

| 复杂度来源 | 结构性表现 | 对后续架构的要求 |
|---|---|---|
| 多真相 owner 协作 | 同一 run 会消费 definition、decision、execution、observation 和 artifact refs，但只能有一个 Runtime local truth。 | 后续上下文、依赖、数据和交互必须标出 owner / consumer / handoff，不使用共享数据库真相。 |
| 可恢复闭环 | C1~C5 存在 committed continuation，且 unknown side effect 需要停止扩散。 | 后续必须明确稳定点、合法 resume 边界、不可逆事件和 blocked / waiting 分支。 |
| memory 层次 | working、episodic、semantic 的读取与候选写入生命周期不同。 | 后续数据所有权和交互方案必须区分正文、ref、candidate、snapshot 和 unavailable。 |
| 交付与观测分层 | local outcome、attempt、delivery、observed、acceptance 不是同一状态。 | 后续事件和一致性策略必须保持单向交接、独立失败和关联链。 |
| 开放 seam | Tools、Sandbox、Observability、model adapter、durable memory 尚有 pending / blocker。 | 任何正向架构只允许 adapter / event / ref / fake seam，并保留 fail-closed qualification gate。 |

### 6.2 当前复杂度判断

```text
边界 / owner 复杂度 = high
恢复 / 一致性复杂度 = high
控制流复杂度       = medium (以受控状态推进为主,不预设图框架)
外部 adapter 复杂度 = pending (不能用静态设计估算 ready)
部署复杂度         = deferred_to_step_06
字段 / 协议复杂度   = deferred_to_later_documents
```

本判断支持后续可落码性分析，但不产生实现结构或性能承诺。可落码的最小前提是：每个边界有 owner、consumer、source、failure 和 correlation；每个 pending seam 有 blocked / fake 语义；每个本地结果有不可逆历史和独立 handoff 状态。

## 7. 正反例审计

| 主题 | 可接受表达 | 不可接受表达 | 原因 |
|---|---|---|---|
| 架构目标 | “承载以 controlled run 为中心的运行决策真相” | “支持创建、查询、更新 run” | 前者是结构结果，后者是功能清单。 |
| 不可变约束 | “不允许 Runtime 复制 Governance policy truth” | “采用 Policy Cache 保证低延迟” | 后者既越权又提前锁实现。 |
| 当前取舍 | “长期 memory write 当前仅保留 candidate / ref seam” | “以后再做 durable memory” | 前者明确当前核心收缩和语义，后者是无边界 TODO。 |
| 架构非目标 | “不设计 Sandbox isolation truth” | “Sandbox 目前暂不稳定” | 非目标应说明 owner 边界，不用实现状态替代范围。 |
| NFR | “保持 budget、correlation 和 fail-closed 可验证” | “loop P95 < 50ms” | 当前无测量 authority，不得伪造数字。 |

## 8. 回填草稿

### 8.1 正式第 2 章“业务背景与驱动力”候选

平台已经具备方法定义、能力接入、工具行动、治理裁决、隔离执行和安全观测等相邻真相，但仍需要一个 owner 将这些受控输入组织成持续、可暂停、可恢复的 AI 成员运行决策。`L2-runtime` 的架构主线因此不是再次定义工具、能力或治理，而是承载 controlled run 的连续工作语境、决策与行动编排、恢复历史以及不反写外部真相的运行结果交接。

### 8.2 正式第 2 章“架构目标”候选

正式正文回填 `AGO-L2R-001~008`，仅保留目标与说明；问题回答、历史诊断、取舍理由和自检留在本文件。

### 8.3 正式第 3 章“约束条件”候选

正式正文回填 `AIC-L2R-001~012`、`AT-L2R-001~007` 和 `ANG-L2R-001~010` 三张表。正文不得新增本文件未出现的 owner、协议、字段、技术栈或 readiness 结论。

## 9. 自检与门禁

| 检查 | 结果 |
|---|---|
| 架构目标均为结构性结果，未写功能清单或实现方案 | pass |
| 不可变约束均为具体 owner / truth / dependency / failure 红线 | pass |
| 当前阶段取舍均属于 Runtime 潜在范围，并明确收缩后的处理方式 | pass |
| 架构非目标均有明确 owner / 边界归因，未与阶段性取舍混写 | pass |
| 已承接 `ARB-L2R-001~012`、`AHC-L2R-001~011` 和 `ARISK-L2R-001~009` | pass |
| 已保留 `L2R-UP-001~008` 的 pending / blocked / fail-closed 语义 | pass |
| 未写容器图、依赖图、数据库、字段、API、事务、测试或实现事实 | pass |
| 未伪造 SLA、性能、证据、run_id、commit、readiness 或签署 | pass |
| 未来 Step 3 文件未提前创建，正式 `01-架构设计.md` 未修改 | pass |

```text
gate_status = pass
document_status = done_stop_review_step_02
next_allowed_action = await_user_confirmation_for_01_arch_step_02
formal_document_write_allowed = false
future_step_files_allowed = false_until_user_confirmation
next_formal_document_allowed = false_until_step_16
commit_required = false
```
