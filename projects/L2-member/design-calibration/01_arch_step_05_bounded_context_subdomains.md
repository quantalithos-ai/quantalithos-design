# Step 5. 限界上下文与子域划分

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 5
> 对应书写规范: `standards/document/架构设计书写规范.md` §4.6
> 回填位置: 正式 `01-架构设计.md` §6
> 日期: 2026-08-22
> 当前状态: `pass`;BC-L2M-01~07 与 cross-context audit 全部通过
> 串行门禁: 七个单元逐个停审并完成跨上下文审计前,禁止创建 Step 6

## 1. 本步输入与禁区

| 输入 | 本步承接 |
|---|---|
| Step 3 `RESP-L2M-001~010` / `RR-L2M-001~010` | 仓级职责与不可混淆 owner。 |
| Step 4 系统上下文与输入 / 输出面 | 内部语义划分不得越出系统边界。 |
| 正式 00 C-L2M-1~5 / FR-L2M-001~012 | 核心能力与派生能力的语义来源。 |
| `draft/03_模块划分与分层.md` | 8 个候选组成部分,仅作候选差异输入。 |
| L1-governance 架构粒度 | 参考“业务组成部分 x 实现分层”分离方式。 |

本步不写对象字段、数据库、代码目录、trait / port、协议、容器或部署。`Member truth core` 是所有核心上下文共同遵守的 truth / invariant 原则,不是具有独立业务语言和生命周期的第八个限界上下文;`Safe material and maintenance` 分别由 Trace / Read Model 承接,不预设独立常驻模块。

## 2. 架构单元计划

| 顺序 | ID | 候选上下文 | 分类 | 主要来源 | 状态 |
|---:|---|---|---|---|---|
| 1 | `BC-L2M-01` | Presence and Host Collaboration | core subdomain | RESP-001 / 002;C1 | pass |
| 2 | `BC-L2M-02` | Inbound Boundary | core subdomain | RESP-003 / 004;C2 | pass |
| 3 | `BC-L2M-03` | Runtime Mediation | core subdomain | RESP-005;C2 / C3 seam | pass |
| 4 | `BC-L2M-04` | Outbound Boundary | core subdomain | RESP-006 / 007;C3 | pass |
| 5 | `BC-L2M-05` | Interaction Trace | core subdomain | RESP-008;C4 | pass |
| 6 | `BC-L2M-06` | External Context Mirror | supporting subdomain | RESP-010;external refs / snapshots | pass |
| 7 | `BC-L2M-07` | Member Read Model | local projection context | RESP-009;C5 / peripheral | pass |
| 8 | cross-context audit | overlap / truth / language / pending review | all | pass |

## 3. 划分原则

1. 具有不同 owner、决定语义、失败语义或统一语言的职责不强行合并。
2. 同一业务事实只在一个核心上下文中拥有;Trace 只拥有追溯关联事实,Read Model 只拥有可重建投影。
3. 外部 truth 通过 Mirror 的 ref / safe snapshot 语义进入,但正文和生命周期留在来源仓。
4. “管道位置”“协议适配器”“源码目录”不能作为上下文划分依据。
5. C1~C4 必须由核心上下文承接;C5 通过本地投影承接,能力出口可裁剪。

## 4. BC-L2M-01 Presence and Host Collaboration

### 4.1 作用与分类

| 项 | 结论 |
|---|---|
| 分类 | core subdomain |
| 作用 | 证明“哪个项目成员实例在本容器内以何种本地状态在场”,并形成给 host 的本地协作事实。 |
| 需求承接 | FR-L2M-001~003;RESP-L2M-001 / 002;C-L2M-1 |
| 核心原因 | 没有可归属 presence,所有入站 / 出站事实都无法回答“谁在执行”,成员门面不存在。 |

### 4.2 职责与非职责

| 类型 | 内容 |
|---|---|
| owns | 项目型执行主语受理、本地 presence、启动语境 acceptance / rejection、显式 presence change、host collaboration request / signal / report 及 local attempt / gap。 |
| consumes | ProjectMemberRef、GlobalMemberRef、startup context / credential ref、host acceptance / session safe reference。 |
| does not own | ProjectMember / GlobalMember lifecycle、credential issue / revoke、container lifecycle、host acceptance、endpoint registry、host session、health verdict。 |
| forbidden | GlobalMember / Workspace view 代替执行主语;不可验证语境降级放行;host feedback 覆盖本地 presence 历史。 |

### 4.3 统一语言

| 术语 | 本上下文唯一含义 | 禁止混用 |
|---|---|---|
| `Execution Subject` | 当前 project-scoped 实例的 ProjectMemberRef | 不等于 GlobalMember identity anchor。 |
| `Identity Anchor` | 与执行主语关联的 GlobalMemberRef | 不授予执行资格,不等于 presence。 |
| `Startup Acceptance` | member 对启动语境是否足以建立本地 presence 的结论 | 不等于 host registration acceptance。 |
| `Presence` | 本容器内 member 的显式在场事实 | 不等于进程存活、host health 或 Runtime run。 |
| `Host Collaboration Attempt` | member 形成本地 request / signal / report 并尝试交接的事实 | 不等于 host 已接受或 session 已建立。 |

### 4.4 本地索引 / 投影 / 引用边界

