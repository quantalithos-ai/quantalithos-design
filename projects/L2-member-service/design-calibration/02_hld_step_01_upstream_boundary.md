# 02 概要校准 Step 1：确认上游输入边界

> 状态：completed / pass
> 日期：2026-08-23
> 前序门禁：正式 `01-架构设计.md` 已停审并获用户批准
> 本步目的：确认哪些正式需求、架构和上游边界足以支撑概要骨架展开，哪些关系仍必须停在 pending / blocked ceiling

## 1. Step 内计划

- [x] 读取项目执行台账、02 flow、概要设计 SOP 与概要设计书写规范。
- [x] 刷新正式 00 / 01 的范围、架构单元、依赖、数据、交互、风险和追溯结论。
- [x] 刷新 Runtime、Tools、Identity、Work、Sandbox、Core、Bus、SDK 的当前正式对象 / 接口边界。
- [x] 核对 Member / Member Images 当前正式状态与 WIP 效力，禁止单方采信未停审合同。
- [x] 读取 Governance / Artifact 正式 02，只参考输出粒度。
- [x] 诊断旧正式 02、README 与 draft 的可用线索和污染项。
- [x] 回答 SOP 五个输入边界问题并形成效力表、positive ceiling 和回填草稿。
- [x] 完成 Gate 自检，更新 flow 与项目台账；通过前未创建 Step 2。

## 2. 本步输入与效力

| 输入 | 当前效力 | 可承接内容 | 禁止承接 |
|---|---|---|---|
| 当前正式 `00-需求文档.md` | direct baseline | 项目型范围、C-MS-1~5、FR / BR / D / IB / NFR / AC / VF、四语义层和 owner 边界 | 不在 02 重写需求、不把 AC 当测试已执行 |
| 当前正式 `01-架构设计.md` | direct baseline / approved HLD input | 独立 Host Truth Center、A1~A5、S1~S3、P1~P3、依赖方向、数据和一致性取舍 | 不重新划分 owner、上下文或技术取舍 |
| `L2-runtime/00~07` | stable upstream | Runtime run / goal-plan / memory / action / checkpoint / outcome truth；host lifecycle 排除；entry / handoff 开放边界 | 不把 Runtime 的对象、命令或状态复制成本仓 truth；不伪造 entry contract |
| `L2-tools/00~07` | stable boundary upstream | 工具合同、调用、逐动作执行、normalized outcome 与 Runtime action seam 的 owner 边界 | 不建立 ToolInvocation、capability registry 或直接 Sandbox execute 主线 |
| `L1-identity/00~07` | stable truth owner | `GlobalMemberRef` 身份锚、生命周期 / 可运行性安全读取类别 | 不复制 GlobalMember、Role / Capability 正文、credential truth 或状态机 |
| `L1-work/00~07` | stable truth owner | `ProjectMember` 是项目内承担 truth；`ProjectMemberRef` 是本版执行主语 | 不修改分配 / 回收 / responsibility truth，不以 `GlobalMemberRef` 代替执行主语 |
| `L4-sandbox/00~07` | stable isolation owner | Sandbox 统一受控隔离、bind / execute / release 能力边界；宿主装配 truth 归本仓 | 不取得 isolation、policy enforcement、capture、cleanup 或 backend truth |
| `L0-core/00~07` | stable contract authority | shared ID / ref / actor / metadata / error / trace / envelope 类别 | member-service-specific 准确 schema 未闭口，不建本地 shadow |
| `L0-bus/00~07` | stable event carrier | 已提交材料传播、delivery / feedback / retry 分层和 at-least-once 语义边界 | 不取得 Bus delivery truth，不以 publish attempt 冒充 delivered |
| `L0-sdk/00~07` | stable downstream SDK boundary | 正式 API / fake / fixture 的客户端消费模式；全局矩阵中的受限 compile / 自测试背景 | exact target 未闭口；SDK 不进入 Host Truth 运行主链 |
| `L2-member/01-架构设计.md` | sibling formal 01 only | Member 拥有本地 request / signal / report / attempt；宿主 acceptance / registry / session / health 外置 | 其 02 Step 3 为 WIP；字段、IPC、credential 与联调不得采信 |
| `L2-member-images/01-架构设计.md` | sibling formal 01 only | Images 拥有 image definition / candidate / eligibility / availability；向本仓提供 pinned entry 或 gap | 其 02 仍停在 Step 1；release shape、manifest、compatibility、confirmation 不得采信 |
| `L1-governance/02`、`L1-artifact/02` | granularity reference | 业务组成部分与实现分层双轴、对象 / 接口 / 流程 / 状态概要粒度 | 不复制其领域主语、接口、状态或依赖 |
| `draft/README.md`、`draft/01~04` | reviewed discussion input | 用途、交互、能力和分层候选；旧污染线索 | 不提供正式对象、接口、状态或 ready 结论 |
| 旧 README、旧正式 `02/03/05/06` | historical_material | 差异与污染审计 | 不直接继承名称、产品、协议、状态、指标、证据或实现事实 |

