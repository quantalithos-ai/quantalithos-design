# L2-runtime 01 架构 Step 13: 演进路线

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `01-架构设计.md` 第 14 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 10 关键技术机制、Step 11 路径取舍、Step 12 横切约束、Step 1~9 已停审边界与上游 blocker 台账 |
| 目标 | 说明当前阶段足够边界、后续结构演进、可接受 / 不可接受债务和触发条件 |
| 禁止 | 实施排期、任务拆单、组件 backlog、具体技术产品承诺、把边界外能力写成 Runtime 必做主线 |
| 当前上游条件 | `L2R-UP-001~008` 持续为 `pending / blocked / fail-closed`；不以 fake、目录或旧文档冒充正向 readiness |

## 1. 本步问题回答

| 问题 | 收敛回答 |
|---|---|
| 当前阶段做到哪里才算足够？ | Runtime 能独立表达受控 run、goal / plan working state、context / working memory、provider-neutral model decision、Tool / sub-agent orchestration、checkpoint / recovery / reflection、local outcome 与安全 handoff attempt；外部 owner 只通过正式 seam 被消费。 |
| 第一批必须守住哪些结构？ | Runtime controlled-run truth、immutable history、stable checkpoint、unknown-side-effect fence、local-truth-first、fail-closed precondition、bounded context / delegation、body-free safe projection，以及 compile / runtime / event / ref / adapter / fake 依赖分类。 |
| 哪些能力留到后续阶段？ | 正向 Tools-Sandbox mapping、Core / Bus / Observability Runtime-specific 合同、model adapter、durable memory owner、checkpoint physical persistence、事件 source / route、下游消费增强和 replay / analytics 等外围能力。 |
| 哪些债务当前可接受？ | 只要不破坏已锁定 owner、truth、依赖和失败红线，字段级合同、物理承载、协议、数值 NFR、外围投影和替换点未定均可暂存为设计债务。 |
| 哪些债务不可接受？ | owner 反转、把外部正文或 secret 带入 Runtime truth、fail-open / host fallback、unknown side effect 盲重试、delivery / observed 回写 outcome、非 Core sibling compile 依赖和伪造 readiness。 |
| 哪些条件会触发架构调整？ | 正式 owner contract、正向 adapter / route、真实部署承载或 workload 证据一旦改变边界、所有权、一致性、失败姿态或关键路径，就必须回开受影响架构 Step；单纯替换实现载体而不改变这些约束，不触发架构主线重写。 |

## 2. 历史演进路线污染审计

| 历史材料中的方向 | 诊断 | 当前处理 |
|---|---|---|
| StateGraph / LangGraph / Temporal 作为 Runtime 主体 | 将实现框架当成语义 owner，无法自动解决外部副作用、unknown 和跨仓 owner。 | `historical_material`；仅保留“受控状态推进 / 稳定恢复点”这一架构问题，框架不进入正式路线。 |
| Python、Rust、PostgreSQL、Redis、vector store、queue、scheduler 的固定组合 | 把实现载体和部署推断写成架构事实，当前没有 authority 或 workload 证据。 | `historical_material`；物理语言、存储、调度和协议后移到概要 / 详细 / 配置设计。 |
| Runtime 自有 Tool、Capability registry、Governance allowlist、Sandbox fallback | 反转 `L2-tools`、Capability Hub、Governance、Sandbox 的 owner，形成第二真相源。 | 明确排除；只保留正式 consumer / adapter seam，前置不明时 fail closed。 |
| 统一同步端到端 loop 或全异步事件 loop | 前者伪造长链即时完成，后者缺少即时受理 / 拒绝边界。 | 采用同步判断、异步传播、后台 continuation 三类路径分离。 |
| 每步 checkpoint + 自动 retry | 忽略 stable point 与 commit / side-effect unknown，可能重复不可逆副作用。 | 采用 stable point 与 unknown fence，恢复为新决定。 |
| 固定 SLA、P95、QPS、cost、retry 次数 | 没有真实 workload、测量或证据 authority。 | 保持数值 NFR pending，不写成当前架构承诺。 |

