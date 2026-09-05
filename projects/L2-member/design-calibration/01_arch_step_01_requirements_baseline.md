# Step 1. 确认需求基线

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 1
> 对应书写规范: `standards/document/架构设计书写规范.md` §4.1
> 回填位置: 正式 `01-架构设计.md` §1、§3、§16
> 日期: 2026-08-22
> 当前状态: `pass`;独立需求基线与后置历史污染审计均完成
> 串行门禁: 本文件 `pass` 前禁止创建 Step 2

## 1. 本步目标与范围

本步把已获用户批准的正式 `00-需求文档.md` 转译为架构可依赖的稳定前提、硬约束和未关闭风险。它不重写需求全文,不确定限界上下文、部署单元、层次、协议、状态机、存储、技术栈或代码结构。

为落实 full-restart,本步先在不读取旧正式 `01` 的条件下形成独立结论,再后置读取旧文档做污染 / 差异审计。旧文档只能证明“过去写过什么”,不能证明“当前架构应当是什么”。

## 2. 输入与效力

| 输入 | 状态 / 效力 | 本步用途 |
|---|---|---|
| `projects/L2-member/00-需求文档.md` | formal 00 complete;用户于 2026-08-22 批准进入 01 | 唯一直接需求基线。 |
| `00_req_step_01~17` | pass / assembly complete | 核对来源分层、ID、边界、数据、依赖、风险和追溯。 |
| 架构 SOP / 书写规范 | normative authority | 控制本步六问、产出与进入下一步条件。 |
| 通则 / 中间产物规范 / 真相源标准 / 全局依赖规则 | normative authority | 控制 full-restart、依赖分类、非伪造和回填门禁。 |
| `L2-runtime/00~07` | stable direct upstream | 锁定 Runtime loop / context / plan / checkpoint / outcome truth、EntryAuthority 和 handoff 边界。 |
| `L2-tools/00~07` | stable upstream | 锁定 canonical invocation、工具执行与 normalized outcome truth。 |
| `L0-core` / `L0-bus` 当前正式链 | stable foundation | 锁定共享契约 authority 与 delivery truth。 |
| `L1-identity` / `L1-work` / `L1-conversation` / `L1-governance` | stable truth owners | 锁定身份锚、项目执行主语、对话 truth、Policy effective / Decision truth。 |
| `L2-member-service` Step 1~16 pass材料 | sibling pending;正式 00 Step 17 未停审 | 只核对 owner 方向一致性;字段 / IPC / 凭据 / 联调不闭口。 |
| `L2-member-images` Step 1~16 pass材料 | sibling pending;正式 00 Step 17 未停审 | 只核对静态镜像资产与 pinned component ref 方向;manifest / compatibility / readiness 不闭口。 |
| `draft/README.md` 与 `draft/01~03` | confirmed discussion input | 作为候选问题与分层线索,不直接升格。 |
| 旧 README、旧正式 `01/02/03/05/06` | historical material | 仅在本步独立结论后用于污染审计。 |

## 3. SOP 六问逐项回答

### 3.1 当前架构设计依赖哪些需求结论