效力裁剪结论：兄弟项目正在编写的概要内容不是本项目 truth；即使双方采用相近候选名，也必须等双侧正式文档停审并完成合同闭口后，才能解除对应 blocker。

## 3. SOP 五个问题回答

### 3.1 当前概要设计要承接哪些需求结论

1. 本仓只支持 `ProjectMemberRef` 执行主语，并以一致的 `GlobalMemberRef` 为身份锚；非项目型入口 fail closed。
2. C-MS-1~5 形成唯一核心闭环：意图与主语、装配与就绪、注册与 Host Session、健康与恢复、收束与事实交接。
3. control plane、Host Truth、Runtime Session、execution handoff 是四层不同语义；宿主事实不能被 run、signal、backend status 或 observed state 替代。
4. 本仓拥有意图 / 决定、宿主实例 / 世代、装配分项 / readiness、registration acceptance / endpoint / Host Session、宿主健康 / 处置、local cleanup / gap / residual / reconciliation 和 body-free handoff 的本地事实。
5. 外部 truth 只以 typed ref、safe snapshot、freshness、redacted marker 或 body-free material 进入；secret 与外部正文禁止入仓。
6. required qualification 缺失、陈旧、冲突、未知或合同未闭口时必须 fail closed；partial 不得升级为 ready。
7. 本地事实提交与外部副作用、传播、观测和接受分层；外部失败不回滚已提交 Host Truth。

### 3.2 当前概要设计要承接哪些架构结论

1. 一个独立 Host Truth Center 承载 A1~A5；五个核心语义不是五个仓、五个服务或一个被压平的总状态机。
2. S1 外部资格承接、S2 宿主承载与隔离交接、S3 事实交接与只读消费只支撑核心，不生成第二份 Host Truth。
3. P1 外部资格影子、P2 外部运行关联影子、P3 安全消费投影只保存 ref / snapshot / projection；均不得反写 A1~A5。
4. 外部边界、application orchestration、domain、ports、technical adapters、persistence / projection / outbox 的依赖必须向内；非 Core / 受限 SDK 的协作不转为源码依赖。
5. 同步权威受理、后台生命周期推进、异步信号 / 反馈 / 维护是三种逻辑运行角色，可同部署但不能混写完成语义。
6. 本仓内关键事实采用强一致提交；跨 owner 协作采用 local-first + eventual consistency，以 attempt / gap / residual / reconciliation 收敛。
7. 宿主实例使用不可变 generation、single-active fence、稳定 correlation 和迟到结果不覆盖机制。
8. safe projection 可迟滞、可重建；handoff 必须 body-free，并区分 local attempt、delivered、observed、accepted。

### 3.3 哪些结论已经足够稳定

| 稳定主题 | 足以支持的概要展开 |
|---|---|
| 仓定位与五节点核心闭环 | 主要组成部分和处理流族可以收稳 |
| A1~A5 / S1~S3 / P1~P3 语义分工 | 可映射业务代码主体、关键对象候选和状态族 |
| 双锚、typed ref、safe snapshot、freshness | 可定义本地资格对象轮廓与 fail-closed flow |
| Host Truth owner 与数据四分类 | 可定义本地 aggregate / record / projection / reference 边界 |
| immutable generation / single-active / local-first | 可定义状态传播、异常和详细设计承接要求 |
| compile / runtime / event / ref / adapter / fake 分类 | 可定义 port 和 adapter 骨架，不需要产品选型 |
| Member / Images 正式 01 的 owner 方向 | 可点名 host-side placeholder port 和 blocked positive path |
| Runtime / Tools / Sandbox 的正式排除边界 | 可防止概要对象、接口和流程越界 |

