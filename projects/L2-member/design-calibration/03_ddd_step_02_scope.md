# L2-member 03 详细设计 Step 2：明确本轮实现范围和非范围

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 2
> 对应正式回填章节：未来 `03-详细设计.md` §2“本次详细设计目标与范围”
> 生成日期：2026-08-26
> 状态：`completed / pass_with_upstream_blockers / stop_review`
> 模式：`full-restart + single-agent-serial`
> 正式正文：`formal_03_write_allowed = false`；本文件只形成未来回填草稿。

## 1. Step 状态

- 状态：`[x] 已确认`
- 当前模块：`scope`
- 本步目标：把 Step 1 已确认的输入边界裁剪为未来完整 `03-详细设计.md` 必须下沉的实现契约范围，并明确不属于 03、只能以 conditional / blocked-aware 方式出现、或只能等待外部 owner 的内容。
- 本步边界：范围描述不等于实施授权；当前用户只授权讨论 Step 1~4，且尚未授权正式 03 装配、实现仓创建、代码、集成或 commit。

### 1.1 Step 内计划

| 子阶段 | 可审查产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 范围输入复核 | Step 1、正式 `00/01/02` §2 / §4~13、02 Step 12 | done | 已区分“未来正式 03 的完整设计范围”与“本轮仅可讨论至 Step 4 的执行上限”。 |
| SOP 问题回答 | §3 五项回答 | done | 模块、对象 / 接口 / flow / state、条件范围、文档边界与实施者产出均已回答。 |
| 现状与历史诊断 | §4 | done | 未把旧五模块、产品决策或实施事实误带入当前范围。 |
| 范围取舍 | §6 | done | 核心结构全覆盖；optional / external positive lane 采用结构保留、激活受限。 |
| 结构化范围清单 | §7 | done | 每个 CP、接口族、对象 / state、外部 blocker 与下游文档均有明确归属。 |
| 回填草稿与自检 | §8、§10 | done | 正式 §2 所需目标表与非范围表已就绪，允许进入 Step 3。 |

### 1.2 Step 开工与写入前确认

| 项目 | 记录 |
|---|---|
| 项目级门禁 | pass：项目台账已记录 Step 1 `pass_with_upstream_blockers`，且用户授权本轮按顺序推进至 Step 4。 |
| 文档级门禁 | pass：03 flow 允许创建 Step 2，正式 03 仍禁止写入。 |
| Step 级门禁 | pass：已读取 Step 1 的上游关系、本文不再回答 / 必须回答、风险与回退规则。 |
| 已读取规范 | yes：详细设计 SOP Step 2、详细设计书写规范 §5.2，以及通用中间产物 / truth-source / dependency 规则。 |
| 已读取范围输入 | yes：正式 `00` 的目标 / 非目标 / 核心能力 / FR，正式 `02` 的目标、CP01~CP07、接口 / flow / exception / configuration impact 与 Step 12 handoff。 |
| 本 Step 模块骨架 | not_applicable：本 Step 只收敛全仓设计范围，不提前作 Step 5 的 module 主轴拆分。 |
| 本次写入类型 | Step 范围中间产物与两层状态台账更新。 |
| 正式正文污染检查 | pass：用户故事、任务、排期、实现状态、测试结果和外部成功均不进入未来 §2 草稿。 |

## 2. 本步输入