## 3. 当前阶段边界

当前阶段定义为“Runtime 逻辑主线成立阶段”。其完成标准是：Runtime 作为独立 controlled-run truth owner，可以在正式入口受理后建立 goal / plan working state，组合受控 context，形成中立 model decision，选择 action / delegation，承接外部结果，建立 stable checkpoint，在 reflection / recovery 中形成新决定，并先形成 local outcome，再尝试 body-free handoff。每一条外部正向能力均必须以 owner、source、scope、freshness、precondition 和 failure disposition 可解释地接入；接缝未闭合时只能返回 unavailable、waiting、blocked、unknown 或 gap。

当前阶段不要求：具体数据库或事件产品、部署拓扑、语言 / 框架、provider route / secret / quota / cost、durable memory 正文和索引、Tools execution、Capability registry、Governance policy、Sandbox isolation、Observability backend、Artifact / Evidence 正文或下游产品入口。上述事项即使存在静态设计文件，也不能被解释为 Runtime 已具备的正向承载。

## 4. 演进阶段结论

| 阶段 | 结构目标 | 允许新增 | 必须保持不变 | 进入条件 | 退出判断 |
|---|---|---|---|---|---|
| P1 本地 Runtime 逻辑主线成立 | 先使 controlled run、五核心语境、checkpoint / recovery、local outcome 在本地语义上闭合。 | working state、safe decision summary、候选和本地 gap 表达。 | Runtime truth owner、immutable history、stable point、unknown fence、fail-closed。 | 当前架构结论已停审；不依赖未闭合正向 seam。 | 本地输入 / 决定 / 结果 / 恢复可解释，且不需要伪造外部成功。 |
| P2 正向 owner contract / seam 闭口 | 将 Tools、Capability、Governance、Sandbox、Observability、Core / Bus 的正向合同逐一接入。 | 正式 ref / snapshot / adapter / event source / receipt / feedback 的经核验映射。 | 外部 owner 不转移；compile 仅保留 Core；delivery / observed 不回写 local outcome。 | 上游 owner、source、route、schema、failure 和 readiness 有正式确认。 | 正向路径可被 qualification，而未闭合路径仍有 fail-closed。 |
| P3 证据驱动的持久化 / 运行承载演进 | 在真实 workload 与承载证据下确定 checkpoint、history、working memory 和 continuation 的物理支撑。 | 持久化原子性、恢复承载、容量策略、版本和迁移边界。 | stable point、history immutable、commit-unknown fence、local truth first。 | 有承载 owner、事务语义、故障模型和 workload / measurement 证据。 | 可证明的恢复、容量和一致性证据闭合；不把物理实现倒灌为语义 owner。 |
| P4 需求驱动的外围消费增强 | 在核心稳定后扩展下游 Member / Product、replay、analytics、reflection candidate 等消费。 | 安全投影、事件消费、查询 / 诊断视图和候选 handoff。 | Core truth 与外部正文分离；外围失败不污染核心。 | 下游 consumer boundary、事件 source family 和消费语义正式闭口。 | 外围能力可独立降级、重建和追溯，不成为核心同步前置。 |

## 5. 已知设计债务

### 5.1 可接受债务

