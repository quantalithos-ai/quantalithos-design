# Step 13. 演进路线

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 13
> 对应书写规范: `standards/document/架构设计书写规范.md` §4.14
> 回填位置: 正式 `01-架构设计.md` §14
> 日期: 2026-08-22
> 状态: `pass`
> 串行门禁: Step 1~12 已通过;本文件通过前未创建 Step 14

## 1. Step 内计划

| 阶段 | 动作 | 状态 |
|---|---|---|
| 问题回答 | 回答当前成立下限、首批结构、后续演进、债务和触发条件 | completed |
| 当前诊断 | 审计旧路线、开放 seam 与兄弟项目最新正式状态 | completed |
| 取舍 | 区分可接受结构债务、不可接受边界债务和边界外愿望 | completed |
| 结构化 | 形成演进阶段、债务与触发条件表 | completed |
| 回填草稿 | 按正式 §14 固定表结构收口 | completed |
| 门禁 | 检查无排期 / TODO / 产品愿望 / readiness 伪造 | pass |

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 2 goals / constraints | owner、body-free、依赖真实性、project-scoped 与 pending 纪律。 |
| Step 5~9 structure | BC01~07、五类依赖角色、数据分层、sync / async / background 语义。 |
| Step 10 / 11 | TM-L2M-001~014、ALT-L2M-A 和明确不锁定 / 不采用项。 |
| Step 12 | CC-L2M-001~016、派生隔离、配置 / lifecycle / evidence 纪律。 |
| 正式 00 | Q-L2M-001~009、R-L2M-001~010 与 current project-scoped scope。 |
| sibling refresh | member-service / member-images 正式 00 均已停审;member-images 正式 01 已 stop_review 并完成 drift check,member-service 正式 01 尚未停审;exact contracts 继续 pending。 |
| 旧正式 01 | 只诊断 Rust / UDS / gRPC / supervisord / launch token /固定指标 / B1~B6 路线污染。 |

## 3. SOP 问题回答

### 3.1 当前阶段做到哪里才算足够

当前阶段只要求“独立 member interaction-boundary truth + 正式协作 seam + 可审查失败语义”的架构主线成立,不要求协议、存储、语言、进程拓扑、队列、调度、指标或正向集成同时闭口。

| 当前必须成立结构 | 判断口径 |
|---|---|
| 运行态执行主语 | 项目型实例以 ProjectMemberRef 为执行主语并关联 GlobalMemberRef 身份锚;其他主语 fail closed。 |
| BC01~05 核心语义 | presence、screening / delivery、Runtime mediation、outbound、trace 各有唯一 owner 且不吸收 external truth。 |
| BC06 / BC07 支撑与派生 | Mirror 只解释消费状态;Read Model 只读可重建,不授权、不反写。 |
| 正式依赖边界 | 只有 Core 为 compile candidate;host / Runtime / Bus / owner 通过 runtime / event seam 协作。 |
| 数据与一致性分层 | truth / snapshot / projection / ref / forbidden body 分开;local logical strong、external eventual。 |
| 通信与失败分层 | sync admission / safe read、async committed fact / feedback、background qualified continuation 分开;unknown fenced。 |
| 安全与证据纪律 | body-free、正式网络边界、source-correlated history、planned / fake / pending 不伪装 readiness。 |

### 3.2 第一批必须守住哪些结构

1. member 不退化为透明管道,也不成为 Runtime、host、Bus、Governance、Conversation、Tools 或 Observability 的第二 truth owner。
2. inbound body 只在授权边界瞬时检查;投递、出站、trace 和 projection 不持久化或透明转发正文。
3. Runtime outcome、member decision、attempt、delivery、observed、accepted / healthy 分层存在。
4. 所有 local decision 有 subject、source、scope、purpose、correlation 和 result category。
5. 外部失效只形成 waiting / blocked / degraded / stale / gap;不回滚本地历史,unknown side effect 不盲重放。
6. Mirror / Read / outlet 不成为 authorization、registry、配置 truth 或核心同步前置。
7. 所有开放合同保持 transport-neutral / schema-pending,不以 sibling package、private DTO、adapter 或 fake 补洞。