| 输入 | 本 Step 承接内容 | 作用上限 |
|---|---|---|
| `03_ddd_step_01_upstream_boundary.md` | stable / pending / historical 分层、本文必须回答、`L2M-UP-001~008`、回退规则。 | 不重复定义上游 owner；只据此裁剪详细设计范围。 |
| 正式 `00-需求文档.md` §4、§7、§9、§10、§13~15 | 五个核心能力闭环、12 项核心 FR、三个外围增强项、非目标、NFR 与 blocker。 | 目标转译为实现契约，不复述用户故事或验收结果。 |
| 正式 `01-架构设计.md` §3~§10、§13~15 | BC01~BC07、local truth / external truth、inward dependency、communication categories、横切与演进边界。 | 不重新定义 architecture、deployment、technology product 或 owner。 |
| 正式 `02-概要设计.md` §2、§4~§13 | 详细设计承接目标、CP01~CP07、34 objects、`10 / 16 / 14 / 24 / 5`、flow / state / exception / config outline。 | 不把概要骨架误报为已经存在的实现或完整 external contract。 |
| `02_hld_step_12_detailed_design_handoff.md` | 逐项下沉方向、回退表、当前不能承接的 contract。 | 不通过范围表创造新对象、接口或正向 carrier。 |
| `02_hld_step_13_risks_open_questions.md`、项目台账 §5 | pending 输入、可裁剪 outlet、physical detail 与 measurement 空缺。 | 不关闭 blocker；只明确其限制的是哪一条范围 lane。 |

## 3. SOP 问题回答

### 3.1 本轮详细设计必须覆盖哪些模块？

未来完整 `03-详细设计.md` 的实现契约范围必须覆盖 CP01~CP07 七个业务主要组成部分。这里的“覆盖”指为每个组成部分定义其 planned module / service / domain / Port / Store / projection / handoff 的实现职责和边界；不意味着现在已有七个 crate、七个进程或七个可运行模块。

| 详细设计覆盖组 | 必须下沉的实现契约 | 当前是否可写本仓 local contract | 外部正向 lane 上限 |
|---|---|---|---|
| CP01 Presence and Host Collaboration | admission、presence、host material / attempt、subject / credential / host logical Port、local history。 | 是。 | host request / feedback / IPC / credential exact shape 受 `L2M-UP-001/006` 阻断。 |
| CP02 Inbound Boundary | subscription scope、body-free intake、four-state screening、rule-resolution read、dedup / intake boundary。 | 是。 | rule source matrix / taxonomy 受 `L2M-UP-007` 限制；不建立 allowlist。 |
| CP03 Runtime Mediation | delivery decision、submission attempt、result link、safe material reception、Runtime logical Port。 | 是。 | exact entry / handoff mapping、carrier 与 source family 受 `L2M-UP-003/004` 限制。 |
| CP04 Outbound Boundary | outbound decision、safe material、publication attempt / gap、feedback link、relay continuation。 | 是。 | event schema / route 和 delivery / downstream result 受 `L2M-UP-004/005` 限制。 |
| CP05 Interaction Trace | committed-fact relation、trace / observation material、attempt / gap、body-free Query / relay。 | 是。 | observation carrier / observed / evidence truth 不属于本仓。 |
| CP06 External Context Mirror | owner-specific snapshots / resolutions / gaps、resolver / refresh seam、source update Consumer。 | 是。 | exact safe-result shape、owner route 或 source body 继续由各 owner 关闭。 |
| CP07 Member Read Model | projection state、summary、diagnostics、optional outlet、rebuild / reconcile / Query。 | 是。 | outlet exact consumer activation 受 source / consumer contract 限制；不能变为 registry、authorization 或 execution readiness。 |

本 Step 不将这些覆盖组提前重命名为 Rust module，也不把它们直接映射成 workspace layout；这些是 Step 4 / 5 的后续决策。

### 3.2 本轮必须定义哪些对象、接口、事件、Job 和状态机？

未来正式 03 的范围包含下表中的完整实现契约下沉。它们的具体字段、函数、schema、state matrix、UoW 和 test cut 将分别在 Step 5~16 收敛；本 Step 只锁定不可遗漏的分母和边界。