| ID | 已确认需求结论 | 架构约束方向 |
|---|---|---|
| `ARB-L2M-001` | `L2-member` 是 AI Member 容器内成员门面 truth owner。 | 架构必须围绕可归属运行态主体、在场、入站 / 出站决定与交互追溯组织,不能退化为透明桥接。 |
| `ARB-L2M-002` | 当前正向范围只覆盖项目型实例:以 `ProjectMemberRef` 为执行主语并关联 `GlobalMemberRef` 身份锚。 | 主语与身份锚必须分层;非项目型 / personal 在正式第三种主语闭口前 fail closed。 |
| `ARB-L2M-003` | member 拥有本地 presence、启动语境受理、注册请求 / 存活信号 / 状态报告及本地尝试。 | 架构必须保留容器内本地在场语义,但不得吸收宿主 acceptance / registry / session / health。 |
| `ARB-L2M-004` | member 拥有订阅范围决定、四态筛选结论、投递决定与关联。 | 入站筛选必须先于 Runtime 受理,规则 truth 外置,授权正文仅瞬时检查。 |
| `ARB-L2M-005` | Runtime 拥有 run / context / plan / checkpoint / outcome;member 只经 entry / committed safe material seam 协作。 | member 侧投递与承接不能成为第二运行决策链;正式 trigger mapping 未闭口。 |
| `ARB-L2M-006` | member 拥有出站决定、body-free 材料准备与发布 attempt / gap。 | Runtime outcome、member 决定、attempt、Bus delivery、下游 observed / accepted 必须分层。 |
| `ARB-L2M-007` | 本地交互事实必须可关联追溯并能形成低敏安全材料。 | 追溯以本地已提交事实为源,不得保存正文、隐藏推理、secret 或冒充 observability truth。 |
| `ARB-L2M-008` | 成员摘要和能力出口是可重建派生视图;能力出口子项可裁剪。 | 派生视图不得反写真相或复制 ToolDefinition / method body / capability registry。 |
| `ARB-L2M-009` | 只有 `L0-core` 是 compile dependency 候选。 | Runtime、Bus、host、Identity、Work、Governance、Tools、Conversation 等均通过 runtime / event / ref seam 协作,不得进入 sibling package 依赖。 |
| `ARB-L2M-010` | member 不拥有外部 MCP / A2A / API adapter、容器生命周期、镜像、Sandbox、Governance、Conversation 或 observability backend。 | 外部系统不得直穿核心边界;相邻 owner 的 truth 必须留在仓外。 |
| `ARB-L2M-011` | pending seam 只能 fail closed / waiting / blocked / degraded,不能伪装完成。 | 架构可定义负向行为与隔离边界,不得定义无 authority 的字段、route、协议或 readiness。 |
| `ARB-L2M-012` | 核心闭环为 C1 在场、C2 入站、C3 出站、C4 追溯、C5 摘要 / 出口,其中能力出口子项可裁剪。 | 架构必须覆盖 C1~C4 存在性下限,C5 摘要为派生承接;能力出口按来源和阶段显式裁剪。 |

### 3.2 哪些结论已经稳定

| 稳定结论 | 判断依据 |
|---|---|
| 仓定位与 owner | 正式 00 的 G-L2M-001、FR-L2M-001~012、BR / AC / VF 追溯已闭合。 |
| 项目型双锚主语 | ADR-0004、Work / Identity 当前边界与正式 00 一致;正向范围明确。 |
| Runtime / Tools 分界 | 两个已停审上游正式链明确排除 member 交互门面,并保留各自 truth。 |
| host owner 分层方向 | 本仓正式 00 与 member-service 已通过校准材料一致;详细合同仍 pending,但 owner 方向稳定。 |
| Bus / Conversation / Governance / Identity truth 外置 | 各当前正式 owner 文档与正式 00 一致。 |
| forbidden-body 与状态分层 | FR-L2M-005~010、NFR-L2M-006~015、AC-L2M-025 / 029~032、VF-L2M-004 / 005 已锁定。 |
| 依赖类型纪律 | 正式 00 §6 与全局依赖规则一致:只有 Core 是 compile 候选。 |

### 3.3 哪些结论仍待确认

| 开放项 | 状态 | 架构阶段处理上限 |
|---|---|---|
| `L2M-UP-001` host 字段、IPC、凭据与正向联调合同 | sibling formal 00 未停审 | 只锁 owner 和 fail-closed boundary。 |
| `L2M-UP-002` image manifest / version / compatibility / readiness | sibling formal 00 未停审 | 只保留 pinned component ref 消费方向,不进入 member 运行语义。 |
| `L2M-UP-003` member 投递物到 Runtime formal trigger / EntryAuthority mapping | open upstream contract | entry seam 存在;正向 mapping blocked。 |
| `L2M-UP-004` Runtime handoff / event source family 与下游 route | open integration boundary | member 只记录出站决定、attempt / gap。 |
| `L2M-UP-005` member-specific shared schema / event family / route | schema and route pending | 只承接 Core 的共享 envelope / trace authority。 |
| `L2M-UP-006` 启动凭据签发 / 撤销与身份锚合同 | owner contract pending | 凭据不可验证即拒绝入场;不选 token 形态。 |
| `L2M-UP-007` 筛选规则来源矩阵与风险 taxonomy | open upstream contract | 消费正式结果 / safe snapshot;unknown 保守处置。 |
| `L2M-UP-008` 非项目型 / personal 第三种执行主语 | scope pending | 当前正向范围不包含;不得以 GlobalMember 或 Workspace view 替代。 |
| `Q-L2M-006` 能力出口首批范围 | architecture decision pending | 保留为可裁剪派生子项,在 Step 13 定阶段。 |
| `Q-L2M-007` 追溯 / 观测 retention 与 archive | detail / config pending | 架构只锁不可原地改写、body-free 与交接边界。 |
| `Q-L2M-008` 出站是否有治理前置场景 | no current authority | 当前不建立该主路径;有正式需求时回开。 |