| 类别 | 允许 | 禁止 |
|---|---|---|
| reference | ProjectMemberRef、GlobalMemberRef、credential / host acceptance / session ref | 保存身份 / 工作 / credential 正文或改变其生命周期。 |
| safe snapshot | 启动所需最小安全语境、host 状态安全摘要 | 将 snapshot 当 health truth,或用 stale snapshot 自动进入 ready。 |
| local truth | presence、startup acceptance / rejection、host collaboration local attempt / gap | 以 host result 反写既有事实。 |
| projection | 本单元只提供 committed fact source,不在此拥有查询投影 | 将摘要读模型混入 presence 决策。 |

### 4.5 与其他上下文的关系

- 向 Inbound / Runtime Mediation / Outbound 提供可归属 presence 语境,但不替它们作业务决定。
- 从 External Context Mirror 消费双锚、credential / host safe reference 的解析状态。
- 向 Interaction Trace 提供已提交 presence / host attempt 事实。
- 向 Member Read Model 提供只读事实源,Read Model 不得反写。

### 4.6 为什么不能与其他上下文合并

- 与 Inbound 合并会把“谁在场”与“什么可进入”混成一类决定。
- 与 host 外部 owner 合并会让 member 拥有 acceptance / health / lifecycle。
- 与 Read Model 合并会让摘要 freshness 影响 presence truth。
- 与 Runtime Mediation 合并会把 Runtime availability / acceptance 误作 member presence。

### 4.7 单上下文停审

| 审计项 | 结果 |
|---|---|
| core / supporting / projection 分类是否正确 | pass;存在性下限,属于 core |
| 职责与非职责是否清楚 | pass |
| 与系统上下文是否一致 | pass;Work / Identity / host truth 外置 |
| 是否把 snapshot / ref 写成 truth | pass:未写 |
| 是否误写协议、字段、代码或部署 | pass:未写 |
| 统一语言是否与相邻 owner 冲突 | pass;subject / anchor / presence / health 分开 |

`BC-L2M-01 gate_status = pass`。当前停审完成;下一允许单元仅为 `BC-L2M-02`。

## 5. BC-L2M-02 Inbound Boundary

### 5.1 作用与分类

| 项 | 结论 |
|---|---|
| 分类 | core subdomain |
| 作用 | 决定成员在正式语境下“可以听什么”,并对已到达事实形成可解释、可回链、最小暴露的筛选结论。 |
| 需求承接 | FR-L2M-004 / 005;RESP-L2M-003 / 004;C-L2M-2 |
| 核心原因 | 没有订阅 / 筛选 truth,member 会退化为 Bus 到 Runtime 的透明转发管道。 |

### 5.2 职责与非职责

| 类型 | 内容 |
|---|---|
| owns | subscription scope decision、scope change record、screening conclusion(passed / downgraded / blocked / pending)、规则来源关联、body-free disposition record。 |
| consumes | 可归属 presence 语境、inbound fact ref、授权范围内瞬时 inspection material、Policy effective result / safe snapshot。 |
| does not own | Bus delivery / route、Policy / approval truth、raw body、Runtime acceptance、语义推理或 plan。 |
| forbidden | 自建永久 allowlist;规则 unknown / stale / conflict 时 fail open;正文持久化;把 screening passed 写成 delivery / Runtime accepted。 |

### 5.3 统一语言

| 术语 | 本上下文唯一含义 | 禁止混用 |
|---|---|---|
| `Subscription Scope Decision` | member 对当前可承接事实范围的本地决定 | 不等于 Bus route / subscription delivery truth。 |
| `Inspection Window` | 正式授权范围内对必要正文的瞬时、非持久化检查语境 | 不等于 raw body storage 或 Runtime context。 |
| `Screening Conclusion` | passed / downgraded / blocked / pending 四态本地结论 | 不等于 Governance decision 或 Runtime acceptance。 |
| `Rule Source Link` | 指向正式规则结果 / safe snapshot 的关联 | 不等于规则定义副本。 |
| `Inbound Disposition` | member 对当前事实如何留在入站边界的 body-free 处置记录 | 不等于投递结果。 |

### 5.4 本地索引 / 投影 / 引用边界

| 类别 | 允许 | 禁止 |
|---|---|---|
| reference | inbound fact ref、rule source ref、member subject / scope ref | 复制事实正文、Policy body 或身份正文。 |
| safe snapshot | Policy effective / risk taxonomy 的最小安全结果及 freshness | 以 snapshot 形成第二 policy truth 或 stale 自动放行。 |
| local truth | subscription decision、screening conclusion、disposition record | 将 Bus / Runtime 反馈改写为筛选 truth。 |
| transient material | 授权 inspection window 内的必要正文 | 持久化、缓存、trace、projection 或透明转发。 |

### 5.5 与其他上下文的关系

- 从 Presence 消费可归属 subject / presence 语境;presence 不替本上下文决定 scope 或 screening。
- 从 External Context Mirror 消费 rule / identity safe snapshot 的解析与 freshness 状态。
- 向 Runtime Mediation 提供 screened、source-anchored、body-safe 的受控交付语境;不提供 raw body。
- 向 Interaction Trace 提供已提交 scope / screening / disposition 事实。
- 向 Member Read Model 提供 body-free 统计 / freshness 源,投影不反写。

### 5.6 为什么不能与其他上下文合并

- 与 Runtime Mediation 合并会把“允许进入”与“是否已向 Runtime 提交 / 受理”压平。
- 与 Governance 合并会把规则来源与筛选使用结论变成同一 truth。
- 与 Bus adapter 概念合并会把 delivery / route 误写成本仓所有权。
- 与 Trace / Read Model 合并会让诊断或统计反向改变筛选决定。

### 5.7 单上下文停审