| 范围族 | 稳定分母 | 03 必须交付给实现者的结果 | 不得被误解为 |
|---|---:|---|---|
| Application coordination | 9 个 Application Service | use-case 归属、输入 / 输出、依赖 Port / Store、transaction 编排与 error mapping。 | 第八业务组成部分或外部 truth owner。 |
| Domain / support / projection object | 34 个对象 | typed identity / ref、field source、factory / method、invariant、state / history、error、persistence / projection input。 | 34 个已实现 struct、或外部 owner object 的复制。 |
| Command | 10 | request / result、actor / metadata、idempotency、expected revision、write set、stored result 与 local transaction 边界。 | 匿名系统写入、host / Runtime / Bus / downstream 成功。 |
| Query | 16 | body-free response / page / visibility / freshness / gap / unavailable surface 与 no-write proof。 | refresh、rebuild、reconcile、source update 或 external query truth。 |
| Inbound Consumer | 14 | source / version / dedup / body gate、receipt / quarantine、typed re-entry、late / conflict posture。 | member-specific external envelope、route 或 owner truth。 |
| semantic Outbound Event | 24 | semantic kind、local source ref、correlation、safe payload candidate、compatibility / publication error surface。 | Core schema、Bus topic、delivery、accepted、observed 或 integration。 |
| Operations Job | 5 | input / report / cursor / watermark、idempotency、partial failure、continuation / fence。 | business Command、source repair、unknown side-effect replay。 |
| object-scoped state | CP01~CP07 的既有状态族 | enum、initial / terminal / re-entry、legal / illegal transition、expected version、history / side effect 与 state test mapping。 | global `MemberLifecycleState` 或跨 owner 的万能成功状态。 |

### 3.3 哪些能力属于 P1 / 后续阶段，不应在本轮展开？

当前正式基线没有授权以排期或商业优先级自行定义新的 P1 backlog。因此本 Step 不创造“P1 实现任务”，而采用三种可审计范围姿态：

| 范围姿态 | 内容 | 03 的处理方式 |
|---|---|---|
| 必须完整设计 | CP01~CP06、CP07 Member Summary 与各组件的 local / negative / blocked-aware contract。 | 后续 Step 必须完整下沉为实现契约。 |
| 结构保留、激活可裁剪 | `CapabilityOutletView`、部分 diagnostics / explainability 读面，以及 `FR-L2M-E01~E03` 所对应的产品体验。 | 03 必须定义 `not_available` / `stale` / `gap`、read-only / body-free、projection source 与关闭边界；不承诺首批 consumer、analytics 或正向 activation。 |
| 条件阻塞、仅写 local boundary | host / image / Runtime / Core event / credential / Governance taxonomy / third subject 等 `L2M-UP-001~008` 所涉 positive lane。 | 只定义 typed ref、logical Port、local attempt / gap、blocked / waiting / unknown 与 reopen trigger；不写 exact DTO、carrier、adapter activation 或 integration。 |

这不是把可裁剪或条件阻塞内容从详细设计中删除；而是要求设计显式表达“当前不激活 / 不可证明”，从而避免将 absence 伪装为 ready。

### 3.4 哪些内容属于测试方案、实施计划、配置设计或运维手册？

- `04-配置设计.md`：具体 key、default、environment、secret reference、format、source precedence、operator fill-in 和 deployment parameter；03 只定义 effective config、validation、provenance、builder injection 与不可配置化红线。
- `05-测试方案.md`：test case、fixture collection、fake setup、execution command、workload、test result、artifact / report generation；03 只定义 minimal test cut 与 failure semantics。
- `06-验收标准.md`：acceptance gate、verdict、evidence、signoff、readiness；03 只提供可回指的 object / protocol / flow / state / test input。
- `07-实施计划.md`：phase、task、commit boundary、implementation ledger、review / delivery sequencing；03 只提供可实现契约和实施承接输入。
- 运维 / 部署材料：container / process manager、orchestrator、alert、backend、retention operational value、rollback execution；除非后续文档和 owner authority 收稳，不进入本仓 03。

### 3.5 实现者拿到本文后，应能完成哪些代码范围？

在未来 Step 5~19 已完成、正式 03 装配并获得独立实现授权的前提下，实现者应能：

1. 创建符合 Step 3 / 4 planned constraints 的 `L2-member` 实现单元，并将 CP01~CP07 的 inbound、application、domain、Port、persistence / projection、handoff 职责落到明确文件；
2. 实现本仓拥有的 local / support / derived-read objects、append / successor history、Domain guard、Query no-write、projection rebuild 与 blocked-aware result surface；
3. 为 10 Commands、16 Queries、14 Consumers、24 semantic Events 和 5 Jobs 实现本地 validation、idempotency、transaction、attempt / gap、feedback link 与 fake seam；
4. 在没有 external exact contract 的 lane 中实现 fail-closed / blocked / waiting / stale / gap，而不是自行补齐 carrier 或成功事实；
5. 为后续配置、测试、验收和实施计划提供稳定的类型、flow、state、Port 与 test cut 输入。