这些事项不阻塞架构确定 owner、上下文、依赖方向、数据分类、通信类别和 fail-closed 语义;它们阻塞对应正向 schema、配置激活、集成测试证据和 readiness。

### 3.4 哪些需求直接影响架构边界

| 需求 | 必须分开的架构边界 |
|---|---|
| 可归属项目型运行主体 | Member presence 与 Work / Identity truth、host lifecycle 分开。 |
| 入站受控投递 | Bus delivery、member screening / delivery decision、Runtime acceptance 分开。 |
| 出站安全发布 | Runtime committed outcome、member outbound decision、Bus delivery、Conversation append、observed / accepted 分开。 |
| 工具能力出口 | member derived outlet 与 Tools invocation / definition / outcome、capability registry 分开。 |
| 追溯材料 | member interaction trace 与完整正文日志、evidence、observability backend 分开。 |
| 容器承载 | member 进程内语义与 member-service 容器编排、member-images 构建 / 供给、Sandbox 隔离分开。 |

### 3.5 哪些需求直接影响数据所有权

| 数据类别 | 架构含义 |
|---|---|
| member truth | presence、启动受理、订阅 / 筛选 / 投递 / 出站决定、host 本地尝试、publication attempt / gap、交互追溯。 |
| external snapshot / projection | policy effective、Runtime safe view、delivery feedback、host acceptance / session 摘要;必须带来源 / freshness / scope,不得反写。 |
| external reference | ProjectMemberRef、GlobalMemberRef、Runtime outcome / entry result ref、tool / method definition ref、Bus / downstream feedback ref。 |
| member derived view | 成员摘要、能力出口、诊断 / 配置解释视图;可延迟、可重建、不成为写源。 |
| forbidden body | 入站 raw body 持久化副本、运行正文 / hidden reasoning、secret、ToolDefinition / method body、完整日志、对话 / artifact / evidence 正文。 |

### 3.6 哪些需求直接影响依赖方向或一致性策略

| 需求 | 依赖 / 一致性影响 |
|---|---|
| Core 唯一 compile 候选 | 核心语义只能编译依赖共享 primitive / ref / metadata / error authority;其他依赖必须倒置。 |
| member truth 单 owner | 本地决定与同一提交边界内不变量要求强一致;外部反馈不得逆写。 |
| Bus delivery / downstream accepted 外置 | 发布采用本地决定先提交、外部传递最终一致;失败形成 gap,不回滚。 |
| projection / outlet 派生 | 与 source 最终一致;stale / unresolved 显式,重建不改变 truth。 |
| duplicate / late / out-of-order | 幂等识别和追加关联事实;unknown 不盲重放,迟到结果不覆盖新决定。 |
| pending host / runtime / policy seam | unavailable / unknown 时保持 blocked / waiting / degraded,禁止本地猜测成功。 |

## 4. 稳定需求基线

| 基线 ID | 需求来源 | 架构必须承接什么 |
|---|---|---|
| `RB-L2M-001` | G-L2M-001;FR-001~003 | 独立 Member truth core 和项目型 presence / host collaboration boundary。 |
| `RB-L2M-002` | G-L2M-002;FR-004~006 | 订阅、四态筛选、受控投递三个可区分决定,并回链规则与来源。 |
| `RB-L2M-003` | G-L2M-003;FR-007~008 | Runtime committed material 到 member outbound decision / attempt 的分层边界。 |
| `RB-L2M-004` | FR-009~010;NFR-009~015 | body-free、可关联、本地事实优先的追溯与安全材料。 |
| `RB-L2M-005` | G-L2M-005;FR-011~012 | 可重建成员摘要和可裁剪能力出口,禁止反写与正文复制。 |
| `RB-L2M-006` | §6;AC-026;VF-007 | Core 唯一 compile 候选;runtime / event / ref / adapter / fake 分类独立。 |
| `RB-L2M-007` | NG-001~010;AC-022;VF-003 / 006 | Runtime、Tools、host、image、Sandbox、Governance、Conversation、Identity、external adapter truth 均在仓外。 |
| `RB-L2M-008` | NFR-004~016;VF-008 | 依赖缺口可判别,派生可降级,任何 planned / blocked / not_run 不得伪装完成。 |