### 3.4 哪些相关结论仍未收稳

| ID | 未收稳内容 | 受影响概要面 | 当前上限 |
|---|---|---|---|
| `MSVC-UP-001` | Runtime entry、Host Session、触发、handoff 的双侧 contract | session 对象、Runtime port、注册后正向流程 | host-side placeholder；positive blocked |
| `MSVC-UP-002` | Member launch / register / heartbeat / status 字段、IPC、credential context、迟到 / replay | Member port、registration / health flow | owner split 成立；详细合同 waiting |
| `MSVC-UP-003` | Images release shape、pinned ref / manifest、compatibility、handoff / confirmation | qualification、assembly、image resolver port | pinned supply direction only；不可验证即 blocked |
| `MSVC-UP-004` | SandboxBinding bind / release / cleanup 字段、caller、receipt、failure | host binding、closure、reconciliation | host-side association only；no fallback |
| `MSVC-UP-005` | policy 到宿主传递 owner 和当前 FR | 范围、对象、接口、配置 | 完全不进入本轮；纳入须重开 00 |
| `MSVC-UP-006` | launch credential 签发 / 撤销 / qualification owner 与 safe ref | assembly、registration、安全异常 | instance-bound / revocable 语义；secret 外置 |
| `MSVC-UP-007` | Core member-service ID / ref / event family / envelope 准确 schema | 所有 public skeleton 与 event | 只引用类别；schema blocked |
| `MSVC-UP-008` | SDK exact compile target 与 Server 自测试方式 | code framework、03 / 05 / 07 承接 | 受限 boundary / fake seam；不声明 compile pass |

### 3.5 哪些边界直接决定当前不展开到哪里

- 不展开完整 DTO、协议、RPC / HTTP path、event topic、schema、DDL、代码目录、产品配置或函数实现。
- 不定义 Runtime entry、Member IPC、Images manifest、Sandbox receipt、credential 或 Core schema 的对端字段。
- 不创建 LLM loop、goal / plan、memory / checkpoint、ToolInvocation、capability registry、member body、image body、sandbox execution、governance、observability 或 L1 truth 对象。
- 不把 container / orchestration / registry observed state 当作 Host Truth，也不锁定 Docker、Kubernetes、RPC、消息、数据库或 SDK 产品。
- 不写性能、健康窗口、retry、capacity 或 retention 数字；这些缺 workload、环境和 measurement authority。
- 不声明实现、集成、测试、evidence、verdict、signoff 或 readiness。

## 4. 上游关系映射

| 来源文档 / owner | 已成立输入 | 02 继续展开 | 失效 / pending 处置 |
|---|---|---|---|
| 本仓正式 00 | C-MS-1~5、数据与接口能力边界、AC / VF | 组成部分、对象、接口、流程、状态和异常骨架 | 不把需求验收项写成已验证 |
| 本仓正式 01 | Host Truth Center、A / S / P、Ports and Adapters、三运行角色 | 代码主体映射与跨部分协作 | 不重开 owner / 子域 / 架构取舍 |
| Identity | GlobalMember 身份锚与安全生命周期来源 | identity qualification ref / snapshot | unresolved / stale / conflict -> fail closed |
| Work | ProjectMember 承担事实与项目边界 | execution subject qualification / intent source ref | 非 Active / 不可验证 / scope conflict -> reject / wait |
| Member Images | eligible / available pinned entry 或 gap | image supply qualification 与 assembly reference | exact contract pending；gap / unverifiable -> launch blocked |
| Member | request / signal / report / local attempt owner | registration / heartbeat intake placeholder | exact contract waiting；不能声明 registration ready |
| Runtime | run / action / checkpoint / outcome owner | Host Session association / entry-handoff placeholder | exact entry blocked；不创建或推进 run |
| Tools | tool contract / invocation / execution / outcome owner | 仅作为禁止越界与 Runtime handoff 背景 | 本仓无直接执行接口或源码依赖 |
| Sandbox | execution isolation truth 与正式能力边界 | host-level binding / release association port placeholder | exact contract pending；required binding 无 fallback |
| Core | shared contract authority | typed ID / ref / metadata / error / trace / envelope 类别 | specific schema pending；不建 shadow |
| Bus | event delivery carrier | committed host material publication port / feedback consumer | delivery gap 显式，不宣称 delivered |
| SDK | downstream client / fake / fixture boundary | 受限 compile / self-test 承接项 | exact target pending，fake 不证明 integration |
| host carrier / registry | 物理承载与 pinned 资产获取 | product-neutral adapter port 与 conservative outcome | unavailable / timeout / unknown -> blocked / degraded / reconcile |