实现者不能仅凭未来正式 03 合法完成或声明：host acceptance / health、image compatibility、Runtime run / acceptance / outcome、Bus delivery、downstream accepted / observed、Governance approval、tool execution、外部 adapter 或任何实际 integration。那些需要相应 owner 合同和后续授权。

## 4. 当前文档问题诊断

| 观察 | 若误用的后果 | 本 Step 处置 |
|---|---|---|
| 当前 00~02 已有完整业务覆盖，但 03 尚未开始模块 / layout / object / protocol 下沉。 | 可能误以为“细节缺失”允许根据旧文或产品偏好自行补齐。 | 将 03 范围定义为完整的实现契约下沉，而非新的需求或架构发现阶段。 |
| 旧 03 把范围压成 persona、endpoint、capability、binding、summary 五组。 | 会遗漏 inbound、outbound、trace、mirror，并重引 identity / Runtime truth。 | 不继承旧范围；以 CP01~CP07 和九个 Application Service 为唯一稳定分母。 |
| README 把 Rust / supervisor / UDS / CloudEvents / AG-UI / token / P95 当现成范围。 | 将 pending external carrier、产品选择和无证据指标伪装为实现目标。 | 仅保留 current authority 下的 logical seam；产品和数字一律范围外或等待后续 authority。 |
| capability outlet 可裁剪。 | 可能被错误删除，或相反被当作 registry / authorization / execution prerequisite。 | 结构范围保留 outlet 的 safe / unavailable / stale / gap view；activation 和 consumer contract 不在本轮承诺。 |
| 本轮用户授权只到 Step 4。 | 可能误把“完整详细设计范围”写成“已完成设计 / 可开始编码”。 | 明确设计范围与当前执行上限分离；Step 5~19 和正式正文仍未授权。 |

## 5. 改动前后对比

| 项 | 改动前 / historical 口径 | Step 2 后范围口径 | 原因 |
|---|---|---|---|
| 业务覆盖 | 五个 persona-centric 部分。 | CP01~CP07 全覆盖；业务主体与实现层正交。 | 当前概要设计已纠正 owner 与范围。 |
| Core range | 将 runtime actor / capability state / visible member 作为本仓核心。 | local presence、screening、mediation、outbound、trace、mirror、read model 的本地 / 派生 contract。 | 防止吞并 Runtime / Tools / identity / conversation truth。 |
| external lane | 固定 IPC、topic、token、provider 或 manager 即可推进。 | 仅 local / logical Port / blocked-aware lane；exact contract 由 `L2M-UP-001~008` 限制。 | 保持 owner 及 non-fabrication discipline。 |
| optional read capability | 若有能力定义即等于可用出口。 | outlet / diagnostics 结构保留、可裁剪、显式 not_available / stale / gap。 | `available` 不等于 registry、authorization、invocation 或 execution readiness。 |
| 下游内容 | 配置、测试、实施、性能和运维穿插在设计范围。 | 03 只交付实现契约；04~07 和 owner 文档各自承接。 | 保持正式文档串行与可追溯。 |
| 当前授权 | 历史文本容易暗示可立即开发。 | 当前只完成范围讨论至 Step 2；Step 3 / 4 后仍必须停审。 | 用户明确限制本轮上限。 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 / 风险 | 结论 |
|---|---|---|---|
| A. 仅设计 C1~C4 主线，忽略 trace / mirror / read model。 | 篇幅较短。 | 无法保证 body-free trace、source resolution、summary / stale surface 与 owner boundary。 | 不采用。 |
| B. 将 CP01~CP07 和全部稳定接口分母纳入 03，但对 outlet / diagnostics 及 external lane 采用显式条件范围。 | 完整承接 02，又不会把 optional / pending 写成 activation。 | 需要后续每 Step 都维护 conditional boundary。 | 采用。 |
| C. 等 sibling exact contracts 完成后再定义范围。 | 可以少写 placeholder。 | 会无必要阻断本仓 local / negative / blocked-aware contract，并违背并行窗口占位纪律。 | 不采用。 |
| D. 在 03 先决定 DB、queue、IPC、event schema、retry、P95，以便“范围完整”。 | 看似能立即指导实施。 | 这些分别属于 Step 3~14、04 或 external owner，当前无 authority。 | 不采用。 |