## 5. 架构硬约束

| 约束 ID | 硬约束 | 主要影响 Step |
|---|---|---|
| `HC-L2M-001` | 项目型实例必须以 ProjectMemberRef 为执行主语并关联 GlobalMemberRef;非项目型主语未闭口即拒绝。 | 3 / 4 / 5 / 8 / 9 |
| `HC-L2M-002` | member 不得拥有 Runtime run / context / plan / checkpoint / outcome 或 Tools invocation / execution / normalized outcome。 | 3 / 5 / 7 / 8 / 9 |
| `HC-L2M-003` | host acceptance / registry / session / health 与容器生命周期不得成为 member truth。 | 3 / 4 / 8 / 9 |
| `HC-L2M-004` | 筛选只消费正式规则结果 / safe snapshot;unknown 保守处置,不得自建 allowlist。 | 5 / 8 / 9 / 12 |
| `HC-L2M-005` | 入站正文只允许正式授权范围内瞬时检查,禁止持久化和透明 raw 转发。 | 5 / 8 / 9 / 12 |
| `HC-L2M-006` | 出站材料必须 body-free;outcome / decision / attempt / delivery / observed / accepted 不得压平或逆写。 | 5 / 8 / 9 / 12 |
| `HC-L2M-007` | 摘要、出口、诊断、配置解释均为派生只读视图,禁止反写与正文复制。 | 5 / 7 / 8 / 12 |
| `HC-L2M-008` | 只有 Core 是 compile dependency 候选;所有 sibling 协作必须经倒置的 runtime / event / ref seam。 | 7 / 10 / 15 |
| `HC-L2M-009` | 不得暴露通用外部监听面或任意直连 provider / MCP / A2A / API;正式 Bus / host / Runtime seam 例外。 | 4 / 6 / 7 / 9 / 12 |
| `HC-L2M-010` | 开放 seam 不得本地 shadow schema、route、凭据或成功态;只能 pending / blocked / waiting / degraded / fail-closed。 | 全部后续 Step |

## 6. 未关闭需求风险

| 风险来源 | 架构影响 | 当前约束 | 是否阻塞 Step 2 |
|---|---|---|---|
| `L2M-UP-001/006` | presence / host boundary 的正向合同和认证入口 | owner 分层可成文,字段与载体不成文 | 否 |
| `L2M-UP-003` | inbound delivery 到 Runtime 的正向可落码 mapping | 只保留 transport-neutral entry seam | 否;阻塞正向协议 / 集成 |
| `L2M-UP-004/005` | outbound / observability event family 和 route | 只保留 body-free material、attempt / gap | 否;阻塞正向 route |
| `L2M-UP-007` | screening taxonomy 与规则来源 | 四态与 fail-closed 可成文,具体矩阵不成文 | 否 |
| `L2M-UP-008` | 非项目型执行主语 | 当前仅 project-scoped,其他拒绝 | 否 |
| C5 能力出口范围 | 首批范围可能扩大依赖面 | 保持可裁剪,不作为 C1~C4 前置 | 否 |
| retention / archive | 数据保留与物理存储未定 | 只锁不可改写、body-free、来源可追溯 | 否;后移 03/04 |

## 7. 当前独立结论与设计取舍

| 方案 | 优点 | 风险 / 代价 | 结论 |
|---|---|---|---|
| 修补旧正式 01 | 写入快 | 历史协议、技术栈和指标易污染当前边界 | 不采用;full-restart。 |
| 先形成需求基线,再读旧 01 做审计 | 结论来源清楚,可证明未继承污染 | 需要后置差异核对 | 采用。 |
| 把全部 pending seam 视为架构不可讨论 | 最保守 | 无法先锁 owner、负向语义与依赖方向 | 不采用;只阻塞正向合同与 readiness。 |
| 在 Step 1 固定上下文 / 六层 / 部署 / IPC | 看似完整 | 越过 Step 5~10,把 draft 候选升格 | 不采用。 |
| 将能力出口设为核心存在性前置 | 出口统一 | Tools / method ref 缺口会拖垮 C1~C4 | 不采用;保留可裁剪派生子项。 |

