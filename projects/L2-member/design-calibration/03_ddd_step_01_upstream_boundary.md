# L2-member 03 详细设计 Step 1：确认概要设计输入边界

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 1
> 对应正式回填章节：未来 `03-详细设计.md` §1“与上游文档的关系声明”、§17“风险与待确认事项”
> 生成日期：2026-08-26
> 状态：`completed / pass_with_upstream_blockers / stop_review`
> 模式：`full-restart + single-agent-serial`
> 正式正文：`formal_03_write_allowed = false`；本 Step 只形成校准结论，不写入 `03-详细设计.md`。

## 1. Step 状态

- 状态：`[x] 已确认`
- 当前模块：`upstream_boundary`
- 本步目标：确认哪些 `00/01/02` 结论已足以作为详细设计的稳定输入，哪些仍只能作为 owner-specific、transport-neutral、blocked-aware seam；同时完成旧 `03` 与 README 的历史污染审计。
- 本步边界：不重写需求、架构或概要设计；不新增业务组成部分、对象、接口、状态或外部协议；不激活 adapter、carrier 或任何正向集成；不实施、不提交。

### 1.1 Step 内计划

| 子阶段 | 可审查产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 恢复与输入核验 | 项目台账、03 flow、当前正式 `00/01/02`、02 Step 12、SOP / 书写规范读取记录 | done | 已确认当前只允许推进 03 Step 1~4，正式 03 仍禁止写入。 |
| 上游效力分层 | authoritative / stable / pending / historical 映射 | done | 需求、架构、概要、上游 owner、并行 sibling 与历史材料不混写。 |
| SOP 问题回答 | §3 五项逐项回答 | done | 已说明可承接范围、详细设计需补清项和不可重答项。 |
| 历史污染审计 | 旧 `03`、README 的差异诊断 | done | 已逐项隔离旧主体、固定协议、技术产品、配置与量化假设。 |
| 结构化收敛 | §7 上游关系、本文边界、风险与回退表 | done | 每一类输入均有 03 继续展开位置或明确的挂起上限。 |
| 回填草稿与自检 | §8、§10 | done | 只形成未来正式章节草稿；满足进入 Step 2 的内容门禁。 |

### 1.2 Step 开工与写入前确认

| 项目 | 记录 |
|---|---|
| 已读取通用规范 | yes：`设计文档编写通则.md`、`设计文档讨论中间产物规范.md`、`设计真相源闭环与可落码性标准.md`、`全局项目依赖关系与裁剪规则.md`。 |
| 已读取本类型规范 | yes：`详细设计讨论流程_SOP.md` Step 1、`详细设计书写规范.md` §2、§3、§5.1、§5.17。 |
| 已读取项目输入 | yes：项目执行台账、03 flow、正式 `00/01/02`、`02_hld_step_12_detailed_design_handoff.md`、当前可引用的上游 / sibling 材料与旧 `03`、README。 |
| 当前模式 | full-restart；旧 README、旧正式 `03` 仅为 historical material 与污染审计输入。 |
| 本 Step 模块骨架 | done；本 Step 不按 CP 拆模块，只收敛输入效力与展开上限。 |
| 本次写入类型 | Step 中间产物与两层状态台账更新。 |
| 正式正文污染检查 | pass；诊断、取舍、待确认与历史差异均留在本文件，不进入正式 `03`。 |

## 2. 本步输入