## 7. 结构化中间产物

### 7.1 详细设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| `DDD-G-L2M-001`：冻结实现主轴而不改写业务主语 | 把 CP01~CP07 与实现分层映射为后续 planned module / file / ownership，保持无第八业务组成部分。 | 可追溯的 module / layer / object / Port 归属和禁止反向依赖清单。 |
| `DDD-G-L2M-002`：完成 local truth 的对象与历史契约 | 将 34 对象下沉为 typed field、guard、factory、method、state、append / successor history、error 和 Store 契约。 | 可编码 domain / support / projection type 与 repository / projection input。 |
| `DDD-G-L2M-003`：完成 boundary protocol 与 flow 契约 | 将 `10 / 16 / 14 / 24 / 5` 分类下沉为 DTO、metadata、Port、result / receipt、transaction、idempotency、attempt / gap、flow 与 state mapping。 | Command / Query / Consumer / Event / Job 可逐项实现与测试的边界。 |
| `DDD-G-L2M-004`：把 fail-closed 红线落实到实现切口 | 将双锚、body-free、Query no-write、unknown fence、external state layering、CP06 / CP07 单向关系落实到 guard、error、state、Port 和 negative test。 | 无外部 owner 越权、无 raw body、无 false success 的代码检查点。 |
| `DDD-G-L2M-005`：完成 local consistency 与 derived-read 契约 | 明确 UoW、history、outbox candidate、projection watermark / rebuild、duplicate / late / unknown、visibility / freshness。 | local-first write / read boundary、projection rebuild 及 safe Query surface。 |
| `DDD-G-L2M-006`：保持 external positive lane 诚实 | 对 `L2M-UP-001~008` 定义 logical Port、typed ref、blocked / waiting / stale / gap 与 reopen trigger。 | 可实现 fake / placeholder / fail-closed path；无 local shadow schema 或 integration claim。 |
| `DDD-G-L2M-007`：给 04~07 提供可回指输入 | 收敛 effective config、test cut、acceptance mapping 和 implementation handoff 的设计入口。 | 后续文档可按对象 / protocol / flow / state继续展开，不要求实施者自行选边。 |

### 7.2 范围覆盖矩阵

| 范围 | 对象 / 接口 / flow / state 要求 | 本轮详细设计形态 | 激活 / 依赖限制 |
|---|---|---|---|
| CP01 | 5 对象；4 Commands、host feedback、presence / host posture reads；admission / presence / host collaboration flow / state。 | 完整 local contract。 | exact host / credential carrier blocked。 |
| CP02 | 5 对象；2 scope Commands、fact Consumer、screening reads；scope / intake / screening flow / state。 | 完整 local contract。 | governance result shape / taxonomy blocked。 |
| CP03 | 5 对象；2 Commands、material Consumer、mediation reads；delivery / submission / reception flow / state。 | local decision / attempt / link / reception contract。 | entry mapping / handoff source family blocked。 |
| CP04 | 5 对象；local fact / feedback Consumers、relay Job、outbound / publication reads；decision / material / attempt / gap flow / state。 | local decision / material / gap contract。 | event carrier / delivery / downstream result blocked。 |
| CP05 | 5 对象；committed-fact / observation feedback Consumers、relay Job、trace / gap reads；trace / observation flow / state。 | body-free relation / attempt / gap contract。 | observation backend / observed / evidence excluded。 |
| CP06 | 4 对象；2 Commands、5 source Consumers、refresh Job、resolution reads；snapshot / resolution / gap flow / state。 | owner-specific resolver and mirror support contract。 | exact source safe schema remains owner-controlled。 |
| CP07 | 5 对象；2 projection Consumers、2 Jobs、3 projection reads；rebuild / reconcile / Query flow / state。 | summary mandatory; diagnostics / outlet structure retained as read-only conditional surfaces。 | outlet consumer activation and source contract conditional; no registry / authorization. |