## 8. 结构化中间产物

- 需求基线: `RB-L2M-001~008`。
- 架构硬约束: `HC-L2M-001~010`。
- 开放上游条件: `L2M-UP-001~008`,全部保持原状态。
- 架构正向范围: project-scoped AI Member;非项目型 / personal fail closed。
- 核心存在性下限: C1~C4;C5 摘要为派生承接,能力出口为可裁剪子项。
- 编译依赖上限: `L0-core` 唯一候选;其余全部不是 package dependency。
- forbidden-body 上限: 授权瞬时检查不等于保存或 raw forwarding;所有持久化、出站、追溯、观测和派生面保持 body-free。

## 9. 回填草稿

正式装配时,§1 应声明正式 00 是直接需求基线,稳定上游只提供 owner / ref / entry / outcome / tool action / delivery 边界,兄弟材料仍为 pending。§3 应回填 `HC-L2M-001~010` 及开放 seam 的 fail-closed 上限。§16 应把 `FR-L2M-001~012`、`NFR-L2M-001~016`、`AC-L2M-001~033` 与 Step 3~15 的架构承接建立追溯,不得在矩阵中新增方案。

## 10. 旧正式 01 / README 历史污染审计

本节仅在 `RB-L2M-001~008` 与 `HC-L2M-001~010` 独立形成后读取旧正式 `01-架构设计.md` 和旧 README。审计只判断旧结论是否有当前 authority,不以旧文档反推新架构。

| 旧口径 | 当前 authority 核对 | 处置 |
|---|---|---|
| “member 是容器内门面,与 Runtime 分离” | 正式 00 与 Runtime 正式链支持 owner 分离 | 保留语义方向;不得自动继承固定进程数、载体或管理器。 |
| B1 Identity Card 是核心域,拥有 launch_token + member id + role | Identity / Work truth 外置;凭据 owner 与形态为 L2M-UP-006 | 删除核心域与 token 形态;改为项目型执行主语 + 身份锚 ref 的受理边界。 |
| B2 / B3 直接以 Event IO 管道定义入站 / 出站 | 当前需求要求筛选 / 投递 / 出站决定 / attempt truth,Bus 拥有 delivery | 不继承 B2 / B3 结构;Step 5 重新按 truth 语义划分。 |
| B5 Attention 是单独核心域并固定 Prompt Injection 规则模块 | 当前只锁入站筛选四态、规则回链和授权瞬时检查 | 保留安全筛选目标;模块名、算法、优先级模型和热更新方案不继承。 |
| B6 IPC Bridge = UDS gRPC | Runtime 只提供 transport-neutral entry authority;mapping 仍 pending | 只保留 member 侧 Runtime seam;UDS / gRPC / proto 全部 historical。 |
| B4 External RPC = member-service gRPC server / fixed port | host owner 分层稳定,物理方向、协议和字段未闭口 | 只保留 host collaboration seam;server、gRPC、port 不继承。 |
| Publisher 只发 CloudEvents | Core 拥有 CloudEvents envelope authority,member-specific family / route pending | 只承接共享 envelope 类别;不锁 type / source / subject / payload / route。 |
| README 的 AG-UI 17 事件 | Conversation / product 下游边界无当前 member authority | historical only;不进入架构主链。 |
| Rust 门面进程 | 无当前语言 authority | 不继承;后续即使讨论也需 Step 10 证据。 |
| supervisord 管理双进程 | 容器生命周期归 member-service;进程管理器无当前 authority | 不继承;Step 6 只讨论逻辑运行单元和 ownership。 |
| launch_token = 短时 JWT | L2M-UP-006 未闭口 | 不继承;只锁不可验证时 fail closed。 |
| `<20ms / <50ms / <5ms`、`99.95% / 99.9%` | 正式 00 明确无 workload / measurement authority | historical only;架构只保留可分解判断口径。 |
| inbound / outbound at-least-once | Bus delivery 语义应由 Bus / route 合同给出 | 不继承;member 只锁 duplicate / late 不分叉和外部反馈不逆写。 |
| publish retry / backlog、IPC reconnect / runtime restart | 盲重放被正式需求禁止;Runtime / host lifecycle 不归 member | 不继承具体补偿;后续只从本地事实、幂等和 owner 边界推导。 |
| sandbox policy 作为 member 直接依赖 | Sandbox truth / adapter 在边界外,正式筛选规则来源指向 Governance safe result | 移出当前上下文主链;禁止直依赖。 |
| audit events 由 member 写给 observability | member 只拥有 body-free 安全材料和交接 attempt / gap;observed truth 外置 | 重写为安全材料 handoff boundary。 |
| 旧 17 章 + “上线策略” | 当前架构规范为 18 章结果结构,上线 / 回滚任务不属于架构主链 | Step 16 按现行 18 章重建;不上抄旧章节。 |
| 旧 US-001~004 / F-004~007 追溯 | 已被当前 FR-L2M-001~012 / AC-L2M-001~033 替代 | 旧编号不继承;Step 15 重建当前追溯。 |
| ADR-0006 Memory 持久化归 identity | 与 member 当前架构无直接决定关系 | 不进入 member ADR 索引。 |

