# L2-runtime 01 架构 Step 14: 风险与待确认事项

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `01-架构设计.md` 第 15 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | 需求 Step 15 风险 / 待确认、架构 Step 1~13 的边界、依赖、数据、交互、选型、取舍和演进结论 |
| 目标 | 显式区分已识别但未关闭的风险与尚未形成定论的待确认事项 |
| 禁止 | 把风险写成最终方案、把问题写成任务 backlog、以主观判断填补上游 seam、伪造 readiness / evidence / acceptance |
| 当前状态 | `L2R-UP-001~008` 全部保持 `pending / blocked / fail-closed`；不因本架构文档完成而解除其正向 qualification 阻塞 |

## 1. 判定口径

风险是已经识别出会影响 Runtime 主线成立、边界稳定、依赖方向、数据归属、一致性或关键交互，但尚未关闭的问题。待确认事项是仍缺少外部确认、正式合同、来源或前置判断，尚未形成确定结论、但若结论变化会影响前文成立的问题。两张表不互相升级：风险表不写最终修复方案，待确认表不把“尚未确认”包装成已知事实。

## 2. 风险表

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| `ARISK-L2R-001` / `R-L2R-002` / `L2R-UP-001`: `L2-tools` canonical invocation 到 Sandbox 正向 mapping、receipt、feedback、cleanup 未闭合 | Action / Delegation、Sandbox 接缝、recovery、handoff | Runtime 只消费 Tools canonical contract，保留 action disposition、attempt / gap 和 blocked-aware seam；正向执行前置不明即 fail closed | 阻塞正向 action qualification；不阻塞架构主线 | 该缺口已明确影响 action 是否可成立，不能通过 Runtime 自定义执行语义补齐。 |
| `ARISK-L2R-002` / `R-L2R-005` / `L2R-UP-002`: safe material producer、source、route、observed readiness 未闭合 | local outcome、事件 handoff、Observability、下游安全投影 | 只允许 body-free safe material eligibility、本地 submission attempt 和 gap；不声明 delivered / observed / accepted | 阻塞 observed / evidence / acceptance；不阻塞 local outcome | delivery 和 observed 是外部 owner 状态，不能反写 Runtime truth。 |
| `ARISK-L2R-003` / `R-L2R-006` / `L2R-UP-006`: Runtime-specific Core / Bus / Observability shared schema 与 event schema 未闭合 | 编译候选、事件 envelope、跨边界字段与 source family | 只引用 Core / Bus / Observability 的类别和 owner；字段、版本、route 未确认前不建本地 shadow contract | 阻塞正向 schema / route 定稿；不阻塞机制级架构 | 缺正式 authority 时，目录或旧文档不能充当 shared contract。 |
| `ARISK-L2R-004` / `R-L2R-007` / `L2R-UP-004`: model adapter owner、physical route、secret、quota、cost 未闭合 | Model Decision、配置边界、provider 运行接缝 | 只拥有 provider-neutral intent、candidate、selection / disposition；adapter unavailable / pending 时保持 no-model、waiting 或 blocked | 阻塞正向 model integration；不阻塞逻辑架构 | provider control truth 不得进入 Runtime。 |
| `ARISK-L2R-005` / `R-L2R-008` / `L2R-UP-005`: durable episodic / semantic memory owner、正文、索引、retention、deletion、write feedback 未闭合 | Context / Memory、长期一致性、checkpoint 与候选 handoff | 只拥有 working memory、retrieval mediation、ref / safe snapshot 和 candidate；长期正文不可写入 Runtime truth | 阻塞 durable write / readiness；不阻塞 working context | durable owner 未定前，必须允许 unavailable / stale / gap。 |
| `ARISK-L2R-006` / `R-L2R-009`: checkpoint persistence、atomicity、version、commit-unknown 契约未闭合 | stable point、resume / retry / recovery、部署承载 | 架构只锁 stable checkpoint、immutable history 和 unknown-side-effect fence；未有物理语义时不声明可恢复成功 | 阻塞恢复 qualification 与配置激活；不阻塞恢复决策模型 | 不能以“每步保存”或自动 retry 代替稳定点证据。 |
| `ARISK-L2R-007` / `R-L2R-011` / `L2R-UP-002`: Runtime event / handoff source family 与下游消费语义未闭合 | Bus collaboration、Member / Product consumer、safe views | local truth 先成立，跨边界仅保留 typed material、attempt、delivery gap 和 owner ref；下游按 consumer-only 处理 | 阻塞正向 handoff / consumer qualification；不阻塞核心 run | 下游不能把 Runtime status 当作 Process / Work / Artifact truth。 |
| `ARISK-L2R-008` / `L2R-UP-008`: `L3-method-library/03-详细设计.md` 有用户未提交工作区改动 | Method / Role / Process 定义的输入稳定性、追溯和后续详细设计 | 只引用当前 workspace 的正式内容，不声称 commit、hash 或 immutable baseline；方法正文仍由上游拥有 | 阻塞不可变上游基线声明；不阻塞本架构边界 | 上游文件可读不等于已提交或已验收。 |
| `ARISK-L2R-009` / `R-L2R-012`: 旧 README / Runtime 正式链回流旧框架、对象、API、SLA 或 execution plan | 全部架构章节、依赖裁剪、演进和后续文档输入 | 旧材料仅作 `historical_material` 与污染审计；出现回流时只回开受影响 Step，不直接继承 | 可能阻塞受污染章节重审；当前不阻塞已收口结论 | full-restart 要求旧内容经核验才能进入正式正文。 |
| `R-L2R-001`: Runtime 逻辑入口与 member / product 触发边界未共同校准 | Entry / Control、下游 consumer boundary、产品入口 | 当前只定义 capability-level Runtime entry；member / product 入口不被 Runtime 反向拥有 | 有条件阻塞入口正向合同；不阻塞核心逻辑 | 入口 owner 未闭合时，不把产品容器生命周期写进 Runtime。 |
| `R-L2R-003`: Governance authorization / policy source matrix 与 action gate 未共同闭合 | Action precondition、high-impact action、policy snapshot | 只消费 formal Governance decision / effective policy；缺失或冲突时拒绝、等待或 blocked | 阻塞 governed action；不阻塞 no-action / waiting 分支 | Runtime 不自建 allowlist、approval truth 或 policy cache。 |
| `R-L2R-004`: Sandbox-required action 的 generic mapping 仍缺正式 owner | Sandbox run / capture / cleanup、action outcome、recovery | 不声明 Sandbox execution success、receipt 或 cleanup complete；只保留 requirement / attempt / gap | 阻塞 Sandbox-required 正向路径 | 不得通过 host fallback 或本地模拟成功绕过隔离边界。 |
| `R-L2R-010`: hidden reasoning / decision summary 边界可能被实现误解 | Model result、checkpoint、safe handoff、Observability | 只允许最小 decision / source / result summary；hidden reasoning、raw provider body 和 secret 持续禁止 | 阻塞不符合最小暴露的输出；不阻塞 safe summary | 该风险必须由数据边界和横切约束共同防护。 |

