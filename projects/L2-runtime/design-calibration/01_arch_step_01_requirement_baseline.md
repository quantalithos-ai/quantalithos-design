# L2-runtime 01 架构 Step 1: 确认需求基线

> 创建日期: 2026-08-07
> 状态: done_stop_review
> 当前模式: full-restart
> 回填位置: `01-架构设计.md` 第 3 章、第 16 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | `00-需求文档.md`、需求 calibration Step 1~17、架构规范 / SOP、全局依赖规则、专项上游正式架构文档 |
| 目标 | 筛选足以约束架构边界、数据所有权、依赖方向、交互和一致性策略的需求结论 |
| 输出 | 架构需求基线清单、架构硬约束清单、未关闭需求风险清单、旧材料差异审计 |
| 禁止 | 重写需求全文、画上下文图、划分子域、定义容器 / 通信 / 技术选型、写 schema / API / 实现 / 测试 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 需求基线筛选 | done | ARB-L2R-001~012 | pass |
| 架构硬约束 | done | AHC-L2R-001~011 | pass |
| 未关闭需求风险 | done | ARISK-L2R-001~009 | pass |
| 上游 / 历史材料审计 | done | current / historical / blocker 分层 | pass |
| 架构前提自检 | done_stop_review | Step 2 输入确认 | pass |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前架构设计依赖哪些需求结论? | 依赖 Runtime 定位与五能力闭环、五项目标、compile/runtime/event/ref/adapter/fake 依赖裁剪、Runtime truth / snapshot / ref / candidate / forbidden body 数据归属、能力级接口、NFR、验收否决和 `L2R-UP-001~008` blocker。 |
| 哪些已经稳定? | Runtime 是受控、可恢复的运行决策真相仓；拥有 run / goal-plan working state、context composition、model intent / logical selection、action / delegation、checkpoint / recovery、local outcome / handoff attempt；不拥有相邻仓 truth。 |
| 哪些仍待确认? | Tools-Sandbox 正向 mapping、Observability producer / route、Core runtime schema、model adapter owner、durable memory owner、checkpoint persistence contract、event source family，以及现有上游工作区不可声称 immutable 的 baseline。 |
| 哪些直接影响架构边界? | Runtime 与 `L2-tools`、Hub、Method、Governance、Sandbox、Observability、Artifact、Bus、SDK、member-service 的 owner / consumer 关系，以及禁止 tools execution、registry、method body、approval、isolation、backend、lifecycle、provider control 进入本仓。 |
| 哪些直接影响数据所有权? | Run / working state / decision / checkpoint / recovery / outcome / local handoff 属 Runtime truth；外部 definition、policy、tool、sandbox、artifact、memory、provider 正文只能是 snapshot / ref / candidate，forbidden body 不得保存。 |
| 哪些直接影响依赖方向或一致性? | 只有 `L0-core` 是 compile 候选；其他 sibling 通过 runtime / event / ref / adapter / fake seam；local truth first、history immutable、late / duplicate / unknown 不逆写，外部 delivery / observed 不替代 Runtime outcome。 |

## 3. 架构需求基线清单