### 3.3 哪些能力或约束后续才进入演进主线

| 后续演进项 | 当前口径 |
|---|---|
| host / credential 合同激活 | 需求级 owner 分层已闭口;字段、IPC、凭据形态和联调等待正式合同。 |
| Runtime entry / committed handoff mapping | 逻辑 EntryAuthority / committed material seam 已成立;typed mapping、carrier、backpressure 后移。 |
| member-specific Core schema / event family / route | 只承接 Core shared envelope / trace authority;具体集合由 Core / owner 闭口。 |
| screening source / taxonomy 硬化 | 四态与 conservative handling 已成立;规则来源矩阵、风险 taxonomy 后移。 |
| trace retention / archive / reconciliation 硬化 | append / body-free / gap 已成立;物理 retention、archive、schedule 后移。 |
| capability outlet 正向激活 | BC07 投影结构保留,当前允许裁剪;source refs 和消费者合同闭口后再激活。 |
| capacity / SLO / configuration governance | 先保持 stage / owner / effective-state 口径;有 workload 与 evidence 后再量化。 |
| 非项目型执行主语 | 当前不进入正向范围;正式第三种主语与生命周期出现后重开 BC01 及关联单元。 |

### 3.4 哪些设计债务可接受,哪些不可接受

#### 当前可接受债务

| 债务 | 可接受原因 | 触发后处理方向 |
|---|---|---|
| 未锁定 Rust / Go / Python、存储、队列、调度与 retry library | 产品与工具不能反向定义 owner / data / failure 语义。 | 概要 / 详细 / 配置 / 实施阶段基于合同和 workload 选择。 |
| 未锁定单 / 双进程、sidecar、supervisor 或 transport | 当前只需逻辑 Runtime / host boundary 成立。 | host / Runtime 合同和部署责任闭口后复核 Step 6 / 9 / 10。 |
| host / Runtime / event / credential / rule 详细合同 pending | 所有受影响路径已有 blocked / gap / fail-closed 上限。 | 对应 owner 正式合同发布后收敛 adapter 与 carrier。 |
| idempotency key、ordering、backpressure 和 continuation 物理机制未定 | 架构已锁 duplicate / late / unknown 语义,无需提前私造 schema。 | 详细合同与失败模型闭口后进入 03 / 04 / 05。 |
| retention / archive / rebuild schedule 未定 | immutable / body-free / source-correlated 边界已成立。 | 数据生命周期和恢复要求形成后进入 03 / 04。 |
| capability outlet 暂不激活 | C1~C4 与 Member Summary 不依赖该子项;裁剪可显式表达。 | tool / method refs 与 consumer contract 同时稳定后激活。 |
| 固定 P95 / SLA / heartbeat / retry 数值未定 | 当前无新版 workload、测量或验收 evidence。 | 测试 / 生产数据形成后硬化。 |

#### 当前不可接受债务

| 债务 | 不可接受原因 |
|---|---|
| member / Runtime / host / Bus / downstream owner 不清 | 会形成双真相、回滚污染或自举生命周期。 |
| raw body、hidden reasoning、secret、definition / evidence body 进入 truth / handoff / trace / projection | 直接违反最小暴露与正文 owner 边界。 |
| projection / mirror / outlet / external feedback 反写核心决定 | 会形成第二写源或授权旁路。 |
| unknown side effect 自动 replay / restart / fallback | 可能重复不可逆副作用并接管外部 owner。 |
| 非 Core sibling package / private schema 进入核心 | 破坏依赖裁剪并伪闭口共享合同。 |
| pending / fake / planned / local attempt 写成 delivered / observed / accepted / ready | 破坏证据真实性和后续验收。 |
| 非项目型场景以 GlobalMember / Workspace view 代执行主语 | 身份锚不能替代执行主语,会使所有交互失去项目归属。 |