| 输入 | 当前效力 | 本 Step 使用方式 | 效力上限 |
|---|---|---|---|
| `projects/L2-member/00-需求文档.md` | 当前项目需求基线，已获进入后续文档的用户授权 | 承接本仓定位、目标 / 非目标、主语、能力闭环、业务规则、数据归属、依赖与否决项。 | 不在 03 重写用户故事、需求优先级、验收结果或外部 owner。 |
| `projects/L2-member/01-架构设计.md` | 当前项目架构基线，已获进入 02 的用户授权 | 承接 BC01~BC07、owner 边界、inward dependency、数据分类、一致性、通信类别与横切红线。 | 不在 03 重划限界上下文、部署拓扑、技术选型或数据 owner。 |
| `projects/L2-member/02-概要设计.md` | 当前正式概要设计基线，`formal_02_stop_review` | 承接七个业务主要组成部分、实现分层、九个 Application Service、34 个对象、接口 / 流 / 状态 / 配置轮廓。 | 不把对象骨架直接当完整 Rust schema，也不改变主体、接口类别、状态含义或传播方向。 |
| `design-calibration/02_hld_step_12_detailed_design_handoff.md` | 02 到 03 的直接承接清单 | 锁定详细设计需要下沉的对象、Port、协议、flow、状态、一致性与测试切口方向。 | 不以 handoff 表补造 exact carrier、字段、route、凭据或外部成功。 |
| `design-calibration/02_hld_step_13_risks_open_questions.md`、项目台账 §5 | 已登记的风险与 pending 约束 | 保留 `L2M-UP-001~008` 的 owner、影响与 fail-closed 上限。 | 不因开始 03 而关闭 blocker，或把 placeholder 写为 integration / readiness。 |
| `projects/L2-runtime/00~07` | 当前已完成正式链的专项上游 | 承接 Runtime loop / context / plan / outcome 均外置，以及 entry、safe material、handoff 的 member-side seam 边界。 | 不复制 Runtime run、context、plan、checkpoint、tool execution、outcome truth；exact mapping 仍受 `L2M-UP-003/004` 限制。 |
| `projects/L2-tools/00~07` | 当前已完成正式链的专项上游 | 承接 tool action contract 与 safe ref / view 的消费边界。 | 不定义 capability registry、tool invocation / execution、外部 MCP / A2A / API adapter。 |
| `projects/L0-core`、`L0-bus`、`L0-sdk` 当前正式链 | foundation authority | 承接 Core shared primitive / envelope 类别、Bus event collaboration / delivery owner、SDK 下游封装边界。 | 仅 Core 是 compile 候选；Bus / SDK 不是 member package dependency；member-specific Core schema / route 仍 pending。 |
| `projects/L1-work`、`L1-identity`、`L1-governance`、`L1-conversation`、`L1-artifact` 当前正式链 | external truth input / 粒度参考 | 承接 `ProjectMemberRef + GlobalMemberRef`、Policy effective、conversation / artifact body 外置与对象表达粒度。 | 不取得 ProjectMember / identity lifecycle、policy / approval、conversation、artifact / evidence truth。 |
| `projects/L2-member-service`、`projects/L2-member-images` 的当前正式或明确可引用材料 | 并行 sibling 的只读 owner-direction 输入 | 核验 host lifecycle 与 image supply 均外置；将 exact 交互记作 pending。 | 不引用 sibling WIP 作为合同，不改兄弟目录，也不从其材料推导 IPC、manifest、credential 或 ready。 |
| `standards/coding/rust.md`、目录组织规范、Core workspace 线索 | 后续实现约束线索 | 为 Step 3 / 4 预留语言、版本、目标仓、crate 与目录核验入口。 | 不将 Rust、crate 布局或目标实现仓存在性提前写成实现事实。 |
| 旧 `README.md`、旧 `03-详细设计.md` | `historical_material` | 仅用于下述污染与差异审计。 | 零继承权；任何仍可能适用的内容必须由当前 authority 重新证明。 |

## 3. SOP 问题回答

### 3.1 当前详细设计直接承接概要设计中的哪些结论？

详细设计直接承接的是已经停审的主体和边界，而不是旧实现方案。

1. 执行主语：正向路径只能以 `ProjectMemberRef` 为执行主语，且必须关联 `GlobalMemberRef` 身份锚；任何非项目型或未解析主语均 fail-closed。
2. 本仓 truth 范围：仅拥有 member-local interaction truth、member support truth 与 derived-read truth；Runtime、host、Bus、Governance、Conversation、Tools、identity、image、observability 的 truth 继续外置。
3. 业务组成部分：固定为 CP01 Presence and Host Collaboration、CP02 Inbound Boundary、CP03 Runtime Mediation、CP04 Outbound Boundary、CP05 Interaction Trace、CP06 External Context Mirror、CP07 Member Read Model。`Member truth core` 只是共同 invariant，不是第八组成部分。
4. 实现分层：固定承接 Inbound / Operations、Application Services、Domain Model and Policies、Ports and External Seams、Persistence / Projection、Local Handoff Continuation 的正交分层；业务组成部分不能机械等同为 crate、服务、进程或表。
5. 语义红线：local-truth-first、append / successor history、Query no-write、unknown fence、body-free、CP06 唯一 source-update Consumer owner、CP07 只消费 CP06 已提交 resolution / gap 均是详细设计必须落实的约束。
6. 下沉分母：九个 Application Service、34 个对象、`10 / 16 / 14 / 24 / 5` 的 Command / Query / Consumer / semantic Event / Job 分类、既有 flow / state / exception / configuration impact 轮廓，是后续 Step 5~17 的输入分母。

### 3.2 概要设计中的代码主体框架是否已经足够稳定？