### 10.1 可保留但必须重新证明的方向

| 方向 | 当前重新证明来源 | 保留上限 |
|---|---|---|
| member 与 Runtime 职责分开 | ARB-L2M-001 / 005;Runtime 正式边界 | 只保留 owner 与 seam,不锁物理协议。 |
| 入站在 Runtime 前受控筛选 | ARB-L2M-004;FR-L2M-005 / 006 | 只保留授权瞬时检查、四态与 fail-closed。 |
| member 与 Bus / host 协作 | ARB-L2M-003 / 006;DB-L2M-002 / 004 | 只保留 runtime / event boundary,不锁 transport / route。 |
| 不拥有推理、工具执行、容器编排和镜像构建 | NG-L2M-001~005 | 作为职责红线保留。 |

## 11. 改动前后对比

| 维度 | 旧正式 01 | 本轮 Step 1 基线 | 原因 |
|---|---|---|---|
| 主线 | B1~B6 管道 / 模块清单 | member truth、五节点能力和相邻 owner 边界 | 架构先回答 truth 与边界。 |
| 主体 | launch_token + member_id + role 身份卡 | ProjectMemberRef 执行主语 + GlobalMemberRef 身份锚 | 与 Work / Identity / ADR 当前 authority 一致。 |
| Runtime | UDS gRPC Bridge | transport-neutral entry / committed material seam | mapping 尚未闭口。 |
| 出站 | CloudEvent publish 动作 | outcome / decision / attempt / delivery / accepted 分层 | 防止 member 冒充外部成功。 |
| 数据 | IdentityCard、event、heartbeat state 粗粒度 | truth / snapshot / projection / ref / forbidden body 五类 | 保护唯一 owner 与 body-free。 |
| 依赖 | bus / runtime / member-service / sandbox 混列 | Core compile;其余 runtime / event / ref / forbidden adapter 分列 | 符合全局裁剪规则。 |
| 技术 | Rust、UDS gRPC、supervisord、JWT | Step 1 不定技术;全部需后续 authority / 证据 | 防止历史方案伪装约束。 |
| 质量 | 固定 P95 / SLA 与具体脚本 | 可分解、可判别、无来源数字不硬化 | 正式 00 无 measurement authority。 |
| 失败 | retry / reconnect / restart | waiting / blocked / degraded / gap + 不逆写 | 避免盲重放和跨 owner 动作。 |
| 追溯 | 旧 4 条 US | 当前 12 FR、16 NFR、33 AC 进入后续追溯 | 与正式 00 对齐。 |

## 12. 最终门禁自检

| 检查项 | 结果 |
|---|---|
| 六个 SOP 问题是否逐项回答 | pass |
| 是否明确稳定需求、硬约束与未关闭风险 | pass |
| 是否把 pending 脑补为正向合同 | pass:未脑补 |
| 是否下沉上下文、部署、协议、字段、存储或技术栈 | pass:未下沉 |
| 是否读取旧正式 01 后再形成独立基线 | pass:尚未读取旧正式 01 |
| historical pollution audit 是否完成 | pass;旧正式 01 / README 已逐项核对 |
| 是否只保留经当前 authority 重新证明的历史方向 | pass |
| Step 1 总门禁 | `pass` |

Step 1 已明确哪些需求可作为架构前提、哪些风险保持开放,并足以支撑 Step 2。下一允许动作仅为创建 `01_arch_step_02_goals_constraints.md`;正式 `01` 仍禁止修改。