| 审计项 | 结果 |
|---|---|
| core / supporting / projection 分类是否正确 | pass;C2 的安全入口决定属于 core |
| 职责与非职责是否清楚 | pass |
| 与系统上下文是否一致 | pass;Bus / Governance / Runtime truth 外置 |
| transient body 与 reference / snapshot / truth 是否分开 | pass |
| 是否误写算法、规则字段、event schema 或 adapter | pass:未写 |
| 统一语言是否冲突 | pass;screening / policy decision / runtime acceptance 分开 |

`BC-L2M-02 gate_status = pass`。当前停审完成;下一允许单元仅为 `BC-L2M-03`。

## 6. BC-L2M-03 Runtime Mediation

### 6.1 作用与分类

| 项 | 结论 |
|---|---|
| 分类 | core subdomain |
| 作用 | 在 member 一侧保护 Runtime entry / handoff 边界,决定受控入站语境是否提交,关联 Runtime 受理结果,并受理 committed safe material 的来源语境。 |
| 需求承接 | FR-L2M-006 / 007 的 seam;RESP-L2M-005;C-L2M-2 -> C-L2M-3 |
| 核心原因 | 若没有独立 mediation 语义,screening、transport、Runtime acceptance、run 与 outcome 会被一个“IPC 成功”压平。 |

### 6.2 职责与非职责

| 类型 | 内容 |
|---|---|
| owns | runtime delivery decision、受控 entry submission 的本地 attempt / gap、screening-to-entry correlation、Runtime acceptance / rejection / unknown ref 关联、committed safe material reception / source validation 的 member 结论。 |
| consumes | Inbound 提供的 screened controlled context、Presence 语境、Runtime transport-neutral EntryAuthority、Runtime result / committed material ref。 |
| does not own | Runtime entry authority、acceptance truth、run / context / plan / checkpoint / outcome、IPC transport、Runtime restart、raw body。 |
| forbidden | screening passed 自动触发成功投递;submission 等同 acceptance;timeout / unknown 盲重放;member 代答;safe material reception 改写 Runtime outcome。 |

### 6.3 统一语言

| 术语 | 本上下文唯一含义 | 禁止混用 |
|---|---|---|
| `Runtime Delivery Decision` | member 决定是否把受控语境提交到正式 Runtime entry | 不等于 screening conclusion 或 Runtime acceptance。 |
| `Entry Submission Attempt` | member 已尝试跨越 Runtime seam 的本地事实 | 不等于 transport delivered、accepted 或 run created。 |
| `Entry Result Link` | 指向 Runtime 自有受理 / 拒绝结果的关联 | 不复制 Runtime result truth。 |
| `Committed Material Reception` | member 对来源可验证的 Runtime committed safe material ref 的受理结论 | 不等于 member 已决定出站。 |
| `Runtime Boundary Gap` | seam 未闭口、不可用、timeout、unknown 或关联不完整的显式缺口 | 不等于失败后可自动重试授权。 |

### 6.4 本地索引 / 投影 / 引用边界

| 类别 | 允许 | 禁止 |
|---|---|---|
| reference | Runtime entry result ref、committed outcome / safe material ref、correlation ref | 复制 run / plan / checkpoint / outcome 正文。 |
| safe context | source-anchored typed ref / safe snapshot / controlled context | transparent raw body、hidden reasoning 或 secret。 |
| local truth | delivery decision、submission attempt / gap、reception / source validation conclusion、correlation | 把 Runtime acceptance / outcome 变成本地 truth。 |
| projection | 不在本上下文拥有 Runtime view;只保留必要 ref / status marker | shadow Runtime state machine 或可写 cache。 |

### 6.5 与其他上下文的关系

- 从 Inbound 接收 screened controlled context;筛选结论不可由 mediation 改写。
- 从 Presence 消费当前 subject / presence 语境;Runtime unavailable 不自动终止 presence。
- 向 Outbound 提供已受理且来源可验证的 committed safe material ref;不替 Outbound 决定发布。
- 向 Interaction Trace 提供 delivery / reception / gap 的已提交本地事实。
- 通过 External Context Mirror 解析 Runtime refs / safe view freshness,但 EntryAuthority 的正式 mapping 继续受 L2M-UP-003 阻塞。

### 6.6 为什么不能与其他上下文合并

- 与 Inbound 合并会让 screening passed 等于 submitted / accepted。
- 与 Runtime 本体合并会复制 run / outcome truth 并违反仓边界。
- 与 Outbound 合并会让 committed material reception 自动变成 publish decision。
- 与 transport adapter 合并会把 UDS / gRPC / IPC 载体误作领域语义。

### 6.7 单上下文停审

| 审计项 | 结果 |
|---|---|
| core / supporting / projection 分类是否正确 | pass;是 C2 / C3 之间不可缺的 owner boundary |
| screening / submission / acceptance / outcome / outbound 是否分开 | pass |
| Runtime truth 是否保持外置 | pass |
| mapping blocker 是否保持 pending | pass;L2M-UP-003 未闭口 |
| 是否锁定 UDS / gRPC / IPC schema 或重试 | pass:未锁定 |
| 是否允许 raw body / hidden reasoning | pass:禁止 |

`BC-L2M-03 gate_status = pass`。当前停审完成;下一允许单元仅为 `BC-L2M-04`。

## 7. BC-L2M-04 Outbound Boundary

### 7.1 作用与分类

| 项 | 结论 |
|---|---|
| 分类 | core subdomain |
| 作用 | 决定来源可验证的 Runtime committed safe material 是否、向哪个正式平台边界、以何种 body-free 形态离开 member,并记录发布本地事实。 |
| 需求承接 | FR-L2M-007 / 008;RESP-L2M-006 / 007;C-L2M-3 |
| 核心原因 | 没有独立 outbound decision,Runtime outcome 会直接穿透到 Bus / Conversation / Observability,且 delivery 失败会污染运行结果。 |