是，足以进入详细设计的范围、约束和布局讨论；但它不等于可直接生成实现或正向联调。

| 判断维度 | 结论 | 理由 |
|---|---|---|
| 业务主体 | stable | CP01~CP07 的职责、非职责、单向关系与无第八业务组成部分原则均已收稳。 |
| 实现分层 | stable | 入口 / Application / Domain / Port / Persistence / Projection / Handoff 的职责和 inward dependency 已收稳。 |
| 对象与状态候选 | stable with further elaboration | 34 个对象、对象类别、状态族和禁止迁移已给出骨架；完整字段、enum、factory、错误和 persistence contract 尚需 03 展开。 |
| 接口与流 | stable with further elaboration | 接口分类、metadata 槽位、单向处理流与 no-write / local-first 约束已收稳；DTO、Port 函数、transaction、idempotency 和 exact carrier 尚未收稳。 |
| 正向跨仓合同 | blocked | host、image、Runtime、Core member-specific schema、credential、screening taxonomy、第三种主语均缺 owner authority。 |
| 物理实现环境 | unresolved but non-blocking for Step 2 | 目标实现仓目前不存在，具体 workspace / crate、store、carrier、config key 和数值尚不能作为现状声明；Step 3 / 4 只能形成 planned contract。 |

因此，本 Step 的推进结论是：稳定骨架足以使 03 继续收敛本仓 private contract、logical Port、negative path 与 blocked-aware boundary；它不足以授权 03 伪造 external DTO、topic、route、credential、manifest、IPC 或 positive integration。

### 3.3 概要设计中的关键对象、接口骨架、处理流和状态机是否足够继续展开？

足够继续展开，但必须严格按其所属模块和后续 Step 逐步展开。

| 输入骨架 | 03 必须继续收稳 | 不得由 03 补造 |
|---|---|---|
| 34 个关键对象 | typed identity / ref、字段来源、factory / method、invariant、state / history、DomainError、Store read / write、serialization 与 fixture 策略。 | 外部 owner 的 business object、raw body、generic record 隐藏的新对象。 |
| 10 Commands | request / result、actor / metadata、idempotency、expected version、stored result、transaction 与 error mapping。 | system trigger 的匿名写入、外部成功结论。 |
| 16 Queries | request / response / page、visibility、freshness / gap / unavailable、projection identity 与 no-write proof。 | Query refresh、rebuild、reconcile、gap creation 或 source write。 |
| 14 Consumers | source identity、schema version、dedup、ordering / conflict、body gate、receipt / quarantine、application re-entry。 | source owner truth、member-specific external envelope / route。 |
| 24 semantic Events | local source ref、correlation、safe payload、outbox candidate、compatibility 与 publication error surface。 | 既定 topic、CloudEvent type / source / subject、delivery / downstream accepted。 |
| 5 Operations Jobs | input / report、cursor / watermark、idempotency、partial failure、continuation policy。 | 未提交 source truth 的修复、unknown side effect 的盲重放。 |
| 对象化状态族 | enum、initial / terminal / re-entry、转换矩阵、expected-version、late / duplicate / unknown 防线与 state tests。 | 全局 `MemberLifecycleState`，或将 local / submitted / delivered / observed / accepted / healthy 压缩为同一成功态。 |

### 3.4 哪些内容仍停留在概要设计轮廓，进入详细设计前必须补清？

以下属于 03 的职责，必须在对应 Step 中下沉，不是当前上游缺陷：

- Step 2：本轮实现范围、非范围和 phase boundary；
- Step 3：语言 / runtime、目标实现仓、编译约束、依赖分类、Rust / Rustdoc / 提交规范承接；
- Step 4：planned workspace / crate / module / file 布局与命名检查；
- Step 5~10：按 CP 模块收敛 capability、对象、Port、DTO / Event / Job、函数流和状态机；
- Step 11~16：持久化、UoW、一致性、错误、并发、配置、观测、测试切口；
- Step 17~18：实施承接与风险闭口；Step 19 才允许装配正式正文。

下列事项不能由 03 补清，必须等待其 owner 或保持 blocked-aware：host / IPC / credential、image release、Runtime entry / handoff、member-specific Core event contract、screening taxonomy、非项目型主语及任一 physical carrier 的外部正向合同。

### 3.5 哪些需求或架构结论影响详细设计，但不能在详细设计中重新定义？