## 5. Positive ceiling

概要设计可以收稳完整的本地结构与失败路径，但不能把未闭口对端写成可用正向合同。

| 路径阶段 | 本轮可以明确 | 本轮不能声明 |
|---|---|---|
| intent acceptance | 双锚、source、scope、idempotency / correlation、accepted / rejected / waiting / conflict / no-action 语义 | Work / Identity exact resolver 或 authorization contract ready |
| qualification / assembly | required source、supply、credential、binding、carrier 分项资格与共同 readiness guard | Images / credential / Sandbox / carrier 已集成或 host ready |
| instance progression | generation、single-active、local attempt、unknown fence、adapter-neutral outcome | 容器平台、registry、launch protocol 已选择或成功 |
| registration / session | acceptance、endpoint / Host Session 唯一关联、replacement / invalidation 骨架 | Member IPC、credential verification、Runtime entry 可用 |
| health / recovery | host / session / backend / unknown 分层，recover / restart / terminate / hold 决定 | heartbeat 数字、Runtime checkpoint 恢复或 backend truth |
| closure / reconciliation | local cleanup / release attempt、gap、residual、orphan / drift 与处置 | external cleanup / release completed |
| material / projection | body-free material、local handoff attempt / gap、safe view freshness | delivered / observed / accepted 或验收通过 |

## 6. Historical material 与 draft 诊断

| 旧内容 | 诊断 | 本轮处置 |
|---|---|---|
| `RuntimeAction`、runtime dispatch 由本仓实际执行 | 吞并 Runtime / Tools action truth | 删除；只保留 Host Session / execution handoff placeholder |
| capability / tool scope mount 由本仓拥有 | 吞并 capability / tool contract truth | 删除；只允许外部资格 ref / safe snapshot，不建立 mount truth |
| worker / execution handle / action result 为本仓主真相 | 把宿主与动作执行压平 | 删除；本仓只拥有 host-side association、local attempt 和健康 / 反馈材料 |
| sandbox execute 由本仓路由 | 违反 Tools -> Runtime -> Sandbox 正式边界 | 删除；只保留 host-level binding / release association |
| identity capability snapshot 直接定义宿主能力 | 来源与本地资格混写 | 改为 typed ref + safe snapshot + freshness + qualification |
| Runtime feedback 是执行结果正文 | 外部 outcome 被复制 | 改为 body-free ref / safe material 和 local / external outcome 分层 |
| 固定 Docker / Kubernetes、gRPC / HTTP、Redis / PostgreSQL 等 | 无当前 product authority | 全部后移 adapter / 03~04 / 07，并保持未选择 |
| 固定 SLA、heartbeat、retry、retention 数字 | 无 workload / measurement authority | 不继承；仅保留配置影响维度 |
| 旧 README 的 Role -> image 解析 | 绕过 Member Images owner | 删除直接边，只消费 pinned supply |
| draft 的九个模块候选 | 方向可用但早于正式 A / S / P 架构 | Step 4~5 重新映射和冻结，不直接继承名称 |

## 7. 改动前后对比与设计取舍

| 维度 | 旧材料倾向 | 本轮输入边界 |
|---|---|---|
| 核心主语 | action execution host | ProjectMember-scoped Host Truth Center |
| 业务闭环 | dispatch -> execute -> feedback | intent -> qualification -> host generation -> registration/session -> health/recovery -> closure/handoff |
| 跨仓模型 | 复制 Runtime / Tools / Identity / Sandbox 名词 | typed ref / safe snapshot / port / body-free material |
| 状态表达 | 单一 host / action 状态 | A1~A5 并行语义 + 外部资格 / 关联 / 投影状态 |
| 外部结果 | callback / receipt 即完成 | local fact / attempt / gap / delivered / observed / accepted 分层 |
| 技术选择 | 预设容器、RPC、存储和数字 | product-neutral；只固定依赖类型与语义门禁 |

取舍：采用“稳定本地语义 + 显式对端 placeholder”的概要骨架。这样能让 03 继续落码，同时不会把 sibling WIP 或不存在的协议伪装成 ready；代价是正向路径在合同闭口前持续 blocked / waiting。