### 3.5 哪些事实触发下一阶段调整

| 触发事实 | 演进方向 | 最先改变的结构面 | 不得改变的边界 |
|---|---|---|---|
| member-service 字段 / IPC / credential 合同正式闭口 | host collaboration 激活 | BC01 external seam、adapter、配置来源 | host acceptance / registry / session / health 仍归 member-service。 |
| Runtime EntryAuthority / handoff mapping 正式闭口 | Runtime mediation 激活 | BC03 carrier、mapping、error / backpressure 分类 | run / plan / outcome truth 仍归 Runtime。 |
| Core member-specific schema / event family / route 闭口 | Bus / handoff 激活 | BC02 / 04 / 05 event carrier 与 route config | delivery / observed / accepted truth 仍外置。 |
| 正式 screening source / taxonomy 闭口 | inbound rule-source 硬化 | BC02 mirror result、effective config 与测试边界 | member 不形成 Policy truth或 local allowlist。 |
| trace / audit 消费需要长期恢复、对账或争议复盘 | trace lifecycle 增强 | BC05 retention / archive / reconciliation seam | complete log / Evidence / backend truth 不入 member。 |
| tool / method refs 与 consumer contract 稳定且确有出口需求 | capability outlet 激活 | BC07 outlet projection 与 freshness | registry、invocation authorization、execution availability 不归 member。 |
| workload / test / production data证明当前路径不足 | capacity / SLO / config 硬化 | stage budget、isolation、backpressure、effective config | 不降低 fail-closed、owner 或 local truth 一致性。 |
| 正式定义非项目型第三种执行主语与生命周期 | subject-scope evolution | BC01,并重审 BC02~05 / BC07 关联 | 不得以 GlobalMember 身份锚直接代主语。 |
| member-images component compatibility 合同改变逻辑运行单元 | deployment supply evolution | Step 6 static supply / host handoff 边界 | image build / manifest truth 不进入 member。 |
| 正式需求出现 outbound governance prerequisite | governance collaboration evolution | 回开 Step 4 / 8 / 9 / 10 / 12 的出站边界 | 当前不得预建 approval truth。 |

### 3.6 主线演进时最先改变什么

优先改变 External Boundary Seams、Technical Carriers、配置来源和 Derived Consumption,不先改 Member Core Semantics。只有正式需求或 owner 合同证明执行主语、核心决定或一致性模型本身不足时,才重开 BC01~05;transport、schema、adapter、projection 或指标变化不得静默改写核心 owner。

## 4. 当前材料诊断与兄弟状态刷新

| 材料 / 变化 | 诊断 | 本步处理 |
|---|---|---|
| member-service 正式 00 已停审 | member request / signal / report 与 host acceptance / registry / session / health 的需求级分工已可正式消费 | L2M-UP-001 缩为详细合同 / 凭据 / 联调 pending。 |
| member-images 正式 00 与正式 01 已停审 | 正式 01 确认 image asset / supply truth 外置,从 L2 component owner 消费 pinned release ref 并向 member-service 提供 pinned entry / gap;与本仓 owner / runtime 边界无漂移 | L2M-UP-002 收敛为 exact member release shape、manifest / version、compatibility、handoff / confirmation 与 readiness pending。 |
| 旧 `01` 把边界与 Rust / UDS / gRPC / supervisord / token /固定指标捆绑 | 合理 owner 分离与无 authority 实现污染混在一起 | 只保留逻辑 owner boundary,实现项按触发条件后移。 |
| Q-L2M-006 能力出口首批范围未定 | 不应拖住 C1~C4 或 Member Summary | 本步关闭为“结构保留、激活可裁剪”。 |
| Q-L2M-007 retention / archive 未定 | 不影响 immutable / body-free 语义成文 | 继续 pending 到 03 / 04。 |
| Q-L2M-008 outbound governance prerequisite 无正式场景 | 不能放入未来愿望池或当前主路径 | 只保留正式需求出现时的回开触发。 |