- 00 的目标、非目标、需求 owner、数据归属、验收口径与 `L2M-UP-001~008` 的问题归属；
- 01 的 BC01~BC07、责任层、依赖裁剪、owner boundary、local-first、一致性和技术未锁定项；
- 02 的七个业务组成部分、九个 Application Service、34 对象、接口分类、主流、状态含义、CP06→CP07 单向关系与配置不可越界项；
- Runtime、Tools、Core、Bus、Work、Identity、Governance、Conversation、Artifact、member-service、member-images 的各自 truth owner。

若后续详细设计发现必须改变上述任一主语、owner、接口类别、传播方向、body boundary、状态含义或 dependency classification，必须回退至 02 对应 Step（必要时回退 00 / 01 或向外部 owner 请求正式合同）；不得使用私有 DTO、generic adapter、默认值、feature flag、配置项或 projection 字段绕过回退。

## 4. 当前文档问题诊断

### 4.1 当前正式基线诊断

当前正式 `00/01/02` 已能支撑实现契约的逐步展开，但它们有意没有回答完整 Rust 类型、文件布局、物理存储、UoW、schema、carrier、配置 key、测试用例或实施任务。将这类尚未下沉的内容误读为“缺失即可自行决定”，会破坏 full-restart 边界。正确处理是由后续 Step 逐项收敛，且对 external owner contract 保持 placeholder / blocked。

### 4.2 旧 `03-详细设计.md` 的历史污染诊断

| 历史内容 | 与当前基线的冲突 | 本轮处理 |
|---|---|---|
| 五个“persona / endpoint / capability / execution binding / summary”模块 | 与 CP01~CP07 及 local interaction / support / derived-read truth 主语不一致。 | 不继承模块、对象、服务、目录或流程；未来以 CP01~CP07 为模块主轴。 |
| `MemberRuntimePersona` 作为本仓正式主体真相 | 将 identity 输入、运行态 persona 与 member-local interaction truth 混为一体。 | 不继承为 domain truth；只允许当前正式双锚和 local presence / interaction 语义进入 03。 |
| `ExecutionActorBinding` 的持久化及对 Runtime 的 actor binding | 越过 Runtime entry / run / context ownership，且 exact entry mapping 仍受 `L2M-UP-003` 阻断。 | 不继承；仅保留 member-side controlled delivery、attempt、result link / reception 的当前对象骨架。 |
| 直接从 identity / tools / capability-hub 构造 persona / capability | 将 external truth、registry 或 capability definition 吞入本仓。 | 不继承；CP06 只形成 neutral resolution，CP07 只形成 safe outlet view。 |
| `member.*` 固定事件名、MQ topic / schema、HTTP/RPC 映射 | member-specific Core event family、type、source、subject、payload、route 尚未正式闭口。 | 不继承；只在未来 Step 8 写 semantic event / logical Port，exact carrier 保持 `L2M-UP-005` pending。 |
| 固定表名、`jsonb`、索引、主表 / projection 方案 | 物理 persistence、UoW、durability、retention 和目标实现仓均未收稳。 | 不继承；后续只可在 Step 11 以实现契约收敛，并不得改变 history / body / owner 红线。 |
| `available / active / hidden` 等跨对象状态混用 | 违反当前对象化状态族、unknown fence 与“不得全局 lifecycle”的约束。 | 不继承状态机；Step 10 必须按对象筛选并逐个定义状态矩阵。 |
| 直接 retry binding、outlet 或下游同步 | 可能将 external unknown side effect 自动升级或重放。 | 不继承；只能记录 attempt / gap、等待 matching feedback 或形成 successor。 |
| 旧文档结构、作者日期、无 calibration source | 不符合当前详细设计的 18 章结构、Step 可追溯和 full-restart 规则。 | Step 19 才从空文件按当前书写规范重建；旧文不作补丁基底。 |

### 4.3 README 的历史污染诊断