## 3. 待确认事项表

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| `Q-L2R-001` Runtime 逻辑入口与 member / product 的正式 owner、consumer surface | Entry / Control、下游 handoff | 缺下游入口 owner、触发语义和消费边界确认 | 只保留 capability-level runtime entry；不声明产品入口或 member lifecycle | 尚未形成最终入口结论，不能将旧 README 入口当作正式事实。 |
| `Q-L2R-002` Runtime-specific Core shared types、error、metadata、event envelope 的最小集合 | compile 候选、错误传播、关联和跨仓 envelope | 缺 `L0-core` 正式 contract candidate 与版本 / source authority | 仅引用类型类别和 Core owner；字段级内容挂起 | 当前已知“Core 是唯一 compile 候选”，但具体集合尚未定论。 |
| `Q-L2R-003` Tool invocation / feedback / normalized outcome 到 action incorporation 的 mapping | Action / Delegation、Tool handoff、recovery | 缺 `L2-tools` 与 Runtime 的正向 mapping、重复 / 乱序和失败语义 | 保持 consumer / adapter seam；mapping 未闭口时 no-execution / blocked | 该问题需要上游正式确认，Runtime 不得从旧设计猜测。 |
| `Q-L2R-004` Governed action authorization owner、source priority 与高风险 taxonomy | Governance gate、policy effective、action admission | 缺 Governance source matrix、优先级和 taxonomy 的正式确认 | 只接受 formal result；unknown / conflict fail closed | 现阶段只能锁 gate 方向，不能锁具体 policy 规则。 |
| `Q-L2R-005` Sandbox generic execution / capture / failure / receipt / cleanup adapter contract | Sandbox-required action、outcome、resume | 缺 Sandbox 正向接口、receipt 语义、cleanup 责任和 readiness | 只表达 requirement、attempt、gap 和 blocked 状态 | 缺口影响正向集成，但不授权 Runtime 拥有隔离 truth。 |
| `Q-L2R-006` Observability safe material producer、source、route、event schema 和 workspace readiness | safe material、event handoff、observed truth | 缺 producer owner、source family、route、backend readiness | 只形成 body-free local material、attempt / gap；不声明 observed | 观测接缝可先作为 event collaboration，但正向 observed 仍挂起。 |
| `Q-L2R-007` Model adapter capability、route、secret / quota / cost ownership | Model Decision、配置和 unavailable 处理 | 缺 model adapter owner、能力匹配、物理路由和控制面归属 | provider-neutral intent / selection；positive adapter pending | 当前不能把任何 provider / SDK / route 写成正式依赖。 |
| `Q-L2R-008` Durable memory truth owner、body-free read、candidate write、retention / deletion | Episodic / semantic mediation、长期记忆边界 | 缺 durable owner、读写 contract、保留 / 删除语义 | working memory + retrieval ref / candidate；长期写入不 ready | 该项可能改变数据所有权，必须继续显式挂起。 |
| `Q-L2R-009` Checkpoint persistence source、transaction / unit-of-work、version、commit-unknown semantics | Checkpoint / Recovery、稳定点和物理承载 | 缺 persistence owner、事务边界、版本和未知提交解释 | 只锁 stable point、immutable history、unknown fence | 详细设计前不能把逻辑 checkpoint 等同物理持久化成功。 |
| `Q-L2R-010` Runtime event / handoff exact source family 与 downstream consumption semantics | Bus、safe views、member / product consumer | 缺事件 source、route、消费者语义和 receipt / acceptance 分层确认 | event collaboration pending；local attempt / gap；consumer-only | 不能用 event 名称或旧 catalog 预支协议结论。 |
| `Q-L2R-011` 是否在后续需求修订中纳入 replay / analytics / learning candidate | P4 外围演进、需求追溯和测试 / 验收范围 | 缺产品需求、消费者和证据边界确认 | 当前作为外围增强挂起，不进入核心 run truth 或完成前置 | 这是需求范围未定，不应升级为当前架构能力。 |