### 7.2 职责与非职责

| 类型 | 内容 |
|---|---|
| owns | outbound decision、body-free material acceptance / rejection、正式 handoff target class 选择、publication attempt / gap、external feedback correlation 的追加事实。 |
| consumes | Runtime Mediation 提供的 committed safe material ref、可归属 presence / correlation、正式输出边界可用性 / route safe reference(若已闭口)。 |
| does not own | Runtime outcome、Bus delivery / redelivery / route truth、Conversation append / ordering、Artifact / Evidence、observed / accepted truth。 |
| forbidden | 不安全 material 降级放行;committed outcome 自动发布;attempt 等同 delivery;迟到反馈覆盖决定;直连 provider / MCP / A2A / API。 |

### 7.3 统一语言

| 术语 | 本上下文唯一含义 | 禁止混用 |
|---|---|---|
| `Outbound Decision` | member 对“是否 / 向何种正式边界 / 以何种安全形态交接”的本地决定 | 不等于 Runtime outcome 或 downstream acceptance。 |
| `Safe Handoff Material` | 从正式 committed ref 派生、最小必要、body-free、可关联的交接材料 | 不等于运行正文、对话正文、artifact 或 evidence。 |
| `Publication Attempt` | member 已尝试向正式事件 / handoff 边界提交的本地事实 | 不等于 Bus delivered / observed / accepted。 |
| `Handoff Gap` | route pending、边界不可用、提交失败或反馈关联缺口 | 不授权盲重放,不否定既有 outbound decision。 |
| `External Feedback Link` | 指向外部 delivery / accepted / observed 摘要的关联 | 不复制或反写外部 truth。 |

### 7.4 本地索引 / 投影 / 引用边界

| 类别 | 允许 | 禁止 |
|---|---|---|
| reference | Runtime committed material / outcome ref、正式 target / route ref、external feedback ref | 复制 Runtime / Conversation / Artifact / Observability 正文。 |
| safe material | body-free、redacted、source-anchored、correlatable handoff material | hidden reasoning、secret、raw input / output body、definition body。 |
| local truth | outbound decision、material rejection、publication attempt / gap、feedback link fact | delivery / observed / accepted 或 external route truth。 |
| projection | 对 attempt / gap 的派生摘要由 Read Model 拥有 | 以查询 / retry view 改写 outbound truth。 |

### 7.5 与其他上下文的关系

- 从 Runtime Mediation 接收来源可验证的 committed safe material ref;reception 不自动形成 outbound decision。
- 从 Presence 消费当前 subject / presence 关联;presence 退出不抹除已提交 outbound 历史。
- 向 Interaction Trace 提供 outbound decision、material gate、attempt / gap 与 feedback link 事实。
- 向 Member Read Model 提供只读事实源。
- 通过 External Context Mirror 解析 route / target / feedback safe reference;L2M-UP-004 / 005 未闭口时只形成 gap。

### 7.6 为什么不能与其他上下文合并

- 与 Runtime Mediation 合并会让 outcome reception 自动等同 publish decision。
- 与 Bus / Conversation / Observability 合并会吸收 delivery / append / observed truth。
- 与 Interaction Trace 合并会让追溯 / 对账路径修改 outbound decision。
- 与 capability / external adapter 合并会产生任意外呼路径。

### 7.7 单上下文停审

| 审计项 | 结果 |
|---|---|
| core / supporting / projection 分类是否正确 | pass;C3 的本地出站决定属于 core |
| outcome / decision / attempt / delivery / accepted 是否分层 | pass |
| safe material / forbidden body 是否清楚 | pass |
| external truth 是否保持 ref / feedback link | pass |
| route / event family blocker 是否保留 | pass;L2M-UP-004 / 005 未闭口 |
| 是否写 retry 算法、topic、schema、adapter 或外呼 | pass:未写 |

`BC-L2M-04 gate_status = pass`。当前停审完成;下一允许单元仅为 `BC-L2M-05`。

## 8. BC-L2M-05 Interaction Trace

### 8.1 作用与分类

| 项 | 结论 |
|---|---|
| 分类 | core subdomain |
| 作用 | 把各核心上下文已提交事实连接成 body-free、可归责的交互语境,显式暴露关联缺口,并形成最小安全观测 / 审计材料及本地交接事实。 |
| 需求承接 | FR-L2M-009 / 010;RESP-L2M-008;C-L2M-4 |
| 核心原因 | 若追溯只是可选日志,成员门面无法解释误拦截、丢失、重复、未送达和 owner 分界,C1~C3 的 truth 也无法审计。 |

### 8.2 职责与非职责

| 类型 | 内容 |
|---|---|
| owns | 本地 committed fact 之间的 trace link、correlation gap、body-free trace record、安全观测 / 审计材料形成、observation handoff local attempt / gap。 |
| consumes | Presence / Inbound / Runtime Mediation / Outbound 已提交事实的稳定引用与最小安全摘要。 |
| does not own | 被引用核心决定本身、完整日志、raw body、hidden reasoning、secret、Evidence / verdict、observability ingest / store / observed truth。 |
| forbidden | 为补齐 trace 猜测关联;复制业务正文;以 trace / reconciliation 修改核心事实;handoff attempt 等同 observed。 |

### 8.3 统一语言