| 基线 ID | 类别 | 架构必须承接的需求结论 | 来源 | 对后续架构的影响 | 本步不推导 |
|---|---|---|---|---|---|
| `ARB-L2R-001` | 定位 | `L2-runtime` 是受控运行循环、运行时决策、上下文工作态、行动编排、恢复和运行结果交接的真相仓 | 00 §2 | 职责、上下文和数据所有权围绕 Runtime run 组织 | 不把逻辑定位绑定进程、容器、语言或框架 |
| `ARB-L2R-002` | 核心主线 | C-L2R-1~5 形成 controlled run -> context / memory -> model decision -> action orchestration -> checkpoint / recovery / handoff 闭环 | 00 §7 | 架构单元和关键交互必须支撑五节点及 committed continuation | 不把旧 C1~C9、StateGraph 或 CRUD 清单当作主线 |
| `ARB-L2R-003` | 运行真相 | Runtime 拥有 run status、goal / plan working state、context composition、working memory、model / action decision、checkpoint / recovery、local outcome | 00 §2、§11 | 后续必须形成单一 Runtime truth owner 和历史不可改写边界 | 不提前定义状态枚举、表、字段、事务或持久化方案 |
| `ARB-L2R-004` | 上游消费 | Tools、Hub、Method、Governance、Sandbox、Artifact 的真相由各自 owner 保有，Runtime 只消费正式 ref / snapshot / result / seam | 00 §1、§6、§12 | 系统上下文和依赖方向必须是 consumer / adapter / ref 边界 | 不把上游内部架构单元复制到 Runtime |
| `ARB-L2R-005` | 模型边界 | Runtime 拥有 provider-neutral model intent、候选约束、逻辑 selection、turn disposition；不拥有 physical route、secret、quota、cost、billing | 00 C3、BR-017~024 | 后续架构必须将 model decision 与 provider adapter 解耦 | 不命名 provider、endpoint、secret backend 或 route registry |
| `ARB-L2R-006` | 行动边界 | Runtime 拥有 no-action / Tool / sub-agent / wait / reject 的 action choice 与 incorporation；Tools / Governance / Sandbox 拥有各自 execution / approval / isolation truth | 00 C4、BR-025~034 | 依赖和交互必须 fail closed，未知副作用不能自动重试 | 不把 invocation choice 写成 tool executed、approved 或 Sandbox success |
| `ARB-L2R-007` | 记忆 / 上下文边界 | Runtime 拥有 working context / memory 和 retrieval mediation；episodic / semantic durable body、索引、保留、删除 owner 未闭口 | 00 C2、BR-009~016、L2R-UP-005 | 架构数据边界必须允许 working-only / candidate / unavailable | 不决定长期 memory backend、正文 schema 或 retention algorithm |
| `ARB-L2R-008` | 恢复 / 历史 | stable point、checkpoint、resume、reflection、recovery、unknown side-effect fence 和 local outcome 属 Runtime；late / duplicate feedback 不逆写 | 00 C5、BR-035~044 | 一致性策略必须区分 local truth、external delivery、observed、acceptance | 不提前设计 transaction、outbox、replay API 或 retry algorithm |
| `ARB-L2R-009` | 依赖类型 | `L0-core` 是唯一 compile 候选；Tools / Hub / Method / Governance / Sandbox / Artifact 为 runtime / ref / adapter，Bus / Observability 为 event seam，SDK 为 downstream consumer | 00 §6、IF-L2R-001~015 | 依赖方向图必须防止 sibling package 依赖和事件依赖伪装 | 不把 runtime / event / ref / adapter / fake 当 Cargo / package 类型 |
| `ARB-L2R-010` | 安全 / 观测 | forbidden body、secret、raw provider / tool / sandbox / artifact body、hidden reasoning 不进入 truth / checkpoint / handoff；safe material body-free、redacted、correlated | 00 BR-011/022/036、NFR-007/017 | 横切架构必须保护最小暴露和低基数关联 | 不把 reasoning trace、observability backend 或 report body 纳入 Runtime |
| `ARB-L2R-011` | 外部交接 | Runtime local outcome first；handoff 只形成 safe material、submission attempt / gap；delivery / observed / downstream acceptance 独立 | 00 FR-020、BR-041~043、IF-014/015 | 关键交互可采用事件协作，但不得反写 Runtime truth | 不声明 Bus receipt、Observed、Artifact report 或下游 accepted |
| `ARB-L2R-012` | 外围边界 | replay、analytics、cost advice、reflection candidate handoff 是只读 / 实验 / 候选增强，不改变正式 run truth | 00 FR/US E01~E04 | 架构需保留扩展点但不让外围成为核心拓扑前置 | 不把外围 enhancement 建成当前核心子域或 readiness |

## 4. 架构硬约束清单