### 7.3 范围外与后续归属表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 重定义目标、用户故事、FR / BR、验收口径、owner、BC、ADR、依赖分类 | 正式 `00` / `01` 与对应受控回开。 |
| Runtime loop / context / plan / memory / checkpoint / outcome，Tools contract / execution / registry，外部 MCP / A2A / API adapter | `L2-runtime`、`L2-tools`、capability / adapter owner。 |
| host lifecycle、registry、session、health verdict、container lifecycle、credential issue / revoke | `L2-member-service`、Identity / credential owner。 |
| image build、manifest、release、compatibility、pinned entry supply | `L2-member-images`。 |
| Bus delivery / topic / route truth、Conversation append / body、Artifact / evidence、observability backend / observed | 各对应 owner。 |
| external exact DTO、IPC direction、event type / source / subject / payload / route、adapter activation | 对应 `L2M-UP-001~008` owner contract；当前仅 design blocked-aware boundary。 |
| physical deploy product、DB / queue / scheduler / storage product、fixed retry / timeout / retention / P95 / SLO values | 后续受控技术 / configuration / operations decision，且必须有 authority。 |
| concrete config key、default、environment variable、secret、format、precedence、operator guide | `04-配置设计.md`。 |
| complete test case、fixture corpus、command execution、run_id、artifact / report、actual result | `05-测试方案.md` 与真实执行。 |
| acceptance verdict、evidence、signoff、readiness | `06-验收标准.md` 与真实验收。 |
| phase、task、commit、implementation ledger、delivery / rollback execution | `07-实施计划.md` 与实施阶段。 |
| 当前实现仓创建、源码、依赖安装、编译、测试、commit | 不在本设计任务；须获独立实施授权。 |

### 7.4 当前执行上限与未来文档范围的分离

| 维度 | 当前状态 | 禁止推导 |
|---|---|---|
| 未来 03 设计范围 | 应完整覆盖 §7.1~§7.3 所列实现契约。 | 这些契约已经讨论完成、正式装配或可实施。 |
| 本轮用户授权 | 仅允许完成 Step 1~4 calibration；本 Step 结束后只可进入 Step 3。 | 可创建 Step 5~19 文件、修改正式 03、实现或提交。 |
| external positive lane | owner contracts 仍 pending；只可设计 local / fake / blocked-aware behavior。 | 已集成、可用、已验证、ready 或可出证据。 |
| implementation repository | `/home/aris/Projects/quantalithos-member` 当前不存在。 | planned layout / Cargo relation 是存在或可编译事实。 |

### 7.5 范围守卫与回退条件

| 若后续发现 | 范围动作 |
|---|---|
| 需要增加第八业务组成部分、改变 CP owner、改变 `ProjectMemberRef + GlobalMemberRef` 主语或 body boundary | 回退 02 对应主体 / owner Step；不得在 03 扩写。 |
| 需要增删 34 对象或改变 Command / Query / Consumer / Event / Job 分类 | 回退 02 Step 6 / 7，并重审影响的 flow / state。 |
| 需要将 optional outlet / diagnostic 写成 registry、authorization、execution prerequisite | 回退 02 CP07 boundary；当前只允许 safe derived view。 |
| 需要 external positive carrier / schema / route / credential / manifest | 保持 `L2M-UP-*` pending，等 owner；不能为“范围完整”而本地发明。 |
| 需要以配置、retry、cache、Query 或 projection 改变 unknown / gap / owner / history | 回退 00 / 01 / 02 相关红线；不属于详细设计自由度。 |

## 8. 回填草稿

### 8.1 未来正式 §2“本次详细设计目标与范围”草稿