| 术语 | 本上下文唯一含义 | 禁止混用 |
|---|---|---|
| `Interaction Trace` | 连接 member 已提交事实的 body-free 可追溯语境 | 不等于完整日志、distributed trace backend 或 Conversation history。 |
| `Trace Link` | 两个正式本地事实或外部 ref 之间有来源的关联 | 不复制被关联事实正文。 |
| `Correlation Gap` | 来源、目的、结果或关联不完整的显式缺口 | 不通过猜测填补。 |
| `Safe Observation Material` | 从已提交事实派生的低敏、低基数、最小必要材料 | 不等于 evidence、report 或 observed fact。 |
| `Observation Handoff Attempt` | 向正式观测 / 审计边界提交材料的本地尝试 | 不等于 ingest / stored / observed。 |

### 8.4 本地索引 / 投影 / 引用边界

| 类别 | 允许 | 禁止 |
|---|---|---|
| reference | 本地 committed fact ref、external source / result ref、trace context authority 下的关联元数据 | 复制完整 event / run / conversation / tool body。 |
| local truth | trace link、correlation gap、safe material formation、observation attempt / gap | 重定义 presence / screening / delivery / outbound truth。 |
| derived material | body-free、redacted、low-cardinality observation / audit material | evidence verdict、forensic completeness、backend state。 |
| projection | 可为 Read Model 提供 trace summary source | 查询 / report / reconciliation 反写 link 或核心事实。 |

### 8.5 与其他上下文的关系

- Presence、Inbound、Runtime Mediation、Outbound 是事实源;Trace 只追加有来源的关联,不修改源事实。
- External Context Mirror 提供 external ref 的 resolution / freshness marker;unresolved 形成 correlation gap。
- Member Read Model 消费 trace / gap 的只读安全摘要,不直接读取 forbidden body。
- Observability / evidence owner 位于系统外;本上下文只形成 material 和 handoff attempt / gap。

### 8.6 为什么不能与其他上下文合并

- 分散到每个核心上下文会造成关联规则、body redaction 和 gap 语义重复且不一致。
- 与 Observability backend 合并会把 observed / storage truth 拉入 member。
- 与 Read Model 合并会让查询 / report / rebuild 改写 trace link。
- 与 Outbound 合并会混淆 interaction publication 与 observation material handoff 两种本地 attempt。

### 8.7 单上下文停审

| 审计项 | 结果 |
|---|---|
| core / supporting / projection 分类是否正确 | pass;C4 是核心闭环必要条件 |
| 是否只拥有 link / gap / material / attempt,不复制源 truth | pass |
| forbidden body / evidence / observed truth 是否外置 | pass |
| publication attempt 与 observation attempt 是否分开 | pass |
| trace 缺口是否显式且禁止猜测 | pass |
| 是否下沉 retention、backend、log schema 或 telemetry implementation | pass:未下沉 |

`BC-L2M-05 gate_status = pass`。当前停审完成;下一允许单元仅为 `BC-L2M-06`。

## 9. BC-L2M-06 External Context Mirror

### 9.1 作用与分类

| 项 | 结论 |
|---|---|
| 分类 | supporting subdomain |
| 作用 | 在不复制外部 truth / body 的前提下,向核心上下文提供来源可识别、scope 可判断、freshness 可表达的 ref / safe snapshot 消费语境。 |
| 需求承接 | RESP-L2M-010;DB-L2M-003~009;FR-L2M-001 / 003~007 / 011 / 012 的外部输入边界 |
| 支撑原因 | 它不产生“成员在场 / 听 / 说 / 追溯”的核心决定,但隔离外部语言、解析失败和 stale / unresolved 状态。 |

### 9.2 职责与非职责

| 类型 | 内容 |
|---|---|
| owns | external reference resolution state、safe snapshot receipt state、source / scope / freshness marker、resolution / compatibility gap 的本地支撑事实。 |
| consumes | Work / Identity / Governance / host / Runtime / Bus feedback / Tools / method 的正式 ref 或 safe snapshot。 |
| does not own | 任何外部实体生命周期、Policy / Runtime / host / delivery / ToolDefinition truth、外部正文、通用 registry、外部 adapter 调用资格。 |
| forbidden | 将 resolved 当作业务允许 / healthy / accepted;对 stale snapshot 静默续期;从多个来源合并出新 truth;成为 provider / MCP / A2A / API gateway。 |

### 9.3 统一语言

| 术语 | 本上下文唯一含义 | 禁止混用 |
|---|---|---|
| `External Reference` | 指向正式 owner 对象 / 事实的稳定关联 | 不等于对象正文或 member-owned entity。 |
| `Safe Snapshot` | 来源仓允许跨边界消费的最小、带时点语境 | 不等于 source truth 或永久 cache。 |
| `Resolution State` | ref 当前 resolved / unresolved / conflict / unsupported 的本地消费状态 | 不等于 authorization、presence、health 或 Runtime acceptance。 |
| `Freshness Marker` | snapshot 的 source time / observed freshness / stale 语义 | 不证明 source 当前真实状态。 |
| `Mirror Gap` | schema / owner / route / ref 不可解析或未闭口的显式缺口 | 不等于可用 fake 或自动 fallback。 |

### 9.4 本地索引 / 投影 / 引用边界

| 类别 | 允许 | 禁止 |
|---|---|---|
| reference | 所有正式 external ref 及其 source / scope metadata | reference target body、secret、credential value、definition body。 |
| safe snapshot | owner 授权的最小摘要及 freshness | 透明复制全文、无来源拼接、反写来源。 |
| local support truth | resolution / receipt / freshness / conflict / gap marker | 业务 decision、external lifecycle 或 source compatibility verdict。 |
| local index | 为按 ref 定位当前消费状态的可重建索引 | 第二 registry、canonical definition store 或可写 external model。 |