| 债务 | 当前为什么可接受 | 保留条件 |
|---|---|---|
| Runtime-specific Core / Bus / Observability schema 未闭口 | 当前只需稳定类别、owner 和依赖方向，字段与协议可后置。 | 不得本地 shadow 正式类型；缺失时保持 pending / blocked。 |
| Tools-Sandbox mapping、receipt、feedback 未闭口 | Runtime 可以先定义 action disposition、handoff attempt 和 gap，不宣称执行成功。 | 正向 action path 必须 fail closed；不能 host fallback。 |
| Model adapter owner、physical route、secret、quota、cost 未闭口 | provider-neutral intent / candidate / selection 已足以支撑架构边界。 | Runtime 不拥有 provider control truth；positive qualification blocked。 |
| Durable episodic / semantic memory owner 未闭口 | working memory、retrieval mediation、candidate / ref 能支撑本阶段逻辑。 | 不写 durable body、index、retention、deletion 或 durable write ready。 |
| Checkpoint persistence、atomicity、commit-unknown 物理契约未闭口 | 架构已锁 stable point、immutable history 和 unknown fence，承载可由后续证据决定。 | 任何恢复声明都必须以 stable point 和 unknown fence 为前置。 |
| Event producer、source family、route、observed readiness 未闭口 | local outcome 和 submission attempt / gap 可以独立成立。 | delivery / observed / accepted 只能作为外部状态分层记录。 |
| 物理部署、语言、协议、存储和数值 NFR 未定 | 没有足够 workload / owner / implementation authority，提前锁定会制造伪事实。 | 后续文档不得把历史候选或默认产品写回正式架构。 |
| replay / analytics / learning 等外围增强尚未进入核心 | 它们不影响 controlled run 主线，可在安全投影后独立演进。 | 不得成为核心 run completion 或 checkpoint 前置。 |

### 5.2 不可接受债务

| 债务 | 不能接受的原因 | 失效姿态 |
|---|---|---|
| owner 反转或 Runtime 吞并外部正文 / 真相 | 形成第二真相源，后续所有权和冲突无法解释。 | 阻塞该边界的正向设计，保持 consumer-only。 |
| forbidden body、secret、raw provider / tool / capture、hidden reasoning 进入 Runtime truth、checkpoint 或 handoff | 违反最小暴露与 owner separation，扩大安全和审计边界。 | 拒绝、redact 或仅保留 typed ref / safe summary。 |
| Governance、Capability、Sandbox 或 principal 前置不明时 fail-open / 自我授权 / host fallback | 会在未获正式许可或未隔离时产生高影响副作用。 | `blocked` / `waiting` / `unavailable`，不推进 action。 |
| commit unknown / side-effect unknown 后盲重试 | 可能重复不可逆动作并污染历史。 | `unknown` fence；等待外部 resolution 或人工介入。 |
| delivery、observed、accepted 反写 local outcome | 把传播状态伪装成本地事实，破坏 local-truth-first。 | 保留 attempt / gap / stale projection，不改变 outcome。 |
| 非 `L0-core` sibling 变成 Cargo / package compile dependency | 破坏全局依赖顺序和 owner boundary。 | 依赖裁剪失败，退回 runtime seam / event / ref / adapter。 |
| 用 fake、旧文档、目录、静态配置伪造 implementation readiness、evidence 或 acceptance | 使后续测试和验收失去真实证据边界。 | 保持 `pending / blocked`，不得激活正向配置或 verdict。 |

## 6. 触发条件表