| README 内容 | 当前 authority 判断 | 处理口径 |
|---|---|---|
| `CloudEvents 1.0 + W3C Trace Context` | Core 可作为 shared envelope / trace category authority；并未授权 member-specific event family。 | 只保留“经 Core authority 消费共享类别”的可能性；不得继承 event type、source、subject、payload、route。 |
| `AG-UI 17 事件` | 无当前 member-side owner / contract authority。 | historical only；不得作为 Consumer、Event、topic 或 UI contract。 |
| UDS gRPC、外部 gRPC `:50143`、IPC Bridge | host / Runtime IPC direction、carrier、字段仍分别受 `L2M-UP-001/003` 约束。 | historical only；03 仅能定义 logical Port / adapter seam。 |
| `launch_token`、短时 JWT、TTL | credential issue / revoke / verification owner 与形态未闭口（`L2M-UP-006`）。 | historical only；不可假设 token、JWT、TTL、secret storage 或 validation algorithm。 |
| `supervisord`、单一 Rust 门面进程、B1~B6 结构 | 技术产品、进程拓扑、语言和模块划分均未由当前正式基线锁定。 | 只作历史审计；Step 3 / 4 才按现状和规范形成 planned decision。 |
| NATS / Redis / Kafka | Bus 是 event collaboration owner，但 backend 选择不属于本仓。 | historical only；不得写成本仓 dependency 或配置默认值。 |
| Attention 的 prompt-injection 预过滤 | screening rule / taxonomy 属于 Governance source input，member 不拥有 local policy / allowlist。 | 不继承 B5 或自定义 policy；未知 / stale / conflict 一律保持保守。 |
| 构建 / 测试命令、目录树、P95 与 SLA 数字 | 目标实现仓不存在，且无 workload、measurement 或 execution evidence authority。 | historical only；不得写为 planned command 已可运行、性能目标、测试结果或 readiness。 |

## 5. 改动前后对比

| 项 | 历史材料 / 未校准理解 | Step 1 后的详细设计输入口径 | 原因 |
|---|---|---|---|
| 仓主语 | 运行态 persona / endpoint / actor binding 为中心。 | CP01~CP07 的 member-local interaction、support、derived-read truth。 | 当前 00~02 已收稳 owner 与数据边界。 |
| 执行主体 | `GlobalMemberRef`、token、process 或 runtime execution 可替代。 | `ProjectMemberRef + GlobalMemberRef`；非项目型输入 fail-closed。 | 保持 Work / Identity 与本仓 local association 边界。 |
| Runtime 协作 | member 可绑定 Runtime actor 或承载 execution context。 | member 只做 controlled delivery、attempt、result link / safe material reception；run / context / plan / outcome 外置。 | `L2-runtime` 是唯一运行 truth owner。 |
| 工具 / 能力 | capability hub / definition 可直接变为 member capability truth。 | CP06 消费 safe source，CP07 派生 outlet；`available` 不代替 registry、authorization、invocation 或 execution readiness。 | Tools / capability owner 与 projection boundary 不可被吞并。 |
| host / image | 直接固定注册、心跳、IPC、launch token、镜像启动方式。 | local request / signal / report / attempt 与 blocked-aware supply seam；exact contract pending。 | 并行 sibling 仍未提供可引用的 exact contract。 |
| 事件与 carrier | 预设 CloudEvents、AG-UI、topic、UDS / gRPC 和 route。 | semantic event / logical Port 与 Core shared category可展开；exact carrier 受 blocker 限制。 | 防止 local shadow schema 和 false integration。 |
| 数据与状态 | 固定表 / JSON / global availability / direct retry。 | 对象化 history、local-truth-first、unknown fence、Query no-write；物理实现后续收敛。 | 不让产品选择或 retry 改写领域语义。 |
| 质量与证据 | 旧构建 / 测试命令和 P95 / SLA 可作为承诺。 | 只可设计 planned test cut；不记录 run、report、evidence、verdict、signoff 或 readiness。 | 无实际实现和测量 authority。 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 / 风险 | 结论 |
|---|---|---|---|
| A. 从旧 03 / README 修补，保留 persona、UDS、token、事件和目录 | 表面上可快速得到细节。 | 错误主语、外部 truth、固定 carrier、schema 和无证据指标会整体回流。 | 不采用。 |
| B. 因所有跨仓 exact contract 未闭口而停止 03 | 不会误写外部 DTO。 | 会阻塞本仓可控的对象、history、guard、projection、negative path 与 blocked-aware contract。 | 不采用。 |
| C. 以当前正式 00/01/02 为唯一项目基线；先下沉本仓合同，对 external seam 只写 owner-specific logical Port、typed ref、gap / blocked / waiting | 能继续建立可落码的 local contract，并保留外部 owner。 | 需要在对象、协议、flow、state、config、test 各 Step 显式维护 blocker。 | 采用。 |
| D. 将 sibling 当前进行中材料互相引用以补全合同 | 看似能减少 placeholder。 | 并行窗口形成循环 authority，且违反用户指定的“依赖先占位”纪律。 | 不采用。 |

取舍结果：本仓详细设计的合法深化方向，是对自己拥有的 local / support / derived-read truth 作具体实现契约；外部边界只能深化为非伪造的 consumption、validation、attempt、gap、feedback link、safe view 和 reopen condition。任何需要对方接受、交付、授权、执行、健康、镜像兼容或 observed 成功的结论，均不属于本仓可自行细化的正向事实。