### 9.5 与其他上下文的关系

- Presence 消费 Work / Identity / host / credential ref 的解析与 freshness,自行形成 startup / presence 结论。
- Inbound 消费 Policy / fact source safe snapshot,自行形成 subscription / screening 结论。
- Runtime Mediation 消费 Entry / outcome / safe material ref 的解析状态,自行形成 delivery / reception 结论。
- Outbound 消费 target / route / feedback ref 状态,自行形成 decision / attempt / gap。
- Trace 消费 external ref 的 resolution marker,但只生成 trace link / correlation gap。
- Read Model 消费 ref / snapshot freshness 以展示 stale / gap,不把 Mirror 当业务 truth。

### 9.6 为什么不能与其他上下文合并

- 分散到各核心上下文会重复外部语言翻译、freshness 和 unresolved 语义,并诱发多套 shadow schema。
- 与 Core shared contract 合并会让项目仓复制全局 schema authority。
- 与 Member Read Model 合并会把展示 freshness 与核心消费 resolution 混合。
- 与 capability registry / adapter hub 合并会扩大为边界外产品能力。

### 9.7 单上下文停审

| 审计项 | 结果 |
|---|---|
| core / supporting / projection 分类是否正确 | pass;只支撑外部语境隔离 |
| 是否拥有任何外部 truth / body | pass:不拥有 |
| resolution 是否与 authorization / health / acceptance 分开 | pass |
| 是否形成第二 registry / schema authority | pass:未形成 |
| ref 是否被误作第四类依赖 | pass:未误作 |
| pending seam 是否保留 gap / blocked | pass |

`BC-L2M-06 gate_status = pass`。当前停审完成;下一允许单元仅为 `BC-L2M-07`。

## 10. BC-L2M-07 Member Read Model

### 10.1 作用与分类

| 项 | 结论 |
|---|---|
| 分类 | local projection context |
| 作用 | 从本地已提交事实、Trace 关联和外部 ref / safe view 派生 body-free 的成员状态、交互摘要、能力出口和外围诊断 / 配置解释视图。 |
| 需求承接 | FR-L2M-011 / 012、FR-L2M-E01~E03;RESP-L2M-009;C-L2M-5 |
| 投影原因 | 所有输出都可从正式 source 重建,且不得成为在场、筛选、投递、出站、规则或能力定义的写源。 |

### 10.2 职责与非职责

| 类型 | 内容 |
|---|---|
| owns | member summary projection、capability outlet projection(可裁剪)、interaction / screening diagnostic summary、effective boundary explanation view、projection freshness / rebuild / gap state。 |
| consumes | BC01~05 的已提交本地事实、BC06 的 external ref / freshness marker、Runtime / Tools / method safe view / ref。 |
| does not own | presence / screening / delivery / outbound / trace truth、configuration truth、ToolDefinition / method body、capability registry、Conversation / Observability read model。 |
| forbidden | 查询 / rebuild / reconciliation 改写源事实;展示 stale 数据而不标 freshness;复制定义 / 正文;把 outlet 当调用授权。 |

### 10.3 统一语言

| 术语 | 本上下文唯一含义 | 禁止混用 |
|---|---|---|
| `Member Summary` | 从 member committed facts 派生的 body-free 当前视图 | 不等于 presence truth、host health 或 Runtime state。 |
| `Capability Outlet` | 从正式 tool / method ref 派生的“当前可见可承接范围”安全视图 | 不等于 registry、invocation permission 或 execution availability。 |
| `Diagnostic Summary` | 对 screening / interaction 分布和 gap 的只读派生解释 | 不改变规则或事实。 |
| `Boundary Explanation View` | 展示当前生效边界、来源和 freshness 的只读视图 | 不等于 configuration truth 或变更入口。 |
| `Projection Freshness` | 视图相对正式 source 的 fresh / stale / rebuilding / unresolved 状态 | 不证明 source 自身 readiness。 |

### 10.4 本地索引 / 投影 / 引用边界

| 类别 | 允许 | 禁止 |
|---|---|---|
| source ref | member committed fact ref、Runtime / Tools / method safe ref、external freshness marker | 复制 source body 或获得写权限。 |
| projection | summary / outlet / diagnostic / explanation view 及 freshness / gap | 作为 canonical truth、authorization 或 registry。 |
| rebuild state | rebuilding / failed / gap 与 source cursor 类抽象语义 | 重建期间改写 / 补造 source fact。 |
| forbidden body | 无正文持久化例外 | event / run / conversation / tool / method / secret / hidden reasoning body。 |

### 10.5 与其他上下文的关系

- BC01~05 提供已提交事实源;Read Model 只能消费,不能参与其决定。
- BC06 提供 ref resolution / freshness;Read Model 必须把 stale / unresolved 传播到视图。
- 外部 SDK / 产品读取方未来只读消费视图;不能通过读取面回写 member truth。
- capability outlet 可裁剪;其缺失不得拖垮 Member Summary 或 C1~C4。

### 10.6 为什么不能与其他上下文合并

- 与任一核心上下文合并都会让查询 / rebuild / presentation concern 侵入写模型。
- 与 External Context Mirror 合并会把 source resolution 与面向消费者的 projection 混为一谈。
- 与 capability registry 合并会复制定义、资格和生命周期 truth。
- 与 Conversation / Observability view 合并会吸收下游产品 / backend 职责。

### 10.7 单上下文停审

