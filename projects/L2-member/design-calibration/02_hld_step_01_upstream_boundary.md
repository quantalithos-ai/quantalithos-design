# Step 1. 确认上游输入边界

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 1
> 回填章节: `02-概要设计.md` §1 与上游文档的关系声明
> 生成日期: 2026-08-23
> 状态: completed / pass / stop_review
> 正式 02 写入: forbidden until Step 14

## 1. 本步目标与边界

确认当前需求、架构、直接上游和兄弟边界是否足以支撑代码主体、主要组成部分、对象、接口、处理流和状态轮廓展开。本步只判断“可以承接什么、暂不能定什么”,不重新定义需求 / 架构,不提前命名正式对象、API 或状态机。

## 2. 本步输入与效力

| 输入 | 当前状态 | 本步用途 | 效力上限 |
|---|---|---|---|
| `projects/L2-member/00-需求文档.md` | formal 00 complete;用户已批准进入 01 | 提供目标、C1~C5、FR / BR / NFR / AC / VF、数据和接口边界 | 直接需求基线 |
| `projects/L2-member/01-架构设计.md` | formal 01 complete;用户已批准进入 02 | 提供 7 BC、逻辑运行单元、依赖、数据 owner、一致性和交互机制 | 直接架构基线 |
| `L2-runtime/00~07` | 正式链闭合停审;实施未开始 | 提供 Runtime entry、run / context / plan / outcome、safe handoff owner 边界 | 可引用逻辑合同;不等于实现 ready |
| `L2-tools/00~07` | 正式链闭合停审;实施未开始 | 提供 Tool contract / definition / binding / action / outcome 与 safe view 边界 | 只用于 ref-derived outlet;不等于可调用集成 |
| `L0-core` 当前正式链 | current formal authority | 共享 ID / ref / actor / metadata / error、envelope / trace authority | 唯一 compile 候选;member-specific schema 仍 pending |
| `L0-bus` 当前正式链 | current formal authority | 发布 / delivery / feedback / replay owner 与 event seam | 只承接 event collaboration;不取得 delivery truth |
| `L0-sdk` 当前正式链 | current downstream boundary | 未来下游封装和 fake / consumer 边界 | 不形成 member 反向 package dependency |
| `L1-work`、`L1-identity` 当前正式链 | current formal truth input | ProjectMember 执行主语、GlobalMember 身份锚 | 只持 typed ref / safe view;不持 lifecycle truth |
| `L1-governance` 当前正式链 | current formal truth input + granularity reference | Policy effective / Decision owner;概要分层粒度 | 只消费正式结果 / snapshot;不复制 policy |
| `L1-conversation` 当前正式链 | current formal truth boundary | 对话事实 / 正文 owner 和安全消费边界 | 只交 body-free material;不直写 conversation |
| `L1-artifact` 当前正式链 | truth boundary + granularity reference | 正文 / evidence 外置边界、对象正式化粒度 | 只引用;不把 body / evidence 写入 member |
| `L2-member-service` 正式 00 / 当前 01 / 台账 | formal 00 stable;formal 01 stop_review pending sibling approval | 核验 host lifecycle、registry、session、health 与 member local attempt 分界 | 只读漂移审计;exact contract 不得升格 |
| `L2-member-images` 正式 00 / 01 / 台账 | formal 01 已获 sibling 用户批准进入 02 | 核验 image supply / pinned entry 外置边界 | 可引用架构 owner;exact release / compatibility / confirmation 仍 pending |
| `draft/01~03` | confirmed discussion input | 检查项目作用、功能、分层候选是否与正式 00/01 一致 | 非正式候选,每个 Step 重新推导 |
| 旧 `README.md`、旧正式 `02/03/05/06` | historical_material | 污染 / 差异审计 | 零继承权 |

## 3. SOP 问题回答

### 3.1 当前概要设计要承接哪些需求结论