## 4. 当前处理口径说明

风险表收纳的是已经能证明会影响主线成立或正向 qualification 的开放边界，因此用保守约束、fail-closed 或阻塞状态暂存；待确认表收纳的是尚缺正式 owner、contract、source、route 或需求判断的事项，因此不把它们润色成架构定论。`L2R-UP-001~008` 的存在不阻止本架构的逻辑边界完成，但阻止正向 schema、adapter、route、配置激活、测试执行、evidence 和 acceptance readiness。除非后续外部确认改变前文的 owner、truth、一致性或失败姿态，本步不预支解决方案。

## 5. 自检与门禁

| 检查项 | 结果 | 证据 |
|---|---|---|
| 风险与待确认事项严格分表 | pass | 第 2、3 节 |
| 已承接 `L2R-UP-001~008`、`ARISK-L2R-001~009`、`R-L2R-001~012`、`Q-L2R-001~011` | pass | 第 2、3 节逐项映射 |
| 风险包含影响范围、当前处理口径和阻塞性 | pass | 风险表固定字段完整 |
| 待确认包含缺失确认和当前挂起口径 | pass | 待确认表固定字段完整 |
| 未写最终解决方案、任务拆分或 readiness | pass | 全文审计 |
| 未改变前序 owner / truth / dependency 结论 | pass | 与 Step 3 / 7 / 8 / 12 / 13 对照 |
| `L3-method-library/03-详细设计.md` 未提交输入已显式保留 | pass | `ARISK-L2R-008` |

```text
gate_status = pass
next_allowed_action = create_01_arch_step_15_adr_traceability
formal_document_write_allowed = false
future_step_files_allowed = false_until_step_15_start
```