| 约束 ID | 类别 | 不可被后续架构方案破坏的约束 | 来源 | 直接影响 |
|---|---|---|---|---|
| `AHC-L2R-001` | 单一真相 | Runtime run / working state / decision / recovery / local outcome 只有一个 Runtime truth owner | 00 BR-001~007、DR 表 | 职责边界、上下文、数据所有权 |
| `AHC-L2R-002` | Owner separation | Tools、Hub、Method、Governance、Sandbox、Observability、Artifact、provider、member lifecycle 不因 Runtime orchestration 转移 truth | 00 NG、BR-008/028/034/041~044 | 系统边界、依赖、交互 |
| `AHC-L2R-003` | Definition / execution separation | Runtime 消费定义、工具、治理、隔离和 artifact refs / summaries，不复制正文或执行真相 | 00 §1/§2/§11 | 上下文和数据分类 |
| `AHC-L2R-004` | Compile-only | 除 `L0-core` 外，不得形成 sibling package / path compile dependency | 00 §6、VF-L2R-007 | 依赖方向和层间约束 |
| `AHC-L2R-005` | Fail closed | governed / capability-bound / sandbox-required action 的正式前置缺失、冲突、stale、unknown 时只能 reject / wait / blocked / gap | 00 BR-029/030/044、VF-L2R-002 | 交互失败和架构降级 |
| `AHC-L2R-006` | Unknown fence | commit unknown、side-effect unknown、late / duplicate / out-of-order feedback 不得自动重试、重复副作用或逆写历史 | 00 BR-038/039、NFR-013~015、VF-L2R-004 | 一致性、恢复、交互方式 |
| `AHC-L2R-007` | Body-free | secret、raw external body、Sandbox capture、Artifact / Evidence / report body、hidden reasoning 不进入 Runtime truth、checkpoint、handoff | 00 BR-011/022/036、NFR-007/017、VF-L2R-003 | 数据所有权、横切安全 |
| `AHC-L2R-008` | Local truth first | Runtime outcome / checkpoint 不被 delivery、observed、receipt、downstream summary、acceptance 反写 | 00 BR-041~043、AC-L2R-024 | 事件协作、一致性、演进 |
| `AHC-L2R-009` | Source anchored | context / decision / action / handoff 必须回链 owner、ref、scope、freshness、purpose 和 correlation；不得从字符串或私有索引猜测 | 00 BR-009/010/012/023/042 | 上下文、交互、审计 |
| `AHC-L2R-010` | Pending preservation | `L2R-UP-001~008` 与 `R/Q-L2R-*` 未闭口前不得伪造 schema、route、adapter、receipt、readiness 或 evidence | 00 §15、VF-L2R-006/008 | 所有后续架构 Step 和正式装配 |
| `AHC-L2R-011` | Core-first semantics | 架构优先保证 owner、边界、历史、失败和安全语义；无 workload / authority 时不固定旧 SLA / SLO / 技术栈 | 00 NFR-001~003/019、NG-L2R-010 | 技术选型、演进、横切关注点 |

## 5. 未关闭需求风险清单

| 风险 ID | 未关闭项 | 可能改变的架构判断 | 当前处理口径 | 状态 |
|---|---|---|---|---|
| `ARISK-L2R-001` | `L2-tools` 到 Sandbox 的 mapping、receipt、feedback、cleanup 未闭口 | C4/C5 的正向交互方式、adapter 边界和部署关系 | 只建 canonical action -> local handoff attempt / gap 的抽象；positive execution blocked | open_upstream_contract |
| `ARISK-L2R-002` | Observability producer / source / route / observed readiness 未闭口 | C5 event seam、safe material producer 和横切观测边界 | 只保留 event collaboration / local attempt / gap；不声明 observed | open_integration_boundary |
| `ARISK-L2R-003` | Core runtime-specific schema、Bus event schema、safe signal source family 未闭口 | compile boundary、event envelope 和跨层依赖方向 | 只承接 shared category authority；字段 / route pending | schema_and_route_pending |
| `ARISK-L2R-004` | model adapter、physical route、secret、quota、cost owner 未闭口 | C3 的 adapter / runtime unit、同步/异步方式和技术机制 | 只架构 provider-neutral intent / decision；positive adapter blocked | owner_contract_pending |
| `ARISK-L2R-005` | durable episodic / semantic memory owner、body、index、retention、write feedback 未闭口 | C2 的上下文边界、持久化/查询关系和一致性口径 | working memory + retrieval candidate / ref / unavailable；不设计 durable body | owner_boundary_pending |
| `ARISK-L2R-006` | checkpoint persistence、atomicity、version、commit-unknown contract 未闭口 | C5 的运行单元、数据一致性和恢复交互 | 只锁 stable point、history immutable、unknown fence；详细设计再闭口 | design_pending |
| `ARISK-L2R-007` | Runtime event / handoff source family 与 downstream consumption semantics 未闭口 | C5 的事件协作、下游边界和演进路线 | attempt / delivery / observed / acceptance 分层；route pending | event_boundary_pending |
| `ARISK-L2R-008` | `L3-method-library/03-详细设计.md` 当前存在用户未提交改动 | 上游 formal baseline 是否可声称 immutable | 只引用当前 workspace formal content；不声明 commit / baseline hash | uncommitted_upstream_input |
| `ARISK-L2R-009` | 旧 Runtime 01 与 README 的框架、容器、SLA、对象、API、trace 主线污染 | 容器、技术选型、上下文和演进判断 | 全部 historical_material；若回流则重开受影响 Step 1~15 | historical_pollution |