## 7. 结构化中间产物

### 7.1 上游关系映射表

| 来源文档 / owner | 已收稳的承接内容 | 03 继续展开什么 | 不得在 03 重答或改写什么 |
|---|---|---|---|
| `00-需求文档.md` | 本仓定位、目标 / 非目标、双锚主语、需求规则、数据边界、依赖裁剪和验收红线。 | 将 member-local capability 落为 module、object、guard、error、test cut。 | 用户故事、业务目标、外部 owner、验收通过或运行事实。 |
| `01-架构设计.md` | BC01~BC07、责任层、inward dependency、data ownership、local-first、一致性、通信类别。 | 模块依赖、Port direction、adapter 边界、UoW / projection / handoff 契约。 | 系统上下文、部署拓扑、架构 owner、技术产品与跨仓 compile 权。 |
| `02-概要设计.md` | CP01~CP07、九个 Application Service、34 对象、接口 / flow / state / exception / config 轮廓。 | planned file、type、trait、protocol、flow、state、persistence、concurrency、error、config、observability、test contract。 | 新增 / 合并业务主语、对象、接口、状态，或把分层机械映射为 process / crate。 |
| `02_hld_step_12_detailed_design_handoff.md` | 03 的逐项下沉分母、回退规则、稳定输入和开放项边界。 | 将承接表逐项映射到 Step 2~17 的产物与回填章节。 | 使用 handoff 表虚构 external schema、产品、implementation 或 evidence。 |
| `02_hld_step_13_risks_open_questions.md`、项目台账 | `L2M-UP-001~008` 与 local physical detail / measurement / outlet consumer 等限制。 | 对每个 affected module / Port / error / state 维持 blocked-aware posture。 | 关闭 owner blocker，或把 planned / fake / local receipt 提升为 positive integration。 |
| `L2-runtime/00~07` | Runtime entry、safe material、run / context / plan / outcome 外置。 | CP03 的 local decision、attempt、result link、material reception，及 RuntimePort logical contract。 | Runtime loop、run、context、plan、checkpoint、outcome、execution truth。 |
| `L2-tools/00~07` | tool action contract / safe reference 或 view 的外部边界。 | CP06 resolution 与 CP07 optional outlet 的 safe source / projection contract。 | tool definition、registry、invocation、execution、外部 adapter。 |
| `L0-core` | shared ID / ref / actor / metadata / error、envelope / trace category authority。 | 唯一可能的 compile dependency 与 shared type usage audit。 | member-specific schema、event family、route、本地 shadow。 |
| `L0-bus` / `L0-sdk` | event delivery owner、downstream SDK boundary。 | Consumer / publication logical Port、feedback ref、fake boundary。 | Bus delivery truth、SDK 反向 dependency 或已集成结论。 |
| Work / Identity / Governance / Conversation / Artifact | external truth、双锚、policy effective、body / evidence owner。 | typed ref / safe snapshot resolution、body-free material 与 conservative guard。 | lifecycle、policy / approval、conversation append、artifact / evidence truth。 |
| member-service / member-images | host lifecycle 与 image supply 外置方向。 | local attempt / availability gap / adapter placeholder 与 reopen trigger。 | IPC、credential、manifest、pinned entry、compatibility、acceptance / health / readiness。 |
| Rust / directory / truth-source standards | 代码与文档可落码纪律。 | Step 3 / 4 的 planned constraints / layout，后续 field / DTO / state / test closure。 | 以规范替代外部 owner 或业务事实。 |

### 7.2 本文不再回答

- 为什么需要 `L2-member`、其用户、用户故事、业务目标、功能需求和需求级验收是什么；
- BC01~BC07 的架构归属、上下文、部署边界、依赖方向、数据 owner 和总体技术取舍；
- Runtime loop / context / plan / outcome、Tools action / execution、identity / Work lifecycle、Governance policy / approval、Conversation / Artifact body、Bus delivery、host lifecycle、image build、sandbox / observability truth；
- CloudEvents type、AG-UI event、UDS / gRPC path、launch token / JWT、topic、backend、配置 key、secret、P95 / SLA、现有项目文件或执行结果；
- 04 配置项、05 测试全集、06 验收证据、07 实施 phase / commit、任何实际实现、commit、run_id、artifact、report、verdict、signoff 或 readiness。

### 7.3 本文必须回答