| 审计项 | 结果 |
|---|---|
| core / supporting / projection 分类是否正确 | pass;全部为可重建只读派生 |
| summary / outlet / diagnostic / explanation 是否禁止反写 | pass |
| capability outlet 是否与 registry / authorization 分开 | pass |
| freshness / gap 是否显式 | pass |
| 能力出口可裁剪是否保留 | pass |
| 是否写查询 API、字段、存储或 rebuild job 细节 | pass:未写 |

`BC-L2M-07 gate_status = pass`。七个上下文均已逐个停审;下一允许动作仅为跨上下文语义边界审计。

## 11. 上下文关系图

```text
+=====================================================================+
|                 L2-member bounded context map                       |
+=====================================================================+
|                                                                     |
|  +-------------------+       +-------------------+                  |
|  | BC01 Presence     | ----> | BC02 Inbound      |                  |
|  +---------+---------+       +---------+---------+                  |
|            |                           |                            |
|            |                           v                            |
|            |                 +-------------------+                  |
|            +---------------> | BC03 Runtime      |                  |
|                              | Mediation         |                  |
|                              +---------+---------+                  |
|                                        |                            |
|                                        v                            |
|                              +-------------------+                  |
|                              | BC04 Outbound     |                  |
|                              +---------+---------+                  |
|                                        |                            |
|      committed local facts from BC01~04|                            |
|                                        v                            |
|                              +-------------------+                  |
|                              | BC05 Interaction  |                  |
|                              | Trace             |                  |
|                              +---------+---------+                  |
|                                        |                            |
|  +-------------------+                 v                            |
|  | BC06 External     | --------> +-------------------+             |
|  | Context Mirror    | --------> | BC07 Member       |             |
|  +---------+---------+           | Read Model        |             |
|            |                     +-------------------+             |
|            +---- supports BC01~05 with refs / safe snapshots       |
|                                                                     |
+=====================================================================+
```

图示说明:

- BC01~04 的箭头表示决定语义的依赖,不是固定运行时序;入站与出站可以并发存在。
- BC05 只连接 BC01~04 的 committed local facts,不拥有这些源决定。
- BC06 是反腐化 / mirror 支撑边界,只提供 ref / snapshot 的 resolution / freshness / gap。
- BC07 是只读投影边界;任何 rebuild、query 或 diagnostic 都不得反写 BC01~06。

## 12. 跨上下文语义边界审计

### 12.1 Truth 唯一性与职责重叠

| 语义事实 | 唯一 owner | 其他上下文仅可持有 | 审计结果 |
|---|---|---|---|
| startup acceptance / local presence / host attempt | BC01 | ref、trace link、summary projection | pass |
| subscription decision / screening conclusion / disposition | BC02 | controlled context、trace link、diagnostic projection | pass |
| Runtime delivery decision / submission / reception / boundary gap | BC03 | ref、trace link、summary projection | pass |
| outbound decision / material gate / publication attempt / gap | BC04 | ref、trace link、summary projection | pass |
| trace link / correlation gap / observation material / attempt | BC05 | trace summary projection | pass |
| external ref resolution / freshness / mirror gap | BC06 | marker copy in consumer context / read projection | pass |
| summary / outlet / diagnostic / explanation / projection freshness | BC07 | 无其他写 owner | pass |

未发现同一 member truth 在多个核心上下文重复拥有。BC05 的 link 与 BC07 的 projection 都只引用 source fact,不复制或改写其决定内容。

### 12.2 核心 / 支撑 / 投影分类审计

| 审计问题 | 结论 |
|---|---|
| BC01~05 是否确实是 C1~C4 存在性下限 | 是。缺任一单元都会失去主体、入站、Runtime boundary、出站或可归责追溯。 |
| BC06 是否被误归为核心 | 否。它可按具体 seam 最小化,不产生核心业务决定。 |
| BC07 是否被误归为核心 truth | 否。C5 的可见性由可重建 projection 承接;capability outlet 仍可裁剪。 |
| draft `Member truth core` 是否误作上下文 | 否。truth / invariant 是 BC01~05 共用架构原则,后续由层次 / transaction boundary 承接。 |
| draft `Safe material and maintenance` 是否误作上下文 | 否。材料形成归 BC05,read rebuild / reconciliation 归 BC07,维护触发不构成业务上下文。 |

### 12.3 统一语言冲突审计

| 易冲突术语 | 正式区分 | 结果 |
|---|---|---|
| Execution Subject / Identity Anchor | ProjectMemberRef 主语 vs GlobalMemberRef 身份锚 | pass |
| Presence / Process liveness / Host health | member 本地在场 vs 进程状态 vs host 判定 | pass |
| Screening / Policy Decision / Runtime Acceptance | member 四态 vs Governance truth vs Runtime result | pass |
| Delivery Decision / Entry Submission / Acceptance | member 决定 vs 本地 attempt vs Runtime truth | pass |
| Committed Material Reception / Outbound Decision | 来源受理 vs member 出站决定 | pass |
| Publication Attempt / Delivery / Observed / Accepted | member local fact vs Bus / backend / downstream truth | pass |
| Interaction Trace / Complete Log / Evidence | body-free link vs 正文日志 vs verdict source | pass |
| Resolution State / Authorization / Health / Capability Availability | mirror 消费状态 vs 外部业务结论 | pass |
| Member Summary / Presence Truth | projection vs core fact | pass |
| Capability Outlet / Registry / Invocation Permission | safe view vs definition truth vs authorization | pass |

### 12.4 本地投影 / mirror / forbidden-body 审计