- 仓定位:member 只拥有 AI Member 容器内、可归属到运行态成员实例的本地在场与对外交互边界事实。
- 核心闭环:在场与宿主协作、入站订阅 / 筛选 / 受控投递、Runtime committed material 的出站承接 / 安全发布、交互追溯、成员摘要与可裁剪能力出口。
- 主体边界:当前正向范围只支持 `ProjectMemberRef` 执行主语并关联 `GlobalMemberRef` 身份锚;非项目型主语未定义时 fail closed。
- 入站边界:允许经正式授权做瞬时必要检查,但正文不持久化、不透明转发;screening 是 member 预筛事实,不是 Governance policy truth。
- 出站边界:`RuntimeOutcome -> member outbound decision -> publication attempt -> Bus delivery -> downstream accepted / observed` 各层不得压平。
- 派生边界:summary / outlet 只从本地 committed facts 与正式 ref / safe view 派生,可重建、不反写、不成为 registry 或 authorization。
- 依赖边界:只有 Core 是 compile 候选;Runtime、Bus、host、truth owner、downstream 都是 runtime / event / ref seam。
- 失败边界:invalid / stale / conflict / missing / unknown / duplicate / late / gap 必须显式;开放 seam 只能 blocked / waiting / degraded / fail-closed。

### 3.2 当前概要设计要承接哪些架构结论

- 七个已冻结限界上下文:`BC-L2M-01~07`;`Member truth core` 是共同 invariant,不是额外上下文。
- 五个实现责任层:Member Core Semantics、Use-case Coordination、External Boundary Seams、Derived Consumption、Technical Carriers。
- 八类逻辑承载责任:host / presence entry、inbound fact consumption、interaction truth carrier、Runtime mediation、safe handoff、projection / maintenance、read boundary、state storage responsibility。
- 数据分类:member truth、member support truth、member projection、external truth、forbidden body。
- 一致性:local truth first、append / supersede history、source-correlated eventual feedback、idempotent classification、unknown-side-effect fence。
- 交互类别:需要即时 admission 的同步 seam、传播 committed fact / feedback 的异步 seam、基于 committed fact 的后台 continuation。
- 技术机制:inward dependency inversion、Core-authoritative contracts、anti-corruption mirror、source-anchored decisions、body-free material gate、projection isolation。
- 明确未锁定:语言、framework、DB、queue、transport、IPC 方向 / 载体、进程数、credential shape、member-specific schema / route、固定 SLA / retry / heartbeat 数字。

### 3.3 哪些结论足够稳定,可直接作为概要输入

| 稳定输入 | 可下沉方向 | 不得推导 |
|---|---|---|
| 7 BC 与 owner / non-owner | 映射业务主要组成部分和代码主体骨架 | 不直接复制为目录 / crate / process |
| C1~C5、FR-001~012、IB-001~015 | 推导 capability、正式接口分类和关键流程 | 不照抄需求功能表作为概要结构 |
| member local truth / support truth / projection 分类 | 发现对象候选、状态 owner、读写边界 | 不推定 aggregate、表或事务边界 |
| Runtime formal objects / APIs | 定义 member 侧 port 和 local correlation 骨架 | 不复制 Runtime object,不声明 exact DTO mapping |
| Tools formal contract / binding safe views | 定义可裁剪 capability outlet 来源 | 不复制 definition / binding truth,不直连 invocation |
| Bus delivery owner 与 Core shared authority | 定义 event adapter / port 责任和 delivery feedback ref | 不私造 event family、topic、schema 或 delivery 成功 |
| project subject + identity anchor | 定义 local subject acceptance 骨架 | 不拥有 ProjectMember / GlobalMember lifecycle |
| host owner 的需求级分工 | 定义 local registration / liveness / status attempt | 不声明 accepted / registry / session / health |

### 3.4 哪些相关结论仍未收稳,当前不能定稿