| 触发条件 | 可能受影响的架构主线 | 触发动作 | 不触发的情况 |
|---|---|---|---|
| 上游正式 owner contract 改变 truth、scope 或责任 | 职责边界、上下文、依赖、数据所有权 | 回开 Step 3 / 4 / 5 / 7 / 8，并重新做跨单元审计。 | 仅补充不改变 owner 的说明文字。 |
| Tools 到 Sandbox 的正向 mapping、receipt 或 feedback 定稿 | Action / Delegation、交互、恢复和 handoff | 回开 Step 9 / 12 / 14 / 15；未核验前维持 fail-closed。 | 仅有本地 fake 或历史草稿。 |
| Core / Bus / Observability schema 或 source family 正式闭口 | 编译候选、事件协作、safe material 生产 | 回开 Step 7 / 9 / 10，核对依赖类型与事件边界。 | 仅定义类别，不提供正式合同。 |
| model adapter route / secret / quota / cost owner 形成 | Model Decision 的外部接缝与配置边界 | 回开 Step 4 / 7 / 9 / 10 / 12；不把 provider control 转入 Runtime。 | 只替换不影响逻辑 selection 的物理载体。 |
| durable memory owner、正文与写入反馈形成 | Context / Memory 数据所有权和一致性 | 回开 Step 5 / 8 / 9；重新核对 body-free、candidate 和 retention 边界。 | 只提供已有安全检索 ref，不改变正文 owner。 |
| checkpoint persistence、事务或 commit-unknown 语义形成 | Checkpoint / Recovery、韧性和部署承载 | 回开 Step 6 / 8 / 9 / 12；用证据确认 stable point。 | 仅增加本地决策分类，不改变稳定点语义。 |
| workload / failure evidence 显示 bounded context、delegation 或 continuation 不足 | 性能 / 容量、横切约束、演进阶段 | 回开 Step 2 / 10 / 12；不得直接写固定数值或扩大边界。 | 没有 workload 或测量证据的主观优化请求。 |
| 下游 member / product entry 或事件消费语义正式确认 | Entry、safe views、handoff 与 P4 外围演进 | 回开 Step 4 / 9 / 13 / 15，保持下游 consumer-only。 | 下游仅引用现有 safe ref，不要求 Runtime 拥有入口真相。 |
| 旧文档中的框架、API、SLA 或对象重新进入讨论 | 全部受污染章节 | 标记 `historical_pollution`，回退受影响 Step，不得直接回填。 | 仅作为差异审计证据引用。 |

## 7. 正式架构回填草稿

第 14 章应只承载以下收口结论：Runtime 当前以独立 controlled-run truth 为阶段基线，先闭合本地 run / goal-plan / context-memory / model / action-delegation / checkpoint-recovery / outcome-handoff 逻辑，并以 immutable history、stable checkpoint、unknown fence、local-truth-first 和 fail-closed 守住边界。后续演进分为四个结构阶段：本地 Runtime 逻辑主线成立、正向 owner contract / seam 闭口、证据驱动的持久化与运行承载演进、需求驱动的外围消费增强。未闭合的 schema、route、adapter、durable owner、物理持久化和数值 NFR 可作为有条件设计债务保留；owner 反转、forbidden body 入仓、fail-open、盲重试、delivery / observed 回写、非 Core compile 依赖和伪造 readiness 不可接受。只有正式 owner / contract、正向 readiness 或真实 workload / failure evidence 改变边界、所有权、一致性或失败姿态时，才触发受影响 Step 回开；本阶段不把实施排期或产品载体写成架构演进结论。

## 8. 自检与门禁

| 检查项 | 结果 | 证据 |
|---|---|---|
| 当前阶段边界明确且可由前序 Step 支撑 | pass | Step 2 / 3 / 5 / 8 / 10 / 12 与本文件第 3 节 |
| 演进是结构阶段而非项目排期 | pass | 第 4 节四阶段表无任务、负责人、时间或实现承诺 |
| 可接受债务说明了原因和保留条件 | pass | 第 5.1 节 |
| 不可接受债务覆盖 owner、truth、fail-closed、unknown、依赖和 readiness 红线 | pass | 第 5.2 节 |
| 触发条件与回开范围明确 | pass | 第 6 节 |
| 上游 blocker 未被伪造成 ready | pass | `L2R-UP-001~008` 全部维持 pending / blocked / fail-closed |
| 历史污染未回流 | pass | 第 2 节明确旧框架、技术栈、SLA 和对象仅作 historical_material |
| 未新增前文未确认结论 | pass | 仅重组 Step 10~12 与既有 blocker |

```text
gate_status = pass
next_allowed_action = create_01_arch_step_14_risks_open_questions
formal_document_write_allowed = false
future_step_files_allowed = false_until_step_14_start
```