兄弟状态刷新不回改已批准正式 `00`;正式 `01` 在 §15 记录最新状态并保持需求基线语义不变。

## 5. 取舍

| 方案 | 优点 | 代价 | 结论 |
|---|---|---|---|
| 全部开放合同闭口后才认为架构成立 | 正向细节更完整 | 架构被并行上游无限阻塞,owner 与失败边界也无法下传 | 不采用 |
| 当前先锁核心语义与 fail-closed seam,由正式触发演进 carrier / projection | 边界可落码且 pending 不伪造;并行项目可独立推进 | 后续合同闭口时必须回开受影响设计 | 采用 |
| 把所有旧实现与未来增强写成路线图 | 看似具体 | 形成产品愿望池并恢复历史污染 | 不采用 |
| 为减少状态分类采用单 success + 自动 fallback | 实现心智较短 | 打穿 owner、unknown fence 与 evidence 纪律 | 不采用 |

## 6. 结构化中间产物与正式回填草稿

| 阶段 | 当前目标 / 范围 | 当前可接受债务 | 后续演进项 | 触发条件 | 说明 |
|---|---|---|---|---|---|
| 当前架构基线阶段 | BC01~07、inward dependencies、data / communication / cross-cutting 边界成立 | 物理 topology、transport、schema、storage、retention、指标与详细合同未锁 | 进入下游设计时细化对象、协议、配置、测试与承载 | 当前边界需要可落码,但无事实要求改造核心 owner | 当前成立不等于实现、联调或 readiness。 |
| 正式合同激活阶段 | 在不改 owner 的前提下激活 host、Runtime、Bus、credential、rule source seam | 正向 adapter / carrier 在合同闭口前 blocked | mapping、carrier、error / backpressure、effective config | 对应 owner 发布正式合同 | 最先改变 External Boundary / Technical Carrier。 |
| Trace / Read 消费增强阶段 | 强化 retention、archive / observation handoff、reconciliation、outlet 与下游只读消费 | outlet 可裁剪,retention / route / SDK 未锁 | lifecycle、rebuild、只读分发和 capability outlet | 审计恢复、消费者或 tool / method ref 形成正式压力 | 不让 backend、registry 或 read model 反写真相。 |
| 容量 / 配置 / 恢复硬化阶段 | 用 workload 与 evidence 收敛 stage budget、隔离、backpressure 和配置治理 | 当前无固定 P95 / SLA / retry / heartbeat 数值 | SLO、容量、配置清单、变更审查和恢复验证 | 测试 / 生产数据证明当前承载不足 | 不以性能换 fail-open 或 owner 混写。 |
| 执行主语范围演进阶段 | 在正式第三种主语存在时扩展 project-scoped 之外的正向范围 | 当前非项目型 fail closed | 重开 presence、subscription、trace 与 read 关联 | 上游正式定义主语、身份关联和生命周期 | GlobalMember 继续只是身份锚,不得直接代执行主语。 |

正式 §14 回填上述演进路线表、阶段边界短文和触发条件表。不得加入日期、版本、任务拆单、实现承诺或边界外能力。

## 7. Step 门禁自检

| 检查项 | 结果 |
|---|---|
| 当前阶段成立下限是否明确 | pass |
| 可接受 / 不可接受债务是否分开且有理由 | pass |
| 后续演进是否都有事实触发条件 | pass |
| capability outlet 是否完成架构阶段裁剪判断 | pass:结构保留,激活可裁剪 |
| 是否把边界外能力、旧实现或产品愿望写成演进主线 | pass:未写 |
| 是否写项目排期、版本、TODO 或任务拆单 | pass:未写 |
| pending 是否未伪装实现 / integration / readiness | pass |
| Step 13 总门禁 | `pass` |

下一允许动作仅为创建 `01_arch_step_14_risks_open_questions.md`;正式 `01` 仍禁止修改。