- 已冻结 CP01~CP07 如何映射为 planned module / crate / file / service，而不改变 owner 与分层；
- 每个本仓对象的字段来源、typed ref、factory / method、invariant、state、history、DomainError、repository / projection 契约；
- 每个 Command、Query、Consumer、semantic Event、Job 的 DTO、metadata、idempotency、read / write set、result / receipt、error、transaction 和 no-write / body-free 约束；
- 每个 logical Port / Store / adapter / fake 的依赖分类、函数签名、blocked-aware result 和 external contract reopen condition；
- 每个 flow 的 local commit、attempt / gap、feedback、outbox candidate、projection / trace side effect 和 unknown fence；
- 状态、持久化、一致性、错误、并发、配置注入、observability 与 test cut 如何保持当前 owner / state / body 红线；
- 如何将未闭口外部 seam 明确呈现为 pending / blocked / waiting / degraded / stale / gap，而不变成正向成功。

### 7.4 输入不足风险清单

| ID | 输入缺口 | 影响的详细设计区域 | 当前控制与推进上限 | 需要的外部动作 |
|---|---|---|---|---|
| `L2M-UP-001` | member-service 的 host request / signal / report / feedback、registration acceptance、IPC direction 与字段。 | CP01、host adapter、host route resolution、正向配置 / 联调。 | 仅 local material / attempt / feedback link；Port blocked-aware；不声明 registry / session / health。 | member-service 正式 owner contract。 |
| `L2M-UP-002` | member-images release、manifest、pinned entry、compatibility、handoff / confirmation。 | CP01 supply precondition、future layout / configuration / test lane。 | image truth 不进入 object / state / package dependency；unavailable 仅为 blocked / waiting seam。 | member-images 正式 release / consumer contract。 |
| `L2M-UP-003` | inbound material 到 Runtime `EntryAuthority` / formal trigger mapping。 | CP02→CP03、RuntimeEntryPort、submission DTO / flow / tests。 | 只写 typed mapping slot、attempt / blocked / unknown；不得创建 run 或伪造 Runtime API。 | L2-runtime formal entry mapping。 |
| `L2M-UP-004` | Runtime committed material、handoff source family 与 outbound / observation direction。 | CP03 reception、CP04 publication、CP05 observation、event / downstream adapter。 | 仅 safe ref / material、local attempt / gap；不得称 delivered / accepted / observed / evidence。 | L2-runtime handoff and source-family contract。 |
| `L2M-UP-005` | member-specific Core schema / event family / type / source / subject / payload / route。 | Consumers、semantic Events、EventPort、protocol、contract test。 | Core primitive / envelope category 可被消费；不 shadow schema / topic / route。 | L0-core formal member-specific contract。 |
| `L2M-UP-006` | startup credential issue / revoke / verification owner、shape 与 identity association。 | CP01 admission、credential Port、config reference、negative tests。 | 不假定 JWT / token / TTL / secret store；不可验证即 rejected / blocked。 | credential / identity / host owner contract。 |
| `L2M-UP-007` | screening rule source matrix、safe result shape、risk taxonomy。 | CP02 screening、CP06 policy resolution、subscription / delivery precondition。 | 仅消费 formal result / safe snapshot；不建 local allowlist / policy engine / default pass。 | Governance source contract。 |
| `L2M-UP-008` | non-project / personal 第三种 execution subject。 | 所有 subject-bearing对象、接口、state、read view。 | 只支持 project-scoped 双锚；其他输入 fail-closed。 | Work / Identity / product scope authority。 |
| `L2M-DDD-001` | 目标实现仓 `/home/aris/Projects/quantalithos-member` 当前不存在。 | Step 3 / 4 的 workspace、crate、path、Cargo / CI事实。 | 所有布局只能标 `planned`；不声称文件、编译、测试或依赖已存在。 | 后续获得实施授权后建立目标仓并复核。 |
| `L2M-DDD-002` | physical persistence / UoW / durability / idempotency carrier 与 workload / measurement 仍未定。 | Step 11~16 的存储、concurrency、config、test、performance contract。 | 可先定义必须保护的 local consistency / history / unknown fence；不选 DB / queue / numeric SLO。 | 03 后续 Step 与未来 measurement / owner evidence。 |

### 7.5 回退与 blocker 传播规则