未来正式 `03-详细设计.md` §2 应使用下表作为“设计目标表”：

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 冻结实现主轴而不改写业务主语 | 以 CP01~CP07 与正交实现分层组织详细设计。 | module / layer / object / Port 的可追溯归属。 |
| 完成 local truth、support truth 与 derived-read 契约 | 下沉 34 对象、history、guard、state、Store / projection input。 | 可编码本仓对象和本地一致性边界。 |
| 完成 protocol、flow 与状态契约 | 下沉 `10 / 16 / 14 / 24 / 5` 的 DTO、metadata、Port、flow、idempotency、error 与 state mapping。 | 可逐项实现和测试的 boundary contract。 |
| 落实 fail-closed 与 body-free 红线 | 将双锚、Query no-write、unknown fence、外部状态分层、CP06 / CP07 单向关系写入代码切口。 | negative / blocked-aware implementation guard。 |
| 保留 external pending 的真实上限 | `L2M-UP-001~008` 只以 logical Port、typed ref、gap 和 reopen condition 出现。 | 不产生 local schema、carrier、integration 或 readiness 伪结论。 |

未来正式 §2 应使用下表作为“非范围表”：

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求、架构、owner、BC / ADR 的重定义 | 正式 `00` / `01` 的受控回开。 |
| Runtime / Tools / host / image / Bus / Governance / Conversation / Artifact / Observability truth | 对应正式 owner。 |
| exact external carrier、schema、route、IPC、credential、manifest、acceptance / delivery事实 | 对应 `L2M-UP-001~008` owner contract。 |
| concrete config | `04-配置设计.md`。 |
| test execution / evidence / acceptance | `05-测试方案.md`、`06-验收标准.md` 与真实执行。 |
| phase / task / commit / implementation | `07-实施计划.md` 与独立实施授权。 |

正式 §2 不应写 current Step 授权、诊断、历史材料、方案比较、工作量、排期、结果或 readiness。

## 9. 待确认事项

- `L2M-UP-001~008` 不因本 Step 的范围确认而关闭；它们仅将正向 external lane 限制为 contract-only / blocked-aware。
- `CapabilityOutletView` 的 exact downstream consumer 和首批 activation 未收稳；当前范围保留其 projection / safety / unavailable semantics，但不承诺产品可见性或执行可用性。
- `MemberDiagnosticView` 和外围增强项必须保持只读、body-free、non-authorizing；其产品级统计、历史浏览、配置说明体验不属于当前核心实现契约的 activation scope。
- 目标实现仓不存在；Step 3 / 4 可以形成 planned language / workspace / file contract，但不能把计划改写成现有文件或可运行结果。

## 10. 自检与进入下一步条件

| 检查项 | 结果 | 说明 |
|---|---|---|
| 设计目标是实现契约目标 | pass | 目标均可落到 module、type、Port、flow、state、test cut 或 implementation check。 |
| 范围覆盖稳定主体 | pass | CP01~CP07、九个 Service、34 objects、`10 / 16 / 14 / 24 / 5` 均进入未来 03 的下沉分母。 |
| optional / pending 未被错删或伪激活 | pass_with_upstream_blockers | outlet / diagnostics 结构保留；external positive lane 均保持条件上限。 |
| 非范围归属清楚 | pass | 00 / 01、各 owner、04~07、实施仓和运行证据均有明确归属。 |
| 实现者能力边界清楚 | pass | 能完成本地 / fake / blocked-aware contract；不能宣称外部 integration 或 readiness。 |
| 未写任务、排期或实现事实 | pass | 未创建实现、未写 commit / run / test / evidence / signoff。 |
| Step 3 内容门禁 | pass | 本轮要设计什么、不能设计什么、条件范围及下游归属均清楚，可进入约束与仓库讨论。 |

```text
step_02_status = completed
step_02_gate = pass_with_upstream_blockers
next_allowed_action = read_step_03_constraints_inputs_then_create_and_complete_03_ddd_step_03_constraints.md
formal_03_write_allowed = false
implementation_repo_write_allowed = false
commit_required = false
```