| 开放项 | 未收稳内容 | 本概要允许做什么 | 本概要禁止做什么 |
|---|---|---|---|
| `L2M-UP-001` | member-service exact launch / register / heartbeat / status 字段、transport、credential | 点名 host collaboration port、local request / attempt / feedback ref 语义 | 伪造 sibling DTO、方向、accepted 或 health |
| `L2M-UP-002` | pinned member component release shape、compatibility、handoff / confirmation | 保留 build supply / host consumption 外置说明 | 形成 member runtime package 依赖或 image readiness |
| `L2M-UP-003` | member inbound delivery 与 `RuntimeTriggerContext` exact mapping | 点名 local controlled delivery command、Runtime entry port、blocked mapping | 声明 DTO / schema 已绑定或正向联调可执行 |
| `L2M-UP-004` | Runtime handoff / event source family 与 downstream route | 点名 committed-material reception、attempt / gap | 声明 delivered / observed / accepted |
| `L2M-UP-005` | member-specific Core shared types / event family / route | 使用 Core shared type 类别和本地语言中立骨架 | 本地 shadow schema、CloudEvent type / topic 定稿 |
| `L2M-UP-006` | launch credential issue / revoke owner 与 shape | 点名 credential ref verification seam 与 fail-closed | 固定 JWT / token / TTL / secret storage |
| `L2M-UP-007` | screening rule source matrix / taxonomy | 点名 rule snapshot / source resolution 与 four-state outcome | 自建 allowlist、风险枚举或 policy engine |
| `L2M-UP-008` | non-project / personal 第三种执行主语 | 当前项目型 flow 正式化;其他入口 rejected / blocked | 以 GlobalMemberRef、Workspace view 或匿名进程代替 |

### 3.5 哪些边界决定概要设计不该展开到哪里

- 不重写用户故事、需求验收、系统上下文、BC 划分、依赖方向、技术选型和 ADR。
- 不写完整字段全集、Rust / Go / Python 类型、trait / function signature、DTO / schema、HTTP / gRPC / UDS path、topic 或 payload。
- 不写 repository 实现、DDL、索引、事务策略、锁、outbox 物理 carrier、retry / backoff 数值、配置键和部署拓扑。
- 不设计 Runtime loop / context / plan / memory / checkpoint / outcome、Tools execution、capability registry、host lifecycle、image build、Sandbox、Governance、Conversation 或 Observability backend。
- 不把 local attempt / feedback ref / projection state 润色成 external readiness、delivery、observed、accepted、healthy 或 implemented。

## 4. 当前旧正式 02 问题诊断

| 旧内容 | 与当前基线的冲突 | 本轮处置 |
|---|---|---|
| 将仓定义为“AI 成员运行态主体仓” | 当前只拥有 container-local presence 与 interaction boundary truth,不拥有 persona / identity / execution truth | 废弃旧定义;以正式 00/01 定位重建 |
| `MemberRuntimePersona` 作为主体本体 | 把 Identity / Work / Runtime safe view 混成 member truth | 不继承;后续只从正式 capability 发现 local presence / projection 对象 |
| `ExecutionActorBinding` 由 member 持有 | 当前 ProjectMember execution subject 归 Work 语境,Runtime 接受 actor / scope;member 只验证与关联 | 不继承为 truth;保留 typed subject / anchor ref 与 local correlation 线索 |
| capability-hub / Tools 直连主线 | member 不拥有 registry / adapter / invocation,能力出口仅是可裁剪 ref-derived projection | 删除直连;后续仅保留 formal ref / safe view source port |
| conversation sender / visible summary 充当成员本体 | Conversation truth 外置;summary 是可重建 projection | 不继承本体语义;只保留 body-free derived view |
| host / session / execution context 收入 member | host registry / session / health 与 Runtime context 外置 | 只保留 member local request / attempt / ref |
| 旧 `US-*`、`F-*` 与五个旧组成部分 | 与正式 `FR-L2M-*`、7 BC、C1~C5 追溯基线不一致 | 全部作 historical identifier,不得进入新编号 |
| 裸函数链与实现风格 | 越过概要轮廓,且基于错误对象 | 不继承;Step 8 只写带类型参数的关键流程骨架 |
| 固定 `99.9%`、`100ms` / 累积预算 | 无 workload / measurement authority | 删除;只保留可分解、可测维度 |
| 上线、灰度、回滚、监控章节 | 属于 05~07 / 运维边界,不在概要 14 章主链 | 不进入正式 02 |
| 旧 Rust / UDS / gRPC / AG-UI / launch token 假设 | 当前无 authority 或与 transport-neutral / Core authority 冲突 | 仅保留历史污染记录,不形成默认选择 |
| 旧文档无逐章 calibration source | 不满足追溯门禁 | Step 14 每章引用具体 Step 文件 |