## 6. 历史材料差异审计

| 旧材料结论 | 当前处置 | 理由 |
|---|---|---|
| “Runtime 是 AI 员工容器内的大脑进程” | historical_material | 把逻辑 owner 绑定到容器 / 部署形态；部署后移 Step 6 |
| StateGraph、Python、LangGraph、Temporal 等固定方案 | historical_material | 需求与架构 Step 1 未授权技术选型；Step 10 才能按硬约束比较机制 |
| prompt 四层 shared_rules / role / policy / context 固定排序 | historical_material | 00 只要求 source precedence / scope / freshness / budget；具体层次未形成当前 authority |
| 每步 checkpoint P95 < 100ms、loop < 50ms、memory < 500ms、99.9% | historical_material | 无 workload、baseline、measurement authority；不成为架构目标 |
| Policy Cache / capability-hub 直连 / provider registry | historical_material | 违反 Governance / Hub / provider owner separation 和 fail-closed |
| vector store、episodic/semantic provider 直连 | historical_material | durable memory owner 和 adapter 未闭口；Runtime 只拥有 mediation |
| ExecutionPlan / WorkItem promote / Process backflow 主线 | historical_material | 00 明确 Work / Process / Artifact truth 不归 Runtime |
| ReasoningTrace 完整正文持久化 | historical_material | hidden chain-of-thought、provider raw body、secret 禁止进入 Runtime truth / handoff |
| member IPC / UDS gRPC、SDK compile、同容器双进程 | historical_material | 运行入口、部署和通信将在 Step 4/6/9 按当前 authority 重推 |

## 7. 架构前提结论

本 Step 通过后，后续架构可以把以下内容作为稳定前提：

1. Runtime 的架构主线是受控、可恢复的运行决策闭环，而非工具执行、能力注册、方法定义、治理裁决、Sandbox 隔离或观测后端。
2. Runtime 的核心架构单元候选必须覆盖 run / goal-plan、context / memory、model decision、action / delegation、checkpoint / recovery / handoff，但具体限界上下文仍由 Step 5 逐个收敛。
3. 只有 `L0-core` 是编译期依赖候选；所有 sibling / provider / memory 关系必须在后续架构中保持 runtime / event / ref / adapter / fake seam。
4. Runtime truth、外部 snapshot / ref / candidate、forbidden body 和 local-truth-first 一致性是后续所有架构决策的硬边界。
5. 所有未关闭 seam 必须保留为 pending / blocked / waiting / fail-closed；不得用 fake、目录、旧文档或静态设计伪造 readiness。

## 8. 回填草稿

正式 `01-架构设计.md` 第 3 章应引用本文件的架构需求基线、硬约束和未关闭风险；第 16 章应引用本文件的基线到需求的追溯入口。Step 1 不回填正式正文，不产生上下文图、容器图、依赖图、数据一致性方案、技术选型或 ADR。

## 9. 自检与门禁

| 检查 | 结果 |
|---|---|
| 需求基线来源为正式 `00` 和当前上游架构文档 | pass |
| 已区分稳定需求、架构硬约束和未关闭风险 | pass |
| 已标注 `L2R-UP-001~008` 影响,未伪造 readiness | pass |
| 旧 Runtime 架构、技术栈、对象、API、SLA、trace 已降级为 historical material | pass |
| 未提前创建 Step 2~16 文件 | pass |
| 未写容器、上下文图、接口 schema、数据表、技术选型或实现事实 | pass |
| 当前产物足以支撑 Step 2 架构目标与约束讨论 | pass |

```text
gate_status = pass
next_allowed_action = await_user_confirmation_for_01_arch_step_01
formal_document_write_allowed = false
future_step_files_allowed = false_until_user_confirmation
next_formal_document_allowed = false_until_step_16
```