## 8. 本文不再回答 / 必须回答

本文不再回答：

- 为什么本仓独立存在、支持何种执行主语、Host Truth 归谁。
- A1~A5、S1~S3、P1~P3 是否成立，以及 compile / runtime / event / ref / adapter / fake 如何分类。
- Runtime、Member、Images、Tools、Sandbox、Governance、Observability 与 L1 truth 是否归本仓。
- local-first、generation fence、single-active、safe projection 和 outcome layering 是否采用。
- 产品、协议、数据库、部署拓扑、性能数字是否已选；答案仍为未选择 / authority pending。

本文必须回答：

- 架构语义如何映射为代码主体框架与实现分层。
- 哪些业务主要组成部分承担 C-MS-1~5，彼此如何协作且不越界。
- 哪些关键对象、概要字段类型和函数参数类型足以交给详细设计。
- Command、Query、Inbound Event、Outbound Event、Job 和 Port 如何分组、归属和 fail closed。
- 关键写路径、读取路径、反馈消费、后台推进、对账与发布路径如何连接对象和状态。
- 各状态主语、允许 / 禁止迁移、generation / freshness / outcome 传播如何表达。
- 异常、配置影响、详细设计回退点、风险和 blocker 如何保持显式。

## 9. 正式第 1 章回填草稿

```md
## 1. 与上游文档的关系声明

本文承接当前正式 `00-需求文档.md` 与已获批准的 `01-架构设计.md`，把项目型成员宿主控制面和 Host Truth Center 转译为可进入详细设计的代码主体、主要组成部分、关键对象、接口、处理流与状态骨架。本文不重新定义需求、owner、限界上下文或架构取舍。

| 来源 | 已稳定结论 | 本文继续展开 |
|---|---|---|
| 正式 00 | C-MS-1~5、项目型双锚、四语义层、数据 / 接口 / fail-closed 边界 | 代码主体、对象、接口、流程、状态和异常骨架 |
| 正式 01 | 独立 Host Truth Center、A1~A5 / S1~S3 / P1~P3、ports、generation fence、local-first | 业务组成与实现分层映射、状态传播和详细设计承接 |
| 稳定上游 | Runtime / Tools / Sandbox / L1 / Core / Bus / SDK 的正式 owner 与 seam 类别 | typed ref、safe snapshot、port、adapter 和 body-free handoff 边界 |
| 兄弟正式 01 | Member request / signal / report 与 Images pinned supply 的 owner 方向 | host-side placeholder；exact contract 保持 pending / blocked / waiting |

旧 README、旧正式 02/03/05/06 与 draft 只作 historical material / discussion input。`MSVC-UP-001~008` 不阻塞本地概要结构成立，但阻塞受影响 exact schema、真实集成和正向 readiness；本文不得单方补齐。
```

## 10. 待确认事项

- 无阻塞 Step 2 的上游输入缺口；本地结构可以继续展开。
- `MSVC-UP-001~008` 持续阻塞各自 exact contract 和正向资格，不能在后续 Step 静默关闭。
- sibling 状态变化只触发效力刷新，不自动改变本项目正式结论；若其正式 02 后与本项目主语冲突，须回退对应 Step。

## 11. Gate 自检

| 检查项 | 结果 | 说明 |
|---|---|---|
| 已明确承接哪些需求结论 | pass | C-MS-1~5、双锚、四语义层、数据与接口边界已列明 |
| 已明确承接哪些架构结论 | pass | A / S / P、依赖、数据、一致性和运行角色已列明 |
| stable 与 pending 已分层 | pass | 输入效力表与 `MSVC-UP-001~008` ceiling 完整 |
| 未采用 sibling WIP | pass | Member 02 Step 3、Images 02 Step 1 均未作为 truth |
| 未提前展开对象 / API / 流程 / 状态 | pass | 只点名输入类别与后续问题，不形成 Step 4~9 定稿 |
| 历史污染已识别 | pass | action execution、capability mount、worker、技术产品和数字均排除 |
| 足以进入 Step 2 | pass | 可在不扩大上游效力的前提下收稳设计目标和范围 |

```text
step_01_status = completed
step_01_gate = pass
formal_02_write_allowed = false
next_allowed_step = Step 2 goals_and_scope
```