## 5. 改动前后对比

| 维度 | historical 02 | 本次 full-restart 方向 |
|---|---|---|
| 核心主语 | persona / interaction endpoint / capability exposure / execution binding | local presence / inbound / Runtime mediation / outbound / trace / mirror / read model |
| 上游真相 | identity / Runtime / Tools / hub 材料被收拢成本仓主体 | 外部 truth 只以 typed ref / safe snapshot / committed material 被消费 |
| 结构轴 | 需求解释 + 架构重复 + 实现调用链 | 代码主体框架 + 主要组成部分 + 对象 / 接口 / flow / state 骨架 |
| 成功语义 | persona / binding / capability 可用被压平 | local decided / attempted 与 accepted / delivered / observed / healthy 分层 |
| 技术假设 | Rust、UDS、协议、SLA 先行 | transport / product neutral;exact contract pending |
| 正式生成 | 在旧章节上增补 | Step 14 删除旧文件后从空 14 章重建 |

## 6. 设计取舍

| 方案 | 收益 | 代价 / 风险 | 结论 |
|---|---|---|---|
| A. 修补旧 02 | 写入量小 | 错误主体、旧编号、直连边和伪量化继续污染 | 不采用 |
| B. 以 7 BC 直接当代码目录 | 名称一致 | 混淆业务组成部分、实现分层和物理组织 | 不采用;Step 4 先映射 |
| C. 以正式 00/01 为基线,开放 seam 保守建模,Step 14 重建 | owner 稳定、可落到对象 / 接口 / 状态,不伪闭口 | 需要完整 14 Step 与跨部分审计 | 采用 |
| D. 等所有 sibling exact contract 后再做 02 | 可减少 pending | 阻塞本地 / negative / blocked-aware 结构设计,且无必要 | 不采用 |

## 7. 结构化中间产物

### 7.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `projects/L2-member/00-需求文档.md` | 定位、C1~C5、FR / BR / NFR / AC / VF、数据与接口边界 | 转译为 capability、关键对象、正式接口、流程、状态和详细设计输入 |
| `projects/L2-member/01-架构设计.md` | 7 BC、责任层、逻辑承载、owner、一致性、交互与技术机制 | 转译为代码主体框架和“业务组成部分 × 实现分层”,不重写架构判断 |
| `projects/L2-runtime/00~07` | Runtime trigger / admission、run / context / plan / outcome、safe handoff owner | 定义 member 侧 Runtime port、提交 / 承接 / correlation 的本地骨架;exact mapping pending |
| `projects/L2-tools/00~07` | Tool contract / definition / binding / outcome 与 safe view | 定义 capability outlet 的正式 ref / safe-view 来源边界;不复制或调用 Tools truth |
| `projects/L0-core` 当前正式链 | shared ID / ref / actor / metadata / error、envelope / trace authority | 使用共享类别;member-specific schema 未闭口时只保留 boundary type slot |
| `projects/L0-bus` 当前正式链 | publication / delivery / feedback owner 与 event collaboration | 定义 inbound consumer / outbound event adapter 骨架;delivery 只按 ref 关联 |
| `projects/L1-work`、`L1-identity` 当前正式链 | ProjectMember execution subject、GlobalMember identity anchor | 定义 local subject acceptance 与 ref resolution,不持有生命周期 |
| `projects/L1-governance` 当前正式链 | Policy effective / Decision truth | 定义 screening rule source snapshot 与 fail-closed resolution,不生成裁决 |
| `projects/L1-conversation`、`L1-artifact` 当前正式链 | conversation / body / artifact / evidence truth 外置 | 限制出站、trace、view 只能 body-free / ref-based |
| `projects/L2-member-service` 正式 00 与当前 01 | host owner 分工与漂移检查 | 定义 local request / signal / report / attempt;exact IPC / credential / feedback pending |
| `projects/L2-member-images` 正式 00 / 01 | build-time supply 与 pinned entry owner 外置 | 仅保留部署来源边界;不进入 runtime 代码主体 |