| 风险 | 防线 | 结果 |
|---|---|---|
| External snapshot 反写来源 | BC06 只拥有 resolution / freshness / gap | pass |
| Read Model 反写核心 | BC07 只消费 committed source ref,query / rebuild / reconciliation 无写权 | pass |
| 入站正文跨上下文传播 | BC02 只在 transient inspection window 读取,BC03 只收 controlled context | pass |
| Runtime / tool / conversation body 入仓 | BC03 / 04 / 06 / 07 均只收 ref / safe material | pass |
| Trace 演变为完整日志 | BC05 只存 body-free link / gap / low-sensitive material | pass |
| Capability outlet 变第二 registry | BC07 只投影 ref + freshness,禁止 definition body / authorization | pass |

### 12.5 Pending / blocker 保留审计

| Blocker | 受影响上下文 | 当前上限 | 结果 |
|---|---|---|---|
| L2M-UP-001 / 006 | BC01 / BC06 | owner 分层、ref / gap、fail closed;无字段 / credential 形态 | pass |
| L2M-UP-003 | BC03 / BC06 | transport-neutral EntryAuthority seam;mapping blocked | pass |
| L2M-UP-004 / 005 | BC04 / BC05 / BC06 | body-free material、attempt / gap;无 event family / route | pass |
| L2M-UP-007 | BC02 / BC06 | 规则 result / snapshot、四态、保守处置;无 taxonomy 细节 | pass |
| L2M-UP-008 | BC01 | project-scoped only;非项目型 fail closed | pass |
| L2M-UP-002 | 无运行核心上下文 | build supply only;不进入 BC01~07 运行 truth | pass |

### 12.6 Draft / 旧 B1~B6 差异审计

| historical / draft 候选 | 当前归属 | 处置 |
|---|---|---|
| B1 Identity | BC01 消费双锚 + BC06 ref resolution | Identity truth / launch token 形态不继承。 |
| B2 Subscriber | BC02 subscription / screening | Bus delivery / route 不继承。 |
| B3 Publisher | BC04 outbound / publication attempt | CloudEvent member family / delivered 不继承。 |
| B4 External RPC | BC01 host collaboration + BC06 external ref | RPC / server / port 不继承。 |
| B5 Attention | BC02 screening | 模块名、算法、priority model 不继承。 |
| B6 IPC Bridge | BC03 Runtime Mediation | UDS / gRPC / proto / reconnect 不继承。 |
| draft Member truth core | BC01~05 共同 invariant | 不设独立上下文。 |
| draft summary / outlet | BC07 | 确认为 projection,能力出口可裁剪。 |
| draft mirror support | BC06 | 确认为 supporting subdomain。 |
| draft safe material / maintenance | BC05 + BC07 | 按 truth / projection 拆分,不预设模块。 |

## 13. 上下文总表

| ID | 上下文 | 分类 | Owns | Does not own | 主要关系 |
|---|---|---|---|---|---|
| BC01 | Presence and Host Collaboration | core | subject acceptance、presence、host local attempt | Work / Identity / host truth | source for BC02~05 / BC07;uses BC06 |
| BC02 | Inbound Boundary | core | subscription / screening / disposition | Bus / Policy / Runtime truth、body | feeds BC03 / BC05 / BC07;uses BC01 / BC06 |
| BC03 | Runtime Mediation | core | delivery / submission / reception local fact | Runtime run / acceptance / outcome / transport | bridges BC02 -> BC04;feeds BC05 / BC07;uses BC06 |
| BC04 | Outbound Boundary | core | outbound decision / material gate / publication attempt | delivery / downstream / observed truth | feeds BC05 / BC07;uses BC01 / BC03 / BC06 |
| BC05 | Interaction Trace | core | trace link / gap / observation material / attempt | source truth / logs / evidence / observed | consumes BC01~04 / BC06;feeds BC07 |
| BC06 | External Context Mirror | supporting | resolution / freshness / mirror gap | any external truth / registry / body | supports BC01~05 / BC07 |
| BC07 | Member Read Model | local projection | summary / outlet / diagnostics / explanation / freshness | any core or external truth | consumes BC01~06;read-only output |

## 14. 结构化中间产物与回填草稿

- 正式上下文: `BC-L2M-01~07`。
- 核心子域: BC01~05;支撑子域: BC06;本地投影: BC07。
- shared truth / invariant 原则不是独立上下文;adapter / job / repository / process 不是上下文。
- 七个单元停审均 pass;跨职责、truth、语言、投影 / body、pending 和历史污染审计均 pass。

正式 §6 回填上下文总表、关系图、统一语言冲突区分和本地 shadow boundary。单元过程停审与 historical 差异保留在本文件;正式正文不写对象字段、模块目录、协议或部署。

## 15. Step 5 总门禁

| 检查项 | 结果 |
|---|---|
| 是否逐上下文收敛作用、职责、非职责、统一语言和 shadow boundary | pass;7 / 7 |
| 每个上下文是否独立停审 | pass;7 / 7 |
| 是否完成跨上下文职责重叠审计 | pass;无重叠 truth |
| 是否完成核心 / 支撑 / 投影误归类审计 | pass |
| 是否完成投影反写 / forbidden-body 审计 | pass |
| 是否完成统一语言冲突审计 | pass |
| pending 是否保持 blocker / gap | pass |
| 是否误写字段、数据库、代码目录、协议、容器或实现组件 | pass:未误写 |
| Step 5 总门禁 | `pass` |

下一允许动作仅为创建 `01_arch_step_06_container_deployment.md`;正式 `01` 仍禁止修改。