| 发现 | 当前 Step 后必须采取的动作 | 不允许的替代做法 |
|---|---|---|
| 需要改变 CP01~CP07、双锚执行主语、truth owner、body boundary 或 dependency classification | 回退 02 Step 1~5；必要时回退 00 / 01 或请求 owner 合同。 | 以 private type、generic adapter、配置或默认值改写边界。 |
| 需要新增 / 删除关键对象或接口类别 | 回退 02 Step 6 / 7。 | 用 untyped map、DTO wrapper、projection 字段隐藏新主语。 |
| 需要改变 local commit、side effect、feedback 或 CP06→CP07 传播方向 | 回退 02 Step 8。 | 在 callback、retry 或 Job 中反向写 source truth。 |
| 需要改变状态含义、unknown / gap / stale 行为 | 回退 02 Step 9 / 10。 | 用时间、Query、缓存或 retry 自动升级。 |
| 需要 external exact carrier、schema、route、credential、manifest、acceptance 或 delivery事实 | 保留关联 `L2M-UP-*` pending；只定义 blocked-aware logical seam。 | 本地 shadow schema、mock 当 integration 或 tentative contract 当 ready。 |

## 8. 回填草稿

### 8.1 未来正式 §1“与上游文档的关系声明”草稿

正式 `03-详细设计.md` 的第 1 章应说明：本文承接当前正式 `00-需求文档.md` 的需求与边界、正式 `01-架构设计.md` 的 BC01~BC07 / dependency / consistency 基线、正式 `02-概要设计.md` 的 CP01~CP07 / 分层 / 对象 / 接口 / flow / state 骨架，以及 `02_hld_step_12_detailed_design_handoff.md` 的下沉清单。正文只继续展开 planned implementation unit、module、object、Port、protocol、function flow、state、persistence、error、config 与 test cut；不重新定义需求、架构、概要主体或任何 external owner truth。

正式 §1 的上游关系映射表应列出：本仓 `00/01/02`、02 Step 12、Runtime、Tools、Core、Bus、Work / Identity / Governance / Conversation / Artifact 和 sibling owner。对 host、image、Runtime mapping / handoff、Core member-specific event、credential、screening taxonomy、third subject，必须明确写为 `L2M-UP-001~008` pending：详细设计只能提供 local / blocked-aware contract，不能声明 carrier、adapter activation、integration、test evidence 或 readiness。

### 8.2 未来正式 §17“风险与待确认事项”承接草稿

正式 §17 应在 Step 18 完成后继承本文件 §7.4 中仍未关闭的输入缺口，并补充其实际影响到 module / Port / protocol / flow / state / config / test 的位置。它必须保留每项的 owner、影响和未确认前处理方式；不得把正在设计的 local contract、planned fake、local attempt 或输入阅读记录写成实施、测试、证据、验收或 readiness。

## 9. 待确认事项

- `L2M-UP-001~008` 全部保留原编号、owner、影响和 fail-closed 上限；本 Step 未关闭任何一项。
- 目标实现仓不存在仅影响真实文件与依赖事实；不阻塞 Step 2 对实现范围和非范围的收敛，也不授权创建实现仓。
- 物理 persistence、UoW、outbox carrier、config key、workload / SLO 不是可以从 README 或旧 03 继承的空白；后续 Step 必须以当前边界逐项收敛。
- 并行 sibling 的进行中材料不能成为本仓正向合同；若其后产生正式且可引用的契约，必须先做漂移审计，再决定是否重开受影响 Step。

## 10. 自检与进入下一步条件

| 检查项 | 结果 | 说明 |
|---|---|---|
| 上游关系映射完整 | pass | 已覆盖项目 00/01/02、02 Step 12 / 13、专项上游、foundation、L1 owner、siblings、规范与历史材料。 |
| 详细设计承接边界清楚 | pass | 已明确稳定骨架、本仓可下沉面、不可重答项与外部 exact contract 上限。 |
| 输入不足风险显式 | pass_with_upstream_blockers | `L2M-UP-001~008`、实现仓缺失与 physical / measurement 缺口均有影响和当前处理。 |
| 历史材料隔离 | pass | 旧 03 / README 已作逐项污染审计；CloudEvents / W3C 仅保留 Core authority 类别，不继承 member-specific shape。 |
| 不新增主语 / 对象 / 接口 / 状态 | pass | 本文件只承接 02 的稳定分母，没有新增实现契约。 |
| 不伪造事实 | pass | 未写实现、commit、run_id、测试结果、artifact、report、evidence、verdict、signoff 或 readiness。 |
| 正式正文门禁 | hold | Step 19 且用户新增授权前，正式 `03-详细设计.md` 禁止写入。 |
| Step 2 内容门禁 | pass | 上游关系、本文不再回答 / 必须回答、输入缺口、回退规则和历史污染均已明确；可创建 Step 2。 |

```text
step_01_status = completed
step_01_gate = pass_with_upstream_blockers
next_allowed_action = create_and_complete_03_ddd_step_02_scope.md
formal_03_write_allowed = false
implementation_repo_write_allowed = false
commit_required = false
```