### 7.2 本文不再回答

- 为什么需要 L2-member、其核心能力和验收红线是什么。
- 七个限界上下文、owner 边界、依赖裁剪、数据分类、一致性和架构机制为何这样选择。
- Runtime、Tools、Bus、Work、Identity、Governance、Conversation、Artifact、member-service、member-images 各自拥有什么 truth。
- 是否采用 merge Runtime / host、transparent pipe、shared DB、generic gateway 等架构替代方案。
- 语言、framework、物理 process / transport、database / queue、部署拓扑、数值 SLA 和实施顺序。

### 7.3 本文必须回答

- 7 BC 如何映射为稳定的业务主要组成部分、代码主体骨架和实现分层。
- 每个主要组成部分需要哪些 capability,它们由哪些关键对象承接。
- 哪些候选是领域 / 记录 / policy / projection / ref 对象,哪些只是 API / port / DTO / field type。
- 本仓 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 与 external / persistence port 骨架。
- 在场、入站筛选、Runtime 投递 / 承接、出站发布、trace / observation、mirror refresh、summary / outlet rebuild 的关键处理流。
- presence、screening、submission / reception、outbound / attempt / gap、resolution / freshness、projection 的状态族和禁止迁移。
- open seam、forbidden body、duplicate / late / unknown、external feedback 和 derived failure 如何影响主线。
- 哪些结构受配置影响、哪些不变量禁止配置化、03 必须继续展开什么。

### 7.4 暂不进入正向定稿的边界

| 边界 | 当前可形成的概要骨架 | 被阻塞的正向结论 |
|---|---|---|
| host collaboration | local request / signal / report / attempt + host port | exact DTO、credential、direction、accepted / health integration |
| Runtime entry / handoff | local command / record + Runtime port + typed mapping slot | exact schema mapping、carrier、positive integration |
| member event family / routes | consumer / event semantic names + event port | CloudEvent type / source / subject / payload、topic、delivery readiness |
| screening rules | source ref / snapshot / resolution + four-state member conclusion | taxonomy、local policy DSL、positive unknown path |
| non-project subject | rejected / unsupported boundary | third subject type / lifecycle / positive flow |
| capability outlet | optional,ref-derived,not_available / stale / gap | activation profile、complete inventory、authorization |

## 8. 回填草稿

正式 §1 将使用 §7.1 的关系映射表,并明确列出“本文不再回答 / 必须回答”。`L2M-UP-001~008` 只在 §1 标记效力,具体影响在 Step 13 收口。正式 §1 不复制阅读日志、旧材料诊断或 sibling 进行中内容。

## 9. 待确认事项

本 Step 不新增阻塞 Step 2 的本仓内部待确认事项。`L2M-UP-001~008` 不阻塞 product-neutral、local / negative / blocked-aware 概要骨架,但阻塞相应 exact schema、carrier、正向配置激活、联调、证据和 readiness。

## 10. 进入下一步条件与停审

| 门禁 | 结果 | 依据 |
|---|---|---|
| 需求 / 架构基线已获用户批准 | pass | 项目台账 `01 -> 02` 批准记录 |
| stable / sibling pending / historical 已分层 | pass | §2、§3.4、§4 |
| 已回答五个 SOP 问题 | pass | §3.1~§3.5 |
| 已形成上游映射与不再回答 / 必须回答清单 | pass | §7.1~§7.3 |
| 未提前正式化代码主体、对象、接口、流程或状态 | pass | 本文仅列展开问题与 boundary slot |
| 未伪造 sibling / schema / integration / readiness | pass | §3.4、§7.4、§9 |

Step 1 结论为 `completed / pass / stop_review`。下一允许动作是更新 flow / 项目台账至 Step 2,然后创建 `02_hld_step_02_goals_scope.md`;不得跳到 Step 3 或修改正式旧 02。
